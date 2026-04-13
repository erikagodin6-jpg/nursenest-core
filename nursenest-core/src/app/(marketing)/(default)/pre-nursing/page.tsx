import type { Metadata } from "next";
import { Activity, BookOpen, Layers, Target } from "lucide-react";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { StudyCard } from "@/components/ui/study-card";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export const revalidate = 86400;

const title = "Free Pre-Nursing foundations for nursing school | NurseNest";
const description =
  "Free interactive Pre-Nursing modules: anatomy, chemistry, infection control, communication & more. No subscription required. Optional readiness target and a clear path to paid NCLEX/RPN/NP prep when you’re ready.";
const alternates = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/pre-nursing");

export const metadata: Metadata = {
  title,
  description,
  alternates,
  openGraph: {
    title,
    description,
    url: alternates.canonical,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PreNursingLandingPage() {
  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="hub" />
        <WebPageJsonLd
          title={title}
          description={description}
          path="/pre-nursing"
          inLanguage="en"
        />

        <section aria-labelledby="pre-nursing-actions-heading">
          <h1 id="pre-nursing-actions-heading" className="nn-marketing-h1 max-w-3xl text-balance">
            Pre-Nursing
          </h1>
          <p className="nn-marketing-body mt-2 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
            Choose how you want to study today.
          </p>
          <ul className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                href="/pre-nursing/lessons"
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
                href="/flashcards"
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
                href="/question-bank"
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
                href="/pre-nursing/mini-cat"
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
