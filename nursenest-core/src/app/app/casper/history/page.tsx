import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CASPer History | NurseNest",
  description: "Review previous CASPer practice sessions and professionalism growth trends.",
};

const sampleHistory = [
  {
    id: "mini-preview",
    title: "Mini simulation preview",
    date: "Recently completed",
    rating: "Solid",
    focus: "Stakeholder awareness",
  },
  {
    id: "communication-drill",
    title: "Communication clarity drill",
    date: "Practice template",
    rating: "Developing",
    focus: "Concise action planning",
  },
] as const;

export default function CasperHistoryPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer history
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-5xl">
          Review previous sessions and track judgment growth.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--semantic-text-secondary)]">
          This page is scaffolded for persisted learner history once the CASPer Prisma models are connected.
        </p>
      </section>

      <section className="grid gap-6">
        {sampleHistory.map((session) => (
          <article
            key={session.id}
            className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8"
          >
            <div>
              <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">{session.date}</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--semantic-text-primary)]">{session.title}</h2>
              <p className="mt-3 text-base leading-7 text-[var(--semantic-text-secondary)]">
                Focus: {session.focus}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-primary)]">
                {session.rating}
              </span>

              <Link
                href={`/app/casper/review/${session.id}`}
                className="rounded-2xl border border-[var(--semantic-border-primary)] px-5 py-3 font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-surface-secondary)]"
              >
                Review
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
