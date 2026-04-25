import type { Metadata } from "next";
import type { Session } from "next-auth";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { auth } from "@/lib/auth";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { AppThemeProvider } from "@/components/theme/app-theme-provider";
import { MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";
import { NURSENEST_DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";
import "./globals.css";
import "./(marketing)/marketing-dark-utilities.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const BUILD_PHASE = "phase-production-build";

const siteUrl = MARKETING_SITE_ORIGIN;
const ROOT_LAYOUT_OPEN_GRAPH_IMAGE =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NurseNest | Canada-First Nursing Exam Prep for RN, RPN, NP & Allied Health",
    template: "%s | NurseNest",
  },
  description:
    "NurseNest offers Canada-first, globally relevant nursing and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams for RN, RPN, NP, NCLEX, and more.",
  icons: {
    icon: [
      { url: "/logos/arctic-frost-leaf.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "NurseNest",
    title: "NurseNest | Canada-First Nursing Exam Prep for RN, RPN, NP & Allied Health",
    description:
      "NurseNest offers Canada-first, globally relevant nursing and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams for RN, RPN, NP, NCLEX, and more.",
    images: [
      {
        url: ROOT_LAYOUT_OPEN_GRAPH_IMAGE,
        width: 1200,
        height: 630,
        alt: "NurseNest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NurseNest | Canada-First Nursing Exam Prep for RN, RPN, NP & Allied Health",
    description:
      "NurseNest offers Canada-first, globally relevant nursing and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams for RN, RPN, NP, NCLEX, and more.",
    images: [ROOT_LAYOUT_OPEN_GRAPH_IMAGE],
  },
  robots: process.env.NODE_ENV === "production" ? "index, follow" : "noindex",
};

function safeTrace(scope: string, message: string, meta?: Record<string, unknown>) {
  try {
    layoutStderrTrace(scope, message, meta ?? {});
  } catch {
    /* logging must never break root layout */
  }
}

async function getSessionSafe(): Promise<Session | null> {
  if (process.env.NEXT_PHASE === BUILD_PHASE) return null;

  try {
    return await auth();
  } catch (e) {
    safeTrace("root_layout", "auth() failed — continuing with null session", {
      route: "shared-root-layout",
      detail: e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200),
    });
    return null;
  }
}

function SafeProviders({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <AppThemeProvider>
      <AuthSessionProvider session={session}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </AuthSessionProvider>
    </AppThemeProvider>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  safeTrace("root_layout", "root layout start", { route: "shared-root-layout" });

  try {
    void import("@/lib/observability/deferred-render-trace")
      .then((m) => m.loadRenderTrace())
      .then((m) => m.renderTrace("root_layout", { route: "shared-root-layout" }))
      .catch(() => {});
  } catch {
    /* render tracing is optional */
  }

  const session = await getSessionSafe();

  const themeBoot = `(function(){try{var k=${JSON.stringify(
    THEME_STORAGE_KEY,
  )};var d=${JSON.stringify(
    NURSENEST_DEFAULT_THEME,
  )};var v=localStorage.getItem(k);if(v==null||v===""){v=d;localStorage.setItem(k,v);}document.documentElement.setAttribute("data-theme",v);}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
    NURSENEST_DEFAULT_THEME,
  )});}})();`;

  const rootCriticalCss =
    "html,body{overflow-x:hidden;max-width:100vw}*{box-sizing:border-box}body{margin:0;background:#f8fafc;color:#0f172a}";

  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
      data-theme={NURSENEST_DEFAULT_THEME}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: rootCriticalCss }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--theme-page-bg)] text-[var(--theme-body-text)] transition-colors duration-200">
        <Script id="nursenest-theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <SafeProviders session={session}>{children}</SafeProviders>
      </body>
    </html>
  );
}