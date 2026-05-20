import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { seoBloodBankTopics } from "@/data/seo-blood-bank";
import {
  Droplets,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Shield,
  AlertTriangle,
  Microscope,
  FileText,
  Lock,
  Zap,
  Star,
} from "lucide-react";

const CLUSTER_FLOW = [
  { slug: "abo-blood-groups", label: "ABO Blood Groups", desc: "Forward & reverse typing, Bombay phenotype, ABO subgroups" },
  { slug: "rh-factor", label: "Rh Factor", desc: "D antigen, weak D vs partial D, RhIG administration" },
  { slug: "antibody-screening", label: "Antibody Screening", desc: "Panel rule-out technique, clinically significant antibodies, enzyme effects" },
  { slug: "crossmatching", label: "Crossmatching", desc: "Major crossmatch, electronic crossmatch, Coombs control" },
  { slug: "compatibility-chart", label: "Compatibility Chart", desc: "RBC & plasma compatibility, universal donor/recipient, emergency protocols" },
  { slug: "transfusion-reactions", label: "Transfusion Reactions", desc: "AHTR, FNHTR, TRALI vs TACO, anaphylaxis, TA-GVHD" },
  { slug: "hdfn", label: "HDFN", desc: "Rh HDFN vs ABO HDFN, Kleihauer-Betke, RhIG dosing" },
  { slug: "massive-transfusion", label: "Massive Transfusion", desc: "1:1:1 ratio, citrate toxicity, hypothermia, dilutional coagulopathy" },
  { slug: "blood-component-therapy", label: "Component Therapy", desc: "Storage temps, shelf life, leukoreduction, irradiation, washing" },
];

export default function MltBloodBankHub() {
  const totalQuestions = seoBloodBankTopics.reduce((sum, t) => sum + t.practiceQuestions.length, 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blood Bank & Transfusion Medicine — MLT Exam Review",
    description: "Complete blood banking and transfusion medicine review for MLT certification. ABO/Rh typing, crossmatching, transfusion reactions, HDFN, antibody identification, and component therapy.",
    url: "https://www.nursenest.ca/allied-health/mlt/blood-bank",
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    about: { "@type": "MedicalSpecialty", name: "Transfusion Medicine" },
    hasPart: seoBloodBankTopics.map(t => ({
      "@type": "Article",
      name: t.name,
      url: `https://www.nursenest.ca/allied-health/mlt/blood-bank/${t.slug}`,
    })),
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What topics are covered in blood banking for the MLT exam?", acceptedAnswer: { "@type": "Answer", text: "Blood banking (immunohematology) for the MLT certification covers ABO and Rh blood group systems, antibody screening and identification, crossmatching procedures, compatibility testing, transfusion reactions, hemolytic disease of the fetus and newborn (HDFN), massive transfusion protocols, and blood component therapy including storage requirements." }},
      { "@type": "Question", name: "How many blood bank questions are on the MLT exam?", acceptedAnswer: { "@type": "Answer", text: "Blood banking/immunohematology typically comprises 15-20% of the ASCP MLS/MLT certification exam and a similar proportion of the CSMLS exam. This makes it one of the most heavily weighted sections, reflecting its clinical importance in patient safety." }},
      { "@type": "Question", name: "What is the hardest blood bank topic for MLT students?", acceptedAnswer: { "@type": "Answer", text: "Antibody identification using panel rule-out technique is consistently rated as the most challenging topic. It requires understanding multiple blood group systems, enzyme effects, dosage phenomena, and the ability to systematically eliminate possibilities to identify specific antibody specificities." }},
    ],
  };

  return (
    <>
      <AlliedSEO
        title={t("allied.mlt_blood_bank_hub.bloodBankTransfusionMedicineMlt")}
        description={t("allied.mlt_blood_bank_hub.completeBloodBankingReviewFor")}
        keywords="blood banking MLT exam review, immunohematology MLT, ABO Rh typing exam, crossmatch compatibility testing, transfusion reactions management, HDFN hemolytic disease newborn"
        canonicalPath="/allied-health/mlt/blood-bank"
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
      />

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label="Breadcrumb" data-testid="breadcrumb-nav">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
            <Link href="/allied-health" className="hover:text-red-600 transition-colors">Allied Health</Link>
            <span>/</span>
            <Link href="/allied-health/mlt" className="hover:text-red-600 transition-colors">MLT</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Blood Bank</span>
          </div>
        </nav>

        <header className="bg-gradient-to-br from-red-800 to-red-950 text-white py-16 px-4" data-testid="hub-hero">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Droplets className="w-6 h-6 text-red-300" />
              <span className="text-red-300 text-sm font-semibold uppercase tracking-wider">Immunohematology / Blood Banking</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight" data-testid="text-hub-title">
              Blood Bank & Transfusion Medicine
            </h1>
            <p className="text-red-200 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              The most comprehensive blood banking review for ASCP MLS/MLT and CSMLS certification. Master every concept from ABO typing to massive transfusion protocols — with {totalQuestions}+ free practice questions and detailed rationales.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/allied-health/mlt/blood-bank/abo-blood-groups" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-800 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-lg" data-testid="cta-start-learning">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/allied-health/mlt/blood-bank/cheat-sheet" className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors" data-testid="cta-cheat-sheet">
                <FileText className="w-4 h-4" /> Blood Bank Cheat Sheet
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" data-testid="hub-stats">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{seoBloodBankTopics.length}</p>
              <p className="text-xs text-gray-500 mt-1">Topic Pages</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{totalQuestions}+</p>
              <p className="text-xs text-gray-500 mt-1">Free Questions</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">9</p>
              <p className="text-xs text-gray-500 mt-1">Blood Group Systems</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">15-20%</p>
              <p className="text-xs text-gray-500 mt-1">of MLT Exam</p>
            </div>
          </section>

          <section data-testid="topic-cluster">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Blood Bank Topic Cluster</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Follow the learning path from ABO fundamentals through advanced transfusion medicine. Each topic builds on the previous one.
            </p>
            <div className="space-y-3">
              {CLUSTER_FLOW.map((topic, idx) => (
                <Link
                  key={topic.slug}
                  href={`/allied-health/mlt/blood-bank/${topic.slug}`}
                  className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-red-200 hover:shadow-md transition-all group"
                  data-testid={`link-topic-${topic.slug}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">{topic.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">{topic.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors shrink-0 mt-2" />
                  </div>
                  {idx < CLUSTER_FLOW.length - 1 && (
                    <div className="ml-5 mt-3 border-l-2 border-dashed border-red-100 h-4" />
                  )}
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8" data-testid="section-why-blood-bank">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Why Blood Bank Is Critical for Your MLT Exam</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Highest Clinical Stakes</h3>
                  <p className="text-gray-600 text-sm mt-1">Blood bank errors cause the most severe adverse patient outcomes. Exam boards heavily weight this section because patient safety depends on your competence.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">High Exam Weighting</h3>
                  <p className="text-gray-600 text-sm mt-1">Blood banking accounts for 15-20% of both ASCP and CSMLS certification exams — one of the most heavily tested disciplines.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Microscope className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Complex Reasoning Required</h3>
                  <p className="text-gray-600 text-sm mt-1">Antibody panels, compatibility logic, and reaction workups require multi-step analytical reasoning that can't be memorized — you must understand the principles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Most Difficult Pass Rate</h3>
                  <p className="text-gray-600 text-sm mt-1">Blood bank consistently has the lowest pass rate among MLT disciplines. Students who master this section have a significant advantage on exam day.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-8 text-center text-white" data-testid="section-cta-unlock">
            <Lock className="w-10 h-10 text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Struggling with Blood Bank Questions?</h2>
            <p className="text-red-200 mb-6 max-w-xl mx-auto">
              Unlock 300+ Blood Bank Practice Questions with full rationales explaining why the correct answer is right and why each distractor is wrong.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/allied-health/mlt/questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-800 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-lg" data-testid="button-cta-unlock">
                Unlock 300+ Blood Bank Questions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors" data-testid="button-cta-pricing">
                View Plans
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8" data-testid="section-resources">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related MLT Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link href="/allied-health/mlt/blood-bank/cheat-sheet" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-cheat-sheet-bottom">
                <ArrowRight className="w-3.5 h-3.5" /><span>Blood Bank Cheat Sheet</span>
              </Link>
              <Link href="/allied-health/mlt/exam-prep" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-exam-prep">
                <ArrowRight className="w-3.5 h-3.5" /><span>MLT Exam Prep</span>
              </Link>
              <Link href="/allied-health/mlt/flashcard-prep" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-flashcards">
                <ArrowRight className="w-3.5 h-3.5" /><span>MLT Flashcards</span>
              </Link>
              <Link href="/allied-health/mlt/mock-exam" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-mock-exam">
                <ArrowRight className="w-3.5 h-3.5" /><span>MLT Mock Exam</span>
              </Link>
              <Link href="/lab-values" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-lab-values">
                <ArrowRight className="w-3.5 h-3.5" /><span>Lab Values Reference</span>
              </Link>
              <Link href="/allied-health/mlt/questions" className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-sm font-medium text-gray-700 hover:text-red-700" data-testid="link-question-bank">
                <ArrowRight className="w-3.5 h-3.5" /><span>MLT Question Bank</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
