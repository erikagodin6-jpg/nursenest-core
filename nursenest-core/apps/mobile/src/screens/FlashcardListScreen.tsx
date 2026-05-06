import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { isHardEntitlementStop, MobileApiError } from "@nursenest/mobile-shared";
import { useApi } from "../api-context";
import { usePathway } from "../pathway-context";

type DeckRow = { id: string; slug: string; title: string; locked?: boolean; pathwayId?: string | null };

export function FlashcardListScreen(props: {
  onBack: () => void;
  onOpenDeck: (slug: string) => void;
}): React.ReactElement {
  const { flashcards } = useApi();
  const { pathwayId } = usePathway();
  const q = useQuery({
    queryKey: ["flashcard-decks", pathwayId],
    enabled: Boolean(pathwayId),
    queryFn: () => flashcards.listDecks({ page: 1, pageSize: 24, pathwayId: pathwayId! }),
  });

  if (!pathwayId) {
    return (
      <View style={styles.center}>
        <Text>Set a pathway on the home screen.</Text>
        <Pressable onPress={props.onBack} style={styles.back}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (q.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (q.error) {
    const e = q.error;
    const upgrade = e instanceof MobileApiError && isHardEntitlementStop(e);
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{upgrade ? "Subscription or sign-in required." : String((e as Error).message)}</Text>
        <Pressable onPress={props.onBack} style={styles.back}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  const body = q.data as { decks?: DeckRow[] };
  const decks = body.decks ?? [];

  return (
    <View style={styles.flex}>
      <Pressable onPress={props.onBack} style={styles.backPad}>
        <Text>← Back</Text>
      </Pressable>
      <FlatList
        data={decks}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, item.locked && styles.locked]}
            disabled={item.locked}
            onPress={() => props.onOpenDeck(item.slug)}
          >
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.meta}>{item.slug}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.pad}>No decks for this pathway.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  back: { marginTop: 16 },
  backPad: { paddingVertical: 12 },
  row: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ecfeff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#99f6e4",
  },
  locked: { opacity: 0.45 },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  pad: { padding: 20 },
  err: { textAlign: "center", color: "#b91c1c" },
});
