"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { FrontendUxInit } from "@/components/observability/frontend-ux-init";
import { touchUxNavigation } from "@/lib/observability/frontend-ux-tracking";
import { initPosthogClient, posthog, trackClientEvent } from "@/lib/observability/posthog-client";

function PostHogPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const last = useRef<string | null>(null);

  useEffect(() => {
    initPosthogClient();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    if (last.current === url) return;
    last.current = url;
    touchUxNavigation();
    if (typeof window === "undefined") return;
    try {
      posthog.capture("$pageview", {
        path: pathname,
        $current_url: window.location.href,
      });
    } catch {
      trackClientEvent("page_view_fallback", { path: pathname });
    }
    Sentry.addBreadcrumb({ category: "navigation", message: pathname, level: "info" });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Lazy analytics: PostHog + Sentry breadcrumbs. No blocking script tags.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FrontendUxInit />
      <Suspense fallback={null}>
        <PostHogPageViews />
      </Suspense>
      {children}
    </>
  );
}
