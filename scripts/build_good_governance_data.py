#!/usr/bin/env python3
"""Build verified teaching data for the Good Governance Administration Decree.

The script preserves the consolidated legal text and asks the LLM only for concise
plain-language summaries and exam questions that cite a source article.
"""

import json
import os
import re
import shutil
from pathlib import Path

from openai import OpenAI


ROOT = Path("/home/ubuntu/law-reading-platform")
SOURCE = Path("/home/ubuntu/upload/infocenter.oic.go.th_FILEWEB_CABINFOCENTER9_DRAWER041_GENERAL_DATA0010_00010285.PDF_1787227892935.md")
TARGET_SOURCE = ROOT / "client/src/data/good-governance-source.md"
TARGET_DATA = ROOT / "client/src/data/good-governance.ts"
WORK = ROOT / "legal/admin-good-governance"

THAI_DIGITS = str.maketrans("๐๑๒๓๔๕๖๗๘๙", "0123456789")
CLIENT = OpenAI()


def to_arabic(value: str) -> str:
    return value.translate(THAI_DIGITS)


def clean_text(text: str) -> str:
    text = re.sub(r"\n\s*\n", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*", "\n", text)
    text = re.sub(r"\n[๑๒๓๔๕๖๗๘๙]+\s+มาตรา", "\nมาตรา", text)
    return text.strip()


def parse_articles(source: str):
    pattern = re.compile(r"(?m)^มาตรา\s+([๐-๙]+)(?=\s|$)")
    matches = list(pattern.finditer(source))
    articles = []
    section_matches = list(re.finditer(r"(?m)^หมวด\s+([๐-๙]+)\s*\n?([^\n]*)", source))

    for index, match in enumerate(matches):
        digits = to_arabic(match.group(1))
        number = int(digits)
        # Consolidated text has single-digit footnote markers adjacent to repealed article numbers.
        if number > 53 and len(digits) > 1 and int(digits[:-1]) <= 53:
            digits = digits[:-1]
            number = int(digits)
        if number < 1 or number > 53:
            continue
        end = matches[index + 1].start() if index + 1 < len(matches) else len(source)
        raw = source[match.start():end]
        raw = re.sub(rf"^มาตรา\s+{re.escape(match.group(1))}", f"มาตรา {digits}", raw)
        raw = clean_text(raw)
        if any(item["number"] == str(number) for item in articles):
            continue
        nearby_sections = [s for s in section_matches if s.start() < match.start()]
        if nearby_sections:
            section_match = nearby_sections[-1]
            title = clean_text(section_match.group(2)).replace("\n", " ")
            section = f"หมวด {to_arabic(section_match.group(1))} {title}".strip()
        else:
            section = "บททั่วไป"
        articles.append({"number": str(number), "section": section, "lawText": raw})
    return articles


def llm_json(system: str, user: str, schema: dict):
    response = CLIENT.chat.completions.create(
        model="gpt-5-mini",
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        response_format={"type": "json_schema", "json_schema": {"name": "legal_lesson", "strict": True, "schema": schema}},
        max_completion_tokens=5000,
    )
    if not response.choices:
        WORK.joinpath("llm_response_debug.json").write_text(response.model_dump_json(indent=2), encoding="utf-8")
        raise RuntimeError("LLM returned no choices; inspect llm_response_debug.json")
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("LLM returned an empty response")
    return json.loads(content)


def summarize_articles(articles):
    schema = {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "number": {"type": "string"},
                        "plainSummary": {"type": "string"},
                        "keyPoint": {"type": "string"},
                    },
                    "required": ["number", "plainSummary", "keyPoint"],
                    "additionalProperties": False,
                },
            }
        },
        "required": ["items"],
        "additionalProperties": False,
    }
    notes = {}
    for start in range(0, len(articles), 6):
        group = articles[start:start + 6]
        payload = "\n\n".join(f"[มาตรา {a['number']}]\n{a['lawText']}" for a in group)
        result = llm_json(
            "คุณเป็นผู้ช่วยจัดทำสื่อเรียนกฎหมายไทยที่แม่นยำ สรุปได้เฉพาะข้อเท็จจริงที่อยู่ในข้อความต้นทาง ห้ามเติมข้อยกเว้น ระยะเวลา หน่วยงาน หรือผลทางกฎหมายที่ไม่มีในต้นทาง ถ้าข้อความระบุว่า ‘ยกเลิก’ ให้สรุปเพียงว่ามาตรานี้ถูกยกเลิก ใช้ภาษาไทยง่าย กระชับ และไม่ให้คำปรึกษารายกรณี",
            "สรุปแต่ละมาตราด้านล่างเป็นภาษาชาวบ้าน 1–2 ประโยค และเขียน keyPoint สำหรับจำไม่เกิน 12 คำ ต้องคืนทุกมาตราและเลขมาตราต้องตรงกับต้นทาง\n\n" + payload,
            schema,
        )
        for item in result["items"]:
            notes[item["number"]] = {"plainSummary": item["plainSummary"], "keyPoint": item["keyPoint"]}
    missing = [a["number"] for a in articles if a["number"] not in notes]
    if missing:
        raise RuntimeError(f"Missing summaries for articles: {missing}")
    return notes


def create_quiz(articles):
    schema = {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "category": {"type": "string", "enum": ["error", "accuracy", "analysis", "scenario"]},
                        "articleRef": {"type": "string"},
                        "question": {"type": "string"},
                        "choices": {"type": "array", "items": {"type": "string"}},
                        "answerIndex": {"type": "integer"},
                        "explanation": {"type": "string"},
                    },
                    "required": ["id", "category", "articleRef", "question", "choices", "answerIndex", "explanation"],
                    "additionalProperties": False,
                },
            }
        },
        "required": ["items"],
        "additionalProperties": False,
    }
    payload = "\n\n".join(f"[มาตรา {a['number']}]\n{a['lawText']}" for a in articles)
    result = llm_json(
        "คุณเป็นผู้ออกข้อสอบกฎหมายไทย ใช้ข้อความต้นทางเท่านั้น ห้ามแต่งข้อเท็จจริง กำหนดวัน หน่วยงาน หรือข้อยกเว้นนอกต้นทาง ทุกข้อมีคำตอบถูกเพียงข้อเดียวและเฉลยต้องอ้างบทความที่ให้มา",
        "สร้างข้อสอบปรนัย 20 ข้อจากกฎหมายด้านล่าง โดยทำ error 5 ข้อ, accuracy 5 ข้อ, analysis 5 ข้อ, scenario 5 ข้อ ข้อความคำถามห้ามนำหน้าด้วยชื่อหมวดหรือคำว่า error/วิเคราะห์/สถานการณ์ รายการ choices ต้องมี 4 ตัวเลือก และ answerIndex เริ่มที่ 0 articleRef ให้เป็น ‘มาตรา X’ หรือ ‘มาตรา X และ Y’ เท่านั้น\n\n" + payload,
        schema,
    )
    items = result["items"]
    if len(items) != 20 or any(len(item["choices"]) != 4 for item in items):
        raise RuntimeError("Quiz validation failed")
    items.sort(key=lambda item: item["id"])
    for expected, item in enumerate(items, start=1):
        item["id"] = expected
    return items


def write_typescript(articles, notes, quiz):
    enriched = []
    for article in articles:
        note = notes[article["number"]]
        enriched.append({**article, **note})
    payload_articles = json.dumps(enriched, ensure_ascii=False, indent=2)
    payload_quiz = json.dumps(quiz, ensure_ascii=False, indent=2)
    content = f'''/**
 * Legal source note — consolidated text of the Good Governance Administration Decree.
 * Source version: base decree B.E. 2546 as amended by No. 2 B.E. 2562.
 * Verified source record: legal/admin-good-governance/version_manifest.json
 */
import type {{ LawArticle, QuizQuestion }} from "./law";

export const goodGovernanceArticles: LawArticle[] = {payload_articles};

export const goodGovernanceQuiz: QuizQuestion[] = {payload_quiz};
'''
    TARGET_DATA.write_text(content, encoding="utf-8")


def main():
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    shutil.copyfile(SOURCE, TARGET_SOURCE)
    raw = SOURCE.read_text(encoding="utf-8")
    articles = parse_articles(raw)
    expected = {str(i) for i in range(1, 54)}
    actual = {article["number"] for article in articles}
    if actual != expected:
        raise RuntimeError(f"Article parsing failed. Missing={sorted(expected - actual)} Extra={sorted(actual - expected)}")
    notes = summarize_articles(articles)
    quiz = create_quiz(articles)
    write_typescript(articles, notes, quiz)
    WORK.joinpath("content_build_report.json").write_text(json.dumps({"article_count": len(articles), "quiz_count": len(quiz), "model": "gpt-5-mini"}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {len(articles)} articles and {len(quiz)} quiz questions")


if __name__ == "__main__":
    main()
