import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Activity, BookOpen, Layers, Target } from "lucide-react";
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
      <div
        className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
        data-nn-nursing-tier-hub="surface"
      >
        <PreNursingSurfaceAnalytics surface="hub" />
        <WebPageJsonLd
          title={pageTitle}
          description={pageDescription}
          path={`/${locale}/pre-nursing`}
          inLanguage={locale}
        />

        <section aria-labelledby="pre-nursing-actions-heading">
          <h1 id="pre-nursing-actions-heading" className="nn-marketing-h1 max-w-3xl text-balance">
            {msgs["preNursing.hub.heroLabel"] ?? "Pre-Nursing"}
          </h1>
          <p className="nn-marketing-body mt-2 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
            {msgs["preNursing.hub.heroSubtitle"] ?? "Choose how you want to study today."}
          </p>
          <ul className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                className="nn-exam-hub-study-card--lessons"
                href={l("/pre-nursing/lessons")}
                icon={BookOpen}
                title="Lessons"
                description="Review concepts by topic."
                cta="Lessons"
                ctaVariant="primary"
              />
            </li>
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                className="nn-exam-hub-study-card--flashcards"
                href={l("/flashcards")}
                icon={Layers}
                title="Flashcards"
                description="Strengthen recall quickly."
                cta="Flashcards"
                ctaVariant="primary"
              />
            </li>
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                className="nn-exam-hub-study-card--practice"
                href={l("/question-bank")}
                icon={Target}
                title="Practice"
                description="Drill by topic or weakness."
                cta="Practice"
                ctaVariant="primary"
              />
            </li>
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                className="nn-exam-hub-study-card--cat"
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
      </div>
    </div>
  );
}
