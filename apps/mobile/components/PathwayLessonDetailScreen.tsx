import {
  canShowPaidLessonProgressRow,
  createJsonApiClient,
  fetchPathwayLesson,
  isLessonHubRetryableErrorMessage,
  isLessonHubSubscriptionLockedMessage,
  lessonQueryKeys,
  LESSON_RESUME_LESSON_ID_KEY,
  LESSON_RESUME_PATHWAY_ID_KEY,
  LESSON_RESUME_SCROLL_KEY,
  LESSON_RESUME_SLUG_KEY,
  MobileLessonDetailFetchError,
  neutralLessonLockedBodyForSurface,
  parseApiErrorCode,
  postPathwayLessonProgress,
  shouldShowUpgradeUi,
  splitMarkdownBodyIntoChunks,
  type MobilePathwayLessonDetailResponse,
  type MobilePathwayLessonRecord,
  type MobilePathwayLessonSection,
} from "@nursenest/mobile-shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../lib/auth-context";
import { useAppTheme } from "../lib/theme-provider";
import type { NurseNestPalette } from "../lib/theme";

const SCROLL_PERSIST_MIN_DELTA = 120;

function looksLikeLessonRowId(segment: string): boolean {
  const s = segment.trim();
  return s.length >= 20 && s.length <= 32 && !s.includes("-") && /^[a-z0-9]+$/i.test(s);
}

function getDetailErrorMeta(err: unknown): { message: string; status?: number; body?: unknown } {
  if (err instanceof MobileLessonDetailFetchError) {
    return { message: err.message, status: err.status, body: err.errorBody };
  }
  if (err instanceof Error) return { message: err.message };
  return { message: String(err ?? "Unknown error") };
}

function examLabelFromRecord(record: MobilePathwayLessonRecord, pathwayId: string): string | null {
  const meta = record.activeExamMeta?.exam?.trim();
  if (meta) return meta;
  const first = record.exams?.[0]?.trim();
  if (first) return first;
  return pathwayId?.trim() ? pathwayId : null;
}

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
    <View
      style={[
        styles.sectionCard,
        { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated },
      ]}
    >
      <Text style={[styles.sectionHeading, { color: palette.semanticTextPrimary }]} allowFontScaling>
        {section.heading}
      </Text>
      <SectionBody body={section.body} palette={palette} />
    </View>
  );
});

const BulletList = memo(function BulletList({
  title,
  lines,
  palette,
}: {
  title: string;
  lines: readonly string[];
  palette: NurseNestPalette;
}) {
  if (!lines.length) return null;
  return (
    <View
      style={[
        styles.sectionCard,
        { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated },
      ]}
    >
      <Text style={[styles.sectionHeading, { color: palette.semanticTextPrimary }]} allowFontScaling>
        {title}
      </Text>
      {lines.map((line, i) => (
        <Text key={i} style={[styles.body, { color: palette.semanticTextSecondary }]} allowFontScaling selectable>
          {"\u2022 "}
          {line}
        </Text>
      ))}
    </View>
  );
});

type RelatedRow = MobilePathwayLessonDetailResponse["related"][number];

const LessonRelatedBlock = memo(function LessonRelatedBlock({
  related,
  palette,
  pathwayId,
  onSelect,
}: {
  related: readonly RelatedRow[];
  palette: NurseNestPalette;
  pathwayId: string;
  onSelect: (slug: string) => void;
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
          onPress={() => onSelect(r.slug)}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Text style={{ color: palette.semanticBrand, fontWeight: "600" }} allowFontScaling numberOfLines={2}>
            {r.title}
          </Text>
          <Text style={{ color: palette.semanticTextMuted, fontSize: 12 }} allowFontScaling numberOfLines={1}>
            {[r.topic, pathwayId].filter(Boolean).join(" · ")}
          </Text>
        </Pressable>
      ))}
    </View>
  );
});

export function PathwayLessonDetailScreen() {
  const params = useLocalSearchParams<{ slug: string; pathwayId?: string; lessonId?: string }>();
  const slug = String(params.slug ?? "");
  const pathwayFromRoute = params.pathwayId ? String(params.pathwayId) : "";
  const lessonIdFromRoute = params.lessonId ? String(params.lessonId) : "";

  const { origin, cookieJar } = useAuth();
  const { palette } = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const lastPersistedScrollY = useRef(-1);

  const [resumePathwayId, setResumePathwayId] = useState<string | null>(null);
  const [resumeHydrated, setResumeHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void SecureStore.getItemAsync(LESSON_RESUME_PATHWAY_ID_KEY).then((v) => {
      if (cancelled) return;
      setResumePathwayId(v?.trim() ? v.trim() : null);
      setResumeHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const pathwayId = pathwayFromRoute.trim() || resumePathwayId || "";

  const fetchArgs = useMemo(() => {
    if (lessonIdFromRoute.trim()) return { id: lessonIdFromRoute.trim() } as const;
    if (slug && pathwayId) return { pathwayId, slug } as const;
    if (slug && looksLikeLessonRowId(slug)) return { id: slug } as const;
    return null;
  }, [lessonIdFromRoute, slug, pathwayId]);

  const fetchKey = useMemo(() => JSON.stringify(fetchArgs ?? null), [fetchArgs]);

  useEffect(() => {
    lastPersistedScrollY.current = -1;
  }, [slug, lessonIdFromRoute, fetchKey]);

  const client = useMemo(
    () =>
      createJsonApiClient({
        baseUrl: origin,
        getCookieHeader: () => cookieJar ?? undefined,
        timeoutMs: 60_000,
      }),
    [origin, cookieJar],
  );

  const detailQueryKey = useMemo(
    () => (fetchArgs ? lessonQueryKeys.detail(fetchArgs) : ([...lessonQueryKeys.all, "detail", "idle"] as const)),
    [fetchArgs],
  );

  const detailQuery = useQuery({
    queryKey: detailQueryKey,
    enabled: Boolean(origin && cookieJar && fetchArgs),
    queryFn: async () => fetchPathwayLesson(client, fetchArgs!),
  });

  const data = detailQuery.data as MobilePathwayLessonDetailResponse | undefined;

  const errParsed = detailQuery.isError ? getDetailErrorMeta(detailQuery.error) : null;
  const errMsg = errParsed?.message ?? "";
  const errStatus = errParsed?.status;
  const errBody = errParsed?.body;

  const errCode = errBody !== undefined ? parseApiErrorCode(errBody) : undefined;
  const needsSession =
    errStatus === 401 || errCode === "unauthorized" || errCode === "access_verify_failed";
  const upgradeUi = errStatus !== undefined && shouldShowUpgradeUi(errStatus, errBody) && !needsSession;
  const subscriptionLocked = Boolean(errMsg && isLessonHubSubscriptionLockedMessage(errMsg));
  const showNeutralPaywall = upgradeUi || subscriptionLocked;
  const retryable = Boolean(errMsg && isLessonHubRetryableErrorMessage(errMsg));

  useEffect(() => {
    if (!data?.record?.slug || !data.pathwayId) return;
    void (async () => {
      try {
        await SecureStore.setItemAsync(LESSON_RESUME_PATHWAY_ID_KEY, data.pathwayId);
        await SecureStore.setItemAsync(LESSON_RESUME_SLUG_KEY, data.record.slug);
        await SecureStore.setItemAsync(LESSON_RESUME_LESSON_ID_KEY, data.lessonId);
      } catch {
        /* best-effort */
      }
    })();
  }, [data?.pathwayId, data?.record?.slug, data?.lessonId]);

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
        /* non-fatal */
      }
    })();
  }, [client, data?.pathwayId, data?.record?.slug, data?.entitlement, queryClient]);

  const onScrollPersist = useCallback((y: number) => {
    if (Math.abs(y - lastPersistedScrollY.current) < SCROLL_PERSIST_MIN_DELTA) return;
    lastPersistedScrollY.current = y;
    void SecureStore.setItemAsync(LESSON_RESUME_SCROLL_KEY, String(y)).catch(() => undefined);
  }, []);

  const onSelectRelated = useCallback(
    (nextSlug: string) => {
      if (!data?.pathwayId) return;
      router.replace({
        pathname: "/(learner)/lesson/[slug]",
        params: { slug: nextSlug, pathwayId: data.pathwayId },
      });
    },
    [router, data?.pathwayId],
  );

  const examLabel = data ? examLabelFromRecord(data.record, data.pathwayId) : null;

  const hasArticle = useMemo(() => {
    if (!data) return false;
    return (
      (data.record.sections?.length ?? 0) > 0 ||
      Boolean(data.record.memoryAnchor?.trim()) ||
      Boolean(data.record.studyTakeaways?.length) ||
      Boolean(data.record.studyCommonTraps?.length)
    );
  }, [data]);

  const missingRouteParams = resumeHydrated && fetchArgs === null;

  if (!origin || !cookieJar) {
    return (
      <>
        <Stack.Screen options={{ title: "Lesson" }} />
        <View style={[styles.center, { backgroundColor: palette.semanticBgBase }]}>
          <Text style={{ color: palette.semanticTextSecondary }} allowFontScaling>
            Sign in and set web origin to load lessons.
          </Text>
        </View>
      </>
    );
  }

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
        {!resumeHydrated && slug && !lessonIdFromRoute.trim() && !pathwayFromRoute.trim() && !looksLikeLessonRowId(slug) ? (
          <View style={{ gap: 10 }}>
            {[1, 2].map((i) => (
              <View key={i} style={[styles.skel, { backgroundColor: palette.semanticBorderSoft }]} />
            ))}
          </View>
        ) : null}

        {missingRouteParams ? (
          <View style={[styles.errorBox, { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated }]}>
            <Text style={{ color: palette.semanticTextSecondary }} allowFontScaling>
              This lesson needs a pathway context. Open it from the Lessons hub, or ensure the link includes pathway
              information.
            </Text>
          </View>
        ) : null}

        {detailQuery.isLoading && fetchArgs ? (
          <View style={{ gap: 10 }}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.skel, { backgroundColor: palette.semanticBorderSoft }]} />
            ))}
          </View>
        ) : null}

        {detailQuery.isError ? (
          <View style={[styles.errorBox, { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated }]}>
            <Text
              style={{
                color: needsSession || showNeutralPaywall ? palette.semanticTextSecondary : palette.semanticDanger,
              }}
              allowFontScaling
            >
              {needsSession
                ? "Your session could not be verified. Sign out and sign in again from Account, then reopen this lesson."
                : showNeutralPaywall
                  ? neutralLessonLockedBodyForSurface("detail")
                  : errMsg || "Something went wrong."}
            </Text>
            {retryable ? (
              <Pressable onPress={() => void detailQuery.refetch()} style={{ marginTop: 12, minHeight: 44, justifyContent: "center" }}>
                <Text style={{ color: palette.semanticBrand, fontWeight: "700" }} allowFontScaling>
                  Try again
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {data && !detailQuery.isError ? (
          <>
            <Text style={[styles.title, { color: palette.semanticTextPrimary }]} allowFontScaling>
              {data.record.title}
            </Text>
            {examLabel ? (
              <Text style={[styles.examLine, { color: palette.semanticTextMuted }]} allowFontScaling numberOfLines={2}>
                Exam / pathway: {examLabel}
              </Text>
            ) : null}
            <Text style={[styles.sub, { color: palette.semanticTextMuted }]} allowFontScaling>
              {[data.record.topic, data.record.bodySystem].filter(Boolean).join(" · ")}
            </Text>
            {canShowPaidLessonProgressRow(data.entitlement) ? (
              <Text style={[styles.progress, { color: palette.semanticInfo }]} allowFontScaling>
                Status: {data.progressStatus.replace("_", " ")}
              </Text>
            ) : null}

            {data.record.memoryAnchor?.trim() ? (
              <View
                style={[
                  styles.sectionCard,
                  { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated },
                ]}
              >
                <Text style={[styles.sectionHeading, { color: palette.semanticTextPrimary }]} allowFontScaling>
                  Memory anchor
                </Text>
                <SectionBody body={data.record.memoryAnchor.trim()} palette={palette} />
              </View>
            ) : null}

            <BulletList title="Key points" lines={data.record.studyTakeaways ?? []} palette={palette} />
            <BulletList title="Clinical pearls & traps" lines={data.record.studyCommonTraps ?? []} palette={palette} />

            {(data.record.sections ?? []).map((s) => (
              <LessonSectionCard key={s.id} section={s} palette={palette} />
            ))}

            {!hasArticle ? (
              <Text style={{ color: palette.semanticTextMuted }} allowFontScaling>
                No lesson sections are available for this topic yet.
              </Text>
            ) : null}

            <LessonRelatedBlock
              related={data.related}
              palette={palette}
              pathwayId={data.pathwayId}
              onSelect={onSelectRelated}
            />
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
  center: { flex: 1, padding: 24, justifyContent: "center" },
  scroll: { padding: 12, paddingBottom: 40, gap: 12 },
  title: { fontSize: 24, fontWeight: "800" },
  examLine: { fontSize: 13, fontWeight: "600" },
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
