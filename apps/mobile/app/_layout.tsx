import { mobileQueryClientDefaults } from "@nursenest/mobile-shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useAppFocusSubscription } from "../hooks/use-app-focus";
import { AuthProvider } from "../lib/auth-context";
import { attachReactQueryNetworkSync } from "../lib/rq-network";
import { initSentryFromEnv } from "../lib/sentry";
import { AppThemeProvider } from "../lib/theme-provider";

function Shell({ children }: { children: React.ReactNode }) {
  useAppFocusSubscription();
  return <>{children}</>;
}

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: mobileQueryClientDefaults(),
      }),
  );

  useEffect(() => {
    initSentryFromEnv();
    attachReactQueryNetworkSync(queryClient);
  }, [queryClient]);

  return (
    <ErrorBoundary scope="root">
      <AppThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Shell>
            <AuthProvider onSessionCleared={() => queryClient.clear()}>
              <Stack screenOptions={{ headerShown: true, title: "NurseNest" }} />
            </AuthProvider>
          </Shell>
        </QueryClientProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
}
