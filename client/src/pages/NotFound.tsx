/** Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง: แม้หน้าที่หาไม่พบก็ต้องพากลับสู่บทเรียนด้วยสี Civic Teal กระดาษงาช้าง และพี่ราช */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Home, SearchX } from "lucide-react";
import { useLocation } from "wouter";

const logoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/ijDqypShUTEJNIeY.png";
const rachaGuideUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/bFRdTUlWHQHNLYsA.png";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FFFDF8] px-5 py-10 text-[#30443C]">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(#D5EEE7_1.1px,transparent_1.1px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#D9F0EA] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-[#F9DEC9] blur-3xl" />

      <Card className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#D4E9E2] bg-white/95 shadow-[0_20px_55px_rgba(52,103,91,0.16)]">
        <div className="h-3 bg-[#0E8F8A]" />
        <CardContent className="px-6 pb-9 pt-7 text-center sm:px-10">
          <div className="mb-5 flex items-center justify-center gap-2 text-[#0E8F8A]">
            <img src={logoUrl} alt="โลโก้กฎหมายราชการ" className="h-11 w-11 object-contain" />
            <span className="font-[Mali] text-lg font-bold">กฎหมายราชการ</span>
          </div>

          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9DEC9] text-[#9A563A]">
            <SearchX className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#E7F5F1] px-4 py-1.5 font-[Mali] text-sm font-semibold text-[#0E8F8A]">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            หยิบหนังสือผิดชั้นหรือเปล่านะ
          </p>
          <h1 className="mt-4 font-[Mali] text-3xl font-bold leading-snug text-[#30443C] sm:text-4xl">พี่ราชยังหาหน้านี้ไม่เจอ</h1>
          <p className="mx-auto mt-3 max-w-md font-[Mali] text-base leading-8 text-[#61766D]">
            ลิงก์นี้อาจพิมพ์ไม่ครบ หรือบทเรียนถูกย้ายตำแหน่งแล้ว
            <br className="hidden sm:block" />
            กลับไปหน้าแรก แล้วเลือกกฎหมายที่ต้องการอ่านอีกครั้งได้เลย
          </p>

          <img src={rachaGuideUrl} alt="พี่ราชกำลังแนะนำทางกลับไปยังบทเรียน" className="mx-auto my-1 h-36 w-auto object-contain sm:h-40" />

          <Button
            onClick={handleGoHome}
            className="rounded-full bg-[#0E8F8A] px-6 py-5 font-[Mali] text-base font-bold text-white shadow-[0_8px_20px_rgba(14,143,138,0.28)] transition-transform duration-150 hover:bg-[#087A76] active:scale-[0.97]"
          >
            <Home className="mr-2 h-4 w-4" />
            กลับไปเลือกบทเรียน
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
