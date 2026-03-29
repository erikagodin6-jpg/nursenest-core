import type { Metadata } from "next";
import { PreNursingLandingClient } from "@/components/pre-nursing/pre-nursing-landing-client";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";

const dict = strings as Record<string, string>;

export const metadata: Metadata = {
  title: dict["preNursing.pageTitle"] ?? "Pre-Nursing Foundations",
  description:
    dict["preNursing.pageSubtitle"] ??
    "Interactive pre-nursing lessons in sciences, terminology, communication, and clinical reasoning.",
  alternates: { canonical: "/pre-nursing" },
};

export default function PreNursingLandingPage() {
  return <PreNursingLandingClient />;
}
