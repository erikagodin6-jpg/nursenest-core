import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AppThemeProvider } from "@/components/theme/app-theme-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";

import { auth } from "@/lib/auth";
import { MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";

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

const siteUrl = MARKETING_SITE_ORIGIN || "https://www.nursenest.ca";

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

async function getSessionSafe() {
  if (process.env.NEXT_PHASE === "phase-production-build") return null;

  try {
    return await auth();
  } catch (error) {
    console.error("[root-layout] auth failed; continuing without session", error);
    return null;
  }
}

function SafeProviders({
  session,
  children,
}: {
  session: Awaited<ReturnType<typeof getSessionSafe>>;
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
  const session = await getSessionSafe();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
      data-theme={NURSENEST_DEFAULT_THEME}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--theme-page-bg)] text-[var(--theme-body-text)]">
        <SafeProviders session={session}>{children}</SafeProviders>
      </body>
    </html>
  );
}