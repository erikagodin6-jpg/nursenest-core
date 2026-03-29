"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

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

  const current = mounted ? (resolvedTheme ?? theme ?? "lavender") : "lavender";
  const currentLabel = THEME_OPTIONS.find((o) => o.id === current)?.label ?? current;
  const L = { ...DEFAULT_THEME_LABELS, ...labels };

  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 rounded-full border border-[var(--theme-nav-border)] bg-[var(--theme-nav-bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--theme-menu-text)] opacity-80"
          aria-label={L.navTheme}
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--theme-primary)]" />
          <span className="max-w-[7rem] truncate">{L.navTheme}</span>
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
        className="flex items-center gap-1.5 rounded-full border border-[var(--theme-nav-border)] bg-[var(--theme-nav-bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)] hover:text-[var(--theme-menu-hover-text)]"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--theme-primary)]" />
        <span className="max-w-[7rem] truncate">{L.navTheme}</span>
        <span className="text-[10px] opacity-70">▾</span>
      </button>
      {open && (
        <div
          className="absolute right-0 z-[100] mt-1 max-h-[min(70vh,22rem)] w-56 overflow-y-auto rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] py-1 shadow-lg"
          role="listbox"
        >
          {(["light", "dark"] as const).map((group) => (
            <div key={group}>
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-text)]">
                {group === "light" ? L.themeGroupLight : L.themeGroupDark}
              </p>
              {THEME_OPTIONS.filter((o) => o.group === group).map((opt) => (
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
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--theme-menu-hover-bg)] ${
                    opt.id === current ? "font-semibold text-primary" : "text-[var(--theme-menu-text)]"
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: opt.color }} />
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
          <p className="border-t border-[var(--theme-separator)] px-3 py-1.5 text-[10px] text-[var(--theme-muted-text)]">{currentLabel}</p>
        </div>
      )}
    </div>
  );
}
