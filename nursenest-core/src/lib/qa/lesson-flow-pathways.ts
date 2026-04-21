import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Typed pathway definitions for HTTP + Playwright lesson-flow QA.
 * Add rows here when new nursing pathways ship — avoid ad hoc strings in runners.
 */
export type LessonFlowPathwayQa = {
  pathwayId: string;
  pathway: ExamPathwayDefinition;
  hubPath: string;
  lessonsPath: string;
  /** Cookie for homepage exam-card grid (`nn_marketing_region`) */
  marketingRegionCookie: "US" | "CA";
  /** Which homepage card (`rn` | `pn` | `np`) routes to this hub — see {@link marketingExamHubPath} */
  homeCardExamId: "rn" | "pn" | "np";
  /** All marketing URLs in this flow should start with this prefix (country + tier + exam) */
  marketingPathPrefix: string;
  /** Paths that must never appear when navigating inside this pathway (wrong country / wrong exam family) */
  forbiddenPathPatterns: RegExp[];
  /** Visible copy signals on lesson detail — relaxed matching (substring) */
  contentTrustMarkers: string[];
};

function cardIdForPathway(p: ExamPathwayDefinition): "rn" | "pn" | "np" {
  if (p.roleTrack === "np") return "np";
  if (p.roleTrack === "rpn" || p.roleTrack === "lpn") return "pn";
  return "rn";
}

function forbiddenPatternsForPathway(p: ExamPathwayDefinition): RegExp[] {
  const out: RegExp[] = [];
  if (p.countrySlug === "canada") {
    out.push(/\/us\/(rn|lpn|rnp|np)\//i);
  } else {
    out.push(/\/canada\/(rn|rpn|np)\//i);
  }
  if (p.id === "ca-rpn-rex-pn") {
    out.push(/\/us\/lpn\/nclex-pn/i);
    out.push(/\/rn\/nclex-rn/i);
    out.push(/\/np\/fnp/i);
  }
  if (p.id === "us-lpn-nclex-pn") {
    out.push(/\/canada\/rpn\/rex-pn/i);
    out.push(/\/rn\/nclex-rn/i);
    out.push(/\/np\/fnp/i);
  }
  if (p.roleTrack === "rn") {
    out.push(/\/lpn\/nclex-pn/i);
    out.push(/\/rpn\/rex-pn/i);
    out.push(/\/np\/fnp/i);
  }
  if (p.roleTrack === "np") {
    out.push(/\/rn\/nclex-rn/i);
    out.push(/\/lpn\/nclex-pn/i);
    out.push(/\/rpn\/rex-pn/i);
  }
  return out;
}

function trustMarkersForPathway(p: ExamPathwayDefinition): string[] {
  if (p.id === "ca-rpn-rex-pn") return ["REx", "RPN"];
  if (p.id === "us-lpn-nclex-pn") return ["NCLEX-PN", "LVN", "LPN"];
  return [p.shortName];
}

const PATHWAY_IDS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-np-fnp",
  "ca-np-cnple",
] as const;

function buildEntry(pathwayId: (typeof PATHWAY_IDS)[number]): LessonFlowPathwayQa | null {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return null;
  const hubPath = buildExamPathwayPath(pathway);
  const lessonsPath = buildExamPathwayPath(pathway, "lessons");
  const marketingRegionCookie: "US" | "CA" = pathway.countrySlug === "us" ? "US" : "CA";
  return {
    pathwayId,
    pathway,
    hubPath,
    lessonsPath,
    marketingRegionCookie,
    homeCardExamId: cardIdForPathway(pathway),
    marketingPathPrefix: hubPath.replace(/\/$/, ""),
    forbiddenPathPatterns: forbiddenPatternsForPathway(pathway),
    contentTrustMarkers: trustMarkersForPathway(pathway),
  };
}

export const LESSON_FLOW_PATHWAY_QA: LessonFlowPathwayQa[] = PATHWAY_IDS.map((id) => buildEntry(id)).filter(
  (x): x is LessonFlowPathwayQa => x != null,
);

/** Valid related-study destinations: sibling lessons, topic clusters, same-hub questions/CAT */
export function isAllowedRelatedMarketingPath(pathname: string, config: LessonFlowPathwayQa): boolean {
  const base = config.lessonsPath.replace(/\/$/, "");
  if (pathname === base || pathname === `${base}/`) return true;
  if (pathname.startsWith(`${base}/`) && pathname.includes("/topics/")) return true;
  if (pathname.startsWith(`${config.marketingPathPrefix}/`) && !pathname.includes("/topics/")) {
    return pathname.startsWith(`${base}/`);
  }
  return false;
}

/**
 * App routes: must carry the same pathwayId when present.
 */
export function assertUrlAllowedForPathway(fullUrl: string, config: LessonFlowPathwayQa): { ok: true } | { ok: false; reason: string } {
  let u: URL;
  try {
    u = new URL(fullUrl);
  } catch {
    return { ok: false, reason: "invalid URL" };
  }
  const path = u.pathname;
  const pid = u.searchParams.get("pathwayId");

  /** Marketing home and other non-pathway pages (smoke tests start here before entering a hub). */
  if (path === "/" || path === "") {
    return { ok: true };
  }

  /** Auth interstitials: validate `callbackUrl` (or `callbackUrl` next) when present. */
  if (path === "/login" || path === "/signup") {
    const cb = u.searchParams.get("callbackUrl") ?? u.searchParams.get("next");
    if (cb) {
      try {
        const inner = new URL(cb, u.origin);
        return assertUrlAllowedForPathway(inner.toString(), config);
      } catch {
        return { ok: false, reason: "invalid callbackUrl on auth page" };
      }
    }
    return { ok: true };
  }

  if (path.startsWith("/app")) {
    if (pid && pid !== config.pathwayId) {
      return { ok: false, reason: `app URL pathwayId mismatch: ${pid} vs ${config.pathwayId}` };
    }
    return { ok: true };
  }

  for (const re of config.forbiddenPathPatterns) {
    if (re.test(path + u.search)) {
      return { ok: false, reason: `forbidden pattern ${re} matched ${path}` };
    }
  }

  if (path.startsWith(config.marketingPathPrefix)) {
    return { ok: true };
  }

  if (isAllowedRelatedMarketingPath(path, config)) {
    return { ok: true };
  }

  return { ok: false, reason: `path ${path} not under ${config.marketingPathPrefix} or related lessons/topics` };
}

/** Throws with the same rules as {@link assertUrlAllowedForPathway} — for Playwright / scripts. */
export function throwIfUrlNotAllowedForPathway(fullUrl: string, config: LessonFlowPathwayQa): void {
  const r = assertUrlAllowedForPathway(fullUrl, config);
  if (!r.ok) throw new Error(r.reason);
}

/**
 * Client-safe check before following an in-app href from a pathway hub (relative paths only).
 * Uses QA rules when the pathway is in {@link LESSON_FLOW_PATHWAY_QA}; otherwise requires href under the hub root.
 */
export function isMarketingHubNavigationHrefAllowed(href: string, pathway: ExamPathwayDefinition): boolean {
  if (typeof href !== "string" || !href.startsWith("/")) return false;
  let url: URL;
  try {
    url = new URL(href, "https://nursenest.internal");
  } catch {
    return false;
  }
  const synthetic = `https://nursenest.internal${url.pathname}${url.search}`;
  const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === pathway.id);
  if (cfg) {
    return assertUrlAllowedForPathway(synthetic, cfg).ok;
  }
  const prefix = buildExamPathwayPath(pathway).replace(/\/$/, "");
  return url.pathname === prefix || url.pathname.startsWith(`${prefix}/`);
}
