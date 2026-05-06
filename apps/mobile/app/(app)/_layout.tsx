import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuth } from "../../lib/auth-context";

export default function AppGroupLayout() {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        title: "Study",
        headerRight: () => (
          <Pressable
            onPress={() => {
              void (async () => {
                await signOut();
                router.replace("/(auth)/login");
              })();
            }}
            style={{ paddingHorizontal: 12 }}
          >
            <Text>Sign out</Text>
          </Pressable>
        ),
      }}
    />
  );
}
