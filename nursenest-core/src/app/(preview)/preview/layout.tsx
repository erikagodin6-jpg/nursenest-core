import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NurseNest UI Preview",
  description: "Isolated NurseNest UI preview environment for design review only.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}

