import { useState } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  getNpExamCategoryBySlug,
  getNpExamConditionBySlug,
  getNpExamMedicationBySlug,
  getNpExamLabValueBySlug,
  getNpExamComparisonBySlug,
  getNpExamStrategyBySlug,
  getNpExamCaseStudyBySlug,
  type NpPracticeQuestion,
  type NpFAQ,
  type NpInternalLink,
} from "@/data/np-exam-content-data";
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

function NpPracticeQuestionBlock({ question, index }: { question: NpPracticeQuestion; index: number }) {
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
          <p className="text-gray-600 font-semibold text-sm mb-2">{t("pages.npExamContentHub.premiumPracticeQuestion")}</p>
          <p className="text-gray-500 text-xs mb-3 text-center max-w-sm">{t("pages.npExamContentHub.upgradeToAccessAllNp")}</p>
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

function NpFAQBlock({ faq, index }: { faq: NpFAQ; index: number }) {
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

function NpInternalLinksSection({ links }: { links: NpInternalLink[] }) {
  if (!links.length) return null;
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-internal-links">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.relatedStudyResources")}</h2>
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

function NpCTABanner({ variant = "default" }: { variant?: "default" | "mid" | "end" }) {
  const text = variant === "end"
    ? "Ready to test your clinical reasoning? Take a full-length NP board practice exam."
    : variant === "mid"
      ? "Want more NP-level practice questions? Access our complete AANP & ANCC question bank."
      : "Start your NP board preparation with advanced clinical practice questions.";
  return (
    <div className="bg-gradient-to-r from-[#2E3A59] to-[#3d4f7a] rounded-2xl p-6 md:p-8 text-white" data-testid={`cta-banner-${variant}`}>
      <p className="text-lg font-semibold mb-2">{text}</p>
      <p className="text-gray-300 text-sm mb-4">{t("pages.npExamContentHub.joinThousandsOfNpStudents")}</p>
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

function NpMedicallyReviewedBadge({ reviewer, date }: { reviewer: string; date: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2 border border-gray-100" data-testid="medically-reviewed-badge">
      <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
      <span>Medically reviewed by {reviewer} · Last updated {date}</span>
    </div>
  );
}

function NpReferencesSection({ references }: { references?: string[] }) {
  if (!references || references.length === 0) return null;
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-references">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-5 h-5 text-gray-500" />
        <h2 className="text-lg font-bold text-gray-900">{t("pages.npExamContentHub.references")}</h2>
      </div>
      <ol className="list-decimal list-inside space-y-2">
        {references.map((ref, i) => (
          <li key={i} className="text-sm text-gray-600 leading-relaxed" data-testid={`reference-${i}`}>{ref}</li>
        ))}
      </ol>
    </section>
  );
}

function NpBreadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label={t("pages.npExamContentHub.breadcrumb")} data-testid="breadcrumb-nav">
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

function buildNpFaqStructuredData(faqs: NpFAQ[]) {
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

function NpNotFound({ type, backHref, backLabel }: { type: string; backHref: string; backLabel: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center" data-testid={`${type}-not-found`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{type} Not Found</h1>
        <p className="text-gray-500 mb-6">{t("pages.npExamContentHub.thePageYouAreLooking")}</p>
        <LocaleLink href={backHref}><Button variant="outline" data-testid="button-back">{backLabel}</Button></LocaleLink>
      </div>
    </div>
  );
}

function NpListSection({ title, icon, items, iconColor = "text-emerald-500", itemIcon }: { title: string; icon: React.ReactNode; items: string[]; iconColor?: string; itemIcon?: "check" | "alert" | "arrow" | "star" | "file" }) {
  if (!items.length) return null;
  const ItemIcon = itemIcon === "alert" ? AlertTriangle : itemIcon === "arrow" ? ArrowRight : itemIcon === "star" ? Lightbulb : itemIcon === "file" ? FileText : CheckCircle2;
  const itemIconColor = itemIcon === "alert" ? "text-red-400" : itemIcon === "arrow" ? "text-primary" : itemIcon === "star" ? "text-amber-500" : itemIcon === "file" ? "text-blue-400" : "text-emerald-500";
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
            <ItemIcon className={`w-4 h-4 ${itemIconColor} shrink-0 mt-0.5`} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NpExamCategoryTemplate({ params: propParams }: { params?: { slug: string } } = {}) {
  const routeParams = useParams<{ slug: string }>();
  const slug = propParams?.slug || routeParams.slug || "";
  const page = getNpExamCategoryBySlug(slug);

  if (!page) return <NpNotFound type="Category" backHref="/np-exam-prep" backLabel="Back to NP Exam Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/np-exam/${page.slug}`,
    isPartOf: { "@type": "WebSite", name: "NurseNest", url: "https://www.nursenest.ca" },
    audience: { "@type": "MedicalAudience", audienceType: "Nurse Practitioners" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/np-exam/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildNpFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: page.title, url: `https://www.nursenest.ca/np-exam/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <NpBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "NP Exam Prep", href: "/np-exam-prep" }, { label: page.title }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="category-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.npExamContentHub.npBoardExamPrep")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-category-title">{page.h1}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.introText}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <NpCTABanner variant="default" />

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
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.practiceQuestions")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <NpPracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          <NpCTABanner variant="mid" />

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.frequentlyAskedQuestions")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <NpFAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <NpInternalLinksSection links={page.internalLinks} />
          <NpReferencesSection references={page.references} />
          <NpMedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <NpCTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NpExamConditionTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNpExamConditionBySlug(params.slug || "");

  if (!page) return <NpNotFound type="Condition" backHref="/np-exam-prep" backLabel="Back to NP Exam Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/np-exam/conditions/${page.slug}`,
    about: { "@type": "MedicalCondition", name: page.name, description: page.definition },
    audience: { "@type": "MedicalAudience", audienceType: "Nurse Practitioners" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    lastReviewed: page.lastReviewed,
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/np-exam/conditions/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildNpFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: page.name, url: `https://www.nursenest.ca/np-exam/conditions/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <NpBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "NP Exam Prep", href: "/np-exam-prep" }, { label: page.name }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="condition-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.npExamContentHub.npConditionGuide")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-condition-title">{page.name} — NP Board Exam Study Guide</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.definition}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <NpCTABanner variant="default" />

          <NpListSection title={t("pages.npExamContentHub.differentialDiagnosis")} icon={<Activity className="w-5 h-5 text-primary" />} items={page.differentialDiagnosis} itemIcon="arrow" />

          <NpListSection title={t("pages.npExamContentHub.recommendedWorkup")} icon={<FlaskConical className="w-5 h-5 text-primary" />} items={page.recommendedWorkup} />

          <section className="bg-red-50 rounded-2xl border border-red-200 p-6 md:p-8" data-testid="section-red-flags">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.redFlags")}</h2>
            </div>
            <ul className="space-y-2">
              {page.redFlags.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-first-line-management">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> {t("pages.npExamContentHub.firstlineManagement")}</h2>
              <ul className="space-y-2">
                {page.firstLineManagement.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />{item}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-second-line-management">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-blue-500" /> {t("pages.npExamContentHub.secondlineManagement")}</h2>
              <ul className="space-y-2">
                {page.secondLineManagement.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />{item}</li>)}
              </ul>
            </section>
          </div>

          <NpListSection title={t("pages.npExamContentHub.prescribingPearls")} icon={<Pill className="w-5 h-5 text-primary" />} items={page.prescribingPearls} itemIcon="star" />

          <NpListSection title={t("pages.npExamContentHub.patientCounseling")} icon={<Heart className="w-5 h-5 text-primary" />} items={page.patientCounseling} itemIcon="file" />

          <NpListSection title={t("pages.npExamContentHub.followupConsiderations")} icon={<ClipboardList className="w-5 h-5 text-primary" />} items={page.followUpConsiderations} />

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-board-exam-pearls">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.npBoardExamPearls")}</h2>
            </div>
            <ul className="space-y-2">
              {page.boardExamPearls.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
          </section>

          <NpCTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.practiceQuestions2")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <NpPracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.frequentlyAskedQuestions2")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <NpFAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <NpInternalLinksSection links={page.internalLinks} />
          <NpReferencesSection references={page.references} />
          <NpMedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <NpCTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NpExamMedicationTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNpExamMedicationBySlug(params.slug || "");

  if (!page) return <NpNotFound type="Medication" backHref="/np-exam/pharmacology" backLabel="Back to Pharmacology" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/np-exam/medications/${page.slug}`,
    about: { "@type": "Drug", name: page.className },
    audience: { "@type": "MedicalAudience", audienceType: "Nurse Practitioners" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/np-exam/medications/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildNpFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: "Pharmacology", url: "https://www.nursenest.ca/np-exam/pharmacology" },
          { name: page.className, url: `https://www.nursenest.ca/np-exam/medications/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <NpBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "NP Exam Prep", href: "/np-exam-prep" }, { label: "Pharmacology", href: "/np-exam/pharmacology" }, { label: page.className }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="medication-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.npExamContentHub.npPharmacology")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" data-testid="text-medication-title">{page.className}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.metaDescription}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <NpCTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-mechanism">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.npExamContentHub.mechanismOfAction")}</h2>
            <p className="text-gray-600 leading-relaxed">{page.mechanism}</p>
          </section>

          {page.keyDrugs.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-key-drugs">
              <div className="flex items-center gap-3 mb-4">
                <Pill className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.keyDrugsDosing")}</h2>
              </div>
              <div className="space-y-4">
                {page.keyDrugs.map((drug, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`key-drug-${i}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">{drug.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div><span className="text-gray-500">{t("pages.npExamContentHub.start")}</span> <span className="font-mono text-gray-700">{drug.startDose}</span></div>
                      <div><span className="text-gray-500">{t("pages.npExamContentHub.max")}</span> <span className="font-mono text-gray-700">{drug.maxDose}</span></div>
                    </div>
                    <p className="text-sm text-gray-600">{drug.notes}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <NpListSection title={t("pages.npExamContentHub.indications")} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} items={page.indications} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-contraindications">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.npExamContentHub.contraindications")}</h2>
              <ul className="space-y-2">
                {page.contraindications.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-testid="section-drug-interactions">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("pages.npExamContentHub.drugInteractions")}</h2>
              <ul className="space-y-2">
                {page.drugInteractions.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </section>
          </div>

          <NpListSection title={t("pages.npExamContentHub.monitoringParameters")} icon={<Activity className="w-5 h-5 text-blue-500" />} items={page.monitoringParameters} />

          <NpListSection title={t("pages.npExamContentHub.dosingConsiderations")} icon={<ClipboardList className="w-5 h-5 text-primary" />} items={page.dosingConsiderations} />

          <NpListSection title={t("pages.npExamContentHub.whenToSwitchTherapy")} icon={<ArrowRight className="w-5 h-5 text-primary" />} items={page.whenToSwitchTherapy} itemIcon="arrow" />

          <NpListSection title={t("pages.npExamContentHub.patientCounseling2")} icon={<Heart className="w-5 h-5 text-primary" />} items={page.patientCounseling} itemIcon="file" />

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-board-exam-tips">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.npBoardExamTips")}</h2>
            </div>
            <ul className="space-y-2">
              {page.boardExamTips.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
          </section>

          <NpCTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.practiceQuestions3")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <NpPracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.frequentlyAskedQuestions3")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <NpFAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <NpInternalLinksSection links={page.internalLinks} />
          <NpReferencesSection references={page.references} />
          <NpMedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <NpCTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NpExamLabValueTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNpExamLabValueBySlug(params.slug || "");

  if (!page) return <NpNotFound type="Lab Value" backHref="/np-exam/lab-values" backLabel="Back to Lab Values" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/np-exam/lab-values/${page.slug}`,
    about: { "@type": "MedicalTest", name: page.fullName },
    audience: { "@type": "MedicalAudience", audienceType: "Nurse Practitioners" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/np-exam/lab-values/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildNpFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: page.name, url: `https://www.nursenest.ca/np-exam/lab-values/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <NpBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "NP Exam Prep", href: "/np-exam-prep" }, { label: `${page.name}` }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="lab-value-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.npExamContentHub.npLabReference")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-lab-value-title">{page.fullName} — NP Board Exam Guide</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.orderingRationale}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <NpCTABanner variant="default" />

          {page.components.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-components">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.componentsNormalRanges")}</h2>
              </div>
              <div className="space-y-3">
                {page.components.map((comp, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4 flex items-center justify-between" data-testid={`component-${i}`}>
                    <span className="font-semibold text-gray-900 text-sm">{comp.name}</span>
                    <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded text-gray-700">{comp.normalRange} {comp.unit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {page.interpretation.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid="section-interpretation">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.npExamContentHub.clinicalInterpretation")}</h2>
              <div className="space-y-4">
                {page.interpretation.map((item, i) => (
                  <div key={i} className="border-l-4 border-primary/30 pl-4 py-2" data-testid={`interpretation-${i}`}>
                    <p className="font-semibold text-gray-900 text-sm">{item.finding}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.significance}</p>
                    <p className="text-sm text-primary font-medium mt-1">Action: {item.action}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <NpListSection title={t("pages.npExamContentHub.whenToRepeat")} icon={<ClipboardList className="w-5 h-5 text-primary" />} items={page.whenToRepeat} />

          <NpListSection title={t("pages.npExamContentHub.associatedDifferentials")} icon={<Stethoscope className="w-5 h-5 text-primary" />} items={page.associatedDifferentials} itemIcon="arrow" />

          <NpListSection title={t("pages.npExamContentHub.managementImplications")} icon={<Heart className="w-5 h-5 text-primary" />} items={page.managementImplications} />

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-board-exam-pearls">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.npBoardExamPearls2")}</h2>
            </div>
            <ul className="space-y-2">
              {page.boardExamPearls.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
          </section>

          <NpCTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.practiceQuestions4")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <NpPracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.frequentlyAskedQuestions4")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <NpFAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <NpInternalLinksSection links={page.internalLinks} />
          <NpReferencesSection references={page.references} />
          <NpMedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <NpCTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NpExamComparisonTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNpExamComparisonBySlug(params.slug || "");

  if (!page) return <NpNotFound type="Comparison" backHref="/np-exam-prep" backLabel="Back to NP Exam Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/np-exam/compare/${page.slug}`,
    audience: { "@type": "MedicalAudience", audienceType: "Nurse Practitioners" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/np-exam/compare/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildNpFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: page.h1, url: `https://www.nursenest.ca/np-exam/compare/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <NpBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "NP Exam Prep", href: "/np-exam-prep" }, { label: page.h1 }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="comparison-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Scale className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.npExamContentHub.npClinicalComparison")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-comparison-title">{page.h1}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.introText}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <NpCTABanner variant="default" />

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" data-testid="section-comparison-table">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-1/4">{t("pages.npExamContentHub.feature")}</th>
                    <th className="text-left px-4 py-3 font-semibold text-blue-700 w-[37.5%]">{page.entityA.name}</th>
                    <th className="text-left px-4 py-3 font-semibold text-purple-700 w-[37.5%]">{page.entityB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonCategories.map((cat, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`} data-testid={`comparison-row-${i}`}>
                      <td className="px-4 py-3 font-medium text-gray-800">{cat}</td>
                      <td className="px-4 py-3 text-gray-600">{page.entityA.features[cat] || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{page.entityB.features[cat] || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <NpListSection title={t("pages.npExamContentHub.diagnosticDifferences")} icon={<FlaskConical className="w-5 h-5 text-primary" />} items={page.diagnosticDifferences} itemIcon="arrow" />

          <NpListSection title={t("pages.npExamContentHub.managementDifferences")} icon={<ClipboardList className="w-5 h-5 text-primary" />} items={page.managementDifferences} itemIcon="arrow" />

          <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 md:p-8" data-testid="section-clinical-pearls">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.clinicalPearls")}</h2>
            </div>
            <ul className="space-y-2">
              {page.clinicalPearls.map((item, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">★</span>{item}</li>)}
            </ul>
          </section>

          <NpCTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.practiceQuestions5")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <NpPracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.frequentlyAskedQuestions5")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <NpFAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <NpInternalLinksSection links={page.internalLinks} />
          <NpReferencesSection references={page.references} />
          <NpMedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <NpCTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NpExamStrategyTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNpExamStrategyBySlug(params.slug || "");

  if (!page) return <NpNotFound type="Strategy" backHref="/np-exam-prep" backLabel="Back to NP Exam Hub" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/np-exam/strategy/${page.slug}`,
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    dateModified: page.lastReviewed,
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/np-exam/strategy/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildNpFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: page.h1, url: `https://www.nursenest.ca/np-exam/strategy/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <NpBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "NP Exam Prep", href: "/np-exam-prep" }, { label: page.h1 }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="strategy-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.npExamContentHub.npExamStrategy")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-strategy-title">{page.h1}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.introText}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <NpCTABanner variant="default" />

          {page.sections.map((section, i) => (
            <section key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>
              {section.tips && section.tips.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">{t("pages.npExamContentHub.keyTips")}</h3>
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

          <NpCTABanner variant="mid" />

          {page.practiceQuestions.length > 0 && (
            <section data-testid="section-practice-questions">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.practiceQuestions6")}</h2>
              </div>
              <div className="space-y-4">
                {page.practiceQuestions.map((q, i) => <NpPracticeQuestionBlock key={i} question={q} index={i} />)}
              </div>
            </section>
          )}

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.frequentlyAskedQuestions6")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <NpFAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <NpInternalLinksSection links={page.internalLinks} />
          <NpReferencesSection references={page.references} />
          <NpMedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <NpCTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

export function NpExamCaseStudyTemplate() {
  const params = useParams<{ slug: string }>();
  const page = getNpExamCaseStudyBySlug(params.slug || "");

  if (!page) return <NpNotFound type="Case Study" backHref="/np-exam/case-studies" backLabel="Back to Case Studies" />;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.nursenest.ca/np-exam/case-studies/${page.slug}`,
    audience: { "@type": "MedicalAudience", audienceType: "Nurse Practitioners" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/np-exam/case-studies/${page.slug}`}
        ogType="article"
        structuredData={structuredData}
        additionalStructuredData={[buildNpFaqStructuredData(page.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: "Case Studies", url: "https://www.nursenest.ca/np-exam/case-studies" },
          { name: page.h1, url: `https://www.nursenest.ca/np-exam/case-studies/${page.slug}` },
        ]}
      />
      <div className="min-h-screen bg-gray-50">
        <NpBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "NP Exam Prep", href: "/np-exam-prep" }, { label: "Case Studies", href: "/np-exam/case-studies" }, { label: page.h1 }]} />

        <header className="bg-gradient-to-br from-[#2E3A59] to-[#3d4f7a] text-white py-12 px-4" data-testid="case-study-hero">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <span className="text-[#BFA6F6] text-sm font-semibold uppercase tracking-wider">{t("pages.npExamContentHub.npCaseStudy")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-case-study-title">{page.h1}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{page.introText}</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <NpCTABanner variant="default" />

          {page.scenarios.map((scenario, i) => (
            <CaseScenarioBlock key={i} scenario={scenario} index={i} />
          ))}

          {page.premiumTeasers.length > 0 && (
            <section className="bg-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8" data-testid="section-premium-teasers">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.moreCaseStudiesAvailable")}</h2>
              </div>
              <ul className="space-y-2 mb-4">
                {page.premiumTeasers.map((teaser, i) => (
                  <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                    {teaser}
                  </li>
                ))}
              </ul>
              <LocaleLink href="/pricing">
                <Button className="bg-primary hover:bg-primary/90" data-testid="button-unlock-cases">
                  Unlock All Case Studies <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
            </section>
          )}

          <NpCTABanner variant="mid" />

          {page.faqs.length > 0 && (
            <section data-testid="section-faqs">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">{t("pages.npExamContentHub.frequentlyAskedQuestions7")}</h2>
              </div>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => <NpFAQBlock key={i} faq={faq} index={i} />)}
              </div>
            </section>
          )}

          <NpInternalLinksSection links={page.internalLinks} />
          <NpMedicallyReviewedBadge reviewer={page.reviewer} date={page.lastReviewed} />
          <NpCTABanner variant="end" />
        </div>
      </div>
    </>
  );
}

function CaseScenarioBlock({ scenario, index }: { scenario: { title: string; presentation: string; question: string; options: string[]; correctIndex: number; rationale: string; isFree: boolean }; index: number }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  if (!scenario.isFree) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8 relative overflow-hidden" data-testid={`case-scenario-locked-${index}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-gray-50 z-10" />
        <h3 className="text-lg font-bold text-gray-400 mb-2 blur-[2px]">{scenario.title}</h3>
        <p className="text-sm text-gray-400 blur-[2px]">{scenario.presentation.substring(0, 100)}...</p>
        <div className="relative z-20 flex flex-col items-center justify-center py-6">
          <Lock className="w-8 h-8 text-gray-400 mb-3" />
          <p className="text-gray-600 font-semibold text-sm mb-2">{t("pages.npExamContentHub.premiumCaseStudy")}</p>
          <LocaleLink href="/pricing">
            <Button size="sm" className="bg-primary hover:bg-primary/90" data-testid={`button-unlock-case-${index}`}>
              Unlock <ArrowRight className="w-4 h-4 ml-1" />
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

  const isCorrect = selectedIndex === scenario.correctIndex;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" data-testid={`case-scenario-${index}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{scenario.title}</h3>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">{scenario.presentation}</p>
      </div>
      <p className="font-semibold text-gray-900 mb-4 text-sm">{scenario.question}</p>
      <div className="space-y-2">
        {scenario.options.map((option, optIdx) => {
          let optionClass = "border border-gray-200 rounded-lg p-3 text-sm cursor-pointer transition-all hover:border-primary/40 hover:bg-primary/5";
          if (selectedIndex !== null) {
            if (optIdx === scenario.correctIndex) {
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
              data-testid={`case-${index}-option-${optIdx}`}
            >
              <span className="font-semibold text-gray-500 mt-0.5 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
              <span className="text-gray-700">{option}</span>
              {selectedIndex !== null && optIdx === scenario.correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 ml-auto" />}
              {selectedIndex !== null && optIdx === selectedIndex && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 ml-auto" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className={`mt-4 p-4 rounded-lg text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`} data-testid={`case-rationale-${index}`}>
          <p className="font-semibold mb-1 text-gray-900">{isCorrect ? "Correct!" : "Incorrect"} — Rationale:</p>
          <p className="text-gray-700">{scenario.rationale}</p>
        </div>
      )}
    </div>
  );
}
