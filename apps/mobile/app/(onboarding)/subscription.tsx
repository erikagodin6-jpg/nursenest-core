import { apiPaths, queryRoots, shouldShowUpgradeUi } from "@nursenest/mobile-shared";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiJson, ApiError } from "../../lib/api";
import { HIT_TARGET_MIN, useLearnerHorizontalPadding } from "../../lib/layout";
import { useAuth } from "../../lib/auth-context";
import { usePathwayStore } from "../../lib/pathway-store";
import { useAppTheme } from "../../lib/theme-provider";

export default function SubscriptionOnboardingScreen() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const horizontalPad = useLearnerHorizontalPadding();
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
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.semanticBgBase }]} edges={["top", "left", "right"]}>
      <View style={[styles.container, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Subscription status
        </Text>
        <Text style={[styles.sub, { color: palette.semanticTextSecondary }]} allowFontScaling>
          Loaded from the same APIs as the web learner profile — server is authoritative. Plan changes are completed on
          the website.
        </Text>
        {profile.isLoading ? (
          <Text style={{ color: palette.semanticTextSecondary }} allowFontScaling>
            Checking access…
          </Text>
        ) : null}
        {profile.isError ? (
          <Text style={{ color: palette.semanticWarning }} allowFontScaling>
            Could not load profile. Check EXPO_PUBLIC_APP_ORIGIN and try again.
          </Text>
        ) : null}
        {profile.data && typeof profile.data === "object" ? (
          <View
            style={[
              styles.card,
              { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated },
            ]}
          >
            <Text style={{ color: palette.semanticTextPrimary, fontSize: 16 }} allowFontScaling>
              Subscriber access: {(profile.data as { subscriberAccess?: boolean }).subscriberAccess ? "yes" : "no"}
            </Text>
            {upgrade ? (
              <Text style={[styles.upgrade, { color: palette.semanticTextSecondary }]} allowFontScaling>
                Upgrade is available from the website billing flow when you are ready.
              </Text>
            ) : null}
          </View>
        ) : null}
        <Pressable
          style={[styles.button, { backgroundColor: palette.semanticBrand, minHeight: HIT_TARGET_MIN }]}
          onPress={() => router.push("/(onboarding)/recommendations")}
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
  container: { flex: 1, paddingVertical: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { lineHeight: 22 },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, padding: 12, gap: 8 },
  upgrade: { fontSize: 14, lineHeight: 20 },
  button: { padding: 14, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonLabel: { fontWeight: "600", fontSize: 16 },
});
