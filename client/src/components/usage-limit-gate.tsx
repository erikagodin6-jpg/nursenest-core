import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface UsageLimitGateProps {
  feature: "lab-values" | "med-math";
  count: number;
  limit: number;
  remaining: number;
}

const featureNames: Record<string, string> = {
  "lab-values": "Lab Interpretation",
  "med-math": "Med Math",
};

const featurePrices: Record<string, { CAD: number; USD: number }> = {
  "lab-values": { CAD: 9.99, USD: 7.99 },
  "med-math": { CAD: 9.99, USD: 7.99 },
};

export function UsageLimitBanner({ feature, remaining, limit, count }: UsageLimitGateProps) {
  const { t } = useI18n();
  if (remaining <= 0) return null;
  if (remaining > 3) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3" data-testid="banner-usage-warning">
      <Zap className="w-5 h-5 text-amber-600 shrink-0" />
      <p className="text-sm text-amber-800">
        <span className="font-bold">{remaining}</span> of {limit} free daily questions remaining.
        {" "}
        <LocaleLink href="/pricing" className="underline font-semibold hover:text-amber-900">
          Upgrade for unlimited access
        </LocaleLink>
      </p>
    </div>
  );
}

export function UsageLimitPaywall({ feature }: { feature: "lab-values" | "med-math" }) {
  const { user } = useAuth();
  const region = (localStorage.getItem("nursenest-region") as "US" | "CA") || "US";
  const isCAD = region === "CA";
  const price = featurePrices[feature];
  const name = featureNames[feature];

  return (
    <Card className="border-2 border-primary/20 shadow-xl" data-testid="card-usage-paywall">
      <CardContent className="p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">
            Daily Limit Reached
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You've completed your 10 free {name} questions for today. Upgrade to continue practicing with unlimited questions.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 max-w-sm mx-auto space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Unlimited {name}</p>
            <p className="text-3xl font-bold text-gray-900">
              {isCAD ? `$${price.CAD} CAD` : `$${price.USD} USD`}
              <span className="text-base font-normal text-gray-500">/mo</span>
            </p>
          </div>

          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary shrink-0" />
              Unlimited daily {name.toLowerCase()} questions
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary shrink-0" />
              All categories and difficulty levels
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary shrink-0" />
              Detailed step-by-step rationales
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <LocaleLink href="/pricing">
            <Button className="gap-2 px-8 rounded-full" data-testid="button-upgrade-feature">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Button>
          </LocaleLink>
        </div>

        {!user && (
          <p className="text-xs text-gray-400">
            <LocaleLink href="/login" className="underline hover:text-gray-600">{t("components.usageLimitGate.signIn")}</LocaleLink> to track your progress and daily usage across devices.
          </p>
        )}

        <p className="text-xs text-gray-400">
          Questions reset daily at midnight. Come back tomorrow for 10 more free questions.
        </p>
      </CardContent>
    </Card>
  );
}
