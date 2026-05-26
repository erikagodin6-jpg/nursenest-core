import type { Metadata, Viewport } from "next";
<<<<<<< HEAD
import { Plus_Jakarta_Sans } from "next/font/google";
=======
import { Inter } from "next/font/google";
>>>>>>> 9c5fe4f85 (refactor(auth): standardize session prompts and user experience across learner pages)
import type { ReactNode } from "react";

import "./globals.css";

<<<<<<< HEAD
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600"],
=======
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-next",
>>>>>>> 9c5fe4f85 (refactor(auth): standardize session prompts and user experience across learner pages)
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
<<<<<<< HEAD
    <html
      lang="en"
      suppressHydrationWarning
      className={plusJakartaSans.variable}
    >
=======
    <html lang="en" suppressHydrationWarning className={inter.variable}>
>>>>>>> 9c5fe4f85 (refactor(auth): standardize session prompts and user experience across learner pages)
      <body>{children}</body>
    </html>
  );
}
