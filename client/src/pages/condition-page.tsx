import { useState } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/seo";
import { AutoRelatedContent, YouMayAlsoLike } from "@/components/auto-related-content";
import { getConditionBySlug, getAllConditionSlugs, type ConditionPageData } from "@/data/seo-conditions";
import { getCrossProfessionByConditionSlug } from "@/data/cross-profession-conditions";
import { LocaleLink } from "@/lib/LocaleLink";
import { slugToDisplayName } from "@/lib/canonical-display";
import { useI18n } from "@/lib/i18n";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Stethoscope,
  Activity,
  AlertTriangle,
  BookOpen,
  Pill,
  ClipboardList,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  FileText,
  Users,
  GraduationCap,
} from "lucide-react";

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

function PracticeQuestion({ q, index }: { q: { question: string; options: string[]; correct: number; rationale: string }; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowRationale(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid={`practice-question-${index}`}>
      <p className="font-semibold text-gray-900 mb-4">{index + 1}. {q.question}</p>
      <div className="space-y-2 mb-4">
        {q.options.map((option, i) => {
          let optionStyle = "border-gray-200 hover:border-[#BFA6F6] hover:bg-[#BFA6F6]/5 cursor-pointer";
          if (selected !== null) {
            if (i === q.correct) {
              optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
            } else if (i === selected && i !== q.correct) {
              optionStyle = "border-red-400 bg-red-50 text-red-900";
            } else {
              optionStyle = "border-gray-200 opacity-60";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${optionStyle}`}
              disabled={selected !== null}
              data-testid={`question-${index}-option-${i}`}
            >
              <span className="w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{option}</span>
              {selected !== null && i === q.correct && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
              {selected !== null && i === selected && i !== q.correct && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className="bg-[#BFA6F6]/10 border border-[#BFA6F6]/20 rounded-lg p-4 mt-3" data-testid={`question-${index}-rationale`}>
          <p className="text-sm font-semibold text-[#2E3A59] mb-1">{t("pages.conditionPage.rationale")}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{q.rationale}</p>
        </div>
      )}
    </div>
  );
}

function ConditionNotFound() {
  const allSlugs = getAllConditionSlugs();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-bold text-[#2E3A59] mb-4" data-testid="text-condition-not-found">{t("pages.conditionPage.conditionNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("pages.conditionPage.theConditionYouAreLooking")}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {allSlugs.map(slug => (
            <LocaleLink key={slug} href={`/conditions/${slug}`} className="text-[#BFA6F6] hover:underline capitalize" data-testid={`link-condition-${slug}`}>
              {slug.replace(/-/g, " ")}
            </LocaleLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConditionPage() {
  const params = useParams<{ slug: string }>();
  const condition = getConditionBySlug(params.slug || "");

  if (!condition) {
    return <ConditionNotFound />;
  }

  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: condition.name,
    description: condition.overview,
    associatedAnatomy: {
      "@type": "AnatomicalSystem",
      name: condition.bodySystem,
    },
    code: {
      "@type": "MedicalCode",
      codeValue: condition.icdCode,
      codingSystem: "ICD-10",
    },
    riskFactor: condition.riskFactors.map(rf => ({
      "@type": "MedicalRiskFactor",
      name: rf,
    })),
    signOrSymptom: [
      ...condition.clinicalPresentation.earlySignsSymptoms,
      ...condition.clinicalPresentation.lateSignsSymptoms,
    ].map(s => ({
      "@type": "MedicalSignOrSymptom",
      name: s,
    })),
    drug: condition.medications.map(m => ({
      "@type": "Drug",
      name: m.name,
      drugClass: { "@type": "DrugClass", name: m.drugClass },
      mechanismOfAction: m.mechanism,
    })),
    possibleTreatment: condition.medications.map(m => ({
      "@type": "MedicalTherapy",
      name: m.name,
      drug: { "@type": "Drug", name: m.name },
    })),
    typicalTest: condition.diagnostics.map(d => ({
      "@type": "MedicalTest",
      name: d,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: condition.faq.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title={condition.title}
        description={condition.metaDescription}
        keywords={condition.keywords}
        canonicalPath={`/conditions/${condition.slug}`}
        structuredData={medicalConditionSchema}
        additionalStructuredData={[faqSchema]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Lessons", url: "https://www.nursenest.ca/lessons" },
          { name: condition.name, url: `https://www.nursenest.ca/conditions/${condition.slug}` },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-b from-[#2E3A59] to-[#3d4d73] text-white py-16 md:py-20" data-testid="condition-hero">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="condition-breadcrumb">
              <LocaleLink href="/" className="hover:text-white/80">{t("pages.conditionPage.home")}</LocaleLink>
              <ChevronRight className="w-3 h-3" />
              <LocaleLink href="/lessons" className="hover:text-white/80">{t("pages.conditionPage.lessons")}</LocaleLink>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/90">{condition.name}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#BFA6F6]/20 text-[#BFA6F6] rounded-full text-xs font-semibold uppercase tracking-wider" data-testid="text-body-system">
                {condition.bodySystem}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-mono" data-testid="text-icd-code">
                ICD-10: {condition.icdCode}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-condition-title">
              {condition.name}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl" data-testid="text-condition-subtitle">
              Complete study guide with pathophysiology, clinical presentation, diagnostics, medications, and cross-profession perspectives from nursing, paramedic, respiratory therapy, and laboratory science.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
          <section data-testid="section-overview">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.overview")}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed" data-testid="text-overview">{condition.overview}</p>
          </section>

          <section data-testid="section-pathophysiology">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.pathophysiology")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed" data-testid="text-pathophysiology">{condition.pathophysiology}</p>
            </div>
          </section>

          <section data-testid="section-clinical-presentation">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.clinicalPresentation")}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Early Signs and Symptoms
                </h3>
                <ul className="space-y-2">
                  {condition.clinicalPresentation.earlySignsSymptoms.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2" data-testid={`text-early-sign-${i}`}>
                      <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Late / Emergent Signs
                </h3>
                <ul className="space-y-2">
                  {condition.clinicalPresentation.lateSignsSymptoms.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2" data-testid={`text-late-sign-${i}`}>
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section data-testid="section-risk-factors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.riskFactors")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid sm:grid-cols-2 gap-2">
                {condition.riskFactors.map((rf, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700" data-testid={`text-risk-factor-${i}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2"></span>
                    {rf}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section data-testid="section-diagnostics">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.diagnostics")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <ul className="space-y-2">
                {condition.diagnostics.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`text-diagnostic-${i}`}>
                    <ClipboardList className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section data-testid="section-medications">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Pill className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.medications")}</h2>
            </div>
            <div className="space-y-4">
              {condition.medications.map((med, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6" data-testid={`card-medication-${i}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-[#2E3A59]" data-testid={`text-med-name-${i}`}>{med.name}</h3>
                    <span className="px-2 py-0.5 bg-[#BFA6F6]/10 text-[#BFA6F6] rounded text-xs font-medium">{med.drugClass}</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-500 text-xs uppercase mb-1">{t("pages.conditionPage.mechanism")}</p>
                      <p className="text-gray-700">{med.mechanism}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 text-xs uppercase mb-1">{t("pages.conditionPage.sideEffects")}</p>
                      <p className="text-gray-700">{med.sideEffects}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 text-xs uppercase mb-1">{t("pages.conditionPage.nursingConsiderations")}</p>
                      <p className="text-gray-700">{med.nursingConsiderations}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section data-testid="section-nursing-interventions">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.nursingInterventions")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <ol className="space-y-3">
                {condition.nursingInterventions.map((ni, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`text-intervention-${i}`}>
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {ni}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {(() => {
            const crossProfession = getCrossProfessionByConditionSlug(condition.slug);
            if (!crossProfession || crossProfession.perspectives.length === 0) return null;
            const professionColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
              rn: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-500" },
              paramedic: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-500" },
              rrt: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", icon: "text-teal-500" },
              mlt: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "text-purple-500" },
            };
            return (
              <section data-testid="section-cross-profession">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.crossprofessionPerspectives")}</h2>
                    <p className="text-sm text-gray-500">How different healthcare professionals approach {condition.name}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {crossProfession.perspectives.map((perspective, pIdx) => {
                    const colors = professionColors[perspective.professionSlug] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "text-gray-500" };
                    return (
                      <div key={pIdx} className={`bg-white border ${colors.border} rounded-xl overflow-hidden`} data-testid={`card-profession-${perspective.professionSlug}`}>
                        <div className={`${colors.bg} px-6 py-4 border-b ${colors.border}`}>
                          <h2 className={`text-lg font-bold ${colors.text} flex items-center gap-2`}>
                            <GraduationCap className={`w-5 h-5 ${colors.icon}`} />
                            {perspective.profession} Perspective
                          </h2>
                        </div>
                        <div className="p-6 space-y-4">
                          <p className="text-gray-700 leading-relaxed text-sm" data-testid={`text-perspective-${perspective.professionSlug}`}>{perspective.approach}</p>

                          {perspective.lessonSlugs.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                                Related Lessons
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {perspective.lessonSlugs.map((slug) => (
                                  <LocaleLink
                                    key={slug}
                                    href={`/lessons/${slug}`}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${colors.bg} ${colors.text} text-xs font-medium hover:opacity-80 transition-opacity`}
                                    data-testid={`link-profession-lesson-${perspective.professionSlug}-${slug}`}
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                    {slugToDisplayName(slug)}
                                  </LocaleLink>
                                ))}
                              </div>
                            </div>
                          )}

                          {perspective.practiceQuestionTopics.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                                <ClipboardList className="w-4 h-4 text-gray-400" />
                                Practice Question Topics
                              </h3>
                              <div className="flex flex-wrap gap-1.5">
                                {perspective.practiceQuestionTopics.map((topic, tIdx) => (
                                  <span key={tIdx} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs" data-testid={`tag-question-topic-${perspective.professionSlug}-${tIdx}`}>
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {perspective.flashcardTopics.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Flashcard Topics
                              </h3>
                              <div className="flex flex-wrap gap-1.5">
                                {perspective.flashcardTopics.map((topic, tIdx) => (
                                  <span key={tIdx} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs" data-testid={`tag-flashcard-topic-${perspective.professionSlug}-${tIdx}`}>
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          <section data-testid="section-practice-questions">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.practiceQuestions")}</h2>
            </div>
            <div className="space-y-4">
              {condition.practiceQuestions.map((q, i) => (
                <PracticeQuestion key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-[#BFA6F6]/10 to-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-2xl p-8 text-center" data-testid="section-cta">
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-3">Ready to Master {condition.name}?</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Access hundreds of practice questions, detailed lessons, and interactive study tools on NurseNest.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <LocaleLink
                href="/mock-exams"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#BFA6F6] text-white rounded-lg font-semibold hover:bg-[#a88de8] transition-colors"
                data-testid="link-start-exam"
              >
                Take a Practice Exam
                <ArrowRight className="w-4 h-4" />
              </LocaleLink>
              <LocaleLink
                href="/lessons"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2E3A59] border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                data-testid="link-browse-lessons"
              >
                Browse All Lessons
              </LocaleLink>
            </div>
          </section>

          <section data-testid="section-faq">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-sky-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.conditionPage.frequentlyAskedQuestions")}</h2>
            </div>
            <div className="space-y-3">
              {condition.faq.map((f, i) => (
                <FAQItem key={i} question={f.question} answer={f.answer} index={i} />
              ))}
            </div>
          </section>

          {condition.relatedConditions.length > 0 && (
            <section data-testid="section-related-conditions">
              <h2 className="text-2xl font-bold text-[#2E3A59] mb-4">{t("pages.conditionPage.relatedConditionGuides")}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {condition.relatedConditions.map(slug => {
                  const related = getConditionBySlug(slug);
                  if (!related) return null;
                  return (
                    <LocaleLink
                      key={slug}
                      href={`/conditions/${slug}`}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group"
                      data-testid={`link-related-${slug}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{related.name}</p>
                          <p className="text-xs text-gray-500">{related.bodySystem}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                      </div>
                    </LocaleLink>
                  );
                })}
              </div>
            </section>
          )}

          <AutoRelatedContent slug={condition.slug} contentType="condition" title={condition.name} bodySystem={condition.bodySystem} category={condition.bodySystem} />
          <YouMayAlsoLike slug={condition.slug} contentType="condition" title={condition.name} bodySystem={condition.bodySystem} category={condition.bodySystem} />
        </div>
      </div>
    </>
  );
}
