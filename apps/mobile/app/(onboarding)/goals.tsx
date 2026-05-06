import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { HIT_TARGET_MIN, useLearnerHorizontalPadding } from "../../lib/layout";
import { secureKeys } from "../../lib/secure-keys";
import { useAppTheme } from "../../lib/theme-provider";

export default function GoalsScreen() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const horizontalPad = useLearnerHorizontalPadding();
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState("");

  async function next() {
    await SecureStore.setItemAsync(secureKeys.localStudyGoal, goal.trim()).catch(() => undefined);
    router.push("/(onboarding)/subscription");
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 8 : 0}
      >
        <View style={[styles.container, { paddingHorizontal: horizontalPad, paddingBottom: insets.bottom + 16 }]}>
          <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
            Study goal
          </Text>
          <Text style={[styles.sub, { color: palette.semanticTextSecondary }]} allowFontScaling>
            Optional — stored locally for now; can sync to your profile in the next step.
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: palette.semanticTextPrimary,
                borderColor: palette.semanticBorderSoft,
                backgroundColor: palette.semanticSurfaceElevated,
              },
            ]}
            placeholder="e.g. Pass NCLEX in 90 days"
            placeholderTextColor={palette.semanticTextMuted}
            value={goal}
            onChangeText={setGoal}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Study goal"
          />
          <Pressable
            style={[styles.button, { backgroundColor: palette.semanticBrand, minHeight: HIT_TARGET_MIN }]}
            onPress={() => void next()}
            accessibilityRole="button"
            accessibilityLabel="Next onboarding step"
          >
            <Text style={[styles.buttonLabel, { color: palette.semanticOnBrand }]} allowFontScaling>
              Next
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingTop: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { lineHeight: 22 },
  input: {
    minHeight: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  button: { padding: 14, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  buttonLabel: { fontWeight: "600", fontSize: 16 },
});
