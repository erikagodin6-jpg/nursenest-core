import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CASPer for Social Work Programs | NurseNest",
  description: "Prepare for social work CASPer scenarios involving ethics, advocacy, equity, communication, and conflict resolution.",
  alternates: { canonical: "/casper/social-work" },
};

export default function CasperSocialWorkPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          Social work CASPer preparation
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          Practice advocacy-centered ethical reasoning for CASPer.
        </h1>

        <p className="mt-6 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Explore scenarios focused on equity, communication, professionalism, empathy, boundaries, and psychologically safe conflict resolution.
        </p>
      </section>

      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-[var(--semantic-text-primary)]">Scenario themes</h2>

        <div className="mt-8 flex flex-wrap gap-4">
          {[
            "Advocacy",
            "Bias awareness",
            "Cultural humility",
            "Professional boundaries",
            "Trauma-informed communication",
            "Collaborative problem-solving",
          ].map((item) => (
            <span key={item} className="rounded-full border border-[var(--semantic-border-primary)] px-5 py-3 text-sm font-medium text-[var(--semantic-text-primary)]">
              {item}
            </span>
          ))}
        </div>
      </section>

      <Link href="/casper/practice-test" className="inline-flex w-fit rounded-2xl bg-[var(--theme-primary)] px-6 py-4 font-semibold text-white shadow-sm hover:opacity-90">
        Start the free mini simulation
      </Link>
    </main>
  );
}
