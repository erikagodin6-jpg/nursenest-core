import { isAdminOnlyFlatI18nKey } from "@/lib/i18n/i18n-admin-key-policy";

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

export const PUBLIC_I18N_SHARD_FILENAMES: readonly Exclude<I18nShardFilename, "admin">[] =
  I18N_SHARD_FILENAMES.filter(
    (name): name is Exclude<I18nShardFilename, "admin"> => name !== "admin",
  );

function firstKeySegment(key: string): string {
  const i = key.indexOf(".");
  return i === -1 ? key : key.slice(0, i);
}

const FIRST_SEGMENT_TO_SHARD: Record<string, I18nShardFilename> = {
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
  rtVentilator: "learner",

  auth: "auth",
  login: "auth",
  account: "auth",
  profile: "auth",
  app: "auth",

  paywall: "billing",
  pricing: "billing",
  upgrade: "billing",
  shop: "billing",

  nav: "nav",
  footer: "nav",
  brand: "brand",
  search: "nav",

  notFound: "errors",

  allied: "allied",
  alliedFaq: "allied",

  pages: "pages",

  components: "components",

  common: "common",
  report: "common",
  nursenest: "common",
};

function i18nShardForSegment(segment: string): I18nShardFilename {
  const shard = FIRST_SEGMENT_TO_SHARD[segment];
  if (!shard) {
    throw new Error(`[i18n-shard] Unknown first key segment "${segment}"`);
  }
  return shard;
}

export function i18nShardForKey(key: string): I18nShardFilename {
  if (!key) throw new Error("[i18n-shard] Invalid empty key");
  if (isAdminOnlyFlatI18nKey(key)) return "admin";
  const seg = firstKeySegment(key);
  if (!seg) throw new Error("[i18n-shard] Invalid empty key");
  return i18nShardForSegment(seg);
}
