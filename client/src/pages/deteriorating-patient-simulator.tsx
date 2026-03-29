import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useEffect, useCallback, useMemo } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Wind,
  Brain,
  Thermometer,
  Droplets,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Clock,
  Lock,
  Sparkles,
  Shield,
  TrendingDown,
  Timer,
  Flag,
  Award,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  convertTemp,
  formatBP,
  formatHR,
  formatRR,
  formatSpO2,
  type CountryMode,
  type UnitMode,
  getDefaultUnitMode,
} from "@/lib/unit-conversion";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
interface VitalSigns {
  hr: number;
  bpSystolic: number;
  bpDiastolic: number;
  rr: number;
  spo2: number;
  tempC: number;
}

interface StageData {
  vitals: VitalSigns;
  mentalStatus: string;
  urineOutput: string;
  painLevel: number;
  narrative: string;
  redFlags: string[];
  urgentProblem: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  };
  priorityAction: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  };
  escalation: {
    question: string;
    shouldEscalate: boolean;
    rationale: string;
  };
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  history: string;
  meds: string;
  allergies: string;
  patientAge: number;
  patientSex: string;
  stages: StageData[];
}

const scenarios: Scenario[] = [
  {
    id: "sepsis",
    title: "Sepsis Progression",
    description: "Recognize SIRS → sepsis → septic shock escalation in a post-surgical patient.",
    history: "68 y/o female, POD 2 from bowel resection. PMHx: DM2, HTN. Complains of feeling unwell.",
    meds: "Metformin 500 mg BID, Lisinopril 10 mg daily, Cefazolin 1 g IV q8h",
    allergies: "Sulfa (rash)",
    patientAge: 68,
    patientSex: "Female",
    stages: [
      {
        vitals: { hr: 102, bpSystolic: 128, bpDiastolic: 76, rr: 20, spo2: 96, tempC: 38.2 },
        mentalStatus: "Alert, oriented x4, slightly fatigued",
        urineOutput: "40 mL/hr",
        painLevel: 4,
        narrative: "Patient reports feeling warm and achy. Incision site slightly erythematous. Nurse notes mild tachycardia on routine vitals.",
        redFlags: ["Low-grade fever (38.2°C)", "Mild tachycardia (HR 102)"],
        urgentProblem: {
          question: "What is the most urgent concern at this time?",
          options: [
            "Possible early SIRS/infection  -  fever + tachycardia post-op",
            "Pain management  -  patient rates pain 4/10",
            "Fluid overload  -  elevated BP",
            "Anxiety  -  patient reports feeling unwell",
          ],
          correctIndex: 0,
          rationale: "Two SIRS criteria are met (temp >38°C, HR >90). In a post-op patient, this warrants immediate assessment for infection source. Early recognition of sepsis is critical for survival.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Administer PRN acetaminophen for fever",
            "Perform focused assessment: incision site, lung sounds, abdomen, IV sites",
            "Increase IV fluid rate",
            "Reposition patient for comfort",
          ],
          correctIndex: 1,
          rationale: "Always assess before intervening. A focused assessment will help identify the infection source. Acetaminophen may mask fever trends needed for diagnosis.",
        },
        escalation: {
          question: "Should you notify the provider at this time?",
          shouldEscalate: true,
          rationale: "Yes  -  two SIRS criteria in a post-op patient warrants provider notification. Early sepsis management (blood cultures, lactate, antibiotics within 1 hour) dramatically improves outcomes.",
        },
      },
      {
        vitals: { hr: 118, bpSystolic: 98, bpDiastolic: 62, rr: 24, spo2: 94, tempC: 39.1 },
        mentalStatus: "Oriented x4 but increasingly restless and confused about time",
        urineOutput: "25 mL/hr",
        painLevel: 6,
        narrative: "Two hours later. Patient now febrile to 39.1°C. BP has dropped. Incision site shows purulent drainage. Patient is restless and asking repeated questions.",
        redFlags: ["Hypotension (BP 98/62)", "Fever escalation (39.1°C)", "Decreasing urine output", "New confusion"],
        urgentProblem: {
          question: "What is the most urgent concern now?",
          options: [
            "Sepsis with possible progression  -  hypotension + infection signs",
            "Dehydration  -  decreased urine output",
            "Wound dehiscence  -  purulent drainage",
            "Medication side effect  -  restlessness from cefazolin",
          ],
          correctIndex: 0,
          rationale: "The combination of infection source (purulent wound), hypotension, tachycardia, fever, and altered mental status indicates sepsis progression. This requires immediate sepsis bundle initiation.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Obtain wound culture and apply new dressing",
            "Initiate IV fluid bolus (30 mL/kg crystalloid) and draw blood cultures + lactate",
            "Administer morphine for increasing pain",
            "Place cooling blanket for fever management",
          ],
          correctIndex: 1,
          rationale: "Sepsis bundle: IV fluids (30 mL/kg), blood cultures x2, serum lactate, and broad-spectrum antibiotics within 1 hour. Fluid resuscitation addresses hypotension while cultures guide treatment.",
        },
        escalation: {
          question: "Should you activate rapid response?",
          shouldEscalate: true,
          rationale: "Yes  -  the patient meets sepsis criteria with organ dysfunction (hypotension, altered mental status, decreased UO). Rapid response ensures timely interventions and possible ICU transfer.",
        },
      },
      {
        vitals: { hr: 130, bpSystolic: 78, bpDiastolic: 48, rr: 28, spo2: 91, tempC: 39.8 },
        mentalStatus: "Confused, oriented to person only, lethargic",
        urineOutput: "10 mL/hr",
        painLevel: 3,
        narrative: "Despite initial fluid bolus, BP continues to drop. Patient now lethargic and confused. Lactate returns at 4.8 mmol/L. Skin is mottled on extremities.",
        redFlags: ["Severe hypotension (BP 78/48)", "Lactate >4 mmol/L", "Altered LOC  -  oriented to person only", "SpO2 dropping (91%)", "Mottled skin"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Septic shock  -  refractory hypotension despite fluids",
            "Respiratory failure  -  SpO2 91%",
            "Acute kidney injury  -  oliguria",
            "Pain crisis  -  patient groaning",
          ],
          correctIndex: 0,
          rationale: "Septic shock is defined by sepsis with persistent hypotension requiring vasopressors despite adequate fluid resuscitation, AND lactate >2 mmol/L. This patient has refractory hypotension with lactate of 4.8.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Continue IV fluid bolus and recheck BP in 30 minutes",
            "Prepare for vasopressor initiation (norepinephrine) and ensure central line access",
            "Apply high-flow oxygen and prepare for intubation",
            "Obtain repeat blood cultures",
          ],
          correctIndex: 1,
          rationale: "With refractory hypotension despite fluids, vasopressors (norepinephrine first-line) are indicated. Central line access is needed for vasopressor administration. Oxygen is important but perfusion (C) takes priority when shock is the primary issue.",
        },
        escalation: {
          question: "Should the patient be transferred to ICU?",
          shouldEscalate: true,
          rationale: "Absolutely  -  septic shock requires ICU-level monitoring: continuous arterial BP, central venous access, vasopressors, and possible mechanical ventilation. Delay in ICU transfer increases mortality.",
        },
      },
    ],
  },
  {
    id: "respiratory-failure",
    title: "Acute Respiratory Failure (COPD Exacerbation)",
    description: "Manage progressive respiratory deterioration with oxygen titration and escalation decisions.",
    history: "72 y/o male, known COPD (GOLD Stage III). Admitted for acute exacerbation with productive cough x 3 days.",
    meds: "Tiotropium 18 mcg daily, Salbutamol PRN, Prednisone 40 mg daily (started 2 days ago), Azithromycin 250 mg daily",
    allergies: "NKDA",
    patientAge: 72,
    patientSex: "Male",
    stages: [
      {
        vitals: { hr: 96, bpSystolic: 142, bpDiastolic: 84, rr: 22, spo2: 91, tempC: 37.4 },
        mentalStatus: "Alert, oriented x4, speaking in short sentences",
        urineOutput: "35 mL/hr",
        painLevel: 2,
        narrative: "Patient sitting upright, using pursed-lip breathing. Audible wheezing bilaterally. Speaking in short sentences. Productive cough with yellow-green sputum.",
        redFlags: ["SpO2 91%  -  below target for COPD", "Elevated RR (22)", "Speaking in short sentences only"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Airway/Breathing  -  worsening respiratory status with hypoxemia",
            "Infection  -  yellow-green sputum",
            "Hypertension  -  BP 142/84",
            "Dehydration  -  needs fluid assessment",
          ],
          correctIndex: 0,
          rationale: "ABCs  -  Breathing is the priority. SpO2 of 91% in a COPD patient indicates worsening hypoxemia. However, remember that COPD patients should have a target SpO2 of 88-92% to avoid suppressing hypoxic drive.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Apply high-flow oxygen at 15 L/min via non-rebreather mask",
            "Titrate oxygen via nasal cannula to target SpO2 88-92% and administer scheduled bronchodilator",
            "Obtain sputum culture before any intervention",
            "Administer PRN salbutamol and reassess in 2 hours",
          ],
          correctIndex: 1,
          rationale: "For COPD patients, oxygen must be titrated carefully (target 88-92%) to avoid CO2 narcosis from suppressing hypoxic drive. High-flow O2 is dangerous in COPD. Bronchodilator therapy is indicated for acute exacerbation.",
        },
        escalation: {
          question: "Should you notify the respiratory therapist/provider?",
          shouldEscalate: true,
          rationale: "Yes  -  worsening COPD exacerbation requires collaborative management. RT can optimize bronchodilator therapy and assess for non-invasive ventilation (NIV) need.",
        },
      },
      {
        vitals: { hr: 110, bpSystolic: 150, bpDiastolic: 90, rr: 28, spo2: 87, tempC: 37.6 },
        mentalStatus: "Alert but anxious, using accessory muscles, tripod positioning",
        urineOutput: "30 mL/hr",
        painLevel: 3,
        narrative: "Despite bronchodilators and titrated O2, patient is worsening. Using accessory muscles (sternocleidomastoid, intercostals). Tripod positioning. Speaking in 2-3 word phrases only. ABG shows: pH 7.32, PaCO2 55, PaO2 58, HCO3 28.",
        redFlags: ["SpO2 87%  -  below target", "Rising RR (28)", "Accessory muscle use", "Respiratory acidosis on ABG", "Speaking in 2-3 word phrases"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Impending respiratory failure  -  worsening despite treatment",
            "Metabolic acidosis  -  pH 7.32",
            "Hypertension crisis  -  BP 150/90",
            "Anxiety  -  patient appears agitated",
          ],
          correctIndex: 0,
          rationale: "The ABG shows acute-on-chronic respiratory acidosis (elevated PaCO2 with partially compensated HCO3). Combined with clinical signs of respiratory distress (accessory muscles, tripod, inability to speak in sentences), this patient is heading toward respiratory failure.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Increase oxygen to 100% via non-rebreather  -  patient is hypoxic",
            "Initiate non-invasive ventilation (BiPAP) and notify physician for potential intubation",
            "Administer lorazepam for anxiety  -  patient is distressed",
            "Obtain chest X-ray before any changes",
          ],
          correctIndex: 1,
          rationale: "BiPAP (NIV) reduces work of breathing and helps with CO2 clearance in acute COPD exacerbation with respiratory acidosis. High-flow O2 can worsen CO2 retention. Benzodiazepines can depress respiratory drive  -  contraindicated.",
        },
        escalation: {
          question: "Should you call a rapid response/code?",
          shouldEscalate: true,
          rationale: "Yes  -  this patient needs immediate escalation. NIV should be initiated urgently, and the ICU team should be notified for potential intubation if NIV fails. Delaying escalation in respiratory failure increases intubation risk and mortality.",
        },
      },
      {
        vitals: { hr: 120, bpSystolic: 158, bpDiastolic: 92, rr: 34, spo2: 82, tempC: 37.8 },
        mentalStatus: "Drowsy, confused, difficult to rouse  -  possible CO2 narcosis",
        urineOutput: "20 mL/hr",
        painLevel: 1,
        narrative: "Patient becomes increasingly drowsy despite BiPAP at 12/5. No longer responding to verbal commands. Paradoxical breathing noted. Repeat ABG: pH 7.25, PaCO2 72, PaO2 52.",
        redFlags: ["SpO2 82%  -  critically low", "CO2 narcosis  -  decreasing LOC", "Paradoxical breathing", "Severe respiratory acidosis pH 7.25"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Airway compromise  -  CO2 narcosis with decreasing consciousness",
            "Cardiac arrhythmia  -  tachycardia HR 120",
            "Renal failure  -  decreased urine output",
            "Pneumonia  -  worsening infection",
          ],
          correctIndex: 0,
          rationale: "CO2 narcosis (PaCO2 72) is causing decreased LOC. An unconscious patient cannot protect their airway. This is a life-threatening emergency requiring immediate airway management (intubation). ABCs  -  Airway is the priority.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Increase BiPAP settings and continue monitoring",
            "Prepare for emergent intubation  -  bag-valve-mask ventilation, call anesthesia/RT",
            "Administer IV methylprednisolone bolus",
            "Suction airway and reposition patient",
          ],
          correctIndex: 1,
          rationale: "NIV has failed (worsening acidosis, decreased LOC). The patient needs emergent intubation and mechanical ventilation. Bag-valve-mask ventilation provides bridge oxygenation while preparing for intubation. Continuing BiPAP in an obtunded patient risks aspiration.",
        },
        escalation: {
          question: "Is this a code/emergency situation?",
          shouldEscalate: true,
          rationale: "Yes  -  this is a respiratory emergency. Call for emergent airway management (code blue/MET call). The patient needs intubation, ICU admission, and mechanical ventilation.",
        },
      },
    ],
  },
  {
    id: "hemorrhage",
    title: "Hypovolemia / Post-op Hemorrhage",
    description: "Identify early signs of hemorrhagic shock in a post-operative patient.",
    history: "55 y/o male, POD 1 from total hip replacement. PMHx: Afib (on warfarin, held pre-op, bridged with heparin).",
    meds: "Heparin drip (currently infusing), Enoxaparin 40 mg SC daily (held), Acetaminophen 1 g q6h, Hydromorphone 0.5 mg IV PRN",
    allergies: "Penicillin (anaphylaxis)",
    patientAge: 55,
    patientSex: "Male",
    stages: [
      {
        vitals: { hr: 104, bpSystolic: 118, bpDiastolic: 72, rr: 18, spo2: 97, tempC: 36.8 },
        mentalStatus: "Alert, oriented x4, mildly anxious and restless",
        urineOutput: "30 mL/hr",
        painLevel: 5,
        narrative: "Patient pressing call bell frequently, reports feeling anxious and 'not right.' Surgical dressing intact but nurse notes small amount of oozing. Skin slightly pale and cool to touch.",
        redFlags: ["Tachycardia (HR 104)", "Unexplained restlessness/anxiety", "Oozing surgical site", "Pale, cool skin"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Possible early hemorrhage  -  tachycardia + restlessness + oozing in anticoagulated patient",
            "Post-operative anxiety  -  patient is scared",
            "Pain management  -  patient is uncomfortable",
            "Medication error  -  heparin infusion needs adjustment",
          ],
          correctIndex: 0,
          rationale: "In a patient bridged with heparin after hip replacement, tachycardia and restlessness are classic EARLY signs of hemorrhage. Anxiety and restlessness are the body's response to hypovolemia (sympathetic activation). Always think 'bleeding' before 'anxiety' post-op.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Administer PRN hydromorphone for pain and anxiety",
            "Assess surgical site (check under dressing, check drain output), check CBC and coagulation studies",
            "Apply ice to surgical site",
            "Encourage deep breathing for anxiety",
          ],
          correctIndex: 1,
          rationale: "Assess first. Check the surgical site for active bleeding, quantify drain output, and obtain stat CBC + INR/PTT to evaluate blood loss and coagulation status. Opioids can mask hemorrhage symptoms.",
        },
        escalation: {
          question: "Should you notify the surgeon?",
          shouldEscalate: true,
          rationale: "Yes  -  a post-op patient on anticoagulation with tachycardia, restlessness, and oozing needs immediate surgeon notification. The heparin drip may need to be held or reversed with protamine.",
        },
      },
      {
        vitals: { hr: 120, bpSystolic: 96, bpDiastolic: 58, rr: 22, spo2: 95, tempC: 36.4 },
        mentalStatus: "Confused, oriented x2 (person, place), increasingly agitated",
        urineOutput: "15 mL/hr",
        painLevel: 6,
        narrative: "Dressing now saturated with blood. Drain output 400 mL in last 2 hours (was 50 mL/hr previously). Hgb returned at 72 g/L (was 110 pre-op). INR 3.2, PTT 82 seconds.",
        redFlags: ["Hypotension (BP 96/58)", "Significant blood loss (drain 400 mL/2hr)", "Hgb drop to 72 g/L", "Elevated INR/PTT", "New confusion"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Hemorrhagic shock  -  active bleeding with hemodynamic instability",
            "Coagulopathy  -  INR 3.2 needs vitamin K",
            "Anemia  -  Hgb 72 needs transfusion",
            "Delirium  -  new confusion needs assessment",
          ],
          correctIndex: 0,
          rationale: "The patient is in Class II-III hemorrhagic shock: tachycardia >120, hypotension, altered mental status, decreased UO, and significant blood loss. The coagulopathy is contributing to bleeding but treating shock is the priority.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Administer vitamin K IV to correct INR",
            "Stop heparin drip, apply direct pressure, establish large-bore IV access, initiate rapid fluid resuscitation",
            "Type and screen for blood products",
            "Elevate the affected limb",
          ],
          correctIndex: 1,
          rationale: "Stop the source of coagulopathy (heparin drip), control bleeding (direct pressure), and restore volume (large-bore IV + crystalloid). Type and screen is needed but volume resuscitation cannot wait.",
        },
        escalation: {
          question: "Should you call rapid response/code?",
          shouldEscalate: true,
          rationale: "Yes  -  hemorrhagic shock requires immediate team response. The surgeon needs to evaluate for surgical bleeding, blood bank for possible massive transfusion protocol, and consider protamine for heparin reversal.",
        },
      },
      {
        vitals: { hr: 138, bpSystolic: 74, bpDiastolic: 42, rr: 30, spo2: 90, tempC: 35.8 },
        mentalStatus: "Obtunded, responds to painful stimuli only",
        urineOutput: "5 mL/hr (anuric)",
        painLevel: 0,
        narrative: "Despite 2L crystalloid bolus, BP continues to deteriorate. Massive transfusion protocol activated. Patient now barely responsive. Extremities cold and mottled. Repeat Hgb 58 g/L.",
        redFlags: ["Severe hypotension (BP 74/42)", "Obtunded  -  responds to pain only", "Hypothermia (35.8°C)", "Near-anuric", "SpO2 dropping to 90%"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Class IV hemorrhagic shock  -  immediately life-threatening",
            "Hypothermia  -  temperature 35.8°C",
            "Respiratory compromise  -  SpO2 90%",
            "Acute kidney injury  -  anuric",
          ],
          correctIndex: 0,
          rationale: "Class IV hemorrhagic shock (>40% blood volume loss): obtunded, severely hypotensive, tachycardic, anuric. The lethal triad of hypothermia, acidosis, and coagulopathy is developing. This is immediately life-threatening.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Continue crystalloid resuscitation at maximum rate",
            "Transfuse PRBCs + FFP via rapid infuser, prepare for emergent OR for surgical hemostasis",
            "Administer vasopressors to support blood pressure",
            "Obtain CT angiography to locate bleeding source",
          ],
          correctIndex: 1,
          rationale: "In massive hemorrhage, blood products (PRBCs, FFP, platelets in 1:1:1 ratio) are the priority over crystalloid. Surgical hemostasis is the definitive treatment. Vasopressors without volume are futile. CT delays definitive management.",
        },
        escalation: {
          question: "Is this a surgical emergency?",
          shouldEscalate: true,
          rationale: "Yes  -  emergent return to OR for surgical hemostasis is likely required. Massive transfusion protocol should continue. The patient needs surgical team, anesthesia, and OR immediately.",
        },
      },
    ],
  },
  {
    id: "opioid-oversedation",
    title: "Opioid Over-sedation",
    description: "Recognize progressive opioid-induced respiratory depression and intervene appropriately.",
    history: "78 y/o female, POD 1 from open cholecystectomy. PMHx: CKD Stage 3, Osteoarthritis. Opioid-naive. Received multiple doses of morphine for pain.",
    meds: "Morphine 4 mg IV q3h PRN (received 3 doses in 8 hours), Ondansetron 4 mg IV PRN, Cefazolin 1 g IV q8h",
    allergies: "Codeine (nausea/vomiting)",
    patientAge: 78,
    patientSex: "Female",
    stages: [
      {
        vitals: { hr: 68, bpSystolic: 110, bpDiastolic: 68, rr: 14, spo2: 95, tempC: 36.6 },
        mentalStatus: "Drowsy but arousable, oriented x4 when stimulated",
        urineOutput: "25 mL/hr",
        painLevel: 2,
        narrative: "Patient difficult to rouse for vital signs. When awakened, reports pain is well-controlled (2/10). Nurse notes patient is very drowsy between assessments. Last morphine dose given 45 minutes ago.",
        redFlags: ["Excessive sedation  -  opioid-naive elderly patient", "RR at lower end of normal (14)", "Drowsiness between assessments"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Over-sedation  -  elderly opioid-naive patient with excessive drowsiness after multiple morphine doses",
            "Pain managed well  -  pain 2/10 is the goal",
            "Hypotension  -  BP 110/68 is low for elderly",
            "UTI risk  -  decreased urine output",
          ],
          correctIndex: 0,
          rationale: "An opioid-naive 78 y/o with CKD (delayed drug clearance) who received 12 mg morphine in 8 hours is at HIGH risk for respiratory depression. Excessive sedation precedes respiratory arrest. RASS sedation scale assessment is critical.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Let patient sleep  -  pain is controlled",
            "Assess sedation level (RASS/Pasero), hold further opioid doses, increase monitoring frequency",
            "Administer naloxone 0.4 mg IV immediately",
            "Switch to PCA pump for better pain control",
          ],
          correctIndex: 1,
          rationale: "Assess sedation level using validated tool (RASS or Pasero). Hold opioids when sedation precedes respiratory depression. Naloxone is not yet indicated (RR >12, protecting airway). Increasing monitoring to q15-30 min is essential.",
        },
        escalation: {
          question: "Should you notify the provider?",
          shouldEscalate: true,
          rationale: "Yes  -  notify the provider about over-sedation in an opioid-naive elderly patient with CKD. Morphine dose needs adjustment (reduce by 50% or switch to safer alternative). Naloxone should be at bedside.",
        },
      },
      {
        vitals: { hr: 62, bpSystolic: 100, bpDiastolic: 60, rr: 10, spo2: 90, tempC: 36.4 },
        mentalStatus: "Somnolent, difficult to arouse with verbal stimuli. Responds to sternal rub.",
        urineOutput: "15 mL/hr",
        painLevel: 0,
        narrative: "Thirty minutes later, patient not responding to name or gentle stimulation. Pinpoint pupils noted. Respiratory rate dropped to 10. Shallow, irregular breaths. Responds only to sternal rub.",
        redFlags: ["Respiratory depression (RR 10)", "SpO2 dropping (90%)", "Pinpoint pupils  -  classic opioid sign", "Somnolent  -  responds to pain only"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Opioid-induced respiratory depression  -  life-threatening",
            "Hypotension  -  BP 100/60",
            "Post-op ileus  -  decreased bowel sounds",
            "Stroke  -  sudden decreased LOC",
          ],
          correctIndex: 0,
          rationale: "Classic opioid toxicity triad: respiratory depression (RR 10), decreased LOC (somnolent), pinpoint pupils. This is a medical emergency. Without intervention, respiratory arrest will follow.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Call physician and await orders",
            "Administer naloxone 0.04-0.4 mg IV, stimulate patient, support airway (jaw thrust, head tilt)",
            "Apply high-flow oxygen and continue monitoring",
            "Obtain stat CT head to rule out stroke",
          ],
          correctIndex: 1,
          rationale: "Naloxone (Narcan) is the opioid antagonist  -  start low dose (0.04 mg in elderly/post-op to avoid complete reversal causing severe pain and sympathetic surge). Titrate to RR >12. Support airway simultaneously. Do not delay for orders in emergency.",
        },
        escalation: {
          question: "Should you call rapid response?",
          shouldEscalate: true,
          rationale: "Yes  -  opioid-induced respiratory depression with RR 10 and SpO2 90% requires rapid response activation. The patient may need bag-valve-mask ventilation if naloxone response is inadequate.",
        },
      },
      {
        vitals: { hr: 54, bpSystolic: 88, bpDiastolic: 50, rr: 6, spo2: 82, tempC: 36.2 },
        mentalStatus: "Unresponsive, no response to stimuli, cyanotic",
        urineOutput: "0 mL/hr",
        painLevel: 0,
        narrative: "Patient found unresponsive by nurse entering room. Lips cyanotic. Agonal breathing at rate of 6. Pulse weak and thready. Naloxone not yet administered. Crash cart at bedside.",
        redFlags: ["Near respiratory arrest (RR 6)", "Severe hypoxemia (SpO2 82%)", "Unresponsive  -  no purposeful movement", "Cyanosis", "Agonal breathing"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Airway/Breathing  -  imminent respiratory arrest",
            "Circulation  -  bradycardia HR 54",
            "Neurological  -  unresponsive, possible brain injury",
            "Renal failure  -  anuric",
          ],
          correctIndex: 0,
          rationale: "ABCs: Airway and Breathing are the immediate priority. Agonal breathing at RR 6 with cyanosis indicates imminent respiratory arrest. Without immediate airway management and naloxone, cardiac arrest will follow.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Start CPR  -  patient appears lifeless",
            "Bag-valve-mask ventilation + administer naloxone 0.4 mg IV, repeat q2-3 min. Call code blue.",
            "Intubate immediately",
            "Administer epinephrine 1 mg IV",
          ],
          correctIndex: 1,
          rationale: "BVM ventilation is the immediate priority (patient has a pulse but is not breathing adequately). Naloxone 0.4 mg IV for severe respiratory depression. CPR is only for pulseless patients. Intubation requires team arrival. Epinephrine is for cardiac arrest.",
        },
        escalation: {
          question: "Is this a code blue situation?",
          shouldEscalate: true,
          rationale: "Yes  -  activate code blue/MET call. The patient has agonal breathing and may progress to respiratory arrest within minutes. The team needs to prepare for possible intubation and continued naloxone administration.",
        },
      },
    ],
  },
  {
    id: "anaphylaxis",
    title: "Anaphylaxis",
    description: "Rapid recognition and treatment of anaphylactic reaction post-medication administration.",
    history: "34 y/o female admitted for cellulitis. Newly prescribed IV ceftriaxone. PMHx: Seasonal allergies, mild asthma.",
    meds: "Ceftriaxone 1 g IV q24h (first dose), Flucloxacillin 500 mg PO QID, Salbutamol MDI PRN",
    allergies: "Amoxicillin (childhood rash  -  possible cross-reactivity with cephalosporins)",
    patientAge: 34,
    patientSex: "Female",
    stages: [
      {
        vitals: { hr: 92, bpSystolic: 124, bpDiastolic: 78, rr: 18, spo2: 98, tempC: 36.8 },
        mentalStatus: "Alert, oriented x4, reports feeling 'itchy' and 'warm'",
        urineOutput: "50 mL/hr",
        painLevel: 2,
        narrative: "10 minutes after starting ceftriaxone IV infusion, patient reports generalized itching and feeling flushed. Nurse observes urticaria (hives) developing on chest and arms. No facial swelling yet.",
        redFlags: ["Urticaria during new IV antibiotic", "Known amoxicillin allergy  -  cross-reactivity risk", "Onset within 10 minutes of infusion"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Possible allergic reaction/early anaphylaxis  -  urticaria during cephalosporin infusion with penicillin allergy history",
            "Anxiety  -  patient is nervous about IV medications",
            "Drug fever  -  feeling warm",
            "Contact dermatitis  -  itchy rash",
          ],
          correctIndex: 0,
          rationale: "Urticaria within minutes of starting a cephalosporin in a patient with penicillin allergy history suggests an IgE-mediated allergic reaction. Cross-reactivity between penicillins and cephalosporins is 1-2% but can cause anaphylaxis. This can progress rapidly.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Slow the infusion rate and monitor",
            "Stop the ceftriaxone infusion immediately, maintain IV access with NS, notify provider",
            "Administer diphenhydramine 50 mg IV and continue infusion",
            "Apply calamine lotion to affected areas",
          ],
          correctIndex: 1,
          rationale: "STOP the offending agent immediately. Do NOT slow it  -  stop it completely. Maintain IV access (you may need it for medications). Giving antihistamines while continuing the allergen is dangerous  -  the reaction can progress to anaphylaxis.",
        },
        escalation: {
          question: "Should you notify the provider immediately?",
          shouldEscalate: true,
          rationale: "Yes  -  allergic reaction to IV antibiotic requires immediate provider notification. Alternative antibiotic is needed. Epinephrine and emergency equipment should be at bedside in case of progression.",
        },
      },
      {
        vitals: { hr: 118, bpSystolic: 100, bpDiastolic: 62, rr: 24, spo2: 94, tempC: 37.0 },
        mentalStatus: "Alert but anxious, voice sounds hoarse, reports 'throat feels tight'",
        urineOutput: "40 mL/hr",
        painLevel: 4,
        narrative: "Despite stopping the infusion, symptoms are progressing. Facial and lip swelling noted (angioedema). Voice is becoming hoarse. Patient reports throat tightness. Wheezing audible on auscultation. Urticaria spreading to trunk and legs.",
        redFlags: ["Angioedema (facial/lip swelling)", "Throat tightness  -  impending airway compromise", "Hoarse voice  -  laryngeal edema", "Wheezing  -  bronchospasm", "Hypotension developing (BP 100/62)"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Anaphylaxis  -  airway compromise with angioedema and bronchospasm",
            "Asthma exacerbation  -  wheezing",
            "Anxiety/panic attack  -  throat tightness",
            "Angioedema  -  facial swelling needs antihistamines",
          ],
          correctIndex: 0,
          rationale: "This is anaphylaxis. Two or more body systems are involved: skin (urticaria), respiratory (wheezing, throat tightness, hoarseness), cardiovascular (tachycardia, hypotension). Angioedema + hoarseness = laryngeal edema = airway emergency.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Administer diphenhydramine 50 mg IV and methylprednisolone 125 mg IV",
            "Administer epinephrine 0.3 mg IM (1:1000) into lateral thigh immediately",
            "Administer salbutamol via nebulizer for wheezing",
            "Position patient upright and apply oxygen",
          ],
          correctIndex: 1,
          rationale: "Epinephrine IM is the FIRST-LINE treatment for anaphylaxis  -  it addresses all mechanisms: bronchospasm, vasodilation, and angioedema. Antihistamines and steroids are adjuncts, NOT substitutes. Delay in epinephrine is the #1 cause of anaphylaxis death.",
        },
        escalation: {
          question: "Should you call a code/emergency response?",
          shouldEscalate: true,
          rationale: "Yes  -  anaphylaxis is a medical emergency. Call the code team. The patient may need repeated epinephrine, IV fluid bolus, and emergent airway management if laryngeal edema progresses.",
        },
      },
      {
        vitals: { hr: 140, bpSystolic: 72, bpDiastolic: 40, rr: 32, spo2: 84, tempC: 36.6 },
        mentalStatus: "Confused, diaphoretic, struggling to breathe, stridor audible",
        urineOutput: "10 mL/hr",
        painLevel: 8,
        narrative: "Despite IM epinephrine, patient is worsening. Stridor now audible without stethoscope. Massive facial and tongue swelling. Unable to speak. Diaphoretic with severe hypotension. IV access difficult due to edema.",
        redFlags: ["Stridor  -  critical airway obstruction", "Severe hypotension (BP 72/40)  -  anaphylactic shock", "SpO2 84%  -  severe hypoxemia", "Unable to speak  -  near-complete airway obstruction"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Airway  -  complete airway obstruction imminent from laryngeal edema",
            "Circulation  -  anaphylactic shock",
            "Breathing  -  bronchospasm",
            "Skin  -  worsening urticaria",
          ],
          correctIndex: 0,
          rationale: "ABCs  -  Airway is ALWAYS first when compromised. Stridor indicates critical upper airway obstruction from laryngeal edema. Without immediate airway intervention, complete obstruction and death will follow. Circulation (shock) is second priority.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Repeat epinephrine IM and wait for response",
            "Prepare for emergent airway management (intubation or surgical airway), repeat epinephrine IV 0.1 mg (1:10,000), rapid IV fluid bolus",
            "Nebulized racemic epinephrine for stridor",
            "Administer IV corticosteroids for delayed benefit",
          ],
          correctIndex: 1,
          rationale: "With imminent complete airway obstruction, emergent airway management is priority. Intubation may be extremely difficult with edema  -  surgical airway (cricothyrotomy) must be available. IV epinephrine (1:10,000 dilution) for refractory anaphylaxis. Large-volume IV fluids for distributive shock.",
        },
        escalation: {
          question: "Is this a code blue situation?",
          shouldEscalate: true,
          rationale: "Absolutely  -  this is a life-threatening emergency requiring full code team response. Anesthesia for difficult airway, surgery for possible cricothyrotomy, and ICU for post-resuscitation management.",
        },
      },
    ],
  },
  {
    id: "acute-mi",
    title: "Acute MI with Cardiogenic Shock",
    description: "Manage progressive cardiac emergency from chest pain to cardiogenic shock.",
    history: "62 y/o male, presented to ER with sudden onset crushing chest pain radiating to left arm. PMHx: DM2, hyperlipidemia, 30-pack-year smoking history.",
    meds: "Metformin 1000 mg BID, Atorvastatin 40 mg daily, ASA 81 mg daily",
    allergies: "NKDA",
    patientAge: 62,
    patientSex: "Male",
    stages: [
      {
        vitals: { hr: 96, bpSystolic: 148, bpDiastolic: 92, rr: 20, spo2: 96, tempC: 36.8 },
        mentalStatus: "Alert, anxious, diaphoretic, clutching chest",
        urineOutput: "40 mL/hr",
        painLevel: 8,
        narrative: "Patient arrived 20 minutes ago with crushing substernal chest pain 8/10 radiating to left arm and jaw. Diaphoretic, pale, and anxious. ECG shows ST elevation in leads II, III, aVF (inferior STEMI). Troponin pending.",
        redFlags: ["ST elevation on ECG  -  STEMI", "Severe chest pain 8/10 with radiation", "Diaphoresis  -  autonomic response to MI", "Multiple cardiac risk factors"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Acute STEMI  -  myocardial tissue is dying, time-dependent emergency",
            "Hypertension  -  BP 148/92 needs treatment",
            "Anxiety  -  patient needs anxiolytic",
            "Pain management  -  pain 8/10 needs opioids",
          ],
          correctIndex: 0,
          rationale: "'Time is muscle'  -  every minute of coronary occlusion results in more myocardial death. The goal is door-to-balloon time <90 minutes for PCI. This is the highest priority cardiac emergency.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Administer morphine for chest pain",
            "Initiate MONA protocol: Morphine (if needed), O2 (if SpO2 <94%), Nitroglycerin SL, ASA 325 mg. Activate cath lab.",
            "Obtain chest X-ray first to rule out other causes",
            "Start heparin drip immediately",
          ],
          correctIndex: 1,
          rationale: "STEMI protocol: ASA 325 mg (chew), NTG 0.4 mg SL (check BP first  -  contraindicated if SBP <90), O2 only if SpO2 <94%, and activate the cath lab for emergent PCI. Morphine is used cautiously (can cause hypotension).",
        },
        escalation: {
          question: "Should the cath lab be activated?",
          shouldEscalate: true,
          rationale: "Yes  -  immediate cath lab activation for STEMI. Goal is door-to-balloon <90 minutes. The interventional cardiologist must be notified. Delay in reperfusion directly increases mortality and infarct size.",
        },
      },
      {
        vitals: { hr: 110, bpSystolic: 102, bpDiastolic: 64, rr: 24, spo2: 93, tempC: 36.6 },
        mentalStatus: "Alert but increasingly anxious, diaphoretic, nauseated",
        urineOutput: "25 mL/hr",
        painLevel: 9,
        narrative: "ASA and NTG given. Chest pain has not improved (9/10). BP dropping. New crackles heard at lung bases bilaterally  -  possible pulmonary edema. Patient nauseated with one episode of vomiting. Repeat ECG shows extending ST changes.",
        redFlags: ["Chest pain not relieved by NTG", "BP dropping (102/64)", "New bilateral crackles  -  pulmonary edema", "SpO2 dropping (93%)", "Extending ST changes  -  ongoing infarction"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Developing cardiogenic shock  -  failing pump with pulmonary edema",
            "GI bleeding  -  patient is vomiting",
            "Aspiration risk  -  patient vomiting",
            "Medication failure  -  NTG not working",
          ],
          correctIndex: 0,
          rationale: "NTG-unresponsive chest pain with dropping BP and pulmonary edema indicates significant myocardial damage with developing left ventricular failure. Cardiogenic shock (pump failure) is developing  -  the heart cannot maintain adequate cardiac output.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Give more nitroglycerin  -  chest pain still present",
            "Position upright, apply O2, hold further NTG (SBP approaching 90), prepare for emergent PCI, establish second IV access",
            "Administer furosemide IV for pulmonary edema",
            "Prepare for thrombolytic therapy",
          ],
          correctIndex: 1,
          rationale: "Do NOT give more NTG with falling BP (risk of profound hypotension). Position upright to reduce preload and improve breathing. Emergent PCI is the definitive treatment. Furosemide may help edema but can worsen hypotension. PCI > thrombolytics for STEMI.",
        },
        escalation: {
          question: "Should you expedite transfer to cath lab?",
          shouldEscalate: true,
          rationale: "Yes  -  the patient is deteriorating rapidly. Communicate urgency to cath lab team. Consider intra-aortic balloon pump (IABP) or vasopressor support during transport if hemodynamically unstable.",
        },
      },
      {
        vitals: { hr: 130, bpSystolic: 76, bpDiastolic: 44, rr: 30, spo2: 86, tempC: 36.2 },
        mentalStatus: "Confused, drowsy, clammy and pale, JVD noted",
        urineOutput: "5 mL/hr",
        painLevel: 7,
        narrative: "Patient now in cardiogenic shock. JVD present. Bilateral crackles to mid-lung fields. Skin cold, clammy, and mottled. ST elevation persists. BNP elevated at 1200 pg/mL. Bedside echo shows severe LV dysfunction with EF ~20%.",
        redFlags: ["Cardiogenic shock (BP 76/44)", "Severe pulmonary edema (SpO2 86%)", "EF 20%  -  severe LV failure", "Confusion  -  cerebral hypoperfusion", "JVD + crackles  -  biventricular failure"],
        urgentProblem: {
          question: "What is the most urgent concern?",
          options: [
            "Cardiogenic shock  -  heart cannot maintain perfusion to vital organs",
            "Respiratory failure  -  SpO2 86%",
            "Acute kidney injury  -  near-anuric",
            "Elevated BNP  -  needs diuretics",
          ],
          correctIndex: 0,
          rationale: "Cardiogenic shock is the primary problem driving ALL other organ failures. The heart is the failing pump. SpO2 is low because of pulmonary edema from pump failure. AKI is from poor cardiac output. Treating the underlying pump failure is key.",
        },
        priorityAction: {
          question: "What is your first priority action?",
          options: [
            "Aggressive IV fluid bolus to improve cardiac output",
            "Initiate inotrope/vasopressor support (dobutamine + norepinephrine), prepare for emergent PCI with mechanical circulatory support",
            "Administer high-dose furosemide for pulmonary edema",
            "Begin non-invasive ventilation (BiPAP)",
          ],
          correctIndex: 1,
          rationale: "Cardiogenic shock needs inotropic support (dobutamine) to improve contractility AND vasopressor (norepinephrine) to maintain perfusion pressure. Emergent PCI with possible IABP or Impella is definitive. IV fluids are CONTRAINDICATED  -  the heart cannot handle more volume. BiPAP helps breathing but doesn't fix the pump.",
        },
        escalation: {
          question: "Is this a critical emergency?",
          shouldEscalate: true,
          rationale: "Yes  -  cardiogenic shock has ~50% mortality. The patient needs emergent PCI, mechanical circulatory support, ICU admission, and possible cardiac surgery consultation. Every minute of delay worsens outcomes.",
        },
      },
    ],
  },
];

const examTips = [
  { tip: "Always assess before intervening (unless life-threatening)", icon: "🔍" },
  { tip: "ABCs always come first  -  Airway, Breathing, Circulation", icon: "🫁" },
  { tip: "Don't delay escalation for unstable patients", icon: "📞" },
  { tip: "Tachycardia + restlessness = BLEEDING until proven otherwise in post-op patients", icon: "🩸" },
  { tip: "Treat the patient, not the number  -  correlate vitals with clinical picture", icon: "📊" },
  { tip: "In opioid toxicity: RR is the most important vital sign to monitor", icon: "💊" },
  { tip: "Epinephrine is FIRST-LINE for anaphylaxis  -  antihistamines are adjuncts only", icon: "💉" },
  { tip: "COPD patients: target SpO2 88-92%. High-flow O2 can cause CO2 narcosis", icon: "🌬️" },
  { tip: "Sepsis: blood cultures BEFORE antibiotics, but don't delay antibiotics for cultures", icon: "🦠" },
  { tip: "STEMI: 'Time is muscle'  -  door-to-balloon <90 minutes saves lives", icon: "❤️" },
];

function getVitalStatus(label: string, value: number): "normal" | "abnormal" | "critical" {

  switch (label) {
    case "HR":
      if (value < 50 || value > 130) return "critical";
      if (value < 60 || value > 100) return "abnormal";
      return "normal";
    case "SBP":
      if (value < 80 || value > 180) return "critical";
      if (value < 90 || value > 140) return "abnormal";
      return "normal";
    case "DBP":
      if (value < 40 || value > 110) return "critical";
      if (value < 60 || value > 90) return "abnormal";
      return "normal";
    case "RR":
      if (value < 8 || value > 30) return "critical";
      if (value < 12 || value > 20) return "abnormal";
      return "normal";
    case "SpO2":
      if (value < 85) return "critical";
      if (value < 94) return "abnormal";
      return "normal";
    case "Temp":
      if (value < 35.5 || value > 39.5) return "critical";
      if (value < 36.0 || value > 38.0) return "abnormal";
      return "normal";
    case "Pain":
      if (value >= 8) return "critical";
      if (value >= 4) return "abnormal";
      return "normal";
    default:
      return "normal";
  }
}

const statusColors = {
  normal: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", label: "text-emerald-500", icon: "text-emerald-400" },
  abnormal: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "text-amber-500", icon: "text-amber-400" },
  critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "text-red-500", icon: "text-red-400" },
};

function VitalsDashboard({
  vitals,
  painLevel,
  unitMode,
}: {
  vitals: VitalSigns;
  painLevel: number;
  unitMode: UnitMode;
}) {
  const items = [
    { label: "HR", displayLabel: "Heart Rate", value: vitals.hr, display: formatHR(vitals.hr), icon: Heart, statusKey: "HR" },
    { label: "BP", displayLabel: "Blood Pressure", value: vitals.bpSystolic, display: formatBP(vitals.bpSystolic, vitals.bpDiastolic), icon: Activity, statusKey: "SBP" },
    { label: "RR", displayLabel: "Resp Rate", value: vitals.rr, display: formatRR(vitals.rr), icon: Wind, statusKey: "RR" },
    { label: "SpO2", displayLabel: "Oxygen Sat", value: vitals.spo2, display: formatSpO2(vitals.spo2), icon: Droplets, statusKey: "SpO2" },
    { label: "Temp", displayLabel: "Temperature", value: vitals.tempC, display: convertTemp(vitals.tempC, unitMode), icon: Thermometer, statusKey: "Temp" },
    { label: "Pain", displayLabel: "Pain Level", value: painLevel, display: `${painLevel}/10`, icon: Zap, statusKey: "Pain" },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" data-testid="vitals-dashboard">
      {items.map((item) => {
        const status = getVitalStatus(item.statusKey, item.value);
        const colors = statusColors[status];
        return (
          <div
            key={item.label}
            className={`text-center p-3 rounded-xl border ${colors.bg} ${colors.border} transition-all`}
            data-testid={`vital-${item.label.toLowerCase()}`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <item.icon className={`w-3.5 h-3.5 ${colors.icon}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.label}`}>
                {item.label}
              </span>
            </div>
            <div className={`text-lg font-bold ${colors.text}`}>{item.display}</div>
            <div className="text-[10px] text-gray-400">{item.displayLabel}</div>
          </div>
        );
      })}
    </div>
  );
}

function StageTimer({ isActive, elapsed }: { isActive: boolean; elapsed: number }) {
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeBonus = elapsed <= 30 ? "Excellent" : elapsed <= 60 ? "Good" : elapsed <= 120 ? "Fair" : "Slow";
  const bonusColor = elapsed <= 30 ? "text-emerald-600" : elapsed <= 60 ? "text-blue-600" : elapsed <= 120 ? "text-amber-600" : "text-red-600";

  return (
    <div className="flex items-center gap-3" data-testid="stage-timer">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isActive ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}>
        <Timer className={`w-3.5 h-3.5 ${isActive ? "text-blue-500 animate-pulse" : "text-gray-400"}`} />
        <span className={`text-sm font-mono font-bold ${isActive ? "text-blue-700" : "text-gray-500"}`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      {!isActive && (
        <span className={`text-xs font-semibold ${bonusColor}`} data-testid="time-bonus">
          {timeBonus}
        </span>
      )}
    </div>
  );
}

function QuestionBlock({
  question,
  options,
  correctIndex,
  rationale,
  selectedIndex,
  onSelect,
  label,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  selectedIndex: number | null;
  onSelect: (idx: number) => void;
  label: string;
}) {
  const revealed = selectedIndex !== null;
  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className="space-y-3" data-testid={`question-block-${label}`}>
      <p className="text-sm font-bold text-gray-900">{question}</p>
      <div className="space-y-2">
        {options.map((opt, idx) => {
          let borderClass = "border-gray-100 hover:border-primary/30 cursor-pointer";
          if (revealed) {
            if (idx === correctIndex) borderClass = "border-emerald-300 bg-emerald-50/50";
            else if (idx === selectedIndex && idx !== correctIndex) borderClass = "border-red-300 bg-red-50/50";
            else borderClass = "border-gray-100 opacity-60";
          }

          return (
            <div
              key={idx}
              className={`border-2 rounded-lg p-3 transition-all ${borderClass}`}
              onClick={() => !revealed && onSelect(idx)}
              data-testid={`option-${label}-${idx}`}
            >
              <div className="flex items-start gap-3">
                {revealed ? (
                  idx === correctIndex ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : idx === selectedIndex ? (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0 mt-0.5" />
                  )
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-gray-700">{opt}</p>
              </div>
            </div>
          );
        })}
      </div>
      {revealed && (
        <div className={`rounded-lg p-4 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`} data-testid={`rationale-${label}`}>
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">{t("pages.deterioratingPatientSimulator.rationale")}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{rationale}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EscalationBlock({
  question,
  shouldEscalate,
  rationale,
  selectedAnswer,
  onSelect,
}: {
  question: string;
  shouldEscalate: boolean;
  rationale: string;
  selectedAnswer: boolean | null;
  onSelect: (answer: boolean) => void;
}) {
  const revealed = selectedAnswer !== null;
  const isCorrect = selectedAnswer === shouldEscalate;

  return (
    <div className="space-y-3" data-testid="escalation-block">
      <p className="text-sm font-bold text-gray-900">{question}</p>
      <div className="flex gap-3">
        {[true, false].map((val) => {
          let cls = "border-gray-100 hover:border-primary/30 cursor-pointer";
          if (revealed) {
            if (val === shouldEscalate) cls = "border-emerald-300 bg-emerald-50/50";
            else if (val === selectedAnswer && val !== shouldEscalate) cls = "border-red-300 bg-red-50/50";
            else cls = "border-gray-100 opacity-60";
          }
          return (
            <div
              key={String(val)}
              className={`flex-1 border-2 rounded-lg p-3 text-center transition-all ${cls}`}
              onClick={() => !revealed && onSelect(val)}
              data-testid={`escalation-${val ? "yes" : "no"}`}
            >
              <p className="text-sm font-semibold text-gray-700">{val ? "Yes  -  Escalate" : "No  -  Continue monitoring"}</p>
            </div>
          );
        })}
      </div>
      {revealed && (
        <div className={`rounded-lg p-4 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`} data-testid="escalation-rationale">
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">{t("pages.deterioratingPatientSimulator.rationale2")}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{rationale}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StageResult {
  urgentCorrect: boolean;
  actionCorrect: boolean;
  escalationCorrect: boolean;
  timeSeconds: number;
}

function ScenarioRunner({
  scenario,
  country,
  unitMode,
  onComplete,
  onExit,
}: {
  scenario: Scenario;
  country: CountryMode;
  unitMode: UnitMode;
  onComplete: (results: StageResult[]) => void;
  onExit: () => void;
}) {
  const [stageIdx, setStageIdx] = useState(0);
  const [urgentAnswer, setUrgentAnswer] = useState<number | null>(null);
  const [actionAnswer, setActionAnswer] = useState<number | null>(null);
  const [escalationAnswer, setEscalationAnswer] = useState<boolean | null>(null);
  const [timerStart, setTimerStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [results, setResults] = useState<StageResult[]>([]);
  const [showExamTips, setShowExamTips] = useState(false);

  const stage = scenario.stages[stageIdx];
  const allAnswered = urgentAnswer !== null && actionAnswer !== null && escalationAnswer !== null;

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - timerStart) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timerStart]);

  useEffect(() => {
    if (allAnswered && timerActive) {
      setTimerActive(false);
    }
  }, [allAnswered, timerActive]);

  const handleNext = () => {
    const result: StageResult = {
      urgentCorrect: urgentAnswer === stage.urgentProblem.correctIndex,
      actionCorrect: actionAnswer === stage.priorityAction.correctIndex,
      escalationCorrect: escalationAnswer === stage.escalation.shouldEscalate,
      timeSeconds: elapsed,
    };
    const newResults = [...results, result];

    if (stageIdx === scenario.stages.length - 1) {
      onComplete(newResults);
    } else {
      setResults(newResults);
      setStageIdx((i) => i + 1);
      setUrgentAnswer(null);
      setActionAnswer(null);
      setEscalationAnswer(null);
      setTimerStart(Date.now());
      setElapsed(0);
      setTimerActive(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-gray-500 hover:text-primary text-sm -ml-2" onClick={onExit} data-testid="button-exit-scenario">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          {scenario.stages.map((_, i) => (
            <div key={i} className={`w-10 h-1.5 rounded-full transition-colors ${i < stageIdx ? "bg-primary" : i === stageIdx ? "bg-primary/60" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900" data-testid="text-scenario-title">{scenario.title}</h2>
            <p className="text-xs text-gray-400">Stage {stageIdx + 1} of {scenario.stages.length}</p>
          </div>
          <StageTimer isActive={timerActive} elapsed={elapsed} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
          <div><span className="font-semibold text-gray-500">{t("pages.deterioratingPatientSimulator.history")}</span> {scenario.history}</div>
          <div><span className="font-semibold text-gray-500">{t("pages.deterioratingPatientSimulator.meds")}</span> {scenario.meds}</div>
          <div><span className="font-semibold text-gray-500">{t("pages.deterioratingPatientSimulator.allergies")}</span> {scenario.allergies}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-700 leading-relaxed text-[15px]">{stage.narrative}</p>
      </div>

      <VitalsDashboard vitals={stage.vitals} painLevel={stage.painLevel} unitMode={unitMode} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("pages.deterioratingPatientSimulator.mentalStatus")}</p>
          <p className="text-sm text-gray-700">{stage.mentalStatus}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t("pages.deterioratingPatientSimulator.urineOutput")}</p>
          <p className="text-sm text-gray-700">{stage.urineOutput}</p>
        </div>
      </div>

      {stage.redFlags.length > 0 && (
        <Card className="border-2 border-red-200 bg-red-50/30" data-testid="red-flags">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-4 h-4 text-red-500" />
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider">{t("pages.deterioratingPatientSimulator.redFlagAlerts")}</p>
            </div>
            <div className="space-y-1.5">
              {stage.redFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{flag}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8 border-t border-gray-100 pt-6">
        <QuestionBlock
          label={t("pages.deterioratingPatientSimulator.urgent")}
          question={stage.urgentProblem.question}
          options={stage.urgentProblem.options}
          correctIndex={stage.urgentProblem.correctIndex}
          rationale={stage.urgentProblem.rationale}
          selectedIndex={urgentAnswer}
          onSelect={setUrgentAnswer}
        />

        <QuestionBlock
          label={t("pages.deterioratingPatientSimulator.action")}
          question={stage.priorityAction.question}
          options={stage.priorityAction.options}
          correctIndex={stage.priorityAction.correctIndex}
          rationale={stage.priorityAction.rationale}
          selectedIndex={actionAnswer}
          onSelect={setActionAnswer}
        />

        <EscalationBlock
          question={stage.escalation.question}
          shouldEscalate={stage.escalation.shouldEscalate}
          rationale={stage.escalation.rationale}
          selectedAnswer={escalationAnswer}
          onSelect={setEscalationAnswer}
        />
      </div>

      {allAnswered && (
        <div className="flex justify-end">
          <Button className="rounded-full gap-2 bg-primary text-white hover:brightness-110" onClick={handleNext} data-testid="button-next-stage">
            {stageIdx === scenario.stages.length - 1 ? "View Results" : "Next Stage"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <button
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          onClick={() => setShowExamTips(!showExamTips)}
          data-testid="button-toggle-exam-tips"
        >
          <Lightbulb className="w-4 h-4" />
          Exam Tips
          {showExamTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showExamTips && (
          <Card className="mt-3 border border-blue-100 bg-blue-50/30" data-testid="exam-tips-panel">
            <CardContent className="p-4">
              <div className="space-y-2">
                {examTips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">{t.icon}</span>
                    <p className="text-sm text-gray-700">{t.tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SummaryScreen({
  scenario,
  results,
  onRestart,
  onNewScenario,
}: {
  scenario: Scenario;
  results: StageResult[];
  onRestart: () => void;
  onNewScenario: () => void;
}) {
  const totalQuestions = results.length * 3;
  const totalCorrect = results.reduce(
    (sum, r) => sum + (r.urgentCorrect ? 1 : 0) + (r.actionCorrect ? 1 : 0) + (r.escalationCorrect ? 1 : 0),
    0
  );
  const scorePercent = Math.round((totalCorrect / totalQuestions) * 100);
  const avgTime = Math.round(results.reduce((s, r) => s + r.timeSeconds, 0) / results.length);
  const fastStages = results.filter((r) => r.timeSeconds <= 60).length;

  const areas: string[] = [];
  const urgentMissed = results.some((r) => !r.urgentCorrect);
  const actionMissed = results.some((r) => !r.actionCorrect);
  const escalationMissed = results.some((r) => !r.escalationCorrect);
  if (urgentMissed) areas.push("Problem identification (ABCs prioritization)");
  if (actionMissed) areas.push("Priority nursing interventions");
  if (escalationMissed) areas.push("Escalation / rapid response activation");
  if (avgTime > 90) areas.push("Time management  -  practice faster clinical decision-making");

  const scoreColor = scorePercent >= 80 ? "text-emerald-600" : scorePercent >= 60 ? "text-amber-600" : "text-red-600";
  const scoreBg = scorePercent >= 80 ? "bg-emerald-50 border-emerald-200" : scorePercent >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <div className="space-y-8" data-testid="summary-screen">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("pages.deterioratingPatientSimulator.scenarioComplete")}</h2>
        <p className="text-gray-500">{scenario.title}</p>
      </div>

      <div className={`rounded-2xl border-2 p-8 text-center ${scoreBg}`}>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t("pages.deterioratingPatientSimulator.totalScore")}</p>
        <p className={`text-6xl font-bold ${scoreColor}`} data-testid="text-total-score">{scorePercent}%</p>
        <p className="text-sm text-gray-500 mt-2">{totalCorrect} of {totalQuestions} correct</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalCorrect}/{totalQuestions}</p>
            <p className="text-xs text-gray-400">{t("pages.deterioratingPatientSimulator.correctAnswers")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{avgTime}s</p>
            <p className="text-xs text-gray-400">{t("pages.deterioratingPatientSimulator.avgResponseTime")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Timer className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{fastStages}/{results.length}</p>
            <p className="text-xs text-gray-400">{t("pages.deterioratingPatientSimulator.quickResponses60s")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Flag className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            <p className="text-xs text-gray-400">{t("pages.deterioratingPatientSimulator.stagesCompleted")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900">{t("pages.deterioratingPatientSimulator.stagebystageBreakdown")}</h3>
        {results.map((r, i) => (
          <Card key={i} className="border border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Stage {i + 1}</p>
                <span className="text-xs text-gray-400">{r.timeSeconds}s</span>
              </div>
              <div className="flex gap-4 text-xs">
                <span className={`flex items-center gap-1 ${r.urgentCorrect ? "text-emerald-600" : "text-red-500"}`}>
                  {r.urgentCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Problem ID
                </span>
                <span className={`flex items-center gap-1 ${r.actionCorrect ? "text-emerald-600" : "text-red-500"}`}>
                  {r.actionCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Priority Action
                </span>
                <span className={`flex items-center gap-1 ${r.escalationCorrect ? "text-emerald-600" : "text-red-500"}`}>
                  {r.escalationCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Escalation
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {areas.length > 0 && (
        <Card className="border border-amber-200 bg-amber-50/30">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-500" />
              Areas for Improvement
            </h3>
            <div className="space-y-2">
              {areas.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button variant="outline" className="rounded-full gap-2" onClick={onRestart} data-testid="button-restart-scenario">
          <RotateCcw className="w-4 h-4" /> Restart Scenario
        </Button>
        <Button className="rounded-full gap-2 bg-primary text-white hover:brightness-110" onClick={onNewScenario} data-testid="button-new-scenario">
          <ArrowRight className="w-4 h-4" /> Try Another Scenario
        </Button>
      </div>
    </div>
  );
}

function ScenarioSelector({
  onSelect,
  country,
  unitMode,
  onCountryChange,
  onUnitChange,
}: {
  onSelect: (s: Scenario) => void;
  country: CountryMode;
  unitMode: UnitMode;
  onCountryChange: (c: CountryMode) => void;
  onUnitChange: (u: UnitMode) => void;
}) {
  const shuffled = useMemo(() => fisherYatesShuffle([...scenarios]), []);

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-page-title">
              Deteriorating Patient Simulator
            </h1>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
              Critical Thinking Under Pressure
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mt-4">
          Monitor patients whose clinical status deteriorates over time. Identify red flags,
          prioritize interventions using ABCs, and decide when to escalate  -  just like real nursing practice.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1">
          {(["CA", "US"] as CountryMode[]).map((c) => (
            <button
              key={c}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${country === c ? "bg-primary text-white" : "text-gray-500 hover:text-primary"}`}
              onClick={() => {
                onCountryChange(c);
                onUnitChange(getDefaultUnitMode(c));
              }}
              data-testid={`toggle-country-${c.toLowerCase()}`}
            >
              {c === "CA" ? "🇨🇦 Canada" : "🇺🇸 United States"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1">
          {(["metric", "imperial"] as UnitMode[]).map((u) => (
            <button
              key={u}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${unitMode === u ? "bg-primary text-white" : "text-gray-500 hover:text-primary"}`}
              onClick={() => onUnitChange(u)}
              data-testid={`toggle-unit-${u}`}
            >
              {u === "metric" ? "Metric (°C)" : "Imperial (°F)"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shuffled.map((s) => (
          <Card
            key={s.id}
            className="border border-gray-100 bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelect(s)}
            data-testid={`card-scenario-${s.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary/70" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {s.stages.length} Stages
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{s.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{s.patientAge} y/o {s.patientSex}</span>
                <ArrowRight className="w-4 h-4 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 border border-blue-100 bg-blue-50/30" data-testid="exam-tips-home">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-500" />
            Exam Tips  -  Common Traps
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {examTips.slice(0, 6).map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">{t.icon}</span>
                <p className="text-sm text-gray-700">{t.tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

export default function DeterioratingPatientSimulatorPage() {
  const { user, effectiveTier } = useAuth();
  const hasPaidAccess = paidTiers.includes(effectiveTier);

  const [country, setCountry] = useState<CountryMode>("CA");
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [scenarioResults, setScenarioResults] = useState<StageResult[] | null>(null);

  const handleComplete = useCallback((results: StageResult[]) => {
    setScenarioResults(results);
  }, []);

  const handleRestart = useCallback(() => {
    setScenarioResults(null);
  }, []);

  const handleNewScenario = useCallback(() => {
    setActiveScenario(null);
    setScenarioResults(null);
  }, []);

  return (
    <div
      className={`min-h-screen bg-warmwhite flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`}
      onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}
    >
      <SEO
        title={t("pages.deterioratingPatientSimulator.deterioratingPatientSimulatorInteractiveClin")}
        description={t("pages.deterioratingPatientSimulator.practiceRecognizingDeterioratingPatientsWith")}
        keywords="deteriorating patient simulation nursing, clinical deterioration scenarios, nursing patient assessment, rapid response nursing, sepsis simulation, respiratory failure nursing, hemorrhage management nursing"
        canonicalPath="/deteriorating-patient-simulator"
        ogType="website"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <BreadcrumbNav />
        {!hasPaidAccess ? (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary/60" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.deterioratingPatientSimulator.deterioratingPatientSimulator")}</h1>
              <p className="text-lg text-gray-600 mb-2">{t("pages.deterioratingPatientSimulator.premiumInteractiveTool")}</p>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                Interactive deteriorating patient scenarios with vital sign monitoring, red flag alerts, and timed clinical decision-making are available exclusively for RPN, RN, and NP subscribers.
              </p>
              <LocaleLink href="/pricing">
                <Button className="rounded-full px-8 h-12 gap-2 bg-primary text-white hover:brightness-110 shadow-lg" data-testid="button-upgrade-deteriorating-sim">
                  <Sparkles className="w-4 h-4" />
                  View Subscription Plans
                </Button>
              </LocaleLink>
              {!user && (
                <p className="text-xs text-gray-400 mt-4">
                  Already subscribed? <LocaleLink href="/login" className="text-primary hover:underline">{t("pages.deterioratingPatientSimulator.signIn")}</LocaleLink> to access.
                </p>
              )}
            </div>
          </div>
        ) : activeScenario && scenarioResults ? (
          <SummaryScreen
            scenario={activeScenario}
            results={scenarioResults}
            onRestart={handleRestart}
            onNewScenario={handleNewScenario}
          />
        ) : activeScenario ? (
          <ScenarioRunner
            scenario={activeScenario}
            country={country}
            unitMode={unitMode}
            onComplete={handleComplete}
            onExit={handleNewScenario}
          />
        ) : (
          <ScenarioSelector
            onSelect={setActiveScenario}
            country={country}
            unitMode={unitMode}
            onCountryChange={setCountry}
            onUnitChange={setUnitMode}
          />
        )}
      </main>
      <AdminEditButton pageName="deteriorating-patient-simulator" />
      <Footer />
    </div>
  );
}
