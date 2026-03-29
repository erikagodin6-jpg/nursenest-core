import { useLocation, Link } from "wouter";
import {
  ArrowRight,
  Check,
  X,
  ChevronRight,
  FlaskConical,
  ClipboardCheck,
  BarChart3,
  Brain,
  Shield,
  Target,
  Users,
  Stethoscope,
  Activity,
  Pill,
  BookOpen,
  Layers,
  Map,
  Calendar,
  Quote,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  type MarketingTrack,
  getMarketingCopy,
  resolveMarketingText,
} from "@/config/marketing-copy";
import type { LucideIcon } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState, useEffect } from "react";
import { useRegion } from "@/hooks/use-region";
import { ExplanationPromoBanner } from "@/components/explanation-panel";

import { useI18n } from "@/lib/i18n";
const iconMap: Record<string, LucideIcon> = {
  FlaskConical,
  ClipboardCheck,
  BarChart3,
  Brain,
  Shield,
  Target,
  Users,
  Stethoscope,
  Activity,
  Pill,
  BookOpen,
  Layers,
  Map,
  Calendar,
};

const trackAccentMap: Record<string, { gradient: string; badge: string; accent: string; light: string }> = {
  rpn: {
    gradient: "from-emerald-50 via-white to-emerald-50/30",
    badge: "border-emerald-400/40 text-emerald-700 bg-emerald-50",
    accent: "text-emerald-600",
    light: "bg-emerald-50",
  },
  rn: {
    gradient: "from-blue-50 via-white to-blue-50/30",
    badge: "border-blue-400/40 text-blue-700 bg-blue-50",
    accent: "text-blue-600",
    light: "bg-blue-50",
  },
  np: {
    gradient: "from-violet-50 via-white to-violet-50/30",
    badge: "border-violet-400/40 text-violet-700 bg-violet-50",
    accent: "text-violet-600",
    light: "bg-violet-50",
  },
};

const trackLabel: Record<string, string> = {
  rpn: "RPN",
  rn: "RN",
  np: "NP",
};

interface TrackLandingPageProps {
  track: MarketingTrack;
}

export default function TrackLandingPage({ track }: TrackLandingPageProps) {
  const { t } = useI18n();
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  const [, setLocation] = useLocation();
  const copy = getMarketingCopy(track);
  const defaultAccent = {
    gradient: "from-gray-50 via-white to-gray-50/30",
    badge: "border-primary/40 text-primary bg-primary/5",
    accent: "text-primary",
    light: "bg-primary/5",
  };
  const colors = trackAccentMap[track] || defaultAccent;
  const label = trackLabel[track] || "Nursing";

  const seoTitle = track === "rpn"
    ? "RPN Exam Prep - Practical Nursing Study Platform | NurseNest"
    : track === "rn"
    ? "RN Exam Prep - Clinical Judgment & Prioritization | NurseNest"
    : "NP Board Prep - Advanced Diagnostic Reasoning | NurseNest";

  const seoDesc = copy.hero.subheadline;

  return (
    <div className="min-h-screen bg-warmwhite font-sans" style={{ color: "#2E3A59" }}>
      <SEO title={seoTitle} description={seoDesc} />

      {copy.announcementBar && (
        <AnnouncementBar
          message={copy.announcementBar.message}
          ctaText={copy.announcementBar.ctaText}
          onCta={() => setLocation(copy.announcementBar!.ctaPath)}
        />
      )}

      <Navigation />

      <HeroSection copy={copy} colors={colors} label={label} onNavigate={setLocation} track={track} />

      {copy.trustStrip && (
        <TrustStrip items={copy.trustStrip.items.map(r)} colors={colors} />
      )}

      {copy.problemSection && (
        <ProblemSection section={copy.problemSection} colors={colors} />
      )}

      <SolutionSection copy={copy} colors={colors} />

      <section className="py-10" data-testid="section-explanation-promo">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ExplanationPromoBanner />
        </div>
      </section>

      {copy.featureCards && copy.featureCards.length > 0 && (
        <FeatureCardsSection cards={copy.featureCards.map(c => ({ ...c, description: r(c.description) }))} label={label} colors={colors} />
      )}

      {copy.howItWorks && copy.howItWorks.length > 0 && (
        <HowItWorksSection steps={copy.howItWorks} colors={colors} />
      )}

      {copy.dashboardPreview && (
        <DashboardPreviewSection preview={copy.dashboardPreview} colors={colors} />
      )}

      {copy.outcomesSection && (
        <OutcomesSection section={copy.outcomesSection} colors={colors} />
      )}

      {copy.testimonials.length > 0 && (
        <TestimonialsSection testimonials={copy.testimonials} colors={colors} />
      )}

      {copy.comparison && copy.comparison.length > 0 && (
        <ComparisonSection comparison={copy.comparison.map(c => ({ ...c, nursenest: r(c.nursenest) }))} label={label} colors={colors} />
      )}

      <FaqSection faq={copy.faq} colors={colors} />

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Explore More {label} Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`/${track}/questions`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-topic-questions">
              <Target className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.marketing.TrackLandingPage.questionsByTopic")}</h3>
                <p className="text-xs text-gray-500">{t("pages.marketing.TrackLandingPage.browsePracticeQuestionsByClinical")}</p>
              </div>
            </Link>
            <Link href={`/how-to-become-a-nurse/${track}`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-career-guide">
              <GraduationCap className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.marketing.TrackLandingPage.careerGuide")}</h3>
                <p className="text-xs text-gray-500">How to become a {label}</p>
              </div>
            </Link>
            <Link href="/practice-questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-practice-by-system">
              <BookOpen className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.marketing.TrackLandingPage.byBodySystem")}</h3>
                <p className="text-xs text-gray-500">{t("pages.marketing.TrackLandingPage.practiceByBodySystem")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {copy.finalCta && (
        <FinalCtaSection cta={copy.finalCta} colors={colors} onNavigate={setLocation} />
      )}

      <Footer />
    </div>
  );
}

function AnnouncementBar({ message, ctaText, onCta }: { message: string; ctaText: string; onCta: () => void }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-[#BFA6F6]/10 border-b border-[#BFA6F6]/20 py-2.5 px-4 text-center relative" data-testid="announcement-bar">
      <span className="text-sm text-[#2E3A59]/80">{message}</span>
      <button
        onClick={onCta}
        className="ml-3 text-sm font-medium text-[#BFA6F6] hover:text-[#a98cf0] underline underline-offset-2"
        data-testid="announcement-bar-cta"
      >
        {ctaText}
      </button>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2E3A59]/40 hover:text-[#2E3A59]/60"
        data-testid="announcement-bar-close"
        aria-label={t("pages.marketing.TrackLandingPage.closeAnnouncement")}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function useLiveQuestionCount(tier: string): number | null {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/tier-question-counts")
      .then(r => r.json())
      .then(data => {
        const c = data[tier];
        if (typeof c === "number" && c > 0) setCount(c);
      })
      .catch(() => {});
  }, [tier]);
  return count;
}

function HeroSection({
  copy,
  colors,
  label,
  onNavigate,
  track,
}: {
  copy: ReturnType<typeof getMarketingCopy>;
  colors: (typeof trackAccentMap)[string];
  label: string;
  onNavigate: (path: string) => void;
  track: MarketingTrack;
}) {
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  const { hero } = copy;
  const liveCount = useLiveQuestionCount(track);

  const dynamicStats = hero.stats?.map(stat => {
    if (liveCount && liveCount > 0 && stat.label.toLowerCase().includes("question")) {
      const formatted = liveCount >= 1000
        ? `${(Math.floor(liveCount / 100) * 100).toLocaleString()}+`
        : `${liveCount}+`;
      return { ...stat, value: formatted };
    }
    return stat;
  });

  return (
    <section
      className={`relative overflow-hidden py-20 md:py-28 bg-gradient-to-b ${colors.gradient}`}
      data-testid="hero-section"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#BFA6F6]/8 rounded-full blur-3xl hidden md:block" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#BFA6F6]/6 rounded-full blur-3xl hidden md:block" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <Badge variant="outline" className={`mb-6 ${colors.badge} text-xs font-medium px-3 py-1`}>
          NurseNest {label} Prep
        </Badge>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto"
          data-testid="hero-headline"
        >
          {r(hero.headline)}
        </h1>

        <p className="text-lg md:text-xl text-[#2E3A59]/65 max-w-3xl mx-auto mb-6 leading-relaxed" data-testid="hero-subheadline">
          {r(hero.subheadline)}
        </p>

        {hero.futureSelf && (
          <p className="text-base md:text-lg text-[#2E3A59]/80 font-medium max-w-2xl mx-auto mb-4 italic" data-testid="hero-future-self">
            {r(hero.futureSelf)}
          </p>
        )}

        {hero.lossAversion && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-5 py-2 inline-block mb-8" data-testid="hero-loss-aversion">
            {r(hero.lossAversion)}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button
            size="lg"
            onClick={() => {
              if (hero.primaryCtaPath.startsWith("#")) {
                document.getElementById(hero.primaryCtaPath.slice(1))?.scrollIntoView({ behavior: "smooth" });
              } else {
                onNavigate(hero.primaryCtaPath);
              }
            }}
            className="bg-[#BFA6F6] hover:bg-[#a98cf0] text-white border-none px-8 h-12 rounded-full text-base font-medium shadow-lg shadow-[#BFA6F6]/20"
            data-testid="hero-primary-cta"
          >
            {hero.primaryCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate(hero.secondaryCtaPath)}
            className="border-[#BFA6F6]/30 text-[#2E3A59] px-8 h-12 rounded-full text-base hover:bg-[#BFA6F6]/5"
            data-testid="hero-secondary-cta"
          >
            {hero.secondaryCta}
          </Button>
        </div>

        {hero.trustBadges && hero.trustBadges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#2E3A59]/55 mb-8" data-testid="hero-trust-badges">
            {hero.trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Check className={`w-4 h-4 ${colors.accent} flex-shrink-0`} />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        )}

        {hero.clarityBullets && hero.clarityBullets.length > 0 && (
          <div className="max-w-2xl mx-auto mb-10 p-5 rounded-2xl bg-white/60 border border-[#BFA6F6]/10 backdrop-blur-sm" data-testid="hero-clarity-block">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2E3A59]/40 mb-3">{t("pages.marketing.TrackLandingPage.whatYouGet")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hero.clarityBullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#2E3A59]/70 text-left">
                  <Check className={`w-4 h-4 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span>{r(bullet)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {dynamicStats && dynamicStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {dynamicStats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl bg-white/70 border border-[#BFA6F6]/15 backdrop-blur-sm"
                data-testid={`hero-stat-${i}`}
              >
                <div className="text-2xl font-bold text-[#BFA6F6]">{stat.value}</div>
                <div className="text-xs text-[#2E3A59]/50 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TrustStrip({ items, colors }: { items: string[]; colors: (typeof trackAccentMap)[string] }) {
  return (
    <section className="py-6 border-y border-gray-100 bg-white/50" data-testid="trust-strip">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[#2E3A59]/60" data-testid={`trust-item-${i}`}>
              <Check className={`w-4 h-4 ${colors.accent} flex-shrink-0`} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection({
  section,
  colors,
}: {
  section: NonNullable<ReturnType<typeof getMarketingCopy>["problemSection"]>;
  colors: (typeof trackAccentMap)[string];
}) {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50" data-testid="problem-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="problem-headline">
            {section.headline}
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            {section.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {section.cards.map((card, i) => (
            <Card
              key={i}
              className="border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-shadow"
              data-testid={`problem-card-${i}`}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-2">{card.title}</h3>
                <p className="text-sm text-[#2E3A59]/60 leading-relaxed">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection({
  copy,
  colors,
}: {
  copy: ReturnType<typeof getMarketingCopy>;
  colors: (typeof trackAccentMap)[string];
}) {
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  const { solution } = copy;

  return (
    <section className="py-16 md:py-24" data-testid="solution-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="solution-headline">
            {r(solution.headline)}
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            {r(solution.description)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solution.features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || FlaskConical;
            return (
              <div
                key={i}
                className="text-center p-6 rounded-xl border border-[#BFA6F6]/15 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                data-testid={`solution-card-${i}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.light} mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.accent}`} />
                </div>
                <h3 className="text-base font-semibold mb-2">{r(feature.title)}</h3>
                <p className="text-sm text-[#2E3A59]/60 leading-relaxed">{r(feature.description)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureCardsSection({
  cards,
  label,
  colors,
}: {
  cards: NonNullable<ReturnType<typeof getMarketingCopy>["featureCards"]>;
  label: string;
  colors: (typeof trackAccentMap)[string];
}) {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50" data-testid="feature-cards-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className={`mb-4 ${colors.badge} text-xs px-3 py-1`}>
            {label} Study Tools
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Everything you need in one place
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            Purpose-built study tools designed specifically for {label} exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon] || FlaskConical;
            return (
              <Card
                key={i}
                className="border-gray-200/80 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                data-testid={`feature-card-${i}`}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors.light} mb-4`}>
                    <Icon className={`w-5 h-5 ${colors.accent}`} />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{card.title}</h3>
                  <p className="text-sm text-[#2E3A59]/60 leading-relaxed">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection({
  steps,
  colors,
}: {
  steps: NonNullable<ReturnType<typeof getMarketingCopy>["howItWorks"]>;
  colors: (typeof trackAccentMap)[string];
}) {
  return (
    <section className="py-16 md:py-24" data-testid="how-it-works-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            A clear path from where you are to exam readiness.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-[#BFA6F6]/20 hidden sm:block" />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 sm:gap-8 items-start" data-testid={`how-step-${i}`}>
                <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#BFA6F6]/10 border-2 border-[#BFA6F6]/30 flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-[#BFA6F6]">{step.step}</span>
                </div>
                <div className="pt-1 md:pt-3">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-[#2E3A59]/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreviewSection({
  preview,
  colors,
}: {
  preview: NonNullable<ReturnType<typeof getMarketingCopy>["dashboardPreview"]>;
  colors: (typeof trackAccentMap)[string];
}) {
  return (
    <section className={`py-16 md:py-24 bg-gradient-to-b ${colors.gradient}`} data-testid="dashboard-preview-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className={`mb-4 ${colors.badge} text-xs px-3 py-1`}>
              Your Dashboard
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="dashboard-headline">
              {preview.headline}
            </h2>
            <p className="text-[#2E3A59]/60 leading-relaxed mb-8">
              {preview.description}
            </p>
            <ul className="space-y-3">
              {preview.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3" data-testid={`dashboard-highlight-${i}`}>
                  <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-sm text-[#2E3A59]/70">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-[#BFA6F6]/20 bg-white p-6 shadow-xl shadow-[#BFA6F6]/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-amber-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
                <span className="ml-2 text-xs text-[#2E3A59]/40 font-mono">{t("pages.marketing.TrackLandingPage.nursenestDashboard")}</span>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-[#BFA6F6]/8 rounded-lg" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-20 bg-[#BFA6F6]/6 rounded-lg" />
                  <div className="h-20 bg-[#BFA6F6]/10 rounded-lg" />
                  <div className="h-20 bg-[#BFA6F6]/6 rounded-lg" />
                </div>
                <div className="h-32 bg-gradient-to-r from-[#BFA6F6]/5 to-[#BFA6F6]/12 rounded-lg" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-[#BFA6F6]/8 rounded-lg" />
                  <div className="h-16 bg-[#BFA6F6]/6 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OutcomesSection({
  section,
  colors,
}: {
  section: NonNullable<ReturnType<typeof getMarketingCopy>["outcomesSection"]>;
  colors: (typeof trackAccentMap)[string];
}) {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50" data-testid="outcomes-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="outcomes-headline">
            {section.headline}
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            {section.description}
          </p>
        </div>

        <div className="space-y-4">
          {section.outcomes.map((outcome, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0"
              data-testid={`outcome-${i}`}
            >
              <div className="flex-1 p-4 rounded-xl bg-white border border-red-100 text-center sm:text-right sm:rounded-r-none sm:border-r-0">
                <span className="text-sm text-red-400/80 line-through decoration-red-300/50">{outcome.before}</span>
              </div>
              <div className="hidden sm:flex items-center justify-center px-4">
                <ChevronRight className={`w-5 h-5 ${colors.accent}`} />
              </div>
              <div className="flex-1 p-4 rounded-xl bg-white border border-emerald-100 text-center sm:text-left sm:rounded-l-none sm:border-l-0">
                <span className="text-sm text-emerald-700 font-medium">{outcome.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({
  testimonials,
  colors,
}: {
  testimonials: ReturnType<typeof getMarketingCopy>["testimonials"];
  colors: (typeof trackAccentMap)[string];
}) {
  return (
    <section className="py-16 md:py-24" data-testid="testimonials-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            What learners are saying
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            Real feedback from nursing learners who are preparing with NurseNest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="border-[#BFA6F6]/15 bg-white hover:shadow-lg transition-shadow"
              data-testid={`testimonial-${i}`}
            >
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-[#BFA6F6]/30 mb-4" />
                <p className="text-sm text-[#2E3A59]/70 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-[#2E3A59]/50 mt-0.5">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({
  comparison,
  label,
  colors,
}: {
  comparison: NonNullable<ReturnType<typeof getMarketingCopy>["comparison"]>;
  label: string;
  colors: (typeof trackAccentMap)[string];
}) {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50" data-testid="comparison-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Why NurseNest for {label} prep?
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            See how role-specific preparation compares to generic nursing study tools.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200/60">
            <div className="p-4 text-sm font-semibold text-[#2E3A59]/70">{t("pages.marketing.TrackLandingPage.feature")}</div>
            <div className="p-4 text-sm font-semibold text-[#2E3A59]/50 text-center">{t("pages.marketing.TrackLandingPage.genericPlatforms")}</div>
            <div className="p-4 text-sm font-semibold text-[#BFA6F6] text-center">NurseNest</div>
          </div>

          {comparison.map((row, i) => (
            <div
              key={i}
              className={`${i < comparison.length - 1 ? "border-b border-gray-100" : ""}`}
              data-testid={`comparison-row-${i}`}
            >
              <div className="hidden sm:grid grid-cols-3">
                <div className="p-4 text-sm font-medium text-[#2E3A59]/80">{row.feature}</div>
                <div className="p-4 text-sm text-[#2E3A59]/45 text-center flex items-center justify-center gap-2">
                  <X className="w-3.5 h-3.5 text-red-300 flex-shrink-0" />
                  <span>{row.generic}</span>
                </div>
                <div className="p-4 text-sm text-[#2E3A59]/80 text-center flex items-center justify-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${colors.accent} flex-shrink-0`} />
                  <span>{row.nursenest}</span>
                </div>
              </div>
              <div className="sm:hidden p-4 space-y-2">
                <div className="font-medium text-sm text-[#2E3A59]/80">{row.feature}</div>
                <div className="flex items-start gap-2 text-sm text-[#2E3A59]/45">
                  <X className="w-3.5 h-3.5 text-red-300 flex-shrink-0 mt-0.5" />
                  <span>{row.generic}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-[#2E3A59]/80">
                  <Check className={`w-3.5 h-3.5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span>{row.nursenest}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({
  faq,
  colors,
}: {
  faq: ReturnType<typeof getMarketingCopy>["faq"];
  colors: (typeof trackAccentMap)[string];
}) {
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200/80 bg-white overflow-hidden"
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                data-testid={`faq-toggle-${i}`}
              >
                <span className="font-medium text-sm pr-4">{r(item.question)}</span>
                <ChevronRight
                  className={`w-4 h-4 text-[#2E3A59]/40 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-90" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[#2E3A59]/60 leading-relaxed">{r(item.answer)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection({
  cta,
  colors,
  onNavigate,
}: {
  cta: NonNullable<ReturnType<typeof getMarketingCopy>["finalCta"]>;
  colors: (typeof trackAccentMap)[string];
  onNavigate: (path: string) => void;
}) {
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  return (
    <section
      className="py-20 md:py-28 bg-gradient-to-b from-[#BFA6F6]/5 via-[#BFA6F6]/10 to-[#BFA6F6]/5"
      data-testid="final-cta-section"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Sparkles className="w-8 h-8 text-[#BFA6F6] mx-auto mb-6" />

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4" data-testid="final-cta-headline">
          {r(cta.headline)}
        </h2>

        <p className="text-lg text-[#2E3A59]/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          {r(cta.description)}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button
            size="lg"
            onClick={() => onNavigate(cta.primaryCtaPath)}
            className="bg-[#BFA6F6] hover:bg-[#a98cf0] text-white border-none px-8 h-12 rounded-full text-base font-medium shadow-lg shadow-[#BFA6F6]/25"
            data-testid="final-primary-cta"
          >
            {cta.primaryCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate(cta.secondaryCtaPath)}
            className="border-[#BFA6F6]/30 text-[#2E3A59] px-8 h-12 rounded-full text-base hover:bg-white/50"
            data-testid="final-secondary-cta"
          >
            {cta.secondaryCta}
          </Button>
        </div>

        <p className="text-sm text-[#2E3A59]/40">{cta.reassurance}</p>
      </div>
    </section>
  );
}
