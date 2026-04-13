import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, BookOpen, ClipboardList, Layers } from "lucide-react";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { StudyCard } from "@/components/ui/study-card";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

const EN_TITLE = "Free Pre-Nursing foundations for nursing school | NurseNest";
const EN_DESCRIPTION =
  "Free interactive Pre-Nursing modules: anatomy, chemistry, infection control, communication & more. No subscription required. Optional readiness target and a clear path to paid NCLEX/RPN/NP prep when you're ready.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  return safeGenerateMetadata(
    async () => {
      let msgs: Record<string, string> = {};
      try {
        msgs = await loadMarketingMessages(locale);
      } catch {
        /* fallback to English below */
      }
      const title = msgs["preNursing.hub.metaTitle"] ?? EN_TITLE;
      const description = msgs["preNursing.hub.metaDescription"] ?? EN_DESCRIPTION;
      const alt = marketingAlternatesSharedPage(locale, "/pre-nursing");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
        twitter: { card: "summary_large_image", title, description },
      };
    },
    { pathname: `/${locale}/pre-nursing`, locale, routeGroup: "marketing.locale.pre_nursing" },
  );
}

export default async function LocalizedPreNursingPage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  let msgs: Record<string, string> = {};
  try {
    msgs = await loadMarketingMessages(locale);
  } catch {
    /* fallback to English strings below */
  }

  const pageTitle = msgs["preNursing.hub.metaTitle"] ?? EN_TITLE;
  const pageDescription = msgs["preNursing.hub.metaDescription"] ?? EN_DESCRIPTION;

  const l = (href: string) => withMarketingLocale(locale, href);

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="hub" />
        <WebPageJsonLd
          title={pageTitle}
          description={pageDescription}
          path={`/${locale}/pre-nursing`}
          inLanguage={locale}
        />

        <section className="rounded-[1.75rem] border border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <p className="nn-marketing-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-accent)]">
            {msgs["preNursing.hub.heroLabel"] ?? "Pre-Nursing"}
          </p>
          <h1 className="nn-marketing-h1 mt-3 max-w-3xl text-balance">
            {msgs["preNursing.hub.heroTitle"] ?? "Pre-Nursing study hub"}
          </h1>
          <p className="nn-marketing-body mt-3 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
            {msgs["preNursing.hub.heroSubtitle"] ?? "Choose how you want to study today."}
          </p>
        </section>

        <section className="mt-10" aria-labelledby="pre-nursing-actions-heading">
          <h2 id="pre-nursing-actions-heading" className="nn-marketing-h2">
            {msgs["preNursing.hub.actionsHeading"] ?? "Start studying"}
          </h2>
          <ul className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                href={l("/pre-nursing/lessons")}
                icon={BookOpen}
                title="Lessons"
                description="Review core concepts by topic."
                cta="Lessons"
                ctaVariant="primary"
              />
            </li>
            <li>
              <StudyCard
                surface="hub"
                variant="locked"
                href="#"
                icon={Layers}
                title="Flashcards"
                description="Reinforce recall and retention."
                cta="Flashcards"
                ctaVariant="primary"
                footer={
                  <span className="mt-2 text-xs text-[var(--theme-muted-text)]">
                    {msgs["preNursing.hub.flashcardsUnavailable"] ?? "Available after choosing an exam pathway."}
                  </span>
                }
              />
            </li>
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                href={l("/pre-nursing/lessons")}
                icon={ClipboardList}
                title="Practice Questions"
                description="Answer questions by topic or weakness."
                cta="Practice Questions"
                ctaVariant="primary"
                footer={
                  <span className="mt-2 text-xs text-[var(--theme-muted-text)]">
                    {msgs["preNursing.hub.practiceNote"] ?? "Open a lesson to start module questions."}
                  </span>
                }
              />
            </li>
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                href={l("/pre-nursing/mini-cat")}
                icon={Activity}
                title="Exams"
                description="Take longer exam-style sessions."
                cta="Exams"
                ctaVariant="primary"
              />
            </li>
          </ul>
        </section>

        <section className="nn-study-card nn-study-card--wash mt-10 p-5 sm:p-6">
          <p className="nn-marketing-label">{msgs["preNursing.hub.moreOptions"] ?? "More options"}</p>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <li>
              <Link href={l("/pre-nursing/study-plan")} className="text-primary hover:underline">
                {msgs["preNursing.hub.quickLinks.studyPlan"] ?? "Study Plan"}
              </Link>
            </li>
            <li>
              <Link href={l("/tools/med-math")} className="text-primary hover:underline">
                {msgs["preNursing.hub.quickLinks.medMath"] ?? "Clinical Tools"}
              </Link>
            </li>
            <li>
              <Link href={l("/blog")} className="text-primary hover:underline">
                {msgs["preNursing.hub.articlesTips"] ?? "Articles / Tips"}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
