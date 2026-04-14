import Link from "next/link";
import { BookOpen, ClipboardList, GraduationCap, Layers, Library, Newspaper, Wrench } from "lucide-react";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  humanizeTopicSlug,
  pathwayMarketingQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";
import { marketingLessonsTopicClusterPath } from "@/lib/lessons/lesson-routes";
import type { PathwayLessonRelatedRef } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

type WayfindingLink = { href: string; label: string; description: string; icon: typeof BookOpen };

/**
 * Crawl-friendly internal links for pathway lesson detail: hubs, topic scope, practice, flashcards,
 * and optional curated related-lesson refs from catalog metadata (not a second related-lesson system).
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
  const examHub = buildExamPathwayPath(pathway);
  const blogHub = buildExamPathwayPath(pathway, "blog");
  const questionsMarketing = pathwayMarketingQuestionBankTopicHref(pathway, topic, slug || undefined);
  const topicCluster = marketingLessonsTopicClusterPath(lessonsBasePath, slug || undefined);
  const flashHref = slug ? `/flashcards/${encodeURIComponent(slug)}` : "/flashcards";

  const coreLinks: WayfindingLink[] = [
    {
      href: examHub,
      label: `${pathway.shortName} exam hub`,
      description: "Overview, mocks, and hub navigation for this exam track.",
      icon: GraduationCap,
    },
    {
      href: lessonsBasePath,
      label: "All lessons in this pathway",
      description: "Browse the full paginated lesson library for this hub.",
      icon: Library,
    },
    ...(slug
      ? [
          {
            href: topicCluster,
            label: `${humanizeTopicSlug(slug) || topic} lesson cluster`,
            description: "More lessons grouped with this topic on the same exam pathway.",
            icon: BookOpen,
          } satisfies WayfindingLink,
        ]
      : []),
    {
      href: questionsMarketing,
      label: slug ? "Question bank · this topic" : "Question bank · pathway",
      description: "Filtered practice items that stay inside this exam scope.",
      icon: ClipboardList,
    },
    {
      href: flashHref,
      label: slug ? `Flashcards · ${humanizeTopicSlug(slug)}` : "Flashcard library",
      description: "Active recall decks aligned by topic when available.",
      icon: Layers,
    },
    {
      href: blogHub,
      label: "Clinical articles for this exam",
      description: "Shorter reads that complement lesson study.",
      icon: Newspaper,
    },
    {
      href: "/tools",
      label: "Study tools",
      description: "Calculators and quick references that pair with exam prep.",
      icon: Wrench,
    },
  ];

  const curated: { href: string; title: string }[] = [];
  const seen = new Set<string>([currentSlug.trim()]);
  for (const ref of relatedLessonRefs ?? []) {
    if (curated.length >= 6) break;
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
      className="nn-lesson-wayfinding mx-auto mt-8 max-w-5xl rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_96%,var(--semantic-brand)_4%)] bg-[color-mix(in_srgb,var(--bg-card)_97%,var(--semantic-panel-muted)_3%)] px-4 py-4 sm:px-5 sm:py-5"
      aria-labelledby="lesson-wayfinding-heading"
    >
      <h2 id="lesson-wayfinding-heading" className="text-base font-semibold tracking-tight text-[var(--theme-heading-text)]">
        Continue studying on NurseNest
      </h2>
      <p className="mt-1 max-w-prose text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm">
        Pathway-scoped links—stay inside {pathway.shortName} while you move between lessons, questions, and tools.
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {coreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-[3.25rem] gap-3 rounded-lg border border-transparent px-2 py-2 transition hover:border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--semantic-brand)_15%)] hover:bg-[color-mix(in_srgb,var(--bg-card)_90%,var(--theme-muted-surface)_10%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--bg-card))] text-[var(--semantic-brand)]" aria-hidden>
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[var(--theme-heading-text)]">{item.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-[var(--theme-muted-text)]">{item.description}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {curated.length > 0 ? (
        <div className="mt-5 border-t border-[var(--semantic-border-soft)] pt-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--theme-muted-text)]">
            Suggested related lessons
          </p>
          <ul className="mt-2 space-y-1.5">
            {curated.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--semantic-brand)] hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  {c.title}
                  <span aria-hidden className="text-[var(--theme-muted-text)]">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[0.7rem] leading-relaxed text-[var(--theme-muted-text)]">
            Pulled from this lesson’s related-lesson map when authors provide links—additional topic matches appear in “Your
            next step” below.
          </p>
        </div>
      ) : null}
    </nav>
  );
}
