"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button } from "@/components/ui/button";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/** Theme + UI language for account study settings (matches header controls, collected in one place). */
export function LearnerAccountSettingsPanel() {
  const { t, locale } = useMarketingI18n();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("learner.account.settings.themeHeading")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.settings.themeBody")}</p>
        <div className="mt-4">
          <ThemePicker className="max-w-md" />
        </div>
      </div>
      <div className="border-t border-border/60 pt-8" ref={langRef}>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("learner.account.settings.languageHeading")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.settings.languageBody")}</p>
        <div className="relative mt-4 max-w-md">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between rounded-xl border-[var(--border-subtle)]"
            aria-expanded={langOpen}
            onClick={() => setLangOpen((o) => !o)}
          >
            {t("nav.language")}
            <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
          </Button>
          {langOpen ? (
            <div className="absolute left-0 right-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-elevated)]">
              <MarketingLanguagePreferenceList
                onDone={() => setLangOpen(false)}
                renderItem={({ code, name, flag, disabled, onSelect }) => (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={onSelect}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-[var(--surface-interactive-hover)] ${
                      code === locale ? "bg-[var(--surface-interactive-hover)]/60 font-semibold" : ""
                    }`}
                  >
                    <span>{flag}</span>
                    {name}
                  </button>
                )}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
