import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HIT_TARGET_MIN, useLearnerHorizontalPadding } from "../../lib/layout";
import { useAppTheme } from "../../lib/theme-provider";

export default function WelcomeScreen() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const horizontalPad = useLearnerHorizontalPadding();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <View style={[styles.container, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Welcome to NurseNest
        </Text>
        <Text style={[styles.body, { color: palette.semanticTextSecondary }]} allowFontScaling>
          A few quick steps to tailor study to your pathway and goals.
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: palette.semanticBrand, minHeight: HIT_TARGET_MIN }]}
          onPress={() => router.push("/(onboarding)/pathway")}
          accessibilityRole="button"
          accessibilityLabel="Continue onboarding"
        >
          <Text style={[styles.buttonLabel, { color: palette.semanticOnBrand }]} allowFontScaling>
            Continue
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingVertical: 24, gap: 16, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24 },
  button: { padding: 14, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  buttonLabel: { fontWeight: "600", fontSize: 16 },
});
