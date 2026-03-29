"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import type { HeroStats } from "@shared/lesson-stats";

/** Subset of legacy shop product; avoids importing `@shared/schema` (drizzle) into Core. */
export interface FeaturedDigitalProduct {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  category: string;
  tierTarget?: string | null;
  price: number;
  compareAtPrice?: number | null;
}
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
  featuredProducts: FeaturedDigitalProduct[];
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
  const { t } = useMarketingI18n();
  const router = useRouter();

  return (
    <>
                <section className="border-t border-border" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-study-tools">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="nn-accent-soft-ring mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeBottomSections.builtForYou")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-study-tools-heading">
                Your Personalized Exam Toolkit
              </h2>
              <p className="text-lg text-foreground max-w-3xl mx-auto">
                Every student's journey is unique. NurseNest adapts to your strengths, targets your weak areas, and tracks your progress toward exam readiness.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div
                className="relative bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/study-plan"))}
                data-testid="card-promo-study-planner"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="absolute top-3 right-3 z-10 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                  {t("components.homeBottomSections.personalized")}
                </div>
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <Brain className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("components.homeBottomSections.customStudyPlanner")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">
                  Get a personalized study schedule built around your exam date, available hours, and weak areas. Your plan adapts as you progress.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.dailyTasks")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.adaptive")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.progressTracking")}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-primary transition-all group-hover:gap-2">
                  <span>{t("components.homeBottomSections.createYourPlan")}</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div
                className="relative bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/mock-exams"))}
                data-testid="card-promo-readiness-exam"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="absolute top-3 right-3 z-10 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                  {t("components.homeBottomSections.free")}
                </div>
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <ShieldCheck className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("components.homeBottomSections.freeReadinessExam")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">
                  Take a 25-question readiness check to gauge your exam preparedness. Instant results with a detailed performance breakdown. No account required.
                </p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.25Questions")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.instantResults")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.noCost")}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-primary transition-all group-hover:gap-2">
                  <span>{t("components.homeBottomSections.takeTheFreeExam")}</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div
                className="relative bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/reports"))}
                data-testid="card-promo-report-card"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <BarChart3 className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("components.homeBottomSections.performanceReportCard")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">
                  Track your progress across every body system and competency domain. Identify strengths, target weaknesses, and watch your readiness score climb.
                </p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.scoreTrends")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.domainAnalysis")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("components.homeBottomSections.weakAreaDetection")}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-primary transition-all group-hover:gap-2">
                  <span>{t("components.homeBottomSections.viewYourReportCard")}</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/20"
                onClick={() => router.push(mapLegacyMarketingHref("/free-practice"))}
                data-testid="button-promo-get-started"
              >
                Start Free - Build Your Study Plan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* trust-showcase omitted in Core */}

        {/* Choose Your Exam Path */}
        <section className="py-16 bg-gradient-to-b from-[var(--theme-page-bg)] to-primary/5 relative z-10 border-t border-border" data-testid="section-exam-path">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.examPath.badge")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-exam-path-heading">{t("home.examPath.heading")}</h2>
              <p className="text-lg text-foreground max-w-3xl mx-auto">{t("home.examPath.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card
                className={`group relative cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${region === "CA" ? "ring-2 ring-primary shadow-lg" : "border-border hover:border-primary/35"}`}
                onClick={() => router.push(mapLegacyMarketingHref("/rex-pn-guide"))}
                data-testid="card-exam-path-ca"
              >
                {region === "CA" && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-[10px] text-primary-foreground">{t("home.examPath.yourRegion")}</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="nn-accent-icon-wrap flex h-12 w-12 items-center justify-center rounded-xl">
                      <span className="text-2xl" role="img" aria-label={t("components.homeBottomSections.canada")}>🍁</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--theme-heading-text)] text-lg" data-testid="text-exam-path-ca-title">{t("home.examPath.ca.title")}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{t("home.examPath.ca.subtitle")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4" data-testid="text-exam-path-ca-desc">{t("home.examPath.ca.desc")}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">{t("home.examPath.ca.pill1")}</span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">{t("home.examPath.ca.pill2")}</span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">{t("home.examPath.ca.pill3")}</span>
                  </div>
                  <Button variant="outline" className="w-full rounded-full border-primary/25 text-primary hover:bg-primary/5 group-hover:border-primary/40" data-testid="button-exam-path-ca">
                    {t("home.examPath.ca.cta")}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card
                className={`group relative cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${region === "US" ? "ring-2 ring-primary shadow-lg" : "border-border hover:border-primary/35"}`}
                onClick={() => router.push(mapLegacyMarketingHref("/nclex-rn-guide"))}
                data-testid="card-exam-path-us"
              >
                {region === "US" && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-[10px] text-primary-foreground">{t("home.examPath.yourRegion")}</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="nn-accent-icon-wrap flex h-12 w-12 items-center justify-center rounded-xl">
                      <span className="text-2xl" role="img" aria-label={t("components.homeBottomSections.unitedStates")}>🇺🇸</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--theme-heading-text)] text-lg" data-testid="text-exam-path-us-title">{t("home.examPath.us.title")}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{t("home.examPath.us.subtitle")}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4" data-testid="text-exam-path-us-desc">{t("home.examPath.us.desc")}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">{t("home.examPath.us.pill1")}</span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">{t("home.examPath.us.pill2")}</span>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">{t("home.examPath.us.pill3")}</span>
                  </div>
                  <Button variant="outline" className="w-full rounded-full border-primary/25 text-primary hover:bg-primary/5 group-hover:border-primary/40" data-testid="button-exam-path-us">
                    {t("home.examPath.us.cta")}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">{t("home.examPath.bothNote")}</p>
          </div>
        </section>

        {/* 3-Step How It Works */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-[var(--theme-page-bg)] relative z-10 border-t border-primary/10" data-testid="section-how-it-works">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.howItWorks.badge")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-how-it-works-heading">{t("home.howItWorks.heading")}</h2>
              <p className="text-lg text-foreground">{t("home.howItWorks.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", icon: BookOpen, title: t("home.howItWorks.step1.title"), desc: t("home.howItWorks.step1.desc") },
                { step: "2", icon: Target, title: t("home.howItWorks.step2.title"), desc: t("home.howItWorks.step2.desc") },
                { step: "3", icon: Trophy, title: t("home.howItWorks.step3.title"), desc: t("home.howItWorks.step3.desc") },
              ].map((item, i) => (
                <div key={i} className="relative text-center" data-testid={`step-how-it-works-${i}`}>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-muted-foreground/30 to-transparent z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="nn-theme-gradient-br mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg">
                      <item.icon className="h-9 w-9 text-white" />
                    </div>
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3">{item.step}</div>
                    <h3 className="text-xl font-bold text-[var(--theme-heading-text)] mb-2">{item.title}</h3>
                    <p className="text-sm text-foreground leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-14 bg-card border-y border-border" data-testid="section-social-proof">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="nn-accent-soft-ring mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("home.socialProof.badge")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)]" style={{ fontSize: 'var(--text-section)' }} data-testid="text-social-proof-heading">{t("home.socialProof.heading")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/8 to-[var(--theme-page-bg)] p-5 text-center" data-testid="stat-social-students">
                <Users className="mx-auto mb-2 h-7 w-7 text-primary" />
                <div className="text-3xl font-extrabold text-[var(--theme-heading-text)]">5,000+</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{t("home.socialProof.students")}</div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/8 to-[var(--theme-page-bg)] p-5 text-center" data-testid="stat-social-pass-rate">
                <BadgeCheck className="mx-auto mb-2 h-7 w-7 text-primary" />
                <div className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{t("home.socialProof.passRateValue")}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{t("home.socialProof.passRate")}</div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/8 to-[var(--theme-page-bg)] p-5 text-center" data-testid="stat-social-questions">
                <Target className="mx-auto mb-2 h-7 w-7 text-primary" />
                <div className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{formatCount(questionCount)}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{t("home.socialProof.questions")}</div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/8 to-[var(--theme-page-bg)] p-5 text-center" data-testid="stat-social-lessons">
                <BookOpen className="mx-auto mb-2 h-7 w-7 text-primary" />
                <div className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{formatCount(lessonCount)}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{t("home.socialProof.lessons")}</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>{t("home.socialProof.updatedDesc")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* What's New Section */}
        <section className="relative z-10 border-t border-primary/15 bg-gradient-to-b from-primary/5 to-[var(--theme-page-bg)] py-12" data-testid="section-whats-new">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="h-px max-w-[60px] flex-1 bg-gradient-to-r from-transparent to-primary/35" />
              <div className="nn-accent-soft-ring inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("home.new.badge")}</span>
              </div>
              <div className="h-px max-w-[60px] flex-1 bg-gradient-to-l from-transparent to-primary/35" />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div
                className="group cursor-pointer rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                onClick={() => router.push(mapLegacyMarketingHref("/flashcards"))}
                data-testid="card-new-decks"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="nn-accent-icon-wrap flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                    <Layers className="nn-accent-icon h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">{t("home.new.label")}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--theme-heading-text)] mb-1.5">{t("home.new.decks.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed">{t("home.new.decks.desc")}</p>
              </div>

              <div
                className="group cursor-pointer rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                onClick={() => router.push(mapLegacyMarketingHref("/blog"))}
                data-testid="card-new-blog"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="nn-accent-icon-wrap flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                    <FileText className="nn-accent-icon h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">{t("home.new.label")}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--theme-heading-text)] mb-1.5">{t("home.new.blog.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed">{t("home.new.blog.desc")}</p>
              </div>

              <div
                className="group cursor-pointer rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                onClick={() => router.push(mapLegacyMarketingHref("/lessons"))}
                data-testid="card-new-languages"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="nn-accent-icon-wrap flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                    <Globe className="nn-accent-icon h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">{t("home.new.label")}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--theme-heading-text)] mb-1.5">{t("home.new.languages.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed">{t("home.new.languages.desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features Showcase */}
        <section className="py-20 bg-gradient-to-b from-[var(--theme-page-bg)] via-primary/3 to-[var(--theme-page-bg)] relative z-10" data-testid="section-platform-features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-5">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.platform.badge")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-5" style={{ fontSize: 'var(--text-section)' }} data-testid="text-features-heading">
                {t("home.features.title")}
              </h2>
              <p className="text-lg text-foreground leading-relaxed">
                {t("home.features.subtitle")}
              </p>
            </div>

            {/* Headline Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
              {[
                { value: formatCount(questionCount), label: t("home.stats.questions"), icon: Target },
                { value: formatCount(lessonCount), label: t("home.stats.lessons"), icon: BookOpen },
                {
                  value: storeProductCount > 0 ? `${storeProductCount}+` : "9",
                  label: storeProductCount > 0 ? t("home.stats.studyPacks") : t("home.stats.simulators"),
                  icon: storeProductCount > 0 ? ShoppingBag : Gamepad2,
                },
                { value: "7+", label: t("home.stats.modes"), icon: Layers },
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 text-center shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]" data-testid={`stat-feature-${i}`}>
                  <div className="nn-theme-gradient-br absolute left-0 top-0 h-1 w-full" />
                  <div className="nn-accent-icon-wrap mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    <stat.icon className="nn-accent-icon h-5 w-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--theme-heading-text)]">{stat.value}</div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Main Feature Cards - 2x3 Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {/* Mock Exams */}
              <div
                className="bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/mock-exams"))}
                data-testid="card-feature-mock-exams"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <ClipboardCheck className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("home.exams.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">{t("home.exams.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.examFormat")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.scoreTrends")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.autoSave")}</span>
                </div>
              </div>

              {/* Clinical Simulators */}
              <div
                className="bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/first-action-simulator"))}
                data-testid="card-feature-simulators"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <Stethoscope className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("home.simulators.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">{t("home.simulators.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.branching")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.instantFeedback")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.free2")}</span>
                </div>
              </div>

              {/* Test Bank */}
              <div
                className="bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/free-practice"))}
                data-testid="card-feature-test-bank"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <Target className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{formatCount(questionCount)} {t("home.qbank.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">{t("home.qbank.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    RPN/LVN/RN/NP {t("home.feature.tierLevels")}
                  </span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.deepRationales")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.progressTracking")}</span>
                </div>
              </div>

              {/* Flashcard Decks */}
              <div
                className="bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/flashcards"))}
                data-testid="card-feature-flashcards"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="absolute right-3 top-3 z-10 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">{t("home.new.label")}</div>
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <Layers className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("home.flashcards.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">{t("home.flashcards.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.learnMode")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.testMode")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.accuracyCheck")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.csvImport")}</span>
                </div>
              </div>

              {/* Med Math & Lab Values */}
              <div
                className="bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/med-math"))}
                data-testid="card-feature-med-math"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <Calculator className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("home.tools.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">{t("home.tools.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.stepwise")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.abg")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.labClusters")}</span>
                </div>
              </div>

              {/* Video Lectures */}
              <div
                className="bg-card rounded-2xl border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group relative overflow-hidden"
                onClick={() => router.push(mapLegacyMarketingHref("/lectures"))}
                data-testid="card-feature-lectures"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-primary/15 to-transparent" />
                <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <PlayCircle className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--theme-heading-text)] mb-2">{t("home.lessons.title")}</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">{t("home.lessons.desc")}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.videoLectures")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.clinicalPearls")}</span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("home.feature.freeContent")}</span>
                </div>
              </div>
            </div>

            {/* Secondary Features Strip */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="flex items-center gap-3 bg-card rounded-xl border border-border/80 shadow-[var(--shadow-card)] p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200 cursor-pointer" onClick={() => router.push(mapLegacyMarketingHref("/dashboard"))} data-testid="card-feature-dashboard">
                <div className="nn-accent-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <LayoutDashboard className="nn-accent-icon h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.secondary.dashboard")}</h4>
                  <p className="text-xs text-muted-foreground">{t("home.secondary.dashboardDesc")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-card rounded-xl border border-border/80 shadow-[var(--shadow-card)] p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200 cursor-pointer" onClick={() => router.push(mapLegacyMarketingHref("/reports"))} data-testid="card-feature-analytics">
                <div className="nn-accent-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <BarChart3 className="nn-accent-icon h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.secondary.analytics")}</h4>
                  <p className="text-xs text-muted-foreground">{t("home.secondary.analyticsDesc")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-card rounded-xl border border-border/80 shadow-[var(--shadow-card)] p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200 cursor-pointer" onClick={() => router.push(mapLegacyMarketingHref("/question-of-the-day"))} data-testid="card-feature-qotd">
                <div className="nn-accent-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <MessageSquareQuote className="nn-accent-icon h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.secondary.qotd")}</h4>
                  <p className="text-xs text-muted-foreground">{t("home.secondary.qotdDesc")}</p>
                </div>
              </div>

              <div className="relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md" onClick={() => router.push(mapLegacyMarketingHref("/blog"))} data-testid="card-feature-blog">
                <div className="absolute right-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary-foreground">{t("home.new.label")}</div>
                <div className="nn-accent-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Newspaper className="nn-accent-icon h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.secondary.blog")}</h4>
                  <p className="text-xs text-muted-foreground">{t("home.secondary.blogDesc")}</p>
                </div>
              </div>
            </div>

            {/* Differentiators Row */}
            <div className="bg-gradient-to-r from-primary/5 via-[var(--theme-page-bg)] to-primary/5 rounded-2xl border border-primary/10 p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.diff.region")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("home.diff.regionDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Microscope className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.diff.patho")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("home.diff.pathoDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.diff.scope")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">RPN/LVN {t("home.diff.scopeDesc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.diff.languages")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("home.diff.languagesDesc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button
                size="lg"
                className="h-14 px-10 text-lg rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 text-white transition-[transform,box-shadow] hover:-translate-y-1"
                onClick={() => router.push(mapLegacyMarketingHref("/start-free"))}
                data-testid="button-features-start-free"
              >
                {t("home.startFree")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Free Interactive Learning Section */}
        <section className="py-20 bg-gradient-to-b from-[var(--theme-page-bg)] to-primary/5 relative z-10" data-testid="section-free-learning">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("home.free.badge")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-free-learning-heading">{t("home.free.title")}</h2>
              <p className="text-lg text-foreground leading-relaxed">
                {t("home.free.subtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border border-primary/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden bg-card cursor-pointer group" onClick={() => router.push(mapLegacyMarketingHref("/pre-nursing"))} data-testid="card-free-pre-nursing">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--theme-heading-text)] mb-2">{t("home.free.preNursing")}</h3>
                  <p className="text-sm text-foreground mb-3">{t("home.free.preNursingDesc")}</p>
                  <span className="text-xs text-primary font-medium">{t("home.free.preNursingMeta")}</span>
                </CardContent>
              </Card>

              <Card className="border border-primary/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden bg-card cursor-pointer group" onClick={() => router.push(mapLegacyMarketingHref("/anatomy"))} data-testid="card-free-anatomy">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <HeartPulse className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--theme-heading-text)] mb-2">{t("home.free.anatomy")}</h3>
                  <p className="text-sm text-foreground mb-3">{t("home.free.anatomyDesc")}</p>
                  <span className="text-xs text-primary font-medium">{t("home.free.anatomyMeta")}</span>
                </CardContent>
              </Card>

              <Card className="border border-primary/15 shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden bg-card cursor-pointer group" onClick={() => router.push(mapLegacyMarketingHref("/clinical-clarity"))} data-testid="card-free-clinical-clarity">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--theme-heading-text)] mb-2">{t("home.free.clarity")}</h3>
                  <p className="text-sm text-foreground mb-3">{t("home.free.clarityDesc")}</p>
                  <span className="text-xs text-primary font-medium">{t("home.free.clarityMeta")}</span>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-10">
              <Button className="rounded-full px-8 h-12 bg-primary hover:brightness-110 text-white shadow-md" onClick={() => router.push(mapLegacyMarketingHref("/pre-nursing"))} data-testid="button-explore-free">
                {t("home.free.explore")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* What You Can Study Section */}
        <section className="py-24 bg-card/50 backdrop-blur-sm relative z-10" data-testid="section-study-topics">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-6">
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-study-heading">{t("home.study.heading")}</h2>
              <p className="text-lg text-foreground leading-relaxed">
                {t("home.study.subtitle")}
              </p>
            </div>

            <p className="text-center text-sm text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t("home.study.subtext")}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: HeartPulse, title: t("home.study.medsurg"), desc: t("home.study.medsurgDesc") },
                { icon: Pill, title: t("home.study.pharm"), desc: t("home.study.pharmDesc") },
                { icon: Baby, title: t("home.study.maternal"), desc: t("home.study.maternalDesc") },
                { icon: Brain, title: t("home.study.mental"), desc: t("home.study.mentalDesc") },
                { icon: FlaskConical, title: t("home.study.lab"), desc: t("home.study.labDesc") },
                { icon: Activity, title: t("home.study.critical"), desc: t("home.study.criticalDesc") },
                { icon: Target, title: t("home.study.priority"), desc: t("home.study.priorityDesc") },
                { icon: Stethoscope, title: t("home.study.cases"), desc: t("home.study.casesDesc") },
                { icon: GraduationCap, title: t("home.study.patho"), desc: t("home.study.pathoDesc") },
              ].map((topic, i) => (
                <Card key={i} className="border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden group bg-card cursor-pointer" onClick={() => router.push(mapLegacyMarketingHref("/lessons"))} data-testid={`card-topic-${i}`}>
                  <CardContent className="p-6">
                    <div className="nn-accent-icon-wrap mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                      <topic.icon className="nn-accent-icon h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--theme-heading-text)] mb-2">{topic.title}</h3>
                    <p className="text-sm text-foreground leading-relaxed">{topic.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5 text-[var(--theme-heading-text)]" onClick={() => router.push(mapLegacyMarketingHref("/lessons"))} data-testid="button-browse-all-topics">
                {t("home.study.browseAll")} ({formatCount(lessonCount)})
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card border-b border-border" data-testid="section-most-tested">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="nn-accent-soft-ring mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm">
                <AlertTriangle className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t("home.mostTested.badge")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-most-tested-heading">{t("home.mostTested.heading")}</h2>
              <p className="text-foreground">{t("home.mostTested.subtitle")}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Droplets, title: t("home.mostTested.electrolytes"), desc: t("home.mostTested.electrolytesDesc"), href: "/study-guide/electrolytes-acid-base-nursing-guide" },
                { icon: HeartPulse, title: t("home.mostTested.ecg"), desc: t("home.mostTested.ecgDesc"), href: "/study-guide/cardiac-emergencies-nursing-guide" },
                { icon: Thermometer, title: t("home.mostTested.sepsis"), desc: t("home.mostTested.sepsisDesc"), href: "/study-guide/sepsis-shock-nursing-guide" },
                { icon: Baby, title: t("home.mostTested.ob"), desc: t("home.mostTested.obDesc"), href: "/study-guide/ob-emergencies-nursing-guide" },
                { icon: FlaskConical, title: t("home.mostTested.pharm"), desc: t("home.mostTested.pharmDesc"), href: "/study-guide/pharmacology-high-yield-nursing-guide" },
                { icon: Brain, title: t("home.mostTested.neuro"), desc: t("home.mostTested.neuroDesc"), href: "/lessons/stroke" },
              ].map((topic, i) => (
                <Card 
                  key={i} 
                  className="border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden group bg-card cursor-pointer" 
                  onClick={() => router.push(mapLegacyMarketingHref(topic.href))} 
                  data-testid={`card-most-tested-${i}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="nn-accent-icon-wrap flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                        <topic.icon className="nn-accent-icon h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[var(--theme-heading-text)] text-sm mb-1">{topic.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{topic.desc}</p>
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-primary/20 shadow-sm mb-6">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("home.nurses.badge")}</span>
                </div>
                <h2 className="font-bold text-[var(--theme-heading-text)] mb-6" style={{ fontSize: 'var(--text-section)' }} data-testid="text-new-nurses-heading">
                  {t("home.nurses.heading")}
                </h2>
                <p className="text-lg text-foreground mb-6 leading-relaxed">
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
                        <h4 className="font-semibold text-[var(--theme-heading-text)] text-sm">{item.title}</h4>
                        <p className="text-sm text-foreground">{item.desc}</p>
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
                  <div key={i} className="bg-card rounded-2xl p-6 shadow-sm border border-primary/5 text-center" data-testid={`stat-${i}`}>
                    <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-[var(--theme-heading-text)]">{stat.value}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why NurseNest Section */}
        <section className="py-24 bg-card" data-testid="section-why-nursenest">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-why-heading">{t("home.why.heading")}</h2>
              <p className="text-lg text-foreground leading-relaxed">
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
                <div key={i} className="bg-muted/80 rounded-2xl p-8 hover:shadow-md transition-shadow duration-300 border border-border" data-testid={`card-feature-${i}`}>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--theme-heading-text)] mb-3">{feature.title}</h3>
                  <p className="text-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flashcard Trust Section */}
        <section className="py-24 bg-gradient-to-b from-muted to-[var(--theme-page-bg)]" data-testid="section-flashcard-trust">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="nn-accent-soft-ring mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-primary" data-testid="badge-flashcard-warning">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                {t("home.flashcardTrust.warningBadge")}
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-flashcard-trust-heading">
                {t("home.flashcardTrust.heading")}
              </h2>
              <p className="text-lg text-foreground leading-relaxed" data-testid="text-flashcard-trust-subtitle">
                {t("home.flashcardTrust.subtitle")}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              <div className="rounded-2xl border border-border bg-muted/80 p-8" data-testid="card-other-platforms">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/80">
                    <XCircle className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("home.flashcardTrust.otherPlatforms")}</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    t("home.flashcardTrust.issue1"),
                    t("home.flashcardTrust.issue2"),
                    t("home.flashcardTrust.issue3"),
                    t("home.flashcardTrust.issue4"),
                  ].map((issue, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-issue-${i}`}>
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm text-[var(--theme-heading-text)] leading-relaxed">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8" data-testid="card-nursenest-flashcards">
                <div className="mb-6 flex items-center gap-3">
                  <div className="nn-accent-icon-wrap flex h-10 w-10 items-center justify-center rounded-xl">
                    <ShieldCheck className="nn-accent-icon h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("home.flashcardTrust.nurseNest")}</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    t("home.flashcardTrust.benefit1"),
                    t("home.flashcardTrust.benefit2"),
                    t("home.flashcardTrust.benefit3"),
                    t("home.flashcardTrust.benefit4"),
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`text-benefit-${i}`}>
                      <CircleCheck className="nn-trust-check mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-[var(--theme-heading-text)] leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mx-auto max-w-3xl rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/8 to-primary/5 p-8 shadow-sm" data-testid="card-flashcard-user-created">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[var(--theme-heading-text)]" data-testid="text-flashcard-user-created-heading">
                  {t("home.flashcardTrust.userCreated.heading")}
                </h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5" data-testid="text-flashcard-user-created-desc">
                {t("home.flashcardTrust.userCreated.desc")}
              </p>
              <ul className="space-y-3">
                {[
                  t("home.flashcardTrust.userCreated.benefit1"),
                  t("home.flashcardTrust.userCreated.benefit2"),
                  t("home.flashcardTrust.userCreated.benefit3"),
                  t("home.flashcardTrust.userCreated.benefit4"),
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--theme-heading-text)]" data-testid={`text-flashcard-user-benefit-${i}`}>
                    <CircleCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 max-w-3xl mx-auto text-center" data-testid="card-flashcard-trust-cta">
              <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-[var(--theme-heading-text)] mb-3" data-testid="text-flashcard-trust-cta">
                {t("home.flashcardTrust.ctaTitle")}
              </h3>
              <p className="text-sm text-foreground leading-relaxed mb-6" data-testid="text-flashcard-trust-cta-desc">
                {t("home.flashcardTrust.ctaDesc")}
              </p>
              <button
                onClick={() => router.push(mapLegacyMarketingHref("/flashcards"))}
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
        <section className="py-20 bg-gradient-to-b from-muted to-[var(--theme-page-bg)]" data-testid="section-competitive">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="nn-accent-soft-ring mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("home.competitive.badge")}</span>
              </div>
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-competitive-heading">{t("home.competitive.heading")}</h2>
              <p className="text-lg text-foreground">{t("home.competitive.subtitle")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-card rounded-2xl border border-border shadow-md overflow-hidden" data-testid="table-competitive">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-5 text-sm font-semibold text-muted-foreground">{t("home.competitive.feature")}</th>
                    <th className="text-center py-4 px-5 text-sm font-bold text-primary bg-primary/5">{t("home.competitive.nursenest")}</th>
                    <th className="text-center py-4 px-5 text-sm font-semibold text-muted-foreground">{t("home.competitive.uworld")}</th>
                    <th className="text-center py-4 px-5 text-sm font-semibold text-muted-foreground">{t("home.competitive.archer")}</th>
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
                      if (row.isPrice) return <span className={`text-sm ${highlight ? "font-bold text-primary" : "text-foreground"}`}>{val}</span>;
                      if (val === "yes") return <CircleCheck className="nn-trust-check mx-auto h-5 w-5" />;
                      if (val === "limited") return <span className="text-xs text-muted-foreground">{t("home.competitive.limited")}</span>;
                      return <XCircle className="w-5 h-5 text-muted-foreground/40 mx-auto" />;
                    };
                    return (
                    <tr key={i} className="border-b border-border last:border-0" data-testid={`row-competitive-${i}`}>
                      <td className="py-3.5 px-5 text-sm font-medium text-[var(--theme-heading-text)]">{row.feature}</td>
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
              <div className="nn-accent-soft-ring inline-flex items-center gap-2 rounded-full border px-5 py-2.5 shadow-sm" data-testid="badge-guarantee">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">{t("home.guarantee.badge")}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t("home.guarantee.desc")}</p>
            </div>
          </div>
        </section>

        {/* Featured Study Resources */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-[var(--theme-page-bg)] to-primary/5 border-t border-border" data-testid="section-featured-resources">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("home.featured.badge")}</span>
                </div>
                <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-featured-heading">{t("home.featured.heading")}</h2>
                <p className="text-lg text-foreground max-w-2xl mx-auto">{t("home.featured.subtitle")}</p>
              </div>
              <div className={`grid gap-6 ${featuredProducts.length === 1 ? 'max-w-sm mx-auto' : featuredProducts.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : featuredProducts.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-2xl border border-border shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer group"
                    onClick={() => router.push(mapLegacyMarketingHref(`/shop/${product.slug}`))}
                    data-testid={`card-featured-product-${product.slug}`}
                  >
                    {product.coverImageUrl && (
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
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
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{product.tierTarget}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[var(--theme-heading-text)] mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">{product.title}</h3>
                      <p className="text-sm text-foreground line-clamp-2 mb-3">{product.shortDescription || product.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-primary">${(product.price / 100).toFixed(2)}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">${(product.compareAtPrice / 100).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-primary/20 hover:bg-primary/5 text-[var(--theme-heading-text)]"
                  onClick={() => router.push(mapLegacyMarketingHref("/shop"))}
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
        <section className="py-24 bg-gradient-to-b from-[var(--theme-page-bg)] to-muted" data-testid="section-faq-home">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-bold text-[var(--theme-heading-text)] mb-4" style={{ fontSize: 'var(--text-section)' }} data-testid="text-faq-heading">{t("home.faq.heading")}</h2>
              <p className="text-lg text-foreground">{t("home.faq.subtitle")}</p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="faq-1" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q1")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a1")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q2")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a2")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q3")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a3")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q4")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a4")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q5")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a5")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-6" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q6")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a6")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-6b" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q6b")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a6b")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-7" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q7")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a7")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-8" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q8")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a8")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-9" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q9")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a9prefix")} {formatCount(questionCount).replace('+', '')} {t("home.faq.a9suffix")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-10" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q10")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a10")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-11" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q11")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a11")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-12" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q12")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a12")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-13" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q13")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a13")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-14" className="bg-card rounded-xl border border-border shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-[var(--theme-heading-text)] hover:no-underline py-5">
                  {t("home.faq.q14")}
                </AccordionTrigger>
                <AccordionContent className="text-foreground pb-5 leading-relaxed">
                  {t("home.faq.a14")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center mt-8">
              <Button variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/5 text-[var(--theme-heading-text)]" onClick={() => router.push(mapLegacyMarketingHref("/faq"))} data-testid="button-view-all-faq">
                {t("home.faq.viewAll")}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Email Capture Section */}
        <section className="py-20 bg-card" data-testid="section-email-capture">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-primary/5 to-accent-foreground/5 rounded-2xl shadow-lg border border-primary/10 p-8 sm:p-12">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--theme-heading-text)] mb-3" data-testid="text-email-heading">{t("home.email.title")}</h2>
              <p className="text-foreground mb-8 leading-relaxed">
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
                      className="h-12 px-4 rounded-full border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-card"
                      data-testid="input-email"
                    />
                    <div className="flex items-center gap-2 justify-center">
                      <label className="text-sm text-muted-foreground">{t("home.email.frequencyLabel")}</label>
                      <select
                        value={emailFrequency}
                        onChange={(e) => setEmailFrequency(e.target.value)}
                        className="h-10 px-3 rounded-full border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-card"
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
              <p className="text-xs text-muted-foreground mt-4">{t("home.email.disclaimer")}</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[var(--theme-page-bg)] to-primary/5" data-testid="section-final-cta">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="font-bold text-[var(--theme-heading-text)] mb-6" style={{ fontSize: 'var(--text-section)' }} data-testid="text-cta-heading">
              {t("home.cta.title")}
            </h2>
            <p className="text-xl text-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("home.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full bg-primary hover:brightness-110 shadow-lg shadow-primary/20 text-white transition-[transform,box-shadow] hover:-translate-y-1" 
                onClick={() => router.push(mapLegacyMarketingHref("/start-free"))}
                data-testid="button-cta-start"
              >
                {t("home.cta.button")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg rounded-full border-2 border-primary/20 hover:bg-primary/5 text-[var(--theme-heading-text)]" 
                onClick={() => router.push(mapLegacyMarketingHref("/pricing"))}
                data-testid="button-cta-pricing"
              >
                {t("home.hero.cta2")}
              </Button>
            </div>
            <div className="mb-2 mt-6 flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">{t("home.guarantee.badge")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("home.cta.disclaimer")}</p>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent-foreground/5 rounded-full blur-3xl -z-10 opacity-40" />
        </section>
    </>
  );
}

export default HomeBottomSections;
