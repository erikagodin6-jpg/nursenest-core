import Link from "next/link";
import type { Metadata } from "next";

import { CASPER_FREE_MINI_TEST } from "@/lib/casper/casper-scenarios";

export const metadata: Metadata = {
  title: "CASPer Sessions | NurseNest",
  description: "Launch CASPer mini simulations, full-length sessions, and reflective professionalism practice.",
};

const sessionTypes = [
  {
    title: "Free mini simulation",
    body: "A short starter session with reflective prompts and professionalism-focused review.",
    stations: CASPER_FREE_MINI_TEST.length,
    href: "/casper/practice-test",
    availability: "Free",
  },
  {
    title: "Full-length CASPer simulation",
    body: "A longer timed session designed for admissions-season endurance and judgment practice.",
    stations: 12,
    href: "/pricing?product=casper",
    availability: "Premium",
  },
  {
    title: "Weakness-targeted drill",
    body: "Focused practice for communication clarity, stakeholder awareness, or conflict resolution.",
    stations: 6,
    href: "/pricing?product=casper",
    availability: "Premium",
  },
] as const;

export default function CasperSessionsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer sessions
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-5xl">
          Choose a reflective simulation format.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Sessions are designed around calm writing, ethical reasoning, stakeholder awareness, and professional communication rather than answer memorization.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {sessionTypes.map((session) => (
          <article key={session.title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                {session.availability}
              </span>
              <span className="text-sm font-medium text-[var(--semantic-text-secondary)]">
                {session.stations} stations
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-[var(--semantic-text-primary)]">
              {session.title}
            </h2>

            <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
              {session.body}
            </p>

            <Link href={session.href} className="mt-8 inline-flex rounded-2xl border border-[var(--semantic-border-primary)] px-5 py-3 font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-secondary)]">
              {session.availability === "Free" ? "Start session" : "Unlock session"}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
