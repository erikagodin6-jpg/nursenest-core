import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CASPer for Medical School Applicants | NurseNest",
  description: "Practice CASPer ethical reasoning, professionalism, communication, and situational judgment for medical school admissions.",
  alternates: { canonical: "/casper/medical-school" },
};

export default function CasperMedicalSchoolPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          Medical school CASPer preparation
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)] md:text-6xl">
          Build clear, ethical, patient-centered CASPer responses.
        </h1>

        <p className="mt-6 text-lg leading-8 text-[var(--semantic-text-secondary)]">
          Practice situational judgment prompts that emphasize professionalism, humility, accountability, communication, and balanced decision-making.
        </p>
      </section>

      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-[var(--semantic-text-primary)]">High-yield CASPer skills</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "Ethical prioritization",
            "Stakeholder awareness",
            "Respectful disagreement",
            "Confidentiality and trust",
            "Equity-minded reasoning",
            "Clear non-defensive communication",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-[var(--semantic-surface-secondary)] px-5 py-4 text-base text-[var(--semantic-text-primary)]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <Link href="/casper/practice-test" className="inline-flex w-fit rounded-2xl bg-[var(--theme-primary)] px-6 py-4 font-semibold text-white shadow-sm hover:opacity-90">
        Start the free mini simulation
      </Link>
    </main>
  );
}
