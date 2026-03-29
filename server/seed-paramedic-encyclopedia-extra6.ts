import type { TopicEntry } from "./seed-paramedic-encyclopedia-extra";

export function getExtraEntries6(): TopicEntry[] {
  return [

    {
      title: "Geriatric Falls",
      category: "Geriatric Emergencies",
      overview: "Falls are the leading cause of injury, hospital admission, and injury-related death in adults over 65. Geriatric patients are predisposed to falls due to polypharmacy, orthostatic hypotension, visual impairment, gait instability, and environmental hazards. Falls in the elderly often indicate an underlying medical condition (syncope, MI, stroke, sepsis) and should prompt thorough assessment beyond the obvious injury.",
      mechanism: "Age-related changes increase fall risk: decreased proprioception, visual impairment, sarcopenia (muscle loss), orthostatic hypotension, slowed reflexes, and cognitive impairment. Medications (antihypertensives, sedatives, diuretics, anticoagulants) compound the risk. The fall itself may be a symptom of an acute medical event — syncope, arrhythmia, stroke, or hypoglycemia — rather than a simple mechanical trip.",
      clinicalRelevance: "A geriatric fall is never 'just a fall.' It represents a sentinel event requiring comprehensive medical evaluation. Anticoagulant use dramatically increases the risk of intracranial hemorrhage even from minor head trauma. Hip fractures have 20-30% one-year mortality. The paramedic must assess for the CAUSE of the fall in addition to the resulting injuries.",
      signsSymptoms: "Injuries from the fall: hip fracture (shortened, externally rotated leg), head injuries (especially in anticoagulated patients), wrist fractures (Colles fracture), vertebral compression fractures, and soft tissue injuries. Medical causes: syncope (brief LOC before the fall), cardiac arrhythmia (palpitations, dizziness), stroke symptoms (focal weakness, slurred speech), and hypoglycemia.",
      assessment: "Assess the injury AND the cause of the fall. Events BEFORE the fall: dizziness, chest pain, palpitations, focal weakness, visual changes (suggests medical cause). Events DURING the fall: LOC, witnessed seizure. After: ability to get up, duration on the ground (prolonged immobility causes rhabdomyolysis, hypothermia, dehydration). Medications: anticoagulants (warfarin, DOACs), antihypertensives, sedatives. 12-lead ECG. Blood glucose. Orthostatic vitals if able.",
      management: "Treat injuries: immobilize suspected fractures, control bleeding. Assess for medical cause: 12-lead ECG, blood glucose, neurological exam. If on anticoagulants with any head trauma: transport for CT regardless of symptom severity. Maintain spinal precautions if mechanism suggests spine injury. Pain management (geriatric patients often underreport pain). IV access. Consider hypothermia if prolonged ground time. Transport for comprehensive evaluation.",
      complications: "Hip fracture (most common serious injury — 20-30% one-year mortality), intracranial hemorrhage (especially in anticoagulated patients — can be delayed), subdural hematoma (bridging veins are more vulnerable in elderly due to brain atrophy), rhabdomyolysis (from prolonged immobility on the floor), hypothermia, dehydration, and loss of independence (fear of falling leads to decreased mobility).",
      pearls: [
        "Always ask WHY the patient fell — the fall may be a symptom of MI, stroke, arrhythmia, or hypoglycemia",
        "Any head trauma in a patient on anticoagulants requires CT evaluation — intracranial hemorrhage can develop hours after the event",
        "Check how long the patient was on the floor — prolonged immobility (>1 hour) increases risk for rhabdomyolysis, hypothermia, and pressure injuries",
        "Hip fractures present with a shortened, externally rotated leg — these have high morbidity and mortality in the elderly"
      ],
      pitfalls: [
        "Dismissing a fall as 'just a trip' without looking for a medical cause — falls in the elderly are often caused by an underlying condition",
        "Not asking about anticoagulant use — anticoagulated patients need CT for even minor head trauma due to risk of delayed intracranial hemorrhage",
        "Inadequate pain management — elderly patients underreport pain; untreated pain increases morbidity",
        "Not assessing for rhabdomyolysis in patients with prolonged ground time — check for dark urine and tender, swollen muscles"
      ],
      faq: [
        { question: "Why are falls in the elderly so dangerous?", answer: "Multiple factors: (1) Osteoporosis makes bones fracture from minor falls. (2) Anticoagulant use is common, increasing bleeding risk — even minor head trauma can cause fatal intracranial hemorrhage. (3) Decreased physiological reserve means injuries that young patients tolerate become life-threatening. (4) Hip fractures have 20-30% one-year mortality due to complications (DVT, PE, pneumonia, decubitus ulcers, loss of mobility). (5) Brain atrophy creates more space for subdural hematomas to develop before becoming symptomatic — leading to delayed presentations." },
        { question: "What medications increase fall risk?", answer: "Major fall-risk medications: (1) Antihypertensives — cause orthostatic hypotension. (2) Benzodiazepines and sedatives — impair balance and cognition. (3) Opioids — cause sedation and dizziness. (4) Diuretics — cause dehydration and electrolyte imbalances. (5) Antihistamines (especially first-generation like diphenhydramine) — cause sedation. (6) Muscle relaxants — cause weakness and sedation. (7) Antidepressants (especially tricyclics and SSRIs) — cause orthostatic hypotension. (8) Anticonvulsants — cause ataxia and dizziness. Polypharmacy (>4 medications) independently increases fall risk." }
      ],
      keywords: ["geriatric falls paramedic", "elderly fall assessment", "fall risk medications", "hip fracture elderly", "fall cause evaluation"],
      related: ["hip-fracture", "subdural-hematoma", "syncope", "anticoagulant-emergencies"]
    },

    {
      title: "Excited Delirium Syndrome",
      category: "Behavioral Emergencies",
      overview: "Excited delirium syndrome (ExDS) is a controversial but clinically recognized condition characterized by extreme agitation, violent behavior, hyperthermia, superhuman strength, and insensitivity to pain. It is associated with sympathomimetic drug use (cocaine, methamphetamine), psychiatric illness, and in-custody sudden death. It represents a medical emergency requiring chemical sedation and aggressive cooling.",
      mechanism: "ExDS is thought to result from massive catecholamine surge combined with dopamine transporter dysfunction. Stimulant drugs (cocaine, methamphetamine) and acute psychosis cause extreme sympathetic activation. The resulting hyperthermia, rhabdomyolysis, metabolic acidosis, and hyperkalemia create a lethal cascade. Physical restraint without sedation worsens acidosis and hyperthermia through continued struggling.",
      clinicalRelevance: "ExDS patients are at extreme risk for sudden cardiac death, particularly during or after physical restraint. EMS must recognize ExDS as a medical emergency — not merely a law enforcement issue. Chemical sedation (ketamine, midazolam) is the most important intervention. Prone positioning and prolonged physical restraint are associated with death and should be avoided.",
      signsSymptoms: "Extreme agitation and combativeness, apparent superhuman strength, imperviousness to pain, bizarre behavior (nudity, incoherent shouting), profuse diaphoresis, hyperthermia (often >40°C), tachycardia, dilated pupils, and sudden unexpected death during or after restraint. The patient may suddenly transition from extreme agitation to cardiorespiratory arrest.",
      assessment: "Scene safety first — law enforcement assistance is usually required. Assess for hyperthermia, diaphoresis, dilated pupils. Determine substance use history if possible. Cardiac monitoring when feasible. Recognize that the syndrome is a medical emergency, not a behavioral issue. Do NOT delay medical intervention waiting for the patient to 'calm down.'",
      management: "Chemical sedation is the priority: ketamine 4-5 mg/kg IM (fastest onset, most effective) or midazolam 5-10 mg IM. Once sedated: cardiac monitoring, supplemental oxygen, IV access, rapid cooling if hyperthermic. Avoid prolonged prone positioning (restricts breathing). Avoid physical restraint without chemical sedation (worsens metabolic crisis). Transport rapidly with continuous monitoring — sudden cardiac arrest can occur even after apparent stabilization.",
      complications: "Sudden cardiac death (most feared — from hyperkalemia, acidosis, or catecholamine cardiotoxicity), rhabdomyolysis, acute kidney injury, hyperthermia with multi-organ failure, respiratory arrest (especially in prone position), and DIC. Mortality is estimated at 8-14% for recognized ExDS cases.",
      pearls: [
        "Chemical sedation is the MOST IMPORTANT intervention — physical restraint alone worsens the metabolic crisis and increases death risk",
        "Ketamine IM is the most effective and fastest-acting sedative for ExDS — 4-5 mg/kg IM provides rapid sedation",
        "Sudden transition from extreme agitation to quiet collapse is an ominous sign — it often precedes cardiac arrest; be prepared for immediate resuscitation",
        "Avoid prone positioning — it restricts breathing and is associated with positional asphyxia in this population"
      ],
      pitfalls: [
        "Treating ExDS as purely a law enforcement issue — this is a medical emergency requiring EMS intervention",
        "Relying on physical restraint without chemical sedation — continued struggling worsens acidosis, hyperthermia, and rhabdomyolysis",
        "Prolonged prone positioning — restricts ventilation and contributes to positional asphyxia",
        "Not monitoring after sedation — sudden cardiac arrest can occur even after the patient appears stabilized"
      ],
      faq: [
        { question: "Why is chemical sedation so important?", answer: "ExDS creates a lethal metabolic cycle: extreme muscle activity generates heat (hyperthermia), causes muscle breakdown (rhabdomyolysis), produces metabolic acidosis, and releases potassium (hyperkalemia). Physical restraint prolongs this cycle because the patient continues to struggle against restraints. Chemical sedation breaks the cycle by stopping the muscle activity, allowing the body to begin dissipating heat and correcting the metabolic derangements. Studies show that early chemical sedation reduces mortality compared to physical restraint alone." },
        { question: "What is the risk of sudden death in ExDS?", answer: "Sudden death occurs in 8-14% of recognized ExDS cases. The mechanism is typically hyperkalemia-induced cardiac arrhythmia or severe metabolic acidosis. Risk factors for death include: prolonged struggle/restraint, hyperthermia >40°C, prone positioning, delayed chemical sedation, and underlying cardiac disease. The 'sudden quiet phase' — when an extremely agitated patient suddenly becomes still and quiet — often immediately precedes cardiac arrest and should trigger aggressive medical assessment and preparation for resuscitation." }
      ],
      keywords: ["excited delirium paramedic", "ExDS management EMS", "agitated patient sedation", "ketamine excited delirium", "in-custody death prevention"],
      related: ["behavioral-emergencies-de-escalation", "chemical-restraint", "heat-stroke", "rhabdomyolysis"]
    },

    {
      title: "Pediatric Febrile Seizures",
      category: "Pediatric Emergencies",
      overview: "Febrile seizures are the most common seizure type in children, occurring in 2-5% of children between 6 months and 5 years. They are triggered by fever (>38°C/100.4°F) and are classified as simple (lasting <15 minutes, generalized, non-recurring within 24 hours) or complex (>15 minutes, focal features, or recurring). Simple febrile seizures are benign with excellent prognosis.",
      mechanism: "The immature pediatric brain has a lower seizure threshold than the adult brain. Rapid temperature elevation (the rate of rise matters more than the absolute temperature) triggers neuronal excitability in susceptible children. The mechanism is not fully understood but involves cytokine-mediated reduction of the seizure threshold during fever. Genetic predisposition plays a role — 25-40% have a positive family history.",
      clinicalRelevance: "Febrile seizures are terrifying for parents but are almost always benign. The paramedic's role is to manage the actively seizing child (if still seizing), differentiate simple from complex febrile seizures, exclude serious causes of fever with seizure (meningitis, encephalitis), and reassure the family. Most febrile seizures stop spontaneously within 5 minutes.",
      signsSymptoms: "Simple febrile seizure: generalized tonic-clonic activity lasting <15 minutes, associated with fever, brief postictal period, return to normal neurological baseline. Complex febrile seizure: duration >15 minutes, focal features (one-sided jerking), or recurrence within 24 hours. Red flags for meningitis: nuchal rigidity, bulging fontanelle, petechial rash, persistent altered consciousness, and toxic appearance.",
      assessment: "Measure temperature. Assess seizure duration and characteristics (generalized vs focal). Assess postictal state — the child should gradually return to normal baseline. Check for signs of serious infection: meningeal signs (nuchal rigidity, Kernig/Brudzinski signs), bulging fontanelle (infants), petechial rash (meningococcemia), and toxic appearance. Assess hydration status. Document seizure description for the receiving physician.",
      management: "If actively seizing: ABCs, position safely, do not restrain. If seizure >5 minutes: midazolam 0.2 mg/kg IM/IN (max 10 mg) or diazepam 0.5 mg/kg rectal (max 20 mg). Supportive care: supplemental oxygen if SpO2 <94%, monitor airway. Fever management: remove excess clothing, consider acetaminophen 15 mg/kg (if the child can take oral medications and is not actively seizing). Transport for evaluation — especially first febrile seizure, complex features, or age <12 months.",
      complications: "Simple febrile seizures: excellent prognosis with no increased risk of epilepsy, intellectual disability, or death. Recurrence risk: 30-40% will have another febrile seizure. Complex febrile seizures: slightly increased risk of later epilepsy (2-4% vs 1% general population). Status epilepticus (seizure >30 minutes) is rare but requires aggressive management. Risk of febrile seizure recurrence: highest in children <18 months with lower fever at seizure onset.",
      pearls: [
        "Most febrile seizures stop on their own within 5 minutes — focus on protecting the airway, positioning safely, and timing the seizure",
        "The rate of temperature RISE is more important than the absolute temperature — febrile seizures often occur as the fever is climbing",
        "A child who returns to baseline mental status after a brief generalized seizure with fever has had a simple febrile seizure — reassure the parents",
        "Intranasal midazolam (0.2 mg/kg) is the fastest non-IV route for seizure termination in children — it can be given without IV access"
      ],
      pitfalls: [
        "Assuming every seizure with fever is a febrile seizure — always consider meningitis, encephalitis, and other serious causes, especially if the child does not return to baseline",
        "Aggressive fever treatment to 'prevent' febrile seizures — antipyretics do NOT prevent febrile seizures; they treat discomfort",
        "Not timing the seizure — seizure duration determines treatment decisions; start timing from the moment you arrive (or based on bystander report)",
        "Not recognizing complex features — focal seizures, prolonged seizures, or recurrence within 24 hours require more extensive evaluation"
      ],
      faq: [
        { question: "Do febrile seizures cause brain damage?", answer: "No. Simple febrile seizures do NOT cause brain damage, intellectual disability, or developmental delay. Multiple large studies have followed children with febrile seizures for decades and found no adverse long-term neurodevelopmental outcomes. Children with simple febrile seizures have the same IQ, academic performance, and behavioral outcomes as children who never had febrile seizures. This is the most important message for parental reassurance." },
        { question: "Will the child develop epilepsy?", answer: "Simple febrile seizures carry a very small increased risk of epilepsy: approximately 1-2% (compared to 1% in the general population). Complex febrile seizures carry a slightly higher risk: 2-4%. Risk factors for developing epilepsy after febrile seizures: (1) complex features, (2) family history of epilepsy, (3) neurodevelopmental abnormalities before the seizure. The vast majority of children with febrile seizures (>95%) never develop epilepsy." }
      ],
      keywords: ["febrile seizure paramedic", "pediatric seizure management", "febrile convulsion treatment", "simple vs complex febrile seizure", "childhood fever seizure"],
      related: ["seizure-management", "pediatric-assessment-triangle", "meningitis", "pediatric-medication-dosing"]
    },

    {
      title: "Adrenal Crisis Management",
      category: "Medical Emergencies",
      overview: "Adrenal crisis (acute adrenal insufficiency) is a life-threatening endocrine emergency occurring in patients with adrenal insufficiency (Addison disease) or chronic steroid use who are subjected to physiological stress without adequate cortisol replacement. Without exogenous corticosteroids, these patients cannot mount the normal stress response, leading to cardiovascular collapse.",
      mechanism: "Cortisol is essential for maintaining vascular tone, cardiac contractility, and blood glucose during physiological stress. Patients with primary adrenal insufficiency (Addison disease) cannot produce cortisol. Patients on chronic exogenous steroids have suppressed hypothalamic-pituitary-adrenal (HPA) axis and cannot increase endogenous cortisol production. When stressed (infection, trauma, surgery), cortisol demand exceeds supply, causing vasodilation, hypotension, hypoglycemia, and shock.",
      clinicalRelevance: "Adrenal crisis is easily treated (IV steroids and fluids) but rapidly fatal if unrecognized. Paramedics must ask about steroid use and medical alert bracelets. Any patient on chronic steroids who presents with refractory hypotension should receive stress-dose steroids. The key question: 'Do you take any steroid medications?'",
      signsSymptoms: "Severe hypotension refractory to fluids and vasopressors (hallmark), weakness and fatigue, nausea, vomiting, abdominal pain, confusion or altered mental status, hypoglycemia, and fever (if triggered by infection). In Addison disease: hyperpigmentation of skin creases and mucous membranes (from elevated ACTH). Medical alert jewelry indicating adrenal insufficiency or steroid dependence.",
      assessment: "Ask about adrenal insufficiency, Addison disease, or chronic steroid use. Check for medical alert jewelry. Assess for precipitating stressor: infection, trauma, missed steroid doses. Blood glucose (hypoglycemia is common). Blood pressure (refractory hypotension). 12-lead ECG (hyperkalemia in primary adrenal insufficiency). Assess mental status.",
      management: "IV fluid resuscitation: NS 1-2 liter bolus (adults). Dextrose for hypoglycemia: D50 25-50 mL IV (adults) or D10 5 mL/kg (pediatric). Stress-dose hydrocortisone: 100 mg IV (adults), 2 mg/kg IV (pediatric) — if available. If hydrocortisone not available: dexamethasone 4 mg IV or methylprednisolone 125 mg IV. Vasopressors if hypotension persists despite fluids and steroids. Treat the precipitating cause. Rapid transport.",
      complications: "Cardiovascular collapse and death (if untreated), hyperkalemia with cardiac arrhythmias (primary adrenal insufficiency — lack of aldosterone), severe hypoglycemia, seizures, and multi-organ failure. Adrenal crisis mortality is 5-10% even with treatment, and approaches 100% without corticosteroid replacement.",
      pearls: [
        "Refractory hypotension + chronic steroid use = adrenal crisis until proven otherwise — give stress-dose steroids",
        "Always ask about steroid medications — patients may not connect their daily prednisone or hydrocortisone with the current emergency",
        "Adrenal crisis responds dramatically to IV corticosteroids — improvement in blood pressure can occur within 30-60 minutes",
        "Any physiological stressor (infection, trauma, surgery, severe illness) can precipitate crisis in adrenally insufficient patients"
      ],
      pitfalls: [
        "Not asking about chronic steroid use — this is the most common missed cause of refractory hypotension",
        "Treating hypotension with fluids and vasopressors alone — without cortisol replacement, adrenal crisis hypotension will not respond adequately",
        "Missing hypoglycemia — always check blood glucose in patients with adrenal insufficiency",
        "Assuming adrenal crisis only occurs in Addison disease patients — chronic steroid use for ANY condition (asthma, autoimmune disease, transplant) creates dependence"
      ],
      faq: [
        { question: "Who is at risk for adrenal crisis?", answer: "Patients at risk: (1) Primary adrenal insufficiency (Addison disease) — autoimmune destruction of the adrenal cortex. (2) Chronic steroid use — any patient taking prednisone, dexamethasone, hydrocortisone, or equivalent for >2-3 weeks (their HPA axis is suppressed). Common conditions requiring chronic steroids: asthma, COPD, rheumatoid arthritis, lupus, inflammatory bowel disease, and organ transplant recipients. (3) Recent steroid withdrawal — patients who abruptly stopped chronic steroids. (4) Secondary adrenal insufficiency — pituitary disease. Crisis is triggered by any physiological stress: infection, trauma, surgery, dehydration, or emotional distress." },
        { question: "What steroids can be given prehospitally?", answer: "If your service carries hydrocortisone: 100 mg IV is the ideal stress dose (it provides both glucocorticoid and mineralocorticoid effects). Alternatives: dexamethasone 4-10 mg IV (longer acting, no mineralocorticoid effect, does not interfere with ACTH stimulation testing at the hospital). Methylprednisolone 125 mg IV (commonly carried for spinal cord injury protocols, can be used for adrenal crisis). If no injectable steroids available: patient's own oral steroids (if they have them and can swallow) crushed and administered, plus aggressive IV fluids." }
      ],
      keywords: ["adrenal crisis paramedic", "acute adrenal insufficiency EMS", "Addison disease emergency", "steroid dependent patient", "stress dose steroids prehospital"],
      related: ["altered-mental-status", "hypoglycemia-management", "distributive-shock", "sepsis-identification"]
    },

    {
      title: "Vagal Maneuvers",
      category: "Cardiac Emergencies",
      overview: "Vagal maneuvers are non-pharmacological interventions that stimulate the vagus nerve, increasing parasympathetic tone and slowing conduction through the AV node. They are the first-line intervention for hemodynamically stable supraventricular tachycardia (SVT). Successful termination of SVT with vagal maneuvers avoids the need for adenosine or cardioversion.",
      mechanism: "The vagus nerve (CN X) provides parasympathetic innervation to the heart. Vagal stimulation releases acetylcholine at the SA and AV nodes, slowing conduction velocity and prolonging the refractory period. In SVT that uses the AV node as part of the reentrant circuit (AVNRT, AVRT), slowing AV nodal conduction can break the circuit and terminate the arrhythmia. The most effective technique is the modified Valsalva maneuver.",
      clinicalRelevance: "Vagal maneuvers are first-line for stable SVT and should be attempted before adenosine. The modified Valsalva maneuver (with passive leg raise) has a higher success rate (43%) than the standard Valsalva (17%). Success depends on proper technique and patient cooperation. Even when unsuccessful at terminating SVT, vagal maneuvers may transiently slow the rate, aiding rhythm diagnosis.",
      signsSymptoms: "Indications: hemodynamically stable narrow-complex SVT with regular rhythm and rate typically 150-250 bpm. Contraindications: hemodynamic instability, suspected atrial fibrillation or flutter, history of carotid stenosis or recent stroke (for carotid sinus massage), and acute coronary syndrome.",
      assessment: "Confirm the rhythm: narrow-complex, regular tachycardia (SVT). Assess hemodynamic stability: BP, mental status, perfusion. If unstable: proceed directly to synchronized cardioversion. If stable: attempt vagal maneuvers first. Obtain 12-lead ECG before and during the attempt (may reveal flutter waves or other diagnostic features when the rate transiently slows).",
      management: "Modified Valsalva maneuver (highest success rate): have the patient blow forcefully into a 10 mL syringe (creating sustained strain at approximately 40 mmHg) for 15 seconds, then immediately lay them flat and passively raise their legs to 45 degrees for 15 seconds. This augments the vagal response by increasing venous return and stimulating baroreceptors. May attempt 3 times before moving to adenosine. Ice to the face (diving reflex): apply a bag of ice to the forehead and bridge of the nose for 15-20 seconds. Carotid sinus massage: firm pressure over the carotid sinus (at the angle of the jaw) for 5-10 seconds on ONE side only — contraindicated in the elderly and those with carotid disease.",
      complications: "Rare from vagal maneuvers. Carotid sinus massage risks: stroke (from dislodging carotid plaque), bradycardia/asystole (excessive vagal response — treat with atropine). Valsalva: rare reports of retinal detachment or vitreous hemorrhage. Ice to face: may cause bradycardia in very young infants. Overall, vagal maneuvers are very safe when performed correctly.",
      pearls: [
        "The modified Valsalva with passive leg raise has DOUBLE the success rate (43%) compared to standard Valsalva (17%) — use this technique",
        "Have the patient blow into a syringe rather than just 'bearing down' — it ensures adequate and sustained intrathoracic pressure",
        "If vagal maneuvers briefly slow the rate but don't terminate the arrhythmia, record the ECG during the maneuver — the transiently revealed underlying rhythm aids diagnosis",
        "Vagal maneuvers are safe to attempt multiple times — try at least 3 attempts with the modified Valsalva before moving to adenosine"
      ],
      pitfalls: [
        "Using the standard Valsalva without leg raise — this has only a 17% success rate; the modified technique is significantly more effective",
        "Not having the patient sustain the strain long enough — the Valsalva effort must be maintained for a full 15 seconds",
        "Attempting carotid sinus massage in patients with carotid disease or elderly patients — risk of stroke from plaque embolization",
        "Attempting vagal maneuvers on an unstable patient — hemodynamic instability requires immediate cardioversion, not vagal maneuvers"
      ],
      faq: [
        { question: "How does the modified Valsalva maneuver work?", answer: "The modified Valsalva has two phases: (1) Strain phase: the patient blows hard into a 10 mL syringe (or bears down) for 15 seconds, generating approximately 40 mmHg of intrathoracic pressure. This raises intrathoracic pressure, reduces venous return, and initially decreases cardiac output. (2) Release phase: immediately after the strain, the patient is laid flat and their legs are passively raised to 45 degrees. This suddenly increases venous return to the heart, stretching the atria and stimulating baroreceptors, which trigger a robust vagal response. The combination of the post-strain vagal surge PLUS the enhanced venous return vagal response creates a stronger parasympathetic effect than either maneuver alone." },
        { question: "Why does ice to the face work?", answer: "Ice applied to the forehead and bridge of the nose triggers the mammalian diving reflex — an evolutionarily conserved response that prepares the body for underwater submersion. The diving reflex causes: (1) Vagal-mediated bradycardia — slowing the heart rate. (2) Peripheral vasoconstriction — shunting blood to vital organs. (3) Reduced cardiac output. This is the same reflex that allows mammals to survive extended underwater submersion. The trigeminal nerve (V1 — ophthalmic branch) detects cold on the face and triggers the vagal response. It is particularly effective in infants and children." }
      ],
      keywords: ["vagal maneuvers paramedic", "modified Valsalva technique", "SVT treatment non-pharmacological", "carotid sinus massage", "diving reflex"],
      related: ["supraventricular-tachycardia", "adenosine", "synchronized-cardioversion", "twelve-lead-ecg-interpretation"]
    },

    {
      title: "Acute Pulmonary Edema Management",
      category: "Cardiac Emergencies",
      overview: "Acute cardiogenic pulmonary edema (APE) is a life-threatening condition where fluid accumulates in the alveolar spaces due to elevated left ventricular filling pressures from heart failure. Patients present with acute dyspnea, crackles, and pink frothy sputum. Modern prehospital management with CPAP and nitroglycerin has dramatically reduced intubation rates and mortality.",
      mechanism: "Left ventricular failure (from ischemia, valve disease, hypertension, or cardiomyopathy) increases left atrial and pulmonary venous pressure. When pulmonary capillary hydrostatic pressure exceeds oncotic pressure, fluid transudates into the interstitium and then the alveoli. This impairs gas exchange, causing hypoxemia and respiratory distress. The sympathetic response (tachycardia, vasoconstriction) further increases afterload, worsening the cycle.",
      clinicalRelevance: "APE is one of the most dramatic and rewarding prehospital emergencies to treat — patients can go from near-death to comfortable with appropriate intervention. The three pillars of treatment are: (1) CPAP (reduces preload, afterload, and recruits alveoli), (2) Nitroglycerin (reduces preload and afterload), and (3) Positioning (upright decreases venous return).",
      signsSymptoms: "Severe dyspnea (often sudden onset), orthopnea (cannot lie flat), pink frothy sputum, diffuse bilateral crackles (often audible without a stethoscope), tachypnea, tachycardia, hypertension (usually — the sympathetic surge drives BP up), JVD, peripheral edema, diaphoresis, and anxiety/agitation (from hypoxemia). SpO2 often <90%.",
      assessment: "Auscultate lungs: diffuse bilateral crackles (distinguish from unilateral crackles of pneumonia). Assess JVD, peripheral edema. Blood pressure: usually elevated (>140 systolic). 12-lead ECG: look for ischemia, arrhythmia (atrial fibrillation is common). SpO2 and ETCO2. Ask about cardiac history: CHF, MI, valve disease. Assess medication compliance: missed diuretics, dietary indiscretion (salt intake).",
      management: "Sit the patient upright (reduces venous return). CPAP 5-10 cmH2O (first-line — reduces intubation rates by 50-75%). Nitroglycerin: 0.4 mg SL every 5 minutes (or consider high-dose NTG 400-800 mcg SL) if SBP >100 mmHg. IV access. Furosemide 40-80 mg IV (if patient takes it chronically — not first-line in acute setting). Morphine 2-4 mg IV (only if CPAP and NTG are insufficient — use cautiously as it can cause respiratory depression). Monitor continuously. Prepare for intubation if CPAP fails.",
      complications: "Respiratory failure requiring intubation, cardiogenic shock (if blood pressure drops — CPAP and NTG may be contraindicated), cardiac arrhythmias (from ischemia and hypoxemia), multi-organ failure, and death. APE with concurrent MI carries the worst prognosis. Flash pulmonary edema (sudden onset APE from acute severe hypertension) can be particularly dramatic.",
      pearls: [
        "CPAP + nitroglycerin together is more effective than either alone — use both early and aggressively in hypertensive APE",
        "High-dose nitroglycerin (repeated SL or IV drip) is the pharmacological cornerstone — it reduces preload AND afterload quickly",
        "Patients often improve dramatically within 10-15 minutes of CPAP — if no improvement, reconsider the diagnosis (pneumonia, ARDS, PE)",
        "Furosemide takes 15-30 minutes to work and its primary acute benefit is venodilation, not diuresis — CPAP and NTG are more important acutely"
      ],
      pitfalls: [
        "Giving morphine as first-line — morphine can cause respiratory depression, hypotension, and worse outcomes; use CPAP and NTG first",
        "Not using CPAP early — delays in CPAP application increase intubation rates",
        "Using CPAP with systolic BP <90 — CPAP reduces preload and can worsen hypotension in patients with cardiogenic shock",
        "Laying the patient flat for transport — keep the patient upright; supine positioning dramatically worsens pulmonary edema"
      ],
      faq: [
        { question: "How does CPAP help pulmonary edema?", answer: "CPAP helps through multiple mechanisms: (1) Positive pressure pushes alveolar fluid back into the pulmonary capillaries (restoring gas exchange). (2) Recruits collapsed alveoli (increasing surface area for gas exchange). (3) Increases intrathoracic pressure, which reduces venous return (preload reduction — decreases volume overload on the failing heart). (4) Reduces left ventricular transmural pressure (afterload reduction — improves cardiac output). (5) Reduces the work of breathing (the patient doesn't have to generate as much negative pressure to inhale). These combined effects produce rapid improvement, often within minutes." },
        { question: "When should you give high-dose nitroglycerin?", answer: "High-dose nitroglycerin (stacking 400 mcg SL every 2-5 minutes, or IV NTG drip starting at 50-100 mcg/min) is most appropriate in APE with hypertension (SBP >160). In this scenario, the elevated afterload is worsening the heart failure cycle. Aggressive NTG reduces both preload and afterload rapidly. Requirements: (1) SBP >100 mmHg (preferably >140). (2) No recent PDE-5 inhibitor use (sildenafil, tadalafil — causes severe hypotension). (3) Continuous blood pressure monitoring. The goal is NOT a specific BP target but clinical improvement: decreased work of breathing, improved SpO2, and patient comfort." }
      ],
      keywords: ["acute pulmonary edema paramedic", "flash pulmonary edema treatment", "CHF exacerbation management", "CPAP for pulmonary edema", "nitroglycerin heart failure"],
      related: ["congestive-heart-failure", "continuous-positive-airway-pressure", "nitroglycerin", "cardiogenic-shock"]
    },

    {
      title: "Submersion Injury and Drowning",
      category: "Environmental Emergencies",
      overview: "Drowning is a leading cause of accidental death, especially in children under 5 and adolescent males. The pathophysiology centers on aspiration of water causing surfactant washout, alveolar collapse, and ventilation-perfusion mismatch. Modern drowning management focuses on early aggressive oxygenation and ventilation, as drowning cardiac arrest is primarily hypoxic in origin.",
      mechanism: "Submersion in water causes either voluntary breath-holding followed by aspiration, or laryngospasm followed by aspiration when the spasm relaxes. Aspirated water washes out surfactant, causes alveolar collapse, and disrupts the alveolar-capillary membrane. Fresh water is rapidly absorbed into the pulmonary vasculature; salt water draws fluid into the alveoli (osmotic effect). Both cause severe ventilation-perfusion mismatch and hypoxemia. Hypothermia from cold water submersion may provide some neuroprotection.",
      clinicalRelevance: "Drowning cardiac arrest is a hypoxic arrest — the treatment priority is OXYGENATION and VENTILATION before chest compressions (opposite to the standard C-A-B sequence). The modified drowning arrest sequence is A-B-C (Airway, Breathing, Compressions). Cold water submersion may allow survival after prolonged submersion due to hypothermia-induced neuroprotection, especially in children.",
      signsSymptoms: "Coughing, choking, vomiting, tachypnea, crackles, wheezing, hypoxemia (SpO2 <94%), altered mental status, and hypothermia. Severe: apnea, pulselessness, cyanosis, and fixed dilated pupils. Spectrum ranges from asymptomatic (rescued early) to cardiac arrest. All submersion victims can deteriorate hours later (delayed pulmonary edema — 'secondary drowning').",
      assessment: "Determine submersion time and water temperature (cold water improves survival, especially in children). Assess respiratory status: rate, effort, SpO2, auscultation. Check temperature (hypothermia). C-spine precautions if diving injury suspected. Assess mental status. Determine whether bystander CPR was performed. All symptomatic submersion victims need hospital evaluation — even those who appear to recover can develop delayed pulmonary edema.",
      management: "Remove from water with C-spine precautions if diving mechanism. If not breathing: begin rescue breathing immediately (even in the water if trained). For cardiac arrest: 5 rescue breaths first, then standard CPR (drowning is a hypoxic arrest — ventilation is the priority). High-flow oxygen. BVM ventilation. Intubation if needed. Suction as needed. Active rewarming if hypothermic. IV access. Transport all symptomatic patients. Do NOT attempt to drain water from the lungs (Heimlich maneuver is NOT indicated for drowning).",
      complications: "Aspiration pneumonia, ARDS, pulmonary edema (immediate or delayed — up to 24 hours), hypoxic brain injury (most devastating non-fatal complication), hypothermia, cervical spine injury (diving), and death. Delayed pulmonary edema ('secondary drowning') can develop hours after the event in patients who initially appeared well.",
      pearls: [
        "Drowning arrest is HYPOXIC — prioritize ventilation (A-B-C not C-A-B); give 5 rescue breaths before starting compressions",
        "Cold water submersion victims should receive prolonged resuscitation — hypothermia provides neuroprotection; 'They're not dead until they're warm and dead'",
        "ALL symptomatic submersion victims should be transported — delayed pulmonary edema can develop hours later even in patients who seem to recover",
        "The Heimlich maneuver does NOT drain water from the lungs — it wastes time and causes vomiting/aspiration; ventilate instead"
      ],
      pitfalls: [
        "Using the standard C-A-B sequence — drowning arrest is hypoxic; start with ventilation (A-B-C); 5 rescue breaths then CPR",
        "Pronouncing cold water drowning victims in the field — hypothermia provides neuroprotection; continue resuscitation until rewarmed at the hospital",
        "Releasing asymptomatic submersion victims without transport — delayed pulmonary edema can develop hours later",
        "Performing the Heimlich maneuver to 'drain water' — this delays ventilation and causes gastric aspiration"
      ],
      faq: [
        { question: "What is secondary drowning?", answer: "Secondary drowning (more accurately called delayed pulmonary edema) occurs when aspirated water damages the alveolar-capillary membrane and washes out surfactant. Initially, the patient may cough, appear to recover, and seem well. Over the next 2-24 hours, progressive alveolar edema and atelectasis develop, causing worsening hypoxemia, increased work of breathing, and potentially respiratory failure. This is why ALL symptomatic submersion victims — even those who seem to recover at the scene — should be transported to the hospital for observation." },
        { question: "Why does cold water improve survival?", answer: "Cold water (especially <15°C/59°F) rapidly cools the brain and body, reducing metabolic demand by approximately 7% per degree Celsius of temperature drop. This dramatically extends the brain's tolerance to anoxia. At normal body temperature, irreversible brain injury begins after 4-6 minutes of anoxia. With hypothermia, the brain may tolerate 30-60+ minutes of submersion, especially in children (who cool faster due to higher surface-area-to-mass ratio). There are documented cases of neurologically intact survival after >60 minutes of cold water submersion in children." }
      ],
      keywords: ["drowning management paramedic", "submersion injury treatment", "near drowning EMS", "cold water drowning resuscitation", "secondary drowning"],
      related: ["hypothermia", "cardiac-arrest-management", "bag-valve-mask-ventilation", "pediatric-cardiac-arrest"]
    },

    {
      title: "Pregnancy-Related Hypertensive Emergencies",
      category: "OB/GYN Emergencies",
      overview: "Hypertensive disorders of pregnancy (preeclampsia, eclampsia, HELLP syndrome) are major causes of maternal and fetal morbidity and mortality. Preeclampsia is defined as new-onset hypertension (>140/90) with proteinuria or end-organ damage after 20 weeks gestation. Eclampsia is the development of seizures in a preeclamptic patient. These are obstetric emergencies requiring magnesium sulfate and urgent transport.",
      mechanism: "Abnormal placental implantation leads to placental hypoperfusion and release of antiangiogenic factors, causing widespread maternal endothelial dysfunction. This manifests as hypertension (vasospasm), proteinuria (glomerular damage), edema (capillary leak), hepatic dysfunction (periportal necrosis), thrombocytopenia (endothelial activation), and cerebral edema (seizures). The definitive treatment is delivery of the placenta.",
      clinicalRelevance: "Preeclampsia and eclampsia are time-critical emergencies. Eclamptic seizures are life-threatening to both mother and fetus. Magnesium sulfate is the specific treatment for seizure prevention and treatment in eclampsia — it is more effective than benzodiazepines or phenytoin for this indication. Paramedics must recognize the signs and initiate treatment.",
      signsSymptoms: "Preeclampsia: hypertension (>140/90 after 20 weeks), headache, visual changes (blurred vision, scotomata, photopsia), right upper quadrant pain (hepatic capsule distension), edema (especially facial and hands), hyperreflexia, and epigastric pain. Severe preeclampsia: BP >160/110, severe headache, visual changes, liver tenderness, and oliguria. Eclampsia: generalized tonic-clonic seizures in a preeclamptic patient.",
      assessment: "Blood pressure in both arms. Assess for headache, visual changes, RUQ pain, and edema. Assess reflexes (hyperreflexia suggests worsening preeclampsia). Determine gestational age. Assess fetal heart tones if possible. Check for signs of HELLP syndrome: right upper quadrant tenderness (Hemolysis, Elevated Liver enzymes, Low Platelets). Assess mental status. Assess urine output.",
      management: "Seizure prophylaxis/treatment: magnesium sulfate 4-6 g IV over 15-20 minutes (loading dose), then 1-2 g/hour maintenance infusion. Blood pressure management: labetalol 10-20 mg IV (preferred — does not reduce uteroplacental perfusion) or hydralazine 5-10 mg IV. Target BP: 140-160/90-100 (do NOT lower BP too aggressively — may compromise uteroplacental perfusion). If actively seizing: magnesium sulfate as above; if MgSO4 not available, benzodiazepine as bridge. Left lateral decubitus positioning (improves venous return). Rapid transport to facility with obstetric and neonatal capabilities.",
      complications: "Eclamptic seizures (maternal and fetal hypoxia), HELLP syndrome (hemolysis, liver rupture, DIC), placental abruption (hypertension damages placental attachment), fetal distress, cerebral hemorrhage (from severe hypertension), pulmonary edema, renal failure, and maternal/fetal death. Postpartum eclampsia can occur up to 6 weeks after delivery.",
      pearls: [
        "Magnesium sulfate is the SPECIFIC treatment for eclamptic seizures — it is more effective than benzodiazepines or phenytoin for this indication",
        "New-onset headache + visual changes + hypertension in a pregnant patient after 20 weeks = preeclampsia until proven otherwise",
        "Do NOT lower blood pressure too aggressively — uteroplacental perfusion depends on adequate maternal BP; target 140-160/90-100",
        "Eclampsia can occur POSTPARTUM — up to 6 weeks after delivery; always consider in a postpartum patient with seizures"
      ],
      pitfalls: [
        "Using benzodiazepines instead of magnesium sulfate for eclamptic seizures — magnesium is the specific, evidence-based treatment",
        "Aggressively lowering blood pressure below 120/80 — this compromises uteroplacental perfusion and threatens the fetus",
        "Not monitoring for magnesium toxicity — check respiratory rate (>12/min), patellar reflexes (should be present), and have calcium gluconate available for reversal",
        "Assuming eclampsia only occurs before delivery — postpartum eclampsia can present up to 6 weeks after birth"
      ],
      faq: [
        { question: "How does magnesium sulfate prevent seizures?", answer: "The mechanism is not fully understood, but magnesium: (1) Causes cerebral vasodilation, counteracting the vasospasm that causes cerebral ischemia and edema. (2) Raises the seizure threshold by blocking NMDA receptors (excitatory neurotransmission). (3) Reduces endothelial injury and inflammation. (4) Decreases calcium entry into neurons (stabilizing neuronal membranes). The MAGPIE trial showed magnesium sulfate reduces eclampsia risk by 58% compared to placebo and is superior to both diazepam and phenytoin for seizure prevention. Therapeutic range: 4-8 mg/dL. Toxicity signs: loss of patellar reflexes (8-12 mg/dL), respiratory depression (12-15 mg/dL), cardiac arrest (>15 mg/dL)." },
        { question: "What is HELLP syndrome?", answer: "HELLP is a severe variant of preeclampsia standing for: H = Hemolysis (destruction of red blood cells), EL = Elevated Liver enzymes (hepatocellular damage), LP = Low Platelets (consumption by endothelial damage). It occurs in 10-20% of severe preeclampsia cases. Symptoms: right upper quadrant pain, nausea, vomiting, malaise (often misdiagnosed as gastritis or viral illness). Complications include DIC, liver rupture (subcapsular hematoma), placental abruption, and maternal death. Treatment is delivery. HELLP can occur without significant hypertension or proteinuria, making diagnosis challenging." }
      ],
      keywords: ["preeclampsia paramedic", "eclampsia management EMS", "magnesium sulfate pregnancy", "pregnancy hypertension emergency", "HELLP syndrome"],
      related: ["emergency-childbirth", "seizure-management", "postpartum-hemorrhage", "magnesium-sulfate"]
    },

    {
      title: "Tracheostomy Emergencies",
      category: "Airway Management",
      overview: "Tracheostomy emergencies occur in patients with surgical airways who experience obstruction, decannulation, or bleeding from their tracheostomy tube. These are increasingly common as more patients with chronic tracheostomies live in the community. Paramedics must be proficient in tracheostomy troubleshooting, as these patients cannot breathe through their upper airway in most cases.",
      mechanism: "A tracheostomy creates a direct surgical opening into the trachea below the level of the vocal cords. The stoma matures over 5-7 days. Fresh tracheostomies (<7 days) that become dislodged are emergencies because the tract has not matured and may close rapidly. Mature tracheostomies (>7 days) maintain their tract longer. Common emergencies: mucus plugging (most common), decannulation (tube falls out), bleeding (from granulation tissue or vessel erosion), and false passage (tube placed into pretracheal tissue).",
      clinicalRelevance: "Tracheostomy emergencies can be immediately life-threatening. Many tracheostomy patients CANNOT breathe through their upper airway (due to laryngeal tumors, tracheal stenosis, or bilateral vocal cord paralysis). If the tracheostomy is obstructed or dislodged, these patients have NO airway. The paramedic must know how to troubleshoot and replace tracheostomy tubes.",
      signsSymptoms: "Obstruction: acute respiratory distress, noisy breathing through the tracheostomy, inability to pass suction catheter through the tube, and desaturation. Decannulation: tube is visibly out of the stoma, respiratory distress, and air leaking from the stoma. Bleeding: blood from or around the tracheostomy (minor bleeding from granulation tissue is common; massive hemorrhage from tracheo-innominate artery fistula is rare but rapidly fatal).",
      assessment: "Assess respiratory status and SpO2. Determine the type of emergency: obstruction, decannulation, or bleeding. Ask caregivers about the tracheostomy: when was it placed, why, what size tube, does the patient have a spare tube, can the patient breathe through their nose/mouth at all? Check if an inner cannula is present (removing and cleaning it may solve the obstruction). Attempt to pass suction catheter (if it passes easily, the tube is patent).",
      management: "Obstruction: (1) Remove the inner cannula (if present — this is the first step). (2) Attempt suctioning through the tracheostomy tube. (3) If still obstructed: remove the tracheostomy tube entirely. (4) Replace with same-size or smaller tracheostomy tube, or insert ETT (6.0 typically fits adult stomas). (5) If replacement fails: ventilate through the stoma using BVM with infant mask or cover stoma and ventilate through mouth/nose. Decannulation: replace the tube; if unable, ventilate through the stoma. Bleeding: suction, apply pressure, transport emergently.",
      complications: "Complete airway obstruction and death (if tracheostomy obstruction is not resolved), false passage (tube placed into pretracheal tissue — no air entry, subcutaneous emphysema), tracheo-innominate artery fistula (massive hemorrhage — 80% mortality), and aspiration. Fresh tracheostomy emergencies (<7 days) have higher complication rates because the tract has not matured.",
      pearls: [
        "Remove the inner cannula FIRST in any tracheostomy obstruction — this takes 2 seconds and resolves the problem in many cases",
        "If you cannot replace the tracheostomy tube, insert a standard ETT (6.0 for adults) through the stoma — it fits most mature stomas",
        "If you cannot ventilate through the stoma, cover the stoma and attempt BVM ventilation through the mouth and nose — this works if the upper airway is patent",
        "Always bring suction to a tracheostomy call — mucus plugging is the most common tracheostomy emergency"
      ],
      pitfalls: [
        "Not removing the inner cannula first — this is the simplest fix and resolves many tracheostomy obstructions",
        "Forcing a tracheostomy tube into a fresh stoma (<7 days) — the tract is immature and the tube can create a false passage into pretracheal tissue",
        "Not asking if the patient can breathe through their nose/mouth — some tracheostomy patients have a patent upper airway; if so, you can ventilate through the mouth if stoma ventilation fails",
        "Panicking with tracheostomy emergencies — follow a systematic approach: inner cannula removal, suction, tube replacement, alternative ventilation"
      ],
      faq: [
        { question: "What is the difference between fresh and mature tracheostomies?", answer: "Fresh tracheostomy (<7 days): the tract between the skin and trachea has not yet formed a mature epithelialized channel. If the tube is dislodged, the tract can close rapidly, making reinsertion difficult and dangerous (risk of false passage into pretracheal tissue). In an emergency: do NOT force reinsertion; cover the stoma and ventilate through the mouth/nose if possible; call for advanced help. Mature tracheostomy (>7 days): the tract is well-established and epithelialized. The tube can usually be reinserted through the existing tract. Use a smaller tube or ETT if the original tube won't reinsert." },
        { question: "How do you ventilate a patient with a tracheostomy?", answer: "Three approaches in order: (1) Through the tracheostomy tube: attach BVM directly to the 15mm connector on the tracheostomy tube and ventilate normally. If the tube is a cuffed tracheostomy, inflate the cuff to prevent air leak. (2) Through the stoma: if the tube is removed, place an infant BVM mask directly over the stoma and ventilate through the stoma. Alternatively, insert an ETT through the stoma. (3) Through the mouth/nose: if stoma ventilation fails, cover the stoma with a gloved hand and attempt standard BVM ventilation through the mouth and nose. This only works if the patient has a patent upper airway (some do, some don't — ask caregivers)." }
      ],
      keywords: ["tracheostomy emergency paramedic", "tracheostomy obstruction management", "decannulation emergency", "trach tube replacement", "stoma ventilation"],
      related: ["airway-obstruction-management", "bag-valve-mask-ventilation", "orotracheal-intubation", "suctioning-techniques"]
    },

    {
      title: "Organophosphate Poisoning",
      category: "Toxicology",
      overview: "Organophosphate (OP) poisoning results from exposure to pesticides (malathion, parathion) or nerve agents (sarin, VX). OPs irreversibly inhibit acetylcholinesterase, causing accumulation of acetylcholine at muscarinic and nicotinic receptors. This produces a characteristic cholinergic toxidrome: SLUDGE (Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis) plus muscle fasciculations, miosis, and bronchospasm.",
      mechanism: "Organophosphates phosphorylate the active site of acetylcholinesterase, irreversibly inactivating the enzyme. Acetylcholine accumulates at both muscarinic receptors (parasympathetic effects: SLUDGE, bronchospasm, bradycardia) and nicotinic receptors (muscle fasciculations, weakness, paralysis). Death occurs from respiratory failure: combination of bronchospasm, excessive secretions, and respiratory muscle paralysis. Without treatment, aging of the phosphorylated enzyme makes the inhibition permanent.",
      clinicalRelevance: "OP poisoning is both a common agricultural exposure and a potential mass-casualty weapon (nerve agents). Paramedics must recognize the cholinergic toxidrome, protect themselves from secondary contamination, and administer large doses of atropine. The principle: 'atropinize aggressively' — these patients need far more atropine than standard dosing.",
      signsSymptoms: "SLUDGE/DUMBELS: Salivation, Lacrimation, Urination, Defecation, GI cramping, Emesis. Also: miosis (pinpoint pupils), bronchospasm and bronchorrhea (copious secretions), bradycardia, diaphoresis, muscle fasciculations, weakness progressing to paralysis, seizures, and altered mental status. The characteristic garlic-like odor may be present. Respiratory failure is the cause of death.",
      assessment: "Scene safety FIRST — decontamination before treatment. Determine exposure route: dermal, inhalation, or ingestion. Assess respiratory status (bronchospasm, secretions, respiratory effort). Pupil size (miosis). Heart rate (bradycardia). Secretions (excessive salivation, tearing, bronchorrhea). Muscle fasciculations. Mental status. If mass-casualty nerve agent exposure: initiate CHEMPACK protocols.",
      management: "Decontaminate: remove clothing (removes 80% of dermal exposure), wash with soap and water. PPE: minimum Level C (chemical-resistant gloves, splash protection). Atropine: 2-4 mg IV every 5 minutes until secretions dry (the endpoint is dry lungs, NOT pupil size or heart rate). Large doses may be needed (20-100+ mg total for severe poisoning). Pralidoxime (2-PAM): 1-2 g IV over 15-30 minutes (reactivates acetylcholinesterase if given before aging — ideally within 24-48 hours). Benzodiazepines for seizures (diazepam 5-10 mg IV). Intubation if respiratory failure (use non-depolarizing paralytic — succinylcholine is contraindicated).",
      complications: "Respiratory failure and death (untreated), intermediate syndrome (muscle weakness recurring 1-4 days after apparent recovery), delayed neuropathy (2-3 weeks post-exposure), seizures, arrhythmias, aspiration, and PTSD. Secondary contamination of rescuers and hospital staff is a significant risk. Long-term neurological and psychological effects are common in survivors.",
      pearls: [
        "Atropinize to DRY LUNGS, not to a specific dose — these patients may need 20-100+ mg of atropine total; bronchorrhea kills",
        "The endpoint for atropine is drying of secretions, NOT pupil size or heart rate — pupils may remain miotic despite adequate atropinization",
        "PPE is essential — secondary contamination of rescuers is a real risk, especially from patient clothing and vomitus",
        "Succinylcholine is CONTRAINDICATED — organophosphates inhibit plasma cholinesterases that metabolize succinylcholine, causing prolonged paralysis"
      ],
      pitfalls: [
        "Under-dosing atropine — standard doses (0.5-1 mg) are completely inadequate; these patients need 2-4 mg every 5 minutes until secretions clear",
        "Using pupil size as the endpoint for atropine dosing — the endpoint is drying of pulmonary secretions; pupils may stay miotic",
        "Not decontaminating before treatment — rescuers and ambulances become contaminated from patient's clothing and skin",
        "Using succinylcholine for RSI — OP patients cannot metabolize succinylcholine, leading to prolonged (hours) paralysis; use rocuronium instead"
      ],
      faq: [
        { question: "Why do these patients need so much atropine?", answer: "In OP poisoning, acetylcholine is massively accumulated at every muscarinic receptor in the body because the enzyme that breaks it down (acetylcholinesterase) is irreversibly inhibited. Atropine must competitively block ALL of this accumulated acetylcholine at ALL muscarinic receptors. Standard dosing (0.5-1 mg) is designed for therapeutic vagolysis — not for competing with a massive acetylcholine excess. Severe OP poisoning may require 20-100+ mg of atropine in the first few hours. The endpoint is clinical: once the lungs are dry (bronchorrhea cleared), the dose is adequate. Under-dosing atropine is the most common treatment error." },
        { question: "What is pralidoxime and when should it be given?", answer: "Pralidoxime (2-PAM) directly reactivates the inhibited acetylcholinesterase enzyme by cleaving the organophosphate from the enzyme's active site. It must be given before the OP-enzyme bond undergoes 'aging' — a process where the bond becomes irreversible (timing varies by agent: sarin ages in hours, VX in days). 2-PAM addresses both muscarinic AND nicotinic effects (atropine only addresses muscarinic). It is most effective when given within 24-48 hours of exposure. Dose: 1-2 g IV over 15-30 minutes. 2-PAM is particularly important for treating the nicotinic effects (muscle fasciculations, weakness, paralysis) that atropine cannot address." }
      ],
      keywords: ["organophosphate poisoning paramedic", "nerve agent exposure treatment", "atropine cholinergic crisis", "SLUDGE toxidrome", "pralidoxime administration"],
      related: ["hazmat-decontamination", "mass-casualty-incident-triage", "seizure-management", "respiratory-failure-management"]
    },

    {
      title: "Pediatric Dehydration Assessment",
      category: "Pediatric Emergencies",
      overview: "Dehydration is one of the most common pediatric emergencies, typically caused by gastroenteritis (vomiting and diarrhea), but also by diabetic ketoacidosis, burns, and reduced oral intake. Children are more susceptible to dehydration than adults due to higher body surface area-to-mass ratio, higher metabolic rate, and dependence on caregivers for fluid intake. Assessment of dehydration severity guides treatment.",
      mechanism: "Water loss exceeds intake, causing progressive hypovolemia. Children have higher daily fluid requirements per kilogram than adults (100 mL/kg/day for first 10 kg). Vomiting and diarrhea cause rapid loss of water and electrolytes (sodium, potassium, bicarbonate). As dehydration progresses: mild (3-5% weight loss) causes thirst and decreased urine output; moderate (6-9%) causes clinical signs of hypovolemia; severe (>10%) causes cardiovascular compromise and shock.",
      clinicalRelevance: "Children compensate for volume loss better than adults initially (maintaining blood pressure until decompensation), but they deteriorate rapidly once compensatory mechanisms are overwhelmed. The paramedic must recognize dehydration severity and intervene early. Severe dehydration in children is a medical emergency requiring IV/IO fluid resuscitation.",
      signsSymptoms: "Mild (3-5%): slightly decreased urine output, slightly dry mucous membranes, increased thirst. Moderate (6-9%): sunken eyes, sunken fontanelle (infants), decreased skin turgor (tenting), dry mucous membranes, decreased urine output, tachycardia, normal-to-low blood pressure. Severe (>10%): mottled or cool extremities, markedly decreased skin turgor, absent tears, severely sunken eyes/fontanelle, minimal or no urine output, tachycardia, hypotension, altered mental status, lethargy or listlessness.",
      assessment: "Assess dehydration severity using clinical signs: mental status (irritable = moderate; lethargic = severe), eyes (sunken = moderate-severe), mucous membranes (dry = moderate; parched = severe), skin turgor (pinch abdominal skin — immediate recoil = normal; slow recoil = moderate; tenting = severe), capillary refill (>3 seconds = concerning), fontanelle in infants (sunken = moderate-severe), and heart rate (tachycardia = compensating for hypovolemia). Weigh the child if possible.",
      management: "Mild: oral rehydration solution (ORS) if tolerated — small, frequent sips (5 mL every 1-2 minutes). Moderate: ORS if tolerated; if vomiting prevents oral intake, IV NS 20 mL/kg bolus. Severe: IV or IO NS 20 mL/kg bolus (may repeat up to 3 times for a total of 60 mL/kg). Reassess after each bolus. For DKA-related dehydration: NS 20 mL/kg then more cautious rehydration (risk of cerebral edema). Monitor blood glucose. Monitor for signs of fluid overload (crackles, JVD).",
      complications: "If untreated: hypovolemic shock, organ failure, and death. From treatment: fluid overload, cerebral edema (especially in DKA), and electrolyte imbalances. Hypernatremic dehydration requires careful, gradual rehydration (rapid correction can cause cerebral edema). Hypokalemia from prolonged diarrhea can cause cardiac arrhythmias.",
      pearls: [
        "Mental status is the most important clinical indicator of dehydration severity — an irritable child is moderately dehydrated; a lethargic child is severely dehydrated",
        "Sunken fontanelle in an infant is a reliable sign of moderate-severe dehydration — parents often notice this before other signs",
        "Capillary refill >3 seconds in a normothermic child indicates significant hypovolemia — this is a rapid, reliable bedside test",
        "Tachycardia is the EARLIEST vital sign change in pediatric dehydration — hypotension is a LATE and ominous finding"
      ],
      pitfalls: [
        "Relying on blood pressure to assess dehydration — children maintain blood pressure until they are severely hypovolemic; tachycardia is the earlier indicator",
        "Not reassessing after fluid boluses — each 20 mL/kg bolus should produce clinical improvement; if not, reassess the diagnosis",
        "Rapid rehydration of hypernatremic dehydration — this can cause cerebral edema; if hypernatremia is suspected, rehydrate more slowly",
        "Not considering DKA as a cause of dehydration — always check blood glucose in a dehydrated child"
      ],
      faq: [
        { question: "How do you assess skin turgor?", answer: "Pinch a fold of skin on the abdomen (between the umbilicus and the flank) between your thumb and forefinger, hold for 2 seconds, then release. Normal: the skin snaps back immediately. Moderate dehydration: the skin returns slowly (>2 seconds). Severe dehydration: the skin remains 'tented' — it stays pinched up for several seconds. Important caveats: skin turgor is less reliable in obese children (more subcutaneous tissue) and in malnourished children (less tissue). The abdomen is the most reliable site; don't test on the dorsum of the hand (less reliable in children)." },
        { question: "How much fluid should be given for severe dehydration?", answer: "Severe dehydration: NS 20 mL/kg IV or IO as a rapid bolus (infuse over 10-20 minutes). Reassess after each bolus (heart rate, capillary refill, mental status). May repeat up to 3 times (total 60 mL/kg) in the first hour. For a 10 kg child: 200 mL per bolus. For a 20 kg child: 400 mL per bolus. If no improvement after 60 mL/kg: consider other causes of shock (sepsis, hemorrhage, cardiogenic) and reassess. For DKA: first bolus is 20 mL/kg NS, then slow to 10 mL/kg/hour and avoid additional boluses (cerebral edema risk)." }
      ],
      keywords: ["pediatric dehydration paramedic", "child dehydration assessment", "infant dehydration signs", "IV fluid resuscitation pediatric", "gastroenteritis dehydration"],
      related: ["pediatric-assessment-triangle", "hypovolemic-shock-management", "diabetic-ketoacidosis", "pediatric-vital-signs"]
    },

    {
      title: "Field Amputation Considerations",
      category: "Operations & Triage",
      overview: "Field amputation is an extremely rare last-resort procedure performed when a patient is entrapped by a body part and the entrapment is life-threatening, all other extrication methods have failed, and the patient will die without the amputation. It is almost exclusively performed in structural collapse, industrial entrapment, or MVC scenarios where mechanical extrication is impossible and the patient is deteriorating.",
      mechanism: "Entrapment occurs when a body part (usually an extremity) is pinned by heavy objects (collapsed structures, machinery, vehicles) and cannot be freed by conventional rescue techniques. The patient may be developing crush syndrome, hemorrhagic shock from other injuries, or environmental exposure. When the entrapping object cannot be removed and the patient's condition is deteriorating, field amputation becomes the only option to save the patient's life.",
      clinicalRelevance: "Field amputation is vanishingly rare — most paramedics will never perform one. However, the decision-making process, preparation, and technique should be understood. The decision requires medical command consultation, clear documentation, and recognition that all other options have been exhausted. It is never performed for convenience or to speed up extrication when the patient is stable.",
      signsSymptoms: "Indications (ALL must be present): (1) Patient is entrapped by a body part. (2) The entrapment is life-threatening (patient is deteriorating — worsening shock, respiratory failure, or the scene is becoming unsafe). (3) All mechanical extrication methods have been attempted and failed. (4) Medical command has been consulted and agrees. (5) The entrapped limb is non-viable (crushed, no circulation, clearly unsalvageable).",
      assessment: "Assess the patient's overall condition and trajectory (stable or deteriorating). Assess the entrapped limb (viable vs non-viable). Coordinate with rescue teams to confirm all mechanical extrication options are exhausted. Consult medical command. Ensure adequate IV access, pain management, and sedation are in place before proceeding. Prepare tourniquets (apply proximal to planned amputation site before the procedure).",
      management: "Pre-amputation: large-bore IV access (ideally two), aggressive fluid resuscitation, pain management (ketamine dissociative dose: 1-2 mg/kg IV for sedation and analgesia), tourniquet applied proximal to the amputation site and tightened before cutting. The amputation itself requires surgical instruments and is typically performed by a physician (in some systems, specially trained paramedics). Post-amputation: hemorrhage control, continued fluid resuscitation, rapid transport. Preserve the amputated part if safely retrievable.",
      complications: "Hemorrhage (even with tourniquet), incomplete amputation (requiring additional cutting), fat embolism, psychological trauma to the patient and rescuers, crush syndrome from reperfusion of proximal tissues, and failed procedure. Post-procedure: infection, phantom limb pain, and prosthetic fitting challenges. Critical incident stress debriefing is essential for all involved providers.",
      pearls: [
        "Field amputation is a LAST RESORT — it is only considered after all mechanical extrication methods have failed AND the patient is deteriorating",
        "Apply and tighten the tourniquet BEFORE the amputation — hemorrhage control must be established before the limb is cut",
        "Ketamine is the ideal agent for field amputation — it provides dissociative analgesia and maintains hemodynamic stability and airway reflexes",
        "Medical command consultation and approval are required — this is not a unilateral field decision"
      ],
      pitfalls: [
        "Performing field amputation when the patient is stable — if the patient is not deteriorating, there is time for more extrication attempts",
        "Not applying a tourniquet before the amputation — this results in catastrophic hemorrhage during the procedure",
        "Not providing adequate sedation and analgesia — the patient is conscious unless sedated; this is an excruciatingly painful procedure",
        "Not preparing for crush syndrome — reperfusion of tissue proximal to the entrapment releases toxins similar to crush injury extrication"
      ],
      faq: [
        { question: "How rare is field amputation?", answer: "Extremely rare. Most career paramedics will never perform or assist with a field amputation. Large urban EMS systems may see one every several years at most. The rarity reflects the success of modern rescue techniques (hydraulic rescue tools, airbags, cutting tools, and heavy equipment) in freeing entrapped patients without amputation. When field amputation is performed, it is almost always in structural collapse (earthquake, building collapse) or industrial entrapment scenarios where heavy objects cannot be moved and the patient cannot be accessed for mechanical extrication." },
        { question: "Who performs field amputation?", answer: "In most EMS systems, field amputation is performed by a physician (emergency medicine, trauma surgery, or orthopedic surgery) who responds to the scene. Some systems train specially designated paramedics for this procedure. The decision chain typically involves: (1) Field paramedics recognize the need and initiate the request. (2) Medical command is consulted and approves. (3) A physician (or specially trained provider) responds to perform the procedure. (4) The paramedic team provides sedation, hemorrhage control, fluid resuscitation, and post-procedure care. This team approach ensures appropriate expertise at each step." }
      ],
      keywords: ["field amputation paramedic", "entrapment rescue amputation", "last resort extrication", "crush entrapment management", "emergency amputation"],
      related: ["crush-injury-and-crush-syndrome", "tourniquet-application", "hemorrhagic-shock", "mass-casualty-incident-triage"]
    },

    {
      title: "Tactical Emergency Medical Support",
      category: "Operations & Triage",
      overview: "Tactical Emergency Medical Support (TEMS) integrates emergency medical care into law enforcement tactical operations (SWAT, active shooter response). TEMS providers (tactical medics) deliver medical care in high-threat environments where standard EMS cannot safely operate. The Tactical Emergency Casualty Care (TECC) guidelines provide a civilian framework adapted from military Tactical Combat Casualty Care (TCCC).",
      mechanism: "TECC divides care into three phases based on threat level: (1) Direct Threat Care (hot zone — under active fire): only interventions that prevent immediate death AND can be performed while under fire (tourniquet for life-threatening hemorrhage, move to cover). (2) Indirect Threat Care (warm zone — threat not eliminated but not directly under fire): hemorrhage control, airway management, chest seals, basic medical care. (3) Evacuation Care (cold zone — no threat): comprehensive medical care comparable to standard EMS protocols.",
      clinicalRelevance: "Active shooter and mass-casualty violence events have made TECC concepts relevant to all EMS providers, not just dedicated TEMS teams. The Hartford Consensus and 'Stop the Bleed' campaign emphasize that hemorrhage control by the nearest capable individual saves lives. Understanding the hot/warm/cold zone framework is essential for modern EMS response to violent incidents.",
      signsSymptoms: "Common injuries in tactical scenarios: gunshot wounds (most common), blast injuries, stab wounds, blunt trauma, and environmental exposure. Hemorrhage is the leading cause of preventable death — 90% of preventable tactical deaths are from hemorrhage, most from extremity wounds amenable to tourniquet application.",
      assessment: "HOT ZONE: minimal assessment — primary threat is ongoing violence. Determine if the casualty is alive. Identify life-threatening hemorrhage. The only intervention is tourniquet for extremity hemorrhage. WARM ZONE: rapid trauma assessment focused on hemorrhage, airway, and breathing. COLD ZONE: comprehensive assessment per standard protocols.",
      management: "HOT ZONE: self-aid and buddy-aid. Tourniquet for extremity hemorrhage. Move to cover. WARM ZONE: tourniquet reassessment, wound packing with hemostatic gauze for junctional hemorrhage, chest seals for penetrating chest wounds, airway management (NPA if unconscious — avoid intubation in the warm zone), and staged evacuation. COLD ZONE: full ALS assessment and management, definitive hemorrhage control, IV access, fluid resuscitation, pain management, and transport.",
      complications: "Delayed care (inherent to tactical scenarios — patients wait longer for treatment), provider injury (operating in threat environments), missed injuries (rapid assessments in austere conditions), and psychological trauma for providers and patients. The most common preventable cause of death is hemorrhage — emphasis on early tourniquet application saves the most lives.",
      pearls: [
        "In a direct threat environment, the ONLY medical intervention is a tourniquet — everything else waits until the threat is reduced",
        "90% of preventable tactical deaths are from HEMORRHAGE — most from extremity wounds that are tourniquet-amenable",
        "Self-aid and buddy-aid save more lives than waiting for medical personnel — teaching bleeding control to law enforcement and bystanders is critical",
        "Do NOT enter the hot zone without law enforcement — EMS providers are not trained or equipped for active threat environments"
      ],
      pitfalls: [
        "Entering the hot zone as an EMS provider without tactical training or law enforcement escort — you become another casualty",
        "Performing detailed assessment in the warm zone — focus on life-threatening hemorrhage, airway, and breathing only; save comprehensive assessment for the cold zone",
        "Not applying tourniquets because of traditional EMS training that discourages their use — in tactical scenarios, tourniquets are first-line and save lives",
        "Treating the closest patient instead of the most critical — triage principles apply in tactical scenarios"
      ],
      faq: [
        { question: "What is the difference between hot, warm, and cold zones?", answer: "HOT ZONE (direct threat): active threat present — shots being fired, explosion imminent, or active violence. Only law enforcement operates here. Medical care: tourniquet only, then move to cover. WARM ZONE (indirect threat): threat is not eliminated but is not directly present — adjacent rooms/areas to the hot zone, areas that have been cleared but not secured. EMS with law enforcement escort can operate here. Medical care: hemorrhage control, basic airway, chest seals. COLD ZONE (no threat): area secured by law enforcement, no active threat. Standard EMS operations. Full ALS assessment and treatment. These zones are dynamic — a warm zone can become hot instantly." },
        { question: "What is the Hartford Consensus?", answer: "The Hartford Consensus (2013) was developed after the Sandy Hook shooting to create a national policy for improving survival in active shooter and intentional mass-casualty events. Key principles: (1) No one should die from uncontrolled extremity bleeding. (2) Law enforcement should carry and apply tourniquets. (3) All first responders (including fire and police) should provide basic hemorrhage control in the warm zone. (4) EMS integration into the warm zone (with LE escort) is essential to reduce time to medical care. (5) Bystanders are the true 'immediate responders' — the 'Stop the Bleed' campaign trains civilians in hemorrhage control. The Hartford Consensus produced the THREAT acronym: Threat suppression, Hemorrhage control, Rapid Extrication, Assessment, and Transport." }
      ],
      keywords: ["tactical EMS paramedic", "TEMS operations", "active shooter medical response", "TECC guidelines", "warm zone medical care"],
      related: ["tourniquet-application", "wound-packing-and-hemostatic-agents", "mass-casualty-incident-triage", "blast-injuries"]
    },

    {
      title: "Pediatric Non-Accidental Trauma",
      category: "Pediatric Emergencies",
      overview: "Non-accidental trauma (NAT), or child abuse, is a critical recognition skill for paramedics. EMS providers are often the first medical professionals to enter the home environment and may observe injuries, living conditions, and caregiver behaviors that raise concern. Paramedics are mandated reporters and must document and report suspected abuse. Recognition of NAT can be life-saving — abused children who are returned to unsafe environments have a 35-50% recurrence rate and a 5-10% mortality rate.",
      mechanism: "Physical abuse inflicts injury through impact (hitting, punching, kicking), shaking (abusive head trauma — formerly shaken baby syndrome), burning (immersion, contact, or cigarette burns), strangulation, or torture. The injuries often follow recognizable patterns that differ from accidental trauma. The mechanism described by the caregiver is inconsistent with the injury — this inconsistency is the hallmark of NAT.",
      clinicalRelevance: "Paramedics have a unique opportunity to observe the child's home environment, caregiver interactions, and injury patterns. These observations may not be available to hospital staff. Detailed documentation of the scene, caregiver statements, and injury patterns is essential and may be the only record of these observations. All states require mandated reporting of suspected child abuse.",
      signsSymptoms: "Physical findings suspicious for NAT: bruises in non-mobile infants ('those who don't cruise rarely bruise'), patterned bruises (belt marks, hand prints, bite marks), bruises in unusual locations (ears, neck, buttocks, genitalia), multiple bruises in various stages of healing, immersion burns (symmetric, clear demarcation lines — 'stocking and glove' pattern), cigarette burns (circular, uniform), multiple fractures (especially different stages of healing), and retinal hemorrhages (abusive head trauma).",
      assessment: "History assessment: does the described mechanism match the injury? Is the child developmentally capable of the described activity? Is the history consistent between caregivers? Does the history change on re-telling? Behavioral assessment: is the caregiver's affect inappropriate (unconcerned about serious injury or overly dramatic about minor injury)? Is the child withdrawn, fearful, or excessively compliant? Is there a delay in seeking care? Environmental assessment: is the home safe, clean, with adequate food? Are there signs of substance abuse, domestic violence, or unsafe conditions?",
      management: "Treat all injuries per standard protocols. Document everything meticulously: exact quotes from caregivers (in quotation marks), detailed description of injuries (location, size, color, shape, pattern), scene observations, and child's behavior. Do NOT confront the caregiver with suspicion of abuse (this can escalate the situation and endanger the child). Transport to a pediatric-capable facility. Report suspected abuse per your state's mandated reporting laws. Notify the receiving hospital of your concerns.",
      complications: "If unrecognized: escalating abuse (35-50% recurrence rate), permanent disability (traumatic brain injury, developmental delay), and death (5-10% of abused children who return to unsafe environments). For the paramedic: vicarious trauma, emotional distress, and potential legal involvement. For the caregiver: legal consequences. Early recognition and reporting are the most important interventions.",
      pearls: [
        "The hallmark of NAT is a mechanism that does not match the injury — 'he fell off the couch' does not explain bilateral femur fractures in a 4-month-old",
        "'Those who don't cruise rarely bruise' — bruising in a non-mobile infant (before crawling/walking age) is highly suspicious for abuse",
        "Document EXACT quotes from caregivers — these may change later; your documentation of the original story is invaluable for investigators",
        "You are a MANDATED REPORTER — failure to report suspected abuse is a legal and ethical violation"
      ],
      pitfalls: [
        "Confronting the caregiver with accusations of abuse — this can escalate the situation, endanger the child, and compromise the investigation",
        "Not documenting observations because you're 'not sure' — report suspicion; investigation determines whether abuse occurred",
        "Accepting an implausible mechanism — if the story doesn't match the injury, document this discrepancy",
        "Not reporting because you don't want to be wrong — mandated reporting laws protect reporters who make good-faith reports"
      ],
      faq: [
        { question: "What should I document for suspected NAT?", answer: "Document: (1) EXACT quotes from all caregivers about how the injury occurred (use quotation marks). (2) Detailed injury description: location (anatomical), size (measure if possible), color, shape, pattern. (3) Any discrepancy between the described mechanism and the injury. (4) Child's behavior and affect: fearful, withdrawn, clinging to or avoiding the caregiver. (5) Caregiver behavior and affect: calm, anxious, hostile, unconcerned. (6) Scene observations: home condition, safety hazards, presence of drugs/alcohol. (7) Developmental appropriateness: can the child do what the caregiver claims caused the injury? (8) Prior EMS calls to the address. This documentation may be subpoenaed for legal proceedings." },
        { question: "What are the most common NAT injuries by age?", answer: "Infants (<1 year): abusive head trauma (most common cause of serious NAT injury and death in this age group), metaphyseal (corner/bucket-handle) fractures, rib fractures, and retinal hemorrhages. Toddlers (1-3 years): bruising in unusual locations, immersion burns (hands, feet, buttocks), spiral fractures of long bones (forced twisting), and oral injuries. School-age (4-12 years): bruising in patterns (belt marks, loops, hand prints), multiple injuries in different stages of healing, and burns. Adolescents: bruising, fractures, and sexual abuse. At any age: an injury pattern that doesn't match the developmental stage or described mechanism." }
      ],
      keywords: ["child abuse recognition paramedic", "non-accidental trauma assessment", "pediatric abuse indicators", "mandated reporter EMS", "child maltreatment signs"],
      related: ["pediatric-assessment-triangle", "pediatric-emergencies", "documentation-and-reporting", "scene-safety-and-situational-awareness"]
    },

    {
      title: "Supraglottic Airway Devices",
      category: "Airway Management",
      overview: "Supraglottic airway devices (SGAs) — including the King LT, i-gel, and laryngeal mask airway (LMA) — are designed to provide a patent airway without passing through the vocal cords. They have become first-line advanced airways in many EMS systems for cardiac arrest and as rescue airways after failed intubation. SGAs have higher first-pass success rates than endotracheal intubation in the prehospital setting.",
      mechanism: "SGAs are placed blindly into the oropharynx and sit above the glottis (hence 'supraglottic'). They create a seal around the laryngeal inlet, allowing ventilation without entering the trachea. The King LT has two inflatable cuffs (one pharyngeal, one esophageal) that seal above and below the glottis. The i-gel uses a non-inflatable gel cuff that conforms to the perilaryngeal anatomy. The LMA uses an inflatable cuff around the laryngeal inlet.",
      clinicalRelevance: "Multiple studies have shown that SGAs have higher first-pass success rates (>90%) compared to endotracheal intubation (70-85%) in the prehospital setting, with comparable patient outcomes for cardiac arrest. Many EMS systems now use SGAs as their primary advanced airway for cardiac arrest, reserving intubation for specific indications.",
      signsSymptoms: "Indications: cardiac arrest (most common indication), failed intubation (rescue airway), patients requiring ventilation when intubation is not available or not indicated. Contraindications: intact gag reflex (conscious patients), known esophageal disease, caustic ingestion, and some SGAs are contraindicated in pediatric patients below certain sizes.",
      assessment: "Determine if an advanced airway is indicated. Select the appropriate SGA size (based on patient weight or height — varies by device). Ensure the patient has no gag reflex. After placement: confirm ventilation by auscultation (bilateral breath sounds, no epigastric sounds), capnography (ETCO2 waveform), chest rise, and SpO2 improvement.",
      management: "King LT: select size based on height. Lubricate the tip. Open the mouth, insert along the palate, advance until the base of the connector reaches the teeth. Inflate the cuff. Ventilate and confirm placement. i-gel: select size based on weight. Lubricate the back. Insert along the hard palate until resistance is felt. Begin ventilation (no cuff inflation needed). LMA: select size based on weight, inflate cuff to check, deflate, insert with cuff deflated along the hard palate, inflate the cuff. All SGAs: confirm with capnography, secure the device, and monitor continuously.",
      complications: "Aspiration (SGAs do NOT protect the airway from aspiration as effectively as ETT), gastric insufflation, laryngospasm, device misplacement, inadequate ventilation (poor seal or malposition), mucosal injury, and sore throat. The most significant limitation compared to ETT is the lack of reliable aspiration protection.",
      pearls: [
        "SGAs have higher first-pass success rates than ETT in the prehospital setting — >90% vs 70-85% for ETT",
        "The i-gel is the simplest SGA to place — no cuff inflation required; just insert, confirm, and ventilate",
        "Capnography confirmation is ESSENTIAL for SGAs — auscultation alone may miss malposition; continuous ETCO2 monitoring is required",
        "If ventilation is inadequate through an SGA: reposition (withdraw slightly, then re-advance), ensure adequate cuff inflation (King LT), or replace with a different size"
      ],
      pitfalls: [
        "Not using capnography for confirmation — auscultation can be misleading; continuous ETCO2 waveform is the gold standard for confirming SGA placement",
        "Over-inflating the King LT cuff — excessive cuff pressure causes mucosal injury and paradoxically worsens the seal; inflate just enough for a good seal",
        "Selecting the wrong size — too small = air leak; too large = difficult insertion and trauma; follow manufacturer sizing guidelines",
        "Relying on SGAs to protect against aspiration — SGAs reduce but do not eliminate aspiration risk; suction should be immediately available"
      ],
      faq: [
        { question: "Are SGAs as good as endotracheal intubation?", answer: "For cardiac arrest outcomes, multiple large studies (AIRWAYS-2, PART trials) have shown no significant difference in survival between SGAs and ETT. SGAs have advantages in the prehospital setting: higher first-pass success rate, faster placement, less interruption of chest compressions, and lower training requirements. ETT advantages: better aspiration protection, ability to suction through the tube, and more secure long-term airway. Current consensus: SGAs are appropriate first-line airways for prehospital cardiac arrest, with ETT reserved for specific indications (aspiration risk, need for tracheal suctioning) or as rescue after SGA failure." },
        { question: "Which SGA should I use?", answer: "Device selection depends on your system's protocols, available equipment, and provider training: King LT: widely used, two-cuff design, available in multiple sizes, requires cuff inflation. i-gel: easiest to place (no cuff inflation), gel cuff self-conforms to anatomy, has gastric drain channel. LMA: the original SGA, well-studied, multiple variants available (some allow intubation through the LMA). Many systems carry one specific SGA and train extensively with that device. Proficiency with one device is more important than familiarity with multiple devices." }
      ],
      keywords: ["supraglottic airway paramedic", "King LT insertion", "i-gel placement", "LMA airway technique", "advanced airway devices EMS"],
      related: ["orotracheal-intubation", "bag-valve-mask-ventilation", "rapid-sequence-intubation", "difficult-airway-management"]
    },

    {
      title: "Traumatic Cardiac Arrest",
      category: "Trauma",
      overview: "Traumatic cardiac arrest (TCA) has historically been considered unsurvivable, but recent data shows that select patients — particularly those with reversible causes (tension pneumothorax, cardiac tamponade, massive hemorrhage) — can have meaningful survival. Resuscitation of TCA differs fundamentally from medical cardiac arrest: the focus is on treating reversible causes rather than defibrillation and compressions alone.",
      mechanism: "TCA results from one of several mechanisms: severe hemorrhage (most common — hypovolemia reduces venous return to zero), tension pneumothorax (increased intrathoracic pressure obstructs venous return), cardiac tamponade (pericardial blood compresses the heart), commotio cordis (V-fib from precordial impact), and severe traumatic brain injury (catastrophic neurological injury causes apnea and arrest). The rhythm is usually PEA or asystole (not shockable).",
      clinicalRelevance: "TCA resuscitation is time-critical and fundamentally different from medical cardiac arrest. Chest compressions alone do nothing for an empty heart (hypovolemia) or a heart that cannot fill (tamponade, tension pneumothorax). Survival depends on rapidly identifying and treating the CAUSE: bilateral needle decompression, pericardiocentesis, hemorrhage control, and volume resuscitation.",
      signsSymptoms: "Pulselessness and apnea in a trauma patient. Clues to the cause: distended neck veins (tamponade, tension pneumothorax), flat neck veins (hypovolemia), absent breath sounds unilaterally (tension pneumothorax), penetrating chest wound (tamponade or tension pneumothorax), massive external hemorrhage, and mechanism suggesting severe TBI.",
      assessment: "Rapid assessment to identify reversible causes: (1) Bilateral breath sounds? If absent unilaterally → tension pneumothorax. (2) Neck veins? Distended → tamponade or tension pneumothorax; flat → hypovolemia. (3) Obvious hemorrhage? Control it. (4) Penetrating chest trauma? Consider tamponade. The assessment and treatment are simultaneous — interventions are performed AS the assessment identifies causes.",
      management: "Simultaneous interventions: bilateral needle decompression (treats tension pneumothorax without needing to identify the side — faster than auscultation), pericardiocentesis for tamponade (if trained and equipped), tourniquet for extremity hemorrhage, wound packing for junctional hemorrhage, massive transfusion protocol activation, and volume resuscitation with blood products (or NS/LR if blood not available). Chest compressions are started but are SECONDARY to treating the cause. Consider resuscitative thoracotomy (hospital — within 10 min for penetrating cardiac injury).",
      complications: "Most patients die despite intervention — overall TCA survival is 5-10% for blunt trauma and 10-15% for penetrating trauma. Survivors of TCA often have significant disabilities (neurological injury from hypoxia, limb loss from hemorrhage). Resources used for futile TCA resuscitation are unavailable for other patients. Resuscitation should follow clear termination criteria.",
      pearls: [
        "Treat the CAUSE, not just the arrest — chest compressions on an empty heart (hypovolemia) or a heart that cannot fill (tamponade) are futile without addressing the cause",
        "Bilateral needle decompression should be performed empirically in TCA — it takes seconds, treats tension pneumothorax without needing to identify the side, and is not harmful if no pneumothorax exists",
        "Penetrating TCA with <10 minutes of arrest has the best outcomes — rapid transport for resuscitative thoracotomy is the priority",
        "Flat neck veins in TCA = hypovolemia; distended neck veins = obstructive cause (tamponade or tension pneumothorax)"
      ],
      pitfalls: [
        "Performing prolonged CPR without addressing the cause — compressions alone will not resuscitate a traumatic arrest; identify and treat the reversible cause",
        "Not decompressing the chest bilaterally — needle decompression is fast, low-risk, and treats the most common reversible cause of TCA",
        "Spending too long on scene with penetrating TCA — these patients need resuscitative thoracotomy (hospital-based); rapid transport is essential",
        "Resuscitating blunt TCA with prolonged arrest time (>10 minutes) and asystole — this has near-zero survival and should be terminated per protocol"
      ],
      faq: [
        { question: "How is traumatic cardiac arrest different from medical cardiac arrest?", answer: "Key differences: (1) CAUSE: medical arrest is usually cardiac (VF/VT from coronary disease); traumatic arrest is from hemorrhage, pneumothorax, or tamponade. (2) RHYTHM: medical arrest often has shockable rhythm (VF/VT); TCA is usually PEA or asystole. (3) TREATMENT: medical arrest focuses on CPR + defibrillation + epinephrine; TCA focuses on treating the reversible cause (decompression, hemorrhage control, volume). (4) COMPRESSIONS: essential in medical arrest (maintaining coronary perfusion); less effective in TCA (compressing an empty heart). (5) PROGNOSIS: medical arrest has 10-30% survival with bystander CPR and AED; TCA has 5-15% survival. (6) DEFIBRILLATION: main treatment for VF/VT in medical arrest; rarely useful in TCA (except commotio cordis)." },
        { question: "When should TCA resuscitation be terminated?", answer: "General termination criteria: (1) Blunt TCA with asystole on arrival and no signs of life = consider termination (near-zero survival). (2) Blunt TCA with >10 minutes of arrest without ROSC = consider termination. (3) Penetrating TCA with >15 minutes of arrest without ROSC = consider termination. (4) Non-survivable injuries (decapitation, hemicorporectomy, massive open head injury). Continue resuscitation if: (1) <10 minutes of arrest (or unknown arrest time). (2) Organized cardiac rhythm on the monitor. (3) Reversible cause identified (tension pneumothorax, tamponade). (4) Penetrating mechanism with short arrest time. Follow local protocols and medical command guidance." }
      ],
      keywords: ["traumatic cardiac arrest paramedic", "TCA resuscitation", "trauma arrest reversible causes", "bilateral needle decompression", "resuscitative thoracotomy indication"],
      related: ["tension-pneumothorax-management", "cardiac-tamponade", "hemorrhagic-shock", "cardiac-arrest-management"]
    },

  ];
}
