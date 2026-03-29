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
  "syringomyelia-rpn": {
    title: "Syringomyelia for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Syringomyelia",
      content: "Syringomyelia is a chronic neurological disorder characterized by the formation of a fluid-filled cavity (syrinx) within the central canal of the spinal cord. The syrinx most commonly develops in the cervical region but can extend into the thoracic cord. As the syrinx enlarges, it progressively damages the spinothalamic tract fibers that cross in the anterior white commissure, producing the hallmark clinical finding: a cape-like (shawl-like) distribution of dissociated sensory loss affecting pain and temperature sensation while preserving light touch and proprioception in the upper extremities and across the shoulders. This dissociated sensory loss occurs because the crossing spinothalamic fibers (carrying pain and temperature) are disrupted by the expanding cavity, while the dorsal columns (carrying light touch, vibration, and proprioception) remain intact as they ascend ipsilaterally without crossing at the cord level. The most common cause of syringomyelia is Chiari malformation type I, in which the cerebellar tonsils herniate through the foramen magnum and obstruct normal cerebrospinal fluid (CSF) flow at the craniocervical junction. This obstruction creates abnormal pressure differentials during activities that increase intrathoracic pressure (coughing, straining, Valsalva maneuver), forcing CSF into the central canal of the spinal cord and forming or enlarging the syrinx. Other causes include spinal cord trauma, spinal cord tumors (intramedullary), arachnoiditis, and tethered cord syndrome. As the syrinx expands laterally, it can damage the anterior horn cells (lower motor neurons), causing muscle weakness, atrophy, and fasciculations in the hands and upper extremities. If the syrinx extends into the lateral columns, it may affect the corticospinal tracts (upper motor neuron signs in the lower extremities) and the intermediolateral cell column (autonomic dysfunction including Horner syndrome with ipsilateral miosis, ptosis, and anhidrosis). Diagnosis is confirmed by MRI of the spine, which demonstrates the fluid-filled cavity within the spinal cord parenchyma. The MRI also evaluates for associated Chiari malformation, which appears as cerebellar tonsillar herniation greater than 5 mm below the foramen magnum. For the practical nurse, understanding syringomyelia is essential because patients have impaired pain and temperature sensation, placing them at significant risk for burns and injuries they cannot feel. Nursing care centers on safety precautions, pain management, neurological monitoring, and preparing patients for potential surgical intervention (posterior fossa decompression for Chiari malformation or syrinx shunting)."
    },
    riskFactors: [
      "Chiari malformation type I (most common association, present in up to 80% of cases)",
      "History of spinal cord injury (post-traumatic syringomyelia can develop months to years after injury)",
      "Spinal cord tumors, particularly intramedullary tumors such as ependymoma or hemangioblastoma",
      "History of meningitis or arachnoiditis (inflammation causes CSF flow obstruction)",
      "Tethered spinal cord (congenital malformation altering CSF dynamics)",
      "Spinal surgeries or procedures that may alter CSF flow patterns",
      "Age 25-40 years at presentation (peak incidence, though symptoms may begin earlier)"
    ],
    diagnostics: [
      "MRI of the spine with and without contrast: gold standard for diagnosis; demonstrates the fluid-filled syrinx cavity within the spinal cord; T2-weighted images show the cavity as hyperintense (bright) signal identical to CSF",
      "MRI of the brain (posterior fossa): evaluates for Chiari malformation type I; cerebellar tonsillar herniation greater than 5 mm below the foramen magnum confirms Chiari I",
      "CSF flow study (cine MRI): evaluates CSF flow dynamics at the craniocervical junction; identifies obstruction that may be causing or worsening the syrinx",
      "Neurological examination: documents baseline sensory deficits, motor strength, and reflex changes; serial examinations detect progression",
      "Electromyography (EMG) and nerve conduction studies: evaluate lower motor neuron involvement in the upper extremities; detect denervation in hand and arm muscles",
      "Somatosensory evoked potentials (SSEPs): assess dorsal column function and help monitor spinal cord integrity during surgical procedures"
    ],
    management: [
      "Surgical referral for posterior fossa decompression if Chiari malformation is present (first-line definitive treatment to restore CSF flow)",
      "Syrinx shunting (syringosubarachnoid or syringoperitoneal shunt) may be considered if decompression alone does not reduce the syrinx",
      "Administer prescribed analgesics for neuropathic pain management; gabapentin and pregabalin are commonly used first-line agents",
      "Implement fall prevention measures due to impaired sensation and potential motor weakness",
      "Instruct patient to avoid activities that increase intrathoracic pressure (heavy lifting, straining, prolonged coughing) as these can enlarge the syrinx",
      "Occupational therapy referral for hand weakness and fine motor difficulties; adaptive devices may be needed",
      "Regular follow-up MRI monitoring (typically every 6-12 months) to track syrinx size and progression"
    ],
    nursingActions: [
      "Perform and document thorough neurological assessment including sensory testing for pain, temperature, and light touch in a dermatomal pattern at each visit",
      "Implement burn and injury prevention education: test water temperature with unaffected areas, use oven mitts, avoid hot surfaces -- patients cannot feel burns in affected areas",
      "Monitor for signs of increased intracranial pressure if Chiari malformation is present: headache worsened by coughing or straining, nausea, visual changes",
      "Assess hand grip strength bilaterally and document changes; progressive weakness indicates syrinx expansion into anterior horn cells",
      "Administer pain medications on schedule rather than PRN for chronic neuropathic pain management",
      "Post-operative care after decompression: monitor neurological status hourly, assess surgical site for CSF leak (clear fluid on dressing), maintain head of bed at prescribed angle",
      "Educate patient about activity restrictions: avoid Valsalva maneuver, heavy lifting, and contact sports that could worsen the syrinx"
    ],
    assessmentFindings: [
      "Cape-like (shawl) distribution of dissociated sensory loss: absent pain and temperature sensation across shoulders, upper back, and arms with preserved light touch",
      "Muscle weakness and atrophy in the hands and upper extremities (claw hand deformity in advanced cases due to intrinsic hand muscle wasting)",
      "Absent or diminished deep tendon reflexes in the upper extremities (lower motor neuron damage from anterior horn cell destruction)",
      "Neuropathic pain described as burning, tingling, or electric shock sensation in the neck, shoulders, and arms",
      "Horner syndrome (ipsilateral miosis, ptosis, anhidrosis) if the syrinx affects the intermediolateral cell column at C8-T2",
      "Scoliosis (particularly in pediatric patients, often the presenting sign before other neurological symptoms appear)",
      "Headache worsened by coughing, sneezing, or straining (if associated Chiari malformation is present)"
    ],
    signs: {
      left: [
        "Numbness or tingling in hands and fingers",
        "Mild weakness in hand grip",
        "Stiffness in neck and shoulders",
        "Burning or aching pain in upper extremities",
        "Difficulty with fine motor tasks (buttoning, writing)",
        "Mild headache with coughing or straining"
      ],
      right: [
        "Complete loss of pain and temperature sensation in cape distribution",
        "Severe hand muscle atrophy with claw hand deformity",
        "Progressive lower extremity spasticity and gait disturbance",
        "Respiratory compromise if syrinx extends to brainstem (syringobulbia)",
        "Autonomic dysreflexia symptoms (if thoracic cord involved)",
        "Rapidly progressing neurological deficits indicating acute syrinx expansion"
      ]
    },
    medications: [
      {
        name: "Gabapentin (Neurontin)",
        type: "Anticonvulsant / neuropathic pain agent",
        action: "Binds to the alpha-2-delta subunit of voltage-gated calcium channels in the dorsal horn of the spinal cord, reducing excitatory neurotransmitter release and dampening abnormal pain signal transmission in neuropathic pain states",
        sideEffects: "Drowsiness, dizziness, peripheral edema, weight gain, ataxia, blurred vision",
        contra: "Known hypersensitivity; use caution in renal impairment (dose adjustment required as gabapentin is renally cleared); avoid abrupt discontinuation (risk of seizures)",
        pearl: "Start at low dose (100-300 mg at bedtime) and titrate gradually over weeks to minimize sedation; commonly used first-line for the burning neuropathic pain of syringomyelia; administer doses evenly throughout the day for best pain control"
      },
      {
        name: "Baclofen (Lioresal)",
        type: "Centrally acting skeletal muscle relaxant (GABA-B receptor agonist)",
        action: "Activates GABA-B receptors in the spinal cord, inhibiting both monosynaptic and polysynaptic reflex arcs, reducing muscle spasticity and spasm that develops when the syrinx damages the corticospinal tracts",
        sideEffects: "Drowsiness, dizziness, weakness, nausea, urinary frequency, confusion; abrupt withdrawal can cause hallucinations, seizures, and rebound spasticity",
        contra: "Hypersensitivity to baclofen; use caution in renal impairment, seizure disorders, and elderly patients",
        pearl: "NEVER discontinue abruptly -- must be tapered gradually over 1-2 weeks to prevent potentially life-threatening withdrawal syndrome (high fever, altered mental status, rebound spasticity, rhabdomyolysis); intrathecal baclofen pump may be considered for severe spasticity unresponsive to oral therapy"
      },
      {
        name: "Oxycodone (OxyContin/Percocet)",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system, altering perception of and emotional response to pain by inhibiting ascending pain pathways and activating descending inhibitory pathways",
        sideEffects: "Respiratory depression, constipation, nausea, sedation, pruritus, urinary retention, physical dependence and tolerance with prolonged use",
        contra: "Significant respiratory depression; acute or severe bronchial asthma in unmonitored settings; known or suspected GI obstruction including paralytic ileus; concurrent use with MAOIs or within 14 days of discontinuation",
        pearl: "Reserved for moderate to severe pain not controlled by gabapentin or other non-opioid options; always co-prescribe a bowel regimen (stool softener plus stimulant laxative) to prevent opioid-induced constipation; assess pain level and sedation before each dose; monitor respiratory rate (hold if below 12 breaths per minute)"
      }
    ],
    pearls: [
      "Cape-like (shawl) dissociated sensory loss is the hallmark of syringomyelia: patients lose pain and temperature sensation across the shoulders and arms but retain light touch -- this puts them at extreme risk for unnoticed burns and injuries",
      "Chiari malformation type I is the most common underlying cause of syringomyelia -- always evaluate for headache worsened by coughing, straining, or Valsalva maneuver",
      "Patients must be educated to test bath water temperature with unaffected body parts and to use protective gloves when handling hot objects because they cannot feel thermal injury in affected areas",
      "Never abruptly discontinue baclofen -- withdrawal can cause life-threatening symptoms including seizures, high fever, altered mental status, and rebound spasticity",
      "MRI is the only definitive diagnostic tool for syringomyelia; plain X-rays and CT scans cannot visualize the syrinx within the spinal cord",
      "Progressive hand weakness and muscle wasting (intrinsic hand muscles) indicates the syrinx is expanding into the anterior horn cells -- report these changes promptly",
      "Scoliosis in a child or adolescent with no other explanation should raise suspicion for syringomyelia -- MRI screening may be indicated"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient diagnosed with syringomyelia. The patient asks why they can feel light touch on their hands but cannot feel pain or hot temperatures. Which explanation is most accurate?",
        options: [
          "The condition affects all sensory nerves equally but pain fibers recover more slowly",
          "The fluid-filled cavity in the spinal cord disrupts the crossing pain and temperature fibers while the light touch pathway remains intact",
          "The brain is unable to process pain signals due to a cortical lesion",
          "The peripheral nerves in the hands are damaged from compression"
        ],
        correct: 1,
        rationale: "In syringomyelia, the syrinx expands within the central spinal cord, disrupting the spinothalamic tract fibers that cross in the anterior white commissure (carrying pain and temperature). The dorsal columns (carrying light touch, vibration, and proprioception) travel ipsilaterally and are preserved, creating the characteristic dissociated sensory loss."
      },
      {
        question: "A patient with syringomyelia is being discharged. Which safety instruction is most important for the practical nurse to reinforce?",
        options: [
          "Avoid all physical activity to prevent syrinx enlargement",
          "Test bath water temperature with an unaffected body part before bathing because you may not feel burns in your arms and shoulders",
          "Take all medications only when pain becomes severe",
          "Sleep in a completely flat position without pillows"
        ],
        correct: 1,
        rationale: "Patients with syringomyelia have impaired pain and temperature sensation in the cape distribution (shoulders, arms, upper back). They are at significant risk for burns because they cannot feel hot temperatures. Testing water with an unaffected body part (such as the foot or face) prevents thermal injury."
      },
      {
        question: "A patient taking baclofen for spasticity related to syringomyelia tells the nurse they ran out of medication three days ago and stopped taking it. What is the nurse's priority action?",
        options: [
          "Reassure the patient that missing a few doses is not harmful",
          "Advise the patient to restart at the previous dose immediately",
          "Report immediately to the physician because abrupt baclofen withdrawal can cause seizures and life-threatening complications",
          "Recommend over-the-counter ibuprofen as a substitute until the prescription is refilled"
        ],
        correct: 2,
        rationale: "Abrupt discontinuation of baclofen can cause a potentially life-threatening withdrawal syndrome including high fever, altered mental status, rebound spasticity, seizures, and rhabdomyolysis. The physician must be notified immediately to determine appropriate management, which may include emergency reinitiation of baclofen."
      }
    ]
  },

  "tetanus-rpn": {
    title: "Tetanus for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Tetanus Infection",
      content: "Tetanus is a serious, life-threatening infectious disease caused by the anaerobic, spore-forming, gram-positive bacterium Clostridium tetani. The organism is found ubiquitously in soil, dust, animal feces, and rusty or contaminated objects. Tetanus spores enter the body through breaks in the skin, including puncture wounds, lacerations, burns, crush injuries, surgical wounds, injection sites (IV drug use), and even minor abrasions. Once the spores reach an anaerobic environment (deep wounds with devitalized tissue, poor blood supply, or presence of foreign bodies), they germinate into vegetative bacteria that produce two exotoxins: tetanospasmin and tetanolysin. Tetanospasmin is the primary pathogenic toxin and is one of the most potent biological toxins known. It travels via retrograde axonal transport from the site of infection along peripheral motor neurons to the spinal cord and brainstem. In the central nervous system, tetanospasmin irreversibly binds to the presynaptic terminals of inhibitory interneurons (Renshaw cells) and blocks the release of inhibitory neurotransmitters glycine and gamma-aminobutyric acid (GABA). Without these inhibitory signals, excitatory motor neurons fire unopposed, producing the hallmark clinical features of tetanus: sustained, involuntary, painful muscle contractions (spastic paralysis). This is fundamentally different from botulism, which produces flaccid paralysis by blocking acetylcholine release at the neuromuscular junction. The clinical presentation typically begins 3 to 21 days after inoculation (average 7-10 days incubation period). The first symptom is usually trismus (lockjaw), which is involuntary spasm of the masseter muscles making it impossible to open the mouth. This progresses to risus sardonicus (a sardonic grin produced by sustained facial muscle spasm), dysphagia (difficulty swallowing from pharyngeal spasm), and nuchal rigidity (neck stiffness). Generalized tetanus produces opisthotonus, a dramatic posture of severe hyperextension of the back with the head and heels bent backward and the body arched like a bow, caused by the powerful spasm of the paraspinal muscles. Autonomic dysfunction is a major cause of mortality and includes labile blood pressure, tachycardia, diaphoresis, and cardiac arrhythmias. Respiratory failure results from spasm of the laryngeal muscles (airway obstruction) and the diaphragm and intercostal muscles (inability to ventilate). Tetanus is entirely preventable through vaccination with the tetanus toxoid (part of DTaP in childhood and Tdap/Td boosters in adults). For the practical nurse, management involves administering tetanus immune globulin (TIG) for passive immunity, wound care, antibiotic therapy, and supportive care including airway management and muscle spasm control."
    },
    riskFactors: [
      "Incomplete or absent tetanus vaccination (most important risk factor; tetanus occurs almost exclusively in unvaccinated or incompletely vaccinated individuals)",
      "Puncture wounds, especially from rusty nails, splinters, or contaminated objects that create anaerobic conditions",
      "Crush injuries, burns, or wounds with devitalized (necrotic) tissue providing anaerobic environment for spore germination",
      "Injection drug use (contaminated needles and injection sites)",
      "Agricultural work and gardening (soil exposure to Clostridium tetani spores)",
      "Elderly individuals (waning immunity from childhood vaccination without booster doses)",
      "Neonatal tetanus in developing countries (umbilical stump contamination in unvaccinated mothers)"
    ],
    diagnostics: [
      "Clinical diagnosis: tetanus is diagnosed clinically based on characteristic presentation (trismus, risus sardonicus, opisthotonus, muscle rigidity); there is no confirmatory laboratory test",
      "Wound culture: may grow Clostridium tetani but is positive in only about 30% of cases; a negative culture does NOT rule out tetanus",
      "Spatula test: touching the posterior pharyngeal wall with a tongue depressor produces involuntary jaw clenching (positive test) rather than the normal gag reflex; high sensitivity and specificity for tetanus",
      "Serum tetanus antibody level: a level above 0.1 IU/mL is considered protective; low levels support clinical diagnosis in suspected cases",
      "CBC with differential: may show leukocytosis if secondary infection is present; otherwise often normal",
      "Creatine kinase (CK): may be markedly elevated from sustained muscle spasm and rhabdomyolysis"
    ],
    management: [
      "Administer tetanus immune globulin (TIG) 3,000-6,000 units IM as soon as possible to neutralize circulating unbound toxin (does not reverse toxin already bound to nerve tissue)",
      "Thorough wound debridement to remove devitalized tissue, foreign bodies, and anaerobic conditions; this is a critical intervention to stop further toxin production",
      "Administer metronidazole IV (preferred antibiotic) to kill vegetative Clostridium tetani bacteria and stop further toxin production",
      "Control muscle spasms with benzodiazepines (diazepam is first-line); severe cases may require neuromuscular blockade with intubation and mechanical ventilation",
      "Maintain airway patency: endotracheal intubation or tracheostomy may be required if laryngeal spasm occurs",
      "Manage autonomic instability: continuous cardiac monitoring, antihypertensives or vasopressors as needed for labile blood pressure",
      "Begin active immunization with tetanus toxoid vaccine during hospitalization (tetanus disease does not confer natural immunity)"
    ],
    nursingActions: [
      "Maintain a quiet, dimly lit, low-stimulation environment: external stimuli (noise, light, touch) can trigger severe muscle spasms in tetanus patients",
      "Monitor respiratory status continuously: assess for signs of laryngeal spasm (stridor, inability to speak), diaphragm spasm (shallow breathing, desaturation), and intercostal spasm",
      "Keep emergency airway equipment (ambu bag, suction, intubation tray) at bedside at all times",
      "Administer benzodiazepines on schedule as prescribed for muscle spasm prevention rather than waiting for spasms to occur",
      "Assess wound site daily: ensure adequate debridement has been performed, monitor for signs of secondary infection",
      "Monitor intake and output strictly: patients may be unable to swallow (dysphagia from pharyngeal spasm); anticipate need for IV fluids and enteral or parenteral nutrition",
      "Document frequency, duration, and severity of muscle spasms including any triggers identified",
      "Verify tetanus vaccination status and ensure patient receives tetanus toxoid before discharge (having tetanus does NOT provide future immunity)"
    ],
    assessmentFindings: [
      "Trismus (lockjaw): inability to open the mouth due to masseter muscle spasm; often the earliest symptom",
      "Risus sardonicus: sustained spasm of facial muscles producing a sardonic, grimacing smile",
      "Opisthotonus: severe hyperextension of the back with the head and heels bent backward in an arched position from paraspinal muscle spasm",
      "Generalized muscle rigidity with superimposed painful spasms triggered by stimuli (noise, light, touch, movement)",
      "Dysphagia (difficulty swallowing) and drooling from pharyngeal muscle spasm",
      "Autonomic instability: labile blood pressure (alternating hypertension and hypotension), tachycardia, diaphoresis, fever, cardiac arrhythmias",
      "Respiratory compromise: tachypnea, oxygen desaturation, stridor (laryngeal spasm), apnea (diaphragm spasm)"
    ],
    signs: {
      left: [
        "Jaw stiffness or difficulty opening the mouth",
        "Neck stiffness and difficulty swallowing",
        "Restlessness and irritability",
        "Localized muscle stiffness near wound site",
        "Low-grade fever",
        "Wound with necrotic tissue or foreign body"
      ],
      right: [
        "Complete trismus with inability to open mouth (lockjaw)",
        "Opisthotonus (severe back hyperextension and arching)",
        "Generalized tonic-clonic spasms triggered by minimal stimulation",
        "Laryngeal spasm with stridor and airway compromise",
        "Respiratory failure requiring mechanical ventilation",
        "Autonomic crisis: labile blood pressure, arrhythmias, cardiac arrest"
      ]
    },
    medications: [
      {
        name: "Tetanus Immune Globulin (TIG / HyperTET)",
        type: "Passive immunizing agent (human immunoglobulin)",
        action: "Provides immediate passive immunity by supplying preformed antibodies (immunoglobulin G) that bind to and neutralize circulating tetanospasmin toxin before it can attach to nerve tissue; does not affect toxin already bound to neurons",
        sideEffects: "Injection site pain, tenderness, and swelling; low-grade fever; rare anaphylactic reactions; soreness lasting 24-48 hours",
        contra: "History of severe allergic reaction to human immunoglobulin preparations; administer at a different anatomical site from tetanus toxoid vaccine (different arm)",
        pearl: "Must be given as early as possible because TIG can only neutralize unbound circulating toxin; once tetanospasmin binds irreversibly to nerve tissue, TIG cannot reverse its effects; administer 3,000-6,000 units IM for treatment (250 units IM for prophylaxis in wound management)"
      },
      {
        name: "Metronidazole (Flagyl)",
        type: "Nitroimidazole antibiotic (anaerobic bactericidal agent)",
        action: "Enters anaerobic bacterial cells where it is reduced to toxic metabolites that damage DNA, inhibiting nucleic acid synthesis and causing bacterial cell death; highly effective against anaerobic organisms including Clostridium tetani",
        sideEffects: "Metallic taste, nausea, vomiting, diarrhea, dark or red-brown urine (harmless), peripheral neuropathy with prolonged use, disulfiram-like reaction with alcohol",
        contra: "First trimester of pregnancy; concurrent alcohol use (causes severe disulfiram-like reaction with nausea, vomiting, flushing, tachycardia); known hypersensitivity",
        pearl: "Preferred over penicillin G for tetanus treatment because penicillin is a GABA antagonist and may theoretically worsen muscle spasms; instruct patient to avoid ALL alcohol during treatment and for 48 hours after the last dose; monitor for peripheral neuropathy (numbness, tingling) with prolonged courses"
      },
      {
        name: "Diazepam (Valium)",
        type: "Benzodiazepine (GABA-A receptor agonist / muscle relaxant / anticonvulsant)",
        action: "Enhances the effect of GABA at GABA-A receptors in the central nervous system, increasing chloride ion conductance and producing neuronal hyperpolarization; provides muscle relaxation, anticonvulsant activity, sedation, and anxiolysis to counteract the loss of inhibitory neurotransmission caused by tetanospasmin",
        sideEffects: "Respiratory depression, excessive sedation, hypotension, paradoxical agitation, physical dependence with prolonged use, injection site irritation (IV formulation)",
        contra: "Severe respiratory depression; acute narrow-angle glaucoma; known hypersensitivity to benzodiazepines; use with extreme caution in combination with opioids (additive respiratory depression)",
        pearl: "First-line agent for controlling tetanus muscle spasms; large doses may be required (up to 120 mg/day or more in severe tetanus); administer IV slowly (no faster than 5 mg/minute) to prevent respiratory depression and hypotension; have flumazenil available as reversal agent; continuous infusion may be needed in severe cases"
      }
    ],
    pearls: [
      "Tetanus produces spastic paralysis (sustained muscle contraction from loss of inhibitory neurotransmitters) -- this is the OPPOSITE of botulism, which produces flaccid paralysis (loss of excitatory neurotransmission at the neuromuscular junction)",
      "Maintain a quiet, dark, low-stimulation environment because any sensory input (noise, light, touch, vibration) can trigger life-threatening muscle spasms in the tetanus patient",
      "Tetanus immune globulin (TIG) must be given as EARLY as possible because it can ONLY neutralize circulating unbound toxin -- once tetanospasmin binds to nerve tissue, the binding is irreversible",
      "Metronidazole is preferred over penicillin for tetanus because penicillin has GABA-antagonist properties that may theoretically worsen muscle spasms",
      "Having tetanus does NOT confer natural immunity -- the patient must receive tetanus toxoid vaccine during recovery to prevent future infection",
      "The spatula test (pharyngeal wall stimulation causing jaw clenching instead of gag reflex) is a bedside clinical test with high sensitivity and specificity for tetanus diagnosis",
      "Always check tetanus immunization status for ANY wound, especially puncture wounds, crush injuries, burns, and wounds contaminated with soil or feces -- tetanus prophylaxis saves lives"
    ],
    quiz: [
      {
        question: "A patient presents to the emergency department with jaw stiffness, difficulty opening the mouth, and a history of stepping on a rusty nail one week ago. The practical nurse recognizes these findings are most consistent with which condition?",
        options: [
          "Botulism",
          "Tetanus",
          "Guillain-Barre syndrome",
          "Myasthenia gravis"
        ],
        correct: 1,
        rationale: "Trismus (lockjaw) following a puncture wound is the classic presenting symptom of tetanus caused by Clostridium tetani. Tetanus produces spastic paralysis from loss of inhibitory neurotransmission. Botulism produces flaccid paralysis. Guillain-Barre syndrome causes ascending flaccid paralysis. Myasthenia gravis causes fatigable weakness."
      },
      {
        question: "A practical nurse is caring for a patient with tetanus. Which environmental modification is most important to prevent triggering muscle spasms?",
        options: [
          "Keep the room brightly lit for close observation",
          "Maintain a quiet, dimly lit environment with minimal stimulation",
          "Play calming music at a moderate volume",
          "Encourage frequent visitors to provide emotional support"
        ],
        correct: 1,
        rationale: "External sensory stimuli including noise, bright light, touch, and vibration can trigger severe, life-threatening muscle spasms in tetanus patients. Maintaining a quiet, dimly lit, low-stimulation environment minimizes triggers. Visitors, music, and bright lighting all increase sensory input and spasm risk."
      },
      {
        question: "A patient is receiving tetanus immune globulin (TIG) and the tetanus toxoid vaccine simultaneously. The practical nurse should administer these injections in which manner?",
        options: [
          "Both injections in the same arm at the same site",
          "Both injections mixed in the same syringe",
          "At different anatomical sites using separate syringes",
          "The TIG first, then the vaccine 24 hours later"
        ],
        correct: 2,
        rationale: "Tetanus immune globulin (TIG) and tetanus toxoid vaccine must be administered at different anatomical sites (different arms) using separate syringes. Administering at the same site or mixing them would allow the antibodies in TIG to neutralize the vaccine antigen, reducing the immune response to the vaccine."
      }
    ]
  },

  "thrombocytopenia-rpn": {
    title: "Thrombocytopenia for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Thrombocytopenia",
      content: "Thrombocytopenia is defined as a platelet count below 150,000/microL (150 x 10^9/L). Platelets (thrombocytes) are small, disc-shaped cellular fragments produced by megakaryocytes in the bone marrow. They play an essential role in primary hemostasis by forming the initial platelet plug at sites of vascular injury. When a blood vessel is damaged, exposed collagen and von Willebrand factor (VWF) bind to platelet surface receptors (glycoprotein Ib), causing platelet adhesion. Activated platelets then release granule contents (ADP, thromboxane A2, serotonin) that recruit additional platelets, which aggregate together through fibrinogen bridges between glycoprotein IIb/IIIa receptors. This platelet plug forms the foundation upon which the coagulation cascade builds a stable fibrin clot. When platelet counts fall below normal, this primary hemostasis mechanism is impaired, leading to mucocutaneous bleeding manifestations. Thrombocytopenia can result from three primary mechanisms: decreased platelet production (bone marrow failure from aplastic anemia, leukemia, chemotherapy, radiation, vitamin B12 or folate deficiency, alcohol toxicity); increased platelet destruction (immune thrombocytopenic purpura [ITP], heparin-induced thrombocytopenia [HIT], thrombotic thrombocytopenic purpura [TTP], disseminated intravascular coagulation [DIC], infections); or increased platelet sequestration (hypersplenism where an enlarged spleen traps up to 90% of circulating platelets). Immune thrombocytopenic purpura (ITP) is the most common cause of isolated thrombocytopenia in otherwise healthy patients. In ITP, autoantibodies (IgG) coat platelet surfaces, marking them for premature destruction by splenic macrophages. The platelet lifespan decreases from the normal 8-10 days to just hours. Heparin-induced thrombocytopenia (HIT) is a paradoxical prothrombotic condition where antibodies form against heparin-platelet factor 4 (PF4) complexes, causing platelet activation, aggregation, and consumption with simultaneous thrombin generation, creating a dangerous hypercoagulable state despite low platelet counts. Thrombotic thrombocytopenic purpura (TTP) results from severely reduced ADAMTS13 enzyme activity, causing ultra-large VWF multimers to persist in circulation and form platelet-rich microthrombi in small vessels, consuming platelets and causing microangiopathic hemolytic anemia (MAHA) with schistocytes on blood smear. The severity of bleeding risk correlates with the platelet count: mild thrombocytopenia (100,000-150,000) usually causes no symptoms; moderate (50,000-100,000) may cause prolonged bleeding after trauma or surgery; severe (20,000-50,000) causes spontaneous mucocutaneous bleeding; critical (below 10,000-20,000) carries significant risk of spontaneous intracranial hemorrhage."
    },
    riskFactors: [
      "Chemotherapy or radiation therapy (bone marrow suppression is the most common cause of thrombocytopenia in hospitalized patients)",
      "Heparin therapy (heparin-induced thrombocytopenia [HIT] occurs in 1-5% of patients receiving unfractionated heparin)",
      "Liver cirrhosis with portal hypertension (splenic sequestration from splenomegaly and decreased thrombopoietin production)",
      "Autoimmune disorders (systemic lupus erythematosus, antiphospholipid syndrome, ITP)",
      "Viral infections (HIV, hepatitis C, EBV, CMV cause platelet destruction or bone marrow suppression)",
      "Excessive alcohol use (direct bone marrow toxicity, folate deficiency, hypersplenism from liver disease)",
      "Bone marrow disorders (leukemia, myelodysplastic syndrome, aplastic anemia, multiple myeloma)"
    ],
    diagnostics: [
      "Complete blood count (CBC) with platelet count: confirms thrombocytopenia (below 150,000/microL); also evaluates for concurrent anemia or leukocyte abnormalities suggesting bone marrow disorder",
      "Peripheral blood smear: evaluates platelet size and morphology; large platelets suggest increased destruction (ITP); schistocytes (fragmented red blood cells) suggest TTP/DIC; platelet clumping may indicate pseudothrombocytopenia",
      "Coagulation studies (PT/INR, aPTT, fibrinogen, D-dimer): normal in ITP; prolonged PT/aPTT with elevated D-dimer and low fibrinogen suggest DIC",
      "Heparin-PF4 antibody test (ELISA) and serotonin release assay: diagnostic for heparin-induced thrombocytopenia (HIT)",
      "ADAMTS13 activity level: severely reduced (below 10%) in thrombotic thrombocytopenic purpura (TTP)",
      "Bone marrow biopsy: evaluates megakaryocyte number and morphology; increased megakaryocytes in ITP (production is intact but destruction is accelerated); decreased in aplastic anemia or marrow infiltration"
    ],
    management: [
      "Implement bleeding precautions for all patients with platelet count below 50,000: soft toothbrush, electric razor only, avoid rectal temperatures and IM injections",
      "Administer platelet transfusions as ordered for active bleeding or platelet count below 10,000-20,000 (prophylactic threshold varies by clinical situation)",
      "For ITP: administer corticosteroids (prednisone) as first-line therapy to suppress autoantibody production; IV immunoglobulin (IVIG) for rapid platelet elevation in emergencies",
      "For HIT: immediately discontinue ALL heparin products (including heparin flushes and heparin-coated catheters) and initiate alternative anticoagulation with argatroban or bivalirudin",
      "For TTP: urgent plasma exchange (plasmapheresis) is the definitive treatment; do NOT transfuse platelets in TTP as this can worsen microvascular thrombosis",
      "Avoid medications that impair platelet function: aspirin, NSAIDs, and other antiplatelet agents unless specifically ordered",
      "Address underlying cause: treat infection, discontinue offending medications, correct nutritional deficiencies (B12, folate)"
    ],
    nursingActions: [
      "Monitor platelet count trends daily and report values below 50,000 or any significant drop (50% decrease from baseline may indicate HIT in heparin-treated patients)",
      "Implement strict bleeding precautions: use soft-bristle toothbrush, electric razor only, avoid IM injections, use smallest gauge needle possible for venipuncture, apply prolonged pressure (5-10 minutes) to all puncture sites",
      "Perform systematic bleeding assessment: inspect skin for petechiae, purpura, and ecchymosis; check gums for bleeding; test stool for occult blood; assess urine for hematuria; monitor for headache or neurological changes (intracranial hemorrhage)",
      "Apply pressure to venipuncture and injection sites for a minimum of 5 minutes; assess for continued oozing after releasing pressure",
      "Avoid rectal temperatures, rectal medications (suppositories, enemas), and vigorous suctioning which can cause mucosal trauma and bleeding",
      "Educate patient about fall prevention and avoidance of contact sports or activities with high injury risk",
      "Monitor for signs of transfusion reaction during platelet administration: fever, chills, urticaria, dyspnea, hypotension"
    ],
    assessmentFindings: [
      "Petechiae: small (1-2 mm), flat, round, red-purple spots that do not blanch with pressure; indicate capillary bleeding from platelet deficiency",
      "Purpura: larger (3 mm to 1 cm) purple discolorations from subcutaneous bleeding; may be palpable (vasculitis) or non-palpable (thrombocytopenia)",
      "Ecchymosis: large bruises (greater than 1 cm) appearing after minimal or no trauma; commonly on extremities and trunk",
      "Mucosal bleeding: epistaxis (nosebleeds), gingival bleeding (especially with tooth brushing), oral blood blisters (wet purpura indicates higher bleeding risk)",
      "Prolonged bleeding from minor cuts, venipuncture sites, or surgical wounds that is difficult to control with standard pressure",
      "Hematuria (blood in urine), melena (tarry stools), or hematemesis (vomiting blood) indicating internal bleeding",
      "Menorrhagia (heavy menstrual bleeding) in female patients; may be the presenting symptom of thrombocytopenia"
    ],
    signs: {
      left: [
        "Easy bruising with minimal trauma",
        "Petechiae on skin, especially lower extremities",
        "Mild epistaxis or gingival bleeding",
        "Prolonged oozing from venipuncture sites",
        "Fatigue (if concurrent anemia present)",
        "Heavy menstrual periods (menorrhagia)"
      ],
      right: [
        "Spontaneous mucosal hemorrhage (oral blood blisters, wet purpura)",
        "Severe epistaxis unresponsive to direct pressure",
        "Hematuria, melena, or hematemesis",
        "Sudden severe headache with neurological changes (intracranial hemorrhage)",
        "Hypotension, tachycardia, and pallor indicating hemorrhagic shock",
        "Platelet count below 10,000 with active bleeding"
      ]
    },
    medications: [
      {
        name: "Prednisone (Deltasone)",
        type: "Systemic corticosteroid (glucocorticoid / immunosuppressant)",
        action: "Suppresses the immune system by inhibiting T-cell activation, reducing autoantibody production by B-cells, decreasing macrophage phagocytic activity in the spleen, and reducing the destruction of antibody-coated platelets; first-line treatment for immune thrombocytopenic purpura (ITP)",
        sideEffects: "Hyperglycemia, immunosuppression (increased infection risk), weight gain, fluid retention, mood changes, insomnia, osteoporosis, gastric ulceration, adrenal suppression with prolonged use",
        contra: "Active untreated systemic fungal infection; live vaccine administration during therapy; use caution in diabetes (worsens hyperglycemia), peptic ulcer disease, and osteoporosis",
        pearl: "ITP treatment typically starts at 1 mg/kg/day for 2-4 weeks then tapers gradually; NEVER stop abruptly after prolonged use (risk of adrenal crisis); monitor blood glucose closely (especially in diabetic patients); give with food to reduce GI irritation; platelet count usually begins to rise within 3-7 days"
      },
      {
        name: "Intravenous Immunoglobulin (IVIG / Gamunex / Privigen)",
        type: "Passive immunizing agent (pooled human immunoglobulin)",
        action: "Saturates Fc receptors on splenic macrophages with exogenous IgG, competitively inhibiting the phagocytosis of antibody-coated platelets; also modulates autoimmune response and reduces autoantibody production; provides rapid but temporary platelet count elevation",
        sideEffects: "Headache (common and may be severe), fever, chills, nausea, myalgia, aseptic meningitis, renal failure (especially with sucrose-containing formulations), thromboembolic events, volume overload, anaphylaxis in IgA-deficient patients",
        contra: "Selective IgA deficiency with anti-IgA antibodies (risk of anaphylaxis); severe renal impairment (use IgA-depleted products); hypercoagulable states (increased thrombosis risk)",
        pearl: "Used for rapid platelet elevation in emergencies (active bleeding with platelets below 20,000 or before urgent surgery); platelet count typically rises within 24-48 hours but effect is temporary (2-4 weeks); infuse slowly and monitor for headache, which may indicate aseptic meningitis; premedicate with acetaminophen and diphenhydramine to reduce infusion reactions"
      },
      {
        name: "Romiplostim (Nplate)",
        type: "Thrombopoietin receptor agonist (TPO-RA)",
        action: "Binds to and activates the thrombopoietin receptor (c-Mpl) on megakaryocyte precursors in the bone marrow, stimulating megakaryocyte proliferation and differentiation to increase platelet production; works independently of the immune destruction mechanism",
        sideEffects: "Headache, myalgia, arthralgia, fatigue, dizziness, abdominal pain, injection site reactions; risk of bone marrow reticulin fiber deposition with prolonged use; rebound thrombocytopenia upon discontinuation",
        contra: "Not for use in thrombocytopenia due to myelodysplastic syndrome (increased risk of blast transformation to acute leukemia); caution with bone marrow disorders",
        pearl: "Administered as a weekly subcutaneous injection; dose is adjusted based on weekly platelet counts to maintain platelet count between 50,000 and 200,000; available through a restricted distribution program (NEXUS); monitor CBC with peripheral smear monthly during treatment to detect bone marrow changes"
      }
    ],
    pearls: [
      "Petechiae (pinpoint, non-blanching red spots), purpura (larger purple patches), and ecchymosis (large bruises) are the hallmark signs of thrombocytopenia -- assess skin systematically at each care interaction",
      "In heparin-induced thrombocytopenia (HIT), ALL heparin must be discontinued immediately, including heparin flushes and heparin-coated central lines -- HIT is a prothrombotic state despite low platelets",
      "NEVER transfuse platelets in thrombotic thrombocytopenic purpura (TTP) -- this adds fuel to the fire by providing more platelets for microthrombi formation and can be fatal",
      "Oral blood blisters (wet purpura) indicate a higher bleeding risk than skin petechiae alone and should be reported immediately",
      "Apply firm, direct pressure to ALL venipuncture and injection sites for a minimum of 5 minutes in thrombocytopenic patients; do not rub the site",
      "Avoid rectal temperatures, suppositories, and enemas in patients with thrombocytopenia due to the high risk of rectal mucosal bleeding",
      "Report any sudden severe headache in a thrombocytopenic patient immediately -- this may indicate intracranial hemorrhage, which is the most feared complication and leading cause of death"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient with a platelet count of 18,000/microL. Which nursing intervention is most important?",
        options: [
          "Administer aspirin for the patient's headache",
          "Use a soft-bristle toothbrush, electric razor, and avoid IM injections",
          "Take a rectal temperature for accuracy",
          "Encourage vigorous exercise to stimulate platelet production"
        ],
        correct: 1,
        rationale: "With a platelet count of 18,000, the patient is at high risk for spontaneous bleeding. Bleeding precautions include using a soft-bristle toothbrush, electric razor only, avoiding IM injections, and applying prolonged pressure to venipuncture sites. Aspirin further impairs platelet function. Rectal temperatures risk mucosal bleeding. Exercise increases injury risk."
      },
      {
        question: "A patient on a heparin infusion has a platelet count that dropped from 200,000 to 85,000 over 5 days. The practical nurse suspects heparin-induced thrombocytopenia (HIT). What is the priority action?",
        options: [
          "Continue the heparin infusion and recheck the platelet count tomorrow",
          "Report the finding immediately so ALL heparin products can be discontinued",
          "Increase the heparin dose to prevent clot formation",
          "Administer a platelet transfusion to raise the count"
        ],
        correct: 1,
        rationale: "A 50% or greater drop in platelet count within 5-10 days of starting heparin is highly suspicious for HIT. All heparin products (including flushes and coated catheters) must be discontinued immediately. HIT is paradoxically a prothrombotic condition, so increasing heparin would worsen thrombosis risk. The physician must be notified for alternative anticoagulation."
      },
      {
        question: "A patient with immune thrombocytopenic purpura (ITP) is receiving IVIG. Which assessment finding should the nurse report immediately?",
        options: [
          "Mild injection site discomfort",
          "Severe headache with neck stiffness and photophobia",
          "Temperature of 37.2 degrees Celsius (99 degrees Fahrenheit)",
          "Mild nausea after the infusion"
        ],
        correct: 1,
        rationale: "Severe headache with neck stiffness and photophobia during or after IVIG infusion may indicate aseptic meningitis, a known serious adverse effect. This requires immediate medical evaluation. Mild injection site discomfort, low-grade fever, and mild nausea are common expected side effects that can be managed symptomatically."
      }
    ]
  },

  "tinnitus-rpn": {
    title: "Tinnitus for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Tinnitus",
      content: "Tinnitus is the perception of sound in one or both ears or in the head when no external sound source is present. It is often described as ringing, buzzing, hissing, whistling, clicking, roaring, or humming. Tinnitus is classified as either subjective (heard only by the patient, accounting for more than 95% of cases) or objective (heard by both the patient and the examiner, typically caused by vascular abnormalities, muscular contractions, or patulous Eustachian tube). Subjective tinnitus results from abnormal neural activity in the auditory pathway that the brain interprets as sound. The most common underlying mechanism involves damage to the outer hair cells of the cochlea, which are highly specialized sensory cells in the organ of Corti that amplify and fine-tune sound vibrations. When outer hair cells are damaged (most commonly by noise exposure, aging, or ototoxic medications), they can no longer properly modulate auditory nerve signals. The auditory cortex, deprived of normal input from the damaged frequency range, undergoes neuroplastic changes and begins generating spontaneous neural activity that is perceived as phantom sound. This is analogous to phantom limb pain, where the brain generates sensations from a missing body part. Noise-induced hearing loss (NIHL) is the most common preventable cause of tinnitus. Prolonged or repeated exposure to sounds above 85 decibels damages outer hair cells, particularly those tuned to high-frequency sounds (4,000-6,000 Hz), producing a characteristic high-pitched tinnitus and hearing loss at 4,000 Hz on audiometry (the noise notch). Presbycusis (age-related hearing loss) produces tinnitus through the same mechanism of outer hair cell degeneration but is bilateral and progressive. Meniere disease produces tinnitus along with episodic vertigo, fluctuating sensorineural hearing loss, and aural fullness due to endolymphatic hydrops (excess fluid in the endolymphatic compartment of the inner ear). Ototoxic medications (aminoglycosides, loop diuretics, cisplatin, high-dose aspirin) can cause or worsen tinnitus by directly damaging cochlear hair cells. Acoustic neuroma (vestibular schwannoma), a benign tumor on the vestibulocochlear nerve (CN VIII), typically presents with unilateral tinnitus and asymmetric sensorineural hearing loss and requires MRI for diagnosis. For the practical nurse, management focuses on identifying contributing factors, administering prescribed medications, providing emotional support (tinnitus causes significant psychological distress including anxiety, depression, and insomnia), and educating patients about hearing protection and coping strategies."
    },
    riskFactors: [
      "Prolonged noise exposure (occupational: construction, military, manufacturing; recreational: concerts, headphones at high volume) -- the most common preventable cause",
      "Advancing age (presbycusis with progressive cochlear hair cell degeneration)",
      "Ototoxic medications (aminoglycosides, cisplatin, loop diuretics, high-dose aspirin, quinine)",
      "Meniere disease (endolymphatic hydrops causing episodic tinnitus with vertigo and hearing loss)",
      "History of head or neck trauma (concussion, whiplash, temporal bone fracture)",
      "Cardiovascular disease (hypertension, atherosclerosis causing pulsatile tinnitus from turbulent blood flow)",
      "Temporomandibular joint (TMJ) disorders (close anatomical relationship between TMJ and ear structures)"
    ],
    diagnostics: [
      "Audiometry (pure tone and speech): evaluates hearing thresholds across frequencies; identifies pattern of hearing loss associated with tinnitus; noise notch at 4,000 Hz suggests noise-induced hearing loss",
      "Otoscopic examination: evaluates external ear canal and tympanic membrane for cerumen impaction, otitis media, perforation, or middle ear effusion that may cause or contribute to tinnitus",
      "Tympanometry: assesses middle ear function and tympanic membrane compliance; identifies middle ear pathology (effusion, otosclerosis, eustachian tube dysfunction)",
      "MRI of the internal auditory canals: indicated for unilateral tinnitus or asymmetric hearing loss to rule out acoustic neuroma (vestibular schwannoma) on CN VIII",
      "CBC, metabolic panel, thyroid function tests: screen for anemia, metabolic disorders, and thyroid dysfunction that can contribute to or worsen tinnitus",
      "Tinnitus Handicap Inventory (THI): standardized questionnaire that quantifies the functional, emotional, and catastrophic impact of tinnitus on daily life; scores range from 0-100 with higher scores indicating greater disability"
    ],
    management: [
      "Hearing aids for patients with concurrent hearing loss: amplifying external sounds reduces the brain's perception of tinnitus by providing normal auditory input to the deprived auditory cortex",
      "Sound therapy (masking devices, white noise generators): provide external sound that partially or completely covers the tinnitus perception; bedside sound machines especially helpful for sleep",
      "Cognitive behavioral therapy (CBT): considered the most effective psychological intervention for tinnitus; helps patients change negative thought patterns and emotional responses to tinnitus",
      "Tinnitus retraining therapy (TRT): combines counseling with low-level broadband sound generators to promote habituation and reclassification of tinnitus from a threat signal to a neutral background sound",
      "Identify and eliminate ototoxic medications when possible (aspirin, NSAIDs, aminoglycosides, loop diuretics); consult with prescriber about alternatives",
      "Treat underlying conditions: cerumen removal, Meniere disease management, TMJ therapy, cardiovascular optimization",
      "Address comorbid conditions: treat depression, anxiety, and insomnia that frequently accompany chronic tinnitus"
    ],
    nursingActions: [
      "Assess tinnitus characteristics at each visit: onset, laterality (unilateral vs bilateral), pitch (high vs low), volume, pattern (constant vs intermittent), and associated symptoms (hearing loss, vertigo, aural fullness)",
      "Administer Tinnitus Handicap Inventory (THI) or similar validated questionnaire to quantify impact on quality of life and track treatment response",
      "Review current medication list for ototoxic agents and report findings to the prescriber",
      "Educate about hearing protection: use earplugs or noise-canceling headphones in environments above 85 decibels; follow the 60/60 rule for headphone use (60% volume for no more than 60 minutes)",
      "Provide emotional support and validate the patient's experience -- tinnitus is invisible to others and patients often feel dismissed or disbelieved",
      "Screen for depression, anxiety, and sleep disturbance using validated tools; tinnitus has significant psychological comorbidity",
      "Teach stress management and relaxation techniques: deep breathing, progressive muscle relaxation, mindfulness meditation -- stress frequently worsens tinnitus perception"
    ],
    assessmentFindings: [
      "Patient reports ringing, buzzing, hissing, roaring, or clicking sound in one or both ears without external sound source",
      "Associated hearing loss (may be unilateral or bilateral depending on etiology)",
      "Sleep disturbance: difficulty falling asleep or staying asleep due to tinnitus being more noticeable in quiet environments",
      "Emotional distress: anxiety, irritability, frustration, depression, difficulty concentrating; some patients report suicidal ideation with severe tinnitus",
      "Pulsatile tinnitus (synchronous with heartbeat): suggests vascular etiology such as carotid stenosis, arteriovenous malformation, or glomus tumor",
      "Episodic tinnitus with vertigo, hearing loss, and aural fullness: classic Meniere disease presentation",
      "Hyperacusis (increased sensitivity to normal environmental sounds): frequently coexists with tinnitus and shares similar pathophysiology"
    ],
    signs: {
      left: [
        "Intermittent, mild tinnitus noticeable mainly in quiet environments",
        "Mild difficulty concentrating due to tinnitus",
        "Occasional sleep disruption",
        "Mild hearing loss on audiometry",
        "Anxiety about the tinnitus cause",
        "Difficulty following conversations in noisy environments"
      ],
      right: [
        "Constant, severe tinnitus affecting all daily activities",
        "Significant hearing loss requiring amplification",
        "Severe insomnia and sleep deprivation",
        "Depression with social withdrawal and suicidal ideation",
        "Unilateral tinnitus with asymmetric hearing loss (acoustic neuroma concern)",
        "Pulsatile tinnitus with neurological symptoms (vascular lesion concern)"
      ]
    },
    medications: [
      {
        name: "Betahistine (Serc)",
        type: "Histamine H1 agonist / H3 antagonist (anti-vertigo agent)",
        action: "Acts as a partial histamine H1 receptor agonist and H3 receptor antagonist in the inner ear and vestibular nuclei; improves microcirculation in the stria vascularis of the cochlea by vasodilation, and modulates histamine release in the vestibular system to reduce endolymphatic pressure; used primarily for Meniere disease-associated tinnitus and vertigo",
        sideEffects: "Headache, nausea, GI upset, abdominal bloating; rarely skin rash or pruritus",
        contra: "Pheochromocytoma (histamine agonist may trigger catecholamine release); active peptic ulcer disease; hypersensitivity to betahistine; use with caution in asthma (theoretical bronchoconstriction risk)",
        pearl: "Most effective for tinnitus associated with Meniere disease rather than noise-induced tinnitus; take with food to reduce GI side effects; typical dose is 16-48 mg daily in divided doses; widely used in Canada and Europe but not FDA-approved in the United States"
      },
      {
        name: "Amitriptyline (Elavil)",
        type: "Tricyclic antidepressant (TCA)",
        action: "Inhibits reuptake of both serotonin and norepinephrine at the presynaptic nerve terminal, increasing neurotransmitter availability in the synaptic cleft; also blocks histamine H1, muscarinic, and alpha-1 adrenergic receptors; used in low doses for tinnitus to address associated depression, insomnia, and neuropathic pain components",
        sideEffects: "Sedation (often therapeutic for tinnitus-related insomnia), dry mouth, constipation, urinary retention, orthostatic hypotension, weight gain, blurred vision, QT prolongation, cardiac arrhythmias",
        contra: "Recent myocardial infarction; concurrent use with MAOIs (14-day washout required); acute recovery phase post-MI; known QT prolongation; narrow-angle glaucoma; urinary retention from prostatic hypertrophy",
        pearl: "Low-dose amitriptyline (10-25 mg at bedtime) is used off-label for tinnitus; the sedating effect helps with tinnitus-related insomnia; obtain baseline ECG in patients over 40; educate about orthostatic hypotension (rise slowly from sitting or lying position); takes 2-4 weeks for full antidepressant effect"
      },
      {
        name: "Alprazolam (Xanax)",
        type: "Benzodiazepine (anxiolytic / GABA-A receptor modulator)",
        action: "Binds to GABA-A receptors in the central nervous system, enhancing the inhibitory effects of GABA by increasing chloride channel opening frequency; reduces anxiety, promotes relaxation, and may reduce the emotional distress and perceived loudness of tinnitus through central nervous system depression of the auditory cortex hyperactivity",
        sideEffects: "Drowsiness, dizziness, cognitive impairment, memory problems, physical dependence and withdrawal (with prolonged use), paradoxical agitation (especially in elderly), respiratory depression (especially with opioids or alcohol)",
        contra: "Acute narrow-angle glaucoma; concurrent use with strong CYP3A4 inhibitors (ketoconazole, itraconazole); severe respiratory insufficiency; known hypersensitivity to benzodiazepines; avoid in patients with substance use disorder history",
        pearl: "Used short-term only for severe tinnitus-related anxiety; NOT a first-line or long-term solution due to dependence risk; must be tapered gradually when discontinuing (do NOT stop abruptly -- withdrawal can cause seizures); avoid combining with alcohol or opioids (respiratory depression risk); elderly patients require lower doses due to increased sensitivity"
      }
    ],
    pearls: [
      "Tinnitus is a SYMPTOM, not a disease -- always investigate and treat the underlying cause (noise exposure, medication toxicity, Meniere disease, acoustic neuroma, cerumen impaction)",
      "Unilateral tinnitus with asymmetric hearing loss is acoustic neuroma until proven otherwise -- ensure MRI referral is completed",
      "Pulsatile tinnitus (synchronous with heartbeat) suggests a vascular etiology and requires vascular imaging to rule out carotid stenosis, arteriovenous malformation, or glomus tumor",
      "Tinnitus is more noticeable and distressing in quiet environments -- advise patients to use background sound (fan, white noise machine, soft music) especially at bedtime",
      "Always review the medication list for ototoxic drugs: aminoglycosides, cisplatin, loop diuretics (especially furosemide at high doses), and high-dose aspirin can cause or worsen tinnitus",
      "Screen all tinnitus patients for depression, anxiety, and suicidal ideation -- chronic tinnitus has significant psychological impact and has been associated with increased suicide risk",
      "The 60/60 rule for headphone use helps prevent noise-induced tinnitus: no more than 60% volume for no more than 60 minutes at a time"
    ],
    quiz: [
      {
        question: "A patient reports constant ringing in the right ear only with progressive hearing loss on the right side. The practical nurse recognizes this presentation warrants investigation for which condition?",
        options: [
          "Meniere disease",
          "Noise-induced hearing loss",
          "Acoustic neuroma (vestibular schwannoma)",
          "Otosclerosis"
        ],
        correct: 2,
        rationale: "Unilateral tinnitus with asymmetric sensorineural hearing loss is the classic presentation of acoustic neuroma (vestibular schwannoma), a benign tumor on cranial nerve VIII. MRI of the internal auditory canals is the diagnostic test of choice. Meniere disease typically presents with episodic symptoms. Noise-induced hearing loss is usually bilateral."
      },
      {
        question: "A patient with chronic tinnitus asks the nurse what they can do to sleep better at night. Which recommendation is most appropriate?",
        options: [
          "Take a high dose of alprazolam every night before bed",
          "Use a white noise machine or fan at bedside to provide background sound that masks the tinnitus",
          "Sleep with earplugs to block all sounds",
          "Drink alcohol before bed to promote drowsiness"
        ],
        correct: 1,
        rationale: "Background sound (white noise machine, fan, soft music) helps mask tinnitus, which is perceived as louder in quiet environments. Earplugs would increase the perception of tinnitus by eliminating competing sounds. Alprazolam has dependence risks and is not recommended nightly. Alcohol disrupts sleep architecture and can worsen tinnitus."
      },
      {
        question: "A practical nurse is reviewing medications for a patient who reports new-onset tinnitus. Which medication on the patient's list is most likely contributing to the tinnitus?",
        options: [
          "Metformin",
          "Lisinopril",
          "Furosemide (high-dose)",
          "Omeprazole"
        ],
        correct: 2,
        rationale: "Furosemide (a loop diuretic) is ototoxic, especially at high doses or when administered rapidly IV. Loop diuretics can damage cochlear hair cells and cause reversible or permanent tinnitus and hearing loss. Metformin, lisinopril, and omeprazole are not typically associated with ototoxicity."
      }
    ]
  },

  "toxicology-rpn": {
    title: "Toxicology Assessment for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Toxicological Emergencies",
      content: "Toxicology is the study of the adverse effects of chemical, physical, or biological agents on living organisms. A poisoning or overdose occurs when a substance is ingested, inhaled, absorbed, or injected in quantities sufficient to cause harmful physiological effects. The toxicological emergency is one of the most time-sensitive clinical scenarios because the window for effective antidote administration and decontamination may be narrow, and delays directly impact patient outcomes. Understanding toxidromes (toxic syndromes) is essential for rapid identification and initial management. A toxidrome is a constellation of signs and symptoms that, when recognized as a pattern, points to a specific class of causative agent. The four major toxidromes are: (1) Cholinergic toxidrome (organophosphates, nerve agents, certain mushrooms): results from excessive acetylcholine at muscarinic and nicotinic receptors due to acetylcholinesterase inhibition; produces the SLUDGE/BBB mnemonic -- Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis / Bradycardia, Bronchospasm, Bronchorrhea; miosis (constricted pupils) is a key finding; death occurs from bronchospasm and respiratory secretions drowning the airways. (2) Anticholinergic toxidrome (antihistamines, tricyclic antidepressants, atropine, jimsonweed): results from blockade of muscarinic acetylcholine receptors; produces the mnemonic 'Hot as a hare, Dry as a bone, Red as a beet, Blind as a bat, Mad as a hatter' -- hyperthermia, dry skin and mucous membranes, flushing, mydriasis (dilated pupils), altered mental status, urinary retention, decreased bowel sounds, tachycardia. (3) Sympathomimetic toxidrome (cocaine, amphetamines, methamphetamine, MDMA): results from excessive catecholamine activity; produces hypertension, tachycardia, hyperthermia, diaphoresis, mydriasis, agitation, and seizures; can cause coronary vasospasm, myocardial infarction, and stroke. (4) Opioid toxidrome (morphine, heroin, fentanyl, oxycodone): results from excessive mu-opioid receptor activation; produces the classic triad of respiratory depression, miosis (pinpoint pupils), and decreased level of consciousness; death occurs from respiratory arrest. Activated charcoal is a gastrointestinal decontamination agent that binds to many toxins in the stomach and intestines, preventing their systemic absorption. It is most effective when administered within 1-2 hours of ingestion and works best for solid oral ingestions. It does NOT bind to iron, lithium, potassium, alcohols (methanol, ethylene glycol), cyanide, or hydrocarbons. Antidote therapy is specific to the toxin involved and works by directly reversing or counteracting the toxic mechanism."
    },
    riskFactors: [
      "Intentional self-harm (suicide attempt) -- the most common cause of adult poisoning requiring hospitalization",
      "Accidental ingestion in pediatric patients (children under 5 years account for the majority of accidental poisonings)",
      "Substance use disorder (opioid overdose, stimulant toxicity, alcohol poisoning)",
      "Polypharmacy in elderly patients (accidental medication errors, drug interactions)",
      "Occupational exposure to toxic chemicals (pesticides, industrial solvents, cleaning agents)",
      "Lack of childproofing in homes with young children (accessible medications, cleaning products, batteries)",
      "Medication errors in healthcare settings (wrong dose, wrong drug, wrong route)"
    ],
    diagnostics: [
      "Comprehensive toxicology screen (urine drug screen): detects common drugs of abuse (opioids, amphetamines, cocaine, benzodiazepines, cannabinoids, barbiturates); has limitations including false positives and inability to detect synthetic opioids (fentanyl requires specific assay)",
      "Serum drug levels: quantitative levels for specific toxins (acetaminophen, salicylate, ethanol, lithium, digoxin, theophylline, iron, carbamazepine); acetaminophen and salicylate levels should be obtained on ALL overdose patients regardless of history",
      "Basic metabolic panel (BMP): evaluates electrolytes, glucose, BUN/creatinine; calculate anion gap (elevated in toxic alcohol ingestion, salicylate, and metformin poisoning)",
      "Arterial blood gas (ABG): evaluates acid-base status; metabolic acidosis with elevated anion gap is common in toxic ingestions (methanol, ethylene glycol, salicylate, cyanide)",
      "ECG (12-lead): essential in all overdoses; evaluate for QRS widening (tricyclic antidepressants, sodium channel blockers), QT prolongation (many drugs), and arrhythmias",
      "Liver function tests (AST, ALT): critical for acetaminophen overdose monitoring; levels may be normal initially and rise dramatically at 24-72 hours as hepatic necrosis develops"
    ],
    management: [
      "Stabilize airway, breathing, and circulation (ABCs) as the immediate priority in all toxicological emergencies; intubation may be required for airway protection in obtunded patients",
      "Administer activated charcoal (1 g/kg, maximum 50 g) within 1-2 hours of oral ingestion if airway is protected and substance is charcoal-binding; DO NOT give for corrosive ingestions, hydrocarbons, or when airway is compromised",
      "Administer specific antidotes as ordered: naloxone for opioids, N-acetylcysteine for acetaminophen, flumazenil for benzodiazepines (with caution), atropine for organophosphates",
      "Whole bowel irrigation with polyethylene glycol solution for iron, lithium, sustained-release preparations, and body-packing (substance not bound by charcoal)",
      "Contact Poison Control Center (1-800-222-1222 in US/Canada) for guidance on specific toxin management",
      "Continuous cardiac monitoring for all significant overdoses; treat arrhythmias per toxicology-specific protocols",
      "Psychiatric evaluation required for all intentional overdose patients before discharge; maintain 1:1 observation until psychiatric clearance"
    ],
    nursingActions: [
      "Obtain thorough exposure history: what substance, how much, when (time of exposure), route (ingestion, inhalation, injection, dermal), whether intentional or accidental, any co-ingestants",
      "Assess and document vital signs frequently (every 15-30 minutes in acute phase): identify toxidrome pattern based on vital sign constellation",
      "Perform rapid neurological assessment: level of consciousness (GCS), pupil size and reactivity (miosis vs mydriasis), presence of seizures or tremor",
      "Administer activated charcoal as ordered: position patient sitting upright, ensure airway protection, monitor for vomiting and aspiration",
      "Implement seizure precautions for all overdose patients: padded side rails, suction at bedside, oxygen ready",
      "Maintain strict intake and output: monitor urine output (renal toxicity from many substances), document emesis",
      "Implement suicide precautions for intentional overdose patients: remove all sharps, medications, and potential weapons from the room; maintain 1:1 continuous observation",
      "Preserve evidence if substance is unknown: save any containers, pills, vomitus, or suicide notes for identification"
    ],
    assessmentFindings: [
      "Cholinergic toxidrome: SLUDGE/BBB (salivation, lacrimation, urination, defecation, GI distress, emesis, bradycardia, bronchospasm, bronchorrhea), miosis, muscle fasciculations",
      "Anticholinergic toxidrome: hot dry flushed skin, mydriasis, tachycardia, urinary retention, decreased bowel sounds, altered mental status (agitation, hallucinations, delirium)",
      "Sympathomimetic toxidrome: hypertension, tachycardia, hyperthermia, diaphoresis, mydriasis, agitation, seizures, chest pain",
      "Opioid toxidrome: respiratory depression (rate below 12 breaths/minute), miosis (pinpoint pupils), decreased level of consciousness, hypotension, bradycardia",
      "Acetaminophen overdose stages: Stage 1 (0-24 hours) nausea, vomiting, malaise; Stage 2 (24-72 hours) RUQ pain, rising LFTs; Stage 3 (72-96 hours) hepatic necrosis, coagulopathy, encephalopathy; Stage 4 recovery or death",
      "Salicylate toxicity: tinnitus, nausea, vomiting, tachypnea (respiratory alkalosis initially), then metabolic acidosis, altered mental status, hyperthermia"
    ],
    signs: {
      left: [
        "Nausea, vomiting, or abdominal pain",
        "Mild drowsiness or confusion",
        "Mild tachycardia or blood pressure changes",
        "Dilated or constricted pupils (depending on substance)",
        "Mild tremor or restlessness",
        "History of substance exposure with minimal symptoms"
      ],
      right: [
        "Respiratory depression or arrest (rate below 8 breaths/minute)",
        "Unresponsive or obtunded with loss of airway protective reflexes",
        "Seizures (especially with tricyclic antidepressants, sympathomimetics)",
        "Severe bradycardia or cardiac arrhythmias",
        "Hyperthermia above 40 degrees Celsius (104 degrees Fahrenheit)",
        "Hemodynamic instability (severe hypotension or hypertensive crisis)"
      ]
    },
    medications: [
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist (competitive mu-receptor blocker)",
        action: "Competitively binds to mu, kappa, and delta opioid receptors in the central nervous system, displacing opioid agonists and rapidly reversing respiratory depression, sedation, and miosis caused by opioid overdose; does not produce opioid effects itself",
        sideEffects: "Acute opioid withdrawal syndrome (agitation, tachycardia, hypertension, diaphoresis, nausea, vomiting, piloerection, diarrhea, abdominal cramping); pulmonary edema (rare but reported); seizures (rare)",
        contra: "Known hypersensitivity; use with caution in patients with known opioid dependence (can precipitate severe withdrawal); use cautiously in cardiac patients (withdrawal-related sympathetic surge can cause arrhythmias)",
        pearl: "Onset of action: IV 1-2 minutes, IM 2-5 minutes, intranasal 3-5 minutes; duration of action is 30-90 minutes which is SHORTER than most opioids -- patient may re-sedate and requires monitoring for re-dosing; initial dose 0.4-2 mg IV, may repeat every 2-3 minutes; titrate to adequate respirations (not full consciousness) in opioid-dependent patients to minimize withdrawal severity"
      },
      {
        name: "N-Acetylcysteine (NAC / Acetadote / Mucomyst)",
        type: "Antidote for acetaminophen toxicity (glutathione precursor)",
        action: "Replenishes depleted hepatic glutathione stores, which are essential for detoxifying the toxic acetaminophen metabolite NAPQI (N-acetyl-p-benzoquinone imine); also serves as a direct NAPQI scavenger and provides sulfate for alternative conjugation pathway; prevents hepatic necrosis when administered within 8-10 hours of acetaminophen overdose",
        sideEffects: "IV: anaphylactoid reactions (flushing, urticaria, bronchospasm, hypotension -- especially with first loading dose), nausea, vomiting; Oral: nausea, vomiting (foul taste and smell of sulfur), diarrhea",
        contra: "No absolute contraindications in acetaminophen overdose (benefit outweighs risk even with hypersensitivity history); use with caution in asthma (bronchospasm risk with IV formulation)",
        pearl: "Most effective when started within 8 hours of acetaminophen ingestion but still beneficial up to 24 hours and beyond; IV protocol: 150 mg/kg loading dose over 1 hour (monitor closely for anaphylactoid reaction), then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours; Rumack-Matthew nomogram plots acetaminophen level against time post-ingestion to determine need for NAC treatment"
      },
      {
        name: "Flumazenil (Romazicon)",
        type: "Benzodiazepine antagonist (competitive GABA-A receptor antagonist)",
        action: "Competitively inhibits the activity of benzodiazepines at the GABA-A receptor complex, reversing sedation, respiratory depression, and amnesia caused by benzodiazepine overdose; does not reverse the effects of other CNS depressants (opioids, barbiturates, ethanol)",
        sideEffects: "Seizures (most dangerous adverse effect, especially in patients with benzodiazepine dependence or mixed overdose with seizure-prone substances), nausea, vomiting, agitation, dizziness, headache, injection site pain",
        contra: "Known benzodiazepine dependence (precipitates withdrawal seizures); co-ingestion of seizure-prone substances (tricyclic antidepressants, cocaine); patients receiving benzodiazepines for seizure control; raised intracranial pressure",
        pearl: "Use is CONTROVERSIAL and RESTRICTED in overdose settings because the risk of provoking seizures often outweighs the benefit; should NOT be given routinely in unknown overdose or polysubstance ingestion; primarily used in procedural sedation reversal where benzodiazepine is the only agent given; onset 1-2 minutes IV; duration 45-90 minutes (shorter than most benzodiazepines -- re-sedation may occur)"
      }
    ],
    pearls: [
      "Obtain serum acetaminophen and salicylate levels on ALL overdose patients regardless of reported substance -- co-ingestion is common and both can be clinically silent in early stages",
      "SLUDGE/BBB identifies cholinergic toxidrome: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis / Bradycardia, Bronchospasm, Bronchorrhea -- treat with atropine",
      "Naloxone duration of action (30-90 minutes) is SHORTER than most opioids -- patients can re-sedate after reversal and require extended monitoring with repeated dosing as needed",
      "Activated charcoal does NOT bind iron, lithium, potassium, alcohols (methanol/ethylene glycol), cyanide, or hydrocarbons -- know these exceptions",
      "Flumazenil use in overdose is CONTROVERSIAL because it can precipitate life-threatening seizures in benzodiazepine-dependent patients or those with co-ingested seizure-prone drugs",
      "N-acetylcysteine (NAC) for acetaminophen overdose is most effective within 8 hours of ingestion but should be given even if the patient presents late -- there is no absolute time cutoff for treatment",
      "All intentional overdose patients require psychiatric evaluation and 1:1 continuous observation until psychiatric clearance -- never leave the patient unattended and remove all potential means of self-harm from the room"
    ],
    quiz: [
      {
        question: "A patient is brought to the emergency department with pinpoint pupils, respiratory rate of 6 breaths per minute, and decreased level of consciousness. The practical nurse recognizes this presentation as which toxidrome?",
        options: [
          "Anticholinergic toxidrome",
          "Sympathomimetic toxidrome",
          "Opioid toxidrome",
          "Cholinergic toxidrome"
        ],
        correct: 2,
        rationale: "The classic opioid toxidrome triad consists of miosis (pinpoint pupils), respiratory depression, and decreased level of consciousness. Anticholinergic toxidrome produces mydriasis, tachycardia, and hot dry skin. Sympathomimetic toxidrome produces mydriasis, hypertension, and agitation. Cholinergic toxidrome produces miosis with SLUDGE symptoms."
      },
      {
        question: "A patient received naloxone for an opioid overdose and is now alert and breathing normally. The practical nurse should prioritize which intervention?",
        options: [
          "Discharge the patient now that the overdose is reversed",
          "Continue monitoring because naloxone wears off faster than most opioids and the patient may re-sedate",
          "Administer activated charcoal to prevent further opioid absorption",
          "Give another dose of naloxone prophylactically"
        ],
        correct: 1,
        rationale: "Naloxone has a duration of action of 30-90 minutes, which is shorter than most opioids. After the naloxone wears off, the patient may re-sedate and develop recurrent respiratory depression. Continued monitoring with readiness to re-dose naloxone is essential. Premature discharge can be fatal."
      },
      {
        question: "The practical nurse is preparing to administer activated charcoal to an overdose patient. Which patient assessment finding would require the nurse to hold the charcoal and notify the physician?",
        options: [
          "The patient ingested the substance 30 minutes ago",
          "The patient is drowsy but responds to verbal stimuli",
          "The patient is obtunded with no gag reflex",
          "The patient reports mild nausea"
        ],
        correct: 2,
        rationale: "Activated charcoal should NOT be administered to a patient with an unprotected airway (no gag reflex, obtunded state) due to the high risk of aspiration pneumonitis. The patient requires airway protection (endotracheal intubation) before charcoal can be safely administered. Mild nausea and drowsiness with intact airway reflexes are not contraindications."
      }
    ]
  },

  "toxic-shock-gynecologic-rpn": {
    title: "Toxic Shock Syndrome (Gynecologic) for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Toxic Shock Syndrome",
      content: "Toxic shock syndrome (TSS) is a severe, rapidly progressive, life-threatening systemic illness caused by bacterial exotoxins that act as superantigens. There are two distinct types: staphylococcal TSS (caused by Staphylococcus aureus producing toxic shock syndrome toxin-1 [TSST-1] and enterotoxins B and C) and streptococcal TSS (caused by Group A Streptococcus [GAS] producing streptococcal pyrogenic exotoxins [SPEs]). Gynecologic or menstrual TSS is predominantly staphylococcal and is classically associated with prolonged use of high-absorbency tampons, though it can also occur with menstrual cups, diaphragms, vaginal sponges, and postpartum wound infections. The pathogenesis of staphylococcal TSS begins when S. aureus colonizing the vaginal mucosa proliferates in the protein-rich, warm, moist environment created by an absorbent tampon left in place for an extended period. The bacteria produce TSST-1, which is a superantigen. Unlike conventional antigens that activate only 0.01-0.1% of T-cells, superantigens bypass the normal antigen processing pathway and directly cross-link the major histocompatibility complex class II (MHC-II) molecule on antigen-presenting cells with the variable region of the T-cell receptor beta chain (Vbeta), resulting in massive, non-specific activation of up to 20-30% of all T-cells simultaneously. This massive T-cell activation produces an overwhelming cytokine storm (tumor necrosis factor-alpha, interleukin-1, interleukin-2, interleukin-6, interferon-gamma) that causes widespread vasodilation, capillary leak syndrome, hypotension, multiorgan dysfunction, and potentially death. The CDC diagnostic criteria for staphylococcal TSS require: (1) fever of 38.9 degrees Celsius (102 degrees Fahrenheit) or higher; (2) hypotension (systolic blood pressure 90 mmHg or below, or orthostatic syncope); (3) diffuse macular rash resembling sunburn; (4) desquamation (skin peeling) 1-2 weeks after onset, particularly on the palms and soles; and (5) involvement of three or more organ systems (GI, muscular, renal, hepatic, hematologic, CNS, mucous membrane). Streptococcal TSS presents similarly but more frequently involves a defined soft tissue infection (necrotizing fasciitis) and carries a higher mortality rate (30-70% vs 3-5% for staphylococcal TSS). For the practical nurse, early recognition of TSS is critical because the condition progresses rapidly from initial flu-like symptoms to hemodynamic collapse within hours. Nursing priorities include aggressive fluid resuscitation monitoring, antibiotic administration, removal of the infectious source (tampon), hemodynamic monitoring, and organ function assessment."
    },
    riskFactors: [
      "Prolonged tampon use (leaving a tampon in place for more than 4-8 hours, especially high-absorbency tampons)",
      "Use of menstrual cups, diaphragms, or vaginal contraceptive sponges left in place for extended periods",
      "Young women (15-25 years) who may lack antibodies against TSST-1 (approximately 15-20% of the population lacks protective antibodies)",
      "Postpartum state (vaginal delivery wounds, cesarean section incision providing S. aureus entry point)",
      "Nasal packing (for epistaxis) or surgical wound packing providing a colonization site for S. aureus",
      "Previous history of TSS (recurrence rate approximately 30-40% without antibody development)",
      "Skin or soft tissue infections with S. aureus or Group A Streptococcus (non-menstrual TSS)"
    ],
    diagnostics: [
      "Clinical diagnosis based on CDC criteria: fever 38.9 degrees C or above, hypotension, diffuse macular rash, desquamation at 1-2 weeks, involvement of 3 or more organ systems",
      "Blood cultures: obtain before initiating antibiotics; positive in 50-60% of streptococcal TSS but only 5% of staphylococcal TSS (TSST-1 causes illness without bacteremia in most staphylococcal cases)",
      "CBC with differential: leukocytosis (elevated WBC); thrombocytopenia may develop as part of DIC; left shift with immature band cells",
      "Comprehensive metabolic panel: elevated creatinine (renal dysfunction), elevated hepatic enzymes (hepatic involvement), hypocalcemia, hypoalbuminemia from capillary leak",
      "Creatine kinase (CK): elevated from rhabdomyolysis (muscle involvement is common in TSS)",
      "Coagulation studies (PT/INR, aPTT, fibrinogen, D-dimer): evaluate for disseminated intravascular coagulation (DIC) which may complicate severe TSS"
    ],
    management: [
      "Remove the infectious source immediately: remove tampon, menstrual cup, nasal packing, or wound packing; irrigate and debride any infected wounds",
      "Aggressive IV fluid resuscitation with normal saline or lactated Ringer solution (patients may require 10-20 liters in the first 24 hours due to massive capillary leak and third-spacing)",
      "Administer IV antibiotics: nafcillin or oxacillin (anti-staphylococcal beta-lactam) PLUS clindamycin; clindamycin is added specifically because it inhibits toxin production at the ribosomal level",
      "Vasopressor support (norepinephrine, vasopressin) if hypotension persists despite aggressive fluid resuscitation",
      "Monitor for and manage organ dysfunction: acute kidney injury (monitor creatinine, urine output), hepatic failure, ARDS, DIC",
      "IVIG may be considered as adjunctive therapy in severe cases to neutralize circulating superantigen",
      "ICU admission for hemodynamic monitoring, mechanical ventilation if ARDS develops, and continuous vasopressor management"
    ],
    nursingActions: [
      "Recognize the early signs of TSS: sudden onset of high fever, vomiting, diarrhea, myalgia, and sunburn-like rash in a menstruating woman using tampons -- notify physician immediately",
      "If tampon is still in place, assist with or facilitate its immediate removal; note the type of tampon and estimated duration of insertion",
      "Monitor vital signs every 15 minutes during acute resuscitation: blood pressure (watch for progressive hypotension), heart rate, temperature, respiratory rate, oxygen saturation",
      "Maintain strict intake and output: insert Foley catheter as ordered; report urine output below 0.5 mL/kg/hour (indicates renal hypoperfusion)",
      "Administer IV fluids and vasopressors as ordered using infusion pump; monitor for signs of fluid overload (crackles, JVD, worsening oxygenation) during aggressive resuscitation",
      "Assess skin thoroughly: document the diffuse macular rash (resembles sunburn), note any areas of desquamation (typically palms, soles, fingers and toes 1-2 weeks later)",
      "Provide wound care for any surgical sites or skin breakdown; use aseptic technique",
      "Educate about prevention upon recovery: use lowest absorbency tampon needed, change every 4-8 hours, alternate with pads, never leave tampon overnight, seek medical attention for fever during menstruation"
    ],
    assessmentFindings: [
      "Sudden onset of high fever (38.9 degrees C / 102 degrees F or higher) during or shortly after menstruation",
      "Diffuse macular erythroderma (sunburn-like rash) that blanches with pressure; may affect the entire body including palms and soles",
      "Hypotension (systolic BP 90 mmHg or below) or orthostatic dizziness; may progress to refractory septic shock",
      "Desquamation (peeling skin), particularly on the palms, soles, and fingers, occurring 1-2 weeks after illness onset (late finding)",
      "Gastrointestinal symptoms: profuse watery diarrhea, vomiting, abdominal pain (often prominent early symptoms)",
      "Severe myalgia (muscle pain) with elevated creatine kinase; may progress to rhabdomyolysis",
      "Mucous membrane involvement: strawberry tongue (hyperemic oral mucosa), conjunctival injection (red eyes without purulent discharge), vaginal hyperemia"
    ],
    signs: {
      left: [
        "Fever with flu-like symptoms during menstruation",
        "Mild dizziness or lightheadedness when standing",
        "Nausea, vomiting, or watery diarrhea",
        "Diffuse rash resembling sunburn",
        "Generalized myalgia and malaise",
        "Red eyes or sore throat"
      ],
      right: [
        "Refractory hypotension despite aggressive fluid resuscitation (septic shock)",
        "Altered mental status (confusion, disorientation, obtundation)",
        "Oliguria or anuria indicating acute kidney injury",
        "Respiratory distress or ARDS requiring mechanical ventilation",
        "Coagulopathy (DIC) with bleeding from multiple sites",
        "Multiorgan failure with rapidly deteriorating condition"
      ]
    },
    medications: [
      {
        name: "Nafcillin (Unipen)",
        type: "Penicillinase-resistant penicillin (anti-staphylococcal beta-lactam antibiotic)",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), preventing cross-linking of peptidoglycan chains; bactericidal against methicillin-sensitive Staphylococcus aureus (MSSA); kills actively dividing bacteria to eliminate the source of toxin production",
        sideEffects: "Phlebitis at IV infusion site (common), hypersensitivity reactions (rash, urticaria, anaphylaxis), interstitial nephritis, hepatotoxicity with prolonged use, neutropenia",
        contra: "Known penicillin allergy (anaphylaxis history is absolute contraindication; vancomycin is the alternative for MRSA or penicillin allergy); use with caution in renal impairment",
        pearl: "Nafcillin (or oxacillin) is the preferred anti-staphylococcal antibiotic for TSS because it kills the bacteria producing toxin; always combined with clindamycin which directly inhibits toxin production; if MRSA is suspected, substitute vancomycin for nafcillin; monitor IV site closely for phlebitis and rotate sites as needed"
      },
      {
        name: "Clindamycin (Dalacin/Cleocin)",
        type: "Lincosamide antibiotic (protein synthesis inhibitor)",
        action: "Binds to the 50S ribosomal subunit of bacterial ribosomes, inhibiting protein synthesis including the production of TSST-1 and streptococcal pyrogenic exotoxins; this toxin suppression effect is the primary reason clindamycin is added to beta-lactam therapy in TSS, as beta-lactams alone kill bacteria but may paradoxically increase toxin release during bacterial lysis",
        sideEffects: "Clostridioides difficile infection and pseudomembranous colitis (most serious adverse effect), diarrhea, nausea, abdominal pain, skin rash, elevated liver enzymes",
        contra: "History of Clostridioides difficile colitis; known hypersensitivity to clindamycin or lincomycin; use with caution in hepatic impairment",
        pearl: "Clindamycin is essential in TSS treatment because it DIRECTLY INHIBITS TOXIN PRODUCTION at the ribosomal level -- this is its primary role, not just its bacteriostatic effect; beta-lactam antibiotics alone may worsen TSS by releasing more toxin during bacterial cell lysis; monitor for C. difficile symptoms (watery diarrhea, abdominal cramping, fever) during and up to 2 months after therapy"
      },
      {
        name: "Normal Saline (0.9% NaCl) for Resuscitation",
        type: "Isotonic crystalloid IV fluid (volume expander)",
        action: "Replaces intravascular volume lost through massive capillary leak and third-spacing caused by the cytokine storm; restores blood pressure and tissue perfusion; the sodium and chloride concentration matches plasma osmolality, preventing osmotic fluid shifts",
        sideEffects: "Hyperchloremic metabolic acidosis (with large volumes), fluid overload (pulmonary edema, peripheral edema), dilutional hyponatremia, hypothermia (if not warmed)",
        contra: "Use with caution in patients with heart failure or renal failure (reduced ability to handle volume); monitor closely for signs of fluid overload during aggressive resuscitation",
        pearl: "TSS patients may require 10-20 liters of IV fluid in the first 24 hours due to massive capillary leak; use pressure bags or rapid infusion devices for initial boluses (1-2 liters over 30-60 minutes); warm fluids to prevent hypothermia; monitor for fluid overload (crackles, JVD, increasing oxygen requirements); if hypotension persists despite adequate fluids, vasopressors (norepinephrine) must be initiated"
      }
    ],
    pearls: [
      "Clindamycin is the KEY drug in TSS treatment because it DIRECTLY STOPS toxin production at the ribosomal level -- beta-lactams kill bacteria but may paradoxically increase toxin release during bacterial lysis",
      "The diffuse macular rash of TSS resembles a sunburn and is present at onset, while desquamation (skin peeling of palms, soles, fingers) occurs 1-2 weeks LATER during recovery",
      "TSS can progress from flu-like symptoms to hemodynamic collapse within HOURS -- early recognition and aggressive treatment are critical for survival",
      "Tampon prevention education: use the lowest absorbency needed, change every 4-8 hours, alternate with pads, never sleep with a tampon in place, seek medical attention for fever during menstruation",
      "Staphylococcal TSS blood cultures are positive in only 5% of cases because the illness is toxin-mediated (not bacteremia) -- a negative blood culture does NOT rule out TSS",
      "TSS has a significant recurrence rate (30-40%) because many patients do not develop protective antibodies after the first episode -- patients must be counseled about ongoing risk",
      "The strawberry tongue (hyperemic oral mucosa), conjunctival injection (red eyes), and vaginal hyperemia are mucous membrane findings that help differentiate TSS from other causes of septic shock"
    ],
    quiz: [
      {
        question: "A 19-year-old patient presents with sudden onset of high fever, vomiting, diarrhea, and a diffuse sunburn-like rash. She reports using a tampon that has been in place for 18 hours. The practical nurse recognizes this presentation as most consistent with which condition?",
        options: [
          "Allergic reaction to the tampon material",
          "Toxic shock syndrome",
          "Pelvic inflammatory disease",
          "Urinary tract infection"
        ],
        correct: 1,
        rationale: "The combination of high fever, GI symptoms (vomiting, diarrhea), diffuse sunburn-like rash, and prolonged tampon use is the classic presentation of toxic shock syndrome (TSS). PID typically presents with lower abdominal pain and abnormal discharge. UTI presents with urinary symptoms. Allergic reactions do not typically cause this constellation of systemic symptoms."
      },
      {
        question: "A patient is being treated for staphylococcal toxic shock syndrome with nafcillin AND clindamycin. The patient asks why two antibiotics are needed. What is the most accurate explanation?",
        options: [
          "Two antibiotics are always needed for severe infections to prevent resistance",
          "Nafcillin kills the bacteria while clindamycin directly stops the production of the toxin causing the illness",
          "Clindamycin treats a different type of bacteria that may also be present",
          "The second antibiotic is given as a backup in case the first one does not work"
        ],
        correct: 1,
        rationale: "In TSS, clindamycin is specifically added because it inhibits bacterial protein synthesis at the ribosomal level, directly stopping the production of TSST-1 toxin. Nafcillin kills the bacteria but can paradoxically release more toxin during bacterial lysis. The combination addresses both the organism and the toxin-mediated pathology."
      },
      {
        question: "During recovery from toxic shock syndrome, a patient notices the skin on her palms and fingers is peeling. She is alarmed and asks if the condition is worsening. What is the best nursing response?",
        options: [
          "This is a sign of a new infection and requires immediate medical attention",
          "Desquamation (skin peeling) of the palms, soles, and fingers is an expected finding that occurs 1-2 weeks after TSS onset during the recovery phase",
          "This indicates an allergic reaction to the antibiotics and they should be stopped",
          "This means the treatment is not working and the medication needs to be changed"
        ],
        correct: 1,
        rationale: "Desquamation (skin peeling) of the palms, soles, fingers, and toes occurring 1-2 weeks after illness onset is a characteristic late finding of TSS and is part of the diagnostic criteria. It occurs during recovery and does not indicate worsening or a new problem. The nurse should reassure the patient while continuing to monitor for any actual complications."
      }
    ]
  },

  "tumor-markers-rpn": {
    title: "Tumor Markers for Practical Nurses",
    cellular: {
      title: "Understanding Tumor Markers in Oncology Nursing",
      content: "Tumor markers are substances produced by cancer cells or by the body in response to cancer that can be detected in blood, urine, or tissue samples. While tumor markers are valuable tools in oncology, the practical nurse must understand that most tumor markers are NOT used for cancer screening in the general population because they lack sufficient sensitivity (ability to detect all cancers) and specificity (ability to distinguish cancer from non-cancerous conditions). The primary clinical applications of tumor markers are: monitoring treatment response in diagnosed cancers, detecting recurrence after treatment, estimating prognosis, and in some specific cases, aiding in diagnosis when combined with other clinical findings. Prostate-specific antigen (PSA) is a glycoprotein produced by both normal and malignant prostate epithelial cells. While PSA is the most widely used cancer screening marker, it is important to understand that elevated PSA is NOT specific for prostate cancer. Benign prostatic hyperplasia (BPH), prostatitis, urinary tract infection, recent ejaculation, and digital rectal examination can all elevate PSA levels, leading to false-positive results. The normal range is generally considered below 4.0 ng/mL, though age-specific reference ranges are used (higher cutoffs for older men). Carcinoembryonic antigen (CEA) is a glycoprotein normally produced during fetal development. In adults, CEA is associated primarily with colorectal cancer but can be elevated in pancreatic, breast, lung, gastric, and ovarian cancers, as well as in non-malignant conditions such as smoking, inflammatory bowel disease, liver cirrhosis, and chronic lung disease. CEA is most valuable for monitoring treatment response and detecting recurrence in patients with known colorectal cancer. Alpha-fetoprotein (AFP) is a protein produced by the fetal liver and yolk sac. In adults, elevated AFP is associated with hepatocellular carcinoma (liver cancer) and non-seminomatous germ cell tumors (testicular cancer). AFP is also elevated in pregnancy (normal), chronic hepatitis, and cirrhosis. CA-125 (cancer antigen 125) is a glycoprotein associated with ovarian epithelial cancer. However, CA-125 is elevated in many benign conditions including endometriosis, pregnancy, pelvic inflammatory disease, menstruation, liver disease, and other peritoneal irritation, making it unreliable as a general screening tool. It is most useful for monitoring treatment response in diagnosed ovarian cancer. CA 19-9 is a carbohydrate antigen associated primarily with pancreatic cancer and is also elevated in cholangiocarcinoma, gastric cancer, and benign conditions such as pancreatitis and biliary obstruction. Human chorionic gonadotropin (hCG) is normally produced by the placenta during pregnancy but is also a marker for gestational trophoblastic disease (hydatidiform mole, choriocarcinoma) and testicular germ cell tumors (seminoma, non-seminoma). An elevated hCG in a non-pregnant individual requires urgent evaluation. The practical nurse plays a critical role in specimen collection, documentation, patient education about the meaning and limitations of tumor marker results, and emotional support during what is often an anxious waiting period for results."
    },
    riskFactors: [
      "Known cancer diagnosis requiring treatment monitoring (any malignancy where tumor markers are clinically relevant)",
      "Family history of hereditary cancer syndromes (BRCA mutations, Lynch syndrome, familial adenomatous polyposis)",
      "Age over 50 years (increased risk for many cancers including prostate, colorectal, ovarian, and pancreatic)",
      "Smoking history (increases risk of multiple cancers and can independently elevate CEA levels causing false positives)",
      "Chronic liver disease (hepatitis B or C, cirrhosis -- risk factor for hepatocellular carcinoma with AFP elevation)",
      "History of testicular abnormalities (cryptorchidism, prior testicular cancer -- AFP and hCG monitoring)",
      "Occupational or environmental carcinogen exposure (asbestos, benzene, radiation)"
    ],
    diagnostics: [
      "PSA (Prostate-Specific Antigen): normal less than 4.0 ng/mL (age-adjusted); used for prostate cancer screening (controversial), monitoring treatment response, and detecting recurrence; elevated in BPH, prostatitis, and after prostate manipulation",
      "CEA (Carcinoembryonic Antigen): normal less than 3.0 ng/mL in non-smokers, less than 5.0 ng/mL in smokers; primary use is monitoring colorectal cancer treatment and detecting recurrence; NOT recommended as a screening test",
      "AFP (Alpha-Fetoprotein): normal less than 10 ng/mL in adults; elevated in hepatocellular carcinoma, testicular germ cell tumors, and pregnancy; also elevated in chronic hepatitis and cirrhosis",
      "CA-125 (Cancer Antigen 125): normal less than 35 U/mL; associated with ovarian cancer monitoring; elevated in endometriosis, pregnancy, PID, menstruation, liver disease, and other benign conditions",
      "CA 19-9 (Carbohydrate Antigen 19-9): normal less than 37 U/mL; associated primarily with pancreatic cancer; also elevated in cholangiocarcinoma, gastric cancer, pancreatitis, and biliary obstruction",
      "hCG (Human Chorionic Gonadotropin): normally elevated only in pregnancy; tumor marker for gestational trophoblastic disease and testicular germ cell tumors; always rule out pregnancy first in women of childbearing age"
    ],
    management: [
      "Collect tumor marker specimens according to laboratory protocol: most require standard serum (red-top or gold-top tube); document time of collection and any relevant clinical information",
      "Track tumor marker trends over time using documentation tools such as tumor marker tracking forms and trend analysis charts; a single elevated value is less clinically meaningful than a trend",
      "Coordinate specimen collection timing with treatment cycles as ordered (tumor markers are typically drawn before each treatment cycle and at scheduled surveillance intervals)",
      "Report significant changes in tumor marker levels to the registered nurse or physician promptly: a rising trend may indicate treatment failure or recurrence",
      "Provide patient education about the meaning and limitations of tumor marker results: explain that false positives and false negatives occur, and that trends are more important than single values",
      "Support patient emotionally during the waiting period for results and when results indicate disease progression",
      "Use oncology flowsheets and documentation tools to maintain accurate records of all tumor marker values, dates, and corresponding clinical status"
    ],
    nursingActions: [
      "Verify correct specimen collection requirements for each tumor marker (tube type, volume, handling, transport conditions) before drawing blood",
      "Label all specimens with two patient identifiers, date, time of collection, and any required clinical information (menstrual status for CA-125, pregnancy status for hCG and AFP)",
      "Document all tumor marker results in the patient record and on the oncology flowsheet for trend analysis; flag significant elevations or unexpected changes",
      "Educate patients that tumor markers alone do NOT diagnose cancer -- they are used in combination with imaging, biopsy, and clinical assessment",
      "For PSA testing: ensure the patient has not had digital rectal examination within 48 hours, ejaculation within 48 hours, or vigorous cycling within 48 hours before collection (these can falsely elevate PSA)",
      "Assess for and report symptoms that may correlate with rising tumor markers: pain, weight loss, fatigue, new masses, changes in bowel or bladder function",
      "Provide emotional support and therapeutic communication when tumor marker results indicate potential disease progression or recurrence"
    ],
    assessmentFindings: [
      "Rising PSA trend in a prostate cancer patient: may indicate biochemical recurrence (PSA recurrence often precedes clinical symptoms by months to years)",
      "Elevated CEA following colorectal cancer surgery: may indicate recurrence; rising trend is more significant than a single elevated value; imaging follow-up is typically ordered",
      "Elevated AFP in a patient with known cirrhosis: warrants imaging (liver ultrasound or CT) to evaluate for hepatocellular carcinoma; AFP above 400 ng/mL is highly suspicious for HCC",
      "Rising CA-125 in a patient with ovarian cancer history: may indicate recurrence; correlate with symptoms (bloating, pelvic pain, ascites) and imaging findings",
      "Elevated hCG in a non-pregnant individual: requires urgent evaluation for gesticular germ cell tumor or gestational trophoblastic disease; in post-molar pregnancy, rising hCG indicates possible malignant transformation",
      "Patient anxiety and psychological distress related to pending or resulted tumor marker values; fear of recurrence is a significant concern for cancer survivors",
      "False-positive elevations causing unnecessary anxiety: CEA elevated from smoking, CA-125 elevated from endometriosis, PSA elevated from BPH"
    ],
    signs: {
      left: [
        "Mild anxiety about upcoming tumor marker results",
        "Stable tumor marker trends within expected post-treatment range",
        "Mild fatigue during surveillance period",
        "Questions about the meaning of tumor marker values",
        "Desire for education about cancer monitoring schedule",
        "Minor fluctuations in tumor marker levels (within normal variation)"
      ],
      right: [
        "Rapidly rising tumor marker levels suggesting treatment failure or recurrence",
        "New symptoms correlating with rising markers (pain, weight loss, new masses, ascites)",
        "Markedly elevated AFP (above 400 ng/mL) suggesting hepatocellular carcinoma",
        "Elevated hCG in a non-pregnant individual requiring urgent evaluation",
        "Severe anxiety, depression, or suicidal ideation related to cancer fear",
        "Multiple tumor markers elevated simultaneously suggesting widespread disease"
      ]
    },
    medications: [
      {
        name: "Tumor Marker Tracking Form",
        type: "Assessment Tool (documentation and monitoring instrument)",
        action: "Standardized clinical documentation tool used to systematically record sequential tumor marker values over time, enabling healthcare providers to identify trends (rising, stable, or declining) that guide clinical decision-making; includes columns for date, marker type, value, reference range, treatment phase, and clinical notes",
        sideEffects: "No adverse effects (documentation tool); potential for documentation errors if values are transcribed incorrectly",
        contra: "No contraindications; should be used for all oncology patients with tumor markers being monitored",
        pearl: "Always plot values chronologically to visualize trends; a single elevated value may be a false positive but a rising trend over 2-3 consecutive measurements is clinically significant and warrants further investigation; include the treatment or surveillance context with each value for accurate interpretation"
      },
      {
        name: "Trend Analysis Chart",
        type: "Assessment Tool (graphical monitoring instrument)",
        action: "Visual graphing tool that plots tumor marker values on a time-based chart, allowing healthcare providers and patients to visualize the trajectory of marker levels over weeks to months; facilitates rapid identification of concerning upward trends, stable plateaus, or therapeutic responses showing declining values",
        sideEffects: "No adverse effects (monitoring tool); may increase patient anxiety if not properly explained in clinical context",
        contra: "No contraindications; should be updated at each measurement interval",
        pearl: "Use a consistent scale and clearly mark treatment milestones (surgery date, chemotherapy cycles, radiation start/end) on the chart; share the visual trend with patients using therapeutic communication to help them understand their disease trajectory; doubling time calculations can be added for markers with exponential growth patterns (PSA doubling time in prostate cancer recurrence)"
      },
      {
        name: "Oncology Flowsheet",
        type: "Assessment Tool (comprehensive clinical documentation system)",
        action: "Integrated clinical documentation tool that combines tumor marker values with other oncology data including treatment regimen, imaging results, symptom assessment, performance status, laboratory values (CBC, metabolic panel, liver function), and clinical notes in a single comprehensive record; enables correlation of tumor marker changes with clinical status",
        sideEffects: "No adverse effects (documentation system); requires consistent updating to maintain accuracy and clinical utility",
        contra: "No contraindications; essential for comprehensive oncology care coordination",
        pearl: "The oncology flowsheet is the central reference document for treatment team communication; ensure it is updated before each clinic visit or treatment session; include the patient's ECOG performance status and symptom burden alongside tumor marker values because markers must be interpreted in clinical context; a rising tumor marker with declining performance status has different implications than a rising marker with stable clinical condition"
      }
    ],
    pearls: [
      "Tumor markers are used for MONITORING and TREND ANALYSIS in diagnosed cancers, not for screening the general population -- a single value is rarely diagnostic on its own",
      "PSA can be elevated by benign conditions (BPH, prostatitis, ejaculation, digital rectal exam, vigorous cycling) -- ensure the patient avoids these activities for 48 hours before specimen collection",
      "CEA is elevated in smokers (up to 5.0 ng/mL is considered normal in smokers vs 3.0 ng/mL in non-smokers) -- always document smoking status with CEA results",
      "CA-125 is unreliable as a screening test for ovarian cancer because it is elevated in many benign conditions (endometriosis, pregnancy, menstruation, PID, liver disease) -- it is most valuable for monitoring known ovarian cancer",
      "A rising TREND in tumor markers over consecutive measurements is far more clinically significant than a single elevated value -- always compare current values to previous results",
      "Elevated hCG in a non-pregnant individual is an urgent finding that requires immediate medical evaluation for gestational trophoblastic disease or germ cell tumor",
      "Provide emotional support when communicating about tumor markers -- patients often experience extreme anxiety while waiting for results or when values are rising, and may interpret any elevation as a death sentence without proper education"
    ],
    quiz: [
      {
        question: "A practical nurse is reviewing tumor marker results for a patient with a history of colorectal cancer. The CEA level has been rising over the past three consecutive measurements. What is the most appropriate action?",
        options: [
          "Reassure the patient that a single marker elevation is not concerning",
          "Report the rising trend to the physician because it may indicate disease recurrence",
          "Advise the patient to stop smoking as this is likely the cause",
          "Recommend repeating the test in six months"
        ],
        correct: 1,
        rationale: "A rising trend in CEA over consecutive measurements in a patient with colorectal cancer history is concerning for disease recurrence. The practical nurse should report this finding promptly to the physician for further evaluation with imaging. A trend is more significant than a single value. Waiting six months could delay detection of treatable recurrence."
      },
      {
        question: "A patient scheduled for PSA testing tells the practical nurse he had a digital rectal examination yesterday. What is the most appropriate nursing action?",
        options: [
          "Proceed with the blood draw as planned",
          "Inform the physician and suggest rescheduling the PSA draw to at least 48 hours after the digital rectal examination",
          "Cancel the test permanently",
          "Draw the blood but note in the chart that results may be inaccurate"
        ],
        correct: 1,
        rationale: "Digital rectal examination can falsely elevate PSA levels for approximately 48 hours. The most appropriate action is to inform the physician and suggest rescheduling the PSA draw to avoid a false-positive result that could lead to unnecessary anxiety and further testing."
      },
      {
        question: "A non-pregnant female patient has an elevated hCG level detected on routine bloodwork. The practical nurse recognizes this finding requires what action?",
        options: [
          "Repeat the test in one month to see if it normalizes",
          "Document the result and continue routine care",
          "Report immediately because elevated hCG in a non-pregnant individual may indicate gestational trophoblastic disease or germ cell tumor",
          "Advise the patient to take a home pregnancy test to confirm"
        ],
        correct: 2,
        rationale: "Elevated hCG in a confirmed non-pregnant individual is an urgent finding that may indicate gestational trophoblastic disease (hydatidiform mole, choriocarcinoma) or germ cell tumor. This requires immediate physician notification for further diagnostic evaluation. Waiting one month could delay treatment of a potentially aggressive malignancy."
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
console.log(`\nDone. Injected: ${injected}, Skipped: ${skipped}`);
