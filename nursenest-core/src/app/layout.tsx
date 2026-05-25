import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans-next",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nursenest.ca"),
  applicationName: "NurseNest",
  title: {
    default: "NurseNest",
    template: "%s | NurseNest",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
