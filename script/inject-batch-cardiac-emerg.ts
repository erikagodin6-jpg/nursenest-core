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
  "acute-pericarditis-rpn": {
    title: "Acute Pericarditis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Pericardial Inflammation",
      content: "The pericardium is a double-layered fibroserous sac that surrounds the heart, consisting of an outer fibrous pericardium and an inner serous pericardium. The serous pericardium has two layers: the parietal layer (lines the fibrous pericardium) and the visceral layer (epicardium, directly adheres to the heart surface). Between these two serous layers lies the pericardial space, which normally contains 15 to 50 mL of serous fluid that reduces friction during cardiac contraction. Acute pericarditis occurs when the pericardial layers become inflamed, leading to increased vascular permeability, fibrin deposition, and fluid accumulation. The inflammatory process begins when an insult -- viral infection, autoimmune response, uremia, or post-myocardial infarction injury (Dressler syndrome) -- activates the innate immune system. Macrophages and neutrophils infiltrate the pericardial tissue, releasing pro-inflammatory cytokines including interleukin-1, interleukin-6, and tumor necrosis factor-alpha. These mediators increase capillary permeability and recruit additional immune cells, producing the characteristic fibrinous or serofibrinous exudate. The inflamed pericardial surfaces rub against each other during cardiac motion, producing the hallmark pericardial friction rub audible on auscultation. If fluid accumulates rapidly in the pericardial space (pericardial effusion), it can compress the heart chambers and restrict diastolic filling, a life-threatening condition called cardiac tamponade. The pericardial sac is relatively non-compliant to rapid distension; as little as 150 to 200 mL of rapidly accumulating fluid can cause hemodynamic compromise. Cardiac tamponade manifests as Beck triad: hypotension, muffled (distant) heart sounds, and jugular venous distension (JVD). The pathophysiology of tamponade involves progressive compression of the right atrium and ventricle (lower-pressure chambers), reducing venous return and cardiac output. Pulsus paradoxus, defined as a systolic blood pressure drop greater than 10 mmHg during inspiration, occurs because the septum shifts leftward during inspiration in the setting of a restricted pericardial space, further reducing left ventricular output. The practical nurse must understand that acute pericarditis can progress from a manageable inflammatory condition to a life-threatening tamponade emergency, making vigilant monitoring of hemodynamic status and cardiac sounds essential."
    },
    riskFactors: [
      "Viral infection (coxsackievirus B, echovirus, influenza, HIV -- most common cause of acute pericarditis)",
      "Recent myocardial infarction (early pericarditis within 24-72 hours or Dressler syndrome 2-10 weeks post-MI)",
      "Chronic kidney disease with uremia (uremic pericarditis from metabolic waste accumulation in pericardial tissue)",
      "Autoimmune disorders (systemic lupus erythematosus, rheumatoid arthritis, scleroderma)",
      "Recent cardiac surgery or invasive cardiac procedures (postpericardiotomy syndrome)",
      "Malignancy with pericardial metastases (lung cancer, breast cancer, lymphoma)",
      "Radiation therapy to the chest (radiation-induced pericarditis can occur weeks to months after treatment)"
    ],
    diagnostics: [
      "12-lead ECG: classic finding is diffuse ST-segment elevation (concave/saddle-shaped) across multiple leads with PR depression; distinguishes from MI which shows ST elevation in a specific coronary territory",
      "Echocardiogram: first-line imaging to assess pericardial effusion size and hemodynamic significance; identifies tamponade physiology (right atrial/ventricular diastolic collapse)",
      "Chest X-ray: may show enlarged cardiac silhouette (water-bottle shape) if significant effusion is present (greater than 250 mL); normal chest X-ray does not rule out pericarditis",
      "Inflammatory markers: elevated ESR (erythrocyte sedimentation rate), CRP (C-reactive protein), and WBC count support the diagnosis of inflammation",
      "Troponin levels: may be mildly elevated if inflammation extends to the myocardium (myopericarditis); significant elevation suggests myocardial infarction",
      "BUN and creatinine: elevated in uremic pericarditis; baseline renal function guides medication selection"
    ],
    management: [
      "Activity restriction: limit physical activity until symptoms resolve and CRP normalizes; athletes should not return to competition for at least 3 months after acute episode",
      "Anti-inflammatory therapy: NSAIDs (ibuprofen or ASA) are first-line treatment; colchicine is added to reduce recurrence risk; corticosteroids reserved for refractory or autoimmune cases",
      "Pericardiocentesis: emergent needle drainage of pericardial fluid if cardiac tamponade is present; performed under echocardiographic or fluoroscopic guidance",
      "Monitor for constrictive pericarditis: chronic inflammation can lead to pericardial fibrosis and thickening, restricting cardiac filling; may require pericardiectomy",
      "Treat underlying cause: antibiotics for bacterial pericarditis, dialysis for uremic pericarditis, chemotherapy for malignant pericarditis",
      "Serial echocardiography: monitor effusion size during treatment to detect worsening or recurrence",
      "Hemodynamic monitoring: continuous cardiac monitoring in patients with moderate to large effusions; assess for signs of tamponade every 1-2 hours"
    ],
    nursingActions: [
      "Auscultate heart sounds every 2-4 hours listening for pericardial friction rub (scratchy, high-pitched, three-component sound best heard at the left sternal border with patient leaning forward)",
      "Monitor vital signs every 1-2 hours in acute phase; report hypotension, tachycardia, or narrowing pulse pressure immediately as these may indicate developing tamponade",
      "Assess for Beck triad (hypotension, muffled heart sounds, JVD) and pulsus paradoxus (systolic BP drop greater than 10 mmHg on inspiration) at each assessment",
      "Position patient upright (sitting forward) to reduce pericardial pressure on the heart and improve comfort; this position also enhances detection of friction rub",
      "Administer prescribed anti-inflammatory medications with food to reduce GI irritation; monitor for GI bleeding signs (melena, hematemesis)",
      "Document pain characteristics using PQRST format; pericardial pain is typically sharp, pleuritic, worsens with inspiration and lying flat, and improves with sitting forward",
      "Monitor ECG rhythm continuously; report new ST-segment changes or dysrhythmias immediately"
    ],
    assessmentFindings: [
      "Sharp, pleuritic chest pain that worsens with deep inspiration, coughing, and lying supine; characteristically improves when sitting up and leaning forward",
      "Pericardial friction rub: best heard with the diaphragm of the stethoscope at the left lower sternal border with patient sitting upright and leaning forward; has up to three components (atrial systole, ventricular systole, ventricular diastole)",
      "Low-grade fever (typically below 38.5 degrees Celsius in viral pericarditis; higher fevers suggest bacterial etiology)",
      "Tachycardia (compensatory response to decreased cardiac output from effusion or pain-mediated sympathetic activation)",
      "Dyspnea that worsens in supine position (pericardial fluid compresses posterior structures when lying flat)",
      "Diffuse ST elevation on ECG (concave/saddle-shaped) with PR depression, distinguishing pericarditis from acute MI (convex ST elevation in specific territory)",
      "Elevated inflammatory markers (CRP, ESR, WBC) confirming active inflammatory process"
    ],
    signs: {
      left: [
        "Sharp chest pain worse with inspiration and supine position",
        "Pericardial friction rub on auscultation",
        "Low-grade fever and malaise",
        "Mild tachycardia (heart rate 100-110 bpm)",
        "Dyspnea with exertion",
        "Mild peripheral edema"
      ],
      right: [
        "Beck triad: hypotension, muffled heart sounds, jugular venous distension (cardiac tamponade)",
        "Pulsus paradoxus greater than 10 mmHg (tamponade physiology)",
        "Severe hypotension with narrowing pulse pressure",
        "Tachycardia with weak, thready pulse",
        "Altered level of consciousness (decreased cardiac output to brain)",
        "Electrical alternans on ECG (alternating QRS amplitude -- pathognomonic for large effusion with swinging heart)"
      ]
    },
    medications: [
      {
        name: "Colchicine",
        type: "Anti-inflammatory (microtubule inhibitor)",
        action: "Inhibits microtubule polymerization in neutrophils and macrophages, reducing their migration to inflamed pericardial tissue. Blocks the NLRP3 inflammasome pathway, decreasing interleukin-1-beta production and breaking the inflammatory cycle. Reduces fibrin deposition on pericardial surfaces.",
        sideEffects: "Diarrhea (most common dose-limiting side effect), nausea, vomiting, abdominal cramping, myelosuppression (rare at therapeutic doses), myopathy, peripheral neuropathy (with prolonged use)",
        contra: "Severe hepatic impairment; severe renal impairment (GFR below 30 mL/min requires dose reduction); concurrent use with strong CYP3A4 inhibitors (clarithromycin, ketoconazole) or P-glycoprotein inhibitors",
        pearl: "Added to NSAIDs as first-line combination therapy for acute pericarditis; reduces recurrence rate by approximately 50%. Typical dose is 0.5 mg twice daily (or 0.5 mg once daily if body weight under 70 kg) for 3 months. Advise patients to report diarrhea -- dose reduction usually resolves this side effect."
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase-1 and cyclooxygenase-2 enzymes, blocking prostaglandin synthesis at the site of pericardial inflammation. Reduces pain, fever, and inflammatory exudate formation. Decreases pericardial swelling and friction between inflamed layers.",
        sideEffects: "GI ulceration and bleeding, renal impairment (reduced GFR from prostaglandin inhibition), increased cardiovascular risk with prolonged use, headache, dizziness, fluid retention",
        contra: "Active GI bleeding or peptic ulcer disease; severe renal impairment; third trimester of pregnancy; concurrent anticoagulant therapy (increased bleeding risk); aspirin-sensitive asthma",
        pearl: "Preferred NSAID for pericarditis due to favorable coronary blood flow profile. Typical dose is 600-800 mg three times daily with meals for 1-2 weeks, then taper over 2-4 weeks. Always co-prescribe a proton pump inhibitor (PPI) for GI protection. Do not use ibuprofen in post-MI pericarditis -- use high-dose ASA instead."
      },
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Binds to intracellular glucocorticoid receptors and modulates gene transcription, suppressing the production of pro-inflammatory cytokines (IL-1, IL-6, TNF-alpha). Reduces vascular permeability, neutrophil migration, and fibrin deposition in the pericardium. Provides potent anti-inflammatory effect across multiple immune pathways.",
        sideEffects: "Hyperglycemia, immunosuppression, osteoporosis, adrenal suppression, weight gain, fluid retention, mood changes, insomnia, gastric irritation, impaired wound healing",
        contra: "Active untreated infections (especially tuberculosis -- must rule out TB before starting); uncontrolled diabetes mellitus; systemic fungal infections; live vaccine administration",
        pearl: "Reserved as SECOND-LINE therapy for pericarditis when NSAIDs and colchicine fail or are contraindicated. Associated with higher recurrence rates than NSAIDs -- use lowest effective dose (0.25-0.5 mg/kg/day) and taper very slowly over several weeks. Never stop abruptly after more than 2 weeks of use due to adrenal suppression risk. Monitor blood glucose frequently."
      }
    ],
    pearls: [
      "The pericardial friction rub is the pathognomonic finding of acute pericarditis. It has up to THREE components (presystolic, systolic, diastolic) and is best heard with the diaphragm at the left lower sternal border with the patient sitting up and leaning forward. The rub may be transient -- document when heard and check frequently.",
      "Beck triad (hypotension + muffled heart sounds + JVD) indicates cardiac tamponade, a life-threatening emergency requiring immediate pericardiocentesis. Report these findings IMMEDIATELY -- do not wait for the next scheduled assessment.",
      "Pulsus paradoxus is measured by inflating the BP cuff above systolic pressure and slowly deflating. Note when Korotkoff sounds are first heard (only during expiration) and when they become continuous (throughout respiratory cycle). A difference greater than 10 mmHg is abnormal and suggests tamponade.",
      "Distinguish pericarditis pain from MI pain: pericarditis is sharp, pleuritic, worse lying flat, and better sitting forward. MI pain is crushing, pressure-like, radiates to arm/jaw, and does not change with position or respiration.",
      "Diffuse ST elevation on ECG differentiates pericarditis from MI: pericarditis shows concave (saddle-shaped) ST elevation across multiple leads with PR depression. MI shows convex ST elevation limited to leads corresponding to a specific coronary artery territory.",
      "Colchicine reduces pericarditis recurrence by approximately 50% and should be added to NSAID therapy as standard first-line combination treatment. The most common side effect is diarrhea, which is usually managed with dose reduction.",
      "In post-MI pericarditis, use high-dose aspirin (650-1000 mg every 6-8 hours) rather than ibuprofen, because ibuprofen may interfere with the cardioprotective antiplatelet effects of aspirin. Always verify medication choices with the prescriber."
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient diagnosed with acute pericarditis. The patient reports that chest pain is worse when lying flat. Which position should the nurse help the patient assume to reduce discomfort?",
        options: [
          "Supine with legs elevated (Trendelenburg position)",
          "Sitting upright and leaning forward",
          "Left lateral (Sims) position",
          "Prone position with head turned to the side"
        ],
        correct: 1,
        rationale: "Sitting upright and leaning forward reduces the amount of pericardial contact with the inflamed surfaces and decreases pericardial pressure on the heart. This is the classic comfort position for pericarditis. Lying supine worsens pain because gravity increases pericardial contact. Trendelenburg would increase venous return and worsen symptoms."
      },
      {
        question: "A patient with acute pericarditis develops hypotension, muffled heart sounds, and jugular venous distension. The practical nurse recognizes these findings as which complication?",
        options: [
          "Heart failure exacerbation",
          "Pulmonary embolism",
          "Cardiac tamponade (Beck triad)",
          "Tension pneumothorax"
        ],
        correct: 2,
        rationale: "Beck triad -- hypotension, muffled (distant) heart sounds, and jugular venous distension -- is the classic presentation of cardiac tamponade. Tamponade occurs when fluid accumulates in the pericardial space and compresses the heart, restricting diastolic filling and reducing cardiac output. This is a life-threatening emergency requiring immediate pericardiocentesis."
      },
      {
        question: "A practical nurse is administering colchicine to a patient with acute pericarditis. The patient reports frequent watery stools. What is the most appropriate initial nursing action?",
        options: [
          "Discontinue the medication immediately and notify the physician",
          "Administer an antidiarrheal medication without consulting the prescriber",
          "Document the finding and report to the prescriber for possible dose adjustment",
          "Increase the colchicine dose to achieve therapeutic effect faster"
        ],
        correct: 2,
        rationale: "Diarrhea is the most common dose-limiting side effect of colchicine. The appropriate nursing action is to document the finding and report it to the prescriber, who may reduce the dose (from twice daily to once daily). The nurse should not independently discontinue or adjust the medication. Diarrhea at this level does not typically require emergent discontinuation but does warrant dose modification."
      }
    ]
  },

  "acute-transfusion-reaction-rpn": {
    title: "Acute Transfusion Reactions for Practical Nurses",
    cellular: {
      title: "Immunology and Pathophysiology of Transfusion Reactions",
      content: "Blood transfusion reactions occur when the recipient's immune system recognizes transfused blood components as foreign and mounts an immune response. Understanding the immunological basis of transfusion reactions begins with the ABO and Rh antigen systems present on red blood cell surfaces. The ABO system is based on carbohydrate antigens: type A blood has A antigens with anti-B antibodies in plasma, type B has B antigens with anti-A antibodies, type AB has both antigens with neither antibody (universal plasma recipient), and type O has neither antigen with both antibodies (universal red cell donor). The Rh system involves the D antigen -- Rh-positive individuals have the D antigen, while Rh-negative individuals lack it and can develop anti-D antibodies after exposure. Acute hemolytic transfusion reactions (AHTR) are the most severe type, occurring when ABO-incompatible blood is transfused. The recipient's pre-existing IgM antibodies bind to incompatible donor red blood cells, activating the complement cascade (classical pathway). Complement activation leads to formation of the membrane attack complex (C5b-9) which creates pores in donor RBC membranes, causing intravascular hemolysis. The released free hemoglobin overwhelms haptoglobin binding capacity, leading to hemoglobinuria, renal tubular damage, and potentially acute kidney injury. Simultaneously, complement activation triggers mast cell degranulation, releasing histamine, and activates the coagulation cascade, potentially causing disseminated intravascular coagulation (DIC). Febrile non-hemolytic transfusion reactions (FNHTR) are the most common type, caused by recipient antibodies reacting with donor leukocyte antigens or by cytokines (IL-1, IL-6, TNF-alpha) that accumulate in stored blood products. These cytokines act on the hypothalamic thermoregulatory center, causing fever. Allergic transfusion reactions range from mild urticarial reactions (IgE-mediated mast cell degranulation causing histamine release) to severe anaphylaxis (massive histamine release causing vasodilation, bronchospasm, and cardiovascular collapse). Transfusion-associated circulatory overload (TACO) occurs when transfusion rate exceeds the patient's cardiac compensatory capacity, causing hydrostatic pulmonary edema. Transfusion-related acute lung injury (TRALI) involves donor antibodies reacting with recipient neutrophils in the pulmonary vasculature, causing neutrophil activation, endothelial damage, and non-cardiogenic pulmonary edema within 6 hours of transfusion. The practical nurse must recognize the distinct presentations of each reaction type because the interventions differ significantly, and delays in recognition can be fatal."
    },
    riskFactors: [
      "History of previous transfusion reactions (sensitization to blood group antigens increases future reaction risk)",
      "Multiple prior transfusions (increased exposure to foreign antigens leads to alloantibody formation)",
      "History of allergies or atopic conditions (increased risk of allergic and anaphylactic transfusion reactions)",
      "Heart failure or renal impairment (increased risk of transfusion-associated circulatory overload due to reduced volume tolerance)",
      "Immunocompromised state (increased susceptibility to transfusion-transmitted infections)",
      "Multiparous women (exposure to fetal antigens during pregnancy can cause alloantibody formation)",
      "Clerical or identification errors (the most common preventable cause of fatal hemolytic reactions -- wrong blood to wrong patient)"
    ],
    diagnostics: [
      "Direct antiglobulin test (DAT/Coombs test): detects antibodies or complement bound to the surface of red blood cells; positive in hemolytic reactions",
      "Complete blood count (CBC): decreased hemoglobin and hematocrit indicate hemolysis; decreased platelets may indicate DIC",
      "Serum haptoglobin: decreased or absent in intravascular hemolysis (haptoglobin binds free hemoglobin and is consumed during hemolysis)",
      "Serum lactate dehydrogenase (LDH) and indirect bilirubin: elevated in hemolysis; LDH is released from destroyed red blood cells",
      "Urinalysis: hemoglobinuria (dark red-brown urine) indicates intravascular hemolysis; free hemoglobin in urine is nephrotoxic",
      "Coagulation studies (PT, PTT, fibrinogen, D-dimer): evaluate for DIC which can complicate acute hemolytic reactions; decreased fibrinogen and elevated D-dimer confirm consumptive coagulopathy",
      "Blood bank re-crossmatch: repeat type and crossmatch on both the patient sample and the donor unit to identify the cause of incompatibility"
    ],
    management: [
      "STOP the transfusion IMMEDIATELY at the first sign of any transfusion reaction -- this is the single most important initial intervention regardless of reaction type",
      "Maintain IV access with normal saline (0.9% NaCl) using new tubing -- do not run saline through the blood tubing as it may push remaining incompatible blood into the patient",
      "Notify the physician and blood bank immediately; return the blood product bag and tubing to the blood bank for investigation along with post-reaction blood and urine samples",
      "For hemolytic reactions: aggressive IV fluid resuscitation with normal saline to maintain renal perfusion and urine output above 1 mL/kg/hour; vasopressors if hypotension persists despite fluid resuscitation",
      "For allergic reactions (mild urticaria): antihistamine (diphenhydramine); if symptoms resolve, the transfusion may be cautiously restarted with physician order",
      "For anaphylaxis: epinephrine IM, maintain airway, high-flow oxygen, IV fluids for volume support, and prepare for possible intubation",
      "For TACO: stop transfusion, position upright, administer diuretics (furosemide) as ordered, supplemental oxygen, and consider non-invasive positive pressure ventilation"
    ],
    nursingActions: [
      "Verify patient identity using TWO identifiers (name and date of birth or medical record number) at the bedside BEFORE starting any blood product -- check against the blood bank tag, patient wristband, and physician order",
      "Obtain baseline vital signs (temperature, pulse, blood pressure, respiratory rate, SpO2) within 15 minutes BEFORE starting the transfusion",
      "Remain with the patient for the FIRST 15 minutes of the transfusion and take vital signs at 15 minutes -- most fatal hemolytic reactions manifest within the first 15 mL of infusion",
      "Monitor vital signs per facility protocol (typically at 15 minutes, 30 minutes, 1 hour, and at completion); report temperature increase of 1 degree Celsius or more above baseline",
      "Assess for signs of reaction throughout the transfusion: fever, chills, rigors, urticaria, pruritus, flushing, dyspnea, wheezing, chest pain, back pain, flank pain, hypotension, tachycardia",
      "Complete each unit of packed RBCs within 4 hours of removal from blood bank to prevent bacterial proliferation; platelets are transfused over 15-30 minutes",
      "Document the blood product type, unit number, start and stop times, total volume infused, all vital signs, and any adverse events in the patient record"
    ],
    assessmentFindings: [
      "Acute hemolytic reaction: fever, chills, flank/back pain, chest tightness, hypotension, tachycardia, dark red-brown urine (hemoglobinuria), anxiety/sense of impending doom -- onset within minutes of starting transfusion",
      "Febrile non-hemolytic reaction: fever (temperature rise of 1 degree Celsius or more above baseline), chills, rigors, headache, mild tachycardia -- most common reaction type; onset during or within 1-2 hours post-transfusion",
      "Allergic reaction (mild): urticaria (hives), pruritus (itching), localized erythema, mild flushing -- occurs during or shortly after transfusion",
      "Anaphylactic reaction: bronchospasm, wheezing, stridor, angioedema (facial/lip/tongue swelling), severe hypotension, cardiovascular collapse -- onset within seconds to minutes; often in IgA-deficient patients receiving IgA-containing products",
      "TACO: dyspnea, orthopnea, jugular venous distension, peripheral edema, hypertension, crackles on lung auscultation, elevated BNP -- onset during or within 6 hours of transfusion",
      "TRALI: acute respiratory distress, bilateral pulmonary infiltrates on chest X-ray, hypoxemia, fever, hypotension -- onset within 6 hours of transfusion; non-cardiogenic (normal BNP, no JVD)"
    ],
    signs: {
      left: [
        "Low-grade fever and mild chills (febrile non-hemolytic reaction)",
        "Localized urticaria and pruritus (mild allergic reaction)",
        "Mild tachycardia (heart rate 100-110 bpm)",
        "Flushing or skin warmth",
        "Headache and mild anxiety",
        "Mild dyspnea with exertion"
      ],
      right: [
        "Severe rigors with high fever and hemoglobinuria (acute hemolytic reaction)",
        "Bronchospasm, stridor, and cardiovascular collapse (anaphylaxis)",
        "Severe hypotension unresponsive to fluid bolus",
        "Dark red-brown urine (free hemoglobin -- intravascular hemolysis)",
        "Acute respiratory distress with bilateral crackles (TACO or TRALI)",
        "DIC: petechiae, oozing from IV sites, mucosal bleeding"
      ]
    },
    medications: [
      {
        name: "Diphenhydramine (Benadryl)",
        type: "First-generation antihistamine (H1 receptor antagonist)",
        action: "Competitively blocks histamine at H1 receptors on vascular endothelium, smooth muscle, and sensory nerve endings. Reduces histamine-mediated vasodilation, capillary permeability, pruritus, and urticaria. Crosses the blood-brain barrier, producing sedation as a side effect.",
        sideEffects: "Drowsiness and sedation (most common), dry mouth, urinary retention, constipation, blurred vision, tachycardia, thickened bronchial secretions",
        contra: "Narrow-angle glaucoma; urinary retention or bladder obstruction; severe hepatic impairment; use with caution in elderly patients (Beers Criteria -- increased risk of confusion, falls, anticholinergic toxicity)",
        pearl: "Standard pre-medication for patients with history of mild allergic transfusion reactions. Administer 25-50 mg IV or PO 30 minutes before transfusion as ordered. For acute mild allergic reactions (urticaria only), administer diphenhydramine and the transfusion may be restarted with physician approval once symptoms resolve."
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic/Antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center. Lowers elevated body temperature without affecting normal body temperature. Provides analgesic effect through modulation of the endocannabinoid system and serotonergic pathways.",
        sideEffects: "Hepatotoxicity at doses exceeding 4 grams per day (lower threshold of 2 grams per day in patients with liver disease or alcohol use), nausea, rash (rare), thrombocytopenia (rare)",
        contra: "Severe hepatic impairment or active liver disease; known hypersensitivity; chronic alcohol use (increased hepatotoxicity risk); concurrent use with other acetaminophen-containing products",
        pearl: "Used as pre-medication before transfusion in patients with history of febrile reactions. Administer 650-1000 mg PO 30 minutes before transfusion. Always check ALL medications the patient is receiving for hidden acetaminophen content (combination products such as opioid-acetaminophen preparations). Maximum daily dose must account for ALL sources."
      },
      {
        name: "Epinephrine (Adrenaline)",
        type: "Sympathomimetic (alpha and beta adrenergic agonist)",
        action: "Stimulates alpha-1 adrenergic receptors causing peripheral vasoconstriction (raises blood pressure and reduces mucosal edema/angioedema). Stimulates beta-1 receptors increasing heart rate and cardiac contractility (improves cardiac output). Stimulates beta-2 receptors causing bronchodilation (reverses bronchospasm) and stabilizing mast cell membranes (reduces further histamine release).",
        sideEffects: "Tachycardia, palpitations, hypertension, tremor, anxiety, headache, nausea, cardiac dysrhythmias (ventricular tachycardia, ventricular fibrillation at high doses)",
        contra: "No absolute contraindications in life-threatening anaphylaxis -- always administer epinephrine for anaphylaxis regardless of comorbidities; relative caution in patients with cardiac disease, uncontrolled hypertension, or on beta-blockers (may require higher doses)",
        pearl: "First-line medication for anaphylactic transfusion reactions. Administer 0.3-0.5 mg IM in the anterolateral thigh (vastus lateralis). May repeat every 5-15 minutes if symptoms persist. IM is the preferred route -- IV epinephrine is reserved for refractory anaphylaxis or cardiac arrest and requires dilution and cardiac monitoring. Delay in epinephrine administration is the primary cause of anaphylaxis fatalities."
      }
    ],
    pearls: [
      "The MOST important step to prevent fatal hemolytic transfusion reactions is proper patient identification. Always verify TWO patient identifiers against the blood bank tag, patient wristband, and physician order at the bedside BEFORE starting the transfusion. Most fatal reactions are caused by clerical error -- wrong blood to wrong patient.",
      "STOP the transfusion IMMEDIATELY at the first sign of ANY reaction. Do not wait to see if symptoms worsen. Disconnect the blood tubing, maintain IV access with new tubing and normal saline, and notify the physician and blood bank.",
      "Stay with the patient for the FIRST 15 MINUTES of every transfusion. Most fatal acute hemolytic reactions occur within the first 50 mL (often the first 10-15 mL) of infused blood. This is when vigilant monitoring is most critical.",
      "Differentiate TACO from TRALI: both cause acute respiratory distress during or after transfusion. TACO presents with hypertension, JVD, elevated BNP (volume overload). TRALI presents with hypotension, fever, normal BNP (non-cardiogenic pulmonary edema). TACO is treated with diuretics; TRALI treatment is supportive.",
      "Fever alone does not always mean hemolytic reaction. Febrile non-hemolytic reactions (FNHTR) are the most common type and present with fever and chills without hemodynamic instability. However, all febrile reactions require stopping the transfusion and investigation because early hemolytic reactions can present similarly.",
      "Blood products must be infused through a blood administration set with an inline 170-260 micron filter. Never add medications to blood products. The only compatible IV solution is 0.9% normal saline -- do not use lactated Ringer or dextrose solutions (cause hemolysis).",
      "Each unit of packed RBCs must be completed within 4 hours of leaving the blood bank to prevent bacterial contamination from proliferation at room temperature. If the transfusion cannot be completed within this timeframe, return the unit to the blood bank."
    ],
    quiz: [
      {
        question: "A practical nurse is transfusing packed red blood cells when the patient develops fever, chills, and back pain 10 minutes after the transfusion started. What is the priority nursing action?",
        options: [
          "Slow the transfusion rate and continue monitoring",
          "Administer acetaminophen and continue the transfusion",
          "Stop the transfusion immediately and maintain IV access with normal saline",
          "Increase the transfusion rate to complete the unit faster"
        ],
        correct: 2,
        rationale: "The priority action for any suspected transfusion reaction is to STOP the transfusion immediately. Fever, chills, and back pain within the first 15 minutes may indicate an acute hemolytic reaction, which is life-threatening. The nurse must stop the transfusion, maintain IV access with normal saline using new tubing, and notify the physician and blood bank immediately. Never slow the rate and continue -- this allows more incompatible blood to enter the patient."
      },
      {
        question: "Before initiating a blood transfusion, the practical nurse must verify the patient's identity using which method?",
        options: [
          "Ask the patient to state their name only",
          "Check the room number against the blood bank tag",
          "Verify two patient identifiers against the blood bank tag and patient wristband at the bedside",
          "Confirm the physician's verbal order over the phone"
        ],
        correct: 2,
        rationale: "Safe transfusion practice requires verification of TWO patient identifiers (typically name and date of birth or medical record number) against the blood bank tag and patient wristband at the bedside before starting the transfusion. Room numbers are never used as identifiers because patients change rooms. Verbal orders alone are insufficient for blood product verification."
      },
      {
        question: "A patient receiving a blood transfusion develops urticaria (hives) and pruritus (itching) but vital signs remain stable. After stopping the transfusion, what medication does the practical nurse anticipate administering?",
        options: [
          "Epinephrine 0.3 mg IM",
          "Furosemide 40 mg IV",
          "Diphenhydramine 25-50 mg IV or PO",
          "Methylprednisolone 125 mg IV"
        ],
        correct: 2,
        rationale: "Mild allergic transfusion reactions presenting with urticaria and pruritus without hemodynamic instability are treated with an antihistamine such as diphenhydramine. Epinephrine is reserved for anaphylactic reactions with bronchospasm, angioedema, or cardiovascular collapse. Furosemide is used for volume overload (TACO). After diphenhydramine is given and symptoms resolve, the transfusion may be cautiously restarted with physician approval."
      }
    ]
  },

  "acetaminophen-toxicity-rpn": {
    title: "Acetaminophen Toxicity for Practical Nurses",
    cellular: {
      title: "Hepatotoxicity Pathophysiology and N-Acetylcysteine Mechanism",
      content: "Acetaminophen (paracetamol, Tylenol) is one of the most commonly used over-the-counter analgesics and antipyretics worldwide, and acetaminophen overdose is the leading cause of acute liver failure in North America. At therapeutic doses (maximum 4 grams per day in healthy adults, 2 grams per day in patients with liver disease), approximately 90% of acetaminophen is metabolized in the liver through glucuronidation and sulfation (phase II conjugation reactions), producing non-toxic metabolites excreted by the kidneys. Approximately 5-10% is oxidized by the cytochrome P450 enzyme system (primarily CYP2E1) into a highly reactive toxic intermediate called N-acetyl-p-benzoquinone imine (NAPQI). Under normal circumstances, NAPQI is immediately detoxified by conjugation with glutathione (an endogenous antioxidant) to form non-toxic mercapturic acid and cysteine conjugates. In overdose situations, the glucuronidation and sulfation pathways become saturated, shunting a larger proportion of acetaminophen through the CYP2E1 pathway. This generates massive amounts of NAPQI that overwhelm the available glutathione stores. When glutathione is depleted below approximately 30% of normal levels, free NAPQI accumulates and binds covalently to hepatocyte proteins and mitochondrial structures, causing oxidative stress, mitochondrial dysfunction, and hepatocellular necrosis. The damage predominantly affects zone 3 (centrilobular region) of the hepatic acinus because CYP2E1 concentration is highest in this area. Hepatocellular necrosis releases intracellular enzymes (AST, ALT) into the bloodstream, with levels potentially exceeding 10,000 IU/L in severe cases. Progressive liver destruction impairs synthetic function (decreased albumin, decreased clotting factors causing coagulopathy with elevated INR/PT), conjugation function (rising bilirubin causing jaundice), and detoxification function (ammonia accumulation causing hepatic encephalopathy). The Rumack-Matthew nomogram is a clinical tool that plots serum acetaminophen concentration against time since ingestion (starting at 4 hours post-ingestion) to determine the risk of hepatotoxicity and the need for N-acetylcysteine (NAC) treatment. NAC works by replenishing glutathione stores, providing an alternative substrate for NAPQI conjugation, and enhancing the non-toxic sulfation and glucuronidation metabolic pathways. NAC is most effective when administered within 8 hours of ingestion but may still provide benefit up to 72 hours post-ingestion."
    },
    riskFactors: [
      "Chronic alcohol use (induces CYP2E1 enzyme activity, increasing NAPQI production, and depletes baseline glutathione stores)",
      "Chronic liver disease or hepatitis (reduced hepatic reserve for metabolism and reduced glutathione stores)",
      "Malnutrition or fasting state (depleted glutathione stores and reduced glucuronidation capacity)",
      "Concurrent use of CYP2E1-inducing medications (isoniazid, rifampin, phenytoin, carbamazepine, phenobarbital -- increase NAPQI production)",
      "Unintentional overdose from multiple acetaminophen-containing products (combination cold medications, prescription opioid-acetaminophen preparations)",
      "Pediatric patients (accidental ingestion) and elderly patients (impaired hepatic metabolism, polypharmacy)",
      "Intentional self-harm (acetaminophen is commonly used in suicide attempts due to widespread availability)"
    ],
    diagnostics: [
      "Serum acetaminophen level: draw at 4 hours post-ingestion (or immediately if time of ingestion is unknown or staggered); plot on Rumack-Matthew nomogram to determine treatment threshold",
      "Liver function tests (AST, ALT): AST and ALT begin rising 24-36 hours after toxic ingestion and can exceed 10,000 IU/L; ALT is more specific for hepatocellular damage",
      "PT/INR (prothrombin time/international normalized ratio): reflects hepatic synthetic function; rising INR indicates worsening coagulopathy and is a poor prognostic indicator",
      "Serum creatinine and BUN: monitor for hepatorenal syndrome; acute kidney injury can occur independently from direct acetaminophen nephrotoxicity",
      "Serum bilirubin: elevated in later stages (48-96 hours) as conjugation function deteriorates; jaundice indicates significant hepatocyte loss",
      "Blood glucose: hypoglycemia indicates severe hepatic dysfunction (impaired gluconeogenesis and glycogenolysis); frequent monitoring essential in stage III",
      "Arterial blood gas and serum lactate: metabolic acidosis (particularly pH below 7.30) is a component of the King's College criteria for liver transplant evaluation"
    ],
    management: [
      "N-acetylcysteine (NAC) protocol: administer if serum acetaminophen level falls above the treatment line on the Rumack-Matthew nomogram, or empirically if ingestion time is uncertain; oral 72-hour protocol or IV 21-hour protocol per facility preference",
      "Activated charcoal: administer 1 g/kg (maximum 50 g) orally if patient presents within 1-2 hours of ingestion and airway is protected; most effective within 1 hour; contraindicated if altered consciousness without airway protection",
      "IV fluid resuscitation: maintain hydration and support renal perfusion; monitor urine output closely (target greater than 0.5 mL/kg/hour)",
      "Correct coagulopathy: fresh frozen plasma or vitamin K as ordered for active bleeding or invasive procedures; do not routinely correct INR as it is used as a prognostic marker",
      "Monitor for and manage hepatic encephalopathy: lactulose for ammonia reduction, neurological checks every 2-4 hours, seizure precautions",
      "Transfer to tertiary care center with liver transplant capability if King's College criteria are met (arterial pH below 7.30 after resuscitation, or INR above 6.5 plus creatinine above 3.4 mg/dL plus grade III-IV encephalopathy)",
      "Psychiatric consultation for intentional overdose: ensure patient safety with 1:1 monitoring; do not discharge until psychiatric evaluation is completed"
    ],
    nursingActions: [
      "Obtain a thorough ingestion history: determine the exact amount ingested, time of ingestion (single acute vs. staggered/repeated supratherapeutic), formulation (immediate-release vs. extended-release), and any co-ingestants",
      "Draw serum acetaminophen level at 4 hours post-ingestion; if presentation is delayed or time unknown, draw immediately and begin NAC treatment pending results",
      "Monitor liver function tests (AST, ALT) every 12-24 hours to trend hepatocellular damage; report rising values or values exceeding 1000 IU/L immediately",
      "Assess for signs of hepatotoxicity progression: right upper quadrant pain and tenderness, jaundice (scleral icterus first), confusion (encephalopathy), bleeding (coagulopathy)",
      "Monitor for NAC adverse effects: IV NAC can cause anaphylactoid reactions (flushing, urticaria, bronchospasm) especially during the loading dose; slow the infusion rate if reactions occur",
      "Maintain accurate intake and output records; report urine output below 30 mL/hour as it may indicate hepatorenal syndrome",
      "Implement suicide precautions for intentional overdose: remove potentially harmful items, maintain 1:1 observation, ensure safe environment, and document mental status assessments"
    ],
    assessmentFindings: [
      "Stage I (0-24 hours): often asymptomatic or mild nonspecific symptoms including nausea, vomiting, anorexia, malaise, diaphoresis; lab values may be normal -- do not be falsely reassured",
      "Stage II (24-72 hours): right upper quadrant pain and tenderness (hepatic capsule distension), rising AST/ALT (beginning hepatocellular necrosis), elevated PT/INR, possible oliguria",
      "Stage III (72-96 hours): peak hepatotoxicity with AST/ALT potentially exceeding 10,000 IU/L, jaundice, coagulopathy (markedly elevated INR), hepatic encephalopathy (confusion progressing to coma), hypoglycemia, lactic acidosis, possible multiorgan failure",
      "Stage IV (4 days to 2 weeks): recovery phase in survivors; gradual normalization of liver function tests over 1-3 weeks; complete hepatic regeneration is possible if patient survives the critical phase",
      "Hepatic encephalopathy signs: asterixis (liver flap), confusion, somnolence, fetor hepaticus (sweet musty breath odor), personality changes progressing to obtundation and coma"
    ],
    signs: {
      left: [
        "Nausea, vomiting, and anorexia (Stage I -- nonspecific)",
        "Malaise and diaphoresis",
        "Right upper quadrant discomfort beginning at 24 hours",
        "Mild elevation of AST/ALT on laboratory testing",
        "Decreased appetite and general weakness",
        "Pallor and mild tachycardia"
      ],
      right: [
        "AST/ALT exceeding 10,000 IU/L (massive hepatocellular necrosis)",
        "INR above 3.0 with clinical bleeding (coagulopathy)",
        "Jaundice (scleral icterus and skin yellowing)",
        "Hepatic encephalopathy: asterixis, confusion, progressing to coma",
        "Hypoglycemia refractory to dextrose infusion",
        "Metabolic acidosis (pH below 7.30) -- indicates need for transplant evaluation"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (NAC / Mucomyst / Acetadote)",
        type: "Antidote / glutathione precursor",
        action: "Replenishes depleted glutathione stores by providing cysteine (the rate-limiting amino acid for glutathione synthesis). Directly conjugates with NAPQI to form non-toxic metabolites. Enhances the non-toxic sulfation metabolic pathway for acetaminophen elimination. Also acts as a free radical scavenger and improves hepatic microcirculation and oxygen delivery.",
        sideEffects: "Oral: nausea, vomiting (common -- may require antiemetic pretreatment), diarrhea, foul taste and smell (sulfur-like). IV: anaphylactoid reactions during loading dose (flushing, urticaria, pruritus, bronchospasm, angioedema -- rate-related, not true allergy), nausea, vomiting",
        contra: "No absolute contraindications in acetaminophen toxicity -- benefit always outweighs risk. For IV NAC, caution in patients with asthma (increased bronchospasm risk during anaphylactoid reaction). Relative caution in patients with prior anaphylactoid reaction to NAC (pretreat with antihistamines and slow infusion rate).",
        pearl: "NAC is most effective when started within 8 hours of ingestion (virtually 100% hepatoprotective) but provides benefit even up to 72 hours post-ingestion. IV protocol: 150 mg/kg over 1 hour (loading), then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours. If anaphylactoid reaction occurs during IV loading dose, stop infusion, treat symptoms (diphenhydramine, albuterol), then restart at a slower rate -- do NOT permanently discontinue."
      },
      {
        name: "Activated Charcoal",
        type: "Adsorbent / GI decontaminant",
        action: "Provides a large surface area with multiple binding sites that adsorb (bind) acetaminophen and other ingested substances in the GI tract, preventing systemic absorption. Each gram of activated charcoal can adsorb approximately 100-200 mg of drug. Reduces bioavailability by trapping the drug in the GI lumen for fecal elimination.",
        sideEffects: "Black stools (expected), nausea, vomiting, constipation, abdominal cramping, aspiration pneumonitis if administered to patients with unprotected airway or altered consciousness",
        contra: "Unprotected airway or altered level of consciousness (aspiration risk); GI obstruction, perforation, or ileus; caustic substance ingestion (obscures endoscopic visualization); administration beyond 2 hours post-ingestion (markedly reduced effectiveness)",
        pearl: "Most effective when administered within 1 hour of acetaminophen ingestion. Standard dose is 1 g/kg (maximum 50 grams) mixed with water or sorbitol. If the patient vomits the charcoal, consider administering an antiemetic (ondansetron) and reattempting. Activated charcoal does NOT adsorb NAC significantly, so both can be administered -- but separate dosing by 1-2 hours if possible."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 receptor antagonist)",
        action: "Selectively blocks serotonin (5-HT3) receptors in the chemoreceptor trigger zone of the area postrema and on vagal afferent nerve terminals in the GI tract. Prevents nausea and vomiting signals from reaching the vomiting center in the medulla oblongata. Does not affect dopamine receptors (no extrapyramidal side effects).",
        sideEffects: "Headache (most common), constipation, dizziness, dose-dependent QT prolongation (risk of torsades de pointes at higher doses)",
        contra: "Congenital long QT syndrome; concurrent use with other QT-prolonging medications; known hypersensitivity. Use caution in patients with hepatic impairment (reduced clearance).",
        pearl: "Essential supportive medication in acetaminophen toxicity: controls vomiting to allow oral NAC and activated charcoal retention. Administer 4-8 mg IV or PO 30 minutes before oral NAC or activated charcoal. Maximum single IV dose is 16 mg. If vomiting persists despite ondansetron, switch to IV NAC protocol rather than persisting with oral route."
      }
    ],
    pearls: [
      "Acetaminophen toxicity is DECEPTIVE: patients are often asymptomatic or have only mild nausea during Stage I (first 24 hours) when intervention is most effective. Never be falsely reassured by the absence of symptoms in the first 24 hours after a significant ingestion.",
      "The Rumack-Matthew nomogram is only valid for single acute ingestions with a known time of ingestion, starting at 4 hours post-ingestion. For staggered overdoses, chronic supratherapeutic ingestion, or unknown ingestion time, start NAC empirically and consult poison control.",
      "NAC is virtually 100% hepatoprotective when administered within 8 hours of acute ingestion. Effectiveness decreases after 8 hours but still provides benefit up to 72 hours. When in doubt, give NAC -- the benefit always outweighs the risk.",
      "Check ALL medications for hidden acetaminophen content. Many combination products contain acetaminophen: Percocet (oxycodone/acetaminophen), Vicodin (hydrocodone/acetaminophen), NyQuil, Excedrin, and numerous cold and flu preparations. Unintentional overdose from multiple sources is extremely common.",
      "Rising INR is the single most important prognostic marker in acetaminophen toxicity. An INR that continues to rise despite NAC treatment indicates progressive hepatic synthetic failure and potential need for liver transplant evaluation.",
      "Monitor blood glucose every 4-6 hours in severe hepatotoxicity. Hypoglycemia indicates that the liver can no longer perform gluconeogenesis, a sign of severe hepatic failure. Treat with continuous dextrose infusion (D10W).",
      "All intentional acetaminophen overdose patients require psychiatric evaluation before discharge, regardless of medical severity. Implement suicide precautions including 1:1 observation, environmental safety assessment, and removal of potentially harmful items."
    ],
    quiz: [
      {
        question: "A patient presents to the emergency department 2 hours after ingesting a large amount of acetaminophen. The patient is alert and reports only mild nausea. The practical nurse understands that the absence of severe symptoms at this time indicates which of the following?",
        options: [
          "The ingestion was not significant and the patient can be discharged",
          "This is Stage I of acetaminophen toxicity and the patient may still develop hepatotoxicity despite appearing well",
          "The patient did not actually ingest a toxic amount",
          "Liver damage would already be apparent if the ingestion was dangerous"
        ],
        correct: 1,
        rationale: "Stage I of acetaminophen toxicity (0-24 hours) is characterized by absent or mild nonspecific symptoms (nausea, vomiting, malaise) even after potentially fatal ingestions. Hepatocellular damage does not manifest clinically until Stage II (24-72 hours). The serum acetaminophen level at 4 hours post-ingestion plotted on the Rumack-Matthew nomogram determines the need for NAC treatment, not the presence or absence of symptoms."
      },
      {
        question: "N-acetylcysteine (NAC) is administered to a patient with acetaminophen overdose. The practical nurse understands that NAC protects the liver primarily by which mechanism?",
        options: [
          "Directly neutralizing acetaminophen in the bloodstream before it reaches the liver",
          "Replenishing glutathione stores to detoxify the toxic metabolite NAPQI",
          "Blocking the absorption of acetaminophen from the gastrointestinal tract",
          "Stimulating hepatocyte regeneration to replace damaged liver cells"
        ],
        correct: 1,
        rationale: "NAC works primarily by replenishing glutathione stores in the liver. Glutathione is the endogenous antioxidant that conjugates with the toxic metabolite NAPQI, converting it to non-toxic metabolites for renal excretion. NAC provides cysteine, the rate-limiting amino acid for glutathione synthesis. NAC does not neutralize acetaminophen directly, block absorption, or regenerate hepatocytes."
      },
      {
        question: "A patient with acetaminophen toxicity develops jaundice, confusion, and an INR of 5.2 on day 3 of hospitalization. The practical nurse recognizes these findings indicate which stage of toxicity?",
        options: [
          "Stage I -- initial presentation phase",
          "Stage II -- beginning of hepatic involvement",
          "Stage III -- peak hepatotoxicity with hepatic failure",
          "Stage IV -- recovery phase"
        ],
        correct: 2,
        rationale: "Stage III (72-96 hours) represents peak hepatotoxicity characterized by maximal AST/ALT elevation, jaundice (impaired bilirubin conjugation), coagulopathy with markedly elevated INR (impaired clotting factor synthesis), and hepatic encephalopathy (confusion from ammonia accumulation). These findings indicate severe hepatic failure and may warrant evaluation for liver transplant using the King's College criteria."
      }
    ]
  },

  "blood-glucose-monitoring-rpn": {
    title: "Blood Glucose Monitoring and Glycemic Management for Practical Nurses",
    cellular: {
      title: "Glucose Metabolism and Insulin Physiology",
      content: "Blood glucose regulation is a tightly controlled homeostatic process essential for cellular energy production and survival. Glucose is the primary energy substrate for the brain and central nervous system, which cannot store significant glycogen reserves and depends on a continuous supply from the bloodstream. Normal fasting blood glucose ranges from 3.9 to 5.5 mmol/L (70-100 mg/dL), and postprandial glucose should remain below 7.8 mmol/L (140 mg/dL) at 2 hours. Glucose homeostasis involves two primary pancreatic hormones with opposing actions: insulin (produced by beta cells in the islets of Langerhans) lowers blood glucose, while glucagon (produced by alpha cells) raises blood glucose. When blood glucose rises after a meal, beta cells sense the increase through GLUT2 glucose transporters and glucokinase enzymes. This triggers a cascade: increased ATP production closes ATP-sensitive potassium channels, causing membrane depolarization, opening voltage-gated calcium channels, and stimulating insulin granule exocytosis. Insulin binds to tyrosine kinase receptors on target cells (primarily muscle, liver, and adipose tissue), activating intracellular signaling cascades that translocate GLUT4 glucose transporters to the cell membrane, allowing glucose uptake. Insulin also stimulates glycogen synthesis in liver and muscle, lipogenesis in adipose tissue, and protein synthesis. In the fasting state, falling glucose levels stimulate glucagon release from alpha cells. Glucagon activates hepatic glycogenolysis (breakdown of stored glycogen to glucose) and gluconeogenesis (synthesis of new glucose from amino acids, lactate, and glycerol), raising blood glucose. In type 1 diabetes mellitus, autoimmune destruction of beta cells results in absolute insulin deficiency, requiring exogenous insulin replacement. In type 2 diabetes mellitus, insulin resistance at the cellular level (impaired receptor signaling and GLUT4 translocation) combined with progressive beta cell dysfunction leads to relative insulin deficiency. Hypoglycemia (blood glucose below 3.9 mmol/L or 70 mg/dL) triggers the counter-regulatory hormone response: epinephrine and norepinephrine cause tachycardia, tremor, diaphoresis, and anxiety (adrenergic symptoms); cortisol and growth hormone contribute to longer-term glucose restoration. Severe hypoglycemia (below 2.8 mmol/L or 50 mg/dL) causes neuroglycopenic symptoms (confusion, seizures, loss of consciousness) because the brain is being deprived of its primary fuel. Hyperglycemia leads to osmotic diuresis (glucose exceeds the renal threshold of approximately 10 mmol/L or 180 mg/dL, drawing water into the urine), causing polyuria, polydipsia, and dehydration. Sustained hyperglycemia causes protein glycation and oxidative stress, damaging blood vessels (microvascular: retinopathy, nephropathy, neuropathy; macrovascular: coronary artery disease, stroke, peripheral vascular disease)."
    },
    riskFactors: [
      "Type 1 diabetes mellitus (absolute insulin deficiency from autoimmune beta cell destruction)",
      "Type 2 diabetes mellitus (insulin resistance and progressive beta cell failure)",
      "Gestational diabetes (insulin resistance driven by placental hormones, typically developing in second or third trimester)",
      "Corticosteroid therapy (increases hepatic gluconeogenesis and induces insulin resistance -- steroid-induced hyperglycemia)",
      "Critical illness or physiological stress (counter-regulatory hormone surge increases blood glucose -- stress hyperglycemia)",
      "Malnutrition, NPO status, or missed meals (hypoglycemia risk, especially in patients receiving insulin or sulfonylureas)",
      "Hepatic or renal impairment (altered medication metabolism, impaired gluconeogenesis, reduced insulin clearance -- increased hypoglycemia risk)"
    ],
    diagnostics: [
      "Point-of-care capillary blood glucose (glucometer): bedside test using capillary blood from fingerstick; provides results in 5-10 seconds; accuracy within 15-20% of laboratory value",
      "Hemoglobin A1C (glycated hemoglobin): reflects average blood glucose over the preceding 2-3 months (lifespan of red blood cells); normal below 5.7%, prediabetes 5.7-6.4%, diabetes 6.5% or higher; target for most diabetic patients is below 7%",
      "Fasting plasma glucose (FPG): laboratory venous blood sample drawn after 8-hour fast; normal below 5.6 mmol/L (100 mg/dL); diagnostic of diabetes if 7.0 mmol/L (126 mg/dL) or higher on two occasions",
      "Oral glucose tolerance test (OGTT): measures glucose 2 hours after 75-gram glucose load; diagnostic of diabetes if 2-hour value is 11.1 mmol/L (200 mg/dL) or higher",
      "Random plasma glucose: diagnostic of diabetes if 11.1 mmol/L (200 mg/dL) or higher with classic symptoms (polyuria, polydipsia, unexplained weight loss)",
      "Urine ketones: test when blood glucose exceeds 13.9 mmol/L (250 mg/dL) in type 1 diabetes to detect ketoacidosis; positive ketones with hyperglycemia require immediate physician notification"
    ],
    management: [
      "Insulin therapy: rapid-acting insulin (lispro, aspart) for mealtime coverage with onset 15 minutes; regular insulin for sliding scale coverage with onset 30-60 minutes; long-acting insulin (glargine, detemir) for basal coverage",
      "Hypoglycemia treatment (Rule of 15): give 15 grams of fast-acting carbohydrate (4 glucose tablets, 120 mL juice, 15 mL sugar), recheck blood glucose in 15 minutes, repeat if still below 3.9 mmol/L (70 mg/dL), follow with protein snack once glucose normalizes",
      "Severe hypoglycemia (unconscious patient): administer glucagon 1 mg IM or SubQ; in hospital setting, administer dextrose 50% (D50W) 25-50 mL IV push; never give oral glucose or food to an unconscious patient (aspiration risk)",
      "Diabetic ketoacidosis (DKA) management: IV regular insulin infusion, aggressive IV fluid resuscitation (normal saline initially), potassium replacement (insulin drives potassium into cells), frequent glucose and potassium monitoring",
      "Blood glucose monitoring schedule: fasting (before breakfast), before meals, 2 hours after meals, and at bedtime for patients on insulin; more frequent monitoring during illness, medication changes, or unstable glycemic control",
      "Sick day rules for diabetic patients: continue insulin (never stop), check blood glucose every 4 hours, check urine ketones, maintain hydration, contact prescriber if glucose remains above 13.9 mmol/L (250 mg/dL) or ketones are positive"
    ],
    nursingActions: [
      "Perform capillary blood glucose monitoring using proper technique: verify glucometer calibration, use correct test strip, cleanse site with alcohol and allow to dry, obtain adequate blood drop from side of fingertip, apply blood to test strip, document result and time",
      "Administer insulin using correct technique: verify the 5 rights, check insulin type and dose against the order, roll intermediate-acting insulin gently (do not shake), inject at 90-degree angle into subcutaneous tissue, rotate injection sites to prevent lipodystrophy",
      "Assess for signs and symptoms of hypoglycemia at every patient encounter: tremor, diaphoresis, tachycardia, pallor, hunger, irritability, confusion, slurred speech, seizure, loss of consciousness",
      "Assess for signs and symptoms of hyperglycemia: polyuria, polydipsia, polyphagia, blurred vision, fatigue, fruity breath odor (ketoacidosis), Kussmaul respirations (deep rapid breathing -- metabolic acidosis compensation), nausea, abdominal pain",
      "Coordinate insulin administration with meal delivery: rapid-acting insulin should be given within 15 minutes of meal; hold insulin and notify prescriber if patient is NPO, vomiting, or refusing to eat",
      "Document blood glucose values, insulin doses, time of administration, injection site used, and any signs of hypo- or hyperglycemia",
      "Educate patients on proper glucometer use, insulin self-injection technique, site rotation, sharps disposal, recognition of hypo/hyperglycemia symptoms, and when to seek emergency care"
    ],
    assessmentFindings: [
      "Hypoglycemia (adrenergic symptoms, glucose below 3.9 mmol/L): tremor, diaphoresis, tachycardia, palpitations, anxiety, hunger, pallor, tingling around lips",
      "Hypoglycemia (neuroglycopenic symptoms, glucose below 2.8 mmol/L): confusion, difficulty concentrating, slurred speech, visual disturbances, behavioral changes, seizures, loss of consciousness",
      "Hyperglycemia: polyuria (osmotic diuresis), polydipsia (compensatory thirst), polyphagia (cellular starvation despite high blood glucose), blurred vision, fatigue, slow wound healing",
      "Diabetic ketoacidosis (DKA): Kussmaul respirations, fruity (acetone) breath odor, nausea, vomiting, abdominal pain, dehydration (dry mucous membranes, poor skin turgor, tachycardia, hypotension), altered consciousness",
      "Hyperosmolar hyperglycemic state (HHS): extreme hyperglycemia (often above 33 mmol/L or 600 mg/dL), severe dehydration, altered consciousness progressing to coma, absence of significant ketosis",
      "Chronic hyperglycemia complications: decreased sensation in extremities (peripheral neuropathy), foot ulcers, visual changes (retinopathy), proteinuria (nephropathy)"
    ],
    signs: {
      left: [
        "Mild tremor and diaphoresis (early hypoglycemia)",
        "Increased thirst and frequent urination (mild hyperglycemia)",
        "Fatigue and blurred vision",
        "Blood glucose 4.0-10.0 mmol/L (72-180 mg/dL) -- manageable range",
        "Mild hunger and irritability",
        "Headache and difficulty concentrating"
      ],
      right: [
        "Seizures or loss of consciousness (severe hypoglycemia below 2.8 mmol/L)",
        "Kussmaul respirations with fruity breath odor (DKA)",
        "Blood glucose above 33 mmol/L (600 mg/dL) with altered consciousness (HHS)",
        "Severe dehydration with hypotension and tachycardia",
        "Positive urine ketones with blood glucose above 13.9 mmol/L (250 mg/dL)",
        "Unresponsiveness to verbal stimulation (neuroglycopenia or hyperosmolarity)"
      ]
    },
    medications: [
      {
        name: "Insulin Lispro (Humalog) / Insulin Aspart (NovoRapid)",
        type: "Rapid-acting insulin analog",
        action: "Binds to insulin receptors on muscle, liver, and adipose cells, activating intracellular signaling that translocates GLUT4 glucose transporters to the cell membrane. Promotes cellular glucose uptake, glycogen synthesis, lipogenesis, and protein synthesis while inhibiting hepatic glucose output. Onset within 15 minutes, peak at 1-2 hours, duration 3-5 hours.",
        sideEffects: "Hypoglycemia (most dangerous and common side effect), weight gain, lipodystrophy at injection sites (lipoatrophy or lipohypertrophy from repeated injections at same site), injection site reactions, hypokalemia (insulin drives potassium into cells)",
        contra: "Hypoglycemia (do not administer if blood glucose is below target range); known hypersensitivity to insulin or excipients",
        pearl: "Administer within 15 minutes BEFORE a meal or immediately after eating. MUST coordinate with meal delivery -- if patient is unable to eat, HOLD the rapid-acting insulin and notify the prescriber to prevent hypoglycemia. Always rotate injection sites (abdomen provides fastest absorption, followed by arms, thighs, buttocks). Never mix rapid-acting insulin analogs with long-acting insulin (glargine/detemir) in the same syringe."
      },
      {
        name: "Glucagon (GlucaGen)",
        type: "Pancreatic alpha cell hormone / hyperglycemic agent",
        action: "Binds to glucagon receptors on hepatocytes, activating adenylyl cyclase and increasing intracellular cyclic AMP (cAMP). This activates glycogen phosphorylase, which catalyzes glycogenolysis (breakdown of stored liver glycogen into glucose). Also stimulates hepatic gluconeogenesis. Raises blood glucose within 10-20 minutes of IM or SubQ injection.",
        sideEffects: "Nausea and vomiting (common -- position patient on side to prevent aspiration), transient hyperglycemia, headache, dizziness, injection site reactions",
        contra: "Pheochromocytoma (glucagon can stimulate catecholamine release causing hypertensive crisis); insulinoma (paradoxical insulin release); known hypersensitivity. Reduced effectiveness in patients with depleted glycogen stores (chronic malnutrition, alcohol use disorder, adrenal insufficiency).",
        pearl: "Use for SEVERE hypoglycemia when the patient is unconscious or unable to swallow safely. Administer 1 mg IM or SubQ. Position patient on their side (recovery position) to prevent aspiration from vomiting. Once the patient regains consciousness and can swallow safely, provide oral carbohydrates to replenish glycogen stores. Glucagon requires adequate hepatic glycogen stores to be effective -- it will NOT work in patients with depleted glycogen (severe malnutrition, chronic alcohol use)."
      },
      {
        name: "Dextrose 50% (D50W)",
        type: "Hypertonic glucose solution",
        action: "Provides immediately available exogenous glucose directly into the bloodstream via IV administration, bypassing the need for hepatic glycogenolysis or gluconeogenesis. Rapidly raises blood glucose concentration. Each 50 mL ampule of D50W provides 25 grams of dextrose.",
        sideEffects: "Hyperglycemia (rebound if over-corrected), phlebitis and venous irritation (hypertonic solution), tissue necrosis if extravasation occurs, fluid overload with excessive administration, transient hyperinsulinemia (rebound hypoglycemia possible)",
        contra: "Functional IV access must be confirmed before administration; avoid administration through small peripheral veins if possible (use largest available vein); intracranial hemorrhage (hyperglycemia may worsen neurological outcomes)",
        pearl: "Standard dose is 25-50 mL (12.5-25 grams dextrose) IV push for severe hypoglycemia in hospitalized patients. Administer slowly over 2-3 minutes through a large-bore IV. Recheck blood glucose 15 minutes after administration. Because D50W causes reactive hyperinsulinemia, patients may experience rebound hypoglycemia -- continue monitoring blood glucose every 15-30 minutes for 1-2 hours after treatment. In pediatric patients, use D10W or D25W to avoid hyperosmolar injury."
      }
    ],
    pearls: [
      "The Rule of 15 for hypoglycemia treatment: give 15 grams of fast-acting carbohydrate, wait 15 minutes, recheck glucose, repeat if still below 3.9 mmol/L (70 mg/dL). Fast-acting carbohydrate sources include 4 glucose tablets, 120 mL (4 oz) juice, or 15 mL (1 tablespoon) of sugar dissolved in water.",
      "NEVER give oral glucose or food to an unconscious or obtunded patient -- aspiration risk is life-threatening. Use glucagon IM/SubQ or dextrose 50% IV for severe hypoglycemia with altered consciousness.",
      "Always check blood glucose BEFORE administering insulin. Hold rapid-acting insulin if the patient is NPO, vomiting, or refusing to eat, and notify the prescriber. Administering mealtime insulin without ensuring food intake is a common cause of iatrogenic hypoglycemia.",
      "Rotate insulin injection sites to prevent lipodystrophy (lipohypertrophy or lipoatrophy). Lipohypertrophic tissue has unpredictable insulin absorption, leading to erratic blood glucose control. Rotate within the same body region (for consistency of absorption rate) but use different spots within that region.",
      "Glucometer accuracy depends on proper technique: use correct test strips (matched to the glucometer model), verify calibration, cleanse the puncture site with alcohol and allow to dry completely (residual alcohol can dilute the sample and give falsely low results), obtain an adequate hanging blood drop.",
      "The three classic symptoms of hyperglycemia are the '3 Ps': Polyuria (excessive urination from osmotic diuresis), Polydipsia (excessive thirst from dehydration), and Polyphagia (excessive hunger from cellular starvation). Report these symptoms along with blood glucose values to the prescriber.",
      "In DKA, always check serum potassium BEFORE starting insulin infusion. Insulin drives potassium into cells, and starting insulin when potassium is already low can cause fatal hypokalemia and cardiac arrest. Potassium replacement must begin concurrently with insulin therapy if potassium is below 5.3 mEq/L."
    ],
    quiz: [
      {
        question: "A practical nurse checks a patient's blood glucose and obtains a reading of 3.2 mmol/L (58 mg/dL). The patient is alert and oriented. What is the appropriate initial intervention?",
        options: [
          "Administer glucagon 1 mg IM immediately",
          "Give 15 grams of fast-acting carbohydrate and recheck glucose in 15 minutes",
          "Administer dextrose 50% IV push",
          "Hold all medications and wait for the next scheduled meal"
        ],
        correct: 1,
        rationale: "For a conscious, alert patient with hypoglycemia (below 3.9 mmol/L or 70 mg/dL), the Rule of 15 applies: administer 15 grams of fast-acting carbohydrate (such as 4 glucose tablets or 120 mL juice), recheck blood glucose in 15 minutes, and repeat if glucose remains low. Glucagon IM and D50W IV are reserved for severe hypoglycemia when the patient is unconscious or unable to swallow safely."
      },
      {
        question: "A practical nurse is preparing to administer rapid-acting insulin (lispro) before a meal. The patient states they feel too nauseated to eat. What is the most appropriate nursing action?",
        options: [
          "Administer the insulin as ordered since the physician prescribed it",
          "Hold the insulin, notify the prescriber, and document the finding",
          "Administer half the prescribed insulin dose",
          "Give the insulin after the patient has eaten at least some food"
        ],
        correct: 1,
        rationale: "Rapid-acting insulin must be coordinated with meal intake. If the patient is unable or unwilling to eat, the nurse should hold the rapid-acting insulin and notify the prescriber for further orders. Administering mealtime insulin without food intake will cause hypoglycemia. The nurse should never independently adjust the insulin dose without a prescriber order."
      },
      {
        question: "A patient with type 1 diabetes has a blood glucose of 16.5 mmol/L (297 mg/dL). Which additional assessment should the practical nurse perform?",
        options: [
          "Check for peripheral edema",
          "Auscultate bowel sounds in all four quadrants",
          "Test urine for ketones",
          "Perform a neurological assessment including cranial nerves"
        ],
        correct: 2,
        rationale: "When blood glucose exceeds 13.9 mmol/L (250 mg/dL) in a patient with type 1 diabetes, urine ketones should be tested to detect diabetic ketoacidosis (DKA). Type 1 diabetic patients are at high risk for DKA because they have absolute insulin deficiency. Positive ketones with hyperglycemia require immediate physician notification and intervention."
      }
    ]
  },

  "blood-typing-crossmatch-rpn": {
    title: "Blood Typing and Crossmatch for Practical Nurses",
    cellular: {
      title: "Immunohematology: ABO and Rh Antigen Systems",
      content: "Blood typing is based on the presence or absence of specific antigens on the surface of red blood cells (erythrocytes) and corresponding antibodies in the plasma. The ABO blood group system is the most clinically significant because ABO antibodies are naturally occurring (present without prior sensitization) and can cause fatal intravascular hemolysis if incompatible blood is transfused. The ABO system is determined by carbohydrate antigens attached to glycoproteins and glycolipids on the red blood cell membrane. The H antigen is the precursor molecule present on all red blood cells. The A gene encodes an enzyme (N-acetylgalactosamine transferase) that adds N-acetylgalactosamine to the H antigen, creating the A antigen. The B gene encodes an enzyme (galactose transferase) that adds galactose to the H antigen, creating the B antigen. Individuals with type O blood have neither A nor B transferase enzymes, so the H antigen remains unmodified. The critical immunological principle is that individuals develop antibodies against ABO antigens they LACK: type A individuals have anti-B antibodies (IgM), type B individuals have anti-A antibodies, type AB individuals have neither antibody (universal plasma recipient), and type O individuals have both anti-A and anti-B antibodies (universal red cell donor but universal plasma recipient is type AB). These naturally occurring IgM antibodies can activate the complement cascade and cause immediate intravascular hemolysis upon contact with incompatible red blood cells. The Rh (Rhesus) blood group system involves approximately 50 antigens, but the D antigen is the most immunogenic and clinically significant. Individuals are classified as Rh-positive (D antigen present, approximately 85% of the population) or Rh-negative (D antigen absent). Unlike ABO antibodies, anti-D antibodies are NOT naturally occurring -- they develop only after exposure to D-positive red blood cells through transfusion or pregnancy. This is why Rh-negative mothers can develop anti-D antibodies after carrying an Rh-positive fetus (Rh sensitization), leading to hemolytic disease of the fetus and newborn (HDFN/erythroblastosis fetalis) in subsequent Rh-positive pregnancies. RhoGAM (Rh immune globulin) prevents sensitization by binding to fetal D-positive red blood cells in the maternal circulation before the mother's immune system can mount a response. Crossmatching is the final compatibility test performed before transfusion: donor red blood cells are mixed with recipient serum in the laboratory. If the recipient has antibodies against donor red blood cell antigens, agglutination (clumping) or hemolysis will occur, indicating incompatibility. A compatible crossmatch shows no agglutination or hemolysis, confirming that the specific donor unit is safe for the specific recipient. The type and screen (T&S) identifies the patient's ABO/Rh type and screens for unexpected alloantibodies, while the crossmatch tests compatibility between a specific donor unit and the patient."
    },
    riskFactors: [
      "Clerical and identification errors (the most common cause of fatal ABO-incompatible transfusions -- wrong blood drawn, wrong label applied, or wrong unit administered to wrong patient)",
      "Multiple previous transfusions (increased exposure to foreign red blood cell antigens promotes alloantibody formation, complicating future crossmatching)",
      "Multiparous women (exposure to fetal red blood cell antigens during pregnancy and delivery can cause alloantibody formation)",
      "Rh-negative women of childbearing age (risk of Rh sensitization from Rh-positive transfusion or Rh-positive pregnancy)",
      "Autoimmune hemolytic anemia (autoantibodies interfere with blood typing and crossmatching, making compatible blood difficult to find)",
      "Sickle cell disease patients (frequently transfused, high rate of alloantibody formation; require phenotypically matched blood for C, E, and Kell antigens)",
      "Emergency transfusion situations (type-specific or O-negative blood may be issued before full crossmatch is completed, increasing reaction risk)"
    ],
    diagnostics: [
      "ABO forward typing (cell typing): patient's red blood cells are mixed with known anti-A and anti-B sera to determine which antigens are present on the cell surface",
      "ABO reverse typing (serum typing): patient's serum is mixed with known A and B red blood cells to identify which antibodies are present; must agree with forward typing for valid result",
      "Rh typing: patient's red blood cells are tested with anti-D reagent to determine Rh-positive or Rh-negative status; weak D testing may be performed for patients with initially negative results",
      "Antibody screen (indirect antiglobulin test/indirect Coombs test): patient's serum is tested against a panel of reagent red blood cells with known antigens to detect unexpected alloantibodies",
      "Crossmatch (major crossmatch): patient's serum is mixed with donor red blood cells from the specific unit to be transfused; checks for compatibility at immediate spin, 37 degrees Celsius, and antiglobulin phases",
      "Direct antiglobulin test (DAT/direct Coombs test): detects antibodies or complement already bound to patient's red blood cells in vivo; positive in autoimmune hemolytic anemia, hemolytic transfusion reactions, and hemolytic disease of the newborn"
    ],
    management: [
      "Type and screen (T&S): order when transfusion is anticipated but not immediately needed (elective surgery, prenatal care); valid for 72 hours if patient has not been transfused or pregnant in the past 3 months",
      "Type and crossmatch (T&C): order when transfusion is likely to be needed; specifies the number of units to be crossmatched and held in reserve",
      "Emergency transfusion protocol: when blood is needed before crossmatch can be completed, use O-negative packed RBCs (universal donor for RBCs) or type-specific uncrossmatched blood; switch to fully crossmatched blood as soon as available",
      "RhoGAM (Rh immune globulin) administration: give to Rh-negative mothers at 28 weeks gestation and within 72 hours of delivery of an Rh-positive infant, after amniocentesis, after miscarriage or abortion, or after any event that may cause fetomaternal hemorrhage",
      "Massive transfusion protocol: activated when patient requires more than 10 units of packed RBCs in 24 hours; includes fixed ratio of RBCs, fresh frozen plasma, and platelets; monitor for coagulopathy, hypothermia, and hypocalcemia (citrate in stored blood binds calcium)",
      "Autologous blood donation: patient donates their own blood before elective surgery to avoid allogeneic transfusion risks; scheduled 4-6 weeks before surgery to allow hematopoietic recovery"
    ],
    nursingActions: [
      "Collect blood samples for type and screen/crossmatch using proper technique: verify patient identity with TWO identifiers, label tubes AT THE BEDSIDE immediately after collection (never pre-label), include patient name, date of birth, medical record number, date and time, and collector's initials",
      "Perform the bedside verification check before initiating transfusion: TWO qualified staff members must independently verify patient identity (two identifiers), blood type (patient vs. donor unit), Rh factor, unit number, and expiration date against the blood bank tag and patient wristband",
      "Never transfuse blood that has been out of the blood bank refrigerator for more than 30 minutes without starting the infusion; each unit must be completed within 4 hours to prevent bacterial growth",
      "Use a blood administration set with a 170-260 micron inline filter; prime with 0.9% normal saline only (never use lactated Ringer solution or dextrose -- they cause hemolysis)",
      "Obtain baseline vital signs before starting transfusion; monitor at 15 minutes, 30 minutes, 1 hour, and upon completion; remain with patient for the first 15 minutes",
      "Report any discrepancy in the verification process immediately -- DO NOT proceed with the transfusion until all discrepancies are resolved; even minor labeling errors warrant investigation",
      "For Rh-negative female patients of childbearing age, ensure that only Rh-negative blood products are administered to prevent Rh sensitization that could affect future pregnancies"
    ],
    assessmentFindings: [
      "Pre-transfusion assessment: verify current type and screen results, check hemoglobin and hematocrit (indication for transfusion), assess for history of previous transfusion reactions, verify IV access with 18-20 gauge catheter",
      "During transfusion: monitor for signs of any reaction type -- fever, chills, rigors, urticaria, pruritus, dyspnea, chest pain, back pain, flank pain, dark urine, hypotension, tachycardia",
      "ABO incompatibility reaction: fever, chills, chest tightness, flank/back pain, hypotension, tachycardia, hemoglobinuria (dark red-brown urine), sense of impending doom -- onset within minutes",
      "Post-transfusion assessment: repeat vital signs, assess for delayed reactions (which may occur 2-14 days post-transfusion), check post-transfusion hemoglobin (each unit of PRBCs should raise hemoglobin by approximately 10 g/L or 1 g/dL)",
      "Rh sensitization assessment in pregnancy: indirect Coombs test (antibody screen) at first prenatal visit and at 28 weeks; positive result indicates maternal anti-D antibodies that can cross the placenta and attack fetal Rh-positive red blood cells"
    ],
    signs: {
      left: [
        "Mild anxiety about receiving blood products (common, requires reassurance)",
        "Slight temperature variation within 0.5 degrees of baseline",
        "IV site discomfort or mild phlebitis",
        "Mild itching without hives (monitor closely)",
        "Fatigue and pallor (indication for transfusion)",
        "Headache during or after transfusion"
      ],
      right: [
        "Acute hemolytic reaction: fever, rigors, back pain, hemoglobinuria, hypotension (ABO incompatibility)",
        "Anaphylaxis: bronchospasm, angioedema, cardiovascular collapse",
        "Transfusion-associated circulatory overload: acute dyspnea, crackles, JVD, hypertension",
        "TRALI: acute respiratory distress, bilateral infiltrates, hypoxemia within 6 hours",
        "DIC: petechiae, oozing from IV sites, prolonged PT/PTT, decreased fibrinogen",
        "Severe hypotension unresponsive to fluid resuscitation"
      ]
    },
    medications: [
      {
        name: "Rh Immune Globulin (RhoGAM)",
        type: "Immune globulin / anti-D immunoglobulin",
        action: "Contains concentrated anti-D (Rh) antibodies that bind to Rh-positive fetal red blood cells circulating in the Rh-negative mother's bloodstream, coating them for removal by the maternal reticuloendothelial system before the mother's immune system can recognize the D antigen and produce its own anti-D antibodies. This prevents primary Rh sensitization.",
        sideEffects: "Injection site pain and tenderness, low-grade fever, mild myalgia, rarely allergic reaction. Does not cause hemolytic disease because the amount of anti-D in a standard dose is insufficient to cause significant hemolysis of the fetus.",
        contra: "Rh-positive patients (no benefit); patients who are already Rh-sensitized (anti-D antibodies already present -- RhoGAM cannot reverse existing sensitization); IgA deficiency with anti-IgA antibodies (risk of anaphylaxis); known hypersensitivity to human immune globulin",
        pearl: "Standard dose is 300 mcg IM at 28 weeks gestation and within 72 hours of delivery of an Rh-positive infant. Also given after amniocentesis, chorionic villus sampling, abdominal trauma, ectopic pregnancy, miscarriage, or elective termination. A Kleihauer-Betke test determines if additional doses are needed for large fetomaternal hemorrhages (each 300 mcg dose covers approximately 30 mL of fetal whole blood)."
      },
      {
        name: "Normal Saline 0.9% (Sodium Chloride)",
        type: "Isotonic crystalloid IV solution",
        action: "Provides isotonic fluid replacement that expands intravascular volume without causing red blood cell lysis. The only IV solution compatible with blood products because its osmolarity (308 mOsm/L) is similar to plasma and does not cause hemolysis. Used to prime blood tubing and maintain IV patency between and during transfusions.",
        sideEffects: "Fluid overload (if infused rapidly or in large volumes), hypernatremia, hyperchloremic metabolic acidosis (with large-volume resuscitation), peripheral edema",
        contra: "Caution in heart failure patients (fluid overload risk); hypernatremia; careful volume monitoring in patients with renal impairment",
        pearl: "The ONLY compatible IV solution for use with blood products. Never use lactated Ringer solution (contains calcium which can cause clotting in the blood tubing) or dextrose solutions (hypotonic environment causes red blood cell lysis). Always prime blood tubing with normal saline before connecting blood product. Keep a bag of normal saline connected to maintain IV access if the transfusion must be stopped."
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-2 chloride cotransporter (NKCC2) in the thick ascending limb of the loop of Henle, preventing sodium, potassium, and chloride reabsorption. This produces potent diuresis, reducing intravascular volume and relieving pulmonary congestion. Onset of action is 5 minutes IV, 30-60 minutes oral.",
        sideEffects: "Hypokalemia (most significant -- monitor potassium levels), hyponatremia, hypomagnesemia, hypocalcemia, dehydration, hypotension, ototoxicity (especially with rapid IV administration or concurrent aminoglycosides), hyperglycemia, hyperuricemia",
        contra: "Anuria (no urine production); severe electrolyte depletion; hepatic coma; known hypersensitivity to furosemide or sulfonamides (cross-sensitivity)",
        pearl: "May be administered between units of blood products for patients at risk of transfusion-associated circulatory overload (TACO), such as those with heart failure or chronic anemia with compensatory volume expansion. Typical dose is 20-40 mg IV push (administer no faster than 4 mg/min to prevent ototoxicity). Monitor potassium level before and after administration. May be ordered prophylactically before transfusion in high-risk patients."
      }
    ],
    pearls: [
      "The MOST CRITICAL step in blood transfusion safety is correct patient identification and sample labeling. The majority of fatal hemolytic transfusion reactions result from clerical errors: wrong patient's blood drawn, wrong label applied, or wrong unit given to wrong patient. NEVER pre-label blood bank tubes -- label at the bedside immediately after collection.",
      "ABO compatibility for packed red blood cells: Type O is the universal RBC donor (no A or B antigens). Type AB is the universal RBC recipient (no anti-A or anti-B antibodies). For plasma: Type AB is the universal plasma donor (no antibodies). Type O is the universal plasma recipient.",
      "Rh-negative women of childbearing age should ALWAYS receive Rh-negative blood products to prevent Rh sensitization. An Rh-negative woman who receives Rh-positive blood can develop anti-D antibodies that may cause hemolytic disease in future Rh-positive pregnancies.",
      "The crossmatch is valid for 72 hours in patients who have not been transfused or pregnant in the past 3 months. Patients who have been recently transfused or pregnant may have developed new alloantibodies and require a fresh crossmatch specimen.",
      "Normal saline (0.9% NaCl) is the ONLY IV solution compatible with blood products. Lactated Ringer contains calcium, which can trigger clotting in the blood tubing. Dextrose solutions are hypotonic and cause red blood cell hemolysis. Never add medications to blood products.",
      "Each unit of packed RBCs typically raises hemoglobin by approximately 10 g/L (1 g/dL) and hematocrit by approximately 3% in a non-bleeding adult patient. If the expected rise does not occur, investigate for ongoing bleeding, hemolysis, or fluid overload dilution.",
      "In emergency situations when the patient's blood type is unknown, transfuse O-negative packed RBCs (universal donor). For plasma, use AB plasma (universal donor). Once the patient's blood type is determined, switch to type-specific products. Document all emergency-release blood products and follow up with complete crossmatch as soon as possible."
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to collect a blood sample for type and crossmatch. Which action is most important to prevent a transfusion error?",
        options: [
          "Pre-label the collection tubes with the patient's information before entering the room",
          "Verify the patient's identity with two identifiers and label tubes at the bedside immediately after collection",
          "Use the room number to confirm the correct patient",
          "Have a family member verbally confirm the patient's name"
        ],
        correct: 1,
        rationale: "Blood bank specimens must be labeled at the bedside immediately after collection, using two patient identifiers (name and date of birth or medical record number) verified against the patient wristband. Pre-labeling tubes before collection is a major error that can lead to wrong-patient samples and fatal ABO-incompatible transfusions. Room numbers are never used as identifiers. Family members are not a reliable sole source of identification."
      },
      {
        question: "An Rh-negative patient requires an emergency blood transfusion, but their crossmatch results are not yet available. Which blood product should the practical nurse anticipate the physician ordering?",
        options: [
          "Type A-positive packed red blood cells",
          "Type O-negative packed red blood cells",
          "Type AB-positive packed red blood cells",
          "Type B-negative packed red blood cells"
        ],
        correct: 1,
        rationale: "O-negative packed red blood cells are the universal donor for emergency situations because they have no A, B, or D antigens on the red blood cell surface, meaning they will not react with any ABO or Rh antibodies in the recipient's plasma. This is the safest choice when the patient's blood type is unknown or crossmatch results are pending. Giving Rh-positive blood to an Rh-negative patient risks Rh sensitization."
      },
      {
        question: "A practical nurse is reviewing blood type compatibility. A patient with type AB-positive blood can safely receive packed red blood cells from which donor type(s)?",
        options: [
          "Type AB-positive only",
          "Type O-negative only",
          "Any ABO and Rh type (A, B, AB, O, positive or negative)",
          "Type A and Type B only"
        ],
        correct: 2,
        rationale: "Type AB-positive is the universal recipient for packed red blood cells. AB-positive patients have both A and B antigens on their cells and the D (Rh) antigen, so their plasma contains no anti-A, anti-B, or anti-D antibodies. They can receive red blood cells of any ABO and Rh type without risk of an immune-mediated hemolytic reaction."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} skipped`);
