import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NurseNestColors } from "../lib/theme";

type Props = { readonly children: ReactNode; readonly scope?: string };

type State = { hasError: boolean; message: string };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Something went wrong" };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.warn("[ErrorBoundary]", this.props.scope ?? "root", error.message, info.componentStack);
    }
  }

  private reset = () => {
    this.setState({ hasError: false, message: "" });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>We hit a snag</Text>
          <Text style={styles.body}>{this.state.message}</Text>
          <Pressable onPress={this.reset} style={styles.btn}>
            <Text style={styles.btnText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: NurseNestColors.semanticBgSoft,
  },
  title: { fontSize: 20, fontWeight: "700", color: NurseNestColors.semanticTextPrimary, marginBottom: 8 },
  body: { color: NurseNestColors.semanticTextSecondary, marginBottom: 20 },
  btn: {
    alignSelf: "flex-start",
    backgroundColor: NurseNestColors.semanticBrand,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: { color: "#ffffff", fontWeight: "600" },
});
