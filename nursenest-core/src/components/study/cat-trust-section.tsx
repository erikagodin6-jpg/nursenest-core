import { ShieldCheck } from "lucide-react";

const TRUST_POINTS = [
  "Built to match real NCLEX logic",
  "Adaptive difficulty based on your performance",
  "Used to measure exam readiness, not memorization",
];

export function CatTrustSection() {
  return (
    <section className="mt-6" aria-label="Why trust NurseNest CAT">
      <div className="rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-6 sm:gap-8">
          <ShieldCheck
            className="h-10 w-10 shrink-0 text-[var(--semantic-brand)] opacity-80"
            strokeWidth={1.5}
            aria-hidden
          />
          <ul className="m-0 flex flex-1 flex-col gap-3 p-0 list-none sm:flex-row sm:flex-wrap sm:gap-6">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2.5 text-sm font-medium text-[var(--theme-heading-text)]"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-brand)]"
                  aria-hidden
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
