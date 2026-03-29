import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LazySection } from "@/components/lazy-section";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import type { DigitalProduct } from "@shared/schema";
import type { HeroStats } from "@shared/lesson-stats";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Star,
  Shield,
  BookOpen,
  Brain,
  Stethoscope,
  Pill,
  HeartPulse,
  Activity,
  FlaskConical,
  Baby,
  Lightbulb,
  Target,
  Layers,
  BarChart3,
  Zap,
  GraduationCap,
  Mail,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  TrendingUp,
  PlayCircle,
  Calculator,
  ClipboardCheck,
  Siren,
  Droplets,
  Thermometer,
  TestTubes,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Globe,
  Gamepad2,
  Award,
  Microscope,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CircleCheck,
  Trophy,
  BadgeCheck,
  ShoppingBag,
} from "lucide-react";

const TrustShowcase = lazy(() => import("@/components/trust-showcase").then(m => ({ default: m.TrustShowcase })));

function formatCount(n: number | undefined): string {
  if (n === undefined || n === 0) return "---";
  if (n < 10) return `${n}`;
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString()}+`;
  }
  const tens = Math.floor(n / 10) * 10;
  return `${tens}+`;
}

interface HomeBottomSectionsProps {
  region: "US" | "CA";
  heroStats: HeroStats | undefined;
  featuredProducts: DigitalProduct[];
  lessonCount: number;
  questionCount: number;
  storeProductCount: number;
  email: string;
  setEmail: (v: string) => void;
  emailFrequency: string;
  setEmailFrequency: (v: string) => void;
  emailStatus: "idle" | "loading" | "success" | "error";
  emailMessage: string;
  setEmailStatus: (v: "idle" | "loading" | "success" | "error") => void;
  handleEmailSubscribe: () => void;
}

export function HomeBottomSections({
  region,
  heroStats,
  featuredProducts,
  lessonCount,
  questionCount,
  storeProductCount,
  email,
  setEmail,
  emailFrequency,
  setEmailFrequency,
  emailStatus,
  emailMessage,
  setEmailStatus,
  handleEmailSubscribe,
}: HomeBottomSectionsProps) {
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  return (
    <>
        <LazySection minHeight="600px" rootMargin="300px">
        <section className="border-t border-gray-100" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-study-tools">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">{t("components.homeBottomSections.builtForYou")}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-study-tools-heading">
                Your Personalized Exam Toolkit
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every student's journey is unique. NurseNest adapts to your strengths, targets your weak areas, and tracks your progress toward exam readiness.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div
                className="relative bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group overflow-hidden"
                onClick={() => setLocation("/study-plan")}
                data-testid="card-promo-study-planner"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-100/50 to-transparent rounded-bl-full" />
                <div className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-violet-500 text-white px-2 py-0.5 rounded-full z-10">{t("components.homeBottomSections.personalized")}</div>
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("components.homeBottomSections.customStudyPlanner")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Get a personalized study schedule built around your exam date, available hours, and weak areas. Your plan adapts as you progress.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">{t("components.homeBottomSections.dailyTasks")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">{t("components.homeBottomSections.adaptive")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">{t("components.homeBottomSections.progressTracking")}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-violet-600 group-hover:gap-2 transition-all">
                  <span>{t("components.homeBottomSections.createYourPlan")}</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div
                className="relative bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group overflow-hidden"
                onClick={() => setLocation("/mock-exams")}
                data-testid="card-promo-readiness-exam"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full" />
                <div className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full z-10">{t("components.homeBottomSections.free")}</div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("components.homeBottomSections.freeReadinessExam")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Take a 25-question readiness check to gauge your exam preparedness. Instant results with a detailed performance breakdown. No account required.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{t("components.homeBottomSections.25Questions")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{t("components.homeBottomSections.instantResults")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{t("components.homeBottomSections.noCost")}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                  <span>{t("components.homeBottomSections.takeTheFreeExam")}</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div
                className="relative bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group overflow-hidden"
                onClick={() => setLocation("/reports")}
                data-testid="card-promo-report-card"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full" />
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("components.homeBottomSections.performanceReportCard")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Track your progress across every body system and competency domain. Identify strengths, target weaknesses, and watch your readiness score climb.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{t("components.homeBottomSections.scoreTrends")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{t("components.homeBottomSections.domainAnalysis")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{t("components.homeBottomSections.weakAreaDetection")}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-amber-600 group-hover:gap-2 transition-all">
                  <span>{t("components.homeBottomSections.viewYourReportCard")}</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/20"
                onClick={() => setLocation("/free-practice")}
                data-testid="button-promo-get-started"
              >
                Start Free - Build Your Study Plan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="min-h-[300px]" />}>
          <TrustShowcase />
        </Suspense>

        {/* Choose Your Exam Path */}
        <section className="py-16 bg-gradient-to-b from-white to-primary/5 relative z-10 border-t border-gray-100" data-testid="section-exam-path">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.examPath.badge")}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-exam-path-heading">{t("home.examPath.heading")}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("home.examPath.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card 
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${region === "CA" ? "ring-2 ring-red-400 shadow-lg" : "border-gray-200 hover:border-red-300"}`}
                onClick={() => setLocation("/rex-pn-guide")}
                data-testid="card-exam-path-ca"
              >
                {region === "CA" && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-500 text-white text-[10px]">{t("home.examPath.yourRegion")}</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                      <span className="text-2xl" role="img" aria-label={t("components.homeBottomSections.canada")}>🍁</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg" data-testid="text-exam-path-ca-title">{t("home.examPath.ca.title")}</h3>
                      <p className="text-xs text-gray-500 font-medium">{t("home.examPath.ca.subtitle")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4" data-testid="text-exam-path-ca-desc">{t("home.examPath.ca.desc")}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">{t("home.examPath.ca.pill1")}</span>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">{t("home.examPath.ca.pill2")}</span>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">{t("home.examPath.ca.pill3")}</span>
                  </div>
                  <Button variant="outline" className="w-full rounded-full border-red-200 text-red-700 hover:bg-red-50 group-hover:border-red-400" data-testid="button-exam-path-ca">
                    {t("home.examPath.ca.cta")}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${region === "US" ? "ring-2 ring-blue-400 shadow-lg" : "border-gray-200 hover:border-blue-300"}`}
                onClick={() => setLocation("/nclex-rn-guide")}
                data-testid="card-exam-path-us"
              >
                {region === "US" && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-500 text-white text-[10px]">{t("home.examPath.yourRegion")}</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <span className="text-2xl" role="img" aria-label={t("components.homeBottomSections.unitedStates")}>🇺🇸</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg" data-testid="text-exam-path-us-title">{t("home.examPath.us.title")}</h3>
                      <p className="text-xs text-gray-500 font-medium">{t("home.examPath.us.subtitle")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4" data-testid="text-exam-path-us-desc">{t("home.examPath.us.desc")}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{t("home.examPath.us.pill1")}</span>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{t("home.examPath.us.pill2")}</span>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{t("home.examPath.us.pill3")}</span>
                  </div>
                  <Button variant="outline" className="w-full rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 group-hover:border-blue-400" data-testid="button-exam-path-us">
                    {t("home.examPath.us.cta")}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">{t("home.examPath.bothNote")}</p>
          </div>
        </section>

        {/* 3-Step How It Works */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-white relative z-10 border-t border-primary/10" data-testid="section-how-it-works">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.howItWorks.badge")}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-how-it-works-heading">{t("home.howItWorks.heading")}</h2>
              <p className="text-lg text-gray-600">{t("home.howItWorks.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", icon: BookOpen, title: t("home.howItWorks.step1.title"), desc: t("home.howItWorks.step1.desc"), color: "from-blue-500 to-indigo-600" },
                { step: "2", icon: Target, title: t("home.howItWorks.step2.title"), desc: t("home.howItWorks.step2.desc"), color: "from-purple-500 to-violet-600" },
                { step: "3", icon: Trophy, title: t("home.howItWorks.step3.title"), desc: t("home.howItWorks.step3.desc"), color: "from-emerald-500 to-teal-600" },
              ].map((item, i) => (
                <div key={i} className="relative text-center" data-testid={`step-how-it-works-${i}`}>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-gray-300 to-transparent z-0" />
                  )}
                  <div className="relative z-10">
                    <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                      <item.icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold mb-3">{item.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-14 bg-white border-y border-gray-100" data-testid="section-social-proof">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-4">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t("home.socialProof.badge")}</span>
              </div>
              <h2 className="font-bold text-gray-900" style={{ fontSize: 'var(--text-section)' }} data-testid="text-social-proof-heading">{t("home.socialProof.heading")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100" data-testid="stat-social-students">
                <Users className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-gray-900">5,000+</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{t("home.socialProof.students")}</div>
              </div>
              <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100" data-testid="stat-social-pass-rate">
                <BadgeCheck className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-gray-900">{t("home.socialProof.passRateValue")}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{t("home.socialProof.passRate")}</div>
              </div>
              <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-purple-50 to-white border border-purple-100" data-testid="stat-social-questions">
                <Target className="w-7 h-7 text-purple-600 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-gray-900">{formatCount(questionCount)}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{t("home.socialProof.questions")}</div>
              </div>
              <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-white border border-amber-100" data-testid="stat-social-lessons">
                <BookOpen className="w-7 h-7 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-gray-900">{formatCount(lessonCount)}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{t("home.socialProof.lessons")}</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>{t("home.socialProof.updatedDesc")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* What's New Section */}
        <section className="py-12 bg-gradient-to-b from-emerald-50/50 to-white relative z-10 border-t border-emerald-100/50" data-testid="section-whats-new">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-emerald-300" />
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t("home.new.badge")}</span>
              </div>
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-emerald-300" />
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div
                className="bg-white rounded-2xl border border-emerald-100/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group"
                onClick={() => setLocation("/flashcards")}
                data-testid="card-new-decks"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">{t("home.new.label")}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{t("home.new.decks.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t("home.new.decks.desc")}</p>
              </div>

              <div
                className="bg-white rounded-2xl border border-emerald-100/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group"
                onClick={() => setLocation("/blog")}
                data-testid="card-new-blog"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">{t("home.new.label")}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{t("home.new.blog.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t("home.new.blog.desc")}</p>
              </div>

              <div
                className="bg-white rounded-2xl border border-emerald-100/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group"
                onClick={() => setLocation("/lessons")}
                data-testid="card-new-languages"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">{t("home.new.label")}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{t("home.new.languages.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t("home.new.languages.desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features Showcase */}
        <section className="py-20 bg-gradient-to-b from-white via-primary/3 to-white relative z-10" data-testid="section-platform-features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-5">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.platform.badge")}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-5" style={{ fontSize: 'var(--text-section)' }} data-testid="text-features-heading">
                {t("home.features.title")}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("home.features.subtitle")}
              </p>
            </div>

            {/* Headline Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
              {[
                { value: formatCount(questionCount), label: t("home.stats.questions"), icon: Target, color: "from-blue-500 to-indigo-600" },
                { value: formatCount(lessonCount), label: t("home.stats.lessons"), icon: BookOpen, color: "from-emerald-500 to-teal-600" },
                { value: storeProductCount > 0 ? `${storeProductCount}+` : "9", label: storeProductCount > 0 ? t("home.stats.studyPacks") : t("home.stats.simulators"), icon: storeProductCount > 0 ? ShoppingBag : Gamepad2, color: "from-purple-500 to-violet-600" },
                { value: "7+", label: t("home.stats.modes"), icon: Layers, color: "from-amber-500 to-orange-600" },
              ].map((stat, i) => (
                <div key={i} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-5 text-center group" data-testid={`stat-feature-${i}`}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
                  <div className="mx-auto w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Main Feature Cards - 2x3 Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {/* Mock Exams */}
              <div
                className="bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => setLocation("/mock-exams")}
                data-testid="card-feature-mock-exams"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-bl-full" />
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("home.exams.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("home.exams.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{t("home.feature.examFormat")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{t("home.feature.scoreTrends")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{t("home.feature.autoSave")}</span>
                </div>
              </div>

              {/* Clinical Simulators */}
              <div
                className="bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => setLocation("/first-action-simulator")}
                data-testid="card-feature-simulators"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-full" />
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("home.simulators.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("home.simulators.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{t("home.feature.branching")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{t("home.feature.instantFeedback")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">{t("home.feature.free2")}</span>
                </div>
              </div>

              {/* Test Bank */}
              <div
                className="bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => setLocation("/free-practice")}
                data-testid="card-feature-test-bank"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full" />
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{formatCount(questionCount)} {t("home.qbank.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("home.qbank.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">RPN/LVN/RN/NP {t("home.feature.tierLevels")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{t("home.feature.deepRationales")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{t("home.feature.progressTracking")}</span>
                </div>
              </div>

              {/* Flashcard Decks */}
              <div
                className="bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => setLocation("/flashcards")}
                data-testid="card-feature-flashcards"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full" />
                <div className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full z-10">{t("home.new.label")}</div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("home.flashcards.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("home.flashcards.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{t("home.feature.learnMode")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{t("home.feature.testMode")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{t("home.feature.accuracyCheck")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{t("home.feature.csvImport")}</span>
                </div>
              </div>

              {/* Med Math & Lab Values */}
              <div
                className="bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => setLocation("/med-math")}
                data-testid="card-feature-med-math"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full" />
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("home.tools.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("home.tools.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{t("home.feature.stepwise")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{t("home.feature.abg")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{t("home.feature.labClusters")}</span>
                </div>
              </div>

              {/* Video Lectures */}
              <div
                className="bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => setLocation("/lectures")}
                data-testid="card-feature-lectures"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/50 to-transparent rounded-bl-full" />
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("home.lessons.title")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("home.lessons.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">{t("home.feature.videoLectures")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">{t("home.feature.clinicalPearls")}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">{t("home.feature.freeContent")}</span>
                </div>
              </div>
            </div>

            {/* Secondary Features Strip */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100/80 shadow-[var(--shadow-card)] p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200 cursor-pointer" onClick={() => setLocation("/dashboard")} data-testid="card-feature-dashboard">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t("home.secondary.dashboard")}</h4>
                  <p className="text-xs text-gray-500">{t("home.secondary.dashboardDesc")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100/80 shadow-[var(--shadow-card)] p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200 cursor-pointer" onClick={() => setLocation("/reports")} data-testid="card-feature-analytics">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t("home.secondary.analytics")}</h4>
                  <p className="text-xs text-gray-500">{t("home.secondary.analyticsDesc")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100/80 shadow-[var(--shadow-card)] p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200 cursor-pointer" onClick={() => setLocation("/question-of-the-day")} data-testid="card-feature-qotd">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                  <MessageSquareQuote className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t("home.secondary.qotd")}</h4>
                  <p className="text-xs text-gray-500">{t("home.secondary.qotdDesc")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden" onClick={() => setLocation("/blog")} data-testid="card-feature-blog">
                <div className="absolute top-1.5 right-1.5 text-[8px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">{t("home.new.label")}</div>
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <Newspaper className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t("home.secondary.blog")}</h4>
                  <p className="text-xs text-gray-500">{t("home.secondary.blogDesc")}</p>
                </div>
              </div>
            </div>

            {/* Differentiators Row */}
            <div className="bg-gradient-to-r from-primary/5 via-white to-primary/5 rounded-2xl border border-primary/10 p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{t("home.diff.region")}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{t("home.diff.regionDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Microscope className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{t("home.diff.patho")}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{t("home.diff.pathoDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{t("home.diff.scope")}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">RPN/LVN {t("home.diff.scopeDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{t("home.diff.languages")}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{t("home.diff.languagesDesc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button
                size="lg"
                className="h-14 px-10 text-lg rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 text-white transition-[transform,box-shadow] hover:-translate-y-1"
                onClick={() => setLocation("/start-free")}
                data-testid="button-features-start-free"
              >
                {t("home.startFree")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Free Interactive Learning Section */}
        <section className="py-20 bg-gradient-to-b from-white to-primary/5 relative z-10" data-testid="section-free-learning">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("home.free.badge")}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-free-learning-heading">{t("home.free.title")}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("home.free.subtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border border-primary/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden bg-white cursor-pointer group" onClick={() => setLocation("/pre-nursing")} data-testid="card-free-pre-nursing">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("home.free.preNursing")}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t("home.free.preNursingDesc")}</p>
                  <span className="text-xs text-primary font-medium">{t("home.free.preNursingMeta")}</span>
                </CardContent>
              </Card>

              <Card className="border border-primary/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden bg-white cursor-pointer group" onClick={() => setLocation("/anatomy")} data-testid="card-free-anatomy">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <HeartPulse className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("home.free.anatomy")}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t("home.free.anatomyDesc")}</p>
                  <span className="text-xs text-primary font-medium">{t("home.free.anatomyMeta")}</span>
                </CardContent>
              </Card>

              <Card className="border border-primary/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden bg-white cursor-pointer group" onClick={() => setLocation("/clinical-clarity")} data-testid="card-free-clinical-clarity">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("home.free.clarity")}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t("home.free.clarityDesc")}</p>
                  <span className="text-xs text-primary font-medium">{t("home.free.clarityMeta")}</span>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-10">
              <Button className="rounded-full px-8 h-12 bg-primary hover:brightness-110 text-white shadow-md" onClick={() => setLocation("/pre-nursing")} data-testid="button-explore-free">
                {t("home.free.explore")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
        </LazySection>

        {/* What You Can Study Section */}
        <LazySection minHeight="800px" rootMargin="200px">
        <section className="py-24 bg-white/50 backdrop-blur-sm relative z-10" data-testid="section-study-topics">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-6">
              <h2 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-study-heading">{t("home.study.heading")}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("home.study.subtitle")}
              </p>
            </div>

            <p className="text-center text-sm text-gray-500 mb-12 max-w-2xl mx-auto">
              {t("home.study.subtext")}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: HeartPulse, title: t("home.study.medsurg"), desc: t("home.study.medsurgDesc"), color: "bg-red-50 text-red-600" },
                { icon: Pill, title: t("home.study.pharm"), desc: t("home.study.pharmDesc"), color: "bg-blue-50 text-blue-600" },
                { icon: Baby, title: t("home.study.maternal"), desc: t("home.study.maternalDesc"), color: "bg-pink-50 text-pink-600" },
                { icon: Brain, title: t("home.study.mental"), desc: t("home.study.mentalDesc"), color: "bg-purple-50 text-purple-600" },
                { icon: FlaskConical, title: t("home.study.lab"), desc: t("home.study.labDesc"), color: "bg-emerald-50 text-emerald-600" },
                { icon: Activity, title: t("home.study.critical"), desc: t("home.study.criticalDesc"), color: "bg-orange-50 text-orange-600" },
                { icon: Target, title: t("home.study.priority"), desc: t("home.study.priorityDesc"), color: "bg-indigo-50 text-indigo-600" },
                { icon: Stethoscope, title: t("home.study.cases"), desc: t("home.study.casesDesc"), color: "bg-teal-50 text-teal-600" },
                { icon: GraduationCap, title: t("home.study.patho"), desc: t("home.study.pathoDesc"), color: "bg-amber-50 text-amber-600" },
              ].map((topic, i) => (
                <Card key={i} className="border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden group bg-white cursor-pointer" onClick={() => setLocation("/lessons")} data-testid={`card-topic-${i}`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${topic.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <topic.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{topic.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5 text-gray-700" onClick={() => setLocation("/lessons")} data-testid="button-browse-all-topics">
                {t("home.study.browseAll")} ({formatCount(lessonCount)})
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-b border-gray-100" data-testid="section-most-tested">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm mb-4">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">{t("home.mostTested.badge")}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-most-tested-heading">{t("home.mostTested.heading")}</h2>
              <p className="text-gray-600">{t("home.mostTested.subtitle")}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Droplets, title: t("home.mostTested.electrolytes"), desc: t("home.mostTested.electrolytesDesc"), href: "/study-guide/electrolytes-acid-base-nursing-guide", color: "bg-blue-50 text-blue-600" },
                { icon: HeartPulse, title: t("home.mostTested.ecg"), desc: t("home.mostTested.ecgDesc"), href: "/study-guide/cardiac-emergencies-nursing-guide", color: "bg-red-50 text-red-600" },
                { icon: Thermometer, title: t("home.mostTested.sepsis"), desc: t("home.mostTested.sepsisDesc"), href: "/study-guide/sepsis-shock-nursing-guide", color: "bg-orange-50 text-orange-600" },
                { icon: Baby, title: t("home.mostTested.ob"), desc: t("home.mostTested.obDesc"), href: "/study-guide/ob-emergencies-nursing-guide", color: "bg-pink-50 text-pink-600" },
                { icon: FlaskConical, title: t("home.mostTested.pharm"), desc: t("home.mostTested.pharmDesc"), href: "/study-guide/pharmacology-high-yield-nursing-guide", color: "bg-emerald-50 text-emerald-600" },
                { icon: Brain, title: t("home.mostTested.neuro"), desc: t("home.mostTested.neuroDesc"), href: "/lessons/stroke", color: "bg-purple-50 text-purple-600" },
              ].map((topic, i) => (
                <Card 
                  key={i} 
                  className="border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden group bg-white cursor-pointer" 
                  onClick={() => setLocation(topic.href)} 
                  data-testid={`card-most-tested-${i}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 ${topic.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <topic.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{topic.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{topic.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* For New Nurses & Floor Specialties */}
        <section className="py-20 bg-primary/5 border-y border-primary/10" data-testid="section-new-nurses">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary/20 shadow-sm mb-6">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("home.nurses.badge")}</span>
                </div>
                <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: 'var(--text-section)' }} data-testid="text-new-nurses-heading">
                  {t("home.nurses.heading")}
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {t("home.nurses.subtitle")}
                </p>
                <div className="space-y-4">
                  {[
                    { title: t("home.nurses.grad"), desc: t("home.nurses.gradDesc") },
                    { title: t("home.nurses.floor"), desc: t("home.nurses.floorDesc") },
                    { title: t("home.nurses.medSafety"), desc: t("home.nurses.medSafetyDesc") },
                    { title: t("home.nurses.deterioration"), desc: t("home.nurses.deteriorationDesc") },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: formatCount(lessonCount), label: t("home.stats.lessons"), icon: BookOpen },
                  { value: formatCount(questionCount), label: t("home.stats.questions"), icon: Target },
                  { value: "15+", label: t("home.nurses.bodySystems"), icon: HeartPulse },
                  { value: "7+", label: t("home.nurses.studyModes"), icon: Layers },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 text-center" data-testid={`stat-${i}`}>
                    <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why NurseNest Section */}
        <section className="py-24 bg-white" data-testid="section-why-nursenest">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-why-heading">{t("home.why.heading")}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("home.why.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Lightbulb, title: t("home.why.rationale"), desc: t("home.why.rationaleDesc") },
                { icon: Brain, title: t("home.why.judgment"), desc: t("home.why.judgmentDesc") },
                { icon: Layers, title: t("home.why.progression"), desc: t("home.why.progressionDesc") },
                { icon: Stethoscope, title: t("home.why.simulation"), desc: t("home.why.simulationDesc") },
                { icon: BarChart3, title: t("home.why.analytics"), desc: t("home.why.analyticsDesc") },
                { icon: Zap, title: t("home.why.noFiller"), desc: t("home.why.noFillerDesc") },
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50/80 rounded-2xl p-8 hover:shadow-md transition-shadow duration-300 border border-gray-100" data-testid={`card-feature-${i}`}>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flashcard Trust Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white" data-testid="section-flashcard-trust">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm font-semibold px-4 py-2 rounded-full mb-6" data-testid="badge-flashcard-warning">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                {t("home.flashcardTrust.warningBadge")}
              </div>
              <h2 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-flashcard-trust-heading">
                {t("home.flashcardTrust.heading")}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="text-flashcard-trust-subtitle">
                {t("home.flashcardTrust.subtitle")}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              <div className="bg-red-50/60 rounded-2xl border border-red-100 p-8" data-testid="card-other-platforms">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{t("home.flashcardTrust.otherPlatforms")}</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    t("home.flashcardTrust.issue1"),
                    t("home.flashcardTrust.issue2"),
                    t("home.flashcardTrust.issue3"),
                    t("home.flashcardTrust.issue4"),
                  ].map((issue, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-issue-${i}`}>
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-gray-700 leading-relaxed">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-8" data-testid="card-nursenest-flashcards">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{t("home.flashcardTrust.nurseNest")}</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    t("home.flashcardTrust.benefit1"),
                    t("home.flashcardTrust.benefit2"),
                    t("home.flashcardTrust.benefit3"),
                    t("home.flashcardTrust.benefit4"),
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-benefit-${i}`}>
                      <CircleCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-primary/5 rounded-2xl border border-primary/10 shadow-sm p-8 max-w-3xl mx-auto" data-testid="card-flashcard-user-created">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900" data-testid="text-flashcard-user-created-heading">
                  {t("home.flashcardTrust.userCreated.heading")}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5" data-testid="text-flashcard-user-created-desc">
                {t("home.flashcardTrust.userCreated.desc")}
              </p>
              <ul className="space-y-3">
                {[
                  t("home.flashcardTrust.userCreated.benefit1"),
                  t("home.flashcardTrust.userCreated.benefit2"),
                  t("home.flashcardTrust.userCreated.benefit3"),
                  t("home.flashcardTrust.userCreated.benefit4"),
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`text-flashcard-user-benefit-${i}`}>
                    <CircleCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-3xl mx-auto text-center" data-testid="card-flashcard-trust-cta">
              <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-900 mb-3" data-testid="text-flashcard-trust-cta">
                {t("home.flashcardTrust.ctaTitle")}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6" data-testid="text-flashcard-trust-cta-desc">
                {t("home.flashcardTrust.ctaDesc")}
              </p>
              <button
                onClick={() => setLocation("/flashcards")}
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
                data-testid="button-explore-flashcards"
              >
                {t("home.flashcardTrust.ctaButton")}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Competitive Positioning */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white" data-testid="section-competitive">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-4">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">{t("home.competitive.badge")}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-competitive-heading">{t("home.competitive.heading")}</h2>
              <p className="text-lg text-gray-600">{t("home.competitive.subtitle")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden" data-testid="table-competitive">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500">{t("home.competitive.feature")}</th>
                    <th className="text-center py-4 px-5 text-sm font-bold text-primary bg-primary/5">{t("home.competitive.nursenest")}</th>
                    <th className="text-center py-4 px-5 text-sm font-semibold text-gray-500">{t("home.competitive.uworld")}</th>
                    <th className="text-center py-4 px-5 text-sm font-semibold text-gray-500">{t("home.competitive.archer")}</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { feature: t("home.competitive.price"), nn: t("home.competitive.priceNN"), uw: t("home.competitive.priceUW"), ar: t("home.competitive.priceAR"), isPrice: true as const },
                    { feature: t("home.competitive.clinicalSims"), nn: "yes", uw: "no", ar: "no" },
                    { feature: t("home.competitive.flashcards"), nn: "yes", uw: "no", ar: "no" },
                    { feature: t("home.competitive.deepPatho"), nn: "yes", uw: "limited", ar: "no" },
                    { feature: t("home.competitive.multiLang"), nn: "yes", uw: "no", ar: "no" },
                    { feature: t("home.competitive.npContent"), nn: "yes", uw: "no", ar: "no" },
                    { feature: t("home.competitive.caContent"), nn: "yes", uw: "limited", ar: "no" },
                    { feature: t("home.competitive.freeContent"), nn: "yes", uw: "no", ar: "no" },
                  ] as Array<{ feature: string; nn: string; uw: string; ar: string; isPrice?: true }>).map((row, i) => {
                    const renderCell = (val: string, highlight?: boolean) => {
                      if (row.isPrice) return <span className={`text-sm ${highlight ? "font-bold text-primary" : "text-gray-600"}`}>{val}</span>;
                      if (val === "yes") return <CircleCheck className="w-5 h-5 text-emerald-500 mx-auto" />;
                      if (val === "limited") return <span className="text-xs text-gray-400">{t("home.competitive.limited")}</span>;
                      return <XCircle className="w-5 h-5 text-gray-300 mx-auto" />;
                    };
                    return (
                    <tr key={i} className="border-b border-gray-100 last:border-0" data-testid={`row-competitive-${i}`}>
                      <td className="py-3.5 px-5 text-sm font-medium text-gray-700">{row.feature}</td>
                      <td className="py-3.5 px-5 text-center bg-primary/5">{renderCell(row.nn, true)}</td>
                      <td className="py-3.5 px-5 text-center">{renderCell(row.uw)}</td>
                      <td className="py-3.5 px-5 text-center">{renderCell(row.ar)}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm" data-testid="badge-guarantee">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">{t("home.guarantee.badge")}</span>
              </div>
              <p className="text-sm text-gray-500">{t("home.guarantee.desc")}</p>
            </div>
          </div>
        </section>

        {/* Featured Study Resources */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-white to-primary/5 border-t border-gray-100" data-testid="section-featured-resources">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.featured.badge")}</span>
                </div>
                <h2 className="font-bold text-gray-900 mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-featured-heading">{t("home.featured.heading")}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("home.featured.subtitle")}</p>
              </div>
              <div className={`grid gap-6 ${featuredProducts.length === 1 ? 'max-w-sm mx-auto' : featuredProducts.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : featuredProducts.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group"
                    onClick={() => setLocation(`/shop/${product.slug}`)}
                    data-testid={`card-featured-product-${product.slug}`}
                  >
                    {product.coverImageUrl && (
                      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                        <img
                          src={product.coverImageUrl}
                          alt={product.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">{product.category}</span>
                        {product.tierTarget && product.tierTarget !== "all" && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{product.tierTarget}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">{product.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.shortDescription || product.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-primary">${(product.price / 100).toFixed(2)}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">${(product.compareAtPrice / 100).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-primary/20 hover:bg-primary/5 text-gray-700"
                  onClick={() => setLocation("/shop")}
                  data-testid="button-view-all-resources"
                >
                  {t("home.featured.viewAll")}
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50" data-testid="section-faq-home">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-faq-heading">{t("home.faq.heading")}</h2>
              <p className="text-lg text-gray-600">{t("home.faq.subtitle")}</p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="faq-1" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q1")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a1")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q2")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a2")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q3")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a3")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q4")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a4")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q5")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a5")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-6" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q6")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a6")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-6b" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q6b")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a6b")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-7" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q7")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a7")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-8" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q8")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a8")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-9" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q9")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a9prefix")} {formatCount(questionCount).replace('+', '')} {t("home.faq.a9suffix")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-10" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q10")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a10")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-11" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q11")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a11")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-12" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q12")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a12")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-13" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q13")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a13")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-14" className="bg-white rounded-xl border border-gray-100 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {t("home.faq.q14")}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {t("home.faq.a14")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center mt-8">
              <Button variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5 text-gray-700" onClick={() => setLocation("/faq")} data-testid="button-view-all-faq">
                {t("home.faq.viewAll")}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Email Capture Section */}
        <section className="py-20 bg-white" data-testid="section-email-capture">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-primary/5 to-accent-foreground/5 rounded-2xl shadow-lg border border-primary/10 p-8 sm:p-12">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-email-heading">{t("home.email.title")}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t("home.email.subtitle")}
              </p>
              {emailStatus === "success" ? (
                <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-3" data-testid="text-subscribe-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{emailMessage}</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 max-w-md mx-auto">
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailStatus === "error") setEmailStatus("idle"); }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubscribe(); }}
                      placeholder={t("home.email.placeholder")} 
                      className="h-12 px-4 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                      data-testid="input-email"
                    />
                    <div className="flex items-center gap-2 justify-center">
                      <label className="text-sm text-gray-500">{t("home.email.frequencyLabel")}</label>
                      <select
                        value={emailFrequency}
                        onChange={(e) => setEmailFrequency(e.target.value)}
                        className="h-10 px-3 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                        data-testid="select-frequency"
                      >
                        <option value="daily">{t("home.email.freq.daily")}</option>
                        <option value="every_other_day">{t("home.email.freq.everyOtherDay")}</option>
                        <option value="twice_week">{t("home.email.freq.twiceWeek")}</option>
                        <option value="3x_week">{t("home.email.freq.threeWeek")}</option>
                        <option value="weekly">{t("home.email.freq.weekly")}</option>
                        <option value="biweekly">{t("home.email.freq.biweekly")}</option>
                        <option value="monthly">{t("home.email.freq.monthly")}</option>
                      </select>
                    </div>
                    <Button 
                      className="h-12 px-6 rounded-full bg-primary hover:brightness-110 text-white shadow-sm" 
                      data-testid="button-subscribe"
                      onClick={handleEmailSubscribe}
                      disabled={emailStatus === "loading"}
                    >
                      {emailStatus === "loading" ? "..." : t("home.email.button")}
                    </Button>
                  </div>
                  {emailStatus === "error" && (
                    <p className="text-sm text-red-500 mt-2" data-testid="text-subscribe-error">{emailMessage}</p>
                  )}
                </>
              )}
              <p className="text-xs text-gray-400 mt-4">{t("home.email.disclaimer")}</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-primary/5" data-testid="section-final-cta">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: 'var(--text-section)' }} data-testid="text-cta-heading">
              {t("home.cta.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("home.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 text-white transition-[transform,box-shadow] hover:-translate-y-1" 
                onClick={() => setLocation("/start-free")}
                data-testid="button-cta-start"
              >
                {t("home.cta.button")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg rounded-full border-2 border-primary/20 hover:bg-primary/5 text-gray-700" 
                onClick={() => setLocation("/pricing")}
                data-testid="button-cta-pricing"
              >
                {t("home.hero.cta2")}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">{t("home.guarantee.badge")}</span>
            </div>
            <p className="text-sm text-gray-400">{t("home.cta.disclaimer")}</p>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent-foreground/5 rounded-full blur-3xl -z-10 opacity-40" />
        </section>
        </LazySection>
    </>
  );
}

export default HomeBottomSections;
