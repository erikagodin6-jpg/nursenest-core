"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { figmaPreviewMegaMenu, figmaPreviewPrimaryLinks } from "./figma-preview-nav-config";

const NAV_BTN =
  "nn-marketing-nav-link inline-flex min-h-10 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-[var(--foreground)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]";

export type FigmaPreviewNavMenuTone = "clinical" | "pastel" | "glass";

export function FigmaPreviewNavMenu({
  tone,
  megaOpen,
  onMegaChange,
}: {
  tone: FigmaPreviewNavMenuTone;
  megaOpen: boolean;
  onMegaChange: (open: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!megaOpen) return;
    const close = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onMegaChange(false);
    };
    document.addEventListener("pointerdown", close, true);
    return () => document.removeEventListener("pointerdown", close, true);
  }, [megaOpen, onMegaChange]);

  const pillHover =
    tone === "pastel"
      ? "hover:bg-[color-mix(in_srgb,var(--semantic-info)_14%,transparent)]"
      : tone === "glass"
        ? "hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,transparent)]"
        : "hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_55%,transparent)]";

  const megaSurface =
    tone === "pastel"
      ? "border-[color-mix(in_srgb,var(--semantic-panel-warm)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--background)_92%,var(--semantic-panel-cool))]"
      : tone === "glass"
        ? "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--background)_78%,transparent)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--background)_70%,transparent)]"
        : "border-[var(--semantic-border-soft)] bg-[var(--card)]";

  return (
    <nav aria-label="Preview primary" className="hidden items-center gap-0.5 lg:flex" ref={wrapRef}>
      {figmaPreviewPrimaryLinks.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`${NAV_BTN} ${pillHover}`}
          data-preview-nav-link={item.key}
        >
          {item.label}
        </Link>
      ))}
      <div className="relative">
        <button
          type="button"
          className={`${NAV_BTN} ${pillHover}`}
          aria-expanded={megaOpen}
          aria-haspopup="true"
          data-preview-dropdown-trigger="pathways"
          onClick={() => onMegaChange(!megaOpen)}
        >
          {figmaPreviewMegaMenu.label}
          <ChevronDown
            className={`h-4 w-4 shrink-0 opacity-80 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {megaOpen ? (
          <div
            data-preview-dropdown-panel="open"
            className={`absolute start-0 top-[calc(100%+0.5rem)] z-[120] min-w-[min(100vw-2rem,36rem)] rounded-2xl border p-5 shadow-[var(--elevation-overlay)] ${megaSurface}`}
            role="region"
            aria-label={`${figmaPreviewMegaMenu.label} links`}
          >
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">{figmaPreviewMegaMenu.description}</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {figmaPreviewMegaMenu.columns.map((col) => (
                <div key={col.heading}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    {col.heading}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className={`${NAV_BTN} justify-start px-2 py-2 ${pillHover}`}
                          onClick={() => onMegaChange(false)}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

/** Mobile list — links + mega links flattened */
export function FigmaPreviewNavMobileLinkList({
  onNavigate,
  tone,
}: {
  onNavigate: () => void;
  tone: FigmaPreviewNavMenuTone;
}) {
  const subtle =
    tone === "pastel"
      ? "rounded-xl border border-transparent bg-[color-mix(in_srgb,var(--semantic-info)_8%,transparent)]"
      : "rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--card)_90%,transparent)]";

  return (
    <div className="flex flex-col gap-3">
      {figmaPreviewPrimaryLinks.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`nn-marketing-nav-link min-h-12 px-3 py-3 text-base font-medium ${subtle}`}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
      <div className={`${subtle} px-3 py-3`}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          {figmaPreviewMegaMenu.label}
        </p>
        <ul className="flex flex-col gap-2">
          {figmaPreviewMegaMenu.columns.flatMap((c) =>
            c.links.map((l) => (
              <li key={`${c.heading}-${l.label}`}>
                <Link href={l.href} className="nn-marketing-nav-link block py-1 text-base" onClick={onNavigate}>
                  {l.label}
                </Link>
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
