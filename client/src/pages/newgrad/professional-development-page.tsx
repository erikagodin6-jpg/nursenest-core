import { CategoryPageLayout } from "./category-layout";
import { useI18n } from "@/lib/i18n";
import { Award } from "lucide-react";

export default function ProfessionalDevelopmentPage() {
  const { t } = useI18n();
  return (
    <CategoryPageLayout
      title={t("newGrad.profDev.title")}
      subtitle={t("newGrad.profDev.subtitle")}
      icon={Award}
      color="amber"
      seoTitle={t("newGrad.profDev.seoTitle")}
      seoDescription={t("newGrad.profDev.seoDescription")}
      seoKeywords="nurse professional development, nursing continuing education, nurse certifications, nursing leadership, new grad nurse growth, nursing career advancement"
      canonicalPath="/newgrad/professional-development"
      premiumContext="Upgrade to access premium professional development planning templates, certification study guides, and leadership development frameworks."
      sections={[
        {
          title: t("newGrad.profDev.s1Title"),
          content: t("newGrad.profDev.s1Content"),
          items: [t("newGrad.profDev.s1i1"), t("newGrad.profDev.s1i2"), t("newGrad.profDev.s1i3"), t("newGrad.profDev.s1i4"), t("newGrad.profDev.s1i5"), t("newGrad.profDev.s1i6")],
        },
        {
          title: t("newGrad.profDev.s2Title"),
          content: t("newGrad.profDev.s2Content"),
          items: [t("newGrad.profDev.s2i1"), t("newGrad.profDev.s2i2"), t("newGrad.profDev.s2i3"), t("newGrad.profDev.s2i4"), t("newGrad.profDev.s2i5"), t("newGrad.profDev.s2i6")],
        },
        {
          title: t("newGrad.profDev.s3Title"),
          content: t("newGrad.profDev.s3Content"),
          items: [t("newGrad.profDev.s3i1"), t("newGrad.profDev.s3i2"), t("newGrad.profDev.s3i3"), t("newGrad.profDev.s3i4"), t("newGrad.profDev.s3i5"), t("newGrad.profDev.s3i6")],
        },
        {
          title: t("newGrad.profDev.s4Title"),
          content: t("newGrad.profDev.s4Content"),
          items: [t("newGrad.profDev.s4i1"), t("newGrad.profDev.s4i2"), t("newGrad.profDev.s4i3"), t("newGrad.profDev.s4i4"), t("newGrad.profDev.s4i5")],
        },
        {
          title: t("newGrad.profDev.s5Title"),
          content: t("newGrad.profDev.s5Content"),
          items: [t("newGrad.profDev.s5i1"), t("newGrad.profDev.s5i2"), t("newGrad.profDev.s5i3"), t("newGrad.profDev.s5i4"), t("newGrad.profDev.s5i5"), t("newGrad.profDev.s5i6")],
        },
      ]}
      tips={[
        { title: t("newGrad.profDev.tip1Title"), desc: t("newGrad.profDev.tip1Desc") },
        { title: t("newGrad.profDev.tip2Title"), desc: t("newGrad.profDev.tip2Desc") },
        { title: t("newGrad.profDev.tip3Title"), desc: t("newGrad.profDev.tip3Desc") },
        { title: t("newGrad.profDev.tip4Title"), desc: t("newGrad.profDev.tip4Desc") },
      ]}
    />
  );
}
