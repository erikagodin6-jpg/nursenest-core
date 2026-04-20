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

/** Refresh RSC/session, then navigate only when the destination differs from the current URL. */
export async function refreshThenReplaceIfDifferent(
  router: ClientAppRouter,
  redirectTarget: string,
  pathname: string,
  searchParams: Pick<URLSearchParams, "toString">,
): Promise<void> {
  await router.refresh();
  const safeTarget = sanitizeClientNavigationHref(redirectTarget, "/login");
  const here = pathnameWithSearch(pathname, searchParams);
  if (!pathsEqualForSpaNavigation(safeTarget, here)) {
    await router.replace(safeTarget);
  }
}
