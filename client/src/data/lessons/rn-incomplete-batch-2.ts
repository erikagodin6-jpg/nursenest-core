import type { LessonContent } from "./types";

export const rnIncompleteBatch2Lessons: Record<string, LessonContent> = {
  "comprehensive-airway-assessment-rn-rn": {
    title: "Comprehensive Airway Assessment (RN)",
    cellular: {
      title: "Pathophysiology of Airway Assessment",
      content: "Comprehensive airway assessment evaluates the patency and function of the upper and lower airways, which are essential for adequate ventilation and gas exchange. The upper airway includes the nasopharynx, oropharynx, and larynx, while the lower airway includes the trachea, bronchi, bronchioles, and alveoli. Airway obstruction can occur from tongue displacement (most common cause in unconscious patients), foreign body aspiration, laryngospasm, bronchospasm, mucosal edema (anaphylaxis, angioedema), secretions, blood, or tumors. The RN assesses airway patency using the look-listen-feel approach: looking for chest rise, listening for breath sounds and abnormal airway noises (stridor, gurgling, snoring), and feeling for air movement. Stridor is a high-pitched inspiratory sound indicating upper airway obstruction at or above the larynx. Wheezing indicates lower airway narrowing from bronchospasm or mucus. The Mallampati score and other predictive tools assess for difficult airway management. Assessment of protective airway reflexes (gag, cough, swallow) determines aspiration risk. The jaw-thrust maneuver is the preferred technique for opening the airway in trauma patients with suspected cervical spine injury, while the head-tilt chin-lift is used when no spinal injury is suspected. Rapid identification of airway compromise is a critical RN competency, as airway obstruction progresses to respiratory arrest within minutes."
    },
    riskFactors: [
      "Decreased level of consciousness (GCS < 8 — cannot protect airway)",
      "Post-anesthesia or deep sedation with residual neuromuscular blockade",
      "Cervical spine injury or facial/neck trauma",
      "Anaphylaxis causing laryngeal edema and bronchospasm",
      "Obstructive sleep apnea and obesity (Mallampati class III–IV)",
      "Head and neck surgery or radiation therapy (altered anatomy, edema)",
      "Neuromuscular diseases (Guillain-Barré, myasthenia gravis) with bulbar weakness"
    ],
    diagnostics: [
      "Systematic airway assessment: look (chest rise, accessory muscle use, cyanosis), listen (stridor, wheezing, gurgling), feel (air movement at nose/mouth)",
      "Mallampati classification (I–IV) for airway difficulty prediction",
      "Pulse oximetry (SpO2) for continuous oxygenation monitoring",
      "Capnography (ETCO2) for ventilation adequacy and airway patency confirmation",
      "Lateral neck X-ray for suspected epiglottitis or foreign body",
      "Chest X-ray to evaluate ETT position and lung pathology",
      "Arterial blood gas for definitive assessment of oxygenation and ventilation"
    ],
    management: [
      "Immediate airway opening: Head-tilt chin-lift (no trauma) or jaw-thrust maneuver (trauma suspected)",
      "Oropharyngeal airway (OPA) for unconscious patients without gag reflex; nasopharyngeal airway (NPA) for semiconscious patients",
      "Suction oropharynx to clear secretions, blood, or vomitus: Yankauer suction for oropharynx, flexible catheter for nasopharynx and ETT",
      "Prepare for endotracheal intubation if airway cannot be maintained with basic maneuvers",
      "Anaphylaxis with airway compromise: Epinephrine 0.3–0.5 mg IM (anterolateral thigh), repeat every 5–15 minutes if needed",
      "Foreign body airway obstruction: Abdominal thrusts (Heimlich maneuver) for conscious adults; chest compressions for unconscious patients",
      "Post-extubation stridor: Racemic epinephrine nebulization, IV dexamethasone, assess for re-intubation need"
    ],
    nursingActions: [
      "Perform systematic airway assessment using ABCDE approach: Airway patency first, then Breathing, Circulation, Disability, Exposure",
      "Position patient to optimize airway: sniffing position (head elevated, neck flexed, head extended) for non-trauma patients; maintain neutral alignment for trauma",
      "Assess for signs of impending airway obstruction: stridor, hoarseness, drooling, tripod positioning, use of accessory muscles, retractions",
      "Maintain NPO status and position patient laterally (recovery position) when risk of aspiration is present",
      "Assess cough and swallow reflex before allowing oral intake after sedation, anesthesia, or neurological events",
      "Have emergency airway equipment at bedside for high-risk patients: bag-valve-mask, oral/nasal airways, suction, laryngoscope",
      "Document airway status, interventions, and patient response; communicate airway concerns using SBAR format"
    ],
    assessmentFindings: [
      "Stridor (high-pitched inspiratory sound): indicates upper airway obstruction at or above the glottis — medical emergency",
      "Snoring respiration in unconscious patient: suggests tongue obstruction of the oropharynx",
      "Gurgling: indicates fluid (secretions, blood, vomitus) in the airway requiring immediate suctioning",
      "Hoarseness or voice changes: suggests laryngeal edema or vocal cord dysfunction",
      "Accessory muscle use (sternocleidomastoid, intercostal retractions): indicates increased work of breathing from airway obstruction",
      "Inability to speak or cough: complete airway obstruction requiring emergent intervention"
    ],
    signs: {
      left: [
        "Clear airway with normal breath sounds and adequate air movement",
        "Mild post-extubation hoarseness resolving spontaneously",
        "Intact gag and cough reflexes with no aspiration risk",
        "Mild stridor responding to cool mist or racemic epinephrine",
        "Adequate SpO2 on room air with patent airway"
      ],
      right: [
        "Complete airway obstruction: no air movement, inability to speak or cough, cyanosis",
        "Severe stridor with respiratory distress and declining SpO2",
        "Anaphylaxis with tongue/laryngeal edema and respiratory compromise",
        "GCS < 8 with loss of protective airway reflexes",
        "Post-extubation airway edema unresponsive to medical management requiring re-intubation"
      ]
    },
    medications: [
      {
        name: "Racemic Epinephrine",
        type: "Alpha and beta adrenergic agonist (nebulized)",
        action: "Alpha-1 mediated vasoconstriction reduces mucosal edema and swelling in the upper airway; beta-2 bronchodilation opens lower airways",
        sideEffects: "Tachycardia, rebound edema (edema may recur 2–4 hours after treatment), tremor, palpitations, hypertension",
        contra: "Hypertrophic obstructive cardiomyopathy, severe tachyarrhythmias (relative contraindications)",
        pearl: "Used for post-extubation stridor and croup: 0.5 mL of 2.25% solution diluted in 3 mL NS via nebulizer; observe patient for minimum 2–4 hours after treatment due to risk of rebound edema; may repeat every 20 minutes for severe symptoms"
      }
    ],
    pearls: [
      "Airway assessment is ALWAYS the first priority in any patient assessment — even seconds of obstruction can lead to rapid deterioration",
      "The jaw-thrust maneuver is the ONLY acceptable airway opening technique when cervical spine injury is suspected; head-tilt chin-lift may cause spinal cord injury",
      "Stridor is a late finding of airway obstruction — by the time stridor is audible, the airway is already significantly narrowed (50–80% obstruction)",
      "GCS ≤ 8 indicates the patient cannot protect their own airway — prepare for intubation and do not leave the patient unattended",
      "Post-extubation: Monitor for stridor for at least 24 hours; rebound edema after racemic epinephrine peaks at 2–4 hours",
      "OPA size: Measure from the corner of the mouth to the angle of the mandible; NPA size: measure from the nostril to the tragus of the ear"
    ],
    quiz: [
      {
        question: "A trauma patient with suspected cervical spine injury is unconscious and has sonorous (snoring) respirations. What is the RN's priority airway intervention?",
        options: ["Head-tilt chin-lift maneuver", "Jaw-thrust maneuver without head extension", "Immediate orotracheal intubation", "Place an oropharyngeal airway without opening the airway"],
        correct: 1,
        rationale: "The jaw-thrust maneuver is the only acceptable airway opening technique when cervical spine injury is suspected because it opens the airway by displacing the mandible anteriorly without extending the neck. Head-tilt chin-lift is contraindicated due to risk of spinal cord injury."
      },
      {
        question: "A patient develops stridor, facial swelling, and urticaria 5 minutes after receiving IV antibiotics. What is the priority medication?",
        options: ["Diphenhydramine 50 mg IV", "Methylprednisolone 125 mg IV", "Epinephrine 0.3 mg IM into the anterolateral thigh", "Albuterol 2.5 mg nebulization"],
        correct: 2,
        rationale: "Anaphylaxis with airway compromise (stridor, facial swelling) requires immediate epinephrine IM as the first-line treatment. Epinephrine reverses bronchospasm, reduces mucosal edema, and supports blood pressure. Antihistamines and steroids are adjunctive but not life-saving. Delay in epinephrine is the most common cause of anaphylaxis fatalities."
      },
      {
        question: "When selecting a nasopharyngeal airway (NPA) for an adult patient, the RN should measure from which landmarks?",
        options: ["Corner of mouth to angle of the mandible", "Tip of nose to tragus of the ear", "Lower lip to the hyoid bone", "Bridge of nose to the sternal notch"],
        correct: 1,
        rationale: "The NPA is sized by measuring from the tip of the nostril to the tragus of the ear to approximate the distance from the nares to the pharynx. The OPA is sized from the corner of the mouth to the angle of the mandible. Using the correct size prevents complications such as inadequate airway opening or nasal trauma."
      }
    ]
  },
  "respiratory-assessment-protocol-rn-rn": {
    title: "Respiratory Assessment Protocol (RN)",
    cellular: {
      title: "Pathophysiology of Respiratory Assessment",
      content: "Systematic respiratory assessment evaluates the effectiveness of ventilation (movement of air in and out of the lungs) and gas exchange (transfer of oxygen and carbon dioxide at the alveolar-capillary membrane). The respiratory system maintains homeostasis through the control of PaO2 (normal 80–100 mmHg), PaCO2 (normal 35–45 mmHg), and pH (normal 7.35–7.45). Central chemoreceptors in the medulla respond primarily to CSF hydrogen ion concentration (influenced by CO2), while peripheral chemoreceptors in the carotid and aortic bodies respond to decreased PaO2 (< 60 mmHg), increased PaCO2, and decreased pH. Assessment includes inspection (respiratory rate, depth, pattern, symmetry, accessory muscle use, skin color), palpation (chest expansion, tactile fremitus, subcutaneous emphysema), percussion (resonance, hyperresonance, dullness), and auscultation (normal breath sounds, adventitious sounds). Normal breath sounds include bronchial (over trachea, loud and tubular), bronchovesicular (over mainstem bronchi, moderate pitch), and vesicular (over peripheral lung fields, soft and breezy). Adventitious sounds include crackles (fine: pulmonary edema, fibrosis; coarse: secretions, pneumonia), wheezes (narrowed airways from bronchospasm or mucus), rhonchi (low-pitched rumbling from secretions in large airways), stridor (upper airway obstruction), and pleural friction rub (inflamed pleural surfaces). The RN integrates respiratory assessment data with SpO2, capnography, ABGs, and chest imaging to evaluate respiratory status and guide interventions."
    },
    riskFactors: [
      "Chronic respiratory disease (COPD, asthma, interstitial lung disease, cystic fibrosis)",
      "Smoking history (quantified in pack-years) and environmental/occupational exposures",
      "Post-operative patients (especially thoracic and upper abdominal surgery) at risk for atelectasis",
      "Immobility and prolonged bed rest (decreased lung expansion, secretion retention)",
      "Immunocompromised state (increased susceptibility to respiratory infections)",
      "Neuromuscular disorders affecting respiratory muscles (diaphragm, intercostals)",
      "Obesity with restrictive ventilatory pattern and reduced functional residual capacity"
    ],
    diagnostics: [
      "Respiratory rate, depth, and pattern assessment (normal adult RR 12–20 breaths/min)",
      "Pulse oximetry (SpO2, target ≥ 94% most patients; 88–92% for COPD with chronic CO2 retention)",
      "Arterial blood gas analysis for definitive assessment of oxygenation, ventilation, and acid-base status",
      "Chest X-ray (PA and lateral preferred; portable AP in critically ill patients)",
      "Peak expiratory flow rate (PEFR) for asthma severity and response to bronchodilators",
      "Sputum culture and sensitivity for suspected pneumonia or respiratory infection",
      "Pulmonary function tests (spirometry: FEV1, FVC, FEV1/FVC ratio) for chronic lung disease assessment"
    ],
    management: [
      "Position for optimal ventilation: High Fowler's (60–90°) for dyspnea; semi-Fowler's (30–45°) for general respiratory support; affected side down for unilateral lung disease to optimize V/Q matching of the good lung",
      "Oxygen administration per prescription: nasal cannula (1–6 L/min, 24–44% FiO2), simple mask (5–10 L/min, 40–60%), non-rebreather mask (10–15 L/min, 80–95%); titrate to SpO2 target",
      "Chest physiotherapy and postural drainage for patients with excessive secretions",
      "Incentive spirometry: instruct patient to inhale slowly and deeply, hold for 3–5 seconds, perform 10 times/hour while awake to prevent atelectasis",
      "Suction airway secretions as needed: assess breath sounds before and after suctioning to evaluate effectiveness",
      "Administer prescribed bronchodilators: short-acting (albuterol) for acute bronchospasm; long-acting (tiotropium) for maintenance",
      "Prepare for advanced airway management (intubation) if respiratory failure is imminent: declining SpO2 despite maximal oxygen, increasing work of breathing, altered mental status"
    ],
    nursingActions: [
      "Perform comprehensive respiratory assessment every 2–4 hours and with any change in condition: rate, depth, pattern, symmetry, work of breathing, SpO2",
      "Auscultate all lung fields systematically (anterior, lateral, posterior) comparing side to side: document normal and adventitious breath sounds",
      "Assess and document cough effectiveness: strong, weak, absent; productive vs nonproductive; sputum characteristics (color, amount, consistency, odor)",
      "Monitor continuous pulse oximetry trends; report SpO2 < 92% or a decline > 4% from baseline to the healthcare team",
      "Implement aspiration precautions for at-risk patients: HOB elevation ≥ 30°, swallow screening before oral intake, supervised feeding",
      "Educate patients on deep breathing exercises, incentive spirometry use, splinting for post-operative patients, and smoking cessation",
      "Recognize early signs of respiratory deterioration: increasing RR, use of accessory muscles, decreasing SpO2, inability to speak in full sentences, agitation or confusion"
    ],
    assessmentFindings: [
      "Fine crackles (rales): Short, high-pitched sounds heard on inspiration; indicate fluid in the alveoli (pulmonary edema, pneumonia, fibrosis); do not clear with coughing",
      "Coarse crackles: Louder, low-pitched bubbling sounds; indicate secretions in larger airways; may clear with coughing or suctioning",
      "Wheezing: High-pitched musical sounds predominantly on expiration; indicate bronchospasm (asthma, COPD exacerbation) or airway narrowing",
      "Diminished or absent breath sounds: Indicate hypoventilation, pleural effusion, pneumothorax, or atelectasis",
      "Accessory muscle use (sternocleidomastoid, scalene, intercostal): Indicates increased work of breathing and respiratory distress",
      "Barrel chest (increased AP diameter): Seen in chronic air trapping (COPD/emphysema)"
    ],
    signs: {
      left: [
        "Respiratory rate 18–20 with adequate depth and no accessory muscle use",
        "SpO2 94–96% on room air",
        "Clear breath sounds bilaterally with vesicular sounds over periphery",
        "Mild scattered wheezing clearing after bronchodilator",
        "Productive cough with small amount of clear sputum"
      ],
      right: [
        "RR > 30 with severe accessory muscle use and retractions",
        "SpO2 < 85% despite high-flow oxygen",
        "Absent breath sounds unilaterally with tracheal deviation (tension pneumothorax)",
        "Severe diffuse wheezing with silent chest (impending respiratory arrest in asthma)",
        "Altered mental status with decreasing respiratory effort (exhaustion/respiratory failure)"
      ]
    },
    medications: [
      {
        name: "Albuterol (Salbutamol)",
        type: "Short-acting beta-2 adrenergic agonist (SABA) bronchodilator",
        action: "Stimulates beta-2 receptors on bronchial smooth muscle, activating adenylyl cyclase and increasing cAMP, leading to smooth muscle relaxation and bronchodilation",
        sideEffects: "Tachycardia, tremor, palpitations, hypokalemia (shifts K+ intracellularly), nervousness, headache",
        contra: "Hypersensitivity; use caution in patients with coronary artery disease, tachyarrhythmias, and hypokalemia",
        pearl: "Rescue inhaler for acute bronchospasm: MDI 2–4 puffs every 20 minutes × 3 for acute exacerbation; nebulizer 2.5–5 mg every 20 minutes; assess breath sounds and SpO2 before and after to evaluate response; increasing frequency of use suggests worsening disease control"
      }
    ],
    pearls: [
      "A 'silent chest' in an asthmatic patient (no wheezing despite obvious distress) indicates severe bronchospasm with minimal air movement — this is a pre-arrest finding requiring immediate intervention",
      "In COPD patients with chronic CO2 retention, the hypoxic drive is the primary respiratory stimulus — excessive oxygen supplementation can suppress this drive; target SpO2 88–92%",
      "Fine crackles that persist despite coughing suggest alveolar fluid (pulmonary edema, fibrosis) rather than secretion-related crackles that clear with coughing",
      "Always assess respiratory rate BEFORE the patient knows you are counting — awareness changes breathing pattern; count for a full 60 seconds in patients with irregular patterns",
      "Tripod positioning (sitting upright, leaning forward on arms) is adopted instinctively by patients in respiratory distress to maximize diaphragmatic excursion and accessory muscle use",
      "Diminished breath sounds on one side with dullness to percussion suggest pleural effusion; with hyperresonance, suspect pneumothorax"
    ],
    quiz: [
      {
        question: "The RN auscultates bilateral fine crackles at the lung bases in a patient admitted with heart failure. The patient's SpO2 is 89% on room air. What is the MOST appropriate nursing intervention?",
        options: ["Encourage deep coughing and suctioning to clear secretions", "Elevate the head of bed to high Fowler's position and administer oxygen as prescribed", "Perform chest physiotherapy with postural drainage", "Administer albuterol nebulization for bronchospasm"],
        correct: 1,
        rationale: "Fine crackles at the lung bases in a heart failure patient indicate pulmonary edema (fluid in the alveoli). Elevating the HOB to high Fowler's decreases venous return and reduces pulmonary congestion, while supplemental oxygen addresses hypoxemia. Coughing and suctioning will not clear alveolar fluid. Albuterol treats bronchospasm, not pulmonary edema."
      },
      {
        question: "An asthmatic patient being treated for an acute exacerbation suddenly has no audible wheezing, but remains tachypneic, diaphoretic, and unable to speak. What does this finding indicate?",
        options: ["The bronchospasm has resolved and the patient is improving", "Severe bronchospasm with minimal air movement — a pre-arrest finding", "The patient is hyperventilating from anxiety", "The nebulizer treatment was effective"],
        correct: 1,
        rationale: "A 'silent chest' in an actively distressed asthmatic patient indicates severe bronchospasm with such limited air movement that wheezing is no longer audible. This is a pre-arrest finding that requires immediate escalation: continuous nebulized albuterol, IV magnesium sulfate, IV corticosteroids, and preparation for intubation."
      },
      {
        question: "For a patient with COPD and chronic CO2 retention, what is the appropriate SpO2 target?",
        options: ["98–100%", "95–97%", "92–94%", "88–92%"],
        correct: 3,
        rationale: "COPD patients with chronic CO2 retention rely on hypoxic drive for respiratory stimulation. Over-oxygenation (SpO2 > 92%) may suppress this drive, leading to hypoventilation, worsening hypercapnia, and respiratory failure. Target SpO2 88–92% with low-flow oxygen to maintain adequate oxygenation without suppressing respiratory drive."
      }
    ]
  },
  "brown-sequard-syndrome-rn": {
    title: "Brown-Séquard Syndrome",
    cellular: {
      title: "Pathophysiology of Brown-Séquard Syndrome",
      content: "Brown-Séquard syndrome is a rare spinal cord condition resulting from hemisection (lateral half-transection) of the spinal cord, producing characteristic ipsilateral and contralateral neurological deficits. The hemisection disrupts three major tracts: the lateral corticospinal tract (ipsilateral motor function), the dorsal columns (ipsilateral proprioception and vibration), and the lateral spinothalamic tract (contralateral pain and temperature sensation). Motor paralysis occurs ipsilateral to the lesion because the corticospinal tract has already crossed at the medullary pyramids (decussation). The dorsal columns carry ipsilateral proprioception and vibration sense, ascending without crossing until the medulla, so hemisection causes loss of these sensations on the same side as the lesion. The spinothalamic tract carries pain and temperature fibers that cross within 1–2 spinal segments of entry, so hemisection causes contralateral loss of pain and temperature sensation beginning 1–2 levels below the lesion. The classic presentation is ipsilateral upper motor neuron weakness (spastic paralysis below the lesion), ipsilateral loss of proprioception and vibration, and contralateral loss of pain and temperature sensation. Light touch is partially preserved on both sides because it is carried by both dorsal columns and anterior spinothalamic tract. Brown-Séquard syndrome has the best prognosis of all incomplete spinal cord injuries, with 75–90% of patients regaining ambulatory ability."
    },
    riskFactors: [
      "Penetrating spinal cord injuries: knife wounds, gunshot wounds (most common cause)",
      "Spinal cord tumors: meningiomas, schwannomas, metastatic disease (compression or invasion of hemicord)",
      "Multiple sclerosis (demyelinating plaques affecting hemicord)",
      "Spinal epidural hematoma (unilateral compression of the spinal cord)",
      "Disc herniation with unilateral cord compression",
      "Spinal cord infarction (anterior spinal artery occlusion affecting one side preferentially)",
      "Transverse myelitis with asymmetric involvement"
    ],
    diagnostics: [
      "MRI of the spine (gold standard): Identifies the level and cause of hemisection — tumor, hematoma, disc herniation, demyelination",
      "Neurological examination: Motor strength testing (ipsilateral weakness), sensory mapping (ipsilateral loss of proprioception/vibration, contralateral loss of pain/temperature)",
      "CT myelography if MRI is contraindicated (e.g., patient with pacemaker)",
      "CT spine without contrast for acute trauma to evaluate bony injury",
      "ASIA (American Spinal Injury Association) impairment scale assessment for standardized injury classification",
      "Somatosensory evoked potentials (SSEPs) for dorsal column function evaluation",
      "Urodynamic studies if bladder dysfunction is present"
    ],
    management: [
      "Spinal immobilization in acute traumatic Brown-Séquard: cervical collar, log-roll precautions, spinal board during transport",
      "High-dose methylprednisolone is no longer routinely recommended for acute SCI; follow institutional protocol",
      "Surgical decompression for compressive lesions: tumor excision, hematoma evacuation, disc removal",
      "DVT prophylaxis: LMWH or mechanical compression devices (high risk for DVT due to immobility and paralysis)",
      "Bowel and bladder management program: intermittent catheterization, bowel retraining protocol",
      "Early rehabilitation with physical and occupational therapy (favorable prognosis for functional recovery)",
      "Pain management: neuropathic pain treatment with gabapentin or pregabalin; avoid opioid dependence"
    ],
    nursingActions: [
      "Maintain strict spinal precautions until spine is cleared: cervical collar, log-roll for repositioning, flat bed positioning as ordered",
      "Perform comprehensive neurological assessment every 1–4 hours: motor strength (bilateral upper and lower extremities), sensory testing (pain, temperature, proprioception, vibration), deep tendon reflexes",
      "Document ASIA classification and monitor for changes indicating progression or improvement",
      "Assess for autonomic dysreflexia in injuries at T6 or above: sudden severe hypertension, pounding headache, flushing above the level of injury, bradycardia",
      "Implement skin integrity protection: pressure-relieving mattress, repositioning every 2 hours, skin assessment with focus on areas of sensory loss",
      "Manage neurogenic bladder: intermittent catheterization schedule, monitor for urinary retention and UTI symptoms",
      "Provide psychosocial support and education: address coping with neurological deficits, set realistic expectations for recovery (Brown-Séquard has the best prognosis among incomplete SCI)"
    ],
    assessmentFindings: [
      "Ipsilateral motor weakness or paralysis (upper motor neuron pattern: spastic paralysis, hyperreflexia, positive Babinski sign)",
      "Ipsilateral loss of proprioception (inability to sense joint position) and vibratory sensation",
      "Contralateral loss of pain and temperature sensation beginning 1–2 dermatomes below the level of injury",
      "Preserved light touch bilaterally (dual pathway through dorsal columns and anterior spinothalamic tract)",
      "Horner syndrome ipsilateral if lesion is in the cervical cord (ptosis, miosis, anhidrosis)",
      "Bladder dysfunction: neurogenic bladder with urinary retention or incontinence"
    ],
    signs: {
      left: [
        "Mild unilateral weakness with preserved ambulatory ability",
        "Decreased proprioception on one side with intact pain/temperature on that side",
        "Stable neurological examination without progression",
        "Patient able to participate in rehabilitation activities",
        "Improving motor strength on serial examinations"
      ],
      right: [
        "Complete ipsilateral paralysis with inability to move affected extremities",
        "Progressive neurological deterioration suggesting expanding lesion (hematoma, tumor)",
        "Autonomic dysreflexia with severe hypertension (SBP > 200 mmHg) in cervical/high thoracic injuries",
        "Respiratory compromise from high cervical cord involvement (C3–C5 diaphragm innervation)",
        "Deep vein thrombosis or pulmonary embolism from immobility"
      ]
    },
    medications: [
      {
        name: "Gabapentin",
        type: "Anticonvulsant (used for neuropathic pain)",
        action: "Binds to alpha-2-delta subunit of voltage-gated calcium channels in the CNS, reducing excitatory neurotransmitter release and dampening neuropathic pain signaling",
        sideEffects: "Drowsiness, dizziness, peripheral edema, weight gain, ataxia, blurred vision",
        contra: "Severe renal impairment (requires dose adjustment); avoid abrupt discontinuation (may cause seizures)",
        pearl: "First-line for neuropathic pain in SCI: start 300 mg at bedtime, titrate gradually to 300–1200 mg TID; onset of pain relief may take 1–2 weeks; dose adjustment required for renal impairment (excreted renally unchanged)"
      }
    ],
    pearls: [
      "Brown-Séquard syndrome has the BEST prognosis of all incomplete spinal cord injuries — 75–90% of patients regain the ability to walk independently",
      "The classic triad: ipsilateral motor paralysis + ipsilateral loss of proprioception/vibration + contralateral loss of pain/temperature sensation",
      "Pain and temperature loss is CONTRALATERAL because the spinothalamic tract crosses within 1–2 segments of entering the spinal cord, while motor and proprioception are IPSILATERAL because corticospinal tract and dorsal columns cross at the medulla",
      "Light touch is often preserved bilaterally because it is carried by BOTH the dorsal columns (ipsilateral) and the anterior spinothalamic tract (contralateral)",
      "Penetrating trauma (knife or bullet wounds) is the most common cause; the injury is typically incomplete, contributing to the favorable prognosis",
      "Autonomic dysreflexia can occur with lesions at T6 or above and is triggered by noxious stimuli below the level of injury (full bladder, constipation, pressure ulcer); immediate treatment: sit patient upright, identify and remove the trigger, antihypertensives if needed"
    ],
    quiz: [
      {
        question: "A patient with a stab wound to the right side of the spinal cord at T8 presents with right leg weakness and loss of vibration sense in the right leg. What additional finding would the RN expect?",
        options: ["Loss of pain and temperature sensation in the right leg", "Loss of pain and temperature sensation in the left leg below T10", "Complete bilateral paralysis below T8", "Loss of proprioception in the left leg"],
        correct: 1,
        rationale: "In Brown-Séquard syndrome, hemisection causes ipsilateral motor paralysis and proprioception/vibration loss (right side in this case) and contralateral pain and temperature loss. The spinothalamic tract crosses 1–2 levels above the entry point, so contralateral pain/temperature loss begins approximately 2 dermatomes below the lesion (T10 for a T8 lesion)."
      },
      {
        question: "Which of the following nursing interventions is MOST important for a patient with Brown-Séquard syndrome at the C6 level?",
        options: ["Assess for autonomic dysreflexia with every vital signs check", "Apply bilateral lower extremity compression stockings and remove them every 8 hours", "Encourage oral fluid intake of 3 liters per day", "Perform passive range of motion exercises every 2 hours"],
        correct: 0,
        rationale: "A C6 lesion is above T6, placing the patient at risk for autonomic dysreflexia — a life-threatening hypertensive crisis triggered by noxious stimuli below the injury level. The RN must assess for symptoms (severe headache, flushing, hypertension, bradycardia) with every VS check and intervene immediately if detected."
      },
      {
        question: "What makes the prognosis of Brown-Séquard syndrome different from other spinal cord injury patterns?",
        options: ["It always requires surgical intervention for recovery", "It has the worst prognosis due to complete cord transection", "It has the best prognosis among incomplete SCI patterns, with 75–90% of patients regaining ambulatory ability", "It results in permanent bilateral paralysis in most cases"],
        correct: 2,
        rationale: "Brown-Séquard syndrome has the best prognosis of all incomplete spinal cord injury patterns. Because only half of the cord is damaged, there is significant potential for neurological recovery. Approximately 75–90% of patients regain the ability to walk independently with rehabilitation."
      }
    ]
  },
  "brown-sequard-syndrome-2-rn": {
    title: "Brown-Sequard Syndrome",
    cellular: {
      title: "Pathophysiology of Brown-Sequard Syndrome",
      content: "Brown-Sequard syndrome results from hemisection of the spinal cord, producing a distinctive pattern of neurological deficits based on the anatomy of the three major ascending and descending spinal tracts. The lateral corticospinal tract carries voluntary motor signals from the contralateral motor cortex, having already decussated (crossed) at the medullary pyramids. Hemisection disrupts this tract ipsilaterally, causing upper motor neuron paralysis on the same side as the lesion with spasticity, hyperreflexia, and a positive Babinski sign below the injury level. The dorsal columns (fasciculus gracilis and fasciculus cuneatus) carry fine touch, proprioception, and vibratory sensation ipsilaterally, ascending to decussate in the medulla. Hemisection causes ipsilateral loss of these modalities below the lesion. The lateral spinothalamic tract carries pain and temperature fibers that enter the cord ipsilaterally and cross within 1–2 spinal segments before ascending contralaterally. Hemisection disrupts these already-crossed fibers, producing contralateral loss of pain and temperature sensation typically beginning 1–2 dermatome levels below the injury. Additionally, at the level of the lesion, there may be ipsilateral lower motor neuron signs (flaccid paralysis, areflexia) in the myotome corresponding to the injured segment. Cervical Brown-Sequard may also cause ipsilateral Horner syndrome from disruption of descending sympathetic fibers. The preservation of some pathways on the uninjured side accounts for the favorable recovery prognosis."
    },
    riskFactors: [
      "Stab wounds and penetrating trauma to the spine (most common traumatic cause)",
      "Gunshot wounds causing lateral spinal cord injury",
      "Spinal cord tumors: extramedullary (meningioma, schwannoma) or intramedullary (ependymoma)",
      "Multiple sclerosis with focal demyelinating lesions affecting one hemicord",
      "Cervical disc herniation with asymmetric spinal cord compression",
      "Epidural abscess or hematoma causing unilateral cord compression",
      "Radiation myelopathy with asymmetric cord damage"
    ],
    diagnostics: [
      "Emergent MRI of the spine to identify the lesion (hemorrhage, tumor, disc herniation, demyelination, abscess)",
      "Detailed neurological examination documenting motor level, sensory level (pain/temperature vs proprioception/vibration), and reflex changes bilaterally",
      "ASIA impairment scale classification (typically ASIA C or D — incomplete injury with motor function preserved below the level)",
      "CT spine for bony injury evaluation in trauma cases",
      "Spinal angiography if vascular malformation is suspected",
      "Blood cultures and inflammatory markers (CRP, ESR, WBC) if epidural abscess is considered",
      "Urodynamic testing for neurogenic bladder evaluation"
    ],
    management: [
      "Acute trauma: Spinal immobilization, hemodynamic stabilization, surgical decompression if compressive lesion is identified",
      "Tumor-related: Surgical resection with or without radiation therapy; dexamethasone for peritumoral edema (4–10 mg IV every 6 hours)",
      "Demyelinating (MS): High-dose IV methylprednisolone pulse therapy (1 g/day × 3–5 days); disease-modifying therapy initiation",
      "DVT prophylaxis: Subcutaneous enoxaparin 40 mg daily and pneumatic compression devices; begin within 72 hours of injury",
      "Rehabilitation: Early intensive physical and occupational therapy focusing on gait training, strength, and adaptive techniques",
      "Neuropathic pain management: Gabapentin or pregabalin first-line; duloxetine or amitriptyline as alternatives",
      "Bowel and bladder program: Intermittent catheterization, scheduled bowel care, dietary fiber supplementation"
    ],
    nursingActions: [
      "Maintain spinal precautions until cleared by physician: log-roll technique, cervical collar in cervical injuries, neutral spinal alignment",
      "Perform serial neurological assessments every 1–2 hours in acute phase: compare motor strength, sensory levels, and reflexes to baseline",
      "Assess for neurogenic shock in cervical and high thoracic injuries: hypotension, bradycardia, warm/dry skin below the level of injury (loss of sympathetic tone)",
      "Monitor for autonomic dysreflexia (lesions T6 and above): sudden severe hypertension, pounding headache, facial flushing, diaphoresis above the lesion, bradycardia",
      "Provide meticulous skin care with pressure redistribution: turn every 2 hours, use pressure-relieving surfaces, assess insensate areas for breakdown",
      "Administer prescribed DVT prophylaxis and monitor for signs of DVT/PE: unilateral leg swelling, calf tenderness, sudden dyspnea",
      "Facilitate rehabilitation participation and provide emotional support; educate patient about expected recovery trajectory"
    ],
    assessmentFindings: [
      "Ipsilateral spastic paresis or paralysis below the lesion level (upper motor neuron pattern)",
      "Ipsilateral loss of proprioception (inability to detect joint position) and vibration sense",
      "Contralateral loss of pain and temperature sensation starting 1–2 levels below the lesion",
      "At the lesion level: ipsilateral lower motor neuron signs (segmental flaccid weakness, areflexia)",
      "Possible ipsilateral Horner syndrome in cervical cord lesions (ptosis, miosis, anhidrosis)",
      "Neurogenic bladder: urinary retention initially (spinal shock phase), then may develop reflex bladder"
    ],
    signs: {
      left: [
        "Mild unilateral weakness with ability to ambulate with assistance",
        "Decreased but present proprioception on the affected side",
        "Stable neurological exam with no progression over 48 hours",
        "Active participation in rehabilitation program",
        "Neuropathic pain controlled with medication"
      ],
      right: [
        "Rapidly progressing neurological deficits suggesting expanding mass lesion",
        "Respiratory distress with high cervical injury (C3–C5)",
        "Autonomic dysreflexia with SBP > 200 mmHg requiring emergent intervention",
        "Spinal epidural abscess with fever, leukocytosis, and progressive cord compression",
        "DVT or pulmonary embolism from immobility"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low-molecular-weight heparin (anticoagulant)",
        action: "Inhibits factor Xa and to a lesser degree thrombin (factor IIa), preventing thrombus formation; predictable dose-response allows fixed dosing without routine monitoring",
        sideEffects: "Bleeding (most common), injection site hematoma, thrombocytopenia (HIT — less common than with unfractionated heparin), elevated liver enzymes",
        contra: "Active major bleeding, heparin-induced thrombocytopenia (HIT), severe renal impairment (CrCl < 30 mL/min — use adjusted dose), spinal/epidural anesthesia (risk of epidural hematoma)",
        pearl: "DVT prophylaxis dose 40 mg SQ daily; treatment dose 1 mg/kg SQ every 12 hours; inject into abdominal subcutaneous tissue (alternate sides); do NOT rub injection site; avoid IM injections; anti-Xa monitoring needed in renal impairment, obesity, and pregnancy"
      }
    ],
    pearls: [
      "Remember the mnemonic: 'Same side motor, Same side proprioception, Opposite side pain/temperature' for Brown-Sequard pattern",
      "At the level of the lesion, there may be lower motor neuron signs (flaccid weakness) from anterior horn cell damage in the affected segment",
      "Brown-Sequard is classified as an INCOMPLETE spinal cord injury with the best prognosis for functional recovery among all SCI patterns",
      "Neurogenic shock (not to be confused with spinal shock) causes cardiovascular instability: hypotension + bradycardia from loss of sympathetic tone; treat with IV fluids and vasopressors if needed",
      "Spinal shock is the temporary loss of all neurological function below the injury level occurring immediately after injury; it can last days to weeks and must resolve before the true extent of injury can be assessed",
      "Always monitor for autonomic dysreflexia in injuries at T6 or above — the most common trigger is bladder distension; first intervention: sit the patient upright and catheterize the bladder"
    ],
    quiz: [
      {
        question: "A patient with right-sided hemisection of the spinal cord at T10 is being assessed by the RN. Which combination of findings is expected?",
        options: ["Right-sided paralysis, right-sided loss of pain sensation, left-sided loss of proprioception", "Right-sided paralysis, right-sided loss of proprioception, left-sided loss of pain and temperature below T12", "Bilateral paralysis below T10, bilateral loss of all sensation", "Left-sided paralysis, right-sided loss of pain sensation"],
        correct: 1,
        rationale: "Right-sided cord hemisection at T10 produces: right-sided (ipsilateral) motor paralysis and proprioception/vibration loss, and left-sided (contralateral) pain and temperature loss beginning 1–2 levels below the lesion (approximately T12). This is the classic Brown-Sequard pattern."
      },
      {
        question: "The RN caring for a patient with Brown-Sequard syndrome at C5 notes a sudden blood pressure of 220/115 mmHg, severe headache, facial flushing, and heart rate of 48 bpm. What is the priority action?",
        options: ["Administer prescribed pain medication and continue monitoring", "Sit the patient upright, check for bladder distension, and prepare to catheterize if needed", "Lay the patient flat and administer IV fluid bolus", "Administer atropine for the bradycardia"],
        correct: 1,
        rationale: "This presentation is autonomic dysreflexia, a medical emergency in patients with SCI at T6 or above. Priority interventions: sit the patient upright (reduces blood pressure through orthostatic effect), identify and remove the triggering stimulus (most commonly bladder distension — catheterize immediately). If BP remains elevated, administer prescribed antihypertensives (nifedipine, nitropaste)."
      },
      {
        question: "The RN is educating a patient with Brown-Sequard syndrome about their prognosis. Which statement is MOST accurate?",
        options: ["Most patients with this injury do not regain any motor function", "This type of spinal cord injury has the best recovery prognosis, with most patients regaining the ability to walk", "Full recovery of all neurological function is expected within 2 weeks", "This injury is equivalent to a complete spinal cord transection"],
        correct: 1,
        rationale: "Brown-Sequard syndrome (hemisection) has the best prognosis of all spinal cord injury patterns. Approximately 75–90% of patients regain ambulatory ability. Because only one side of the cord is damaged, there is significant recovery potential through the intact contralateral pathways."
      }
    ]
  },
  "celiac-disease": {
    title: "Celiac Disease",
    cellular: {
      title: "Pathophysiology of Celiac Disease",
      content: "Celiac disease is a chronic autoimmune enteropathy triggered by the ingestion of gluten (specifically gliadin, a storage protein in wheat, barley, and rye) in genetically predisposed individuals carrying HLA-DQ2 or HLA-DQ8 alleles. When gliadin peptides cross the intestinal epithelium, they are deamidated by tissue transglutaminase (tTG), creating highly immunogenic peptides that are presented by HLA-DQ2/DQ8 molecules on antigen-presenting cells to CD4+ T lymphocytes. This triggers a robust adaptive immune response with release of proinflammatory cytokines (interferon-gamma, TNF-alpha, interleukins) that cause intestinal mucosal damage. The characteristic histologic findings include villous atrophy (flattening of the villi that reduces absorptive surface area), crypt hyperplasia (increased proliferative activity in an attempt to regenerate damaged epithelium), and intraepithelial lymphocytosis (increased lymphocytes infiltrating the epithelium). The loss of villous surface area leads to malabsorption of nutrients including iron (proximal duodenum), folic acid, calcium, fat-soluble vitamins (A, D, E, K), and other micronutrients. The distal ileum is typically spared, preserving vitamin B12 and bile salt absorption in most cases. Celiac disease is associated with increased risk of other autoimmune conditions (type 1 diabetes, thyroid disease, dermatitis herpetiformis) and malignancies (intestinal T-cell lymphoma, small bowel adenocarcinoma) in untreated patients."
    },
    riskFactors: [
      "Genetic predisposition: HLA-DQ2 (present in ~95% of celiac patients) or HLA-DQ8 alleles",
      "First-degree relative with celiac disease (10–15% risk in siblings)",
      "Type 1 diabetes mellitus (8–10% co-occurrence with celiac disease)",
      "Autoimmune thyroid disease (Hashimoto thyroiditis, Graves disease)",
      "IgA deficiency (associated with increased celiac disease prevalence)",
      "Turner syndrome, Down syndrome, Williams syndrome",
      "Dermatitis herpetiformis (skin manifestation of celiac disease — virtually all patients have intestinal changes)"
    ],
    diagnostics: [
      "Serum tissue transglutaminase IgA antibody (tTG-IgA): First-line screening test with >95% sensitivity and specificity",
      "Total serum IgA level: Must check to rule out IgA deficiency (which causes false-negative tTG-IgA)",
      "Endomysial antibody (EMA) IgA: Highly specific confirmatory test (>99% specificity)",
      "Deamidated gliadin peptide (DGP) IgG: Used when IgA deficiency is present",
      "Small bowel biopsy (via upper endoscopy): Gold standard — histology showing villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis (Marsh classification)",
      "CBC (iron deficiency anemia), iron studies, folate, vitamin D, calcium, liver enzymes (may be elevated)",
      "HLA-DQ2/DQ8 genotyping: Negative result essentially rules out celiac disease (high negative predictive value)"
    ],
    management: [
      "Strict lifelong gluten-free diet (GFD): Eliminate all wheat, barley, rye, and their derivatives; oats are generally safe if uncontaminated",
      "Referral to registered dietitian specializing in celiac disease for comprehensive dietary education",
      "Replace nutritional deficiencies: iron supplementation, vitamin D and calcium, folate, B vitamins as indicated by laboratory values",
      "Monitor adherence and response: Repeat tTG-IgA at 6 and 12 months (should normalize with strict GFD)",
      "Bone density screening (DEXA scan) at diagnosis and follow-up for osteoporosis risk from calcium/vitamin D malabsorption",
      "Screen first-degree relatives for celiac disease (serologic testing)",
      "Monitor for complications in refractory disease: Evaluate for refractory celiac disease, collagenous sprue, or intestinal lymphoma if symptoms persist despite strict GFD"
    ],
    nursingActions: [
      "Educate patient and family on strict gluten-free diet: reading food labels, identifying hidden sources of gluten (sauces, medications, supplements, communion wafers, lip products)",
      "Assess for signs and symptoms of malabsorption: weight loss, steatorrhea (fatty, foul-smelling stools), fatigue, iron deficiency anemia, bone pain, easy bruising",
      "Monitor laboratory values: CBC, iron studies, folate, vitamin D, calcium, liver function tests, tTG-IgA for dietary adherence",
      "Assess for dermatitis herpetiformis: intensely pruritic, vesicular rash on extensor surfaces (elbows, knees, buttocks)",
      "Provide psychosocial support for the significant lifestyle change of a lifelong gluten-free diet; refer to celiac disease support groups",
      "Educate about cross-contamination risks: separate cooking utensils, dedicated toasters and cutting boards, careful restaurant dining",
      "Screen for associated conditions: thyroid function tests, blood glucose for type 1 diabetes"
    ],
    assessmentFindings: [
      "Chronic diarrhea with steatorrhea (bulky, pale, foul-smelling stools that may float)",
      "Abdominal bloating, cramping, and flatulence after gluten-containing meals",
      "Iron deficiency anemia unresponsive to oral iron supplementation (due to proximal duodenal damage)",
      "Dermatitis herpetiformis: intensely itchy vesicular rash on elbows, knees, buttocks, and scalp",
      "Failure to thrive in children; short stature and delayed puberty",
      "Dental enamel defects and recurrent aphthous ulcers",
      "Osteoporosis or osteopenia from chronic calcium and vitamin D malabsorption"
    ],
    signs: {
      left: [
        "Mild bloating and occasional diarrhea with gluten exposure",
        "Iron deficiency anemia responding to GFD and supplementation",
        "Declining tTG-IgA levels after initiating gluten-free diet",
        "Mild vitamin D deficiency correctable with supplementation",
        "Asymptomatic first-degree relative with positive serology"
      ],
      right: [
        "Severe malnutrition with hypoalbuminemia and multiple nutrient deficiencies",
        "Refractory celiac disease unresponsive to strict gluten-free diet",
        "Suspected intestinal T-cell lymphoma (weight loss, abdominal pain, GI bleeding in long-standing untreated celiac)",
        "Celiac crisis: profuse diarrhea, dehydration, electrolyte abnormalities, metabolic acidosis",
        "Severely symptomatic dermatitis herpetiformis with widespread blistering"
      ]
    },
    medications: [
      {
        name: "Dapsone",
        type: "Sulfone antibiotic (used for dermatitis herpetiformis)",
        action: "Suppresses neutrophil chemotaxis and complement activation at the dermal-epidermal junction, providing rapid relief of dermatitis herpetiformis symptoms",
        sideEffects: "Hemolytic anemia (dose-dependent, especially in G6PD deficiency), methemoglobinemia, agranulocytosis (rare), peripheral neuropathy, hepatotoxicity",
        contra: "G6PD deficiency (severe hemolysis risk), severe anemia, severe hepatic or renal impairment, hypersensitivity to sulfonamides",
        pearl: "Controls dermatitis herpetiformis symptoms within 24–48 hours (even before GFD takes effect); typical dose 25–100 mg daily; must check G6PD status before starting; monitor CBC weekly for first month then monthly; GFD alone may eventually allow dapsone discontinuation"
      }
    ],
    pearls: [
      "A gluten-free diet must be maintained for LIFE — even small amounts of gluten (as little as 50 mg/day) can cause ongoing intestinal damage, even without symptoms",
      "Iron deficiency anemia that does not respond to oral iron supplementation is a classic presentation of celiac disease in adults — the proximal duodenum (where iron is absorbed) is the most severely affected segment",
      "tTG-IgA is the best initial screening test, but IgA deficiency (which is more common in celiac disease) causes false negatives — always check total IgA level",
      "Dermatitis herpetiformis is the skin manifestation of celiac disease: intensely pruritic vesicles on extensor surfaces; it responds rapidly to dapsone but ultimately requires GFD",
      "Patients must continue eating gluten-containing foods during diagnostic testing — removing gluten before biopsy can lead to false-negative results (serologies normalize and villi regenerate)",
      "Untreated celiac disease increases the risk of intestinal lymphoma (enteropathy-associated T-cell lymphoma) and small bowel adenocarcinoma; a strict GFD reduces this risk"
    ],
    quiz: [
      {
        question: "A patient with celiac disease asks the RN which grains are safe to eat. Which grain is acceptable on a gluten-free diet?",
        options: ["Barley", "Rye", "Quinoa", "Wheat"],
        correct: 2,
        rationale: "Quinoa is a naturally gluten-free grain that is safe for patients with celiac disease. Wheat, barley, and rye contain gluten (gliadin) and must be strictly avoided. Other safe alternatives include rice, corn, oats (if certified gluten-free), amaranth, and buckwheat."
      },
      {
        question: "A patient with newly diagnosed celiac disease has a hemoglobin of 8.2 g/dL and ferritin of 5 ng/mL. Which finding is MOST consistent with this laboratory pattern?",
        options: ["Vitamin B12 deficiency from terminal ileum damage", "Iron deficiency anemia from proximal duodenal villous atrophy", "Folate deficiency from jejunal malabsorption", "Anemia of chronic disease from inflammatory cytokine release"],
        correct: 1,
        rationale: "Celiac disease causes the most severe damage in the proximal duodenum, which is the primary site of iron absorption. Iron deficiency anemia that is refractory to oral supplementation is a hallmark finding. The low ferritin confirms depleted iron stores. B12 absorption occurs in the terminal ileum, which is typically spared."
      },
      {
        question: "The RN is educating a patient about celiac disease serologic testing. What important instruction should be given before the blood test?",
        options: ["Fast for 12 hours before the blood draw", "Continue eating gluten-containing foods until testing is complete", "Stop all medications 48 hours before the test", "Drink extra water to ensure adequate blood volume"],
        correct: 1,
        rationale: "Patients must continue eating gluten-containing foods before serologic testing and small bowel biopsy. Removing gluten from the diet causes antibody levels (tTG-IgA) to decline and intestinal villi to regenerate, potentially leading to false-negative results. The general recommendation is to consume at least 3 g of gluten per day for 2+ weeks before testing."
      }
    ]
  },
  "celiac-crisis-rn": {
    title: "Celiac Crisis",
    cellular: {
      title: "Pathophysiology of Celiac Crisis",
      content: "Celiac crisis is a rare, life-threatening acute presentation of celiac disease characterized by profuse watery diarrhea, severe dehydration, metabolic derangements, and hemodynamic instability. It occurs most commonly in undiagnosed or untreated celiac disease patients and can be precipitated by infections, surgery, pregnancy, or significant gluten exposure. The pathophysiology involves massive immune-mediated intestinal inflammation with extensive villous atrophy, leading to severe malabsorption and secretory diarrhea. The overwhelming inflammatory response causes massive fluid and electrolyte losses through the GI tract, leading to hypovolemia, metabolic acidosis (from bicarbonate loss), hypokalemia, hypomagnesemia, hypocalcemia, and hypoalbuminemia. The protein-losing enteropathy causes severe hypoalbuminemia with subsequent third-spacing of fluids and further intravascular volume depletion. Malabsorption of fat-soluble vitamins (A, D, E, K) exacerbates coagulopathy (vitamin K deficiency) and hypocalcemia (vitamin D deficiency). The metabolic acidosis results from both direct intestinal bicarbonate losses and tissue hypoperfusion with lactic acidosis. Without aggressive fluid resuscitation, electrolyte replacement, nutritional support, and institution of a strict gluten-free diet, celiac crisis can progress to multi-organ failure and death. The RN must recognize this rare but critical presentation and initiate aggressive supportive care."
    },
    riskFactors: [
      "Undiagnosed or untreated celiac disease with prolonged gluten exposure",
      "Infection (gastroenteritis, sepsis) as a precipitating trigger",
      "Recent surgery or major physiological stress",
      "Pregnancy or postpartum period",
      "Significant or accidental gluten exposure in known celiac patients",
      "Non-compliance with gluten-free diet",
      "Pediatric patients (more common in children than adults)"
    ],
    diagnostics: [
      "Comprehensive metabolic panel: Assess for hypokalemia, hypocalcemia, hypomagnesemia, metabolic acidosis, hypoalbuminemia, elevated creatinine (prerenal AKI from dehydration)",
      "Complete blood count: Evaluate for anemia (iron, folate deficiency), thrombocytosis, leukocytosis",
      "Serum albumin and total protein: Severely low from protein-losing enteropathy",
      "Celiac serologies: tTG-IgA, EMA-IgA (may be extremely elevated in crisis)",
      "Arterial blood gas: Metabolic acidosis from bicarbonate losses and tissue hypoperfusion",
      "Coagulation studies: Prolonged PT/INR from vitamin K malabsorption",
      "Stool studies: Rule out concurrent infectious diarrhea (C. difficile, Salmonella, Shigella)"
    ],
    management: [
      "Aggressive IV fluid resuscitation: Isotonic crystalloid (0.9% NS or LR) to restore intravascular volume; monitor urine output target > 0.5 mL/kg/hr",
      "Electrolyte replacement: IV potassium, magnesium, calcium, and phosphorus based on laboratory values; monitor closely and replace aggressively",
      "IV corticosteroids (hydrocortisone 100 mg IV every 8 hours) to suppress the severe inflammatory response",
      "Strict gluten-free diet once oral intake is tolerated; may require NG tube feeds or TPN if unable to eat",
      "Vitamin K administration (10 mg IV) for coagulopathy from malabsorption",
      "Albumin infusion for severe hypoalbuminemia (< 2.0 g/dL) with hemodynamic instability",
      "Treat precipitating factors: Antibiotics for infection, surgical management if indicated; correct metabolic acidosis with bicarbonate if pH < 7.1"
    ],
    nursingActions: [
      "Monitor hemodynamic status closely: vital signs every 1–2 hours, strict I&O, daily weights, orthostatic blood pressure measurements",
      "Administer IV fluids and electrolyte replacements via infusion pump; monitor cardiac rhythm during potassium, magnesium, and calcium infusions",
      "Assess for signs of severe dehydration: poor skin turgor, dry mucous membranes, tachycardia, hypotension, oliguria, altered mental status",
      "Monitor stool output: frequency, volume, consistency; send stool cultures to rule out infectious cause",
      "Assess nutritional status: weigh daily, monitor serum albumin and prealbumin, track caloric intake, consult dietitian",
      "Implement fall precautions for electrolyte-related weakness and orthostatic hypotension",
      "Provide emotional support and education: explain the severity of the condition, the importance of lifelong gluten-free diet, and the expected recovery trajectory"
    ],
    assessmentFindings: [
      "Profuse watery diarrhea (10–20+ episodes per day) with severe dehydration",
      "Signs of hypovolemic shock: tachycardia, hypotension, cool extremities, oliguria, altered mental status",
      "Severe electrolyte derangements: muscle weakness (hypokalemia), tetany/Chvostek sign (hypocalcemia), cardiac arrhythmias",
      "Abdominal distension, cramping, and severe bloating",
      "Peripheral edema despite intravascular dehydration (from hypoalbuminemia and third-spacing)",
      "Coagulopathy with easy bruising or bleeding (vitamin K malabsorption)"
    ],
    signs: {
      left: [
        "Moderate diarrhea with mild dehydration responding to oral rehydration",
        "Electrolyte abnormalities correctable with oral or IV supplementation",
        "Stable vital signs with adequate urine output",
        "Able to tolerate oral gluten-free diet",
        "Improving laboratory values within 48–72 hours of treatment"
      ],
      right: [
        "Hypovolemic shock requiring aggressive fluid resuscitation and vasopressors",
        "Severe metabolic acidosis (pH < 7.2) with lactic acidosis from tissue hypoperfusion",
        "Severe hypokalemia (K+ < 2.5 mEq/L) with cardiac arrhythmias",
        "Coagulopathy with active bleeding requiring vitamin K and fresh frozen plasma",
        "Multi-organ failure: acute kidney injury, hepatic dysfunction, respiratory distress"
      ]
    },
    medications: [
      {
        name: "Hydrocortisone",
        type: "Glucocorticoid (systemic corticosteroid)",
        action: "Suppresses inflammatory and immune responses by inhibiting phospholipase A2, reducing prostaglandins, leukotrienes, and proinflammatory cytokine production; reduces intestinal inflammation and immune-mediated mucosal damage",
        sideEffects: "Hyperglycemia, fluid retention, hypokalemia, immunosuppression, peptic ulcer risk, adrenal suppression with prolonged use",
        contra: "Active untreated systemic fungal infections; use caution with uncontrolled diabetes, peptic ulcer disease, immunocompromised patients",
        pearl: "Used in celiac crisis when intestinal inflammation is severe and life-threatening; dose 100 mg IV every 8 hours; monitor blood glucose closely (every 4–6 hours); taper gradually once clinical improvement occurs; transition to oral prednisone as patient stabilizes"
      }
    ],
    pearls: [
      "Celiac crisis is a medical emergency with significant mortality if not recognized and treated aggressively — it requires ICU-level care",
      "Hypoalbuminemia in celiac crisis causes peripheral edema despite intravascular volume depletion — the patient may appear edematous while being hemodynamically unstable from hypovolemia",
      "Always rule out concurrent infection as a precipitating factor — send stool cultures and blood cultures as part of the initial workup",
      "IV corticosteroids are used in crisis to rapidly suppress the overwhelming immune response until a gluten-free diet can take effect",
      "Vitamin K (10 mg IV) should be administered empirically for coagulopathy from malabsorption; PT/INR typically normalizes within 24–48 hours",
      "After stabilization, patients require comprehensive nutritional rehabilitation and lifelong strict adherence to a gluten-free diet with regular follow-up"
    ],
    quiz: [
      {
        question: "A patient in celiac crisis presents with profuse diarrhea, BP 82/50 mmHg, HR 128, and serum potassium of 2.3 mEq/L. What is the RN's priority intervention?",
        options: ["Initiate a strict gluten-free diet immediately", "Begin aggressive IV fluid resuscitation and IV potassium replacement with continuous cardiac monitoring", "Administer oral rehydration solution and oral potassium supplements", "Obtain celiac serologies and await results before treatment"],
        correct: 1,
        rationale: "This patient is in hypovolemic shock with life-threatening hypokalemia. The priority is hemodynamic stabilization with aggressive IV fluid resuscitation and IV potassium replacement (never oral in this scenario — the GI tract is compromised). Continuous cardiac monitoring is essential during potassium repletion due to arrhythmia risk."
      },
      {
        question: "The RN observes peripheral edema in a celiac crisis patient who has a blood pressure of 78/48 mmHg and serum albumin of 1.4 g/dL. Which pathophysiology explains this paradox?",
        options: ["Heart failure from fluid overload", "Severe hypoalbuminemia causing decreased oncotic pressure with fluid shifting into interstitial spaces despite intravascular volume depletion", "Renal failure with fluid retention", "Allergic reaction to gluten causing angioedema"],
        correct: 1,
        rationale: "Severe hypoalbuminemia (< 2.0 g/dL) from protein-losing enteropathy reduces plasma oncotic pressure, causing fluid to shift from the intravascular space into the interstitial space (third-spacing). This results in the paradox of peripheral edema coexisting with intravascular hypovolemia and hypotension."
      },
      {
        question: "Which vitamin deficiency should the RN anticipate in celiac crisis and immediately address to prevent bleeding complications?",
        options: ["Vitamin B12 deficiency", "Vitamin C deficiency", "Vitamin K deficiency", "Vitamin B6 deficiency"],
        correct: 2,
        rationale: "Vitamin K is a fat-soluble vitamin absorbed in the jejunum (the area most damaged by celiac disease). Deficiency leads to impaired synthesis of clotting factors II, VII, IX, and X, causing coagulopathy with prolonged PT/INR and bleeding risk. Vitamin K 10 mg IV should be administered empirically in celiac crisis."
      }
    ]
  },
  "advanced-abdominal-assessment-for-registered-nurses-rn": {
    title: "Advanced Abdominal Assessment for Registered Nurses",
    cellular: {
      title: "Pathophysiology of Abdominal Assessment",
      content: "Advanced abdominal assessment requires systematic evaluation using inspection, auscultation, percussion, and palpation (in this specific order — auscultation before palpation/percussion to avoid altering bowel sounds). The abdomen is divided into four quadrants or nine regions for precise documentation. The RN evaluates the gastrointestinal, hepatobiliary, splenic, renal, vascular, and reproductive structures contained within the abdomen. Inspection assesses contour (flat, rounded, distended, scaphoid), symmetry, visible peristalsis, pulsations, and skin changes. Auscultation evaluates bowel sounds (normal 5–30 clicks per minute; hyperactive in early obstruction, diarrhea; hypoactive or absent in paralytic ileus or late obstruction), vascular bruits (aortic, renal, iliac arteries suggesting stenosis), and venous hum (portal hypertension). Percussion differentiates between gas (tympany), fluid (shifting dullness, fluid wave for ascites), and solid organs (dullness over liver and spleen). Palpation progresses from light (1 cm depth, assessing tenderness, muscle guarding, masses) to deep (4–5 cm depth, evaluating organ size and deep structures). Special assessment maneuvers include Murphy sign (cholecystitis — inspiratory arrest during RUQ palpation), McBurney point tenderness (appendicitis), Rovsing sign (referred RLQ pain with LLQ palpation), rebound tenderness (peritonitis), Grey Turner sign (flank ecchymosis — retroperitoneal hemorrhage), and Cullen sign (periumbilical ecchymosis — intraperitoneal hemorrhage). The RN integrates abdominal findings with laboratory data and clinical history to identify acute abdominal emergencies requiring immediate intervention."
    },
    riskFactors: [
      "Post-operative patients (risk of paralytic ileus, wound dehiscence, intra-abdominal abscess)",
      "Chronic liver disease (ascites, hepatomegaly, portal hypertension, variceal bleeding)",
      "Inflammatory bowel disease (Crohn's, ulcerative colitis — risk of perforation, obstruction, toxic megacolon)",
      "Anticoagulation therapy (increased risk of intra-abdominal and retroperitoneal hemorrhage)",
      "Recent abdominal trauma (blunt or penetrating — risk of solid organ injury, hollow viscus perforation)",
      "Elderly patients (atypical presentations, reduced pain perception, higher risk of mesenteric ischemia)",
      "Immunosuppressed patients (masked inflammatory signs, increased infection risk)"
    ],
    diagnostics: [
      "Systematic abdominal assessment: Inspection → Auscultation → Percussion → Palpation (IAPP sequence)",
      "Special maneuvers: Murphy sign, McBurney point, Rovsing sign, rebound tenderness, psoas sign, obturator sign",
      "Abdominal X-ray (KUB): Air-fluid levels (obstruction), free air under diaphragm (perforation), calcifications",
      "CT abdomen/pelvis with contrast: Gold standard for evaluating acute abdominal pathology",
      "Point-of-care ultrasound (FAST exam): Free fluid in Morrison's pouch, splenorenal recess, pelvis",
      "Laboratory: CBC, CMP, lipase/amylase, liver function tests, lactate, urinalysis, coagulation studies",
      "Serial abdominal girth measurements for monitoring ascites or distension"
    ],
    management: [
      "Acute abdomen with peritoneal signs: Maintain NPO, establish IV access, fluid resuscitation, urgent surgical consultation",
      "Bowel obstruction: NG tube to low intermittent suction for decompression, IV fluids, NPO, electrolyte replacement, serial abdominal X-rays",
      "Paralytic ileus: NPO, NG tube if vomiting, ambulation when possible, avoid opioids, correct electrolytes (hypokalemia worsens ileus)",
      "Ascites management: Sodium restriction (2 g/day), diuretics (spironolactone and furosemide), therapeutic paracentesis for tense ascites",
      "GI bleeding: Two large-bore IV access (16–18 gauge), fluid resuscitation, type and crossmatch, transfuse PRBCs if Hgb < 7 g/dL (< 9 in active bleeding with hemodynamic instability)",
      "Peritonitis: Broad-spectrum IV antibiotics, surgical consultation for source control, hemodynamic support",
      "Pain management: Assess and treat pain; IV analgesics (morphine, hydromorphone); avoid delaying assessment for pain control"
    ],
    nursingActions: [
      "Perform systematic abdominal assessment using IAPP sequence: Inspect, Auscultate, Percuss, Palpate; always auscultate BEFORE percussion and palpation",
      "Auscultate bowel sounds in all four quadrants for at least 2 minutes per quadrant; document as normoactive, hyperactive, hypoactive, or absent",
      "Assess for peritoneal signs: rebound tenderness (pain with sudden release of pressure), involuntary guarding (rigid abdomen), and board-like rigidity — report immediately",
      "Measure abdominal girth at the umbilicus with consistent technique for serial monitoring of distension or ascites",
      "Monitor NG tube function: patency, output characteristics (color, amount, blood), proper positioning, secure taping",
      "Assess stool characteristics: color (melena — black/tarry; hematochezia — bright red), consistency, frequency, test for occult blood",
      "Document pain assessment with abdominal findings: location, onset, character, radiation, aggravating/alleviating factors, associated symptoms (nausea, vomiting, fever)"
    ],
    assessmentFindings: [
      "Distended abdomen with absent bowel sounds and tympany: suggests paralytic ileus or late bowel obstruction",
      "Hyperactive, high-pitched bowel sounds with cramping pain: suggests early mechanical bowel obstruction",
      "Board-like abdominal rigidity with rebound tenderness: peritonitis requiring emergent surgical evaluation",
      "Positive Murphy sign (inspiratory arrest with RUQ palpation): cholecystitis",
      "McBurney point tenderness (1/3 distance from ASIS to umbilicus): appendicitis",
      "Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis): retroperitoneal or intraperitoneal hemorrhage (seen in hemorrhagic pancreatitis)",
      "Shifting dullness and fluid wave: ascites from portal hypertension, malignancy, or heart failure"
    ],
    signs: {
      left: [
        "Mild abdominal tenderness with normoactive bowel sounds",
        "Small volume ascites detectable only by ultrasound",
        "Post-operative hypoactive bowel sounds returning by POD 2–3",
        "Mild bloating with flatus indicating resolving ileus",
        "Non-tender hepatomegaly with stable liver function tests"
      ],
      right: [
        "Board-like abdominal rigidity with absent bowel sounds (peritonitis)",
        "Free air under the diaphragm on upright X-ray (viscus perforation)",
        "Tense ascites with respiratory compromise requiring emergent paracentesis",
        "Grey Turner and Cullen signs (intra-abdominal hemorrhage)",
        "Acute abdomen with hemodynamic instability (surgical emergency)"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Dopamine antagonist / prokinetic agent",
        action: "Blocks dopamine D2 receptors in the chemoreceptor trigger zone (antiemetic effect) and enhances acetylcholine release in the GI tract, increasing gastric motility and accelerating gastric emptying",
        sideEffects: "Extrapyramidal symptoms (acute dystonia, akathisia, tardive dyskinesia with prolonged use), drowsiness, restlessness, prolactin elevation (galactorrhea, gynecomastia), neuroleptic malignant syndrome (rare)",
        contra: "GI obstruction, perforation, or hemorrhage (prokinetic action is dangerous); pheochromocytoma; seizure disorder; Parkinson disease; concurrent use of other dopamine antagonists",
        pearl: "FDA black box warning for tardive dyskinesia with use > 12 weeks; limit use to short-term (< 12 weeks); give 30 minutes before meals for gastroparesis; IV dose 10 mg every 6 hours; diphenhydramine 25 mg IV can treat acute dystonic reactions"
      }
    ],
    pearls: [
      "Always auscultate BEFORE percussion and palpation — touching the abdomen stimulates bowel motility and can falsely alter bowel sound assessment",
      "Board-like rigidity with rebound tenderness is the hallmark of peritonitis — this is a surgical emergency requiring immediate notification",
      "Listen for bowel sounds for a minimum of 5 minutes before documenting them as 'absent' — bowel sounds may be intermittent",
      "Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) are LATE findings of retroperitoneal or intraperitoneal hemorrhage, typically appearing 24–48 hours after the bleeding event",
      "A positive Murphy sign (inspiratory arrest during RUQ palpation) has high sensitivity for acute cholecystitis; positive if the patient catches their breath or stops inspiring when the inflamed gallbladder descends onto the examiner's hand",
      "Post-operative patients: Return of flatus is the first sign of resolving paralytic ileus; document time of first flatus and bowel movement"
    ],
    quiz: [
      {
        question: "When performing an abdominal assessment, in what order should the RN complete the assessment techniques?",
        options: ["Palpation, percussion, auscultation, inspection", "Inspection, auscultation, percussion, palpation", "Inspection, palpation, percussion, auscultation", "Auscultation, inspection, palpation, percussion"],
        correct: 1,
        rationale: "The correct order for abdominal assessment is Inspection, Auscultation, Percussion, Palpation (IAPP). Auscultation must be performed before percussion and palpation because touching the abdomen stimulates peristalsis and can alter bowel sounds, producing inaccurate findings."
      },
      {
        question: "The RN palpates the right upper quadrant while asking the patient to take a deep breath. The patient suddenly stops inspiring and grimaces in pain. What does this finding indicate?",
        options: ["Appendicitis (McBurney point tenderness)", "Cholecystitis (positive Murphy sign)", "Pancreatitis (Cullen sign)", "Bowel obstruction"],
        correct: 1,
        rationale: "A positive Murphy sign occurs when the patient arrests inspiration during RUQ palpation as the inflamed gallbladder descends onto the examiner's fingers during deep inspiration. This finding has high sensitivity for acute cholecystitis. McBurney point is in the RLQ for appendicitis. Cullen sign is periumbilical ecchymosis."
      },
      {
        question: "A post-operative patient (POD 3) has a distended, tympanic abdomen with absent bowel sounds, nausea, and no flatus since surgery. What is the MOST likely diagnosis and appropriate nursing intervention?",
        options: ["Mechanical bowel obstruction — prepare for emergent surgery", "Paralytic ileus — encourage ambulation, maintain NPO, and report to physician", "Gastroenteritis — administer antiemetics and encourage oral fluids", "Normal post-operative recovery — no intervention needed"],
        correct: 1,
        rationale: "Absent bowel sounds, distension, tympany, nausea, and no flatus by POD 3 are consistent with paralytic ileus. Interventions include maintaining NPO status, encouraging ambulation (stimulates bowel motility), correcting electrolytes (hypokalemia worsens ileus), and notifying the physician. An NG tube may be needed if vomiting develops."
      }
    ]
  },
  "congenital-diaphragmatic-hernia-cdh-rn": {
    title: "Congenital Diaphragmatic Hernia (CDH)",
    cellular: {
      title: "Pathophysiology of Congenital Diaphragmatic Hernia",
      content: "Congenital diaphragmatic hernia (CDH) is a developmental defect in which the diaphragm fails to close completely during fetal development (typically between 8–10 weeks gestation), allowing abdominal organs (stomach, intestines, liver, spleen) to herniate into the thoracic cavity. The most common type is the Bochdalek hernia (85–90%), occurring through the posterolateral diaphragm, predominantly on the left side (80%). The Morgagni hernia (anterior retrosternal) is much rarer. The herniated abdominal contents compress the developing lung on the ipsilateral side, causing pulmonary hypoplasia (underdevelopment of the lung with reduced alveolar number and pulmonary vascular bed). The contralateral lung is also affected to a lesser degree by mediastinal shift. The hypoplastic lungs have decreased surfactant production and abnormal pulmonary vasculature with increased muscular thickness, predisposing to persistent pulmonary hypertension of the newborn (PPHN). At birth, the neonate cannot adequately inflate the hypoplastic lungs, leading to severe respiratory distress, hypoxemia, hypercapnia, and acidosis. PPHN causes right-to-left shunting through the ductus arteriosus and foramen ovale, further worsening hypoxemia. The severity of CDH depends on the timing of herniation (earlier = more severe pulmonary hypoplasia), the volume of herniated contents, and the degree of associated pulmonary hypertension. Mortality ranges from 20–50% depending on severity and associated anomalies."
    },
    riskFactors: [
      "Unknown etiology in most cases (sporadic developmental defect)",
      "Genetic factors: associated with trisomy 13, 18, and 21; Fryns syndrome; Pallister-Killian syndrome",
      "Isolated CDH in 50–60% of cases; 40–50% have associated anomalies (cardiac, renal, CNS)",
      "Environmental factors under investigation: vitamin A deficiency, nitrofen exposure (animal models)",
      "Prenatal risk factors for poor prognosis: liver herniation into the thorax, large defect size, low lung-to-head ratio (LHR) on prenatal ultrasound",
      "Right-sided CDH (associated with worse prognosis due to liver herniation)",
      "Polyhydramnios from impaired fetal swallowing due to intestinal malposition"
    ],
    diagnostics: [
      "Prenatal ultrasound: Identifies CDH by 24 weeks — abdominal organs in thorax, mediastinal shift, polyhydramnios",
      "Prenatal MRI for detailed assessment of lung volumes and liver position",
      "Lung-to-head ratio (LHR) on ultrasound: < 1.0 indicates severe pulmonary hypoplasia with poor prognosis",
      "Chest X-ray at birth: Bowel loops visible in the thoracic cavity, mediastinal shift to contralateral side, absent or opacified hemidiaphragm",
      "Arterial blood gas: Respiratory acidosis and metabolic acidosis from hypoxemia and poor perfusion",
      "Echocardiography: Assess for PPHN (elevated PA pressures, right-to-left shunting) and associated cardiac anomalies",
      "Chromosomal analysis: Karyotype and microarray to identify associated genetic syndromes"
    ],
    management: [
      "Immediate postnatal care: Intubate immediately (do NOT use bag-mask ventilation — inflates the stomach and worsens lung compression); gentle ventilation with low PIP to avoid barotrauma",
      "Orogastric tube to continuous low suction to decompress the stomach and intestines in the thorax",
      "Manage pulmonary hypertension: Inhaled nitric oxide (iNO) 20 ppm, sildenafil, milrinone; maintain preductal SpO2 85–95%",
      "ECMO (extracorporeal membrane oxygenation) for refractory hypoxemia or hemodynamic instability despite maximal medical management",
      "Surgical repair: Delayed until physiologic stabilization (typically 24–72 hours after birth); primary closure of the diaphragmatic defect or patch repair for large defects",
      "Post-operative management: Continue ventilatory support, monitor for recurrent pulmonary hypertension, assess for abdominal compartment syndrome after bowel return to abdomen",
      "Long-term follow-up: Monitor for chronic lung disease, gastroesophageal reflux (common), growth failure, neurodevelopmental delays"
    ],
    nursingActions: [
      "Avoid bag-mask ventilation at delivery — immediately intubate with endotracheal tube to prevent gastric distension that worsens thoracic compression",
      "Insert orogastric tube to continuous low suction immediately after intubation to decompress abdominal organs in the thorax",
      "Monitor pre-ductal (right hand/arm) and post-ductal (lower extremities) SpO2 simultaneously; a > 10% difference indicates significant right-to-left shunting",
      "Maintain gentle ventilation: avoid high peak inspiratory pressures (PIP < 25 cmH2O), permissive hypercapnia (PaCO2 45–65 acceptable), preductal SpO2 target 85–95%",
      "Position the infant with the affected side DOWN (gravity assists in keeping herniated organs away from the contralateral lung)",
      "Monitor for signs of pneumothorax on the contralateral side (the more vulnerable lung due to compensatory overdistension)",
      "Post-operative care: Assess wound site, chest tube drainage, maintain ventilatory support, monitor for signs of abdominal compartment syndrome (increased abdominal pressure, decreased urine output, worsening ventilation)"
    ],
    assessmentFindings: [
      "Severe respiratory distress immediately after birth: cyanosis, tachypnea, retractions, grunting",
      "Scaphoid (concave) abdomen: Hallmark finding — the abdomen appears sunken because abdominal contents are in the thorax",
      "Barrel-shaped chest on the affected side with decreased or absent breath sounds",
      "Bowel sounds auscultated in the chest (diagnostic clue)",
      "Heart sounds displaced to the contralateral side (mediastinal shift)",
      "Persistent cyanosis unresponsive to standard oxygen supplementation (PPHN with right-to-left shunting)"
    ],
    signs: {
      left: [
        "Prenatal diagnosis with planned delivery at a tertiary center with ECMO capability",
        "Mild respiratory distress responding to conventional ventilation",
        "LHR > 1.4 suggesting adequate lung development",
        "No liver herniation and isolated CDH without other anomalies",
        "Stable hemodynamics with manageable pulmonary hypertension on iNO"
      ],
      right: [
        "Severe respiratory failure at birth requiring immediate intubation and maximal ventilatory support",
        "Refractory PPHN unresponsive to iNO and vasodilator therapy",
        "Need for ECMO support due to refractory hypoxemia",
        "LHR < 1.0 with liver herniation (poor prognosis)",
        "Associated cardiac anomalies or chromosomal abnormalities complicating management"
      ]
    },
    medications: [
      {
        name: "Inhaled Nitric Oxide (iNO)",
        type: "Pulmonary vasodilator",
        action: "Selectively relaxes pulmonary vascular smooth muscle by activating guanylate cyclase and increasing cGMP, reducing pulmonary arterial pressure and improving V/Q matching without systemic vasodilation",
        sideEffects: "Methemoglobinemia (monitor methemoglobin levels), rebound pulmonary hypertension with abrupt discontinuation, nitrogen dioxide formation (monitor NO2 levels)",
        contra: "Dependent on right-to-left ductal shunting for systemic circulation (e.g., hypoplastic left heart syndrome); severe left ventricular dysfunction",
        pearl: "Starting dose 20 ppm; wean gradually (never stop abruptly — risk of life-threatening rebound pulmonary hypertension); monitor methemoglobin every 8 hours (maintain < 5%); used as a bridge therapy while other pulmonary vasodilators are initiated or as a bridge to ECMO"
      }
    ],
    pearls: [
      "NEVER bag-mask ventilate a neonate with known or suspected CDH — air enters the stomach and intestines in the thorax, further compressing the hypoplastic lung and worsening respiratory failure",
      "A scaphoid (sunken) abdomen at birth with respiratory distress is the classic presentation of CDH — the abdomen is flat/concave because the abdominal contents are in the thorax",
      "Bowel sounds in the chest is a hallmark finding that can be detected on initial assessment",
      "Pre-ductal and post-ductal SpO2 monitoring is essential: a significant difference (> 10%) indicates right-to-left shunting through the ductus arteriosus from PPHN",
      "Surgical repair is DELAYED (not emergent) until the neonate is physiologically stabilized — stabilization of pulmonary hypertension and gas exchange takes priority over surgical repair",
      "Long-term complications include chronic lung disease (from pulmonary hypoplasia), gastroesophageal reflux (very common, may require fundoplication), growth failure, and neurodevelopmental delays"
    ],
    quiz: [
      {
        question: "A newborn is delivered with severe respiratory distress. The abdomen appears scaphoid and the RN hears bowel sounds when auscultating the left chest. Breath sounds are absent on the left. What should the RN do FIRST?",
        options: ["Provide bag-mask ventilation with 100% oxygen", "Assist with immediate endotracheal intubation and insert an orogastric tube", "Place the infant on nasal CPAP and obtain a chest X-ray", "Administer surfactant via nebulizer"],
        correct: 1,
        rationale: "CDH is suspected (scaphoid abdomen, bowel sounds in chest, absent left breath sounds). Bag-mask ventilation is CONTRAINDICATED because it forces air into the herniated stomach/bowel, worsening thoracic compression. The infant should be immediately intubated, and an orogastric tube placed to decompress the stomach."
      },
      {
        question: "How should the RN position an infant with a left-sided congenital diaphragmatic hernia?",
        options: ["Prone position with head elevated", "Right lateral decubitus (affected left side UP)", "Left lateral decubitus (affected left side DOWN)", "Supine with flat positioning"],
        correct: 2,
        rationale: "Position the infant with the affected side DOWN (left lateral decubitus for a left CDH). Gravity helps keep the herniated abdominal organs from further compressing the contralateral (right) lung, which is the better-functioning lung. This positioning optimizes ventilation of the unaffected lung."
      },
      {
        question: "A neonate with CDH on inhaled nitric oxide has a methemoglobin level of 7%. What is the appropriate nursing action?",
        options: ["Continue current iNO dose — this level is acceptable", "Notify the physician — methemoglobin > 5% requires dose reduction or additional treatment", "Increase the iNO dose to improve oxygenation", "Discontinue iNO immediately"],
        correct: 1,
        rationale: "Methemoglobin levels should be maintained below 5% during iNO therapy. A level of 7% is elevated and requires physician notification. The iNO dose may need to be reduced. Methylene blue (1–2 mg/kg IV) can be administered as an antidote for symptomatic methemoglobinemia. Abrupt discontinuation of iNO is dangerous due to rebound pulmonary hypertension."
      }
    ]
  }
};
