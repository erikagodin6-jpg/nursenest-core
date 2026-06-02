"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { buildStudyLoopCatClickProps, type StudyLoopCatSurface } from "@/lib/observability/study-loop-cat-analytics";

type Props = LinkProps & {
  children: ReactNode;
  className?: string;
  sourceSurface: StudyLoopCatSurface;
  pathwayId?: string | null;
  allowed?: boolean;
  qaValue?: string;
  studyAccent?: string;
  dashboardCatCard?: string;
};

export function TrackedStudyLoopCatLink({
  href,
  children,
  className,
  sourceSurface,
  pathwayId,
  allowed,
  qaValue,
  studyAccent,
  dashboardCatCard,
  ...rest
}: Props) {
  const hrefString = typeof href === "string" ? href : href.toString();

  return (
    <Link
      href={href}
      className={className}
      data-nn-qa-study-loop-cat={qaValue}
      data-study-accent={studyAccent}
      data-nn-qa-dashboard-cat-card={dashboardCatCard}
      onClick={() =>
        trackClientEvent(
          PH.learnerStudyLoopCatCtaClicked,
          buildStudyLoopCatClickProps({
            href: hrefString,
            sourceSurface,
            pathwayId,
            allowed,
          }),
        )
      }
      {...rest}
    >
      {children}
    </Link>
  );
}
