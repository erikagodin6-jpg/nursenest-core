import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  Crown,
  CheckCircle2,
  BookOpen,
  ClipboardList,
  Layers,
  GraduationCap,
  Brain,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface PremiumFeatureSummaryProps {
  profession?: string;
  variant?: "default" | "compact";
}

const DEFAULT_FEATURES = [
  { icon: BookOpen, label: "Complete lesson library across every body system" },
  { icon: ClipboardList, label: "Thousands of exam-style practice questions" },
  { icon: Layers, label: "Full flashcard decks with spaced repetition" },
  { icon: GraduationCap, label: "Multiple timed mock exams with analytics" },
  { icon: Brain, label: "Adaptive study engine that targets weak areas" },
  { icon: BarChart3, label: "Detailed progress tracking and performance insights" },
];

export function PremiumFeatureSummary({
  profession,
  variant = "default",
}: PremiumFeatureSummaryProps) {
  const { t } = useI18n();
  const { user, effectiveTier } = useAuth();

  if (user && effectiveTier && effectiveTier !== "free") return null;

  const profLabel = profession
    ? profession.charAt(0).toUpperCase() + profession.slice(1)
    : "nursing";

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-5 border border-primary/10" data-testid="premium-feature-summary-compact">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-5 h-5 text-primary" />
          <h4 className="font-bold text-gray-900">{t("components.conversionFunnelPremiumFeatureSummary.unlockFullAccess")}</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {DEFAULT_FEATURES.slice(0, 4).map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{f.label.split(" ").slice(0, 5).join(" ")}</span>
            </div>
          ))}
        </div>
        <LocaleLink href="/pricing">
          <Button size="sm" className="rounded-xl gap-2 w-full" data-testid="button-premium-compact-cta">
            <Sparkles className="w-4 h-4" /> View Plans
          </Button>
        </LocaleLink>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="premium-feature-summary">
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900">
          Everything You Need to Pass
        </h3>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-white to-blue-50/50 shadow-sm" data-testid="card-premium-features">
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Get full access to our comprehensive {profLabel} study platform. Join thousands of students who passed their exams with confidence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {DEFAULT_FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-gray-100"
                  data-testid={`feature-item-${i}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-gray-700 leading-snug pt-1">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <LocaleLink href="/pricing" className="flex-1">
              <Button className="rounded-xl gap-2 w-full bg-primary hover:bg-primary/90 shadow-sm" data-testid="button-premium-upgrade">
                <Crown className="w-4 h-4" />
                {user ? "Upgrade Now" : "Start Free Trial"}
              </Button>
            </LocaleLink>
            {!user && (
              <LocaleLink href="/start-free" className="flex-1">
                <Button variant="outline" className="rounded-xl gap-2 w-full" data-testid="button-premium-free">
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </Button>
              </LocaleLink>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
