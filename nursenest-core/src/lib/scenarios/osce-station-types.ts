import type { ExaminerQuestion, OSCEStep, OSCESkillStation } from "@legacy-client/data/osce-skills-data";

/** Stored in `OsceStation.extensions` JSON for full UI parity with legacy `OSCESkillStation`. */
export type OsceStationExtensionsV1 = {
  description?: string;
  equipment?: string[];
  commonErrors?: string[];
  passingCriteria?: string;
  clinicalPearls?: string[];
  examinerQuestions?: ExaminerQuestion[];
  teachingPoints?: string[];
  icon?: string;
  examLevel?: string;
  /** Which legacy bundle file produced this row (migration traceability). */
  importSource?: string;
};

export type OsceStationPublicDto = Pick<
  OSCESkillStation,
  | "id"
  | "title"
  | "category"
  | "difficulty"
  | "icon"
  | "description"
  | "scenarioIntro"
  | "equipment"
  | "steps"
  | "commonErrors"
  | "passingCriteria"
  | "clinicalPearls"
  | "examLevel"
  | "timeLimit"
  | "candidateInstructions"
  | "examinerChecklist"
  | "criticalFailCriteria"
  | "examinerQuestions"
  | "teachingPoints"
> & {
  /** DB primary key (admin PATCH target). Public routes continue to use `id` (slug). */
  dbId: string;
  /** Present when row is loaded from DB (omitted for legacy-bundled list). */
  isPublished?: boolean;
  sourceLegacyPath?: string | null;
};

export function osceStepsFromJson(raw: unknown): OSCEStep[] {
  if (!Array.isArray(raw)) return [];
  return raw as OSCEStep[];
}
