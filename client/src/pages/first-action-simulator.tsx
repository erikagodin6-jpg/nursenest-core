import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  type CountryMode,
  type UnitMode,
  getDefaultUnitMode,
  convertTemp,
  convertGlucose,
  formatBP,
  formatHR,
  formatRR,
  formatSpO2,
} from "@/lib/unit-conversion";
import {
  Heart,
  Wind,
  Brain,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  Sparkles,
  Target,
  ShieldAlert,
  Trophy,
  RotateCcw,
  Zap,
  Stethoscope,
  Globe,
  Ruler,
} from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
type Tier = "rpn" | "rn" | "np";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  rationale: string;
}

interface Scenario {
  id: string;
  tier: Tier;
  difficulty: Difficulty;
  title: string;
  category: string;
  patientHistory: string;
  age: number;
  sex: string;
  allergies: string[];
  comorbidities: string[];
  symptoms: string[];
  vitals: {
    hr: number;
    bpSystolic: number;
    bpDiastolic: number;
    rr: number;
    spo2: number;
    tempC: number;
    glucoseMmol?: number;
  };
  question: string;
  options: ScenarioOption[];
  examTrap: string;
}

const scenarios: Scenario[] = [
  {
    id: "rpn-1",
    tier: "rpn",
    difficulty: "beginner",
    title: "Post-Op Vital Sign Change",
    category: "Medical-Surgical",
    patientHistory: "72-year-old female, 6 hours post right total hip replacement. Alert and oriented. IV running at 75 mL/hr.",
    age: 72,
    sex: "Female",
    allergies: ["Codeine"],
    comorbidities: ["Hypertension", "Type 2 Diabetes"],
    symptoms: ["Mild incisional pain rated 4/10", "Slight dizziness when repositioning", "Decreased urine output over past 2 hours"],
    vitals: { hr: 98, bpSystolic: 100, bpDiastolic: 62, rr: 18, spo2: 96, tempC: 37.1, glucoseMmol: 8.2 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Administer PRN analgesic for pain management", isCorrect: false, rationale: "Pain is 4/10 and manageable. Addressing hemodynamic changes takes priority over comfort measures." },
      { id: "b", text: "Document findings and continue monitoring", isCorrect: false, rationale: "While documentation is important, the combination of tachycardia, hypotension, and decreased urine output requires immediate communication, not just documentation." },
      { id: "c", text: "Notify the charge nurse/RN of vital sign changes and decreased urine output", isCorrect: true, rationale: "The triad of rising HR, falling BP, and decreased urine output may indicate early hemorrhage or fluid volume deficit post-operatively. As an RPN, reporting these changes to the RN/charge nurse is the priority action within scope." },
      { id: "d", text: "Elevate the head of bed and recheck vitals in 30 minutes", isCorrect: false, rationale: "Delaying action by 30 minutes when hemodynamic indicators are trending negatively is unsafe. This could allow deterioration to progress undetected." },
    ],
    examTrap: "Exams often tempt you to 'recheck in 30 minutes'  -  but trending tachycardia + hypotension + oliguria requires immediate escalation, not watchful waiting.",
  },
  {
    id: "rpn-2",
    tier: "rpn",
    difficulty: "beginner",
    title: "Diabetic Patient Morning Assessment",
    category: "Endocrine",
    patientHistory: "58-year-old male admitted for cellulitis of left lower leg. On IV antibiotics and sliding scale insulin. NPO for wound debridement scheduled at 1100.",
    age: 58,
    sex: "Male",
    allergies: ["Sulfa drugs"],
    comorbidities: ["Type 2 Diabetes", "Peripheral vascular disease"],
    symptoms: ["Diaphoresis", "Trembling hands", "Reports feeling 'shaky and weak'", "Skin cool and clammy"],
    vitals: { hr: 104, bpSystolic: 138, bpDiastolic: 82, rr: 20, spo2: 97, tempC: 36.4, glucoseMmol: 2.8 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Administer the next scheduled dose of sliding scale insulin", isCorrect: false, rationale: "The blood glucose is critically low at 2.8 mmol/L. Administering insulin would cause dangerous further hypoglycemia and is contraindicated." },
      { id: "b", text: "Check the patient's blood glucose level at the bedside", isCorrect: true, rationale: "The symptoms (diaphoresis, tremor, cool/clammy skin, tachycardia) are classic hypoglycemia signs. Confirming blood glucose with a point-of-care test is the first action  -  it validates the clinical picture and guides the next intervention (glucose administration). This is within RPN scope." },
      { id: "c", text: "Notify the surgeon that the patient cannot go to the OR", isCorrect: false, rationale: "While the surgical team should eventually be notified, the immediate priority is confirming and treating the hypoglycemia, not surgical logistics." },
      { id: "d", text: "Offer orange juice with sugar packets", isCorrect: false, rationale: "The patient is NPO, and treating without confirming the glucose level first could mask other conditions. Confirm the glucose reading first, then follow hypoglycemia protocol." },
    ],
    examTrap: "Many students jump to 'give juice'  -  but the patient is NPO, and you must CONFIRM the blood glucose first before treating. Assess before you intervene.",
  },
  {
    id: "rpn-3",
    tier: "rpn",
    difficulty: "intermediate",
    title: "Falls Risk During Night Shift",
    category: "Safety & Risk",
    patientHistory: "81-year-old female admitted for community-acquired pneumonia. Receiving IV levofloxacin. History of falls at home. Found standing at bedside attempting to walk to bathroom, call bell on floor.",
    age: 81,
    sex: "Female",
    allergies: ["Penicillin"],
    comorbidities: ["Osteoporosis", "Mild cognitive impairment", "Urinary frequency"],
    symptoms: ["Unsteady gait observed", "Confusion about location", "Urinary urgency", "Low-grade fever"],
    vitals: { hr: 88, bpSystolic: 118, bpDiastolic: 70, rr: 22, spo2: 93, tempC: 38.2 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Assist the patient back to bed and ensure the call bell is within reach", isCorrect: true, rationale: "Immediate safety is the priority. The patient is actively at risk of falling right now. Physically assisting her to a safe position and ensuring she can call for help addresses the most urgent danger. All other interventions can follow once the patient is safe." },
      { id: "b", text: "Apply a bed alarm and complete an incident report", isCorrect: false, rationale: "A bed alarm is a good preventive measure but the patient is already standing unsafely. Address the immediate danger first, then implement preventive strategies." },
      { id: "c", text: "Notify the charge nurse about the patient's confusion", isCorrect: false, rationale: "Reporting confusion is appropriate but secondary. The patient needs immediate physical safety before any communication or documentation occurs." },
      { id: "d", text: "Obtain an order for a urinary catheter to reduce bathroom trips", isCorrect: false, rationale: "Urinary catheters increase infection risk and are not first-line for fall prevention. This does not address the immediate safety concern of a patient standing unsafely." },
    ],
    examTrap: "Don't overthink interventions when the patient is in immediate physical danger. Safety FIRST  -  get the patient safe, then plan prevention.",
  },
  {
    id: "rpn-4",
    tier: "rpn",
    difficulty: "intermediate",
    title: "Blood Transfusion Reaction",
    category: "Hematology",
    patientHistory: "65-year-old male receiving second unit of packed RBCs for GI bleed-related anemia. Transfusion started 20 minutes ago. Now complaining of back pain and chills.",
    age: 65,
    sex: "Male",
    allergies: ["None known"],
    comorbidities: ["Peptic ulcer disease", "Chronic kidney disease stage 3"],
    symptoms: ["Sudden onset low back pain", "Chills and rigors", "Facial flushing", "Dark-colored urine noted in catheter bag"],
    vitals: { hr: 112, bpSystolic: 88, bpDiastolic: 54, rr: 26, spo2: 94, tempC: 39.1 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Stop the transfusion immediately and keep the IV line open with normal saline", isCorrect: true, rationale: "Back pain, chills, fever, dark urine, and hemodynamic instability during a transfusion indicate an acute hemolytic transfusion reaction. Stopping the transfusion immediately prevents further exposure to incompatible blood. The IV must remain open for emergency medication access." },
      { id: "b", text: "Slow the transfusion rate and administer diphenhydramine", isCorrect: false, rationale: "Slowing the rate is appropriate for mild allergic reactions (hives, itching). This presentation has hemolytic signs  -  back pain, dark urine, hemodynamic changes  -  which require immediate cessation, not rate adjustment." },
      { id: "c", text: "Obtain a blood sample for repeat type and crossmatch", isCorrect: false, rationale: "Blood samples will be needed, but the first priority is stopping further exposure to the incompatible blood product. Lab work follows the stop-the-transfusion action." },
      { id: "d", text: "Administer acetaminophen for fever and monitor", isCorrect: false, rationale: "Treating the fever symptomatically without stopping the causative agent is dangerous. The fever is from the hemolytic reaction, not a simple infection." },
    ],
    examTrap: "Students often confuse mild allergic reactions (slow rate + antihistamine) with hemolytic reactions (STOP immediately). Dark urine + back pain = hemolytic = STOP.",
  },
  {
    id: "rpn-5",
    tier: "rpn",
    difficulty: "advanced",
    title: "Chest Tube Management",
    category: "Respiratory",
    patientHistory: "54-year-old male, post-op day 1 following left lower lobectomy for lung cancer. Has a chest tube connected to a water-seal drainage system. During repositioning, the chest tube becomes disconnected from the drainage system.",
    age: 54,
    sex: "Male",
    allergies: ["Latex"],
    comorbidities: ["COPD", "Former smoker 30 pack-years"],
    symptoms: ["Sudden onset dyspnea after tube disconnection", "Anxious and restless", "Diminished breath sounds left base"],
    vitals: { hr: 108, bpSystolic: 132, bpDiastolic: 78, rr: 28, spo2: 89, tempC: 37.3 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Clamp the chest tube with padded hemostats and notify the surgeon", isCorrect: false, rationale: "Clamping a chest tube can cause tension pneumothorax if air continues to accumulate with no escape route. Clamping is only done briefly for specific assessments, not as a first response to disconnection." },
      { id: "b", text: "Place the end of the chest tube into a container of sterile water", isCorrect: true, rationale: "Submerging the disconnected end in sterile water (or saline) creates an emergency water seal, preventing atmospheric air from entering the pleural space while maintaining drainage. This is the standard emergency protocol for chest tube disconnection." },
      { id: "c", text: "Reconnect the chest tube to the original drainage system", isCorrect: false, rationale: "The original connection may be contaminated. Reconnecting without sterile technique introduces infection risk. The emergency water-seal method provides immediate safe intervention." },
      { id: "d", text: "Remove the chest tube and apply an occlusive dressing", isCorrect: false, rationale: "Removing a chest tube is a provider-level decision and requires an order. Additionally, removing drainage post-lobectomy could lead to tension pneumothorax." },
    ],
    examTrap: "NEVER clamp a chest tube as the first action  -  this is the #1 exam trap. The correct emergency response is sterile water submersion to create a temporary water seal.",
  },
  {
    id: "rn-1",
    tier: "rn",
    difficulty: "beginner",
    title: "Acute Chest Pain in Cardiac Unit",
    category: "Cardiovascular",
    patientHistory: "62-year-old male admitted for unstable angina. Scheduled for cardiac catheterization tomorrow. Suddenly clutches his chest and reports crushing substernal pain radiating to left arm, rated 9/10.",
    age: 62,
    sex: "Male",
    allergies: ["Morphine"],
    comorbidities: ["Hyperlipidemia", "Family history of MI", "Obesity BMI 34"],
    symptoms: ["Crushing substernal chest pain 9/10", "Radiation to left arm and jaw", "Diaphoresis", "Nausea", "Pallor"],
    vitals: { hr: 118, bpSystolic: 164, bpDiastolic: 98, rr: 24, spo2: 93, tempC: 37.0 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Administer sublingual nitroglycerin as per standing order", isCorrect: false, rationale: "While NTG is appropriate for chest pain, the very first action must be assessment  -  obtain a 12-lead ECG to determine if this is an acute MI (STEMI). Treatment decisions depend on ECG findings." },
      { id: "b", text: "Obtain a 12-lead ECG immediately", isCorrect: true, rationale: "A 12-lead ECG is the first diagnostic action for acute chest pain. It differentiates STEMI from NSTEMI/unstable angina and determines the treatment pathway (emergent PCI vs. medical management). The goal is ECG within 10 minutes of symptom onset." },
      { id: "c", text: "Start a second IV line and draw cardiac troponins", isCorrect: false, rationale: "While troponins and IV access are important, they do not guide immediate emergency treatment the way an ECG does. The ECG determines whether this patient needs emergent catheterization NOW." },
      { id: "d", text: "Call a rapid response and prepare for possible intubation", isCorrect: false, rationale: "The patient is alert, talking, and has adequate (though declining) oxygenation. A rapid response may be warranted, but the 12-lead ECG provides critical data that must come first." },
    ],
    examTrap: "Don't jump to nitroglycerin  -  the ECG determines everything. STEMI = cath lab immediately. NSTEMI = medical management. The ECG MUST come first.",
  },
  {
    id: "rn-2",
    tier: "rn",
    difficulty: "beginner",
    title: "Sepsis Recognition in ED",
    category: "Emergency",
    patientHistory: "78-year-old female brought to ED from nursing home with altered mental status. Staff reports she 'hasn't been herself' for 2 days. Indwelling urinary catheter in place for 3 weeks.",
    age: 78,
    sex: "Female",
    allergies: ["Ciprofloxacin"],
    comorbidities: ["Dementia (baseline A&O x2)", "Urinary retention", "Atrial fibrillation"],
    symptoms: ["New-onset confusion beyond baseline", "Warm and flushed skin", "Decreased oral intake for 48 hours", "Cloudy, foul-smelling urine in catheter bag"],
    vitals: { hr: 110, bpSystolic: 86, bpDiastolic: 50, rr: 26, spo2: 92, tempC: 39.4 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Initiate a sepsis screening tool and notify the physician immediately", isCorrect: true, rationale: "This patient meets SIRS/sepsis criteria: HR >90, RR >22, temp >38.3°C, suspected UTI source, altered mental status, and hypotension. Initiating the sepsis screening protocol triggers the sepsis bundle (lactate, blood cultures, fluid bolus, antibiotics within 1 hour). Early recognition is the #1 factor in sepsis survival." },
      { id: "b", text: "Obtain a urine culture and start empiric antibiotics", isCorrect: false, rationale: "Cultures are part of the sepsis bundle, but the FIRST action is recognizing the sepsis pattern and activating the protocol. Individual orders come through the systematic bundle approach." },
      { id: "c", text: "Administer a 500 mL normal saline bolus for hypotension", isCorrect: false, rationale: "Fluid resuscitation is critical in sepsis but should follow protocol activation and physician notification. The standard sepsis bolus is 30 mL/kg, not just 500 mL." },
      { id: "d", text: "Remove the urinary catheter to eliminate the infection source", isCorrect: false, rationale: "While the catheter is the likely source, removing it before obtaining cultures would eliminate the ability to identify the causative organism. Cultures first, then source control." },
    ],
    examTrap: "Sepsis questions test whether you RECOGNIZE the pattern first or jump to individual treatments. Always screen and activate protocol BEFORE individual interventions.",
  },
  {
    id: "rn-3",
    tier: "rn",
    difficulty: "intermediate",
    title: "Post-Cardiac Catheterization Hemorrhage",
    category: "Cardiovascular",
    patientHistory: "55-year-old male returned from cardiac catheterization via right femoral artery 2 hours ago. Pressure dressing in place. Now reporting increasing groin pain and 'something feels wet.'",
    age: 55,
    sex: "Male",
    allergies: ["Contrast dye (mild  -  premedicated)"],
    comorbidities: ["CAD", "Type 2 Diabetes", "On dual antiplatelet therapy"],
    symptoms: ["Increasing right groin pain", "Expanding hematoma palpable at groin site", "Feeling lightheaded", "Right foot feels 'tingly'"],
    vitals: { hr: 120, bpSystolic: 84, bpDiastolic: 52, rr: 24, spo2: 95, tempC: 36.8 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Apply direct manual pressure proximal to the femoral access site", isCorrect: true, rationale: "An expanding hematoma with hemodynamic instability indicates active arterial bleeding at the catheterization site. Direct manual pressure proximal to the puncture site controls hemorrhage immediately. This is a life-threatening emergency requiring hands-on intervention before any other action." },
      { id: "b", text: "Call the cardiologist and request an urgent vascular surgery consult", isCorrect: false, rationale: "The cardiologist must be notified, but while you're making phone calls, the patient is actively hemorrhaging. Apply pressure FIRST, then call for help (or have another nurse call)." },
      { id: "c", text: "Elevate the affected leg and apply an ice pack to the groin", isCorrect: false, rationale: "Elevation and ice are appropriate for minor hematomas, not active arterial hemorrhage with hemodynamic compromise. This patient needs direct manual pressure." },
      { id: "d", text: "Start a rapid fluid bolus and type and crossmatch for blood products", isCorrect: false, rationale: "Volume resuscitation is important but does not stop the source of bleeding. You must control the hemorrhage with manual pressure first, then address volume replacement." },
    ],
    examTrap: "In hemorrhage questions, the answer is almost always 'stop the bleeding first.' Fluids and calls are important but SECONDARY to hemorrhage control.",
  },
  {
    id: "rn-4",
    tier: "rn",
    difficulty: "intermediate",
    title: "Acute Stroke Assessment",
    category: "Neurological",
    patientHistory: "67-year-old female brought to ED by family who noticed sudden right-sided weakness and slurred speech starting approximately 45 minutes ago. Patient was in her usual state of health this morning.",
    age: 67,
    sex: "Female",
    allergies: ["Aspirin (GI upset)"],
    comorbidities: ["Atrial fibrillation (on warfarin)", "Hypertension", "Hyperlipidemia"],
    symptoms: ["Right-sided hemiparesis", "Slurred speech (dysarthria)", "Right facial droop", "Difficulty swallowing"],
    vitals: { hr: 92, bpSystolic: 198, bpDiastolic: 108, rr: 18, spo2: 96, tempC: 37.0 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Administer aspirin 325 mg per stroke protocol", isCorrect: false, rationale: "This patient is on warfarin (anticoagulant). Administering aspirin before knowing INR and stroke type (ischemic vs. hemorrhagic) could worsen a hemorrhagic stroke. Never give antiplatelets before imaging." },
      { id: "b", text: "Lower blood pressure with IV labetalol immediately", isCorrect: false, rationale: "In acute stroke, permissive hypertension is maintained unless BP exceeds 220/120 (or 185/110 if tPA candidate). Aggressive BP reduction can worsen ischemic injury by reducing perfusion to the penumbra." },
      { id: "c", text: "Activate the stroke alert/code stroke and note the time of symptom onset", isCorrect: true, rationale: "Time is brain. Activating the stroke protocol mobilizes the stroke team, prioritizes CT imaging, and ensures the tPA decision window is maximized. The last-known-well time (45 minutes ago) is critical  -  this patient is within the 4.5-hour tPA window. Every minute of delay = 1.9 million neurons lost." },
      { id: "d", text: "Perform a complete neurological assessment using the NIH Stroke Scale", isCorrect: false, rationale: "The NIHSS is essential but is performed as part of the stroke protocol after activation. Activating the code stroke triggers ALL components simultaneously, including rapid CT and NIHSS scoring." },
    ],
    examTrap: "Never treat BP aggressively in acute stroke unless it exceeds specific thresholds. And never give aspirin before ruling out hemorrhagic stroke with CT.",
  },
  {
    id: "rn-5",
    tier: "rn",
    difficulty: "advanced",
    title: "DKA Management in ICU",
    category: "Endocrine",
    patientHistory: "28-year-old male with Type 1 Diabetes admitted to ICU with diabetic ketoacidosis. Currently on insulin drip at 5 units/hr. Blood glucose has dropped from 28 mmol/L to 14 mmol/L over the past 3 hours.",
    age: 28,
    sex: "Male",
    allergies: ["None known"],
    comorbidities: ["Type 1 Diabetes", "Depression (non-adherent with insulin)"],
    symptoms: ["Kussmaul respirations resolving", "Decreased level of consciousness", "Fruity breath odor", "Dry mucous membranes"],
    vitals: { hr: 108, bpSystolic: 102, bpDiastolic: 64, rr: 28, spo2: 96, tempC: 37.2, glucoseMmol: 14.0 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Discontinue the insulin drip since glucose is trending downward", isCorrect: false, rationale: "NEVER stop the insulin drip in DKA based on glucose alone. Insulin is continued to close the anion gap and resolve ketoacidosis. Stopping insulin causes rebound ketosis even if glucose is normalizing." },
      { id: "b", text: "Add dextrose to the IV fluids and continue the insulin infusion", isCorrect: true, rationale: "When blood glucose reaches 14 mmol/L (250 mg/dL) in DKA, the protocol is to ADD dextrose (D5W or D10W) to the IV fluids while CONTINUING insulin. This prevents hypoglycemia while allowing insulin to continue closing the anion gap. DKA resolution is determined by anion gap closure, not glucose normalization." },
      { id: "c", text: "Reduce the insulin drip rate to 2 units/hr", isCorrect: false, rationale: "While rate reduction may eventually be needed, the priority at the 14 mmol/L threshold is adding dextrose. The insulin rate is adjusted based on the overall DKA protocol, not just glucose level alone." },
      { id: "d", text: "Check arterial blood gases and serum potassium before any changes", isCorrect: false, rationale: "ABGs and potassium monitoring are ongoing, but the immediate action at this glucose threshold is adding dextrose. Delaying the protocol step while waiting for lab results risks hypoglycemia." },
    ],
    examTrap: "The #1 DKA trap: students stop insulin when glucose drops. In DKA, insulin treats the ACIDOSIS, not just the glucose. Add dextrose + continue insulin.",
  },
  {
    id: "rn-6",
    tier: "rn",
    difficulty: "advanced",
    title: "Tension Pneumothorax in Trauma",
    category: "Emergency",
    patientHistory: "34-year-old male MVC victim with left-sided rib fractures (ribs 4-7). Initially stable in ED. While awaiting CT scan, suddenly becomes severely dyspneic and agitated.",
    age: 34,
    sex: "Male",
    allergies: ["None known"],
    comorbidities: ["None"],
    symptoms: ["Severe dyspnea", "Tracheal deviation to the right", "Absent breath sounds on left", "Distended neck veins", "Cyanosis"],
    vitals: { hr: 138, bpSystolic: 72, bpDiastolic: 40, rr: 36, spo2: 78, tempC: 37.1 },
    question: "What is the FIRST nursing action?",
    options: [
      { id: "a", text: "Notify the trauma surgeon and prepare for emergent chest tube insertion", isCorrect: true, rationale: "Tracheal deviation, absent breath sounds, JVD, hypotension, and tachycardia in a trauma patient = tension pneumothorax until proven otherwise. This is a clinical diagnosis requiring emergent decompression. The RN must immediately notify the trauma team and prepare for needle decompression (2nd intercostal space, midclavicular line) or chest tube. This is minutes-to-death without intervention." },
      { id: "b", text: "Obtain a stat portable chest X-ray to confirm the diagnosis", isCorrect: false, rationale: "Tension pneumothorax is a CLINICAL diagnosis  -  waiting for imaging in a rapidly decompensating patient wastes critical time. The classic signs (tracheal deviation, absent breath sounds, JVD, hypotension) are diagnostic." },
      { id: "c", text: "Apply high-flow oxygen via non-rebreather mask at 15 L/min", isCorrect: false, rationale: "Oxygen alone cannot treat tension pneumothorax because the issue is mechanical (trapped air compressing the mediastinum), not a gas exchange problem alone. Oxygen is supportive but not the priority action." },
      { id: "d", text: "Position the patient on the left side to improve ventilation", isCorrect: false, rationale: "Positional changes will not resolve a tension pneumothorax. The trapped air must be evacuated through decompression. No amount of repositioning addresses the underlying mechanical obstruction." },
    ],
    examTrap: "Tension pneumothorax = clinical diagnosis, NOT radiographic. If you see tracheal deviation + JVD + absent breath sounds + hypotension → act immediately, don't wait for X-ray.",
  },
  {
    id: "np-1",
    tier: "np",
    difficulty: "beginner",
    title: "Community-Acquired Pneumonia Workup",
    category: "Respiratory",
    patientHistory: "45-year-old male presents to clinic with 4-day history of productive cough with rust-colored sputum, fever, and right-sided pleuritic chest pain. Non-smoker, no recent travel.",
    age: 45,
    sex: "Male",
    allergies: ["Azithromycin (rash)"],
    comorbidities: ["Mild intermittent asthma"],
    symptoms: ["Productive cough with rust-colored sputum", "Right-sided pleuritic chest pain", "Fatigue and malaise", "Decreased appetite"],
    vitals: { hr: 96, bpSystolic: 128, bpDiastolic: 78, rr: 22, spo2: 94, tempC: 38.9 },
    question: "What is the FIRST action by the Nurse Practitioner?",
    options: [
      { id: "a", text: "Prescribe amoxicillin 1g TID empirically for 7 days", isCorrect: false, rationale: "Empiric treatment is premature without diagnostic confirmation. Chest X-ray is needed to confirm pneumonia and rule out other pathologies (effusion, mass, abscess). Additionally, amoxicillin alone may not cover atypical organisms." },
      { id: "b", text: "Order a chest X-ray (PA and lateral) to confirm the diagnosis", isCorrect: true, rationale: "Clinical presentation is suggestive of pneumonia, but CXR confirmation is the standard of care. It confirms the diagnosis, identifies the location and extent of consolidation, detects complications (effusion, abscess), and guides antibiotic selection and disposition decisions (outpatient vs. inpatient). Diagnosis before treatment." },
      { id: "c", text: "Order sputum culture and sensitivity before starting antibiotics", isCorrect: false, rationale: "Sputum cultures are not routinely recommended for outpatient CAP per IDSA guidelines. They are reserved for patients requiring hospitalization or with risk factors for resistant organisms." },
      { id: "d", text: "Refer to pulmonology for bronchoscopy", isCorrect: false, rationale: "Bronchoscopy is not indicated for a straightforward CAP presentation. It is reserved for recurrent pneumonia, non-resolving infiltrates, or suspected malignancy  -  none of which apply here." },
    ],
    examTrap: "NP exams test whether you diagnose before you treat. Even when the clinical picture is 'classic,' diagnostic confirmation (CXR) comes before empiric antibiotics.",
  },
  {
    id: "np-2",
    tier: "np",
    difficulty: "beginner",
    title: "New-Onset Hypertension Management",
    category: "Cardiovascular",
    patientHistory: "52-year-old female presents for routine physical. No prior history of hypertension. Three consecutive elevated readings over past month (148/92, 152/96, 150/94). BMI 31, sedentary lifestyle.",
    age: 52,
    sex: "Female",
    allergies: ["ACE inhibitors (cough)"],
    comorbidities: ["Obesity", "Prediabetes (A1C 6.2%)", "Family history of stroke"],
    symptoms: ["Occasional morning headaches", "No visual changes", "No chest pain", "No edema"],
    vitals: { hr: 76, bpSystolic: 152, bpDiastolic: 96, rr: 16, spo2: 98, tempC: 36.8, glucoseMmol: 6.4 },
    question: "What is the FIRST action by the Nurse Practitioner?",
    options: [
      { id: "a", text: "Start amlodipine 5 mg daily and follow up in 4 weeks", isCorrect: false, rationale: "Initiating pharmacotherapy without completing the hypertension workup (target organ damage screening, secondary causes) is premature. Baseline labs and risk assessment should guide the medication choice." },
      { id: "b", text: "Order baseline labs including BMP, lipid panel, urinalysis, and ECG", isCorrect: true, rationale: "Before initiating antihypertensive therapy, the NP must assess for target organ damage (renal function via BMP, cardiac via ECG), identify cardiovascular risk factors (lipid panel), screen for secondary causes, and evaluate for proteinuria (urinalysis). This workup determines the urgency and choice of medication." },
      { id: "c", text: "Recommend lifestyle modifications only and recheck in 3 months", isCorrect: false, rationale: "Stage 2 hypertension (≥140/90 with consistent readings) combined with prediabetes and family history of stroke warrants pharmacotherapy in addition to lifestyle modifications. Lifestyle-only approach delays needed treatment in a patient with elevated cardiovascular risk." },
      { id: "d", text: "Order 24-hour ambulatory blood pressure monitoring to confirm diagnosis", isCorrect: false, rationale: "ABPM is useful for white-coat hypertension suspected cases. This patient has three consecutive elevated readings over a month, confirming the diagnosis. Further monitoring delays the necessary workup." },
    ],
    examTrap: "Stage 2 HTN with risk factors requires BOTH medication AND lifestyle changes. But before prescribing, complete the baseline workup to guide your drug choice.",
  },
  {
    id: "np-3",
    tier: "np",
    difficulty: "intermediate",
    title: "Thyroid Nodule Evaluation",
    category: "Endocrine",
    patientHistory: "38-year-old female presents with palpable thyroid nodule discovered during self-exam 2 weeks ago. Reports mild dysphagia with solid foods. No weight changes, no tremor, no heat/cold intolerance. Family history: mother had thyroid cancer at age 55.",
    age: 38,
    sex: "Female",
    allergies: ["Iodine-based contrast"],
    comorbidities: ["None"],
    symptoms: ["Palpable right-sided thyroid nodule approximately 2 cm", "Mild dysphagia with solid foods", "Firm, non-tender nodule on palpation", "No cervical lymphadenopathy"],
    vitals: { hr: 72, bpSystolic: 118, bpDiastolic: 74, rr: 14, spo2: 99, tempC: 36.7 },
    question: "What is the FIRST action by the Nurse Practitioner?",
    options: [
      { id: "a", text: "Order a thyroid ultrasound and TSH level", isCorrect: true, rationale: "For a palpable thyroid nodule, the initial evaluation per ATA guidelines is thyroid ultrasound (to characterize size, composition, vascularity) AND TSH level (to assess thyroid function). Ultrasound determines whether fine-needle aspiration biopsy is indicated based on size and suspicious features. TSH guides whether a radionuclide scan is needed." },
      { id: "b", text: "Refer immediately to endocrinology for fine-needle aspiration", isCorrect: false, rationale: "FNA may ultimately be needed, but the NP should first obtain ultrasound to characterize the nodule. Not all nodules require FNA  -  size, composition, and echogenicity guide this decision. Immediate referral without imaging skips the diagnostic workup." },
      { id: "c", text: "Order CT scan of the neck with contrast to evaluate the nodule", isCorrect: false, rationale: "CT with contrast is not first-line for thyroid nodule evaluation. Additionally, this patient has an iodine contrast allergy. Ultrasound is the gold standard imaging modality for thyroid nodules  -  it's non-invasive, radiation-free, and provides the specific characterization needed." },
      { id: "d", text: "Start levothyroxine to suppress the nodule growth", isCorrect: false, rationale: "TSH suppression therapy is no longer recommended for thyroid nodules per current guidelines. Additionally, initiating thyroid hormone without knowing the TSH level could cause iatrogenic hyperthyroidism." },
    ],
    examTrap: "Thyroid nodule workup ALWAYS starts with ultrasound + TSH. Never jump to FNA without imaging first, and never suppress with levothyroxine  -  that's outdated practice.",
  },
  {
    id: "np-4",
    tier: "np",
    difficulty: "intermediate",
    title: "Pediatric Febrile Seizure Management",
    category: "Pediatrics",
    patientHistory: "18-month-old male brought to urgent care by mother after a generalized tonic-clonic seizure at home lasting approximately 3 minutes. Child has had fever for 1 day with upper respiratory symptoms. First seizure ever. Currently post-ictal but arousable.",
    age: 1,
    sex: "Male",
    allergies: ["None known"],
    comorbidities: ["None", "Full immunizations up to date"],
    symptoms: ["Post-ictal drowsiness but arousable", "Rhinorrhea and mild cough", "Red, bulging tympanic membranes bilaterally", "No meningeal signs", "No petechial rash"],
    vitals: { hr: 140, bpSystolic: 90, bpDiastolic: 58, rr: 30, spo2: 97, tempC: 39.6 },
    question: "What is the FIRST action by the Nurse Practitioner?",
    options: [
      { id: "a", text: "Order a lumbar puncture to rule out meningitis", isCorrect: false, rationale: "LP is not routinely indicated for a simple febrile seizure in an immunized child >12 months with no meningeal signs. The AAP guidelines state LP should be considered only if meningeal signs are present, immunizations are incomplete, or the child was on antibiotics." },
      { id: "b", text: "Prescribe phenobarbital for seizure prophylaxis", isCorrect: false, rationale: "Anticonvulsant prophylaxis is NOT recommended for simple febrile seizures per AAP guidelines. The risks of daily medication outweigh the benefits, and simple febrile seizures do not increase epilepsy risk." },
      { id: "c", text: "Perform a thorough assessment to identify the fever source and determine if this is a simple febrile seizure", isCorrect: true, rationale: "The NP must first classify the seizure (simple vs. complex febrile seizure) by assessing duration (<15 min), focality (generalized), recurrence (first episode), and age (6 months-5 years). Then identify the fever source  -  bilateral otitis media is the likely cause. A simple febrile seizure in an immunized child with an identifiable fever source requires treating the underlying infection, fever management, and parent education  -  not neuroimaging or anticonvulsants." },
      { id: "d", text: "Order a stat CT scan of the head to rule out intracranial pathology", isCorrect: false, rationale: "Neuroimaging is not indicated for simple febrile seizures per AAP guidelines. CT exposes the child to unnecessary radiation. Imaging is reserved for complex febrile seizures (focal, prolonged >15 min, or recurrent within 24 hours)." },
    ],
    examTrap: "Simple febrile seizures do NOT require LP, CT, EEG, or anticonvulsants. The exam tests whether you can resist over-investigating a benign condition.",
  },
  {
    id: "np-5",
    tier: "np",
    difficulty: "advanced",
    title: "Acute Heart Failure Exacerbation",
    category: "Cardiovascular",
    patientHistory: "71-year-old male with known HFrEF (EF 25%) presents to ED with worsening dyspnea over 3 days. Has been non-adherent with furosemide and fluid restriction. Reports sleeping upright in recliner for 2 nights.",
    age: 71,
    sex: "Male",
    allergies: ["Lisinopril (angioedema)"],
    comorbidities: ["HFrEF EF 25%", "Type 2 Diabetes", "CKD stage 3b", "Atrial fibrillation"],
    symptoms: ["Severe dyspnea at rest", "Bilateral crackles to mid-lung fields", "3+ pitting edema bilateral lower extremities", "Weight gain of 5 kg in 1 week", "JVD visible at 45 degrees"],
    vitals: { hr: 112, bpSystolic: 96, bpDiastolic: 62, rr: 32, spo2: 86, tempC: 36.9, glucoseMmol: 9.8 },
    question: "What is the FIRST action by the Nurse Practitioner?",
    options: [
      { id: "a", text: "Order IV furosemide 80 mg push and establish continuous telemetry", isCorrect: false, rationale: "While IV diuretics are essential, the patient's SpO2 is 86% with severe dyspnea. Oxygenation must be addressed first  -  a patient who cannot oxygenate will deteriorate regardless of diuresis. Stabilize the ABCs before definitive treatment." },
      { id: "b", text: "Apply BiPAP at 10/5 cmH2O and position upright to stabilize oxygenation", isCorrect: true, rationale: "With SpO2 86%, RR 32, and bilateral crackles, this patient has acute pulmonary edema with respiratory failure. Non-invasive positive pressure ventilation (BiPAP) immediately reduces work of breathing, improves oxygenation, reduces preload, and buys time for definitive treatment. Upright positioning reduces venous return and improves diaphragmatic excursion. ABC approach: secure the airway and breathing FIRST." },
      { id: "c", text: "Start IV nitroglycerin drip for preload and afterload reduction", isCorrect: false, rationale: "The patient's systolic BP is 96 mmHg  -  nitroglycerin will cause further hypotension and is contraindicated when SBP <100. Vasodilators require adequate blood pressure to be used safely in HF." },
      { id: "d", text: "Order stat BNP, troponin, BMP, and chest X-ray", isCorrect: false, rationale: "Diagnostics are important but this patient is in acute respiratory distress. Labs and imaging can be ordered simultaneously with stabilization, but they should never delay life-saving respiratory support." },
    ],
    examTrap: "In acute decompensated HF: stabilize oxygenation (BiPAP) before diuresis. And NEVER give nitroglycerin with SBP <100  -  that's a critical safety check.",
  },
  {
    id: "np-6",
    tier: "np",
    difficulty: "advanced",
    title: "Suspected Pulmonary Embolism",
    category: "Respiratory",
    patientHistory: "42-year-old female, 10 days post right knee arthroscopy. On combined oral contraceptives. Presents with sudden-onset pleuritic chest pain and dyspnea that started 2 hours ago while at rest.",
    age: 42,
    sex: "Female",
    allergies: ["None known"],
    comorbidities: ["Obesity BMI 36", "On combined OCP for 5 years", "Recent surgery 10 days ago"],
    symptoms: ["Sudden-onset right-sided pleuritic chest pain", "Dyspnea at rest", "Mild hemoptysis (blood-tinged sputum)", "Right calf swelling and tenderness"],
    vitals: { hr: 124, bpSystolic: 108, bpDiastolic: 72, rr: 28, spo2: 90, tempC: 37.4 },
    question: "What is the FIRST action by the Nurse Practitioner?",
    options: [
      { id: "a", text: "Order a D-dimer level to evaluate for PE", isCorrect: false, rationale: "D-dimer is a rule-OUT test used in LOW-probability PE patients. This patient has HIGH clinical probability (Wells score ≥7: recent surgery, immobilization, tachycardia, hemoptysis, DVT signs, OCP use). In high-probability patients, D-dimer is unreliable  -  go directly to definitive imaging." },
      { id: "b", text: "Initiate therapeutic anticoagulation with IV heparin and order CT pulmonary angiography", isCorrect: true, rationale: "In a hemodynamically stable patient with HIGH clinical probability for PE (multiple risk factors: recent surgery, OCP, obesity + classic symptoms: pleuritic pain, dyspnea, hemoptysis, DVT signs), guidelines recommend initiating anticoagulation BEFORE imaging confirmation if clinical suspicion is high. CTPA is the gold standard diagnostic test. Delaying anticoagulation while waiting for imaging increases clot propagation risk." },
      { id: "c", text: "Order bilateral lower extremity duplex ultrasound first", isCorrect: false, rationale: "While the calf signs suggest DVT, the primary concern is pulmonary embolism. LE ultrasound may confirm DVT but does not evaluate the lungs. CTPA directly visualizes the pulmonary vasculature and is the definitive test." },
      { id: "d", text: "Administer aspirin 325 mg and morphine for pain control", isCorrect: false, rationale: "Aspirin is not the anticoagulant of choice for PE  -  heparin is the standard. Morphine can cause respiratory depression in a patient already hypoxic with SpO2 90%. This approach undertreats and potentially harms." },
    ],
    examTrap: "High-probability PE = skip D-dimer and go straight to CTPA + anticoagulation. D-dimer is only useful for ruling OUT PE in LOW-probability patients.",
  },
];

const difficultyConfig: Record<Difficulty, { bg: string; text: string; label: string; order: number }> = {
  beginner: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Beginner", order: 1 },
  intermediate: { bg: "bg-amber-50", text: "text-amber-700", label: "Intermediate", order: 2 },
  advanced: { bg: "bg-rose-50", text: "text-rose-700", label: "Advanced", order: 3 },
};

const tierLabels: Record<Tier, { label: string; description: string }> = {
  rpn: { label: "RPN / LVN", description: "Stable patients · Monitoring & Reporting scope" },
  rn: { label: "RN", description: "Unstable patients · ICU/Emergency · Protocol-based" },
  np: { label: "NP", description: "Diagnosis & Prescribing decisions" },
};

function VitalsDisplay({
  vitals,
  unitMode,
}: {
  vitals: Scenario["vitals"];
  unitMode: UnitMode;
}) {
  const { t } = useI18n();
  const items = [
    { label: "HR", value: formatHR(vitals.hr), icon: Heart, danger: vitals.hr > 110 || vitals.hr < 50 },
    { label: "BP", value: formatBP(vitals.bpSystolic, vitals.bpDiastolic), icon: Activity, danger: vitals.bpSystolic < 90 || vitals.bpSystolic > 160 },
    { label: "RR", value: formatRR(vitals.rr), icon: Wind, danger: vitals.rr > 24 || vitals.rr < 10 },
    { label: "SpO₂", value: formatSpO2(vitals.spo2), icon: Droplets, danger: vitals.spo2 < 92 },
    { label: "Temp", value: convertTemp(vitals.tempC, unitMode), icon: Thermometer, danger: vitals.tempC > 38.5 || vitals.tempC < 36 },
  ];
  if (vitals.glucoseMmol !== undefined) {
    items.push({
      label: "Glucose",
      value: convertGlucose(vitals.glucoseMmol, unitMode),
      icon: Zap,
      danger: vitals.glucoseMmol < 4 || vitals.glucoseMmol > 11,
    });
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" data-testid="vitals-display">
      {items.map((v) => (
        <div
          key={v.label}
          className={`text-center p-2.5 rounded-lg border ${v.danger ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <v.icon className={`w-3 h-3 ${v.danger ? "text-red-500" : "text-gray-400"}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${v.danger ? "text-red-500" : "text-gray-400"}`}>
              {v.label}
            </span>
          </div>
          <div className={`text-sm sm:text-base font-bold ${v.danger ? "text-red-700" : "text-gray-900"}`}>
            {v.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScenarioRunner({
  tierScenarios,
  tier,
  unitMode,
  onFinish,
}: {
  tierScenarios: Scenario[];
  tier: Tier;
  unitMode: UnitMode;
  onFinish: (results: { scenarioId: string; correct: boolean; selectedId: string }[]) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<{ scenarioId: string; correct: boolean; selectedId: string }[]>([]);

  const scenario = tierScenarios[currentIndex];
  const totalScenarios = tierScenarios.length;

  const handleSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
    setShowFeedback(true);
    const isCorrect = scenario.options.find((o) => o.id === optionId)?.isCorrect || false;
    setResults((prev) => [...prev, { scenarioId: scenario.id, correct: isCorrect, selectedId: optionId }]);
  };

  const handleNext = () => {
    if (currentIndex < totalScenarios - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      onFinish(results);
    }
  };

  const correctOption = scenario.options.find((o) => o.isCorrect);
  const diff = difficultyConfig[scenario.difficulty];
  const currentResult = results.find((r) => r.scenarioId === scenario.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>
            {diff.label}
          </span>
          <span className="text-xs text-gray-400">{scenario.category}</span>
        </div>
        <span className="text-xs font-medium text-gray-500" data-testid="text-progress">
          Question {currentIndex + 1} of {totalScenarios}
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2" data-testid="progress-bar">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + (showFeedback ? 1 : 0)) / totalScenarios) * 100}%` }}
        />
      </div>

      <Card className="border border-gray-100">
        <CardContent className="p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3" data-testid="text-scenario-title">
            {scenario.title}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">{scenario.patientHistory}</p>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
            <div>
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">{t("pages.firstActionSimulator.agesex")} </span>
              {scenario.age} y/o {scenario.sex}
            </div>
            <div>
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">{t("pages.firstActionSimulator.allergies")} </span>
              {scenario.allergies.join(", ")}
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">{t("pages.firstActionSimulator.comorbidities")} </span>
              {scenario.comorbidities.join(", ")}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t("pages.firstActionSimulator.presentingSymptoms")}</p>
            <div className="space-y-1">
              {scenario.symptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-1" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t("pages.firstActionSimulator.vitalSigns")}</p>
            <VitalsDisplay vitals={scenario.vitals} unitMode={unitMode} />
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          {scenario.question}
        </p>
        <div className="space-y-3">
          {scenario.options.map((opt) => {
            let borderClass = "border-gray-100 hover:border-primary/30 cursor-pointer";
            if (showFeedback) {
              if (opt.isCorrect) borderClass = "border-emerald-300 bg-emerald-50/30";
              else if (opt.id === selectedOption && !opt.isCorrect) borderClass = "border-red-300 bg-red-50/30";
              else borderClass = "border-gray-100 opacity-60";
            } else if (opt.id === selectedOption) {
              borderClass = "border-primary bg-primary/5";
            }

            return (
              <Card
                key={opt.id}
                className={`border-2 transition-all duration-300 ${borderClass}`}
                onClick={() => handleSelect(opt.id)}
                data-testid={`card-option-${opt.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {showFeedback ? (
                      opt.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : opt.id === selectedOption ? (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0 mt-0.5" />
                      )
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${opt.id === selectedOption ? "border-primary bg-primary" : "border-gray-300"}`} />
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">{opt.text}</p>
                  </div>

                  {showFeedback && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className={`text-xs font-semibold mb-1 ${opt.isCorrect ? "text-emerald-600" : "text-gray-500"}`}>
                        {opt.isCorrect ? "✓ Correct  -  Priority Action" : "✗ Not the priority"}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">{opt.rationale}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <>
          <Card className="border-2 border-amber-200 bg-amber-50/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">{t("pages.firstActionSimulator.examTrap")}</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{scenario.examTrap}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              className="rounded-full gap-2 bg-primary text-white hover:brightness-110"
              onClick={handleNext}
              data-testid="button-next-scenario"
            >
              {currentIndex < totalScenarios - 1 ? "Next Scenario" : "View Results"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryScreen({
  results,
  tierScenarios,
  onRestart,
  onChangeTier,
}: {
  results: { scenarioId: string; correct: boolean; selectedId: string }[];
  tierScenarios: Scenario[];
  onRestart: () => void;
  onChangeTier: () => void;
}) {
  const correctCount = results.filter((r) => r.correct).length;
  const total = results.length;
  const percentage = Math.round((correctCount / total) * 100);

  const weakAreas = useMemo(() => {
    const incorrect = results.filter((r) => !r.correct);
    const categories = incorrect.reduce<Record<string, number>>((acc, r) => {
      const sc = tierScenarios.find((s) => s.id === r.scenarioId);
      if (sc) acc[sc.category] = (acc[sc.category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(categories).sort((a, b) => b[1] - a[1]);
  }, [results, tierScenarios]);

  return (
    <div className="space-y-8" data-testid="summary-screen">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("pages.firstActionSimulator.simulationComplete")}</h2>
        <p className="text-gray-500">{t("pages.firstActionSimulator.heresHowYouPerformed")}</p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="text-5xl font-bold text-primary mb-2" data-testid="text-score">
            {correctCount}/{total}
          </div>
          <p className="text-gray-500 text-sm">
            {percentage}% accuracy  - {" "}
            {percentage >= 80 ? "Excellent clinical reasoning!" : percentage >= 60 ? "Good foundation, review weak areas." : "Needs focused review. Re-attempt recommended."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Scenario Breakdown
          </h3>
          <div className="space-y-3">
            {tierScenarios.map((sc, i) => {
              const result = results.find((r) => r.scenarioId === sc.id);
              return (
                <div key={sc.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    {result?.correct ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{sc.title}</p>
                      <p className="text-xs text-gray-400">{sc.category} · {difficultyConfig[sc.difficulty].label}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${result?.correct ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {result?.correct ? "Correct" : "Incorrect"}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {weakAreas.length > 0 && (
        <Card className="border border-amber-200 bg-amber-50/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Areas for Review
            </h3>
            <div className="space-y-2">
              {weakAreas.map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{cat}</span>
                  <span className="text-xs font-bold text-amber-700">{count} missed</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button variant="outline" className="rounded-full gap-2" onClick={onRestart} data-testid="button-restart">
          <RotateCcw className="w-4 h-4" />
          Retry This Tier
        </Button>
        <Button variant="outline" className="rounded-full gap-2" onClick={onChangeTier} data-testid="button-change-tier">
          <Stethoscope className="w-4 h-4" />
          Try Another Tier
        </Button>
      </div>
    </div>
  );
}

const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

export default function FirstActionSimulatorPage() {
  const { user, effectiveTier } = useAuth();
  const hasPaidAccess = paidTiers.includes(effectiveTier);

  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [country, setCountry] = useState<CountryMode>(() => {
    return (localStorage.getItem("nursenest-region") as CountryMode) || "US";
  });
  const [unitMode, setUnitMode] = useState<UnitMode>(() => getDefaultUnitMode(country));
  const [simulationResults, setSimulationResults] = useState<{ scenarioId: string; correct: boolean; selectedId: string }[] | null>(null);

  const tierScenarios = useMemo(() => {
    if (!selectedTier) return [];
    return scenarios
      .filter((s) => s.tier === selectedTier)
      .sort((a, b) => difficultyConfig[a.difficulty].order - difficultyConfig[b.difficulty].order);
  }, [selectedTier]);

  const handleCountryChange = (c: CountryMode) => {
    setCountry(c);
    setUnitMode(getDefaultUnitMode(c));
  };

  const handleFinish = (results: { scenarioId: string; correct: boolean; selectedId: string }[]) => {
    setSimulationResults(results);
  };

  const handleRestart = () => {
    setSimulationResults(null);
  };

  const handleChangeTier = () => {
    setSelectedTier(null);
    setSimulationResults(null);
  };

  return (
    <div className={`min-h-screen bg-warmwhite flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <SEO
        title={t("pages.firstActionSimulator.firstActionPrioritizationSimulatorClinical")}
        description={t("pages.firstActionSimulator.masterNursingPrioritizationWithInteractive")}
        keywords="nursing prioritization simulator, first action nursing, clinical decision making, NCLEX prioritization, nursing exam prep, clinical reasoning"
        canonicalPath="/first-action-simulator"
        ogType="website"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />
        {!hasPaidAccess ? (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary/60" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-page-title">{t("pages.firstActionSimulator.firstActionPrioritizationSimulator")}</h1>
              <p className="text-lg text-gray-600 mb-2">{t("pages.firstActionSimulator.premiumInteractiveTool")}</p>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                Master the "What do you do FIRST?" questions that define nursing exams. Practice clinical prioritization with tier-scoped scenarios designed for RPN, RN, and NP learners.
              </p>
              <LocaleLink href="/pricing">
                <Button className="rounded-full px-8 h-12 gap-2 bg-primary text-white hover:brightness-110 shadow-lg" data-testid="button-upgrade">
                  <Sparkles className="w-4 h-4" />
                  View Subscription Plans
                </Button>
              </LocaleLink>
              {!user && (
                <p className="text-xs text-gray-400 mt-4">
                  Already subscribed? <LocaleLink href="/login" className="text-primary hover:underline">{t("pages.firstActionSimulator.signIn")}</LocaleLink> to access.
                </p>
              )}
            </div>
          </div>
        ) : !selectedTier ? (
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-page-title">
                    First Action Simulator
                  </h1>
                  <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
                    Prioritization Training
                  </p>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mt-4">
                "What do you do FIRST?"  -  the most common and most missed exam question type.
                Select your tier to practice clinical prioritization with realistic patient scenarios.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-1.5 bg-gray-50 rounded-full p-1 border border-gray-100">
                <Globe className="w-3.5 h-3.5 text-gray-400 ml-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCountryChange("CA")}
                  className={`h-7 px-3 rounded-full text-xs font-bold ${country === "CA" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                  data-testid="button-country-ca"
                >
                  CA
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCountryChange("US")}
                  className={`h-7 px-3 rounded-full text-xs font-bold ${country === "US" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                  data-testid="button-country-us"
                >
                  US
                </Button>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 rounded-full p-1 border border-gray-100">
                <Ruler className="w-3.5 h-3.5 text-gray-400 ml-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUnitMode("metric")}
                  className={`h-7 px-3 rounded-full text-xs font-bold ${unitMode === "metric" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                  data-testid="button-unit-metric"
                >
                  Metric
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUnitMode("imperial")}
                  className={`h-7 px-3 rounded-full text-xs font-bold ${unitMode === "imperial" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                  data-testid="button-unit-imperial"
                >
                  Imperial
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {(["rpn", "rn", "np"] as Tier[]).map((tier) => {
                const config = tierLabels[tier];
                const count = scenarios.filter((s) => s.tier === tier).length;
                return (
                  <Card
                    key={tier}
                    className="border border-gray-100 bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedTier(tier)}
                    data-testid={`card-tier-${tier}`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <Stethoscope className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {config.label}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">{config.description}</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <span>{count} scenarios</span>
                        <span>·</span>
                        <span>{t("pages.firstActionSimulator.progressiveDifficulty")}</span>
                      </div>
                      <Button className="mt-4 rounded-full gap-2 bg-primary text-white hover:brightness-110 w-full" data-testid={`button-start-${tier}`}>
                        Start Simulation
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : simulationResults ? (
          <SummaryScreen
            results={simulationResults}
            tierScenarios={tierScenarios}
            onRestart={handleRestart}
            onChangeTier={handleChangeTier}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <Button
                variant="ghost"
                className="gap-2 text-gray-500 hover:text-primary text-sm -ml-2"
                onClick={handleChangeTier}
                data-testid="button-back-tiers"
              >
                ← All Tiers
              </Button>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-full p-1 border border-gray-100">
                  <Globe className="w-3.5 h-3.5 text-gray-400 ml-2" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCountryChange("CA")}
                    className={`h-7 px-3 rounded-full text-xs font-bold ${country === "CA" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                    data-testid="button-country-ca-sim"
                  >
                    CA
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCountryChange("US")}
                    className={`h-7 px-3 rounded-full text-xs font-bold ${country === "US" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                    data-testid="button-country-us-sim"
                  >
                    US
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-full p-1 border border-gray-100">
                  <Ruler className="w-3.5 h-3.5 text-gray-400 ml-2" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUnitMode("metric")}
                    className={`h-7 px-3 rounded-full text-xs font-bold ${unitMode === "metric" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                    data-testid="button-unit-metric-sim"
                  >
                    Metric
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUnitMode("imperial")}
                    className={`h-7 px-3 rounded-full text-xs font-bold ${unitMode === "imperial" ? "bg-white shadow-sm text-primary" : "text-gray-400"}`}
                    data-testid="button-unit-imperial-sim"
                  >
                    Imperial
                  </Button>
                </div>
              </div>
            </div>
            <ScenarioRunner
              tierScenarios={tierScenarios}
              tier={selectedTier}
              unitMode={unitMode}
              onFinish={handleFinish}
            />
          </div>
        )}
      </main>
      <AdminEditButton pageName="first-action-simulator" />
      <Footer />
    </div>
  );
}
