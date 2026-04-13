import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { resolveDefaultPathwayIdForOnboarding } from "@/lib/onboarding/resolve-default-pathway-for-onboarding";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { normalizeLesson, pathwayLessonRowToInput } from "@/lib/lessons/pathway-lesson-loader";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: `${t("learner.startStudying.heroTitle")} | NurseNest`,
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/start-studying", routeGroup: "student.learner.startStudying" },
  );
}

export default async function StartStudyingPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId || !isDatabaseUrlConfigured()) {
    redirect(loginWithCallback("/app/start-studying"));
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingCompletedAt: true,
      learnerPath: true,
      country: true,
      examFocus: true,
    },
  });

  if (!user?.onboardingCompletedAt) {
    redirect("/app/onboarding");
  }

  const lp = user.learnerPath?.trim();
  let pathwayId: string | null = lp && getExamPathwayById(lp) ? lp : null;
  if (!pathwayId) {
    pathwayId = resolveDefaultPathwayIdForOnboarding(user.examFocus ?? null, user.country);
  }

  const pathway = pathwayId ? getExamPathwayById(pathwayId) : null;
  const lessonLocale = locale.split("-")[0] || "en";

  const firstLessonRaw =
    pathwayId != null
      ? await prisma.pathwayLesson.findFirst({
          where: {
            pathwayId,
            status: ContentStatus.PUBLISHED,
            locale: lessonLocale,
          },
          orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
          select: {
            id: true,
            title: true,
            topic: true,
            slug: true,
            topicSlug: true,
            bodySystem: true,
            previewSectionCount: true,
            seoTitle: true,
            seoDescription: true,
            sections: true,
            locale: true,
          },
        })
      : null;
  let firstLesson = firstLessonRaw;
  if (
    firstLessonRaw &&
    pathwayId != null &&
    !normalizeLesson(pathwayLessonRowToInput(firstLessonRaw), pathwayId).structuralQuality?.publicComplete
  ) {
    firstLesson = null;
  }
  if (!firstLesson && pathwayId != null && lessonLocale !== "en") {
    const fallbackRaw = await prisma.pathwayLesson.findFirst({
      where: { pathwayId, status: ContentStatus.PUBLISHED, locale: "en" },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        topic: true,
        slug: true,
        topicSlug: true,
        bodySystem: true,
        previewSectionCount: true,
        seoTitle: true,
        seoDescription: true,
        sections: true,
        locale: true,
      },
    });
    if (
      fallbackRaw &&
      normalizeLesson(pathwayLessonRowToInput(fallbackRaw), pathwayId).structuralQuality?.publicComplete
    ) {
      firstLesson = fallbackRaw;
    }
  }

  const entitlement = await resolveEntitlementForPage(userId);
  const questionsHref =
    pathwayId != null ? `/app/questions?pathwayId=${encodeURIComponent(pathwayId)}` : "/app/questions";

  const crumbs: BreadcrumbCrumb[] = [
    { name: "Home", href: "/", i18nKey: "breadcrumbs.home" },
    { name: "Dashboard", href: "/app" },
    { name: t("learner.startStudying.heroTitle"), href: undefined },
  ];

  return (
    <main className="space-y-8">
      <BreadcrumbTrail items={crumbs} />

      <header className="nn-learner-page-hero">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
          {t("learner.startStudying.heroTitle")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {t("learner.startStudying.heroSubtitle")}
        </p>
        {pathway ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">
            {pathway.displayName}
          </p>
        ) : null}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section
          className="nn-card flex flex-col gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-5"
          aria-labelledby="start-first-lesson"
        >
          <h2 id="start-first-lesson" className="text-lg font-bold text-[var(--semantic-text-primary)]">
            {t("learner.startStudying.firstLessonTitle")}
          </h2>
          {firstLesson ? (
            <>
              <p className="text-sm text-[var(--semantic-text-secondary)]">
                <span className="font-medium text-[var(--semantic-text-primary)]">{firstLesson.title}</span>
                {firstLesson.topic ? (
                  <span className="block text-xs text-[var(--semantic-text-muted)]">{firstLesson.topic}</span>
                ) : null}
              </p>
              <Link
                href={`/app/lessons/${firstLesson.id}`}
                className="nn-btn-primary mt-auto inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold shadow-none"
              >
                {t("learner.startStudying.openFirstLesson")}
              </Link>
              <Link href="/app/lessons" className="text-center text-xs font-medium text-[var(--semantic-info)] hover:underline">
                {t("learner.lessons.list.title")} →
              </Link>
            </>
          ) : (
            <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.startStudying.firstLessonEmpty")}</p>
          )}
        </section>

        <section
          className="nn-card flex flex-col gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-panel-warm)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--semantic-surface))] p-5"
          aria-labelledby="start-first-questions"
        >
          <h2 id="start-first-questions" className="text-lg font-bold text-[var(--semantic-text-primary)]">
            {t("learner.startStudying.questionsTitle")}
          </h2>
          <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.questions.subtitle.subscriber")}</p>
          <Link
            href={questionsHref}
            className="nn-btn-primary mt-auto inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold shadow-none"
          >
            {t("learner.startStudying.openQuestions")}
          </Link>
        </section>
      </div>

      <section className="nn-card flex flex-col gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{t("learner.startStudying.ctaTitle")}</h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("learner.startStudying.ctaBody")}</p>
          {entitlement !== "error" && !entitlement.hasAccess ? (
            <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">{t("learner.questions.subtitle.locked")}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/pricing"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-5 text-sm font-semibold text-[var(--semantic-brand)]"
          >
            {t("learner.startStudying.ctaPricing")}
          </Link>
          <Link href="/app" className="text-center text-sm font-medium text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-primary)]">
            {t("learner.startStudying.goDashboard")}
          </Link>
        </div>
      </section>
    </main>
  );
}
