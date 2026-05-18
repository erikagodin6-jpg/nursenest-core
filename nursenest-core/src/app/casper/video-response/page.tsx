import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CASPer Video Response Practice | NurseNest",
  description: "Prepare for CASPer video response prompts with communication, structure, professionalism, and reflective practice guidance.",
  alternates: { canonical: "/casper/video-response" },
};

export default function CasperVideoResponsePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer video response practice
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          Practice calm, structured, professional video responses.
        </h1>

        <p className="mt-6 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Build a response style that is clear, human, reflective, and grounded in ethical reasoning rather than memorized scripts.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {[
          ["Structure", "Open with the issue, name the stakeholders, explain your reasoning, and close with a balanced action."],
          ["Tone", "Sound respectful and thoughtful without becoming robotic or overly rehearsed."],
          ["Timing", "Practice concise answers that still show empathy, accountability, and judgment."],
          ["Reflection", "Acknowledge uncertainty and explain what information you would seek before acting."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
            <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">{body}</p>
          </article>
        ))}
      </section>

      <Link href="/casper/practice-test" className="inline-flex w-fit rounded-2xl bg-[var(--theme-primary)] px-6 py-4 font-semibold text-white shadow-sm hover:opacity-90">
        Practice with the free mini simulation
      </Link>
    </main>
  );
}
