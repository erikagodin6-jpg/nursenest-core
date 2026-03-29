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
  "neurogenic-bladder-rpn": {
    title: "Neurogenic Bladder for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neurogenic Bladder Dysfunction",
      content: "Neurogenic bladder refers to bladder dysfunction caused by neurological damage that disrupts the normal coordination between the detrusor muscle, the internal urethral sphincter, and the external urethral sphincter. Normal micturition requires intact neural pathways involving the pontine micturition center in the brainstem, the sacral micturition center at spinal cord levels S2 through S4, and both the sympathetic (T10-L2) and parasympathetic (S2-S4) nervous systems. The detrusor muscle is innervated primarily by parasympathetic fibers from the pelvic nerve; when these fibers are stimulated, the detrusor contracts and the internal sphincter relaxes, allowing urine to flow. The sympathetic nervous system promotes bladder filling by relaxing the detrusor and contracting the internal sphincter through the hypogastric nerve. The external urethral sphincter is under voluntary (somatic) control via the pudendal nerve. Upper motor neuron (UMN) lesions occur above the sacral micturition center, typically from spinal cord injuries at the cervical or thoracic level, multiple sclerosis, stroke, or brain tumors. UMN lesions produce a spastic (hyperreflexic) bladder with involuntary detrusor contractions, small bladder capacity, urinary frequency, urgency, and incontinence. The bladder contracts reflexively but without voluntary control, and detrusor-sphincter dyssynergia (simultaneous contraction of the detrusor and external sphincter) can develop, causing high intravesical pressures that damage the upper urinary tract. Lower motor neuron (LMN) lesions occur at or below the sacral micturition center and are caused by conditions such as cauda equina syndrome, diabetic neuropathy, pelvic surgery, or sacral spinal cord injury. LMN lesions produce a flaccid (areflexic) bladder that cannot contract effectively, resulting in urinary retention, overflow incontinence, and large post-void residual volumes. The bladder becomes distended and loses its ability to generate the contractile force needed for complete emptying. Both types of neurogenic bladder carry significant risks including recurrent urinary tract infections from urinary stasis, vesicoureteral reflux from elevated bladder pressures, hydronephrosis from chronic reflux, autonomic dysreflexia in patients with spinal cord injuries at T6 or above, and progressive renal damage if left untreated. The practical nurse plays a critical role in monitoring bladder function, performing or assisting with intermittent catheterization, recognizing signs of urinary tract infection, and reporting changes in voiding patterns to the supervising nurse or physician."
    },
    riskFactors: [
      "Spinal cord injury (most common cause; level determines UMN vs LMN pattern)",
      "Multiple sclerosis (demyelination disrupts neural pathways controlling micturition)",
      "Diabetes mellitus (peripheral neuropathy damages sacral autonomic nerves over time)",
      "Stroke or traumatic brain injury (disrupts voluntary control of micturition from cortical centers)",
      "Pelvic surgery or radiation therapy (direct nerve damage to pelvic plexus)",
      "Spina bifida or myelomeningocele (congenital defect affecting sacral spinal cord development)",
      "Parkinson disease (progressive loss of dopaminergic neurons affects bladder coordination)"
    ],
    diagnostics: [
      "Post-void residual (PVR) measurement via bladder scanner or straight catheterization: PVR greater than 100 mL suggests incomplete emptying; greater than 200 mL indicates significant retention",
      "Urinalysis and urine culture: assess for urinary tract infection which is extremely common in neurogenic bladder; look for pyuria, bacteriuria, nitrites, and leukocyte esterase",
      "Urodynamic studies (cystometrogram): measures bladder pressure during filling and voiding; distinguishes UMN (hyperreflexic) from LMN (areflexic) patterns; performed by urology",
      "Renal ultrasound: evaluates for hydronephrosis, kidney stones, and upper tract changes from chronic elevated bladder pressures",
      "Serum creatinine and BUN: monitors renal function; rising creatinine may indicate obstructive uropathy or renal damage from chronic reflux",
      "Voiding diary: documents frequency, volume, incontinence episodes, and fluid intake over 24-72 hours to establish baseline patterns"
    ],
    management: [
      "Clean intermittent catheterization (CIC) every 4-6 hours as prescribed: gold standard for managing urinary retention in neurogenic bladder; maintain volumes below 400-500 mL per catheterization",
      "Timed voiding schedule: establish a regular voiding routine (every 2-4 hours) to prevent overdistension and reduce incontinence episodes",
      "Fluid management: encourage adequate hydration (1500-2000 mL/day unless restricted) distributed evenly throughout the day; reduce fluid intake 2 hours before bedtime",
      "Crede maneuver (manual suprapubic pressure) or Valsalva maneuver may be used for LMN bladder to assist emptying, but only if approved by physician -- contraindicated in vesicoureteral reflux",
      "Indwelling catheter management when CIC is not feasible: use smallest effective catheter size, maintain closed drainage system, secure catheter to prevent traction",
      "Skin care and incontinence management: apply moisture barrier cream, use absorbent products, perform perineal care after each incontinence episode to prevent skin breakdown",
      "Monitor for autonomic dysreflexia in patients with spinal cord injury at T6 or above: sudden hypertension, pounding headache, flushing, and bradycardia triggered by bladder distension"
    ],
    nursingActions: [
      "Perform or assist with clean intermittent catheterization using sterile or clean technique per facility protocol; document catheterization time, amount obtained, and urine characteristics",
      "Monitor intake and output accurately; report urine output less than 30 mL/hour or inability to void within 6-8 hours post-procedure",
      "Assess for signs and symptoms of urinary tract infection: cloudy or foul-smelling urine, fever, increased spasticity, autonomic dysreflexia, or worsening incontinence",
      "Palpate the suprapubic area for bladder distension before and after voiding or catheterization; use a bladder scanner when available",
      "Educate patient and family on self-catheterization technique, catheter care, signs of infection, and when to seek medical attention",
      "Position patient appropriately during catheterization: female patients in dorsal recumbent position, male patients supine with legs slightly apart",
      "Report any signs of autonomic dysreflexia immediately: sit patient upright, check for bladder distension as the most common trigger, and notify the physician"
    ],
    assessmentFindings: [
      "UMN bladder (spastic): small-volume involuntary voiding, urinary urgency, frequency, and reflex incontinence without sensation of fullness",
      "LMN bladder (flaccid): urinary retention, overflow incontinence (continuous dribbling), absent or diminished urge to void, palpable distended bladder",
      "Elevated post-void residual volume greater than 100 mL indicating incomplete bladder emptying",
      "Recurrent urinary tract infections: cloudy urine, foul odor, suprapubic discomfort, fever, increased muscle spasticity in spinal cord injury patients",
      "Signs of autonomic dysreflexia (SCI at T6 or above): sudden severe hypertension (systolic above 200 mmHg), pounding headache, flushing and diaphoresis above the level of injury, bradycardia",
      "Skin breakdown in the perineal area from chronic moisture exposure and incontinence",
      "Hydronephrosis on imaging: flank pain, elevated creatinine, indicating chronic upper tract damage from high bladder pressures"
    ],
    signs: {
      left: [
        "Increased urinary frequency or urgency",
        "Difficulty initiating urination or weak stream",
        "Sensation of incomplete bladder emptying",
        "Mild suprapubic discomfort or fullness",
        "Small-volume incontinence episodes",
        "Changes in urine color or mild cloudiness"
      ],
      right: [
        "Autonomic dysreflexia (severe hypertension, headache, bradycardia, flushing above injury level)",
        "Complete urinary retention with palpable distended bladder",
        "Fever with rigors indicating urosepsis",
        "Gross hematuria or blood clots in urine",
        "Flank pain with elevated creatinine (hydronephrosis)",
        "Altered mental status from sepsis secondary to urinary tract infection"
      ]
    },
    medications: [
      {
        name: "Oxybutynin (Ditropan)",
        type: "Anticholinergic / antispasmodic",
        action: "Blocks muscarinic (M3) receptors on the detrusor muscle, reducing involuntary bladder contractions and increasing bladder capacity; decreases urgency and frequency in UMN (spastic) neurogenic bladder",
        sideEffects: "Dry mouth (most common), constipation, blurred vision, urinary retention, drowsiness, heat intolerance, cognitive impairment (especially in elderly)",
        contra: "Uncontrolled narrow-angle glaucoma; urinary retention (in LMN/flaccid bladder); gastric retention; myasthenia gravis",
        pearl: "Extended-release formulations cause fewer anticholinergic side effects than immediate-release; encourage sugar-free gum for dry mouth; monitor elderly patients for confusion and falls"
      },
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1 adrenergic blocker (selective)",
        action: "Selectively blocks alpha-1A adrenergic receptors in the bladder neck and prostatic urethra, relaxing smooth muscle to decrease urethral resistance and improve urine flow; used in neurogenic bladder to reduce outlet obstruction",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, nasal congestion, headache, asthenia",
        contra: "Concurrent use with strong CYP3A4 inhibitors; history of orthostatic syncope; planned cataract surgery (intraoperative floppy iris syndrome)",
        pearl: "Take 30 minutes after the same meal each day for consistent absorption; instruct patient to rise slowly from sitting or lying position; inform ophthalmologist before any eye surgery"
      },
      {
        name: "Bethanechol (Urecholine)",
        type: "Cholinergic agonist (parasympathomimetic)",
        action: "Directly stimulates muscarinic (M3) receptors on the detrusor muscle, increasing bladder contractility and promoting bladder emptying; used in LMN (flaccid) neurogenic bladder with urinary retention",
        sideEffects: "Abdominal cramping, diarrhea, salivation, flushing, bradycardia, bronchospasm, sweating, hypotension",
        contra: "Bladder outlet obstruction (risk of bladder rupture); asthma or COPD (bronchospasm risk); hyperthyroidism; peptic ulcer disease; coronary artery disease",
        pearl: "Administer on an empty stomach to reduce nausea and vomiting; never give IM or IV (severe cholinergic crisis); keep atropine available as the antidote for cholinergic toxicity; monitor heart rate"
      }
    ],
    pearls: [
      "Clean intermittent catheterization (CIC) is the gold standard for neurogenic bladder management -- it preserves kidney function, reduces UTI risk compared to indwelling catheters, and promotes patient independence",
      "UMN (spastic) bladder = SMALL capacity, INVOLUNTARY contractions, treat with anticholinergics (oxybutynin); LMN (flaccid) bladder = LARGE capacity, NO contractions, treat with cholinergic agonists (bethanechol) or CIC",
      "Autonomic dysreflexia is a life-threatening emergency in patients with SCI at T6 or above -- bladder distension is the most common trigger; first intervention is to sit the patient upright and check for a full bladder",
      "Post-void residual greater than 100 mL is abnormal; greater than 200 mL requires intervention -- always measure PVR before and after initiating bladder management programs",
      "Cranberry products may help reduce UTI recurrence in neurogenic bladder patients by preventing bacterial adhesion to the bladder wall, but they are NOT a substitute for proper catheterization technique",
      "Never force a catheter during intermittent catheterization -- resistance may indicate urethral stricture, false passage, or sphincter spasm; apply gentle steady pressure, try a smaller catheter, or notify the physician",
      "Teach patients performing self-catheterization to wash hands thoroughly, use clean technique, catheterize at regular intervals (every 4-6 hours), and keep individual catheterization volumes below 400-500 mL"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with a T4 spinal cord injury who suddenly develops a severe headache, blood pressure of 220/110 mmHg, and flushing above the nipple line. What should the nurse do FIRST?",
        options: [
          "Administer a prescribed antihypertensive medication",
          "Place the patient flat and elevate the legs",
          "Sit the patient upright and check for bladder distension",
          "Apply a cold compress to the forehead and reassess in 15 minutes"
        ],
        correct: 2,
        rationale: "This presentation is classic autonomic dysreflexia. The first intervention is to sit the patient upright (to promote orthostatic blood pressure reduction) and check for the most common trigger -- bladder distension. If the bladder is full, catheterize immediately. Placing the patient flat would worsen hypertension. Medications may be needed but are not the first action."
      },
      {
        question: "A patient with multiple sclerosis has a spastic (UMN) neurogenic bladder. Which medication would the practical nurse expect to be prescribed to manage this condition?",
        options: [
          "Bethanechol (Urecholine)",
          "Oxybutynin (Ditropan)",
          "Tamsulosin (Flomax)",
          "Furosemide (Lasix)"
        ],
        correct: 1,
        rationale: "Oxybutynin is an anticholinergic that reduces involuntary detrusor contractions in a spastic (UMN) bladder, increasing bladder capacity and reducing urgency and frequency. Bethanechol is a cholinergic agonist used for flaccid (LMN) bladder. Tamsulosin relaxes the bladder outlet. Furosemide is a diuretic and would worsen symptoms."
      },
      {
        question: "The practical nurse obtains a post-void residual of 350 mL using a bladder scanner on a patient with a flaccid neurogenic bladder. Which action should the nurse take?",
        options: [
          "Document the finding as within normal limits",
          "Encourage the patient to void again in 30 minutes",
          "Report the finding and prepare for intermittent catheterization as ordered",
          "Restrict fluid intake to reduce urine production"
        ],
        correct: 2,
        rationale: "A post-void residual of 350 mL is significantly elevated (normal is less than 100 mL) and indicates incomplete bladder emptying. In a flaccid neurogenic bladder, intermittent catheterization is the appropriate intervention. This finding should be reported and catheterization performed as ordered. Restricting fluids does not address the retention problem and risks dehydration."
      }
    ]
  },

  "neurogenic-shock-basics-rpn": {
    title: "Neurogenic Shock Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neurogenic Shock",
      content: "Neurogenic shock is a distributive form of shock that results from the sudden loss of sympathetic nervous system tone following injury to the spinal cord, typically at the cervical or upper thoracic level (above T6). Under normal physiological conditions, the sympathetic nervous system maintains vascular tone by releasing norepinephrine from postganglionic sympathetic nerve fibers, which acts on alpha-1 adrenergic receptors on vascular smooth muscle to cause vasoconstriction. This tonic vasoconstriction is essential for maintaining systemic vascular resistance (SVR) and blood pressure. The sympathetic nervous system also innervates the heart through cardiac accelerator fibers originating from T1 through T4, which increase heart rate and contractility through beta-1 adrenergic receptor stimulation. When a spinal cord injury disrupts these sympathetic pathways, unopposed parasympathetic (vagal) activity dominates. The parasympathetic nervous system, carried by the vagus nerve (cranial nerve X), slows the heart rate and has no direct effect on peripheral vascular tone. The result is a triad of findings that distinguishes neurogenic shock from other forms of shock: hypotension (from massive vasodilation and loss of SVR), bradycardia (from unopposed vagal tone on the heart, unlike hypovolemic or cardiogenic shock which cause tachycardia), and peripheral vasodilation with warm, dry, flushed skin below the level of injury. This presentation is sometimes called warm shock because the skin remains warm and well-perfused initially, in contrast to the cold, clammy skin seen in hypovolemic shock. The cardiovascular collapse in neurogenic shock occurs because the heart cannot compensate for the profound decrease in SVR. Cardiac output may initially be maintained, but as venous return decreases due to venous pooling in the dilated peripheral vasculature, preload drops and cardiac output falls. Poikilothermia (inability to regulate body temperature) develops because the loss of sympathetic control prevents thermoregulatory vasoconstriction and shivering below the level of injury. The patient becomes essentially dependent on ambient temperature, making hypothermia a significant risk. It is critical to distinguish neurogenic shock from spinal shock, which is a separate phenomenon. Spinal shock refers to the temporary loss of all spinal cord function (motor, sensory, and reflex) below the level of injury, including loss of deep tendon reflexes and flaccid paralysis. Spinal shock may last days to weeks and does not necessarily involve hemodynamic instability. Neurogenic shock is the cardiovascular emergency that requires immediate hemodynamic support. The practical nurse must monitor for and promptly report the classic signs of neurogenic shock, assist with fluid resuscitation and vasopressor administration, prevent complications of immobility, and maintain normothermia."
    },
    riskFactors: [
      "Cervical spinal cord injury (highest risk due to loss of all thoracolumbar sympathetic outflow)",
      "Upper thoracic spinal cord injury above T6 (disrupts cardiac accelerator fibers and significant vascular sympathetic innervation)",
      "High-velocity trauma such as motor vehicle accidents, falls from height, or diving injuries",
      "Penetrating spinal cord injuries (gunshot wounds, stab wounds to the cervical or thoracic spine)",
      "Epidural or spinal anesthesia complications (rare; high spinal block causing sympathetic blockade)",
      "Pre-existing cardiovascular disease (reduced cardiac reserve limits compensatory ability)",
      "Advanced age (decreased baroreceptor sensitivity and reduced cardiovascular reserve)"
    ],
    diagnostics: [
      "Continuous hemodynamic monitoring: blood pressure (MAP target greater than 85-90 mmHg for first 7 days post-SCI), heart rate, central venous pressure (CVP) if central line placed",
      "Arterial blood gas (ABG): assess oxygenation and ventilation; high cervical injuries (C3-C5) may impair diaphragm function requiring mechanical ventilation",
      "Complete blood count and type and crossmatch: rule out concurrent hemorrhagic shock which commonly coexists with traumatic spinal cord injury",
      "CT and MRI of the spine: identify level and extent of spinal cord injury; CT for bony injury, MRI for cord compression, edema, and hemorrhage",
      "12-lead ECG: assess for bradycardia, conduction abnormalities, or cardiac arrest risk from unopposed vagal activity",
      "Serum lactate: elevated lactate indicates tissue hypoperfusion despite warm skin appearance; helps assess severity of shock"
    ],
    management: [
      "Aggressive IV fluid resuscitation with isotonic crystalloids (normal saline or lactated Ringer) as first-line treatment; restore intravascular volume to improve venous return and cardiac output",
      "Vasopressor therapy when fluids alone are insufficient: norepinephrine is first-line to restore vascular tone (alpha-1 effect) and support heart rate (beta-1 effect)",
      "Atropine administration for symptomatic bradycardia (heart rate below 50 bpm with hemodynamic compromise); blocks parasympathetic activity at the SA and AV nodes",
      "Maintain mean arterial pressure (MAP) at 85-90 mmHg for the first 7 days post-injury to optimize spinal cord perfusion and minimize secondary injury",
      "Spinal immobilization and alignment: maintain cervical spine precautions with rigid collar, logroll technique for positioning, and spinal board until cleared",
      "Temperature management: apply warming blankets, warm IV fluids, maintain ambient room temperature; monitor core temperature continuously to prevent hypothermia",
      "Venous thromboembolism (VTE) prophylaxis: sequential compression devices immediately; pharmacological prophylaxis (low-molecular-weight heparin) when bleeding risk is acceptable"
    ],
    nursingActions: [
      "Monitor vital signs continuously or every 15 minutes during acute phase; report hypotension (MAP below 85 mmHg), bradycardia (HR below 50), or temperature below 36 degrees Celsius",
      "Administer IV fluids and vasopressors via infusion pump as prescribed; titrate vasopressors according to MAP targets and report inability to maintain target pressures",
      "Maintain strict spinal precautions: logroll with 3-person minimum, maintain neutral spinal alignment, apply rigid cervical collar, keep backboard in place until physician clears removal",
      "Assess respiratory function every 1-2 hours: monitor respiratory rate, depth, oxygen saturation, ability to cough; injuries at C3-C5 affect phrenic nerve and diaphragm function",
      "Perform skin assessment every 2 hours and reposition using logroll technique: patients with SCI have no sensation below the injury level and are at extreme risk for pressure injuries",
      "Monitor urine output hourly via indwelling catheter: report output less than 30 mL/hour; oliguria may indicate inadequate tissue perfusion despite warm skin",
      "Assess and document neurological status using ASIA (American Spinal Injury Association) examination: motor, sensory, and reflex function at each spinal level"
    ],
    assessmentFindings: [
      "Hypotension with bradycardia: the hallmark combination that distinguishes neurogenic shock from hypovolemic shock (which causes tachycardia)",
      "Warm, dry, flushed skin below the level of injury: due to loss of sympathetic vasoconstriction; skin above the injury level may be cool and pale",
      "Poikilothermia: body temperature fluctuates with ambient temperature; hypothermia is common because shivering and vasoconstriction cannot occur below the injury",
      "Flaccid paralysis and loss of sensation below the level of spinal cord injury (concurrent spinal shock)",
      "Loss of deep tendon reflexes below the injury level during the spinal shock phase",
      "Priapism (sustained penile erection): occurs due to unopposed parasympathetic vasodilation; seen in male patients with cervical or upper thoracic SCI",
      "Respiratory compromise in high cervical injuries (C3-C5): shallow breathing, use of accessory muscles, inability to cough effectively, declining SpO2"
    ],
    signs: {
      left: [
        "Mild hypotension (systolic 90-100 mmHg) responsive to fluid bolus",
        "Heart rate 50-60 bpm without hemodynamic compromise",
        "Warm, flushed skin below the level of injury",
        "Mild temperature decrease (36.0-36.5 degrees Celsius)",
        "Decreased urine output (borderline 30-40 mL/hour)",
        "Mild lightheadedness when repositioned"
      ],
      right: [
        "Severe hypotension (systolic below 80 mmHg) unresponsive to fluids alone",
        "Bradycardia below 40 bpm or cardiac arrest",
        "Complete respiratory failure requiring emergency intubation (C3-C5 injury)",
        "Core temperature below 35 degrees Celsius (severe hypothermia)",
        "Anuria (urine output less than 10 mL/hour indicating organ hypoperfusion)",
        "Loss of consciousness from cerebral hypoperfusion"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Vasopressor (alpha-1 and beta-1 adrenergic agonist)",
        action: "Potent alpha-1 agonist that causes arterial and venous vasoconstriction, restoring systemic vascular resistance; moderate beta-1 agonist effect increases heart rate and contractility; first-line vasopressor for neurogenic shock because it directly replaces the lost sympathetic tone",
        sideEffects: "Tissue necrosis if extravasation occurs, reflex bradycardia at high doses (though less relevant in neurogenic shock), peripheral ischemia, hypertension if over-titrated, cardiac arrhythmias",
        contra: "Hypovolemia (must correct volume deficit first before initiating vasopressors); mesenteric or peripheral vascular thrombosis; concurrent use with halogenated anesthetics",
        pearl: "MUST be administered through a central venous catheter whenever possible to prevent extravasation injury; if given peripherally, use a large-bore IV in an antecubital vein; have phentolamine available for extravasation treatment; titrate to MAP target 85-90 mmHg"
      },
      {
        name: "Atropine Sulfate",
        type: "Anticholinergic / parasympatholytic",
        action: "Blocks acetylcholine at muscarinic receptors in the SA node and AV node, increasing heart rate by removing parasympathetic (vagal) inhibition; used to treat symptomatic bradycardia in neurogenic shock where unopposed vagal tone causes dangerously slow heart rates",
        sideEffects: "Tachycardia (excessive dosing), dry mouth, urinary retention, blurred vision, constipation, mydriasis, hyperthermia (inhibits sweating)",
        contra: "Narrow-angle glaucoma; obstructive uropathy; myasthenia gravis; tachycardia (would worsen the condition)",
        pearl: "Standard dose for symptomatic bradycardia: 0.5 mg IV every 3-5 minutes to maximum 3 mg total; doses less than 0.5 mg may paradoxically worsen bradycardia; in neurogenic shock, bradycardia may recur and require repeated dosing or transcutaneous pacing"
      },
      {
        name: "Phenylephrine (Neo-Synephrine)",
        type: "Pure alpha-1 adrenergic agonist / vasopressor",
        action: "Selectively stimulates alpha-1 adrenergic receptors on vascular smooth muscle, causing potent vasoconstriction and increasing systemic vascular resistance; used as an alternative vasopressor in neurogenic shock when norepinephrine is insufficient or when isolated vasoconstriction without beta-1 stimulation is preferred",
        sideEffects: "Reflex bradycardia (major concern in neurogenic shock where bradycardia is already present), tissue necrosis on extravasation, hypertension, peripheral ischemia, headache",
        contra: "Severe bradycardia (reflex bradycardia from pure alpha-1 stimulation can worsen existing neurogenic bradycardia); severe hypertension; use caution with MAO inhibitors",
        pearl: "Use with caution in neurogenic shock because it LACKS beta-1 activity and can worsen bradycardia through baroreceptor reflex; often used in combination with atropine or only when norepinephrine is contraindicated; monitor heart rate closely during infusion"
      }
    ],
    pearls: [
      "Neurogenic shock presents with the triad of HYPOTENSION + BRADYCARDIA + WARM SKIN -- this combination distinguishes it from hypovolemic shock which causes hypotension + tachycardia + cold/clammy skin",
      "Always assume concurrent hemorrhagic shock in trauma patients with spinal cord injury until proven otherwise -- the absence of tachycardia does NOT mean the patient is not bleeding because the sympathetic response is blocked",
      "Neurogenic shock is NOT the same as spinal shock: neurogenic shock is a CARDIOVASCULAR emergency (hemodynamic instability); spinal shock is a NEUROLOGICAL phenomenon (temporary loss of reflexes below the injury)",
      "MAP target of 85-90 mmHg for the first 7 days post-SCI is critical to optimize spinal cord perfusion and prevent secondary ischemic injury to the already damaged cord",
      "Hypothermia is a constant threat in neurogenic shock because the patient loses the ability to shiver and vasoconstrict below the injury level -- actively warm the patient and monitor core temperature continuously",
      "Patients with cervical SCI at C3-C5 are at risk for respiratory failure because the phrenic nerve originates from C3-C5 and innervates the diaphragm -- have suction and intubation equipment at bedside",
      "When administering vasopressors for neurogenic shock, always correct hypovolemia first with IV fluids -- vasopressors are less effective in an underfilled vascular system and may cause dangerous vasoconstriction without improving perfusion"
    ],
    quiz: [
      {
        question: "A patient with a C6 spinal cord injury has a blood pressure of 78/50 mmHg, heart rate of 48 bpm, and warm, flushed skin below the clavicles. The practical nurse recognizes this presentation as which type of shock?",
        options: [
          "Hypovolemic shock",
          "Cardiogenic shock",
          "Neurogenic shock",
          "Septic shock"
        ],
        correct: 2,
        rationale: "The combination of hypotension, bradycardia, and warm skin in a patient with a cervical spinal cord injury is the classic triad of neurogenic shock. Hypovolemic shock would present with tachycardia and cold, clammy skin. Cardiogenic shock would show jugular vein distension and pulmonary edema. Septic shock typically presents with fever and tachycardia."
      },
      {
        question: "A practical nurse is caring for a patient in neurogenic shock who is receiving norepinephrine via central line. The MAP is currently 72 mmHg. What is the target MAP the nurse should report to achieve?",
        options: [
          "MAP greater than 60 mmHg",
          "MAP greater than 65 mmHg",
          "MAP 85-90 mmHg",
          "MAP greater than 100 mmHg"
        ],
        correct: 2,
        rationale: "Current guidelines recommend maintaining MAP at 85-90 mmHg for the first 7 days after spinal cord injury to optimize spinal cord perfusion and prevent secondary ischemic injury. A MAP of 72 mmHg is below target and should be reported so that vasopressor dose can be titrated upward."
      },
      {
        question: "A practical nurse notes that a patient with a T3 spinal cord injury has a core temperature of 34.8 degrees Celsius. What is the MOST likely explanation for this finding?",
        options: [
          "The patient has developed a systemic infection",
          "The patient has lost the ability to thermoregulate below the injury level (poikilothermia)",
          "The vasopressor medication is causing vasoconstriction and heat loss",
          "The hypothermia is intentional therapeutic cooling to protect the spinal cord"
        ],
        correct: 1,
        rationale: "Poikilothermia occurs in neurogenic shock because the loss of sympathetic nervous system function prevents vasoconstriction and shivering below the injury level. The patient's body temperature becomes dependent on the ambient environment. This is an expected complication that requires active warming measures."
      }
    ]
  },

  "neurological-rpn": {
    title: "Neurological Assessment for Practical Nurses",
    cellular: {
      title: "Foundations of Neurological Assessment and Monitoring",
      content: "The nervous system is divided into the central nervous system (CNS), consisting of the brain and spinal cord, and the peripheral nervous system (PNS), consisting of 12 pairs of cranial nerves and 31 pairs of spinal nerves. The brain is organized into the cerebrum (responsible for higher cognitive functions, voluntary movement, and sensory interpretation), the cerebellum (responsible for coordination, balance, and fine motor control), and the brainstem (which controls vital functions including heart rate, blood pressure, respiratory drive, and consciousness through the reticular activating system). The Glasgow Coma Scale (GCS) is the most widely used standardized tool for assessing level of consciousness, measuring three components: eye opening (1-4 points), verbal response (1-5 points), and motor response (1-6 points), with scores ranging from 3 (deep coma) to 15 (fully alert and oriented). A GCS score of 8 or below generally indicates severe neurological impairment and the inability to protect the airway. Level of consciousness is the most sensitive indicator of neurological change and the earliest sign of deterioration. The twelve cranial nerves control specific functions that can be assessed at the bedside: olfactory (I, smell), optic (II, vision and pupillary afferent), oculomotor (III, pupil constriction and eye movement), trochlear (IV, downward eye movement), trigeminal (V, facial sensation and mastication), abducens (VI, lateral eye movement), facial (VII, facial expression and taste), vestibulocochlear (VIII, hearing and balance), glossopharyngeal (IX, swallowing and gag reflex), vagus (X, swallowing, phonation, and parasympathetic functions), accessory (XI, shoulder shrug and head turning), and hypoglossal (XII, tongue movement). Pupil assessment is critical in neurological monitoring: pupils should be equal, round, reactive to light and accommodation (PERRLA). A unilaterally fixed and dilated pupil (blown pupil) indicates compression of cranial nerve III, often from uncal herniation due to increased intracranial pressure (ICP) -- this is a neurosurgical emergency. Motor assessment evaluates strength, tone, and symmetry using a 0-5 scale (0 = no movement, 5 = full strength against resistance). Sensory assessment evaluates the ability to perceive light touch, pain (sharp/dull), temperature, vibration, and proprioception in all dermatomes. The practical nurse performs focused neurological assessments, monitors trends over time, and reports any changes promptly because neurological deterioration can progress rapidly and early intervention significantly improves outcomes. Key assessment parameters that must be trended include level of consciousness, pupil size and reactivity, motor strength, vital signs (Cushing triad of hypertension, bradycardia, and irregular respirations indicates critically elevated ICP), and cognitive orientation (person, place, time, situation)."
    },
    riskFactors: [
      "History of stroke, transient ischemic attack, or cerebrovascular disease (risk of recurrent neurological events)",
      "Traumatic brain injury or recent neurosurgical procedure (risk of increased intracranial pressure and hemorrhage)",
      "Brain tumor or metastatic disease to the CNS (mass effect causing neurological compromise)",
      "Uncontrolled hypertension (risk factor for hemorrhagic stroke and hypertensive encephalopathy)",
      "Anticoagulant therapy (increased risk of intracranial hemorrhage from falls or spontaneous bleeding)",
      "Diabetes mellitus (risk of peripheral neuropathy and stroke; hypoglycemia mimics stroke symptoms)",
      "Advanced age (increased risk of falls, subdural hematoma, and neurodegenerative diseases)"
    ],
    diagnostics: [
      "Glasgow Coma Scale (GCS): standardized assessment of eye opening (E1-4), verbal response (V1-5), motor response (M1-6); total 3-15; score of 8 or below indicates severe impairment and inability to protect airway",
      "CT scan without contrast (head): first-line imaging for acute neurological changes; identifies hemorrhage, mass lesions, midline shift, hydrocephalus, and cerebral edema; no patient prep required",
      "MRI of the brain: superior soft-tissue resolution; identifies ischemic stroke (diffusion-weighted imaging), tumors, demyelinating lesions; screen for MRI contraindications (pacemaker, metal implants, cochlear implants)",
      "Pupil assessment (PERRLA): evaluate size (mm), shape, equality, and reactivity to light bilaterally; document direct and consensual responses; a unilateral fixed dilated pupil is an emergency",
      "Complete metabolic panel and glucose: rule out metabolic causes of altered consciousness (hypoglycemia, hyperglycemia, hyponatremia, hepatic encephalopathy, uremia)",
      "Lumbar puncture (LP): performed by physician to analyze cerebrospinal fluid; assesses for meningitis, subarachnoid hemorrhage, or elevated opening pressure; ensure no signs of elevated ICP before LP"
    ],
    management: [
      "Elevate the head of bed 30 degrees to promote venous drainage from the brain and reduce intracranial pressure; keep head in neutral midline alignment to prevent jugular vein compression",
      "Maintain a quiet, dimly lit environment to minimize stimulation that can increase ICP; cluster nursing care activities and allow rest periods between interventions",
      "Administer osmotic diuretic (mannitol) or hypertonic saline as ordered for increased ICP; monitor serum osmolality (hold mannitol if greater than 320 mOsm/kg) and sodium levels",
      "Seizure precautions: padded side rails, suction equipment at bedside, oxygen available, IV access maintained; administer prophylactic anticonvulsants as ordered",
      "Maintain normothermia: fever increases cerebral metabolic demand and worsens neurological injury; administer antipyretics and cooling measures as ordered for temperature above 37.5 degrees Celsius",
      "Strict intake and output monitoring; fluid management as prescribed to prevent cerebral edema while maintaining adequate cerebral perfusion pressure",
      "Fall prevention measures: bed in lowest position, call bell within reach, non-skid footwear, assist with ambulation if ambulatory; assess fall risk using standardized tool"
    ],
    nursingActions: [
      "Perform neurological checks at prescribed intervals (every 1-2 hours for acute patients, every 4 hours for stable patients): assess GCS, pupil size and reactivity, motor strength, orientation, and vital signs",
      "Report ANY decline in GCS of 2 or more points, new pupil asymmetry, new motor deficit, or onset of Cushing triad (hypertension, bradycardia, irregular respirations) immediately",
      "Assess cranial nerve function: facial symmetry (CN VII), gag and swallow reflex (CN IX and X) before oral intake, tongue midline (CN XII), pupil reactivity (CN II and III)",
      "Perform dysphagia screening before any oral intake in patients with neurological deficits; keep NPO until swallowing safety is confirmed; position upright for meals",
      "Monitor for seizure activity: document onset, duration, type of movements, level of consciousness, postictal state; do NOT restrain during a seizure; protect the head, turn to side, time the event",
      "Assess pain using appropriate validated tools including non-verbal pain scales for patients with altered consciousness (behavioral pain scale, CPOT)",
      "Document neurological assessment findings using consistent terminology and trending format to enable detection of subtle changes over time"
    ],
    assessmentFindings: [
      "Altered level of consciousness: confusion, lethargy, obtundation, stupor, or coma; graded using GCS -- the most sensitive and earliest indicator of neurological deterioration",
      "Pupil changes: unilateral fixed dilated pupil (ipsilateral CN III compression from herniation), bilateral fixed dilated pupils (severe brainstem injury or death), pinpoint pupils (opioid overdose or pontine hemorrhage)",
      "Motor deficits: hemiparesis (weakness on one side), hemiplegia (paralysis on one side), posturing -- decorticate (flexion of arms, extension of legs, lesion above brainstem) or decerebrate (extension of all extremities, brainstem lesion)",
      "Cushing triad: hypertension with widening pulse pressure, bradycardia, and irregular respirations -- a LATE sign of critically elevated ICP indicating impending herniation",
      "Speech and language changes: aphasia (inability to produce or comprehend language), dysarthria (slurred speech from motor impairment), both associated with stroke",
      "Cranial nerve deficits: facial droop (CN VII), absent gag reflex (CN IX/X), tongue deviation (CN XII), visual field cuts (CN II)",
      "Vital sign changes: Cushing response (hypertension, bradycardia, irregular breathing) in elevated ICP; hyperthermia from hypothalamic damage or central fever"
    ],
    signs: {
      left: [
        "Mild headache or new-onset complaint of head pressure",
        "Subtle personality or behavioral changes reported by family",
        "Slight decrease in GCS score (1 point change)",
        "Mild word-finding difficulty or slowed speech",
        "New onset of nausea or vomiting without GI cause",
        "Sluggish pupil reactivity (slower than baseline)"
      ],
      right: [
        "Unilateral fixed and dilated pupil (uncal herniation -- neurosurgical emergency)",
        "Cushing triad: hypertension, bradycardia, irregular respirations (critically elevated ICP)",
        "Decerebrate or decorticate posturing (severe brainstem compromise)",
        "GCS drop of 2 or more points from baseline",
        "New-onset seizure activity (generalized tonic-clonic)",
        "Sudden severe headache described as worst headache of life (possible subarachnoid hemorrhage)"
      ]
    },
    medications: [
      {
        name: "Mannitol (Osmitrol)",
        type: "Osmotic diuretic",
        action: "Creates an osmotic gradient that draws water from brain tissue into the intravascular space across the intact blood-brain barrier, reducing cerebral edema and lowering intracranial pressure; also reduces blood viscosity, improving cerebral blood flow",
        sideEffects: "Hypovolemia, hypotension (from diuresis), electrolyte imbalances (hyponatremia, hypokalemia), rebound intracranial hypertension if discontinued abruptly, acute kidney injury at high doses",
        contra: "Severe renal failure (anuria); active intracranial bleeding (may worsen hemorrhage by reducing tamponade effect); severe dehydration; pulmonary edema; serum osmolality greater than 320 mOsm/kg",
        pearl: "Administer through an in-line filter (crystals may form in solution); monitor serum osmolality every 6-8 hours and hold if greater than 320 mOsm/kg; monitor strict I&O and replace fluids to prevent hypovolemia; insert Foley catheter before administering"
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid (glucocorticoid)",
        action: "Reduces vasogenic cerebral edema surrounding brain tumors and abscesses by stabilizing the blood-brain barrier and reducing capillary permeability; decreases inflammatory mediator production; does NOT effectively reduce cytotoxic edema from stroke or trauma",
        sideEffects: "Hyperglycemia (monitor blood glucose every 6 hours), GI irritation/peptic ulcers, immunosuppression (increased infection risk), insomnia, mood changes, adrenal suppression with prolonged use, muscle weakness",
        contra: "Systemic fungal infections; live vaccines during therapy; active GI bleeding; use with extreme caution in diabetes (worsens hyperglycemia)",
        pearl: "Effective for vasogenic edema around brain tumors but NOT indicated for cytotoxic edema from ischemic stroke; taper dose gradually when discontinuing to prevent adrenal crisis; administer with a proton pump inhibitor (PPI) for GI protection; give morning dose to mimic natural cortisol rhythm"
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Anticonvulsant (synaptic vesicle protein 2A modulator)",
        action: "Binds to synaptic vesicle protein 2A (SV2A) in the presynaptic nerve terminal, modulating neurotransmitter release and reducing neuronal hyperexcitability; broad-spectrum antiepileptic effective for focal and generalized seizures",
        sideEffects: "Drowsiness, dizziness, behavioral changes (irritability, aggression, mood lability), fatigue, headache, nasopharyngitis",
        contra: "Known hypersensitivity to levetiracetam; dose must be adjusted in renal impairment (renally excreted); end-stage renal disease requires significant dose reduction",
        pearl: "Preferred first-line anticonvulsant in many neurological settings because it has minimal drug interactions (does not induce or inhibit hepatic enzymes), can be given IV or PO, and has a favorable side effect profile; monitor for behavioral changes, especially in the first month"
      }
    ],
    pearls: [
      "Level of consciousness is the MOST SENSITIVE and EARLIEST indicator of neurological change -- a subtle decrease in alertness or new confusion may precede all other neurological signs by hours",
      "A unilateral fixed and dilated pupil (blown pupil) on the SAME SIDE as a brain lesion indicates uncal herniation with CN III compression -- this is a neurosurgical emergency requiring immediate notification",
      "The Cushing triad (hypertension + bradycardia + irregular respirations) is a LATE sign of critically elevated ICP -- do NOT wait for this triad to report neurological deterioration; early GCS changes are more important",
      "Always assess GCS components individually (E, V, M) rather than reporting only the total score -- a patient with E3V2M5 (total 10) has very different needs than E4V4M2 (total 10)",
      "Perform dysphagia screening before ANY oral intake in patients with stroke or neurological deficits -- silent aspiration occurs in up to 40% of stroke patients and causes aspiration pneumonia",
      "HOB elevation at 30 degrees in NEUTRAL MIDLINE position is fundamental for ICP management -- avoid neck flexion, hip flexion greater than 90 degrees, and Valsalva maneuvers, all of which increase ICP",
      "Mannitol requires a functioning kidney to work (produces diuresis) and must be held when serum osmolality exceeds 320 mOsm/kg or when the patient develops signs of renal impairment"
    ],
    quiz: [
      {
        question: "A practical nurse performing neurological checks observes that a patient's right pupil is now 6 mm and fixed (non-reactive to light), while the left pupil remains 3 mm and reactive. What should the nurse do FIRST?",
        options: [
          "Document the finding and reassess in one hour",
          "Administer prescribed eye drops and reassess",
          "Notify the physician or rapid response team immediately",
          "Dim the lights in the room and reassess pupil reactivity"
        ],
        correct: 2,
        rationale: "A unilateral fixed and dilated pupil is a sign of uncal herniation compressing cranial nerve III on the same side. This is a neurosurgical emergency that requires immediate physician notification. Delaying to reassess or document could result in irreversible brain damage."
      },
      {
        question: "A practical nurse documents a neurological assessment as GCS E3V4M5 (total 12) at 0800. At 1000, the assessment reveals E2V3M4 (total 9). Which action is MOST appropriate?",
        options: [
          "Continue monitoring and reassess at the next scheduled time",
          "Report the GCS decline of 3 points to the supervising nurse or physician immediately",
          "Increase the head of bed to 45 degrees and administer oxygen",
          "Perform a complete head-to-toe assessment before notifying anyone"
        ],
        correct: 1,
        rationale: "A decline of 2 or more points in GCS indicates significant neurological deterioration and must be reported immediately. A 3-point decline (from 12 to 9) is critical and may indicate increasing intracranial pressure, hemorrhage, or other acute neurological emergency requiring urgent intervention."
      },
      {
        question: "A practical nurse is caring for a patient with increased intracranial pressure. Which intervention is appropriate for managing ICP?",
        options: [
          "Position the patient flat in bed to improve cerebral blood flow",
          "Elevate the head of bed to 30 degrees with the head in neutral midline alignment",
          "Encourage the patient to perform Valsalva maneuvers to increase venous return",
          "Cluster all nursing care activities into one continuous session without rest periods"
        ],
        correct: 1,
        rationale: "Elevating the HOB to 30 degrees with the head in neutral midline promotes venous drainage from the brain and reduces ICP. Flat positioning increases ICP. Valsalva maneuvers increase intrathoracic pressure and impede venous return from the brain. Clustering care without rest periods increases ICP through sustained stimulation."
      }
    ]
  },

  "neutropenic-precautions-rpn": {
    title: "Neutropenic Precautions for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neutropenia and Infection Risk",
      content: "Neutropenia is defined as an absolute neutrophil count (ANC) below 1500 cells per microliter (1.5 x 10^9/L). Neutrophils are the most abundant type of white blood cell, comprising 55-70% of circulating leukocytes, and serve as the first line of defense against bacterial and fungal infections. They are produced in the bone marrow from myeloid stem cells through a process called granulopoiesis, which takes approximately 10-14 days from stem cell to mature neutrophil. Neutrophils circulate in the blood for only 6-10 hours before migrating into tissues, where they survive for 1-2 days performing phagocytosis -- the process of engulfing and destroying pathogens. The absolute neutrophil count is calculated using the formula: ANC = WBC x (percentage of neutrophils + percentage of bands) / 100. Bands are immature neutrophils released from the bone marrow; an elevated band count (bandemia or left shift) indicates the bone marrow is attempting to compensate for increased demand during infection. Neutropenia is classified by severity: mild (ANC 1000-1500), moderate (ANC 500-1000), and severe (ANC below 500). Severe neutropenia (ANC below 500) carries the highest risk for life-threatening infection because the immune system cannot mount an adequate inflammatory response. Critically, patients with severe neutropenia may NOT develop the classic signs of infection such as pus formation, erythema, swelling, or even significant fever because these inflammatory responses require functioning neutrophils. Fever may be the ONLY sign of a potentially lethal infection in a neutropenic patient, which is why any temperature of 38.3 degrees Celsius (101 degrees Fahrenheit) or a sustained temperature of 38.0 degrees Celsius (100.4 degrees Fahrenheit) for one hour or more in a neutropenic patient is considered a medical emergency called febrile neutropenia. The most common causes of neutropenia in clinical practice include chemotherapy-induced myelosuppression (the nadir, or lowest point, typically occurs 7-14 days after chemotherapy), bone marrow failure (aplastic anemia, myelodysplastic syndromes), hematologic malignancies (leukemia, lymphoma), radiation therapy affecting the bone marrow, and certain medications (clozapine, methimazole, carbamazepine, sulfasalazine). The practical nurse must understand that preventing infection is paramount because treatment options are limited once a severe infection develops in a neutropenic host. Protective isolation, meticulous hand hygiene, dietary restrictions, environmental controls, and close monitoring for subtle signs of infection are essential nursing responsibilities."
    },
    riskFactors: [
      "Chemotherapy (most common cause; cytotoxic agents destroy rapidly dividing bone marrow cells along with cancer cells)",
      "Radiation therapy to bone marrow-producing sites (pelvis, sternum, vertebrae, long bones)",
      "Hematologic malignancies (leukemia, lymphoma, multiple myeloma -- malignant cells crowd out normal hematopoiesis)",
      "Bone marrow transplant (conditioning regimen ablates existing marrow; engraftment takes 2-4 weeks)",
      "Aplastic anemia (autoimmune destruction or failure of bone marrow stem cells)",
      "Medications known to cause agranulocytosis: clozapine, methimazole, carbamazepine, sulfasalazine, ganciclovir",
      "Nutritional deficiencies (severe vitamin B12 or folate deficiency impairs DNA synthesis in rapidly dividing bone marrow cells)"
    ],
    diagnostics: [
      "Complete blood count (CBC) with differential: provides WBC count and percentage of neutrophils and bands; calculate ANC using the formula ANC = WBC x (% neutrophils + % bands) / 100",
      "Blood cultures (2 sets from 2 different sites): MUST be drawn BEFORE starting antibiotics in febrile neutropenia; draw from peripheral sites and from each lumen of central venous catheter if present",
      "Urine culture and urinalysis: even without typical UTI symptoms (neutropenic patients lack pyuria and may not have cloudy urine due to absent neutrophil response)",
      "Chest X-ray: obtain in febrile neutropenic patients even without respiratory symptoms; infiltrates may be minimal or absent due to the inability to mount a normal inflammatory response",
      "C-reactive protein (CRP) and procalcitonin: inflammatory markers that may help identify bacterial infection; procalcitonin greater than 0.5 ng/mL suggests bacterial origin",
      "Peripheral blood smear: evaluates neutrophil morphology, identifies toxic granulation (sign of infection), and assesses for blasts (leukemia) or other abnormal cells"
    ],
    management: [
      "Implement protective (reverse) isolation: private room with positive pressure ventilation if available; door closed at all times; limit visitors to healthy individuals only",
      "Strict hand hygiene: alcohol-based hand rub or soap and water for a minimum of 20 seconds; hand hygiene before and after every patient contact is the SINGLE MOST IMPORTANT infection prevention measure",
      "Neutropenic diet (low-microbial diet): avoid raw fruits and vegetables, raw or undercooked meat/fish/eggs, unpasteurized dairy products, soft cheeses, deli meats, raw honey, and well water; all food should be thoroughly cooked",
      "Begin empiric broad-spectrum antibiotics WITHIN ONE HOUR of fever onset in neutropenic patients (febrile neutropenia protocol); do not wait for culture results",
      "Administer colony-stimulating factors (G-CSF: filgrastim) as prescribed to stimulate neutrophil production from the bone marrow and shorten the duration of neutropenia",
      "Environmental controls: no fresh flowers or live plants in the room (harbor Aspergillus and other fungi); daily room cleaning with hospital-grade disinfectant; HEPA filtration if available",
      "Prophylactic antimicrobials as ordered: fluoroquinolone (ciprofloxacin or levofloxacin) for bacterial prophylaxis and antifungal (fluconazole) for fungal prophylaxis when ANC is expected to be below 500 for more than 7 days"
    ],
    nursingActions: [
      "Calculate and monitor ANC daily from the CBC: ANC = WBC x (% neutrophils + % bands) / 100; report ANC below 500 immediately as this indicates severe neutropenia",
      "Monitor temperature every 4 hours or as prescribed; report ANY temperature of 38.3 degrees Celsius (101 degrees Fahrenheit) or sustained 38.0 degrees Celsius for 1 hour or more immediately -- this is febrile neutropenia until proven otherwise",
      "Perform a thorough daily assessment for subtle signs of infection: inspect oral mucosa (mucositis, thrush), perineal area, IV insertion sites, wounds, skin folds; remember classic signs of infection may be absent",
      "Enforce strict visitor screening: no visitors with active infections, recent immunizations with live vaccines, or exposure to communicable diseases; limit number of visitors",
      "Administer prescribed medications on time: antibiotics, antifungals, colony-stimulating factors; ensure blood cultures are drawn BEFORE the first dose of antibiotics",
      "Avoid invasive procedures when possible: no rectal temperatures, no rectal suppositories, no intramuscular injections, minimize venipuncture (use existing central line when available)",
      "Educate patient and family on hand hygiene, dietary restrictions, signs of infection to report, and the importance of avoiding crowds and sick contacts after discharge"
    ],
    assessmentFindings: [
      "Fever: may be the ONLY sign of infection in severely neutropenic patients; temperature of 38.3 degrees Celsius or sustained 38.0 degrees Celsius for 1 hour constitutes febrile neutropenia",
      "Oral mucositis: red, swollen, ulcerated oral mucosa often complicated by candidal infection (white patches/thrush); extremely painful and a portal of entry for bacteria",
      "Perianal inflammation or tenderness: common site of infection in neutropenic patients; assess for redness, swelling, pain, fissures; abscess formation may not occur without neutrophils",
      "Central line site changes: redness, tenderness, drainage, or warmth at the catheter insertion site indicating catheter-related bloodstream infection",
      "Subtle respiratory changes: new cough (even nonproductive), mild dyspnea, or tachypnea may be the only signs of pneumonia; consolidation may not develop on chest X-ray without neutrophils",
      "Skin integrity changes: any break in skin becomes a potential portal of entry; assess for cellulitis (erythema may be minimal), peeling, rashes, or wound dehiscence",
      "Fatigue and malaise: generalized weakness, decreased appetite, myalgias may represent early systemic infection in the absence of fever"
    ],
    signs: {
      left: [
        "ANC between 500 and 1000 (moderate neutropenia, increased vigilance required)",
        "Low-grade temperature (37.5-38.0 degrees Celsius)",
        "Mild oral mucositis (Grade 1-2, erythema and mild ulceration)",
        "Fatigue and decreased appetite without other symptoms",
        "Minor skin breakdown or peeling at IV sites",
        "Mild sore throat or nasal congestion"
      ],
      right: [
        "ANC below 100 (profound neutropenia, highest infection mortality risk)",
        "Febrile neutropenia: temperature 38.3 degrees Celsius or higher with ANC below 500",
        "Septic shock: hypotension, tachycardia, altered mental status in a neutropenic patient",
        "Severe mucositis preventing oral intake (Grade 3-4, unable to swallow)",
        "Perianal abscess or necrotizing soft tissue infection",
        "Fungal pneumonia (Aspergillus) in prolonged neutropenia: hemoptysis, pleuritic chest pain, new pulmonary infiltrates"
      ]
    },
    medications: [
      {
        name: "Filgrastim (Neupogen)",
        type: "Granulocyte colony-stimulating factor (G-CSF)",
        action: "Binds to G-CSF receptors on myeloid progenitor cells in the bone marrow, stimulating proliferation, differentiation, and maturation of neutrophils; also enhances the function of mature neutrophils (improved phagocytosis and chemotaxis); reduces the duration and severity of chemotherapy-induced neutropenia",
        sideEffects: "Bone pain (most common, caused by marrow expansion; treat with acetaminophen or ibuprofen), injection site reactions, headache, splenic enlargement (rare risk of splenic rupture), leukocytosis",
        contra: "Known hypersensitivity to filgrastim or E. coli-derived proteins; should NOT be administered within 24 hours before or after chemotherapy (stimulating marrow division during chemo increases bone marrow toxicity)",
        pearl: "Typically started 24-72 hours AFTER chemotherapy completion; administer subcutaneously in the abdomen, thigh, or upper arm; rotate injection sites; store in refrigerator but allow to reach room temperature before injection to reduce pain"
      },
      {
        name: "Ciprofloxacin (Cipro)",
        type: "Fluoroquinolone antibiotic (broad-spectrum)",
        action: "Inhibits bacterial DNA gyrase and topoisomerase IV enzymes, preventing DNA replication and transcription; bactericidal against gram-negative organisms (Pseudomonas, E. coli, Klebsiella) and some gram-positive bacteria; used for prophylaxis in patients expected to have prolonged severe neutropenia",
        sideEffects: "Tendon rupture (Achilles tendon most common, risk increases with age and concurrent corticosteroids), QT prolongation, peripheral neuropathy, photosensitivity, C. difficile infection, GI upset (nausea, diarrhea)",
        contra: "Concurrent use with tizanidine; myasthenia gravis (can worsen weakness); history of tendon disorders related to fluoroquinolone use; children under 18 (risk of cartilage damage, except for specific FDA-approved indications)",
        pearl: "Do NOT administer with dairy products, calcium supplements, or antacids (chelation reduces absorption); separate from multivitamins containing divalent cations by at least 2 hours; maintain adequate hydration to prevent crystalluria; monitor for tendon pain and discontinue immediately if suspected tendinitis"
      },
      {
        name: "Fluconazole (Diflucan)",
        type: "Azole antifungal (triazole)",
        action: "Inhibits fungal cytochrome P450 enzyme lanosterol 14-alpha-demethylase, blocking the conversion of lanosterol to ergosterol; ergosterol is essential for fungal cell membrane integrity, so its depletion causes increased membrane permeability and fungal cell death; active against Candida species and Cryptococcus",
        sideEffects: "Hepatotoxicity (monitor liver function tests), nausea, headache, abdominal pain, diarrhea, QT prolongation, rash (rarely Stevens-Johnson syndrome)",
        contra: "Concurrent use with drugs that prolong QT interval; known hypersensitivity to azole antifungals; significant hepatic impairment (use with caution); pregnancy category D (teratogenic at high doses)",
        pearl: "NOT effective against Aspergillus (the most dangerous fungal pathogen in prolonged neutropenia; voriconazole is preferred for Aspergillus); many drug interactions because fluconazole inhibits CYP2C9 and CYP3A4 -- increases levels of warfarin, phenytoin, and cyclosporine; monitor INR closely in patients on concurrent warfarin"
      }
    ],
    pearls: [
      "ANC calculation: ANC = WBC x (% neutrophils + % bands) / 100 -- this formula must be memorized; ANC below 500 = severe neutropenia; ANC below 100 = profound neutropenia with highest mortality risk",
      "Fever may be the ONLY sign of life-threatening infection in a neutropenic patient -- classic signs like pus, swelling, erythema, and warmth require functioning neutrophils to produce and may be completely absent",
      "Febrile neutropenia is a medical emergency: draw blood cultures immediately, then start empiric broad-spectrum antibiotics WITHIN ONE HOUR; every hour of delay increases mortality",
      "Hand hygiene is the SINGLE MOST EFFECTIVE measure to prevent healthcare-associated infections in neutropenic patients -- enforce with all staff, visitors, and the patient themselves",
      "AVOID all rectal interventions in neutropenic patients: no rectal temperatures, no rectal suppositories, no enemas -- the rectal mucosa is fragile and any disruption creates a portal of entry for gut bacteria into the bloodstream",
      "Filgrastim (G-CSF) should NOT be given within 24 hours before or after chemotherapy -- stimulating bone marrow proliferation while cytotoxic agents are active increases marrow destruction",
      "Teach patients to self-monitor temperature at home after discharge and to seek emergency care IMMEDIATELY for any fever above 38.0 degrees Celsius -- do not take antipyretics and wait to see if fever resolves"
    ],
    quiz: [
      {
        question: "A practical nurse receives the following lab results for a patient on chemotherapy: WBC 2.0 x 10^9/L, neutrophils 20%, bands 5%. What is the patient's ANC and what does it indicate?",
        options: [
          "ANC = 500; severe neutropenia requiring protective isolation",
          "ANC = 1000; moderate neutropenia requiring standard precautions only",
          "ANC = 2500; normal range, no intervention needed",
          "ANC = 250; profound neutropenia but no action needed until fever develops"
        ],
        correct: 0,
        rationale: "ANC = WBC x (% neutrophils + % bands) / 100 = 2.0 x (20 + 5) / 100 = 2.0 x 25 / 100 = 0.5 x 10^9/L = 500 cells/microliter. An ANC of 500 is at the threshold of severe neutropenia and requires protective isolation, neutropenic diet, and close monitoring for infection."
      },
      {
        question: "A neutropenic patient with an ANC of 200 develops a temperature of 38.5 degrees Celsius. Which nursing action takes HIGHEST priority?",
        options: [
          "Administer acetaminophen to reduce the fever and reassess in 30 minutes",
          "Notify the physician immediately and draw blood cultures before initiating prescribed empiric antibiotics",
          "Encourage oral fluids and monitor temperature every 4 hours",
          "Place the patient on contact isolation and apply ice packs"
        ],
        correct: 1,
        rationale: "This patient has febrile neutropenia, which is a medical emergency. The highest priority is to notify the physician, draw blood cultures (before antibiotics to avoid affecting results), and initiate empiric broad-spectrum antibiotics within one hour. Delaying antibiotics to manage fever with acetaminophen alone increases mortality risk."
      },
      {
        question: "A practical nurse is reinforcing discharge teaching for a patient recovering from chemotherapy-induced neutropenia. Which statement by the patient indicates the need for further education?",
        options: [
          "I will wash my hands frequently and avoid people who are sick.",
          "I will eat only well-cooked meat and washed, peeled fruits.",
          "I should wait a day to see if a fever goes away on its own before calling the doctor.",
          "I will avoid gardening and handling pet waste until my counts recover."
        ],
        correct: 2,
        rationale: "Waiting a day to see if a fever resolves is dangerous for a neutropenic patient. Any fever above 38.0 degrees Celsius requires immediate medical attention because it may be the only sign of a life-threatening infection. The other statements reflect appropriate understanding of neutropenic precautions."
      }
    ]
  },

  "non-pharm-pain-rpn": {
    title: "Non-Pharmacological Pain Management for Practical Nurses",
    cellular: {
      title: "Physiology of Pain and Non-Pharmacological Interventions",
      content: "Pain is a complex, subjective experience defined by the International Association for the Study of Pain (IASP) as an unpleasant sensory and emotional experience associated with, or resembling that associated with, actual or potential tissue damage. Pain transmission involves four physiological processes: transduction (conversion of noxious stimuli into electrical nerve impulses at nociceptors in peripheral tissues), transmission (propagation of nerve impulses from the peripheral nervous system through the dorsal horn of the spinal cord to the brain via the spinothalamic tract), perception (conscious awareness and interpretation of pain in the cerebral cortex, thalamus, and limbic system), and modulation (descending inhibitory pathways from the brain that can enhance or suppress pain signals at the dorsal horn of the spinal cord). The gate control theory, proposed by Melzack and Wall in 1965, provides the foundational framework for understanding how non-pharmacological interventions modulate pain. According to this theory, the substantia gelatinosa in the dorsal horn of the spinal cord acts as a gating mechanism that can either facilitate or inhibit the transmission of pain signals to the brain. Large-diameter, myelinated A-beta sensory fibers (which carry touch, pressure, and vibration sensations) can activate inhibitory interneurons in the dorsal horn that close the gate, blocking the transmission of pain signals carried by small-diameter, unmyelinated C fibers and thinly myelinated A-delta fibers. This is why rubbing a bumped knee provides immediate relief -- the touch sensation transmitted via A-beta fibers closes the gate to pain signals. Non-pharmacological pain management strategies work through several mechanisms: peripheral stimulation techniques (heat, cold, massage, TENS) activate large-diameter afferent fibers that close the spinal gate to pain transmission; cognitive-behavioral techniques (distraction, guided imagery, relaxation, music therapy) activate descending inhibitory pathways from the cortex and brainstem that modulate pain perception at the dorsal horn level; and mind-body techniques (deep breathing, progressive muscle relaxation, meditation) reduce sympathetic nervous system activation, decrease muscle tension, lower stress hormone levels (cortisol, catecholamines), and activate the endogenous opioid system (endorphins, enkephalins). The biopsychosocial model of pain recognizes that pain experience is shaped by biological factors (tissue damage, inflammation, nerve sensitization), psychological factors (anxiety, depression, catastrophizing, past pain experiences, coping strategies), and social factors (cultural beliefs, family support, work disability, secondary gain). Effective pain management requires addressing all three domains, which is why non-pharmacological approaches are essential complements to medication therapy. The practical nurse must understand that non-pharmacological interventions do not replace analgesic medications for moderate to severe pain but are used as adjunctive therapy within a multimodal pain management approach. Pain is what the patient says it is -- the patient's self-report is always the most reliable indicator of pain and should guide treatment decisions."
    },
    riskFactors: [
      "Chronic pain conditions (neuropathic pain, fibromyalgia, chronic low back pain -- longer duration increases central sensitization)",
      "Anxiety and depression (amplify pain perception through descending facilitatory pathways and reduced coping capacity)",
      "History of inadequate pain management or undertreated pain (leads to pain catastrophizing, fear-avoidance, and hypervigilance)",
      "Cognitive impairment or communication barriers (inability to self-report pain leads to underrecognition and undertreatment)",
      "Extremes of age (neonates and elderly have altered pain processing and are frequently undertreated for pain)",
      "Cultural or language barriers (pain expression varies across cultures; language barriers impede accurate pain assessment)",
      "Opioid tolerance or substance use disorder (complex pain management requiring multimodal and non-pharmacological approaches)"
    ],
    diagnostics: [
      "Numeric Rating Scale (NRS): patient rates pain from 0 (no pain) to 10 (worst possible pain); most commonly used validated pain assessment tool in adults",
      "Wong-Baker FACES Pain Scale: uses facial expressions from smiling (0) to crying (10); validated for children ages 3 and older and for adults with cognitive or communication challenges",
      "FLACC Scale (Face, Legs, Activity, Cry, Consolability): behavioral pain assessment for infants and nonverbal patients; each category scored 0-2, total 0-10",
      "PQRST pain assessment: Provocation/Palliation, Quality, Region/Radiation, Severity, Timing -- standardized framework for comprehensive pain characterization",
      "Behavioral Pain Scale (BPS) or CPOT (Critical Care Pain Observation Tool): validated for nonverbal critically ill patients; assesses facial expression, body movements, muscle tension, and ventilator compliance",
      "Pain reassessment after intervention: document pain level before AND after both pharmacological and non-pharmacological interventions to evaluate effectiveness; reassess within 30-60 minutes"
    ],
    management: [
      "Multimodal pain management approach: combine non-pharmacological techniques with pharmacological agents to target different pain pathways simultaneously; reduces opioid requirements and improves outcomes",
      "Heat therapy: apply warm compresses, heating pads, or warm baths for 15-20 minutes; promotes vasodilation, increases blood flow, relaxes muscle spasm, and decreases joint stiffness; NEVER apply directly to skin (use barrier); contraindicated over open wounds, malignancy, acute inflammation first 24-48 hours",
      "Cold therapy (cryotherapy): apply ice packs or cold compresses for 15-20 minutes maximum; causes vasoconstriction, reduces edema, slows nerve conduction velocity, and numbs the area; most effective in first 24-48 hours after acute injury; contraindicated in Raynaud disease, peripheral vascular disease, and over areas of impaired sensation",
      "Transcutaneous electrical nerve stimulation (TENS): delivers low-voltage electrical current through skin electrodes placed near the pain site; activates A-beta fibers to close the spinal pain gate; contraindicated with pacemakers, over the carotid sinus, and during pregnancy over the abdomen",
      "Distraction techniques: guided imagery, music therapy, virtual reality, art therapy, conversation, television, reading; redirect attention away from pain by engaging competing cognitive processes; most effective for procedural pain and acute pain episodes",
      "Relaxation techniques: progressive muscle relaxation (systematic tensing and releasing of muscle groups), deep breathing exercises (diaphragmatic breathing), and meditation; reduce sympathetic activation, lower heart rate, decrease muscle tension, and promote endorphin release",
      "Positioning and body mechanics: proper positioning using pillows, wedges, and supportive devices to reduce pressure on painful areas; frequent repositioning every 2 hours; splinting surgical incisions during coughing"
    ],
    nursingActions: [
      "Assess pain using validated tools (NRS, FACES, FLACC, CPOT) at regular intervals AND before and after all interventions; document the 5th vital sign using the PQRST framework",
      "Implement appropriate non-pharmacological interventions based on pain type, patient preference, and clinical situation; individualize the approach -- what works for one patient may not work for another",
      "Apply heat or cold therapy safely: use protective barrier between modality and skin, limit application to 15-20 minutes, assess skin before and after application, never apply to areas of impaired circulation or sensation",
      "Teach and guide patients through relaxation techniques: deep breathing (inhale slowly through nose for 4 counts, hold 4 counts, exhale through mouth for 6-8 counts), progressive muscle relaxation, guided imagery",
      "Position patient for comfort using pillows, blankets, and bed positioning; elevate affected extremities to reduce edema; maintain proper body alignment; assist with repositioning at least every 2 hours",
      "Reassess pain within 30 minutes after IV medication and 60 minutes after oral medication or non-pharmacological intervention; document pain intensity, quality, and patient response",
      "Advocate for the patient by reporting uncontrolled pain to the supervising nurse or physician; request medication adjustments or additional interventions when pain management goals are not being met"
    ],
    assessmentFindings: [
      "Autonomic responses to acute pain: tachycardia, hypertension, tachypnea, diaphoresis, pupil dilation, pallor -- these physiological indicators may be the only clues in nonverbal patients",
      "Behavioral indicators: guarding (protecting painful area), grimacing, moaning, restlessness, inability to sleep, decreased appetite, withdrawal from activities, crying",
      "Chronic pain presentation: may lack autonomic responses due to physiological adaptation; assess for functional impairment, sleep disturbance, depression, social isolation",
      "Muscle tension and spasm: palpable tightness or involuntary contraction in the area surrounding the pain source; increases with anxiety and stress",
      "Facial expression changes: furrowed brow, clenched teeth, tight lips, wincing, squinting -- validated in behavioral pain scales for nonverbal patients",
      "Functional impairment: decreased range of motion, reluctance to move, inability to perform activities of daily living, guarded posture, antalgic gait"
    ],
    signs: {
      left: [
        "Mild pain (NRS 1-3) manageable with non-pharmacological measures alone",
        "Mild muscle tension or guarding at the pain site",
        "Slight changes in facial expression (furrowed brow, lip biting)",
        "Minor reduction in activity level or mobility",
        "Patient able to sleep with mild repositioning assistance",
        "Requesting complementary comfort measures (warm blanket, repositioning)"
      ],
      right: [
        "Severe uncontrolled pain (NRS 8-10) unresponsive to interventions",
        "Hemodynamic instability related to pain (severe hypertension, tachycardia, or vasovagal syncope)",
        "Diaphoresis, pallor, and nausea from pain intensity (vasovagal response)",
        "Inability to move, eat, or sleep due to pain severity",
        "New-onset neurological deficit with pain (possible compartment syndrome or spinal cord compression)",
        "Chest pain or abdominal pain with hemodynamic changes (potential cardiac or surgical emergency)"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic / antipyretic",
        action: "Inhibits prostaglandin synthesis in the central nervous system (primarily COX-3 in the hypothalamus), reducing pain perception and lowering the thermoregulatory set point to reduce fever; does NOT have significant peripheral anti-inflammatory activity unlike NSAIDs",
        sideEffects: "Hepatotoxicity (dose-dependent, major concern); risk increases with chronic alcohol use, malnutrition, and pre-existing liver disease; maximum 4000 mg/day in healthy adults, 2000 mg/day in liver disease or elderly",
        contra: "Severe hepatic impairment or active liver disease; known hypersensitivity; use caution with chronic alcohol consumption (more than 3 drinks/day); check ALL combination products for hidden acetaminophen content to prevent inadvertent overdose",
        pearl: "First-line analgesic for mild to moderate pain and the preferred non-opioid in patients who cannot take NSAIDs; N-acetylcysteine (NAC) is the antidote for acetaminophen overdose and must be given within 8-10 hours of ingestion for maximum efficacy; always calculate total daily dose from ALL sources including combination products"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Non-steroidal anti-inflammatory drug (NSAID) / non-opioid analgesic",
        action: "Non-selectively inhibits cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, blocking prostaglandin synthesis at peripheral sites of tissue injury; reduces inflammation, pain, and fever; provides both central and peripheral analgesic effects",
        sideEffects: "GI bleeding and peptic ulceration (COX-1 inhibition reduces protective gastric prostaglandins), nephrotoxicity (reduced renal blood flow), cardiovascular risk (increased with chronic use), platelet inhibition (increased bleeding time), hypertension",
        contra: "Active GI bleeding or peptic ulcer disease; severe renal impairment (GFR below 30); third trimester of pregnancy (premature closure of ductus arteriosus); concurrent use with anticoagulants increases bleeding risk; aspirin-sensitive asthma",
        pearl: "Take with food and a full glass of water to reduce GI irritation; avoid concurrent use with other NSAIDs; enhances effectiveness when combined with acetaminophen (different mechanisms of action target different pain pathways); monitor renal function in elderly patients and those on concurrent ACE inhibitors or diuretics"
      },
      {
        name: "Lidocaine Patch 5% (Lidoderm)",
        type: "Topical local anesthetic",
        action: "Blocks sodium channels in peripheral nerve endings at the application site, preventing depolarization and transmission of pain signals; provides localized analgesia without systemic effects at recommended doses; particularly effective for neuropathic pain conditions such as postherpetic neuralgia",
        sideEffects: "Application site reactions (erythema, edema, burning sensation), rare systemic toxicity if applied to large areas or damaged skin (dizziness, drowsiness, metallic taste, cardiac arrhythmias)",
        contra: "Known hypersensitivity to amide-type local anesthetics (lidocaine, bupivacaine); application to damaged or broken skin (increased systemic absorption); use caution in patients with severe hepatic disease (lidocaine is hepatically metabolized)",
        pearl: "Apply to intact skin over the most painful area; wear for 12 hours on, 12 hours off per 24-hour period; up to 3 patches may be applied simultaneously; cut patches to size if needed; compare non-pharmacological interventions like TENS therapy which works on similar gate control principles for neuropathic pain"
      }
    ],
    pearls: [
      "Pain is what the patient says it is -- the patient's self-report is ALWAYS the most reliable indicator of pain; never dismiss a patient's pain report based on your own judgment of what their pain should be",
      "The gate control theory explains why non-pharmacological interventions work: stimulating large A-beta sensory fibers (through touch, massage, vibration, TENS) closes the spinal gate to pain signals carried by small C fibers and A-delta fibers",
      "Multimodal pain management combining non-pharmacological and pharmacological approaches reduces opioid requirements by 20-40% and improves patient satisfaction -- always offer non-pharmacological options alongside medications",
      "Heat therapy is best for chronic pain, muscle spasm, and joint stiffness (promotes vasodilation and relaxation); cold therapy is best for acute injury in the first 24-48 hours (reduces edema, slows nerve conduction) -- NEVER apply either directly to skin",
      "Always assess pain BEFORE and AFTER every intervention using a validated tool and document both scores -- this is the only way to evaluate whether the intervention was effective",
      "TENS is contraindicated in patients with cardiac pacemakers or defibrillators (electrical interference), over the carotid sinus (risk of bradycardia or syncope), and on the abdomen during pregnancy",
      "Non-pharmacological interventions are NOT a substitute for analgesic medications when pain is moderate to severe -- they are complementary strategies that enhance overall pain relief within a multimodal approach"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient who reports chronic low back pain rated 5/10. The patient prefers to try non-pharmacological measures before taking medication. Which intervention would be MOST appropriate?",
        options: [
          "Apply an ice pack directly to the lower back for 30 minutes",
          "Apply a warm compress with a protective barrier for 15-20 minutes",
          "Place TENS electrodes over the carotid artery for maximum effect",
          "Encourage the patient to remain on strict bed rest until the pain resolves"
        ],
        correct: 1,
        rationale: "Heat therapy applied with a protective barrier for 15-20 minutes is appropriate for chronic low back pain because it promotes vasodilation, relaxes muscle spasm, and decreases joint stiffness. Ice is better for acute injury in the first 24-48 hours. TENS should never be placed over the carotid sinus. Prolonged bed rest worsens chronic back pain."
      },
      {
        question: "A practical nurse applies a cold pack to a patient's sprained ankle. Which assessment finding would require the nurse to remove the cold pack immediately?",
        options: [
          "The patient reports mild numbness after 10 minutes of application",
          "The skin under the cold pack appears white and mottled with loss of sensation",
          "The swelling around the ankle appears slightly reduced",
          "The patient rates pain as 3/10, down from 6/10 before application"
        ],
        correct: 1,
        rationale: "White, mottled skin with loss of sensation indicates tissue ischemia from excessive cold application and potential frostbite. The cold pack must be removed immediately. Mild numbness after 10 minutes is expected. Reduced swelling and decreased pain are therapeutic effects indicating the cold therapy is working as intended."
      },
      {
        question: "Which statement by a practical nurse best reflects the gate control theory of pain management?",
        options: [
          "Pain signals are always transmitted to the brain regardless of other sensory input",
          "Stimulating large nerve fibers through techniques like massage or TENS can block pain signals from reaching the brain",
          "Non-pharmacological interventions only work through the placebo effect",
          "The brain cannot modulate incoming pain signals from the spinal cord"
        ],
        correct: 1,
        rationale: "The gate control theory states that stimulation of large-diameter A-beta fibers (through touch, pressure, vibration, TENS, massage) activates inhibitory interneurons in the dorsal horn of the spinal cord that close the gate to pain signals carried by small C fibers and A-delta fibers, reducing pain transmission to the brain."
      }
    ]
  }
};

let total = 0;
let injected = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  total++;
  if (inject(id, lesson)) injected++;
}
console.log(`\nDone: ${injected}/${total} lessons injected.`);
