import { useState, useCallback, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFeatureUsage } from "@/hooks/use-feature-usage";
import { useAuth } from "@/lib/auth";
import { UsageLimitBanner, UsageLimitPaywall } from "@/components/usage-limit-gate";
import {
  Calculator,
  Droplets,
  Weight,
  Activity,
  Baby,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Trophy,
  RotateCcw,
  Lightbulb,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { MedicalReviewBadge } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";

import { useI18n } from "@/lib/i18n";
function seededRandom(seed: number) {
  const { t } = useI18n();
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, rng: () => number, decimals = 1): number {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals));
}

interface Problem {
  statement: string;
  answer: number;
  unit: string;
  formula: string;
  steps: string[];
  safetyNote?: string;
}

interface MedProfile {
  name: string;
  tabletStrengths: number[];
  oralSuspension?: { mg: number; ml: number }[];
  injectable?: { mg: number; ml: number }[];
  typicalOralDoses: number[];
  typicalInjDoses?: number[];
  maxSingleDose?: number;
  route: string[];
  mgPerKgRange?: [number, number];
  unit?: string;
}

const medProfiles: MedProfile[] = [
  { name: "Morphine", tabletStrengths: [15, 30], injectable: [{ mg: 10, ml: 1 }, { mg: 4, ml: 1 }, { mg: 2, ml: 1 }], typicalOralDoses: [15, 30], typicalInjDoses: [2, 4, 6, 8, 10], route: ["PO", "IV", "IM", "subQ"], mgPerKgRange: [0.1, 0.2] },
  { name: "Furosemide", tabletStrengths: [20, 40, 80], injectable: [{ mg: 10, ml: 1 }, { mg: 20, ml: 2 }, { mg: 40, ml: 4 }], typicalOralDoses: [20, 40, 80], typicalInjDoses: [10, 20, 40], route: ["PO", "IV"], mgPerKgRange: [0.5, 2.0] },
  { name: "Metoprolol", tabletStrengths: [25, 50, 100], typicalOralDoses: [25, 50, 100], injectable: [{ mg: 5, ml: 5 }], typicalInjDoses: [5], route: ["PO", "IV"] },
  { name: "Amoxicillin", tabletStrengths: [250, 500, 875], oralSuspension: [{ mg: 125, ml: 5 }, { mg: 250, ml: 5 }, { mg: 400, ml: 5 }], typicalOralDoses: [250, 500, 875], route: ["PO"], mgPerKgRange: [25, 45] },
  { name: "Lisinopril", tabletStrengths: [2.5, 5, 10, 20, 40], typicalOralDoses: [5, 10, 20, 40], route: ["PO"] },
  { name: "Acetaminophen", tabletStrengths: [325, 500, 650], oralSuspension: [{ mg: 160, ml: 5 }], typicalOralDoses: [325, 500, 650, 1000], route: ["PO"], maxSingleDose: 1000, mgPerKgRange: [10, 15] },
  { name: "Ibuprofen", tabletStrengths: [200, 400, 600, 800], oralSuspension: [{ mg: 100, ml: 5 }], typicalOralDoses: [200, 400, 600, 800], route: ["PO"], maxSingleDose: 800, mgPerKgRange: [5, 10] },
  { name: "Ketorolac", tabletStrengths: [10], injectable: [{ mg: 30, ml: 1 }, { mg: 15, ml: 1 }], typicalOralDoses: [10], typicalInjDoses: [15, 30], route: ["PO", "IM", "IV"], maxSingleDose: 30 },
  { name: "Digoxin", tabletStrengths: [0.125, 0.25], injectable: [{ mg: 0.5, ml: 2 }, { mg: 0.25, ml: 1 }], typicalOralDoses: [0.125, 0.25], typicalInjDoses: [0.25, 0.5], route: ["PO", "IV"], unit: "mg" },
  { name: "Phenytoin", tabletStrengths: [100], oralSuspension: [{ mg: 125, ml: 5 }], typicalOralDoses: [100, 200, 300], route: ["PO"], mgPerKgRange: [5, 7] },
  { name: "Ceftriaxone", injectable: [{ mg: 250, ml: 1 }, { mg: 1000, ml: 3.6 }, { mg: 2000, ml: 6.4 }], typicalInjDoses: [250, 500, 1000, 2000], tabletStrengths: [], typicalOralDoses: [], route: ["IV", "IM"], mgPerKgRange: [25, 75] },
  { name: "Vancomycin", injectable: [{ mg: 500, ml: 10 }, { mg: 1000, ml: 20 }], typicalInjDoses: [500, 750, 1000, 1500], tabletStrengths: [125, 250], typicalOralDoses: [125, 250], route: ["IV", "PO"], mgPerKgRange: [10, 15] },
  { name: "Gentamicin", injectable: [{ mg: 80, ml: 2 }, { mg: 40, ml: 1 }], typicalInjDoses: [40, 80, 120, 160], tabletStrengths: [], typicalOralDoses: [], route: ["IV", "IM"], mgPerKgRange: [1.0, 2.5] },
  { name: "Prednisone", tabletStrengths: [1, 5, 10, 20, 50], typicalOralDoses: [5, 10, 20, 40, 60], route: ["PO"], mgPerKgRange: [0.5, 2.0] },
  { name: "Ondansetron", tabletStrengths: [4, 8], injectable: [{ mg: 4, ml: 2 }], oralSuspension: [{ mg: 4, ml: 5 }], typicalOralDoses: [4, 8], typicalInjDoses: [4], route: ["PO", "IV"], mgPerKgRange: [0.1, 0.15] },
];


interface PedsMedProfile {
  name: string;
  suspensions: { mg: number; ml: number }[];
  mgPerKgPerDose: [number, number];
  maxSingleDose: number;
  typicalDivisions: number[];
  injectable?: { mg: number; ml: number }[];
}

const pedsMedProfiles: PedsMedProfile[] = [
  { name: "Amoxicillin", suspensions: [{ mg: 125, ml: 5 }, { mg: 250, ml: 5 }, { mg: 400, ml: 5 }], mgPerKgPerDose: [12.5, 25], maxSingleDose: 500, typicalDivisions: [2, 3] },
  { name: "Acetaminophen", suspensions: [{ mg: 160, ml: 5 }], mgPerKgPerDose: [10, 15], maxSingleDose: 1000, typicalDivisions: [4] },
  { name: "Ibuprofen", suspensions: [{ mg: 100, ml: 5 }], mgPerKgPerDose: [5, 10], maxSingleDose: 400, typicalDivisions: [3, 4] },
  { name: "Cephalexin", suspensions: [{ mg: 125, ml: 5 }, { mg: 250, ml: 5 }], mgPerKgPerDose: [6.25, 12.5], maxSingleDose: 500, typicalDivisions: [2, 4] },
  { name: "Azithromycin", suspensions: [{ mg: 100, ml: 5 }, { mg: 200, ml: 5 }], mgPerKgPerDose: [5, 10], maxSingleDose: 500, typicalDivisions: [1] },
  { name: "Clindamycin", suspensions: [{ mg: 75, ml: 5 }], mgPerKgPerDose: [5, 10], maxSingleDose: 450, typicalDivisions: [3, 4], injectable: [{ mg: 150, ml: 1 }] },
  { name: "Ondansetron", suspensions: [{ mg: 4, ml: 5 }], mgPerKgPerDose: [0.1, 0.15], maxSingleDose: 4, typicalDivisions: [3], injectable: [{ mg: 4, ml: 2 }] },
  { name: "Dexamethasone", suspensions: [{ mg: 1, ml: 1 }], mgPerKgPerDose: [0.15, 0.6], maxSingleDose: 10, typicalDivisions: [1, 2] },
  { name: "Prednisolone", suspensions: [{ mg: 15, ml: 5 }], mgPerKgPerDose: [0.5, 2.0], maxSingleDose: 60, typicalDivisions: [1, 2] },
  { name: "Trimethoprim", suspensions: [{ mg: 40, ml: 5 }], mgPerKgPerDose: [4, 6], maxSingleDose: 320, typicalDivisions: [2] },
];

const ivFluids = [
  "Normal Saline (0.9% NaCl)", "D5W", "Lactated Ringer's", "D5 0.45% NaCl",
  "0.45% NaCl", "D10W", "D5LR", "3% Saline",
];

const dropFactors = [10, 15, 20, 60];

const patientNames = [
  "J. Smith", "M. Johnson", "R. Williams", "A. Brown", "S. Davis",
  "K. Miller", "L. Wilson", "T. Moore", "P. Taylor", "C. Anderson",
];

function pickOralMed(rng: () => number): MedProfile {
  const oralMeds = medProfiles.filter(m => m.route.includes("PO") && m.tabletStrengths.length > 0);
  return pick(oralMeds, rng);
}

function pickInjMed(rng: () => number): MedProfile {
  const injMeds = medProfiles.filter(m => m.injectable && m.injectable.length > 0 && m.typicalInjDoses && m.typicalInjDoses.length > 0);
  return pick(injMeds, rng);
}

function pickSuspMed(rng: () => number): MedProfile {
  const suspMeds = medProfiles.filter(m => m.oralSuspension && m.oralSuspension.length > 0);
  return pick(suspMeds, rng);
}

function generateDosageProblem(seed: number): Problem {
  const rng = seededRandom(seed);
  const template = randInt(0, 9, rng);
  const patient = pick(patientNames, rng);

  switch (template) {
    case 0: {
      const mp = pickOralMed(rng);
      const ordered = pick(mp.typicalOralDoses, rng);
      const tabletMg = pick(mp.tabletStrengths, rng);
      const answer = parseFloat((ordered / tabletMg).toFixed(2));
      return {
        statement: `The provider orders ${mp.name} ${ordered} mg PO. Available: ${mp.name} ${tabletMg} mg tablets. Patient: ${patient}. How many tablets should you administer?`,
        answer,
        unit: "tablet(s)",
        formula: "Desired ÷ Have × Quantity",
        steps: [
          `Desired dose: ${ordered} mg`,
          `Available: ${tabletMg} mg per tablet`,
          `Quantity: 1 tablet`,
          `Calculation: ${ordered} ÷ ${tabletMg} × 1 = ${answer} tablet(s)`,
        ],
        safetyNote: answer > 3 ? "Warning: Administering more than 3 tablets at once is unusual. Double-check the order and available strength." : undefined,
      };
    }
    case 1: {
      const mp = pickInjMed(rng);
      const ordered = pick(mp.typicalInjDoses!, rng);
      const inj = pick(mp.injectable!, rng);
      const answer = parseFloat(((ordered / inj.mg) * inj.ml).toFixed(2));
      const route = pick(mp.route.filter(r => r !== "PO"), rng);
      return {
        statement: `Order: ${mp.name} ${ordered} mg ${route}. Available: ${mp.name} ${inj.mg} mg/${inj.ml} mL. Patient: ${patient}. How many mL should you draw up?`,
        answer,
        unit: "mL",
        formula: "Desired ÷ Have × Quantity",
        steps: [
          `Desired dose: ${ordered} mg`,
          `Available concentration: ${inj.mg} mg per ${inj.ml} mL`,
          `Calculation: (${ordered} ÷ ${inj.mg}) × ${inj.ml} = ${answer} mL`,
        ],
        safetyNote: route === "IM" && answer > 3 ? "Warning: IM injections greater than 3 mL in a single site may require splitting into two injection sites." : undefined,
      };
    }
    case 2: {
      const mp = pickInjMed(rng);
      const ordered = pick(mp.typicalInjDoses!, rng);
      const inj = pick(mp.injectable!, rng);
      const concPerMl = parseFloat((inj.mg / inj.ml).toFixed(2));
      const answer = parseFloat((ordered / concPerMl).toFixed(2));
      const route = pick(mp.route.filter(r => r !== "PO"), rng);
      return {
        statement: `Order: ${mp.name} ${ordered} mg ${route}. Available: ${mp.name} ${concPerMl} mg/mL. Patient: ${patient}. How many mL will you administer?`,
        answer,
        unit: "mL",
        formula: "Desired ÷ Have × Quantity",
        steps: [
          `Desired dose: ${ordered} mg`,
          `Available: ${concPerMl} mg/mL`,
          `Calculation: ${ordered} ÷ ${concPerMl} = ${answer} mL`,
        ],
        safetyNote: route === "subQ" && answer > 1 ? "Warning: SubQ injections are typically 1 mL or less. Verify the order." : undefined,
      };
    }
    case 3: {
      const dgx = medProfiles.find(m => m.name === "Digoxin")!;
      const orderedDose = pick(dgx.typicalOralDoses, rng);
      const orderedMcg = orderedDose * 1000;
      const tabletMg = pick(dgx.tabletStrengths, rng);
      const answer = parseFloat((orderedDose / tabletMg).toFixed(2));
      return {
        statement: `Order: Digoxin ${orderedMcg} mcg PO. Available: Digoxin ${tabletMg} mg tablets. Patient: ${patient}. How many tablets should be given? (Remember: 1 mg = 1000 mcg)`,
        answer,
        unit: "tablet(s)",
        formula: "Convert mcg to mg, then Desired ÷ Have",
        steps: [
          `Convert: ${orderedMcg} mcg = ${orderedDose} mg`,
          `Available: ${tabletMg} mg per tablet`,
          `Calculation: ${orderedDose} ÷ ${tabletMg} = ${answer} tablet(s)`,
        ],
      };
    }
    case 4: {
      const mp = pickOralMed(rng);
      const ordered = pick(mp.typicalOralDoses, rng);
      const orderedG = parseFloat((ordered / 1000).toFixed(3));
      const tabletMg = pick(mp.tabletStrengths, rng);
      const answer = parseFloat((ordered / tabletMg).toFixed(2));
      return {
        statement: `Order: ${mp.name} ${orderedG} g PO. Available: ${mp.name} ${tabletMg} mg capsules. Patient: ${patient}. How many capsules should you give? (1 g = 1000 mg)`,
        answer,
        unit: "capsule(s)",
        formula: "Convert g to mg, then Desired ÷ Have",
        steps: [
          `Convert: ${orderedG} g = ${ordered} mg`,
          `Available: ${tabletMg} mg per capsule`,
          `Calculation: ${ordered} ÷ ${tabletMg} = ${answer} capsule(s)`,
        ],
        safetyNote: answer > 4 ? "Warning: More than 4 capsules is unusual. Verify the order and available strength." : undefined,
      };
    }
    case 5: {
      const mp = pickSuspMed(rng);
      const ordered = pick(mp.typicalOralDoses, rng);
      const susp = pick(mp.oralSuspension!, rng);
      const answer = parseFloat(((ordered / susp.mg) * susp.ml).toFixed(2));
      return {
        statement: `Order: ${mp.name} ${ordered} mg PO. Available: ${mp.name} oral suspension ${susp.mg} mg/${susp.ml} mL. Patient: ${patient}. How many mL should you administer?`,
        answer,
        unit: "mL",
        formula: "Desired ÷ Have × Quantity",
        steps: [
          `Desired: ${ordered} mg`,
          `Available: ${susp.mg} mg per ${susp.ml} mL`,
          `Calculation: (${ordered} ÷ ${susp.mg}) × ${susp.ml} = ${answer} mL`,
        ],
      };
    }
    case 6: {
      const heparinOrders = [5000, 7500, 8000, 10000];
      const heparinVials: { units: number; ml: number }[] = [
        { units: 5000, ml: 1 }, { units: 10000, ml: 1 }, { units: 20000, ml: 1 },
      ];
      const orderedUnits = pick(heparinOrders, rng);
      const vial = pick(heparinVials, rng);
      const answer = parseFloat(((orderedUnits / vial.units) * vial.ml).toFixed(2));
      return {
        statement: `Order: Heparin ${orderedUnits.toLocaleString()} units subQ. Available: Heparin ${vial.units.toLocaleString()} units/${vial.ml} mL. Patient: ${patient}. How many mL will you administer?`,
        answer,
        unit: "mL",
        formula: "Desired ÷ Have × Quantity",
        steps: [
          `Desired: ${orderedUnits.toLocaleString()} units`,
          `Available: ${vial.units.toLocaleString()} units per ${vial.ml} mL`,
          `Calculation: (${orderedUnits} ÷ ${vial.units}) × ${vial.ml} = ${answer} mL`,
        ],
      };
    }
    case 7: {
      const mp = pickInjMed(rng);
      const ordered = pick(mp.typicalInjDoses!, rng);
      const inj = pick(mp.injectable!, rng);
      const answer = parseFloat(((ordered / inj.mg) * inj.ml).toFixed(2));
      const route = pick(mp.route.filter(r => r !== "PO"), rng);
      return {
        statement: `Order: ${mp.name} ${ordered} mg ${route} push. Available: ${mp.name} ${inj.mg} mg/${inj.ml} mL vial. Patient: ${patient}. How many mL should you administer?`,
        answer,
        unit: "mL",
        formula: "Desired ÷ Have × Quantity",
        steps: [
          `Desired: ${ordered} mg`,
          `Available: ${inj.mg} mg per ${inj.ml} mL`,
          `Calculation: (${ordered} ÷ ${inj.mg}) × ${inj.ml} = ${answer} mL`,
        ],
      };
    }
    case 8: {
      const mp = pickOralMed(rng);
      const doses = pick([2, 3, 4], rng);
      const perDose = pick(mp.typicalOralDoses, rng);
      const totalDailyMg = perDose * doses;
      const tabletMg = pick(mp.tabletStrengths, rng);
      const tablets = parseFloat((perDose / tabletMg).toFixed(2));
      return {
        statement: `Order: ${mp.name} ${totalDailyMg} mg/day divided into ${doses} equal doses. Available: ${tabletMg} mg tablets. Patient: ${patient}. How many tablets per dose?`,
        answer: tablets,
        unit: "tablet(s) per dose",
        formula: "Total daily ÷ # doses = per dose, then Desired ÷ Have",
        steps: [
          `Per dose: ${totalDailyMg} ÷ ${doses} = ${perDose} mg`,
          `Available: ${tabletMg} mg per tablet`,
          `Tablets per dose: ${perDose} ÷ ${tabletMg} = ${tablets}`,
        ],
      };
    }
    default: {
      const mp = pickInjMed(rng);
      const ordered = pick(mp.typicalInjDoses!, rng);
      const inj = pick(mp.injectable!, rng);
      const answer = parseFloat(((ordered / inj.mg) * inj.ml).toFixed(2));
      return {
        statement: `A patient requires ${mp.name} ${ordered} mg. The pharmacy sends ${mp.name} ${inj.mg} mg in ${inj.ml} mL. Patient: ${patient}. Calculate the volume to administer.`,
        answer,
        unit: "mL",
        formula: "Desired ÷ Have × Quantity",
        steps: [
          `Desired: ${ordered} mg`,
          `Available: ${inj.mg} mg in ${inj.ml} mL`,
          `Calculation: (${ordered} ÷ ${inj.mg}) × ${inj.ml} = ${answer} mL`,
        ],
      };
    }
  }
}

function generateIVFlowProblem(seed: number): Problem {
  const rng = seededRandom(seed);
  const template = randInt(0, 9, rng);
  const fluid = pick(ivFluids, rng);
  const patient = pick(patientNames, rng);

  switch (template) {
    case 0: {
      const volume = randInt(5, 20, rng) * 100;
      const hours = randInt(2, 12, rng);
      const df = pick(dropFactors, rng);
      const mlPerHr = parseFloat((volume / hours).toFixed(2));
      const answer = parseFloat(((volume * df) / (hours * 60)).toFixed(2));
      return {
        statement: `Order: Infuse ${volume} mL of ${fluid} over ${hours} hours. Drop factor: ${df} gtt/mL. Patient: ${patient}. Calculate the drip rate in gtt/min.`,
        answer,
        unit: "gtt/min",
        formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
        steps: [
          `Volume: ${volume} mL`,
          `Time: ${hours} hours = ${hours * 60} minutes`,
          `Drop factor: ${df} gtt/mL`,
          `Calculation: (${volume} × ${df}) ÷ ${hours * 60} = ${answer} gtt/min`,
          `(mL/hr equivalent: ${mlPerHr} mL/hr)`,
        ],
      };
    }
    case 1: {
      const volume = randInt(5, 20, rng) * 100;
      const hours = randInt(2, 12, rng);
      const answer = parseFloat((volume / hours).toFixed(2));
      return {
        statement: `Order: Infuse ${volume} mL of ${fluid} over ${hours} hours using an IV pump. Patient: ${patient}. Calculate the pump rate in mL/hr.`,
        answer,
        unit: "mL/hr",
        formula: "Volume ÷ Time (hours)",
        steps: [
          `Volume: ${volume} mL`,
          `Time: ${hours} hours`,
          `Calculation: ${volume} ÷ ${hours} = ${answer} mL/hr`,
        ],
      };
    }
    case 2: {
      const mlPerHr = randInt(50, 250, rng);
      const df = pick(dropFactors, rng);
      const answer = parseFloat(((mlPerHr * df) / 60).toFixed(2));
      return {
        statement: `The IV pump is set at ${mlPerHr} mL/hr for ${fluid}. Drop factor: ${df} gtt/mL. Patient: ${patient}. What is the drip rate in gtt/min?`,
        answer,
        unit: "gtt/min",
        formula: "(mL/hr × Drop Factor) ÷ 60",
        steps: [
          `Rate: ${mlPerHr} mL/hr`,
          `Drop factor: ${df} gtt/mL`,
          `Calculation: (${mlPerHr} × ${df}) ÷ 60 = ${answer} gtt/min`,
        ],
      };
    }
    case 3: {
      const gttPerMin = randInt(10, 80, rng);
      const df = pick(dropFactors, rng);
      const answer = parseFloat(((gttPerMin * 60) / df).toFixed(2));
      return {
        statement: `An IV of ${fluid} is running at ${gttPerMin} gtt/min with a drop factor of ${df} gtt/mL. Patient: ${patient}. What is the rate in mL/hr?`,
        answer,
        unit: "mL/hr",
        formula: "(gtt/min × 60) ÷ Drop Factor",
        steps: [
          `Current rate: ${gttPerMin} gtt/min`,
          `Drop factor: ${df} gtt/mL`,
          `Calculation: (${gttPerMin} × 60) ÷ ${df} = ${answer} mL/hr`,
        ],
      };
    }
    case 4: {
      const volume = randInt(5, 20, rng) * 50;
      const mlPerHr = randInt(50, 200, rng);
      const answer = parseFloat((volume / mlPerHr).toFixed(2));
      const hrs = Math.floor(answer);
      const mins = Math.round((answer - hrs) * 60);
      return {
        statement: `${volume} mL of ${fluid} is infusing at ${mlPerHr} mL/hr. Patient: ${patient}. How many hours will the infusion take? (Round to nearest tenth)`,
        answer,
        unit: "hours",
        formula: "Volume ÷ Rate (mL/hr)",
        steps: [
          `Volume: ${volume} mL`,
          `Rate: ${mlPerHr} mL/hr`,
          `Calculation: ${volume} ÷ ${mlPerHr} = ${answer} hours`,
          `(Approximately ${hrs} hours and ${mins} minutes)`,
        ],
      };
    }
    case 5: {
      const volume = randInt(5, 10, rng) * 100;
      const mins = randInt(30, 120, rng);
      const df = pick(dropFactors, rng);
      const answer = parseFloat(((volume * df) / mins).toFixed(2));
      return {
        statement: `Order: Infuse ${volume} mL of ${fluid} over ${mins} minutes. Drop factor: ${df} gtt/mL. Patient: ${patient}. Calculate the drip rate.`,
        answer,
        unit: "gtt/min",
        formula: "(Volume × Drop Factor) ÷ Time in minutes",
        steps: [
          `Volume: ${volume} mL`,
          `Time: ${mins} minutes`,
          `Drop factor: ${df} gtt/mL`,
          `Calculation: (${volume} × ${df}) ÷ ${mins} = ${answer} gtt/min`,
        ],
      };
    }
    case 6: {
      const totalVol = randInt(5, 20, rng) * 100;
      const rate = randInt(75, 200, rng);
      const elapsed = randInt(2, 6, rng);
      const infused = rate * elapsed;
      const remaining = totalVol - infused;
      const answer = parseFloat((remaining > 0 ? remaining / rate : 0).toFixed(2));
      return {
        statement: `${totalVol} mL of ${fluid} was started ${elapsed} hours ago at ${rate} mL/hr. Patient: ${patient}. How many hours remain until the infusion is complete?`,
        answer: answer > 0 ? answer : 0,
        unit: "hours",
        formula: "Remaining Volume ÷ Rate",
        steps: [
          `Total volume: ${totalVol} mL`,
          `Infused so far: ${rate} × ${elapsed} = ${infused} mL`,
          `Remaining: ${totalVol} - ${infused} = ${remaining > 0 ? remaining : 0} mL`,
          `Time remaining: ${remaining > 0 ? remaining : 0} ÷ ${rate} = ${answer > 0 ? answer : 0} hours`,
        ],
      };
    }
    case 7: {
      const volume = randInt(5, 15, rng) * 100;
      const hours = randInt(4, 10, rng);
      const df = 60;
      const answer = parseFloat((volume / hours / 60 * df).toFixed(2));
      return {
        statement: `Order: ${volume} mL ${fluid} over ${hours} hours using microdrip tubing (60 gtt/mL). Patient: ${patient}. Calculate the drip rate.`,
        answer,
        unit: "gtt/min",
        formula: "(Volume × 60) ÷ (Hours × 60): with microdrip, gtt/min = mL/hr",
        steps: [
          `Volume: ${volume} mL over ${hours} hours`,
          `mL/hr: ${volume} ÷ ${hours} = ${parseFloat((volume / hours).toFixed(2))} mL/hr`,
          `With microdrip (60 gtt/mL): gtt/min = mL/hr`,
          `Answer: ${answer} gtt/min`,
        ],
      };
    }
    case 8: {
      const volume = randInt(2, 10, rng) * 100;
      const startHour = randInt(8, 16, rng);
      const rate = randInt(75, 200, rng);
      const hoursNeeded = parseFloat((volume / rate).toFixed(2));
      const endDecimal = startHour + hoursNeeded;
      const endHr = Math.floor(endDecimal);
      const endMin = Math.round((endDecimal - endHr) * 60);
      return {
        statement: `${volume} mL of ${fluid} is started at ${startHour}:00 at ${rate} mL/hr. Patient: ${patient}. How many hours will the infusion take?`,
        answer: hoursNeeded,
        unit: "hours",
        formula: "Volume ÷ Rate",
        steps: [
          `Volume: ${volume} mL at ${rate} mL/hr`,
          `Duration: ${volume} ÷ ${rate} = ${hoursNeeded} hours`,
          `Start: ${startHour}:00 → Completion: approximately ${endHr}:${endMin.toString().padStart(2, "0")}`,
        ],
      };
    }
    default: {
      const volume = randInt(5, 20, rng) * 100;
      const hours = randInt(4, 24, rng);
      const df = pick(dropFactors, rng);
      const answer = parseFloat(((volume * df) / (hours * 60)).toFixed(2));
      return {
        statement: `Infuse ${volume} mL ${fluid} over ${hours} hours. Tubing: ${df} gtt/mL. Patient: ${patient}. What drip rate (gtt/min) should you set?`,
        answer,
        unit: "gtt/min",
        formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
        steps: [
          `Volume: ${volume} mL, Time: ${hours} × 60 = ${hours * 60} min`,
          `Drop factor: ${df} gtt/mL`,
          `(${volume} × ${df}) ÷ ${hours * 60} = ${answer} gtt/min`,
        ],
      };
    }
  }
}

function pickMedWithKgRange(rng: () => number): MedProfile {
  const kgMeds = medProfiles.filter(m => m.mgPerKgRange && m.mgPerKgRange.length === 2);
  return pick(kgMeds, rng);
}

function generateWeightBasedProblem(seed: number): Problem {
  const rng = seededRandom(seed);
  const template = randInt(0, 9, rng);
  const patient = pick(patientNames, rng);

  switch (template) {
    case 0: {
      const mp = pickMedWithKgRange(rng);
      const weightKg = randInt(50, 100, rng);
      const dosePerKg = pick([mp.mgPerKgRange![0], mp.mgPerKgRange![1]], rng);
      const answer = parseFloat((weightKg * dosePerKg).toFixed(2));
      return {
        statement: `Order: ${mp.name} ${dosePerKg} mg/kg IV. Patient ${patient} weighs ${weightKg} kg. What is the dose in mg?`,
        answer,
        unit: "mg",
        formula: "Weight (kg) x Dose per kg",
        steps: [
          `Patient weight: ${weightKg} kg`,
          `Ordered dose: ${dosePerKg} mg/kg`,
          `Calculation: ${weightKg} x ${dosePerKg} = ${answer} mg`,
        ],
      };
    }
    case 1: {
      const mp = pickMedWithKgRange(rng);
      const weightLbs = pick([110, 132, 154, 176, 198, 220], rng);
      const weightKg = parseFloat((weightLbs / 2.2).toFixed(1));
      const dosePerKg = mp.mgPerKgRange![0];
      const answer = parseFloat((weightKg * dosePerKg).toFixed(2));
      return {
        statement: `Order: ${mp.name} ${dosePerKg} mg/kg. Patient ${patient} weighs ${weightLbs} lbs. Convert to kg and calculate the dose. (1 kg = 2.2 lbs)`,
        answer,
        unit: "mg",
        formula: "Convert lbs to kg, then Weight x Dose/kg",
        steps: [
          `Convert: ${weightLbs} lbs / 2.2 = ${weightKg} kg`,
          `Dose: ${weightKg} x ${dosePerKg} = ${answer} mg`,
        ],
      };
    }
    case 2: {
      const mp = pickMedWithKgRange(rng);
      const weightKg = randInt(50, 100, rng);
      const dosePerKg = mp.mgPerKgRange![1];
      const totalDaily = parseFloat((weightKg * dosePerKg).toFixed(2));
      const doses = pick([2, 3, 4], rng);
      const answer = parseFloat((totalDaily / doses).toFixed(2));
      return {
        statement: `Order: ${mp.name} ${dosePerKg} mg/kg/day divided q${24 / doses}h. Patient ${patient} weighs ${weightKg} kg. What is each individual dose?`,
        answer,
        unit: "mg per dose",
        formula: "(Weight x mg/kg/day) / number of doses",
        steps: [
          `Total daily dose: ${weightKg} x ${dosePerKg} = ${totalDaily} mg/day`,
          `Divided into ${doses} doses`,
          `Per dose: ${totalDaily} / ${doses} = ${answer} mg`,
        ],
      };
    }
    case 3: {
      const mp = pickMedWithKgRange(rng);
      const weightKg = randInt(55, 100, rng);
      const dosePerKg = mp.mgPerKgRange![0];
      const doseMg = parseFloat((weightKg * dosePerKg).toFixed(2));
      const doseMcg = parseFloat((doseMg * 1000).toFixed(0));
      return {
        statement: `Order: ${mp.name} ${dosePerKg} mg/kg IV. Patient ${patient} weighs ${weightKg} kg. What is the dose in mcg? (1 mg = 1000 mcg)`,
        answer: parseFloat(doseMcg.toFixed(2)),
        unit: "mcg",
        formula: "Weight x mg/kg, then convert mg to mcg",
        steps: [
          `Dose in mg: ${weightKg} x ${dosePerKg} = ${doseMg} mg`,
          `Convert to mcg: ${doseMg} x 1000 = ${doseMcg} mcg`,
        ],
      };
    }
    case 4: {
      const mp = pickInjMed(rng);
      const hasKgRange = mp.mgPerKgRange && mp.mgPerKgRange.length === 2;
      const dosePerKg = hasKgRange ? mp.mgPerKgRange![0] : 0.1;
      const weightKg = randInt(60, 100, rng);
      const totalMg = parseFloat((weightKg * dosePerKg).toFixed(2));
      const inj = pick(mp.injectable!, rng);
      const answer = parseFloat(((totalMg / inj.mg) * inj.ml).toFixed(2));
      const route = pick(mp.route.filter(r => r !== "PO"), rng);
      return {
        statement: `Order: ${mp.name} ${dosePerKg} mg/kg ${route}. Patient ${patient} weighs ${weightKg} kg. Available: ${inj.mg} mg/${inj.ml} mL. How many mL will you give?`,
        answer,
        unit: "mL",
        formula: "Dose = weight x mg/kg, then Volume = Dose / Concentration x Quantity",
        steps: [
          `Dose: ${weightKg} x ${dosePerKg} = ${totalMg} mg`,
          `Available: ${inj.mg} mg per ${inj.ml} mL`,
          `Volume: (${totalMg} / ${inj.mg}) x ${inj.ml} = ${answer} mL`,
        ],
        safetyNote: route === "IM" && answer > 3 ? "Warning: Volume exceeds 3 mL for a single IM site. Consider splitting the injection." : undefined,
      };
    }
    case 5: {
      const mp = pickMedWithKgRange(rng);
      const weightKg = randInt(60, 100, rng);
      const maxDosePerKg = mp.mgPerKgRange![1];
      const maxSafe = parseFloat((weightKg * maxDosePerKg).toFixed(2));
      const safeOrder = pick(mp.typicalOralDoses.length > 0 ? mp.typicalOralDoses : (mp.typicalInjDoses || [maxSafe]), rng);
      const unsafeOrder = parseFloat((maxSafe * 1.5).toFixed(0));
      const useUnsafe = rng() > 0.5;
      const orderedMg = useUnsafe ? unsafeOrder : safeOrder;
      const isSafe = orderedMg <= maxSafe;
      return {
        statement: `The maximum safe dose of ${mp.name} is ${maxDosePerKg} mg/kg. Patient ${patient} weighs ${weightKg} kg. The order is for ${orderedMg} mg. What is the maximum safe dose? Is the ordered dose safe?`,
        answer: maxSafe,
        unit: "mg (max safe dose)",
        formula: "Max dose = Weight x max mg/kg",
        steps: [
          `Maximum safe dose: ${weightKg} x ${maxDosePerKg} = ${maxSafe} mg`,
          `Ordered dose: ${orderedMg} mg`,
          isSafe ? `${orderedMg} mg is within ${maxSafe} mg: dose is safe` : `${orderedMg} mg > ${maxSafe} mg: EXCEEDS safe dose`,
        ],
        safetyNote: !isSafe ? `DANGER: The ordered dose of ${orderedMg} mg exceeds the maximum safe dose of ${maxSafe} mg. Do NOT administer. Notify the prescriber immediately.` : undefined,
      };
    }
    case 6: {
      const phenytoin = medProfiles.find(m => m.name === "Phenytoin")!;
      const weightKg = randInt(50, 90, rng);
      const loadingPerKg = pick([15, 18, 20], rng);
      const maintenancePerKg = pick([5, 6, 7], rng);
      const loadingDose = parseFloat((weightKg * loadingPerKg).toFixed(2));
      const maintenanceDose = parseFloat((weightKg * maintenancePerKg).toFixed(2));
      return {
        statement: `${phenytoin.name}: Loading dose ${loadingPerKg} mg/kg, then maintenance ${maintenancePerKg} mg/kg/day divided q8h. Patient ${patient} weighs ${weightKg} kg. Calculate the loading dose.`,
        answer: loadingDose,
        unit: "mg",
        formula: "Loading Dose = Weight x loading mg/kg",
        steps: [
          `Loading: ${weightKg} x ${loadingPerKg} = ${loadingDose} mg`,
          `Maintenance (for reference): ${weightKg} x ${maintenancePerKg} = ${maintenanceDose} mg/day`,
        ],
      };
    }
    case 7: {
      const weightKg = randInt(50, 100, rng);
      const unitsPerKg = pick([60, 70, 80], rng);
      const answer = weightKg * unitsPerKg;
      return {
        statement: `Order: Heparin ${unitsPerKg} units/kg IV bolus. Patient ${patient} weighs ${weightKg} kg. What dose in units?`,
        answer,
        unit: "units",
        formula: "Weight x units/kg",
        steps: [
          `Weight: ${weightKg} kg`,
          `Dose: ${weightKg} x ${unitsPerKg} = ${answer} units`,
        ],
      };
    }
    case 8: {
      const mp = pickOralMed(rng);
      const hasKgRange = mp.mgPerKgRange && mp.mgPerKgRange.length === 2;
      const dosePerKg = hasKgRange ? mp.mgPerKgRange![0] : 1;
      const weightKg = randInt(55, 95, rng);
      const totalMg = parseFloat((weightKg * dosePerKg).toFixed(2));
      const tabletMg = pick(mp.tabletStrengths, rng);
      const tablets = parseFloat((totalMg / tabletMg).toFixed(2));
      return {
        statement: `Order: ${mp.name} ${dosePerKg} mg/kg PO. Patient ${patient} weighs ${weightKg} kg. Available: ${tabletMg} mg scored tablets. How many tablets?`,
        answer: tablets,
        unit: "tablet(s)",
        formula: "Dose = Weight x mg/kg, then Tablets = Dose / tablet strength",
        steps: [
          `Dose: ${weightKg} x ${dosePerKg} = ${totalMg} mg`,
          `Tablets: ${totalMg} / ${tabletMg} = ${tablets}`,
        ],
      };
    }
    default: {
      const mp = pickMedWithKgRange(rng);
      const weightKg = randInt(60, 100, rng);
      const dosePerKg = mp.mgPerKgRange![0];
      const answer = parseFloat((weightKg * dosePerKg).toFixed(2));
      return {
        statement: `Calculate the weight-based dose: ${mp.name} ${dosePerKg} mg/kg for patient ${patient} weighing ${weightKg} kg.`,
        answer,
        unit: "mg",
        formula: "Weight x mg/kg",
        steps: [`${weightKg} x ${dosePerKg} = ${answer} mg`],
      };
    }
  }
}

function generateInfusionProblem(seed: number): Problem {
  const rng = seededRandom(seed);
  const template = randInt(0, 9, rng);
  const patient = pick(patientNames, rng);

  switch (template) {
    case 0: {
      const weightKg = randInt(50, 100, rng);
      const mcgPerKgPerMin = randInt(2, 20, rng);
      const concMg = randInt(200, 800, rng);
      const concMl = randInt(200, 500, rng);
      const mgPerMin = (weightKg * mcgPerKgPerMin) / 1000;
      const mlPerMin = mgPerMin / (concMg / concMl);
      const answer = parseFloat((mlPerMin * 60).toFixed(2));
      return {
        statement: `Order: Dopamine ${mcgPerKgPerMin} mcg/kg/min. Patient ${patient} weighs ${weightKg} kg. Available: ${concMg} mg in ${concMl} mL D5W. Calculate the IV pump rate in mL/hr.`,
        answer,
        unit: "mL/hr",
        formula: "(Weight × mcg/kg/min × 60) ÷ (Concentration in mcg/mL)",
        steps: [
          `Weight: ${weightKg} kg, Rate: ${mcgPerKgPerMin} mcg/kg/min`,
          `mcg/min: ${weightKg} × ${mcgPerKgPerMin} = ${weightKg * mcgPerKgPerMin} mcg/min`,
          `mg/min: ${weightKg * mcgPerKgPerMin} ÷ 1000 = ${mgPerMin.toFixed(4)} mg/min`,
          `Concentration: ${concMg} mg / ${concMl} mL = ${(concMg / concMl).toFixed(4)} mg/mL`,
          `mL/min: ${mgPerMin.toFixed(4)} ÷ ${(concMg / concMl).toFixed(4)} = ${mlPerMin.toFixed(4)} mL/min`,
          `mL/hr: ${mlPerMin.toFixed(4)} × 60 = ${answer} mL/hr`,
        ],
      };
    }
    case 1: {
      const unitsPerHr = randInt(500, 2000, rng);
      const totalUnits = randInt(10000, 25000, rng);
      const totalMl = randInt(250, 500, rng);
      const concUnitsPerMl = totalUnits / totalMl;
      const answer = parseFloat((unitsPerHr / concUnitsPerMl).toFixed(2));
      return {
        statement: `Order: Heparin drip at ${unitsPerHr} units/hr. Available: ${totalUnits} units in ${totalMl} mL NS. Patient: ${patient}. Set pump to how many mL/hr?`,
        answer,
        unit: "mL/hr",
        formula: "Desired units/hr ÷ (Total units ÷ Total mL)",
        steps: [
          `Concentration: ${totalUnits} units / ${totalMl} mL = ${concUnitsPerMl.toFixed(2)} units/mL`,
          `Pump rate: ${unitsPerHr} ÷ ${concUnitsPerMl.toFixed(2)} = ${answer} mL/hr`,
        ],
      };
    }
    case 2: {
      const mgPerMin = randFloat(1.0, 4.0, rng, 1);
      const concMg = randInt(1000, 2000, rng);
      const concMl = randInt(250, 500, rng);
      const mlPerMin = mgPerMin / (concMg / concMl);
      const answer = parseFloat((mlPerMin * 60).toFixed(2));
      return {
        statement: `Order: Lidocaine drip at ${mgPerMin} mg/min. Available: ${concMg} mg in ${concMl} mL D5W. Patient: ${patient}. Calculate the mL/hr rate.`,
        answer,
        unit: "mL/hr",
        formula: "(mg/min ÷ concentration mg/mL) × 60",
        steps: [
          `Rate: ${mgPerMin} mg/min`,
          `Concentration: ${concMg} mg / ${concMl} mL = ${(concMg / concMl).toFixed(4)} mg/mL`,
          `mL/min: ${mgPerMin} ÷ ${(concMg / concMl).toFixed(4)} = ${mlPerMin.toFixed(4)}`,
          `mL/hr: ${mlPerMin.toFixed(4)} × 60 = ${answer} mL/hr`,
        ],
      };
    }
    case 3: {
      const unitsPerHr = randInt(1, 10, rng);
      const totalUnits = randInt(50, 100, rng);
      const totalMl = randInt(50, 250, rng);
      const answer = parseFloat((unitsPerHr / (totalUnits / totalMl)).toFixed(2));
      return {
        statement: `Order: Regular Insulin drip at ${unitsPerHr} units/hr. Available: ${totalUnits} units in ${totalMl} mL NS. Patient: ${patient}. Set the pump rate in mL/hr.`,
        answer,
        unit: "mL/hr",
        formula: "Desired units/hr ÷ Concentration (units/mL)",
        steps: [
          `Concentration: ${totalUnits} units / ${totalMl} mL = ${(totalUnits / totalMl).toFixed(4)} units/mL`,
          `Pump rate: ${unitsPerHr} ÷ ${(totalUnits / totalMl).toFixed(4)} = ${answer} mL/hr`,
        ],
        safetyNote: "⚠️ Insulin drips require frequent blood glucose monitoring. Always use an infusion pump.",
      };
    }
    case 4: {
      const weightKg = randInt(50, 100, rng);
      const mcgPerKgPerMin = randFloat(0.5, 5.0, rng, 1);
      const concMg = randInt(200, 400, rng);
      const concMl = 250;
      const totalMcgPerMin = weightKg * mcgPerKgPerMin;
      const mgPerMin = totalMcgPerMin / 1000;
      const concMgPerMl = concMg / concMl;
      const answer = parseFloat(((mgPerMin / concMgPerMl) * 60).toFixed(2));
      return {
        statement: `Order: Nitroglycerin ${mcgPerKgPerMin} mcg/kg/min. Patient ${patient}: ${weightKg} kg. Available: ${concMg} mg/${concMl} mL. Calculate mL/hr.`,
        answer,
        unit: "mL/hr",
        formula: "(Weight × mcg/kg/min ÷ 1000) ÷ (mg/mL) × 60",
        steps: [
          `mcg/min: ${weightKg} × ${mcgPerKgPerMin} = ${totalMcgPerMin} mcg/min`,
          `mg/min: ${totalMcgPerMin} ÷ 1000 = ${mgPerMin.toFixed(4)}`,
          `Concentration: ${concMg}/${concMl} = ${concMgPerMl.toFixed(4)} mg/mL`,
          `mL/hr: (${mgPerMin.toFixed(4)} ÷ ${concMgPerMl.toFixed(4)}) × 60 = ${answer}`,
        ],
      };
    }
    case 5: {
      const dose = randInt(1, 4, rng);
      const concMg = randInt(1, 4, rng);
      const concMl = 250;
      const answer = parseFloat(((dose / concMg) * concMl / 1).toFixed(2));
      const mlPerHr = parseFloat((answer).toFixed(2));
      return {
        statement: `Order: Magnesium sulfate ${dose} g/hr. Available: ${concMg} g in ${concMl} mL D5W. Patient: ${patient}. Set the pump at what rate?`,
        answer: mlPerHr,
        unit: "mL/hr",
        formula: "(Desired g/hr ÷ Available g) × Volume mL",
        steps: [
          `Desired: ${dose} g/hr`,
          `Available: ${concMg} g in ${concMl} mL`,
          `Rate: (${dose} ÷ ${concMg}) × ${concMl} = ${mlPerHr} mL/hr`,
        ],
      };
    }
    case 6: {
      const mcgPerMin = randInt(50, 400, rng);
      const concMg = randInt(200, 800, rng);
      const concMl = 250;
      const mgPerMin = mcgPerMin / 1000;
      const concMgPerMl = concMg / concMl;
      const answer = parseFloat(((mgPerMin / concMgPerMl) * 60).toFixed(2));
      return {
        statement: `Order: Phenylephrine at ${mcgPerMin} mcg/min IV. Available: ${concMg} mg in ${concMl} mL NS. Patient: ${patient}. Calculate the pump rate in mL/hr.`,
        answer,
        unit: "mL/hr",
        formula: "(mcg/min ÷ 1000 ÷ mg/mL) × 60",
        steps: [
          `${mcgPerMin} mcg/min = ${mgPerMin} mg/min`,
          `Concentration: ${concMg}/${concMl} = ${concMgPerMl.toFixed(4)} mg/mL`,
          `mL/hr: (${mgPerMin} ÷ ${concMgPerMl.toFixed(4)}) × 60 = ${answer}`,
        ],
      };
    }
    case 7: {
      const currentRate = randInt(10, 50, rng);
      const concMg = randInt(200, 800, rng);
      const concMl = 250;
      const concMgPerMl = concMg / concMl;
      const mgPerHr = parseFloat((currentRate * concMgPerMl).toFixed(2));
      const mcgPerMin = parseFloat(((mgPerHr * 1000) / 60).toFixed(2));
      return {
        statement: `A Dopamine drip is running at ${currentRate} mL/hr. Concentration: ${concMg} mg/${concMl} mL. Patient: ${patient}. How many mcg/min is the patient receiving?`,
        answer: mcgPerMin,
        unit: "mcg/min",
        formula: "(mL/hr × mg/mL × 1000) ÷ 60",
        steps: [
          `Rate: ${currentRate} mL/hr`,
          `Concentration: ${concMgPerMl.toFixed(4)} mg/mL`,
          `mg/hr: ${currentRate} × ${concMgPerMl.toFixed(4)} = ${mgPerHr} mg/hr`,
          `mcg/min: (${mgPerHr} × 1000) ÷ 60 = ${mcgPerMin} mcg/min`,
        ],
      };
    }
    case 8: {
      const weightKg = randInt(60, 100, rng);
      const mcgPerKgPerMin = randInt(2, 10, rng);
      const concMcgPerMl = randInt(1000, 4000, rng);
      const totalMcgPerMin = weightKg * mcgPerKgPerMin;
      const mlPerMin = totalMcgPerMin / concMcgPerMl;
      const answer = parseFloat((mlPerMin * 60).toFixed(2));
      return {
        statement: `Order: Dobutamine ${mcgPerKgPerMin} mcg/kg/min for patient ${patient} (${weightKg} kg). Concentration: ${concMcgPerMl} mcg/mL. Calculate mL/hr.`,
        answer,
        unit: "mL/hr",
        formula: "(Weight × mcg/kg/min) ÷ mcg/mL × 60",
        steps: [
          `mcg/min: ${weightKg} × ${mcgPerKgPerMin} = ${totalMcgPerMin}`,
          `mL/min: ${totalMcgPerMin} ÷ ${concMcgPerMl} = ${mlPerMin.toFixed(4)}`,
          `mL/hr: ${mlPerMin.toFixed(4)} × 60 = ${answer}`,
        ],
      };
    }
    default: {
      const weightKg = randInt(50, 100, rng);
      const mcgPerKgPerMin = randInt(1, 15, rng);
      const concMg = 400;
      const concMl = 250;
      const mgPerMin = (weightKg * mcgPerKgPerMin) / 1000;
      const answer = parseFloat(((mgPerMin / (concMg / concMl)) * 60).toFixed(2));
      return {
        statement: `Vasopressor infusion: ${mcgPerKgPerMin} mcg/kg/min. Patient ${patient}: ${weightKg} kg. Mix: ${concMg} mg/${concMl} mL. Rate in mL/hr?`,
        answer,
        unit: "mL/hr",
        formula: "Standard drip calculation",
        steps: [
          `mcg/min: ${weightKg} × ${mcgPerKgPerMin} = ${weightKg * mcgPerKgPerMin}`,
          `mg/min: ${weightKg * mcgPerKgPerMin} / 1000 = ${mgPerMin.toFixed(4)}`,
          `mL/hr: (${mgPerMin.toFixed(4)} / ${(concMg / concMl).toFixed(4)}) × 60 = ${answer}`,
        ],
      };
    }
  }
}

function pickPedsMed(rng: () => number): PedsMedProfile {
  return pick(pedsMedProfiles, rng);
}

function generatePediatricProblem(seed: number): Problem {
  const rng = seededRandom(seed);
  const template = randInt(0, 9, rng);
  const patient = pick(patientNames, rng);

  switch (template) {
    case 0: {
      const pm = pickPedsMed(rng);
      const weightKg = randFloat(5.0, 25.0, rng, 1);
      const dosePerKg = pick([pm.mgPerKgPerDose[0], pm.mgPerKgPerDose[1]], rng);
      const rawAnswer = weightKg * dosePerKg;
      const answer = parseFloat(Math.min(rawAnswer, pm.maxSingleDose).toFixed(2));
      return {
        statement: `Pediatric patient ${patient}, ${weightKg} kg. Order: ${pm.name} ${dosePerKg} mg/kg/dose PO. Max single dose: ${pm.maxSingleDose} mg. Calculate the single dose in mg.`,
        answer,
        unit: "mg",
        formula: "Weight (kg) x mg/kg (cap at max single dose)",
        steps: [
          `Weight: ${weightKg} kg`,
          `Dose: ${weightKg} x ${dosePerKg} = ${parseFloat(rawAnswer.toFixed(2))} mg`,
          rawAnswer > pm.maxSingleDose
            ? `Exceeds max single dose of ${pm.maxSingleDose} mg, cap at ${pm.maxSingleDose} mg`
            : `Within max single dose of ${pm.maxSingleDose} mg`,
        ],
        safetyNote: rawAnswer > pm.maxSingleDose ? `Warning: Calculated dose (${parseFloat(rawAnswer.toFixed(2))} mg) exceeds the maximum single dose of ${pm.maxSingleDose} mg. Cap at ${pm.maxSingleDose} mg.` : undefined,
      };
    }
    case 1: {
      const pm = pickPedsMed(rng);
      const weightKg = randFloat(5.0, 25.0, rng, 1);
      const dosePerKgDay = pm.mgPerKgPerDose[1] * 2;
      const totalDaily = parseFloat((weightKg * dosePerKgDay).toFixed(2));
      const doses = pick(pm.typicalDivisions, rng);
      const perDose = parseFloat(Math.min(totalDaily / doses, pm.maxSingleDose).toFixed(2));
      const susp = pick(pm.suspensions, rng);
      const answer = parseFloat(((perDose / susp.mg) * susp.ml).toFixed(2));
      return {
        statement: `Child ${patient}, ${weightKg} kg. Order: ${pm.name} ${dosePerKgDay} mg/kg/day divided q${Math.round(24 / doses)}h. Available: ${susp.mg} mg/${susp.ml} mL suspension. How many mL per dose?`,
        answer,
        unit: "mL per dose",
        formula: "Daily dose / doses = per dose, then (dose / concentration) x volume",
        steps: [
          `Daily: ${weightKg} x ${dosePerKgDay} = ${totalDaily} mg/day`,
          `Per dose: ${totalDaily} / ${doses} = ${perDose} mg`,
          `Volume: (${perDose} / ${susp.mg}) x ${susp.ml} = ${answer} mL`,
        ],
      };
    }
    case 2: {
      const weightKg = randFloat(3.0, 10.0, rng, 1);
      const heightCm = randInt(45, 80, rng);
      const bsa = parseFloat(Math.sqrt((heightCm * weightKg) / 3600).toFixed(2));
      const dosePerBsa = pick([75, 100, 150], rng);
      const pm = pickPedsMed(rng);
      const answer = parseFloat((bsa * dosePerBsa).toFixed(2));
      return {
        statement: `Pediatric patient ${patient}: weight ${weightKg} kg, height ${heightCm} cm. Order: ${pm.name} ${dosePerBsa} mg/m2. BSA formula: sqrt(height cm x weight kg / 3600). Calculate the dose.`,
        answer,
        unit: "mg",
        formula: "BSA = sqrt(H x W / 3600), then Dose = BSA x mg/m2",
        steps: [
          `BSA: sqrt(${heightCm} x ${weightKg} / 3600) = sqrt(${((heightCm * weightKg) / 3600).toFixed(4)}) = ${bsa} m2`,
          `Dose: ${bsa} x ${dosePerBsa} = ${answer} mg`,
        ],
      };
    }
    case 3: {
      const apap = pedsMedProfiles.find(m => m.name === "Acetaminophen")!;
      const weightKg = randFloat(8.0, 35.0, rng, 1);
      const mgPerKg = 15;
      const rawAnswer = parseFloat((weightKg * mgPerKg).toFixed(2));
      const answer = Math.min(rawAnswer, apap.maxSingleDose);
      return {
        statement: `Child ${patient} weighs ${weightKg} kg and has a fever. Order: Acetaminophen 15 mg/kg PO. Max single dose: ${apap.maxSingleDose} mg. Calculate the dose. Is it within the safe limit?`,
        answer,
        unit: "mg",
        formula: "Weight x 15 mg/kg (cap at max single dose)",
        steps: [
          `Dose: ${weightKg} x 15 = ${rawAnswer} mg`,
          rawAnswer > apap.maxSingleDose
            ? `${rawAnswer} mg exceeds max of ${apap.maxSingleDose} mg, give ${apap.maxSingleDose} mg`
            : `${rawAnswer} mg is within the max of ${apap.maxSingleDose} mg`,
        ],
        safetyNote: rawAnswer > apap.maxSingleDose ? `Warning: Calculated dose (${rawAnswer} mg) exceeds the maximum single dose of ${apap.maxSingleDose} mg. Cap at ${apap.maxSingleDose} mg.` : undefined,
      };
    }
    case 4: {
      const pm = pickPedsMed(rng);
      const ageYrs = randInt(1, 10, rng);
      const weightKg = randFloat(8.0, 30.0, rng, 1);
      const dosePerKg = pm.mgPerKgPerDose[0];
      const totalMg = parseFloat(Math.min(weightKg * dosePerKg, pm.maxSingleDose).toFixed(2));
      const susp = pick(pm.suspensions, rng);
      const answer = parseFloat(((totalMg / susp.mg) * susp.ml).toFixed(2));
      return {
        statement: `${ageYrs}-year-old child ${patient}, ${weightKg} kg. Order: ${pm.name} ${dosePerKg} mg/kg. Available: ${susp.mg} mg/${susp.ml} mL. How many mL to administer?`,
        answer,
        unit: "mL",
        formula: "(Weight x mg/kg) / concentration x volume",
        steps: [
          `Dose: ${weightKg} x ${dosePerKg} = ${totalMg} mg`,
          `Volume: (${totalMg} / ${susp.mg}) x ${susp.ml} = ${answer} mL`,
        ],
      };
    }
    case 5: {
      const weightKg = randFloat(2.5, 5.0, rng, 1);
      const mlPerKgPerHr = pick([2, 3, 4], rng);
      const answer = parseFloat((weightKg * mlPerKgPerHr).toFixed(2));
      return {
        statement: `Neonate ${patient} weighs ${weightKg} kg. Maintenance IV fluid rate: ${mlPerKgPerHr} mL/kg/hr. Calculate the IV rate in mL/hr.`,
        answer,
        unit: "mL/hr",
        formula: "Weight x mL/kg/hr",
        steps: [
          `Weight: ${weightKg} kg`,
          `Rate: ${weightKg} x ${mlPerKgPerHr} = ${answer} mL/hr`,
        ],
        safetyNote: "Warning: Neonatal fluid rates require precise calculation. Always use a volumetric infusion pump.",
      };
    }
    case 6: {
      const weightKg = randFloat(10.0, 25.0, rng, 1);
      const first10 = 10 * 100;
      const next10 = Math.min(weightKg - 10, 10) * 50;
      const over20 = Math.max(weightKg - 20, 0) * 20;
      const dailyMl = parseFloat((first10 + (weightKg > 10 ? next10 : 0) + (weightKg > 20 ? over20 : 0)).toFixed(2));
      const answer = parseFloat((dailyMl / 24).toFixed(2));
      return {
        statement: `Calculate 24-hour maintenance IV fluids for child ${patient} weighing ${weightKg} kg using the Holliday-Segar method (100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, 20 mL/kg over 20 kg). What is the hourly rate?`,
        answer,
        unit: "mL/hr",
        formula: "Holliday-Segar: 100/50/20 rule, then / 24",
        steps: [
          `First 10 kg: 10 x 100 = ${first10} mL`,
          weightKg > 10 ? `Next ${Math.min(weightKg - 10, 10).toFixed(1)} kg: ${Math.min(weightKg - 10, 10).toFixed(1)} x 50 = ${next10.toFixed(0)} mL` : "No additional weight above 10 kg",
          weightKg > 20 ? `Over 20 kg: ${(weightKg - 20).toFixed(1)} x 20 = ${over20.toFixed(0)} mL` : "",
          `Total daily: ${dailyMl} mL/day`,
          `Hourly: ${dailyMl} / 24 = ${answer} mL/hr`,
        ].filter(Boolean),
      };
    }
    case 7: {
      const pm = pickPedsMed(rng);
      const hasInj = pm.injectable && pm.injectable.length > 0;
      const weightKg = randFloat(4.0, 20.0, rng, 1);
      const dosePerKg = pm.mgPerKgPerDose[0];
      const totalMg = parseFloat(Math.min(weightKg * dosePerKg, pm.maxSingleDose).toFixed(2));
      if (hasInj) {
        const inj = pick(pm.injectable!, rng);
        const concPerMl = parseFloat((inj.mg / inj.ml).toFixed(2));
        const answer = parseFloat((totalMg / concPerMl).toFixed(2));
        return {
          statement: `Infant ${patient}, ${weightKg} kg. Order: ${pm.name} ${dosePerKg} mg/kg IV. Available: ${concPerMl} mg/mL. How many mL to administer?`,
          answer,
          unit: "mL",
          formula: "(Weight x mg/kg) / concentration",
          steps: [
            `Dose: ${weightKg} x ${dosePerKg} = ${totalMg} mg`,
            `Volume: ${totalMg} / ${concPerMl} = ${answer} mL`,
          ],
        };
      }
      const susp = pick(pm.suspensions, rng);
      const answer = parseFloat(((totalMg / susp.mg) * susp.ml).toFixed(2));
      return {
        statement: `Infant ${patient}, ${weightKg} kg. Order: ${pm.name} ${dosePerKg} mg/kg PO. Available: ${susp.mg} mg/${susp.ml} mL. How many mL to administer?`,
        answer,
        unit: "mL",
        formula: "(Weight x mg/kg) / concentration x volume",
        steps: [
          `Dose: ${weightKg} x ${dosePerKg} = ${totalMg} mg`,
          `Volume: (${totalMg} / ${susp.mg}) x ${susp.ml} = ${answer} mL`,
        ],
      };
    }
    case 8: {
      const pm = pickPedsMed(rng);
      const weightKg = randFloat(3.0, 8.0, rng, 1);
      const mgPerKg = pm.mgPerKgPerDose[0];
      const totalMg = parseFloat((weightKg * mgPerKg).toFixed(2));
      const doses = pick(pm.typicalDivisions, rng);
      const perDose = parseFloat((totalMg / doses).toFixed(2));
      return {
        statement: `Neonate ${patient}, ${weightKg} kg. Order: ${pm.name} ${mgPerKg} mg/kg/day divided into ${doses} doses. Calculate each individual dose.`,
        answer: perDose,
        unit: "mg per dose",
        formula: "(Weight x mg/kg/day) / number of doses",
        steps: [
          `Daily dose: ${weightKg} x ${mgPerKg} = ${totalMg} mg`,
          `Per dose: ${totalMg} / ${doses} = ${perDose} mg`,
        ],
        safetyNote: "Warning: Neonatal doses are very small. Use a syringe pump and verify calculations with a second nurse.",
      };
    }
    default: {
      const pm = pickPedsMed(rng);
      const weightKg = randFloat(5.0, 30.0, rng, 1);
      const mgPerKg = pm.mgPerKgPerDose[0];
      const rawAnswer = parseFloat((weightKg * mgPerKg).toFixed(2));
      const answer = parseFloat(Math.min(rawAnswer, pm.maxSingleDose).toFixed(2));
      return {
        statement: `Pediatric dose calculation: ${pm.name} ${mgPerKg} mg/kg for patient ${patient} weighing ${weightKg} kg. Max single dose: ${pm.maxSingleDose} mg.`,
        answer,
        unit: "mg",
        formula: "Weight x mg/kg (cap at max)",
        steps: [
          `${weightKg} x ${mgPerKg} = ${rawAnswer} mg`,
          rawAnswer > pm.maxSingleDose ? `Cap at max: ${pm.maxSingleDose} mg` : `Within max single dose`,
        ],
      };
    }
  }
}

type Category = "dosage" | "iv-flow" | "weight-based" | "infusion" | "pediatric";

function generateProblem(category: Category, seed: number): Problem {
  switch (category) {
    case "dosage": return generateDosageProblem(seed);
    case "iv-flow": return generateIVFlowProblem(seed);
    case "weight-based": return generateWeightBasedProblem(seed);
    case "infusion": return generateInfusionProblem(seed);
    case "pediatric": return generatePediatricProblem(seed);
  }
}

const categoryConfig: Record<Category, { label: string; icon: typeof Calculator; color: string; bgColor: string }> = {
  dosage: { label: "Dosage", icon: Calculator, color: "text-blue-600", bgColor: "bg-blue-50" },
  "iv-flow": { label: "IV Flow Rate", icon: Droplets, color: "text-cyan-600", bgColor: "bg-cyan-50" },
  "weight-based": { label: "Weight-Based", icon: Weight, color: "text-purple-600", bgColor: "bg-purple-50" },
  infusion: { label: "Infusion", icon: Activity, color: "text-rose-600", bgColor: "bg-rose-50" },
  pediatric: { label: "Pediatric", icon: Baby, color: "text-pink-600", bgColor: "bg-pink-50" },
};

function ProblemCard({ category, onQuestionAnswered }: { category: Category; onQuestionAnswered?: () => Promise<void> }) {
  const [seed, setSeed] = useState(() => Date.now());
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const problem = useMemo(() => generateProblem(category, seed), [category, seed]);
  const config = categoryConfig[category];

  const handleCheck = useCallback(async () => {
    if (!userAnswer.trim()) return;
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) return;
    if (onQuestionAnswered) await onQuestionAnswered();
    const correct = Math.abs(parsed - problem.answer) <= 0.1;
    setIsCorrect(correct);
    setChecked(true);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  }, [userAnswer, problem.answer, onQuestionAnswered]);

  const handleNext = useCallback(() => {
    setSeed(Date.now() + Math.floor(Math.random() * 100000));
    setUserAnswer("");
    setChecked(false);
    setIsCorrect(false);
  }, []);

  const handleReset = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    handleNext();
  }, [handleNext]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (checked) handleNext();
      else handleCheck();
    }
  }, [checked, handleCheck, handleNext]);

  const IconComp = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <IconComp className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900" data-testid={`text-category-${category}`}>{config.label} Calculations</h2>
            <p className="text-sm text-gray-500">{t("pages.medMath.practiceWithRandomizedClinicalScenarios")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full" data-testid={`text-score-${category}`}>
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{score.correct}/{score.total}</span>
            {score.total > 0 && (
              <span className="text-xs text-gray-400">({Math.round((score.correct / score.total) * 100)}%)</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1" data-testid={`button-reset-${category}`}>
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-white">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-gray-800 leading-relaxed text-base" data-testid={`text-problem-${category}`}>
                {problem.statement}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => { if (!checked) setUserAnswer(e.target.value); }}
                onKeyDown={handleKeyDown}
                placeholder={`Enter answer in ${problem.unit}`}
                className="h-12 text-lg pr-16"
                disabled={checked}
                data-testid={`input-answer-${category}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                {problem.unit}
              </span>
            </div>
            {!checked ? (
              <Button
                onClick={handleCheck}
                disabled={!userAnswer.trim()}
                className="h-12 px-8 rounded-xl bg-primary hover:brightness-110 text-white"
                data-testid={`button-check-${category}`}
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="h-12 px-8 rounded-xl bg-primary hover:brightness-110 text-white gap-2"
                data-testid={`button-next-${category}`}
              >
                Next Problem <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {checked && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className={`p-4 rounded-xl border ${isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center gap-2 mb-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-bold ${isCorrect ? "text-emerald-800" : "text-red-800"}`} data-testid={`text-result-${category}`}>
                    {isCorrect ? "Correct!" : `Incorrect: Answer: ${problem.answer} ${problem.unit}`}
                  </span>
                </div>
              </div>

              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-5 space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{t("pages.medMath.stepbystepSolution")}</h4>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <Calculator className="w-4 h-4" />
                    Formula: {problem.formula}
                  </div>
                  <ol className="space-y-2" data-testid={`list-steps-${category}`}>
                    {problem.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {problem.safetyNote && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3" data-testid={`text-safety-${category}`}>
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 text-sm">{t("pages.medMath.safetyAlert")}</p>
                    <p className="text-sm text-amber-700">{problem.safetyNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MedMathPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Category>("dosage");
  const usage = useFeatureUsage("med-math");

  const handleQuestionAnswered = useCallback(async () => {
    await usage.recordUsage();
  }, [usage.recordUsage]);

  return (
    <div className={`min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900 ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <SEO
        title={t("pages.medMath.medMathClinicalCalculationsLab2")}
        description={t("pages.medMath.masterMedicationMathWithInteractive")}
        keywords="med math, nursing calculations, dosage calculations, IV flow rate, weight-based dosing, infusion rate, pediatric dosing, nursing math practice, NCLEX math, clinical calculations"
        canonicalPath="/med-math"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />
        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.medMath.medMathClinicalCalculationsLab")}</h1>
              <p className="text-gray-500 mt-1">{t("pages.medMath.interactivePracticeWithUnlimitedRandomized")}</p>
            </div>
          </div>
          <LocaleLink href="/lessons/med-math-dosage-calculations">
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 hover:bg-primary/10 transition-colors cursor-pointer group mt-4" data-testid="link-med-math-lessons">
              <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{t("pages.medMath.medMathCalculationLessons")}</p>
                <p className="text-xs text-gray-500">{t("pages.medMath.studyTheTheoryBehindDosage")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </LocaleLink>
        </div>

        {!usage.hasUnlimited && !usage.isLoading && (
          <UsageLimitBanner feature="med-math" count={usage.count} limit={usage.limit} remaining={usage.remaining} />
        )}

        {usage.isLocked ? (
          <UsageLimitPaywall feature="med-math" />
        ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Category)} className="w-full" data-testid="tabs-med-math">
          <TabsList className="grid w-full grid-cols-5 h-12 mb-8">
            <TabsTrigger value="dosage" className="gap-1 text-xs sm:text-sm" data-testid="tab-dosage">
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("pages.medMath.dosage")}</span>
              <span className="sm:hidden">{t("pages.medMath.dose")}</span>
            </TabsTrigger>
            <TabsTrigger value="iv-flow" className="gap-1 text-xs sm:text-sm" data-testid="tab-iv-flow">
              <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("pages.medMath.ivFlowRate")}</span>
              <span className="sm:hidden">IV</span>
            </TabsTrigger>
            <TabsTrigger value="weight-based" className="gap-1 text-xs sm:text-sm" data-testid="tab-weight-based">
              <Weight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("pages.medMath.weightbased")}</span>
              <span className="sm:hidden">Wt</span>
            </TabsTrigger>
            <TabsTrigger value="infusion" className="gap-1 text-xs sm:text-sm" data-testid="tab-infusion">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("pages.medMath.infusion")}</span>
              <span className="sm:hidden">{t("pages.medMath.drip")}</span>
            </TabsTrigger>
            <TabsTrigger value="pediatric" className="gap-1 text-xs sm:text-sm" data-testid="tab-pediatric">
              <Baby className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("pages.medMath.pediatric")}</span>
              <span className="sm:hidden">{t("pages.medMath.peds")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dosage">
            <ProblemCard category="dosage" onQuestionAnswered={handleQuestionAnswered} />
          </TabsContent>
          <TabsContent value="iv-flow">
            <ProblemCard category="iv-flow" onQuestionAnswered={handleQuestionAnswered} />
          </TabsContent>
          <TabsContent value="weight-based">
            <ProblemCard category="weight-based" onQuestionAnswered={handleQuestionAnswered} />
          </TabsContent>
          <TabsContent value="infusion">
            <ProblemCard category="infusion" onQuestionAnswered={handleQuestionAnswered} />
          </TabsContent>
          <TabsContent value="pediatric">
            <ProblemCard category="pediatric" onQuestionAnswered={handleQuestionAnswered} />
          </TabsContent>
        </Tabs>
        )}

        <LocaleLink href="/si-to-conventional-units-converter">
          <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors cursor-pointer group mt-10" data-testid="link-unit-converter-cta">
            <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{t("pages.medMath.siConventionalUnitsConverter")}</p>
              <p className="text-xs text-gray-500">{t("pages.medMath.convertBetweenCanadianSiAnd")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </LocaleLink>

        <div className="mt-12 space-y-6">
          <MedicalReviewBadge lastUpdated="2025-12-01" />
          <MedicalReferences lessonId="pharmacology-dosage-calculation" />
        </div>

        <div className="mt-16 border-t border-gray-200 pt-6">
          <div className="flex items-start gap-2 text-xs text-gray-400 max-w-3xl mx-auto">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-gray-300" />
            <p>
              NurseNest provides independently developed educational content grounded in established physiological principles and widely accepted clinical reasoning frameworks. Not affiliated with or endorsed by any licensing or regulatory authority.
            </p>
          </div>
        </div>
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
