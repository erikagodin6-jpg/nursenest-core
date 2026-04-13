import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { PreNursingQuizRunner } from "@/components/pre-nursing/pre-nursing-quiz-runner";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import { BANK_MODULE_SLUGS, getQuestionsForModule } from "@/lib/pre-nursing/pre-nursing-question-bank";
import { buildPracticeExam } from "@/lib/pre-nursing/pre-nursing-exam-engine";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const dict = strings as Record<string, string>;

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  // Only generate pages for modules with questions in the bank
  return BANK_MODULE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return safeGenerateMetadata(
    async () => {
      const meta = PRE_NURSING_MODULE_REGISTRY.find((m) => m.slug === slug);
      if (!meta) return { title: "Not found" };
      const title = dict[meta.titleKey] ?? slug;
      const metaTitle = `${title} Practice Exam | Free Pre-Nursing | NurseNest`;
      const description = `Free practice exam for pre-nursing students covering ${title}. Get instant feedback and rationale on every question.`;
      const path = `/pre-nursing/practice/${slug}`;
      return {
        title: metaTitle,
        description,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: { title: metaTitle, description, url: absoluteUrl(path), type: "website" },
      };
    },
    { pathname: `/pre-nursing/practice/${slug}`, routeGroup: "marketing.default.pre_nursing.practice" },
  );
}

export default async function PreNursingPracticeExamPage({ params }: Props) {
  const { slug } = await params;

  // Ensure module exists in registry
  const meta = PRE_NURSING_MODULE_REGISTRY.find((m) => m.slug === slug);
  if (!meta) notFound();

  // Ensure questions exist for this module
  const available = getQuestionsForModule(slug);
  if (available.length === 0) notFound();

  const title = dict[meta.titleKey] ?? slug;
  const subtitle = dict[meta.subtitleKey] ?? "";

  // Build a balanced practice set (10 questions)
  // Note: buildPracticeExam uses Math.random — safe for server-render since
  // this page is force-dynamic. Each load gets a fresh set.
  const questions = buildPracticeExam({ moduleSlug: slug, questionCount: 10 });

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Pre-Nursing", href: "/pre-nursing" },
    { label: "Lessons", href: "/pre-nursing/lessons" },
    { label: title, href: `/pre-nursing/lessons/${slug}` },
    { label: "Practice Exam", href: `/pre-nursing/practice/${slug}` },
  ];

  const schemaItems = crumbs.map((c, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: c.label,
    item: absoluteUrl(c.href),
  }));

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-4">
          <BreadcrumbTrail items={crumbs} />
        </div>

        <Link
          href={`/pre-nursing/lessons/${slug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-muted-text)] hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {title} module
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--semantic-brand)" }}
          >
            Practice Exam
          </p>
          <h1
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: "var(--theme-heading-text)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Quiz runner card */}
        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            borderColor: "var(--semantic-border-soft)",
            background: "var(--semantic-surface)",
          }}
        >
          <PreNursingQuizRunner
            questions={questions}
            examTitle={`${title} Practice`}
            examDescription={`Test your understanding of ${title} with ${questions.length} exam-style questions. Each answer reveals a rationale.`}
            examLabel={`${title} Practice`}
          />
        </div>

        {/* Links to other practice */}
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-secondary)" }}>
            More practice
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pre-nursing/mini-cat"
              className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--semantic-surface-hover)]"
              style={{
                borderColor: "var(--semantic-border-soft)",
                color: "var(--theme-body-text)",
              }}
            >
              🎯 Try the adaptive exam
            </Link>
            <Link
              href="/pre-nursing/lessons"
              className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--semantic-surface-hover)]"
              style={{
                borderColor: "var(--semantic-border-soft)",
                color: "var(--theme-body-text)",
              }}
            >
              📖 Browse all modules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
