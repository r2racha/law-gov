/**
 * Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง:
 * This is a single uninterrupted long-form story box. Do not add chapter maps,
 * lists, numbered parts, or modular cards inside this component.
 */
import { BookOpenText, ListTree } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import type { WholeLawStory as WholeLawStoryData } from "@/data/whole-stories";

type Props = { story: WholeLawStoryData; beforeId: string };

export function WholeLawStory({ story, beforeId }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const olive = story.accent === "olive";
  const colors = olive
    ? { bg: "bg-[#F6F8EE]", border: "border-[#6C8743]/20", kicker: "text-[#60752F]", heading: "text-[#3A4D31]", rule: "border-[#86A65C]", body: "text-[#525B4D]" }
    : { bg: "bg-[#F3FAF8]", border: "border-[#0E8F8A]/20", kicker: "text-[#0E766F]", heading: "text-[#174945]", rule: "border-[#0E8F8A]", body: "text-[#4C5955]" };

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

  const scrollToPoint = (index: number) => document.getElementById(`${story.id}-point-${index + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return createPortal(
    <section id={story.id} className="scroll-mt-24 bg-[#FFFDF8] px-5 py-20 lg:px-10">
      <article className={`mx-auto max-w-[1040px] border ${colors.border} ${colors.bg} px-6 py-9 shadow-[0_18px_38px_rgba(35,77,70,.08)] sm:px-10 sm:py-12`}>
        <p className={`section-kicker ${colors.kicker}`}>{story.eyebrow}</p>
        <h2 className={`mt-3 max-w-4xl text-[clamp(1.4rem,6.4vw,2.25rem)] font-semibold leading-[1.36] tracking-[-0.018em] sm:text-4xl sm:leading-tight ${colors.heading}`}>{story.title}</h2>
        <nav aria-label="สารบัญย่อของเรื่องเล่ากฎหมาย" className="mt-7 border-y border-current/10 py-4">
          <div className={`mb-3 flex items-center gap-2 text-sm font-bold ${colors.kicker}`}><ListTree size={17} /> สารบัญย่อ · กดไปยังประเด็นสำคัญ</div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible">
            {story.toc.map((label, index) => <button key={label} type="button" onClick={() => scrollToPoint(index)} className={`shrink-0 rounded-full border ${colors.border} bg-white/75 px-3 py-2 text-left text-xs font-semibold leading-5 ${colors.kicker} transition hover:bg-white hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8F8A] active:scale-[0.97]`}>{index + 1}. {label}</button>)}
          </div>
        </nav>
        <div className={`mt-8 space-y-6 border-t-4 ${colors.rule} pt-8 text-[16px] leading-9 ${colors.body}`}>
          {story.paragraphs.map((paragraph, index) => <p id={`${story.id}-point-${index + 1}`} key={paragraph} className="scroll-mt-28">{paragraph}</p>)}
        </div>
        <div className={`mt-10 border-l-4 ${colors.rule} bg-white/75 px-5 py-5`}><p className={`flex items-center gap-2 text-sm font-bold ${colors.kicker}`}><BookOpenText size={18} /> สรุปให้จำก่อนทำข้อสอบ</p><p className={`mt-2 text-base leading-8 ${colors.body}`}>{story.closing}</p></div>
      </article>
    </section>,
    container,
  );
}
