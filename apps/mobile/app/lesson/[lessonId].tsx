import {
  canShowPaidLessonProgressRow,
  createJsonApiClient,
  fetchPathwayLessonDetail,
  lessonQueryKeys,
  LESSON_RESUME_SCROLL_KEY,
  postPathwayLessonProgress,
  splitMarkdownBodyIntoChunks,
  type MobilePathwayLessonDetailResponse,
  type MobilePathwayLessonSection,
} from "@nursenest/mobile-shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { memo, useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/auth-context";
import { useAppTheme } from "../../lib/theme-provider";
import type { NurseNestPalette } from "../../lib/theme";

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

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { origin, cookieJar } = useAuth();
  const { palette } = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  return (
    <>
      <Stack.Screen options={{ title: data?.record?.title ?? "Lesson" }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: palette.semanticBgBase }}
        contentContainerStyle={styles.scroll}
        onScroll={({ nativeEvent }) => {
          const y = Math.round(nativeEvent.contentOffset.y);
          void SecureStore.setItemAsync(LESSON_RESUME_SCROLL_KEY, String(y)).catch(() => undefined);
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
          <Text style={{ color: palette.semanticDanger }}>{(detailQuery.error as Error)?.message ?? "Error"}</Text>
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

            {data.related.length > 0 ? (
              <View style={{ marginTop: 16, gap: 8 }}>
                <Text style={[styles.relatedTitle, { color: palette.semanticTextPrimary }]} allowFontScaling>
                  Related
                </Text>
                {data.related.map((r) => (
                  <Pressable
                    key={r.slug}
                    onPress={() => {
                      if (!r.lessonId) return;
                      router.replace({ pathname: "/lesson/[lessonId]", params: { lessonId: r.lessonId } });
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
            ) : null}
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
});
