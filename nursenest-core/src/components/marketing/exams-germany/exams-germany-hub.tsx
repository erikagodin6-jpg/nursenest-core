"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { RegionalHubTruthStrip } from "@/components/marketing/regional-hub-truth-strip";
import { GermanyHubFeaturedBlog } from "./germany-hub-featured-blog";

const PATH = "/exams/germany";

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

export function ExamsGermanyHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.germany.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.germany.faq.q${i}`);
    const a = t(`exams.germany.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.germany.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.germany.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.germany.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.germany.lead")}</p>

        <section className="mt-12" aria-labelledby="de-overview">
          <h2 id="de-overview" className="nn-marketing-h2">
            {t("exams.germany.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-not-nclex">
          <h2 id="de-not-nclex" className="nn-marketing-h2">
            {t("exams.germany.sections.notNclexExam.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.notNclexExam.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-recognition">
          <h2 id="de-recognition" className="nn-marketing-h2">
            {t("exams.germany.sections.recognitionAdaptation.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.recognitionAdaptation.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-kenntnis">
          <h2 id="de-kenntnis" className="nn-marketing-h2">
            {t("exams.germany.sections.kenntnisprufung.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.kenntnisprufung.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-lang">
          <h2 id="de-lang" className="nn-marketing-h2">
            {t("exams.germany.sections.languageB2.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.languageB2.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-domestic">
          <h2 id="de-domestic" className="nn-marketing-h2">
            {t("exams.germany.sections.domesticInternational.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.domesticInternational.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-eu">
          <h2 id="de-eu" className="nn-marketing-h2">
            {t("exams.germany.sections.euVsNonEu.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.euVsNonEu.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-best">
          <h2 id="de-best" className="nn-marketing-h2">
            {t("exams.germany.sections.best.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="de-links">
          <h2 id="de-links" className="nn-marketing-h2">
            {t("exams.germany.sections.links.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.germany.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.germany.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/germany/nurse-recognition")}>
                {formatTitleCase(t("nav.country.germany.nurseRecognition"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/germany/work-as-a-nurse")}>
                {formatTitleCase(t("nav.country.germany.workAsNurse"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/germany/kenntnisprufung")}>
                {formatTitleCase(t("nav.country.germany.kenntnisprufungGuide"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/germany/german-language-for-nurses")}>
                {formatTitleCase(t("nav.country.germany.germanLanguageTopic"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.germany.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.germany.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.germany.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.germany.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.germany.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.germany.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.germany.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.germany.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.germany.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.germany.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.germany.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.germany.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.germany.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="de-blog-integration">
          <h2 id="de-blog-integration" className="nn-marketing-h2">
            {t("exams.germany.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.germany.sections.blogIntegration.body")} />
        </section>

        <RegionalHubTruthStrip />

        <GermanyHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="de-faq">
          <h2 id="de-faq" className="nn-marketing-h2">
            {t("exams.germany.sections.faq.title")}
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
          style={{ background: "color-mix(in srgb, var(--semantic-panel-warm) 8%, var(--semantic-surface))" }}
        >
          <p className="nn-marketing-h3 !mt-0">{t("exams.germany.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.germany.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/germany/nurse-recognition")}>{t("exams.germany.next.linkNurseRecognition")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/germany/work-as-a-nurse")}>{t("exams.germany.next.linkWorkAsNurse")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/germany/kenntnisprufung")}>{t("exams.germany.next.linkKenntnisprufung")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/germany/german-language-for-nurses")}>{t("exams.germany.next.linkGermanLanguage")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}
