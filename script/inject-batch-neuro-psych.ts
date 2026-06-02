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
  "meningitis-basics-rpn": {
    title: "Meningitis Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Meningitis",
      content: "Meningitis is an acute inflammation of the meninges, the three-layered protective membranes (dura mater, arachnoid mater, and pia mater) that surround the brain and spinal cord. The subarachnoid space between the arachnoid and pia mater contains cerebrospinal fluid (CSF), which cushions the central nervous system and serves as a medium for nutrient transport and waste removal. Infectious organisms reach the meninges through several routes: hematogenous spread (most common), direct extension from adjacent infections (sinusitis, otitis media, mastoiditis), or direct inoculation through trauma or neurosurgical procedures. Bacterial meningitis is the most clinically dangerous form, with Neisseria meningitidis (meningococcus) and Streptococcus pneumoniae (pneumococcus) being the most common causative organisms in adults, while Group B Streptococcus and Escherichia coli predominate in neonates. Once bacteria cross the blood-brain barrier, they multiply rapidly in the CSF because this fluid lacks significant immune defenses such as complement proteins and immunoglobulins. The bacterial cell wall components trigger a massive inflammatory cascade, releasing cytokines (interleukin-1, tumor necrosis factor) that increase blood-brain barrier permeability, leading to vasogenic cerebral edema. Exudate accumulates in the subarachnoid space, obstructing CSF flow through the arachnoid villi and cerebral aqueduct, resulting in communicating or obstructive hydrocephalus and increased intracranial pressure. Viral meningitis (aseptic meningitis), most commonly caused by enteroviruses, is generally self-limiting with a more favorable prognosis. Viral pathogens cause lymphocytic infiltration of the meninges without the purulent exudate characteristic of bacterial infection. Fungal meningitis, caused by organisms such as Cryptococcus neoformans, occurs primarily in immunocompromised patients and follows an insidious, chronic course. The classic triad of meningitis includes severe headache, fever, and nuchal rigidity (neck stiffness), though this complete triad is present in fewer than half of patients. Two critical physical examination signs aid in clinical assessment: Brudzinski sign (involuntary flexion of the hips and knees when the neck is passively flexed) and Kernig sign (resistance or pain with passive extension of the knee when the hip is flexed to 90 degrees). Both signs indicate meningeal irritation. Lumbar puncture with CSF analysis is the definitive diagnostic procedure. In bacterial meningitis, CSF findings typically show elevated opening pressure, cloudy or turbulent appearance, markedly elevated white blood cell count with neutrophil predominance, elevated protein, and decreased glucose (less than 40 mg/dL or less than 40 percent of serum glucose). Viral meningitis CSF shows clear fluid, lymphocyte predominance, mildly elevated protein, and normal glucose. The practical nurse must recognize that bacterial meningitis is a medical emergency requiring immediate antibiotic administration -- treatment should never be delayed while awaiting diagnostic confirmation. Complications of bacterial meningitis include cerebral edema, seizures, cranial nerve damage (particularly hearing loss from cranial nerve VIII involvement), cerebral infarction from vasculitis, disseminated intravascular coagulation (DIC), and Waterhouse-Friderichsen syndrome (adrenal hemorrhage associated with meningococcal septicemia). Droplet precautions must be initiated immediately for suspected meningococcal meningitis, and close contacts require chemoprophylaxis with rifampin, ciprofloxacin, or ceftriaxone within 24 hours of exposure."
    },
    riskFactors: [
      "Extremes of age (neonates and adults over 60 have the highest incidence and mortality)",
      "Immunocompromised state (HIV/AIDS, asplenia, complement deficiency, immunosuppressive therapy)",
      "Close-quarter living environments (dormitories, military barracks, correctional facilities)",
      "Lack of vaccination (meningococcal, pneumococcal, Haemophilus influenzae type b vaccines)",
      "Recent head trauma or neurosurgical procedure (direct inoculation route)",
      "Adjacent infections (sinusitis, otitis media, mastoiditis providing contiguous spread)",
      "Cochlear implants (increased risk of pneumococcal meningitis)"
    ],
    diagnostics: [
      "Lumbar puncture with CSF analysis: definitive diagnostic test; opening pressure, cell count with differential, protein, glucose, Gram stain, culture; bacterial CSF shows cloudy fluid, elevated WBC with neutrophil predominance, elevated protein, decreased glucose",
      "Blood cultures: obtain two sets from different sites BEFORE starting antibiotics; positive in 50-80% of bacterial meningitis cases",
      "Complete blood count (CBC): elevated WBC with left shift (bandemia) in bacterial meningitis; may show thrombocytopenia if DIC develops",
      "C-reactive protein (CRP) and procalcitonin: markedly elevated in bacterial meningitis; helps distinguish bacterial from viral etiology",
      "CT scan of the head: performed BEFORE lumbar puncture in patients with altered consciousness, focal neurological deficits, papilledema, or seizures to rule out space-occupying lesion that could cause herniation",
      "Serum lactate and coagulation studies: elevated lactate indicates tissue hypoperfusion; prolonged PT/INR and elevated D-dimer suggest DIC"
    ],
    management: [
      "Administer empiric IV antibiotics immediately as ordered -- do NOT delay treatment for diagnostic results; every hour of delay increases mortality",
      "Maintain droplet precautions for suspected meningococcal meningitis until 24 hours of effective antibiotic therapy is completed",
      "Elevate head of bed 30-45 degrees to promote venous drainage and reduce intracranial pressure",
      "Maintain a dim, quiet environment to minimize stimulation (photophobia and headache are common)",
      "Monitor neurological status using Glasgow Coma Scale every 1-2 hours during acute phase",
      "Administer IV fluids as ordered; monitor for signs of syndrome of inappropriate antidiuretic hormone (SIADH) including hyponatremia and decreased urine output",
      "Administer dexamethasone as ordered (given 15-20 minutes before or with the first antibiotic dose to reduce inflammation and neurological sequelae)"
    ],
    nursingActions: [
      "Initiate droplet precautions immediately upon suspicion of meningococcal meningitis -- surgical mask within 3 feet of patient, private room",
      "Monitor vital signs every 1-2 hours including temperature trends; report fever unresponsive to antipyretics",
      "Assess neurological status frequently: level of consciousness, pupil size and reactivity, cranial nerve function, motor strength",
      "Monitor for signs of increased intracranial pressure: decreasing level of consciousness, widening pulse pressure, bradycardia, irregular respirations (Cushing triad)",
      "Maintain accurate intake and output; report urine output less than 30 mL/hour or signs of fluid overload",
      "Implement seizure precautions: padded side rails up, suction at bedside, oxygen equipment readily available",
      "Coordinate notification of public health authorities and identify close contacts requiring chemoprophylaxis"
    ],
    assessmentFindings: [
      "Classic triad: severe headache (often described as the worst headache of life), high fever, and nuchal rigidity (neck stiffness with resistance to flexion)",
      "Brudzinski sign positive: passive neck flexion causes involuntary hip and knee flexion, indicating meningeal irritation",
      "Kernig sign positive: resistance or pain when attempting to extend the knee with hip flexed to 90 degrees",
      "Photophobia (light sensitivity) and phonophobia (sound sensitivity) are common and may be severe",
      "Petechial or purpuric rash: characteristic of meningococcal meningitis (Neisseria meningitidis); may rapidly progress to purpura fulminans",
      "Altered level of consciousness ranging from confusion and irritability to obtundation and coma",
      "Nausea, vomiting, and seizures (particularly in children and severe cases)"
    ],
    signs: {
      left: [
        "Fever with headache and general malaise",
        "Mild neck stiffness or pain with flexion",
        "Photophobia and irritability",
        "Nausea and decreased appetite",
        "Myalgia and fatigue",
        "Mild confusion or difficulty concentrating"
      ],
      right: [
        "Rapidly progressing altered level of consciousness or coma",
        "Petechial rash progressing to purpura fulminans",
        "Seizure activity (new onset or recurrent)",
        "Signs of increased intracranial pressure (Cushing triad: hypertension, bradycardia, irregular breathing)",
        "Signs of septic shock (hypotension, tachycardia, mottled skin, poor capillary refill)",
        "Bulging fontanelle in infants or opisthotonos (severe arched posturing)"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-generation cephalosporin antibiotic",
        action: "Binds to penicillin-binding proteins on bacterial cell walls, inhibiting cell wall synthesis and causing bacterial lysis; achieves excellent CSF penetration through inflamed meninges, making it first-line empiric therapy for community-acquired bacterial meningitis",
        sideEffects: "Diarrhea, nausea, rash, injection site pain, biliary sludging (pseudolithiasis), elevated liver enzymes, Clostridioides difficile-associated diarrhea",
        contra: "Known anaphylaxis to cephalosporins; neonates with hyperbilirubinemia (ceftriaxone displaces bilirubin from albumin); do NOT mix with calcium-containing IV solutions in neonates",
        pearl: "Standard meningitis dose is 2g IV every 12 hours in adults; given in combination with vancomycin for empiric coverage until culture and sensitivity results confirm susceptibility; crosses inflamed blood-brain barrier effectively"
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to D-alanyl-D-alanine terminus of peptidoglycan precursors, preventing cross-linking; added to empiric meningitis regimens to cover penicillin-resistant Streptococcus pneumoniae strains",
        sideEffects: "Red man syndrome (histamine-mediated flushing and hypotension from rapid infusion), nephrotoxicity, ototoxicity, thrombocytopenia, phlebitis at IV site",
        contra: "Known hypersensitivity; use with caution in renal impairment (dose adjustment required based on trough levels and renal function)",
        pearl: "Infuse over at least 60 minutes to prevent red man syndrome; monitor trough levels (goal 15-20 mcg/mL for meningitis); requires renal dose adjustment; may need intrathecal administration if IV penetration is inadequate"
      },
      {
        name: "Dexamethasone",
        type: "Corticosteroid (anti-inflammatory)",
        action: "Suppresses the inflammatory cascade by inhibiting phospholipase A2 and reducing production of prostaglandins, leukotrienes, and pro-inflammatory cytokines; reduces cerebral edema and blood-brain barrier permeability; decreases risk of neurological complications, particularly sensorineural hearing loss",
        sideEffects: "Hyperglycemia, GI irritation, immunosuppression, delayed wound healing, adrenal suppression with prolonged use, hypertension",
        contra: "Active systemic fungal infection; known hypersensitivity; viral meningitis (no benefit and may worsen outcome); use with caution in diabetes mellitus",
        pearl: "Must be given 15-20 minutes BEFORE or simultaneously with the first dose of antibiotics to be effective; typical regimen is 0.15 mg/kg IV every 6 hours for 4 days; primarily beneficial for pneumococcal meningitis to reduce hearing loss risk"
      }
    ],
    pearls: [
      "Bacterial meningitis is a TIME-CRITICAL emergency -- every hour of antibiotic delay increases mortality by approximately 3-7%; never wait for lumbar puncture or CT results to start antibiotics if meningitis is strongly suspected",
      "Brudzinski sign is tested by passively flexing the neck while the patient is supine -- positive if the hips and knees flex involuntarily; Kernig sign is tested by flexing the hip to 90 degrees then attempting to extend the knee -- positive if extension causes pain or resistance",
      "Droplet precautions are required for meningococcal meningitis -- surgical mask within 3 feet, private room; precautions can be discontinued after 24 hours of effective antibiotic therapy",
      "Close contacts of meningococcal meningitis cases require chemoprophylaxis within 24 hours: rifampin 600 mg PO every 12 hours for 2 days, ciprofloxacin 500 mg PO single dose, or ceftriaxone 250 mg IM single dose",
      "CT scan is required BEFORE lumbar puncture only in specific situations: altered consciousness, focal neurological deficits, papilledema, recent seizure, or immunocompromised state -- do NOT delay antibiotics while waiting for CT",
      "Petechial rash in a febrile patient should be treated as meningococcal meningitis until proven otherwise -- this rash can progress to purpura fulminans (widespread hemorrhagic necrosis) within hours",
      "Monitor for SIADH (syndrome of inappropriate antidiuretic hormone), a common complication of meningitis, by tracking fluid balance, daily weights, and serum sodium levels -- hyponatremia with concentrated urine suggests SIADH"
    ],
    quiz: [
      {
        question: "A patient is admitted with suspected bacterial meningitis. Which nursing action takes the HIGHEST priority?",
        options: [
          "Obtain a CT scan of the head before any treatment",
          "Administer IV antibiotics immediately as ordered",
          "Perform a lumbar puncture to confirm the diagnosis",
          "Place the patient in airborne isolation precautions"
        ],
        correct: 1,
        rationale: "In suspected bacterial meningitis, administering IV antibiotics immediately is the highest priority because every hour of delay increases mortality. While CT scan and lumbar puncture are important diagnostics, they should never delay antibiotic administration. Meningococcal meningitis requires droplet precautions (not airborne)."
      },
      {
        question: "The practical nurse is assessing a patient with meningitis. The nurse passively flexes the patient's neck and observes the patient's hips and knees flex involuntarily. Which finding does this represent?",
        options: [
          "Kernig sign",
          "Brudzinski sign",
          "Babinski sign",
          "Trousseau sign"
        ],
        correct: 1,
        rationale: "Brudzinski sign is positive when passive neck flexion causes involuntary flexion of the hips and knees, indicating meningeal irritation. Kernig sign involves resistance to knee extension with the hip flexed at 90 degrees. Babinski sign tests upper motor neuron function. Trousseau sign tests for hypocalcemia."
      },
      {
        question: "A patient diagnosed with meningococcal meningitis is being cared for on a medical unit. Which type of isolation precaution should the practical nurse implement?",
        options: [
          "Airborne precautions with N95 respirator",
          "Contact precautions with gown and gloves",
          "Droplet precautions with surgical mask",
          "Standard precautions only"
        ],
        correct: 2,
        rationale: "Meningococcal meningitis (Neisseria meningitidis) is transmitted via respiratory droplets and requires droplet precautions including a surgical mask when within 3 feet of the patient and placement in a private room. Droplet precautions can be discontinued after 24 hours of effective antibiotic therapy. Airborne precautions are not required."
      }
    ]
  },

  "mental-health-rpn": {
    title: "Mental Health Nursing for Practical Nurses",
    cellular: {
      title: "Neurobiology and Foundations of Mental Health",
      content: "Mental health exists on a continuum that ranges from optimal psychological well-being to severe mental illness, with most individuals moving along this spectrum throughout their lives in response to biological, psychological, social, and environmental factors. The neurobiological basis of mental health involves the complex interplay of neurotransmitter systems, neural circuits, neuroendocrine pathways, and genetic predispositions. The major neurotransmitters implicated in mental health disorders include serotonin (5-HT), which regulates mood, sleep, appetite, and impulse control; norepinephrine, which modulates alertness, concentration, and the stress response; dopamine, which influences motivation, reward, pleasure, and motor function; gamma-aminobutyric acid (GABA), the primary inhibitory neurotransmitter that reduces neuronal excitability and anxiety; and glutamate, the primary excitatory neurotransmitter. Depression is associated with decreased serotonin and norepinephrine activity in the prefrontal cortex and limbic system. Anxiety disorders involve dysregulation of the GABA system and hyperactivity of the amygdala, the brain structure responsible for fear processing and emotional memory. Psychotic disorders such as schizophrenia involve excess dopamine activity in the mesolimbic pathway (causing positive symptoms like hallucinations and delusions) and decreased dopamine activity in the mesocortical pathway (causing negative symptoms like flat affect and avolition). The hypothalamic-pituitary-adrenal (HPA) axis plays a central role in the stress response, with chronic stress leading to sustained cortisol elevation that can damage hippocampal neurons, impair memory, and increase vulnerability to depression and anxiety disorders. Therapeutic communication is the cornerstone of mental health nursing and involves purposeful, goal-directed interaction techniques including active listening, open-ended questions, reflection, clarification, and therapeutic silence. Non-therapeutic techniques that must be avoided include giving advice, changing the subject, offering false reassurance, asking why questions (which can sound judgmental), and expressing approval or disapproval. Crisis intervention follows a structured framework: assess safety (self-harm, harm to others), establish rapport, identify the precipitating event, explore coping mechanisms, develop a safety plan, and connect to ongoing support. The practical nurse must be competent in suicide risk assessment, recognizing both modifiable risk factors (current substance use, access to lethal means, social isolation, untreated mental illness) and non-modifiable risk factors (previous suicide attempt, family history of suicide, male sex, advanced age). Protective factors include social connectedness, access to mental health care, problem-solving skills, cultural or religious beliefs against suicide, and having dependents. The Columbia Suicide Severity Rating Scale (C-SSRS) is a widely used evidence-based tool that assesses suicidal ideation severity, intensity, and behavior. Involuntary psychiatric admission (Form 1 in Ontario, equivalent forms in other jurisdictions) can be initiated when a person meets specific criteria: imminent danger to self or others, inability to care for self due to mental disorder, and refusal of voluntary admission. The practical nurse must understand the legal and ethical framework governing involuntary detention, patient rights, and the duty to report."
    },
    riskFactors: [
      "Previous mental health disorder or prior psychiatric hospitalization (strongest predictor of recurrence)",
      "Family history of mental illness or suicide (genetic predisposition accounts for 40-60% of risk for major depression)",
      "Adverse childhood experiences (abuse, neglect, household dysfunction increase lifetime mental illness risk)",
      "Chronic medical conditions (diabetes, cardiovascular disease, chronic pain significantly increase depression risk)",
      "Substance use disorders (co-occurring in approximately 50% of individuals with serious mental illness)",
      "Social isolation, unemployment, homelessness, or recent significant loss (bereavement, divorce, job loss)",
      "Trauma exposure including intimate partner violence, sexual assault, military combat, or refugee experiences"
    ],
    diagnostics: [
      "Patient Health Questionnaire-9 (PHQ-9): validated 9-item screening tool for depression severity; scores 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe depression",
      "Generalized Anxiety Disorder-7 (GAD-7): validated 7-item screening tool for anxiety severity; scores 5-9 mild, 10-14 moderate, 15-21 severe anxiety",
      "Columbia Suicide Severity Rating Scale (C-SSRS): evidence-based tool assessing suicidal ideation (passive vs. active, with or without plan/intent) and suicidal behavior (attempts, interrupted attempts, aborted attempts, preparatory behavior)",
      "Mini-Mental State Examination (MMSE) or Montreal Cognitive Assessment (MoCA): screens for cognitive impairment; helps differentiate delirium, dementia, and depression (the 3 Ds)",
      "Toxicology screen (urine drug screen): identifies substance use contributing to or complicating mental health presentation; essential in emergency psychiatric assessment",
      "Thyroid function tests (TSH, free T4): hypothyroidism mimics depression; hyperthyroidism mimics anxiety and mania; must be ruled out before psychiatric diagnosis"
    ],
    management: [
      "Maintain therapeutic milieu: a structured, safe, predictable environment with consistent boundaries, clear expectations, and reduced stimulation during acute episodes",
      "Implement one-to-one observation for patients at imminent risk of self-harm or harm to others as ordered; maintain continuous visual contact and document every 15 minutes or per facility protocol",
      "Administer psychotropic medications as prescribed; monitor for therapeutic response and adverse effects; reinforce medication adherence teaching",
      "Support participation in structured therapeutic activities: group therapy, psychoeducation, occupational therapy, recreational therapy as appropriate to patient level of function",
      "Develop and review safety plans collaboratively with patients: identify warning signs, coping strategies, support contacts, emergency resources, and means restriction",
      "Facilitate family education and involvement in treatment planning when appropriate and consented to by the patient",
      "Coordinate discharge planning including outpatient follow-up appointments, medication reconciliation, community resources, and crisis contact information"
    ],
    nursingActions: [
      "Establish therapeutic rapport using active listening, empathy, genuineness, and unconditional positive regard -- avoid giving advice, using cliches, or offering false reassurance",
      "Perform systematic suicide risk assessment on admission and with any change in clinical status using validated tools (C-SSRS); report active suicidal ideation with plan or intent immediately",
      "Monitor for medication side effects: serotonin syndrome (agitation, hyperthermia, clonus, diaphoresis), extrapyramidal symptoms (dystonia, akathisia, tardive dyskinesia), neuroleptic malignant syndrome (muscle rigidity, hyperthermia, altered consciousness, autonomic instability)",
      "Maintain environmental safety: remove sharps, cords, belts, plastic bags, glass items, and any objects that could be used for self-harm; check belongings on admission per facility protocol",
      "Document mental status observations objectively using behavioral descriptions rather than interpretive labels (write what was observed, not interpretations)",
      "Implement de-escalation techniques for agitated patients: use calm, low-volume voice; offer choices; maintain safe distance; avoid cornering; minimize audience; set clear limits with consequences",
      "Monitor for and report serotonin syndrome symptoms: hyperthermia, agitation, myoclonus (muscle jerking), hyperreflexia, diaphoresis, tremor, diarrhea -- this is a medical emergency"
    ],
    assessmentFindings: [
      "Depression indicators: persistent sad or empty mood, anhedonia (loss of interest or pleasure), sleep disturbances (insomnia or hypersomnia), appetite changes, psychomotor retardation or agitation, fatigue, feelings of worthlessness or excessive guilt, difficulty concentrating, recurrent thoughts of death",
      "Anxiety indicators: excessive worry, restlessness, muscle tension, difficulty concentrating, irritability, sleep disturbance, tachycardia, diaphoresis, trembling, shortness of breath, GI distress",
      "Psychosis indicators: hallucinations (auditory most common, followed by visual), delusions (fixed false beliefs -- paranoid, grandiose, somatic, persecutory), disorganized speech (loose associations, tangentiality, word salad), disorganized or catatonic behavior",
      "Mania indicators: elevated or irritable mood, decreased need for sleep, pressured speech, flight of ideas, grandiosity, increased goal-directed activity, distractibility, excessive involvement in risky behaviors",
      "Suicidal risk indicators: expressing hopelessness, giving away possessions, sudden calmness after depression, social withdrawal, acquiring means, writing a will or suicide note, verbalizing desire to die or be a burden",
      "Substance withdrawal indicators: tremors, diaphoresis, tachycardia, hypertension, nausea, vomiting, seizures (alcohol/benzodiazepine), agitation, psychomotor disturbances"
    ],
    signs: {
      left: [
        "Mild anxiety or worry reported by patient",
        "Sleep disturbance or appetite changes",
        "Social withdrawal or decreased activity level",
        "Mild mood changes or irritability",
        "Difficulty concentrating or making decisions",
        "Vague somatic complaints (headache, fatigue, muscle tension)"
      ],
      right: [
        "Active suicidal ideation with plan, intent, and access to means",
        "Command auditory hallucinations directing self-harm or harm to others",
        "Severe psychomotor agitation with potential for violence",
        "Serotonin syndrome (hyperthermia, clonus, altered mental status, diaphoresis)",
        "Neuroleptic malignant syndrome (extreme muscle rigidity, hyperthermia, autonomic instability)",
        "Acute intoxication or withdrawal with vital sign instability (seizure risk)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective serotonin reuptake inhibitor (SSRI) antidepressant",
        action: "Selectively blocks the reuptake of serotonin at the presynaptic neuronal membrane, increasing serotonin availability in the synaptic cleft; this enhances serotonergic neurotransmission and improves mood, anxiety, and impulse regulation over time with consistent dosing",
        sideEffects: "Nausea, diarrhea, headache, insomnia or drowsiness, sexual dysfunction (decreased libido, anorgasmia), weight changes, increased sweating, dry mouth; initial worsening of anxiety may occur in first 1-2 weeks",
        contra: "Concurrent use with MAOIs (risk of serotonin syndrome -- must wait 14 days between discontinuing an MAOI and starting sertraline); concurrent use with pimozide; caution with other serotonergic drugs",
        pearl: "Therapeutic effects take 4-6 weeks to fully develop -- patients must be counseled about this delay; monitor for increased suicidal ideation during the first 4-8 weeks especially in adolescents and young adults; taper gradually when discontinuing to avoid SSRI discontinuation syndrome (dizziness, nausea, irritability, paresthesias)"
      },
      {
        name: "Lorazepam (Ativan)",
        type: "Benzodiazepine anxiolytic and sedative",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) by binding to benzodiazepine receptors on GABA-A receptor complexes, increasing chloride ion conductance and neuronal inhibition; produces rapid anxiolytic, sedative, muscle relaxant, and anticonvulsant effects",
        sideEffects: "Sedation, drowsiness, dizziness, respiratory depression, cognitive impairment, paradoxical agitation (especially in elderly), anterograde amnesia, physical dependence with prolonged use",
        contra: "Severe respiratory insufficiency, acute narrow-angle glaucoma, sleep apnea, concurrent use with opioids (additive respiratory depression); pregnancy (teratogenic risk); use with extreme caution in elderly patients (increased fall risk)",
        pearl: "Intended for short-term use only (2-4 weeks) due to tolerance and dependence risk; never discontinue abruptly after prolonged use as benzodiazepine withdrawal can cause seizures and death; IM injection should use deltoid muscle for better absorption; monitor respiratory rate (hold if less than 12 breaths per minute)"
      },
      {
        name: "Quetiapine (Seroquel)",
        type: "Second-generation (atypical) antipsychotic",
        action: "Antagonizes multiple neurotransmitter receptors including dopamine D2 receptors (primarily in mesolimbic pathway, reducing psychotic symptoms), serotonin 5-HT2A receptors (improving negative symptoms and reducing EPS risk), histamine H1 receptors (causing sedation), and alpha-1 adrenergic receptors (causing orthostatic hypotension); used for schizophrenia, bipolar disorder, and as adjunct for treatment-resistant depression",
        sideEffects: "Significant sedation and somnolence, weight gain, metabolic syndrome (hyperglycemia, dyslipidemia), orthostatic hypotension (especially during dose titration), dry mouth, constipation, dizziness, QTc prolongation",
        contra: "Known hypersensitivity; concurrent use with strong CYP3A4 inhibitors; use with caution in patients with diabetes, cardiovascular disease, hepatic impairment, or elderly patients with dementia-related psychosis (increased mortality risk)",
        pearl: "Monitor fasting glucose, lipid panel, weight, and waist circumference at baseline and periodically during treatment due to metabolic syndrome risk; educate patient to rise slowly from sitting or lying position due to orthostatic hypotension; lower doses (25-100 mg) used for insomnia and anxiety, higher doses (300-800 mg) for psychosis"
      }
    ],
    pearls: [
      "Therapeutic communication requires the nurse to use open-ended questions, active listening, reflection, and therapeutic silence -- avoid asking WHY questions (sound judgmental), giving advice, offering false reassurance, or changing the subject",
      "Serotonin syndrome is a medical emergency caused by excessive serotonergic activity; symptoms include hyperthermia, agitation, clonus (especially lower extremity), hyperreflexia, diaphoresis, tremor, and diarrhea; onset is typically within 24 hours of medication change",
      "When assessing suicide risk, directly asking about suicidal thoughts does NOT increase risk -- it opens communication; use clear, direct language such as: Are you thinking about hurting yourself? Do you have a plan?",
      "SSRIs can paradoxically increase suicidal ideation in the first 4-8 weeks of treatment because energy and motivation improve before mood does -- increased monitoring is essential during this period",
      "Never leave a suicidal patient alone; maintain one-to-one observation as ordered; remove all potential means of self-harm from the environment including sharps, cords, belts, and plastic bags",
      "De-escalation is always the first intervention for an agitated patient before considering chemical or physical restraint; use a calm, low voice, offer choices, maintain safe distance, and set clear limits",
      "Neuroleptic malignant syndrome (NMS) is a rare but life-threatening reaction to antipsychotic medications characterized by extreme muscle rigidity (lead pipe), hyperthermia (greater than 40 degrees C), altered mental status, and autonomic instability -- stop the antipsychotic immediately and notify the physician"
    ],
    quiz: [
      {
        question: "A patient on sertraline for 3 weeks reports feeling more energetic but still hopeless. The practical nurse recognizes this finding requires which priority action?",
        options: [
          "Reassure the patient that the medication is working as expected",
          "Increase suicide risk monitoring because energy returns before mood improves",
          "Suggest the physician change the medication to a different class",
          "Discontinue the medication immediately due to treatment failure"
        ],
        correct: 1,
        rationale: "During the first 4-8 weeks of SSRI therapy, energy and motivation often improve before mood does. This means a patient may have improved energy to act on suicidal thoughts while still feeling hopeless. Increased monitoring for suicidal ideation is essential during this critical period."
      },
      {
        question: "A patient taking quetiapine becomes acutely rigid with a temperature of 40.5 degrees Celsius, altered consciousness, and diaphoresis. Which condition should the practical nurse suspect?",
        options: [
          "Serotonin syndrome",
          "Malignant hyperthermia",
          "Neuroleptic malignant syndrome",
          "Extrapyramidal side effects"
        ],
        correct: 2,
        rationale: "Neuroleptic malignant syndrome (NMS) is a life-threatening adverse reaction to antipsychotic medications (such as quetiapine) characterized by extreme muscle rigidity, hyperthermia (often greater than 40 degrees C), altered mental status, and autonomic instability. The medication must be stopped immediately and this is a medical emergency requiring immediate physician notification."
      },
      {
        question: "Which therapeutic communication technique should the practical nurse use when a patient expresses feeling like a burden to their family?",
        options: [
          "Tell the patient that their family does not feel that way",
          "Advise the patient to focus on positive aspects of their life",
          "Reflect the feeling back by saying: You feel like you are a burden to your family. Can you tell me more about that?",
          "Change the subject to distract the patient from negative thoughts"
        ],
        correct: 2,
        rationale: "Reflection is a therapeutic communication technique that involves restating the patient's feelings to demonstrate understanding and encourage further exploration. Telling the patient how their family feels is false reassurance, giving advice is non-therapeutic, and changing the subject is a communication blocker."
      }
    ]
  },

  "mental-status-rpn": {
    title: "Mental Status Assessment for Practical Nurses",
    cellular: {
      title: "Neurological Foundations of Mental Status Assessment",
      content: "Mental status assessment is a systematic evaluation of a patient's cognitive, behavioral, and emotional functioning that provides critical baseline data and enables early detection of neurological and psychiatric changes. The mental status examination (MSE) evaluates brain function across multiple domains, each corresponding to specific neuroanatomical structures. The cerebral cortex, particularly the prefrontal cortex, is responsible for executive functions including judgment, insight, abstract thinking, and impulse control. The temporal lobes house Wernicke area (receptive language comprehension) and are critical for memory formation through the hippocampus. Broca area in the frontal lobe controls expressive language production. The reticular activating system (RAS) in the brainstem maintains wakefulness and arousal, and damage to this system results in altered levels of consciousness. The limbic system, including the amygdala and hypothalamus, regulates emotional responses, motivation, and autonomic nervous system activity. The Glasgow Coma Scale (GCS) is the most widely used standardized tool for assessing level of consciousness, particularly in acute care settings. It evaluates three components: eye opening (scored 1-4), verbal response (scored 1-5), and motor response (scored 1-6), with a maximum score of 15 (fully conscious and oriented) and a minimum score of 3 (deep coma). A GCS of 8 or less indicates severe brain injury and typically requires intubation for airway protection. Orientation assessment evaluates the patient's awareness of four spheres: person (who they are), place (where they are), time (date, day, year), and situation (why they are here). Orientation is lost in a predictable pattern: time is lost first, then place, then situation, and finally person (which indicates severe cognitive impairment). The Mini-Mental State Examination (MMSE) is a 30-point standardized screening tool that assesses orientation, registration, attention and calculation, recall, and language. A score of 24-30 indicates normal cognition, 18-23 suggests mild cognitive impairment, and below 18 indicates severe cognitive impairment. The Montreal Cognitive Assessment (MoCA) is a more sensitive alternative that better detects mild cognitive impairment and assesses additional domains including visuospatial ability and executive function. The complete mental status examination includes evaluation of appearance (grooming, hygiene, dress, nutritional status), behavior (psychomotor activity, eye contact, cooperation), speech (rate, rhythm, volume, articulation), mood (patient's subjective emotional state) and affect (objective emotional expression observed by the examiner), thought process (logical, coherent, goal-directed versus disorganized, tangential, circumstantial), thought content (delusions, obsessions, suicidal or homicidal ideation), perceptual disturbances (hallucinations, illusions), cognition (orientation, attention, memory, calculation), insight (understanding of illness), and judgment (ability to make appropriate decisions). The practical nurse must differentiate between delirium (acute onset, fluctuating course, usually reversible, often caused by medical conditions), dementia (gradual onset, progressive decline, usually irreversible), and depression (can mimic cognitive impairment, potentially reversible with treatment). This distinction is clinically critical because delirium is a medical emergency that requires identification and treatment of the underlying cause. Accurate documentation of mental status findings requires objective, behavioral descriptions rather than subjective interpretations. For example, document that the patient was talking to someone who was not present rather than labeling the patient as hallucinating."
    },
    riskFactors: [
      "Advanced age (increased risk of delirium, dementia, and depression -- the 3 Ds of geriatric mental status changes)",
      "Polypharmacy and medication interactions (anticholinergics, sedatives, and opioids are common offenders for altered mental status)",
      "Acute infection or metabolic disturbance (urinary tract infections are a leading cause of acute confusion in elderly patients)",
      "History of stroke, traumatic brain injury, or neurodegenerative disease (Alzheimer disease, Parkinson disease)",
      "Sensory deficits (hearing loss and visual impairment can be mistaken for cognitive impairment if not accommodated during assessment)",
      "Substance use or withdrawal (alcohol withdrawal can cause delirium tremens; opioid and benzodiazepine use alters cognition)",
      "Sleep deprivation, pain, and ICU environment (major contributors to hospital-acquired delirium)"
    ],
    diagnostics: [
      "Glasgow Coma Scale (GCS): standardized 3-15 point scale assessing eye opening (1-4), verbal response (1-5), and motor response (1-6); score of 8 or less indicates severe impairment requiring airway protection",
      "Mini-Mental State Examination (MMSE): 30-point screening tool for cognitive function; assesses orientation, registration, attention, recall, and language; score below 24 suggests cognitive impairment",
      "Montreal Cognitive Assessment (MoCA): 30-point tool more sensitive than MMSE for mild cognitive impairment; includes visuospatial, executive function, and clock drawing tasks; score below 26 suggests impairment",
      "Confusion Assessment Method (CAM): validated screening tool for delirium; positive when acute onset with fluctuating course PLUS inattention PLUS either disorganized thinking or altered level of consciousness",
      "Complete metabolic panel and CBC: identifies reversible causes of altered mental status (electrolyte imbalances, hypoglycemia, renal failure, hepatic encephalopathy, infection)",
      "CT or MRI of the brain: indicated for new-onset altered mental status to rule out stroke, hemorrhage, mass lesion, or hydrocephalus"
    ],
    management: [
      "Identify and treat underlying cause of mental status changes -- delirium is always a medical emergency until proven otherwise",
      "Reorient patient frequently: use clock, calendar, and familiar objects; explain procedures before performing them; maintain consistent caregivers when possible",
      "Optimize sensory input: ensure hearing aids are in place and functioning, glasses are clean and available, adequate lighting is provided, and background noise is minimized",
      "Maintain sleep-wake cycle: provide daytime activity and natural light exposure, minimize nighttime interruptions, avoid sedating medications when possible",
      "Ensure patient safety: assess fall risk, implement fall precautions, consider bed alarm or sitter for confused patients, remove environmental hazards",
      "Use non-pharmacological interventions first for agitation: verbal de-escalation, redirection, music therapy, family presence, addressing unmet needs (pain, hunger, toileting)",
      "Document mental status findings using standardized tools (GCS, MMSE, CAM) to enable objective trending and facilitate communication between care team members"
    ],
    nursingActions: [
      "Perform mental status assessment systematically on admission and every shift: appearance, behavior, speech, mood/affect, thought process and content, perception, cognition, insight, and judgment",
      "Assess and document GCS score accurately: report any decrease of 2 or more points immediately as this indicates significant neurological deterioration",
      "Screen for delirium using the Confusion Assessment Method (CAM) every shift in high-risk patients: acute onset, fluctuating course, inattention, and disorganized thinking are the four diagnostic features",
      "Differentiate delirium from dementia: delirium has acute onset (hours to days), fluctuating course, and is usually reversible; dementia has gradual onset (months to years), progressive course, and is usually irreversible",
      "Document findings objectively: describe behavior rather than interpret it -- record that the patient is picking at invisible objects on the bedsheets rather than writing the patient is hallucinating",
      "Assess orientation to all four spheres and report changes: time is lost first, then place, then situation, then person -- progressive loss indicates worsening cognitive function",
      "Monitor for medication-related cognitive changes: anticholinergic burden, benzodiazepine sedation, opioid-induced confusion, and steroid psychosis are common iatrogenic causes"
    ],
    assessmentFindings: [
      "Level of consciousness continuum: alert (fully responsive), lethargic (drowsy but arousable with verbal stimuli), obtunded (requires repeated stimulation to arouse), stupor (responds only to vigorous or painful stimuli), coma (no response to any stimuli)",
      "Delirium features: acute onset (hours to days), fluctuating level of consciousness, inattention (cannot focus or sustain attention), disorganized thinking, perceptual disturbances (visual hallucinations more common than auditory), psychomotor agitation or hypoactivity, sleep-wake cycle reversal",
      "Dementia features: gradual onset (months to years), progressive cognitive decline, intact level of consciousness until late stages, memory impairment (short-term first, then long-term), word-finding difficulty, impaired judgment, personality changes, eventual loss of ADL independence",
      "Abnormal speech patterns: aphasia (Broca -- nonfluent with intact comprehension; Wernicke -- fluent but incomprehensible), pressured speech (mania), poverty of speech (depression, negative symptoms of schizophrenia), word salad (severe thought disorder)",
      "Affect abnormalities: flat (no emotional expression), blunted (reduced range of expression), labile (rapid unpredictable changes in affect), incongruent (affect does not match stated mood or situation)",
      "Thought content abnormalities: delusions (fixed false beliefs), suicidal ideation, homicidal ideation, obsessions (intrusive repetitive thoughts), phobias, ideas of reference (belief that unrelated events are personally directed)"
    ],
    signs: {
      left: [
        "Mild confusion or disorientation to time only",
        "Difficulty concentrating or following multi-step commands",
        "Slight word-finding difficulty or circumlocution",
        "Mild anxiety, irritability, or mood changes",
        "Forgetfulness for recent events with intact remote memory",
        "Subtle changes in grooming or personal hygiene"
      ],
      right: [
        "Rapid decline in GCS score (decrease of 2 or more points)",
        "New-onset unequal pupils or loss of pupillary reactivity",
        "Severe agitation with risk of harm to self or others",
        "Complete disorientation to all four spheres (person, place, time, situation)",
        "New-onset seizure activity or posturing (decorticate or decerebrate)",
        "Coma or unresponsiveness to all stimuli"
      ]
    },
    medications: [
      {
        name: "MSE Assessment Form",
        type: "Assessment Tool",
        action: "Standardized documentation template for systematic mental status examination that guides the clinician through all MSE domains: appearance, behavior, speech, mood, affect, thought process, thought content, perceptual disturbances, cognition (orientation, attention, memory, calculation), insight, and judgment; ensures comprehensive and consistent documentation",
        sideEffects: "Incomplete completion if clinician is not trained in all domains; risk of subjective interpretation if objective behavioral descriptions are not used; time-consuming in acute settings",
        contra: "Not appropriate as the sole assessment tool for acute neurological emergencies (use GCS for rapid assessment); may need adaptation for non-verbal patients, patients with language barriers, or patients with severe cognitive impairment",
        pearl: "Always document MSE findings as objective behavioral descriptions rather than diagnostic labels; for example, describe that the patient responded to questions with single words after a 10-second delay rather than writing patient has psychomotor retardation"
      },
      {
        name: "GCS Assessment Tool",
        type: "Assessment Tool",
        action: "The Glasgow Coma Scale is a 15-point standardized neurological assessment tool that evaluates three components: eye opening response (spontaneous 4, to voice 3, to pressure 2, none 1), verbal response (oriented 5, confused 4, inappropriate words 3, incomprehensible sounds 2, none 1), and best motor response (obeys commands 6, localizing pain 5, normal flexion 4, abnormal flexion 3, extension 2, none 1); provides rapid, reproducible assessment of consciousness level",
        sideEffects: "Does not assess cognitive function beyond consciousness level; intubated patients cannot be assessed for verbal response (score as 1T); eye swelling or facial trauma may prevent accurate eye opening assessment; sedating medications can artificially lower score",
        contra: "Not a substitute for comprehensive neurological examination; less reliable in pre-verbal children (use Pediatric Glasgow Coma Scale); scores should be reported as individual components (e.g., E3V4M5 = 12) not just the total",
        pearl: "A GCS of 8 or less is the threshold for severe brain injury and typically indicates the need for intubation and mechanical ventilation; always report motor response separately as it is the most reliable predictor of neurological outcome; assess and document bilaterally to detect lateralizing signs"
      },
      {
        name: "Orientation Checklist",
        type: "Assessment Tool",
        action: "Structured assessment framework for evaluating orientation across four spheres: person (What is your name? What is your date of birth?), place (Where are you right now? What facility is this?), time (What is today's date? What day of the week is it? What month and year is it?), and situation (Why are you here? What happened to bring you to the hospital?); documented as oriented x1 through oriented x4",
        sideEffects: "May underestimate impairment if questions are too simple or if patient gives plausible but incorrect answers; cultural and language factors may affect responses; education level may affect understanding of questions",
        contra: "Not sufficient as a standalone cognitive assessment; does not evaluate executive function, memory, language, or visuospatial abilities; must be combined with other cognitive screening tools for comprehensive evaluation",
        pearl: "Orientation is typically lost in a predictable pattern: time is lost first, then place, then situation, and finally person (loss of identity indicates severe impairment); always note if the patient is close but not accurate (e.g., stating the correct month but wrong day) versus completely disoriented; UTI is the number one cause of acute disorientation in elderly patients"
      }
    ],
    pearls: [
      "The GCS score should always be reported as individual components (E3V4M5 = 12) rather than just the total score, because the same total can represent very different clinical pictures; the motor component is the most reliable prognostic indicator",
      "Orientation is lost in a predictable order: time first, then place, then situation, then person -- a patient who is disoriented to person but oriented to time should raise concern for a psychiatric rather than organic cause",
      "Delirium versus dementia: delirium is ACUTE onset (hours to days) with a FLUCTUATING course and is usually REVERSIBLE; dementia is GRADUAL onset (months to years) with a PROGRESSIVE course and is usually IRREVERSIBLE -- delirium is always a medical emergency",
      "The Confusion Assessment Method (CAM) requires BOTH acute onset with fluctuating course AND inattention, PLUS either disorganized thinking OR altered level of consciousness to diagnose delirium",
      "UTI is the single most common cause of acute confusion in elderly patients -- always check urinalysis and urine culture when an older adult presents with new-onset altered mental status",
      "Document mental status findings objectively: describe observable behaviors rather than making interpretive labels; write the patient is responding to voices that others cannot hear rather than the patient is hallucinating",
      "Anticholinergic medications are a leading iatrogenic cause of altered mental status in elderly patients -- common offenders include diphenhydramine, oxybutynin, amitriptyline, and benztropine; use the mnemonic: dry as a bone, blind as a bat, mad as a hatter, red as a beet, hot as a hare"
    ],
    quiz: [
      {
        question: "An elderly patient who was oriented and conversant yesterday is now acutely confused, picking at the bedsheets, and unable to maintain attention during assessment. Which condition does the practical nurse suspect?",
        options: [
          "Alzheimer disease",
          "Major depressive disorder",
          "Delirium",
          "Vascular dementia"
        ],
        correct: 2,
        rationale: "Delirium is characterized by acute onset (hours to days), fluctuating course, inattention, and often perceptual disturbances such as visual hallucinations or picking at objects. Dementia (Alzheimer disease, vascular dementia) has a gradual onset over months to years. Depression may mimic cognitive impairment but does not typically present with acute confusion and perceptual disturbances."
      },
      {
        question: "A patient has a Glasgow Coma Scale score of E2V3M4. What is the total GCS score and what does it indicate?",
        options: [
          "GCS 9; moderate brain injury",
          "GCS 9; mild brain injury",
          "GCS 7; severe brain injury requiring intubation",
          "GCS 11; mild brain injury"
        ],
        correct: 0,
        rationale: "E2 (eye opening to pressure) + V3 (inappropriate words) + M4 (normal flexion withdrawal) = GCS 9, which falls in the moderate brain injury range (9-12). GCS of 8 or less indicates severe brain injury and typically requires intubation. GCS 13-15 is classified as mild."
      },
      {
        question: "When documenting mental status assessment findings, which documentation approach is most appropriate for the practical nurse?",
        options: [
          "The patient is psychotic and delusional",
          "The patient states that the government is monitoring through the television and appears suspicious of staff",
          "The patient has schizophrenia with active symptoms",
          "The patient is crazy and not making sense"
        ],
        correct: 1,
        rationale: "Mental status findings should be documented using objective behavioral descriptions that record what was observed and what the patient stated. Writing psychotic, delusional, or using diagnostic labels is interpretive rather than descriptive. Objective documentation enables other clinicians to make their own clinical assessments based on the recorded observations."
      }
    ]
  },

  "metabolic-syndrome-rpn": {
    title: "Metabolic Syndrome for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Metabolic Syndrome and Insulin Resistance",
      content: "Metabolic syndrome is a cluster of interconnected metabolic abnormalities that significantly increase the risk of cardiovascular disease, type 2 diabetes mellitus, stroke, and non-alcoholic fatty liver disease. The syndrome is diagnosed when a patient meets at least three of five diagnostic criteria established by the National Cholesterol Education Program Adult Treatment Panel III (NCEP ATP III): elevated waist circumference (greater than 102 cm or 40 inches in males, greater than 88 cm or 35 inches in females), elevated triglycerides (150 mg/dL or greater, or 1.7 mmol/L or greater), reduced HDL cholesterol (less than 40 mg/dL or 1.0 mmol/L in males, less than 50 mg/dL or 1.3 mmol/L in females), elevated blood pressure (130/85 mmHg or greater, or on antihypertensive therapy), and elevated fasting glucose (100 mg/dL or greater, or 5.6 mmol/L or greater, or on glucose-lowering therapy). The central pathophysiological mechanism is insulin resistance, a condition in which peripheral tissues (skeletal muscle, liver, and adipose tissue) have a diminished biological response to normal insulin concentrations. When insulin-sensitive tissues fail to respond adequately, the pancreatic beta cells compensate by producing more insulin (compensatory hyperinsulinemia). Over time, this compensatory mechanism fails, and blood glucose levels rise progressively from normal to impaired fasting glucose to impaired glucose tolerance to overt type 2 diabetes. Visceral (abdominal) adiposity plays a particularly important pathogenic role because visceral fat is metabolically active, functioning as an endocrine organ that secretes pro-inflammatory adipokines (tumor necrosis factor-alpha, interleukin-6, resistin) while producing less adiponectin (an insulin-sensitizing and anti-inflammatory molecule). This chronic low-grade inflammatory state promotes endothelial dysfunction, accelerates atherosclerosis, and perpetuates insulin resistance through a self-reinforcing cycle. The dyslipidemia of metabolic syndrome is characterized by elevated triglycerides, decreased HDL cholesterol, and the presence of small, dense LDL particles that are particularly atherogenic because they penetrate the arterial wall more easily and are more susceptible to oxidation. Hypertension in metabolic syndrome results from multiple mechanisms: hyperinsulinemia increases renal sodium reabsorption, activates the sympathetic nervous system, and stimulates vascular smooth muscle proliferation. The pro-thrombotic state is characterized by elevated plasminogen activator inhibitor-1 (PAI-1) and fibrinogen levels, increasing the risk of acute arterial thrombotic events. The pro-inflammatory state is evidenced by elevated C-reactive protein (CRP), which is both a marker of systemic inflammation and an independent predictor of cardiovascular events. Metabolic syndrome affects approximately 20-25 percent of the adult population in developed countries, with prevalence increasing significantly with age, sedentary lifestyle, and dietary patterns high in processed foods, refined carbohydrates, and saturated fats. The practical nurse plays a vital role in screening, patient education, lifestyle counseling, medication monitoring, and ongoing assessment. Lifestyle modification (increased physical activity, dietary changes, weight loss of 5-10 percent of body weight) is the cornerstone of treatment and can improve all five components of the syndrome. Pharmacological therapy targets individual components that do not respond adequately to lifestyle changes."
    },
    riskFactors: [
      "Central (visceral) obesity (waist circumference greater than 102 cm in males or 88 cm in females is the strongest clinical predictor)",
      "Sedentary lifestyle (less than 150 minutes per week of moderate physical activity significantly increases risk)",
      "Family history of type 2 diabetes mellitus, cardiovascular disease, or metabolic syndrome (strong genetic component)",
      "Age over 40 years (prevalence increases with each decade of life)",
      "Diet high in processed foods, refined carbohydrates, saturated fats, and sugar-sweetened beverages",
      "Certain ethnic backgrounds (Indigenous, South Asian, Hispanic, and African populations have higher prevalence)",
      "Polycystic ovary syndrome (PCOS), gestational diabetes, or history of prediabetes"
    ],
    diagnostics: [
      "Fasting lipid panel: triglycerides 150 mg/dL or greater (1.7 mmol/L), HDL less than 40 mg/dL (1.0 mmol/L) in males or less than 50 mg/dL (1.3 mmol/L) in females; small dense LDL pattern is characteristic but not routinely measured",
      "Fasting blood glucose: 100-125 mg/dL (5.6-6.9 mmol/L) indicates impaired fasting glucose; 126 mg/dL (7.0 mmol/L) or greater indicates diabetes mellitus; must be confirmed on two separate occasions",
      "Hemoglobin A1C (HbA1c): reflects average blood glucose over 2-3 months; 5.7-6.4% indicates prediabetes, 6.5% or greater indicates diabetes; useful for monitoring glycemic control",
      "Waist circumference measurement: measured at the level of the iliac crest at the end of normal expiration; central to diagnosis and more predictive of cardiovascular risk than BMI alone",
      "Blood pressure measurement: taken after 5 minutes of rest in sitting position with arm supported at heart level; elevated at 130/85 mmHg or greater; confirm with multiple readings on separate visits",
      "High-sensitivity C-reactive protein (hs-CRP): marker of systemic inflammation and independent predictor of cardiovascular events; values greater than 3 mg/L indicate high cardiovascular risk"
    ],
    management: [
      "Lifestyle modification is FIRST-LINE therapy: recommend 150 minutes per week of moderate aerobic exercise plus resistance training 2-3 days per week; even modest weight loss of 5-10% significantly improves all metabolic parameters",
      "Dietary counseling: recommend Mediterranean or DASH diet pattern emphasizing whole grains, fruits, vegetables, lean proteins, healthy fats (olive oil, nuts, fish), and limiting processed foods, refined carbohydrates, and sugar-sweetened beverages",
      "Administer metformin as prescribed for insulin resistance and hyperglycemia; educate patient to take with meals to reduce GI side effects; monitor renal function (hold if eGFR less than 30)",
      "Administer statin therapy (atorvastatin) as prescribed for dyslipidemia; educate patient to report unexplained muscle pain, weakness, or dark urine (signs of rhabdomyolysis)",
      "Administer antihypertensive therapy as prescribed; ACE inhibitors or ARBs are preferred first-line agents for patients with metabolic syndrome due to metabolic neutrality and renal protective effects",
      "Monitor blood pressure at every visit; target less than 130/80 mmHg for patients with metabolic syndrome and cardiovascular risk factors",
      "Provide smoking cessation support and counsel on limiting alcohol intake (no more than 1 drink per day for females, 2 for males)"
    ],
    nursingActions: [
      "Measure and document waist circumference at the level of the iliac crest using a non-stretching tape measure at end-expiration; track serial measurements to monitor treatment progress",
      "Monitor fasting blood glucose and HbA1c levels as ordered; report values trending upward toward diabetic range to the supervising nurse or physician",
      "Assess blood pressure using proper technique: 5 minutes of rest, correct cuff size (bladder encircling at least 80% of arm circumference), arm supported at heart level, back supported, feet flat on floor",
      "Educate patient on reading nutrition labels: focus on serving size, total carbohydrates, added sugars, saturated fat, sodium, and fiber content",
      "Monitor for side effects of prescribed medications: metformin (GI distress, lactic acidosis symptoms), statins (myalgia, elevated liver enzymes), antihypertensives (orthostatic hypotension, dizziness)",
      "Assess patient readiness to change using the Stages of Change model (precontemplation, contemplation, preparation, action, maintenance) and tailor education accordingly",
      "Document dietary intake, physical activity level, medication adherence, and barriers to lifestyle modification identified by the patient"
    ],
    assessmentFindings: [
      "Central (abdominal) obesity: apple-shaped body habitus with waist circumference exceeding diagnostic thresholds; waist-to-hip ratio greater than 0.9 in males or 0.85 in females",
      "Acanthosis nigricans: dark, velvety, hyperpigmented skin patches in body folds (axillae, posterior neck, groin), a visible marker of insulin resistance",
      "Elevated blood pressure readings: systolic 130 mmHg or greater and/or diastolic 85 mmHg or greater on multiple measurements",
      "Xanthelasma or xanthoma: yellowish lipid deposits around the eyelids or over tendons, indicating severe dyslipidemia",
      "Fatigue, increased thirst (polydipsia), increased urination (polyuria), and blurred vision suggesting hyperglycemia progression",
      "Hepatomegaly or right upper quadrant tenderness suggesting non-alcoholic fatty liver disease, which is present in up to 80% of patients with metabolic syndrome"
    ],
    signs: {
      left: [
        "Gradually increasing waist circumference over serial measurements",
        "Borderline elevated blood pressure (120-129 systolic, less than 80 diastolic)",
        "Mildly elevated fasting glucose (100-110 mg/dL or 5.6-6.1 mmol/L)",
        "Fatigue and decreased exercise tolerance",
        "Acanthosis nigricans developing on posterior neck or axillae",
        "Mildly abnormal lipid panel with elevated triglycerides"
      ],
      right: [
        "Blood glucose greater than 300 mg/dL (16.7 mmol/L) with symptoms of diabetic ketoacidosis or hyperosmolar state",
        "Hypertensive crisis (systolic greater than 180 or diastolic greater than 120 mmHg) with end-organ damage symptoms",
        "Chest pain, shortness of breath, or diaphoresis suggesting acute coronary syndrome",
        "New-onset neurological deficits suggesting stroke (facial droop, arm weakness, speech difficulty)",
        "Signs of rhabdomyolysis from statin therapy (severe muscle pain, dark cola-colored urine, elevated CK)",
        "Lactic acidosis symptoms with metformin use (malaise, respiratory distress, abdominal pain, hypothermia)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide oral antihyperglycemic agent",
        action: "Decreases hepatic glucose production by inhibiting gluconeogenesis, increases insulin sensitivity in peripheral tissues (skeletal muscle and adipose tissue), and decreases intestinal absorption of glucose; does NOT stimulate insulin secretion, therefore does not cause hypoglycemia when used as monotherapy",
        sideEffects: "GI side effects are most common (nausea, diarrhea, abdominal cramping, metallic taste) and typically diminish with time; lactic acidosis (rare but potentially fatal); vitamin B12 deficiency with long-term use",
        contra: "eGFR less than 30 mL/min/1.73 m2 (risk of lactic acidosis); hold 48 hours before and after iodinated contrast procedures; acute or chronic metabolic acidosis; severe hepatic impairment; heavy alcohol use",
        pearl: "First-line pharmacotherapy for type 2 diabetes and prediabetes with metabolic syndrome; start with low dose (500 mg once daily with dinner) and titrate slowly to minimize GI side effects; extended-release formulation may be better tolerated; does NOT cause weight gain and may promote modest weight loss"
      },
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA reductase inhibitor (statin)",
        action: "Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in hepatic cholesterol synthesis, leading to upregulation of LDL receptors on hepatocytes, increased clearance of LDL cholesterol from the blood, decreased triglycerides, and modest increase in HDL cholesterol; also has pleiotropic effects including anti-inflammatory and plaque-stabilizing properties",
        sideEffects: "Myalgia (muscle pain without CK elevation) in 5-10% of patients, myopathy (muscle pain with elevated CK), rhabdomyolysis (rare but life-threatening -- muscle breakdown with CK greater than 10x normal), elevated hepatic transaminases, new-onset diabetes (modest risk increase), headache",
        contra: "Active liver disease or unexplained persistent elevations of hepatic transaminases; pregnancy and breastfeeding (teratogenic -- Category X); concurrent use with strong CYP3A4 inhibitors (itraconazole, HIV protease inhibitors)",
        pearl: "Administered in the evening for short-acting statins, but atorvastatin has a long half-life and can be taken at any time; instruct patients to report unexplained muscle pain, tenderness, or weakness immediately; monitor liver function tests at baseline and as clinically indicated; grapefruit juice inhibits CYP3A4 and may increase atorvastatin levels"
      },
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "Angiotensin-converting enzyme (ACE) inhibitor",
        action: "Inhibits angiotensin-converting enzyme (ACE), preventing the conversion of angiotensin I to angiotensin II (a potent vasoconstrictor), thereby reducing peripheral vascular resistance, aldosterone secretion, and sodium/water retention; also inhibits bradykinin degradation (contributing to vasodilation and the common side effect of dry cough); provides renal protective effects by reducing intraglomerular pressure",
        sideEffects: "Persistent dry cough (most common reason for discontinuation, occurs in up to 20% of patients), hyperkalemia, dizziness, hypotension (especially first dose), angioedema (rare but life-threatening -- swelling of face, lips, tongue, airway), elevated creatinine (mild increase acceptable), teratogenicity",
        contra: "History of angioedema with ACE inhibitor use; bilateral renal artery stenosis; pregnancy (teratogenic in all trimesters -- Category D); concurrent use with ARBs or aliskiren in patients with diabetes; hyperkalemia (potassium greater than 5.5 mEq/L)",
        pearl: "Preferred first-line antihypertensive for patients with metabolic syndrome, diabetes, or chronic kidney disease due to cardiorenal protective effects; monitor potassium and creatinine within 1-2 weeks of initiation or dose change; instruct patients to avoid potassium supplements and salt substitutes containing potassium; teach patients to report lip or tongue swelling immediately (angioedema)"
      }
    ],
    pearls: [
      "Metabolic syndrome requires at least 3 of 5 criteria: elevated waist circumference, elevated triglycerides, reduced HDL, elevated blood pressure, and elevated fasting glucose -- remember the ABCDE mnemonic: Abdominal obesity, Blood pressure elevated, Cholesterol (HDL) decreased, Dyslipidemia (triglycerides elevated), Elevated glucose",
      "Waist circumference is a better predictor of cardiovascular risk than BMI because it specifically measures visceral (abdominal) fat, which is the metabolically active fat that drives insulin resistance and inflammation",
      "Lifestyle modification is ALWAYS first-line therapy: a 5-10% reduction in body weight can significantly improve all five components of metabolic syndrome; even without weight loss, 150 minutes per week of moderate exercise improves insulin sensitivity",
      "Acanthosis nigricans (dark, velvety skin patches in body folds) is a visible clinical marker of insulin resistance and should prompt screening for metabolic syndrome and prediabetes",
      "Metformin is the preferred first-line medication for glucose management in metabolic syndrome because it does not cause hypoglycemia as monotherapy, does not promote weight gain, and may facilitate modest weight loss",
      "Statins reduce cardiovascular event risk by 25-35% in patients with metabolic syndrome through both LDL reduction and anti-inflammatory (pleiotropic) effects; instruct patients to report unexplained muscle pain immediately (rhabdomyolysis risk)",
      "ACE inhibitors are the preferred antihypertensive class for metabolic syndrome because they are metabolically neutral (do not worsen glucose or lipid profiles), provide renal protection, and reduce cardiovascular mortality"
    ],
    quiz: [
      {
        question: "A patient has a waist circumference of 110 cm, fasting glucose of 118 mg/dL, triglycerides of 180 mg/dL, HDL of 38 mg/dL, and blood pressure of 128/82 mmHg. How many metabolic syndrome criteria does this patient meet?",
        options: [
          "Two criteria",
          "Three criteria",
          "Four criteria",
          "Five criteria"
        ],
        correct: 2,
        rationale: "This patient meets four of five criteria: elevated waist circumference (greater than 102 cm for males), elevated fasting glucose (greater than 100 mg/dL), elevated triglycerides (greater than 150 mg/dL), and reduced HDL (less than 40 mg/dL for males). The blood pressure of 128/82 is below the 130/85 threshold, so this criterion is not met. Three or more criteria are required for diagnosis."
      },
      {
        question: "The practical nurse is caring for a patient newly started on metformin. Which side effect should the nurse monitor for and report immediately?",
        options: [
          "Mild nausea after taking the medication with food",
          "Hypoglycemia with blood glucose of 3.2 mmol/L",
          "Malaise, hyperventilation, and abdominal pain suggesting lactic acidosis",
          "Weight gain of 1 kg over the first month"
        ],
        correct: 2,
        rationale: "Lactic acidosis is a rare but potentially fatal complication of metformin, presenting with malaise, hyperventilation (compensatory respiratory alkalosis), abdominal pain, and hypothermia. Metformin does not typically cause hypoglycemia as monotherapy and does not cause weight gain. Mild GI symptoms are common and expected but not emergency findings."
      },
      {
        question: "Which clinical finding should the practical nurse recognize as a visible marker of insulin resistance when assessing a patient for metabolic syndrome?",
        options: [
          "Spider angiomas on the chest and abdomen",
          "Acanthosis nigricans on the posterior neck and axillae",
          "Petechiae on the lower extremities",
          "Xanthelasma around the eyelids"
        ],
        correct: 1,
        rationale: "Acanthosis nigricans presents as dark, velvety, hyperpigmented skin patches in body folds (posterior neck, axillae, groin) and is a clinical marker of insulin resistance. Spider angiomas are associated with liver disease. Petechiae suggest platelet or coagulation disorders. Xanthelasma indicates hyperlipidemia but is not specifically a marker of insulin resistance."
      }
    ]
  },

  "microscopic-colitis-rpn": {
    title: "Microscopic Colitis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Microscopic Colitis",
      content: "Microscopic colitis is a chronic inflammatory bowel disease characterized by chronic, non-bloody, watery diarrhea in the setting of a grossly normal-appearing colonic mucosa on colonoscopy. The diagnosis can only be confirmed through microscopic examination of colonic mucosal biopsies, which is the distinguishing feature that gives the condition its name. There are two histological subtypes: collagenous colitis and lymphocytic colitis. In collagenous colitis, there is a thickened subepithelial collagen band (greater than 10 micrometers, compared to the normal thickness of less than 5 micrometers) beneath the surface epithelium of the colon, accompanied by an inflammatory infiltrate in the lamina propria. This collagen band disrupts normal fluid and electrolyte absorption across the colonic mucosa, leading to secretory diarrhea. In lymphocytic colitis, the subepithelial collagen band is normal in thickness, but there is a significant increase in intraepithelial lymphocytes (greater than 20 lymphocytes per 100 epithelial cells, compared to the normal value of fewer than 5 per 100). These intraepithelial lymphocytes are predominantly CD8-positive T cells that damage surface epithelial cells and impair their absorptive function. Both subtypes share a common pathogenesis involving an abnormal mucosal immune response to luminal antigens in genetically susceptible individuals. The exact triggering antigens remain unclear, but the leading hypotheses include medications (particularly NSAIDs, proton pump inhibitors, SSRIs, and statins), bile acid malabsorption, bacterial antigens, and dietary components. The inflammatory cascade involves activation of mucosal T cells, increased production of pro-inflammatory cytokines (interferon-gamma, TNF-alpha, interleukin-1), and disruption of tight junctions between colonocytes, resulting in increased mucosal permeability and impaired water and electrolyte absorption. Microscopic colitis predominantly affects middle-aged and older adults, with peak incidence between ages 60 and 70, and has a female predominance (particularly collagenous colitis, which is 3-4 times more common in females). The condition is increasingly recognized as a common cause of chronic diarrhea, accounting for 10-20 percent of cases investigated by colonoscopy for chronic watery diarrhea. Patients typically present with 4-9 watery, non-bloody bowel movements per day, often accompanied by abdominal cramping, urgency, fecal incontinence (particularly nocturnal), weight loss, and fatigue. Importantly, the diarrhea may be severe enough to cause dehydration and electrolyte imbalances, particularly hypokalemia and metabolic acidosis from bicarbonate loss in stool. There is a strong association with autoimmune conditions, including celiac disease, thyroid disorders, rheumatoid arthritis, and type 1 diabetes mellitus. Budesonide, a topical corticosteroid with high first-pass hepatic metabolism, is the first-line pharmacological treatment and is effective in inducing remission in 80 percent of patients. However, relapse is common after discontinuation (60-80 percent), and many patients require long-term maintenance therapy. The practical nurse must monitor fluid and electrolyte status, assess stool frequency and characteristics, administer medications as prescribed, and provide patient education regarding dietary modifications and medication adherence."
    },
    riskFactors: [
      "Female sex (collagenous colitis is 3-4 times more common in females; lymphocytic colitis has a more equal sex distribution)",
      "Age over 60 years (peak incidence between 60 and 70 years; can occur at any age but uncommon under 40)",
      "Current or recent NSAID use (ibuprofen, naproxen, aspirin -- odds ratio approximately 3-5x increased risk)",
      "Proton pump inhibitor use (lansoprazole has the strongest association; risk increases with duration of use)",
      "SSRI antidepressant use (sertraline, fluoxetine -- implicated in triggering or worsening microscopic colitis)",
      "Concurrent autoimmune diseases (celiac disease, autoimmune thyroiditis, rheumatoid arthritis, type 1 diabetes mellitus)",
      "Current or former tobacco smoking (particularly associated with collagenous colitis; smoking cessation may improve symptoms)"
    ],
    diagnostics: [
      "Colonoscopy with random biopsies: the colonic mucosa appears grossly NORMAL on visual inspection -- this is the hallmark feature; random biopsies must be taken from multiple sites (ascending, transverse, descending, sigmoid colon) because changes can be patchy",
      "Histopathological examination: collagenous colitis shows thickened subepithelial collagen band greater than 10 micrometers; lymphocytic colitis shows greater than 20 intraepithelial lymphocytes per 100 epithelial cells; both show lamina propria inflammation",
      "Stool studies: rule out infectious causes of chronic diarrhea; Clostridioides difficile toxin assay, stool culture and sensitivity, ova and parasites; fecal calprotectin may be mildly elevated",
      "Celiac disease screening (tissue transglutaminase IgA, total IgA): celiac disease and microscopic colitis commonly coexist; celiac disease must be ruled out as a contributing cause of diarrhea",
      "Thyroid function tests (TSH): autoimmune thyroid disease frequently coexists with microscopic colitis and hyperthyroidism can independently cause diarrhea",
      "Basic metabolic panel: assess for dehydration (elevated BUN/creatinine ratio), hypokalemia, hyponatremia, and metabolic acidosis from chronic diarrhea with bicarbonate loss"
    ],
    management: [
      "Identify and discontinue potential offending medications (NSAIDs, PPIs, SSRIs) in consultation with the prescribing physician -- medication withdrawal alone may resolve symptoms in some patients",
      "Administer budesonide as prescribed (first-line treatment): typical induction dose is 9 mg daily for 6-8 weeks, followed by gradual taper; maintenance dose of 3-6 mg daily may be needed for relapse prevention",
      "Monitor stool frequency, consistency, and volume: maintain a stool diary recording number of bowel movements per day, Bristol Stool Scale score, presence of nocturnal diarrhea, and associated symptoms",
      "Maintain adequate hydration: encourage oral fluid intake of at least 2-3 liters per day; oral rehydration solutions for patients with significant fluid losses; IV fluids if clinically dehydrated",
      "Monitor and replace electrolytes as ordered: potassium supplementation for hypokalemia from diarrheal losses; monitor magnesium and sodium levels",
      "Implement dietary modifications: recommend small frequent meals, avoid caffeine, alcohol, lactose (if intolerant), and artificial sweeteners (sorbitol, mannitol) which can worsen osmotic diarrhea",
      "Assess for signs of dehydration at each encounter: skin turgor, mucous membrane moisture, orthostatic vital signs, urine output and concentration, daily weights"
    ],
    nursingActions: [
      "Monitor and document stool frequency, consistency (using Bristol Stool Scale), volume, color, and presence of blood or mucus at least every shift during acute episodes",
      "Assess hydration status systematically: check skin turgor on sternum or forehead (more reliable in elderly), inspect mucous membranes, monitor orthostatic vital signs, record strict intake and output, obtain daily weights",
      "Administer budesonide as prescribed and monitor for corticosteroid side effects: elevated blood glucose (check glucose in diabetic patients), mood changes, insomnia, adrenal suppression with prolonged use",
      "Provide perianal skin care: cleanse gently with warm water after each bowel movement, apply barrier cream (zinc oxide or dimethicone-based), use soft toilet tissue or perineal cleansing cloths, assess for skin breakdown",
      "Educate patient about the chronic relapsing nature of microscopic colitis and the importance of medication adherence even when feeling better during remission",
      "Report signs of worsening: increasing stool frequency beyond baseline, new-onset bloody diarrhea (atypical for microscopic colitis and requires investigation), signs of severe dehydration, fever, or abdominal distension",
      "Coordinate follow-up appointments for repeat colonoscopy with biopsies as ordered to assess treatment response and guide decisions about maintenance therapy"
    ],
    assessmentFindings: [
      "Chronic watery, non-bloody diarrhea: typically 4-9 loose or watery stools per day; may be sudden in onset or gradually worsening over weeks to months; nocturnal diarrhea is common and distinguishes from functional diarrhea",
      "Abdominal cramping and bloating: diffuse, mild to moderate; may worsen after meals; absence of severe localized tenderness (which would suggest alternative diagnosis)",
      "Fecal urgency and incontinence: particularly problematic in elderly patients; nocturnal fecal incontinence significantly impacts quality of life",
      "Weight loss: typically 2-5 kg from chronic diarrhea and reduced oral intake; more pronounced in collagenous colitis",
      "Signs of dehydration: decreased skin turgor, dry mucous membranes, concentrated urine, orthostatic hypotension, tachycardia, elevated BUN-to-creatinine ratio",
      "Fatigue, malaise, and decreased quality of life: chronic diarrhea impacts sleep, social activities, and occupational functioning; assess for concurrent depression"
    ],
    signs: {
      left: [
        "Mild increase in stool frequency (3-4 loose stools per day)",
        "Intermittent abdominal cramping after meals",
        "Mild fatigue and generalized weakness",
        "Slight weight loss (1-2 kg over several weeks)",
        "Occasional urgency without incontinence",
        "Normal vital signs with adequate oral intake"
      ],
      right: [
        "Severe dehydration with hypotension and tachycardia (systolic BP less than 90, heart rate greater than 120)",
        "Greater than 10 watery stools per day with inability to maintain oral hydration",
        "New-onset bloody diarrhea (atypical -- requires urgent investigation for alternative diagnosis)",
        "Severe electrolyte imbalance (potassium less than 3.0 mEq/L) with cardiac arrhythmia risk",
        "Acute kidney injury from prolonged dehydration (rising creatinine, decreased urine output)",
        "Fever greater than 38.5 degrees C with abdominal distension (suggests superimposed infection or complication)"
      ]
    },
    medications: [
      {
        name: "Budesonide (Entocort)",
        type: "Topical corticosteroid with high first-pass metabolism",
        action: "A potent glucocorticoid that acts locally on the colonic mucosa to suppress the inflammatory cascade by inhibiting pro-inflammatory cytokine production (TNF-alpha, interleukin-1, interferon-gamma), reducing intraepithelial lymphocyte infiltration, and stabilizing the mucosal barrier; undergoes approximately 90% first-pass hepatic metabolism, resulting in lower systemic bioavailability and fewer systemic steroid side effects compared to prednisone",
        sideEffects: "Headache, nausea, dyspepsia, upper respiratory tract infection, adrenal suppression with prolonged use (monitor morning cortisol), hyperglycemia, insomnia, mood changes; fewer systemic effects than conventional corticosteroids but not free of risk",
        contra: "Active systemic fungal infections; known hypersensitivity; concurrent use with strong CYP3A4 inhibitors (ketoconazole, itraconazole) which increase budesonide levels; use with caution in patients with hepatic impairment (increased systemic exposure)",
        pearl: "First-line treatment for microscopic colitis with 80% remission rate; induction dose is 9 mg daily for 6-8 weeks, then taper by 3 mg every 2 weeks; relapse occurs in 60-80% after discontinuation, so many patients require long-term maintenance at 3-6 mg daily; do NOT stop abruptly after prolonged use due to adrenal suppression risk"
      },
      {
        name: "Bismuth Subsalicylate (Pepto-Bismol)",
        type: "Antisecretory and anti-inflammatory agent",
        action: "Provides a dual mechanism of action: the bismuth component forms a protective coating on the colonic mucosa and has antimicrobial properties, while the salicylate component inhibits prostaglandin synthesis and reduces mucosal inflammation and fluid secretion; also binds bacterial toxins in the intestinal lumen",
        sideEffects: "Black discoloration of stool and tongue (harmless but must inform patients to prevent alarm), tinnitus (salicylate toxicity), constipation, nausea; avoid in patients with aspirin allergy due to salicylate component",
        contra: "Aspirin or salicylate allergy; concurrent use with anticoagulants (increased bleeding risk); concurrent use with methotrexate (increased methotrexate toxicity); children and teenagers with viral illness (Reye syndrome risk from salicylate); chronic kidney disease",
        pearl: "Used as an alternative to budesonide in mild cases or as combination therapy; typical dose is 262 mg three times daily; may take 6-8 weeks to achieve clinical response; reassure patients that black stools are an expected and harmless effect of bismuth and do not indicate GI bleeding"
      },
      {
        name: "Loperamide (Imodium)",
        type: "Antidiarrheal (peripheral opioid receptor agonist)",
        action: "Acts on mu-opioid receptors in the myenteric plexus of the intestinal wall to slow intestinal peristalsis, increase intestinal transit time, and enhance water and electrolyte absorption from the intestinal lumen; also increases anal sphincter tone, reducing fecal urgency and incontinence; does not cross the blood-brain barrier at therapeutic doses, so it has no analgesic or CNS effects",
        sideEffects: "Constipation (most common), abdominal cramping, nausea, dizziness, dry mouth; at high doses may cause cardiac arrhythmias (QT prolongation) and paralytic ileus",
        contra: "Acute dysentery (bloody diarrhea with fever -- trapping the organism worsens infection); Clostridioides difficile colitis; abdominal distension or suspected bowel obstruction; children under 2 years of age",
        pearl: "Used for SYMPTOMATIC relief only -- does not treat the underlying inflammatory process; particularly useful for reducing urgency and fecal incontinence; recommended dose is 2-4 mg after first loose stool, then 2 mg after each subsequent loose stool (maximum 16 mg per day); should be used in combination with disease-modifying therapy (budesonide), not as sole treatment"
      }
    ],
    pearls: [
      "The defining feature of microscopic colitis is that the colon looks NORMAL on colonoscopy but shows inflammation on microscopic biopsy -- always random biopsies from multiple colonic segments are required for diagnosis because changes can be patchy",
      "There are two subtypes: collagenous colitis (thickened subepithelial collagen band greater than 10 micrometers) and lymphocytic colitis (greater than 20 intraepithelial lymphocytes per 100 surface epithelial cells); both present identically with chronic watery diarrhea",
      "Common medication triggers include NSAIDs, proton pump inhibitors (especially lansoprazole), SSRIs, and statins -- always review the medication list and consult with the prescriber about discontinuing potential offenders",
      "Budesonide is first-line treatment with an 80% remission rate, but relapse occurs in 60-80% of patients after stopping -- many patients need long-term low-dose maintenance therapy at 3-6 mg daily",
      "Nocturnal diarrhea is a distinguishing clinical feature of microscopic colitis and helps differentiate it from irritable bowel syndrome (IBS), which typically does not cause nighttime symptoms",
      "Always screen for celiac disease in patients with microscopic colitis because the two conditions commonly coexist and untreated celiac disease will perpetuate diarrhea despite treatment",
      "Black stools from bismuth subsalicylate are a harmless expected effect -- always inform patients proactively to prevent unnecessary alarm and emergency department visits for presumed GI bleeding"
    ],
    quiz: [
      {
        question: "A patient undergoes colonoscopy for chronic watery diarrhea. The colonoscopy report states that the colonic mucosa appears normal. The practical nurse understands that this finding:",
        options: [
          "Rules out microscopic colitis as a diagnosis",
          "Is expected in microscopic colitis because diagnosis requires microscopic biopsy examination",
          "Indicates the diarrhea is caused by irritable bowel syndrome",
          "Means the colonoscopy should be repeated in 6 months"
        ],
        correct: 1,
        rationale: "Microscopic colitis is defined by its normal-appearing colonic mucosa on visual inspection during colonoscopy. The diagnosis can only be made through microscopic examination of random colonic biopsies, which reveals either a thickened collagen band (collagenous type) or increased intraepithelial lymphocytes (lymphocytic type). A grossly normal colonoscopy does NOT rule out microscopic colitis."
      },
      {
        question: "A patient with microscopic colitis is taking bismuth subsalicylate and reports having black-colored stools. What is the most appropriate nursing response?",
        options: [
          "Withhold the medication and report suspected GI bleeding to the physician",
          "Obtain a stool sample for occult blood testing immediately",
          "Reassure the patient that black stool is an expected and harmless effect of bismuth",
          "Administer a proton pump inhibitor to prevent GI bleeding"
        ],
        correct: 2,
        rationale: "Bismuth subsalicylate commonly causes harmless black discoloration of the stool and tongue due to the bismuth component reacting with sulfur in the GI tract. This is an expected effect and does not indicate GI bleeding. Patients should be informed about this proactively. However, if there are other signs of GI bleeding (hemodynamic changes, melena odor), further evaluation would be warranted."
      },
      {
        question: "The practical nurse is monitoring a patient with microscopic colitis who has experienced 8 watery stools today. Which assessment finding should be reported immediately?",
        options: [
          "Mild abdominal cramping after meals",
          "Fatigue and desire to rest in bed",
          "Blood pressure of 85/52 mmHg with heart rate of 124 beats per minute",
          "Request for additional dietary information"
        ],
        correct: 2,
        rationale: "A blood pressure of 85/52 with a heart rate of 124 indicates hemodynamic instability from severe dehydration caused by high-volume diarrheal fluid losses. This requires immediate intervention including IV fluid resuscitation and physician notification. Mild cramping and fatigue are expected findings in microscopic colitis, and a request for information is a positive patient engagement sign."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nDone: ${injected} injected, ${skipped} skipped`);
