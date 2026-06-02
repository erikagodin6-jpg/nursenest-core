import { pathwayHubAppFlashcardsHref, pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import { validateMedMathNumericQuestion, type MedMathNumericQuestion } from "@/lib/med-math/validate-med-math-answer-realism";

export type MedCalcCategorySlug =
  | "tablets"
  | "liquid-medications"
  | "iv-flow-rates"
  | "iv-pump-ml-hr"
  | "weight-based-dosing"
  | "pediatric-dosing"
  | "drip-factor-gtt-min"
  | "reconstitution"
  | "insulin-dosing"
  | "heparin-protocols";

export type MedCalcTrack = "rn" | "pn" | "np";
export type MedCalcDifficulty = "beginner" | "intermediate" | "advanced";
export type MedCalcQuestionType =
  | "numeric_input"
  | "multiple_choice"
  | "multi_step"
  | "unit_conversion"
  | "clinical_scenario";

export type MedCalcAnswerFormat = {
  unit: string;
  decimals: number;
  roundingText: string;
  increment?: number;
  exactInteger?: boolean;
};

export type MedCalcWorkedExample = {
  title: string;
  problem: string;
  steps: string[];
  answer: string;
};

export type MedCalcQuestion = {
  id: string;
  type: MedCalcQuestionType;
  difficulty: MedCalcDifficulty;
  stem: string;
  numericAnswer: number | null;
  options: string[];
  correctIndex: number | null;
  answerFormat: MedCalcAnswerFormat;
  solutionSteps: string[];
  rationale: string;
  safetyNote: string;
};

export type MedCalcFlashcard = {
  id: string;
  prompt: string;
  answer: string;
};

export type MedCalcCategoryDefinition = {
  slug: MedCalcCategorySlug;
  title: string;
  description: string;
};

export type MedCalcLessonDefinition = {
  slug: string;
  category: MedCalcCategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  conceptExplanation: string[];
  dimensionalAnalysisMethod: string[];
  ratioProportionMethod: string[];
  formulaMethod: string[];
  equationManipulation: string[];
  unitConversions: string[];
  workedExamples: MedCalcWorkedExample[];
  commonMistakes: string[];
  safetyConsiderations: string[];
  questionTopic: string;
  supportedTracks: MedCalcTrack[];
};

export type MedCalcProgressSnapshot = {
  strictAttempts: number;
  strictPasses: number;
  bestStreak: number;
  totalAnswered: number;
  correctAnswered: number;
};

export type MedCalcStudyLinks = {
  flashcardsHref: string;
  questionsHref: string;
  catHref: string;
  medicationDrillsHref: string;
};

type LessonSeed = {
  slug: string;
  category: MedCalcCategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  conceptExplanation: string[];
  dimensionalAnalysisMethod: string[];
  ratioProportionMethod: string[];
  formulaMethod: string[];
  equationManipulation: string[];
  unitConversions: string[];
  workedExamples: MedCalcWorkedExample[];
  commonMistakes: string[];
  safetyConsiderations: string[];
  questionTopic: string;
};

const CATEGORY_DEFS: readonly MedCalcCategoryDefinition[] = [
  { slug: "tablets", title: "Tablets", description: "Tablet and capsule dosing with workable fractions and safety rounding." },
  { slug: "liquid-medications", title: "Liquid medications", description: "Oral and liquid dose volume calculations with concentration matching." },
  { slug: "iv-flow-rates", title: "IV flow rates", description: "Gravity-flow calculations and rate matching under time pressure." },
  { slug: "iv-pump-ml-hr", title: "IV pump (mL/hr)", description: "Pump programming with time conversions and infusion safety checks." },
  { slug: "weight-based-dosing", title: "Weight-based dosing (mg/kg)", description: "Adult and pediatric mg/kg dose calculations with safe limits." },
  { slug: "pediatric-dosing", title: "Pediatric dosing", description: "Safe-dose range logic, concentration checks, and escalation habits for children." },
  { slug: "drip-factor-gtt-min", title: "Drip factor (gtt/min)", description: "Manual tubing calculations with whole-drop rounding rules." },
  { slug: "reconstitution", title: "Reconstitution", description: "Powder reconstitution, final concentration, and withdrawn volume reasoning." },
  { slug: "insulin-dosing", title: "Insulin dosing", description: "Insulin safety, correction scales, and dual-check habits." },
  { slug: "heparin-protocols", title: "Heparin protocols", description: "Units/kg/hr starts, bolus logic, and aPTT/anti-Xa-aware rate changes." },
] as const;

const COMMON_TRACKS: MedCalcTrack[] = ["rn", "pn", "np"];

function lesson(seed: LessonSeed): MedCalcLessonDefinition {
  return { ...seed, supportedTracks: COMMON_TRACKS };
}

const LESSONS: readonly MedCalcLessonDefinition[] = [
  lesson({
    slug: "tablet-dose-fractions",
    category: "tablets",
    title: "Tablet Dose Fractions: Ratio Setup, Quarter-Tablet Limits, and Safety Checks",
    shortTitle: "Tablet fractions",
    description: "Build tablet answers that are clinically workable, correctly rounded, and double-checked against the order.",
    conceptExplanation: [
      "Tablet questions are not just arithmetic. The answer must match a form a nurse can actually administer.",
      "The first safety question is whether the ordered dose can be made from the tablet strength without impossible fractions.",
    ],
    dimensionalAnalysisMethod: [
      "Start with the ordered dose on top so the final unit is tablets.",
      "Multiply by one tablet over the amount supplied per tablet.",
      "Cancel mg against mg and keep tablets as the final unit.",
    ],
    ratioProportionMethod: [
      "Set available strength over one tablet equal to ordered dose over x tablets.",
      "Cross-multiply, then solve for x.",
      "Check whether x lands on a workable fraction such as 0.5 or 0.25 tablets.",
    ],
    formulaMethod: [
      "Tablets to give = Ordered dose / Dose on hand per tablet.",
      "Use the formula only after confirming both values use the same unit.",
    ],
    equationManipulation: [
      "If x tablets contain 250 mg, then 1 tablet contains 250 mg and x = ordered/250.",
      "Rearrange proportion equations by isolating x after cross-multiplication.",
    ],
    unitConversions: [
      "Convert g to mg before dividing.",
      "Convert mcg to mg when the supply is labeled in mg.",
    ],
    workedExamples: [
      {
        title: "Basic tablet dose",
        problem: "Order: acetaminophen 500 mg PO. Supply: 250 mg/tablet.",
        steps: ["500 mg ordered", "250 mg per 1 tablet", "500 / 250 = 2 tablets"],
        answer: "2 tablets",
      },
      {
        title: "Quarter-tablet check",
        problem: "Order: 37.5 mg. Supply: 25 mg/tablet.",
        steps: ["37.5 / 25 = 1.5 tablets", "1.5 tablets is a workable tablet fraction"],
        answer: "1.5 tablets",
      },
    ],
    commonMistakes: [
      "Dividing by the volume line from liquid formulas when the question is tablet-based.",
      "Returning impossible fractions such as 1.33 tablets without stopping to assess safety.",
    ],
    safetyConsiderations: [
      "If the answer is not a workable tablet fraction, stop and verify whether a different formulation is required.",
      "High-alert and pediatric medications need a second check even when the arithmetic is simple.",
    ],
    questionTopic: "tablet-dose",
  }),
  lesson({
    slug: "liquid-dose-volumes",
    category: "liquid-medications",
    title: "Liquid Medication Volumes: Concentration Matching, Syringe Choice, and Final mL",
    shortTitle: "Liquid doses",
    description: "Turn ordered doses into measurable oral or enteral liquid volumes with correct concentration reasoning.",
    conceptExplanation: [
      "Liquid questions ask for the volume that contains the ordered dose, not the amount of drug on the label.",
      "The practical safety check is whether the final volume fits the syringe and route.",
    ],
    dimensionalAnalysisMethod: [
      "Place the ordered dose over one, then multiply by available volume over available dose.",
      "Cancel the drug unit and leave mL.",
      "Round to the precision appropriate for the measuring device.",
    ],
    ratioProportionMethod: [
      "Available dose is to available volume as ordered dose is to x mL.",
      "Cross-multiply and solve for x.",
    ],
    formulaMethod: [
      "Volume to give = (Ordered dose / Dose on hand) x Volume on hand.",
    ],
    equationManipulation: [
      "Rearrange concentration statements like 250 mg = 5 mL to isolate mg per mL or mL per mg.",
      "If needed, convert the label to a one-milliliter concentration before solving.",
    ],
    unitConversions: [
      "1000 mcg = 1 mg",
      "1000 mg = 1 g",
    ],
    workedExamples: [
      {
        title: "Liquid antibiotic",
        problem: "Order: 375 mg PO. Supply: 250 mg per 5 mL.",
        steps: ["375/250 = 1.5", "1.5 x 5 mL = 7.5 mL"],
        answer: "7.5 mL",
      },
      {
        title: "Microgram conversion",
        problem: "Order: 125 mcg. Supply: 0.25 mg per 5 mL.",
        steps: ["0.25 mg = 250 mcg", "125/250 = 0.5", "0.5 x 5 mL = 2.5 mL"],
        answer: "2.5 mL",
      },
    ],
    commonMistakes: [
      "Skipping the mcg-to-mg conversion and using mismatched units.",
      "Using the wrong syringe precision for tiny doses.",
    ],
    safetyConsiderations: [
      "Measure small pediatric volumes with the smallest appropriate oral syringe.",
      "Reassess route safety when the required volume is unusually large for the patient.",
    ],
    questionTopic: "liquid-dose",
  }),
  lesson({
    slug: "gravity-iv-flow-rates",
    category: "iv-flow-rates",
    title: "Gravity IV Flow Rates: Time Conversion, Drop Factors, and Bedside Rechecks",
    shortTitle: "IV flow rates",
    description: "Calculate manual IV flow rates while keeping whole-drop rules and time conversions clean.",
    conceptExplanation: [
      "Gravity infusion questions end in drops per minute, so the answer must reflect tubing calibration and time in minutes.",
      "Because gtt/min cannot be programmed as decimals, whole-drop rounding is part of clinical correctness.",
    ],
    dimensionalAnalysisMethod: [
      "Set mL to infuse over total minutes, then multiply by drop factor.",
      "Cancel mL and minutes to leave drops/minute.",
    ],
    ratioProportionMethod: [
      "Use total volume : total time = x mL : 1 minute, then apply drop factor.",
    ],
    formulaMethod: [
      "gtt/min = (mL x drop factor) / minutes",
    ],
    equationManipulation: [
      "If you know desired gtt/min and volume, isolate minutes to back-check an answer.",
      "From gtt/min = (mL x gtt/mL) / min, multiply both sides by min, then divide by (mL x gtt/mL) to isolate minutes.",
    ],
    unitConversions: [
      "Hours must become minutes before using the formula.",
      "Half hours and quarter hours should be converted exactly, not estimated.",
    ],
    workedExamples: [
      {
        title: "Classic gravity set",
        problem: "Infuse 1000 mL over 8 hr with tubing 15 gtt/mL.",
        steps: ["8 hr = 480 min", "(1000 x 15) / 480 = 31.25", "Round to 31 gtt/min"],
        answer: "31 gtt/min",
      },
      {
        title: "Short antibiotic infusion",
        problem: "Infuse 50 mL over 30 min with 20 gtt/mL tubing.",
        steps: ["(50 x 20) / 30 = 33.3", "Round to 33 gtt/min"],
        answer: "33 gtt/min",
      },
    ],
    commonMistakes: [
      "Leaving time in hours and getting a wildly unsafe result.",
      "Reporting 31.25 gtt/min instead of rounding to a whole drop.",
    ],
    safetyConsiderations: [
      "Recount manual drips after patient movement or height changes.",
      "Use pumps when the medication is high-risk or the rate tolerance is narrow.",
    ],
    questionTopic: "iv-flow",
  }),
  lesson({
    slug: "iv-pump-programming-ml-hr",
    category: "iv-pump-ml-hr",
    title: "IV Pump Programming (mL/hr): Time Windows, Back-Checks, and Pump Safety",
    shortTitle: "IV pump mL/hr",
    description: "Program infusion pumps accurately by converting time and checking whether the result is clinically reasonable.",
    conceptExplanation: [
      "Pump questions end in mL/hr, so the time unit must be hours and the answer is usually rounded to one decimal or whole-number policy.",
      "The bedside sanity check is whether the final rate matches the infusion purpose and patient size.",
    ],
    dimensionalAnalysisMethod: [
      "Volume over time should be arranged so hours remain in the denominator.",
      "Convert minutes to fractional hours before dividing when needed.",
    ],
    ratioProportionMethod: [
      "Set total volume over total hours equal to x mL over 1 hour.",
    ],
    formulaMethod: [
      "mL/hr = Total mL / Total hours",
    ],
    equationManipulation: [
      "If x mL/hr for t hours must equal total volume, solve x = volume/t.",
      "Back-solve time by rearranging to time = volume/rate.",
    ],
    unitConversions: [
      "45 minutes = 0.75 hr",
      "90 minutes = 1.5 hr",
    ],
    workedExamples: [
      {
        title: "Standard pump programming",
        problem: "Infuse 500 mL over 4 hr.",
        steps: ["500 / 4 = 125 mL/hr"],
        answer: "125 mL/hr",
      },
      {
        title: "Minute conversion",
        problem: "Infuse 150 mL over 45 min.",
        steps: ["45 min = 0.75 hr", "150 / 0.75 = 200 mL/hr"],
        answer: "200 mL/hr",
      },
    ],
    commonMistakes: [
      "Dividing by 45 instead of converting to hours first.",
      "Accepting an extreme rate without questioning whether the medication should be on a pump at all.",
    ],
    safetyConsiderations: [
      "Back-check that the bag will finish when expected.",
      "Question unusually high rates for pediatric, cardiac, or renal patients before starting the infusion.",
    ],
    questionTopic: "pump-rate",
  }),
  lesson({
    slug: "adult-weight-based-dosing",
    category: "weight-based-dosing",
    title: "Weight-Based Dosing (mg/kg): Adult Doses, Cap Checks, and Unit Discipline",
    shortTitle: "Weight-based dosing",
    description: "Compute mg/kg doses safely by converting weight correctly and comparing to dose caps and formulation strength.",
    conceptExplanation: [
      "Weight-based questions produce a dose first, then often require a second step to convert that dose into mL or tablets.",
      "Clinical safety depends on confirming the right weight unit and any maximum dose cap before administration.",
    ],
    dimensionalAnalysisMethod: [
      "kg stays in the denominator of the ordered amount and cancels with the patient's kg weight.",
      "Once the total mg dose is found, convert to the supplied form if needed.",
    ],
    ratioProportionMethod: [
      "If 1 kg needs x mg, then the patient weight needs total dose y mg.",
    ],
    formulaMethod: [
      "Dose = mg/kg x weight in kg",
    ],
    equationManipulation: [
      "Rearrange to solve allowable mg/kg if given a max dose and patient weight.",
      "If dose = mg/kg x kg, then mg/kg = dose ÷ kg — use this to audit whether an order implies an unsafe mg/kg.",
    ],
    unitConversions: [
      "1 kg = 2.2 lb",
      "Always convert pounds to kilograms before applying mg/kg.",
    ],
    workedExamples: [
      {
        title: "Direct mg/kg",
        problem: "Order 8 mg/kg for a patient weighing 70 kg.",
        steps: ["8 x 70 = 560 mg"],
        answer: "560 mg",
      },
      {
        title: "Weight conversion",
        problem: "Order 5 mg/kg for a patient weighing 154 lb.",
        steps: ["154 / 2.2 = 70 kg", "5 x 70 = 350 mg"],
        answer: "350 mg",
      },
    ],
    commonMistakes: [
      "Multiplying by pounds instead of kilograms.",
      "Stopping after the mg dose when the question actually asks for mL or tablets.",
    ],
    safetyConsiderations: [
      "Check maximum single-dose and daily-dose caps before accepting the math answer.",
      "High-alert medications require an independent double check after the numeric calculation.",
    ],
    questionTopic: "weight-based",
  }),
  lesson({
    slug: "pediatric-safe-dose-ranges",
    category: "pediatric-dosing",
    title: "Pediatric Dosing: Safe Ranges, Concentration Checks, and High-Risk Escalation",
    shortTitle: "Pediatric dosing",
    description: "Move beyond raw mg/kg arithmetic into safe-dose ranges, concentration matching, and escalation decisions.",
    conceptExplanation: [
      "Pediatric calculation questions are safety questions first: is the ordered dose inside the safe range for this child?",
      "A correct arithmetic result can still be unsafe if the order exceeds the recommended range or if the concentration is mismatched.",
    ],
    dimensionalAnalysisMethod: [
      "Calculate the safe minimum and maximum dose range in mg first.",
      "Compare the ordered dose to that range before converting to volume.",
    ],
    ratioProportionMethod: [
      "Use safe-dose range per kg over one kg, then scale to the child's weight.",
    ],
    formulaMethod: [
      "Safe dose range = recommended mg/kg x weight in kg",
    ],
    equationManipulation: [
      "Solve backwards to find the mg/kg implied by an order and compare it with the reference range.",
      "If daily max = mg/kg/day x kg, divide by doses per day before comparing a single scheduled dose to a daily range.",
    ],
    unitConversions: [
      "lb to kg conversion must be exact enough to preserve safety.",
      "mcg and mg conversions are especially important in neonatal and pediatric dosing.",
    ],
    workedExamples: [
      {
        title: "Safe range comparison",
        problem: "A child weighs 18 kg. Safe range is 10-15 mg/kg/day in 3 divided doses.",
        steps: ["Daily safe range: 180-270 mg/day", "Per dose range: 60-90 mg", "Compare the order to that per-dose range"],
        answer: "Per-dose safe range is 60-90 mg",
      },
      {
        title: "Order exceeds safe range",
        problem: "Same child ordered 120 mg per dose.",
        steps: ["120 mg exceeds 90 mg maximum per dose", "Do not administer until clarified"],
        answer: "Unsafe order - clarify",
      },
    ],
    commonMistakes: [
      "Comparing a daily safe range with a single-dose order without dividing correctly.",
      "Assuming a dose is safe because the mL amount looks small.",
    ],
    safetyConsiderations: [
      "If the order falls outside the safe range, stop and clarify instead of forcing the calculation to fit.",
      "Weight changes matter; do not rely on outdated pediatric weights.",
    ],
    questionTopic: "pediatric-dose",
  }),
  lesson({
    slug: "drip-factor-whole-drop-rules",
    category: "drip-factor-gtt-min",
    title: "Drip Factor and Whole-Drop Rules: Macrodrip vs Microdrip Under Pressure",
    shortTitle: "Drip factor",
    description: "Use tubing-specific drop factors and whole-drop rounding rules without losing the clinical thread.",
    conceptExplanation: [
      "Drip factor questions are gravity questions with an extra safety check: the tubing calibration changes the answer.",
      "Microdrip and macrodrip are not interchangeable, and that mismatch is a common exam trap.",
    ],
    dimensionalAnalysisMethod: [
      "Keep the tubing factor attached to mL so it cancels correctly and leaves drops.",
    ],
    ratioProportionMethod: [
      "Convert the infusion to mL/min first, then apply the tubing factor.",
    ],
    formulaMethod: [
      "gtt/min = (Volume x gtt/mL) / minutes",
    ],
    equationManipulation: [
      "Back-solve the expected time if the counted drip rate is known and you need to verify a manual setup.",
      "If gtt/min = mL/min x gtt/mL, then mL/min = gtt/min ÷ gtt/mL — rearrange before plugging unknowns.",
    ],
    unitConversions: [
      "Microdrip is often 60 gtt/mL.",
      "Macrodrip sets vary and must be read from the packaging.",
    ],
    workedExamples: [
      {
        title: "Microdrip shortcut",
        problem: "Infuse 60 mL/hr with microdrip tubing.",
        steps: ["60 mL/hr = 1 mL/min", "1 x 60 = 60 gtt/min"],
        answer: "60 gtt/min",
      },
      {
        title: "Macrodrip comparison",
        problem: "Infuse 60 mL/hr with 15 gtt/mL tubing.",
        steps: ["60 mL/hr = 1 mL/min", "1 x 15 = 15 gtt/min"],
        answer: "15 gtt/min",
      },
    ],
    commonMistakes: [
      "Applying a microdrip shortcut to macrodrip tubing.",
      "Leaving a decimal answer instead of whole drops.",
    ],
    safetyConsiderations: [
      "Manual gravity sets need recounts because posture and bag height change the actual rate.",
      "Use a pump when medication tolerance is narrow or the patient condition is unstable.",
    ],
    questionTopic: "drip-factor",
  }),
  lesson({
    slug: "reconstitution-final-concentration",
    category: "reconstitution",
    title: "Reconstitution: Final Concentration, Withdrawn Volume, and Label Re-Reading",
    shortTitle: "Reconstitution",
    description: "Work from vial powder to final concentration, then calculate the exact withdrawal volume safely.",
    conceptExplanation: [
      "Reconstitution problems are really concentration problems with one extra step: the final concentration is not the same as the dry vial label.",
      "The label after dilution becomes the new source of truth for volume calculations.",
    ],
    dimensionalAnalysisMethod: [
      "First determine the final concentration after diluent is added.",
      "Then convert the ordered dose to the withdrawal volume using that final concentration.",
    ],
    ratioProportionMethod: [
      "Total mg in vial is to final total mL as ordered mg is to x mL.",
    ],
    formulaMethod: [
      "Final concentration = total drug / final volume",
      "Volume to withdraw = ordered dose / final concentration",
    ],
    equationManipulation: [
      "Rearrange concentration equations to isolate either final volume or withdrawal volume.",
      "If concentration = total mg / total mL, then withdrawal mL = ordered mg ÷ concentration — treat concentration as the conversion factor.",
    ],
    unitConversions: [
      "Keep total drug unit consistent with the order before solving.",
    ],
    workedExamples: [
      {
        title: "Antibiotic vial",
        problem: "Vial contains 1 g powder. After reconstitution total volume is 4 mL. Order is 250 mg.",
        steps: ["1 g = 1000 mg", "1000 mg/4 mL = 250 mg/mL", "250 mg ordered = 1 mL"],
        answer: "1 mL",
      },
      {
        title: "Half-dose withdrawal",
        problem: "Vial contains 500 mg in 2 mL after reconstitution. Order is 125 mg.",
        steps: ["500/2 = 250 mg/mL", "125/250 = 0.5 mL"],
        answer: "0.5 mL",
      },
    ],
    commonMistakes: [
      "Using the dry-powder amount as though it were already a concentration.",
      "Forgetting that the final volume may not equal the amount of diluent alone.",
    ],
    safetyConsiderations: [
      "Read the reconstitution instructions and final concentration line on the label every time.",
      "High-alert IV medications often need an independent concentration check before administration.",
    ],
    questionTopic: "reconstitution",
  }),
  lesson({
    slug: "insulin-correction-and-mixing",
    category: "insulin-dosing",
    title: "Insulin Dosing: Correction Scales, Double Checks, and High-Alert Math",
    shortTitle: "Insulin dosing",
    description: "Use insulin scales, concentration rules, and administration safety habits appropriate for a high-alert medication.",
    conceptExplanation: [
      "Insulin calculations are high-alert decisions, not just unit math. Dose, timing, route, and patient intake all matter.",
      "For most nursing math questions, insulin is expressed in units and should be treated with exactness rather than casual rounding.",
    ],
    dimensionalAnalysisMethod: [
      "Use the scale or the ordered units directly, then verify the syringe concentration if a volume conversion is required.",
    ],
    ratioProportionMethod: [
      "If converting from units to mL on U-100 insulin, set 100 units to 1 mL and solve carefully.",
    ],
    formulaMethod: [
      "Volume in mL = ordered units / concentration in units per mL",
    ],
    equationManipulation: [
      "Back-solve expected units from a drawn volume when checking another nurse's setup.",
      "If mL = units ÷ (units/mL), then units = mL x (units/mL) — multiply both sides by concentration to audit a draw.",
    ],
    unitConversions: [
      "U-100 means 100 units per 1 mL.",
      "Insulin units are not mg and should never be converted as if they were.",
    ],
    workedExamples: [
      {
        title: "U-100 syringe conversion",
        problem: "Order: 8 units regular insulin. Concentration U-100.",
        steps: ["100 units = 1 mL", "8 units = 0.08 mL"],
        answer: "0.08 mL",
      },
      {
        title: "Correction scale selection",
        problem: "Scale says 4 units for glucose 11.1-13.8 mmol/L. Patient glucose 12.4 mmol/L.",
        steps: ["Find correct range", "Selected dose = 4 units"],
        answer: "4 units",
      },
    ],
    commonMistakes: [
      "Treating insulin as a standard mg/mL conversion problem without respecting unit-based labeling.",
      "Skipping the independent double-check on a high-alert medication.",
    ],
    safetyConsiderations: [
      "Confirm blood glucose, meal timing, and the correct insulin type before administration.",
      "Use independent double checks per policy for insulin dosing and pump settings.",
    ],
    questionTopic: "insulin",
  }),
  lesson({
    slug: "heparin-weight-based-protocols",
    category: "heparin-protocols",
    title: "Heparin Protocols: Units/kg/hr Starts, Bolus Checks, and Follow-Up Titration Logic",
    shortTitle: "Heparin protocols",
    description: "Calculate and check heparin starts with weight-based units, infusion concentrations, and protocol safety reasoning.",
    conceptExplanation: [
      "Heparin math usually has at least two steps: calculate units from the protocol, then convert to mL/hr using the bag concentration.",
      "Clinical safety requires pairing the math with aPTT/anti-Xa timing and bleeding assessment.",
    ],
    dimensionalAnalysisMethod: [
      "Calculate bolus units and infusion units/hr from the patient's weight first.",
      "Convert infusion units/hr to mL/hr using the prepared bag concentration.",
    ],
    ratioProportionMethod: [
      "If the bag contains total units over total mL, solve for the mL that delivers the required units each hour.",
    ],
    formulaMethod: [
      "Infusion units/hr = protocol rate x kg",
      "mL/hr = infusion units/hr / bag concentration in units per mL",
    ],
    equationManipulation: [
      "Back-solve units per hour from a pump rate to verify another nurse's programming.",
      "If mL/hr = units/hr ÷ units/mL, then units/hr = mL/hr x units/mL — multiply pump rate by bag concentration to audit programming.",
    ],
    unitConversions: [
      "Pounds must become kilograms before using units/kg/hr.",
    ],
    workedExamples: [
      {
        title: "Initial infusion rate",
        problem: "Protocol: 18 units/kg/hr. Patient 80 kg. Bag 25,000 units in 500 mL.",
        steps: ["18 x 80 = 1440 units/hr", "25,000/500 = 50 units/mL", "1440/50 = 28.8 mL/hr"],
        answer: "28.8 mL/hr",
      },
      {
        title: "Initial bolus",
        problem: "Bolus 80 units/kg for an 80 kg patient.",
        steps: ["80 x 80 = 6400 units"],
        answer: "6400 units",
      },
    ],
    commonMistakes: [
      "Using pounds instead of kilograms for the protocol.",
      "Converting units/hr to mL/hr without first calculating bag concentration.",
    ],
    safetyConsiderations: [
      "Heparin is high-alert: verify protocol version, weight, and baseline labs before starting.",
      "Math correctness does not replace bleeding assessment and lab-based titration follow-up.",
    ],
    questionTopic: "heparin",
  }),
] as const;

function numericQuestion(
  id: string,
  stem: string,
  answer: number,
  unit: string,
  decimals: number,
  solutionSteps: string[],
  rationale: string,
  safetyNote: string,
  opts?: { increment?: number; exactInteger?: boolean; difficulty?: MedCalcDifficulty; type?: MedCalcQuestionType },
): MedCalcQuestion {
  return {
    id,
    type: opts?.type ?? "numeric_input",
    difficulty: opts?.difficulty ?? "intermediate",
    stem,
    numericAnswer: answer,
    options: [],
    correctIndex: null,
    answerFormat: {
      unit,
      decimals,
      roundingText: decimals === 0 ? "Round to a whole number where clinically required." : `Round to ${decimals} decimal place${decimals === 1 ? "" : "s"}.`,
      increment: opts?.increment,
      exactInteger: opts?.exactInteger,
    },
    solutionSteps,
    rationale,
    safetyNote,
  };
}

function mcq(
  id: string,
  stem: string,
  options: string[],
  correctIndex: number,
  rationale: string,
  opts?: { difficulty?: MedCalcDifficulty; solutionSteps?: string[] },
): MedCalcQuestion {
  const difficulty = opts?.difficulty ?? "beginner";
  const solutionSteps =
    opts?.solutionSteps ??
    [
      "Restate what the question is asking (safety, setup, or interpretation).",
      "Eliminate distractors that violate administration realism or policy.",
      "Confirm the remaining option matches the rationale before selecting.",
    ];
  return {
    id,
    type: "multiple_choice",
    difficulty,
    stem,
    numericAnswer: null,
    options,
    correctIndex,
    answerFormat: {
      unit: "selection",
      decimals: 0,
      roundingText: "Choose the safest interpretation.",
    },
    solutionSteps,
    rationale,
    safetyNote: "Use the method that preserves safety and a realistic administration form.",
  };
}

function buildQuestions(lesson: MedCalcLessonDefinition): MedCalcQuestion[] {
  switch (lesson.category) {
    case "tablets":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Order 750 mg. Supply 250 mg/tablet. How many tablets?", 3, "tablet(s)", 2, ["750 / 250 = 3 tablets"], "Match ordered mg to mg per tablet, then confirm the fraction is workable.", "Tablet answers must be clinically splittable.", { increment: 0.25, type: "multi_step" }),
        numericQuestion(`${lesson.slug}:q2`, "Order 0.125 g. Supply 250 mg/tablet. How many tablets?", 0.5, "tablet(s)", 2, ["0.125 g = 125 mg", "125 / 250 = 0.5 tablets"], "Convert grams to milligrams before dividing.", "Unit conversion errors create wrong tablet counts.", { increment: 0.25, type: "unit_conversion", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q3`, "Order 37.5 mg. Supply 25 mg/tablet. How many tablets?", 1.5, "tablet(s)", 2, ["37.5 / 25 = 1.5 tablets"], "The final fraction is workable, so the order is calculable.", "Stop if the final tablet fraction is not workable.", { increment: 0.25 }),
        mcq(`${lesson.slug}:q4`, "Which tablet answer should trigger clarification instead of administration?", ["1 tablet", "1.25 tablets", "1.33 tablets", "0.5 tablet"], 2, "1.33 tablets is not a workable fraction for routine administration and should be clarified.", {
          difficulty: "intermediate",
          solutionSteps: [
            "Identify that the question targets administration feasibility, not the largest number.",
            "0.5 and 1.25 tablets can be workable with scored tablets or policy; 1 tablet is ordinary.",
            "1.33 tablets is not a standard splittable increment — select that option as the clarification trigger.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Postoperative adult with order acetaminophen 650 mg PO once for pain. Stock: 325 mg per tablet. How many tablets?",
          2,
          "tablet(s)",
          2,
          ["650 mg ordered", "325 mg per tablet", "650 / 325 = 2 tablets", "2.0 is a whole-tablet answer — workable"],
          "Same-units division; confirm whole tablets match common scored products.",
          "Verify maximum daily acetaminophen limits across all sources before administering.",
          { increment: 0.25, type: "clinical_scenario", difficulty: "beginner" },
        ),
      ];
    case "liquid-medications":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Order 375 mg PO. Supply 250 mg per 5 mL. How many mL?", 7.5, "mL", 1, ["375/250 = 1.5", "1.5 x 5 = 7.5 mL"], "Convert concentration to the volume that contains the ordered dose.", "Use the smallest practical syringe for accuracy.", { type: "multi_step" }),
        numericQuestion(`${lesson.slug}:q2`, "Order 125 mcg. Supply 0.25 mg per 5 mL. How many mL?", 2.5, "mL", 1, ["0.25 mg = 250 mcg", "125/250 = 0.5", "0.5 x 5 = 2.5 mL"], "Microgram-to-milligram conversion must happen before the ratio step.", "Tiny volumes need precise devices.", { type: "unit_conversion", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q3`, "Order 650 mg. Supply 160 mg per 5 mL. How many mL?", 20.3, "mL", 1, ["650/160 = 4.0625", "4.0625 x 5 = 20.3125 mL", "Round to 20.3 mL"], "Keep one decimal place for liquid volume unless policy says otherwise.", "Large oral volumes may need route or formulation review."),
        mcq(`${lesson.slug}:q4`, "What should you do first if a pediatric liquid dose calculates to a very tiny volume?", ["Round up generously", "Check the concentration and the measuring device", "Convert it to tablets", "Ignore the dose"], 1, "Small pediatric doses need concentration and measuring-device verification before administration.", {
          solutionSteps: [
            "Tiny volumes amplify measurement error — rounding up without verification is unsafe.",
            "Converting to tablets is usually wrong unless the order and formulation allow it.",
            "The safest first step is to verify concentration and the measuring device before drawing.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Heart failure patient ordered furosemide 40 mg PO now. Oral solution is labeled 10 mg/mL. How many mL?",
          4,
          "mL",
          1,
          ["Dose on hand: 10 mg per 1 mL", "40 / 10 = 4 mL", "Round to one decimal: 4.0 mL (often charted as 4 mL)"],
          "Liquid volume = ordered dose ÷ concentration when both use the same drug unit.",
          "Confirm renal status, electrolytes, and orthostasis precautions per protocol.",
          { type: "clinical_scenario", difficulty: "beginner" },
        ),
      ];
    case "iv-flow-rates":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Infuse 1000 mL over 8 hr with 15 gtt/mL tubing. gtt/min?", 31, "gtt/min", 0, ["8 hr = 480 min", "(1000 x 15)/480 = 31.25", "Round to 31 gtt/min"], "Gravity sets use whole-drop rounding.", "A decimal gtt/min is not a deliverable bedside answer.", { exactInteger: true, type: "multi_step", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q2`, "Infuse 50 mL over 30 min with 20 gtt/mL tubing. gtt/min?", 33, "gtt/min", 0, ["(50 x 20)/30 = 33.3", "Round to 33 gtt/min"], "Convert the calculated rate to a whole drop count.", "Recount drips after patient movement.", { exactInteger: true }),
        numericQuestion(`${lesson.slug}:q3`, "Infuse 125 mL over 2 hr with 10 gtt/mL tubing. gtt/min?", 10, "gtt/min", 0, ["2 hr = 120 min", "(125 x 10)/120 = 10.4", "Round to 10 gtt/min"], "Minor rounding still follows whole-drop rules.", "Question extreme results before starting.", { exactInteger: true, type: "unit_conversion" }),
        mcq(`${lesson.slug}:q4`, "Which mistake most often creates an unsafe gravity-flow answer?", ["Using minutes instead of hours", "Forgetting to convert hours to minutes", "Rounding to a whole drop", "Reading the tubing factor"], 1, "Leaving time in hours inside a gtt/min formula creates a major overestimation.", {
          solutionSteps: [
            "The gtt/min formula requires minutes in the denominator — hours must be converted.",
            "Rounding to whole drops is clinically required, not a mistake.",
            "The distractor that causes massive over-rate is leaving hours unconverted.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Antibiotic IVPB 250 mL to run over 90 minutes by gravity. Macrodrip tubing 15 gtt/mL. What is the flow rate in gtt/min (whole drops)?",
          42,
          "gtt/min",
          0,
          ["90 min is already in minutes", "(250 x 15) / 90 = 41.67 gtt/min", "Round to nearest whole drop = 42 gtt/min"],
          "Apply (mL x gtt/mL) / min, then round to a countable drip rate.",
          "Recount after repositioning; consider pump for narrow therapeutic index drugs.",
          { exactInteger: true, type: "clinical_scenario", difficulty: "intermediate" },
        ),
      ];
    case "iv-pump-ml-hr":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Infuse 500 mL over 4 hr. What pump rate?", 125, "mL/hr", 1, ["500/4 = 125 mL/hr"], "Pump rates are expressed in mL/hr.", "Back-check total infusion time before starting."),
        numericQuestion(`${lesson.slug}:q2`, "Infuse 150 mL over 45 min. What pump rate?", 200, "mL/hr", 1, ["45 min = 0.75 hr", "150/0.75 = 200 mL/hr"], "Time must be converted to hours before dividing.", "High rates need a reasonableness check.", { type: "unit_conversion", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q3`, "Infuse 90 mL over 1.5 hr. What pump rate?", 60, "mL/hr", 1, ["90/1.5 = 60 mL/hr"], "Fractional hours are valid once converted correctly.", "Do not round away a suspicious rate without checking the order."),
        mcq(`${lesson.slug}:q4`, "What is the best back-check after programming a pump?", ["Confirm the bag will finish at the expected time", "Count drops per minute", "Convert mL/hr to tablets", "Ignore the infusion purpose"], 0, "Completion-time back-check is a quick safety screen for pump programming.", {
          solutionSteps: [
            "Pump programming errors often show up as impossible completion times or volumes.",
            "Drop counting is for gravity sets, not primary pump verification.",
            "Matching expected finish time to the order is a fast secondary check.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Maintenance IV 1000 mL D5W to infuse over 10 hours on a pump. What rate in mL/hr?",
          100,
          "mL/hr",
          1,
          ["Total volume 1000 mL", "Total time 10 hr", "1000 / 10 = 100 mL/hr"],
          "mL/hr = total mL ÷ total hours for straight continuous orders.",
          "Confirm fluid type and cardiac/renal cautions before starting maintenance fluids.",
          { type: "clinical_scenario", difficulty: "beginner" },
        ),
      ];
    case "weight-based-dosing":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Order 8 mg/kg for a patient weighing 70 kg. Total dose?", 560, "mg", 1, ["8 x 70 = 560 mg"], "Multiply the ordered mg/kg by the patient's weight in kg.", "Weight-based math often needs a second conversion step before administration."),
        numericQuestion(`${lesson.slug}:q2`, "Order 5 mg/kg for a patient weighing 154 lb. Total dose?", 350, "mg", 1, ["154/2.2 = 70 kg", "5 x 70 = 350 mg"], "Convert pounds to kilograms first.", "Using pounds instead of kilograms can double the error.", { type: "unit_conversion", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q3`, "Order 2 mg/kg. Patient 44 kg. Supply 4 mg/mL. How many mL?", 22, "mL", 1, ["2 x 44 = 88 mg", "88/4 = 22 mL"], "Weight-based problems often continue into a concentration conversion.", "Large final volumes need a route/formulation reasonableness check.", { type: "multi_step", difficulty: "advanced" }),
        mcq(`${lesson.slug}:q4`, "Before giving a calculated mg/kg dose, what additional safety check is most important?", ["Whether the answer is an even number", "Whether the dose exceeds any maximum dose cap", "Whether the patient prefers tablets", "Whether the label is colorful"], 1, "A numerically correct mg/kg dose can still be unsafe if it exceeds a dose cap.", {
          solutionSteps: [
            "Even numbers are not a safety standard for drug dosing.",
            "Maximum dose caps, organ function, and indication often determine safety after mg/kg math.",
            "Select the cap check as the highest-yield safety gate.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: IV antibiotic ordered 15 mg/kg once. Patient weight 60 kg. What total dose in mg?",
          900,
          "mg",
          1,
          ["15 mg/kg x 60 kg = 900 mg", "Round to one decimal if policy requires; 900 mg is already a whole number"],
          "Total mg = mg/kg x weight in kg with consistent units.",
          "Verify renal adjustment, infusion duration, and pharmacy dilution instructions before administration.",
          { type: "clinical_scenario", difficulty: "intermediate" },
        ),
      ];
    case "pediatric-dosing":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Child weighs 18 kg. Safe range is 10-15 mg/kg/day in 3 divided doses. Maximum safe dose per dose?", 90, "mg", 1, ["Daily max = 15 x 18 = 270 mg/day", "270/3 = 90 mg per dose"], "Compare single-dose orders against the divided per-dose safe range.", "Do not compare a daily range directly to a single-dose order.", { type: "multi_step", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q2`, "Child weighs 22 lb. Ordered 8 mg/kg. Total dose?", 80, "mg", 1, ["22/2.2 = 10 kg", "8 x 10 = 80 mg"], "Convert weight first, then calculate total mg.", "Updated weights matter in children.", { type: "unit_conversion" }),
        numericQuestion(`${lesson.slug}:q3`, "Safe range is 5-7 mg/kg/day for a 12 kg child in 2 doses. Minimum safe dose per dose?", 30, "mg", 1, ["Daily min = 5 x 12 = 60 mg/day", "60/2 = 30 mg per dose"], "Use the low end of the daily range and divide correctly.", "Daily vs per-dose confusion is a classic pediatric error.", { type: "multi_step" }),
        mcq(`${lesson.slug}:q4`, "An ordered pediatric dose is above the safe range. What is the correct action?", ["Round it down and give it", "Hold and clarify before administration", "Convert it to micrograms and retry", "Give half now and half later"], 1, "An unsafe pediatric order must be clarified, not rounded into compliance.", {
          solutionSteps: [
            "Out-of-range pediatric doses are prescriber problems until clarified.",
            "Rounding into compliance can hide a tenfold error.",
            "Holding and clarifying preserves safety and professional accountability.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Child 16 kg. Reference lists 12 mg/kg/day max in 4 divided doses. What is the maximum safe amount per individual dose in mg?",
          48,
          "mg",
          1,
          ["Daily max = 12 x 16 = 192 mg/day", "192 / 4 = 48 mg per dose"],
          "Divide daily maximum by the number of doses to compare to a single order.",
          "Always use current weight; involve parents and pharmacy for high-alert meds.",
          { type: "clinical_scenario", difficulty: "intermediate" },
        ),
      ];
    case "drip-factor-gtt-min":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Infuse 60 mL/hr with microdrip tubing. gtt/min?", 60, "gtt/min", 0, ["60 mL/hr = 1 mL/min", "1 x 60 = 60 gtt/min"], "Microdrip often lets you read gtt/min directly from mL/hr when the rate is hourly.", "Microdrip and macrodrip cannot be interchanged.", { exactInteger: true }),
        numericQuestion(`${lesson.slug}:q2`, "Infuse 60 mL/hr with 15 gtt/mL tubing. gtt/min?", 15, "gtt/min", 0, ["60 mL/hr = 1 mL/min", "1 x 15 = 15 gtt/min"], "The tubing factor changes the final answer completely.", "Always read the tubing packaging.", { exactInteger: true }),
        numericQuestion(`${lesson.slug}:q3`, "Infuse 80 mL over 40 min with 20 gtt/mL tubing. gtt/min?", 40, "gtt/min", 0, ["(80 x 20)/40 = 40 gtt/min"], "The tubing factor travels with the volume.", "Manual rates need monitoring after setup.", { exactInteger: true, type: "multi_step" }),
        mcq(`${lesson.slug}:q4`, "Which pairing is correct?", ["Microdrip = any tubing used with a pump", "Microdrip = 60 gtt/mL in many standard sets", "Macrodrip answers can be decimals", "Drop factor does not affect the answer"], 1, "Microdrip sets are commonly 60 gtt/mL and create a different whole-drop answer than macrodrip sets.", {
          solutionSteps: [
            "Pumps deliver mL/hr; microdrip is a tubing calibration, not a pump brand.",
            "Microdrip is classically 60 gtt/mL — it changes the drop count per mL.",
            "Macrodrip still requires whole-drop answers at the bedside.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Manual secondary line 100 mL to run in 25 minutes. Tubing 15 gtt/mL. Whole-drop gtt/min?",
          60,
          "gtt/min",
          0,
          ["(100 x 15) / 25 = 60 gtt/min", "Already a whole number — no fractional drops"],
          "Secondary infusions still use the same gravity relationship with explicit minutes.",
          "Secure line height; verify compatibility with primary fluid.",
          { exactInteger: true, type: "clinical_scenario", difficulty: "intermediate" },
        ),
      ];
    case "reconstitution":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Vial contains 1 g powder. Final volume after reconstitution is 4 mL. Order 250 mg. How many mL withdraw?", 1, "mL", 1, ["1 g = 1000 mg", "1000/4 = 250 mg/mL", "250/250 = 1 mL"], "The final concentration is determined after reconstitution.", "Read the final concentration line, not just the dry-vial amount.", { type: "multi_step", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q2`, "Vial contains 500 mg in 2 mL after reconstitution. Order 125 mg. How many mL withdraw?", 0.5, "mL", 1, ["500/2 = 250 mg/mL", "125/250 = 0.5 mL"], "Once concentration is known, it becomes a standard volume-to-give question.", "Tiny withdrawn volumes require precise syringes."),
        numericQuestion(`${lesson.slug}:q3`, "Vial contains 2 g in 10 mL after reconstitution. Order 600 mg. How many mL withdraw?", 3, "mL", 1, ["2 g = 2000 mg", "2000/10 = 200 mg/mL", "600/200 = 3 mL"], "Convert grams to milligrams before finding final concentration.", "Do not skip the final concentration step.", { type: "unit_conversion" }),
        mcq(`${lesson.slug}:q4`, "What is the key first step in any reconstitution calculation?", ["Convert the answer to drops/min", "Determine the final concentration after dilution", "Assume the dry vial already lists mg/mL", "Ignore the diluent instructions"], 1, "Reconstitution problems are solved from the final concentration, not the dry-powder label alone.", {
          solutionSteps: [
            "Drops/min belongs to gravity IV math, not powder reconstitution first steps.",
            "Final concentration uses total drug and final total volume after diluent.",
            "Select determining final concentration after dilution as the key first step.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Cefazolin 1 g vial reconstituted with 2.5 mL diluent yielding 330 mg/mL (per label). Order 450 mg IM. How many mL to withdraw?",
          1.4,
          "mL",
          1,
          ["450 mg / 330 mg per mL = 1.3636… mL", "Round to one decimal per measurable syringe policy = 1.4 mL"],
          "Volume = ordered dose ÷ final concentration after reconstitution.",
          "IM volumes and site limits matter — confirm with pharmacy if near maximum volume.",
          { type: "clinical_scenario", difficulty: "advanced" },
        ),
      ];
    case "insulin-dosing":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Order 8 units regular insulin from U-100 insulin. What volume in mL?", 0.08, "mL", 2, ["100 units = 1 mL", "8/100 = 0.08 mL"], "Insulin volume conversions come from units per mL, not mg.", "Insulin requires an independent double check.", { type: "multi_step", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q2`, "Sliding scale orders 4 units for glucose in the target range. What dose is administered?", 4, "units", 0, ["Identify the correct range", "Administer 4 units"], "Scale questions still demand exact unit reading.", "Check the glucose time, insulin type, and nutrition plan.", { exactInteger: true }),
        numericQuestion(`${lesson.slug}:q3`, "Order 12 units from U-100 insulin. What volume?", 0.12, "mL", 2, ["12/100 = 0.12 mL"], "Convert units directly against U-100 concentration.", "Use the correct insulin syringe scale.", { difficulty: "beginner" }),
        mcq(`${lesson.slug}:q4`, "Which action is required even after the insulin math is correct?", ["Skip the glucose recheck", "Independent double check per policy", "Convert units to mg", "Ignore meal timing"], 1, "Insulin is high-alert and needs safety checks beyond arithmetic.", {
          solutionSteps: [
            "Glucose rechecks and meal context still matter, but policy usually mandates an independent double check.",
            "Insulin units are not converted to mg for routine U-100 administration.",
            "Select the independent double check as the non-negotiable safety action.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Correction order reads 6 units of U-100 regular insulin subcut. How many mL should be drawn?",
          0.06,
          "mL",
          2,
          ["U-100 supplies 100 units per 1 mL", "6 / 100 = 0.06 mL", "Verify with second nurse per policy before administration"],
          "Divide ordered units by units per mL on the insulin label.",
          "Never confuse U-100 with U-500 or concentrated pens — always read the vial/pen label aloud.",
          { type: "clinical_scenario", difficulty: "intermediate" },
        ),
      ];
    case "heparin-protocols":
      return [
        numericQuestion(`${lesson.slug}:q1`, "Protocol 18 units/kg/hr. Patient 80 kg. Bag 25,000 units in 500 mL. What mL/hr?", 28.8, "mL/hr", 1, ["18 x 80 = 1440 units/hr", "25,000/500 = 50 units/mL", "1440/50 = 28.8 mL/hr"], "Heparin protocols require units/hr first, then pump conversion.", "Heparin is high-alert and always needs protocol verification.", { type: "multi_step", difficulty: "advanced" }),
        numericQuestion(`${lesson.slug}:q2`, "Bolus 80 units/kg for an 80 kg patient. How many units?", 6400, "units", 0, ["80 x 80 = 6400 units"], "Bolus calculations use the patient's weight directly.", "Check for protocol max bolus limits.", { exactInteger: true }),
        numericQuestion(`${lesson.slug}:q3`, "Protocol 12 units/kg/hr. Patient weighs 154 lb. Bag 25,000 units in 250 mL. What mL/hr?", 8.4, "mL/hr", 1, ["154/2.2 = 70 kg", "12 x 70 = 840 units/hr", "25,000/250 = 100 units/mL", "840/100 = 8.4 mL/hr"], "Convert weight before applying the protocol, then convert units/hr to mL/hr.", "Do not let pounds slip into a units/kg protocol.", { type: "unit_conversion", difficulty: "advanced" }),
        mcq(`${lesson.slug}:q4`, "Which safety pairing belongs with a heparin start?", ["No lab follow-up needed if the math is right", "Check protocol, weight, and follow-up coagulation timing", "Only the pump rate matters", "Heparin math never needs a second check"], 1, "Heparin math lives inside a larger protocol that includes labs and bleeding assessment.", {
          solutionSteps: [
            "Math correctness does not remove bleeding risk or lab-guided titration.",
            "Protocol version and actual body weight must match the order set.",
            "Select the option that bundles protocol, weight, and coagulation follow-up.",
          ],
        }),
        numericQuestion(
          `${lesson.slug}:q5`,
          "Clinical scenario: Weight-based bolus 60 units/kg for a 75 kg patient (protocol allows this dose). Total bolus units?",
          4500,
          "units",
          0,
          ["60 units/kg x 75 kg = 4500 units", "Verify protocol maximum bolus and prescriber authorization before administration"],
          "Bolus units = units/kg x weight in kg with consistent protocol definitions.",
          "High-alert: independent double check with second clinician per policy.",
          { exactInteger: true, type: "clinical_scenario", difficulty: "advanced" },
        ),
      ];
  }
}

function buildFlashcards(lesson: MedCalcLessonDefinition): MedCalcFlashcard[] {
  return [
    { id: `${lesson.slug}:formula`, prompt: `${lesson.shortTitle}: formula method`, answer: lesson.formulaMethod[0]! },
    { id: `${lesson.slug}:dimensional`, prompt: `${lesson.shortTitle}: dimensional analysis anchor`, answer: lesson.dimensionalAnalysisMethod[0]! },
    { id: `${lesson.slug}:conversion`, prompt: `${lesson.shortTitle}: high-yield conversion`, answer: lesson.unitConversions[0]! },
    { id: `${lesson.slug}:mistake`, prompt: `${lesson.shortTitle}: common mistake`, answer: lesson.commonMistakes[0]! },
    { id: `${lesson.slug}:safety`, prompt: `${lesson.shortTitle}: safety check`, answer: lesson.safetyConsiderations[0]! },
  ];
}

export function medCalcTrackFromTier(tier: TierCode | null | undefined): MedCalcTrack {
  switch (tier) {
    case "NP":
      return "np";
    case "RPN":
    case "LVN_LPN":
    case "ALLIED":
      return "pn";
    default:
      return "rn";
  }
}

export function listMedCalcLessonsForTrack(track: MedCalcTrack): MedCalcLessonDefinition[] {
  return LESSONS.filter((lesson) => lesson.supportedTracks.includes(track));
}

export function listMedCalcCategoriesForTrack(track: MedCalcTrack): Array<MedCalcCategoryDefinition & { lessons: MedCalcLessonDefinition[] }> {
  const lessons = listMedCalcLessonsForTrack(track);
  return CATEGORY_DEFS.map((category) => ({
    ...category,
    lessons: lessons.filter((lesson) => lesson.category === category.slug),
  })).filter((category) => category.lessons.length > 0);
}

export function getMedCalcLessonByCategoryAndSlug(
  category: MedCalcCategorySlug,
  slug: string,
  track: MedCalcTrack,
): MedCalcLessonDefinition | null {
  return listMedCalcLessonsForTrack(track).find((lesson) => lesson.category === category && lesson.slug === slug) ?? null;
}

export function getMedCalcQuestions(lesson: MedCalcLessonDefinition): MedCalcQuestion[] {
  return buildQuestions(lesson);
}

export function getMedCalcFlashcards(lesson: MedCalcLessonDefinition): MedCalcFlashcard[] {
  return buildFlashcards(lesson);
}

export function buildMedCalcStudyLinks(pathwayId: string | null, topicCode: string | null = null): MedCalcStudyLinks {
  const trimmedPathway = pathwayId?.trim() || null;
  return {
    flashcardsHref: trimmedPathway ? pathwayHubAppFlashcardsHref(trimmedPathway, topicCode) : "/app/flashcards",
    questionsHref: trimmedPathway ? pathwayHubAppQuestionsHref(trimmedPathway, topicCode ?? undefined) : "/app/questions",
    catHref: resolveStudySurfaceCatHref({
      pathwayId: trimmedPathway,
      availablePathwayIds: trimmedPathway ? [trimmedPathway] : [],
      topic: topicCode,
      preferWeakFocus: false,
    }),
    medicationDrillsHref: withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medicationDrills, trimmedPathway),
  };
}

export function countMedCalcInventoryForTrack(track: MedCalcTrack) {
  const lessons = listMedCalcLessonsForTrack(track);
  return {
    lessonCount: lessons.length,
    questionCount: lessons.reduce((sum, lesson) => sum + getMedCalcQuestions(lesson).length, 0),
    flashcardCount: lessons.reduce((sum, lesson) => sum + getMedCalcFlashcards(lesson).length, 0),
    categoryCount: listMedCalcCategoriesForTrack(track).length,
  };
}

/** Per-category counts for admin dashboards and audits (sums match {@link countMedCalcInventoryForTrack}). */
export type MedCalcCategoryInventoryRow = {
  categorySlug: MedCalcCategorySlug;
  categoryTitle: string;
  lessonCount: number;
  questionCount: number;
  flashcardCount: number;
};

export function listMedCalcCategoryInventoryRows(track: MedCalcTrack): MedCalcCategoryInventoryRow[] {
  return listMedCalcCategoriesForTrack(track).map((category) => ({
    categorySlug: category.slug,
    categoryTitle: category.title,
    lessonCount: category.lessons.length,
    questionCount: category.lessons.reduce((sum, lesson) => sum + getMedCalcQuestions(lesson).length, 0),
    flashcardCount: category.lessons.reduce((sum, lesson) => sum + getMedCalcFlashcards(lesson).length, 0),
  }));
}

export function medCalcProductionReadiness(track: MedCalcTrack): { ok: boolean; realismIssues: string[] } {
  const realismIssues = validateMedCalcInventory(track);
  return { ok: realismIssues.length === 0, realismIssues };
}

export type EvaluatedMedCalcAnswer = {
  accepted: boolean;
  normalizedInput: number | null;
  expected: number | null;
  mistakes: string[];
};

export type StrictModeState = {
  index: number;
  streak: number;
  resets: number;
  passed: boolean;
  poolLength: number;
};

function roundToDecimals(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function isIncrementAligned(value: number, increment: number): boolean {
  return Math.abs(value / increment - Math.round(value / increment)) < 1e-6;
}

export function evaluateMedCalcAnswer(question: MedCalcQuestion, rawInput: string): EvaluatedMedCalcAnswer {
  if (question.numericAnswer == null) {
    const selected = Number(rawInput);
    return {
      accepted: selected === question.correctIndex,
      normalizedInput: Number.isFinite(selected) ? selected : null,
      expected: question.correctIndex,
      mistakes: selected === question.correctIndex ? [] : ["Selected option does not match the safest answer."],
    };
  }

  const normalized = Number.parseFloat(rawInput.replace(",", ".").trim());
  if (!Number.isFinite(normalized)) {
    return { accepted: false, normalizedInput: null, expected: question.numericAnswer, mistakes: ["Enter a numeric answer."] };
  }

  const expectedRounded = roundToDecimals(question.numericAnswer, question.answerFormat.decimals);
  const inputRounded = roundToDecimals(normalized, question.answerFormat.decimals);
  const mistakes: string[] = [];

  if (question.answerFormat.exactInteger && !Number.isInteger(normalized)) {
    mistakes.push(`This answer must be a whole ${question.answerFormat.unit}.`);
  }

  if (
    question.answerFormat.increment != null &&
    !isIncrementAligned(normalized, question.answerFormat.increment)
  ) {
    mistakes.push(`This answer must align to ${question.answerFormat.increment} ${question.answerFormat.unit} increments.`);
  }

  if (roundToDecimals(normalized, question.answerFormat.decimals) !== normalized && mistakes.length === 0) {
    mistakes.push(question.answerFormat.roundingText);
  }

  if (inputRounded !== expectedRounded) {
    mistakes.push(`Expected ${expectedRounded} ${question.answerFormat.unit}.`);
  }

  return {
    accepted: mistakes.length === 0,
    normalizedInput: normalized,
    expected: expectedRounded,
    mistakes,
  };
}

export function deriveMedCalcFeedback(question: MedCalcQuestion, rawInput: string): {
  verdict: "correct" | "incorrect";
  evaluated: EvaluatedMedCalcAnswer;
  headline: string;
} {
  const evaluated = evaluateMedCalcAnswer(question, rawInput);
  if (evaluated.accepted) {
    return { verdict: "correct", evaluated, headline: "Correct — keep the same setup discipline." };
  }

  const headline =
    evaluated.mistakes.find((msg) => /whole|increment|round/i.test(msg)) ??
    evaluated.mistakes[0] ??
    "Incorrect — revisit the setup and rounding rule.";
  return { verdict: "incorrect", evaluated, headline };
}

export function applyStrictModeAttempt(state: StrictModeState, correct: boolean): StrictModeState {
  if (correct) {
    const nextIndex = state.index + 1;
    const nextStreak = state.streak + 1;
    if (nextIndex >= state.poolLength) {
      return { ...state, index: state.poolLength - 1, streak: nextStreak, passed: true };
    }
    return { ...state, index: nextIndex, streak: nextStreak, passed: false };
  }

  return { ...state, index: 0, streak: 0, resets: state.resets + 1, passed: false };
}

export function validateMedCalcInventory(track: MedCalcTrack): string[] {
  const issues: string[] = [];
  const globalRoundingPolicy =
    "Round med-calculation answers using the clinical administration form: whole drops for gtt/min, workable tablet fractions, and the smallest safe decimal place for measurable volumes.";
  for (const lesson of listMedCalcLessonsForTrack(track)) {
    for (const question of getMedCalcQuestions(lesson)) {
      if (question.numericAnswer == null) continue;
      const realismIssues = validateMedMathNumericQuestion(
        {
          id: question.id,
          statement: question.stem,
          answer: question.numericAnswer,
          unit: question.answerFormat.unit,
          steps: question.solutionSteps,
          rationale: question.rationale,
          safetyNote: question.safetyNote,
        } satisfies MedMathNumericQuestion,
        { globalCorpusPolicy: `${question.answerFormat.roundingText} ${globalRoundingPolicy}` },
      ).filter((issue) => !(lesson.category === "insulin-dosing" && /mL volume should have at most 1 decimal/i.test(issue)));
      issues.push(...realismIssues);
    }
  }
  return issues;
}
