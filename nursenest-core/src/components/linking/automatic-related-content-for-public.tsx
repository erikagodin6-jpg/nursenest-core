import "server-only";

import { RelatedContentBlock, BlogStudyNextStrip } from "@/components/linking/related-content-block";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  buildLinkContextForPublicBlogPost,
  countHighConfidenceCandidates,
  resolveAutomaticRelatedBundleForBlogPost,
  resolveAutomaticRelatedBundleForPathwayLesson,
  resolveAutomaticRelatedLinksForProgrammaticQuestionTopic,
  type BlogPostAutoLinkSource,
  type PathwayLessonAutoLinkSnapshot,
} from "@/lib/linking/automatic-internal-links";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

const MIN_PUBLIC_AUTO_LINKS = 2;

type BlogProps = {
  surface: "blog";
  post: BlogPostAutoLinkSource;
  excludeHrefs?: string[];
};

type LessonProps = {
  surface: "lesson";
  pathway: ExamPathwayDefinition;
  lesson: PathwayLessonAutoLinkSnapshot;
  locale: string;
};

type QuestionTopicProps = {
  surface: "programmatic_question";
  def: { slug: string; primaryPathwayId: string };
  locale: string;
};

export type AutomaticRelatedContentForPublicProps = BlogProps | LessonProps | QuestionTopicProps;

/**
 * Optional high-confidence related-content block for marketing surfaces.
 * Renders nothing when the merged bundle has fewer than two strong/moderate links.
 */
export async function AutomaticRelatedContentForPublic(props: AutomaticRelatedContentForPublicProps) {
  if (props.surface === "blog") {
    const resolved = await resolveAutomaticRelatedBundleForBlogPost(props.post, {
      excludeHrefs: props.excludeHrefs,
    });
    if (countHighConfidenceCandidates(resolved) < MIN_PUBLIC_AUTO_LINKS) return null;
    const context = buildLinkContextForPublicBlogPost(props.post);
    return (
      <div className="mt-10 space-y-4 not-prose">
        <BlogStudyNextStrip context={{ ...context, surface: "blog" }} resolvedLinks={resolved} />
        <RelatedContentBlock
          context={context}
          resolvedLinks={resolved}
          heading="Related lessons, practice, and reading"
        />
      </div>
    );
  }

  if (props.surface === "lesson") {
    const resolved = await resolveAutomaticRelatedBundleForPathwayLesson({
      pathway: props.pathway,
      lesson: props.lesson,
      locale: props.locale,
      includeLessonBucket: true,
    });
    if (countHighConfidenceCandidates(resolved) < MIN_PUBLIC_AUTO_LINKS) return null;
    const context = {
      surface: "lesson" as const,
      locale: props.locale,
      pathway: {
        countrySlug: props.pathway.countrySlug,
        roleTrack: props.pathway.roleTrack,
        examCode: props.pathway.examCode,
        examFamily: props.pathway.examFamily,
      },
      topicKey: props.lesson.topicSlug,
      bodySystem: props.lesson.bodySystem,
      topicHints: [props.lesson.topic, props.lesson.topicSlug],
      excludeHrefs: [],
    };
    return (
      <div className="mt-10 space-y-4 not-prose">
        <RelatedContentBlock
          context={context}
          resolvedLinks={resolved}
          heading="Related study on this pathway"
          showKinds={["lesson", "flashcard", "question", "cat"]}
        />
      </div>
    );
  }

  const resolved = resolveAutomaticRelatedLinksForProgrammaticQuestionTopic(props.def, props.locale);
  if (countHighConfidenceCandidates(resolved) < MIN_PUBLIC_AUTO_LINKS) return null;
  const pathway = getExamPathwayById(props.def.primaryPathwayId);
  const context = {
    surface: "question" as const,
    locale: props.locale,
    pathway: pathway
      ? {
          countrySlug: pathway.countrySlug,
          roleTrack: pathway.roleTrack,
          examCode: pathway.examCode,
          examFamily: pathway.examFamily,
        }
      : undefined,
    topicKey: props.def.slug.replace(/-/g, " ").slice(0, 80),
    topicHints: [props.def.slug],
    excludeHrefs: [],
  };
  return (
    <div className="mt-10 space-y-4 not-prose">
      <RelatedContentBlock
        context={context}
        resolvedLinks={resolved}
        heading="Keep studying this topic"
        showKinds={["lesson", "flashcard", "question", "cat"]}
      />
    </div>
  );
}
