"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { safeHomepageMarketingCopy } from "@/lib/marketing/homepage-safe-copy";

const MODULE_IDS = [
  "nclexRn",
  "nclexPn",
  "rexPn",
  "np",
  "flashcards",
  "medMath",
  "weakArea",
] as const;

const STUDENTS_FB: Record<string, string> = {
  "home.landing.studentsStudying.title": "How learners use NurseNest in real weeks",
  "home.landing.studentsStudying.sub":
    "Representative study patterns from NCLEX-RN, NCLEX-PN, REx-PN, NP, flashcards, med math, and weak-area review.",
  "home.landing.studentsStudying.nclexRn.title": "NCLEX-RN questions",
  "home.landing.studentsStudying.nclexRn.body": "Mixed systems with option-by-option rationales after each attempt.",
  "home.landing.studentsStudying.nclexPn.title": "NCLEX-PN practice exams",
  "home.landing.studentsStudying.nclexPn.body": "Timed runs for US LPN candidates who want pacing under exam rules.",
  "home.landing.studentsStudying.rexPn.title": "REx-PN lessons",
  "home.landing.studentsStudying.rexPn.body": "Canadian RPN scope, wording, and lesson paths aligned to REx-PN.",
  "home.landing.studentsStudying.np.title": "NP review",
  "home.landing.studentsStudying.np.body": "Board-focused cases without drifting into unrelated specialties.",
  "home.landing.studentsStudying.flashcards.title": "Flashcards",
  "home.landing.studentsStudying.flashcards.body": "Same-topic cards after a bank block, without a separate stack of apps.",
  "home.landing.studentsStudying.medMath.title": "Med math",
  "home.landing.studentsStudying.medMath.body": "Drips and conversions with immediate feedback next to clinical tools.",
  "home.landing.studentsStudying.weakArea.title": "Weak-area review",
  "home.landing.studentsStudying.weakArea.body": "Signals from practice that point review back to the right topic.",
};

function pickStudentsFb(key: string): string {
  return STUDENTS_FB[key] ?? "";
}

/**
 * Static study examples (not a live feed). Follows the testimonials block.
 */
export function HomeStudentsStudyingSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="border-t border-[var(--trust-surface-border)] bg-[var(--trust-surface)] pt-7 pb-10 md:pt-9 md:pb-12"
      aria-labelledby="home-students-studying-heading"
      data-testid="section-home-students-studying"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-6 max-w-3xl text-center md:mb-8">
          <h2 id="home-students-studying-heading" className="nn-marketing-h2 text-balance">
            {safeHomepageMarketingCopy(
              t,
              "home.landing.studentsStudying.title",
              pickStudentsFb("home.landing.studentsStudying.title"),
            )}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {safeHomepageMarketingCopy(
              t,
              "home.landing.studentsStudying.sub",
              pickStudentsFb("home.landing.studentsStudying.sub"),
            )}
          </p>
        </header>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULE_IDS.map((id) => {
            const tk = `home.landing.studentsStudying.${id}.title`;
            const bk = `home.landing.studentsStudying.${id}.body`;
            return (
              <li
                key={id}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-ribbon)] px-4 py-3.5 text-left shadow-sm"
              >
                <p className="nn-marketing-body-sm font-medium text-[var(--theme-heading-text)]">
                  {safeHomepageMarketingCopy(t, tk, pickStudentsFb(tk))}
                </p>
                <p className="nn-marketing-caption mt-1.5 text-[var(--theme-muted-text)]">
                  {safeHomepageMarketingCopy(t, bk, pickStudentsFb(bk))}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
