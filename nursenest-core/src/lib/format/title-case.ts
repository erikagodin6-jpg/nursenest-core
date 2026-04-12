import { formatTitleCase } from "@/lib/format/text-case";

/** @deprecated Use `formatTitleCase` from `text-case.ts`. */
export function toTitleCase(value: string, locale?: string): string {
  return formatTitleCase(value, locale);
}

/** @deprecated Use `formatTitleCase` from `text-case.ts`. */
export function isTitleCase(value: string, locale?: string): boolean {
  return formatTitleCase(value, locale) === value.replace(/\s+/g, " ").trim();
}

/** @deprecated Use `formatTitleCase` from `text-case.ts`. */
export function formatNavLabel(value: string, options?: { locale?: string }): string {
  return formatTitleCase(value, options?.locale);
}
