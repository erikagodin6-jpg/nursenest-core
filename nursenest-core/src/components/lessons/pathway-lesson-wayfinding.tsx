import Link from "next/link";
import { BookOpen, ClipboardList, GraduationCap, Layers, Library, Newspaper, Wrench } from "lucide-react";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
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
      className="nn-lesson-wayfinding mx-auto mt-6 max-w-5xl rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--bg-card)_98%,var(--semantic-panel-muted)_2%)] px-3 py-3 sm:mt-8 sm:px-4 sm:py-4"
      aria-labelledby="lesson-wayfinding-heading"
    >
      <h2 id="lesson-wayfinding-heading" className="text-sm font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-base">
        Study support
      </h2>
      <p className="mt-0.5 max-w-prose text-xs leading-relaxed text-[var(--theme-muted-text)]">
        Same exam pathway—lessons, bank, and tools stay scoped.
      </p>

      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {coreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-[3rem] gap-2.5 rounded-md border border-transparent px-2 py-1.5 transition hover:border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--semantic-brand)_20%)] hover:bg-[color-mix(in_srgb,var(--theme-page-bg)_92%,var(--semantic-panel-cool)_8%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]"
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--bg-card))] text-[var(--semantic-brand)]" aria-hidden>
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--theme-heading-text)]">{item.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[var(--theme-muted-text)] sm:text-xs">{item.description}</span>
                </span>
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
