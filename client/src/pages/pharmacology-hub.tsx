import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import {
  Pill,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
  Brain,
  HeartPulse,
  Stethoscope,
  Beaker,
  Syringe,
  Shield,
  Star,
  Users,
  FileText,
  Target,
  AlertTriangle,
  Leaf,
  Wind,
  Lightbulb,
  GraduationCap,
  Link2,
} from "lucide-react";

const featureCards = [
  {
    icon: Pill,
    title: "Comprehensive Medication Review",
    description:
      "Mechanism of action, indications, contraindications, adverse effects, and nursing considerations for every major drug class.",
  },
  {
    icon: FlaskConical,
    title: "Medication Overview Foundations",
    description:
      "Drug routes, medication safety, dosage calculations, antidotes, and foundational pharmacokinetics and pharmacodynamics.",
  },
  {
    icon: Brain,
    title: "Practical Application",
    description:
      "Case-based questions that test your clinical reasoning and help you connect drug knowledge to real patient scenarios.",
  },
  {
    icon: ShieldCheck,
    title: "Guidance and Support",
    description:
      "Detailed explanations, remediation pathways, and structured support to help you build lasting pharmacology confidence.",
  },
];

const curriculumDays = [
  {
    day: 1,
    title: "Building Blocks",
    topics: [
      "Testing strategies for pharmacology exams",
      "Drug routes and administration fundamentals",
      "Herbal supplements and interactions",
      "Immune system and anti-infective foundations",
    ],
  },
  {
    day: 2,
    title: "Head-to-Toe Part 1",
    topics: [
      "Sympathetic nervous system medications",
      "Parasympathetic nervous system medications",
      "Central nervous system medications",
      "Cardiac medications",
    ],
  },
  {
    day: 3,
    title: "Head-to-Toe Part 2",
    topics: [
      "Cardiac medications continued",
      "Respiratory medications",
      "Bronchodilators and anti-inflammatory agents",
      "Oxygen therapy and respiratory support",
    ],
  },
  {
    day: 4,
    title: "Head-to-Toe Part 3",
    topics: [
      "Renal medications and diuretics",
      "Gastrointestinal medications",
      "Endocrine medications and insulin therapy",
      "Hematology medications and anticoagulants",
    ],
  },
  {
    day: 5,
    title: "Specialties + Wrap-up",
    topics: [
      "Reproductive and maternal health pharmacology",
      "Mental health and psychotropic medications",
      "Oncology medications and supportive care",
      "Comprehensive review and wrap-up assessment",
    ],
  },
];

const pricingCards = [
  {
    id: "on-demand",
    name: "On-Demand",
    price: "$79",
    currency: "CAD",
    period: "one-time",
    description: "Full course access with assessments at your own pace.",
    features: [
      "All 5 days of content",
      "Pre-test and post-test assessments",
      "Downloadable reference sheets",
      "Lifetime access to materials",
    ],
    highlighted: false,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$19",
    currency: "CAD",
    period: "/month",
    description: "Access the full crash course while your subscription is active.",
    features: [
      "All 5 days of content",
      "Pre-test and post-test assessments",
      "Updated content each month",
      "Cancel anytime",
    ],
    highlighted: true,
  },
  {
    id: "live-cohort",
    name: "Live Cohort",
    price: "$99",
    currency: "CAD",
    period: "per cohort",
    description: "Join a scheduled live cohort for guided group learning.",
    features: [
      "Live facilitated sessions",
      "Group Q&A and discussion",
      "All on-demand content included",
      "Certificate of completion",
    ],
    highlighted: false,
    placeholder: true,
  },
];

const faqItems = [
  {
    question: "Who is this pharmacology crash course designed for?",
    answer:
      "This course is designed for nursing students preparing for licensure exams (REx-PN, NCLEX-RN), as well as working nurses who want a focused pharmacology refresher. It is suitable for RPN, RN, and NP students at any stage of their program.",
  },
  {
    question: "How is this different from a textbook pharmacology course?",
    answer:
      "Unlike a textbook, this crash course is organized by clinical system and focuses on high-yield content that appears on nursing exams. Every topic includes nursing considerations, patient safety priorities, and case-based application questions.",
  },
  {
    question: "Can I complete the course at my own pace?",
    answer:
      "Yes. The On-Demand option gives you access to all 5 days of content that you can work through on your own schedule. There is no time limit on completing the material.",
  },
  {
    question: "Are there assessments included?",
    answer:
      "Yes. Each day includes a baseline pre-assessment and a post-assessment so you can measure your progress and identify areas that need additional review.",
  },
  {
    question: "What if I need more time on a specific topic?",
    answer:
      "The course includes remediation pathways for each section. If your post-assessment shows gaps, you will receive targeted recommendations for further study within the NurseNest platform.",
  },
  {
    question: "Is the content aligned with Canadian nursing exams?",
    answer:
      "Yes. The pharmacology content covers medications and clinical scenarios relevant to both Canadian (REx-PN) and American (NCLEX) nursing licensure examinations. All prices are listed in Canadian dollars.",
  },
  {
    question: "Do I get a certificate after completing the course?",
    answer:
      "The Live Cohort option includes a certificate of completion. The On-Demand and Monthly options provide progress tracking and completion badges on your NurseNest profile.",
  },
  {
    question: "Can I access the course on my phone or tablet?",
    answer:
      "Yes. The entire course is fully responsive and works on desktop, tablet, and mobile devices. You can study anywhere with an internet connection.",
  },
];

export default function PharmacologyHub() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans transition-colors duration-500">
      <SEO
        title={t("pages.pharmacologyHub.pharmacologyCrashCourseNursenest")}
        description={t("pages.pharmacologyHub.aFocusedHighyieldPharmacologyReset")}
        canonicalPath="/pharmacology"
      />
      <Navigation />

      <main className="flex-grow">
        <section className="relative overflow-hidden py-20 lg:py-28" data-testid="section-pharma-hero">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-sm mb-6">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">{t("pages.pharmacologyHub.expertauthoredPharmacology")}</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6"
              data-testid="text-pharma-heading"
            >
              Pharmacology Crash Course
            </h1>

            <p
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
              data-testid="text-pharma-subheading"
            >
              A focused, high-yield pharmacology reset for exam success and clinical confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-[transform,box-shadow] hover:-translate-y-1 text-white w-full sm:w-auto"
                onClick={() => setLocation("/free-practice")}
                data-testid="button-pharma-baseline"
              >
                Start Baseline Assessment
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 text-gray-700 bg-white/50 w-full sm:w-auto"
                onClick={() =>
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                }
                data-testid="button-pharma-view-pricing"
              >
                View Pricing
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-400 text-gray-700 bg-white/50 w-full sm:w-auto"
                onClick={() =>
                  document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" })
                }
                data-testid="button-pharma-preview-curriculum"
              >
                <BookOpen className="mr-2 w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                Preview Curriculum
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/70 rounded-full border border-emerald-100 backdrop-blur-sm shadow-sm">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t("pages.pharmacologyHub.5dayIntensive")}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/70 rounded-full border border-emerald-100 backdrop-blur-sm shadow-sm">
                <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t("pages.pharmacologyHub.highyieldContent")}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/70 rounded-full border border-emerald-100 backdrop-blur-sm shadow-sm">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t("pages.pharmacologyHub.casebasedQuestions")}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100" data-testid="section-pharma-features">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pharma-features-heading">
                What You Will Learn
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Four pillars of pharmacology mastery designed to prepare you for clinical practice and exam success.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={idx}
                    className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    data-testid={`card-pharma-feature-${idx}`}
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3
                        className="font-bold text-gray-900 text-lg mb-2"
                        data-testid={`text-pharma-feature-title-${idx}`}
                      >
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed" data-testid={`text-pharma-feature-desc-${idx}`}>
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="curriculum" className="py-16 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100" data-testid="section-pharma-curriculum">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t("pages.pharmacologyHub.5dayCurriculum")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pharma-curriculum-heading">
                Your Learning Path
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A structured, system-by-system approach covering every major drug class you need to know.
              </p>
            </div>

            <div className="space-y-4">
              {curriculumDays.map((day) => (
                <Card
                  key={day.day}
                  className="border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  data-testid={`card-pharma-day-${day.day}`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4 p-6">
                      <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg" data-testid={`text-pharma-day-number-${day.day}`}>
                          D{day.day}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-bold text-gray-900 text-lg mb-3"
                          data-testid={`text-pharma-day-title-${day.day}`}
                        >
                          Day {day.day}: {day.title}
                        </h3>
                        <ul className="space-y-2">
                          {day.topics.map((topic, tIdx) => (
                            <li
                              key={tIdx}
                              className="flex items-start gap-2 text-sm text-gray-600"
                              data-testid={`text-pharma-topic-${day.day}-${tIdx}`}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 bg-white border-t border-gray-100" data-testid="section-pharma-pricing">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pharma-pricing-heading">
                Choose Your Access
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                All prices in Canadian dollars (CAD). Select the option that fits your study schedule.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
              {pricingCards.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    plan.highlighted ? "ring-2 ring-emerald-500 shadow-emerald-500/10" : ""
                  }`}
                  data-testid={`card-pharma-pricing-${plan.id}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-emerald-600 text-white px-5 py-1.5 text-sm font-bold shadow-lg rounded-full">
                        Most Flexible
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-1"
                      data-testid={`text-pharma-plan-name-${plan.id}`}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4" data-testid={`text-pharma-plan-desc-${plan.id}`}>
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span
                        className="text-4xl font-bold text-emerald-600"
                        data-testid={`text-pharma-plan-price-${plan.id}`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">
                        {plan.currency} {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2 text-sm text-gray-600"
                          data-testid={`text-pharma-plan-feature-${plan.id}-${fIdx}`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.placeholder ? (
                      <Button
                        className="w-full rounded-full font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
                        disabled
                        data-testid={`button-pharma-plan-${plan.id}`}
                      >
                        Coming Soon
                      </Button>
                    ) : (
                      <Button
                        className={`w-full rounded-full font-semibold transition-all ${
                          plan.highlighted
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:-translate-y-0.5"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                        }`}
                        onClick={() => setLocation("/pricing")}
                        data-testid={`button-pharma-plan-${plan.id}`}
                      >
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100" data-testid="section-pharma-ecosystem">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
                <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t("pages.pharmacologyHub.crossprofessionPharmacology")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pharma-ecosystem-heading">
                Pharmacology Across Disciplines
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Pharmacology knowledge is shared across healthcare professions. Explore pharmacology resources tailored to your specific exam and scope of practice.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LocaleLink href="/nclex-pharmacology">
                <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full" data-testid="card-ecosystem-nursing">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{t("pages.pharmacologyHub.nursingNclexrn")}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t("pages.pharmacologyHub.pharmacologyForRnLicensureExams")}</p>
                    <span className="text-emerald-600 text-sm font-medium mt-3 inline-flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                  </CardContent>
                </Card>
              </LocaleLink>

              <LocaleLink href="/nclex-pn-pharmacology">
                <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full" data-testid="card-ecosystem-rpn">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{t("pages.pharmacologyHub.practicalNursingRexpn")}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t("pages.pharmacologyHub.pharmacologyWithinTheRpnlpnScope")}</p>
                    <span className="text-emerald-600 text-sm font-medium mt-3 inline-flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                  </CardContent>
                </Card>
              </LocaleLink>

              <LocaleLink href="/np-exam-prep">
                <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full" data-testid="card-ecosystem-np">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                      <HeartPulse className="w-6 h-6 text-rose-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{t("pages.pharmacologyHub.nursePractitionerNp")}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t("pages.pharmacologyHub.advancedPharmacologyForNpCertification")}</p>
                    <span className="text-emerald-600 text-sm font-medium mt-3 inline-flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                  </CardContent>
                </Card>
              </LocaleLink>

              <LocaleLink href="/allied-respiratory-therapy">
                <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full" data-testid="card-ecosystem-rt">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                      <Wind className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{t("pages.pharmacologyHub.respiratoryTherapy")}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t("pages.pharmacologyHub.respiratoryPharmacologyIncludingBronchodilators")}</p>
                    <span className="text-emerald-600 text-sm font-medium mt-3 inline-flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                  </CardContent>
                </Card>
              </LocaleLink>

              <LocaleLink href="/medication-mastery">
                <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full" data-testid="card-ecosystem-med-mastery">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                      <FlaskConical className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{t("pages.pharmacologyHub.medicationMastery")}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t("pages.pharmacologyHub.mechanismfirstDrugExplorerUnderstandWhy")}</p>
                    <span className="text-emerald-600 text-sm font-medium mt-3 inline-flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                  </CardContent>
                </Card>
              </LocaleLink>

              <LocaleLink href="/herbal-supplements">
                <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full" data-testid="card-ecosystem-herbals">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{t("pages.pharmacologyHub.herbalSupplementsSafety")}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t("pages.pharmacologyHub.herbalSupplementInteractionsPerioperativeSafe")}</p>
                    <span className="text-emerald-600 text-sm font-medium mt-3 inline-flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                  </CardContent>
                </Card>
              </LocaleLink>

              <LocaleLink href="/allied-health">
                <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full" data-testid="card-ecosystem-allied">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{t("pages.pharmacologyHub.alliedHealthProfessions")}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{t("pages.pharmacologyHub.pharmacologyResourcesForPharmacyTechnicians")}</p>
                    <span className="text-emerald-600 text-sm font-medium mt-3 inline-flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                  </CardContent>
                </Card>
              </LocaleLink>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100" data-testid="section-pharma-exam-tips">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-4">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t("pages.pharmacologyHub.examSuccess")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pharma-exam-heading">
                High-Yield Exam Content
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Exam writers test pharmacology concepts that prioritize patient safety. Focus on these areas.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-red-200 bg-red-50/50" data-testid="card-safety-alert">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-red-900 mb-2 text-lg">{t("pages.pharmacologyHub.safetyAlertsExamWritersLove")}</h3>
                      <ul className="space-y-2 text-sm text-red-800">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.holdParameters")}</strong> {t("pages.pharmacologyHub.holdBetablockersIfHrLt")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.antidotes")}</strong> {t("pages.pharmacologyHub.naloxoneForOpioidsProtamineFor")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.neverGiveIvPush")}</strong> {t("pages.pharmacologyHub.potassiumFatalArrhythmiaVancomycinRed")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.herbalInteractions")}</strong> {t("pages.pharmacologyHub.stJohnsWortSsrisSerotonin")}</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50" data-testid="card-common-mistakes">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-amber-900 mb-2 text-lg">{t("pages.pharmacologyHub.commonStudentMistakes")}</h3>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.confusingDrugClassSuffixes")}</strong> {t("pages.pharmacologyHub.ololBetablockerPrilAceInhibitor")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.warfarinVsHeparinMonitoring")}</strong> {t("pages.pharmacologyHub.warfarinPtinrExtrinsicPathwayHeparin")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.assumingNaturalMeansSafe")}</strong> {t("pages.pharmacologyHub.herbalSupplementsArePharmacologicallyActive")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.forgettingPeakonsetTimes")}</strong> {t("pages.pharmacologyHub.ivFurosemideWorksIn5")}</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/50" data-testid="card-exam-traps">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-emerald-900 mb-2 text-lg">{t("pages.pharmacologyHub.examTrapsWhatTheyReally")}</h3>
                      <ul className="space-y-2 text-sm text-emerald-800">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.priorityQuestionPattern")}</strong> {t("pages.pharmacologyHub.whenAskedWhatIsThe")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.therapeuticVsToxic")}</strong> {t("pages.pharmacologyHub.questionsOftenTestWhetherYou")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.medicationReconciliation")}</strong> {t("pages.pharmacologyHub.expectQuestionsAboutPatientsWho")}</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><span><strong>{t("pages.pharmacologyHub.patientTeaching")}</strong> {t("pages.pharmacologyHub.theBestAnswerIsAlways")}</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100" data-testid="section-pharma-faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pharma-faq-heading">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about the Pharmacology Crash Course.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-white border border-gray-100 rounded-xl px-6 shadow-sm"
                  data-testid={`accordion-pharma-faq-${idx}`}
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-4" data-testid={`button-pharma-faq-${idx}`}>
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-4" data-testid={`text-pharma-faq-answer-${idx}`}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100" data-testid="section-pharma-disclaimer">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">{t("pages.pharmacologyHub.expertauthoredContent")}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto" data-testid="text-pharma-disclaimer">
              This pharmacology crash course is an educational resource designed to supplement your
              nursing program curriculum. It is authored by experienced nurse educators and reviewed
              for clinical accuracy. This course does not replace clinical instruction, prescribing
              authority training, or direct patient care supervision. Always follow your institution's
              policies and scope of practice guidelines.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}