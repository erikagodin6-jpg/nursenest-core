import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAppTheme } from "../lib/theme-provider";

export function LoadingFallback() {
  const { palette } = useAppTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: palette.semanticBgBase }]}>
      <ActivityIndicator size="large" color={palette.semanticBrand} accessibilityLabel="Loading" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
