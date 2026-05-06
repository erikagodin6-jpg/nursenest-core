import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function CatMenuScreen(props: {
  onBack: () => void;
  onRnCat: () => void;
  onNpCat: () => void;
}): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={props.onBack} style={styles.back}>
        <Text>← Back</Text>
      </Pressable>
      <Text style={styles.title}>CAT</Text>
      <Text style={styles.body}>RN/RPN adaptive practice uses `POST /api/practice-tests` + `cat_advance` (same as web runner).</Text>
      <Pressable style={styles.btn} onPress={props.onRnCat}>
        <Text style={styles.btnText}>RN practice CAT</Text>
      </Pressable>
      <Text style={styles.body}>NP readiness engine uses `/api/cat/np/session` + `/answer` + `/analysis`.</Text>
      <Pressable style={styles.btnNp} onPress={props.onNpCat}>
        <Text style={styles.btnText}>NP CAT session</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 12 },
  back: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  body: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  btn: { backgroundColor: "#0369a1", padding: 14, borderRadius: 12, marginTop: 8 },
  btnNp: { backgroundColor: "#5b21b6", padding: 14, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
