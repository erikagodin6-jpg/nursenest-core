import { Link, useParams } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import {
  ArrowRight, BookOpen, Brain, Zap, Target, CheckCircle2,
  Star, BarChart3, Shield, Atom, Layers, ChevronDown
} from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
interface SEOConfig {
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  features: { icon: React.ReactNode; title: string; description: string }[];
  sections: { heading: string; content: string }[];
  faqs: { q: string; a: string }[];
  ctaText: string;
  ctaLink: string;
}

const IMAGING_SEO_CONFIGS: Record<string, (country: string) => SEOConfig> = {
  physics: (country) => {
    const exam = country === "usa" ? "ARRT" : "CAMRT";
    return {
      title: `Radiation Physics Study Guide - ${exam}`,
      metaTitle: `Radiation Physics Study Guide | ${exam} Exam Prep | NurseNest`,
      metaDescription: `Master radiation physics for the ${exam} exam with 20+ interactive visual modules, micro-quizzes, exam traps, and spaced repetition flashcards. Free diagnostic included.`,
      h1: `Radiation Physics Study Guide`,
      heroSubtitle: `Interactive visual learning modules designed specifically for ${exam} exam preparation. Master x-ray physics concepts with hands-on simulators, micro-quizzes, and memory aids.`,
      features: [
        { icon: <Atom className="w-6 h-6" />, title: "Interactive Visuals", description: "Hands-on kVp, mAs, inverse square law, and attenuation simulators that make abstract physics concepts tangible." },
        { icon: <Brain className="w-6 h-6" />, title: "Micro-Quizzes", description: "Test your understanding after every topic with exam-style questions and detailed rationales." },
        { icon: <Target className="w-6 h-6" />, title: "Exam Traps", description: "Learn the common mistakes students make on the ${exam} exam and how to avoid them." },
        { icon: <Zap className="w-6 h-6" />, title: "Memory Aids", description: "Creative mnemonics and memory tricks that stick. Remember key formulas and relationships." },
      ],
      sections: [
        {
          heading: "Why Interactive Physics Learning Works",
          content: `Traditional radiation physics textbooks present formulas and concepts as static text. Our interactive approach lets you manipulate variables and see results in real-time. Adjust kVp and watch how penetration, contrast, and scatter change simultaneously. Move the SID slider and see magnification change before your eyes. This active learning approach has been shown to improve retention by up to 75% compared to passive reading. Every topic includes exam-focused content mapped to the official ${exam} exam blueprint.`
        },
        {
          heading: `Mapped to the ${exam} Exam Blueprint`,
          content: `Every physics topic in our study guide is mapped to the official ${exam} content outline. We cover all testable physics domains including x-ray production, beam characteristics, beam interactions with matter, image quality factors, digital imaging concepts, and radiation protection. Our exam traps section highlights the specific ways physics questions are designed to trick students — and teaches you how to identify the correct answer every time.`
        },
        {
          heading: "Spaced Repetition Flashcards",
          content: "Complement your physics study with our spaced repetition flashcard system. Each card is rated by difficulty, and the system automatically schedules reviews based on your performance. Cards you find difficult come back sooner, while mastered cards are reviewed less frequently. This scientifically-proven approach ensures you retain information long-term — not just until exam day."
        },
        {
          heading: "From Theory to Clinical Practice",
          content: "Each physics topic includes a Clinical Relevance section that connects abstract concepts to real-world radiography. Understanding why you use 72\" SID for chest x-rays, why you increase kVp for large patients, and how scatter affects image quality makes you a better radiographer — not just a better test-taker."
        }
      ],
      faqs: [
        { q: `How many physics topics are covered?`, a: `We currently cover 20+ physics topics across x-ray production, beam characteristics, beam interactions, image quality, digital imaging, and radiation protection — with new topics added regularly.` },
        { q: `Are the topics aligned with the ${exam} exam?`, a: `Yes. Every topic is mapped to the official ${exam} content outline, ensuring you study exactly what will be tested.` },
        { q: `How do the interactive visuals work?`, a: `Our interactive simulators let you adjust variables (kVp, mAs, distance, tissue type) and see the effects in real-time. No downloads or plugins needed — they run directly in your browser.` },
        { q: `Can I track my progress?`, a: `Yes. The system tracks which topics you've completed, your quiz scores, and your flashcard progress. Pick up right where you left off.` },
        { q: `Is there a free trial?`, a: `Many of our physics topics are available for free. Premium members get access to all topics, unlimited quizzes, and the full flashcard library.` },
        { q: `How are the micro-quizzes different from practice exams?`, a: `Micro-quizzes test your understanding of a single topic with 3-5 questions immediately after studying. Practice exams test multiple topics together in an exam-like format with time pressure.` },
      ],
      ctaText: "Start Learning Physics",
      ctaLink: `/medical-imaging/${country}/physics`,
    };
  },
  flashcards: (country) => {
    const exam = country === "usa" ? "ARRT" : "CAMRT";
    return {
      title: `Radiography Flashcards - ${exam}`,
      metaTitle: `Radiography Flashcards | ${exam} Exam Prep | Spaced Repetition | NurseNest`,
      metaDescription: `40+ radiography flashcards with spaced repetition for ${exam} exam prep. Covers radiation physics, image production, radiation protection, and positioning essentials.`,
      h1: `Radiography Flashcards`,
      heroSubtitle: `Master radiography concepts with scientifically-proven spaced repetition. Rate each card as Easy, Medium, or Hard — the system automatically optimizes your review schedule.`,
      features: [
        { icon: <Layers className="w-6 h-6" />, title: "4 Study Decks", description: "Organized by topic: Radiation Physics, Image Production, Radiation Protection, and Positioning Essentials." },
        { icon: <BarChart3 className="w-6 h-6" />, title: "Progress Tracking", description: "See which cards you've mastered and which need more review. Data persists across sessions." },
        { icon: <Brain className="w-6 h-6" />, title: "Spaced Repetition", description: "Cards you find difficult come back sooner. Mastered cards are reviewed less frequently." },
        { icon: <Star className="w-6 h-6" />, title: "Exam-Focused", description: `Every card is written for the ${exam} exam. Covers key facts, formulas, and clinical applications.` },
      ],
      sections: [
        {
          heading: "Why Spaced Repetition Works",
          content: "Spaced repetition is the most effective evidence-based study technique. Instead of cramming all flashcards in one session, the system spaces out reviews at optimal intervals. When you rate a card as 'Easy,' it won't appear again for several days. Rate it 'Hard,' and you'll see it again soon. This approach fights the forgetting curve and builds long-term retention."
        },
        {
          heading: "Comprehensive Topic Coverage",
          content: `Our flashcard library covers every major ${exam} exam domain: Radiation Physics (x-ray production, beam interactions, inverse square law), Image Production (technique factors, grids, AEC, digital imaging), Radiation Protection (dose limits, ALARA, shielding), and Positioning (projections, landmarks, common positions). Each card includes the answer plus context to deepen understanding.`
        },
      ],
      faqs: [
        { q: "How many flashcards are available?", a: "We currently offer 40+ flashcards across 4 decks, with new cards added regularly." },
        { q: "Is my progress saved?", a: "Yes. Your spaced repetition data is saved locally and persists across browser sessions." },
        { q: "Can I study specific topics?", a: "Yes. You can select individual decks or study all cards together." },
        { q: "How does the difficulty rating work?", a: "After viewing each card's answer, rate it Easy, Medium, or Hard. Easy cards appear less frequently in future reviews, while Hard cards come back sooner." },
      ],
      ctaText: "Start Studying Flashcards",
      ctaLink: `/medical-imaging/${country}/flashcards`,
    };
  }
};

export default function ImagingSeoLanding() {
  const { t } = useI18n();
  const params = useParams<{ country: string; pageType: string }>();
  const country = params.country === "usa" ? "usa" : "canada";
  const pageType = params.pageType || "physics";
  const configFn = IMAGING_SEO_CONFIGS[pageType];
  const config = configFn ? configFn(country) : IMAGING_SEO_CONFIGS.physics(country);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <AlliedSEO
        title={config.metaTitle}
        description={config.metaDescription}
        canonicalPath={`/medical-imaging/${country}/${pageType}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "EducationalCourse",
          name: config.title,
          description: config.metaDescription,
          provider: { "@type": "Organization", name: "NurseNest" },
          educationalLevel: "Professional Certification"
        }}
        additionalStructuredData={[{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: config.faqs.map(f => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        }]}
      />
      <div className="min-h-screen" data-testid="imaging-seo-landing">
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-seo-h1">{config.h1}</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">{config.heroSubtitle}</p>
            <Link href={config.ctaLink} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors" data-testid="link-cta-primary">
              {config.ctaText} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.features.map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-5 text-center" data-testid={`feature-card-${i}`}>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-10">
            {config.sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.heading}</h2>
                <p className="text-gray-700 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-8">{t("allied.imagingSeoLanding.frequentlyAskedQuestions")}</h2>
            <div className="space-y-3">
              {config.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                    data-testid={`button-faq-${i}`}
                  >
                    <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-gray-600">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">{t("allied.imagingSeoLanding.readyToMasterRadiography")}</h2>
            <p className="text-teal-100 mb-6">{t("allied.imagingSeoLanding.joinThousandsOfStudentsPreparing")}</p>
            <Link href={config.ctaLink} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors" data-testid="link-cta-bottom">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
