import {
  canShowPaidLessonProgressRow,
  createJsonApiClient,
  fetchPathwayLessonTopics,
  fetchPathwayLessonsPage,
  lessonQueryKeys,
  LESSON_RESUME_LESSON_ID_KEY,
  LESSON_RESUME_PATHWAY_ID_KEY,
  LESSON_RESUME_SCROLL_KEY,
  LESSON_RESUME_SLUG_KEY,
  type MobilePathwayLessonListRow,
  type MobilePathwayLessonsListResponse,
} from "@nursenest/mobile-shared";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LoadingFallback } from "../../components/LoadingFallback";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useAuth } from "../../lib/auth-context";
import { usePathwayStore } from "../../lib/pathway-store";
import { useAppTheme } from "../../lib/theme-provider";

const PAGE_LIMIT = 15;
const LIST_STALE_MS = 120_000;

function useMobileApiClient() {
  const { origin, cookieJar } = useAuth();
  return useMemo(
    () =>
      createJsonApiClient({
        baseUrl: origin,
        getCookieHeader: () => cookieJar ?? undefined,
        timeoutMs: 45_000,
      }),
    [origin, cookieJar],
  );
}

function progressLabel(
  row: MobilePathwayLessonListRow,
  map: Record<string, "not_started" | "in_progress" | "completed"> | null | undefined,
): string | null {
  if (!map) return null;
  const k = `${row.pathwayMeta.pathwayId}:${row.pathwayMeta.slug}`;
  const s = map[k];
  if (!s || s === "not_started") return null;
  if (s === "completed") return "Done";
  return "In progress";
}

function LessonsHubInner() {
  const { palette } = useAppTheme();
  const { origin, cookieJar, session } = useAuth();
  const client = useMobileApiClient();
  const router = useRouter();
  const { pathwayId, hydrate } = usePathwayStore();
  const [topicSlug, setTopicSlug] = useState<string | null>(null);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    setTopicSlug(null);
  }, [pathwayId]);

  useEffect(() => {
    emitEngagementEvent({ name: "engagement.session_start", surface: "lessons", clientTimestampMs: Date.now() });
  }, []);

  const topicsQuery = useQuery({
    queryKey: lessonQueryKeys.topics(pathwayId),
    enabled: Boolean(origin && cookieJar && pathwayId),
    staleTime: LIST_STALE_MS * 2,
    queryFn: async () => fetchPathwayLessonTopics(client, pathwayId),
  });

  const listQuery = useInfiniteQuery({
    queryKey: lessonQueryKeys.list({ pathwayId, topicSlug, limit: PAGE_LIMIT }),
    enabled: Boolean(origin && cookieJar && pathwayId),
    initialPageParam: 1,
    staleTime: LIST_STALE_MS,
    placeholderData: (prev) => prev,
    queryFn: async ({ pageParam }) =>
      fetchPathwayLessonsPage(client, {
        pathwayId,
        topicSlug,
        page: pageParam,
        limit: PAGE_LIMIT,
      }),
    getNextPageParam: (last: MobilePathwayLessonsListResponse) =>
      last.page < last.pageCount ? last.page + 1 : undefined,
  });

  const flatRows = useMemo(() => listQuery.data?.pages.flatMap((p) => p.rows) ?? [], [listQuery.data?.pages]);

  const showProgress = canShowPaidLessonProgressRow(listQuery.data?.pages[0]?.entitlement);

  const onPressLesson = useCallback(
    async (row: MobilePathwayLessonListRow) => {
      await SecureStore.setItemAsync(LESSON_RESUME_PATHWAY_ID_KEY, row.pathwayMeta.pathwayId);
      await SecureStore.setItemAsync(LESSON_RESUME_SLUG_KEY, row.pathwayMeta.slug);
      await SecureStore.setItemAsync(LESSON_RESUME_LESSON_ID_KEY, row.id);
      await SecureStore.setItemAsync(LESSON_RESUME_SCROLL_KEY, "0");
      router.push({ pathname: "/lesson/[lessonId]", params: { lessonId: row.id } });
    },
    [router],
  );

  if (!origin || !cookieJar) {
    return (
      <View style={[styles.center, { backgroundColor: palette.semanticBgBase }]}>
        <Text style={{ color: palette.semanticTextSecondary }}>Sign in and set web origin to load lessons.</Text>
      </View>
    );
  }

  if (!session?.user?.id) {
    return (
      <View style={[styles.center, { backgroundColor: palette.semanticBgBase }]}>
        <Text style={{ color: palette.semanticTextSecondary }}>Session required.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: palette.semanticBgBase }]}>
      <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
        Lessons
      </Text>
      <Text style={[styles.pathwayLine, { color: palette.semanticTextMuted }]} allowFontScaling numberOfLines={2}>
        Pathway: {pathwayId}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topicStrip}>
        <Pressable
          onPress={() => setTopicSlug(null)}
          style={({ pressed }) => [
            styles.topicChip,
            {
              backgroundColor: topicSlug == null ? palette.semanticBrandSoft : palette.semanticSurfaceElevated,
              borderColor: palette.semanticBorderSoft,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.topicChipText, { color: palette.semanticTextPrimary }]} allowFontScaling>
            All topics
          </Text>
        </Pressable>
        {(topicsQuery.data?.topics ?? []).map((t) => (
          <Pressable
            key={t.topicSlug}
            onPress={() => setTopicSlug(t.topicSlug === topicSlug ? null : t.topicSlug)}
            style={({ pressed }) => [
              styles.topicChip,
              {
                backgroundColor:
                  topicSlug === t.topicSlug ? palette.semanticBrandSoft : palette.semanticSurfaceElevated,
                borderColor: palette.semanticBorderSoft,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.topicChipText, { color: palette.semanticTextPrimary }]} allowFontScaling numberOfLines={1}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {topicsQuery.isLoading ? (
        <View style={styles.skeletonRow}>
          <View style={[styles.skel, { backgroundColor: palette.semanticBorderSoft }]} />
          <View style={[styles.skel, { backgroundColor: palette.semanticBorderSoft }]} />
        </View>
      ) : null}

      {listQuery.isError ? (
        <Text style={{ color: palette.semanticDanger, paddingHorizontal: 12 }}>
          {(listQuery.error as Error)?.message ?? "Could not load lessons."}
        </Text>
      ) : null}

      <FlatList
        data={flatRows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPad}
        windowSize={7}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={listQuery.isFetching && !listQuery.isFetchingNextPage}
            onRefresh={() => void listQuery.refetch()}
            tintColor={palette.semanticBrand}
          />
        }
        onEndReached={() => {
          if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) void listQuery.fetchNextPage();
        }}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          listQuery.isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 12 }} color={palette.semanticBrand} />
          ) : null
        }
        ListEmptyComponent={
          listQuery.isLoading ? (
            <View style={{ gap: 10, paddingTop: 8 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={[styles.cardSkel, { backgroundColor: palette.semanticSurfaceElevated }]} />
              ))}
            </View>
          ) : (
            <Text style={{ color: palette.semanticTextMuted, padding: 12 }}>No lessons for this filter.</Text>
          )
        }
        renderItem={({ item }) => {
          const pill = showProgress ? progressLabel(item, listQuery.data?.pages[0]?.progressByPathwaySlug ?? null) : null;
          return (
            <Pressable
              onPress={() => void onPressLesson(item)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: palette.semanticSurfaceElevated,
                  borderColor: palette.semanticBorderSoft,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, { color: palette.semanticTextPrimary }]} allowFontScaling numberOfLines={3}>
                  {item.title}
                </Text>
                {pill ? (
                  <View style={[styles.pill, { borderColor: palette.semanticInfo, backgroundColor: palette.semanticBgSoft }]}>
                    <Text style={[styles.pillText, { color: palette.semanticInfo }]} allowFontScaling>
                      {pill}
                    </Text>
                  </View>
                ) : null}
              </View>
              {item.summary ? (
                <Text style={[styles.cardSum, { color: palette.semanticTextSecondary }]} allowFontScaling numberOfLines={3}>
                  {item.summary}
                </Text>
              ) : null}
              <Text style={[styles.meta, { color: palette.semanticTextMuted }]} allowFontScaling numberOfLines={1}>
                {[item.topic, item.bodySystem].filter(Boolean).join(" · ")}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

export default function LessonsTab() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LessonsHubInner />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 12, marginBottom: 4 },
  pathwayLine: { fontSize: 12, paddingHorizontal: 12, marginBottom: 8 },
  topicStrip: { paddingHorizontal: 10, gap: 8, paddingBottom: 8, alignItems: "center" },
  topicChip: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: "center",
  },
  topicChipText: { fontSize: 14, fontWeight: "600", maxWidth: 200 },
  listPad: { paddingHorizontal: 10, paddingBottom: 24, gap: 10 },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 6,
  },
  cardTop: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: "600" },
  pill: { borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 8, paddingVertical: 4 },
  pillText: { fontSize: 11, fontWeight: "700" },
  cardSum: { fontSize: 14, lineHeight: 20 },
  meta: { fontSize: 12 },
  skeletonRow: { flexDirection: "row", gap: 8, paddingHorizontal: 12, marginBottom: 6 },
  skel: { height: 12, flex: 1, borderRadius: 6, opacity: 0.5 },
  cardSkel: { height: 88, borderRadius: 12, opacity: 0.35 },
});
