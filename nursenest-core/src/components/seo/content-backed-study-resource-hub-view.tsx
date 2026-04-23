import Link from "next/link";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ContentBackedStudyResourceHubPayload } from "@/lib/seo/content-backed-study-resource-hub";
import { pathwayStudyResourcesBodyBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { absoluteUrl } from "@/lib/seo/site-origin";

function WebPageJsonLd(args: { name: string; description: string; url: string }) {
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: args.name,
    description: args.description,
    url: args.url,
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}

export function ContentBackedStudyResourceHubView({
  payload,
  canonicalPath,
}: {
  payload: ContentBackedStudyResourceHubPayload;
  canonicalPath: string;
}) {
  const { crumbs, schemaItems } = pathwayStudyResourcesBodyBreadcrumbs(
    payload.pathway,
    payload.bodySystemLabel,
    payload.bodyKey,
  );
  const hubBase = buildExamPathwayPath(payload.pathway);
  const questionsHref = `${hubBase}/questions?topic=${encodeURIComponent(payload.bodySystemLabel)}`;
  const lessonsIndexHref = `${hubBase}/lessons`;
  const canonical = absoluteUrl(canonicalPath);
  const metaTitle = `${payload.bodySystemLabel} study resources · ${payload.pathway.displayName} | NurseNest`;
  const metaDesc = `Lessons, question-bank scope, and flashcard previews for ${payload.bodySystemLabel} on ${payload.pathway.shortName}. Links stay inside this exam pathway.`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <WebPageJsonLd name={metaTitle} description={metaDesc} url={canonical} />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <header className="mt-6 border-b border-[var(--semantic-border-soft)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {payload.pathway.displayName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--theme-heading-text)] [overflow-wrap:anywhere]">
          {payload.bodySystemLabel}: practice resources & study guides
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)] [overflow-wrap:anywhere]">
          {payload.introPlainText}
        </p>
        <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
          Pathway-scoped bank sample:{" "}
          <span className="font-medium tabular-nums text-[var(--semantic-text-primary)]">{payload.questionCount}</span>{" "}
          published items tagged to this body system (same tier/region gates as the in-app bank).
        </p>
      </header>

      <section className="mt-8 space-y-3" aria-labelledby="nn-study-resource-lessons">
        <h2 id="nn-study-resource-lessons" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Pathway lessons
        </h2>
        <ul className="divide-y divide-[var(--semantic-border-soft)] rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
          {payload.lessons.map((l) => {
            const href = pathwayLessonPublicDetailPath(payload.pathway, l.slug);
            if (!href) return null;
            return (
              <li key={l.slug} className="px-4 py-3">
                <Link href={href} className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline [overflow-wrap:anywhere]">
                  {l.title}
                </Link>
                <p className="mt-1 text-xs text-[var(--semantic-text-muted)] [overflow-wrap:anywhere]">{l.topic}</p>
              </li>
            );
          })}
        </ul>
        <Link
          href={lessonsIndexHref}
          className="inline-flex text-sm font-semibold text-[var(--semantic-info)] hover:underline"
        >
          Browse all lessons in this pathway →
        </Link>
      </section>

      <section className="mt-10 space-y-3" aria-labelledby="nn-study-resource-questions">
        <h2 id="nn-study-resource-questions" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Practice questions
        </h2>
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Open the question hub with your body system prefilled as a topic filter. Everything stays inside{" "}
          <span className="font-medium">{payload.pathway.shortName}</span> exam scope—no cross-tier pools.
        </p>
        <Link
          href={questionsHref}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-role-cta px-5 py-2 text-sm font-semibold text-role-cta-foreground shadow-[0_2px_8px_var(--role-cta-shadow)]"
        >
          Go to practice questions
        </Link>
      </section>

      {payload.flashcardDecks.length > 0 ? (
        <section className="mt-10 space-y-3" aria-labelledby="nn-study-resource-flashcards">
          <h2 id="nn-study-resource-flashcards" className="text-lg font-semibold text-[var(--theme-heading-text)]">
            Flashcard previews
          </h2>
          <ul className="flex flex-col gap-2">
            {payload.flashcardDecks.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/flashcards/${encodeURIComponent(d.slug)}`}
                  className="text-sm font-semibold text-[var(--semantic-chart-3)] hover:underline [overflow-wrap:anywhere]"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-5">
        <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">More study context</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--semantic-text-secondary)]">
          <li>
            <Link href="/blog" className="font-medium text-[var(--semantic-brand)] hover:underline">
              Nursing blog
            </Link>{" "}
            — registration, clinical judgment, and regional exam guides.
          </li>
          <li>
            <Link href={hubBase} className="font-medium text-[var(--semantic-brand)] hover:underline">
              {payload.pathway.displayName} hub
            </Link>{" "}
            — pricing, CAT/adaptive entry, and full tool links.
          </li>
        </ul>
      </section>
    </article>
  );
}
