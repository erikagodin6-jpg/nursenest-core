"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { initPosthogClient, posthog } from "@/lib/observability/posthog-client";
import { analyticsDistinctId } from "@/lib/observability/posthog-distinct-id";

/** Aligns browser `distinct_id` with server-side PostHog events after login. */
export function PosthogIdentify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    initPosthogClient();
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    const id = (session?.user as { id?: string } | undefined)?.id;
    if (!id) return;
    try {
      posthog.identify(analyticsDistinctId(id));
    } catch {
      // ignore
    }
  }, [status, session]);

  return null;
}
