import { Suspense, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LoadingFallback } from "../../components/LoadingFallback";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useAppTheme } from "../../lib/theme-provider";

function PracticeInner() {
  const { palette } = useAppTheme();
  useEffect(() => {
    emitEngagementEvent({ name: "engagement.session_start", surface: "practice", clientTimestampMs: Date.now() });
  }, []);
  return (
    <View style={[styles.wrap, { backgroundColor: palette.semanticBgBase }]}>
      <Text style={[styles.title, { color: palette.semanticTextPrimary }]}>Practice</Text>
      <Text style={[styles.body, { color: palette.semanticTextSecondary }]}>
        CAT and practice flows stay server-gated. Mobile sends the same Cookie header the web session uses.
      </Text>
    </View>
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
  wrap: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { lineHeight: 22 },
});
