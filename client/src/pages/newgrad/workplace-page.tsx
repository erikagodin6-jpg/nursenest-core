import { CategoryPageLayout } from "./category-layout";
import { useI18n } from "@/lib/i18n";
import { Users } from "lucide-react";

export default function WorkplacePage() {
  const { t } = useI18n();
  return (
    <CategoryPageLayout
      title={t("newGrad.workplace.title")}
      subtitle={t("newGrad.workplace.subtitle")}
      icon={Users}
      color="emerald"
      seoTitle={t("newGrad.workplace.seoTitle")}
      seoDescription={t("newGrad.workplace.seoDescription")}
      seoKeywords="new nurse workplace, preceptor relationship, new grad nurse tips, nursing team dynamics, workplace boundaries nursing, nurse communication"
      canonicalPath="/newgrad/workplace"
      premiumContext="Upgrade to access detailed workplace navigation scripts, preceptor relationship worksheets, and conflict resolution frameworks."
      sections={[
        {
          title: t("newGrad.workplace.s1Title"),
          content: t("newGrad.workplace.s1Content"),
          items: [t("newGrad.workplace.s1i1"), t("newGrad.workplace.s1i2"), t("newGrad.workplace.s1i3"), t("newGrad.workplace.s1i4"), t("newGrad.workplace.s1i5")],
        },
        {
          title: t("newGrad.workplace.s2Title"),
          content: t("newGrad.workplace.s2Content"),
          items: [t("newGrad.workplace.s2i1"), t("newGrad.workplace.s2i2"), t("newGrad.workplace.s2i3"), t("newGrad.workplace.s2i4"), t("newGrad.workplace.s2i5")],
        },
        {
          title: t("newGrad.workplace.s3Title"),
          content: t("newGrad.workplace.s3Content"),
          items: [t("newGrad.workplace.s3i1"), t("newGrad.workplace.s3i2"), t("newGrad.workplace.s3i3"), t("newGrad.workplace.s3i4"), t("newGrad.workplace.s3i5")],
        },
        {
          title: t("newGrad.workplace.s4Title"),
          content: t("newGrad.workplace.s4Content"),
          items: [t("newGrad.workplace.s4i1"), t("newGrad.workplace.s4i2"), t("newGrad.workplace.s4i3"), t("newGrad.workplace.s4i4"), t("newGrad.workplace.s4i5")],
        },
        {
          title: t("newGrad.workplace.s5Title"),
          content: t("newGrad.workplace.s5Content"),
          items: [t("newGrad.workplace.s5i1"), t("newGrad.workplace.s5i2"), t("newGrad.workplace.s5i3"), t("newGrad.workplace.s5i4")],
        },
      ]}
      tips={[
        { title: t("newGrad.workplace.tip1Title"), desc: t("newGrad.workplace.tip1Desc") },
        { title: t("newGrad.workplace.tip2Title"), desc: t("newGrad.workplace.tip2Desc") },
        { title: t("newGrad.workplace.tip3Title"), desc: t("newGrad.workplace.tip3Desc") },
        { title: t("newGrad.workplace.tip4Title"), desc: t("newGrad.workplace.tip4Desc") },
      ]}
    />
  );
}
