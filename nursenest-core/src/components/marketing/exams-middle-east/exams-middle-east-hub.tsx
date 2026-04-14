"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { PilotHubFeaturedBlog } from "@/components/marketing/pilot-hub-featured-blog";

const PATH = "/exams/middle-east";

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

export function ExamsMiddleEastHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.middleEast.breadcrumb"), PATH);

  const faqKeys = [
    "exams.middleEast.faq.q1",
    "exams.middleEast.faq.a1",
    "exams.middleEast.faq.q2",
    "exams.middleEast.faq.a2",
    "exams.middleEast.faq.q3",
    "exams.middleEast.faq.a3",
    "exams.middleEast.faq.q4",
    "exams.middleEast.faq.a4",
    "exams.middleEast.faq.q5",
    "exams.middleEast.faq.a5",
    "exams.middleEast.faq.q6",
    "exams.middleEast.faq.a6",
    "exams.middleEast.faq.q7",
    "exams.middleEast.faq.a7",
    "exams.middleEast.faq.q8",
    "exams.middleEast.faq.a8",
    "exams.middleEast.faq.q9",
    "exams.middleEast.faq.a9",
    "exams.middleEast.faq.q10",
    "exams.middleEast.faq.a10",
    "exams.middleEast.faq.q11",
    "exams.middleEast.faq.a11",
    "exams.middleEast.faq.q12",
    "exams.middleEast.faq.a12",
  ] as const;

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 0; i < faqKeys.length; i += 2) {
    faqPairs.push({ q: t(faqKeys[i]!), a: t(faqKeys[i + 1]!) });
  }

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.middleEast.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.middleEast.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.middleEast.lead")}</p>

        <section className="mt-12" aria-labelledby="me-overview">
          <h2 id="me-overview" className="nn-marketing-h2">
            {t("exams.middleEast.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.middleEast.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="me-major">
          <h2 id="me-major" className="nn-marketing-h2">
            {t("exams.middleEast.sections.major.title")}
          </h2>
          <RichBody text={t("exams.middleEast.sections.major.intro")} />
          <h3 id="middle-east-saudi" className="nn-marketing-h3 mt-8">
            {t("exams.middleEast.sections.major.saudiTitle")}
          </h3>
          <RichBody text={t("exams.middleEast.sections.major.saudiBody")} />
          <h3 id="middle-east-dha" className="nn-marketing-h3 mt-8">
            {t("exams.middleEast.sections.major.dhaTitle")}
          </h3>
          <RichBody text={t("exams.middleEast.sections.major.dhaBody")} />
          <h3 id="middle-east-haad" className="nn-marketing-h3 mt-8">
            {t("exams.middleEast.sections.major.haadTitle")}
          </h3>
          <RichBody text={t("exams.middleEast.sections.major.haadBody")} />
          <h3 id="middle-east-qatar" className="nn-marketing-h3 mt-8">
            {t("exams.middleEast.sections.major.qatarTitle")}
          </h3>
          <RichBody text={t("exams.middleEast.sections.major.qatarBody")} />
        </section>

        <section className="mt-12" aria-labelledby="me-prometric">
          <h2 id="me-prometric" className="nn-marketing-h2">
            {t("exams.middleEast.sections.prometric.title")}
          </h2>
          <RichBody text={t("exams.middleEast.sections.prometric.body")} />
        </section>

        <section className="mt-12" aria-labelledby="me-expat">
          <h2 id="me-expat" className="nn-marketing-h2">
            {t("exams.middleEast.sections.expat.title")}
          </h2>
          <RichBody text={t("exams.middleEast.sections.expat.body")} />
        </section>

        <section className="mt-12" aria-labelledby="me-pathway">
          <h2 id="me-pathway" className="nn-marketing-h2">
            {t("exams.middleEast.sections.pathway.title")}
          </h2>
          <RichBody text={t("exams.middleEast.sections.pathway.body")} />
        </section>

        <section className="mt-12" aria-labelledby="me-links">
          <h2 id="me-links" className="nn-marketing-h2">
            {t("exams.middleEast.sections.links.title")}
          </h2>
          <RichBody text={t("exams.middleEast.sections.links.body")} />
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.middleEast.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.middleEast.links.rnQuestionsUs"), locale)}</ProseLink>
              {" — "}
              {formatTitleCase(t("exams.middleEast.links.compareNclex"), locale)}
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.middleEast.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.middleEast.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.middleEast.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.middleEast.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.middleEast.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.middleEast.links.tools"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("exams.middleEast.links.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("exams.middleEast.links.questionBank"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("exams.middleEast.links.studyPlan"), locale)}</ProseLink>
            </li>
          </ul>
        </section>

        <PilotHubFeaturedBlog pilot="middle-east" />

        <section className="mt-12" aria-labelledby="me-faq">
          <h2 id="me-faq" className="nn-marketing-h2">
            {t("exams.middleEast.sections.faq.title")}
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
          style={{ background: "color-mix(in srgb, var(--semantic-panel-cool) 8%, var(--semantic-surface))" }}
        >
          <p className="nn-marketing-h3 !mt-0">{t("exams.middleEast.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.middleEast.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/middle-east/prometric-nursing-exam")}>
              {t("nav.middleEast.prometricExam")}
            </ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/middle-east/dha-exam")}>{t("nav.middleEast.dhaExam")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/middle-east/haad-exam")}>{t("nav.middleEast.haadExam")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/middle-east/dataflow-guide")}>{t("nav.middleEast.dataflowGuide")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}
