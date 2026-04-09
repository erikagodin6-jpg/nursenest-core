import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NpQuestionsHubBoardLinks } from "@/components/exam-pathways/np-questions-hub-board-links";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath, resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import { HUB, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { countPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayQuestionsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams?: Promise<{ topic?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const sp = searchParams ? await searchParams : {};
  const topicFilter = sp.topic?.trim() ?? "";
  const pathway = resolveExamPathwayFromMarketingHubSegment(locale, slug, examCode);
  if (!pathway) return {};
  const canonicalPath = buildExamPathwayPath(pathway, "questions");
  const canonical = absoluteUrl(canonicalPath);
  const title = topicFilter
    ? `${topicFilter} · Question bank · ${pathway.displayName} | NurseNest`
    : `Question bank · ${pathway.displayName} | NurseNest`;
  const description = topicFilter
    ? `Pathway-scoped practice for ${pathway.shortName} with a topic focus on ${topicFilter}. Sign in to run sets filtered to your plan.`
    : `Pathway-scoped practice for ${pathway.shortName} (${pathway.countrySlug === "canada" ? "Canada" : "US"}). Sign in to run sets filtered by your plan.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    ...(topicFilter ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ExamPathwayQuestionsHubPage({ params, searchParams }: Props) {
  const { locale, slug, examCode } = await params;
  const sp = searchParams ? await searchParams : {};
  const topicFilter = sp.topic?.trim() ?? "";
  const pathway = resolveExamPathwayFromMarketingHubSegment(locale, slug, examCode);
  if (!pathway) notFound();

  const [questionSnapshot, pathwayLessonCount] = await Promise.all([
    loadPathwayQuestionBankSnapshot(pathway.id),
    countPathwayLessons(pathway.id),
  ]);

  const hubBase = `/${locale}/${slug}/${examCode}`;
  const { crumbs, schemaItems } = pathwayQuestionsHubBreadcrumbs(pathway);
  const overviewHref = hubBase;
  const npAliasSegment = getNpPracticeTestLandingCopy(locale, slug, examCode) ? examCode : undefined;
  const boardLinkContext = pathwayMarketingHubLinkContext(pathway, npAliasSegment);
  const countryLabel = pathway.countrySlug === "canada" ? "Canada" : "US";
  const examName = pathway.contentExamKeys.length ? pathway.contentExamKeys.join(" / ") : pathway.shortName;
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const appQs = new URLSearchParams();
  appQs.set("pathwayId", pathway.id);
  if (topicFilter) {
    appQs.set("topic", topicFilter);
    appQs.set("preset", "topic_drill");
  }
  const appQuestionsScoped = loginWithCallback(`/app/questions?${appQs.toString()}`);
  const questionsHubPath = buildExamPathwayPath(pathway, "questions");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={overviewHref} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">
        {pathway.shortName} {countryLabel} question bank
      </h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        {topicFilter ? (
          <>
            Topic focus: <span className="font-semibold text-[var(--theme-heading-text)]">{topicFilter}</span>. Practice for{" "}
            {examName} stays scoped to {pathway.shortName}; sign in to run sets with this topic applied in the app.
          </>
        ) : (
          <>
            Practice for {examName} with pathway-scoped sets, rationale-first feedback, and readiness progress aimed at passing
            your {countryLabel} exam track.
          </>
        )}
      </p>
      <PathwayLiveInventoryStrip
        pathway={pathway}
        questionSnapshot={questionSnapshot}
        lessonCount={pathwayLessonCount}
        variant="questions"
      />
      {topicFilter ? (
        <aside className="nn-study-card nn-study-card--wash mt-6 p-4 sm:p-5">
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Filtered from lessons or topic hub</p>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            This page is scoped to one topic for faster navigation. The canonical bank hub covers the full pathway.
          </p>
          <Link
            href={questionsHubPath}
            className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-2 hover:no-underline"
          >
            Clear topic — open full question bank hub
          </Link>
        </aside>
      ) : null}
      {pathway.roleTrack === "np" ? (
        <div className="mt-4 rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]">
          <NpQuestionsHubBoardLinks pathwayId={pathway.id} linkContext={boardLinkContext} />
        </div>
      ) : null}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/30 p-5 sm:p-6">
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Start pathway-scoped practice</p>
        <p className="text-sm text-[var(--theme-muted-text)]">
          Run sets in the app filtered to this exam track ({pathway.shortName}). New here? Create an account, then open the question bank.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={appQuestionsScoped}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Start practice
          </Link>
          <Link
            href="/app/questions"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-card"
          >
            Open question bank
          </Link>
          <Link href="/signup" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5">
            Create account
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--theme-card-border)] pt-4 text-sm">
          <Link href={lessonsHref} className="font-semibold text-primary hover:underline">
            Clinical lessons for this exam
          </Link>
          <Link href={HUB.practiceExams} className="font-semibold text-primary hover:underline">
            Practice exams (public)
          </Link>
          <Link href={overviewHref} className="font-semibold text-primary hover:underline">
            Exam overview
          </Link>
        </div>
      </div>
    </div>
  );
}
