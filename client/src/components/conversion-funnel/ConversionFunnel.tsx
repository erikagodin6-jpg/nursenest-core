import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { Crown, ArrowRight, Sparkles } from "lucide-react";
import { InlinePracticePreview } from "./InlinePracticePreview";
import { InlineFlashcardPreview } from "./InlineFlashcardPreview";
import { MockExamTeaser } from "./MockExamTeaser";
import { PremiumFeatureSummary } from "./PremiumFeatureSummary";
import { SocialProofBar } from "./SocialProofBar";

import { useI18n } from "@/lib/i18n";
interface ConversionFunnelProps {
  topic?: string;
  bodySystem?: string;
  profession?: string;
  showPracticeQuestions?: boolean;
  showFlashcards?: boolean;
  showProgressPrompt?: boolean;
  showMockExam?: boolean;
  showPremiumSummary?: boolean;
  showSocialProof?: boolean;
  showTopCta?: boolean;
  showMidCta?: boolean;
  showBottomCta?: boolean;
  children?: ReactNode;
}

function FunnelCTA({ position, profession }: { position: "top" | "mid" | "bottom"; profession?: string }) {
  const { t } = useI18n();
  const { user, effectiveTier } = useAuth();
  if (user && effectiveTier && effectiveTier !== "free") return null;

  const ctaConfig = {
    top: {
      text: user ? "Upgrade for Full Access" : "Start Free — No Credit Card",
      href: user ? "/pricing" : "/start-free",
      variant: "subtle" as const,
    },
    mid: {
      text: user ? "Unlock All Study Tools" : "Create Your Free Account",
      href: user ? "/pricing" : "/start-free",
      variant: "default" as const,
    },
    bottom: {
      text: user ? "Get Full Access Now" : "Start Your Free Trial",
      href: user ? "/pricing" : "/start-free",
      variant: "prominent" as const,
    },
  };

  const config = ctaConfig[position];

  if (config.variant === "subtle") {
    return (
      <div className="flex items-center justify-center py-3" data-testid={`funnel-cta-${position}`}>
        <LocaleLink href={config.href}>
          <Button variant="outline" size="sm" className="rounded-xl gap-2 text-sm border-primary/20 text-primary hover:bg-primary/5">
            <Sparkles className="w-3.5 h-3.5" /> {config.text}
          </Button>
        </LocaleLink>
      </div>
    );
  }

  if (config.variant === "prominent") {
    return (
      <div className="py-6 px-4 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-blue-50 border border-primary/15 text-center space-y-3" data-testid={`funnel-cta-${position}`}>
        <h3 className="text-lg font-bold text-gray-900">
          {user ? "Ready to level up?" : "Ready to get started?"}
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          {user
            ? "Full access to every lesson, question, flashcard, and mock exam."
            : "Join thousands of students preparing for their exams with confidence."}
        </p>
        <LocaleLink href={config.href}>
          <Button className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-white px-8 shadow-sm" data-testid="button-funnel-cta-bottom">
            <Crown className="w-4 h-4" /> {config.text} <ArrowRight className="w-4 h-4" />
          </Button>
        </LocaleLink>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4 px-4 bg-primary/5 rounded-xl border border-primary/10" data-testid={`funnel-cta-${position}`}>
      <LocaleLink href={config.href}>
        <Button className="rounded-xl gap-2" data-testid="button-funnel-cta-mid">
          <Crown className="w-4 h-4" /> {config.text} <ArrowRight className="w-4 h-4" />
        </Button>
      </LocaleLink>
    </div>
  );
}

function ProgressPrompt() {
  const { user } = useAuth();
  if (user) return null;

  return (
    <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 text-center space-y-3" data-testid="funnel-progress-prompt">
      <h4 className="font-bold text-gray-900">{t("components.conversionFunnelConversionFunnel.trackYourStudyProgress")}</h4>
      <p className="text-sm text-gray-600 max-w-md mx-auto">
        Create a free account to save your quiz scores, track which topics you've mastered, and get personalized study recommendations.
      </p>
      <LocaleLink href="/start-free">
        <Button size="sm" className="rounded-xl gap-2" data-testid="button-progress-signup">
          Start Free <ArrowRight className="w-4 h-4" />
        </Button>
      </LocaleLink>
    </div>
  );
}

export function ConversionFunnel({
  topic,
  bodySystem,
  profession,
  showPracticeQuestions = true,
  showFlashcards = true,
  showProgressPrompt = true,
  showMockExam = true,
  showPremiumSummary = true,
  showSocialProof = true,
  showTopCta = true,
  showMidCta = true,
  showBottomCta = true,
  children,
}: ConversionFunnelProps) {
  const { user, effectiveTier } = useAuth();
  const isPaid = user && effectiveTier && effectiveTier !== "free";

  return (
    <div className="space-y-8" data-testid="conversion-funnel">
      {showTopCta && !isPaid && (
        <FunnelCTA position="top" profession={profession} />
      )}

      {children}

      {showPracticeQuestions && (
        <InlinePracticePreview
          topic={topic}
          bodySystem={bodySystem}
          profession={profession}
        />
      )}

      {showFlashcards && (
        <InlineFlashcardPreview
          topic={topic}
          bodySystem={bodySystem}
          profession={profession}
        />
      )}

      {showMidCta && !isPaid && (
        <FunnelCTA position="mid" profession={profession} />
      )}

      {showProgressPrompt && <ProgressPrompt />}

      {showMockExam && (
        <MockExamTeaser profession={profession} />
      )}

      {showSocialProof && (
        <SocialProofBar tier={effectiveTier || undefined} />
      )}

      {showPremiumSummary && !isPaid && (
        <PremiumFeatureSummary profession={profession} />
      )}

      {showBottomCta && !isPaid && (
        <FunnelCTA position="bottom" profession={profession} />
      )}
    </div>
  );
}
