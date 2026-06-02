import * as SecureStore from "expo-secure-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import {
  flashcardDeckRefCursorKey,
  isHardEntitlementStop,
  MobileApiError,
  type FlashcardRating,
} from "@nursenest/mobile-shared";
import { useApi } from "../api-context";

const W = Dimensions.get("window").width;

type StudyCard = { id: string; front: string; back: string };
type StudyBody = {
  cards: StudyCard[];
  session?: { cursor: number; queueLength: number; done?: boolean } | null;
  sessionMeta?: { hasMore?: boolean };
};

export function FlashcardStudyScreen(props: { deckRef: string; onBack: () => void }): React.ReactElement {
  const { flashcards } = useApi();
  const qc = useQueryClient();
  const tx = useSharedValue(0);

  const studyQ = useQuery({
    queryKey: ["flashcard-study", props.deckRef],
    queryFn: () => flashcards.getStudyBatch(props.deckRef, { limit: 12, reset: false }),
  });

  const data = studyQ.data as StudyBody | undefined;
  const cards = data?.cards ?? [];
  const card = cards[0];

  const persistResume = useCallback(async () => {
    if (!data?.session) return;
    await SecureStore.setItemAsync(
      flashcardDeckRefCursorKey(props.deckRef),
      JSON.stringify({
        cursor: data.session.cursor,
        queueLength: data.session.queueLength,
        at: Date.now(),
      }),
    );
  }, [data?.session, props.deckRef]);

  React.useEffect(() => {
    void persistResume();
  }, [persistResume]);

  const review = useMutation({
    mutationFn: async (rating: FlashcardRating) => {
      if (!card) return;
      return flashcards.postDeckReview(props.deckRef, { flashcardId: card.id, rating });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["flashcard-study", props.deckRef] });
    },
  });

  const submitRating = useCallback(
    (rating: FlashcardRating) => {
      review.mutate(rating);
    },
    [review],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan().onEnd((e) => {
        const x = e.translationX;
        if (x < -W * 0.18) runOnJS(submitRating)("good");
        else if (x > W * 0.18) runOnJS(submitRating)("again");
        tx.value = withSpring(0);
      }),
    [submitRating, tx],
  );

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

  if (studyQ.isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (studyQ.error) {
    const e = studyQ.error;
    const hard = e instanceof MobileApiError && isHardEntitlementStop(e);
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{hard ? "Sign in or upgrade to study this deck." : String((e as Error).message)}</Text>
        <Pressable onPress={props.onBack} style={styles.back}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!card) {
    return (
      <View style={styles.center}>
        <Text>No cards in this batch.</Text>
        <Pressable onPress={props.onBack} style={styles.back}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <Pressable onPress={props.onBack} style={styles.backPad}>
        <Text>← Back</Text>
      </Pressable>
      <Text style={styles.hint}>Swipe ← Good · Again →</Text>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.cardFront}>{card.front}</Text>
          <View style={styles.sep} />
          <Text style={styles.cardBack}>{card.back}</Text>
        </Animated.View>
      </GestureDetector>
      <View style={styles.row}>
        <Pressable style={styles.chip} onPress={() => submitRating("again")} disabled={review.isPending}>
          <Text style={styles.chipText}>Again</Text>
        </Pressable>
        <Pressable style={styles.chip} onPress={() => submitRating("hard")} disabled={review.isPending}>
          <Text style={styles.chipText}>Hard</Text>
        </Pressable>
        <Pressable style={styles.chip} onPress={() => submitRating("good")} disabled={review.isPending}>
          <Text style={styles.chipText}>Good</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  backPad: { paddingBottom: 8 },
  hint: { fontSize: 12, opacity: 0.65, marginBottom: 8, textAlign: "center" },
  card: {
    flex: 1,
    maxHeight: 420,
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#f0fdfa",
    borderWidth: 1,
    borderColor: "#5eead4",
    justifyContent: "center",
  },
  cardFront: { fontSize: 18, fontWeight: "600" },
  cardBack: { fontSize: 16, lineHeight: 22 },
  sep: { height: 1, backgroundColor: "#99f6e4", marginVertical: 12 },
  row: { flexDirection: "row", gap: 8, marginTop: 16, justifyContent: "space-between" },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#0d9488",
    alignItems: "center",
  },
  chipText: { color: "#fff", fontWeight: "600" },
  back: { marginTop: 12 },
  err: { color: "#b91c1c", textAlign: "center" },
});
