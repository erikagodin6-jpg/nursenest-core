import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/lib/LocaleLink";
import { ArrowRight, Shield, Zap, BookOpen, Lock, CheckCircle, Star } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface CTAProps {
  tier: string;
  variant?: "above-fold" | "mid-page" | "end-of-page";
  headline?: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

const TIER_CONFIG: Record<string, { label: string; hub: string; color: string }> = {
  "rex-pn": { label: "REx-PN", hub: "/rex-pn", color: "from-red-500 to-rose-600" },
  "nclex-rn": { label: "NCLEX-RN", hub: "/nclex-rn", color: "from-blue-500 to-indigo-600" },
  "np-exam": { label: "NP Exam", hub: "/np-exam-prep", color: "from-emerald-500 to-teal-600" },
};

export function SeoHubCTA({
  tier,
  variant = "mid-page",
  headline,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CTAProps) {
  const { t } = useI18n();
  const config = TIER_CONFIG[tier] || TIER_CONFIG["nclex-rn"];
  const defaultHeadline = `Start Your ${config.label} Prep Today`;
  const defaultSubtitle = "Built for modern nursing exams. Clinically focused study support with adaptive practice questions.";

  if (variant === "above-fold") {
    return (
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 border border-primary/10" data-testid="cta-above-fold">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-1" data-testid="text-cta-headline">
              {headline || defaultHeadline}
            </h3>
            <p className="text-sm text-gray-600">{subtitle || defaultSubtitle}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <LocaleLink href={primaryHref || "/free-practice"}>
              <Button className="gap-2 rounded-full" data-testid="button-cta-primary">
                {primaryLabel || "Start Free"} <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
            {secondaryHref && (
              <LocaleLink href={secondaryHref}>
                <Button variant="outline" className="rounded-full" data-testid="button-cta-secondary">
                  {secondaryLabel || "View Plans"}
                </Button>
              </LocaleLink>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "end-of-page") {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white" data-testid="cta-end-of-page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" data-testid="text-cta-headline">
            {headline || defaultHeadline}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {subtitle || defaultSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <LocaleLink href={primaryHref || "/free-practice"}>
              <Button size="lg" className="gap-2 rounded-full bg-white text-gray-900 hover:bg-gray-100" data-testid="button-cta-primary">
                {primaryLabel || "Start Free"} <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
            <LocaleLink href={secondaryHref || "/pricing"}>
              <Button size="lg" variant="outline" className="gap-2 rounded-full border-white/30 text-white hover:bg-white/10" data-testid="button-cta-secondary">
                {secondaryLabel || "View Plans"}
              </Button>
            </LocaleLink>
          </div>
          <TrustCopyBlock variant="dark" />
        </div>
      </section>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 via-blue-50/50 to-emerald-50/30 rounded-2xl p-8 text-center border border-primary/10" data-testid="cta-mid-page">
      <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-cta-headline">
        {headline || defaultHeadline}
      </h3>
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">
        {subtitle || defaultSubtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <LocaleLink href={primaryHref || "/free-practice"}>
          <Button className="gap-2 rounded-full" data-testid="button-cta-primary">
            {primaryLabel || "Start Free"} <ArrowRight className="w-4 h-4" />
          </Button>
        </LocaleLink>
        <LocaleLink href={secondaryHref || "/pricing"}>
          <Button variant="outline" className="rounded-full" data-testid="button-cta-secondary">
            {secondaryLabel || "View Plans"}
          </Button>
        </LocaleLink>
      </div>
      <FrictionReducerBadges />
    </div>
  );
}

export function TrustCopyBlock({ variant = "light" }: { variant?: "light" | "dark" }) {
  const items = [
    { icon: Shield, text: "Built for modern nursing exams" },
    { icon: Star, text: "Clinically focused study support" },
    { icon: CheckCircle, text: "Evidence-based clinical rationales" },
  ];

  return (
    <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${variant === "dark" ? "text-gray-400" : "text-gray-500"}`} data-testid="trust-copy-block">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
          <item.icon className="w-4 h-4 shrink-0" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

export function FrictionReducerBadges() {
  const badges = [
    { icon: Zap, text: "No signup required to preview" },
    { icon: BookOpen, text: "Start free" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4" data-testid="friction-reducer-badges">
      {badges.map((badge, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-600 shadow-sm">
          <badge.icon className="w-3 h-3 text-primary" />
          {badge.text}
        </span>
      ))}
    </div>
  );
}

export function MedicallyReviewedBlock({
  reviewerName,
  reviewDate,
  lastUpdated,
}: {
  reviewerName?: string;
  reviewDate?: string;
  lastUpdated?: string;
}) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5" data-testid="medically-reviewed-block">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-900 text-sm">{t("components.seoHubCta.medicallyReviewed")}</p>
          {reviewerName && (
            <p className="text-sm text-emerald-700 mt-0.5">Reviewed by {reviewerName}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-emerald-600">
            {reviewDate && <span>Review date: {reviewDate}</span>}
            {lastUpdated && <span>Last updated: {lastUpdated}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReferencesSection({ references }: { references: any[] }) {
  if (!references || references.length === 0) return null;

  return (
    <section className="border-t border-gray-200 pt-6 mt-8" data-testid="references-section">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{t("components.seoHubCta.references")}</h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
        {references.map((ref: any, i: number) => (
          <li key={i} data-testid={`reference-${i}`}>
            {typeof ref === "string" ? ref : (
              <>
                {ref.title}
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    [Link]
                  </a>
                )}
                {ref.source && <span className="text-gray-400 ml-1">— {ref.source}</span>}
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

interface PracticeQuestionPreviewProps {
  questions: {
    id: string;
    stem: string;
    options: string[];
    correctIndex: number;
    rationale: string;
    locked?: boolean;
  }[];
  tier: string;
  onUnlock?: () => void;
}

export function PracticeQuestionPreview({ questions, tier, onUnlock }: PracticeQuestionPreviewProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG["nclex-rn"];
  const freeQuestions = questions.filter(q => !q.locked);
  const lockedQuestions = questions.filter(q => q.locked);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden" data-testid="practice-question-preview">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Practice Questions Preview
        </h3>
        <p className="text-sm text-gray-600 mt-1">Try {freeQuestions.length} free questions with detailed rationales</p>
      </div>

      <div className="divide-y divide-gray-100">
        {freeQuestions.map((q, i) => (
          <div key={q.id} className="p-6" data-testid={`preview-question-${i}`}>
            <p className="font-medium text-gray-900 mb-3">{i + 1}. {q.stem}</p>
            <div className="space-y-2 mb-4">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="font-medium text-gray-400 shrink-0">{String.fromCharCode(65 + oi)}.</span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
            <details className="group">
              <summary className="text-sm font-medium text-primary cursor-pointer hover:underline" data-testid={`button-show-rationale-${i}`}>
                Show Answer & Rationale
              </summary>
              <div className="mt-3 bg-emerald-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium text-emerald-700 mb-1">
                  Correct Answer: {String.fromCharCode(65 + q.correctIndex)}
                </p>
                <p>{q.rationale}</p>
              </div>
            </details>
          </div>
        ))}

        {lockedQuestions.length > 0 && (
          <div className="p-6 bg-gray-50 relative" data-testid="locked-questions-teaser">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-gray-50 z-10" />
            <div className="relative z-20 text-center py-8">
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="font-bold text-gray-900 mb-1">
                +{lockedQuestions.length} Premium Questions Available
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Unlock the full {config.label} test bank with detailed rationales
              </p>
              <LocaleLink href="/pricing">
                <Button className="gap-2 rounded-full" data-testid="button-unlock-test-bank">
                  Unlock Full Test Bank <ArrowRight className="w-4 h-4" />
                </Button>
              </LocaleLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
