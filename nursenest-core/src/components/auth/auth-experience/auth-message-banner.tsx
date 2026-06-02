"use client";

import type { AuthMessageBannerProps } from "@/components/auth/auth-experience/auth-experience-types";

const TONE_ATTR: Record<AuthMessageBannerProps["tone"], string> = {
  default: "default",
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
};

/**
 * Accessible, theme-aware auth status banner — single primitive for all auth routes.
 */
export function AuthMessageBanner({
  tone,
  title,
  message,
  help,
  stateId,
  className = "",
}: AuthMessageBannerProps) {
  const role = tone === "danger" ? "alert" : "status";
  const live = tone === "danger" ? "assertive" : "polite";

  return (
    <div
      className={`nn-auth-message-banner mb-4 ${className}`.trim()}
      data-nn-auth-message-banner
      data-nn-auth-message-tone={TONE_ATTR[tone]}
      data-nn-auth-state={stateId ?? undefined}
      data-nn-premium-auth-session-expired={stateId === "session-expired" ? "" : undefined}
      data-nn-premium-auth-error-state={stateId === "oauth-error" || stateId === "validation-error" ? "" : undefined}
      role={role}
      aria-live={live}
    >
      <p className="nn-auth-message-banner__title">{title}</p>
      {message ? <p className="nn-auth-message-banner__body">{message}</p> : null}
      {help ? <p className="nn-auth-message-banner__help">{help}</p> : null}
    </div>
  );
}
