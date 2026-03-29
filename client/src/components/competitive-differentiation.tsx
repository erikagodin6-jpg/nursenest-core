import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Shield,
  Brain,
  Target,
  Layers,
  Zap,
  Users,
  BarChart3,
  Activity,
  BookOpen,
  GraduationCap,
  Clock,
  Sparkles,
  Award,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface WhyNurseNestGridProps {
  headline?: string;
  subtitle?: string;
  context?: "general" | "nursing" | "np" | "allied" | "certification";
}

const GRID_ITEMS = [
  {
    icon: Brain,
    title: "Clinical Reasoning Engine",
    description: "Every question builds clinical judgment — not rote memorization. Rationales explain the reasoning behind each answer so you learn to think like a clinician.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Target,
    title: "Adaptive Difficulty",
    description: "Our CAT-style practice engine mirrors real licensure exams. Questions adjust to your performance in real time, targeting weak areas for maximum efficiency.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Layers,
    title: "Integrated Study System",
    description: "Questions, flashcards, lessons, mock exams, and analytics in one platform. No juggling multiple apps or paying for separate tools.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Multi-Discipline Coverage",
    description: "Purpose-built content for RPN/LPN, RN, NP, and allied health professions — not generic content repurposed across exams.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: BarChart3,
    title: "Readiness Analytics",
    description: "Real-time performance tracking with domain-level insights, percentile comparisons, and targeted study recommendations.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: RefreshCw,
    title: "Spaced Repetition Built In",
    description: "Smart flashcard scheduling surfaces weak concepts at optimal intervals. Retention rates improve without extra effort.",
    gradient: "from-indigo-500 to-blue-600",
  },
];

export function WhyNurseNestGrid({ headline, subtitle, context = "general" }: WhyNurseNestGridProps) {
  const { t } = useI18n();
  const defaultHeadline = context === "np"
    ? "Why NurseNest for Nurse Practitioner Exam Prep"
    : context === "allied"
    ? "Why NurseNest for Allied Health Exam Prep"
    : context === "certification"
    ? "Why NurseNest for Certification Exam Prep"
    : "Why NurseNest Works Better";

  const defaultSubtitle = "NurseNest is a clinical learning system — not a study app. Every feature is designed to build the clinical reasoning skills tested on modern healthcare exams.";

  return (
    <section
      className="border-t border-gray-100"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      data-testid="section-why-nursenest-grid"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 shadow-[var(--shadow-card)] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("components.competitiveDifferentiation.clinicalLearningSystem")}</span>
          </div>
          <h2
            className="font-bold text-gray-900 mb-3"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-why-grid-heading"
          >
            {headline || defaultHeadline}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg" data-testid="text-why-grid-subtitle">
            {subtitle || defaultSubtitle}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {GRID_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-7"
              data-testid={`card-why-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-sm`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontSize: "var(--text-card-title)" }}>
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ComparisonTableProps {
  headline?: string;
  subtitle?: string;
}

const COMPARISON_ROWS = [
  {
    feature: "Question Bank Size",
    nursenest: "Thousands of exam-style questions across all tiers and disciplines",
    typical: "Limited question banks, often under 2,000 questions",
  },
  {
    feature: "Flashcards Included",
    nursenest: "Thousands of flashcards organized into spaced-repetition decks",
    typical: "Flashcards sold separately or unavailable",
  },
  {
    feature: "Multi-Discipline Coverage",
    nursenest: "Dedicated content for RPN, RN, NP, and allied health professions",
    typical: "Single-exam focus with no expansion path",
  },
  {
    feature: "Adaptive Mock Exams",
    nursenest: "CAT-adaptive exams that mirror real licensure testing",
    typical: "Static practice tests with fixed difficulty",
  },
  {
    feature: "Clinical Lessons",
    nursenest: "In-depth lessons with pre/post tests and detailed rationales",
    typical: "No integrated lesson content",
  },
  {
    feature: "Readiness Analytics",
    nursenest: "Domain-level insights with percentile tracking and study recommendations",
    typical: "Basic score tracking without targeted feedback",
  },
  {
    feature: "Study Plan Generator",
    nursenest: "Personalized weekly plans based on weak areas and exam date",
    typical: "Generic study schedules not tied to performance",
  },
  {
    feature: "Clinical Judgment Training",
    nursenest: "NGN-style case studies, bowtie items, and clinical reasoning exercises",
    typical: "Traditional MCQ-only format",
  },
];

export function ComparisonTable({ headline, subtitle }: ComparisonTableProps) {
  return (
    <section
      className="border-t border-gray-100"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      data-testid="section-comparison-table"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/40 shadow-[var(--shadow-card)] mb-5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t("components.competitiveDifferentiation.platformComparison")}</span>
          </div>
          <h2
            className="font-bold text-gray-900 mb-3"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-comparison-table-heading"
          >
            {headline || "How NurseNest Compares"}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg" data-testid="text-comparison-table-subtitle">
            {subtitle || "See how a modern clinical learning system stacks up against typical study platforms."}
          </p>
        </div>

        <div className="hidden md:block bg-white rounded-2xl border border-gray-200/60 shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full text-sm" data-testid="table-platform-comparison">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-[200px]">{t("components.competitiveDifferentiation.feature")}</th>
                <th className="text-left py-4 px-6 font-bold text-primary bg-primary/5">NurseNest</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-500">{t("components.competitiveDifferentiation.typicalPlatforms")}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0" data-testid={`row-comparison-${idx}`}>
                  <td className="py-4 px-6 font-semibold text-gray-800">{row.feature}</td>
                  <td className="py-4 px-6 bg-primary/[0.02]">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{row.nursenest}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                      <span className="text-gray-500">{row.typical}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {COMPARISON_ROWS.map((row, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-[var(--shadow-card)]"
              data-testid={`card-comparison-mobile-${idx}`}
            >
              <h4 className="font-bold text-gray-900 text-sm mb-3">{row.feature}</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 block mb-0.5">NurseNest</span>
                    <span className="text-sm text-gray-700">{row.nursenest}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block mb-0.5">{t("components.competitiveDifferentiation.typicalPlatforms2")}</span>
                    <span className="text-sm text-gray-500">{row.typical}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TrustBadgesProps {
  variant?: "full" | "compact";
}

const TRUST_BADGES = [
  {
    icon: Shield,
    label: "7-Day Money-Back Guarantee",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: Zap,
    label: "Instant Access After Signup",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: Award,
    label: "Built by Healthcare Professionals",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    icon: TrendingUp,
    label: "New Content Added Weekly",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
];

export function TrustBadges({ variant = "full" }: TrustBadgesProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${variant === "full" ? "py-8" : "py-4"}`}
      data-testid="section-trust-badges"
    >
      {TRUST_BADGES.map((badge) => (
        <div
          key={badge.label}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${badge.bg} border ${badge.border} shadow-[var(--shadow-card)] ${
            variant === "compact" ? "text-xs" : "text-sm"
          } font-medium ${badge.color}`}
          data-testid={`badge-trust-${badge.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <badge.icon className={variant === "compact" ? "w-3.5 h-3.5" : "w-4 h-4"} />
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

interface RetentionSectionProps {
  headline?: string;
}

export function RetentionSection({ headline }: RetentionSectionProps) {
  const retentionItems = [
    {
      icon: Brain,
      title: "Active Recall Over Passive Review",
      description: "Every interaction requires you to retrieve information from memory — the most effective way to move knowledge into long-term storage.",
    },
    {
      icon: RefreshCw,
      title: "Spaced Repetition Scheduling",
      description: "Flashcards and weak-area questions resurface at scientifically optimal intervals, so you review concepts right before you would forget them.",
    },
    {
      icon: Target,
      title: "Targeted Weak-Area Focus",
      description: "Analytics identify your weakest domains and auto-generate focused practice sessions. No more wasting time on topics you already know.",
    },
  ];

  return (
    <section
      className="border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      data-testid="section-retention"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50/80 border border-violet-200/40 shadow-[var(--shadow-card)] mb-5">
            <Brain className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">{t("components.competitiveDifferentiation.evidencebasedLearning")}</span>
          </div>
          <h2
            className="font-bold text-gray-900 mb-3"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-retention-heading"
          >
            {headline || "Study Smarter, Not Harder"}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg" data-testid="text-retention-subtitle">
            NurseNest applies proven learning science — active recall, spaced repetition, and adaptive difficulty — so every study session moves you closer to exam readiness.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {retentionItems.map((item) => (
            <div
              key={item.title}
              className="text-center"
              data-testid={`card-retention-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <item.icon className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface DifferentiatorCTAProps {
  headline?: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function DifferentiatorCTA({
  headline,
  subtitle,
  primaryHref = "/register",
  primaryLabel = "Start Free Today",
  secondaryHref = "/pricing",
  secondaryLabel = "View Plans",
}: DifferentiatorCTAProps) {
  const [, setLocation] = useLocation();

  return (
    <section
      className="border-t border-gray-100"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      data-testid="section-differentiator-cta"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary/90 rounded-2xl p-8 sm:p-12 text-center shadow-[var(--shadow-elevated)]">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
            data-testid="text-differentiator-cta-heading"
          >
            {headline || "Ready to Study Smarter?"}
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto text-base leading-relaxed" data-testid="text-differentiator-cta-subtitle">
            {subtitle || "Join thousands of nursing and healthcare students using NurseNest to prepare for their exams with confidence. Start free — no credit card required."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="rounded-full px-9 bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-lg"
              onClick={() => setLocation(primaryHref)}
              data-testid="button-differentiator-cta-primary"
            >
              {primaryLabel}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-9 border-white/30 text-white hover:bg-white/10 font-medium"
              onClick={() => setLocation(secondaryHref)}
              data-testid="button-differentiator-cta-secondary"
            >
              {secondaryLabel}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-5">{t("components.competitiveDifferentiation.noCreditCardRequiredFree")}</p>
        </div>
      </div>
    </section>
  );
}

interface WhyNurseNestSectionProps {
  variant?: "full" | "compact" | "grid-only" | "table-only";
  context?: "general" | "nursing" | "np" | "allied" | "certification";
  ctaHref?: string;
  ctaLabel?: string;
  gridHeadline?: string;
  gridSubtitle?: string;
  tableHeadline?: string;
  tableSubtitle?: string;
  ctaHeadline?: string;
  ctaSubtitle?: string;
  showTrustBadges?: boolean;
  showRetention?: boolean;
}

export function WhyNurseNestSection({
  variant = "compact",
  context = "general",
  ctaHref,
  ctaLabel,
  gridHeadline,
  gridSubtitle,
  tableHeadline,
  tableSubtitle,
  ctaHeadline,
  ctaSubtitle,
  showTrustBadges = false,
  showRetention = false,
}: WhyNurseNestSectionProps) {
  if (variant === "grid-only") {
    return (
      <>
        <WhyNurseNestGrid headline={gridHeadline} subtitle={gridSubtitle} context={context} />
        {showTrustBadges && <TrustBadges variant="compact" />}
      </>
    );
  }

  if (variant === "table-only") {
    return (
      <>
        <ComparisonTable headline={tableHeadline} subtitle={tableSubtitle} />
        {showTrustBadges && <TrustBadges variant="compact" />}
      </>
    );
  }

  if (variant === "full") {
    return (
      <>
        <WhyNurseNestGrid headline={gridHeadline} subtitle={gridSubtitle} context={context} />
        <RetentionSection />
        <ComparisonTable headline={tableHeadline} subtitle={tableSubtitle} />
        <TrustBadges />
        <DifferentiatorCTA
          headline={ctaHeadline}
          subtitle={ctaSubtitle}
          primaryHref={ctaHref || "/register"}
          primaryLabel={ctaLabel || "Start Free Today"}
        />
      </>
    );
  }

  return (
    <>
      <ComparisonTable headline={tableHeadline} subtitle={tableSubtitle} />
      {showRetention && <RetentionSection />}
      {showTrustBadges && <TrustBadges variant="compact" />}
      <DifferentiatorCTA
        headline={ctaHeadline}
        subtitle={ctaSubtitle}
        primaryHref={ctaHref || "/register"}
        primaryLabel={ctaLabel || "Start Free Today"}
      />
    </>
  );
}
