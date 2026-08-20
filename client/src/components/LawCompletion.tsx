/** Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง: จุดปิดบทเดียวกันทุกหน้า วางหลังบทความและก่อนข้อสอบ */
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const rachaCelebrateUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/mQgfAwzMyvYmEBBQ.png";

type Props = { beforeId: string; afterStoryId: string; articleNoun: string };

export function LawCompletion({ beforeId, afterStoryId, articleNoun }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      const target = document.getElementById(beforeId);
      const parent = target?.parentElement;
      if (!target || !parent) return;
      const storyMount = parent.querySelector(`[data-whole-law-story="${afterStoryId}"]`);
      const mount = document.createElement("div");
      mount.dataset.lawCompletion = afterStoryId;
      parent.insertBefore(mount, target);
      setContainer(mount);
      if (!storyMount) return;
    });
    return () => cancelAnimationFrame(frame);
  }, [afterStoryId, beforeId]);

  if (!container) return null;

  return createPortal(
    <section className="scroll-mt-24 bg-[#FFFDF8] px-5 pb-4 pt-6 lg:px-10 lg:pb-8">
      <aside className="mx-auto max-w-[1040px] overflow-hidden border border-[#0E8F8A]/15 bg-white shadow-[0_14px_30px_rgba(38,78,72,.08)]">
        <div className="grid items-center gap-4 px-6 py-7 sm:grid-cols-[1fr_auto] sm:px-10">
          <div>
            <p className="section-kicker">เดินทางถึงปลายบท</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#174945]">อ่าน{articleNoun}สุดท้ายแล้ว<br />พี่ราชดีใจด้วยครับ</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#5B6662]">ก่อนเริ่มแบบทดสอบ ลองทวนแกนสำคัญของกฎหมายทั้งฉบับอีกครั้ง แล้วค่อยลองตอบด้วยตัวเอง</p>
          </div>
          <img src={rachaCelebrateUrl} alt="พี่ราชดีใจเมื่ออ่านตัวบทครบแล้ว" className="mx-auto h-44 w-auto object-contain sm:h-52" />
        </div>
      </aside>
    </section>,
    container,
  );
}
