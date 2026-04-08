import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath, resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import {
  PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS,
  appPathwayCatSessionStartPath,
} from "@/lib/exam-pathways/pathway-cat-flow";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { pathwayCatPracticeBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { auth } from "@/lib/auth";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(locale, slug, examCode);
  if (!pathway) {
    return { robots: { index: false, follow: true } };
  }
  const country = pathway.countrySlug === "canada" ? "Canada" : "United States";
  return {
    title: `CAT practice · ${pathway.shortName} (${country}) | NurseNest`,
    description: `Pathway-scoped adaptive (CAT) practice for ${pathway.displayName}. One question at a time; sign in to run a session matched to your plan.`,
    robots: { index: false, follow: true },
  };
}

export default async function PathwayCatEntryPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(locale, slug, examCode);
  if (!pathway) notFound();

  const questionSnapshot = await loadPathwayQuestionBankSnapshot(pathway.id);

  const session = await auth();
  const isSignedIn = Boolean(session?.user);
  const hubBase = `/${locale}/${slug}/${examCode}`;
  const { crumbs, schemaItems } = pathwayCatPracticeBreadcrumbs(pathway);
  const overviewHref = hubBase;
  const appStart = appPathwayCatSessionStartPath(pathway.id);
  const startHref = isSignedIn ? appStart : loginWithCallback(appStart);
  const countryLabel = pathway.countrySlug === "canada" ? "Canada" : "US";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={overviewHref} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">Adaptive (CAT) practice</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        One question at a time, difficulty adjusts from your answers. Pool is limited to{" "}
        <strong className="text-[var(--theme-heading-text)]">{pathway.shortName}</strong> items for {countryLabel} (
        {pathway.displayName}).
      </p>
      <PathwayLiveInventoryStrip pathway={pathway} questionSnapshot={questionSnapshot} variant="cat" />

      <ul className="mt-6 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
        <li>
          <span className="font-semibold">Mode:</span> CAT practice (untimed; rationale unlocks after you finish)
        </li>
        <li>
          <span className="font-semibold">Length cap:</span> up to {PATHWAY_CAT_PRACTICE_DEFAULT_MAX_QUESTIONS} questions
          (server may stop earlier based on adaptive rules)
        </li>
        <li>
          <span className="font-semibold">Requires:</span> an active plan that covers this pathway
        </li>
      </ul>
      {pathway.status === "upcoming" ? (
        <aside className="nn-card mt-6 border-amber-200/80 bg-amber-50/60 p-4 text-sm text-foreground">
          <p className="font-semibold">Upcoming pathway</p>
          <p className="mt-1 text-[var(--theme-muted-text)]">
            Content depth may be limited while this track is still ramping. You can still try CAT if your subscription
            includes it.
          </p>
        </aside>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={startHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
        >
          {isSignedIn ? "Start CAT session" : "Sign in to start"}
        </Link>
        <Link
          href={buildExamPathwayPath(pathway, "lessons")}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
        >
          Lessons
        </Link>
        <Link
          href={buildExamPathwayPath(pathway, "questions")}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-card"
        >
          Question bank
        </Link>
        {!isSignedIn ? (
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 px-8 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Create account
          </Link>
        ) : null}
      </div>
    </div>
  );
}
