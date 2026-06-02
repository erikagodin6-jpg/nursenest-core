import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { useState } from "react";
import {
  BookOpen, ArrowRight, HelpCircle, Brain,
  Heart, Beaker, Activity, ChevronDown,
  Stethoscope, Zap, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
const PHYSIOLOGY_TOPICS = [
  {
    slug: "why-burns-cause-hyperkalemia",
    title: "Why Burns Cause Hyperkalemia",
    description: "Understand how massive cellular destruction in burn injuries releases intracellular potassium, creating life-threatening electrolyte emergencies.",
    category: "Electrolytes & Burns",
    color: "#EA580C",
    icon: Zap,
  },
  {
    slug: "potassium-effects-on-cardiac-conduction",
    title: "Potassium Effects on Cardiac Conduction",
    description: "Learn how potassium governs every phase of the cardiac action potential and the ECG changes at each potassium level.",
    category: "Electrolytes & Cardiac",
    color: "#DC2626",
    icon: Heart,
  },
  {
    slug: "metabolic-acidosis-in-aki",
    title: "Metabolic Acidosis in Acute Kidney Injury",
    description: "Explore the pathophysiology of renal metabolic acidosis, ABG interpretation, and nursing management of acid-base imbalance in AKI.",
    category: "Renal & Acid-Base",
    color: "#7C3AED",
    icon: Beaker,
  },
  {
    slug: "pyloric-stenosis-metabolic-alkalosis",
    title: "Pyloric Stenosis & Metabolic Alkalosis",
    description: "Discover why pyloric stenosis causes the classic hypochloremic, hypokalemic metabolic alkalosis and how to manage it before surgery.",
    category: "Pediatric & Acid-Base",
    color: "#0891B2",
    icon: Activity,
  },
  {
    slug: "qrs-complex-explained-for-nurses",
    title: "QRS Complex Explained for Nurses",
    description: "Master QRS morphology, normal duration, bundle branch blocks, and the clinical significance of QRS abnormalities.",
    category: "Cardiac & ECG",
    color: "#E11D48",
    icon: Activity,
  },
  {
    slug: "hyperkalemia-effects-on-heart",
    title: "Hyperkalemia Effects on the Heart",
    description: "Learn the progressive ECG changes of hyperkalemia and rapid nursing interventions to prevent cardiac arrest.",
    category: "Electrolytes & Cardiac",
    color: "#DC2626",
    icon: Heart,
  },
  {
    slug: "hyperkalemia-vs-hypokalemia-cardiac",
    title: "Hyperkalemia vs Hypokalemia Cardiac Effects",
    description: "Side-by-side comparison of how high and low potassium produce opposite but equally dangerous cardiac dysrhythmias.",
    category: "Electrolytes & Cardiac",
    color: "#7C3AED",
    icon: Heart,
  },
  {
    slug: "barrel-chest-copd",
    title: "Barrel Chest in COPD",
    description: "Understand how chronic air trapping in emphysema causes barrel chest and its implications for respiratory nursing assessment.",
    category: "Respiratory",
    color: "#0891B2",
    icon: Stethoscope,
  },
];

const HUB_FAQS = [
  { question: "What is nursing physiology and why is it important?", answer: "Nursing physiology is the study of how the body's organ systems function in health and disease, applied specifically to nursing practice. Understanding physiology allows nurses to anticipate patient responses, recognize early warning signs, interpret lab values, and make evidence-based clinical decisions. It forms the scientific foundation for all nursing interventions." },
  { question: "Which physiology topics are most tested on the NCLEX?", answer: "The most heavily tested physiology topics include: electrolyte imbalances (especially potassium and their cardiac effects), acid-base balance (metabolic acidosis and alkalosis), cardiac conduction and ECG interpretation, fluid balance and shifts, respiratory physiology (including COPD and gas exchange), and renal function. These topics appear across multiple NCLEX content areas." },
  { question: "How should I study physiology for nursing exams?", answer: "Focus on understanding mechanisms rather than memorizing facts. Connect pathophysiology to clinical signs, lab values, and nursing interventions. Use case-based learning to apply concepts to patient scenarios. Practice with NCLEX-style questions that require you to predict patient responses based on physiological principles. Review ABG interpretation, electrolyte imbalances, and cardiac rhythms frequently." },
  { question: "What is the connection between electrolytes and cardiac function?", answer: "Electrolytes — particularly potassium, calcium, magnesium, and sodium — directly control the cardiac action potential, which governs heart rhythm and contractility. Potassium determines the resting membrane potential, calcium drives muscle contraction, and magnesium is a cofactor for the Na+/K+-ATPase pump. Imbalances in any of these electrolytes can produce life-threatening dysrhythmias." },
  { question: "How do acid-base imbalances affect nursing care?", answer: "Acid-base imbalances affect virtually every organ system and medication response. Acidosis depresses cardiac function, shifts potassium extracellularly (hyperkalemia risk), and reduces drug effectiveness. Alkalosis causes potassium to shift intracellularly (hypokalemia risk), increases neuromuscular excitability, and shifts the oxygen-hemoglobin dissociation curve. Nurses must interpret ABGs, identify the imbalance type, and implement appropriate interventions." },
];

const breadcrumbItems = [
  { name: "Home", url: "https://www.nursenest.ca" },
  { name: "Topics", url: "https://www.nursenest.ca/topics" },
  { name: "Nursing Physiology Explained", url: "https://www.nursenest.ca/nursing-physiology-explained" },
];

export default function NursingPhysiologyHubPage() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqStructuredData = buildFaqStructuredData(HUB_FAQS);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Nursing Physiology Explained",
    "description": "Comprehensive nursing physiology hub covering electrolytes, acid-base balance, cardiac conduction, and respiratory physiology with clinical applications and exam prep.",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.nursenest.ca/nursing-physiology-explained",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-nursing-physiology-hub">
      <Navigation />
      <SEO
        title={t("pages.nursingPhysiologyHubPage.nursingPhysiologyExplainedClinicalPathophysi")}
        description={t("pages.nursingPhysiologyHubPage.comprehensiveNursingPhysiologyHubCovering")}
        keywords="nursing physiology, pathophysiology nursing, electrolyte imbalance nursing, acid-base balance, cardiac conduction nursing, NCLEX physiology"
        canonicalPath="/nursing-physiology-explained"
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #EDE9FE60, white, #DBEAFE30)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white bg-violet-600" data-testid="badge-hub-category">
              <Brain className="w-3 h-3 mr-1" /> Physiology Hub
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-hub-title">
              Nursing Physiology Explained
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-hub-description">
              Master the physiological concepts that underpin clinical nursing practice. From electrolyte imbalances and cardiac conduction to acid-base disorders and respiratory physiology — each topic is explained with clinical significance, nursing interventions, and exam-ready content.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-12" data-testid="section-topics">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3" data-testid="heading-topics">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-violet-50">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            Physiology Topics
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {PHYSIOLOGY_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <LocaleLink key={topic.slug} href={`/${topic.slug}`}>
                  <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`card-topic-${topic.slug}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${topic.color}15` }}>
                          <Icon className="w-4 h-4" style={{ color: topic.color }} />
                        </div>
                        <Badge variant="outline" className="text-[10px]">{topic.category}</Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{topic.description}</p>
                      <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        Read More <ArrowRight className="w-3 h-3" />
                      </span>
                    </CardContent>
                  </Card>
                </LocaleLink>
              );
            })}
          </div>
        </section>

        <div className="my-8 rounded-xl p-6 text-center bg-violet-50 border-l-4 border-violet-600" data-testid="cta-practice">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.nursingPhysiologyHubPage.testYourPhysiologyKnowledge")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("pages.nursingPhysiologyHubPage.practiceWithExamstyleQuestionsCovering")}</p>
          <LocaleLink href="/practice-questions">
            <Button className="text-white bg-violet-600 hover:bg-violet-700" data-testid="button-cta-practice">
              Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </LocaleLink>
        </div>

        <section className="mb-12" data-testid="section-why-physiology">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            Why Physiology Matters in Nursing
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Physiology is not just a prerequisite course — it is the foundation of clinical nursing judgment. Every assessment finding, lab value, and medication decision is rooted in how the body works. When you understand <em>{t("pages.nursingPhysiologyHubPage.why")}</em> hyperkalemia causes peaked T waves, or <em>{t("pages.nursingPhysiologyHubPage.why2")}</em> pyloric stenosis causes metabolic alkalosis, you can anticipate complications, prioritize interventions, and provide safer patient care.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              The topics in this hub are organized around the physiological concepts most frequently encountered in clinical practice and most heavily tested on nursing exams. Each page connects the underlying physiology to specific nursing interventions, medications, and clinical decision-making.
            </p>
          </div>
        </section>

        <section className="mb-12" data-testid="section-related-resources">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            Related Study Resources
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <LocaleLink href="/lessons">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-lessons">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.nursingPhysiologyHubPage.clinicalLessons")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.nursingPhysiologyHubPage.indepthPathophysiologyLessons")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/flashcards">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-flashcards">
                <CardContent className="p-4 text-center">
                  <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.nursingPhysiologyHubPage.flashcards")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.nursingPhysiologyHubPage.spacedrepetitionReviewCards")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/lab-values">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-lab-values">
                <CardContent className="p-4 text-center">
                  <Beaker className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.nursingPhysiologyHubPage.labValues")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.nursingPhysiologyHubPage.normalRangesAndClinicalSignificance")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section id="faq" className="mb-12" data-testid="section-faq">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-amber-50">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {HUB_FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  data-testid={`button-faq-${i}`}
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="mb-12">
          <EndOfContentLeadCapture leadMagnetType="study_guide" source="nursing_physiology_hub" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
