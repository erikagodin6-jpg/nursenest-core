import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { AppThemeProvider } from "@/components/theme/app-theme-provider";
import { nursenestAppIcons } from "@/lib/branding/app-icons";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-next",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nursenest.ca"),
  applicationName: "NurseNest",
  title: {
    default: "NurseNest",
    template: "%s | NurseNest",
  },
  icons: {
    icon: [
      { url: nursenestAppIcons.favicon, type: "image/png" },
      { url: nursenestAppIcons.svg, type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={plusJakartaSans.variable}
    >
      <head>
        <script
          id="nn-theme-prehydrate"
          dangerouslySetInnerHTML={{
            __html: `
try {
  var key = "nursenest-theme";
  var theme = localStorage.getItem(key) || document.cookie.replace(/(?:(?:^|.*;\\s*)nn-theme\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1") || "ocean";
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = /(midnight|dark|twilight|apex|storm|ink)/i.test(theme) ? "dark" : "light";
  }
} catch (_) {}
`,
          }}
        />
      </head>
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
