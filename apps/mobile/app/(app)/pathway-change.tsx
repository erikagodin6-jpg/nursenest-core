import { MOBILE_V1_PATHWAYS, apiPaths } from "@nursenest/mobile-shared";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiPatchJson } from "../../lib/api";
import { HIT_TARGET_MIN, useLearnerHorizontalPadding } from "../../lib/layout";
import { useAuth } from "../../lib/auth-context";
import { usePathwayStore } from "../../lib/pathway-store";
import { useAppTheme } from "../../lib/theme-provider";

export default function PathwayChangeScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { palette } = useAppTheme();
  const horizontalPad = useLearnerHorizontalPadding();
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
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <View style={[styles.container, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Switch pathway
        </Text>
        <Text style={[styles.sub, { color: palette.semanticTextSecondary }]} allowFontScaling>
          Updates learnerPath via PATCH /api/learner/personal-profile and invalidates learner queries.
        </Text>
        <FlatList
          style={{ flex: 1 }}
          data={[...MOBILE_V1_PATHWAYS]}
          keyExtractor={(item) => item.id}
          initialNumToRender={12}
          windowSize={5}
          renderItem={({ item }) => {
            const selected = item.id === pathwayId;
            return (
              <Pressable
                style={[
                  styles.row,
                  {
                    borderColor: selected ? palette.semanticBrand : palette.semanticBorderSoft,
                    backgroundColor: selected ? palette.semanticBrandSoft : palette.semanticSurfaceElevated,
                  },
                ]}
                onPress={() => void pick(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Select pathway ${item.label}`}
              >
                <Text style={[styles.rowLabel, { color: palette.semanticTextPrimary }]} allowFontScaling>
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingVertical: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { marginBottom: 12, lineHeight: 22 },
  row: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    minHeight: HIT_TARGET_MIN,
    justifyContent: "center",
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
});
