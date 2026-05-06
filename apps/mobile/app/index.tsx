import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../lib/auth-context";
import { secureKeys } from "../lib/secure-keys";

export default function GateScreen() {
  const { ready, session } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const v = await SecureStore.getItemAsync(secureKeys.onboardingV1Done).catch(() => null);
      setOnboardingDone(v === "1");
    })();
  }, []);

  if (!ready || onboardingDone === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session?.user?.id) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingDone) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
