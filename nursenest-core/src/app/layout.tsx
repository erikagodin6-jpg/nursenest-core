import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";

import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AppThemeProvider } from "@/components/theme/app-theme-provider";
import { marketingThemeBeforeInteractiveInlineScript } from "@/lib/theme/marketing-theme-before-interactive-seed";

import { nursenestAppIcons } from "@/lib/branding/app-icons";
import { MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";

// Global CSS — cascade order matters: Tailwind + @imports must come first.
import "./globals.css";
// Design tokens (:root custom properties) extracted from globals.css.
import "./styles/global/tokens.css";
// Global keyboard focus / accessibility rules.
import "./styles/global/accessibility.css";
import "./(marketing)/marketing-dark-utilities.css";

/**
 * DM Sans variable font — single WOFF2 covering wght 100–900.
 * Replaces 4 separate weight files (400/500/600/700) with one variable file,
 * cutting ~60–80 KB of font download on first visit and eliminating 3 of 4
 * preload link hints. `adjustFontFallback` generates a metrics-matched fallback
 * so text renders at the correct size before the font arrives (zero FOUT shift).
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans-next",
  adjustFontFallback: true,
});

const siteUrl = MARKETING_SITE_ORIGIN || "https://nursenest.ca";

const ROOT_LAYOUT_OPEN_GRAPH_IMAGE =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot1.png";

// IMPORTANT:
// The old arch favicon damaged brand consistency across tabs/bookmarks.
// All favicon surfaces use the canonical NurseNest leaf (same geometry as SiteBrandLogoMark).

function navigationIntentBeforeInteractiveInlineScript(): string {
  return `
(function () {
  window.__nnNavIntentSeedMounted = true;
  function mark(href) {
    if (!href || !document.documentElement) return;
    document.documentElement.dataset.nnNavPending = "true";
    try {
      window.dispatchEvent(new CustomEvent("nn:navigation-intent", {
        detail: { href: href, t: performance.now(), source: "beforeInteractive" }
      }));
    } catch (error) {}
    window.setTimeout(function () {
      if (document.documentElement.dataset.nnNavPending === "true") {
        delete document.documentElement.dataset.nnNavPending;
      }
    }, 8000);
  }
  function handle(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var target = event.target;
    if (target && target.nodeType !== 1) target = target.parentElement;
    var anchor = target && target.closest ? target.closest("header a[href]") : null;
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
    mark(anchor.getAttribute("href"));
  }
  window.addEventListener("pointerdown", handle, { capture: true, passive: true });
  window.addEventListener("click", handle, { capture: true, passive: true });
})();`;
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "NurseNest | Global Nursing Exam Prep — Canada-First Depth for RN, RPN, NP & Allied Health",
    template: "%s | NurseNest",
  },
  description:
    "NurseNest offers Canada-first, globally relevant nursing and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams for RN, RPN, NP, NCLEX, and more.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: nursenestAppIcons.ico, sizes: "48x48", type: "image/x-icon" },
      { url: nursenestAppIcons.svg, type: "image/svg+xml", sizes: "any" },
      { url: nursenestAppIcons.png192, type: "image/png", sizes: "192x192" },
      { url: nursenestAppIcons.png512, type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: nursenestAppIcons.apple, sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: nursenestAppIcons.ico, type: "image/x-icon" }],
    other: [{ rel: "mask-icon", url: nursenestAppIcons.mask, color: "#375f7a" }],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "NurseNest",
    title:
      "NurseNest | Global Nursing Exam Prep — Canada-First Depth for RN, RPN, NP & Allied Health",
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
    title:
      "NurseNest | Global Nursing Exam Prep — Canada-First Depth for RN, RPN, NP & Allied Health",
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
    (process.env.NEXTAUTH_SECRET &&
      process.env.NEXTAUTH_SECRET.trim().length > 0),
  );
  if (!hasSecret) return null;

  // Skip the auth DB call when no session cookie is present. Unauthenticated
  // visitors (the vast majority of marketing traffic) pay zero DB latency;
  // the client-side SessionProvider fetches the session via /api/auth/session
  // on hydration if needed. Authenticated users still trigger the full auth()
  // call because a session cookie is present.
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const hasSession =
      jar.has("authjs.session-token") ||
      jar.has("__Secure-authjs.session-token") ||
      jar.has("next-auth.session-token") ||
      jar.has("__Secure-next-auth.session-token");
    if (!hasSession) return null;
  } catch {
    // Can't read cookies (e.g. static export) - fall through to auth().
  }

  try {
    const { auth } = await import("@/lib/auth");
    return await auth();
  } catch (error) {
    console.error(
      "[root-layout] auth failed; continuing without session",
      error,
    );
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
      <body className="min-h-full flex flex-col bg-[var(--theme-page-bg)] text-[var(--theme-body-text)] [font-family:var(--font-sans)] antialiased [font-synthesis:none] [text-rendering:optimizeLegibility]">
        <Script id="nn-marketing-theme-seed" strategy="beforeInteractive">
          {marketingThemeBeforeInteractiveInlineScript()}
        </Script>
        <Script id="nn-navigation-intent-seed" strategy="beforeInteractive">
          {navigationIntentBeforeInteractiveInlineScript()}
        </Script>
        <SafeProviders session={session}>{children}</SafeProviders>
      </body>
    </html>
  );
}
