import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type EducationalCognitionContext = {
  pathwayId: string | null;
  learnerState?: RnLearnerStateSnapshot | null;
  measurement?: {
    learnerStateReason?: string | null;
  } | null;
};
