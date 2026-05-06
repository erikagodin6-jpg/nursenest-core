#!/usr/bin/env node
/**
 * One-off generator: writes rn-nclex-cardiovascular-expansion-catalog.json
 * Run from nursenest-core: node scripts/generate-rn-cardio-expansion-catalog.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../src/content/pathway-lessons/rn-nclex-cardiovascular-expansion-catalog.json");

const DEFS = [
  {
    slug: "hemodynamic-monitoring-cvp-map-pawp",
    title: "Hemodynamic Monitoring Basics: CVP, MAP, PAWP",
    meaning:
      "**Central venous pressure (CVP)**, **mean arterial pressure (MAP)**, and **pulmonary artery wedge pressure (PAWP)** help nurses interpret **preload**, **afterload**, and **pump function** in critically ill clients. CVP approximates **right-sided filling** when measured at end-expiration with a calibrated transducer; MAP estimates **organ perfusion pressure** and is a common resuscitation target; PAWP reflects **left-sided filling pressures** when a pulmonary artery catheter is in place and the balloon is wedged per protocol. Canadian stems may show **kPa** for pressures in some contexts, but NCLEX-RN prioritization hinges on **trend interpretation**, **artifact avoidance**, and **knowing what each number cannot tell you alone**.",
    exam:
      "Items reward **trending** over single snapshots, **levelling and zeroing** themes, and **first actions** when a line disconnects or dampens. Traps include treating CVP as a perfect volume number, ignoring **valve disease** or **ventricular interdependence**, or choosing **large fluid boluses** solely because CVP is “low” when the client has **end-stage right heart failure** or **tamponade** physiology in the stem.",
    core: `- **CVP**: influenced by **PEEP**, **intra-abdominal pressure**, **tricuspid disease**, and **respiratory variation** — interpret with the whole exam.\n- **MAP**: roughly **(SBP + 2×DBP)/3**; used with **urine output** and **mentation** to judge perfusion.\n- **PAWP**: obtained only with **provider orders** and **waveform confirmation**; never inflate the balloon longer than protocol allows.\n- **Nursing priorities**: maintain **sterile dressings**, **stopcock integrity**, **alarm limits**, and **clear handoff** of numeric baselines after repositioning.`,
    scenario:
      "**Patient vignette.** A 67-year-old client post–**mitral valve repair** has a **PA catheter** and arterial line. After turning, the nurse notices the **arterial waveform is dampened** and **MAP** reads **58 mmHg**, while **CVP** rose from **8 to 14 mmHg** with unchanged **PAWP** on the screen capture you are shown.\n\n**Fork:** Your **first** actions cluster around **assessing line patency**, **re-levelling** transducers if indicated, **comparing** to non-invasive BP, and **notifying** the provider with **objective data** — not bolusing fluid based on one CVP value alone.",
    takeaways:
      "- **Trend beats snapshot** for all invasive pressures.\n- **Waveform quality** is part of assessment — dampening can hide real hypotension.\n- **Synthesis:** Pair invasive numbers with **perfusion** (mentation, UO, lactate themes when shown) before choosing aggressive fluids.\n\n**Related:** [heart failure priorities](LESSON:heart-failure-nursing-priorities-hy) · [shock recognition](LESSON:shock-recognition-fluids) · [Canada RN hub](/canada/rn/nclex-rn/lessons) · [US RN hub](/us/rn/nclex-rn/lessons).",
  },
  {
    slug: "arterial-line-blood-pressure-monitoring",
    title: "Arterial Lines and Blood Pressure Monitoring",
    meaning:
      "**Arterial lines** provide **continuous beat-to-beat** blood pressure monitoring and **reliable sampling** for **ABGs** in unstable clients. Nursing responsibilities include **insertion assist** per scope, **securement**, **dressing integrity**, **zeroing** the transducer at the **phlebostatic axis**, **alarm management**, and **recognizing complications** (ischemia, thrombosis, infection, hemorrhage from disconnect). For NCLEX-RN, distinguish **artifact** (kinked tubing, air bubbles, patient movement) from **true hypotension** before escalating therapy.",
    exam:
      "Boards test **first-line safety**: **stop bleeding** if a line disconnects, **activate help** for sudden hemorrhage, **compare** invasive and non-invasive pressures when waveforms look wrong, and **avoid** wrist flexion injury in radial sites. Expect questions on **Allen test** themes when radial access is planned and **neurovascular checks** for distal perfusion after placement.",
    core: `- **Monitoring bundle**: continuous waveform when ordered, **q-shift** site checks, **mark insertion** date, **closed** sampling system.\n- **Complications**: **distal ischemia** (pallor, pain, weak pulse), **infection** at hub/dressing, **hematoma**.\n- **Overdamped vs underdamped** waveforms change numeric display — reassess setup before treating numbers.\n- **Scope:** nurses **do not** independently remove arterial lines unless protocol explicitly allows; follow orders for discontinuation.`,
    scenario:
      "**Patient vignette.** A 54-year-old client in **ICU** has a **radial arterial line**. The nurse notes **bright red blood** pulsing from a **loose connection** at the stopcock while the monitor alarms **MAP 40**.\n\n**Fork:** **Immediate patient safety** — **tighten/close** the system per training, **apply pressure** if external bleeding, **call for help**, and **notify** the provider while monitoring **distal perfusion**. Do not leave to **complete charting** first.",
    takeaways:
      "- **Disconnect = bleeding risk** until proven otherwise.\n- **Waveform troubleshooting** precedes blind fluid pushes.\n\n**Related:** [hemodynamic monitoring](LESSON:hemodynamic-monitoring-cvp-map-pawp) · [shock](LESSON:shock-recognition-fluids) · [US hub](/us/rn/nclex-rn/lessons).",
  },
  {
    slug: "cardiac-output-stroke-volume-nclex-rn",
    title: "Cardiac Output and Stroke Volume",
    meaning:
      "**Cardiac output (CO)** is **stroke volume × heart rate** and represents **minute delivery** of blood to tissues. **Stroke volume** depends on **preload**, **afterload**, and **contractility**. NCLEX-RN frames these relationships for **heart failure**, **shock**, and **arrhythmia** vignettes where the nurse must connect **tachycardia** compensating for low SV, or **bradycardia** collapsing CO despite “normal” squeeze.",
    exam:
      "Examiners love **compensation limits**: HR can only maintain CO until **diastolic filling** or **ischemia** breaks the cycle. They test **assessment cues** (JVD, lung congestion, cool extremities) rather than asking you to solve thermodilution arithmetic.",
    core: `- **Preload**: volume returning to the ventricle — **too low** → hypoperfusion; **too high** → congestion in HF.\n- **Afterload**: resistance the ventricle must overcome — **high SVR** can drop SV when contractility is fixed.\n- **Contractility**: weakened in **ischemia**, **sepsis late**, **negative inotropes**.\n- **Nursing actions**: strict **I&O**, **daily weights**, **telemetry**, **orthostatic vitals** when appropriate, and **medication timing** for afterload reducers per orders.`,
    scenario:
      "**Patient vignette.** A client with **acute HF** has **HR 128** in **sinus tachycardia**, **BP 92/60**, and **cool fingers** with **UOP 15 mL/hr** for two hours.\n\n**Fork:** Think **low perfusion with compensatory tachycardia** — prioritize **assessment**, **notify provider**, **prepare** for ordered diuretics/inotropes/nitrates per pathway, and **avoid** strenuous ambulation.",
    takeaways:
      "- **HR is not “just anxiety”** when perfusion is failing.\n- **SV × HR** helps you explain why **new AFib** can crash CO.\n\n**Related:** [AFib rate control](LESSON:atrial-fibrillation-rate-control) · [HF priorities](LESSON:heart-failure-nursing-priorities-hy).",
  },
  {
    slug: "mixed-venous-oxygen-saturation-svo2",
    title: "Mixed Venous Oxygen Saturation (SvO₂ / ScvO₂)",
    meaning:
      "**Mixed venous oxygen saturation (SvO₂)** reflects the **balance between oxygen delivery and oxygen consumption** in the pulmonary artery sample. **Central venous ScvO₂** (from a central line) is a related surrogate used in some sepsis bundles. A **falling** value can signal **low delivery** (anemia, hypoxia, low CO) or **high consumption** (fever, shivering, stress) — the nurse integrates **SpO₂**, **hemoglobin**, **perfusion**, and **lactate** themes when the stem provides them.",
    exam:
      "NCLEX tests **interpretation**, not memorizing a single threshold for every device. Expect **pre-analytic** errors (draw from wrong port) and **clinical integration** questions where **SaO₂ is high** but **delivery is still poor** because hemoglobin or CO is inadequate.",
    core: `- **Delivery components**: **SaO₂**, **Hb**, **cardiac output**.\n- **Consumption**: sepsis, pain, fever — can lower saturation of venous blood even when lungs look “fine.”\n- **Nursing care**: label **line ports**, draw from **correct lumens**, trend values, and communicate **sudden** drops.\n- **Safety:** never treat a number in isolation — **examine the patient**.`,
    scenario:
      "**Patient vignette.** After **major surgery**, a client’s **ScvO₂** drops from **74% to 62%** with **rising lactate**, **HR 118**, and **BP trending down**.\n\n**Fork:** Treat as **supply/demand mismatch** — **notify provider**, **increase monitoring**, **review** bleeding, **fluid responsiveness** per orders, and **oxygen** therapy per protocol.",
    takeaways:
      "- **Falling SvO₂/ScvO₂ + lactate** is an escalation flag.\n- **High SpO₂** does not guarantee adequate **delivery**.\n\n**Related:** [shock recognition](LESSON:shock-recognition-fluids) · [sepsis gold](LESSON:sepsis-early-recognition-gold).",
  },
  {
    slug: "heart-blocks-degrees-mobitz-nclex-rn",
    title: "Heart Blocks: First Degree, Mobitz I, Mobitz II, Third Degree",
    meaning:
      "**AV blocks** describe **delayed or interrupted** conduction between atria and ventricles. **First-degree** PR prolongation is usually stable monitoring. **Mobitz I (Wenckebach)** often has **benign progression patterns** on monitored floors but still requires **trend review**. **Mobitz II** and **third-degree (complete) heart block** are **high-risk** for **sudden bradycardia** and **hypoperfusion** and frequently require **pacing** or **medication** per ACLS-aligned orders.",
    exam:
      "Items discriminate **stable vs unstable bradycardia**: hypotension, altered mentation, pulmonary edema, ischemic chest pain → **atropine/transcutaneous pacing** themes and **rapid communication**. Do not confuse **Mobitz I** with **Mobitz II** when the stem shows **constant PR** with **sudden dropped QRS**.",
    core: `- **Mobitz I**: **lengthening PR** then dropped beat.\n- **Mobitz II**: **constant PR** with intermittent non-conducted P waves — **risk of complete block**.\n- **Third-degree**: **AV dissociation** — P waves march through independent of QRS.\n- **Nursing**: continuous **telemetry**, **symptom checks**, **transcutaneous pacing pad** readiness when unstable.`,
    scenario:
      "**Patient vignette.** A client with **inferior MI** history develops **HR 38**, **BP 78/50**, and **dizziness**. Telemetry shows **more P waves than QRS complexes** with **wide escape rhythm**.\n\n**Fork:** **Unstable bradycardia** — **call for help**, **prepare TCP**, **give atropine** per order/protocol, **oxygen** as indicated, and **continuous monitoring**.",
    takeaways:
      "- **Symptoms + high-grade block** = urgent pathway.\n- **Mobitz II** is **more ominous** than Wenckebach in many acute settings.\n\n**Related:** [temporary pacemaker care](LESSON:temporary-pacemaker-bedside-nursing) · [ACS](LESSON:acute-coronary-syndrome-nclex-rn).",
  },
  {
    slug: "ventricular-dysrhythmias-vt-vf-torsades",
    title: "Ventricular Dysrhythmias: VT, VF, and Torsades",
    meaning:
      "**Ventricular tachycardia (VT)** ranges from **stable monomorphic** rhythms to **pulseless arrest**. **Ventricular fibrillation (VF)** is a **perfusionless** rhythm requiring **defibrillation**. **Torsades de pointes** is **polymorphic VT** in the setting of **QT prolongation** and may respond to **magnesium** while **correcting triggers** (electrolytes, drug toxicity). Nursing roles centre on **early recognition**, **defibrillator readiness**, **CPR quality**, and **post-resuscitation** monitoring.",
    exam:
      "NCLEX-RN uses **pulse check** and **stability** forks. **Pulseless VT/VF** → **defibrillate** and **CPR** per BLS/ACLS training themes. **Stable VT with pulse** → **provider-led pharmacologic cardioversion** and **monitoring** — not unsupervised ambulation.",
    core: `- **VF/pulseless VT**: **immediate defibrillation** + CPR per protocol.\n- **Torsades**: **magnesium sulfate** themes; **overdrive pacing** in refractory cases per specialty.\n- **QT monitoring** on high-risk meds (multiple antiarrhythmics, some antibiotics, ondansetron caution contexts).\n- **Safety**: clear the bed during **shock**; document times and outcomes.`,
    scenario:
      "**Patient vignette.** A client on **telemetry** suddenly **loses consciousness** with **rapid wide-complex rhythm** and **no palpable pulse**.\n\n**Fork:** **Cardiac arrest pathway** — **call for help**, start **CPR**, **retrieve AED/defibrillator**, and **defibrillate** for shockable rhythm per training.",
    takeaways:
      "- **No pulse** changes every answer set.\n- **Magnesium** belongs in **torsades** teaching, not every wide-complex rhythm.\n\n**Related:** [defibrillation vs cardioversion](LESSON:defibrillation-vs-synchronized-cardioversion-nclex-rn) · [digoxin toxicity](LESSON:digoxin-toxicity-nursing-safety).",
  },
  {
    slug: "pacemakers-icds-nursing-care",
    title: "Pacemakers and ICDs: Nursing Assessment and Safety",
    meaning:
      "**Permanent pacemakers** support **rate/bradycardia** indications; **implantable cardioverter-defibrillators (ICDs)** also treat **life-threatening ventricular arrhythmias**. Nurses monitor **incision sites**, **device interrogation plans**, **magnet policy** per facility, **arm restrictions**, and **psychosocial** responses to shocks. **Electromagnetic interference** is a teaching topic for home and community exposures.",
    exam:
      "Boards test **post-op checks** (pocket hematoma, signs of infection), **patient anxiety after shock**, and **MRI compatibility** themes (follow device card and orders). Avoid advising patients to **disable therapies** without cardiology direction.",
    core: `- **Incision**: redness, drainage, pain out of proportion — escalate infection concerns.\n- **Shock burden**: repeated shocks → **emergency** evaluation.\n- **Activity**: usually **limited** lifting on device side early post-op per orders.\n- **Documentation**: capture **symptoms** with **time** of suspected device therapy.`,
    scenario:
      "**Patient vignette.** A client **24 hours post ICD** reports **three shocks** in an hour with **ongoing dizziness**.\n\n**Fork:** **Treat as emergency** — **monitor**, **establish IV access**, **notify cardiology/rapid response**, and **prepare for interrogation** per policy.",
    takeaways:
      "- **Repeated shocks** are never “watch and wait” at home or on the unit without provider direction.\n- **Pocket swelling** can be hematoma or bleed — measure and escalate.\n\n**Related:** [temporary pacemaker](LESSON:temporary-pacemaker-bedside-nursing) · [VT/VF lesson](LESSON:ventricular-dysrhythmias-vt-vf-torsades).",
  },
  {
    slug: "ecg-systematic-interpretation-nclex-rn",
    title: "ECG Systematic Interpretation for NCLEX-RN",
    meaning:
      "A **repeatable ECG sequence** reduces errors: **rate**, **rhythm**, **axis**, **intervals (PR/QRS/QT)**, **ST/T changes**, and **clinical correlation**. NCLEX-RN rewards **identifying ischemia**, **life-threatening arrhythmias**, **hyperkalemia peaks**, and **drug toxicity patterns** — then choosing **assessment and escalation** over charting alone.",
    exam:
      "Items often show **one lead snippet** — practice naming **ST elevation territory** when possible and **differentiating** artifact from ischemia. Traps include **ignoring prolonged QT** or **missing irregularly irregular** rhythm as AFib.",
    core: `- **Rate**: 300 method for regular rhythms; **irregular** → count over 6 seconds ×10.\n- **Axis deviation** hints: **LBBB/RBBB**, **hemiblocks** — document and notify when new.\n- **Ischemia**: ST changes + symptoms → **time-sensitive** pathway.\n- **QT**: prolonged → **torsades risk**; review meds and electrolytes per orders.`,
    scenario:
      "**Patient vignette.** A nurse prints a **12-lead** showing **ST elevations** in **inferior leads** with **active chest pain**.\n\n**Fork:** **Activate ACS pathway** per facility — **continuous monitoring**, **notify provider**, **prepare** for labs/orders, **avoid** solo walks to the bathroom.",
    takeaways:
      "- **System beats guessing** — same order every strip.\n- **Symptoms + ECG** together drive urgency.\n\n**Related:** [pericarditis ECG](LESSON:pericarditis-ecg-clues) · [MI troponin](LESSON:acute-myocardial-infarction-troponin).",
  },
  {
    slug: "aortic-stenosis-vs-aortic-regurgitation",
    title: "Aortic Stenosis vs Aortic Regurgitation",
    meaning:
      "**Aortic stenosis (AS)** obstructs **systolic ejection**, producing a **crescendo–decrescendo systolic murmur** radiating to the **carotids**, **narrow pulse pressure**, and **syncope/angina/HF** symptoms when severe. **Aortic regurgitation (AR)** leaks in **diastole**, yielding a **blowing early diastolic murmur** at the **left sternal border**, **wide pulse pressure**, and **bounding pulses** when hemodynamically significant.",
    exam:
      "NCLEX tests **afterload sensitivity** in AS (avoid **vasodilator hypotension** themes without careful monitoring) versus **volume support** nuances in acute AR presentations when the stem frames **shock** — always follow the vignette’s orders and hemodynamics.",
    core: `- **AS**: **delayed carotid upstroke**, **S4** common; **avoid severe hypotension**.\n- **AR**: **Corrigan pulse** themes, **pulsatile nail bed** (Quincke) when described.\n- **Nursing**: **orthostatic** symptoms, **activity tolerance**, **infection** prophylaxis teaching for valve disease per current guideline framing in the stem.\n- **Post-TAVR** themes may appear as **bleeding** and **conduction checks** — monitor per protocol.`,
    scenario:
      "**Patient vignette.** A client with known **severe AS** receives **hydralazine** for BP and becomes **hypotensive with altered mentation**.\n\n**Fork:** **Perfusion crisis** — **stop** further doses per scope, **assess**, **notify provider**, **prepare** for ordered vasopressors/volume cautiously per AS physiology.",
    takeaways:
      "- **Narrow vs wide pulse pressure** is a quick discriminator on exams.\n- **Hypotension + AS** is high risk — communicate early.\n\n**Related:** [murmur recognition](LESSON:murmur-recognition-nurses-nclex) · [valve replacement care](LESSON:valve-replacement-postop-nursing-care).",
  },
  {
    slug: "mitral-stenosis-vs-mitral-regurgitation",
    title: "Mitral Stenosis vs Mitral Regurgitation",
    meaning:
      "**Mitral stenosis (MS)** limits **left atrial emptying** into the LV, often from **rheumatic** disease, with **low-pitched diastolic rumble** after an opening snap and **pulmonary congestion** out of proportion to LV systolic function. **Mitral regurgitation (MR)** leaks **systolic** flow back to the LA, causing a **holosystolic murmur** at the **apex** radiating to the axilla and **volume overload** of the LA/LV over time.",
    exam:
      "Boards link **AFib + MS** as **stroke risk** and **rate-control** teaching, and **acute MR** (papillary rupture post-MI) as **flash pulmonary edema** emergencies requiring **rapid escalation**.",
    core: `- **MS**: **diastolic** problem — think **LA pressure**, **dyspnea with exertion**, **hemoptysis** in severe cases.\n- **MR**: **holosystolic**; acute MR from **rupture** → sudden respiratory failure.\n- **Nursing**: **telemetry**, **anticoagulation** teaching when AFib coexists, **I&O**, **oxygen**.\n- **Post-procedure** mitral clips/repairs → **complication surveillance** per orders.`,
    scenario:
      "**Patient vignette.** Post-MI client suddenly develops **frothy pink sputum** and **crackles** with a **new harsh murmur**.\n\n**Fork:** Think **acute valvular catastrophe** — **high-Fowler’s**, **oxygen**, **notify provider**, **prepare** for echo/surgical consult themes — not routine discharge teaching.",
    takeaways:
      "- **Timing within the cardiac cycle** defines murmur type.\n- **Sudden MR** is a **respiratory emergency** until proven otherwise.\n\n**Related:** [HF priorities](LESSON:heart-failure-nursing-priorities-hy) · [MI troponin](LESSON:acute-myocardial-infarction-troponin).",
  },
  {
    slug: "murmur-recognition-nurses-nclex",
    title: "Murmur Recognition for Nurses (High-Yield Patterns)",
    meaning:
      "NCLEX-RN expects **pattern recognition**, not cardiology fellowship detail: **systolic vs diastolic timing**, **location**, **radiation**, and **clinical context** (fever + new murmur → **endocarditis** suspicion; **radiation to carotids** → **AS**). Nurses correlate murmur **changes** with **hemodynamics** and **notify** the provider for **new or worsening** sounds after MI, procedures, or sepsis.",
    exam:
      "Traps include **confusing a benign flow murmur** with **pathologic murmur** when the stem gives **fever**, **embolic phenomena**, or **acute HF**. Another trap is **delaying notification** to finish routine tasks.",
    core: `- **Systolic**: AS, MR, VSD, **HOCM** vignettes.\n- **Diastolic**: AR, MS.\n- **Continuous**: PDA, sometimes **AV fistula** contexts.\n- **Always** pair sound with **vitals, SpO₂, perfusion**.\n- **Documentation**: timing, grade if trained, location, patient position.`,
    scenario:
      "**Patient vignette.** A client with **IVDU** has a **new murmur** on day 3 of **fever**.\n\n**Fork:** **IE workup** pathway — **blood cultures** per orders before antibiotics when stable enough, **monitor for emboli**, **strict line care**.",
    takeaways:
      "- **New murmur + fever** → infection/endocarditis differential until cleared.\n- **Compare** to prior assessments when possible.\n\n**Related:** [endocarditis](LESSON:endocarditis-blood-cultures) · [AS vs AR](LESSON:aortic-stenosis-vs-aortic-regurgitation).",
  },
  {
    slug: "valve-replacement-postop-nursing-care",
    title: "Valve Replacement: Postoperative Nursing Care",
    meaning:
      "After **surgical valve replacement** (tissue or mechanical) or **TAVR**, nurses monitor **rhythm** (heart block risk), **bleeding**, **temp**, **pain**, **lung fields**, and **anticoagulation** plans. **Mechanical valves** require **lifelong warfarin** in classic teaching; **DOACs** appear in guideline-evolving stems — follow the item’s framing.",
    exam:
      "Items test **INR teaching**, **bleeding precautions**, **infection signs** at sternotomy, and **pacing wire** safety for temporary epicardial wires when present.",
    core: `- **Airway/oxygen/turn/cough** per post-op orders.\n- **Anticoagulation**: lab schedules, **avoid NSAIDs** unless ordered.\n- **Endocarditis prophylaxis** teaching follows **current guideline cues** in the stem.\n- **Neuro checks** for embolic or hypoperfusion events.`,
    scenario:
      "**Patient vignette.** Day 2 post **AVR**, **HR 42** with **dizziness** and **new wide QRS**.\n\n**Fork:** **Conduction complication** — **telemetry alert**, **notify surgeon/cardiology**, **prepare TCP** per protocol, **avoid** sedating walks alone.",
    takeaways:
      "- **New brady/blocks** after valve surgery are **time-sensitive**.\n- **Anticoagulation education** starts before discharge when stable.\n\n**Related:** [post cardiac surgery](LESSON:post-cardiac-surgery-priorities-nclex) · [temporary pacemaker](LESSON:temporary-pacemaker-bedside-nursing).",
  },
  {
    slug: "cardiac-catheterization-pre-post-care-nclex",
    title: "Cardiac Catheterization: Pre- and Post-Procedure Nursing Care",
    meaning:
      "**Cardiac catheterization** diagnoses and treats coronary disease. Pre-procedure nursing focuses on **NPO orders**, **allergy history** (iodinated contrast), **renal baseline**, **medication holds** (metformin themes per protocol), **vascular access site** prep, and **anxiety reduction**. Post-procedure care emphasizes **bedrest**, **distal perfusion checks**, **bleeding/hematoma surveillance**, and **hydration** per orders to protect kidneys.",
    exam:
      "NCLEX punishes **early ambulation** after **femoral** access when orders require flat bedrest. It rewards **recognizing retroperitoneal bleed** (back pain, dropping Hgb, hypotension) and **false aneurysm** signs at the groin.",
    core: `- **Radial vs femoral**: **radial** often allows earlier mobility per protocol.\n- **Post**: frequent **distal pulses**, **sandbag** themes if used, **pain** at site.\n- **Contrast**: **flush kidneys** per orders; monitor **UO**.\n- **Teach**: when to call for **bleeding**, **chest pain**, **neurologic changes**.`,
    scenario:
      "**Patient vignette.** Post **femoral cath**, the client develops **increasing groin pain**, **BP drop**, and **pale foot**.\n\n**Fork:** **Vascular emergency** until evaluated — **notify provider**, **mark pulses**, **hold pressure** per protocol, **prepare** for rapid response imaging/surgery themes.",
    takeaways:
      "- **Pulse + site + BP** together beat “mild discomfort.”\n- **Contrast + AKI risk** → monitor renal status per orders.\n\n**Related:** [PCI complications](LESSON:pci-stents-complications-nursing-priorities) · [ACS](LESSON:acute-coronary-syndrome-nclex-rn).",
  },
  {
    slug: "pci-stents-complications-nursing-priorities",
    title: "PCI and Stents: Complications and Nursing Priorities",
    meaning:
      "**Percutaneous coronary intervention (PCI)** restores perfusion but carries **bleeding**, **vascular access injury**, **stent thrombosis**, **contrast-induced nephropathy**, and **arrhythmia** risks. Nurses monitor **antiplatelet adherence**, **groin/radial site**, **troponin trends**, **rhythm**, and **chest pain recurrence** — linking symptoms to **urgent re-evaluation**.",
    exam:
      "Boards test **dual antiplatelet therapy** teaching and **when chest pain returns** after PCI (assume **until proven otherwise** ischemia). They also test **bleeding** on anticoagulant/antiplatelet stacks.",
    core: `- **Stent thrombosis**: sudden pain + ST changes → **emergency** activation.\n- **Access site**: swelling, bruit, pulse loss.\n- **Renal protection**: fluids/hold nephrotoxins per orders.\n- **Medication teaching**: **do not stop DAPT** without cardiology unless bleeding mandates it — per stem.`,
    scenario:
      "**Patient vignette.** 6 hours post **PCI**, the client reports **crushing chest pain** with **ST elevation** on monitor.\n\n**Fork:** **ACS recurrence** — **oxygen** per orders, **notify provider**, **12-lead**, **prepare** for repeat cath lab activation per policy.",
    takeaways:
      "- **Recurrent chest pain post PCI** is treated as **emergent**.\n- **Adherence** to antiplatelet plans prevents thrombosis.\n\n**Related:** [post PCI complications prioritization](LESSON:post-pci-complications-who-first-nclex) · [MI troponin](LESSON:acute-myocardial-infarction-troponin).",
  },
  {
    slug: "temporary-pacemaker-bedside-nursing",
    title: "Temporary Pacemakers: Bedside Safety and Troubleshooting",
    meaning:
      "**Temporary transvenous pacing** supports the heart during **high-grade AV block**, **brady arrest risk**, or **bridge** to permanent device. Nurses maintain **connector integrity**, **threshold checks** per policy, **dressing and insertion site** care, **spike capture on monitor**, and **prevent dislodgement** by securing cables and educating about **movement limits**.",
    exam:
      "Items reward **loss of capture** recognition (pacing spikes without following QRS), **battery/generator checks**, and **never** tugging wires. Expect **microshock** prevention themes in older teaching contexts.",
    core: `- **Capture**: each spike should **follow** with depolarization when pacing.\n- **Sensitivity**: **undersensing** can cause dangerous stacking — escalate per policy.\n- **Safety**: **two-person** checks when changing settings unless protocol allows solo RN adjustments.\n- **Backup**: **TCP pads** on unstable patients when ordered.`,
    scenario:
      "**Patient vignette.** Pacing alarms show **spikes without QRS** and **HR falls to 30**.\n\n**Fork:** **Loss of capture** — **call for help**, **ensure emergency transcutaneous pacing readiness**, **notify provider**, **check connections** per training.",
    takeaways:
      "- **Capture failure** is an **immediate** safety issue.\n- **Secure externalized hardware** every shift.\n\n**Related:** [heart blocks](LESSON:heart-blocks-degrees-mobitz-nclex-rn) · [permanent pacemaker](LESSON:pacemakers-icds-nursing-care).",
  },
  {
    slug: "post-cardiac-surgery-priorities-nclex",
    title: "Post Cardiac Surgery Priorities (CABG / Valve)",
    meaning:
      "After **sternotomy**, priorities include **airway and gas exchange**, **hemorrhage/tamponade** surveillance, **arrhythmia** monitoring (**AFib** common), **pain control** that enables **deep breathing**, **glycemic** control per orders, **early progressive mobility** when safe, and **sternal precautions**. **Cardiac output** is inferred from **MAP, UO, lactate, mixed venous** themes, and **drains/chest tube** output when present.",
    exam:
      "NCLEX tests **mediastinal bleeding** (rising chest tube output, tamponade signs), **hypoxemia** after bypass, and **prioritizing** assessment over routine tasks when drains change abruptly.",
    core: `- **Mediastinal bleed**: **sudden** drainage change, **tachycardia**, **narrow pulse pressure** cues.\n- **AFib**: **rate control** and **anticoagulation** per orders.\n- **Sternal precautions**: **splinting** with cough, **no heavy pushing/pulling** early.\n- **Glycemic**: avoid **hyperglycemia** in cardiac surgery populations per protocol.`,
    scenario:
      "**Patient vignette.** CABG post-op hour 4: **chest tube output jumps** to **400 mL in 30 minutes** with **BP falling**.\n\n**Fork:** **Hemorrhage** — **notify surgeon**, **prepare blood** per protocol, **support perfusion** with ordered fluids/pressors, **repeat vitals** frequently.",
    takeaways:
      "- **Acute drain output change + hypotension** = **surgical emergency** pathway.\n- **Splinting** supports **gas exchange** and **sternal** protection.\n\n**Related:** [tamponade](LESSON:cardiac-tamponade-nclex-rn) · [AFib](LESSON:atrial-fibrillation-rate-control).",
  },
  {
    slug: "chronic-venous-insufficiency-nursing",
    title: "Chronic Venous Insufficiency",
    meaning:
      "**Chronic venous insufficiency (CVI)** reflects **valve incompetence** and **venous hypertension**, causing **edema**, **heaviness**, **varicosities**, **stasis dermatitis**, and **ulcer risk** at the **gaiter area**. Nursing emphasizes **compression therapy** when not contraindicated, **skin care**, **mobility**, **elevation**, and **differentiating** from **acute DVT**.",
    exam:
      "Boards test **compression contraindications** (ABI themes when arterial disease coexists) and **avoiding** injudicious **diuretics** when edema is venous rather than cardiogenic unless ordered for comorbid HF.",
    core: `- **Edema**: pitting, improves with **elevation**.\n- **Skin**: **hemosiderin staining**, **lipodermatosclerosis** descriptions.\n- **Ulcer location**: **medial malleolus** classic for venous.\n- **Education**: **daily walking**, **weight management**, **leg elevation**, **compression adherence**.\n- **DVT symptoms**: unilateral calf pain — **do not massage**; evaluate per protocol.`,
    scenario:
      "**Patient vignette.** A client with CVI has **bilateral ankle edema** but **new left calf redness** and **10/10 pain**.\n\n**Fork:** **Suspect DVT** until evaluated — **notify provider**, **avoid massage**, **compare calves**, **monitor** for PE symptoms.",
    takeaways:
      "- **New unilateral** pain changes the differential.\n- **Compression** requires **arterial adequacy** screening per protocol.\n\n**Related:** [arterial vs venous ulcers](LESSON:arterial-ulcers-vs-venous-ulcers) · [varicose veins](LESSON:varicose-veins-nursing-teaching).",
  },
  {
    slug: "arterial-ulcers-vs-venous-ulcers",
    title: "Arterial vs Venous Ulcers",
    meaning:
      "**Venous ulcers** usually occur **medially** above the **malleolus**, with **irregular borders**, **moderate exudate**, and surrounding **hemosiderin staining**. **Arterial ulcers** often sit on **toes/heels/shins**, are **punched-out**, **painful** especially when **elevated**, with **pale** bases and **diminished pulses**. Nursing priorities include **perfusion assessment**, **appropriate dressings**, **offloading**, and **referral** patterns.",
    exam:
      "NCLEX punishes **elevating legs** for pure arterial ischemic pain when the stem describes **critical limb ischemia** without clarifying mixed disease — follow **comfort positioning** per orders. It rewards **ABI** and **vascular consult** themes.",
    core: `- **Venous**: weeping, **brawny** skin, **improves** with compression when safe.\n- **Arterial**: **claudication** history, **hair loss**, **shiny skin**, **dependent rubor** themes.\n- **Mixed disease** is common — **individualize** care per orders.\n- **Wound photos** and **measurements** for trending.`,
    scenario:
      "**Patient vignette.** Ulcer on **lateral fifth toe**, **severe pain at rest**, **ABI 0.45**.\n\n**Fork:** **Arterial insufficiency** — **avoid harmful compression**, **notify provider/vascular**, **foot protection**, **pain control** per orders.",
    takeaways:
      "- **Location + pain + pulses** discriminate faster than size alone.\n- **ABI** guides **compression safety**.\n\n**Related:** [CVI](LESSON:chronic-venous-insufficiency-nursing) · [Raynaud](LESSON:raynaud-phenomenon-nursing-care).",
  },
  {
    slug: "raynaud-phenomenon-nursing-care",
    title: "Raynaud’s Phenomenon: Triggers and Self-Management",
    meaning:
      "**Raynaud phenomenon** causes **episodic digital vasospasm** with **tricolor** changes (white → blue → red) triggered by **cold** or **stress**. **Primary** Raynaud is more benign; **secondary** forms associate with **systemic sclerosis**, **lupus**, or **occupational vibration** and need **rheumatology** follow-up. Nursing focuses on **trigger avoidance**, **smoking cessation**, **skin integrity**, and **recognizing** digital ulcers as escalation signs.",
    exam:
      "Items test **patient teaching** (layered clothing, gradual rewarming) versus **medical mismanagement** (rapid extreme heat that could burn numb digits). Secondary disease stems may add **digital pitting scars** or **abnormal nailfold capillaroscopy** themes as context.",
    core: `- **Warm gradually**; avoid **burns**.\n- **CCBs** are common first-line pharmacologic themes for frequent attacks — per orders.\n- **Assess** for **tissue injury** and infection.\n- **Work modifications** for vibration exposure when applicable.`,
    scenario:
      "**Patient vignette.** A client with **new fingertip ulcers** after winter exposure on **background scleroderma** features in the stem.\n\n**Fork:** **Secondary disease escalation** — **notify provider**, **protect digits**, **document perfusion**, **rheumatology** follow-up themes.",
    takeaways:
      "- **Ulcerated digits** are not “just Raynaud” — investigate **secondary** causes.\n- **Smoking cessation** is foundational.\n\n**Related:** [arterial vs venous ulcers](LESSON:arterial-ulcers-vs-venous-ulcers) · [CVI](LESSON:chronic-venous-insufficiency-nursing).",
  },
  {
    slug: "varicose-veins-nursing-teaching",
    title: "Varicose Veins: Conservative Care and When to Escalate",
    meaning:
      "**Varicose veins** are **dilated superficial veins** from **valve failure** and **chronic venous hypertension**. Most care is **conservative**: **compression**, **exercise**, **elevation**, **weight management**, and **skin protection**. **Escalation** signs include **thrombophlebitis**, **bleeding** from ruptured varix, **rapidly worsening** pain, or **DVT** suspicion.",
    exam:
      "NCLEX tests **superficial thrombophlebitis** vs **DVT** symptom clusters and **patient education** for **long trips** (movement, hydration, compression when appropriate).",
    core: `- **Conservative**: **graduated compression stockings** when not contraindicated.\n- **Procedures**: ablation/stripping teaching includes **post-procedure walking** per orders.\n- **Bleeding**: **elevate leg + pressure** for superficial bleeding — still notify provider if significant.\n- **Skin**: moisturize to reduce **excoriation** risk.`,
    scenario:
      "**Patient vignette.** A client’s **varicosity** **bleeds** through a **thin skin tear** after scratching.\n\n**Fork:** **Apply pressure**, **elevate**, **assess** hemodynamic stability, **notify provider** if bleeding persists or client is anticoagulated.",
    takeaways:
      "- **Bleeding varicosities** can be dramatic — **pressure first**.\n- **Compression** is preventive and therapeutic when safe.\n\n**Related:** [CVI](LESSON:chronic-venous-insufficiency-nursing) · [DVT priorities](LESSON:dvt-pe-nursing-priorities).",
  },
  {
    slug: "antihypertensives-ace-arb-beta-ccb-nclex",
    title: "Antihypertensives: ACE Inhibitors, ARBs, Beta Blockers, and CCBs",
    meaning:
      "**ACE inhibitors** and **ARBs** block the **RAAS**; **beta blockers** reduce **HR/contractility**; **calcium channel blockers** split into **dihydropyridines** (mostly vascular) and **non-dihydropyridines** (AV nodal effects). NCLEX-RN stresses **contraindications** (pregnancy for ACE/ARB, asthma caution themes with non-selective beta blockers per stem), **hyperkalemia** with RAAS blockers, and **reflex tachycardia** with vasodilating CCBs.",
    exam:
      "Boards love **first-dose hypotension**, **cough/angioedema** with ACE, **avoiding combined ACE+ARB**, and **holding beta blockers** perioperatively per **explicit** order scenarios.",
    core: `- **ACE**: monitor **K⁺/Cr**, **cough**, **angioedema** risk.\n- **ARB**: similar labs; **pregnancy** contraindication.\n- **Beta blockers**: **bradycardia**, **masks hypoglycemia** in diabetes teaching.\n- **CCB**: **peripheral edema** with dihydropyridines; **heart block** risk with diltiazem/verapamil.\n- **Teaching**: **orthostatic precautions**, **do not stop abruptly** for BB without orders.`,
    scenario:
      "**Patient vignette.** After starting **lisinopril**, **K⁺ 5.8** with **wide QRS** and **weakness**.\n\n**Fork:** **Hyperkalemia emergency** pathway per orders — **notify provider**, **obtain repeat ECG**, **prepare** for ordered calcium/insulin/glucose/binder therapies, **stop RAAS** meds per order.",
    takeaways:
      "- **ACE/ARB + K⁺** trends are a safety pair.\n- **BB** stops require **provider guidance**.\n\n**Related:** [HF priorities](LESSON:heart-failure-nursing-priorities-hy) · [renal angles](LESSON:fluid-balance-acute-care).",
  },
  {
    slug: "antiarrhythmics-nursing-simplified",
    title: "Antiarrhythmics Simplified for NCLEX-RN",
    meaning:
      "NCLEX-RN focuses on **class effects and toxicities** more than Vaughan-Williams trivia: **amiodarone** (pulmonary/fthyroid/liver/QT), **procainamide** (lupus-like), **flecainide** (structural heart cautions in stems), and **adenosine** (brief asystole, bronchospasm caution). Nurses monitor **BP**, **rhythm**, **QT**, **lungs**, and **thyroid** symptoms on chronic amiodarone per orders.",
    exam:
      "Items test **adenosine administration** safety (rapid push, **double syringe** technique themes, **follow with flush**) and **torsades** prevention when QT stretches.",
    core: `- **Adenosine**: **short half-life**; cause brief **pause** — monitor on **telemetry**.\n- **Amiodarone**: **many organs** — scheduled labs/imaging per protocol.\n- **Digoxin** overlaps brady risk — watch combinations.\n- **Patient education**: report **wheeze**, **dizziness**, **syncope**.`,
    scenario:
      "**Patient vignette.** During **adenosine** for **SVT**, the rhythm **pauses** then **returns to NSR** but the client feels **severe bronchospasm**.\n\n**Fork:** **Stop** further doses, **support airway**, **notify provider**, prepare **alternative** therapy per ACLS/cardiology.",
    takeaways:
      "- **Asthma/COPD** may change drug choices in stems.\n- **Telemetry** is mandatory for **push** therapies.\n\n**Related:** [VT/VF](LESSON:ventricular-dysrhythmias-vt-vf-torsades) · [AFib](LESSON:atrial-fibrillation-rate-control).",
  },
  {
    slug: "anticoagulants-antiplatelets-nursing-nclex",
    title: "Anticoagulants and Antiplatelets: Nursing Monitoring",
    meaning:
      "**Anticoagulants** (heparin, LMWH, warfarin, DOACs) reduce **clot formation**; **antiplatelets** (aspirin, P2Y12 inhibitors) reduce **platelet aggregation**. NCLEX-RN emphasizes **bleeding precautions**, **lab monitoring** (aPTT/anti-Xa/INR as applicable), **reversal agent** themes in overdose/bleed vignettes, and **spinal/epidural** timing with anticoagulation.",
    exam:
      "Boards test **therapeutic vs toxic** heparin (bleeding, **thrombocytopenia**), **DOAC** adherence, and **never** double up **NSAIDs** on antiplatelet therapy without orders.",
    core: `- **Heparin**: **aPTT** or **anti-Xa** per protocol; **platelet** surveillance.\n- **Warfarin**: **INR**; **vitamin K** reversal themes.\n- **DOACs**: **renal dosing**; fewer routine labs.\n- **Education**: **head injury** urgency, **electric razor**, **fall precautions**.\n- **Procedures**: **hold windows** per anesthesia/anticoagulation policies — never guess.`,
    scenario:
      "**Patient vignette.** On **apixaban**, the client **hits their head** with **brief LOC**.\n\n**Fork:** **Emergency evaluation** — **notify provider**, **neuro checks**, **imaging** per protocol, **hold** further doses until cleared — not “sleep it off.”",
    takeaways:
      "- **Head trauma + anticoagulant** = **high stakes**.\n- **Bleeding + hypotension** activates **massive transfusion** themes per orders.\n\n**Related:** [DVT/PE](LESSON:dvt-pe-nursing-priorities) · [PCI](LESSON:pci-stents-complications-nursing-priorities).",
  },
  {
    slug: "digoxin-toxicity-nursing-safety",
    title: "Digoxin Toxicity and Nursing Safety",
    meaning:
      "**Digoxin** narrows the therapeutic window with **renal impairment**, **hypokalemia**, **hypomagnesemia**, **hypercalcemia**, and **amiodarone interactions**. Toxicity can present as **GI symptoms**, **visual changes** (yellow-green halos in classic teaching), **bradyarrhythmias**, and **ventricular ectopy**. Nurses monitor **apical pulse**, **electrolytes**, **renal function**, and **drug levels** per orders.",
    exam:
      "NCLEX tests **holding** digoxin for **critical bradycardia** or **high risk** until provider review, and **repleting potassium** carefully in **renal failure** contexts per orders.",
    core: `- **Hold parameters**: **HR** thresholds per facility/order.\n- **Toxicity labs**: **K⁺/Mg²⁺/Cr**; **drug level** when ordered.\n- **Antidote**: **Digoxin immune Fab** in severe toxicity per orders.\n- **Education**: **consistent timing**, **avoid OTC** potassium-wasting drugs unless approved.`,
    scenario:
      "**Patient vignette.** Digoxin patient has **N/V**, **HR 48**, and **bigeminy** on monitor with **K⁺ 2.9**.\n\n**Fork:** **Toxicity suspicion** — **notify provider**, **hold** next dose per order, **prepare** for labs/ECG/monitoring, **avoid** rapid unsupervised potassium replacement.",
    takeaways:
      "- **GI + rhythm + low K⁺** is a classic cluster.\n- **Apical pulse** before each dose when protocol requires.\n\n**Related:** [antiarrhythmics](LESSON:antiarrhythmics-nursing-simplified) · [HF](LESSON:heart-failure-nursing-priorities-hy).",
  },
  {
    slug: "cardiogenic-shock-assessment-interventions",
    title: "Cardiogenic Shock",
    meaning:
      "**Cardiogenic shock** is **inadequate CO** from **primary pump failure** (large MI, advanced HF, valvular catastrophe) leading to **hypoperfusion** despite adequate intravascular volume or with **congestion** patterns depending on the lesion. Nurses recognize **cool clammy skin**, **oliguria**, **altered mentation**, **lactate elevation**, **hypotension**, and **pulmonary edema** combinations and support **ordered inotropes/pressors**, **IABP/Impella** device themes, and **rapid cath/surgery** activation.",
    exam:
      "Boards separate **cardiogenic** shock (fluids often **harmful** unless specifically indicated) from **hypovolemic** shock. Trap answers give **large crystalloid boluses** to a client with **acute pulmonary edema** and **cold shock**.",
    core: `- **Warm vs cold** shock variants appear in advanced items — still anchor to **pump failure**.\n- **Pressors/inotropes**: **titrate** to ordered MAP with **continuous monitoring**.\n- **Devices**: **IABP** timing/trigger assessments per ICU protocol.\n- **Oxygen/ventilation** support as ordered.\n- **I&O** and **labs** trending.`,
    scenario:
      "**Patient vignette.** Post **STEMI**, **BP 72/50**, **crackles bilaterally**, **UOP 10 mL/hr**, **clammy skin**.\n\n**Fork:** **Cardiogenic shock** — **notify provider**, **high-acuity monitoring**, **prepare** for ordered pressors/inotropes and **urgent revascularization** themes — not **1 L NS bolus** by default.",
    takeaways:
      "- **Cold + wet + hypotension** points to **pump** failure patterns.\n- **Fluids** are not the default rescue.\n\n**Related:** [shock stages](LESSON:shock-stages-progression-nclex-rn) · [hemodynamics shock types](LESSON:hemodynamics-by-shock-type-nclex).",
  },
  {
    slug: "shock-stages-progression-nclex-rn",
    title: "Stages of Shock (Progressive Assessment)",
    meaning:
      "Classic teaching describes **initial**, **compensatory**, **progressive**, and **refractory** phases with evolving **HR**, **BP**, **respiratory rate**, **skin**, **ment**, and **renal output**. NCLEX-RN rewards **early recognition** when compensation still masks BP, and **interventions** that **restore perfusion** and **treat cause** rather than delaying for routine tasks.",
    exam:
      "Items use **subtle tachycardia** and **restlessness** before hypotension — choose **assessment + escalation** over reassurance.",
    core: `- **Initial**: **vasoconstriction**, **tachycardia**, **mild anxiety**.\n- **Compensatory**: **narrowed pulse pressure**, **tachypnea**, **cool extremities**.\n- **Progressive**: **hypotension**, **oliguria**, **confusion**.\n- **Refractory**: **multiorgan failure** despite therapy — maximal support.\n- **Nursing**: **frequent vitals**, **labs**, **oxygen**, **two large-bore IVs** when indicated, **notify** early.`,
    scenario:
      "**Patient vignette.** Post-op client **HR 118**, **RR 24**, **anxious**, **BP still “normal”** but **cap refill 3 seconds**.\n\n**Fork:** **Compensated shock** suspicion — **notify provider**, **increase monitoring**, **review** bleeding/infection, **avoid** sedating for anxiety alone without assessment.",
    takeaways:
      "- **Normal BP** does not rule out shock early.\n- **Trends** beat isolated values.\n\n**Related:** [shock recognition](LESSON:shock-recognition-fluids) · [cardiogenic shock](LESSON:cardiogenic-shock-assessment-interventions).",
  },
  {
    slug: "hemodynamics-by-shock-type-nclex",
    title: "Hemodynamic Changes in Shock Types",
    meaning:
      "Compare **distributive** (warm then cold in septic shock progression), **hypovolemic**, **cardiogenic**, and **obstructive** (PE, tamponade, tension pneumo) patterns. **CVP/PAWP** and **echo** themes appear as **provider-interpreted** data — the nurse focuses on **bedside surrogates**: **MAP**, **UOP**, **lactate**, **echoless tamponade** cues, and **ultrasound** call for help patterns.",
    exam:
      "NCLEX punishes **fluids** in **tamponade** or **tension pneumothorax** when the answer should be **procedure** (pericardiocentesis, needle decompression) per training themes.",
    core: `- **Septic early**: **warm shock**; late **cold**.\n- **Cardiogenic**: **high filling pressures** + **low output** patterns in stems.\n- **Obstructive**: **JVD** may be **prominent**; **pulsus paradoxus** in tamponade teaching.\n- **Hypovolemic**: **flat neck veins**, **responds** to fluids when hemorrhagic.\n- **Nursing**: **oxygen**, **monitoring**, **cause-specific** activation.`,
    scenario:
      "**Patient vignette.** **JVD**, **hypotension**, **muffled heart sounds** after **chest trauma**.\n\n**Fork:** **Tamponade** suspicion — **activate emergency team**, **prepare** for **pericardiocentesis** per protocol, **IV access**, **avoid** large fluid boluses as sole therapy.",
    takeaways:
      "- **Beck triad** cues scream **obstructive** cardiac.\n- **Fluids** do not fix **every** low BP.\n\n**Related:** [tamponade](LESSON:cardiac-tamponade-nclex-rn) · [PE](LESSON:ca-rn-pulmonary-embolism).",
  },
  {
    slug: "hyperlipidemia-atherosclerosis-nursing",
    title: "Hyperlipidemia and Atherosclerosis",
    meaning:
      "**Atherosclerosis** is **lipid-driven plaque** in arteries leading to **ACS** and **stroke** risk. Nurses teach **diet patterns** (Mediterranean-style framing), **activity**, **smoking cessation**, **adherence** to lipid-lowering therapy, and **baseline/ follow-up labs** per orders. **ASCVD risk** framing appears as **lifetime** prevention teaching.",
    exam:
      "Items focus on **modifiable risks** and **when to escalate** (symptoms despite therapy). Labs may include **LDL**, **ApoB** themes in advanced stems — follow numbers given.",
    core: `- **Plaque rupture** → **thrombosis** → **ACS**.\n- **Risk factors**: HTN, DM, smoking, CKD, family history.\n- **Education**: **label reading**, **hidden fats**, **portion control**.\n- **Screening**: **lipid panels** per primary care cadence in the stem.\n- **Referrals**: **cardiac rehab** after events when applicable.`,
    scenario:
      "**Patient vignette.** Stable client asks why **LDL** matters when they **“feel fine.”**\n\n**Fork:** **Teaching moment** — link **silent plaque** to **MI/stroke risk**, reinforce **lifestyle + meds** per plan, document **teach-back**.",
    takeaways:
      "- **Feeling fine ≠ safe vessels**.\n- **Combination** lifestyle + pharmacotherapy when ordered.\n\n**Related:** [statins](LESSON:statins-teaching-lab-safety) · [ACS](LESSON:acute-coronary-syndrome-nclex-rn).",
  },
  {
    slug: "statins-teaching-lab-safety",
    title: "Statins: Teaching Points and Safety Monitoring",
    meaning:
      "**HMG-CoA reductase inhibitors (statins)** lower **LDL** and stabilize plaque. Nurses teach **evening dosing** for some agents when relevant, **myalgia** reporting, **rhabdomyolysis** red flags (cola urine, severe weakness), and **hepatic enzyme** monitoring per protocol. **Drug interactions** (grapefruit with certain statins, macrolides, azole antifungals) appear as exam traps.",
    exam:
      "NCLEX tests **CK** when **severe muscle symptoms** occur and **holding** therapy per orders when **LFTs** rise significantly.",
    core: `- **Adherence**: long-term benefit requires **daily use** as prescribed.\n- **Muscle**: **mild ache** vs **incapacitating pain** + **dark urine**.\n- **Liver**: baseline and **symptom-driven** checks per policy.\n- **Pregnancy**: **contraindicated** in classic teaching.\n- **Patient questions**: use **non-judgmental** language for adherence barriers.`,
    scenario:
      "**Patient vignette.** On **atorvastatin**, reports **difficulty climbing stairs** with **tea-colored urine**.\n\n**Fork:** **Rhabdomyolysis suspicion** — **notify provider**, **hold** statin per order, **prepare** labs (CK, renal), **hydration** per orders.",
    takeaways:
      "- **Dark urine + muscle weakness** after new/interacting meds = **urgent**.\n- **Interactions** matter as much as dose.\n\n**Related:** [lipids/athero](LESSON:hyperlipidemia-atherosclerosis-nursing) · [anticoag overlap cautions](LESSON:anticoagulants-antiplatelets-nursing-nclex).",
  },
  {
    slug: "cardiovascular-risk-reduction-nursing",
    title: "Cardiovascular Risk Reduction for Nursing Practice",
    meaning:
      "**Primary prevention** reduces first events; **secondary prevention** prevents recurrence after MI/stroke. Nurses operationalize **ABCs**: **antiplatelet/anticoagulation** per indication, **BP control**, **cholesterol management**, **cigarette cessation**, **diet/activity**, **DM control**, and **psychosocial stress** screening. **Cardiac rehab** referral and **vaccination** themes may appear as holistic items.",
    exam:
      "Boards reward **prioritizing** unstable symptoms over prevention teaching, but when stable, **SMART goals** and **collaborative** plans win over lecturing.",
    core: `- **BP**: home logs, medication adherence.\n- **DM**: **HbA1c** targets per orders.\n- **Activity**: gradual progression post-event per rehab.\n- **Mental health**: **depression** after MI impacts adherence — screen when stem cues.\n- **Community**: **food security** and **access** affect plan feasibility — nurse advocates for resources.`,
    scenario:
      "**Patient vignette.** Post-MI client is **stable** but **never fills** metoprolol because of **cost**.\n\n**Fork:** **Barrier assessment** — **notify provider/pharmacy** for alternatives, **teach** assistance programs, **document** adherence plan — not blame.",
    takeaways:
      "- **Non-adherence** often has **fixable** causes.\n- **Rehab referral** saves lives when available.\n\n**Related:** [HF](LESSON:heart-failure-nursing-priorities-hy) · [PCI teaching](LESSON:pci-stents-complications-nursing-priorities).",
  },
  {
    slug: "aortic-dissection-priorities-nclex-rn",
    title: "Aortic Dissection: Recognition and Priorities",
    meaning:
      "**Aortic dissection** is a **tear** in the intima creating a **false lumen** with **sudden tearing chest pain** radiating to the **back**, **BP differential** between arms in some types, and **pulse deficits**. Nursing activates **emergency pathways**, **controls BP/pain** per orders (often **beta blockade first** to reduce **dP/dt**), and **prepares** for **imaging** and **surgery**.",
    exam:
      "NCLEX punishes **thrombolytics** when **dissection** is suspected with **tearing pain** and **BP differential**. It rewards **two large-bore IVs**, **type-specific BP targets**, and **immediate provider communication**.",
    core: `- **Pain**: **sudden**, **severe**, **ripping** language.\n- **VS**: **arm-to-arm BP** differences, **migrating** pain.\n- **Med themes**: **IV beta blocker** before vasodilation in classic teaching — follow stem.\n- **Avoid**: **anticoagulation** until dissection excluded when ACS unclear.\n- **Post-op**: **stroke** surveillance with **arch** repairs in advanced items.`,
    scenario:
      "**Patient vignette.** **Sudden interscapular pain**, **right BP 190/100**, **left BP 120/70**, **HR 104**.\n\n**Fork:** **Dissection** until proven otherwise — **emergency activation**, **large-bore access**, **notify provider**, **avoid** thrombolysis if stem suggests dissection over STEMI.",
    takeaways:
      "- **BP differential + tearing pain** is a **red flag** cluster.\n- **Speed** matters more than perfect paperwork.\n\n**Related:** [hypertensive crisis](LESSON:hypertensive-crisis-vs-urgency) · [ACS](LESSON:acute-coronary-syndrome-nclex-rn).",
  },
  {
    slug: "pericarditis-vs-tamponade-prioritization",
    title: "Pericarditis vs Cardiac Tamponade",
    meaning:
      "**Pericarditis** inflames the pericardium with **pleuritic positional pain** and often **diffuse ST elevation** with **PR depression**. **Tamponade** is **fluid under pressure** impairing **ventricular filling**, producing **hypotension**, **JVD**, **muffled heart sounds**, and **pulsus paradoxus** themes. Nurses trend **vitals**, **ECG**, and **echo** orders while watching for **transition** from pericarditis to **effusion/tamponade**.",
    exam:
      "NCLEX tests **when NSAIDs are appropriate** versus **when pericardiocentesis** is the priority. **Hypotension + rising JVD** shifts answers away from “more ibuprofen.”",
    core: `- **Pericarditis**: **pain improves leaning forward**; **friction rub** may wax/wane.\n- **Tamponade**: **Beck triad** cues; **tachycardia** out of proportion.\n- **Nursing**: **serial vitals**, **prepare** for **pericardiocentesis** tray per ICU policy, **IV access**.\n- **Anticoagulation** caution when **large effusion** in stems — follow orders.`,
    scenario:
      "**Patient vignette.** Known **pericarditis** now **hypotensive**, **JVD to earlobe**, **HR 130**.\n\n**Fork:** **Tamponade physiology** — **emergency team**, **echo**, **pericardiocentesis** per orders — not discharge teaching.",
    takeaways:
      "- **Pericarditis can evolve** — reassess frequently.\n- **Hypotension + distended neck veins** = **obstructive** emergency until cleared.\n\n**Related:** [pericarditis ECG](LESSON:pericarditis-ecg-clues) · [tamponade](LESSON:cardiac-tamponade-nclex-rn).",
  },
  {
    slug: "chest-pain-first-nursing-action-nclex",
    title: "Chest Pain: What Do You Do First?",
    meaning:
      "This lesson trains **NGN-style sequencing**: **assess airway and breathing effort**, **obtain vitals and SpO₂**, **apply oxygen when hypoxemic per orders**, **obtain/verify a 12-lead ECG when ordered**, **establish IV access**, and **notify the provider** with **concise data** — before **routine meds**, **meals**, or **ambulation**. The goal is to **rule in life threats** (ACS, PE, dissection, pneumothorax) while **preventing harm**.",
    exam:
      "Traps include **ambulating** for “comfort,” **giving nitroglycerin** without **BP context**, or **teaching** before **stabilizing** unstable vitals.",
    core: `- **First**: **assess** + **monitor** + **communicate**.\n- **Hypoxia** → **oxygen** per protocol.\n- **ACS suspicion** → **aspirin** only when **not contraindicated** per orders and scope.\n- **Females and diabetes** may have **atypical** pain — still pursue risk.\n- **Document** times for **door-to-ECG** style quality themes when shown.`,
    scenario:
      "**Patient vignette.** Client reports **new chest pressure** with **SpO₂ 88%** on room air.\n\n**Fork:** **Oxygen + assessment + monitoring + notify provider + prepare ECG** — not “finish breakfast tray.”",
    takeaways:
      "- **Airway–breathing–circulation** logic still wins on boards.\n- **Objective data first**, then targeted interventions.\n\n**Related:** [ACS](LESSON:acute-coronary-syndrome-nclex-rn) · [dissection](LESSON:aortic-dissection-priorities-nclex-rn).",
  },
  {
    slug: "post-pci-complications-who-first-nclex",
    title: "Post PCI Complications: Who Do You See First?",
    meaning:
      "After **PCI**, prioritize clients by **instability**: **reperfusion arrhythmias**, **access site bleeding with hypotension**, **acute stent thrombosis** (recurrent ischemic pain + ST changes), and **contrast reactions** outrank **routine pain** or **scheduled vitals** on stable neighbors. Nurses use **objective triggers** (BP, rhythm, site, UO) to **sequence** assessments in **multi-patient** stems.",
    exam:
      "NGN **matrix** items reward **one unstable client** among three stable ones — choose **bleeding with dropping BP** or **recurrent ST elevation** over **mild groin soreness**.",
    core: `- **Bleeding + hypotension** → **vascular emergency** pathway.\n- **Recurrent chest pain + ST changes** → **repeat activation**.\n- **Contrast allergy** → **airway** first.\n- **Stable scheduled meds** can wait with **charge nurse** communication when reprioritizing.\n- **Delegate** only tasks safe for **UAP** — not unstable assessments.`,
    scenario:
      "**Patient vignette.** You have **three clients**: (A) **groin oozing** with **BP 88/50**, (B) **5/10 groin pain** stable BP, (C) **routine metoprolol** due.\n\n**Fork:** **See Client A first** — **hypotension + bleeding** risk.",
    takeaways:
      "- **Hemodynamic threat** beats **routine** tasks.\n- **Communicate** when you **reprioritize** the team workload.\n\n**Related:** [PCI lesson](LESSON:pci-stents-complications-nursing-priorities) · [unstable patient recognition](LESSON:unstable-cardiac-patient-recognition-ngn).",
  },
  {
    slug: "unstable-cardiac-patient-recognition-ngn",
    title: "Which Cardiac Patient Is Unstable? (NGN Judgment)",
    meaning:
      "Stability is defined by **perfusion + work of breathing + rhythm risk + trend**, not a single “normal” number. **Red flags** include **new confusion**, **rising lactate**, **narrow pulse pressure**, **cold clammy skin**, **crackles with hypoxia**, **recurrent ventricular ectopy**, **ST changes**, and **access site hemorrhage**. This lesson builds a **checklist** you can apply in **matrix drag-and-drop** and **bow-tie** style items.",
    exam:
      "Examiners hide instability behind **polite patients** or **normal SpO₂ on minimal exertion** while **work of breathing** is rising. Another trap is **choosing education** for the client who is **mentating off** with **new arrhythmia**.",
    core: `- **ABC + mentation + urine + skin** every time.\n- **Compare** to **baseline** when provided.\n- **If two answers seem cardiac**, pick the one that **secures monitoring** and **closes the highest-risk gap**.\n- **Delegate** stable tasks; **retain** unstable assessments.\n- **Escalate** with **SBAR** when thresholds crossed.`,
    scenario:
      "**Patient vignette.** Four clients: **AFib RVR with BP 82/50**, **stable post-cath**, **HF with 1 kg gain**, **chest pain resolved after nitro**.\n\n**Fork:** **AFib RVR with hypotension** is **most unstable** — **assess + notify + prepare cardioversion** per orders/policy.",
    takeaways:
      "- **Hypotension + tachyarrhythmia** usually beats **stable resolved pain**.\n- **Trend** mild HF weight when no acute distress.\n\n**Related:** [AFib](LESSON:atrial-fibrillation-rate-control) · [chest pain first actions](LESSON:chest-pain-first-nursing-action-nclex).",
  },
];

function quizPair(topic) {
  return {
    preTest: [
      {
        question: `Which principle best fits NCLEX-RN prioritization for ${topic}?`,
        options: [
          "Complete routine documentation before notifying the provider when vitals cross critical thresholds",
          "Assess objective perfusion and oxygenation trends, notify the provider when indicated, and prevent harm before routine tasks",
          "Delegate all unstable assessments to the nursing assistant to save time",
          "Encourage ambulation first to rule out anxiety-related symptoms",
        ],
        correct: 1,
        rationale:
          "NCLEX-RN rewards assessment of unstable findings, timely communication, and safety sequencing over documentation, delegation of RN-level judgment, or routine tasks when risk is rising.",
      },
      {
        question: `A client shows subtle deterioration related to ${topic}. What is the safest immediate focus?`,
        options: [
          "Deep discharge teaching about medications",
          "Focused reassessment of airway, breathing, circulation, and mentation with prepared escalation",
          "Asking the family to leave so the client can rest",
          "Holding all medications until the physician rounds in the morning",
        ],
        correct: 1,
        rationale:
          "When deterioration is possible, nurses prioritize focused reassessment and prepared escalation per orders and policy—not delayed teaching, family removal as a primary intervention, or blanket medication holds without orders.",
      },
    ],
    postTest: [
      {
        question: `Which finding should prompt the fastest escalation when linked to ${topic}?`,
        options: [
          "A single benign transient beep on a pulse oximeter with immediate recovery",
          "Hypotension with altered mentation or ischemic chest pain alongside new rhythm or ST changes",
          "A patient requesting an extra pillow for comfort",
          "A stable chronic edema without new respiratory symptoms",
        ],
        correct: 1,
        rationale:
          "Hypotension with altered mentation or ischemic symptoms plus new rhythm or ST changes signals imminent harm and requires urgent assessment, monitoring, and provider activation per protocol.",
      },
      {
        question: `Teaching for ${topic} is appropriate when which condition is met?`,
        options: [
          "When the client is hypoxic, confused, and hypotensive",
          "After stabilization when the client is alert, understands, and perfusion is adequate",
          "Only at discharge regardless of stability",
          "Before any assessment to save time",
        ],
        correct: 1,
        rationale:
          "Education is prioritized after life threats are stabilized and the patient can participate safely—never before addressing airway, breathing, circulation, and urgent ischemia or shock patterns.",
      },
    ],
  };
}

function buildLesson(d) {
  const q = quizPair(d.title);
  return {
    slug: d.slug,
    title: d.title,
    topic: "Cardiovascular",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: `${d.title} | NCLEX-RN | NurseNest`,
    seoDescription: `NCLEX-RN cardiovascular review: ${d.title} — nursing assessment, hemodynamic and rhythm safety, prioritization, Canadian- and US-friendly units, and clinical judgment drills.`,
    relatedLessonRefs: [
      { slug: "heart-failure-nursing-priorities-hy", titleHint: "Heart failure priorities" },
      { slug: "acute-coronary-syndrome-nclex-rn", titleHint: "Acute coronary syndrome" },
    ],
    sections: [
      { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: d.meaning },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: d.exam },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: d.core },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: d.scenario },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: d.takeaways },
    ],
    ...q,
  };
}

const lessons = DEFS.map(buildLesson);
const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-rn-cardio-expansion-catalog.mjs",
  pathways: {
    "ca-rn-nclex-rn": lessons,
    "us-rn-nclex-rn": JSON.parse(JSON.stringify(lessons)),
  },
};

writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log("Wrote", outPath, "lessons:", lessons.length);
