import { isAdminOnlyFlatI18nKey } from "./i18n-admin-key-policy";

/**
 * Domain shards for Next.js `public/i18n/{locale}/*.json` (flat key → string maps).
 * Each translation key is assigned by **first dot segment** (e.g. `pages.admin.foo` → `pages`).
 * Keep this mapping exhaustive: unknown segments fail the compile-time split step.
 *
 * The **`admin`** shard holds staff-only strings and is **not** written under `public/` (see
 * `script/lib/next-public-i18n-bundle.ts`). {@link isAdminOnlyFlatI18nKey} routes keys there.
 *
 * Order is stable for merges and must match across tooling + runtime loaders.
 */
export const I18N_SHARD_FILENAMES = [
  "marketing",
  "learner",
  "auth",
  "billing",
  "brand",
  "nav",
  "errors",
  "allied",
  "pages",
  "components",
  "common",
  "admin",
] as const;

export type I18nShardFilename = (typeof I18N_SHARD_FILENAMES)[number];

/** Shards deployed as static files under `public/i18n` (excludes `admin`). */
export const PUBLIC_I18N_SHARD_FILENAMES: readonly Exclude<I18nShardFilename, "admin">[] = I18N_SHARD_FILENAMES.filter(
  (n): n is Exclude<I18nShardFilename, "admin"> => n !== "admin",
);

/** First segment of a dotted key, or the full key when no dot is present. */
export function firstKeySegment(key: string): string {
  const i = key.indexOf(".");
  return i === -1 ? key : key.slice(0, i);
}

/**
 * Maps the first segment of every flat i18n key to exactly one shard file.
 * When adding new top-level key families, extend this map and add a row to i18n-validate shard checks.
 */
const FIRST_SEGMENT_TO_SHARD: Record<string, I18nShardFilename> = {
  // marketing & growth
  home: "marketing",
  faq: "marketing",
  blog: "marketing",
  programmatic: "marketing",
  preNursing: "marketing",
  prenursing: "marketing",
  certExamPrep: "marketing",
  newGrad: "marketing",
  newGradFaq: "marketing",
  intl: "marketing",
  intlNursing: "marketing",
  anatomy: "marketing",
  imaging: "marketing",
  pta: "marketing",
  paramedic: "marketing",
  mlt: "marketing",
  mltContent: "marketing",
  rexPnHub: "marketing",
  npExamHub: "marketing",
  jobs: "marketing",
  careerGuide: "marketing",
  clinicalCalculators: "marketing",
  nurseResidency: "marketing",
  nursingClinicalScenarios: "marketing",
  nursingRegulatory: "marketing",
  nursingSchools: "marketing",
  nursingStudyGuides: "marketing",
  compare: "marketing",
  conversion: "marketing",
  cta: "marketing",
  hero: "marketing",
  emailSignup: "marketing",
  startFree: "marketing",
  salaryGuide: "marketing",
  seoContent: "marketing",
  seoHub: "marketing",

  // learner product
  learner: "learner",
  lessons: "learner",
  lesson: "learner",
  pathways: "learner",
  flashcards: "learner",
  qbank: "learner",
  mockExams: "learner",
  examHub: "learner",
  examAttempt: "learner",
  dashboard: "learner",
  data: "learner",
  tools: "learner",
  skillChecklists: "learner",
  tutor: "learner",
  studyNext: "learner",
  lessonContinue: "learner",
  difficulty: "learner",
  glossary: "learner",
  medAbbreviations: "learner",
  licensingExams: "learner",

  // auth & account
  auth: "auth",
  login: "auth",
  account: "auth",
  profile: "auth",
  app: "auth",

  // monetization
  paywall: "billing",
  pricing: "billing",
  upgrade: "billing",
  shop: "billing",

  // shell / wayfinding
  nav: "nav",
  footer: "nav",
  brand: "brand",
  search: "nav",

  // errors & empty states
  notFound: "errors",

  // allied health vertical
  allied: "allied",
  alliedFaq: "allied",

  // large route-owned tables
  pages: "pages",

  // shared UI primitives
  components: "components",

  // misc shared / small roots
  common: "common",
  report: "common",
  nursenest: "common",
};

export function i18nShardForSegment(segment: string): I18nShardFilename {
  const shard = FIRST_SEGMENT_TO_SHARD[segment];
  if (!shard) {
    throw new Error(
      `[i18n-shard] Unknown first key segment "${segment}". Add it to FIRST_SEGMENT_TO_SHARD in shared/i18n-shard-policy.ts`,
    );
  }
  return shard;
}

export function i18nShardForKey(key: string): I18nShardFilename {
  if (!key) throw new Error(`[i18n-shard] Invalid empty key`);
  if (isAdminOnlyFlatI18nKey(key)) return "admin";
  const seg = firstKeySegment(key);
  if (!seg) throw new Error(`[i18n-shard] Invalid empty key`);
  return i18nShardForSegment(seg);
}

export function splitFlatBundleIntoShards(
  bundle: Record<string, string>,
): Record<I18nShardFilename, Record<string, string>> {
  const out = Object.fromEntries(I18N_SHARD_FILENAMES.map((d) => [d, {} as Record<string, string>])) as Record<
    I18nShardFilename,
    Record<string, string>
  >;
  for (const [k, v] of Object.entries(bundle)) {
    const shard = i18nShardForKey(k);
    if (out[shard][k] !== undefined) {
      throw new Error(`[i18n-shard] Duplicate key across split: "${k}"`);
    }
    out[shard][k] = v;
  }
  return out;
}

/** Merge shard objects in canonical order; throws if a key appears twice. */
export function mergeShardObjects(parts: Record<I18nShardFilename, Record<string, string>>): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const name of I18N_SHARD_FILENAMES) {
    for (const [k, v] of Object.entries(parts[name])) {
      if (k in merged) throw new Error(`[i18n-shard] Duplicate key while merging shards: "${k}"`);
      merged[k] = v;
    }
  }
  return merged;
}
