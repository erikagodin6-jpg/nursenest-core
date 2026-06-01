"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRY_CONFIGS, COUNTRY_PREFERENCE_OPTIONS, resolveClientCountryPreference } from "@/lib/region/country-preference";
import { useCountryPreference } from "@/lib/region/use-country-preference";
import type { CountryPreference } from "@/lib/region/country-preference";

/**
 * Cookie-driven country preference hint on the blog index.
 * Replaces the old "Canada Hub" / "US Hub" link pattern — country selection is a preference,
 * not a navigation destination.
 */
export function RegionalBlogDiscoveryHint() {
  const { country, setCountry } = useCountryPreference();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch — only show after client mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close switcher on outside click.
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  if (!mounted) return null;

  // Only show when a non-default preference has been explicitly stored.
  const stored = resolveClientCountryPreference();
  if (!stored) return null;

  const cfg = COUNTRY_CONFIGS[country];

  return (
    <div
      className="mb-8 rounded-xl border border-[var(--semantic-border-soft)] p-4"
      style={{ background: "color-mix(in srgb, var(--semantic-panel-cool) 10%, var(--semantic-surface))" }}
      role="region"
      aria-label="Country preference"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
          {cfg.flag} Showing content for <span className="text-[var(--semantic-brand)]">{cfg.displayName}</span>
        </p>
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-xs font-semibold text-[var(--theme-body-text)] transition-colors hover:border-[var(--semantic-brand)] hover:text-[var(--semantic-brand)]"
          >
            Change country
          </button>
          {open && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-1 shadow-lg">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                Country / Exam Region
              </p>
              {COUNTRY_PREFERENCE_OPTIONS.map((pref: CountryPreference) => {
                const c = COUNTRY_CONFIGS[pref];
                const active = pref === country;
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => { setCountry(pref); setOpen(false); }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                        : "text-[var(--theme-body-text)] hover:bg-[var(--theme-hover)]"
                    }`}
                  >
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="flex-1 text-left">{c.displayName}</span>
                    {active && <span className="inline-block h-2 w-2 rounded-full bg-[var(--semantic-brand)]" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-[var(--theme-muted-text)]">
        Exam labels and content recommendations update automatically based on your selected country.
      </p>
    </div>
  );
}
