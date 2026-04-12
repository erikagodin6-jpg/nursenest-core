"use client";

import { useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MARKETING_PRIMARY_CTA_COMPACT_CLASS } from "@/lib/theme/marketing-hero-pattern";

/** Legacy `EmailSignupPrompt` banner variant — structure parity; submit wired in PHASE 2. */
export function EmailSignupBanner() {
  const { t } = useMarketingI18n();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-6 shadow-[var(--semantic-shadow-soft)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="nn-marketing-h3">{t("footer.emailBannerTitle")}</h3>
          <p className="nn-marketing-body-sm mt-1 text-[var(--theme-muted-text)]">{t("footer.emailBannerSubtitle")}</p>
        </div>
        <form
          className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setMsg(t("footer.emailBannerPhase2"));
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("home.email.placeholder")}
            className="min-w-[220px] rounded-full border border-[var(--theme-input-border)] bg-[var(--theme-input-bg)] px-4 py-2.5 text-sm text-[var(--theme-heading-text)] outline-none ring-primary focus:ring-2"
          />
          <button type="submit" className={`${MARKETING_PRIMARY_CTA_COMPACT_CLASS} whitespace-nowrap px-6`}>
            {t("home.email.button")}
          </button>
        </form>
      </div>
      {msg ? <p className="mt-3 text-center text-xs text-[var(--theme-muted-text)]">{msg}</p> : null}
    </div>
  );
}
