"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

/**
 * Blog footer / distribution links: captures intent without full query strings (privacy).
 */
export function BlogDistributionAnalyticsLink({
  href,
  linkKind,
  className,
  children,
}: {
  href: string;
  linkKind: string;
  className?: string;
  children: ReactNode;
}) {
  const path = href.split("?")[0] ?? href;
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackClientEvent(PH.blogDistributionLinkClick, {
          actor: "anonymous",
          link_kind: linkKind,
          path_group: path.split("/").filter(Boolean).slice(0, 3).join("/"),
        })
      }
    >
      {children}
    </Link>
  );
}
