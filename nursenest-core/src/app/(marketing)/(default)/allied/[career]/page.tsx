import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, HelpCircle, Layers, ClipboardCheck, ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { resolveAlliedProfessionFromRouteSlug, ALLIED_HUB_CATEGORY_META } from "@/lib/allied/allied-professions-registry";
import { alliedHealthLessonsIndexPath, alliedHealthSegmentPath } from "@/lib/lessons/lesson-routes";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ career: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { career } = await params;
  return safeGenerateMetadata(
    async () => {
      const prof = resolveAlliedProfessionFromRouteSlug(career);
      if (!prof) return { title: "Not found" };
      const path = `/allied/${prof.professionKey}`;
      return {
        title: `${prof.h1} | Allied Health | NurseNest`,
        description: prof.description,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: {
          title: prof.h1,
          description: prof.description,
          url: absoluteUrl(path),
          type: "website",
        },
      };
    },
    { pathname: `/allied/${career}`, routeGroup: "marketing.default.allied.career" },
  );
}

const STUDY_MODES = [
  {
    key: "lessons",
    label: "Lessons",
    description: "System-based lessons covering core concepts, protocols, and clinical reasoning.",
    icon: BookOpen,
    accent: {
      bg: "bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))]",
      border: "border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))]",
      icon: "text-[var(--semantic-info)]",
      iconBg: "bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))]",
      link: "text-[var(--semantic-info)]",
    },
    suffix: "/lessons",
  },
  {
    key: "questions",
    label: "Practice Questions",
    description: "Scenario-based multiple-choice questions with rationales.",
    icon: HelpCircle,
    accent: {
      bg: "bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))]",
      border: "border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))]",
      icon: "text-[var(--semantic-success)]",
      iconBg: "bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))]",
      link: "text-[var(--semantic-success)]",
    },
    suffix: "/questions",
  },
  {
    key: "flashcards",
    label: "Flashcards",
    description: "Active recall decks covering terms, diseases, labs, and interventions.",
    icon: Layers,
    accent: {
      bg: "bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))]",
      border: "border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))]",
      icon: "text-[var(--semantic-warning)]",
      iconBg: "bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]",
      link: "text-[var(--semantic-warning)]",
    },
    suffix: "/flashcards",
  },
  {
    key: "exams",
    label: "Exam Readiness",
    description: "Computer-adaptive tests and timed practice exams to gauge your readiness.",
    icon: ClipboardCheck,
    accent: {
      bg: "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]",
      border: "border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))]",
      icon: "text-[var(--semantic-brand)]",
      iconBg: "bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]",
      link: "text-[var(--semantic-brand)]",
    },
    suffix: "/exams",
  },
];

export default async function AlliedCareerHubPage({ params }: Props) {
  const { career } = await params;
  const prof = resolveAlliedProfessionFromRouteSlug(career);
  if (!prof) notFound();

  const careerBasePath = `/allied/${prof.professionKey}`;
  const legacyLessonsPath = alliedHealthLessonsIndexPath(prof.professionKey);
  const legacyHeroPath = alliedHealthSegmentPath(prof.segment);

  const categoryMeta = ALLIED_HUB_CATEGORY_META[prof.hubCategory];

  const crumbs = [
    { name: "Allied Health", href: "/allied-health" },
    { name: prof.h1, href: careerBasePath },
  ];
  const schemaItems = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "Allied Health", item: absoluteUrl("/allied-health") },
    { name: prof.h1, item: absoluteUrl(careerBasePath) },
  ];

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>

        {/* Hero */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">
            Allied Health · {categoryMeta.label}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            {prof.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--theme-muted-text)]">{prof.description}</p>
        </div>

        {/* Study mode cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STUDY_MODES.map((mode) => {
            const Icon = mode.icon;
            const href =
              mode.key === "lessons"
                ? legacyLessonsPath
                : mode.key === "questions"
                  ? `${careerBasePath}/questions`
                  : mode.key === "flashcards"
                    ? `${careerBasePath}/flashcards`
                    : `${careerBasePath}/exams`;
            return (
              <Link
                key={mode.key}
                href={href}
                className={`group flex flex-col gap-3 rounded-2xl border p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-md ${mode.accent.bg} ${mode.accent.border}`}
              >
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${mode.accent.iconBg}`}
                  aria-hidden
                >
                  <Icon className={`h-5 w-5 ${mode.accent.icon}`} strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--theme-heading-text)]">{mode.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">{mode.description}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${mode.accent.link}`}>
                  Open
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Exam overview */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Exam overview</h2>
          <ul className="mt-4 space-y-3">
            {prof.examOverview.map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--theme-body-text)]"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]" aria-hidden>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--semantic-brand)]" />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">How NurseNest supports this track</h2>
          <ul className="mt-4 space-y-2">
            {prof.features.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-[var(--theme-muted-text)]">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 shadow-[var(--semantic-shadow-soft)]">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Ready to start?</h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{prof.ctaLine}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={legacyLessonsPath}
              className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--semantic-brand)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]"
            >
              Browse lessons →
            </Link>
            <Link
              href={legacyHeroPath}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--semantic-panel-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)]"
            >
              Exam overview
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--semantic-border-soft)] px-6 py-2 text-sm font-semibold text-[var(--theme-muted-text)] transition hover:text-[var(--theme-heading-text)] focus-visible:outline-none"
            >
              View plans
            </Link>
          </div>
        </section>

        {/* Back to hub */}
        <p className="mt-8 text-center">
          <Link href="/allied-health" className="text-sm font-medium text-[var(--semantic-brand)] hover:underline">
            ← All allied health careers
          </Link>
        </p>
      </div>
    </div>
  );
}
