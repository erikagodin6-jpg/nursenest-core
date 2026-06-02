import {
  clearSessionCookiesFromJar,
  DEFAULT_MOBILE_V1_PATHWAY_ID,
  fetchAuthSession,
  postCredentialsSignIn,
  type NurseNestSession,
} from "@nursenest/mobile-shared";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathwayStore } from "./pathway-store";
import { secureKeys } from "./secure-keys";

type AuthContextValue = {
  ready: boolean;
  origin: string;
  cookieJar: string | null;
  session: NurseNestSession | null;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readOrigin(): string {
  const raw =
    process.env.EXPO_PUBLIC_APP_ORIGIN?.trim() ||
    process.env.EXPO_PUBLIC_API_ORIGIN?.trim() ||
    process.env.EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN?.trim() ||
    "";
  return raw.replace(/\/$/, "");
}

export function AuthProvider({
  children,
  onSessionCleared,
}: {
  children: React.ReactNode;
  /** Clear React Query cache after logout / 401 hygiene. */
  onSessionCleared?: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [cookieJar, setCookieJar] = useState<string | null>(null);
  const [session, setSession] = useState<NurseNestSession | null>(null);
  const origin = useMemo(() => readOrigin(), []);

  const refreshSession = useCallback(async () => {
    const jar = await SecureStore.getItemAsync(secureKeys.authCookieJar).catch(() => null);
    setCookieJar(jar);
    if (!origin || !jar) {
      setSession(null);
      return;
    }
    const next = await fetchAuthSession(origin, jar);
    setSession(next);
  }, [origin]);

  useEffect(() => {
    (async () => {
      try {
        await refreshSession();
      } finally {
        setReady(true);
      }
    })();
  }, [refreshSession]);

  const signIn = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      if (!origin) {
        throw new Error("Set EXPO_PUBLIC_APP_ORIGIN to your NurseNest web origin (https://… , no trailing slash).");
      }
      const existing = await SecureStore.getItemAsync(secureKeys.authCookieJar).catch(() => null);
      const res = await postCredentialsSignIn({
        origin,
        email,
        password,
        rememberMe,
        cookieJar: existing,
      });
      if (!res.ok) {
        throw new Error(`Sign-in failed (${res.status})`);
      }
      await SecureStore.setItemAsync(secureKeys.authCookieJar, res.cookieJar);
      setCookieJar(res.cookieJar);
      const next = await fetchAuthSession(origin, res.cookieJar);
      setSession(next);
    },
    [origin],
  );

  const signOut = useCallback(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(secureKeys.authCookieJar).catch(() => undefined),
      SecureStore.deleteItemAsync(secureKeys.pendingPathwayId).catch(() => undefined),
      SecureStore.deleteItemAsync(secureKeys.localStudyGoal).catch(() => undefined),
      SecureStore.deleteItemAsync(secureKeys.onboardingV1Done).catch(() => undefined),
    ]);
    void clearSessionCookiesFromJar(cookieJar ?? "");
    setCookieJar(null);
    setSession(null);
    usePathwayStore.setState({ pathwayId: DEFAULT_MOBILE_V1_PATHWAY_ID, hydrated: true });
    onSessionCleared?.();
  }, [cookieJar, onSessionCleared]);

  const value = useMemo(
    () => ({
      ready,
      origin,
      cookieJar,
      session,
      signIn,
      signOut,
      refreshSession,
    }),
    [ready, origin, cookieJar, session, signIn, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
