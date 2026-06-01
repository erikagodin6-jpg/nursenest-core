"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  identifyPosthogUser,
  initPosthogClient,
  scheduleClientAnalyticsTask,
} from "@/lib/observability/posthog-client";
import { analyticsDistinctId } from "@/lib/observability/posthog-distinct-id";

/** Aligns browser `distinct_id` with server-side PostHog events after login. */
export function PosthogIdentify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    return scheduleClientAnalyticsTask(() => {
      void initPosthogClient();
    }, 3000);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    const id = (session?.user as { id?: string } | undefined)?.id;
    if (!id) return;
    return scheduleClientAnalyticsTask(() => {
      try {
        void identifyPosthogUser(analyticsDistinctId(id));
      } catch {
        // ignore
      }
    }, 3500);
  }, [status, session]);

  return null;
}
