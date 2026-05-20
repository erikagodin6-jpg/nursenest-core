import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { TierCode } from "@prisma/client";

import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  buildPremiumMarketingModuleCards,
  type PremiumHubModuleKey,
} from "@/lib/marketing/exam-pathway-hub-premium-modules";
import { CANADA_NEW_GRAD_MARKETING_HUB_PATH, US_NEW_GRAD_MARKETING_HUB_PATH } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { US_NEW_GRAD_TRANSITION_PATHWAY_ID } from "@/lib/navigation/marketing-pathway-nav-destinations";

const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(HERE, "..", "..", "content", "pathway-lessons", "new-grad-transition-catalog.json");

/** Product minimums for New Grad RN transition (enforced in QA reports; expand content before tightening CI gates). */
export const NEW_GRAD_MINIMUM_CONTENT = {
  lessons: 60,
  flashcards: 300,
  practiceQuestions: 300,
  practiceExamsOrSets: 2,
  catSessionsIfSupported: 1,
  clinicalJudgmentNgnStyle: 30,
  prioritizationDelegation: 30,
  patientSafety: 30,
  medicationDrillItems: 30,
  skillsRefresherItems: 25,
  labDiagnosticItems: 20,
  medCalculationItems: 20,
  communicationSbarProfessionalism: 20,
  scenarioCaseStudyQuestions: 20,
  readinessProgressStudyPlanModules: 1,
  weakStrongAreaReportingModules: 1,
} as const;

export type NewGradCatalogShape = {
  version?: number;
  meta?: { totalLessons?: number; totalQuestions?: number; pathway?: string };
  pathways?: Record<string, { lessons?: unknown[] }>;
};

export function loadNewGradTransitionCatalog(): NewGradCatalogShape | null {
  try {
    return JSON.parse(readFileSync(CATALOG_PATH, "utf8")) as NewGradCatalogShape;
  } catch {
    return null;
  }
}

export function newGradCatalogLessonCount(): { count: number; source: "catalog" | "missing" } {
  const j = loadNewGradTransitionCatalog();
  const bucket = j?.pathways?.[US_NEW_GRAD_TRANSITION_PATHWAY_ID]?.lessons;
  if (Array.isArray(bucket)) return { count: bucket.length, source: "catalog" };
  const meta = j?.meta?.totalLessons;
  if (typeof meta === "number" && Number.isFinite(meta)) return { count: meta, source: "catalog" };
  return { count: 0, source: "missing" };
}

export function listNewGradExamPathwaysFromRegistry() {
  return EXAM_PATHWAYS.filter((p) => p.stripeTier === TierCode.NEW_GRAD || p.id.includes("new-grad"));
}

export type NewGradExpectedPremiumKeys = {
  studyTools: PremiumHubModuleKey[];
  readiness: PremiumHubModuleKey[];
  newGradStrip: PremiumHubModuleKey[];
};

export function expectedNewGradPremiumModuleKeys(
  clinicalScenariosPublic: boolean,
  oscePublic: boolean,
): NewGradExpectedPremiumKeys {
  const pathway = EXAM_PATHWAYS.find((p) => p.id === US_NEW_GRAD_TRANSITION_PATHWAY_ID);
  if (!pathway) {
    return { studyTools: [], readiness: [], newGradStrip: [] };
  }
  const m = buildPremiumMarketingModuleCards(pathway, { clinicalScenariosPublic, oscePublic });
  return {
    studyTools: m.studyTools.map((c) => c.key),
    readiness: m.readiness.map((c) => c.key),
    newGradStrip: m.newGrad.map((c) => c.key),
  };
}

export const NEW_GRAD_PUBLIC_SURFACE = {
  transitionHubPath: "/us/rn/new-grad-transition",
  usMarketingHub: US_NEW_GRAD_MARKETING_HUB_PATH,
  canadaMarketingHub: CANADA_NEW_GRAD_MARKETING_HUB_PATH,
  primaryPathwayId: US_NEW_GRAD_TRANSITION_PATHWAY_ID,
} as const;
