"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";

type GovernedGlossaryTraversalProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  termSlug: string;
  topicSlug: string;
  competencyId?: string | null;
  href: string;
  sourceSurface?: GraphSourceSurface;
  children: ReactNode;
};

export function GovernedGlossaryTraversal({
  termSlug,
  topicSlug,
  competencyId,
  href,
  sourceSurface = "topic_hub_public",
  children,
  ...rest
}: GovernedGlossaryTraversalProps) {
  return (
    <Link
      {...rest}
      href={href}
      onClick={() => {
        void captureGovernedGraphTelemetry({
          event: "glossary_node_opened",
          topicSlug,
          sourceSurface,
          competencyId: competencyId ?? null,
          graphDepth: 1,
          suppressDedupe: false,
        });
      }}
      data-nn-glossary-term={termSlug}
    >
      {children}
    </Link>
  );
}
