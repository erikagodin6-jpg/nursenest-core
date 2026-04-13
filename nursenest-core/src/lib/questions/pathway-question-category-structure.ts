import {
  classifyLearningTopic,
  learningConfigForPathwayId,
  type LearningCategory,
} from "@/lib/pathways/pathway-learning-structure";

export type QuestionCategoryDefinition = LearningCategory;

export function questionCategoryStructureForPathway(pathwayId: string): QuestionCategoryDefinition[] {
  return learningConfigForPathwayId(pathwayId).categories;
}

export function classifyQuestionTopicIntoLessonCategory(
  topicLabel: string,
  pathwayId: string,
): { categoryId: string; subcategoryId?: string } {
  return classifyLearningTopic(topicLabel, pathwayId);
}

