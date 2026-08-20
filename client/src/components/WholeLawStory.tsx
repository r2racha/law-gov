/**
 * Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง:
 * One continuous paper-like reading box bridges detailed articles and the quiz.
 * It must be calm, scannable, and preserve legal conditions in plain Thai.
 */
import { BookOpenText, ListTree, Route } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import type { WholeLawStory as WholeLawStoryData } from "@/data/whole-stories";

type Props = { story: WholeLawStoryData; beforeId: string };

export function WholeLawStory({ story, beforeId }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const olive = story.accent === "olive";
  const colors = olive
    ? { bg: "bg-[#F6F8EE]", border: "border-[#6C8743]/20", kicker: "text-[#60752F]", heading: "text-[#3A4D31]", chip: "bg-[#ECF2DE] text-[#52682F]", rule: "border-[#86A65C]", body: "text-[#575F50]", aside: "bg-[#EEF4E9]" }
    : { bg: "bg-[#F3FAF8]", border: "border-[#0E8F8A]/20", kicker: "text-[#0E766F]", heading: "text-[#174945]", chip: "bg-[#E2F1ED] text-[#0C716B]", rule: "border-[#0E8F8A]", body: "text-[#515D58]", aside: "bg-[#EAF5F2]" };

  useEffect(() => {
    const target = document.getElementById(beforeId);
    const parent = target?.parentElement;
    if (!target || !parent) return;

    const mount = document.createElement("div");
    mount.dataset.wholeLawStory = story.id;
    parent.insertBefore(mount, target);
    setContainer(mount);
    return () => mount.remove();
  }, [beforeId, story.id]);

  if (!container) return null;

  return createPortal(
    <section id={story.id} className="scroll-mt-24 bg-[#FFFDF8] px-5 py-20 lg:px-10">
      <article className={`mx-auto max-w-[1180px] border ${colors.border} ${colors.bg} p-6 shadow-[0_18px_38px_rgba(35,77,70,.08)] sm:p-10`}>
        <header className="max-w-4xl">
          <p className={`section-kicker ${colors.kicker}`}> {story.eyebrow}</p>
          <h2 className={`mt-3 text-4xl font-semibold leading-tight ${colors.heading}`}>{story.title}</h2>
          <p className={`mt-6 max-w-3xl text-lg leading-8 ${colors.body}`}>{story.intro}</p>
        </header>
        <div className="mt-10 grid gap-8 lg:grid-cols-[210px_1fr]">
          <aside className={`h-fit border-t-4 ${colors.rule} ${colors.aside} p-5 lg:sticky lg:top-24`}>
            <p className={`flex items-center gap-2 text-sm font-bold ${colors.kicker}`}><ListTree size={17} /> แผนที่การเล่าเรื่อง</p>
            <ol className={`mt-4 space-y-2 text-sm leading-6 ${colors.body}`}>{story.sections.map((section, index) => <li key={section.title} className="flex gap-2"><span className={`font-mono text-xs font-bold ${colors.kicker}`}>{String(index + 1).padStart(2, "0")}</span><span>{section.title}</span></li>)}</ol>
          </aside>
          <div className="min-w-0">
            {story.sections.map((section, index) => <section key={section.title} className={`border-t ${index === 0 ? "border-transparent pt-0" : `${colors.border} pt-8`} ${index ? "mt-8" : ""}`}>
              <div className="flex flex-wrap items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${colors.chip}`}>{String(index + 1).padStart(2, "0")}</span><h3 className={`text-xl font-semibold leading-8 ${colors.heading}`}>{section.title}</h3><span className={`rounded-full px-3 py-1 text-xs font-bold ${colors.chip}`}>{section.articles}</span></div>
              <div className={`mt-4 space-y-4 text-[15px] leading-8 ${colors.body}`}>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>)}
            <div className={`mt-10 border-l-4 ${colors.rule} bg-white/75 px-5 py-5`}><p className={`flex items-center gap-2 text-sm font-bold ${colors.kicker}`}><BookOpenText size={18} /> สรุปให้จำก่อนทำข้อสอบ</p><p className={`mt-2 text-base leading-8 ${colors.body}`}>{story.closing}</p></div>
          </div>
        </div>
        <div className={`mt-10 flex items-center gap-2 border-t ${colors.border} pt-5 text-sm ${colors.kicker}`}><Route size={17} /> เมื่ออ่านภาพรวมแล้ว ลองกลับไปเปิดคำอธิบายรายมาตราในส่วนด้านบนเพื่อดูเงื่อนไขและถ้อยคำของแต่ละเรื่อง</div>
      </article>
    </section>,
    container,
  );
}
