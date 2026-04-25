import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const MAX_SAFE_MESSAGE_KEY_LENGTH = 512;

export function coerceFlatMessageValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.trim().length > 0 ? value : undefined;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  return undefined;
}

export function safeMessageKey(key: string): string {
  return key.slice(0, MAX_SAFE_MESSAGE_KEY_LENGTH);
}

export function normalizeMarketingMessagesRecord(
  raw: Record<string, unknown> | null | undefined,
): MarketingMessages {
  const out: MarketingMessages = {};

  if (!raw || typeof raw !== "object") {
    return out;
  }

  for (const [rawKey, rawValue] of Object.entries(raw)) {
    const key = safeMessageKey(rawKey);
    const value = coerceFlatMessageValue(rawValue);

    if (value !== undefined) {
      out[key] = value;
    }
  }

  return out;
}