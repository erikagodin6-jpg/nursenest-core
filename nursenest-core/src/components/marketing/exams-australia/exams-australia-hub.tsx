"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { PilotHubFeaturedBlog } from "@/components/marketing/pilot-hub-featured-blog";

const PATH = "/exams/australia";

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

export function ExamsAustraliaHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.australia.breadcrumb"), PATH);

  const faqKeys = [
    "exams.australia.faq.q1",
    "exams.australia.faq.a1",
    "exams.australia.faq.q2",
    "exams.australia.faq.a2",
    "exams.australia.faq.q3",
    "exams.australia.faq.a3",
    "exams.australia.faq.q4",
    "exams.australia.faq.a4",
    "exams.australia.faq.q5",
    "exams.australia.faq.a5",
    "exams.australia.faq.q6",
    "exams.australia.faq.a6",
    "exams.australia.faq.q7",
    "exams.australia.faq.a7",
    "exams.australia.faq.q8",
    "exams.australia.faq.a8",
    "exams.australia.faq.q9",
    "exams.australia.faq.a9",
    "exams.australia.faq.q10",
    "exams.australia.faq.a10",
    "exams.australia.faq.q11",
    "exams.australia.faq.a11",
    "exams.australia.faq.q12",
    "exams.australia.faq.a12",
  ] as const;

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 0; i < faqKeys.length; i += 2) {
    faqPairs.push({ q: t(faqKeys[i]!), a: t(faqKeys[i + 1]!) });
  }

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.australia.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.australia.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.australia.lead")}</p>

        <section className="mt-12" aria-labelledby="au-overview">
          <h2 id="au-overview" className="nn-marketing-h2">
            {t("exams.australia.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.australia.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="au-pathways">
          <h2 id="au-pathways" className="nn-marketing-h2">
            {t("exams.australia.sections.pathways.title")}
          </h2>
          <RichBody text={t("exams.australia.sections.pathways.intro")} />
          <h3 id="au-en" className="nn-marketing-h3 mt-8">
            {t("exams.australia.sections.pathways.enTitle")}
          </h3>
          <RichBody text={t("exams.australia.sections.pathways.enBody")} />
          <h3 id="au-rn" className="nn-marketing-h3 mt-8">
            {t("exams.australia.sections.pathways.rnTitle")}
          </h3>
          <RichBody text={t("exams.australia.sections.pathways.rnBody")} />
          <h3 id="au-np" className="nn-marketing-h3 mt-8">
            {t("exams.australia.sections.pathways.npTitle")}
          </h3>
          <RichBody text={t("exams.australia.sections.pathways.npBody")} />
          <h3 id="au-compare" className="nn-marketing-h3 mt-8">
            {t("exams.australia.sections.pathways.compareTitle")}
          </h3>
          <RichBody text={t("exams.australia.sections.pathways.compareBody")} />
        </section>

        <section className="mt-12" aria-labelledby="au-oba">
          <h2 id="au-oba" className="nn-marketing-h2">
            {t("exams.australia.sections.oba.title")}
          </h2>
          <RichBody text={t("exams.australia.sections.oba.body")} />
        </section>

        <section className="mt-12" aria-labelledby="au-international">
          <h2 id="au-international" className="nn-marketing-h2">
            {t("exams.australia.sections.international.title")}
          </h2>
          <RichBody text={t("exams.australia.sections.international.body")} />
        </section>

        <section className="mt-12" aria-labelledby="au-allied">
          <h2 id="au-allied" className="nn-marketing-h2">
            {t("exams.australia.sections.allied.title")}
          </h2>
          <RichBody text={t("exams.australia.sections.allied.body")} />
        </section>

        <section className="mt-12" aria-labelledby="au-best">
          <h2 id="au-best" className="nn-marketing-h2">
            {t("exams.australia.sections.best.title")}
          </h2>
          <RichBody text={t("exams.australia.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="au-links">
          <h2 id="au-links" className="nn-marketing-h2">
            {t("exams.australia.sections.links.title")}
          </h2>
          <RichBody text={t("exams.australia.sections.links.body")} />
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.australia.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.australia.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.australia.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.australia.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.australia.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.australia.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.australia.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.australia.links.tools"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("exams.australia.links.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("exams.australia.links.questionBank"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("exams.australia.links.studyPlan"), locale)}</ProseLink>
            </li>
          </ul>
        </section>

        <PilotHubFeaturedBlog pilot="australia" />

        <section className="mt-12" aria-labelledby="au-faq">
          <h2 id="au-faq" className="nn-marketing-h2">
            {t("exams.australia.sections.faq.title")}
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
          <p className="nn-marketing-h3 !mt-0">{t("exams.australia.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.australia.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/australia/ahpra-registration")}>{t("nav.australia.ahpra")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/australia/osce-nursing")}>{t("nav.australia.osce")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/australia/oba-nursing")}>{t("nav.australia.oba")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/australia/nursing-pathway")}>{t("exams.australia.next.linkPathway")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/exams/australia#au-international")}>{t("nav.australia.workAu")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}
