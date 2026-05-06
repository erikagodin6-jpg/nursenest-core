import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth-context";
import { useAppTheme } from "../../lib/theme-provider";

export default function LoginScreen() {
  const { signIn, session, ready } = useAuth();
  const router = useRouter();
  const { palette } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && session?.user?.id) {
      router.replace("/");
    }
  }, [ready, session?.user?.id, router]);

  async function onSubmit() {
    setBusy(true);
    try {
      await signIn(email.trim(), password, remember);
      router.replace("/");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign-in failed";
      Alert.alert("Could not sign in", msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: palette.semanticBgBase }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 8 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Sign in
        </Text>
        <Text style={[styles.hint, { color: palette.semanticTextSecondary }]} allowFontScaling>
          Uses the same account as the NurseNest website (NextAuth session cookie). Billing and upgrades stay on the web.
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
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email or username"
          placeholderTextColor={palette.semanticTextMuted}
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          textContentType="username"
          autoComplete="username"
          accessibilityLabel="Email or username"
        />
        <TextInput
          style={[
            styles.input,
            {
              color: palette.semanticTextPrimary,
              borderColor: palette.semanticBorderSoft,
              backgroundColor: palette.semanticSurfaceElevated,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={palette.semanticTextMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="go"
          onSubmitEditing={() => void onSubmit()}
          textContentType="password"
          autoComplete="password"
          accessibilityLabel="Password"
        />
        <Pressable
          onPress={() => setRemember(!remember)}
          style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: remember }}
          accessibilityLabel="Stay signed in"
        >
          <Text style={{ color: palette.semanticTextPrimary }} allowFontScaling>
            {remember ? "☑" : "☐"} Stay signed in
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: palette.semanticBrand },
            busy && styles.buttonDisabled,
          ]}
          onPress={() => void onSubmit()}
          disabled={busy}
          accessibilityRole="button"
          accessibilityState={{ disabled: busy }}
          accessibilityLabel={busy ? "Signing in" : "Continue sign in"}
        >
          <Text style={[styles.buttonLabel, { color: palette.semanticOnBrand }]} allowFontScaling>
            {busy ? "Signing in…" : "Continue"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, gap: 12, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "600" },
  hint: { marginBottom: 8, lineHeight: 22 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  row: { paddingVertical: 8, minHeight: 44, justifyContent: "center" },
  button: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", minHeight: 48 },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { fontWeight: "600", fontSize: 16 },
});
