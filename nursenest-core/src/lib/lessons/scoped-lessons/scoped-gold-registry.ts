/**
 * Injectable scoped gold-standard lessons (shared core + pathway overlays).
 * Order = remediation priority for hub injection when not duplicated in catalog.json or DB.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import {
  clinicalJudgmentHubListInput,
  CLINICAL_JUDGMENT_GOLD_SLUG,
  getClinicalJudgmentGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import {
  COPD_GOLD_STANDARD_SLUG,
  copdGoldHubListInput,
  getCopdGoldStandardLessonInput,
} from "@/lib/lessons/scoped-lessons/copd-gold-standard";
import {
  getHighAlertMedsGoldLessonInput,
  HIGH_ALERT_MEDS_GOLD_SLUG,
  highAlertMedsGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
import {
  acsGoldHubListInput,
  ACS_GOLD_SLUG,
  getAcsGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";
import {
  fluidsElectrolytesGoldHubListInput,
  FLUIDS_ELECTROLYTES_GOLD_SLUG,
  getFluidsElectrolytesGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/fluids-electrolytes-emergencies-gold-standard";
import {
  getSepsisGoldLessonInput,
  SEPSIS_GOLD_SLUG,
  sepsisGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import {
  getStrokeIcpGoldLessonInput,
  STROKE_ICP_GOLD_SLUG,
  strokeIcpGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/stroke-increased-icp-gold-standard";
import {
  getShockGoldLessonInput,
  SHOCK_GOLD_SLUG,
  shockGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/shock-gold-standard";
import {
  canadianRpnHighYieldGoldHubListInput,
  CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
  getCanadianRpnHighYieldGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/canadian-rpn-high-yield-gold-standard";

/** Minimal lesson row shape for catalog merge (matches pathway-lesson-loader `LessonInput`). */
export type ScopedGoldLessonInput = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
};

export type ScopedGoldProvider = {
  slug: string;
  topicSlug: string;
  getFullLesson: (pathwayId: string) => ScopedGoldLessonInput | null;
  getHubListRow: (pathwayId: string) => Omit<ScopedGoldLessonInput, "sections" | "preTest" | "postTest"> | null;
};

/** Highest-yield remediation wave first; wave 3 neuro/shock/RPN slice; COPD legacy gold remains last. */
export const SCOPED_GOLD_PROVIDERS: ScopedGoldProvider[] = [
  {
    slug: CLINICAL_JUDGMENT_GOLD_SLUG,
    topicSlug: "prioritization-delegation",
    getFullLesson: getClinicalJudgmentGoldLessonInput,
    getHubListRow: clinicalJudgmentHubListInput,
  },
  {
    slug: SEPSIS_GOLD_SLUG,
    topicSlug: "sepsis",
    getFullLesson: getSepsisGoldLessonInput,
    getHubListRow: sepsisGoldHubListInput,
  },
  {
    slug: FLUIDS_ELECTROLYTES_GOLD_SLUG,
    topicSlug: "fluids-electrolytes",
    getFullLesson: getFluidsElectrolytesGoldLessonInput,
    getHubListRow: fluidsElectrolytesGoldHubListInput,
  },
  {
    slug: ACS_GOLD_SLUG,
    topicSlug: "cardiovascular",
    getFullLesson: getAcsGoldLessonInput,
    getHubListRow: acsGoldHubListInput,
  },
  {
    slug: HIGH_ALERT_MEDS_GOLD_SLUG,
    topicSlug: "medication-safety",
    getFullLesson: getHighAlertMedsGoldLessonInput,
    getHubListRow: highAlertMedsGoldHubListInput,
  },
  {
    slug: STROKE_ICP_GOLD_SLUG,
    topicSlug: "neurological",
    getFullLesson: getStrokeIcpGoldLessonInput,
    getHubListRow: strokeIcpGoldHubListInput,
  },
  {
    slug: SHOCK_GOLD_SLUG,
    topicSlug: "shock",
    getFullLesson: getShockGoldLessonInput,
    getHubListRow: shockGoldHubListInput,
  },
  {
    slug: CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
    topicSlug: "delegation",
    getFullLesson: getCanadianRpnHighYieldGoldLessonInput,
    getHubListRow: canadianRpnHighYieldGoldHubListInput,
  },
  {
    slug: COPD_GOLD_STANDARD_SLUG,
    topicSlug: "copd",
    getFullLesson: getCopdGoldStandardLessonInput,
    getHubListRow: copdGoldHubListInput,
  },
];

/** Prepend registry lessons not already present in catalog.json (stable slugs). */
export function prependScopedGoldCatalogLessons(pathwayId: string, fromJson: ScopedGoldLessonInput[]): ScopedGoldLessonInput[] {
  const seen = new Set(fromJson.map((l) => l.slug));
  const prepend: ScopedGoldLessonInput[] = [];
  for (const p of SCOPED_GOLD_PROVIDERS) {
    if (seen.has(p.slug)) continue;
    const full = p.getFullLesson(pathwayId);
    if (!full) continue;
    prepend.push(full);
    seen.add(p.slug);
  }
  return [...prepend, ...fromJson];
}

/** Hub metadata rows (empty sections) for injections matching optional topic filter. */
export function scopedGoldHubRowsForPathway(pathwayId: string, topicSlugsIn?: string[]): ScopedGoldLessonInput[] {
  const out: ScopedGoldLessonInput[] = [];
  for (const p of SCOPED_GOLD_PROVIDERS) {
    if (topicSlugsIn && topicSlugsIn.length > 0 && !topicSlugsIn.includes(p.topicSlug)) continue;
    const hub = p.getHubListRow(pathwayId);
    if (!hub) continue;
    out.push({ ...hub, sections: [] });
  }
  return out;
}
