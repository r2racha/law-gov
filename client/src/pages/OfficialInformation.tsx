/** Design reminder — UX/UI เดิมในธีมแฟ้มข้อมูลสีน้ำเงิน ใช้เฉพาะอวตารพี่ราชที่ผู้ใช้อัปโหลด */
import { GenericLawPage, type GenericLawConfig } from "@/components/GenericLawPage";
import { officialInformationArticles, officialInformationQuiz } from "@/data/official-information";
import { officialInformationWholeStory } from "@/data/whole-stories";

const config: GenericLawConfig = {
  slug: "official-information",
  tabLabel: "ข้อมูลข่าวสารของราชการ",
  headerLabel: "ข้อมูลข่าวสารของราชการ",
  legalTitle: "พระราชบัญญัติข้อมูลข่าวสารของราชการ พ.ศ. 2540",
  heroTitle: <>ข้อมูลของรัฐ<br /><span className="text-[#3D6E9D]">เปิดเผยตามกติกา</span></>,
  heroSubtitle: "อ่านประเภทข้อมูล การขอข้อมูล ข้อยกเว้น ข้อมูลส่วนบุคคล และกระบวนการอุทธรณ์จากตัวบท",
  heroCallout: "เริ่มจากหมวด 1 เพื่อดูข้อมูลที่ต้องเผยแพร่และวิธีขอข้อมูล แล้วค่อยดูข้อยกเว้นและการอุทธรณ์",
  articleNoun: "มาตรา",
  articles: officialInformationArticles,
  quiz: officialInformationQuiz,
  story: officialInformationWholeStory,
  overview: [["01", "เปิดเผยและจัดข้อมูล", "มาตรา 7 ถึงมาตรา 13 กำหนดข้อมูลที่ต้องลงพิมพ์ จัดไว้ให้ตรวจดู และการขอข้อมูล"], ["02", "ข้อยกเว้นและข้อมูลส่วนบุคคล", "มาตรา 14 ถึงมาตรา 25 กำหนดข้อมูลที่ห้ามหรืออาจไม่เปิดเผย และสิทธิข้อมูลส่วนบุคคล"], ["03", "คณะกรรมการและอุทธรณ์", "มาตรา 27 ถึงมาตรา 41 กำหนดคณะกรรมการ การวินิจฉัยอุทธรณ์ และบทกำหนดโทษ"]],
  primary: "#4E7EAA",
  primaryDark: "#315E88",
  soft: "#EAF3FA",
  hero: "linear-gradient(142deg, #E7F1FA 0%, #B8D5EB 56%, #F3F8FC 100%)",
  scene: "information",
};

export default function OfficialInformation() { return <GenericLawPage config={config} />; }
