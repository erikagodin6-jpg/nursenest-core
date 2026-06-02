import { useState } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { AutoRelatedContent, YouMayAlsoLike } from "@/components/auto-related-content";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { seoMedications } from "@/data/seo-medications";
import { useI18n } from "@/lib/i18n";
import {
  Pill,
  Beaker,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
  FileText,
} from "lucide-react";

const SEVERITY_COLORS: Record<string, string> = {
  "Common": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Common (long-term)": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Serious": "bg-orange-100 text-orange-800 border-orange-200",
  "Life-threatening": "bg-red-100 text-red-800 border-red-200",
};

export default function MedicationPage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showRationale, setShowRationale] = useState<Record<number, boolean>>({});

  const med = seoMedications.find((m) => m.slug === params.slug);

  if (!med) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="medication-not-found">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.medicationPage.medicationNotFound")}</h1>
            <p className="text-gray-600 mb-4">{t("pages.medicationPage.theMedicationPageYouAre")}</p>
            <Button onClick={() => navigate("/medications")} data-testid="button-back-medications">
              Browse All Medications
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    setShowRationale((prev) => ({ ...prev, [qIndex]: true }));
  };

  const drugStructuredData = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: med.genericName,
    alternateName: med.brandNames,
    drugClass: med.drugClass,
    mechanismOfAction: med.mechanism,
    administrationRoute: "oral",
    description: med.metaDescription,
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${med.genericName} used for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: med.indications.join(", "),
        },
      },
      {
        "@type": "Question",
        name: `What are the side effects of ${med.genericName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: med.sideEffects.map((s) => `${s.effect} (${s.severity})`).join(", "),
        },
      },
      {
        "@type": "Question",
        name: `What are the nursing considerations for ${med.genericName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: med.nursingConsiderations.join(" "),
        },
      },
    ],
  };

  return (
    <>
      <SEO
        title={med.metaTitle}
        description={med.metaDescription}
        keywords={med.targetKeywords.join(", ")}
        canonicalPath={`/medications/${med.slug}`}
        ogType="article"
        structuredData={drugStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Medications", url: "https://www.nursenest.ca/medications" },
          { name: med.genericName, url: `https://www.nursenest.ca/medications/${med.slug}` },
        ]}
      />
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-[#2E3A59] to-[#1a2340] text-white py-16 lg:py-20" data-testid="medication-hero">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="breadcrumb-medication">
              <button onClick={() => navigate("/")} className="hover:text-white/80 transition-colors">{t("pages.medicationPage.home")}</button>
              <span>/</span>
              <button onClick={() => navigate("/pharmacology")} className="hover:text-white/80 transition-colors">{t("pages.medicationPage.pharmacology")}</button>
              <span>/</span>
              <span className="text-white/90">{med.genericName}</span>
            </nav>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#BFA6F6]/20 flex items-center justify-center shrink-0">
                <Pill className="w-7 h-7 text-[#BFA6F6]" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight" data-testid="text-medication-name">
                  {med.genericName}
                </h1>
                <p className="text-white/70 text-lg mt-1" data-testid="text-brand-names">
                  {med.brandNames.join(", ")}
                </p>
              </div>
            </div>

            <Badge className="bg-[#BFA6F6]/20 text-[#BFA6F6] border-[#BFA6F6]/30 text-sm px-3 py-1" data-testid="badge-drug-class">
              {med.drugClass}
            </Badge>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
          <section data-testid="section-mechanism">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <Beaker className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.medicationPage.mechanismOfAction")}</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed" data-testid="text-mechanism">
                  {med.mechanism}
                </p>
              </CardContent>
            </Card>
          </section>

          <section data-testid="section-indications">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.medicationPage.indications")}</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {med.indications.map((ind, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-indication-${i}`}>
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <span className="text-gray-700">{ind}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section data-testid="section-side-effects">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.medicationPage.sideEffects")}</h2>
            </div>
            <div className="space-y-3">
              {med.sideEffects.map((se, i) => (
                <Card key={i} data-testid={`card-side-effect-${i}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900">{se.effect}</h3>
                      <Badge className={`shrink-0 text-xs border ${SEVERITY_COLORS[se.severity] || "bg-gray-100 text-gray-700"}`}>
                        {se.severity}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{se.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section data-testid="section-contraindications">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.medicationPage.contraindications")}</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {med.contraindications.map((c, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-contraindication-${i}`}>
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span className="text-gray-700">{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section data-testid="section-nursing-considerations">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.medicationPage.nursingConsiderations")}</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {med.nursingConsiderations.map((nc, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-nursing-consideration-${i}`}>
                      <Stethoscope className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{nc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section data-testid="section-exam-tips">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.medicationPage.examTips")}</h2>
            </div>
            <Card className="border-[#BFA6F6]/20 bg-[#BFA6F6]/5">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {med.examTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-exam-tip-${i}`}>
                      <Target className="w-4 h-4 text-[#BFA6F6] mt-1 shrink-0" />
                      <span className="text-gray-800 leading-relaxed font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section data-testid="section-practice-questions">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.medicationPage.practiceQuestions")}</h2>
            </div>
            <div className="space-y-4">
              {med.practiceQuestions.map((pq, qIndex) => (
                <Card key={qIndex} data-testid={`card-practice-question-${qIndex}`}>
                  <CardContent className="p-6">
                    <p className="font-semibold text-gray-900 mb-4" data-testid={`text-question-${qIndex}`}>
                      {qIndex + 1}. {pq.question}
                    </p>
                    <div className="space-y-2 mb-4">
                      {pq.options.map((opt, oIndex) => {
                        const isSelected = selectedAnswers[qIndex] === oIndex;
                        const isCorrect = oIndex === pq.correctIndex;
                        const isRevealed = showRationale[qIndex];

                        let optionClasses = "border rounded-lg p-3 cursor-pointer transition-colors text-sm ";
                        if (isRevealed && isCorrect) {
                          optionClasses += "border-green-500 bg-green-50 text-green-800";
                        } else if (isRevealed && isSelected && !isCorrect) {
                          optionClasses += "border-red-500 bg-red-50 text-red-800";
                        } else if (isSelected) {
                          optionClasses += "border-[#BFA6F6] bg-[#BFA6F6]/10";
                        } else {
                          optionClasses += "border-gray-200 hover:border-[#BFA6F6]/50 hover:bg-gray-50";
                        }

                        return (
                          <button
                            key={oIndex}
                            className={`${optionClasses} w-full text-left flex items-start gap-3`}
                            onClick={() => handleAnswer(qIndex, oIndex)}
                            disabled={!!showRationale[qIndex]}
                            data-testid={`button-option-${qIndex}-${oIndex}`}
                          >
                            <span className="font-medium shrink-0 mt-0.5">
                              {String.fromCharCode(65 + oIndex)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                    {showRationale[qIndex] && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid={`text-rationale-${qIndex}`}>
                        <p className="font-semibold text-blue-900 text-sm mb-1">{t("pages.medicationPage.rationale")}</p>
                        <p className="text-blue-800 text-sm leading-relaxed">{pq.rationale}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-[#2E3A59] to-[#3d4f7a] rounded-2xl p-8 text-white text-center" data-testid="section-cta">
            <h2 className="text-2xl font-bold mb-3">{t("pages.medicationPage.masterPharmacologyForYourNursing")}</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Access hundreds of medication reviews, practice questions, and clinical simulations designed to help you pass your nursing exam with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-[#BFA6F6] hover:bg-[#a88de8] text-white px-6"
                onClick={() => navigate("/pricing")}
                data-testid="button-cta-pricing"
              >
                View Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-6"
                onClick={() => navigate("/medication-mastery")}
                data-testid="button-cta-medications"
              >
                Browse All Medications
              </Button>
            </div>
          </section>

          <section data-testid="section-related-links">
            <h3 className="text-lg font-semibold text-[#2E3A59] mb-3">{t("pages.medicationPage.relatedResources")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seoMedications
                .filter((m) => m.slug !== med.slug)
                .slice(0, 4)
                .map((related) => (
                  <button
                    key={related.slug}
                    onClick={() => navigate(`/medications/${related.slug}`)}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all text-left"
                    data-testid={`link-related-${related.slug}`}
                  >
                    <Pill className="w-5 h-5 text-[#BFA6F6] shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{related.genericName}</p>
                      <p className="text-xs text-gray-500">{related.drugClass}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
                  </button>
                ))}
            </div>
          </section>

          <AutoRelatedContent slug={med.slug} contentType="medication" title={med.genericName} category={med.drugClass} />
          <YouMayAlsoLike slug={med.slug} contentType="medication" title={med.genericName} category={med.drugClass} />
        </div>
      </main>

      <Footer />
    </>
  );
}
