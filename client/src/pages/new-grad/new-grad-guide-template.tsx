import { useState } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { ChecklistGate, FlashcardCTA, PracticeQuestionCTA } from "@/components/marketing-cta";
import { AutoRelatedContent } from "@/components/auto-related-content";
import { useI18n } from "@/lib/i18n";
import {
  ChevronRight, ChevronDown, HelpCircle, BookOpen, ArrowRight,
  Clock, User, Calendar, List,
} from "lucide-react";

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideTOCItem {
  id: string;
  title: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  items?: string[];
}

export interface GuideInternalLink {
  title: string;
  href: string;
  description: string;
}

export interface GuideData {
  slug: string;
  type: "survival-guide" | "clinical-skills" | "unit-guide" | "career-development" | "clinical-scenario";
  title: string;
  subtitle: string;
  profession: string;
  professionSlug: string;
  readTime: string;
  author: string;
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  sections: GuideSection[];
  faqs: GuideFAQ[];
  relatedLinks: GuideInternalLink[];
  flashcardHref?: string;
  questionBankHref?: string;
}

const TYPE_LABELS: Record<string, string> = {
  "survival-guide": "Survival Guide",
  "clinical-skills": "Clinical Skills Guide",
  "unit-guide": "Unit Guide",
  "career-development": "Career Development",
  "clinical-scenario": "Clinical Scenario",
};

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

interface NewGradGuideProps {
  guideData: GuideData;
}

export function NewGradGuide({ guideData }: NewGradGuideProps) {
  const { t } = useI18n();
  const guide = guideData;

  const sections = Array.isArray(guide.sections) ? guide.sections : [];
  const faqs = Array.isArray(guide.faqs) ? guide.faqs : [];
  const relatedLinks = Array.isArray(guide.relatedLinks) ? guide.relatedLinks : [];

  const displayTitle = guide.title?.trim() || "Guide";
  const seoTitleSafe = guide.seoTitle?.trim() || displayTitle;
  const seoDescriptionSafe =
    guide.seoDescription?.trim() || guide.subtitle?.trim() || "New graduate nursing guide from NurseNest.";
  const professionDisplay = guide.profession?.trim() || "New graduates";
  const professionSlugSafe = guide.professionSlug?.trim() || "nursing";

  const tocItems: GuideTOCItem[] = sections.map(s => ({ id: s.id, title: s.title }));
  if (faqs.length > 0) {
    tocItems.push({ id: "faq", title: "Frequently Asked Questions" });
  }

  const faqStructuredData = faqs.length > 0
    ? buildFaqStructuredData(faqs.map(f => ({ question: f.question, answer: f.answer })))
    : null;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": seoTitleSafe,
    "description": seoDescriptionSafe,
    "author": { "@type": "Organization", "name": "NurseNest" },
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "inLanguage": "en",
    "datePublished": guide.publishDate,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.nursenest.ca/${guide.slug}` },
  };

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
    { name: professionDisplay, url: `https://www.nursenest.ca/new-grad/${professionSlugSafe}` },
    { name: displayTitle, url: `https://www.nursenest.ca/${guide.slug}` },
  ];

  return (
    <div data-testid={`guide-page-${guide.slug}`}>
      <Navigation />
      <SEO
        title={seoTitleSafe}
        description={seoDescriptionSafe}
        keywords={guide.seoKeywords?.trim() || displayTitle}
        canonicalPath={`/${guide.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={faqStructuredData ? [faqStructuredData] : undefined}
        breadcrumbs={breadcrumbItems}
      />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="nav-breadcrumb">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.newGradGuideTemplate.home")}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.newGradGuideTemplate.newGradHub")}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/new-grad/${professionSlugSafe}`} className="hover:text-blue-600">{professionDisplay}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium truncate">{displayTitle}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Table of Contents
                  </h3>
                  <ul className="space-y-1.5" data-testid="toc-list">
                    {tocItems.map((item, i) => (
                      <li key={i}>
                        <a href={`#${item.id}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-0.5">
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <FlashcardCTA
                  profession={professionDisplay.toLowerCase()}
                  href={guide.flashcardHref || "/flashcards"}
                  variant="sidebar"
                />

                <PracticeQuestionCTA
                  profession={professionDisplay.toLowerCase()}
                  href={guide.questionBankHref || "/free-practice"}
                  variant="sidebar"
                />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700" data-testid="badge-guide-type">
                  {TYPE_LABELS[guide.type] || guide.type}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {guide.readTime}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-title">
                {displayTitle}
              </h1>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed" data-testid="text-subtitle">
                {guide.subtitle?.trim() || ""}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-200">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {guide.author?.trim() || "NurseNest"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {guide.publishDate}
                </span>
              </div>

              {sections.map((section, i) => (
                <section
                  key={section.id || `section-${i}`}
                  id={section.id || `section-${i}`}
                  className="mb-10"
                  data-testid={`section-${section.id || i}`}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title?.trim() || "Section"}</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">{section.content?.trim() || ""}</p>
                  {Array.isArray(section.items) && section.items.length > 0 && (
                    <ul className="space-y-2 pl-1">
                      {section.items.filter((item): item is string => typeof item === "string").map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-700">
                          <List className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {i === 1 && (
                    <div className="mt-6">
                      <ChecklistGate
                        title={`Download Your ${professionDisplay} Survival Checklist`}
                        description={t("pages.newGrad.newGradGuideTemplate.getAPrintableDaybydayChecklist")}
                        checklistName={`${professionSlugSafe}-guide-checklist`}
                      />
                    </div>
                  )}

                  {i === Math.floor(sections.length / 2) && (
                    <div className="mt-6">
                      <FlashcardCTA
                        profession={professionDisplay.toLowerCase()}
                        href={guide.flashcardHref || "/flashcards"}
                        variant="banner"
                      />
                    </div>
                  )}
                </section>
              ))}

              {faqs.length > 0 && (
                <section id="faq" className="mb-12" data-testid="section-faq">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <FAQItem
                        key={i}
                        question={faq.question?.trim() || ""}
                        answer={faq.answer?.trim() || ""}
                        index={i}
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="mb-12">
                <PracticeQuestionCTA
                  profession={professionDisplay.toLowerCase()}
                  href={guide.questionBankHref || "/free-practice"}
                  variant="banner"
                />
              </div>

              <AutoRelatedContent
                slug={guide.slug}
                contentType="new-grad-guide"
                title={displayTitle}
                profession={professionDisplay}
                category={guide.type}
                className="mb-12 pt-8 border-t border-gray-200"
                sectionTitle="Related Lessons & Study Resources"
              />

              {relatedLinks.length > 0 && (
                <section className="mb-12" data-testid="section-related">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.newGrad.newGradGuideTemplate.relatedResources")}</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedLinks.map((link, i) => (
                      <Link key={i} href={link.href} className="group" data-testid={`link-related-${i}`}>
                        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
                          <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{link.title}</h3>
                            <p className="text-xs text-gray-500 truncate">{link.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center" data-testid="section-bottom-cta">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.newGrad.newGradGuideTemplate.readyToBuildYourCareer")}</h3>
                <p className="text-gray-600 mb-4">Explore our complete {professionDisplay.toLowerCase()} resource hub for more guides, exam prep, and career tools.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/new-grad/${professionSlugSafe}`}>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="button-cta-hub">
                      {professionDisplay} Hub <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/pricing">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-cta-pricing">
                      View Pricing
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NewGradGuidePage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  return (
    <div data-testid="guide-page-placeholder">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.newGrad.newGradGuideTemplate.guideComingSoon")}</h1>
          <p className="text-gray-600 mb-4">{t("pages.newGrad.newGradGuideTemplate.thisGuideIsBeingDeveloped")}</p>
          <Link href="/new-grad" className="text-blue-600 hover:underline">{t("pages.newGrad.newGradGuideTemplate.backToNewGradHub")}</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
