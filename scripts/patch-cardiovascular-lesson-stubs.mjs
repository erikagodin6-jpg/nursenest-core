#!/usr/bin/env node
/**
 * Patches the 14 zero-section cardiovascular lesson stubs in catalog.json
 * for the us-rn-nclex-rn pathway.
 *
 * Each stub gets 4 sections: intro, core, clinical_application, exam_tips.
 * Content is US RN NCLEX-RN tier-appropriate and scoped to the specific topic.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.resolve(__dirname, "../src/content/pathway-lessons/catalog.json");

const PATCHES = {
  "abdominal-aortic-aneurysm-nclex-rn": {
    seoTitle: "Abdominal Aortic Aneurysm | NCLEX-RN US | NurseNest",
    seoDescription: "AAA nursing priorities for NCLEX-RN: rupture risk, post-repair monitoring, and safe delegate.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Abdominal aortic aneurysm (AAA)** is a life-threatening dilation of the aorta. NCLEX-RN stems test **rupture recognition**, **pre/post-repair monitoring**, and what the nurse does first when a client develops sudden back or flank pain with hemodynamic change." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Rupture signs**: sudden severe back or flank pain, pulsatile abdominal mass, hypotension, tachycardia.\n- **Pre-op**: NPO, large-bore IV, type and crossmatch, consent, VS baseline.\n- **Post-op (open or EVAR)**: monitor renal perfusion (UO ≥ 0.5 mL/kg/hr), distal pulses, abdominal girth, WBC for graft infection.\n- **Position**: head of bed ≤ 30° unless otherwise ordered; avoid hip flexion." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "When a post-AAA repair client reports new back pain and the BP drops, prioritize **assessment and notifying the provider immediately** — do not delay for analgesics. If AAA is intact and monitored conservatively, **educate on BP control, smoking cessation, and symptom reporting**." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- Choose **hypotension + back pain → call provider** over repositioning or pain medication.\n- **EVAR vs. open**: both need graft surveillance; endoleak is EVAR-specific.\n- **Correct answer trap**: do not select invasive procedure option if assessment is incomplete." },
    ],
  },

  "acute-coronary-syndrome-nclex-rn": {
    seoTitle: "Acute Coronary Syndrome | NCLEX-RN US | NurseNest",
    seoDescription: "ACS nursing priorities for NCLEX-RN: MONA protocol, troponin, and 12-lead interpretation.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Acute coronary syndrome (ACS)** spans unstable angina, NSTEMI, and STEMI. NCLEX-RN items test recognition, **initial nursing actions (MONA)**, 12-lead prioritization, and post-PCI monitoring." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **MONA**: Morphine (pain/vasodilation), Oxygen (if SpO₂ < 94%), Nitrates (sublingual then IV if ordered), Aspirin 325 mg.\n- **Troponin**: rises 3–6 h post-event; serial measurements confirm MI.\n- **STEMI → 12-lead + activate cath lab**; NSTEMI → medical management, possible cath.\n- **Post-PCI**: monitor access site (radial vs. femoral), distal pulses, bleeding, contrast nephropathy (UO, creatinine)." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "For chest pain with ST elevation, **obtain 12-lead ECG and notify provider immediately** before other interventions. Administer aspirin per protocol. Do not delay the 12-lead for comfort measures. If chest pain resolves with nitrates, still report and document." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **First action = 12-lead ECG** for new chest pain in a cardiac patient, not calling the provider first.\n- **Oxygen is not routine** — give only if SpO₂ < 94%.\n- **Nitrates contraindicated** if systolic BP < 90 mmHg or patient took PDE-5 inhibitor in last 24–48 h." },
    ],
  },

  "atrial-fibrillation-nclex-rn": {
    seoTitle: "Atrial Fibrillation | NCLEX-RN US | NurseNest",
    seoDescription: "A-fib nursing priorities for NCLEX-RN: rate control, anticoagulation, and cardioversion safety.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Atrial fibrillation (A-fib)** is the most common sustained dysrhythmia. NCLEX-RN items test **rate vs. rhythm control**, anticoagulation rationale, cardioversion safety checks, and recognizing when to escalate." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Rate control**: beta blockers, CCBs (diltiazem), digoxin. Goal HR 60–100 at rest.\n- **Rhythm control**: electrical or chemical cardioversion.\n- **Anticoagulation**: warfarin (INR 2–3) or NOACs to prevent stroke; hold if INR supratherapeutic.\n- **Pre-cardioversion**: verify anticoagulation for ≥ 3 weeks OR rule out atrial thrombus by TEE.\n- **Signs of decompensation**: hypotension, syncope, acute pulmonary edema → emergent cardioversion." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "Before elective cardioversion, confirm the client has been anticoagulated and NPO, and verify consent. After cardioversion, monitor ECG continuously and report return of A-fib. Teach outpatients about **bleeding precautions**, **INR adherence**, and when to call 911." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Digoxin toxicity** (bradycardia, N/V, visual changes) requires holding the dose and checking potassium.\n- Select **anticoagulation** as the priority safety measure, not rate control, if the stem asks about stroke prevention.\n- **Irregularly irregular** rhythm + absent P waves = A-fib signature on rhythm strip questions." },
    ],
  },

  "cabg-and-postoperative-cabg-complications-nclex-rn": {
    seoTitle: "CABG Postoperative Nursing | NCLEX-RN US | NurseNest",
    seoDescription: "CABG complications nursing for NCLEX-RN: mediastinal drainage, arrhythmias, and early ambulation.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Coronary artery bypass graft (CABG)** nursing care focuses on **early postoperative monitoring**: mediastinal drainage, hemodynamics, rhythm, pain, and preventing complications like atrial fibrillation and sternal wound infection." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Chest tube drainage**: report > 100–200 mL/hr × 2 h or sudden stop (clot).\n- **Dysrhythmia**: A-fib peaks 2–3 days post-op; monitor ECG continuously.\n- **Sternal precautions**: no pushing/pulling > 5–10 lb, no driving for 4–6 weeks.\n- **Pain**: use scheduled analgesics; splint chest with pillow when coughing (IS q1h).\n- **Graft site**: saphenous vein graft leg — elevate, check pulses, monitor edema." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "A client post-CABG whose chest tube output abruptly drops from 80 to 0 mL/hr and develops hypotension and muffled heart sounds → suspect **cardiac tamponade**: position upright, notify provider immediately, prepare for emergent pericardiocentesis." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Tamponade triad**: hypotension, muffled heart sounds, JVD (Beck's triad).\n- **Sternal wound infection**: fever, purulent drainage, sternal clicking — notify provider.\n- **Incentive spirometer**: q1h while awake to prevent atelectasis — higher priority than ambulation on day 1." },
    ],
  },

  "cardiac-tamponade-nclex-rn": {
    seoTitle: "Cardiac Tamponade | NCLEX-RN US | NurseNest",
    seoDescription: "Cardiac tamponade nursing priorities for NCLEX-RN: Beck's triad, pulsus paradoxus, and escalation.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Cardiac tamponade** is a life-threatening compression of the heart from pericardial fluid accumulation. NCLEX-RN tests **early recognition**, escalation timing, and positioning while awaiting pericardiocentesis." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Beck's triad**: hypotension + JVD + muffled heart sounds.\n- **Pulsus paradoxus**: SBP drops > 10 mmHg during inspiration (measured with sphygmomanometer).\n- **ECG**: electrical alternans (QRS height alternates with each beat).\n- **Intervention**: pericardiocentesis (aspiration of pericardial fluid); prepare at bedside.\n- **Position**: upright and leaning forward improves venous return." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "After cardiac surgery or trauma, a client becomes hypotensive with muffled heart sounds and neck vein distension. **First action**: notify provider and prepare emergency pericardiocentesis kit. Position client upright. Do not delay for ECG if Beck's triad is present." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Three triad signs together** = tamponade; if only two are present, reassess.\n- **Do not** select diuresis — it worsens hypotension by reducing preload further.\n- **Post-procedure**: reassess vitals and JVD; fluid can re-accumulate." },
    ],
  },

  "deep-vein-thrombosis-dvt-prevention-and-nursing-management-nclex-rn": {
    seoTitle: "DVT Prevention and Management | NCLEX-RN US | NurseNest",
    seoDescription: "DVT nursing care for NCLEX-RN: prevention, anticoagulation, monitoring, and pulmonary embolism risk.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Deep vein thrombosis (DVT)** prevention and management is a high-yield NCLEX-RN topic that tests **Virchow's triad**, anticoagulation monitoring, and recognizing PE as the most dangerous complication." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Virchow's triad**: stasis + hypercoagulability + endothelial damage.\n- **Prevention**: SCDs, early ambulation, LMWH prophylaxis, adequate hydration.\n- **Signs**: unilateral leg swelling, warmth, erythema, positive Homan's sign (not reliable alone).\n- **Treatment**: LMWH → warfarin bridge, or NOAC; maintain INR 2–3 for warfarin.\n- **Monitoring heparin**: aPTT 1.5–2.5× control; platelet count (HIT risk).\n- **PE precautions**: do not massage leg; monitor SpO₂, respiratory rate." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "A post-surgical client develops sudden dyspnea, pleuritic chest pain, and tachycardia. This is a PE until proven otherwise — **apply oxygen, notify provider immediately, anticipate CT pulmonary angiography and anticoagulation**. Do not ambulate or massage the affected limb." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **SCD use**: apply when the patient is in bed; remove for ambulation.\n- **HIT**: thrombocytopenia + new clot on heparin → stop heparin, switch to argatroban or fondaparinux.\n- **Warfarin reversal**: vitamin K (slow) or FFP (rapid emergency reversal)." },
    ],
  },

  "defibrillation-vs-synchronized-cardioversion-nclex-rn": {
    seoTitle: "Defibrillation vs Cardioversion | NCLEX-RN US | NurseNest",
    seoDescription: "Defibrillation vs synchronized cardioversion for NCLEX-RN: when to use each and safety steps.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "NCLEX-RN tests the **critical distinction between defibrillation and synchronized cardioversion**: which rhythms require each, the synchronization step, and safety protocol before each procedure." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Defibrillation** (unsynchronized): pulseless VF or pulseless VT → immediate shock; no pulse check delay.\n- **Synchronized cardioversion**: unstable SVT, unstable A-fib, unstable VT with pulse → synchronized to R wave to avoid R-on-T.\n- **Energy**: defibrillation 200 J biphasic; cardioversion 50–200 J depending on rhythm.\n- **Pre-cardioversion**: sedation, consent, anticoagulation verification.\n- **Safety call**: 'All clear!' — ensure no one touching patient or bed before shock." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "Client in VF → **immediately defibrillate** — do not synchronize, do not sedate, do not delay for consent. Client in rapid A-fib with BP 80/50 → synchronized cardioversion after brief sedation. Verify 'all clear' before each discharge." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Pulseless = defibrillate**; **pulse present + unstable = cardiovert**.\n- **R-on-T phenomenon** (risk of VF) is why you synchronize when rhythm has P or QRS complexes.\n- **Sedate before elective cardioversion** — not before emergency defibrillation." },
    ],
  },

  "heart-failure-nclex-rn": {
    seoTitle: "Heart Failure | NCLEX-RN US | NurseNest",
    seoDescription: "Heart failure nursing for NCLEX-RN: Systolic vs diastolic, diuresis, monitoring, and patient teaching.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Heart failure (HF)** is among the most tested NCLEX-RN cardiovascular topics. Items focus on **left vs. right HF presentation**, diuresis monitoring, medication management (ACE inhibitors, beta blockers, diuretics), and identifying acute decompensation." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Left HF**: pulmonary congestion — dyspnea, orthopnea, crackles, pink frothy sputum.\n- **Right HF**: systemic congestion — JVD, peripheral edema, ascites, hepatomegaly.\n- **Daily weight**: same time, same scale, same clothing; report > 2 lb/day gain.\n- **Diuretics (furosemide)**: monitor K⁺, I&O, BUN/Cr; replace electrolytes.\n- **Sodium restriction**: 2 g/day; fluid restriction as ordered.\n- **Positioning**: high Fowler's for acute dyspnea; legs dependent to reduce preload in right HF." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "Client with HF develops sudden SpO₂ 84%, pink frothy sputum, and RR 30 — acute pulmonary edema. **Priority**: high Fowler's, oxygen, call provider, anticipate IV furosemide and morphine. Reassess lung sounds before and after diuresis." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Weight gain 2 lb overnight = fluid retention** → call provider, adjust diuretic.\n- **ACE inhibitor + K-sparing diuretic → hyperkalemia risk**.\n- **Digoxin toxicity check**: hold if HR < 60; check K⁺ (hypokalemia increases toxicity).\n- Select **activity tolerance + weight monitoring** as primary discharge education priorities." },
    ],
  },

  "hypertensive-encephalopathy-nclex-rn": {
    seoTitle: "Hypertensive Encephalopathy | NCLEX-RN US | NurseNest",
    seoDescription: "Hypertensive encephalopathy nursing for NCLEX-RN: rapid assessment, controlled BP reduction, and neurologic monitoring.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Hypertensive encephalopathy** is a hypertensive emergency causing cerebral dysfunction. NCLEX-RN tests **symptom recognition**, the principle of **controlled** (not rapid) BP reduction, and which neurological changes require immediate escalation." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **BP**: typically > 180/120 mmHg with neurological symptoms.\n- **Symptoms**: severe headache, confusion, visual disturbances, seizures, papilledema.\n- **Intervention**: IV antihypertensives (labetalol, nicardipine, nitroprusside); reduce MAP by ≤ 25% in first hour.\n- **Rapid drop danger**: cerebral ischemia (autoregulation shifts in chronic hypertension).\n- **Monitor**: neuro status q15–30 min, UO, ECG (LVH changes), fundoscopy findings." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "A client with BP 220/130 mmHg, severe headache, and sudden confusion: **notify provider immediately, position HOB 30°, anticipate IV antihypertensive, continuous neuro monitoring**. Avoid aggressive oral antihypertensives that cause uncontrolled drops." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Controlled reduction** is the key phrase — avoid answer choices that imply 'normalize BP as fast as possible.'\n- **Nitroprusside**: monitor for cyanide toxicity (thiocyanate levels) on prolonged infusion.\n- **Hypertensive urgency** (no organ damage) vs. **emergency** (end-organ damage) — emergency requires IV therapy in ICU." },
    ],
  },

  "infective-endocarditis-nclex-rn": {
    seoTitle: "Infective Endocarditis | NCLEX-RN US | NurseNest",
    seoDescription: "Infective endocarditis nursing care for NCLEX-RN: emboli risk, antibiotic therapy, and valve monitoring.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Infective endocarditis (IE)** involves infection of the heart valves or endocardium. NCLEX-RN items test **embolic complication recognition**, IV antibiotic management, and teaching for high-risk clients (valve disease, IV drug use, prosthetic valves)." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Signs**: fever, new/changing murmur, Osler's nodes (painful, finger pads), Janeway lesions (painless, palms/soles), Roth spots (retinal), splinter hemorrhages.\n- **Emboli risk**: septic emboli → stroke, renal infarct, pulmonary emboli, splenic infarct.\n- **IV antibiotics**: 4–6 weeks; monitor drug levels (vancomycin trough).\n- **Blood cultures**: before antibiotics; serial cultures to confirm clearance.\n- **Dental prophylaxis**: high-risk clients need prophylactic antibiotics before invasive dental procedures." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "A client with IE develops sudden hemiplegia and facial droop — **embolic stroke**: activate rapid response/stroke team, CT without contrast, record onset time. Do not elevate head more than 15–30° until stroke type is confirmed. Continue monitoring for additional emboli (renal, pulmonary)." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Blood cultures before antibiotics** = highest priority initial action.\n- **Osler's nodes are painful; Janeway lesions are painless** — know which is which.\n- Teach client: notify any provider (dental, surgical) about IE history before procedures." },
    ],
  },

  "myocardial-infarction-nclex-rn": {
    seoTitle: "Myocardial Infarction | NCLEX-RN US | NurseNest",
    seoDescription: "MI nursing priorities for NCLEX-RN: MONA protocol, STEMI response, post-MI monitoring, and discharge education.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Myocardial infarction (MI)** is the highest-yield cardiovascular NCLEX-RN topic. Items test the **MONA protocol**, 12-lead interpretation basics, PCI/thrombolytic criteria, post-MI monitoring, and patient education." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **MONA**: Morphine → Oxygen (if SpO₂ < 94%) → Nitrates → Aspirin 325 mg.\n- **STEMI**: persistent ST elevation ≥ 0.1 mV in ≥ 2 contiguous leads → emergent PCI preferred (door-to-balloon ≤ 90 min).\n- **Troponin**: gold standard biomarker; peaks 12–24 h, returns to baseline 10–14 days.\n- **Post-MI complications**: dysrhythmias (first 24 h), HF, cardiogenic shock, pericarditis (day 2–3), Dressler's syndrome (weeks later).\n- **Thrombolytics**: if PCI unavailable within 120 min; absolute CI = active hemorrhage, recent surgery, hemorrhagic stroke." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "Client with crushing chest pain, diaphoresis, ST elevation in V1–V4: **call provider, 12-lead ECG, administer aspirin, activate cath lab, obtain IV access, NPO**. Prioritize STEMI protocol over completing admission assessment. Post-PCI: monitor access site, distal pulses, UO (contrast nephropathy), and telemetry." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **12-lead ECG is first action** — not calling the provider, not morphine.\n- **Nitrates contraindicated**: right ventricular MI (ST elevation in II, III, aVF + RV involvement), hypotension, PDE-5 inhibitor use.\n- **Discharge education**: medications (aspirin, statin, beta blocker, ACE inhibitor), activity limits, return precautions." },
    ],
  },

  "peripheral-artery-disease-nclex-rn": {
    seoTitle: "Peripheral Artery Disease | NCLEX-RN US | NurseNest",
    seoDescription: "PAD nursing care for NCLEX-RN: assessment, claudication, wound care, and post-procedure monitoring.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Peripheral artery disease (PAD)** involves atherosclerosis of the extremity arteries. NCLEX-RN tests **assessment of perfusion**, distinguishing arterial vs. venous insufficiency, wound care principles, and post-revascularization monitoring." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Classic symptom**: intermittent claudication — cramping with activity, relieved by rest.\n- **ABI (Ankle-Brachial Index)**: < 0.9 = PAD; < 0.4 = critical limb ischemia.\n- **Arterial ulcer characteristics**: painful, punched-out, dry, pale, on tips/between toes.\n- **6 P's of acute ischemia**: Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia.\n- **Positioning**: legs in dependent position (gravity assists perfusion); do not elevate (worsens ischemia).\n- **Wound care**: protect from trauma; avoid heat (decreased sensation = burn risk)." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "A client with PAD reports sudden loss of sensation in the foot and a foot that has become cold and mottled — **acute limb ischemia: call provider immediately, anticipate emergent vascular surgery consult and anticoagulation**. Do not apply heat. Reassess pulses and motor function every 15 minutes." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Arterial vs. venous**: arterial = painful, pale, no edema; venous = brownish pigmentation, edema, superficial ulcers over medial malleolus.\n- **Do not elevate arterial disease legs** — gravity helps blood flow distally.\n- **Smoking cessation is the single most impactful intervention** for slowing PAD progression." },
    ],
  },

  "phlebostatic-axis-nclex-rn": {
    seoTitle: "Phlebostatic Axis and Hemodynamic Monitoring | NCLEX-RN US | NurseNest",
    seoDescription: "Phlebostatic axis and invasive hemodynamic monitoring for NCLEX-RN: zeroing, leveling, and waveform interpretation.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "The **phlebostatic axis** is the anatomical landmark used to zero and level invasive hemodynamic monitoring lines (arterial lines, CVP, PA catheter). NCLEX-RN tests **correct positioning of the transducer**, interpreting CVP/PAWP, and troubleshooting damped waveforms." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Phlebostatic axis**: intersection of the 4th intercostal space and midaxillary line — level of the right atrium.\n- **Zeroing**: opening transducer to air at the phlebostatic axis level; eliminates atmospheric pressure reading.\n- **CVP normal**: 2–8 mmHg; elevated = fluid overload or right HF; low = hypovolemia.\n- **PAWP (wedge)**: 8–12 mmHg; elevated = left HF; low = hypovolemia.\n- **Damped waveform**: clot, kink, air — irrigate per protocol; check connections.\n- **Position changes**: re-level transducer every time the HOB angle changes." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "Client's CVP reads 2 mmHg after repositioning from flat to 30° HOB. Before treating for hypovolemia: **re-level and re-zero the transducer at the new position**. Documenting waveform findings without correcting for position is a common error." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **Transducer too low** → falsely HIGH reading; **too high** → falsely LOW reading.\n- **Re-zero at every position change** is the correct answer when readings seem inconsistent.\n- NCLEX may ask about the anatomical landmark by description — know it is 4th ICS midaxillary." },
    ],
  },

  "pulmonary-embolism-nclex-rn": {
    seoTitle: "Pulmonary Embolism (Extended) | NCLEX-RN US | NurseNest",
    seoDescription: "Comprehensive PE nursing for NCLEX-RN: Virchow's triad, anticoagulation management, and emergent escalation.",
    sections: [
      { id: "intro", heading: "Introduction", kind: "intro", body: "**Pulmonary embolism (PE)** blocks pulmonary arterial flow, causing ventilation-perfusion mismatch. This extended lesson covers **hemodynamically unstable PE** escalation, thrombolytic criteria, IVC filter indications, and chronic anticoagulation management for NCLEX-RN." },
      { id: "core", heading: "Core concepts", kind: "core", body: "- **Unstable PE**: hypotension, syncope, RV failure → IV heparin + consider thrombolytics (alteplase).\n- **Thrombolytics**: indicated for massive PE with hemodynamic compromise; CI = recent surgery, stroke.\n- **IVC filter**: for recurrent PE despite anticoagulation or when anticoagulation is contraindicated.\n- **Heparin drip**: aPTT goal 60–100 s; transition to warfarin (INR 2–3) or NOAC for 3–6 months.\n- **D-dimer**: sensitive but not specific; useful to rule out PE (negative = low probability).\n- **Positioning**: HOB 30–45°; oxygen to maintain SpO₂ > 94%." },
      { id: "clinical_application", heading: "Clinical application", kind: "clinical_application", body: "Post-surgical client develops sudden pleuritic chest pain, SpO₂ 88%, HR 125, BP 88/60. **Priority actions**: call rapid response, apply high-flow oxygen, position upright, anticipate IV heparin bolus, CT pulmonary angiography. Do not leave the bedside; document time of symptom onset." },
      { id: "exam_tips", heading: "Exam tips", kind: "exam_tips", body: "- **PE vs. MI**: PE has pleuritic chest pain + respiratory symptoms; MI has crushing pain + diaphoresis.\n- **Do not massage** the suspected source leg (DVT embolization risk).\n- **Thrombolytics for PE** = only massive/submassive with hemodynamic compromise; otherwise anticoagulation alone." },
    ],
  },
};

function main() {
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(raw);

  const pathway = catalog.pathways["us-rn-nclex-rn"];
  if (!pathway) throw new Error("Pathway us-rn-nclex-rn not found");

  let patched = 0;
  let skipped = 0;

  for (const lesson of pathway.lessons) {
    const patch = PATCHES[lesson.slug];
    if (!patch) continue;

    if ((lesson.sections ?? []).length >= 2) {
      skipped++;
      console.log(`  SKIP (already has sections): ${lesson.slug}`);
      continue;
    }

    lesson.sections = patch.sections;
    if (patch.seoTitle && !lesson.seoTitle) lesson.seoTitle = patch.seoTitle;
    if (patch.seoDescription && !lesson.seoDescription) lesson.seoDescription = patch.seoDescription;
    lesson.previewSectionCount = 1;
    patched++;
    console.log(`  PATCHED: ${lesson.slug} (${patch.sections.length} sections)`);
  }

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  console.log(`\nDone. Patched=${patched}, Skipped=${skipped}`);
}

main();
