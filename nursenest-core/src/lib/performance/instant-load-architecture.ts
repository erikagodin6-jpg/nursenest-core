export type InstantLoadActivity =
  | "questions"
  | "flashcards"
  | "lessons"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "loft";

export type InstantLoadPathway =
  | "rn"
  | "rpn"
  | "np"
  | "allied"
  | "newgrad"
  | "prenursing";

export type InstantLoadBudget = {
  activity: InstantLoadActivity;
  route: string;
  ttfbBudgetMs?: number;
  loadBudgetMs: number;
  manifestRequired: boolean;
  shellFirst: boolean;
  launchCacheRequired: boolean;
};

export const INSTANT_LOAD_BUDGETS: readonly InstantLoadBudget[] = [
  { activity: "questions", route: "/app/questions", ttfbBudgetMs: 500, loadBudgetMs: 2000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
  { activity: "flashcards", route: "/app/flashcards", ttfbBudgetMs: 500, loadBudgetMs: 2000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
  { activity: "lessons", route: "/app/lessons", ttfbBudgetMs: 500, loadBudgetMs: 2000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
  { activity: "clinical-skills", route: "/app/clinical-skills", loadBudgetMs: 2000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
  { activity: "pharmacology", route: "/app/pharmacology", loadBudgetMs: 2000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
  { activity: "ecg", route: "/modules/ecg/basic/lessons", loadBudgetMs: 2000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
  { activity: "cat", route: "/app/practice-tests/cat-launch", loadBudgetMs: 3000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
  { activity: "loft", route: "/app/osce", loadBudgetMs: 3000, manifestRequired: true, shellFirst: true, launchCacheRequired: true },
] as const;

export type ActivityManifestSurface =
  | "questions"
  | "flashcards"
  | "lessons"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "analytics"
  | "readiness"
  | "navigation";

export type ActivityManifest = {
  schema: "nursenest.activity_manifest.v1";
  pathway: InstantLoadPathway;
  pathwayId: string;
  generatedAt: string;
  counts: {
    questions: number | null;
    lessons: number | null;
    flashcards: number | null;
    clinicalSkills: number | null;
    pharmacology: number | null;
    ecg: number | null;
  };
  surfaces: Record<ActivityManifestSurface, { href: string; cacheKey: string; prefetch: boolean }>;
};

const PATHWAY_DEFAULTS: Record<InstantLoadPathway, { pathwayId: string; country: "US" | "CA"; tier: string }> = {
  rn: { pathwayId: "us-rn-nclex-rn", country: "US", tier: "RN" },
  rpn: { pathwayId: "ca-rpn-rex-pn", country: "CA", tier: "RPN" },
  np: { pathwayId: "ca-np-cnple", country: "CA", tier: "NP" },
  allied: { pathwayId: "us-allied-core", country: "US", tier: "ALLIED" },
  newgrad: { pathwayId: "ca-new-grad-core", country: "CA", tier: "NEW_GRAD" },
  prenursing: { pathwayId: "pre-nursing-core", country: "US", tier: "PRE_NURSING" },
};

export function instantLoadPathwayFromTier(tier: string | null | undefined): InstantLoadPathway {
  const normalized = (tier ?? "").trim().toUpperCase();
  if (normalized === "RN") return "rn";
  if (normalized === "RPN" || normalized === "LVN_LPN" || normalized === "PN") return "rpn";
  if (normalized === "NP") return "np";
  if (normalized === "ALLIED") return "allied";
  if (normalized === "NEW_GRAD") return "newgrad";
  if (normalized === "PRE_NURSING") return "prenursing";
  return "rn";
}

function query(pathwayId: string): string {
  return `?pathwayId=${encodeURIComponent(pathwayId)}`;
}

export function buildActivityManifest(args: {
  pathway?: InstantLoadPathway;
  pathwayId?: string | null;
  tier?: string | null;
  generatedAt?: string;
  counts?: Partial<ActivityManifest["counts"]>;
}): ActivityManifest {
  const pathway = args.pathway ?? instantLoadPathwayFromTier(args.tier);
  const defaults = PATHWAY_DEFAULTS[pathway];
  const pathwayId = args.pathwayId?.trim() || defaults.pathwayId;
  const qp = query(pathwayId);

  return {
    schema: "nursenest.activity_manifest.v1",
    pathway,
    pathwayId,
    generatedAt: args.generatedAt ?? new Date().toISOString(),
    counts: {
      questions: args.counts?.questions ?? null,
      lessons: args.counts?.lessons ?? null,
      flashcards: args.counts?.flashcards ?? null,
      clinicalSkills: args.counts?.clinicalSkills ?? null,
      pharmacology: args.counts?.pharmacology ?? null,
      ecg: args.counts?.ecg ?? null,
    },
    surfaces: {
      questions: { href: `/app/questions${qp}`, cacheKey: `activity:questions:${pathwayId}:v1`, prefetch: true },
      flashcards: { href: `/app/flashcards${qp}`, cacheKey: `activity:flashcards:${pathwayId}:v1`, prefetch: true },
      lessons: { href: `/app/lessons${qp}`, cacheKey: `activity:lessons:${pathwayId}:v1`, prefetch: true },
      "clinical-skills": { href: "/app/clinical-skills", cacheKey: `activity:clinical-skills:${pathwayId}:v1`, prefetch: true },
      pharmacology: { href: "/app/pharmacology", cacheKey: `activity:pharmacology:${pathwayId}:v1`, prefetch: true },
      ecg: { href: "/modules/ecg/basic/lessons", cacheKey: `activity:ecg:${pathwayId}:v1`, prefetch: true },
      analytics: { href: "/app/account/analytics", cacheKey: `activity:analytics:${pathwayId}:v1`, prefetch: true },
      readiness: { href: "/app/account/readiness", cacheKey: `activity:readiness:${pathwayId}:v1`, prefetch: true },
      navigation: { href: "/app", cacheKey: `activity:navigation:${pathwayId}:v1`, prefetch: true },
    },
  };
}

export function activityManifestSnapshotPath(pathway: InstantLoadPathway): string[] {
  return ["activity-manifests", `${pathway}-manifest.json`];
}

export function activityManifestCacheKey(pathway: InstantLoadPathway, pathwayId: string): string {
  return `manifest:activity:${pathway}:${pathwayId.replace(/[^a-z0-9_-]/gi, "_")}:v1`;
}

export const CRITICAL_PATH_EXCLUDED_WORK = [
  "analytics",
  "readiness",
  "recommendations",
  "streak",
  "achievement",
  "activity tracking",
  "engagement scoring",
] as const;

