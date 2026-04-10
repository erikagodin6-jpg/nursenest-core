"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { BRAND_NAME } from "@/lib/branding/logo-config";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { pickNotFoundCopy } from "@/lib/ui/not-found-copy";
import { BROWSE_LESSONS_HREF, buildNotFoundRecoverySuggestions, type NotFoundRecoveryLink } from "@/lib/ui/not-found-recovery";

function themeGroupForId(themeId: string | undefined): "light" | "dark" | undefined {
  if (!themeId) return undefined;
  return THEME_OPTIONS.find((o) => o.id === themeId)?.group;
}

function secondaryButtonClass(): string {
  return "inline-flex min-h-[44px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_05%,var(--semantic-surface))] px-5 py-2.5 text-sm font-semibold text-primary transition motion-safe:duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]";
}

function recoveryButtonClass(): string {
  return "inline-flex min-h-[40px] w-full max-w-md items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-2.5 text-left text-sm font-semibold text-[var(--semantic-text-primary)] transition motion-safe:duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-info)_28%,transparent)] sm:w-auto";
}

function mergeRecovery(
  base: NotFoundRecoveryLink[],
  smart: NotFoundRecoveryLink[],
  limit = 3,
): NotFoundRecoveryLink[] {
  const seen = new Set<string>();
  const out: NotFoundRecoveryLink[] = [];
  for (const x of [...smart, ...base]) {
    if (seen.has(x.href)) continue;
    seen.add(x.href);
    out.push(x);
    if (out.length >= limit) break;
  }
  return out;
}

export function NotFoundClient({
  isAuthenticated,
  resumeStudying,
}: {
  isAuthenticated: boolean;
  resumeStudying: { title: string; href: string } | null;
}) {
  const pathname = usePathname() ?? "/";
  const { resolvedTheme } = useTheme();
  const copy = useMemo(
    () => pickNotFoundCopy(pathname, resolvedTheme, themeGroupForId(resolvedTheme)),
    [pathname, resolvedTheme],
  );

  const smart = useMemo(() => buildNotFoundRecoverySuggestions(pathname), [pathname]);

  const recoveryLinks = useMemo(() => {
    const base: NotFoundRecoveryLink[] = [];
    if (isAuthenticated) {
      base.push({ label: "Go to Dashboard", href: "/app" });
    }
    if (resumeStudying) {
      base.push({ label: "Resume studying", href: resumeStudying.href, hint: resumeStudying.title });
    }
    return mergeRecovery(base, smart, 4);
  }, [isAuthenticated, resumeStudying, smart]);

  return (
    <main className="relative min-h-[min(100vh,880px)] px-4 py-16 sm:px-6 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5] motion-reduce:opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, color-mix(in srgb, var(--semantic-brand) 14%, transparent), transparent 58%), radial-gradient(ellipse 70% 45% at 100% 100%, color-mix(in srgb, var(--semantic-panel-cool) 22%, transparent), transparent 55%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <div className="nn-not-found-logo-drift">
          <Link href="/" className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--semantic-page-bg)]" aria-label={`${BRAND_NAME} home`}>
            <SiteBrandLogoMark variant="hero" />
          </Link>
        </div>

        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">404</p>

        <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-[1.65rem]">
          {copy.headline}
        </h1>
        <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-[var(--theme-muted-text)] sm:text-[0.95rem]">
          {copy.subtext}
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition motion-safe:duration-200 hover:opacity-95 sm:flex-none sm:min-w-[9.5rem]"
          >
            Go home
          </Link>
          <Link href={BROWSE_LESSONS_HREF} className={`${secondaryButtonClass()} sm:min-w-[9.5rem]`}>
            Browse lessons
          </Link>
        </div>

        {recoveryLinks.length > 0 ? (
          <div className="mt-10 w-full max-w-md space-y-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">Keep going</p>
            <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
              {recoveryLinks.map((item) => (
                <li key={item.href} className="w-full sm:w-auto">
                  <Link href={item.href} className={recoveryButtonClass()}>
                    <span className="flex w-full flex-col gap-0.5">
                      <span>{item.label}</span>
                      {item.hint ? (
                        <span className="text-[11px] font-normal text-[var(--theme-muted-text)]">{item.hint}</span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-12 max-w-sm text-xs text-[var(--semantic-text-muted)]">
          Tip: bookmark your pathway hub so your next session stays one tap away.
        </p>
      </div>
    </main>
  );
}
