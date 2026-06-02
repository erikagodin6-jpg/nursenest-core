import type { LessonContent } from "./types";

export const clinicalConditionsBatchNLessons: Record<string, LessonContent> = {
  "bppv-management-rpn": {
    title: "BPPV",
    cellular: {
      title: "Pathophysiology of BPPV",
      content: "Benign paroxysmal positional vertigo (BPPV) occurs when calcium carbonate crystals called otoconia dislodge from the otolithic membrane of the utricle and migrate into a semicircular canal, most commonly the posterior canal. During positional head changes these free-floating otoconia move within the endolymph, inappropriately deflecting the cupula and triggering a false rotational signal to the vestibular nuclei. The mismatch between vestibular, visual, and proprioceptive input produces intense but brief episodes of vertigo, typically lasting less than 60 seconds. The nurse assists by monitoring patient safety during episodes, reinforcing fall precautions, administering prescribed vestibular suppressants, and reporting symptom patterns to the nursing team."
    },
    riskFactors: [
      "Age >50 years (age-related otoconia degeneration)",
      "Female sex",
      "Head trauma or concussion",
      "Prolonged bed rest or immobility",
      "Prior vestibular disorder (labyrinthitis, Meniere's)",
      "Osteoporosis and vitamin D deficiency",
      "Inner ear surgery"
    ],
    diagnostics: [
      "Monitor and report vertigo episodes including duration, triggers, and associated symptoms",
      "Observe for nystagmus during positional changes as directed",
      "Report any hearing changes to the RN",
      "Monitor vital signs before and after repositioning maneuvers",
      "Document patient's ability to ambulate safely"
    ],
    management: [
      "Assist with canalith repositioning maneuvers (Epley maneuver) as directed by the nurse or physiotherapist",
      "Administer vestibular suppressants (meclizine) as ordered",
      "Maintain fall precautions and assist with ambulation",
      "Keep side rails up and call bell within reach",
      "Encourage slow position changes to minimize vertigo triggers",
      "Reinforce Brandt-Daroff exercises as instructed by the physiotherapist"
    ],
    nursingActions: [
      "Assess for vertigo onset with position changes and report patterns",
      "Implement fall prevention measures: non-skid footwear, clear pathways, assist with transfers",
      "Monitor for nausea and vomiting during vertigo episodes",
      "Administer antiemetics as ordered for nausea",
      "Report any new neurological symptoms (diplopia, dysarthria, weakness) immediately",
      "Educate patient to change positions slowly, especially when rising from bed",
      "Document frequency, duration, and severity of vertigo episodes"
    ],
    signs: {
      left: [
        "Brief episodes of intense rotational vertigo (<60 seconds)",
        "Triggered by specific head positions (turning in bed, looking up, bending forward)",
        "Latency of onset (2-5 seconds after position change)",
        "Fatigability (symptoms lessen with repeated maneuvers)"
      ],
      right: [
        "Torsional or horizontal nystagmus during Dix-Hallpike test",
        "Nausea and occasional vomiting during episodes",
        "Postural instability and unsteadiness",
        "No hearing loss (differentiates from Meniere's disease)"
      ]
    },
    medications: [
      { name: "Meclizine", type: "Antihistamine / Vestibular suppressant", action: "Non-selective H1 antagonist that suppresses vestibular system excitability and inhibits the medullary chemoreceptor trigger zone", sideEffects: "Sedation, dry mouth, blurred vision, urinary retention", contra: "Narrow-angle glaucoma, BPH, concurrent CNS depressants", pearl: "Used for short-term acute symptom relief only. Does not treat the underlying otoconia displacement. Administer as ordered and report persistent vertigo." },
      { name: "Dimenhydrinate", type: "Antihistamine / Antiemetic", action: "Inhibits vestibular stimulation and acts on the chemoreceptor trigger zone to reduce nausea and vomiting", sideEffects: "Drowsiness, dry mouth, constipation, blurred vision", contra: "Narrow-angle glaucoma, neonates", pearl: "Useful for acute nausea during vertigo episodes. Report if drowsiness impairs patient safety or ambulation." }
    ],
    pearls: [
      "BPPV is the most common cause of peripheral vertigo",
      "Hearing loss is ABSENT in BPPV — its presence suggests Meniere's disease or labyrinthitis",
      "The Epley maneuver is the definitive treatment and resolves symptoms in approximately 80% of patients in one session",
      "Vertigo episodes are brief (<60 seconds) and always triggered by position changes",
      "Report any vertigo lasting minutes to hours, as this suggests a different diagnosis"
    ],
    quiz: [
      { question: "Which characteristic differentiates BPPV from Meniere's disease?", options: ["Presence of hearing loss", "Absence of hearing loss in BPPV", "Vertigo lasting hours", "Aural fullness"], correct: 1, rationale: "BPPV does not cause hearing loss. Meniere's disease is characterized by fluctuating hearing loss, tinnitus, aural fullness, and prolonged vertigo episodes." },
      { question: "What is the priority nursing action when a patient with BPPV experiences sudden vertigo while ambulating?", options: ["Administer meclizine immediately", "Guide the patient to sit or lie down safely and stay with them", "Perform the Epley maneuver independently", "Restrict all future ambulation"], correct: 1, rationale: "Patient safety is the priority. The nurse should guide the patient to a safe position to prevent falls and remain with them until the episode resolves." },
      { question: "A patient with BPPV reports that vertigo occurs every time they turn over in bed. What should the nurse teach?", options: ["Avoid all head movement permanently", "Change positions slowly and sit at the edge of the bed before standing", "Sleep in a fully upright position", "Take meclizine before every position change"], correct: 1, rationale: "Slow, deliberate position changes reduce the sudden endolymph displacement that triggers vertigo in BPPV." }
    ]
  },

  "bppv-management-rn": {
    title: "BPPV",
    cellular: {
      title: "Pathophysiology & Clinical Assessment of BPPV",
      content: "Benign paroxysmal positional vertigo results from displacement of otoconia (calcium carbonate crystals) from the utricular macula into one of the semicircular canals, most commonly the posterior canal (canalithiasis). In the less common cupulolithiasis variant, otoconia adhere directly to the cupula, rendering it gravity-sensitive. During head movement, displaced otoconia create abnormal endolymph flow that deflects the cupula, generating a false signal of angular acceleration. This vestibular-visual-proprioceptive mismatch causes vertigo, nystagmus, and postural instability. The nurse performs the Dix-Hallpike diagnostic maneuver, interprets nystagmus patterns to identify the affected canal, executes canalith repositioning procedures, and develops comprehensive fall prevention and vestibular rehabilitation plans."
    },
    riskFactors: [
      "Age >50 years with progressive otoconia degeneration",
      "Female sex (2:1 ratio)",
      "Head trauma (post-concussive BPPV)",
      "Prolonged bed rest or post-surgical immobility",
      "Prior inner ear infection (labyrinthitis, vestibular neuritis)",
      "Osteoporosis and vitamin D deficiency",
      "Meniere's disease (secondary BPPV)",
      "Post-stapedectomy or inner ear surgery"
    ],
    diagnostics: [
      "Perform Dix-Hallpike maneuver: positive when vertigo and torsional-upbeating nystagmus appear after 2-5 second latency",
      "Identify affected canal based on nystagmus direction: posterior canal shows geotropic torsional nystagmus",
      "Perform supine roll test for horizontal canal BPPV if Dix-Hallpike is negative",
      "Differentiate central from peripheral vertigo: assess for diplopia, dysarthria, dysphagia, limb weakness",
      "Evaluate hearing with bedside Weber and Rinne tests (should be normal in BPPV)",
      "Assess cerebellar function: finger-to-nose, rapid alternating movements, tandem gait"
    ],
    management: [
      "Perform Epley maneuver for posterior canal BPPV (80-90% effective in one session)",
      "Perform Lempert (BBQ roll) maneuver for horizontal canal variant",
      "Administer short-term vestibular suppressants (meclizine) per protocol for acute symptom management",
      "Coordinate vestibular physiotherapy referral for Brandt-Daroff habituation exercises",
      "Implement comprehensive fall risk assessment and prevention plan",
      "Instruct patient to avoid triggering positions for 48 hours post-Epley (sleep semi-reclined, avoid head extension)",
      "Schedule follow-up Dix-Hallpike to confirm resolution"
    ],
    nursingActions: [
      "Perform comprehensive neurological screening to rule out central causes of vertigo",
      "Execute Dix-Hallpike maneuver systematically, observing nystagmus characteristics",
      "Perform Epley canalith repositioning maneuver with proper technique and timing",
      "Assess balance and gait using timed up-and-go test and Romberg test",
      "Implement individualized fall prevention plan based on vertigo triggers",
      "Educate patient on home Brandt-Daroff exercises and proper technique",
      "Monitor for post-maneuver symptoms and assess for canal conversion",
      "Document nystagmus direction, latency, duration, and fatigability"
    ],
    signs: {
      left: [
        "Brief rotational vertigo (<60 seconds) with specific position changes",
        "Latency of 2-5 seconds before symptom onset",
        "Fatigability with repeated positioning",
        "Normal hearing and neurological examination",
        "Postural unsteadiness between episodes"
      ],
      right: [
        "Positive Dix-Hallpike: torsional-upbeating nystagmus toward affected ear",
        "Nausea and autonomic symptoms during episodes",
        "Nystagmus resolves within 30-60 seconds",
        "No spontaneous nystagmus between episodes",
        "Negative HINTS exam (differentiates from central causes)"
      ]
    },
    medications: [
      { name: "Meclizine", type: "Vestibular suppressant", action: "H1 antagonist with anticholinergic properties that suppresses vestibular nuclear activity and the medullary chemoreceptor trigger zone", sideEffects: "Sedation, xerostomia, blurred vision, urinary retention", contra: "Narrow-angle glaucoma, BPH, hepatic impairment", pearl: "Short-term use only; prolonged use can delay vestibular compensation. Not a substitute for canalith repositioning." },
      { name: "Dimenhydrinate", type: "Antihistamine / Antiemetic", action: "Combined antihistamine-anticholinergic that suppresses vestibular impulses and acts on the CTZ", sideEffects: "Drowsiness, dry mouth, constipation, tachycardia", contra: "Narrow-angle glaucoma, neonates, porphyria", pearl: "Available OTC. Useful for acute nausea during episodes but should not replace repositioning maneuvers." },
      { name: "Lorazepam", type: "Benzodiazepine", action: "Enhances GABA-A receptor activity, suppressing vestibular nuclei and reducing anxiety associated with vertigo", sideEffects: "Sedation, respiratory depression, dependence, ataxia", contra: "Severe respiratory insufficiency, sleep apnea, acute narrow-angle glaucoma", pearl: "Reserved for severe acute episodes refractory to antihistamines. Very short-term use only due to dependence risk and impaired vestibular compensation." },
      { name: "Ondansetron", type: "5-HT3 antagonist antiemetic", action: "Blocks serotonin receptors in the CTZ and vagal afferents to reduce nausea and vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "Concomitant apomorphine, severe hepatic impairment", pearl: "Does not cause sedation, making it preferred for patients who need to remain alert for vestibular rehabilitation exercises." }
    ],
    pearls: [
      "The Epley maneuver is the definitive treatment for posterior canal BPPV and is far more effective than medication alone",
      "A positive Dix-Hallpike test shows geotropic torsional nystagmus with 2-5 second latency, lasting <60 seconds, and fatigable on repeat",
      "Central vertigo red flags: no latency, non-fatigable nystagmus, direction-changing nystagmus, associated neurological deficits",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) helps differentiate peripheral from central vertigo at the bedside",
      "Post-Epley instructions: sleep semi-reclined for one night, avoid rapid head movements for 48 hours"
    ],
    quiz: [
      { question: "During a Dix-Hallpike maneuver, the nurse observes vertigo and torsional nystagmus that appears after 3 seconds and resolves within 30 seconds. What does this indicate?", options: ["Central vertigo requiring urgent imaging", "Positive test consistent with posterior canal BPPV", "Meniere's disease exacerbation", "Vestibular neuritis"], correct: 1, rationale: "Latency of onset (2-5 seconds), brief duration (<60 seconds), torsional nystagmus, and fatigability are classic for posterior canal BPPV." },
      { question: "Which finding during a vertigo assessment should prompt the nurse to suspect a central cause rather than BPPV?", options: ["Nystagmus lasting 20 seconds that fatigues on repeat", "Vertigo triggered by turning in bed", "Direction-changing nystagmus without latency and associated dysarthria", "Nausea during the Dix-Hallpike test"], correct: 2, rationale: "Direction-changing nystagmus without latency, combined with neurological signs like dysarthria, suggests a central lesion (brainstem or cerebellar) requiring urgent evaluation." },
      { question: "After performing the Epley maneuver, which instruction should the nurse give the patient?", options: ["Perform vigorous head shaking exercises immediately", "Sleep flat on the affected side tonight", "Sleep semi-reclined and avoid rapid head movements for 48 hours", "Return only if symptoms worsen over the next month"], correct: 2, rationale: "Post-Epley, patients should sleep semi-reclined to prevent otoconia from migrating back into the canal, and avoid rapid head movements for 48 hours." }
    ]
  },

  "bppv-management-np": {
    title: "BPPV",
    cellular: {
      title: "Pathophysiology & Differential Diagnosis",
      content: "BPPV involves displacement of otoconia from the utricular macula into a semicircular canal. Two mechanisms are recognized: canalithiasis, where free-floating otoconia create endolymph drag that deflects the cupula during positional changes, and cupulolithiasis, where otoconia adhere directly to the cupula, making it gravity-sensitive and producing persistent positional nystagmus. The posterior canal is affected in approximately 80% of cases due to its dependent anatomical position. Horizontal canal BPPV accounts for 15-20% and presents with direction-changing horizontal nystagmus on supine roll test. Anterior canal BPPV is rare (<5%). The clinician must differentiate BPPV from central positional vertigo (cerebellar or brainstem lesions), vestibular migraine, Meniere's disease, vestibular neuritis, and posterior circulation stroke. Key differentiators include nystagmus characteristics, latency, fatigability, duration, hearing status, and associated neurological findings."
    },
    riskFactors: [
      "Age >50 (progressive otoconia degeneration and decreased vestibular reserve)",
      "Female sex (2:1, possibly related to hormonal effects on otoconia metabolism)",
      "Head trauma (post-traumatic BPPV, often bilateral)",
      "Vestibular neuritis or labyrinthitis (secondary BPPV from otoconia damage)",
      "Meniere's disease (secondary BPPV from hydrops-related otoconia displacement)",
      "Vitamin D deficiency (impaired otoconia calcium homeostasis)",
      "Osteoporosis (shared calcium metabolism pathway)",
      "Post-surgical prolonged bed rest"
    ],
    diagnostics: [
      "Order and interpret Dix-Hallpike maneuver: identify canal by nystagmus vector (posterior: torsional-upbeating; anterior: torsional-downbeating)",
      "Order supine roll test for horizontal canal BPPV: geotropic nystagmus (canalithiasis) vs. apogeotropic (cupulolithiasis)",
      "Order MRI brain with attention to posterior fossa if central signs present or atypical nystagmus patterns",
      "Order audiometry to confirm normal hearing (hearing loss excludes BPPV)",
      "Order vestibular function testing (videonystagmography, caloric testing) for atypical or recurrent cases",
      "Order vitamin D level and calcium panel for recurrent BPPV",
      "Evaluate for posterior circulation ischemia: MRI-DWI if HINTS exam is central pattern"
    ],
    management: [
      "Prescribe and supervise Epley maneuver for posterior canal BPPV (efficacy 80-90%)",
      "Prescribe Lempert (BBQ roll) maneuver for horizontal canal canalithiasis",
      "Order vestibular rehabilitation therapy for persistent balance dysfunction",
      "Prescribe short-term vestibular suppressants (meclizine 25mg TID PRN) for severe acute episodes only",
      "Order vitamin D supplementation (1000-2000 IU daily) for deficiency-related recurrent BPPV",
      "Consider surgical intervention referral (posterior canal occlusion) for intractable cases failing repeated repositioning",
      "Differentiate and manage canal conversion (posterior to horizontal) that may occur during repositioning",
      "Prescribe Brandt-Daroff home exercise program for residual symptoms"
    ],
    nursingActions: [
      "Perform comprehensive neuro-otologic examination including cranial nerves, cerebellar function, and gait assessment",
      "Execute HINTS exam (Head Impulse, Nystagmus, Test of Skew) to differentiate peripheral from central vertigo",
      "Identify affected canal and variant (canalithiasis vs. cupulolithiasis) based on nystagmus characteristics",
      "Perform appropriate repositioning maneuver based on canal identified",
      "Assess for risk factors for recurrence and address modifiable factors",
      "Screen for comorbid vestibular migraine and anxiety/panic disorder",
      "Develop longitudinal management plan for recurrent BPPV",
      "Evaluate for secondary BPPV causes: Meniere's, head trauma, vestibular neuritis"
    ],
    signs: {
      left: [
        "Brief positional vertigo (<60 seconds for canalithiasis, longer for cupulolithiasis)",
        "Latency of 2-5 seconds (canalithiasis) or no latency (cupulolithiasis)",
        "Fatigable nystagmus on repeated maneuvers",
        "Normal neurological examination",
        "Normal hearing on audiometry"
      ],
      right: [
        "Positive Dix-Hallpike with canal-specific nystagmus pattern",
        "Posterior canal: torsional-upbeating nystagmus toward affected ear",
        "Horizontal canal: direction-changing horizontal nystagmus on roll test",
        "Autonomic symptoms: nausea, diaphoresis, pallor during episodes",
        "Subjective imbalance and oscillopsia between episodes"
      ]
    },
    medications: [
      { name: "Meclizine", type: "Vestibular suppressant", action: "H1 antihistamine with anticholinergic properties suppressing vestibular nuclei and CTZ activity", sideEffects: "Sedation, xerostomia, urinary retention, cognitive impairment in elderly", contra: "Narrow-angle glaucoma, BPH, concurrent anticholinergics", pearl: "Prescribe short-term only (3-5 days). Prolonged use delays central vestibular compensation and worsens long-term outcomes." },
      { name: "Vitamin D3 (Cholecalciferol)", type: "Vitamin supplement", action: "Supports calcium homeostasis in the otoconial matrix, may reduce otoconia fragility and displacement", sideEffects: "Hypercalcemia at supratherapeutic doses, nephrolithiasis", contra: "Hypercalcemia, granulomatous disease, severe renal impairment", pearl: "Studies show vitamin D supplementation (1000-2000 IU/day) reduces BPPV recurrence by up to 45% in deficient patients. Check 25-OH vitamin D level." },
      { name: "Lorazepam", type: "Benzodiazepine", action: "GABA-A receptor potentiator that suppresses vestibular nuclei firing and reduces anxiety-related hyperventilation that can worsen vertigo", sideEffects: "Sedation, respiratory depression, dependence, paradoxical agitation in elderly", contra: "Respiratory insufficiency, myasthenia gravis, severe hepatic impairment", pearl: "Reserve for refractory acute episodes. Limit to 1-3 days. Benzodiazepines significantly delay vestibular compensation." },
      { name: "Betahistine", type: "Histamine analogue", action: "H1 agonist and H3 antagonist that improves inner ear microcirculation and facilitates vestibular compensation", sideEffects: "Nausea, bloating, headache", contra: "Pheochromocytoma, active peptic ulcer disease", pearl: "Off-label use for recurrent BPPV. Evidence is modest but may be considered when repositioning maneuvers provide only temporary relief." }
    ],
    pearls: [
      "Canalith repositioning maneuvers are the treatment of choice and should always be attempted before prescribing medications",
      "Direction-changing nystagmus on supine roll test indicates horizontal canal BPPV; geotropic = canalithiasis, apogeotropic = cupulolithiasis",
      "Post-traumatic BPPV is often bilateral and may involve multiple canals simultaneously",
      "Recurrent BPPV (>3 episodes/year) should prompt evaluation for vitamin D deficiency, osteoporosis, and comorbid vestibular migraine",
      "The HINTS exam has 99% sensitivity for identifying central causes of acute vestibular syndrome — superior to early MRI"
    ],
    quiz: [
      { question: "A patient presents with positional vertigo and horizontal direction-changing nystagmus on supine roll test. Which canal is most likely affected?", options: ["Posterior semicircular canal", "Anterior semicircular canal", "Horizontal (lateral) semicircular canal", "Superior semicircular canal"], correct: 2, rationale: "Horizontal direction-changing nystagmus on supine roll test is diagnostic of horizontal canal BPPV, which requires a different repositioning maneuver (Lempert/BBQ roll) than the Epley." },
      { question: "An NP evaluates a patient with recurrent BPPV (4 episodes in 6 months). Which additional workup is most appropriate?", options: ["CT head without contrast", "Lumbar puncture", "Serum 25-hydroxyvitamin D level and DEXA scan", "Carotid Doppler ultrasound"], correct: 2, rationale: "Recurrent BPPV is associated with vitamin D deficiency and osteoporosis. Supplementation has been shown to reduce recurrence rates significantly." },
      { question: "Which finding on HINTS exam indicates a central cause of vertigo requiring urgent neuroimaging?", options: ["Positive head impulse test (corrective saccade)", "Unidirectional horizontal nystagmus", "Normal test of skew", "Negative head impulse test with direction-changing nystagmus and skew deviation"], correct: 3, rationale: "A negative head impulse test (no corrective saccade), direction-changing nystagmus, and positive test of skew (vertical misalignment) constitute a 'dangerous' HINTS pattern indicating central pathology such as posterior circulation stroke." }
    ]
  },

  "menieres-disease-rpn": {
    title: "Meniere's Disease",
    cellular: {
      title: "Pathophysiology of Meniere's Disease",
      content: "Meniere's disease is caused by endolymphatic hydrops — an excess accumulation of endolymph within the membranous labyrinth of the inner ear. The increased pressure distends the scala media, distorting the mechanical properties of the basilar and Reissner membranes. Microperforations in the distended membranes allow mixing of potassium-rich endolymph with sodium-rich perilymph, creating ionic imbalances that disrupt hair cell function. This produces the classic triad of episodic vertigo, fluctuating sensorineural hearing loss, and tinnitus, often accompanied by a sensation of aural fullness. The nurse monitors symptoms, administers prescribed medications, maintains patient safety during acute episodes, and reports changes in hearing and vertigo patterns."
    },
    riskFactors: [
      "Age 40-60 years",
      "Family history of Meniere's disease",
      "Autoimmune disorders",
      "Allergies",
      "High sodium diet",
      "Viral infections (prior inner ear infection)",
      "Thyroid disease",
      "Migraine history"
    ],
    diagnostics: [
      "Monitor and report vertigo episodes including onset, duration (20 min to 12 hours), and severity",
      "Report any changes in hearing, especially unilateral hearing loss",
      "Monitor for tinnitus and aural fullness patterns",
      "Record vital signs during acute episodes",
      "Document nausea, vomiting, and dietary intake"
    ],
    management: [
      "Administer vestibular suppressants (meclizine, dimenhydrinate) as ordered during acute episodes",
      "Administer antiemetics as ordered for nausea and vomiting",
      "Reinforce sodium restriction (<2g/day) as ordered",
      "Encourage avoidance of caffeine, nicotine, and alcohol",
      "Maintain fall precautions during and after episodes",
      "Provide a quiet, calm environment during acute vertigo attacks"
    ],
    nursingActions: [
      "Assess and document vertigo episodes: timing, duration, triggers, associated symptoms",
      "Implement fall prevention: side rails up, call bell within reach, assist with ambulation",
      "Monitor hearing changes and report new or worsening unilateral hearing loss",
      "Administer medications as ordered and monitor for side effects",
      "Provide emotional support — chronic episodic vertigo causes significant anxiety",
      "Report any new neurological symptoms (facial weakness, diplopia, dysarthria) immediately",
      "Educate patient on dietary restrictions and trigger avoidance"
    ],
    signs: {
      left: [
        "Spontaneous rotational vertigo lasting 20 minutes to 12 hours",
        "Fluctuating low-to-medium frequency sensorineural hearing loss",
        "Tinnitus (usually roaring or buzzing quality)",
        "Aural fullness or pressure in the affected ear"
      ],
      right: [
        "Nausea and vomiting during acute episodes",
        "Horizontal nystagmus during attacks",
        "Unilateral onset (typically affects one ear initially)",
        "Progressive hearing loss over time",
        "Negative Dix-Hallpike test (differentiates from BPPV)"
      ]
    },
    medications: [
      { name: "Meclizine", type: "Vestibular suppressant", action: "H1 antagonist that suppresses vestibular system excitability and the chemoreceptor trigger zone", sideEffects: "Sedation, dry mouth, blurred vision", contra: "Narrow-angle glaucoma, BPH", pearl: "Used for acute symptom control only. Report if vertigo episodes are lasting longer than usual or increasing in frequency." },
      { name: "Dimenhydrinate", type: "Antihistamine / Antiemetic", action: "Suppresses vestibular stimulation and reduces nausea via CTZ inhibition", sideEffects: "Drowsiness, dry mouth, constipation", contra: "Narrow-angle glaucoma, neonates", pearl: "Helps manage nausea and vomiting during acute Meniere's attacks. Administer as ordered." }
    ],
    pearls: [
      "Meniere's disease episodes last 20 minutes to 12 hours — this duration differentiates it from BPPV (<1 minute) and vestibular neuritis (days)",
      "Hearing loss in Meniere's is fluctuating initially but becomes permanent over time",
      "Sodium restriction is a cornerstone of long-term management",
      "Report any sudden permanent hearing loss — this may indicate a different diagnosis requiring urgent evaluation",
      "The triad of vertigo + hearing loss + tinnitus is classic for Meniere's disease"
    ],
    quiz: [
      { question: "Which symptom combination is most characteristic of Meniere's disease?", options: ["Brief vertigo with position changes and normal hearing", "Prolonged vertigo with fluctuating hearing loss and tinnitus", "Constant dizziness with bilateral hearing loss", "Vertigo with facial paralysis and vesicular rash"], correct: 1, rationale: "Meniere's disease presents with the classic triad of episodic vertigo lasting 20 min to 12 hours, fluctuating sensorineural hearing loss, and tinnitus with aural fullness." },
      { question: "Which dietary restriction should the nurse reinforce for a patient with Meniere's disease?", options: ["Low-protein diet", "Low-sodium diet (<2g/day)", "High-potassium diet", "Gluten-free diet"], correct: 1, rationale: "Sodium restriction reduces endolymphatic pressure and is a first-line management strategy for Meniere's disease." },
      { question: "A patient with Meniere's disease is experiencing acute vertigo with severe nausea. What is the RPN's priority action?", options: ["Encourage ambulation to improve balance", "Ensure patient safety, administer antiemetics as ordered, and provide a calm environment", "Perform the Epley maneuver", "Restrict all oral fluids"], correct: 1, rationale: "During acute Meniere's episodes, safety is the priority. Antiemetics manage nausea, and a calm environment reduces sensory stimulation that can worsen symptoms." }
    ]
  },

  "menieres-disease-rn": {
    title: "Meniere's Disease",
    cellular: {
      title: "Pathophysiology of Endolymphatic Hydrops",
      content: "Meniere's disease results from endolymphatic hydrops — distension of the endolymphatic space due to impaired endolymph reabsorption by the endolymphatic sac or overproduction of endolymph. The distended scala media alters the mechanical properties of the cochlear partition, impairing frequency-selective hair cell transduction and producing fluctuating hearing loss. Episodic rupture of the distended Reissner membrane creates microperforations that allow potassium-rich endolymph to mix with sodium-rich perilymph surrounding the hair cells and afferent nerve terminals. This ionic imbalance (potassium intoxication) depolarizes and temporarily paralyzes hair cells and vestibular afferents, producing acute vertigo, hearing loss, and tinnitus. The nurse performs comprehensive vestibular assessment, manages acute episodes with pharmacological and non-pharmacological interventions, coordinates audiometric monitoring, and develops individualized patient education plans for trigger avoidance and long-term management."
    },
    riskFactors: [
      "Age 40-60 years (peak incidence)",
      "Family history (10-15% have affected relatives)",
      "Autoimmune inner ear disease",
      "Allergic disease (possible endolymphatic sac inflammation)",
      "Viral infections (herpes simplex, CMV)",
      "Migraine (vestibular migraine shares features)",
      "High sodium intake",
      "Thyroid disease",
      "Syphilis (secondary endolymphatic hydrops)"
    ],
    diagnostics: [
      "Perform comprehensive vestibular assessment using validated scales (DHI, VVAS)",
      "Assess hearing with bedside tests: Weber (lateralizes to unaffected ear in SNHL) and Rinne (air > bone in SNHL)",
      "Coordinate formal audiometry: low-to-medium frequency sensorineural hearing loss pattern is characteristic",
      "Evaluate nystagmus characteristics: spontaneous horizontal nystagmus during attacks, may beat toward or away from affected ear",
      "Assess for Tullio phenomenon (sound-induced vertigo) suggesting superior canal dehiscence",
      "Monitor electrolyte levels with diuretic therapy",
      "Assess hydration status and fluid balance"
    ],
    management: [
      "Administer vestibular suppressants per protocol during acute episodes: meclizine, dimenhydrinate",
      "Administer antiemetics for associated nausea: ondansetron, dimenhydrinate",
      "Implement sodium restriction (<1500-2000 mg/day) and educate on hidden dietary sodium",
      "Administer thiazide diuretics (hydrochlorothiazide) as prescribed for long-term management",
      "Administer betahistine as prescribed for vestibular symptom reduction",
      "Coordinate audiometry referral for serial hearing monitoring",
      "Implement fall prevention protocol during and between episodes",
      "Coordinate ENT referral for refractory cases or progressive hearing loss"
    ],
    nursingActions: [
      "Perform systematic assessment during acute episodes: vital signs, neuro check, hearing evaluation",
      "Differentiate Meniere's from BPPV: Meniere's has hearing loss, longer episodes, no positional trigger",
      "Assess and document episode frequency, duration, severity, and triggers",
      "Monitor for Tumarkin crises (sudden drop attacks without loss of consciousness)",
      "Evaluate psychological impact: screen for anxiety and depression",
      "Teach trigger identification and avoidance: sodium, caffeine, alcohol, nicotine, stress",
      "Educate on progressive nature: hearing loss may become permanent",
      "Coordinate multidisciplinary care: audiology, vestibular rehabilitation, psychology"
    ],
    signs: {
      left: [
        "Episodic rotational vertigo (20 minutes to 12 hours)",
        "Fluctuating low-frequency sensorineural hearing loss",
        "Roaring or buzzing tinnitus (ipsilateral)",
        "Aural fullness preceding episodes",
        "Tumarkin crisis (sudden drop attacks) in advanced cases"
      ],
      right: [
        "Horizontal spontaneous nystagmus during attacks",
        "Nausea, vomiting, diaphoresis during episodes",
        "Positive Romberg test during episodes",
        "Weber lateralizing to unaffected ear",
        "Progressive hearing loss with repeated episodes"
      ]
    },
    medications: [
      { name: "Hydrochlorothiazide", type: "Thiazide diuretic", action: "Reduces sodium and water reabsorption in the distal convoluted tubule, aiming to reduce endolymphatic pressure", sideEffects: "Hypokalemia, hyponatremia, hyperuricemia, orthostatic hypotension", contra: "Anuria, severe renal impairment, sulfonamide allergy", pearl: "Monitor potassium levels. Despite limited evidence, thiazides remain a standard treatment. Combine with potassium supplementation or potassium-sparing diuretic." },
      { name: "Betahistine", type: "Histamine analogue", action: "H1 agonist on precapillary sphincters of stria vascularis (vasodilation, improved microcirculation) and H3 antagonist in vestibular nuclei (facilitates vestibular compensation)", sideEffects: "Nausea, bloating, headache, GI upset", contra: "Pheochromocytoma, active peptic ulcer disease", pearl: "Off-label in Canada. Used after dietary and diuretic therapy. Modest benefits shown for reducing vertigo frequency. Typical dose: 16-48mg TID." },
      { name: "Meclizine", type: "Vestibular suppressant", action: "H1 antagonist suppressing vestibular nuclei and CTZ for acute vertigo and nausea control", sideEffects: "Sedation, dry mouth, blurred vision, urinary retention", contra: "Narrow-angle glaucoma, BPH", pearl: "Acute use only. Should not be used between episodes as it delays vestibular compensation." },
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces inflammation in the endolymphatic sac and vestibular apparatus; may reduce endolymphatic hydrops", sideEffects: "Hyperglycemia, insomnia, GI irritation, immunosuppression", contra: "Active systemic infection, uncontrolled diabetes", pearl: "Short course (7-14 days) for acute exacerbations. May help reverse vertigo, tinnitus, and hearing loss by reducing endolymphatic pressure." }
    ],
    pearls: [
      "Meniere's triad: episodic vertigo + fluctuating SNHL + tinnitus with aural fullness",
      "Duration of vertigo episodes differentiates vestibular disorders: BPPV <1 min, Meniere's 20 min-12 hrs, vestibular neuritis days",
      "Low-frequency hearing loss on audiometry is characteristic early on; hearing loss becomes permanent with repeated episodes",
      "Tumarkin crises (otolithic crises) are sudden drop attacks without loss of consciousness — dangerous fall risk",
      "Patients with Meniere's disease have significantly higher rates of anxiety and depression; screen regularly"
    ],
    quiz: [
      { question: "The nurse is assessing a patient during a Meniere's disease episode. Which finding differentiates this from BPPV?", options: ["Vertigo triggered by head position changes", "Brief episodes lasting under 30 seconds", "Fluctuating hearing loss with tinnitus", "Positive Dix-Hallpike test"], correct: 2, rationale: "Meniere's disease is characterized by fluctuating hearing loss and tinnitus, which are absent in BPPV. Meniere's episodes last 20 minutes to hours and are not triggered by specific head positions." },
      { question: "A patient on hydrochlorothiazide for Meniere's disease reports muscle weakness and fatigue. Which lab should the nurse check first?", options: ["Troponin", "Serum potassium", "Hemoglobin A1C", "BNP"], correct: 1, rationale: "Hydrochlorothiazide causes potassium wasting. Muscle weakness and fatigue are classic hypokalemia symptoms requiring urgent potassium level assessment." },
      { question: "Which patient teaching is essential for long-term Meniere's disease management?", options: ["Increase dietary sodium to maintain blood pressure", "Limit sodium to <2g/day and avoid caffeine, alcohol, and nicotine", "Take meclizine daily as prevention", "Perform the Epley maneuver at home during episodes"], correct: 1, rationale: "Dietary sodium restriction reduces endolymphatic pressure and is the cornerstone of Meniere's management. Caffeine, alcohol, and nicotine are known triggers." }
    ]
  },

  "menieres-disease-np": {
    title: "Meniere's Disease",
    cellular: {
      title: "Pathophysiology & Differential Diagnosis",
      content: "Meniere's disease is characterized by endolymphatic hydrops resulting from impaired endolymph homeostasis. The endolymphatic sac, responsible for endolymph reabsorption and immune surveillance, becomes dysfunctional through mechanisms including autoimmune inflammation, viral damage, anatomical obstruction of the endolymphatic duct, or genetic predisposition affecting aquaporin channels and ion transport. Progressive distension of the scala media distorts the organ of Corti, disrupting frequency-specific cochlear tonotopy and producing the characteristic low-frequency hearing loss. Episodic membrane ruptures cause potassium intoxication of vestibular and cochlear hair cells. The clinician must differentiate Meniere's from vestibular migraine (the most common mimicker), autoimmune inner ear disease, vestibular schwannoma, syphilitic labyrinthitis, and superior canal dehiscence syndrome. Management includes initiating stepped pharmacotherapy, ordering and interpreting audiometric and vestibular testing, prescribing intratympanic therapies for refractory cases, and coordinating surgical referrals."
    },
    riskFactors: [
      "Genetic susceptibility (familial clustering in 10-15%)",
      "Autoimmune disease (systemic lupus, rheumatoid arthritis, thyroiditis)",
      "Viral labyrinthitis (herpes simplex, CMV — may damage endolymphatic sac)",
      "Allergic disease (IgE-mediated endolymphatic sac inflammation)",
      "Migraine (shared pathophysiology with vestibular migraine)",
      "Anatomical variants (hypoplastic endolymphatic duct)",
      "High sodium intake",
      "Syphilis (secondary endolymphatic hydrops)",
      "Otosclerosis"
    ],
    diagnostics: [
      "Order pure-tone audiometry: low-frequency SNHL pattern (250-1000 Hz), fluctuating early, progressive later",
      "Order electrocochleography (ECoG): elevated SP/AP ratio >0.4 supports endolymphatic hydrops",
      "Order caloric testing: reduced vestibular response (canal paresis) on affected side",
      "Order MRI with gadolinium (3T) to visualize endolymphatic hydrops and exclude vestibular schwannoma",
      "Order vestibular evoked myogenic potentials (VEMPs) to assess otolith function",
      "Order FTA-ABS to rule out neurosyphilis in bilateral or atypical presentations",
      "Order autoimmune panel (ESR, ANA, anti-68kD antibody) if autoimmune inner ear disease suspected",
      "Order thyroid function tests (Meniere's associated with thyroid disease)"
    ],
    management: [
      "Prescribe stepped therapy: Step 1 — dietary sodium restriction (<1500mg), caffeine/alcohol/nicotine avoidance",
      "Step 2 — Prescribe thiazide diuretic (hydrochlorothiazide 25-50mg daily) with potassium monitoring",
      "Step 3 — Prescribe betahistine 16-48mg TID for vestibular symptom reduction",
      "Prescribe acute episode management: meclizine 25mg TID PRN, ondansetron 4-8mg PRN for nausea",
      "Prescribe short-course oral prednisone (40-60mg taper over 10-14 days) for acute exacerbations with hearing loss",
      "Order intratympanic dexamethasone injection series for refractory vertigo with preserved hearing",
      "Consider intratympanic gentamicin for refractory vertigo when hearing preservation is not primary goal",
      "Refer to otolaryngology for endolymphatic sac decompression or vestibular nerve section in refractory cases"
    ],
    nursingActions: [
      "Establish definitive diagnosis using AAO-HNS criteria: 2+ spontaneous vertigo episodes (20 min-12 hrs), audiometrically documented SNHL, fluctuating aural symptoms",
      "Differentiate from vestibular migraine: VM has headache, photophobia, visual aura; Meniere's has documented SNHL on audiometry",
      "Exclude vestibular schwannoma with contrast MRI in all unilateral SNHL presentations",
      "Develop individualized stepped treatment algorithm with clear escalation triggers",
      "Monitor audiometric progression at 3-6 month intervals",
      "Screen for bilateral disease development (30-50% become bilateral over 10+ years)",
      "Assess functional impact and driving safety",
      "Coordinate vestibular rehabilitation referral for chronic imbalance"
    ],
    signs: {
      left: [
        "Episodic vertigo lasting 20 minutes to 12 hours with symptom-free intervals",
        "Low-frequency SNHL on audiometry (initially fluctuating, later permanent)",
        "Roaring tinnitus ipsilateral to affected ear",
        "Aural fullness or pressure preceding attacks",
        "Tumarkin crises in late disease (sudden otolithic drop attacks)"
      ],
      right: [
        "Elevated SP/AP ratio on electrocochleography (>0.4)",
        "Canal paresis on caloric testing (reduced vestibular response)",
        "Endolymphatic hydrops visible on gadolinium-enhanced 3T MRI",
        "Progressive bilateral involvement (30-50% over time)",
        "Spontaneous horizontal nystagmus during acute episodes"
      ]
    },
    medications: [
      { name: "Hydrochlorothiazide", type: "Thiazide diuretic", action: "Reduces sodium reabsorption in DCT, decreasing total body fluid volume and theoretically endolymphatic pressure", sideEffects: "Hypokalemia, hyperuricemia, hyponatremia, hyperglycemia, photosensitivity", contra: "Anuria, severe renal failure, sulfonamide hypersensitivity", pearl: "Standard dose 25-50mg daily. Monitor K+, Na+, uric acid. Consider K+ supplementation or combination with triamterene. Evidence is moderate but remains standard of care." },
      { name: "Betahistine", type: "Histamine analogue", action: "H1 agonist: vasodilation of precapillary sphincters in stria vascularis, improving inner ear microcirculation. H3 antagonist: disinhibits histamine release in vestibular nuclei, facilitating central vestibular compensation", sideEffects: "Nausea, bloating, headache, epigastric discomfort", contra: "Pheochromocytoma, active peptic ulcer disease", pearl: "Dose range 16-48mg TID. Higher doses may be more effective. Off-label in Canada. Use after dietary and diuretic therapy have been optimized." },
      { name: "Intratympanic Dexamethasone", type: "Corticosteroid (local delivery)", action: "Direct anti-inflammatory action on endolymphatic sac and vestibular epithelium, reducing hydrops and immune-mediated damage", sideEffects: "Transient ear pain, tympanic membrane perforation (rare), temporary hearing changes", contra: "Tympanic membrane perforation (relative), active middle ear infection", pearl: "Series of 3-4 injections over weeks. Preserves hearing while reducing vertigo. Preferred over gentamicin when hearing preservation is the goal." },
      { name: "Intratympanic Gentamicin", type: "Aminoglycoside (vestibulotoxic)", action: "Selectively ablates vestibular hair cells (type I cells are most susceptible), reducing abnormal vestibular input from the affected ear", sideEffects: "Sensorineural hearing loss (20-30% risk), oscillopsia, imbalance", contra: "Only hearing ear, bilateral Meniere's with poor hearing, patient unable to compensate", pearl: "Reserved for intractable vertigo when hearing is already significantly impaired. Low-dose protocol reduces hearing loss risk. Vertigo control rate >85%." }
    ],
    pearls: [
      "AAO-HNS diagnostic criteria: 2+ vertigo episodes (20 min-12 hrs) + audiometrically documented low-frequency SNHL + fluctuating aural symptoms (tinnitus, fullness)",
      "Vestibular migraine is the most common mimicker: differentiate by headache history, photophobia, normal audiometry, and migraine-specific triggers",
      "30-50% of patients develop bilateral Meniere's over time — monitor contralateral ear at every visit",
      "Intratympanic dexamethasone preserves hearing; intratympanic gentamicin sacrifices it — match intervention to hearing status",
      "Tumarkin crises (sudden drop attacks) are an indication for aggressive intervention due to high injury risk"
    ],
    quiz: [
      { question: "Which audiometric pattern is most characteristic of early Meniere's disease?", options: ["High-frequency sensorineural hearing loss", "Conductive hearing loss with air-bone gap", "Low-frequency sensorineural hearing loss (250-1000 Hz)", "Bilateral symmetric hearing loss at all frequencies"], correct: 2, rationale: "Early Meniere's disease characteristically produces low-frequency SNHL that fluctuates. This helps differentiate it from noise-induced hearing loss (high-frequency) and otosclerosis (conductive)." },
      { question: "An NP is considering intratympanic therapy for a patient with refractory Meniere's disease and moderate remaining hearing. Which agent is most appropriate?", options: ["Intratympanic gentamicin", "Intratympanic dexamethasone", "Intratympanic methotrexate", "Intratympanic lidocaine"], correct: 1, rationale: "Intratympanic dexamethasone is preferred when hearing preservation is important, as gentamicin carries a 20-30% risk of additional hearing loss." },
      { question: "Which condition is the most important differential diagnosis to exclude in a patient presenting with unilateral hearing loss, tinnitus, and imbalance?", options: ["BPPV", "Vestibular schwannoma", "Otitis externa", "Cerumen impaction"], correct: 1, rationale: "Vestibular schwannoma (acoustic neuroma) can mimic Meniere's disease with unilateral SNHL and tinnitus. MRI with gadolinium must be ordered to exclude this serious diagnosis." }
    ]
  },

  "labyrinthitis-rpn": {
    title: "Labyrinthitis & Vestibular Neuritis",
    cellular: {
      title: "Pathophysiology of Labyrinthitis",
      content: "Labyrinthitis is acute inflammation of the inner ear labyrinth affecting both the vestibular and cochlear structures, causing sudden onset of persistent vertigo with associated hearing loss. When only the vestibular nerve is involved without cochlear symptoms, the condition is termed vestibular neuritis. Most cases follow viral upper respiratory infections (influenza, varicella, measles, mumps), with viruses causing direct inflammation of the membranous labyrinth or the vestibular nerve. Bacterial labyrinthitis is less common but more dangerous, often arising from otitis media or meningitis spreading to the inner ear. The nurse monitors the patient's symptoms, administers prescribed medications, maintains safety during the acute phase, and reports any changes or new neurological symptoms."
    },
    riskFactors: [
      "Recent viral upper respiratory infection",
      "History of chickenpox, flu, measles, or mumps",
      "Otitis media (risk for bacterial labyrinthitis)",
      "Bacterial meningitis",
      "Cholesteatoma",
      "Immunocompromised state",
      "Smoking",
      "Excessive alcohol use"
    ],
    diagnostics: [
      "Monitor and report vertigo characteristics: constant (not positional), onset, duration, severity",
      "Report any hearing changes — hearing loss differentiates labyrinthitis from vestibular neuritis",
      "Monitor vital signs especially temperature (fever suggests bacterial cause)",
      "Observe and report nystagmus direction (typically beats away from affected ear)",
      "Report any new neurological symptoms immediately (facial weakness, severe headache, neck stiffness)"
    ],
    management: [
      "Administer vestibular suppressants as ordered (meclizine, dimenhydrinate)",
      "Administer antiemetics as ordered for nausea and vomiting",
      "Maintain bed rest during acute phase as ordered",
      "Maintain fall precautions with strict safety measures",
      "Ensure adequate hydration, especially if vomiting",
      "Provide a quiet, dimly lit environment to reduce sensory stimulation"
    ],
    nursingActions: [
      "Assess vertigo severity and impact on ADLs and report changes",
      "Implement strict fall prevention: side rails, non-skid footwear, assist with transfers",
      "Monitor intake and output — vomiting can cause dehydration",
      "Report any fever or worsening symptoms suggesting bacterial cause",
      "Report new neurological symptoms: facial weakness, severe headache, altered consciousness",
      "Administer medications as ordered and monitor for sedation",
      "Provide emotional support — sudden severe vertigo is very distressing"
    ],
    signs: {
      left: [
        "Acute onset persistent vertigo (lasting days, not triggered by position)",
        "Hearing loss (present in labyrinthitis, absent in vestibular neuritis)",
        "Tinnitus (with labyrinthitis)",
        "Often preceded by viral URI symptoms"
      ],
      right: [
        "Spontaneous horizontal nystagmus beating away from affected ear",
        "Severe nausea and vomiting",
        "Postural instability and falls toward affected side",
        "Gradual improvement over days to weeks"
      ]
    },
    medications: [
      { name: "Meclizine", type: "Vestibular suppressant", action: "H1 antagonist suppressing vestibular nuclei activity and CTZ for nausea control", sideEffects: "Sedation, dry mouth, blurred vision", contra: "Narrow-angle glaucoma, BPH", pearl: "Used for acute symptom management. Report if vertigo does not begin improving within 48-72 hours." },
      { name: "Ondansetron", type: "5-HT3 antagonist antiemetic", action: "Blocks serotonin receptors at CTZ and vagal afferents to reduce nausea and vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "Concomitant apomorphine", pearl: "Preferred antiemetic when patient needs to remain alert. Does not worsen sedation from vestibular suppressants." }
    ],
    pearls: [
      "Labyrinthitis = vestibular symptoms + hearing loss; vestibular neuritis = vestibular symptoms only (no hearing loss)",
      "Vertigo is persistent and constant, unlike BPPV which is triggered by position changes",
      "Symptoms typically improve gradually over 1-3 weeks",
      "Report any facial weakness immediately — may indicate Ramsay-Hunt syndrome or brainstem pathology",
      "Bacterial labyrinthitis is a medical emergency requiring IV antibiotics"
    ],
    quiz: [
      { question: "What differentiates labyrinthitis from vestibular neuritis?", options: ["Vertigo is more severe in vestibular neuritis", "Labyrinthitis includes hearing loss while vestibular neuritis does not", "Vestibular neuritis lasts longer", "Labyrinthitis is always bacterial"], correct: 1, rationale: "Labyrinthitis involves inflammation of the entire labyrinth including the cochlea, causing hearing loss and tinnitus in addition to vertigo. Vestibular neuritis affects only the vestibular nerve, sparing hearing." },
      { question: "Which finding should the nurse report immediately in a patient with suspected labyrinthitis?", options: ["Mild nausea", "Gradual improvement in vertigo after 3 days", "Fever of 39.5°C with neck stiffness", "Preference to lie on the unaffected side"], correct: 2, rationale: "High fever with neck stiffness suggests bacterial meningitis with secondary labyrinthitis, a medical emergency requiring immediate intervention." },
      { question: "Which environmental modification should the nurse implement during an acute labyrinthitis episode?", options: ["Bright lighting and television to distract the patient", "Quiet, dimly lit environment with minimal sensory stimulation", "Frequent position changes to promote vestibular compensation", "Open windows for fresh air circulation"], correct: 1, rationale: "Reducing visual and auditory stimulation helps minimize the sensory mismatch that worsens vertigo and nausea during acute labyrinthitis." }
    ]
  },

  "labyrinthitis-rn": {
    title: "Labyrinthitis & Vestibular Neuritis",
    cellular: {
      title: "Pathophysiology & Clinical Assessment",
      content: "Labyrinthitis involves acute inflammation of the membranous labyrinth, affecting both vestibular and cochlear structures. Viral pathogens (influenza, HSV, VZV, adenovirus, mumps) cause direct cytopathic damage to labyrinthine epithelium and vestibular ganglion neurons. The resulting asymmetry in vestibular afferent firing rates between the two ears — reduced from the affected side and normal from the intact side — generates a false rotational signal interpreted as spinning vertigo. Nystagmus beats away from the lesion side due to unopposed tonic vestibular output from the intact ear. Cochlear inflammation damages outer and inner hair cells, producing sensorineural hearing loss and tinnitus. Bacterial labyrinthitis occurs via tympanogenic spread (through the round or oval window from middle ear infection) or meningogenic spread (through the internal auditory canal from meningitis), and constitutes a medical emergency. The nurse differentiates viral from bacterial etiologies, performs comprehensive neurological screening to exclude central causes, manages acute symptoms, and coordinates vestibular rehabilitation."
    },
    riskFactors: [
      "Recent viral upper respiratory infection (most common)",
      "Acute or chronic otitis media (tympanogenic bacterial labyrinthitis)",
      "Bacterial meningitis (meningogenic labyrinthitis)",
      "Cholesteatoma eroding into inner ear",
      "Immunosuppression",
      "Herpes simplex or varicella zoster reactivation",
      "Prior inner ear surgery",
      "Autoimmune inner ear disease"
    ],
    diagnostics: [
      "Perform bedside HINTS exam: head impulse test (positive corrective saccade toward affected side = peripheral), nystagmus (unidirectional horizontal = peripheral), test of skew (negative = peripheral)",
      "Assess hearing with Weber and Rinne tests: Weber lateralizes to unaffected ear, Rinne positive bilaterally (confirms SNHL)",
      "Evaluate cranial nerves V, VII, VIII, IX, X for associated deficits",
      "Assess cerebellar function: finger-to-nose, heel-to-shin, rapid alternating movements",
      "Monitor temperature, WBC count, and inflammatory markers to differentiate viral from bacterial",
      "Assess for otoscopic findings: tympanic membrane inflammation, cholesteatoma, perforation",
      "Evaluate hydration status and electrolytes if prolonged vomiting"
    ],
    management: [
      "Administer vestibular suppressants for acute phase (first 48-72 hours only): meclizine, dimenhydrinate",
      "Administer antiemetics per protocol: ondansetron, prochlorperazine",
      "Administer IV fluids for dehydration from persistent vomiting",
      "Administer oral corticosteroids as prescribed (prednisone taper) for vestibular neuritis",
      "Initiate vestibular rehabilitation exercises as soon as acute symptoms begin resolving",
      "Administer IV antibiotics per protocol if bacterial labyrinthitis suspected (urgent ENT consultation)",
      "Implement progressive mobility plan: bed rest → seated → standing → ambulation with assistance",
      "Coordinate audiometry referral to document hearing status"
    ],
    nursingActions: [
      "Perform HINTS exam to differentiate peripheral (labyrinthitis/VN) from central (stroke) vertigo",
      "Assess and document nystagmus characteristics: direction, velocity, effect of visual fixation",
      "Monitor for central vertigo red flags: vertical or direction-changing nystagmus, negative head impulse test, positive test of skew",
      "Assess hearing at each shift and document any progression of hearing loss",
      "Monitor for signs of complications: meningismus, facial nerve palsy, mastoid tenderness",
      "Discontinue vestibular suppressants after 48-72 hours to allow vestibular compensation",
      "Begin early vestibular rehabilitation: gaze stabilization exercises, balance training",
      "Provide comprehensive discharge education on recovery timeline (weeks to months)"
    ],
    signs: {
      left: [
        "Acute persistent vertigo lasting days (not seconds or minutes)",
        "Unilateral sensorineural hearing loss (labyrinthitis only)",
        "Tinnitus on affected side (labyrinthitis only)",
        "Often preceded by viral URI 1-2 weeks prior",
        "Gradual spontaneous improvement over 1-6 weeks"
      ],
      right: [
        "Positive head impulse test (corrective saccade toward affected side)",
        "Unidirectional horizontal-torsional nystagmus beating away from lesion",
        "Nystagmus suppressed by visual fixation (peripheral pattern)",
        "Severe nausea, vomiting, and postural instability",
        "Falls toward affected side when eyes closed (positive Romberg)"
      ]
    },
    medications: [
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces inflammation of vestibular nerve and labyrinthine structures; may limit neuronal damage and promote recovery", sideEffects: "Hyperglycemia, insomnia, GI irritation, mood changes, immunosuppression", contra: "Active infection (relative — still used if benefit outweighs risk), uncontrolled diabetes", pearl: "Evidence supports use in vestibular neuritis (not labyrinthitis) started within 72 hours. Typical taper: 60mg x3 days, then taper over 7-10 days. May improve recovery of vestibular function." },
      { name: "Meclizine", type: "Vestibular suppressant", action: "H1 antagonist with anticholinergic activity suppressing vestibular nuclear excitability", sideEffects: "Sedation, dry mouth, blurred vision, cognitive dulling", contra: "Narrow-angle glaucoma, BPH", pearl: "Limit to acute phase (48-72 hours). Continued use beyond 3 days significantly delays central vestibular compensation and prolongs recovery." },
      { name: "Ondansetron", type: "5-HT3 antagonist", action: "Blocks serotonin receptors at CTZ and vagal afferents, reducing nausea without vestibular suppression", sideEffects: "Headache, constipation, QT prolongation", contra: "Concomitant apomorphine, severe hepatic impairment", pearl: "Preferred for managing nausea without delaying vestibular compensation, as it does not suppress vestibular nuclei." },
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Inhibits bacterial cell wall synthesis; broad gram-negative and gram-positive coverage including meningeal pathogens", sideEffects: "Diarrhea, rash, biliary sludging, C. difficile", contra: "Cephalosporin allergy, hyperbilirubinemic neonates, concurrent IV calcium", pearl: "Used for bacterial labyrinthitis secondary to meningitis. Penetrates CSF. Typically combined with vancomycin for empiric meningitis coverage." }
    ],
    pearls: [
      "HINTS exam has >95% sensitivity for differentiating peripheral from central vertigo — superior to early CT",
      "Vestibular suppressants should be discontinued after 48-72 hours to allow vestibular compensation",
      "Prednisone improves vestibular recovery in vestibular neuritis when started within 72 hours of onset",
      "Bacterial labyrinthitis from meningitis can cause permanent bilateral deafness — requires urgent IV antibiotics",
      "Recovery occurs through central vestibular compensation — early mobilization and vestibular rehabilitation accelerate this process"
    ],
    quiz: [
      { question: "A patient presents with acute vertigo. The nurse performs the HINTS exam and finds a positive head impulse test, unidirectional nystagmus suppressed by fixation, and no skew deviation. What does this suggest?", options: ["Central stroke requiring emergent CT", "Peripheral vestibular lesion (labyrinthitis or vestibular neuritis)", "BPPV requiring Epley maneuver", "Meniere's disease exacerbation"], correct: 1, rationale: "The 'benign' HINTS pattern — positive head impulse test, unidirectional nystagmus suppressed by fixation, negative test of skew — indicates a peripheral vestibular lesion consistent with labyrinthitis or vestibular neuritis." },
      { question: "The nurse is managing a patient with vestibular neuritis on day 4. Meclizine was prescribed on day 1. What is the appropriate nursing action?", options: ["Continue meclizine at the current dose for 2 more weeks", "Discuss with the provider about discontinuing meclizine to allow vestibular compensation", "Increase the meclizine dose for persistent symptoms", "Switch to a benzodiazepine for better symptom control"], correct: 1, rationale: "Vestibular suppressants should be limited to 48-72 hours. Continued use delays central vestibular compensation and prolongs recovery. The nurse should advocate for discontinuation and initiation of vestibular rehabilitation." },
      { question: "Which finding in a patient with acute labyrinthitis requires the nurse to escalate care immediately?", options: ["Nausea controlled with ondansetron", "Gradual improvement in vertigo on day 3", "New onset fever of 39.5°C with mastoid tenderness and purulent ear discharge", "Mild tinnitus on the affected side"], correct: 2, rationale: "Fever, mastoid tenderness, and purulent discharge suggest tympanogenic bacterial labyrinthitis or mastoiditis, requiring urgent IV antibiotics and ENT consultation." }
    ]
  },

  "labyrinthitis-np": {
    title: "Labyrinthitis & Vestibular Neuritis",
    cellular: {
      title: "Pathophysiology & Differential Diagnosis",
      content: "Viral labyrinthitis and vestibular neuritis represent a spectrum of acute peripheral vestibulopathy. HSV-1 reactivation in the vestibular ganglion (Scarpa's ganglion) is the proposed mechanism for vestibular neuritis, supported by autopsy studies demonstrating HSV-1 DNA in vestibular ganglia and histological evidence of inflammatory neuronal degeneration. In labyrinthitis, inflammation extends to the cochlea. The acute vestibular loss creates a tonic firing imbalance between vestibular nuclei, generating sustained vertigo and spontaneous nystagmus. Recovery depends on central vestibular compensation — neuroplastic reorganization in the vestibular nuclei, cerebellum, and cortex that recalibrates the vestibular system. Bacterial labyrinthitis occurs via tympanogenic (round window, oval window, or fistula from cholesteatoma) or meningogenic (via cochlear aqueduct or internal auditory canal) routes and carries significant risk of permanent deafness and intracranial complications. The clinician must differentiate acute vestibular syndrome from posterior circulation stroke (AICA, PICA territory), vestibular migraine, Meniere's disease, and autoimmune inner ear disease, and initiate appropriate pharmacotherapy including corticosteroids, antivirals, and antibiotics."
    },
    riskFactors: [
      "HSV-1 reactivation in vestibular ganglion (vestibular neuritis)",
      "Recent viral URI (influenza, adenovirus, parainfluenza)",
      "VZV reactivation (may overlap with Ramsay-Hunt)",
      "Acute otitis media or chronic suppurative otitis media",
      "Bacterial meningitis (pneumococcal, meningococcal, H. influenzae)",
      "Cholesteatoma with labyrinthine fistula",
      "Autoimmune disease (consider if bilateral or recurrent)",
      "Immunosuppression (HIV, chemotherapy)",
      "Post-surgical (stapedectomy, cochlear implantation)"
    ],
    diagnostics: [
      "Perform and interpret HINTS exam: peripheral pattern = positive HIT + unidirectional nystagmus + no skew",
      "Order audiometry: normal in vestibular neuritis; SNHL in labyrinthitis (may be severe)",
      "Order MRI brain and IAC with gadolinium: exclude posterior fossa stroke (AICA territory), vestibular schwannoma, demyelination",
      "Order videonystagmography (VNG) with caloric testing: unilateral weakness >25% on affected side",
      "Order vestibular evoked myogenic potentials (cVEMP, oVEMP) to assess inferior vestibular nerve and utricle/saccule function",
      "Order CBC, CRP, ESR, blood cultures if bacterial etiology suspected",
      "Order lumbar puncture if meningogenic labyrinthitis suspected",
      "Order MRI-DWI within 48 hours if HINTS exam suggests central pattern (99% sensitivity)"
    ],
    management: [
      "Prescribe corticosteroids for vestibular neuritis: prednisone 60mg daily x3 days, then taper over 7-10 days (start within 72 hours)",
      "Prescribe short-term vestibular suppressants: meclizine 25mg TID or dimenhydrinate 50mg TID (limit to 48-72 hours)",
      "Prescribe antiemetics: ondansetron 4-8mg q8h PRN (non-sedating preferred)",
      "Prescribe IV antibiotics for bacterial labyrinthitis: ceftriaxone 2g IV q12h + vancomycin for meningitis coverage",
      "Consider antiviral therapy: valacyclovir 1g TID x7 days (evidence limited for VN, stronger for Ramsay-Hunt spectrum)",
      "Order urgent vestibular rehabilitation therapy referral (begin as soon as acute phase resolves)",
      "Prescribe IV fluids for dehydration management",
      "Refer to otolaryngology for bacterial labyrinthitis or persistent unilateral hearing loss"
    ],
    nursingActions: [
      "Establish definitive diagnosis: differentiate acute vestibular syndrome from posterior circulation stroke using HINTS exam",
      "Classify etiology: viral vs. bacterial vs. autoimmune based on clinical context and diagnostics",
      "Differentiate labyrinthitis (hearing loss present) from vestibular neuritis (hearing preserved)",
      "Initiate corticosteroid therapy within 72 hours for optimal outcome in vestibular neuritis",
      "Develop vestibular rehabilitation prescription: gaze stabilization, habituation, balance retraining",
      "Monitor for incomplete vestibular compensation: persistent imbalance beyond 3 months warrants re-evaluation",
      "Assess for BPPV development post-VN/labyrinthitis (secondary BPPV occurs in 10-15%)",
      "Screen for chronic subjective dizziness / persistent postural-perceptual dizziness (PPPD) as sequela"
    ],
    signs: {
      left: [
        "Acute onset persistent vertigo (hours to days, not episodic)",
        "SNHL and tinnitus (labyrinthitis) or normal hearing (VN)",
        "Preceded by viral symptoms 1-2 weeks prior",
        "Spontaneous nystagmus with Alexander's law (increases looking toward fast phase)",
        "Gradual resolution over 1-6 weeks via central compensation"
      ],
      right: [
        "Peripheral HINTS pattern: +HIT, unidirectional nystagmus, no skew",
        "Caloric weakness >25% on affected side",
        "Positive Romberg test (falls toward affected side)",
        "Suppression of nystagmus with visual fixation",
        "May develop secondary BPPV during recovery"
      ]
    },
    medications: [
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces vestibular nerve inflammation and edema, limits neuronal damage from inflammatory mediators, and promotes functional recovery", sideEffects: "Hyperglycemia, insomnia, GI irritation, mood changes, adrenal suppression with prolonged use", contra: "Active untreated infection (relative), uncontrolled diabetes, psychosis", pearl: "The VENT trial demonstrated improved vestibular recovery when prednisone was started within 72 hours of VN onset. Standard dose: 60mg daily x3 days, then taper 10mg every 2 days." },
      { name: "Valacyclovir", type: "Antiviral (nucleoside analogue)", action: "Prodrug of acyclovir that inhibits viral DNA polymerase and terminates DNA elongation; targets HSV-1 implicated in vestibular neuritis", sideEffects: "Nausea, headache, renal impairment at high doses", contra: "Severe renal impairment (dose adjustment required)", pearl: "Evidence for antivirals in vestibular neuritis is limited. The VENT trial showed no additional benefit when added to steroids. However, may be considered in Ramsay-Hunt spectrum or when VZV reactivation is suspected." },
      { name: "Ceftriaxone + Vancomycin", type: "Combination IV antibiotics", action: "Ceftriaxone: broad gram-negative coverage with CSF penetration. Vancomycin: gram-positive including MRSA and resistant pneumococcus", sideEffects: "Ceftriaxone: diarrhea, biliary sludging. Vancomycin: nephrotoxicity, red man syndrome, ototoxicity", contra: "Documented allergy to respective agents", pearl: "Empiric regimen for meningogenic bacterial labyrinthitis. Adjust based on CSF culture and sensitivity. Duration typically 14-21 days." },
      { name: "Dexamethasone (intratympanic)", type: "Local corticosteroid", action: "Direct anti-inflammatory effect on inner ear structures via round window membrane diffusion", sideEffects: "Transient ear pain, rare TM perforation, temporary taste disturbance", contra: "Active middle ear infection, TM perforation (relative)", pearl: "Consider for persistent SNHL following labyrinthitis. Salvage therapy for hearing recovery when oral steroids have been insufficient. Most effective within 2 weeks of hearing loss onset." }
    ],
    pearls: [
      "HINTS exam (performed by trained clinician) is 99% sensitive for posterior circulation stroke in acute vestibular syndrome — superior to early MRI-DWI",
      "Corticosteroids improve vestibular recovery in vestibular neuritis when started within 72 hours; antivirals alone show no additional benefit",
      "Vestibular suppressants beyond 72 hours impair central compensation — early discontinuation and vestibular rehabilitation are essential",
      "10-15% of patients develop secondary BPPV during recovery from VN/labyrinthitis — reassess if new positional symptoms emerge",
      "AICA stroke can exactly mimic labyrinthitis (vertigo + hearing loss + nystagmus) — the HINTS exam is the bedside differentiator"
    ],
    quiz: [
      { question: "A patient presents with acute vertigo, right-sided hearing loss, and spontaneous left-beating nystagmus. HINTS exam shows a negative head impulse test and positive test of skew. What is the NP's priority action?", options: ["Prescribe meclizine and reassess in 48 hours", "Order urgent MRI-DWI to evaluate for posterior circulation stroke", "Diagnose viral labyrinthitis and start prednisone", "Perform Epley maneuver for suspected BPPV"], correct: 1, rationale: "The 'dangerous' HINTS pattern (negative head impulse test, direction-changing nystagmus or skew deviation) has 99% sensitivity for central cause (stroke). AICA territory stroke can present with hearing loss mimicking labyrinthitis. Urgent MRI-DWI is required." },
      { question: "The clinician prescribes prednisone for a patient with vestibular neuritis diagnosed 48 hours ago. When should vestibular rehabilitation therapy be initiated?", options: ["Immediately during the acute phase", "After 48-72 hours when vestibular suppressants are discontinued", "After 2 weeks when vertigo has fully resolved", "Only if symptoms persist beyond 3 months"], correct: 1, rationale: "Vestibular rehabilitation should begin as soon as the acute phase resolves (48-72 hours) and vestibular suppressants are stopped. Early rehabilitation accelerates central vestibular compensation." },
      { question: "Which combination of findings distinguishes bacterial labyrinthitis from viral labyrinthitis?", options: ["Nystagmus direction and hearing status", "Fever, purulent otorrhea, and mastoid tenderness with rapid hearing deterioration", "Duration of vertigo episodes", "Response to meclizine"], correct: 1, rationale: "Bacterial labyrinthitis presents with systemic infection signs (fever, purulent otorrhea, mastoid tenderness) and rapid hearing deterioration. It often complicates otitis media or meningitis and requires urgent IV antibiotics." }
    ]
  },

  "ramsay-hunt-rpn": {
    title: "Ramsay-Hunt Syndrome",
    cellular: {
      title: "Pathophysiology of Ramsay-Hunt Syndrome",
      content: "Ramsay-Hunt syndrome results from reactivation of varicella zoster virus (VZV) dormant in the geniculate ganglion of cranial nerve VII (facial nerve). When the virus reactivates — triggered by immunosuppression, stress, or aging — it causes viral neuritis with inflammation, edema, and ischemia of the facial nerve within the bony fallopian canal. This produces the clinical triad of peripheral facial nerve palsy, otalgia, and vesicular eruption in the ear canal or auricle. Because the geniculate ganglion is adjacent to the vestibulocochlear nerve (CN VIII), patients frequently develop hearing loss, vertigo, and tinnitus. The nurse monitors facial nerve function, assists with eye protection, administers prescribed antivirals and corticosteroids, and reports any changes in symptoms."
    },
    riskFactors: [
      "History of chickenpox (VZV remains dormant in nerve ganglia)",
      "Age >50 years (increased reactivation risk)",
      "Immunocompromised state (HIV, chemotherapy, transplant)",
      "Stress and fatigue",
      "Unvaccinated for varicella or shingles",
      "Autoimmune conditions"
    ],
    diagnostics: [
      "Monitor and report facial symmetry changes: drooping, inability to close eye, mouth deviation",
      "Report vesicular rash in or around the ear canal",
      "Monitor and report hearing changes and tinnitus",
      "Monitor and report vertigo or balance problems",
      "Record vital signs and report fever",
      "Report any eye redness, pain, or dryness on the affected side"
    ],
    management: [
      "Administer oral antivirals (valacyclovir, acyclovir) as ordered — within 72 hours of rash onset",
      "Administer oral corticosteroids (prednisone) as ordered",
      "Administer pain medications as ordered for otalgia",
      "Apply artificial tears and lubricating ointment to affected eye as directed",
      "Assist with eyelid taping or patching at night to prevent corneal exposure",
      "Maintain fall precautions if vertigo is present"
    ],
    nursingActions: [
      "Assess facial nerve function at each shift: forehead wrinkling, eye closure, smiling, lip pursing",
      "Inspect ear canal and auricle for vesicular lesions and document progression",
      "Provide meticulous eye care: artificial tears q2h while awake, lubricating ointment at bedtime, protective patch",
      "Monitor for corneal exposure: redness, pain, foreign body sensation, tearing",
      "Assess hearing and report any changes",
      "Monitor for vertigo and implement safety measures if present",
      "Report any spread of rash beyond ear area",
      "Administer medications as ordered and monitor for side effects"
    ],
    signs: {
      left: [
        "Peripheral facial nerve palsy (entire ipsilateral face affected)",
        "Vesicular eruption on auricle, ear canal, or tympanic membrane",
        "Severe otalgia (ear pain) preceding or accompanying paralysis",
        "Distinguishing triad: facial palsy + otalgia + ear vesicles"
      ],
      right: [
        "CN VIII involvement: hearing loss, tinnitus, vertigo",
        "Dry eye on affected side (loss of lacrimation)",
        "Altered taste on anterior 2/3 of tongue (chorda tympani involvement)",
        "Hyperacusis (stapedius muscle paralysis)",
        "Worse prognosis for facial nerve recovery compared to Bell's palsy"
      ]
    },
    medications: [
      { name: "Valacyclovir", type: "Antiviral (nucleoside analogue)", action: "Prodrug of acyclovir that inhibits viral DNA polymerase, limiting VZV replication and reducing viral spread along the nerve", sideEffects: "Nausea, headache, abdominal pain", contra: "Severe renal impairment (dose adjustment needed)", pearl: "Must be started within 72 hours of rash onset for maximum benefit. Administer as ordered and report if rash is spreading." },
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces inflammation and edema of the facial nerve within the bony canal, relieving compression and promoting nerve recovery", sideEffects: "Hyperglycemia, insomnia, GI irritation, mood changes", contra: "Active systemic infection, uncontrolled diabetes", pearl: "Used in combination with antivirals. Typical course is 5 days at full dose followed by taper. Report blood glucose elevations in diabetic patients." }
    ],
    pearls: [
      "Ramsay-Hunt syndrome has a WORSE prognosis for facial nerve recovery compared to Bell's palsy (recovery rate ~50% vs. 85%)",
      "The vesicular rash distinguishes Ramsay-Hunt from Bell's palsy — always inspect the ear canal",
      "Eye care is critical: incomplete eye closure can lead to corneal ulceration and permanent vision loss",
      "Treatment must begin within 72 hours of rash onset for best outcomes",
      "Report any new vesicular lesions spreading beyond the ear — may indicate disseminated VZV in immunocompromised patients"
    ],
    quiz: [
      { question: "Which clinical triad distinguishes Ramsay-Hunt syndrome from Bell's palsy?", options: ["Vertigo, hearing loss, tinnitus", "Facial paralysis, otalgia, vesicular rash in the ear", "Headache, photophobia, neck stiffness", "Facial pain, lacrimation, rhinorrhea"], correct: 1, rationale: "Ramsay-Hunt syndrome is characterized by the triad of peripheral facial palsy, otalgia, and vesicular eruption on the ear or in the ear canal. Bell's palsy lacks the vesicular rash." },
      { question: "Why is meticulous eye care essential for a patient with Ramsay-Hunt syndrome?", options: ["The virus can spread to the eye", "Facial paralysis prevents complete eye closure, risking corneal exposure and ulceration", "Antivirals cause dry eyes", "Steroids cause increased intraocular pressure"], correct: 1, rationale: "Facial nerve palsy causes incomplete eyelid closure (lagophthalmos). Without the protective blink reflex, the cornea is exposed to drying and potential ulceration, which can cause permanent vision loss." },
      { question: "Within what timeframe should antiviral therapy be initiated for optimal outcomes in Ramsay-Hunt syndrome?", options: ["Within 24 hours of diagnosis", "Within 72 hours of rash onset", "Within 7 days of facial paralysis", "Within 2 weeks of symptom onset"], correct: 1, rationale: "Antiviral therapy (valacyclovir) should be initiated within 72 hours of rash onset to limit viral replication and nerve damage, improving the chance of facial nerve recovery." }
    ]
  },

  "ramsay-hunt-rn": {
    title: "Ramsay-Hunt Syndrome",
    cellular: {
      title: "Pathophysiology & Clinical Assessment",
      content: "Ramsay-Hunt syndrome results from VZV reactivation in the geniculate ganglion of the facial nerve. After primary varicella infection, VZV establishes latency in sensory ganglia. Immunosenescence, immunosuppression, or physiological stress can trigger viral reactivation. The reactivated virus travels anterograde along sensory nerve fibers to produce the characteristic herpetiform vesicular rash on the auricle and ear canal (sensory territory of the nervus intermedius). Simultaneously, inflammatory infiltration of the facial nerve within the tight bony fallopian canal causes compressive ischemic neuropathy, resulting in peripheral facial palsy. The geniculate ganglion's proximity to the vestibulocochlear nerve explains the frequent cochlear and vestibular involvement. The nurse performs comprehensive cranial nerve assessment, manages the complex interplay of antiviral therapy, corticosteroids, pain management, and eye protection, differentiates Ramsay-Hunt from Bell's palsy and central facial weakness, and monitors for complications including corneal ulceration, postherpetic neuralgia, and secondary bacterial infection."
    },
    riskFactors: [
      "Prior VZV infection (chickenpox)",
      "Age >50 years (declining cell-mediated immunity)",
      "Immunosuppression: HIV/AIDS, organ transplant, chemotherapy",
      "Chronic stress and fatigue",
      "Diabetes mellitus (4x increased risk for cranial neuropathies)",
      "Unvaccinated against herpes zoster",
      "Pregnancy (third trimester)",
      "Autoimmune conditions (SLE, RA)"
    ],
    diagnostics: [
      "Perform comprehensive cranial nerve examination with focus on CN VII (motor, sensory, parasympathetic branches) and CN VIII (hearing, vestibular)",
      "Grade facial nerve function using House-Brackmann scale (I-VI)",
      "Differentiate peripheral from central facial weakness: peripheral = entire face (forehead + lower face); central = lower face only",
      "Inspect ear canal with otoscope for vesicular lesions on tympanic membrane, canal, and auricle",
      "Perform hearing assessment: Weber and Rinne tests to characterize hearing loss",
      "Assess corneal reflex and eye closure completeness",
      "Evaluate taste sensation on anterior 2/3 of tongue (chorda tympani branch)"
    ],
    management: [
      "Administer antiviral therapy as prescribed: valacyclovir 1g TID x7 days (or acyclovir 800mg 5x/day x7 days)",
      "Administer corticosteroids as prescribed: prednisone 60mg daily x5 days then taper over 5 days",
      "Manage pain: acetaminophen, NSAIDs, gabapentin or pregabalin for neuropathic component",
      "Implement comprehensive eye protection protocol: artificial tears q2h, lubricating ointment at bedtime, moisture chamber or patch at night",
      "Administer vestibular suppressants if vertigo present: meclizine, dimenhydrinate",
      "Monitor for secondary bacterial infection of vesicular lesions",
      "Coordinate ophthalmology referral if corneal complications suspected",
      "Coordinate audiology referral for formal hearing assessment"
    ],
    nursingActions: [
      "Assess facial nerve function systematically: raise eyebrows, close eyes tightly, show teeth, puff cheeks, purse lips — document asymmetry",
      "Grade facial palsy using House-Brackmann scale and track progression",
      "Perform slit-lamp or penlight assessment of cornea for exposure keratopathy",
      "Assess vesicular lesion progression: number, distribution, stage (vesicle → pustule → crust)",
      "Monitor for complications: corneal ulceration, postherpetic neuralgia, facial synkinesis",
      "Assess pain using validated scale and evaluate response to analgesics",
      "Monitor blood glucose in patients receiving corticosteroids",
      "Educate on contagion: vesicular lesions are infectious for VZV-naive individuals until crusted over",
      "Implement contact precautions for vesicular lesions"
    ],
    signs: {
      left: [
        "Peripheral facial palsy: forehead + lower face involvement (entire ipsilateral face)",
        "Vesicular eruption on ear canal, auricle, or tympanic membrane",
        "Severe otalgia (may precede rash by 2-3 days)",
        "Altered taste on anterior 2/3 of tongue",
        "Hyperacusis from stapedius muscle paralysis"
      ],
      right: [
        "CN VIII involvement: sensorineural hearing loss, tinnitus, vertigo",
        "Lagophthalmos (incomplete eye closure) with Bell phenomenon",
        "Dry eye or paradoxical excessive tearing (crocodile tears)",
        "House-Brackmann grade III-VI at presentation",
        "Worse recovery rate than Bell's palsy (~50% vs. ~85%)"
      ]
    },
    medications: [
      { name: "Valacyclovir", type: "Antiviral", action: "Prodrug converting to acyclovir; inhibits VZV DNA polymerase, terminating viral replication and limiting nerve damage", sideEffects: "Nausea, headache, diarrhea, nephrotoxicity at high doses", contra: "Severe renal impairment (dose adjust for CrCl <30)", pearl: "Superior bioavailability to acyclovir (55% vs. 15%) allows TID dosing. Must start within 72 hours of rash onset. Monitor renal function and ensure adequate hydration." },
      { name: "Prednisone", type: "Corticosteroid", action: "Potent anti-inflammatory reducing facial nerve edema within the fallopian canal, relieving compression-mediated ischemia", sideEffects: "Hyperglycemia, insomnia, GI irritation, mood lability, immunosuppression", contra: "Active untreated systemic infection, psychosis, peptic ulcer disease (relative)", pearl: "Always combine with antiviral — never use corticosteroids alone for Ramsay-Hunt (risk of unchecked viral replication). Typical regimen: 60mg/day x5 days, then 10mg/day taper." },
      { name: "Gabapentin", type: "Anticonvulsant / Neuropathic pain agent", action: "Binds alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release and neuropathic pain signaling", sideEffects: "Sedation, dizziness, peripheral edema, weight gain", contra: "Severe renal impairment (dose adjustment)", pearl: "Start at 100-300mg TID and titrate for neuropathic pain and postherpetic neuralgia prevention. May also help with vertigo component." },
      { name: "Artificial Tears (Carboxymethylcellulose)", type: "Ocular lubricant", action: "Forms a protective film over the cornea, maintaining moisture and preventing exposure keratopathy", sideEffects: "Temporary blurred vision, rare allergic reaction", contra: "None significant", pearl: "Apply every 2 hours while awake for any patient with incomplete eye closure. Switch to ointment at bedtime for prolonged overnight protection. Critical for preventing corneal ulceration." }
    ],
    pearls: [
      "Always inspect the ear canal in patients with facial palsy — vesicles may be subtle or hidden, and their presence changes diagnosis from Bell's palsy to Ramsay-Hunt",
      "Peripheral facial palsy affects the entire ipsilateral face (forehead included); central facial palsy spares the forehead (bilateral cortical innervation of upper face)",
      "Ramsay-Hunt has a recovery rate of approximately 50% compared to 85% for Bell's palsy — early treatment is critical",
      "Vesicular lesions are contagious for VZV-naive individuals — implement contact precautions until lesions are crusted",
      "Postherpetic neuralgia occurs more frequently in Ramsay-Hunt than other dermatomes — initiate gabapentin early"
    ],
    quiz: [
      { question: "The nurse assesses a patient with facial paralysis. How does the nurse differentiate peripheral from central facial weakness?", options: ["Peripheral affects only the lower face; central affects the entire face", "Peripheral affects the entire ipsilateral face including forehead; central spares the forehead", "Peripheral is always bilateral; central is unilateral", "There is no clinical difference"], correct: 1, rationale: "In peripheral facial palsy (as in Ramsay-Hunt), the entire ipsilateral face is affected including the forehead because the facial nerve nucleus innervates all ipsilateral facial muscles. In central (upper motor neuron) lesions, the forehead is spared due to bilateral cortical representation." },
      { question: "A patient with Ramsay-Hunt syndrome has a House-Brackmann grade V facial palsy. What is the RN's priority intervention?", options: ["Administer meclizine for vertigo", "Implement aggressive eye protection to prevent corneal ulceration", "Apply warm compresses to vesicular lesions", "Restrict oral intake"], correct: 1, rationale: "A House-Brackmann grade V indicates barely perceptible facial movement. Severe lagophthalmos puts the cornea at extreme risk for exposure keratopathy and ulceration. Eye protection (tears, ointment, taping) is the priority." },
      { question: "Why is it important to combine antivirals with corticosteroids rather than using corticosteroids alone in Ramsay-Hunt syndrome?", options: ["Antivirals reduce the side effects of steroids", "Corticosteroids alone could allow unchecked VZV replication and worsen nerve damage", "Antivirals improve steroid absorption", "There is no evidence for combination therapy"], correct: 1, rationale: "Corticosteroids suppress the immune response. Without concurrent antiviral therapy to limit VZV replication, steroids alone could allow unchecked viral spread and worsening nerve damage." }
    ]
  },

  "ramsay-hunt-np": {
    title: "Ramsay-Hunt Syndrome",
    cellular: {
      title: "Pathophysiology, Differential Diagnosis",
      content: "Ramsay-Hunt syndrome is caused by VZV reactivation in the geniculate ganglion. After primary varicella infection, VZV achieves latency in the satellite cells surrounding sensory ganglion neurons. Reactivation involves transition from the latent circular episome to lytic replication, with viral progeny traveling anterograde via axonal transport to cutaneous sensory terminals (producing vesicles) and simultaneously causing inflammatory destruction of ganglion neurons and the facial nerve trunk. The facial nerve traverses the narrow bony fallopian canal, where inflammatory edema causes compressive ischemia. The degree of nerve injury ranges from neuropraxia (demyelination with intact axons, good prognosis) through axonotmesis (axonal disruption with preserved endoneurium, variable recovery) to neurotmesis (complete transection, poor recovery). Electroneurography (ENoG) within 2 weeks of onset predicts prognosis: >90% degeneration suggests poor spontaneous recovery and possible need for surgical decompression. The clinician must differentiate Ramsay-Hunt from Bell's palsy (no vesicles), central facial palsy (stroke), parotid tumors, otitis media complications, Lyme disease, sarcoidosis, and Guillain-Barré syndrome. The clinician also manages complex pharmacotherapy, assesses for complications, and determines need for specialist referral."
    },
    riskFactors: [
      "VZV-seropositive status (prior chickenpox or vaccination with wild-type exposure)",
      "Age >50 (declining VZV-specific T-cell immunity)",
      "Immunosuppression: HIV (CD4 <200), post-transplant, biologics, chemotherapy",
      "Diabetes mellitus (increased cranial neuropathy risk)",
      "Chronic stress and physiological exhaustion",
      "Unvaccinated for herpes zoster (Shingrix)",
      "Pregnancy (third trimester immunomodulation)",
      "Prior history of herpes zoster at other sites"
    ],
    diagnostics: [
      "Order PCR for VZV DNA from vesicle fluid or saliva (gold standard for confirming VZV vs. HSV-1 etiology)",
      "Order electroneurography (ENoG) at days 3-14: >90% degeneration indicates poor prognosis for spontaneous recovery",
      "Order audiometry: characterize degree and type of hearing loss (SNHL typical, may be severe)",
      "Order MRI brain and temporal bone with gadolinium: enhancement of facial nerve and geniculate ganglion confirms diagnosis; excludes schwannoma, cholesteatoma, parotid tumor",
      "Order VNG/caloric testing if vestibular symptoms present: documents vestibular hypofunction",
      "Order HIV testing in patients <50 with Ramsay-Hunt (VZV reactivation may be first sign)",
      "Order serology: Lyme IgG/IgM (facial palsy endemic areas), ANA, ACE level (sarcoidosis) for atypical presentations"
    ],
    management: [
      "Prescribe antiviral therapy within 72 hours of rash onset: valacyclovir 1000mg PO TID x7 days (preferred) or acyclovir 800mg PO 5x/day x7 days",
      "Prescribe IV acyclovir 10mg/kg q8h for immunocompromised patients or severe/disseminated disease",
      "Prescribe adjunctive corticosteroids: prednisone 60mg/day x5 days, then taper 10mg/day over 5 days",
      "Prescribe multimodal pain management: acetaminophen + gabapentin 300mg TID (titrate to 900mg TID) + short-term opioid PRN for severe otalgia",
      "Prescribe prophylactic eye care: preservative-free artificial tears q2h, lubricating ointment HS, moisture chamber",
      "Prescribe vestibular management if CN VIII involved: meclizine 25mg TID PRN (short-term), vestibular rehabilitation referral",
      "Consider surgical facial nerve decompression referral if ENoG shows >90% degeneration within 14 days and no clinical improvement",
      "Prescribe Shingrix vaccination for eligible patients after acute episode resolves (prevent recurrence)"
    ],
    nursingActions: [
      "Establish definitive diagnosis: VZV PCR confirms etiology; differentiate from HSV-1 Bell's palsy spectrum",
      "Grade facial nerve function using House-Brackmann scale and track serial assessments for prognostication",
      "Determine nerve injury severity: order ENoG by day 3-14 for patients with complete paralysis",
      "Develop comprehensive treatment plan addressing all affected cranial nerve functions (VII, VIII, sensory)",
      "Assess for zoster sine herpete: facial palsy with serological VZV evidence but no visible rash",
      "Screen for postherpetic neuralgia risk factors: age >50, severe acute pain, extensive rash, immunosuppression",
      "Initiate early neuropathic pain management to prevent postherpetic neuralgia chronification",
      "Assess vaccine eligibility and recommend Shingrix for prevention of recurrence (after acute episode)"
    ],
    signs: {
      left: [
        "Peripheral facial palsy (House-Brackmann grade typically III-VI)",
        "Vesicular eruption on auricle, ear canal, or tympanic membrane (may be subtle or absent in zoster sine herpete)",
        "Severe otalgia (may precede rash and paralysis by days)",
        "Altered taste on anterior 2/3 of tongue",
        "Hyperacusis from stapedius paralysis"
      ],
      right: [
        "CN VIII involvement: SNHL (often severe), tinnitus, vertigo, nystagmus",
        "Lagophthalmos with risk of exposure keratopathy",
        "ENoG degeneration >90% = poor prognosis for spontaneous recovery",
        "Facial nerve enhancement on MRI with gadolinium",
        "VZV DNA positive on PCR from vesicle fluid"
      ]
    },
    medications: [
      { name: "Valacyclovir", type: "Antiviral", action: "Prodrug rapidly converted to acyclovir; triphosphate form competitively inhibits VZV DNA polymerase, terminating viral DNA chain elongation", sideEffects: "Nausea, headache, nephrotoxicity (crystalluria at high doses), thrombotic thrombocytopenic purpura (rare)", contra: "Severe renal impairment (adjust dose: CrCl <30 = 1g q12h; CrCl <10 = 500mg daily)", pearl: "55% oral bioavailability vs. 15% for acyclovir. 1g TID x7 days. Must start within 72 hours for maximum efficacy. Ensure adequate hydration to prevent crystalline nephropathy." },
      { name: "Acyclovir IV", type: "Antiviral (parenteral)", action: "Direct viral DNA polymerase inhibitor with excellent tissue penetration including CNS", sideEffects: "Nephrotoxicity (crystalline nephropathy), phlebitis, neurotoxicity (tremor, confusion)", contra: "Inadequate hydration (pre-hydrate before infusion)", pearl: "Reserved for immunocompromised patients, disseminated VZV, or inability to tolerate oral therapy. Dose: 10mg/kg IV q8h. Requires slow infusion over 1 hour with adequate hydration." },
      { name: "Prednisone", type: "Corticosteroid", action: "Reduces perineural inflammation and edema within the fallopian canal, restoring blood flow to the compressed facial nerve", sideEffects: "Hyperglycemia, GI irritation, insomnia, immunosuppression, mood changes", contra: "Never use without concurrent antiviral in Ramsay-Hunt, active systemic fungal infection", pearl: "Must be combined with antivirals. Monotherapy with steroids risks worsening VZV replication. Standard course: 60mg daily x5 days, taper 10mg/day over 5 days." },
      { name: "Gabapentin", type: "Neuropathic pain agent", action: "Binds presynaptic alpha-2-delta voltage-gated calcium channel subunit, reducing excitatory neurotransmitter release and central pain sensitization", sideEffects: "Somnolence, dizziness, peripheral edema, weight gain, ataxia", contra: "Severe renal impairment (dose adjustment required)", pearl: "Start 300mg TID, titrate to 900-1200mg TID for neuropathic pain. Early initiation may prevent postherpetic neuralgia. Also has mild anxiolytic and vestibular-suppressant properties." }
    ],
    pearls: [
      "Ramsay-Hunt recovery rate is approximately 50% compared to 85% for Bell's palsy — prognosis correlates with House-Brackmann grade at presentation and ENoG findings",
      "Zoster sine herpete: VZV facial palsy without visible rash — consider VZV PCR from saliva when Bell's palsy fails to improve as expected",
      "ENoG >90% degeneration within 14 days of onset predicts poor spontaneous recovery — consider surgical decompression referral",
      "Young patients (<50) with Ramsay-Hunt should be tested for HIV and other immunodeficiencies",
      "Shingrix (recombinant adjuvanted vaccine) reduces herpes zoster risk by >90% and should be recommended for all eligible patients >50 after acute episode resolution"
    ],
    quiz: [
      { question: "An NP evaluates a 35-year-old with Ramsay-Hunt syndrome. Which additional investigation is most important?", options: ["Serum calcium level", "HIV testing", "Thyroid function tests", "Hemoglobin A1C"], correct: 1, rationale: "VZV reactivation in a patient under 50 should prompt evaluation for underlying immunodeficiency, most importantly HIV. Ramsay-Hunt in younger patients may be the first presentation of immunosuppression." },
      { question: "An NP diagnoses Ramsay-Hunt syndrome 24 hours after rash onset. The patient has House-Brackmann grade IV facial paralysis. What is the optimal pharmacotherapy?", options: ["Prednisone alone at 60mg daily", "Valacyclovir 1g TID + prednisone 60mg daily", "Gabapentin 300mg TID alone", "IV acyclovir only"], correct: 1, rationale: "Combination therapy with antivirals (valacyclovir) and corticosteroids (prednisone) within 72 hours of rash onset provides the best chance of facial nerve recovery. Steroids should never be used alone due to risk of unchecked viral replication." },
      { question: "An NP reviews ENoG results showing 95% facial nerve degeneration at day 10 in a patient with Ramsay-Hunt syndrome. What is the next step?", options: ["Continue current medical therapy and reassess in 3 months", "Refer to otolaryngology for consideration of facial nerve decompression surgery", "Start IV acyclovir", "Prescribe physical therapy for facial retraining only"], correct: 1, rationale: "ENoG showing >90% degeneration within 14 days indicates severe nerve injury with poor prognosis for spontaneous recovery. Surgical decompression of the facial nerve should be considered and requires urgent otolaryngology referral." }
    ]
  }
};
