import { CategoryPageLayout } from "./category-layout";
import { useI18n } from "@/lib/i18n";
import { Flame } from "lucide-react";

export default function BurnoutPage() {
  const { t } = useI18n();
  return (
    <CategoryPageLayout
      title={t("newGrad.burnout.title")}
      subtitle={t("newGrad.burnout.subtitle")}
      icon={Flame}
      color="orange"
      seoTitle={t("newGrad.burnout.seoTitle")}
      seoDescription={t("newGrad.burnout.seoDescription")}
      seoKeywords="new nurse burnout, nursing burnout prevention, nurse mental health, new grad nurse stress, nursing self-care, nurse resilience"
      canonicalPath="/newgrad/burnout"
      premiumContext="Upgrade to access premium burnout assessment tools, structured resilience plans, and detailed self-care frameworks."
      sections={[
        {
          title: t("newGrad.burnout.s1Title"),
          content: t("newGrad.burnout.s1Content"),
          items: [t("newGrad.burnout.s1i1"), t("newGrad.burnout.s1i2"), t("newGrad.burnout.s1i3"), t("newGrad.burnout.s1i4"), t("newGrad.burnout.s1i5")],
        },
        {
          title: t("newGrad.burnout.s2Title"),
          content: t("newGrad.burnout.s2Content"),
          items: [t("newGrad.burnout.s2i1"), t("newGrad.burnout.s2i2"), t("newGrad.burnout.s2i3"), t("newGrad.burnout.s2i4"), t("newGrad.burnout.s2i5"), t("newGrad.burnout.s2i6")],
        },
        {
          title: t("newGrad.burnout.s3Title"),
          content: t("newGrad.burnout.s3Content"),
          items: [t("newGrad.burnout.s3i1"), t("newGrad.burnout.s3i2"), t("newGrad.burnout.s3i3"), t("newGrad.burnout.s3i4"), t("newGrad.burnout.s3i5"), t("newGrad.burnout.s3i6")],
        },
        {
          title: t("newGrad.burnout.s4Title"),
          content: t("newGrad.burnout.s4Content"),
          items: [t("newGrad.burnout.s4i1"), t("newGrad.burnout.s4i2"), t("newGrad.burnout.s4i3"), t("newGrad.burnout.s4i4"), t("newGrad.burnout.s4i5")],
        },
        {
          title: t("newGrad.burnout.s5Title"),
          content: t("newGrad.burnout.s5Content"),
          items: [t("newGrad.burnout.s5i1"), t("newGrad.burnout.s5i2"), t("newGrad.burnout.s5i3"), t("newGrad.burnout.s5i4"), t("newGrad.burnout.s5i5")],
        },
      ]}
      tips={[
        { title: t("newGrad.burnout.tip1Title"), desc: t("newGrad.burnout.tip1Desc") },
        { title: t("newGrad.burnout.tip2Title"), desc: t("newGrad.burnout.tip2Desc") },
        { title: t("newGrad.burnout.tip3Title"), desc: t("newGrad.burnout.tip3Desc") },
        { title: t("newGrad.burnout.tip4Title"), desc: t("newGrad.burnout.tip4Desc") },
      ]}
    />
  );
}
