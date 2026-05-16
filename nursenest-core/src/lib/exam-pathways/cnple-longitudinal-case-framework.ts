export type CnpleLongitudinalCaseStage = {
  stage: number;
  title: string;
  learnerFocus: string;
  expectedActions: readonly string[];
};

export type CnpleLongitudinalCaseFramework = {
  id: string;
  condition: string;
  specialty: string;
  educationalGoal: string;
  stages: readonly CnpleLongitudinalCaseStage[];
};

/**
 * Longitudinal NP case architecture.
 *
 * CNPLE preparation should not behave like isolated question drilling.
 * These frameworks establish the progression model for:
 *  - repeat visits
 *  - follow-up management
 *  - prescribing changes
 *  - escalation/de-escalation
 *  - monitoring intervals
 *  - chronic disease progression
 */
export const CNPLE_LONGITUDINAL_CASE_FRAMEWORKS: readonly CnpleLongitudinalCaseFramework[] = [
  {
    id: "type2-diabetes-followup",
    condition: "Type 2 Diabetes Mellitus",
    specialty: "Primary Care",
    educationalGoal:
      "Teach longitudinal diabetes management, medication escalation, monitoring, and complication prevention.",
    stages: [
      {
        stage: 1,
        title: "Initial Presentation",
        learnerFocus: "Diagnostic workup and baseline assessment",
        expectedActions: [
          "Order baseline A1C",
          "Assess cardiovascular risk",
          "Initiate lifestyle counseling",
          "Evaluate contraindications to therapy",
        ],
      },
      {
        stage: 2,
        title: "First Follow-Up",
        learnerFocus: "Medication initiation and monitoring",
        expectedActions: [
          "Review adherence",
          "Interpret repeat labs",
          "Initiate or titrate medication",
          "Address side effects",
        ],
      },
      {
        stage: 3,
        title: "Progression and Escalation",
        learnerFocus: "Complication screening and treatment escalation",
        expectedActions: [
          "Screen for nephropathy",
          "Adjust therapy",
          "Review blood pressure control",
          "Determine referral needs",
        ],
      },
    ],
  },
  {
    id: "pediatric-asthma-progression",
    condition: "Pediatric Asthma",
    specialty: "Pediatrics",
    educationalGoal:
      "Teach severity progression, inhaler escalation, trigger assessment, and follow-up planning.",
    stages: [
      {
        stage: 1,
        title: "Acute Assessment",
        learnerFocus: "Severity classification and stabilization",
        expectedActions: [
          "Assess respiratory distress",
          "Identify red flags",
          "Initiate bronchodilator therapy",
          "Determine emergency referral need",
        ],
      },
      {
        stage: 2,
        title: "Follow-Up Review",
        learnerFocus: "Controller therapy and education",
        expectedActions: [
          "Review inhaler technique",
          "Assess trigger exposure",
          "Escalate controller therapy",
          "Provide caregiver education",
        ],
      },
    ],
  },
  {
    id: "prenatal-hypertension-monitoring",
    condition: "Hypertension in Pregnancy",
    specialty: "Women's Health",
    educationalGoal:
      "Teach maternal-fetal monitoring, escalation thresholds, and urgent complication recognition.",
    stages: [
      {
        stage: 1,
        title: "Initial Detection",
        learnerFocus: "Risk identification and baseline investigation",
        expectedActions: [
          "Confirm blood pressure readings",
          "Assess gestational age",
          "Order urine protein evaluation",
          "Review warning symptoms",
        ],
      },
      {
        stage: 2,
        title: "Monitoring and Escalation",
        learnerFocus: "Complication surveillance and referral",
        expectedActions: [
          "Trend blood pressure",
          "Identify preeclampsia red flags",
          "Coordinate obstetrical referral",
          "Determine urgent escalation needs",
        ],
      },
    ],
  },
] as const;
