/**
 * ECG Pediatric Flashcard Pathways
 *
 * Defines dedicated flashcard learning pathways for pediatric ECG content.
 * These pathways are SEPARATE from the adult ECG flashcard decks to prevent
 * mastery score contamination and enforce age-specific clinical framing.
 *
 * PATHWAY STRUCTURE
 *   Each pathway maps to a flashcard deck shown in /app/flashcards and the
 *   ECG module's dedicated pediatric section (/modules/ecg/pediatric).
 *
 * CLINICAL ACCURACY REQUIREMENTS
 *   - Every rate range listed must be from PEDIATRIC_NORMAL_RATE_RANGES
 *   - Every management step must reflect PALS 2020 guidelines
 *   - Every "normal for adult but abnormal for child" trap must be explicitly called out
 *
 * CONTENT GOVERNANCE
 *   Card content is reviewed against:
 *     - AHA/PALS 2020 Provider Manual
 *     - Harriet Lane Handbook (24th ed)
 *     - AHA Pediatric Basic and Advanced Life Support 2020 guidelines
 */

import type { PediatricAgeGroup } from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";
import {
  PEDIATRIC_NORMAL_RATE_RANGES,
  getPediatricNormalRateRange,
} from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

// ─── Flashcard content types ────────────────────────────────────────────────────

export type PediatricEcgFlashcardDifficulty = "recognition" | "interpretation" | "management";

export type PediatricEcgFlashcard = {
  /** Unique slug for deduplication and analytics */
  id: string;
  /** Front of card — the question or clinical prompt */
  front: string;
  /** Back of card — the full answer with clinical framing */
  back: string;
  /** Which age group(s) this card is specifically about */
  ageGroups: ReadonlyArray<PediatricAgeGroup>;
  /** The rhythm or topic this card teaches */
  rhythmTag: string;
  difficulty: PediatricEcgFlashcardDifficulty;
  /** True if this card explicitly teaches an adult↔pediatric contrast */
  isComparativeCard: boolean;
  /** Key NCLEX/REx-PN trap this card addresses (if applicable) */
  nclexTrap?: string;
};

export type PediatricEcgFlashcardPathway = {
  /** Deck slug — matches /app/flashcards/{deckRef} route */
  slug: string;
  title: string;
  description: string;
  /** Ordered list of card IDs in this pathway */
  cardIds: ReadonlyArray<string>;
  /**
   * Prerequisite pathway slugs — learner should complete these before this deck.
   * Empty = no prerequisites.
   */
  prerequisites: ReadonlyArray<string>;
  /** Which learner tiers have access to this deck */
  tiersWithAccess: ReadonlyArray<"RN" | "PN" | "RPN" | "NP">;
};

// ─── Flashcard content ──────────────────────────────────────────────────────────

export const PEDIATRIC_ECG_FLASHCARDS: ReadonlyArray<PediatricEcgFlashcard> = [

  // ── Age-specific normal rates ──────────────────────────────────────────────────

  {
    id: "peds-rates-neonate",
    front: "What is the normal resting heart rate range for a neonate (0–30 days)?",
    back:
      "**100–160 BPM** is the normal resting range for a neonate.\n\n" +
      "Bradycardia threshold: < 100 BPM.\n" +
      "Rate > 160 BPM with identifiable cause (fever, pain, crying) = sinus tachycardia.\n" +
      "Rate > 220 BPM with abrupt onset and no identifiable cause = SVT until proven otherwise.\n\n" +
      "⚠ Adult normal (60–100 BPM) does NOT apply to neonates.",
    ageGroups: ["neonate"],
    rhythmTag: "Pediatric sinus tachycardia",
    difficulty: "recognition",
    isComparativeCard: true,
    nclexTrap: "A neonate HR of 130 BPM is normal — do not treat as tachycardia",
  },

  {
    id: "peds-rates-infant",
    front: "What is the normal resting heart rate range for an infant (1–12 months)?",
    back:
      "**90–150 BPM** is the normal resting range for an infant.\n\n" +
      "Bradycardia threshold: < 80 BPM.\n" +
      "SVT territory: > 220 BPM with abrupt onset.\n\n" +
      "A rate of 115 BPM in a sleeping infant is normal — do not wake or intervene.",
    ageGroups: ["infant"],
    rhythmTag: "Respiratory sinus arrhythmia",
    difficulty: "recognition",
    isComparativeCard: false,
  },

  {
    id: "peds-rates-toddler",
    front: "What is the normal resting heart rate range for a toddler (1–3 years)?",
    back:
      "**70–120 BPM** is the normal resting range for a toddler.\n\n" +
      "Bradycardia threshold: < 70 BPM.\n" +
      "A toddler at 105 BPM is in the upper normal range — assess for fever or activity, not tachycardia.",
    ageGroups: ["toddler"],
    rhythmTag: "Pediatric sinus tachycardia",
    difficulty: "recognition",
    isComparativeCard: false,
  },

  {
    id: "peds-rates-child",
    front: "What is the normal resting heart rate range for a school-age child (4–12 years)?",
    back:
      "**60–100 BPM** is the normal resting range for a school-age child.\n\n" +
      "Bradycardia threshold: < 60 BPM.\n\n" +
      "Note: The 60–100 BPM range also applies to adults, but the BRADYCARDIA THRESHOLD " +
      "for children is strictly < 60 BPM with poor perfusion signs, not just any rate below 60.",
    ageGroups: ["child"],
    rhythmTag: "Pediatric sinus bradycardia",
    difficulty: "recognition",
    isComparativeCard: true,
    nclexTrap: "A school-age child at 58 BPM who is asymptomatic and exercising may not require intervention",
  },

  {
    id: "peds-rates-adolescent",
    front: "What is the normal resting heart rate range for an adolescent (13–18 years)?",
    back:
      "**55–95 BPM** is the normal resting range for an adolescent.\n\n" +
      "Bradycardia threshold: < 55 BPM.\n\n" +
      "Adolescent athletes may have resting rates 40–55 BPM — this is physiologic vagal tone, not bradycardia. " +
      "Context (asymptomatic, trained athlete) determines whether intervention is needed.",
    ageGroups: ["adolescent"],
    rhythmTag: "Pediatric sinus bradycardia",
    difficulty: "recognition",
    isComparativeCard: false,
    nclexTrap: "An adolescent athlete with HR 48 BPM and no symptoms does not require atropine",
  },

  // ── RSA ────────────────────────────────────────────────────────────────────────

  {
    id: "peds-rsa-recognition",
    front: "A nurse observes cyclic variations in a toddler's telemetry rate — faster during inspiration and slower during expiration. The P-waves are consistently sinus-morphology. What is this rhythm?",
    back:
      "**Respiratory sinus arrhythmia (RSA)** — a NORMAL finding in children.\n\n" +
      "Key features:\n" +
      "• Rate increases with inspiration (R-R shortens)\n" +
      "• Rate decreases with expiration (R-R lengthens)\n" +
      "• P-waves are consistently sinus morphology throughout (not AFib)\n" +
      "• Most prominent in children and adolescents; diminishes with age\n\n" +
      "Management: NONE. RSA reflects healthy vagal tone. Do not treat.\n\n" +
      "⚠ RSA is NOT atrial fibrillation — P-wave morphology is the key discriminator.",
    ageGroups: ["infant", "toddler", "child", "adolescent"],
    rhythmTag: "Respiratory sinus arrhythmia",
    difficulty: "recognition",
    isComparativeCard: true,
    nclexTrap: "RSA mimics irregular rhythm on telemetry; always look at P-wave morphology before acting",
  },

  {
    id: "peds-rsa-clinical-significance",
    front: "What is the clinical significance when RSA DISAPPEARS in a previously healthy child?",
    back:
      "Loss of RSA may indicate:\n\n" +
      "• **Autonomic dysfunction** — seen in diabetic autonomic neuropathy, severe sepsis\n" +
      "• **Increased sympathetic tone** — stress response, pain, anxiety\n" +
      "• **Severe illness** — the sick child loses vagal modulation of heart rate\n" +
      "• **Age-related reduction** — RSA normally diminishes in adults\n\n" +
      "Clinical action: correlate with vital signs, clinical appearance, and trends. " +
      "Loss of RSA alone does not require intervention but warrants closer assessment.",
    ageGroups: ["infant", "toddler", "child", "adolescent"],
    rhythmTag: "Respiratory sinus arrhythmia",
    difficulty: "interpretation",
    isComparativeCard: false,
  },

  // ── SVT ────────────────────────────────────────────────────────────────────────

  {
    id: "peds-svt-recognition-infant",
    front: "An infant's monitor suddenly alarms with an HR of 240 BPM. The rhythm is narrow-complex and regular. The infant is pale with poor cap refill. What is the priority action?",
    back:
      "This is **infant SVT with hemodynamic compromise**. Priority action:\n\n" +
      "**Synchronized cardioversion at 0.5–1 J/kg** (signs of poor perfusion = unstable).\n\n" +
      "PALS algorithm for SVT with poor perfusion:\n" +
      "1. Ensure IV/IO access\n" +
      "2. Sedation if possible but do not delay cardioversion\n" +
      "3. Synchronized cardioversion 0.5 J/kg → 1 J/kg if unsuccessful\n\n" +
      "Vagal maneuvers and adenosine are for STABLE SVT (adequate perfusion).\n\n" +
      "Confirm: SVT in infants ≥ 220 BPM + abrupt onset + no identifiable cause.",
    ageGroups: ["neonate", "infant"],
    rhythmTag: "Pediatric SVT",
    difficulty: "management",
    isComparativeCard: false,
    nclexTrap: "Poor perfusion with SVT = cardioversion, not adenosine as first step",
  },

  {
    id: "peds-svt-vagal-maneuvers",
    front: "What are the age-appropriate vagal maneuvers for pediatric SVT?",
    back:
      "**Vagal maneuver by age group:**\n\n" +
      "🍼 **Infants/neonates**: Apply ice pack or ice-cold water to the face for 15–30 seconds. " +
      "Activates the diving reflex — abrupt vagal surge that may terminate SVT.\n\n" +
      "🧒 **School-age children**: Valsalva maneuver — bear down or blow into a clogged straw. " +
      "Can also try carotid massage (one side only — NEVER bilateral simultaneously).\n\n" +
      "🧑 **Adolescents**: Modified Valsalva (legs elevated after straining) — evidence shows " +
      "improved conversion rate vs standard Valsalva in older children.\n\n" +
      "⚠ Carotid massage is NOT appropriate for infants — too small and anatomy different.\n" +
      "⚠ Ocular pressure is CONTRAINDICATED — risk of retinal detachment.",
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rhythmTag: "Pediatric SVT",
    difficulty: "management",
    isComparativeCard: true,
    nclexTrap: "Ice to face = infants; Valsalva = older children. Don't mix these up.",
  },

  {
    id: "peds-svt-adenosine",
    front: "What is the correct adenosine dose for pediatric SVT, and why must it be given rapidly?",
    back:
      "**Adenosine 0.1 mg/kg IV (max 6 mg first dose)** rapid IV push.\n\n" +
      "If unsuccessful: second dose 0.2 mg/kg (max 12 mg).\n\n" +
      "**Why rapid push?** Adenosine has a half-life of < 10 seconds. Slow infusion causes the " +
      "drug to be metabolized before reaching the AV node at therapeutic concentration. " +
      "Must be pushed as fast as possible and immediately followed by a 5–10 mL NS flush.\n\n" +
      "Adult comparison: fixed 6 mg → 12 mg. Pediatric: weight-based.\n\n" +
      "⚠ For WPW with pre-excited AFib (antidromic conduction): adenosine is relatively " +
      "contraindicated — use procainamide or synchronized cardioversion.",
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rhythmTag: "Pediatric SVT",
    difficulty: "management",
    isComparativeCard: true,
    nclexTrap: "Slow adenosine push = no effect. Must be the fastest possible IV bolus.",
  },

  // ── Bradycardia ────────────────────────────────────────────────────────────────

  {
    id: "peds-brady-hypoxic",
    front: "A 6-month-old infant has an HR of 68 BPM, appears pale, and has decreased responsiveness. SpO₂ is 82%. What is the FIRST intervention?",
    back:
      "**Bag-valve-mask ventilation with 100% oxygen** is the first intervention.\n\n" +
      "Rationale: Pediatric bradycardia is hypoxia until proven otherwise. Correcting hypoxia " +
      "will usually restore the heart rate within 30 seconds if hypoxia is the cause.\n\n" +
      "PALS bradycardia algorithm:\n" +
      "1. Ensure airway — position, suction if needed\n" +
      "2. Provide 100% oxygen via BVM\n" +
      "3. If HR < 60 with poor perfusion after 30 seconds of ventilation → begin CPR\n" +
      "4. Epinephrine 0.01 mg/kg IV/IO\n" +
      "5. Consider atropine for vagally-mediated bradycardia (not hypoxia)\n\n" +
      "⚠ **Atropine does NOT treat hypoxia.** Giving atropine before ventilation delays " +
      "the correct therapy and wastes critical time.",
    ageGroups: ["neonate", "infant", "toddler", "child"],
    rhythmTag: "Pediatric hypoxic bradycardia",
    difficulty: "management",
    isComparativeCard: false,
    nclexTrap: "Ventilate BEFORE giving atropine or epinephrine in pediatric bradycardia",
  },

  {
    id: "peds-brady-cpg-threshold",
    front: "At what heart rate does PALS indicate CPR should begin in a bradycardic child?",
    back:
      "**HR < 60 BPM with poor perfusion not responding to oxygenation/ventilation.**\n\n" +
      "PALS CPR threshold for bradycardia:\n" +
      "• HR < 60 BPM AND\n" +
      "• Signs of poor perfusion (pallor, mottling, altered responsiveness, weak pulses) AND\n" +
      "• Not corrected by 30 seconds of effective ventilation\n\n" +
      "At HR < 60, cardiac output is inadequate to meet metabolic demands. " +
      "CPR provides artificial circulation while the underlying cause is treated.\n\n" +
      "Epinephrine 0.01 mg/kg IV/IO q3–5min is the primary drug during CPR for bradycardia.",
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rhythmTag: "Pediatric sinus bradycardia",
    difficulty: "management",
    isComparativeCard: false,
    nclexTrap: "CPR for bradycardia starts at HR < 60 WITH poor perfusion — not just any low HR",
  },

  // ── VT / VF / Arrest rhythms ────────────────────────────────────────────────

  {
    id: "peds-vf-defibrillation",
    front: "What is the correct defibrillation energy for pediatric VF or pulseless VT?",
    back:
      "**2 J/kg for the first shock.**\n\n" +
      "PALS defibrillation sequence:\n" +
      "1. First shock: **2 J/kg**\n" +
      "2. Immediately resume CPR × 2 minutes\n" +
      "3. Rhythm check → if VF/pulseless VT persists: **4 J/kg** second shock\n" +
      "4. Epinephrine 0.01 mg/kg IV/IO after second shock and every 3–5 min\n" +
      "5. Amiodarone 5 mg/kg or lidocaine 1 mg/kg for refractory VF\n\n" +
      "Adult comparison: 200 J (biphasic) for adults (fixed dose).\n\n" +
      "⚠ Use pediatric pads/paddles for children < 10 kg. For children ≥ 10 kg, adult pads " +
      "may be used if separated ≥ 3 cm (anterior-posterior placement preferred).",
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rhythmTag: "Pediatric VF",
    difficulty: "management",
    isComparativeCard: true,
    nclexTrap: "Pediatric defibrillation is 2 J/kg (weight-based), NOT the adult 200 J fixed dose",
  },

  {
    id: "peds-arrest-primary-cause",
    front: "What is the most common cause of cardiac arrest in children, and how does this affect resuscitation priorities?",
    back:
      "**Hypoxia/respiratory failure** is the most common cause of pediatric cardiac arrest.\n\n" +
      "This is fundamentally different from adult cardiac arrest (primary cause: cardiac/coronary disease).\n\n" +
      "Clinical implications:\n" +
      "• Pediatric arrest is usually **asphyxial** — the heart stops because of oxygen failure\n" +
      "• **Ventilation is as important as chest compressions** in pediatric CPR\n" +
      "• The initial rhythm is often **asystole or PEA**, not VF\n" +
      "• Prevention: early recognition of respiratory distress and failure prevents arrest\n\n" +
      "PALS initial CPR ratio: **15:2** (two rescuers with advanced airway) or 30:2 (single rescuer)\n\n" +
      "ACLS adult ratio: 30:2 regardless of rescuers (or continuous compressions with advanced airway).",
    ageGroups: ["neonate", "infant", "toddler", "child"],
    rhythmTag: "Pediatric asystole",
    difficulty: "interpretation",
    isComparativeCard: true,
    nclexTrap: "Do not withhold ventilations in pediatric CPR — breathing matters more than in adult ACLS",
  },

  {
    id: "peds-pea-reversible-causes",
    front: "What are the most common REVERSIBLE causes of pediatric PEA to search for during CPR?",
    back:
      "The 6 Hs and 5 Ts apply to children, but the most common in pediatrics:\n\n" +
      "**Most common pediatric causes:**\n" +
      "1. 🫁 **Hypoxia** — #1 cause; confirm airway, ventilation, SpO₂\n" +
      "2. 💧 **Hypovolemia** — trauma, dehydration, GI losses; fluid bolus 10–20 mL/kg NS\n" +
      "3. 🔌 **Tension pneumothorax** — needle decompression 2nd ICS midclavicular\n" +
      "4. 🫀 **Cardiac tamponade** — penetrating trauma, pericarditis; pericardiocentesis\n" +
      "5. 🩸 **Hydrogen ion (acidosis)** — sodium bicarbonate if confirmed\n" +
      "6. ⬇️ **Hypothermia** — especially near-drowning\n\n" +
      "PALS PEA management: CPR + epinephrine 0.01 mg/kg + treat reversible cause.",
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rhythmTag: "Pediatric PEA",
    difficulty: "management",
    isComparativeCard: false,
    nclexTrap: "PEA is confirmed by pulse check — ECG alone cannot diagnose PEA",
  },

  // ── Long QT / Torsades ─────────────────────────────────────────────────────

  {
    id: "peds-lqt-threshold",
    front: "What QTc values are considered prolonged in pediatric patients?",
    back:
      "**QTc > 450 ms in boys and > 460 ms in girls** = prolonged in children.\n\n" +
      "(Adult thresholds: > 450 ms men, > 470 ms women.)\n\n" +
      "Common pediatric causes of QTc prolongation:\n" +
      "• **Congenital LQTS** — autosomal dominant; genetic testing available\n" +
      "• **Medications**: azithromycin, ondansetron, antihistamines, antipsychotics\n" +
      "• **Electrolyte abnormalities**: hypokalemia, hypomagnesemia\n\n" +
      "Presentation in children: unexplained syncope, seizure-like episodes, or " +
      "sudden death in a young athlete or child during exercise or startle.\n\n" +
      "Management: beta-blockers for congenital LQTS; avoid QTc-prolonging medications.",
    ageGroups: ["child", "adolescent"],
    rhythmTag: "Pediatric long QT / torsades risk",
    difficulty: "interpretation",
    isComparativeCard: true,
    nclexTrap: "QTc 455 ms in a 12-year-old boy = prolonged; QTc 455 ms in a 12-year-old girl = borderline only",
  },

  {
    id: "peds-torsades-treatment",
    front: "A 14-year-old collapses and VT with a twisting axis (torsades de pointes) is confirmed. The child is pulseless. What is the immediate treatment?",
    back:
      "**Pulseless torsades: immediate defibrillation at 2 J/kg** (same as any pulseless VT/VF).\n\n" +
      "After ROSC or for stable torsades:\n" +
      "• **IV magnesium sulfate 25–50 mg/kg** (max 2 g) over 10–20 minutes\n" +
      "• This is the definitive pharmacologic treatment for torsades\n" +
      "• Discontinue all QTc-prolonging agents\n" +
      "• Correct electrolytes (K⁺, Mg²⁺)\n" +
      "• Overdrive pacing or isoproterenol may shorten QTc for recurrent torsades\n\n" +
      "Adult dosing: same magnesium dose (2 g) — pediatric weight-based dose may exceed adult dose in larger adolescents.\n\n" +
      "⚠ Amiodarone is NOT recommended for torsades — it prolongs QTc and may worsen it.",
    ageGroups: ["child", "adolescent"],
    rhythmTag: "Pediatric long QT / torsades risk",
    difficulty: "management",
    isComparativeCard: false,
    nclexTrap: "Torsades = magnesium, not amiodarone. Amiodarone prolongs QT and is contraindicated.",
  },

  // ── Complete heart block ──────────────────────────────────────────────────────

  {
    id: "peds-chb-congenital",
    front: "A neonate is diagnosed with congenital complete heart block. What is the most likely maternal cause and what is the immediate assessment priority?",
    back:
      "**Most likely cause: maternal anti-Ro/La (SSA/SSB) antibodies** (neonatal lupus).\n\n" +
      "Congenital CHB occurs when maternal antibodies cross the placenta and damage the fetal AV node.\n\n" +
      "Immediate assessment:\n" +
      "1. **Ventricular escape rate** — determines hemodynamic stability (target: > 55 BPM in neonates)\n" +
      "2. **Signs of hydrops fetalis** — ascites, pleural effusion, skin edema (severe cases)\n" +
      "3. **Maternal anti-Ro/La titer** — confirm the etiology\n\n" +
      "Management:\n" +
      "• Hemodynamically stable CHB: monitor, arrange cardiology follow-up\n" +
      "• Unstable or symptomatic: temporary pacing → permanent pacemaker\n" +
      "• CHB lasting > 7–10 days post-op is unlikely to resolve without pacing\n\n" +
      "⚠ Atropine has limited effect on CHB — the block is at the AV node, not vagally mediated.",
    ageGroups: ["neonate", "infant"],
    rhythmTag: "Pediatric complete heart block",
    difficulty: "interpretation",
    isComparativeCard: false,
    nclexTrap: "Congenital CHB = maternal antibodies (neonatal lupus); acquired CHB = post-cardiac surgery",
  },

  // ── Post-op cardiac ────────────────────────────────────────────────────────────

  {
    id: "peds-jet-recognition",
    front: "A neonate returns to the PICU after VSD repair with an HR of 195 BPM, narrow QRS, and the bedside nurse notes that atrial pacing at 200 BPM does not capture. What rhythm is most likely?",
    back:
      "**Junctional ectopic tachycardia (JET)** — the most common dangerous post-op arrhythmia " +
      "after repair of congenital heart defects.\n\n" +
      "Key features distinguishing JET from SVT:\n" +
      "• **Does NOT terminate with adenosine** (unlike SVT)\n" +
      "• **Does NOT terminate with synchronized cardioversion** (unlike SVT)\n" +
      "• AV dissociation may be visible (P-waves marching slower than QRS)\n" +
      "• Narrow or near-narrow QRS (conduction via His–Purkinje)\n" +
      "• Atrial pacing does not capture because the junctional rate > atrial pacing rate\n\n" +
      "Management:\n" +
      "• **Therapeutic hypothermia** (cooling to 34–35°C) slows the junctional rate\n" +
      "• Reduce catecholamines (epinephrine infusion rate, etc.)\n" +
      "• Amiodarone infusion for refractory JET\n" +
      "• Hemodynamic support during rate control",
    ageGroups: ["neonate", "infant"],
    rhythmTag: "Post-op congenital heart telemetry pattern",
    difficulty: "management",
    isComparativeCard: false,
    nclexTrap: "JET does NOT respond to adenosine or cardioversion — adenosine here would not help",
  },
];

// ─── Flashcard pathways ─────────────────────────────────────────────────────────

export const PEDIATRIC_ECG_FLASHCARD_PATHWAYS: ReadonlyArray<PediatricEcgFlashcardPathway> = [
  {
    slug: "pediatric-ecg-age-specific-rates",
    title: "Pediatric ECG — Age-Specific Heart Rate Norms",
    description:
      "Master the normal heart rate ranges for each pediatric age group. " +
      "The most common source of error in pediatric ECG interpretation is applying adult norms to children.",
    cardIds: [
      "peds-rates-neonate",
      "peds-rates-infant",
      "peds-rates-toddler",
      "peds-rates-child",
      "peds-rates-adolescent",
    ],
    prerequisites: [],
    tiersWithAccess: ["RN", "PN", "RPN", "NP"],
  },

  {
    slug: "pediatric-ecg-rsa",
    title: "Respiratory Sinus Arrhythmia — Pediatric Normal Variant",
    description:
      "Recognize RSA as a normal, reassuring pediatric finding and distinguish it " +
      "from pathologic irregular rhythms.",
    cardIds: ["peds-rsa-recognition", "peds-rsa-clinical-significance"],
    prerequisites: ["pediatric-ecg-age-specific-rates"],
    tiersWithAccess: ["RN", "PN", "RPN", "NP"],
  },

  {
    slug: "pediatric-ecg-svt",
    title: "Pediatric SVT — Recognition and Management",
    description:
      "Master the recognition of pediatric SVT vs sinus tachycardia, age-appropriate " +
      "vagal maneuvers, and adenosine dosing.",
    cardIds: [
      "peds-svt-recognition-infant",
      "peds-svt-vagal-maneuvers",
      "peds-svt-adenosine",
    ],
    prerequisites: ["pediatric-ecg-age-specific-rates"],
    tiersWithAccess: ["RN", "NP"],
  },

  {
    slug: "pediatric-ecg-bradycardia",
    title: "Pediatric Bradycardia — Hypoxia-First Management",
    description:
      "Apply the PALS bradycardia algorithm. Understand why ventilation precedes " +
      "pharmacology in pediatric bradycardia.",
    cardIds: ["peds-brady-hypoxic", "peds-brady-cpg-threshold"],
    prerequisites: ["pediatric-ecg-age-specific-rates"],
    tiersWithAccess: ["RN", "PN", "RPN", "NP"],
  },

  {
    slug: "pediatric-ecg-arrest-rhythms",
    title: "Pediatric Arrest Rhythms — VF, Asystole, PEA",
    description:
      "Apply PALS arrest algorithm across shockable and non-shockable rhythms " +
      "with correct defibrillation energy and drug dosing.",
    cardIds: [
      "peds-vf-defibrillation",
      "peds-arrest-primary-cause",
      "peds-pea-reversible-causes",
    ],
    prerequisites: ["pediatric-ecg-bradycardia"],
    tiersWithAccess: ["RN", "NP"],
  },

  {
    slug: "pediatric-ecg-long-qt",
    title: "Pediatric Long QT and Torsades de Pointes",
    description:
      "Recognize congenital LQTS, medication-induced QTc prolongation, and manage " +
      "torsades with IV magnesium.",
    cardIds: ["peds-lqt-threshold", "peds-torsades-treatment"],
    prerequisites: ["pediatric-ecg-arrest-rhythms"],
    tiersWithAccess: ["RN", "NP"],
  },

  {
    slug: "pediatric-ecg-congenital-heart",
    title: "Congenital Heart Disease — ECG Patterns",
    description:
      "Recognize congenital complete heart block, post-operative JET, and other " +
      "ECG patterns specific to children with structural heart disease.",
    cardIds: ["peds-chb-congenital", "peds-jet-recognition"],
    prerequisites: ["pediatric-ecg-arrest-rhythms"],
    tiersWithAccess: ["RN", "NP"],
  },
];

// ─── Accessor functions ─────────────────────────────────────────────────────────

export function getPediatricFlashcardById(id: string): PediatricEcgFlashcard | undefined {
  return PEDIATRIC_ECG_FLASHCARDS.find((c) => c.id === id);
}

export function getPediatricFlashcardPathway(slug: string): PediatricEcgFlashcardPathway | undefined {
  return PEDIATRIC_ECG_FLASHCARD_PATHWAYS.find((p) => p.slug === slug);
}

export function getPediatricFlashcardsForPathway(slug: string): ReadonlyArray<PediatricEcgFlashcard> {
  const pathway = getPediatricFlashcardPathway(slug);
  if (!pathway) return [];
  return pathway.cardIds
    .map((id) => getPediatricFlashcardById(id))
    .filter((c): c is PediatricEcgFlashcard => c !== undefined);
}

/** All cards for a specific age group. */
export function getPediatricFlashcardsByAgeGroup(
  ageGroup: PediatricAgeGroup,
): ReadonlyArray<PediatricEcgFlashcard> {
  return PEDIATRIC_ECG_FLASHCARDS.filter((c) => c.ageGroups.includes(ageGroup));
}

/** All comparative cards (adult vs pediatric contrast). */
export const PEDIATRIC_COMPARATIVE_FLASHCARDS: ReadonlyArray<PediatricEcgFlashcard> =
  PEDIATRIC_ECG_FLASHCARDS.filter((c) => c.isComparativeCard);

/** All cards with an NCLEX/REx-PN trap documented. */
export const PEDIATRIC_NCLEX_TRAP_FLASHCARDS: ReadonlyArray<PediatricEcgFlashcard> =
  PEDIATRIC_ECG_FLASHCARDS.filter((c) => c.nclexTrap !== undefined);

/** Complete ordered pathway list for the learner-facing pathway browser. */
export const PEDIATRIC_ECG_PATHWAY_SLUGS: ReadonlyArray<string> =
  PEDIATRIC_ECG_FLASHCARD_PATHWAYS.map((p) => p.slug);
