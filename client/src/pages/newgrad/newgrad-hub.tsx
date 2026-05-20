import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useNewGradEntitlements } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { INTERVIEW_QUESTION_BANK } from "@/data/newgrad/premium-toolkit";
import { WORKPLACE_SCENARIOS, WORKPLACE_SCENARIO_CATEGORIES } from "@/data/newgrad/workplace-scenarios";
import {
  ArrowRight, BookOpen, FileText, Brain, GraduationCap,
  CheckCircle2, ChevronRight, Briefcase, Heart, Shield, Users,
  AlertTriangle, MessageSquare, Award, Target, Lightbulb,
  Star, TrendingUp, DollarSign, Flame, Sparkles, Lock,
  Stethoscope, ClipboardList, Compass, LayoutGrid,
  Timer, Play, BarChart3, Zap, HelpCircle
} from "lucide-react";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  pink: "bg-pink-50 text-pink-600 border-pink-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  orange: "bg-orange-50 text-orange-600 border-orange-100",
  green: "bg-green-50 text-green-600 border-green-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
  violet: "bg-violet-50 text-violet-600 border-violet-100",
};

const ICON_BG_MAP: Record<string, string> = {
  blue: "bg-blue-100",
  indigo: "bg-indigo-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
  emerald: "bg-emerald-100",
  orange: "bg-orange-100",
  green: "bg-green-100",
  amber: "bg-amber-100",
  teal: "bg-teal-100",
  violet: "bg-violet-100",
};

const interviewQuestionCount = INTERVIEW_QUESTION_BANK.length;
const scenarioCount = WORKPLACE_SCENARIOS.length;
const simulationSetCount = WORKPLACE_SCENARIO_CATEGORIES.length;

export default function NewGradHub() {
  const { hasAnyPremium: hasNewGradAccess } = useNewGradEntitlements();
  const { t } = useI18n();

  const CATEGORIES = [
    { icon: Compass, titleKey: "newGrad.hub.cat.transitionTitle", descKey: "newGrad.hub.cat.transitionDesc", href: "/newgrad/survival-guide", color: "teal", free: true },
    { icon: BookOpen, titleKey: "newGrad.hub.cat.guidesTitle", descKey: "newGrad.hub.cat.guidesDesc", href: "/newgrad/guides", color: "blue", free: true },
    { icon: MessageSquare, titleKey: "newGrad.hub.cat.interviewTitle", descKey: "newGrad.hub.cat.interviewDesc", href: "/newgrad/interview", color: "purple", free: false },
    { icon: FileText, titleKey: "newGrad.hub.cat.resumeTitle", descKey: "newGrad.hub.cat.resumeDesc", href: "/newgrad/resume", color: "pink", free: false },
    { icon: Users, titleKey: "newGrad.hub.cat.workplaceTitle", descKey: "newGrad.hub.cat.workplaceDesc", href: "/newgrad/workplace", color: "emerald", free: true },
    { icon: ClipboardList, titleKey: "newGrad.hub.cat.scenariosTitle", descKey: "newGrad.hub.cat.scenariosDesc", href: "/newgrad/scenarios", color: "teal", free: false },
    { icon: LayoutGrid, titleKey: "newGrad.hub.cat.unitTitle", descKey: "newGrad.hub.cat.unitDesc", href: "/newgrad/guides", color: "indigo", free: true },
    { icon: Flame, titleKey: "newGrad.hub.cat.burnoutTitle", descKey: "newGrad.hub.cat.burnoutDesc", href: "/newgrad/burnout", color: "orange", free: true },
    { icon: TrendingUp, titleKey: "newGrad.hub.cat.careerTitle", descKey: "newGrad.hub.cat.careerDesc", href: "/newgrad/career", color: "indigo", free: true },
    { icon: DollarSign, titleKey: "newGrad.hub.cat.salaryTitle", descKey: "newGrad.hub.cat.salaryDesc", href: "/newgrad/salary", color: "green", free: false },
    { icon: Award, titleKey: "newGrad.hub.cat.certsTitle", descKey: "newGrad.hub.cat.certsDesc", href: "/newgrad/certifications", color: "amber", free: false },
  ];

  const PREMIUM_FEATURES = [
    { icon: FileText, titleKey: "newGrad.hub.premiumFeat1Title", descKey: "newGrad.hub.premiumFeat1Desc" },
    { icon: MessageSquare, titleKey: "newGrad.hub.premiumFeat2Title", descKey: "newGrad.hub.premiumFeat2Desc" },
    { icon: DollarSign, titleKey: "newGrad.hub.premiumFeat3Title", descKey: "newGrad.hub.premiumFeat3Desc" },
    { icon: Award, titleKey: "newGrad.hub.premiumFeat4Title", descKey: "newGrad.hub.premiumFeat4Desc" },
  ];

  const TESTIMONIALS = [
    { nameKey: "newGrad.hub.testimonial1Name", roleKey: "newGrad.hub.testimonial1Role", contentKey: "newGrad.hub.testimonial1Content", rating: 5 },
    { nameKey: "newGrad.hub.testimonial2Name", roleKey: "newGrad.hub.testimonial2Role", contentKey: "newGrad.hub.testimonial2Content", rating: 5 },
    { nameKey: "newGrad.hub.testimonial3Name", roleKey: "newGrad.hub.testimonial3Role", contentKey: "newGrad.hub.testimonial3Content", rating: 5 },
  ];

  const ECOSYSTEM_LINKS = [
    { titleKey: "newGrad.hub.eco1Title", descKey: "newGrad.hub.eco1Desc", href: "/newgrad/clinical-references", icon: Stethoscope },
    { titleKey: "newGrad.hub.eco2Title", descKey: "newGrad.hub.eco2Desc", href: "/newgrad/certifications", icon: Award },
    { titleKey: "newGrad.hub.eco3Title", descKey: "newGrad.hub.eco3Desc", href: "/newgrad/survival-guide", icon: Shield },
    { titleKey: "newGrad.hub.eco4Title", descKey: "newGrad.hub.eco4Desc", href: "/newgrad/professional-development", icon: TrendingUp },
    { titleKey: "newGrad.hub.eco5Title", descKey: "newGrad.hub.eco5Desc", href: "/new-grad/nursing", icon: GraduationCap },
    { titleKey: "newGrad.hub.eco6Title", descKey: "newGrad.hub.eco6Desc", href: "/exam-prep", icon: Brain },
  ];

  const FAQ_DATA = [
    { questionKey: "newGrad.hub.faq1Q", answerKey: "newGrad.hub.faq1A" },
    { questionKey: "newGrad.hub.faq2Q", answerKey: "newGrad.hub.faq2A" },
    { questionKey: "newGrad.hub.faq3Q", answerKey: "newGrad.hub.faq3A" },
    { questionKey: "newGrad.hub.faq4Q", answerKey: "newGrad.hub.faq4A" },
    { question: "How many practice questions are available?", answer: `The New Grad Practice System includes ${interviewQuestionCount}+ interview questions across ${new Set(INTERVIEW_QUESTION_BANK.map(q => q.category)).size} categories, ${scenarioCount} workplace simulation scenarios, ${simulationSetCount} structured simulation sets, and timed mock interview exams. Free users can access preview questions in each mode.` },
    { question: "What practice modes are available?", answer: "We offer four practice modes: Interview Question Bank (browse and study individual questions), Scenario Practice (workplace readiness scenarios), Mock Interview (timed exam-style sessions with scoring), and Workplace Simulation Sets (structured sequential walkthroughs organized by skill area)." },
    { question: "Are mock interviews and simulation sets free?", answer: "Free users can access preview questions in the Interview Question Bank and Scenario Practice modes. Timed Mock Interviews and full Workplace Simulation Sets (including premium scenarios) require the New Grad Toolkit subscription. This ensures you get the full, structured practice experience." },
  ];

  const faqForStructuredData = FAQ_DATA.map(f => {
    if ('questionKey' in f) return { question: t(f.questionKey), answer: t(f.answerKey) };
    return { question: f.question, answer: f.answer };
  });
  const faqStructuredData = buildFaqStructuredData(faqForStructuredData);

  const hubStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "New Grad Career Hub - NurseNest",
    "description": t("newGrad.hub.seoDescription"),
    "url": "https://www.nursenest.ca/newgrad",
    "isPartOf": {
      "@type": "WebSite",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
  };

  const FREE_CONTENT = [
    { titleKey: "newGrad.hub.freeItem1Title", descKey: "newGrad.hub.freeItem1Desc", href: "/newgrad/survival-guide" },
    { titleKey: "newGrad.hub.freeItem2Title", descKey: "newGrad.hub.freeItem2Desc", href: "/newgrad/guides" },
    { titleKey: "newGrad.hub.freeItem3Title", descKey: "newGrad.hub.freeItem3Desc", href: "/newgrad/workplace" },
    { titleKey: "newGrad.hub.freeItem4Title", descKey: "newGrad.hub.freeItem4Desc", href: "/newgrad/burnout" },
    { titleKey: "newGrad.hub.freeItem5Title", descKey: "newGrad.hub.freeItem5Desc", href: "/newgrad/career" },
    { titleKey: "newGrad.hub.freeItem6Title", descKey: "newGrad.hub.freeItem6Desc", href: "/newgrad/clinical-references" },
    { titleKey: "newGrad.hub.freeItem7Title", descKey: "newGrad.hub.freeItem7Desc", href: "/newgrad/workplace" },
    { titleKey: "newGrad.hub.freeItem8Title", descKey: "newGrad.hub.freeItem8Desc", href: "/newgrad/professional-development" },
  ];

  const STRUGGLE_POINTS = [
    { icon: AlertTriangle, title: "Interview Anxiety", desc: "65% of new grads report feeling unprepared for behavioral and clinical interview questions." },
    { icon: ClipboardList, title: "Prioritization Paralysis", desc: "Knowing how to triage 4+ patients with competing needs when you've only practiced with 1–2 in clinicals." },
    { icon: MessageSquare, title: "Communication Gaps", desc: "Calling physicians at 3 AM, giving shift report, and navigating difficult team dynamics with no practice." },
    { icon: Shield, title: "Imposter Syndrome", desc: "70% of new graduates experience imposter syndrome within their first year of practice." },
  ];

  const PREPARES_YOU = [
    { icon: MessageSquare, title: "Real Interview Questions", desc: `${interviewQuestionCount}+ categorized questions with STAR-format sample answers and expert tips.` },
    { icon: Target, title: "Workplace Simulations", desc: `${scenarioCount} clinical and professional scenarios covering prioritization, delegation, and team dynamics.` },
    { icon: Timer, title: "Timed Mock Interviews", desc: "Simulate real interview conditions with randomized questions, self-scoring, and performance review." },
    { icon: BarChart3, title: "Structured Practice Sets", desc: `${simulationSetCount} simulation sets organized by skill area for sequential, focused practice.` },
  ];

  const PRACTICE_MODES = [
    { icon: BookOpen, title: "Interview Question Bank", desc: `Browse ${interviewQuestionCount}+ questions by category. Study sample answers and expert tips at your own pace.`, href: "/newgrad/interview", color: "purple", free: true },
    { icon: Target, title: "Scenario Practice", desc: `Work through ${scenarioCount} workplace scenarios. Reveal expert responses and key principles for each.`, href: "/newgrad/scenarios", color: "teal", free: true },
    { icon: Timer, title: "Mock Interview", desc: "Timed exam-style practice with randomized questions, self-scoring, and detailed review.", href: "/newgrad/mock-interview", color: "violet", free: false },
    { icon: Play, title: "Simulation Sets", desc: `${simulationSetCount} structured walkthroughs organized by skill area with sequential progression.`, href: "/newgrad/simulation-sets", color: "blue", free: false },
  ];

  return (
    <div data-testid="newgrad-hub-page">
      <Navigation />
      <SEO
        title={t("newGrad.hub.seoTitle")}
        description={t("newGrad.hub.seoDescription")}
        keywords="new grad nurse career hub, new graduate nurse resources, nursing career development, nurse interview prep, nursing resume builder, new nurse first year, nursing salary negotiation, transition to practice nursing, new grad nurse confidence, mock nursing interview, nursing workplace simulation"
        canonicalPath="/newgrad"
        structuredData={hubStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
        ]}
      />

      <section className="relative py-16 sm:py-24 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-indigo-100/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{t("newGrad.common.newGradCareerHub")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700" data-testid="badge-career-hub">
              <GraduationCap className="w-4 h-4" />
              {t("newGrad.hub.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-hero-title">
              Land Your First Nursing Job with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t("pages.newgrad.newgradHub.confidence")}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed" data-testid="text-hero-subtitle">
              Practice real interview questions, build workplace confidence, and prepare for clinical scenarios — everything you need to go from graduation to your first day on the unit.
            </p>
            <p className="text-base text-gray-500 mb-8" data-testid="text-hero-detail">
              {interviewQuestionCount}+ interview questions · {scenarioCount} workplace simulations · {simulationSetCount} structured practice sets · Timed mock interviews with scoring
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-start-practicing">
                Start Practicing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/newgrad/mock-interview" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200" data-testid="button-mock-interview">
                <Timer className="w-4 h-4" /> Mock Interview
              </Link>
              {!hasNewGradAccess && (
                <Link href="/newgrad#premium" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors border border-indigo-200" data-testid="button-view-toolkit">
                  <Sparkles className="w-4 h-4" /> {t("newGrad.hub.viewToolkit")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-pathways">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-pathways-title">Choose Your Pathway</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">New grad resources tailored to your profession. Select your path to get started.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link href="/new-grad/nursing" className="group" data-testid="card-pathway-nursing">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 hover:shadow-lg hover:border-blue-300 transition-all h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Nursing</h3>
                    <p className="text-xs text-gray-500">RPN/LVN & RN</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Career guides, clinical tips, first year survival resources, and exam prep for new nursing graduates.</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Explore Nursing Hub <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href="/allied-health" className="group" data-testid="card-pathway-allied-health">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-6 hover:shadow-lg hover:border-teal-300 transition-all h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Allied Health</h3>
                    <p className="text-xs text-gray-500">RRT, Paramedic, MLT, Imaging & more</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Exam prep, career resources, and first year guides for respiratory therapy, paramedicine, lab tech, and more.</p>
                <span className="inline-flex items-center gap-1 text-sm text-teal-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Explore Allied Health <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-questions"><div className="text-2xl font-bold text-gray-900">{interviewQuestionCount}+</div><div className="text-sm text-gray-500">{t("pages.newgrad.newgradHub.interviewQuestions")}</div></div>
            <div data-testid="stat-scenarios"><div className="text-2xl font-bold text-gray-900">{scenarioCount}</div><div className="text-sm text-gray-500">{t("pages.newgrad.newgradHub.workplaceScenarios")}</div></div>
            <div data-testid="stat-simulations"><div className="text-2xl font-bold text-gray-900">{simulationSetCount}</div><div className="text-sm text-gray-500">{t("pages.newgrad.newgradHub.simulationSets")}</div></div>
            <div data-testid="stat-categories"><div className="text-2xl font-bold text-gray-900">{new Set(INTERVIEW_QUESTION_BANK.map(q => q.category)).size}</div><div className="text-sm text-gray-500">{t("pages.newgrad.newgradHub.questionCategories")}</div></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-struggles">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("pages.newgrad.newgradHub.whatNewNursesStruggleWith")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newgrad.newgradHub.theseAreTheRealChallenges")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STRUGGLE_POINTS.map((point, i) => {
              const PointIcon = point.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-struggle-${i}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <PointIcon className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{point.title}</h3>
                      <p className="text-sm text-gray-500">{point.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-prepares-you">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("pages.newgrad.newgradHub.whatThisBankPreparesYou")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newgrad.newgradHub.buildTheSkillsThatInterviewers")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PREPARES_YOU.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-prepares-${i}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <ItemIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20" data-testid="section-practice-system">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-700">
              <Zap className="w-4 h-4" /> Practice System
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("pages.newgrad.newgradHub.howThePracticeSystemWorks")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newgrad.newgradHub.fourPracticeModesDesignedTo")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PRACTICE_MODES.map((mode, i) => {
              const ModeIcon = mode.icon;
              return (
                <Link key={i} href={mode.href} className="group" data-testid={`card-practice-mode-${i}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all h-full">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${ICON_BG_MAP[mode.color]} flex items-center justify-center shrink-0`}>
                        <ModeIcon className={`w-5 h-5 ${COLOR_MAP[mode.color].split(' ')[1]}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{mode.title}</h3>
                          {mode.free ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">{t("pages.newgrad.newgradHub.freePreview")}</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{t("pages.newgrad.newgradHub.premium")}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{mode.desc}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="text-xs text-blue-600 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Start practicing <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-categories-title">{t("newGrad.hub.categoriesTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("newGrad.hub.categoriesDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {CATEGORIES.map((cat, i) => {
              const CatIcon = cat.icon;
              return (
                <Link key={i} href={cat.href} className="group" data-testid={`card-category-${i}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all h-full flex flex-col">
                    <div className={`w-10 h-10 rounded-xl ${ICON_BG_MAP[cat.color]} flex items-center justify-center mb-3`}>
                      <CatIcon className={`w-5 h-5 ${COLOR_MAP[cat.color].split(' ')[1]}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-blue-700 transition-colors">{t(cat.titleKey)}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex-1">{t(cat.descKey)}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                        {t("newGrad.common.explore")} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      {cat.free ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">{t("newGrad.common.free")}</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{t("newGrad.common.freePlusPremium")}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-free-content">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-green-100 text-green-700">
              <CheckCircle2 className="w-4 h-4" /> {t("newGrad.hub.alwaysFreeBadge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("newGrad.hub.freeTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("newGrad.hub.freeDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FREE_CONTENT.map((item, i) => (
              <Link key={i} href={item.href} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group" data-testid={`link-free-content-${i}`}>
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 block">{t(item.titleKey)}</span>
                  <span className="text-xs text-gray-500">{t(item.descKey)}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50" id="premium" data-testid="section-premium-toolkit">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
              <Sparkles className="w-4 h-4" /> {t("newGrad.hub.premiumBadge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("newGrad.hub.premiumTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("newGrad.hub.premiumDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {PREMIUM_FEATURES.map((feat, i) => {
              const FeatIcon = feat.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-indigo-100 p-6 hover:shadow-md transition-all" data-testid={`card-premium-feature-${i}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <FeatIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t(feat.titleKey)}</h3>
                      <p className="text-sm text-gray-500">{t(feat.descKey)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!hasNewGradAccess && (
            <div className="text-center">
              <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200" data-testid="button-upgrade-toolkit">
                <Lock className="w-4 h-4" /> {t("newGrad.hub.unlockToolkit")} <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">{t("newGrad.hub.moneyBack")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16" data-testid="section-ecosystem">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-ecosystem-title">{t("newGrad.hub.ecosystemTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("newGrad.hub.ecosystemDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ECOSYSTEM_LINKS.map((link, i) => {
              const LinkIcon = link.icon;
              return (
                <Link key={i} href={link.href} className="group" data-testid={`card-ecosystem-${i}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors mb-1">{t(link.titleKey)}</h3>
                        <p className="text-xs text-gray-500">{t(link.descKey)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-testimonials">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("newGrad.hub.testimonialsTitle")}</h2>
            <p className="text-gray-600">{t("newGrad.hub.testimonialsDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-testimonial-${i}`}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">"{t(testimonial.contentKey)}"</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t(testimonial.nameKey)}</p>
                  <p className="text-xs text-gray-500">{t(testimonial.roleKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("newGrad.hub.faqTitle")}</h2>
          </div>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-faq-${i}`}>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  {'questionKey' in faq ? t(faq.questionKey) : faq.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {'answerKey' in faq ? t(faq.answerKey) : faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-teal-50 via-emerald-50/50 to-cyan-50" data-testid="section-career-step">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" data-testid="text-career-step-title">{t("newGrad.hub.careerStepTitle")}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t("newGrad.hub.careerStepDesc")}
          </p>
          <a
            href="https://applynest.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
            data-testid="button-explore-applynest"
          >
            {t("newGrad.hub.exploreApplyNest")} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("newGrad.hub.bottomCtaTitle")}</h2>
          <p className="text-blue-100 mb-8">{t("newGrad.hub.bottomCtaDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors" data-testid="button-bottom-practice">
              Start Practicing
            </Link>
            <Link href="/newgrad/mock-interview" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-bottom-mock">
              <Timer className="w-4 h-4" /> Mock Interview <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
