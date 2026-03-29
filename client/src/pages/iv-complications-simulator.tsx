import { getAssetUrl } from "@/lib/asset-url";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Droplets,
  Activity,
  Thermometer,
  Heart,
  ShieldAlert,
  Syringe,
} from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const imgInfiltration = getAssetUrl("iv-complication-infiltration.png");
const imgExtravasation = getAssetUrl("iv-complication-extravasation.png");
const imgPhlebitis = getAssetUrl("iv-complication-phlebitis.png");
const imgClabsi = getAssetUrl("iv-complication-clabsi.png");
const imgAirEmbolism = getAssetUrl("iv-complication-air-embolism.png");
const imgFluidOverload = getAssetUrl("iv-complication-fluid-overload.png");
const imgPiccOcclusion = getAssetUrl("iv-complication-picc-occlusion.png");
const imgSpeedShock = getAssetUrl("iv-complication-speed-shock.png");


const scenarioImages: Record<string, string> = {
  infiltration: imgInfiltration,
  extravasation: imgExtravasation,
  phlebitis: imgPhlebitis,
  "catheter-infection": imgClabsi,
  "air-embolism": imgAirEmbolism,
  "fluid-overload": imgFluidOverload,
  "catheter-occlusion": imgPiccOcclusion,
  "speed-shock": imgSpeedShock,
};

const scenarioImageAlt: Record<string, string> = {
  infiltration: "IV infiltration showing swelling and pallor at the catheter insertion site",
  extravasation: "IV extravasation with blistering and erythema from vesicant drug leakage",
  phlebitis: "Phlebitis showing redness and inflammation tracking along the vein path",
  "catheter-infection": "Central line associated bloodstream infection with purulent drainage at exit site",
  "air-embolism": "Venous air embolism anatomical illustration showing air bubble trapped in vessel",
  "fluid-overload": "Bilateral pitting edema in lower extremities from IV fluid overload",
  "catheter-occlusion": "PICC line catheter in upper arm showing occluded catheter setup",
  "speed-shock": "Speed shock from rapid IV push medication illustrating drug concentration in vein",
};

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  rationale: string;
}

interface IVScenario {
  id: string;
  title: string;
  patientDescription: string;
  ivSetup: string;
  signsAndSymptoms: string[];
  identifyQuestion: string;
  identifyOptions: AnswerOption[];
  actionQuestion: string;
  actionOptions: AnswerOption[];
  examTrapTip: string;
}

const scenarios: IVScenario[] = [
  {
    id: "infiltration",
    title: "Post-Operative Patient with Peripheral IV",
    patientDescription: "A 68-year-old female is 1 day post-op after a total knee replacement. She has a 20-gauge peripheral IV in the left dorsal hand for intermittent antibiotic infusion (Cefazolin 1g IV q8h).",
    ivSetup: "20G peripheral IV catheter in left dorsal hand, inserted 36 hours ago. IV pump running NS at 75 mL/hr between medication doses.",
    signsAndSymptoms: [
      "Patient reports tightness and discomfort at the IV site",
      "Visible swelling noted around the catheter insertion site",
      "Skin at the site feels cool to touch compared to the opposite hand",
      "Pallor observed at and around the IV insertion area",
      "IV fluid is infusing but at a slower rate than programmed",
      "No erythema, warmth, or purulent drainage noted",
    ],
    identifyQuestion: "Based on these findings, what IV complication is this patient most likely experiencing?",
    identifyOptions: [
      { id: "a", text: "Infiltration", isCorrect: true, rationale: "Correct. Swelling, coolness, pallor, and discomfort at the IV site without signs of infection (no redness, warmth, or drainage) are classic signs of infiltration  -  fluid leaking into surrounding tissue from a dislodged or perforated vein." },
      { id: "b", text: "Phlebitis", isCorrect: false, rationale: "Incorrect. Phlebitis presents with redness, warmth, and tenderness along the vein path. This patient has coolness and pallor, not warmth and erythema." },
      { id: "c", text: "Extravasation", isCorrect: false, rationale: "Incorrect. While extravasation shares some signs with infiltration, it specifically involves vesicant or irritant drugs. NS and Cefazolin are not vesicants. Extravasation causes tissue necrosis risk." },
      { id: "d", text: "Catheter-related infection", isCorrect: false, rationale: "Incorrect. Catheter-related infection would present with erythema, warmth, purulent drainage, and possibly fever  -  none of which are present here." },
    ],
    actionQuestion: "What is the FIRST nursing action for this complication?",
    actionOptions: [
      { id: "a", text: "Stop the infusion and disconnect the IV tubing from the catheter", isCorrect: true, rationale: "Correct. The first action is to stop the infusion immediately to prevent further fluid from entering the interstitial tissue. Then remove the catheter, elevate the extremity, and apply a warm compress to promote reabsorption." },
      { id: "b", text: "Slow the infusion rate and monitor the site for 30 minutes", isCorrect: false, rationale: "Incorrect. Slowing the rate still allows fluid to infiltrate tissue. The infusion must be stopped completely  -  continued infusion worsens swelling and tissue injury." },
      { id: "c", text: "Flush the IV catheter with 10 mL normal saline to check patency", isCorrect: false, rationale: "Incorrect. Flushing a suspected infiltrated IV forces more fluid into the tissue, worsening the infiltration. Never flush when infiltration is suspected." },
      { id: "d", text: "Apply a tourniquet above the site and attempt to aspirate", isCorrect: false, rationale: "Incorrect. Applying a tourniquet is not appropriate for infiltration management. This could worsen tissue edema and does not resolve the underlying issue." },
    ],
    examTrapTip: "Exam Trap: Don't confuse infiltration with extravasation. Infiltration involves non-vesicant fluids leaking into tissue (cool, pale, swollen). Extravasation involves vesicant drugs and carries risk of tissue necrosis. The management differs  -  extravasation may require antidotes.",
  },
  {
    id: "extravasation",
    title: "Oncology Patient Receiving Chemotherapy",
    patientDescription: "A 52-year-old male is receiving Doxorubicin (a vesicant chemotherapy agent) through a 22-gauge peripheral IV in the right forearm for treatment of non-Hodgkin lymphoma.",
    ivSetup: "22G peripheral IV in right forearm. Doxorubicin infusing via IV push per protocol. IV was inserted 2 hours ago.",
    signsAndSymptoms: [
      "Patient suddenly reports intense burning pain at the IV site",
      "Swelling developing rapidly around the insertion site",
      "Skin appears blanched then progressing to redness at the site",
      "Resistance felt when attempting to flush the line",
      "Blood return is absent when attempting to aspirate",
      "Small blister forming near the catheter tip area",
    ],
    identifyQuestion: "What IV complication should the nurse suspect?",
    identifyOptions: [
      { id: "a", text: "Extravasation", isCorrect: true, rationale: "Correct. Burning pain, swelling, blister formation, and loss of blood return during infusion of a vesicant drug (Doxorubicin) are hallmark signs of extravasation. This is a medical emergency due to risk of severe tissue necrosis." },
      { id: "b", text: "Infiltration", isCorrect: false, rationale: "Incorrect. While infiltration shares some features (swelling), the intense burning, blister formation, and involvement of a vesicant drug make this extravasation  -  a more severe complication requiring specific antidote treatment." },
      { id: "c", text: "Chemical phlebitis", isCorrect: false, rationale: "Incorrect. Chemical phlebitis involves inflammation of the vein wall and presents with redness and tenderness along the vein path, not the intense burning, blistering, and rapid swelling seen here with a vesicant drug." },
      { id: "d", text: "Allergic reaction to chemotherapy", isCorrect: false, rationale: "Incorrect. An allergic reaction would present with systemic symptoms: urticaria, bronchospasm, hypotension, or anaphylaxis  -  not localized burning and blistering at the IV site." },
    ],
    actionQuestion: "What is the FIRST nursing action?",
    actionOptions: [
      { id: "a", text: "Stop the infusion immediately and aspirate any residual drug from the catheter before removing it", isCorrect: true, rationale: "Correct. Stop the infusion immediately, attempt to aspirate residual drug through the existing catheter (do NOT flush), then follow facility extravasation protocol which may include applying Dexrazoxane (antidote for Doxorubicin) or cold compresses. Notify the provider stat." },
      { id: "b", text: "Remove the IV catheter immediately and apply warm compresses", isCorrect: false, rationale: "Incorrect. Removing the catheter before aspiration loses the opportunity to withdraw residual vesicant drug from the tissue. Also, warm compresses are contraindicated for Doxorubicin extravasation  -  cold compresses are used for most vesicants." },
      { id: "c", text: "Slow the infusion rate and elevate the extremity", isCorrect: false, rationale: "Incorrect. Continuing any infusion of a vesicant into tissue is extremely dangerous. The infusion must be stopped immediately  -  slowing it still allows tissue-damaging drug exposure." },
      { id: "d", text: "Flush the line with saline to dilute the chemotherapy agent", isCorrect: false, rationale: "Incorrect. Flushing pushes more vesicant drug into the tissue, dramatically worsening tissue damage. Never flush a suspected extravasation site." },
    ],
    examTrapTip: "Exam Trap: For vesicant extravasation, always aspirate residual drug BEFORE removing the catheter. This is opposite to infiltration where you simply stop and remove. Know your vesicant antidotes: Dexrazoxane for anthracyclines, Hyaluronidase for vinca alkaloids.",
  },
  {
    id: "phlebitis",
    title: "Medical Patient with Prolonged IV Therapy",
    patientDescription: "A 45-year-old female has been hospitalized for 4 days for cellulitis treatment. She has a 20-gauge peripheral IV in the right antecubital fossa for IV Vancomycin 1g q12h.",
    ivSetup: "20G peripheral IV in right antecubital fossa, inserted 72 hours ago. Vancomycin infusing over 90 minutes as scheduled. KVO rate of D5W running between doses.",
    signsAndSymptoms: [
      "Patient reports increasing tenderness along the vein proximal to the IV site",
      "Visible erythema (redness) tracking along the vein path for approximately 5 cm",
      "Warmth palpable along the vein trajectory",
      "Slight induration (hardening) of the vein noted on palpation",
      "IV is still infusing without difficulty",
      "No swelling, coolness, or pallor at the site; no fever",
    ],
    identifyQuestion: "What IV complication do these assessment findings indicate?",
    identifyOptions: [
      { id: "a", text: "Phlebitis", isCorrect: true, rationale: "Correct. Redness, warmth, tenderness, and hardening ALONG THE VEIN path are classic signs of phlebitis (vein inflammation). Contributing factors include prolonged catheter dwell time (72 hrs), irritating medication (Vancomycin), and antecubital placement." },
      { id: "b", text: "Infiltration", isCorrect: false, rationale: "Incorrect. Infiltration presents with swelling, coolness, and pallor at the site  -  not redness, warmth, and tenderness along the vein. The IV is still infusing normally, unlike infiltration where flow is impeded." },
      { id: "c", text: "Cellulitis spreading to the IV site", isCorrect: false, rationale: "Incorrect. While the patient is being treated for cellulitis elsewhere, the redness tracking linearly along the vein path is characteristic of phlebitis, not the diffuse spreading redness of cellulitis." },
      { id: "d", text: "Thrombophlebitis with deep vein thrombosis", isCorrect: false, rationale: "Incorrect. While thrombophlebitis is possible with prolonged IV use, DVT would present with limb swelling, positive Homans sign, and more systemic symptoms. This presentation is most consistent with superficial mechanical/chemical phlebitis." },
    ],
    actionQuestion: "What is the FIRST nursing action?",
    actionOptions: [
      { id: "a", text: "Discontinue the IV, remove the catheter, and restart in a new site on the opposite extremity", isCorrect: true, rationale: "Correct. The first action is to discontinue the IV at the affected site, remove the catheter, and restart IV access in a new location. Apply warm compresses to the affected area to promote comfort and resolution. Document the phlebitis grade per facility scale." },
      { id: "b", text: "Apply cold compresses to the site and continue the infusion", isCorrect: false, rationale: "Incorrect. Cold compresses are not first-line for phlebitis (warm compresses are used), and continuing to infuse through an inflamed vein worsens the phlebitis. The IV must be moved to a new site." },
      { id: "c", text: "Slow the Vancomycin infusion rate and recheck in 1 hour", isCorrect: false, rationale: "Incorrect. Phlebitis signs indicate the vein is already inflamed. Continuing to use this site  -  even at a slower rate  -  prolongs irritation and increases risk of complications including thrombophlebitis." },
      { id: "d", text: "Administer IV Benadryl to reduce the vein inflammation", isCorrect: false, rationale: "Incorrect. IV Benadryl does not treat mechanical or chemical phlebitis. It is used for allergic reactions. Phlebitis management involves site removal, warm compresses, and possibly topical or oral anti-inflammatory agents." },
    ],
    examTrapTip: "Exam Trap: Phlebitis signs track ALONG the vein (linear redness and warmth). Infiltration signs are AT the site (swelling, coolness, pallor). CDC recommends peripheral IV rotation every 72-96 hours to prevent phlebitis. Vancomycin is a known vein irritant.",
  },
  {
    id: "catheter-infection",
    title: "ICU Patient with Central Venous Catheter",
    patientDescription: "A 60-year-old male in the ICU has a triple-lumen central venous catheter (CVC) in the right subclavian vein, inserted 8 days ago for TPN and vasopressor administration. He has been on mechanical ventilation for respiratory failure.",
    ivSetup: "Triple-lumen CVC in right subclavian, day 8. Lumen 1: TPN infusing. Lumen 2: Norepinephrine drip. Lumen 3: Intermittent medication access. Dressing last changed 48 hours ago.",
    signsAndSymptoms: [
      "New onset fever of 38.9°C (102°F) without other identifiable source",
      "Erythema and induration surrounding the CVC insertion site",
      "Purulent (yellowish-green) drainage noted at the catheter exit site",
      "Patient's WBC has risen from 9,000 to 18,500 over 24 hours",
      "Tenderness on palpation around the catheter tunnel area",
      "Chills and rigors noted during the last 2 hours",
    ],
    identifyQuestion: "What IV complication is most likely occurring?",
    identifyOptions: [
      { id: "a", text: "Central line-associated bloodstream infection (CLABSI)", isCorrect: true, rationale: "Correct. Fever without other source, purulent drainage at the catheter site, rising WBC, erythema, and chills in a patient with a CVC in place for 8 days are classic signs of a catheter-related bloodstream infection (CLABSI)." },
      { id: "b", text: "Phlebitis of the subclavian vein", isCorrect: false, rationale: "Incorrect. While vein inflammation can occur, the systemic signs (fever, chills, rising WBC) combined with purulent site drainage indicate infection, not simple phlebitis. Central lines rarely cause simple phlebitis." },
      { id: "c", text: "Normal inflammatory response to TPN", isCorrect: false, rationale: "Incorrect. TPN does not normally cause fever, purulent drainage, or significantly elevated WBC. These findings are abnormal and indicate infection requiring immediate intervention." },
      { id: "d", text: "Ventilator-associated pneumonia", isCorrect: false, rationale: "Incorrect. While VAP is possible in ventilated patients, the purulent drainage at the catheter site and local erythema point to the CVC as the infection source. VAP would present with pulmonary infiltrates and purulent sputum." },
    ],
    actionQuestion: "What is the FIRST nursing action?",
    actionOptions: [
      { id: "a", text: "Notify the provider and obtain blood cultures (both peripheral and from the catheter) before initiating antibiotics", isCorrect: true, rationale: "Correct. Blood cultures must be drawn BEFORE antibiotics are started to identify the causative organism. Draw cultures from both a peripheral vein and through the central line. The provider will likely order catheter removal and empiric antibiotics." },
      { id: "b", text: "Remove the central line immediately and send the catheter tip for culture", isCorrect: false, rationale: "Incorrect. While the catheter will likely need removal, blood cultures should be obtained FIRST. Additionally, removing the central line without a provider order  -  especially when vasopressors are infusing  -  could cause hemodynamic instability." },
      { id: "c", text: "Change the CVC dressing with sterile technique and monitor for 24 hours", isCorrect: false, rationale: "Incorrect. A dressing change alone is insufficient when signs of CLABSI are present. This delays critical treatment. Systemic infection with purulent drainage requires blood cultures, antibiotics, and likely catheter removal." },
      { id: "d", text: "Administer acetaminophen for the fever and recheck temperature in 4 hours", isCorrect: false, rationale: "Incorrect. Treating only the symptom (fever) without addressing the source (infected catheter) is dangerous. CLABSI can rapidly progress to sepsis and septic shock if untreated." },
    ],
    examTrapTip: "Exam Trap: Always draw blood cultures BEFORE starting antibiotics  -  this is a critical sequencing question on exams. CLABSI prevention bundles include: hand hygiene, maximal barrier precautions during insertion, chlorhexidine skin prep, optimal site selection, and daily review of line necessity.",
  },
  {
    id: "air-embolism",
    title: "Patient During Central Line Dressing Change",
    patientDescription: "A 55-year-old female has a right internal jugular central venous catheter for IV antibiotic therapy. During a routine dressing change, the nurse notices the catheter hub became momentarily disconnected from the IV tubing.",
    ivSetup: "Right internal jugular CVC, double-lumen. Line was briefly open to air during tubing disconnection. Patient was sitting upright in bed at the time of the event.",
    signsAndSymptoms: [
      "Patient suddenly reports sharp chest pain on the right side",
      "Acute onset of dyspnea (difficulty breathing)",
      "SpO2 drops from 97% to 88% within minutes",
      "Blood pressure drops from 128/76 to 82/50 mmHg",
      "Patient appears anxious and lightheaded",
      "A churning or \"mill wheel\" murmur is auscultated over the precordium",
    ],
    identifyQuestion: "Based on the clinical picture and circumstances, what complication has occurred?",
    identifyOptions: [
      { id: "a", text: "Venous air embolism", isCorrect: true, rationale: "Correct. The combination of sudden chest pain, dyspnea, rapid desaturation, hypotension, and a mill wheel murmur immediately after a central line disconnection is classic for venous air embolism. Air entered the venous system through the open catheter hub." },
      { id: "b", text: "Pulmonary embolism from a blood clot", isCorrect: false, rationale: "Incorrect. While PE can present with chest pain and dyspnea, the temporal relationship to the catheter disconnection and the mill wheel murmur are pathognomonic for air embolism, not thrombotic PE." },
      { id: "c", text: "Pneumothorax from catheter migration", isCorrect: false, rationale: "Incorrect. Pneumothorax would present with absent breath sounds on the affected side and would not be temporally related to the hub disconnection. The mill wheel murmur is specific to air embolism." },
      { id: "d", text: "Vasovagal syncope from anxiety during the dressing change", isCorrect: false, rationale: "Incorrect. Vasovagal syncope causes bradycardia and transient hypotension but would not cause chest pain, desaturation, or a mill wheel murmur. The symptom cluster is too severe and specific for a simple vasovagal response." },
    ],
    actionQuestion: "What is the FIRST nursing action?",
    actionOptions: [
      { id: "a", text: "Clamp the catheter, position the patient in left lateral Trendelenburg, and call for emergency assistance", isCorrect: true, rationale: "Correct. Immediately clamp the catheter to prevent further air entry. Position the patient in LEFT lateral Trendelenburg (Durant maneuver)  -  this traps air in the right atrium away from the pulmonary outflow tract. Call for emergency assistance and administer 100% oxygen." },
      { id: "b", text: "Sit the patient upright and administer oxygen via nasal cannula", isCorrect: false, rationale: "Incorrect. Sitting upright INCREASES the pressure gradient that draws air into the venous system through the open catheter. The correct position is left lateral Trendelenburg to trap air in the right atrium." },
      { id: "c", text: "Remove the central line immediately to prevent more air entry", isCorrect: false, rationale: "Incorrect. Removing the catheter could introduce more air. The first action is to CLAMP the catheter to seal the system, then position the patient appropriately. Line removal can be addressed after stabilization." },
      { id: "d", text: "Start a rapid IV fluid bolus to flush the air through the system", isCorrect: false, rationale: "Incorrect. Rapid fluid bolus does not effectively clear an air embolism and could worsen hemodynamic instability. The priority is proper positioning (left lateral Trendelenburg) to trap the air bubble." },
    ],
    examTrapTip: "Exam Trap: LEFT lateral Trendelenburg (not right) is the correct position for air embolism  -  it traps air in the right atrium apex. Prevention: always clamp central line lumens during tubing changes, use Luer-lock connections, and position patient supine or in Trendelenburg during line access procedures.",
  },
  {
    id: "fluid-overload",
    title: "Elderly Patient Receiving IV Fluid Resuscitation",
    patientDescription: "A 78-year-old female with a history of heart failure (EF 35%) was admitted for dehydration secondary to a UTI. She has been receiving IV normal saline at 150 mL/hr for the past 8 hours (total 1,200 mL infused).",
    ivSetup: "18G peripheral IV in left forearm. NS infusing at 150 mL/hr via pump. Patient also receiving IV Levofloxacin 750 mg daily. Total IV intake in 8 hours: ~1,400 mL.",
    signsAndSymptoms: [
      "New onset bilateral crackles heard on lung auscultation (bases to mid-fields)",
      "Jugular venous distension (JVD) observed at 45-degree elevation",
      "Weight gain of 2.3 kg since admission (8 hours ago)",
      "Peripheral edema noted in bilateral lower extremities (2+ pitting)",
      "Patient reports increasing dyspnea and orthopnea (needs 3 pillows)",
      "SpO2 has decreased from 96% to 91% on room air",
    ],
    identifyQuestion: "What IV-related complication is this patient experiencing?",
    identifyOptions: [
      { id: "a", text: "Fluid overload (circulatory overload)", isCorrect: true, rationale: "Correct. Crackles, JVD, rapid weight gain (1 kg ≈ 1 L fluid), peripheral edema, dyspnea, and orthopnea in a patient with heart failure receiving rapid IV fluids are classic signs of fluid overload/circulatory overload." },
      { id: "b", text: "Allergic reaction to normal saline", isCorrect: false, rationale: "Incorrect. True allergic reactions to normal saline are extremely rare. Fluid overload is caused by volume excess, not an immune response. Allergic reactions would present with urticaria, pruritus, or anaphylaxis." },
      { id: "c", text: "Acute heart failure exacerbation unrelated to IV fluids", isCorrect: false, rationale: "Incorrect. While this patient has underlying HF, the rapid symptom development directly correlates with aggressive IV fluid administration. The IV fluids are the precipitating cause of this acute decompensation." },
      { id: "d", text: "Pulmonary embolism", isCorrect: false, rationale: "Incorrect. PE typically presents with sudden onset pleuritic chest pain, tachycardia, and unilateral symptoms. This patient's bilateral crackles, JVD, weight gain, and peripheral edema point to fluid overload, not PE." },
    ],
    actionQuestion: "What is the FIRST nursing action?",
    actionOptions: [
      { id: "a", text: "Slow or stop the IV infusion and elevate the head of bed; notify the provider", isCorrect: true, rationale: "Correct. The immediate action is to reduce or stop the fluid input, position the patient upright (high Fowler's) to reduce preload and ease breathing, apply oxygen, and notify the provider who will likely order a diuretic (Furosemide IV). Monitor I&O strictly." },
      { id: "b", text: "Administer IV Furosemide 40 mg immediately", isCorrect: false, rationale: "Incorrect. While Furosemide will likely be needed, administering it without a provider order is outside the nurse's scope. The first nursing action is to address what you CAN control immediately  -  stopping the fluid infusion and positioning." },
      { id: "c", text: "Continue the IV fluids but add potassium supplementation", isCorrect: false, rationale: "Incorrect. Continuing IV fluids will worsen the overload. This patient is already showing signs of pulmonary edema. Potassium supplementation does not address the fundamental problem of excess volume." },
      { id: "d", text: "Restrict oral fluids and recheck weight in 4 hours", isCorrect: false, rationale: "Incorrect. While fluid restriction is appropriate long-term, this is an acute emergency. The IV fluids must be addressed immediately  -  oral restriction alone will not resolve active fluid overload with pulmonary edema signs." },
    ],
    examTrapTip: "Exam Trap: 1 kg weight gain = approximately 1 liter of fluid retention. Patients with HF, renal failure, and elderly patients are at highest risk for fluid overload. Always use an IV pump for precise rate control, and monitor I&O meticulously in at-risk patients.",
  },
  {
    id: "catheter-occlusion",
    title: "Patient with PICC Line for Long-Term Antibiotics",
    patientDescription: "A 42-year-old male has a PICC line in the right basilic vein for a 6-week course of IV Nafcillin for osteomyelitis. The PICC was placed 3 weeks ago. The home health nurse arrives for the daily antibiotic infusion.",
    ivSetup: "4 Fr single-lumen PICC line in right basilic vein, placed 21 days ago. Last flushed yesterday with heparin lock per protocol. Nafcillin 2g IV q4h scheduled.",
    signsAndSymptoms: [
      "IV pump alarms 'occlusion' when attempting to start the infusion",
      "Unable to flush the PICC line  -  meets significant resistance",
      "Unable to aspirate blood return from the catheter",
      "No swelling, redness, or tenderness at the PICC insertion site",
      "No signs of arm swelling that would suggest venous thrombosis",
      "Patient denies pain or discomfort in the arm or chest",
    ],
    identifyQuestion: "What IV complication is present?",
    identifyOptions: [
      { id: "a", text: "Catheter occlusion", isCorrect: true, rationale: "Correct. Inability to flush, inability to aspirate, and pump occlusion alarms without external signs of thrombosis or infiltration indicate intraluminal catheter occlusion  -  likely from a fibrin sheath, blood clot, or medication precipitate within the catheter." },
      { id: "b", text: "Catheter migration or dislodgement", isCorrect: false, rationale: "Incorrect. While catheter migration can cause malfunction, the complete inability to flush or aspirate with no external length change more likely indicates intraluminal occlusion. Migration typically allows some flow in certain positions." },
      { id: "c", text: "Subclavian vein thrombosis", isCorrect: false, rationale: "Incorrect. Deep vein thrombosis around the PICC would typically present with arm swelling, pain, and possibly collateral vein distension. This patient has no arm swelling or pain  -  the problem is within the catheter lumen." },
      { id: "d", text: "Infiltration of the PICC line", isCorrect: false, rationale: "Incorrect. Infiltration from a PICC line is uncommon because the catheter tip sits in a large central vein. There are no signs of local swelling at the site, and the problem is inability to infuse at all, not leakage." },
    ],
    actionQuestion: "What is the FIRST nursing action?",
    actionOptions: [
      { id: "a", text: "Attempt to gently flush with normal saline using a 10 mL syringe; if resistance persists, notify the provider for thrombolytic instillation orders", isCorrect: true, rationale: "Correct. First, attempt gentle flushing with a 10 mL syringe (smaller syringes generate excessive pressure that can rupture the catheter). If occlusion persists, notify the provider  -  Alteplase (CathFlo) instillation is the standard treatment for thrombotic catheter occlusion." },
      { id: "b", text: "Use a 3 mL syringe to apply high-pressure flushing to clear the blockage", isCorrect: false, rationale: "Incorrect. Small syringes (< 10 mL) generate dangerously high pressure that can rupture the PICC catheter, causing catheter embolism. Always use 10 mL or larger syringes with PICC lines." },
      { id: "c", text: "Remove the PICC line and insert a new peripheral IV for the antibiotic dose", isCorrect: false, rationale: "Incorrect. Removing the PICC prematurely ends long-term IV access that took a specialized procedure to place. Catheter occlusion is often treatable with thrombolytic agents. Removal should be a last resort." },
      { id: "d", text: "Reposition the patient's arm and have them cough while attempting to flush", isCorrect: false, rationale: "Incorrect. While positional occlusion is possible (catheter pinch-off), the inability to flush in any position and absence of blood return suggest intraluminal occlusion, not a positional issue. This approach delays appropriate treatment." },
    ],
    examTrapTip: "Exam Trap: NEVER use a syringe smaller than 10 mL to flush a PICC or central line  -  small syringes generate too much PSI and can rupture the catheter. Alteplase (CathFlo) is the standard thrombolytic for catheter declotting. Proper flushing technique (SASH: Saline-Administer-Saline-Heparin) prevents most occlusions.",
  },
  {
    id: "speed-shock",
    title: "Patient Receiving IV Push Medication",
    patientDescription: "A 38-year-old female is hospitalized for a severe migraine. A new nurse administers IV push Phenytoin (Dilantin) 150 mg through a peripheral IV. The medication was pushed over approximately 30 seconds instead of the recommended minimum of 5 minutes.",
    ivSetup: "22G peripheral IV in left hand. Phenytoin 150 mg given IV push rapidly (over ~30 seconds). Recommended administration rate: no faster than 25-50 mg/min (3-6 minutes for this dose).",
    signsAndSymptoms: [
      "Patient suddenly develops flushing of the face, neck, and chest",
      "Heart rate drops from 82 to 48 bpm (severe bradycardia)",
      "Blood pressure drops from 118/72 to 76/44 mmHg",
      "Patient reports dizziness, tightness in chest, and tingling in extremities",
      "Cardiac monitor shows widened QRS complex",
      "Patient becomes diaphoretic and appears pre-syncopal",
    ],
    identifyQuestion: "What IV complication has occurred?",
    identifyOptions: [
      { id: "a", text: "Speed shock", isCorrect: true, rationale: "Correct. Speed shock occurs when IV medication is administered too rapidly, causing toxic drug levels in the plasma. The rapid Phenytoin push caused cardiovascular toxicity: bradycardia, hypotension, widened QRS, and potential cardiac arrest. This is a preventable medication error." },
      { id: "b", text: "Anaphylactic reaction to Phenytoin", isCorrect: false, rationale: "Incorrect. Anaphylaxis presents with urticaria, bronchospasm, angioedema, and tachycardia (not bradycardia). The cardiovascular depression (bradycardia, hypotension) and temporal relationship to rapid administration indicate speed shock, not allergy." },
      { id: "c", text: "Vasovagal syncope", isCorrect: false, rationale: "Incorrect. While vasovagal syncope can cause bradycardia and hypotension, it would not cause widened QRS complex, flushing, or the severe hemodynamic instability seen here. The rapid IV push is the causative factor." },
      { id: "d", text: "Air embolism from the IV push", isCorrect: false, rationale: "Incorrect. Air embolism from an IV push is very unlikely and would present with chest pain, dyspnea, and a mill wheel murmur  -  not the bradycardia, widened QRS, and flushing pattern seen with Phenytoin toxicity." },
    ],
    actionQuestion: "What is the FIRST nursing action?",
    actionOptions: [
      { id: "a", text: "Stop the medication immediately, maintain IV access, initiate continuous cardiac monitoring, and call for emergency assistance", isCorrect: true, rationale: "Correct. Stop the medication immediately (though it's already been given). Maintain IV access for emergency drugs. Initiate continuous cardiac monitoring for arrhythmias. Call for emergency assistance  -  the patient may need atropine for bradycardia, IV fluids for hypotension, and possibly external pacing." },
      { id: "b", text: "Administer epinephrine 0.3 mg IM for suspected anaphylaxis", isCorrect: false, rationale: "Incorrect. This is not anaphylaxis  -  it's speed shock from rapid Phenytoin administration. Epinephrine is not the first-line treatment. The cardiovascular depression needs cardiac-specific monitoring and potential atropine." },
      { id: "c", text: "Flush the IV with a large volume of saline to dilute the medication", isCorrect: false, rationale: "Incorrect. The medication has already been administered and absorbed. Flushing with saline will not reverse the systemic effects of the drug. Cardiac monitoring and supportive care are the priorities." },
      { id: "d", text: "Place the patient flat and elevate the legs only", isCorrect: false, rationale: "Incorrect. While leg elevation may temporarily support blood pressure, it does not address the cardiac toxicity (bradycardia, widened QRS) that is the primary danger. Continuous cardiac monitoring and emergency response are critical." },
    ],
    examTrapTip: "Exam Trap: Speed shock is caused by too-rapid IV administration, not by the drug itself. Know your high-risk IV push medications and their rates: Phenytoin (max 50 mg/min), Potassium (max 10 mEq/hr peripherally), Vancomycin (over 60+ min to prevent Red Man Syndrome). When in doubt, push slower.",
  },
];

type Phase = "identify" | "action";
type QuizState = "answering" | "feedback" | "complete";

export default function IVComplicationsSimulatorPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("identify");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("answering");
  const [score, setScore] = useState({ identify: 0, action: 0 });
  const [answeredScenarios, setAnsweredScenarios] = useState<Set<string>>(new Set());

  const scenario = scenarios[currentIndex];
  const totalScenarios = scenarios.length;
  const isComplete = answeredScenarios.size === totalScenarios;

  const currentOptions = phase === "identify" ? scenario.identifyOptions : scenario.actionOptions;
  const currentQuestion = phase === "identify" ? scenario.identifyQuestion : scenario.actionQuestion;
  const selectedOption = currentOptions.find((o) => o.id === selectedAnswer);

  const handleSelect = (id: string) => {
    if (quizState !== "answering") return;
    setSelectedAnswer(id);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const option = currentOptions.find((o) => o.id === selectedAnswer);
    if (option?.isCorrect) {
      setScore((prev) => ({
        ...prev,
        [phase]: prev[phase] + 1,
      }));
    }
    setQuizState("feedback");
  };

  const handleNextPhase = () => {
    if (phase === "identify") {
      setPhase("action");
      setSelectedAnswer(null);
      setQuizState("answering");
    } else {
      setAnsweredScenarios((prev) => new Set(prev).add(scenario.id));
      if (currentIndex < totalScenarios - 1) {
        setCurrentIndex((i) => i + 1);
        setPhase("identify");
        setSelectedAnswer(null);
        setQuizState("answering");
      } else {
        setQuizState("complete");
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setPhase("identify");
    setSelectedAnswer(null);
    setQuizState("answering");
    setScore({ identify: 0, action: 0 });
    setAnsweredScenarios(new Set());
  };

  const totalCorrect = score.identify + score.action;
  const totalPossible = totalScenarios * 2;
  const progressPercent = Math.round((answeredScenarios.size / totalScenarios) * 100);

  if (isComplete || (quizState === "complete" && currentIndex === totalScenarios - 1)) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <SEO
          title={t("pages.ivComplicationsSimulator.ivComplicationsLineManagementSimulator")}
          description={t("pages.ivComplicationsSimulator.freeInteractiveNursingSimulatorFor")}
          keywords="IV complications nursing, infiltration vs extravasation, phlebitis management, CLABSI prevention, air embolism nursing, IV therapy complications, nursing simulation free"
          canonicalPath="/iv-complications-simulator"
          ogType="website"
        />
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
          <BreadcrumbNav />
          <Card className="border-2 border-primary/20 bg-white" data-testid="card-results">
            <CardContent className="p-6 sm:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" data-testid="text-results-title">{t("pages.ivComplicationsSimulator.simulationComplete")}</h2>
              <p className="text-gray-500 mb-8">You've completed all {totalScenarios} IV complication scenarios.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t("pages.ivComplicationsSimulator.identification")}</p>
                  <p className="text-2xl font-bold text-blue-700" data-testid="text-score-identify">{score.identify}/{totalScenarios}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">{t("pages.ivComplicationsSimulator.firstAction")}</p>
                  <p className="text-2xl font-bold text-purple-700" data-testid="text-score-action">{score.action}/{totalScenarios}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">{t("pages.ivComplicationsSimulator.overall")}</p>
                  <p className="text-2xl font-bold text-emerald-700" data-testid="text-score-total">{totalCorrect}/{totalPossible}</p>
                </div>
              </div>

              <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <h3 className="text-sm font-bold text-amber-800">{t("pages.ivComplicationsSimulator.keyTakeaways")}</h3>
                </div>
                <ul className="space-y-2 text-sm text-amber-900">
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span>{t("pages.ivComplicationsSimulator.infiltrationCoolPaleSwollenExtravasation")}</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span>{t("pages.ivComplicationsSimulator.phlebitisTracksAlongTheVein")}</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span>{t("pages.ivComplicationsSimulator.airEmbolismLeftLateralTrendelenburg")}</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span>{t("pages.ivComplicationsSimulator.bloodCulturesBeforeAntibioticsFor")}</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span>{t("pages.ivComplicationsSimulator.neverUseSyringesSmallerThan")}</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span>{t("pages.ivComplicationsSimulator.speedShockIsCausedBy")}</li>
                </ul>
              </div>

              <Button className="rounded-full gap-2 bg-primary text-white hover:brightness-110" onClick={handleRestart} data-testid="button-restart">
                <RotateCcw className="w-4 h-4" />
                Restart Simulation
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.ivComplicationsSimulator.ivComplicationsLineManagementSimulator2")}
        description={t("pages.ivComplicationsSimulator.freeInteractiveNursingSimulatorFor2")}
        keywords="IV complications nursing, infiltration vs extravasation, phlebitis management, CLABSI prevention, air embolism nursing, IV therapy complications, nursing simulation free"
        canonicalPath="/iv-complications-simulator"
        ogType="website"
      />
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <BreadcrumbNav />
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center">
              <Syringe className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-page-title">
                IV Complications Simulator
              </h1>
              <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mt-0.5">
                Free Interactive Module
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500" data-testid="text-progress">
              Scenario {currentIndex + 1} of {totalScenarios}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold">
              {phase === "identify" ? "Phase 1: Identify" : "Phase 2: Action"}
            </span>
          </div>
          <span className="text-xs text-gray-400" data-testid="text-score-running">
            Score: {totalCorrect}/{(answeredScenarios.size * 2) + (phase === "action" && quizState === "feedback" ? 1 : 0) + (phase === "identify" && quizState === "feedback" ? 1 : 0)}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-8" data-testid="progress-bar">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(((currentIndex + (phase === "action" ? 0.5 : 0)) / totalScenarios) * 100, 2)}%` }}
          />
        </div>

        <Card className="border border-gray-100 bg-white mb-6" data-testid={`card-scenario-${scenario.id}`}>
          <CardContent className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              {scenario.title}
            </h2>

            {scenarioImages[scenario.id] && (
              <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={scenarioImages[scenario.id]}
                  alt={scenarioImageAlt[scenario.id] || `Clinical image for ${scenario.title}`}
                  className="w-full h-48 sm:h-56 object-cover"
                  loading="lazy"
                  data-testid={`img-scenario-${scenario.id}`}
                />
                <p className="text-[10px] text-gray-400 italic px-3 py-1.5 bg-gray-50">
                  Clinical reference image for educational purposes
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t("pages.ivComplicationsSimulator.patientDescription")}</p>
              <p className="text-sm text-gray-700 leading-relaxed" data-testid="text-patient-description">{scenario.patientDescription}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> IV Setup
              </p>
              <p className="text-sm text-blue-800 leading-relaxed" data-testid="text-iv-setup">{scenario.ivSetup}</p>
            </div>

            <div className="mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Thermometer className="w-3 h-3" /> Signs & Symptoms Observed
              </p>
              <div className="space-y-1.5">
                {scenario.signsAndSymptoms.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-1" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 bg-white mb-6" data-testid="card-question">
          <CardContent className="p-5 sm:p-6">
            <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-600" />
              {currentQuestion}
            </p>

            <div className="space-y-3">
              {currentOptions.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const showFeedback = quizState === "feedback";
                let borderStyle = "border-gray-100 hover:border-teal-200";
                if (showFeedback && option.isCorrect) borderStyle = "border-emerald-300 bg-emerald-50/40";
                else if (showFeedback && isSelected && !option.isCorrect) borderStyle = "border-red-300 bg-red-50/40";
                else if (isSelected) borderStyle = "border-teal-400 bg-teal-50/30";

                return (
                  <div key={option.id}>
                    <Card
                      className={`border-2 transition-all duration-200 ${borderStyle} ${quizState === "answering" ? "cursor-pointer" : ""}`}
                      onClick={() => handleSelect(option.id)}
                      data-testid={`card-option-${phase}-${option.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {showFeedback ? (
                            option.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0 mt-0.5" />
                            )
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${isSelected ? "border-teal-500 bg-teal-500" : "border-gray-300"}`} />
                          )}
                          <p className="text-sm text-gray-700 leading-relaxed">{option.text}</p>
                        </div>

                        {showFeedback && (isSelected || option.isCorrect) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className={`text-sm leading-relaxed ${option.isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                              {option.rationale}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {quizState === "answering" && (
              <div className="flex justify-end mt-5">
                <Button
                  className="rounded-full gap-2 bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                  disabled={!selectedAnswer}
                  onClick={handleSubmit}
                  data-testid="button-submit-answer"
                >
                  Submit Answer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {quizState === "feedback" && (
              <>
                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">{t("pages.ivComplicationsSimulator.examTrapTip")}</p>
                      <p className="text-sm text-amber-800 leading-relaxed" data-testid="text-exam-trap">{scenario.examTrapTip}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-5">
                  <Button
                    className="rounded-full gap-2 bg-teal-600 text-white hover:bg-teal-700"
                    onClick={handleNextPhase}
                    data-testid="button-next"
                  >
                    {phase === "identify" ? "Next: First Action" : currentIndex < totalScenarios - 1 ? "Next Scenario" : "View Results"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <AdminEditButton pageName="iv-complications-simulator" />
      <Footer />
    </div>
  );
}