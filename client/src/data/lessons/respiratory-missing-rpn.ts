import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

export const respiratoryMissingRpnLessons: Record<string, LessonContent> = {
  "inflammation-response": {
    title: "Inflammatory Response",
    cellular: {
      title: "Acute Inflammation Cascade",
      content: "The inflammatory response is a complex protective mechanism triggered when tissues are damaged by pathogens, trauma, or chemical irritants. Mast cells at the injury site degranulate, releasing histamine, prostaglandins, and leukotrienes that cause local vasodilation and increased capillary permeability. Neutrophils are the first immune cells to arrive at the site through chemotaxis, migrating across the endothelium via diapedesis to phagocytose invading organisms. The complement system amplifies the response through opsonization and formation of the membrane attack complex. Cytokines such as interleukin-1 (IL-1) and tumour necrosis factor-alpha (TNF-alpha) mediate systemic effects including fever, leukocytosis, and increased acute-phase protein synthesis by the liver. If the initial insult is not contained, the inflammatory cascade can become systemic, progressing to systemic inflammatory response syndrome (SIRS) and potentially sepsis."
    },
    riskFactors: [
      "Immunocompromised status (HIV, chemotherapy, corticosteroid therapy)",
      "Chronic disease (diabetes mellitus, chronic kidney disease)",
      "Surgical wounds or invasive procedures",
      "Malnutrition and protein deficiency",
      "Extremes of age (neonates and older adults)",
      "Tobacco use and environmental pollutant exposure",
      "Prolonged immobility or hospitalization"
    ],
    diagnostics: [
      "Complete blood count with differential (leukocytosis with left shift)",
      "C-reactive protein (CRP) elevation indicates active inflammation",
      "Erythrocyte sedimentation rate (ESR) elevated in inflammatory states",
      "Procalcitonin level to differentiate bacterial infection from non-infectious inflammation",
      "Blood cultures if systemic infection suspected",
      "Lactate level to assess tissue perfusion (normal < 2.0 mmol/L)"
    ],
    management: [
      "Monitor vital signs frequently for signs of SIRS (temperature > 38.3 C or < 36.0 C, heart rate > 90, respiratory rate > 20, WBC > 12 or < 4 x 10^9/L)",
      "Administer prescribed antipyretics for fever management",
      "Maintain adequate hydration and nutrition to support immune function",
      "Apply cold or warm compresses as appropriate for localized inflammation",
      "Elevate affected extremity to reduce edema",
      "Report signs of worsening inflammation or systemic spread to the nurse in charge",
      "Document wound characteristics including redness, swelling, drainage, and pain level"
    ],
    signs: {
      left: [
        "Localized redness (rubor) at injury site",
        "Mild warmth (calor) over affected area",
        "Moderate swelling (tumour) with intact function",
        "Pain (dolor) proportional to injury severity"
      ],
      right: [
        "High fever > 38.5 C with rigors (systemic spread)",
        "Purulent or foul-smelling drainage from wound",
        "Rapidly spreading erythema or crepitus (necrotizing infection)",
        "Hemodynamic instability: hypotension, tachycardia > 120 bpm"
      ]
    },
    medications: [
      {
        name: "Ibuprofen",
        type: "NSAID (Non-Steroidal Anti-Inflammatory Drug)",
        action: "Inhibits cyclooxygenase (COX-1 and COX-2), reducing prostaglandin synthesis to decrease inflammation, pain, and fever",
        sideEffects: "GI bleeding, renal impairment, increased bleeding risk, cardiovascular events with prolonged use",
        contra: "Active GI bleed, severe renal impairment (eGFR < 30 mL/min), third trimester pregnancy, aspirin-sensitive asthma",
        pearl: "Administer with food to reduce GI irritation. Monitor renal function and hemoglobin in patients on prolonged therapy. Avoid in dehydrated patients."
      },
      {
        name: "Acetaminophen",
        type: "Analgesic/Antipyretic",
        action: "Inhibits prostaglandin synthesis centrally in the hypothalamus to reduce fever and pain perception without significant peripheral anti-inflammatory effect",
        sideEffects: "Hepatotoxicity at doses exceeding 4 g/day, rare hypersensitivity reactions",
        contra: "Severe hepatic impairment, active liver disease, known hypersensitivity",
        pearl: "Maximum 4 g/day in healthy adults but limit to 2 g/day in patients with hepatic impairment or chronic alcohol use. Check all combination products for hidden acetaminophen content."
      }
    ],
    pearls: [
      "The five cardinal signs of inflammation are rubor (redness), calor (warmth), tumour (swelling), dolor (pain), and functio laesa (loss of function) - monitor and document all five systematically",
      "SIRS requires two or more criteria: temperature > 38.3 C or < 36.0 C, heart rate > 90 bpm, respiratory rate > 20 breaths/min or PaCO2 < 32 mmHg, and WBC > 12 or < 4 x 10^9/L - report promptly if criteria are met",
      "Inflammation is protective when localized but becomes dangerous when systemic - early recognition of the transition from local to systemic response is a critical nursing responsibility"
    ],
    quiz: [
      {
        question: "A patient presents with a surgical wound that is red, warm, swollen, and painful. The temperature is 37.2 C and WBC is 9.5 x 10^9/L. What does this presentation most likely indicate?",
        options: [
          "Systemic inflammatory response syndrome (SIRS)",
          "Normal localized inflammatory response",
          "Sepsis requiring immediate intervention",
          "Allergic reaction to suture material"
        ],
        correct: 1,
        rationale: "The patient is demonstrating the cardinal signs of localized inflammation (rubor, calor, tumour, dolor) at the wound site. The normal temperature and WBC indicate the response has not become systemic. SIRS requires two or more systemic criteria to be met, which are absent here."
      },
      {
        question: "Which laboratory value best differentiates bacterial infection from non-infectious inflammation?",
        options: [
          "Erythrocyte sedimentation rate (ESR)",
          "C-reactive protein (CRP)",
          "Procalcitonin",
          "White blood cell count"
        ],
        correct: 2,
        rationale: "Procalcitonin is the most specific biomarker for differentiating bacterial infection from non-infectious inflammatory states. While CRP, ESR, and WBC all rise with inflammation regardless of cause, procalcitonin is primarily elevated in bacterial infections and remains low in viral infections and non-infectious inflammation."
      }
    ]
  },

  "stress-response": {
    title: "Stress Response and Coping",
    image: getAssetUrl("GAS_1773340513136.png"),
    cellular: {
      title: "Neuroendocrine Stress Cascade",
      content: "The stress response activates two primary neuroendocrine pathways: the sympathetic-adrenal-medullary (SAM) axis for the immediate fight-or-flight response and the hypothalamic-pituitary-adrenal (HPA) axis for sustained stress adaptation. The SAM axis releases catecholamines (epinephrine and norepinephrine) from the adrenal medulla, causing tachycardia, bronchodilation, glycogenolysis, and redistribution of blood flow to skeletal muscles. The HPA axis activates when the hypothalamus releases corticotropin-releasing hormone (CRH), stimulating the anterior pituitary to secrete adrenocorticotropic hormone (ACTH), which triggers cortisol release from the adrenal cortex. Cortisol raises blood glucose through gluconeogenesis, suppresses non-essential immune function, and maintains vascular tone. Prolonged cortisol elevation from chronic stress leads to immunosuppression, hyperglycemia, muscle wasting, impaired wound healing, and hippocampal neuronal damage affecting memory and cognition."
    },
    riskFactors: [
      "Acute illness, trauma, or surgical procedures",
      "Chronic pain or uncontrolled symptoms",
      "Social isolation and lack of support systems",
      "Financial insecurity or housing instability",
      "History of adverse childhood experiences (ACEs)",
      "Pre-existing anxiety or mood disorders",
      "Caregiver burden or role strain"
    ],
    diagnostics: [
      "Assess stress level using validated tools (Perceived Stress Scale, Holmes-Rahe Life Stress Inventory)",
      "Monitor cortisol levels if Cushing syndrome is suspected (24-hour urinary free cortisol or late-night salivary cortisol)",
      "Evaluate blood glucose for stress-induced hyperglycemia",
      "Assess vital signs for sympathetic activation (tachycardia, hypertension, diaphoresis)",
      "Screen for anxiety and depression using standardized instruments (GAD-7, PHQ-9)",
      "Review sleep quality using validated sleep assessment tools"
    ],
    management: [
      "Teach and reinforce evidence-based relaxation techniques (diaphragmatic breathing, progressive muscle relaxation)",
      "Promote sleep hygiene practices to restore circadian cortisol rhythm",
      "Encourage regular physical activity (at least 150 minutes per week of moderate-intensity exercise)",
      "Facilitate access to social support systems and community resources",
      "Implement therapeutic communication and active listening during patient interactions",
      "Refer to mental health services for patients with maladaptive coping or psychiatric comorbidities",
      "Educate patients on the physiological connection between chronic stress and disease progression"
    ],
    signs: {
      left: [
        "Appropriate emotional response to stressor (tearfulness, frustration)",
        "Engages in problem-solving and seeks information",
        "Maintains social connections and daily routines",
        "Utilizes healthy coping mechanisms (exercise, journaling, support groups)"
      ],
      right: [
        "Persistent tachycardia and hypertension without medical cause",
        "Severe insomnia with impaired daytime functioning",
        "Maladaptive coping (substance use, self-harm, social withdrawal)",
        "Signs of adrenal crisis: hypotension, hypoglycemia, altered consciousness"
      ]
    },
    medications: [
      {
        name: "Lorazepam",
        type: "Benzodiazepine (Anxiolytic)",
        action: "Enhances GABA-A receptor activity in the central nervous system, producing anxiolysis, sedation, and muscle relaxation",
        sideEffects: "Sedation, respiratory depression, paradoxical agitation in older adults, dependence with prolonged use",
        contra: "Severe respiratory insufficiency, acute narrow-angle glaucoma, sleep apnea, concurrent use with opioids (increased respiratory depression risk)",
        pearl: "Short-term use only (2-4 weeks maximum). Monitor respiratory rate and sedation level. Have flumazenil available for reversal. Taper gradually to prevent withdrawal seizures."
      },
      {
        name: "Sertraline",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Blocks serotonin reuptake in the synaptic cleft, increasing serotonin availability to improve mood regulation and reduce anxiety",
        sideEffects: "Nausea, sexual dysfunction, insomnia, serotonin syndrome (when combined with other serotonergic agents), increased suicidal ideation in patients under 25 years",
        contra: "Concurrent use with MAOIs (wait 14 days), concurrent use with pimozide or thioridazine",
        pearl: "Therapeutic effects take 4-6 weeks to develop. Monitor closely for suicidal ideation in the first weeks of treatment, especially in patients under 25. Do not discontinue abruptly due to risk of discontinuation syndrome."
      }
    ],
    pearls: [
      "Hans Selye's General Adaptation Syndrome describes three stages: alarm (SAM activation), resistance (HPA axis cortisol release), and exhaustion (adrenal fatigue and immune collapse) - chronic stress without intervention leads to stage three",
      "Cortisol follows a diurnal rhythm (highest in early morning, lowest at midnight) - disrupted patterns indicate chronic stress or Cushing syndrome and should be reported",
      "Coping mechanisms are either adaptive (exercise, social support, problem-solving) or maladaptive (substance use, denial, aggression) - nursing assessment should identify which patterns the patient uses to guide appropriate interventions"
    ],
    quiz: [
      {
        question: "A hospitalized patient exhibits persistent tachycardia, elevated blood glucose of 11.2 mmol/L, and reports inability to sleep for three nights. Which physiological mechanism best explains these findings?",
        options: [
          "Parasympathetic nervous system activation",
          "Sustained hypothalamic-pituitary-adrenal axis activation with cortisol release",
          "Insulin resistance from dietary intake",
          "Medication side effects from analgesics"
        ],
        correct: 1,
        rationale: "Sustained HPA axis activation releases cortisol, which causes gluconeogenesis (raising blood glucose), sympathetic stimulation (tachycardia), and CNS arousal (insomnia). This constellation of findings is characteristic of the physiological stress response. Parasympathetic activation would produce bradycardia and relaxation, which is the opposite presentation."
      }
    ]
  }
};
