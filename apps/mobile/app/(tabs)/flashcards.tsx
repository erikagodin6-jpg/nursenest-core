import { Suspense, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LoadingFallback } from "../../components/LoadingFallback";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useAppTheme } from "../../lib/theme-provider";

function FlashcardsInner() {
  const { palette } = useAppTheme();
  useEffect(() => {
    emitEngagementEvent({ name: "engagement.session_start", surface: "flashcards", clientTimestampMs: Date.now() });
  }, []);
  return (
    <View style={[styles.wrap, { backgroundColor: palette.semanticBgBase }]}>
      <Text style={[styles.title, { color: palette.semanticTextPrimary }]}>Flashcards</Text>
      <Text style={[styles.body, { color: palette.semanticTextSecondary }]}>
        Flashcard decks reuse the same authenticated APIs as web. No duplicated content engines in V1.
      </Text>
    </View>
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
  wrap: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { lineHeight: 22 },
});
