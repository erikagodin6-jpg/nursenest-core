"use client";

import { THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { getThemeLogoLoadChain } from "@/lib/theme/theme-logo-url";

/**
 * Dev/admin visual matrix: isolated `data-theme` wrappers so each row shows real CSS tokens + first resolved logo URL.
 * Remove when theme assets are stable; not linked from public marketing.
 */
export function ThemeQaMatrix() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {THEME_OPTIONS.map((opt) => {
        const chain = getThemeLogoLoadChain(opt.id);
        const logoSrc = chain[0] ?? "";
        return (
          <div
            key={opt.id}
            data-theme={opt.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-[var(--theme-page-bg)] p-3 text-[var(--theme-body-text)]"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold text-[var(--theme-heading-text)]">{opt.id}</span>
              <span className="max-w-[40%] truncate text-[10px] text-[var(--theme-muted-text)]" title={opt.label}>
                {opt.label}
              </span>
            </div>

            <div className="rounded-md border border-[var(--theme-card-border)] bg-[color-mix(in_srgb,var(--theme-nav-bg)_92%,var(--theme-primary))] px-2 py-1.5">
              <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">Header strip</p>
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt=""
                  className="h-8 w-auto max-w-full object-contain object-left [image-rendering:auto]"
                />
              ) : (
                <span className="text-[10px] text-[var(--theme-muted-text)]">No logo URL</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Primary
              </button>
              <span className="rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-2 py-0.5 text-[10px] text-[var(--theme-body-text)]">
                Chip
              </span>
            </div>

            <div className="rounded-lg border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-2 shadow-sm">
              <p className="text-[10px] font-semibold text-[var(--theme-heading-text)]">Card</p>
              <p className="mt-0.5 text-[10px] leading-snug text-[var(--theme-muted-text)]">
                Body sample for contrast check.
              </p>
            </div>

            <div className="flex items-center gap-2 border-t border-[var(--theme-card-border)] pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny QA preview */}
              <img src="/favicon.ico" alt="" width={20} height={20} className="h-5 w-5 shrink-0 rounded-sm" />
              <span className="text-[9px] text-[var(--theme-muted-text)]">Favicon (global)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
