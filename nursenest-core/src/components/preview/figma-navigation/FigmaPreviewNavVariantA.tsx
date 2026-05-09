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

function VariantABand({
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
        ? "border-[var(--semantic-border-soft)] bg-[var(--background)] shadow-[var(--elevation-rest)]"
        : "border-transparent bg-[color-mix(in_srgb,var(--background)_97%,var(--card))] shadow-none",
    [scrolled],
  );

  return (
    <div
      className={`border-b transition-[border-color,box-shadow,background-color] duration-300 ease-out ${band}`}
      data-preview-auth={authMode}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <FigmaPreviewNavLogo />
        <FigmaPreviewNavMenu tone="clinical" megaOpen={megaOpen} onMegaChange={setMegaOpen} />
        <div className="hidden items-center gap-2 lg:flex">
          <FigmaPreviewNavThemeToggle />
          {authMode === "learner" ? (
            <>
              <Link
                href={HUB.examLessons}
                className="nn-nav-cta nn-text-on-solid-fill inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold shadow-[var(--elevation-rest)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[var(--elevation-hover)]"
              >
                {CONTINUE_STUDYING_CTA}
              </Link>
              <Link
                href="/app"
                className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md inline-flex min-h-10 items-center justify-center rounded-xl px-4 font-semibold"
              >
                Study workspace
              </Link>
            </>
          ) : (
            <>
              <Link
                href={HUB.login}
                className="nn-ui-btn nn-ui-btn--ghost nn-ui-btn--md inline-flex min-h-10 items-center justify-center rounded-xl px-4 font-semibold"
              >
                Sign in
              </Link>
              <Link
                href={HUB.signup}
                className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md inline-flex min-h-10 items-center justify-center rounded-xl px-4 font-semibold"
              >
                Get started
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] text-[var(--foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_55%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] lg:hidden"
          aria-label="Open menu"
          aria-expanded={false}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function FigmaPreviewNavVariantA({ authMode }: { authMode: FigmaPreviewAuthMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const searchParams = useSearchParams();
  const debugDropdown = searchParams.get("dropdown") === "1";

  return (
    <>
      <FigmaPreviewNavShell variant="a">
        <VariantABand
          authMode={authMode}
          megaOpen={megaOpen || Boolean(debugDropdown)}
          setMegaOpen={setMegaOpen}
          setMobileOpen={setMobileOpen}
        />
      </FigmaPreviewNavShell>
      <FigmaPreviewNavMobileSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        panelClassName="bg-[var(--background)]"
      >
        <div className="mb-6 flex flex-col gap-3 border-b border-[var(--semantic-border-soft)] pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Account</p>
          {authMode === "learner" ? (
            <div className="flex flex-col gap-2">
              <Link
                href={HUB.examLessons}
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-xl font-semibold"
              >
                {CONTINUE_STUDYING_CTA}
              </Link>
              <Link
                href="/app"
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-xl font-semibold"
              >
                Study workspace
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={HUB.login}
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--outline nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-xl font-semibold"
              >
                Sign in
              </Link>
              <Link
                href={HUB.signup}
                onClick={() => setMobileOpen(false)}
                className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--md flex w-full min-h-11 items-center justify-center rounded-xl font-semibold"
              >
                Get started
              </Link>
            </div>
          )}
          <FigmaPreviewNavThemeToggle className="w-full justify-center" dropdownPortal={false} />
        </div>
        <FigmaPreviewNavMobileLinkList tone="clinical" onNavigate={() => setMobileOpen(false)} />
      </FigmaPreviewNavMobileSheet>
      <FigmaPreviewSyntheticBody variant="a" />
    </>
  );
}
