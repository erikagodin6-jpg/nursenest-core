import { useRouter } from "expo-router";
import { Suspense, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingFallback } from "../../components/LoadingFallback";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { HIT_TARGET_MIN, useLearnerHorizontalPadding } from "../../lib/layout";
import { useAuth } from "../../lib/auth-context";
import { useAppTheme } from "../../lib/theme-provider";

function AccountInner() {
  const { palette } = useAppTheme();
  const horizontalPad = useLearnerHorizontalPadding();
  const router = useRouter();
  const { session, signOut, origin, ready } = useAuth();

  useEffect(() => {
    emitEngagementEvent({ name: "engagement.session_start", surface: "account", clientTimestampMs: Date.now() });
  }, []);

  const hasSession = Boolean(session?.user?.id);
  const label = session?.user?.email ?? session?.user?.name ?? session?.user?.id;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <View style={[styles.wrap, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Account
        </Text>
        <Text style={[styles.body, { color: palette.semanticTextSecondary }]} allowFontScaling>
          {!ready ? "Loading session…" : hasSession ? `Signed in${label ? ` — ${label}` : ""}` : "Signed out"}
        </Text>
        {!origin ? (
          <Text style={[styles.warn, { color: palette.semanticDanger }]} allowFontScaling>
            Set EXPO_PUBLIC_APP_ORIGIN, EXPO_PUBLIC_API_ORIGIN, or EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN (public origin only).
          </Text>
        ) : null}
        {!hasSession ? (
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={[styles.primary, { backgroundColor: palette.semanticBrand, minHeight: HIT_TARGET_MIN }]}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <Text style={[styles.primaryText, { color: palette.semanticOnBrand }]} allowFontScaling>
              Sign in
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => void signOut()}
            style={[styles.secondary, { borderColor: palette.semanticBorderSoft, minHeight: HIT_TARGET_MIN }]}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Text style={[styles.secondaryText, { color: palette.semanticTextPrimary }]} allowFontScaling>
              Sign out
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
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
  flex: { flex: 1 },
  wrap: { flex: 1, paddingVertical: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  body: { lineHeight: 22 },
  warn: { fontWeight: "600" },
  primary: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  primaryText: { fontWeight: "700", fontSize: 16 },
  secondary: {
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontWeight: "600" },
});
