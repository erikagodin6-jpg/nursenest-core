import type {
  PrescribingCatItem,
  PrescribingCatSelection,
  PrescribingCatState
} from "./prescribing-cat-types";

const ITEM_BANK: PrescribingCatItem[] = [
  {
    id: "cat-mrsa-1",
    domain: "organism-coverage",
    difficulty: 2,
    discrimination: 0.72,
    prompt:
      "Which outpatient therapy most appropriately targets purulent MRSA cellulitis?",
    correctOptionId: "tmp-smx",
    optionIds: ["tmp-smx", "cefepime", "meropenem", "amoxicillin"],
    remediationModule: "coverage-drills"
  },
  {
    id: "cat-renal-1",
    domain: "renal-dosing",
    difficulty: 4,
    discrimination: 0.91,
    prompt:
      "Which prescribing adjustment is safest in severe renal impairment?",
    correctOptionId: "dose-adjustment",
    optionIds: [
      "dose-adjustment",
      "increase-frequency",
      "ignore-renal-function",
      "double-loading-dose"
    ],
    remediationModule: "renal-dosing"
  }
];

export function selectNextPrescribingCatItem(
  state: PrescribingCatState
): PrescribingCatSelection {
  const unansweredItems = ITEM_BANK.filter(
    (item) => !state.answeredItemIds.includes(item.id)
  );

  const weakDomainItem = unansweredItems.find((item) =>
    state.weakDomains.includes(item.domain)
  );

  if (weakDomainItem) {
    return {
      item: weakDomainItem,
      reason:
        "Prior learner performance suggests remediation is needed in this prescribing domain."
    };
  }

  const closestDifficulty = unansweredItems.sort(
    (a, b) =>
      Math.abs(a.difficulty - state.estimatedAbility) -
      Math.abs(b.difficulty - state.estimatedAbility)
  )[0];

  return {
    item: closestDifficulty,
    reason:
      "Item selected to optimize adaptive prescribing ability estimation."
    }
  };
}
