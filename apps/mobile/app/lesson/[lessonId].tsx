import {
  canShowPaidLessonProgressRow,
  createJsonApiClient,
  fetchPathwayLessonDetail,
  isLessonHubRetryableErrorMessage,
  isLessonHubSubscriptionLockedMessage,
  lessonQueryKeys,
  LESSON_RESUME_SCROLL_KEY,
  neutralLessonLockedBodyForSurface,
  postPathwayLessonProgress,
  splitMarkdownBodyIntoChunks,
  type MobilePathwayLessonDetailResponse,
  type MobilePathwayLessonSection,
} from "@nursenest/mobile-shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/auth-context";
import { useAppTheme } from "../../lib/theme-provider";
import type { NurseNestPalette } from "../../lib/theme";

const SCROLL_PERSIST_MIN_DELTA = 120;

const SectionBody = memo(function SectionBody({ body, palette }: { body: string; palette: NurseNestPalette }) {
  const chunks = useMemo(() => splitMarkdownBodyIntoChunks(body, 3200), [body]);
  return (
    <>
      {chunks.map((c, i) => (
        <Text
          key={i}
          style={[styles.body, { color: palette.semanticTextSecondary }]}
          allowFontScaling
          selectable
        >
          {c}
        </Text>
      ))}
    </>
  );
});

const LessonSectionCard = memo(function LessonSectionCard({
  section,
  palette,
}: {
  section: MobilePathwayLessonSection;
  palette: NurseNestPalette;
}) {
  return (
    <View style={[styles.sectionCard, { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated }]}>
      <Text style={[styles.sectionHeading, { color: palette.semanticTextPrimary }]} allowFontScaling>
        {section.heading}
      </Text>
      <SectionBody body={section.body} palette={palette} />
    </View>
  );
});

type RelatedRow = MobilePathwayLessonDetailResponse["related"][number];

const LessonRelatedBlock = memo(function LessonRelatedBlock({
  related,
  palette,
  onSelect,
}: {
  related: readonly RelatedRow[];
  palette: NurseNestPalette;
  onSelect: (lessonId: string) => void;
}) {
  if (!related.length) return null;
  return (
    <View style={{ marginTop: 16, gap: 8 }}>
      <Text style={[styles.relatedTitle, { color: palette.semanticTextPrimary }]} allowFontScaling>
        Related
      </Text>
      {related.map((r) => (
        <Pressable
          key={r.slug}
          onPress={() => {
            if (!r.lessonId) return;
            onSelect(r.lessonId);
          }}
          style={{ minHeight: 44, justifyContent: "center", opacity: r.lessonId ? 1 : 0.45 }}
          disabled={!r.lessonId}
        >
          <Text style={{ color: palette.semanticBrand, fontWeight: "600" }} allowFontScaling numberOfLines={2}>
            {r.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
});

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { origin, cookieJar } = useAuth();
  const { palette } = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const lastPersistedScrollY = useRef(-1);

  useEffect(() => {
    lastPersistedScrollY.current = -1;
  }, [lessonId]);

  const client = useMemo(
    () =>
      createJsonApiClient({
        baseUrl: origin,
        getCookieHeader: () => cookieJar ?? undefined,
        timeoutMs: 60_000,
      }),
    [origin, cookieJar],
  );

  const detailQuery = useQuery({
    queryKey: lessonQueryKeys.detail({ id: String(lessonId) }),
    enabled: Boolean(origin && cookieJar && lessonId),
    queryFn: async () => fetchPathwayLessonDetail(client, { id: String(lessonId) }),
  });

  const data = detailQuery.data as MobilePathwayLessonDetailResponse | undefined;

  const errMsg = detailQuery.isError ? String((detailQuery.error as Error)?.message ?? "") : "";
  const locked = Boolean(errMsg && isLessonHubSubscriptionLockedMessage(errMsg));
  const retryable = Boolean(errMsg && isLessonHubRetryableErrorMessage(errMsg));

  useEffect(() => {
    if (!data?.record?.slug || !data.pathwayId) return;
    if (!canShowPaidLessonProgressRow(data.entitlement)) return;
    void (async () => {
      try {
        await postPathwayLessonProgress(client, {
          pathwayId: data.pathwayId,
          lessonSlug: data.record.slug,
          action: "open",
        });
        await queryClient.invalidateQueries({ queryKey: lessonQueryKeys.all });
      } catch {
        /* non-fatal — server remains source of truth */
      }
    })();
  }, [client, data?.pathwayId, data?.record?.slug, data?.entitlement, queryClient]);

  const onScrollPersist = useCallback(
    (y: number) => {
      if (Math.abs(y - lastPersistedScrollY.current) < SCROLL_PERSIST_MIN_DELTA) return;
      lastPersistedScrollY.current = y;
      void SecureStore.setItemAsync(LESSON_RESUME_SCROLL_KEY, String(y)).catch(() => undefined);
    },
    [],
  );

  const onSelectRelated = useCallback(
    (id: string) => {
      router.replace({ pathname: "/lesson/[lessonId]", params: { lessonId: id } });
    },
    [router],
  );

  return (
    <>
      <Stack.Screen options={{ title: data?.record?.title ?? "Lesson" }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: palette.semanticBgBase }}
        contentContainerStyle={styles.scroll}
        onScroll={({ nativeEvent }) => {
          const y = Math.round(nativeEvent.contentOffset.y);
          onScrollPersist(y);
        }}
        scrollEventThrottle={400}
      >
        {detailQuery.isLoading ? (
          <View style={{ gap: 10 }}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.skel, { backgroundColor: palette.semanticBorderSoft }]} />
            ))}
          </View>
        ) : null}

        {detailQuery.isError ? (
          <View style={[styles.errorBox, { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated }]}>
            <Text style={{ color: locked ? palette.semanticTextSecondary : palette.semanticDanger }} allowFontScaling>
              {locked ? neutralLessonLockedBodyForSurface("detail") : errMsg || "Something went wrong."}
            </Text>
            {retryable ? (
              <Pressable onPress={() => void detailQuery.refetch()} style={{ marginTop: 12, minHeight: 44, justifyContent: "center" }}>
                <Text style={{ color: palette.semanticBrand, fontWeight: "700" }}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {data ? (
          <>
            <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
              {data.record.title}
            </Text>
            <Text style={[styles.sub, { color: palette.semanticTextMuted }]} allowFontScaling>
              {[data.record.topic, data.record.bodySystem].filter(Boolean).join(" · ")}
            </Text>
            {canShowPaidLessonProgressRow(data.entitlement) ? (
              <Text style={[styles.progress, { color: palette.semanticInfo }]} allowFontScaling>
                Status: {data.progressStatus.replace("_", " ")}
              </Text>
            ) : null}

            {(data.record.sections ?? []).map((s) => (
              <LessonSectionCard key={s.id} section={s} palette={palette} />
            ))}

            <LessonRelatedBlock related={data.related} palette={palette} onSelect={onSelectRelated} />
          </>
        ) : null}

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: palette.semanticBrand, fontWeight: "700", fontSize: 16 }} allowFontScaling>
            Back
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 12, paddingBottom: 40, gap: 12 },
  title: { fontSize: 24, fontWeight: "800" },
  sub: { fontSize: 14 },
  progress: { fontSize: 14, fontWeight: "600" },
  sectionCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 8,
  },
  sectionHeading: { fontSize: 18, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 22 },
  relatedTitle: { fontSize: 17, fontWeight: "700" },
  backBtn: { marginTop: 20, minHeight: 44, justifyContent: "center" },
  skel: { height: 100, borderRadius: 12, opacity: 0.4 },
  errorBox: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 4,
  },
});
