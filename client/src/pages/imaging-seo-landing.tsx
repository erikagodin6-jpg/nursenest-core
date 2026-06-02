import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, ArrowRight, FileText, Brain, Radio, Target, Zap,
  CheckCircle2, Star, Users, Award
} from "lucide-react";

interface LandingConfig {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  keywords: string;
  canonicalPath: string;
  sections: {
    country: string;
    flag: string;
    exam: string;
    links: { title: string; href: string; description: string }[];
  }[];
  features: { icon: typeof BookOpen; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

const LANDING_PAGES: Record<string, LandingConfig> = {
  "radiography-practice-questions": {
    title: "Radiography Practice Questions",
    metaTitle: "Radiography Practice Questions - Free CAMRT & ARRT Exam Prep",
    metaDescription: "Practice radiography exam questions for CAMRT and ARRT certification. Timed practice exams, detailed rationales, and performance analytics for radiologic technologists.",
    heading: "Radiography Practice Questions",
    subheading: "Prepare for your CAMRT or ARRT certification exam with hundreds of practice questions covering radiographic positioning, radiation physics, patient care, and image evaluation.",
    keywords: "radiography practice questions, CAMRT practice exam, ARRT practice test, radiologic technologist exam prep, X-ray tech practice questions",
    canonicalPath: "/radiography-practice-questions",
    sections: [
      {
        country: "canada", flag: "\u{1F1E8}\u{1F1E6}", exam: "CAMRT",
        links: [
          { title: "CAMRT Practice Exams", href: "/medical-imaging/canada/practice-exams", description: "Timed exams weighted to the CAMRT certification blueprint." },
          { title: "CAMRT Exam Simulator", href: "/medical-imaging/canada/exam-simulator", description: "Adaptive simulator with realistic test interface." },
          { title: "Canada Study Guides", href: "/medical-imaging/canada/lessons", description: "Comprehensive lessons for all CAMRT exam domains." },
        ],
      },
      {
        country: "usa", flag: "\u{1F1FA}\u{1F1F8}", exam: "ARRT",
        links: [
          { title: "ARRT Practice Exams", href: "/medical-imaging/usa/practice-exams", description: "Practice tests matching ARRT content specifications." },
          { title: "ARRT Exam Simulator", href: "/medical-imaging/usa/exam-simulator", description: "Full-length adaptive exam simulation." },
          { title: "USA Study Guides", href: "/medical-imaging/usa/lessons", description: "Lessons covering all ARRT exam content areas." },
        ],
      },
    ],
    features: [
      { icon: FileText, title: "Exam-Style Questions", description: "Multiple-choice questions designed to match the format and difficulty of actual certification exams." },
      { icon: Target, title: "Detailed Rationales", description: "Every question includes a thorough explanation of why each answer is correct or incorrect." },
      { icon: Brain, title: "Adaptive Difficulty", description: "Questions adapt to your performance level, focusing on areas where you need more practice." },
      { icon: Award, title: "Performance Analytics", description: "Track your scores across categories and identify strengths and weaknesses." },
    ],
    faqs: [
      { question: "How many practice questions are available?", answer: "Our database includes hundreds of radiography practice questions spanning positioning, physics, radiation safety, patient care, and image evaluation. New questions are added regularly." },
      { question: "Are the practice questions similar to the real CAMRT/ARRT exam?", answer: "Yes, our questions are written to match the format, difficulty, and content specifications of the CAMRT and ARRT certification exams." },
      { question: "Can I take timed practice exams?", answer: "Yes, our exam simulator provides timed practice sessions with realistic testing conditions, including question flagging and review." },
      { question: "Is there a difference between Canada and USA practice questions?", answer: "Yes, our practice questions are specifically tailored to each country's certification exam. Canadian questions align with CAMRT blueprints, while USA questions match ARRT content specifications." },
    ],
  },
  "radiography-positioning-guide": {
    title: "Radiography Positioning Guide",
    metaTitle: "Radiographic Positioning Guide - Complete Reference for Radiography Students",
    metaDescription: "Complete radiographic positioning reference with patient positions, central ray directions, anatomy demonstrated, and evaluation criteria for every projection.",
    heading: "Radiographic Positioning Guide",
    subheading: "Master every radiographic projection with detailed patient positioning instructions, central ray directions, anatomy demonstrated, and image evaluation criteria.",
    keywords: "radiographic positioning, radiography positioning guide, patient positioning radiography, central ray direction, anatomy demonstrated, radiographic projections",
    canonicalPath: "/radiography-positioning-guide",
    sections: [
      {
        country: "canada", flag: "\u{1F1E8}\u{1F1E6}", exam: "CAMRT",
        links: [
          { title: "Canada Positioning Database", href: "/medical-imaging/canada/positioning", description: "Searchable database of radiographic projections for CAMRT prep." },
          { title: "Canada Physics Review", href: "/medical-imaging/canada/physics", description: "Radiation physics and image quality concepts." },
          { title: "CAMRT Study Guides", href: "/medical-imaging/canada/lessons", description: "Comprehensive positioning and procedures lessons." },
        ],
      },
      {
        country: "usa", flag: "\u{1F1FA}\u{1F1F8}", exam: "ARRT",
        links: [
          { title: "USA Positioning Database", href: "/medical-imaging/usa/positioning", description: "Complete positioning reference for ARRT exam preparation." },
          { title: "USA Physics Review", href: "/medical-imaging/usa/physics", description: "Physics topics aligned with ARRT content specifications." },
          { title: "ARRT Study Guides", href: "/medical-imaging/usa/lessons", description: "Lessons covering all ARRT positioning content." },
        ],
      },
    ],
    features: [
      { icon: Radio, title: "Complete Projections", description: "Every standard and special radiographic projection with step-by-step positioning instructions." },
      { icon: Target, title: "Central Ray Details", description: "Precise central ray direction, angle, and entry point for each projection." },
      { icon: CheckCircle2, title: "Evaluation Criteria", description: "Image evaluation criteria showing what a properly positioned radiograph should demonstrate." },
      { icon: Brain, title: "Anatomy Demonstrated", description: "Detailed list of anatomical structures visible on each properly positioned image." },
    ],
    faqs: [
      { question: "What projections are covered in the positioning guide?", answer: "Our guide covers all standard radiographic projections organized by body region including chest, abdomen, spine, upper extremity, lower extremity, skull, and special procedures." },
      { question: "Does the guide include positioning diagrams?", answer: "Yes, many projections include positioning diagrams, teaching images, and examples of correctly and incorrectly positioned radiographs." },
      { question: "Are the positioning criteria different for Canada and USA?", answer: "While core positioning principles are the same, our guides are tailored to each country's specific exam expectations, terminology preferences, and evaluation criteria." },
    ],
  },
  "radiography-artifact-recognition": {
    title: "Radiography Artifact Recognition",
    metaTitle: "Radiographic Artifact Recognition - Identify & Prevent Image Artifacts",
    metaDescription: "Learn to identify, prevent, and correct radiographic image artifacts. Covers motion artifacts, equipment artifacts, processing errors, and patient-related artifacts.",
    heading: "Radiographic Artifact Recognition",
    subheading: "Develop your ability to identify, classify, and prevent radiographic image artifacts. Essential knowledge for certification exams and clinical practice.",
    keywords: "radiographic artifacts, image artifacts radiography, motion artifact, equipment artifacts, processing artifacts, radiography image quality",
    canonicalPath: "/radiography-artifact-recognition",
    sections: [
      {
        country: "canada", flag: "\u{1F1E8}\u{1F1E6}", exam: "CAMRT",
        links: [
          { title: "Image Quality Lessons", href: "/medical-imaging/canada/lessons", description: "Study image quality and artifact recognition for CAMRT." },
          { title: "CAMRT Practice Questions", href: "/medical-imaging/canada/practice-exams", description: "Practice questions on image evaluation and artifacts." },
          { title: "Physics & Image Production", href: "/medical-imaging/canada/physics", description: "Physics concepts related to image quality factors." },
        ],
      },
      {
        country: "usa", flag: "\u{1F1FA}\u{1F1F8}", exam: "ARRT",
        links: [
          { title: "Image Evaluation Lessons", href: "/medical-imaging/usa/lessons", description: "Study artifact identification for ARRT certification." },
          { title: "ARRT Practice Questions", href: "/medical-imaging/usa/practice-exams", description: "Image quality and artifact questions for ARRT prep." },
          { title: "Image Production Physics", href: "/medical-imaging/usa/physics", description: "Technical factors affecting image quality." },
        ],
      },
    ],
    features: [
      { icon: Target, title: "Artifact Classification", description: "Learn to classify artifacts as patient-related, equipment-related, or processing-related." },
      { icon: FileText, title: "Prevention Strategies", description: "Practical tips and techniques for preventing common radiographic artifacts." },
      { icon: Brain, title: "Cause & Effect", description: "Understand the physics behind why each type of artifact occurs and how technical factors contribute." },
      { icon: Star, title: "Exam-Focused", description: "Artifact recognition questions commonly appear on CAMRT and ARRT exams — be prepared." },
    ],
    faqs: [
      { question: "What types of artifacts should I know for the exam?", answer: "You should be familiar with motion artifacts, equipment artifacts (grid lines, collimator artifacts), processing artifacts (in CR/DR systems), patient artifacts (jewelry, clothing), and exposure-related artifacts." },
      { question: "How are artifacts tested on certification exams?", answer: "Certification exams typically show radiographic images and ask you to identify the artifact, explain its cause, and describe corrective actions." },
    ],
  },
};

function FAQSectionLanding({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="mt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.imagingSeoLanding.frequentlyAskedQuestions")}</h2>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-landing-${i}`}>
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50">
              <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
              {open === i ? <span className="text-gray-400">−</span> : <span className="text-gray-400">+</span>}
            </button>
            {open === i && <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function RadiographyPracticeQuestions() {
  return <SEOLandingPage pageKey="radiography-practice-questions" />;
}

export function RadiographyPositioningGuide() {
  return <SEOLandingPage pageKey="radiography-positioning-guide" />;
}

export function RadiographyArtifactRecognition() {
  return <SEOLandingPage pageKey="radiography-artifact-recognition" />;
}

function SEOLandingPage({ pageKey }: { pageKey: string }) {
  const config = LANDING_PAGES[pageKey];
  if (!config) return null;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.metaTitle,
    description: config.metaDescription,
    url: `https://www.nursenest.ca${config.canonicalPath}`,
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title={config.metaTitle}
        description={config.metaDescription}
        keywords={config.keywords}
        canonicalPath={config.canonicalPath}
        structuredData={webPageSchema}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Medical Imaging", href: "/medical-imaging" },
          { label: config.title, href: config.canonicalPath },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <BreadcrumbNav items={[{ name: "Medical Imaging", url: "/medical-imaging" }, { name: config.title, url: "" }]} />

        <header className="text-center mt-8 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-landing-heading">{config.heading}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="text-landing-subheading">{config.subheading}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/medical-imaging/canada" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors" data-testid="link-cta-canada">
              {"\u{1F1E8}\u{1F1E6}"} Start Canada Prep <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/medical-imaging/usa" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" data-testid="link-cta-usa">
              {"\u{1F1FA}\u{1F1F8}"} Start USA Prep <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        <section className="mb-16" data-testid="section-features">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.imagingSeoLanding.whatYoullGet")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 text-center" data-testid={`card-feature-${i}`}>
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-16" data-testid="section-country-resources">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("pages.imagingSeoLanding.resourcesByCountry")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {config.sections.map((section, si) => (
              <div key={si} className={`border-2 rounded-2xl p-6 ${section.country === "canada" ? "border-red-200 bg-red-50/50" : "border-blue-200 bg-blue-50/50"}`} data-testid={`card-country-${section.country}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{section.flag} {section.exam} Resources</h3>
                <div className="space-y-4">
                  {section.links.map((link, li) => (
                    <Link key={li} href={link.href} className="block p-4 bg-white rounded-xl hover:shadow-md transition-shadow group" data-testid={`link-resource-${section.country}-${li}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{link.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 ml-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <FAQSectionLanding faqs={config.faqs} />

        <section className="mt-16 text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-10 text-white" data-testid="section-bottom-cta">
          <h2 className="text-2xl font-bold mb-3">{t("pages.imagingSeoLanding.readyToStartStudying")}</h2>
          <p className="text-white/90 max-w-lg mx-auto mb-6">{t("pages.imagingSeoLanding.joinThousandsOfRadiographyStudents")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/medical-imaging" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors" data-testid="link-explore-academy">
              Explore the Academy <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/medical-imaging/blog" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors" data-testid="link-read-blog">
              Read Our Blog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SEOLandingPage;
