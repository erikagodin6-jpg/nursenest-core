export type EcgAuditStatus = "draft" | "review_ready" | "published";

export type EcgAuditStructuredContent = {
  key: string;
  title: string;
  route: string;
  status: EcgAuditStatus;
  sections: Record<string, string>;
};

export type EcgAuditAssetReviewStatus =
  | "curated_static"
  | "generated_review_required"
  | "publish_safe"
  | "internal_only";

export type EcgAuditQuestionSnapshot = {
  id: string;
  rhythmOrTopicKey: string;
  tags: string[];
  rationale: string | null;
  distractorRationalesComplete: boolean;
  assetReviewStatus: EcgAuditAssetReviewStatus;
  lessonStatus: EcgAuditStatus;
};

import {
  normalizeEcgQuestionTaxonomy,
  type EcgQuestionFamily,
} from "@/lib/ecg-module/ecg-question-taxonomy";

export type EcgDepthAudit = {
  coveredKeys: string[];
  missingKeys: string[];
  lessonWordCounts: Record<string, number>;
  questionCountsByKey: Record<
    string,
    {
      total: number;
      families: Record<EcgQuestionFamily, number>;
    }
  >;
  rationaleCompleteness: Record<
    string,
    {
      fullRationaleCount: number;
      distractorRationaleCount: number;
    }
  >;
  assetReviewCounts: Record<EcgAuditAssetReviewStatus, number>;
  reviewStatusCounts: Record<EcgAuditStatus, number>;
};

export type AdvancedEcgCoverageTopic = {
  key: string;
  title: string;
  route: string;
  status: EcgAuditStatus;
  wordCount: number;
  questionVolume: {
    total: number;
    strip_identification: number;
    priority_action: number;
    complication_escalation: number;
    comparison: number;
    clinical_causes: number;
    minimumsMet: boolean;
  };
  clinicalReviewRequired: boolean;
};

export type AdvancedEcgCoverageReport = {
  topics: AdvancedEcgCoverageTopic[];
  entitlementSummary: {
    advancedEcgEligible: string[];
    advancedEcgBlocked: string[];
  };
};

type AdvancedCoverageTopicInput = {
  title: string;
  status: EcgAuditStatus;
  sections: Record<string, string>;
  route?: string;
  unitSlug?: string;
} & ({ key: string } | { topicKey: string });

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function countStructuredContentWords(sections: Record<string, string>): number {
  return Object.values(sections).reduce((sum, value) => sum + countWords(value), 0);
}

function familyCounts(): Record<EcgQuestionFamily, number> {
  return {
    strip_identification: 0,
    rhythm_specific: 0,
    priority_action: 0,
    complication_escalation: 0,
    comparison: 0,
    clinical_causes: 0,
  };
}

function sortKeys(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function buildEcgDepthAudit(input: {
  expectedKeys: string[];
  coreLessons: EcgAuditStructuredContent[];
  advancedLessons: EcgAuditStructuredContent[];
  questions: EcgAuditQuestionSnapshot[];
}): EcgDepthAudit {
  const lessonWordCounts: Record<string, number> = {};
  const questionCountsByKey: EcgDepthAudit["questionCountsByKey"] = {};
  const rationaleCompleteness: EcgDepthAudit["rationaleCompleteness"] = {};
  const assetReviewCounts: EcgDepthAudit["assetReviewCounts"] = {
    curated_static: 0,
    generated_review_required: 0,
    publish_safe: 0,
    internal_only: 0,
  };
  const reviewStatusCounts: EcgDepthAudit["reviewStatusCounts"] = {
    draft: 0,
    review_ready: 0,
    published: 0,
  };

  const lessons = [...input.coreLessons, ...input.advancedLessons];
  for (const lesson of lessons) {
    lessonWordCounts[lesson.key] = countStructuredContentWords(lesson.sections);
    reviewStatusCounts[lesson.status] += 1;
  }

  for (const question of input.questions) {
    const key = question.rhythmOrTopicKey;
    if (!questionCountsByKey[key]) {
      questionCountsByKey[key] = { total: 0, families: familyCounts() };
    }
    if (!rationaleCompleteness[key]) {
      rationaleCompleteness[key] = {
        fullRationaleCount: 0,
        distractorRationaleCount: 0,
      };
    }

    questionCountsByKey[key].total += 1;
    const taxonomy = normalizeEcgQuestionTaxonomy({
      rhythmTag: question.rhythmOrTopicKey,
      topicTags: question.tags,
      clinicalPriority: null,
    });
    for (const family of taxonomy.families) {
      questionCountsByKey[key].families[family] += 1;
    }
    if (question.rationale?.trim()) rationaleCompleteness[key].fullRationaleCount += 1;
    if (question.distractorRationalesComplete) rationaleCompleteness[key].distractorRationaleCount += 1;
    assetReviewCounts[question.assetReviewStatus] += 1;
    reviewStatusCounts[question.lessonStatus] += 1;
  }

  const coveredKeys = sortKeys([
    ...lessons.map((lesson) => lesson.key),
    ...input.questions.flatMap((question) => {
      const explicit = question.tags
        .filter((tag) => tag.startsWith("rhythm:") || tag.startsWith("topic:"))
        .map((tag) => tag.replace(/^(rhythm:|topic:)/, ""));
      return [question.rhythmOrTopicKey, ...explicit];
    }),
  ]);
  const coveredSet = new Set(coveredKeys);
  const missingKeys = sortKeys(input.expectedKeys.filter((key) => !coveredSet.has(key)));

  return {
    coveredKeys,
    missingKeys,
    lessonWordCounts,
    questionCountsByKey,
    rationaleCompleteness,
    assetReviewCounts,
    reviewStatusCounts,
  };
}

export function buildAdvancedEcgCoverageReport(input: {
  topics: AdvancedCoverageTopicInput[];
  questions: EcgAuditQuestionSnapshot[];
  entitledTierLabels: string[];
  blockedTierLabels: string[];
}): AdvancedEcgCoverageReport {
  const normalizedTopics = input.topics.map((topic) => ({
    key: "key" in topic ? topic.key : topic.topicKey,
    title: topic.title,
    route: topic.route ?? (topic.unitSlug ? `/modules/ecg-advanced/${topic.unitSlug}` : ""),
    status: topic.status,
    sections: topic.sections,
  }));
  const audit = buildEcgDepthAudit({
    expectedKeys: normalizedTopics.map((topic) => topic.key),
    coreLessons: [],
    advancedLessons: normalizedTopics,
    questions: input.questions,
  });

  return {
    topics: normalizedTopics.map((topic) => {
      const counts = audit.questionCountsByKey[topic.key] ?? {
        total: 0,
        families: familyCounts(),
      };
      const wordCount = audit.lessonWordCounts[topic.key] ?? 0;
      const minimumsMet =
        counts.total >= 40 &&
        counts.families.strip_identification >= 15 &&
        counts.families.priority_action >= 10 &&
        counts.families.complication_escalation >= 5 &&
        counts.families.comparison >= 5 &&
        counts.families.clinical_causes >= 5;
      const relatedQuestions = input.questions.filter((question) => question.rhythmOrTopicKey === topic.key);
      return {
        key: topic.key,
        title: topic.title,
        route: topic.route,
        status: topic.status,
        wordCount,
        questionVolume: {
          total: counts.total,
          strip_identification: counts.families.strip_identification,
          priority_action: counts.families.priority_action,
          complication_escalation: counts.families.complication_escalation,
          comparison: counts.families.comparison,
          clinical_causes: counts.families.clinical_causes,
          minimumsMet,
        },
        clinicalReviewRequired:
          topic.status !== "published" ||
          relatedQuestions.some((question) =>
            normalizeEcgQuestionTaxonomy({
              rhythmTag: question.rhythmOrTopicKey,
              topicTags: question.tags,
              clinicalPriority: null,
            }).clinicalReviewRequired,
          ),
      };
    }),
    entitlementSummary: {
      advancedEcgEligible: [...input.entitledTierLabels],
      advancedEcgBlocked: [...input.blockedTierLabels],
    },
  };
}
