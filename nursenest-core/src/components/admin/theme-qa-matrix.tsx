"use client";

import { useMemo, useState } from "react";
import {
  brandLogoRasterContrastClass,
} from "@/lib/branding/logo-config";
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import { resolveThemeLogo } from "@/lib/branding/resolve-theme-logo";
import type { ThemeOption } from "@/lib/theme/theme-registry";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { THEME_PRESENTATION_CSS_VARS, THEME_RHYTHM_CSS_VARS } from "@/lib/theme/theme-presentation";

function ThemeQaCard({ opt }: { opt: ThemeOption }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const resolved = useMemo(() => resolveThemeLogo(opt.id, "full"), [opt.id]);
  const firstUrl = resolved.url ?? "";
  const usesLocalSvg = resolved.kind === "local" && Boolean(firstUrl);
  const contrastClass = brandLogoRasterContrastClass(opt.id);
  const lum = relativeLuminanceFromHex(opt.color);
  const softMark = lum >= 0.88 && opt.group === "light";

  return (
    <div
      data-theme={opt.id}
      className="flex flex-col gap-2 rounded-xl border border-border bg-[var(--theme-page-bg)] p-3 text-[var(--theme-body-text)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold text-[var(--theme-heading-text)]">{opt.id}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
            opt.group === "dark" ? "bg-slate-800 text-slate-100" : "bg-muted text-muted-foreground"
          }`}
        >
          {opt.group}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[var(--theme-muted-text)]">
        <span className="font-mono" title="Registry primary (generation source)">
          {opt.color}
        </span>
        <span title="WCAG relative luminance">L≈{lum.toFixed(2)}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 text-[9px]">
        {!usesLocalSvg ? (
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-medium text-amber-900 dark:text-amber-100">
            No logo path
          </span>
        ) : (
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-900 dark:text-emerald-100">
            Local SVG
          </span>
        )}
        {loadFailed ? (
          <span className="rounded bg-rose-500/15 px-1.5 py-0.5 font-medium text-rose-900 dark:text-rose-100">
            Asset missing / failed
          </span>
        ) : null}
        {contrastClass ? (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary" title="Runtime presentation boost">
            Contrast boost
          </span>
        ) : null}
        {softMark && !contrastClass ? (
          <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">Light tint</span>
        ) : null}
      </div>

      <div
        className="h-2 w-full rounded border border-[var(--theme-card-border)]"
        style={{ background: "var(--theme-page-bg)" }}
        title="Page background"
      />

      <div className="rounded-md border border-[var(--theme-card-border)] bg-[color-mix(in_srgb,var(--theme-nav-bg)_92%,var(--theme-primary))] px-2 py-1.5">
        <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">Header / top bar</p>
        {firstUrl ? (
          <img
            src={firstUrl}
            alt={`${opt.label} theme wordmark`}
            className={`h-8 w-auto max-w-full object-contain object-left [image-rendering:auto] ${contrastClass}`.trim()}
            onLoad={() => {
              setLoadFailed(false);
            }}
            onError={() => {
              setLoadFailed(true);
            }}
          />
        ) : (
          <span className="text-[10px] text-[var(--theme-muted-text)]">No logo URL</span>
        )}
      </div>

      {opt.group === "dark" ? (
        <div
          className="h-6 w-full rounded border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)]"
          title="Dark theme page bg sample"
        />
      ) : null}

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
        <p className="mt-0.5 text-[10px] leading-snug text-[var(--theme-muted-text)]">Body sample for contrast.</p>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--theme-card-border)] pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- QA favicon smoke test */}
        <img src="/favicon.ico" alt="" width={20} height={20} className="h-5 w-5 shrink-0 rounded-sm" />
        <span className="text-[9px] text-[var(--theme-muted-text)]">Favicon (global, default theme tint)</span>
      </div>
    </div>
  );
}

/** Single-theme vertical slice: hero, tonal bands, CTAs, footer (switch global theme to compare). */
function ThemeQaLayoutHarmonySample() {
  return (
    <div
      data-theme="lavender"
      className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]"
    >
      <div className="nn-hero-bridge bg-[var(--theme-page-bg)] px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
          <span className="text-xs font-semibold text-[var(--theme-heading-text)]">Header / brand row</span>
          <span className="rounded-full bg-[var(--nn-presentation-badge)] px-2 py-0.5 text-[10px] text-[var(--theme-heading-text)]">
            Badge
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-primary">Hero sample</p>
            <p className="text-lg font-bold leading-tight text-[var(--theme-heading-text)]">Headline hierarchy</p>
            <p className="text-sm text-[var(--theme-muted-text)]">Subhead spacing uses shared rhythm tokens.</p>
            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
              <button type="button" className="nn-btn-primary px-4 py-2 text-sm font-semibold">
                Primary CTA
              </button>
              <button type="button" className="nn-btn-secondary px-4 py-2 text-sm font-semibold">
                Secondary
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-panel)] p-4">
            <p className="text-[10px] font-semibold uppercase text-[var(--theme-muted-text)]">Card / proof</p>
            <p className="mt-2 text-sm text-[var(--theme-body-text)]">
              Supporting surfaces stay in the active theme family (no second palette).
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-px border-t border-[var(--border-subtle)] sm:grid-cols-3">
        <div className="bg-[var(--nn-presentation-trust-band)] p-3 text-[10px] font-medium text-[var(--theme-body-text)]">
          Trust band
        </div>
        <div className="bg-[var(--nn-presentation-wash)] p-3 text-[10px] font-medium text-[var(--theme-body-text)]">Wash</div>
        <div className="bg-[var(--nn-presentation-ribbon)] p-3 text-[10px] font-medium text-[var(--theme-body-text)]">Ribbon</div>
      </div>
      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-section)] px-4 py-4 text-center text-[10px] text-[var(--theme-muted-text)] sm:px-6">
        Footer rhythm sample (marketing shell)
      </div>
    </div>
  );
}

function ThemeQaTokenLegend() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
      <p className="font-semibold text-foreground">CSS variables (see `globals.css`)</p>
      <p className="mt-2 font-mono text-[10px] leading-relaxed">
        {THEME_PRESENTATION_CSS_VARS.join(", ")}
      </p>
      <p className="mt-3 font-mono text-[10px] leading-relaxed">{THEME_RHYTHM_CSS_VARS.join(", ")}</p>
    </div>
  );
}

/** Horizontal scroll: same mini layout repeated with `data-theme` on each column. */
function ThemeQaPerThemeStripCard({ opt }: { opt: ThemeOption }) {
  const firstUrl = useMemo(() => resolveThemeLogo(opt.id, "full").url ?? "", [opt.id]);
  const contrastClass = brandLogoRasterContrastClass(opt.id);

  return (
    <div
      data-theme={opt.id}
      className="flex w-[min(100%,210px)] shrink-0 flex-col gap-1.5 rounded-xl border border-border bg-[var(--theme-page-bg)] p-2.5 text-[9px] text-[var(--theme-body-text)] shadow-sm"
    >
      <p className="font-mono font-semibold text-[var(--theme-heading-text)]">{opt.id}</p>
      <div className="rounded border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--theme-nav-bg)_92%,var(--theme-primary))] px-1.5 py-1">
        {firstUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- QA: resolver smoke test
          <img
            src={firstUrl}
            alt=""
            className={`h-5 w-auto max-w-full object-contain object-left [image-rendering:auto] ${contrastClass}`.trim()}
          />
        ) : (
          <span className="text-[var(--theme-muted-text)]">No logo</span>
        )}
      </div>
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] px-2 py-2">
        <p className="font-bold leading-tight text-[var(--theme-heading-text)]">Hero line</p>
        <p className="mt-0.5 text-[var(--theme-muted-text)]">Subhead rhythm</p>
        <div className="nn-hero-cta-row mt-1.5">
          <span className="inline-flex min-h-[22px] items-center justify-center rounded-md bg-primary px-2 text-[8px] font-semibold text-primary-foreground">
            Primary
          </span>
          <span className="inline-flex min-h-[22px] items-center justify-center rounded-md border border-[var(--border-medium)] bg-[var(--theme-card-bg)] px-2 text-[8px] font-semibold text-[var(--theme-heading-text)]">
            Secondary
          </span>
        </div>
      </div>
      <div className="rounded border border-[var(--nn-presentation-divider)] bg-[var(--nn-presentation-trust-band)] px-1.5 py-1 text-center font-medium">
        Trust band
      </div>
      <div className="rounded border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-1.5">
        <p className="font-semibold text-[var(--theme-heading-text)]">Card</p>
        <p className="mt-0.5 leading-snug text-[var(--theme-muted-text)]">Accent surfaces stay in-family.</p>
      </div>
      <div className="border-t border-[var(--border-subtle)] pt-1.5 text-center">
        <span className="inline-flex min-h-[20px] items-center justify-center rounded-md bg-primary/90 px-3 py-1 text-[8px] font-semibold text-primary-foreground">
          Final CTA
        </span>
      </div>
    </div>
  );
}

function ThemeQaAllThemesHorizontalStrip() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Per-theme horizontal strip</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Same structure in every column; only <code className="rounded bg-muted px-1">data-theme</code> changes. Scroll to
        compare rhythm, contrast, and wash or panel tones side by side.
      </p>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 pt-1 [-webkit-overflow-scrolling:touch]">
        {THEME_OPTIONS.map((opt) => (
          <ThemeQaPerThemeStripCard key={opt.id} opt={opt} />
        ))}
      </div>
    </div>
  );
}

/**
 * Dev/admin visual matrix: isolated `data-theme` wrappers + resolver checks.
 * Remove when stable; not linked from public marketing.
 */
export function ThemeQaMatrix() {
  return (
    <div className="space-y-10">
      <ThemeQaAllThemesHorizontalStrip />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {THEME_OPTIONS.map((opt) => (
          <ThemeQaCard key={opt.id} opt={opt} />
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Layout harmony (lavender sample)</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Change the site theme in the header, then refresh to compare how the same structure reads. Tokens above stay
          anchored to the active palette.
        </p>
        <div className="mt-4 space-y-4">
          <ThemeQaLayoutHarmonySample />
          <ThemeQaTokenLegend />
        </div>
      </div>
    </div>
  );
}
