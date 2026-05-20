const pg = require('pg');
const crypto = require('crypto');

const BATCH_ID = `paramedic-fill3-${Date.now()}`;
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function hashStem(s) { return crypto.createHash('md5').update(s.toLowerCase().trim()).digest('hex'); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
const AGES = [22,25,28,31,34,37,42,45,48,52,55,58,61,64,67,71,74,78,82,86];
const SEX = ['male','female'];

function makeRationale(domain, sub, correct, wrongs, slug) {
  return `## Correct Answer Analysis

The correct answer is "${correct}". This represents the most appropriate intervention based on current evidence-based prehospital practice guidelines for ${sub.toLowerCase()} within ${domain}.

In the emergency prehospital setting, paramedics must rapidly assess patients and prioritize interventions based on clinical presentation. This clinical vignette tests the candidate's ability to identify the highest-priority action when managing a ${sub.toLowerCase()} scenario. The correct response follows established protocols from the American Heart Association (AHA), National Association of EMS Physicians (NAEMSP), International Trauma Life Support (ITLS), and Prehospital Trauma Life Support (PHTLS) guidelines.

The pathophysiological rationale for choosing this answer centers on understanding the underlying mechanism of the patient's presentation. When vital signs, assessment findings, and clinical context align as described in the vignette, the correct intervention directly addresses the most immediate physiological derangement.

Key considerations that make this the best answer include: the timing and urgency of the intervention, alignment with the primary survey priorities (ABCDE approach), evidence-based efficacy of the treatment, and the specific clinical indicators present in the patient's presentation.

## Why Each Incorrect Answer Is Wrong

**"${wrongs[0]}"** — While this may seem reasonable, it is incorrect in this clinical context. This answer either addresses a lower-priority concern, represents an intervention appropriate at a different stage of care, or reflects an outdated practice superseded by current evidence. Understanding the difference between "correct intervention, wrong timing" and "best immediate action" is essential for both exam success and patient outcomes.

**"${wrongs[1]}"** — This distractor attracts candidates with partial knowledge. While it may have merit in a related scenario, the specific patient presentation makes it suboptimal. Common errors include applying hospital-based protocols to the prehospital setting, reversing assessment and treatment order, or selecting an intervention appropriate for a different pathology.

**"${wrongs[2]}"** — This represents a common misconception or less-preferred alternative. While there may be limited circumstances where this approach is used, the clinical scenario presented clearly indicates a different course of action. Selecting this demonstrates unfamiliarity with current treatment algorithms or failure to integrate all clinical data.

## Clinical Pearl

Evidence-based management of ${sub.toLowerCase()} requires integration of assessment findings, vital sign interpretation, and protocol-based decision-making. Key clinical pearls: (1) Complete a systematic primary survey before definitive treatment. (2) Trending vital signs provides more value than a single measurement. (3) Protocols may vary by jurisdiction — follow local medical direction. (4) Documentation of findings, interventions, and response is critical. (5) Reassess after every intervention.

## How Exam Writers Try to Trick You

This question uses common techniques: (1) Including correct but not highest-priority interventions. (2) Clinical findings suggesting multiple conditions. (3) Vital signs requiring contextual interpretation. (4) Randomized correct answer position. Read the entire vignette, identify ALL findings, and select the answer addressing the most immediate priority.

## Intervention Considerations

Management priority: (1) Scene safety and PPE. (2) Primary assessment (ABCDE). (3) Address immediate life threats. (4) Targeted interventions. (5) Reassessment. (6) Transport decision. (7) Monitoring during transport. (8) Structured handover.

## Scenario Variations

If the patient's presentation differed (different vital signs, altered mental status, additional conditions), the correct answer might change significantly. Understanding how clinical variables affect decision-making is essential.

Learn more: /paramedic/lessons/${slug}`;
}

const EXTRA_OPS = [
  { sub: "MCI and Triage", gen: () => {
    const s = [
      { stem: `At a bus crash MCI, you are the triage officer using START. A patient has RR 18, radial pulse present, but does not follow commands ("squeeze my fingers"). Under START, what triage category?`, opts: ["RED (Immediate) — the patient has adequate respirations and perfusion but fails the mental status check (does not follow commands)", "YELLOW (Delayed) — the patient is breathing and has a pulse", "GREEN (Minor) — adequate vital signs despite altered mentation", "BLACK (Expectant) — altered mental status in MCI indicates unsalvageable"], c: 0, d: 2 },
      { stem: `During MCI triage, you encounter a patient with a respiratory rate of 36 after opening the airway. Under START triage, this patient is categorized as:`, opts: ["RED (Immediate) — respiratory rate above 30 triggers immediate classification in START triage regardless of other findings", "YELLOW — tachypnea alone does not warrant immediate classification", "GREEN — the patient is breathing and therefore ambulatory", "Reassess after providing oxygen before assigning a category"], c: 0, d: 2 },
      { stem: `You are establishing a casualty collection point (CCP) at an MCI. Which location criteria are most important for CCP placement?`, opts: ["Upwind of hazards, accessible to ambulances, out of the line of sight from the incident (to reduce secondary exposure risk), and with adequate space for patient treatment areas", "Directly adjacent to the incident for shortest patient carry distance", "At the incident command post for centralized operations", "In the parking lot closest to the incident regardless of wind direction"], c: 0, d: 3 },
      { stem: `At an MCI, the operations section chief asks you to set up the medical branch. Under ICS, what positions typically report to the medical branch director?`, opts: ["Triage Unit Leader, Treatment Unit Leader, and Transport Unit Leader form the medical branch structure", "Only the triage officer reports to the medical branch director", "All personnel on scene report directly to the medical branch director", "The medical branch director reports to the planning section chief"], c: 0, d: 3 },
      { stem: `During an active shooter MCI, under the TECC (Tactical Emergency Casualty Care) framework, what is the paramedic's primary role in the Warm Zone?`, opts: ["Provide rapid hemorrhage control (tourniquet application) and rapid patient extraction to the Cold Zone for further treatment", "Perform full patient assessments including secondary surveys in the Warm Zone", "Wait in the Cold Zone until law enforcement declares the entire scene safe", "Enter the Hot Zone with ballistic protection to treat patients at the point of injury"], c: 0, d: 3 },
      { stem: `At a chemical release MCI with 40 patients requiring decontamination, you must prioritize decontamination order. Which patients should be decontaminated first?`, opts: ["Critical patients (RED) who require immediate medical intervention should be decontaminated first to enable life-saving treatment; followed by ambulatory contaminated patients (GREEN) as a group", "Ambulatory (GREEN) patients first since they can self-decontaminate quickly", "Deceased (BLACK) patients first to prevent continued exposure", "All patients simultaneously regardless of severity"], c: 0, d: 3 },
    ];
    return pick(s);
  }},
  { sub: "Documentation Standards", gen: () => {
    const s = [
      { stem: `Your patient care report (PCR) will be used as a legal document. Which documentation standard must ALL entries meet to be defensible?`, opts: ["Entries must be contemporaneous (written during or immediately after the call), accurate, objective, thorough, and free of subjective opinions or judgmental language", "Entries only need to include vital signs and medications administered", "The PCR is only used for billing and does not require clinical accuracy", "Only the narrative section of the PCR has legal significance"], c: 0, d: 2 },
      { stem: `You transport a patient who later files a lawsuit. Your attorney asks about the 'pertinent negative' documentation in your PCR. What are pertinent negatives and why are they important?`, opts: ["Pertinent negatives are relevant findings that are ABSENT (e.g., 'denies chest pain, no JVD, no pedal edema'); they demonstrate thorough assessment and support your clinical decision-making by showing what was ruled out", "Pertinent negatives are errors in your documentation that need correction", "They refer to negative patient interactions that should be documented", "Pertinent negatives are only important in research documentation, not clinical care"], c: 0, d: 2 },
      { stem: `A bystander tells you they saw the patient drinking heavily before the accident. How should you document this statement?`, opts: ["Document as a direct quote attributed to the source: 'Bystander (name if available) stated: patient was observed drinking alcohol prior to the accident'; do not write your own conclusion about intoxication", "Write 'patient is intoxicated based on bystander report'", "Do not document bystander statements as they are hearsay", "Document 'patient ETOH positive' based on the bystander report"], c: 0, d: 2 },
    ];
    return pick(s);
  }},
  { sub: "Crew Resource Management", gen: () => {
    const s = [
      { stem: `During a stressful cardiac arrest resuscitation, your partner freezes and stops performing compressions. Using CRM principles, what is the most effective immediate intervention?`, opts: ["Use a direct, calm statement: 'I need you to resume compressions now at a depth of 2 inches' — providing clear, specific direction while maintaining team cohesion", "Yell at your partner to snap them out of it", "Push them aside and take over all roles yourself", "Ignore the pause and continue your current tasks"], c: 0, d: 2 },
      { stem: `As a newly certified paramedic, you notice your FTO (field training officer) preparing to administer an outdated medication per old protocols that has been removed from current standing orders. The CRM concept of 'authority gradient' is relevant. What should you do?`, opts: ["Respectfully advocate for the patient: 'I want to confirm — my understanding is that medication was removed from our current protocols. Can we verify before administering?' This flattens the authority gradient while questioning the action", "Administer the medication as instructed since the FTO has more experience and authority", "Refuse to participate and file a complaint after the call", "Call medical control on your personal phone without telling the FTO"], c: 0, d: 3 },
    ];
    return pick(s);
  }},
  { sub: "Scene Safety", gen: () => {
    const s = [
      { stem: `You are dispatched to a rural area for a patient with difficulty breathing inside a barn/silo. On approach, the patient is lying at the bottom of an enclosed grain silo. What is the hazard concern?`, opts: ["Confined space with potential oxygen-deficient atmosphere and toxic gas accumulation (hydrogen sulfide, carbon dioxide, nitrogen dioxide from grain decomposition); do NOT enter — request technical rescue team with atmospheric monitoring", "The grain could collapse and bury rescuers (engulfment hazard) but the atmosphere is safe", "Only electrical hazards from silo equipment are relevant", "The barn/silo is safe to enter as long as you hold your breath"], c: 0, d: 2 },
      { stem: `While treating a patient on a highway shoulder, your partner alerts you that a vehicle is approaching at high speed and appears unable to stop. What immediate action takes priority?`, opts: ["Immediately evacuate yourself, your partner, and the patient (if possible) away from the roadway; personal safety supersedes patient care — you cannot help anyone if you become a victim", "Shield the patient with your body while your partner waves down the approaching vehicle", "Continue patient care and trust that the approaching vehicle will stop", "Run to the ambulance to move it out of the way"], c: 0, d: 1 },
    ];
    return pick(s);
  }},
  { sub: "Vehicle Extrication", gen: () => {
    const s = [
      { stem: `A patient is found in a vehicle that rolled down an embankment and is resting on its side (driver's side down). The patient is suspended by the seatbelt. How should you approach and stabilize the vehicle before patient access?`, opts: ["Ensure the vehicle is stabilized against further rolling using step chocks, cribbing, and/or struts BEFORE any rescuer enters; approach from the uphill side and coordinate with fire/rescue for systematic stabilization", "Have one rescuer hold the vehicle while another enters through the windshield", "Immediately cut the seatbelt to drop the patient to the lower side of the vehicle", "Push the vehicle onto its roof for better patient access"], c: 0, d: 3 },
    ];
    return pick(s);
  }},
  { sub: "Hazmat Awareness", gen: () => {
    const s = [
      { stem: `You are first on scene at a tanker truck leak. Using the DOT ERG (Emergency Response Guidebook), you identify the placard as a Class 2 (gas) with a red background. Before looking up the specific guide page, what initial isolation distance does the ERG generally recommend?`, opts: ["Minimum 330 feet (100 meters) in all directions as an initial isolation distance for most hazmat incidents until the specific material is identified and the appropriate guide page is referenced", "25 feet from the leak source is sufficient for initial isolation", "Only 50 feet is needed since gases dissipate quickly", "No isolation is needed until the specific chemical is identified by hazmat team"], c: 0, d: 2 },
    ];
    return pick(s);
  }},
  { sub: "Handover Communication", gen: () => {
    const s = [
      { stem: `You are transferring a pediatric seizure patient to the ED. The child had febrile seizures at age 1 and is now 4 years old with a first-time afebrile seizure lasting 3 minutes. Which information is MOST critical for the receiving team?`, opts: ["Seizure description (type, duration, body involvement), any postictal focal deficits, medications administered and response, blood glucose level, and whether this is a first-time unprovoked seizure — this determines the diagnostic workup", "Only the medications administered and current vital signs", "The patient's complete immunization history and growth chart", "The family's insurance information and primary care physician contact"], c: 0, d: 2 },
    ];
    return pick(s);
  }},
  { sub: "Air Medical Transport", gen: () => {
    const s = [
      { stem: `A patient with a tension pneumothorax that was decompressed with a needle now needs helicopter transport. At altitude, what must you monitor and potentially repeat?`, opts: ["The needle decompression may need to be reassessed or repeated as gas expansion occurs with altitude (Boyle's Law); ensure the catheter is patent, monitor for re-accumulation, and consider placing a second catheter prophylactically if protocols allow", "No special consideration is needed since the pneumothorax was already treated", "Convert to a chest tube before helicopter transport", "Cancel the helicopter and transport by ground to avoid altitude complications"], c: 0, d: 4 },
    ];
    return pick(s);
  }},
];

const EXTRA_GENERAL = [
  { domain: "Cardiology/ECG", sub: "Sinus Rhythms and Blocks", gen: () => {
    const a = pick(AGES); const sx = pick(SEX);
    const s = [
      { stem: `A ${a}-year-old ${sx} presents with dizziness. ECG shows progressively prolonging PR intervals until a QRS is dropped, then the cycle repeats. What type of heart block is this?`, opts: ["Second-degree AV block Type I (Wenckebach/Mobitz I) — characterized by progressive PR prolongation until a dropped beat; generally benign and usually does not require pacing unless symptomatic with hemodynamic instability", "Second-degree AV block Type II (Mobitz II) — regular PR intervals with sudden dropped beats", "Third-degree (complete) AV block — no relationship between P waves and QRS complexes", "First-degree AV block — prolonged but consistent PR intervals without dropped beats"], c: 0, d: 3 },
      { stem: `A ${a}-year-old ${sx} presents with syncope. ECG shows a constant PR interval of 0.32 seconds with intermittent dropped QRS complexes. The P-P interval is regular. What type of block is this and why is it more dangerous than Wenckebach?`, opts: ["Second-degree AV block Type II (Mobitz II) — the fixed PR interval with sudden dropped beats suggests infranodal conduction disease; it can progress unpredictably to complete heart block and requires transcutaneous pacing standby", "Second-degree AV block Type I (Wenckebach) with a long baseline PR interval", "First-degree AV block which is always benign", "Normal sinus rhythm with premature atrial contractions"], c: 0, d: 4 },
    ];
    return pick(s);
  }},
  { domain: "Medical Emergencies", sub: "Electrolyte Disorders", gen: () => {
    const a = pick(AGES); const sx = pick(SEX);
    const s = [
      { stem: `A ${a}-year-old ${sx} presents with muscle cramps, perioral tingling, and carpopedal spasm. The patient recently had thyroid surgery 2 days ago. When you tap the facial nerve (Chvostek sign), the facial muscles twitch. What is the most likely electrolyte abnormality?`, opts: ["Hypocalcemia — post-thyroidectomy damage to parathyroid glands; positive Chvostek sign (facial twitching on nerve tap) and Trousseau sign (carpopedal spasm) are classic; treatment includes calcium gluconate or calcium chloride IV", "Hyperkalemia from surgical stress response", "Hypomagnesemia from NPO status post-surgery", "Hyponatremia from excessive IV fluid administration"], c: 0, d: 3 },
    ];
    return pick(s);
  }},
  { domain: "Trauma Management", sub: "Blunt Trauma", gen: () => {
    const a = pick(AGES); const sx = pick(SEX);
    const s = [
      { stem: `A ${a}-year-old ${sx} restrained driver in a lateral (T-bone) impact collision presents with left-sided chest wall pain, left upper quadrant abdominal tenderness, and pain radiating to the left shoulder. HR 116, BP 94/58. What is the most likely injury pattern from the lateral impact?`, opts: ["Lateral impact injuries include rib fractures on the impact side, splenic injury (left side) or hepatic injury (right side), and lateral compression pelvic fractures; the left shoulder pain (Kehr sign) suggests splenic injury with diaphragmatic irritation", "Anterior impact injuries: sternal fracture and cardiac contusion", "Rear impact injuries: whiplash and cervical spine hyperextension", "Rollover injuries: unpredictable pattern requiring full body CT"], c: 0, d: 3 },
    ];
    return pick(s);
  }},
  { domain: "Trauma Management", sub: "Hemorrhage Control", gen: () => {
    const a = pick(AGES); const sx = pick(SEX);
    const s = [
      { stem: `A ${a}-year-old ${sx} has a tourniquet applied to the right upper extremity for uncontrolled hemorrhage from a circular saw injury. Transport time is 45 minutes. During transport, should the tourniquet be periodically loosened to allow blood flow to the extremity?`, opts: ["No — once applied, the tourniquet should NOT be loosened in the prehospital setting; loosening risks rebleeding and releasing toxic metabolites from ischemic tissue (reperfusion injury); document the application time and keep it in place until surgical evaluation", "Yes — loosen for 1 minute every 15 minutes to prevent limb loss", "Yes — convert to a pressure dressing after 30 minutes if bleeding has stopped", "Remove the tourniquet entirely if bleeding appears to have stopped"], c: 0, d: 2 },
    ];
    return pick(s);
  }},
  { domain: "Airway Management", sub: "Oxygen Delivery Devices", gen: () => {
    const s = [
      { stem: `Match the oxygen delivery device to its approximate FiO2 delivery: nasal cannula at 6 LPM, simple face mask at 10 LPM, and non-rebreather mask at 15 LPM. Which set of values is most accurate?`, opts: ["Nasal cannula ~44% (approximately 4% per liter above 21%), simple face mask ~50-60%, non-rebreather mask ~80-95%", "Nasal cannula ~28%, simple face mask ~100%, non-rebreather mask ~100%", "Nasal cannula ~60%, simple face mask ~80%, non-rebreather mask ~100%", "All three devices deliver approximately the same FiO2 at their maximum flows"], c: 0, d: 2 },
    ];
    return pick(s);
  }},
  { domain: "Pharmacology", sub: "Drug Calculations", gen: () => {
    const wt = pick([60,70,75,80,85,90]);
    const s = [
      { stem: `A patient weighing ${wt} kg requires a dopamine infusion at 10 mcg/kg/min. The concentration is 800 mg in 500 mL D5W (1600 mcg/mL). Using a 60 gtt/mL set, what is the drip rate?`, opts: [`${Math.round(wt * 10 / 1600 * 60 * 10) / 10} gtt/min`, `${Math.round(wt * 10 / 1600 * 60 * 10 * 2) / 10} gtt/min`, `${Math.round(wt * 10 / 1600 * 10) / 10} gtt/min`, `${Math.round(wt * 10 / 800 * 60 * 10) / 10} gtt/min`], c: 0, d: 3 },
    ];
    return pick(s);
  }},
  { domain: "ACLS/PALS Protocols", sub: "Cardiac Arrest Management", gen: () => {
    const a = pick(AGES); const sx = pick(SEX);
    const s = [
      { stem: `During a prolonged cardiac arrest (30+ minutes), the team is considering termination of resuscitation in the field. Per NAEMSP/AHA guidelines, which criteria support field termination for a witnessed arrest with EMS-initiated resuscitation?`, opts: ["Arrest not witnessed by EMS, no bystander CPR, no ROSC after full ALS care on scene, no shockable rhythm at any time, EtCO2 consistently <10 mmHg, and no reversible causes identified — all criteria must be met per local protocol and medical control", "Any cardiac arrest lasting longer than 20 minutes qualifies for field termination", "Field termination should only be considered for traumatic arrests, not medical", "If one round of ACLS medications has been given without ROSC, termination is appropriate"], c: 0, d: 4 },
    ];
    return pick(s);
  }},
  { domain: "Environmental Emergencies", sub: "Hypothermia", gen: () => {
    const a = pick(AGES); const sx = pick(SEX);
    const s = [
      { stem: `A ${a}-year-old ${sx} is found outdoors in cold weather with a core temperature of 33°C (91.4°F). The patient is shivering vigorously, confused, and has slurred speech. This represents what stage of hypothermia and what is the appropriate rewarming strategy?`, opts: ["Mild hypothermia (32-35°C); shivering is the body's active rewarming mechanism; remove wet clothing, insulate with blankets (passive rewarming), apply heat packs to axillae, groin, and neck (active external rewarming), and provide warm IV fluids if available", "Severe hypothermia requiring cardiopulmonary bypass rewarming", "Moderate hypothermia where shivering has stopped indicating worsening condition", "Normal thermoregulatory response not requiring medical intervention"], c: 0, d: 2 },
    ];
    return pick(s);
  }},
];

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const existingStems = await pool.query("SELECT stem FROM allied_questions WHERE career_type='paramedic'");
  const existingHashes = new Set(existingStems.rows.map(r => hashStem(r.stem)));

  const currentCounts = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY blueprint_category");
  const domainMap = {};
  currentCounts.rows.forEach(r => { domainMap[r.blueprint_category] = parseInt(r.cnt); });
  const totalCurrent = Object.values(domainMap).reduce((a,b) => a+b, 0);
  console.log(`Current total: ${totalCurrent}`);
  console.log('Current:', domainMap);

  let totalIns = 0, totalFC = 0;

  async function insertQ(domain, sub, q) {
    const hash = hashStem(q.stem);
    if (existingHashes.has(hash)) return false;
    const opts = [...q.opts];
    const ci = q.c;
    const diff = q.d || 3;
    const indices = [0,1,2,3];
    for (let i=3;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [indices[i],indices[j]]=[indices[j],indices[i]]; }
    const sh = indices.map(i=>opts[i]);
    const nc = sh.indexOf(opts[ci]);
    const cog = diff<=2?'recall':diff===3?'application':'analysis';
    const slug = `${slugify(domain)}/${slugify(sub)}`;
    const rat = makeRationale(domain, sub, sh[nc], sh.filter((_,i)=>i!==nc), slug);
    const pearls = [`Key concept in ${sub.toLowerCase()}`,`Reassess after interventions`,`Follow evidence-based guidelines`];
    const safety = `Ensure scene safety and PPE for ${sub.toLowerCase()}.`;
    const dRat = sh.map((o,i)=> i===nc?'Correct':'Incorrect for this scenario');
    const trap = `Tests knowledge of ${sub.toLowerCase()}`;

    try {
      const r = await pool.query(`INSERT INTO allied_questions (career_type, batch_id, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_trap, clinical_pearls, safety_note, distractor_rationales, is_free, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
        ['paramedic', BATCH_ID, q.stem, JSON.stringify(sh), nc, rat, `Understand ${sub.toLowerCase()}`, domain, sub, diff, cog, 'multiple-choice', trap, JSON.stringify(pearls), safety, JSON.stringify(dRat), false, 'approved']);
      const qid = r.rows[0].id;
      existingHashes.add(hash);
      totalIns++;
      const cards = [
        {t:'definition',f:`Key concept: ${sub}`,b:sh[nc],r:rat.substring(0,500)},
        {t:'clinical_decision',f:`Decision: ${sub}`,b:pearls[0],r:pearls.slice(1).join(' | ')},
        {t:'red_flag',f:`Safety: ${sub}`,b:safety,r:`Domain: ${domain}`}
      ];
      for (const c of cards) {
        await pool.query(`INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, blueprint_category, subtopic) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          ['paramedic', qid, c.t, c.f, c.b, c.r, domain, sub]);
        totalFC++;
      }
      if (totalIns % 10 === 0) console.log(`  Progress: ${totalIns} inserted`);
      return true;
    } catch(e) { return false; }
  }

  console.log('\n--- Operations/EMS Systems fill ---');
  let opsIns = 0;
  const opsNeeded = 120 - (domainMap["Operations/EMS Systems"] || 0);
  console.log(`Need ${opsNeeded} more Operations questions`);
  let opsAttempts = 0;
  while (opsIns < opsNeeded && opsAttempts < opsNeeded * 8) {
    opsAttempts++;
    const tpl = pick(EXTRA_OPS);
    const q = tpl.gen();
    if (await insertQ("Operations/EMS Systems", tpl.sub, q)) opsIns++;
  }
  console.log(`Operations inserted: ${opsIns}/${opsNeeded}`);

  console.log('\n--- General domain fill ---');
  const TARGET = { "Airway Management": 180, "Cardiology/ECG": 210, "Trauma Management": 210, "Medical Emergencies": 210, "ACLS/PALS Protocols": 125, "Pharmacology": 155, "Pediatric Emergencies": 105, "OB Emergencies": 90, "Operations/EMS Systems": 120, "Environmental Emergencies": 65 };
  for (const tpl of EXTRA_GENERAL) {
    const cur = (domainMap[tpl.domain] || 0) + (tpl.domain === "Operations/EMS Systems" ? opsIns : 0);
    const target = TARGET[tpl.domain] || 210;
    if (cur >= target) continue;
    let att = 0;
    while (att < 10) {
      att++;
      const q = tpl.gen();
      await insertQ(tpl.domain, tpl.sub, q);
    }
  }

  const remaining = 1500 - totalCurrent - totalIns;
  if (remaining > 0) {
    console.log(`\nNeed ${remaining} more to reach 1500. Adding from all templates...`);
    const ALL = [...EXTRA_OPS, ...EXTRA_GENERAL.map(t => ({ ...t, domain: t.domain }))];
    let att = 0;
    while (totalIns < (1500 - totalCurrent) && att < remaining * 10) {
      att++;
      const tpl = pick(EXTRA_OPS);
      const q = tpl.gen();
      await insertQ("Operations/EMS Systems", tpl.sub, q);
    }
  }

  console.log('\n========== FILL3 COMPLETE ==========');
  console.log(`Inserted: ${totalIns} questions, ${totalFC} flashcards`);
  const fc = await pool.query("SELECT COUNT(*) as t FROM allied_questions WHERE career_type='paramedic' AND status='approved'");
  console.log(`Total approved: ${fc.rows[0].t}`);
  const cats = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY blueprint_category ORDER BY cnt DESC");
  cats.rows.forEach(r => console.log(`  ${r.blueprint_category}: ${r.cnt}`));
  const fcs = await pool.query("SELECT COUNT(*) as t FROM allied_flashcards WHERE career_type='paramedic'");
  console.log(`Total flashcards: ${fcs.rows[0].t}`);
  await pool.end();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
