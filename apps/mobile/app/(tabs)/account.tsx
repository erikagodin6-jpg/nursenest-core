import { useRouter } from "expo-router";
import { Suspense, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LoadingFallback } from "../../components/LoadingFallback";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useAuth } from "../../lib/auth-context";
import { useAppTheme } from "../../lib/theme-provider";

function AccountInner() {
  const { palette } = useAppTheme();
  const router = useRouter();
  const { session, signOut, origin, ready } = useAuth();

  useEffect(() => {
    emitEngagementEvent({ name: "engagement.session_start", surface: "account", clientTimestampMs: Date.now() });
  }, []);

  const hasSession = Boolean(session?.user?.id);
  const label = session?.user?.email ?? session?.user?.name ?? session?.user?.id;

  return (
    <View style={[styles.wrap, { backgroundColor: palette.semanticBgBase }]}>
      <Text style={[styles.title, { color: palette.semanticTextPrimary }]}>Account</Text>
      <Text style={[styles.body, { color: palette.semanticTextSecondary }]}>
        {!ready ? "Loading session…" : hasSession ? `Signed in${label ? ` — ${label}` : ""}` : "Signed out"}
      </Text>
      {!origin ? (
        <Text style={[styles.warn, { color: palette.semanticDanger }]}>
          Set EXPO_PUBLIC_APP_ORIGIN, EXPO_PUBLIC_API_ORIGIN, or EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN (public origin only).
        </Text>
      ) : null}
      {!hasSession ? (
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          style={[styles.primary, { backgroundColor: palette.semanticBrand }]}
        >
          <Text style={styles.primaryText}>Sign in</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => void signOut()}
          style={[styles.secondary, { borderColor: palette.semanticBorderSoft }]}
        >
          <Text style={[styles.secondaryText, { color: palette.semanticTextPrimary }]}>Sign out</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function AccountTab() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AccountInner />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  body: { lineHeight: 22 },
  warn: { fontWeight: "600" },
  primary: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: "center" },
  primaryText: { color: "#ffffff", fontWeight: "700" },
  secondary: {
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryText: { fontWeight: "600" },
});
