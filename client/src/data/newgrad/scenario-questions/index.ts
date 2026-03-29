import type { ScenarioQuestion } from "./types";

import { interviewPreparationBehavioral } from "./interview-preparation-behavioral";
import { interviewPreparationClinical } from "./interview-preparation-clinical";
import { workplaceScenarios } from "./workplace-scenarios";
import { clinicalTransition } from "./clinical-transition";
import { professionalDevelopment } from "./professional-development";
import { careerNavigation } from "./career-navigation";

import { expandedBatch1 } from "./expanded-batch-1";
import { expandedBatch2 } from "./expanded-batch-2";
import { expandedBatch3 } from "./expanded-batch-3";
import { expandedBatch4 } from "./expanded-batch-4";
import { expandedBatch5 } from "./expanded-batch-5";

import { bulkGeneratedBatch1 } from "./bulk-generated-batch-1";
import { bulkGeneratedBatch2 } from "./bulk-generated-batch-2";
import { bulkGeneratedBatch3 } from "./bulk-generated-batch-3";
import { bulkGeneratedBatch4 } from "./bulk-generated-batch-4";
import { bulkGeneratedBatch5 } from "./bulk-generated-batch-5";
import { bulkGeneratedBatch6 } from "./bulk-generated-batch-6";
import { bulkGeneratedBatch7 } from "./bulk-generated-batch-7";
import { bulkGeneratedBatch8 } from "./bulk-generated-batch-8";
import { bulkGeneratedBatch9 } from "./bulk-generated-batch-9";
import { bulkGeneratedBatch10 } from "./bulk-generated-batch-10";
import { bulkGeneratedBatch11 } from "./bulk-generated-batch-11";
import { bulkGeneratedBatch12 } from "./bulk-generated-batch-12";
import { bulkGeneratedBatch13 } from "./bulk-generated-batch-13";
import { bulkGeneratedBatch14 } from "./bulk-generated-batch-14";
import { bulkGeneratedBatch15 } from "./bulk-generated-batch-15";
import { bulkGeneratedBatch16 } from "./bulk-generated-batch-16";
import { bulkGeneratedBatch17 } from "./bulk-generated-batch-17";

import { generatedQuestions } from "./generated-questions";
import { templateGeneratedQuestions } from "./template-generator";
import { expandedTemplateQuestions2 } from "./expanded-template-sets-2";
import { expandedTemplateQuestions3 } from "./expanded-template-sets-3";
import { expandedTemplateQuestions4 } from "./expanded-template-sets-4";
import { expandedTemplateQuestions5 } from "./expanded-template-sets-5";
import { expandedTemplateQuestions6 } from "./expanded-template-sets-6";
import { expandedTemplateQuestions7 } from "./expanded-template-sets-7";
import { expandedTemplateQuestions8 } from "./expanded-template-sets-8";
import { expandedTemplateQuestions9 } from "./expanded-template-sets-9";
import { expandedTemplateQuestions10 } from "./expanded-template-sets-10";
import { expandedTemplateQuestions11 } from "./expanded-template-sets-11";

export type { ScenarioQuestion } from "./types";
export type { InterviewSimulationSet, MockInterviewTest } from "./types";

export const allScenarioQuestions: ScenarioQuestion[] = [
  ...interviewPreparationBehavioral,
  ...interviewPreparationClinical,
  ...workplaceScenarios,
  ...clinicalTransition,
  ...professionalDevelopment,
  ...careerNavigation,
  ...expandedBatch1,
  ...expandedBatch2,
  ...expandedBatch3,
  ...expandedBatch4,
  ...expandedBatch5,
  ...bulkGeneratedBatch1,
  ...bulkGeneratedBatch2,
  ...bulkGeneratedBatch3,
  ...bulkGeneratedBatch4,
  ...bulkGeneratedBatch5,
  ...bulkGeneratedBatch6,
  ...bulkGeneratedBatch7,
  ...bulkGeneratedBatch8,
  ...bulkGeneratedBatch9,
  ...bulkGeneratedBatch10,
  ...bulkGeneratedBatch11,
  ...bulkGeneratedBatch12,
  ...bulkGeneratedBatch13,
  ...bulkGeneratedBatch14,
  ...bulkGeneratedBatch15,
  ...bulkGeneratedBatch16,
  ...bulkGeneratedBatch17,
  ...generatedQuestions,
  ...templateGeneratedQuestions,
  ...expandedTemplateQuestions2,
  ...expandedTemplateQuestions3,
  ...expandedTemplateQuestions4,
  ...expandedTemplateQuestions5,
  ...expandedTemplateQuestions6,
  ...expandedTemplateQuestions7,
  ...expandedTemplateQuestions8,
  ...expandedTemplateQuestions9,
  ...expandedTemplateQuestions10,
  ...expandedTemplateQuestions11,
];

export function getQuestionsByCategory(categoryGroup: string): ScenarioQuestion[] {
  return allScenarioQuestions.filter(q => q.categoryGroup === categoryGroup);
}

export function getQuestionsBySubcategory(subcategory: string): ScenarioQuestion[] {
  return allScenarioQuestions.filter(q => q.subcategory === subcategory);
}

export function getQuestionsByDifficulty(difficulty: string): ScenarioQuestion[] {
  return allScenarioQuestions.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, filters?: { categoryGroup?: string; difficulty?: string }): ScenarioQuestion[] {
  let pool = [...allScenarioQuestions];
  if (filters?.categoryGroup) pool = pool.filter(q => q.categoryGroup === filters.categoryGroup);
  if (filters?.difficulty) pool = pool.filter(q => q.difficulty === filters.difficulty);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
