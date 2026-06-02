"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { AuthLeafBackground } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingAuthMintBlossomTheme } from "@/components/auth/marketing-auth-mint-blossom-theme";
import { AuthMessageBanner } from "@/components/auth/auth-experience/auth-message-banner";
import { AuthContinuationCard } from "@/components/auth/auth-experience/auth-continuation-card";
import type { AuthExperienceState } from "@/components/auth/auth-experience/auth-experience-types";
import { useAuthTransitionPresentation } from "@/components/auth/auth-experience/use-auth-transition-presentation";
import type { AuthTransitionPresentationInput } from "@/lib/auth/auth-transition-types";
import type { OAuthProviderId } from "@/lib/auth/auth-flow-governance";
import { authTransitionTelemetryProps } from "@/lib/auth/auth-transition-telemetry";

export type AuthTransitionShellProps = AuthTransitionPresentationInput & {
  className?: string;
  oauthProvider?: OAuthProviderId | null;
  showLoading?: boolean;
  children?: React.ReactNode;
};

function stateIdForKind(kind: AuthTransitionPresentationInput["kind"]): AuthExperienceState | undefined {
  switch (kind) {
    case "session-expired":
      return "session-expired";
    case "authentication-error":
      return "oauth-error";
    case "oauth-continuation":
      return "continuation";
    default:
      return undefined;
  }
}

function motionClass(preset: string): string {
  return `nn-auth-transition-shell--${preset}`;
}

/**
 * Unified auth transition renderer — inline banners, loading strips, OAuth continuation,
 * and full-page celebration layouts. All copy from {@link resolveAuthTransitionPresentation}.
 */
export function AuthTransitionShell({
  className = "",
  oauthProvider,
  showLoading = false,
  children,
  ...input
}: AuthTransitionShellProps) {
  const presentation = useAuthTransitionPresentation({
    ...input,
    oauthProvider,
  });
  const resolvedLayout = input.layout ?? (input.kind === "email-verified" ? "full-page" : "inline");
  const telemetry = authTransitionTelemetryProps(presentation, resolvedLayout);

  if (resolvedLayout === "full-page" && input.kind === "email-verified") {
    return (
      <MarketingAuthMintBlossomTheme>
        <main
          className={`nn-premium-auth-verified nn-marketing-x nn-rhythm-page ${motionClass(presentation.motionPreset)} ${className}`.trim()}
          data-nn-premium-auth-verified=""
          aria-labelledby="auth-transition-heading"
          {...telemetry}
        >
          {presentation.watermarkStyle.ambient !== "none" ? (
            <AuthLeafBackground placement="page-ambient" />
          ) : null}
          <div className="nn-premium-auth-verified__brand">
            <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-10 !max-h-10" />
            <span className="nn-premium-auth-theme-pill">Sea Glass · Premium study</span>
          </div>
          <section className="nn-premium-auth-verified__layout">
            <div className="nn-premium-auth-verified__celebrate">
              {presentation.watermarkStyle.hero !== "none" ? <AuthLeafBackground placement="panel-hero" /> : null}
              <div className="relative z-[1]">
                <div className="nn-premium-auth-verified__success-ring nn-auth-transition-success-ring" aria-hidden>
                  <Check className="h-12 w-12 text-[var(--auth-success)]" strokeWidth={2.5} />
                </div>
                <p className="nn-premium-auth-eyebrow">{presentation.eyebrow}</p>
                <h1 id="auth-transition-heading">{presentation.title}</h1>
                <p className="nn-premium-auth-verified__lead">{presentation.body}</p>
                {presentation.help ? <p className="nn-premium-auth-verified__hint">{presentation.help}</p> : null}
              </div>
            </div>
            <div className="nn-premium-auth-verified__next">
              <div className="relative z-[1]">
                {presentation.whatsNextEyebrow ? (
                  <p className="nn-premium-auth-eyebrow">{presentation.whatsNextEyebrow}</p>
                ) : null}
                {presentation.whatsNextTitle ? (
                  <h2 className="nn-premium-auth-verified__next-title">{presentation.whatsNextTitle}</h2>
                ) : null}
                <ol className="nn-premium-auth-verified__steps">
                  {presentation.nextSteps.map((step, index) => (
                    <li key={step.title}>
                      <span className="nn-premium-auth-verified__step-num" aria-hidden>
                        {index + 1}
                      </span>
                      <div>
                        <strong>{step.title}</strong>
                        <span>{step.detail}</span>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="nn-premium-auth-verified__actions">
                  {presentation.primaryAction ? (
                    <Link
                      href={presentation.primaryAction.href}
                      className="nn-premium-auth-primary-button inline-flex w-full items-center justify-center no-underline"
                    >
                      {presentation.primaryAction.label}
                    </Link>
                  ) : null}
                  {presentation.secondaryAction ? (
                    <Link
                      href={presentation.secondaryAction.href}
                      className="nn-premium-auth-verified__secondary-btn inline-flex w-full items-center justify-center no-underline"
                    >
                      {presentation.secondaryAction.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
          {children}
        </main>
      </MarketingAuthMintBlossomTheme>
    );
  }

  if (input.kind === "oauth-continuation") {
    const label = presentation.oauthProviderLabel ?? "your provider";
    return (
      <div className={className} data-nn-auth-transition-shell="" {...telemetry}>
        <AuthContinuationCard
          providerLabel={label}
          studyHint={input.studyHint}
          eyebrow={presentation.eyebrow}
          title={presentation.title}
          fallbackDetail={presentation.help}
          loading
        />
      </div>
    );
  }

  const showStrip =
    showLoading ||
    input.kind === "loading" ||
    input.kind === "sign-in-success" ||
    input.kind === "sign-up-completion";

  if (showStrip) {
    return (
      <div
        className={`nn-auth-transition-loading mb-4 ${motionClass(presentation.motionPreset)} ${className}`.trim()}
        data-nn-auth-transition-loading
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={presentation.accessibilityAnnouncement}
        {...telemetry}
      >
        <div className="nn-auth-transition-loading__mark" aria-hidden>
          <span className="nn-auth-continuation-card__leaf nn-auth-transition-loading__leaf" />
          <span className="nn-auth-continuation-card__progress" />
        </div>
        <div className="nn-auth-transition-loading__copy">
          <p className="nn-auth-transition-loading__headline">{presentation.loadingCopy.headline}</p>
          {presentation.loadingCopy.detail ? (
            <p className="nn-auth-transition-loading__detail">{presentation.loadingCopy.detail}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (
    resolvedLayout === "panel" &&
    (input.kind === "account-recovery" || input.kind === "password-reset-success")
  ) {
    return (
      <div
        className={`nn-auth-transition-panel mb-4 space-y-3 ${motionClass(presentation.motionPreset)} ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-label={presentation.accessibilityAnnouncement}
        {...telemetry}
      >
        <p className="nn-auth-transition-panel__eyebrow">{presentation.eyebrow}</p>
        <h2 className="nn-auth-transition-panel__title">{presentation.title}</h2>
        <p className="nn-auth-transition-panel__body">{presentation.body}</p>
        {presentation.help ? <p className="nn-auth-transition-panel__help">{presentation.help}</p> : null}
        {presentation.primaryAction ? (
          <Link href={presentation.primaryAction.href} className="nn-auth-transition-panel__action">
            {presentation.primaryAction.label}
          </Link>
        ) : null}
        {children}
      </div>
    );
  }

  return (
    <div className={className} data-nn-auth-transition-shell="" {...telemetry}>
      <AuthMessageBanner
        tone={presentation.tone}
        stateId={stateIdForKind(input.kind)}
        title={presentation.title}
        message={presentation.body}
        help={presentation.help}
      />
      {children}
    </div>
  );
}
