/**
 * Deterministic, admin-only launch checks (no external HTTP; filesystem + Prisma + registry evaluators).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { EXAMS_REGION_TO_MARKETING_SEGMENT } from "@/lib/marketing/expansion-exams-path-gate";
import { getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import {
  evaluateGlobalRegionLaunchReadiness,
  evaluatePathwayLaunchReadiness,
  type PathwayCountOverrides,
  type ReadinessCheck,
} from "@/lib/navigation/country-exam-launch-readiness";
import { loadAdminPathwayInventory } from "@/lib/admin/load-admin-pathway-inventory";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type LaunchWorkflowDeterministicCheck = {
  id: string;
  label: string;
  pass: boolean;
  detail?: string;
  source: "registry" | "filesystem" | "database" | "rollup";
};

function mapReadinessChecks(checks: ReadinessCheck[], source: LaunchWorkflowDeterministicCheck["source"]): LaunchWorkflowDeterministicCheck[] {
  return checks.map((c) => ({
    id: `readiness_${c.code}`,
    label: c.label,
    pass: c.pass,
    detail: c.detail,
    source,
  }));
}

function marketingExamsPagePath(segment: string): string {
  return join(process.cwd(), "src", "app", "(marketing)", "(default)", "exams", segment, "page.tsx");
}

function analyzeRegionalHubPageSource(src: string): { linkCount: number; hasBreadcrumbJsonLd: boolean; hasBreadcrumbTrail: boolean } {
  const linkCount = (src.match(/href=\"\//g) ?? []).length + (src.match(/<Link/g) ?? []).length;
  return {
    linkCount,
    hasBreadcrumbJsonLd: src.includes("BreadcrumbJsonLd"),
    hasBreadcrumbTrail: src.includes("BreadcrumbTrail"),
  };
}

async function flashcardGate(pathway: ExamPathwayDefinition): Promise<LaunchWorkflowDeterministicCheck> {
  const total = await prisma.flashcardDeck.count({ where: { pathwayId: pathway.id } });
  const published = await prisma.flashcardDeck.count({
    where: { pathwayId: pathway.id, status: ContentStatus.PUBLISHED },
  });
  if (total === 0) {
    return {
      id: "flashcards_optional",
      label: "Flashcard decks (optional for this pathway)",
      pass: true,
      detail: "No decks scoped to this pathway yet — optional unless product requires flashcards for launch.",
      source: "database",
    };
  }
  const ok = published >= 1;
  return {
    id: "flashcards_published",
    label: "At least one published flashcard deck for this pathway",
    pass: ok,
    detail: ok ? undefined : `Found ${total} deck(s) but none published — publish or remove drafts before launch.`,
    source: "database",
  };
}

export type LaunchCheckRunResult = {
  checks: LaunchWorkflowDeterministicCheck[];
  /** True when every check with `source !== 'manual'` equivalent — all automated rows pass. */
  allDeterministicPass: boolean;
  summaryLine: string;
};

export async function runPathwayLaunchDeterministicChecks(
  target: { kind: "pathway"; pathwayId: string } | { kind: "region"; region: GlobalRegionSlug },
): Promise<LaunchCheckRunResult> {
  const checks: LaunchWorkflowDeterministicCheck[] = [];

  if (target.kind === "pathway") {
    const pathway = EXAM_PATHWAYS.find((p) => p.id === target.pathwayId);
    if (!pathway) {
      return {
        checks: [
          {
            id: "pathway_registry",
            label: "Pathway exists in exam registry",
            pass: false,
            detail: `Unknown pathway id: ${target.pathwayId}`,
            source: "registry",
          },
        ],
        allDeterministicPass: false,
        summaryLine: "Pathway id not found in EXAM_PATHWAYS.",
      };
    }

    let overrides: PathwayCountOverrides | undefined;
    try {
      const inv = await loadAdminPathwayInventory({ country: "ALL" });
      const row = inv.rows.find((r) => r.pathwayId === pathway.id);
      overrides = row ? { [pathway.id]: { lessons: row.lessonsEffective, questions: row.questionsMatched } } : undefined;
    } catch {
      /* degraded — fall back to snapshot inside evaluator */
    }

    const ev = evaluatePathwayLaunchReadiness(
      pathway,
      overrides?.[pathway.id]
        ? { lessonCount: overrides[pathway.id]!.lessons, questionCount: overrides[pathway.id]!.questions }
        : undefined,
    );
    checks.push(...mapReadinessChecks(ev.checks, "registry"));
    checks.push(await flashcardGate(pathway));

    const allDeterministicPass = checks.every((c) => c.pass);
    return {
      checks,
      allDeterministicPass,
      summaryLine: allDeterministicPass
        ? `Pathway ${pathway.id}: all automated gates pass.`
        : `Pathway ${pathway.id}: fix failing checks before publish.`,
    };
  }

  const region = target.region;
  let overrides: PathwayCountOverrides | undefined;
  try {
    const inv = await loadAdminPathwayInventory({ country: "ALL" });
    const o: PathwayCountOverrides = {};
    for (const r of inv.rows) {
      o[r.pathwayId] = { lessons: r.lessonsEffective, questions: r.questionsMatched };
    }
    overrides = o;
  } catch {
    overrides = undefined;
  }

  const rollup = evaluateGlobalRegionLaunchReadiness(region, overrides);
  checks.push({
    id: "region_rollout_status",
    label: "Regional launch readiness (market + hub + SEO gates)",
    pass: rollup.status === "ready_for_review" || rollup.status === "published",
    detail: rollup.status === "ready_for_review" || rollup.status === "published" ? undefined : rollup.summary,
    source: "rollup",
  });

  const hub = getExamHubForGlobalRegion(region);
  checks.push({
    id: "region_hub_mapping",
    label: "Expansion hub route mapped (HUB_BY_REGION)",
    pass: !!hub?.hubPath?.startsWith("/"),
    detail: hub ? `Hub: ${hub.hubPath}` : "Add region to HUB_BY_REGION with a shipped /exams/… path.",
    source: "registry",
  });

  const segment = EXAMS_REGION_TO_MARKETING_SEGMENT[region];
  if (segment) {
    const pagePath = marketingExamsPagePath(segment);
    const exists = existsSync(pagePath);
    checks.push({
      id: "region_hub_page_file",
      label: "Regional exam hub page source exists",
      pass: exists,
      detail: exists ? pagePath : `Missing ${pagePath}`,
      source: "filesystem",
    });
    if (exists) {
      const src = readFileSync(pagePath, "utf8");
      const a = analyzeRegionalHubPageSource(src);
      checks.push({
        id: "region_hub_internal_links",
        label: "Hub page has internal links (min. 3 href / Link markers)",
        pass: a.linkCount >= 3,
        detail: `Counted ${a.linkCount} markers`,
        source: "filesystem",
      });
      checks.push({
        id: "region_hub_breadcrumbs",
        label: "Hub page includes breadcrumb components",
        pass: a.hasBreadcrumbJsonLd && a.hasBreadcrumbTrail,
        detail:
          a.hasBreadcrumbJsonLd && a.hasBreadcrumbTrail
            ? undefined
            : "Include BreadcrumbJsonLd + BreadcrumbTrail for SEO and navigation.",
        source: "filesystem",
      });
      checks.push({
        id: "region_hub_metadata",
        label: "Hub page defines generateMetadata (title + description)",
        pass: src.includes("generateMetadata") && src.includes("description"),
        detail: undefined,
        source: "filesystem",
      });
    }
  } else {
    checks.push({
      id: "region_segment",
      label: "URL segment mapped for /exams/{segment} (EXAMS_REGION_TO_MARKETING_SEGMENT)",
      pass: false,
      detail: "Add reverse mapping in expansion-exams-path-gate for this region.",
      source: "registry",
    });
  }

  const allDeterministicPass = checks.every((c) => c.pass);
  return {
    checks,
    allDeterministicPass,
    summaryLine: allDeterministicPass
      ? `Region ${region}: automated checks pass (remember: live publish still requires code + GLOBAL_REGION_EXPANSION_PUBLISHED).`
      : `Region ${region}: fix failing checks before marking ready to publish.`,
  };
}
