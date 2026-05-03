import Link from "next/link";

export const metadata = {
  title: "ECG Video Quiz | NurseNest",
  description: "Practice ECG and telemetry rhythm recognition with short clinical clips, rationales, and linked lessons.",
};

export default function EcgVideoQuizHubPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">ECG recognition</p>
        <h1 className="text-3xl font-bold tracking-normal text-[var(--semantic-text-primary)] sm:text-4xl">
          ECG video quiz
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">
          Identify rhythms from short telemetry clips, then use practice mode to review rationales, recognition clues,
          and linked ECG lessons. CAT and exam modes keep teaching feedback hidden during the active exam.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Practice ECG clips", "Answer with rationale and recognition clues after submission.", "/app/questions/bank?topic=ECG"],
          ["Review linked lessons", "Reinforce rhythm recognition and nursing priorities.", "/app/lessons?topic=ECG"],
          ["Use exam mode safely", "CAT sessions show clips without rationales or answer statistics until the right review phase.", "/app/practice-tests"],
        ].map(([title, body, href]) => (
          <Link
            key={title}
            href={href}
            className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm hover:bg-[var(--semantic-panel-muted)]"
          >
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
