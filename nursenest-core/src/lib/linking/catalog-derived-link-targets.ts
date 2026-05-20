import "server-only";

import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { LinkTarget } from "@/lib/linking/internal-link-types";
import { getEffectiveCatalogLessonsForPathwaySync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { synonymNormalizeOrSlugify } from "@/lib/linking/topic-synonym-map";

/** Pathways included in catalog-backed registry expansion (marketing hubs with JSON catalogs). */
export const CATALOG_LINK_REGISTRY_PATHWAY_IDS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "ca-rpn-rex-pn",
  "us-lpn-nclex-pn",
  "ca-np-cnple",
  "us-np-fnp",
] as const;

const MAX_LESSONS_PER_TOPIC = 4;
const MAX_TOPICS_PER_PATHWAY = 120;

function topicHubTarget(
  topicKey: string,
  lessonsBase: string,
  label: string,
  bodySystem: string | undefined,
  examFamily: string | null,
  pathwayId: string,
): LinkTarget {
  const href = `${lessonsBase}?topicSlug=${encodeURIComponent(topicKey)}`;
  return {
    kind: "lesson",
    topicKey,
    href,
    anchorText: `browse ${label} lessons`,
    anchorVariants: [`${label} lesson hub`, `study ${label} topics`, `${label} clinical lessons`],
    bodySystem,
    examFamily,
    pathwayId,
    eligible: true,
  };
}

function lessonDetailTarget(
  topicKey: string,
  pathway: ReturnType<typeof getExamPathwayById>,
  slug: string,
  title: string,
  bodySystem: string | undefined,
): LinkTarget | null {
  if (!pathway) return null;
  const href = pathwayLessonPublicDetailPath(pathway, slug);
  if (!href) return null;
  return {
    kind: "lesson",
    topicKey,
    href,
    anchorText: `review ${title}`,
    anchorVariants: [`${title} lesson`, `study ${title}`, `${title} nursing guide`],
    bodySystem,
    examFamily: pathway.examFamily ?? null,
    pathwayId: pathway.id,
    eligible: true,
  };
}

function questionTopicTarget(
  topicKey: string,
  pathway: NonNullable<ReturnType<typeof getExamPathwayById>>,
  label: string,
  bodySystem: string | undefined,
): LinkTarget {
  const base = buildExamPathwayPath(pathway, "questions");
  return {
    kind: "question",
    topicKey,
    href: `${base}?topic=${encodeURIComponent(topicKey)}`,
    anchorText: `practice ${label} questions`,
    anchorVariants: [`${label} question bank`, `test ${label} knowledge`, `${label} NCLEX-style questions`],
    bodySystem,
    examFamily: pathway.examFamily ?? null,
    pathwayId: pathway.id,
    eligible: true,
  };
}

function flashcardTopicTarget(
  topicKey: string,
  label: string,
  bodySystem: string | undefined,
): LinkTarget {
  return {
    kind: "flashcard",
    topicKey,
    href: `/flashcards/${encodeURIComponent(topicKey)}`,
    anchorText: `review ${label} flashcards`,
    anchorVariants: [`${label} flashcard deck`, `drill ${label} with flashcards`],
    bodySystem,
    examFamily: null,
    eligible: true,
  };
}

let cachedTargets: LinkTarget[] | null = null;

/**
 * Catalog-backed link targets (deduped). Merged into {@link getTargetsForTopic} via registry bootstrap.
 * Bounded to avoid link farms — one hub + practice surfaces per topic, capped lesson detail URLs.
 */
export function getCatalogDerivedLinkTargets(): LinkTarget[] {
  if (cachedTargets) return cachedTargets;
  const seen = new Set<string>();
  const out: LinkTarget[] = [];

  const push = (t: LinkTarget | null) => {
    if (!t?.href || !t.topicKey) return;
    const key = `${t.kind}:${t.href}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(t);
  };

  for (const pathwayId of CATALOG_LINK_REGISTRY_PATHWAY_IDS) {
    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) continue;
    const lessonsBase = marketingPathwayLessonsIndexPath(pathway);
    const topicLessonCount = new Map<string, number>();
    let topicHubs = 0;

    for (const row of getEffectiveCatalogLessonsForPathwaySync(pathwayId)) {
      if (!row.structuralQuality?.publicComplete) continue;
      const slug = row.slug?.trim();
      const rawTopic = (row.topicSlug ?? row.topic ?? "").trim();
      const topicKey = synonymNormalizeOrSlugify(rawTopic) ?? rawTopic.toLowerCase().replace(/\s+/g, "-");
      if (!slug || !topicKey || topicKey.length < 2) continue;

      const label =
        row.topic?.trim() ||
        topicKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const body = row.bodySystem?.trim() || undefined;

      if (!topicLessonCount.has(topicKey)) {
        if (topicHubs >= MAX_TOPICS_PER_PATHWAY) continue;
        topicHubs += 1;
        push(topicHubTarget(topicKey, lessonsBase, label, body, pathway.examFamily ?? null, pathway.id));
        push(questionTopicTarget(topicKey, pathway, label, body));
        push(flashcardTopicTarget(topicKey, label, body));
        topicLessonCount.set(topicKey, 0);
      }

      const count = topicLessonCount.get(topicKey) ?? 0;
      if (count < MAX_LESSONS_PER_TOPIC) {
        topicLessonCount.set(topicKey, count + 1);
        push(lessonDetailTarget(topicKey, pathway, slug, row.title?.trim() || slug, body));
      }
    }
  }

  cachedTargets = out;
  return out;
}

/** Test-only reset */
export function resetCatalogDerivedLinkTargetsCacheForTests(): void {
  cachedTargets = null;
}
