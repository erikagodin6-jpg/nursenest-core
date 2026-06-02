/**
 * 🏝️ Optional auth island — lazy/client loaded only where needed.
 *
 * This component is designed to be loaded via dynamic import with ssr: false
 * in static-page layouts. It cannot affect static page rendering.
 *
 * Pattern:
 * ```tsx
 * const AuthIsland = dynamic(() => import("@/components/auth/optional-auth-island").then(m => m.OptionalAuthIsland), { ssr: false });
 * // Then use: <Suspense fallback={null}><AuthIsland /></Suspense>
 * ```
 *
 * If auth/session fails, this component silently degrades (shows logged-out UI).
 * It does NOT block page rendering.
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function AuthIslandInner() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Never block render — show nothing until client-side hydration completes
  if (!mounted || isLoading) {
    return null;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/app"
          className="text-sm font-medium text-[var(--theme-muted-text)] transition hover:text-[var(--theme-heading-text)]"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-[var(--theme-muted-text)] transition hover:text-[var(--theme-heading-text)]"
        >
          Log out
        </button>
      </div>
    );
  }

  return null;
}

/**
 * Auth island wrapped in Suspense for safe use in static layouts.
 * Never blocks rendering, never causes hydration mismatch.
 */
export function OptionalAuthIsland() {
  return (
    <Suspense fallback={null}>
      <AuthIslandInner />
    </Suspense>
  );
}