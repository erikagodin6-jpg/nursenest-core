import type { Metadata } from "next";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

import {
  createTraceInfo,
  endBuildTrace,
  noteBuildRequestApiUsage,
  startBuildTrace,
  traceLayout,
  traceProvider,
  withBuildTrace,
} from "@/build/tracing";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { ActivityPerformanceVitals } from "@/components/observability/activity-performance-vitals";
import { LearnerCacheWarmer } from "@/components/observability/learner-cache-warmer";
import { readOptionalMarketingRegionToggleForCountry } from "@/lib/marketing/read-optional-marketing-region-cookie.server";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { readOptionalCountryPreferenceFromCookie } from "@/lib/region/read-optional-country-preference-cookie.server";
import { countryPreferenceToNursenestRegion } from "@/lib/region/country-preference";
import { CountryPreferenceRoot } from "@/lib/region/use-country-preference";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import { isBuildPhase } from "@/lib/runtime/is-build-phase";

/** Subscriber app — not for public search indexing. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const getSessionTraceInfo = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getSessionSafe",
  path: "src/app/(app)/layout.tsx",
  phase: "layout",
});

const authTraceInfo = createTraceInfo(import.meta, {
  kind: "provider",
  name: "auth()",
  path: "src/app/(app)/layout.tsx",
  phase: "auth",
});

async function getSessionSafe(): Promise<Session | null> {
  const trace = startBuildTrace(getSessionTraceInfo);

  let session: Session | null = null;
  let skippedReason: string | undefined;

  try {
    if (process.env.NN_UI_PREVIEW_MODE === "1") {
      skippedReason = "preview-mode";
      return null;
    }
    if (isBuildPhase()) {
      skippedReason = "build-phase";
      return null;
    }

    const hasSecret = Boolean(
      (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
      (process.env.NEXTAUTH_SECRET &&
        process.env.NEXTAUTH_SECRET.trim().length > 0),
    );
    if (!hasSecret) {
      skippedReason = "no-auth-secret";
      return null;
    }

    try {
      const { cookies } = await import("next/headers");
      noteBuildRequestApiUsage({ api: "cookies", module: "next/headers", path: "src/app/(app)/layout.tsx" });
      const jar = await cookies();
      const hasSession =
        jar.has("authjs.session-token") ||
        jar.has("__Secure-authjs.session-token") ||
        jar.has("next-auth.session-token") ||
        jar.has("__Secure-next-auth.session-token");
      if (!hasSession) {
        skippedReason = "no-session-cookie";
        return null;
      }
    } catch {
      // Can't read cookies (e.g. static export) - fall through to auth().
    }

    try {
      session = await withBuildTrace(authTraceInfo, async () => {
        const { auth } = await import("@/lib/auth");
        return auth();
      });
      return session;
    } catch (error) {
      console.error("[(app)/layout] auth failed; continuing without session", error);
      skippedReason = "auth-error";
      return null;
    }
  } finally {
    endBuildTrace(trace, {
      hasSession: Boolean(session),
      skippedReason,
    });
  }
}

const AppProviders = traceProvider(
  import.meta,
  async function AppProviders({
    session,
    children,
  }: {
    session: Awaited<ReturnType<typeof getSessionSafe>>;
    children: ReactNode;
  }) {
    const [marketingRegionCookie, serverCountryPreference] = await Promise.all([
      readOptionalMarketingRegionToggleForCountry(),
      readOptionalCountryPreferenceFromCookie(),
    ]);
    const serverRegion: MarketingRegionToggle =
      marketingRegionCookie ?? (serverCountryPreference ? countryPreferenceToNursenestRegion(serverCountryPreference) : "CA");
    const trustClientPersistedRegion = marketingRegionCookie !== undefined;

    return (
      <NursenestRegionRoot serverRegion={serverRegion} trustClientPersistedRegion={trustClientPersistedRegion}>
        <CountryPreferenceRoot serverCountry={serverCountryPreference}>
          <AuthSessionProvider session={session}>
            <ActivityPerformanceVitals />
            <LearnerCacheWarmer enabled={Boolean(session?.user?.id)} />
            {children}
          </AuthSessionProvider>
        </CountryPreferenceRoot>
      </NursenestRegionRoot>
    );
  },
  { name: "AppProviders" },
);

const AppGroupLayout = traceLayout(
  import.meta,
  async function AppGroupLayout({ children }: { children: ReactNode }) {
    if (isBuildPhase()) {
      return children;
    }

    const session = await getSessionSafe();

    return <AppProviders session={session}>{children}</AppProviders>;
  },
  { name: "AppGroupLayout" },
);

export default AppGroupLayout;
