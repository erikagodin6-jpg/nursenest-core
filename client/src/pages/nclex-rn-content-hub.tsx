import { useState } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  getNclexRnCategoryBySlug,
  getNclexRnConditionBySlug,
  getNclexRnMedicationBySlug,
  getNclexRnLabValueBySlug,
  getNclexRnComparisonBySlug,
  getNclexRnStrategyBySlug,
  type NclexRnPracticeQuestion,
  type NclexRnFAQ,
  type NclexRnInternalLink,
} from "@/data/nclex-rn-hub-data";
import {
  getRelatedLinksForNclexRnCondition,
  getRelatedLinksForNclexRnMedication,
  getRelatedLinksForNclexRnLabValue,
  mergeWithGeneratedNclexRnLinks,
  getValidatedNclexRnLinks,
} from "@/lib/nclex-rn-internal-links";
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

function PracticeQuestionBlock({ question, index }: { question: NclexRnPracticeQuestion; index: number }) {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  if (!question.isFree) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden" data-testid={`practice-question-${index}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white z-10" />
        <div className="flex items-center gap-2 mb-3 relative z-20">
          <Lock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-400">{t("pages.nclexRnContentHub.premiumQuestion")}</span>
        </div>
        <p className="text-gray-300 text-sm blur-[2px] select-none">{question.question}</p>
        <div className="relative z-20 mt-4 text-center">
          <LocaleLink href="/pricing">
            <Button size="sm" className="bg-primary hover:bg-primary/90" data-testid={`button-unlock-question-${index}`}>{t("pages.nclexRnContentHub.unlockAllQuestions")}</Button>
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid={`practice-question-${index}`}>
      <p className="font-medium text-gray-900 mb-4 text-sm leading-relaxed">{question.question}</p>
      <div className="space-y-2 mb-4">
        {question.options.map((opt, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = i === question.correctIndex;
          const showResult = showRationale;
          return (
            <button
              key={i}
              onClick={() => { if (!showRationale) { setSelectedIndex(i); setShowRationale(true); } }}
              className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-all ${showResult ? (isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" : isSelected && !isCorrect ? "border-red-300 bg-red-50 text-red-800" : "border-gray-100 text-gray-500") : isSelected ? "border-primary bg-primary/5 text-gray-900" : "border-gray-100 hover:border-gray-200 text-gray-700"}`}
              data-testid={`option-${index}-${i}`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />}
              {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 inline ml-2" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 leading-relaxed" data-testid={`rationale-${index}`}>
          <strong className="text-blue-800">{t("pages.nclexRnContentHub.rationale")}</strong> {question.rationale}
        </div>
      )}
    </div>
  );
}

function FAQBlock({ faq, index }: { faq: NclexRnFAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`faq-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`faq-toggle-${index}`}>
        <span className="font-medium text-sm text-gray-900 pr-4">{faq.question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.answer}</div>}
    </div>
  );
}

function CTABanner({ variant }: { variant: "default" | "mid" | "end" }) {
  if (variant === "default") {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-[#BFA6F6]/10 rounded-2xl p-6 border border-primary/20" data-testid="cta-banner-default">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.nclexRnContentHub.readyToPractice")}</h3>
            <p className="text-sm text-gray-600">{t("pages.nclexRnContentHub.takeAFulllengthNclexrnMock")}</p>
          </div>
          <LocaleLink href="/mock-exams"><Button className="bg-primary hover:bg-primary/90 whitespace-nowrap" data-testid="button-cta-mock-exam">{t("pages.nclexRnContentHub.startMockExam")}</Button></LocaleLink>
        </div>
      </div>
    );
  }
  if (variant === "mid") {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center" data-testid="cta-banner-mid">
        <p className="text-sm text-gray-600 mb-3">{t("pages.nclexRnContentHub.joinThousandsOfNursingStudents")}</p>
        <LocaleLink href="/pricing"><Button variant="outline" size="sm" data-testid="button-cta-pricing">{t("pages.nclexRnContentHub.viewPlansPricing")}</Button></LocaleLink>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] rounded-2xl p-8 text-center text-white" data-testid="cta-banner-end">
      <h3 className="text-xl font-bold mb-2">{t("pages.nclexRnContentHub.passTheNclexrnWithConfidence")}</h3>
      <p className="text-gray-300 text-sm mb-4 max-w-lg mx-auto">{t("pages.nclexRnContentHub.access3000PracticeQuestionsNgnformat")}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <LocaleLink href="/mock-exams"><Button className="bg-white text-[#2E3A59] hover:bg-gray-100" data-testid="button-cta-end-mock">{t("pages.nclexRnContentHub.tryAFreeMockExam")}</Button></LocaleLink>
        <LocaleLink href="/pricing"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-cta-end-pricing">{t("pages.nclexRnContentHub.viewPricing")}</Button></LocaleLink>
      </div>
    </div>
  );
}

function InternalLinksSection({ links }: { links: NclexRnInternalLink[] }) {
  if (links.length === 0) return null;
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-internal-links">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-gray-900">{t("pages.nclexRnContentHub.relatedResources")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link, i) => (
          <LocaleLink key={i} href={link.href} className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all text-sm text-gray-700 hover:text-primary" data-testid={`internal-link-${i}`}>
            <ArrowRight className="w-4 h-4 shrink-0 text-gray-400" />
            {link.title}
          </LocaleLink>
        ))}
      </div>
    </section>
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
        <h2 className="text-lg font-bold text-gray-900">{t("pages.nclexRnContentHub.references")}</h2>
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
    <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label={t("pages.nclexRnContentHub.breadcrumb")} data-testid="breadcrumb-nav">
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

function buildFaqStructuredData(faqs: NclexRnFAQ[]) {
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
        <p className="text-gray-500 mb-6">{t("pages.nclexRnContentHub.thePageYouAreLooking")}</p>
        <LocaleLink href={backHref}><Button variant="outline" data-testid="button-back">{backLabel}</Button></LocaleLink>
      </div>
    </div>
  );
}

export function NclexRnCategoryTemplate({ params: propParams }: { params?: { slug: string } } = {}) {
  const routeParams = useParams<{ slug: string }>();
  const slug = propParams?.slug || routeParams.slug || "";
  const page = getNclexRnCategoryBySlug(slug);

  if (!page) return <NotFound type="Category" backHref="/nclex-rn" backLabel="Back to NCLEX-RN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/nclex-rn/${page.slug}`,
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
        canonicalPath={`/nclex-rn/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NCLEX-RN", url: "https://www.nursenest.ca/nclex-rn" },
          { name: page.title, url: `https://www.nursenest.ca/nclex-rn/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "NCLEX-RN", href: "/nclex-rn" }, { label: page.title }]} />

        <header className="bg-gradient-to-br from-[#1a365d] to-[#2b4c8c] text-white py-12 px-4" data-testid="category-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#90cdf4]" />
              </div>
              <span className="text-[#90cdf4] text-sm font-semibold uppercase tracking-wider">{t("pages.nclexRnContentHub.nclexrnExamPrep")}</span>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.practiceQuestions")}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.frequentlyAskedQuestions")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={getValidatedNclexRnLinks(page.internalLinks)} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NclexRnConditionTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNclexRnConditionBySlug(params.slug || "");

  if (!page) return <NotFound type="Condition" backHref="/nclex-rn" backLabel="Back to NCLEX-RN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/nclex-rn/conditions/${page.slug}`,
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
        canonicalPath={`/nclex-rn/conditions/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NCLEX-RN", url: "https://www.nursenest.ca/nclex-rn" },
          { name: page.name, url: `https://www.nursenest.ca/nclex-rn/conditions/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "NCLEX-RN", href: "/nclex-rn" }, { label: page.name }]} />

        <header className="bg-gradient-to-br from-[#1a365d] to-[#2b4c8c] text-white py-12 px-4" data-testid="condition-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-[#90cdf4]" />
              </div>
              <span className="text-[#90cdf4] text-sm font-semibold uppercase tracking-wider">{t("pages.nclexRnContentHub.nclexrnConditionGuide")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-condition-title">{page.name} — NCLEX-RN Nursing Study Guide</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.definition}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-pathophysiology">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.pathophysiology")}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{page.pathophysiology}</p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-causes">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.causesRiskFactors")}</h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.signsSymptoms")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> {t("pages.nclexRnContentHub.earlySigns")}</h3>
                <ul className="space-y-2">
                  {page.signsSymptoms.early.map((s, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />{s}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" /> {t("pages.nclexRnContentHub.lateSevereSigns")}</h3>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.keyLabValues")}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.medications")}</h2>
              </div>
              <div className="space-y-4">
                {page.medications.map((med, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`med-${i}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{med.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{med.drugClass}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t("pages.nclexRnContentHub.action")}</strong> {med.action}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t("pages.nclexRnContentHub.sideEffects")}</strong> {med.sideEffects}</p>
                    <p className="text-sm text-gray-600"><strong>{t("pages.nclexRnContentHub.nursing")}</strong> {med.nursingConsiderations}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-nursing-interventions">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.nursingInterventions")}</h2>
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
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.nclexRnContentHub.complications")}</h2>
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
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.nclexRnContentHub.patientTeaching")}</h2>
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
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.nclexrnExamPearls")}</h2>
            </div>
            <ul className="space-y-2">
              {page.examPearls.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&#9733;</span>{item}</li>)}
            </ul>
            {page.commonTrapAnswers.length > 0 && (
              <div className="mt-6 pt-4 border-t border-amber-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" /> {t("pages.nclexRnContentHub.commonTrapAnswers")}</h3>
                <ul className="space-y-2">
                  {page.commonTrapAnswers.map((item, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-red-400 shrink-0">&#10007;</span>{item}</li>)}
                </ul>
              </div>
            )}
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.practiceQuestions2")}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.frequentlyAskedQuestions2")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={mergeWithGeneratedNclexRnLinks(page.internalLinks, getRelatedLinksForNclexRnCondition(page.slug))} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NclexRnMedicationTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNclexRnMedicationBySlug(params.slug || "");

  if (!page) return <NotFound type="Medication" backHref="/nclex-rn/pharmacology" backLabel="Back to Pharmacology" />;

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
        canonicalPath={`/nclex-rn/medications/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NCLEX-RN", url: "https://www.nursenest.ca/nclex-rn" },
          { name: "Pharmacology", url: "https://www.nursenest.ca/nclex-rn/pharmacology" },
          { name: page.genericName, url: `https://www.nursenest.ca/nclex-rn/medications/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "NCLEX-RN", href: "/nclex-rn" }, { label: "Pharmacology", href: "/nclex-rn/pharmacology" }, { label: page.genericName }]} />

        <header className="bg-gradient-to-br from-[#1a365d] to-[#2b4c8c] text-white py-12 px-4" data-testid="medication-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-[#90cdf4]" />
              </div>
              <span className="text-[#90cdf4] text-sm font-semibold uppercase tracking-wider">{page.drugClass}</span>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.mechanismOfAction")}</h2>
            <p className="text-gray-600 leading-relaxed">{page.mechanism}</p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-indications">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.indications")}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {page.indications.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-side-effects">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.sideEffectsAdverseReactions")}</h2>
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
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.nclexRnContentHub.contraindications")}</h2>
              <ul className="space-y-2">
                {page.contraindications.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-nursing-considerations">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.nclexRnContentHub.nursingConsiderations")}</h2>
              <ul className="space-y-2">
                {page.nursingConsiderations.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </section>
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-monitoring">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.monitoringParameters")}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {page.monitoring.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />{item}</li>)}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-patient-teaching">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.patientTeaching2")}</h2>
            <ul className="space-y-2">
              {page.patientTeaching.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{item}</li>)}
            </ul>
          </section>

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-exam-tips">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.nclexrnExamTips")}</h2>
            </div>
            <ul className="space-y-2">
              {page.examTips.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&#9733;</span>{item}</li>)}
            </ul>
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.practiceQuestions3")}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.frequentlyAskedQuestions3")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={mergeWithGeneratedNclexRnLinks(page.internalLinks, getRelatedLinksForNclexRnMedication(page.slug))} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NclexRnLabValueTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNclexRnLabValueBySlug(params.slug || "");

  if (!page) return <NotFound type="Lab Value" backHref="/nclex-rn" backLabel="Back to NCLEX-RN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/nclex-rn/lab-values/${page.slug}`,
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
        canonicalPath={`/nclex-rn/lab-values/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NCLEX-RN", url: "https://www.nursenest.ca/nclex-rn" },
          { name: page.name, url: `https://www.nursenest.ca/nclex-rn/lab-values/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "NCLEX-RN", href: "/nclex-rn" }, { label: `${page.name} Lab Values` }]} />

        <header className="bg-gradient-to-br from-[#1a365d] to-[#2b4c8c] text-white py-12 px-4" data-testid="lab-value-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-[#90cdf4]" />
              </div>
              <span className="text-[#90cdf4] text-sm font-semibold uppercase tracking-wider">{t("pages.nclexRnContentHub.labValueReference")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-lab-value-title">{page.fullName} — NCLEX-RN Study Guide</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.overview}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <CTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-normal-range">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.normalRange")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{t("pages.nclexRnContentHub.usUnits")}</p>
                <p className="text-3xl font-bold text-primary" data-testid="text-normal-range-us">{page.normalRangeUS.value} {page.normalRangeUS.unit}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{t("pages.nclexRnContentHub.canadianSiUnits")}</p>
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
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.nursingImplications")}</h2>
            </div>
            <ul className="space-y-2">
              {page.nursingImplications.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}</li>)}
            </ul>
          </section>

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-exam-alerts">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.nclexrnExamAlerts")}</h2>
            </div>
            <ul className="space-y-2">
              {page.examAlerts.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&#9733;</span>{item}</li>)}
            </ul>
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.practiceQuestions4")}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.frequentlyAskedQuestions4")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={mergeWithGeneratedNclexRnLinks(page.internalLinks, getRelatedLinksForNclexRnLabValue(page.slug))} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NclexRnComparisonTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNclexRnComparisonBySlug(params.slug || "");

  if (!page) return <NotFound type="Comparison" backHref="/nclex-rn" backLabel="Back to NCLEX-RN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/nclex-rn/compare/${page.slug}`,
    audience: { "@type": "MedicalAudience", audienceType: "Nursing Students" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/nclex-rn/compare/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NCLEX-RN", url: "https://www.nursenest.ca/nclex-rn" },
          { name: page.h1, url: `https://www.nursenest.ca/nclex-rn/compare/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "NCLEX-RN", href: "/nclex-rn" }, { label: page.h1 }]} />

        <header className="bg-gradient-to-br from-[#1a365d] to-[#2b4c8c] text-white py-12 px-4" data-testid="comparison-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Scale className="w-6 h-6 text-[#90cdf4]" />
              </div>
              <span className="text-[#90cdf4] text-sm font-semibold uppercase tracking-wider">{t("pages.nclexRnContentHub.clinicalComparison")}</span>
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
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-1/4">{t("pages.nclexRnContentHub.feature")}</th>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nclexRnContentHub.keyDifferences")}</h2>
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
              <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.clinicalPearls")}</h2>
            </div>
            <ul className="space-y-2">
              {page.clinicalPearls.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&#9733;</span>{item}</li>)}
            </ul>
          </section>

          <CTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.practiceQuestions5")}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.frequentlyAskedQuestions5")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={getValidatedNclexRnLinks(page.internalLinks)} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NclexRnStrategyTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNclexRnStrategyBySlug(params.slug || "");

  if (!page) return <NotFound type="Strategy" backHref="/nclex-rn" backLabel="Back to NCLEX-RN Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/nclex-rn/strategy/${page.slug}`,
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    dateModified: page.lastReviewed,
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/nclex-rn/strategy/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NCLEX-RN", url: "https://www.nursenest.ca/nclex-rn" },
          { name: page.h1, url: `https://www.nursenest.ca/nclex-rn/strategy/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "NCLEX-RN", href: "/nclex-rn" }, { label: page.h1 }]} />

        <header className="bg-gradient-to-br from-[#1a365d] to-[#2b4c8c] text-white py-12 px-4" data-testid="strategy-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#90cdf4]" />
              </div>
              <span className="text-[#90cdf4] text-sm font-semibold uppercase tracking-wider">{t("pages.nclexRnContentHub.examStrategy")}</span>
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
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">{t("pages.nclexRnContentHub.keyTips")}</h3>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.practiceQuestions6")}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.nclexRnContentHub.frequentlyAskedQuestions6")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <FAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <InternalLinksSection links={getValidatedNclexRnLinks(page.internalLinks)} />
          <ReferencesSection references={page.references} />
          <MedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <CTABanner variant="end" />
        </div>
      </div>
    </>
  );
}
