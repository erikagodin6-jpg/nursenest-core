import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CASPer Settings | NurseNest",
  description: "Configure CASPer practice preferences, simulation pacing, and reflective feedback settings.",
};

const settings = [
  ["Simulation pacing", "Moderate"],
  ["Reflection prompts", "Enabled"],
  ["Professionalism coaching", "Enabled"],
  ["Video-response practice", "Preview access"],
] as const;

export default function CasperSettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          CASPer settings
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-5xl">
          Customize your reflective practice experience.
        </h1>
      </section>

      <section className="grid gap-6">
        {settings.map(([label, value]) => (
          <article key={label} className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{label}</h2>
            </div>

            <span className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-primary)]">
              {value}
            </span>
          </article>
        ))}
      </section>
    </main>
  );
}
