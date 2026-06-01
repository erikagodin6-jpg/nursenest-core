"use client";

import { LearnerReportCardPremium } from "@/components/student/learner-report-card-premium";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { ReportCardData } from "@/lib/learner/load-report-card-data";

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
