"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, UserRound } from "lucide-react";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { CONTINUE_STUDYING_CTA } from "@/lib/copy/cta-copy";
import { FigmaPreviewNavLogo } from "./FigmaPreviewNavLogo";
import { FigmaPreviewNavMenu, FigmaPreviewNavMobileLinkList } from "./FigmaPreviewNavMenu";
import { FigmaPreviewNavMobileSheet } from "./FigmaPreviewNavMobileSheet";
import { FigmaPreviewNavShell, useFigmaPreviewNavScroll } from "./FigmaPreviewNavShell";
import { FigmaPreviewNavThemeToggle } from "./FigmaPreviewNavThemeToggle";
import { FigmaPreviewSyntheticBody } from "./FigmaPreviewSyntheticBody";
import type { FigmaPreviewAuthMode } from "./figma-preview-nav-types";

function VariantCBand({
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
        ? "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] shadow-[var(--elevation-rest)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--background)_72%,transparent)]"
        : "border-transparent bg-[color-mix(in_srgb,var(--background)_88%,transparent)] shadow-none backdrop-blur-lg supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--background)_78%,transparent)]",
    [scrolled],
  );

  return (
    <div
      className={`border-b transition-[border-color,box-shadow,background-color,backdrop-filter] duration-300 ease-out ${band}`}
      data-preview-auth={authMode}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <FigmaPreviewNavLogo />
          <FigmaPreviewNavMenu tone="glass" megaOpen={megaOpen} onMegaChange={setMegaOpen} />
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end lg:max-w-[min(100%,28rem)]">
          <div
            className="flex flex-1 items-center justify-end gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--card)_65%,transparent)] px-2 py-1.5 shadow-[var(--elevation-rest)] sm:flex-none"
            data-preview-utility-cluster="true"
          >
            <FigmaPreviewNavThemeToggle dropdownPortal />
            <span className="hidden h-6 w-px bg-[var(--semantic-border-soft)] sm:inline" aria-hidden />
            {authMode === "learner" ? (
              <>
                <Link
                  href="/app"
                  className="nn-ui-btn nn-ui-btn--ghost nn-ui-btn--sm hidden items-center gap-1.5 rounded-xl px-2 font-semibold sm:inline-flex"
                >
                  <UserRound className="h-4 w-4 opacity-80" aria-hidden />
                  Account
                </Link>
                <Link
                  href={HUB.examLessons}
                  className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--sm rounded-xl font-semibold"
                >
                  {CONTINUE_STUDYING_CTA}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={HUB.login}
                  className="nn-ui-btn nn-ui-btn--ghost nn-ui-btn--sm rounded-xl font-semibold"
                >
                  Sign in
                </Link>
                <Link
                  href={HUB.signup}
                  className="nn-ui-btn nn-ui-btn--primary nn-ui-btn--sm rounded-xl font-semibold"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--card)_55%,transparent)] text-[var(--foreground)] backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--card))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FigmaPreviewNavVariantC({ authMode }: { authMode: FigmaPreviewAuthMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const searchParams = useSearchParams();
  const debugDropdown = searchParams.get("dropdown") === "1";

  return (
    <>
      <FigmaPreviewNavShell variant="c">
        <VariantCBand
          authMode={authMode}
          megaOpen={megaOpen || Boolean(debugDropdown)}
          setMegaOpen={setMegaOpen}
          setMobileOpen={setMobileOpen}
        />
      </FigmaPreviewNavShell>
      <FigmaPreviewNavMobileSheet open={mobileOpen} onClose={() => setMobileOpen(false)} panelClassName="backdrop-blur-md">
        <div className="mb-6 flex flex-col gap-3 border-b border-[var(--semantic-border-soft)] pb-6">
          <FigmaPreviewNavThemeToggle dropdownPortal={false} />
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
                Account
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
        </div>
        <FigmaPreviewNavMobileLinkList tone="glass" onNavigate={() => setMobileOpen(false)} />
      </FigmaPreviewNavMobileSheet>
      <FigmaPreviewSyntheticBody variant="c" />
    </>
  );
}
