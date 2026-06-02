"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { CONTINUE_STUDYING_CTA } from "@/lib/copy/cta-copy";
import { FigmaPreviewNavLogo } from "./FigmaPreviewNavLogo";
import { FigmaPreviewNavMenu, FigmaPreviewNavMobileLinkList } from "./FigmaPreviewNavMenu";
import { FigmaPreviewNavMobileSheet } from "./FigmaPreviewNavMobileSheet";
import { FigmaPreviewNavShell, useFigmaPreviewNavScroll } from "./FigmaPreviewNavShell";
import { FigmaPreviewNavThemeToggle } from "./FigmaPreviewNavThemeToggle";
import { FigmaPreviewSyntheticBody } from "./FigmaPreviewSyntheticBody";
import type { FigmaPreviewAuthMode } from "./figma-preview-nav-types";

function VariantBBand({
  authMode,
  megaOpen,
  setMegaOpen,
  setMobileOpen,
}: {
  authMode: FigmaPreviewAuthMode;
  megaOpen: boolean;
  setMegaOpen: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
}) {
  const { scrolled } = useFigmaPreviewNavScroll();

  const band = useMemo(
    () =>
      scrolled
        ? "border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--background)_94%,var(--semantic-panel-cool))] shadow-[var(--elevation-rest)]"
        : "border-transparent bg-[color-mix(in_srgb,var(--background)_90%,var(--semantic-panel-warm))] shadow-none",
    [scrolled],
  );

  return (
    <div
      className={`border-b transition-[border-color,box-shadow,background-color] duration-300 ease-out ${band}`}
      data-preview-auth={authMode}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <FigmaPreviewNavLogo />
        <FigmaPreviewNavMenu tone="pastel" megaOpen={megaOpen} onMegaChange={setMegaOpen} />
        <div className="hidden items-center gap-2.5 lg:flex">
          <div className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--background))] p-1">
            <FigmaPreviewNavThemeToggle />
          </div>
          {authMode === "learner" ? (
            <>
              <Link
                href={HUB.examLessons}
                className="nn-nav-cta nn-text-on-solid-fill inline-flex min-h-10 items-center rounded-full px-5 text-sm font-semibold shadow-[var(--elevation-rest)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px"
              >
                {CONTINUE_STUDYING_CTA}
              </Link>
              <Link
                href="/app"
                className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md inline-flex min-h-10 items-center justify-center rounded-full border-[var(--semantic-border-soft)] px-4 font-semibold"
              >
                Workspace
              </Link>
            </>
          ) : (
            <>
              <Link
                href={HUB.login}
                className="nn-ui-btn nn-ui-btn--ghost nn-ui-btn--md inline-flex min-h-10 items-center justify-center rounded-full px-4 font-semibold hover:bg-[color-mix(in_srgb,var(--semantic-info)_14%,transparent)]"
              >
                Sign in
              </Link>
              <Link
                href={HUB.signup}
                className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md inline-flex min-h-10 items-center justify-center rounded-full px-5 font-semibold"
              >
                Get started
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,transparent)] text-[var(--foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-info)_16%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function FigmaPreviewNavVariantB({ authMode }: { authMode: FigmaPreviewAuthMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const searchParams = useSearchParams();
  const debugDropdown = searchParams.get("dropdown") === "1";

  return (
    <>
      <FigmaPreviewNavShell variant="b">
        <VariantBBand
          authMode={authMode}
          megaOpen={megaOpen || Boolean(debugDropdown)}
          setMegaOpen={setMegaOpen}
          setMobileOpen={setMobileOpen}
        />
      </FigmaPreviewNavShell>
      <FigmaPreviewNavMobileSheet open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div className="mb-6 flex flex-col gap-3 border-b border-[var(--semantic-border-soft)] pb-6">
          <FigmaPreviewNavThemeToggle dropdownPortal={false} />
          {authMode === "learner" ? (
            <div className="flex flex-col gap-2">
              <Link
                href={HUB.examLessons}
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-full font-semibold"
              >
                {CONTINUE_STUDYING_CTA}
              </Link>
              <Link
                href="/app"
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-full font-semibold"
              >
                Workspace
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={HUB.login}
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-full font-semibold"
              >
                Sign in
              </Link>
              <Link
                href={HUB.signup}
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-full font-semibold"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
        <FigmaPreviewNavMobileLinkList tone="pastel" onNavigate={() => setMobileOpen(false)} />
      </FigmaPreviewNavMobileSheet>
      <FigmaPreviewSyntheticBody variant="b" />
    </>
  );
}
