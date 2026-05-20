"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { RegionalHubTruthStrip } from "@/components/marketing/regional-hub-truth-strip";
import { FranceHubFeaturedBlog } from "./france-hub-featured-blog";

const PATH = "/exams/france";

function ProseLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  );
}

function RichBody({ text }: { text: string }) {
  const parts = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className="space-y-4">
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function ExamsFranceHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.france.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.france.faq.q${i}`);
    const a = t(`exams.france.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.france.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.france.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.france.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.france.lead")}</p>

        <section className="mt-12" aria-labelledby="fr-overview">
          <h2 id="fr-overview" className="nn-marketing-h2">
            {t("exams.france.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.france.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="fr-recognition">
          <h2 id="fr-recognition" className="nn-marketing-h2">
            {t("exams.france.sections.recognitionSystem.title")}
          </h2>
          <RichBody text={t("exams.france.sections.recognitionSystem.body")} />
        </section>

        <section className="mt-12" aria-labelledby="fr-domestic">
          <h2 id="fr-domestic" className="nn-marketing-h2">
            {t("exams.france.sections.domesticInternational.title")}
          </h2>
          <RichBody text={t("exams.france.sections.domesticInternational.body")} />
        </section>

        <section className="mt-12" aria-labelledby="fr-lang">
          <h2 id="fr-lang" className="nn-marketing-h2">
            {t("exams.france.sections.languageRequirements.title")}
          </h2>
          <RichBody text={t("exams.france.sections.languageRequirements.body")} />
        </section>

        <section className="mt-12" aria-labelledby="fr-eu">
          <h2 id="fr-eu" className="nn-marketing-h2">
            {t("exams.france.sections.euVsNonEu.title")}
          </h2>
          <RichBody text={t("exams.france.sections.euVsNonEu.body")} />
        </section>

        <section className="mt-12" aria-labelledby="fr-abroad">
          <h2 id="fr-abroad" className="nn-marketing-h2">
            {t("exams.france.sections.abroadMigration.title")}
          </h2>
          <RichBody text={t("exams.france.sections.abroadMigration.body")} />
        </section>

        <section className="mt-12" aria-labelledby="fr-best">
          <h2 id="fr-best" className="nn-marketing-h2">
            {t("exams.france.sections.best.title")}
          </h2>
          <RichBody text={t("exams.france.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="fr-links">
          <h2 id="fr-links" className="nn-marketing-h2">
            {t("exams.france.sections.links.title")}
          </h2>
          <RichBody text={t("exams.france.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.france.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.france.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/france/nurse-registration")}>
                {formatTitleCase(t("nav.country.france.nurseRegistration"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/france/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.france.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/france/work-abroad")}>
                {formatTitleCase(t("nav.country.france.workAbroad"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.france.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.france.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.france.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.france.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.france.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.france.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.france.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.france.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.france.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.france.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.france.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.france.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.france.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="fr-blog-integration">
          <h2 id="fr-blog-integration" className="nn-marketing-h2">
            {t("exams.france.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.france.sections.blogIntegration.body")} />
        </section>

        <RegionalHubTruthStrip />

        <FranceHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="fr-faq">
          <h2 id="fr-faq" className="nn-marketing-h2">
            {t("exams.france.sections.faq.title")}
          </h2>
          <dl className="space-y-6">
            {faqPairs.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-[var(--theme-heading-text)]">{item.q}</dt>
                <dd className="mt-2 text-[var(--theme-body-text)]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside
          className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
          style={{ background: "color-mix(in srgb, var(--semantic-panel-positive) 8%, var(--semantic-surface))" }}
        >
          <p className="nn-marketing-h3 !mt-0">{t("exams.france.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.france.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/france/nurse-registration")}>{t("exams.france.next.linkNurseRegistration")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/france/how-to-become-a-nurse")}>{t("exams.france.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/france/work-abroad")}>{t("exams.france.next.linkWorkAbroad")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}
