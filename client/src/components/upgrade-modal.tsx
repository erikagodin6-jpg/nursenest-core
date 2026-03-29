import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  Target,
  TrendingUp,
  GraduationCap,
  CalendarCheck,
  Activity,
  Check,
  ArrowRight,
} from "lucide-react";
import { suppressPopup } from "@/lib/popup-suppression";

import { useI18n } from "@/lib/i18n";
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: string;
  tier?: string;
}

const TRIGGER_COPY: Record<string, { heading: string; subheading: string }> = {
  diagnostic_completed: {
    heading: "Your diagnostic is complete",
    subheading: "See exactly where you stand with predictive pass analytics and a personalized study plan.",
  },
  mock_completed: {
    heading: "Great work completing your mock exam",
    subheading: "Unlock detailed probability analysis and confidence bands to guide your next study session.",
  },
  moderate_risk: {
    heading: "Your results suggest room for growth",
    subheading: "A targeted study plan with real-time adjustments can help you focus on the areas that matter most.",
  },
  exam_approaching: {
    heading: "Your exam date is getting closer",
    subheading: "Predictive analytics and strict CAT mode can help you prepare with confidence in the time you have.",
  },
};

const DEFAULT_COPY = {
  heading: "Ready for deeper insights?",
  subheading: "Upgrade to access predictive analytics, personalized study plans, and advanced exam preparation tools.",
};

const PREMIUM_FEATURES = [
  { icon: BarChart3, label: "Full pass probability percentage" },
  { icon: Activity, label: "Confidence band analysis" },
  { icon: TrendingUp, label: "Probability Improvement Simulator" },
  { icon: GraduationCap, label: "Strict CAT exam mode" },
  { icon: CalendarCheck, label: "Personalized study plan with auto-adjustments" },
  { icon: Target, label: "Advanced analytics dashboard" },
];

function logUpgradeEvent(eventType: string, trigger: string) {
  const { t } = useI18n();
  try {
    fetch("/api/upgrade/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, metadata: { trigger, timestamp: new Date().toISOString() } }),
    }).catch(() => {});
  } catch {
  }
}

export function UpgradeModal({ isOpen, onClose, trigger, tier }: UpgradeModalProps) {
  const [, navigate] = useLocation();
  const [dontShowToday, setDontShowToday] = useState(false);
  const copy = TRIGGER_COPY[trigger] || DEFAULT_COPY;

  const pricingPath = tier ? `/pricing/${tier}` : "/pricing";

  useEffect(() => {
    if (isOpen) {
      setDontShowToday(false);
      logUpgradeEvent("upgrade_modal_shown", trigger);
    }
  }, [isOpen, trigger]);

  const handleClose = useCallback(() => {
    logUpgradeEvent("upgrade_dismissed", trigger);
    if (dontShowToday) {
      suppressPopup("upgrade_modal");
    }
    onClose();
  }, [onClose, trigger, dontShowToday]);

  const handleCtaClick = useCallback(() => {
    logUpgradeEvent("upgrade_clicked", trigger);
    onClose();
    navigate(pricingPath);
  }, [onClose, trigger, navigate, pricingPath]);

  const handleViewPricing = useCallback(() => {
    logUpgradeEvent("upgrade_clicked", trigger);
    onClose();
    navigate("/pricing");
  }, [onClose, trigger, navigate]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden !max-h-[90vh] !overflow-y-auto"
        data-testid="upgrade-modal"
      >
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle
              className="text-xl font-semibold text-gray-900"
              data-testid="text-upgrade-heading"
            >
              {copy.heading}
            </DialogTitle>
            <DialogDescription
              className="text-sm text-gray-600 mt-1"
              data-testid="text-upgrade-subheading"
            >
              {copy.subheading}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Premium includes
            </p>
            <ul className="space-y-2.5">
              {PREMIUM_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li
                    key={feature.label}
                    className="flex items-center gap-3"
                    data-testid={`feature-${feature.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-gray-700">{feature.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="flex-1 text-center p-3 rounded-lg border border-gray-200 bg-white"
                data-testid="pricing-monthly"
              >
                <p className="text-xs text-gray-500 mb-1">{t("components.upgradeModal.monthly")}</p>
                <p className="text-lg font-semibold text-gray-900">$19.99</p>
                <p className="text-xs text-gray-400">/month</p>
              </div>
              <div
                className="flex-1 text-center p-3 rounded-lg border-2 border-primary bg-primary/5 relative"
                data-testid="pricing-quarterly"
              >
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  Best Value
                </span>
                <p className="text-xs text-gray-500 mb-1">{t("components.upgradeModal.3monthBundle")}</p>
                <p className="text-lg font-semibold text-gray-900">$14.99</p>
                <p className="text-xs text-gray-400">/month</p>
              </div>
            </div>

            <Button
              className="w-full h-11 text-sm font-medium"
              onClick={handleCtaClick}
              data-testid="button-upgrade-cta"
            >
              <Check className="w-4 h-4 mr-2" />
              Unlock Predictive Analytics
            </Button>

            <button
              className="w-full text-center text-xs text-gray-500 hover:text-primary transition-colors mt-2 py-1 flex items-center justify-center gap-1"
              onClick={handleViewPricing}
              data-testid="link-view-pricing"
            >
              View all plans
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 border-t pt-3">
            <Checkbox
              id="upgrade-dont-show-today"
              checked={dontShowToday}
              onCheckedChange={(checked) => setDontShowToday(checked === true)}
              data-testid="checkbox-upgrade-dont-show-today"
            />
            <Label htmlFor="upgrade-dont-show-today" className="text-xs text-gray-400 cursor-pointer">
              Don't show again today
            </Label>
          </div>

          <p
            className="text-[10px] text-gray-400 leading-relaxed text-center pt-2"
            data-testid="text-disclaimer"
          >
            Predictions are coaching estimates based on your performance and do not represent official exam scoring.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
