"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

type GovernedInterpretationLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  step: EduGraphStep;
  children: ReactNode;
};

export function GovernedInterpretationLink({ step, children, ...rest }: GovernedInterpretationLinkProps) {
  return (
    <Link
      {...rest}
      href={step.href}
      onClick={() => {
        void captureGovernedGraphTelemetry({
          event: "interpretation_path_opened",
          step,
        });
      }}
    >
      {children}
    </Link>
  );
}
