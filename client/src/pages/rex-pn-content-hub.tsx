import { useState } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  getRexPnCategoryBySlug,
  getRexPnConditionBySlug,
  getRexPnMedicationBySlug,
  getRexPnLabValueBySlug,
  getRexPnComparisonBySlug,
  getRexPnStrategyBySlug,
  type RexPnPracticeQuestion,
  type RexPnFAQ,
  type RexPnInternalLink,
} from "@/data/rex-pn-hub-data";
import {
  getRelatedLinksForCondition,
  getRelatedLinksForMedication,
  getRelatedLinksForLabValue,
  mergeWithGeneratedLinks,
  getValidatedLinks,
} from "@/lib/rex-pn-internal-links";
import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Stethoscope,
  Pill,
  FlaskConical,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Heart,
  ClipboardList,
  Lightbulb,
  Shield,
  GraduationCap,
  HelpCircle,
  FileText,
  Target,
  Scale,
  Lock,
} from "lucide-react";

function PracticeQuestionBlock({ question, index }: { question: RexPnPracticeQuestion; index: number }) {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  if (!question.isFree) {
    return (
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 relative overflow-hidden" data-testid={`practice-question-locked-${index}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-gray-50 z-10" />
        <p className="font-semibold text-gray-400 mb-4 text-sm leading-relaxed blur-[2px]">
          <span className="text-primary/40 font-bold mr-2">Q{index + 1}.</span>
          {question.question}
        </p>
        <div className="relative z-20 flex flex-col items-center justify-center py-4">
          <Lock className="w-8 h-8 text-gray-400 mb-3" />
          <p className="text-gray-600 font-semibold text-sm mb-2">{t("pages.rexPnContentHub.premiumPracticeQuestion")}</p>
          <p className="text-gray-500 text-xs mb-3 text-center max-w-sm">{t("pages.rexPnContentHub.upgradeToAccessAllPractice")}</p>
          <LocaleLink href="/pricing">
            <Button size="sm" className="bg-primary hover:bg-primary/90" data-testid={`button-unlock-question-${index}`}>
              Unlock All Questions <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </LocaleLink>
        </div>
      </div>
    );
  }

  const handleSelect = (optIdx: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(optIdx);
    setShowRationale(true);
  };

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white" data-testid={`practice-question-${index}`}>
      <p className="font-semibold text-gray-900 mb-4 text-sm leading-relaxed">
        <span className="text-primary font-bold mr-2">Q{index + 1}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, optIdx) => {
          let optionClass = "border border-gray-200 rounded-lg p-3 text-sm cursor-pointer transition-all hover:border-primary/40 hover:bg-primary/5";
          if (selectedIndex !== null) {
            if (optIdx === question.correctIndex) {
              optionClass = "border-2 border-emerald-500 rounded-lg p-3 text-sm bg-emerald-50";
            } else if (optIdx === selectedIndex && !isCorrect) {
              optionClass = "border-2 border-red-400 rounded-lg p-3 text-sm bg-red-50";
            } else {
              optionClass = "border border-gray-200 rounded-lg p-3 text-sm opacity-60";
            }
          }
          return (
            <button
              key={optIdx}
              onClick={() => handleSelect(optIdx)}
              className={`w-full text-left flex items-start gap-3 ${optionClass}`}
              disabled={selectedIndex !== null}
              data-testid={`question-${index}-option-${optIdx}`}
            >
              <span className="font-semibold text-gray-500 mt-0.5 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
              <span className="text-gray-700">{option}</span>
              {selectedIndex !== null && optIdx === question.correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 ml-auto" />}
              {selectedIndex !== null && optIdx === selectedIndex && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 ml-auto" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className={`mt-4 p-4 rounded-lg text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`} data-testid={`rationale-${index}`}>
          <p className="font-semibold mb-1 text-gray-900">{isCorrect ? "Correct!" : "Incorrect"} — Rationale:</p>
          <p className="text-gray-700">{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

function FAQBlock({ faq, index }: { faq: RexPnFAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4 text-sm">{faq.question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3 text-sm" data-testid={`faq-answer-${index}`}>
          {faq.answer}
        </div>
      )}
    </div>
  );
}

function InternalLinksSection({ links }: { links: RexPnInternalLink[] }) {
  if (!links.length) return null;
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-internal-links">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.relatedStudyResources")}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link, i) => (
          <LocaleLink
            key={i}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            data-testid={`internal-link-${i}`}
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{link.title}</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary ml-auto shrink-0" />
          </LocaleLink>
        ))}
      </div>
    </section>
  );
}

function CTABanner({ variant = "default" }: { variant?: "default" | "mid" | "end" }) {
  const text = variant === "end"
    ? "Ready to test your knowledge? Take a full-length CAT practice exam."
    : variant === "mid"
      ? "Want more practice questions like these? Access our complete question bank."
      : "Start your REx-PN preparation with personalized practice questions.";
  return (
    <div className="bg-gradient-to-r from-[#2E3A59] to-[#3d4f7a] rounded-2xl p-6 md:p-8 text-white" data-testid={`cta-banner-${variant}`}>
      <p className="text-lg font-semibold mb-2">{text}</p>
      <p className="text-gray-300 text-sm mb-4">{t("pages.rexPnContentHub.joinThousandsOfCanadianNursing")}</p>
      <div className="flex flex-wrap gap-3">
        <LocaleLink href="/mock-exams">
          <Button className="bg-white text-[#2E3A59] hover:bg-gray-100 font-semibold" data-testid="button-cta-mock-exam">
            Try a Mock Exam <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </LocaleLink>
        <LocaleLink href="/pricing">
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-cta-pricing">
            View Plans
          </Button>
        </LocaleLink>
      </div>
    </div>
  );
}

function MedicallyReviewedBadge({ reviewer, date }: { reviewer: string; date: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2 border border-gray-100" data-testid="medically-reviewed-badge">
      <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
      <span>Medically reviewed by {reviewer} · Last updated {date}</span>
    </div>
  );
}

function ReferencesSection({ references }: { references?: string[] }) {
  if (!references || references.length === 0) return null;
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-references">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-5 h-5 text-gray-500" />
        <h2 className="text-lg font-bold text-gray-900">{t("pages.rexPnContentHub.references")}</h2>
      </div>
      <ol className="list-decimal list-inside space-y-2">
        {references.map((ref, i) => (
          <li key={i} className="text-sm text-gray-600 leading-relaxed" data-testid={`reference-${i}`}>{ref}</li>
        ))}
      </ol>
    </section>
  );
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label={t("pages.rexPnContentHub.breadcrumb")} data-testid="breadcrumb-nav">
      <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <LocaleLink href={item.href} className="hover:text-primary transition-colors">{item.label}</LocaleLink>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}

function buildFaqStructuredData(faqs: RexPnFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function NotFound({ type, backHref, backLabel }: { type: string; backHref: string; backLabel: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center" data-testid={`${type}-not-found`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{type} Not Found</h1>
        <p className="text-gray-500 mb-6">{t("pages.rexPnContentHub.thePageYouAreLooking")}</p>
        <LocaleLink href={backHref}><Button variant="outline" data-testid="button-back">{backLabel}</Button></LocaleLink>
      </div>
    </div>
  );
}

export function RexPnCategoryTemplate({ params: propParams }: { params?: { slug: string } } = {}) {
  const routeParams = useParams<{ slug: string }>();
  const slug = propParams?.slug || routeParams.slug || "";
  const page = getRexPnCategoryBySlug(slug);

  if (!page) return <NotFound type="Category" backHref="/rex-pn" backLabel="Back to REx-PN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/rex-pn/${page.slug}`,
    isPartOf: { "@type": "WebSite", name: "NurseNest", url: "https://www.nursenest.ca" },
    audience: { "@type": "MedicalAudience", audienceType: "Nursing Students" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/rex-pn/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "REx-PN", url: "https://www.nursenest.ca/rex-pn" },
          { name: page.title, url: `https://www.nursenest.ca/rex-pn/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "REx-PN", href: "/rex-pn" }, { label: page.title }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="category-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.rexPnContentHub.rexpnExamPrep")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-category-title">{page.h1}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.introText}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          {page.sections.map((section, i) => (
            <section key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </section>
          ))}

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.practiceQuestions")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <PracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          <CTABanner variant="mid" />

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.frequentlyAskedQuestions")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={getValidatedLinks(page.internalLinks)} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function RexPnConditionTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getRexPnConditionBySlug(params.slug || "");

  if (!page) return <NotFound type="Condition" backHref="/rex-pn" backLabel="Back to REx-PN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/rex-pn/conditions/${page.slug}`,
    about: { "@type": "MedicalCondition", name: page.name, description: page.definition },
    audience: { "@type": "MedicalAudience", audienceType: "Nursing Students" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    lastReviewed: page.lastReviewed,
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/rex-pn/conditions/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "REx-PN", url: "https://www.nursenest.ca/rex-pn" },
          { name: page.name, url: `https://www.nursenest.ca/rex-pn/conditions/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "REx-PN", href: "/rex-pn" }, { label: page.name }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="condition-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.rexPnContentHub.rexpnConditionGuide")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-condition-title">{page.name} — Nursing Study Guide for the REx-PN</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.definition}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-pathophysiology">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.pathophysiology")}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{page.pathophysiology}</p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-causes">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentHub.causesRiskFactors")}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {page.causesRiskFactors.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-signs-symptoms">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentHub.signsSymptoms")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> {t("pages.rexPnContentHub.earlySigns")}</h3>
                <ul className="space-y-2">
                  {page.signsSymptoms.early.map((s, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />{s}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" /> {t("pages.rexPnContentHub.lateSevereSigns")}</h3>
                <ul className="space-y-2">
                  {page.signsSymptoms.late.map((s, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />{s}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {page.labs.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-labs">
              <div className="flex items-center gap-3 mb-4">
                <FlaskConical className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.keyLabValues")}</h2>
              </div>
              <div className="space-y-4">
                {page.labs.map((lab, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`lab-${i}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{lab.name}</h3>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{lab.normalRange}</span>
                    </div>
                    <p className="text-sm text-gray-600">{lab.significance}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {page.medications.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-medications">
              <div className="flex items-center gap-3 mb-4">
                <Pill className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.medications")}</h2>
              </div>
              <div className="space-y-4">
                {page.medications.map((med, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`med-${i}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{med.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{med.drugClass}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t("pages.rexPnContentHub.action")}</strong> {med.action}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t("pages.rexPnContentHub.sideEffects")}</strong> {med.sideEffects}</p>
                    <p className="text-sm text-gray-600"><strong>{t("pages.rexPnContentHub.nursing")}</strong> {med.nursingConsiderations}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-nursing-interventions">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.nursingInterventions")}</h2>
            </div>
            <ul className="space-y-2">
              {page.nursingInterventions.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-complications">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.rexPnContentHub.complications")}</h2>
              <ul className="space-y-2">
                {page.complications.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-patient-teaching">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.rexPnContentHub.patientTeaching")}</h2>
              <ul className="space-y-2">
                {page.patientTeaching.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-exam-pearls">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.rexpnExamPearls")}</h2>
            </div>
            <ul className="space-y-2">
              {page.examPearls.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
            {page.commonTrapAnswers.length > 0 && (
              <div className="mt-6 pt-4 border-t border-amber-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" /> {t("pages.rexPnContentHub.commonTrapAnswers")}</h3>
                <ul className="space-y-2">
                  {page.commonTrapAnswers.map((item, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-red-400 shrink-0">✗</span>{item}</li>)}
                </ul>
              </div>
            )}
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.practiceQuestions2")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <PracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.frequentlyAskedQuestions2")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={mergeWithGeneratedLinks(page.internalLinks, getRelatedLinksForCondition(page.slug))} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function RexPnMedicationTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getRexPnMedicationBySlug(params.slug || "");

  if (!page) return <NotFound type="Medication" backHref="/rex-pn/pharmacology" backLabel="Back to Pharmacology" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: page.genericName,
    alternateName: page.brandNames,
    drugClass: page.drugClass,
    mechanismOfAction: page.mechanism,
    description: page.metaDescription,
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/rex-pn/medications/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "REx-PN", url: "https://www.nursenest.ca/rex-pn" },
          { name: "Pharmacology", url: "https://www.nursenest.ca/rex-pn/pharmacology" },
          { name: page.genericName, url: `https://www.nursenest.ca/rex-pn/medications/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "REx-PN", href: "/rex-pn" }, { label: "Pharmacology", href: "/rex-pn/pharmacology" }, { label: page.genericName }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="medication-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{page.drugClass}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" data-testid="text-medication-title">
              {page.genericName} ({page.brandNames.join(", ")})
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.metaDescription}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-mechanism">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentHub.mechanismOfAction")}</h2>
            <p className="text-gray-600 leading-relaxed">{page.mechanism}</p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-indications">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentHub.indications")}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {page.indications.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-side-effects">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentHub.sideEffectsAdverseReactions")}</h2>
            <div className="space-y-3">
              {page.sideEffects.map((se, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`side-effect-${i}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{se.effect}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${se.severity === "Serious" ? "bg-orange-100 text-orange-800 border-orange-200" : se.severity === "Life-threatening" ? "bg-red-100 text-red-800 border-red-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}`}>
                      {se.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{se.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-contraindications">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.rexPnContentHub.contraindications")}</h2>
              <ul className="space-y-2">
                {page.contraindications.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-monitoring">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.rexPnContentHub.monitoringParameters")}</h2>
              <ul className="space-y-2">
                {page.monitoring.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><Activity className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </section>
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-nursing-considerations">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.nursingConsiderations")}</h2>
            </div>
            <ul className="space-y-2">
              {page.nursingConsiderations.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}</li>)}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-patient-teaching">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentHub.patientTeaching2")}</h2>
            <ul className="space-y-2">
              {page.patientTeaching.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{item}</li>)}
            </ul>
          </section>

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-exam-tips">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.rexpnExamTips")}</h2>
            </div>
            <ul className="space-y-2">
              {page.examTips.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.practiceQuestions3")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <PracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.frequentlyAskedQuestions3")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={mergeWithGeneratedLinks(page.internalLinks, getRelatedLinksForMedication(page.slug))} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function RexPnLabValueTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getRexPnLabValueBySlug(params.slug || "");

  if (!page) return <NotFound type="Lab Value" backHref="/rex-pn" backLabel="Back to REx-PN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/rex-pn/lab-values/${page.slug}`,
    about: { "@type": "MedicalTest", name: page.fullName, normalRange: `${page.normalRangeUS.value} ${page.normalRangeUS.unit}` },
    audience: { "@type": "MedicalAudience", audienceType: "Nursing Students" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/rex-pn/lab-values/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "REx-PN", url: "https://www.nursenest.ca/rex-pn" },
          { name: page.name, url: `https://www.nursenest.ca/rex-pn/lab-values/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "REx-PN", href: "/rex-pn" }, { label: `${page.name} Lab Values` }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="lab-value-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.rexPnContentHub.labValueReference")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-lab-value-title">{page.fullName} — REx-PN Study Guide</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.overview}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-normal-range">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.normalRange")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{t("pages.rexPnContentHub.usUnits")}</p>
                <p className="text-3xl font-bold text-primary" data-testid="text-normal-range-us">{page.normalRangeUS.value} {page.normalRangeUS.unit}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{t("pages.rexPnContentHub.canadianSiUnits")}</p>
                <p className="text-3xl font-bold text-blue-700" data-testid="text-normal-range-ca">{page.normalRangeCA.value} {page.normalRangeCA.unit}</p>
              </div>
            </div>
          </section>

          {page.highSignificance.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-high-significance">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">Elevated {page.name} — Causes & Significance</h2>
              </div>
              <div className="space-y-3">
                {page.highSignificance.map((item, i) => (
                  <div key={i} className="border-l-4 border-red-300 pl-4 py-2" data-testid={`high-cause-${i}`}>
                    <p className="font-semibold text-gray-900 text-sm">{item.condition}</p>
                    <p className="text-sm text-gray-600">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {page.lowSignificance.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-low-significance">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Low {page.name} — Causes & Significance</h2>
              </div>
              <div className="space-y-3">
                {page.lowSignificance.map((item, i) => (
                  <div key={i} className="border-l-4 border-blue-300 pl-4 py-2" data-testid={`low-cause-${i}`}>
                    <p className="font-semibold text-gray-900 text-sm">{item.condition}</p>
                    <p className="text-sm text-gray-600">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-nursing-implications">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.nursingImplications")}</h2>
            </div>
            <ul className="space-y-2">
              {page.nursingImplications.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}</li>)}
            </ul>
          </section>

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-exam-alerts">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.rexpnExamAlerts")}</h2>
            </div>
            <ul className="space-y-2">
              {page.examAlerts.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.practiceQuestions4")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <PracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.frequentlyAskedQuestions4")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={mergeWithGeneratedLinks(page.internalLinks, getRelatedLinksForLabValue(page.slug))} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function RexPnComparisonTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getRexPnComparisonBySlug(params.slug || "");

  if (!page) return <NotFound type="Comparison" backHref="/rex-pn" backLabel="Back to REx-PN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/rex-pn/compare/${page.slug}`,
    audience: { "@type": "MedicalAudience", audienceType: "Nursing Students" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/rex-pn/compare/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "REx-PN", url: "https://www.nursenest.ca/rex-pn" },
          { name: page.h1, url: `https://www.nursenest.ca/rex-pn/compare/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "REx-PN", href: "/rex-pn" }, { label: page.h1 }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="comparison-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Scale className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.rexPnContentHub.clinicalComparison")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-comparison-title">{page.h1}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.introText}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" data-testid="section-comparison-table">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-1/4">{t("pages.rexPnContentHub.feature")}</th>
                    <th className="text-left px-4 py-3 font-semibold text-blue-700 w-[37.5%]">{page.conditionA.name}</th>
                    <th className="text-left px-4 py-3 font-semibold text-purple-700 w-[37.5%]">{page.conditionB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonCategories.map((cat, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`} data-testid={`comparison-row-${i}`}>
                      <td className="px-4 py-3 font-medium text-gray-800">{cat}</td>
                      <td className="px-4 py-3 text-gray-600">{page.conditionA.features[cat] || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{page.conditionB.features[cat] || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-key-differences">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnContentHub.keyDifferences")}</h2>
            <ul className="space-y-2">
              {page.keyDifferences.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-clinical-pearls">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.clinicalPearls")}</h2>
            </div>
            <ul className="space-y-2">
              {page.clinicalPearls.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.practiceQuestions5")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <PracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.frequentlyAskedQuestions5")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={getValidatedLinks(page.internalLinks)} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function RexPnStrategyTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getRexPnStrategyBySlug(params.slug || "");

  if (!page) return <NotFound type="Strategy" backHref="/rex-pn" backLabel="Back to REx-PN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/rex-pn/strategy/${page.slug}`,
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    dateModified: page.lastReviewed,
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/rex-pn/strategy/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "REx-PN", url: "https://www.nursenest.ca/rex-pn" },
          { name: page.h1, url: `https://www.nursenest.ca/rex-pn/strategy/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "REx-PN", href: "/rex-pn" }, { label: page.h1 }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="strategy-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.rexPnContentHub.examStrategy")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-strategy-title">{page.h1}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.introText}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          {page.sections.map((section, i) => (
            <section key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>
              {section.tips && section.tips.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">{t("pages.rexPnContentHub.keyTips")}</h3>
                  <ul className="space-y-1">
                    {section.tips.map((tip, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.practiceQuestions6")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <PracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.rexPnContentHub.frequentlyAskedQuestions6")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={getValidatedLinks(page.internalLinks)} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}
