/**
 * Advanced Hemodynamic Monitoring — Paywall Curriculum
 *
 * All lessons here require the advanced_hemodynamics_paid entitlement.
 * Gate: /modules/hemodynamics-advanced via loadAdvancedHemodynamicsAccess()
 *
 * Lessons follow the same 10-section pedagogical framework as fundamentals.
 */

export type AdvancedHemodynamicsLesson = {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  level: "advanced" | "mastery";
  estimatedMinutes: number;
  overview: { clinicalSignificance: string; commonSettings: readonly string[]; keyQuestion: string };
  mechanism: { physiologicalBasis: string; keyRelationships: readonly string[]; whyItLooksLikeThis: string };
  normalRanges: readonly { parameter: string; value: string; unit: string; clinicalNote: string }[];
  abnormalPatterns: readonly { pattern: string; direction: "high" | "low" | "abnormal"; causes: readonly string[]; clinicalMeaning: string }[];
  deepDive: string;
  nursingPriorities: readonly string[];
  troubleshooting: readonly { problem: string; cause: string; action: string }[];
  commonTraps: readonly string[];
  notThisBecause: readonly { mimicker: string; differentiator: string }[];
  caseApplication: {
    patientProfile: string;
    vitals: string;
    hemodynamicData: string;
    clinicalContext: string;
    question: string;
    reasoning: string;
    nursingActions: readonly string[];
  };
  practiceItems: readonly {
    stem: string;
    choices: readonly [string, string, string, string];
    correct: 0 | 1 | 2 | 3;
    rationale: string;
    trapGuarded: string;
  }[];
};

// ─── Advanced Lesson 1 — PAOP / Wedge Pressure ───────────────────────────────

const advLesson01: AdvancedHemodynamicsLesson = {
  id: "adv-paop-wedge",
  slug: "paop-wedge",
  number: 1,
  title: "PAOP / Wedge Pressure Mastery",
  subtitle: "Left heart filling, cardiogenic vs non-cardiogenic pulmonary edema, overwedging, and troubleshooting",
  level: "advanced",
  estimatedMinutes: 35,

  overview: {
    clinicalSignificance:
      "PAOP (pulmonary artery occlusion pressure), also called wedge pressure, is the only bedside measurement that directly estimates left ventricular end-diastolic pressure (LVEDP) without left heart catheterization. It answers the most critical question in pulmonary edema management: is this fluid from a failing left heart (cardiogenic, PAOP >18) or from capillary leak (non-cardiogenic/ARDS, PAOP ≤18)? These two conditions require opposite fluid management strategies — getting this wrong kills.",
    commonSettings: ["cardiogenic vs ARDS differentiation in ICU", "post-cardiac surgery filling pressure optimization", "refractory pulmonary edema evaluation", "cardiogenic shock with PA catheter", "pulmonary hypertension workup"],
    keyQuestion: "Is this pulmonary edema from elevated left heart filling pressure (treat with diuresis/inotrope) or from non-cardiogenic capillary leak (treat with lung-protective ventilation and cautious fluids)?",
  },

  mechanism: {
    physiologicalBasis:
      "When the PA catheter balloon is inflated in a pulmonary artery branch, flow through that segment is stopped. The column of blood between the catheter tip and the pulmonary veins becomes static. Because there is no flow, there is no pressure drop — the measured pressure at the tip equilibrates with pulmonary venous pressure, which in turn reflects left atrial pressure (LAP). In the absence of mitral valve disease and with a pulmonary vascular resistance near normal, LAP ≈ LVEDP. PAOP is therefore a transmitted pressure — not a directly measured left heart pressure, but a back-transmitted estimate through the pulmonary venous system.",
    keyRelationships: [
      "PAOP ≈ LAP ≈ LVEDP (when PVR normal, no mitral stenosis)",
      "PAOP >18 mmHg = cardiogenic pulmonary edema threshold",
      "PAOP ≤18 mmHg + bilateral infiltrates = non-cardiogenic (ARDS, capillary leak) until proven otherwise",
      "PADP − PAOP gradient: ≤5 = PVR normal (PADP reliable PAOP proxy); >5 = elevated PVR (PADP unreliable)",
      "False high PAOP: mitral stenosis, PEEP effect, catheter not in West zone 3",
      "False low PAOP: mitral regurgitation (elevated LAP not fully transmitted to wedge)",
    ],
    whyItLooksLikeThis:
      "The wedge waveform mirrors the CVP waveform (a-c-v waves, x-y descents) but at a higher pressure and reflecting left-sided events. The 'v' wave in PAOP is particularly important: a giant v wave (PAOP v wave much higher than mean PAOP) signals acute mitral regurgitation — blood regurgitating back into the left atrium during systole creates a pressure spike visible as a large v wave on the wedge tracing. This is a critical sign of acute papillary muscle rupture (post-MI) or chordae tendineae rupture.",
  },

  normalRanges: [
    { parameter: "PAOP", value: "6–12", unit: "mmHg", clinicalNote: "Normal left heart filling; individualize target in heart failure" },
    { parameter: "PAOP (cardiogenic pulmonary edema threshold)", value: ">18", unit: "mmHg", clinicalNote: "High sensitivity for cardiogenic edema; some patients develop edema at lower values" },
    { parameter: "PADP−PAOP gradient (normal)", value: "≤5", unit: "mmHg", clinicalNote: ">5 = elevated PVR; PADP no longer reliable PAOP surrogate" },
    { parameter: "PAOP v wave (normal)", value: "<5 above mean PAOP", unit: "mmHg", clinicalNote: "Giant v waves >10–15 above mean PAOP = severe MR" },
  ],

  abnormalPatterns: [
    {
      pattern: "PAOP >18 with bilateral pulmonary infiltrates",
      direction: "high",
      causes: ["decompensated left heart failure", "acute MI", "cardiogenic shock", "mitral stenosis", "acute MR"],
      clinicalMeaning: "Hydrostatic pulmonary edema. Elevated left-sided filling pressure drives fluid across the alveolar-capillary membrane. Treatment: diuresis, afterload reduction, inotropic support if CI is low. Avoid fluids.",
    },
    {
      pattern: "PAOP ≤18 with bilateral pulmonary infiltrates and hypoxia",
      direction: "low",
      causes: ["ARDS (diffuse alveolar damage)", "aspiration pneumonitis", "pneumonia", "near-drowning", "inhalation injury"],
      clinicalMeaning: "Non-cardiogenic pulmonary edema — capillary leak, not hydrostatic pressure. ARDS Berlin criteria: PAOP ≤18 (or no evidence of heart failure). Lung-protective ventilation (6 mL/kg IBW, PEEP titration). Conservative fluid strategy.",
    },
    {
      pattern: "Giant v waves on PAOP tracing",
      direction: "abnormal",
      causes: ["acute mitral regurgitation (papillary muscle rupture post-MI, chordae rupture)", "acute VSD post-MI"],
      clinicalMeaning: "Surgical emergency — acute MR from papillary muscle rupture or VSD carries extremely high mortality without urgent surgical repair. Giant v waves may be misread as a PA pressure trace; the dicrotic notch is absent in the wedge trace, confirming wedge position.",
    },
    {
      pattern: "PAOP appears falsely elevated",
      direction: "high",
      causes: ["catheter tip in West zone 1 or 2 (alveolar pressure exceeds vascular)", "high PEEP transmitted to pulmonary veins", "mitral stenosis (PAOP overestimates LVEDP)"],
      clinicalMeaning: "West zone position artifact: when alveolar pressure > pulmonary venous pressure, the wedge reflects alveolar, not vascular, pressure. Confirm zone 3 position (tip below LA level on lateral CXR). Subtract approximately 50% of PEEP if PEEP >10 cmH2O for clinical estimation.",
    },
  ],

  deepDive:
    "The PAOP–ARDS differentiation is one of the highest-yield clinical distinctions in critical care. Key differentiators beyond PAOP: (1) BNP/NT-proBNP — markedly elevated in cardiogenic edema, usually lower in ARDS (though sepsis elevates BNP); (2) Echocardiography — cardiogenic shows reduced EF, dilated LV, elevated E/e'; ARDS shows preserved EF with normal LV; (3) Response to diuresis — cardiogenic edema improves with diuresis; ARDS does not reliably improve and may worsen if intravascular volume depleted; (4) PaO2/FiO2 ratio and bilateral infiltrates — required for ARDS diagnosis (Berlin criteria: PF <300 = mild, <200 = moderate, <100 = severe). A PAOP ≤18 does not exclude some cardiogenic edema in patients with very stiff ventricles or acute flash pulmonary edema, but it strongly supports non-cardiogenic etiology.",

  nursingPriorities: [
    "Confirm West zone 3 catheter tip position (tip below LA level on lateral CXR) before trusting PAOP values",
    "Wedge time limit: inflate only until waveform changes — deflate immediately, never >3 breaths",
    "Read PAOP at end-expiration: the monitor's digital display shows the end-expiratory value automatically",
    "Document PEEP with every PAOP reading — PEEP >5 cmH2O elevates measured PAOP above true transmural value",
    "Identify and report giant v waves to provider immediately — may indicate acute MR surgical emergency",
    "Correlate PAOP with clinical picture: BNP, Echo EF, radiograph infiltrate pattern, response to diuresis",
    "Report PAOP >18 with bilateral infiltrates + low CI: this is cardiogenic shock with pulmonary edema — diuresis + inotrope, no fluids",
    "Report PAOP ≤18 with bilateral infiltrates + hypoxia: consider ARDS — conservative fluid management, lung protection",
  ],

  troubleshooting: [
    { problem: "PAOP reading appears much higher than expected clinically", cause: "Catheter tip in West zone 1 or 2, high PEEP, or overwedged balloon", action: "Check CXR for tip position; confirm balloon fully deflated between measurements; subtract PEEP correction (PEEP cmH2O × 0.5 for clinical estimate); alert provider" },
    { problem: "Unable to wedge — waveform does not change with balloon inflation", cause: "Catheter too proximal, balloon rupture, catheter knotting", action: "Use CO2 to test balloon integrity if rupture suspected; notify provider for repositioning; PADP as PAOP surrogate only if PADP−PAOP gradient was previously normal" },
    { problem: "Giant v waves on wedge tracing", cause: "Acute MR (papillary muscle rupture, chordae rupture), VSD", action: "Notify provider and cardiology immediately — may represent surgical emergency; prepare for urgent echocardiography; mean of the v wave is not equivalent to true PAOP" },
  ],

  commonTraps: [
    "Using PAOP >18 as the sole criterion for 'no fluids' without CO/CI — a dry patient with acute MR may have PAOP 22 and CI 1.4 (needs both inotrope and afterload reduction, not just fluid restriction)",
    "Not correcting for PEEP: PAOP 16 with PEEP 14 may represent true PAOP of only 9 (16 − 14×0.5 = 9) — patient may actually be volume depleted",
    "Reading PAOP at the wrong phase of respiration — during positive pressure ventilation, PAOP is highest at end-inspiration; always read at end-expiration",
    "Confusing giant v waves with PA pressure — both have similar amplitudes; absence of dicrotic notch confirms wedge position (not PA)",
    "Using PADP as PAOP surrogate without checking the gradient — elevated PVR (ARDS, PE, pulmonary HTN) makes PADP unreliable",
  ],

  notThisBecause: [
    {
      mimicker: "High PAOP = always cardiogenic pulmonary edema, always treat with diuretics",
      differentiator: "Cardiogenic shock with very low CI may need inotrope support before or alongside diuresis. Diuresis in cardiogenic shock can drop preload enough to precipitously reduce CO further. The complete picture is PAOP + CI + MAP + clinical signs.",
    },
    {
      mimicker: "Normal PAOP rules out all cardiac causes of pulmonary edema",
      differentiator: "Flash pulmonary edema (hypertensive emergency, acute severe MR) can occur transiently with PAOP that normalizes by the time the catheter is inserted. Diastolic dysfunction can cause edema at lower filling pressures in stiff ventricles. Echocardiography and BNP provide complementary information.",
    },
  ],

  caseApplication: {
    patientProfile: "53-year-old male, 12 hours post-inferior STEMI with PCI. Now intubated for hypoxic respiratory failure.",
    vitals: "MAP 62 on NE 0.08 mcg/kg/min, HR 112, SpO2 88% on FiO2 80%, PEEP 10. Temp 37.1°C.",
    hemodynamicData: "PAOP 28 (with PEEP 10), PADP 32, CO 2.6 L/min, CI 1.4 L/min/m², SVR 1740. CVP 16.",
    clinicalContext: "Bilateral pulmonary infiltrates on CXR. Echo shows EF 18%, moderate MR. BNP 4200. The respiratory therapist asks whether to increase PEEP further for oxygenation.",
    question: "Is increasing PEEP the priority? What does the PAOP tell you about the etiology, and what is the correct hemodynamic intervention?",
    reasoning:
      "PAOP 28 (corrected for PEEP: 28 − 10×0.5 = 23 — still markedly elevated) confirms cardiogenic pulmonary edema, not ARDS. Increasing PEEP may briefly improve oxygenation but also raises intrathoracic pressure → reduces venous return → drops CO further in an already CI-1.4 patient. The priority is treating the hemodynamic cause: inotrope (dobutamine) for CI 1.4, loop diuretic to reduce PAOP, and careful MAP support. The moderate MR may be contributing to giant v waves and elevated PAOP — report to cardiology for surgical evaluation.",
    nursingActions: [
      "Notify intensivist and cardiology: PAOP 28 (corrected ~23), CI 1.4, moderate MR post-MI — possible surgical emergency",
      "Prepare dobutamine infusion for CI support before PEEP increase",
      "Administer furosemide per order to reduce PAOP (target <18)",
      "Caution team that increasing PEEP may reduce venous return and further drop CI — discuss risk/benefit",
      "Monitor PAOP trend with each diuresis response",
      "Prepare for urgent echocardiography — new/worsening MR in post-MI setting requires surgical consultation",
      "Document correction: PAOP 28 at PEEP 10; estimated transmural PAOP ~23",
    ],
  },

  practiceItems: [
    {
      stem: "A mechanically ventilated patient has bilateral pulmonary infiltrates, PAOP 14 mmHg, PaO2/FiO2 ratio of 160, and PEEP 8 cmH2O. The most likely diagnosis is:",
      choices: [
        "Cardiogenic pulmonary edema — bilateral infiltrates with elevated filling pressure",
        "ARDS (moderate) — PAOP ≤18, bilateral infiltrates, PF ratio <200",
        "Pulmonary hypertension — low PAOP indicates right heart etiology",
        "Hypovolemic shock — low PAOP indicates volume depletion",
      ],
      correct: 1,
      rationale:
        "ARDS Berlin criteria: bilateral infiltrates not fully explained by effusions/collapse/nodules, PF ratio <300 (moderate: 100–200), and respiratory failure not fully explained by heart failure (PAOP ≤18 or no clinical evidence of hydrostatic edema). This patient meets all three criteria. PAOP 14 rules out cardiogenic pulmonary edema as the primary cause. Treatment: lung-protective ventilation (6 mL/kg IBW), conservative fluid management, PEEP titration.",
      trapGuarded: "Treating ARDS as cardiogenic pulmonary edema based on infiltrate pattern alone — PAOP differentiates the two",
    },
    {
      stem: "During PAOP measurement, the nurse notices the waveform shows giant v waves significantly above the mean PAOP. The correct nursing action is:",
      choices: [
        "Record the peak of the v wave as the PAOP reading",
        "Increase the balloon inflation volume to achieve a better wedge",
        "Report giant v waves to the provider immediately — this may indicate acute mitral regurgitation",
        "Deflate the balloon and repeat after repositioning the patient",
      ],
      correct: 2,
      rationale:
        "Giant v waves on PAOP tracing indicate acute mitral regurgitation — blood regurgitating back into the left atrium during systole creates a large pressure spike. Post-MI papillary muscle rupture is a surgical emergency. The mean PAOP (not the peak of the v wave) is used as the filling pressure estimate, but giant v waves are a clinical alarm requiring immediate provider notification and urgent echocardiography.",
      trapGuarded: "Recording the peak of giant v waves as PAOP (overestimates filling pressure) or ignoring them entirely",
    },
  ],
};

// ─── Advanced Lesson 2 — SvO2/ScvO2 ─────────────────────────────────────────

const advLesson02: AdvancedHemodynamicsLesson = {
  id: "adv-svo2-scvo2",
  slug: "svo2-scvo2",
  number: 2,
  title: "SvO₂ and ScvO₂ — Oxygen Delivery and Consumption Balance",
  subtitle: "Mixed venous saturation, oxygen debt, delivery-consumption mismatch, and sepsis traps",
  level: "advanced",
  estimatedMinutes: 30,

  overview: {
    clinicalSignificance:
      "Mixed venous oxygen saturation (SvO2) is the single number that integrates the entire oxygen delivery system: cardiac output, hemoglobin, arterial saturation, and tissue extraction. A low SvO2 means tissues are consuming more oxygen than is being delivered — a state of oxygen debt that precedes clinical deterioration. A falsely high SvO2 in sepsis signals cellular utilization failure — one of the most dangerous traps in critical care. No other single hemodynamic variable captures the delivery-demand mismatch as directly.",
    commonSettings: ["PA catheter-equipped ICU (true SvO2 via mixed venous sample)", "central venous catheter (ScvO2 surrogate)", "septic shock resuscitation monitoring", "cardiogenic shock optimization", "post-cardiac surgery weaning from CPB"],
    keyQuestion: "Is oxygen delivery matching tissue demand, and are the tissues capable of extracting and using what is delivered?",
  },

  mechanism: {
    physiologicalBasis:
      "Fick Principle: VO2 = CO × (CaO2 − CvO2). Rearranging: SvO2 = SaO2 − (VO2 / CO × Hgb × 1.34 × 10). SvO2 reflects what is left in venous blood after tissues have extracted oxygen. Normal SvO2 70–75% means tissues are extracting ~25–30% of delivered oxygen (normal extraction ratio). When delivery falls or demand rises, tissues extract more → SvO2 falls (↑extraction ratio). Four determinants of SvO2: (1) Cardiac output (↓CO → ↓SvO2), (2) Hemoglobin (↓Hgb → ↓SvO2), (3) SaO2 (↓SaO2 → ↓SvO2), (4) Oxygen consumption/demand (↑VO2 → ↓SvO2). ScvO2 from the superior vena cava (via PICC or central line) is ~5–8% higher than true SvO2 because it does not include mixing with coronary venous blood (which has the highest extraction rate).",
    keyRelationships: [
      "Normal SvO2: 65–75%; ScvO2 ~5% higher → normal ScvO2: 70–80%",
      "SvO2 <65%: ↑O2 extraction = delivery failing relative to demand",
      "SvO2 <50%: severe oxygen debt; cells functioning anaerobically",
      "SvO2 >80% (in non-sepsis patient): ↓O2 demand (hypothermia, sedation) OR ↓extraction (cyanide, CO poisoning, sepsis cellular dysfunction)",
      "The four determinants: CO, Hgb, SaO2, VO2 — assess each when SvO2 is abnormal",
    ],
    whyItLooksLikeThis:
      "In septic shock, despite adequate CO and even high ScvO2, tissue hypoperfusion persists — this is the 'cytopathic hypoxia' of sepsis. Mitochondrial dysfunction and cytokine-mediated cellular metabolism failure mean that even oxygen-saturated blood returning to the heart does not reflect adequate cellular energy production. This is why rising lactate in sepsis with ScvO2 >80% is a paradox that must not be ignored — the cells are anaerobic even though venous blood appears well-saturated.",
  },

  normalRanges: [
    { parameter: "SvO2 (PA catheter mixed venous)", value: "65–75", unit: "%", clinicalNote: "True mixed venous O2 saturation; includes coronary sinus" },
    { parameter: "ScvO2 (central venous)", value: "70–80", unit: "%", clinicalNote: "Surrogate for SvO2; ~5% higher; use consistently in same patient" },
    { parameter: "Oxygen extraction ratio (OER)", value: "20–30", unit: "%", clinicalNote: "OER = (SaO2 − SvO2) ÷ SaO2; >50% = severe supply-demand mismatch" },
  ],

  abnormalPatterns: [
    {
      pattern: "SvO2/ScvO2 <65%",
      direction: "low",
      causes: ["low CO (cardiogenic shock)", "anemia (Hgb <7 without compensation)", "hypoxemia (SaO2 <90%)", "increased O2 demand (fever, shivering, seizure, pain, agitation)"],
      clinicalMeaning: "Oxygen delivery is inadequate for demand. Tissues compensating by extracting more. Identify and correct the culprit: improve CO (inotrope), transfuse if Hgb low, improve oxygenation, reduce metabolic demand.",
    },
    {
      pattern: "SvO2/ScvO2 >80% in actively deteriorating patient",
      direction: "high",
      causes: ["septic shock (mitochondrial failure — cells can't use O2)", "cyanide poisoning (cellular O2 utilization blocked)", "carbon monoxide poisoning (COHgb occupies Hgb)", "wedge position (sampling arterial side of pulmonary capillary)", "hypothermia"],
      clinicalMeaning: "Paradoxical high venous saturation despite active hypoperfusion. Do NOT use high ScvO2 to discontinue resuscitation. Assess lactate, clinical perfusion markers, and consider cellular utilization failure.",
    },
    {
      pattern: "ScvO2 falling progressively despite stable MAP and CO",
      direction: "low",
      causes: ["rising VO2 without matching DO2 (sepsis hypermetabolic phase)", "occult bleeding (↓Hgb)", "worsening ventilation with declining SaO2"],
      clinicalMeaning: "Early warning of deteriorating oxygen balance before hemodynamic collapse. Investigate all four determinants: CO, Hgb, SaO2, VO2. Trend is more important than single value.",
    },
  ],

  deepDive:
    "The SvO2 framework as a bedside diagnostic tool: When SvO2 is unexpectedly low, systematically assess each of the four determinants. (1) Is CO low? → Check for cardiogenic signs, obtain thermodilution CO. (2) Is Hgb adequate? → CBC; target ≥7–8 in critical illness (some cardiogenic shock protocols target ≥10). (3) Is SaO2 adequate? → SpO2/ABG; target >94%. (4) Is VO2 elevated? → Check for fever (treat antipyretic), shivering (warming blanket reduces VO2 20–30%), pain/agitation (sedation/analgesia), seizure. If all four are optimized and SvO2 remains low → oxygen debt is metabolic/cellular and requires intensivist-level management. A useful mnemonic: CO-HiGH (CO, Hemoglobin, oxyGenation, High demand).",

  nursingPriorities: [
    "Obtain SvO2/ScvO2 samples from the correct port: PA catheter distal (true SvO2) or CVC distal (ScvO2) — never from peripheral IV or PICC tip in a peripheral vein",
    "Send sample on ice to the lab promptly — delay allows continued O2 extraction in the syringe and falsely lowers the result",
    "When SvO2 <65%, systematically assess all four determinants: CO/CI, Hgb, SpO2/SaO2, VO2 sources (fever, shivering, pain)",
    "Never use a single high ScvO2 to declare resuscitation complete in septic shock — combine with lactate trend, clinical perfusion, and MAP",
    "Document ScvO2 with simultaneous SpO2, Hgb, HR, MAP, and any ongoing interventions (transfusion, vasopressor change)",
    "In cardiogenic shock: ScvO2 <65% after inotrope initiation suggests inotrope dose insufficient — report to provider with full CO/CI data",
    "Reduce VO2 sources proactively: antipyretics for fever >38.5°C, warming for shivering, adequate sedation/analgesia",
  ],

  troubleshooting: [
    { problem: "SvO2 value appears falsely high (>90%) from PA catheter", cause: "Catheter tip wedged (sampling pulmonary capillary arterial side) or sampling error from distal port during balloon inflation", action: "Confirm PA waveform (dicrotic notch present, not wedge); deflate balloon before sampling; ensure port not wedged" },
    { problem: "ScvO2 progressively declining despite unchanged MAP and CO", cause: "Occult blood loss (falling Hgb), fever increasing VO2, hypoventilation reducing SaO2", action: "Check Hgb stat; assess temperature; ABG for SaO2; reduce fever if present; alert provider" },
    { problem: "Wide discrepancy between ScvO2 and clinical picture (e.g., ScvO2 78% but lactate 6)", cause: "Septic cytopathic hypoxia — cellular utilization failure elevates ScvO2 despite anaerobic metabolism", action: "Report to intensivist; do not use ScvO2 to reassure when lactate is elevated; continue resuscitation targeting lactate clearance" },
  ],

  commonTraps: [
    "Using ScvO2 >70% to stop resuscitation in septic shock — ScvO2 may be falsely elevated due to mitochondrial dysfunction; always confirm with lactate clearance",
    "Not correcting for ScvO2 vs SvO2 difference — ScvO2 is ~5% higher than true SvO2; use the same measurement type consistently per patient",
    "Attributing low SvO2 to only one cause — always check all four determinants (CO, Hgb, SaO2, VO2) before treating",
    "Ignoring shivering as a cause of low ScvO2 — shivering increases VO2 by 40–100%; passive warming can rapidly improve ScvO2 without inotropes",
    "Sampling ScvO2 during rapid fluid infusion through the same central line lumen — dilution artifact falsely elevates the measured saturation",
  ],

  notThisBecause: [
    {
      mimicker: "Normal ScvO2 = tissue perfusion adequate",
      differentiator: "In sepsis, ScvO2 may be 80–85% while lactate is 6 and urine output is 12 mL/hr. This is cytopathic hypoxia — cells failing to extract and utilize oxygen. ScvO2 alone cannot confirm adequate tissue perfusion; use it in combination with lactate, UO, and clinical examination.",
    },
    {
      mimicker: "Low SvO2 always means give blood (transfuse Hgb)",
      differentiator: "Transfusion threshold in critical illness is Hgb <7 g/dL (or <8 in cardiogenic shock, active ischemia). If Hgb is 9 and SvO2 is low, the problem is CO or VO2 — not Hgb. Inappropriate transfusion causes TRALI, fluid overload, and immune suppression.",
    },
  ],

  caseApplication: {
    patientProfile: "44-year-old female, post-abdominal aortic aneurysm repair, day 1 ICU. Intubated.",
    vitals: "MAP 72 on NE 0.06 mcg/kg/min, HR 98, SpO2 97% on FiO2 40%, Temp 38.8°C (shivering).",
    hemodynamicData: "ScvO2 58%, CO 4.4 L/min, CI 2.4 L/min/m², Hgb 7.8 g/dL. Lactate 2.8 mmol/L.",
    clinicalContext: "Patient is shivering visibly. MAP and SpO2 acceptable. Team considering dobutamine for 'low ScvO2.'",
    question: "Systematically analyze the low ScvO2 using the four determinants. Is dobutamine the right intervention?",
    reasoning:
      "ScvO2 58% = oxygen demand exceeding delivery. Four determinants: (1) CO 4.4, CI 2.4 — borderline but not critically low; (2) Hgb 7.8 — low-normal, marginally contributes; (3) SpO2 97% — adequate; (4) VO2: patient is febrile (38.8°C) and shivering — shivering increases VO2 by 40–100%. The dominant cause is excessive VO2 from shivering and fever. Before adding dobutamine, treat the VO2 sources: warming blanket, antipyretic (acetaminophen). If ScvO2 improves to >70% after warming — problem solved without dobutamine. If ScvO2 remains low after VO2 reduction, then reconsider CO/CI support.",
    nursingActions: [
      "Apply active warming blanket immediately — shivering is the likely dominant cause of low ScvO2",
      "Administer acetaminophen per order for fever 38.8°C",
      "Reassess ScvO2 in 30 minutes after warming/antipyretic",
      "Delay dobutamine pending VO2 correction — CI 2.4 is low-normal but shivering is a correctable cause",
      "Consider small morphine or dexmedetomidine dose per order for shivering suppression if warming insufficient",
      "Trend lactate: if rising despite MAP 72, reassess CO more urgently",
      "Document ScvO2 58% with simultaneous Hgb, SpO2, temperature, and clinical context",
    ],
  },

  practiceItems: [
    {
      stem: "A septic shock patient has MAP 66, ScvO2 82%, lactate 5.1 mmol/L, and urine output 12 mL/hr. The nurse interprets the ScvO2 of 82% as:",
      choices: [
        "Adequate oxygen delivery — ScvO2 >70% means resuscitation targets are met",
        "Falsely reassuring — high ScvO2 in sepsis may reflect mitochondrial dysfunction, not adequate tissue perfusion",
        "Indicative of over-resuscitation — reduce IV fluids and vasopressor immediately",
        "Confirmatory of cardiogenic shock — high venous saturation indicates reduced oxygen extraction",
      ],
      correct: 1,
      rationale:
        "In septic shock, high ScvO2 can result from mitochondrial dysfunction (cytopathic hypoxia) — cells cannot extract and use oxygen even when it is delivered. A lactate of 5.1 and oliguria confirm ongoing hypoperfusion despite the 'reassuring' ScvO2. The nurse must not use ScvO2 alone to discontinue resuscitation. Lactate clearance and clinical perfusion markers are required alongside ScvO2.",
      trapGuarded: "Using high ScvO2 to stop resuscitation in sepsis when lactate remains elevated",
    },
    {
      stem: "A post-cardiac surgery patient's ScvO2 drops from 72% to 58% over 2 hours. Temperature is 38.9°C. Hgb 8.2 g/dL, SpO2 96%, CI 2.1 L/min/m². The most appropriate first intervention is:",
      choices: [
        "Transfuse 1 unit packed red blood cells to improve oxygen-carrying capacity",
        "Start dobutamine to increase cardiac output and DO2",
        "Administer acetaminophen and apply warming measures to reduce oxygen consumption",
        "Increase FiO2 to 60% to improve SaO2 and oxygen delivery",
      ],
      correct: 2,
      rationale:
        "The systematic assessment: SpO2 96% (adequate), Hgb 8.2 (low-normal, contributes modestly), CI 2.1 (borderline low). The most immediately reversible factor is VO2 — fever (38.9°C) increases metabolic demand by 10–15% per degree. Treating fever first is the correct first step. Transfusion threshold is Hgb <7 g/dL (8.2 does not meet criteria). Dobutamine may be needed if ScvO2 doesn't respond to VO2 reduction, but should not be the first intervention.",
      trapGuarded: "Jumping to transfusion or inotrope without first addressing elevated VO2 from fever",
    },
  ],
};

// ─── Advanced Lesson 3 — Vasopressor and Inotrope Reasoning ──────────────────

const advLesson03: AdvancedHemodynamicsLesson = {
  id: "adv-vasopressor-reasoning",
  slug: "vasopressor-reasoning",
  number: 3,
  title: "Vasopressor and Inotrope Selection Reasoning",
  subtitle: "Norepinephrine, vasopressin, dobutamine, milrinone, phenylephrine — when to add, switch, or combine",
  level: "mastery",
  estimatedMinutes: 40,

  overview: {
    clinicalSignificance:
      "Every vasoactive drug in the ICU works by targeting a specific receptor or pathway. Using the wrong drug — giving a vasopressor to a low-SVR patient who actually has a failing pump, or giving an inotrope to a vasoplegic patient — worsens the condition it was meant to treat. Mastery of vasoactive drug selection requires understanding not just what each drug does, but what hemodynamic problem it is solving: SVR too low, CO too low, or both.",
    commonSettings: ["refractory septic shock requiring multi-vasopressor support", "cardiogenic shock inotrope selection", "post-cardiac surgery vasoplegic syndrome", "neurogenic shock", "anaphylactic shock not responding to epinephrine alone"],
    keyQuestion: "Is the problem too little SVR (vasopressor), too little CO (inotrope), or both — and which drug best addresses this mechanism with acceptable side effects?",
  },

  mechanism: {
    physiologicalBasis:
      "Vasoactive drugs act on adrenergic receptors (α1, α2, β1, β2), dopaminergic receptors, vasopressin receptors (V1), or phosphodiesterase enzymes. α1 activation: vasoconstriction → ↑SVR → ↑MAP. β1 activation: ↑HR + ↑contractility → ↑CO. β2 activation: vasodilation + bronchodilation → ↓SVR. V1 activation: smooth muscle contraction independent of adrenergic system → ↑SVR (non-catecholamine mechanism). PDE-3 inhibition (milrinone): ↑cAMP → ↑contractility + vasodilation (inodilator).",
    keyRelationships: [
      "Norepinephrine: α1 >> β1 — powerful vasopressor, modest inotropy, minimal tachycardia — first-line septic shock",
      "Vasopressin: V1 — pure vasoconstriction, no adrenergic — additive to NE, spares catecholamine receptors",
      "Phenylephrine: pure α1 — vasopressor with no inotropy; avoid in low CO states; useful in neurogenic, NE contraindicated",
      "Epinephrine: α1 + α2 + β1 + β2 — powerful vasopressor + inotrope; first-line anaphylaxis; second-line septic shock",
      "Dobutamine: β1 >> β2 — inotrope + mild vasodilator; increases CO; may ↓MAP if SVR falls further",
      "Milrinone: PDE-3 inhibitor — inodilator; ↑CO + ↓SVR + ↓PAOP; avoid in hypotension; preferred in β-blocked patients",
      "Dopamine: D1 + β1 + α1 (dose-dependent) — more arrhythmias than NE; not recommended as first-line in septic shock (SOAP-II trial)",
    ],
    whyItLooksLikeThis:
      "The adrenergic system evolved for 'fight or flight': epinephrine floods from the adrenal medulla, producing maximal vasopressor + inotrope + bronchodilator + metabolic effects simultaneously. In prolonged critical illness, adrenergic receptors downregulate (receptor fatigue), catecholamine stores deplete, and relative vasopressin deficiency develops — explaining why vasopressin rescue works when NE doses escalate beyond 0.25 mcg/kg/min. The non-adrenergic V1 pathway bypasses depleted receptors.",
  },

  normalRanges: [
    { parameter: "NE starting dose", value: "0.01–0.05", unit: "mcg/kg/min", clinicalNote: "Titrate to MAP ≥65; add vasopressin when >0.25–0.4 mcg/kg/min" },
    { parameter: "Vasopressin dose (fixed)", value: "0.03–0.04", unit: "units/min", clinicalNote: "Not titrated — fixed at 0.03 units/min; higher doses cause coronary/mesenteric ischemia" },
    { parameter: "Dobutamine dose range", value: "2.5–20", unit: "mcg/kg/min", clinicalNote: "Start low; titrate by 2.5 q30 min; monitor HR (arrhythmia risk >10 mcg/kg/min)" },
    { parameter: "Phenylephrine dose range", value: "0.4–9.1", unit: "mcg/kg/min", clinicalNote: "Pure α1; avoid in low CO — ↑SVR worsens cardiac work without improving output" },
    { parameter: "Milrinone dose range", value: "0.25–0.75", unit: "mcg/kg/min", clinicalNote: "Loading dose optional; avoid in hypotension — vasodilation may drop MAP acutely" },
  ],

  abnormalPatterns: [
    {
      pattern: "Escalating NE with diminishing MAP response",
      direction: "abnormal",
      causes: ["catecholamine receptor desensitization", "relative vasopressin deficiency", "adrenal insufficiency", "unresolved septic source", "new cardiac depression"],
      clinicalMeaning: "Refractory septic shock. Add vasopressin 0.03 units/min. Consider hydrocortisone 200 mg/day (ADRENAL/APROCCHSS evidence). Reassess CO/CI for new cardiomyopathy.",
    },
    {
      pattern: "Dobutamine causing tachycardia with MAP drop",
      direction: "abnormal",
      causes: ["β2-mediated vasodilation reducing SVR below what dobutamine-driven CO can support", "high-dose dobutamine in volume-depleted patient"],
      clinicalMeaning: "Add NE to restore MAP; do not stop dobutamine (still needed for CO). Ensure adequate preload. If tachycardia threatens diastolic filling, consider dose reduction.",
    },
    {
      pattern: "Milrinone causing acute hypotension",
      direction: "low",
      causes: ["vasodilatory effect reducing SVR in already low-MAP patient", "rapid bolus loading dose effect", "no adequate vasopressor cover"],
      clinicalMeaning: "Milrinone is an inodilator — it vasodilates while improving CO. Must have MAP ≥65 before starting, or concurrent vasopressor must be ready. Preferred over dobutamine when patient has β-blockade (NE-bypassing inotropic pathway).",
    },
  ],

  deepDive:
    "Drug selection algorithm in practice:\n\n**Step 1: What is the primary hemodynamic failure?**\n- Low MAP + low SVR + high/normal CO (distributive) → Vasopressor (NE first)\n- Low MAP + low SVR + low CO (combined) → NE + dobutamine\n- Low MAP + high SVR + low CO (cardiogenic) → Dobutamine ± NE for MAP floor\n- Low MAP + normal SVR + neurogenic (spinal cord) → NE or phenylephrine\n\n**Step 2: Which vasopressor fits?**\n- First-line septic shock: NE\n- Add vasopressin when NE >0.25–0.4 mcg/kg/min\n- Anaphylaxis: IM epinephrine first (0.3–0.5 mg); IV NE/epinephrine if refractory\n- Neurogenic shock: NE or phenylephrine (phenylephrine preferred if bradycardia must be preserved)\n- Vasoplegic post-cardiac surgery: methylene blue if refractory to NE + vasopressin\n\n**Step 3: Which inotrope fits?**\n- First-line cardiogenic shock: dobutamine (β1, modest vasodilation)\n- β-blocked patient not responding to dobutamine: milrinone (bypasses β receptor)\n- Sepsis with new cardiomyopathy: dobutamine (add to NE)\n- Acute decompensated HF with MAP ≥65: milrinone or dobutamine depending on HR/arrhythmia risk",

  nursingPriorities: [
    "Know the receptor profile of every infusing vasoactive drug — anticipate the expected hemodynamic effect and watch for side effects",
    "Never abruptly discontinue vasopressors — titrate down by 10–20% increments with hemodynamic reassessment between each reduction",
    "Phenylephrine: never use as the only vasopressor when CO is low — increases SVR without improving output, worsening cardiac work",
    "Vasopressin is a fixed dose (0.03–0.04 units/min), not a titrated drug — do not escalate above 0.04; coronary and mesenteric ischemia risk",
    "Dobutamine side effects to monitor: tachycardia (↑HR >20 bpm from baseline = dose-limiting), ventricular arrhythmias (especially >10 mcg/kg/min), hypotension if MAP-dependent on high SVR",
    "Milrinone: requires MAP ≥65 before initiation; avoid in renal failure (renally cleared — titrate carefully)",
    "Epinephrine in anaphylaxis: IM preferred over IV (safer, more reliable absorption); IV only in cardiovascular collapse",
    "Document vasopressor/inotrope doses in mcg/kg/min (not mL/hr alone) with weight and MAP response at every dose change",
  ],

  troubleshooting: [
    { problem: "MAP not responding to escalating NE in septic shock", cause: "Vasopressin depletion, adrenal insufficiency, uncontrolled source, new cardiomyopathy", action: "Add vasopressin 0.03 units/min; consider hydrocortisone 200 mg/day; ensure cultures/antibiotics/source control; assess CO/CI for cardiomyopathy" },
    { problem: "Dobutamine causing dangerous tachycardia (HR >130)", cause: "High dose β1 stimulation, underlying atrial fibrillation triggered, hypovolemia", action: "Reduce dobutamine dose; assess volume status; consider milrinone if β-blockade is a factor; 12-lead ECG for new AF" },
    { problem: "Milrinone infusion causes MAP to drop from 68 to 54", cause: "Vasodilatory effect of milrinone (β2-like) reducing SVR without equivalent CO increase to maintain MAP", action: "Start NE if not already running; do not stop milrinone if CO was improving — add vasopressor to maintain MAP floor" },
  ],

  commonTraps: [
    "Using dopamine over NE as first-line in septic shock — SOAP-II RCT: dopamine has significantly higher arrhythmia rate and trend toward increased mortality. NE is first-line.",
    "Titrating vasopressin dose — vasopressin is a fixed-dose adjunct, not a titrated vasopressor; doses >0.04 units/min cause ischemic complications",
    "Using phenylephrine in cardiogenic shock for MAP support — pure α1 without β1 raises SVR against an already failing ventricle, worsening CO further",
    "Interpreting tachycardia from dobutamine as a sign to escalate — tachycardia is a known side effect, not an indication for dose increase; it may indicate dobutamine-triggered AF",
    "Stopping NE cold to 'wean vasopressors' — abrupt discontinuation causes rebound hemodynamic instability; always taper in 10–20% decrements",
  ],

  notThisBecause: [
    {
      mimicker: "Escalating NE will always solve hypotension",
      differentiator: "When CO is low (cardiogenic component), escalating NE increases SVR further, worsening afterload on the failing heart and potentially reducing CO. The solution is combined NE (MAP floor) + dobutamine (CO support), not NE escalation alone.",
    },
    {
      mimicker: "Dobutamine is an inotrope so it always improves BP",
      differentiator: "Dobutamine also has mild β2 vasodilatory effects — it may lower MAP even as CO improves. In a patient whose MAP depends on high SVR (cardiogenic shock), initiating dobutamine without vasopressor backup can precipitously drop MAP.",
    },
  ],

  caseApplication: {
    patientProfile: "55-year-old male, 48-hour septic shock from bowel perforation. S/P exploratory laparotomy, ICU day 2.",
    vitals: "MAP 58 on NE 0.38 mcg/kg/min. HR 102, SpO2 94% on FiO2 50% PEEP 8, Temp 37.2°C (post-cooling).",
    hemodynamicData: "CO 3.8 L/min, CI 1.9 L/min/m², SVR 890, ScvO2 61%. CVP 10. Lactate 3.8 mmol/L (was 5.1 at 24h).",
    clinicalContext: "On NE 0.38 mcg/kg/min for 36 hours. Septic source controlled. Antibiotics appropriate. Mild echocardiographic RV dilation, LV hyperdynamic. Urine output 22 mL/hr.",
    question: "What vasopressor/inotrope changes are indicated? Justify each decision.",
    reasoning:
      "Three problems: (1) MAP 58 despite NE 0.38 — refractory septic shock, high NE dose, add vasopressin 0.03 units/min; (2) CI 1.9 (<2.2) — septic cardiomyopathy (late septic cardiac depression); add dobutamine 2.5 mcg/kg/min for CO support; (3) ScvO2 61% — confirms delivery-demand mismatch, supports both interventions. Source controlled, antibiotics correct, so refractory vasoplegia is the mechanism. Lactate improving (5.1→3.8) — trend is positive but still elevated. RV dilation on echo: avoid excessive fluid, be cautious with dobutamine dose (may worsen tachycardia and RV filling).",
    nursingActions: [
      "Prepare vasopressin 0.03 units/min per anticipated order — report NE 0.38 to intensivist",
      "Prepare dobutamine 2.5 mcg/kg/min per anticipated order — CI 1.9 with ScvO2 61% supports initiation",
      "Monitor HR closely with dobutamine — RV dilation; tachycardia worsens RV filling; alert if HR >115",
      "Reassess ScvO2 and lactate in 2 hours after vasopressin and dobutamine started",
      "Do NOT give IV fluid bolus — CVP 10, CO adequate, adding fluids risks RV volume overload",
      "Continue NE at current dose while vasopressin takes effect (20–30 min to full vasoconstrictor effect)",
      "Document all dose changes with time and MAP/HR response",
    ],
  },

  practiceItems: [
    {
      stem: "A patient in septic shock has MAP 54 on norepinephrine 0.32 mcg/kg/min. The intensivist adds vasopressin 0.03 units/min. The nurse asks whether to increase the vasopressin dose if MAP is still low in 30 minutes. The correct answer is:",
      choices: [
        "Yes — titrate vasopressin to MAP ≥65 as with norepinephrine",
        "No — vasopressin is a fixed-dose adjunct; escalate norepinephrine or add a third agent instead",
        "Yes — increase vasopressin to 0.08 units/min if MAP <65",
        "No — reduce norepinephrine first to avoid receptor competition",
      ],
      correct: 1,
      rationale:
        "Vasopressin is a fixed-dose adjunct, not a titrated vasopressor. The standard dose is 0.03–0.04 units/min and is not increased based on MAP response. Doses >0.04 units/min are associated with mesenteric and coronary ischemia. If MAP remains inadequate, escalate norepinephrine further or add epinephrine — do not increase vasopressin beyond 0.04 units/min.",
      trapGuarded: "Titrating vasopressin dose as a standard vasopressor — it is a fixed adjunct",
    },
    {
      stem: "A cardiogenic shock patient requires MAP support. CI is 1.7 L/min/m², PAOP 22. The provider asks for a vasopressor. The nurse questions an order for phenylephrine. The nurse's concern is:",
      choices: [
        "Phenylephrine causes tachycardia that will worsen myocardial oxygen demand",
        "Phenylephrine is a pure α1 vasopressor — it increases SVR without improving CO, worsening afterload on the failing heart",
        "Phenylephrine is contraindicated in all ICU patients due to reflex bradycardia risk",
        "Phenylephrine will lower PAOP by redistributing blood volume to the extremities",
      ],
      correct: 1,
      rationale:
        "Phenylephrine is a pure α1 agonist — it raises SVR (afterload) without any β1-mediated inotropy. In cardiogenic shock where the ventricle is already struggling against high SVR (1600–2000 dynes·s/cm⁵), adding more afterload via phenylephrine further reduces CO. Norepinephrine is preferred because its modest β1 effect provides some inotropy alongside the α1 vasopressor effect. Phenylephrine's role is in neurogenic shock and SVT-associated hypotension (where avoiding tachycardia is important).",
      trapGuarded: "Using phenylephrine in cardiogenic shock — worsens the failing heart's afterload without improving contractility",
    },
  ],
};

// ─── Advanced Lesson 4 — Fluid Responsiveness ────────────────────────────────

const advLesson04: AdvancedHemodynamicsLesson = {
  id: "adv-fluid-responsiveness",
  slug: "fluid-responsiveness",
  number: 4,
  title: "Fluid Responsiveness — Dynamic Predictors",
  subtitle: "PLR, SVV, PPV, IVC collapsibility — evidence-based assessment beyond static CVP",
  level: "mastery",
  estimatedMinutes: 35,

  overview: {
    clinicalSignificance:
      "Only 50% of hemodynamically unstable ICU patients actually respond to a fluid bolus with a significant increase in cardiac output. Giving 500 mL to a non-responder causes fluid overload, pulmonary congestion, tissue edema, organ dysfunction, and extended ICU stay — with zero hemodynamic benefit. Static measures (CVP, PAOP) cannot predict fluid responsiveness. Dynamic measures — tests that transiently change preload and measure the CO response — are the only valid tools. Every nurse caring for critical patients must understand these tests and their limitations.",
    commonSettings: ["septic shock resuscitation", "post-operative fluid management", "cardiogenic shock with dry-cold variant", "trauma resuscitation", "weaning from vasopressors"],
    keyQuestion: "If I give this patient 500 mL of fluid, will their cardiac output increase meaningfully — and how do I know before I give it?",
  },

  mechanism: {
    physiologicalBasis:
      "Fluid responsiveness is a preload reserve concept from the Frank-Starling curve. On the rising limb: adding preload → increased SV/CO (fluid responsive). On the flat/descending limb: adding preload → no change or ↓CO (not fluid responsive). Dynamic tests work by transiently altering venous return (preload) and measuring the CO response — without permanently giving 500 mL. The key insight: in mechanically ventilated patients, each positive-pressure breath transiently reduces venous return during inspiration and restores it during expiration, creating a cyclic preload variation. A large cyclic variation in SV, PP, or CO implies the patient is on the steep part of the Frank-Starling curve (preload-dependent).",
    keyRelationships: [
      "PLR (Passive Leg Raise): raises legs 45° → auto-infusion ~300 mL → functional preload challenge; measure CO response",
      "SVV (Stroke Volume Variation): >13% in fully sedated, sinus rhythm, VT 8 mL/kg = fluid responsive",
      "PPV (Pulse Pressure Variation): >13% same conditions as SVV = fluid responsive",
      "IVC collapsibility index (spontaneous breathing): >50% = fluid responsive; <15% = not responsive",
      "IVC distensibility index (positive pressure ventilation): >18% = fluid responsive",
      "PLR responder: CO increase ≥10–15% = fluid responsive",
    ],
    whyItLooksLikeThis:
      "PLR is the most versatile test because it works in spontaneously breathing patients, atrial fibrillation, and low tidal volume ventilation — all conditions that invalidate SVV/PPV. The auto-infusion is completely reversible when legs are lowered — unlike actually giving 500 mL. The test requires a real-time CO measurement device (PA catheter thermodilution, arterial pulse contour analysis, bioreactance, or end-tidal CO2) to detect the CO change — you cannot assess PLR response by BP or HR alone.",
  },

  normalRanges: [
    { parameter: "PPV (fluid responsive threshold)", value: ">13", unit: "%", clinicalNote: "Valid ONLY in fully sedated, sinus rhythm, ≥8 mL/kg VT, no arrhythmia" },
    { parameter: "SVV (fluid responsive threshold)", value: ">13", unit: "%", clinicalNote: "Same strict validity conditions as PPV" },
    { parameter: "IVC collapsibility (spontaneous breathing)", value: ">50", unit: "%", clinicalNote: "Measured on M-mode echo; highly operator-dependent" },
    { parameter: "PLR CO response (positive threshold)", value: "≥10–15", unit: "% increase", clinicalNote: "Most versatile test; requires real-time CO monitoring" },
  ],

  abnormalPatterns: [
    {
      pattern: "PPV >13% in mechanically ventilated patient with sinus rhythm",
      direction: "high",
      causes: ["preload-dependent state (hypovolemia, inadequate resuscitation)"],
      clinicalMeaning: "Patient is on steep Frank-Starling curve — a fluid bolus will likely increase CO. Administer fluid challenge per order and reassess.",
    },
    {
      pattern: "PPV >13% in spontaneously breathing or low-VT ventilated patient",
      direction: "abnormal",
      causes: ["artifact — test is not valid in these conditions"],
      clinicalMeaning: "PPV/SVV are not interpretable without full mechanical ventilation at ≥8 mL/kg and no spontaneous efforts. A positive result in invalid conditions should not guide fluid administration.",
    },
    {
      pattern: "Positive PLR (≥10% CO increase) in AF patient where SVV/PPV are invalid",
      direction: "high",
      causes: ["preload reserve despite arrhythmia"],
      clinicalMeaning: "PLR is the only valid dynamic test in AF. A positive PLR in AF = give fluid challenge (per order). A negative PLR in AF = fluid will not improve CO; seek another intervention.",
    },
  ],

  deepDive:
    "Validity conditions — the single most important concept for PPV/SVV interpretation:\n\n**Required ALL at once for PPV/SVV to be valid:**\n1. Fully controlled mechanical ventilation (no spontaneous breathing efforts)\n2. Tidal volume ≥8 mL/kg IBW (lung-protective 6 mL/kg VT invalidates SVV/PPV)\n3. Sinus rhythm (AF, PVCs, SVT create variable pulse pressures unrelated to preload)\n4. Heart rate:respiratory rate ratio >3.6 (very rapid RR relative to HR creates overlap)\n5. No right heart failure (RV dysfunction creates independent PP variation)\n\n**If ANY condition is violated → use PLR instead.**\n\nPLR validity conditions (much more permissive):\n- Requires real-time CO monitoring (not just BP or HR)\n- Not valid if intra-abdominal hypertension (legs up doesn't shift volume effectively)\n- Not valid if head elevation is contraindicated (must start from semi-recumbent)\n- Requires truly passive positioning — if patient resists or contracts muscles, the test is invalid\n\n**Pitfall: 'Mini-fluid challenge'**: 100 mL over 1 minute with pulse contour CO monitoring is emerging as an alternative when PLR is contraindicated and PPV/SVV are invalid.",

  nursingPriorities: [
    "Before relying on PPV/SVV: verify ALL validity conditions (controlled ventilation, VT ≥8 mL/kg, sinus rhythm, no spontaneous efforts)",
    "PLR technique: start from 45° head elevation; lay flat and raise legs to 45°; measure CO change at 60–90 seconds; return to starting position within 3 minutes",
    "Report PLR result as CO change, not BP change — BP may not reflect CO change accurately",
    "Document fluid responsiveness assessment with method used, validity conditions confirmed, result, and fluid decision",
    "Recognize that a positive fluid responsiveness test is not an automatic order to give fluid — it tells you the CO will increase; the decision to bolus still requires clinical judgment and provider order",
    "Reassess after every fluid bolus — responsiveness changes as the patient moves along the Frank-Starling curve",
    "In AF: use PLR only; document 'PPV/SVV not valid — atrial fibrillation' in nursing notes",
  ],

  troubleshooting: [
    { problem: "PPV 16% in patient with ARDS on 6 mL/kg VT", cause: "Low tidal volume invalidates PPV — the cyclic preload change is insufficient to drive a measurable variation", action: "Do not interpret PPV. Perform PLR test if no contraindication. Document 'PPV not valid — low VT ARDS protocol'" },
    { problem: "PLR test performed but CO unavailable for measurement", cause: "No arterial line or CO monitor connected", action: "PLR requires real-time CO monitoring; BP or HR changes alone are insufficient. Discuss with provider for CO monitoring device before performing PLR" },
    { problem: "IVC collapsibility 60% on echo but patient already received 3L fluid", cause: "IVC collapsibility is highly sensitive to recent fluid administration and positioning changes", action: "Report result in context of recent fluid load; IVC assessment should be performed before fluid administration for best predictive value" },
  ],

  commonTraps: [
    "Using PPV/SVV in atrial fibrillation — variable RR intervals create pseudo-variation in pulse pressure unrelated to preload; always use PLR in AF",
    "Using PPV in ARDS patients on 6 mL/kg VT — the tidal volume is too small to create valid cyclic preload variation; low VT = invalid PPV/SVV",
    "Interpreting MAP increase during PLR as a positive test — MAP can rise due to SVR increase from leg compression (β-activation), not preload improvement; CO must be measured",
    "Stopping the PLR measurement after 30 seconds — the hemodynamic effect of PLR peaks at 60–90 seconds; measurements at 30 seconds may miss the maximal response",
    "Considering a negative fluid responsiveness test as proof the patient needs no intervention — it means fluids won't help CO; the patient may still need vasopressors, inotropes, or other interventions",
  ],

  notThisBecause: [
    {
      mimicker: "CVP 4 = fluid responsive; CVP 14 = not fluid responsive",
      differentiator: "The 2013 CHEST meta-analysis showed CVP has essentially zero ability to predict fluid responsiveness (AUC ~0.56 — no better than a coin flip). CVP is a static pressure measure; dynamic tests measure the actual CO response to a preload challenge. Never use CVP alone to guide fluid decisions in critically ill patients.",
    },
    {
      mimicker: "A positive PLR means the nurse should immediately give 500 mL",
      differentiator: "Fluid responsiveness testing tells you what WILL happen if you give fluid. The decision to actually administer fluid requires a clinical indication, provider order, and judgment about safety (e.g., pulmonary edema risk, kidney function). The test is a decision support tool, not an automatic action trigger.",
    },
  ],

  caseApplication: {
    patientProfile: "66-year-old female, septic shock, intubated 12 hours. Prone positioning just completed, now supine again.",
    vitals: "MAP 62 on NE 0.14 mcg/kg/min, HR 88 sinus, RR controlled at 20, VT 480 mL (6.5 mL/kg IBW), PEEP 10.",
    hemodynamicData: "PPV displays as 18% on the arterial line monitor. CO 4.8 L/min via pulse contour, CI 2.8 L/min/m².",
    clinicalContext: "ICU team asks the nurse whether to give a 500 mL fluid challenge based on PPV 18%. Patient just repositioned from prone. Urine output 32 mL/hr. Lactate 1.8 mmol/L.",
    question: "Is PPV 18% valid in this patient? Justify your assessment of validity before answering the fluid question.",
    reasoning:
      "PPV validity check: (1) Fully controlled ventilation ✓ (no spontaneous efforts documented); (2) Tidal volume 480 mL at 6.5 mL/kg IBW — this is ARDS-range lung-protective ventilation (<8 mL/kg), which INVALIDATES PPV/SVV. (3) Sinus rhythm ✓. The VT being only 6.5 mL/kg is the critical violation — the cyclic preload change is too small to reliably generate a meaningful pulse pressure variation. PPV 18% in this patient is NOT interpretable. Correct next step: perform PLR test if no contraindication (recent prone session is not a contraindication; prone positioning itself is). Document 'PPV not valid — VT <8 mL/kg.'",
    nursingActions: [
      "Do NOT administer fluid bolus based on PPV 18% — VT 6.5 mL/kg invalidates the measurement",
      "Perform PLR test: start from 30° head elevation, lower to flat and raise legs 45° for 90 seconds",
      "Measure CO change during PLR using pulse contour monitor",
      "Report PLR result to intensivist with validity assessment",
      "Document: 'PPV 18% not valid — VT 6.5 mL/kg IBW (ARDS protocol). PLR performed instead.'",
      "If PLR positive (CO ↑≥10%): report to provider for fluid order decision",
      "If PLR negative: report to provider — vasopressor titration may be more appropriate than fluids",
    ],
  },

  practiceItems: [
    {
      stem: "A patient is mechanically ventilated with VT 420 mL (5.8 mL/kg IBW), sinus rhythm, no spontaneous efforts. The arterial line monitor shows PPV of 19%. The nurse correctly interprets this as:",
      choices: [
        "Fluid responsive — PPV >13% indicates the patient will respond to a fluid bolus",
        "Invalid — tidal volume below 8 mL/kg IBW invalidates PPV as a fluid responsiveness predictor",
        "Underdamped artifact — high PPV reflects arterial line setup error, not preload",
        "Fluid overloaded — PPV >13% in low-VT patients indicates volume excess",
      ],
      correct: 1,
      rationale:
        "PPV and SVV require tidal volume ≥8 mL/kg IBW for valid interpretation. At 5.8 mL/kg IBW (lung-protective ARDS ventilation), the cyclic preload change from each breath is insufficient to generate reliable SVV/PPV variation. A PPV of 19% in this context does not predict fluid responsiveness. The correct test is PLR with real-time CO monitoring.",
      trapGuarded: "Interpreting PPV/SVV without verifying the tidal volume validity condition",
    },
    {
      stem: "A passive leg raise test is performed on a septic patient on vasopressors. MAP increases from 62 to 72 mmHg during PLR. The nurse reports this as a positive PLR. The physician questions the result. Why?",
      choices: [
        "PLR is only valid in patients without vasopressor infusions",
        "MAP increase alone is not sufficient — PLR requires CO or stroke volume measurement to confirm fluid responsiveness",
        "The MAP increase of 10 mmHg is below the 15 mmHg required threshold for a positive PLR",
        "PLR results are only valid for 5 minutes before the legs must be returned",
      ],
      correct: 1,
      rationale:
        "MAP can increase during PLR for reasons other than increased CO — notably, mechanical compression of the legs can activate baroreflexes or redirect blood that increases SVR rather than CO. A positive PLR requires a CO or SV increase ≥10–15%, measured by a real-time CO monitoring device (pulse contour analysis, thermodilution, bioreactance). MAP change alone is insufficient and can lead to inappropriate fluid administration.",
      trapGuarded: "Using MAP increase as the PLR response measure — only CO/SV changes validate PLR",
    },
  ],
};

// ─── Curriculum exports ───────────────────────────────────────────────────────

export const ADVANCED_HEMODYNAMICS_LESSONS: readonly AdvancedHemodynamicsLesson[] = [
  advLesson01,
  advLesson02,
  advLesson03,
  advLesson04,
];

export const ADVANCED_HEMODYNAMICS_LESSON_INDEX = ADVANCED_HEMODYNAMICS_LESSONS.map(
  ({ id, slug, number, title, subtitle, level, estimatedMinutes }) => ({
    id, slug, number, title, subtitle, level, estimatedMinutes,
  }),
);

export function getAdvancedHemodynamicsLessonBySlug(
  slug: string,
): AdvancedHemodynamicsLesson | undefined {
  return ADVANCED_HEMODYNAMICS_LESSONS.find((l) => l.slug === slug);
}
