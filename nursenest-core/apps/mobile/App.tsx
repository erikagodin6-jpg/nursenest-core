import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, StyleSheet } from "react-native";
import { ApiProvider } from "./src/api-context";
import { PathwayProvider } from "./src/pathway-context";
import { CatMenuScreen } from "./src/screens/CatMenuScreen";
import { FlashcardListScreen } from "./src/screens/FlashcardListScreen";
import { FlashcardStudyScreen } from "./src/screens/FlashcardStudyScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { NpCatScreen } from "./src/screens/NpCatScreen";
import { PracticeHubScreen } from "./src/screens/PracticeHubScreen";
import { PracticeRunnerGateScreen } from "./src/screens/PracticeRunnerGateScreen";

type Route =
  | { name: "home" }
  | { name: "flash-list" }
  | { name: "flash-study"; deckRef: string }
  | { name: "practice" }
  | { name: "practice-run"; id: string }
  | { name: "cat-menu" }
  | { name: "np-cat" };

export default function App(): React.ReactElement {
  const qc = useMemo(() => new QueryClient(), []);
  const [route, setRoute] = useState<Route>({ name: "home" });

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={qc}>
        <PathwayProvider>
          <ApiProvider>
            <SafeAreaView style={styles.safe}>
              <StatusBar style="dark" />
              {route.name === "home" ? (
                <HomeScreen
                  onFlashcards={() => setRoute({ name: "flash-list" })}
                  onPractice={() => setRoute({ name: "practice" })}
                  onCat={() => setRoute({ name: "cat-menu" })}
                />
              ) : null}
              {route.name === "flash-list" ? (
                <FlashcardListScreen
                  onBack={() => setRoute({ name: "home" })}
                  onOpenDeck={(slug) => setRoute({ name: "flash-study", deckRef: slug })}
                />
              ) : null}
              {route.name === "flash-study" ? (
                <FlashcardStudyScreen deckRef={route.deckRef} onBack={() => setRoute({ name: "flash-list" })} />
              ) : null}
              {route.name === "practice" ? (
                <PracticeHubScreen
                  onBack={() => setRoute({ name: "home" })}
                  onOpenTest={(id) => setRoute({ name: "practice-run", id })}
                />
              ) : null}
              {route.name === "practice-run" ? (
                <PracticeRunnerGateScreen practiceTestId={route.id} onBack={() => setRoute({ name: "practice" })} />
              ) : null}
              {route.name === "cat-menu" ? (
                <CatMenuScreen
                  onBack={() => setRoute({ name: "home" })}
                  onRnCat={() => setRoute({ name: "practice" })}
                  onNpCat={() => setRoute({ name: "np-cat" })}
                />
              ) : null}
              {route.name === "np-cat" ? <NpCatScreen onBack={() => setRoute({ name: "cat-menu" })} /> : null}
            </SafeAreaView>
          </ApiProvider>
        </PathwayProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#fff" },
});
