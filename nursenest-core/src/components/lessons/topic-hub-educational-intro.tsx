import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { TopicHubLearningGraph } from "@/components/lessons/topic-hub-learning-graph";
import {
  topicHubEducationalIntro,
  topicHubEducationalIntroLinks,
} from "@/lib/seo/topic-hub-educational-intros";

/**
 * Lightweight educational framing for `?topicSlug=` lesson hubs (not filler SEO copy).
 */
export function TopicHubEducationalIntro({ pathway, topicSlug }: { pathway: ExamPathwayDefinition; topicSlug: string }) {
  const intro = topicHubEducationalIntro(topicSlug);
  if (!intro) return null;
  const links = topicHubEducationalIntroLinks(pathway, topicSlug);

  return (
    <section
      className="mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-info)_8%)] bg-[color-mix(in_srgb,var(--semantic-surface)_96%,var(--semantic-panel-cool)_4%)] px-4 py-5 sm:px-6"
      aria-labelledby="topic-hub-edu-heading"
      data-nn-topic-hub-intro
    >
      <h2 id="topic-hub-edu-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
        {intro.title} — clinical competency area
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--theme-body-text)]">
        {intro.paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--semantic-text-secondary)]">
        <Link href={links.lessonsHub} className="font-medium text-primary hover:underline">
          All {intro.title} lessons
        </Link>
        <span aria-hidden className="mx-1.5 text-[var(--theme-separator)]">
          ·
        </span>
        <Link href={links.questions} className="font-medium text-primary hover:underline">
          {links.examName} practice questions
        </Link>
        <span aria-hidden className="mx-1.5 text-[var(--theme-separator)]">
          ·
        </span>
        <Link href={links.flashcards} className="font-medium text-primary hover:underline">
          Flashcard drill
        </Link>
      </p>
      <TopicHubLearningGraph pathway={pathway} topicSlug={topicSlug} />
    </section>
  );
}
