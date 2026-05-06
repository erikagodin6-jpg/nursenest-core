import {
  apiPaths,
  queryRoots,
  resolveSubscriberUiState,
  shouldShowUpgradeUi,
} from "@nursenest/mobile-shared";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingFallback } from "../../components/LoadingFallback";
import { ScreenErrorBoundary } from "../../components/ScreenErrorBoundary";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useNetworkHint } from "../../hooks/useNetworkHint";
import { apiJson, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { useLearnerHorizontalPadding } from "../../lib/layout";
import { usePathwayStore } from "../../lib/pathway-store";
import { useAppTheme } from "../../lib/theme-provider";

type Profile = {
  learnerPath?: string | null;
  subscriberAccess?: boolean;
};

function Section({
  title,
  children,
  palette,
}: {
  title: string;
  children: ReactNode;
  palette: ReturnType<typeof useAppTheme>["palette"];
}) {
  return (
    <View style={[styles.section, { borderColor: palette.semanticBorderSoft, backgroundColor: palette.semanticSurfaceElevated }]}>
      <Text style={[styles.sectionTitle, { color: palette.semanticTextPrimary }]} allowFontScaling>
        {title}
      </Text>
      {children}
    </View>
  );
}

function HomeInner() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const horizontalPad = useLearnerHorizontalPadding();
  const { online } = useNetworkHint();
  const { ready: authReady, origin, cookieJar, signOut } = useAuth();
  const zPath = usePathwayStore((s) => s.pathwayId);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    emitEngagementEvent({
      name: "engagement.session_start",
      surface: "dashboard",
      clientTimestampMs: Date.now(),
    });
  }, []);

  const hasApiCredentials = Boolean(origin && cookieJar);

  const profile = useQuery({
    queryKey: queryRoots.personalProfile(zPath),
    queryFn: async () =>
      apiJson(origin, apiPaths.learnerPersonalProfile, cookieJar, { onUnauthorized: () => void signOut() }) as Profile,
    enabled: hasApiCredentials,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const accessUi = resolveSubscriberUiState({
    authReady,
    hasApiCredentials,
    profile: {
      isLoading: profile.isLoading,
      isSuccess: profile.isSuccess,
      isError: profile.isError,
      data: profile.data,
    },
  });

  const pathwayKey = profile.data?.learnerPath ?? zPath;
  const subscriber = accessUi.subscriberAccess;

  const commandCenter = useQuery({
    queryKey: queryRoots.commandCenter(pathwayKey),
    queryFn: async () => apiJson(origin, apiPaths.learnerCommandCenter, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: hasApiCredentials && subscriber,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: (n, err) => !(err instanceof ApiError && err.status === 403) && n < 2,
  });

  const dueSummary = useQuery({
    queryKey: queryRoots.flashcardsDueSummary(pathwayKey),
    queryFn: async () => apiJson(origin, apiPaths.flashcardsDueSummary, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: hasApiCredentials && subscriber,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: (n, err) => !(err instanceof ApiError && err.status === 403) && n < 2,
  });

  const readiness = useQuery({
    queryKey: queryRoots.readiness(pathwayKey),
    queryFn: async () => apiJson(origin, apiPaths.learnerReadiness, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: hasApiCredentials && subscriber,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: (n, err) => !(err instanceof ApiError && err.status === 403) && n < 2,
  });

  const engagement = useQuery({
    queryKey: queryRoots.engagementNudges(pathwayKey),
    queryFn: async () =>
      apiJson(origin, apiPaths.learnerEngagementNudges, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: hasApiCredentials && subscriber,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: (n, err) => !(err instanceof ApiError && err.status === 403) && n < 2,
  });

  const paywallCc = commandCenter.error instanceof ApiError ? shouldShowUpgradeUi(commandCenter.error.status, commandCenter.error.body) : false;

  const continueTitle = useMemo(() => {
    const d = commandCenter.data as { studyNext?: { primary?: { title?: string } } } | undefined;
    return d?.studyNext?.primary?.title ?? null;
  }, [commandCenter.data]);

  const nextLesson = useMemo(() => {
    const d = commandCenter.data as { plannedLessons?: { title: string }[] } | undefined;
    return d?.plannedLessons?.[0]?.title ?? null;
  }, [commandCenter.data]);

  const readinessLabel = useMemo(() => {
    const d = readiness.data as { passLikelihood?: { tier?: string } } | undefined;
    return d?.passLikelihood?.tier ?? null;
  }, [readiness.data]);

  const flashLine = useMemo(() => {
    if (accessUi.blockLockedCopyFlash) return accessUi.neutralSummaryLine || "Checking your access…";
    if (!subscriber) return accessUi.neutralSummaryLine || "Full practice features use the website billing flow.";
    if (dueSummary.isLoading) return "Loading…";
    if (dueSummary.error) return "Unable to load flashcard summary.";
    const d = dueSummary.data as { dueToday?: number; overdue?: number; learning?: number } | undefined;
    if (!d || typeof d.dueToday !== "number") return "—";
    return `Due today: ${d.dueToday} · Overdue: ${d.overdue} · Learning: ${d.learning}`;
  }, [accessUi.blockLockedCopyFlash, accessUi.neutralSummaryLine, dueSummary.data, dueSummary.error, dueSummary.isLoading, subscriber]);

  const dailyLine = useMemo(() => {
    if (!subscriber) return null;
    if (engagement.isLoading) return "Loading…";
    const raw = engagement.data as { nudges?: { headline?: string; body?: string }[] } | undefined;
    const nudges = raw?.nudges;
    if (!Array.isArray(nudges) || nudges.length === 0) return "No engagement nudges right now.";
    return nudges
      .slice(0, 2)
      .map((n) => n.body ?? n.headline)
      .filter(Boolean)
      .join("\n");
  }, [engagement.data, engagement.isLoading, subscriber]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const tasks: Promise<unknown>[] = [profile.refetch()];
      if (subscriber) {
        tasks.push(
          commandCenter.refetch(),
          dueSummary.refetch(),
          readiness.refetch(),
          engagement.refetch(),
        );
      }
      await Promise.all(tasks);
    } finally {
      setRefreshing(false);
    }
  }, [subscriber, profile, commandCenter, dueSummary, readiness, engagement]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.semanticBgBase }} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={[styles.pad, { paddingHorizontal: horizontalPad, paddingBottom: 48 }]}
        style={{ backgroundColor: palette.semanticBgBase }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} tintColor={palette.semanticBrand} />
        }
      >
        <Text style={[styles.h1, { color: palette.semanticTextPrimary }]} allowFontScaling>
          Home
        </Text>
        <Text style={[styles.sub, { color: palette.semanticTextSecondary }]} allowFontScaling>
          {origin ? `Web: ${origin}` : "Set EXPO_PUBLIC_APP_ORIGIN (or EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN) for API calls."}
        </Text>
        <Text
          style={[styles.badge, { color: online ? palette.semanticSuccess : palette.semanticWarning }]}
          allowFontScaling
        >
          {online ? "Online" : "Offline — retry when connected."}
        </Text>

        <Section title="Continue studying" palette={palette}>
          {accessUi.blockLockedCopyFlash ? (
            <Text style={[styles.muted, { color: palette.semanticTextSecondary }]} allowFontScaling>
              Checking your access…
            </Text>
          ) : !subscriber ? (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              {accessUi.neutralSummaryLine || "Full practice features use the website billing flow."}
            </Text>
          ) : commandCenter.isLoading ? (
            <Text style={{ color: palette.semanticTextSecondary }} allowFontScaling>
              Loading…
            </Text>
          ) : paywallCc ? (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              Upgrade on the website when you are ready — in-app purchases are not used for billing.
            </Text>
          ) : continueTitle ? (
            <Text style={{ color: palette.semanticTextPrimary }} allowFontScaling>
              {continueTitle}
            </Text>
          ) : (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              No primary next step from the API.
            </Text>
          )}
        </Section>

        <Section title="Next lesson" palette={palette}>
          {accessUi.blockLockedCopyFlash ? (
            <Text style={[styles.muted, { color: palette.semanticTextSecondary }]} allowFontScaling>
              —
            </Text>
          ) : !subscriber ? (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              —
            </Text>
          ) : nextLesson ? (
            <Text style={{ color: palette.semanticTextPrimary }} allowFontScaling>
              {nextLesson}
            </Text>
          ) : (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              No planned lesson from API.
            </Text>
          )}
        </Section>

        <Section title="Flashcard progress" palette={palette}>
          <Text style={{ color: palette.semanticTextPrimary }} allowFontScaling>
            {flashLine}
          </Text>
        </Section>

        <Section title="Practice readiness" palette={palette}>
          {accessUi.blockLockedCopyFlash ? (
            <Text style={[styles.muted, { color: palette.semanticTextSecondary }]} allowFontScaling>
              —
            </Text>
          ) : !subscriber ? (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              —
            </Text>
          ) : readiness.isLoading ? (
            <Text style={{ color: palette.semanticTextSecondary }} allowFontScaling>
              Loading…
            </Text>
          ) : readiness.error ? (
            <Text style={{ color: palette.semanticWarning }} allowFontScaling>
              Could not load readiness.
            </Text>
          ) : readinessLabel ? (
            <Text style={{ color: palette.semanticTextPrimary }} allowFontScaling>
              Pass likelihood tier: {readinessLabel}
            </Text>
          ) : (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              Insufficient data from API.
            </Text>
          )}
        </Section>

        <Section title="Daily progress & streak" palette={palette}>
          {accessUi.blockLockedCopyFlash ? (
            <Text style={[styles.muted, { color: palette.semanticTextSecondary }]} allowFontScaling>
              —
            </Text>
          ) : !subscriber ? (
            <Text style={[styles.muted, { color: palette.semanticTextMuted }]} allowFontScaling>
              Subscriber APIs only — no placeholder streak numbers.
            </Text>
          ) : (
            <Text style={{ color: palette.semanticTextPrimary, fontSize: 14 }} allowFontScaling>
              {dailyLine ?? "—"}
            </Text>
          )}
        </Section>

        <Section title="Pathway" palette={palette}>
          <Text style={{ color: palette.semanticTextPrimary }} allowFontScaling>
            {pathwayKey}
          </Text>
          <Pressable
            onPress={() => router.push("/(app)/pathway-change")}
            style={styles.link}
            accessibilityRole="button"
            accessibilityLabel="Change study pathway"
          >
            <Text style={{ color: palette.semanticBrand, fontWeight: "600" }} allowFontScaling>
              Change pathway
            </Text>
          </Pressable>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function HomeTab() {
  return (
    <ScreenErrorBoundary screen="tabs-home">
      <Suspense fallback={<LoadingFallback />}>
        <HomeInner />
      </Suspense>
    </ScreenErrorBoundary>
  );
}

const styles = StyleSheet.create({
  pad: { paddingVertical: 16, gap: 8 },
  h1: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  sub: { marginTop: 4, fontSize: 14 },
  badge: { marginTop: 8, fontWeight: "600" },
  section: { marginTop: 14, borderWidth: 1, borderRadius: 10, padding: 12, gap: 6 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  muted: { opacity: 0.85 },
  link: { marginTop: 8 },
});
