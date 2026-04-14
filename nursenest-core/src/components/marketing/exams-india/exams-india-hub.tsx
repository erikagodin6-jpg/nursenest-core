"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { PilotHubFeaturedBlog } from "@/components/marketing/pilot-hub-featured-blog";
import { RegionalHubTruthStrip } from "@/components/marketing/regional-hub-truth-strip";

const PATH = "/exams/india";

function ProseLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  );
}

/** Renders newline-separated body text from i18n into paragraphs. */
function RichBody({ text }: { text: string }) {
  const parts = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="space-y-4">
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function ExamsIndiaHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.india.breadcrumb"), PATH);

  const faqKeys = [
    "exams.india.faq.q1",
    "exams.india.faq.a1",
    "exams.india.faq.q2",
    "exams.india.faq.a2",
    "exams.india.faq.q3",
    "exams.india.faq.a3",
    "exams.india.faq.q4",
    "exams.india.faq.a4",
    "exams.india.faq.q5",
    "exams.india.faq.a5",
    "exams.india.faq.q6",
    "exams.india.faq.a6",
    "exams.india.faq.q7",
    "exams.india.faq.a7",
    "exams.india.faq.q8",
    "exams.india.faq.a8",
    "exams.india.faq.q9",
    "exams.india.faq.a9",
    "exams.india.faq.q10",
    "exams.india.faq.a10",
    "exams.india.faq.q11",
    "exams.india.faq.a11",
  ] as const;

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 0; i < faqKeys.length; i += 2) {
    faqPairs.push({ q: t(faqKeys[i]!), a: t(faqKeys[i + 1]!) });
  }

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.india.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.india.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.india.lead")}</p>

        <section className="mt-12" aria-labelledby="india-overview">
          <h2 id="india-overview" className="nn-marketing-h2">
            {t("exams.india.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.india.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="india-major">
          <h2 id="india-major" className="nn-marketing-h2">
            {t("exams.india.sections.major.title")}
          </h2>
          <RichBody text={t("exams.india.sections.major.body")} />
        </section>

        <section className="mt-12" aria-labelledby="india-license">
          <h2 id="india-license" className="nn-marketing-h2">
            {t("exams.india.sections.licensing.title")}
          </h2>
          <RichBody text={t("exams.india.sections.licensing.body")} />
        </section>

        <section className="mt-12" aria-labelledby="india-future">
          <h2 id="india-future" className="nn-marketing-h2">
            {t("exams.india.sections.future.title")}
          </h2>
          <RichBody text={t("exams.india.sections.future.body")} />
        </section>

        <section className="mt-12" aria-labelledby="india-intl">
          <h2 id="india-intl" className="nn-marketing-h2">
            {t("exams.india.sections.international.title")}
          </h2>
          <RichBody text={t("exams.india.sections.international.body")} />
        </section>

        <section className="mt-12" aria-labelledby="india-links">
          <h2 id="india-links" className="nn-marketing-h2">
            {t("exams.india.sections.links.title")}
          </h2>
          <RichBody text={t("exams.india.sections.links.body")} />
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.india.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.india.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.india.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.india.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.india.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.india.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.india.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.india.links.tools"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("exams.india.links.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("exams.india.links.questionBank"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("exams.india.links.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.pricing}>{formatTitleCase(t("exams.india.links.pricing"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.india.tagName"))}`)}>
                {formatTitleCase(t("exams.india.links.blogTag"), locale)}
              </ProseLink>
            </li>
          </ul>
        </section>

        <RegionalHubTruthStrip />

        <PilotHubFeaturedBlog pilot="india" />

        <section className="mt-12" aria-labelledby="india-faq">
          <h2 id="india-faq" className="nn-marketing-h2">
            {t("exams.india.sections.faq.title")}
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
          <p className="nn-marketing-h3 !mt-0">{t("exams.india.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.india.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/india/nursing-exams")}>{t("nav.india.nursingExams")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/india/aiims-nursing")}>{t("nav.india.aiimsNursing")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/india/nursing-registration")}>
              {t("nav.india.nursingRegistration")}
            </ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}
