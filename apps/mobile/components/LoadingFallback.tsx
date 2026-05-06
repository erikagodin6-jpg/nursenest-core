import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NurseNestColors } from "../lib/theme";

export function LoadingFallback() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={NurseNestColors.semanticBrand} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: NurseNestColors.semanticBgBase,
  },
});
