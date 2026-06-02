import { MOBILE_V1_PATHWAYS } from "@nursenest/mobile-shared";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HIT_TARGET_MIN, useLearnerHorizontalPadding } from "../../lib/layout";
import { usePathwayStore } from "../../lib/pathway-store";
import { useAppTheme } from "../../lib/theme-provider";

export default function PathwaySelectScreen() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const horizontalPad = useLearnerHorizontalPadding();
  const { pathwayId, setPathwayId, hydrate } = usePathwayStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <View style={[styles.container, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Choose your pathway
        </Text>
        <Text style={[styles.sub, { color: palette.semanticTextSecondary }]} allowFontScaling>
          RN, PN/RPN, and NP options (V1). IDs match the web exam catalog.
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
                onPress={() => void setPathwayId(item.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`Pathway ${item.label}`}
              >
                <Text style={[styles.rowLabel, { color: palette.semanticTextPrimary }]} allowFontScaling>
                  {item.label}
                </Text>
                <Text style={[styles.rowId, { color: palette.semanticTextMuted }]} allowFontScaling>
                  {item.id}
                </Text>
              </Pressable>
            );
          }}
        />
        <Pressable
          style={[styles.button, { backgroundColor: palette.semanticBrand, minHeight: HIT_TARGET_MIN }]}
          onPress={() => router.push("/(onboarding)/goals")}
          accessibilityRole="button"
          accessibilityLabel="Next onboarding step"
        >
          <Text style={[styles.buttonLabel, { color: palette.semanticOnBrand }]} allowFontScaling>
            Next
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingVertical: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { marginBottom: 8, lineHeight: 22 },
  row: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    minHeight: HIT_TARGET_MIN,
    justifyContent: "center",
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowId: { fontSize: 12, marginTop: 4 },
  button: { padding: 14, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonLabel: { fontWeight: "600", fontSize: 16 },
});
