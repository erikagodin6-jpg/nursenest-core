import type { Metadata } from "next";

import { CasperMiniSimClient } from "@/components/casper/casper-mini-sim-client";

export const metadata: Metadata = {
  title: "Free CASPer Mini Simulation | NurseNest",
  description: "Practice a realistic CASPer mini simulation with professionalism and ethical reasoning prompts.",
  alternates: { canonical: "/casper/practice-test" },
};

export default function CasperPracticeTestPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12">
      <section className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          Free CASPer mini simulation
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          Practice reflective healthcare communication under realistic CASPer-style conditions.
        </h1>

        <p className="mt-6 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          This experience is intentionally calm, writing-focused, and professionalism-centered. It does not reuse NCLEX or CAT exam interaction patterns.
        </p>
      </section>

      <CasperMiniSimClient />
    </main>
  );
}
