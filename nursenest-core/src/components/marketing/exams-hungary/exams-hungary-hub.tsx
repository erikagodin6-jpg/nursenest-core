"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { HungaryHubFeaturedBlog } from "./hungary-hub-featured-blog";

const PATH = "/exams/hungary";

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

export function ExamsHungaryHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.hungary.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.hungary.faq.q${i}`);
    const a = t(`exams.hungary.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.hungary.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.hungary.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.hungary.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.hungary.lead")}</p>

        <section className="mt-12" aria-labelledby="hu-overview">
          <h2 id="hu-overview" className="nn-marketing-h2">
            {t("exams.hungary.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="hu-recognition">
          <h2 id="hu-recognition" className="nn-marketing-h2">
            {t("exams.hungary.sections.recognitionSystem.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.recognitionSystem.body")} />
        </section>

        <section className="mt-12" aria-labelledby="hu-domestic">
          <h2 id="hu-domestic" className="nn-marketing-h2">
            {t("exams.hungary.sections.domesticInternational.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.domesticInternational.body")} />
        </section>

        <section className="mt-12" aria-labelledby="hu-lang">
          <h2 id="hu-lang" className="nn-marketing-h2">
            {t("exams.hungary.sections.languageRequirements.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.languageRequirements.body")} />
        </section>

        <section className="mt-12" aria-labelledby="hu-eu">
          <h2 id="hu-eu" className="nn-marketing-h2">
            {t("exams.hungary.sections.euVsNonEu.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.euVsNonEu.body")} />
        </section>

        <section className="mt-12" aria-labelledby="hu-abroad">
          <h2 id="hu-abroad" className="nn-marketing-h2">
            {t("exams.hungary.sections.abroadMigration.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.abroadMigration.body")} />
        </section>

        <section className="mt-12" aria-labelledby="hu-best">
          <h2 id="hu-best" className="nn-marketing-h2">
            {t("exams.hungary.sections.best.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="hu-links">
          <h2 id="hu-links" className="nn-marketing-h2">
            {t("exams.hungary.sections.links.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.hungary.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.hungary.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/hungary/nurse-registration")}>
                {formatTitleCase(t("nav.country.hungary.nurseRegistration"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/hungary/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.hungary.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/hungary/work-abroad")}>
                {formatTitleCase(t("nav.country.hungary.workAbroad"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.hungary.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.hungary.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.hungary.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.hungary.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.hungary.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.hungary.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.hungary.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.hungary.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.hungary.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.hungary.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.hungary.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.hungary.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.hungary.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="hu-blog-integration">
          <h2 id="hu-blog-integration" className="nn-marketing-h2">
            {t("exams.hungary.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.hungary.sections.blogIntegration.body")} />
        </section>

        <HungaryHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="hu-faq">
          <h2 id="hu-faq" className="nn-marketing-h2">
            {t("exams.hungary.sections.faq.title")}
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
          <p className="nn-marketing-h3 !mt-0">{t("exams.hungary.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.hungary.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/hungary/nurse-registration")}>{t("exams.hungary.next.linkNurseRegistration")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/hungary/how-to-become-a-nurse")}>{t("exams.hungary.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/hungary/work-abroad")}>{t("exams.hungary.next.linkWorkAbroad")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}
