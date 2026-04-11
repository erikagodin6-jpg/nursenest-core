"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";

const DEFAULT_THEME_LABELS = {
  navTheme: "Theme",
  themeGroupLight: "Light",
  themeGroupDark: "Dark",
} as const;

export type ThemePickerLabels = Partial<Record<keyof typeof DEFAULT_THEME_LABELS, string>>;

/** Lightweight theme control. Pass `labels` from marketing `useMarketingI18n`; learner shell omits labels (English defaults, no marketing JSON). */
export function ThemePicker({ className = "", labels }: { className?: string; labels?: ThemePickerLabels }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    /** Bubble phase so theme option clicks run before outside-close logic. */
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown, false);
    return () => document.removeEventListener("pointerdown", onDown, false);
  }, [open]);

  const current = mounted ? (resolvedTheme ?? theme ?? NURSENEST_DEFAULT_THEME) : NURSENEST_DEFAULT_THEME;
  const currentLabel = THEME_OPTIONS.find((o) => o.id === current)?.label ?? current;
  const L = { ...DEFAULT_THEME_LABELS, ...labels };

  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 rounded-full border border-[var(--palette-nav-border)] bg-[var(--palette-nav-background)] px-2.5 py-1.5 text-xs font-semibold text-[var(--palette-nav-text)] opacity-80"
          aria-label={L.navTheme}
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--palette-primary)]" />
          <span className="max-w-[min(100%,11rem)] text-start leading-tight break-words [overflow-wrap:anywhere]">{L.navTheme}</span>
          <span className="text-[10px] opacity-70">▾</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1.5 rounded-full border border-[var(--palette-nav-border)] bg-[var(--palette-nav-background)] px-2.5 py-1.5 text-xs font-semibold text-[var(--palette-nav-text)] shadow-[var(--elevation-rest)] transition-[background-color,color,transform,box-shadow] duration-150 ease-out hover:-translate-y-px hover:bg-[var(--palette-nav-hover)] hover:text-[var(--palette-heading)] hover:shadow-[var(--elevation-hover)]"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--palette-primary)]" />
        <span className="max-w-[min(100%,11rem)] text-start leading-tight break-words [overflow-wrap:anywhere]">{L.navTheme}</span>
        <span className="text-[10px] opacity-70">▾</span>
      </button>
      {open && (
        <div
          className="absolute end-0 z-[100] mt-1 max-h-[min(70vh,22rem)] w-56 overflow-y-auto rounded-xl border border-[var(--border-subtle,var(--palette-border))] bg-[var(--bg-elevated,var(--palette-surface))] py-1 shadow-[var(--elevation-overlay)]"
          role="listbox"
        >
          {/* Named / featured themes */}
          {(() => {
            const named = THEME_OPTIONS.filter((o) => o.named);
            return named.length > 0 ? (
              <div>
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--palette-text-muted)]">
                  Featured
                </p>
                {named.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={opt.id === current}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(opt.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-[background-color,color] duration-150 ease-out hover:bg-[var(--palette-nav-hover)] ${
                      opt.id === current ? "font-semibold text-[var(--palette-accent)]" : "text-[var(--palette-nav-text)]"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: opt.color }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null;
          })()}
          {(["light", "dark"] as const).map((group) => (
            <div key={group}>
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--palette-text-muted)]">
                {group === "light" ? L.themeGroupLight : L.themeGroupDark}
              </p>
              {THEME_OPTIONS.filter((o) => o.group === group && !o.named).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={opt.id === current}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTheme(opt.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-[background-color,color] duration-150 ease-out hover:bg-[var(--palette-nav-hover)] ${
                    opt.id === current ? "font-semibold text-[var(--palette-accent)]" : "text-[var(--palette-nav-text)]"
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: opt.color }} />
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
          <p className="border-t border-[var(--header-nav-border)] px-3 py-1.5 text-[10px] text-[var(--palette-text-muted)]">{currentLabel}</p>
        </div>
      )}
    </div>
  );
}
