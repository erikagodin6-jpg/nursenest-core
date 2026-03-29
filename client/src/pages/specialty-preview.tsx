import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import {
  CheckCircle2, XCircle, Lock, ArrowRight, BookOpen,
  Stethoscope, FileText, Brain, Shield, Star, Eye,
  ChevronRight, Loader2, Layers, Award, GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";

import { useI18n } from "@/lib/i18n";
interface SampleQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  category: string;
}

interface SpecialtyPreviewConfig {
  slug: string;
  name: string;
  description: string;
  color: string;
  guideSlug: string;
  sampleQuestions: SampleQuestion[];
  totalQuestionCount: number;
  relatedTopics: string[];
}

const SPECIALTY_PREVIEWS: Record<string, SpecialtyPreviewConfig> = {
  icu: {
    slug: "icu",
    name: "ICU & Critical Care Nursing",
    description: "Test your critical care knowledge with ICU nursing practice questions covering hemodynamic monitoring, ventilator management, sepsis protocols, vasoactive medications, and emergency interventions.",
    color: "#DC2626",
    guideSlug: "icu-nursing-ultimate-guide",
    totalQuestionCount: 450,
    relatedTopics: ["Hemodynamic Monitoring", "Ventilator Management", "Sepsis Protocols", "Vasoactive Medications", "ARDS Management"],
    sampleQuestions: [
      {
        id: "icu-1",
        question: "A client with septic shock has a MAP of 58 mmHg despite 30 mL/kg crystalloid resuscitation. Which vasopressor is the first-line agent?",
        options: ["Dopamine", "Norepinephrine", "Epinephrine", "Phenylephrine"],
        correctIndex: 1,
        rationale: "Norepinephrine is the first-line vasopressor for septic shock per Surviving Sepsis Campaign guidelines. It provides potent alpha-1 vasoconstriction to increase SVR and MAP, with mild beta-1 effects to maintain cardiac output...",
        category: "Pharmacology",
      },
      {
        id: "icu-2",
        question: "A mechanically ventilated patient on AC/VC mode triggers a high-pressure alarm with peak pressures of 48 cmH2O (baseline 28). SpO2 is dropping. What is the priority nursing action?",
        options: ["Increase the FiO2 to 100%", "Immediately assess the patient and auscultate breath sounds", "Call respiratory therapy", "Document and continue to monitor"],
        correctIndex: 1,
        rationale: "The priority is always to assess the patient first. High-pressure alarms can indicate secretions, pneumothorax, bronchospasm, or ETT kinking. Auscultating breath sounds bilaterally helps identify the cause...",
        category: "Respiratory",
      },
      {
        id: "icu-3",
        question: "What is the target tidal volume for lung-protective ventilation in ARDS?",
        options: ["10-12 mL/kg ideal body weight", "8-10 mL/kg ideal body weight", "6 mL/kg ideal body weight", "4 mL/kg ideal body weight"],
        correctIndex: 2,
        rationale: "Lung-protective ventilation uses low tidal volumes of 6 mL/kg ideal body weight to minimize volutrauma and barotrauma. The plateau pressure should be maintained below 30 cmH2O...",
        category: "Respiratory",
      },
      {
        id: "icu-4",
        question: "A patient in the ICU develops a temperature of 39.4°C, HR 122, WBC 18,000, and lactate of 4.2 mmol/L. Within what timeframe must broad-spectrum antibiotics be administered?",
        options: ["Within 3 hours", "Within 1 hour", "Within 6 hours", "Within 30 minutes"],
        correctIndex: 1,
        rationale: "Per the Surviving Sepsis Campaign Hour-1 Bundle, broad-spectrum antibiotics must be administered within 1 hour of sepsis recognition. Blood cultures should be drawn before antibiotic administration...",
        category: "Infection Control",
      },
      {
        id: "icu-5",
        question: "Which sedation assessment tool is recommended for use in mechanically ventilated ICU patients?",
        options: ["Glasgow Coma Scale (GCS)", "Richmond Agitation-Sedation Scale (RASS)", "Aldrete Score", "Mallampati Classification"],
        correctIndex: 1,
        rationale: "The RASS (Richmond Agitation-Sedation Scale) is the recommended tool for assessing sedation in mechanically ventilated patients. It ranges from -5 (unarousable) to +4 (combative)...",
        category: "Assessment",
      },
      {
        id: "icu-6",
        question: "A client on a norepinephrine drip has dark, mottled fingertips. What does this indicate?",
        options: ["Normal response to vasopressors", "Tissue ischemia from excessive vasoconstriction", "Hypothermia", "Cyanosis from respiratory failure"],
        correctIndex: 1,
        rationale: "Mottled, dark fingertips indicate tissue ischemia from excessive peripheral vasoconstriction caused by vasopressor therapy. This is a concerning sign requiring dose adjustment or addition of alternative agents...",
        category: "Cardiovascular",
      },
      {
        id: "icu-7",
        question: "When performing prone positioning for severe ARDS, for how many hours should the patient remain prone?",
        options: ["4-6 hours", "8-10 hours", "12-16 hours", "24 hours continuously"],
        correctIndex: 2,
        rationale: "Evidence supports prone positioning for 12-16 hours per session in patients with severe ARDS (PaO2/FiO2 < 150). Prone positioning improves V/Q matching and recruits dorsal lung segments...",
        category: "Respiratory",
      },
    ],
  },
  "emergency-nursing": {
    slug: "emergency-nursing",
    name: "Emergency & Trauma Nursing",
    description: "Practice emergency nursing questions covering triage assessment, trauma care, rapid stabilization, emergency medications, and critical decision-making in acute care scenarios.",
    color: "#F97316",
    guideSlug: "trauma-nursing-ultimate-guide",
    totalQuestionCount: 380,
    relatedTopics: ["Triage Assessment", "Trauma Management", "Emergency Medications", "Rapid Stabilization", "Shock Management"],
    sampleQuestions: [
      {
        id: "er-1",
        question: "A client presents to the ED after a motor vehicle collision with a distended abdomen and BP 82/50. Which type of shock is most likely?",
        options: ["Cardiogenic shock", "Neurogenic shock", "Hypovolemic shock", "Septic shock"],
        correctIndex: 2,
        rationale: "Abdominal distension after trauma with hypotension strongly suggests internal hemorrhage causing hypovolemic shock. Immediate fluid resuscitation and surgical consultation are priorities...",
        category: "Trauma",
      },
      {
        id: "er-2",
        question: "In the emergency triage system, which patient should be seen first?",
        options: ["A child with a temperature of 38.5°C and a rash", "An adult with chest pain radiating to the left arm", "A teenager with a sprained ankle", "An elderly patient with mild confusion"],
        correctIndex: 1,
        rationale: "Chest pain radiating to the left arm is a classic presentation of acute myocardial infarction, which is immediately life-threatening. This patient needs emergent assessment, ECG within 10 minutes...",
        category: "Triage",
      },
      {
        id: "er-3",
        question: "A trauma patient has a suspected tension pneumothorax. What is the priority intervention?",
        options: ["Obtain a chest X-ray", "Insert a chest tube", "Needle decompression at the 2nd intercostal space, midclavicular line", "Administer oxygen via non-rebreather mask"],
        correctIndex: 2,
        rationale: "Tension pneumothorax is a clinical diagnosis that requires immediate needle decompression at the 2nd intercostal space, midclavicular line. Waiting for imaging can be fatal...",
        category: "Trauma",
      },
      {
        id: "er-4",
        question: "A client presents with sudden onset severe headache described as 'the worst headache of my life.' What condition should the nurse suspect?",
        options: ["Migraine headache", "Tension headache", "Subarachnoid hemorrhage", "Cluster headache"],
        correctIndex: 2,
        rationale: "A sudden, severe 'thunderclap' headache described as the worst of the patient's life is the classic presentation of subarachnoid hemorrhage until proven otherwise...",
        category: "Neurological Emergency",
      },
      {
        id: "er-5",
        question: "Which is the correct fluid for initial resuscitation in a trauma patient with hemorrhagic shock?",
        options: ["D5W (5% Dextrose in Water)", "Lactated Ringer's solution", "0.45% Normal Saline", "D10W (10% Dextrose in Water)"],
        correctIndex: 1,
        rationale: "Lactated Ringer's (or normal saline) is the isotonic crystalloid of choice for initial fluid resuscitation in hemorrhagic shock. Hypotonic or dextrose solutions are not appropriate for volume resuscitation...",
        category: "Trauma",
      },
      {
        id: "er-6",
        question: "A burn patient has burns covering the entire front of both legs and the anterior trunk. Using the Rule of Nines, what is the estimated TBSA?",
        options: ["27%", "36%", "45%", "54%"],
        correctIndex: 1,
        rationale: "Using the Rule of Nines for adults: anterior of each leg = 9% each (18% total) + anterior trunk = 18%. Total = 36% TBSA. This guides fluid resuscitation calculations...",
        category: "Burns",
      },
    ],
  },
  nicu: {
    slug: "nicu",
    name: "NICU Nursing",
    description: "Practice neonatal intensive care nursing questions covering premature infant care, neonatal assessment, respiratory support, thermoregulation, and developmental care principles.",
    color: "#EC4899",
    guideSlug: "nicu-nursing-ultimate-guide",
    totalQuestionCount: 320,
    relatedTopics: ["Neonatal Assessment", "Respiratory Distress Syndrome", "Thermoregulation", "Developmental Care", "NEC Prevention"],
    sampleQuestions: [
      {
        id: "nicu-1",
        question: "A premature infant born at 30 weeks gestation develops grunting, nasal flaring, and intercostal retractions within 2 hours of birth. What condition is most likely?",
        options: ["Meconium aspiration syndrome", "Respiratory distress syndrome (RDS)", "Transient tachypnea of the newborn", "Pneumothorax"],
        correctIndex: 1,
        rationale: "RDS is caused by surfactant deficiency, most common in premature infants < 34 weeks. Classic signs include grunting, nasal flaring, retractions, and tachypnea appearing shortly after birth...",
        category: "Respiratory",
      },
      {
        id: "nicu-2",
        question: "What is the most protective factor against necrotizing enterocolitis (NEC) in premature infants?",
        options: ["Early formula feeding", "Breast milk feeding", "Delayed enteral feeding for 2 weeks", "Prophylactic antibiotics"],
        correctIndex: 1,
        rationale: "Breast milk contains immunoglobulins, growth factors, and beneficial bacteria that protect the immature gut. Multiple studies demonstrate that breast milk significantly reduces NEC incidence...",
        category: "GI",
      },
      {
        id: "nicu-3",
        question: "The nurse is caring for a 28-week premature infant. What is the optimal environmental temperature range for the isolette?",
        options: ["32-34°C", "34-36.5°C", "36.5-37.5°C", "37.5-38.5°C"],
        correctIndex: 1,
        rationale: "Premature infants require a neutral thermal environment (NTE) of 34-36.5°C depending on gestational age and weight. The NTE minimizes metabolic demands and oxygen consumption...",
        category: "Thermoregulation",
      },
      {
        id: "nicu-4",
        question: "An infant in the NICU has a bilirubin level of 18 mg/dL. Which intervention is the first-line treatment?",
        options: ["Exchange transfusion", "Phototherapy", "Intravenous immunoglobulin", "Phenobarbital"],
        correctIndex: 1,
        rationale: "Phototherapy is the first-line treatment for neonatal hyperbilirubinemia. Blue-green light converts unconjugated bilirubin into water-soluble isomers that can be excreted without liver conjugation...",
        category: "Hematology",
      },
      {
        id: "nicu-5",
        question: "What position should an infant be placed in to minimize the risk of intraventricular hemorrhage (IVH)?",
        options: ["Prone with head turned to the side", "Supine with head elevated and midline", "Left lateral decubitus", "Trendelenburg position"],
        correctIndex: 1,
        rationale: "Keeping the head midline and elevated 15-30 degrees promotes venous drainage from the brain and reduces IVH risk. Avoid rapid position changes, painful stimuli, and volume shifts...",
        category: "Neurological",
      },
      {
        id: "nicu-6",
        question: "Which of the following is a sign of late-onset neonatal sepsis?",
        options: ["Vigorous feeding", "Temperature instability and feeding intolerance", "Strong cry", "Active Moro reflex"],
        correctIndex: 1,
        rationale: "Late-onset sepsis (after 72 hours) presents with subtle signs: temperature instability, feeding intolerance, lethargy, apnea, and bradycardia. A high index of suspicion is critical...",
        category: "Infection",
      },
    ],
  },
  "med-surg": {
    slug: "med-surg",
    name: "Medical-Surgical Nursing",
    description: "Practice med-surg nursing questions covering postoperative care, chronic disease management, fluid and electrolyte balance, wound care, and patient education across all body systems.",
    color: "#2563EB",
    guideSlug: "med-surg-nursing-ultimate-guide",
    totalQuestionCount: 520,
    relatedTopics: ["Postoperative Care", "Fluid & Electrolytes", "Chronic Disease Management", "Wound Care", "Patient Education"],
    sampleQuestions: [
      {
        id: "ms-1",
        question: "A postoperative client has not voided in 8 hours and reports lower abdominal discomfort. The nurse palpates a firm, distended bladder. What is the priority action?",
        options: ["Encourage oral fluids", "Perform a bladder scan", "Insert a Foley catheter immediately", "Administer bethanechol"],
        correctIndex: 1,
        rationale: "A bladder scan is the priority to confirm urinary retention and measure the volume before catheterization. Post-void residual > 300 mL typically warrants catheterization...",
        category: "GU/Renal",
      },
      {
        id: "ms-2",
        question: "A client with chronic kidney disease has a potassium level of 6.2 mEq/L. Which ECG change should the nurse expect?",
        options: ["Prolonged QT interval", "Peaked T waves", "ST segment depression", "U waves"],
        correctIndex: 1,
        rationale: "Hyperkalemia causes characteristic peaked (tall, narrow) T waves on ECG. Progressive hyperkalemia leads to widened QRS complex and can progress to lethal ventricular dysrhythmias...",
        category: "Cardiovascular",
      },
      {
        id: "ms-3",
        question: "A client with a new colostomy asks about dietary modifications. Which food should the nurse recommend to thicken stool?",
        options: ["Prune juice", "Bananas and applesauce", "Raw vegetables", "Spicy foods"],
        correctIndex: 1,
        rationale: "Bananas and applesauce are binding foods that help thicken stool output from a colostomy. Other stool-thickening foods include rice, cheese, toast, and peanut butter...",
        category: "GI",
      },
      {
        id: "ms-4",
        question: "Which assessment finding indicates a possible deep vein thrombosis (DVT)?",
        options: ["Bilateral lower extremity edema", "Unilateral calf swelling, warmth, and tenderness", "Cool, pale extremity with weak pulses", "Intermittent claudication with walking"],
        correctIndex: 1,
        rationale: "DVT classically presents with unilateral limb swelling, warmth, erythema, and tenderness. Positive Homans' sign (calf pain with dorsiflexion) may be present but is not reliable...",
        category: "Vascular",
      },
      {
        id: "ms-5",
        question: "A client's wound culture shows MRSA. What type of isolation precautions should be implemented?",
        options: ["Airborne precautions", "Droplet precautions", "Contact precautions", "Standard precautions only"],
        correctIndex: 2,
        rationale: "MRSA requires contact precautions: gown and gloves for all interactions, dedicated equipment, and private room or cohorting with other MRSA patients. Hand hygiene is critical...",
        category: "Infection Control",
      },
      {
        id: "ms-6",
        question: "A diabetic client's blood glucose is 52 mg/dL and they are conscious. What is the appropriate intervention?",
        options: ["Administer IV dextrose 50%", "Give 15 grams of fast-acting carbohydrate orally", "Administer glucagon IM", "Give insulin to correct the imbalance"],
        correctIndex: 1,
        rationale: "For a conscious hypoglycemic patient, the Rule of 15 applies: give 15g of fast-acting carbs (4 oz juice, glucose tablets), recheck in 15 minutes, and repeat if still below 70 mg/dL...",
        category: "Endocrine",
      },
    ],
  },
  "trauma-nursing": {
    slug: "trauma-nursing",
    name: "Trauma Nursing",
    description: "Practice trauma nursing questions covering primary and secondary surveys, trauma assessment, hemorrhage control, spinal immobilization, and multi-system injury management.",
    color: "#EF4444",
    guideSlug: "trauma-nursing-ultimate-guide",
    totalQuestionCount: 350,
    relatedTopics: ["Primary Survey (ABCDE)", "Hemorrhage Control", "Spinal Immobilization", "Chest Trauma", "Abdominal Trauma"],
    sampleQuestions: [
      {
        id: "tr-1",
        question: "During the primary survey of a trauma patient, which assessment takes the highest priority?",
        options: ["Circulation with hemorrhage control", "Airway with cervical spine protection", "Breathing and ventilation", "Disability (neurological status)"],
        correctIndex: 1,
        rationale: "The primary survey follows the ABCDE approach: Airway (with C-spine protection) is always the first priority. A patent airway is the most critical requirement for survival...",
        category: "Trauma Assessment",
      },
      {
        id: "tr-2",
        question: "A trauma patient has paradoxical chest wall movement on the left side. What injury does this suggest?",
        options: ["Simple pneumothorax", "Flail chest", "Cardiac tamponade", "Hemothorax"],
        correctIndex: 1,
        rationale: "Paradoxical movement (the segment moves inward during inspiration and outward during expiration) is the hallmark of flail chest — two or more adjacent ribs fractured in two or more places...",
        category: "Chest Trauma",
      },
      {
        id: "tr-3",
        question: "Beck's triad (hypotension, muffled heart sounds, distended neck veins) is associated with which condition?",
        options: ["Tension pneumothorax", "Cardiac tamponade", "Massive hemothorax", "Aortic dissection"],
        correctIndex: 1,
        rationale: "Beck's triad is the classic presentation of cardiac tamponade. Fluid in the pericardial sac compresses the heart, reducing filling and cardiac output. Emergency pericardiocentesis is required...",
        category: "Cardiac Emergency",
      },
      {
        id: "tr-4",
        question: "Which lab value is the best indicator of ongoing hemorrhage in a trauma patient?",
        options: ["Hemoglobin level", "Serial lactate levels", "Platelet count", "PT/INR"],
        correctIndex: 1,
        rationale: "Serial lactate levels are the best indicator of tissue perfusion adequacy. Elevated or rising lactate indicates ongoing tissue hypoperfusion from hemorrhage or shock...",
        category: "Lab Values",
      },
      {
        id: "tr-5",
        question: "A patient with a C5 spinal cord injury presents with bradycardia and hypotension. What type of shock is this?",
        options: ["Hypovolemic shock", "Cardiogenic shock", "Neurogenic shock", "Obstructive shock"],
        correctIndex: 2,
        rationale: "Neurogenic shock results from loss of sympathetic tone below the level of injury, causing vasodilation (hypotension) and unopposed vagal tone (bradycardia). It differs from spinal shock...",
        category: "Neurological",
      },
      {
        id: "tr-6",
        question: "What is the Parkland formula used for in burn management?",
        options: ["Estimating pain medication needs", "Calculating fluid resuscitation requirements", "Determining surgical debridement timing", "Assessing nutritional requirements"],
        correctIndex: 1,
        rationale: "The Parkland formula (4 mL × kg body weight × %TBSA) calculates the 24-hour crystalloid fluid requirements for burn resuscitation. Half is given in the first 8 hours from time of injury...",
        category: "Burns",
      },
    ],
  },
  "mental-health": {
    slug: "mental-health",
    name: "Mental Health Nursing",
    description: "Practice psychiatric and mental health nursing questions covering therapeutic communication, crisis intervention, psychopharmacology, safety assessment, and psychiatric disorders.",
    color: "#8B5CF6",
    guideSlug: "mental-health-nursing-ultimate-guide",
    totalQuestionCount: 400,
    relatedTopics: ["Therapeutic Communication", "Crisis Intervention", "Psychopharmacology", "Safety Assessment", "Psychiatric Disorders"],
    sampleQuestions: [
      {
        id: "mh-1",
        question: "A client states, 'I don't see the point in living anymore.' What is the priority nursing response?",
        options: ["Tell the client things will get better", "Ask directly: 'Are you thinking about killing yourself?'", "Change the subject to distract the client", "Document the statement and continue the assessment"],
        correctIndex: 1,
        rationale: "Asking directly about suicidal ideation does NOT increase suicide risk. It shows the client you are taking their feelings seriously and allows for accurate risk assessment and safety planning...",
        category: "Crisis Intervention",
      },
      {
        id: "mh-2",
        question: "A client on lithium therapy reports blurred vision, coarse tremors, and ataxia. What is the priority action?",
        options: ["Administer the next scheduled dose", "Hold the medication and check lithium level", "Encourage increased fluid intake", "Document and monitor"],
        correctIndex: 1,
        rationale: "These are signs of lithium toxicity (therapeutic range 0.6-1.2 mEq/L). The medication must be held immediately and a stat lithium level drawn. Toxicity can progress to seizures and death...",
        category: "Psychopharmacology",
      },
      {
        id: "mh-3",
        question: "Which therapeutic communication technique is the nurse using when they say, 'Tell me more about what you're feeling right now'?",
        options: ["Reflection", "Exploring", "Restating", "Giving advice"],
        correctIndex: 1,
        rationale: "Exploring is a therapeutic communication technique that encourages the client to elaborate on their thoughts and feelings. It shows interest and helps gather more assessment data...",
        category: "Therapeutic Communication",
      },
      {
        id: "mh-4",
        question: "A client with schizophrenia tells the nurse that the CIA is monitoring them through the TV. How should the nurse respond?",
        options: ["Agree with the client to build rapport", "Present reality: 'I understand that feels real to you, but the TV is not monitoring you'", "Ignore the statement", "Logically argue that this is impossible"],
        correctIndex: 1,
        rationale: "Present reality gently without arguing or agreeing. Acknowledge the client's feelings while offering a reality-based perspective. Arguing reinforces the delusion; agreeing validates it...",
        category: "Psychosis",
      },
      {
        id: "mh-5",
        question: "A client taking an SSRI and an MAOI simultaneously is at risk for which life-threatening condition?",
        options: ["Neuroleptic malignant syndrome", "Serotonin syndrome", "Tardive dyskinesia", "Malignant hyperthermia"],
        correctIndex: 1,
        rationale: "Combining SSRIs and MAOIs causes dangerous serotonin excess leading to serotonin syndrome: agitation, hyperthermia, tachycardia, hyperreflexia, muscle rigidity, and potential death...",
        category: "Psychopharmacology",
      },
      {
        id: "mh-6",
        question: "When a client with borderline personality disorder splits staff by saying 'You're the only good nurse here,' what is the best response?",
        options: ["Thank the client for the compliment", "Set clear boundaries: 'All the nurses here are working to help you'", "Agree and validate their perception", "Ignore the comment completely"],
        correctIndex: 1,
        rationale: "Splitting (idealizing some and devaluing others) is a common defense mechanism in BPD. The nurse should set boundaries, maintain consistency, and avoid being drawn into the splitting dynamic...",
        category: "Personality Disorders",
      },
    ],
  },
  orthopedic: {
    slug: "orthopedic",
    name: "Orthopedic Nursing",
    description: "Practice orthopedic nursing questions covering fracture management, joint replacement care, neurovascular assessment, traction and immobilization, and musculoskeletal rehabilitation.",
    color: "#059669",
    guideSlug: "orthopedic-nursing-ultimate-guide",
    totalQuestionCount: 280,
    relatedTopics: ["Fracture Management", "Joint Replacement", "Neurovascular Assessment", "Traction Care", "Musculoskeletal Rehabilitation"],
    sampleQuestions: [
      {
        id: "orth-1",
        question: "A client with a new hip replacement must avoid which position?",
        options: ["Abduction of the affected leg", "Flexion greater than 90 degrees", "Extension of the affected leg", "Neutral rotation"],
        correctIndex: 1,
        rationale: "After total hip replacement, flexion > 90 degrees risks hip dislocation. Other precautions include avoiding adduction past midline and internal rotation. An abduction pillow is often used...",
        category: "Joint Replacement",
      },
      {
        id: "orth-2",
        question: "The 5 Ps of neurovascular assessment include all of the following EXCEPT:",
        options: ["Pain", "Pallor", "Pulselessness", "Pruritis"],
        correctIndex: 3,
        rationale: "The 5 Ps are: Pain (especially with passive stretch), Pallor, Pulselessness, Paresthesia, and Paralysis. These assess for compartment syndrome, which is an orthopedic emergency...",
        category: "Assessment",
      },
      {
        id: "orth-3",
        question: "A client in a long leg cast reports increasing pain that is not relieved by elevation or analgesics. Pain increases with passive toe extension. What should the nurse suspect?",
        options: ["Normal postoperative pain", "Compartment syndrome", "Deep vein thrombosis", "Phantom limb pain"],
        correctIndex: 1,
        rationale: "Unrelenting pain unresponsive to analgesics, especially with passive stretch, is the hallmark of compartment syndrome. This is an emergency requiring fasciotomy within 6 hours...",
        category: "Emergency",
      },
      {
        id: "orth-4",
        question: "Which type of fracture is most associated with fat embolism syndrome?",
        options: ["Greenstick fracture of the radius", "Long bone fracture (femur or tibia)", "Stress fracture of the metatarsal", "Avulsion fracture of the ankle"],
        correctIndex: 1,
        rationale: "Fat embolism syndrome occurs most frequently with long bone fractures, especially the femur. Fat globules enter the bloodstream and lodge in the pulmonary vasculature...",
        category: "Complications",
      },
      {
        id: "orth-5",
        question: "What is the priority nursing assessment for a client in skeletal traction?",
        options: ["Assess for constipation", "Check pin sites for signs of infection", "Monitor dietary intake", "Encourage deep breathing exercises"],
        correctIndex: 1,
        rationale: "Pin site care and assessment for infection is the priority in skeletal traction. Signs include redness, drainage, warmth, odor, and loosening of pins. Pin site care protocol varies by facility...",
        category: "Traction",
      },
      {
        id: "orth-6",
        question: "After a total knee replacement, when should the client begin range-of-motion exercises?",
        options: ["After 2 weeks of rest", "Within 24 hours postoperatively", "After the surgical incision has fully healed", "Only after discharge from the hospital"],
        correctIndex: 1,
        rationale: "Early mobilization within 24 hours is essential after TKR to prevent stiffness, promote circulation, and reduce DVT risk. Continuous passive motion (CPM) machines may be used...",
        category: "Rehabilitation",
      },
    ],
  },
  renal: {
    slug: "renal",
    name: "Renal & Nephrology Nursing",
    description: "Practice renal nursing questions covering chronic kidney disease, dialysis management, fluid and electrolyte imbalances, renal diet education, and urological conditions.",
    color: "#0891B2",
    guideSlug: "nephrology-nursing-ultimate-guide",
    totalQuestionCount: 300,
    relatedTopics: ["Chronic Kidney Disease", "Hemodialysis", "Peritoneal Dialysis", "Electrolyte Imbalances", "Renal Diet"],
    sampleQuestions: [
      {
        id: "ren-1",
        question: "Which electrolyte imbalance is the most life-threatening in a client with end-stage renal disease?",
        options: ["Hyponatremia", "Hypocalcemia", "Hyperkalemia", "Hypermagnesemia"],
        correctIndex: 2,
        rationale: "Hyperkalemia is the most dangerous electrolyte imbalance in ESRD because the kidneys cannot excrete potassium. Levels > 6.0 mEq/L can cause fatal cardiac dysrhythmias...",
        category: "Electrolytes",
      },
      {
        id: "ren-2",
        question: "A client on hemodialysis has an AV fistula in the left arm. Which action by the nurse indicates correct care?",
        options: ["Take blood pressure in the left arm", "Palpate for a thrill and auscultate for a bruit", "Draw blood from the fistula during routine labs", "Apply a tourniquet above the fistula site"],
        correctIndex: 1,
        rationale: "Assessing for a thrill (vibration) by palpation and a bruit (swooshing sound) by auscultation confirms fistula patency. Never use the fistula arm for BP, blood draws, or IVs...",
        category: "Hemodialysis",
      },
      {
        id: "ren-3",
        question: "A client with CKD has a GFR of 22 mL/min. Which stage of CKD does this represent?",
        options: ["Stage 2", "Stage 3b", "Stage 4", "Stage 5"],
        correctIndex: 2,
        rationale: "Stage 4 CKD is defined as GFR 15-29 mL/min. This stage requires preparation for renal replacement therapy (dialysis or transplant) and intensive management of complications...",
        category: "CKD Staging",
      },
      {
        id: "ren-4",
        question: "During peritoneal dialysis, the nurse notes cloudy effluent. What should the nurse suspect?",
        options: ["Normal dialysate color", "Peritonitis", "Bowel perforation", "Dehydration"],
        correctIndex: 1,
        rationale: "Cloudy effluent is the hallmark sign of peritonitis in peritoneal dialysis. Other signs include abdominal pain, fever, and nausea. A culture of the effluent should be obtained immediately...",
        category: "Peritoneal Dialysis",
      },
      {
        id: "ren-5",
        question: "Which dietary restriction is most important for a client with CKD Stage 4?",
        options: ["Low carbohydrate diet", "Potassium, phosphorus, and sodium restriction", "High protein diet", "Gluten-free diet"],
        correctIndex: 1,
        rationale: "CKD patients must restrict potassium (prevent arrhythmias), phosphorus (prevent renal osteodystrophy), and sodium (control fluid retention and hypertension)...",
        category: "Nutrition",
      },
      {
        id: "ren-6",
        question: "A dialysis client develops muscle cramps and hypotension during hemodialysis. What is the likely cause?",
        options: ["Fluid overload", "Too-rapid fluid removal (ultrafiltration)", "Hyperkalemia", "Air embolism"],
        correctIndex: 1,
        rationale: "Rapid fluid removal during hemodialysis causes intravascular volume depletion, leading to hypotension, muscle cramps, nausea, and dizziness. The ultrafiltration rate should be reduced...",
        category: "Hemodialysis",
      },
    ],
  },
  "palliative-care": {
    slug: "palliative-care",
    name: "Palliative Care Nursing",
    description: "Practice palliative care nursing questions covering symptom management, end-of-life care, pain assessment, ethical considerations, family support, and hospice care principles.",
    color: "#7C3AED",
    guideSlug: "palliative-care-nursing-ultimate-guide",
    totalQuestionCount: 250,
    relatedTopics: ["Symptom Management", "Pain Assessment", "End-of-Life Care", "Ethical Considerations", "Family Support"],
    sampleQuestions: [
      {
        id: "pc-1",
        question: "A terminally ill client in hospice has increasing pain. The current morphine dose is not providing adequate relief. What is the most appropriate action?",
        options: ["Discontinue morphine and try a non-opioid", "Titrate the morphine dose upward until pain is controlled", "Suggest the client try to tolerate the pain", "Wait until the next scheduled dose"],
        correctIndex: 1,
        rationale: "In palliative care, there is no ceiling dose for morphine. The dose should be titrated upward until pain relief is achieved. The goal is comfort, and the principle of double effect applies...",
        category: "Pain Management",
      },
      {
        id: "pc-2",
        question: "Cheyne-Stokes respirations in a dying patient indicate which phase of the dying process?",
        options: ["Early decline", "Active dying phase", "Recovery phase", "Stable palliative phase"],
        correctIndex: 1,
        rationale: "Cheyne-Stokes breathing (cyclical pattern of increasing then decreasing depth with periods of apnea) is a sign of the active dying phase, typically occurring hours to days before death...",
        category: "End-of-Life",
      },
      {
        id: "pc-3",
        question: "A family member asks, 'Is my mother suffering?' The patient is non-responsive with occasional moaning. What is the best nursing response?",
        options: ["'She is definitely not in pain'", "'The moaning could indicate discomfort, and we will assess and treat for comfort'", "'There is nothing more we can do'", "'You should prepare yourself for the worst'"],
        correctIndex: 1,
        rationale: "Honest, compassionate communication is essential. Moaning in non-responsive patients may indicate discomfort. The nurse should assess using appropriate pain scales and provide comfort measures...",
        category: "Communication",
      },
      {
        id: "pc-4",
        question: "Which ethical principle supports a competent client's right to refuse life-sustaining treatment?",
        options: ["Beneficence", "Autonomy", "Justice", "Nonmaleficence"],
        correctIndex: 1,
        rationale: "Autonomy is the ethical principle that supports a competent patient's right to make their own healthcare decisions, including refusing treatment, even if it may result in death...",
        category: "Ethics",
      },
      {
        id: "pc-5",
        question: "What is the difference between palliative care and hospice care?",
        options: ["They are identical concepts", "Palliative care can begin at diagnosis of a serious illness; hospice is for the last 6 months of life", "Hospice focuses on cure; palliative care focuses on comfort", "Palliative care is only for cancer patients"],
        correctIndex: 1,
        rationale: "Palliative care can be provided alongside curative treatment at any stage of serious illness. Hospice care is a form of palliative care for patients with a prognosis of 6 months or less who have elected comfort-focused care...",
        category: "Hospice",
      },
      {
        id: "pc-6",
        question: "A dying client's family is present at the bedside. Which nursing intervention is most important?",
        options: ["Ask the family to leave during care", "Provide emotional support and create a peaceful environment", "Focus solely on the client's physical needs", "Limit visiting hours to reduce disturbance"],
        correctIndex: 1,
        rationale: "Family-centered care is a cornerstone of palliative nursing. The nurse should create a peaceful environment, provide emotional support, facilitate final conversations, and ensure cultural and spiritual needs are met...",
        category: "Family Support",
      },
    ],
  },
};

function QuestionCard({ question, index, isPreview }: { question: SampleQuestion; index: number; isPreview: boolean }) {
  const { t } = useI18n();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const answered = selectedOption !== null;
  const isCorrect = selectedOption === question.correctIndex;

  if (!isPreview) {
    return (
      <Card className="overflow-hidden opacity-75" data-testid={`card-locked-question-${index}`}>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Question {index + 1}</span>
          </div>
          <div className="h-4 bg-gray-100 rounded w-full mb-3" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-50 rounded-lg border border-gray-100" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden" data-testid={`card-preview-question-${index}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">{question.category}</Badge>
          <span className="text-xs text-gray-400">Question {index + 1}</span>
        </div>
        <p className="text-sm sm:text-base text-gray-800 font-medium mb-4 leading-relaxed" data-testid={`text-question-${index}`}>
          {question.question}
        </p>
        <div className="space-y-2 mb-4" data-testid={`options-${index}`}>
          {question.options.map((opt, i) => {
            let borderColor = "border-gray-200 hover:border-teal-300 hover:bg-teal-50/50";
            let bgColor = "bg-white";
            let cursor = "cursor-pointer";

            if (answered) {
              cursor = "cursor-default";
              if (i === question.correctIndex) {
                borderColor = "border-green-400";
                bgColor = "bg-green-50";
              } else if (i === selectedOption && !isCorrect) {
                borderColor = "border-red-400";
                bgColor = "bg-red-50";
              } else {
                borderColor = "border-gray-100";
              }
            }

            return (
              <button
                key={i}
                onClick={() => !answered && setSelectedOption(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 ${borderColor} ${bgColor} transition-all text-sm flex items-center gap-3 ${cursor}`}
                disabled={answered}
                data-testid={`option-${index}-${i}`}
              >
                <span className="font-bold text-gray-400 w-5 text-center">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{opt}</span>
                {answered && i === question.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                {answered && i === selectedOption && !isCorrect && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div data-testid={`rationale-${index}`}>
            <div className={`rounded-xl p-4 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <h4 className={`text-xs font-bold mb-1 ${isCorrect ? "text-green-800" : "text-amber-800"}`}>
                {isCorrect ? "Correct!" : "Incorrect"} — Rationale Preview:
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {question.rationale.substring(0, 120)}...
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                <span>{t("pages.specialtyPreview.fullRationaleAvailableWithPremium")}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ApiPreviewQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  truncatedRationale: string;
  hasMoreRationale: boolean;
  difficulty: number;
  category: string;
}

interface ApiPreviewData {
  topicSlug: string;
  topic: string;
  bodySystem: string;
  totalAvailable: number;
  questions: ApiPreviewQuestion[];
  relatedTopics: { topicSlug: string; topic: string; questionCount: number }[];
  relatedLessons: { id: string; title: string }[];
  relatedFlashcards: { slug: string; title: string }[];
}

function ApiQuestionCard({ question, index }: { question: ApiPreviewQuestion; index: number }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const answered = selectedOption !== null;
  const isCorrect = selectedOption === question.correctIndex;

  return (
    <Card className="overflow-hidden" data-testid={`card-preview-question-${index}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">{question.category}</Badge>
          <span className="text-xs text-gray-400">Question {index + 1}</span>
        </div>
        <p className="text-sm sm:text-base text-gray-800 font-medium mb-4 leading-relaxed" data-testid={`text-question-${index}`}>
          {question.stem}
        </p>
        <div className="space-y-2 mb-4" data-testid={`options-${index}`}>
          {question.options.map((opt, i) => {
            let borderColor = "border-gray-200 hover:border-teal-300 hover:bg-teal-50/50";
            let bgColor = "bg-white";
            let cursor = "cursor-pointer";

            if (answered) {
              cursor = "cursor-default";
              if (i === question.correctIndex) {
                borderColor = "border-green-400";
                bgColor = "bg-green-50";
              } else if (i === selectedOption && !isCorrect) {
                borderColor = "border-red-400";
                bgColor = "bg-red-50";
              } else {
                borderColor = "border-gray-100";
              }
            }

            return (
              <button
                key={i}
                onClick={() => !answered && setSelectedOption(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 ${borderColor} ${bgColor} transition-all text-sm flex items-center gap-3 ${cursor}`}
                disabled={answered}
                data-testid={`option-${index}-${i}`}
              >
                <span className="font-bold text-gray-400 w-5 text-center">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{opt}</span>
                {answered && i === question.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                {answered && i === selectedOption && !isCorrect && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div data-testid={`rationale-${index}`}>
            <div className={`rounded-xl p-4 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <h4 className={`text-xs font-bold mb-1 ${isCorrect ? "text-green-800" : "text-amber-800"}`}>
                {isCorrect ? "Correct!" : "Incorrect"} — Rationale Preview:
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {question.truncatedRationale}
              </p>
              {question.hasMoreRationale && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="w-3 h-3" />
                  <span>{t("pages.specialtyPreview.fullRationaleAvailableWithPremium2")}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ApiDrivenPreview({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [data, setData] = useState<ApiPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/questions/preview-multi/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(d => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data || data.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-specialty-not-found">{t("pages.specialtyPreview.topicNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.specialtyPreview.thePreviewYoureLookingFor")}</p>
          <Link href="/practice-questions">
            <Button data-testid="button-browse-questions">{t("pages.specialtyPreview.browsePracticeQuestions")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const topicTitle = data.topic.charAt(0).toUpperCase() + data.topic.slice(1);
  const previewCount = data.questions.length;
  const lockedCount = Math.min(5, Math.max(0, data.totalAvailable - previewCount));
  const color = "#0D9488";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is tested in NCLEX ${topicTitle} questions?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `NCLEX ${topicTitle} questions test your clinical knowledge of ${data.topic} within ${data.bodySystem}. Questions cover assessment, diagnosis, planning, and intervention.`,
        },
      },
      {
        "@type": "Question",
        name: `How many ${topicTitle} practice questions are available?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `NurseNest has ${data.totalAvailable} practice questions on ${topicTitle}, each with detailed clinical rationales.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`specialty-preview-${slug}`}>
      <Navigation />
      <SEO
        title={`${topicTitle} Practice Questions — Free Preview | NurseNest`}
        description={`Practice ${topicTitle} questions with detailed clinical rationales. ${data.totalAvailable} questions available on ${data.bodySystem}. Try ${previewCount} free preview questions.`}
        canonicalPath={`/preview/${slug}`}
        keywords={`${topicTitle} practice questions, ${topicTitle} NCLEX, nursing ${slug} questions, ${topicTitle} quiz`}
        structuredData={faqSchema}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Practice Questions", url: "https://www.nursenest.ca/practice-questions" },
          { name: topicTitle, url: `https://www.nursenest.ca/preview/${slug}` },
        ]}
      />

      <nav className="bg-white border-b border-gray-100 py-3 px-4" data-testid="breadcrumbs">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors" data-testid="breadcrumb-home">{t("pages.specialtyPreview.home")}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/practice-questions" className="hover:text-primary transition-colors" data-testid="breadcrumb-practice">{t("pages.specialtyPreview.practiceQuestions")}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium" data-testid="breadcrumb-current">{topicTitle}</span>
        </div>
      </nav>

      <section className="relative py-12 sm:py-16 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}10, white, ${color}08)` }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4 text-white" style={{ backgroundColor: color }} data-testid="badge-specialty">
            <Stethoscope className="w-3 h-3 mr-1" /> {data.bodySystem}
          </Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-specialty-title">
            {topicTitle} Practice Questions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl" data-testid="text-specialty-description">
            Test your knowledge of {data.topic} with these NCLEX-style practice questions. Select your answer to reveal the clinical rationale.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <FileText className="w-4 h-4" style={{ color }} />
              <span>{data.totalAvailable}+ questions available</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Eye className="w-4 h-4" style={{ color }} />
              <span>{previewCount} free preview questions below</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5" style={{ color }} />
          <h2 className="text-xl font-bold text-gray-900" data-testid="heading-preview-questions">
            Preview Questions
          </h2>
          <Badge variant="outline" className="ml-auto text-xs">
            {previewCount} of {data.totalAvailable}+ questions
          </Badge>
        </div>

        <div className="space-y-6 mb-10">
          {data.questions.map((q, i) => (
            <ApiQuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>

        {lockedCount > 0 && (
          <div className="relative mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-500" data-testid="heading-locked-questions">
                More Questions Available
              </h2>
            </div>
            <div className="space-y-4">
              {Array.from({ length: lockedCount }).map((_, i) => (
                <Card key={`locked-${i}`} className="overflow-hidden opacity-75" data-testid={`card-locked-question-${previewCount + i}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-400">Question {previewCount + i + 1}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-4" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="h-10 bg-gray-50 rounded-lg border border-gray-100" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white flex items-end justify-center pb-8">
              <div className="text-center px-4">
                <Shield className="w-10 h-10 mx-auto mb-3" style={{ color }} />
                <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-unlock-heading">
                  Unlock {data.totalAvailable}+ {topicTitle} Questions
                </h3>
                <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto">
                  Get full access to detailed rationales, adaptive difficulty, progress tracking, and personalized study plans.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {!user ? (
                    <>
                      <Link href="/start-free">
                        <Button className="text-white px-6 py-3 text-base font-semibold shadow-lg" style={{ backgroundColor: color }} size="lg" data-testid="button-start-free">
                          Start Free <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button variant="outline" className="px-6 py-3" size="lg" data-testid="button-login">
                          Already have an account? Log in
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/pricing">
                        <Button className="text-white px-6 py-3 text-base font-semibold shadow-lg" style={{ backgroundColor: color }} size="lg" data-testid="button-upgrade">
                          Upgrade to Unlock <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                      <Link href="/pricing">
                        <Button variant="outline" className="px-6 py-3" size="lg" data-testid="button-view-plans">
                          View Plans
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {(data.relatedLessons.length > 0 || data.relatedFlashcards.length > 0) && (
          <section className="mb-10" data-testid="section-related-resources">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{t("pages.specialtyPreview.relatedStudyResources")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.relatedLessons.map(lesson => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all group"
                  data-testid={`link-lesson-${lesson.id}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-teal-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors truncate">{lesson.title}</h3>
                    <p className="text-xs text-gray-500">{t("pages.specialtyPreview.lesson")}</p>
                  </div>
                </Link>
              ))}
              {data.relatedFlashcards.map(deck => (
                <Link
                  key={deck.slug}
                  href={`/flashcards/deck/${deck.slug}`}
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all group"
                  data-testid={`link-flashcard-${deck.slug}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">{deck.title}</h3>
                    <p className="text-xs text-gray-500">{t("pages.specialtyPreview.flashcardDeck")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {data.relatedTopics.length > 0 && (
          <section className="mt-16 mb-10" data-testid="section-related-topics">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" style={{ color }} />
              More {data.bodySystem} Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.relatedTopics.map(rt => (
                <Link
                  key={rt.topicSlug}
                  href={`/preview/${rt.topicSlug}`}
                  className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all group"
                  data-testid={`link-related-topic-${rt.topicSlug}`}
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors capitalize">{rt.topic}</h3>
                    <p className="text-xs text-gray-400">{rt.questionCount} questions</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {(() => {
          const certMap: Record<string, { slug: string; name: string; label: string }[]> = {
            "icu": [
              { slug: "acls", name: "ACLS", label: "Advanced Cardiovascular Life Support" },
              { slug: "bls", name: "BLS", label: "Basic Life Support" },
            ],
            "emergency-nursing": [
              { slug: "tncc", name: "TNCC", label: "Trauma Nursing Core Course" },
              { slug: "enpc", name: "ENPC", label: "Emergency Nursing Pediatric Course" },
              { slug: "acls", name: "ACLS", label: "Advanced Cardiovascular Life Support" },
            ],
            "nicu": [
              { slug: "nrp", name: "NRP", label: "Neonatal Resuscitation Program" },
              { slug: "pals", name: "PALS", label: "Pediatric Advanced Life Support" },
            ],
            "pediatric-icu": [
              { slug: "pals", name: "PALS", label: "Pediatric Advanced Life Support" },
              { slug: "enpc", name: "ENPC", label: "Emergency Nursing Pediatric Course" },
            ],
            "med-surg": [
              { slug: "bls", name: "BLS", label: "Basic Life Support" },
              { slug: "acls", name: "ACLS", label: "Advanced Cardiovascular Life Support" },
            ],
          };
          const relevantCerts = certMap[data.slug] || [];
          if (relevantCerts.length === 0) return null;
          return (
            <section className="mt-10 mb-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6" data-testid="section-cert-cross-promo">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-gray-900">{t("pages.specialtyPreview.relatedCertificationPrep")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relevantCerts.map(cert => (
                  <Link
                    key={cert.slug}
                    href={`/certifications/${cert.slug}-prep`}
                    className="flex items-center gap-3 bg-white rounded-xl border border-amber-100 p-4 hover:shadow-md hover:border-amber-300 transition-all group"
                    data-testid={`link-cert-${cert.slug}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">{cert.name} Prep Guide</h3>
                      <p className="text-xs text-gray-500">{cert.label}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 flex-shrink-0 ml-auto" />
                  </Link>
                ))}
              </div>
              <Link
                href="/nursing-certifications"
                className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 mt-3"
                data-testid="link-all-certs-from-specialty"
              >
                View all certification prep guides <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </section>
          );
        })()}

        <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border border-gray-100 text-center px-6" data-testid="section-final-cta">
          <Star className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-final-cta-heading">
            Master {topicTitle} for Your NCLEX Exam
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Access {data.totalAvailable}+ questions on {data.topic} with complete rationales,
            adaptive difficulty, and personalized progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/pricing" : "/start-free"}>
              <Button className="text-white px-8 py-3 text-base font-semibold shadow-lg" style={{ backgroundColor: color }} size="lg" data-testid="button-final-cta">
                {user ? "Upgrade Now" : "Get Started Free"} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/pricing" className="text-teal-600 font-medium hover:text-teal-700 text-sm" data-testid="link-view-pricing">
              View All Plans
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function SpecialtyPreviewPage() {
  const params = useParams<{ specialty: string }>();
  const { user } = useAuth();
  const specialty = params.specialty || "";
  const config = SPECIALTY_PREVIEWS[specialty];

  if (!config) {
    return <ApiDrivenPreview slug={specialty} />;
  }

  const previewCount = 5;
  const lockedCount = 5;
  const previewQuestions = config.sampleQuestions.slice(0, previewCount);

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`specialty-preview-${config.slug}`}>
      <Navigation />
      <SEO
        title={`${config.name} Practice Questions — Free Preview | NurseNest`}
        description={config.description}
        canonicalPath={`/preview/${config.slug}`}
        keywords={`${config.name} practice questions, ${config.name} NCLEX, nursing ${config.slug} questions, ${config.name} quiz`}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Practice Questions", url: "https://www.nursenest.ca/practice-questions" },
          { name: config.name, url: `https://www.nursenest.ca/preview/${config.slug}` },
        ]}
      />

      <nav className="bg-white border-b border-gray-100 py-3 px-4" data-testid="breadcrumbs">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors" data-testid="breadcrumb-home">{t("pages.specialtyPreview.home2")}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/practice-questions" className="hover:text-primary transition-colors" data-testid="breadcrumb-practice">{t("pages.specialtyPreview.practiceQuestions2")}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium" data-testid="breadcrumb-current">{config.name}</span>
        </div>
      </nav>

      <section className="relative py-12 sm:py-16 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${config.color}10, white, ${config.color}08)` }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4 text-white" style={{ backgroundColor: config.color }} data-testid="badge-specialty">
            <Stethoscope className="w-3 h-3 mr-1" /> Specialty Preview
          </Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-specialty-title">
            {config.name} Practice Questions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl" data-testid="text-specialty-description">
            {config.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <FileText className="w-4 h-4" style={{ color: config.color }} />
              <span>{config.totalQuestionCount}+ questions available</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Eye className="w-4 h-4" style={{ color: config.color }} />
              <span>{previewCount} free preview questions below</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5" style={{ color: config.color }} />
          <h2 className="text-xl font-bold text-gray-900" data-testid="heading-preview-questions">
            Preview Questions
          </h2>
          <Badge variant="outline" className="ml-auto text-xs">
            {previewCount} of {config.totalQuestionCount}+ questions
          </Badge>
        </div>

        <div className="space-y-6 mb-10">
          {previewQuestions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} isPreview={true} />
          ))}
        </div>

        <div className="relative mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-500" data-testid="heading-locked-questions">
              More Questions Available
            </h2>
          </div>
          <div className="space-y-4">
            {Array.from({ length: lockedCount }).map((_, i) => (
              <QuestionCard
                key={`locked-${i}`}
                question={{
                  id: `locked-${i}`,
                  question: "",
                  options: [],
                  correctIndex: 0,
                  rationale: "",
                  category: "",
                }}
                index={previewCount + i}
                isPreview={false}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white flex items-end justify-center pb-8">
            <div className="text-center px-4">
              <Shield className="w-10 h-10 mx-auto mb-3" style={{ color: config.color }} />
              <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-unlock-heading">
                Unlock {config.totalQuestionCount}+ {config.name} Questions
              </h3>
              <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto">
                Get full access to detailed rationales, adaptive difficulty, progress tracking, and personalized study plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!user ? (
                  <>
                    <Link href="/start-free">
                      <Button className="text-white px-6 py-3 text-base font-semibold shadow-lg" style={{ backgroundColor: config.color }} size="lg" data-testid="button-start-free">
                        Start Free <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="px-6 py-3" size="lg" data-testid="button-login">
                        Already have an account? Log in
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/pricing">
                      <Button className="text-white px-6 py-3 text-base font-semibold shadow-lg" style={{ backgroundColor: config.color }} size="lg" data-testid="button-upgrade">
                        Upgrade to Unlock <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button variant="outline" className="px-6 py-3" size="lg" data-testid="button-view-plans">
                        View Plans
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 mb-10" data-testid="section-related-topics">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: config.color }} />
            Topics Covered
          </h2>
          <div className="flex flex-wrap gap-2">
            {config.relatedTopics.map((topic) => (
              <Badge key={topic} variant="outline" className="text-sm py-1.5 px-3" data-testid={`badge-topic-${topic.replace(/\s+/g, '-').toLowerCase()}`}>
                {topic}
              </Badge>
            ))}
          </div>
        </section>

        {config.guideSlug && (
          <section className="mb-10" data-testid="section-guide-link">
            <Card className="border-l-4" style={{ borderLeftColor: config.color }}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.color}15` }}>
                  <BookOpen className="w-6 h-6" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{t("pages.specialtyPreview.wantToLearnMore")}</h3>
                  <p className="text-sm text-gray-600">Read our comprehensive {config.name} study guide with clinical skills, conditions, and career information.</p>
                </div>
                <Link href={`/guides/${config.guideSlug}`}>
                  <Button variant="outline" className="shrink-0" data-testid="button-read-guide">
                    Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        )}

        <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border border-gray-100 text-center px-6" data-testid="section-final-cta">
          <Star className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-final-cta-heading">
            Ready to Master {config.name}?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of nursing students using NurseNest to pass their exams with confidence.
            Full access to {config.totalQuestionCount}+ questions with detailed rationales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/pricing" : "/start-free"}>
              <Button className="text-white px-8 py-3 text-base font-semibold shadow-lg" style={{ backgroundColor: config.color }} size="lg" data-testid="button-final-cta">
                {user ? "Upgrade Now" : "Get Started Free"} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/pricing" className="text-teal-600 font-medium hover:text-teal-700 text-sm" data-testid="link-view-pricing">
              View All Plans
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export { SPECIALTY_PREVIEWS };
