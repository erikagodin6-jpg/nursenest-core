import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../lib/auth-context";

export default function LoginScreen() {
  const { signIn, session, ready } = useAuth();
  const router = useRouter();
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
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.hint}>Uses the same account as the NurseNest website (NextAuth session cookie).</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email or username"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable onPress={() => setRemember(!remember)} style={styles.row}>
        <Text>{remember ? "☑" : "☐"} Stay signed in</Text>
      </Pressable>
      <Pressable style={[styles.button, busy && styles.buttonDisabled]} onPress={onSubmit} disabled={busy}>
        <Text style={styles.buttonLabel}>{busy ? "Signing in…" : "Continue"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "600" },
  hint: { opacity: 0.75, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: { paddingVertical: 4 },
  button: { backgroundColor: "#1d4ed8", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
