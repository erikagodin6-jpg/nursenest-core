import type { Metadata } from "next";
import Link from "next/link";
import { Activity, BookOpen, ClipboardList, Layers } from "lucide-react";
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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="hub" />
        <WebPageJsonLd
          title={title}
          description={description}
          path="/pre-nursing"
          inLanguage="en"
        />

        <section className="rounded-[1.75rem] border border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <p className="nn-marketing-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-accent)]">
            Pre-Nursing
          </p>
          <h1 className="nn-marketing-h1 mt-3 max-w-3xl text-balance">Pre-Nursing study hub</h1>
          <p className="nn-marketing-body mt-3 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
            Choose how you want to study today.
          </p>
        </section>

        <section className="mt-10" aria-labelledby="pre-nursing-actions-heading">
          <h2 id="pre-nursing-actions-heading" className="nn-marketing-h2">
            Start studying
          </h2>
          <ul className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                href="/pre-nursing/lessons"
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
                footer={<span className="mt-2 text-xs text-[var(--theme-muted-text)]">Available after choosing an exam pathway.</span>}
              />
            </li>
            <li>
              <StudyCard
                surface="hub"
                variant="featured"
                href="/pre-nursing/lessons"
                icon={ClipboardList}
                title="Practice Questions"
                description="Answer questions by topic or weakness."
                cta="Practice Questions"
                ctaVariant="primary"
                footer={<span className="mt-2 text-xs text-[var(--theme-muted-text)]">Open a lesson to start module questions.</span>}
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

        <section className="nn-study-card nn-study-card--wash mt-10 p-5 sm:p-6">
          <p className="nn-marketing-label">More options</p>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <li>
              <Link href="/pre-nursing/study-plan" className="text-primary hover:underline">
                Study Plan
              </Link>
            </li>
            <li>
              <Link href="/tools/med-math" className="text-primary hover:underline">
                Clinical Tools
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-primary hover:underline">
                Articles / Tips
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
