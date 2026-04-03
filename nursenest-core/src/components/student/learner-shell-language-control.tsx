"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { Button } from "@/components/ui/button";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/** Matches marketing header behavior: cookie + `router.refresh()` on `/app/…` (see `MarketingLanguagePreferenceList`). */
export function LearnerShellLanguageControl() {
  const { t, locale } = useMarketingI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1 rounded-full border-[var(--border-subtle)] bg-[var(--bg-card)] text-sm font-medium text-[var(--theme-menu-text)]"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {t("nav.language")}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </Button>
      {open ? (
        <div className="absolute right-0 z-50 mt-1 max-h-64 w-52 overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-elevated)]">
          <MarketingLanguagePreferenceList
            onDone={() => setOpen(false)}
            renderItem={({ code, name, flag, disabled, onSelect }) => (
              <button
                type="button"
                disabled={disabled}
                onClick={onSelect}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--surface-interactive-hover)] ${
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
  );
}
