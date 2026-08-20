/**
 * Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง:
 * This reusable page deliberately copies the page-1 learning rhythm: story map,
 * titled chapter opener, plain-language note, real text, recap, story, celebration, quiz.
 */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LawCompletion } from "@/components/LawCompletion";
import { WholeLawStory } from "@/components/WholeLawStory";
import type { WholeLawStory as WholeLawStoryData } from "@/data/whole-stories";
import type { LawArticle, QuizQuestion } from "@/data/law";
import { BookOpen, ChevronRight, CircleHelp, FileText, Lightbulb, Menu, Scale, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { Fragment, useMemo, useState, type CSSProperties } from "react";
import { Link } from "wouter";

const logoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/ijDqypShUTEJNIeY.png";
const rachaApproveUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/ueeHTHMpEJbnxxFV.png";
const rachaGuideUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/bFRdTUlWHQHNLYsA.png";

export type ChapterMeta = { title: string; scene: string; narrator: string; tone: string; lessonPrompt: string };
export type GenericLawConfig = {
  slug: "liability" | "official-information";
  tabLabel: string;
  headerLabel: string;
  legalTitle: string;
  heroTitle: React.ReactNode;
  heroSubtitle: string;
  heroCallout: string;
  articleNoun: string;
  articles: LawArticle[];
  quiz: QuizQuestion[];
  story: WholeLawStoryData;
  overview: readonly [string, string, string][];
  chapterMeta: Record<string, ChapterMeta>;
  primary: string;
  primaryDark: string;
  soft: string;
  hero: string;
  scene: "liability" | "information";
};

const tabs = [["/", "วิธีปฏิบัติราชการทางปกครอง"], ["/good-governance", "บริหารกิจการบ้านเมืองที่ดี"], ["/liability", "ความรับผิดทางละเมิด"], ["/official-information", "ข้อมูลข่าวสารของราชการ"]] as const;
const fallbackMeta: ChapterMeta = { title: "อ่านกติกาในส่วนนี้ให้เห็นความเชื่อมโยง", scene: "บทเรียน", narrator: "อ่านคำแปลควบคู่ตัวบทจริง เพื่อจับผู้เกี่ยวข้อง เงื่อนไข และผลตามกฎหมายให้ครบ", tone: "chapter-stone", lessonPrompt: "หยุดทวนว่าแต่ละมาตราในส่วนนี้เชื่อมกันเป็นลำดับอย่างไร ก่อนอ่านต่อ" };

export function GenericLawPage({ config }: { config: GenericLawConfig }) {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("ทั้งหมด");
  const [showLawText, setShowLawText] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [menu, setMenu] = useState(false);
  const sections = useMemo(() => Array.from(new Set(config.articles.map((article) => article.section))), [config.articles]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return config.articles.filter((article) => (activeSection === "ทั้งหมด" || article.section === activeSection) && (!normalized || [article.number, article.section, article.keyPoint, article.plainSummary, article.lawText].join(" ").toLowerCase().includes(normalized)));
  }, [activeSection, config.articles, query]);
  const groups = useMemo(() => sections.map((section) => ({ section, articles: filtered.filter((article) => article.section === section) })).filter((group) => group.articles.length), [filtered, sections]);
  const answered = Object.keys(answers).length;
  const correct = config.quiz.filter((item) => answers[item.id] === item.answerIndex).length;
  const style = { "--law-primary": config.primary, "--law-primary-dark": config.primaryDark, "--law-soft": config.soft } as CSSProperties;
  const navItems = [["ภาพรวม", "overview"], [`อ่านราย${config.articleNoun}`, "articles"], ["เล่าทั้งฉบับ", "whole-story"], ["ข้อสอบทบทวน", "quiz"]] as const;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const isLiability = config.scene === "liability";

  return <div style={style} className="law-generic min-h-screen overflow-x-hidden bg-[#FFFDF8] text-[#34322D]">
    <header className="sticky top-0 z-50 border-b border-[#173C3A]/10 bg-[#FFFDF8]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 lg:px-10">
        <button onClick={() => scrollTo("top")} className="flex items-center gap-3 text-left" aria-label="กลับไปด้านบน"><img src={logoUrl} alt="สัญลักษณ์กฎหมายฉบับเล่าเรื่อง" className="h-14 w-14 object-contain drop-shadow-sm" /><span className="leading-tight"><strong className="block text-[19px] font-semibold text-[#0E766F]">กฎหมายฉบับเล่าเรื่อง</strong><span className="hidden text-xs text-[#6C6A63] sm:block">{config.headerLabel}</span></span></button>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#53514B] md:flex">{navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)} className="transition hover:text-[#0E8F8A]">{label}</button>)}<Button onClick={() => scrollTo("quiz")} className="rounded-full bg-[#0E8F8A] px-5 font-semibold text-white hover:bg-[#08716C]">เริ่มทำข้อสอบ</Button></nav>
        <button onClick={() => setMenu((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--law-soft)] text-[var(--law-primary-dark)] md:hidden" aria-label="เปิดเมนู">{menu ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {menu && <div className="border-t border-[#173C3A]/10 bg-[#FFFDF8] px-5 py-4 md:hidden"><div className="flex flex-col gap-2 text-left">{navItems.map(([label, id]) => <button key={id} onClick={() => { scrollTo(id); setMenu(false); }} className="rounded-xl px-4 py-3 font-medium hover:bg-[var(--law-soft)]">{label}</button>)}</div></div>}
    </header>
    <div className="law-tabs"><div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 py-3 lg:px-10">{tabs.map(([path, label]) => <Link key={path} href={path}><span className={path === `/${config.slug}` ? "law-tab-active" : ""}>{label}</span></Link>)}</div></div>
    <main id="top">
      <WholeLawStory story={config.story} beforeId="quiz" />
      <LawCompletion beforeId="quiz" afterStoryId={config.story.id} articleNoun={config.articleNoun} />
      <section className="generic-hero relative isolate overflow-hidden pb-14 pt-10 lg:pb-20 lg:pt-16" style={{ background: config.hero }}>
        <div className="absolute -left-20 top-12 h-52 w-52 rounded-full bg-white/45 blur-3xl" /><div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/35 blur-3xl" />
        <div className="mx-auto grid max-w-[1440px] items-center gap-7 px-5 lg:grid-cols-[.92fr_1.08fr] lg:px-10">
          <div className="relative z-10 pb-4 lg:py-10"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0E8F8A]/20 bg-[#FFFDF8]/80 px-4 py-2 text-sm font-semibold text-[#0E766F] shadow-sm"><Sparkles size={16} /> อ่านกฎหมายแบบเห็นภาพ</div><p className="mb-3 text-sm font-semibold tracking-[.12em] text-[#9B672C]">{config.legalTitle}</p><h1 className="max-w-2xl text-[58px] font-semibold leading-[1.5] text-[#33482D]">{config.heroTitle}</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#5D6255]">{config.heroSubtitle}</p><div className="hero-callout mt-5 max-w-lg rounded-2xl bg-[#FFFDF8] px-4 py-3 shadow-sm"><p className="text-sm font-semibold text-[#0E766F]">พี่ราชชวนอ่าน</p><p className="mt-1 text-xs leading-5 text-[#5F5A52]">{config.heroCallout}</p></div><div className="mt-8 flex flex-wrap gap-3"><Button onClick={() => scrollTo("articles")} size="lg" className="rounded-full bg-[#0E8F8A] px-6 text-base font-semibold text-white hover:bg-[#08716C]">เริ่มอ่านทีละ{config.articleNoun} <ChevronRight size={18} /></Button><Button onClick={() => scrollTo("overview")} size="lg" variant="outline" className="rounded-full border-[#0E8F8A]/25 bg-[#FFFDF8]/70 px-6 text-base text-[#0E766F] hover:bg-white">ดูภาพรวมก่อน</Button></div><div className="mt-10 flex flex-wrap gap-6 border-t border-[#0E8F8A]/15 pt-5 text-sm text-[#5D6B67]"><span><strong className="mr-1 text-xl text-[#0E766F]">{config.articles.length}</strong> {config.articleNoun}ในตัวบท</span><span><strong className="mr-1 text-xl text-[#0E766F]">20</strong> ข้อสอบพร้อมเฉลย</span></div></div>
          <div className={`generic-scene generic-scene-${config.scene} relative min-h-[315px] overflow-hidden rounded-[58%_42%_45%_55%/42%_58%_42%_58%] border-[10px] border-[#FFFDF8]/80 shadow-[0_30px_60px_rgba(66,94,52,.14)] lg:min-h-[510px]`}><span className="scene-prop scene-prop-one">{isLiability ? <Scale /> : <FileText />}</span><span className="scene-prop scene-prop-two">{isLiability ? <ShieldCheck /> : <BookOpen />}</span><span className="scene-prop scene-prop-three">{isLiability ? <FileText /> : <Search />}</span><span className="scene-route scene-route-one" /><span className="scene-route scene-route-two" /><img src={rachaApproveUrl} alt={`พี่ราชประกอบบทเรียน${config.headerLabel}`} className="hero-racha-guide absolute bottom-0 right-[8%] z-10 h-[92%] w-[60%] object-contain object-bottom" /></div>
        </div>
      </section>
      <section id="overview" className="scroll-mt-24 bg-[#FFFDF8] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1180px]"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><p className="section-kicker">เริ่มจากแผนที่เรื่อง</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-[#3A4D31]">กฎหมายฉบับนี้<br />กำหนดกระบวนการอย่างไร</h2></div><p className="max-w-xl text-lg leading-8 text-[#65615A]">เนื้อหาในหน้านี้เรียบเรียงจากตัวบทที่จัดส่ง โดยแยกคำอธิบายราย{config.articleNoun} บทความเล่าทั้งฉบับ และข้อสอบทบทวนออกจากกัน</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{config.overview.map(([id, title, detail]) => <article key={id} className="relative min-h-[215px] border border-[var(--law-primary)]/10 bg-white p-6 shadow-[0_12px_30px_rgba(58,76,49,.06)]"><span className="font-mono text-xs font-bold tracking-[.18em] text-[#B77A37]">{id}</span><h3 className="mt-7 text-xl font-semibold text-[var(--law-primary-dark)]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#65615A]">{detail}</p></article>)}</div></div></section>
      <section id="articles" className="scroll-mt-24 bg-[var(--law-soft)] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1280px]"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="section-kicker">ห้องอ่านราย{config.articleNoun}</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-[var(--law-primary-dark)]">เลือกอ่านแบบที่<br />ไม่หลงในคำยาก</h2></div><div className="max-w-md rounded-2xl border border-[var(--law-primary)]/15 bg-white p-4 text-sm leading-6 text-[#5B6662]"><Lightbulb className="mb-1 inline h-4 w-4 text-[#B77A37]" /> เริ่มจากกล่อง “เล่าง่ายๆสไลต์พี่ราช” แล้วเปิดตัวบทมาตราจริงเมื่ออยากตรวจถ้อยคำ</div></div><div className="mt-10 grid gap-5 lg:grid-cols-[260px_1fr]"><aside className="lg:sticky lg:top-24 lg:h-fit"><div className="border border-[var(--law-primary)]/15 bg-[#FFFDF8] p-4 shadow-sm"><p className="mb-3 text-sm font-semibold text-[var(--law-primary-dark)]">เลือกหมวด</p><div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">{["ทั้งหมด", ...sections].map((section) => { const meta = config.chapterMeta[section] ?? fallbackMeta; return <button key={section} onClick={() => setActiveSection(section)} className={`border-l-4 px-3 py-2 text-left text-sm font-medium transition lg:w-full lg:whitespace-normal ${activeSection === section ? "border-[var(--law-primary)] bg-white text-[var(--law-primary-dark)]" : "border-transparent text-[#666158] hover:bg-[#F6F0E8]"}`}>{section === "ทั้งหมด" ? section : `${section} · ${meta.title}`}</button>; })}</div></div><div className="mt-5 border-l-4 border-[#D4A95F] bg-[#FFF6E6] p-4 text-sm leading-6 text-[#785E32]"><strong className="block text-[#9C7134]">วิธีเดินบทเรียน</strong>เลือกหมวด → เปิดคำอธิบาย → ค่อยตรวจตัวบทจริง</div></aside><div><label className="flex items-center gap-3 border border-[var(--law-primary)]/15 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#0E8F8A]/30"><Search size={19} className="text-[#0E8F8A]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-[#A39F95]" placeholder={`ค้นหา${config.articleNoun} คำสำคัญ หรือคำอธิบาย…`} /></label><p className="mt-4 text-sm text-[#66736F]">พบ <strong className="text-[#0E766F]">{filtered.length}</strong> {config.articleNoun}</p><div className="mt-6 space-y-12">{groups.map((group, chapterIndex) => { const meta = config.chapterMeta[group.section] ?? fallbackMeta; return <section key={group.section} className="relative scroll-mt-28"><div className={`chapter-spread ${meta.tone}`}><div className="relative z-10 max-w-xl"><p className="chapter-scene">บทที่ {String(chapterIndex + 1).padStart(2, "0")} · {meta.scene}</p><h3>{meta.title}</h3><p className="chapter-narrator"><span>พี่ราชบอก</span>{meta.narrator}</p></div><img src={rachaApproveUrl} alt={`พี่ราชแนะนำ ${meta.title}`} className="chapter-mascot" /><span className="chapter-count">{group.articles.length}<small>{config.articleNoun}</small></span></div><Accordion type="multiple" className="article-route mt-5 space-y-3">{group.articles.map((article, index) => <Fragment key={article.number}><ArticleCard article={article} articleNoun={config.articleNoun} show={!!showLawText[article.number]} onToggle={() => setShowLawText((current) => ({ ...current, [article.number]: !current[article.number] }))} />{index < group.articles.length - 1 && (index + 1) % 8 === 0 && <aside className="article-interlude"><div><span>จุดพักบทเรียน · พี่ราชชวนทวน</span><p>{meta.lessonPrompt}</p></div><img src={rachaGuideUrl} alt="พี่ราชชวนทวนบทเรียน" /></aside>}</Fragment>)}</Accordion></section>; })}</div>{!filtered.length && <div className="mt-4 border border-dashed border-[var(--law-primary)]/30 bg-white px-6 py-12 text-center text-[#6B7068]"><CircleHelp className="mx-auto mb-3 text-[var(--law-primary)]" />ไม่พบ{config.articleNoun}ที่ตรงกับคำค้น ลองใช้คำสั้นลงหรือเลือก “ทั้งหมด”</div>}</div></div></div></section>
      <section id="quiz" className="scroll-mt-24 bg-[#FFF8EA] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1180px]"><div><p className="section-kicker">ข้อสอบทบทวน</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-[#4D4A32]">ลองตอบก่อน<br />แล้วค่อยดูเหตุผล</h2><p className="mt-5 text-lg leading-8 text-[#6C6650]">แบบทดสอบ 20 ข้อ</p><div className="mt-7 max-w-2xl border border-[#E6D5A9] bg-[#FFFDF8] p-5"><div className="flex justify-between text-sm font-semibold text-[#806E40]"><span>ความคืบหน้า</span><span>{answered} / {config.quiz.length} ข้อ</span></div><Progress value={(answered / config.quiz.length) * 100} className="mt-3 h-3 bg-[#F2E7CA] [&>div]:bg-[#0E8F8A]" />{answered === config.quiz.length && <p className="mt-4 text-sm leading-6 text-[#566048]">ทำครบแล้ว: ตอบถูก <strong className="text-[#0E766F]">{correct}</strong> จาก {config.quiz.length} ข้อ <button onClick={() => setAnswers({})} className="ml-2 font-bold text-[#0E766F] underline">เริ่มใหม่</button></p>}</div></div><div className="mt-12 grid gap-5 md:grid-cols-2">{config.quiz.map((question) => <QuizCard key={question.id} question={question} selected={answers[question.id]} onAnswer={(choice) => setAnswers((current) => ({ ...current, [question.id]: choice }))} />)}</div></div></section>
    </main>
    <footer className="bg-[#123B38] px-5 py-6 text-center leading-6 text-[#D7EFEB]"><strong className="block text-base font-semibold">ทางมุ่งสู่ราชการ</strong><span className="text-xs tracking-[.14em] text-[#9FD8D1]">Road to Kharachakar</span></footer>
  </div>;
}

function ArticleCard({ article, articleNoun, show, onToggle }: { article: LawArticle; articleNoun: string; show: boolean; onToggle: () => void }) {
  const repealed = article.lawText.includes("(ยกเลิก)");
  return <AccordionItem value={`article-${article.number}`} className="lesson-card border border-[#0E8F8A]/12 bg-[#FFFDF8] px-0 shadow-[0_8px_18px_rgba(38,78,72,.04)]"><AccordionTrigger className="items-start gap-5 px-5 py-5 text-left hover:no-underline"><span className="article-ribbon generic-ribbon"><em>{articleNoun}</em><b>{article.number}</b></span><span className="min-w-0 flex-1"><span className="mb-2 flex flex-wrap gap-2"><span className="rounded-full bg-[var(--law-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--law-primary-dark)]">{article.section}</span>{repealed && <span className="rounded-full bg-[#F0ECE5] px-2.5 py-1 text-[11px] font-bold text-[#70685E]">ถูกยกเลิก</span>}</span><span className="block text-base font-semibold leading-7 text-[#234743]">{article.keyPoint}</span></span></AccordionTrigger><AccordionContent className="px-5 pb-6"><div className="grid gap-5 border-t border-[#0E8F8A]/10 pt-6 lg:grid-cols-[1.6fr_.9fr]"><div className="postit-note generic-postit"><p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0E766F]"><Sparkles size={16} /> แปลแบบพี่ราช</p><p className="text-[15px] leading-8 text-[#4D504B]">{article.plainSummary}</p></div><div className="memory-cue generic-memory"><p><strong>จำไว้</strong>{article.keyPoint}</p></div></div><div className="mt-5"><button onClick={onToggle} className="inline-flex items-center gap-2 border-b border-[#0E8F8A]/40 pb-1 text-sm font-bold text-[#0E766F] hover:text-[#075F5A]"><FileText size={16} /> {show ? "ซ่อนตัวบทจริง" : "เปิดตัวบทจริงจากไฟล์ต้นฉบับ"}</button>{show && <div className="mt-4 max-h-[460px] overflow-y-auto border border-[#DBCDBE] bg-[#FBF7F0] p-5 font-serif text-[15px] leading-8 text-[#49443C]">{article.lawText.split("\n").filter(Boolean).map((line, index) => <p key={`${article.number}-${index}`} className={line.trim().startsWith("(") ? "pl-4" : ""}>{line}</p>)}</div>}</div></AccordionContent></AccordionItem>;
}

function QuizCard({ question, selected, onAnswer }: { question: QuizQuestion; selected: number | undefined; onAnswer: (choice: number) => void }) {
  const done = selected !== undefined;
  return <article className="border border-[#E4D7B7] bg-[#FFFDF8] p-5 shadow-[0_10px_22px_rgba(80,73,43,.06)]"><span className="rounded-full bg-[#F8E7C9] px-3 py-1 text-xs font-bold text-[#967139]">ข้อ {question.id}</span><h3 className="mt-4 text-base font-semibold leading-7 text-[#4E4937]">{question.question}</h3><div className="mt-4 space-y-2">{question.choices.map((choice, index) => { const right = index === question.answerIndex; const selectedHere = selected === index; const state = done ? (right ? "border-[#82A874] bg-[#F0F7EB] text-[#456C3C]" : selectedHere ? "border-[#E49B8C] bg-[#FFF0ED] text-[#AA4C3C]" : "border-[#EADFD1] text-[#7D7469]") : "border-[#EADFD1] text-[#665F56] hover:border-[#0E8F8A] hover:bg-[#F0F8F6]"; return <button key={choice} disabled={done} onClick={() => onAnswer(index)} className={`flex w-full items-start gap-3 border px-3 py-2.5 text-left text-sm leading-6 transition disabled:cursor-default ${state}`}><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px] font-bold">{String.fromCharCode(65 + index)}</span>{choice}</button>; })}</div>{done && <div className={`mt-4 border-l-4 px-4 py-3 text-sm leading-6 ${selected === question.answerIndex ? "border-[#6E9D69] bg-[#F1F8ED] text-[#406744]" : "border-[#E17A38] bg-[#FFF4E8] text-[#865735]"}`}><strong>{selected === question.answerIndex ? "ถูกต้อง" : "เฉลย"}</strong><p>{question.explanation}</p></div>}</article>;
}
