/**
 * Design reminder — ห้องเรียนพาสเทลแบบเล่าเรื่อง:
 * An asymmetric reading journey with P' Racha, Civic Teal wayfinding, paper-like layers,
 * and one helpful learning action per view. Text must always remain easy to read.
 */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronRight, CircleHelp, Clock3, FileText, Lightbulb, Menu, Scale, Search, Sparkles, X } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { lawArticles, overviewSteps, quizQuestions } from "@/data/law";
import { WholeLawStory } from "@/components/WholeLawStory";
import { LawCompletion } from "@/components/LawCompletion";
import { BackToTop } from "@/components/BackToTop";
import { FooterContact } from "@/components/FooterContact";
import { LawTabs } from "@/components/LawTabs";
import { adminProcedureWholeStory } from "@/data/whole-stories";

const logoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/ijDqypShUTEJNIeY.png";
const rachaApproveUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/DGIzWzWVkMogpIuZ.png";
const rachaGuideUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/QsjUVVBxSAqoeGoo.png";
const rachaCelebrateUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663866287321/MuWYerhTfkTxCdOV.png";

const sectionColors: Record<string, string> = {
  "บททั่วไป": "bg-[#FDE6CB] text-[#8A4F18]",
  "หมวด 1": "bg-[#DCEBE8] text-[#176661]",
  "หมวด 2": "bg-[#DDEAF6] text-[#255E88]",
  "หมวด 2/1": "bg-[#FFE3D0] text-[#9A4E19]",
  "หมวด 3": "bg-[#E2EDDA] text-[#4E6D3E]",
  "หมวด 4": "bg-[#F1E1EC] text-[#805168]",
  "หมวด 5": "bg-[#E9E6F9] text-[#5F508F]",
  "บทเฉพาะกาล": "bg-[#EEE8DF] text-[#675E52]",
};

const chapterMeta: Record<string, { title: string; scene: string; narrator: string; tone: string }> = {
  "บททั่วไป": { title: "กติกากลางก่อนเริ่มใช้อำนาจ", scene: "ฉากเปิดเรื่อง", narrator: "เริ่มด้วยการรู้ขอบเขต: กฎหมายนี้ช่วยกำกับงานทางปกครองส่วนใด และส่วนใดไม่อยู่ในสนามนี้", tone: "chapter-sand" },
  "หมวด 1": { title: "ผู้คุมเข็มทิศความเป็นธรรม", scene: "โต๊ะคณะกรรมการ", narrator: "คณะกรรมการชุดนี้มีบทบาทคอยแนะนำและยกระดับมาตรฐานการทำงาน ไม่ใช่ผู้ตัดสินทุกเรื่องแทนเจ้าหน้าที่", tone: "chapter-teal" },
  "หมวด 2": { title: "เมื่อรัฐจะออกคำสั่งกับเรา", scene: "ห้องเรียนหลัก", narrator: "จำลำดับนี้ไว้: คนทำต้องมีอำนาจ เป็นกลาง ฟังข้อมูลให้ครบ แล้วบอกเหตุผลให้ตรวจสอบได้", tone: "chapter-sky" },
  "หมวด 2/1": { title: "เมื่อคำสั่งต้องเดินต่อถึงการบังคับ", scene: "ทางแยกการบังคับ", narrator: "คำว่า ‘บังคับ’ ไม่ได้แปลว่าใช้ได้เต็มแรงเสมอไป กฎหมายกำหนดทั้งขั้นเตือน เวลา และขอบเขตผลกระทบไว้", tone: "chapter-apricot" },
  "หมวด 3": { title: "เวลาเป็นส่วนหนึ่งของความเป็นธรรม", scene: "นาฬิกาในมือ", narrator: "อย่าลืมดูวันแรก วันสุดท้าย และวันหยุด เพราะกติกาการนับเวลามีผลต่อสิทธิและหน้าที่", tone: "chapter-sage" },
  "หมวด 4": { title: "ส่งให้ถึง จึงเริ่มมีผล", scene: "เส้นทางแจ้งข่าว", narrator: "การแจ้งไม่ใช่เรื่องพิธีการอย่างเดียว วิธีและเวลาที่ถือว่าได้รับแจ้งมีผลต่อการเริ่มนับสิทธิหลายอย่าง", tone: "chapter-blush" },
  "หมวด 5": { title: "ห้องประชุมที่มีเสียงทุกเสียง", scene: "โต๊ะลงมติ", narrator: "บทนี้ชวนดูว่าคณะกรรมการประชุมอย่างไร ใครทำหน้าที่แทน และมติหรือความเห็นแย้งถูกบันทึกไว้แบบใด", tone: "chapter-lilac" },
  "บทเฉพาะกาล": { title: "สะพานเชื่อมกติกาเดิมกับกฎหมายใหม่", scene: "บทส่งท้าย", narrator: "บทเฉพาะกาลบอกวิธีจัดการคำขอและกติกาที่มีอยู่เดิมในช่วงเปลี่ยนผ่านของกฎหมาย", tone: "chapter-stone" },
};

const lessonBreakPrompts: Record<string, string> = {
  "บททั่วไป": "ลองหยุดดูว่าเรื่องที่อ่านอยู่ อยู่ในขอบเขตของกฎหมายนี้หรือเป็นงานที่มีข้อยกเว้น",
  "หมวด 1": "ทวนบทบาทของคณะกรรมการก่อน แล้วค่อยเดินต่อไปยังขั้นตอนของคำสั่งทางปกครอง",
  "หมวด 2": "ก่อนอ่านต่อ ลองจำแกนสามคำ: อำนาจ · ความเป็นกลาง · การรับฟัง",
  "หมวด 2/1": "การบังคับที่ดีไม่ใช่การใช้แรงที่สุด แต่เป็นการเลือกวิธีที่จำเป็นและกระทบน้อยที่สุด",
  "หมวด 3": "ลองหยิบปฏิทินขึ้นมานึกตาม: วันแรก วันสุดท้าย และวันหยุด ล้วนทำให้ผลต่างกัน",
  "หมวด 4": "เมื่อเจอข้อสอบเรื่องการแจ้ง ให้ดูทั้ง ‘วิธีส่ง’ และ ‘วันที่ถือว่าได้รับ’ เสมอ",
  "หมวด 5": "ลองสรุปด้วยตัวเองว่าองค์ประชุม มติ และรายงานการประชุมเชื่อมกันอย่างไร",
  "บทเฉพาะกาล": "บทส่งท้ายนี้ช่วยเชื่อมกติกาเดิมกับการเริ่มใช้กฎหมายในช่วงเปลี่ยนผ่าน",
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("ทั้งหมด");
  const [showLawText, setShowLawText] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = useMemo(() => Array.from(new Set(lawArticles.map((article) => article.section))), []);
  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return lawArticles.filter((article) => {
      const inSection = activeSection === "ทั้งหมด" || article.section === activeSection;
      const inQuery = !normalized || [article.number, article.lawText, article.plainSummary, article.keyPoint].join(" ").toLowerCase().includes(normalized);
      return inSection && inQuery;
    });
  }, [activeSection, query]);
  const groupedArticles = useMemo(
    () => sections.map((section) => ({ section, articles: filteredArticles.filter((article) => article.section === section) })).filter((group) => group.articles.length > 0),
    [filteredArticles, sections],
  );

  const answered = Object.keys(answers).length;
  const correct = quizQuestions.filter((question) => answers[question.id] === question.answerIndex).length;
  const quizProgress = (answered / quizQuestions.length) * 100;

  const navItems = [
    ["ภาพรวม", "overview"],
    ["อ่านรายมาตรา", "articles"],
    ["เล่าทั้งฉบับ", "whole-story"],
    ["ข้อสอบทบทวน", "quiz"],
  ] as const;
  const sectionAnchor = (section: string) => `chapter-home-${encodeURIComponent(section)}`;
  const selectSection = (section: string) => {
    setActiveSection(section);
    setQuery("");
    requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(section === "ทั้งหมด" ? "articles" : sectionAnchor(section))));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFFDF8] text-[#34322D]">
      <header className="sticky top-0 z-50 border-b border-[#173C3A]/10 bg-[#FFFDF8]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 lg:px-10">
          <button onClick={() => scrollTo("top")} className="flex items-center gap-3 text-left" aria-label="กลับไปด้านบน">
            <img src={logoUrl} alt="สัญลักษณ์กฎหมายฉบับเล่าเรื่อง" className="h-14 w-14 object-contain drop-shadow-sm" />
            <span className="leading-tight">
              <strong className="block text-[19px] font-semibold text-[#0E625E]">กฎหมายราชการ</strong>
              <span className="hidden text-xs text-[#6C6A63] sm:block">วิธีปฏิบัติราชการทางปกครอง</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 md:flex" aria-label="เมนูหลัก">
            {navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)} className="text-sm font-medium text-[#53514B] transition hover:text-[#0E8F8A]">{label}</button>)}
            <Button onClick={() => scrollTo("quiz")} className="rounded-full bg-[#0E8F8A] px-5 font-semibold text-white shadow-[0_9px_20px_rgba(14,143,138,.18)] hover:bg-[#08716C]">เริ่มทำข้อสอบ</Button>
          </nav>
          <button onClick={() => setMobileMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-full bg-[#E7F2EF] text-[#0E625E] md:hidden" aria-label="เปิดเมนู">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && <div className="border-t border-[#173C3A]/10 bg-[#FFFDF8] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">{navItems.map(([label, id]) => <button key={id} onClick={() => { scrollTo(id); setMobileMenuOpen(false); }} className="rounded-xl px-4 py-3 text-left font-medium hover:bg-[#E7F2EF]">{label}</button>)}</div>
        </div>}
      </header>
      <LawTabs activePath="/" />

      <BackToTop />
      <main id="top">
        <WholeLawStory story={adminProcedureWholeStory} beforeId="quiz" />
        <LawCompletion beforeId="quiz" afterStoryId={adminProcedureWholeStory.id} articleNoun="มาตรา" />
        <section className="relative isolate overflow-hidden bg-[#E9F5F1] pb-14 pt-10 lg:pb-20 lg:pt-16">
          <div className="absolute -left-20 top-12 h-52 w-52 rounded-full bg-[#F9D7B5]/50 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#BDE0D9]/60 blur-3xl" />
          <div className="mx-auto grid max-w-[1440px] items-center gap-7 px-5 lg:grid-cols-[.92fr_1.08fr] lg:px-10">
            <div className="relative z-10 pb-4 lg:py-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0E8F8A]/20 bg-[#FFFDF8]/80 px-4 py-2 text-sm font-semibold text-[#0E766F] shadow-sm"><Sparkles size={16} /> อ่านกฎหมายแบบเห็นภาพ</div>
              <p className="mb-3 text-sm font-semibold tracking-[.12em] text-[#B56222]">พ.ร.บ. วิธีปฏิบัติราชการทางปกครอง พ.ศ. 2539</p>
              <h1 className="hero-main-title max-w-2xl text-[58px] font-semibold leading-[1.5] text-[#183D3A]">ตัวบทจริง<br /><span className="text-[#0E8F8A]">เล่าให้เข้าใจ</span><br className="sm:hidden" /> <span className="whitespace-nowrap">ทีละมาตรา</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#595750]">จากเอกสารกฎหมายสู่เส้นทางเรียนรู้ที่ง่ายขึ้น</p>
              <div className="hero-callout mt-5 max-w-lg rounded-2xl bg-[#FFFDF8] px-4 py-3 shadow-sm"><p className="text-sm font-semibold text-[#0E625E]">พี่ราชชวนอ่าน</p><p className="mt-1 text-xs leading-5 text-[#5F5A52]">เปิดคำอธิบายก่อน แล้วกดดูตัวบทมาตราจริงได้ทุกมาตรา</p></div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={() => scrollTo("articles")} size="lg" className="rounded-full bg-[#0E8F8A] px-6 text-base font-semibold text-white shadow-[0_12px_24px_rgba(14,143,138,.2)] hover:bg-[#08716C]">เริ่มอ่านทีละมาตรา <ChevronRight size={18} /></Button>
                <Button onClick={() => scrollTo("overview")} size="lg" variant="outline" className="rounded-full border-[#0E8F8A]/25 bg-[#FFFDF8]/70 px-6 text-base text-[#0E625E] hover:bg-white">ดูภาพรวมก่อน</Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 border-t border-[#0E8F8A]/15 pt-5 text-sm text-[#5D6B67]">
                <span><strong className="mr-1 text-xl text-[#0E625E]">{lawArticles.length}</strong> มาตราในไฟล์ต้นฉบับ</span>
                <span><strong className="mr-1 text-xl text-[#0E625E]">20</strong> ข้อสอบพร้อมเฉลย</span>
              </div>
            </div>
            <div className="hero-stage hero-procedure-scene relative min-h-[315px] overflow-hidden rounded-[38%_62%_44%_56%/45%_38%_62%_55%] border-[10px] border-[#FFFDF8]/80 shadow-[0_30px_60px_rgba(26,75,71,.14)] lg:min-h-[510px]">
              <span className="hero-window hero-window-one" /><span className="hero-window hero-window-two" /><span className="hero-desk" /><span className="hero-document hero-document-one" /><span className="hero-document hero-document-two" /><span className="hero-symbol hero-symbol-scale"><Scale aria-hidden="true" /></span><span className="hero-symbol hero-symbol-clock"><Clock3 aria-hidden="true" /></span><img src={rachaGuideUrl} alt="พี่ราชชี้แนะกระบวนการทางปกครองที่เป็นธรรม" className="hero-racha-guide absolute bottom-0 right-[7%] z-10 h-[92%] w-[60%] object-contain object-bottom" />
            </div>
          </div>
          <div className="relative z-10 mx-auto mt-4 max-w-[1440px] px-5 lg:px-10"><div className="h-8 bg-[#FFFDF8] [clip-path:polygon(0_55%,5%_0,10%_55%,15%_0,20%_55%,25%_0,30%_55%,35%_0,40%_55%,45%_0,50%_55%,55%_0,60%_55%,65%_0,70%_55%,75%_0,80%_55%,85%_0,90%_55%,95%_0,100%_55%,100%_100%,0_100%)]" /></div>
        </section>

        <section id="overview" className="scroll-mt-24 bg-[#FFFDF8] px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div><p className="section-kicker">เริ่มจากแผนที่เรื่อง</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-[#243F3D]">กฎหมายฉบับนี้<br />กำลังจัดระเบียบอะไร</h2></div>
              <p className="max-w-xl text-lg leading-8 text-[#65615A]">แก่นของกฎหมายคือทำให้การใช้อำนาจทางปกครองมีขั้นตอนที่ตรวจสอบได้ เป็นธรรมกับคนที่ได้รับผลกระทบ และยังเดินงานสาธารณะต่อได้อย่างมีประสิทธิภาพ</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {overviewSteps.map((step) => <article key={step.id} className="group relative min-h-[215px] overflow-hidden border border-[#1C5D58]/10 bg-white p-6 shadow-[0_12px_30px_rgba(33,65,61,.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(33,65,61,.12)]">
                <span className="font-mono text-xs font-bold tracking-[.18em] text-[#E17A38]">{step.id}</span><h3 className="mt-7 text-xl font-semibold text-[#174945]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#65615A]">{step.detail}</p><span className="absolute bottom-5 right-5 text-xs font-semibold text-[#0E8F8A]">{step.articles}</span><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#E4F1ED] opacity-0 transition group-hover:opacity-100" />
              </article>)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#F7F1E8] px-5 py-20 lg:px-10">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div className="process-canvas relative order-2 min-h-[330px] overflow-hidden rounded-[30px_75px_28px_70px] border-[9px] border-white shadow-[0_20px_40px_rgba(77,68,48,.12)] lg:order-1"><span className="process-card process-card-one"><CircleHelp /></span><span className="process-card process-card-two"><BookOpen /></span><span className="process-card process-card-three"><FileText /></span><span className="process-line" /><img src={rachaGuideUrl} alt="พี่ราชชวนให้เข้าใจขั้นตอนที่เป็นธรรม" className="absolute bottom-0 left-1/2 z-10 h-[88%] w-[62%] -translate-x-1/2 object-contain object-bottom" /></div>
            <div className="order-1 lg:order-2"><p className="section-kicker">หลักจำง่ายของพี่ราช</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-[#4A4237]">ฟังให้ครบ<br />คิดให้เป็นธรรม<br />บอกเหตุผลให้ชัด</h2><div className="mt-7 space-y-4"><div className="flex gap-4"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0E8F8A] text-sm font-bold text-white">1</span><p className="leading-7 text-[#65615A]"><strong className="text-[#3C514E]">ให้มีคนที่ใช้อำนาจได้จริง</strong> และไม่มีผลประโยชน์ทับซ้อน</p></div><div className="flex gap-4"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E17A38] text-sm font-bold text-white">2</span><p className="leading-7 text-[#65615A]"><strong className="text-[#3C514E]">ให้คนที่ได้รับผลกระทบได้พูด</strong> ยื่นหลักฐาน และตรวจสอบข้อมูลที่จำเป็น</p></div><div className="flex gap-4"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#688A59] text-sm font-bold text-white">3</span><p className="leading-7 text-[#65615A]"><strong className="text-[#3C514E]">ให้คำสั่งตรวจสอบได้</strong> ด้วยเหตุผลและช่องทางอุทธรณ์</p></div></div></div>
          </div>
        </section>

        <section id="articles" className="scroll-mt-24 bg-[#EDF6F4] px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="section-kicker">ห้องอ่านรายมาตรา</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-[#174945]">เลือกอ่านแบบที่<br />ไม่หลงในคำยาก</h2></div><div className="max-w-md rounded-2xl border border-[#0E8F8A]/15 bg-white p-4 text-sm leading-6 text-[#5B6662]"><Lightbulb className="mb-1 inline h-4 w-4 text-[#E17A38]" /> เริ่มจากกล่อง “เล่าง่ายๆสไลต์พี่ราช” แล้วเปิดตัวบทมาตราจริงเมื่ออยากตรวจถ้อยคำ</div></div>
            <div className="mt-10 grid gap-5 lg:grid-cols-[230px_1fr]">
              <aside className="lg:sticky lg:top-24 lg:h-fit"><div className="border border-[#0E8F8A]/15 bg-[#FFFDF8] p-4 shadow-sm"><p className="mb-3 text-sm font-semibold text-[#0E625E]">เลือกหมวด</p><div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">{["ทั้งหมด", ...sections].map((section) => <button key={section} onClick={() => selectSection(section)} className={`whitespace-nowrap border-l-4 px-3 py-2 text-left text-sm font-medium transition ${activeSection === section ? "border-[#0E8F8A] bg-[#E2F1ED] text-[#0C716B]" : "border-transparent text-[#666158] hover:bg-[#F6F0E8]"}`}>{section === "ทั้งหมด" ? section : `${section} · ${chapterMeta[section]?.title ?? "รายละเอียดหมวด"}`}</button>)}</div></div><div className="mt-5 border-l-4 border-[#F2AA72] bg-[#FFF3E7] p-4 text-sm leading-6 text-[#785430]"><strong className="block text-[#AD672D]">วิธีเดินบทเรียน</strong>เลือกหมวด → เปิดคำอธิบาย → ค่อยตรวจตัวบทจริง</div></aside>
              <div>
                <label className="flex items-center gap-3 border border-[#0E8F8A]/15 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#0E8F8A]/30"><Search size={19} className="text-[#0E8F8A]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-[#A39F95]" placeholder="ค้นหามาตรา คำสำคัญ หรือคำอธิบาย…" /></label>
                <p className="mt-4 text-sm text-[#66736F]">พบ <strong className="text-[#0E766F]">{filteredArticles.length}</strong> มาตรา</p>
                <div className="mt-6 space-y-12">
                  {groupedArticles.map((group) => {
                    const meta = chapterMeta[group.section] ?? { title: group.section, scene: "บทเรียน", narrator: "อ่านคำแปลควบคู่ตัวบทจริงเพื่อจับสาระสำคัญ", tone: "chapter-stone" };
                    return <section key={group.section} id={sectionAnchor(group.section)} className="relative scroll-mt-36 lg:scroll-mt-28">
                      <div className={`chapter-spread ${meta.tone}`}><div className="relative z-10 max-w-xl"><p className="chapter-scene">{meta.scene}</p><h3>{meta.title}</h3><p className="chapter-narrator"><span>พี่ราชบอก</span>{meta.narrator}</p></div><img src={rachaApproveUrl} alt={`พี่ราชแนะนำ ${meta.title}`} className="chapter-mascot" /><span className="chapter-count">{group.articles.length}<small>มาตรา</small></span></div>
                      <Accordion type="multiple" className="article-route mt-5 space-y-3">
                        {group.articles.map((article, articleIndex) => {
                          const repealed = article.lawText.includes("(ยกเลิก)");
                          const isLessonBreak = articleIndex < group.articles.length - 1 && (articleIndex + 1) % 10 === 0;
                          return <Fragment key={article.number}>
                            <AccordionItem value={`article-${article.number}`} className="lesson-card border border-[#0E8F8A]/12 bg-[#FFFDF8] px-0 shadow-[0_8px_18px_rgba(38,78,72,.04)]">
                              <AccordionTrigger className="items-start gap-5 px-5 py-5 text-left hover:no-underline"><span className="article-ribbon"><em>มาตรา</em><b>{article.number}</b></span><span className="min-w-0 flex-1"><span className="mb-2 flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${sectionColors[article.section] ?? "bg-[#eee]"}`}>{article.section}</span>{repealed && <span className="rounded-full bg-[#F0ECE5] px-2.5 py-1 text-[11px] font-bold text-[#70685E]">ถูกยกเลิก</span>}</span><span className="block text-base font-semibold leading-7 text-[#234743]">{article.keyPoint}</span></span></AccordionTrigger>
                              <AccordionContent className="px-5 pb-6"><div className="grid gap-5 border-t border-[#0E8F8A]/10 pt-6 lg:grid-cols-[1.6fr_.9fr]"><div className="postit-note"><p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0E766F]"><Sparkles size={16} /> แปลแบบพี่ราช</p><p className="text-[15px] leading-8 text-[#4D504B]">{article.plainSummary}</p></div><div className="memory-cue"><p><strong>จำไว้</strong>{article.keyPoint}</p></div></div><div className="mt-5"><button onClick={() => setShowLawText((current) => ({ ...current, [article.number]: !current[article.number] }))} className="inline-flex items-center gap-2 border-b border-[#0E8F8A]/40 pb-1 text-sm font-bold text-[#0E766F] hover:text-[#075F5A]"><FileText size={16} /> {showLawText[article.number] ? "ซ่อนตัวบทจริง" : "เปิดตัวบทจริงจากไฟล์ต้นฉบับ"}</button>{showLawText[article.number] && <div className="mt-4 max-h-[460px] overflow-y-auto border border-[#DBCDBE] bg-[#FBF7F0] p-5 font-serif text-[15px] leading-8 text-[#49443C]">{article.lawText.split("\n").filter(Boolean).map((line, index) => <p key={`${article.number}-${index}`} className={line.trim().startsWith("(") ? "pl-4" : ""}>{line}</p>)}</div>}</div></AccordionContent>
                            </AccordionItem>
                            {isLessonBreak && <aside className="article-interlude"><div><span>จุดพักบทเรียน · พี่ราชชวนทวน</span><p>{lessonBreakPrompts[group.section] ?? "ทวนสาระสำคัญก่อนเดินต่อ แล้วลองเชื่อมแต่ละมาตราเข้ากับขั้นตอนเดียวกัน"}</p></div><img src={rachaGuideUrl} alt="พี่ราชชวนทวนบทเรียน" /></aside>}
                          </Fragment>;
                        })}
                      </Accordion>
                    </section>;
                  })}
                </div>
                {filteredArticles.length === 0 && <div className="mt-4 border border-dashed border-[#0E8F8A]/30 bg-white px-6 py-12 text-center text-[#6B7068]"><CircleHelp className="mx-auto mb-3 text-[#0E8F8A]" />ไม่พบมาตราที่ตรงกับคำค้น ลองใช้คำสั้นลงหรือเลือก “ทั้งหมด”</div>}
                {filteredArticles.length > 0 && <aside className="mt-14 overflow-hidden border border-[#0E8F8A]/15 bg-white shadow-[0_14px_30px_rgba(38,78,72,.08)]"><div className="grid items-center gap-4 px-6 py-7 sm:grid-cols-[1fr_auto] sm:px-10"><div><p className="section-kicker">เดินทางถึงปลายบท</p><h3 className="mt-2 text-2xl font-semibold text-[#174945]">อ่านมาตราสุดท้ายแล้ว<br />พี่ราชดีใจด้วยครับ</h3><p className="mt-3 max-w-xl text-sm leading-6 text-[#5B6662]">พร้อมแล้ว ลองไปทบทวนด้วยแบบทดสอบ 20 ข้อ เพื่อเช็กความเข้าใจของตัวเอง</p></div><img src={rachaCelebrateUrl} alt="พี่ราชดีใจเมื่ออ่านเนื้อหารายมาตราครบแล้ว" className="mx-auto h-44 w-auto object-contain sm:h-52" /></div></aside>}
              </div>
            </div>
          </div>
        </section>

        <section id="quiz" className="scroll-mt-24 bg-[#FFF7EB] px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div><p className="section-kicker">ข้อสอบทบทวน</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-[#4D3E2C]">ลองตอบก่อน<br />แล้วค่อยดูเหตุผล</h2><p className="mt-5 text-lg leading-8 text-[#6C5E50]">แบบทดสอบ 20 ข้อ</p><div className="mt-7 max-w-2xl border border-[#EAC89C] bg-[#FFFDF8] p-5"><div className="flex justify-between text-sm font-semibold text-[#866040]"><span>ความคืบหน้า</span><span>{answered} / {quizQuestions.length} ข้อ</span></div><Progress value={quizProgress} className="mt-3 h-3 bg-[#F2E1C7] [&>div]:bg-[#E17A38]" />{answered === quizQuestions.length && <p className="mt-4 text-sm leading-6 text-[#5B604C]">ทำครบแล้ว: ตอบถูก <strong className="text-[#466E45]">{correct}</strong> จาก {quizQuestions.length} ข้อ <button onClick={() => setAnswers({})} className="ml-2 font-bold text-[#0E766F] underline">เริ่มใหม่</button></p>}</div></div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {quizQuestions.map((question) => { const selected = answers[question.id]; const hasAnswered = selected !== undefined; return <article key={question.id} className="border border-[#E6CFAE] bg-[#FFFDF8] p-5 shadow-[0_10px_22px_rgba(89,62,37,.06)]"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-[#FBE4C9] px-3 py-1 text-xs font-bold text-[#A05B26]">ข้อ {question.id}</span></div><h3 className="mt-4 text-base font-semibold leading-7 text-[#4E4436]">{question.question}</h3><div className="mt-4 space-y-2">{question.choices.map((choice, index) => { const isCorrect = index === question.answerIndex; const isSelected = selected === index; const state = hasAnswered ? (isCorrect ? "border-[#70A66E] bg-[#EFF8EB] text-[#37693B]" : isSelected ? "border-[#E49B8C] bg-[#FFF0ED] text-[#AA4C3C]" : "border-[#EADFD1] text-[#7D7469]") : "border-[#EADFD1] text-[#665F56] hover:border-[#0E8F8A] hover:bg-[#F0F8F6]"; return <button key={choice} disabled={hasAnswered} onClick={() => setAnswers((current) => ({ ...current, [question.id]: index }))} className={`flex w-full items-start gap-3 border px-3 py-2.5 text-left text-sm leading-6 transition disabled:cursor-default ${state}`}><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px] font-bold">{String.fromCharCode(65 + index)}</span>{choice}</button>; })}</div>{hasAnswered && <div className={`mt-4 border-l-4 px-4 py-3 text-sm leading-6 ${selected === question.answerIndex ? "border-[#6E9D69] bg-[#F1F8ED] text-[#406744]" : "border-[#E17A38] bg-[#FFF4E8] text-[#865735]"}`}><strong>{selected === question.answerIndex ? "ถูกต้อง" : "เฉลย"}</strong><p>{question.explanation}</p></div>}</article>; })}
            </div>
          </div>
        </section>

        <section className="bg-[#174945] px-5 py-16 text-white lg:px-10"><div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[auto_1fr_auto] md:items-center"><img src={rachaApproveUrl} alt="พี่ราช" className="mx-auto h-32 w-auto object-contain md:h-40" /><div><p className="text-sm font-semibold tracking-[.12em] text-[#9FD8D1]">ก่อนปิดหนังสือ</p><h2 className="mt-2 text-3xl font-semibold leading-tight">กฎหมายถึงจะใช้ภาษาที่ยาก<br />แต่การเริ่มเข้าใจไม่จำเป็นต้องยาก</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#D7EFEB]">เว็บไซต์นี้เรียบเรียงจากกฎหมายฉบับเต็มเพื่อการเรียนรู้เข้าใจง่าย สไลต์พี่ราช</p></div><Button onClick={() => scrollTo("top")} variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">กลับไปเริ่มต้น</Button></div></section>
      </main>
      <FooterContact />
      <footer className="bg-[#123B38] px-5 py-6 text-center leading-6 text-[#D7EFEB]"><strong className="block text-base font-semibold">ทางมุ่งสู่ราชการ</strong><span className="text-xs tracking-[.14em] text-[#9FD8D1]">Road to Kharachakar</span></footer>
    </div>
  );
}
