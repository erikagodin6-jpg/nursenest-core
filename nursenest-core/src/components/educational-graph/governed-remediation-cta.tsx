"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

type GovernedRemediationCTAProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  step: EduGraphStep;
  children: ReactNode;
};

export function GovernedRemediationCTA({ step, children, ...rest }: GovernedRemediationCTAProps) {
  return (
    <Link
      {...rest}
      href={step.href}
      onClick={() => {
        void captureGovernedGraphTelemetry({
          event: "graph_step_clicked",
          step,
        });
      }}
    >
      {children}
    </Link>
  );
}
