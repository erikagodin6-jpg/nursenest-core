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

const trackAccentMap: Record<string, {
  gradient: string;
  badge: string;
  accent: string;
  light: string;
  heroOrb: string;
  statColor: string;
  stepBg: string;
  stepBorder: string;
  stepNumColor: string;
  connectorColor: string;
  problemBorderClass: string;
  announcementBg: string;
  announcementCta: string;
  ctaGradient: string;
  heroCta: string;
  heroCtaSecondary: string;
  outcomeBorder: string;
  outcomeText: string;
}> = {
  rpn: {
    gradient: "from-emerald-50 via-white to-emerald-50/30",
    badge: "border-emerald-400/40 text-emerald-700 bg-emerald-50",
    accent: "text-emerald-600",
    light: "bg-emerald-50",
    heroOrb: "bg-emerald-400/8",
    statColor: "text-emerald-600",
    stepBg: "bg-emerald-50",
    stepBorder: "border-emerald-300/50",
    stepNumColor: "text-emerald-700",
    connectorColor: "bg-emerald-200/30",
    problemBorderClass: "border-l-4 border-l-emerald-400",
    announcementBg: "bg-emerald-50/70 border-b border-emerald-200/40",
    announcementCta: "text-emerald-700 hover:text-emerald-800",
    ctaGradient: "from-slate-900 via-slate-800 to-slate-900",
    heroCta: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
    heroCtaSecondary: "border-emerald-400/30 hover:bg-emerald-50/60",
    outcomeBorder: "border-emerald-100",
    outcomeText: "text-emerald-700",
  },
  rn: {
    gradient: "from-blue-50/60 via-white to-slate-50/30",
    badge: "border-blue-400/40 text-blue-700 bg-blue-50",
    accent: "text-blue-600",
    light: "bg-blue-50",
    heroOrb: "bg-blue-400/8",
    statColor: "text-blue-600",
    stepBg: "bg-blue-50",
    stepBorder: "border-blue-300/50",
    stepNumColor: "text-blue-700",
    connectorColor: "bg-blue-200/30",
    problemBorderClass: "border-l-4 border-l-blue-500",
    announcementBg: "bg-blue-50/70 border-b border-blue-200/40",
    announcementCta: "text-blue-700 hover:text-blue-800",
    ctaGradient: "from-slate-950 via-blue-950 to-slate-900",
    heroCta: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
    heroCtaSecondary: "border-blue-400/30 hover:bg-blue-50/60",
    outcomeBorder: "border-blue-100",
    outcomeText: "text-blue-700",
  },
  np: {
    gradient: "from-violet-50 via-white to-violet-50/30",
    badge: "border-violet-400/40 text-violet-700 bg-violet-50",
    accent: "text-violet-600",
    light: "bg-violet-50",
    heroOrb: "bg-violet-400/8",
    statColor: "text-violet-600",
    stepBg: "bg-violet-50",
    stepBorder: "border-violet-300/50",
    stepNumColor: "text-violet-700",
    connectorColor: "bg-violet-200/30",
    problemBorderClass: "border-l-4 border-l-violet-400",
    announcementBg: "bg-violet-50/60 border-b border-violet-200/40",
    announcementCta: "text-violet-700 hover:text-violet-800",
    ctaGradient: "from-slate-900 via-violet-950 to-slate-900",
    heroCta: "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20",
    heroCtaSecondary: "border-violet-400/30 hover:bg-violet-50/60",
    outcomeBorder: "border-violet-100",
    outcomeText: "text-violet-700",
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
    heroOrb: "bg-[#BFA6F6]/8",
    statColor: "text-[#BFA6F6]",
    stepBg: "bg-[#BFA6F6]/10",
    stepBorder: "border-[#BFA6F6]/30",
    stepNumColor: "text-[#BFA6F6]",
    connectorColor: "bg-[#BFA6F6]/20",
    problemBorderClass: "border-l-4 border-l-[#BFA6F6]",
    announcementBg: "bg-[#BFA6F6]/10 border-b border-[#BFA6F6]/20",
    announcementCta: "text-[#BFA6F6] hover:text-[#a98cf0]",
    ctaGradient: "from-[#BFA6F6]/5 via-[#BFA6F6]/10 to-[#BFA6F6]/5",
    heroCta: "bg-[#BFA6F6] hover:bg-[#a98cf0] shadow-[#BFA6F6]/20",
    heroCtaSecondary: "border-[#BFA6F6]/30 hover:bg-[#BFA6F6]/5",
    outcomeBorder: "border-[#BFA6F6]/20",
    outcomeText: "text-[#BFA6F6]",
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
          colors={colors}
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

      <section className="py-12 bg-white border-t border-gray-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold text-[#2E3A59]/35 uppercase tracking-widest text-center mb-6">Explore More {label} Resources</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`/${track}/questions`} className={`flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-opacity-60 transition-all duration-200 group`} data-testid="link-topic-questions">
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${colors.light} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Target className={`w-4 h-4 ${colors.accent}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#2E3A59]">{t("pages.marketing.TrackLandingPage.questionsByTopic")}</h3>
                <p className="text-xs text-[#2E3A59]/45 mt-0.5">{t("pages.marketing.TrackLandingPage.browsePracticeQuestionsByClinical")}</p>
              </div>
            </Link>
            <Link href={`/how-to-become-a-nurse/${track}`} className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 group" data-testid="link-career-guide">
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${colors.light} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <GraduationCap className={`w-4 h-4 ${colors.accent}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#2E3A59]">{t("pages.marketing.TrackLandingPage.careerGuide")}</h3>
                <p className="text-xs text-[#2E3A59]/45 mt-0.5">How to become a {label}</p>
              </div>
            </Link>
            <Link href="/practice-questions" className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 group" data-testid="link-practice-by-system">
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${colors.light} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <BookOpen className={`w-4 h-4 ${colors.accent}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#2E3A59]">{t("pages.marketing.TrackLandingPage.byBodySystem")}</h3>
                <p className="text-xs text-[#2E3A59]/45 mt-0.5">{t("pages.marketing.TrackLandingPage.practiceByBodySystem")}</p>
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

function AnnouncementBar({ message, ctaText, onCta, colors }: {
  message: string;
  ctaText: string;
  onCta: () => void;
  colors: (typeof trackAccentMap)[string];
}) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className={`${colors.announcementBg} py-2.5 px-4 text-center relative`} data-testid="announcement-bar">
      <span className="text-sm text-[#2E3A59]/75 font-medium">{message}</span>
      <button
        onClick={onCta}
        className={`ml-3 text-sm font-semibold ${colors.announcementCta} underline underline-offset-2`}
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
        <div className={`absolute top-20 left-1/4 w-96 h-96 ${colors.heroOrb} rounded-full blur-3xl hidden md:block`} />
        <div className={`absolute bottom-10 right-1/4 w-72 h-72 ${colors.heroOrb} opacity-75 rounded-full blur-3xl hidden md:block`} />
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
            className={`${colors.heroCta} text-white border-none px-8 h-12 rounded-full text-base font-semibold shadow-lg`}
            data-testid="hero-primary-cta"
          >
            {hero.primaryCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate(hero.secondaryCtaPath)}
            className={`${colors.heroCtaSecondary} text-[#2E3A59] px-8 h-12 rounded-full text-base`}
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
          <div className="max-w-2xl mx-auto mb-10 p-5 rounded-2xl bg-white/60 border border-white/50 backdrop-blur-sm" data-testid="hero-clarity-block">
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
          <div className="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-white/90 bg-white/65 backdrop-blur-sm shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100/70">
              {dynamicStats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/80 px-4 py-5 text-center"
                  data-testid={`hero-stat-${i}`}
                >
                  <div className={`text-2xl md:text-3xl font-bold tracking-tight ${colors.statColor}`}>{stat.value}</div>
                  <div className="text-[10px] text-[#2E3A59]/45 mt-1.5 font-semibold uppercase tracking-widest leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>The challenge</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="problem-headline">
            {section.headline}
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            {section.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {section.cards.map((card, i) => (
            <Card
              key={i}
              className={`border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${colors.problemBorderClass}`}
              data-testid={`problem-card-${i}`}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-2 text-[#2E3A59]">{card.title}</h3>
                <p className="text-sm text-[#2E3A59]/55 leading-relaxed">{card.description}</p>
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>Our approach</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="solution-headline">
            {r(solution.headline)}
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            {r(solution.description)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {solution.features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || FlaskConical;
            return (
              <div
                key={i}
                className="text-center p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                data-testid={`solution-card-${i}`}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${colors.light} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${colors.accent}`} />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#2E3A59]">{r(feature.title)}</h3>
                <p className="text-xs text-[#2E3A59]/55 leading-relaxed">{r(feature.description)}</p>
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>{label} study tools</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Everything you need in one place
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            Purpose-built study tools designed specifically for {label} exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon] || FlaskConical;
            return (
              <Card
                key={i}
                className="border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                data-testid={`feature-card-${i}`}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.light} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${colors.accent}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-2 text-[#2E3A59]">{card.title}</h3>
                  <p className="text-xs text-[#2E3A59]/55 leading-relaxed">{card.description}</p>
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>Getting started</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            A clear path from where you are to exam readiness.
          </p>
        </div>

        <div className="relative">
          <div className={`absolute left-6 md:left-8 top-0 bottom-0 w-px ${colors.connectorColor} hidden sm:block`} />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 sm:gap-8 items-start" data-testid={`how-step-${i}`}>
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full ${colors.stepBg} border-2 ${colors.stepBorder} flex items-center justify-center shadow-sm`}>
                  <span className={`text-lg md:text-xl font-bold ${colors.stepNumColor}`}>{step.step}</span>
                </div>
                <div className="pt-1 md:pt-3">
                  <h3 className="text-base font-semibold mb-1.5 text-[#2E3A59]">{step.title}</h3>
                  <p className="text-sm text-[#2E3A59]/60 leading-relaxed">{step.description}</p>
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
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-300/80" />
                <span className="ml-2 text-xs text-[#2E3A59]/35 font-mono">{t("pages.marketing.TrackLandingPage.nursenestDashboard")}</span>
              </div>
              <div className="space-y-3">
                <div className={`h-8 ${colors.light} rounded-lg`} />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-20 bg-gray-50 rounded-lg border border-gray-100" />
                  <div className={`h-20 ${colors.light} rounded-lg`} />
                  <div className="h-20 bg-gray-50 rounded-lg border border-gray-100" />
                </div>
                <div className={`h-32 bg-gradient-to-r ${colors.gradient} rounded-lg`} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-14 bg-gray-50 rounded-lg border border-gray-100" />
                  <div className={`h-14 ${colors.light} rounded-lg`} />
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>What changes</p>
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
              <div className={`flex-1 p-4 rounded-xl bg-white border ${colors.outcomeBorder} text-center sm:text-left sm:rounded-l-none sm:border-l-0`}>
                <span className={`text-sm ${colors.outcomeText} font-medium`}>{outcome.after}</span>
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>Learner voices</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            What learners are saying
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            Real feedback from nursing learners who are preparing with NurseNest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              data-testid={`testimonial-${i}`}
            >
              <CardContent className="p-7 flex flex-col h-full">
                <Quote className={`w-6 h-6 ${colors.accent} opacity-40 mb-4 flex-shrink-0`} />
                <p className="text-sm text-[#2E3A59]/65 leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className={`border-t border-gray-100 pt-4`}>
                  <p className="font-semibold text-sm text-[#2E3A59]">{t.name}</p>
                  <p className={`text-xs mt-0.5 font-medium ${colors.accent} opacity-80`}>{t.role}</p>
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>Why NurseNest</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Purpose-built for {label} prep
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto">
            See how role-specific preparation compares to generic nursing study tools.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 bg-gray-50/80 border-b border-gray-100">
            <div className="p-4 text-xs font-semibold text-[#2E3A59]/60 uppercase tracking-wider">{t("pages.marketing.TrackLandingPage.feature")}</div>
            <div className="p-4 text-xs font-semibold text-[#2E3A59]/40 text-center uppercase tracking-wider">{t("pages.marketing.TrackLandingPage.genericPlatforms")}</div>
            <div className={`p-4 text-xs font-bold text-center uppercase tracking-wider ${colors.accent} ${colors.light}`}>NurseNest</div>
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
                <div className={`p-4 text-sm text-[#2E3A59]/80 text-center flex items-center justify-center gap-2 ${colors.light}`}>
                  <Check className={`w-3.5 h-3.5 ${colors.accent} flex-shrink-0`} />
                  <span className="font-medium">{row.nursenest}</span>
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
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${colors.accent} mb-3`}>Common questions</p>
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
      className={`py-20 md:py-28 bg-gradient-to-br ${colors.ctaGradient} relative overflow-hidden`}
      data-testid="final-cta-section"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] ${colors.heroOrb} opacity-20 blur-3xl`} />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Sparkles className="w-7 h-7 text-white/50 mx-auto mb-6" />

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-white" data-testid="final-cta-headline">
          {r(cta.headline)}
        </h2>

        <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
          {r(cta.description)}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button
            size="lg"
            onClick={() => onNavigate(cta.primaryCtaPath)}
            className="bg-white text-slate-900 hover:bg-white/90 border-none px-8 h-12 rounded-full text-base font-semibold shadow-lg"
            data-testid="final-primary-cta"
          >
            {cta.primaryCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate(cta.secondaryCtaPath)}
            className="border-white/25 text-white px-8 h-12 rounded-full text-base hover:bg-white/10 hover:border-white/40"
            data-testid="final-secondary-cta"
          >
            {cta.secondaryCta}
          </Button>
        </div>

        <p className="text-sm text-white/30">{cta.reassurance}</p>
      </div>
    </section>
  );
}
