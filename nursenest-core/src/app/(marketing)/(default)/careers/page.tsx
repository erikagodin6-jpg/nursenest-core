import type { Metadata } from "next";
import { MarketingSimpleInfoPage } from "@/components/marketing/marketing-simple-info-page";

export const metadata: Metadata = {
  title: "Careers | NurseNest",
  description: "Learn about future career opportunities with NurseNest.",
};

export default function CareersPage() {
  return (
    <MarketingSimpleInfoPage
      eyebrow="Company"
      title="Careers at NurseNest"
      description="NurseNest is building a premium clinical learning ecosystem for nurses, nurse practitioners, allied health learners, educators, and healthcare teams."
      primaryCta={{ label: "Contact Us", href: "/contact" }}
      secondaryCta={{ label: "Learn About NurseNest", href: "/about" }}
      sections={[
        {
          title: "Future roles",
          body: "We are not listing open roles on this page yet, but future hiring areas may include clinical education, nursing content review, product design, engineering, and institutional partnerships.",
          bullets: ["Clinical educators and reviewers", "Product and design roles", "Engineering and data roles", "Partnership and customer success roles"],
        },
        {
          title: "Clinical mission",
          body: "Our work centers on safe clinical reasoning, exam readiness, and calm study experiences that help learners practice like real clinicians.",
        },
      ]}
    />
  );
}
