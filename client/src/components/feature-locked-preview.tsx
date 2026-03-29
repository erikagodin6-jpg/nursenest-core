import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, TrendingUp, Brain, BarChart3, Zap, Bot } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { type Feature, getUpgradeMessage, FEATURE_LABELS, canAccessFeature } from "@/lib/entitlements";

const FEATURE_ICONS: Partial<Record<Feature, typeof Lock>> = {
  adaptive_engine: Brain,
  pass_probability_model: BarChart3,
  intelligent_recommendations: Sparkles,
  unlimited_mock_exams: TrendingUp,
  case_simulations: Zap,
  ai_study_coach: Bot,
};

interface FeatureLockedPreviewProps {
  feature: Feature;
  children?: React.ReactNode;
  previewContent?: React.ReactNode;
  className?: string;
}

export function FeatureLockedPreview({ feature, children, previewContent, className = "" }: FeatureLockedPreviewProps) {
  const { effectiveTier } = useAuth();
  const [, navigate] = useLocation();

  if (canAccessFeature(effectiveTier, feature)) {
    return <>{children}</>;
  }

  const Icon = FEATURE_ICONS[feature] || Lock;
  const message = getUpgradeMessage(feature);
  const label = FEATURE_LABELS[feature];

  return (
    <div className={`relative ${className}`} data-testid={`feature-locked-${feature}`}>
      {previewContent && (
        <div className="relative">
          <div className="opacity-40 blur-[2px] pointer-events-none select-none" aria-hidden="true">
            {previewContent}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
        </div>
      )}
      <Card className="border border-gray-200 shadow-md bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto" data-testid={`text-locked-message-${feature}`}>
              {message}
            </p>
          </div>
          <Button
            className="rounded-full px-6"
            onClick={() => navigate("/pricing")}
            data-testid={`button-upgrade-${feature}`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { effectiveTier } = useAuth();

  if (canAccessFeature(effectiveTier, feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <FeatureLockedPreview feature={feature} />;
}

export function useFeatureAccess(feature: Feature): { hasAccess: boolean; message: string; label: string } {
  const { effectiveTier } = useAuth();
  return {
    hasAccess: canAccessFeature(effectiveTier, feature),
    message: getUpgradeMessage(feature),
    label: FEATURE_LABELS[feature],
  };
}
