"use client";

import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isMarketingHubNavigationHrefAllowed } from "@/lib/qa/lesson-flow-pathways";
import { trackClientEvent } from "@/lib/observability/posthog-client";

/**
 * Blocks navigation when an href would leave the expected exam hub / related-lesson subtree for this pathway.
 * Does not redirect — user stays on the current view.
 */
export function SafePathwayHubLink({
  pathway,
  href,
  className,
  children,
}: {
  pathway: ExamPathwayDefinition;
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (isMarketingHubNavigationHrefAllowed(href, pathway)) return;
        e.preventDefault();
        const payload = JSON.stringify({
          scope: "navigation",
          event: "invalid_navigation_target_blocked",
          pathway_id: pathway.id,
          href: href.slice(0, 220),
        });
        console.error(`[nursenest-core] ${payload}`);
        trackClientEvent("invalid_navigation_target_blocked", {
          pathway_id: pathway.id,
          href: href.slice(0, 120),
        });
      }}
    >
      {children}
    </Link>
  );
}
