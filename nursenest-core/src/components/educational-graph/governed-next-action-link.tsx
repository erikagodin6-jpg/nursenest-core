"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { NextAction } from "@/lib/learner/adaptive-recommendations";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";
import { graphStepForTelemetryEvent } from "@/lib/educational-graph/graph-step-next-action";

type GovernedNextActionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  action: NextAction;
  graphStep?: EduGraphStep | null;
  sourceSurface: GraphSourceSurface;
  clickEvent?: "next_best_action_clicked" | "graph_step_clicked";
  children: ReactNode;
};

export function GovernedNextActionLink({
  action,
  graphStep,
  sourceSurface,
  clickEvent,
  children,
  ...rest
}: GovernedNextActionLinkProps) {
  return (
    <Link
      {...rest}
      href={action.href}
      onClick={() => {
        if (graphStep) {
          void captureGovernedGraphTelemetry({
            event: clickEvent ?? graphStepForTelemetryEvent(graphStep.stepKind),
            step: graphStep,
            sourceSurface,
          });
        } else {
          void captureGovernedGraphTelemetry({
            event: clickEvent ?? "next_best_action_clicked",
            topicSlug: "adaptive",
            sourceSurface,
            pathwayId: null,
          });
        }
      }}
    >
      {children}
    </Link>
  );
}
