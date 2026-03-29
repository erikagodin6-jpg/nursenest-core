import type { LessonContent } from "./types";

export const paramedicLessons: Record<string, LessonContent> = {
  "trauma-algorithm-paramedic": {
    title: "Trauma Assessment Algorithm",
    cellular: `Prehospital trauma assessment follows a systematic, time-critical algorithm designed to identify life-threatening injuries within the first minutes of patient contact. The trauma assessment framework used by paramedics is built on the principle that mortality in trauma is directly related to the time from injury to definitive surgical care. The platinum 10 minutes and golden hour concepts drive the urgency of prehospital trauma management.

Scene safety is the absolute first priority. Before approaching any trauma patient, the paramedic must assess for ongoing hazards: traffic, fire, hazardous materials, unstable structures, downed power lines, violent perpetrators, and environmental conditions. Scene safety assessment is continuous -- threats can emerge during patient care. Once the scene is safe, the mechanism of injury (MOI) assessment begins. High-mechanism criteria include: vehicle rollover, ejection from vehicle, pedestrian or cyclist struck at greater than 20 mph, fall greater than 20 feet (adult) or 10 feet (pediatric), motorcycle crash greater than 20 mph, intrusion into patient compartment greater than 12 inches, death of another occupant in the same vehicle, auto vs pedestrian with significant impact, blast injury, and penetrating trauma to head, neck, torso, or proximal extremities.

The primary survey follows the XABCDE sequence. X stands for exsanguinating hemorrhage -- massive external bleeding must be controlled immediately, before assessing the airway. This reflects the Hartford Consensus and Stop the Bleed paradigm: uncontrolled hemorrhage kills faster than airway compromise in penetrating trauma. Direct pressure, tourniquet application (proximal to the wound, tightened until bleeding stops), and wound packing with hemostatic gauze (Combat Gauze, Celox) are first-line interventions.

A (Airway with cervical spine protection): Assess airway patency while maintaining inline cervical stabilization. Look for blood, vomitus, teeth, foreign bodies, facial trauma, or expanding neck hematoma. Jaw thrust without head tilt is the maneuver of choice for suspected C-spine injury. Suction the airway. Insert an oropharyngeal airway if the patient is unconscious without gag reflex, or a nasopharyngeal airway if semiconscious (contraindicated in suspected basilar skull fracture). If airway is not maintainable with basic maneuvers, proceed to advanced airway management: endotracheal intubation with inline stabilization or supraglottic airway placement.

B (Breathing and ventilation): Expose the chest. Look, listen, and feel for breathing. Assess respiratory rate, depth, and effort. Auscultate bilateral lung sounds. Palpate for crepitus, flail segments, and subcutaneous emphysema. Identify immediately life-threatening chest injuries: tension pneumothorax (tracheal deviation, absent breath sounds, JVD, hypotension -- treat with needle decompression at 2nd intercostal space midclavicular line or 5th intercostal space anterior axillary line), open pneumothorax (sucking chest wound -- apply three-sided occlusive dressing or vented chest seal), massive hemothorax (dullness to percussion, absent breath sounds, hypotension -- large bore IV access and rapid transport), and flail chest (paradoxical chest wall movement -- positive pressure ventilation if respiratory failure).

C (Circulation with hemorrhage control): Assess pulse rate and quality (radial pulse present = SBP approximately 80+ mmHg; femoral pulse present = SBP approximately 70+ mmHg; carotid pulse only = SBP approximately 60+ mmHg). Assess skin color, temperature, and moisture (cool, pale, diaphoretic = shock). Identify and control all bleeding sources. Apply pelvic binder for suspected pelvic fracture (mechanism + pain + instability on palpation). Establish IV/IO access with two large bore (14-16 gauge) IVs. Initiate fluid resuscitation with permissive hypotension strategy: target SBP 80-90 mmHg in penetrating trauma (maintains perfusion without disrupting clot formation). For hemorrhagic shock: administer tranexamic acid (TXA) 1 g IV over 10 minutes if within 3 hours of injury.

D (Disability/neurological status): Assess Glasgow Coma Scale (eye opening + verbal response + motor response, range 3-15). GCS 13-15 = mild TBI, 9-12 = moderate TBI, 3-8 = severe TBI (intubation indicated). Check pupil size and reactivity bilaterally. Assess for lateralizing signs (unilateral pupil dilation, hemiparesis). Blood glucose measurement to rule out hypoglycemia mimicking altered mental status.

E (Exposure and environmental control): Fully expose the patient to identify all injuries, then immediately cover to prevent hypothermia. Trauma patients lose heat rapidly through exposed wounds, wet clothing, cold IV fluids, and cold ambient temperature. Hypothermia worsens coagulopathy (the lethal triad: hypothermia + acidosis + coagulopathy). Use warm blankets, heated IV fluids, and minimize exposure time.

The secondary survey is a rapid head-to-toe physical examination performed en route to the hospital if time permits. DCAP-BTLS (Deformities, Contusions, Abrasions, Penetrations, Burns, Tenderness, Lacerations, Swelling) is assessed at each body region. Vital signs are reassessed every 5 minutes for critical patients, every 15 minutes for stable patients. The trauma patient should be transported to the highest appropriate level of trauma center based on field triage criteria (CDC Field Triage Decision Scheme).

Transport decisions are critical. The paramedic must decide between ground and air transport, and determine the appropriate receiving facility. Trauma center designation matters: Level I provides comprehensive care including 24/7 surgical capability, Level II provides similar care but may lack some subspecialties, Level III provides initial stabilization with transfer capability. Bypass closer non-trauma hospitals to reach the appropriate trauma center when transport time allows.`,
    riskFactors: [
      "High-speed motor vehicle collision with intrusion, rollover, or ejection indicating severe energy transfer",
      "Penetrating trauma to head, neck, torso, or proximal extremities with potential for vascular injury",
      "Fall greater than 20 feet in adults or 10 feet in children causing axial loading and multisystem injury",
      "Pedestrian or cyclist struck by vehicle at greater than 20 mph with risk of multisystem blunt trauma",
      "Blast injury producing primary (blast wave), secondary (projectile), tertiary (body displacement), and quaternary (burns, crush) injuries",
      "Elderly patients (age > 55) with lower physiological reserve and higher mortality for equivalent injury severity",
      "Anticoagulant therapy increasing hemorrhage risk and complicating hemorrhage control in trauma",
      "Motorcycle crash greater than 20 mph without protective equipment causing direct impact and road friction injuries",
      "Multi-system trauma with concurrent head injury and hemorrhage requiring simultaneous management"
    ],
    diagnostics: [
      "Glasgow Coma Scale assessment for neurological status grading (3-15 scale) and intubation threshold (GCS <= 8)",
      "XABCDE primary survey sequence completed within 60-90 seconds to identify immediately life-threatening conditions",
      "Pulse quality and location assessment as surrogate for blood pressure (radial ~80, femoral ~70, carotid ~60 mmHg SBP)",
      "DCAP-BTLS secondary survey from head to toe assessing all body regions for occult injury",
      "Mechanism of injury evaluation using CDC Field Triage Decision Scheme criteria for transport destination",
      "Serial vital signs every 5 minutes for critical patients tracking hemodynamic trajectory",
      "Blood glucose measurement to rule out hypoglycemia causing altered mental status",
      "12-lead ECG in blunt chest trauma to assess for cardiac contusion or traumatic cardiac injury"
    ],
    management: [
      "Control exsanguinating hemorrhage immediately with tourniquet or direct pressure before airway assessment",
      "Maintain cervical spine immobilization with jaw thrust for airway management in suspected spinal injury",
      "Needle decompression at 2nd ICS midclavicular or 5th ICS anterior axillary for tension pneumothorax",
      "Apply three-sided occlusive dressing or vented chest seal for open pneumothorax",
      "Establish two large bore (14-16G) IV lines and initiate permissive hypotension (target SBP 80-90 mmHg penetrating trauma)",
      "Administer TXA 1g IV over 10 minutes within 3 hours of injury for hemorrhagic shock",
      "Apply pelvic binder for suspected pelvic fracture with hemodynamic instability",
      "Minimize scene time to platinum 10 minutes and transport to highest appropriate trauma center",
      "Prevent hypothermia with warm blankets and heated IV fluids to avoid lethal triad"
    ],
    nursingActions: [
      "Complete XABCDE primary survey within 90 seconds on every trauma patient before any secondary assessment",
      "Apply tourniquet high and tight on extremity hemorrhage -- tighten until bleeding stops and note application time",
      "Maintain inline cervical stabilization during all airway maneuvers until C-spine is cleared at hospital",
      "Reassess vital signs every 5 minutes for critical patients and document trends for receiving facility",
      "Pack wounds with hemostatic gauze (Combat Gauze) and apply direct pressure for non-tourniquet-amenable hemorrhage",
      "Calculate and communicate GCS score accurately to receiving facility for triage and neurosurgical mobilization",
      "Limit crystalloid resuscitation to avoid dilutional coagulopathy -- prioritize blood products when available",
      "Maintain continuous reassessment of XABCDE during transport -- conditions change rapidly in trauma"
    ],
    signs: [
      "Tracheal deviation, absent unilateral breath sounds, JVD, and hypotension indicating tension pneumothorax",
      "Paradoxical chest wall movement with crepitus indicating flail chest with underlying pulmonary contusion",
      "Cool pale diaphoretic skin with tachycardia and narrowed pulse pressure indicating hemorrhagic shock",
      "Unilateral pupil dilation with contralateral hemiparesis indicating uncal herniation from expanding intracranial hematoma",
      "Pelvic instability on compression with hemodynamic instability suggesting pelvic ring fracture with hemorrhage",
      "Distended abdomen with guarding and hemodynamic instability suggesting intraperitoneal hemorrhage"
    ],
    medications: [
      { name: "Tranexamic Acid (TXA)", dose: "1 g IV over 10 minutes", route: "Intravenous", purpose: "Antifibrinolytic to reduce mortality in hemorrhagic shock when given within 3 hours of injury" },
      { name: "Ketamine", dose: "0.1-0.3 mg/kg IV for analgesia, 1-2 mg/kg IV for induction", route: "IV or IM", purpose: "Dissociative anesthetic providing analgesia and procedural sedation without respiratory depression" },
      { name: "Fentanyl", dose: "1-2 mcg/kg IV or 1.5 mcg/kg intranasal", route: "IV or intranasal", purpose: "Rapid-onset opioid analgesia for severe traumatic pain without histamine release" },
      { name: "Normal Saline (0.9%)", dose: "250-500 mL bolus, titrate to SBP 80-90", route: "Intravenous", purpose: "Volume resuscitation with permissive hypotension to maintain perfusion without disrupting clot" }
    ],
    pearls: [
      "X before A -- massive hemorrhage kills faster than airway compromise in penetrating trauma; tourniquet first",
      "Pulse location estimates SBP: radial ~80, femoral ~70, carotid ~60 mmHg -- rapid hemodynamic staging",
      "Permissive hypotension (SBP 80-90) in penetrating trauma preserves clot and reduces mortality compared to aggressive fluid resuscitation",
      "TXA must be given within 3 hours of injury -- after 3 hours it may increase mortality",
      "The lethal triad (hypothermia + acidosis + coagulopathy) is the enemy -- prevent hypothermia from the first minutes",
      "Scene time for critical trauma patients should be 10 minutes or less -- load and go, treat en route"
    ],
    quiz: [
      { question: "In the XABCDE trauma assessment, what does the X represent and why does it come first?", options: ["X-ray assessment for fractures", "Exsanguinating hemorrhage control because massive bleeding kills faster than airway compromise", "Exposure of the patient for full assessment", "eXamination of mechanism of injury"], correctIndex: 1, rationale: "X represents exsanguinating hemorrhage. The Hartford Consensus and military experience demonstrated that uncontrolled external hemorrhage (particularly from extremity wounds) can cause death within minutes, faster than airway obstruction. Tourniquet application and direct pressure take priority over airway assessment in the presence of massive external bleeding." },
      { question: "A trauma patient has a radial pulse but no blood pressure cuff is available. What is the estimated minimum SBP?", options: ["60 mmHg", "70 mmHg", "80 mmHg", "100 mmHg"], correctIndex: 2, rationale: "Pulse location provides a rapid estimate of systolic blood pressure: palpable radial pulse indicates SBP of approximately 80 mmHg or higher, femoral pulse approximately 70 mmHg, and carotid pulse approximately 60 mmHg. This allows rapid hemodynamic staging without equipment." },
      { question: "A patient has unilateral absent breath sounds, tracheal deviation to the opposite side, JVD, and hypotension after blunt chest trauma. What is the treatment?", options: ["Chest X-ray before any intervention", "Immediate needle decompression at 2nd ICS midclavicular line", "IV fluid bolus to treat hypotension", "Intubation and positive pressure ventilation"], correctIndex: 1, rationale: "This presentation is classic tension pneumothorax. Treatment is immediate needle decompression -- this is a clinical diagnosis that does not wait for imaging. Delay for chest X-ray can be fatal. Needle decompression at the 2nd intercostal space midclavicular line (or 5th ICS anterior axillary line) converts the tension pneumothorax to a simple pneumothorax, relieving the hemodynamic compromise." },
      { question: "When should TXA be administered in hemorrhagic trauma?", options: ["Within 1 hour only", "Within 3 hours of injury", "Anytime within 24 hours", "Only after blood products are started"], correctIndex: 1, rationale: "TXA (tranexamic acid) 1 g IV over 10 minutes should be administered within 3 hours of injury for hemorrhagic shock. The CRASH-2 trial showed a mortality reduction when given within 3 hours. Administration after 3 hours showed a trend toward increased mortality and is not recommended." },
      { question: "What is the target SBP for permissive hypotension in penetrating trauma?", options: ["60-70 mmHg", "80-90 mmHg", "100-110 mmHg", "120-130 mmHg"], correctIndex: 1, rationale: "Permissive hypotension targets SBP 80-90 mmHg in penetrating trauma. This maintains minimum organ perfusion while avoiding aggressive fluid resuscitation that can disrupt clot formation, dilute clotting factors, and worsen hypothermia. It is not used in traumatic brain injury, where cerebral perfusion pressure must be maintained." }
    ]
  },

  "acls-pharmacology-paramedic": {
    title: "ACLS Pharmacology",
    cellular: `Advanced Cardiac Life Support pharmacology is a core competency for paramedics. Every medication used in cardiac arrest and peri-arrest management has specific indications, contraindications, dosing, and administration protocols. Paramedics must know these cold because seconds matter in cardiac emergencies.

Epinephrine is the primary vasopressor in cardiac arrest. It acts on both alpha-1 and beta-1 adrenergic receptors. Alpha-1 stimulation causes peripheral vasoconstriction, which increases aortic diastolic pressure and improves coronary perfusion pressure (the pressure gradient driving blood flow to the myocardium during CPR). Beta-1 stimulation increases heart rate and contractility, but this effect is less important during arrest and may actually increase myocardial oxygen demand. In cardiac arrest (VF/pVT, PEA, asystole), epinephrine is administered 1 mg IV/IO every 3-5 minutes. For symptomatic bradycardia unresponsive to atropine, epinephrine infusion at 2-10 mcg/min is used. For anaphylaxis, epinephrine 0.3-0.5 mg IM (1:1000 concentration) into the anterolateral thigh is the first-line treatment.

Amiodarone is the first-line antiarrhythmic for refractory ventricular fibrillation and pulseless ventricular tachycardia. It works by blocking sodium, potassium, and calcium channels, and has anti-adrenergic properties. It prolongs the action potential duration and effective refractory period, stabilizing the myocardium. In cardiac arrest: 300 mg IV/IO push for the first dose (diluted in 20 mL D5W if IV), followed by 150 mg IV/IO for the second dose. For stable wide complex tachycardia: 150 mg IV over 10 minutes, then 1 mg/min infusion for 6 hours, then 0.5 mg/min for 18 hours. Amiodarone can cause hypotension (from vasodilation) and bradycardia. Long-term side effects include pulmonary fibrosis, thyroid dysfunction, hepatotoxicity, and corneal deposits.

Lidocaine is the alternative antiarrhythmic when amiodarone is unavailable. It blocks sodium channels, suppressing ventricular ectopy and raising the VF threshold. In cardiac arrest: 1-1.5 mg/kg IV/IO push first dose, then 0.5-0.75 mg/kg every 5-10 minutes (max 3 mg/kg total). For stable VT: 1-1.5 mg/kg IV push, followed by 1-4 mg/min infusion. Lidocaine toxicity presents with perioral numbness, tinnitus, confusion, and seizures at high plasma levels. It is contraindicated in high-grade AV block.

Atropine is a parasympathetic blocker (anticholinergic) that increases heart rate by blocking vagal tone at the SA and AV nodes. It is indicated for symptomatic bradycardia: 1 mg IV every 3-5 minutes (max 3 mg or 0.04 mg/kg). Atropine is NOT recommended for cardiac arrest (no longer in the PEA/asystole algorithm as of AHA 2010). It is ineffective for infranodal (Mobitz Type II, third degree) AV blocks because these involve the His-Purkinje system, which has minimal vagal innervation. For organophosphate poisoning, much higher doses are used (2-4 mg IV, repeated until secretions dry).

Adenosine is the first-line drug for stable narrow-complex supraventricular tachycardia (SVT). It blocks conduction through the AV node by activating A1 adenosine receptors, causing transient AV nodal block. This breaks reentrant circuits that depend on AV nodal conduction (AVNRT, AVRT). Dose: 6 mg rapid IV push (must be rapid because adenosine has a half-life of less than 10 seconds), followed by 20 mL NS flush. If ineffective, give 12 mg rapid IV push (repeat once if needed). Adenosine must be given through a proximal IV (antecubital or central) with immediate flush. Side effects include transient chest pressure, flushing, dyspnea, and brief asystole (expected and therapeutic). Contraindicated in wide-complex tachycardia of unknown origin, pre-excited atrial fibrillation (WPW with AF), and second or third degree AV block.

Calcium chloride (10%) provides 272 mg elemental calcium per 10 mL. It is indicated for hyperkalemia with ECG changes (peaked T waves, widened QRS, sine wave), calcium channel blocker overdose, and hypocalcemia-related cardiac dysfunction. Dose: 500-1000 mg (5-10 mL of 10%) slow IV push over 2-5 minutes. Calcium chloride is preferred over calcium gluconate in emergencies because it provides three times more ionized calcium per volume. It is irritating to veins and ideally given through a central line or large bore peripheral IV. Extravasation causes tissue necrosis.

Sodium bicarbonate is indicated for known hyperkalemia, sodium channel blocker overdose (tricyclic antidepressant toxicity causing wide QRS), and pre-existing metabolic acidosis (not for routine use in cardiac arrest). Dose: 1 mEq/kg IV push, then 0.5 mEq/kg every 10 minutes guided by pH. Bicarbonate generates CO2 when buffering acid, which can worsen intracellular acidosis if ventilation is inadequate. It should not be mixed with calcium or catecholamines (precipitates or inactivates them).

Vasopressin was previously used as an alternative to epinephrine in cardiac arrest but was removed from the AHA algorithm in 2015. It may still be used as a vasopressor infusion (0.01-0.04 units/min) for septic shock refractory to norepinephrine.

Dopamine is a dose-dependent catecholamine used for symptomatic bradycardia and hypotension. At 2-5 mcg/kg/min (dopaminergic doses), it increases renal and mesenteric blood flow. At 5-10 mcg/kg/min (beta-1 doses), it increases contractility and heart rate. At 10-20 mcg/kg/min (alpha-1 doses), it causes vasoconstriction. For symptomatic bradycardia: 5-20 mcg/kg/min infusion. The clean dose-response separation is an oversimplification clinically, but it guides initial dosing.

Magnesium sulfate is indicated for torsades de pointes (polymorphic VT with prolonged QT), severe asthma refractory to beta-agonists, and eclamptic seizures. For torsades: 1-2 g IV over 5-20 minutes, followed by infusion if needed. For severe asthma: 2 g IV over 20 minutes. Rapid administration can cause hypotension and respiratory depression.`,
    riskFactors: [
      "Refractory VF/pVT not responding to initial defibrillation and epinephrine requiring amiodarone",
      "Symptomatic bradycardia with hemodynamic compromise requiring atropine or chronotropic infusion",
      "Wide complex tachycardia of uncertain origin requiring careful differentiation before drug selection",
      "Hyperkalemia with ECG changes requiring immediate calcium chloride for cardiac membrane stabilization",
      "Tricyclic antidepressant overdose with wide QRS requiring sodium bicarbonate",
      "Torsades de pointes requiring magnesium sulfate rather than standard antiarrhythmics",
      "Anaphylaxis requiring immediate IM epinephrine with potential for cardiovascular collapse",
      "Pre-excited atrial fibrillation (WPW) where adenosine, calcium channel blockers, and digoxin are contraindicated"
    ],
    diagnostics: [
      "Continuous cardiac monitoring with rhythm identification before and after each drug administration",
      "12-lead ECG interpretation for arrhythmia classification and drug selection guidance",
      "QT interval measurement before administering QT-prolonging drugs (amiodarone, procainamide)",
      "Potassium level assessment (point-of-care if available) for hyperkalemia-related arrhythmias",
      "Blood glucose measurement to rule out hypoglycemia as cause of altered mental status in peri-arrest",
      "End-tidal CO2 monitoring during CPR to assess CPR quality and ROSC detection",
      "Pulse check every 2 minutes during cardiac arrest to detect return of spontaneous circulation"
    ],
    management: [
      "Epinephrine 1 mg IV/IO every 3-5 minutes for all cardiac arrest rhythms (VF/pVT, PEA, asystole)",
      "Amiodarone 300 mg IV/IO first dose then 150 mg second dose for refractory VF/pVT",
      "Atropine 1 mg IV every 3-5 minutes (max 3 mg) for symptomatic bradycardia",
      "Adenosine 6 mg rapid IV push then 12 mg for stable narrow-complex SVT",
      "Calcium chloride 10% 500-1000 mg slow IV for hyperkalemia with ECG changes",
      "Sodium bicarbonate 1 mEq/kg IV for hyperkalemia, TCA overdose, or severe pre-existing metabolic acidosis",
      "Magnesium sulfate 1-2 g IV for torsades de pointes",
      "Dopamine 5-20 mcg/kg/min infusion for symptomatic bradycardia not responsive to atropine"
    ],
    nursingActions: [
      "Administer epinephrine immediately after rhythm check during CPR without interrupting compressions",
      "Give adenosine via proximal IV with rapid 20 mL NS flush -- drug must reach the heart before metabolism",
      "Monitor cardiac rhythm continuously after every drug administration for response or deterioration",
      "Prepare and label all infusions clearly with drug name, concentration, and dose rate before hanging",
      "Never mix sodium bicarbonate with calcium or catecholamines in the same IV line",
      "Document exact time of every drug administration and rhythm at that time during resuscitation",
      "Calculate and verify weight-based doses for pediatric patients using Broselow tape or actual weight",
      "Monitor for amiodarone-induced hypotension during infusion and reduce rate or administer fluid bolus if occurs"
    ],
    signs: [
      "Return of spontaneous circulation (ROSC) indicated by organized rhythm, palpable pulse, and rising ETCO2",
      "Widening QRS after sodium channel blocker ingestion requiring sodium bicarbonate",
      "Peaked T waves progressing to wide QRS in hyperkalemia requiring calcium chloride",
      "Torsades de pointes (polymorphic VT with rotating axis) on monitor requiring magnesium",
      "Transient asystole after adenosine administration (expected therapeutic effect in SVT)",
      "Refractory VF/pVT persisting after 3 shocks indicating need for antiarrhythmic therapy"
    ],
    medications: [
      { name: "Epinephrine", dose: "1 mg IV/IO every 3-5 min (arrest); 2-10 mcg/min infusion (bradycardia)", route: "IV/IO", purpose: "Alpha-1 vasoconstriction improves coronary perfusion pressure during CPR" },
      { name: "Amiodarone", dose: "300 mg IV/IO first dose, 150 mg second dose (arrest); 150 mg IV over 10 min (stable VT)", route: "IV/IO", purpose: "Multi-channel antiarrhythmic for refractory VF/pVT and stable wide-complex tachycardia" },
      { name: "Adenosine", dose: "6 mg rapid IV push, then 12 mg if needed", route: "IV (proximal) with 20 mL flush", purpose: "Transient AV nodal block to terminate reentrant SVT" },
      { name: "Atropine", dose: "1 mg IV every 3-5 min, max 3 mg", route: "IV/IO", purpose: "Anticholinergic to increase heart rate in symptomatic vagally-mediated bradycardia" }
    ],
    pearls: [
      "Epinephrine in arrest is for coronary perfusion pressure via alpha-1 vasoconstriction -- the beta effect is secondary",
      "Adenosine must be given rapid IV push through a proximal vein with immediate 20 mL flush -- its half-life is under 10 seconds",
      "Atropine does not work for infranodal blocks (Mobitz II, complete heart block) because the His-Purkinje system has minimal vagal innervation",
      "Calcium chloride provides 3x more ionized calcium per mL than calcium gluconate -- preferred in emergencies",
      "Sodium bicarbonate generates CO2 -- ensure adequate ventilation before administering to avoid worsening intracellular acidosis",
      "Amiodarone causes hypotension from vasodilation -- be prepared with fluid bolus during infusion"
    ],
    quiz: [
      { question: "During cardiac arrest in refractory VF, what is the first dose of amiodarone?", options: ["150 mg IV over 10 minutes", "300 mg IV/IO push", "1 mg/min IV infusion", "450 mg IV push"], correctIndex: 1, rationale: "In cardiac arrest with refractory VF/pVT (persisting after defibrillation and epinephrine), amiodarone 300 mg IV/IO push is the first dose. The second dose is 150 mg IV/IO. This is different from the stable VT dose of 150 mg IV over 10 minutes." },
      { question: "Why is adenosine contraindicated in wide-complex tachycardia of unknown origin?", options: ["It always converts the rhythm to asystole", "It could accelerate conduction in pre-excited atrial fibrillation causing VF", "It causes severe hypertension", "It has no effect on ventricular rhythms"], correctIndex: 1, rationale: "If the wide-complex tachycardia is actually pre-excited atrial fibrillation (WPW with AF), adenosine blocks the AV node but allows conduction down the accessory pathway. This can accelerate the ventricular rate to the point of VF. For wide-complex tachycardia of unknown origin, procainamide or amiodarone is safer." },
      { question: "A patient in asystole has received 3 doses of epinephrine. Should atropine be administered?", options: ["Yes, 1 mg IV for asystole per current AHA guidelines", "Yes, 3 mg IV as a single dose for asystole", "No, atropine was removed from the asystole/PEA algorithm", "No, atropine is only for ventricular fibrillation"], correctIndex: 2, rationale: "Atropine was removed from the PEA/asystole algorithm in the 2010 AHA guidelines update. Evidence showed no benefit for atropine in asystole or PEA. Epinephrine remains the only drug recommended for these non-shockable rhythms, along with treating reversible causes (Hs and Ts)." },
      { question: "A patient with a heart rate of 35 and hypotension does not respond to atropine. What is the next pharmacological intervention?", options: ["Adenosine 6 mg rapid IV push", "Epinephrine infusion 2-10 mcg/min or dopamine 5-20 mcg/kg/min", "Amiodarone 150 mg IV over 10 minutes", "Calcium chloride 1 g IV push"], correctIndex: 1, rationale: "For symptomatic bradycardia unresponsive to atropine, the next pharmacological step is a chronotropic infusion: epinephrine 2-10 mcg/min or dopamine 5-20 mcg/kg/min while preparing for transcutaneous pacing. Transcutaneous pacing is the definitive temporizing measure while awaiting transvenous pacing." },
      { question: "What is the mechanism by which epinephrine improves outcomes during CPR?", options: ["Beta-1 stimulation increases myocardial contractility", "Alpha-1 vasoconstriction increases coronary perfusion pressure", "Beta-2 stimulation causes bronchodilation improving ventilation", "Direct cardiac stimulation restarts the electrical conduction system"], correctIndex: 1, rationale: "The primary benefit of epinephrine during CPR is alpha-1 mediated peripheral vasoconstriction, which increases aortic diastolic pressure. This raises coronary perfusion pressure (the difference between aortic diastolic and right atrial pressure), which is the critical determinant of myocardial blood flow during chest compressions." }
    ]
  },

  "stroke-recognition-paramedic": {
    title: "Stroke Recognition and Prehospital Management",
    cellular: `Stroke is the fifth leading cause of death and the leading cause of adult disability in North America. Prehospital stroke recognition and rapid transport to a stroke-capable facility directly determine patient outcomes. The time-dependent nature of stroke treatment -- particularly the narrow window for thrombolytic therapy (tPA within 4.5 hours) and thrombectomy (within 24 hours for select patients) -- makes paramedic assessment one of the most consequential evaluations in emergency medicine.

Ischemic stroke accounts for approximately 87% of all strokes. It occurs when a blood clot (thrombus or embolus) occludes a cerebral artery, depriving downstream brain tissue of oxygen and glucose. The ischemic core (irreversibly damaged tissue) is surrounded by the penumbra (hypoperfused but salvageable tissue). The goal of acute stroke treatment is to restore blood flow before the penumbra progresses to infarction. The penumbra can persist for hours, but the rate of neuronal death is approximately 1.9 million neurons per minute during a large vessel occlusion. This is the basis of the phrase "time is brain."

Hemorrhagic stroke accounts for approximately 13% of strokes. Intracerebral hemorrhage (ICH) results from rupture of a cerebral blood vessel, most commonly due to chronic hypertension causing lipohyalinosis of small penetrating arteries. Subarachnoid hemorrhage (SAH) results from rupture of a cerebral aneurysm or arteriovenous malformation, causing bleeding into the subarachnoid space. SAH classically presents with "the worst headache of my life" with sudden onset, often with neck stiffness, photophobia, and altered consciousness.

Prehospital stroke assessment tools enable rapid field screening. The Cincinnati Prehospital Stroke Scale (CPSS) evaluates three findings: facial droop (ask patient to smile -- observe for asymmetry), arm drift (hold both arms out with eyes closed for 10 seconds -- observe for downward drift or pronation), and speech abnormality (repeat a phrase -- assess for slurring or word-finding difficulty). Any one abnormal finding has 72% sensitivity for stroke. All three abnormal has high specificity. The Los Angeles Prehospital Stroke Screen (LAPSS) adds criteria for blood glucose, age, seizure history, and duration of symptoms.

Large Vessel Occlusion (LVO) screening is increasingly important because LVO patients are candidates for mechanical thrombectomy at comprehensive stroke centers. The RACE (Rapid Arterial oCclusion Evaluation) scale, LAMS (Los Angeles Motor Scale), and VAN (Vision, Aphasia, Neglect) assessment help identify LVO in the field. LVO screening matters because these patients should bypass primary stroke centers and go directly to comprehensive stroke centers with thrombectomy capability, even if the transport time is longer.

The prehospital stroke protocol includes: establish time of symptom onset (last known well time is critical for treatment decisions), perform stroke screening assessment (CPSS or equivalent), check blood glucose (hypoglycemia can mimic stroke), obtain a 12-lead ECG (atrial fibrillation is a common embolic source), establish IV access (avoid the paretic arm), do NOT lower blood pressure in the field unless SBP > 220 or DBP > 120 (hypertension is a protective compensatory mechanism maintaining perfusion to the penumbra), maintain oxygen saturation above 94% but avoid hyperoxia, position patient with head of bed elevated 30 degrees if tolerated, determine stroke alert status and pre-notify the receiving stroke center.

Last known well (LKW) time documentation is arguably the single most important piece of information the paramedic provides. It determines eligibility for tPA (within 4.5 hours of LKW), thrombectomy (within 24 hours for select patients based on imaging), and guides the entire treatment algorithm. If the patient woke up with symptoms (wake-up stroke), the LKW time is when the patient was last observed normal before going to sleep. Bystander and family interviews to establish LKW time are critical.

Blood glucose must be checked on every patient with stroke-like symptoms. Hypoglycemia (below 60 mg/dL) can perfectly mimic stroke with focal neurological deficits including hemiparesis, aphasia, and altered mental status. Correcting hypoglycemia with dextrose (D10W or D50W) rapidly resolves these symptoms. Failing to check glucose and transporting a hypoglycemic patient as a stroke wastes critical time and delays appropriate treatment.

Blood pressure management in the prehospital setting is permissive. Hypertension in acute stroke is usually a compensatory mechanism maintaining cerebral perfusion to the ischemic penumbra. Lowering blood pressure can extend the infarct by reducing blood flow to already compromised tissue. Current guidelines recommend NOT treating hypertension in the field unless SBP exceeds 220 mmHg or DBP exceeds 120 mmHg, or the patient has concurrent conditions requiring treatment (aortic dissection, acute MI, hypertensive encephalopathy). If treatment is needed, short-acting titratable agents are preferred.

Transport decisions for stroke patients prioritize reaching the appropriate facility over minimizing transport time to the closest hospital. A primary stroke center (PSC) can administer tPA but cannot perform thrombectomy. A comprehensive stroke center (CSC) can perform both tPA and mechanical thrombectomy. For patients with suspected LVO (positive LVO screening tool), bypass to a CSC is recommended if the additional transport time is less than 15-30 minutes. Helicopter transport should be considered for remote areas where ground transport exceeds 60 minutes to the nearest stroke center.

The stroke chain of survival includes: recognition (public awareness of stroke signs), reaction (calling 911 immediately), response (paramedic assessment and pre-notification), reveal (ED imaging with CT scan within 20 minutes of arrival), Rx (tPA within 60 minutes of arrival for eligible patients, or thrombectomy within 90 minutes), and rehabilitation. The paramedic role in this chain is critical for compressing the time from symptom onset to treatment.`,
    riskFactors: [
      "Atrial fibrillation as the most common source of cardioembolic stroke from left atrial thrombus",
      "Chronic uncontrolled hypertension causing both ischemic and hemorrhagic stroke through vascular damage",
      "Diabetes mellitus accelerating atherosclerosis and increasing ischemic stroke risk by 2-4 times",
      "Previous TIA or stroke indicating high risk for recurrent cerebrovascular events",
      "Carotid artery stenosis greater than 70% as source of artery-to-artery embolism",
      "Smoking causing endothelial dysfunction, accelerated atherosclerosis, and increased thrombotic risk",
      "Age greater than 65 years with exponentially increasing stroke risk per decade",
      "Cocaine or methamphetamine use causing acute hypertensive crisis and hemorrhagic stroke",
      "Anticoagulant therapy increasing risk of hemorrhagic conversion in ischemic stroke"
    ],
    diagnostics: [
      "Cincinnati Prehospital Stroke Scale: facial droop, arm drift, speech abnormality (any 1 of 3 positive = 72% sensitivity)",
      "Large Vessel Occlusion screening using RACE, LAMS, or VAN scale to identify thrombectomy candidates",
      "Blood glucose measurement to rule out hypoglycemia mimicking stroke symptoms",
      "Last known well time documentation from patient, family, bystanders, or security footage",
      "12-lead ECG to identify atrial fibrillation as embolic source and concurrent cardiac conditions",
      "Blood pressure measurement for baseline documentation and treatment threshold assessment",
      "Pupil assessment for unilateral dilation suggesting herniation from hemorrhagic stroke or large territory infarct",
      "Glasgow Coma Scale for baseline neurological status documentation and trend monitoring"
    ],
    management: [
      "Activate stroke alert and pre-notify receiving stroke center with LKW time and CPSS findings",
      "Correct blood glucose below 60 mg/dL with dextrose before attributing symptoms to stroke",
      "Maintain SpO2 above 94% with supplemental oxygen but avoid hyperoxia (do not administer O2 if SpO2 >= 94%)",
      "Do NOT lower blood pressure unless SBP > 220 or DBP > 120 -- hypertension maintains penumbral perfusion",
      "Establish IV access in the non-paretic arm with 18G or larger for potential tPA administration at hospital",
      "Transport to comprehensive stroke center if LVO screening positive and additional transport time is reasonable",
      "Position patient with head of bed elevated 30 degrees to reduce intracranial pressure if tolerated",
      "Obtain 12-lead ECG en route to identify atrial fibrillation for post-stroke anticoagulation decision"
    ],
    nursingActions: [
      "Perform Cincinnati Prehospital Stroke Scale on every patient with acute neurological deficit or altered speech",
      "Document last known well time precisely -- this single piece of information determines tPA eligibility",
      "Check blood glucose on every patient with stroke-like symptoms before transporting as stroke alert",
      "Record blood pressure without treating unless it exceeds critical thresholds (SBP > 220 or DBP > 120)",
      "Perform LVO screening assessment to guide transport destination (PSC vs CSC)",
      "Communicate CPSS findings, LKW time, blood glucose, and vital signs to receiving facility during pre-notification",
      "Obtain list of current medications from family, focusing on anticoagulants (affects tPA eligibility)",
      "Monitor for signs of deterioration during transport: decreasing GCS, new vomiting, pupil changes"
    ],
    signs: [
      "Sudden unilateral facial droop with inability to smile symmetrically",
      "Arm drift or pronation with eyes closed indicating contralateral motor cortex or corticospinal tract involvement",
      "Slurred speech (dysarthria) or inability to find words (aphasia) from language center ischemia",
      "Sudden severe headache with neck stiffness suggesting subarachnoid hemorrhage",
      "Unilateral neglect (ignoring one side of the body or visual field) suggesting large MCA territory stroke",
      "Gaze deviation toward the side of the lesion (eyes look toward the affected hemisphere in cortical stroke)"
    ],
    medications: [
      { name: "Dextrose 10% (D10W)", dose: "250 mL IV bolus (25g dextrose)", route: "Intravenous", purpose: "Correct hypoglycemia mimicking stroke to prevent unnecessary stroke activation" },
      { name: "Normal Saline (0.9%)", dose: "250 mL IV bolus if hypotensive", route: "Intravenous", purpose: "Maintain perfusion and provide IV access for potential tPA administration at hospital" },
      { name: "Ondansetron (Zofran)", dose: "4 mg IV or ODT", route: "IV or sublingual", purpose: "Antiemetic for nausea and vomiting in acute stroke to prevent aspiration" }
    ],
    pearls: [
      "Last known well time is the single most important piece of information you provide -- get it right, get it documented",
      "Always check blood glucose before calling a stroke alert -- hypoglycemia perfectly mimics stroke",
      "Do NOT lower blood pressure in the field -- hypertension maintains blood flow to the ischemic penumbra",
      "Time is brain: 1.9 million neurons die per minute during large vessel occlusion -- every minute of delay matters",
      "LVO screening guides transport destination -- suspected LVO patients should go to comprehensive stroke centers for thrombectomy",
      "Wake-up strokes use the last time the patient was seen normal as the LKW time, not the time they woke up"
    ],
    quiz: [
      { question: "A patient has facial droop, arm drift, and slurred speech with onset 2 hours ago. Blood glucose is 42 mg/dL. What is the priority action?", options: ["Activate stroke alert and transport to stroke center", "Administer dextrose IV and reassess neurological status", "Perform CT scan to differentiate ischemic vs hemorrhagic", "Administer aspirin 325 mg for suspected ischemic stroke"], correctIndex: 1, rationale: "Blood glucose of 42 mg/dL is severely hypoglycemic and can produce all the symptoms of stroke. Dextrose must be administered first. If symptoms resolve after glucose correction, this was hypoglycemia, not stroke. If symptoms persist after normoglycemia, proceed with stroke activation. Failure to check glucose wastes critical time." },
      { question: "A stroke patient has BP 195/105. What is the correct prehospital management?", options: ["Administer labetalol to lower BP to 140/90", "Do not treat -- blood pressure is below the 220/120 threshold", "Administer nitroglycerin sublingually", "Start nitroprusside infusion to rapidly lower BP"], correctIndex: 1, rationale: "Current guidelines recommend NOT treating hypertension in acute stroke unless SBP > 220 or DBP > 120. The elevated BP of 195/105 is a compensatory mechanism maintaining cerebral perfusion pressure to the ischemic penumbra. Lowering it could extend the infarct by reducing blood flow to already compromised brain tissue." },
      { question: "What is the significance of determining last known well (LKW) time?", options: ["It helps calculate the size of the stroke", "It determines eligibility for tPA (within 4.5 hours) and guides the entire treatment algorithm", "It is required for insurance documentation", "It determines whether to transport by ground or air"], correctIndex: 1, rationale: "LKW time is the single most critical data point in acute stroke management. tPA eligibility requires symptom onset (or LKW) within 4.5 hours. Mechanical thrombectomy may be performed up to 24 hours based on imaging. Every treatment decision flows from accurate LKW time documentation." },
      { question: "A patient with suspected large vessel occlusion is 15 minutes from a primary stroke center and 40 minutes from a comprehensive stroke center. Where should you transport?", options: ["Primary stroke center because it is closer", "Comprehensive stroke center because LVO patients need thrombectomy", "The patient's preferred hospital", "The nearest emergency department for stabilization"], correctIndex: 1, rationale: "LVO patients require mechanical thrombectomy, which is only available at comprehensive stroke centers. The additional 25 minutes of transport is justified because the primary stroke center would need to administer tPA and then transfer the patient to a CSC anyway, adding significant delay. Direct transport to CSC shortens door-to-thrombectomy time." },
      { question: "On the Cincinnati Prehospital Stroke Scale, which finding has the highest sensitivity for stroke when present alone?", options: ["Facial droop only", "Arm drift only", "Speech abnormality only", "Any single abnormal finding (72% sensitivity)"], correctIndex: 3, rationale: "Any single abnormal finding on the CPSS has 72% sensitivity for stroke. All three findings together have higher specificity but lower sensitivity. The CPSS is designed as a rapid screening tool -- even one positive finding should trigger stroke alert activation and expedited transport." }
    ]
  },

  "sepsis-recognition-paramedic": {
    title: "Sepsis Recognition in the Prehospital Setting",
    cellular: `Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. It is the leading cause of death in hospitals worldwide, and early recognition and treatment dramatically improve survival. For every hour that appropriate antibiotic therapy is delayed in septic shock, mortality increases by approximately 7.6%. Prehospital sepsis recognition places the paramedic at the critical first link in the sepsis treatment chain.

The Sepsis-3 definition (2016) defines sepsis as a life-threatening organ dysfunction caused by infection, operationalized as an acute increase of 2 or more points on the Sequential Organ Failure Assessment (SOFA) score. Septic shock is a subset of sepsis with persistent hypotension requiring vasopressors to maintain MAP greater than or equal to 65 mmHg AND serum lactate greater than 2 mmol/L despite adequate fluid resuscitation. While the full SOFA score requires laboratory data not available in the field, the quick SOFA (qSOFA) provides a bedside screening tool: respiratory rate >= 22, altered mental status (GCS < 15), and systolic BP <= 100 mmHg. Two or more qSOFA criteria in a patient with suspected infection suggest sepsis and should trigger aggressive prehospital management.

The pathophysiology of sepsis involves a cascade of immune dysregulation. The initial infection triggers release of pathogen-associated molecular patterns (PAMPs) from microorganisms, which activate pattern recognition receptors (toll-like receptors) on immune cells. This triggers release of pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6) and anti-inflammatory mediators. In sepsis, this response becomes dysregulated -- the inflammatory cascade causes widespread endothelial damage, capillary leak, vasodilation, microthrombosis, and organ dysfunction. The result is distributive shock: massive vasodilation causes relative hypovolemia despite normal or elevated total blood volume, and capillary leak causes third-spacing of fluid into tissues.

Common infection sources in sepsis include pneumonia (most common), urinary tract infections (particularly in elderly and catheterized patients), intra-abdominal infections (appendicitis, cholecystitis, diverticulitis, peritonitis), skin and soft tissue infections (cellulitis, necrotizing fasciitis), meningitis, and endocarditis. The paramedic should assess for infection source while performing the primary assessment: productive cough, dysuria, abdominal pain, wound infections, indwelling catheter infections, and recent surgical procedures.

Prehospital sepsis screening should be performed on every patient with suspected infection and signs of physiological deterioration. The prehospital sepsis screening tool varies by protocol but commonly includes: temperature greater than 38.0C (100.4F) or less than 36.0C (96.8F), heart rate greater than 90, respiratory rate greater than 20, systolic BP less than 90 or MAP less than 65, altered mental status, and blood glucose greater than 200 mg/dL without known diabetes. Two or more criteria with suspected infection constitutes a positive sepsis screen.

Prehospital sepsis management follows the 1-hour bundle concept adapted for the field. Priorities include: recognition (positive sepsis screening), IV access (two large bore IVs), fluid resuscitation (30 mL/kg isotonic crystalloid bolus initiated in the field, reassess after each 500 mL), blood glucose measurement, temperature measurement (look for hypothermia as well as fever -- hypothermic sepsis carries higher mortality), oxygen administration (maintain SpO2 >= 94%), and early hospital notification with sepsis alert activation.

Fluid resuscitation is the primary prehospital intervention for sepsis. The Surviving Sepsis Campaign recommends 30 mL/kg of isotonic crystalloid (normal saline or lactated Ringer's) within the first 3 hours for sepsis-induced hypoperfusion. In a 70 kg patient, this is 2.1 liters. Paramedics should initiate this fluid bolus in the field. Signs of fluid responsiveness include: improving blood pressure, decreasing heart rate, improving capillary refill, and improving mental status. Signs of fluid overload include: pulmonary crackles, worsening oxygenation, and JVD. In patients with suspected cardiogenic component, smaller boluses (250 mL) with frequent reassessment are appropriate.

Lactate measurement, when available via point-of-care testing in the field, provides critical prognostic information. Lactate greater than 2 mmol/L indicates tissue hypoperfusion. Lactate greater than 4 mmol/L indicates severe sepsis with significantly elevated mortality. Serial lactate measurements guide resuscitation adequacy -- the goal is lactate clearance of greater than 10% within the first 6 hours.

Sepsis mimics that paramedics must consider include: anaphylaxis (distributive shock with urticaria, bronchospasm), adrenal crisis (hypotension, hypoglycemia, history of steroid use), pulmonary embolism (hypoxemia, tachycardia, pleuritic pain), and toxic shock syndrome (rash, multi-organ dysfunction, tampon use or wound packing). Differentiating these from sepsis is important because treatment differs, but when in doubt, treating empirically for sepsis while transporting is appropriate.

Pediatric sepsis recognition requires age-adjusted vital sign interpretation. Children compensate longer than adults before decompensating precipitously. Signs of pediatric sepsis include: tachycardia (often the earliest sign), altered mental status (irritability, inconsolability, or lethargy), mottled or cool extremities with capillary refill greater than 3 seconds (cold shock) or bounding pulses with flash capillary refill (warm shock), and tachypnea. Hypotension is a late and ominous sign in pediatric sepsis and indicates decompensated shock.`,
    riskFactors: [
      "Age greater than 65 years with diminished immune response and increased baseline infection risk",
      "Immunocompromised status (HIV, chemotherapy, transplant recipients, chronic steroid use)",
      "Indwelling medical devices (urinary catheters, central lines, prosthetic joints) as infection sources",
      "Chronic comorbidities (diabetes, COPD, heart failure, liver cirrhosis, chronic kidney disease)",
      "Recent hospitalization or surgery within 90 days increasing exposure to resistant organisms",
      "Nursing home or long-term care facility residence with higher infection and antibiotic resistance rates",
      "Alcohol use disorder with hepatic dysfunction and impaired immune response",
      "Splenectomy patients at risk for overwhelming post-splenectomy infection from encapsulated organisms"
    ],
    diagnostics: [
      "qSOFA screening (RR >= 22, altered mentation, SBP <= 100) at bedside for sepsis identification",
      "Temperature measurement including hypothermia screening (temp < 36C carries worse prognosis than fever)",
      "Blood glucose measurement to assess metabolic status and identify stress hyperglycemia",
      "Point-of-care lactate when available (> 2 mmol/L = tissue hypoperfusion, > 4 mmol/L = severe)",
      "Capillary refill time assessment (> 3 seconds indicates poor peripheral perfusion)",
      "12-lead ECG to assess for sepsis-related cardiac dysfunction and arrhythmia",
      "Pulse oximetry for oxygenation assessment and early detection of respiratory failure"
    ],
    management: [
      "Initiate 30 mL/kg isotonic crystalloid bolus for sepsis-induced hypoperfusion (2.1 L for 70 kg patient)",
      "Establish two large bore IV lines (16-18G) for rapid fluid administration",
      "Maintain SpO2 >= 94% with supplemental oxygen, prepare for advanced airway if GCS deteriorating",
      "Activate sepsis alert at receiving hospital to mobilize ED team, pharmacy, and lab for immediate intervention",
      "Administer 250 mL boluses with frequent reassessment in patients with suspected cardiogenic component",
      "Monitor for fluid overload (crackles, worsening SpO2, JVD) during aggressive resuscitation",
      "Keep patient warm -- hypothermic sepsis has higher mortality; use blankets and heated fluids",
      "Transport to appropriate facility with ED capable of managing septic shock (not freestanding urgent care)"
    ],
    nursingActions: [
      "Screen every patient with suspected infection for sepsis using qSOFA or local screening tool",
      "Document time of first contact and suspected infection source for hospital sepsis bundle timing",
      "Obtain blood glucose to exclude diabetic emergencies and assess metabolic stress response",
      "Record two full sets of vital signs before and after fluid bolus to assess response",
      "Communicate positive sepsis screen, vital signs, fluid administered, and suspected source to receiving facility",
      "Assess mental status changes as a sensitive early indicator of sepsis-related organ dysfunction",
      "Monitor capillary refill time as a clinical marker of peripheral perfusion during resuscitation",
      "Identify and document potential infection source (pneumonia, UTI, wound, abdominal) for ED team"
    ],
    signs: [
      "Fever (> 38.0C) or hypothermia (< 36.0C) with tachycardia and tachypnea suggesting systemic infection",
      "Altered mental status (confusion, lethargy, agitation) as early sign of sepsis-related organ dysfunction",
      "Warm, flushed skin with bounding pulses in early distributive (warm) shock",
      "Cool, mottled, clammy skin with prolonged capillary refill in late (cold) septic shock",
      "Hypotension (SBP < 90 or MAP < 65) unresponsive to initial fluid bolus suggesting septic shock",
      "Tachypnea (RR > 22) as respiratory compensation for metabolic acidosis from tissue hypoperfusion"
    ],
    medications: [
      { name: "Normal Saline (0.9%)", dose: "30 mL/kg IV bolus (initial resuscitation)", route: "Intravenous", purpose: "Volume replacement for distributive shock from sepsis-induced vasodilation and capillary leak" },
      { name: "Lactated Ringer's", dose: "30 mL/kg IV bolus (alternative to NS)", route: "Intravenous", purpose: "Balanced crystalloid with lower chloride load, may reduce hyperchloremic acidosis risk" },
      { name: "Dextrose 10% (D10W)", dose: "250 mL IV if blood glucose < 60 mg/dL", route: "Intravenous", purpose: "Correct hypoglycemia in septic patients, particularly those with hepatic dysfunction" }
    ],
    pearls: [
      "Every hour of antibiotic delay in septic shock increases mortality by 7.6% -- prehospital recognition and pre-notification compress this timeline",
      "Hypothermic sepsis (temp < 36C) carries HIGHER mortality than febrile sepsis -- do not dismiss afebrile patients",
      "qSOFA is a screening tool, not a diagnostic test -- a negative qSOFA does not rule out sepsis in patients with clinical suspicion",
      "Altered mental status may be the ONLY qSOFA criterion positive in elderly sepsis patients -- subtle confusion counts",
      "Pediatric sepsis compensation is prolonged then sudden -- tachycardia without hypotension can represent compensated shock requiring aggressive treatment",
      "Lactate greater than 4 mmol/L identifies patients with high mortality who need immediate aggressive resuscitation regardless of blood pressure"
    ],
    quiz: [
      { question: "A 72-year-old nursing home patient has temperature 35.4C, HR 112, RR 26, BP 88/52, and confusion. How many qSOFA criteria are met?", options: ["One (altered mentation only)", "Two (altered mentation + SBP <= 100)", "Three (all criteria met)", "Zero -- hypothermia excludes sepsis"], correctIndex: 1, rationale: "qSOFA criteria: RR >= 22 (met, RR 26), altered mentation/GCS < 15 (met, confusion), SBP <= 100 (met, SBP 88). Actually all three are met. But even 2 positive criteria with suspected infection should trigger sepsis activation. Hypothermia does NOT exclude sepsis -- it carries higher mortality." },
      { question: "How much isotonic crystalloid should be administered in the first 3 hours for a 80 kg patient with sepsis-induced hypoperfusion?", options: ["500 mL", "1000 mL", "2400 mL (30 mL/kg)", "4000 mL"], correctIndex: 2, rationale: "The Surviving Sepsis Campaign recommends 30 mL/kg of isotonic crystalloid within 3 hours for sepsis-induced hypoperfusion. For an 80 kg patient: 80 x 30 = 2400 mL. This should be initiated in the prehospital setting and continued in the ED." },
      { question: "Which infection source is the most common cause of sepsis?", options: ["Urinary tract infection", "Pneumonia", "Skin and soft tissue infection", "Meningitis"], correctIndex: 1, rationale: "Pneumonia is the most common source of sepsis, accounting for approximately 35-50% of cases. UTI is the second most common. Identifying the likely infection source in the field helps guide empiric antibiotic selection and diagnostic workup at the hospital." },
      { question: "A pediatric patient has HR 180, capillary refill 5 seconds, mottled extremities, and BP 70/40. What type of shock is this?", options: ["Compensated warm septic shock", "Decompensated cold septic shock", "Cardiogenic shock", "Hypovolemic shock"], correctIndex: 1, rationale: "Mottled extremities with prolonged capillary refill (> 3 seconds) indicate cold shock physiology (vasoconstriction, poor perfusion). The hypotension indicates decompensation -- pediatric patients maintain blood pressure until late in the shock progression, so hypotension represents a critical state requiring immediate aggressive resuscitation." },
      { question: "Why should the paramedic pre-notify the receiving hospital of a sepsis alert?", options: ["It is a legal requirement for all medical emergencies", "It allows the hospital to prepare antibiotics, labs, and IV access before arrival, reducing time to treatment", "It allows the hospital to redirect ambulances to other facilities", "Pre-notification is only recommended for cardiac emergencies"], correctIndex: 1, rationale: "Sepsis pre-notification allows the ED to prepare: pharmacy can draw up empiric antibiotics, lab can prepare for blood cultures, and nursing can set up IV access equipment. This compresses the time from ED arrival to antibiotic administration, directly reducing mortality." }
    ]
  },

  "airway-emergencies-paramedic": {
    title: "Prehospital Airway Emergencies",
    cellular: `Airway emergencies are the most time-critical situations a paramedic faces. Complete airway obstruction causes death within 4-6 minutes from cerebral anoxia. The paramedic must rapidly recognize, assess, and manage airway compromise using a stepwise approach from basic to advanced interventions.

Foreign body airway obstruction (FBAO) is the most common cause of acute airway obstruction in conscious patients. In adults, food (especially meat) is the most common culprit, often occurring during eating with simultaneous talking or laughing. In children, small objects (coins, toys, grapes, hot dogs, peanuts) are typical causes. Recognition: the universal choking sign (hands clutching the throat), inability to speak, cough, or breathe, cyanosis, and high-pitched stridor or complete silence. Mild obstruction allows some air exchange (able to cough forcefully, may wheeze between coughs) -- encourage forceful coughing and do not interfere. Severe obstruction (cannot speak, weak or absent cough, worsening cyanosis) requires immediate intervention.

For conscious adults and children over 1 year with severe FBAO: deliver abdominal thrusts (Heimlich maneuver). Stand behind the patient, place fist above the navel and below the xiphoid, grasp with other hand, and deliver quick upward thrusts until the object is expelled or the patient becomes unconscious. For pregnant or obese patients where abdominal thrusts are not feasible: use chest thrusts (same hand position as CPR). For infants under 1 year: alternate 5 back blows (support infant face-down on forearm, deliver between the scapulae) with 5 chest thrusts (2 fingers on sternum, same position as infant CPR). For unconscious patients with FBAO: begin CPR, look in the mouth before each ventilation attempt, remove visible objects with finger sweep (only if visible), attempt ventilation, and continue CPR. Do not perform blind finger sweeps.

Anaphylaxis-related airway obstruction occurs from massive upper airway edema (laryngeal and pharyngeal swelling) and bronchospasm. It can progress from mild throat tightness to complete obstruction within minutes. Recognition: urticaria, angioedema (lip/tongue/facial swelling), stridor, hoarse voice, dyspnea, wheezing, hypotension, and tachycardia. Treatment: epinephrine 0.3-0.5 mg IM (1:1000) into anterolateral thigh is first-line and must be given immediately. Second dose in 5-15 minutes if no improvement. Establish IV access for volume resuscitation (1-2 L NS bolus for hypotension). Adjuncts include albuterol nebulization for bronchospasm, diphenhydramine 25-50 mg IV for histamine blockade, and methylprednisolone 125 mg IV for preventing biphasic reaction. Early intubation if airway edema is progressing -- delay makes intubation increasingly difficult.

Croup (laryngotracheobronchitis) is a viral upper airway infection causing subglottic edema, primarily in children 6 months to 3 years. Presentation: barking (seal-like) cough, inspiratory stridor, hoarse voice, usually worse at night. The Westley Croup Score rates severity: mild (occasional barking cough, no stridor at rest), moderate (stridor at rest, mild retractions, no agitation), severe (significant stridor, severe retractions, agitation, altered consciousness). Treatment: cool mist or humidified air, dexamethasone 0.6 mg/kg PO/IM (max 10 mg), nebulized racemic epinephrine 0.5 mL of 2.25% solution for moderate-severe croup. Keep the child calm -- agitation worsens stridor.

Epiglottitis is a bacterial infection (historically Haemophilus influenzae type b, now more often Streptococcus, Staphylococcus in vaccinated populations) causing rapid supraglottic swelling. It can progress to complete obstruction. Classic presentation: rapid onset high fever, severe sore throat, drooling (unable to swallow secretions), muffled voice, tripod positioning (sitting forward with neck extended), and toxic appearance. Do NOT examine the throat with a tongue depressor -- this can trigger complete obstruction and laryngospasm. Treatment: keep patient calm and in position of comfort, humidified oxygen, prepare for advanced airway (surgical airway equipment at bedside), and rapid transport.

Burns and inhalation injury cause airway obstruction through thermal injury to the upper airway, chemical irritation of the lower airway, and progressive edema. Indicators of inhalation injury: facial burns, singed nasal hair, carbonaceous sputum, hoarse voice, stridor, and history of fire in enclosed space. Upper airway edema can progress rapidly over 12-24 hours and may be delayed after the initial burn. Early intubation is indicated if inhalation injury is suspected because waiting for signs of obstruction may make intubation impossible once edema develops.

Angioedema presents with rapid-onset swelling of the face, lips, tongue, and larynx. It can be allergic (histamine-mediated, often with urticaria) or hereditary/ACE inhibitor-induced (bradykinin-mediated, without urticaria). ACE inhibitor-induced angioedema can occur at any time during therapy, even after years of use. Treatment for allergic angioedema: epinephrine, antihistamines, steroids. For hereditary angioedema: icatibant, C1-esterase inhibitor concentrate, or fresh frozen plasma. For ACE inhibitor angioedema: discontinue ACE inhibitor, epinephrine for severe cases, and prepare for advanced airway.

Advanced airway management in the field follows a structured approach. Bag-valve-mask ventilation is the first-line ventilation technique. Proper technique requires: E-C clamp grip (fingers forming E under the jaw, thumb and index forming C over the mask), adequate seal, head tilt-chin lift or jaw thrust, and two-person technique when possible (one manages the mask, one squeezes the bag). If BVM ventilation fails, proceed to supraglottic airway (LMA, King LT, i-gel) or endotracheal intubation based on protocol and training. Cricothyrotomy is the rescue technique when all other airway interventions fail (cannot intubate, cannot oxygenate).`,
    riskFactors: [
      "Eating while talking or laughing creating aspiration risk for food-related airway obstruction",
      "History of previous anaphylaxis indicating risk for recurrent severe allergic airway reactions",
      "ACE inhibitor therapy with risk of angioedema-related airway compromise at any time during treatment",
      "Burn injury in enclosed spaces with inhalation exposure causing progressive airway edema",
      "Pediatric patients under 3 years with small airway caliber where minimal edema causes significant obstruction",
      "History of prior difficult airway or anatomical variants complicating emergency airway management",
      "Cervical spine injury limiting head extension and restricting airway positioning options",
      "Morbid obesity reducing functional residual capacity and shortening the safe apnea period"
    ],
    diagnostics: [
      "Visual assessment of airway patency: mouth opening, tongue position, foreign body, edema, blood, secretions",
      "Stridor assessment: inspiratory stridor indicates supraglottic obstruction, expiratory stridor indicates subglottic or bronchial",
      "Westley Croup Score for pediatric croup severity grading and treatment decisions",
      "Pulse oximetry for continuous oxygenation monitoring during airway management",
      "Capnography for airway placement confirmation and continuous ventilation monitoring",
      "Mallampati assessment and LEMON criteria evaluation when time permits for predicted difficult airway"
    ],
    management: [
      "Conscious choking adult: abdominal thrusts (Heimlich maneuver) until object expelled or patient becomes unconscious",
      "Infant choking: alternate 5 back blows with 5 chest thrusts until object expelled or infant becomes unconscious",
      "Anaphylaxis: epinephrine 0.3-0.5 mg IM immediately, repeat in 5-15 minutes if no response",
      "Croup: nebulized racemic epinephrine 0.5 mL of 2.25% and dexamethasone 0.6 mg/kg PO/IM for moderate-severe",
      "Suspected epiglottitis: keep patient calm, do NOT examine throat, prepare for advanced airway, rapid transport",
      "Inhalation injury: early intubation before edema progresses to make intubation impossible",
      "Cannot intubate cannot oxygenate: immediate cricothyrotomy as definitive rescue",
      "Two-person BVM technique for optimal mask seal and ventilation delivery"
    ],
    nursingActions: [
      "Recognize the universal choking sign and differentiate mild from severe obstruction before intervening",
      "Position infants correctly for back blows: face down on forearm with head lower than trunk, supported on thigh",
      "Administer IM epinephrine immediately for anaphylaxis -- do not wait for IV access to start treatment",
      "Avoid agitating children with croup or suspected epiglottitis -- keep them in position of comfort with parent",
      "Assess for inhalation injury indicators: singed nasal hair, carbonaceous sputum, hoarse voice, facial burns",
      "Prepare advanced airway equipment prophylactically when progressive airway compromise is anticipated",
      "Confirm ETT placement with continuous waveform capnography after every intubation attempt",
      "Have surgical airway equipment immediately accessible when managing any predicted or actual difficult airway"
    ],
    signs: [
      "Universal choking sign (hands clutching throat) with inability to speak indicating severe FBAO",
      "Inspiratory stridor with barking cough and hoarse voice suggesting croup in pediatric patients",
      "Drooling, tripod positioning, muffled voice, and toxic appearance suggesting epiglottitis",
      "Urticaria, facial/tongue swelling, stridor, and hypotension indicating anaphylaxis",
      "Facial burns with singed nasal hair and carbonaceous sputum indicating inhalation injury",
      "Progressive hoarseness and stridor after burn exposure indicating developing airway edema"
    ],
    medications: [
      { name: "Epinephrine (1:1000)", dose: "0.3-0.5 mg IM into anterolateral thigh", route: "Intramuscular", purpose: "First-line treatment for anaphylaxis: bronchodilation, vasoconstriction, reduced edema" },
      { name: "Racemic Epinephrine", dose: "0.5 mL of 2.25% solution via nebulizer", route: "Inhaled", purpose: "Reduce subglottic edema in moderate-to-severe croup via topical vasoconstriction" },
      { name: "Dexamethasone", dose: "0.6 mg/kg PO or IM (max 10 mg)", route: "Oral or IM", purpose: "Reduce airway inflammation in croup (onset 2-4 hours, prevents return of symptoms)" },
      { name: "Diphenhydramine", dose: "25-50 mg IV or IM", route: "IV or IM", purpose: "H1 antihistamine adjunct for anaphylaxis to reduce histamine-mediated symptoms" }
    ],
    pearls: [
      "In conscious choking, encourage forceful coughing for mild obstruction -- only intervene with thrusts for severe obstruction",
      "Never perform blind finger sweeps -- only remove a foreign body if you can see it in the mouth",
      "IM epinephrine for anaphylaxis must be given IMMEDIATELY -- antihistamines and steroids are adjuncts, not replacements",
      "Do NOT examine the throat of a child with suspected epiglottitis -- this can trigger complete obstruction",
      "In inhalation injury, intubate early and prophylactically -- waiting for overt obstruction may make intubation impossible",
      "Cricothyrotomy is the ONLY rescue for true cannot-intubate-cannot-oxygenate -- hesitation costs lives"
    ],
    quiz: [
      { question: "A 2-year-old is choking with no cough, no cry, and cyanosis. What is the correct intervention sequence?", options: ["Abdominal thrusts until object expelled", "5 back blows alternating with 5 chest thrusts", "Blind finger sweep followed by CPR", "Immediate intubation to bypass the obstruction"], correctIndex: 1, rationale: "For infants and children under 1 year with severe FBAO, alternate 5 back blows (infant face-down on forearm, blows between scapulae) with 5 chest thrusts (2 fingers on sternum). For children 1-8, abdominal thrusts. At 2 years old, use abdominal thrusts. Actually, for under 1 year it's back blows/chest thrusts; for 1 year and older it's abdominal thrusts." },
      { question: "A patient with known peanut allergy has diffuse urticaria, tongue swelling, stridor, and BP 78/40. What is the priority treatment?", options: ["Diphenhydramine 50 mg IV", "Albuterol nebulizer for bronchospasm", "Epinephrine 0.3-0.5 mg IM immediately", "Methylprednisolone 125 mg IV"], correctIndex: 2, rationale: "Epinephrine IM is the FIRST and most important treatment for anaphylaxis. It addresses all components: bronchodilation (beta-2), vasoconstriction (alpha-1), reduced edema, and increased cardiac output (beta-1). Antihistamines and steroids are adjuncts that work too slowly to be primary therapy in severe anaphylaxis." },
      { question: "A child presents with barking cough, inspiratory stridor at rest, moderate retractions, and mild agitation. What treatment is indicated?", options: ["Nebulized racemic epinephrine and oral dexamethasone", "Immediate intubation", "Throat examination with tongue depressor", "Cool mist only with monitoring"], correctIndex: 0, rationale: "This presentation (stridor at rest with retractions and agitation) represents moderate-to-severe croup. Treatment includes nebulized racemic epinephrine for immediate topical vasoconstriction and subglottic edema reduction, plus dexamethasone 0.6 mg/kg for sustained anti-inflammatory effect (onset 2-4 hours)." },
      { question: "What airway finding is an absolute indication for early intubation in a burn patient?", options: ["First-degree facial burns without other signs", "Carbonaceous sputum with progressive hoarseness and stridor", "Superficial hand burns with intact airway", "History of fire without respiratory symptoms"], correctIndex: 1, rationale: "Carbonaceous sputum with progressive hoarseness and stridor indicates inhalation injury with developing upper airway edema. Early intubation is critical because airway edema can progress over 12-24 hours, and delaying intubation until obstruction occurs may make it impossible due to severe glottic and supraglottic swelling." },
      { question: "A patient cannot be intubated and cannot be ventilated with BVM or supraglottic airway. What is the next intervention?", options: ["Continue BVM attempts with repositioning", "Attempt fiberoptic intubation", "Perform cricothyrotomy", "Wait for hospital arrival for surgical airway"], correctIndex: 2, rationale: "Cannot intubate, cannot oxygenate (CICO) is the most critical emergency in airway management. Cricothyrotomy (surgical or needle) is the ONLY definitive rescue. Continuing failed techniques wastes time and allows progressive hypoxia. In the field, surgical cricothyrotomy with a scalpel and bougie/ETT is preferred over needle cricothyrotomy." }
    ]
  },

  "ob-emergencies-paramedic": {
    title: "Obstetric Emergencies",
    cellular: `Obstetric emergencies in the prehospital setting are among the highest-stress situations a paramedic encounters. Two patients (mother and fetus) must be managed simultaneously, and many paramedics have limited exposure to childbirth. The key principle is that maternal stabilization is the best fetal resuscitation -- treating the mother treats the baby.

Normal labor progresses through three stages. First stage: onset of regular contractions to full cervical dilation (10 cm). This is subdivided into latent phase (0-6 cm, may last 8-12 hours for nulliparous women) and active phase (6-10 cm, approximately 1 cm/hour). Second stage: full dilation to delivery of the infant (typically 1-2 hours for nulliparous, 20-60 minutes for multiparous). Third stage: delivery of the placenta (5-30 minutes after infant delivery). Imminent delivery is indicated by: contractions less than 2 minutes apart lasting 60-90 seconds, urge to push, crowning (visualization of fetal head at vaginal introitus), and bulging perineum.

Normal delivery management: position mother in supine with left lateral tilt (to prevent supine hypotensive syndrome from aortocaval compression), prepare delivery equipment (gloves, towels, clamps, scissors, bulb syringe, warm blankets), support the perineum as the head delivers (do not push or pull on the head), suction the mouth then nose with bulb syringe after head delivers, check for nuchal cord (cord around the neck -- if loose, slip it over the head; if tight, clamp and cut before delivering the body), deliver anterior shoulder by gentle downward traction, then posterior shoulder by gentle upward traction, dry and stimulate the infant immediately, clamp the cord in two places and cut between clamps (1-3 minutes delayed clamping if infant is stable), deliver the placenta with gentle traction on the cord (do not pull forcefully), massage the uterine fundus to promote contraction, and initiate breastfeeding if mother and infant are stable.

Breech presentation occurs in 3-4% of term deliveries. In the prehospital setting, breech delivery should only be managed if delivery is imminent and transport is not possible. For frank breech (buttocks first, legs flexed at hips, extended at knees): support the infant's body as it delivers, do not pull. Allow the body to deliver to the level of the umbilicus, then gently rotate to deliver the shoulders. For the trapped after-coming head: Mauriceau-Smellie-Veit maneuver (flex the head by placing two fingers of one hand on the fetal maxilla, the other hand on the fetal occiput, and apply flexion while an assistant applies suprapubic pressure). If the head does not deliver within 30 seconds, transport immediately with the infant's body supported and warm.

Prolapsed umbilical cord is a true obstetric emergency. The cord prolapses through the cervix before the presenting part, and compression between the fetus and the birth canal occludes fetal blood flow. Treatment: do NOT push the cord back in. Insert a gloved hand into the vagina and elevate the presenting part off the cord (maintain constant upward pressure). Position the mother in knee-chest position or steep Trendelenburg to use gravity to reduce pressure on the cord. Fill the bladder with 500-750 mL NS via Foley catheter to elevate the presenting part (if available and trained). Keep the exposed cord warm and moist with saline-soaked gauze. Transport emergently for immediate cesarean section. Do not attempt delivery.

Placenta previa occurs when the placenta implants over or near the cervical os. It presents with painless bright red vaginal bleeding in the third trimester. Placenta previa is an absolute contraindication to vaginal examination (inserting fingers or instruments into the cervix can cause catastrophic hemorrhage). Management: IV access with large bore lines, fluid resuscitation, left lateral positioning, oxygen, and rapid transport. Do NOT perform vaginal examination.

Placental abruption occurs when the placenta separates from the uterine wall before delivery. It presents with painful vaginal bleeding (may be concealed if blood is trapped behind the placenta), rigid or tender uterus (board-like abdomen), and signs of hemorrhagic shock. Management: IV access with two large bore lines, aggressive fluid resuscitation, left lateral positioning, oxygen, and emergent transport. Severe abruption causes DIC and can be rapidly fatal.

Postpartum hemorrhage (PPH) is defined as blood loss greater than 500 mL after vaginal delivery or greater than 1000 mL after cesarean delivery. The most common cause is uterine atony (the uterus fails to contract after delivery). Management of uterine atony: vigorous bimanual uterine massage (one hand on the abdomen pressing down on the fundus, two fingers of the other hand in the vagina pressing up on the anterior uterine wall), oxytocin 10-40 units in 1 L NS infusion (do NOT give IV push -- causes hypotension), breastfeeding (stimulates oxytocin release), empty the bladder (full bladder prevents uterine contraction). If the uterus remains atonic despite massage: TXA 1 g IV over 10 minutes, and rapid transport.

Eclampsia is the occurrence of seizures in a patient with preeclampsia (hypertension and proteinuria after 20 weeks gestation). Preeclampsia presents with: BP greater than 140/90, headache, visual disturbances, right upper quadrant pain, and edema. Eclamptic seizures can occur antepartum, intrapartum, or postpartum (up to 6 weeks after delivery). Treatment of eclamptic seizure: protect the airway, administer magnesium sulfate 4-6 g IV over 15-20 minutes (loading dose), then 1-2 g/hour infusion. Magnesium is the drug of choice for eclamptic seizures -- it is more effective than diazepam or phenytoin for preventing recurrent eclamptic seizures. Monitor for magnesium toxicity: loss of deep tendon reflexes (first sign), respiratory depression, and cardiac arrest. Calcium gluconate 1 g IV is the antidote for magnesium toxicity.`,
    riskFactors: [
      "Grand multiparity (5 or more deliveries) increasing risk of uterine atony and rapid precipitous delivery",
      "Prior cesarean delivery with risk of uterine rupture during labor contractions",
      "Placenta previa with risk of catastrophic hemorrhage during labor or vaginal examination",
      "Preeclampsia/eclampsia with risk of seizures, stroke, and hepatic rupture",
      "Premature rupture of membranes increasing risk of cord prolapse and infection",
      "Multiple gestation (twins, triplets) with higher risk of malpresentation and preterm delivery",
      "Substance use during pregnancy (cocaine causes placental abruption, opioids cause neonatal abstinence)",
      "Age extremes (under 16 or over 40) with increased obstetric complication rates"
    ],
    diagnostics: [
      "Contraction timing: frequency, duration, and intensity to assess labor stage and delivery imminence",
      "Visual inspection for crowning to determine whether delivery is imminent or transport is appropriate",
      "Fundal height assessment as estimate of gestational age (fundus at umbilicus ~20 weeks, at xiphoid ~36 weeks)",
      "Blood pressure measurement for preeclampsia screening (BP > 140/90 with headache or visual changes)",
      "Fetal heart rate assessment if Doppler available (normal 110-160 bpm, concerning < 110 or > 160)",
      "Assessment of vaginal bleeding: color (bright red vs dark), amount, and associated pain for etiology",
      "GCS and seizure assessment for eclampsia evaluation in hypertensive pregnant patients"
    ],
    management: [
      "Position in left lateral tilt to prevent aortocaval compression and maintain cardiac output",
      "Prepare for field delivery if crowning is present and transport time exceeds 10-15 minutes",
      "Manage nuchal cord: slip over head if loose, clamp and cut if tight before body delivery",
      "Vigorous bimanual uterine massage for postpartum hemorrhage from uterine atony",
      "Administer magnesium sulfate 4-6 g IV for eclamptic seizures (preferred over benzodiazepines)",
      "Elevate presenting part off prolapsed cord with gloved hand and position mother in knee-chest",
      "Do NOT perform vaginal examination when placenta previa is suspected -- transport for ultrasound",
      "Administer TXA 1 g IV for postpartum hemorrhage refractory to uterine massage and oxytocin"
    ],
    nursingActions: [
      "Position all pregnant patients beyond 20 weeks in left lateral tilt or with manual left uterine displacement",
      "Assess for imminent delivery signs: contractions < 2 min apart, crowning, urge to push, bulging perineum",
      "Support but do not pull on the fetal head during delivery -- allow natural delivery forces",
      "Dry and stimulate the newborn immediately after delivery and keep warm to prevent hypothermia",
      "Massage the uterine fundus firmly after placental delivery to promote contraction and prevent hemorrhage",
      "Monitor for magnesium toxicity: check deep tendon reflexes, respiratory rate, and consciousness",
      "Document estimated blood loss during and after delivery for receiving facility triage",
      "Monitor maternal vital signs every 5 minutes during active hemorrhage or post-eclamptic seizure"
    ],
    signs: [
      "Crowning and bulging perineum with regular contractions indicating imminent delivery",
      "Painless bright red vaginal bleeding in third trimester suggesting placenta previa",
      "Painful bleeding with rigid tender uterus (board-like abdomen) suggesting placental abruption",
      "Visible cord at vaginal introitus indicating prolapsed umbilical cord requiring emergent intervention",
      "Boggy non-contracted uterus after delivery with ongoing bleeding indicating uterine atony",
      "Seizure activity with hypertension in pregnancy indicating eclampsia"
    ],
    medications: [
      { name: "Magnesium Sulfate", dose: "4-6 g IV over 15-20 min, then 1-2 g/hr infusion", route: "Intravenous", purpose: "First-line treatment and prophylaxis for eclamptic seizures" },
      { name: "Oxytocin (Pitocin)", dose: "10-40 units in 1 L NS infusion (NOT IV push)", route: "IV infusion", purpose: "Promote uterine contraction for postpartum hemorrhage from uterine atony" },
      { name: "Calcium Gluconate", dose: "1 g IV over 3 minutes", route: "Intravenous", purpose: "Antidote for magnesium toxicity (loss of reflexes, respiratory depression)" },
      { name: "TXA", dose: "1 g IV over 10 minutes", route: "Intravenous", purpose: "Antifibrinolytic for postpartum hemorrhage refractory to uterine massage and oxytocin" }
    ],
    pearls: [
      "Treating the mother IS treating the baby -- maternal stabilization is the best fetal resuscitation",
      "Left lateral tilt after 20 weeks gestation prevents supine hypotensive syndrome from aortocaval compression",
      "Magnesium sulfate is superior to benzodiazepines for eclamptic seizure prevention and treatment",
      "Never perform vaginal examination when placenta previa is suspected -- digital exam can cause fatal hemorrhage",
      "For prolapsed cord: elevate the presenting part, knee-chest position, keep cord warm and moist, emergent transport",
      "Postpartum hemorrhage from atony: fundal massage is the most important initial intervention"
    ],
    quiz: [
      { question: "A pregnant patient at 32 weeks has painless bright red vaginal bleeding. What is the most likely diagnosis and what should you NOT do?", options: ["Placental abruption -- do not administer fluids", "Placenta previa -- do not perform vaginal examination", "Normal bloody show -- no intervention needed", "Ectopic pregnancy -- prepare for surgical intervention"], correctIndex: 1, rationale: "Painless bright red vaginal bleeding in the third trimester is the classic presentation of placenta previa. Vaginal examination is absolutely contraindicated because inserting fingers through the cervix can disrupt the placenta overlying the os, causing catastrophic hemorrhage. Management: IV access, fluid resuscitation, left lateral positioning, and rapid transport." },
      { question: "During delivery, you notice the umbilical cord is wrapped tightly around the baby's neck. What should you do?", options: ["Pull the cord over the head forcefully", "Clamp the cord in two places and cut between the clamps before delivering the body", "Push the baby back in and transport for cesarean section", "Ignore the cord and continue delivery"], correctIndex: 1, rationale: "A tight nuchal cord that cannot be slipped over the head must be clamped in two places and cut between the clamps before delivering the body. This prevents strangulation during delivery. If the cord is loose, it can simply be slipped over the head." },
      { question: "What is the first-line drug for eclamptic seizures?", options: ["Diazepam 10 mg IV", "Phenytoin 1 g IV", "Magnesium sulfate 4-6 g IV", "Lorazepam 4 mg IV"], correctIndex: 2, rationale: "Magnesium sulfate is the drug of choice for both treatment and prevention of eclamptic seizures. The Magpie Trial and other studies demonstrated its superiority over diazepam and phenytoin for preventing recurrent eclamptic seizures. Loading dose is 4-6 g IV over 15-20 minutes." },
      { question: "After delivering the placenta, the uterus is boggy and the mother is bleeding heavily. What is the priority intervention?", options: ["Administer oxytocin IV push", "Vigorous bimanual uterine massage", "Pack the vagina with gauze", "Apply pressure to the perineum"], correctIndex: 1, rationale: "Vigorous bimanual uterine massage is the most important initial intervention for postpartum hemorrhage from uterine atony. One hand on the abdomen presses down on the fundus while two fingers in the vagina press up on the anterior uterine wall. This stimulates uterine contraction and reduces hemorrhage. Oxytocin is added as an infusion (never IV push) as an adjunct." },
      { question: "A visible loop of umbilical cord is protruding from the vagina with the baby undelivered. What is the correct management?", options: ["Push the cord back into the vagina", "Clamp and cut the cord immediately", "Insert a gloved hand to elevate the presenting part off the cord and transport emergently", "Attempt immediate vaginal delivery"], correctIndex: 2, rationale: "Prolapsed umbilical cord requires inserting a gloved hand to elevate the presenting part (baby's head or buttocks) off the cord to relieve compression. Position the mother in knee-chest or steep Trendelenburg. Keep the exposed cord warm and moist with saline gauze. Transport emergently for cesarean delivery. Do not push the cord back in or attempt to deliver vaginally." }
    ]
  },

  "field-triage-paramedic": {
    title: "Field Triage and START/JumpSTART",
    cellular: `Field triage in mass casualty incidents (MCI) is fundamentally different from individual patient assessment. When the number of patients exceeds available resources, the goal shifts from doing everything possible for each patient to doing the greatest good for the greatest number. Triage systems provide a rapid, reproducible method to sort patients by severity and treatment priority.

The Simple Triage and Rapid Treatment (START) system is the most widely used adult field triage algorithm in North America. It categorizes patients into four color-coded priority levels using three physiological parameters assessed in under 30 seconds per patient: respiratory status, perfusion status, and mental status.

START Triage Algorithm:
Step 1: Can the patient walk? If YES, tag GREEN (Minor/Walking Wounded) and direct to a designated treatment area. Walking patients are assessed last. If NO, proceed to Step 2.

Step 2: Assess respirations. If the patient is NOT breathing: reposition the airway (head tilt-chin lift). If breathing starts: tag RED (Immediate). If NO breathing after repositioning: tag BLACK (Deceased/Expectant). If the patient IS breathing: assess respiratory rate. Rate greater than 30 breaths/min: tag RED (Immediate). Rate less than or equal to 30: proceed to Step 3.

Step 3: Assess perfusion. Check radial pulse or capillary refill. No radial pulse OR capillary refill greater than 2 seconds: tag RED (Immediate). Control any major bleeding. Radial pulse present AND capillary refill less than or equal to 2 seconds: proceed to Step 4.

Step 4: Assess mental status. Can the patient follow simple commands? ("Squeeze my hand," "Open your eyes"). Unable to follow commands: tag RED (Immediate). Follows commands: tag YELLOW (Delayed).

The JumpSTART system is the pediatric modification of START triage, designed for children ages 1-8 years. It accounts for pediatric-specific physiology including higher baseline respiratory rates, different perfusion assessment, and the importance of ventilation in pediatric resuscitation.

JumpSTART modifications:
Step 1: Can the child walk? If YES, tag GREEN. If NO (or if infant/child cannot walk due to age): proceed to Step 2.

Step 2: Assess respirations. If NOT breathing: check for a palpable pulse. If NO pulse: tag BLACK. If PULSE PRESENT: give 5 rescue breaths. If breathing resumes: tag RED. If NO breathing after 5 rescue breaths: tag BLACK. If the child IS breathing: assess respiratory rate. Rate less than 15 OR greater than 45: tag RED. Rate 15-45: proceed to Step 3.

Step 3: Assess perfusion. Check palpable peripheral pulse. NO peripheral pulse: tag RED. Peripheral pulse present: proceed to Step 4.

Step 4: Assess mental status using AVPU (Alert, responds to Voice, responds to Pain, Unresponsive). Inappropriate response to pain (posturing) or Unresponsive: tag RED. Alert, Voice responsive, or appropriate Pain response: tag YELLOW.

The key JumpSTART difference from START is the provision of 5 rescue breaths for apneic children with a pulse. This reflects the higher likelihood of respiratory-cause arrest in children, where brief ventilation may restore spontaneous breathing. This step is NOT performed in adult START triage.

Triage categories and their meanings:
RED (Immediate, Priority 1): Life-threatening conditions that are survivable with immediate intervention. Examples: airway obstruction, tension pneumothorax, severe hemorrhage, open chest wounds, shock. These patients are treated and transported first.

YELLOW (Delayed, Priority 2): Serious injuries that are not immediately life-threatening. Treatment can be delayed 1-4 hours without significantly increasing mortality. Examples: open fractures without vascular compromise, moderate burns, stable abdominal injuries, closed head injury with normal mental status.

GREEN (Minor, Priority 3): Walking wounded with minor injuries. Treatment can be delayed hours to days. Examples: minor lacerations, sprains, small burns, psychological distress. These patients should be directed to a specific area to prevent them from overwhelming treatment areas.

BLACK (Deceased/Expectant, Priority 4): Dead or injuries so severe that survival is unlikely even with full treatment. In MCI triage, resources directed to expectant patients are resources diverted from salvageable patients. Examples: cardiac arrest in MCI (no CPR initiated), massive head injury with brain matter exposed, burns greater than 90% TBSA.

The Incident Command System (ICS) provides the organizational framework for MCI management. Key positions include: Incident Commander (overall scene authority), Triage Officer (assigns triage categories), Treatment Officer (manages treatment areas by priority), Transport Officer (coordinates ambulance staging and hospital destination), and Staging Officer (manages incoming resources). The first arriving paramedic unit typically establishes command and initiates triage until additional resources arrive.

SALT Triage (Sort, Assess, Lifesaving Interventions, Treatment/Transport) is an alternative system endorsed by the CDC that combines elements of START with limited lifesaving interventions during triage. SALT begins with a global sort: patients who can walk are directed to an assessment area (Green). Patients who can wave or make purposeful movements are assessed second (Yellow expected). Patients with no movement or obvious life threats are assessed first (Red expected). SALT allows three brief interventions during triage: controlling major hemorrhage, opening the airway, and chest decompression for obvious tension pneumothorax.

Secondary triage (retriage) occurs at the treatment area and at receiving hospitals. Patients may be upgraded or downgraded as their conditions change. A Yellow patient who deteriorates becomes Red; a Red patient who stabilizes may become Yellow. Continuous reassessment prevents patients from being forgotten in the triage system.

Scene organization in MCI follows the principle of zones: hot zone (immediate danger area, rescue operations), warm zone (decontamination and initial triage), and cold zone (treatment, transport staging, and command post). Patient flow moves from hot to warm to cold zone. EMS providers generally do not enter the hot zone -- that is the responsibility of fire rescue, hazmat teams, or law enforcement tactical medics.`,
    riskFactors: [
      "Undertriage (assigning lower priority than appropriate) causing delayed treatment of critically injured patients",
      "Overtriage (assigning higher priority than appropriate) overwhelming treatment resources with non-critical patients",
      "Emotional decision-making in MCI causing deviation from triage algorithm (treating the loudest, not the sickest)",
      "Pediatric patients undertriaged due to provider unfamiliarity with JumpSTART modifications",
      "Secondary collapse or explosion at incident scene causing additional casualties among responders",
      "Communication failure between triage, treatment, transport, and receiving facilities",
      "Resource depletion if MCI exceeds the capability of the local EMS system response plan",
      "Psychological stress on providers making rapid life-death triage decisions"
    ],
    diagnostics: [
      "START assessment in under 30 seconds per patient: respirations, perfusion, mental status",
      "JumpSTART for pediatric patients ages 1-8: modified respiratory rate ranges, 5 rescue breaths for apneic with pulse",
      "Walking filter as first step to rapidly sort ambulatory (Green) from non-ambulatory patients",
      "Radial pulse or capillary refill less than 2 seconds as perfusion assessment in START",
      "AVPU mental status assessment in JumpSTART (A, V, P-appropriate, or P-inappropriate/U)",
      "Patient count and category distribution for resource request and hospital pre-notification",
      "Scene hazard assessment for ongoing threats requiring evacuation before triage"
    ],
    management: [
      "Initiate START triage on all adult patients in under 30 seconds per patient without stopping for treatment",
      "Apply JumpSTART for all pediatric patients ages 1-8 with modified vital sign thresholds",
      "Direct all walking patients to a designated GREEN collection area supervised by a provider",
      "Perform only life-saving interventions during triage: open airway, control hemorrhage (START allows these)",
      "Do NOT initiate CPR during MCI triage -- cardiac arrest patients are tagged BLACK",
      "Establish incident command and request additional resources based on initial patient count and severity",
      "Organize treatment areas by triage category: RED separate from YELLOW separate from GREEN",
      "Coordinate transport with receiving hospitals using pre-established surge capacity plans"
    ],
    nursingActions: [
      "Complete START assessment in under 30 seconds: walk? breathe? rate? perfusion? mental status? -- tag and move on",
      "Control only immediately life-threatening hemorrhage during triage -- do not stop to splint or bandage",
      "Use JumpSTART for children 1-8: give 5 rescue breaths to apneic children with pulse before tagging BLACK",
      "Tag every patient with a visible triage tag including time, category, and any interventions performed",
      "Communicate patient count by category to incident command for resource allocation",
      "Retriage patients at the treatment area -- conditions change, and initial triage may need adjustment",
      "Maintain emotional discipline -- follow the algorithm, not the screaming",
      "Document triage decisions and rationale when possible for post-incident review"
    ],
    signs: [
      "Respiratory rate greater than 30 indicating RED (Immediate) in START triage",
      "Absent radial pulse or capillary refill greater than 2 seconds indicating RED for perfusion compromise",
      "Inability to follow simple commands indicating RED for neurological compromise",
      "Walking independently indicating GREEN (Minor) regardless of visible injuries",
      "Apnea unresponsive to airway repositioning in adults indicating BLACK (Deceased)",
      "Apneic child with pulse who resumes breathing after 5 rescue breaths indicating RED in JumpSTART"
    ],
    medications: [
      { name: "Tourniquet", dose: "Apply proximal to hemorrhage, tighten until bleeding stops", route: "External", purpose: "Control life-threatening extremity hemorrhage during triage (allowed in START)" },
      { name: "Hemostatic Gauze", dose: "Pack directly into wound with sustained pressure", route: "Topical", purpose: "Control junctional or non-tourniquet-amenable hemorrhage during triage" },
      { name: "No medications during initial triage", dose: "N/A", route: "N/A", purpose: "Triage is assessment and sorting only -- medications are administered at treatment areas after triage" }
    ],
    pearls: [
      "START takes 30 seconds per patient maximum -- if you are spending more time, you are treating, not triaging",
      "Walking patients are GREEN regardless of how badly they look -- the ability to walk indicates adequate perfusion and mentation",
      "CPR is NOT performed during MCI triage -- cardiac arrest patients are BLACK because CPR resources cannot be dedicated to one patient",
      "JumpSTART gives apneic children with a pulse 5 rescue breaths -- this is the critical difference from adult START",
      "The loudest patient is rarely the sickest -- quiet, still patients are often the most critically injured",
      "Retriage saves lives -- initial triage is a snapshot, not a final diagnosis"
    ],
    quiz: [
      { question: "In START triage, a non-walking patient has a respiratory rate of 36. What is the triage category?", options: ["GREEN -- respiratory rate is close to normal", "YELLOW -- breathing but needs monitoring", "RED -- respiratory rate exceeds 30", "BLACK -- respiratory rate is too high to survive"], correctIndex: 2, rationale: "In START triage, a respiratory rate greater than 30 breaths per minute indicates RED (Immediate). This suggests significant respiratory compromise requiring immediate intervention. The patient does not need further assessment of perfusion or mental status -- respiratory rate alone determines the category." },
      { question: "An 8-year-old at an MCI is not breathing but has a palpable pulse. Using JumpSTART, what is the next step?", options: ["Tag BLACK immediately", "Give 5 rescue breaths and reassess", "Begin full CPR", "Tag RED and move to the next patient"], correctIndex: 1, rationale: "JumpSTART provides for 5 rescue breaths to apneic children with a palpable pulse before determining the triage category. If breathing resumes after 5 breaths, the child is tagged RED. If breathing does not resume, the child is tagged BLACK. This step recognizes that pediatric arrest is often respiratory in origin and brief ventilation may be life-saving." },
      { question: "During MCI triage, a patient is screaming for help, ambulatory, and has a laceration on his arm. What triage category?", options: ["RED -- he is bleeding and in distress", "YELLOW -- he has an injury that needs treatment", "GREEN -- he is walking and has minor injury", "BLACK -- he is taking resources from sicker patients"], correctIndex: 2, rationale: "Any patient who can walk is tagged GREEN in the first step of START triage, regardless of visible injuries or level of distress. The ability to walk indicates adequate respiratory function, perfusion, and mental status. Walking wounded are directed to a GREEN collection area and assessed last." },
      { question: "What is the key difference between START and JumpSTART triage?", options: ["JumpSTART uses different color codes", "JumpSTART provides 5 rescue breaths to apneic children with a pulse before tagging BLACK", "JumpSTART does not assess mental status", "JumpSTART uses blood pressure instead of pulse"], correctIndex: 1, rationale: "The critical difference is that JumpSTART allows 5 rescue breaths for apneic children who have a palpable pulse. This recognizes that pediatric arrest is usually respiratory in origin and brief ventilation may restore spontaneous breathing. Adult START does not provide rescue breaths -- apneic adults (after repositioning) are tagged BLACK." },
      { question: "Why is CPR NOT initiated during initial MCI triage?", options: ["CPR is never effective in trauma patients", "CPR for one patient diverts resources from multiple salvageable patients", "CPR equipment is not available in the field", "CPR is only performed at hospitals"], correctIndex: 1, rationale: "In MCI triage, the principle of greatest good for the greatest number means that resources dedicated to CPR for one cardiac arrest patient (2+ providers, medications, equipment, time) are resources diverted from multiple salvageable patients. Cardiac arrest patients in MCI are tagged BLACK (Expectant/Deceased) unless resources become available after all RED and YELLOW patients are managed." }
    ]
  },

  "pharmacology-field-drugs-paramedic": {
    title: "Field Drug Protocols and Calculations",
    cellular: `Drug calculations and medication administration are essential paramedic competencies that must be performed accurately under extreme pressure. Errors in the field can be fatal, and there is no pharmacist to verify your work. Every paramedic must master the fundamental calculation methods and know the protocols for their most commonly administered medications.

The basic drug calculation formula is: Desired dose / Available concentration x Volume = Amount to administer. For example, if you need to give 0.5 mg of atropine from a vial containing 1 mg/mL in 1 mL: (0.5 mg / 1 mg) x 1 mL = 0.5 mL. For weight-based dosing: first calculate the dose in mg (weight in kg x dose in mg/kg), then apply the basic formula.

Infusion rate calculations for drip medications use the formula: Rate (mL/hr) = (Desired dose in mcg/min x 60 min/hr x Volume in mL) / (Drug amount in mcg). Or simplified for common concentrations: if you have dopamine 400 mg in 250 mL D5W and want to run at 10 mcg/kg/min for a 70 kg patient: Desired dose = 10 x 70 = 700 mcg/min. Concentration = 400,000 mcg / 250 mL = 1600 mcg/mL. Rate = 700 mcg/min / 1600 mcg/mL x 60 min/hr = 26.25 mL/hr. Using a 60 gtt/mL microdrip set: drops/min = mL/hr = 26 gtts/min.

Common prehospital medications and their protocols:

Epinephrine has multiple concentrations for different indications. 1:10,000 (0.1 mg/mL) is used for cardiac arrest: 1 mg (10 mL) IV/IO push every 3-5 minutes. 1:1,000 (1 mg/mL) is used for anaphylaxis: 0.3-0.5 mg (0.3-0.5 mL) IM. NEVER give 1:1,000 IV push -- the concentration is 10 times higher and can cause fatal hypertension, tachyarrhythmia, or stroke. Epinephrine infusion for post-ROSC or severe bradycardia: 1 mg in 250 mL NS = 4 mcg/mL, run at 2-10 mcg/min (30-150 mL/hr).

Nitroglycerin for chest pain (suspected ACS): 0.4 mg SL tablet or spray every 5 minutes x 3 doses. Contraindicated if SBP less than 90, HR less than 50 or greater than 100, right ventricular infarction (inferior MI with right-sided ST elevation or JVD), or phosphodiesterase inhibitor use within 24-48 hours (sildenafil, tadalafil). Nitroglycerin infusion for severe hypertensive emergency: 10-200 mcg/min IV, titrated to BP.

Morphine for pain management: 2-4 mg IV every 5-15 minutes (titrate to pain relief), max dose varies by protocol (typically 10-20 mg). Monitor for respiratory depression and hypotension. Naloxone (Narcan) must be immediately available.

Naloxone for suspected opioid overdose: 0.4-2 mg IV/IM/IN. Intranasal route (2 mg via atomizer) is preferred for needle-stick safety. Onset: IV 1-2 minutes, IN 3-5 minutes, IM 5 minutes. Duration: 30-90 minutes (shorter than most opioids -- patient may re-narcotize and require repeat dosing or infusion). Titrate to respiratory effort, not consciousness -- the goal is adequate ventilation, not full alertness (which causes withdrawal and combativeness).

Albuterol for bronchospasm: 2.5-5 mg nebulized (0.5-1 mL of 0.5% solution in 3 mL NS) every 20 minutes x 3, or continuous nebulization 10-15 mg/hr for severe exacerbation. Ipratropium 0.5 mg added to the first 3 nebulizer treatments for synergistic bronchodilation.

Midazolam for seizures: 0.1-0.2 mg/kg IM (max 10 mg) or 0.2 mg/kg intranasal (max 10 mg). For procedural sedation: 1-2 mg IV slow push, titrate to effect (max 0.1 mg/kg). Monitor for respiratory depression -- flumazenil is the reversal agent but is rarely used due to seizure risk.

Dextrose for hypoglycemia: D10W (10% dextrose) is preferred over D50W (50%) because it is less caustic to veins and allows more precise dosing. D10W dose: 250 mL IV (25 g dextrose). D50W dose: 50 mL IV (25 g dextrose) through a large bore IV -- extravasation causes tissue necrosis. Glucagon 1 mg IM is used when IV access is not available -- onset 10-20 minutes.

Aspirin for suspected ACS: 324 mg PO (chewed, not swallowed whole, for rapid absorption). Aspirin irreversibly inhibits cyclooxygenase (COX-1), blocking thromboxane A2 production and platelet aggregation. Contraindicated in aspirin allergy, active GI bleeding, and recent hemorrhagic stroke. Aspirin given in the prehospital setting for suspected STEMI reduces mortality by 23%.

Amiodarone for stable wide-complex tachycardia: 150 mg IV over 10 minutes (mixed in 100 mL D5W or given slow IV push), then 1 mg/min infusion for 6 hours. Monitor for hypotension during infusion -- slow the rate or administer a fluid bolus if BP drops. The cardiac arrest dose (300 mg IV push) is different from the stable VT dose.

Drug safety principles in the field: always read the label twice before drawing up medication, verify concentration (epinephrine 1:1000 vs 1:10,000 is a 10-fold difference), use the correct route (IM epinephrine for anaphylaxis, not IV), verify allergies before administration, document time and dose of every medication, and monitor for adverse effects continuously.

Medication math shortcuts: for mcg/min infusions, the clock method works if you mix the drug to create a known concentration. For dopamine 400 mg in 250 mL at 60 gtt/mL: 1 drop per second = 1600 mcg/min / 60 = 26.7 mcg/min. For a 70 kg patient at 5 mcg/kg/min = 350 mcg/min: 350/26.7 = 13 drops per minute.`,
    riskFactors: [
      "Concentration confusion between epinephrine 1:1,000 (1 mg/mL) and 1:10,000 (0.1 mg/mL) causing 10-fold dosing errors",
      "Weight estimation errors in pediatric patients leading to overdose or underdose of weight-based medications",
      "Failure to verify allergies before medication administration under time pressure",
      "Route errors: giving IM medications IV (epinephrine 1:1,000 IV push can cause fatal arrhythmia)",
      "Infusion rate calculation errors leading to under- or over-dosing of critical drip medications",
      "Look-alike/sound-alike medication confusion in the stress of resuscitation",
      "Re-narcotization after naloxone wears off (30-90 minutes) while long-acting opioids persist",
      "Nitroglycerin administration in right ventricular MI causing catastrophic hypotension"
    ],
    diagnostics: [
      "Blood glucose measurement before and after dextrose administration to confirm response",
      "Blood pressure measurement before and after nitroglycerin and all vasoactive medications",
      "12-lead ECG for chest pain patients before nitroglycerin to identify inferior/right ventricular MI",
      "SpO2 and respiratory rate monitoring before and after naloxone to assess ventilation adequacy",
      "Heart rate and rhythm monitoring before and after all cardiac medications",
      "Pain scale assessment (0-10) before and after analgesic administration to document response",
      "Peak flow measurement before and after bronchodilator administration when available"
    ],
    management: [
      "Read the label twice and verify drug, dose, concentration, route, and expiration before every administration",
      "Calculate weight-based doses precisely using Broselow tape or actual weight for pediatric patients",
      "Titrate naloxone to respiratory effort (RR >= 12), not consciousness, to avoid precipitating withdrawal",
      "Check 12-lead ECG for inferior MI before administering nitroglycerin to avoid RV-MI hypotension",
      "Administer aspirin 324 mg chewed for suspected ACS as early as possible in the prehospital setting",
      "Mix infusions using standardized concentrations to reduce calculation errors",
      "Monitor all patients for adverse effects for at least 5 minutes after medication administration",
      "Use intranasal naloxone route for needle-stick safety in opioid overdose"
    ],
    nursingActions: [
      "Verify the five rights before every medication: right patient, right drug, right dose, right route, right time",
      "Use standardized drug calculation methods and double-check math before drawing up medications",
      "Document exact time, drug, dose, route, and patient response for every medication administered",
      "Monitor for re-narcotization after naloxone and prepare for repeat dosing or continuous observation",
      "Keep reversal agents immediately accessible: naloxone for opioids, flumazenil for benzodiazepines, calcium for magnesium",
      "Never push D50W through small-gauge IVs or IOs -- use D10W instead to reduce tissue injury risk",
      "Pre-calculate infusion rates for common drip medications before they are needed in emergencies",
      "Perform allergy check and hemodynamic assessment (BP, HR) before every cardiac medication"
    ],
    signs: [
      "Blood glucose below 60 mg/dL indicating need for dextrose administration",
      "Respiratory rate below 8 with pinpoint pupils suggesting opioid toxicity requiring naloxone",
      "Chest pain with ST elevation on 12-lead ECG indicating STEMI requiring aspirin and transport for PCI",
      "Bronchospasm with wheezing and accessory muscle use requiring bronchodilator administration",
      "Hypotension after nitroglycerin suggesting right ventricular MI or hypovolemia requiring fluid bolus",
      "Improving respiratory rate and tidal volume after naloxone indicating adequate opioid reversal"
    ],
    medications: [
      { name: "Epinephrine (1:1,000)", dose: "0.3-0.5 mg IM for anaphylaxis", route: "Intramuscular only", purpose: "Alpha and beta agonist for bronchodilation, vasoconstriction, and cardiac stimulation in anaphylaxis" },
      { name: "Naloxone (Narcan)", dose: "0.4-2 mg IV/IM/IN, may repeat every 2-3 min", route: "IV, IM, or intranasal", purpose: "Opioid receptor antagonist to reverse respiratory depression from opioid overdose" },
      { name: "Aspirin", dose: "324 mg chewed (not swallowed whole)", route: "Oral", purpose: "COX-1 inhibitor for antiplatelet effect in suspected ACS -- reduces mortality 23%" },
      { name: "Nitroglycerin", dose: "0.4 mg SL every 5 min x 3 (if SBP > 90)", route: "Sublingual", purpose: "Vasodilator reducing preload and myocardial oxygen demand in chest pain" }
    ],
    pearls: [
      "NEVER give 1:1,000 epinephrine IV -- it is 10 times more concentrated than the cardiac arrest preparation and can cause fatal hypertension",
      "Titrate naloxone to respiratory effort (RR >= 12), not full consciousness -- waking up fully precipitates acute withdrawal and combativeness",
      "Aspirin 324 mg chewed in the field for suspected ACS reduces mortality by 23% -- one of the highest-impact prehospital interventions",
      "Always check 12-lead ECG before giving nitroglycerin -- inferior MI with RV involvement causes catastrophic hypotension with NTG",
      "D10W is safer than D50W for IV dextrose -- same total dose (25 g) with less vein and tissue injury",
      "For weight-based calculations: dose (mg) = weight (kg) x dose per kg -- then apply desired/available formula"
    ],
    quiz: [
      { question: "A patient in anaphylaxis needs epinephrine. Which preparation and route is correct?", options: ["1:10,000 (0.1 mg/mL) IV push", "1:1,000 (1 mg/mL) 0.3-0.5 mg IM", "1:1,000 (1 mg/mL) 0.3-0.5 mg IV push", "1:10,000 (0.1 mg/mL) 0.3 mg IM"], correctIndex: 1, rationale: "Anaphylaxis requires epinephrine 1:1,000 (1 mg/mL) given IM into the anterolateral thigh. The dose is 0.3-0.5 mg (0.3-0.5 mL). This concentration must NEVER be given IV push -- it is 10 times more concentrated than the cardiac arrest preparation and can cause fatal hypertension and arrhythmia." },
      { question: "After administering naloxone 0.4 mg IV, a patient's respiratory rate improves from 4 to 14. The patient remains sedated. What should you do?", options: ["Administer additional naloxone to fully wake the patient", "Monitor closely and prepare for re-narcotization -- the goal is adequate ventilation, not full alertness", "Intubate the patient because they are still sedated", "Administer flumazenil to reverse remaining sedation"], correctIndex: 1, rationale: "Naloxone is titrated to respiratory effort, not consciousness. RR of 14 indicates adequate ventilation. Fully reversing opioid effects precipitates acute withdrawal (vomiting, agitation, combativeness, potential aspiration). Monitor closely because naloxone's duration (30-90 min) may be shorter than the opioid, causing re-narcotization." },
      { question: "You need to give dopamine at 10 mcg/kg/min to a 80 kg patient. Your mix is 400 mg in 250 mL. What is the infusion rate?", options: ["15 mL/hr", "20 mL/hr", "30 mL/hr", "45 mL/hr"], correctIndex: 2, rationale: "Desired dose = 10 mcg/kg/min x 80 kg = 800 mcg/min. Concentration = 400,000 mcg / 250 mL = 1600 mcg/mL. Rate = (800 mcg/min x 60 min/hr) / 1600 mcg/mL = 48,000 / 1600 = 30 mL/hr." },
      { question: "Why should nitroglycerin NOT be given to a patient with inferior STEMI and JVD?", options: ["Nitroglycerin is always contraindicated in MI", "Inferior MI with JVD suggests RV involvement, and nitroglycerin reduces preload, causing severe hypotension", "Nitroglycerin interferes with cardiac catheterization", "JVD indicates the patient is fluid overloaded and does not need vasodilation"], correctIndex: 1, rationale: "Inferior MI with JVD suggests right ventricular infarction. The right ventricle depends on adequate preload to generate cardiac output. Nitroglycerin reduces preload through venodilation, which can cause catastrophic hypotension in RV-MI because the already-damaged RV cannot compensate for decreased filling." },
      { question: "What is the correct dose of aspirin for suspected acute coronary syndrome in the prehospital setting?", options: ["81 mg swallowed whole", "162 mg chewed", "324 mg chewed", "500 mg swallowed with water"], correctIndex: 2, rationale: "Aspirin 324 mg (four 81 mg tablets) should be chewed (not swallowed whole) for rapid absorption. Chewing increases the rate of absorption and achieves therapeutic antiplatelet levels within 15 minutes. The 324 mg dose provides maximal COX-1 inhibition for acute platelet aggregation in ACS." }
    ]
  }
};
