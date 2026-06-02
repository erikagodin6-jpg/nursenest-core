export type DosagePracticeMode =
  | "tablet-practice"
  | "liquid-practice"
  | "weight-practice"
  | "iv-rate-practice"
  | "range-practice";

export type DosagePracticeStep = {
  id: string;
  label: string;
  value: string;
  explanation: string;
};

export type DosagePracticeResult = {
  mode: DosagePracticeMode;
  answer: number;
  unit: string;
  displayAnswer: number;
  learningNote: string;
  steps: DosagePracticeStep[];
};

export function solveTabletPractice(input: {
  orderedAmount: number;
  availableAmount: number;
  quantity?: number;
}): DosagePracticeResult {
  assertPositive(input.orderedAmount, "orderedAmount");
  assertPositive(input.availableAmount, "availableAmount");

  const quantity = input.quantity ?? 1;
  assertPositive(quantity, "quantity");

  const answer = (input.orderedAmount / input.availableAmount) * quantity;

  return {
    mode: "tablet-practice",
    answer,
    unit: "tablet(s)",
    displayAnswer: roundForPractice(answer),
    learningNote:
      "Educational practice result only. Learners should focus on setup logic, unit matching, and reasonableness checks.",
    steps: [
      {
        id: "ordered",
        label: "Find the ordered amount",
        value: `${input.orderedAmount}`,
        explanation: "This is the target amount in the practice prompt.",
      },
      {
        id: "available",
        label: "Find the available amount",
        value: `${input.availableAmount}`,
        explanation: "This is the amount represented by one available unit in the practice prompt.",
      },
      {
        id: "setup",
        label: "Use desired over have",
        value: `${input.orderedAmount} ÷ ${input.availableAmount} × ${quantity}`,
        explanation: "Desired over have converts the target amount into a number of available units.",
      },
    ],
  };
}

export function solveLiquidPractice(input: {
  orderedAmount: number;
  availableAmount: number;
  availableVolumeMl: number;
}): DosagePracticeResult {
  assertPositive(input.orderedAmount, "orderedAmount");
  assertPositive(input.availableAmount, "availableAmount");
  assertPositive(input.availableVolumeMl, "availableVolumeMl");

  const answer = (input.orderedAmount / input.availableAmount) * input.availableVolumeMl;

  return {
    mode: "liquid-practice",
    answer,
    unit: "mL",
    displayAnswer: roundForPractice(answer),
    learningNote:
      "Educational practice result only. The key learning goal is matching amount units to volume units correctly.",
    steps: [
      {
        id: "ordered",
        label: "Find the ordered amount",
        value: `${input.orderedAmount}`,
        explanation: "This is the target amount in the practice prompt.",
      },
      {
        id: "concentration",
        label: "Read the concentration",
        value: `${input.availableAmount} per ${input.availableVolumeMl} mL`,
        explanation: "Liquid practice problems convert an amount into a matching volume.",
      },
      {
        id: "setup",
        label: "Convert amount to volume",
        value: `${input.orderedAmount} ÷ ${input.availableAmount} × ${input.availableVolumeMl}`,
        explanation: "The available volume scales the final answer into mL.",
      },
    ],
  };
}

export function solveWeightPractice(input: {
  amountPerKg: number;
  weightKg: number;
  portions?: number;
}): DosagePracticeResult {
  assertPositive(input.amountPerKg, "amountPerKg");
  assertPositive(input.weightKg, "weightKg");

  const portions = input.portions ?? 1;
  assertPositive(portions, "portions");

  const total = input.amountPerKg * input.weightKg;
  const answer = total / portions;

  return {
    mode: "weight-practice",
    answer,
    unit: "amount per portion",
    displayAnswer: roundForPractice(answer),
    learningNote:
      "Educational practice result only. Weight-based problems require kilograms and careful attention to whether the total is divided into portions.",
    steps: [
      {
        id: "weight",
        label: "Use kilograms",
        value: `${input.weightKg} kg`,
        explanation: "Weight-based study problems use kg as the base weight unit.",
      },
      {
        id: "total",
        label: "Calculate total amount",
        value: `${input.amountPerKg} × ${input.weightKg} = ${roundForPractice(total)}`,
        explanation: "Amount per kg multiplied by kg gives the total amount for the prompt.",
      },
      {
        id: "portion",
        label: "Divide if the prompt asks for portions",
        value: `${roundForPractice(total)} ÷ ${portions}`,
        explanation: "Some prompts divide a total amount across multiple portions or times.",
      },
    ],
  };
}

export function solveIvRatePractice(input: {
  volumeMl: number;
  timeHours: number;
}): DosagePracticeResult {
  assertPositive(input.volumeMl, "volumeMl");
  assertPositive(input.timeHours, "timeHours");

  const answer = input.volumeMl / input.timeHours;

  return {
    mode: "iv-rate-practice",
    answer,
    unit: "mL/hr",
    displayAnswer: roundForPractice(answer),
    learningNote:
      "Educational practice result only. IV-rate practice builds volume-over-time reasoning.",
    steps: [
      {
        id: "volume",
        label: "Identify volume",
        value: `${input.volumeMl} mL`,
        explanation: "This is the total volume in the practice prompt.",
      },
      {
        id: "time",
        label: "Identify time",
        value: `${input.timeHours} hr`,
        explanation: "Time should be converted to hours for mL/hr practice.",
      },
      {
        id: "rate",
        label: "Divide volume by time",
        value: `${input.volumeMl} ÷ ${input.timeHours}`,
        explanation: "Volume divided by time gives mL/hr.",
      },
    ],
  };
}

export function checkPracticeRange(input: {
  value: number;
  minimum: number;
  maximum: number;
}): {
  inRange: boolean;
  message: string;
} {
  assertPositive(input.value, "value");
  assertPositive(input.minimum, "minimum");
  assertPositive(input.maximum, "maximum");

  if (input.minimum > input.maximum) {
    throw new Error("minimum cannot be greater than maximum");
  }

  if (input.value < input.minimum) {
    return {
      inRange: false,
      message: "The practice value is below the stated range. Recheck unit conversion, setup, and arithmetic.",
    };
  }

  if (input.value > input.maximum) {
    return {
      inRange: false,
      message: "The practice value is above the stated range. Recheck unit conversion, setup, and arithmetic.",
    };
  }

  return {
    inRange: true,
    message: "The practice value is within the stated range.",
  };
}

function assertPositive(value: number, fieldName: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
}

function roundForPractice(value: number): number {
  return Math.round(value * 100) / 100;
}
