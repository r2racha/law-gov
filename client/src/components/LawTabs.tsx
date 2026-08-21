/**
 * Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง:
 * The tab rail uses Civic Teal wayfinding and makes horizontal discovery explicit on phones.
 */
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

const laws = [
  ["/", "วิธีปฏิบัติราชการทางปกครอง"],
  ["/good-governance", "บริหารกิจการบ้านเมืองที่ดี"],
  ["/liability", "ความรับผิดทางละเมิด"],
  ["/official-information", "ข้อมูลข่าวสารของราชการ"],
  ["/secrecy", "การรักษาความลับของทางราชการ"],
] as const;

export function LawTabs({ activePath }: { activePath: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const updateCue = () => setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 8);
    updateCue();
    rail.addEventListener("scroll", updateCue, { passive: true });
    window.addEventListener("resize", updateCue);
    return () => {
      rail.removeEventListener("scroll", updateCue);
      window.removeEventListener("resize", updateCue);
    };
  }, []);

  return <div className="law-tabs">
    <div ref={railRef} className="law-tabs-viewport mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 py-3 lg:px-10" aria-label="เลือกกฎหมาย">
      {laws.map(([path, label]) => <Link key={path} href={path}><span className={path === activePath ? "law-tab-active" : ""}>{label}</span></Link>)}
    </div>
    <div className={`law-tabs-scroll-cue ${canScrollRight ? "" : "law-tabs-scroll-cue-hidden"}`} aria-hidden="true"><span>เลื่อนดูต่อ</span><ChevronRight size={18} /></div>
  </div>;
}
