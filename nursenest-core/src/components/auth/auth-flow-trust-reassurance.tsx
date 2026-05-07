"use client";

import Link from "next/link";
import { CircleHelp, KeyRound, ShieldCheck, Wifi } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { isPlaceholderAuthCopy } from "@/lib/ui/is-placeholder-auth-copy";

type Variant = "login" | "signup";

/** `aboveForm`: spacing before the form (inside auth card). `standalone`: below primary card; outer page supplies gap. */
type TrustLayout = "aboveForm" | "standalone";

const ICONS = [ShieldCheck, CircleHelp, KeyRound, Wifi] as const;

const warnedSuppressedPairs = new Set<string>();

function warnSuppressedPair(pairKey: string) {
  if (process.env.NODE_ENV !== "development") return;
  if (warnedSuppressedPairs.has(pairKey)) return;
  warnedSuppressedPairs.add(pairKey);
  console.warn("[AuthFlowTrustReassurance] suppressed FAQ item (placeholder or missing copy)", { pairKey });
}

/**
 * Short reassurance for login/signup. Copy comes from `pages.authTrust.*` in marketing i18n;
 * items that look like placeholders or missing-catalog fallbacks are omitted. When nothing
 * valid remains, shows a single help line + support link when `contactHref` is set.
 */
export function AuthFlowTrustReassurance({
  variant,
  layout = "aboveForm",
  contactHref,
}: {
  variant: Variant;
  layout?: TrustLayout;
  /** Support or contact page (path or absolute URL used by marketing routes). */
  contactHref?: string;
}) {
  const { t } = useMarketingI18n();

  const defs: {
    Icon: (typeof ICONS)[number];
    qKey: string;
    aKey: string;
  }[] = [
    {
      Icon: ICONS[0],
      qKey: "pages.authTrust.accountSafeQuestion",
      aKey: "pages.authTrust.accountSafeAnswer",
    },
    {
      Icon: ICONS[1],
      qKey: "pages.authTrust.loginNotWorkingQuestion",
      aKey: "pages.authTrust.loginNotWorkingAnswer",
    },
    {
      Icon: ICONS[2],
      qKey: "pages.authTrust.forgotPasswordQuestion",
      aKey:
        variant === "login"
          ? "pages.authTrust.forgotPasswordAnswerLogin"
          : "pages.authTrust.forgotPasswordAnswerSignup",
    },
    {
      Icon: ICONS[3],
      qKey: "pages.authTrust.reliableQuestion",
      aKey: "pages.authTrust.reliableAnswer",
    },
  ];

  const headingKey = "pages.authTrust.heading";
  const headingText = t(headingKey);
  const headingOk = !isPlaceholderAuthCopy(headingText, headingKey);

  const items: { Icon: (typeof ICONS)[number]; q: string; a: string }[] = [];

  for (const d of defs) {
    const q = t(d.qKey);
    const aKey = d.aKey;
    const a = t(aKey);
    const badQ = isPlaceholderAuthCopy(q, d.qKey);
    const badA = isPlaceholderAuthCopy(a, aKey);
    if (badQ || badA) {
      warnSuppressedPair(`${d.qKey}+${aKey}`);
      continue;
    }
    items.push({ Icon: d.Icon, q, a });
  }

  const helpLineKey = "pages.authTrust.fallbackHelpLine";
  const helpLine = t(helpLineKey);
  const helpLineOk = !isPlaceholderAuthCopy(helpLine, helpLineKey);
  const contactLabel = t("pages.login.recoveryContactLink");
  const contactLabelOk = !isPlaceholderAuthCopy(contactLabel, "pages.login.recoveryContactLink");

  const panelClass =
    "rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-3 text-left sm:p-4";
  const layoutClass = layout === "aboveForm" ? "mb-5" : "";

  if (items.length === 0) {
    if (!contactHref || !helpLineOk || !contactLabelOk) {
      return null;
    }
    return (
      <div className={[layoutClass, panelClass].filter(Boolean).join(" ")}>
        <p className="text-sm leading-relaxed text-[var(--semantic-text-primary)]">
          {helpLine}{" "}
          <Link
            href={contactHref}
            className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
          >
            {contactLabel}
          </Link>
          {t("pages.login.recoveryContactSuffix")}
        </p>
      </div>
    );
  }

  return (
    <div className={[layoutClass, panelClass].filter(Boolean).join(" ")} aria-labelledby="auth-trust-heading">
      {headingOk ? (
        <p
          id="auth-trust-heading"
          className="text-[11px] font-semibold tracking-wide text-[var(--semantic-info)]"
        >
          {headingText}
        </p>
      ) : (
        <p id="auth-trust-heading" className="sr-only">
          {items[0]?.q ?? "FAQ"}
        </p>
      )}
      <ul className={`${headingOk ? "mt-2.5" : "mt-0"} space-y-2.5`}>
        {items.map(({ Icon, q, a }) => (
          <li key={q} className="flex gap-3">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] sm:h-8 sm:w-8"
              aria-hidden
            >
              <Icon className="h-3.5 w-3.5 text-[var(--semantic-info)] sm:h-4 sm:w-4" />
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
