import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuth } from "../../lib/auth-context";
import { useAppTheme } from "../../lib/theme-provider";

function HeaderSignOut() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        void (async () => {
          await signOut();
          router.replace("/(auth)/login");
        })();
      }}
      style={{ paddingHorizontal: 12, minHeight: 44, justifyContent: "center" }}
      accessibilityRole="button"
      accessibilityLabel="Sign out"
    >
      <Text style={{ color: palette.semanticBrand, fontWeight: "600" }} allowFontScaling>
        Sign out
      </Text>
    </Pressable>
  );
}

export default function AppGroupLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Study",
        headerRight: () => <HeaderSignOut />,
      }}
    />
  );
}
