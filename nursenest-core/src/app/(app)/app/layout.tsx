import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import {
  createTraceInfo,
  traceLayout,
  traceProvider,
  withBuildTrace,
} from "@/build/tracing";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { isBuildPhase } from "@/lib/runtime/is-build-phase";

/** Shared marketing/locale dictionary for all `/app/*` routes (learner shell, exams, practice). */
export const dynamic = "force-dynamic";

const getStaffSessionSafe = traceProvider(
  import.meta,
  async function getStaffSessionSafe() {
    if (isBuildPhase()) return null;
    try {
      const { getStaffSession } = await import("@/lib/auth/staff-session");
      return await getStaffSession();
    } catch {
      return null;
    }
  },
  { name: "AppSegmentLayout.getStaffSessionSafe" },
);

/** Learner app is auth-gated; keep subscriber lesson/question payloads out of search indexes even when metadata is missing on a leaf route. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const learnerMarketingBundleTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getLearnerShellMarketingBundle",
  phase: "layout",
});

const adminPaletteTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "AdminGlobalCommandPalette",
  phase: "layout",
});

const AppSegmentLayout = traceLayout(
  import.meta,
  async function AppSegmentLayout({ children }: { children: React.ReactNode }) {
  if (isBuildPhase()) {
    return <>{children}</>;
  }
  let locale = "en";
  let messages: Record<string, string> = {};
  let fallbackMessages: Record<string, string> | undefined = undefined;

  try {
    const bundle = await withBuildTrace(learnerMarketingBundleTrace, async () => {
      const { getLearnerShellMarketingBundle } = await import("@/lib/learner/learner-marketing-server");
      return getLearnerShellMarketingBundle();
    });
    locale = bundle.locale;
    messages = bundle.messages;
    fallbackMessages = bundle.fallbackMessages;
  } catch (e) {
    console.error("[app-segment-layout] failed to load learner marketing bundle", {
      error: e instanceof Error ? e.message : String(e),
    });
    // Fall through with English defaults — the learner app renders without translations rather than crashing.
  }

  let adminPalette: ReactNode = null;
  try {
    const staff = await withBuildTrace(adminPaletteTrace, async () => getStaffSessionSafe());
    if (staff) {
      const paletteTrace = createTraceInfo(import.meta, {
        kind: "provider",
        name: "AdminGlobalCommandPaletteImport",
        phase: "layout",
      });
      await withBuildTrace(paletteTrace, async () => {
        const { AdminGlobalCommandPalette } = await import("@/components/admin/admin-global-command-palette");
        adminPalette = (
          <Suspense fallback={null}>
            <AdminGlobalCommandPalette />
          </Suspense>
        );
      });
    }
  } catch (e) {
    console.error("[app-segment-layout] staff session / admin palette skipped", {
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return (
    <MarketingI18nProvider locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      {children}
      {adminPalette}
    </MarketingI18nProvider>
  );
  },
  { name: "AppSegmentLayout" },
);

export default AppSegmentLayout;
