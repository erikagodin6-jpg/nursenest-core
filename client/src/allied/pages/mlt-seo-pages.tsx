import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  Microscope, ArrowRight, CheckCircle2, ChevronDown, Star, BookOpen,
  Brain, FileText, Target, Award, BarChart3, Clock, Shield, Zap,
  GraduationCap, FlaskConical, Globe, Users, HelpCircle
} from "lucide-react";

interface MltSEOPageProps {
  country: "canada" | "usa" | "both";
  pageType: "practice-questions" | "exam-prep" | "study-guide" | "flashcards" | "mock-exam";
}

const COUNTRY_CONFIG = {
  canada: {
    label: "Canada",
    examBoard: "CSMLS",
    examName: "CSMLS MLT Certification Examination",
    units: "SI Units (mmol/L, µmol/L)",
    domains: ["Clinical Chemistry", "Hematology", "Microbiology", "Immunohematology", "Urinalysis & Body Fluids", "Immunology", "Molecular Diagnostics", "Lab Operations"],
    features: ["CSMLS blueprint-aligned content", "SI unit lab values", "Canadian regulatory framework", "PIPEDA compliance coverage", "Provincial licensing preparation"],
  },
  usa: {
    label: "United States",
    examBoard: "ASCP",
    examName: "ASCP MLS/MLT Board of Certification",
    units: "Conventional Units (mg/dL, g/dL)",
    domains: ["Clinical Chemistry", "Hematology", "Microbiology", "Blood Banking", "Urinalysis", "Immunology/Serology", "Molecular Diagnostics", "Laboratory Operations"],
    features: ["ASCP BOC content outline alignment", "US conventional unit values", "CLIA regulatory framework", "HIPAA compliance coverage", "State licensure preparation"],
  },
  both: {
    label: "Canada & USA",
    examBoard: "CSMLS & ASCP",
    examName: "CSMLS MLT & ASCP MLS/MLT",
    units: "Dual-unit display",
    domains: ["Clinical Chemistry", "Hematology", "Microbiology", "Blood Banking", "Urinalysis & Body Fluids", "Immunology", "Molecular Diagnostics", "Lab Operations & QM"],
    features: ["Dual-country exam prep", "Automatic unit conversion", "Region-specific regulations", "Both exam blueprints", "Comprehensive coverage"],
  },
};

const PAGE_CONTENT: Record<string, { title: string; metaDesc: string; h1: string; heroSub: string; sections: { heading: string; content: string }[]; faqs: { q: string; a: string }[] }> = {
  "canada-practice-questions": {
    title: "MLT Practice Questions Canada | CSMLS Exam Prep",
    metaDesc: "Master the CSMLS MLT certification exam with 1,000+ practice questions. Hematology, clinical chemistry, microbiology, and blood banking questions with detailed rationales.",
    h1: "CSMLS MLT Practice Questions",
    heroSub: "Exam-authentic CSMLS MLT practice questions covering all certification domains. SI unit values, Canadian regulatory content, and 600+ word rationales for every question.",
    sections: [
      { heading: "CSMLS Blueprint-Aligned Questions", content: "Every question in our bank is mapped to the official CSMLS MLT Certification Examination blueprint. Questions are weighted according to the exam's domain distribution — Clinical Chemistry and Hematology receive the highest weighting, followed by Microbiology, Immunohematology, and supporting disciplines. This ensures your practice mirrors the actual exam experience." },
      { heading: "SI Unit Lab Values Throughout", content: "All laboratory values in our Canadian track use SI units (mmol/L, µmol/L, g/L) as required by CSMLS. No converting between unit systems — what you practice is what you'll see on exam day. Includes critical value ranges, reference intervals, and pathological significance for each analyte." },
      { heading: "Discipline-Specific Test Banks", content: "Deep question coverage across all 16 MLT disciplines: Clinical Chemistry, Hematology, Hemostasis/Coagulation, Immunohematology, Microbiology, Urinalysis & Body Fluids, Immunology/Serology, Molecular Diagnostics, Histotechnology, Cytotechnology, Mycology, Parasitology, Virology, Phlebotomy, Laboratory Operations, and Point-of-Care Testing." },
      { heading: "Image-Based Questions", content: "The CSMLS exam includes image-based questions requiring identification of cell morphology, Gram stain results, crystal types, and colony characteristics. Our question bank includes high-quality laboratory images with annotation tools to build your visual identification skills." },
    ],
    faqs: [
      { q: "How many CSMLS MLT practice questions are available?", a: "We currently offer 1,000+ exam-authentic questions mapped to the CSMLS blueprint, with new questions added weekly. Our target is 5,000+ questions covering every discipline and cognitive level." },
      { q: "Are all lab values in SI units?", a: "Yes. The Canadian track uses SI units exclusively (mmol/L, µmol/L, g/L) matching the CSMLS exam format. You can switch to US conventional units if needed." },
      { q: "Do questions cover Canadian lab regulations?", a: "Yes. Our regulatory questions cover PIPEDA privacy requirements, provincial licensing frameworks, lab accreditation standards, and occupational health and safety regulations specific to Canadian laboratories." },
      { q: "Is there a free trial?", a: "Yes! Take our free 15-question diagnostic assessment to see your readiness score. Free users also get access to sample questions from each discipline." },
      { q: "How are the rationales different?", a: "Each rationale is 600+ words and explains the clinical reasoning, pathophysiology, and laboratory significance behind the correct answer. We explain why each distractor is wrong, building deeper understanding." },
    ],
  },
  "usa-practice-questions": {
    title: "MLT Practice Questions USA | ASCP MLS/MLT Board Prep",
    metaDesc: "Prepare for the ASCP MLS/MLT Board of Certification with 1,000+ practice questions. Complete coverage of all ASCP content areas with detailed rationales.",
    h1: "ASCP MLS/MLT Practice Questions",
    heroSub: "Exam-authentic ASCP Board of Certification practice questions covering all content areas. US conventional units, CLIA regulatory content, and comprehensive rationales.",
    sections: [
      { heading: "ASCP BOC Content Outline Alignment", content: "Questions mapped to the official ASCP Board of Certification content outline. Covers all major areas: Clinical Chemistry, Hematology/Hemostasis, Immunology/Immunohematology, Microbiology, Urinalysis/Body Fluids, Molecular Diagnostics, and Laboratory Operations. Weighted distribution matches actual exam proportions." },
      { heading: "US Conventional Units", content: "All laboratory values use US conventional units (mg/dL, g/dL, cells/µL) as tested on the ASCP BOC exam. Reference ranges, critical values, and pathological thresholds follow US laboratory standards. Delta check parameters and panic values are included." },
      { heading: "CLIA Regulatory Framework", content: "Comprehensive coverage of CLIA '88 regulations, personnel standards, proficiency testing requirements, quality control rules (Westgard), and laboratory safety including OSHA bloodborne pathogen standards. HIPAA compliance and documentation requirements are integrated throughout." },
      { heading: "Adaptive Practice Engine", content: "Our CAT-style engine adjusts question difficulty based on your performance. It identifies weak content areas and automatically prioritizes them, ensuring efficient study time and thorough coverage of all tested domains." },
    ],
    faqs: [
      { q: "How many ASCP practice questions are available?", a: "Over 1,000 exam-authentic questions mapped to the ASCP BOC content outline, with new questions added regularly. We're building toward 5,000+ questions across all content areas." },
      { q: "Does this cover the MLS and MLT exams?", a: "Yes. Our question bank covers both the MLS (Medical Laboratory Scientist) and MLT (Medical Laboratory Technician) certification exams, with appropriate difficulty differentiation." },
      { q: "What US regulations are covered?", a: "Comprehensive CLIA '88 coverage including personnel requirements, QC/QA, proficiency testing, and safety standards. Also covers OSHA, HIPAA, and state-specific licensing requirements." },
      { q: "Can I switch to Canadian CSMLS prep?", a: "Yes. Use the region toggle to switch between US (ASCP) and Canadian (CSMLS) tracks. Lab values, regulations, and blueprint weights update automatically." },
    ],
  },
  "both-exam-prep": {
    title: "MLT Exam Prep | CSMLS & ASCP Certification Study Platform",
    metaDesc: "Complete MLT exam preparation for CSMLS (Canada) and ASCP (USA) certification. 1,000+ practice questions, flashcards, mock exams, and personalized study plans.",
    h1: "MLT Certification Exam Prep",
    heroSub: "The most comprehensive medical laboratory technologist exam preparation platform. Covering both CSMLS (Canada) and ASCP (USA) certification with adaptive learning, image-based drills, and detailed analytics.",
    sections: [
      { heading: "Dual-Country Certification Coverage", content: "Whether you're preparing for the CSMLS MLT exam in Canada or the ASCP MLS/MLT Board of Certification in the USA, NurseNest covers both certification paths. Switch between country tracks to access exam-specific content, lab values in the correct unit system, and region-specific regulatory frameworks." },
      { heading: "Complete Learning Ecosystem", content: "Our platform integrates practice questions, flashcards, study plans, mock exams, and image-based drills into a unified learning experience. Every component is linked — miss a question on hemoglobin electrophoresis, and you'll be directed to the relevant lesson, flashcard deck, and practice questions for targeted remediation." },
      { heading: "16 MLT Disciplines Covered", content: "Comprehensive coverage of Clinical Chemistry, Hematology, Hemostasis/Coagulation, Immunohematology/Blood Banking, Microbiology, Urinalysis & Body Fluids, Immunology/Serology, Molecular Diagnostics, Histotechnology, Cytotechnology, Mycology, Parasitology, Virology, Phlebotomy & Specimen Collection, Laboratory Operations & QM, and Point-of-Care Testing." },
      { heading: "Smart Remediation Engine", content: "Our remediation engine automatically links content across the platform. When you answer a question incorrectly, it identifies the specific discipline, topic, and subtopic — then recommends the best lesson to review, flashcard deck to study, and similar practice questions to attempt. This targeted approach accelerates learning and closes knowledge gaps efficiently." },
    ],
    faqs: [
      { q: "What MLT certifications does this prepare for?", a: "CSMLS MLT Certification (Canada), ASCP MLS (Medical Laboratory Scientist), and ASCP MLT (Medical Laboratory Technician) certifications in the United States." },
      { q: "How is content different for Canada vs USA?", a: "Canadian content uses SI units, covers PIPEDA/provincial regulations, and follows the CSMLS blueprint. US content uses conventional units, covers CLIA/HIPAA regulations, and follows the ASCP BOC content outline." },
      { q: "What makes this different from other MLT prep?", a: "Our platform uniquely combines dual-country coverage, image-based identification drills, an auto-linking remediation engine, and 600+ word rationales. Most alternatives offer simple question banks — we provide a complete learning ecosystem." },
      { q: "Is there a free tier?", a: "Yes. Free users get sample questions from each discipline, limited flashcard access, and one diagnostic assessment. Premium unlocks the full question bank, all flashcard decks, mock exams, and personalized study plans." },
      { q: "How often is content updated?", a: "New questions and flashcards are added weekly. Content is reviewed against current exam blueprints quarterly. Lab values and regulatory content are updated whenever standards change." },
    ],
  },
  "both-study-guide": {
    title: "MLT Study Guide | Complete Medical Lab Technologist Prep",
    metaDesc: "Comprehensive MLT study guide with personalized plans, spaced repetition flashcards, and lab image drills. Master hematology, clinical chemistry, microbiology, and all lab disciplines.",
    h1: "MLT Study Guide",
    heroSub: "A complete, adaptive study system covering every MLT discipline — from cell morphology identification to clinical chemistry calculations and microbiology Gram stain interpretation.",
    sections: [
      { heading: "Personalized Study Plans", content: "Our platform analyzes your diagnostic results and ongoing performance to create a week-by-week study plan. Whether you have 4 weeks or 4 months until your exam, the study planner adapts. It prioritizes weak disciplines, schedules review sessions at optimal intervals, and includes milestone checkpoints to track your readiness." },
      { heading: "Lab Image Identification Drills", content: "Medical laboratory exams test visual identification skills extensively. Our image drill system includes cell morphology slides, Gram stain images, urine sediment micrographs, colony morphology photos, and blood bank reaction grading. Practice with annotated images and build the visual recognition skills that differentiate passing from failing." },
      { heading: "Spaced Repetition Flashcards", content: "Master key lab concepts with our spaced repetition system. Cards cover reference ranges, staining characteristics, organism identification, quality control rules, and calculation formulas. The algorithm tracks which cards you know well and which need reinforcement, ensuring efficient review sessions." },
      { heading: "Remediation-Linked Learning", content: "Every wrong answer becomes a learning opportunity. Our remediation engine identifies your specific weakness and links you to the relevant lesson, flashcard deck, and practice questions. One click takes you from a missed question to targeted study — closing knowledge gaps faster than traditional study methods." },
    ],
    faqs: [
      { q: "How does the study plan work?", a: "Complete the diagnostic assessment, set your exam date, and the platform generates a personalized week-by-week schedule. It adapts daily based on your practice performance, spending more time on weak areas." },
      { q: "What image types are included in the drills?", a: "Hematology cell morphology, microbiology Gram stains and colony morphology, urinalysis crystals and casts, blood banking reactions, clinical chemistry QC charts, and parasitology specimens." },
      { q: "Can I study on my phone?", a: "Yes. NurseNest is fully responsive. Study flashcards on your phone, practice questions on your tablet, and review lessons on your computer. Progress syncs across all devices." },
      { q: "How long should I study before my MLT exam?", a: "Most students use our platform for 8-12 weeks. The study planner creates an optimized schedule based on your starting knowledge level and time until your exam." },
    ],
  },
  "both-mock-exam": {
    title: "MLT Mock Exam | Full-Length CSMLS & ASCP Practice Tests",
    metaDesc: "Take full-length MLT mock exams simulating CSMLS and ASCP certification tests. Blueprint-weighted, timed practice with domain-level scoring and remediation.",
    h1: "MLT Mock Exam",
    heroSub: "Full-length, blueprint-weighted mock exams that replicate the real CSMLS and ASCP testing experience — with adaptive difficulty, realistic timing, image-based questions, and comprehensive performance analytics.",
    sections: [
      { heading: "Realistic Exam Simulation", content: "Our mock exams replicate the actual certification testing environment. CSMLS mock exams feature 200 questions in a 250-minute timed session. ASCP mock exams use the BOC format with appropriate question counts and timing. Both include image-based questions requiring specimen and result identification." },
      { heading: "Blueprint-Weighted Distribution", content: "Every mock exam follows the official exam blueprint weighting. Questions are distributed across disciplines exactly as they appear on the real exam — ensuring Clinical Chemistry, Hematology, and Microbiology receive appropriate emphasis while covering all supporting disciplines." },
      { heading: "Detailed Performance Analytics", content: "After completing a mock exam, receive a comprehensive report. See your overall score, discipline-level breakdown, question difficulty analysis, time management metrics, and specific areas for improvement. Track scores across multiple attempts to visualize your progress." },
      { heading: "Post-Exam Remediation", content: "Every wrong answer links to targeted remediation. Review the lesson, study related flashcards, and attempt similar practice questions — all accessible from your results page. Our system creates a personalized study plan based on your mock exam weaknesses." },
    ],
    faqs: [
      { q: "How long is the mock exam?", a: "CSMLS mock exams are 200 questions / 250 minutes. ASCP mock exams follow the BOC format. We also offer mini-mocks (50 questions) and quick quizzes (10-25 questions) for focused practice." },
      { q: "Can I retake mock exams?", a: "Premium members get unlimited attempts with randomized question selection, so each attempt provides a different testing experience." },
      { q: "Does it include image-based questions?", a: "Yes. Mock exams include laboratory images for cell identification, Gram stain interpretation, crystal recognition, and other visual questions, just like the real exam." },
      { q: "How is the mock exam scored?", a: "You receive a domain-level breakdown showing strengths and weaknesses across all tested areas, plus an overall readiness indicator based on your performance." },
    ],
  },
  "both-flashcards": {
    title: "MLT Flashcards | Medical Lab Technologist Study Cards",
    metaDesc: "Master MLT concepts with spaced repetition flashcards covering hematology, clinical chemistry, microbiology, blood banking, and all lab disciplines. CSMLS & ASCP aligned.",
    h1: "MLT Flashcards",
    heroSub: "Spaced repetition flashcards covering every MLT discipline. Master cell morphology, lab values, organism identification, quality control rules, and calculation formulas for CSMLS and ASCP certification.",
    sections: [
      { heading: "Discipline-Organized Decks", content: "Flashcard decks organized by all 16 MLT disciplines. Each deck covers the essential concepts, reference ranges, identification criteria, and clinical significance tested on certification exams. Decks range from 20-60 cards, designed for focused study sessions." },
      { heading: "Spaced Repetition Algorithm", content: "Our algorithm tracks your performance on every card. Cards you know well appear less frequently, while challenging cards resurface at optimal intervals for long-term retention. This scientifically-proven approach maximizes learning efficiency." },
      { heading: "Image-Based Flashcards", content: "Beyond text-based cards, our library includes image flashcards for visual identification. Practice recognizing cell morphology, bacterial colonies, urine crystals, parasitic organisms, and QC chart violations with high-quality laboratory images." },
      { heading: "Dual-Unit Support", content: "Flashcards automatically display lab values in your selected unit system — SI units for CSMLS preparation or conventional units for ASCP preparation. Switch between units to build familiarity with both systems." },
    ],
    faqs: [
      { q: "How many flashcard decks are available?", a: "Currently 20+ decks covering all major MLT disciplines, with new decks added regularly. Each deck contains 20-60 cards focused on key exam concepts." },
      { q: "How does spaced repetition work?", a: "The algorithm presents cards at increasing intervals as you master them. New and difficult cards appear more often, while known cards are spaced further apart. This optimizes retention while minimizing study time." },
      { q: "Can I create my own flashcards?", a: "Premium members can create custom flashcard decks and share them with study groups. You can also bookmark cards from existing decks for personalized review sessions." },
      { q: "Are flashcards available on mobile?", a: "Yes. Study flashcards on any device — phone, tablet, or computer. Your progress syncs automatically across all devices." },
    ],
  },
};

function FAQSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3" data-testid="faq-section">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-${i}`}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-800 text-sm pr-4">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function MltSEOPage({ country, pageType }: MltSEOPageProps) {
  const key = `${country}-${pageType}`;
  const content = PAGE_CONTENT[key];
  const countryConfig = COUNTRY_CONFIG[country];

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.mltSeoPages.pageNotFound")}</h1>
        <p className="text-gray-600">{t("allied.mltSeoPages.thisMltPageDoesntExist")}</p>
        <Link href="/allied-health/mlt" className="inline-block mt-4 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700" data-testid="link-mlt-home">
          Back to MLT Hub
        </Link>
      </div>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": content.h1,
    "description": content.metaDesc,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest Allied",
      "sameAs": "https://www.nursenest.ca/allied-health",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT8W",
    },
  };

  return (
    <>
      <AlliedSEO
        title={content.title}
        description={content.metaDesc}
        keywords={`MLT exam prep, ${countryConfig.examBoard} study, medical laboratory technologist, ${countryConfig.examName}, ${pageType.replace("-", " ")}`}
        canonicalPath={country === "both" ? (pageType === "flashcards" ? "/allied-health/mlt/flashcard-prep" : `/allied-health/mlt/${pageType}`) : `/allied-health/mlt/${country}/${pageType}`}
        structuredData={courseSchema}
        additionalStructuredData={[faqSchema]}
      />
      <div className="max-w-5xl mx-auto px-4" data-testid={`mlt-seo-${key}`}>
        <section className="py-16 text-center" data-testid="seo-hero">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium mb-4">
            <Microscope className="w-4 h-4" />
            <span>{countryConfig.label} • {countryConfig.examBoard}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="seo-h1">
            {content.h1}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {content.heroSub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard/mlt" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200" data-testid="cta-start-studying">
              Start Studying Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors" data-testid="cta-view-plans">
              View Plans
            </Link>
          </div>
        </section>

        <section className="py-8" data-testid="feature-badges">
          <div className="flex flex-wrap justify-center gap-3">
            {countryConfig.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {feat}
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 space-y-10" data-testid="seo-content-sections">
          {content.sections.map((sec, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-8" data-testid={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{sec.heading}</h2>
              <p className="text-gray-600 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </section>

        <section className="py-12" data-testid="domains-covered">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("allied.mltSeoPages.disciplinesCovered")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {countryConfig.domains.map((domain, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg" data-testid={`domain-badge-${i}`}>
                <FlaskConical className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{domain}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12" data-testid="internal-links">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("allied.mltSeoPages.exploreMltResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/mlt" className="p-5 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors text-center" data-testid="link-dashboard">
              <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">{t("allied.mltSeoPages.studentDashboard")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.mltSeoPages.trackYourProgress")}</div>
            </Link>
            <Link href="/allied-health/mlt/blog" className="p-5 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors text-center" data-testid="link-blog">
              <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">{t("allied.mltSeoPages.mltBlog")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.mltSeoPages.studyArticlesTips")}</div>
            </Link>
            <Link href="/qbank?career=mlt" className="p-5 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors text-center" data-testid="link-qbank">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">{t("allied.mltSeoPages.testBank")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.mltSeoPages.practiceQuestions")}</div>
            </Link>
            <Link href="/allied-health/mlt/image-drill" className="p-5 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors text-center" data-testid="link-image-drill">
              <Microscope className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-800">{t("allied.mltSeoPages.imageDrills")}</div>
              <div className="text-xs text-gray-500 mt-1">{t("allied.mltSeoPages.visualIdentification")}</div>
            </Link>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("allied.mltSeoPages.frequentlyAskedQuestions")}</h2>
          <FAQSection faqs={content.faqs} />
        </section>

        <section className="py-12" data-testid="related-allied-careers">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{t("allied.mltSeoPages.relatedAlliedHealthCareers")}</h2>
          <p className="text-gray-500 text-center mb-8">{t("allied.mltSeoPages.exploreOtherHealthcareCareerPaths")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Respiratory Therapist", shortName: "RRT", href: "/allied-health/rrt", desc: "Ventilator management, ABG analysis & NBRC/CBRC certification" },
              { name: "Pharmacy Technician", shortName: "Pharm Tech", href: "/allied-health/pharmacy-technician", desc: "Pharmacology, compounding & PTCB/ExCPT certification" },
              { name: "Paramedic", shortName: "Paramedic", href: "/allied-health/paramedic", desc: "Emergency medical services & NREMT/COPR certification" },
              { name: "Medical Imaging", shortName: "Imaging", href: "/allied-health/imaging", desc: "Radiography, sonography & ARRT/ARDMS certification" },
            ].map(career => (
              <Link key={career.shortName} href={career.href} className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all" data-testid={`link-related-${career.shortName.toLowerCase().replace(/\s+/g, "-")}`}>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">{career.shortName}</h3>
                <p className="text-xs text-gray-500 mb-2">{career.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{career.desc}</p>
                <span className="text-purple-600 text-xs font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-12 text-center" data-testid="seo-bottom-cta">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-10">
            <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.mltSeoPages.readyToPassYourMlt")}</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Join thousands of MLT students using NurseNest to prepare for their {countryConfig.examBoard} certification exam with confidence.
            </p>
            <Link href="/dashboard/mlt" className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200" data-testid="cta-bottom">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
