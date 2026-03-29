import crypto from "crypto";
import pg from "pg";

const pool = new pg.Pool({ host: process.env.PGHOST || "helium", user: process.env.PGUSER || "postgres", password: process.env.PGPASSWORD || "password", database: process.env.PGDATABASE || "heliumdb", ssl: false });
function sh(t: string): string { return crypto.createHash("sha256").update(t.trim().toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ")).digest("hex").substring(0,16); }
const O = (l: string, t: string) => ({ label: l, text: t });

interface Q { tier:string; exam:string; stem:string; options:{label:string;text:string}[]; ca:string[]; rat:string; diff:number; tags:string[]; topic:string; sub:string; rs:string; cp:string; bs:string; }

function build(): Q[] {
  const qs: Q[] = [];

  // ========== PARAMETRIC: Lab Value Interpretation ==========
  const labs = [
    { lab: "serum sodium", value: "128 mEq/L", normal: "136-145 mEq/L", condition: "hyponatremia", causes: "SIADH, excessive water intake, diuretic use, heart failure, liver cirrhosis, or vomiting/diarrhea", symptoms: "headache, confusion, lethargy, muscle cramps, nausea, seizures; severe hyponatremia (<120) can cause cerebral edema and death", intervention: "fluid restriction for dilutional causes, IV hypertonic saline (3% NaCl) for severe symptomatic cases (correct slowly, no more than 8-12 mEq/L in 24 hours to prevent osmotic demyelination syndrome)", tags: ["sodium","hyponatremia","electrolyte","SIADH","fluid-restriction"] },
    { lab: "serum potassium", value: "6.2 mEq/L", normal: "3.5-5.0 mEq/L", condition: "hyperkalemia", causes: "renal failure, ACE inhibitors, potassium-sparing diuretics, potassium supplements, metabolic acidosis, tissue destruction (burns, crush injuries), or hemolyzed blood sample (false positive)", symptoms: "muscle weakness, paresthesias, cardiac dysrhythmias (peaked T waves, widened QRS, sine wave → cardiac arrest); ECG changes are the most dangerous manifestation", intervention: "cardiac monitoring immediately, IV calcium gluconate (stabilizes cardiac membrane), regular insulin + dextrose (shifts K+ intracellularly), sodium bicarbonate (shifts K+ intracellularly), kayexalate (removes K+ via GI tract), emergent dialysis for severe/refractory cases", tags: ["potassium","hyperkalemia","electrolyte","cardiac","renal-failure"] },
    { lab: "serum calcium", value: "12.8 mg/dL", normal: "8.5-10.5 mg/dL", condition: "hypercalcemia", causes: "hyperparathyroidism (#1 cause in outpatients), malignancy (#1 cause in hospitalized patients), prolonged immobilization, thiazide diuretics, excessive vitamin D supplementation, or granulomatous diseases", symptoms: "bones (bone pain, pathological fractures), stones (kidney stones), groans (abdominal pain, constipation, nausea/vomiting), and psychiatric moans (confusion, lethargy, depression, psychosis); severe hypercalcemia can cause cardiac arrest", intervention: "aggressive IV normal saline hydration (200-500 mL/hr initially to promote renal calcium excretion), loop diuretics (furosemide after adequate hydration), calcitonin (rapid but temporary effect), bisphosphonates (zoledronic acid for malignancy), treat underlying cause", tags: ["calcium","hypercalcemia","electrolyte","parathyroid","malignancy"] },
    { lab: "serum magnesium", value: "1.0 mEq/L", normal: "1.5-2.5 mEq/L", condition: "hypomagnesemia", causes: "chronic alcoholism (#1 cause), malnutrition, GI losses (diarrhea, NG suction), diuretics (loop and thiazide), proton pump inhibitors (long-term use), and renal wasting", symptoms: "neuromuscular excitability (tremors, hyperreflexia, tetany, positive Trousseau's and Chvostek's signs similar to hypocalcemia), cardiac dysrhythmias (torsades de pointes, PVCs), seizures; hypomagnesemia often coexists with and CAUSES refractory hypokalemia and hypocalcemia", intervention: "IV magnesium sulfate for symptomatic/severe cases (infuse slowly, monitor for respiratory depression), oral magnesium supplements for mild cases, monitor deep tendon reflexes (loss of DTRs is the first sign of magnesium toxicity)", tags: ["magnesium","hypomagnesemia","electrolyte","alcoholism","torsades"] },
    { lab: "blood glucose (fasting)", value: "38 mg/dL", normal: "70-100 mg/dL", condition: "hypoglycemia", causes: "insulin overdose, sulfonylurea use, skipped meals, excessive exercise, liver disease, sepsis, or adrenal insufficiency", symptoms: "Whipple's triad: (1) symptoms of hypoglycemia (tremor, diaphoresis, tachycardia, anxiety, confusion, dizziness, hunger), (2) documented low blood glucose <70 mg/dL, (3) resolution of symptoms with glucose administration; severe hypoglycemia can cause seizures, loss of consciousness, and death", intervention: "for conscious patients: give 15-20g of fast-acting carbohydrates (4 oz juice, glucose tablets), recheck in 15 minutes (Rule of 15); for unconscious patients: IV dextrose 50% (D50W) 25-50 mL push, or glucagon 1 mg IM/SubQ if no IV access; follow with complex carbohydrate snack once alert", tags: ["glucose","hypoglycemia","insulin","Rule-of-15","emergency"] },
    { lab: "hemoglobin A1C", value: "9.8%", normal: "<5.7% (normal), 5.7-6.4% (prediabetes), ≥6.5% (diabetes)", condition: "poorly controlled diabetes mellitus", causes: "persistent hyperglycemia over the past 2-3 months; the HbA1c reflects the average blood glucose level over the lifespan of red blood cells (approximately 120 days)", symptoms: "the elevated A1C itself is asymptomatic but indicates chronic hyperglycemia that accelerates microvascular complications (retinopathy, nephropathy, neuropathy) and macrovascular complications (coronary artery disease, peripheral vascular disease, cerebrovascular disease)", intervention: "review and intensify the diabetes management plan: medication adjustment, dietary counseling, exercise plan, glucose self-monitoring education, and assessment of barriers to adherence; the ADA target A1C for most adults is <7%", tags: ["HbA1c","diabetes","glycemic-control","complications","monitoring"] },
    { lab: "BUN (blood urea nitrogen)", value: "52 mg/dL", normal: "7-20 mg/dL", condition: "elevated BUN indicating azotemia", causes: "dehydration (prerenal - BUN:Cr ratio >20:1), renal failure (intrarenal - BUN:Cr ratio 10-15:1), urinary obstruction (postrenal), high-protein diet, GI bleeding (blood is a protein source that is metabolized to urea), and catabolic states", symptoms: "uremic symptoms at very high levels: nausea, vomiting, metallic taste, pruritus, asterixis, pericardial friction rub, confusion, and uremic frost (crystallized urea on skin in severe cases)", intervention: "identify the cause (prerenal, intrarenal, postrenal), IV fluid resuscitation for dehydration, adjust nephrotoxic medications, monitor strict I&O, dietary protein restriction in chronic kidney disease, prepare for possible dialysis if symptomatic uremia develops", tags: ["BUN","azotemia","renal-function","uremia","kidney"] },
    { lab: "troponin I", value: "2.4 ng/mL", normal: "<0.04 ng/mL", condition: "elevated cardiac troponin indicating myocardial injury", causes: "acute myocardial infarction (most common and most clinically significant cause), myocarditis, heart failure, pulmonary embolism, sepsis, renal failure (chronic mild elevation), cardiac contusion, or post-cardiac procedure", symptoms: "in the context of MI: chest pain/pressure, radiation to left arm/jaw/back, diaphoresis, dyspnea, nausea; troponin rises within 3-6 hours of myocardial injury, peaks at 12-24 hours, and remains elevated for 7-14 days", intervention: "treat as acute coronary syndrome until proven otherwise: 12-lead ECG stat, serial troponins every 3-6 hours (rising pattern confirms MI), aspirin 325 mg, anticoagulation (heparin), cardiac catheterization for STEMI or high-risk NSTEMI, morphine for pain, oxygen if SpO2 <94%, beta-blocker if not contraindicated", tags: ["troponin","MI","cardiac-biomarker","acute-coronary-syndrome","STEMI"] },
  ];

  for (const l of labs) {
    // Generate both RN and PN versions
    qs.push({ tier: "rn", exam: "NCLEX-RN", stem: `An RN reviews laboratory results and notes the patient's ${l.lab} level is ${l.value} (normal range: ${l.normal}). The patient has been diagnosed with ${l.condition}. What is the clinical significance of this finding and the appropriate nursing intervention?`,
      options: [
        O("A", "This is a normal lab value that requires no intervention"),
        O("B", `This ${l.value} indicates ${l.condition}. Common causes include ${l.causes}. Clinical significance: ${l.symptoms}. Nursing intervention: ${l.intervention}`),
        O("C", "Repeat the test in one week without any immediate action"),
        O("D", "Discharge the patient since this is a minor laboratory variation"),
      ],
      ca: ["B"], rat: `A ${l.lab} level of ${l.value} is outside the normal range (${l.normal}) and indicates ${l.condition}. ${l.symptoms}. ${l.intervention}. The nurse must correlate laboratory values with clinical assessment findings to determine the urgency and appropriate interventions.`,
      diff: 3, tags: l.tags, topic: "Laboratory Interpretation", sub: "Electrolytes & Chemistry", rs: "BOTH",
      cp: `${l.lab} ${l.value} = ${l.condition}; normal ${l.normal}`, bs: "Physiological Integrity" });

    qs.push({ tier: "rpn", exam: "NCLEX-PN", stem: `An LPN is reviewing a patient's lab results and notes the ${l.lab} level is ${l.value} (reference range: ${l.normal}). This finding is consistent with ${l.condition}. Which assessment finding should the LPN monitor for?`,
      options: [
        O("A", "No monitoring is needed as this value is within normal limits"),
        O("B", `Monitor for: ${l.symptoms}. This abnormality can be caused by ${l.causes}. The LPN should report this finding to the RN or physician promptly and anticipate orders for intervention`),
        O("C", "Monitor only the patient's temperature as the primary concern"),
        O("D", "This laboratory value is unrelated to clinical symptoms"),
      ],
      ca: ["B"], rat: `A ${l.lab} level of ${l.value} is abnormal (normal: ${l.normal}) and indicates ${l.condition}. The LPN should monitor for associated symptoms: ${l.symptoms}. Recognizing the significance of abnormal lab values and promptly reporting them is within the LPN's scope of practice.`,
      diff: 2, tags: l.tags, topic: "Laboratory Interpretation", sub: "Lab Value Monitoring", rs: "US",
      cp: `${l.lab} ${l.value} = ${l.condition}; monitor for ${l.symptoms.substring(0,50)}`, bs: "Physiological Integrity" });
  }

  // ========== PARAMETRIC: Drug Side Effects ==========
  const drugSE = [
    { drug: "metoprolol (Lopressor)", class: "beta-blocker", sideEffects: "bradycardia, hypotension, fatigue, dizziness, bronchospasm (contraindicated in asthma/COPD), masked hypoglycemia symptoms in diabetics, cold extremities, depression", holdParam: "Hold if HR <60 bpm or SBP <100 mmHg", critical: "Never abruptly discontinue beta-blockers; taper gradually over 1-2 weeks to prevent rebound tachycardia, hypertension, and myocardial ischemia", tags: ["beta-blocker","metoprolol","bradycardia","antihypertensive","cardiac"] },
    { drug: "furosemide (Lasix)", class: "loop diuretic", sideEffects: "hypokalemia (most significant - can cause fatal cardiac dysrhythmias), hyponatremia, hypocalcemia, hypomagnesemia, hypotension, dehydration, ototoxicity (especially with rapid IV administration or concurrent aminoglycosides), hyperglycemia, hyperuricemia (gout)", holdParam: "Monitor electrolytes especially potassium; hold if K+ <3.0 mEq/L", critical: "Administer IV furosemide no faster than 4 mg/min to prevent ototoxicity; encourage potassium-rich foods (bananas, oranges, potatoes) or administer prescribed potassium supplements", tags: ["loop-diuretic","furosemide","hypokalemia","ototoxicity","electrolyte"] },
    { drug: "lisinopril (Zestril)", class: "ACE inhibitor", sideEffects: "dry persistent cough (5-35% of patients, from bradykinin accumulation), hyperkalemia, hypotension (especially first dose), angioedema (rare but life-threatening swelling of face/lips/tongue/throat), acute kidney injury in bilateral renal artery stenosis, teratogenic (CONTRAINDICATED in pregnancy)", holdParam: "Hold if SBP <90 mmHg; monitor serum creatinine and potassium", critical: "Angioedema is a medical emergency requiring immediate discontinuation and airway management; the ACE inhibitor cough is NOT dangerous but may necessitate switching to an ARB", tags: ["ACE-inhibitor","lisinopril","cough","angioedema","hyperkalemia"] },
    { drug: "levothyroxine (Synthroid)", class: "thyroid hormone replacement", sideEffects: "signs of hyperthyroidism if overdosed: tachycardia, palpitations, anxiety, tremor, weight loss, heat intolerance, insomnia, diarrhea; at therapeutic doses, properly adjusted levothyroxine should cause no side effects", holdParam: "Monitor TSH every 6-8 weeks during dose adjustment; target TSH within normal range", critical: "Take on an empty stomach 30-60 minutes before breakfast with water only; separate from calcium, iron, and antacids by at least 4 hours as they decrease absorption; consistent daily dosing is essential", tags: ["levothyroxine","thyroid","hypothyroidism","TSH","medication-timing"] },
    { drug: "amlodipine (Norvasc)", class: "calcium channel blocker (dihydropyridine)", sideEffects: "peripheral edema (the most common side effect from arteriolar vasodilation, NOT fluid overload - does not respond to diuretics), flushing, headache, dizziness, hypotension, and reflex tachycardia; less cardiac depression than non-dihydropyridine CCBs (verapamil, diltiazem)", holdParam: "Hold if SBP <90 mmHg; monitor for excessive peripheral edema", critical: "Peripheral edema from amlodipine is caused by preferential arteriolar dilation (not venodilation), creating increased capillary hydrostatic pressure; it is NOT heart failure edema and diuretics are largely ineffective", tags: ["calcium-channel-blocker","amlodipine","peripheral-edema","antihypertensive","vasodilation"] },
    { drug: "prednisone", class: "systemic corticosteroid", sideEffects: "short-term: hyperglycemia, insomnia, mood changes, increased appetite, fluid retention, GI irritation; long-term: Cushing syndrome (moon face, buffalo hump, central obesity), osteoporosis, adrenal suppression, immunosuppression, poor wound healing, cataracts, glaucoma, myopathy, skin thinning", holdParam: "Monitor blood glucose (especially in diabetics); never abruptly discontinue after >1-2 weeks of use", critical: "Long-term corticosteroid use requires gradual tapering to prevent adrenal crisis; patients should carry a medical alert identification; stress dosing may be needed during illness or surgery", tags: ["corticosteroid","prednisone","Cushing","immunosuppression","adrenal-suppression"] },
  ];

  for (const d of drugSE) {
    qs.push({ tier: "rpn", exam: "REx-PN", stem: `An RPN is administering ${d.drug}, a ${d.class}, to a patient. Which side effects should the RPN monitor for and what are the critical nursing considerations?`,
      options: [
        O("A", "This medication has no side effects and requires no monitoring"),
        O("B", `Monitor for: ${d.sideEffects}. ${d.holdParam}. Critical consideration: ${d.critical}`),
        O("C", "Only monitor for allergic reactions; no other side effects are clinically significant"),
        O("D", "Side effects are only a concern if the patient takes more than the prescribed dose"),
      ],
      ca: ["B"], rat: `${d.drug} (${d.class}) has specific side effects that require nursing vigilance: ${d.sideEffects}. ${d.holdParam}. ${d.critical}. The nurse must educate the patient about expected side effects versus concerning symptoms that require medical attention.`,
      diff: 2, tags: d.tags, topic: "Pharmacology", sub: "Drug Side Effects", rs: "CA",
      cp: `${d.drug}: ${d.holdParam}; ${d.critical.substring(0,60)}`, bs: "Physiological Integrity" });

    qs.push({ tier: "rpn", exam: "NCLEX-PN", stem: `An LPN is educating a patient about their new prescription for ${d.drug} (${d.class}). Which teaching point is MOST important?`,
      options: [
        O("A", "There are no special instructions for taking this medication"),
        O("B", `Important teaching: ${d.critical}. Side effects to report: ${d.sideEffects.substring(0,100)}. ${d.holdParam}`),
        O("C", "Take this medication only when symptoms appear, not on a regular schedule"),
        O("D", "This medication can be safely stopped at any time without medical consultation"),
      ],
      ca: ["B"], rat: `Patient education about ${d.drug} includes: recognizing side effects (${d.sideEffects}), understanding administration considerations (${d.critical}), and knowing when to seek medical attention. Proper patient education improves adherence and prevents adverse outcomes.`,
      diff: 2, tags: d.tags, topic: "Pharmacology", sub: "Patient Education", rs: "US",
      cp: `${d.drug} teaching: ${d.critical.substring(0,60)}`, bs: "Health Promotion & Maintenance" });
  }

  // ========== PARAMETRIC: Body System Assessment ==========
  const assessments = [
    { system: "cardiovascular", method: "auscultation of heart sounds", normal: "S1 (closure of mitral and tricuspid valves at the beginning of systole, 'lub') and S2 (closure of aortic and pulmonic valves at the end of systole, 'dub') heard in a regular rhythm without extra sounds, murmurs, or clicks", abnormal: "irregular rhythm, murmurs (swooshing sounds indicating turbulent blood flow through stenotic or regurgitant valves), S3 gallop (pathological in adults >30, indicates heart failure), S4 gallop (indicates stiff ventricle), pericardial friction rub (scratching sound, indicates pericarditis), or muffled heart sounds (pericardial effusion)", tags: ["cardiac","heart-sounds","auscultation","S1-S2","murmur"] },
    { system: "respiratory", method: "auscultation of lung sounds", normal: "vesicular breath sounds (soft, low-pitched, heard over most of the lung fields with inspiration longer than expiration), bronchovesicular (medium-pitched, heard over the major bronchi), and bronchial/tracheal (loud, high-pitched, heard over the trachea)", abnormal: "crackles/rales (popping sounds from fluid in alveoli or opening of collapsed alveoli; indicates pneumonia, heart failure, atelectasis), wheezes (high-pitched whistling from narrowed airways; indicates asthma, COPD, bronchospasm), rhonchi (low-pitched rumbling from secretions in large airways; often clears with coughing), stridor (high-pitched inspiratory sound indicating upper airway obstruction; medical emergency), and diminished or absent breath sounds (pneumothorax, pleural effusion, severe COPD)", tags: ["respiratory","lung-sounds","auscultation","crackles","wheezes"] },
    { system: "neurological", method: "pupil assessment using PERRLA", normal: "Pupils Equal, Round, Reactive to Light and Accommodation; normal pupil size is 2-6 mm; both pupils should be the same size (within 1 mm) and constrict briskly and equally when light is directed at either eye (direct and consensual response)", abnormal: "unilateral fixed dilated pupil (blown pupil - indicates ipsilateral uncal herniation compressing CN III; EMERGENCY), bilateral fixed dilated pupils (brainstem death or anticholinergic toxicity), bilateral pinpoint pupils (opioid overdose or pontine hemorrhage), unequal pupils (anisocoria - may be normal in 20% of population or pathological), or sluggish pupil response (early sign of rising ICP)", tags: ["neurological","PERRLA","pupils","ICP","herniation"] },
    { system: "gastrointestinal", method: "abdominal assessment in correct sequence", normal: "the correct sequence for abdominal assessment is INSPECTION (observe contour, symmetry, visible peristalsis, distension), AUSCULTATION (bowel sounds in all 4 quadrants BEFORE palpation; normal: 5-30 clicks/gurgles per minute), PERCUSSION (tympany over air-filled organs, dullness over solid organs/fluid), then PALPATION (light then deep; assess for tenderness, masses, organomegaly). Auscultation is performed BEFORE percussion and palpation to avoid altering bowel sounds", abnormal: "absent bowel sounds (auscultate for 5 full minutes before documenting absence; indicates paralytic ileus), hyperactive bowel sounds (early bowel obstruction, diarrhea, GI bleeding), hypoactive bowel sounds (post-operative, electrolyte imbalances), abdominal rigidity or guarding (peritonitis), rebound tenderness (peritoneal inflammation)", tags: ["GI","abdominal-assessment","bowel-sounds","sequence","palpation"] },
  ];

  for (const a of assessments) {
    qs.push({ tier: "rn", exam: "NCLEX-RN", stem: `An RN is performing a ${a.system} assessment using ${a.method}. Which finding would require immediate intervention?`,
      options: [
        O("A", `Normal findings: ${a.normal.substring(0,80)}`),
        O("B", `Abnormal findings requiring immediate attention: ${a.abnormal}`),
        O("C", "All findings in the " + a.system + " assessment are considered normal variants"),
        O("D", `${a.system.charAt(0).toUpperCase() + a.system.slice(1)} assessment is not part of the nursing physical examination`),
      ],
      ca: ["B"], rat: `A thorough ${a.system} assessment using ${a.method} identifies both normal and abnormal findings. Normal: ${a.normal}. Abnormal findings that require intervention include: ${a.abnormal}. The nurse must be able to differentiate normal from pathological findings and respond appropriately.`,
      diff: 3, tags: a.tags, topic: "Physical Assessment", sub: a.system.charAt(0).toUpperCase() + a.system.slice(1) + " Assessment", rs: "BOTH",
      cp: `${a.system} assessment: know normal vs abnormal; abnormal = ${a.abnormal.substring(0,50)}`, bs: "Physiological Integrity" });

    qs.push({ tier: "rpn", exam: "REx-PN", stem: `An RPN is performing a focused ${a.system} assessment. Which finding should be documented as ABNORMAL and reported to the physician?`,
      options: [
        O("A", `${a.normal.substring(0,60)} - these are all normal findings`),
        O("B", `Abnormal finding: ${a.abnormal.substring(0, 150)}; this should be documented with detailed description and reported to the physician for further evaluation and potential intervention`),
        O("C", "All " + a.system + " findings are normal regardless of their characteristics"),
        O("D", "RPNs do not perform " + a.system + " assessments"),
      ],
      ca: ["B"], rat: `The RPN is responsible for performing focused ${a.system} assessments and recognizing findings that deviate from normal. Normal: ${a.normal.substring(0,120)}. Abnormal findings include: ${a.abnormal.substring(0,200)}. When abnormal findings are identified, the RPN must document accurately and report through appropriate channels.`,
      diff: 2, tags: a.tags, topic: "Physical Assessment", sub: a.system.charAt(0).toUpperCase() + a.system.slice(1) + " Assessment", rs: "CA",
      cp: `${a.system} assessment: document and report abnormal findings`, bs: "Physiological Integrity" });
  }

  // ========== MORE RN: Priority/Delegation/Prioritization ==========
  const rnPriority = [
    { stem: "An RN is caring for four patients. Which patient should the RN assess FIRST?",
      patients: "Patient A: post-op day 1 with pain of 4/10 requesting oral analgesic. Patient B: diabetic patient with blood glucose of 45 mg/dL who is trembling and diaphoretic. Patient C: patient with a fractured arm awaiting X-ray results. Patient D: patient requesting discharge instructions.",
      priority: "Patient B: the blood glucose of 45 mg/dL represents severe hypoglycemia, a potentially life-threatening emergency that can rapidly progress to seizures, loss of consciousness, and death if not treated immediately; apply the ABCs and Maslow's hierarchy - physiological needs and immediate safety threats take priority",
      rationale: "Using prioritization frameworks: the ABCs (Airway, Breathing, Circulation) and Maslow's Hierarchy of Needs guide clinical decision-making. Severe hypoglycemia (BG 45) threatens brain function (glucose is the brain's primary fuel source) and can lead to neuronal death within minutes. This takes priority over: stable post-op pain (managed with scheduled analgesics), a stable fracture (not immediately life-threatening), and discharge instructions (can wait). The RN should: give 15-20g fast-acting carbohydrate, recheck in 15 minutes (Rule of 15), and identify the cause.", tags: ["prioritization","hypoglycemia","ABCs","Maslow","clinical-judgment"] },
    { stem: "An RN is delegating tasks on a busy medical-surgical unit. Which task is appropriate to delegate to a licensed practical nurse (LPN)?",
      patients: "Task A: admit assessment and care plan development for a new patient. Task B: administer oral medications to stable patients. Task C: educate a newly diagnosed heart failure patient about sodium-restricted diet. Task D: interpret telemetry monitor findings and intervene for dysrhythmias.",
      priority: "Task B: administering oral medications to stable patients is within the LPN's scope of practice; LPNs can administer oral, subcutaneous, intramuscular, and some IV medications to stable patients with predictable outcomes",
      rationale: "Delegation follows the Five Rights: Right Task, Right Circumstance, Right Person, Right Direction, Right Supervision. LPN scope includes: medication administration (oral, SubQ, IM, and in some states/provinces select IV medications), data collection (vital signs, focused assessments), wound care, and reinforcing established teaching. LPNs should NOT perform: initial comprehensive assessments or care plan development (A - RN responsibility), initial patient/family education for complex conditions (C - RN responsibility), or interpret/intervene for complex cardiac rhythm changes (D - RN responsibility). The RN retains accountability for all delegated tasks and must verify completion and outcomes.", tags: ["delegation","LPN-scope","five-rights","task-assignment","leadership"] },
  ];

  for (const rp of rnPriority) {
    qs.push({ tier: "rn", exam: "NCLEX-RN", stem: `${rp.stem}\n${rp.patients}`,
      options: [
        O("A", "Patient/Task A should be addressed first"),
        O("B", rp.priority),
        O("C", "Patient/Task C should be addressed first"),
        O("D", "Patient/Task D should be addressed first"),
      ],
      ca: ["B"], rat: rp.rationale, diff: 3, tags: rp.tags, topic: "Clinical Judgment", sub: "Prioritization", rs: "BOTH",
      cp: rp.priority.substring(0,80), bs: "Safe & Effective Care Environment" });
  }

  return qs;
}

async function main() {
  console.log("=== Parametric Generator Batch ===\n");
  const before = await pool.query(`SELECT tier, exam, COUNT(*)::int as c FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`);
  console.log("BEFORE:"); for (const r of before.rows) console.log(`  ${r.tier}/${r.exam}: ${r.c}`);
  const allQs = build();
  const bk: Record<string,number> = {};
  for (const q of allQs) bk[q.exam] = (bk[q.exam]||0)+1;
  console.log(`\nGenerated ${allQs.length} total:`, bk);
  let ins=0, dup=0, err=0;
  for (const q of allQs) {
    const h = sh(q.stem);
    try {
      const ex = await pool.query(`SELECT id FROM exam_questions WHERE stem_hash=$1 AND tier=$2 AND exam=$3 LIMIT 1`, [h, q.tier, q.exam]);
      if (ex.rows.length > 0) { dup++; continue; }
      await pool.query(
        `INSERT INTO exam_questions (id,tier,exam,question_type,status,stem,options,correct_answer,rationale,difficulty,tags,body_system,topic,subtopic,region_scope,stem_hash,scenario,clinical_pearl,exam_strategy,clinical_trap,distractor_rationales,career_type,created_at,updated_at)
         VALUES (gen_random_uuid(),$1,$2,'MCQ','published',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'nursing',NOW(),NOW())`,
        [q.tier,q.exam,q.stem,JSON.stringify(q.options),JSON.stringify(q.ca),q.rat,q.diff,q.tags,q.bs,q.topic,q.sub,q.rs,h,q.stem.substring(0,120),q.cp,
         "Select the evidence-based answer","Avoid outdated or harmful practices",JSON.stringify({A:"Incorrect",C:"Inappropriate",D:"Harmful"})]);
      ins++;
    } catch (e: any) { err++; console.error(`ERR: ${e.message.substring(0,100)}`); }
  }
  console.log(`\nInserted: ${ins}, Duplicates: ${dup}, Errors: ${err}`);
  const after = await pool.query(`SELECT tier, exam, COUNT(*)::int as c FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`);
  console.log("\nAFTER:"); for (const r of after.rows) console.log(`  ${r.tier}/${r.exam}: ${r.c}`);
  const session = await pool.query(`SELECT exam, COUNT(*)::int as cnt FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') AND created_at > NOW() - INTERVAL '12 hours' GROUP BY exam ORDER BY exam`);
  console.log("\nSession totals:"); for (const r of session.rows) console.log(`  ${r.exam}: ${r.cnt}`);
  await pool.end();
  console.log("\n=== Done! ===");
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
