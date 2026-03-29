import { CategoryPageLayout } from "./category-layout";
import { useI18n } from "@/lib/i18n";
import { TrendingUp } from "lucide-react";

export default function CareerPage() {
  const { t } = useI18n();
  return (
    <CategoryPageLayout
      title={t("newGrad.career.title")}
      subtitle={t("newGrad.career.subtitle")}
      icon={TrendingUp}
      color="indigo"
      seoTitle={t("newGrad.career.seoTitle")}
      seoDescription={t("newGrad.career.seoDescription")}
      seoKeywords="new grad nurse career, nursing career development, nurse career planning, new nurse career path, nursing career advancement"
      canonicalPath="/newgrad/career"
      premiumContext="Upgrade to access premium career planning frameworks, professional portfolio templates, and detailed career pathway guides."
      sections={[
        {
          title: t("newGrad.career.s1Title"),
          content: t("newGrad.career.s1Content"),
          items: [t("newGrad.career.s1i1"), t("newGrad.career.s1i2"), t("newGrad.career.s1i3"), t("newGrad.career.s1i4")],
        },
        {
          title: t("newGrad.career.s2Title"),
          content: t("newGrad.career.s2Content"),
          items: [t("newGrad.career.s2i1"), t("newGrad.career.s2i2"), t("newGrad.career.s2i3"), t("newGrad.career.s2i4")],
        },
        {
          title: t("newGrad.career.s3Title"),
          content: t("newGrad.career.s3Content"),
          items: [t("newGrad.career.s3i1"), t("newGrad.career.s3i2"), t("newGrad.career.s3i3"), t("newGrad.career.s3i4")],
        },
        {
          title: t("newGrad.career.s4Title"),
          content: t("newGrad.career.s4Content"),
          items: [t("newGrad.career.s4i1"), t("newGrad.career.s4i2"), t("newGrad.career.s4i3"), t("newGrad.career.s4i4")],
        },
      ]}
      tips={[
        { title: t("newGrad.career.tip1Title"), desc: t("newGrad.career.tip1Desc") },
        { title: t("newGrad.career.tip2Title"), desc: t("newGrad.career.tip2Desc") },
        { title: t("newGrad.career.tip3Title"), desc: t("newGrad.career.tip3Desc") },
        { title: t("newGrad.career.tip4Title"), desc: t("newGrad.career.tip4Desc") },
      ]}
    />
  );
}
