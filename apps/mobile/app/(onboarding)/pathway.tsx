import { MOBILE_V1_PATHWAYS } from "@nursenest/mobile-shared";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { usePathwayStore } from "../../lib/pathway-store";

export default function PathwaySelectScreen() {
  const router = useRouter();
  const { pathwayId, setPathwayId, hydrate } = usePathwayStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your pathway</Text>
      <Text style={styles.sub}>RN, PN/RPN, and NP options (V1). IDs match the web exam catalog.</Text>
      <FlatList
        style={{ flex: 1 }}
        data={[...MOBILE_V1_PATHWAYS]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = item.id === pathwayId;
          return (
            <Pressable
              style={[styles.row, selected && styles.rowSelected]}
              onPress={() => void setPathwayId(item.id)}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowId}>{item.id}</Text>
            </Pressable>
          );
        }}
      />
      <Pressable style={styles.button} onPress={() => router.push("/(onboarding)/goals")}>
        <Text style={styles.buttonLabel}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { opacity: 0.8, marginBottom: 8 },
  row: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderColor: "#cbd5e1",
  },
  rowSelected: { borderColor: "#1d4ed8", backgroundColor: "#eff6ff" },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowId: { fontSize: 12, opacity: 0.65, marginTop: 4 },
  button: { backgroundColor: "#1d4ed8", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonLabel: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
