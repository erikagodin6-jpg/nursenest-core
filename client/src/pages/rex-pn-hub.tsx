import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import HeroFeatureStrip from "@/components/hero-feature-strip";
import HeroTrustIndicator from "@/components/hero-trust-indicator";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { LocaleLink } from "@/lib/LocaleLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  FileText,
  Target,
  BarChart3,
  Shield,
  Stethoscope,
  CheckCircle,
  Layers,
  Activity,
  Scale,
  GraduationCap,
  AlertCircle,
  Calculator,
  ClipboardCheck,
  ChevronRight,
} from "lucide-react";
import { useLocation } from "wouter";
import { ComparisonTable, DifferentiatorCTA } from "@/components/competitive-differentiation";

import { useI18n } from "@/lib/i18n";
const domains = [
  { name: "Foundations of Practice", weight: 36, color: "bg-blue-500" },
  { name: "Collaborative Practice", weight: 30, color: "bg-emerald-500" },
  { name: "Professional Practice", weight: 16, color: "bg-purple-500" },
  { name: "Ethical Practice", weight: 10, color: "bg-amber-500" },
  { name: "Legal Practice", weight: 8, color: "bg-red-500" },
];

const questionFormats = [
  {
    title: "Multiple Choice (MCQ)",
    description: "Single best answer from four options. The most common format on the REx-PN, testing application of clinical knowledge to patient scenarios.",
    icon: CheckCircle,
  },
  {
    title: "Select All That Apply (SATA)",
    description: "Identify all correct responses from a list. No partial credit is awarded. You must select every correct option and no incorrect options.",
    icon: ClipboardCheck,
  },
  {
    title: "Numeric Fill-In (Dosage Calculations)",
    description: "Calculate medication dosages, IV flow rates, or fluid requirements and enter a numerical answer. An on-screen calculator is provided.",
    icon: Calculator,
  },
  {
    title: "Graphic / Exhibit Items",
    description: "Interpret images, diagrams, ECG strips, or clinical exhibits to answer questions about assessment findings or interventions.",
    icon: BarChart3,
  },
  {
    title: "Bowtie Items",
    description: "Connect conditions to appropriate nursing actions and monitoring parameters. Tests integrated clinical reasoning across the care continuum.",
    icon: Target,
  },
];

const toolkitCards = [
  {
    title: "Test Bank",
    description: "Practice with hundreds of REx-PN-aligned questions organized by domain. Detailed rationales explain why each answer is correct or incorrect.",
    icon: BookOpen,
    href: "/free-practice",
    cta: "Start Practising",
  },
  {
    title: "Mock Exams (CAT)",
    description: "Simulate the real exam experience with computer adaptive testing. Questions adjust in difficulty based on your performance, just like exam day.",
    icon: Target,
    href: "/mock-exams",
    cta: "Take a Mock Exam",
  },
  {
    title: "Study Planner",
    description: "Follow a structured 10-week study plan designed for the REx-PN blueprint. Track your progress across all content domains.",
    icon: Layers,
    href: "/rex-pn/strategies",
    cta: "View Study Plan",
  },
  {
    title: "Readiness Assessment",
    description: "Take a quick 25-question diagnostic to identify your strengths and areas that need more focus before exam day.",
    icon: Activity,
    href: "/mock-exams",
    cta: "Check Readiness",
  },
  {
    title: "Flashcards",
    description: "Review key concepts, medications, lab values, and nursing interventions with spaced repetition flashcard decks.",
    icon: Brain,
    href: "/flashcards",
    cta: "Study Flashcards",
  },
];

const subPages = [
  { title: "Exam Format and Structure", href: "/rex-pn/exam-format", description: "Question types, CAT algorithm, timing, and testing environment" },
  { title: "Test-Taking Strategies", href: "/rex-pn/strategies", description: "Process of elimination, safety-first thinking, pacing tips" },
  { title: "Wellness During Preparation", href: "/rex-pn/wellness", description: "Sleep, nutrition, exercise, and mental health support" },
  { title: "Practice Tests", href: "/rex-pn/practice-tests", description: "Full-length CAT simulations and domain-specific question sets" },
];

const contentHubPages = [
  { title: "Practice Questions", href: "/rex-pn/practice-questions", description: "CAT-style questions with rationales across all content domains", icon: Target },
  { title: "Fundamentals of Nursing", href: "/rex-pn/fundamentals", description: "Vital signs, asepsis, therapeutic communication, medication safety", icon: BookOpen },
  { title: "Pharmacology Review", href: "/rex-pn/pharmacology", description: "Drug classifications, mechanisms, side effects, dosage calculations", icon: Shield },
  { title: "Safety & Infection Control", href: "/rex-pn/safety-and-infection-control", description: "Isolation precautions, fall prevention, restraints, infection prevention", icon: AlertCircle },
  { title: "Clinical Judgment", href: "/rex-pn/clinical-judgment", description: "NCSBN CJMM framework, prioritization, clinical decision-making", icon: Brain },
  { title: "Exam Tips", href: "/rex-pn/exam-tips", description: "CAT strategies, time management, test-day preparation tips", icon: GraduationCap },
  { title: "10-Week Study Plan", href: "/rex-pn/study-plan", description: "Structured weekly goals covering all content domains", icon: Layers },
  { title: "How to Pass the REx-PN", href: "/rex-pn/strategy/how-to-pass-rex-pn", description: "Evidence-based strategies to pass on your first attempt", icon: CheckCircle },
  { title: "Prioritization Tips", href: "/rex-pn/strategy/prioritization-tips", description: "ABCs, Maslow's hierarchy, delegation principles", icon: ClipboardCheck },
  { title: "Infection Control Study Guide", href: "/rex-pn/strategy/infection-control-study-guide", description: "Chain of infection, PPE, isolation precautions", icon: Activity },
];

const conditionGuides = [
  { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure" },
  { title: "Diabetes, DKA & HHS", href: "/rex-pn/conditions/diabetes-dka-hhs" },
  { title: "COPD", href: "/rex-pn/conditions/copd" },
  { title: "Pneumonia", href: "/rex-pn/conditions/pneumonia" },
  { title: "Sepsis", href: "/rex-pn/conditions/sepsis" },
  { title: "Hypertension", href: "/rex-pn/conditions/hypertension" },
  { title: "MI / ACS", href: "/rex-pn/conditions/mi-acs" },
  { title: "Stroke (CVA)", href: "/rex-pn/conditions/stroke" },
  { title: "UTI", href: "/rex-pn/conditions/uti" },
  { title: "DVT / PE", href: "/rex-pn/conditions/dvt-pe" },
  { title: "Anemia", href: "/rex-pn/conditions/anemia" },
  { title: "Wound Infection", href: "/rex-pn/conditions/wound-infection" },
  { title: "Dehydration", href: "/rex-pn/conditions/dehydration" },
  { title: "Hypoglycemia", href: "/rex-pn/conditions/hypoglycemia" },
  { title: "Seizures", href: "/rex-pn/conditions/seizures" },
];

const labValueGuides = [
  { title: "Potassium (K+)", href: "/rex-pn/lab-values/potassium" },
  { title: "Sodium (Na+)", href: "/rex-pn/lab-values/sodium" },
  { title: "Blood Glucose", href: "/rex-pn/lab-values/glucose" },
  { title: "BUN / Creatinine", href: "/rex-pn/lab-values/bun-creatinine" },
  { title: "CBC / WBC", href: "/rex-pn/lab-values/cbc-wbc" },
  { title: "Hemoglobin / Hematocrit", href: "/rex-pn/lab-values/hemoglobin-hematocrit" },
  { title: "ABG Interpretation", href: "/rex-pn/lab-values/abgs" },
  { title: "Calcium (Ca2+)", href: "/rex-pn/lab-values/calcium" },
  { title: "Magnesium (Mg2+)", href: "/rex-pn/lab-values/magnesium" },
  { title: "INR / PT", href: "/rex-pn/lab-values/inr-pt" },
];

const medicationGuides = [
  { title: "Furosemide (Lasix)", href: "/rex-pn/medications/furosemide" },
  { title: "Insulin Types", href: "/rex-pn/medications/insulin" },
  { title: "Metoprolol", href: "/rex-pn/medications/metoprolol" },
  { title: "Lisinopril", href: "/rex-pn/medications/lisinopril" },
  { title: "Metformin", href: "/rex-pn/medications/metformin" },
  { title: "Acetaminophen", href: "/rex-pn/medications/acetaminophen" },
  { title: "Warfarin", href: "/rex-pn/medications/warfarin" },
  { title: "Heparin", href: "/rex-pn/medications/heparin" },
  { title: "Digoxin", href: "/rex-pn/medications/digoxin" },
  { title: "Albuterol", href: "/rex-pn/medications/albuterol" },
  { title: "Levothyroxine", href: "/rex-pn/medications/levothyroxine" },
  { title: "Omeprazole", href: "/rex-pn/medications/omeprazole" },
];

const comparisonGuides = [
  { title: "DKA vs HHS", href: "/rex-pn/compare/dka-vs-hhs" },
  { title: "Crohn's vs Ulcerative Colitis", href: "/rex-pn/compare/crohns-vs-uc" },
  { title: "Stable vs Unstable Angina", href: "/rex-pn/compare/stable-vs-unstable-angina" },
  { title: "Type 1 vs Type 2 Diabetes", href: "/rex-pn/compare/type-1-vs-type-2-diabetes" },
  { title: "DVT vs PE", href: "/rex-pn/compare/dvt-vs-pe" },
  { title: "Hypoglycemia vs Hyperglycemia", href: "/rex-pn/compare/hypoglycemia-vs-hyperglycemia" },
];

const strategyGuides = [
  { title: "How to Pass the REx-PN", href: "/rex-pn/strategy/how-to-pass-rex-pn" },
  { title: "Pharmacology Fundamentals", href: "/rex-pn/strategy/pharmacology-fundamentals" },
];

export default function RexPnHub() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.rexPnHub.rexpnExamPrepCanadianPractical")}
        description={t("pages.rexPnHub.prepareForTheRexpnRegulatory")}
        keywords="REx-PN exam prep, REx-PN practice questions, Canadian practical nurse exam, RPN licensing exam, REx-PN CAT exam, RPN question bank, REx-PN mock exam, REx-PN study guide, Canadian nursing exam"
        canonicalPath="/rex-pn"
      />
      <Navigation />

      <main className="flex-grow">
        <section className="relative overflow-hidden py-20 lg:py-28" data-testid="section-rex-pn-hero">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav items={[{ name: "Home", url: "https://www.nursenest.ca/" }, { name: "REx-PN Exam Prep", url: "https://www.nursenest.ca/rex-pn" }]} />

            <div className="text-center max-w-3xl mx-auto space-y-6 mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-medium text-gray-600">{t("pages.rexPnHub.canadianPracticalNurseLicensingExam")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]" data-testid="text-rex-pn-heading">
                Retain More. Stress Less. Pass the REx-PN.
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" data-testid="text-rex-pn-subtitle">
                Our retention-focused REx-PN exam prep uses active recall, spaced repetition, and clinical scenarios to help Canadian RPN candidates build lasting knowledge and pass with confidence.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4 px-4 sm:px-0">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 transition-[transform,box-shadow] hover:-translate-y-1 text-white"
                  onClick={() => setLocation("/free-practice")}
                  data-testid="button-rex-pn-start-diagnostic"
                >
                  Start Diagnostic
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full border-2 border-red-200 hover:bg-red-50 hover:border-red-400 text-gray-700 bg-white/50"
                  onClick={() => setLocation("/mock-exams")}
                  data-testid="button-rex-pn-start-cat"
                >
                  <Target className="mr-2 w-5 h-5 text-red-500" />
                  Start CAT Practice
                </Button>
              </div>

              <p className="text-xs text-gray-500 pt-2">{t("pages.rexPnHub.noCreditCardRequiredStart")}</p>
            </div>
          </div>
        </section>

        <HeroFeatureStrip />
        <HeroTrustIndicator />

        <section className="py-16 bg-white border-t border-gray-100" data-testid="section-exam-overview">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-4">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{t("pages.rexPnHub.examOverview")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-overview-heading">
                What Is the REx-PN?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The Regulatory Exam - Practical Nurse is the Canadian licensing examination for practical nurse candidates seeking registration as an RPN.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Questions", value: "90-150", detail: "Computer selects based on performance", icon: FileText },
                { label: "Time Limit", value: "4 Hours", detail: "Maximum testing time allowed", icon: Clock },
                { label: "Format", value: "Computer Adaptive", detail: "Difficulty adjusts to your level", icon: Activity },
                { label: "Result", value: "Pass / Fail", detail: "Criterion-referenced passing standard", icon: Shield },
              ].map((item, i) => (
                <Card key={i} className="border border-gray-100 text-center" data-testid={`card-overview-${i}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900" data-testid={`text-overview-value-${i}`}>{item.value}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-2">{item.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100" data-testid="section-cat-explanation">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("pages.rexPnHub.howComputerAdaptiveTestingCat")}</h3>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  The REx-PN uses Computer Adaptive Testing, which tailors the difficulty of questions to your ability level in real time. After each question you answer, the computer recalculates your estimated ability and selects the next question accordingly.
                </p>
                <p>
                  If you answer correctly, the next question is generally harder. If you answer incorrectly, the next question is generally easier. The exam continues until the algorithm is 95% confident you are above or below the passing standard, or until you reach the maximum of 150 questions.
                </p>
                <p>
                  This means every candidate receives a unique set of questions. The number of questions you receive does not indicate whether you passed or failed -- it reflects how quickly the algorithm reached a confident decision about your ability level.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100" data-testid="section-blueprint-domains">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 mb-4">
                <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">{t("pages.rexPnHub.contentBlueprint")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-domains-heading">
                REx-PN Blueprint Domains
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The exam is organized into five competency domains. Allocate your study time proportionally to each domain's weight.
              </p>
            </div>

            <div className="space-y-5 max-w-3xl mx-auto">
              {domains.map((domain, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" data-testid={`domain-bar-${i}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 text-sm" data-testid={`text-domain-name-${i}`}>{domain.name}</span>
                    <span className="font-bold text-gray-900 text-lg" data-testid={`text-domain-weight-${i}`}>{domain.weight}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`${domain.color} h-3 rounded-full transition-all duration-700`}
                      style={{ width: `${domain.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100" data-testid="section-question-formats">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t("pages.rexPnHub.questionFormats")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-formats-heading">
                Question Types on the REx-PN
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The exam uses multiple question formats to assess clinical reasoning, prioritization, and safe nursing practice.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {questionFormats.map((format, i) => (
                <Card key={i} className="border border-gray-100 hover:shadow-md transition-shadow" data-testid={`card-format-${i}`}>
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                      <format.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2" data-testid={`text-format-title-${i}`}>{format.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{format.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100" data-testid="section-toolkit">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-4">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t("pages.rexPnHub.yourToolkit")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-toolkit-heading">
                Everything You Need to Pass the REx-PN
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access a complete set of study tools designed to build the clinical reasoning skills tested on the REx-PN.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolkitCards.map((tool, i) => (
                <Card
                  key={i}
                  className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  onClick={() => setLocation(tool.href)}
                  data-testid={`card-toolkit-${i}`}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 shadow-sm">
                      <tool.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2" data-testid={`text-toolkit-title-${i}`}>{tool.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{tool.description}</p>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      <span>{tool.cta}</span>
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100" data-testid="section-sub-pages">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-explore-heading">
                Explore REx-PN Resources
              </h2>
              <p className="text-gray-600">
                Deep-dive into exam format details, proven test-taking strategies, and wellness support.
              </p>
            </div>

            <div className="space-y-4">
              {subPages.map((page, i) => (
                <LocaleLink key={i} href={page.href}>
                  <div
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-5 border border-gray-100 transition-colors cursor-pointer group"
                    data-testid={`link-subpage-${i}`}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{page.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{page.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors shrink-0 ml-4" />
                  </div>
                </LocaleLink>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 border-t border-gray-100" data-testid="section-content-hub">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 mb-4">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">{t("pages.rexPnHub.studyGuides")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-content-hub-heading">
                REx-PN Content Library
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                In-depth study guides covering clinical conditions, pharmacology, lab values, and exam strategies.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {contentHubPages.map((page, i) => (
                <LocaleLink key={i} href={page.href}>
                  <Card className="h-full border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group" data-testid={`card-content-hub-${i}`}>
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                        <page.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{page.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{page.description}</p>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="section-condition-guides">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-red-500" />
                  Condition Study Guides
                </h3>
                <div className="space-y-2">
                  {conditionGuides.map((guide, i) => (
                    <LocaleLink key={i} href={guide.href}>
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" data-testid={`link-condition-${i}`}>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{guide.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                      </div>
                    </LocaleLink>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="section-lab-guides">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Lab Value Guides
                  </h3>
                  <div className="space-y-2">
                    {labValueGuides.map((guide, i) => (
                      <LocaleLink key={i} href={guide.href}>
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" data-testid={`link-lab-${i}`}>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{guide.title}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                        </div>
                      </LocaleLink>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="section-medication-guides">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Medication Guides
                  </h3>
                  <div className="space-y-2">
                    {medicationGuides.map((guide, i) => (
                      <LocaleLink key={i} href={guide.href}>
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" data-testid={`link-med-${i}`}>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{guide.title}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                        </div>
                      </LocaleLink>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="section-comparison-guides">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-500" />
                    Clinical Comparisons
                  </h3>
                  <div className="space-y-2">
                    {comparisonGuides.map((guide, i) => (
                      <LocaleLink key={i} href={guide.href}>
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" data-testid={`link-comparison-${i}`}>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{guide.title}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                        </div>
                      </LocaleLink>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="section-strategy-guides">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-500" />
                    Exam Strategies
                  </h3>
                  <div className="space-y-2">
                    {strategyGuides.map((guide, i) => (
                      <LocaleLink key={i} href={guide.href}>
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" data-testid={`link-strategy-${i}`}>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{guide.title}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                        </div>
                      </LocaleLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <ComparisonTable
          headline="How NurseNest Compares for REx-PN Prep"
          subtitle={t("pages.rex_pn_hub.seeHowAModernClinical")}
        />
        <DifferentiatorCTA
          headline="Start Your REx-PN Prep Today"
          subtitle={t("pages.rex_pn_hub.joinThousandsOfCanadianNursing")}
          primaryHref="/register"
          primaryLabel="Start Free"
          secondaryHref="/pricing"
          secondaryLabel="View Plans"
        />

        <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 border-t border-gray-100" data-testid="section-new-grad-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid="text-rpn-new-grad-cta">{t("pages.rexPnHub.passedYourRexpnLaunchYour")}</h2>
            <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm">
              Congratulations on passing! Our New Grad Career Hub helps you land your first nursing job with interview prep, resume templates, salary guides, and first-year survival strategies.
            </p>
            <LocaleLink href="/newgrad">
              <Button className="gap-2" data-testid="link-rpn-new-grad">
                Explore New Grad Career Hub <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
          </div>
        </section>

        <section className="py-12 bg-gray-50 border-t border-gray-100" data-testid="section-disclaimer">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2" data-testid="text-disclaimer-heading">{t("pages.rexPnHub.educationalDisclaimer")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed" data-testid="text-disclaimer-body">
                  This is a training simulator designed to help you prepare for the REx-PN examination. It does not guarantee exam results. NurseNest is not affiliated with, endorsed by, or connected to NCSBN, any provincial or territorial nursing regulatory body, or Pearson VUE. All content is developed independently for educational purposes. Candidates should always consult their regulatory body for official exam information and requirements.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}