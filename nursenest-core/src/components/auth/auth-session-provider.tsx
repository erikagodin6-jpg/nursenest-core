"use client";

import { useEffect } from "react";
import type { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";

type AuthSessionProviderProps = {
  children: React.ReactNode;
  /** From `await auth()` in the root layout so `useSession()` is not stuck on `loading` for the first paint. */
  session?: Session | null;
};

/**
 * Required for next-auth/react (signIn, useSession) to stay aligned with server cookies
 * after credential login and navigation.
 *
 * **Pinned `basePath`:** the client bundle derives `__NEXTAUTH.basePath` from `NEXTAUTH_URL`'s
 * pathname. If that env is mis-set to a non-root path (e.g. includes `/login`), credential
 * POSTs go to the wrong URL (`/login/callback/credentials`) and sign-in silently fails.
 * Server handlers use {@link PINNED_AUTH_BASE_PATH} — this keeps the browser aligned.
 */
function BfcacheSessionResync() {
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      /** BFCache restore: React state can be stale while cookies are still valid — refetch session. */
      if (!e.persisted) return;
      void getSession();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);
  return null;
}

export function AuthSessionProvider({ children, session }: AuthSessionProviderProps) {
  return (
    <SessionProvider
      session={session}
      basePath={PINNED_AUTH_BASE_PATH}
      refetchOnWindowFocus
      refetchWhenOffline={false}
      /** JWT: periodic refetch keeps `useSession()` aligned with server after tab idle / odd navigation. */
      refetchInterval={5 * 60}
    >
      <BfcacheSessionResync />
      {children}
    </SessionProvider>
  );
}
