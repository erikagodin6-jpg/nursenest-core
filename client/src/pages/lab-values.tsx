import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EducationalIntegrity } from "@/components/educational-integrity";
import { MedicalReviewBadge } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { useAuth } from "@/lib/auth";
import { UsageLimitBanner, UsageLimitPaywall } from "@/components/usage-limit-gate";
import {
  Activity,
  AlertTriangle,
  Heart,
  Droplets,
  Beaker,
  Brain,
  ChevronRight,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Zap,
  Lock,
  Sparkles,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import { seoLabValues } from "@/data/seo-lab-values";

import { useI18n } from "@/lib/i18n";
const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

type LabStatus = "critical-high" | "critical-low" | "high" | "low" | "normal";

interface LabValue {
  name: string;
  value: string;
  unit: string;
  reference: string;
  status: LabStatus;
}

interface QuizOption {
  text: string;
  correct: boolean;
  rationale: string;
}

interface ClinicalScenario {
  id: string;
  category: string;
  title: string;
  vignette: string;
  labs: LabValue[];
  mechanism: string;
  clinicalDanger: string;
  compensatoryResponse: string;
  quiz: {
    question: string;
    options: QuizOption[];
  };
}

const scenarios: ClinicalScenario[] = [
  {
    id: "cardiac-stemi",
    category: "cardiac",
    title: "Acute ST-Elevation Myocardial Infarction",
    vignette: "A 62-year-old male presents to the ED with crushing substernal chest pain radiating to his left arm, diaphoresis, and nausea for the past 2 hours. He has a history of hypertension and hyperlipidemia.",
    labs: [
      { name: "Troponin I", value: "8.5", unit: "ng/mL", reference: "0.00-0.04", status: "critical-high" },
      { name: "CK-MB", value: "85", unit: "U/L", reference: "0-25", status: "critical-high" },
      { name: "BNP", value: "620", unit: "pg/mL", reference: "0-100", status: "high" },
      { name: "D-dimer", value: "0.8", unit: "µg/mL", reference: "0.00-0.50", status: "high" },
      { name: "Myoglobin", value: "410", unit: "ng/mL", reference: "28-72", status: "critical-high" },
    ],
    mechanism: "Coronary artery occlusion causes ischemic necrosis of myocardial tissue. Troponin I and CK-MB are released from damaged cardiomyocytes into the bloodstream. Myoglobin rises first (1-3 hours) due to its small molecular size. BNP elevates as myocardial wall stress increases from impaired contractility. D-dimer rises mildly due to activation of the coagulation cascade from endothelial injury and thrombus formation.",
    clinicalDanger: "Cardiogenic shock, fatal arrhythmias (V-fib/V-tach), papillary muscle rupture, and cardiac tamponade. Door-to-balloon time must be < 90 minutes for PCI. Monitor for ST changes, hemodynamic instability, and signs of heart failure.",
    compensatoryResponse: "Sympathetic activation increases heart rate and peripheral vasoconstriction to maintain cardiac output. The renin-angiotensin-aldosterone system (RAAS) activates to retain sodium and water. Frank-Starling mechanism attempts to increase stroke volume through increased preload.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Acute ST-elevation myocardial infarction (STEMI)", correct: true, rationale: "Markedly elevated troponin I (>200x normal), elevated CK-MB and myoglobin, with the classic presentation of crushing chest pain, diaphoresis, and radiation to the left arm confirm acute STEMI with significant myocardial necrosis." },
        { text: "Pulmonary embolism", correct: false, rationale: "While D-dimer is elevated, PE typically presents with dyspnea and pleuritic chest pain. Troponin and CK-MB would not be this dramatically elevated in PE." },
        { text: "Unstable angina", correct: false, rationale: "Unstable angina does not cause myocardial necrosis, so troponin and CK-MB would remain normal or only minimally elevated." },
        { text: "Acute pericarditis", correct: false, rationale: "Pericarditis presents with positional, sharp chest pain and may cause mild troponin elevation, but not CK-MB elevation to this degree." },
      ],
    },
  },
  {
    id: "cardiac-chf",
    category: "cardiac",
    title: "Decompensated Heart Failure",
    vignette: "A 74-year-old female with a history of ischemic cardiomyopathy (EF 25%) presents with worsening dyspnea on exertion, orthopnea, bilateral lower extremity edema, and a 5 kg weight gain over the past week.",
    labs: [
      { name: "BNP", value: "1,840", unit: "pg/mL", reference: "0-100", status: "critical-high" },
      { name: "Troponin I", value: "0.06", unit: "ng/mL", reference: "0.00-0.04", status: "high" },
      { name: "Sodium", value: "129", unit: "mEq/L", reference: "136-145", status: "low" },
      { name: "Creatinine", value: "1.8", unit: "mg/dL", reference: "0.7-1.3", status: "high" },
      { name: "BUN", value: "38", unit: "mg/dL", reference: "7-20", status: "high" },
    ],
    mechanism: "Failing ventricles cannot maintain adequate cardiac output, causing volume overload. BNP is secreted by stretched ventricular cardiomyocytes in response to elevated wall stress. Mild troponin leak occurs from chronic subendocardial ischemia. Dilutional hyponatremia results from ADH-mediated water retention (the failing heart signals hypovolemia to the kidneys). Elevated BUN/creatinine reflects cardiorenal syndrome: reduced renal perfusion from poor forward flow.",
    clinicalDanger: "Acute pulmonary edema requiring BiPAP or intubation. Hyponatremia below 125 mEq/L risks seizures. Worsening renal function may limit diuretic efficacy. Monitor strict I&O, daily weights, and respiratory status. Watch for digoxin toxicity if on digoxin with declining renal function.",
    compensatoryResponse: "Neurohormonal activation: RAAS increases sodium/water retention (worsening edema). Sympathetic tone increases HR and contractility (but increases myocardial oxygen demand). ADH release causes free water retention, diluting serum sodium. Ventricular remodeling (hypertrophy and dilation) attempts to maintain stroke volume.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Acute decompensated heart failure", correct: true, rationale: "BNP > 1,800 pg/mL with classic symptoms (orthopnea, edema, weight gain), dilutional hyponatremia, and cardiorenal syndrome (elevated BUN/Cr) confirm decompensated heart failure." },
        { text: "Acute kidney injury from nephrotoxic medications", correct: false, rationale: "While creatinine is elevated, the BUN:Cr ratio > 20:1 suggests prerenal azotemia from poor cardiac output, not intrinsic renal disease." },
        { text: "Syndrome of inappropriate ADH secretion (SIADH)", correct: false, rationale: "SIADH causes euvolemic hyponatremia with concentrated urine. This patient is hypervolemic with edema and elevated BNP." },
        { text: "Nephrotic syndrome", correct: false, rationale: "Nephrotic syndrome causes edema and hypoalbuminemia but would not cause BNP elevation or the cardiac symptoms seen here." },
      ],
    },
  },
  {
    id: "renal-aki",
    category: "renal",
    title: "Acute Kidney Injury: Prerenal Etiology",
    vignette: "A 58-year-old male presents with 3 days of vomiting and diarrhea. He appears dehydrated with dry mucous membranes, tachycardia (HR 112), and hypotension (BP 88/54). Urine output has been minimal for 12 hours.",
    labs: [
      { name: "BUN", value: "62", unit: "mg/dL", reference: "7-20", status: "critical-high" },
      { name: "Creatinine", value: "3.4", unit: "mg/dL", reference: "0.7-1.3", status: "critical-high" },
      { name: "BUN:Cr Ratio", value: "18:1", unit: "", reference: "<20:1 prerenal", status: "high" },
      { name: "Potassium", value: "5.8", unit: "mEq/L", reference: "3.5-5.0", status: "critical-high" },
      { name: "GFR (estimated)", value: "18", unit: "mL/min", reference: ">90", status: "critical-low" },
      { name: "Sodium", value: "131", unit: "mEq/L", reference: "136-145", status: "low" },
    ],
    mechanism: "Severe dehydration from vomiting/diarrhea decreases effective circulating volume, reducing renal perfusion pressure. The kidneys cannot maintain glomerular filtration without adequate blood flow. BUN rises disproportionately to creatinine (BUN:Cr > 20:1 is classic for prerenal AKI) because the tubules reabsorb more urea when flow is slow. Potassium rises because the kidneys cannot excrete it adequately. Sodium is lost through GI losses and dilutional effects.",
    clinicalDanger: "Hyperkalemia > 5.5 mEq/L risks fatal cardiac arrhythmias (peaked T-waves → sine wave → V-fib). Oliguria/anuria indicates severe renal compromise. If not corrected, prerenal AKI can progress to intrinsic (acute tubular necrosis). Obtain a 12-lead ECG immediately. Prepare for calcium gluconate, insulin/dextrose, and aggressive IV fluid resuscitation.",
    compensatoryResponse: "RAAS activation maximizes sodium and water reabsorption. ADH secretion concentrates urine to preserve volume. Sympathetic vasoconstriction redirects blood flow to vital organs. Afferent arteriole dilation and efferent constriction (angiotensin II) attempt to maintain GFR. Caution: NSAIDs and ACE inhibitors can abolish these compensatory mechanisms.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Prerenal acute kidney injury from dehydration", correct: true, rationale: "The clinical picture (vomiting, diarrhea, hypotension, oliguria) with BUN:Cr ratio > 15:1, markedly elevated creatinine, hyperkalemia, and severely reduced GFR indicates prerenal AKI from hypovolemia." },
        { text: "Chronic kidney disease stage 5", correct: false, rationale: "CKD develops over months to years with bilateral kidney atrophy on imaging. This is an acute presentation in a previously healthy patient." },
        { text: "Post-renal obstruction", correct: false, rationale: "Obstruction (e.g., BPH, stones) would cause hydronephrosis on ultrasound. The history of GI losses points to prerenal etiology." },
        { text: "Rhabdomyolysis-induced AKI", correct: false, rationale: "Rhabdomyolysis would present with elevated CK, myoglobinuria, and muscle pain/swelling, not GI losses." },
      ],
    },
  },
  {
    id: "renal-ckd",
    category: "renal",
    title: "Chronic Kidney Disease: Stage 4",
    vignette: "A 67-year-old female with a 20-year history of type 2 diabetes and hypertension presents for routine follow-up. She reports fatigue, mild nausea, and restless legs at night. Her feet are mildly edematous bilaterally.",
    labs: [
      { name: "GFR", value: "22", unit: "mL/min", reference: ">90", status: "critical-low" },
      { name: "Creatinine", value: "3.1", unit: "mg/dL", reference: "0.7-1.3", status: "critical-high" },
      { name: "BUN", value: "48", unit: "mg/dL", reference: "7-20", status: "high" },
      { name: "Phosphorus", value: "6.2", unit: "mg/dL", reference: "2.5-4.5", status: "high" },
      { name: "Calcium", value: "7.8", unit: "mg/dL", reference: "8.5-10.5", status: "low" },
      { name: "Hemoglobin", value: "9.1", unit: "g/dL", reference: "12.0-16.0", status: "low" },
    ],
    mechanism: "Diabetic nephropathy has progressively destroyed nephrons over years. Reduced GFR impairs phosphorus excretion, causing hyperphosphatemia. High phosphorus binds calcium, lowering serum calcium (inverse relationship). The kidneys can no longer convert 25-OH vitamin D to active 1,25-dihydroxy vitamin D, further impairing calcium absorption. Decreased erythropoietin production by damaged peritubular cells causes normocytic anemia. Uremia (elevated BUN) causes the nausea and restless legs.",
    clinicalDanger: "Renal osteodystrophy from calcium-phosphorus imbalance causes pathologic fractures. Severe anemia worsens cardiac workload and can precipitate heart failure. Monitor for uremic symptoms (encephalopathy, pericarditis, bleeding). Begin dialysis planning when GFR approaches 15 mL/min.",
    compensatoryResponse: "Remaining nephrons undergo hyperfiltration to compensate (but this accelerates their damage). PTH secretion increases (secondary hyperparathyroidism) to mobilize calcium from bone and increase phosphorus excretion. The body shifts to metabolic acidosis as the kidneys lose ability to regenerate bicarbonate and excrete hydrogen ions.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Chronic kidney disease stage 4 with mineral bone disorder", correct: true, rationale: "GFR 15-29 mL/min = Stage 4 CKD. The classic triad of hyperphosphatemia, hypocalcemia, and anemia of chronic disease in a long-standing diabetic patient confirms CKD with mineral bone disorder." },
        { text: "Multiple myeloma", correct: false, rationale: "Myeloma causes hypercalcemia (not hypocalcemia), elevated protein, and lytic bone lesions. The long diabetic history points to diabetic nephropathy." },
        { text: "Primary hyperparathyroidism", correct: false, rationale: "Primary hyperparathyroidism causes hypercalcemia and hypophosphatemia: the opposite of what is seen here." },
        { text: "Iron deficiency anemia", correct: false, rationale: "Iron deficiency anemia would show microcytic indices (low MCV) and low ferritin. CKD anemia is normocytic and due to erythropoietin deficiency." },
      ],
    },
  },
  {
    id: "hepatic-cirrhosis",
    category: "hepatic",
    title: "Decompensated Alcoholic Cirrhosis",
    vignette: "A 55-year-old male with a 30-year history of heavy alcohol use presents with increasing abdominal distension, jaundice, and confusion. He has spider angiomata on his chest and palmar erythema. His abdomen has a positive fluid wave.",
    labs: [
      { name: "AST", value: "185", unit: "U/L", reference: "10-40", status: "high" },
      { name: "ALT", value: "78", unit: "U/L", reference: "7-56", status: "high" },
      { name: "Total Bilirubin", value: "8.4", unit: "mg/dL", reference: "0.1-1.2", status: "critical-high" },
      { name: "Albumin", value: "2.1", unit: "g/dL", reference: "3.5-5.0", status: "critical-low" },
      { name: "Ammonia", value: "142", unit: "µg/dL", reference: "15-45", status: "critical-high" },
      { name: "INR", value: "2.8", unit: "", reference: "0.8-1.1", status: "critical-high" },
    ],
    mechanism: "Chronic alcohol exposure causes hepatocyte necrosis and fibrosis, replacing functional liver tissue with scar tissue. AST > ALT (typically 2:1 ratio) is characteristic of alcoholic liver disease because alcohol depletes hepatic pyridoxal-5'-phosphate (needed for ALT production) and damages mitochondria (releasing mitochondrial AST). Bilirubin rises because the damaged liver cannot conjugate and excrete it. Albumin drops because the liver cannot synthesize it (half-life ~21 days). Ammonia rises because the liver cannot convert it to urea via the urea cycle, causing hepatic encephalopathy. INR is elevated because the liver cannot produce clotting factors (II, VII, IX, X).",
    clinicalDanger: "Hepatic encephalopathy can progress to coma. Coagulopathy (INR 2.8) creates massive bleeding risk: especially esophageal varices which can cause fatal hemorrhage. Spontaneous bacterial peritonitis (SBP) in ascitic fluid. Hepatorenal syndrome if renal perfusion declines. Administer lactulose and rifaximin for encephalopathy.",
    compensatoryResponse: "Portal hypertension forces blood through portosystemic shunts (esophageal varices, caput medusae, hemorrhoids). Splanchnic vasodilation triggers RAAS activation, causing sodium/water retention and ascites. Hepatic stellate cells activate to produce collagen (fibrosis) as a wound-healing response, but this further impairs liver architecture.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Decompensated alcoholic cirrhosis with hepatic encephalopathy", correct: true, rationale: "AST:ALT > 2:1 pattern, markedly elevated bilirubin, critically low albumin, elevated ammonia causing confusion, and coagulopathy (INR 2.8) in a chronic alcoholic confirm decompensated cirrhosis." },
        { text: "Acute viral hepatitis", correct: false, rationale: "Acute viral hepatitis typically shows ALT > AST (often > 1000 U/L), and albumin/INR are usually preserved in acute disease. The AST:ALT > 2:1 ratio is specific to alcoholic liver disease." },
        { text: "Hepatocellular carcinoma", correct: false, rationale: "HCC would show elevated alpha-fetoprotein (AFP) and a liver mass on imaging. While HCC can develop in cirrhosis, this presentation is classic decompensated cirrhosis." },
        { text: "Drug-induced liver injury (acetaminophen)", correct: false, rationale: "Acetaminophen toxicity causes massively elevated AST/ALT (often > 3,000 U/L) with acute onset, not this chronic pattern with ascites and spider angiomata." },
      ],
    },
  },
  {
    id: "hepatic-acute",
    category: "hepatic",
    title: "Acute Hepatocellular Injury: Acetaminophen Toxicity",
    vignette: "A 28-year-old female is brought to the ED 18 hours after intentionally ingesting approximately 15 g of acetaminophen. She initially felt fine but now has severe right upper quadrant pain, nausea, and vomiting.",
    labs: [
      { name: "AST", value: "6,840", unit: "U/L", reference: "10-40", status: "critical-high" },
      { name: "ALT", value: "7,210", unit: "U/L", reference: "7-56", status: "critical-high" },
      { name: "INR", value: "4.6", unit: "", reference: "0.8-1.1", status: "critical-high" },
      { name: "Total Bilirubin", value: "3.8", unit: "mg/dL", reference: "0.1-1.2", status: "high" },
      { name: "Acetaminophen Level", value: "38", unit: "µg/mL", reference: "10-30 therapeutic", status: "high" },
      { name: "pH (venous)", value: "7.28", unit: "", reference: "7.35-7.45", status: "critical-low" },
    ],
    mechanism: "At therapeutic doses, acetaminophen is conjugated by glucuronidation and sulfation. In overdose, these pathways are saturated, and excess APAP is metabolized by CYP2E1 to the toxic metabolite NAPQI. NAPQI depletes hepatic glutathione, then directly damages hepatocytes through covalent binding to cellular proteins. Massive hepatocyte death releases AST and ALT in the thousands. INR rises rapidly because factor VII (shortest half-life, ~6 hours) depletes first. Metabolic acidosis develops from lactic acid accumulation as the liver fails to clear lactate.",
    clinicalDanger: "Fulminant hepatic failure with coagulopathy and risk of cerebral edema. INR > 3.0 at 48 hours is a poor prognostic sign (King's College Criteria for liver transplant evaluation). Administer N-acetylcysteine (NAC) immediately: it replenishes glutathione stores and is most effective within 8 hours but still beneficial up to 72 hours. Monitor for hypoglycemia, as the failing liver cannot perform gluconeogenesis.",
    compensatoryResponse: "Hepatocyte regeneration begins within 24-48 hours if the patient survives. Remaining hepatocytes upregulate glucuronidation capacity. The bone marrow increases production of clotting factors if the liver begins recovering. Kupffer cells clear necrotic debris to allow regeneration.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Acute acetaminophen hepatotoxicity", correct: true, rationale: "AST/ALT > 5,000 U/L with acute onset after known acetaminophen ingestion, elevated INR, and metabolic acidosis confirm severe acetaminophen-induced hepatocellular necrosis. The pattern of ALT > AST with massively elevated transaminases is characteristic of acute hepatocellular injury." },
        { text: "Ischemic hepatitis (shock liver)", correct: false, rationale: "Ischemic hepatitis can produce similarly elevated transaminases but requires a preceding hypotensive episode and has LDH elevation as a distinguishing feature. The known ingestion history points to acetaminophen." },
        { text: "Acute cholangitis", correct: false, rationale: "Cholangitis presents with Charcot's triad (fever, jaundice, RUQ pain) and predominantly elevates alkaline phosphatase and GGT, not transaminases in the thousands." },
        { text: "Autoimmune hepatitis flare", correct: false, rationale: "Autoimmune hepatitis can elevate transaminases but rarely to this degree, and would show positive ANA/anti-smooth muscle antibodies. The known ingestion history makes this diagnosis unlikely." },
      ],
    },
  },
  {
    id: "heme-dic",
    category: "hematologic",
    title: "Disseminated Intravascular Coagulation (DIC)",
    vignette: "A 45-year-old female with a history of acute myeloid leukemia develops sudden onset of diffuse petechiae, oozing from IV sites, hematuria, and altered mental status. She is febrile at 39.2°C and tachycardic.",
    labs: [
      { name: "Platelets", value: "28,000", unit: "/µL", reference: "150,000-400,000", status: "critical-low" },
      { name: "Fibrinogen", value: "68", unit: "mg/dL", reference: "200-400", status: "critical-low" },
      { name: "D-dimer", value: "12.4", unit: "µg/mL", reference: "0.00-0.50", status: "critical-high" },
      { name: "PT/INR", value: "3.2", unit: "", reference: "0.8-1.1", status: "critical-high" },
      { name: "aPTT", value: "68", unit: "seconds", reference: "25-35", status: "critical-high" },
      { name: "Hemoglobin", value: "7.2", unit: "g/dL", reference: "12.0-16.0", status: "critical-low" },
    ],
    mechanism: "Systemic activation of the coagulation cascade (triggered by leukemic cell procoagulants, sepsis, or tissue factor release) causes simultaneous widespread clot formation in small vessels AND consumption of clotting factors and platelets: a paradox of clotting and bleeding at the same time. Fibrinogen is consumed to form fibrin clots, then plasmin breaks down these clots, producing massively elevated D-dimer (fibrin degradation products). All clotting factors are consumed, prolonging PT and aPTT. Microangiopathic hemolytic anemia (MAHA) occurs as red blood cells shear through fibrin strands in small vessels.",
    clinicalDanger: "Simultaneously life-threatening bleeding (intracranial hemorrhage, massive GI bleed) and organ damage from microvascular thrombosis (renal failure, ARDS, stroke). Treat the underlying cause (antibiotics for sepsis, chemotherapy for leukemia). Replace components: cryoprecipitate for fibrinogen < 100, platelets if actively bleeding, FFP for clotting factors. DO NOT give heparin without hematology consultation.",
    compensatoryResponse: "The bone marrow increases platelet production (megakaryocyte hyperplasia), but production cannot keep pace with consumption. The liver attempts to synthesize more fibrinogen and clotting factors. Tissue plasminogen activator (tPA) is released to dissolve the microthrombi, but this further contributes to bleeding.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Disseminated intravascular coagulation (DIC)", correct: true, rationale: "The combination of thrombocytopenia, critically low fibrinogen, massively elevated D-dimer, prolonged PT/aPTT, and anemia with simultaneous bleeding and clotting in a patient with leukemia is diagnostic of DIC." },
        { text: "Immune thrombocytopenic purpura (ITP)", correct: false, rationale: "ITP causes isolated thrombocytopenia with normal PT, aPTT, and fibrinogen. The abnormality in ALL coagulation parameters distinguishes DIC." },
        { text: "Thrombotic thrombocytopenic purpura (TTP)", correct: false, rationale: "TTP causes thrombocytopenia and MAHA but PT/aPTT and fibrinogen are typically normal. TTP is caused by ADAMTS13 deficiency, not coagulation factor consumption." },
        { text: "Hemophilia A", correct: false, rationale: "Hemophilia A causes isolated aPTT prolongation with normal PT, platelets, and fibrinogen. It is an inherited X-linked disorder, not an acute consumptive process." },
      ],
    },
  },
  {
    id: "heme-iron-anemia",
    category: "hematologic",
    title: "Iron Deficiency Anemia: Chronic GI Blood Loss",
    vignette: "A 42-year-old female presents with progressive fatigue, pallor, exertional dyspnea, and pica (craving ice). She reports heavy menstrual periods for the past year. Physical exam reveals pale conjunctivae and koilonychia (spoon-shaped nails).",
    labs: [
      { name: "Hemoglobin", value: "7.8", unit: "g/dL", reference: "12.0-16.0", status: "critical-low" },
      { name: "MCV", value: "68", unit: "fL", reference: "80-100", status: "low" },
      { name: "Ferritin", value: "6", unit: "ng/mL", reference: "12-150", status: "critical-low" },
      { name: "TIBC", value: "480", unit: "µg/dL", reference: "250-370", status: "high" },
      { name: "Serum Iron", value: "22", unit: "µg/dL", reference: "60-170", status: "critical-low" },
      { name: "RDW", value: "18.2", unit: "%", reference: "11.5-14.5", status: "high" },
    ],
    mechanism: "Chronic blood loss from heavy menses depletes total body iron stores. Without adequate iron, the bone marrow cannot produce hemoglobin effectively, resulting in smaller (microcytic, low MCV) and paler (hypochromic) red blood cells. Ferritin, which reflects total body iron stores, drops critically. The liver compensates by producing more transferrin (measured as elevated TIBC) to capture and transport whatever iron is available: but serum iron remains low because stores are depleted. RDW increases because new smaller RBCs mix with older normal-sized ones (anisocytosis).",
    clinicalDanger: "Hemoglobin < 7 g/dL may require transfusion, especially if symptomatic (tachycardia, syncope, angina). Severe anemia increases cardiac workload and can precipitate heart failure in vulnerable patients. Investigate the source of blood loss: consider endoscopy to rule out GI malignancy in patients without obvious menstrual cause.",
    compensatoryResponse: "Increased cardiac output (tachycardia) to deliver more oxygen per unit time. Increased 2,3-DPG production in RBCs shifts the oxygen-hemoglobin dissociation curve rightward, facilitating oxygen delivery to tissues. Erythropoietin production increases to stimulate bone marrow red cell production. Increased intestinal iron absorption (upregulated DMT1 and ferroportin).",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Iron deficiency anemia", correct: true, rationale: "Microcytic anemia (low MCV), critically low ferritin and serum iron, elevated TIBC, and high RDW in a patient with heavy menstrual bleeding and classic signs (pica, koilonychia) confirm iron deficiency anemia." },
        { text: "Thalassemia trait", correct: false, rationale: "Thalassemia shows low MCV but ferritin and iron studies are normal or elevated. RDW is usually normal in thalassemia (uniform microcytosis)." },
        { text: "Anemia of chronic disease", correct: false, rationale: "ACD shows low serum iron but ferritin is normal or elevated (iron is sequestered, not depleted) and TIBC is low or normal: the opposite pattern." },
        { text: "Vitamin B12 deficiency", correct: false, rationale: "B12 deficiency causes macrocytic anemia (high MCV), not microcytic. It also presents with neurological symptoms (peripheral neuropathy, ataxia)." },
      ],
    },
  },
  {
    id: "endo-dka",
    category: "endocrine",
    title: "Diabetic Ketoacidosis (DKA)",
    vignette: "A 22-year-old male with type 1 diabetes presents with abdominal pain, Kussmaul respirations, fruity breath odor, polyuria, and altered mental status. He ran out of insulin 2 days ago. He is severely dehydrated with dry mucous membranes.",
    labs: [
      { name: "Glucose", value: "486", unit: "mg/dL", reference: "70-100", status: "critical-high" },
      { name: "pH (arterial)", value: "7.18", unit: "", reference: "7.35-7.45", status: "critical-low" },
      { name: "Bicarbonate (HCO₃⁻)", value: "8", unit: "mEq/L", reference: "22-26", status: "critical-low" },
      { name: "Anion Gap", value: "28", unit: "mEq/L", reference: "8-12", status: "critical-high" },
      { name: "Potassium", value: "5.6", unit: "mEq/L", reference: "3.5-5.0", status: "high" },
      { name: "Beta-hydroxybutyrate", value: "6.8", unit: "mmol/L", reference: "0.0-0.6", status: "critical-high" },
    ],
    mechanism: "Without insulin, glucose cannot enter cells despite being abundantly present in blood. The body perceives starvation and switches to fatty acid oxidation for energy. The liver converts fatty acids to ketone bodies (beta-hydroxybutyrate, acetoacetate, acetone). Ketones are strong acids that overwhelm the bicarbonate buffer system, causing high anion gap metabolic acidosis. Potassium shifts extracellularly due to acidosis (H⁺/K⁺ exchange) and lack of insulin-mediated cellular uptake: total body potassium is actually depleted despite the high serum level. Osmotic diuresis from glucosuria causes profound dehydration.",
    clinicalDanger: "Life-threatening cerebral edema if glucose is corrected too rapidly (especially in children/young adults). Hypokalemia emerges rapidly once insulin is given (insulin drives K⁺ into cells). DO NOT start insulin until potassium is > 3.3 mEq/L. Cardiac arrhythmias from electrolyte shifts. Monitor potassium every 1-2 hours during treatment. Replace fluids first (NS bolus), then insulin drip.",
    compensatoryResponse: "Kussmaul respirations (deep, rapid breathing) are the respiratory compensation for metabolic acidosis: blowing off CO₂ to raise pH. Fruity breath odor is from acetone being exhaled. The kidneys attempt to excrete ketoacids and regenerate bicarbonate, but dehydration limits this capacity. Aldosterone secretion increases to retain sodium and water.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Diabetic ketoacidosis (DKA)", correct: true, rationale: "Severe hyperglycemia, pH < 7.3, low bicarbonate, high anion gap, and elevated beta-hydroxybutyrate in a type 1 diabetic who missed insulin doses confirm DKA. The triad is: hyperglycemia + ketosis + acidosis." },
        { text: "Hyperosmolar hyperglycemic state (HHS)", correct: false, rationale: "HHS occurs in type 2 diabetes with glucose often > 600 mg/dL, minimal ketosis, and serum osmolality > 320 mOsm/kg. The significant acidosis and ketosis here indicate DKA, not HHS." },
        { text: "Alcoholic ketoacidosis", correct: false, rationale: "Alcoholic ketoacidosis shows similar ketosis and acidosis but glucose is typically low or normal, and there is a history of binge drinking with poor oral intake." },
        { text: "Lactic acidosis from sepsis", correct: false, rationale: "Septic lactic acidosis would show elevated lactate rather than ketones, and glucose may be low, normal, or mildly elevated: not 486 mg/dL." },
      ],
    },
  },
  {
    id: "endo-thyroid-storm",
    category: "endocrine",
    title: "Thyroid Storm (Thyrotoxic Crisis)",
    vignette: "A 34-year-old female with known Graves' disease who stopped her methimazole 3 weeks ago presents with high fever (40.1°C), heart rate 168 bpm, agitation, tremor, and profuse diaphoresis. She had a dental procedure yesterday.",
    labs: [
      { name: "TSH", value: "<0.01", unit: "mIU/L", reference: "0.40-4.00", status: "critical-low" },
      { name: "Free T4", value: "7.8", unit: "ng/dL", reference: "0.8-1.8", status: "critical-high" },
      { name: "Free T3", value: "18.2", unit: "pg/mL", reference: "2.3-4.2", status: "critical-high" },
      { name: "Glucose", value: "218", unit: "mg/dL", reference: "70-100", status: "high" },
      { name: "Calcium", value: "11.4", unit: "mg/dL", reference: "8.5-10.5", status: "high" },
    ],
    mechanism: "Graves' disease produces TSH-receptor stimulating antibodies that drive excessive thyroid hormone production. Stopping methimazole removed the brake on hormone synthesis. A physiologic stressor (dental procedure/infection) then tipped the patient into thyroid storm: a life-threatening exaggeration of hyperthyroidism. TSH is suppressed to near zero by negative feedback from massively elevated T3/T4. Free T3 is the metabolically active hormone causing the hypermetabolic symptoms. Thyroid hormones increase glucose through enhanced glycogenolysis and gluconeogenesis. Hypercalcemia occurs because thyroid hormones stimulate osteoclast-mediated bone resorption.",
    clinicalDanger: "Thyroid storm has 10-30% mortality even with treatment. High-output cardiac failure and fatal arrhythmias (atrial fibrillation with RVR). Hyperthermia can cause multi-organ failure. Treatment order matters: propylthiouracil (PTU) first (blocks new synthesis AND peripheral T4→T3 conversion), then iodine 1 hour later (blocks hormone release: Wolff-Chaikoff effect), beta-blockers (propranolol: also blocks T4→T3 conversion), and hydrocortisone (prevents adrenal crisis and blocks T4→T3 conversion).",
    compensatoryResponse: "The pituitary suppresses TSH to near zero (negative feedback) but cannot counteract the antibody-driven stimulation of the thyroid. Peripheral tissues downregulate thyroid hormone receptors (receptor desensitization). The adrenal glands increase cortisol output to meet metabolic demands, but may become depleted (relative adrenal insufficiency).",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Thyroid storm (thyrotoxic crisis)", correct: true, rationale: "Undetectable TSH with massively elevated free T4 and T3, combined with fever, tachycardia > 140, agitation, and a known Graves' disease patient who stopped medications: this is thyroid storm, a medical emergency." },
        { text: "Pheochromocytoma crisis", correct: false, rationale: "Pheochromocytoma causes episodic hypertension, tachycardia, and diaphoresis but thyroid function would be normal. It is diagnosed by elevated plasma metanephrines." },
        { text: "Serotonin syndrome", correct: false, rationale: "Serotonin syndrome presents with similar hypermetabolic features but requires exposure to serotonergic medications and shows clonus, hyperreflexia, and normal thyroid function." },
        { text: "Malignant hyperthermia", correct: false, rationale: "Malignant hyperthermia occurs during anesthesia with volatile agents or succinylcholine and shows massively elevated CK. It does not affect thyroid function." },
      ],
    },
  },
  {
    id: "metabolic-resp-acidosis",
    category: "metabolic",
    title: "Acute Respiratory Failure with Respiratory Acidosis",
    vignette: "A 71-year-old male with severe COPD (FEV1 28% predicted) presents with worsening dyspnea, productive cough with purulent sputum, and somnolence over the past 24 hours. He is using accessory muscles and has bilateral wheezing with diminished breath sounds.",
    labs: [
      { name: "pH", value: "7.24", unit: "", reference: "7.35-7.45", status: "critical-low" },
      { name: "PaCO₂", value: "78", unit: "mmHg", reference: "35-45", status: "critical-high" },
      { name: "PaO₂", value: "48", unit: "mmHg", reference: "80-100", status: "critical-low" },
      { name: "HCO₃⁻", value: "34", unit: "mEq/L", reference: "22-26", status: "high" },
      { name: "SpO₂", value: "82", unit: "%", reference: "95-100", status: "critical-low" },
      { name: "WBC", value: "16,800", unit: "/µL", reference: "4,500-11,000", status: "high" },
    ],
    mechanism: "Acute COPD exacerbation (likely triggered by bacterial infection given purulent sputum and leukocytosis) worsens airflow obstruction. Air trapping prevents adequate CO₂ exhalation, causing acute-on-chronic respiratory acidosis. PaCO₂ rises acutely beyond his chronic baseline. The already elevated HCO₃⁻ (34 mEq/L) indicates chronic metabolic compensation (renal retention of bicarbonate over days-weeks), but pH remains low because the acute CO₂ rise has overwhelmed this compensation. PaO₂ is dangerously low due to V/Q mismatch and alveolar hypoventilation.",
    clinicalDanger: "CO₂ narcosis: excessive supplemental oxygen can suppress the hypoxic drive to breathe in COPD patients, worsening CO₂ retention and causing respiratory arrest. Target SpO₂ 88-92% only. Somnolence indicates impending respiratory failure: prepare for BiPAP or intubation. Administer bronchodilators, systemic corticosteroids, and antibiotics. Monitor ABGs every 30-60 minutes.",
    compensatoryResponse: "Chronic renal compensation has retained bicarbonate (expected: HCO₃⁻ increases ~3.5 mEq/L per 10 mmHg chronic PaCO₂ rise). Polycythemia develops chronically (increased erythropoietin from chronic hypoxemia). Accessory muscle use increases work of breathing to generate more tidal volume. Pulmonary vasoconstriction in poorly ventilated areas redirects blood to better-ventilated lung zones.",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Acute-on-chronic respiratory acidosis from COPD exacerbation", correct: true, rationale: "pH 7.24 with PaCO₂ 78 confirms respiratory acidosis. The elevated HCO₃⁻ (34) indicates chronic renal compensation, but the low pH shows acute decompensation. Leukocytosis suggests an infectious trigger." },
        { text: "Metabolic acidosis with respiratory compensation", correct: false, rationale: "In metabolic acidosis, the primary disturbance is low HCO₃⁻ and the CO₂ would decrease (not increase) as respiratory compensation." },
        { text: "Pulmonary embolism", correct: false, rationale: "PE typically causes respiratory alkalosis (hyperventilation → low CO₂), not the hypercapnia seen here. COPD patients are at risk for PE but the presentation is classic for exacerbation." },
        { text: "Acute respiratory distress syndrome (ARDS)", correct: false, rationale: "ARDS typically presents with bilateral infiltrates and refractory hypoxemia in the setting of sepsis, trauma, or aspiration: not chronic airway obstruction with CO₂ retention." },
      ],
    },
  },
  {
    id: "metabolic-met-alkalosis",
    category: "metabolic",
    title: "Metabolic Alkalosis: Persistent Vomiting",
    vignette: "A 35-year-old female with hyperemesis gravidarum at 10 weeks gestation presents after 5 days of intractable vomiting. She is lethargic, with poor skin turgor, dry mucous membranes, and muscle cramping. Heart rate is 108 bpm.",
    labs: [
      { name: "pH", value: "7.56", unit: "", reference: "7.35-7.45", status: "critical-high" },
      { name: "PaCO₂", value: "48", unit: "mmHg", reference: "35-45", status: "high" },
      { name: "HCO₃⁻", value: "38", unit: "mEq/L", reference: "22-26", status: "critical-high" },
      { name: "Potassium", value: "2.6", unit: "mEq/L", reference: "3.5-5.0", status: "critical-low" },
      { name: "Chloride", value: "78", unit: "mEq/L", reference: "98-106", status: "critical-low" },
      { name: "Sodium", value: "132", unit: "mEq/L", reference: "136-145", status: "low" },
    ],
    mechanism: "Vomiting expels gastric acid (HCl) from the body. Loss of H⁺ ions leaves behind excess bicarbonate, raising pH. Loss of chloride (hypochloremia) is key: the kidneys need chloride to excrete bicarbonate; without chloride, the kidneys cannot correct the alkalosis (chloride-responsive alkalosis). Hypokalemia occurs because: (1) direct GI losses of potassium, (2) renal K⁺ wasting as the kidneys try to reabsorb Na⁺ by exchanging it for K⁺ (since H⁺ is depleted), and (3) intracellular shift of K⁺ in alkalosis. Volume depletion stimulates aldosterone, which worsens K⁺ loss.",
    clinicalDanger: "Hypokalemia < 2.5 mEq/L can cause life-threatening arrhythmias (U-waves, torsades de pointes), paralytic ileus, and respiratory muscle weakness. Severe alkalosis (pH > 7.55) shifts the oxyhemoglobin dissociation curve leftward, impairing oxygen delivery to tissues. Tetany and seizures can occur from decreased ionized calcium (alkalosis increases calcium binding to albumin). Replace chloride and potassium aggressively with IV NS + KCl.",
    compensatoryResponse: "Respiratory compensation: hypoventilation (increased PaCO₂ to 48 mmHg) retains CO₂ to lower pH. However, respiratory compensation for metabolic alkalosis is limited: the body will not hypoventilate to the point of hypoxemia. The kidneys attempt to excrete bicarbonate but cannot without adequate chloride delivery (paradoxical aciduria: the kidneys excrete H⁺ instead of HCO₃⁻ to conserve Na⁺).",
    quiz: {
      question: "What is the most likely diagnosis?",
      options: [
        { text: "Hypochloremic, hypokalemic metabolic alkalosis from vomiting", correct: true, rationale: "pH 7.56 with HCO₃⁻ 38 confirms metabolic alkalosis. Hypochloremia (Cl 78), hypokalemia (K 2.6), and the history of persistent vomiting identify this as chloride-responsive metabolic alkalosis: the most common type." },
        { text: "Primary hyperaldosteronism (Conn syndrome)", correct: false, rationale: "Hyperaldosteronism can cause metabolic alkalosis and hypokalemia, but chloride is typically normal and blood pressure is elevated (hypertension, not hypotension from dehydration)." },
        { text: "Respiratory alkalosis with metabolic compensation", correct: false, rationale: "In respiratory alkalosis, the primary disturbance is low PaCO₂ (hyperventilation). Here, PaCO₂ is elevated (compensatory hypoventilation), confirming the primary disorder is metabolic." },
        { text: "Renal tubular acidosis", correct: false, rationale: "RTA causes metabolic acidosis (not alkalosis) with a normal anion gap. The pH would be low, not high." },
      ],
    },
  },
];

const categoryConfig: Record<string, { label: string; icon: typeof Heart; color: string; bg: string }> = {
  cardiac: { label: "Cardiac", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
  renal: { label: "Renal", icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" },
  hepatic: { label: "Hepatic", icon: Beaker, color: "text-amber-600", bg: "bg-amber-50" },
  hematologic: { label: "Hematologic", icon: Activity, color: "text-red-600", bg: "bg-red-50" },
  endocrine: { label: "Endocrine", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
  metabolic: { label: "Metabolic", icon: Brain, color: "text-teal-600", bg: "bg-teal-50" },
};

function getStatusColor(status: LabStatus): string {

  switch (status) {
    case "critical-high":
    case "critical-low":
      return "bg-red-50 border-red-300 text-red-800";
    case "high":
    case "low":
      return "bg-amber-50 border-amber-300 text-amber-800";
    case "normal":
      return "bg-green-50 border-green-300 text-green-800";
  }
}

function getStatusBadge(status: LabStatus): string {
  switch (status) {
    case "critical-high":
      return "bg-red-600 text-white";
    case "critical-low":
      return "bg-red-600 text-white";
    case "high":
      return "bg-amber-500 text-white";
    case "low":
      return "bg-amber-500 text-white";
    case "normal":
      return "bg-green-500 text-white";
  }
}

function StatusArrow({ status }: { status: LabStatus }) {
  if (status === "critical-high") return <ArrowUp className="w-4 h-4 text-red-600" />;
  if (status === "critical-low") return <ArrowDown className="w-4 h-4 text-red-600" />;
  if (status === "high") return <ArrowUp className="w-4 h-4 text-amber-600" />;
  if (status === "low") return <ArrowDown className="w-4 h-4 text-amber-600" />;
  return <CheckCircle2 className="w-4 h-4 text-green-600" />;
}

function statusLabel(status: LabStatus): string {
  switch (status) {
    case "critical-high": return "CRITICAL HIGH";
    case "critical-low": return "CRITICAL LOW";
    case "high": return "HIGH";
    case "low": return "LOW";
    case "normal": return "NORMAL";
  }
}

export default function LabValuesPage() {
  const { user, effectiveTier } = useAuth();
  const hasPaidAccess = paidTiers.includes(effectiveTier);
  const [activeCategory, setActiveCategory] = useState("cardiac");
  const [scenarioIndex, setScenarioIndex] = useState<Record<string, number>>({});
  const [showInterpretation, setShowInterpretation] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [region, setRegion] = useState<"US" | "CA">(() => {
    return (localStorage.getItem("nursenest-region") as "US" | "CA") || "US";
  });
  useEffect(() => {
    const handler = () => setRegion((localStorage.getItem("nursenest-region") as "US" | "CA") || "US");
    window.addEventListener("regionChange", handler);
    return () => window.removeEventListener("regionChange", handler);
  }, []);
  const usage = useFeatureUsage("lab-values");

  if (!hasPaidAccess) {
    return (
      <div className={`min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900 ${user?.tier !== "admin" ? "select-none" : ""}`}>
        <SEO
          title={t("pages.labValues.abnormalLabValueInterpretationClinical")}
          description={t("pages.labValues.masterAbnormalLabValueInterpretation")}
          canonicalPath="/lab-values"
        />
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <BreadcrumbNav />
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary/60" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.labValues.labValueInterpretationEngine")}</h1>
              <p className="text-lg text-gray-600 mb-2">{t("pages.labValues.premiumInteractiveTool")}</p>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                The abnormal lab interpretation engine with clinical pattern recognition is available exclusively for RPN, RN, and NP subscribers. Master lab clusters across cardiac, renal, hepatic, and metabolic scenarios.
              </p>
              <LocaleLink href="/pricing">
                <Button className="rounded-full px-8 h-12 gap-2 bg-primary text-white hover:brightness-110 shadow-lg" data-testid="button-upgrade-lab-values">
                  <Sparkles className="w-4 h-4" />
                  View Subscription Plans
                </Button>
              </LocaleLink>
              {!user && (
                <p className="text-xs text-gray-400 mt-4">
                  Already subscribed? <LocaleLink href="/login" className="text-primary hover:underline">{t("pages.labValues.signIn")}</LocaleLink> to access.
                </p>
              )}
            </div>
          </div>

          <section className="mt-12" data-testid="section-lab-value-guides-free">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t("pages.labValues.individualLabValueGuides")}</h2>
                <p className="text-sm text-gray-500">{t("pages.labValues.indepthNursingReferenceForEach")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {seoLabValues.map((lab) => (
                <LocaleLink
                  key={lab.slug}
                  href={`/lab-values/${lab.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all group"
                  data-testid={`link-lab-guide-free-${lab.slug}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{lab.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Normal: {lab.normalRange.value} {lab.normalRange.unit}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </LocaleLink>
              ))}
            </div>
          </section>
        </main>
        <AdminEditButton />
        <Footer />
      </div>
    );
  }

  const categoryScenarios = useMemo(() => {
    const grouped: Record<string, ClinicalScenario[]> = {};
    for (const s of scenarios) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    }
    return grouped;
  }, []);

  const currentScenarios = categoryScenarios[activeCategory] || [];
  const currentIdx = scenarioIndex[activeCategory] || 0;
  const scenario = currentScenarios[currentIdx];

  if (!scenario) return null;

  const scenarioKey = scenario.id;
  const isRevealed = showInterpretation[scenarioKey] || false;
  const selectedAnswer = quizAnswers[scenarioKey] ?? null;

  const handleReveal = () => {
    setShowInterpretation((prev) => ({ ...prev, [scenarioKey]: !prev[scenarioKey] }));
  };

  const handleQuizAnswer = async (idx: number) => {
    if (selectedAnswer !== null) return;
    if (usage.isLocked) return;
    await usage.recordUsage();
    setQuizAnswers((prev) => ({ ...prev, [scenarioKey]: idx }));
    const isCorrect = scenario.quiz.options[idx].correct;
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNextScenario = () => {
    if (usage.isLocked) return;
    setScenarioIndex((prev) => ({
      ...prev,
      [activeCategory]: ((prev[activeCategory] || 0) + 1) % currentScenarios.length,
    }));
  };

  const handleResetScore = () => {
    setScore({ correct: 0, total: 0 });
    setQuizAnswers({});
    setShowInterpretation({});
    setScenarioIndex({});
  };

  const catConfig = categoryConfig[activeCategory];
  const CatIcon = catConfig.icon;

  return (
    <div className={`min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900 ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <SEO
        title={t("pages.labValues.abnormalLabValueInterpretationClinical2")}
        description={t("pages.labValues.masterAbnormalLabValueInterpretation2")}
        keywords="abnormal lab values, lab interpretation nursing, clinical lab patterns, NCLEX lab values, troponin BNP, BUN creatinine, AST ALT, CBC interpretation, ABG interpretation, DKA labs, DIC labs, nursing education, lab cluster interpretation"
        canonicalPath="/lab-values"
      />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Beaker className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900" data-testid="text-page-title">
                Lab Value Interpretation Engine
              </h1>
              <p className="text-gray-500 mt-1">{t("pages.labValues.patternRecognitionThroughClinicalClusters")}</p>
            </div>
          </div>
          {region === "CA" && (
            <div className="rounded-xl bg-gradient-to-r from-red-50 to-white border border-red-200/60 px-5 py-4 flex items-start gap-3" data-testid="banner-canadian-labs">
              <span className="text-2xl shrink-0 mt-0.5" role="img" aria-label={t("pages.labValues.mapleLeaf")}>🍁</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{t("pages.labValues.canadianLabReferenceRanges")}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  All lab values, reference ranges, and clinical scenarios on this page use Canadian laboratory standards. NurseNest is the first nursing exam prep platform to provide Canadian-specific lab reference ranges for clinical education. Built to prepare you for Canadian clinical placements and the REX-PN.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary" data-testid="text-score">
                {score.correct} / {score.total} correct
              </span>
            </div>
            {score.total > 0 && (
              <span className="text-sm text-gray-400">
                ({Math.round((score.correct / score.total) * 100)}%)
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleResetScore} className="gap-2" data-testid="button-reset-score">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {!usage.hasUnlimited && !usage.isLoading && (
          <UsageLimitBanner feature="lab-values" count={usage.count} limit={usage.limit} remaining={usage.remaining} />
        )}

        {usage.isLocked ? (
          <UsageLimitPaywall feature="lab-values" />
        ) : (
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v)} className="w-full" data-testid="tabs-categories">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto gap-1 bg-transparent p-0 mb-8">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border border-transparent data-[state=active]:border-primary/30 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                  data-testid={`tab-${key}`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <span className="text-xs font-semibold">{config.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(categoryConfig).map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              {categoryScenarios[cat] && categoryScenarios[cat].length > 0 && (() => {
                const idx = scenarioIndex[cat] || 0;
                const sc = categoryScenarios[cat][idx];
                const key = sc.id;
                const revealed = showInterpretation[key] || false;
                const answer = quizAnswers[key] ?? null;
                const cc = categoryConfig[cat];

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cc.bg} ${cc.color}`}>
                          {cc.label}
                        </span>
                        <span className="text-sm text-gray-400">
                          Scenario {idx + 1} of {categoryScenarios[cat].length}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextScenario}
                        className="gap-2"
                        data-testid="button-next-scenario"
                      >
                        Next Scenario
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <Card className="border-none shadow-lg">
                      <CardContent className="p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-scenario-title">
                          {sc.title}
                        </h2>

                        <div className={`p-4 rounded-xl ${cc.bg} border border-opacity-30 mb-6`}>
                          <div className="flex items-start gap-3">
                            <AlertCircle className={`w-5 h-5 ${cc.color} shrink-0 mt-0.5`} />
                            <p className="text-sm leading-relaxed text-gray-700" data-testid="text-vignette">
                              {sc.vignette}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary" />
                          Lab Value Cluster
                        </h3>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                          {sc.labs.map((lab, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-xl border-2 ${getStatusColor(lab.status)} transition-all`}
                              data-testid={`card-lab-${i}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                                  {lab.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <StatusArrow status={lab.status} />
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getStatusBadge(lab.status)}`}>
                                    {statusLabel(lab.status)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-2xl font-bold">
                                {lab.value} <span className="text-sm font-normal opacity-60">{lab.unit}</span>
                              </div>
                              <div className="text-xs opacity-40 mt-1 italic">
                                Deviation from expected
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-center mb-6">
                          <Button
                            onClick={handleReveal}
                            variant={revealed ? "outline" : "default"}
                            className="gap-2 rounded-full px-8"
                            data-testid="button-reveal-interpretation"
                          >
                            {revealed ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Hide Interpretation
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Reveal Interpretation
                              </>
                            )}
                          </Button>
                        </div>

                        {revealed && (
                          <div className="space-y-4 animate-in fade-in-50 slide-in-from-top-2">
                            <Card className="border border-blue-200 bg-blue-50/50">
                              <CardContent className="p-5">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                  <Brain className="w-4 h-4" />
                                  What's Happening? (Mechanism)
                                </h4>
                                <p className="text-sm text-blue-900 leading-relaxed" data-testid="text-mechanism">
                                  {sc.mechanism}
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="border border-red-200 bg-red-50/50">
                              <CardContent className="p-5">
                                <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Clinical Danger
                                </h4>
                                <p className="text-sm text-red-900 leading-relaxed" data-testid="text-danger">
                                  {sc.clinicalDanger}
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="border border-green-200 bg-green-50/50">
                              <CardContent className="p-5">
                                <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                  <Activity className="w-4 h-4" />
                                  Compensatory Response
                                </h4>
                                <p className="text-sm text-green-900 leading-relaxed" data-testid="text-compensatory">
                                  {sc.compensatoryResponse}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                      <CardContent className="p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          Clinical Quiz
                        </h3>
                        <p className="text-gray-700 font-medium mb-4" data-testid="text-quiz-question">
                          {sc.quiz.question}
                        </p>
                        <div className="grid gap-3">
                          {sc.quiz.options.map((opt, i) => {
                            const isSelected = answer === i;
                            const isCorrectOption = opt.correct;
                            let style = "hover:bg-primary/5 hover:border-primary/40 cursor-pointer border-gray-200";
                            if (answer !== null) {
                              if (isCorrectOption) style = "bg-emerald-50 border-emerald-400";
                              else if (isSelected && !isCorrectOption) style = "bg-red-50 border-red-400";
                              else style = "opacity-50 border-gray-200";
                            }
                            return (
                              <div
                                key={i}
                                className={`p-4 rounded-xl border-2 transition-all ${style}`}
                                onClick={() => handleQuizAnswer(i)}
                                data-testid={`card-quiz-option-${i}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                                    answer !== null && isCorrectOption ? "bg-emerald-500 text-white" :
                                    isSelected && !isCorrectOption ? "bg-red-500 text-white" :
                                    "bg-gray-100 text-gray-600"
                                  }`}>
                                    {answer !== null && isCorrectOption ? <CheckCircle2 className="w-5 h-5" /> :
                                     isSelected && !isCorrectOption ? <XCircle className="w-5 h-5" /> :
                                     String.fromCharCode(65 + i)}
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">{opt.text}</span>
                                    {answer !== null && (isSelected || isCorrectOption) && (
                                      <p className={`text-xs mt-2 leading-relaxed ${isCorrectOption ? "text-emerald-700" : "text-red-700"}`}>
                                        {opt.rationale}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </TabsContent>
          ))}
        </Tabs>
        )}

        <section className="mt-10" data-testid="section-lab-value-guides">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t("pages.labValues.individualLabValueGuides2")}</h2>
              <p className="text-sm text-gray-500">{t("pages.labValues.indepthNursingReferenceForEach2")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {seoLabValues.map((lab) => (
              <LocaleLink
                key={lab.slug}
                href={`/lab-values/${lab.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all group"
                data-testid={`link-lab-guide-${lab.slug}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{lab.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Normal: {lab.normalRange.value} {lab.normalRange.unit}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </LocaleLink>
            ))}
          </div>
        </section>

        <LocaleLink href="/si-to-conventional-units-converter">
          <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors cursor-pointer group mt-10" data-testid="link-unit-converter-cta">
            <ArrowRightLeft className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{t("pages.labValues.siConventionalUnitsConverter")}</p>
              <p className="text-xs text-gray-500">{t("pages.labValues.convertBetweenCanadianSiAnd")}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </LocaleLink>

        <div className="mt-12 space-y-6">
          <MedicalReviewBadge lastUpdated="2025-12-01" />
          <MedicalReferences lessonId="hematology-lab-values-reference" />
        </div>

        <div className="mt-16">
          <EducationalIntegrity variant="footer" />
        </div>
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
