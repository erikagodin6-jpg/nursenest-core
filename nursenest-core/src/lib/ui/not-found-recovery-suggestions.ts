import "server-only";

import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { isSafeRelativeNavHref, sanitizeRelativeNavHrefOrFallback } from "@/lib/ui/safe-relative-href";
import {
  dedupeRecoveryLinksStable,
  normalizeNotFoundPathname,
  type NotFoundRecoveryLink,
} from "@/lib/ui/not-found-recovery";

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[n]!;
}

function pushSafe(out: NotFoundRecoveryLink[], item: NotFoundRecoveryLink): void {
  const href = sanitizeRelativeNavHrefOrFallback(item.href);
  if (!isSafeRelativeNavHref(href)) return;
  out.push({ ...item, href });
}

/** Registry-backed smart links for marketing pathway typos (server-only). Loads catalog lazily. */
export async function buildNotFoundRecoverySuggestions(pathname: string): Promise<NotFoundRecoveryLink[]> {
  const reg = await import("@/lib/exam-pathways/exam-product-registry");
  const { EXAM_PATHWAYS, getExamPathwayByRoute, resolveExamPathwayFromMarketingHubSegment } = reg;

  function listPathwaysForRoutePrefix(countrySlug: string, roleTrack: string): ExamPathwayDefinition[] {
    const c = norm(countrySlug);
    const r = norm(roleTrack);
    return EXAM_PATHWAYS.filter(
      (p) =>
        norm(p.countrySlug) === c &&
        norm(p.roleTrack) === r &&
        p.status !== "hidden" &&
        isPathwayPublishedForPublicSite(p.id),
    );
  }

  function closestPathwayInFamily(
    countrySlug: string,
    roleTrack: string,
    wrongExam: string,
  ): ExamPathwayDefinition | undefined {
    const w = norm(wrongExam);
    if (!w) return undefined;
    const candidates = listPathwaysForRoutePrefix(countrySlug, roleTrack);
    const scored: { p: ExamPathwayDefinition; d: number }[] = [];
    for (const p of candidates) {
      const d = levenshtein(w, norm(p.examCode));
      if (d <= 2) scored.push({ p, d });
    }
    if (scored.length === 0) return undefined;
    scored.sort((a, b) => {
      if (a.d !== b.d) return a.d - b.d;
      return norm(a.p.examCode).localeCompare(norm(b.p.examCode));
    });
    return scored[0]!.p;
  }

  function pathwayHrefOrSkip(p: ExamPathwayDefinition, subpath?: string): string | null {
    try {
      const href = subpath ? buildExamPathwayPath(p, subpath) : buildExamPathwayPath(p);
      return isSafeRelativeNavHref(href) ? href : null;
    } catch {
      return null;
    }
  }

  const out: NotFoundRecoveryLink[] = [];
  const normalized = normalizeNotFoundPathname(pathname);
  const segments = normalized.split("/").filter(Boolean);

  if (segments.length >= 3) {
    const country = segments[0]!;
    const role = segments[1]!;
    const examSeg = segments[2]!;
    if (country && role && examSeg) {
      const resolved =
        getExamPathwayByRoute(country, role, examSeg) ??
        resolveExamPathwayFromMarketingHubSegment(country, role, examSeg);

      if (resolved && isPathwayPublishedForPublicSite(resolved.id)) {
        if (segments[3] === "lessons" && segments.length >= 5) {
          const hub = pathwayHrefOrSkip(resolved, "lessons");
          if (hub) {
            pushSafe(out, {
              label: `${resolved.shortName} lesson hub`,
              href: hub,
              hint: "That lesson link may have moved — browse the hub for the right module.",
            });
          }
        } else if (segments.length >= 4) {
          const hub = pathwayHrefOrSkip(resolved);
          if (hub) {
            pushSafe(out, {
              label: `${resolved.shortName} study hub`,
              href: hub,
              hint: "This sub-page may not exist — the pathway hub is a safe starting point.",
            });
          }
        }
      } else {
        const guess = closestPathwayInFamily(country, role, examSeg);
        if (guess) {
          const hub = pathwayHrefOrSkip(guess);
          if (hub) {
            pushSafe(out, {
              label: `Did you mean ${guess.shortName}?`,
              href: hub,
              hint: "Closest matching exam hub for this region and role.",
            });
          }
        }
      }
    }
  }

  if (segments[0] === "app" && segments.length >= 2) {
    const seg1 = segments[1]!;
    if (seg1 === "lesson") {
      pushSafe(out, { label: "Lessons (app)", href: "/app/lessons", hint: "Did you mean /app/lessons?" });
    }
    if (seg1 === "question" || seg1 === "questions-bank") {
      pushSafe(out, { label: "Question bank", href: "/app/questions", hint: "Practice questions live here." });
    }
  }

  return dedupeRecoveryLinksStable(out);
}
