/** Design reminder — UX/UI เดิมในธีมแฟ้มสอบข้อเท็จจริงสีอิฐ ใช้เฉพาะอวตารพี่ราชที่ผู้ใช้อัปโหลด */
import { GenericLawPage, type GenericLawConfig } from "@/components/GenericLawPage";
import { liabilityArticles, liabilityQuiz } from "@/data/liability";
import { liabilityWholeStory } from "@/data/whole-stories";

const config: GenericLawConfig = {
  slug: "liability",
  tabLabel: "ความรับผิดทางละเมิด",
  headerLabel: "ความรับผิดทางละเมิดของเจ้าหน้าที่",
  legalTitle: "ระเบียบสำนักนายกรัฐมนตรีว่าด้วยหลักเกณฑ์การปฏิบัติเกี่ยวกับความรับผิดทางละเมิดของเจ้าหน้าที่ พ.ศ. 2539 · ฉบับรวมที่สะท้อนฉบับที่ 2 พ.ศ. 2559",
  heroTitle: <>เมื่อเกิดความเสียหาย<br /><span className="text-[#A54F40]">ต้องหาข้อเท็จจริง</span>ตามขั้นตอน</>,
  heroSubtitle: "อ่านลำดับการแจ้งเหตุ การสอบข้อเท็จจริง การตรวจสอบ และการชดใช้ค่าสินไหมทดแทนจากตัวบท",
  heroCallout: "เริ่มจากข้อ 7 เพื่อเห็นการแจ้งเหตุ แล้วตามลำดับคณะกรรมการ การวินิจฉัย และการชดใช้",
  articleNoun: "ข้อ",
  articles: liabilityArticles,
  quiz: liabilityQuiz,
  story: liabilityWholeStory,
  overview: [["01", "แจ้งเหตุและตั้งคณะกรรมการ", "ข้อ 7 ถึงข้อ 12/1 กำหนดการรายงานเหตุและการแต่งตั้งคณะกรรมการ"], ["02", "สอบ วินิจฉัย และตรวจสอบ", "ข้อ 13 ถึงข้อ 21 กำหนดการประชุม การสอบข้อเท็จจริง และบทบาทกระทรวงการคลัง"], ["03", "ชดใช้และกรณีบุคคลภายนอก", "ข้อ 22 ถึงข้อ 38 กำหนดวิธีชดใช้ การผ่อนชำระ การดำเนินคดี และการไล่เบี้ย"]],
  primary: "#B85B4B",
  primaryDark: "#7F3C31",
  soft: "#F8EBE7",
  hero: "linear-gradient(142deg, #F8E8DF 0%, #E8BAA5 55%, #FAF1E9 100%)",
  scene: "liability",
};

export default function Liability() { return <GenericLawPage config={config} />; }
