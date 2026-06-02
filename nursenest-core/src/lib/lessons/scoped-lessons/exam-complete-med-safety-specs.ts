/**
 * Registry wiring for exam-complete medication & safety family lessons.
 */
import { bulkRowToSpec } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-builder";
import { EXAM_COMPLETE_MED_SAFETY_ROWS } from "@/lib/lessons/scoped-lessons/exam-complete-med-safety-rows";
import {
  wave1ProviderFromSpec,
  type Wave1ScopedGoldProvider,
} from "@/lib/lessons/scoped-lessons/launch-wave-1-shared";

export const EXAM_COMPLETE_MED_SAFETY_SPECS = EXAM_COMPLETE_MED_SAFETY_ROWS.map(bulkRowToSpec);

export const EXAM_COMPLETE_MED_SAFETY_PROVIDERS: Wave1ScopedGoldProvider[] =
  EXAM_COMPLETE_MED_SAFETY_SPECS.map(wave1ProviderFromSpec);

export const EXAM_COMPLETE_MED_SAFETY_SLUGS: string[] = EXAM_COMPLETE_MED_SAFETY_ROWS.map((r) => r.slug);
