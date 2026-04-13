"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BrandLeafMark } from "@/components/brand/brand-leaf-mark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { BRAND_NAME } from "@/lib/branding/logo-config";
import {
  BROWSE_LESSONS_HREF,
  buildNotFoundRecoverySuggestions,
  mergeNotFoundRecoveryLinks,
  NOT_FOUND_RECOVERY_CAP,
  type NotFoundRecoveryLink,
} from "@/lib/ui/not-found-recovery";
import type { NotFoundResumeStudying } from "@/lib/ui/not-found-resume";
import { isSafeRelativeNavHref, sanitizeRelativeNavHrefOrFallback } from "@/lib/ui/safe-relative-href";

function secondaryButtonClass(): string {
  return "inline-flex min-h-[44px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_05%,var(--semantic-surface))] px-5 py-2.5 text-sm font-semibold text-primary transition motion-safe:duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]";
}

function recoveryButtonClass(): string {
  return "inline-flex min-h-[40px] w-full max-w-md items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-2.5 text-left text-sm font-semibold text-[var(--semantic-text-primary)] transition motion-safe:duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-info)_28%,transparent)] sm:w-auto";
}

export function NotFoundClient({
  isAuthenticated,
  resumeStudying,
}: {
  isAuthenticated: boolean;
  resumeStudying: NotFoundResumeStudying | null;
}) {
  const pathname = usePathname() ?? "/";

  const smart = useMemo(() => buildNotFoundRecoverySuggestions(pathname), [pathname]);

  const recoveryLinks = useMemo(() => {
    const base: NotFoundRecoveryLink[] = [];
    if (isAuthenticated) {
      base.push({ label: "Go to Dashboard", href: "/app" });
    }
    if (resumeStudying) {
      const href = sanitizeRelativeNavHrefOrFallback(resumeStudying.href);
      if (isSafeRelativeNavHref(href)) {
        base.push({ label: "Resume studying", href, hint: resumeStudying.title });
      }
    }
    return mergeNotFoundRecoveryLinks(smart, base, NOT_FOUND_RECOVERY_CAP);
  }, [isAuthenticated, resumeStudying, smart]);

  const primaryHref = isAuthenticated ? "/app" : "/login?callbackUrl=%2Fapp";
  const secondaryHref = isAuthenticated ? "/app/lessons" : BROWSE_LESSONS_HREF;

  return (
    <main className="relative min-h-[min(100vh,880px)] px-4 py-16 sm:px-6 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.45] motion-reduce:opacity-35"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 78% 52% at 50% -8%, color-mix(in srgb, var(--semantic-brand) 12%, transparent), transparent 58%), radial-gradient(ellipse 68% 42% at 100% 100%, color-mix(in srgb, var(--semantic-panel-cool) 18%, transparent), transparent 55%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--semantic-page-bg)]"
          aria-label={`${BRAND_NAME} home`}
        >
          <SiteBrandLogoMark variant="hero" logoVariant="leaf" />
        </Link>

        <BrandLeafMark size={64} className="mb-2" />

        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">404</p>

        <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-[1.65rem]">
          Page Not Found
        </h1>
        <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-[var(--theme-muted-text)] sm:text-[0.95rem]">
          This page is not available or may have moved.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href={primaryHref}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition motion-safe:duration-200 hover:opacity-95 sm:flex-none sm:min-w-[11rem]"
          >
            Return to Dashboard
          </Link>
          <Link href={secondaryHref} className={`${secondaryButtonClass()} sm:min-w-[11rem]`}>
            Go to Lessons
          </Link>
        </div>

        {recoveryLinks.length > 0 ? (
          <div className="mt-12 w-full max-w-md space-y-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">Related links</p>
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
      </div>
    </main>
  );
}
