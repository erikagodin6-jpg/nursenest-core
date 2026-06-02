"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClinicalSkillDefinition } from "@/lib/clinical-skills/clinical-skills-catalog";
import { getClinicalSkillEnrichment } from "@/lib/clinical-skills/clinical-skills-enrichment";
import {
  readClinicalSkillCompetency,
  writeClinicalSkillCompetency,
  type ClinicalSkillLessonCompetency,
} from "@/lib/clinical-skills/clinical-skills-lesson-competency.client";
import { ClinicalSkillsProcedureStepCard } from "@/components/clinical-skills/clinical-skills-procedure-step-card";
import { cn } from "@/lib/utils";

export function ClinicalSkillsProcedureWorkspace({
  skill,
  onCompetencyChange,
}: {
  skill: ClinicalSkillDefinition;
  onCompetencyChange?: (c: ClinicalSkillLessonCompetency) => void;
}) {
  const enrichment = useMemo(() => getClinicalSkillEnrichment(skill), [skill]);
  const [competency, setCompetency] = useState<ClinicalSkillLessonCompetency>(() => readClinicalSkillCompetency(skill.slug));
  const [activeIndex, setActiveIndex] = useState(0);

  const persist = useCallback(
    (next: ClinicalSkillLessonCompetency) => {
      setCompetency(next);
      writeClinicalSkillCompetency(skill.slug, next);
      onCompetencyChange?.(next);
    },
    [onCompetencyChange, skill.slug],
  );

  useEffect(() => {
    const loaded = readClinicalSkillCompetency(skill.slug);
    setCompetency(loaded);
    onCompetencyChange?.(loaded);
  }, [onCompetencyChange, skill.slug]);

  const toggleStep = (index: number) => {
    const set = new Set(competency.completedStepIndices);
    if (set.has(index)) set.delete(index);
    else set.add(index);
    persist({ ...competency, completedStepIndices: [...set].sort((a, b) => a - b) });
  };

  const scrollToStep = (index: number) => {
    setActiveIndex(index);
    document.getElementById(`clinical-skill-step-${skill.slug}-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="nn-clinical-skills-procedure-workspace">
      <nav className="nn-clinical-skills-procedure-workspace__nav" aria-label="Procedure steps">
        <p className="nn-clinical-skills-procedure-workspace__nav-label">Procedure flow</p>
        <ol>
          {enrichment.steps.map((step, i) => {
            const done = competency.completedStepIndices.includes(i);
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => scrollToStep(i)}
                  className={cn(
                    "nn-clinical-skills-procedure-workspace__nav-item",
                    activeIndex === i && "nn-clinical-skills-procedure-workspace__nav-item--active",
                    done && "nn-clinical-skills-procedure-workspace__nav-item--done",
                  )}
                  aria-current={activeIndex === i ? "step" : undefined}
                >
                  <span className="nn-clinical-skills-procedure-workspace__nav-num">{i + 1}</span>
                  <span className="truncate">{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="nn-clinical-skills-procedure-workspace__steps space-y-4">
        {enrichment.steps.map((step, i) => (
          <ClinicalSkillsProcedureStepCard
            key={`${skill.slug}-step-${i}`}
            id={`clinical-skill-step-${skill.slug}-${i}`}
            step={step}
            index={i}
            completed={competency.completedStepIndices.includes(i)}
            active={activeIndex === i}
            onToggleComplete={() => toggleStep(i)}
          />
        ))}
      </div>
    </div>
  );
}
