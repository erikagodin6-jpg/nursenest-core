import type { RetentionMemoryState } from "@/lib/learning-science/adaptive-retention-engine";
import { updateRetentionMemory } from "@/lib/learning-science/adaptive-retention-engine";

export function buildRetentionDemoStates(now = new Date()): readonly RetentionMemoryState[] {
  const events = [
    {
      conceptId: "ECG: atrial flutter vs SVT",
      surface: "ecg" as const,
      outcome: "incorrect" as const,
      confidence: "high" as const,
      misconception: "Learner treats any narrow tachycardia near 150 as SVT and misses 2:1 flutter.",
      occurredAt: now,
    },
    {
      conceptId: "ECG: Mobitz I vs Mobitz II",
      surface: "ecg" as const,
      outcome: "incorrect" as const,
      confidence: "medium" as const,
      misconception: "Learner notices dropped beats but does not inspect PR behavior.",
      occurredAt: now,
    },
    {
      conceptId: "Pharmacology: beta blockers and asthma/COPD caution",
      surface: "practice_question" as const,
      outcome: "correct" as const,
      confidence: "low" as const,
      misconception: "Learner answered correctly but lacks durable confidence.",
      occurredAt: now,
    },
    {
      conceptId: "Maternal-newborn: late decelerations priority response",
      surface: "simulation" as const,
      outcome: "incorrect" as const,
      confidence: "high" as const,
      misconception: "Learner memorizes deceleration names but misses uteroplacental insufficiency management.",
      occurredAt: now,
    },
    {
      conceptId: "Prioritization: unstable before stable",
      surface: "cat" as const,
      outcome: "correct" as const,
      confidence: "high" as const,
      occurredAt: now,
    },
  ];

  return events.map((event) => updateRetentionMemory(null, event));
}
