/** Design reminder — UX/UI เดิมในธีมแฟ้มสอบข้อเท็จจริงสีอิฐ ใช้เฉพาะอวตารพี่ราชที่ผู้ใช้อัปโหลด */
import { GenericLawPage, type GenericLawConfig } from "@/components/GenericLawPage";
import { liabilityArticles, liabilityQuiz } from "@/data/liability";
import { liabilityWholeStory } from "@/data/whole-stories";

const config: GenericLawConfig = {
  slug: "liability",
  tabLabel: "ความรับผิดทางละเมิด",
  headerLabel: "ความรับผิดทางละเมิดของเจ้าหน้าที่",
  legalTitle: "พระราชบัญญัติความรับผิดทางละเมิดของเจ้าหน้าที่ พ.ศ. 2539",
  heroTitle: <>งานในหน้าที่<br /><span className="text-[#A54F40]">รัฐรับผิดก่อน</span>ตามกติกา</>,
  heroSubtitle: "อ่านหลักผู้เสียหาย หน่วยงานของรัฐ เจ้าหน้าที่ การไล่เบี้ย และการชำระค่าสินไหมทดแทนจากตัวบท",
  heroCallout: "เริ่มที่มาตรา 5 และมาตรา 6 เพื่อแยกกรณีทำละเมิดในหน้าที่ออกจากกรณีนอกหน้าที่",
  articleNoun: "มาตรา",
  articles: liabilityArticles,
  quiz: liabilityQuiz,
  story: liabilityWholeStory,
  overview: [["01", "ใครรับผิดต่อผู้เสียหาย", "มาตรา 5 ถึงมาตรา 7 แยกการฟ้องหน่วยงานของรัฐ การฟ้องเจ้าหน้าที่ และการเรียกคู่ความเข้าคดี"], ["02", "หน่วยงานเรียกจากเจ้าหน้าที่ได้เมื่อใด", "มาตรา 8 ถึงมาตรา 10 กำหนดการไล่เบี้ย ความเป็นธรรม ส่วนรับผิด และอายุความ"], ["03", "ขอชดใช้ สั่งชำระ และผ่อนชำระ", "มาตรา 11 ถึงมาตรา 15 กำหนดคำขอ ระยะเวลา คำสั่งเรียกชำระ การผ่อนชำระ และผู้รักษาการ"]],
  primary: "#B85B4B",
  primaryDark: "#7F3C31",
  soft: "#F8EBE7",
  hero: "linear-gradient(142deg, #F8E8DF 0%, #E8BAA5 55%, #FAF1E9 100%)",
  scene: "liability",
};

export default function Liability() { return <GenericLawPage config={config} />; }
