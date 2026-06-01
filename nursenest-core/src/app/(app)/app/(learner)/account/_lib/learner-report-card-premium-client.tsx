"use client";

import dynamic from "next/dynamic";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { ReportCardData } from "@/lib/learner/load-report-card-data";

const LearnerReportCardPremium = dynamic(
  () =>
    import("@/components/student/learner-report-card-premium").then(
      (mod) => mod.LearnerReportCardPremium,
    ),
  { ssr: false },
);

export function LearnerReportCardPremiumClient({
  data,
  t,
  localeTag,
}: {
  data: ReportCardData;
  t: LearnerMarketingT;
  localeTag: string;
}) {
  return <LearnerReportCardPremium data={data} t={t} localeTag={localeTag} />;
}
