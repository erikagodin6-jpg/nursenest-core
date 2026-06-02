"use server";

import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Client-reported shape mismatch: HTTP 2xx + `success: true` body that failed strict inventory parsing.
 * No pathway or user identifiers (avoid PII in drains).
 */
export async function reportFlashcardInventoryMalformedSuccessPayload(meta: {
  httpStatus: number;
  messageLen: number;
  /** Exam pathway id only — safe for drains. */
  pathwayId?: string;
  /** Short parse/validation reason code (no free text from API bodies). */
  reason?: string;
}): Promise<void> {
  safeServerLog("flashcards", "inventory_malformed_success_payload", meta);
}
