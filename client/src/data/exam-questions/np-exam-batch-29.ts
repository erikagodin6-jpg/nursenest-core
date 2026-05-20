import type { ExamQuestion } from "./types";

export const npExamBatch29Questions: ExamQuestion[] = [
  {
    q: "A 78-year-old female presents after a witnessed fall. She is on warfarin for atrial fibrillation. She had a brief loss of consciousness and hit her head. Neurological examination is normal. CT head is negative for acute hemorrhage. What is the appropriate management?",
    o: ["Observe for at least 24 hours with repeat CT head in 6-24 hours, as delayed intracranial hemorrhage can occur in anticoagulated patients; check INR", "Discharge home with head injury precautions", "Discontinue warfarin permanently after this fall", "Perform lumbar puncture to rule out subarachnoid hemorrhage"],
    a: 0,
    r: "Anticoagulated patients who sustain head trauma are at significantly increased risk for delayed intracranial hemorrhage (ICH). A normal initial CT does not exclude delayed bleeding, which may manifest 6-24 hours later. Guidelines recommend extended observation (minimum 24 hours) with repeat CT in anticoagulated head trauma patients. INR should be checked and supratherapeutic levels corrected. Warfarin should not be permanently discontinued based on a single fall -- a risk-benefit assessment considering fall frequency, CHA2DS2-VASc score, and HAS-BLED score should guide ongoing anticoagulation decisions.",
    s: "Geriatrics"
  }
];
