import type { Metadata } from "next";
import HomeRestoredClient from "@/components/marketing/home-restored-client";

export const metadata: Metadata = {
  title: "NurseNest — Healthcare Exam Prep | Nursing, NP & Allied Health",
  description:
    "Clinical exam prep with practice questions, lessons, and mock exams for RPN/LPN, RN, NCLEX, REx-PN, NP, and allied health — built for Canada and the US.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeRestoredClient />;
}
