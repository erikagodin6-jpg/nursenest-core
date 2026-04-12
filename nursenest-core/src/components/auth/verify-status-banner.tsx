"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const statusConfig: Record<string, { icon: typeof CheckCircle2; className: string; message: string }> = {
  success: {
    icon: CheckCircle2,
    className: "nn-verify-status--success",
    message: "Email verified. You can sign in now.",
  },
  expired: {
    icon: Clock,
    className: "nn-verify-status--warning",
    message: "This verification link has expired. Sign in and request a new one.",
  },
  invalid: {
    icon: AlertCircle,
    className: "nn-verify-status--warning",
    message: "This verification link is invalid. Sign in and request a new one.",
  },
  rate_limited: {
    icon: AlertCircle,
    className: "nn-verify-status--warning",
    message: "Too many attempts. Please wait a moment and try again.",
  },
};

export function VerifyStatusBanner() {
  const params = useSearchParams();
  const status = params.get("verify");
  if (!status || !statusConfig[status]) return null;

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`nn-verify-status ${config.className}`}>
      <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
      <p>{config.message}</p>
    </div>
  );
}
