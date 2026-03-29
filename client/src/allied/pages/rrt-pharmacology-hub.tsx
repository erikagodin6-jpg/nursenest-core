import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";
import {
  Wind, Shield, Droplets, Syringe, Zap, Heart, AlertTriangle, Moon,
  Gauge, Pill, Baby, Monitor, Settings, ShieldAlert, Beaker,
  ChevronRight, ArrowRight, BookOpen, Brain, FileText, Star,
  Lock, CheckCircle2, GraduationCap, Sparkles, Clock
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { RRT_PHARMACOLOGY_PREVIEWS } from "@/data/lessons/rrt-pharmacology-previews";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, LucideIcon> = {
  Wind, Shield, Droplets, Syringe, Zap, Heart, AlertTriangle, Moon,
  Gauge, Pill, Baby, Monitor, Settings, ShieldAlert, Beaker
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  "Core Respiratory Medications": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", gradient: "from-blue-500 to-indigo-600" },
  "Airway Clearance Medications": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", gradient: "from-amber-500 to-orange-600" },
  "Antimicrobial Therapy": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", gradient: "from-emerald-500 to-teal-600" },
  "Cardiovascular-Pulmonary Medications": { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", gradient: "from-rose-500 to-pink-600" },
  "Critical Care Pharmacology": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", gradient: "from-purple-500 to-violet-600" },
  "Aerosol Therapy & Devices": { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", gradient: "from-cyan-500 to-sky-600" },
  "Clinical Drug Safety": { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", gradient: "from-red-500 to-rose-600" },
  "Specialty Populations": { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", gradient: "from-green-500 to-emerald-600" },
};

const CATEGORIES = [...new Set(RRT_PHARMACOLOGY_PREVIEWS.map(t => t.category))];

const FAQ_ITEMS = [
  { q: "What pharmacology topics are tested on the NBRC TMC exam?", a: "The NBRC TMC exam tests bronchodilators (beta-2 agonists, anticholinergics), corticosteroids (inhaled and systemic), mucolytics, aerosolized anti-infectives, adrenergic medications, sedation/paralytic agents, emergency medications, aerosol delivery devices, and drug side effects/interactions. Pharmacology questions appear across multiple NBRC domains." },
  { q: "How should I study respiratory pharmacology for the RRT exam?", a: "Start with the most commonly tested drug classes (bronchodilators and corticosteroids), then move to specialty topics. Focus on drug mechanisms, indications, side effects, and clinical scenarios. Use our practice questions to test application, not just memorization. Review the 'What Exam Writers Test' sections for each topic." },
  { q: "Is pharmacology content included in the CSE?", a: "Yes. The Clinical Simulation Exam (CSE) tests medication selection, dosing, administration technique, and monitoring in patient management scenarios. You may need to choose the correct bronchodilator, adjust ventilator medications, or recognize drug side effects as part of unfolding clinical cases." },
  { q: "How many pharmacology questions should I expect on the TMC?", a: "Approximately 15-20% of TMC questions involve pharmacology directly, and many more require pharmacology knowledge applied to clinical scenarios. Drug selection, dose calculation, side effect recognition, and medication administration are woven throughout the exam." },
];

export default function RrtPharmacologyHub() {
  const { t } = useI18n();
  const freeTopics = RRT_PHARMACOLOGY_PREVIEWS.filter(t => t.isFree);
  const premiumTopics = RRT_PHARMACOLOGY_PREVIEWS.filter(t => !t.isFree);

  return (
    <div data-testid="rrt-pharmacology-hub">
      <AlliedSEO
        title={t("allied.rrtPharmacologyHub.rrtPharmacologyExamPrepRespiratory")}
        description={t("allied.rrtPharmacologyHub.masterRespiratoryPharmacologyForThe")}
        keywords="RRT pharmacology exam prep, respiratory medications NBRC, bronchodilators TMC exam, corticosteroids respiratory therapy, mucolytics RRT, aerosol delivery devices, emergency medications respiratory, respiratory pharmacology study guide"
        canonicalPath="/allied-health/rrt/pharmacology"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "RRT Pharmacology Exam Prep",
          description: "Comprehensive respiratory pharmacology study guide covering 12+ topic categories for NBRC TMC and CSE certification exams.",
          provider: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
          hasPart: RRT_PHARMACOLOGY_PREVIEWS.map(t => ({
            "@type": "Article",
            name: t.title,
            url: `https://www.nursenest.ca/allied-health/rrt/pharmacology/${t.slug}`,
            description: t.overview.slice(0, 200) + "...",
          })),
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NurseNest Allied", item: "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", position: 2, name: "RRT Exam Prep", item: "https://www.nursenest.ca/allied-health/rrt" },
              { "@type": "ListItem", position: 3, name: "Pharmacology", item: "https://www.nursenest.ca/allied-health/rrt/pharmacology" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map(f => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label={t("allied.rrtPharmacologyHub.breadcrumb")} data-testid="breadcrumb-nav">
            <Link href="/allied-health" className="hover:text-teal-600" data-testid="breadcrumb-home">{t("allied.rrtPharmacologyHub.alliedHealth")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/rrt" className="hover:text-teal-600" data-testid="breadcrumb-rrt">{t("allied.rrtPharmacologyHub.rrtExamPrep")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{t("allied.rrtPharmacologyHub.pharmacology")}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4" data-testid="badge-pharmacology">
              <Pill className="w-4 h-4" />
              Respiratory Pharmacology
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-hub-title">
              Respiratory Pharmacology<br />
              <span className="text-blue-600">{t("allied.rrtPharmacologyHub.examPrepGuide")}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed" data-testid="text-hub-subtitle">
              Master every respiratory medication class tested on the NBRC TMC and CSE examinations. Each topic includes drug mechanisms, indications, side effects, clinical reassessment points, exam-writer focus areas, common student mistakes, and practice questions with detailed rationales.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{RRT_PHARMACOLOGY_PREVIEWS.length} Topic Guides</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{t("allied.rrtPharmacologyHub.highyieldExamFacts")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{t("allied.rrtPharmacologyHub.practiceQuestions")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{t("allied.rrtPharmacologyHub.clinicalPearls")}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/rrt/pharmacology/bronchodilators" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all" data-testid="button-start-studying">
                <BookOpen className="w-4 h-4" /> Start Studying
              </Link>
              <Link href="/allied-health/qbank?career=rrt" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl text-sm font-semibold border border-blue-200 hover:bg-blue-50 transition-all" data-testid="button-practice-questions">
                <Brain className="w-4 h-4" /> RRT Practice Questions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-free-topics-heading">{t("allied.rrtPharmacologyHub.freeTopicPreviews")}</h2>
        </div>
        <p className="text-gray-500 mb-8">{t("allied.rrtPharmacologyHub.startWithTheseFoundationalPharmacology")}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {freeTopics.map(topic => {
            const Icon = ICON_MAP[topic.icon] || Pill;
            const colors = CATEGORY_COLORS[topic.category] || CATEGORY_COLORS["Core Respiratory Medications"];
            return (
              <Link
                key={topic.slug}
                href={`/allied-health/rrt/pharmacology/${topic.slug}`}
                className={`group bg-white rounded-2xl border ${colors.border} p-6 hover:shadow-lg transition-all`}
                data-testid={`card-topic-${topic.slug}`}
              >
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2 ${colors.bg} ${colors.text}`}>{topic.category}</span>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors" data-testid={`text-topic-title-${topic.slug}`}>{topic.shortTitle}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{topic.overview.slice(0, 120)}...</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Free
                  </div>
                  <ArrowRight className={`w-4 h-4 ${colors.text} group-hover:translate-x-1 transition-transform`} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Star className="w-5 h-5 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-premium-topics-heading">{t("allied.rrtPharmacologyHub.premiumTopicGuides")}</h2>
        </div>
        <p className="text-gray-500 mb-8">{t("allied.rrtPharmacologyHub.unlockAllPharmacologyTopicGuides")}</p>

        {CATEGORIES.map(category => {
          const categoryTopics = premiumTopics.filter(t => t.category === category);
          if (categoryTopics.length === 0) return null;
          const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS["Core Respiratory Medications"];
          return (
            <div key={category} className="mb-10">
              <h3 className={`text-lg font-bold ${colors.text} mb-4`}>{category}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTopics.map(topic => {
                  const Icon = ICON_MAP[topic.icon] || Pill;
                  return (
                    <Link
                      key={topic.slug}
                      href={`/allied-health/rrt/pharmacology/${topic.slug}`}
                      className={`group bg-white rounded-2xl border ${colors.border} p-6 hover:shadow-lg transition-all`}
                      data-testid={`card-topic-${topic.slug}`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors" data-testid={`text-topic-title-${topic.slug}`}>{topic.shortTitle}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{topic.overview.slice(0, 120)}...</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Lock className="w-3 h-3" /> Premium
                        </div>
                        <ArrowRight className={`w-4 h-4 ${colors.text} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900" data-testid="text-study-tools-heading">{t("allied.rrtPharmacologyHub.pharmacologyStudyTools")}</h2>
          </div>
          <p className="text-gray-500 mb-8">{t("allied.rrtPharmacologyHub.interactiveStudyAidsDesignedFor")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Quick Sheets", desc: "High-yield side effects, bronchodilator vs controller comparison, and delivery device charts", href: "/allied-health/rrt/pharmacology/quick-sheets", icon: "Zap", color: "blue" },
              { title: "TMC Traps", desc: "18 commonly tested exam pitfalls with wrong vs correct answers and explanations", href: "/allied-health/rrt/pharmacology/traps", icon: "AlertTriangle", color: "red" },
              { title: "Mnemonics", desc: "12 proven memory aids including SLUDGE, MUDPILES, B2 SHAKES, and BRAND", href: "/allied-health/rrt/pharmacology/mnemonics", icon: "Brain", color: "purple" },
              { title: "One-Minute Review", desc: "16 rapid-fire drug cards with key facts, dosages, and exam tips", href: "/allied-health/rrt/pharmacology/one-minute-review", icon: "Clock", color: "amber" },
            ].map(tool => {
              const colorClasses: Record<string, { bg: string; text: string; border: string; badge: string }> = {
                blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
                red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", badge: "bg-red-100 text-red-700" },
                purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
                amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
              };
              const c = colorClasses[tool.color];
              const IconMap: Record<string, any> = { Zap, AlertTriangle, Brain, Clock };
              const ToolIcon = IconMap[tool.icon] || BookOpen;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={`group bg-white rounded-2xl border ${c.border} p-6 hover:shadow-lg transition-all`}
                  data-testid={`card-study-tool-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <ToolIcon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{tool.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <span className={`px-2 py-0.5 rounded ${c.badge}`}>{t("allied.rrtPharmacologyHub.freePreview")}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${c.text} ml-auto group-hover:translate-x-1 transition-transform`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center" data-testid="text-study-approach">{t("allied.rrtPharmacologyHub.howToStudyRespiratoryPharmacology")}</h2>
          <p className="text-gray-500 mb-10 text-center max-w-2xl mx-auto">{t("allied.rrtPharmacologyHub.followThisApproachToMaster")}</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Learn the Classes", desc: "Start with the two most tested drug classes: bronchodilators (SABAs, LABAs, SAMAs, LAMAs) and corticosteroids (ICS and systemic). Know mechanisms, onset, and duration." },
              { step: "2", title: "Master Side Effects", desc: "Side effects and contraindications are the most commonly tested pharmacology concepts. Focus on beta-2 tachycardia, ICS candidiasis, and drug interactions." },
              { step: "3", title: "Device Selection", desc: "Know when to use MDI vs DPI vs SVN. Understand ventilator aerosol delivery, spacer benefits, and age-appropriate device selection." },
              { step: "4", title: "Practice Questions", desc: "Apply your knowledge with clinical scenario questions. The NBRC tests medication application, not just recall." },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-blue-700 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("allied.rrtPharmacologyHub.relatedRrtStudyResources")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Pharm Flashcards", href: "/allied-health/rrt/flashcards", icon: Brain },
              { label: "RRT Question Bank", href: "/allied-health/qbank?career=rrt", icon: BookOpen },
              { label: "RRT Mock Exams", href: "/allied-health/rrt/mock-exams", icon: FileText },
              { label: "RRT Study Plan", href: "/allied-health/rrt/study-plan", icon: GraduationCap },
            ].map(resource => (
              <Link key={resource.label} href={resource.href} className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all" data-testid={`link-resource-${resource.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <resource.icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{resource.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="pharmacology-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.rrtPharmacologyHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden group" data-testid={`faq-item-${i}`}>
                <summary className="px-6 py-4 cursor-pointer text-base font-medium text-gray-900 hover:text-blue-700 transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl font-bold mb-3" data-testid="text-cta-heading">{t("allied.rrtPharmacologyHub.readyToMasterRespiratoryPharmacology")}</h2>
            <p className="text-blue-100 mb-6">{t("allied.rrtPharmacologyHub.unlockAll12PharmacologyTopic")}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl text-base font-semibold hover:bg-blue-50 transition-colors" data-testid="button-cta-pricing">
                View Plans <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/allied-health/rrt" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500/30 text-white rounded-xl text-base font-semibold hover:bg-blue-500/40 transition-colors border border-blue-400/30" data-testid="button-back-to-rrt">
                Back to RRT Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
