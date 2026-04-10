import {
  buildExamPathwayPath,
  EXAM_PATHWAYS,
  getExamPathwayByRoute,
  resolveExamPathwayFromMarketingHubSegment,
} from "@/lib/exam-pathways/exam-product-registry";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type NotFoundRecoveryLink = {
  label: string;
  href: string;
  /** Shown as secondary line for “smart” suggestions */
  hint?: string;
};

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

function closestPathwayInFamily(countrySlug: string, roleTrack: string, wrongExam: string): ExamPathwayDefinition | undefined {
  const w = norm(wrongExam);
  const candidates = listPublicExamwaysForRoutePrefix(countrySlug, roleTrack);
  let best: ExamPathwayDefinition | undefined;
  let bestD = Infinity;
  for (const p of candidates) {
    const d = levenshtein(w, norm(p.examCode));
    if (d < bestD && d <= 2) {
      bestD = d;
      best = p;
    }
  }
  return bestD <= 2 ? best : undefined;
}

function listPublicExamwaysForRoutePrefix(countrySlug: string, roleTrack: string): ExamPathwayDefinition[] {
  const c = norm(countrySlug);
  const r = norm(roleTrack);
  return EXAM_PATHWAYS.filter((p) => norm(p.countrySlug) === c && norm(p.roleTrack) === r && p.status !== "hidden");
}

/**
 * Lightweight suggestions from the failed URL — no automatic redirects.
 */
export function buildNotFoundRecoverySuggestions(pathname: string): NotFoundRecoveryLink[] {
  const out: NotFoundRecoveryLink[] = [];
  const path = pathname.split("?")[0] ?? "";
  const segments = path.split("/").filter(Boolean);

  // Marketing exam hubs: /{country}/{role}/{exam}/...
  if (segments.length >= 3) {
    const country = segments[0]!;
    const role = segments[1]!;
    const examSeg = segments[2]!;
    const resolved =
      getExamPathwayByRoute(country, role, examSeg) ??
      resolveExamPathwayFromMarketingHubSegment(country, role, examSeg);

    if (resolved) {
      if (segments[3] === "lessons" && segments.length >= 5) {
        const hub = buildExamPathwayPath(resolved, "lessons");
        out.push({
          label: `${resolved.shortName} lesson hub`,
          href: hub,
          hint: "That lesson link may have moved — browse the hub for the right module.",
        });
      } else if (segments.length >= 4) {
        out.push({
          label: `${resolved.shortName} study hub`,
          href: buildExamPathwayPath(resolved),
          hint: "This sub-page may not exist — the pathway hub is a safe starting point.",
        });
      }
    } else {
      const guess = closestPathwayInFamily(country, role, examSeg);
      if (guess) {
        out.push({
          label: `Did you mean ${guess.shortName}?`,
          href: buildExamPathwayPath(guess),
          hint: "Closest matching exam hub for this region and role.",
        });
      }
    }
  }

  // App typos
  if (segments[0] === "app") {
    if (segments[1] === "lesson") {
      out.push({ label: "Lessons (app)", href: "/app/lessons", hint: "Did you mean /app/lessons?" });
    }
    if (segments[1] === "question" || segments[1] === "questions-bank") {
      out.push({ label: "Question bank", href: "/app/questions", hint: "Practice questions live here." });
    }
  }

  // De-dupe by href
  const seen = new Set<string>();
  return out.filter((x) => {
    if (seen.has(x.href)) return false;
    seen.add(x.href);
    return true;
  });
}

/** Public lessons browse — stable marketing entry. */
export const BROWSE_LESSONS_HREF = HUB.examLessons;
