import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function safeString(value: string | null | undefined, fallback: string = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().trim().replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
}

export function logMissingField(component: string, slug: string, field: string): void {
  console.warn(`[${component}] Missing field "${field}" for slug "${slug}" — section hidden`);
}

export function logLookupFailure(component: string, slug: string): void {
  console.warn(`[${component}] Lookup failed for slug "${slug}" — showing not-found fallback`);
}
