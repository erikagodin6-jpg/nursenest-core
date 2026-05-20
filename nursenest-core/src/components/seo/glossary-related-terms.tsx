"use client";

import type { NursingGlossaryTerm } from "@/lib/seo/nursing-glossary-registry";
import { glossaryGraphMetadataForTerm } from "@/lib/educational-graph/nursing-glossary-governance";
import { GovernedGlossaryTraversal } from "@/components/educational-graph/governed-glossary-traversal";

const GLOSSARY_HUB_PATH = "/nursing-glossary";

export function GlossaryRelatedTerms({ terms }: { terms: readonly NursingGlossaryTerm[] }) {
  if (terms.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Related terms</h2>
      <ul className="mt-3 flex flex-col gap-2 text-sm">
        {terms.map((r) => {
          const meta = glossaryGraphMetadataForTerm(r);
          return (
            <li key={r.slug}>
              <GovernedGlossaryTraversal
                termSlug={r.slug}
                topicSlug={r.topicSlug}
                competencyId={meta.competencyId}
                href={`${GLOSSARY_HUB_PATH}/${r.slug}`}
              >
                {r.term}
              </GovernedGlossaryTraversal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
