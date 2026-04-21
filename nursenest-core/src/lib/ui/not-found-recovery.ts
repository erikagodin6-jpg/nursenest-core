import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { isSafeRelativeNavHref, sanitizeRelativeNavHrefOrFallback } from "@/lib/ui/safe-relative-href";

export type NotFoundRecoveryLink = {
  label: string;
  href: string;
  hint?: string;
};

export const NOT_FOUND_RECOVERY_CAP = 4;

/**
 * Locale prefixes (`/en/us/...`) strip to `/us/...` when the second segment is a known marketing country slug.
 * Keep in sync with pathway `countrySlug` values in the exam catalog (`us`, `canada`).
 */
const KNOWN_MARKETING_COUNTRY_SLUGS = new Set(["us", "canada"]);

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function normalizeNotFoundPathname(raw: string | null | undefined): string {
  if (raw == null || typeof raw !== "string") return "/";
  const noQuery = raw.split("?")[0]!.split("#")[0]!;
  const segments = noQuery.split("/").filter((s) => s.length > 0);
  if (segments.length >= 2) {
    const a = norm(segments[0]!);
    const b = norm(segments[1]!);
    if ((a === "en" || a === "fr") && KNOWN_MARKETING_COUNTRY_SLUGS.has(b)) {
      return segments.length > 2 ? `/${segments.slice(1).join("/")}` : `/${segments[1]}`;
    }
  }
  return segments.length ? `/${segments.join("/")}` : "/";
}

/** Client-safe `/app/*` hints when pathname diverges from the server snapshot (SPA 404). */
export function buildNotFoundAppOnlyRecoverySuggestions(pathname: string): NotFoundRecoveryLink[] {
  const out: NotFoundRecoveryLink[] = [];
  const normalized = normalizeNotFoundPathname(pathname);
  const segments = normalized.split("/").filter(Boolean);

  if (segments[0] === "app" && segments.length >= 2) {
    const seg1 = segments[1]!;
    if (seg1 === "lesson") {
      const href = sanitizeRelativeNavHrefOrFallback("/app/lessons");
      if (isSafeRelativeNavHref(href)) {
        out.push({ label: "Lessons (app)", href, hint: "Did you mean /app/lessons?" });
      }
    }
    if (seg1 === "question" || seg1 === "questions-bank") {
      const href = sanitizeRelativeNavHrefOrFallback("/app/questions");
      if (isSafeRelativeNavHref(href)) {
        out.push({ label: "Question bank", href, hint: "Practice questions live here." });
      }
    }
  }

  return dedupeRecoveryLinksStable(out);
}

export function dedupeRecoveryLinksStable(links: NotFoundRecoveryLink[]): NotFoundRecoveryLink[] {
  const seen = new Set<string>();
  const next: NotFoundRecoveryLink[] = [];
  for (const x of links) {
    const href = sanitizeRelativeNavHrefOrFallback(x.href);
    if (!isSafeRelativeNavHref(href)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    next.push({ ...x, href });
  }
  return next;
}

export function mergeNotFoundRecoveryLinks(
  smart: NotFoundRecoveryLink[],
  base: NotFoundRecoveryLink[],
  cap: number = NOT_FOUND_RECOVERY_CAP,
): NotFoundRecoveryLink[] {
  const merged = dedupeRecoveryLinksStable([...smart, ...base]);
  return merged.slice(0, Math.max(0, cap));
}

export const BROWSE_LESSONS_HREF = sanitizeRelativeNavHrefOrFallback(HUB.examLessons, "/lessons");
