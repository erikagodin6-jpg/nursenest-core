"use client";

/**
 * Five-country selector — replaces the Canada Hub / US Hub navigation destinations.
 * Country selection is a persistent global preference, not a page navigation.
 *
 * Variants:
 *   "header"  — Compact inline trigger + popover list for the header utility strip.
 *   "mobile"  — Full-width native <select> for the mobile drawer.
 *   "inline"  — Expanded list (for settings pages or onboarding flows).
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import {
  COUNTRY_CONFIGS,
  COUNTRY_PREFERENCE_OPTIONS,
  type CountryPreference,
} from "@/lib/region/country-preference";
import { useCountryPreference } from "@/lib/region/use-country-preference";

type CountrySelectorDropdownProps = {
  variant?: "header" | "mobile" | "inline";
  className?: string;
  onCountryChange?: (next: CountryPreference) => void;
};

const LABEL = "Country / Exam Region";

export function CountrySelectorDropdown({
  variant = "header",
  className,
  onCountryChange,
}: CountrySelectorDropdownProps) {
  const { country, setCountry } = useCountryPreference();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (next: CountryPreference) => {
    setCountry(next);
    onCountryChange?.(next);
    setOpen(false);
  };

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent) {
        const t = e.target as Node;
        if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      }
      setOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const cfg = COUNTRY_CONFIGS[country];

  if (variant === "mobile") {
    return (
      <label className={`flex flex-col gap-1 ${className ?? ""}`}>
        <span className="text-xs font-semibold text-[var(--theme-muted-text)]">{LABEL}</span>
        <select
          value={country}
          onChange={(e) => handleSelect(e.target.value as CountryPreference)}
          className="min-h-[44px] w-full rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-3 text-sm font-medium text-[var(--theme-body-text)]"
        >
          {COUNTRY_PREFERENCE_OPTIONS.map((pref) => {
            const c = COUNTRY_CONFIGS[pref];
            return (
              <option key={pref} value={pref}>
                {c.flag} {c.displayName}
              </option>
            );
          })}
        </select>
      </label>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex flex-col gap-1 ${className ?? ""}`}
        role="listbox"
        aria-label={LABEL}
      >
        <p className="mb-2 text-xs font-semibold text-[var(--theme-muted-text)]">{LABEL}</p>
        {COUNTRY_PREFERENCE_OPTIONS.map((pref) => {
          const c = COUNTRY_CONFIGS[pref];
          const active = pref === country;
          return (
            <button
              key={pref}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => handleSelect(pref)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--theme-card-bg))] text-[var(--semantic-brand)]"
                  : "text-[var(--theme-body-text)] hover:bg-[var(--theme-hover)]"
              }`}
            >
              <span className="text-lg leading-none">{c.flag}</span>
              <span className="flex-1 text-left">{c.displayName}</span>
              {active && (
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // variant === "header"
  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${LABEL}: ${cfg.displayName}`}
        className="flex min-h-[32px] items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--nav-fg)_18%,transparent)] bg-transparent px-2.5 py-1 text-[0.8125rem] font-medium text-[var(--nav-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--nav-fg)_8%,transparent)]"
      >
        <Globe className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
        <span className="hidden sm:inline text-base leading-none">{cfg.flag}</span>
        <span className="max-w-[88px] truncate">{cfg.displayName}</span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label={LABEL}
          className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-card-hover)]"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            {LABEL}
          </p>
          {COUNTRY_PREFERENCE_OPTIONS.map((pref) => {
            const c = COUNTRY_CONFIGS[pref];
            const active = pref === country;
            return (
              <button
                key={pref}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(pref)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--nav-bg))] text-[var(--semantic-brand)]"
                    : "text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                }`}
              >
                <span className="text-lg leading-none">{c.flag}</span>
                <span className="flex-1 text-left">{c.displayName}</span>
                {active && (
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-[var(--semantic-brand)]"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
