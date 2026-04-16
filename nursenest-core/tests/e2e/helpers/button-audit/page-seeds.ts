import { buildExamPathwayPath, getExamPathwayById } from "../../../../src/lib/exam-pathways/exam-product-registry";
import { LESSON_FLOW_PATHWAY_QA } from "../../../../src/lib/qa/lesson-flow-pathways";

export type SeedSet = {
  id: string;
  paths: string[];
  description: string;
};

const MARKETING_PUBLIC = [
  "/",
  "/pricing",
  "/faq",
  "/blog",
  "/lessons",
  "/question-bank",
  "/flashcards",
  "/practice-exams",
  "/pre-nursing",
  "/for-institutions",
  "/login",
  "/signup",
  "/forgot-password",
];

/** Pathway marketing + lesson hubs (subset for speed — full matrix in pathway-integrity spec). */
function pathwaySeeds(): string[] {
  const out: string[] = [];
  for (const p of LESSON_FLOW_PATHWAY_QA) {
    out.push(p.hubPath, p.lessonsPath);
  }
  return out;
}

/** US + CA allied health marketing hubs (not in LESSON_FLOW_PATHWAY_QA RN/PN/NP matrix). */
function alliedMarketingSeeds(): string[] {
  const out: string[] = [];
  for (const id of ["us-allied-core", "ca-allied-core"] as const) {
    const p = getExamPathwayById(id);
    if (!p) continue;
    out.push(buildExamPathwayPath(p), buildExamPathwayPath(p, "lessons"));
  }
  return out;
}

export const GUEST_SEEDS: SeedSet = {
  id: "guest",
  description: "Public marketing + pathway hubs + allied (unauthenticated)",
  paths: [...new Set([...MARKETING_PUBLIC, ...pathwaySeeds(), ...alliedMarketingSeeds()])].sort(),
};

/** Logged-in learner surfaces (require subscriber session). */
export const PAID_LEARNER_SEEDS: SeedSet = {
  id: "paid",
  description: "Subscriber app — dashboard, study, practice, CAT entry, report card, account (non-destructive)",
  paths: [
    "/app",
    "/app/dashboard",
    "/app/lessons",
    "/app/questions",
    "/app/practice-tests",
    "/app/exams",
    "/app/flashcards",
    "/app/account",
    "/app/account/subscription",
    "/app/account/report-card",
    "/app/account/readiness",
    "/app/study-planner",
  ],
};

export const FREE_LEARNER_SEEDS: SeedSet = {
  id: "free",
  description: "Freemium subscriber — same routes as paid; entitlements may differ",
  paths: PAID_LEARNER_SEEDS.paths,
};

/** Admin — only entry + safe listing (no destructive rows). */
export const ADMIN_SEEDS: SeedSet = {
  id: "admin",
  description: "Staff admin landing (read-only probes)",
  paths: ["/admin"],
};

export function parseAllowlistEnv(): string[] | null {
  const raw = process.env.E2E_BUTTON_AUDIT_PATHS?.trim();
  if (!raw) return null;
  return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}
