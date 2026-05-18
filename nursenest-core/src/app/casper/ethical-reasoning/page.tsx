import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CASPer Ethical Reasoning Guide | NurseNest",
  description: "Learn how to approach ethical reasoning, professionalism, stakeholder awareness, and communication in CASPer responses.",
  alternates: { canonical: "/casper/ethical-reasoning" },
};

export default function CasperEthicalReasoningPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer ethical reasoning
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          Strong CASPer responses balance empathy, accountability, and professionalism.
        </h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {[
          ["Identify stakeholders", "Consider who may be affected directly and indirectly before responding."],
          ["Avoid extreme responses", "Strong answers usually acknowledge nuance rather than reacting impulsively."],
          ["Communicate respectfully", "Professionalism matters even when addressing conflict or unsafe behaviour."],
          ["Prioritize safety", "Patient safety, fairness, and integrity should remain visible in your reasoning."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <h2 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
            <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
