import type { PreNursingLessonCheckpointCardProps } from "@/components/pre-nursing/pre-nursing-lesson-checkpoint-card";

export type PreNursingCheckpointDefinition = Omit<
  PreNursingLessonCheckpointCardProps,
  "onAnswered"
>;

export const PRE_NURSING_FOUNDATION_CHECKPOINTS: Record<string, PreNursingCheckpointDefinition> = {
  homeostasisNegativeFeedback: {
    conceptId: "prenursing.homeostasis.negative-feedback",
    eyebrow: "Interactive checkpoint",
    title: "Homeostasis check",
    stem: "A learner is studying fever. Body temperature rises, then sweating begins to help cool the body back toward normal. Which concept best explains this response?",
    correctOptionId: "b",
    options: [
      {
        id: "a",
        label: "Positive feedback, because the body amplifies the original change",
        rationale:
          "This is tempting because the body is actively responding, but positive feedback amplifies a change. Fever cooling is the opposite: the body is trying to bring temperature back toward the set point.",
      },
      {
        id: "b",
        label: "Negative feedback, because the body reverses a change to restore balance",
        rationale:
          "Correct. Negative feedback opposes a change and helps return the body toward a normal range. Sweating cools the body when temperature rises.",
      },
      {
        id: "c",
        label: "Diffusion, because heat moves from high concentration to low concentration",
        rationale:
          "Diffusion describes particle movement down a concentration gradient. Temperature regulation involves feedback control, not diffusion as the primary concept.",
      },
      {
        id: "d",
        label: "Osmosis, because water moves across membranes",
        rationale:
          "Osmosis is water movement across a semipermeable membrane. It does not explain the body’s thermostat-like regulation of temperature.",
      },
    ],
    clinicalRelevance:
      "Nurses constantly assess whether the body is maintaining or losing balance: temperature, blood pressure, glucose, oxygenation, fluid status, and electrolytes are all homeostatic patterns.",
    memoryAnchor: "Negative feedback = pushes the body back toward normal.",
    misconceptionNote:
      "Beginners often think any active response is positive feedback. The key question is whether the response amplifies the change or reverses it.",
  },

  cellTransportHypotonic: {
    conceptId: "prenursing.cell-transport.hypotonic-fluid-shift",
    eyebrow: "Interactive checkpoint",
    title: "Cell transport check",
    stem: "A red blood cell is placed in a hypotonic solution. Water moves into the cell and the cell begins to swell. Which process explains this movement?",
    correctOptionId: "c",
    options: [
      {
        id: "a",
        label: "Active transport",
        rationale:
          "Active transport requires ATP and moves substances against a gradient. The swelling described here is water movement, not ATP-powered solute pumping.",
      },
      {
        id: "b",
        label: "Facilitated diffusion",
        rationale:
          "Facilitated diffusion uses membrane proteins to move solutes down a gradient. The key event here is water moving across the membrane.",
      },
      {
        id: "c",
        label: "Osmosis",
        rationale:
          "Correct. Osmosis is water movement across a semipermeable membrane. In a hypotonic solution, water moves into the cell, which can cause swelling or lysis.",
      },
      {
        id: "d",
        label: "Endocytosis",
        rationale:
          "Endocytosis brings larger materials into a cell using membrane vesicles. It does not explain water movement into a red blood cell.",
      },
    ],
    clinicalRelevance:
      "Fluid shifts matter in IV therapy, dehydration, edema, sodium imbalance, and neurologic safety. Understanding osmosis early makes later fluid-and-electrolyte nursing content much easier.",
    memoryAnchor: "Water follows solute concentration: it moves toward the side with more dissolved particles.",
    misconceptionNote:
      "A common beginner trap is mixing up solute movement with water movement. Osmosis is specifically about water.",
  },

  cardiovascularBloodFlow: {
    conceptId: "prenursing.cardiovascular.blood-flow",
    eyebrow: "Clinical thinking checkpoint",
    title: "Blood flow check",
    stem: "Which chamber pumps oxygenated blood out to the body through the aorta?",
    correctOptionId: "d",
    options: [
      {
        id: "a",
        label: "Right atrium",
        rationale:
          "The right atrium receives deoxygenated blood from the body. It does not pump oxygenated blood to systemic circulation.",
      },
      {
        id: "b",
        label: "Right ventricle",
        rationale:
          "The right ventricle pumps deoxygenated blood to the lungs through the pulmonary artery. It is important for oxygenation, but not systemic output.",
      },
      {
        id: "c",
        label: "Left atrium",
        rationale:
          "The left atrium receives oxygenated blood from the lungs, then passes it to the left ventricle. It is not the main pumping chamber for the body.",
      },
      {
        id: "d",
        label: "Left ventricle",
        rationale:
          "Correct. The left ventricle pumps oxygenated blood through the aorta to the systemic circulation. This is central to perfusion.",
      },
    ],
    clinicalRelevance:
      "When left ventricular pumping is impaired, tissues may not receive enough oxygenated blood. This is why heart failure, low blood pressure, and poor perfusion matter clinically.",
    memoryAnchor: "Left ventricle = launches blood to the body.",
    misconceptionNote:
      "Learners often confuse receiving chambers with pumping chambers. Atria receive; ventricles pump.",
  },

  oxygenationGasExchange: {
    conceptId: "prenursing.respiratory.gas-exchange",
    eyebrow: "Clinical thinking checkpoint",
    title: "Oxygenation check",
    stem: "A patient’s oxygen saturation is dropping. Which process is most directly affected when oxygen cannot move effectively from the alveoli into the blood?",
    correctOptionId: "a",
    options: [
      {
        id: "a",
        label: "Gas exchange",
        rationale:
          "Correct. Gas exchange is the movement of oxygen from alveoli into the blood and carbon dioxide from blood into alveoli.",
      },
      {
        id: "b",
        label: "Peristalsis",
        rationale:
          "Peristalsis moves contents through the GI tract. It does not explain oxygen movement from lungs to blood.",
      },
      {
        id: "c",
        label: "Bone remodeling",
        rationale:
          "Bone remodeling is the breakdown and rebuilding of bone tissue. It is not related to alveolar oxygen transfer.",
      },
      {
        id: "d",
        label: "Filtration in the nephron",
        rationale:
          "Nephron filtration occurs in the kidney. It is important for renal function, not alveolar oxygen transfer.",
      },
    ],
    clinicalRelevance:
      "Oxygenation problems can show up as shortness of breath, low SpO2, restlessness, confusion, cyanosis, or increased work of breathing.",
    memoryAnchor: "Alveoli are the exchange surface: oxygen in, carbon dioxide out.",
    misconceptionNote:
      "A common beginner trap is using broad terms like breathing for everything. Ventilation moves air; gas exchange moves gases across the alveolar-capillary membrane.",
  },

  potassiumCardiacConduction: {
    conceptId: "prenursing.electrolytes.potassium-cardiac-conduction",
    eyebrow: "Clinical thinking checkpoint",
    title: "Electrolyte safety check",
    stem: "Which electrolyte is especially important for cardiac electrical activity and can contribute to dangerous dysrhythmias when severely abnormal?",
    correctOptionId: "b",
    options: [
      {
        id: "a",
        label: "Chloride",
        rationale:
          "Chloride is important for fluid and acid-base balance, but potassium is more directly emphasized for cardiac conduction safety in beginner nursing content.",
      },
      {
        id: "b",
        label: "Potassium",
        rationale:
          "Correct. Potassium strongly affects cardiac electrical activity. Severe high or low potassium can contribute to dangerous rhythm changes.",
      },
      {
        id: "c",
        label: "Phosphate",
        rationale:
          "Phosphate is important for energy, bones, and cellular function, but it is not the classic beginner electrolyte tied to immediate dysrhythmia risk.",
      },
      {
        id: "d",
        label: "Bicarbonate",
        rationale:
          "Bicarbonate is important in acid-base balance. It is not the best answer for cardiac conduction risk compared with potassium.",
      },
    ],
    clinicalRelevance:
      "Potassium abnormalities are clinically important because they can affect heart rhythm, muscle function, and patient safety.",
    memoryAnchor: "K+ keeps the cardiac current stable.",
    misconceptionNote:
      "Beginners often memorize electrolyte names without linking them to patient risk. Potassium should immediately make you think heart rhythm and muscle function.",
  },
};

export const PRE_NURSING_ANATOMY_INITIAL_CHECKPOINT_IDS = [
  "homeostasisNegativeFeedback",
  "cellTransportHypotonic",
  "cardiovascularBloodFlow",
  "oxygenationGasExchange",
  "potassiumCardiacConduction",
] as const;
