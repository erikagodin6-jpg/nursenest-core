import type { PerioperativeQuestion } from "./types";
import { preoperativeAssessmentQuestions } from "./preoperative-assessment";
import { preoperativeBatch2Questions } from "./preoperative-batch2";
import { intraoperativeCareQuestions } from "./intraoperative-care";
import { intraoperativeBatch2Questions } from "./intraoperative-batch2";
import { postoperativeCareQuestions } from "./postoperative-care";
import { postoperativeBatch2Questions } from "./postoperative-batch2";
import { sterilizationDisinfectionQuestions } from "./sterilization-disinfection";
import { sterilizationBatch2Questions } from "./sterilization-batch2";
import { equipmentSuppliesQuestions } from "./equipment-supplies";
import { equipmentBatch2Questions } from "./equipment-batch2";
import { emergencySituationsQuestions } from "./emergency-situations";
import { emergencyBatch2Questions } from "./emergency-batch2";
import { infectionPreventionQuestions } from "./infection-prevention";
import { infectionBatch2Questions } from "./infection-batch2";
import { patientSafetyQuestions } from "./patient-safety";
import { patientSafetyBatch2Questions } from "./patient-safety-batch2";
import { professionalAccountabilityQuestions } from "./professional-accountability";
import { professionalBatch2Questions } from "./professional-batch2";
import { managementPersonnelQuestions } from "./management-personnel";
import { managementBatch2Questions } from "./management-batch2";
import { additionalQuestions } from "./additional-questions";

export const allPerioperativeQuestions: PerioperativeQuestion[] = [
  ...preoperativeAssessmentQuestions,
  ...preoperativeBatch2Questions,
  ...intraoperativeCareQuestions,
  ...intraoperativeBatch2Questions,
  ...postoperativeCareQuestions,
  ...postoperativeBatch2Questions,
  ...sterilizationDisinfectionQuestions,
  ...sterilizationBatch2Questions,
  ...equipmentSuppliesQuestions,
  ...equipmentBatch2Questions,
  ...emergencySituationsQuestions,
  ...emergencyBatch2Questions,
  ...infectionPreventionQuestions,
  ...infectionBatch2Questions,
  ...patientSafetyQuestions,
  ...patientSafetyBatch2Questions,
  ...professionalAccountabilityQuestions,
  ...professionalBatch2Questions,
  ...managementPersonnelQuestions,
  ...managementBatch2Questions,
  ...additionalQuestions,
];

export type { PerioperativeQuestion };
