import type { Metadata } from "next";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const FALLBACK_EXAM_MARKETING_METADATA: Metadata = {
  title: "NurseNest | Nursing exam prep",
  description: "Adaptive practice, lessons, and exam-focused prep for nursing candidates.",
};

/**
 * Wraps exam-hub metadata generation so resolver bugs or bad params never crash the route.
 */
export async function safeExamHubMetadata(
  run: () => Promise<Metadata>,
  ctx: { pathname?: string; locale?: string },
): Promise<Metadata> {
  try {
    const m = await run();
    return m && typeof m === "object" ? m : FALLBACK_EXAM_MARKETING_METADATA;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("metadata", "exam_hub_metadata_failed", {
      pathname: ctx.pathname,
      locale: ctx.locale,
      detail: message.slice(0, 300),
    });
    return FALLBACK_EXAM_MARKETING_METADATA;
  }
}
