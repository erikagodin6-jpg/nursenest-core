import { mobileQueryClientDefaults } from "@nursenest/mobile-shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
      <GestureHandlerRootView style={styles.flex}>
        <SafeAreaProvider>
          <AppThemeProvider>
            <QueryClientProvider client={queryClient}>
              <Shell>
                <AuthProvider onSessionCleared={() => queryClient.clear()}>
                  <Stack screenOptions={{ headerShown: true, title: "NurseNest" }} />
                </AuthProvider>
              </Shell>
            </QueryClientProvider>
          </AppThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
