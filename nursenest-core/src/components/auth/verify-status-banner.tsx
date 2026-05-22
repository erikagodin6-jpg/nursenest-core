"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { resolveVerifyEmailBannerPresentation } from "@/lib/auth/auth-transition-governance";

const statusConfig: Record<
  string,
  { icon: typeof CheckCircle2; className: string; status: "success" | "expired" | "invalid" | "rate_limited" }
> = {
  success: {
    icon: CheckCircle2,
    className: "nn-verify-status--success",
    status: "success",
  },
  expired: {
    icon: Clock,
    className: "nn-verify-status--warning",
    status: "expired",
  },
  invalid: {
    icon: AlertCircle,
    className: "nn-verify-status--warning",
    status: "invalid",
  },
  rate_limited: {
    icon: AlertCircle,
    className: "nn-verify-status--warning",
    status: "rate_limited",
  },
};

export function VerifyStatusBanner() {
  const params = useSearchParams();
  const { t } = useMarketingI18n();
  const status = params.get("verify");
  const registered = params.get("registered") === "1";

  if (status && statusConfig[status]) {
    const config = statusConfig[status];
    const Icon = config.icon;
    const copy = resolveVerifyEmailBannerPresentation(config.status);
    return (
      <div
        className={`nn-verify-status ${config.className}`}
        data-nn-premium-auth-verification
        data-nn-auth-transition="email-verified"
      >
        <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">{copy.title}</p>
          <p className="mt-0.5 text-sm opacity-90">{copy.message}</p>
        </div>
      </div>
    );
  }

  if (registered) {
    return (
      <div className="nn-verify-status nn-verify-status--success mb-4" data-nn-premium-auth-email-sent>
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden />
        <p>{t("pages.login.postSignupBanner")}</p>
      </div>
    );
  }

  return null;
}
