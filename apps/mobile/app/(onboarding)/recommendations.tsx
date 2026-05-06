import { apiPaths, parseApiErrorCode, queryRoots } from "@nursenest/mobile-shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { apiJson, apiPatchJson, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { usePathwayStore } from "../../lib/pathway-store";
import { secureKeys } from "../../lib/secure-keys";

export default function RecommendationsScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { origin, cookieJar, signOut } = useAuth();
  const pathwayId = usePathwayStore((s) => s.pathwayId);

  const commandCenter = useQuery({
    queryKey: queryRoots.commandCenter(pathwayId),
    queryFn: async () =>
      apiJson(origin, apiPaths.learnerCommandCenter, cookieJar, {
        onUnauthorized: () => void signOut(),
      }),
    enabled: Boolean(origin && cookieJar),
    retry: (n, err) => {
      if (err instanceof ApiError && err.status === 403) return false;
      return n < 2;
    },
  });

  const headline = useMemo(() => {
    if (commandCenter.isLoading) return "Loading recommendations…";
    if (commandCenter.error instanceof ApiError && commandCenter.error.status === 403) {
      const code = parseApiErrorCode(commandCenter.error.body);
      if (code === "not_subscribed") {
        return "Subscribe on the web to unlock personalized study picks here.";
      }
      return "Recommendations require an active subscription.";
    }
    const data = commandCenter.data as { studyNext?: { primary?: { title?: string } } } | null;
    const title = data?.studyNext?.primary?.title;
    return title ? `Next up: ${title}` : "Open the web app for your full study hub — mobile picks will deepen as we wire more surfaces.";
  }, [commandCenter.data, commandCenter.error, commandCenter.isLoading]);

  async function finish() {
    try {
      const goal = await SecureStore.getItemAsync(secureKeys.localStudyGoal).catch(() => "");
      const patch: Record<string, unknown> = { learnerPath: pathwayId };
      if (goal && goal.trim()) patch.studyGoal = goal.trim();
      await apiPatchJson(origin, apiPaths.learnerPersonalProfile, cookieJar, patch, () => void signOut());
      await SecureStore.setItemAsync(secureKeys.onboardingV1Done, "1");
      await qc.invalidateQueries({ queryKey: ["learner"] });
      router.replace("/(tabs)");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not finish onboarding";
      Alert.alert("Save failed", msg);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>First-study recommendations</Text>
      <Text style={styles.body}>{headline}</Text>
      <Pressable style={styles.button} onPress={() => void finish()}>
        <Text style={styles.buttonLabel}>Go to home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  body: { fontSize: 16, opacity: 0.9 },
  button: { backgroundColor: "#1d4ed8", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 12 },
  buttonLabel: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
