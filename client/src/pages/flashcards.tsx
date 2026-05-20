import { getAssetUrl } from "@/lib/asset-url";
import { getAuthHeaders } from "@/lib/queryClient";
import {
  readApiJsonResponse,
  getLearnerMessageForCode,
  BackendErrorCodes,
  isEntitlementErrorCode,
  isAuthRequiredCode,
} from "@/lib/api-error";
import { useState, useEffect, useMemo, useCallback, useRef, Fragment } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Navigation } from "@/components/navigation";
import { ProtectedContent } from "@/components/protected-content";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import { useEntitlement } from "@/hooks/use-entitlement";
import { LocaleLink } from "@/lib/LocaleLink";
import { ContextualRelatedResources } from "@/components/related-resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeckHub, DeckView, DeckEditor, DeckStudyLearn, DeckStudyTest, DeckReportCard } from "@/components/deck-views";
import {
  cacheMyDecks, getCachedMyDecks,
  cachePublicDecks, getCachedPublicDecks,
  cacheDeckCards, getCachedDeckCards,
  cacheExamFlashcardCounts, getCachedExamFlashcardCounts,
  cacheExamFlashcards, getCachedExamFlashcards,
  EMERGENCY_NURSING_DECK, EMERGENCY_NURSING_CARDS,
  type DegradedMode,
} from "@/lib/flashcard-cache";
import { FlashcardErrorBoundary, DegradedModeIndicator } from "@/components/flashcard-error-boundary";
import { Textarea } from "@/components/ui/textarea";
import { 

  ChevronRight, 
  ChevronLeft, 
  Clock,
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Bookmark, 
  BookmarkCheck,
  LayoutGrid,
  ClipboardCheck,
  Settings2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Trophy,
  History,
  Trash2,
  Pencil,
  Plus,
  Search,
  AlertTriangle,
  Sparkles,
  Lock,
  CreditCard,
  Layers,
  Share2,
  Copy,
  Flag,
  Globe,
  EyeOff,
  Timer,
  Upload,
  Download,
  BarChart3,
  Eye,
  Wand2,
  Loader2,
  Crown,
  Zap,
  Lightbulb,
  X,
  GraduationCap,
  Target,
  Brain,
  Heart,
  Stethoscope,
  Filter,
  Star,
  Award,
  RotateCcw,
  TrendingUp,
  Monitor,
  AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { AnswerOption, RationaleSection, RationaleImageBlock, QuestionContextHeader, KeyTakeawayBox, ThemedProgressBar } from "@/components/premium-study";
import { ProtectedImage } from "@/components/protected-image";
import { getCategoryImage } from "@/lib/system-images";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AdaptiveStudyHub } from "@/components/adaptive-study";
import { SocialProofBar } from "@/components/conversion-funnel";
import { AITutorWidget } from "@/components/ai-tutor-widget";

const heartImg = getAssetUrl("heart-flashcard.png");
const pedsImg = getAssetUrl("peds-flashcard.png");
const oncologyImg = getAssetUrl("oncology-flashcard.png");
const aaaImg = getAssetUrl("abdominalaorticaneurysm_1773374656570.png");


type CardType = "question" | "term";

type Flashcard = {
  id: string;
  type: CardType;
  question: string;
  options?: string[];
  correctIndex?: number;
  answer: string;
  category: string;
  image?: string;
  clinicalPearl?: string;
  optionRationales?: string[];
  detailedRationale?: string;
  source?: "review_queue" | "weak_area" | "srs_due" | "fresh" | "static";
  bodySystem?: string;
  topic?: string;
  difficulty?: number;
  examStrategy?: string;
  memoryHook?: string;
  distractorRationales?: Record<string, string> | null;
  previouslyAnswered?: boolean;
  previouslyCorrect?: boolean;
};

const baseCards: Flashcard[] = [
  // Questions (from previous turns)
  { 
    id: "q1",
    type: "question",
    question: "What is the priority assessment for a client post-op following an Abdominal Aortic Aneurysm (AAA) repair?", 
    options: [
      "Assessing for bowel sounds in all four quadrants",
      "Monitoring distal peripheral pulses and hourly urine output",
      "Encouraging early ambulation within 2 hours",
      "Measuring abdominal girth once every 24 hours"
    ],
    correctIndex: 1,
    answer: "Priority is ensuring the graft is patent and renal perfusion is maintained. Urine output must be >30mL/hr, and distal pulses ensure blood flow past the graft.",
    category: "Cardiovascular",
    image: aaaImg
  },
  { 
    id: "q2",
    type: "question",
    question: "A child with Kawasaki Disease is receiving IVIG. Which teaching is most important regarding live vaccines?", 
    options: [
      "Get live vaccines immediately after discharge",
      "Live vaccines should be avoided for 11 months",
      "Only inactivated vaccines are prohibited",
      "Live vaccines can be given after 2 weeks"
    ],
    correctIndex: 1,
    answer: "IVIG contains high concentrations of antibodies that can interfere with the immune response to live vaccines like MMR and Varicella. Delay for 11 months.",
    category: "Pediatrics",
    image: pedsImg
  },
  { 
    id: "q3",
    type: "question",
    question: "A client with Acute Lymphoblastic Leukemia (ALL) has an Absolute Neutrophil Count (ANC) of 350. Which action is the priority?", 
    options: [
      "Provide a diet rich in raw fruits and vegetables",
      "Administer a rectal suppository for constipation",
      "Implement strict neutropenic precautions",
      "Encourage the client to visit the hospital cafeteria"
    ],
    correctIndex: 2,
    answer: "An ANC < 500 represents severe neutropenia. Strict precautions (no raw foods, no fresh flowers, limited visitors) are vital to prevent life-threatening infection.",
    category: "Oncology",
    image: oncologyImg
  },
  // Terms
  {
    id: "t1",
    type: "term",
    question: "Pulsatile Abdominal Mass",
    answer: "A key clinical finding in Abdominal Aortic Aneurysm (AAA), indicating the aorta is dilated and transmitting the heart's pulsations through the abdominal wall.",
    category: "Cardiovascular",
    image: aaaImg
  },
  {
    id: "t2",
    type: "term",
    question: "Strawberry Tongue",
    answer: "A characteristic finding in Kawasaki Disease (acute phase) where the tongue appears red and bumpy due to inflamed papillae.",
    category: "Pediatrics",
    image: pedsImg
  },
  {
    id: "t3",
    type: "term",
    question: "Pancytopenia",
    answer: "A simultaneous reduction in RBCs, WBCs, and platelets, commonly seen in leukemia due to bone marrow overcrowding by malignant blasts.",
    category: "Oncology",
    image: oncologyImg
  },
  {
    id: "t4",
    type: "term",
    question: "tPA Window",
    answer: "The critical 3 to 4.5 hour timeframe from the 'last known well' time for administering thrombolytic therapy in ischemic stroke.",
    category: "Neurological"
  },
  {
    id: "q-shock-1",
    type: "question",
    question: "A client with a ruptured AAA presents with BP 80/40, HR 128, and pale/clammy skin. Which type of shock is occurring?",
    options: ["Septic Shock", "Cardiogenic Shock", "Hypovolemic Shock", "Neurogenic Shock"],
    correctIndex: 2,
    answer: "Hypovolemic shock occurs due to rapid blood loss (exsanguination) from the ruptured aneurysm. Treatment requires immediate fluid bolus and blood products.",
    category: "Cardiovascular"
  },
  {
    id: "q-resp-1",
    type: "question",
    question: "Which finding is the most critical to report in a client with an acute asthma exacerbation?",
    options: ["Expiratory wheezing", "Productive cough", "Silent chest (absence of wheezing)", "Use of accessory muscles"],
    correctIndex: 2,
    answer: "A 'silent chest' indicates that air movement is so restricted that wheezing has stopped, signaling imminent respiratory failure.",
    category: "Respiratory"
  },
  {
    id: "t-neuro-1",
    type: "term",
    question: "Cushing's Triad",
    answer: "A late sign of increased ICP characterized by widening pulse pressure (HTN), bradycardia, and irregular respirations.",
    category: "Neurological"
  },
  {
    id: "q-gi-1",
    type: "question",
    question: "A client with a suspected small bowel obstruction has a board-like, rigid abdomen. What does this suggest?",
    options: ["Normal digestion", "Peritonitis/Perforation", "Constipation", "GERD"],
    correctIndex: 1,
    answer: "A rigid, board-like abdomen is a classic sign of peritonitis, often following a bowel perforation; a surgical emergency.",
    category: "GI"
  },
  {
    id: "q-meds-1",
    type: "question",
    question: "A client is taking Ginkgo Biloba and Warfarin. What is the primary safety concern?",
    options: ["Increased risk of blood clots", "Increased risk of bleeding", "Severe hypertension", "Liver failure"],
    correctIndex: 1,
    answer: "Ginkgo Biloba has antiplatelet effects and can significantly increase the risk of bleeding when combined with anticoagulants like Warfarin.",
    category: "Pharmacology"
  },
  {
    id: "t-peds-1",
    type: "term",
    question: "Epiglottitis (The 4 Ds)",
    answer: "Drooling, Dysphagia, Dysphonia, and Distressed inspiratory stridor. A pediatric airway emergency.",
    category: "Pediatrics"
  },
  {
    id: "q-pe-1",
    type: "question",
    question: "A post-op client suddenly develops pleuritic chest pain and shortness of breath. What is the priority?",
    options: ["Check temperature", "Apply oxygen and place in High-Fowler's", "Give an aspirin", "Encourage walking"],
    correctIndex: 1,
    answer: "These are classic signs of a Pulmonary Embolism. Immediate oxygenation and positioning are the priority nursing actions.",
    category: "Respiratory"
  },
  {
    id: "t-shock-1",
    type: "term",
    question: "MAP (Mean Arterial Pressure)",
    answer: "The average pressure in the arteries during one cardiac cycle. Must be > 65 mmHg to ensure adequate end-organ perfusion.",
    category: "Cardiovascular"
  },
  {
    id: "q-k-1",
    type: "question",
    question: "A client's potassium level is 6.8 mEq/L. Which medication is the priority to protect the heart?",
    options: ["Furosemide", "Sodium Polystyrene", "Calcium Gluconate", "Insulin/Dextrose"],
    correctIndex: 2,
    answer: "Calcium Gluconate does not lower potassium, but it stabilizes the cardiac membrane to prevent lethal dysrhythmias until the potassium can be shifted or removed.",
    category: "Pharmacology"
  },
  {
    id: "t-skin-1",
    type: "term",
    question: "Rule of Nines",
    answer: "A standardized tool used to quickly estimate the Total Body Surface Area (TBSA) burned in adults to guide fluid resuscitation.",
    category: "Skin"
  },
  {
    id: "q-angina-1",
    type: "question",
    question: "A client reports chest pain that occurs with exertion and is relieved by rest and nitroglycerin. What is this?",
    options: ["Unstable Angina", "Stable Angina", "Myocardial Infarction", "Prinzmetal Angina"],
    correctIndex: 1,
    answer: "Stable angina is predictable and occurs with exertion, relieved by rest or nitrates. Unstable angina is a medical emergency as it occurs at rest or increases in frequency/severity.",
    category: "Cardiovascular"
  },
  {
    id: "t-sepsis-1",
    type: "term",
    question: "SIRS Criteria",
    answer: "Systemic Inflammatory Response Syndrome: Defined by 2+ of: Temp >38C or <36C, HR >90, RR >20, or WBC >12k or <4k.",
    category: "Infection"
  },
  {
    id: "q-gu-1",
    type: "question",
    question: "Which electrolyte imbalance is a priority concern in a client with chronic kidney disease?",
    options: ["Hyponatremia", "Hypocalcemia", "Hyperkalemia", "Hypomagnesemia"],
    correctIndex: 2,
    answer: "Hyperkalemia is the most life-threatening electrolyte imbalance in renal failure due to the risk of lethal cardiac arrhythmias.",
    category: "GU / Renal"
  },
  {
    id: "t-ms-1",
    type: "term",
    question: "Osteoporosis Safety",
    answer: "Focus on fall prevention, weight-bearing exercise (walking), and adequate Calcium/Vitamin D intake.",
    category: "Musculoskeletal"
  },
  {
    id: "q-meds-2",
    type: "question",
    question: "A client is prescribed St. John's Wort. Which medication would cause a major interaction?",
    options: ["Vitamin C", "Digoxin", "Acetaminophen", "Loperamide"],
    correctIndex: 1,
    answer: "St. John's Wort significantly decreases the effectiveness of many critical drugs, including Digoxin, Warfarin, and oral contraceptives.",
    category: "Pharmacology"
  },
  {
    id: "t-peds-2",
    type: "term",
    question: "Tetralogy of Fallot (Tet Spell)",
    answer: "Acute cyanotic episode. Priority action: Place the infant in a knee-chest position to increase systemic vascular resistance.",
    category: "Pediatrics"
  },
  {
    id: "q-insulin-1",
    type: "question",
    question: "A client is shaky, sweaty, and confused after receiving insulin. What is the priority?",
    options: ["Give more insulin", "Check blood glucose and give 15g carbs", "Encourage a nap", "Wait for the next meal"],
    correctIndex: 1,
    answer: "These are signs of hypoglycemia. The 'Rule of 15' (check glucose, give 15g simple carbs) is the standard treatment.",
    category: "Pharmacology"
  },
  {
    id: "t-gi-1",
    type: "term",
    question: "Melena vs Hematochezia",
    answer: "Melena is black, tarry stool (Upper GI bleed). Hematochezia is bright red blood per rectum (Lower GI bleed).",
    category: "GI"
  },
  {
    id: "q-copd-1",
    type: "question",
    question: "What is the target oxygen saturation for a client with chronic COPD?",
    options: ["95-100%", "88-92%", "92-96%", "Over 94%"],
    correctIndex: 1,
    answer: "COPD patients often have a 'hypoxic drive.' Keeping sats at 88-92% prevents suppression of their respiratory urge.",
    category: "Respiratory"
  },
  {
    id: "q-lithium-1",
    type: "question",
    question: "A client on Lithium therapy reports blurred vision and tremors. What is the priority nursing action?",
    options: ["Administer the next dose", "Give a glass of water", "Hold the dose and notify the provider", "Encourage exercise"],
    correctIndex: 2,
    answer: "Blurred vision, tremors, and ataxia are signs of lithium toxicity. The dose must be held immediately and levels checked.",
    category: "Pharmacology"
  },
  {
    id: "t-endo-1",
    type: "term",
    question: "Diabetes Insipidus (DI)",
    answer: "Caused by ADH deficiency. Characterized by polydipsia and large amounts of dilute urine (low specific gravity). Risk: Dehydration.",
    category: "Endocrine"
  },
  {
    id: "q-ob-1",
    type: "question",
    question: "A client at 32 weeks gestation has painless, bright red vaginal bleeding. What is suspected?",
    options: ["Placental Abruption", "Placenta Previa", "Normal Labor", "Ectopic Pregnancy"],
    correctIndex: 1,
    answer: "Painless, bright red bleeding in the third trimester is a classic sign of Placenta Previa. Painful bleeding suggests abruption.",
    category: "Maternal"
  },
  {
    id: "t-psych-1",
    type: "term",
    question: "Serotonin Syndrome",
    answer: "Caused by excess serotonin. Symptoms: Agitation, fever, tachycardia, and hyperreflexia. Often occurs with SSRI/MAOI combinations.",
    category: "Psychiatry"
  },
  {
    id: "q-anemia-1",
    type: "question",
    question: "A child with Sickle Cell Disease presents with severe pain and fever. What is the priority intervention?",
    options: ["Administer antibiotics", "Start IV fluids", "Apply ice packs to joints", "Encourage ambulation"],
    correctIndex: 1,
    answer: "Hydration is critical in a Sickle Cell crisis to reduce blood viscosity and stop the sickling process. Ice packs are contraindicated as they cause vasoconstriction.",
    category: "Hematology"
  },
  {
    id: "t-anemia-1",
    type: "term",
    question: "Iron Deficiency Anemia Education",
    answer: "Take iron supplements with Vitamin C (orange juice) to increase absorption. Use a straw to prevent teeth staining. Stools will turn black/tarry (normal).",
    category: "Hematology"
  },
  {
    id: "q-gi-2",
    type: "question",
    question: "A 6-week-old infant has projectile vomiting after feeding and an 'olive-shaped' mass in the epigastrium. What is suspected?",
    options: ["GERD", "Pyloric Stenosis", "Intussusception", "Hirschsprung Disease"],
    correctIndex: 1,
    answer: "Projectile non-bilious vomiting and an olive-shaped mass are classic signs of Hypertrophic Pyloric Stenosis.",
    category: "GI"
  },
  {
    id: "t-gi-2",
    type: "term",
    question: "Intussusception",
    answer: "Telescoping of the bowel. Classic signs: Sudden severe abdominal pain (knees to chest), 'sausage-shaped' abdominal mass, and 'currant jelly' stools.",
    category: "GI"
  },
  {
    id: "q-endo-2",
    type: "question",
    question: "A client with Addison's Disease arrives with BP 70/40 and confusion. Which electrolyte imbalance is expected?",
    options: ["Hypernatremia", "Hypokalemia", "Hyperkalemia", "Hyperglycemia"],
    correctIndex: 2,
    answer: "Addison's (Adrenal Insufficiency) leads to a lack of aldosterone, causing sodium/water loss (hypotension) and potassium retention (hyperkalemia).",
    category: "Endocrine"
  },
  {
    id: "t-endo-3",
    type: "term",
    question: "Cushing's Syndrome",
    answer: "Caused by excess cortisol. Signs: Moon face, Buffalo hump, Truncal obesity, Hypertension, Hyperglycemia, and Hypokalemia.",
    category: "Endocrine"
  },
  {
    id: "q-neuro-3",
    type: "question",
    question: "A child has a history of febrile seizures. What is the most important teaching for the parents?",
    options: ["Give prophylactic phenytoin daily", "Give aspirin for fever", "Manage fever with acetaminophen/ibuprofen", "Call 911 for every fever"],
    correctIndex: 2,
    answer: "Febrile seizures are benign and triggered by the rapid rise in temperature. Fever management is the key prevention. Aspirin is contraindicated (Reye's syndrome).",
    category: "Neurological"
  },
  {
    id: "t-pharm-2",
    type: "term",
    question: "Phenytoin (Dilantin)",
    answer: "Anticonvulsant. Therapeutic range: 10-20 mcg/mL. Side effects: Gingival hyperplasia (need dental care). Toxicity: Ataxia, nystagmus, slurred speech.",
    category: "Pharmacology"
  },
  {
    id: "q-infection-1",
    type: "question",
    question: "Which isolation precaution is required for a client with Bacterial Meningitis?",
    options: ["Contact", "Airborne", "Droplet", "Standard"],
    correctIndex: 2,
    answer: "Bacterial Meningitis (Neisseria meningitidis) requires Droplet precautions. Antibiotics must be started immediately after cultures.",
    category: "Infection"
  },
  {
    id: "t-cardiac-1",
    type: "term",
    question: "Rheumatic Fever",
    answer: "Inflammatory disease following untreated Strep throat (Group A Beta-hemolytic Streptococcus). Can cause carditis and permanent heart valve damage.",
    category: "Cardiovascular"
  },
  {
    id: "q-pharm-3",
    type: "question",
    question: "A client taking an NSAID (Ibuprofen) reports black tarry stools. What is the concern?",
    options: ["Iron toxicity", "GI Bleeding", "Normal side effect", "Liver failure"],
    correctIndex: 1,
    answer: "NSAIDs inhibit prostaglandins that protect the stomach lining, leading to gastric ulcers and GI bleeding (melena).",
    category: "Pharmacology"
  },
  {
    id: "t-gi-3",
    type: "term",
    question: "Cholecystitis",
    answer: "Inflammation of the gallbladder. Signs: RUQ pain radiating to right shoulder/scapula, Murphy's sign (pain on inspiration with palpation), triggered by fatty meals.",
    category: "GI"
  },
  {
    id: "q-resp-3",
    type: "question",
    question: "A child with Cystic Fibrosis is prescribed Pancrelipase. When should it be administered?",
    options: ["Before bed", "With every meal and snack", "Once daily in the morning", "Only with fatty foods"],
    correctIndex: 1,
    answer: "Pancreatic enzymes must be taken with every meal and snack to aid in digestion and absorption of nutrients.",
    category: "Respiratory"
  },
  {
    id: "t-neuro-2",
    type: "term",
    question: "Autonomic Dysreflexia",
    answer: "Life-threatening emergency in spinal cord injury (T6 or higher). Triggered by noxious stimuli (full bladder/constipation). Signs: Severe HTN, headache, bradycardia.",
    category: "Neurological"
  },
  {
    id: "q-ob-2",
    type: "question",
    question: "A client in labor has a sudden drop in fetal heart rate that does not return to baseline. On exam, the cord is palpable. Priority?",
    options: ["Start Oxytocin", "Place client in Knee-Chest position", "Encourage pushing", "Give fluids"],
    correctIndex: 1,
    answer: "This is Umbilical Cord Prolapse. Knee-chest or Trendelenburg position relieves pressure on the cord. Keep hand in vagina to lift head off cord until C-section.",
    category: "Maternal"
  },
  {
    id: "q-transfusion-1",
    type: "question",
    question: "A client receiving a blood transfusion develops flank pain and dark red urine. What is the likely cause?",
    options: ["Febrile Non-Hemolytic Reaction", "Acute Hemolytic Reaction", "Anaphylaxis", "Fluid Overload"],
    correctIndex: 1,
    answer: "Acute Hemolytic Reaction. ABO incompatibility causes massive hemolysis. Released hemoglobin damages kidneys (dark urine/flank pain).",
    category: "Hematology"
  },
  {
    id: "q-ob-3",
    type: "question",
    question: "Which intervention is maximizing fetal oxygenation during pushing with variable decelerations?",
    options: ["Pushing in lithotomy position", "Open glottis pushing (slow exhalation)", "Holding breath for 10 seconds", "Pushing with every contraction"],
    correctIndex: 1,
    answer: "Open glottis pushing promotes maternal cardiac output and placental perfusion. Closed glottis (Valsalva) reduces oxygenation.",
    category: "Maternal"
  },
  {
    id: "t-wound-1",
    type: "term",
    question: "Negative Pressure Wound Therapy (NPWT)",
    answer: "Promotes healing by removing exudate/infectious material and stimulating angiogenesis via mechanical strain. Must maintain an airtight seal.",
    category: "Skin"
  },
  {
    id: "t-peds-3",
    type: "term",
    question: "Pavlik Harness",
    answer: "Used for Hip Dysplasia. Maintains hips in flexion and abduction. Worn 24/7. Assess skin under straps. No powders/lotions.",
    category: "Pediatrics"
  },
  {
    id: "t-resp-1",
    type: "term",
    question: "Rhonchi",
    answer: "Low-pitched, snoring breath sounds caused by thick mucus in large airways. Often clears with coughing. Seen in bronchitis.",
    category: "Respiratory"
  },
  {
    id: "q-pharm-4",
    type: "question",
    question: "A client taking Oxybutynin reports dry mouth and constipation. What is the nurse's best response?",
    options: ["Stop the medication immediately", "These are expected anticholinergic side effects", "Go to the ER", "Double the dose"],
    correctIndex: 1,
    answer: "Oxybutynin is an anticholinergic. Common side effects include drying secretions (dry mouth, constipation, urinary retention). Increase fluids/fiber.",
    category: "Pharmacology"
  },
  {
    id: "q-onc-1",
    type: "question",
    question: "Tumor Lysis Syndrome releases intracellular components into the blood. Which electrolyte imbalance is expected?",
    options: ["Hypokalemia", "Hypercalcemia", "Hyperuricemia & Hyperkalemia", "Hypophosphatemia"],
    correctIndex: 2,
    answer: "Cell destruction releases Potassium (Hyperkalemia), Phosphate (Hyperphosphatemia), and Nucleic Acids (Hyperuricemia).",
    category: "Oncology"
  },
  {
    id: "q-neuro-4",
    type: "question",
    question: "Which anticonvulsant is preferred for brain tumor patients due to minimal drug interactions?",
    options: ["Phenytoin", "Carbamazepine", "Levetiracetam", "Valproic Acid"],
    correctIndex: 2,
    answer: "Levetiracetam (Keppra) has a favorable side effect profile and few drug-drug interactions compared to older anticonvulsants.",
    category: "Pharmacology"
  },
  {
    id: "mat-1",
    type: "term",
    question: "GTPAL",
    answer: "Gravida (total pregnancies), Term (births at 37+ weeks), Preterm (births before 37 weeks), Abortions (spontaneous or elective losses before 20 weeks), Living (children currently alive). A systematic method for assessing obstetric history.",
    category: "Maternal"
  },
  {
    id: "mat-2",
    type: "term",
    question: "Nagele's Rule",
    answer: "Subtract 3 months from the first day of the last menstrual period (LMP), then add 7 days to estimate the expected date of delivery (EDD).",
    category: "Maternal"
  },
  {
    id: "mat-3",
    type: "question",
    question: "A client at 32 weeks reports painless bright red vaginal bleeding. What is the priority action?",
    options: ["Perform a vaginal exam", "Prepare for emergency C-section", "Do NOT perform vaginal exam, notify provider", "Start Oxytocin"],
    correctIndex: 2,
    answer: "Painless bright red bleeding in the third trimester is the hallmark of Placenta Previa. NEVER perform a vaginal or digital exam as it can cause catastrophic hemorrhage. Notify the provider immediately.",
    category: "Maternal"
  },
  {
    id: "mat-4",
    type: "term",
    question: "HELLP Syndrome",
    answer: "Hemolysis, Elevated Liver enzymes, Low Platelets. A severe, life-threatening form of preeclampsia requiring immediate delivery regardless of gestational age.",
    category: "Maternal"
  },
  {
    id: "mat-5",
    type: "question",
    question: "A client receiving magnesium sulfate for preeclampsia shows signs of toxicity. Which finding requires immediate intervention?",
    options: ["DTRs 2+", "Respiratory rate of 10", "Urine output 40mL/hr", "Flushing"],
    correctIndex: 1,
    answer: "A respiratory rate below 12 breaths/min indicates magnesium sulfate toxicity. Hold the magnesium infusion and administer the antidote, Calcium Gluconate, immediately.",
    category: "Maternal"
  },
  {
    id: "mat-6",
    type: "term",
    question: "Postpartum Hemorrhage 4 T's",
    answer: "Tone (uterine atony: most common cause), Tissue (retained placental fragments), Trauma (lacerations or hematomas), Thrombin (coagulopathy/DIC). A framework for identifying the cause of postpartum hemorrhage.",
    category: "Maternal"
  },
  {
    id: "mat-7",
    type: "question",
    question: "A postpartum client has a boggy uterus and heavy vaginal bleeding. What is the first action?",
    options: ["Start an IV", "Administer Methergine", "Perform fundal massage", "Call the surgeon"],
    correctIndex: 2,
    answer: "Fundal massage is the FIRST nursing intervention for uterine atony. It stimulates the uterus to contract and control bleeding before pharmacological or surgical interventions.",
    category: "Maternal"
  },
  {
    id: "mat-8",
    type: "term",
    question: "BUBBLE-HE Assessment",
    answer: "Breasts, Uterus, Bladder, Bowel, Lochia, Episiotomy/Laceration, Homan sign (DVT screening), Emotions. A systematic head-to-toe postpartum assessment framework.",
    category: "Maternal"
  },
  {
    id: "mat-9",
    type: "question",
    question: "A laboring client has late decelerations on the fetal monitor. What is the priority intervention?",
    options: ["Increase Oxytocin", "Position client on left side and administer O2", "Prepare for vaginal delivery", "Encourage pushing"],
    correctIndex: 1,
    answer: "Late decelerations indicate uteroplacental insufficiency. Turn the client to the left lateral position to improve placental perfusion, administer oxygen, and STOP Oxytocin if infusing.",
    category: "Maternal"
  },
  {
    id: "mat-10",
    type: "term",
    question: "Amniotic Fluid Embolism",
    answer: "A catastrophic obstetric emergency where amniotic fluid enters the maternal circulation, causing an anaphylactoid reaction, cardiovascular collapse, and disseminated intravascular coagulation (DIC). Mortality rate is 60-80%.",
    category: "Maternal"
  },
  {
    id: "neo-1",
    type: "term",
    question: "APGAR Score",
    answer: "Appearance (color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), Respirations (breathing effort). Assessed at 1 and 5 minutes after birth. Score 7-10 is normal, 4-6 indicates moderate distress, 0-3 indicates severe distress.",
    category: "Neonatal"
  },
  {
    id: "neo-2",
    type: "question",
    question: "A newborn has a temperature of 36.0°C (96.8°F). What is the priority action?",
    options: ["Administer warm IV fluids", "Place under radiant warmer and skin-to-skin", "Start antibiotics", "Draw blood glucose"],
    correctIndex: 1,
    answer: "Cold stress in neonates leads to hypoglycemia, metabolic acidosis, and increased oxygen consumption. Rewarm immediately with a radiant warmer and skin-to-skin contact.",
    category: "Neonatal"
  },
  {
    id: "neo-3",
    type: "term",
    question: "Kernicterus",
    answer: "Bilirubin encephalopathy caused by unconjugated (indirect) bilirubin crossing the blood-brain barrier. Causes permanent neurological damage including cerebral palsy and hearing loss. Prevention: phototherapy and exchange transfusion.",
    category: "Neonatal"
  },
  {
    id: "neo-4",
    type: "question",
    question: "During phototherapy for jaundice, which nursing intervention is essential?",
    options: ["Cover the eyes with eye shields", "Limit oral feedings", "Keep all clothing on", "Decrease ambient temperature"],
    correctIndex: 0,
    answer: "Eye shields are essential to prevent retinal damage from the phototherapy lights. Maximize skin exposure (remove clothing) and increase feedings to promote bilirubin excretion.",
    category: "Neonatal"
  },
  {
    id: "neo-5",
    type: "term",
    question: "Surfactant Deficiency",
    answer: "The primary cause of Respiratory Distress Syndrome (RDS) in premature neonates. Type II pneumocytes begin producing surfactant at 24 weeks gestation, with adequate amounts by 34-36 weeks. Surfactant reduces alveolar surface tension to prevent collapse.",
    category: "Neonatal"
  },
  {
    id: "neo-6",
    type: "question",
    question: "A premature neonate shows nasal flaring, grunting, and intercostal retractions. What is the expected treatment?",
    options: ["Inhaled bronchodilators", "Exogenous surfactant administration", "Oral antibiotics", "Fluid restriction"],
    correctIndex: 1,
    answer: "These are classic signs of Respiratory Distress Syndrome (RDS) from surfactant deficiency. Treatment is exogenous surfactant replacement via endotracheal tube.",
    category: "Neonatal"
  },
  {
    id: "neo-7",
    type: "term",
    question: "Necrotizing Enterocolitis (NEC)",
    answer: "Intestinal necrosis occurring primarily in premature neonates. Pneumatosis intestinalis (air in the bowel wall) on abdominal x-ray is pathognomonic. Breast milk is protective and reduces incidence.",
    category: "Neonatal"
  },
  {
    id: "neo-8",
    type: "question",
    question: "A neonate in the NICU develops abdominal distension, bilious emesis, and bloody stools. What is the suspected diagnosis?",
    options: ["Pyloric stenosis", "NEC", "Hirschsprung disease", "GERD"],
    correctIndex: 1,
    answer: "This is the classic triad of Necrotizing Enterocolitis (NEC). Immediate management: make NPO, insert OG tube for decompression, and start IV antibiotics.",
    category: "Neonatal"
  },
  {
    id: "neo-9",
    type: "term",
    question: "Therapeutic Hypothermia",
    answer: "Targeted cooling to 33.5°C for 72 hours for Hypoxic-Ischemic Encephalopathy (HIE). Must begin within 6 hours of birth. Reduces secondary brain injury by decreasing metabolic rate and excitotoxicity.",
    category: "Neonatal"
  },
  {
    id: "neo-10",
    type: "question",
    question: "A term newborn born after prolonged labor has poor tone, weak cry, and seizures at 4 hours of life. What is the next step?",
    options: ["Administer glucose", "Initiate therapeutic hypothermia", "Start phototherapy", "Observe and reassess"],
    correctIndex: 1,
    answer: "This presentation is consistent with Hypoxic-Ischemic Encephalopathy (HIE). With seizures within the 6-hour window, initiate therapeutic hypothermia immediately to reduce secondary brain injury.",
    category: "Neonatal"
  },
  {
    id: "proc-1",
    type: "term",
    question: "Sterile Technique",
    answer: "Maintaining a sterile field to prevent surgical site infections. Key rules: sterile touches sterile only, 1-inch border is contaminated, keep hands above waist, face the sterile field at all times.",
    category: "Procedures"
  },
  {
    id: "proc-2",
    type: "question",
    question: "A nurse is inserting a Foley catheter. The catheter touches the client's thigh. Next action?",
    options: ["Continue insertion", "Wipe the catheter with alcohol", "Discard and get a new sterile catheter", "Apply more lubricant"],
    correctIndex: 2,
    answer: "The catheter is now contaminated. Discard it and obtain a new sterile kit. Urinary catheterization requires strict sterile technique.",
    category: "Procedures"
  },
  {
    id: "proc-3",
    type: "term",
    question: "Modified Allen's Test",
    answer: "Tests collateral circulation via ulnar artery before radial artery puncture for ABG. Compress both arteries, release ulnar, hand should pink up within 5-15 seconds.",
    category: "Procedures"
  },
  {
    id: "proc-4",
    type: "question",
    question: "During blood transfusion, a client develops fever, chills, and flank pain within 15 minutes. Priority action?",
    options: ["Slow the infusion rate", "Administer Diphenhydramine", "STOP the transfusion immediately", "Increase IV fluids"],
    correctIndex: 2,
    answer: "This is an Acute Hemolytic Transfusion Reaction. STOP the transfusion immediately, maintain IV access with NS, notify provider, and send blood bag to lab.",
    category: "Procedures"
  },
  {
    id: "proc-5",
    type: "term",
    question: "Chest Tube Tidaling",
    answer: "Normal fluctuation of water level in the water seal chamber that rises with inspiration and falls with expiration (spontaneous breathing). Absence of tidaling may indicate lung re-expansion or tube obstruction.",
    category: "Procedures"
  },
  {
    id: "proc-6",
    type: "question",
    question: "A chest tube is accidentally pulled out. Immediate action?",
    options: ["Reinsert the tube", "Apply petroleum gauze dressing taped on 3 sides", "Apply dry sterile gauze taped on all 4 sides", "Clamp the remaining tubing"],
    correctIndex: 1,
    answer: "Petroleum gauze taped on 3 sides creates a flutter-valve effect: allows air out during exhalation but prevents air entry during inhalation.",
    category: "Procedures"
  },
  {
    id: "proc-7",
    type: "term",
    question: "CLABSI Bundle",
    answer: "Evidence-based central line infection prevention: Hand hygiene, Full barrier precautions, Chlorhexidine skin prep, Optimal catheter site selection, Daily line necessity review. Reduces infections by >70%.",
    category: "Procedures"
  },
  {
    id: "proc-8",
    type: "question",
    question: "Before administering a medication through an NG tube, the nurse aspirates contents with pH of 3. This indicates?",
    options: ["Intestinal placement", "Gastric placement", "Respiratory placement", "Esophageal placement"],
    correctIndex: 1,
    answer: "Gastric pH is typically 1-5. Intestinal pH is 6-7. Respiratory pH is >7. A pH of 3 confirms gastric placement.",
    category: "Procedures"
  },
  {
    id: "proc-9",
    type: "term",
    question: "Suction Technique",
    answer: "Hyperoxygenate before suctioning. Insert catheter without suction applied. Apply intermittent suction on withdrawal using rotating motion. Maximum 10-15 seconds per pass. Allow recovery breaths between passes.",
    category: "Procedures"
  },
  {
    id: "proc-10",
    type: "question",
    question: "A client's IV site is cool, pale, and swollen with no blood return. Assessment?",
    options: ["Phlebitis", "Infiltration", "Extravasation", "Thrombosis"],
    correctIndex: 1,
    answer: "Infiltration is non-vesicant fluid leaking into surrounding tissue. Cool, pale, swollen site is the hallmark. Discontinue IV and apply warm compress (cold for vesicant extravasation).",
    category: "Procedures"
  },
  {
    id: "proc-11",
    type: "term",
    question: "Ventilator Modes",
    answer: "AC (Assist-Control): delivers set Vt with every breath. SIMV: set rate with spontaneous breaths at patient's own Vt. PSV: augments spontaneous breaths only. Used for weaning.",
    category: "Procedures"
  },
  {
    id: "proc-12",
    type: "question",
    question: "A mechanically ventilated patient has high-pressure alarm. Most likely cause?",
    options: ["Disconnected tubing", "Cuff leak", "Mucus plug or biting on tube", "Low tidal volume"],
    correctIndex: 2,
    answer: "High-pressure alarm = obstruction or resistance. Common causes: mucus plug, biting, kinking, bronchospasm, pneumothorax. Low-pressure alarm = disconnection or leak.",
    category: "Procedures"
  },
  {
    id: "proc-13",
    type: "term",
    question: "IV Gauge Selection",
    answer: "14-16G: trauma/rapid fluid resuscitation. 18G: blood transfusion/surgery. 20G: most infusions. 22-24G: elderly/pediatric/fragile veins. Larger gauge number = smaller catheter.",
    category: "Procedures"
  },
  {
    id: "proc-14",
    type: "question",
    question: "During tracheostomy care, what should always be kept at the bedside?",
    options: ["Extra gauze only", "Spare tracheostomy tube and obturator", "Suction equipment only", "Oxygen tank"],
    correctIndex: 1,
    answer: "A spare tracheostomy tube (same size AND one size smaller) plus the obturator must be at bedside at all times in case of accidental decannulation.",
    category: "Procedures"
  },
  {
    id: "proc-15",
    type: "term",
    question: "CSF Analysis",
    answer: "Normal: clear, colorless, glucose 50-80, protein 15-45, WBC <5. Bacterial meningitis: turbid, low glucose, high protein, PMNs. Viral: clear, normal glucose, lymphocytes. SAH: xanthochromia.",
    category: "Procedures"
  },
  {
    id: "fund-1",
    type: "question",
    question: "Which phase of the nursing process involves formulating measurable, patient-centered goals?",
    options: ["Assessment", "Diagnosis", "Planning", "Implementation"],
    correctIndex: 2,
    answer: "Planning is the third phase of the nursing process (ADPIE) where the nurse develops SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) and selects evidence-based interventions.",
    category: "Fundamentals"
  },
  {
    id: "fund-2",
    type: "question",
    question: "Which vital sign is the MOST sensitive early predictor of clinical deterioration?",
    options: ["Blood pressure", "Temperature", "Respiratory rate", "Heart rate"],
    correctIndex: 2,
    answer: "Respiratory rate is consistently the most sensitive and earliest predictor of clinical deterioration, often increasing hours before other vital signs change. Tachypnea (RR > 24) warrants immediate assessment.",
    category: "Fundamentals"
  },
  {
    id: "fund-3",
    type: "term",
    question: "High-Alert Medications (A PINCH)",
    answer: "A PINCH: Anticoagulants, Potassium (IV), Insulin, Narcotics/opioids, Chemotherapy, Heparin. These medications require independent double-check by two qualified nurses before administration due to heightened risk of significant patient harm.",
    category: "Fundamentals"
  },
  {
    id: "fund-4",
    type: "question",
    question: "A patient with C. difficile requires which hand hygiene method?",
    options: ["Alcohol-based hand rub", "Soap and water with friction", "Hand sanitizer gel", "Any method is acceptable"],
    correctIndex: 1,
    answer: "C. difficile forms spores that are resistant to alcohol. Only soap and water with physical friction can remove the spores from hands. This is the ONE major exception to using alcohol-based hand rub.",
    category: "Fundamentals"
  },
  {
    id: "fund-5",
    type: "term",
    question: "SBAR Communication Framework",
    answer: "Situation: identify yourself, patient, concern. Background: relevant history and current treatment. Assessment: your clinical judgment of the problem. Recommendation: what you think needs to happen. Always include a specific recommendation rather than just reporting data.",
    category: "Fundamentals"
  },
  {
    id: "fund-6",
    type: "question",
    question: "What is the MOST accurate method for assessing fluid balance?",
    options: ["Intake and output records", "Daily weights", "Skin turgor assessment", "Blood pressure monitoring"],
    correctIndex: 1,
    answer: "Daily weights are the most accurate indicator. 1 kg weight change = approximately 1 liter of fluid. Weigh at the same time, same scale, same clothing daily. I&O is important but prone to recording errors.",
    category: "Fundamentals"
  },
  {
    id: "fund-7",
    type: "term",
    question: "Third-Spacing",
    answer: "Pathological shift of fluid from intravascular space into non-functional interstitial/transcellular compartments. Creates a clinical paradox: patient appears edematous but is intravascularly depleted (hypotensive, tachycardic). Common in burns, pancreatitis, sepsis, liver failure.",
    category: "Fundamentals"
  },
  {
    id: "fund-8",
    type: "question",
    question: "Which type of precaution requires a fit-tested N95 respirator?",
    options: ["Standard precautions", "Contact precautions", "Droplet precautions", "Airborne precautions"],
    correctIndex: 3,
    answer: "Airborne precautions (TB, measles, varicella) require N95 respirator, negative pressure room, and closed door. Airborne particles are small enough to remain suspended and travel long distances. A surgical mask is inadequate.",
    category: "Fundamentals"
  },
  {
    id: "fund-9",
    type: "term",
    question: "Rights of Medication Administration",
    answer: "Expanded rights: Right Patient (2 identifiers), Right Drug (3 label checks), Right Dose (verify calculations), Right Route (PO/IV/IM/SubQ), Right Time (within window), Right Documentation (chart after giving), Right Reason, Right Response.",
    category: "Fundamentals"
  },
  {
    id: "fund-10",
    type: "question",
    question: "A nurse discovers she forgot to document a medication given 2 hours ago. The correct action is:",
    options: ["Add documentation to the earlier time slot", "Make a late entry with current date/time referencing actual event time", "Do not document since it is too late", "Ask another nurse to document it"],
    correctIndex: 1,
    answer: "A late entry should be made using the current date and time, clearly labeled as 'Late Entry,' and referencing the actual date and time the event occurred. Never backdate entries or pre-chart medications.",
    category: "Fundamentals"
  },
  {
    id: "fund-11",
    type: "term",
    question: "PPE Doffing Sequence",
    answer: "Correct removal order: Gloves (most contaminated) → Hand hygiene → Gown → Eye protection → Mask → Hand hygiene. Doffing is the highest-risk moment for self-contamination. Remove gloves FIRST, perform hand hygiene between each step.",
    category: "Fundamentals"
  },
  {
    id: "del-1",
    type: "question",
    question: "A patient has active external bleeding AND is making snoring respirations. What is the priority?",
    options: ["Apply pressure to the bleeding site", "Open the airway", "Start an IV for fluid resuscitation", "Assess blood pressure"],
    correctIndex: 1,
    answer: "Airway ALWAYS comes before circulation in ABC prioritization. The snoring sounds indicate a partially obstructed airway. Without a patent airway, all other interventions are futile.",
    category: "Delegation"
  },
  {
    id: "del-2",
    type: "term",
    question: "Maslow's Hierarchy in Nursing Prioritization",
    answer: "Applied to clinical nursing: Physiological needs (ABCs, oxygen, perfusion) → Safety needs (fall prevention, infection control) → Love/Belonging (family support) → Esteem (independence, dignity) → Self-actualization (health education, discharge planning). Always address lower levels first.",
    category: "Delegation"
  },
  {
    id: "del-3",
    type: "question",
    question: "Which patient should the nurse see FIRST?",
    options: ["Patient with chronic back pain requesting medication", "Post-op patient with expected moderate incision pain", "Patient with new-onset stridor after eating shellfish", "Patient requesting discharge paperwork"],
    correctIndex: 2,
    answer: "Stridor after shellfish suggests anaphylaxis with airway compromise. Airway (A in ABCs) always takes priority over circulation, pain, or administrative tasks. This is a life-threatening emergency.",
    category: "Delegation"
  },
  {
    id: "del-4",
    type: "term",
    question: "Stable vs Unstable Patient",
    answer: "STABLE: Expected findings, predictable course, vital signs within baseline. UNSTABLE: New-onset symptoms, worsening trends despite treatment, vital signs deviating dangerously, altered LOC. The key word is 'NEW': new findings = unstable = priority.",
    category: "Delegation"
  },
  {
    id: "del-5",
    type: "question",
    question: "Which task can be SAFELY delegated to a UAP (unlicensed assistive personnel)?",
    options: ["Performing an initial patient assessment", "Administering oral medications", "Measuring vital signs on a stable patient", "Evaluating medication effectiveness"],
    correctIndex: 2,
    answer: "UAPs can measure vital signs on stable patients, perform ADLs, measure I&O, and collect specimens. They CANNOT assess, evaluate, administer medications, or provide initial education: these require clinical nursing judgment.",
    category: "Delegation"
  },
  {
    id: "del-6",
    type: "term",
    question: "Five Rights of Delegation",
    answer: "Right Task (within delegate's scope), Right Circumstance (patient is stable/predictable), Right Person (appropriate training and licensure), Right Direction (clear instructions with reporting parameters), Right Supervision (follow-up and evaluation). The RN retains ACCOUNTABILITY.",
    category: "Delegation"
  },
  {
    id: "del-7",
    type: "question",
    question: "A nurse calls a physician about a deteriorating patient. The physician says 'just continue monitoring.' The nurse remains concerned. The next step is:",
    options: ["Follow the order and continue monitoring", "Escalate through the chain of command", "Document and wait until next shift", "Call the patient's family"],
    correctIndex: 1,
    answer: "When the initial provider response does not address the nurse's clinical concern, the nurse is legally and ethically obligated to escalate through the chain of command (charge nurse → supervisor → medical director).",
    category: "Delegation"
  },
  {
    id: "del-8",
    type: "term",
    question: "Post-Op Fever Mnemonic: Wind, Water, Wound, Walking, Wonder Drugs",
    answer: "Wind (atelectasis, days 1-2), Water (UTI, days 3-5), Wound (infection, days 5-7), Walking (DVT/PE, days 5-7), Wonder drugs (drug fever, anytime). This temporal framework guides assessment of post-operative fever causes.",
    category: "Delegation"
  },
  {
    id: "del-9",
    type: "question",
    question: "What is the MOST common post-operative complication?",
    options: ["Hemorrhage", "Pulmonary embolism", "Atelectasis", "Wound infection"],
    correctIndex: 2,
    answer: "Atelectasis occurs in up to 90% of surgical patients due to shallow breathing, pain-limited inspiratory effort, and immobility. Prevention: incentive spirometry every 1-2 hours while awake and early ambulation.",
    category: "Delegation"
  },
  {
    id: "del-10",
    type: "question",
    question: "Post-op bowel is protruding through the abdominal incision. Immediate action:",
    options: ["Push the bowel back in and apply sterile dressing", "Cover with sterile saline-moistened gauze, position supine with knees bent, call surgeon STAT", "Apply dry gauze and send to OR", "Apply abdominal binder tightly"],
    correctIndex: 1,
    answer: "Evisceration: NEVER push organs back in. Cover with sterile saline-moistened gauze to prevent desiccation, position supine with knees bent to reduce tension, keep NPO, and notify surgeon immediately.",
    category: "Delegation"
  },
  {
    id: "del-11",
    type: "term",
    question: "Chain of Command Escalation",
    answer: "Bedside Nurse → Charge Nurse → Nursing Supervisor → Medical Director → Chief of Staff. Nurses are legally obligated to escalate when patient safety is at risk and the initial provider response is inadequate. Using the chain of command is a professional obligation, not insubordination.",
    category: "Delegation"
  },
  {
    id: "resp-1",
    type: "question",
    question: "A client with COPD has an oxygen saturation of 88%. Which oxygen delivery device is MOST appropriate?",
    options: ["Non-rebreather mask at 15 L/min", "Nasal cannula at 2 L/min", "Venturi mask at 60%", "Simple face mask at 10 L/min"],
    correctIndex: 1,
    answer: "COPD clients rely on hypoxic drive for breathing. High-flow oxygen suppresses this drive. Target SpO2 88-92% using low-flow nasal cannula (1-3 L/min) to avoid respiratory depression.",
    category: "Respiratory"
  },
  {
    id: "resp-2",
    type: "term",
    question: "Barrel Chest",
    answer: "An increased anteroposterior (AP) diameter of the chest, characteristic of chronic COPD/emphysema. Caused by air trapping and lung hyperinflation. The AP diameter approaches the lateral diameter (normally AP:lateral is 1:2, in barrel chest approaches 1:1).",
    category: "Respiratory"
  },
  {
    id: "resp-3",
    type: "question",
    question: "A client post-thoracotomy has a chest tube. Continuous bubbling is observed in the water seal chamber. What does this indicate?",
    options: ["Normal expected finding", "Air leak in the system", "Adequate lung re-expansion", "Need for chest tube removal"],
    correctIndex: 1,
    answer: "Continuous bubbling in the water seal chamber indicates an air leak. Check all connections for tightness. If connections are secure, the leak may be at the insertion site or from a bronchopleural fistula. Notify the provider.",
    category: "Respiratory"
  },
  {
    id: "resp-4",
    type: "term",
    question: "Pursed-Lip Breathing",
    answer: "A technique where the client inhales through the nose and exhales slowly through pursed lips (as if whistling). Creates back-pressure that keeps airways open longer, prevents air trapping, and improves gas exchange. Key intervention for COPD and emphysema patients.",
    category: "Respiratory"
  },
  {
    id: "resp-5",
    type: "question",
    question: "Which ABG values indicate respiratory acidosis?",
    options: ["pH 7.50, PaCO2 30, HCO3 24", "pH 7.30, PaCO2 55, HCO3 24", "pH 7.30, PaCO2 40, HCO3 18", "pH 7.50, PaCO2 40, HCO3 30"],
    correctIndex: 1,
    answer: "Respiratory acidosis: low pH (<7.35) with high PaCO2 (>45). The HCO3 is normal (22-26), indicating uncompensated. Causes include COPD, hypoventilation, airway obstruction, and respiratory depression from opioids.",
    category: "Respiratory"
  },
  {
    id: "resp-6",
    type: "question",
    question: "A nurse auscultates high-pitched wheezing on expiration in a client with asthma. What does this indicate?",
    options: ["Fluid in the alveoli", "Bronchospasm and airway narrowing", "Pleural friction rub", "Upper airway obstruction"],
    correctIndex: 1,
    answer: "Expiratory wheezing indicates bronchospasm and narrowed airways, characteristic of asthma. Administer bronchodilator (albuterol) as ordered. Absence of wheezing in a distressed asthma patient may indicate severe obstruction (silent chest).",
    category: "Respiratory"
  },
  {
    id: "resp-7",
    type: "term",
    question: "Incentive Spirometry",
    answer: "A device used to encourage deep breathing and prevent atelectasis, especially post-operatively. The client inhales slowly through the mouthpiece, aiming to raise the indicator to the target volume, then holds the breath for 3-5 seconds. Perform 10 times per hour while awake.",
    category: "Respiratory"
  },
  {
    id: "resp-8",
    type: "question",
    question: "A client with a pulmonary embolism suddenly becomes dyspneic and hypotensive. The priority nursing action is:",
    options: ["Elevate the head of bed and administer oxygen", "Place in left lateral position and prepare heparin", "Position in high Fowler's, administer O2, notify provider STAT", "Encourage coughing and deep breathing"],
    correctIndex: 2,
    answer: "PE is a medical emergency. Position in high Fowler's to maximize lung expansion, administer high-flow oxygen, obtain IV access, and notify the provider STAT. Anticipate anticoagulation (heparin) or thrombolytics for massive PE.",
    category: "Respiratory"
  },
  {
    id: "neuro-1",
    type: "question",
    question: "A client presents with sudden unilateral facial drooping, arm weakness, and slurred speech. The nurse should FIRST:",
    options: ["Administer aspirin 325 mg", "Obtain a CT scan of the head", "Note the time of symptom onset", "Start an IV of normal saline"],
    correctIndex: 2,
    answer: "Time of symptom onset (or 'last known well' time) is critical for determining tPA eligibility (within 3-4.5 hours). This must be established FIRST before any intervention. Use the FAST assessment: Face, Arms, Speech, Time.",
    category: "Neurological"
  },
  {
    id: "neuro-2",
    type: "term",
    question: "Cushing's Triad",
    answer: "Three ominous signs of increased intracranial pressure (ICP): 1) Hypertension (widening pulse pressure), 2) Bradycardia, 3) Irregular respirations. This is a late sign indicating brainstem herniation is imminent. Requires immediate intervention to reduce ICP.",
    category: "Neurological"
  },
  {
    id: "neuro-3",
    type: "question",
    question: "A client with a spinal cord injury at C4 is at HIGHEST risk for which complication?",
    options: ["Urinary retention", "Autonomic dysreflexia", "Respiratory failure requiring mechanical ventilation", "Paralytic ileus"],
    correctIndex: 2,
    answer: "Injuries at C4 and above affect the phrenic nerve (C3-C5), which innervates the diaphragm. Without diaphragm function, the client cannot breathe independently and requires mechanical ventilation. Remember: 'C3, 4, 5 keep the diaphragm alive.'",
    category: "Neurological"
  },
  {
    id: "neuro-4",
    type: "term",
    question: "Decorticate vs Decerebrate Posturing",
    answer: "DECORTICATE (flexion): Arms flexed, fists clenched, legs extended. Indicates damage above the brainstem (cortical). Think 'COR' = toward the CORE. DECEREBRATE (extension): Arms extended, internally rotated, legs extended. Indicates brainstem damage. Decerebrate is worse than decorticate.",
    category: "Neurological"
  },
  {
    id: "neuro-5",
    type: "question",
    question: "A client is experiencing a tonic-clonic seizure. What is the priority nursing action?",
    options: ["Insert a padded tongue blade", "Restrain the client to prevent injury", "Turn the client to the side and protect the head", "Administer oral diazepam immediately"],
    correctIndex: 2,
    answer: "During a seizure: ensure safety by turning to the side (lateral position) to prevent aspiration, protect the head, remove nearby hazards, note the time. NEVER insert anything into the mouth or restrain the client. Time the seizure duration.",
    category: "Neurological"
  },
  {
    id: "neuro-6",
    type: "term",
    question: "Glasgow Coma Scale (GCS)",
    answer: "A neurological assessment tool scoring Eye opening (1-4), Verbal response (1-5), and Motor response (1-6). Total range: 3-15. Score ≤8 = severe brain injury (coma, intubation needed). Score 9-12 = moderate. Score 13-15 = mild. Best response is used for scoring.",
    category: "Neurological"
  },
  {
    id: "neuro-7",
    type: "question",
    question: "Which cranial nerve is assessed by asking the client to shrug their shoulders against resistance?",
    options: ["CN VII (Facial)", "CN X (Vagus)", "CN XI (Accessory)", "CN XII (Hypoglossal)"],
    correctIndex: 2,
    answer: "CN XI (Spinal Accessory) innervates the trapezius and sternocleidomastoid muscles. Test by asking the client to shrug shoulders against resistance and turn head against resistance. Weakness may indicate neck surgery damage.",
    category: "Neurological"
  },
  {
    id: "endo-1",
    type: "question",
    question: "A client with DKA presents with Kussmaul respirations. This breathing pattern is the body's attempt to:",
    options: ["Increase oxygen delivery to tissues", "Compensate for metabolic acidosis by blowing off CO2", "Reduce intracranial pressure", "Increase bicarbonate production"],
    correctIndex: 1,
    answer: "Kussmaul respirations (deep, rapid breathing) are a compensatory mechanism in metabolic acidosis (DKA). By increasing respiratory rate and depth, the body exhales more CO2, which raises blood pH toward normal.",
    category: "Endocrine"
  },
  {
    id: "endo-2",
    type: "term",
    question: "Somogyi Effect vs Dawn Phenomenon",
    answer: "SOMOGYI: Nighttime hypoglycemia triggers counter-regulatory hormones, causing rebound hyperglycemia in the morning. Fix: decrease evening insulin or add bedtime snack. DAWN: Normal early-morning surge of growth hormone and cortisol causes hyperglycemia. Fix: increase insulin or adjust timing.",
    category: "Endocrine"
  },
  {
    id: "endo-3",
    type: "question",
    question: "A client post-thyroidectomy reports tingling around the mouth and fingertips. The nurse should FIRST:",
    options: ["Administer calcium gluconate IV", "Check serum calcium level and notify the surgeon", "Position the client supine", "Apply warm compresses to the neck"],
    correctIndex: 1,
    answer: "Tingling (paresthesia) around the mouth and extremities post-thyroidectomy suggests hypocalcemia from accidental parathyroid removal. Check calcium level immediately and notify the surgeon. Positive Chvostek's and Trousseau's signs confirm hypocalcemia.",
    category: "Endocrine"
  },
  {
    id: "endo-4",
    type: "term",
    question: "Chvostek's Sign vs Trousseau's Sign",
    answer: "Both indicate hypocalcemia. CHVOSTEK'S: Tapping the facial nerve (anterior to the ear) causes ipsilateral facial muscle twitching. TROUSSEAU'S: Inflating a BP cuff above systolic pressure for 3 minutes causes carpal spasm (hand and wrist flexion). Trousseau's is more specific for hypocalcemia.",
    category: "Endocrine"
  },
  {
    id: "endo-5",
    type: "question",
    question: "A client with Addison's disease is admitted with a crisis. Which finding does the nurse expect?",
    options: ["Hypertension and hyperglycemia", "Hypotension, hyperkalemia, and hypoglycemia", "Hypertension and hypokalemia", "Weight gain and edema"],
    correctIndex: 1,
    answer: "Addisonian crisis: adrenal insufficiency causes decreased cortisol and aldosterone. This leads to severe hypotension (lack of cortisol), hyperkalemia (lack of aldosterone → sodium wasted, potassium retained), and hypoglycemia. Treatment: IV hydrocortisone and fluids.",
    category: "Endocrine"
  },
  {
    id: "endo-6",
    type: "term",
    question: "Insulin Types and Onset",
    answer: "RAPID-ACTING (lispro/aspart): onset 15 min, peak 1-2 hr, given with meals. SHORT-ACTING (regular): onset 30-60 min, peak 2-4 hr, only insulin given IV. INTERMEDIATE (NPH): onset 1-2 hr, peak 4-12 hr, cloudy appearance. LONG-ACTING (glargine/detemir): onset 1-2 hr, no peak, 24 hr duration, NEVER mix.",
    category: "Endocrine"
  },
  {
    id: "pharm-1",
    type: "question",
    question: "A client on warfarin has an INR of 5.2 with no active bleeding. The nurse should anticipate:",
    options: ["Administering protamine sulfate", "Holding warfarin and monitoring", "Administering vitamin K and holding warfarin", "Continuing the current dose"],
    correctIndex: 2,
    answer: "INR >4 without bleeding: hold warfarin and administer low-dose oral vitamin K. Therapeutic INR is 2-3 (2.5-3.5 for mechanical valves). INR >5 = high bleeding risk. Protamine sulfate reverses heparin, not warfarin.",
    category: "Pharmacology"
  },
  {
    id: "pharm-2",
    type: "term",
    question: "Antidotes for Common Drug Toxicities",
    answer: "Heparin → Protamine sulfate. Warfarin → Vitamin K (phytonadione). Benzodiazepines → Flumazenil (Romazicon). Opioids → Naloxone (Narcan). Acetaminophen → N-acetylcysteine (Mucomyst). Digoxin → Digoxin immune Fab (Digibind). Magnesium sulfate → Calcium gluconate.",
    category: "Pharmacology"
  },
  {
    id: "pharm-3",
    type: "question",
    question: "A client is prescribed metoprolol (Lopressor). Before administering, the nurse should check:",
    options: ["Blood glucose level", "Heart rate and blood pressure", "Serum potassium", "Respiratory rate"],
    correctIndex: 1,
    answer: "Metoprolol is a beta-blocker. Hold and notify provider if HR <60 bpm or SBP <100 mmHg. Beta-blockers decrease heart rate and blood pressure. Remember: drugs ending in '-olol' are beta-blockers.",
    category: "Pharmacology"
  },
  {
    id: "pharm-4",
    type: "term",
    question: "Drugs That Require Trough Levels",
    answer: "Trough levels are drawn JUST BEFORE the next dose (at the drug's lowest concentration). Common drugs requiring trough monitoring: Vancomycin (15-20 mcg/mL), Gentamicin (traditional: <2 mcg/mL), Phenytoin (10-20 mcg/mL), Lithium (0.6-1.2 mEq/L), Digoxin (0.5-2.0 ng/mL).",
    category: "Pharmacology"
  },
  {
    id: "pharm-5",
    type: "question",
    question: "Which medication should a nurse question if prescribed to a client with a potassium level of 5.8 mEq/L?",
    options: ["Furosemide (Lasix)", "Spironolactone (Aldactone)", "Hydrochlorothiazide (HCTZ)", "Mannitol"],
    correctIndex: 1,
    answer: "Spironolactone is a potassium-SPARING diuretic. With K+ of 5.8 (hyperkalemia), giving a potassium-sparing drug is dangerous and could cause fatal cardiac arrhythmias. Question the order. Furosemide and HCTZ both waste potassium.",
    category: "Pharmacology"
  },
  {
    id: "pharm-6",
    type: "question",
    question: "A client receiving gentamicin complains of tinnitus and dizziness. The nurse should:",
    options: ["Continue the medication and reassure the client", "Hold the medication and notify the provider immediately", "Administer diphenhydramine for the dizziness", "Increase the infusion rate"],
    correctIndex: 1,
    answer: "Tinnitus and dizziness are signs of ototoxicity, a serious adverse effect of aminoglycosides (gentamicin, tobramycin). Hold the medication immediately and notify the provider. Aminoglycosides are also nephrotoxic — monitor BUN and creatinine.",
    category: "Pharmacology"
  },
  {
    id: "mh-1",
    type: "question",
    question: "A client taking lithium presents with coarse tremors, vomiting, and confusion. The lithium level is 2.5 mEq/L. The nurse should FIRST:",
    options: ["Give the next scheduled dose", "Hold the lithium and notify the provider STAT", "Administer activated charcoal", "Encourage oral fluid intake"],
    correctIndex: 1,
    answer: "Lithium level >1.5 mEq/L is toxic (therapeutic: 0.6-1.2 mEq/L). Signs include coarse tremors, vomiting, diarrhea, confusion, and seizures. Hold the drug, maintain hydration (IV NS), and anticipate hemodialysis for severe toxicity. Lithium has a narrow therapeutic index.",
    category: "Mental Health"
  },
  {
    id: "mh-2",
    type: "term",
    question: "Neuroleptic Malignant Syndrome (NMS)",
    answer: "A life-threatening reaction to antipsychotic medications characterized by: high Fever (>104°F), severe muscle Rigidity (lead-pipe), Altered mental status, and autonomic instability (tachycardia, diaphoresis, labile BP). Treatment: stop the antipsychotic, IV dantrolene, bromocriptine. Mortality: 10-20%.",
    category: "Mental Health"
  },
  {
    id: "mh-3",
    type: "question",
    question: "A suicidal client suddenly appears calm and gives away personal belongings. The nurse should:",
    options: ["Consider this improvement and lower the observation level", "Recognize this as increased suicide risk and increase monitoring", "Discharge the client as they seem better", "Document the improved mood"],
    correctIndex: 1,
    answer: "A sudden mood improvement in a suicidal client is a RED FLAG — it may indicate the client has made a plan and feels at peace with their decision. This requires INCREASED observation (1:1 monitoring), not decreased. Never lower vigilance based on sudden calmness alone.",
    category: "Mental Health"
  },
  {
    id: "mh-4",
    type: "term",
    question: "Therapeutic Communication Techniques",
    answer: "EFFECTIVE: Open-ended questions, reflection, restating, silence, focusing, summarizing, offering self. NONTHERAPEUTIC: Giving advice, false reassurance, changing the subject, asking 'why,' belittling feelings, approval/disapproval. The goal is to help the client explore feelings, not to solve their problems.",
    category: "Mental Health"
  },
  {
    id: "mh-5",
    type: "question",
    question: "Which medication requires monitoring for agranulocytosis with weekly blood draws?",
    options: ["Haloperidol (Haldol)", "Clozapine (Clozaril)", "Risperidone (Risperdal)", "Olanzapine (Zyprexa)"],
    correctIndex: 1,
    answer: "Clozapine carries a 1-2% risk of agranulocytosis (dangerously low WBC/ANC). Mandatory monitoring: weekly CBC for first 6 months, then biweekly. If ANC <1500, discontinue immediately. Clozapine is reserved for treatment-resistant schizophrenia.",
    category: "Mental Health"
  },
  {
    id: "mat-1",
    type: "question",
    question: "A laboring client's fetal heart rate tracing shows late decelerations. The nurse should FIRST:",
    options: ["Prepare for cesarean section", "Turn the client to the left lateral position", "Administer oxytocin to speed delivery", "Apply internal fetal scalp electrode"],
    correctIndex: 1,
    answer: "Late decelerations indicate uteroplacental insufficiency (decreased oxygen to fetus). Immediate interventions: turn to left lateral position (improves uterine blood flow), administer oxygen, increase IV fluids, STOP oxytocin if infusing, and notify provider.",
    category: "Maternity"
  },
  {
    id: "mat-2",
    type: "term",
    question: "APGAR Scoring",
    answer: "Assessed at 1 and 5 minutes after birth. Each category scored 0-2: Appearance (color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), Respiration (respiratory effort). Score 7-10 = normal. Score 4-6 = moderately depressed, needs stimulation. Score 0-3 = severely depressed, needs resuscitation.",
    category: "Maternity"
  },
  {
    id: "mat-3",
    type: "question",
    question: "A client at 32 weeks gestation presents with painless, bright red vaginal bleeding. The nurse suspects:",
    options: ["Placental abruption", "Placenta previa", "Bloody show", "Uterine rupture"],
    correctIndex: 1,
    answer: "Placenta previa = painless, bright red bleeding (placenta covers cervical os). Placental abruption = painful, dark red bleeding with rigid abdomen. Key: NEVER perform a vaginal exam with suspected placenta previa as it can cause massive hemorrhage.",
    category: "Maternity"
  },
  {
    id: "mat-4",
    type: "term",
    question: "Preeclampsia Warning Signs",
    answer: "BP ≥140/90 after 20 weeks with proteinuria. Warning signs of progression to eclampsia: severe headache (frontal/occipital), visual disturbances (blurred vision, scotomata), epigastric/RUQ pain (hepatic distension), hyperreflexia with clonus. Treatment: magnesium sulfate (seizure prevention), antihypertensives.",
    category: "Maternity"
  },
  {
    id: "mat-5",
    type: "question",
    question: "During magnesium sulfate infusion for preeclampsia, the nurse assesses respirations at 10/min, absent DTRs, and urine output of 20 mL/hr. The nurse should:",
    options: ["Continue the infusion and monitor", "Stop the infusion and administer calcium gluconate", "Increase the infusion rate", "Administer naloxone"],
    correctIndex: 1,
    answer: "Signs of magnesium toxicity: respiratory depression (<12/min), absent deep tendon reflexes, decreased urine output (<30 mL/hr), cardiac arrest. STOP the infusion immediately and administer the antidote: calcium gluconate 10% IV push.",
    category: "Maternity"
  },
  {
    id: "renal-1",
    type: "question",
    question: "A client with AKI has a potassium level of 6.5 mEq/L. Which ECG change is expected?",
    options: ["Flattened T waves", "Prolonged QT interval", "Tall, peaked T waves", "ST elevation"],
    correctIndex: 2,
    answer: "Hyperkalemia (>5.0 mEq/L) causes tall, peaked T waves on ECG. Progression: peaked T waves → widened QRS → absent P waves → sine wave pattern → ventricular fibrillation. Emergency treatment: IV calcium gluconate (cardiac protection), insulin + glucose, kayexalate, dialysis.",
    category: "Renal"
  },
  {
    id: "renal-2",
    type: "term",
    question: "AV Fistula vs AV Graft",
    answer: "AV FISTULA: Surgically connects artery to vein (preferred for hemodialysis). Matures in 2-4 months. Feel for thrill (vibration), listen for bruit (whooshing). NEVER take BP, draw blood, or start IVs in that arm. AV GRAFT: Synthetic tube connecting artery to vein. Matures in 2-4 weeks but has higher infection/clotting risk.",
    category: "Renal"
  },
  {
    id: "renal-3",
    type: "question",
    question: "A client on hemodialysis complains of muscle cramps and hypotension during treatment. The nurse should:",
    options: ["Increase the dialysis flow rate", "Administer normal saline bolus and reduce ultrafiltration rate", "Position the client in Trendelenburg permanently", "Discontinue dialysis immediately"],
    correctIndex: 1,
    answer: "Muscle cramps and hypotension during dialysis are caused by rapid fluid removal. Administer NS bolus (100-250 mL), reduce the ultrafiltration rate, and position the client supine. These are common intradialytic complications.",
    category: "Renal"
  },
  {
    id: "renal-4",
    type: "term",
    question: "Stages of Chronic Kidney Disease",
    answer: "Stage 1: GFR ≥90 (normal function, kidney damage present). Stage 2: GFR 60-89 (mild decrease). Stage 3a: GFR 45-59. Stage 3b: GFR 30-44. Stage 4: GFR 15-29 (severe, prepare for dialysis/transplant). Stage 5: GFR <15 (end-stage, dialysis or transplant required). Monitor with serum creatinine and GFR.",
    category: "Renal"
  },
  {
    id: "ic-1",
    type: "question",
    question: "A client is admitted with suspected tuberculosis. Which type of isolation precautions should the nurse implement?",
    options: ["Contact precautions", "Droplet precautions", "Airborne precautions with N95 respirator", "Standard precautions only"],
    correctIndex: 2,
    answer: "TB requires AIRBORNE precautions: private negative-pressure room, N95 respirator (or PAPR) for staff, surgical mask on patient during transport. TB particles remain suspended in air for hours. Standard surgical masks do NOT protect against airborne pathogens.",
    category: "Infection Control"
  },
  {
    id: "ic-2",
    type: "term",
    question: "Standard vs Transmission-Based Precautions",
    answer: "STANDARD: Applied to ALL patients regardless of diagnosis. Includes hand hygiene, PPE as needed, sharps disposal, respiratory hygiene. TRANSMISSION-BASED (added to standard): Contact (gown + gloves — MRSA, C. diff), Droplet (surgical mask — influenza, meningitis), Airborne (N95 + negative pressure — TB, measles, varicella).",
    category: "Infection Control"
  },
  {
    id: "ic-3",
    type: "question",
    question: "A nurse sustains a needlestick injury from a patient with unknown HIV status. The FIRST action is to:",
    options: ["Report to the supervisor immediately", "Wash the site thoroughly with soap and water", "Apply a bandage and continue working", "Start prophylactic antibiotics"],
    correctIndex: 1,
    answer: "FIRST: Wash the wound immediately with soap and water (do not squeeze). THEN report to the supervisor and occupational health. Baseline testing and post-exposure prophylaxis (PEP) should begin within 1-2 hours if indicated. Document the incident.",
    category: "Infection Control"
  },
  {
    id: "ic-4",
    type: "term",
    question: "C. difficile Infection Control",
    answer: "C. difficile forms SPORES that are resistant to alcohol-based hand sanitizers. Requires: SOAP AND WATER hand hygiene (mandatory), contact precautions (gown + gloves), dedicated equipment, bleach-based environmental cleaning. Triggered by antibiotic use (disrupts normal flora). Key symptom: watery, foul-smelling diarrhea.",
    category: "Infection Control"
  },
  {
    id: "gi-1",
    type: "question",
    question: "A client with cirrhosis develops hepatic encephalopathy. Which medication does the nurse expect to administer?",
    options: ["Furosemide (Lasix)", "Lactulose", "Metoclopramide (Reglan)", "Pantoprazole (Protonix)"],
    correctIndex: 1,
    answer: "Lactulose traps ammonia in the gut and promotes its excretion through stool. Hepatic encephalopathy is caused by elevated ammonia (liver can't convert it to urea). Goal: 2-3 soft stools/day. Monitor for dehydration and hypokalemia.",
    category: "Gastrointestinal"
  },
  {
    id: "gi-2",
    type: "term",
    question: "Upper vs Lower GI Bleed",
    answer: "UPPER GI (above ligament of Treitz): hematemesis (vomiting blood), coffee-ground emesis, melena (black tarry stool). Sources: esophageal varices, peptic ulcer, Mallory-Weiss tear. LOWER GI: hematochezia (bright red blood per rectum). Sources: diverticulosis, hemorrhoids, colorectal cancer, IBD.",
    category: "Gastrointestinal"
  },
  {
    id: "gi-3",
    type: "question",
    question: "A client with a nasogastric tube has 800 mL of green drainage over 8 hours. Which electrolyte imbalance is the nurse most concerned about?",
    options: ["Hyperkalemia", "Metabolic alkalosis from HCl loss", "Respiratory acidosis", "Hypernatremia"],
    correctIndex: 1,
    answer: "NG tube suctioning removes hydrochloric acid (HCl) from the stomach, leading to metabolic alkalosis (loss of H+ and Cl-). Also leads to hypokalemia and hyponatremia. Monitor electrolytes and replace losses as ordered.",
    category: "Gastrointestinal"
  },
  {
    id: "gi-4",
    type: "term",
    question: "Pancreatitis Assessment",
    answer: "Acute pancreatitis signs: severe epigastric pain radiating to the back, worse after eating. Elevated amylase and lipase (lipase more specific). Grey Turner's sign (flank bruising) and Cullen's sign (periumbilical bruising) indicate hemorrhagic pancreatitis. Treatment: NPO, IV fluids, pain management, NG tube if vomiting.",
    category: "Gastrointestinal"
  },
  {
    id: "gi-5",
    type: "question",
    question: "A client with Crohn's disease is at HIGHEST risk for which nutritional deficiency?",
    options: ["Vitamin C", "Vitamin B12 and folic acid", "Vitamin A", "Vitamin E"],
    correctIndex: 1,
    answer: "Crohn's disease commonly affects the terminal ileum, where vitamin B12 and bile salts are absorbed. Chronic inflammation leads to malabsorption of B12, folic acid, fat-soluble vitamins, and iron. Monitor for anemia and supplementation needs.",
    category: "Gastrointestinal"
  },
  {
    id: "fe-1",
    type: "question",
    question: "A client with hyponatremia (Na+ 118 mEq/L) receives 3% hypertonic saline. The nurse should monitor for:",
    options: ["Hyperkalemia", "Osmotic demyelination syndrome from too-rapid correction", "Metabolic acidosis", "Pulmonary embolism"],
    correctIndex: 1,
    answer: "Sodium must be corrected slowly (no more than 8-12 mEq/L in 24 hours). Too-rapid correction risks osmotic demyelination syndrome (central pontine myelinolysis), causing irreversible brain damage. Monitor sodium levels every 2-4 hours during infusion.",
    category: "Fluid & Electrolytes"
  },
  {
    id: "fe-2",
    type: "term",
    question: "Isotonic vs Hypotonic vs Hypertonic IV Solutions",
    answer: "ISOTONIC (0.9% NS, LR): Same osmolality as blood. Expands intravascular volume. Used for dehydration, blood loss. HYPOTONIC (0.45% NS): Lower osmolality. Fluid shifts INTO cells. Used for cellular dehydration (DKA after initial NS). HYPERTONIC (3% NS, D10W): Higher osmolality. Pulls fluid OUT of cells. Used for hyponatremia, cerebral edema.",
    category: "Fluid & Electrolytes"
  },
  {
    id: "fe-3",
    type: "question",
    question: "A client with metabolic acidosis has a pH of 7.28, PaCO2 of 28, and HCO3 of 16. What is the respiratory compensation?",
    options: ["The lungs are not compensating", "Hyperventilation to blow off CO2 (Kussmaul's)", "Hypoventilation to retain CO2", "Increased bicarbonate production"],
    correctIndex: 1,
    answer: "In metabolic acidosis (low pH, low HCO3), the respiratory system compensates by increasing rate and depth (Kussmaul's respirations) to blow off CO2 (an acid). The low PaCO2 of 28 confirms partial respiratory compensation. This is seen in DKA, renal failure, and lactic acidosis.",
    category: "Fluid & Electrolytes"
  },
  {
    id: "fe-4",
    type: "term",
    question: "Signs of Fluid Volume Overload",
    answer: "Bounding pulse, elevated BP, JVD, crackles/rales in lungs, peripheral edema, weight gain (1 kg = 1 L fluid), dyspnea, orthopnea, decreased hematocrit (dilutional). Causes: IV fluid overload, heart failure, renal failure, SIADH. Treatment: restrict fluids and sodium, diuretics, elevate HOB.",
    category: "Fluid & Electrolytes"
  },
  {
    id: "peds-1",
    type: "question",
    question: "A child with epiglottitis presents with drooling, high fever, and tripod positioning. Which action should the nurse AVOID?",
    options: ["Maintaining the child in an upright position", "Keeping emergency intubation equipment at bedside", "Inspecting the throat with a tongue depressor", "Administering humidified oxygen"],
    correctIndex: 2,
    answer: "NEVER examine the throat of a child with suspected epiglottitis (using a tongue depressor or throat culture). This can trigger complete airway obstruction and laryngospasm. Keep the child calm, upright, and have intubation equipment ready. The classic '4 Ds': Drooling, Dysphagia, Dysphonia, Distress.",
    category: "Pediatrics"
  },
  {
    id: "peds-2",
    type: "term",
    question: "Pediatric Dehydration Assessment",
    answer: "MILD (3-5%): Slightly dry mucous membranes, mildly decreased urine output. MODERATE (6-9%): Sunken fontanelle (infants), absent tears, tachycardia, decreased skin turgor (tenting). SEVERE (≥10%): Lethargy, sunken eyes, very rapid pulse, mottled skin, capillary refill >3 sec, minimal/no urine output. Weight is the most accurate dehydration measure.",
    category: "Pediatrics"
  },
  {
    id: "peds-3",
    type: "question",
    question: "At what age should a nurse expect a child to achieve the milestone of walking independently?",
    options: ["6 months", "9 months", "12-15 months", "18-24 months"],
    correctIndex: 2,
    answer: "Developmental milestones: 2 mo = social smile, 4 mo = rolls over, 6 mo = sits with support, 9 mo = crawls/pulls to stand, 12-15 mo = walks independently, 2 yr = runs/kicks ball, 3 yr = rides tricycle. Report significant delays.",
    category: "Pediatrics"
  },
  {
    id: "peds-4",
    type: "term",
    question: "Tetralogy of Fallot (TOF)",
    answer: "Four defects: 1) Ventricular Septal Defect, 2) Right ventricular hypertrophy, 3) Overriding aorta, 4) Pulmonary stenosis. Results in cyanotic heart disease. Hypercyanotic ('tet') spells treated by placing child in knee-chest position (increases systemic vascular resistance, forces blood through lungs). Most common cyanotic heart defect.",
    category: "Pediatrics"
  },
  {
    id: "peds-5",
    type: "question",
    question: "A child presents with a characteristic barking, seal-like cough. The nurse suspects:",
    options: ["Epiglottitis", "Croup (laryngotracheobronchitis)", "Bronchiolitis", "Asthma exacerbation"],
    correctIndex: 1,
    answer: "Croup presents with a barking (seal-like) cough, inspiratory stridor, hoarseness, and low-grade fever. Caused by parainfluenza virus. Treatment: cool mist humidifier, racemic epinephrine for moderate-severe cases, dexamethasone. Steeple sign on X-ray.",
    category: "Pediatrics"
  },
  {
    id: "wound-1",
    type: "question",
    question: "A stage 3 pressure injury shows full-thickness skin loss with visible adipose tissue. Which dressing is MOST appropriate?",
    options: ["Transparent film dressing", "Hydrocolloid dressing", "Foam dressing with wound filler for dead space", "Dry gauze dressing"],
    correctIndex: 2,
    answer: "Stage 3 pressure injuries with depth and dead space require moist wound healing with a dressing that manages exudate and fills dead space (alginate or hydrogel filler covered by foam). Dry gauze impedes healing. Transparent films are for superficial wounds only.",
    category: "Wound Care"
  },
  {
    id: "wound-2",
    type: "term",
    question: "Braden Scale",
    answer: "Assesses pressure injury risk across 6 domains: Sensory perception, Moisture, Activity, Mobility, Nutrition, Friction/Shear. Each scored 1-4 (friction/shear 1-3). Total: 6-23. Score ≤18 = at risk. Score ≤12 = high risk. Lower score = higher risk. Reposition every 2 hours, use pressure-redistribution surfaces.",
    category: "Wound Care"
  },
  {
    id: "wound-3",
    type: "question",
    question: "A wound has yellow, stringy tissue in the wound bed. This tissue is called:",
    options: ["Granulation tissue", "Epithelial tissue", "Slough", "Eschar"],
    correctIndex: 2,
    answer: "Slough is yellow, tan, or gray moist tissue that must be debrided for wound healing. Granulation tissue is healthy (beefy red, bumpy). Eschar is black/brown dry necrotic tissue. Epithelial tissue is new pink skin at wound edges.",
    category: "Wound Care"
  },
  {
    id: "safety-1",
    type: "question",
    question: "A nurse suspects a client is a victim of intimate partner violence. Which approach is MOST appropriate?",
    options: ["Ask the client in front of the partner", "Interview the client privately using non-judgmental questions", "Confront the partner about the suspicion", "Wait for the client to disclose voluntarily"],
    correctIndex: 1,
    answer: "Interview the client ALONE in a private, safe environment using non-judgmental, open-ended questions. Ask directly: 'Do you feel safe at home?' Never interview with the suspected abuser present. Document findings objectively using client's own words and body map.",
    category: "Safety & Ethics"
  },
  {
    id: "safety-2",
    type: "term",
    question: "HIPAA/PHIPA Key Principles",
    answer: "Protected Health Information (PHI) can only be shared with: the client, those involved in client's care (need-to-know basis), and as required by law (abuse reporting, communicable diseases). Violations include: discussing clients in public areas, leaving charts unattended, sharing PHI on social media, unauthorized access to records.",
    category: "Safety & Ethics"
  },
  {
    id: "safety-3",
    type: "question",
    question: "Informed consent requires which of the following elements?",
    options: ["Only the client's signature on the form", "Explanation of procedure, risks, benefits, alternatives, and right to refuse", "Verbal agreement witnessed by a family member", "Written consent from the next of kin"],
    correctIndex: 1,
    answer: "Informed consent requires: explanation of the procedure, expected risks and benefits, alternatives, right to refuse, and the opportunity to ask questions. The PROVIDER obtains consent; the nurse WITNESSES the signature and ensures client understanding.",
    category: "Safety & Ethics"
  },
  {
    id: "safety-4",
    type: "term",
    question: "Restraint Use Guidelines",
    answer: "Restraints are a LAST RESORT after all alternatives fail. Require a provider order (renewed every 24 hours for non-violent, every 4 hours for violent/self-destructive). Check circulation/sensation every 2 hours, release every 2 hours for ROM, offer toileting/nutrition. Document behavior necessitating restraint. Knots must be quick-release.",
    category: "Safety & Ethics"
  },
  {
    id: "onc-1",
    type: "question",
    question: "A client receiving chemotherapy has a nadir ANC of 200 cells/mm³. Which precaution is HIGHEST priority?",
    options: ["Limiting visitors and avoiding fresh flowers/fruit", "Administering aspirin for headache", "Performing a rectal temperature", "Encouraging a high-fiber raw vegetable diet"],
    correctIndex: 0,
    answer: "ANC <500 = severe neutropenia. Implement neutropenic precautions: no fresh flowers/fruit/plants (harbor bacteria and molds), limit visitors, strict hand hygiene, no rectal procedures, cooked foods only, private room, mask for patient leaving room.",
    category: "Oncology"
  },
  {
    id: "onc-2",
    type: "term",
    question: "Tumor Lysis Syndrome (TLS)",
    answer: "Rapid destruction of cancer cells (often after chemo initiation) releases intracellular contents: hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia. Can cause fatal cardiac arrhythmias and acute kidney injury. Prevention: aggressive IV hydration, allopurinol or rasburicase before treatment. Monitor labs q6-8h.",
    category: "Oncology"
  },
  {
    id: "onc-3",
    type: "question",
    question: "A client receiving cisplatin chemotherapy. Which nursing intervention is ESSENTIAL to prevent nephrotoxicity?",
    options: ["Restrict fluid intake", "Administer aggressive IV hydration before and after treatment", "Hold the antiemetic to reduce medication load", "Give cisplatin via rapid IV push"],
    correctIndex: 1,
    answer: "Cisplatin is highly nephrotoxic. Aggressive IV hydration (1-2 L before and after) is essential to maintain renal perfusion and flush the drug through the kidneys. Monitor BUN, creatinine, and urine output. Also ototoxic — assess hearing.",
    category: "Oncology"
  },
  {
    id: "hem-1",
    type: "question",
    question: "A client with sickle cell disease presents with severe chest pain, dyspnea, and fever. The nurse suspects:",
    options: ["Pneumonia", "Acute chest syndrome", "Myocardial infarction", "Pulmonary embolism"],
    correctIndex: 1,
    answer: "Acute chest syndrome is the leading cause of death in sickle cell disease. Presents with chest pain, fever, dyspnea, and new pulmonary infiltrate on chest X-ray. Treatment: O2, IV fluids, broad-spectrum antibiotics, exchange transfusion. Triggers include infection, fat embolism from bone marrow necrosis.",
    category: "Hematology"
  },
  {
    id: "hem-2",
    type: "term",
    question: "DIC (Disseminated Intravascular Coagulation)",
    answer: "Paradox of simultaneous clotting AND bleeding. Widespread microvascular clotting depletes clotting factors and platelets, leading to hemorrhage. Labs: decreased platelets and fibrinogen, elevated D-dimer, PT/PTT, and fibrin degradation products. Treatment: treat underlying cause, replace clotting factors (FFP, cryoprecipitate, platelets).",
    category: "Hematology"
  },
  {
    id: "hem-3",
    type: "question",
    question: "A client receiving a blood transfusion develops fever, chills, back pain, and dark urine 15 minutes into the transfusion. The nurse should FIRST:",
    options: ["Slow the transfusion rate and administer Tylenol", "Stop the transfusion immediately and maintain IV access with NS", "Continue the transfusion and monitor closely", "Administer epinephrine"],
    correctIndex: 1,
    answer: "These symptoms suggest an acute hemolytic transfusion reaction (ABO incompatibility). STOP the transfusion immediately, maintain IV access with NS, save the blood bag and tubing for the lab, send blood and urine samples, notify provider and blood bank STAT.",
    category: "Hematology"
  },
  {
    id: "ethics-1",
    type: "question",
    question: "A competent adult client refuses a life-saving blood transfusion on religious grounds. The nurse should:",
    options: ["Override the client's wishes in an emergency", "Respect the client's right to refuse treatment and document", "Contact the hospital ethics committee to override", "Administer the transfusion and explain later"],
    correctIndex: 1,
    answer: "Competent adults have the right to refuse any treatment, including life-saving measures, based on autonomy and self-determination. The nurse must respect this decision, ensure the client understands the consequences, and document the refusal and education provided.",
    category: "Safety & Ethics"
  },
  {
    id: "ethics-2",
    type: "term",
    question: "Advance Directives",
    answer: "Legal documents expressing healthcare wishes when a person cannot communicate. Types: Living Will (specifies treatments wanted/unwanted), Healthcare Power of Attorney/Proxy (designates decision-maker), DNR/DNI (do not resuscitate/intubate). Must be completed while competent. Nurses should assess for their presence on admission.",
    category: "Safety & Ethics"
  },
  {
    id: "nutrition-1",
    type: "question",
    question: "A client with chronic kidney disease (Stage 4) should follow which dietary restriction?",
    options: ["High-protein, low-sodium diet", "Low-protein, low-phosphorus, low-potassium diet", "High-potassium, high-calcium diet", "Unrestricted diet with extra fluids"],
    correctIndex: 1,
    answer: "CKD Stage 4 requires: low protein (reduces urea buildup), low phosphorus (prevents renal osteodystrophy), low potassium (prevents cardiac arrhythmias), low sodium (prevents fluid retention), and fluid restriction. Adequate calories from carbohydrates and fats.",
    category: "Nutrition"
  },
  {
    id: "nutrition-2",
    type: "term",
    question: "Therapeutic Diets",
    answer: "CARDIAC: low sodium (<2g/day), low saturated fat. RENAL: low protein, phosphorus, potassium, sodium; fluid restricted. DIABETIC: consistent carbohydrate intake, whole grains, fiber. CLEAR LIQUID: broth, Jell-O, apple juice, tea (no pulp, dairy, or residue). FULL LIQUID: adds milk, ice cream, strained soups. NEUTROPENIC: no raw foods.",
    category: "Nutrition"
  }
];

type CustomCard = {
  id: string;
  userId: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
};

type ExamFlashcard = {
  id: string;
  front: string;
  back: string;
  category: string;
  tier: string;
  difficulty: number;
  sourceType: string;
  questionType: string;
  options: any[];
  correctAnswer: any[];
  rationaleCorrect: string;
  distractorRationales: Record<string, string> | null;
  clinicalTakeaway: string | null;
  examPearl: string | null;
  rationaleMedia: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string; sortOrder: number }[];
  lessonLinks: { lessonTitle: string; lessonUrl: string; relevanceNote: string }[];
  bodySystem: string | null;
  topic: string | null;
  subtopic: string | null;
  regionScope: string;
  flashcardEnabled: boolean;
  sourceQuestionId: string;
};

function FlashcardDashboardWidget({ userId }: { userId: string }) {
  const { t } = useI18n();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch(`/api/sm2/dashboard/${userId}`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setDashboard(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="animate-pulse h-32 bg-muted rounded-xl" />;
  if (!dashboard) return null;

  return (
    <Card className="border border-border shadow-sm rounded-xl overflow-hidden" data-testid="widget-flashcard-dashboard">
      <CardHeader className="pb-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-500" />
          {t("flashcards.dashboardTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20" data-testid="stat-cards-due">
            <div className="text-2xl font-bold text-orange-600">{dashboard.cardsDueToday}</div>
            <div className="text-[10px] text-muted-foreground font-medium">{t("flashcards.dueToday")}</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20" data-testid="stat-cards-learned">
            <div className="text-2xl font-bold text-green-600">{dashboard.cardsLearned}</div>
            <div className="text-[10px] text-muted-foreground font-medium">{t("flashcards.cardsLearned")}</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20" data-testid="stat-streak">
            <div className="text-2xl font-bold text-blue-600">{dashboard.streakDays}</div>
            <div className="text-[10px] text-muted-foreground font-medium">{t("flashcards.streakDays")}</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-violet-50 dark:bg-violet-950/20" data-testid="stat-mastery">
            <div className="text-2xl font-bold text-violet-600">{dashboard.masteryPercentage}%</div>
            <div className="text-[10px] text-muted-foreground font-medium">{t("flashcards.masteryPct")}</div>
          </div>
        </div>
        {dashboard.cardsDueToday > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between" data-testid="cta-daily-review">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">{t("flashcards.dailyReviewPrompt")}</span>
            </div>
            <Button size="sm" className="h-7 text-xs rounded-md" data-testid="button-start-daily-review">
              {t("flashcards.reviewNow")}
            </Button>
          </div>
        )}
        <div className="mt-3 grid grid-cols-4 gap-1.5" data-testid="stat-card-states">
          {(["new", "learning", "review", "mastered"] as const).map(state => (
            <div key={state} className="text-center py-1.5 rounded-md bg-muted/50">
              <div className="text-sm font-semibold">{dashboard.byState?.[state] || 0}</div>
              <div className="text-[9px] text-muted-foreground capitalize">{state}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FlashcardAnalyticsPanel({ userId }: { userId: string }) {
  const { t } = useI18n();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch(`/api/sm2/analytics/${userId}`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAnalytics(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="animate-pulse h-48 bg-muted rounded-xl" />;
  if (!analytics) return null;

  return (
    <Card className="border border-border shadow-sm rounded-xl overflow-hidden" data-testid="panel-flashcard-analytics">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet-500" />
          {t("flashcards.analyticsTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analytics.difficultyDistribution?.length > 0 && (
          <div data-testid="chart-difficulty-distribution">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("flashcards.difficultyDistribution")}</h4>
            <div className="flex gap-1.5 items-end h-16">
              {analytics.difficultyDistribution.map((d: any, i: number) => {
                const maxCount = Math.max(...analytics.difficultyDistribution.map((x: any) => x.count));
                const height = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
                const colors: Record<string, string> = { again: "bg-red-400", hard: "bg-orange-400", good: "bg-green-400", easy: "bg-blue-400" };
                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className={cn("w-full rounded-t-sm", colors[d.rating] || "bg-gray-400")} style={{ height: `${Math.max(height, 4)}%` }} />
                    <span className="text-[8px] text-muted-foreground mt-1 capitalize">{d.rating}</span>
                    <span className="text-[9px] font-medium">{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {analytics.retentionRate?.length > 0 && (
          <div data-testid="chart-retention-rate">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("flashcards.retentionRate")}</h4>
            <div className="flex gap-1 items-end h-12">
              {analytics.retentionRate.map((r: any, i: number) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-green-400 rounded-t-sm" style={{ height: `${Math.max(r.retention, 4)}%` }} />
                  <span className="text-[8px] text-muted-foreground mt-0.5">{r.retention}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.topicMastery?.length > 0 && (
          <div data-testid="chart-topic-mastery">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("flashcards.topicMastery")}</h4>
            <div className="space-y-1.5">
              {analytics.topicMastery.slice(0, 8).map((tm: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-24 truncate">{tm.topic}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${tm.percentage}%` }} />
                  </div>
                  <span className="text-[10px] font-medium w-8 text-right">{tm.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.reviewFrequency?.length > 0 && (
          <div data-testid="chart-review-frequency">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("flashcards.reviewFrequency")}</h4>
            <div className="flex gap-0.5 items-end h-10">
              {analytics.reviewFrequency.slice(-14).map((rf: any, i: number) => {
                const maxC = Math.max(...analytics.reviewFrequency.map((x: any) => x.count));
                const h = maxC > 0 ? (rf.count / maxC) * 100 : 0;
                return <div key={i} className="flex-1 bg-violet-400 rounded-t-sm" style={{ height: `${Math.max(h, 4)}%` }} />;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FlashcardCTA({ topic, context }: { topic?: string; context: string }) {
  const { t } = useI18n();
  return (
    <div className="mt-4 p-3 rounded-lg border border-violet-200 bg-violet-50/50 dark:bg-violet-950/20 dark:border-violet-800/30" data-testid={`cta-flashcard-${context}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">{t("flashcards.ctaTitle")}</p>
          <p className="text-[10px] text-violet-600/70 dark:text-violet-400/70">{topic ? t("flashcards.ctaWithTopic").replace("{topic}", topic) : t("flashcards.ctaGeneric")}</p>
        </div>
        <LocaleLink href="/flashcards" className="shrink-0">
          <Button size="sm" variant="outline" className="h-7 text-xs border-violet-300 text-violet-700 hover:bg-violet-100" data-testid={`button-cta-flashcard-${context}`}>
            <Zap className="w-3 h-3 mr-1" /> {t("flashcards.ctaButton")}
          </Button>
        </LocaleLink>
      </div>
    </div>
  );
}

export { FlashcardDashboardWidget, FlashcardAnalyticsPanel, FlashcardCTA };

export default function Flashcards({ isTestBank = false }: { isTestBank?: boolean } = {}) {
  const { user, effectiveTier } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const [view, setView] = useState<"setup" | "study" | "report" | "bookmarks" | "mastered" | "mycards" | "mycards-study" | "decks" | "deck-view" | "deck-edit" | "deck-study-learn" | "deck-study-test" | "deck-report" | "browse-decks" | "admin-sets" | "admin-set-study" | "exam-flashcards" | "exam-report" | "adaptive-learn" | "adaptive-test" | "adaptive-report" | "admin-exam-manager" | "adaptive">("setup");
  const [selectedType, setSelectedType] = useState<CardType | "all">("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cardSortBy, setCardSortBy] = useState<"default" | "alpha-asc" | "alpha-desc" | "category" | "shuffle">("default");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("nursenest-bookmarks") || "[]");
  });
  const [mastered, setMastered] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("nursenest-mastered") || "[]");
  });
  const [includeMastered, setIncludeMastered] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [region, setRegion] = useState<"US" | "CA">("CA");

  const [examFlashcards, setExamFlashcards] = useState<ExamFlashcard[]>([]);
  const [examFlashcardsLoading, setExamFlashcardsLoading] = useState(false);
  const [examFlashcardCounts, setExamFlashcardCounts] = useState<Record<string, number>>({});
  const [examFlashcardTotal, setExamFlashcardTotal] = useState(0);
  const [examStudyIndex, setExamStudyIndex] = useState(0);
  const [examSelectedOption, setExamSelectedOption] = useState<number | null>(null);
  const [examShowRationale, setExamShowRationale] = useState(false);
  const [examSessionResults, setExamSessionResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [examBookmarks, setExamBookmarks] = useState<string[]>(() => JSON.parse(localStorage.getItem("nursenest-exam-bookmarks") || "[]"));
  const [examMastered, setExamMastered] = useState<string[]>(() => JSON.parse(localStorage.getItem("nursenest-exam-mastered") || "[]"));
  const [examHasResumable, setExamHasResumable] = useState(false);

  const [adaptiveCards, setAdaptiveCards] = useState<any[]>([]);
  const [adaptiveLoading, setAdaptiveLoading] = useState(false);
  const [adaptiveIndex, setAdaptiveIndex] = useState(0);
  const [adaptiveMode, setAdaptiveMode] = useState<"learn" | "test">("learn");
  const [adaptiveSelectedOption, setAdaptiveSelectedOption] = useState<number | null>(null);
  const [adaptiveShowRationale, setAdaptiveShowRationale] = useState(false);
  const [adaptiveResults, setAdaptiveResults] = useState<{ id: string; correct: boolean; topic: string; bodySystem: string; confidence: string }[]>([]);
  const [adaptiveBookmarks, setAdaptiveBookmarks] = useState<string[]>(() => JSON.parse(localStorage.getItem("nursenest-adaptive-bookmarks") || "[]"));
  const [adaptiveConfidence, setAdaptiveConfidence] = useState<string | null>(null);
  const [adaptiveSources, setAdaptiveSources] = useState<Record<string, number>>({});
  const [adaptiveWeakAreas, setAdaptiveWeakAreas] = useState<any[]>([]);
  const [adaptiveSummary, setAdaptiveSummary] = useState<any>(null);
  const [adaptiveSubmitted, setAdaptiveSubmitted] = useState(false);

  const [adminExamQuestions, setAdminExamQuestions] = useState<any[]>([]);
  const [adminExamLoading, setAdminExamLoading] = useState(false);
  const [adminExamTier, setAdminExamTier] = useState<string>("all");
  const [adminExamTopic, setAdminExamTopic] = useState<string>("all");
  const [adminExamDifficulty, setAdminExamDifficulty] = useState<string>("all");
  const [adminExamBodySystem, setAdminExamBodySystem] = useState<string>("all");
  const [adminExamPage, setAdminExamPage] = useState(0);
  const [adminExamTotal, setAdminExamTotal] = useState(0);
  const [adminConvertingIds, setAdminConvertingIds] = useState<Set<string>>(new Set());
  const [adminFilterTopics, setAdminFilterTopics] = useState<string[]>([]);
  const [adminFilterSystems, setAdminFilterSystems] = useState<string[]>([]);
  const [adminTierCounts, setAdminTierCounts] = useState<Record<string, number>>({});
  const [adminCompleteness, setAdminCompleteness] = useState<any>(null);

  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [customCardsLoading, setCustomCardsLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("My Cards");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ accurate: boolean; feedback: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [customSearch, setCustomSearch] = useState("");
  const [editingCard, setEditingCard] = useState<CustomCard | null>(null);
  const [myCardsStudyIndex, setMyCardsStudyIndex] = useState(0);
  const [myCardsFlipped, setMyCardsFlipped] = useState(false);
  const FREE_LIMIT = 300;

  const { hasAccess: hasFlashcardAccess } = useEntitlement("feature", "flashcards");
  const isPaid = hasFlashcardAccess;

  const [staticFlashcardData, setStaticFlashcardData] = useState<Flashcard[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function loadFlashcardData() {
      const mapToStatic = (cards: any[]) =>
        cards.filter((c: any) => c.type === "question").map((c: any) => ({ ...c, source: "static" as const }));

      const fetchKey = async (key: string): Promise<any[]> => {
        // Retry once to reduce white-screen risk from transient deploy/network hiccups.
        for (let attempt = 0; attempt < 2; attempt++) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          try {
            const resp = await fetch(`/api/flashcards?deck=${encodeURIComponent(key)}&limit=250000&offset=0`, { signal: controller.signal });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const parsed = await resp.json();
            if (Array.isArray(parsed)) return parsed;
            if (parsed && Array.isArray(parsed.items)) return parsed.items;
            return [];
          } catch (e: any) {
            if (attempt === 1) throw e;
            console.warn(`[Flashcards] fetchKey retry (${attempt + 2}/2) for key=${key}:`, e?.message || e);
            await new Promise((r) => setTimeout(r, 300));
          } finally {
            clearTimeout(timeout);
          }
        }
        return [];
      };

      try {
        const [
          _rn,
          _np,
          _icu,
          _npPatho,
          _e1,
          _e2,
          _e3,
          _e4,
          _e5,
          _e6,
          _sub,
          _rpnExp,
          _rnExp2,
        ] = await Promise.all([
          fetchKey("rn"),
          fetchKey("np"),
          fetchKey("icuCriticalCare"),
          fetchKey("npPatho"),
          fetchKey("npEnrichment1"),
          fetchKey("npEnrichment2"),
          fetchKey("npEnrichment3"),
          fetchKey("npEnrichment4"),
          fetchKey("npEnrichment5"),
          fetchKey("npEnrichment6"),
          fetchKey("npSubspecialty"),
          fetchKey("rpnExpansion"),
          fetchKey("rnExpansion2"),
        ]);

        if (cancelled) return;
        const all = [
          ...mapToStatic(_rn),
          ...mapToStatic(_icu),
          ...mapToStatic(_npPatho),
          ...mapToStatic(_np),
          ...mapToStatic([..._e1, ..._e2, ..._e3, ..._e4, ..._e5, ..._e6]),
          ...mapToStatic(_sub),
          ...mapToStatic(_rpnExp),
          ...mapToStatic(_rnExp2),
        ];
        // If the backend returns empty datasets for all keys, treat it as a fetch failure.
        if (all.length === 0) throw new Error("[Flashcards] Static flashcard datasets were empty");
        setStaticFlashcardData(all);
      } catch (err: any) {
        console.warn("[Flashcards] Failed to load static flashcards:", err?.message || err);
        activateEmergencyMode();
      }
    }
    loadFlashcardData();
    return () => { cancelled = true; };
  }, []);

  const allCards = useMemo(() => {
    const combined = [...baseCards.filter(c => c.type === "question"), ...staticFlashcardData];
    const seen = new Set<string>();
    return combined.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [staticFlashcardData]);

  const [myDecks, setMyDecks] = useState<any[]>([]);
  const [publicDecks, setPublicDecks] = useState<any[]>([]);
  const [savedDecksList, setSavedDecksList] = useState<any[]>([]);
  const [currentDeck, setCurrentDeck] = useState<any>(null);
  const [deckCards, setDeckCards] = useState<any[]>([]);
  const [deckLoading, setDeckLoading] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [newDeckVisibility, setNewDeckVisibility] = useState("private");
  const [deckSearchQuery, setDeckSearchQuery] = useState("");
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [newCardRationale, setNewCardRationale] = useState("");
  const [newCardClinicalPearl, setNewCardClinicalPearl] = useState("");
  const [aiCheckResult, setAiCheckResult] = useState<any>(null);
  const [aiChecking, setAiChecking] = useState(false);
  const [csvImportText, setCsvImportText] = useState("");
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [entitlement, setEntitlement] = useState<any>({ isPremium: false, totalFreeCards: 0, limit: 300, percentage: 0 });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [deckStudyIndex, setDeckStudyIndex] = useState(0);
  const [deckStudyFlipped, setDeckStudyFlipped] = useState(false);
  const [deckStudyCorrect, setDeckStudyCorrect] = useState(0);
  const [deckStudyIncorrect, setDeckStudyIncorrect] = useState(0);
  const [deckStudyMissed, setDeckStudyMissed] = useState<string[]>([]);
  const [deckStudyQueue, setDeckStudyQueue] = useState<any[]>([]);
  const [deckStudyStartTime, setDeckStudyStartTime] = useState(0);
  const [deckStudySessionId, setDeckStudySessionId] = useState("");
  const [deckStudyComplete, setDeckStudyComplete] = useState(false);
  const [editingDeckCard, setEditingDeckCard] = useState<any>(null);
  const [deckTab, setDeckTab] = useState<"my" | "browse" | "saved">(user ? "my" : "browse");

  const [dbFlashcardSets, setDbFlashcardSets] = useState<any[]>([]);
  const [dbSetsLoading, setDbSetsLoading] = useState(false);
  const [activeDbSet, setActiveDbSet] = useState<any>(null);
  const [dbStudyIndex, setDbStudyIndex] = useState(0);
  const [dbStudyFlipped, setDbStudyFlipped] = useState(false);

  const [previewStatus, setPreviewStatus] = useState<{ isPremium: boolean; sessionRemaining: number; dailyRemaining: number; sessionLimit: number; dailyLimit: number } | null>(null);
  const [previewSessionCount, setPreviewSessionCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<{ upgradeHeadline: string; upgradeBody: string } | null>(null);

  const [degradedMode, setDegradedMode] = useState<DegradedMode>("live");
  const [flashcardBankError, setFlashcardBankError] = useState<{ code?: string; message: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activateEmergencyMode = useCallback(() => {
    setMyDecks([EMERGENCY_NURSING_DECK as any]);
    setDeckCards(EMERGENCY_NURSING_CARDS as any[]);
    setDegradedMode("emergency");
  }, []);

  const fetchMyDecks = useCallback(async () => {
    if (!user) return;
    setDeckLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`/api/decks?userId=${user.id}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMyDecks(data);
      cacheMyDecks(data);
      setDegradedMode("live");
    } catch (err: any) {
      console.warn("[Flashcards] fetchMyDecks failed:", err.message);
      const cached = getCachedMyDecks();
      if (cached) {
        setMyDecks(cached);
        setDegradedMode("cached");
      } else {
        activateEmergencyMode();
      }
    } finally { setDeckLoading(false); }
  }, [user, activateEmergencyMode]);

  const fetchPublicDecks = useCallback(async () => {
    try {
      const url = deckSearchQuery ? `/api/decks?visibility=public&search=${encodeURIComponent(deckSearchQuery)}` : `/api/decks?visibility=public`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPublicDecks(data);
      if (!deckSearchQuery) cachePublicDecks(data);
    } catch (err: any) {
      console.warn("[Flashcards] fetchPublicDecks failed:", err.message);
      if (!deckSearchQuery) {
        const cached = getCachedPublicDecks();
        if (cached) {
          setPublicDecks(cached);
          setDegradedMode("cached");
        }
      }
    }
  }, [deckSearchQuery]);

  const fetchSavedDecks = useCallback(async () => {
    if (!user) return;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`/api/saved-decks?userId=${user.id}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSavedDecksList(await res.json());
    } catch (err: any) {
      console.warn("[Flashcards] fetchSavedDecks failed:", err.message);
    }
  }, [user]);

  const fetchEntitlement = useCallback(async () => {
    if (!user) return;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`/api/flashcard-usage/${user.id}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEntitlement({
        isPremium: data.isPremium,
        totalFreeCards: data.used,
        limit: data.limit,
        percentage: data.percentage,
        remaining: data.remaining,
      });
    } catch (err: any) {
      console.warn("[Flashcards] fetchEntitlement failed (non-blocking):", err.message);
    }
  }, [user]);

  const fetchDeckCards = useCallback(async (deckId: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const uid = user?.id || "";
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`/api/decks/${deckId}/cards?userId=${uid}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDeckCards(data);
      cacheDeckCards(deckId, data);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.warn("[Flashcards] fetchDeckCards failed:", err.message);
      const cached = getCachedDeckCards(deckId);
      if (cached) {
        setDeckCards(cached);
        setDegradedMode("cached");
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (view === "decks" || view === "browse-decks") {
      fetchMyDecks();
      fetchPublicDecks();
      fetchSavedDecks();
      fetchEntitlement();
    }
  }, [view, fetchMyDecks, fetchPublicDecks, fetchSavedDecks, fetchEntitlement]);

  useEffect(() => {
    fetchEntitlement();
  }, [fetchEntitlement]);

  useEffect(() => {
    if (!entitlement.isPremium && entitlement.percentage >= 100) {
      setShowLimitModal(true);
    }
  }, [entitlement.isPremium, entitlement.percentage]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") || params.get("view") === "decks") {
      setView("decks");
    }
  }, []);

  useEffect(() => {
    setDbSetsLoading(true);
    fetch("/api/content/flashcard-sets")
      .then(res => res.ok ? res.json() : [])
      .then(data => setDbFlashcardSets(Array.isArray(data) ? data : []))
      .catch(() => setDbFlashcardSets([]))
      .finally(() => setDbSetsLoading(false));
  }, []);

  const fetchPreviewStatus = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/flashcard-preview/status?userId=${user.id}`);
      if (res.ok) setPreviewStatus(await res.json());
    } catch {}
  }, [user]);

  const fetchPreviewConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/flashcard-preview/config");
      if (res.ok) {
        const data = await res.json();
        setPreviewConfig({ upgradeHeadline: data.upgradeHeadline, upgradeBody: data.upgradeBody });
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchPreviewStatus();
    fetchPreviewConfig();
  }, [fetchPreviewStatus, fetchPreviewConfig]);

  const decrementPreview = useCallback(async () => {
    if (!user || isPaid) return;
    try {
      const res = await fetch("/api/flashcard-preview/decrement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewSessionCount(prev => prev + 1);
        if (data.remaining <= 0 || data.dailyRemaining <= 0) {
          setShowUpgradeModal(true);
        }
        setPreviewStatus(prev => prev ? {
          ...prev,
          sessionRemaining: data.remaining,
          dailyRemaining: data.dailyRemaining,
        } : prev);
      }
    } catch {}
  }, [user, isPaid]);

  const createDeck = async () => {
    if (!user || !newDeckTitle.trim()) return;
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, title: newDeckTitle, description: newDeckDescription, visibility: newDeckVisibility }),
      });
      if (res.ok) {
        const deck = await res.json();
        setNewDeckTitle("");
        setNewDeckDescription("");
        setMyDecks(prev => [deck, ...prev]);
        setCurrentDeck(deck);
        setDeckCards([]);
        setView("deck-edit");
      }
    } catch {}
  };

  const addCardToDeck = async (overrideFront?: string, overrideBack?: string) => {
    if (!user || !currentDeck) return;
    const front = overrideFront || newCardFront;
    const back = overrideBack || newCardBack;
    if (!front.trim() || !back.trim()) return;
    try {
      const res = await fetch(`/api/decks/${currentDeck.id}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, front, back, rationale: newCardRationale || undefined, clinicalPearl: newCardClinicalPearl || undefined }),
      });
      if (res.ok) {
        const card = await res.json();
        setDeckCards(prev => [...prev, card]);
        setNewCardFront("");
        setNewCardBack("");
        setNewCardRationale("");
        setNewCardClinicalPearl("");
        setAiCheckResult(null);
        fetchEntitlement();
      } else {
        const err = await res.json();
        if (err.upgradeRequired) {
          alert(err.error || t("flashcards.cardLimitReached"));
        }
      }
    } catch {}
  };

  const aiCheckCard = async () => {
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    setAiChecking(true);
    try {
      const res = await fetch(`/api/decks/${currentDeck?.id}/ai-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: newCardFront, back: newCardBack, rationale: newCardRationale }),
      });
      if (res.ok) setAiCheckResult(await res.json());
    } catch {} finally { setAiChecking(false); }
  };

  const handleCsvImport = async () => {
    if (!user || !currentDeck || !csvImportText.trim()) return;
    const lines = csvImportText.trim().split("\n");
    const cards = lines.map(line => {
      const parts = line.split(",").map(p => p.trim().replace(/^"|"$/g, ""));
      return { front: parts[0] || "", back: parts[1] || "", rationale: parts[2] || "", clinicalPearl: parts[3] || "" };
    }).filter(c => c.front && c.back);
    if (cards.length === 0) return;
    try {
      const res = await fetch(`/api/decks/${currentDeck.id}/cards/bulk-import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, cards }),
      });
      if (res.ok) {
        const result = await res.json();
        alert(`${t("flashcards.importedPrefix")} ${result.imported} ${t("flashcards.importedCards")}${result.skipped > 0 ? `, ${result.skipped} ${t("flashcards.skippedSuffix")}` : ""}`);
        setCsvImportText("");
        setShowCsvImport(false);
        fetchDeckCards(currentDeck.id);
        fetchEntitlement();
      }
    } catch {}
  };

  const [aiGeneratePrompt, setAiGeneratePrompt] = useState("");
  const [aiGenerateCount, setAiGenerateCount] = useState(10);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedCards, setAiGeneratedCards] = useState<{front: string; back: string; rationale: string; clinicalPearl?: string}[]>([]);

  const [aiUpgradeRequired, setAiUpgradeRequired] = useState(false);

  const aiGenerateCards = async () => {
    if (!user || !currentDeck || !aiGeneratePrompt.trim()) return;
    setAiGenerating(true);
    setAiGeneratedCards([]);
    setAiUpgradeRequired(false);
    try {
      const res = await fetch(`/api/decks/${currentDeck.id}/ai-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, prompt: aiGeneratePrompt, count: aiGenerateCount }),
      });
      if (!res.ok) {
        const err = await res.json();
        if (err.upgradeRequired) {
          setAiUpgradeRequired(true);
        } else {
          alert(err.error || "AI generation failed");
        }
        return;
      }
      const data = await res.json();
      setAiGeneratedCards(data.cards || []);
    } catch (e: any) {
      alert("AI generation failed. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  const addAiGeneratedCards = async () => {
    if (!user || !currentDeck || aiGeneratedCards.length === 0) return;
    try {
      const res = await fetch(`/api/decks/${currentDeck.id}/cards/bulk-import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, cards: aiGeneratedCards }),
      });
      const result = await res.json();
      if (res.ok) {
        setAiGeneratedCards([]);
        setAiGeneratePrompt("");
        fetchDeckCards(currentDeck.id);
        fetchEntitlement();
        if (result.skipped > 0) {
          alert(`Added ${result.imported} cards. ${result.skipped} cards were skipped due to the free card limit. Upgrade for unlimited cards!`);
        } else {
          alert(`Added ${result.imported} AI-generated cards to your deck!`);
        }
      } else {
        if (result.upgradeRequired) {
          setAiUpgradeRequired(true);
        } else {
          alert(result.error || "Failed to add cards");
        }
      }
    } catch {}
  };

  const removeAiGeneratedCard = (index: number) => {
    setAiGeneratedCards(prev => prev.filter((_, i) => i !== index));
  };

  const deleteDeckCard = async (cardId: string) => {
    if (!user || !currentDeck) return;
    try {
      await fetch(`/api/decks/${currentDeck.id}/cards/${cardId}?userId=${user.id}`, { method: "DELETE" });
      setDeckCards(prev => prev.filter(c => c.id !== cardId));
      fetchEntitlement();
    } catch {}
  };

  const deleteDeck = async (deckId: string) => {
    if (!user || !confirm(t("flashcards.confirmDeleteDeck"))) return;
    try {
      await fetch(`/api/decks/${deckId}?userId=${user.id}`, { method: "DELETE" });
      setMyDecks(prev => prev.filter(d => d.id !== deckId));
      if (currentDeck?.id === deckId) {
        setCurrentDeck(null);
        setView("decks");
      }
    } catch {}
  };

  const startDeckStudy = async (mode: "learn" | "test") => {
    if (!currentDeck || deckCards.length === 0) return;
    const shuffled = fisherYatesShuffle([...deckCards]);
    setDeckStudyQueue(shuffled);
    setDeckStudyIndex(0);
    setDeckStudyFlipped(false);
    setDeckStudyCorrect(0);
    setDeckStudyIncorrect(0);
    setDeckStudyMissed([]);
    setDeckStudyStartTime(Date.now());
    setDeckStudyComplete(false);
    try {
      const res = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, deckId: currentDeck.id, mode }),
      });
      if (res.ok) {
        const session = await res.json();
        setDeckStudySessionId(session.id);
      }
    } catch {}
    setView(mode === "learn" ? "deck-study-learn" : "deck-study-test");
  };

  const handleDeckStudyAnswer = (correct: boolean) => {
    const card = deckStudyQueue[deckStudyIndex];
    if (correct) {
      setDeckStudyCorrect(prev => prev + 1);
    } else {
      setDeckStudyIncorrect(prev => prev + 1);
      setDeckStudyMissed(prev => [...prev, card.id]);
      if (view === "deck-study-learn") {
        const insertAt = Math.min(deckStudyIndex + 4, deckStudyQueue.length);
        const newQueue = [...deckStudyQueue];
        newQueue.splice(insertAt, 0, { ...card, retry: true });
        setDeckStudyQueue(newQueue);
      }
    }
    if (deckStudyIndex + 1 >= deckStudyQueue.length) {
      finishDeckStudy();
    } else {
      setDeckStudyIndex(prev => prev + 1);
      setDeckStudyFlipped(false);
    }
  };

  const finishDeckStudy = async () => {
    setDeckStudyComplete(true);
    const timeSeconds = Math.round((Date.now() - deckStudyStartTime) / 1000);
    if (deckStudySessionId) {
      try {
        await fetch(`/api/study-sessions/${deckStudySessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalCards: deckStudyQueue.length,
            correctCount: deckStudyCorrect + (deckStudyQueue[deckStudyIndex] ? 0 : 0),
            incorrectCount: deckStudyIncorrect,
            timeSeconds,
            missedCardIds: deckStudyMissed,
          }),
        });
      } catch {}
    }
    setView("deck-report");
  };

  const saveDeck = async (deckId: string) => {
    if (!user) return;
    try {
      await fetch(`/api/decks/${deckId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      fetchSavedDecks();
    } catch {}
  };

  const duplicateDeck = async (deckId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/decks/${deckId}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        fetchMyDecks();
        alert(t("flashcards.deckCopied"));
      }
    } catch {}
  };

  const reportDeck = async (deckId: string, reason: string) => {
    if (!user) return;
    try {
      await fetch("/api/deck-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporterId: user.id, targetType: "deck", targetId: deckId, reason }),
      });
      alert(t("flashcards.reportSubmitted"));
    } catch {}
  };

  const [mycardsAiPrompt, setMycardsAiPrompt] = useState("");
  const [mycardsAiCount, setMycardsAiCount] = useState(5);
  const [mycardsAiGenerating, setMycardsAiGenerating] = useState(false);
  const [mycardsAiCards, setMycardsAiCards] = useState<{question: string; answer: string}[]>([]);
  const [mycardsShowAi, setMycardsShowAi] = useState(false);
  const [mycardsAiMode, setMycardsAiMode] = useState<"topic" | "notes">("topic");
  const [mycardsNotesText, setMycardsNotesText] = useState("");
  const [mycardsNotesFileName, setMycardsNotesFileName] = useState("");

  const mycardsAiGenerate = async () => {
    if (!user || !mycardsAiPrompt.trim()) return;
    setMycardsAiGenerating(true);
    setMycardsAiCards([]);
    try {
      const res = await fetch("/api/user-flashcards/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, prompt: mycardsAiPrompt, count: mycardsAiCount }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "AI generation failed");
        return;
      }
      const data = await res.json();
      setMycardsAiCards(data.cards || []);
    } catch {
      alert("AI generation failed. Please try again.");
    } finally {
      setMycardsAiGenerating(false);
    }
  };

  const mycardsNotesGenerate = async () => {
    if (!user || !mycardsNotesText.trim()) return;
    setMycardsAiGenerating(true);
    setMycardsAiCards([]);
    try {
      const res = await fetch("/api/user-flashcards/ai-generate-from-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, notes: mycardsNotesText, count: mycardsAiCount }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "AI generation from notes failed");
        return;
      }
      const data = await res.json();
      setMycardsAiCards(data.cards || []);
    } catch {
      alert("AI generation from notes failed. Please try again.");
    } finally {
      setMycardsAiGenerating(false);
    }
  };

  const handleMycardsNotesFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large. Please limit to 5 MB."); return; }
    setMycardsNotesFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setMycardsNotesText(ev.target.result as string); };
    reader.readAsText(file);
  };

  const mycardsAiAddAll = async () => {
    if (!user || mycardsAiCards.length === 0) return;
    let added = 0;
    for (const card of mycardsAiCards) {
      try {
        const res = await fetch("/api/user-flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, question: card.question, answer: card.answer, category: "Study Cards" }),
        });
        if (res.ok) added++;
        else {
          const err = await res.json();
          if (err.upgradeRequired) {
            alert(err.error);
            break;
          }
        }
      } catch {}
    }
    if (added > 0) {
      setMycardsAiCards([]);
      setMycardsAiPrompt("");
      fetchCustomCards();
      alert(`Added ${added} AI-generated cards!`);
    }
  };

  const mycardsAiRemove = (index: number) => {
    setMycardsAiCards(prev => prev.filter((_, i) => i !== index));
  };

  const fetchCustomCards = useCallback(async () => {
    if (!user) return;
    setCustomCardsLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`/api/user-flashcards/${user.id}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCustomCards(await res.json());
    } catch (err: any) {
      console.warn("[Flashcards] fetchCustomCards failed:", err.message);
    } finally {
      setCustomCardsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && (view === "mycards" || view === "mycards-study")) fetchCustomCards();
  }, [user, view, fetchCustomCards]);

  const fetchExamFlashcardCounts = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch("/api/flashcard-bank/counts", { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setExamFlashcardCounts(data.counts || data.tiers || {});
      setExamFlashcardTotal(data.total || 0);
      cacheExamFlashcardCounts(data.counts || data.tiers || {}, data.total || 0);
    } catch (err: any) {
      console.warn("[Flashcards] fetchExamFlashcardCounts failed:", err.message);
      const cached = getCachedExamFlashcardCounts();
      if (cached) {
        setExamFlashcardCounts(cached.counts);
        setExamFlashcardTotal(cached.total);
        setDegradedMode("cached");
      }
    }
  }, []);

  const fetchExamFlashcards = useCallback(async () => {
    if (!isPaid) return;
    setExamFlashcardsLoading(true);
    setFlashcardBankError(null);
    try {
      const tierParam = effectiveTier === "admin" ? "" : `&tier=${effectiveTier}`;
      const batchSize = 200;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`/api/flashcard-bank?sourceType=cat_exam&limit=${batchSize}&offset=0${tierParam}`, {
        signal: controller.signal,
        headers: getAuthHeaders(),
        credentials: "include",
      });
      clearTimeout(timeout);
      const parsed = await readApiJsonResponse<{ items?: unknown[] }>(res);
      if (!parsed.ok) {
        const msg = getLearnerMessageForCode(parsed.code, parsed.message);
        setFlashcardBankError({ code: parsed.code, message: msg });
        if (isEntitlementErrorCode(parsed.code) || isAuthRequiredCode(parsed.code, parsed.status)) {
          setShowUpgradeModal(true);
        }
        const cached = getCachedExamFlashcards(effectiveTier || "all");
        if (cached) {
          setExamFlashcards(cached);
          setDegradedMode("cached");
        }
        return;
      }
      const data = parsed.data;
      const items = (data && typeof data === "object" && "items" in data ? (data as { items?: unknown[] }).items : null) || [];
      setExamFlashcards(items as any[]);
      cacheExamFlashcards(effectiveTier || "all", items as any[]);
      setDegradedMode("live");
    } catch (err: any) {
      console.warn("[Flashcards] fetchExamFlashcards failed:", err.message);
      setFlashcardBankError({ message: "Could not load exam flashcards. Please try again." });
      const cached = getCachedExamFlashcards(effectiveTier || "all");
      if (cached) {
        setExamFlashcards(cached);
        setDegradedMode("cached");
      }
    } finally {
      setExamFlashcardsLoading(false);
    }
  }, [effectiveTier, isPaid]);

  useEffect(() => {
    fetchExamFlashcardCounts();
    const saved = localStorage.getItem("nursenest-exam-session");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.index > 0 && s.index < (s.total || Infinity)) {
          setExamHasResumable(true);
        }
      } catch {}
    }
  }, [fetchExamFlashcardCounts]);

  const saveExamSession = useCallback((index: number, results: { id: string; correct: boolean }[], total: number) => {
    localStorage.setItem("nursenest-exam-session", JSON.stringify({ index, results, total, timestamp: Date.now() }));
  }, []);

  const clearExamSession = useCallback(() => {
    localStorage.removeItem("nursenest-exam-session");
    setExamHasResumable(false);
  }, []);

  const resumeExamSession = useCallback(() => {
    try {
      const saved = localStorage.getItem("nursenest-exam-session");
      if (saved) {
        const s = JSON.parse(saved);
        setExamStudyIndex(s.index || 0);
        setExamSessionResults(s.results || []);
        setExamSelectedOption(null);
        setExamShowRationale(false);
        return true;
      }
    } catch (err: any) {
      console.warn("[Flashcards] resumeExamSession failed:", err.message);
    }
    return false;
  }, []);

  useEffect(() => {
    if (view === "exam-flashcards" && examFlashcards.length === 0) {
      fetchExamFlashcards();
    }
  }, [view, examFlashcards.length, fetchExamFlashcards]);

  const fetchAdaptiveSession = useCallback(async (mode: "learn" | "test") => {
    if (!user || !isPaid) return;
    setAdaptiveLoading(true);
    setAdaptiveCards([]);
    setAdaptiveIndex(0);
    setAdaptiveSelectedOption(null);
    setAdaptiveShowRationale(false);
    setAdaptiveResults([]);
    setAdaptiveConfidence(null);
    setAdaptiveSummary(null);
    setAdaptiveSubmitted(false);
    try {
      const tier = effectiveTier === "admin" ? "rn" : effectiveTier;
      const res = await fetch(`/api/adaptive-flashcard-session/${user.id}?tier=${tier}&mode=${mode}&size=20`);
      if (res.ok) {
        const data = await res.json();
        setAdaptiveCards(data.cards || []);
        setAdaptiveSources(data.sources || {});
        setAdaptiveWeakAreas(data.weakAreas || []);
      }
    } catch {} finally {
      setAdaptiveLoading(false);
    }
  }, [user, effectiveTier]);

  const handleAdaptiveAnswer = useCallback(async (selectedIdx: number) => {
    if (!user || adaptiveCards.length === 0) return;
    const card = adaptiveCards[adaptiveIndex];
    const isCorrect = card.correctIndex === selectedIdx || (Array.isArray(card.correctAnswer) && card.correctAnswer.includes(selectedIdx));
    setAdaptiveSelectedOption(selectedIdx);
    if (adaptiveMode === "learn") {
      setAdaptiveShowRationale(true);
    } else {
      setAdaptiveSubmitted(true);
    }
    const result = { id: card.id, correct: isCorrect, topic: card.topic || "", bodySystem: card.bodySystem || "", confidence: "" };
    setAdaptiveResults(prev => [...prev, result]);
  }, [user, adaptiveCards, adaptiveIndex, adaptiveMode]);

  const submitTestAnswer = useCallback(() => {
    setAdaptiveShowRationale(true);
  }, []);

  const recordAdaptiveConfidence = useCallback(async (confidence: string) => {
    if (!user || adaptiveCards.length === 0) return;
    const card = adaptiveCards[adaptiveIndex];
    const lastResult = adaptiveResults[adaptiveResults.length - 1];
    if (!lastResult) return;
    setAdaptiveConfidence(confidence);
    setAdaptiveResults(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], confidence };
      return updated;
    });
    try {
      await fetch("/api/flashcard-session/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          questionId: card.id,
          selectedIndex: adaptiveSelectedOption,
          wasCorrect: lastResult.correct,
          confidence,
          topic: card.topic,
          bodySystem: card.bodySystem,
          tier: effectiveTier === "admin" ? "rn" : effectiveTier,
        }),
      });
    } catch {}
  }, [user, adaptiveCards, adaptiveIndex, adaptiveResults, adaptiveSelectedOption, effectiveTier]);

  const handleAdaptiveNext = useCallback(() => {
    if (adaptiveIndex < adaptiveCards.length - 1) {
      setAdaptiveIndex(prev => prev + 1);
      setAdaptiveSelectedOption(null);
      setAdaptiveShowRationale(false);
      setAdaptiveConfidence(null);
      setAdaptiveSubmitted(false);
    } else {
      fetchAdaptiveSummary();
      setView("adaptive-report");
    }
  }, [adaptiveIndex, adaptiveCards.length]);

  const fetchAdaptiveSummary = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/flashcard-session/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          results: adaptiveResults,
          tier: effectiveTier === "admin" ? "rn" : effectiveTier,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdaptiveSummary(data);
      }
    } catch {}
  }, [user, adaptiveResults, effectiveTier]);

  const fetchAdminExamQuestions = useCallback(async (tierFilter?: string, topicFilter?: string, diffFilter?: string, bsFilter?: string, pg?: number) => {
    if (user?.tier !== "admin") return;
    setAdminExamLoading(true);
    try {
      const t = tierFilter ?? adminExamTier;
      const tp = topicFilter ?? adminExamTopic;
      const d = diffFilter ?? adminExamDifficulty;
      const bs = bsFilter ?? adminExamBodySystem;
      const p = pg ?? adminExamPage;
      const params = new URLSearchParams({ tier: t, topic: tp, difficulty: d, bodySystem: bs, page: String(p), limit: "50" });
      const res = await fetch(`/api/admin/exam-questions?${params}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAdminExamQuestions(data.questions || []);
        setAdminExamTotal(data.total || 0);
        if (data.topics) setAdminFilterTopics(data.topics);
        if (data.bodySystems) setAdminFilterSystems(data.bodySystems);
        if (data.tierCounts) setAdminTierCounts(data.tierCounts);
        if (data.completeness) setAdminCompleteness(data.completeness);
      }
    } catch {} finally {
      setAdminExamLoading(false);
    }
  }, [user, adminExamTier, adminExamTopic, adminExamDifficulty, adminExamBodySystem, adminExamPage]);

  const handleAdminConvert = useCallback(async () => {
    if (user?.tier !== "admin") return;
    setAdminConvertingIds(new Set(["converting"]));
    try {
      const res = await fetch("/api/admin/convert-to-flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Conversion complete: ${data.created || 0} new flashcard decks synced`);
      } else {
        alert("Conversion failed");
      }
    } catch {
      alert("Conversion error");
    } finally {
      setAdminConvertingIds(new Set());
    }
  }, [user]);

  const handleValidateAndSave = async () => {
    if (!user || !newQuestion.trim() || !newAnswer.trim()) return;
    setValidating(true);
    setValidationResult(null);
    try {
      const valRes = await fetch("/api/user-flashcards/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
      });
      const valData = await valRes.json();
      setValidationResult(valData);

      if (!valData.accurate) {
        setValidating(false);
        return;
      }

      setSaving(true);
      const saveRes = await fetch("/api/user-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, question: newQuestion, answer: newAnswer, category: newCategory }),
      });

      if (saveRes.ok) {
        setNewQuestion("");
        setNewAnswer("");
        setNewCategory("My Cards");
        setValidationResult(null);
        fetchCustomCards();
      } else {
        const err = await saveRes.json();
        if (err.upgradeRequired) {
          setValidationResult({ accurate: false, feedback: err.error });
        } else {
          setValidationResult({ accurate: false, feedback: err.error || t("flashcards.failedToSave") });
        }
      }
    } catch {
      setValidationResult({ accurate: false, feedback: t("flashcards.networkError") });
    } finally {
      setValidating(false);
      setSaving(false);
    }
  };

  const handleUpdateCard = async () => {
    if (!user || !editingCard) return;
    setValidating(true);
    setValidationResult(null);
    try {
      const valRes = await fetch("/api/user-flashcards/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: editingCard.question, answer: editingCard.answer }),
      });
      const valData = await valRes.json();
      if (!valData.accurate) {
        setValidationResult(valData);
        setValidating(false);
        return;
      }

      const res = await fetch(`/api/user-flashcards/${editingCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, question: editingCard.question, answer: editingCard.answer, category: editingCard.category }),
      });
      if (res.ok) {
        setEditingCard(null);
        setValidationResult(null);
        fetchCustomCards();
      }
    } catch {} finally {
      setValidating(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!user || !confirm(t("flashcards.confirmDeleteFlashcard"))) return;
    try {
      const res = await fetch(`/api/user-flashcards/${cardId}?userId=${user.id}`, { method: "DELETE" });
      if (res.ok) setCustomCards(prev => prev.filter(c => c.id !== cardId));
    } catch {}
  };

  useEffect(() => {
    setRegion((localStorage.getItem("nursenest-region") as "US" | "CA") || "US");
  }, []);

  const categories = useMemo(() => Array.from(new Set(allCards.map(c => c.category))), [allCards]);
  const categoryLabelMap: Record<string, string> = {
    "Cardiovascular": t("flashcards.categoryCardiovascular"),
    "Pediatrics": t("flashcards.categoryPediatrics"),
    "Oncology": t("flashcards.categoryOncology"),
    "Neurological": t("flashcards.categoryNeurological"),
    "Pharmacology": t("flashcards.categoryPharmacology"),
    "Respiratory": t("flashcards.categoryRespiratory"),
    "GI": t("flashcards.categoryGI"),
    "Skin": t("flashcards.categorySkin"),
    "Infection": t("flashcards.categoryInfection"),
    "GU / Renal": t("flashcards.categoryGURenal"),
    "Musculoskeletal": t("flashcards.categoryMusculoskeletal"),
    "Maternal": t("flashcards.categoryMaternal"),
    "Psychiatry": t("flashcards.categoryPsychiatry"),
    "Hematology": t("flashcards.categoryHematology"),
  };
  const catLabel = (cat: string) => categoryLabelMap[cat] || cat;

  const [adaptiveOverrideCards, setAdaptiveOverrideCards] = useState<Flashcard[] | null>(null);

  const filteredCards = useMemo(() => {
    let filtered = allCards;
    if (!includeMastered) {
      filtered = filtered.filter(c => !mastered.includes(c.id));
    }
    if (selectedType !== "all") {
      filtered = filtered.filter(c => c.type === selectedType);
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(c => selectedCategories.includes(c.category));
    }
    switch (cardSortBy) {
      case "alpha-asc": filtered = [...filtered].sort((a, b) => (a.question || "").localeCompare(b.question || "")); break;
      case "alpha-desc": filtered = [...filtered].sort((a, b) => (b.question || "").localeCompare(a.question || "")); break;
      case "category": filtered = [...filtered].sort((a, b) => (a.category || "").localeCompare(b.category || "")); break;
      case "shuffle": filtered = fisherYatesShuffle([...filtered]); break;
      default: break;
    }
    return filtered;
  }, [allCards, selectedType, selectedCategories, mastered, includeMastered, cardSortBy]);

  /** My Cards: filter + sort (sort select applied here; previously only search ran on this view). */
  const MYCARDS_VIRTUAL_THRESHOLD = 35;
  const mycardsDisplayCards = useMemo(() => {
    if (view !== "mycards") return [] as CustomCard[];
    let list = customCards.filter(c => {
      if (!customSearch) return true;
      const s = customSearch.toLowerCase();
      return (
        c.question.toLowerCase().includes(s) ||
        c.answer.toLowerCase().includes(s) ||
        c.category.toLowerCase().includes(s)
      );
    });
    switch (cardSortBy) {
      case "alpha-asc":
        list = [...list].sort((a, b) => (a.question || "").localeCompare(b.question || ""));
        break;
      case "alpha-desc":
        list = [...list].sort((a, b) => (b.question || "").localeCompare(a.question || ""));
        break;
      case "category":
        list = [...list].sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
      case "shuffle":
        list = fisherYatesShuffle([...list]);
        break;
      default:
        break;
    }
    return list;
  }, [view, customCards, customSearch, cardSortBy]);

  const mycardsListScrollRef = useRef<HTMLDivElement>(null);
  const mycardsVirtualizer = useVirtualizer({
    count:
      view === "mycards" && mycardsDisplayCards.length >= MYCARDS_VIRTUAL_THRESHOLD
        ? mycardsDisplayCards.length
        : 0,
    getScrollElement: () => mycardsListScrollRef.current,
    estimateSize: () => 140,
    overscan: 10,
  });

  const sessionCards = adaptiveOverrideCards || filteredCards;

  const bookmarkedCards = useMemo(() => {
    return allCards.filter(c => bookmarks.includes(c.id));
  }, [allCards, bookmarks]);

  const masteredCards = useMemo(() => {
    return allCards.filter(c => mastered.includes(c.id));
  }, [allCards, mastered]);

  const toggleBookmark = (id: string) => {
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id) 
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem("nursenest-bookmarks", JSON.stringify(newBookmarks));
  };

  const toggleMastered = (id: string) => {
    const newMastered = mastered.includes(id)
      ? mastered.filter(m => m !== id)
      : [...mastered, id];
    setMastered(newMastered);
    localStorage.setItem("nursenest-mastered", JSON.stringify(newMastered));
  };

  const startSession = async () => {
    const canUseAdaptive = !!(user && isPaid);
    if (filteredCards.length === 0 && !canUseAdaptive) return;
    setAdaptiveOverrideCards(null);
    setCurrentIndex(0);
    setSessionResults([]);
    setPreviewSessionCount(0);

    if (canUseAdaptive) {
      try {
        const tier = effectiveTier === "admin" ? "rn" : effectiveTier;
        const categoryParam = selectedCategories.length === 1 ? `&bodySystem=${encodeURIComponent(selectedCategories[0])}` : "";
        const size = Math.min(Math.max(filteredCards.length, 20), 40);
        const headers: Record<string, string> = {};
        const userToken = localStorage.getItem("nursenest-user-token");
        if (userToken) headers["x-user-token"] = userToken;
        const res = await fetch(`/api/adaptive-flashcard-session/${user.id}?tier=${tier}&mode=learn&size=${size}${categoryParam}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.cards && data.cards.length > 0) {
            const mapped: Flashcard[] = data.cards.map((c: any) => {
              const distractorMap = c.distractorRationales;
              let optionRats: string[] | undefined;
              if (distractorMap && c.options) {
                optionRats = c.options.map((_: string, i: number) => {
                  if (i === c.correctIndex) return "";
                  return distractorMap[String(i)] || distractorMap[String.fromCharCode(65 + i)] || "";
                });
              }
              return {
                id: c.id,
                type: "question" as CardType,
                question: c.question,
                options: c.options,
                correctIndex: c.correctIndex,
                answer: c.rationale || "",
                category: c.bodySystem || c.topic || "",
                clinicalPearl: c.clinicalPearl || null,
                optionRationales: optionRats,
                source: c.source as Flashcard["source"],
                bodySystem: c.bodySystem,
                topic: c.topic,
                difficulty: c.difficulty,
                examStrategy: c.examStrategy,
                memoryHook: c.memoryHook,
                distractorRationales: distractorMap,
                previouslyAnswered: c.previouslyAnswered,
                previouslyCorrect: c.previouslyCorrect,
              };
            });
            setAdaptiveOverrideCards(mapped);
          }
        }
      } catch {}
    }

    if (!isPaid && user) {
      try {
        await fetch("/api/flashcard-preview/reset-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch {}
    }
    await fetchPreviewStatus();
    setView("study");
  };

  const handleSM2Rating = async (rating: "again" | "hard" | "good" | "easy") => {
    const card = sessionCards[currentIndex];
    if (user && card.id && card.source !== "static") {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        await fetch("/api/sm2/review", {
          method: "POST",
          headers,
          body: JSON.stringify({ cardId: card.id, rating }),
        });
      } catch {}
    }
    handleNext();
  };

  const handleNext = () => {
    if (!isPaid && user && previewStatus && !previewStatus.isPremium) {
      if (previewStatus.sessionRemaining <= 0 || previewStatus.dailyRemaining <= 0) {
        setShowUpgradeModal(true);
        return;
      }
    }
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowRationale(false);
      setIsFlipped(false);
    } else {
      setView("report");
    }
  };

  const handleOptionClick = (index: number) => {
    if (showRationale) return;
    const card = sessionCards[currentIndex];
    const isCorrect = index === card.correctIndex;
    setSessionResults(prev => [...prev, { id: card.id, correct: isCorrect }]);
    setSelectedOption(index);
    setShowRationale(true);
    if (!isPaid && user) {
      decrementPreview();
    }
    if (user && card.source && card.source !== "static") {
      try {
        const ansHeaders: Record<string, string> = { "Content-Type": "application/json" };
        const ut = localStorage.getItem("nursenest-user-token");
        if (ut) ansHeaders["x-user-token"] = ut;
        fetch("/api/flashcard-session/answer", {
          method: "POST",
          headers: ansHeaders,
          body: JSON.stringify({
            userId: user.id,
            questionId: card.id,
            selectedIndex: index,
            wasCorrect: isCorrect,
            confidence: isCorrect ? "confident" : "unsure",
            topic: card.topic || card.category,
            bodySystem: card.bodySystem || card.category,
            tier: effectiveTier === "admin" ? "rn" : effectiveTier,
          }),
        });
      } catch {}
    }
  };

  const currentCard = sessionCards[currentIndex];

  const categoryLessonMap: Record<string, { slug: string; title: string }> = {
    "Cardiovascular": { slug: "cardiovascular", title: "Cardiovascular Nursing" },
    "Respiratory": { slug: "respiratory", title: "Respiratory System" },
    "Neurological": { slug: "neurological", title: "Neurological Nursing" },
    "Pharmacology": { slug: "pharmacology", title: "Pharmacology Essentials" },
    "Advanced Pharmacology": { slug: "pharmacology", title: "Pharmacology Essentials" },
    "Pediatrics": { slug: "pediatrics", title: "Pediatric Nursing" },
    "Oncology": { slug: "oncology", title: "Oncology Nursing" },
    "GI": { slug: "gastrointestinal", title: "Gastrointestinal Nursing" },
    "Gastrointestinal": { slug: "gastrointestinal", title: "Gastrointestinal Nursing" },
    "GU / Renal": { slug: "renal", title: "Renal & Urinary Nursing" },
    "Renal": { slug: "renal", title: "Renal & Urinary Nursing" },
    "Musculoskeletal": { slug: "musculoskeletal", title: "Musculoskeletal Nursing" },
    "Skin": { slug: "integumentary", title: "Integumentary & Wound Care" },
    "Wound Care": { slug: "integumentary", title: "Integumentary & Wound Care" },
    "Dermatology": { slug: "integumentary", title: "Integumentary & Wound Care" },
    "Integumentary": { slug: "integumentary", title: "Integumentary & Wound Care" },
    "Infection": { slug: "infection-control", title: "Infection Control" },
    "Infection Control": { slug: "infection-control", title: "Infection Control" },
    "Maternal": { slug: "maternal", title: "Maternal & Newborn Nursing" },
    "Maternity": { slug: "maternal", title: "Maternal & Newborn Nursing" },
    "Neonatal": { slug: "maternal", title: "Maternal & Newborn Nursing" },
    "OB/Maternity": { slug: "maternal", title: "Maternal & Newborn Nursing" },
    "Postpartum": { slug: "maternal", title: "Maternal & Newborn Nursing" },
    "Psychiatry": { slug: "mental-health", title: "Mental Health Nursing" },
    "Mental Health": { slug: "mental-health", title: "Mental Health Nursing" },
    "Behavioral Health": { slug: "mental-health", title: "Mental Health Nursing" },
    "Hematology": { slug: "hematology", title: "Hematology & Oncology" },
    "Endocrine": { slug: "endocrine", title: "Endocrine System" },
    "Fundamentals": { slug: "fundamentals", title: "Nursing Fundamentals" },
    "Nursing Fundamentals": { slug: "fundamentals", title: "Nursing Fundamentals" },
    "Fluid & Electrolytes": { slug: "fluid-electrolytes", title: "Fluid & Electrolyte Balance" },
    "Electrolytes": { slug: "fluid-electrolytes", title: "Fluid & Electrolyte Balance" },
    "Safety & Ethics": { slug: "safety-ethics", title: "Safety & Ethical Practice" },
    "Ethics": { slug: "safety-ethics", title: "Safety & Ethical Practice" },
    "Delegation": { slug: "delegation", title: "Delegation & Prioritization" },
    "Leadership": { slug: "delegation", title: "Delegation & Prioritization" },
    "Emergency": { slug: "emergency", title: "Emergency Nursing" },
    "Trauma": { slug: "emergency", title: "Emergency Nursing" },
    "Pain Management": { slug: "pain-management", title: "Pain Management" },
    "Nutrition": { slug: "nutrition", title: "Nutrition & Diet Therapy" },
    "Lab Values": { slug: "lab-fundamentals", title: "Lab Value Fundamentals" },
    "Assessment": { slug: "assessment", title: "Health Assessment" },
    "Differential Diagnosis": { slug: "assessment", title: "Health Assessment" },
    "Clinical Assessment": { slug: "assessment", title: "Health Assessment" },
    "Reproductive": { slug: "reproductive", title: "Reproductive Health" },
    "Eye & Ear": { slug: "eye-ear", title: "Eye & Ear Disorders" },
    "Ophthalmology": { slug: "eye-ear", title: "Eye & Ear Disorders" },
    "Immune": { slug: "infection-control", title: "Infection Control" },
    "Immunology": { slug: "infection-control", title: "Infection Control" },
  };

  const getRelatedLesson = (category: string) => categoryLessonMap[category] || null;

  const generateOptionRationale = (card: Flashcard, optionIndex: number): string => {
    if (card.optionRationales && card.optionRationales[optionIndex]) {
      return card.optionRationales[optionIndex];
    }
    if (card.distractorRationales) {
      const dr = card.distractorRationales;
      const val = dr[String(optionIndex)] || dr[String.fromCharCode(65 + optionIndex)] || dr[String.fromCharCode(97 + optionIndex)];
      if (val) return val;
    }
    if (!card.options || card.correctIndex === undefined) return "";
    if (optionIndex === card.correctIndex) return "";
    const option = card.options[optionIndex];
    const correctOption = card.options[card.correctIndex];
    const optionShort = option.length > 70 ? option.substring(0, 67) + "..." : option;
    const correctShort = correctOption ? (correctOption.length > 70 ? correctOption.substring(0, 67) + "..." : correctOption) : "";

    const optionLower = option.toLowerCase();

    if (optionLower.includes("immediately") || optionLower.includes("within 2 hour") || optionLower.includes("stat"))
      return `"${optionShort}" suggests an inappropriate urgency for this scenario. The correct action is "${correctShort}" because it addresses the clinical priority without risking premature intervention.`;
    if (optionLower.includes("not") || optionLower.includes("avoid") || optionLower.includes("never") || optionLower.includes("contraindicated"))
      return `"${optionShort}" contradicts the evidence-based approach here. The correct response — "${correctShort}" — aligns with current clinical guidelines for this presentation.`;
    if (optionLower.includes("only") || optionLower.includes("always") || optionLower.includes("all "))
      return `"${optionShort}" uses an absolute that oversimplifies the clinical picture. The correct answer — "${correctShort}" — accounts for the specific nuances of this patient's condition.`;
    if (optionLower.includes("monitor") || optionLower.includes("observe") || optionLower.includes("continue"))
      return `"${optionShort}" is too passive for this scenario. The patient requires active intervention: "${correctShort}" directly addresses the clinical need rather than delaying care.`;
    if (optionLower.includes("administer") || optionLower.includes("give") || optionLower.includes("inject"))
      return `"${optionShort}" is not the first-line intervention here. "${correctShort}" is the priority because it targets the underlying problem more effectively for this presentation.`;
    if (optionLower.includes("position") || optionLower.includes("elevate") || optionLower.includes("lower"))
      return `"${optionShort}" does not address the primary concern in this scenario. "${correctShort}" takes priority because it directly impacts the patient's immediate clinical outcome.`;
    if (optionLower.includes("notify") || optionLower.includes("call") || optionLower.includes("report"))
      return `"${optionShort}" delays the needed nursing action. In this scenario, "${correctShort}" should be performed first before communicating with the healthcare team.`;
    return `"${optionShort}" is incorrect because it does not address the most immediate clinical need. The priority action is "${correctShort}" which directly targets the patient's primary concern in this scenario.`;
  };

  const [topicSearch, setTopicSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showTopicPanel, setShowTopicPanel] = useState(false);

  const topicGroups: { label: string; topics: string[] }[] = useMemo(() => {
    const groupDefs = [
      { label: "Fundamentals", match: ["Fundamentals", "Nutrition", "Safety & Ethics", "Delegation", "Procedures"] },
      { label: "Adult Health Systems", match: ["Cardiovascular", "Respiratory", "Neurological", "GI", "Gastrointestinal", "GU / Renal", "Renal", "Endocrine", "Musculoskeletal", "Fluid & Electrolytes"] },
      { label: "Integumentary & Wound", match: ["Skin", "Wound Care"] },
      { label: "Infection & Immunity", match: ["Infection", "Infection Control"] },
      { label: "Maternal & Neonatal", match: ["Maternal", "Maternity", "Neonatal"] },
      { label: "Pediatrics", match: ["Pediatrics"] },
      { label: "Mental Health", match: ["Mental Health", "Psychiatry"] },
      { label: "Pharmacology", match: ["Pharmacology"] },
      { label: "Oncology & Hematology", match: ["Oncology", "Hematology"] },
    ];
    const assigned = new Set<string>();
    const result: { label: string; topics: string[] }[] = [];
    for (const g of groupDefs) {
      const matched = categories.filter(c => g.match.includes(c));
      if (matched.length > 0) {
        result.push({ label: g.label, topics: matched });
        matched.forEach(m => assigned.add(m));
      }
    }
    const remaining = categories.filter(c => !assigned.has(c));
    if (remaining.length > 0) {
      result.push({ label: "Other Topics", topics: remaining });
    }
    return result;
  }, [categories]);

  const filteredTopicGroups = useMemo(() => {
    if (!topicSearch.trim()) return topicGroups;
    const q = topicSearch.toLowerCase();
    return topicGroups
      .map(g => ({
        ...g,
        topics: g.topics.filter(t => catLabel(t).toLowerCase().includes(q) || g.label.toLowerCase().includes(q)),
      }))
      .filter(g => g.topics.length > 0);
  }, [topicGroups, topicSearch]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  if (view === "adaptive") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <AdaptiveStudyHub
          userId={user?.id || ""}
          userTier={effectiveTier || user?.tier || "free"}
          onBack={() => setView("setup")}
        />
        <Footer />
      </div>
    );
  }

  if (view === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50/40 via-white to-blue-50/30 flex flex-col font-sans">
        <Navigation />

        <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
          <DialogContent className="sm:max-w-md" data-testid="modal-limit-reached">
            <DialogHeader>
              <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-center text-xl">{t("pages.flashcards.freeCardLimitReached")}</DialogTitle>
              <DialogDescription className="text-center">
                You've used all {entitlement.limit} free {isTestBank ? "questions" : "flashcards"}. Upgrade for unlimited {isTestBank ? "practice questions" : "cards"}, spaced repetition, and exam-mode testing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg border border-violet-100">
                <div>
                  <p className="font-semibold text-sm">{t("pages.flashcards.monthly")}</p>
                  <p className="text-xs text-muted-foreground">{t("pages.flashcards.billedMonthly")}</p>
                </div>
                <span className="font-bold text-violet-700">$4.99/mo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg border-2 border-violet-300">
                <div>
                  <p className="font-semibold text-sm">Yearly <span className="text-xs text-emerald-600 ml-1">{t("pages.flashcards.bestValue")}</span></p>
                  <p className="text-xs text-muted-foreground">Save $20.88/year</p>
                </div>
                <span className="font-bold text-violet-700">$39/yr</span>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <a href="/upgrade" className="w-full">
                <Button className="w-full bg-violet-600 hover:bg-violet-700" size="lg" data-testid="button-modal-upgrade">
                  Upgrade Now
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={() => setShowLimitModal(false)} className="text-muted-foreground" data-testid="button-modal-dismiss">
                Maybe later
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <main className="flex-1">
          {/* ===== SECTION 1: Hero / Study Launcher ===== */}
          <section className="relative overflow-hidden" data-testid="section-flashcards-hero">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-transparent to-blue-100/30 pointer-events-none" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
              <div className="max-w-5xl mb-4">
                <BreadcrumbNav />
              </div>
              <div className="grid lg:grid-cols-[1fr,440px] gap-10 lg:gap-16 items-start">
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100/60 border border-violet-200/50 text-violet-700 text-xs font-medium mb-6" data-testid="badge-hero-tier">
                    <Stethoscope className="w-3.5 h-3.5" />
                    {isTestBank ? "Test Bank — RPN · RN · NP" : "Nursing Exam Prep — RPN · RN · NP"}
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground tracking-tight leading-[1.15] mb-5" data-testid="text-flashcard-heading">
                    {isTestBank ? "Test Bank: Exam-Style Practice Questions" : "Clinical Flashcards That Think Like Exam Questions"}
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-xl" data-testid="text-flashcard-subheading">
                    {isTestBank
                      ? "Tier-calibrated clinical scenarios with full rationales, distractor analysis, adaptive difficulty, and clinical pearls. Practice the way your exam tests you."
                      : "Tier-specific clinical scenarios with full rationales, clinical pearls, and distractor analysis. Built for how nursing exams actually test you."}
                  </p>

                  {!isTestBank && (
                    <div
                      className="mb-6 p-4 rounded-xl border border-violet-200/70 bg-white/80 shadow-sm max-w-xl"
                      data-testid="flashcards-recommended-path"
                    >
                      <p className="text-sm font-semibold text-foreground mb-1">{t("flashcards.recommendedPathTitle")}</p>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{t("flashcards.recommendedPathDesc")}</p>
                      <Button
                        size="sm"
                        className="rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
                        onClick={() => {
                          setDeckTab(user ? "my" : "browse");
                          setView("decks");
                        }}
                        data-testid="button-recommended-open-decks"
                      >
                        {t("flashcards.recommendedPathCta")}
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground mb-8">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Clinically reviewed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      NCLEX-aligned
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {allCards.length}+ cards
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      size="lg"
                      className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 h-13 shadow-lg shadow-violet-200/50 gap-2"
                      onClick={() => {
                        const configEl = document.getElementById("flashcard-config");
                        configEl?.scrollIntoView({ behavior: "smooth" });
                      }}
                      data-testid="button-hero-start-studying"
                    >
                      <Zap className="w-4 h-4" />
                      {isTestBank ? "Start Test Bank" : "Start Flashcard Session"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-2xl border-violet-200 text-violet-700 hover:bg-violet-50 font-medium px-7 h-13 gap-2"
                      onClick={() => {
                        const topicEl = document.getElementById("topic-filter-section");
                        topicEl?.scrollIntoView({ behavior: "smooth" });
                      }}
                      data-testid="button-hero-explore-topics"
                    >
                      <Search className="w-4 h-4" />
                      {isTestBank ? "Practice Questions" : "Explore Topics"}
                    </Button>
                  </div>

                  {user?.tier === "admin" && !isTestBank && (
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-xs text-muted-foreground hover:text-foreground/60"
                        onClick={() => setLocation("/content-editor")}
                        data-testid="button-admin-manage-flashcards"
                      >
                        <Pencil className="w-3 h-3" />
                        Manage Content
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-xs text-muted-foreground hover:text-foreground/60"
                        onClick={() => { fetchAdminExamQuestions(); setView("admin-exam-manager"); }}
                        data-testid="button-admin-exam-manager"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        Exam Question Manager
                      </Button>
                    </div>
                  )}
                </div>

                <div id="flashcard-config" className="w-full">
                  <Card className="border border-violet-100/80 shadow-xl shadow-violet-100/30 bg-white rounded-2xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-violet-50 bg-gradient-to-r from-violet-50/50 to-blue-50/30">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
                          <Settings2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-foreground">{t("pages.flashcards.studySetup")}</h2>
                          <p className="text-[11px] text-muted-foreground">{t("pages.flashcards.configureYourSession")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-5 space-y-5">
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">{t("pages.flashcards.cardType")}</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(["all", "term", "question"] as const).map(ct => (
                            <button
                              key={ct}
                              onClick={() => setSelectedType(ct)}
                              className={cn(
                                "py-2 px-3 rounded-xl text-xs font-medium transition-all border",
                                selectedType === ct
                                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                                  : "bg-white text-foreground/60 border-violet-100 hover:border-violet-200 hover:bg-violet-50/50"
                              )}
                              data-testid={`button-type-${ct}`}
                            >
                              {ct === "all" ? "Mixed" : ct === "term" ? "Terms" : "Questions"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">{t("pages.flashcards.sortOrder")}</label>
                        <div className="grid grid-cols-5 gap-1">
                          {([
                            { value: "default", label: "Default" },
                            { value: "alpha-asc", label: "A-Z" },
                            { value: "alpha-desc", label: "Z-A" },
                            { value: "category", label: "Topic" },
                            { value: "shuffle", label: "Shuffle" },
                          ] as const).map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setCardSortBy(opt.value)}
                              className={cn(
                                "py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all border",
                                cardSortBy === opt.value
                                  ? "bg-violet-600 text-white border-violet-600"
                                  : "bg-white text-foreground/50 border-violet-100 hover:border-violet-200"
                              )}
                              data-testid={`button-sort-${opt.value}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t("pages.flashcards.topics")}</label>
                          <div className="flex items-center gap-2">
                            {selectedCategories.length > 0 && (
                              <span className="text-[11px] font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                                {selectedCategories.length} selected
                              </span>
                            )}
                            <button
                              onClick={() => setShowTopicPanel(!showTopicPanel)}
                              className="text-[11px] font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
                              data-testid="button-toggle-topics"
                            >
                              {showTopicPanel ? "Hide" : "Choose Topics"}
                              <ChevronRight className={cn("w-3 h-3 transition-transform", showTopicPanel && "rotate-90")} />
                            </button>
                          </div>
                        </div>

                        {selectedCategories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {selectedCategories.map(cat => (
                              <span
                                key={cat}
                                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-violet-50 text-violet-700 text-[11px] font-medium border border-violet-100"
                              >
                                {catLabel(cat)}
                                <button
                                  onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}
                                  className="w-4 h-4 rounded-full hover:bg-violet-200 flex items-center justify-center transition-colors"
                                >
                                  <XCircle className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                            <button
                              onClick={() => setSelectedCategories([])}
                              className="text-[11px] text-muted-foreground hover:text-foreground/60 font-medium px-2"
                              data-testid="button-clear-topics"
                            >
                              Clear all
                            </button>
                          </div>
                        )}

                        {!showTopicPanel && selectedCategories.length === 0 && (
                          <p className="text-[11px] text-muted-foreground">All {categories.length} topics included</p>
                        )}
                      </div>

                      {mastered.length > 0 && (
                        <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
                          <input
                            type="checkbox"
                            checked={includeMastered}
                            onChange={(e) => setIncludeMastered(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-violet-200 text-violet-600 focus:ring-violet-300"
                            data-testid="checkbox-include-mastered"
                          />
                          <span className="text-xs text-muted-foreground">Include mastered cards ({mastered.length})</span>
                        </label>
                      )}
                    </div>

                    <div className="px-6 pb-6 pt-2 space-y-2.5">
                      <Button
                        className="w-full h-12 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200/40"
                        onClick={startSession}
                        disabled={filteredCards.length === 0 && !(user && isPaid)}
                        data-testid="button-start-session"
                      >
                        Start Session ({filteredCards.length} cards)
                      </Button>
                      {examHasResumable && isPaid && (
                        <Button
                          variant="outline"
                          className="w-full h-10 rounded-xl text-xs font-medium border-violet-200 text-violet-600 hover:bg-violet-50 gap-2"
                          onClick={() => { resumeExamSession(); setView("exam-flashcards"); }}
                          data-testid="button-resume-exam-session"
                        >
                          <History className="w-3.5 h-3.5" />
                          Resume Previous Session
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {showTopicPanel && (
            <section className="bg-white border-b border-violet-100/50" data-testid="section-topic-selector">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold text-foreground">{t("pages.flashcards.selectTopics")}</h2>
                      {selectedCategories.length > 0 && (
                        <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                          {selectedCategories.length} of {categories.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedCategories([...categories])}
                        className="text-xs font-medium text-violet-600 hover:text-violet-700"
                        data-testid="button-select-all-topics"
                      >
                        Select all
                      </button>
                      {selectedCategories.length > 0 && (
                        <button
                          onClick={() => setSelectedCategories([])}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground/60"
                          data-testid="button-clear-all-topics"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative mb-5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <Input
                      placeholder={t("pages.flashcards.searchTopicsOrSystems")}
                      value={topicSearch}
                      onChange={(e) => setTopicSearch(e.target.value)}
                      className="pl-9 h-10 rounded-xl border-violet-100 bg-violet-50/30 text-sm placeholder:text-muted-foreground/60 focus:border-violet-300 focus:ring-violet-200"
                      data-testid="input-topic-search"
                    />
                  </div>

                  <div className="space-y-1.5">
                    {filteredTopicGroups.map(group => {
                      const isExpanded = expandedGroups.includes(group.label) || topicSearch.trim().length > 0;
                      const selectedInGroup = group.topics.filter(t => selectedCategories.includes(t)).length;
                      return (
                        <div key={group.label} className="border border-violet-100/60 rounded-xl overflow-hidden bg-white">
                          <button
                            onClick={() => toggleGroup(group.label)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-violet-50/50 transition-colors"
                            data-testid={`button-group-${group.label.replace(/\s+/g, "-").toLowerCase()}`}
                          >
                            <span className="text-sm font-medium text-foreground/70">{group.label}</span>
                            <div className="flex items-center gap-2.5">
                              {selectedInGroup > 0 && (
                                <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                                  {selectedInGroup}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground">{group.topics.length}</span>
                              <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground/60 transition-transform", isExpanded && "rotate-90")} />
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-3 pt-1 border-t border-violet-50">
                              <div className="flex flex-wrap gap-1.5">
                                {group.topics.map(topic => {
                                  const isSelected = selectedCategories.includes(topic);
                                  return (
                                    <button
                                      key={topic}
                                      onClick={() => {
                                        setSelectedCategories(prev =>
                                          prev.includes(topic) ? prev.filter(c => c !== topic) : [...prev, topic]
                                        );
                                      }}
                                      className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                        isSelected
                                          ? "bg-violet-100 text-violet-700 border-violet-200 shadow-sm"
                                          : "bg-white text-foreground/50 border-violet-100/60 hover:border-violet-200 hover:bg-violet-50/50"
                                      )}
                                      data-testid={`button-topic-${topic.replace(/[\s\/]+/g, "-").toLowerCase()}`}
                                    >
                                      {catLabel(topic)}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {topicSearch && filteredTopicGroups.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No topics match "{topicSearch}"
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {user && isPaid && (
            <section className="py-8 bg-white border-b border-violet-50" data-testid="section-flashcard-dashboard">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FlashcardDashboardWidget userId={user.id} />
                <FlashcardAnalyticsPanel userId={user.id} />
              </div>
            </section>
          )}

          {/* ===== SECTION 2: How Flashcards Work ===== */}
          <section className="py-14 bg-white border-b border-violet-50" data-testid="section-how-flashcards-work">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-how-it-works-title">{isTestBank ? "How the Test Bank Works" : "How NurseNest Flashcards Work"}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  {isTestBank
                    ? <>Every question mirrors real exam scenarios — clinical stems, plausible distractors, and evidence-based rationales that teach you <em>{t("pages.flashcards.why")}</em>.</>
                    : <>Every card mirrors real nursing exam questions — clinical stems, plausible distractors, and evidence-based rationales that teach you <em>{t("pages.flashcards.why2")}</em>.</>}
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50/80 to-violet-50/30 border border-violet-100/60 text-center" data-testid="card-how-step-1">
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{t("pages.flashcards.clinicalScenario")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Each card presents a realistic patient scenario with clinical findings, lab values, and decision points.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-blue-50/30 border border-blue-100/60 text-center" data-testid="card-how-step-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{t("pages.flashcards.criticalThinking")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose from carefully crafted options that test your clinical reasoning — not just memorization.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 border border-emerald-100/60 text-center" data-testid="card-how-step-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{t("pages.flashcards.fullRationale")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Get detailed explanations for every answer — correct and incorrect — plus clinical pearls and exam tips.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 3: Tier Selector (RPN / RN / NP) ===== */}
          <section className="py-14 bg-gradient-to-b from-violet-50/30 to-white" data-testid="section-tier-selector">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-tier-title">{t("pages.flashcards.chooseYourExamTier")}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Content is calibrated to your certification level — from foundational RPN concepts to advanced NP clinical decision-making.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="rounded-2xl border-2 border-emerald-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-shadow" data-testid="card-tier-rpn">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">RPN</h3>
                  <p className="text-xs text-emerald-600 font-medium mb-3">{t("pages.flashcards.registeredPracticalNurse")}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    Foundational nursing concepts, safety, medication administration, and core clinical skills for RPN certification.
                  </p>
                  <Button
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold h-10"
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedCategories([]);
                      const configEl = document.getElementById("flashcard-config");
                      configEl?.scrollIntoView({ behavior: "smooth" });
                    }}
                    data-testid="button-tier-rpn-start"
                  >
                    Study RPN Cards
                  </Button>
                </div>
                <div className="rounded-2xl border-2 border-blue-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-shadow" data-testid="card-tier-rn">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">RN</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">{t("pages.flashcards.registeredNurse")}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    Advanced clinical reasoning, complex patient scenarios, pharmacology, and multi-system management for NCLEX-RN prep.
                  </p>
                  <Button
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold h-10"
                    onClick={() => {
                      setSelectedType("question");
                      setSelectedCategories([]);
                      const configEl = document.getElementById("flashcard-config");
                      configEl?.scrollIntoView({ behavior: "smooth" });
                    }}
                    data-testid="button-tier-rn-start"
                  >
                    Study RN Cards
                  </Button>
                </div>
                <div className="rounded-2xl border-2 border-violet-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative" data-testid="card-tier-np">
                  {!isPaid && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 text-[10px] font-semibold">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">NP</h3>
                  <p className="text-xs text-violet-600 font-medium mb-3">{t("pages.flashcards.nursePractitioner")}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    Graduate-level pharmacology, differential diagnosis, evidence-based practice, and autonomous clinical decision-making.
                  </p>
                  <Button
                    className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold h-10"
                    onClick={() => {
                      if (!isPaid) { setLocation("/pricing"); return; }
                      setSelectedType("question");
                      setSelectedCategories([]);
                      const configEl = document.getElementById("flashcard-config");
                      configEl?.scrollIntoView({ behavior: "smooth" });
                    }}
                    data-testid="button-tier-np-start"
                  >
                    {isPaid ? "Study NP Cards" : "Unlock NP Cards"}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 4: Study Modes (Learn / Test / Weak Areas / Rapid Review) ===== */}
          <section className="py-14 bg-white border-b border-violet-50" data-testid="section-study-modes">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-study-modes-title">{isTestBank ? "Practice Modes" : "Study Your Way"}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  {isTestBank
                    ? "Four practice modes designed for different phases of exam preparation — from content review to exam-day simulation."
                    : "Four study modes designed for different phases of exam preparation — from first exposure to exam-day simulation."}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <button
                  onClick={() => {
                    setSelectedType("term");
                    const configEl = document.getElementById("flashcard-config");
                    configEl?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group p-6 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white hover:shadow-lg hover:border-blue-200 transition-all text-left"
                  data-testid="card-mode-learn"
                >
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">{t("pages.flashcards.learnMode")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Flip through terms and concepts at your own pace with detailed explanations.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setSelectedType("question");
                    const configEl = document.getElementById("flashcard-config");
                    configEl?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group p-6 rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/50 to-white hover:shadow-lg hover:border-violet-200 transition-all text-left"
                  data-testid="card-mode-test"
                >
                  <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ClipboardCheck className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">{t("pages.flashcards.testMode")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Multiple-choice questions with immediate rationale and distractor analysis.
                  </p>
                </button>

                <button
                  onClick={() => setView("bookmarks")}
                  className="group p-6 rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white hover:shadow-lg hover:border-amber-200 transition-all text-left"
                  data-testid="card-mode-weak-areas"
                >
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Target className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">{isTestBank ? "Review Weak Areas" : "Weak Areas"}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isTestBank ? "Target questions you've struggled with and strengthen knowledge gaps." : "Review flagged cards and topics you've struggled with to strengthen gaps."}
                  </p>
                  {bookmarks.length > 0 && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {bookmarks.length} flagged
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!user) { setLocation("/pricing"); return; }
                    setView("adaptive");
                  }}
                  className="group p-6 rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/50 to-violet-50/50 hover:shadow-lg hover:border-rose-200 transition-all text-left relative"
                  data-testid="card-adaptive-study"
                >
                  <div className="absolute top-3 right-3">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Brain className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-sm font-bold text-rose-700 mb-1.5">{isTestBank ? "Start Adaptive Review" : "Adaptive Study"}</h3>
                  <p className="text-xs text-rose-500/70 leading-relaxed">
                    6 modes · Smart engine · Confidence tracking
                  </p>
                </button>

                <button
                  onClick={() => {
                    if (!isPaid) { setLocation("/pricing"); return; }
                    setExamStudyIndex(0);
                    setExamSelectedOption(null);
                    setExamShowRationale(false);
                    setExamSessionResults([]);
                    setView("exam-flashcards");
                  }}
                  className="group p-6 rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/50 to-white hover:shadow-lg hover:border-rose-200 transition-all text-left relative"
                  data-testid="card-mode-rapid-review"
                >
                  {!isPaid && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Zap className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">{t("pages.flashcards.rapidReview")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    CAT-style exam simulation with adaptive difficulty and clinical pearls.
                  </p>
                  {examFlashcardTotal > 0 && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {examFlashcardTotal.toLocaleString()} cards
                    </span>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* ===== SECTION 5: Topic Filter ===== */}
          <section id="topic-filter-section" className="py-14 bg-gradient-to-b from-violet-50/20 to-white" data-testid="section-topic-filter">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-topic-filter-title">{isTestBank ? "Browse Questions by Topic" : "Browse by Topic"}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  {isTestBank
                    ? "Filter questions by body system, specialty, or exam category to target your weak areas."
                    : "Filter by body system, specialty, or exam category to build a focused study session."}
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {categories.slice(0, 12).map(cat => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategories(prev =>
                            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                          );
                        }}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-medium transition-all border",
                          isSelected
                            ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                            : "bg-white text-foreground/60 border-violet-100 hover:border-violet-300 hover:bg-violet-50"
                        )}
                        data-testid={`chip-topic-${cat.replace(/[\s\/]+/g, "-").toLowerCase()}`}
                      >
                        {catLabel(cat)}
                      </button>
                    );
                  })}
                  {categories.length > 12 && (
                    <button
                      onClick={() => setShowTopicPanel(true)}
                      className="px-4 py-2 rounded-full text-xs font-medium border border-dashed border-violet-200 text-violet-600 hover:bg-violet-50 transition-all"
                      data-testid="button-show-all-topics"
                    >
                      +{categories.length - 12} more
                    </button>
                  )}
                </div>

                {selectedCategories.length > 0 && (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-violet-600">{filteredCards.length}</span> cards match your selection
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 h-10 gap-2"
                        onClick={startSession}
                        disabled={filteredCards.length === 0 && !(user && isPaid)}
                        data-testid="button-topic-start-session"
                      >
                        Start Session
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-xl text-muted-foreground text-xs"
                        onClick={() => setSelectedCategories([])}
                        data-testid="button-topic-clear-all"
                      >
                        Clear all
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => setView("bookmarks")}
                  className="group flex flex-col items-start p-4 bg-white rounded-2xl border border-amber-100/60 hover:border-amber-200 hover:shadow-md transition-all text-left"
                  data-testid="card-bookmarks"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                    <Flag className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70 mb-0.5">{t("pages.flashcards.flaggedForReview")}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {bookmarks.length > 0 ? `${bookmarks.length} cards saved` : "No cards flagged"}
                  </span>
                </button>

                <button
                  onClick={() => setView("mastered")}
                  className="group flex flex-col items-start p-4 bg-white rounded-2xl border border-emerald-100/60 hover:border-emerald-200 hover:shadow-md transition-all text-left"
                  data-testid="card-mastered"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70 mb-0.5">{t("pages.flashcards.masteredCards")}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {mastered.length > 0 ? `${mastered.length} cards mastered` : "None yet"}
                  </span>
                </button>

                <button
                  onClick={() => { setView(user ? "mycards" : "mycards"); fetchCustomCards(); }}
                  className="group flex flex-col items-start p-4 bg-white rounded-2xl border border-blue-100/60 hover:border-blue-200 hover:shadow-md transition-all text-left"
                  data-testid="card-mycards"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    <Plus className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70 mb-0.5">{t("pages.flashcards.myFlashcards")}</span>
                  <span className="text-[11px] text-muted-foreground">{user ? "Create and manage" : "Sign in to create"}</span>
                </button>

                <button
                  onClick={() => { setView("decks"); fetchMyDecks(); fetchPublicDecks(); fetchEntitlement(); }}
                  className="group flex flex-col items-start p-4 bg-white rounded-2xl border border-violet-100/60 hover:border-violet-200 hover:shadow-md transition-all text-left relative"
                  data-testid="card-study-decks"
                >
                  {!isPaid && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground/60" />
                    </div>
                  )}
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
                    <Layers className="w-4 h-4 text-violet-500" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70 mb-0.5">{t("pages.flashcards.studyDecks")}</span>
                  <span className="text-[11px] text-muted-foreground">{t("pages.flashcards.customShared")}</span>
                </button>

                <button
                  onClick={() => {
                    if (!isPaid) { setLocation("/pricing"); return; }
                    setAdaptiveMode("learn");
                    fetchAdaptiveSession("learn");
                    setView("adaptive-learn");
                  }}
                  className="group flex flex-col items-start p-4 bg-white rounded-2xl border border-blue-100/60 hover:border-blue-200 hover:shadow-md transition-all text-left relative"
                  data-testid="card-adaptive-learn"
                >
                  {!isPaid && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground/60" />
                    </div>
                  )}
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70 mb-0.5">{t("pages.flashcards.adaptiveLearn")}</span>
                  <span className="text-[11px] text-muted-foreground">{t("pages.flashcards.examstylePersonalized")}</span>
                </button>

                <button
                  onClick={() => {
                    if (!isPaid) { setLocation("/pricing"); return; }
                    setAdaptiveMode("test");
                    fetchAdaptiveSession("test");
                    setView("adaptive-test");
                  }}
                  className="group flex flex-col items-start p-4 bg-white rounded-2xl border border-rose-100/60 hover:border-rose-200 hover:shadow-md transition-all text-left relative"
                  data-testid="card-adaptive-test"
                >
                  {!isPaid && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground/60" />
                    </div>
                  )}
                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70 mb-0.5">{t("pages.flashcards.adaptiveTest")}</span>
                  <span className="text-[11px] text-muted-foreground">{t("pages.flashcards.examPrepNoHints")}</span>
                </button>
              </div>

              {user && !entitlement.isPremium && entitlement.percentage > 0 && (
                <div className="mt-6 bg-white rounded-2xl border border-violet-100/60 p-4 max-w-2xl mx-auto" data-testid="flashcard-usage-counter">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground" data-testid="text-usage-count">
                      {entitlement.totalFreeCards} / {entitlement.limit} free cards used
                    </span>
                    {entitlement.percentage >= 80 && (
                      <a href="/upgrade" className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1" data-testid="link-upgrade-cta">
                        Upgrade
                      </a>
                    )}
                  </div>
                  <div className="w-full bg-violet-50 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        entitlement.percentage >= 90 ? "bg-red-400" :
                        entitlement.percentage >= 80 ? "bg-amber-400" :
                        "bg-violet-400"
                      )}
                      style={{ width: `${Math.min(entitlement.percentage, 100)}%` }}
                      data-testid="progress-usage-bar"
                    />
                  </div>
                  {entitlement.percentage >= 100 && (
                    <p className="mt-2 text-[11px] text-red-600" data-testid="text-limit-reached">
                      Limit reached. <a href="/upgrade" className="font-semibold underline">{t("pages.flashcards.upgrade")}</a> for unlimited cards.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ===== SECTION 6: Adaptive Study Modes ===== */}
          <section className="py-14 bg-white border-b border-violet-50" data-testid="section-study-modes">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{isTestBank ? "Adaptive Review Modes" : "Adaptive Study Modes"}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Exam questions are prioritized based on your weak areas, missed questions, and spaced repetition schedule.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                <button
                  onClick={() => {
                    if (!isPaid) { setLocation("/pricing"); return; }
                    setAdaptiveMode("learn");
                    fetchAdaptiveSession("learn");
                    setView("adaptive-learn");
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-100/50 hover:border-blue-200 hover:shadow-md transition-all text-left relative"
                  data-testid="button-learn-mode"
                >
                  {!isPaid && <div className="absolute top-3 right-3"><Lock className="w-3 h-3 text-muted-foreground/60" /></div>}
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{t("pages.flashcards.learnMode2")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Exam-style questions with immediate answer reveal, rationale, clinical pearls, and lesson links.
                  </p>
                </button>

                <button
                  onClick={() => {
                    if (!isPaid) { setLocation("/pricing"); return; }
                    setAdaptiveMode("test");
                    fetchAdaptiveSession("test");
                    setView("adaptive-test");
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border border-rose-100/50 hover:border-rose-200 hover:shadow-md transition-all text-left relative"
                  data-testid="button-test-mode"
                >
                  {!isPaid && <div className="absolute top-3 right-3"><Lock className="w-3 h-3 text-muted-foreground/60" /></div>}
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{t("pages.flashcards.testMode2")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Answer first, then reveal rationale. No timer pressure. Tracks confidence and weak areas.
                  </p>
                </button>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-violet-50/60 to-white border border-violet-100/50 text-left">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
                    <Target className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{t("pages.flashcards.adaptiveEngine")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Cards are prioritized based on your missed questions, weak areas, and spaced repetition schedule.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 6b: Why NurseNest Flashcards ===== */}
          <section className="py-14 bg-white border-b border-violet-50" data-testid="section-why-nursenest">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-why-title">{t("pages.flashcards.whyNursenestFlashcards")}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Purpose-built for nursing students and new grads preparing for RPN, RN, and NP certification exams.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-violet-50/60 to-white border border-violet-100/50" data-testid="card-why-1">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{t("pages.flashcards.examstyleQuestions")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every question mirrors real NCLEX, CPNRE, and NP certification exam formats with clinical stems.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-100/50" data-testid="card-why-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{t("pages.flashcards.evidencebasedRationales")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Detailed explanations reference current clinical guidelines, pharmacology standards, and best practices.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-100/50 relative" data-testid="card-why-3">
                  {!isPaid && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      <Crown className="w-3 h-3" />
                      <span className="text-[10px] font-semibold">{t("pages.flashcards.premium")}</span>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{t("pages.flashcards.progressTracking")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Track mastered cards, flagged weak areas, and session performance to focus your study time.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border border-rose-100/50" data-testid="card-why-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{t("pages.flashcards.tierspecificContent")}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    RPN, RN, and NP cards are calibrated to scope of practice and exam complexity at each level.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-border bg-secondary/50 relative opacity-75" data-testid="card-mode-adaptive">
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    <Crown className="w-3 h-3" />
                    <span className="text-[10px] font-semibold">{t("pages.flashcards.premium2")}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3.5">
                    <Zap className="w-4.5 h-4.5 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{isTestBank ? "Start Adaptive Review" : "Adaptive Review"}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    AI-powered spaced repetition that adapts to your weak areas and optimizes recall.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-border bg-secondary/50 relative opacity-75" data-testid="card-mode-weak-areas">
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    <Crown className="w-3 h-3" />
                    <span className="text-[10px] font-semibold">{t("pages.flashcards.premium3")}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-3.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{isTestBank ? "Review Weak Areas" : "Weak Areas"}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isTestBank ? "Target questions you've missed most often for focused improvement." : "Focus on topics you've missed most often for targeted improvement."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 7: Screenshot Preview ===== */}
          <section className="py-14 bg-gradient-to-b from-violet-50/20 to-white" data-testid="section-screenshot-preview">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-preview-title">{t("pages.flashcards.seeHowItWorks")}</h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Each flashcard presents a clinical scenario with multiple-choice options, followed by a comprehensive rationale.
                </p>
              </div>
              <div className="max-w-3xl mx-auto">
                <div className="rounded-2xl border border-violet-100/60 bg-white shadow-xl shadow-violet-100/20 overflow-hidden">
                  <div className="px-4 py-2.5 bg-gradient-to-r from-violet-50 to-blue-50 border-b border-violet-100/40 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium ml-2">{isTestBank ? "NurseNest Test Bank" : "NurseNest Flashcard Session"}</span>
                  </div>
                  <div className="p-6 sm:p-8" data-testid="preview-question-card">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-semibold border border-blue-100">{t("pages.flashcards.cardiovascular")}</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-semibold border border-amber-100">{t("pages.flashcards.difficulty3")}</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-violet-50 text-violet-600 text-[10px] font-semibold border border-violet-100">{t("pages.flashcards.rnTier")}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-relaxed mb-5">
                      A client with acute STEMI has just received alteplase (tPA). Which assessment finding requires the MOST immediate nursing intervention?
                    </p>
                    <div className="space-y-2.5">
                      {["Blood pressure 148/92 mmHg", "Oozing from the IV insertion site", "Sudden onset severe headache with altered mental status", "Heart rate of 56 bpm"].map((opt, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm",
                            i === 2
                              ? "border-emerald-300 bg-emerald-50/50"
                              : "border-violet-100/60 bg-white"
                          )}
                        >
                          <span className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0",
                            i === 2
                              ? "bg-emerald-500 text-white"
                              : "bg-violet-50 text-violet-600 border border-violet-100"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-foreground/80 text-xs">{opt}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t("pages.flashcards.clinicalPearl")}</span>
                      </div>
                      <p className="text-xs text-emerald-800/80 leading-relaxed">
                        After administering tPA, perform neurological checks every 15 minutes for the first 2 hours. Any sudden change warrants immediate CT scan...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== Study Tools (preserved) ===== */}
          {(dbFlashcardSets.length > 0 || user) && (
            <section className="py-10 bg-white border-b border-violet-50" data-testid="section-personal-tools">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">{t("pages.flashcards.studyTools")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {user && (
                    <button
                      onClick={() => { setView("mycards"); fetchCustomCards(); }}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-violet-100/60 hover:border-violet-200 hover:shadow-md transition-all text-left"
                      data-testid="button-create-deck"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Plus className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-foreground/70 block">{t("pages.flashcards.createCustomCards")}</span>
                        <span className="text-[11px] text-muted-foreground">{t("pages.flashcards.accuracyValidated")}</span>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => { setView("decks"); fetchMyDecks(); fetchPublicDecks(); fetchEntitlement(); }}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-violet-100/60 hover:border-violet-200 hover:shadow-md transition-all text-left"
                    data-testid="button-browse-decks"
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-violet-500" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-foreground/70 block">{t("pages.flashcards.sharedDecks")}</span>
                      <span className="text-[11px] text-muted-foreground">{t("pages.flashcards.browseCommunity")}</span>
                    </div>
                  </button>

                  {user && (
                    <button
                      onClick={() => { setView("decks"); fetchMyDecks(); fetchPublicDecks(); fetchEntitlement(); }}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-violet-100/60 hover:border-violet-200 hover:shadow-md transition-all text-left"
                      data-testid="button-my-decks"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-foreground/70 block">{t("pages.flashcards.mySavedDecks")}</span>
                        <span className="text-[11px] text-muted-foreground">{t("pages.flashcards.personalCollection")}</span>
                      </div>
                    </button>
                  )}

                  {dbFlashcardSets.length > 0 && (
                    <button
                      onClick={() => setView("admin-sets")}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-violet-100/60 hover:border-violet-200 hover:shadow-md transition-all text-left"
                      data-testid="card-admin-flashcard-sets"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-foreground/70 block">{t("pages.flashcards.curatedSets")}</span>
                        <span className="text-[11px] text-muted-foreground">{dbFlashcardSets.length} {dbFlashcardSets.length === 1 ? "set" : "sets"} available</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ===== SECTION 8: Final CTA ===== */}
          <section className="py-16 bg-gradient-to-br from-violet-600 via-violet-700 to-blue-700 relative overflow-hidden" data-testid="section-flashcards-final-cta">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-50" />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-6 backdrop-blur-sm border border-white/10">
                <Star className="w-3.5 h-3.5" />
                Used by thousands of nursing students
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-title">
                Ready to Start Studying?
              </h2>
              <p className="text-violet-100 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
                Join nursing students across Canada who use NurseNest flashcards to prepare for their RPN, RN, and NP certification exams with confidence.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-2xl bg-white text-violet-700 hover:bg-violet-50 font-semibold px-8 h-13 shadow-lg gap-2"
                  onClick={() => {
                    const configEl = document.getElementById("flashcard-config");
                    configEl?.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-testid="button-cta-start-session"
                >
                  <Zap className="w-4 h-4" />
                  {isTestBank ? "Start Test Bank" : "Start Flashcard Session"}
                </Button>
                {!isPaid && (
                  <LocaleLink href="/pricing">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-2xl border-white/30 text-white hover:bg-white/10 font-medium px-7 h-13"
                      data-testid="button-cta-view-plans"
                    >
                      View Plans
                    </Button>
                  </LocaleLink>
                )}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-violet-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Nursing flashcards
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NCLEX flashcards
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  RPN exam flashcards
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NP certification prep
                </span>
              </div>
            </div>
          </section>

          <div className="mt-10" data-testid="flashcards-social-proof">
            <SocialProofBar />
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (view === "mycards") {
    const customCategories = Array.from(new Set(customCards.map(c => c.category)));

    const renderMycardsListCard = (card: CustomCard) => (
      <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden hover:shadow-md transition-shadow" data-testid={`card-custom-${card.id}`}>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{catLabel(card.category)}</span>
              </div>
              <h4 className="font-bold text-foreground text-sm mb-1" data-testid={`text-question-${card.id}`}>{card.question}</h4>
              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2" data-testid={`text-answer-${card.id}`}>{card.answer}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-muted-foreground hover:text-primary"
                onClick={() => { setEditingCard(card); setValidationResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                data-testid={`button-edit-${card.id}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-muted-foreground hover:text-red-500"
                onClick={() => handleDeleteCard(card.id)}
                data-testid={`button-delete-${card.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );

    if (!user) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
            <Button variant="ghost" className="mb-8 gap-2" onClick={() => setView("setup")} data-testid="button-back-mycards">
              <ArrowLeft className="w-4 h-4" />
              {t("flashcards.backToConfig")}
            </Button>
            <Card className="border-none shadow-xl bg-card p-12 rounded-3xl text-center">
              <Lock className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("flashcards.signInToCreate")}</h2>
              <p className="text-muted-foreground mb-6">{t("flashcards.signInDesc")}</p>
              <Button className="rounded-xl" onClick={() => setLocation("/signup")} data-testid="button-signup-mycards">{t("flashcards.createFreeAccount")}</Button>
            </Card>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
          <Button variant="ghost" className="mb-8 gap-2" onClick={() => setView("setup")} data-testid="button-back-mycards">
            <ArrowLeft className="w-4 h-4" />
            {t("flashcards.backToConfig")}
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-mycards-title">{t("flashcards.myFlashcards")}</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {!isPaid ? `${customCards.length} / ${FREE_LIMIT} ${t("flashcards.cardsUsed")}` : `${customCards.length} ${t("flashcards.cardsCreated")}`}
                {!isPaid && customCards.length >= FREE_LIMIT && (
                  <span className="text-amber-600 ml-2 font-medium">- {t("flashcards.upgradeUnlimited")}</span>
                )}
              </p>
            </div>
            {customCards.length >= 2 && (
              <Button
                className="rounded-xl gap-2"
                onClick={() => { setMyCardsStudyIndex(0); setMyCardsFlipped(false); setView("mycards-study"); }}
                data-testid="button-study-mycards"
              >
                <BookOpen className="w-4 h-4" />
                {t("flashcards.study")} ({customCards.length})
              </Button>
            )}
          </div>

          <Card className="border-none shadow-xl bg-card p-8 rounded-3xl mb-8" data-testid="card-create-flashcard">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">{editingCard ? t("flashcards.editCard") : t("flashcards.createNewCard")}</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-auto">{t("flashcards.accuracyVerified")}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">{t("flashcards.frontLabel")}</label>
                <Input
                  placeholder="e.g., What are the signs of right-sided heart failure?"
                  value={editingCard ? editingCard.question : newQuestion}
                  onChange={(e) => editingCard ? setEditingCard({ ...editingCard, question: e.target.value }) : setNewQuestion(e.target.value)}
                  className="rounded-xl"
                  data-testid="input-flashcard-question"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">{t("flashcards.backLabel")}</label>
                <Textarea
                  placeholder="e.g., Peripheral edema, jugular venous distension (JVD), hepatomegaly, weight gain, ascites"
                  value={editingCard ? editingCard.answer : newAnswer}
                  onChange={(e) => editingCard ? setEditingCard({ ...editingCard, answer: e.target.value }) : setNewAnswer(e.target.value)}
                  className="rounded-xl min-h-[100px]"
                  data-testid="input-flashcard-answer"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">{t("flashcards.category")}</label>
                <Input
                  placeholder="e.g., Cardiac, Pharmacology, Maternity"
                  value={editingCard ? editingCard.category : newCategory}
                  onChange={(e) => editingCard ? setEditingCard({ ...editingCard, category: e.target.value }) : setNewCategory(e.target.value)}
                  className="rounded-xl"
                  data-testid="input-flashcard-category"
                />
              </div>

              {validationResult && (
                <div className={cn(
                  "p-4 rounded-xl flex items-start gap-3",
                  validationResult.accurate ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                )} data-testid="text-validation-result">
                  {validationResult.accurate ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-semibold text-sm">{validationResult.accurate ? t("flashcards.medicallyAccurate") : t("flashcards.needsRevision")}</p>
                    <p className="text-xs mt-1">{validationResult.feedback}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {editingCard ? (
                  <>
                    <Button
                      className="rounded-xl gap-2 flex-1"
                      onClick={handleUpdateCard}
                      disabled={validating || !editingCard.question.trim() || !editingCard.answer.trim()}
                      data-testid="button-update-flashcard"
                    >
                      {validating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {validating ? t("flashcards.validating") : t("flashcards.validateAndUpdate")}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => { setEditingCard(null); setValidationResult(null); }}
                      data-testid="button-cancel-edit"
                    >
                      {t("common.cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    className="rounded-xl gap-2 w-full h-12"
                    onClick={handleValidateAndSave}
                    disabled={validating || saving || !newQuestion.trim() || !newAnswer.trim() || (!isPaid && customCards.length >= FREE_LIMIT)}
                    data-testid="button-create-flashcard"
                  >
                    {validating ? <RefreshCw className="w-4 h-4 animate-spin" /> : saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {validating ? t("flashcards.validating") : saving ? t("flashcards.saving") : t("flashcards.validateAndCreate")}
                  </Button>
                )}
              </div>

              {!isPaid && customCards.length >= FREE_LIMIT && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl" data-testid="text-upgrade-prompt">
                  <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">{t("flashcards.freeLimitReached")} ({FREE_LIMIT} {t("flashcards.cards")})</p>
                    <p className="text-xs text-amber-600 mt-0.5">{t("flashcards.upgradeForUnlimited")}</p>
                  </div>
                  <Button size="sm" className="rounded-xl ml-auto shrink-0" onClick={() => setLocation("/pricing")} data-testid="button-upgrade-mycards">{t("flashcards.upgrade")}</Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-none shadow-xl bg-card p-8 rounded-3xl mb-8" data-testid="card-ai-generator-mycards">
            <button
              className="flex items-center gap-2 w-full text-left"
              onClick={() => setMycardsShowAi(!mycardsShowAi)}
              data-testid="button-toggle-ai-generator"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{t("pages.flashcards.aiFlashcardGenerator")}</h3>
                <p className="text-xs text-muted-foreground">{t("pages.flashcards.generateFlashcardsFromATopic")}</p>
              </div>
              <ChevronRight className={cn("w-5 h-5 text-muted-foreground transition-transform", mycardsShowAi && "rotate-90")} />
            </button>

            {mycardsShowAi && (
              <div className="mt-6 space-y-4">
                <div className="flex gap-1 bg-secondary rounded-xl p-1">
                  <button
                    onClick={() => setMycardsAiMode("topic")}
                    className={cn("flex-1 px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors",
                      mycardsAiMode === "topic" ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/50 hover:bg-secondary"
                    )}
                    data-testid="button-mycards-mode-topic"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> From Topic
                  </button>
                  <button
                    onClick={() => setMycardsAiMode("notes")}
                    className={cn("flex-1 px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors",
                      mycardsAiMode === "notes" ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/50 hover:bg-secondary"
                    )}
                    data-testid="button-mycards-mode-notes"
                  >
                    <Upload className="w-3.5 h-3.5" /> From Notes
                  </button>
                </div>

                {mycardsAiMode === "topic" ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">{t("pages.flashcards.topicOrPrompt")}</label>
                      <Input
                        placeholder="e.g., Cardiac medications and their side effects"
                        value={mycardsAiPrompt}
                        onChange={(e) => setMycardsAiPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && mycardsAiPrompt.trim()) mycardsAiGenerate(); }}
                        className="rounded-xl"
                        data-testid="input-ai-prompt-mycards"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("pages.flashcards.cards")}</label>
                      <select
                        value={mycardsAiCount}
                        onChange={(e) => setMycardsAiCount(parseInt(e.target.value))}
                        className="text-sm border rounded-lg px-2 py-1"
                        data-testid="select-ai-count-mycards"
                      >
                        {[3, 5, 10, 15, 20, 25, 30, 40, 50].map(n => <option key={n} value={n}>{n}{n > 25 ? " ⭐" : ""}</option>)}
                      </select>
                      <Button
                        onClick={mycardsAiGenerate}
                        disabled={mycardsAiGenerating || !mycardsAiPrompt.trim()}
                        className="rounded-xl gap-2 ml-auto"
                        data-testid="button-ai-generate-mycards"
                      >
                        {mycardsAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        {mycardsAiGenerating ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".txt,.md,.csv,.rtf,text/*"
                        onChange={handleMycardsNotesFile}
                        className="hidden"
                        id="mycards-notes-file"
                        data-testid="input-mycards-notes-file"
                      />
                      <label htmlFor="mycards-notes-file" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-blue-300" />
                        <span className="text-xs text-blue-600 font-medium">{t("pages.flashcards.clickToUploadAText")}</span>
                        <span className="text-[10px] text-muted-foreground">{t("pages.flashcards.txtMdCsvRtfMax")}</span>
                      </label>
                      {mycardsNotesFileName && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg" data-testid="text-mycards-notes-filename">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {mycardsNotesFileName}
                        </div>
                      )}
                    </div>
                    <Textarea
                      placeholder={t("pages.flashcards.orPasteYourStudyNotes")}
                      value={mycardsNotesText}
                      onChange={(e) => setMycardsNotesText(e.target.value)}
                      className="rounded-xl min-h-[120px] border-blue-200 focus:border-blue-400 text-sm"
                      data-testid="textarea-mycards-notes"
                    />
                    {mycardsNotesText && (
                      <p className="text-[10px] text-muted-foreground">{mycardsNotesText.length.toLocaleString()} characters</p>
                    )}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("pages.flashcards.cards2")}</label>
                      <select
                        value={mycardsAiCount}
                        onChange={(e) => setMycardsAiCount(parseInt(e.target.value))}
                        className="text-sm border rounded-lg px-2 py-1"
                        data-testid="select-notes-count-mycards"
                      >
                        {[3, 5, 10, 15, 20, 25, 30, 40, 50].map(n => <option key={n} value={n}>{n}{n > 25 ? " ⭐" : ""}</option>)}
                      </select>
                      <Button
                        onClick={mycardsNotesGenerate}
                        disabled={mycardsAiGenerating || !mycardsNotesText.trim()}
                        className="rounded-xl gap-2 ml-auto bg-blue-600 hover:bg-blue-700"
                        data-testid="button-notes-generate-mycards"
                      >
                        {mycardsAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {mycardsAiGenerating ? "Converting..." : "Convert Notes"}
                      </Button>
                    </div>
                  </>
                )}

                {mycardsAiCards.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-primary">{mycardsAiCards.length} cards generated — review before adding:</p>
                      <Button size="sm" className="rounded-xl gap-2" onClick={mycardsAiAddAll} data-testid="button-ai-add-all-mycards">
                        <Plus className="w-3 h-3" />
                        Add All to My Cards
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {mycardsAiCards.map((card, idx) => (
                        <div key={idx} className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-sm" data-testid={`ai-card-preview-${idx}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-xs mb-1">Q: {card.question}</p>
                              <p className="text-foreground/60 text-xs">A: {card.answer}</p>
                            </div>
                            <button
                              onClick={() => mycardsAiRemove(idx)}
                              className="text-muted-foreground hover:text-red-500 shrink-0 p-1"
                              data-testid={`button-ai-remove-${idx}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {customCards.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("flashcards.searchCards")}
                    value={customSearch}
                    onChange={(e) => setCustomSearch(e.target.value)}
                    className="pl-10 rounded-xl"
                    data-testid="input-search-mycards"
                  />
                </div>
                <select
                  value={cardSortBy}
                  onChange={(e) => setCardSortBy(e.target.value as any)}
                  className="text-xs border rounded-lg px-2 py-1.5 bg-card text-foreground/70 cursor-pointer"
                  data-testid="select-mycards-sort"
                >
                  <option value="default">{t("pages.flashcards.defaultOrder")}</option>
                  <option value="alpha-asc">{t("pages.flashcards.aToZ")}</option>
                  <option value="alpha-desc">{t("pages.flashcards.zToA")}</option>
                  <option value="category">{t("pages.flashcards.byTopic")}</option>
                </select>
                {customCategories.length > 1 && (
                  <div className="flex gap-1 flex-wrap">
                    {customCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCustomSearch(customSearch === cat ? "" : cat)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                          customSearch === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/60 hover:bg-secondary/80"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {mycardsDisplayCards.length >= MYCARDS_VIRTUAL_THRESHOLD ? (
                <div
                  ref={mycardsListScrollRef}
                  className="max-h-[min(70vh,860px)] overflow-y-auto rounded-2xl border border-border/40 bg-muted/15"
                  data-testid="mycards-list-virtual-scroll"
                >
                  <div
                    className="relative w-full"
                    style={{ height: `${mycardsVirtualizer.getTotalSize()}px` }}
                  >
                    {mycardsVirtualizer.getVirtualItems().map(vRow => {
                      const card = mycardsDisplayCards[vRow.index];
                      return (
                        <div
                          key={card.id}
                          data-index={vRow.index}
                          ref={mycardsVirtualizer.measureElement}
                          className="absolute top-0 left-0 w-full pb-3 px-0.5 box-border"
                          style={{ transform: `translateY(${vRow.start}px)` }}
                        >
                          {renderMycardsListCard(card)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {mycardsDisplayCards.map(card => (
                    <Fragment key={card.id}>{renderMycardsListCard(card)}</Fragment>
                  ))}
                </div>
              )}

              {mycardsDisplayCards.length === 0 && customSearch && (
                <p className="text-center text-muted-foreground text-sm py-8">{t("flashcards.noCardsMatch")} "{customSearch}"</p>
              )}
            </>
          )}

          {customCards.length === 0 && !customCardsLoading && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("flashcards.noCardsYet")}</h3>
              <p className="text-muted-foreground text-sm">{t("flashcards.noCardsDesc")}</p>
            </div>
          )}

          {customCardsLoading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "decks" || view === "browse-decks") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
          <Button variant="ghost" className="mb-8 gap-2" onClick={() => setView("setup")} data-testid="button-back-decks">
            <ArrowLeft className="w-4 h-4" /> {t("flashcards.backToConfig")}
          </Button>
          <DegradedModeIndicator mode={degradedMode} />
          <FlashcardErrorBoundary section="deck-list" onStudyEmergencyDeck={() => { activateEmergencyMode(); setView("deck-view"); setCurrentDeck(EMERGENCY_NURSING_DECK as any); }}>
          <DeckHub
            user={user}
            isPaid={!!isPaid}
            setView={setView}
            setLocation={setLocation}
            myDecks={myDecks}
            setMyDecks={setMyDecks}
            publicDecks={publicDecks}
            savedDecksList={savedDecksList}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            deckCards={deckCards}
            setDeckCards={setDeckCards}
            deckLoading={deckLoading}
            entitlement={entitlement}
            deckTab={deckTab}
            setDeckTab={setDeckTab}
            deckSearchQuery={deckSearchQuery}
            setDeckSearchQuery={setDeckSearchQuery}
            fetchMyDecks={fetchMyDecks}
            fetchPublicDecks={fetchPublicDecks}
            fetchSavedDecks={fetchSavedDecks}
            fetchDeckCards={fetchDeckCards}
            fetchEntitlement={fetchEntitlement}
            createDeck={createDeck}
            deleteDeck={deleteDeck}
            saveDeck={saveDeck}
            duplicateDeck={duplicateDeck}
            newDeckTitle={newDeckTitle}
            setNewDeckTitle={setNewDeckTitle}
            newDeckDescription={newDeckDescription}
            setNewDeckDescription={setNewDeckDescription}
            newDeckVisibility={newDeckVisibility}
            setNewDeckVisibility={setNewDeckVisibility}
          />
          </FlashcardErrorBoundary>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-view") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
          <DegradedModeIndicator mode={degradedMode} />
          <FlashcardErrorBoundary section="card-viewer" onStudyEmergencyDeck={() => { activateEmergencyMode(); setCurrentDeck(EMERGENCY_NURSING_DECK as any); }}>
          <DeckView
            user={user}
            isPaid={!!isPaid}
            setView={setView}
            setLocation={setLocation}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            deckCards={deckCards}
            fetchDeckCards={fetchDeckCards}
            startDeckStudy={startDeckStudy}
            deleteDeck={deleteDeck}
            saveDeck={saveDeck}
            duplicateDeck={duplicateDeck}
            reportDeck={reportDeck}
            entitlement={entitlement}
            aiGeneratePrompt={aiGeneratePrompt}
            setAiGeneratePrompt={setAiGeneratePrompt}
            aiGenerateCount={aiGenerateCount}
            setAiGenerateCount={setAiGenerateCount}
            aiGenerating={aiGenerating}
            aiGeneratedCards={aiGeneratedCards}
            aiGenerateCards={aiGenerateCards}
            addAiGeneratedCards={addAiGeneratedCards}
            removeAiGeneratedCard={removeAiGeneratedCard}
            aiUpgradeRequired={aiUpgradeRequired}
            fetchEntitlement={fetchEntitlement}
          />
          </FlashcardErrorBoundary>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-edit") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
          <FlashcardErrorBoundary section="card-viewer" onStudyEmergencyDeck={() => { activateEmergencyMode(); setView("deck-view"); setCurrentDeck(EMERGENCY_NURSING_DECK as any); }}>
          <DeckEditor
            user={user}
            isPaid={!!isPaid}
            setView={setView}
            setLocation={setLocation}
            currentDeck={currentDeck}
            deckCards={deckCards}
            setDeckCards={setDeckCards}
            addCardToDeck={addCardToDeck}
            deleteDeckCard={deleteDeckCard}
            aiCheckCard={aiCheckCard}
            handleCsvImport={handleCsvImport}
            entitlement={entitlement}
            newCardFront={newCardFront}
            setNewCardFront={setNewCardFront}
            newCardBack={newCardBack}
            setNewCardBack={setNewCardBack}
            newCardRationale={newCardRationale}
            setNewCardRationale={setNewCardRationale}
            newCardClinicalPearl={newCardClinicalPearl}
            setNewCardClinicalPearl={setNewCardClinicalPearl}
            aiCheckResult={aiCheckResult}
            aiChecking={aiChecking}
            csvImportText={csvImportText}
            setCsvImportText={setCsvImportText}
            showCsvImport={showCsvImport}
            setShowCsvImport={setShowCsvImport}
            fetchDeckCards={fetchDeckCards}
            fetchEntitlement={fetchEntitlement}
            aiGeneratePrompt={aiGeneratePrompt}
            setAiGeneratePrompt={setAiGeneratePrompt}
            aiGenerateCount={aiGenerateCount}
            setAiGenerateCount={setAiGenerateCount}
            aiGenerating={aiGenerating}
            aiGeneratedCards={aiGeneratedCards}
            aiGenerateCards={aiGenerateCards}
            addAiGeneratedCards={addAiGeneratedCards}
            removeAiGeneratedCard={removeAiGeneratedCard}
            aiUpgradeRequired={aiUpgradeRequired}
          />
          </FlashcardErrorBoundary>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-study-learn") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
          <FlashcardErrorBoundary section="card-viewer" onStudyEmergencyDeck={() => { activateEmergencyMode(); setView("deck-view"); setCurrentDeck(EMERGENCY_NURSING_DECK as any); }}>
          <DeckStudyLearn
            user={user}
            setView={setView}
            currentDeck={currentDeck}
            deckStudyQueue={deckStudyQueue}
            deckStudyIndex={deckStudyIndex}
            deckStudyFlipped={deckStudyFlipped}
            setDeckStudyFlipped={setDeckStudyFlipped}
            deckStudyCorrect={deckStudyCorrect}
            deckStudyIncorrect={deckStudyIncorrect}
            handleDeckStudyAnswer={handleDeckStudyAnswer}
          />
          </FlashcardErrorBoundary>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-study-test") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
          <FlashcardErrorBoundary section="card-viewer" onStudyEmergencyDeck={() => { activateEmergencyMode(); setView("deck-view"); setCurrentDeck(EMERGENCY_NURSING_DECK as any); }}>
          <DeckStudyTest
            user={user}
            setView={setView}
            currentDeck={currentDeck}
            deckStudyQueue={deckStudyQueue}
            deckStudyIndex={deckStudyIndex}
            deckStudyFlipped={deckStudyFlipped}
            setDeckStudyFlipped={setDeckStudyFlipped}
            deckStudyCorrect={deckStudyCorrect}
            deckStudyIncorrect={deckStudyIncorrect}
            handleDeckStudyAnswer={handleDeckStudyAnswer}
            deckStudyStartTime={deckStudyStartTime}
          />
          </FlashcardErrorBoundary>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-report") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
          <DeckReportCard
            setView={setView}
            currentDeck={currentDeck}
            deckStudyCorrect={deckStudyCorrect}
            deckStudyIncorrect={deckStudyIncorrect}
            deckStudyQueue={deckStudyQueue}
            deckStudyStartTime={deckStudyStartTime}
            deckStudyMissed={deckStudyMissed}
            deckCards={deckCards}
            startDeckStudy={startDeckStudy}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "admin-sets") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
          <Button variant="ghost" className="mb-8 gap-2" onClick={() => setView("setup")} data-testid="button-back-admin-sets">
            <ArrowLeft className="w-4 h-4" />
            {t("flashcards.backToConfig")}
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-sets-heading">{t("pages.flashcards.additionalStudySets")}</h1>
            <p className="text-foreground/60 mt-1">{t("pages.flashcards.curatedFlashcardSetsFromOur")}</p>
          </div>

          {dbSetsLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : dbFlashcardSets.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">{t("pages.flashcards.noStudySetsAvailableYet")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbFlashcardSets.map((set: any) => {
                const blocks = Array.isArray(set.content) ? set.content : [];
                const flashcardBlocks = blocks.filter((b: any) => b.type === "flashcard" || (b.front && b.back));
                const cardCount = flashcardBlocks.length;
                return (
                  <Card
                    key={set.id}
                    className="border-none shadow-md hover:shadow-lg transition-all bg-card rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setActiveDbSet(set);
                      setDbStudyIndex(0);
                      setDbStudyFlipped(false);
                      setView("admin-set-study");
                    }}
                    data-testid={`card-admin-set-${set.id}`}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {set.category && (
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/5 rounded-full">
                            {set.category}
                          </span>
                        )}
                        {set.tier && set.tier !== "free" && (
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest px-2 py-0.5 bg-amber-50 rounded-full">
                            {set.tier}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors" data-testid={`text-set-title-${set.id}`}>
                        {set.title}
                      </h3>
                      {set.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{set.summary}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">
                          {cardCount > 0 ? `${cardCount} cards` : "Study set"}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "admin-set-study" && activeDbSet) {
    const blocks = Array.isArray(activeDbSet.content) ? activeDbSet.content : [];
    const flashcardItems = blocks.filter((b: any) => b.type === "flashcard" || (b.front && b.back));
    const currentFlashcard = flashcardItems[dbStudyIndex];

    if (flashcardItems.length === 0) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
            <Button variant="ghost" className="mb-8 gap-2" onClick={() => setView("admin-sets")} data-testid="button-back-set-study">
              <ArrowLeft className="w-4 h-4" />
              Back to Study Sets
            </Button>
            <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{activeDbSet.title}</h3>
              <p className="text-muted-foreground">{t("pages.flashcards.noFlashcardsFoundInThis")}</p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" className="gap-2" onClick={() => setView("admin-sets")} data-testid="button-back-set-study">
              <ArrowLeft className="w-4 h-4" />
              Back to Study Sets
            </Button>
            <span className="text-sm text-muted-foreground font-medium" data-testid="text-db-study-progress">
              {dbStudyIndex + 1} / {flashcardItems.length}
            </span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground" data-testid="text-db-set-title">{activeDbSet.title}</h2>
            {activeDbSet.category && (
              <span className="text-xs text-primary font-medium">{activeDbSet.category}</span>
            )}
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((dbStudyIndex + 1) / flashcardItems.length) * 100}%` }} />
            </div>
          </div>

          <div 
            className="w-full h-[450px] relative cursor-pointer group perspective-1000"
            onClick={() => setDbStudyFlipped(!dbStudyFlipped)}
            data-testid="card-db-study-flip"
          >
            <div className={cn(
              "w-full h-full transition-all duration-700 [transform-style:preserve-3d]",
              dbStudyFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
              <Card className="absolute inset-0 w-full h-full backface-hidden bg-card border-none shadow-xl rounded-[40px] flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-400/40" />
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-8">{t("pages.flashcards.front")}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight" data-testid="text-db-study-front">
                  {currentFlashcard?.front || currentFlashcard?.question || currentFlashcard?.title || ""}
                </h2>
                <div className="mt-12 flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest animate-pulse">
                  <RefreshCw className="w-4 h-4" />
                  {t("flashcards.tapToReveal")}
                </div>
              </Card>

              <Card className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-xl rounded-[40px] flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <h3 className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest mb-8">{t("flashcards.answer")}</h3>
                <p className="text-xl sm:text-2xl font-medium leading-relaxed max-w-lg" data-testid="text-db-study-back">
                  {currentFlashcard?.back || currentFlashcard?.answer || currentFlashcard?.content || ""}
                </p>
              </Card>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              disabled={dbStudyIndex === 0}
              onClick={() => { setDbStudyIndex(prev => prev - 1); setDbStudyFlipped(false); }}
              data-testid="button-db-study-prev"
            >
              <ChevronLeft className="w-4 h-4" />
              {t("flashcards.previous")}
            </Button>
            <Button
              className="rounded-xl gap-2"
              disabled={dbStudyIndex === flashcardItems.length - 1}
              onClick={() => { setDbStudyIndex(prev => prev + 1); setDbStudyFlipped(false); }}
              data-testid="button-db-study-next"
            >
              {t("flashcards.next")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </main>

        <style dangerouslySetInnerHTML={{ __html: `
          .backface-hidden { backface-visibility: hidden; }
          .perspective-1000 { perspective: 1000px; }
        `}} />
        <Footer />
      </div>
    );
  }

  if (view === "mycards-study") {
    if (customCards.length === 0) {
      setView("mycards");
      return null;
    }
    const studyCard = customCards[myCardsStudyIndex];
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" className="gap-2" onClick={() => setView("mycards")} data-testid="button-exit-study-mycards">
              <ArrowLeft className="w-4 h-4" />
              {t("flashcards.backToMyCards")}
            </Button>
            <span className="text-sm text-muted-foreground font-medium" data-testid="text-study-progress">{myCardsStudyIndex + 1} / {customCards.length}</span>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((myCardsStudyIndex + 1) / customCards.length) * 100}%` }} />
            </div>
          </div>

          <div 
            className="w-full h-[450px] relative cursor-pointer group perspective-1000"
            onClick={() => setMyCardsFlipped(!myCardsFlipped)}
            data-testid="card-study-flip"
          >
            <div className={cn(
              "w-full h-full transition-all duration-700 [transform-style:preserve-3d]",
              myCardsFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
              <Card className="absolute inset-0 w-full h-full backface-hidden bg-card border-none shadow-xl rounded-[40px] flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-400/40" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-8">{studyCard?.category ? catLabel(studyCard.category) : ""}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight" data-testid="text-study-question">{studyCard?.question}</h2>
                <div className="mt-12 flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest animate-pulse">
                  <RefreshCw className="w-4 h-4" />
                  {t("flashcards.tapToReveal")}
                </div>
              </Card>

              <Card className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl rounded-[40px] flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <h3 className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest mb-8">{t("flashcards.answer")}</h3>
                <p className="text-xl sm:text-2xl font-medium leading-relaxed max-w-lg" data-testid="text-study-answer">{studyCard?.answer}</p>
              </Card>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              disabled={myCardsStudyIndex === 0}
              onClick={() => { setMyCardsStudyIndex(prev => prev - 1); setMyCardsFlipped(false); }}
              data-testid="button-study-prev"
            >
              <ChevronLeft className="w-4 h-4" />
              {t("flashcards.previous")}
            </Button>
            <Button
              className="rounded-xl gap-2"
              disabled={myCardsStudyIndex === customCards.length - 1}
              onClick={() => { setMyCardsStudyIndex(prev => prev + 1); setMyCardsFlipped(false); }}
              data-testid="button-study-next"
            >
              {t("flashcards.next")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </main>

        <style dangerouslySetInnerHTML={{ __html: `
          .backface-hidden { backface-visibility: hidden; }
          .perspective-1000 { perspective: 1000px; }
        `}} />
        <Footer />
      </div>
    );
  }

  if (view === "bookmarks") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
          <Button variant="ghost" className="mb-8 gap-2" onClick={() => setView("setup")}>
            <ArrowLeft className="w-4 h-4" />
            {t("flashcards.backToConfig")}
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("flashcards.flaggedForReview")}</h1>
              <p className="text-foreground/60">{t("flashcards.reviewingFlagged")}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-rose-500 hover:text-rose-600 border-rose-100 bg-rose-50"
              onClick={() => {
                if(confirm(t("flashcards.confirmClearBookmarks"))) {
                  setBookmarks([]);
                  localStorage.removeItem("nursenest-bookmarks");
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t("flashcards.clearFolder")}
            </Button>
          </div>

          {bookmarkedCards.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border">
              <Bookmark className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">{t("flashcards.noBookmarks")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedCards.map(card => (
                <Card key={card.id} className="border-none shadow-sm hover:shadow-md transition-all bg-card p-6 rounded-2xl flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/5 rounded-full">
                      {card.type}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => toggleBookmark(card.id)} className="text-primary">
                      <BookmarkCheck className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                  <h4 className="font-bold text-foreground mb-3 flex-1">{card.question}</h4>
                  <div className="text-xs text-muted-foreground mb-4">{catLabel(card.category)}</div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full rounded-xl"
                    onClick={() => {
                      setSelectedCategories([card.category]);
                      setSelectedType(card.type);
                      startSession();
                    }}
                  >
                    {t("flashcards.studyThisCard")}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "mastered") {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
          <Button variant="ghost" className="mb-8 gap-2" onClick={() => setView("setup")} data-testid="button-back-mastered">
            <ArrowLeft className="w-4 h-4" />
            {t("flashcards.backToConfig")}
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("flashcards.masteredCards")}</h1>
              <p className="text-foreground/60">{t("flashcards.masteredCardsDesc")}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-rose-500 hover:text-rose-600 border-rose-100 bg-rose-50"
              data-testid="button-clear-mastered"
              onClick={() => {
                if(confirm(t("flashcards.confirmClearMastered"))) {
                  setMastered([]);
                  localStorage.removeItem("nursenest-mastered");
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t("flashcards.clearAll")}
            </Button>
          </div>

          {masteredCards.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border">
              <Trophy className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">{t("flashcards.noMastered")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masteredCards.map(card => (
                <Card key={card.id} className="border-none shadow-sm hover:shadow-md transition-all bg-card p-6 rounded-2xl flex flex-col" data-testid={`card-mastered-${card.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-full">
                      {card.type}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => toggleMastered(card.id)} className="text-emerald-500" data-testid={`button-unmaster-${card.id}`}>
                      <CheckCircle2 className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                  <h4 className="font-bold text-foreground mb-3 flex-1">{card.question}</h4>
                  <div className="text-xs text-muted-foreground mb-4">{catLabel(card.category)}</div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full rounded-xl"
                    onClick={() => {
                      setSelectedCategories([card.category]);
                      setSelectedType(card.type);
                      setIncludeMastered(true);
                      startSession();
                    }}
                    data-testid={`button-study-mastered-${card.id}`}
                  >
                    {t("flashcards.studyThisCard")}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "exam-flashcards") {
    const examCard = examFlashcards[examStudyIndex];

    const toggleExamBookmark = (id: string) => {
      const updated = examBookmarks.includes(id) ? examBookmarks.filter(b => b !== id) : [...examBookmarks, id];
      setExamBookmarks(updated);
      localStorage.setItem("nursenest-exam-bookmarks", JSON.stringify(updated));
    };
    const toggleExamMastered = (id: string) => {
      const updated = examMastered.includes(id) ? examMastered.filter(m => m !== id) : [...examMastered, id];
      setExamMastered(updated);
      localStorage.setItem("nursenest-exam-mastered", JSON.stringify(updated));
    };

    const handleExamOptionClick = (idx: number) => {
      if (examShowRationale) return;
      const isCorrect = examCard.correctAnswer.includes(idx);
      const newResults = [...examSessionResults, { id: examCard.id, correct: isCorrect }];
      setExamSessionResults(newResults);
      setExamSelectedOption(idx);
      setExamShowRationale(true);
      saveExamSession(examStudyIndex, newResults, examFlashcards.length);
    };

    const handleExamNext = () => {
      if (examStudyIndex < examFlashcards.length - 1) {
        const nextIdx = examStudyIndex + 1;
        setExamStudyIndex(nextIdx);
        setExamSelectedOption(null);
        setExamShowRationale(false);
        saveExamSession(nextIdx, examSessionResults, examFlashcards.length);
      } else {
        clearExamSession();
        setView("exam-report");
      }
    };

    if (examFlashcardsLoading) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 py-24 w-full flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">{t("pages.flashcards.loadingExamStudyCards")}</p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    if (!examCard || examFlashcards.length === 0) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 py-24 w-full flex-1 text-center">
            <ShieldAlert className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
            {flashcardBankError ? (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {flashcardBankError.code === BackendErrorCodes.FLASHCARD_BANK_TIMEOUT
                    ? "Connection timed out"
                    : flashcardBankError.code && isEntitlementErrorCode(flashcardBankError.code)
                      ? "Upgrade required"
                      : "Could not load flashcards"}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">{flashcardBankError.message}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(flashcardBankError.code === BackendErrorCodes.FLASHCARD_BANK_TIMEOUT ||
                    flashcardBankError.code === BackendErrorCodes.FLASHCARD_BANK_ERROR) && (
                    <Button onClick={() => void fetchExamFlashcards()} data-testid="button-retry-exam-bank">
                      Try again
                    </Button>
                  )}
                  {(isEntitlementErrorCode(flashcardBankError.code) || isAuthRequiredCode(flashcardBankError.code)) && (
                    <Button variant="default" onClick={() => setLocation("/pricing")}>
                      View plans
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setView("setup")} data-testid="button-back-exam">
                    {t("pages.flashcards.backToFlashcards")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">{t("pages.flashcards.noExamCardsAvailable")}</h2>
                <p className="text-muted-foreground mb-6">{t("pages.flashcards.examFlashcardsHaventBeenSynced")}</p>
                <Button onClick={() => setView("setup")} data-testid="button-back-exam">{t("pages.flashcards.backToFlashcards")}</Button>
              </>
            )}
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className={`min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-slate-50 flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`}>
        <Navigation />
        <main className={cn("mx-auto px-4 py-4 sm:py-8 w-full flex-1 flex flex-col", examShowRationale ? "max-w-[1200px]" : "max-w-[820px]")}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground" data-testid="text-exam-session-title">{t("pages.flashcards.catExamStudyCards")}</h1>
              <QuestionContextHeader
                focusArea={examCard.bodySystem || examCard.category}
                topic={examCard.topic ?? undefined}
                className="mt-2"
                data-testid="context-exam-header"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
                <ShieldAlert className="w-3 h-3" />
                {examCard.tier?.toUpperCase()}
              </span>
            </div>
          </div>

          <ThemedProgressBar
            current={examStudyIndex + 1}
            total={examFlashcards.length}
            className="mb-5"
            data-testid="progress-exam-study"
          />

          <div className="w-full flex-1 flex flex-col gap-4">
            <div className="flex-1">
              {examShowRationale ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 animate-in fade-in duration-300" data-testid="section-exam-review-layout">
                  <div className="flex flex-col gap-4">
                    <Card className="border border-border shadow-sm bg-card overflow-hidden rounded-2xl flex flex-col" data-testid="card-exam-question">
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 leading-snug" data-testid="text-exam-question-stem">{examCard.front}</h2>
                        <div className="space-y-2 flex-1">
                          {examCard.options?.map((option: any, idx: number) => {
                            const optionText = typeof option === "string" ? option : option.text || option.label || String(option);
                            const isSelected = examSelectedOption === idx;
                            const isCorrect = examCard.correctAnswer.includes(idx);
                            let variantClasses = "border-border bg-secondary text-muted-foreground";
                            if (isCorrect) variantClasses = "answer-correct-state ring-1";
                            else if (isSelected) variantClasses = "border-red-300 bg-red-50 text-red-700";
                            return (
                              <button
                                key={idx}
                                disabled={true}
                                className={cn("w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 text-sm", variantClasses)}
                                data-testid={`button-exam-option-${idx}`}
                              >
                                <span className={cn("shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-semibold", isCorrect ? "answer-correct-circle text-white" : "border-current")}>
                                  {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : isSelected ? <XCircle className="w-3 h-3" /> : String.fromCharCode(65 + idx)}
                                </span>
                                <span className={isCorrect ? "text-foreground" : undefined}>{optionText}</span>
                                {isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 ml-auto theme-icon" />}
                                {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-auto" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {examCard.rationaleMedia && examCard.rationaleMedia.length > 0 && (
                      <div className="md:block hidden">
                        {examCard.rationaleMedia.map((media: any, i: number) => (
                          <RationaleImageBlock
                            key={i}
                            src={media.imageUrl}
                            alt={media.imageAlt || "Clinical image"}
                            caption={media.imageCaption}
                            description={media.imageDescription}
                            data-testid={`img-exam-rationale-${i}`}
                          />
                        ))}
                      </div>
                    )}

                    <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
                      <div className="px-5 pt-4 pb-2 flex items-center gap-2.5 border-b border-border">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-3 h-3 text-primary" />
                        </div>
                        <h3 className="text-xs font-semibold text-primary tracking-wide">{t("pages.flashcards.rationaleReview")}</h3>
                      </div>

                      <CardContent className="px-5 py-4 space-y-3.5" data-testid="section-exam-rationale"><ProtectedContent>
                        <div className="themed-correct-answer-bg rounded-lg border p-3">
                          <p className="text-[10px] font-semibold themed-correct-answer-label uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 theme-icon" /> Correct Answer
                          </p>
                          <p className="text-sm leading-relaxed text-foreground">{examCard.rationaleCorrect || examCard.back}</p>
                        </div>

                        {examCard.clinicalTakeaway && (
                          <div className="bg-card rounded-lg border border-border p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1 text-muted-foreground">
                              <Lightbulb className="w-3 h-3 theme-icon" /> Why This Is Correct
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">{examCard.clinicalTakeaway}</p>
                          </div>
                        )}

                        <div className="bg-gradient-to-r from-blue-50/60 to-violet-50/40 rounded-lg border border-blue-100/50 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1 text-muted-foreground">
                            <Target className="w-3 h-3 theme-icon" /> Key Exam Concept
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {examCard.clinicalTakeaway || examCard.rationaleCorrect || examCard.back}
                          </p>
                        </div>

                        {examCard.distractorRationales && Object.keys(examCard.distractorRationales).length > 0 && (
                          <div className="bg-card rounded-lg border border-border p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5 flex items-center gap-1 text-muted-foreground">
                              <AlertCircle className="w-3 h-3 text-rose-400" /> Why Other Options Are Incorrect
                            </p>
                            <div className="space-y-2">
                              {Object.entries(examCard.distractorRationales).map(([key, rationale]) => (
                                <div key={key} className="flex gap-2 text-sm">
                                  <span className="shrink-0 w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-[9px] font-bold text-rose-400 mt-0.5">
                                    {key.replace(/^option_?/i, "").charAt(0).toUpperCase() || key.charAt(0).toUpperCase()}
                                  </span>
                                  <p className="leading-relaxed text-muted-foreground">{rationale}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {examCard.examPearl && (
                          <div className="bg-gradient-to-r from-amber-50/70 to-rose-50/50 rounded-lg border border-amber-100/50 p-3">
                            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                              <Star className="w-3 h-3 theme-icon" /> Clinical Pearl
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">{examCard.examPearl}</p>
                          </div>
                        )}

                        <KeyTakeawayBox data-testid="section-exam-key-takeaway">
                          {examCard.clinicalTakeaway || examCard.rationaleCorrect || examCard.back}
                        </KeyTakeawayBox>

                        {examCard.rationaleMedia && examCard.rationaleMedia.length > 0 && (
                          <div className="md:hidden">
                            {examCard.rationaleMedia.map((media: any, i: number) => (
                              <RationaleImageBlock
                                key={i}
                                src={media.imageUrl}
                                alt={media.imageAlt || "Clinical image"}
                                caption={media.imageCaption}
                                description={media.imageDescription}
                                data-testid={`img-exam-rationale-mobile-${i}`}
                              />
                            ))}
                          </div>
                        )}

                        {examCard.lessonLinks && examCard.lessonLinks.length > 0 && (
                          <div className="bg-primary/5 rounded-lg border border-primary/20 p-3">
                            <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
                              <BookOpen className="w-3 h-3 theme-icon" /> Related Lesson
                            </p>
                            <div className="space-y-1.5">
                              {examCard.lessonLinks.map((link: any, i: number) => (
                                <a
                                  key={i}
                                  href={link.lessonUrl}
                                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline"
                                  data-testid={`link-exam-lesson-${i}`}
                                >
                                  <ChevronRight className="w-3 h-3" />
                                  <span>{link.lessonTitle}</span>
                                  {link.relevanceNote && <span className="text-xs text-muted-foreground ml-1">({link.relevanceNote})</span>}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </ProtectedContent></CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="border border-border shadow-sm bg-card overflow-hidden rounded-2xl min-h-[460px] flex flex-col animate-in fade-in duration-200" data-testid="card-exam-question">
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-6 leading-snug" data-testid="text-exam-question-stem">{examCard.front}</h2>
                    <div className="space-y-2.5 flex-1">
                      {examCard.options?.map((option: any, idx: number) => {
                        const optionText = typeof option === "string" ? option : option.text || option.label || String(option);
                        const isSelected = examSelectedOption === idx;
                        let variantClasses = "border-border hover:border-border/80 hover:bg-secondary text-foreground/70";
                        return (
                          <button
                            key={idx}
                            disabled={false}
                            onClick={() => handleExamOptionClick(idx)}
                            className={cn("w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 text-sm", variantClasses)}
                            data-testid={`button-exam-option-${idx}`}
                          >
                            <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-semibold">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            {optionText}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={() => setView("setup")} className="text-muted-foreground hover:text-foreground/60" data-testid="button-exit-exam-session">
                Exit Session
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-1.5 transition-all rounded-lg",
                    examBookmarks.includes(examCard.id) ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" : "text-foreground/60"
                  )}
                  onClick={() => toggleExamBookmark(examCard.id)}
                  data-testid="button-exam-bookmark"
                >
                  {examBookmarks.includes(examCard.id) ? (
                    <><BookmarkCheck className="w-3.5 h-3.5" /> {t("pages.flashcards.saved")}</>
                  ) : (
                    <><Bookmark className="w-3.5 h-3.5" /> {t("pages.flashcards.save")}</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-1.5 transition-all rounded-lg",
                    examMastered.includes(examCard.id) ? "theme-mastered-btn" : "text-foreground/60"
                  )}
                  onClick={() => toggleExamMastered(examCard.id)}
                  data-testid="button-exam-mastered"
                >
                  {examMastered.includes(examCard.id) ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> {t("pages.flashcards.mastered")}</>
                  ) : (
                    <><Trophy className="w-3.5 h-3.5" /> {t("pages.flashcards.master")}</>
                  )}
                </Button>
              </div>
              <Button size="sm" onClick={handleExamNext} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium rounded-lg text-xs h-8 px-4 shadow-sm" data-testid="button-exam-next">
                {examStudyIndex < examFlashcards.length - 1 ? "Next Card" : "Finish"} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === "admin-exam-manager" && user?.tier === "admin") {
    const totalPages = Math.ceil(adminExamTotal / 50);
    const cmp = adminCompleteness;
    const pct = (n: number, t: number) => t > 0 ? Math.round((n / t) * 100) : 0;

    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => setView("setup")} data-testid="button-back-admin-exam">
            <ArrowLeft className="w-4 h-4" /> Back to Flashcards
          </Button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-admin-exam-title">{t("pages.flashcards.examQuestionManager")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {adminExamTotal.toLocaleString()} questions matching filters
              {Object.keys(adminTierCounts).length > 0 && (
                <span className="ml-2">
                  ({Object.entries(adminTierCounts).map(([t, c]) => `${t.toUpperCase()}: ${c.toLocaleString()}`).join(", ")})
                </span>
              )}
            </p>
          </div>

          {cmp && (
            <Card className="border border-border shadow-sm bg-card rounded-xl mb-6 overflow-hidden" data-testid="card-completeness">
              <div className="px-5 pt-3 pb-2 border-b border-border">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-primary" /> Content Completeness
                </h3>
              </div>
              <CardContent className="px-5 py-3">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: "Rationale", value: cmp.withRationale, color: "emerald" },
                    { label: "Clinical Pearl", value: cmp.withPearl, color: "amber" },
                    { label: "Exam Strategy", value: cmp.withStrategy, color: "blue" },
                    { label: "Memory Hook", value: cmp.withHook, color: "violet" },
                    { label: "Distractors", value: cmp.withDistractors, color: "rose" },
                  ].map(item => {
                    const p = pct(item.value, cmp.total);
                    return (
                      <div key={item.label} className="text-center" data-testid={`stat-completeness-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                        <p className={`text-lg font-bold text-${item.color}-600`}>{p}%</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                        <p className="text-[9px] text-muted-foreground/60">{item.value}/{cmp.total}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border border-border shadow-sm bg-card rounded-xl mb-6 overflow-hidden" data-testid="card-admin-filters">
            <CardContent className="px-5 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">{t("pages.flashcards.tier")}</label>
                  <select
                    value={adminExamTier}
                    onChange={e => { setAdminExamTier(e.target.value); setAdminExamPage(0); fetchAdminExamQuestions(e.target.value, undefined, undefined, undefined, 0); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
                    data-testid="select-admin-tier"
                  >
                    <option value="all">{t("pages.flashcards.allTiers")}</option>
                    <option value="rn">RN</option>
                    <option value="rpn">{t("pages.flashcards.rpnlpn")}</option>
                    <option value="np">NP</option>
                    <option value="free">{t("pages.flashcards.free")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">{t("pages.flashcards.topic")}</label>
                  <select
                    value={adminExamTopic}
                    onChange={e => { setAdminExamTopic(e.target.value); setAdminExamPage(0); fetchAdminExamQuestions(undefined, e.target.value, undefined, undefined, 0); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
                    data-testid="select-admin-topic"
                  >
                    <option value="all">{t("pages.flashcards.allTopics")}</option>
                    {adminFilterTopics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">{t("pages.flashcards.bodySystem")}</label>
                  <select
                    value={adminExamBodySystem}
                    onChange={e => { setAdminExamBodySystem(e.target.value); setAdminExamPage(0); fetchAdminExamQuestions(undefined, undefined, undefined, e.target.value, 0); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
                    data-testid="select-admin-body-system"
                  >
                    <option value="all">{t("pages.flashcards.allBodySystems")}</option>
                    {adminFilterSystems.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">{t("pages.flashcards.difficulty")}</label>
                  <select
                    value={adminExamDifficulty}
                    onChange={e => { setAdminExamDifficulty(e.target.value); setAdminExamPage(0); fetchAdminExamQuestions(undefined, undefined, e.target.value, undefined, 0); }}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
                    data-testid="select-admin-difficulty"
                  >
                    <option value="all">{t("pages.flashcards.allLevels")}</option>
                    {[1,2,3,4,5].map(d => <option key={d} value={String(d)}>Level {d}</option>)}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => handleAdminConvert()}
              disabled={adminConvertingIds.size > 0}
              data-testid="button-convert-all"
            >
              <RefreshCw className={cn("w-3 h-3", adminConvertingIds.size > 0 && "animate-spin")} />
              Sync Flashcard Decks
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={adminExamPage === 0} onClick={() => { const p = adminExamPage - 1; setAdminExamPage(p); fetchAdminExamQuestions(undefined, undefined, undefined, undefined, p); }} data-testid="button-admin-prev">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground font-medium" data-testid="text-admin-page">
                Page {adminExamPage + 1} of {totalPages || 1}
              </span>
              <Button variant="outline" size="sm" disabled={adminExamPage >= totalPages - 1} onClick={() => { const p = adminExamPage + 1; setAdminExamPage(p); fetchAdminExamQuestions(undefined, undefined, undefined, undefined, p); }} data-testid="button-admin-next">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {adminExamLoading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : adminExamQuestions.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">{t("pages.flashcards.noQuestionsMatchYourFilters")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {adminExamQuestions.map((q: any) => {
                const hasRationale = q.rationale && q.rationale.length > 0;
                const hasPearl = q.clinicalPearl && q.clinicalPearl.length > 0;
                const hasStrategy = q.examStrategy && q.examStrategy.length > 0;
                const hasHook = q.memoryHook && q.memoryHook.length > 0;
                const hasDistractors = q.distractorRationales && Object.keys(q.distractorRationales).length > 0;
                const fieldCount = [hasRationale, hasPearl, hasStrategy, hasHook, hasDistractors].filter(Boolean).length;

                return (
                  <Card key={q.id} className="border border-border shadow-sm bg-card rounded-xl overflow-hidden" data-testid={`card-admin-question-${q.id}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-primary uppercase px-1.5 py-0.5 bg-primary/5 rounded">{q.tier}</span>
                            {q.bodySystem && <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{q.bodySystem}</span>}
                            {q.topic && <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{q.topic}</span>}
                            {q.difficulty && (
                              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", q.difficulty <= 2 ? "bg-emerald-50 text-emerald-600" : q.difficulty >= 4 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600")}>
                                D{q.difficulty}
                              </span>
                            )}
                            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", fieldCount >= 4 ? "bg-emerald-50 text-emerald-600" : fieldCount >= 2 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600")} data-testid={`badge-completeness-${q.id}`}>
                              {fieldCount}/5 fields
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-snug line-clamp-2" data-testid={`text-question-stem-${q.id}`}>{q.stem}</p>
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {hasRationale && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">{t("pages.flashcards.rationale")}</span>}
                            {hasPearl && <span className="text-[9px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded">{t("pages.flashcards.pearl")}</span>}
                            {hasStrategy && <span className="text-[9px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{t("pages.flashcards.strategy")}</span>}
                            {hasHook && <span className="text-[9px] text-violet-600 bg-violet-50 px-1 py-0.5 rounded">{t("pages.flashcards.hook")}</span>}
                            {hasDistractors && <span className="text-[9px] text-rose-600 bg-rose-50 px-1 py-0.5 rounded">{t("pages.flashcards.distractors")}</span>}
                          </div>
                        </div>
                        <span className="shrink-0 text-[9px] text-muted-foreground/60 font-mono" data-testid={`text-qid-${q.id}`}>
                          {q.id.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "adaptive-learn" || view === "adaptive-test") {
    const aCard = adaptiveCards[adaptiveIndex];
    const isLearnMode = view === "adaptive-learn";

    const toggleAdaptiveBookmark = (id: string) => {
      const updated = adaptiveBookmarks.includes(id) ? adaptiveBookmarks.filter(b => b !== id) : [...adaptiveBookmarks, id];
      setAdaptiveBookmarks(updated);
      localStorage.setItem("nursenest-adaptive-bookmarks", JSON.stringify(updated));
    };

    const getRelatedLessonForCard = (card: any) => {
      const catMap: Record<string, { slug: string; title: string }> = {
        "Cardiovascular": { slug: "cardiovascular", title: "Cardiovascular Nursing" },
        "Respiratory": { slug: "respiratory", title: "Respiratory System" },
        "Neurological": { slug: "neurological", title: "Neurological Nursing" },
        "Pharmacology": { slug: "pharmacology", title: "Pharmacology Essentials" },
        "Pediatrics": { slug: "pediatrics", title: "Pediatric Nursing" },
        "Oncology": { slug: "oncology", title: "Oncology Nursing" },
        "GI": { slug: "gastrointestinal", title: "Gastrointestinal Nursing" },
        "Gastrointestinal": { slug: "gastrointestinal", title: "Gastrointestinal Nursing" },
        "Renal": { slug: "renal", title: "Renal & Urinary Nursing" },
        "Musculoskeletal": { slug: "musculoskeletal", title: "Musculoskeletal Nursing" },
        "Skin": { slug: "integumentary", title: "Integumentary & Wound Care" },
        "Infection": { slug: "infection-control", title: "Infection Control" },
        "Maternal": { slug: "maternal", title: "Maternal & Newborn Nursing" },
        "Neonatal": { slug: "maternal", title: "Maternal & Newborn Nursing" },
        "Psychiatry": { slug: "mental-health", title: "Mental Health Nursing" },
        "Mental Health": { slug: "mental-health", title: "Mental Health Nursing" },
        "Hematology": { slug: "hematology", title: "Hematology & Oncology" },
        "Endocrine": { slug: "endocrine", title: "Endocrine System" },
        "Fundamentals": { slug: "fundamentals", title: "Nursing Fundamentals" },
      };
      return catMap[card.bodySystem] || catMap[card.topic] || null;
    };

    if (adaptiveLoading) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 py-24 w-full flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground font-medium" data-testid="text-adaptive-loading">{t("pages.flashcards.buildingYourPersonalizedStudySession")}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">{t("pages.flashcards.analyzingYourWeakAreasAnd")}</p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    if (!aCard || adaptiveCards.length === 0) {
      return (
        <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 py-24 w-full flex-1 text-center">
            <ShieldAlert className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-no-adaptive-cards">{t("pages.flashcards.noExamCardsAvailable2")}</h2>
            <p className="text-muted-foreground mb-6">{t("pages.flashcards.noExamQuestionsAreAvailable")}</p>
            <Button onClick={() => setView("setup")} data-testid="button-back-adaptive">{t("pages.flashcards.backToFlashcards2")}</Button>
          </main>
          <Footer />
        </div>
      );
    }

    const lastResult = adaptiveResults[adaptiveResults.length - 1];
    const hasAnswered = adaptiveSelectedOption !== null;
    const needsConfidence = adaptiveShowRationale && !adaptiveConfidence;
    const sourceLabel = aCard.source === "review_queue" ? "Review" : aCard.source === "weak_area" ? "Weak Area" : aCard.source === "srs_due" ? "SRS Due" : "New";
    const sourceBg = aCard.source === "review_queue" ? "bg-amber-50 text-amber-700" : aCard.source === "weak_area" ? "bg-red-50 text-red-700" : aCard.source === "srs_due" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700";

    return (
      <div className={`min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-slate-50 flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`}>
        <Navigation />
        <main className={cn("mx-auto px-4 py-4 sm:py-8 w-full flex-1 flex flex-col", adaptiveShowRationale ? "max-w-[1200px]" : "max-w-[820px]")}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight" data-testid="text-adaptive-title">
                {isLearnMode ? "Learn Mode" : "Test Mode"}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {aCard.bodySystem || "General"} &middot; {aCard.topic || "Exam Question"}
                {aCard.difficulty && <span> &middot; Difficulty {aCard.difficulty}</span>}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold", sourceBg)} data-testid="badge-card-source">
                {aCard.source === "review_queue" && <RefreshCw className="w-3 h-3" />}
                {aCard.source === "weak_area" && <Target className="w-3 h-3" />}
                {sourceLabel}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold" data-testid="badge-tier">
                <ShieldAlert className="w-3 h-3" />
                {(aCard.tier || effectiveTier)?.toUpperCase()}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground" data-testid="text-card-index">{adaptiveIndex + 1}</span>
                <span>/</span>
                <span data-testid="text-card-total">{adaptiveCards.length}</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-secondary h-1.5 rounded-full mb-5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${((adaptiveIndex + 1) / adaptiveCards.length) * 100}%` }} data-testid="progress-adaptive" />
          </div>

          <div className="w-full flex-1 flex flex-col gap-4">
            <div className="flex-1">
              {adaptiveShowRationale ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 animate-in fade-in duration-300" data-testid="section-adaptive-review">
                  <div className="flex flex-col gap-4">
                    <Card className="border border-border shadow-sm bg-card overflow-hidden rounded-2xl flex flex-col" data-testid="card-adaptive-question-review">
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 leading-snug" data-testid="text-adaptive-stem">{aCard.question}</h2>
                        <div className="space-y-2 flex-1">
                          {aCard.options?.map((option: string, idx: number) => {
                            const isSelected = adaptiveSelectedOption === idx;
                            const isCorrect = aCard.correctIndex === idx || (Array.isArray(aCard.correctAnswer) && aCard.correctAnswer.includes(idx));
                            let variantClasses = "border-border bg-secondary text-muted-foreground";
                            if (isCorrect) variantClasses = "answer-correct-state ring-1";
                            else if (isSelected) variantClasses = "border-red-300 bg-red-50 text-red-700";
                            return (
                              <button key={idx} disabled className={cn("w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 text-sm", variantClasses)} data-testid={`button-adaptive-option-review-${idx}`}>
                                <span className={cn("shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-semibold", isCorrect ? "answer-correct-circle text-white" : "border-current")}>
                                  {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : String.fromCharCode(65 + idx)}
                                </span>
                                <span className={isCorrect ? "text-foreground" : undefined}>{option}</span>
                                {isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 ml-auto theme-icon" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
                      <div className="px-5 pt-4 pb-2 flex items-center gap-2.5 border-b border-border">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-3 h-3 text-primary" />
                        </div>
                        <h3 className="text-xs font-semibold text-primary tracking-wide">{t("pages.flashcards.rationaleReview2")}</h3>
                      </div>
                      <CardContent className="px-5 py-4 space-y-3.5" data-testid="section-adaptive-rationale">
                        <div className="themed-correct-answer-bg rounded-lg border p-3">
                          <p className="text-[10px] font-semibold themed-correct-answer-label uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 theme-icon" /> Correct Answer
                          </p>
                          <p className="text-sm leading-relaxed text-foreground" data-testid="text-adaptive-rationale">{aCard.rationale}</p>
                        </div>

                        {aCard.distractorRationales && Object.keys(aCard.distractorRationales).length > 0 && (
                          <div className="bg-card rounded-lg border border-border p-3">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">{t("pages.flashcards.whyOtherOptionsAreIncorrect")}</p>
                            <div className="space-y-2">
                              {Object.entries(aCard.distractorRationales).map(([key, rationale]) => (
                                <div key={key} className="flex gap-2 text-sm">
                                  <span className="shrink-0 w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-[9px] font-bold text-rose-400 mt-0.5">
                                    {key.replace(/^option_?/i, "").charAt(0).toUpperCase() || key.charAt(0).toUpperCase()}
                                  </span>
                                  <p className="text-foreground/60 leading-relaxed">{rationale as string}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {aCard.clinicalPearl && (
                          <div className="bg-gradient-to-r from-amber-50/70 to-rose-50/50 rounded-lg border border-amber-100/50 p-3">
                            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Clinical Pearl
                            </p>
                            <p className="text-sm text-foreground/70 leading-relaxed" data-testid="text-clinical-pearl">{aCard.clinicalPearl}</p>
                          </div>
                        )}

                        {aCard.examStrategy && (
                          <div className="bg-blue-50/50 rounded-lg border border-blue-100/60 p-3">
                            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" /> Exam Strategy
                            </p>
                            <p className="text-sm text-foreground/70 leading-relaxed">{aCard.examStrategy}</p>
                          </div>
                        )}

                        {aCard.memoryHook && (
                          <div className="bg-violet-50/50 rounded-lg border border-violet-100/60 p-3">
                            <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                              <Brain className="w-3 h-3" /> Memory Hook
                            </p>
                            <p className="text-sm text-foreground/70 leading-relaxed">{aCard.memoryHook}</p>
                          </div>
                        )}

                        {(() => {
                          const lesson = getRelatedLessonForCard(aCard);
                          if (!lesson) return null;
                          return (
                            <div className="bg-primary/5 rounded-lg border border-primary/20 p-3">
                              <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Layers className="w-3 h-3" /> Review Lesson
                              </p>
                              <a
                                href={`/en/lessons/${lesson.slug}`}
                                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline"
                                data-testid="link-adaptive-lesson"
                              >
                                <ChevronRight className="w-3 h-3" />
                                <span>{lesson.title}</span>
                              </a>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>

                    {needsConfidence && (
                      <Card className="border-2 border-primary/30 shadow-md bg-card rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300" data-testid="card-confidence-rating">
                        <div className="px-5 pt-4 pb-2 flex items-center gap-2.5 border-b border-border">
                          <h3 className="text-xs font-semibold text-foreground tracking-wide">{t("pages.flashcards.howConfidentWereYou")}</h3>
                        </div>
                        <CardContent className="px-5 py-4">
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => recordAdaptiveConfidence("guessing")}
                              className="p-3 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 transition-all text-center"
                              data-testid="button-confidence-guessing"
                            >
                              <span className="text-lg">🎲</span>
                              <p className="text-xs font-semibold text-red-700 mt-1">{t("pages.flashcards.guessing")}</p>
                            </button>
                            <button
                              onClick={() => recordAdaptiveConfidence("somewhat")}
                              className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 transition-all text-center"
                              data-testid="button-confidence-somewhat"
                            >
                              <span className="text-lg">🤔</span>
                              <p className="text-xs font-semibold text-amber-700 mt-1">{t("pages.flashcards.somewhat")}</p>
                            </button>
                            <button
                              onClick={() => recordAdaptiveConfidence("very_confident")}
                              className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 transition-all text-center"
                              data-testid="button-confidence-confident"
                            >
                              <span className="text-lg">💪</span>
                              <p className="text-xs font-semibold text-emerald-700 mt-1">{t("pages.flashcards.confident")}</p>
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <Card className="border border-border shadow-sm bg-card overflow-hidden rounded-2xl min-h-[460px] flex flex-col animate-in fade-in duration-200" data-testid="card-adaptive-question">
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    {aCard.previouslyAnswered && (
                      <div className={cn("mb-3 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 self-start", aCard.previouslyCorrect ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")} data-testid="badge-previously-answered">
                        <RefreshCw className="w-3 h-3" />
                        Previously {aCard.previouslyCorrect ? "correct" : "incorrect"}
                      </div>
                    )}
                    <h2 className="text-lg font-semibold text-foreground mb-6 leading-snug" data-testid="text-adaptive-question">{aCard.question}</h2>
                    <div className="space-y-2.5 flex-1">
                      {aCard.options?.map((option: string, idx: number) => {
                        const isSelected = adaptiveSelectedOption === idx;
                        let variantClasses = "border-border hover:border-border/80 hover:bg-secondary text-foreground/70";
                        if (isSelected && !isLearnMode) variantClasses = "border-primary bg-primary/5 text-primary ring-2 ring-primary/20";
                        return (
                          <button
                            key={idx}
                            disabled={isLearnMode ? hasAnswered : adaptiveSubmitted}
                            onClick={() => handleAdaptiveAnswer(idx)}
                            className={cn("w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 text-sm", variantClasses)}
                            data-testid={`button-adaptive-option-${idx}`}
                          >
                            <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-semibold">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {!isLearnMode && adaptiveSubmitted && !adaptiveShowRationale && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button onClick={submitTestAnswer} className="w-full h-11 rounded-xl font-semibold bg-primary hover:bg-primary/90 shadow-sm" data-testid="button-submit-test-answer">
                          Reveal Answer & Rationale
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={() => setView("setup")} className="text-muted-foreground hover:text-foreground/60" data-testid="button-exit-adaptive">
                Exit Session
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("gap-1.5 transition-all rounded-lg", adaptiveBookmarks.includes(aCard.id) ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" : "text-foreground/60")}
                  onClick={() => toggleAdaptiveBookmark(aCard.id)}
                  data-testid="button-adaptive-bookmark"
                >
                  {adaptiveBookmarks.includes(aCard.id) ? <><BookmarkCheck className="w-3.5 h-3.5" /> {t("pages.flashcards.saved2")}</> : <><Bookmark className="w-3.5 h-3.5" /> {t("pages.flashcards.save2")}</>}
                </Button>
              </div>
              <Button
                size="sm"
                disabled={!adaptiveConfidence}
                onClick={handleAdaptiveNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium rounded-lg text-xs h-8 px-4 shadow-sm"
                data-testid="button-adaptive-next"
              >
                {adaptiveIndex < adaptiveCards.length - 1 ? "Next Card" : "Finish"} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === "adaptive-report") {
    const reportCorrect = adaptiveResults.filter(r => r.correct).length;
    const reportTotal = adaptiveResults.length;
    const reportScore = reportTotal > 0 ? Math.round((reportCorrect / reportTotal) * 100) : 0;

    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    const systemBreakdown: Record<string, { correct: number; total: number }> = {};
    for (const r of adaptiveResults) {
      const t = r.topic || "Unknown";
      const bs = r.bodySystem || "Unknown";
      if (!topicBreakdown[t]) topicBreakdown[t] = { correct: 0, total: 0 };
      if (!systemBreakdown[bs]) systemBreakdown[bs] = { correct: 0, total: 0 };
      topicBreakdown[t].total++;
      systemBreakdown[bs].total++;
      if (r.correct) { topicBreakdown[t].correct++; systemBreakdown[bs].correct++; }
    }

    const confCounts = { guessing: 0, somewhat: 0, very_confident: 0 };
    for (const r of adaptiveResults) {
      if (r.confidence === "guessing") confCounts.guessing++;
      else if (r.confidence === "somewhat") confCounts.somewhat++;
      else if (r.confidence === "very_confident") confCounts.very_confident++;
    }

    const weakTopicsInSession = Object.entries(systemBreakdown)
      .map(([bs, data]) => ({ bodySystem: bs, accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0, total: data.total }))
      .filter(x => x.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy);

    const lessonRecommendations: { title: string; slug: string }[] = [];
    const catMap: Record<string, { slug: string; title: string }> = {
      "Cardiovascular": { slug: "cardiovascular", title: "Cardiovascular Nursing" },
      "Respiratory": { slug: "respiratory", title: "Respiratory System" },
      "Neurological": { slug: "neurological", title: "Neurological Nursing" },
      "Pharmacology": { slug: "pharmacology", title: "Pharmacology Essentials" },
      "Pediatrics": { slug: "pediatrics", title: "Pediatric Nursing" },
      "Oncology": { slug: "oncology", title: "Oncology Nursing" },
      "GI": { slug: "gastrointestinal", title: "Gastrointestinal Nursing" },
      "Renal": { slug: "renal", title: "Renal & Urinary Nursing" },
      "Maternal": { slug: "maternal", title: "Maternal & Newborn Nursing" },
      "Endocrine": { slug: "endocrine", title: "Endocrine System" },
      "Hematology": { slug: "hematology", title: "Hematology & Oncology" },
      "Infection": { slug: "infection-control", title: "Infection Control" },
      "Mental Health": { slug: "mental-health", title: "Mental Health Nursing" },
      "Psychiatry": { slug: "mental-health", title: "Mental Health Nursing" },
      "Fundamentals": { slug: "fundamentals", title: "Nursing Fundamentals" },
    };
    for (const w of weakTopicsInSession.slice(0, 3)) {
      const lesson = catMap[w.bodySystem];
      if (lesson && !lessonRecommendations.find(l => l.slug === lesson.slug)) {
        lessonRecommendations.push(lesson);
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-slate-50 flex flex-col font-sans">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-12 w-full">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Trophy className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-adaptive-report-title">
              {adaptiveMode === "learn" ? "Learn" : "Test"} Session Complete
            </h1>
            <p className="text-foreground/60">{t("pages.flashcards.adaptiveStudySessionResults")}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border-none shadow-md bg-card p-6 rounded-2xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("pages.flashcards.accuracy")}</p>
              <p className={cn("text-4xl font-black", reportScore >= 70 ? "text-emerald-500" : reportScore >= 50 ? "text-amber-500" : "text-red-500")} data-testid="text-adaptive-accuracy">{reportScore}%</p>
            </Card>
            <Card className="border-none shadow-md bg-card p-6 rounded-2xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("pages.flashcards.correct")}</p>
              <p className="text-4xl font-black text-emerald-500" data-testid="text-adaptive-correct">{reportCorrect}</p>
            </Card>
            <Card className="border-none shadow-md bg-card p-6 rounded-2xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("pages.flashcards.total")}</p>
              <p className="text-4xl font-black text-foreground" data-testid="text-adaptive-total">{reportTotal}</p>
            </Card>
          </div>

          {Object.keys(systemBreakdown).length > 0 && (
            <Card className="border border-border shadow-sm bg-card rounded-2xl mb-6 overflow-hidden" data-testid="card-topic-breakdown">
              <div className="px-5 pt-4 pb-2 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Accuracy by Body System
                </h3>
              </div>
              <CardContent className="px-5 py-4">
                <div className="space-y-3">
                  {Object.entries(systemBreakdown)
                    .sort(([, a], [, b]) => {
                      const accA = a.total > 0 ? (a.correct / a.total) * 100 : 0;
                      const accB = b.total > 0 ? (b.correct / b.total) * 100 : 0;
                      return accA - accB;
                    })
                    .map(([system, data]) => {
                      const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                      return (
                        <div key={system} data-testid={`row-system-${system.replace(/\s+/g, "-").toLowerCase()}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground/70">{system}</span>
                            <span className={cn("text-xs font-semibold", acc >= 70 ? "text-emerald-600" : acc >= 50 ? "text-amber-600" : "text-red-600")}>
                              {acc}% ({data.correct}/{data.total})
                            </span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", acc >= 70 ? "bg-emerald-400" : acc >= 50 ? "bg-amber-400" : "bg-red-400")}
                              style={{ width: `${acc}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {confCounts.guessing + confCounts.somewhat + confCounts.very_confident > 0 && (
            <Card className="border border-border shadow-sm bg-card rounded-2xl mb-6 overflow-hidden" data-testid="card-confidence-breakdown">
              <div className="px-5 pt-4 pb-2 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Brain className="w-4 h-4 text-violet-500" /> Confidence Distribution
                </h3>
              </div>
              <CardContent className="px-5 py-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-red-50/50 border border-red-100">
                    <p className="text-2xl font-bold text-red-600">{confCounts.guessing}</p>
                    <p className="text-xs text-red-600/70 font-medium">{t("pages.flashcards.guessing2")}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                    <p className="text-2xl font-bold text-amber-600">{confCounts.somewhat}</p>
                    <p className="text-xs text-amber-600/70 font-medium">{t("pages.flashcards.somewhat2")}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <p className="text-2xl font-bold text-emerald-600">{confCounts.very_confident}</p>
                    <p className="text-xs text-emerald-600/70 font-medium">{t("pages.flashcards.confident2")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {weakTopicsInSession.length > 0 && (
            <Card className="border border-border shadow-sm bg-card rounded-2xl mb-6 overflow-hidden" data-testid="card-weak-areas">
              <div className="px-5 pt-4 pb-2 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" /> Areas Needing Review
                </h3>
              </div>
              <CardContent className="px-5 py-4">
                <div className="space-y-2">
                  {weakTopicsInSession.map(w => (
                    <div key={w.bodySystem} className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/50 border border-red-100">
                      <span className="text-sm font-medium text-foreground/70">{w.bodySystem}</span>
                      <span className="text-xs font-semibold text-red-600">{w.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {lessonRecommendations.length > 0 && (
            <Card className="border border-primary/20 shadow-sm bg-primary/5 rounded-2xl mb-8 overflow-hidden" data-testid="card-lesson-recommendations">
              <div className="px-5 pt-4 pb-2 border-b border-primary/10">
                <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Recommended Lessons
                </h3>
              </div>
              <CardContent className="px-5 py-4 space-y-2">
                {lessonRecommendations.map(lesson => (
                  <a key={lesson.slug} href={`/en/lessons/${lesson.slug}`} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline p-2 rounded-lg hover:bg-primary/5 transition-colors" data-testid={`link-recommended-lesson-${lesson.slug}`}>
                    <ChevronRight className="w-3 h-3" />
                    <span>{lesson.title}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="space-y-3 mt-6">
            <Button
              className="w-full h-14 rounded-2xl text-lg font-bold bg-rose-500 hover:bg-rose-600"
              onClick={() => {
                setAdaptiveMode(adaptiveMode);
                fetchAdaptiveSession(adaptiveMode);
                setView(adaptiveMode === "learn" ? "adaptive-learn" : "adaptive-test");
              }}
              data-testid="button-adaptive-new-session"
            >
              Start New {adaptiveMode === "learn" ? "Learn" : "Test"} Session
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl text-base font-semibold"
              onClick={() => {
                const other = adaptiveMode === "learn" ? "test" : "learn";
                setAdaptiveMode(other);
                fetchAdaptiveSession(other);
                setView(other === "learn" ? "adaptive-learn" : "adaptive-test");
              }}
              data-testid="button-adaptive-switch-mode"
            >
              Switch to {adaptiveMode === "learn" ? "Test" : "Learn"} Mode
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-2xl text-base font-semibold border-border" onClick={() => setView("setup")} data-testid="button-adaptive-back-setup">
              Back to Flashcards
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "exam-report") {
    const examCorrectCount = examSessionResults.filter(r => r.correct).length;
    const examTotalCount = examSessionResults.length;
    const examScore = examTotalCount > 0 ? Math.round((examCorrectCount / examTotalCount) * 100) : 100;

    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-24 w-full text-center">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Trophy className="w-12 h-12 text-rose-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" data-testid="text-exam-report-title">{t("pages.flashcards.examSessionComplete")}</h1>
          <p className="text-foreground/60 mb-12">{t("pages.flashcards.heresHowYouPerformedOn")}</p>

          <div className="grid grid-cols-3 gap-4 mb-12">
            <Card className="border-none shadow-md bg-card p-8 rounded-3xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("pages.flashcards.accuracy2")}</p>
              <p className="text-4xl font-black text-rose-500" data-testid="text-exam-accuracy">{examScore}%</p>
            </Card>
            <Card className="border-none shadow-md bg-card p-8 rounded-3xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("pages.flashcards.correct2")}</p>
              <p className="text-4xl font-black text-emerald-500" data-testid="text-exam-correct">{examCorrectCount}</p>
            </Card>
            <Card className="border-none shadow-md bg-card p-8 rounded-3xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("pages.flashcards.total2")}</p>
              <p className="text-4xl font-black text-foreground" data-testid="text-exam-total">{examTotalCount}</p>
            </Card>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full h-14 rounded-2xl text-lg font-bold bg-rose-500 hover:bg-rose-600"
              onClick={() => {
                setExamStudyIndex(0);
                setExamSelectedOption(null);
                setExamShowRationale(false);
                setExamSessionResults([]);
                setView("exam-flashcards");
              }}
              data-testid="button-exam-new-session"
            >
              Start New Session
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold" onClick={() => setView("setup")} data-testid="button-exam-back-setup">
              Back to Flashcards
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "report") {
    const correctCount = sessionResults.filter(r => r.correct).length;
    const totalCount = sessionCards.filter(c => c.type === "question").length;
    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50/40 via-white to-secondary flex flex-col font-sans">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-24 w-full text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{t("flashcards.sessionComplete")}</h1>
          <p className="text-muted-foreground mb-12">{t("flashcards.performanceToday")}</p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <Card className="border border-border shadow-md bg-card p-8 rounded-3xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("flashcards.accuracy")}</p>
              <p className="text-4xl font-black text-primary">{score}%</p>
            </Card>
            <Card className="border border-border shadow-md bg-card p-8 rounded-3xl text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("flashcards.totalCards")}</p>
              <p className="text-4xl font-black text-foreground">{sessionCards.length}</p>
            </Card>
          </div>

          <div className="space-y-4">
            <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" onClick={() => setView("setup")}>
              {t("flashcards.newSession")}
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold border-border text-foreground/70 hover:bg-secondary" onClick={() => setView("bookmarks")}>
              {t("flashcards.reviewBookmarks")}
            </Button>
          </div>
        </main>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContextualRelatedResources
            pageType="flashcards"
            currentPath={isTestBank ? "/test-bank" : "/flashcards"}
            className="border-t border-gray-200"
          />
        </div>
        <Footer />
      </div>
    );
  }

  const relatedLesson = currentCard ? getRelatedLesson(currentCard.category) : null;

  const upgradeModalEl = (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-lg" data-testid="modal-flashcard-upgrade">
        <DialogHeader>
          <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
            <Crown className="w-7 h-7 text-violet-600" />
          </div>
          <DialogTitle className="text-center text-xl" data-testid="text-upgrade-headline">
            {previewConfig?.upgradeHeadline || "Unlock the Full Flashcard Library"}
          </DialogTitle>
          <DialogDescription className="text-center" data-testid="text-upgrade-body">
            {previewConfig?.upgradeBody || "Get unlimited flashcards, adaptive review, weak areas mode, and saved progress with a premium plan."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="space-y-2.5">
            {[
              "Unlimited flashcards",
              "All tiers & topics",
              "Weak areas mode",
              "Adaptive review",
              "Saved progress & analytics",
              "Flagged & mastered cards",
              "Lesson-linked remediation",
            ].map((feat, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 theme-icon shrink-0" />
                <span className="text-foreground/80">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <a href="/upgrade" className="w-full">
            <Button className="w-full bg-violet-600 hover:bg-violet-700" size="lg" data-testid="button-upgrade-now">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </a>
          <a href="/pricing" className="w-full">
            <Button variant="outline" className="w-full" size="lg" data-testid="button-view-plans">
              View Plans
            </Button>
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setShowUpgradeModal(false); setView("setup"); }}
            className="text-muted-foreground text-xs"
            data-testid="button-continue-limited"
          >
            Continue with Limited Preview Tomorrow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-b from-violet-50/40 via-white to-secondary flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""} print:hidden`}>
      {upgradeModalEl}
      <SEO
        title={isTestBank ? "Test Bank - Exam-Style Practice Questions | NurseNest" : "Nursing Flashcards - Interactive Quiz & Study Cards"}
        description={isTestBank
          ? "Practice with tier-calibrated exam-style clinical scenario questions with full rationales, distractor analysis, and adaptive difficulty for RPN, RN, and NP preparation."
          : "Master nursing pathophysiology with interactive flashcards covering cardiovascular, respiratory, neurological, pharmacology, and more. Practice NCLEX-style questions with instant feedback and progress tracking."}
        keywords={isTestBank
          ? "nursing test bank, exam practice questions, NCLEX questions, nursing exam prep, clinical scenarios, practice questions"
          : "nursing flashcards, NCLEX flashcards, nursing quiz, pathophysiology study cards, nursing exam practice, clinical nursing questions, pharmacology flashcards"}
        canonicalPath={isTestBank ? window.location.pathname.replace(/^\/(?:en|fr|es|fil|hi|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th)/, "") : "/flashcards"}
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": isTestBank ? "NurseNest Test Bank" : "NurseNest Nursing Flashcards",
          "description": isTestBank
            ? "Exam-style practice questions with clinical rationales and adaptive difficulty."
            : "Interactive nursing flashcards with quiz-style questions for NCLEX and clinical exam preparation.",
          "url": isTestBank ? `https://www.nursenest.ca${window.location.pathname}` : "https://www.nursenest.ca/flashcards",
          "learningResourceType": isTestBank ? "Quiz" : "Flashcard",
          "educationalLevel": "College",
          "about": { "@type": "Thing", "name": "Nursing Education" }
        }}
        additionalStructuredData={[{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": isTestBank ? "Nursing Test Bank - Exam Practice Questions" : "Nursing Pharmacology & Clinical Flashcards",
          "description": isTestBank
            ? "Exam-style clinical scenario practice questions with full rationales, distractor analysis, and adaptive difficulty for nursing exam preparation."
            : "Interactive nursing flashcards covering pharmacology, pathophysiology, and clinical concepts for NCLEX and REX-PN exam preparation.",
          "url": isTestBank ? `https://www.nursenest.ca${window.location.pathname}` : "https://www.nursenest.ca/flashcards",
          "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
          "courseMode": "online",
          "isAccessibleForFree": false
        }]}
      />
      <Navigation compact={showRationale && currentCard.type === "question"} />

      <main className={cn("mx-auto px-4 w-full flex-1 flex flex-col", showRationale && currentCard.type === "question" ? "max-w-[1200px] py-2 sm:py-3" : "max-w-[820px] py-4 sm:py-8")}>
        <div className={cn("flex items-center justify-between flex-wrap gap-1", showRationale ? "mb-2" : "mb-3")}>
          <div className="flex items-center gap-2">
            {showRationale ? (
              <QuestionContextHeader
                focusArea={catLabel(currentCard.category)}
                topic="Review"
                data-testid="context-study-header"
              />
            ) : (
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{t("flashcards.activeSession")}</h1>
                <QuestionContextHeader
                  focusArea={catLabel(currentCard.category)}
                  topic={currentCard.type === "question" ? "Question mode" : "Term mode"}
                  className="mt-2"
                  data-testid="context-study-header"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="font-semibold text-foreground/70">{currentIndex + 1}</span>
              <span className="text-muted-foreground/60">/</span>
              <span>{sessionCards.length}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setAdaptiveOverrideCards(null); setView("setup"); }} className="text-muted-foreground hover:text-foreground/60 text-xs h-8 px-3" data-testid="button-exit-session">
              Exit
            </Button>
          </div>
        </div>

        <ThemedProgressBar
          current={currentIndex + 1}
          total={sessionCards.length}
          className={showRationale ? "mb-3" : "mb-5"}
          data-testid="progress-study"
        />

        {(() => {
          const hasAdaptive = sessionCards.some(c => c.source && c.source !== "static");
          if (!hasAdaptive || showRationale) return null;
          const counts: Record<string, number> = {};
          sessionCards.forEach(c => { const s = c.source || "fresh"; counts[s] = (counts[s] || 0) + 1; });
          const labels: Record<string, string> = { review_queue: "Review", weak_area: "Weak Areas", srs_due: "Due", fresh: "New" };
          return (
            <div className="flex items-center gap-2 mb-4 text-[10px] text-muted-foreground" data-testid="session-source-summary">
              <span className="font-medium">{t("pages.flashcards.personalizedMix")}</span>
              {Object.entries(counts).filter(([, v]) => v > 0).map(([k, v]) => (
                <span key={k} className={cn("px-1.5 py-0.5 rounded border font-medium",
                  k === "review_queue" ? "bg-rose-50 text-rose-600 border-rose-100" :
                  k === "weak_area" ? "bg-amber-50 text-amber-600 border-amber-100" :
                  k === "srs_due" ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-muted text-muted-foreground border-border"
                )}>
                  {v} {labels[k] || k}
                </span>
              ))}
            </div>
          );
        })()}

        {!isPaid && user && previewStatus && !previewStatus.isPremium && (
          <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200" data-testid="preview-cards-remaining">
            <div className="flex items-center gap-2 text-xs text-amber-800">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-medium">{t("pages.flashcards.previewMode")}</span>
              <span className="text-amber-600">·</span>
              <span>{previewStatus.sessionRemaining} cards remaining this session</span>
              <span className="text-amber-600">·</span>
              <span>{previewStatus.dailyRemaining} today</span>
            </div>
            <a href="/upgrade" className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1" data-testid="link-preview-upgrade">
              <Crown className="w-3 h-3" />
              Upgrade
            </a>
          </div>
        )}

        <div className="w-full flex-1 flex flex-col gap-5">
          <div className="flex-1">
            {currentCard.type === "question" ? (
              <>
                {showRationale ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 animate-in fade-in duration-300" data-testid="section-study-review-layout">
                    <div className="flex flex-col gap-3">
                      <Card className="border border-border shadow-sm bg-card overflow-hidden rounded-xl flex flex-col">
                        <CardContent className="px-4 sm:px-5 py-3.5 flex flex-col flex-1">
                          <h2 className="text-sm sm:text-base font-semibold text-foreground mb-3 leading-snug" data-testid="text-study-question">{currentCard.question}</h2>
                          <div className="space-y-1.5 flex-1">
                            {currentCard.options?.map((option, idx) => {
                              const isSelected = selectedOption === idx;
                              const isCorrectOpt = idx === currentCard.correctIndex;
                              return (
                                <AnswerOption
                                  key={idx}
                                  index={idx}
                                  text={option}
                                  isSelected={isSelected}
                                  isCorrect={isCorrectOpt}
                                  isWrong={isSelected && !isCorrectOpt}
                                  isRevealed={true}
                                  disabled={true}
                                  onClick={() => {}}
                                />
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex flex-col gap-2.5 md:max-h-[calc(100vh-120px)] md:overflow-y-auto">
                      {currentCard.image && (
                        <div className="rounded-xl border border-border md:block hidden">
                          <RationaleImageBlock
                            src={currentCard.image}
                            alt={`Clinical reference for ${currentCard.category || "nursing"}`}
                            data-testid={`img-rationale-${currentCard.id}`}
                          />
                        </div>
                      )}

                      <Card className="border border-border shadow-sm bg-card rounded-xl overflow-hidden">
                        <div className="px-4 pt-2.5 pb-1.5 flex items-center gap-2 border-b border-border">
                          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-2.5 h-2.5 text-primary" />
                          </div>
                          <h3 className="text-[11px] font-semibold text-primary tracking-wide">{t("pages.flashcards.rationaleReview3")}</h3>
                        </div>

                        <CardContent className="px-4 py-3 space-y-2.5">
                          <div className="themed-correct-answer-bg rounded-lg border p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <CheckCircle2 className="w-3 h-3 theme-icon" />
                              <span className="text-[10px] font-semibold themed-correct-answer-label uppercase tracking-wide">{t("pages.flashcards.correctAnswer")}</span>
                            </div>
                            <p className="text-xs font-medium pl-4.5 text-foreground">
                              {currentCard.options?.[currentCard.correctIndex ?? 0]}
                            </p>
                          </div>

                          <div className="bg-card rounded-lg border border-border p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Lightbulb className="w-3 h-3 theme-icon" />
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t("pages.flashcards.whyThisIsCorrect")}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">{currentCard.detailedRationale || currentCard.answer}</p>
                          </div>

                          {currentCard.options && currentCard.options.length > 1 && (
                            <div className="bg-card rounded-lg border border-border p-2.5">
                              <div className="flex items-center gap-1.5 mb-2">
                                <AlertCircle className="w-3 h-3 text-rose-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t("pages.flashcards.whyOtherOptionsAreIncorrect2")}</span>
                              </div>
                              <div className="space-y-1.5">
                                {currentCard.options.map((opt, idx) => {
                                  if (idx === currentCard.correctIndex) return null;
                                  const letter = String.fromCharCode(65 + idx);
                                  return (
                                    <div key={idx} className="flex gap-1.5 pl-0.5">
                                      <span className="text-[10px] font-bold text-rose-300 bg-rose-50 w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5">{letter}</span>
                                      <div>
                                        <p className="text-[11px] font-medium leading-snug text-foreground">{opt}</p>
                                        <p className="text-[11px] mt-0.5 leading-relaxed text-muted-foreground">{generateOptionRationale(currentCard, idx)}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="bg-gradient-to-r from-amber-50/70 to-rose-50/50 rounded-lg border border-amber-100/50 p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Star className="w-3 h-3 theme-icon" />
                              <span className="text-[10px] font-semibold text-muted-foreground">{t("pages.flashcards.clinicalPearl2")}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                              {currentCard.clinicalPearl || `For ${catLabel(currentCard.category)} questions, focus on priority assessment and immediate nursing interventions. Always identify the most critical patient need first, then select the intervention that addresses it directly. Remember the ABCs (Airway, Breathing, Circulation) and Maslow's hierarchy when prioritizing.`}
                            </p>
                          </div>

                          <KeyTakeawayBox data-testid="section-study-key-takeaway">
                            {currentCard.detailedRationale || currentCard.answer}
                          </KeyTakeawayBox>

                          <div className="bg-gradient-to-r from-blue-50/60 to-violet-50/40 rounded-lg border border-blue-100/50 p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Target className="w-3 h-3 theme-icon" />
                              <span className="text-[10px] font-semibold text-muted-foreground">{t("pages.flashcards.keyExamConcept")}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                              {currentCard.examStrategy || currentCard.detailedRationale || currentCard.answer}
                            </p>
                          </div>

                          {currentCard.memoryHook && (
                            <div className="bg-gradient-to-r from-violet-50/60 to-purple-50/40 rounded-lg border border-violet-100/50 p-2.5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Lightbulb className="w-3 h-3 theme-icon" />
                                <span className="text-[10px] font-semibold text-muted-foreground">{t("pages.flashcards.memoryHook")}</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-muted-foreground">{currentCard.memoryHook}</p>
                            </div>
                          )}

                          {currentCard.image && (
                            <div className="rounded-lg border border-border md:hidden">
                              <RationaleImageBlock
                                src={currentCard.image}
                                alt={`Clinical reference for ${currentCard.category || "nursing"}`}
                                data-testid={`img-rationale-mobile-${currentCard.id}`}
                              />
                            </div>
                          )}

                          {relatedLesson && (
                            <LocaleLink
                              href={`/lessons/${relatedLesson.slug}`}
                              className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-primary/5 hover:bg-primary/10 transition-colors group"
                              data-testid={`link-related-lesson-${currentCard.id}`}
                            >
                              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                <BookOpen className="w-3 h-3 theme-icon" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-primary/70 uppercase tracking-wide">{t("pages.flashcards.relatedLesson")}</p>
                                <p className="text-xs font-medium text-primary truncate">{relatedLesson.title}</p>
                              </div>
                              <ChevronRight className="w-3 h-3 text-primary/30 group-hover:text-primary/60 transition-colors shrink-0" />
                            </LocaleLink>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <Card className="border border-border shadow-md bg-card overflow-hidden rounded-2xl flex flex-col animate-in fade-in duration-200">
                    <CardContent className="px-6 sm:px-8 py-6 flex flex-col flex-1">
                      {currentCard.source && currentCard.source !== "static" && currentCard.source !== "fresh" && (
                        <div className="flex items-center gap-2 mb-3" data-testid="badge-card-source">
                          {currentCard.source === "review_queue" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-semibold border border-rose-100">
                              <RefreshCw className="w-2.5 h-2.5" /> Needs Review
                            </span>
                          )}
                          {currentCard.source === "weak_area" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-semibold border border-amber-100">
                              <AlertTriangle className="w-2.5 h-2.5" /> Weak Area
                            </span>
                          )}
                          {currentCard.source === "srs_due" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-semibold border border-blue-100">
                              <Clock className="w-2.5 h-2.5" /> Due for Review
                            </span>
                          )}
                          {currentCard.previouslyAnswered && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${currentCard.previouslyCorrect ? "themed-correct-answer-bg" : "bg-red-50 text-red-600 border-red-100"}`}>
                              {currentCard.previouslyCorrect ? "Previously Correct" : "Previously Missed"}
                            </span>
                          )}
                        </div>
                      )}
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6 leading-relaxed" data-testid="text-study-question">{currentCard.question}</h2>
                      <div className="space-y-2.5 flex-1">
                        {currentCard.options?.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrectOpt = idx === currentCard.correctIndex;
                          return (
                            <AnswerOption
                              key={idx}
                              index={idx}
                              text={option}
                              isSelected={isSelected}
                              isCorrect={false}
                              isWrong={false}
                              isRevealed={false}
                              disabled={false}
                              onClick={() => handleOptionClick(idx)}
                            />
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div
                className="w-full h-[460px] relative cursor-pointer group perspective-1000"
                onClick={() => {
                  if (!isFlipped && !isPaid && user) {
                    decrementPreview();
                  }
                  setIsFlipped(!isFlipped);
                }}
              >
                <div className={cn(
                  "w-full h-full transition-all duration-700 [transform-style:preserve-3d]",
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                )}>
                  <Card className="absolute inset-0 w-full h-full backface-hidden bg-card border border-border shadow-md rounded-2xl flex flex-col items-center justify-center p-6 sm:p-10 text-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-400 to-violet-500 rounded-t-2xl" />
                    {getCategoryImage(currentCard.category || "") && (
                      <ProtectedImage
                        src={getCategoryImage(currentCard.category || "") || ""}
                        alt={`${currentCard.category} illustration`}
                        className="w-14 h-14 object-contain rounded-xl mb-4 opacity-40"
                        data-testid={`img-term-${currentCard.id}`}
                      />
                    )}
                    <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-widest mb-5">{t("flashcards.clinicalTerminology")}</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight max-w-lg">{currentCard.question}</h2>
                    <div className="mt-10 flex items-center gap-2 text-muted-foreground/60 text-xs font-medium uppercase tracking-widest animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t("flashcards.tapToDefine")}
                    </div>
                  </Card>

                  <Card className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-lg rounded-2xl flex flex-col items-center justify-center p-6 sm:p-10 text-center">
                    <h3 className="text-[10px] font-semibold text-primary-foreground/50 uppercase tracking-widest mb-6">{t("flashcards.clinicalDefinition")}</h3>
                    <p className="text-xl sm:text-2xl font-medium leading-relaxed max-w-lg">{currentCard.answer}</p>
                    <div className="mt-8 pt-4 border-t border-primary-foreground/15 w-full">
                      <p className="text-[10px] font-semibold text-primary-foreground/50 uppercase tracking-widest mb-3" data-testid="text-rate-difficulty">{t("flashcards.rateDifficulty")}</p>
                      <div className="flex items-center justify-center gap-2 flex-wrap" data-testid="group-sm2-ratings">
                        {(["again", "hard", "good", "easy"] as const).map((rating) => {
                          const ratingConfig: Record<string, { label: string; sublabel: string; color: string }> = {
                            again: { label: t("flashcards.ratingAgain"), sublabel: "<10m", color: "bg-red-500/20 hover:bg-red-500/40 border-red-300/30" },
                            hard: { label: t("flashcards.ratingHard"), sublabel: "1d", color: "bg-orange-500/20 hover:bg-orange-500/40 border-orange-300/30" },
                            good: { label: t("flashcards.ratingGood"), sublabel: "1-6d", color: "bg-green-500/20 hover:bg-green-500/40 border-green-300/30" },
                            easy: { label: t("flashcards.ratingEasy"), sublabel: "6d+", color: "bg-blue-500/20 hover:bg-blue-500/40 border-blue-300/30" },
                          };
                          const cfg = ratingConfig[rating];
                          return (
                            <Button
                              key={rating}
                              variant="ghost"
                              size="sm"
                              className={cn("flex flex-col items-center gap-0.5 px-3 py-2 h-auto rounded-lg border text-primary-foreground font-medium transition-all", cfg.color)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSM2Rating(rating);
                              }}
                              data-testid={`button-rating-${rating}`}
                            >
                              <span className="text-xs">{cfg.label}</span>
                              <span className="text-[9px] opacity-60">{cfg.sublabel}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 flex-wrap border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-1.5 transition-all rounded-lg text-xs h-8 border-border",
                  bookmarks.includes(currentCard.id)
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-secondary"
                )}
                onClick={() => toggleBookmark(currentCard.id)}
                data-testid="button-bookmark"
              >
                {bookmarks.includes(currentCard.id) ? (
                  <><BookmarkCheck className="w-3.5 h-3.5" /> {t("pages.flashcards.saved3")}</>
                ) : (
                  <><Bookmark className="w-3.5 h-3.5" /> {t("pages.flashcards.flag")}</>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-1.5 transition-all rounded-lg text-xs h-8 border-border",
                  mastered.includes(currentCard.id)
                    ? "theme-mastered-btn"
                    : "text-muted-foreground hover:bg-secondary"
                )}
                onClick={() => toggleMastered(currentCard.id)}
                data-testid="button-mastered"
              >
                {mastered.includes(currentCard.id) ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> {t("pages.flashcards.mastered2")}</>
                ) : (
                  <><Trophy className="w-3.5 h-3.5" /> {t("pages.flashcards.master2")}</>
                )}
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium rounded-lg text-xs h-8 px-4 shadow-sm"
              data-testid="button-next-card"
            >
              {currentIndex < sessionCards.length - 1 ? "Next Card" : "Finish"} <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print { body { display: none !important; } }
        .backface-hidden { backface-visibility: hidden; }
        .perspective-1000 { perspective: 1000px; }
      `}} />
      <AITutorWidget context={{ type: "flashcard", title: "Flashcard Study" }} />
      <AdminEditButton />
    </div>
  );
}
