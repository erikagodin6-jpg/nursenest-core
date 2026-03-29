"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Required for next-auth/react (signIn, useSession) to stay aligned with server cookies
 * after credential login and navigation.
 */
export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
