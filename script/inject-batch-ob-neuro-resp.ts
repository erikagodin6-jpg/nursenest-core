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
  "epidural-analgesia-rpn": {
    title: "Epidural Analgesia: Labor Pain Management for Practical Nurses",
    cellular: {
      title: "Anatomy of the Epidural Space and Mechanism of Regional Anesthesia",
      content: "The epidural space is a potential space located between the ligamentum flavum and the dura mater within the vertebral canal. It extends from the foramen magnum to the sacral hiatus and contains loose areolar connective tissue, fat, lymphatics, spinal nerve roots, and an extensive venous plexus known as the Batson plexus. The epidural space is accessed most commonly in the lumbar region (L2-L4 or L3-L5) for obstetric analgesia because the spinal cord terminates at L1-L2 (the conus medullaris), reducing the risk of direct cord injury. An epidural catheter is threaded into this space, allowing continuous infusion or intermittent bolus administration of local anesthetic agents and opioids. Local anesthetics such as bupivacaine work by blocking voltage-gated sodium channels in nerve fibers, preventing depolarization and the propagation of pain impulses along sensory nerve roots. Different nerve fiber types have varying susceptibility to local anesthetic blockade: small unmyelinated C-fibers (carrying dull, aching pain) and small myelinated A-delta fibers (carrying sharp pain) are blocked first, followed by sympathetic fibers (causing vasodilation and potential hypotension), then motor fibers (which ideally should be preserved to allow ambulation during labor). This differential blockade is the foundation of modern walking epidurals that use low concentrations of local anesthetic combined with lipophilic opioids such as fentanyl. The opioid component acts on opioid receptors in the dorsal horn of the spinal cord (substantia gelatinosa), providing synergistic analgesia that allows lower local anesthetic doses and better preservation of motor function. Dermatome assessment is essential for evaluating epidural effectiveness: for labor analgesia, the target level is T10-L1 during the first stage of labor (covering uterine contraction pain) and S2-S4 during the second stage (covering perineal stretching and pressure). The practical nurse must understand that the epidural blocks sympathetic nerve fibers in the thoracolumbar region, which can cause significant vasodilation, decreased systemic vascular resistance, and maternal hypotension -- the most common complication of epidural analgesia. Preloading with 500-1000 mL of intravenous crystalloid (typically lactated Ringer solution) before epidural placement helps mitigate this hemodynamic effect. Additionally, the practical nurse must be vigilant for signs of epidural migration (catheter moving into the subarachnoid space causing a total spinal) or intravascular migration (catheter entering a blood vessel causing local anesthetic systemic toxicity)."
    },
    riskFactors: [
      "Coagulopathy or thrombocytopenia (platelet count below 70,000-100,000 increases epidural hematoma risk)",
      "Concurrent anticoagulant therapy (unfractionated heparin, enoxaparin, or warfarin within specified timeframes)",
      "Local or systemic infection (bacteremia increases risk of epidural abscess formation)",
      "Spinal deformities or previous lumbar surgery (altered anatomy, scarring, unpredictable spread)",
      "Severe hypovolemia or hemorrhage (epidural sympathectomy worsens hypotension)",
      "Morbid obesity (technical difficulty with catheter placement, unreliable landmarks)",
      "Increased intracranial pressure (risk of brain herniation with dural puncture)"
    ],
    diagnostics: [
      "Platelet count and coagulation studies (PT/INR, aPTT): must be within acceptable limits before epidural placement; platelet count generally above 70,000-100,000/mcL",
      "Continuous electronic fetal monitoring: required after epidural placement to assess fetal heart rate patterns; watch for late decelerations indicating uteroplacental insufficiency from maternal hypotension",
      "Maternal blood pressure monitoring: measure every 2-5 minutes for the first 20 minutes after initial dose, then every 15 minutes; hypotension defined as systolic BP below 90 mmHg or 20% decrease from baseline",
      "Dermatome level assessment using ice or alcohol swab: test bilateral sensory level every 30-60 minutes; target T10-L1 for first stage labor, S2-S4 for second stage",
      "Motor function assessment using Bromage scale: 0 = full motor function (can raise legs), 1 = unable to raise extended legs, 2 = unable to flex knees, 3 = unable to flex ankles; goal is score 0-1",
      "Temperature monitoring: epidural analgesia is associated with intrapartum maternal fever (thermoregulatory effect from sympathetic blockade); temperature above 38.0 C requires evaluation"
    ],
    management: [
      "Prehydrate with 500-1000 mL IV crystalloid (lactated Ringer solution or normal saline) before epidural placement to expand intravascular volume and prevent hypotension",
      "Position patient in lateral decubitus or sitting position with spine flexed during catheter insertion; maintain sterile technique throughout",
      "Test dose of 3 mL lidocaine 1.5% with epinephrine 1:200,000 to detect intravascular or subarachnoid placement before full dosing",
      "Maintain continuous low-dose infusion (typically bupivacaine 0.0625-0.125% with fentanyl 2 mcg/mL at 8-12 mL/hour) or patient-controlled epidural analgesia (PCEA)",
      "Left uterine displacement (left lateral tilt or manual displacement) to prevent aortocaval compression by the gravid uterus",
      "Treat hypotension immediately: increase IV fluid rate, position in left lateral position, administer ephedrine 5-10 mg IV or phenylephrine 50-100 mcg IV as ordered",
      "Continuous fetal monitoring and regular cervical assessments to track labor progress; epidurals may prolong the second stage of labor"
    ],
    nursingActions: [
      "Obtain informed consent before epidural placement; ensure the patient understands risks, benefits, and alternatives to epidural analgesia",
      "Verify IV access is established and functioning before epidural placement; at least one large-bore (18-gauge) IV catheter is required",
      "Assess and document bilateral sensory level using ice or alcohol swab every 30-60 minutes and after each bolus dose; report asymmetric block or rapidly ascending level",
      "Monitor blood pressure every 2-5 minutes for 20 minutes after initial dose and after each bolus, then every 15 minutes during continuous infusion",
      "Assess motor function using the Bromage scale; report inability to move legs (dense motor block) as this may indicate catheter migration or excessive dosing",
      "Keep the head of bed elevated at least 30 degrees to prevent cephalad migration of anesthetic solution; avoid Trendelenburg position",
      "Assess catheter insertion site for signs of infection (redness, swelling, drainage) and ensure catheter is securely taped and labeled; report any signs of cerebrospinal fluid leak"
    ],
    assessmentFindings: [
      "Effective analgesia: pain relief during contractions with preserved ability to feel pressure (allows effective pushing); pain score reduced from baseline",
      "Expected sympathetic blockade: warm, dry lower extremities due to vasodilation; mild decrease in blood pressure (10-20% from baseline)",
      "Unilateral block: pain relief on only one side indicates catheter malposition; may need repositioning or replacement of catheter",
      "High block (above T4): difficulty breathing, upper extremity numbness, hoarseness, inability to cough effectively -- report immediately",
      "Motor block assessment: ability to lift legs against gravity (normal), difficulty with leg movement (excessive motor block), complete paralysis (catheter migration)",
      "Fetal heart rate patterns: variable or late decelerations after epidural bolus may indicate cord compression or uteroplacental insufficiency from maternal hypotension",
      "Pruritus (itching): common side effect of epidural opioids (fentanyl), affecting face, chest, and arms; mediated by opioid receptors, not histamine release"
    ],
    signs: {
      left: [
        "Adequate pain relief during contractions",
        "Warm lower extremities (expected sympathetic blockade)",
        "Mild decrease in blood pressure (10-20% from baseline)",
        "Slight decrease in sensation to cold/touch in lower abdomen",
        "Pruritus (itching) from opioid component",
        "Mild urinary retention (loss of bladder sensation)"
      ],
      right: [
        "Hypotension (systolic BP below 90 mmHg or 20% decrease from baseline)",
        "High spinal block (numbness above T4, respiratory compromise, difficulty speaking)",
        "Total spinal (loss of consciousness, respiratory arrest, cardiovascular collapse)",
        "Local anesthetic systemic toxicity (perioral numbness, metallic taste, tinnitus, seizures, cardiac arrest)",
        "Epidural hematoma (severe back pain, progressive motor weakness, bowel/bladder dysfunction)",
        "Epidural abscess (fever, severe localized back pain, progressive neurological deficits)"
      ]
    },
    medications: [
      {
        name: "Bupivacaine (Marcaine/Sensorcaine)",
        type: "Long-acting amide local anesthetic",
        action: "Blocks voltage-gated sodium channels in nerve fibers, preventing depolarization and impulse conduction along sensory nerve roots; at low epidural concentrations (0.0625-0.125%), provides differential blockade that preferentially blocks pain fibers while preserving motor function",
        sideEffects: "Hypotension (sympathetic blockade), urinary retention, lower extremity weakness, shivering; at toxic systemic levels: perioral numbness, metallic taste, tinnitus, seizures, ventricular fibrillation, cardiac arrest",
        contra: "Known hypersensitivity to amide local anesthetics; severe hemorrhage or shock (hypotension risk); infection at injection site; coagulopathy",
        pearl: "Bupivacaine has the highest cardiotoxicity of all local anesthetics -- cardiac arrest from bupivacaine is notoriously resistant to standard resuscitation; 20% lipid emulsion (Intralipid) is the antidote for local anesthetic systemic toxicity (LAST) and must be immediately available wherever epidurals are administered"
      },
      {
        name: "Fentanyl (Sublimaze) -- epidural formulation",
        type: "Synthetic opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the substantia gelatinosa of the spinal cord dorsal horn, inhibiting the release of substance P and other pain neurotransmitters; provides synergistic analgesia with local anesthetics, allowing lower bupivacaine concentrations and better motor preservation",
        sideEffects: "Pruritus (most common epidural opioid side effect, up to 60-80%), nausea, urinary retention, sedation, respiratory depression (rare with epidural fentanyl due to high lipophilicity but monitor for delayed respiratory depression)",
        contra: "Known hypersensitivity; respiratory depression; concurrent use of MAO inhibitors within 14 days; use caution with other CNS depressants",
        pearl: "Epidural fentanyl is highly lipophilic, so it acts rapidly (onset 5-10 minutes) with minimal rostral spread in the cerebrospinal fluid, making delayed respiratory depression less likely than with hydrophilic opioids like morphine; pruritus from epidural opioids is NOT caused by histamine release -- it is mediated by central opioid receptors and responds to nalbuphine or low-dose naloxone, not to diphenhydramine"
      },
      {
        name: "Ephedrine",
        type: "Sympathomimetic vasopressor (mixed alpha and beta agonist)",
        action: "Stimulates both alpha-1 adrenergic receptors (causing vasoconstriction and increased systemic vascular resistance) and beta-1 receptors (increasing heart rate and cardiac output); indirectly stimulates norepinephrine release from nerve terminals; restores blood pressure after epidural-induced sympathetic blockade",
        sideEffects: "Tachycardia, hypertension (if overcorrected), palpitations, nausea, vomiting, anxiety, tremor; may cause fetal tachycardia",
        contra: "Severe hypertension; use caution with pre-existing tachycardia or cardiac disease; avoid with MAO inhibitors (hypertensive crisis)",
        pearl: "Ephedrine was traditionally the first-line vasopressor for epidural hypotension in obstetrics because it maintains uteroplacental blood flow; however, phenylephrine (pure alpha-1 agonist) is now increasingly preferred for first-line treatment because ephedrine crosses the placenta more readily and may cause fetal acidosis with repeated doses"
      }
    ],
    pearls: [
      "ALWAYS prehydrate with 500-1000 mL IV fluid BEFORE epidural placement -- this single intervention is the most effective prevention for epidural-induced hypotension.",
      "Assess dermatome level bilaterally using ice or alcohol swab; the target is T10 for first-stage labor pain (uterine contractions) and S2-S4 for second-stage perineal pain (stretching and descent).",
      "If the sensory level rises above T4 (nipple line), immediately notify the anesthesia provider -- this indicates a high block that may compromise respiratory function and represents a potential emergency.",
      "Pruritus from epidural fentanyl is NOT an allergic reaction and does NOT respond to antihistamines like diphenhydramine. It is mediated by central opioid receptors and is treated with nalbuphine 5 mg IV or low-dose naloxone infusion.",
      "The Bromage scale assesses motor block: 0 = no motor block (can lift legs), 1 = unable to raise extended leg, 2 = unable to flex knee, 3 = unable to flex ankle. Goal during labor is 0-1 to allow position changes and pushing.",
      "20% lipid emulsion (Intralipid) must be immediately available wherever epidurals are placed -- it is the specific antidote for local anesthetic systemic toxicity (LAST), which presents as perioral numbness, tinnitus, seizures, and potential cardiac arrest.",
      "Continuous electronic fetal monitoring is MANDATORY after epidural placement. Late decelerations occurring after the epidural bolus suggest maternal hypotension causing decreased uteroplacental perfusion -- treat the hypotension first."
    ],
    quiz: [
      {
        question: "A laboring patient received an epidural bolus 5 minutes ago. Her blood pressure drops from 120/78 to 84/52 mmHg. Which action should the practical nurse take FIRST?",
        options: [
          "Administer ephedrine 10 mg IV push as ordered",
          "Position the patient in left lateral position and increase IV fluid rate",
          "Discontinue the epidural infusion immediately",
          "Prepare for emergency cesarean delivery"
        ],
        correct: 1,
        rationale: "The first action for epidural-induced hypotension is positioning (left lateral to relieve aortocaval compression) and increasing IV fluids. These non-pharmacological interventions are immediate and often effective. Vasopressors are used if positioning and fluids do not restore blood pressure within 1-2 minutes."
      },
      {
        question: "A practical nurse assesses a patient with an epidural and finds the sensory level has risen to T2. The patient reports difficulty breathing and tingling in her hands. What does this indicate?",
        options: [
          "Expected response to epidural analgesia during active labor",
          "Allergic reaction to the local anesthetic requiring epinephrine",
          "High spinal block requiring immediate anesthesia notification",
          "Anxiety-related hyperventilation requiring reassurance"
        ],
        correct: 2,
        rationale: "A sensory level at T2 with respiratory difficulty and upper extremity numbness indicates a high spinal block -- a dangerous complication where the anesthetic has spread too high in the neuraxis. This requires immediate notification of the anesthesia provider, airway management preparation, and hemodynamic support. Left untreated, it can progress to total spinal with respiratory arrest."
      },
      {
        question: "A patient with an epidural reports intense itching on her face and chest. The practical nurse understands that this symptom is caused by which mechanism?",
        options: [
          "Histamine release from mast cell degranulation requiring diphenhydramine",
          "Allergic contact dermatitis from the epidural catheter tape",
          "Central opioid receptor activation in the spinal cord and brainstem",
          "Local anesthetic toxicity requiring lipid emulsion administration"
        ],
        correct: 2,
        rationale: "Pruritus from epidural opioids (fentanyl) is caused by activation of central opioid receptors in the spinal cord and brainstem, NOT by histamine release. This is why antihistamines like diphenhydramine are ineffective. Treatment is with opioid antagonists such as nalbuphine or low-dose naloxone, which reverse the pruritus without significantly affecting analgesia."
      }
    ]
  },

  "encephalitis-basics-rpn": {
    title: "Encephalitis: Brain Inflammation Recognition and Care for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Encephalitis and Brain Inflammation",
      content: "Encephalitis is inflammation of the brain parenchyma, most commonly caused by viral infection but also resulting from autoimmune processes, bacterial infection, or parasitic invasion. The condition differs from meningitis (inflammation of the meninges) in that encephalitis directly involves brain tissue, causing diffuse or focal neurological dysfunction. Herpes simplex virus type 1 (HSV-1) is the most common cause of sporadic (non-epidemic) viral encephalitis in adults and carries a mortality rate of 70% if untreated, making rapid recognition and treatment critical. HSV-1 encephalitis has a particular tropism for the temporal lobes and orbital frontal regions, explaining the characteristic presentation of personality changes, bizarre behavior, olfactory hallucinations, and temporal lobe seizures. The pathophysiology of viral encephalitis involves viral entry into the central nervous system through several routes: hematogenous spread (viremia crossing the blood-brain barrier), retrograde axonal transport along peripheral nerves (HSV travels along the trigeminal nerve from the trigeminal ganglion), or direct extension from adjacent structures. Once within the brain parenchyma, the virus replicates within neurons and glial cells, causing direct cytopathic damage through cell lysis. The host immune response to the infection causes additional injury through inflammatory mediator release, microglial activation, cytokine storm (particularly TNF-alpha, interleukin-1, and interleukin-6), cerebral edema, and increased intracranial pressure. Perivascular cuffing (accumulation of inflammatory cells around blood vessels) and hemorrhagic necrosis are hallmark histopathological findings. Autoimmune encephalitis is an increasingly recognized category in which the immune system produces antibodies against neuronal surface proteins (anti-NMDA receptor antibodies being the most common), causing limbic encephalitis with psychiatric symptoms, seizures, dyskinesias, and autonomic instability. Autoimmune encephalitis often affects younger patients, particularly women, and may be associated with ovarian teratomas. The blood-brain barrier (BBB), composed of tight junctions between brain capillary endothelial cells supported by astrocyte foot processes and pericytes, normally prevents most pathogens from entering the CNS. In encephalitis, inflammatory mediators disrupt the BBB, causing vasogenic edema and allowing further inflammatory cell infiltration. Cytotoxic edema (cellular swelling from failed sodium-potassium ATPase pumps) adds to the intracranial pressure elevation. The practical nurse must understand that the combination of direct viral damage, immune-mediated injury, cerebral edema, and increased intracranial pressure creates a life-threatening cascade requiring prompt recognition and intervention."
    },
    riskFactors: [
      "Immunocompromised state (HIV/AIDS, organ transplant recipients, chemotherapy, chronic corticosteroid use)",
      "Extremes of age (neonates and elderly have immature or declining immune function)",
      "Geographic and seasonal exposure (arboviruses such as West Nile, Eastern Equine transmitted by mosquitoes; tick-borne encephalitis)",
      "History of herpes simplex virus infection (HSV-1 reactivation from trigeminal ganglion is the leading cause of sporadic encephalitis)",
      "Recent viral illness (measles, mumps, varicella, influenza can cause post-infectious autoimmune encephalitis)",
      "Autoimmune conditions or presence of certain tumors (ovarian teratoma associated with anti-NMDA receptor encephalitis)",
      "Living in crowded conditions or institutional settings (increased risk of viral transmission)"
    ],
    diagnostics: [
      "Lumbar puncture with CSF analysis: lymphocytic pleocytosis (elevated white cells, predominantly lymphocytes), elevated protein, normal glucose (viral pattern); red blood cells may be present in HSV encephalitis (hemorrhagic necrosis); opening pressure often elevated",
      "CSF polymerase chain reaction (PCR): gold standard for identifying specific viral etiology; HSV PCR is the definitive diagnostic test for herpes encephalitis with sensitivity above 95%",
      "MRI brain with contrast: imaging modality of choice; HSV encephalitis shows characteristic temporal lobe hyperintensity on T2/FLAIR sequences, often with hemorrhagic changes; autoimmune encephalitis may show limbic system involvement",
      "Electroencephalogram (EEG): shows diffuse slowing in most encephalitis cases; periodic lateralizing epileptiform discharges (PLEDs) in the temporal region are characteristic of HSV encephalitis",
      "CBC with differential: may show lymphocytosis; leukopenia in immunocompromised patients suggests poor prognosis",
      "Serum and CSF antibody panels: anti-NMDA receptor antibodies, anti-LGI1, anti-CASPR2 for autoimmune encephalitis evaluation; viral serologies for arboviral causes"
    ],
    management: [
      "Initiate IV acyclovir immediately when HSV encephalitis is suspected -- do NOT wait for confirmatory testing; treatment delay significantly increases mortality and morbidity",
      "Maintain airway, breathing, and circulation; patients with severely altered consciousness may require intubation and mechanical ventilation",
      "Implement seizure precautions: padded side rails, suction at bedside, oxygen readily available; administer anticonvulsants as ordered",
      "Manage increased intracranial pressure: elevate head of bed 30 degrees, maintain head in neutral alignment, avoid Valsalva maneuvers, administer osmotic diuretics (mannitol) or hypertonic saline as ordered",
      "Maintain normothermia: fever increases cerebral metabolic demand and worsens brain injury; administer antipyretics (acetaminophen) and cooling measures as ordered",
      "Strict neurological assessment using Glasgow Coma Scale every 1-2 hours; report any decline in GCS score immediately",
      "For autoimmune encephalitis: first-line immunotherapy includes IV methylprednisolone, IV immunoglobulin (IVIG), or plasmapheresis; tumor removal if paraneoplastic cause identified"
    ],
    nursingActions: [
      "Perform and document neurological assessments every 1-2 hours including Glasgow Coma Scale, pupil size and reactivity, motor strength, and cranial nerve function",
      "Implement seizure precautions immediately upon admission: pad side rails, maintain suction equipment at bedside, keep airway adjuncts and oxygen readily available",
      "Monitor for signs of increased intracranial pressure: decreasing level of consciousness, new headache or worsening headache, projectile vomiting, pupil changes (unilateral dilation), Cushing triad (hypertension, bradycardia, irregular respirations)",
      "Maintain strict intake and output; monitor for syndrome of inappropriate antidiuretic hormone secretion (SIADH) which is common in encephalitis -- watch for hyponatremia, decreased urine output, and concentrated urine",
      "Maintain a quiet, dimly lit, low-stimulation environment to reduce seizure risk and manage agitation",
      "Monitor IV acyclovir administration: ensure adequate hydration (1 L of normal saline before and during infusion) to prevent crystalluria and acute kidney injury; infuse over 1 hour minimum",
      "Document seizure activity precisely: time of onset, duration, type of movements, body parts involved, level of consciousness during and after, and postictal state"
    ],
    assessmentFindings: [
      "Acute onset of altered mental status: confusion, disorientation, personality changes, behavioral disturbances (especially with temporal lobe involvement in HSV)",
      "Fever: typically high-grade (38.5-40 C) with viral encephalitis; may be absent in immunocompromised patients or autoimmune encephalitis",
      "Seizures: focal or generalized; temporal lobe seizures with HSV encephalitis may manifest as olfactory hallucinations, automatisms (lip smacking, hand wringing), or deja vu experiences",
      "Headache: severe, diffuse, worsening, often accompanied by photophobia and phonophobia",
      "Focal neurological deficits: hemiparesis, dysphasia (difficulty speaking), cranial nerve palsies, ataxia, depending on the brain region involved",
      "Neck stiffness (nuchal rigidity): present when meningeal inflammation accompanies encephalitis (meningoencephalitis)",
      "Signs of increased intracranial pressure: papilledema, altered consciousness, Cushing triad (late and ominous)"
    ],
    signs: {
      left: [
        "Headache with low-grade fever",
        "Malaise and fatigue",
        "Mild confusion or irritability",
        "Photophobia and phonophobia",
        "Nausea and vomiting",
        "Neck stiffness or discomfort"
      ],
      right: [
        "High-grade fever with rapidly deteriorating consciousness",
        "New-onset seizures (focal or generalized)",
        "Focal neurological deficits (hemiparesis, dysphasia, cranial nerve palsies)",
        "Signs of increased intracranial pressure (unilateral pupil dilation, Cushing triad)",
        "Status epilepticus (continuous seizure activity lasting more than 5 minutes)",
        "Respiratory failure requiring emergent intubation"
      ]
    },
    medications: [
      {
        name: "Acyclovir (Zovirax) IV",
        type: "Antiviral agent (nucleoside analog)",
        action: "Selectively activated by viral thymidine kinase in HSV-infected cells, where it is phosphorylated to acyclovir triphosphate; this active metabolite inhibits viral DNA polymerase and is incorporated into the growing viral DNA chain, causing chain termination and halting viral replication; selectivity for infected cells provides a favorable therapeutic index",
        sideEffects: "Nephrotoxicity (crystalline nephropathy from acyclovir crystal deposition in renal tubules), phlebitis at IV site, nausea, headache, tremor, delirium (neurotoxicity, especially with renal impairment), thrombocytopenia",
        contra: "Known hypersensitivity to acyclovir or valacyclovir; dose must be adjusted for renal impairment (creatinine clearance-based dosing); ensure adequate hydration to prevent crystalluria",
        pearl: "IV acyclovir must be started IMMEDIATELY when HSV encephalitis is suspected -- mortality drops from 70% to 20-30% with early treatment; dose is 10 mg/kg IV every 8 hours for 14-21 days; infuse over at least 1 hour with concurrent IV normal saline hydration to prevent nephrotoxicity; monitor BUN and creatinine daily"
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Anticonvulsant (SV2A modulator)",
        action: "Binds to synaptic vesicle protein 2A (SV2A) in the brain, modulating neurotransmitter release and reducing neuronal hyperexcitability; the exact mechanism is not fully understood but involves inhibition of calcium-dependent neurotransmitter release and modulation of synaptic vesicle recycling; broad-spectrum antiseizure activity",
        sideEffects: "Drowsiness, dizziness, behavioral changes (irritability, aggression, mood disturbances -- sometimes called Keppra rage), fatigue, headache, nasopharyngitis",
        contra: "Known hypersensitivity; dose adjustment required in renal impairment; use caution in patients with depression or behavioral disorders",
        pearl: "First-line anticonvulsant in many encephalitis protocols because it has minimal drug interactions, no hepatic metabolism (renally excreted), rapid IV loading capability, and does not require serum level monitoring routinely; monitor for behavioral changes and mood disturbances which may mimic encephalitis symptoms"
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid (glucocorticoid anti-inflammatory)",
        action: "Binds to intracellular glucocorticoid receptors, inhibiting phospholipase A2 and cyclooxygenase-2, reducing prostaglandin and leukotriene synthesis; decreases cerebral edema by stabilizing the blood-brain barrier, reducing capillary permeability, and decreasing inflammatory cell migration into the brain parenchyma; suppresses the pro-inflammatory cytokine cascade",
        sideEffects: "Hyperglycemia (monitor blood glucose every 4-6 hours), immunosuppression (increased infection risk), GI irritation and ulceration, insomnia, mood changes, adrenal suppression with prolonged use, impaired wound healing",
        contra: "Active systemic fungal infections; uncontrolled diabetes (relative); active GI bleeding; use with caution in immunocompromised patients as it may worsen underlying infection",
        pearl: "The role of corticosteroids in viral encephalitis is controversial -- they are NOT routinely recommended for HSV encephalitis as immunosuppression may worsen viral replication; however, dexamethasone is a first-line treatment for autoimmune encephalitis and may be used for severe cerebral edema with impending herniation; always verify the indication before administering"
      }
    ],
    pearls: [
      "HSV encephalitis is the ONE diagnosis where you must start treatment (IV acyclovir) BEFORE confirmatory test results return. Waiting for the CSF PCR result can take 24-48 hours, and each hour of treatment delay significantly increases mortality and permanent neurological damage.",
      "The classic triad of encephalitis is fever, headache, and altered mental status. If a patient presents with these three findings, encephalitis must be considered in the differential diagnosis and urgent investigation initiated.",
      "HSV encephalitis characteristically affects the TEMPORAL LOBES. Clinical clues to temporal lobe involvement include personality changes, bizarre behavior, olfactory hallucinations (smelling strange odors), aphasia, and temporal lobe seizures.",
      "SIADH (syndrome of inappropriate antidiuretic hormone) is a common complication of encephalitis. Monitor serum sodium closely -- hyponatremia (sodium below 135 mEq/L) worsens cerebral edema and lowers the seizure threshold.",
      "Seizure precautions are MANDATORY for all encephalitis patients. Document seizure activity precisely: time of onset, duration, body parts involved, type of movements, and postictal state. Never force anything into the mouth during a seizure.",
      "IV acyclovir is nephrotoxic due to crystal deposition in renal tubules. Maintain adequate hydration (administer concurrent IV normal saline) and monitor BUN and creatinine daily throughout the treatment course.",
      "Distinguish encephalitis from meningitis: encephalitis causes ALTERED MENTAL STATUS and focal neurological deficits (brain involvement), while meningitis primarily causes headache, neck stiffness, and photophobia (meningeal irritation). Both may present with fever, and meningoencephalitis combines features of both."
    ],
    quiz: [
      {
        question: "A patient is admitted with suspected HSV encephalitis. The CSF PCR results will take 24 hours. Which action should the practical nurse anticipate from the medical team?",
        options: [
          "Wait for PCR results before starting any antiviral medication",
          "Start IV acyclovir immediately without waiting for confirmatory results",
          "Administer broad-spectrum antibiotics until the PCR returns",
          "Perform a brain biopsy to confirm the diagnosis before treatment"
        ],
        correct: 1,
        rationale: "IV acyclovir must be started immediately when HSV encephalitis is suspected. The mortality rate of untreated HSV encephalitis is approximately 70%, and delays in treatment significantly worsen outcomes. Treatment should never be delayed while awaiting PCR results."
      },
      {
        question: "A practical nurse is monitoring a patient with encephalitis who develops a serum sodium level of 128 mEq/L with decreased urine output and concentrated urine. Which complication should the nurse suspect?",
        options: [
          "Diabetes insipidus from pituitary damage",
          "Syndrome of inappropriate antidiuretic hormone secretion (SIADH)",
          "Acute renal failure from acyclovir toxicity",
          "Cerebral salt wasting syndrome"
        ],
        correct: 1,
        rationale: "Hyponatremia with decreased urine output and concentrated urine is characteristic of SIADH, which is a common complication of encephalitis. SIADH causes excessive water reabsorption, diluting serum sodium. This differs from cerebral salt wasting (which causes increased urine output) and diabetes insipidus (which causes dilute, high-volume urine)."
      },
      {
        question: "Which assessment finding is MOST characteristic of HSV encephalitis specifically, compared to other forms of viral encephalitis?",
        options: [
          "Generalized headache with neck stiffness",
          "Personality changes, bizarre behavior, and temporal lobe seizures",
          "Symmetric motor weakness affecting all extremities",
          "Rash followed by ascending paralysis"
        ],
        correct: 1,
        rationale: "HSV encephalitis has a characteristic tropism for the temporal lobes, causing personality changes, bizarre behavior, olfactory hallucinations, aphasia, and temporal lobe seizures. These localizing signs help differentiate HSV encephalitis from other viral causes and should prompt immediate empiric acyclovir treatment."
      }
    ]
  },

  "episiotomy-care-rpn": {
    title: "Episiotomy Care and Perineal Assessment for Practical Nurses",
    cellular: {
      title: "Perineal Anatomy and Wound Healing in Episiotomy",
      content: "The perineum is the diamond-shaped region between the pubic symphysis anteriorly, the coccyx posteriorly, and the ischial tuberosities laterally. The obstetric perineum specifically refers to the area between the vaginal introitus and the anus, which is the site of episiotomy incision. The perineal body is a fibromuscular structure at the center of the perineum where several muscles converge: the bulbospongiosus, the superficial and deep transverse perineal muscles, the external anal sphincter, and portions of the levator ani (pubococcygeus). This convergence point gives the perineal body its critical role in pelvic floor support, urinary continence, fecal continence, and sexual function. An episiotomy is a surgical incision through the perineal body performed during the second stage of labor to enlarge the vaginal outlet. Two types are recognized: median (midline) episiotomy, which is cut from the posterior vaginal fourchette directly toward the anus along the midline, and mediolateral episiotomy, which angles 45-60 degrees from the midline toward the ischial tuberosity. Median episiotomies are easier to repair and cause less blood loss and postpartum pain, but carry a significantly higher risk of extension into a third-degree tear (involving the external anal sphincter) or fourth-degree tear (extending through the anal sphincter into the rectal mucosa). Mediolateral episiotomies are more painful and take longer to heal but are less likely to extend into the rectum. Wound healing after episiotomy follows the standard phases of tissue repair. The inflammatory phase (days 0-4) involves hemostasis through platelet aggregation and fibrin clot formation, followed by neutrophil and macrophage infiltration to remove debris and bacteria. The proliferative phase (days 4-21) involves fibroblast migration, collagen deposition, angiogenesis (new blood vessel formation), and granulation tissue formation. The maturation/remodeling phase (day 21 onward, lasting up to 1-2 years) involves collagen cross-linking and reorganization, wound contraction, and gradual strengthening of the repair. Factors that impair perineal wound healing include infection, hematoma formation, poor nutrition (particularly protein and vitamin C deficiency), diabetes mellitus, anemia, and inadequate wound care. The REEDA scale is the standardized assessment tool for perineal wound evaluation: Redness (inflammatory response), Edema (swelling), Ecchymosis (bruising), Discharge (wound drainage), and Approximation (wound edge alignment). Each parameter is scored 0-3, with a total possible score of 15; higher scores indicate more significant tissue trauma and impaired healing. The practical nurse must perform thorough perineal assessments using the REEDA scale and recognize complications including wound infection, dehiscence (wound separation), hematoma formation, and abscess development."
    },
    riskFactors: [
      "Primiparity (first vaginal delivery with less perineal tissue distensibility)",
      "Macrosomia (fetal weight above 4000 grams increasing perineal stretching and tear risk)",
      "Operative vaginal delivery (forceps or vacuum extraction significantly increase episiotomy extension risk)",
      "Precipitous labor (rapid delivery not allowing gradual perineal stretching)",
      "Persistent occiput posterior position (larger fetal head diameter presenting to the perineum)",
      "Short perineal body (distance from vaginal fourchette to anus less than 3 cm)",
      "Previous episiotomy or perineal repair (scar tissue reduces tissue elasticity)"
    ],
    diagnostics: [
      "REEDA scale assessment: systematic evaluation of Redness, Edema, Ecchymosis, Discharge, and Approximation scored 0-3 each; total score of 0-15; assess at minimum every 8-12 hours in the immediate postpartum period",
      "Vital signs with particular attention to temperature: fever above 38.0 C after the first 24 hours postpartum may indicate wound infection, endometritis, or urinary tract infection",
      "Complete blood count (CBC): assess for anemia (hemoglobin below 10 g/dL) which impairs wound healing; elevated WBC may indicate infection",
      "Wound culture: obtain if purulent discharge, foul odor, or signs of wound infection are present; common pathogens include Staphylococcus aureus, Group A Streptococcus, and anaerobes",
      "Rectal examination if third or fourth-degree repair: assess sphincter integrity; report any fecal incontinence or loss of rectal tone",
      "Pain assessment using a validated scale: persistent severe pain disproportionate to the expected postpartum course may indicate hematoma, abscess, or wound dehiscence"
    ],
    management: [
      "Ice packs to the perineum for the first 24 hours: apply for 20 minutes on, 20 minutes off to reduce edema and provide analgesia through vasoconstriction and decreased nerve conduction",
      "Sitz baths starting 24 hours after delivery: warm water (40-43 C) for 15-20 minutes, 3-4 times daily to promote circulation, reduce edema, and enhance wound healing; instruct patient to pat dry thoroughly afterward",
      "Perineal hygiene: teach the patient to cleanse from front to back (anterior to posterior) using a peri-bottle with warm water after each void or bowel movement; change perineal pads frequently (every 2-4 hours)",
      "Pain management: multimodal approach using scheduled acetaminophen and ibuprofen; topical anesthetic sprays (lidocaine) or witch hazel pads (Tucks) for local comfort; avoid aspirin (increased bleeding risk)",
      "Stool softeners (docusate sodium) starting immediately postpartum to prevent constipation and straining, which places excessive pressure on the perineal repair",
      "Kegel exercises (pelvic floor muscle exercises) should begin gently within 24 hours of delivery to promote circulation, reduce edema, and begin pelvic floor rehabilitation",
      "Report wound dehiscence, increasing redness/swelling beyond 48 hours, purulent discharge, foul odor, or fever to the healthcare provider immediately"
    ],
    nursingActions: [
      "Perform REEDA assessment at least every 8-12 hours during the postpartum stay: position patient in lateral (Sims) position with adequate lighting; use a penlight for thorough visualization",
      "Assess lochia (postpartum vaginal discharge) concurrently with perineal assessment: lochia rubra (red, days 1-3), lochia serosa (pinkish-brown, days 4-10), lochia alba (yellowish-white, days 11-21); foul-smelling lochia suggests infection",
      "Monitor pain level and response to analgesia; perineal pain that increases rather than decreases over the first 48-72 hours suggests complication (hematoma, infection, dehiscence)",
      "Apply ice packs in the first 24 hours and transition to sitz baths thereafter; ensure patient understands the timing and rationale for each intervention",
      "Teach proper perineal hygiene: front-to-back cleansing, peri-bottle use, frequent pad changes, handwashing before and after perineal care",
      "Encourage early ambulation to promote circulation and healing; observe the patient during first ambulation for signs of dizziness, orthostatic hypotension, or excessive bleeding",
      "Assess the patient's ability to void: urinary retention is common after epidural analgesia and perineal trauma; catheterize if unable to void within 6-8 hours or if bladder distension is present"
    ],
    assessmentFindings: [
      "Normal healing (first 24-48 hours): mild perineal edema and ecchymosis, moderate pain controlled with analgesics, wound edges well-approximated, no abnormal discharge",
      "Perineal hematoma: unilateral swelling, tense purple/blue discoloration, severe unrelenting pain disproportionate to expected postpartum discomfort, pressure sensation in the rectum or vagina",
      "Wound infection: increasing redness and warmth beyond 48 hours, purulent or foul-smelling discharge, wound edge separation, fever, elevated WBC",
      "Wound dehiscence: separation of wound edges with visible underlying tissue; may be partial (superficial layers) or complete (involving all layers including muscle)",
      "Third-degree extension: involvement of the external anal sphincter; patient may report fecal urgency or incontinence of flatus",
      "Fourth-degree extension: involvement through the rectal mucosa; fecal incontinence, rectal pain, and potential rectovaginal fistula formation"
    ],
    signs: {
      left: [
        "Mild perineal edema in the first 24-48 hours (expected)",
        "Moderate perineal discomfort controlled with standard analgesics",
        "Small ecchymotic areas around the repair site",
        "Scant serous wound drainage",
        "Slight difficulty with initial voiding (perineal swelling)",
        "Lochia rubra transitioning to serosa (normal progression)"
      ],
      right: [
        "Severe unrelenting perineal pain unresponsive to analgesics (hematoma or abscess)",
        "Large tense unilateral perineal swelling with purple discoloration (hematoma)",
        "Purulent discharge with foul odor (wound infection)",
        "Wound edge separation (dehiscence)",
        "Fever above 38.0 C persisting beyond 24 hours postpartum",
        "Fecal incontinence or loss of rectal tone (third or fourth-degree extension)"
      ]
    },
    medications: [
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, blocking prostaglandin synthesis from arachidonic acid; reduces inflammation, pain, and fever; prostaglandins sensitize pain receptors and promote the inflammatory cascade at the wound site",
        sideEffects: "GI irritation (take with food), GI bleeding risk with prolonged use, renal impairment with dehydration, platelet dysfunction (reversible), hypertension exacerbation",
        contra: "Active GI bleeding or peptic ulcer disease; severe renal impairment; third trimester of pregnancy (but SAFE in postpartum period including breastfeeding); concurrent anticoagulant therapy; allergy to aspirin or NSAIDs",
        pearl: "First-line analgesic for postpartum perineal pain when combined with acetaminophen (multimodal approach); safe during breastfeeding as minimal transfer to breast milk; administer 400-800 mg every 6-8 hours with food; also reduces uterine cramping from involution (afterpains), providing dual benefit"
      },
      {
        name: "Lidocaine spray (Dermoplast/topical anesthetic)",
        type: "Topical local anesthetic (amide type)",
        action: "Blocks voltage-gated sodium channels in peripheral sensory nerve endings, preventing depolarization and pain signal transmission from the perineal wound site; provides rapid-onset surface anesthesia without systemic absorption at recommended doses",
        sideEffects: "Local stinging or burning on initial application (brief), contact dermatitis (rare), allergic reaction (rare with amide-type local anesthetics); systemic toxicity extremely unlikely with topical perineal use",
        contra: "Known allergy to amide local anesthetics (lidocaine, bupivacaine, prilocaine); open wounds with exposed deep tissue (apply to intact or healing perineal skin); avoid contact with eyes or mucous membranes beyond the intended area",
        pearl: "Apply to the perineum after sitz bath and before replacing the perineal pad; hold the can 6-12 inches from the perineum and spray in short bursts; the blue can of Dermoplast contains benzocaine (ester type) while the red can contains menthol -- verify which formulation is stocked at your facility; can be used before breastfeeding to reduce discomfort during sitting"
      },
      {
        name: "Docusate sodium (Colace)",
        type: "Stool softener (surfactant laxative)",
        action: "Acts as a surfactant that lowers surface tension at the oil-water interface of the stool, allowing water and fat to penetrate the fecal mass; softens stool to reduce straining during defecation, which protects the perineal repair from excessive pressure and potential dehiscence",
        sideEffects: "Mild abdominal cramping, diarrhea (if dose excessive), nausea, bitter taste (liquid formulations); does NOT cause electrolyte imbalance or dependency like stimulant laxatives",
        contra: "Known hypersensitivity; intestinal obstruction; concurrent use with mineral oil (docusate may enhance absorption of mineral oil); acute abdominal pain of unknown origin",
        pearl: "Start immediately postpartum and continue until the first comfortable bowel movement is achieved; NOT a stimulant laxative -- it softens stool but does not increase peristalsis, so it may take 24-72 hours for effect; encourage concurrent measures: adequate fluid intake (2-3 liters per day), dietary fiber, early ambulation, and prompt response to the urge to defecate"
      }
    ],
    pearls: [
      "REEDA is the gold-standard mnemonic for perineal assessment: Redness, Edema, Ecchymosis, Discharge, Approximation. Each is scored 0-3 for a total of 15. A score increasing over time indicates healing complications.",
      "ICE first, SITZ later: apply ice packs for the first 24 hours to reduce edema and numb pain through vasoconstriction. Transition to warm sitz baths after 24 hours to promote vasodilation, circulation, and wound healing.",
      "Pain that INCREASES rather than decreases after 48 hours is abnormal and suggests a complication. The most dangerous is a perineal hematoma, which presents as severe unilateral swelling, tense purple discoloration, and unrelenting pain. Report immediately.",
      "Median (midline) episiotomies heal faster and cause less pain but have a HIGHER risk of extending into the anal sphincter (third-degree) or rectum (fourth-degree). Mediolateral episiotomies hurt more but protect the sphincter.",
      "Perineal hygiene teaching is critical: always cleanse from front to back to prevent fecal contamination of the wound. Use the peri-bottle with warm water after every void and bowel movement. Pat dry; never rub.",
      "Stool softeners are NOT optional -- they are essential to prevent straining that can disrupt the perineal repair. First postpartum bowel movement is often the patient's greatest anxiety. Reassure that the repair will not come apart with a soft bowel movement.",
      "Kegel exercises can and should begin within 24 hours of delivery. They promote perineal blood flow, reduce edema, and begin the process of restoring pelvic floor muscle tone. Instruct: squeeze as if stopping urine flow, hold 5-10 seconds, release, repeat 10-15 times, 3 times daily."
    ],
    quiz: [
      {
        question: "A practical nurse is performing a perineal assessment using the REEDA scale. The nurse observes moderate edema, slight bruising, wound edges well-approximated, and no discharge. Which parameter has NOT been assessed?",
        options: [
          "Redness",
          "Discharge",
          "Approximation",
          "Ecchymosis"
        ],
        correct: 0,
        rationale: "The REEDA scale consists of five parameters: Redness, Edema, Ecchymosis, Discharge, and Approximation. The nurse assessed edema, ecchymosis (bruising), approximation, and discharge, but did not document an assessment of redness (inflammation) at the wound site. All five parameters must be evaluated for a complete assessment."
      },
      {
        question: "A postpartum patient with a median episiotomy repair reports severe rectal pressure and inability to control flatus starting 12 hours after delivery. The practical nurse should suspect which complication?",
        options: [
          "Normal postpartum perineal discomfort",
          "Extension of the episiotomy involving the anal sphincter",
          "Urinary tract infection from catheterization",
          "Constipation from opioid analgesic use"
        ],
        correct: 1,
        rationale: "Rectal pressure with loss of flatus control after median episiotomy suggests extension into a third-degree tear (involving the external anal sphincter). Median episiotomies have a higher risk of extension compared to mediolateral. This requires immediate assessment by the healthcare provider and possible surgical repair."
      },
      {
        question: "Twenty-four hours after delivery, a patient asks when she can start taking sitz baths for her episiotomy. What is the correct nursing guidance?",
        options: [
          "Sitz baths should begin immediately after delivery and continue throughout recovery",
          "Sitz baths can begin now (at 24 hours); use warm water for 15-20 minutes, 3-4 times daily",
          "Sitz baths should not begin until the wound is fully healed at 6 weeks",
          "Sitz baths should only be taken with ice-cold water to maintain vasoconstriction"
        ],
        correct: 1,
        rationale: "Sitz baths with warm water (40-43 C) begin at 24 hours postpartum, after the initial period of ice application. The warm water promotes vasodilation, increases local blood flow, reduces edema, and promotes wound healing. Duration is 15-20 minutes, 3-4 times daily. The patient should pat dry thoroughly after each sitz bath."
      }
    ]
  },

  "elder-abuse-rpn": {
    title: "Elder Abuse Recognition and Mandatory Reporting for Practical Nurses",
    cellular: {
      title: "Pathophysiology and Psychosocial Framework of Elder Abuse",
      content: "Elder abuse encompasses intentional acts or failures to act by a caregiver or trusted individual that cause harm or create a serious risk of harm to an older adult, typically defined as a person aged 65 years or older. Understanding the biological vulnerability of older adults is essential for recognizing why this population is particularly susceptible to harm from abuse and neglect. Age-related physiological changes include thinning of the epidermis and dermis (reducing the skin's protective function and making bruising easier with less force), decreased subcutaneous fat (reducing cushioning against trauma), osteoporosis (reducing bone density and increasing fracture risk from minimal force), decreased hepatic and renal function (increasing medication sensitivity and toxicity risk), and declining cognitive function (impairing the ability to recognize exploitation or advocate for oneself). The stress-vulnerability model of elder abuse identifies the intersection of caregiver stress (financial pressure, mental health issues, substance abuse, caregiver burnout) with elder vulnerability (cognitive impairment, physical dependence, social isolation, financial resources) as the primary risk framework. Five recognized categories of elder abuse exist. Physical abuse involves the intentional use of physical force that results in bodily injury, pain, or impairment, including hitting, pushing, restraining, force-feeding, or inappropriate use of medications (chemical restraint). Neglect is the failure of a caregiver to fulfill their caregiving obligations, including failure to provide food, water, shelter, clothing, hygiene, medical care, or safety. Financial exploitation is the unauthorized or improper use of an elder's funds, property, or resources, including theft, fraud, forgery, coercion to sign documents, or misuse of power of attorney. Emotional or psychological abuse involves verbal or non-verbal behaviors that cause anguish, fear, or mental distress, including threats, intimidation, humiliation, isolation from family or friends, or controlling behavior. Sexual abuse is any non-consensual sexual contact with an elder, including unwanted touching, forced sexual acts, or sexual contact with a person unable to consent due to cognitive impairment. The pathophysiology of trauma in older adults differs from younger populations in several important ways. The aging vascular system has less elastic vessel walls, making older adults more susceptible to subdural hematomas from relatively minor head trauma. Fractures heal more slowly and with more complications due to decreased osteoblast activity and blood supply. Malnutrition from neglect causes protein-calorie deficiency that impairs immune function (increasing infection susceptibility), delays wound healing, promotes pressure injury formation, and exacerbates cognitive decline. The practical nurse has a legal and ethical obligation as a mandatory reporter to identify suspected elder abuse and report it to appropriate authorities (adult protective services, law enforcement, or the provincial/state reporting agency) regardless of whether the abuse is confirmed. Failure to report is itself a legal violation in all Canadian provinces and most US jurisdictions."
    },
    riskFactors: [
      "Cognitive impairment or dementia (decreased ability to recognize, report, or escape abusive situations)",
      "Physical dependence on caregivers for activities of daily living (creates power imbalance and opportunity for abuse)",
      "Social isolation (lack of outside contacts who might observe signs of abuse; abusers often deliberately isolate victims)",
      "Caregiver substance abuse or mental health disorders (increased impulsivity, decreased coping, financial desperation)",
      "Financial dependence of caregiver on the elder (motivation for financial exploitation; reluctance to lose access to elder's resources)",
      "History of family violence (intergenerational patterns of violence; domestic violence aging into elder abuse)",
      "Institutional care settings with inadequate staffing, training, or oversight (increased neglect risk; decreased individual attention)"
    ],
    diagnostics: [
      "Comprehensive skin assessment: document all bruises, abrasions, lacerations, burns, and pressure injuries with precise location, size, shape, color/stage of healing, and comparison with the explanation provided; use body maps for documentation",
      "Injury pattern analysis: bruises in unusual locations (inner arms, inner thighs, neck, face, trunk) or in various stages of healing suggest repeated trauma; bruises in typical fall locations (shins, forearms, forehead) are more consistent with accidental injury",
      "Nutritional assessment: BMI calculation, serum albumin and prealbumin (malnutrition indicators), skin turgor and mucous membrane assessment, weight history (unintentional weight loss exceeding 5% in one month or 10% in six months suggests neglect)",
      "Cognitive assessment: Mini-Mental State Examination (MMSE) or Montreal Cognitive Assessment (MoCA) to establish baseline cognitive function and capacity for self-report and decision-making",
      "Psychosocial assessment: screen for depression (Geriatric Depression Scale), fear, anxiety; interview the patient ALONE without the caregiver present; ask direct but non-threatening questions about safety",
      "Medication review: assess for signs of over-medication (excessive sedation) or under-medication (pain, uncontrolled chronic conditions); compare medications at home with prescribed medications; check for discrepancies"
    ],
    management: [
      "Ensure immediate safety of the patient: if the patient is in imminent danger, implement emergency protective measures including contacting security, law enforcement, or arranging emergency placement",
      "Separate the patient from the suspected abuser for assessment: conduct the interview privately; explain that private interviews are standard practice to avoid alerting the potential abuser",
      "Report suspected abuse to the designated authority immediately: adult protective services (community), facility administrator and regulatory body (institutional), and/or law enforcement if criminal activity is suspected",
      "Document findings objectively and thoroughly: use direct quotes from the patient (in quotation marks), describe injuries using clinical terminology, photograph injuries with patient consent and per facility policy, avoid interpretive language",
      "Provide medical treatment for injuries: wound care, pain management, nutritional support, treatment of untreated medical conditions discovered during assessment",
      "Develop a safety plan: if the patient is returning to the same environment, ensure follow-up services are arranged (home care, social work, community resources, adult day programs)",
      "Consult social work, geriatric assessment team, and any required multidisciplinary team members for comprehensive evaluation and care planning"
    ],
    nursingActions: [
      "Perform thorough head-to-toe physical assessment with particular attention to areas typically covered by clothing: inner arms, chest, abdomen, back, buttocks, inner thighs, and genital area",
      "Assess for and document injuries inconsistent with the reported mechanism: bilateral bruising (grabbing pattern), loop marks (cord/belt), patterned burns (cigarette, iron), fractures inconsistent with stated falls",
      "Interview the patient alone in a safe, private environment; ask open-ended questions such as 'Tell me about how you are being cared for at home' and 'Has anyone hurt you or made you afraid?'",
      "Compare the patient's account of injuries with the caregiver's account: inconsistent or changing explanations are red flags for abuse",
      "Assess the patient-caregiver interaction: observe for signs of fear, withdrawal, or deference; note if the caregiver answers for the patient, prevents the patient from speaking alone, or displays hostility or controlling behavior",
      "Document all findings using objective clinical language: write 'Patient states: [direct quote]' rather than 'Patient was abused'; describe injuries precisely (size in centimeters, color, location, shape)",
      "File the mandatory report to the appropriate authority per institutional policy and provincial/state law; document that the report was made, to whom, date, time, and reference number"
    ],
    assessmentFindings: [
      "Physical abuse indicators: bruises in various stages of healing, bruises in unusual locations (inner arms, thighs, neck), bilateral bruising (grab marks), patterned injuries (belt marks, hand prints), unexplained fractures, burns, or lacerations",
      "Neglect indicators: poor hygiene (soiled clothing, body odor, overgrown nails), malnutrition (emaciation, sunken eyes, temporal wasting), dehydration (poor skin turgor, dry mucous membranes), untreated medical conditions, pressure injuries, unchanged dressings",
      "Financial exploitation indicators: inability to pay for medications or basic necessities despite known financial resources, sudden changes in banking or financial documents, unexpected transfer of assets, caregiver controlling all finances",
      "Emotional abuse indicators: withdrawal, depression, anxiety, fearfulness in the presence of caregiver, poor eye contact, ambivalence or reluctance to speak openly, agitation, insomnia, unexplained behavioral changes",
      "Sexual abuse indicators: bruising or bleeding in genital/anal area, torn or stained undergarments, new-onset urinary tract infections or sexually transmitted infections, fearfulness around personal care",
      "Caregiver warning signs: substance impairment during visits, hostility toward patient or staff, refusal to allow private patient interviews, contradictory explanations for patient injuries, failure to follow up on medical recommendations"
    ],
    signs: {
      left: [
        "Unexplained bruises, particularly in areas normally covered by clothing",
        "Poor hygiene or uncharacteristic self-care decline",
        "Weight loss or signs of dehydration",
        "Withdrawal, anxiety, or depressive symptoms",
        "Non-adherence to medications without clear reason",
        "Reluctance to speak openly in the presence of caregiver"
      ],
      right: [
        "Multiple fractures in different stages of healing (skeletal survey)",
        "Patterned burns or injuries (cigarette, iron, restraint marks)",
        "Severe malnutrition or dehydration requiring emergency intervention",
        "Genital or rectal trauma suggesting sexual abuse",
        "Acute danger or threats of harm from caregiver",
        "Patient expressing fear for their safety or requesting help"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamus (fever reduction) and modulating the descending serotonergic pain inhibitory pathway; the precise mechanism differs from NSAIDs in that it has minimal peripheral anti-inflammatory activity",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (most common cause of acute liver failure in North America), nausea, rash (rare); chronic use may increase INR in patients on warfarin",
        contra: "Severe hepatic impairment or active liver disease; alcohol use disorder (increased hepatotoxicity risk); maximum dose reduced to 2 grams per day in patients with liver disease or chronic alcohol use; check all combination products for acetaminophen content",
        pearl: "First-line analgesic for elderly patients because it lacks the GI bleeding, renal, and cardiovascular risks of NSAIDs; maximum daily dose is 3-4 grams in healthy older adults but often reduced to 2-3 grams for safety; assess ALL medications for hidden acetaminophen content (cold preparations, combination opioid products) to prevent inadvertent overdose"
      },
      {
        name: "Sertraline (Zoloft)",
        type: "Selective serotonin reuptake inhibitor (SSRI) antidepressant",
        action: "Selectively inhibits the reuptake of serotonin (5-HT) at the presynaptic neuronal membrane by blocking the serotonin transporter (SERT), increasing serotonin availability in the synaptic cleft; this enhanced serotonergic transmission gradually restores mood regulation, reduces anxiety, and improves emotional resilience over 2-6 weeks of consistent use",
        sideEffects: "Nausea (most common early side effect), diarrhea, insomnia or somnolence, sexual dysfunction (decreased libido, delayed orgasm), headache, dizziness; increased risk of hyponatremia (SIADH) in elderly patients; may increase bleeding risk especially when combined with NSAIDs or anticoagulants",
        contra: "Concurrent use with MAO inhibitors (risk of serotonin syndrome -- potentially fatal; 14-day washout required); concurrent use with pimozide; caution with other serotonergic drugs (tramadol, triptans, linezolid); monitor for suicidal ideation in the first weeks of treatment",
        pearl: "First-line SSRI for elderly patients due to fewer drug interactions than other SSRIs; start at a low dose (25 mg daily) and titrate slowly in elderly patients (start low, go slow); therapeutic effects take 2-6 weeks; monitor serum sodium in elderly patients as SSRI-induced hyponatremia (SIADH) is more common in this population; may be prescribed for depression, PTSD, or anxiety related to abuse"
      },
      {
        name: "Lorazepam (Ativan)",
        type: "Benzodiazepine anxiolytic",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor by binding to the benzodiazepine site on the receptor complex, increasing the frequency of chloride channel opening; this increases chloride influx into neurons, causing hyperpolarization and reduced neuronal excitability, producing anxiolytic, sedative, muscle relaxant, and anticonvulsant effects",
        sideEffects: "Sedation, dizziness, confusion, respiratory depression, paradoxical agitation (more common in elderly), anterograde amnesia, falls risk (major concern in elderly), physical dependence and withdrawal with prolonged use, cognitive impairment",
        contra: "Severe respiratory insufficiency; acute narrow-angle glaucoma; sleep apnea; concurrent use with opioids (additive respiratory depression); Beers Criteria lists benzodiazepines as potentially inappropriate in older adults due to fall risk and cognitive impairment",
        pearl: "Should be used only for SHORT-TERM acute anxiety management in elder abuse situations, NOT as maintenance therapy; benzodiazepines are on the Beers Criteria list for potentially inappropriate medications in older adults due to increased risk of falls, fractures, cognitive impairment, and delirium; if used, start with 0.5 mg and monitor closely for excessive sedation; taper gradually if discontinuing (never stop abruptly after regular use due to withdrawal seizure risk)"
      }
    ],
    pearls: [
      "Mandatory reporting laws require healthcare professionals, including practical nurses, to report SUSPECTED elder abuse. You do NOT need to confirm abuse before reporting -- reasonable suspicion based on assessment findings is sufficient and required by law.",
      "Always interview the patient ALONE, away from the suspected abuser. Frame the private conversation as routine practice ('We speak with all patients privately as part of our standard assessment'). The caregiver should not be present during assessment questioning.",
      "Document findings OBJECTIVELY. Write exactly what you observe and what the patient says in direct quotes. Do NOT write interpretive statements like 'patient was abused' -- instead write 'Patient states: My son hits me when I ask for my medications.' This objective documentation is legally defensible.",
      "Injuries in various stages of healing suggest repeated trauma over time. Bruise color progression: red/purple (0-2 days), blue/dark purple (2-5 days), green (5-7 days), yellow/brown (7-14 days). Multiple colors on the same patient raise significant concern.",
      "Bruise location matters: accidental falls typically cause bruises on shins, forearms, and forehead (bony prominences). Bruises on inner arms, inner thighs, trunk, neck, or face are in locations protected from accidental injury and suggest inflicted trauma.",
      "Financial exploitation is the MOST COMMON form of elder abuse but the LEAST reported. Warning signs include inability to afford medications or necessities despite known income, unexplained changes in financial documents, and a new 'friend' or caregiver who accompanies the elder to financial institutions.",
      "Neglect is distinguished from self-neglect. Neglect requires a responsible caregiver who fails to provide care. Self-neglect occurs when an elder living independently cannot or will not care for themselves. Both warrant intervention, but the reporting pathways and interventions differ."
    ],
    quiz: [
      {
        question: "During a home health visit, a practical nurse notices an elderly patient has bruises on both inner upper arms in the shape of finger marks, and the patient appears fearful when the caregiver enters the room. What is the nurse's FIRST priority?",
        options: [
          "Document the findings and report at the end of the shift",
          "Confront the caregiver about the suspicious bruising",
          "Ensure patient safety and arrange a private assessment away from the caregiver",
          "Contact the family physician to request a cognitive assessment"
        ],
        correct: 2,
        rationale: "The first priority is patient safety. The nurse must ensure the patient is safe and conduct a private assessment away from the suspected abuser. Confronting the caregiver could escalate the situation and endanger the patient. Documentation and reporting are essential but come after ensuring immediate safety."
      },
      {
        question: "A practical nurse suspects that an elderly resident in long-term care is being financially exploited by a family member. The nurse is unsure whether the suspicion is accurate. What is the correct course of action?",
        options: [
          "Wait until there is definitive proof before making a report",
          "Report the suspicion to adult protective services as required by mandatory reporting laws",
          "Discuss the concern with the family member first to clarify the situation",
          "Document the concern in the patient chart and monitor for additional evidence"
        ],
        correct: 1,
        rationale: "Mandatory reporting laws require healthcare professionals to report SUSPECTED elder abuse. The nurse does not need to confirm or prove abuse before reporting -- reasonable suspicion is sufficient and reporting is legally required. Waiting for proof, discussing with the suspected abuser, or simply documenting without reporting violates mandatory reporting obligations."
      },
      {
        question: "Which documentation approach is MOST appropriate when a practical nurse suspects elder abuse?",
        options: [
          "Write 'Patient is a victim of elder abuse by her son' in the nursing notes",
          "Record 'Two bruises on left inner arm, each approximately 3 cm diameter, purple-green in color. Patient states: My son grabbed my arm when I would not give him money'",
          "Document 'Possible abuse -- will continue to monitor situation and reassess next shift'",
          "Avoid documenting findings to protect the patient's privacy and family reputation"
        ],
        correct: 1,
        rationale: "Proper documentation of suspected elder abuse uses objective clinical descriptions with precise measurements, locations, and colors, combined with direct patient quotes in quotation marks. Interpretive statements ('victim of abuse') are not appropriate. Delaying documentation or avoiding documentation violates professional and legal obligations."
      }
    ]
  },

  "discharge-planning-rpn": {
    title: "Discharge Planning and Transition of Care for Practical Nurses",
    cellular: {
      title: "Physiological and Psychosocial Foundations of Safe Discharge",
      content: "Discharge planning is a systematic, interdisciplinary process that begins at the time of admission and ensures that patients are prepared for a safe transition from one level of care to another. The physiological basis for comprehensive discharge planning lies in understanding that patients recovering from acute illness or surgical intervention remain in a vulnerable physiological state at the time of hospital discharge. The stress response to illness activates the hypothalamic-pituitary-adrenal (HPA) axis, releasing cortisol and catecholamines that alter glucose metabolism, suppress immune function, and impair wound healing. These physiological effects persist beyond the acute hospital stay, making the post-discharge period a high-risk time for complications, medication errors, and hospital readmission. Research demonstrates that approximately 20% of patients discharged from hospital are readmitted within 30 days, and nearly 50% of these readmissions are considered preventable with adequate discharge planning. The most common reasons for preventable readmission include medication errors (patients taking incorrect doses, missing medications, or failing to fill prescriptions), inadequate understanding of warning signs requiring medical attention, premature discharge before physiological stability is achieved, and failure to establish follow-up appointments. Medication reconciliation is a patient safety process that involves comparing the medications a patient was taking before admission with those prescribed at discharge to identify and resolve discrepancies. Discrepancies include unintentional omissions (home medications not restarted), duplications (same medication class prescribed twice), interactions between new and home medications, and dosage changes that the patient does not understand. The teach-back method is an evidence-based communication strategy that confirms patient understanding by asking the patient to explain, in their own words, what they have been taught. Unlike simply asking 'Do you understand?' (which elicits a reflexive yes), the teach-back approach asks the patient to demonstrate comprehension: 'I want to make sure I explained this clearly. Can you tell me in your own words how you will take this new medication?' Health literacy, which is the ability to obtain, process, and understand basic health information, is a critical factor in discharge planning. Approximately 36% of adults have limited health literacy, meaning they may not be able to read medication labels, follow written discharge instructions, or understand when to seek emergency care. The practical nurse must assess health literacy without embarrassment to the patient and tailor education accordingly, using plain language, visual aids, and demonstration. Psychosocial assessment is equally important: patients discharged to unsafe home environments, those without adequate social support, those with untreated mental health conditions, and those with financial barriers to obtaining medications or follow-up care are at highest risk for adverse outcomes. The practical nurse plays a critical role in identifying these barriers and communicating them to the discharge planning team."
    },
    riskFactors: [
      "Multiple chronic comorbidities (heart failure, COPD, diabetes -- complex medication regimens and self-management requirements)",
      "Polypharmacy (5 or more medications -- increased risk of drug interactions, non-adherence, and adverse drug events)",
      "Cognitive impairment or dementia (decreased ability to understand and follow discharge instructions)",
      "Limited health literacy (inability to read medication labels, understand written instructions, or interpret warning signs)",
      "Inadequate social support or living alone (no caregiver to assist with medication management, wound care, or recognizing deterioration)",
      "Previous hospital readmission within 30 days (strong predictor of future readmission)",
      "Financial barriers (inability to afford medications, transportation to follow-up appointments, or required home care services)"
    ],
    diagnostics: [
      "Discharge readiness assessment: evaluate physical stability (vital signs within acceptable parameters, pain controlled, adequate oral intake, mobility appropriate for discharge destination), cognitive function, and emotional readiness",
      "Medication reconciliation: systematic comparison of pre-admission medication list, in-hospital medications, and discharge prescriptions to identify discrepancies (omissions, duplications, interactions, dose changes)",
      "Health literacy screening: assess ability to read medication labels, understand numerical dosing (time, frequency, quantity), and comprehend written discharge instructions; use validated screening tools when available",
      "Functional assessment: evaluate ability to perform activities of daily living (ADLs) and instrumental activities of daily living (IADLs) that will be required at the discharge destination; identify gaps requiring home care or rehabilitation",
      "Social support assessment: identify primary caregiver, assess caregiver capability and willingness, evaluate home environment safety, assess transportation availability for follow-up appointments",
      "Fall risk assessment: evaluate for ongoing fall risk factors (gait instability, orthostatic hypotension, new medications causing dizziness, environmental hazards at home) and implement prevention strategies"
    ],
    management: [
      "Begin discharge planning on admission: identify anticipated discharge needs, barriers, and required services as early as possible to allow adequate time for arrangement",
      "Conduct medication reconciliation with the patient using a current medication list: review each medication's name, purpose, dose, frequency, route, and special instructions; ensure prescriptions are written and pharmacy access is confirmed",
      "Use the teach-back method for ALL discharge education: have the patient or caregiver explain back key information in their own words; reteach any information that is not correctly stated back",
      "Schedule follow-up appointments BEFORE discharge: provide written appointment details including date, time, location, provider name, and purpose of the visit; arrange transportation if needed",
      "Provide written discharge instructions in plain language at the appropriate reading level (aim for 5th-6th grade level); include warning signs that require returning to the emergency department",
      "Arrange home care services as needed: home nursing visits, personal support worker assistance, physiotherapy, occupational therapy, meal delivery, medical equipment (walker, hospital bed, oxygen)",
      "Coordinate with community resources: pharmacy (medication delivery if homebound), community nursing, social services, support groups, chronic disease management programs"
    ],
    nursingActions: [
      "Perform a comprehensive medication reconciliation review with the patient at least 24 hours before anticipated discharge to identify and resolve discrepancies",
      "Educate the patient and family using the teach-back method: cover each medication (name, purpose, dose, timing, side effects to report), wound care procedures if applicable, activity restrictions, dietary modifications, and follow-up appointments",
      "Assess and document the patient's ability to demonstrate required self-care skills: medication self-administration, blood glucose monitoring, wound care, use of medical devices (inhalers, oxygen equipment)",
      "Provide clear written instructions for warning signs requiring immediate medical attention: specific symptoms for their condition that warrant calling the healthcare provider or going to the emergency department",
      "Confirm that the patient has a means to obtain discharge medications: prescription availability, pharmacy location, insurance coverage, ability to pay; arrange bedside medication delivery or discharge prescriptions when possible",
      "Complete discharge documentation including all education provided, patient/caregiver understanding verified through teach-back, referrals made, appointments scheduled, and any outstanding concerns",
      "Conduct a final safety check before the patient leaves: patient has all personal belongings, discharge instructions in hand, prescriptions or medications, follow-up appointment information, and knows who to call with questions"
    ],
    assessmentFindings: [
      "Discharge readiness: stable vital signs for 24 hours, pain controlled with oral medications, adequate oral intake and output, independent mobility at pre-admission level or appropriate assistive devices in place, demonstrated understanding of discharge instructions",
      "Barriers to safe discharge: inability to state medication names and purposes (health literacy gap), no identified caregiver for required home care, unsafe home environment (stairs with no railing for patient with mobility impairment), financial inability to fill prescriptions",
      "Medication discrepancies: home medication not restarted at discharge, duplicate medications from different prescribers, new hospital medication with interaction potential against home medication, changed dosages without patient awareness",
      "Knowledge deficits: inability to demonstrate teach-back for key instructions, confusion about when to take medications, unfamiliarity with warning signs, unrealistic expectations about recovery timeline",
      "Caregiver readiness: caregiver demonstrates ability to perform required care (wound dressing changes, medication administration), identifies warning signs to report, has contact information for healthcare providers and emergency services",
      "Psychosocial concerns: patient anxiety about leaving the hospital, lack of confidence in self-care ability, depression or hopelessness, caregiver burden or burnout"
    ],
    signs: {
      left: [
        "Minor knowledge gaps correctable with additional teaching",
        "Mild anxiety about discharge (normal and expected)",
        "Minor medication reconciliation discrepancies easily resolved",
        "Need for basic home care services (can be arranged before discharge)",
        "Patient requests for additional education or written materials",
        "Minor functional limitations with available compensatory strategies"
      ],
      right: [
        "Patient or caregiver unable to demonstrate critical self-care skills despite repeated teaching",
        "Unsafe discharge environment with no feasible alternative arrangement",
        "Patient expresses fear of returning home due to safety concerns (abuse, caregiver inability)",
        "Unresolved complex medication discrepancies with high-risk medications (anticoagulants, insulin, opioids)",
        "Hemodynamic instability or uncontrolled symptoms at planned discharge time",
        "Patient or family refusing discharge despite medical clearance (requires social work and ethics involvement)"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Oral anticoagulant (vitamin K antagonist)",
        action: "Inhibits vitamin K epoxide reductase (VKORC1) enzyme in the liver, preventing the recycling of vitamin K and blocking the synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and anticoagulant proteins C and S; therapeutic effect takes 3-5 days to achieve because existing clotting factors must be depleted through normal turnover",
        sideEffects: "Bleeding (most serious -- gingival bleeding, nosebleeds, hematuria, melena, intracranial hemorrhage), skin necrosis (rare, related to protein C depletion in first few days), purple toe syndrome, teratogenicity",
        contra: "Active major bleeding; recent surgery on the CNS or eye; pregnancy (crosses placenta, teratogenic); unsupervised patients with history of non-adherence; severe hepatic disease; uncontrolled hypertension",
        pearl: "Discharge teaching for warfarin is CRITICAL and one of the most important discharge education topics: consistent vitamin K intake (do not suddenly increase or decrease green leafy vegetables), regular INR monitoring (target usually 2.0-3.0), avoid alcohol, report any unusual bleeding, carry medical identification, inform all healthcare providers and dentists, review ALL new medications and supplements for interactions; warfarin has more drug-food-herb interactions than almost any other medication"
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide oral antihyperglycemic",
        action: "Decreases hepatic glucose production (gluconeogenesis), increases insulin sensitivity in peripheral tissues (skeletal muscle), and reduces intestinal glucose absorption; does NOT stimulate insulin secretion from pancreatic beta cells, so it does not cause hypoglycemia when used as monotherapy; also has modest beneficial effects on lipid profile and weight",
        sideEffects: "GI effects (nausea, diarrhea, abdominal bloating, metallic taste -- most common, often dose-related and improve with time), lactic acidosis (rare but life-threatening, associated with renal impairment, hepatic impairment, or tissue hypoxia), vitamin B12 deficiency with long-term use",
        contra: "Estimated GFR below 30 mL/min (risk of lactic acidosis from metformin accumulation); acute or chronic metabolic acidosis; hold for 48 hours before and after iodinated contrast procedures; severe hepatic impairment; conditions predisposing to tissue hypoxia (acute heart failure, respiratory failure, sepsis)",
        pearl: "Common discharge teaching medication; instruct patient to take with meals to reduce GI side effects; tell patient to hold metformin if unable to eat or drink, if severely dehydrated, or before contrast imaging procedures; does NOT cause hypoglycemia as monotherapy but CAN cause hypoglycemia when combined with insulin or sulfonylureas; monitor renal function annually"
      },
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "Angiotensin-converting enzyme (ACE) inhibitor",
        action: "Inhibits angiotensin-converting enzyme (ACE), preventing the conversion of angiotensin I to angiotensin II (a potent vasoconstrictor); this reduces systemic vascular resistance, decreases aldosterone secretion (reducing sodium and water retention), reduces cardiac preload and afterload, and slows cardiac remodeling; also inhibits bradykinin breakdown, which contributes to vasodilation but may cause persistent dry cough",
        sideEffects: "Persistent dry cough (most common reason for discontinuation, caused by bradykinin accumulation in the lungs), hyperkalemia (reduced aldosterone-mediated potassium excretion), hypotension (especially first dose), dizziness, angioedema (rare but life-threatening -- swelling of face, lips, tongue, throat), acute kidney injury (especially in bilateral renal artery stenosis)",
        contra: "History of angioedema with ACE inhibitor use; bilateral renal artery stenosis; pregnancy (teratogenic -- causes fetal renal agenesis); concurrent use with aliskiren in diabetic patients; serum potassium above 5.5 mEq/L",
        pearl: "Essential discharge teaching: instruct patients to report persistent dry cough (may need switch to ARB), report any swelling of face/lips/tongue immediately (angioedema emergency), avoid potassium supplements and potassium-rich salt substitutes unless directed, take at the same time daily, rise slowly from sitting to standing (orthostatic hypotension), and understand that this medication protects the heart and kidneys long-term even if blood pressure feels fine"
      }
    ],
    pearls: [
      "Discharge planning begins at ADMISSION, not the day of discharge. Identifying barriers early (no caregiver at home, inability to afford medications, need for home oxygen) allows time to arrange solutions before the discharge date.",
      "The teach-back method is the GOLD STANDARD for verifying patient understanding. Never ask 'Do you understand?' (patients will say yes even when confused). Instead say: 'I want to make sure I explained this clearly. Can you tell me in your own words when you should take your warfarin and what foods you should be careful about?'",
      "Medication reconciliation must compare THREE lists: (1) what the patient was taking at home before admission, (2) what was prescribed during hospitalization, and (3) what is prescribed at discharge. Discrepancies between these lists are the leading cause of preventable post-discharge adverse drug events.",
      "Follow-up appointments should be scheduled BEFORE the patient leaves the hospital, not just recommended. Patients who leave with a specific date, time, and location for follow-up are significantly more likely to attend. Write it on the discharge instructions and call to confirm if possible.",
      "High-risk medications requiring intensive discharge teaching include anticoagulants (warfarin, DOACs), insulin, opioids, and drugs with narrow therapeutic indices (digoxin, lithium, phenytoin). These medications are involved in the majority of post-discharge adverse drug events.",
      "Assess health literacy WITHOUT embarrassing the patient. Many patients with limited literacy have developed strategies to hide it. Look for clues: forms left blank, excuses about forgotten glasses, bringing a family member to read materials. Use plain language, pictures, and demonstration rather than relying on written handouts alone.",
      "The 30-day readmission rate is a quality indicator that hospitals are measured on and that directly impacts reimbursement. The practical nurse's discharge planning actions -- thorough medication reconciliation, effective teach-back education, and appropriate referral to community services -- directly reduce preventable readmissions."
    ],
    quiz: [
      {
        question: "A practical nurse is providing discharge education to a patient prescribed warfarin. Using the teach-back method, which approach best verifies patient understanding?",
        options: [
          "Ask the patient 'Do you understand how to take your warfarin?' and document the response",
          "Provide a written pamphlet about warfarin and tell the patient to read it at home",
          "Ask the patient to explain in their own words when they will take the medication and what foods they need to be consistent about",
          "Have the patient sign a form acknowledging they received discharge instructions"
        ],
        correct: 2,
        rationale: "The teach-back method requires the patient to explain or demonstrate their understanding in their own words. Simply asking 'Do you understand?' (closed-ended question) does not verify comprehension. Written materials and signed forms do not confirm that the patient actually understands the information."
      },
      {
        question: "During medication reconciliation, a practical nurse discovers that a patient's home medication (atenolol 50 mg daily) was not included on the discharge prescription list. What is the correct action?",
        options: [
          "Assume the physician intentionally discontinued the medication and proceed with discharge",
          "Tell the patient to continue taking atenolol from their home supply without notifying the physician",
          "Flag the discrepancy and notify the prescribing physician to clarify whether atenolol should be continued, changed, or intentionally discontinued",
          "Document the finding and plan to follow up at the next clinic visit in 2 weeks"
        ],
        correct: 2,
        rationale: "Any discrepancy found during medication reconciliation must be clarified with the prescribing physician before discharge. Assuming intentional discontinuation or telling the patient to self-manage could result in a dangerous omission (abruptly stopping a beta-blocker can cause rebound hypertension and tachycardia). This must be resolved before the patient leaves."
      },
      {
        question: "A patient scheduled for discharge tomorrow cannot name any of their medications and states they will 'figure it out when I get home.' The practical nurse should take which action?",
        options: [
          "Proceed with discharge since the patient has the right to manage their own medications",
          "Delay discharge until the patient can pass a written medication quiz",
          "Reassess the teaching approach, reteach using simple language and visual aids, and arrange additional support (home nursing, pharmacy counseling)",
          "Call the family to come manage the patient's medications without the patient's involvement"
        ],
        correct: 2,
        rationale: "When teach-back reveals a significant knowledge deficit, the nurse must reassess and modify the teaching approach -- this may include using simpler language, visual aids, color-coded pill organizers, and arranging additional support services. Simply proceeding with discharge without addressing the gap creates a high risk for medication errors and readmission."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count}/${Object.keys(lessons).length} lessons injected.`);
