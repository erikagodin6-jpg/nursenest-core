import type { TopicEntry } from "./seed-paramedic-encyclopedia-extra";

export function getExtraEntries3(): TopicEntry[] {
  return [

    {
      title: "Bag-Valve-Mask Ventilation",
      category: "Airway Management",
      overview: "Bag-valve-mask (BVM) ventilation is the most fundamental advanced airway skill in EMS. It provides positive pressure ventilation using a self-inflating bag connected to a face mask. Despite being 'basic,' effective BVM ventilation is technically challenging and is often the most appropriate ventilation strategy for short transport times.",
      mechanism: "The BVM consists of a self-inflating bag (adult 1500-1600 mL), a one-way valve, and a face mask. Squeezing the bag forces air (or oxygen-enriched air) through the valve and mask into the patient's lungs. The one-way valve prevents rebreathing. An oxygen reservoir attached to the bag with 15 L/min O2 flow delivers near-100% FiO2. Effective ventilation requires a proper mask seal and patent airway.",
      clinicalRelevance: "BVM ventilation is often equivalent or superior to advanced airway placement in the prehospital setting, particularly for short transport times. Multiple studies show that BVM ventilation produces equivalent or better outcomes than intubation in many prehospital scenarios, especially when performed by providers who infrequently intubate.",
      signsSymptoms: "Indications: apnea, respiratory failure, inadequate spontaneous ventilation, and as a bridge to advanced airway placement. Signs of effective BVM ventilation: visible chest rise, improving SpO2, presence of ETCO2 waveform, and improving patient color. Signs of ineffective ventilation: absent chest rise, persistent low SpO2, absent ETCO2, gastric distension, and air leak around the mask.",
      assessment: "Assess the need for ventilatory support: apnea, respiratory rate <8 or >30, SpO2 <90% despite supplemental O2, inadequate tidal volume. Select appropriate mask size (should cover nose and mouth without covering eyes or extending past chin). Assess for factors that make BVM difficult: facial hair, edentulous patients, facial trauma, and obesity.",
      management: "Open airway with head-tilt/chin-lift or jaw thrust. Insert OPA or NPA as adjunct. Select appropriate mask size. Apply mask using C-E technique: thumb and index finger form C around mask connector applying downward pressure; remaining three fingers form E under mandible lifting jaw into mask. Squeeze bag to deliver ~500-600 mL over 1 second. Ventilate at 10-12 breaths/min (one breath every 5-6 seconds). Use two-person technique whenever possible for better seal.",
      complications: "Gastric insufflation (most common — causes aspiration risk and impairs ventilation by elevating the diaphragm), inadequate ventilation from air leak, barotrauma from excessive volumes or pressures, aspiration, corneal abrasion from mask pressure on eyes, and facial nerve compression.",
      pearls: [
        "Two-person BVM technique is significantly more effective than single-person — one person maintains the mask seal while the other squeezes the bag",
        "The most common reason for BVM failure is an inadequate mask seal — focus on the seal, not on squeezing the bag harder",
        "Squeeze only enough to produce visible chest rise (~500-600 mL) — larger volumes cause gastric insufflation and increase aspiration risk",
        "For edentulous patients, leave dentures in place if possible — they help maintain facial contour for mask seal"
      ],
      pitfalls: [
        "Squeezing the bag too forcefully or too fast — this causes gastric insufflation; deliver breaths slowly over 1 second",
        "Using a single-person technique when two providers are available — two-person technique provides significantly better seal and ventilation",
        "Not using an airway adjunct (OPA/NPA) — these prevent tongue obstruction and improve air delivery",
        "Ventilating too rapidly during CPR — hyperventilation increases intrathoracic pressure, decreases venous return, and reduces coronary perfusion"
      ],
      faq: [
        { question: "When is BVM ventilation preferred over intubation?", answer: "BVM is preferred when: transport time is short (<10 minutes), the provider has limited intubation experience, the patient is expected to resume spontaneous ventilation soon, or intubation attempts have failed. Studies (including the PART trial) show that BVM ventilation produces equivalent survival and neurological outcomes to intubation in many prehospital cardiac arrest scenarios. BVM avoids interruptions to chest compressions and complications of intubation." },
        { question: "How do you maintain a good mask seal on a difficult face?", answer: "Challenging faces (bearded, edentulous, facial trauma): use a two-person technique. For beards: apply a generous amount of water-soluble lubricant to create a seal, or apply tegaderm over the beard area. For edentulous patients: leave dentures in place, or pack gauze in the cheeks to fill the void. For obese patients: ramp the patient (elevate head and shoulders 25-30 degrees) and use jaw thrust aggressively. Consider an LMA if BVM seal cannot be achieved." }
      ],
      keywords: ["bag valve mask paramedic", "BVM ventilation technique", "manual ventilation EMS", "mask seal technique", "two-person BVM"],
      related: ["orotracheal-intubation", "supraglottic-airway-devices", "laryngeal-mask-airway", "cardiac-arrest-management"]
    },

    {
      title: "Needle Cricothyrotomy",
      category: "Airway Management",
      overview: "Needle cricothyrotomy is an emergency airway procedure primarily used in pediatric patients under 10 years of age when all other airway methods have failed. A large-bore needle is inserted through the cricothyroid membrane to provide temporary oxygenation via transtracheal jet ventilation. It is a temporizing measure, not a definitive airway.",
      mechanism: "A large-bore catheter (14-16 gauge) is inserted through the cricothyroid membrane into the trachea. Oxygen is delivered through the catheter using either a jet ventilation system or a modified BVM setup. Oxygenation is achieved, but CO2 elimination is limited due to the small catheter diameter. This creates a time-limited rescue: oxygenation is maintained for 30-45 minutes, but progressive hypercarbia occurs.",
      clinicalRelevance: "Needle cricothyrotomy is the recommended surgical airway for children under 10 because the cricothyroid membrane is too small and the cricoid cartilage too fragile for standard surgical cricothyrotomy. It is a last-resort procedure in the 'can't intubate, can't oxygenate' scenario.",
      signsSymptoms: "Indicated in complete airway obstruction when all other methods have failed: BVM ineffective, supraglottic device failed, intubation failed or impossible, and the patient cannot be oxygenated by any other means. The patient will be cyanotic, hypoxic, and in or approaching cardiac arrest.",
      assessment: "Confirm that all other airway methods have failed. Identify the cricothyroid membrane by palpation (between the thyroid and cricoid cartilage). In children, the membrane is smaller and the landmarks may be difficult to palpate. Ensure transtracheal jet ventilation equipment is available (high-pressure O2 source, jet ventilator, or modified BVM with IV tubing connector).",
      management: "Identify the cricothyroid membrane. Stabilize the larynx with the non-dominant hand. Insert a 14-gauge (adults) or 16-18 gauge (children) IV catheter attached to a syringe at 45 degrees caudally through the membrane. Aspirate air to confirm tracheal placement. Advance the catheter, remove the needle. Connect to oxygen source. Jet ventilation: 1 second insufflation, 4 seconds exhalation (I:E ratio 1:4). Monitor for chest rise and complications.",
      complications: "Subcutaneous emphysema (most common), barotrauma, posterior tracheal wall perforation, esophageal perforation, hemorrhage, catheter kinking or obstruction, hypercarbia (CO2 elimination is poor — this is a temporary measure), and pneumothorax from barotrauma. The procedure is temporary — definitive airway must be established within 30-45 minutes.",
      pearls: [
        "Needle cric is a TEMPORIZING measure — it provides oxygenation but does NOT adequately ventilate (CO2 elimination is poor); a definitive airway is still needed",
        "Use a 1:4 I:E ratio for jet ventilation — long exhalation time is critical to prevent barotrauma from air trapping",
        "Confirm tracheal placement by aspirating air through the syringe before connecting to the oxygen source",
        "This is a pediatric surgical airway — standard surgical cricothyrotomy is appropriate for patients >10 years old"
      ],
      pitfalls: [
        "Using jet ventilation with inadequate exhalation time — air trapping causes barotrauma and tension pneumothorax",
        "Performing needle cric on an adult when surgical cric is appropriate — needle cric is temporizing; surgical cric is definitive",
        "Not securing the catheter — movement dislodges the small-gauge catheter easily",
        "Considering needle cric a definitive airway — it buys time (30-45 minutes) but progressive hypercarbia will cause acidosis and cardiac arrest"
      ],
      faq: [
        { question: "Why is needle cricothyrotomy used instead of surgical cricothyrotomy in children?", answer: "Children under 10 have a small, compliant cricothyroid membrane and a fragile cricoid cartilage ring. Surgical cricothyrotomy (blade incision and tube placement) risks: subglottic stenosis from injury to the cricoid ring (the only complete cartilage ring and the narrowest point of the pediatric airway), injury to surrounding structures due to smaller anatomy, and excessive tissue damage. Needle cricothyrotomy is less invasive and carries lower risk of permanent airway damage in the developing pediatric airway." },
        { question: "How long can needle cricothyrotomy maintain oxygenation?", answer: "Needle cricothyrotomy can maintain oxygenation for approximately 30-45 minutes. However, CO2 elimination is severely limited due to the small catheter diameter. Progressive hypercarbia develops, causing respiratory acidosis. After 30-45 minutes, the hypercarbia becomes significant enough to cause hemodynamic compromise and cardiac irritability. A definitive airway must be established during this window — either by a repeat attempt at supraglottic/endotracheal airway or by surgical cricothyrotomy/tracheostomy in the operating room." }
      ],
      keywords: ["needle cricothyrotomy paramedic", "transtracheal jet ventilation", "pediatric surgical airway", "emergency airway access", "needle cric technique"],
      related: ["surgical-cricothyrotomy", "failed-airway-algorithm", "pediatric-respiratory-emergencies", "difficult-airway-management"]
    },

    {
      title: "Synchronized Cardioversion",
      category: "Cardiac Emergencies",
      overview: "Synchronized cardioversion is the delivery of a timed electrical shock to the heart, synchronized to the R wave of the QRS complex, to terminate tachyarrhythmias with a pulse. Unlike defibrillation, which is unsynchronized and used for pulseless rhythms, cardioversion is used for hemodynamically significant tachyarrhythmias in patients with a pulse.",
      mechanism: "The electrical shock depolarizes a critical mass of myocardium simultaneously, interrupting the re-entrant circuit or abnormal focus driving the arrhythmia. Synchronization to the R wave ensures the shock is delivered during the absolute refractory period, avoiding the vulnerable period of repolarization (T wave), which could induce ventricular fibrillation.",
      clinicalRelevance: "Cardioversion is indicated for unstable tachyarrhythmias and is a core ACLS algorithm intervention. Understanding the indications, energy settings, and the critical difference between synchronized cardioversion and unsynchronized defibrillation is essential for paramedic practice and certification exams.",
      signsSymptoms: "Indications: unstable tachycardia with pulse. Signs of instability: hypotension, altered mental status, ischemic chest pain, and acute heart failure. Applicable rhythms: atrial fibrillation/flutter, SVT, and ventricular tachycardia with pulse that cause hemodynamic instability. NOT used for sinus tachycardia (treat underlying cause) or pulseless rhythms (use defibrillation).",
      assessment: "Confirm the rhythm is a tachyarrhythmia (not sinus tachycardia). Confirm the patient has a pulse (pulseless VT/VF requires unsynchronized defibrillation). Assess hemodynamic stability — cardioversion is indicated for UNSTABLE patients. Stable tachyarrhythmias should be treated pharmacologically first. Establish IV access. Prepare sedation if the patient is conscious.",
      management: "Attach pads in standard position. Select SYNC mode on the defibrillator (verify sync markers appear on the R waves). Select energy: SVT/atrial flutter: 50-100J. Atrial fibrillation: 120-200J biphasic. VT with pulse: 100J, escalating. Sedate the conscious patient (midazolam 2-5mg IV or etomidate 0.3mg/kg IV). Charge and deliver shock. Verify conversion. If unsuccessful, increase energy and repeat. IMPORTANT: re-enable SYNC mode after each shock — most defibrillators default back to unsynchronized mode.",
      complications: "VF induction (if shock delivered during T wave — hence synchronization), skin burns, post-cardioversion bradycardia or asystole (usually transient), thromboembolism (in atrial fibrillation — converting AF to sinus rhythm can dislodge atrial thrombi), sedation-related complications (respiratory depression, hypotension), and failed cardioversion.",
      pearls: [
        "Re-enable SYNC mode after each shock — most defibrillators automatically revert to unsynchronized (defibrillation) mode after delivering a synchronized shock",
        "If the patient deteriorates to pulseless VT/VF during cardioversion attempts, switch immediately to unsynchronized defibrillation at maximum energy",
        "Sedate conscious patients before cardioversion — the shock is extremely painful; use midazolam 2-5mg IV or etomidate 0.3mg/kg IV",
        "Atrial fibrillation/flutter requires higher initial energy (120-200J) than SVT (50-100J) because the atrial fibrillatory waves are more chaotic and harder to terminate"
      ],
      pitfalls: [
        "Failing to re-activate sync mode — delivering an unsynchronized shock to a patient with a pulse risks inducing VF",
        "Cardioverting sinus tachycardia — sinus tachycardia is a physiological response to a stressor (pain, fever, hypovolemia); treat the underlying cause, not the rate",
        "Not sedating a conscious patient — cardioversion is extremely painful and traumatic; always sedate if the patient's condition permits",
        "Using cardioversion for pulseless VT/VF — pulseless rhythms require unsynchronized defibrillation at maximum energy"
      ],
      faq: [
        { question: "What is the difference between cardioversion and defibrillation?", answer: "Cardioversion: synchronized to the R wave, used for tachyarrhythmias WITH a pulse, starts at lower energy (50-200J depending on rhythm), the patient is usually conscious (requires sedation). Defibrillation: unsynchronized, used for pulseless VT/VF, maximum energy (200J biphasic or 360J monophasic), the patient is pulseless and unconscious. The key distinction is pulse status: if the patient has a pulse, synchronize. If pulseless, defibrillate." },
        { question: "Why must the shock be synchronized to the R wave?", answer: "During the cardiac cycle, there is a vulnerable period during the relative refractory period (the T wave) when an electrical stimulus can induce ventricular fibrillation (R-on-T phenomenon). Synchronizing the shock to the R wave (which represents the beginning of the absolute refractory period) ensures the shock is delivered when the myocardium is least vulnerable to fibrillation. This is only a concern when the patient has an organized rhythm — in VF/pulseless VT, there is no organized cycle to synchronize with." }
      ],
      keywords: ["synchronized cardioversion paramedic", "cardioversion technique", "electrical cardioversion", "unstable tachycardia treatment", "sync mode defibrillator"],
      related: ["supraventricular-tachycardia", "ventricular-tachycardia-with-pulse", "atrial-fibrillation", "cardiac-dysrhythmias"]
    },

    {
      title: "Cardiac Tamponade",
      category: "Cardiac Emergencies",
      overview: "Cardiac tamponade is a life-threatening condition in which fluid (usually blood in trauma) accumulates in the pericardial space, compressing the heart and preventing adequate diastolic filling. As little as 150-200 mL of rapidly accumulating fluid can cause hemodynamic collapse. It is a reversible cause of obstructive shock and PEA arrest.",
      mechanism: "The pericardium has limited compliance. Rapid fluid accumulation (blood from penetrating trauma, effusion from pericarditis or malignancy) increases intrapericardial pressure. When this pressure exceeds right atrial pressure, venous return is impaired. The compressed ventricles cannot fill during diastole, reducing stroke volume and cardiac output. Compensatory tachycardia maintains output temporarily, but eventually cardiac output falls critically.",
      clinicalRelevance: "Cardiac tamponade is one of the reversible T's in cardiac arrest (along with tension pneumothorax and thrombosis). In the trauma setting, it is most commonly caused by penetrating chest wounds. Recognition requires maintaining a high index of suspicion, as the classic findings (Beck's triad) are present in only ~30% of cases.",
      signsSymptoms: "Beck's triad (present in ~30%): JVD, muffled heart sounds, and hypotension. Other findings: tachycardia, pulsus paradoxus (>10 mmHg drop in SBP during inspiration), narrowed pulse pressure, electrical alternans on ECG (alternating QRS amplitude), Kussmaul sign (JVD that increases with inspiration — paradoxical), and PEA arrest with narrow QRS.",
      assessment: "Suspect tamponade in: penetrating chest trauma with shock, blunt chest trauma with hemodynamic instability and JVD, known pericardial effusion with acute decompensation, and PEA arrest with JVD. Auscultate heart sounds (muffled). Assess JVD (may be absent if hypovolemic). Assess for pulsus paradoxus. Differentiate from tension pneumothorax: tamponade has bilateral breath sounds; tension pneumothorax has unilateral absent sounds.",
      management: "Prehospital options are limited. IV fluid boluses (500-1000 mL) to increase preload and maintain cardiac output temporarily. Definitive treatment: pericardiocentesis (needle aspiration of pericardial fluid) — only if trained and authorized, or emergent thoracotomy (hospital). Rapid transport to a trauma center with surgical capability. In cardiac arrest suspected from tamponade: standard ACLS with emphasis on fluid loading.",
      complications: "Cardiac arrest (PEA) if untreated, cardiogenic shock, end-organ damage from prolonged low cardiac output, recurrent tamponade after pericardiocentesis, myocardial injury from pericardiocentesis needle, coronary vessel laceration during pericardiocentesis, and pneumothorax from procedural complication.",
      pearls: [
        "Beck's triad (JVD, muffled heart sounds, hypotension) is present in only ~30% of tamponade cases — do not rely on it to exclude the diagnosis",
        "Differentiate tamponade from tension pneumothorax by breath sounds — tamponade has bilateral, equal breath sounds; tension pneumo has unilateral absent sounds",
        "IV fluid boluses temporarily improve hemodynamics by increasing preload — this buys time for transport to definitive care",
        "Cardiac tamponade causes PEA with narrow QRS complexes — consider it in any PEA arrest with JVD and penetrating chest trauma"
      ],
      pitfalls: [
        "Confusing tamponade with tension pneumothorax — both cause JVD and hypotension, but breath sounds differ; needle decompression will not help tamponade",
        "Not giving IV fluids — volume loading is the most important temporizing measure; it maintains preload against the rising intrapericardial pressure",
        "Attempting pericardiocentesis without adequate training — the procedure carries significant risks including myocardial and coronary vessel laceration",
        "Waiting for Beck's triad to diagnose tamponade — this classic presentation is unreliable; maintain high index of suspicion based on mechanism"
      ],
      faq: [
        { question: "How much fluid causes tamponade?", answer: "The amount of fluid that causes tamponade depends on the RATE of accumulation, not just the volume. Rapid accumulation (trauma): as little as 150-200 mL can cause tamponade because the pericardium cannot stretch fast enough. Gradual accumulation (malignant effusion, uremia): 1-2 LITERS may accumulate before tamponade develops because the pericardium gradually stretches to accommodate the fluid. This is why traumatic tamponade is a sudden, dramatic presentation while medical tamponade develops more insidiously." },
        { question: "What is pulsus paradoxus?", answer: "Pulsus paradoxus is an exaggerated drop in systolic blood pressure (>10 mmHg) during inspiration. Normally, inspiration slightly reduces SBP due to increased venous return to the right heart and decreased left ventricular filling. In tamponade, the compressed ventricles are operating at maximum — any further reduction in left ventricular filling during inspiration causes a dramatic drop in SBP. To assess: inflate BP cuff above SBP, slowly deflate while patient breathes normally; note the pressure where Korotkoff sounds first appear only during expiration, then the pressure where they are present throughout the respiratory cycle. The difference is the pulsus paradoxus." }
      ],
      keywords: ["cardiac tamponade paramedic", "Beck's triad", "pericardial tamponade", "obstructive shock tamponade", "pericardiocentesis EMS"],
      related: ["obstructive-shock", "tension-pneumothorax-management", "chest-trauma", "traumatic-cardiac-arrest"]
    },

    {
      title: "Eclampsia",
      category: "OB/GYN Emergencies",
      overview: "Eclampsia is the occurrence of generalized tonic-clonic seizures in a pregnant or postpartum woman with preeclampsia, in the absence of other causes. It is a life-threatening obstetric emergency that can cause maternal and fetal death. Magnesium sulfate is the specific treatment to prevent and control eclamptic seizures.",
      mechanism: "Eclampsia is the progression of preeclampsia (hypertension + proteinuria after 20 weeks gestation) to seizure activity. The exact mechanism is debated but involves endothelial dysfunction, cerebral vasospasm, and cerebral edema. The dysfunctional endothelium causes widespread vasoconstriction, platelet activation, and end-organ damage to the brain, liver, and kidneys. Seizures result from cerebral vasospasm and edema.",
      clinicalRelevance: "Eclampsia is a true obstetric emergency that paramedics must recognize and treat. Magnesium sulfate is the specific anticonvulsant — benzodiazepines alone are less effective for eclamptic seizures. Rapid transport to a facility with obstetric capability is essential. Delivery is the definitive treatment for the underlying disease process.",
      signsSymptoms: "Warning signs of impending eclampsia: severe hypertension (>160/110), severe headache, visual disturbances (blurred vision, scotomata, photophobia), epigastric/RUQ pain (liver capsule distension), hyperreflexia with clonus. Eclampsia: generalized tonic-clonic seizure in a pregnant/postpartum woman. Associated findings: peripheral edema, proteinuria, elevated liver enzymes.",
      assessment: "Assess gestational age. Blood pressure measurement (may be severely elevated). Assess for warning signs: headache, visual changes, RUQ pain. Assess for seizure activity: duration, frequency, post-ictal state. Assess fetal status if possible (fetal heart tones). Check blood glucose. Assess for signs of HELLP syndrome (hemolysis, elevated liver enzymes, low platelets — presents with RUQ pain, nausea, malaise).",
      management: "Seizure management: Magnesium sulfate 4-6g IV over 15-20 minutes (loading dose), then 1-2g/hr maintenance infusion. If MgSO4 unavailable: benzodiazepines (midazolam 5mg IM/IV) for active seizures. Hypertension management: labetalol 20mg IV or hydralazine 5-10mg IV for SBP >160 or DBP >110. Left lateral positioning. Airway management as needed. Continuous monitoring. Rapid transport to facility with obstetric and NICU capability.",
      complications: "Maternal: stroke (most common cause of eclampsia death), HELLP syndrome, DIC, placental abruption, pulmonary edema, acute kidney injury, liver rupture, and death. Fetal: hypoxia from maternal seizures, placental abruption, prematurity (from emergent delivery), and fetal death. Magnesium toxicity: loss of reflexes, respiratory depression, cardiac arrest (monitor closely).",
      pearls: [
        "Magnesium sulfate is the drug of choice for eclamptic seizures — it is MORE effective than benzodiazepines or phenytoin for this specific indication",
        "Monitor for magnesium toxicity: first sign is loss of deep tendon reflexes (patellar reflex), followed by respiratory depression; keep calcium gluconate available as antidote",
        "Eclampsia can occur POSTPARTUM — up to 6 weeks after delivery; consider it in any postpartum patient with seizures and hypertension",
        "Delivery is the definitive treatment for preeclampsia/eclampsia — stabilize the patient and transport to a facility that can deliver the baby"
      ],
      pitfalls: [
        "Using benzodiazepines as the sole treatment for eclamptic seizures — MgSO4 is the specific and superior treatment for this condition",
        "Not monitoring for magnesium toxicity — check patellar reflexes frequently; loss of reflexes indicates dangerous levels",
        "Attributing seizures in a pregnant woman to epilepsy without considering eclampsia — assume eclampsia until proven otherwise",
        "Not treating severe hypertension (>160/110) — uncontrolled severe hypertension causes maternal stroke"
      ],
      faq: [
        { question: "Why is magnesium sulfate preferred over benzodiazepines for eclamptic seizures?", answer: "Multiple large trials (MAGPIE, Collaborative Eclampsia Trial) have proven that MgSO4 is superior to diazepam and phenytoin for both preventing and treating eclamptic seizures. MgSO4 reduces seizure recurrence by 50% compared to diazepam. It also reduces maternal death. The mechanism involves cerebral vasodilation, anticonvulsant effects at the neuromuscular junction, and reduction of cerebral edema. Benzodiazepines treat the seizure symptom but do not address the underlying cerebral vasospasm." },
        { question: "How do you monitor for magnesium toxicity?", answer: "Monitor these clinical parameters: (1) Patellar (knee-jerk) reflexes — loss of reflexes is the first sign of toxicity (occurs at Mg levels 7-10 mEq/L). (2) Respiratory rate — respiratory depression occurs at Mg levels 10-12 mEq/L; maintain rate >12/min. (3) Urine output — renal excretion is the primary elimination route; decreased output leads to accumulation. (4) Level of consciousness — drowsiness progresses to obtundation. Calcium gluconate 1g IV over 3 minutes is the antidote for magnesium toxicity. Always have it drawn up and ready when administering magnesium sulfate." }
      ],
      keywords: ["eclampsia paramedic", "magnesium sulfate eclampsia", "preeclampsia emergency", "pregnancy seizure treatment", "obstetric emergency seizure"],
      related: ["seizure-management", "hypertensive-emergency", "emergency-childbirth", "postpartum-hemorrhage"]
    },

    {
      title: "Pulmonary Embolism",
      category: "Medical Emergencies",
      overview: "Pulmonary embolism (PE) occurs when a blood clot, typically originating from the deep veins of the legs (DVT), travels to the pulmonary vasculature and obstructs blood flow. Massive PE is a life-threatening emergency that causes acute right heart failure and obstructive shock. PE is the third leading cause of cardiovascular death after MI and stroke.",
      mechanism: "A thrombus formed in the deep venous system (most commonly lower extremities or pelvis) embolizes to the pulmonary arteries. The obstruction increases pulmonary vascular resistance, causing acute right ventricular strain and dilation. Right ventricular failure reduces left ventricular preload, decreasing cardiac output. Massive PE (>50% obstruction) causes hemodynamic collapse.",
      clinicalRelevance: "PE is notoriously difficult to diagnose in the prehospital setting because symptoms are nonspecific. The classic triad of dyspnea, pleuritic chest pain, and hemoptysis is present in a minority of cases. Maintaining a high index of suspicion in patients with risk factors and suggestive symptoms is the key to prehospital recognition.",
      signsSymptoms: "Sudden onset dyspnea (most common symptom, present in >80%), pleuritic chest pain, tachycardia, tachypnea, hypoxia, syncope (suggests massive PE), unilateral leg swelling (DVT), hemoptysis (uncommon but suggestive), and cardiovascular collapse (massive PE). Risk factors: recent surgery, prolonged immobility, cancer, pregnancy, oral contraceptives, prior DVT/PE, and obesity.",
      assessment: "Assess risk factors (Virchow's triad: stasis, endothelial injury, hypercoagulability). Evaluate symptoms: acute onset dyspnea disproportionate to clinical findings. SpO2 (may be normal in small PE — does not exclude). 12-lead ECG: sinus tachycardia most common; S1Q3T3 pattern (S wave in Lead I, Q wave in Lead III, T wave inversion in Lead III) is suggestive but not specific; right heart strain pattern. Check for unilateral leg swelling (DVT source).",
      management: "Supplemental oxygen to maintain SpO2 >94%. IV access. Fluid boluses for hypotension (500 mL NS — cautious; excessive fluids can worsen right ventricular dilation). Position of comfort. Cardiac monitoring. For massive PE with cardiovascular collapse: consider thrombolytics (tPA 50mg IV per protocol) if available and authorized. For PE-related cardiac arrest: CPR, consider thrombolytics, continue CPR for 60-90 minutes after thrombolytic administration. Rapid transport.",
      complications: "Cardiac arrest (PEA), right heart failure, hemodynamic collapse, recurrent PE, pulmonary infarction, chronic thromboembolic pulmonary hypertension, and death. Massive PE has mortality rates of 25-65% depending on treatment timing. Post-PE syndrome (chronic dyspnea and exercise intolerance) affects 30-50% of survivors.",
      pearls: [
        "The most common ECG finding in PE is sinus tachycardia — not the classic S1Q3T3 pattern; any unexplained tachycardia should raise suspicion",
        "In PE-related cardiac arrest, consider thrombolytics (tPA) and continue CPR for 60-90 minutes — the thrombolytic needs time to dissolve the clot",
        "Excessive IV fluids can worsen massive PE by overdistending the already failing right ventricle — use cautious 250-500 mL boluses",
        "Syncope in the setting of a PE suggests massive pulmonary obstruction and high-risk PE — these patients need emergent evaluation"
      ],
      pitfalls: [
        "Excluding PE because SpO2 is normal — small to moderate PE can maintain normal oxygen saturation through compensatory mechanisms",
        "Aggressively fluid-loading a massive PE patient — excessive fluids worsen right ventricular dilation and can precipitate cardiovascular collapse",
        "Not considering PE as a cause of sudden cardiac arrest — PE is a reversible cause of PEA arrest; thrombolytics can be life-saving",
        "Dismissing dyspnea without a clear cause — unexplained acute dyspnea with risk factors for DVT should raise PE suspicion"
      ],
      faq: [
        { question: "What is the S1Q3T3 pattern?", answer: "S1Q3T3 is an ECG pattern associated with acute right heart strain from PE: prominent S wave in Lead I, Q wave in Lead III, and T wave inversion in Lead III. It reflects acute right ventricular dilation and strain. However, S1Q3T3 is present in only 10-20% of PE cases and can be seen in other conditions that cause right heart strain. The most common ECG finding in PE is simply sinus tachycardia. Do not exclude PE because S1Q3T3 is absent." },
        { question: "When should thrombolytics be given for PE?", answer: "Consider thrombolytics (tPA) for massive PE with: (1) Cardiovascular collapse (systolic BP <90 mmHg despite fluids), (2) Cardiac arrest suspected to be from PE, (3) Signs of severe right heart failure with hemodynamic instability. In cardiac arrest: administer tPA 50mg IV and continue CPR for 60-90 minutes (longer than standard resuscitation) to allow the thrombolytic to dissolve the clot. This is a high-risk intervention with significant bleeding complications, but massive PE arrest has near-zero survival without it. Follow local protocols and consult medical control." }
      ],
      keywords: ["pulmonary embolism paramedic", "massive PE management", "PE cardiac arrest", "S1Q3T3 ECG pattern", "deep vein thrombosis"],
      related: ["obstructive-shock", "cardiac-arrest-management", "chest-pain-differential", "12-lead-ecg-interpretation"]
    },

    {
      title: "Meningitis",
      category: "Medical Emergencies",
      overview: "Meningitis is inflammation of the meninges (protective membranes covering the brain and spinal cord), most commonly caused by viral or bacterial infection. Bacterial meningitis is a medical emergency with rapid progression and high mortality (10-30%) that requires immediate antibiotic administration. Viral meningitis is generally self-limited.",
      mechanism: "Bacterial meningitis: pathogens (N. meningitidis, S. pneumoniae, H. influenzae, L. monocytogenes) enter the cerebrospinal fluid through hematogenous spread, direct invasion, or contiguous spread from sinuses/ears. Bacterial multiplication triggers intense inflammatory response with cerebral edema, increased ICP, and vascular damage. The inflammatory cascade causes the morbidity and mortality.",
      clinicalRelevance: "Bacterial meningitis is one of the few conditions where prehospital antibiotic administration is sometimes recommended. Recognition and rapid transport are critical — every hour of delayed antibiotic treatment increases mortality. Paramedics must also recognize the contagion risk (droplet precautions for N. meningitidis) and protect themselves.",
      signsSymptoms: "Classic triad (adults): headache, fever, and neck stiffness (nuchal rigidity) — all three present in only 44% of cases. Other findings: photophobia, altered mental status, nausea/vomiting, seizures, and petechial/purpuric rash (N. meningitidis — the only bacterial meningitis that characteristically causes rash and is the most lethal). Infants: fever (or hypothermia), irritability, poor feeding, bulging fontanelle, high-pitched cry.",
      assessment: "Assess for meningeal signs: neck stiffness (resist passive flexion), Kernig sign (pain with knee extension while hip is flexed), Brudzinski sign (involuntary hip/knee flexion when neck is passively flexed). Check for petechial/purpuric rash (especially in a febrile patient — suggests meningococcemia). Assess level of consciousness. Check blood glucose. In infants: check fontanelle (bulging suggests increased ICP).",
      management: "Droplet precautions (surgical mask for provider and patient for suspected N. meningitidis). IV access. IV fluid resuscitation if hypotensive. Seizure management with benzodiazepines. Dexamethasone 0.15 mg/kg IV (reduces inflammation and improves outcomes when given before or with first antibiotic dose — per some protocols). Antibiotic administration if available and authorized per protocol. Rapid transport to appropriate facility. Notify receiving hospital early.",
      complications: "Death (10-30% for bacterial meningitis), permanent neurological deficits (hearing loss in 30%, cognitive impairment, seizure disorder), hydrocephalus, cerebral infarction, subdural empyema, disseminated intravascular coagulation (DIC — especially meningococcemia), Waterhouse-Friderichsen syndrome (adrenal hemorrhage from meningococcemia), and septic shock.",
      pearls: [
        "A petechial or purpuric rash in a febrile patient is meningococcemia until proven otherwise — this is a rapidly fatal condition",
        "The classic triad of headache, fever, and neck stiffness is present in only 44% of bacterial meningitis cases — do not exclude based on absence of all three",
        "Wear a surgical mask for suspected meningococcal meningitis — it is spread by respiratory droplets and can be transmitted to EMS providers",
        "In infants, bulging fontanelle with fever suggests meningitis — nuchal rigidity may be absent in very young infants"
      ],
      pitfalls: [
        "Not wearing droplet precautions — N. meningitidis is transmitted by respiratory droplets; close contact in an ambulance creates high transmission risk",
        "Dismissing headache and fever as 'viral illness' without assessing for nuchal rigidity — the consequences of missing bacterial meningitis are devastating",
        "Not checking for petechiae/purpura — rapidly spreading purpura in a febrile patient indicates meningococcemia with high mortality",
        "Delaying transport for IV access — early antibiotics are the most important intervention; antibiotics are given IV at the hospital if not available prehospitally"
      ],
      faq: [
        { question: "How do you differentiate bacterial from viral meningitis?", answer: "Clinical differentiation is often not possible in the prehospital setting, and definitive diagnosis requires lumbar puncture (hospital). Features suggesting bacterial: rapid onset (hours), high fever, toxic appearance, altered mental status, petechial/purpuric rash (meningococcal), and hemodynamic instability. Features suggesting viral: gradual onset (days), lower fever, less toxic appearance, and preserved mental status. In the field, treat ALL suspected meningitis as bacterial until proven otherwise — the consequences of missing bacterial meningitis are far worse than overtreating viral meningitis." },
        { question: "What is Waterhouse-Friderichsen syndrome?", answer: "Waterhouse-Friderichsen syndrome is bilateral adrenal hemorrhage and necrosis caused by severe meningococcal septicemia. The massive DIC triggered by meningococcal infection causes hemorrhagic infarction of the adrenal glands, resulting in acute adrenal crisis superimposed on septic shock. It presents with rapidly spreading purpura (purpura fulminans), refractory shock, DIC, and multi-organ failure. Mortality exceeds 50% even with aggressive treatment. It is one of the most devastating complications of meningococcemia." }
      ],
      keywords: ["meningitis paramedic", "bacterial meningitis management", "meningococcemia treatment", "nuchal rigidity assessment", "petechial rash fever"],
      related: ["sepsis-and-septic-shock", "seizure-management", "altered-mental-status", "febrile-seizures"]
    },

    {
      title: "Hyperkalemia",
      category: "Medical Emergencies",
      overview: "Hyperkalemia (serum potassium >5.5 mEq/L) is a potentially lethal electrolyte disturbance that can cause fatal cardiac arrhythmias without warning. It is most commonly encountered in patients with renal failure, diabetic ketoacidosis, crush injuries, and medication effects (ACE inhibitors, potassium-sparing diuretics). ECG changes guide the urgency of treatment.",
      mechanism: "Potassium is the primary intracellular cation, and its gradient across cell membranes determines the resting membrane potential of cardiac cells. Elevated extracellular potassium reduces the resting membrane potential (makes it less negative), which affects cardiac conduction. Progressive hyperkalemia sequentially affects depolarization and repolarization, ultimately causing conduction failure, ventricular arrhythmias, and cardiac arrest.",
      clinicalRelevance: "Hyperkalemia is one of the reversible H's in cardiac arrest (the H's and T's). ECG changes are the most important clinical tool for assessing severity and guiding treatment urgency. Progressive ECG changes follow a predictable sequence that indicates worsening hyperkalemia.",
      signsSymptoms: "Mild (5.5-6.0 mEq/L): often asymptomatic, may have peaked (tall, narrow, symmetrical) T waves on ECG. Moderate (6.0-7.0 mEq/L): peaked T waves, prolonged PR interval, muscle weakness, paresthesias. Severe (>7.0 mEq/L): widened QRS, loss of P waves, sine wave pattern, ventricular arrhythmias, and cardiac arrest (asystole or VF/PEA).",
      assessment: "12-lead ECG is the most important assessment tool. Progressive ECG changes of hyperkalemia: (1) Peaked T waves (earliest), (2) PR prolongation, (3) P wave flattening then loss, (4) QRS widening, (5) Sine wave pattern, (6) VF/asystole. Ask about risk factors: dialysis schedule (missed sessions), medications (ACE inhibitors, K-sparing diuretics, NSAIDs), renal history, diabetes, and recent crush injury.",
      management: "Cardiac stabilization: Calcium chloride 10% 10 mL IV over 2-3 minutes (or calcium gluconate 30 mL IV) — stabilizes the cardiac membrane but does NOT lower potassium. Potassium shifting: Sodium bicarbonate 50 mEq IV (shifts K+ intracellularly), Regular insulin 10 units + D50 25g IV (shifts K+ intracellularly), Albuterol 10-20mg nebulized continuously (shifts K+ intracellularly). Potassium removal: Only achievable in hospital (kayexalate, dialysis). Cardiac monitoring continuously.",
      complications: "Cardiac arrest (VF, asystole, or PEA), bradycardia, heart blocks, muscle weakness progressing to paralysis, respiratory failure from muscle weakness, and recurrence if the underlying cause is not addressed. The transition from stable ECG to lethal arrhythmia can occur rapidly and without warning.",
      pearls: [
        "Calcium chloride does NOT lower potassium — it stabilizes the cardiac membrane while other treatments work to shift potassium intracellularly",
        "The ECG is your most important tool — peaked T waves in a dialysis patient or DKA patient should prompt immediate treatment",
        "Albuterol nebulization (10-20mg) is an effective and often overlooked treatment for hyperkalemia — it shifts potassium intracellularly",
        "In hyperkalemic cardiac arrest, give calcium chloride, sodium bicarbonate, and consider hyperventilation — these address the underlying cause of the arrest"
      ],
      pitfalls: [
        "Giving calcium gluconate when calcium chloride is available — calcium chloride provides 3× more calcium per dose and is preferred in emergencies",
        "Not treating peaked T waves because the patient 'feels fine' — hyperkalemia can progress from peaked T waves to cardiac arrest within minutes",
        "Forgetting to give glucose with insulin — insulin alone causes hypoglycemia; always co-administer D50",
        "Not considering hyperkalemia in cardiac arrest — it is a reversible cause that can be treated in the field"
      ],
      faq: [
        { question: "Why does calcium stabilize the heart in hyperkalemia?", answer: "Calcium does not lower potassium levels. Instead, it directly stabilizes the cardiac cell membrane by restoring the normal gradient between the threshold potential and the resting membrane potential. By increasing the threshold potential (making it more positive), calcium counteracts the effect of hyperkalemia on the resting membrane potential. This restores normal cardiac conduction and reduces arrhythmia risk. The effect begins within 1-3 minutes and lasts 30-60 minutes, providing a window for other treatments to lower potassium." },
        { question: "What is the sine wave pattern and what should you do?", answer: "The sine wave pattern is a pre-terminal ECG finding in severe hyperkalemia (usually K+ >8.0 mEq/L). The widened QRS merges with the T wave, creating a smooth, undulating sinusoidal wave. It indicates imminent cardiac arrest. Immediate treatment: Calcium chloride 10% 10 mL IV push (do not wait to draw it up slowly), sodium bicarbonate 50 mEq IV, and prepare for cardiac arrest. This is a true emergency — seconds matter. The next rhythm is likely VF or asystole." }
      ],
      keywords: ["hyperkalemia paramedic", "peaked T waves treatment", "potassium emergency management", "calcium chloride hyperkalemia", "dialysis emergency potassium"],
      related: ["acute-kidney-injury", "crush-injury-and-crush-syndrome", "cardiac-arrest-management", "diabetic-emergencies"]
    },

    {
      title: "Nitroglycerin",
      category: "Pharmacology",
      overview: "Nitroglycerin is a potent vasodilator used in EMS primarily for acute coronary syndromes and acute decompensated heart failure with pulmonary edema. It reduces both preload (through venodilation) and afterload (through arteriolar dilation), decreasing myocardial oxygen demand and relieving pulmonary congestion.",
      mechanism: "Nitroglycerin is converted to nitric oxide (NO) in vascular smooth muscle cells. NO activates guanylate cyclase, increasing cyclic GMP, which causes smooth muscle relaxation. At therapeutic doses: venodilation predominates (reduces preload and venous congestion). At higher doses: arteriolar dilation also occurs (reduces afterload). In coronary arteries: relaxes coronary artery spasm and improves collateral blood flow.",
      clinicalRelevance: "Nitroglycerin is one of the most commonly administered prehospital medications. Understanding its indications, contraindications (particularly regarding phosphodiesterase inhibitors and right ventricular MI), and hemodynamic effects is essential for safe administration.",
      signsSymptoms: "Therapeutic effects: relief of anginal chest pain, reduction of blood pressure, reduction of dyspnea from pulmonary edema. Expected side effects: headache (most common — caused by meningeal vasodilation), hypotension, tachycardia (reflex), flushing, and dizziness. Onset: sublingual 1-3 minutes; IV immediate.",
      assessment: "Assess for indications: ischemic chest pain (ACS), acute pulmonary edema. Assess contraindications: SBP <90 mmHg, recent use of phosphodiesterase inhibitors (sildenafil/Viagra within 24 hours, tadalafil/Cialis within 48 hours), right ventricular MI (leads V4R-V6R ST elevation), severe aortic stenosis, hypertrophic cardiomyopathy, and cardiac tamponade. Obtain baseline blood pressure.",
      management: "ACS chest pain: NTG 0.4mg SL every 5 minutes × 3 doses (if SBP >90). Acute pulmonary edema: NTG 0.4mg SL every 5 minutes, or NTG paste 1-2 inches topical, or NTG IV infusion 10-200 mcg/min titrated to blood pressure and symptoms. Monitor blood pressure before each dose — hold if SBP <90 mmHg. Have IV fluids ready to treat hypotension. Record response to each dose.",
      complications: "Hypotension (most significant — especially with hypovolemia, RV MI, or PDE inhibitor use), reflex tachycardia, headache, syncope, methemoglobinemia (rare, with prolonged high-dose IV use), and tolerance with continuous use. Severe hypotension from nitroglycerin + PDE inhibitors can be refractory and may require vasopressor support.",
      pearls: [
        "Always check blood pressure BEFORE each NTG dose — hypotension is the most important contraindication to continued dosing",
        "Ask specifically about erectile dysfunction medications (Viagra, Cialis, Levitra) — the combination with NTG can cause profound, refractory hypotension",
        "Right ventricular MI is a specific contraindication — these patients are preload-dependent, and NTG-induced venodilation can cause cardiovascular collapse",
        "NTG for acute pulmonary edema may be MORE effective than for chest pain — the preload reduction dramatically reduces pulmonary congestion"
      ],
      pitfalls: [
        "Giving NTG to a patient who has taken a PDE inhibitor (Viagra, Cialis) — this can cause profound, refractory hypotension; ALWAYS ask",
        "Administering NTG to a patient with inferior MI without checking for RV involvement — NTG in RV MI causes severe hypotension",
        "Not monitoring blood pressure between doses — each dose can cause progressive hypotension",
        "Using NTG for suspected aortic dissection — the blood pressure reduction can worsen coronary and cerebral perfusion"
      ],
      faq: [
        { question: "Why is nitroglycerin contraindicated with Viagra (sildenafil)?", answer: "Both nitroglycerin and phosphodiesterase-5 (PDE-5) inhibitors (sildenafil, tadalafil, vardenafil) work through the nitric oxide/cGMP pathway. PDE-5 inhibitors block the enzyme that breaks down cGMP, amplifying the vasodilatory effect of any nitric oxide-based drug. When combined with nitroglycerin, the synergistic vasodilation can cause profound, refractory hypotension that may not respond to standard vasopressor therapy. The contraindication window is 24 hours for sildenafil/vardenafil and 48 hours for tadalafil (longer half-life)." },
        { question: "Why is NTG contraindicated in right ventricular MI?", answer: "The right ventricle in RV MI is already dysfunctional and unable to pump effectively. Cardiac output depends on adequate preload (venous return) to push blood through the failing right ventricle. Nitroglycerin causes venodilation, which reduces preload. In RV MI, this preload reduction can cause catastrophic drop in right ventricular output, leading to cardiogenic shock. Check right-sided leads (V4R) in all inferior MI patients before giving NTG — ST elevation in V4R indicates RV involvement." }
      ],
      keywords: ["nitroglycerin paramedic", "NTG administration", "sublingual nitroglycerin", "vasodilator EMS", "chest pain nitroglycerin"],
      related: ["acute-myocardial-infarction", "congestive-heart-failure", "acute-coronary-syndrome", "aspirin"]
    },

    {
      title: "Succinylcholine",
      category: "Pharmacology",
      overview: "Succinylcholine is a depolarizing neuromuscular blocking agent used to achieve rapid-onset, short-duration skeletal muscle paralysis for rapid sequence intubation (RSI). It is the fastest-acting paralytic available, with onset in 30-60 seconds and duration of 5-10 minutes, making it ideal for emergency intubation.",
      mechanism: "Succinylcholine mimics acetylcholine at the nicotinic receptors of the neuromuscular junction. It causes initial depolarization (producing transient muscle fasciculations) followed by sustained depolarization that prevents repolarization, resulting in flaccid paralysis. It is rapidly metabolized by plasma cholinesterase (pseudocholinesterase), accounting for its short duration of action.",
      clinicalRelevance: "Succinylcholine remains widely used in EMS RSI protocols despite the availability of rocuronium because of its rapid onset (30-60 seconds) and short duration (5-10 minutes). The short duration provides a safety margin — if intubation fails, the patient will resume spontaneous ventilation. However, its numerous contraindications require careful patient selection.",
      signsSymptoms: "Expected effects: fasciculations (30-60 seconds after injection), followed by complete paralysis (including respiratory muscles). Duration: 5-10 minutes. The patient is CONSCIOUS but paralyzed if not adequately sedated — concurrent sedation/induction agent (etomidate, ketamine) is MANDATORY.",
      assessment: "Screen for contraindications: hyperkalemia or conditions predisposing to it (renal failure, crush injury, burns >24 hours old, prolonged immobilization, neuromuscular disease), personal or family history of malignant hyperthermia, penetrating eye injuries, known pseudocholinesterase deficiency. Verify adequate sedation/induction agent has been administered. Ensure BVM ventilation is possible before administering.",
      management: "Dose: 1.5-2 mg/kg IV push. Onset: 30-60 seconds. Duration: 5-10 minutes. ALWAYS administer induction agent first (etomidate 0.3 mg/kg or ketamine 1-2 mg/kg IV). Pre-oxygenate for 3-5 minutes before RSI. After paralysis: intubate, confirm placement with capnography. Have backup airway plans ready (bougie, LMA, surgical cricothyrotomy). Monitor for complications.",
      complications: "Hyperkalemia (can be lethal in at-risk patients — burns, crush injury, denervation, prolonged immobility cause upregulation of acetylcholine receptors; succinylcholine-induced depolarization releases massive potassium), malignant hyperthermia (genetic susceptibility — triggers uncontrolled hyperthermia and rhabdomyolysis), masseter muscle rigidity, bradycardia (especially with repeat doses), and fasciculation-related injury (increased IOP, ICP, and intragastric pressure).",
      pearls: [
        "Succinylcholine causes paralysis, NOT unconsciousness — ALWAYS give an induction agent (etomidate or ketamine) first; being paralyzed while awake is terrifying",
        "The 5-10 minute duration is a SAFETY feature — if intubation fails, the patient will resume spontaneous breathing (unlike rocuronium which lasts 30-60 minutes)",
        "Succinylcholine is CONTRAINDICATED in burns >24 hours old, crush injuries, denervation injuries, and prolonged immobility — these conditions cause acetylcholine receptor upregulation and fatal hyperkalemia",
        "Always pre-oxygenate for 3-5 minutes before RSI — this creates an oxygen reserve during the apneic period"
      ],
      pitfalls: [
        "Giving succinylcholine without an induction agent — the patient will be awake and aware but completely paralyzed (awareness during paralysis)",
        "Using succinylcholine in patients with burns >24 hours, crush injuries, or neuromuscular disease — fatal hyperkalemia from receptor upregulation",
        "Not having a backup airway plan — if intubation fails during the paralysis window, you must be prepared to ventilate or perform a surgical airway",
        "Not pre-oxygenating before RSI — the patient will be apneic; adequate pre-oxygenation provides 3-8 minutes of safe apnea time"
      ],
      faq: [
        { question: "Why does succinylcholine cause hyperkalemia in burn patients?", answer: "After burns, denervation, crush injuries, or prolonged immobility (>48-72 hours), extrajunctional acetylcholine receptors proliferate across the muscle cell membrane (receptor upregulation). When succinylcholine depolarizes these dramatically increased receptors, massive amounts of potassium are released from muscle cells simultaneously. The resulting hyperkalemia can be lethal — serum potassium can rise 5-10 mEq/L in seconds, causing cardiac arrest. This risk begins 24-48 hours after the injury and can persist for months." },
        { question: "What is the difference between succinylcholine and rocuronium?", answer: "Succinylcholine: depolarizing agent, onset 30-60 seconds, duration 5-10 minutes, many contraindications (hyperkalemia risk), metabolized by pseudocholinesterase. Rocuronium: non-depolarizing agent, onset 60-90 seconds, duration 30-60 minutes, fewer contraindications, reversible with sugammadex. Succinylcholine's advantage: faster onset and short duration (safety if intubation fails). Rocuronium's advantage: fewer contraindications, no fasciculations, no hyperkalemia risk, and can be reversed. Rocuronium at high doses (1.2 mg/kg) approaches succinylcholine's onset time." }
      ],
      keywords: ["succinylcholine paramedic", "RSI paralytic", "depolarizing neuromuscular blocker", "rapid sequence intubation drug", "succinylcholine contraindications"],
      related: ["rapid-sequence-intubation", "orotracheal-intubation", "difficult-airway-management", "ketamine"]
    },

    {
      title: "Neonatal Resuscitation Basics",
      category: "Pediatric Emergencies",
      overview: "Neonatal resuscitation follows a systematic approach to support the transition from fetal to extrauterine life. Approximately 10% of newborns require some assistance to begin breathing, and approximately 1% require extensive resuscitation. The focus is on thermoregulation, airway management, and supporting the transition from fetal circulation.",
      mechanism: "At birth, the newborn must transition from placental gas exchange to pulmonary gas exchange. This requires clearing lung fluid, establishing functional residual capacity, and decreasing pulmonary vascular resistance to redirect blood flow through the lungs. Failure of this transition results in persistent hypoxemia, which leads to bradycardia and cardiac arrest if not corrected.",
      clinicalRelevance: "Field delivery and neonatal resuscitation are high-stress, low-frequency events for most paramedics. The NRP (Neonatal Resuscitation Program) algorithm provides a systematic approach. The most critical intervention is effective ventilation — 'ventilation, ventilation, ventilation' is the cornerstone of neonatal resuscitation.",
      signsSymptoms: "Assessment at birth: heart rate, respiratory effort, and tone. Normal newborn: vigorous cry, good tone, heart rate >100. Distressed newborn: weak or absent cry, limp tone, heart rate <100, central cyanosis (acrocyanosis is normal), and apnea. Assess at 1 and 5 minutes using APGAR score (Appearance, Pulse, Grimace, Activity, Respiration).",
      assessment: "Three initial questions: (1) Is the baby term? (2) Does the baby have good muscle tone? (3) Is the baby breathing or crying? If ALL three answers are YES: routine care (dry, stimulate, skin-to-skin with mother). If ANY answer is NO: proceed to initial steps of resuscitation. Heart rate assessment: auscultate at the left sternal border or palpate the umbilical pulse; this is the most important indicator of resuscitation effectiveness.",
      management: "Initial steps (first 30 seconds): warm (dry with warm towels, hat), clear airway (suction only if needed), stimulate (flick soles, rub back), assess (heart rate, breathing). If HR <100 or apnea: PPV with room air or blended O2 at 40-60 breaths/min. If HR <60 after 30 seconds of effective PPV: begin chest compressions (two-thumb technique, 3:1 ratio with ventilations, 90 compressions + 30 ventilations/min). If HR remains <60: epinephrine 0.01-0.03 mg/kg IV/IO (or 0.05-0.1 mg/kg via ETT).",
      complications: "Hypothermia (most common and most preventable complication — decreases surfactant production and increases oxygen demand), pneumothorax from over-aggressive ventilation, meconium aspiration, persistent pulmonary hypertension, hypoglycemia, and birth injuries. Hypothermia worsens ALL other complications.",
      pearls: [
        "THERMOREGULATION is critical — dry the baby immediately, wrap in warm blankets, and put on a hat; hypothermia worsens every other complication",
        "The heart rate is the SINGLE most important indicator of resuscitation effectiveness — improving heart rate means your interventions are working",
        "Effective ventilation corrects most neonatal emergencies — if the heart rate is not improving, the ventilation is not effective; reassess the airway and technique",
        "Compression:ventilation ratio in neonates is 3:1 (NOT 30:2 or 15:2) — this is UNIQUE to newborns because the primary problem is respiratory"
      ],
      pitfalls: [
        "Not drying and warming the baby immediately — hypothermia is the most common and most preventable complication of neonatal resuscitation",
        "Using adult ventilation rates and volumes — neonates need 40-60 breaths/min with just enough volume for gentle chest rise",
        "Routinely suctioning the airway — vigorous suctioning can cause vagal bradycardia and delay ventilation; only suction if there is visible obstruction",
        "Using the adult CPR compression ratio (30:2) — neonatal CPR uses a 3:1 compression:ventilation ratio because the arrest etiology is respiratory"
      ],
      faq: [
        { question: "When should chest compressions be started in neonatal resuscitation?", answer: "Chest compressions should be started if the heart rate remains below 60 bpm AFTER 30 seconds of effective positive pressure ventilation. The key word is 'effective' — ensure you have a good mask seal, visible chest rise, and correct rate (40-60 breaths/min) before concluding that ventilation alone is not working. Most newborns respond to ventilation alone. Compressions are rarely needed when ventilation is truly effective." },
        { question: "What is the correct compression technique for neonatal CPR?", answer: "The two-thumb encircling technique is preferred: place both thumbs side by side on the lower third of the sternum (below the nipple line), with fingers encircling the chest and supporting the back. Compress one-third of the AP diameter of the chest. Use a 3:1 ratio (3 compressions followed by 1 ventilation), delivering 90 compressions and 30 ventilations per minute. The two-thumb technique generates higher peak systolic and coronary perfusion pressures than the two-finger technique." }
      ],
      keywords: ["neonatal resuscitation paramedic", "newborn resuscitation NRP", "APGAR score assessment", "neonatal CPR technique", "field delivery baby"],
      related: ["emergency-childbirth", "pediatric-cardiac-arrest", "pediatric-respiratory-emergencies", "pediatric-assessment-triangle"]
    },

    {
      title: "Sepsis Screening and Early Management",
      category: "Medical Emergencies",
      overview: "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. It is the leading cause of death in hospitals and a major cause of EMS calls. Early recognition using screening tools and aggressive prehospital management (fluids, oxygen) significantly improve outcomes. Every hour of delayed treatment increases mortality by approximately 4-8%.",
      mechanism: "Infection triggers a cascade of inflammatory mediators (TNF-alpha, interleukins, nitric oxide) that cause widespread endothelial dysfunction, vasodilation, capillary leak, and microvascular thrombosis. This leads to tissue hypoperfusion and organ dysfunction. The progression from infection to sepsis to septic shock represents a continuum of increasing severity and mortality.",
      clinicalRelevance: "Prehospital sepsis recognition and early treatment save lives. The 'surviving sepsis campaign' emphasizes that each hour of delayed fluid resuscitation and antibiotic administration increases mortality. Paramedics are often the first medical providers to assess sepsis patients and can initiate life-saving treatment before hospital arrival.",
      signsSymptoms: "Infection + organ dysfunction = sepsis. SIRS criteria: temperature >38°C or <36°C, heart rate >90, respiratory rate >20, WBC >12,000 or <4,000. Organ dysfunction: altered mental status, SBP <100 mmHg, respiratory rate ≥22 (qSOFA). Septic shock: sepsis + fluid-refractory hypotension requiring vasopressors + lactate >2 mmol/L.",
      assessment: "Use prehospital sepsis screening: qSOFA score (altered mental status, SBP ≤100, RR ≥22 — score ≥2 suggests sepsis). Identify infection source: pneumonia (cough, crackles), UTI (dysuria, flank pain), cellulitis (skin erythema, warmth), abdominal (pain, tenderness), and meningitis (headache, stiff neck). Assess for end-organ damage: altered mental status, decreased urine output, mottled skin. Obtain blood glucose and SpO2. Assess lactate if POCT available.",
      management: "Early IV fluid resuscitation: 30 mL/kg crystalloid bolus (start immediately — do not delay). Supplemental oxygen to maintain SpO2 >94%. Monitor and treat hypoglycemia. Activate sepsis alert/notification to receiving hospital (allows early antibiotic preparation). Consider vasopressors (norepinephrine) if fluid-refractory hypotension. Avoid hypothermia (warm fluids if available). Continuous monitoring en route. Rapid transport.",
      complications: "Septic shock, multi-organ dysfunction syndrome (MODS), acute respiratory distress syndrome (ARDS), acute kidney injury, DIC, myocardial dysfunction, adrenal insufficiency, and death. Sepsis mortality ranges from 10% (sepsis without organ failure) to 40-60% (septic shock). Early, aggressive treatment significantly reduces mortality at every stage.",
      pearls: [
        "Time is tissue in sepsis — every hour of delayed treatment increases mortality by 4-8%; start fluids immediately upon recognition",
        "qSOFA (altered mental status + SBP ≤100 + RR ≥22): score ≥2 identifies sepsis patients at high risk of death — simple, quick, no labs needed",
        "The most common sources of sepsis in descending order: pneumonia, urinary tract, abdominal, skin/soft tissue — systematically assess for infection source",
        "Prehospital sepsis alert notification allows the hospital to prepare antibiotics for immediate administration upon arrival — this reduces time to antibiotics"
      ],
      pitfalls: [
        "Not recognizing sepsis because the patient does not 'look septic' — early sepsis can present with subtle findings; use screening tools",
        "Under-resuscitating with IV fluids — 30 mL/kg (2-3 liters for an average adult) is the recommended initial bolus; many providers give far less",
        "Attributing altered mental status in an elderly patient to dementia or 'baseline' — new confusion in the elderly is infection/sepsis until proven otherwise",
        "Delaying transport to complete treatment in the field — early hospital arrival for antibiotics is more important than completing IV fluids in the field"
      ],
      faq: [
        { question: "What is the qSOFA score and how is it used?", answer: "qSOFA (quick Sequential Organ Failure Assessment) is a bedside screening tool for sepsis: (1) Altered mental status (GCS <15), (2) Systolic blood pressure ≤100 mmHg, (3) Respiratory rate ≥22/min. Each criterion = 1 point. Score ≥2 in a patient with suspected infection identifies high risk for poor outcomes (in-hospital mortality ≥10%). qSOFA is designed for prehospital and ED use because it requires no lab tests — just clinical assessment. It helps identify sepsis patients who need aggressive resuscitation and rapid transport." },
        { question: "How do you identify the infection source in the field?", answer: "Systematic approach: Lungs — cough, sputum, crackles, dyspnea (pneumonia). Urinary — dysuria, frequency, flank pain, foul-smelling urine (UTI/pyelonephritis). Abdomen — pain, tenderness, distension, recent surgery (intra-abdominal infection). Skin — erythema, warmth, drainage, wound (cellulitis, wound infection). CNS — headache, nuchal rigidity, photophobia (meningitis). Lines/devices — indwelling catheters, central lines, dialysis access (catheter-related bloodstream infection). Not finding a source does not exclude sepsis — some infections are occult." }
      ],
      keywords: ["sepsis screening paramedic", "qSOFA assessment", "early sepsis management", "septic shock treatment", "surviving sepsis EMS"],
      related: ["sepsis-and-septic-shock", "distributive-shock", "altered-mental-status", "acute-kidney-injury"]
    },

    {
      title: "Compartment Syndrome",
      category: "Trauma",
      overview: "Compartment syndrome occurs when pressure within a closed fascial compartment rises to a level that impairs tissue perfusion. Most commonly affecting the lower leg and forearm, it is a surgical emergency that requires fasciotomy within 6 hours to prevent permanent muscle and nerve damage, limb loss, or death from rhabdomyolysis.",
      mechanism: "Muscles are enclosed in fascial compartments that have limited ability to expand. When swelling occurs within a compartment (from fractures, crush injuries, burns, reperfusion injury, or tight casts/splints), the pressure rises. When compartment pressure exceeds capillary perfusion pressure, blood flow to the muscles and nerves within the compartment ceases. Ischemia leads to further swelling, creating a vicious cycle.",
      clinicalRelevance: "Compartment syndrome is a time-critical diagnosis that paramedics must recognize. The 6-hour window for fasciotomy is critical — beyond this, irreversible muscle necrosis and nerve damage occur. The key clinical finding is pain disproportionate to the injury, especially pain with passive stretch of the muscles in the affected compartment.",
      signsSymptoms: "The 6 P's (classic but LATE findings): Pain (disproportionate to injury, worsened by passive stretch — EARLIEST and most reliable), Pressure (compartment feels tense on palpation), Paresthesias (numbness/tingling), Paralysis (LATE — indicates significant nerve damage), Pallor (LATE), and Pulselessness (VERY LATE — pulses are usually maintained because compartment syndrome affects capillaries before arteries).",
      assessment: "Assess for pain disproportionate to the injury (the hallmark — pain that is more severe than expected for the injury and not relieved by usual doses of analgesics). Passive stretch test: gently extend the toes/fingers in the affected compartment — severe pain with passive stretch is highly suggestive. Palpate the compartment for tenseness. Compare with the uninjured side. Assess distal pulses, sensation, and motor function.",
      management: "Remove any constrictive dressings, casts, or splints (even well-applied ones). Maintain the limb at heart level (elevation above the heart reduces arterial perfusion — do NOT elevate). Aggressive pain management (pain is severe and indicates ongoing ischemia). Do NOT apply ice (vasoconstriction worsens ischemia). Rapid transport to surgical facility — definitive treatment is fasciotomy. Document neurovascular status serially.",
      complications: "Rhabdomyolysis (muscle necrosis releases myoglobin → acute kidney injury), Volkmann ischemic contracture (permanent flexion deformity from fibrosis of dead muscle), permanent nerve damage, limb loss (if fasciotomy delayed beyond 6-8 hours), acute kidney injury, hyperkalemia from rhabdomyolysis, and death from systemic rhabdomyolysis complications.",
      pearls: [
        "Pain out of proportion to the injury is the EARLIEST and most reliable sign — if pain seems excessive for the injury, think compartment syndrome",
        "Pulses are usually PRESENT in compartment syndrome — capillary perfusion fails before arterial flow; a present pulse does NOT exclude the diagnosis",
        "Remove ALL constrictive dressings and maintain the limb at heart level — elevation reduces perfusion, and constrictive dressings increase compartment pressure",
        "The window for fasciotomy is approximately 6 hours — beyond this, irreversible muscle necrosis occurs; rapid transport to a surgical facility is critical"
      ],
      pitfalls: [
        "Waiting for pulselessness or paralysis to diagnose compartment syndrome — these are LATE findings indicating irreversible damage",
        "Elevating the limb above the heart — this reduces arterial perfusion pressure; maintain at heart level",
        "Applying ice — vasoconstriction worsens tissue ischemia in the compartment",
        "Dismissing pain as 'just a fracture' — disproportionate pain and pain with passive stretch suggest compartment syndrome"
      ],
      faq: [
        { question: "Why are pulses present in compartment syndrome?", answer: "Compartment syndrome affects microvascular perfusion (capillaries) before macrovascular flow (arteries). Compartment pressures typically reach 30-45 mmHg when symptoms develop — this is enough to impair capillary perfusion (which operates at 25-35 mmHg) but not enough to occlude arterial flow (which operates at 80-120 mmHg systolic). Therefore, distal pulses remain palpable while muscles and nerves within the compartment are dying from ischemia. This is why pulselessness is a LATE finding and unreliable for diagnosis." },
        { question: "What causes compartment syndrome?", answer: "Any condition that increases pressure within a fascial compartment: (1) Fractures (most common cause — bleeding and swelling within the compartment), (2) Crush injuries, (3) Burns (circumferential burns act as a tourniquet), (4) Reperfusion injury (after prolonged ischemia — restoring blood flow causes massive swelling), (5) Tight casts or splints (iatrogenic), (6) Anticoagulation (bleeding into compartment), (7) Snake envenomation (tissue edema), (8) Excessive exercise (exertional compartment syndrome). The lower leg (anterior compartment) and forearm are the most commonly affected sites." }
      ],
      keywords: ["compartment syndrome paramedic", "fasciotomy indication", "pain out of proportion", "6 P's compartment syndrome", "crush injury compartment"],
      related: ["extremity-trauma", "crush-injury-and-crush-syndrome", "burns-assessment-and-management", "pain-management-in-ems"]
    },

    {
      title: "Excited Delirium Syndrome",
      category: "Behavioral Emergencies",
      overview: "Excited delirium syndrome (ExDS) is a state of extreme agitation, aggression, and distress associated with sympathetic hyperactivity, hyperthermia, and altered pain perception. It is associated with sudden death, particularly during or shortly after physical restraint. ExDS is most commonly associated with stimulant drug use (cocaine, methamphetamine) and psychiatric illness.",
      mechanism: "ExDS involves excessive dopaminergic and sympathetic nervous system stimulation, often from stimulant drugs or acute psychosis. The catecholamine surge causes severe hyperthermia, metabolic acidosis, rhabdomyolysis, and cardiovascular stress. The combination of hyperthermia, acidosis, hyperkalemia (from rhabdomyolysis), and catecholamine excess creates a high risk for sudden cardiac arrest.",
      clinicalRelevance: "ExDS is one of the most dangerous prehospital behavioral emergencies. The mortality risk is significant, especially during and immediately after physical restraint. Paramedics must recognize ExDS as a MEDICAL emergency (not just a behavioral one) and initiate aggressive cooling, chemical sedation, and monitoring. Prone restraint with weight on the torso is associated with positional asphyxia and death.",
      signsSymptoms: "Extreme agitation and combativeness, 'superhuman' strength, insensitivity to pain (including pepper spray and taser), hyperthermia (core temperature >40°C/104°F), profuse diaphoresis, rapid breathing, incoherent speech, bizarre behavior, destruction of property or self-harm, undressing (from hyperthermia), and sudden calm followed by cardiac arrest.",
      assessment: "Recognize the syndrome: extreme agitation + hyperthermia + diaphoresis + insensitivity to pain in the context of stimulant use or psychiatric illness. Assess for hyperthermia (rectal temperature if safe). Assess for rhabdomyolysis signs (dark urine, muscle rigidity). Cardiac monitoring (arrhythmias). Blood glucose (stimulants cause hyperglycemia). Prepare for sudden cardiac arrest — have defibrillator and ACLS drugs ready.",
      management: "Immediate chemical sedation: Ketamine 4-5 mg/kg IM is the preferred agent (rapid onset, maintains respiratory drive, hemodynamically stable). Alternative: midazolam 5mg IM + haloperidol 5-10mg IM. Active cooling: remove clothing, cool IV fluids, ice packs to groin/axillae/neck. IV fluid resuscitation (NS 1-2L bolus). Cardiac monitoring. Avoid prone positioning — use lateral recumbent or supine if restrained. Prepare for cardiac arrest.",
      complications: "Sudden cardiac arrest (most feared — can occur during restraint or shortly after), rhabdomyolysis with acute kidney injury, severe metabolic acidosis, hyperkalemia, DIC, hyperthermia-related organ damage, aspiration, and death. Mortality rate for ExDS with cardiac arrest is approximately 10-20%.",
      pearls: [
        "ExDS is a MEDICAL emergency, not just a behavioral one — aggressive cooling, chemical sedation, and monitoring are critical to survival",
        "Ketamine 4-5 mg/kg IM is the preferred sedation agent — it provides rapid sedation while maintaining respiratory drive and hemodynamic stability",
        "NEVER place an ExDS patient in prone position with weight on the back — this causes positional asphyxia and is associated with sudden death",
        "Be prepared for sudden cardiac arrest — ExDS patients can go from extreme agitation to cardiac arrest within minutes, especially during physical restraint"
      ],
      pitfalls: [
        "Treating ExDS as purely a law enforcement problem — these patients need aggressive medical intervention, not just physical control",
        "Prone positioning with weight on the torso — this is associated with positional asphyxia and death; use lateral recumbent or supine",
        "Not actively cooling hyperthermia — temperatures >40°C (104°F) are common and contribute to rhabdomyolysis, arrhythmias, and death",
        "Assuming the patient is safe once sedated — cardiac arrest can occur minutes to hours after ExDS onset; continuous monitoring is essential"
      ],
      faq: [
        { question: "Why is prone restraint dangerous?", answer: "Prone positioning (face-down) with weight or pressure on the back/torso restricts diaphragmatic excursion and chest wall expansion, reducing tidal volume. In an ExDS patient who already has extreme metabolic demand, impaired gas exchange from prone restraint can cause rapid respiratory failure, worsening acidosis, and cardiac arrest. Studies show that restrained prone patients have significantly reduced respiratory function. All ExDS patients should be placed in lateral recumbent (recovery) position or supine as soon as possible." },
        { question: "Why do ExDS patients suddenly die?", answer: "Sudden death in ExDS results from a 'perfect storm' of physiological derangements: (1) Severe hyperthermia increases metabolic demand. (2) Metabolic acidosis from lactic acid production impairs cardiac function. (3) Rhabdomyolysis releases potassium, causing hyperkalemia. (4) Catecholamine excess causes coronary vasospasm and arrhythmogenic effects. (5) Physical restraint adds further metabolic stress and may impair ventilation. (6) The combination of hyperkalemia, acidosis, hyperthermia, and catecholamine excess creates a substrate for lethal arrhythmias (VF or asystole). This is why rapid chemical sedation and aggressive medical treatment are essential." }
      ],
      keywords: ["excited delirium paramedic", "ExDS management", "agitated delirium treatment", "ketamine excited delirium", "positional asphyxia prevention"],
      related: ["chemical-restraint-pharmacology", "psychiatric-emergency-assessment", "ketamine", "cardiac-arrest-management"]
    },

    {
      title: "Carbon Monoxide Poisoning",
      category: "Toxicology",
      overview: "Carbon monoxide (CO) poisoning occurs from inhalation of CO gas, which is colorless and odorless. CO binds to hemoglobin with 200-250 times greater affinity than oxygen, forming carboxyhemoglobin (COHb) and preventing oxygen delivery to tissues. It is the leading cause of poisoning death in the United States.",
      mechanism: "CO displaces oxygen from hemoglobin, shifts the oxyhemoglobin dissociation curve to the left (impairing oxygen release to tissues), binds to cytochrome oxidase in mitochondria (inhibiting cellular respiration), and causes direct cellular toxicity through oxidative stress. The brain and heart are most vulnerable due to their high metabolic demand. Standard pulse oximetry CANNOT distinguish COHb from oxyhemoglobin.",
      clinicalRelevance: "CO poisoning is frequently missed because symptoms are nonspecific (headache, nausea, dizziness) and standard pulse oximetry gives falsely normal readings. A CO-oximeter (measures COHb specifically) is needed for diagnosis. Paramedics must maintain a high index of suspicion, especially during winter months and in patients from enclosed spaces.",
      signsSymptoms: "Mild (COHb 10-20%): headache, nausea, dizziness, fatigue. Moderate (COHb 20-40%): severe headache, confusion, visual disturbances, tachycardia, chest pain, shortness of breath. Severe (COHb 40-60%): altered consciousness, seizures, syncope, cherry-red skin (classic but unreliable and late finding), cardiac arrhythmias. Critical (COHb >60%): coma, respiratory failure, cardiovascular collapse, death.",
      assessment: "Suspect CO poisoning in: multiple patients from the same enclosed space with similar symptoms (cluster of headaches/nausea), winter months with heating system use, garage exposure, fire exposure. Standard pulse oximetry is UNRELIABLE — it reads falsely normal. CO-oximeter is needed for accurate COHb levels. Assess for neurological deficits, cardiac ischemia (12-lead ECG), and pregnancy (fetal hemoglobin has even higher CO affinity).",
      management: "Remove from exposure. High-flow 100% oxygen via NRB mask (half-life of COHb: room air ~5 hours, 100% O2 ~90 minutes, hyperbaric O2 ~30 minutes). Cardiac monitoring. IV access. Consider intubation for patients with altered LOC. Check blood glucose. Treat seizures with benzodiazepines. Transport to a facility with hyperbaric oxygen capability if: COHb >25%, pregnancy, loss of consciousness, persistent neurological symptoms, or cardiac ischemia.",
      complications: "Delayed neurological syndrome (DNS): cognitive impairment, personality changes, and movement disorders developing 2-40 days after apparent recovery (affects 10-30% of significant exposures). Cardiac injury (MI, arrhythmias), cerebral edema, rhabdomyolysis, and fetal death or injury in pregnant patients. DNS is reduced by hyperbaric oxygen therapy.",
      pearls: [
        "Standard pulse oximetry gives FALSELY NORMAL readings in CO poisoning — it cannot differentiate COHb from oxyhemoglobin",
        "Multiple patients from the same location with headaches and nausea — think CO poisoning until proven otherwise",
        "Administer 100% oxygen via NRB immediately — this reduces the half-life of COHb from 5 hours to 90 minutes",
        "Pregnant patients with CO exposure need aggressive treatment — fetal hemoglobin has 10-15% higher affinity for CO than adult hemoglobin"
      ],
      pitfalls: [
        "Trusting a normal SpO2 reading — pulse oximetry is falsely reassuring in CO poisoning and should not be relied upon",
        "Not considering CO poisoning in patients with 'flu-like' symptoms during winter — CO poisoning is commonly misdiagnosed as viral illness",
        "Removing the patient from the source but not providing high-flow O2 — the COHb will clear slowly on room air; 100% O2 dramatically accelerates clearance",
        "Not recognizing the risk of delayed neurological syndrome — apparently recovered patients can develop cognitive and movement deficits days to weeks later"
      ],
      faq: [
        { question: "Why doesn't pulse oximetry work for CO poisoning?", answer: "Standard pulse oximetry measures the ratio of oxygenated hemoglobin to deoxygenated hemoglobin using two wavelengths of light (red and infrared). Carboxyhemoglobin absorbs light at the same wavelength as oxyhemoglobin, so the device incorrectly reads COHb as oxygenated hemoglobin. A patient with 40% COHb and 55% oxyhemoglobin will read SpO2 ~95% — falsely normal. CO-specific pulse oximeters use additional wavelengths to differentiate COHb and provide accurate COHb readings." },
        { question: "When should hyperbaric oxygen be used?", answer: "Hyperbaric oxygen (HBO) therapy indications for CO poisoning: COHb >25%, any loss of consciousness (even transient), persistent neurological symptoms after normobaric O2, cardiac ischemia or arrhythmias, pregnancy (regardless of COHb level — fetal protection), and severe metabolic acidosis. HBO reduces COHb half-life to 30 minutes, provides dissolved oxygen for tissue oxygenation independent of hemoglobin, and reduces the incidence of delayed neurological syndrome. Transport to a facility with HBO capability when criteria are met." }
      ],
      keywords: ["carbon monoxide poisoning paramedic", "CO poisoning management", "carboxyhemoglobin treatment", "pulse oximetry CO", "hyperbaric oxygen indication"],
      related: ["burns-assessment-and-management", "altered-mental-status", "seizure-management", "smoke-inhalation"]
    },

    {
      title: "12-Lead ECG Interpretation Basics",
      category: "Assessment & Diagnostics",
      overview: "The 12-lead ECG is the most important diagnostic tool available to paramedics. It provides a comprehensive view of the heart's electrical activity from 12 different perspectives, enabling identification of myocardial infarction, arrhythmias, electrolyte abnormalities, and other cardiac pathology. Rapid, accurate 12-lead interpretation is a defining paramedic skill.",
      mechanism: "The 12-lead ECG records electrical potentials from 10 electrodes placed on the limbs and chest, generating 12 unique views (leads) of cardiac electrical activity. Limb leads (I, II, III, aVR, aVL, aVF) view the heart in the frontal plane. Precordial leads (V1-V6) view the heart in the horizontal plane. Each lead records the average direction and magnitude of electrical activity at each moment of the cardiac cycle.",
      clinicalRelevance: "12-lead ECG interpretation is one of the most heavily tested paramedic skills. The ability to identify STEMI (ST-elevation myocardial infarction) drives the decision to activate the cardiac catheterization lab, which directly impacts patient survival. Every minute of delay to PCI (percutaneous coronary intervention) increases mortality.",
      signsSymptoms: "Normal 12-lead findings: regular rate 60-100, normal axis (-30 to +90 degrees), P wave before every QRS, PR interval 0.12-0.20s, QRS <0.12s, no ST elevation or depression. Abnormal findings to identify: ST elevation (STEMI), ST depression (ischemia), pathological Q waves (infarction), T wave inversions, axis deviation, bundle branch blocks, and chamber enlargement patterns.",
      assessment: "Systematic 12-lead interpretation: (1) Rate and rhythm, (2) Intervals (PR, QRS, QT), (3) Axis, (4) P wave morphology, (5) QRS morphology, (6) ST segment analysis (elevation or depression in contiguous leads), (7) T wave morphology. For STEMI identification: look for ST elevation ≥1mm in two or more contiguous limb leads, or ≥2mm in two or more contiguous precordial leads.",
      management: "STEMI identified: activate cath lab (time-critical — 'door to balloon' target <90 minutes), administer aspirin 324mg chewed, obtain serial 12-leads every 10-15 minutes, consider heparin and NTG per protocol. New LBBB with ACS symptoms: treat as STEMI equivalent. Right-sided ECG (V4R): obtain for ALL inferior STEMIs to evaluate for RV involvement (changes management — avoid NTG and aggressive fluid resuscitation).",
      complications: "Misinterpretation leading to inappropriate treatment (false-positive cath lab activation, missed STEMI), artifact causing misdiagnosis, and equipment malfunction. STEMI mimics include early repolarization, pericarditis, left ventricular aneurysm, and hyperkalemia. Clinical correlation is essential.",
      pearls: [
        "ST elevation in contiguous leads identifies the coronary artery and area of infarction: II, III, aVF = inferior (RCA), V1-V4 = anterior (LAD), I, aVL, V5-V6 = lateral (LCx)",
        "Always obtain right-sided leads (V4R) for inferior STEMI — RV involvement changes management (avoid NTG, give fluids instead)",
        "Reciprocal ST depression (ST depression in leads opposite to the ST elevation) supports the STEMI diagnosis — it helps distinguish true STEMI from mimics",
        "Serial 12-leads are more valuable than a single ECG — ST changes can evolve over minutes; repeat every 10-15 minutes in suspected ACS"
      ],
      pitfalls: [
        "Relying on the computer interpretation — automated algorithms have significant false-positive and false-negative rates; always interpret the ECG yourself",
        "Not obtaining a 12-lead on every chest pain patient — the ECG is indicated for any patient with chest pain, dyspnea, syncope, or altered mental status",
        "Missing posterior STEMI — standard 12-lead may only show reciprocal changes (ST depression in V1-V3); obtain posterior leads (V7-V9) when suspected",
        "Not repeating the ECG — a single normal ECG does not exclude ACS; STEMI can develop dynamically, and serial ECGs may capture evolving changes"
      ],
      faq: [
        { question: "How do you identify which coronary artery is occluded?", answer: "The 12-lead ECG identifies the occluded artery by the territory of ST elevation: Inferior STEMI (leads II, III, aVF) = Right Coronary Artery (RCA) in 80% of cases. Anterior STEMI (leads V1-V4) = Left Anterior Descending (LAD). Lateral STEMI (leads I, aVL, V5-V6) = Left Circumflex (LCx). Extensive anterior (V1-V6 + I, aVL) = proximal LAD. This anatomical correlation helps the interventional cardiologist prepare for PCI and predicts potential complications." },
        { question: "What is a STEMI equivalent?", answer: "STEMI equivalents are ECG patterns that indicate acute coronary occlusion requiring emergent PCI, even though they do not meet traditional STEMI criteria. Common equivalents: (1) New or presumably new left bundle branch block (LBBB) with ACS symptoms. (2) Posterior MI (ST depression V1-V3 with tall R waves — obtain posterior leads V7-V9 for confirmation). (3) De Winter T waves (upsloping ST depression at the J-point with tall, symmetrical T waves in precordial leads — indicates proximal LAD occlusion). (4) Wellens syndrome (deep T wave inversions in V2-V3 indicating critical LAD stenosis). Recognizing these patterns can save lives." }
      ],
      keywords: ["12-lead ECG interpretation paramedic", "STEMI identification", "ECG reading technique", "coronary artery territory", "ECG lead placement"],
      related: ["acute-myocardial-infarction", "cardiac-monitoring-and-rhythm-interpretation", "cardiac-dysrhythmias", "nitroglycerin"]
    },

  ];
}
