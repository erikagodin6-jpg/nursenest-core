"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import {
  captureGovernedGraphTelemetry,
  captureGraphStepClicked,
  captureGraphStepViewed,
} from "@/lib/educational-graph/capture-governed-graph-telemetry";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { GraphTelemetryEventName } from "@/lib/educational-graph/graph-telemetry";

type GovernedGraphInteractionProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  step: EduGraphStep;
  cognition?: EducationalCognitionContext | null;
  clickEvent?: GraphTelemetryEventName;
  children: ReactNode;
  trackViewOnMount?: boolean;
};

/**
 * Governed link — graph_step_clicked with normalized ontology + psychometric fields.
 */
export function GovernedGraphInteraction({
  step,
  cognition,
  clickEvent = "graph_step_clicked",
  trackViewOnMount = false,
  children,
  ...linkProps
}: GovernedGraphInteractionProps) {
  if (trackViewOnMount && typeof window !== "undefined") {
    captureGraphStepViewed(step, cognition);
  }

  return (
    <Link
      {...linkProps}
      href={step.href}
      onClick={() => {
        if (clickEvent === "graph_step_clicked") {
          captureGraphStepClicked(step, cognition);
        } else {
          void captureGovernedGraphTelemetry({ event: clickEvent, step, cognition });
        }
      }}
    >
      {children}
    </Link>
  );
}
