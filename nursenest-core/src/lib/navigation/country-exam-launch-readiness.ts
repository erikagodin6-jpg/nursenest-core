/**
 * Country / exam **launch readiness** — strict gates so unfinished pathways cannot go live on the public site.
 *
 * - **Public routes** use committed {@link PATHWAY_READINESS_SNAPSHOT} + registry metadata only (no DB).
 * - **Admin** can pass live lesson/question counts from inventory for an accurate breakdown.
 *
 * @see PATHWAY_LAUNCH_APPROVED — human sign-off for `published`.
 */

import { ExamFamily } from "@prisma/client";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import type { CountrySlug } from "@/lib/exam-pathways/types";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import { MIN_PATHWAY_LESSONS_SCALE_TARGET } from "@/lib/lessons/pathway-lesson-scale";
import { MARKET_READINESS } from "@/lib/navigation/market-readiness-data";
import { getSnapshotCounts } from "@/lib/navigation/country-exam-readiness-snapshot";

function listPublicExamPathways(): ExamPathwayDefinition[] {
  return EXAM_PATHWAYS.filter((p) => p.status !== "hidden");
}

// ── Constants ────────────────────────────────────────────────────────────────

/** Aligns with admin inventory heuristics (`load-admin-pathway-inventory.ts`). */
export const MIN_PATHWAY_QUESTIONS_PUBLISH = 200;

const PLACEHOLDER_COPY_RE =
  /\b(coming soon|lorem ipsum|to be determined|\btbd\b|under construction|placeholder text)\b/i;

/** Pathways that must be `published` before the **US** or **Canada** country can appear publicly. */
export const PATHWAY_IDS_REQUIRED_FOR_COUNTRY_PUBLISH: Record<CountrySlug, readonly string[]> = {
  us: ["us-rn-nclex-rn", "us-lpn-nclex-pn"],
  canada: ["ca-rn-nclex-rn", "ca-rpn-rex-pn"],
};

/**
 * Explicit editorial approval for going live. Without this, max automated status is `ready_for_review`.
 * Keep in sync with pathways that have passed QA for production.
 */
export const PATHWAY_LAUNCH_APPROVED: ReadonlySet<string> = new Set([
  "us-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rn-nclex-rn",
  "ca-rpn-rex-pn",
  /** Active US NP tracks (each hub is a separate product row). */
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  /** Canadian NP hub (marketing tier surface + waitlist; content grows on snapshot). */
  "ca-np-cnple",
  /** New grad transition lessons (NEW_GRAD tier). */
  "us-rn-new-grad-transition",
  /** Allied parallel hubs. */
  "us-allied-core",
  "ca-allied-core",
]);

/** When an expansion region clears market + hub checks, add it here to allow `published` (rare). */
export const GLOBAL_REGION_EXPANSION_PUBLISHED: ReadonlySet<GlobalRegionSlug> = new Set([]);

/** Canadian CNPLE hub: marketing shell + waitlist before full lesson/question scale (see snapshot). */
const CA_NP_CNPLE_PATHWAY_ID = "ca-np-cnple";

/**
 * NP marketing hubs ship with a lower committed-lesson floor than RN/PN (pathway catalogs are smaller per track).
 * Still requires a real lesson inventory for US NP tracks; CNPLE waitlist shell is exempt via {@link CA_NP_CNPLE_PATHWAY_ID}.
 */
const NP_PUBLIC_LESSON_FLOOR = 85;

const STATUS_RANK: Record<LaunchReadinessStatus, number> = {
  draft: 0,
  needs_content: 1,
  ready_for_review: 2,
  published: 3,
};

// ── Types ────────────────────────────────────────────────────────────────────

export type LaunchReadinessStatus = "draft" | "needs_content" | "ready_for_review" | "published";

export type ReadinessCheckCode =
  | "hub_registry"
  | "exam_label"
  | "min_lessons"
  | "min_questions"
  | "public_nav"
  | "no_placeholder_copy"
  | "inventory_non_empty"
  | "route_constructible"
  | "seo_metadata"
  | "localization_scope"
  | "soft_route_sanity";

export type ReadinessCheck = {
  code: ReadinessCheckCode;
  label: string;
  pass: boolean;
  detail?: string;
};

export type PathwayLaunchEvaluation = {
  pathwayId: string;
  displayName: string;
  status: LaunchReadinessStatus;
  checks: ReadinessCheck[];
};

export type GlobalRegionLaunchEvaluation = {
  region: GlobalRegionSlug;
  status: LaunchReadinessStatus;
  /** US/CA: required pathway rollup; expansion: hub + market checks only. */
  summary: string;
  pathwayEvaluations?: PathwayLaunchEvaluation[];
};

function worstStatus(a: LaunchReadinessStatus, b: LaunchReadinessStatus): LaunchReadinessStatus {
  return STATUS_RANK[a] < STATUS_RANK[b] ? a : b;
}

function hasPlaceholderCopy(text: string | undefined): boolean {
  if (!text?.trim()) return true;
  return PLACEHOLDER_COPY_RE.test(text);
}

function marketBaseReady(region: GlobalRegionSlug): boolean {
  const m = MARKET_READINESS[region];
  if (!m) return false;
  return m.supportTier === "full" && m.conversionFunnelReady === true && m.pricingConfigured === true;
}

/**
 * Evaluate a single exam pathway. Pass live counts from admin inventory to mirror production;
 * otherwise committed snapshot counts are used (public / fast path).
 */
export function evaluatePathwayLaunchReadiness(
  pathway: ExamPathwayDefinition,
  overrides?: { lessonCount?: number; questionCount?: number },
): PathwayLaunchEvaluation {
  const snap = getSnapshotCounts(pathway.id);
  const lessons = overrides?.lessonCount ?? snap.lessons;
  const questions = overrides?.questionCount ?? snap.questions;

  const checks: ReadinessCheck[] = [];

  const hubOk = pathway.status !== "hidden";
  checks.push({
    code: "hub_registry",
    label: "Pathway registered & hub visible",
    pass: hubOk,
    detail: hubOk ? undefined : "Pathway is hidden or not registered for public hubs",
  });

  const labelOk =
    pathway.displayName.trim().length >= 6 &&
    !hasPlaceholderCopy(pathway.displayName) &&
    pathway.shortName.trim().length >= 2;
  checks.push({
    code: "exam_label",
    label: "Exam display name / short name look intentional",
    pass: labelOk,
    detail: labelOk ? undefined : "Titles too short or contain placeholder language",
  });

  const isCaNpCnpleWaitlistShell = pathway.id === CA_NP_CNPLE_PATHWAY_ID;
  const isNpFamily = pathway.examFamily === ExamFamily.NP;
  const minLessonsRequired = isCaNpCnpleWaitlistShell
    ? 0
    : isNpFamily
      ? NP_PUBLIC_LESSON_FLOOR
      : MIN_PATHWAY_LESSONS_SCALE_TARGET;
  const lessonsOk = lessons >= minLessonsRequired;
  checks.push({
    code: "min_lessons",
    label: `At least ${minLessonsRequired} lessons (effective)`,
    pass: lessonsOk,
    detail: lessonsOk ? undefined : `Have ${lessons}; target ${minLessonsRequired}+`,
  });

  const minQuestionsRequired = isCaNpCnpleWaitlistShell ? 0 : MIN_PATHWAY_QUESTIONS_PUBLISH;
  const questionsOk = questions >= minQuestionsRequired;
  checks.push({
    code: "min_questions",
    label: `At least ${minQuestionsRequired} published questions matched to pathway`,
    pass: questionsOk,
    detail: questionsOk ? undefined : `Have ${questions}; target ${minQuestionsRequired}+`,
  });

  const inNav = listPublicExamPathways().some((p) => p.id === pathway.id);
  checks.push({
    code: "public_nav",
    label: "Listed for public marketing pathways",
    pass: inNav,
    detail: inNav ? undefined : "Not included in public pathway list",
  });

  const seoClean = !hasPlaceholderCopy(pathway.seoTitle) && !hasPlaceholderCopy(pathway.seoDescription);
  checks.push({
    code: "no_placeholder_copy",
    label: "No placeholder copy in SEO fields",
    pass: seoClean,
    detail: seoClean ? undefined : "SEO title or description matches placeholder heuristics",
  });

  const nonEmpty = isCaNpCnpleWaitlistShell || (lessons >= 1 && questions >= 1);
  checks.push({
    code: "inventory_non_empty",
    label: "Non-empty lesson & question inventory",
    pass: nonEmpty,
    detail: nonEmpty ? undefined : "Need at least one lesson and one question",
  });

  let routeOk = false;
  try {
    const href = buildExamPathwayPath(pathway);
    routeOk = typeof href === "string" && href.startsWith("/") && href.length > 3;
  } catch {
    routeOk = false;
  }
  checks.push({
    code: "route_constructible",
    label: "Marketing hub URL can be constructed",
    pass: routeOk,
    detail: routeOk ? undefined : "buildExamPathwayPath failed",
  });

  const seoMetaOk =
    (pathway.seoTitle?.trim().length ?? 0) >= 12 && (pathway.seoDescription?.trim().length ?? 0) >= 24;
  checks.push({
    code: "seo_metadata",
    label: "SEO title & description present",
    pass: seoMetaOk,
    detail: seoMetaOk ? undefined : "Fill seoTitle / seoDescription in exam registry",
  });

  const region = pathway.countrySlug === "us" ? "us" : "canada";
  const mr = MARKET_READINESS[region];
  const locOk =
    !!mr &&
    (mr.hasTranslatedContent ||
      (REGION_CONFIG[region].allowedLocales.length > 0 && REGION_CONFIG[region].defaultLocale === "en"));
  checks.push({
    code: "localization_scope",
    label: "Localization meets launch scope (or English-default with plan)",
    pass: locOk,
    detail: locOk ? undefined : "Region market config incomplete",
  });

  const softRouteOk =
    (pathway.status === "active" || pathway.status === "upcoming") && pathway.acquisitionMode !== "info_only";
  checks.push({
    code: "soft_route_sanity",
    label: "Deep link / soft-404 audit (manual)",
    pass: softRouteOk,
    detail: softRouteOk
      ? "Use crawl / Playwright for full verification"
      : "Hidden or info-only pathways need route audit before launch",
  });

  const automatedPass = checks.every((c) => c.pass);
  const approved = PATHWAY_LAUNCH_APPROVED.has(pathway.id);

  let status: LaunchReadinessStatus;
  if (!hubOk || pathway.status === "hidden") {
    status = "draft";
  } else if (!automatedPass) {
    const contentMiss = checks.some(
      (c) => !c.pass && (c.code === "min_lessons" || c.code === "min_questions" || c.code === "inventory_non_empty"),
    );
    status = contentMiss ? "needs_content" : "draft";
  } else if (!approved) {
    status = "ready_for_review";
  } else {
    status = "published";
  }

  return {
    pathwayId: pathway.id,
    displayName: pathway.displayName,
    status,
    checks,
  };
}

function evaluateCountrySlugLaunch(country: CountrySlug, overrides?: PathwayCountOverrides): GlobalRegionLaunchEvaluation {
  const requiredIds = PATHWAY_IDS_REQUIRED_FOR_COUNTRY_PUBLISH[country];
  const pathwayById = new Map(EXAM_PATHWAYS.map((p) => [p.id, p]));
  const evaluations: PathwayLaunchEvaluation[] = [];

  let rolled: LaunchReadinessStatus = "published";

  for (const id of requiredIds) {
    const p = pathwayById.get(id);
    if (!p) {
      rolled = worstStatus(rolled, "draft");
      evaluations.push({
        pathwayId: id,
        displayName: "(missing from registry)",
        status: "draft",
        checks: [
          {
            code: "hub_registry",
            label: "Pathway registered",
            pass: false,
            detail: "ID not found in EXAM_PATHWAYS",
          },
        ],
      });
      continue;
    }
    const o = overrides?.[id];
    const ev = evaluatePathwayLaunchReadiness(p, o ? { lessonCount: o.lessons, questionCount: o.questions } : undefined);
    evaluations.push(ev);
    rolled = worstStatus(rolled, ev.status);
  }

  const region: GlobalRegionSlug = country === "us" ? "us" : "canada";
  if (!marketBaseReady(region)) {
    rolled = worstStatus(rolled, "draft");
  }

  return {
    region,
    status: rolled,
    summary:
      rolled === "published"
        ? "All required pathways published; market gates satisfied."
        : "See required pathway rows — worst status wins for the country.",
    pathwayEvaluations: evaluations,
  };
}

export type PathwayCountOverrides = Record<string, { lessons: number; questions: number } | undefined>;

/**
 * Expansion / international regions (not primary US/CA exam hubs): marketing-only gate from {@link MARKET_READINESS}
 * plus a shipped `/exams/…` hub when present.
 */
export function evaluateGlobalRegionLaunchReadiness(
  region: GlobalRegionSlug,
  pathwayCountOverrides?: PathwayCountOverrides,
): GlobalRegionLaunchEvaluation {
  if (region === "us") {
    return evaluateCountrySlugLaunch("us", pathwayCountOverrides);
  }
  if (region === "canada") {
    return evaluateCountrySlugLaunch("canada", pathwayCountOverrides);
  }

  const m = MARKET_READINESS[region];
  if (!m) {
    return { region, status: "draft", summary: "Unknown region" };
  }

  const hub = getExamHubForGlobalRegion(region);
  const hubOk = !!hub?.hubPath?.startsWith("/");

  if (!marketBaseReady(region)) {
    return {
      region,
      status: "draft",
      summary: "Market not configured for full public launch (tier / pricing / funnel).",
    };
  }

  if (!hubOk) {
    return {
      region,
      status: "needs_content",
      summary: "No shipped expansion hub mapping (HUB_BY_REGION).",
    };
  }

  if (!m.seoEnabled || hasPlaceholderCopy(REGION_CONFIG[region]?.displayName)) {
    return { region, status: "needs_content", summary: "SEO or region label incomplete." };
  }

  if (GLOBAL_REGION_EXPANSION_PUBLISHED.has(region)) {
    return {
      region,
      status: "published",
      summary: "Expansion region approved for public surfaces (see GLOBAL_REGION_EXPANSION_PUBLISHED).",
    };
  }

  return {
    region,
    status: "ready_for_review",
    summary: "Market gates green and hub mapped — add to GLOBAL_REGION_EXPANSION_PUBLISHED after QA.",
  };
}

/** True when the region may appear in public country dropdowns / hubs. */
export function isRegionPublishedForPublicSite(region: GlobalRegionSlug): boolean {
  return evaluateGlobalRegionLaunchReadiness(region).status === "published";
}

// ── Public pathway visibility (snapshot-only; no live DB) ─────────────────────

/**
 * Same inputs the live site should use for gating: committed snapshot counts + registry + {@link PATHWAY_LAUNCH_APPROVED}.
 * Use this instead of live inventory for hot paths (nav, sitemap, programmatic SEO registry).
 */
export function evaluatePathwayLaunchReadinessFromSnapshot(pathway: ExamPathwayDefinition): PathwayLaunchEvaluation {
  const snap = getSnapshotCounts(pathway.id);
  return evaluatePathwayLaunchReadiness(pathway, {
    lessonCount: snap.lessons,
    questionCount: snap.questions,
  });
}

/** True when this pathway may appear in public marketing nav, sitemaps, and pathway pickers. */
export function isPathwayPublishedForPublicSite(pathwayId: string): boolean {
  const pathway = EXAM_PATHWAYS.find((p) => p.id === pathwayId);
  if (!pathway || pathway.status === "hidden") return false;
  return evaluatePathwayLaunchReadinessFromSnapshot(pathway).status === "published";
}

/**
 * Subset of {@link listPublicExamPathways} that is fully launch-ready for end users.
 * Draft / needs_content / ready_for_review pathways stay admin-only.
 */
export function listPublishedExamPathwaysForPublicSite(): ExamPathwayDefinition[] {
  return listPublicExamPathways().filter(
    (p) => evaluatePathwayLaunchReadinessFromSnapshot(p).status === "published",
  );
}
