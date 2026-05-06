import { useLocalSearchParams, Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ScreenErrorBoundary } from "@/components/ScreenErrorBoundary";
import { evictionLimitForBucket, storageKeyForLesson, type OfflineContentDomain } from "@nursenest/mobile-shared";

/**
 * Lesson surface placeholder — full lesson payload stays one-request-per-slug (web parity).
 * Deep link: nursenest://lesson/&lt;slug&gt;
 *
 * List windowing: use FlashList or virtualized lists for large catalogs; tune `windowSize`/`maxToRenderPerBatch` on FlatList.
 */
export default function LessonScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const key = storageKeyForLesson(String(slug));
  const limit = evictionLimitForBucket("lessons");
  const domain: OfflineContentDomain = "lesson";

  return (
    <ScreenErrorBoundary screen={`lesson:${String(slug)}`}>
      <View style={styles.box}>
        <Text style={styles.title}>Lesson</Text>
        <Text style={styles.mono}>slug: {slug}</Text>
        <Text style={styles.muted}>
          Offline key: {key} · eviction cap: {limit} · domain: {domain}
        </Text>
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: "https://docs.expo.dev/static/images/tutorial/background-image.png" }}
          style={styles.hero}
          cachePolicy="memory-disk"
          contentFit="cover"
        />
        <Link href="/(tabs)" asChild>
          <Pressable style={styles.back}>
            <Text style={styles.backText}>Home</Text>
          </Pressable>
        </Link>
      </View>
    </ScreenErrorBoundary>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 24, gap: 10 },
  title: { fontSize: 22, fontWeight: "700" },
  mono: { fontFamily: "monospace", fontSize: 13 },
  muted: { opacity: 0.8, fontSize: 12 },
  hero: { width: "100%", height: 160, borderRadius: 12, marginVertical: 8 },
  back: { alignSelf: "flex-start", marginTop: 8 },
  backText: { color: "#2563eb", fontWeight: "600" },
});
