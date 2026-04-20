import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const PREFIXES = ["pages.login.", "pages.authTrust."] as const;

/** Keys needed by login + trust FAQ client islands — merged into i18n context so `t()` never misses. */
export function pickLoginSurfaceMessages(messages: MarketingMessages): MarketingMessages {
  const out: MarketingMessages = {};
  for (const [k, v] of Object.entries(messages)) {
    if (typeof v !== "string" || !v.trim()) continue;
    if (PREFIXES.some((p) => k.startsWith(p))) {
      out[k] = v;
    }
  }
  return out;
}
