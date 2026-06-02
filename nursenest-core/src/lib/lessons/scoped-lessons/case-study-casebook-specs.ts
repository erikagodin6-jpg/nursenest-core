/**
 * Premium **clinical casebook** injectables — merges part A + B specs.
 * @see case-study-casebook-shared.ts
 */
import { CASE_STUDY_SPECS_A } from "@/lib/lessons/scoped-lessons/case-study-casebook-specs-a";
import { CASE_STUDY_SPECS_B } from "@/lib/lessons/scoped-lessons/case-study-casebook-specs-b";
import {
  caseStudyProviderFromSpec,
  type CaseStudyLessonSpec,
} from "@/lib/lessons/scoped-lessons/case-study-casebook-shared";

export const CASE_STUDY_CASEBOOK_SPECS: CaseStudyLessonSpec[] = [...CASE_STUDY_SPECS_A, ...CASE_STUDY_SPECS_B];

export const CASE_STUDY_CASEBOOK_SLUGS: string[] = CASE_STUDY_CASEBOOK_SPECS.map((s) => s.slug);

export const CASE_STUDY_CASEBOOK_PROVIDERS = CASE_STUDY_CASEBOOK_SPECS.map(caseStudyProviderFromSpec);
