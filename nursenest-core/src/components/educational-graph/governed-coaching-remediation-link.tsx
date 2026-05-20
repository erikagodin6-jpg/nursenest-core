"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { CoachingRecommendation } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";

type GovernedCoachingRemediationLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  recommendation: CoachingRecommendation;
  children: ReactNode;
};

export function GovernedCoachingRemediationLink({
  recommendation,
  children,
  ...rest
}: GovernedCoachingRemediationLinkProps) {
  return (
    <Link
      {...rest}
      href={recommendation.href}
      onClick={() => {
        void captureGovernedGraphTelemetry({
          event: "graph_step_clicked",
          topicSlug: recommendation.exposureKey.split("::")[0] ?? "coaching",
          sourceSurface: "post_exam_coaching",
          remediationPriority: String(recommendation.priority),
          graphDepth: recommendation.graphStep?.depth ?? 0,
        });
      }}
    >
      {children}
    </Link>
  );
}
