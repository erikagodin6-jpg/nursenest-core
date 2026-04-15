"use client";

import { CircleHelp, KeyRound, ShieldCheck, Wifi } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type Variant = "login" | "signup";

const ICONS = [ShieldCheck, CircleHelp, KeyRound, Wifi] as const;

/**
 * Addresses common auth anxieties (safety, failures, password reset, reliability) on login/signup.
 */
export function AuthFlowTrustReassurance({ variant }: { variant: Variant }) {
  const { t } = useMarketingI18n();

  const items: { q: string; a: string; Icon: (typeof ICONS)[number] }[] = [
    {
      Icon: ICONS[0],
      q: t("pages.authTrust.accountSafeQuestion"),
      a: t("pages.authTrust.accountSafeAnswer"),
    },
    {
      Icon: ICONS[1],
      q: t("pages.authTrust.loginNotWorkingQuestion"),
      a: t("pages.authTrust.loginNotWorkingAnswer"),
    },
    {
      Icon: ICONS[2],
      q: t("pages.authTrust.forgotPasswordQuestion"),
      a:
        variant === "login"
          ? t("pages.authTrust.forgotPasswordAnswerLogin")
          : t("pages.authTrust.forgotPasswordAnswerSignup"),
    },
    {
      Icon: ICONS[3],
      q: t("pages.authTrust.reliableQuestion"),
      a: t("pages.authTrust.reliableAnswer"),
    },
  ];

  return (
    <div
      className="mb-6 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-4 text-left"
      aria-labelledby="auth-trust-heading"
    >
      <p id="auth-trust-heading" className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">
        {t("pages.authTrust.heading")}
      </p>
      <ul className="mt-3 space-y-3">
        {items.map(({ Icon, q, a }) => (
          <li key={q} className="flex gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))]"
              aria-hidden
            >
              <Icon className="h-4 w-4 text-[var(--semantic-info)]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">{q}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{a}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
