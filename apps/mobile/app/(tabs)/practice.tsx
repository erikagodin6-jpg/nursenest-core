import { Suspense, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingFallback } from "../../components/LoadingFallback";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useNetworkHint } from "../../hooks/useNetworkHint";
import { useLearnerHorizontalPadding } from "../../lib/layout";
import { useAppTheme } from "../../lib/theme-provider";

function PracticeInner() {
  const { palette } = useAppTheme();
  const { online } = useNetworkHint();
  const horizontalPad = useLearnerHorizontalPadding();

  useEffect(() => {
    emitEngagementEvent({ name: "engagement.session_start", surface: "practice", clientTimestampMs: Date.now() });
  }, []);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <View style={[styles.wrap, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Practice
        </Text>
        <Text style={[styles.badge, { color: online ? palette.semanticSuccess : palette.semanticWarning }]} allowFontScaling>
          {online ? "Online" : "Offline — practice sessions need a connection."}
        </Text>
        <Text style={[styles.body, { color: palette.semanticTextSecondary }]} allowFontScaling>
          CAT and adaptive practice flows stay server-gated with the same session cookies as the web app. Purchases and
          plan changes are completed on the website, not in this app.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function PracticeTab() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PracticeInner />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wrap: { flex: 1, paddingVertical: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  badge: { fontWeight: "600", fontSize: 14 },
  body: { lineHeight: 22, fontSize: 15 },
});
