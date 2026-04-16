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
  for (const p of LESSON_FLOW_PATHWAY_QA.slice(0, 4)) {
    out.push(p.hubPath, p.lessonsPath);
  }
  return out;
}

export const GUEST_SEEDS: SeedSet = {
  id: "guest",
  description: "Public marketing + pathway hubs (unauthenticated)",
  paths: [...new Set([...MARKETING_PUBLIC, ...pathwaySeeds()])].sort(),
};

/** Logged-in learner surfaces (require subscriber session). */
export const PAID_LEARNER_SEEDS: SeedSet = {
  id: "paid",
  description: "Subscriber app — dashboard, study, practice, account (non-destructive)",
  paths: [
    "/app",
    "/app/dashboard",
    "/app/lessons",
    "/app/questions",
    "/app/practice-tests",
    "/app/flashcards",
    "/app/account",
    "/app/account/subscription",
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
