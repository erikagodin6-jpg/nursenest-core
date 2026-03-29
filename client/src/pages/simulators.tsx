import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  Stethoscope,
  Activity,
  Heart,
  Wind,
  Brain,
  Thermometer,
  Droplets,
  Pill,
  FlaskConical,
  ShieldCheck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Lock,
  ArrowRight,
  ArrowLeft,
  Clock,
  Eye,
  Beaker,
  TestTube2,
  Baby,
  Syringe,
  Scissors,
  Ear,
  Bandage,
  AlertTriangle,
  Gauge,
  Bone,
  Scale,
} from "lucide-react";

const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

interface StationScenario {
  question: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
}

interface Station {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  available: boolean;
  icon: any;
  scenario?: StationScenario;
}

const osceStations: Station[] = [
  {
    id: "head-to-toe",
    title: "Head-to-Toe Assessment",
    description: "Systematic physical assessment from head to toe following proper clinical sequence.",
    difficulty: "Beginner",
    available: true,
    icon: Eye,
    scenario: {
      question: "During a head-to-toe assessment, you notice the patient has JVD (jugular venous distension). What does this finding most likely indicate?",
      options: [
        { id: "a", text: "Dehydration", correct: false },
        { id: "b", text: "Right-sided heart failure", correct: true },
        { id: "c", text: "Hyperthyroidism", correct: false },
        { id: "d", text: "Liver cirrhosis", correct: false },
      ],
      explanation: "JVD (jugular venous distension) is a classic sign of right-sided heart failure. When the right ventricle cannot effectively pump blood forward, pressure backs up into the venous system, causing visible distension of the jugular veins. Dehydration would cause flat neck veins, not distended ones.",
    },
  },
  {
    id: "vital-signs",
    title: "Vital Signs Interpretation",
    description: "Interpret vital sign patterns and identify clinical significance of abnormal values.",
    difficulty: "Beginner",
    available: true,
    icon: Activity,
    scenario: {
      question: "A patient presents with BP 88/52, HR 126, RR 28, Temp 39.2\u00B0C, SpO2 94%. Which condition does this vital sign cluster most suggest?",
      options: [
        { id: "a", text: "Cardiogenic shock", correct: false },
        { id: "b", text: "Septic shock", correct: true },
        { id: "c", text: "Hypovolemic shock", correct: false },
        { id: "d", text: "Neurogenic shock", correct: false },
      ],
      explanation: "This presentation: hypotension, tachycardia, tachypnea, fever, and mildly decreased SpO2: is the hallmark of septic shock. The elevated temperature with hemodynamic instability suggests a systemic infectious process. Cardiogenic shock typically presents with cool/clammy skin without fever, and neurogenic shock presents with bradycardia rather than tachycardia.",
    },
  },
  {
    id: "med-admin",
    title: "Medication Administration Safety",
    description: "Practice the rights of medication administration and identify safety concerns.",
    difficulty: "Intermediate",
    available: true,
    icon: Pill,
    scenario: {
      question: "You are about to administer IV potassium chloride 40 mEq. The pharmacy sends it in 100 mL NS. What is the MOST important safety consideration?",
      options: [
        { id: "a", text: "Administer via rapid IV push for faster effect", correct: false },
        { id: "b", text: "Infuse over at least 1 hour using an IV pump; never push IV potassium", correct: true },
        { id: "c", text: "Mix with D5W instead of NS", correct: false },
        { id: "d", text: "Administer without cardiac monitoring", correct: false },
      ],
      explanation: "IV potassium must NEVER be given via IV push: it can cause fatal cardiac arrhythmias. It must be diluted and infused slowly (typically no faster than 10 mEq/hour peripherally, 20 mEq/hour centrally) using an infusion pump. Cardiac monitoring is recommended for rates >10 mEq/hr. This is a critical patient safety principle tested on NCLEX.",
    },
  },
  {
    id: "wound-assessment",
    title: "Wound Assessment & Documentation",
    description: "Assess wound characteristics, staging, and proper documentation techniques.",
    difficulty: "Intermediate",
    available: true,
    icon: Bandage,
    scenario: {
      question: "You are assessing a patient's sacral wound. You observe full-thickness tissue loss with visible subcutaneous fat, but no exposed bone, tendon, or muscle. The wound bed has 60% red granulation tissue and 40% yellow slough. What pressure injury stage is this?",
      options: [
        { id: "a", text: "Stage 2", correct: false },
        { id: "b", text: "Stage 3", correct: true },
        { id: "c", text: "Stage 4", correct: false },
        { id: "d", text: "Unstageable", correct: false },
      ],
      explanation: "Stage 3 pressure injuries involve full-thickness tissue loss where subcutaneous fat may be visible, but bone, tendon, and muscle are NOT exposed. The presence of yellow slough does not make it unstageable because the majority of the wound bed is still visible. Stage 4 would show exposed bone, tendon, or muscle. Unstageable wounds have the base completely obscured by slough or eschar.",
    },
  },
  {
    id: "iv-therapy",
    title: "IV Therapy & Fluid Management",
    description: "Manage IV access, fluid types, and infusion rate calculations.",
    difficulty: "Advanced",
    available: true,
    icon: Droplets,
    scenario: {
      question: "A patient with hyponatremia (Na+ 118 mEq/L) is ordered 3% hypertonic saline at 30 mL/hr. During infusion, the patient develops headache, nausea, and confusion. Serum Na+ is now 132 mEq/L (rose 14 mEq in 12 hours). What is the PRIORITY nursing action?",
      options: [
        { id: "a", text: "Continue the infusion as ordered since sodium is still low", correct: false },
        { id: "b", text: "Stop the hypertonic saline immediately and notify the provider; correction is too rapid", correct: true },
        { id: "c", text: "Increase the infusion rate to normalize sodium faster", correct: false },
        { id: "d", text: "Switch to normal saline and continue at the same rate", correct: false },
      ],
      explanation: "Sodium correction should not exceed 8-10 mEq/L in 24 hours. A rise of 14 mEq/L in 12 hours is dangerously rapid and risks osmotic demyelination syndrome (ODS/central pontine myelinolysis), which can cause irreversible neurological damage. The headache and confusion are warning signs. The nurse must stop the infusion immediately and notify the provider. The provider may order D5W or desmopressin (DDAVP) to slow the correction.",
    },
  },
  {
    id: "patient-education",
    title: "Patient Education & Discharge Planning",
    description: "Develop patient-centered education and safe discharge planning strategies.",
    difficulty: "Intermediate",
    available: true,
    icon: Brain,
    scenario: {
      question: "You are providing discharge education to a patient prescribed warfarin for a new DVT. The patient asks, 'Can I still eat salads?' What is the BEST response?",
      options: [
        { id: "a", text: "You must completely avoid all leafy green vegetables while on warfarin", correct: false },
        { id: "b", text: "Eat a consistent amount of vitamin K-rich foods each day; do not suddenly increase or decrease intake", correct: true },
        { id: "c", text: "Eat as much salad as you want; food does not affect warfarin", correct: false },
        { id: "d", text: "Only eat cooked vegetables, never raw", correct: false },
      ],
      explanation: "The key principle with warfarin and vitamin K is CONSISTENCY, not avoidance. Patients should maintain a stable, consistent intake of vitamin K-rich foods (leafy greens, broccoli, etc.) so the warfarin dose can be adjusted accordingly. Sudden changes in vitamin K intake alter the anticoagulant effect. Complete avoidance is unnecessary and nutritionally harmful. The INR target for DVT treatment is typically 2.0-3.0.",
    },
  },
  {
    id: "respiratory",
    title: "Respiratory Assessment",
    description: "Assess breath sounds, respiratory patterns, and oxygen delivery systems.",
    difficulty: "Intermediate",
    available: true,
    icon: Wind,
    scenario: {
      question: "You auscultate coarse crackles bilaterally in a patient with a history of CHF. The patient is sitting upright and using accessory muscles. What is your priority nursing action?",
      options: [
        { id: "a", text: "Encourage deep breathing and coughing exercises", correct: false },
        { id: "b", text: "Administer prescribed diuretic and elevate HOB to high-Fowler's", correct: true },
        { id: "c", text: "Apply a nasal cannula at 6 L/min", correct: false },
        { id: "d", text: "Suction the airway", correct: false },
      ],
      explanation: "Bilateral coarse crackles in a CHF patient indicate pulmonary edema from fluid overload. The priority is to reduce fluid volume with the prescribed diuretic (e.g., furosemide) and position the patient in high-Fowler's to improve lung expansion and reduce preload. Suctioning is not appropriate as the crackles are from fluid in the alveoli, not secretions in the airway.",
    },
  },
  {
    id: "cardiac",
    title: "Cardiac Assessment",
    description: "Perform cardiac auscultation, identify heart sounds, and recognize abnormalities.",
    difficulty: "Advanced",
    available: true,
    icon: Heart,
    scenario: {
      question: "During cardiac auscultation, you hear an S3 heart sound in a 68-year-old patient. What is the clinical significance of this finding?",
      options: [
        { id: "a", text: "Normal finding in elderly patients", correct: false },
        { id: "b", text: "Indicates aortic stenosis", correct: false },
        { id: "c", text: "Suggests heart failure with volume overload", correct: true },
        { id: "d", text: "Indicates mitral valve prolapse", correct: false },
      ],
      explanation: "An S3 heart sound (ventricular gallop) in an adult over 30 is pathological and suggests heart failure with volume overload. It occurs during rapid ventricular filling when the ventricle is already distended. While an S3 can be normal in children and young adults, in elderly patients it is a key indicator of decompensated heart failure and should prompt further assessment.",
    },
  },
  {
    id: "neuro-assessment",
    title: "Neurological Assessment",
    description: "Perform Glasgow Coma Scale scoring, pupil assessment, and cranial nerve checks.",
    difficulty: "Intermediate",
    available: true,
    icon: Brain,
    scenario: {
      question: "You are monitoring a post-craniotomy patient. Previously their GCS was 14 (E4 V4 M6). Now they open eyes to pain only, make incomprehensible sounds, and withdraw from pain. What is the current GCS and what should you do?",
      options: [
        { id: "a", text: "GCS 8 (E2 V2 M4); continue monitoring and reassess in 1 hour", correct: false },
        { id: "b", text: "GCS 8 (E2 V2 M4); notify the neurosurgeon immediately as this represents a significant decline", correct: true },
        { id: "c", text: "GCS 10 (E3 V3 M4); administer prescribed analgesics for pain", correct: false },
        { id: "d", text: "GCS 6 (E1 V2 M3); prepare for emergency intubation", correct: false },
      ],
      explanation: "Eyes to pain = E2, incomprehensible sounds = V2, withdrawal from pain = M4, total GCS = 8. A drop from GCS 14 to 8 (a decline of 6 points) is a critical neurological deterioration suggesting increased intracranial pressure, rebleeding, or cerebral edema. The neurosurgeon must be notified immediately. A GCS of 8 or below indicates the patient may not be able to protect their airway, and intubation may be needed, but the first step is notification.",
    },
  },
  {
    id: "abdominal-assessment",
    title: "Abdominal Assessment",
    description: "Perform systematic abdominal examination: inspection, auscultation, percussion, palpation.",
    difficulty: "Beginner",
    available: true,
    icon: Stethoscope,
    scenario: {
      question: "When performing an abdominal assessment, what is the correct sequence of examination techniques?",
      options: [
        { id: "a", text: "Palpation, percussion, auscultation, inspection", correct: false },
        { id: "b", text: "Inspection, palpation, percussion, auscultation", correct: false },
        { id: "c", text: "Inspection, auscultation, percussion, palpation", correct: true },
        { id: "d", text: "Auscultation, inspection, percussion, palpation", correct: false },
      ],
      explanation: "The abdominal assessment uniquely follows the sequence: inspection, auscultation, percussion, palpation. Auscultation is performed BEFORE percussion and palpation because touching the abdomen first can alter bowel sounds and give inaccurate results. Always listen before you touch. Bowel sounds should be assessed in all four quadrants, listening for at least 1 minute per quadrant (some sources recommend up to 5 minutes total) before documenting absent bowel sounds.",
    },
  },
  {
    id: "pain-assessment",
    title: "Pain Assessment & Management",
    description: "Use validated pain scales, assess pain characteristics, and evaluate interventions.",
    difficulty: "Beginner",
    available: true,
    icon: Activity,
    scenario: {
      question: "A non-verbal patient post-stroke is grimacing, moaning, and guarding their right hip. The patient cannot use a numeric pain scale. Which pain assessment tool is MOST appropriate?",
      options: [
        { id: "a", text: "Visual Analog Scale (VAS)", correct: false },
        { id: "b", text: "Wong-Baker FACES scale", correct: false },
        { id: "c", text: "FLACC or CPOT behavioral pain scale", correct: true },
        { id: "d", text: "Ask a family member to rate the pain on a 0-10 scale", correct: false },
      ],
      explanation: "For non-verbal adult patients who cannot self-report, behavioral pain tools like CPOT (Critical Care Pain Observation Tool) or FLACC (Face, Legs, Activity, Cry, Consolability) are most appropriate. These tools assess observable indicators: facial expression, body movements, muscle tension, and vocalization. The VAS and numeric scale require patient participation. Wong-Baker requires the patient to point, which this patient cannot do. Family proxy reports are helpful but less reliable than validated behavioral tools.",
    },
  },
  {
    id: "blood-transfusion",
    title: "Blood Transfusion Safety",
    description: "Manage blood product administration, verify compatibility, and recognize reactions.",
    difficulty: "Advanced",
    available: true,
    icon: Droplets,
    scenario: {
      question: "Ten minutes into a PRBC transfusion, the patient develops fever (38.9\u00B0C), chills, flank pain, and dark-colored urine. What type of transfusion reaction is this and what is your FIRST action?",
      options: [
        { id: "a", text: "Febrile non-hemolytic reaction; slow the transfusion rate and administer acetaminophen", correct: false },
        { id: "b", text: "Acute hemolytic transfusion reaction; STOP the transfusion immediately, maintain IV access with NS", correct: true },
        { id: "c", text: "Allergic reaction; administer diphenhydramine and continue transfusion", correct: false },
        { id: "d", text: "TRALI; position the patient upright and increase oxygen", correct: false },
      ],
      explanation: "Fever, chills, flank pain, and dark urine (hemoglobinuria) are classic signs of an acute hemolytic transfusion reaction caused by ABO incompatibility. This is a medical emergency. The nurse must: 1) STOP the transfusion immediately, 2) Keep the IV line open with normal saline (new tubing), 3) Notify the provider and blood bank, 4) Send blood samples and the transfusion bag for analysis. Hemolysis can lead to DIC, acute renal failure, and death. Never slow down a suspected hemolytic reaction.",
    },
  },
  {
    id: "fall-prevention",
    title: "Fall Risk Assessment & Prevention",
    description: "Assess fall risk factors, implement prevention strategies, and manage post-fall protocols.",
    difficulty: "Beginner",
    available: true,
    icon: AlertTriangle,
    scenario: {
      question: "An 82-year-old patient with a Morse Fall Scale score of 75 (high risk) is found on the floor beside the bed. They are alert, oriented, deny pain, and have no visible injuries. What is your FIRST nursing action?",
      options: [
        { id: "a", text: "Help the patient back to bed and document the incident", correct: false },
        { id: "b", text: "Do not move the patient; perform a head-to-toe assessment before assisting them up", correct: true },
        { id: "c", text: "Call the provider to order X-rays", correct: false },
        { id: "d", text: "Apply a bed alarm and continue with your other patients", correct: false },
      ],
      explanation: "After a fall, the priority is to assess the patient BEFORE moving them. Even if the patient denies pain, injuries such as hip fractures or subdural hematomas may not be immediately apparent, especially in elderly patients on anticoagulants. Complete a thorough neurovascular and musculoskeletal assessment first. Then assist the patient, notify the provider, document the incident, perform post-fall neurological checks (q15min to q1h), and review/update the fall prevention plan.",
    },
  },
  {
    id: "oxygen-therapy",
    title: "Oxygen Delivery Systems",
    description: "Select appropriate oxygen devices, titrate flow rates, and monitor effectiveness.",
    difficulty: "Intermediate",
    available: true,
    icon: Wind,
    scenario: {
      question: "A COPD patient arrives with SpO2 82%, RR 28, and is using accessory muscles. The physician orders 'titrate O2 to maintain SpO2 88-92%.' Which device do you apply first?",
      options: [
        { id: "a", text: "Simple face mask at 10 L/min", correct: false },
        { id: "b", text: "Non-rebreather mask at 15 L/min", correct: false },
        { id: "c", text: "Venturi mask set to 28% FiO2", correct: true },
        { id: "d", text: "Nasal cannula at 6 L/min", correct: false },
      ],
      explanation: "For COPD patients, the Venturi mask provides precise, controlled oxygen delivery. COPD patients rely on hypoxic drive for breathing; giving too much oxygen can suppress their respiratory drive. The Venturi mask delivers exact FiO2 concentrations (24-50%). Starting at 28% FiO2 allows controlled titration to the target SpO2 of 88-92%. A non-rebreather delivers near 100% FiO2 which is dangerous for COPD patients. A nasal cannula at 6 L/min exceeds the recommended 1-2 L/min starting range for COPD.",
    },
  },
  {
    id: "tracheostomy-care",
    title: "Tracheostomy Care & Suctioning",
    description: "Perform tracheostomy care, suctioning technique, and manage complications.",
    difficulty: "Advanced",
    available: true,
    icon: Scissors,
    scenario: {
      question: "While suctioning a tracheostomy patient, you notice the patient's heart rate drops from 88 to 48 bpm and SpO2 falls to 84%. What should you do?",
      options: [
        { id: "a", text: "Continue suctioning to clear the airway as quickly as possible", correct: false },
        { id: "b", text: "Immediately stop suctioning, withdraw the catheter, and hyperoxygenate with 100% O2", correct: true },
        { id: "c", text: "Switch to a larger suction catheter for more effective clearance", correct: false },
        { id: "d", text: "Insert an oral airway alongside the tracheostomy tube", correct: false },
      ],
      explanation: "Bradycardia during suctioning is caused by vagal nerve stimulation from the catheter. Combined with desaturation, this is a medical emergency. Stop suctioning immediately, withdraw the catheter, and provide 100% oxygen via the trach or bag-valve-mask. Each suctioning pass should be limited to 10-15 seconds maximum. Hyperoxygenate before and after each pass. If bradycardia persists, atropine may be required. Never continue suctioning when the patient is hemodynamically unstable.",
    },
  },
  {
    id: "maternal-assessment",
    title: "Maternal & Newborn Assessment",
    description: "Assess fundal height, lochia, and perform initial newborn evaluation.",
    difficulty: "Intermediate",
    available: true,
    icon: Baby,
    scenario: {
      question: "You are assessing a postpartum patient 2 hours after vaginal delivery. The fundus is boggy, displaced to the right of midline, and palpated 2 cm above the umbilicus. Lochia rubra is heavy with large clots. What is your FIRST action?",
      options: [
        { id: "a", text: "Administer the prescribed oxytocin infusion", correct: false },
        { id: "b", text: "Massage the fundus firmly and have the patient empty her bladder", correct: true },
        { id: "c", text: "Apply an ice pack to the perineum", correct: false },
        { id: "d", text: "Notify the obstetrician immediately", correct: false },
      ],
      explanation: "A boggy, displaced uterus with heavy lochia and clots indicates uterine atony, the most common cause of postpartum hemorrhage. Displacement to the right suggests a full bladder is preventing uterine contraction. The FIRST action is to massage the fundus to stimulate contraction and have the patient void (or catheterize if unable). A full bladder is the most common reason the uterus fails to contract. After initial interventions, if the fundus remains boggy, then administer uterotonics (oxytocin) and notify the provider.",
    },
  },
  {
    id: "diabetes-management",
    title: "Diabetes Assessment & Insulin Safety",
    description: "Manage blood glucose monitoring, insulin administration, and hypo/hyperglycemia.",
    difficulty: "Intermediate",
    available: true,
    icon: Syringe,
    scenario: {
      question: "A patient on a sliding scale insulin regimen has a blood glucose of 42 mg/dL. They are conscious, diaphoretic, and trembling. What is your priority intervention?",
      options: [
        { id: "a", text: "Administer the next scheduled dose of insulin", correct: false },
        { id: "b", text: "Give 15-20 g of fast-acting carbohydrate (e.g., 4 oz juice) and recheck glucose in 15 minutes", correct: true },
        { id: "c", text: "Give D50W IV push immediately", correct: false },
        { id: "d", text: "Hold insulin and recheck glucose in 1 hour", correct: false },
      ],
      explanation: "For a conscious hypoglycemic patient, the Rule of 15 applies: give 15-20 g of fast-acting carbohydrate (4 oz juice, 3-4 glucose tablets, or 8 oz milk), wait 15 minutes, recheck glucose, and repeat if still below 70 mg/dL. IV D50W is reserved for patients who cannot swallow or are unconscious. Simply holding insulin without treating the acute hypoglycemia delays correction of a potentially dangerous condition. After stabilization, investigate the cause (missed meal, excessive insulin, increased activity).",
    },
  },
  {
    id: "infection-control",
    title: "Infection Control & Isolation Precautions",
    description: "Apply transmission-based precautions and perform proper donning/doffing of PPE.",
    difficulty: "Beginner",
    available: true,
    icon: ShieldCheck,
    scenario: {
      question: "A patient is admitted with suspected active pulmonary tuberculosis. Which isolation precautions should be implemented?",
      options: [
        { id: "a", text: "Contact precautions: gown and gloves", correct: false },
        { id: "b", text: "Droplet precautions: surgical mask within 3 feet", correct: false },
        { id: "c", text: "Airborne precautions: negative pressure room and N95 respirator", correct: true },
        { id: "d", text: "Standard precautions only with hand hygiene", correct: false },
      ],
      explanation: "Active pulmonary TB requires AIRBORNE precautions because the Mycobacterium tuberculosis bacilli remain suspended in air for extended periods in tiny droplet nuclei (<5 microns). Requirements include: a negative pressure (airborne infection isolation) room with 6-12 air changes per hour, door kept closed, and all staff must wear fit-tested N95 respirators (not surgical masks). Droplet precautions are insufficient because TB particles are much smaller than droplets and can travel beyond 3 feet. The patient should wear a surgical mask during transport.",
    },
  },
  {
    id: "perioperative-care",
    title: "Perioperative Nursing Assessment",
    description: "Manage pre-op verification, intra-op safety checks, and post-op recovery assessment.",
    difficulty: "Intermediate",
    available: true,
    icon: Scissors,
    scenario: {
      question: "During the pre-operative checklist, the surgical consent form lists 'right knee arthroscopy' but the surgical site marking shows an 'X' on the LEFT knee. What is the appropriate nursing action?",
      options: [
        { id: "a", text: "Proceed with surgery based on the consent form since it is the legal document", correct: false },
        { id: "b", text: "Stop the process, do NOT proceed, and clarify the discrepancy with the surgeon before going to the OR", correct: true },
        { id: "c", text: "Change the site marking to match the consent form", correct: false },
        { id: "d", text: "Document the discrepancy and proceed; the surgeon will verify in the OR", correct: false },
      ],
      explanation: "ANY discrepancy between the consent form, site marking, and patient verification is a critical safety concern that requires a STOP. This is part of the Joint Commission's Universal Protocol to prevent wrong-site, wrong-procedure, and wrong-patient surgery. The nurse must halt the process and contact the surgeon to resolve the discrepancy before the patient enters the OR. The nurse should never change the site marking or assume the consent is correct. A surgical timeout must confirm all elements match before the first incision.",
    },
  },
  {
    id: "mental-status-exam",
    title: "Mental Status Examination",
    description: "Perform a structured mental status exam: appearance, mood, cognition, and thought process.",
    difficulty: "Intermediate",
    available: true,
    icon: Brain,
    scenario: {
      question: "During a mental status exam, a patient says: 'The TV is sending me coded messages about the government poisoning the water supply. They put a chip in my tooth at the dentist to track me.' How would you document this finding?",
      options: [
        { id: "a", text: "The patient is confused and disoriented", correct: false },
        { id: "b", text: "Thought content: paranoid delusions with persecutory and ideas of reference themes", correct: true },
        { id: "c", text: "The patient is malingering for attention", correct: false },
        { id: "d", text: "Thought process: tangential with loose associations", correct: false },
      ],
      explanation: "This presentation demonstrates paranoid delusions (false fixed beliefs about being tracked/poisoned), ideas of reference (believing the TV is sending personal messages), and persecutory themes (government conspiracy). These are disturbances of thought CONTENT, not thought process. The thought process (how they connect ideas) may actually be logical; it is the content (what they believe) that is disturbed. Delusions are different from confusion/disorientation. Documenting accurately using psychiatric terminology is essential for treatment planning and communication among the care team.",
    },
  },
  {
    id: "ecg-interpretation",
    title: "ECG Rhythm Interpretation",
    description: "Identify common cardiac rhythms, recognize life-threatening arrhythmias, and intervene.",
    difficulty: "Advanced",
    available: true,
    icon: Heart,
    scenario: {
      question: "On the cardiac monitor, you see an irregularly irregular rhythm with no identifiable P waves, a narrow QRS complex, and a ventricular rate of 142 bpm. The patient reports palpitations and mild dyspnea. What rhythm is this and what is the priority intervention?",
      options: [
        { id: "a", text: "Ventricular tachycardia; prepare for immediate defibrillation", correct: false },
        { id: "b", text: "Atrial fibrillation with rapid ventricular response; notify the provider and prepare for rate control", correct: true },
        { id: "c", text: "Sinus tachycardia; assess for pain or anxiety", correct: false },
        { id: "d", text: "Atrial flutter; prepare for cardioversion", correct: false },
      ],
      explanation: "Irregularly irregular rhythm + absent P waves + narrow QRS = atrial fibrillation (A-fib). With a rate of 142 bpm, this is A-fib with rapid ventricular response (RVR). The narrow QRS indicates the electrical impulse is traveling normally through the ventricles. Since the patient is symptomatic but hemodynamically stable, the priority is rate control (IV diltiazem or IV metoprolol). Sinus tachycardia would show regular rhythm with P waves. V-tach typically shows wide QRS complexes. Atrial flutter shows a regular sawtooth pattern.",
    },
  },
  {
    id: "nasogastric-tube",
    title: "Nasogastric Tube Management",
    description: "Insert, verify placement, maintain, and troubleshoot nasogastric tubes.",
    difficulty: "Intermediate",
    available: true,
    icon: Stethoscope,
    scenario: {
      question: "After inserting a nasogastric tube, you need to verify placement. You aspirate fluid with a pH of 2.5. What does this confirm, and what additional verification is recommended?",
      options: [
        { id: "a", text: "Confirms gastric placement; no further verification needed", correct: false },
        { id: "b", text: "Suggests respiratory placement; remove the tube immediately", correct: false },
        { id: "c", text: "Confirms gastric placement (pH <5); radiographic confirmation is the gold standard before first use for feeding", correct: true },
        { id: "d", text: "Inconclusive; inject air and auscultate over the epigastrium", correct: false },
      ],
      explanation: "A pH of 2.5 is strongly acidic, consistent with gastric contents (gastric pH is typically 1-5). However, the gold standard for initial NGT placement verification is radiographic (X-ray) confirmation, especially before the first feeding. The auscultation method (air bolus) is NO longer considered reliable because it can sound similar whether the tube is in the stomach, esophagus, or lung. After initial X-ray confirmation, subsequent checks can use pH testing (gastric <5, intestinal 6-7, respiratory >7) and aspiration characteristics.",
    },
  },
  {
    id: "musculoskeletal-assessment",
    title: "Musculoskeletal & Neurovascular Assessment",
    description: "Assess the 6 P's, perform compartment syndrome screening, and manage traction/casts.",
    difficulty: "Intermediate",
    available: true,
    icon: Bone,
    scenario: {
      question: "A patient with a tibial fracture and a new long leg cast reports severe pain (9/10) in the lower leg that worsens with passive toe extension. The foot is pale and cool with weak dorsalis pedis pulse. What condition do you suspect and what is the nursing priority?",
      options: [
        { id: "a", text: "Deep vein thrombosis; elevate the leg and apply warm compresses", correct: false },
        { id: "b", text: "Compartment syndrome; loosen/bivalve the cast, elevate the limb, and notify the surgeon IMMEDIATELY for emergent fasciotomy", correct: true },
        { id: "c", text: "Normal post-fracture swelling; administer prescribed analgesics", correct: false },
        { id: "d", text: "Cast too tight; bivalve the cast and reassess", correct: false },
      ],
      explanation: "The 6 P's of compartment syndrome are present: Pain (severe, out of proportion, worse with passive stretch), Pallor, Pulselessness (weak pulse), and likely Paresthesia and Paralysis. Compartment syndrome is a surgical emergency. The nurse should immediately loosen or bivalve the cast to relieve external pressure, keep the limb at heart level (not elevated, as elevation reduces perfusion), and notify the surgeon urgently. The definitive treatment is emergent fasciotomy. Delays >6 hours can cause permanent muscle necrosis and limb loss.",
    },
  },
  {
    id: "fluid-electrolyte",
    title: "Fluid & Electrolyte Balance",
    description: "Assess fluid volume status, interpret I&O, and recognize electrolyte disturbances.",
    difficulty: "Intermediate",
    available: true,
    icon: Scale,
    scenario: {
      question: "A patient's lab results show: K+ 6.2 mEq/L, peaked T waves on ECG. The provider orders calcium gluconate IV. What is the purpose of calcium gluconate in hyperkalemia?",
      options: [
        { id: "a", text: "It directly lowers serum potassium levels", correct: false },
        { id: "b", text: "It stabilizes the cardiac cell membrane to prevent fatal arrhythmias while other treatments lower potassium", correct: true },
        { id: "c", text: "It causes potassium to shift into cells", correct: false },
        { id: "d", text: "It increases renal excretion of potassium", correct: false },
      ],
      explanation: "Calcium gluconate is a cardiac membrane stabilizer. It does NOT lower potassium levels. It antagonizes the effect of potassium on the myocardium, protecting the heart from life-threatening arrhythmias (peaked T waves can progress to V-fib/asystole). Its effect lasts only 30-60 minutes, providing a window to administer treatments that actually lower K+: insulin/dextrose (shifts K+ into cells), sodium bicarbonate, kayexalate (GI excretion), or dialysis. This is why it is given first: it buys time.",
    },
  },
];

const clinicalLabStations: Station[] = [
  {
    id: "blood-gas",
    title: "Blood Gas Interpretation",
    description: "Analyze arterial blood gas values to identify acid-base imbalances.",
    difficulty: "Advanced",
    available: true,
    icon: FlaskConical,
    scenario: {
      question: "ABG results: pH 7.28, PaCO2 55 mmHg, HCO3 24 mEq/L, PaO2 68 mmHg. What acid-base disturbance is present?",
      options: [
        { id: "a", text: "Metabolic acidosis", correct: false },
        { id: "b", text: "Respiratory acidosis, uncompensated", correct: true },
        { id: "c", text: "Respiratory alkalosis", correct: false },
        { id: "d", text: "Mixed respiratory and metabolic acidosis", correct: false },
      ],
      explanation: "The pH is acidotic (<7.35), PaCO2 is elevated (>45 mmHg) indicating respiratory cause, and HCO3 is normal (22-26 mEq/L) meaning the kidneys have not yet compensated. This is uncompensated respiratory acidosis, commonly seen in COPD exacerbation, opioid overdose, or respiratory failure. The low PaO2 confirms hypoxemia accompanying the hypoventilation.",
    },
  },
  {
    id: "cbc",
    title: "Complete Blood Count Analysis",
    description: "Interpret CBC results and correlate findings with clinical conditions.",
    difficulty: "Beginner",
    available: true,
    icon: TestTube2,
    scenario: {
      question: "CBC results show: WBC 18,500/\u03BCL, Neutrophils 85%, Bands 12%, Hgb 13.5 g/dL, Platelets 245,000/\u03BCL. What does the 'left shift' in the differential indicate?",
      options: [
        { id: "a", text: "Viral infection", correct: false },
        { id: "b", text: "Acute bacterial infection with increased immature neutrophils", correct: true },
        { id: "c", text: "Iron deficiency anemia", correct: false },
        { id: "d", text: "Thrombocytopenia", correct: false },
      ],
      explanation: "A 'left shift' refers to an increase in bands (immature neutrophils >6%) along with elevated WBC and neutrophilia. This pattern strongly suggests acute bacterial infection. The bone marrow releases immature cells to fight the infection before they fully mature. Viral infections typically show lymphocytosis, not neutrophilia with bandemia.",
    },
  },
  {
    id: "bmp",
    title: "Basic Metabolic Panel",
    description: "Evaluate electrolytes, glucose, and renal function from BMP results.",
    difficulty: "Beginner",
    available: true,
    icon: Activity,
    scenario: {
      question: "BMP results: Na+ 128 mEq/L, K+ 5.8 mEq/L, BUN 45 mg/dL, Creatinine 3.2 mg/dL, Glucose 95 mg/dL. Which condition best explains these findings?",
      options: [
        { id: "a", text: "Diabetic ketoacidosis", correct: false },
        { id: "b", text: "Acute kidney injury", correct: true },
        { id: "c", text: "Addison's disease", correct: false },
        { id: "d", text: "Dehydration", correct: false },
      ],
      explanation: "The combination of elevated BUN and creatinine (azotemia), hyperkalemia (K+ 5.8), and hyponatremia (Na+ 128) is the classic triad of acute kidney injury (AKI). The kidneys cannot excrete potassium or concentrate urine properly. Normal glucose rules out DKA. While Addison's can cause similar electrolyte patterns, the markedly elevated renal markers point to AKI as the primary cause.",
    },
  },
  {
    id: "liver-function",
    title: "Liver Function Tests",
    description: "Interpret LFTs to differentiate hepatocellular vs. cholestatic liver disease.",
    difficulty: "Intermediate",
    available: true,
    icon: Thermometer,
    scenario: {
      question: "Lab results show: AST 850 U/L (normal <40), ALT 920 U/L (normal <56), ALP 95 U/L (normal 44-147), Total Bilirubin 3.8 mg/dL, Albumin 3.2 g/dL. What pattern of liver injury does this suggest?",
      options: [
        { id: "a", text: "Cholestatic (obstructive) liver disease", correct: false },
        { id: "b", text: "Hepatocellular injury with massive transaminase elevation", correct: true },
        { id: "c", text: "Chronic cirrhosis with portal hypertension", correct: false },
        { id: "d", text: "Normal liver function with lab error", correct: false },
      ],
      explanation: "Massively elevated AST and ALT (>20x normal) with a normal ALP indicates HEPATOCELLULAR injury, not cholestatic disease. Common causes include acute viral hepatitis, drug-induced liver injury (e.g., acetaminophen toxicity), or ischemic hepatitis. In cholestatic disease, ALP would be disproportionately elevated compared to transaminases. The elevated bilirubin confirms liver dysfunction. The slightly low albumin (produced by the liver) may indicate some synthetic impairment. The AST:ALT ratio <1 is more consistent with viral hepatitis; an AST:ALT ratio >2 would suggest alcoholic liver disease.",
    },
  },
  {
    id: "coagulation",
    title: "Coagulation Studies",
    description: "Analyze PT, INR, aPTT, and fibrinogen for bleeding or clotting disorders.",
    difficulty: "Advanced",
    available: true,
    icon: Droplets,
    scenario: {
      question: "A patient on heparin drip has the following labs: PT 14 sec (normal 11-13.5), INR 1.1, aPTT 95 sec (normal 25-35 sec), Platelets 45,000/\u03BCL (were 210,000 five days ago). What complication do you suspect?",
      options: [
        { id: "a", text: "Heparin overdose requiring protamine sulfate", correct: false },
        { id: "b", text: "Heparin-induced thrombocytopenia (HIT); stop heparin immediately", correct: true },
        { id: "c", text: "Disseminated intravascular coagulation (DIC)", correct: false },
        { id: "d", text: "Warfarin interaction causing bleeding", correct: false },
      ],
      explanation: "A >50% drop in platelets (210,000 to 45,000) occurring 5-10 days after heparin initiation is the hallmark of heparin-induced thrombocytopenia (HIT Type II). HIT is an immune-mediated reaction where antibodies activate platelets, paradoxically causing thrombosis, not bleeding. The nurse must: 1) STOP all heparin (including flushes), 2) Notify the provider immediately, 3) Send HIT antibody (PF4) testing, 4) Expect transition to a non-heparin anticoagulant (argatroban or bivalirudin). NEVER give platelet transfusions in HIT as they fuel the thrombotic process.",
    },
  },
  {
    id: "urinalysis",
    title: "Urinalysis Interpretation",
    description: "Evaluate urinalysis results for infection, kidney disease, and metabolic conditions.",
    difficulty: "Beginner",
    available: true,
    icon: FlaskConical,
    scenario: {
      question: "Urinalysis results show: cloudy appearance, WBC >50/hpf, positive nitrites, positive leukocyte esterase, pH 8.0, protein trace, no RBCs, no casts. What is the most likely diagnosis?",
      options: [
        { id: "a", text: "Glomerulonephritis", correct: false },
        { id: "b", text: "Urinary tract infection (UTI)", correct: true },
        { id: "c", text: "Nephrotic syndrome", correct: false },
        { id: "d", text: "Kidney stone (nephrolithiasis)", correct: false },
      ],
      explanation: "This urinalysis is classic for a bacterial UTI: elevated WBCs (pyuria), positive nitrites (bacteria convert nitrate to nitrite, especially gram-negative organisms like E. coli), positive leukocyte esterase (enzyme released by WBCs fighting infection), and alkaline pH (urea-splitting bacteria raise urine pH). Glomerulonephritis would show RBCs, RBC casts, and proteinuria. Nephrotic syndrome would show heavy proteinuria (3+/4+). Kidney stones would show RBCs/hematuria. A urine culture should be obtained before starting antibiotics.",
    },
  },
  {
    id: "thyroid",
    title: "Thyroid Function Tests",
    description: "Interpret TSH, T3, and T4 to identify thyroid disorders.",
    difficulty: "Intermediate",
    available: true,
    icon: Thermometer,
    scenario: {
      question: "Lab results show: TSH 0.05 mIU/L (normal 0.4-4.0), Free T4 5.8 ng/dL (normal 0.8-1.8), Free T3 elevated. The patient has weight loss, heat intolerance, tremors, and exophthalmos. What is the most likely diagnosis?",
      options: [
        { id: "a", text: "Hashimoto thyroiditis", correct: false },
        { id: "b", text: "Graves disease (hyperthyroidism)", correct: true },
        { id: "c", text: "Secondary hypothyroidism", correct: false },
        { id: "d", text: "Thyroid cancer", correct: false },
      ],
      explanation: "Very low TSH + elevated Free T4 + elevated Free T3 = PRIMARY hyperthyroidism. The combination with exophthalmos (bulging eyes) is pathognomonic for Graves disease, an autoimmune condition where thyroid-stimulating immunoglobulins (TSI) activate TSH receptors. The low TSH is due to negative feedback from excess thyroid hormone. Hashimoto is the most common cause of hypothyroidism (high TSH, low T4). TSH would be high (not low) in secondary hypothyroidism from pituitary failure.",
    },
  },
  {
    id: "cardiac-biomarkers",
    title: "Cardiac Biomarkers",
    description: "Evaluate troponin, BNP, and CK-MB to assess cardiac damage and heart failure.",
    difficulty: "Advanced",
    available: true,
    icon: Heart,
    scenario: {
      question: "A patient presents with chest pain. Labs show: Troponin I 2.8 ng/mL (normal <0.04), CK-MB 45 U/L (normal <25), BNP 85 pg/mL (normal <100). What do these results indicate?",
      options: [
        { id: "a", text: "Congestive heart failure", correct: false },
        { id: "b", text: "Acute myocardial infarction", correct: true },
        { id: "c", text: "Stable angina", correct: false },
        { id: "d", text: "Pulmonary embolism", correct: false },
      ],
      explanation: "Markedly elevated Troponin I (70x normal) and elevated CK-MB confirm acute myocardial infarction (AMI). Troponin is the most sensitive and specific marker for myocardial cell death. The normal BNP suggests the heart has not yet developed significant failure from the infarction. Stable angina does not cause troponin elevation because there is no myocardial necrosis.",
    },
  },
  {
    id: "d-dimer-dvt",
    title: "D-Dimer & DVT Workup",
    description: "Interpret D-dimer results in the context of Wells score and thromboembolism risk.",
    difficulty: "Intermediate",
    available: true,
    icon: Activity,
    scenario: {
      question: "A post-surgical patient with unilateral leg swelling and calf pain has a Wells score of 4 (DVT likely). D-dimer returns at 850 ng/mL (normal <500). What is the next appropriate step?",
      options: [
        { id: "a", text: "D-dimer is mildly elevated; repeat in 24 hours", correct: false },
        { id: "b", text: "Order compression duplex ultrasonography of the affected leg", correct: true },
        { id: "c", text: "Start anticoagulation without imaging since D-dimer confirms DVT", correct: false },
        { id: "d", text: "The D-dimer is non-specific post-surgery; no further workup needed", correct: false },
      ],
      explanation: "With a Wells score of 4 (DVT likely) and an elevated D-dimer, compression duplex ultrasonography is required to confirm the diagnosis. D-dimer has high sensitivity but low specificity: a negative D-dimer can help rule OUT DVT in low-probability patients, but a positive D-dimer does not confirm DVT (it is elevated in surgery, infection, cancer, pregnancy, etc.). Imaging is required before starting anticoagulation. However, if clinical suspicion is very high and imaging will be delayed, empirical anticoagulation may be started while awaiting the ultrasound.",
    },
  },
  {
    id: "hba1c",
    title: "Hemoglobin A1c & Glucose Monitoring",
    description: "Interpret HbA1c levels and correlate with glycemic control and diabetes management.",
    difficulty: "Beginner",
    available: true,
    icon: TestTube2,
    scenario: {
      question: "A patient with Type 2 diabetes has an HbA1c of 9.2% (target <7%). Fasting blood glucose today is 95 mg/dL. The patient says, 'See, my sugar is normal! I do not need to change anything.' How should you respond?",
      options: [
        { id: "a", text: "You are right; today's fasting glucose shows good control", correct: false },
        { id: "b", text: "HbA1c reflects your AVERAGE blood glucose over 2-3 months; 9.2% means average glucose around 217 mg/dL, indicating poor overall control", correct: true },
        { id: "c", text: "HbA1c is not accurate in diabetic patients", correct: false },
        { id: "d", text: "Your fasting glucose confirms adequate control; we only need to address the A1c at your next visit", correct: false },
      ],
      explanation: "HbA1c measures the percentage of hemoglobin molecules glycosylated over the lifespan of red blood cells (approximately 120 days, reflecting a 2-3 month average). An A1c of 9.2% corresponds to an estimated average glucose (eAG) of approximately 217 mg/dL. A single normal fasting glucose does not reflect overall control: the patient may have postprandial spikes, overnight highs, or inconsistent control. This is a key teaching moment about why A1c is the gold standard for monitoring diabetes management, not a single reading.",
    },
  },
  {
    id: "lactate-sepsis",
    title: "Lactate & Sepsis Markers",
    description: "Interpret lactate levels and procalcitonin in the context of sepsis screening.",
    difficulty: "Advanced",
    available: true,
    icon: AlertTriangle,
    scenario: {
      question: "A patient in the ED has: Temp 38.8\u00B0C, HR 110, RR 22, WBC 15,200, Lactate 4.8 mmol/L (normal <2.0), Procalcitonin 8.5 ng/mL (normal <0.1). Based on Sepsis-3 criteria, what is the clinical priority?",
      options: [
        { id: "a", text: "Monitor lactate and recheck in 6 hours", correct: false },
        { id: "b", text: "Initiate sepsis bundle: blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid fluid bolus within 1 hour", correct: true },
        { id: "c", text: "Administer acetaminophen for fever and reassess", correct: false },
        { id: "d", text: "Order a CT scan to identify the source of infection first", correct: false },
      ],
      explanation: "This patient meets sepsis criteria with suspected infection plus organ dysfunction (elevated lactate >2 mmol/L). A lactate of 4.8 indicates tissue hypoperfusion/anaerobic metabolism, and procalcitonin 8.5 strongly suggests bacterial infection. The Surviving Sepsis Campaign Hour-1 Bundle requires: obtaining blood cultures, administering broad-spectrum antibiotics, and beginning 30 mL/kg crystalloid resuscitation ALL within 1 hour. Every hour of antibiotic delay in sepsis increases mortality by approximately 7.6%. Source identification is important but should not delay the initial bundle.",
    },
  },
  {
    id: "magnesium-calcium",
    title: "Magnesium & Calcium Interpretation",
    description: "Evaluate magnesium and calcium levels and their relationship to cardiac and neuromuscular function.",
    difficulty: "Intermediate",
    available: true,
    icon: Gauge,
    scenario: {
      question: "Lab results: Mg2+ 1.0 mEq/L (normal 1.5-2.5), Ca2+ 7.2 mg/dL (normal 8.5-10.5), K+ 2.9 mEq/L (normal 3.5-5.0). The patient has muscle cramps, positive Chvostek sign, and ECG shows prolonged QT. What is the CRITICAL first correction?",
      options: [
        { id: "a", text: "Replace calcium first since it is the lowest value", correct: false },
        { id: "b", text: "Replace magnesium first; hypokalemia and hypocalcemia are refractory until magnesium is corrected", correct: true },
        { id: "c", text: "Replace potassium first since it poses the greatest cardiac risk", correct: false },
        { id: "d", text: "Replace all three simultaneously at equal rates", correct: false },
      ],
      explanation: "This is the classic 'triple electrolyte deficiency' seen in malnutrition, chronic alcoholism, or diuretic use. Magnesium MUST be corrected first because it is required for: 1) Normal potassium channel function (renal K+ wasting persists until Mg2+ is corrected), and 2) PTH secretion and calcium homeostasis. Attempting to replace K+ or Ca2+ without correcting Mg2+ first will be ineffective: the body will continue to waste potassium renally and PTH will remain suppressed. This is a high-yield concept for NCLEX and clinical practice.",
    },
  },
];

const difficultyConfig: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Intermediate: { bg: "bg-amber-50", text: "text-amber-700" },
  Advanced: { bg: "bg-rose-50", text: "text-rose-700" },
};

function StationExercise({ station, onClose }: { station: Station; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const scenario = station.scenario!;

  const handleSelect = (optionId: string) => {
    if (revealed) return;
    setSelected(optionId);
    setRevealed(true);
  };

  const selectedOption = scenario.options.find(o => o.id === selected);
  const isCorrect = selectedOption?.correct;

  return (
    <div className="mt-6 border-t border-gray-100 pt-6" data-testid={`exercise-${station.id}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold text-gray-900">{t("pages.simulators.clinicalScenario")}</h4>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-gray-600" onClick={onClose} data-testid={`button-close-exercise-${station.id}`}>
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back
        </Button>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{scenario.question}</p>

      <div className="space-y-2">
        {scenario.options.map((opt) => {
          let borderClass = "border-gray-100 hover:border-primary/30 cursor-pointer";
          if (revealed && selected === opt.id && opt.correct) borderClass = "border-emerald-300 bg-emerald-50/30";
          else if (revealed && selected === opt.id && !opt.correct) borderClass = "border-red-300 bg-red-50/30";
          else if (revealed && opt.correct) borderClass = "border-emerald-200 bg-emerald-50/20";
          else if (revealed) borderClass = "border-gray-100 opacity-60";

          return (
            <div
              key={opt.id}
              className={`border-2 rounded-lg p-3 transition-all duration-200 ${borderClass}`}
              onClick={() => handleSelect(opt.id)}
              data-testid={`option-${station.id}-${opt.id}`}
            >
              <div className="flex items-start gap-3">
                {revealed ? (
                  opt.correct ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : selected === opt.id ? (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0 mt-0.5" />
                  )
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${selected === opt.id ? "border-primary bg-primary" : "border-gray-300"}`} />
                )}
                <span className="text-sm text-gray-700">{opt.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-bold ${isCorrect ? "text-emerald-700" : "text-red-600"}`}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{scenario.explanation}</p>
        </div>
      )}
    </div>
  );
}

function StationCard({ station, hasPaidAccess, isLoggedIn }: { station: Station; hasPaidAccess: boolean; isLoggedIn: boolean }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const diff = difficultyConfig[station.difficulty];
  const Icon = station.icon;

  const handleClick = () => {
    if (!station.available) return;
    if (!isLoggedIn || !hasPaidAccess) return;
    setExpanded(!expanded);
  };

  return (
    <Card
      className={`border border-gray-100 bg-white transition-all duration-300 ${
        station.available && hasPaidAccess && isLoggedIn
          ? "hover:shadow-lg hover:border-primary/20 cursor-pointer group"
          : "opacity-80"
      }`}
      data-testid={`card-station-${station.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary/70" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
              {station.difficulty}
            </span>
          </div>
          {station.available ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600" data-testid={`status-available-${station.id}`}>
              Available
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500" data-testid={`status-coming-soon-${station.id}`}>
              Coming Soon
            </span>
          )}
        </div>

        <h3
          className={`text-lg font-bold mb-2 transition-colors ${
            station.available && hasPaidAccess && isLoggedIn
              ? "text-gray-900 group-hover:text-primary"
              : "text-gray-600"
          }`}
          onClick={handleClick}
        >
          {station.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{station.description}</p>

        {station.available && hasPaidAccess && isLoggedIn && !expanded && (
          <div className="flex items-center text-xs text-primary font-medium" onClick={handleClick} data-testid={`button-start-${station.id}`}>
            <span>{t("pages.simulators.startExercise")}</span>
            <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {station.available && (!isLoggedIn || !hasPaidAccess) && (
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Lock className="w-3 h-3" />
            <span>{!isLoggedIn ? "Sign up to access" : "Upgrade to access"}</span>
          </div>
        )}

        {expanded && station.scenario && (
          <StationExercise station={station} onClose={() => setExpanded(false)} />
        )}
      </CardContent>
    </Card>
  );
}

function PreviewCTA() {
  const [, setLocation] = useLocation();
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent mb-8">
      <CardContent className="p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.simulators.practiceClinicalSkillsInteractively")}</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
          Sign up for free to preview our simulator stations, or subscribe to unlock full interactive exercises with detailed clinical explanations.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="rounded-full bg-primary text-white hover:brightness-110 gap-2"
            onClick={() => setLocation("/login")}
            data-testid="button-signup-cta"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => setLocation("/pricing")}
            data-testid="button-pricing-cta"
          >
            View Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UpgradePaywall() {
  const [, setLocation] = useLocation();
  return (
    <Card className="border-2 border-amber-200 bg-amber-50/30 mb-8">
      <CardContent className="p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.simulators.upgradeToAccessSimulators")}</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
          Interactive simulator exercises are available on paid plans. Upgrade your account to practice with clinical scenarios, get instant feedback, and build confidence for your exams.
        </p>
        <Button
          className="rounded-full bg-primary text-white hover:brightness-110 gap-2"
          onClick={() => setLocation("/pricing")}
          data-testid="button-upgrade-cta"
        >
          Upgrade Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SimulatorsPage() {
  const [, params] = useRoute("/simulators/:type");
  const simulatorType = params?.type || "osce";
  const isOsce = simulatorType === "osce";
  const [, setLocation] = useLocation();
  const { user, effectiveTier } = useAuth();

  const isLoggedIn = !!user;
  const hasPaidAccess = isLoggedIn && paidTiers.includes(effectiveTier);

  const stations = isOsce ? osceStations : clinicalLabStations;

  const title = isOsce ? "OSCE Simulator" : "Clinical Lab Simulator";
  const subtitle = isOsce
    ? "Objective Structured Clinical Examination Practice"
    : "Laboratory Value Interpretation Mastery";
  const description = isOsce
    ? "Practice clinical examination stations with interactive scenarios. Build confidence in assessment skills, medication safety, and patient care competencies."
    : "Master laboratory value interpretation with interactive clinical scenarios. Analyze blood gases, CBC differentials, metabolic panels, and cardiac biomarkers.";

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={`${title} - Interactive Clinical Practice | NurseNest`}
        description={description}
        keywords={isOsce
          ? "OSCE simulator nursing, clinical examination practice, nursing assessment skills, OSCE stations, nursing simulation"
          : "clinical lab simulator nursing, lab value interpretation, ABG analysis, CBC interpretation, nursing lab practice"
        }
        canonicalPath={`/simulators/${simulatorType}`}
        ogType="website"
      />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav title={title} />
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={isOsce ? "default" : "outline"}
              className={`rounded-full text-sm ${isOsce ? "bg-primary text-white" : "border-primary/30 text-primary hover:bg-primary/5"}`}
              onClick={() => setLocation("/simulators/osce")}
              data-testid="button-tab-osce"
            >
              <Stethoscope className="w-4 h-4 mr-1.5" />
              OSCE Stations
            </Button>
            <Button
              variant={!isOsce ? "default" : "outline"}
              className={`rounded-full text-sm ${!isOsce ? "bg-primary text-white" : "border-primary/30 text-primary hover:bg-primary/5"}`}
              onClick={() => setLocation("/simulators/clinical-lab")}
              data-testid="button-tab-clinical-lab"
            >
              <FlaskConical className="w-4 h-4 mr-1.5" />
              Clinical Lab
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              {isOsce ? (
                <Stethoscope className="w-6 h-6 text-primary" />
              ) : (
                <FlaskConical className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-page-title">
                {title}
              </h1>
              <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mt-4">
            {description}
          </p>
        </div>

        {!isLoggedIn && <PreviewCTA />}
        {isLoggedIn && !hasPaidAccess && <UpgradePaywall />}

        <div className="grid gap-6 md:grid-cols-2">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              hasPaidAccess={hasPaidAccess}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            New stations are added regularly. Content is designed for educational purposes and exam preparation.
          </p>
        </div>
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
