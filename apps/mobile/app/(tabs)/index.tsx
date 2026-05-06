import { apiPaths, queryRoots, shouldShowUpgradeUi } from "@nursenest/mobile-shared";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Suspense, useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LoadingFallback } from "../../components/LoadingFallback";
import { ScreenErrorBoundary } from "../../components/ScreenErrorBoundary";
import { emitEngagementEvent } from "../../hooks/useAnalytics";
import { useNetworkHint } from "../../hooks/useNetworkHint";
import { apiJson, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
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
      <Text style={[styles.sectionTitle, { color: palette.semanticTextPrimary }]}>{title}</Text>
      {children}
    </View>
  );
}

function HomeInner() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const { online } = useNetworkHint();
  const { origin, cookieJar, signOut } = useAuth();
  const zPath = usePathwayStore((s) => s.pathwayId);

  useEffect(() => {
    emitEngagementEvent({
      name: "engagement.session_start",
      surface: "dashboard",
      clientTimestampMs: Date.now(),
    });
  }, []);

  const profile = useQuery({
    queryKey: queryRoots.personalProfile(zPath),
    queryFn: async () =>
      apiJson(origin, apiPaths.learnerPersonalProfile, cookieJar, { onUnauthorized: () => void signOut() }) as Profile,
    enabled: Boolean(origin && cookieJar),
  });

  const pathwayKey = profile.data?.learnerPath ?? zPath;
  const subscriber = Boolean(profile.data?.subscriberAccess);

  const commandCenter = useQuery({
    queryKey: queryRoots.commandCenter(pathwayKey),
    queryFn: async () => apiJson(origin, apiPaths.learnerCommandCenter, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: Boolean(origin && cookieJar && subscriber),
    retry: (n, err) => !(err instanceof ApiError && err.status === 403) && n < 2,
  });

  const dueSummary = useQuery({
    queryKey: queryRoots.flashcardsDueSummary(pathwayKey),
    queryFn: async () => apiJson(origin, apiPaths.flashcardsDueSummary, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: Boolean(origin && cookieJar && subscriber),
    retry: (n, err) => !(err instanceof ApiError && err.status === 403) && n < 2,
  });

  const readiness = useQuery({
    queryKey: queryRoots.readiness(pathwayKey),
    queryFn: async () => apiJson(origin, apiPaths.learnerReadiness, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: Boolean(origin && cookieJar && subscriber),
    retry: (n, err) => !(err instanceof ApiError && err.status === 403) && n < 2,
  });

  const engagement = useQuery({
    queryKey: queryRoots.engagementNudges(pathwayKey),
    queryFn: async () =>
      apiJson(origin, apiPaths.learnerEngagementNudges, cookieJar, { onUnauthorized: () => void signOut() }),
    enabled: Boolean(origin && cookieJar && subscriber),
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
    if (!subscriber) return "Subscribe to track flashcard due counts.";
    if (dueSummary.isLoading) return "Loading…";
    if (dueSummary.error) return "Unable to load flashcard summary.";
    const d = dueSummary.data as { dueToday?: number; overdue?: number; learning?: number } | undefined;
    if (!d || typeof d.dueToday !== "number") return "—";
    return `Due today: ${d.dueToday} · Overdue: ${d.overdue} · Learning: ${d.learning}`;
  }, [dueSummary.data, dueSummary.error, dueSummary.isLoading, subscriber]);

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

  return (
    <ScrollView contentContainerStyle={styles.pad} style={{ backgroundColor: palette.semanticBgBase }}>
      <Text style={[styles.h1, { color: palette.semanticTextPrimary }]}>Home</Text>
      <Text style={[styles.sub, { color: palette.semanticTextSecondary }]}>
        {origin ? `Web: ${origin}` : "Set EXPO_PUBLIC_APP_ORIGIN (or EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN) for API calls."}
      </Text>
      <Text style={[styles.badge, { color: online ? palette.semanticSuccess : palette.semanticWarning }]}>
        {online ? "Online" : "Offline — retry when connected."}
      </Text>

      <Section title="Continue studying" palette={palette}>
        {!subscriber ? (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>Locked without subscriber access (server).</Text>
        ) : commandCenter.isLoading ? (
          <Text style={{ color: palette.semanticTextSecondary }}>Loading…</Text>
        ) : paywallCc ? (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>Upgrade on web to unlock this feed.</Text>
        ) : continueTitle ? (
          <Text style={{ color: palette.semanticTextPrimary }}>{continueTitle}</Text>
        ) : (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>No primary next step from the API.</Text>
        )}
      </Section>

      <Section title="Next lesson" palette={palette}>
        {!subscriber ? (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>—</Text>
        ) : nextLesson ? (
          <Text style={{ color: palette.semanticTextPrimary }}>{nextLesson}</Text>
        ) : (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>No planned lesson from API.</Text>
        )}
      </Section>

      <Section title="Flashcard progress" palette={palette}>
        <Text style={{ color: palette.semanticTextPrimary }}>{flashLine}</Text>
      </Section>

      <Section title="Practice readiness" palette={palette}>
        {!subscriber ? (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>—</Text>
        ) : readiness.isLoading ? (
          <Text style={{ color: palette.semanticTextSecondary }}>Loading…</Text>
        ) : readiness.error ? (
          <Text style={{ color: palette.semanticWarning }}>Could not load readiness.</Text>
        ) : readinessLabel ? (
          <Text style={{ color: palette.semanticTextPrimary }}>Pass likelihood tier: {readinessLabel}</Text>
        ) : (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>Insufficient data from API.</Text>
        )}
      </Section>

      <Section title="Daily progress & streak" palette={palette}>
        {!subscriber ? (
          <Text style={[styles.muted, { color: palette.semanticTextMuted }]}>
            Subscriber APIs only — no placeholder streak numbers.
          </Text>
        ) : (
          <Text style={{ color: palette.semanticTextPrimary, fontSize: 14 }}>{dailyLine ?? "—"}</Text>
        )}
      </Section>

      <Section title="Pathway" palette={palette}>
        <Text style={{ color: palette.semanticTextPrimary }}>{pathwayKey}</Text>
        <Pressable onPress={() => router.push("/(app)/pathway-change")} style={styles.link}>
          <Text style={{ color: palette.semanticBrand, fontWeight: "600" }}>Change pathway</Text>
        </Pressable>
      </Section>
    </ScrollView>
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
  pad: { padding: 20, paddingBottom: 48, gap: 8 },
  h1: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  sub: { marginTop: 4, fontSize: 14 },
  badge: { marginTop: 8, fontWeight: "600" },
  section: { marginTop: 14, borderWidth: 1, borderRadius: 10, padding: 12, gap: 6 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  muted: { opacity: 0.85 },
  link: { marginTop: 8 },
});
