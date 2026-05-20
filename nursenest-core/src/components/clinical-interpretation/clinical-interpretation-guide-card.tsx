"use client";

import type { ClinicalInterpretationEntry } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { GovernedInterpretationLink } from "@/components/educational-graph/governed-interpretation-link";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

type Props = {
  entry: ClinicalInterpretationEntry;
  graphStep: EduGraphStep;
};

export function ClinicalInterpretationGuideCard({ entry, graphStep }: Props) {
  return (
    <li>
      <GovernedInterpretationLink
        step={graphStep}
        className="block rounded-lg border border-[var(--semantic-border-soft)] p-4 hover:underline"
      >
        <span className="block text-sm font-medium text-primary">{entry.category.replace(/_/g, " ")}</span>
        <span className="mt-2 block font-semibold text-[var(--theme-heading-text)]">{entry.h1}</span>
        <span className="mt-2 block text-sm text-[var(--semantic-text-secondary)]">{entry.metaDescription}</span>
      </GovernedInterpretationLink>
    </li>
  );
}
