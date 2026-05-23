import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import Script from "next/script";

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
// All favicon surfaces must use the approved pink favicon exported from
// app-icons. App Router metadata is the canonical icon declaration.

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
      { url: nursenestAppIcons.favicon, sizes: "64x64", type: "image/png" },
      { url: nursenestAppIcons.ico, sizes: "16x16 32x32", type: "image/x-icon" },
    ],
    apple: [{ url: nursenestAppIcons.apple, sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: nursenestAppIcons.favicon, type: "image/png" }],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
      data-theme={NURSENEST_DEFAULT_THEME}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://nursenest-images.tor1.cdn.digitaloceanspaces.com"
          crossOrigin="anonymous"
        />
        <meta
          name="google-site-verification"
          content="mgL8FKfo4i_Od-46msNNRvvD670iU2jXoc0UlOMiTUk"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--theme-page-bg)] text-[var(--theme-body-text)] [font-family:var(--font-sans)] antialiased [font-synthesis:none] [text-rendering:optimizeLegibility]">
        <Script id="nn-marketing-theme-seed" strategy="beforeInteractive">
          {marketingThemeBeforeInteractiveInlineScript()}
        </Script>
        <Script id="nn-navigation-intent-seed" strategy="beforeInteractive">
          {navigationIntentBeforeInteractiveInlineScript()}
        </Script>
        {children}
      </body>
    </html>
  );
}
