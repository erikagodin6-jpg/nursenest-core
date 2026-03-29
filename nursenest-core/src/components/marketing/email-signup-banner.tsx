"use client";

import { useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/** Legacy `EmailSignupPrompt` banner variant — structure parity; submit wired in PHASE 2. */
export function EmailSignupBanner() {
  const { t } = useMarketingI18n();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-[var(--theme-card-border)] bg-gradient-to-br from-primary/10 via-[var(--theme-card-bg)] to-[var(--theme-secondary)] p-6 shadow-[var(--shadow-card)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("footer.emailBannerTitle")}</h3>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{t("footer.emailBannerSubtitle")}</p>
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
          <button type="submit" className="nn-btn-primary whitespace-nowrap px-6 py-2.5 text-sm font-bold">
            {t("home.email.button")}
          </button>
        </form>
      </div>
      {msg ? <p className="mt-3 text-center text-xs text-[var(--theme-muted-text)]">{msg}</p> : null}
    </div>
  );
}
