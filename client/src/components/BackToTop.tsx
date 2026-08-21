/** Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง: ปุ่มช่วยนำทางต้องเห็นชัดเมื่อหน้าอ่านยาว แต่ไม่แย่งความสำคัญจากเนื้อหา */
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 420);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) return null;

  return <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="กลับขึ้นบนสุด" className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-[70] inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0E8F8A] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(14,143,138,.3)] transition hover:-translate-y-0.5 hover:bg-[#08716C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E8F8A] active:scale-[.97] sm:right-7"><ArrowUp size={18} aria-hidden="true" /><span>บนสุด</span></button>;
}
