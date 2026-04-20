"use client";

import { getSession } from "next-auth/react";
import { sanitizeClientNavigationHref } from "@/lib/auth/safe-auth-ui-redirect";

type ClientAppRouter = {
  refresh: () => Promise<void> | void;
  replace: (href: string) => Promise<void> | void;
};

export function pathsEqualForSpaNavigation(a: string, b: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const ua = new URL(a, window.location.origin);
    const ub = new URL(b, window.location.origin);
    return ua.pathname === ub.pathname && ua.search === ub.search && ua.hash === ub.hash;
  } catch {
    return false;
  }
}

export function pathnameWithSearch(
  pathname: string,
  searchParams: Pick<URLSearchParams, "toString">,
): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const qs = searchParams.toString();
  return `${p}${qs ? `?${qs}` : ""}`;
}

/**
 * After `signIn(..., { redirect: false })`, NextAuth updates cookies but `useSession()` can lag until the
 * client cache is refreshed. Sync with `getSession()` **before** `router.refresh()` so RSC + header chrome
 * agree with the browser cookie on the next paint (reduces “logged out again” on Back / SPA transitions).
 */
export async function refreshThenReplaceIfDifferent(
  router: ClientAppRouter,
  redirectTarget: string,
  pathname: string,
  searchParams: Pick<URLSearchParams, "toString">,
): Promise<void> {
  try {
    await getSession();
  } catch {
    /* still attempt RSC refresh */
  }
  await router.refresh();
  const safeTarget = sanitizeClientNavigationHref(redirectTarget, "/login");
  const here = pathnameWithSearch(pathname, searchParams);
  if (!pathsEqualForSpaNavigation(safeTarget, here)) {
    await router.replace(safeTarget);
  }
}
