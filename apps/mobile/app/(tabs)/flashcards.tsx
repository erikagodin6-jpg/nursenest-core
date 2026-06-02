import { Suspense, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingFallback } from "../../components/LoadingFallback";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useNetworkHint } from "../../hooks/useNetworkHint";
import { useLearnerHorizontalPadding } from "../../lib/layout";
import { useAppTheme } from "../../lib/theme-provider";

function FlashcardsInner() {
  const { palette } = useAppTheme();
  const { online } = useNetworkHint();
  const horizontalPad = useLearnerHorizontalPadding();

  useEffect(() => {
    emitEngagementEvent({ name: "engagement.session_start", surface: "flashcards", clientTimestampMs: Date.now() });
  }, []);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <View style={[styles.wrap, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Flashcards
        </Text>
        <Text style={[styles.badge, { color: online ? palette.semanticSuccess : palette.semanticWarning }]} allowFontScaling>
          {online ? "Online" : "Offline — open flashcards when you are back online."}
        </Text>
        <Text style={[styles.body, { color: palette.semanticTextSecondary }]} allowFontScaling>
          Flashcard decks reuse the same authenticated APIs as the web app. This surface will expand in a future release;
          billing and catalog management stay on the website.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function FlashcardsTab() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FlashcardsInner />
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
