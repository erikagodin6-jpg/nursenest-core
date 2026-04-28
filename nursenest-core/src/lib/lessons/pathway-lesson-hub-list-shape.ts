import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/**
 * Hub index shape: metadata + structural gate; no section bodies, pre/post tests, or question payloads.
 * Shared by {@link getPathwayLessonsPageFresh} list paths and bundled catalog hub surfaces so category-first
 * hubs do not retain full lesson JSON in memory.
 */
export function stripPathwayLessonToHubListShape(full: PathwayLessonRecord): PathwayLessonRecord {
  return {
    slug: full.slug,
    title: full.title,
    topic: full.topic,
    topicSlug: full.topicSlug,
    system: full.system ?? full.bodySystem,
    bodySystem: full.bodySystem,
    previewSectionCount: full.previewSectionCount,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
    sections: [],
    structuralQuality: full.structuralQuality,
    localeMeta: full.localeMeta,
    ...(full.audienceTiers?.length ? { audienceTiers: full.audienceTiers } : {}),
    ...(full.countryScope ? { countryScope: full.countryScope } : {}),
    ...(full.examRelevance ? { examRelevance: full.examRelevance } : {}),
    ...(full.relatedLessonRefs?.length ? { relatedLessonRefs: full.relatedLessonRefs } : {}),
    ...(full.premiumOmittedSections?.length ? { premiumOmittedSections: full.premiumOmittedSections } : {}),
    ...(full.audioUrl ? { audioUrl: full.audioUrl } : {}),
    ...(full.exams?.length ? { exams: full.exams } : {}),
    ...(full.countries?.length ? { countries: full.countries } : {}),
    ...(full.priority ? { priority: full.priority } : {}),
    ...(full.examMeta?.length ? { examMeta: full.examMeta } : {}),
    ...(full.activeExamMeta ? { activeExamMeta: full.activeExamMeta } : {}),
    ...(full.premiumValidation ? { premiumValidation: full.premiumValidation } : {}),
  };
}
