import { MOBILE_V1_PATHWAYS, apiPaths } from "@nursenest/mobile-shared";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { apiPatchJson } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { usePathwayStore } from "../../lib/pathway-store";

export default function PathwayChangeScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { origin, cookieJar, signOut } = useAuth();
  const { pathwayId, setPathwayId } = usePathwayStore();

  async function pick(id: string) {
    await setPathwayId(id);
    await apiPatchJson(origin, apiPaths.learnerPersonalProfile, cookieJar, { learnerPath: id }, () => void signOut());
    await qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "learner" });
    await qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "flashcards" });
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Switch pathway</Text>
      <Text style={styles.sub}>Updates `learnerPath` via PATCH /api/learner/personal-profile and invalidates learner queries.</Text>
      <FlatList
        style={{ flex: 1 }}
        data={[...MOBILE_V1_PATHWAYS]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = item.id === pathwayId;
          return (
            <Pressable style={[styles.row, selected && styles.rowSelected]} onPress={() => void pick(item.id)}>
              <Text style={styles.rowLabel}>{item.label}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { opacity: 0.8, marginBottom: 12 },
  row: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8, borderColor: "#cbd5e1" },
  rowSelected: { borderColor: "#1d4ed8", backgroundColor: "#eff6ff" },
  rowLabel: { fontSize: 16, fontWeight: "600" },
});
