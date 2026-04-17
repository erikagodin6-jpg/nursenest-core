import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AdminGlobalCommandPalette } from "@/components/admin/admin-global-command-palette";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { AppThemeProvider } from "@/components/theme/app-theme-provider";
import { marketingOpenGraphImageUrl } from "@/lib/marketing-assets";
import { MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";
import { NURSENEST_DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";
import "./globals.css";
/** Bundled with root layout CSS so marketing pages avoid a second render-blocking stylesheet (rules are dark-theme + `.nn-marketing-surface` scoped). */
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

const siteUrl = MARKETING_SITE_ORIGIN;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NurseNest | Healthcare Exam Prep",
    template: "%s | NurseNest",
  },
  description:
    "Premium NCLEX and global licensing prep for nurses worldwide—strongest pathways in the US and Canada (RPN, LVN/LPN, RN, NP), plus regional hubs across Asia and the Middle East.",
  icons: {
    icon: [
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
    title: "NurseNest | Healthcare Exam Prep",
    description:
      "Premium NCLEX and global licensing prep for nurses worldwide—strongest pathways in the US and Canada (RPN, LVN/LPN, RN, NP), plus regional hubs across Asia and the Middle East.",
    images: [
      {
        url: marketingOpenGraphImageUrl(),
        width: 1200,
        height: 630,
        alt: "NurseNest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NurseNest | Healthcare Exam Prep",
    description:
      "Premium NCLEX and global licensing prep for nurses worldwide—strongest pathways in the US and Canada (RPN, LVN/LPN, RN, NP), plus regional hubs across Asia and the Middle East.",
    images: [marketingOpenGraphImageUrl()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeBoot = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var d=${JSON.stringify(NURSENEST_DEFAULT_THEME)};var v=localStorage.getItem(k);if(v==null||v===""){v=d;localStorage.setItem(k,v);}document.documentElement.setAttribute("data-theme",v);}catch(e){}})();`;

  /** Duplicates the first layout rules from `globals.css` so the parser can paint before the main stylesheet finishes. */
  const rootCriticalCss = `html,body{overflow-x:hidden;max-width:100vw}*{box-sizing:border-box}body{margin:0}`;

  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
      data-theme="ocean"
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: rootCriticalCss }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--theme-page-bg)] text-[var(--theme-body-text)] transition-colors duration-200">
        <Script id="nursenest-theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <AppThemeProvider>
          <AuthSessionProvider>
            <AnalyticsProvider>
              {children}
              <AdminGlobalCommandPalette />
            </AnalyticsProvider>
          </AuthSessionProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
