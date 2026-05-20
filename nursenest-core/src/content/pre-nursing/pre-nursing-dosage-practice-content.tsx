import { PreNursingDosagePracticeWorkflow } from "@/components/pre-nursing/pre-nursing-dosage-practice-workflow";
import {
  solveIvRatePractice,
  solveLiquidPractice,
  solveTabletPractice,
  solveWeightPractice,
} from "@/lib/pre-nursing/dosage-practice-engine";

export function TabletDosagePracticeLesson() {
  const result = solveTabletPractice({
    orderedAmount: 500,
    availableAmount: 250,
    quantity: 1,
  });

  return (
    <PreNursingDosagePracticeWorkflow
      title="Tablet dosage setup"
      description="Practice converting a target amount into the correct number of available tablets using desired-over-have reasoning."
      result={result}
      conceptId="tablet-dosage-practice"
    />
  );
}

export function LiquidDosagePracticeLesson() {
  const result = solveLiquidPractice({
    orderedAmount: 400,
    availableAmount: 200,
    availableVolumeMl: 5,
  });

  return (
    <PreNursingDosagePracticeWorkflow
      title="Liquid medication conversion"
      description="Practice converting a target amount into a liquid volume using concentration reasoning."
      result={result}
      conceptId="liquid-dosage-practice"
    />
  );
}

export function WeightBasedDosagePracticeLesson() {
  const result = solveWeightPractice({
    amountPerKg: 10,
    weightKg: 24,
    portions: 2,
  });

  return (
    <PreNursingDosagePracticeWorkflow
      title="Weight-based dosage reasoning"
      description="Practice converting amount-per-kilogram prompts into total and divided practice amounts."
      result={result}
      conceptId="weight-based-dosage-practice"
    />
  );
}

export function IvRatePracticeLesson() {
  const result = solveIvRatePractice({
    volumeMl: 1000,
    timeHours: 8,
  });

  return (
    <PreNursingDosagePracticeWorkflow
      title="IV-rate calculation workflow"
      description="Practice converting total volume and infusion time into a flow rate using volume-over-time reasoning."
      result={result}
      conceptId="iv-rate-practice"
    />
  );
}
