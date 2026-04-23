import Link from "next/link";
import { BookOpen, ClipboardList, Layers, LineChart, Library } from "lucide-react";
import { LearnerListRowLink } from "@/components/learner-ui/learner-list-row";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import {
  humanizeTopicSlug,
  pathwayMarketingQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";
import type { PathwayLessonRelatedRef } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import { pathwayHubAppFlashcardsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

type WayfindingLink = { href: string; label: string; icon: typeof ClipboardList };

/**
 * Compact study support: four high-intent routes only (no duplicate hubs or long blurbs).
 */
export function PathwayLessonWayfinding({
  pathway,
  lessonsBasePath,
  lessonTopic,
  topicSlug,
  currentSlug,
  relatedLessonRefs,
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  lessonTopic: string;
  topicSlug: string;
  currentSlug: string;
  relatedLessonRefs?: PathwayLessonRelatedRef[] | null;
}) {
  const topic = lessonTopic.trim();
  const slug = topicSlug.trim().toLowerCase();
  const practiceHref = pathwayMarketingQuestionBankTopicHref(pathway, topic, slug || undefined);
  const flashcardsHref = loginWithCallback(pathwayHubAppFlashcardsHref(pathway.id, slug || undefined));
  const adaptiveHref = buildExamPathwayPath(pathway, "cat");
  const showAdaptive = pathwayAllowsCatAdaptiveStart(pathway);

  const coreLinks: WayfindingLink[] = [
    { href: practiceHref, label: slug ? "Practice this topic" : "Practice · pathway hub", icon: ClipboardList },
    { href: flashcardsHref, label: slug ? `Flashcards · ${humanizeTopicSlug(slug)}` : "Flashcards", icon: Layers },
    ...(showAdaptive
      ? ([{ href: adaptiveHref, label: "Adaptive test (weak areas)", icon: LineChart }] satisfies WayfindingLink[])
      : []),
    { href: lessonsBasePath, label: "All lessons", icon: Library },
  ];

  const curated: { href: string; title: string }[] = [];
  const seen = new Set<string>([currentSlug.trim()]);
  for (const ref of relatedLessonRefs ?? []) {
    if (curated.length >= 4) break;
    const s = typeof ref.slug === "string" ? ref.slug.trim() : "";
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const href = pathwayLessonMarketingDetailHref(lessonsBasePath, s);
    if (!href) continue;
    const title = ref.titleHint?.trim() || humanizeTopicSlug(s) || s;
    curated.push({ href, title });
  }

  return (
    <nav className="lv-wayfinding mx-auto mt-6 max-w-5xl sm:mt-8" aria-labelledby="lesson-wayfinding-heading">
      <h2 id="lesson-wayfinding-heading" className="lv-wayfinding__title">
        Study support
      </h2>

      <ul className="lv-wayfinding__list">
        {coreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} className="lv-wayfinding__link">
                <span className="lv-wayfinding__icon-wrap" aria-hidden>
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {curated.length > 0 ? (
        <div className="lv-wayfinding__related">
          <p className="nn-lesson-module-eyebrow">Related reads</p>
          <ul className="lv-wayfinding__related-list">
            {curated.map((c) => (
              <li key={c.href}>
                <LearnerListRowLink
                  href={c.href}
                  icon={<BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
                  label={c.title}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
