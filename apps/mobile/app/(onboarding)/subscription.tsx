import { apiPaths, queryRoots, shouldShowUpgradeUi } from "@nursenest/mobile-shared";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { apiJson, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { usePathwayStore } from "../../lib/pathway-store";

export default function SubscriptionOnboardingScreen() {
  const router = useRouter();
  const { origin, cookieJar, signOut } = useAuth();
  const pathwayId = usePathwayStore((s) => s.pathwayId);

  const profile = useQuery({
    queryKey: queryRoots.personalProfile(pathwayId),
    queryFn: async () => {
      return apiJson(origin, apiPaths.learnerPersonalProfile, cookieJar, {
        onUnauthorized: () => void signOut(),
      });
    },
    enabled: Boolean(origin && cookieJar),
  });

  const body = profile.error instanceof ApiError ? profile.error.body : null;
  const status = profile.error instanceof ApiError ? profile.error.status : 0;
  const upgrade = shouldShowUpgradeUi(status, body);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription status</Text>
      <Text style={styles.sub}>Loaded from the same APIs as the web learner profile — server is authoritative.</Text>
      {profile.isLoading ? <Text>Checking access…</Text> : null}
      {profile.isError ? (
        <Text style={styles.warn}>Could not load profile. Check EXPO_PUBLIC_APP_ORIGIN and try again.</Text>
      ) : null}
      {profile.data && typeof profile.data === "object" ? (
        <View style={styles.card}>
          <Text style={styles.row}>
            Subscriber access: {(profile.data as { subscriberAccess?: boolean }).subscriberAccess ? "yes" : "no"}
          </Text>
          {upgrade ? (
            <Text style={styles.upgrade}>Upgrade is available from the website billing flow when you are ready.</Text>
          ) : null}
        </View>
      ) : null}
      <Pressable style={styles.button} onPress={() => router.push("/(onboarding)/recommendations")}>
        <Text style={styles.buttonLabel}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { opacity: 0.8 },
  card: { borderWidth: 1, borderRadius: 10, padding: 12, borderColor: "#e2e8f0", gap: 8 },
  row: { fontSize: 16 },
  warn: { color: "#b45309" },
  upgrade: { fontSize: 14, opacity: 0.9 },
  button: { backgroundColor: "#1d4ed8", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonLabel: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
