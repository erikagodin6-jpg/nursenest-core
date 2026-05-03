import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export type StrictLocaleFallbackResult = {
  value: string;
  usedFallback: boolean;
};

export function resolveStrictLocaleMessage(args: {
  locale: string;
  key: string;
  messages: Record<string, string>;
  englishMessages: Record<string, string>;
  logWarning?: (message: string) => void;
}): StrictLocaleFallbackResult {
  const primary = args.messages[args.key];
  if (typeof primary === "string" && primary.trim() !== "") {
    return { value: primary, usedFallback: false };
  }

  const english = args.englishMessages[args.key];
  if (typeof english !== "string" || english.trim() === "") {
    throw new Error(`[i18n] missing canonical English key: ${args.key}`);
  }

  if (args.locale !== DEFAULT_MARKETING_LOCALE) {
    args.logWarning?.(`[i18n] missing ${args.locale} key ${args.key}; falling back to English`);
  }

  return { value: english, usedFallback: true };
}
