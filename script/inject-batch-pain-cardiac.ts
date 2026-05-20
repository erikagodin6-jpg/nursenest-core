import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "acute-vs-chronic-pain-rpn": {
    title: "Acute vs Chronic Pain: Assessment and Management for Practical Nurses",
    cellular: {
      title: "Nociception Pathway and Gate Control Theory of Pain",
      content: "Pain is a complex sensory and emotional experience that serves as the body's protective warning system. The nociception pathway involves four distinct phases: transduction, transmission, perception, and modulation. Transduction occurs when noxious stimuli (thermal, mechanical, or chemical) activate specialized peripheral nerve endings called nociceptors, converting the stimulus into electrical nerve impulses. These nociceptors are free nerve endings found in skin, viscera, muscles, joints, and arterial walls. Two primary types of nerve fibers transmit pain signals: A-delta fibers are myelinated, fast-conducting fibers that transmit sharp, well-localized acute pain; C fibers are unmyelinated, slow-conducting fibers that transmit dull, aching, diffuse, and chronic pain. During transmission, the electrical impulse travels from the peripheral nociceptor along the afferent nerve fiber to the dorsal horn of the spinal cord, then ascends via the spinothalamic tract to the thalamus and cerebral cortex. Perception occurs when the cortex processes the signal and the individual becomes consciously aware of pain. Modulation involves descending inhibitory pathways from the brainstem that release endogenous opioids (endorphins, enkephalins, and dynorphins) to suppress pain transmission at the spinal cord level. The Gate Control Theory, proposed by Melzack and Wall in 1965, explains that a neural gate mechanism in the substantia gelatinosa of the dorsal horn can modulate pain signal transmission. Large-diameter A-beta fibers (touch, pressure, vibration) can close the gate by inhibiting transmission of pain signals from small-diameter C fibers and A-delta fibers. This explains why rubbing an injured area reduces pain perception. Acute pain is a sudden onset, time-limited protective response typically lasting less than 3 to 6 months, directly associated with tissue injury, surgery, or disease. It serves a biological warning function and generally resolves as the underlying cause heals. Chronic pain persists beyond the expected healing time (generally greater than 3 to 6 months) and involves neuroplastic changes in the central nervous system. In chronic pain, peripheral and central sensitization occur: nociceptors develop a lowered threshold for activation (peripheral sensitization), and dorsal horn neurons become hyperexcitable (central sensitization or wind-up phenomenon). This means the nervous system itself changes, amplifying pain signals even when the original tissue injury has resolved. Chronic pain is now understood as a disease state in itself, involving structural and functional changes in the brain including alterations in gray matter density, neural connectivity, and neurotransmitter levels. The practical nurse plays a critical role in pain assessment using validated tools, administering prescribed analgesics, implementing non-pharmacological interventions, and monitoring patient response. Pain is considered the fifth vital sign, and the patient's self-report is the most reliable indicator of pain intensity."
    },
    riskFactors: [
      "Previous history of chronic pain conditions (fibromyalgia, complex regional pain syndrome, chronic low back pain)",
      "Major surgical procedures or traumatic injury (risk for acute-to-chronic pain transition)",
      "Psychological comorbidities including depression, anxiety, and post-traumatic stress disorder",
      "Substance use history including opioid use disorder (altered pain perception and tolerance)",
      "Advanced age (altered pharmacokinetics, polypharmacy, underreported pain due to cognitive changes)",
      "Obesity and sedentary lifestyle (musculoskeletal strain, inflammatory mediator elevation)",
      "Genetic predisposition (variations in catechol-O-methyltransferase gene affect pain sensitivity)"
    ],
    diagnostics: [
      "Numeric Rating Scale (NRS 0-10): most widely used unidimensional pain scale; validated for acute and chronic pain; 0 means no pain, 10 means worst possible pain",
      "Wong-Baker FACES Pain Rating Scale: uses facial expressions to rate pain from 0 to 10; validated for children aged 3 and older and adults with communication barriers",
      "FLACC Scale (Face, Legs, Activity, Cry, Consolability): behavioral pain assessment tool for nonverbal patients including infants, young children, and cognitively impaired adults; scored 0-10",
      "Brief Pain Inventory (BPI): multidimensional tool assessing pain severity and interference with daily function; useful for chronic pain evaluation",
      "Serum inflammatory markers: C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR) may be elevated in inflammatory pain conditions",
      "Imaging studies: X-ray, CT, or MRI to identify structural causes of pain including fractures, disc herniation, or malignancy"
    ],
    management: [
      "WHO Pain Ladder Step 1: non-opioid analgesics (acetaminophen, NSAIDs) for mild pain (NRS 1-3); appropriate as monotherapy or as adjuncts at all steps",
      "WHO Pain Ladder Step 2: weak opioids (codeine, tramadol) combined with non-opioid analgesics for moderate pain (NRS 4-6)",
      "WHO Pain Ladder Step 3: strong opioids (morphine, hydromorphone, fentanyl) with or without non-opioid adjuvants for severe pain (NRS 7-10)",
      "Multimodal analgesia approach: combine medications from different classes (opioids, NSAIDs, acetaminophen, adjuvants) to target different points in the pain pathway, reduce total opioid requirements, and minimize side effects",
      "Non-pharmacological interventions: positioning, ice/heat application, massage, relaxation techniques, guided imagery, distraction, TENS unit, music therapy",
      "Chronic pain management: scheduled (around-the-clock) dosing rather than PRN; consider adjuvant analgesics (gabapentin, duloxetine, amitriptyline); referral to pain management specialist",
      "Patient-controlled analgesia (PCA): allows patient to self-administer predetermined IV opioid doses; monitor respiratory rate, sedation level, and pain scores regularly"
    ],
    nursingActions: [
      "Assess pain using the PQRST format: Provocation/Palliation (what makes it worse/better), Quality (sharp, dull, burning, aching), Region/Radiation (location and spread), Severity (0-10 scale), Timing (onset, duration, frequency, pattern)",
      "Reassess pain after intervention: 30 minutes after IV medication, 60 minutes after oral medication; document both pre- and post-intervention pain scores",
      "Administer analgesics on schedule for chronic pain (around-the-clock dosing) rather than waiting for pain to become severe; PRN dosing is appropriate for breakthrough pain",
      "Monitor for opioid adverse effects: respiratory depression (rate below 12), excessive sedation (Pasero Opioid-Induced Sedation Scale), constipation, nausea, pruritus, urinary retention",
      "Implement fall precautions for patients receiving opioids or other sedating analgesics",
      "Report uncontrolled pain (NRS consistently above 4 despite intervention) to the registered nurse or physician for medication adjustment",
      "Document pain assessment findings including location, characteristics, intensity, aggravating and alleviating factors, and patient's functional status"
    ],
    assessmentFindings: [
      "Acute pain findings: elevated heart rate, elevated blood pressure, diaphoresis, pallor, dilated pupils, muscle tension, guarding, splinting, facial grimacing, moaning, restlessness",
      "Chronic pain findings: fatigue, sleep disturbances, appetite changes, decreased activity level, social withdrawal, depression, irritability; vital signs may be NORMAL due to physiologic adaptation",
      "Behavioral indicators in nonverbal patients: facial grimacing, frowning, clenched teeth, guarding, bracing, restlessness, agitation, rocking, decreased mobility",
      "Neuropathic pain characteristics: burning, shooting, stabbing, electric shock-like, tingling, numbness; often described as pins and needles; may have allodynia (pain from normally non-painful stimuli)",
      "Somatic pain characteristics: well-localized, aching, throbbing; worsens with movement; associated with musculoskeletal or cutaneous tissue injury",
      "Visceral pain characteristics: poorly localized, deep, cramping, squeezing; often referred to distant locations; associated with organ distension, ischemia, or inflammation",
      "Referred pain patterns: cardiac pain referred to left arm, jaw, and back; gallbladder pain referred to right shoulder (Kehr sign); kidney pain referred to groin and inner thigh"
    ],
    signs: {
      left: [
        "Mild to moderate pain reported (NRS 1-6)",
        "Slight elevation in heart rate and blood pressure",
        "Facial grimacing or guarding during movement",
        "Sleep disturbance or fatigue related to pain",
        "Mild anxiety or restlessness",
        "Decreased appetite or reduced activity level"
      ],
      right: [
        "Severe uncontrolled pain (NRS 7-10) despite multimodal therapy",
        "Respiratory depression (rate below 12) from opioid therapy",
        "Excessive sedation (unable to arouse or barely arousable)",
        "Sudden new onset of severe pain (may indicate complication such as pulmonary embolism, compartment syndrome, or surgical dehiscence)",
        "Signs of opioid overdose: pinpoint pupils, cyanosis, respiratory arrest",
        "Chest pain or abdominal pain with hemodynamic instability"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid agonist (Schedule II controlled substance)",
        action: "Binds to mu-opioid receptors in the central nervous system (brain and spinal cord), inhibiting ascending pain pathways and altering the perception of and emotional response to pain. Also activates descending inhibitory pathways that modulate pain transmission at the dorsal horn level. Provides analgesia, euphoria, sedation, and respiratory depression through dose-dependent CNS depression.",
        sideEffects: "Respiratory depression (most dangerous -- monitor rate below 12), constipation (most common -- occurs in nearly all patients), nausea and vomiting, sedation, pruritus, urinary retention, orthostatic hypotension, miosis (pinpoint pupils)",
        contra: "Severe respiratory depression or acute/severe bronchial asthma without monitoring; known hypersensitivity; paralytic ileus; concurrent use of MAO inhibitors within 14 days; use with extreme caution in head injury (masks neurological assessment), hepatic/renal impairment, and elderly patients",
        pearl: "Always have naloxone (Narcan) readily available when administering morphine; onset IV is 5-10 minutes, onset PO is 30-60 minutes; monitor Pasero Opioid-Induced Sedation Scale (S=sleep but easy to arouse is acceptable; 3-4 is unacceptable and requires intervention); start low and titrate slowly in opioid-naive patients"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamus to decrease pain perception and lower body temperature. Unlike NSAIDs, acetaminophen has minimal peripheral anti-inflammatory activity and does not inhibit platelet function or cause GI mucosal damage.",
        sideEffects: "Hepatotoxicity is the primary concern, especially at doses exceeding 4 grams per day or in patients with liver disease or alcohol use; nausea, rash (rare), allergic reactions (rare)",
        contra: "Severe hepatic impairment or active liver disease; caution with alcohol use disorder (maximum 2 grams per day); caution with concurrent use of other acetaminophen-containing products (many combination medications contain hidden acetaminophen)",
        pearl: "Maximum dose is 4 grams per day in healthy adults and 2 grams per day in patients with liver disease or alcohol use; acetaminophen is present in over 600 combination products -- always check ALL medication sources to prevent accidental overdose; N-acetylcysteine (Mucomyst/Acetadote) is the antidote for acetaminophen toxicity and must be given within 8 hours of ingestion for maximum effectiveness"
      },
      {
        name: "Gabapentin (Neurontin)",
        type: "Anticonvulsant / adjuvant analgesic for neuropathic pain",
        action: "Binds to the alpha-2-delta subunit of voltage-gated calcium channels in the central nervous system, reducing the release of excitatory neurotransmitters including glutamate, norepinephrine, and substance P. This mechanism reduces neuronal excitability and dampens central sensitization, making it effective for neuropathic pain conditions where the nervous system itself has become hyperexcitable.",
        sideEffects: "Drowsiness and sedation (most common), dizziness, ataxia, peripheral edema, weight gain, blurred vision, fatigue; abrupt discontinuation can cause withdrawal seizures",
        contra: "Known hypersensitivity; use caution in renal impairment (dose must be adjusted based on creatinine clearance as gabapentin is renally excreted unchanged); caution when combined with other CNS depressants including opioids (increased respiratory depression risk)",
        pearl: "Must be tapered gradually over at least 7 days when discontinuing to prevent withdrawal seizures; commonly used as an opioid-sparing adjuvant in multimodal pain management; initial dosing starts low (100-300 mg at bedtime) and is titrated up slowly to minimize sedation; monitor for suicidal ideation especially in younger patients"
      }
    ],
    pearls: [
      "The patient's self-report is ALWAYS the most reliable indicator of pain -- never dismiss a patient's pain rating based on your observation of their behavior or vital signs",
      "Chronic pain does NOT always produce elevated vital signs due to physiologic adaptation; a patient can have severe chronic pain (NRS 8/10) with completely normal heart rate and blood pressure",
      "The WHO Pain Ladder provides a stepwise approach: Step 1 (non-opioids for mild pain), Step 2 (weak opioids for moderate pain), Step 3 (strong opioids for severe pain) -- always combine with non-pharmacological interventions at every step",
      "Multimodal analgesia targets different points in the pain pathway simultaneously, providing better pain relief with lower doses of each individual drug and fewer side effects than high-dose monotherapy",
      "Gate Control Theory explains why non-pharmacological interventions work: stimulating large-diameter A-beta fibers (through massage, TENS, pressure, vibration) closes the neural gate to pain signals transmitted by small C fibers",
      "When assessing pain in a nonverbal patient, use behavioral scales (FLACC, CPOT) and assume that any condition known to be painful IS painful even if the patient cannot verbalize it",
      "Constipation is the ONLY opioid side effect to which patients do NOT develop tolerance -- always implement a preventive bowel regimen (stool softener plus stimulant laxative) when starting opioid therapy"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient receiving IV morphine who is difficult to arouse and has a respiratory rate of 8 breaths per minute. What is the priority nursing action?",
        options: [
          "Document the findings and reassess in 30 minutes",
          "Hold the next dose and continue monitoring",
          "Administer naloxone (Narcan) as per protocol and stimulate the patient",
          "Elevate the head of the bed and encourage deep breathing"
        ],
        correct: 2,
        rationale: "A respiratory rate of 8 with difficulty arousing indicates opioid-induced respiratory depression, a life-threatening emergency. The priority action is to administer the opioid antagonist naloxone (Narcan) as per facility protocol and stimulate the patient while calling for help. Waiting to reassess or simply holding the next dose does not address the immediate respiratory emergency."
      },
      {
        question: "A patient with chronic low back pain rates their pain as 7/10 but is observed sitting quietly and reading a magazine. The practical nurse should recognize that:",
        options: [
          "The patient is likely exaggerating pain to obtain opioids",
          "The patient has adapted behaviorally to chronic pain and the self-report is valid",
          "The pain rating should be adjusted to 3/10 based on observed behavior",
          "Pain medication should be withheld until objective signs of pain are present"
        ],
        correct: 1,
        rationale: "Patients with chronic pain develop behavioral adaptation and may not display the objective signs seen in acute pain (elevated vital signs, grimacing, guarding). The patient's self-report is always the most reliable indicator of pain intensity. Chronic pain patients learn coping mechanisms that allow them to engage in activities despite significant pain. Dismissing or adjusting a patient's pain report based on observed behavior is inappropriate and can lead to undertreated pain."
      },
      {
        question: "Which assessment finding should the practical nurse recognize as characteristic of neuropathic pain?",
        options: [
          "Deep, aching, throbbing pain that worsens with movement",
          "Cramping, poorly localized pain that feels like pressure",
          "Burning, shooting, electric shock-like pain with tingling",
          "Sharp, well-localized pain at the site of tissue injury"
        ],
        correct: 2,
        rationale: "Neuropathic pain results from damage to or dysfunction of the peripheral or central nervous system and is characteristically described as burning, shooting, stabbing, or electric shock-like with associated tingling or numbness. Deep aching pain that worsens with movement is somatic pain. Cramping, poorly localized pain is visceral pain. Sharp, well-localized pain at the injury site is acute nociceptive pain."
      }
    ]
  },

  "constrictive-pericarditis-rpn": {
    title: "Constrictive Pericarditis: Pathophysiology and Nursing Management",
    cellular: {
      title: "Pericardial Fibrosis and Cardiac Constriction",
      content: "Constrictive pericarditis is a chronic inflammatory condition in which the pericardium (the double-layered fibrous sac surrounding the heart) becomes thickened, scarred, fibrotic, and often calcified, creating a rigid, non-compliant shell that encases the heart and restricts diastolic filling. The normal pericardium consists of two layers: the visceral pericardium (epicardium), which is adherent to the heart surface, and the parietal pericardium, a tough fibrous outer layer. Between these layers, the pericardial space normally contains 15 to 50 mL of serous fluid that reduces friction during cardiac contraction. In constrictive pericarditis, chronic inflammation leads to progressive fibrosis of both pericardial layers, which may eventually fuse together. Granulation tissue is replaced by dense collagen, and calcium deposits may form within the fibrotic pericardium, sometimes creating a shell-like calcific encasement referred to as a porcelain heart. The most common causes include idiopathic or viral pericarditis (the most frequent cause in developed countries), previous cardiac surgery, radiation therapy to the chest (especially for Hodgkin lymphoma or breast cancer), tuberculosis (the most common cause in developing countries), and connective tissue disorders. The rigid pericardium prevents the ventricles from expanding adequately during diastole, resulting in elevated and equalized diastolic pressures across all four cardiac chambers. Because the total cardiac volume is fixed, the ventricles become interdependent: when one ventricle fills, it compresses the other through the interventricular septum (ventricular interdependence). This produces the characteristic hemodynamic finding of enhanced ventricular interaction, where respiratory variations in ventricular filling are exaggerated. During inspiration, negative intrathoracic pressure increases venous return to the right heart, but the rigid pericardium prevents right ventricular expansion. Instead, the interventricular septum shifts leftward, reducing left ventricular filling and causing a drop in systemic blood pressure greater than 10 mmHg during inspiration -- this is the pulsus paradoxus phenomenon, though it is more pronounced in cardiac tamponade. Kussmaul sign, a paradoxical rise in jugular venous pressure during inspiration rather than the normal decrease, occurs because the rigid pericardium prevents the right heart from accommodating increased venous return. The pericardial knock is a characteristic physical finding: an early diastolic sound heard best at the left lower sternal border, caused by the abrupt cessation of ventricular filling when the expanding ventricle suddenly reaches the rigid pericardial boundary. Chronic impairment of ventricular filling leads to reduced cardiac output, systemic venous congestion, and eventual right-sided heart failure with ascites, hepatomegaly, peripheral edema, and jugular venous distension. The clinical presentation often mimics right-sided heart failure or restrictive cardiomyopathy, making differentiation critical for appropriate treatment."
    },
    riskFactors: [
      "Previous episode of acute or recurrent pericarditis (most common preceding event)",
      "Prior cardiac surgery (post-pericardiotomy syndrome, especially coronary artery bypass grafting)",
      "Mediastinal radiation therapy (risk increases with cumulative dose, typically manifests years to decades later)",
      "Tuberculosis infection (most common cause in developing countries; involves caseous pericardial granulomas)",
      "Connective tissue diseases (systemic lupus erythematosus, rheumatoid arthritis, scleroderma)",
      "End-stage renal disease on chronic dialysis (uremic pericarditis leading to fibrosis)",
      "Malignancy with pericardial involvement (breast cancer, lung cancer, lymphoma, melanoma)"
    ],
    diagnostics: [
      "Chest X-ray: may show pericardial calcification (seen in up to 25% of cases, best visualized on lateral view), normal or small heart silhouette, and pleural effusions",
      "Echocardiography: shows pericardial thickening (greater than 4 mm), septal bounce (abnormal interventricular septal motion with respiration), and respiratory variation in mitral and tricuspid inflow velocities",
      "CT scan of chest: gold standard for detecting pericardial calcification and measuring pericardial thickness; pericardium greater than 4 mm is abnormal",
      "Cardiac MRI: superior soft tissue resolution for detecting pericardial inflammation, fibrosis, and thickening; can differentiate constriction from restriction",
      "Cardiac catheterization: definitive hemodynamic diagnosis showing elevated and equalized diastolic pressures (within 5 mmHg in all four chambers), square root sign (dip-and-plateau pattern), and enhanced ventricular interdependence",
      "Brain natriuretic peptide (BNP): typically normal or mildly elevated in constrictive pericarditis versus significantly elevated in restrictive cardiomyopathy (helps differentiate between the two conditions)"
    ],
    management: [
      "Pericardiectomy (surgical removal of the pericardium): the definitive treatment for symptomatic constrictive pericarditis; involves removing as much of the thickened, calcified pericardium as possible",
      "Diuretic therapy for symptom management: reduce fluid overload, ascites, and peripheral edema while awaiting surgery or in patients who are not surgical candidates",
      "Anti-inflammatory therapy: trial of colchicine and/or corticosteroids may be attempted in early or subacute cases where active inflammation may still be reversible before fibrosis becomes permanent",
      "Sodium and fluid restriction (2 grams sodium, 1.5-2 liters fluid daily) to reduce systemic congestion",
      "Activity modification: avoid strenuous activity that increases cardiac demand; encourage gradual return to activity post-pericardiectomy",
      "Treatment of underlying cause: antitubercular therapy for TB pericarditis, immunosuppression for autoimmune pericarditis, dialysis optimization for uremic pericarditis"
    ],
    nursingActions: [
      "Assess jugular venous distension (JVD) with the patient positioned at 45 degrees; observe for Kussmaul sign (paradoxical increase in JVD during inspiration rather than the normal decrease)",
      "Auscultate for the pericardial knock: an early diastolic sound best heard at the left lower sternal border with the patient in the left lateral decubitus position; differentiate from S3 gallop",
      "Monitor for pulsus paradoxus: measure systolic blood pressure during inspiration and expiration using a manual sphygmomanometer; a difference greater than 10 mmHg is significant",
      "Monitor daily weight and intake/output strictly; report weight gain greater than 1 kg (2.2 lbs) in 24 hours or greater than 2 kg in one week",
      "Assess for signs of right-sided heart failure: peripheral edema (check sacral area in bedbound patients), hepatomegaly, ascites (measure abdominal girth at umbilicus), and jugular venous distension",
      "Post-pericardiectomy care: monitor for cardiac tamponade (hypotension, muffled heart sounds, JVD), hemorrhage, and cardiac dysrhythmias; maintain chest tube patency",
      "Administer diuretics as ordered and monitor serum electrolytes (especially potassium and magnesium); report output less than 30 mL/hour"
    ],
    assessmentFindings: [
      "Jugular venous distension (JVD) that paradoxically increases during inspiration (Kussmaul sign) -- hallmark finding",
      "Pericardial knock: high-pitched early diastolic sound at the left lower sternal border, occurring earlier than an S3 and caused by abrupt halt of ventricular filling",
      "Peripheral edema (bilateral, dependent, pitting), hepatomegaly with hepatic congestion, and ascites (often out of proportion to peripheral edema)",
      "Dyspnea on exertion progressing to orthopnea; exercise intolerance due to inability to increase cardiac output",
      "Pulsus paradoxus: exaggerated inspiratory decrease in systolic blood pressure greater than 10 mmHg",
      "Fatigue, weakness, and muscle wasting from chronically reduced cardiac output and hepatic congestion",
      "Hepatojugular reflux positive: sustained JVD elevation when firm pressure applied over the liver for 30 seconds"
    ],
    signs: {
      left: [
        "Mild peripheral edema (ankles, feet)",
        "Jugular venous distension at 45-degree position",
        "Exercise intolerance and dyspnea on exertion",
        "Fatigue and generalized weakness",
        "Mild hepatomegaly on palpation",
        "Decreased appetite and early satiety"
      ],
      right: [
        "Severe ascites with respiratory compromise",
        "Hypotension with narrow pulse pressure (cardiogenic shock)",
        "New-onset atrial fibrillation or other dysrhythmias",
        "Hepatic failure from chronic congestion (cardiac cirrhosis)",
        "Massive peripheral edema with skin breakdown",
        "Signs of cardiac tamponade post-surgery (Beck triad: hypotension, muffled heart sounds, JVD)"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-2-chloride (Na+/K+/2Cl-) cotransporter in the thick ascending limb of the loop of Henle, preventing reabsorption of sodium, potassium, and chloride. This creates a powerful osmotic gradient that draws water into the renal tubule, producing significant diuresis and reducing intravascular volume, venous congestion, and edema.",
        sideEffects: "Hypokalemia (most clinically significant -- can cause fatal dysrhythmias), hyponatremia, hypomagnesemia, hypocalcemia, dehydration, hypotension, ototoxicity (especially with rapid IV administration or high doses), hyperglycemia, hyperuricemia",
        contra: "Anuria; severe electrolyte depletion; hepatic coma; known hypersensitivity to sulfonamides (cross-sensitivity); dehydration with hypotension",
        pearl: "IV push rate should not exceed 4 mg per minute to prevent ototoxicity; monitor potassium before and after administration -- hold and report if potassium below 3.5 mEq/L; weigh patient daily (same time, same scale, same clothing); administer morning doses to prevent nocturia"
      },
      {
        name: "Colchicine (Colcrys)",
        type: "Anti-inflammatory / alkaloid (plant-derived)",
        action: "Disrupts microtubule assembly by binding to tubulin, which inhibits neutrophil migration, phagocytosis, and inflammatory cytokine release. In pericardial disease, colchicine reduces pericardial inflammation and may prevent recurrence of pericarditis and slow the progression to constrictive physiology when used early in the disease course.",
        sideEffects: "Diarrhea (most common and often dose-limiting), nausea, vomiting, abdominal cramping, bone marrow suppression (rare but serious with chronic use), myopathy, neuropathy, hepatotoxicity",
        contra: "Severe renal impairment (creatinine clearance below 30 mL/min) or severe hepatic impairment combined with renal impairment; concurrent use with strong CYP3A4 inhibitors (clarithromycin, ketoconazole) or P-glycoprotein inhibitors in patients with renal/hepatic impairment",
        pearl: "Typically prescribed as 0.5 mg twice daily (or 0.5 mg daily if weight below 70 kg) for 3-6 months for pericarditis treatment; GI side effects often diminish after the first week; instruct patient to report muscle weakness or numbness (signs of myopathy/neuropathy); monitor CBC periodically for bone marrow suppression"
      },
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Suppresses the inflammatory and immune response by inhibiting phospholipase A2 (reducing arachidonic acid release and prostaglandin/leukotriene synthesis), stabilizing cell membranes, reducing capillary permeability, and suppressing cytokine production. In pericarditis, prednisone reduces pericardial inflammation and effusion.",
        sideEffects: "Hyperglycemia (monitor blood glucose in all patients, especially diabetics), immunosuppression (increased infection risk), fluid retention and hypertension, osteoporosis with chronic use, adrenal suppression, GI irritation and peptic ulcer risk, mood changes (insomnia, euphoria, psychosis), cushingoid features with prolonged use, poor wound healing",
        contra: "Systemic fungal infections; live vaccine administration during therapy; uncontrolled diabetes mellitus (relative); active untreated infections; known hypersensitivity",
        pearl: "Must be tapered gradually (never stopped abruptly) after more than 2 weeks of therapy to prevent adrenal crisis; administer with food to reduce GI irritation; monitor blood glucose at least twice daily during therapy; used as second-line therapy for pericarditis (colchicine and NSAIDs preferred first-line); paradoxically, steroid use may increase recurrence risk in pericarditis"
      }
    ],
    pearls: [
      "Kussmaul sign (paradoxical rise in JVD during inspiration) is the hallmark clinical finding of constrictive pericarditis -- it occurs because the rigid pericardium prevents the right ventricle from accommodating increased venous return during inspiration",
      "The pericardial knock differs from an S3 gallop: the knock occurs EARLIER in diastole, is higher pitched, and results from the abrupt halt of ventricular expansion against the rigid pericardium rather than from volume overload",
      "Constrictive pericarditis and restrictive cardiomyopathy present almost identically; key differentiators include BNP (normal/mildly elevated in constriction vs significantly elevated in restriction), pericardial thickness on CT/MRI, and cardiac catheterization hemodynamics",
      "Pericardial calcification on chest X-ray (best seen on lateral view) is highly suggestive of constrictive pericarditis but is present in only about 25% of cases -- absence of calcification does NOT rule out the diagnosis",
      "Ascites that is disproportionately severe relative to peripheral edema is a classic presentation of constrictive pericarditis and should raise clinical suspicion, especially in patients with risk factors",
      "Pericardiectomy is the only definitive cure for established constrictive pericarditis; medical therapy with diuretics and anti-inflammatories is temporizing only and does not reverse the fibrotic process",
      "Post-cardiac surgery constrictive pericarditis may develop weeks to years after the procedure -- any patient with progressive right-sided heart failure symptoms after cardiac surgery should be evaluated for pericardial constriction"
    ],
    quiz: [
      {
        question: "A practical nurse observes that a patient's jugular venous distension increases during inspiration rather than decreasing. The nurse recognizes this finding as:",
        options: [
          "Pulsus paradoxus",
          "Kussmaul sign",
          "Beck triad",
          "Trousseau sign"
        ],
        correct: 1,
        rationale: "Kussmaul sign is the paradoxical rise in jugular venous pressure during inspiration. Normally, JVP decreases during inspiration due to negative intrathoracic pressure. In constrictive pericarditis, the rigid pericardium prevents right ventricular expansion, so increased venous return during inspiration has nowhere to go, causing JVP to rise. Pulsus paradoxus is an exaggerated drop in systolic blood pressure during inspiration."
      },
      {
        question: "Which physical examination finding is characteristic of constrictive pericarditis and is caused by the abrupt halt of ventricular filling against a rigid pericardium?",
        options: [
          "S3 gallop",
          "Pericardial friction rub",
          "Pericardial knock",
          "S4 gallop"
        ],
        correct: 2,
        rationale: "The pericardial knock is an early diastolic sound unique to constrictive pericarditis, caused by the sudden cessation of ventricular filling when the expanding ventricle meets the rigid, fibrotic pericardium. It occurs earlier in diastole and is higher pitched than an S3 gallop. A pericardial friction rub is associated with acute pericarditis, not constrictive pericarditis."
      },
      {
        question: "A patient with constrictive pericarditis is receiving furosemide IV. Which assessment finding should the practical nurse report immediately?",
        options: [
          "Increased urine output of 200 mL in the first hour",
          "Serum potassium level of 2.8 mEq/L",
          "Weight decrease of 0.5 kg from yesterday",
          "Blood pressure of 128/78 mmHg"
        ],
        correct: 1,
        rationale: "A serum potassium level of 2.8 mEq/L is critically low (normal 3.5-5.0 mEq/L) and requires immediate reporting because hypokalemia can cause life-threatening cardiac dysrhythmias including ventricular fibrillation. Furosemide is a potassium-wasting loop diuretic. Increased urine output is the expected therapeutic response, and a modest weight decrease indicates effective diuresis."
      }
    ]
  },

  "advance-directives-rpn": {
    title: "Advance Directives: Legal, Ethical, and Clinical Framework for Practical Nurses",
    cellular: {
      title: "Legal and Ethical Foundations of Advance Directives and End-of-Life Decision Making",
      content: "Advance directives are legally recognized documents that allow competent adults to communicate their healthcare preferences in advance, ensuring their wishes are respected if they become unable to make or communicate decisions due to illness, injury, or cognitive decline. The legal and ethical foundation of advance directives rests on four core bioethical principles: autonomy (the right of individuals to make informed decisions about their own healthcare), beneficence (acting in the patient's best interest), non-maleficence (avoiding harm), and justice (fair and equitable allocation of healthcare resources). Patient autonomy is the primary ethical principle underlying advance directives, recognizing that every competent adult has the fundamental right to accept or refuse any medical treatment, including life-sustaining interventions. There are two primary types of advance directives. A living will is a written document in which an individual specifies the types of medical treatments they do or do not want if they become terminally ill or permanently unconscious and are unable to communicate. A living will may address preferences regarding mechanical ventilation, cardiopulmonary resuscitation, tube feeding, dialysis, blood transfusions, and organ donation. A durable power of attorney for healthcare (also called a healthcare proxy or substitute decision-maker) is a document in which an individual designates another person to make healthcare decisions on their behalf if they become incapacitated. The designated person (agent, proxy, or substitute decision-maker) is legally authorized to make decisions consistent with the patient's known wishes or, if wishes are unknown, in the patient's best interest. A do-not-resuscitate (DNR) order is a physician order, not an advance directive itself, that instructs healthcare providers not to perform cardiopulmonary resuscitation (CPR) if the patient's heart stops beating or they stop breathing. Similarly, a do-not-intubate (DNI) order specifies that the patient should not be placed on a mechanical ventilator. Code status refers to the level of resuscitative interventions desired: full code (all resuscitative measures), DNR only (no CPR but other treatments continue), DNR/DNI (no CPR and no intubation), and comfort measures only (CMO, focus entirely on symptom management and comfort rather than curative treatment). Medical assistance in dying (MAID) is legal in Canada for eligible adults with serious and irremediable medical conditions causing enduring and intolerable suffering. The practical nurse must understand that advance directives are legally binding documents that must be followed by the healthcare team. It is NOT within the practical nurse's scope to determine code status or witness advance directives in most jurisdictions, but the practical nurse has a critical role in identifying patients who do not have advance directives, facilitating conversations about advance care planning, ensuring that existing directives are accessible in the medical record, and advocating for the patient's documented wishes. The practical nurse must also understand mandatory reporting obligations, informed consent requirements, and the difference between withholding treatment (not starting a treatment) and withdrawing treatment (stopping a treatment already in progress) -- both are ethically and legally equivalent when consistent with the patient's wishes."
    },
    riskFactors: [
      "Terminal illness with life expectancy less than 6 months (increases urgency of advance care planning)",
      "Advanced age with multiple chronic comorbidities (increased risk of acute decompensation and loss of decision-making capacity)",
      "Neurodegenerative diseases (Alzheimer disease, Parkinson disease, ALS) that progressively impair cognition and communication",
      "Planned high-risk surgical procedures (cardiac surgery, transplant surgery, major oncologic surgery)",
      "Intensive care unit admission (high mortality rates necessitate documented goals of care)",
      "Lack of identified healthcare proxy or substitute decision-maker (decisions may default to hierarchical next-of-kin or court-appointed guardian)",
      "Cultural or religious factors that may influence end-of-life decision-making and preferences"
    ],
    diagnostics: [
      "Capacity assessment: evaluate the patient's ability to understand relevant information, appreciate how it applies to their situation, reason about treatment options, and communicate a consistent choice",
      "Review existing documentation: check medical record for previously completed advance directives, living will, healthcare proxy designation, DNR/DNI orders, or POLST/MOST forms",
      "POLST/MOST (Physician Orders for Life-Sustaining Treatment / Medical Orders for Scope of Treatment): a portable, brightly colored medical order form that translates advance directive preferences into actionable physician orders",
      "Palliative Performance Scale (PPS): assesses functional status from 0% (death) to 100% (full ambulation); helps guide goals-of-care discussions",
      "Glasgow Coma Scale (GCS): assesses level of consciousness (3-15); patients with GCS 8 or below are unable to make medical decisions",
      "Assessment of decision-making capacity: NOT the same as legal competency (which is determined by a court); any physician can assess capacity at the bedside"
    ],
    management: [
      "Initiate advance care planning discussions during routine care when the patient is well and has full decision-making capacity, not during acute crises",
      "Ensure advance directive documents are completed, signed, witnessed according to jurisdictional requirements, and uploaded to the patient's medical record where they are immediately accessible",
      "Communicate code status clearly during handoff using SBAR format: include specific orders (DNR, DNI, comfort measures only) and any specific patient wishes or limitations",
      "Implement comfort measures for patients designated CMO: pain management (morphine for pain and dyspnea), oral care, repositioning, anxiety management, family support, discontinuation of non-comfort-focused interventions",
      "Consult palliative care team for patients with serious illness who would benefit from goals-of-care discussion, symptom management, and care coordination",
      "Respect and advocate for the patient's documented wishes even when they conflict with family preferences or healthcare team recommendations; the patient's autonomous decision takes precedence"
    ],
    nursingActions: [
      "Ask all admitted patients whether they have advance directives and document the response; if documents exist, ensure copies are in the medical record and accessible",
      "Verify code status at every handoff, transfer, and change in clinical condition; ensure code status orders are current and clearly documented in the chart",
      "Advocate for the patient's documented wishes: if a family member requests interventions that contradict the patient's advance directive, involve the charge nurse, physician, and ethics committee as appropriate",
      "Provide emotional support to patients and families during advance care planning discussions; use active listening, open-ended questions, and therapeutic communication techniques",
      "For patients receiving comfort measures only: administer morphine as ordered for pain and dyspnea (respiratory distress), glycopyrrolate for excessive secretions (death rattle), and provide meticulous mouth care, repositioning, and skin care",
      "Document patient and family discussions about goals of care, decisions made, and any changes in advance directive status using objective, factual language",
      "Report any ethical concerns or conflicts between documented wishes and care being provided to the charge nurse and, if unresolved, to the institutional ethics committee"
    ],
    assessmentFindings: [
      "Decision-making capacity present: patient can understand information presented, appreciate its relevance to their situation, reason about options, and communicate a consistent choice",
      "Decision-making capacity impaired: confusion, disorientation, inability to repeat back information (failed teach-back), inconsistent or contradictory choices, influence by others (undue influence)",
      "Signs of approaching end of life: Cheyne-Stokes respirations, mottling of extremities, decreased urine output, cool and cyanotic periphery, decreased level of consciousness, terminal secretions (death rattle)",
      "Uncontrolled symptoms in comfort care: unrelieved pain (grimacing, moaning), dyspnea (use of accessory muscles, nasal flaring), anxiety (restlessness, agitation), excessive secretions",
      "Family distress indicators: crying, anger, denial, conflict among family members regarding care decisions, requests that conflict with patient wishes",
      "Moral distress in healthcare team: when staff feel obligated to provide treatments they believe are not in the patient's best interest or that cause suffering"
    ],
    signs: {
      left: [
        "Patient expresses desire to discuss care preferences",
        "Family members have questions about advance care planning",
        "Patient has chronic progressive illness with stable current status",
        "Mild symptoms managed with current comfort measures",
        "Patient and family demonstrate understanding of diagnosis and prognosis",
        "Documented advance directive is current and accessible"
      ],
      right: [
        "Conflict between family wishes and patient's documented advance directive (requires immediate clarification and advocacy)",
        "No documented code status for a critically ill patient (safety risk)",
        "Active resuscitative measures being performed on a patient with valid DNR order (stop and verify orders immediately)",
        "Patient with decision-making capacity refusing treatment that healthcare team disagrees with (ethical conflict requiring support)",
        "Signs of imminent death without comfort measures in place (pain, respiratory distress, agitation)",
        "Suspected coercion or undue influence on patient's healthcare decisions (report to charge nurse and ethics committee)"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate (for comfort care)",
        type: "Opioid agonist / comfort care analgesic",
        action: "Binds to mu-opioid receptors in the brain and spinal cord, reducing the perception of pain and the sensation of dyspnea (air hunger). In end-of-life care, low-dose morphine is the gold standard for managing pain and respiratory distress. Morphine reduces the ventilatory response to hypoxia and hypercapnia, relieving the subjective sensation of breathlessness without necessarily changing respiratory rate. It also produces anxiolysis and mild sedation that contributes to comfort.",
        sideEffects: "Respiratory depression (at comfort care doses, this is rarely clinically significant), constipation, nausea, sedation, myoclonus at high doses, urinary retention",
        contra: "True allergy to morphine (rare); in comfort care settings, there are essentially no absolute contraindications as the goal is symptom relief; the principle of double effect recognizes that providing adequate pain/dyspnea relief is ethical even if it may hasten death as an unintended side effect",
        pearl: "In comfort care, morphine is typically given sublingually (SL) or subcutaneously (SC) when the patient can no longer swallow; starting dose for opioid-naive patients is typically morphine 2.5-5 mg SL/SC every 1-2 hours as needed; titrate to comfort rather than to a specific respiratory rate target"
      },
      {
        name: "Glycopyrrolate (Robinul)",
        type: "Anticholinergic / antimuscarinic agent",
        action: "Blocks muscarinic acetylcholine receptors in the respiratory tract, reducing the production of pharyngeal and tracheal secretions. In end-of-life care, glycopyrrolate is used to manage terminal secretions (death rattle), the audible gurgling or rattling sound caused by accumulation of saliva and respiratory secretions in the pharynx and upper airways of a dying patient who is too weak to cough or swallow.",
        sideEffects: "Dry mouth (therapeutic in this context), urinary retention, tachycardia, blurred vision, constipation, decreased sweating with possible heat intolerance",
        contra: "Known hypersensitivity; narrow-angle glaucoma; severe ulcerative colitis; myasthenia gravis; in comfort care, benefits typically outweigh risks",
        pearl: "Most effective when started EARLY in the terminal phase before secretions accumulate heavily; does not reduce secretions already present -- only prevents new secretion production; repositioning the patient to a lateral position with head slightly elevated allows gravity to drain existing secretions; the death rattle is often more distressing to family members than to the patient -- educate the family that the patient is typically unaware of the sound"
      },
      {
        name: "Lorazepam (Ativan)",
        type: "Benzodiazepine / anxiolytic and sedative",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor in the central nervous system, increasing chloride ion influx, hyperpolarizing neurons, and reducing neuronal excitability. This produces anxiolysis, sedation, muscle relaxation, and anticonvulsant effects. In end-of-life care, lorazepam manages terminal anxiety, restlessness, agitation, and seizures.",
        sideEffects: "Sedation, respiratory depression (dose-dependent), paradoxical agitation (especially in elderly patients), hypotension, confusion, amnesia",
        contra: "Known hypersensitivity to benzodiazepines; severe respiratory depression (relative in comfort care where symptom relief is the primary goal); acute narrow-angle glaucoma",
        pearl: "In comfort care, lorazepam can be given sublingually (SL), subcutaneously (SC), or rectally when IV access is not available; typical starting dose for terminal anxiety is 0.5-1 mg SL/SC every 4-6 hours as needed; combine with morphine for synergistic relief of dyspnea and anxiety; monitor for paradoxical agitation in elderly patients (switch to haloperidol if this occurs)"
      }
    ],
    pearls: [
      "A living will documents WHAT the patient wants (specific treatment preferences), while a durable power of attorney for healthcare documents WHO makes decisions if the patient cannot -- ideally, patients should have BOTH documents",
      "Decision-making capacity is a CLINICAL assessment performed by a physician at the bedside; legal competency is a JUDICIAL determination made by a court -- they are NOT interchangeable terms",
      "The principle of double effect provides ethical justification for administering adequate comfort medications (morphine for dyspnea/pain) even if they may hasten death as an unintended side effect, as long as the primary intent is symptom relief",
      "A DNR order means no CPR only -- it does NOT mean no treatment; patients with DNR status may still receive full medical treatment including IV fluids, antibiotics, surgery, and hospital admission unless otherwise specified",
      "Code status must be verified and communicated at EVERY handoff, transfer, and change in clinical condition; failure to communicate code status is a patient safety event",
      "When family wishes conflict with a patient's documented advance directive, the patient's documented wishes take legal and ethical precedence -- involve the ethics committee if conflict cannot be resolved at the bedside",
      "Terminal secretions (death rattle) are typically more distressing to family members than to the dying patient; educate families that the patient is usually unaware of the sound, reposition the patient laterally, and administer glycopyrrolate to reduce new secretion production"
    ],
    quiz: [
      {
        question: "A family member requests that full resuscitative measures be performed on a patient who has a valid, signed DNR order and is currently in cardiac arrest. What is the practical nurse's most appropriate action?",
        options: [
          "Begin CPR because the family is requesting it",
          "Honor the DNR order and provide comfort measures; notify the physician and charge nurse",
          "Ask the family to sign a consent form overriding the DNR",
          "Wait for the physician to arrive before making any decision"
        ],
        correct: 1,
        rationale: "A valid, signed DNR order must be followed. The patient's documented wishes (expressed when they had decision-making capacity) take legal and ethical precedence over family requests that contradict those wishes. The nurse should honor the DNR, provide comfort measures, and notify the physician and charge nurse. CPR should not be initiated, and families cannot override a valid DNR order at the bedside."
      },
      {
        question: "Which statement best describes the difference between a living will and a durable power of attorney for healthcare?",
        options: [
          "A living will designates a person to make decisions; a durable power of attorney specifies treatment preferences",
          "A living will specifies treatment preferences; a durable power of attorney designates a person to make healthcare decisions",
          "Both documents serve the same purpose and are interchangeable",
          "A living will is only valid during hospitalization; a durable power of attorney is valid in all settings"
        ],
        correct: 1,
        rationale: "A living will is a document specifying WHAT treatments the patient does or does not want (treatment preferences) if they become unable to communicate. A durable power of attorney for healthcare designates WHO (a specific person/agent) will make healthcare decisions on the patient's behalf if they become incapacitated. Ideally, patients should have both documents to ensure comprehensive advance care planning."
      },
      {
        question: "A dying patient receiving comfort measures only is exhibiting audible gurgling respirations (death rattle). The family is visibly distressed. Which nursing intervention is most appropriate?",
        options: [
          "Suction the patient's oropharynx deeply every 30 minutes",
          "Reposition the patient laterally, administer glycopyrrolate as ordered, and educate the family",
          "Increase the oxygen flow rate to 10 liters via non-rebreather mask",
          "Contact the physician to request intubation for airway protection"
        ],
        correct: 1,
        rationale: "Terminal secretions (death rattle) are managed by repositioning the patient to a lateral position to allow gravity drainage of secretions, administering glycopyrrolate to reduce new secretion production, and educating the family that the patient is typically unaware of the sound. Deep suctioning is not recommended as it is invasive, uncomfortable, and only temporarily effective. Increasing oxygen or requesting intubation is inconsistent with comfort measures only goals."
      }
    ]
  },

  "electrolyte-emergency-patterns-rpn": {
    title: "Electrolyte Emergency Patterns: Recognition and Rapid Intervention",
    cellular: {
      title: "Electrolyte Homeostasis and Emergency Pathophysiology",
      content: "Electrolytes are minerals that carry an electrical charge when dissolved in body fluids and are essential for virtually every physiological process including nerve impulse transmission, muscle contraction, cardiac conduction, fluid balance, acid-base regulation, and enzyme activation. The body maintains electrolyte concentrations within very narrow ranges, and deviations beyond these ranges can produce life-threatening emergencies requiring immediate recognition and intervention. Potassium is the major intracellular cation (normal serum level 3.5-5.0 mEq/L) and is critical for maintaining the resting membrane potential of cardiac and skeletal muscle cells. Only 2% of total body potassium is extracellular, making the serum potassium level an imperfect reflection of total body stores. The sodium-potassium ATPase pump actively maintains the potassium gradient by pumping 3 sodium ions out and 2 potassium ions into cells, maintaining a negative intracellular charge (approximately -90 mV). Hyperkalemia (serum potassium above 5.0 mEq/L) reduces the resting membrane potential, making cardiac cells more excitable initially but eventually blocking depolarization entirely, leading to cardiac arrest. The ECG changes of progressive hyperkalemia follow a predictable sequence: peaked T waves (earliest sign, above 5.5 mEq/L), prolonged PR interval, widened QRS complex, loss of P waves, sine wave pattern, and ultimately ventricular fibrillation or asystole. Hypokalemia (serum potassium below 3.5 mEq/L) hyperpolarizes the cell membrane, making it harder to depolarize, causing muscle weakness, decreased reflexes, and cardiac conduction abnormalities including U waves, ST depression, T wave flattening, and increased risk of torsades de pointes. Sodium is the major extracellular cation (normal serum level 135-145 mEq/L) and is the primary determinant of serum osmolality and extracellular fluid volume. Hyponatremia (serum sodium below 135 mEq/L) is the most common electrolyte disorder in hospitalized patients and can be acute or chronic. When sodium falls rapidly, water moves into brain cells by osmosis, causing cerebral edema, increased intracranial pressure, seizures, and potentially fatal brain herniation. However, rapid correction of chronic hyponatremia is equally dangerous because it can cause osmotic demyelination syndrome (ODS, formerly central pontine myelinolysis), in which rapid water shift out of brain cells damages the myelin sheath of pontine neurons, causing irreversible neurological damage including locked-in syndrome. The safe correction rate for chronic hyponatremia is no more than 8-10 mEq/L in the first 24 hours and no more than 18 mEq/L in 48 hours. Hypernatremia (serum sodium above 145 mEq/L) causes water to shift out of cells, resulting in cellular dehydration. In the brain, this causes neuron shrinkage, tearing of bridging veins, and potential intracranial hemorrhage. The most common cause is inadequate water intake (especially in elderly or cognitively impaired patients), diabetes insipidus, or excessive sodium administration. The practical nurse must recognize the clinical patterns of these electrolyte emergencies and understand that the speed of onset, the absolute value, and the rate of correction all determine patient outcomes."
    },
    riskFactors: [
      "Chronic kidney disease (impaired potassium excretion, sodium regulation, and acid-base balance)",
      "Heart failure on diuretic therapy (loop diuretics cause hypokalemia; potassium-sparing diuretics cause hyperkalemia)",
      "Diabetic ketoacidosis (total body potassium depletion despite initial serum hyperkalemia from acidotic shift)",
      "Medications: ACE inhibitors, ARBs, and potassium-sparing diuretics increase hyperkalemia risk; loop and thiazide diuretics increase hypokalemia risk",
      "Syndrome of inappropriate ADH secretion (SIADH) causing dilutional hyponatremia",
      "Prolonged vomiting, diarrhea, or nasogastric suctioning (electrolyte losses through GI fluids)",
      "Elderly patients with decreased thirst mechanism, impaired renal function, and polypharmacy"
    ],
    diagnostics: [
      "Serum electrolyte panel: potassium (3.5-5.0 mEq/L), sodium (135-145 mEq/L), chloride (96-106 mEq/L), calcium, magnesium, phosphorus; STAT results for suspected emergencies",
      "12-lead ECG: immediately for suspected hyperkalemia or hypokalemia; hyperkalemia shows peaked T waves progressing to widened QRS and sine wave; hypokalemia shows flattened T waves, ST depression, and U waves",
      "Serum osmolality (normal 275-295 mOsm/kg): helps classify hyponatremia as hypotonic (true hyponatremia), isotonic (pseudohyponatremia), or hypertonic (dilutional from glucose)",
      "Urine electrolytes and osmolality: help determine renal vs. extrarenal cause; urine sodium below 20 mEq/L suggests extrarenal loss; above 40 mEq/L suggests renal cause or SIADH",
      "Arterial blood gas (ABG): acidosis causes extracellular potassium shift (hyperkalemia); alkalosis causes intracellular shift (hypokalemia); pH change of 0.1 shifts potassium approximately 0.6 mEq/L",
      "Continuous cardiac telemetry monitoring: essential for any patient with potassium below 3.0 or above 5.5 mEq/L due to dysrhythmia risk"
    ],
    management: [
      "Hyperkalemia emergency protocol: (1) Cardiac membrane stabilization with IV calcium gluconate 10% (onset 1-3 minutes, protects heart but does NOT lower potassium); (2) Intracellular shift with regular insulin 10 units IV plus dextrose 50% 25 grams IV (onset 15-30 minutes), and/or sodium bicarbonate IV, and/or nebulized albuterol; (3) Potassium elimination with sodium polystyrene sulfonate (Kayexalate) PO/PR, loop diuretics, or emergent hemodialysis",
      "Hypokalemia management: mild (3.0-3.5 mEq/L) -- oral potassium chloride 40-80 mEq/day divided; moderate (2.5-3.0 mEq/L) -- IV potassium chloride infusion at 10-20 mEq/hour via central line with cardiac monitoring; severe (below 2.5 mEq/L) -- aggressive IV replacement with continuous ECG monitoring, may need up to 40 mEq/hour via central line in ICU",
      "Acute symptomatic hyponatremia (seizures, coma): 3% hypertonic saline IV bolus 100-150 mL over 10-20 minutes; may repeat 1-2 times; goal is to raise sodium by 4-6 mEq/L in first 6 hours to stop seizures",
      "Chronic hyponatremia correction: fluid restriction (800-1000 mL/day) for SIADH; normal saline for volume-depleted hyponatremia; correction rate must NOT exceed 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome",
      "Hypernatremia management: gradual correction with hypotonic fluids (D5W or 0.45% NaCl); correction rate should not exceed 10-12 mEq/L per 24 hours to prevent cerebral edema; free water deficit must be calculated and replaced slowly",
      "Always correct magnesium concurrently: hypomagnesemia makes hypokalemia refractory to potassium replacement; must correct magnesium first for potassium repletion to be effective"
    ],
    nursingActions: [
      "Obtain and analyze 12-lead ECG immediately for any patient with potassium below 3.0 or above 5.5 mEq/L; report ECG changes (peaked T waves, widened QRS, sine wave pattern) STAT",
      "Place patient on continuous cardiac telemetry for any critical electrolyte values; ensure alarms are set and functioning",
      "Administer IV potassium chloride via infusion pump ONLY -- never give as IV push or bolus; maximum peripheral IV rate is 10 mEq/hour; faster rates require central line and ICU-level monitoring",
      "When giving insulin-dextrose for hyperkalemia, monitor blood glucose every 30 minutes for 4 hours to detect and treat rebound hypoglycemia",
      "For patients receiving hypertonic saline, check serum sodium every 2 hours; report sodium rise greater than 8 mEq/L in any 24-hour period (risk of osmotic demyelination syndrome)",
      "Monitor for neuromuscular signs of electrolyte imbalance: muscle weakness, cramping, paresthesias, decreased deep tendon reflexes (hypokalemia), ascending paralysis (severe hypokalemia), confusion and seizures (sodium disorders)",
      "Maintain strict intake and output records; monitor urine output (report less than 0.5 mL/kg/hour); weigh patient daily at the same time"
    ],
    assessmentFindings: [
      "Hyperkalemia: muscle weakness progressing to flaccid paralysis, paresthesias, nausea, diarrhea, bradycardia, peaked T waves on ECG, cardiac arrest in severe cases (above 6.5 mEq/L)",
      "Hypokalemia: muscle weakness (especially legs), fatigue, leg cramps, decreased bowel sounds, constipation or ileus, weak/thready pulse, flattened T waves, U waves on ECG, cardiac dysrhythmias, respiratory muscle weakness in severe cases",
      "Hyponatremia (acute): headache, nausea, vomiting, confusion, lethargy progressing to seizures and coma; cerebral edema with papilledema; Cheyne-Stokes respirations",
      "Hyponatremia (chronic): may be asymptomatic until sodium falls below 120 mEq/L; gait instability, falls, cognitive impairment, fatigue",
      "Hypernatremia: intense thirst (earliest sign), dry sticky mucous membranes, decreased skin turgor, oliguria (concentrated dark urine), restlessness, irritability, confusion, seizures, coma",
      "Osmotic demyelination syndrome (from too-rapid correction of hyponatremia): dysarthria, dysphagia, quadriparesis, behavioral changes, locked-in syndrome (onset 2-6 days after correction)"
    ],
    signs: {
      left: [
        "Mild muscle weakness or cramping",
        "Fatigue and malaise",
        "Nausea or decreased appetite",
        "Mild confusion or irritability",
        "Constipation or changes in bowel pattern",
        "Paresthesias in extremities (tingling, numbness)"
      ],
      right: [
        "Peaked T waves or sine wave pattern on ECG (hyperkalemia -- cardiac arrest imminent)",
        "Seizures (acute hyponatremia with cerebral edema)",
        "Flaccid paralysis or respiratory muscle weakness (severe hypokalemia)",
        "Cardiac dysrhythmias (ventricular tachycardia, ventricular fibrillation, torsades de pointes)",
        "Coma or unresponsiveness (severe sodium disorder)",
        "Cardiac arrest (potassium below 2.5 or above 7.0 mEq/L)"
      ]
    },
    medications: [
      {
        name: "Calcium Gluconate 10% IV",
        type: "Cardiac membrane stabilizer / electrolyte supplement",
        action: "Calcium directly antagonizes the membrane effects of hyperkalemia by restoring the normal gradient between the resting membrane potential and the threshold potential of cardiac cells. By raising the threshold potential, calcium gluconate makes cardiac cells less excitable and protects against lethal dysrhythmias. Critically, calcium gluconate does NOT lower serum potassium -- it only stabilizes the myocardium while other interventions (insulin-dextrose, dialysis) work to actually reduce potassium levels.",
        sideEffects: "Hypotension with rapid infusion, bradycardia, cardiac arrest with rapid IV push, tissue necrosis with extravasation (calcium chloride is significantly more caustic than calcium gluconate), nausea, flushing, sensation of warmth",
        contra: "Hypercalcemia; concurrent digoxin therapy (calcium potentiates digoxin toxicity and can cause fatal dysrhythmias -- if calcium must be given to a digitalized patient, infuse very slowly over 20-30 minutes with continuous ECG monitoring); do not mix with sodium bicarbonate (precipitates)",
        pearl: "In hyperkalemia emergency, calcium gluconate is given FIRST because it acts within 1-3 minutes to stabilize the heart; effect lasts only 30-60 minutes, so other potassium-lowering measures must follow immediately; calcium gluconate 10% is preferred over calcium chloride 10% for peripheral IV because it causes less tissue damage if extravasation occurs; verify the IV site is patent before infusing"
      },
      {
        name: "Regular Insulin IV plus Dextrose 50% (Insulin-Dextrose Protocol)",
        type: "Potassium-shifting agent (intracellular redistribution)",
        action: "Insulin activates the sodium-potassium ATPase pump on cell membranes, driving potassium from the extracellular space into cells (primarily skeletal muscle and hepatocytes), thereby lowering serum potassium levels. The effect of 10 units of regular insulin IV typically reduces serum potassium by 0.5-1.2 mEq/L within 15-30 minutes and lasts 4-6 hours. Dextrose 50% (D50, 25-50 grams IV) is co-administered to prevent insulin-induced hypoglycemia. In hyperglycemic patients (blood glucose above 250 mg/dL), insulin may be given without dextrose.",
        sideEffects: "Hypoglycemia (most significant -- onset 30-60 minutes after insulin, may last up to 6 hours), hypokalemia (if potassium shifts excessively), fluid overload from dextrose infusion",
        contra: "Use caution in patients with existing hypoglycemia; monitor blood glucose before administration and every 30 minutes for at least 4-6 hours after; relative contraindication in end-stage liver disease (impaired gluconeogenesis increases hypoglycemia risk)",
        pearl: "The insulin-dextrose protocol is a TEMPORIZING measure only -- it shifts potassium into cells but does NOT remove it from the body; definitive treatment requires potassium elimination via diuretics, Kayexalate, or hemodialysis; always recheck serum potassium 1-2 hours after treatment; rebound hyperkalemia will occur as insulin effect wears off"
      },
      {
        name: "Hypertonic Saline (3% NaCl)",
        type: "Sodium replacement / osmotic agent",
        action: "3% sodium chloride contains 513 mEq/L of sodium (compared to 154 mEq/L in normal saline), creating a hyperosmolar solution that raises serum sodium concentration and draws water out of swollen brain cells by osmosis. This reverses the cerebral edema caused by acute severe hyponatremia, reducing intracranial pressure and stopping seizures. The effect is rapid (within minutes of bolus administration).",
        sideEffects: "Osmotic demyelination syndrome (if sodium corrected too rapidly -- devastating and often irreversible neurological damage), fluid overload, hypernatremia, phlebitis at peripheral IV sites (central line preferred for continuous infusions)",
        contra: "Hypernatremia; volume overload states (decompensated heart failure); chronic stable hyponatremia without severe symptoms (fluid restriction is preferred); correction rate must be carefully controlled",
        pearl: "Reserved for acute symptomatic hyponatremia with seizures or severe neurological symptoms; administer as 100-150 mL bolus over 10-20 minutes; may repeat 1-2 times; goal is to raise sodium by only 4-6 mEq/L in the first 6 hours, enough to stop seizures; total correction must NOT exceed 8-10 mEq/L in the first 24 hours; check serum sodium every 2 hours during infusion; must be administered on an infusion pump through a dedicated IV line"
      }
    ],
    pearls: [
      "In hyperkalemia emergency, remember the treatment order: STABILIZE (calcium gluconate to protect the heart, onset 1-3 minutes), SHIFT (insulin-dextrose to move potassium intracellularly, onset 15-30 minutes), ELIMINATE (Kayexalate, diuretics, or dialysis to remove potassium from the body)",
      "Peaked T waves are the EARLIEST ECG sign of hyperkalemia -- if you see peaked T waves, check the potassium level immediately and prepare for emergency treatment; the progression to sine wave pattern and cardiac arrest can be rapid",
      "Hypokalemia and hypomagnesemia frequently coexist and are synergistic: hypomagnesemia makes hypokalemia REFRACTORY to potassium replacement; always check and correct magnesium when treating resistant hypokalemia",
      "The rate of sodium correction matters more than the absolute value in chronic hyponatremia: correcting faster than 8-10 mEq/L per 24 hours risks osmotic demyelination syndrome (ODS), which can cause irreversible locked-in syndrome",
      "In diabetic ketoacidosis, initial serum potassium may be NORMAL or HIGH despite massive total body potassium depletion because acidosis shifts potassium extracellularly; once insulin is started and acidosis corrects, potassium will drop rapidly -- monitor every 1-2 hours",
      "IV potassium must NEVER be given as an IV push or bolus under any circumstances -- it causes immediate cardiac arrest; always dilute and administer via infusion pump with cardiac monitoring",
      "When assessing for hypernatremia, intense thirst is the earliest and most reliable clinical sign -- patients who cannot access water (elderly, cognitively impaired, infants, intubated patients) are at highest risk because they cannot respond to their thirst mechanism"
    ],
    quiz: [
      {
        question: "A patient's ECG shows peaked T waves and the serum potassium is 6.8 mEq/L. Which medication should the practical nurse anticipate administering FIRST?",
        options: [
          "Regular insulin 10 units IV with dextrose 50%",
          "Calcium gluconate 10% IV",
          "Sodium polystyrene sulfonate (Kayexalate) PO",
          "Furosemide 40 mg IV"
        ],
        correct: 1,
        rationale: "Calcium gluconate is given FIRST in hyperkalemia emergency because it stabilizes the cardiac membrane within 1-3 minutes, protecting the heart from lethal dysrhythmias. It does not lower potassium but provides a critical safety window while other potassium-lowering interventions (insulin-dextrose, Kayexalate, diuretics, dialysis) are administered. Insulin-dextrose takes 15-30 minutes to act, and Kayexalate takes hours."
      },
      {
        question: "A patient with chronic hyponatremia (sodium 118 mEq/L discovered on routine labs) is being treated with 3% hypertonic saline. The sodium level 8 hours later is 130 mEq/L (increase of 12 mEq/L). What complication should the practical nurse be most concerned about?",
        options: [
          "Cerebral edema from fluid overload",
          "Osmotic demyelination syndrome from overly rapid correction",
          "Hyperkalemia from sodium administration",
          "Pulmonary edema from volume expansion"
        ],
        correct: 1,
        rationale: "A sodium increase of 12 mEq/L in 8 hours exceeds the safe correction rate of 8-10 mEq/L in 24 hours for chronic hyponatremia. Overly rapid correction causes osmotic demyelination syndrome (ODS), in which water rapidly shifts out of brain cells, damaging the myelin sheath of pontine neurons. ODS can cause dysarthria, dysphagia, quadriparesis, and irreversible locked-in syndrome. The nurse should report this finding immediately."
      },
      {
        question: "A practical nurse is caring for a patient receiving insulin-dextrose for hyperkalemia. Which monitoring action is MOST important during the 4 hours following treatment?",
        options: [
          "Monitor urine output every hour",
          "Check blood glucose every 30 minutes",
          "Assess deep tendon reflexes every 2 hours",
          "Monitor respiratory rate every 15 minutes"
        ],
        correct: 1,
        rationale: "The most significant risk of insulin-dextrose therapy is rebound hypoglycemia, which can occur 30-60 minutes after administration and last up to 6 hours. Blood glucose must be monitored every 30 minutes to detect and treat hypoglycemia promptly. While monitoring other parameters is important, hypoglycemia is the most immediate and dangerous complication of this specific treatment."
      }
    ]
  },

  "edema-assessment-rpn": {
    title: "Edema Assessment and Grading for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Edema Formation and Fluid Redistribution",
      content: "Edema is the abnormal accumulation of fluid in the interstitial spaces (the tissue compartment outside of blood vessels and cells), resulting in visible and palpable swelling. Understanding edema formation requires knowledge of Starling forces, the four pressures that govern fluid movement across capillary membranes. Capillary hydrostatic pressure pushes fluid OUT of capillaries into the interstitium (normally 32 mmHg at the arteriolar end and 15 mmHg at the venular end). Interstitial hydrostatic pressure pushes fluid from the interstitium back INTO capillaries (normally slightly negative, approximately -3 mmHg). Plasma oncotic pressure (also called colloid osmotic pressure) pulls fluid INTO capillaries from the interstitium (normally 25 mmHg); this is primarily determined by plasma albumin concentration. Interstitial oncotic pressure pulls fluid OUT of capillaries into the interstitium (normally 8 mmHg). Edema develops when there is an imbalance in these forces: increased capillary hydrostatic pressure (as in heart failure or venous obstruction), decreased plasma oncotic pressure (as in hypoalbuminemia from liver disease, nephrotic syndrome, or malnutrition), increased capillary permeability (as in inflammation, burns, allergic reactions, or sepsis), or lymphatic obstruction (as in lymphedema from surgery, radiation, or parasitic infection). In heart failure, the failing ventricle cannot effectively pump blood forward, causing blood to back up into the venous system. Left-sided heart failure increases pressure in the pulmonary veins, causing pulmonary edema (fluid in the alveoli). Right-sided heart failure increases pressure in the systemic veins, causing peripheral edema (typically in the lower extremities in ambulatory patients or in the sacral area in bedbound patients), jugular venous distension, hepatomegaly, and ascites. Pitting edema occurs when excess fluid accumulates in the interstitium and can be displaced by pressure -- pressing a finger into the swollen tissue creates an indentation (pit) that persists after pressure is released. Pitting edema is graded on a 1+ to 4+ scale based on the depth and duration of the pit: 1+ (2 mm depth, rebounds immediately), 2+ (4 mm depth, rebounds within 15 seconds), 3+ (6 mm depth, rebounds within 30 seconds), 4+ (8 mm depth, rebounds after more than 30 seconds). Non-pitting edema does NOT indent with pressure and is characteristic of lymphedema (obstruction of lymphatic drainage) and myxedema (severe hypothyroidism with mucopolysaccharide accumulation in the dermis). Lymphedema results from impaired lymphatic drainage, often secondary to surgical lymph node removal (especially axillary node dissection for breast cancer), radiation therapy, infection, or parasitic infection (filariasis). Unlike cardiac edema, lymphedema is typically unilateral, does not pit with pressure, has a woody or firm texture, and does not resolve with elevation. The practical nurse must differentiate between pitting and non-pitting edema, grade pitting edema accurately, identify the underlying cause, and monitor the effectiveness of interventions."
    },
    riskFactors: [
      "Heart failure (the most common cause of bilateral pitting peripheral edema in older adults)",
      "Chronic venous insufficiency (incompetent venous valves cause venous hypertension and dependent edema in the lower extremities)",
      "Hypoalbuminemia from any cause: liver cirrhosis (decreased albumin synthesis), nephrotic syndrome (urinary albumin loss), malnutrition, or protein-losing enteropathy",
      "Deep vein thrombosis (DVT causes acute unilateral leg edema from venous outflow obstruction)",
      "Lymph node dissection or radiation therapy (surgical or radiation-induced lymphedema, especially after breast cancer treatment)",
      "Prolonged immobility or dependency of extremities (gravitational pooling of fluid)",
      "Medications that cause fluid retention: calcium channel blockers (especially amlodipine), NSAIDs, corticosteroids, thiazolidinediones (pioglitazone, rosiglitazone)"
    ],
    diagnostics: [
      "Physical assessment with pitting edema grading: press firmly with thumb over bony prominence (medial malleolus, tibial surface, sacrum) for 5 seconds, then measure pit depth and rebound time; grade 1+ through 4+",
      "Serum albumin level (normal 3.5-5.0 g/dL): hypoalbuminemia (below 3.5 g/dL) reduces plasma oncotic pressure; edema becomes clinically apparent when albumin falls below 2.5 g/dL",
      "BNP or NT-proBNP: elevated levels (BNP above 100 pg/mL) suggest heart failure as the cause of edema; helps differentiate cardiac from non-cardiac edema",
      "Doppler ultrasound of extremities: first-line diagnostic for suspected deep vein thrombosis causing unilateral leg edema; also evaluates venous insufficiency",
      "Echocardiogram: evaluates cardiac function (ejection fraction), chamber size, and valvular function in patients with suspected heart failure-related edema",
      "Liver function tests and urinalysis (24-hour urine protein): evaluate for hepatic and renal causes of hypoalbuminemia"
    ],
    management: [
      "Heart failure edema: sodium restriction (2 grams per day), fluid restriction (1.5-2 liters per day), loop diuretic therapy (furosemide), daily weight monitoring, and treatment of underlying cardiac dysfunction",
      "Venous insufficiency edema: compression stockings (20-30 mmHg or 30-40 mmHg graduated compression), leg elevation above heart level for 30 minutes 3-4 times daily, skin care to prevent breakdown, and avoidance of prolonged standing or sitting",
      "Lymphedema management: complex decongestive therapy including manual lymphatic drainage (specialized massage technique), compression bandaging/garments, therapeutic exercises, and meticulous skin care to prevent cellulitis",
      "Hypoalbuminemia edema: treat underlying cause (nutrition support for malnutrition, liver disease management, nephrotic syndrome treatment); IV albumin infusion may be indicated for severe hypoalbuminemia (below 2.0 g/dL) with symptomatic edema",
      "DVT-related edema: anticoagulation therapy (heparin followed by warfarin or DOACs), leg elevation, compression stockings after acute phase, monitoring for pulmonary embolism",
      "General measures for all edema: elevate affected extremity above heart level, avoid restrictive clothing or jewelry, protect edematous skin from injury and breakdown, active/passive range of motion exercises"
    ],
    nursingActions: [
      "Perform pitting edema assessment using consistent technique: press firmly with thumb over bony prominence for 5 full seconds, then release and grade based on pit depth and rebound time; document location, extent, and grade",
      "Measure and document extremity circumference using a consistent anatomical landmark and measuring tape; compare bilaterally; an increase of more than 2 cm compared to the opposite limb is clinically significant",
      "Weigh patient daily at the same time, with the same scale, in the same clothing; report weight gain greater than 1 kg (2.2 lbs) in 24 hours or greater than 2 kg in one week",
      "Assess skin integrity of edematous areas: check for taut, shiny, stretched skin; redness, warmth, or tenderness (cellulitis); blisters or weeping (severe edema); stasis dermatitis (brownish discoloration in chronic venous insufficiency)",
      "Apply compression stockings as ordered: measure appropriately, apply in the morning before the patient gets out of bed, check skin condition and circulation every shift, remove for bathing and skin inspection",
      "Monitor intake and output strictly; enforce fluid restriction if ordered; educate patient and family about sodium restriction and reading food labels",
      "Reposition dependent edema: elevate legs above heart level for ambulatory patients; check sacral, scrotal, and posterior areas for edema in bedbound patients"
    ],
    assessmentFindings: [
      "Pitting edema 1+ (trace): 2 mm pit depth, rebounds immediately after pressure release, barely perceptible swelling",
      "Pitting edema 2+ (mild): 4 mm pit depth, rebounds within 15 seconds, visible swelling with normal skin contour",
      "Pitting edema 3+ (moderate): 6 mm pit depth, rebounds within 30 seconds, obvious swelling with distorted skin contour, extremity appears larger",
      "Pitting edema 4+ (severe): 8 mm or greater pit depth, rebounds after more than 30 seconds (may last 2-3 minutes), grossly distorted extremity, skin taut and shiny, may weep clear fluid",
      "Non-pitting edema (lymphedema): does NOT indent with pressure, has woody or firm texture, typically unilateral, does not respond to diuretics, positive Stemmer sign (inability to pinch skin fold at base of second toe)",
      "Dependent edema location varies by patient position: ankles and feet in ambulatory patients, sacrum and posterior thighs in bedbound patients, periorbital edema prominent in morning (especially in renal disease)",
      "Skin changes associated with chronic edema: stasis dermatitis (brownish hyperpigmentation), hemosiderin deposits (iron staining), lipodermatosclerosis (woody induration), venous stasis ulcers (typically above medial malleolus)"
    ],
    signs: {
      left: [
        "Trace to mild pitting edema (1+ to 2+) in dependent areas",
        "Mild weight gain (0.5-1 kg over baseline)",
        "Slight ankle swelling that resolves with elevation",
        "Intact skin without color changes or breakdown",
        "Patient reports shoes feeling tight at end of day",
        "Visible sock or stocking marks on lower legs"
      ],
      right: [
        "Severe pitting edema (4+) with weeping skin or blister formation",
        "Rapid weight gain (more than 2 kg in 24 hours suggesting acute heart failure decompensation)",
        "Unilateral leg swelling with calf tenderness and warmth (deep vein thrombosis until proven otherwise)",
        "Pulmonary edema symptoms: crackles, pink frothy sputum, severe dyspnea, oxygen desaturation",
        "Cellulitis in edematous limb: expanding redness, warmth, tenderness, fever (requires immediate antibiotic therapy)",
        "Skin breakdown, ulceration, or necrosis in edematous tissue"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-2-chloride cotransporter (NKCC2) in the thick ascending limb of the loop of Henle, the segment responsible for reabsorbing approximately 25% of filtered sodium. By blocking this transporter, furosemide prevents sodium, potassium, and chloride reabsorption, creating a powerful osmotic diuresis that removes excess fluid from the intravascular space and reduces edema. Furosemide also has a venodilatory effect within 5 minutes of IV administration (before diuresis begins), which reduces preload and provides immediate relief of pulmonary congestion.",
        sideEffects: "Hypokalemia (most common and clinically significant), hyponatremia, hypomagnesemia, hypocalcemia, metabolic alkalosis, dehydration and hypotension, ototoxicity (especially with rapid IV administration or high doses), hyperglycemia, hyperuricemia",
        contra: "Anuria; severe electrolyte depletion with hypovolemia; hepatic coma and electrolyte depletion; sulfonamide allergy (cross-sensitivity possible)",
        pearl: "IV furosemide push rate must not exceed 4 mg per minute to prevent ototoxicity; monitor potassium before and during therapy -- supplement as needed to maintain above 3.5 mEq/L; weigh daily (same time, same scale, same clothing); morning dosing preferred to prevent nocturia; in heart failure, IV furosemide is preferred over oral when gut edema impairs oral absorption"
      },
      {
        name: "Spironolactone (Aldactone)",
        type: "Potassium-sparing diuretic / aldosterone antagonist",
        action: "Competitively blocks aldosterone receptors in the distal convoluted tubule and collecting duct of the nephron, preventing aldosterone-mediated sodium reabsorption and potassium excretion. This produces a mild diuresis while preserving potassium. In heart failure, spironolactone also blocks the deleterious effects of aldosterone on the heart (myocardial fibrosis, ventricular remodeling), which has been shown to reduce mortality in heart failure with reduced ejection fraction (RALES trial).",
        sideEffects: "Hyperkalemia (most significant risk, especially in combination with ACE inhibitors, ARBs, or potassium supplements), gynecomastia and breast tenderness (anti-androgenic effect), menstrual irregularities, GI disturbances, dizziness",
        contra: "Hyperkalemia (potassium above 5.0 mEq/L); severe renal impairment (GFR below 30 mL/min); concurrent potassium supplementation or potassium-sparing agents; Addison disease (adrenal insufficiency)",
        pearl: "Check serum potassium and renal function before starting and within 1 week of initiation or dose change; typical dose for heart failure is 25-50 mg daily; used in combination with a loop diuretic (furosemide) in heart failure to counteract potassium loss; educate patients to avoid potassium-rich foods and salt substitutes (which contain potassium chloride); eplerenone is an alternative with fewer anti-androgenic side effects"
      },
      {
        name: "Albumin 25% (Human Serum Albumin)",
        type: "Plasma volume expander / colloid",
        action: "Albumin is the most abundant plasma protein and the primary determinant of plasma oncotic (colloid osmotic) pressure, which keeps fluid within the intravascular space. Infusing 25% albumin raises plasma oncotic pressure, drawing fluid from the interstitial space (where edema accumulates) back into the intravascular compartment through osmosis. Each gram of albumin holds approximately 18 mL of water within the vascular space. The 25% concentration is hyperoncotic and is used specifically to mobilize edema fluid.",
        sideEffects: "Fluid overload and pulmonary edema (paradoxically, if infused too rapidly in patients with compromised cardiac function), hypertension, fever, chills, urticaria, nausea, anaphylaxis (rare -- derived from human plasma)",
        contra: "Severe heart failure (risk of volume overload); severe anemia; known hypersensitivity to albumin; situations where increased intravascular volume is contraindicated",
        pearl: "25% albumin is hyperoncotic and draws approximately 3.5 mL of interstitial fluid into the vascular space for every 1 mL infused; monitor closely for volume overload (crackles, dyspnea, JVD) during and after infusion; often given in combination with furosemide to mobilize edema (give albumin first, then furosemide 30-60 minutes later to diurese the mobilized fluid); infuse slowly, typically over 2-4 hours; never add medications to albumin infusion"
      }
    ],
    pearls: [
      "Pitting edema grading scale: 1+ (2 mm, rebounds immediately), 2+ (4 mm, rebounds within 15 seconds), 3+ (6 mm, rebounds within 30 seconds), 4+ (8 mm or greater, rebounds after more than 30 seconds) -- use a consistent 5-second press technique over a bony prominence for accurate assessment",
      "Edema location changes with patient position: check ankles and feet in ambulatory patients, but ALWAYS check the sacrum, posterior thighs, and scrotum/labia in bedbound patients because gravity causes fluid to collect in these dependent areas",
      "Non-pitting edema (does not indent with pressure) is characteristic of lymphedema and myxedema -- these conditions do NOT respond to diuretic therapy; lymphedema requires compression therapy and manual lymphatic drainage",
      "A weight gain of 1 kg (2.2 lbs) equals approximately 1 liter of retained fluid -- daily weights are the MOST accurate way to track fluid balance and are more reliable than intake/output records",
      "Unilateral leg edema with calf tenderness, warmth, and redness should be considered a deep vein thrombosis until proven otherwise -- do NOT massage the affected extremity as this can dislodge a clot and cause pulmonary embolism",
      "The Stemmer sign (inability to pinch a fold of skin at the base of the second toe) is positive in lymphedema and negative in cardiac edema -- this simple bedside test helps differentiate the two conditions",
      "In heart failure patients with gut edema, oral diuretics may be poorly absorbed; IV furosemide should be used until edema resolves enough to restore reliable oral absorption"
    ],
    quiz: [
      {
        question: "A practical nurse presses a thumb firmly over a patient's medial malleolus for 5 seconds and observes a 6 mm deep pit that rebounds within 30 seconds. How should this finding be graded and documented?",
        options: [
          "1+ pitting edema (trace)",
          "2+ pitting edema (mild)",
          "3+ pitting edema (moderate)",
          "4+ pitting edema (severe)"
        ],
        correct: 2,
        rationale: "A 6 mm pit depth that rebounds within 30 seconds is graded as 3+ (moderate) pitting edema. The grading scale is: 1+ (2 mm, immediate rebound), 2+ (4 mm, rebounds within 15 seconds), 3+ (6 mm, rebounds within 30 seconds), 4+ (8 mm or greater, rebounds after more than 30 seconds)."
      },
      {
        question: "A patient who is bedbound presents with no visible edema in the lower extremities. However, when the practical nurse assesses the sacral area, 2+ pitting edema is found. Which statement best explains this finding?",
        options: [
          "The sacral edema is unrelated to the patient's cardiac condition",
          "Fluid accumulates in dependent areas due to gravity; in bedbound patients, the sacrum is the most dependent area",
          "Sacral edema indicates a localized skin infection rather than systemic fluid retention",
          "The absence of pedal edema rules out heart failure as the cause"
        ],
        correct: 1,
        rationale: "In bedbound patients, the most dependent area is the sacrum and posterior body, not the feet and ankles. Gravity causes excess interstitial fluid to accumulate in whatever area is lowest relative to the heart. The practical nurse must always assess the sacrum, posterior thighs, and genital area for edema in bedbound patients, as peripheral edema in the feet may be absent despite significant fluid retention."
      },
      {
        question: "A patient develops acute unilateral left leg swelling with calf tenderness and warmth. Which nursing action is CONTRAINDICATED?",
        options: [
          "Elevating the affected leg",
          "Measuring and comparing bilateral calf circumference",
          "Massaging the affected calf to promote circulation",
          "Notifying the physician immediately"
        ],
        correct: 2,
        rationale: "Massaging the affected calf is absolutely contraindicated when deep vein thrombosis (DVT) is suspected because manipulation of the affected area can dislodge a thrombus (blood clot), causing it to travel to the lungs as a pulmonary embolism, which is a life-threatening emergency. Acute unilateral leg swelling with calf tenderness and warmth is DVT until proven otherwise. The nurse should elevate the leg, notify the physician, and prepare for diagnostic Doppler ultrasound."
      }
    ]
  }
};

let ok = 0;
let skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else skip++;
}
console.log(`\nDone: ${ok} injected, ${skip} skipped`);
