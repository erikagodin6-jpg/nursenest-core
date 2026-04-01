import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { AppThemeProvider } from "@/components/theme/app-theme-provider";
import { marketingOpenGraphImageUrl } from "@/lib/marketing-assets";
import { MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";
import { THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";
import "./globals.css";

/** Variable cut = one font request vs four static weights; `font-weight` utilities still map to the same axis. */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: "variable",
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
    "Stable, premium nursing exam prep for CA and US learners across RPN, LVN/LPN, RN, and NP pathways.",
  icons: {
    icon: [{ url: `${siteUrl}/favicon.ico`, sizes: "any" }],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "NurseNest",
    title: "NurseNest | Healthcare Exam Prep",
    description:
      "Stable, premium nursing exam prep for CA and US learners across RPN, LVN/LPN, RN, and NP pathways.",
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
      "Stable, premium nursing exam prep for CA and US learners across RPN, LVN/LPN, RN, and NP pathways.",
    images: [marketingOpenGraphImageUrl()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeBoot = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var v=localStorage.getItem(k);if(v==null||v===""){v="lavender";localStorage.setItem(k,v);}document.documentElement.setAttribute("data-theme",v);}catch(e){}})();`;

  /** Duplicates the first layout rules from `globals.css` so the parser can paint before the main stylesheet finishes. */
  const rootCriticalCss = `html,body{overflow-x:hidden;max-width:100vw}*{box-sizing:border-box}body{margin:0}`;

  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
      data-theme="lavender"
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
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </AuthSessionProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
