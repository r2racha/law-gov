/** Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง: แถบติดต่อปิดบทต้องอบอุ่น อ่านง่าย และสมดุลบนมือถือ */
import { Download, ExternalLink, MessageCircle } from "lucide-react";

// Use Line's public image URL so the QR is available from the independent GitHub Pages domain.
const lineQrUrl = "https://qr-official.line.me/gs/M_891kiemx_GW.png?oat_content=qr";
const lineAddUrl = "https://page.line.me/891kiemx";
const civilServiceCompassUrl = "https://r2racha.github.io/compass/";

export function FooterContact() {
  return (
    <section
      aria-label="ติดต่อขอสไลด์สรุปกฎหมายและค้นหาสายข้าราชการ"
      className="border-t border-[#0E8F8A]/15 bg-[#F3FAF8] px-5 py-9 lg:px-10"
    >
      <div className="mx-auto max-w-[860px] border border-[#0E8F8A]/15 bg-[#FFFDF8] p-5 shadow-[0_16px_34px_rgba(14,103,96,.08)] sm:p-7">
        <div className="grid gap-6 text-center sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:text-left">
          <div className="space-y-1">
            <p className="text-lg font-bold leading-8 text-[#1C4C49]">
              อ่านไม่ทัน! อ่านไม่ไหว...
              <span className="block text-[#0E8F8A]">Short Note ช่วยได้</span>
            </p>
            <p className="whitespace-nowrap text-[14px] font-semibold leading-6 tracking-[-.015em] text-[#2B5D59] sm:text-base sm:tracking-normal">
              สไลด์สรุปกฎหมายสอบราชการแบบเข้าใจง่าย
            </p>
            <p className="text-sm font-medium leading-6 text-[#5C6E6A]">
              สอบถามได้ที่ line id : <span className="whitespace-nowrap font-bold text-[#0E8F8A]">@891kiemx</span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 border-[#0E8F8A]/10 pt-1 sm:flex-row sm:border-l sm:pl-6">
            <a href={lineAddUrl} target="_blank" rel="noreferrer" aria-label="เปิด Line @891kiemx">
              <img
                src={lineQrUrl}
                alt="QR Code Line ID @891kiemx"
                className="h-24 w-24 border border-[#0E8F8A]/15 bg-white p-1 object-contain transition-transform duration-150 hover:scale-[1.03]"
              />
            </a>
            <div className="space-y-2 text-center">
              <span className="block text-xs font-semibold leading-5 text-[#31716B]">LINE<br />@891kiemx</span>
              <div className="flex flex-wrap justify-center gap-2">
                <a
                  href={lineAddUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0E8F8A] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#08716C] active:scale-[0.97]"
                >
                  <MessageCircle size={14} /> เปิด Line
                </a>
                <a
                  href={lineQrUrl}
                  download="line-891kiemx-qr.png"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0E8F8A]/20 bg-white px-3 py-2 text-xs font-bold text-[#0E766F] transition hover:bg-[#EAF7F4] active:scale-[0.97]"
                >
                  <Download size={14} /> บันทึก QR
                </a>
              </div>
            </div>
          </div>
        </div>

        <aside className="mt-6 flex flex-col items-center gap-3 border-t border-dashed border-[#0E8F8A]/20 bg-[#FBF8EF] px-5 py-6 text-center">
          <div className="space-y-1">
            <p className="text-xl font-bold leading-8 text-[#1C4C49]">ข้าราชการสายไหนเหมาะกับคุณ?</p>
            <p className="text-[17.5px] font-semibold leading-7 text-[#0E8F8A]">อยากรู้!!</p>
          </div>
          <a
            href={civilServiceCompassUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-[142px] items-center justify-center gap-2 rounded-full bg-[#E17A38] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(225,122,56,.2)] transition hover:bg-[#C9682E] active:scale-[0.97]"
          >
            <ExternalLink size={17} /> กดเลย
          </a>
        </aside>
      </div>
    </section>
  );
}
