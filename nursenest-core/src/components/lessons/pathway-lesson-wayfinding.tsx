import Link from "next/link";
import { BookOpen, ClipboardList, Layers, LineChart, Library } from "lucide-react";
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

type WayfindingLink = { href: string; label: string; icon: typeof BookOpen };

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
    <nav
      className="nn-lesson-wayfinding mx-auto mt-6 max-w-5xl rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--bg-card)_98%,var(--semantic-panel-muted)_2%)] px-3 py-4 sm:mt-8 sm:px-4 sm:py-5"
      aria-labelledby="lesson-wayfinding-heading"
    >
      <h2 id="lesson-wayfinding-heading" className="text-sm font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-base">
        Study support
      </h2>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {coreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-11 items-center gap-2.5 rounded-md border border-transparent px-2 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--semantic-brand)_20%)] hover:bg-[color-mix(in_srgb,var(--theme-page-bg)_92%,var(--semantic-panel-cool)_8%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]"
              >
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--bg-card))] text-[var(--semantic-brand)]"
                  aria-hidden
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {curated.length > 0 ? (
        <div className="mt-4 border-t border-[var(--semantic-border-soft)] pt-3">
          <p className="nn-lesson-module-eyebrow">Related reads</p>
          <ul className="mt-2 space-y-1">
            {curated.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,transparent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]"
                >
                  {c.title}
                  <span aria-hidden className="text-[var(--theme-muted-text)]">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
