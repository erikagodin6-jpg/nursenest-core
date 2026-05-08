import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AppThemeProvider } from "@/components/theme/app-theme-provider";

import { MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";

import "./globals.css";
import "./(marketing)/marketing-dark-utilities.css";

/** Host-loaded DM Sans (swap + size-adjusted fallback) — exposed as `--font-dm-sans-next` on `<html>`. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans-next",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-v2.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon-v2.ico"],
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
  if (process.env.NN_UI_PREVIEW_MODE === "1") return null;
  if (process.env.NEXT_PHASE === "phase-production-build") return null;
  const hasSecret = Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
      (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0),
  );
  if (!hasSecret) return null;

  try {
    const { auth } = await import("@/lib/auth");
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
      <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
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
