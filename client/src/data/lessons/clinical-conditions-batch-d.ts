import type { LessonContent } from "./types";

export const clinicalConditionsBatchDLessons: Record<string, LessonContent> = {
  "cardiac-tamponade-rpn": {
    title: "Cardiac Tamponade",
    cellular: {
      title: "Pericardial Fluid Accumulation",
      content: "Cardiac tamponade occurs when fluid (blood, effusion, or pus) accumulates in the pericardial sac surrounding the heart, compressing the cardiac chambers and preventing adequate filling during diastole. As intrapericardial pressure rises, stroke volume and cardiac output fall rapidly. The classic presentation is Beck's triad: hypotension, muffled heart sounds, and jugular venous distension. The nurse must recognize these signs, monitor vital signs as directed, and report changes immediately to the nurse or provider."
    },
    riskFactors: [
      "Penetrating chest trauma or cardiac surgery",
      "Pericarditis (viral, bacterial, uremic)",
      "Malignancy with pericardial metastasis",
      "Aortic dissection extending into pericardium",
      "Post-myocardial infarction (Dressler syndrome)",
      "Anticoagulant therapy",
      "Central line placement complications",
      "Autoimmune diseases (lupus, rheumatoid arthritis)"
    ],
    diagnostics: [
      "Monitor vital signs frequently and report hypotension or tachycardia",
      "Report muffled or distant heart sounds on auscultation",
      "Observe for jugular venous distension",
      "Monitor oxygen saturation and report desaturation",
      "Report patient complaints of chest pressure or dyspnea",
      "Monitor urine output and report if decreased"
    ],
    management: [
      "Maintain bed rest and position patient upright as ordered",
      "Administer IV fluids as ordered to maintain preload",
      "Administer oxygen as ordered",
      "Prepare patient for emergency pericardiocentesis as directed",
      "Keep emergency equipment at bedside",
      "Maintain continuous cardiac monitoring as directed"
    ],
    nursingActions: [
      "Assess for Beck's triad: hypotension, muffled heart sounds, JVD and report immediately",
      "Monitor vital signs every 15 minutes during acute phase as directed",
      "Check for pulsus paradoxus: report if SBP drops >10 mmHg with inspiration",
      "Report sudden deterioration in level of consciousness",
      "Maintain large-bore IV access as directed",
      "Provide emotional support and reassurance during emergent procedures"
    ],
    signs: {
      left: [
        "Hypotension",
        "Muffled or distant heart sounds",
        "Jugular venous distension (JVD)",
        "Pulsus paradoxus (>10 mmHg drop with inspiration)",
        "Tachycardia"
      ],
      right: [
        "Dyspnea and chest pressure",
        "Anxiety and restlessness",
        "Decreased cardiac output",
        "Narrowed pulse pressure",
        "Cool, clammy skin"
      ]
    },
    medications: [
      { name: "Normal Saline IV Bolus", type: "Volume expander", action: "Increases intravascular volume and preload to temporarily improve cardiac output", sideEffects: "Fluid overload if excessive", contra: "Decompensated heart failure (without tamponade)", pearl: "IV fluid resuscitation is a temporary bridge until pericardiocentesis can be performed. Administer as ordered and monitor vital signs closely." }
    ],
    pearls: [
      "Beck's triad (hypotension, muffled heart sounds, JVD) is the classic presentation of cardiac tamponade",
      "Pulsus paradoxus is a drop in SBP >10 mmHg during inspiration and is a hallmark sign",
      "Cardiac tamponade is a medical emergency requiring immediate pericardiocentesis",
      "Never delay reporting suspected tamponade: rapid decompensation can occur"
    ],
    quiz: [
      { question: "Which assessment triad is classic for cardiac tamponade?", options: ["Fever, tachycardia, hypotension", "Hypotension, muffled heart sounds, JVD", "Bradycardia, hypertension, irregular breathing", "Chest pain, dyspnea, hemoptysis"], correct: 1, rationale: "Beck's triad — hypotension, muffled (distant) heart sounds, and jugular venous distension — is the classic presentation of cardiac tamponade." },
      { question: "The nurse notes a patient's systolic BP drops by 15 mmHg during inspiration. What does this finding suggest?", options: ["Normal physiological variation", "Pulsus paradoxus consistent with tamponade", "Orthostatic hypotension", "Vasovagal response"], correct: 1, rationale: "A systolic BP drop >10 mmHg with inspiration is pulsus paradoxus, which is a hallmark sign of cardiac tamponade." },
      { question: "What is the priority nursing action when cardiac tamponade is suspected?", options: ["Place the patient in Trendelenburg position", "Report findings immediately and prepare for pericardiocentesis", "Administer sublingual nitroglycerin", "Apply ice to the chest"], correct: 1, rationale: "Cardiac tamponade is a life-threatening emergency. The nurse must report immediately so the team can prepare for emergency pericardiocentesis." }
    ]
  },

  "cardiac-tamponade-rn": {
    title: "Cardiac Tamponade",
    cellular: {
      title: "Hemodynamic Compromise in Tamponade",
      content: "Cardiac tamponade results from rapid or excessive accumulation of fluid in the pericardial space, increasing intrapericardial pressure beyond the filling pressure of the cardiac chambers. This compresses the right atrium and ventricle first (due to lower pressures), reducing venous return, stroke volume, and cardiac output. Compensatory mechanisms include tachycardia and peripheral vasoconstriction to maintain blood pressure, but these eventually fail. Equalization of diastolic pressures across all four chambers on hemodynamic monitoring is diagnostic. The nurse must perform rapid cardiovascular assessment, assist with pericardiocentesis, manage hemodynamic monitoring, and administer IV fluids to maintain preload."
    },
    riskFactors: [
      "Cardiac surgery or percutaneous procedures",
      "Pericarditis (viral, bacterial, tuberculous, uremic)",
      "Malignancy with pericardial involvement",
      "Aortic dissection with pericardial rupture",
      "Chest trauma (penetrating or blunt)",
      "Myocardial rupture post-MI",
      "Anticoagulant or thrombolytic therapy",
      "Connective tissue disorders (SLE)"
    ],
    diagnostics: [
      "Perform focused cardiovascular assessment for Beck's triad",
      "Assess for pulsus paradoxus using manual BP technique during inspiration/expiration",
      "Interpret bedside echocardiogram findings: pericardial effusion, right atrial/ventricular diastolic collapse",
      "Evaluate hemodynamic monitoring: equalization of diastolic pressures (RA, RV, PA diastolic, PCWP)",
      "Interpret ECG: low-voltage QRS, electrical alternans (beat-to-beat QRS amplitude variation)",
      "Monitor serial chest X-rays for enlarged cardiac silhouette (water-bottle sign)",
      "Assess cardiac output and cardiac index trends"
    ],
    management: [
      "Initiate rapid IV fluid resuscitation to increase preload and maintain cardiac output",
      "Position patient in semi-Fowler's to optimize hemodynamics",
      "Assist physician with emergency pericardiocentesis or pericardial window",
      "Administer vasopressors as ordered if hemodynamically unstable despite fluids",
      "Avoid diuretics and vasodilators that reduce preload",
      "Prepare for possible emergent thoracotomy if tamponade is traumatic",
      "Send pericardial fluid for cytology, culture, and cell count",
      "Monitor for recurrence after drainage"
    ],
    nursingActions: [
      "Perform continuous hemodynamic monitoring including CVP, arterial line, and cardiac output",
      "Monitor vital signs every 5-15 minutes during acute management",
      "Assess and document pulsus paradoxus serially to track response to treatment",
      "Maintain at least two large-bore IV access sites",
      "Monitor pericardial drain output, color, and volume after pericardiocentesis",
      "Assess for signs of cardiac output improvement post-drainage: rising BP, decreasing HR, improved mentation",
      "Provide anxiolytic support and explain procedures to patient",
      "Monitor for complications of pericardiocentesis: pneumothorax, myocardial puncture, arrhythmia"
    ],
    signs: {
      left: [
        "Beck's triad: hypotension, muffled heart sounds, JVD",
        "Pulsus paradoxus >10 mmHg",
        "Tachycardia (compensatory)",
        "Electrical alternans on ECG",
        "Low-voltage QRS complexes"
      ],
      right: [
        "Decreased cardiac output and cardiac index",
        "Equalized diastolic pressures",
        "Water-bottle cardiac silhouette on CXR",
        "Right atrial and ventricular diastolic collapse on echo",
        "Narrowed pulse pressure"
      ]
    },
    medications: [
      { name: "Normal Saline/Lactated Ringer's", type: "Crystalloid fluid", action: "Expands intravascular volume to increase preload and maintain cardiac output temporarily", sideEffects: "Fluid overload, pulmonary edema if underlying heart failure", contra: "Isolated decompensated CHF", pearl: "Aggressive fluid resuscitation is the immediate temporizing measure while preparing for pericardiocentesis." },
      { name: "Norepinephrine", type: "Vasopressor", action: "Alpha-1 and beta-1 agonist; increases SVR and cardiac contractility", sideEffects: "Tissue necrosis with extravasation, arrhythmias, peripheral ischemia", contra: "Hypovolemia (must correct volume first)", pearl: "Used as a bridge to pericardiocentesis if fluids alone do not maintain adequate perfusion pressure." },
      { name: "Dobutamine", type: "Inotrope", action: "Beta-1 agonist; increases myocardial contractility and cardiac output", sideEffects: "Tachycardia, arrhythmias, hypotension at high doses", contra: "IHSS, severe tachycardia", pearl: "May be used to augment cardiac output in tamponade with low output state. Definitive treatment is drainage." }
    ],
    pearls: [
      "Cardiac tamponade can develop acutely (minutes with trauma) or subacutely (days to weeks with effusion)",
      "Equalization of diastolic pressures on Swan-Ganz catheter is a hallmark hemodynamic finding",
      "Electrical alternans on ECG results from the heart swinging within the fluid-filled pericardium",
      "Never administer diuretics in tamponade: reducing preload will worsen cardiac output",
      "Post-pericardiocentesis: monitor drain output and watch for recurrence or constrictive pericarditis"
    ],
    quiz: [
      { question: "Which hemodynamic finding is characteristic of cardiac tamponade?", options: ["Elevated PCWP with low CVP", "Equalization of diastolic pressures across all chambers", "Markedly elevated systolic blood pressure", "Wide pulse pressure"], correct: 1, rationale: "In cardiac tamponade, the elevated intrapericardial pressure equalizes diastolic pressures in the RA, RV, PA, and PCWP, which is a diagnostic hemodynamic finding." },
      { question: "Which medication class should be avoided in cardiac tamponade?", options: ["Vasopressors", "IV crystalloids", "Diuretics", "Inotropes"], correct: 2, rationale: "Diuretics reduce preload by promoting fluid loss. In tamponade, the heart depends on adequate preload to maintain any cardiac output, so diuretics will worsen hemodynamic collapse." },
      { question: "After pericardiocentesis, which finding indicates successful treatment?", options: ["Increasing tachycardia", "Rising blood pressure and decreasing heart rate", "New onset pulsus paradoxus", "Decreasing urine output"], correct: 1, rationale: "Successful drainage of pericardial fluid relieves compression, improving stroke volume and cardiac output. This manifests as rising BP and normalizing heart rate." }
    ]
  },

  "cardiac-tamponade-np": {
    title: "Cardiac Tamponade",
    cellular: {
      title: "Pathophysiology of Pericardial Tamponade",
      content: "Cardiac tamponade represents a continuum of hemodynamic compromise caused by rising intrapericardial pressure. The pericardium normally contains 15-50 mL of serous fluid. Acute tamponade can occur with as little as 100-200 mL of rapid accumulation, while chronic effusions may reach 1-2 liters before causing tamponade due to gradual pericardial stretch. The pathophysiology involves compression of cardiac chambers, beginning with the right atrium (lowest pressure chamber) during diastole, leading to impaired ventricular filling. This causes interventricular interdependence: as the right ventricle fills during inspiration, the septum shifts leftward, further compromising left ventricular filling and causing pulsus paradoxus. The clinician must rapidly diagnose tamponade using bedside echocardiography, differentiate it from constrictive pericarditis and tension pneumothorax, and initiate definitive management including pericardiocentesis."
    },
    riskFactors: [
      "Malignancy (lung, breast, lymphoma) with pericardial metastasis",
      "Uremic pericarditis in end-stage renal disease",
      "Post-cardiac surgery or catheterization",
      "Idiopathic or viral pericarditis progressing to effusion",
      "Aortic dissection (Stanford Type A) extending to pericardium",
      "Myocardial free wall rupture (post-MI, days 3-7)",
      "Tuberculosis (common in endemic areas)",
      "Anticoagulation or thrombolytic therapy post-MI"
    ],
    diagnostics: [
      "Order and interpret bedside echocardiogram: pericardial effusion, RA/RV diastolic collapse, IVC plethora without respiratory variation",
      "Assess pulsus paradoxus quantitatively using arterial line or manual cuff technique",
      "Order ECG: low-voltage QRS, diffuse ST elevation (pericarditis), electrical alternans",
      "Order chest X-ray: enlarged cardiac silhouette (water-bottle sign) if >200 mL effusion",
      "Interpret hemodynamic data: elevated and equalized diastolic pressures (RA ≈ RV diastolic ≈ PA diastolic ≈ PCWP)",
      "Order CT chest with contrast if aortic dissection or malignancy suspected as etiology",
      "Send pericardial fluid for cell count, cytology, culture, ADA (tuberculosis), and tumor markers"
    ],
    management: [
      "Perform or direct emergency pericardiocentesis using echocardiographic or fluoroscopic guidance",
      "Order aggressive IV fluid resuscitation (1-2 L NS bolus) to maintain preload while preparing for drainage",
      "Order vasopressors (norepinephrine) if hypotension persists despite volume loading",
      "Place indwelling pericardial catheter for continuous drainage if recurrent or malignant effusion",
      "Refer for pericardial window (surgical) if recurrent tamponade or loculated effusion",
      "Treat underlying etiology: antibiotics for purulent pericarditis, chemotherapy for malignant effusion, dialysis for uremic pericarditis",
      "Order colchicine and NSAIDs for inflammatory pericarditis to prevent recurrence",
      "Avoid positive pressure ventilation when possible as it further reduces venous return"
    ],
    nursingActions: [
      "Perform rapid bedside echocardiogram to confirm diagnosis before intervention",
      "Classify tamponade etiology to guide definitive treatment (medical vs surgical)",
      "Monitor post-pericardiocentesis for reaccumulation, cardiac perforation, pneumothorax",
      "Evaluate pericardial fluid analysis results to determine underlying cause",
      "Adjust anticoagulation (hold/reverse) if hemorrhagic tamponade",
      "Order serial echocardiograms post-drainage to monitor for recurrence",
      "Initiate anti-inflammatory therapy for pericarditis-related effusions",
      "Coordinate cardiothoracic surgery consultation for surgical tamponade or recurrent effusions"
    ],
    signs: {
      left: [
        "Beck's triad (classic but not always complete)",
        "Pulsus paradoxus >10 mmHg (>25 mmHg in severe cases)",
        "Electrical alternans on ECG",
        "Echo: RA systolic collapse, RV diastolic collapse",
        "IVC plethora without respiratory variation"
      ],
      right: [
        "Equalized diastolic pressures on Swan-Ganz",
        "Blunted Y-descent on RA waveform",
        "Decreased cardiac index (<2.2 L/min/m²)",
        "Tachycardia with narrow pulse pressure",
        "Kussmaul sign absent (differentiates from constrictive)"
      ]
    },
    medications: [
      { name: "Colchicine", type: "Anti-inflammatory", action: "Inhibits microtubule polymerization, reducing neutrophil migration and inflammatory cytokine release in pericarditis", sideEffects: "GI upset (diarrhea, nausea), myelosuppression at high doses", contra: "Severe hepatic or renal impairment, concurrent strong CYP3A4 inhibitors", pearl: "COPE and CORP trials demonstrated colchicine significantly reduces pericarditis recurrence. Use 0.5 mg BID for 3 months with NSAIDs." },
      { name: "Ibuprofen", type: "NSAID", action: "Inhibits cyclooxygenase, reducing prostaglandin-mediated inflammation and pain in pericarditis", sideEffects: "GI bleeding, renal impairment, cardiovascular risk", contra: "Active GI bleeding, CKD stage 4-5, post-CABG", pearl: "First-line anti-inflammatory for idiopathic/viral pericarditis. Taper over 2-4 weeks. Use gastroprotection with PPI." },
      { name: "Norepinephrine", type: "Vasopressor", action: "Potent alpha-1 agonist with beta-1 activity; increases SVR and contractility", sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation", contra: "Uncorrected hypovolemia", pearl: "Bridge vasopressor while preparing for pericardiocentesis. Central line preferred. Does not treat underlying cause." },
      { name: "Prednisone", type: "Corticosteroid", action: "Potent anti-inflammatory that suppresses immune-mediated pericardial inflammation", sideEffects: "Hyperglycemia, immunosuppression, osteoporosis, adrenal suppression", contra: "Active infection (unless TB with concurrent anti-TB therapy)", pearl: "Reserved for refractory or autoimmune pericarditis. Associated with higher recurrence rates when used as first-line. Taper slowly over 2-3 months." }
    ],
    pearls: [
      "Acute tamponade can occur with as little as 100-200 mL of rapid fluid accumulation; chronic effusions may tolerate >1 L",
      "Kussmaul sign (inspiratory rise in JVP) is absent in tamponade but present in constrictive pericarditis: key differentiator",
      "Electrical alternans occurs because the heart physically swings within a large pericardial effusion",
      "Avoid positive pressure ventilation in tamponade: it further reduces venous return and can precipitate PEA arrest",
      "Post-MI free wall rupture causing tamponade typically occurs 3-7 days after the infarction"
    ],
    quiz: [
      { question: "Which echocardiographic finding is earliest in developing cardiac tamponade?", options: ["Left ventricular systolic collapse", "Right atrial systolic collapse", "Aortic root dilation", "Mitral valve prolapse"], correct: 1, rationale: "Right atrial collapse during systole is the earliest echo finding in tamponade because the RA has the lowest intracardiac pressure and is compressed first by rising intrapericardial pressure." },
      { question: "How does cardiac tamponade differ from constrictive pericarditis on examination?", options: ["Tamponade has Kussmaul sign, constrictive does not", "Tamponade has pulsus paradoxus and no Kussmaul sign; constrictive has Kussmaul sign", "Both conditions present identically", "Constrictive pericarditis has muffled heart sounds"], correct: 1, rationale: "Tamponade shows pulsus paradoxus but no Kussmaul sign (inspiratory JVP rise). Constrictive pericarditis characteristically shows Kussmaul sign and may have a pericardial knock." },
      { question: "An NP is managing a patient with recurrent malignant pericardial effusion causing tamponade. What is the most appropriate long-term management?", options: ["Repeated pericardiocentesis every week", "Pericardial window or pericardiectomy", "Long-term oral diuretic therapy", "High-dose IV corticosteroids indefinitely"], correct: 1, rationale: "For recurrent malignant effusions, a pericardial window provides continuous drainage into the pleural space or peritoneum, preventing reaccumulation. Repeated pericardiocentesis is a temporizing measure and not definitive." }
    ]
  },

  "aortic-dissection-rpn": {
    title: "Aortic Dissection",
    cellular: {
      title: "Aortic Wall Tear and Dissection",
      content: "Aortic dissection occurs when a tear develops in the inner layer (intima) of the aorta, allowing blood to surge through the tear into the media (middle layer). This creates a false lumen that can propagate proximally or distally, compromising blood flow to branch vessels. Stanford Type A involves the ascending aorta (most lethal) and Type B involves the descending aorta distal to the left subclavian artery. The nurse must recognize the sudden onset of severe tearing chest or back pain, monitor vital signs closely, maintain a calm environment, and report all changes immediately."
    },
    riskFactors: [
      "Chronic hypertension (most common risk factor)",
      "Sudden cessation of antihypertensive medications",
      "Cocaine use (acute hypertensive crisis)",
      "Marfan syndrome and other connective tissue disorders",
      "Bicuspid aortic valve",
      "Age >60 years, male sex",
      "Prior aortic surgery or catheterization",
      "Pregnancy (third trimester)"
    ],
    diagnostics: [
      "Monitor vital signs frequently and report hypertension or hypotension",
      "Report sudden severe chest or back pain described as tearing or ripping",
      "Compare bilateral upper extremity blood pressures as directed and report asymmetry",
      "Monitor peripheral pulses (radial, femoral, pedal) and report changes",
      "Report changes in level of consciousness or neurological status",
      "Monitor urine output and report if <30 mL/hr"
    ],
    management: [
      "Maintain strict bed rest as ordered",
      "Keep environment calm and quiet to minimize sympathetic stimulation",
      "Administer IV antihypertensives as ordered",
      "Administer pain medications as ordered (morphine)",
      "Maintain at least two large-bore IV access sites as directed",
      "Prepare patient for emergency surgery or CT imaging as directed"
    ],
    nursingActions: [
      "Assess pain characteristics: sudden onset, tearing/ripping quality, radiating to back",
      "Monitor vital signs every 15 minutes or more frequently as directed",
      "Report BP outside ordered parameters immediately",
      "Assess bilateral arm blood pressures and report >20 mmHg difference",
      "Monitor for complications: stroke symptoms, absent pulses, abdominal pain, decreased urine output",
      "Maintain semi-Fowler's position as ordered",
      "Cluster care to minimize patient stress and activity",
      "Limit visitors to maintain a calm environment"
    ],
    signs: {
      left: [
        "Sudden severe tearing chest pain (Type A)",
        "Pain radiating to neck, jaw, upper back",
        "Hypertension at presentation",
        "Tachycardia, restlessness, diaphoresis",
        "Widened mediastinum on chest X-ray"
      ],
      right: [
        "Abdominal or back pain (Type B)",
        "Blood pressure asymmetry between arms",
        "Absent or diminished peripheral pulses",
        "Signs of end-organ ischemia",
        "Anxiety and sense of impending doom"
      ]
    },
    medications: [
      { name: "Labetalol", type: "Alpha-beta blocker", action: "Reduces heart rate and blood pressure by blocking both alpha and beta receptors", sideEffects: "Bradycardia, hypotension, bronchospasm", contra: "Severe bradycardia, decompensated heart failure, asthma", pearl: "First-line agent for aortic dissection. Heart rate must be lowered BEFORE blood pressure to avoid reflex tachycardia. Administer as ordered and report BP outside parameters." }
    ],
    pearls: [
      "The hallmark symptom is sudden onset of severe tearing or ripping pain in the chest or back",
      "Heart rate must be reduced before blood pressure to prevent reflex tachycardia that worsens dissection",
      "Blood pressure difference >20 mmHg between arms suggests aortic arch branch involvement",
      "Report any new neurological symptoms immediately: stroke is a complication of Type A dissection"
    ],
    quiz: [
      { question: "Which type of pain is most characteristic of aortic dissection?", options: ["Gradual onset squeezing chest pain", "Sudden onset tearing or ripping pain", "Burning epigastric pain", "Colicky abdominal pain"], correct: 1, rationale: "Aortic dissection classically presents with sudden onset severe tearing or ripping pain in the chest or back as blood forces through the intimal tear." },
      { question: "Why is heart rate controlled before blood pressure in aortic dissection?", options: ["Heart rate medications work faster", "To prevent reflex tachycardia that worsens the dissection", "Blood pressure medications are not available IV", "Heart rate is always more dangerous than blood pressure"], correct: 1, rationale: "Lowering blood pressure alone can trigger reflex tachycardia, which increases aortic shear stress (dP/dt) and can worsen the dissection. Beta-blockers reduce both HR and shear force first." },
      { question: "The nurse notes a 25 mmHg blood pressure difference between the patient's arms. What should be reported?", options: ["This is a normal variation", "Possible aortic dissection affecting branch vessels", "The patient has peripheral artery disease", "The BP cuff is defective"], correct: 1, rationale: "A significant BP difference between arms (>20 mmHg) in the setting of acute chest/back pain suggests the dissection flap is compromising blood flow to a subclavian artery." }
    ]
  },

  "aortic-dissection-rn": {
    title: "Aortic Dissection",
    cellular: {
      title: "Pathophysiology of Aortic Wall Dissection",
      content: "Aortic dissection involves an intimal tear that allows pulsatile blood flow to enter the media, creating a false lumen that propagates along the aortic wall. The DeBakey classification divides dissections by location and extent (I: ascending + descending, II: ascending only, III: descending only). The Stanford classification is more clinically relevant: Type A (any ascending involvement, requires surgery) and Type B (descending only, often managed medically). Complications depend on which branch vessels are compromised by the false lumen: coronary arteries (MI), carotid arteries (stroke), renal arteries (AKI), mesenteric arteries (bowel ischemia), and iliac arteries (limb ischemia). The nurse must implement aggressive blood pressure and heart rate control, monitor for malperfusion syndromes, manage pain, and coordinate rapid surgical consultation."
    },
    riskFactors: [
      "Chronic hypertension (present in 70-80% of cases)",
      "Atherosclerosis and age >60",
      "Connective tissue disorders (Marfan, Ehlers-Danlos, Loeys-Dietz)",
      "Bicuspid aortic valve",
      "Cocaine or methamphetamine use",
      "Iatrogenic (cardiac surgery, catheterization)",
      "Pregnancy and peripartum period",
      "Coarctation of the aorta"
    ],
    diagnostics: [
      "Obtain bilateral arm blood pressures and report >20 mmHg asymmetry",
      "Interpret chest X-ray: widened mediastinum, left pleural effusion, deviation of trachea or NG tube",
      "Prepare patient for CT angiography (gold standard): identifies intimal flap, true/false lumen, branch involvement",
      "Assess serial troponin if coronary malperfusion suspected",
      "Monitor BUN/creatinine for renal malperfusion",
      "Perform serial neurovascular checks of all extremities",
      "Monitor lactate levels for evidence of mesenteric or limb ischemia"
    ],
    management: [
      "Initiate IV esmolol or labetalol drip to achieve target HR <60 bpm FIRST",
      "Add IV nitroprusside or nicardipine after HR control to achieve SBP 100-120 mmHg",
      "Administer IV morphine for pain control and sympathetic suppression",
      "Maintain strict bed rest and minimize stimulation",
      "Prepare for emergency surgical repair for Stanford Type A dissection",
      "Maintain continuous arterial line monitoring",
      "Type and crossmatch for 6-10 units PRBCs",
      "Insert Foley catheter for strict hourly urine output monitoring"
    ],
    nursingActions: [
      "Establish continuous cardiac monitoring and arterial line blood pressure",
      "Titrate IV beta-blocker to achieve HR <60 bpm before adding vasodilators",
      "Assess and document pain severity every 15 minutes using PQRST",
      "Perform neurovascular checks of all four extremities every 30 minutes",
      "Monitor for malperfusion syndromes: stroke (neuro changes), MI (chest pain, ECG), AKI (decreased UO), bowel ischemia (abdominal pain, bloody stool), limb ischemia (cold extremity)",
      "Monitor and report changes in character or location of pain (may indicate extension)",
      "Coordinate rapid transfer to operating room for Type A dissection",
      "Maintain calm, quiet environment; limit visitors; cluster care activities"
    ],
    signs: {
      left: [
        "Sudden severe tearing/ripping pain (anterior: Type A, interscapular: Type B)",
        "Hypertension at presentation (most patients)",
        "Aortic regurgitation murmur (Type A)",
        "Widened mediastinum on CXR",
        "Bilateral arm BP asymmetry"
      ],
      right: [
        "Stroke symptoms (carotid involvement)",
        "Acute MI (coronary ostia involvement)",
        "Acute kidney injury (renal artery involvement)",
        "Mesenteric ischemia (celiac/SMA involvement)",
        "Limb ischemia (iliac involvement)"
      ]
    },
    medications: [
      { name: "Esmolol", type: "IV beta-blocker", action: "Ultra-short-acting beta-1 selective blocker; reduces heart rate, contractility, and aortic shear stress (dP/dt)", sideEffects: "Bradycardia, hypotension, bronchospasm", contra: "Severe bradycardia, heart block, decompensated HF", pearl: "First-line IV beta-blocker due to rapid onset (1 min) and short half-life (9 min), allowing precise titration. Target HR <60 bpm." },
      { name: "Labetalol", type: "Alpha-beta blocker", action: "Combined alpha-1 and beta blockade; reduces HR, BP, and aortic wall shear stress", sideEffects: "Bradycardia, hypotension, bronchospasm, heart failure exacerbation", contra: "Severe asthma, heart block, cardiogenic shock", pearl: "Alternative to esmolol with longer duration. IV bolus 20 mg then infusion. Reduces both HR and BP simultaneously." },
      { name: "Nitroprusside", type: "Vasodilator", action: "Direct arterial and venous smooth muscle relaxation via nitric oxide release", sideEffects: "Cyanide/thiocyanate toxicity (>48 hrs or high dose), reflex tachycardia", contra: "Use WITHOUT beta-blocker (causes reflex tachycardia), hepatic failure", pearl: "NEVER use without concurrent beta-blocker in dissection. Reflex tachycardia increases aortic shear stress and can worsen dissection." },
      { name: "Morphine Sulfate", type: "Opioid analgesic", action: "Reduces pain and sympathetic activation, decreasing HR and BP", sideEffects: "Respiratory depression, hypotension, nausea", contra: "Respiratory failure without ventilatory support", pearl: "Pain control is essential in dissection management. Uncontrolled pain drives sympathetic response, raising HR and BP." }
    ],
    pearls: [
      "NEVER use nitroprusside or other vasodilators without beta-blocker in aortic dissection: reflex tachycardia worsens shear stress",
      "Type A dissection (any ascending involvement) is a surgical emergency with high mortality if untreated",
      "Type B dissection is typically managed medically unless complicated by malperfusion or rupture",
      "Migrating pain may indicate propagation of the dissection flap",
      "New aortic regurgitation murmur in acute chest pain suggests Type A dissection involving the aortic root"
    ],
    quiz: [
      { question: "Which is the correct sequence for blood pressure management in aortic dissection?", options: ["Start vasodilator first, then add beta-blocker", "Start beta-blocker first to control HR, then add vasodilator for BP", "Start both simultaneously at maximum doses", "Start diuretics to reduce blood volume"], correct: 1, rationale: "Beta-blockers must be started FIRST to reduce heart rate and aortic shear stress (dP/dt). Vasodilators alone cause reflex tachycardia, which worsens the dissection." },
      { question: "A patient with known Type A aortic dissection develops acute left-sided weakness. What complication has likely occurred?", options: ["Renal malperfusion", "Carotid artery malperfusion causing stroke", "Mesenteric ischemia", "Spinal cord ischemia"], correct: 1, rationale: "Acute left-sided weakness (contralateral to the right carotid) suggests the dissection flap has extended to involve the right carotid artery, causing cerebral ischemia and stroke." },
      { question: "Why is nitroprusside contraindicated as monotherapy in aortic dissection?", options: ["It causes hyperkalemia", "It causes reflex tachycardia increasing aortic shear stress", "It is not available in IV form", "It raises blood pressure"], correct: 1, rationale: "Nitroprusside causes vasodilation and reflex tachycardia, which increases aortic wall shear stress (dP/dt). This can accelerate dissection propagation and increase rupture risk." }
    ]
  },

  "pulmonary-embolism-rpn": {
    title: "Pulmonary Embolism",
    cellular: {
      title: "Pulmonary Vascular Occlusion",
      content: "A pulmonary embolism (PE) occurs when a thrombus (most commonly from deep veins in the legs or pelvis) dislodges and travels to the pulmonary vasculature, occluding one or more pulmonary arteries. This creates a ventilation-perfusion mismatch: the affected lung segments are ventilated but not perfused, resulting in hypoxemia. Other embolic sources include fat (from long bone fractures), air (from IV line disconnection), or amniotic fluid (peripartum). Massive PE can cause obstructive shock and right heart failure. The nurse must recognize acute respiratory distress, monitor vital signs, and report changes immediately."
    },
    riskFactors: [
      "Recent surgery or trauma",
      "Prolonged immobility or bed rest",
      "Deep vein thrombosis (DVT)",
      "Pregnancy and postpartum period",
      "Oral contraceptives or hormone therapy",
      "Malignancy (increased clotting factors)",
      "Obesity (venous pooling)",
      "Smoking (endothelial damage)",
      "Virchow's triad: stasis, endothelial injury, hypercoagulability"
    ],
    diagnostics: [
      "Monitor oxygen saturation continuously and report desaturation",
      "Monitor vital signs and report tachycardia, tachypnea, or hypotension",
      "Report sudden onset dyspnea or pleuritic chest pain immediately",
      "Report hemoptysis (coughing up blood)",
      "Monitor for signs of DVT: calf pain, swelling, warmth, positive Homans' sign",
      "Report sudden changes in mental status or anxiety"
    ],
    management: [
      "Administer supplemental oxygen as ordered",
      "Position patient in high Fowler's to facilitate breathing",
      "Administer anticoagulants (heparin) as ordered",
      "Maintain bed rest during acute phase as ordered",
      "Apply sequential compression devices as directed for DVT prevention",
      "Administer analgesics as ordered for pleuritic chest pain"
    ],
    nursingActions: [
      "Assess respiratory status: rate, depth, effort, oxygen saturation",
      "Report sudden onset of dyspnea, chest pain, or hemoptysis immediately",
      "Monitor vital signs every 15 minutes during acute phase as directed",
      "Maintain IV access for anticoagulant therapy",
      "Assess lower extremities for signs of DVT (unilateral swelling, calf tenderness)",
      "Provide emotional support for anxiety and sense of impending doom",
      "Encourage early ambulation post-operatively as ordered for prevention",
      "Report signs of bleeding on anticoagulant therapy: bruising, bleeding gums, hematuria"
    ],
    signs: {
      left: [
        "Sudden onset dyspnea (most common symptom)",
        "Pleuritic chest pain",
        "Tachypnea",
        "Hypoxemia",
        "Cough"
      ],
      right: [
        "Hemoptysis",
        "Tachycardia",
        "Feeling of impending doom",
        "Sudden mental status changes",
        "Hypotension (massive PE)"
      ]
    },
    medications: [
      { name: "Unfractionated Heparin", type: "Anticoagulant", action: "Prevents conversion of fibrinogen to fibrin and prothrombin to thrombin, stopping clot propagation", sideEffects: "Bleeding, heparin-induced thrombocytopenia (HIT)", contra: "Active hemorrhage, severe thrombocytopenia, recent CNS surgery", pearl: "Therapeutic aPTT target is 1.5-2 times normal (60-80 seconds). Normal aPTT is 25-35 seconds. Administer as ordered and report bleeding signs." },
      { name: "Enoxaparin", type: "Low molecular weight heparin", action: "Inhibits factor Xa, preventing thrombin generation and clot formation", sideEffects: "Bleeding, injection site bruising, thrombocytopenia", contra: "Active bleeding, HIT, severe renal failure (CrCl <30)", pearl: "Given subcutaneously. Do not rub the injection site. Monitor anti-Xa levels in renal impairment. Report bleeding signs." }
    ],
    pearls: [
      "Dyspnea is the most common presenting symptom of PE; pleuritic chest pain is also common",
      "A patient who suddenly develops anxiety, dyspnea, and tachycardia after surgery should be assessed for PE",
      "DVT prevention (SCDs, early ambulation, anticoagulation prophylaxis) is the best strategy against PE",
      "Report any signs of bleeding when a patient is on anticoagulant therapy"
    ],
    quiz: [
      { question: "Which is the most common presenting symptom of pulmonary embolism?", options: ["Hemoptysis", "Sudden onset dyspnea", "Fever", "Bradycardia"], correct: 1, rationale: "Sudden onset dyspnea is the most common presenting symptom of PE, occurring due to ventilation-perfusion mismatch in the affected lung segments." },
      { question: "A post-operative patient suddenly develops tachycardia, dyspnea, and anxiety. What condition should the nurse suspect?", options: ["Pneumonia", "Pulmonary embolism", "Heart failure exacerbation", "Panic attack"], correct: 1, rationale: "Sudden onset of tachycardia, dyspnea, and anxiety in a post-operative patient is a classic presentation of pulmonary embolism. This must be reported immediately." },
      { question: "What is the therapeutic target for aPTT when a patient is on heparin for PE?", options: ["10-15 seconds", "25-35 seconds", "60-80 seconds (1.5-2x normal)", "Over 100 seconds"], correct: 2, rationale: "The therapeutic aPTT for heparin therapy is 1.5-2 times the normal value (25-35 seconds), which is approximately 60-80 seconds." }
    ]
  },

  "pulmonary-embolism-rn": {
    title: "Pulmonary Embolism",
    cellular: {
      title: "Pulmonary Vascular Obstruction",
      content: "Pulmonary embolism results from thromboembolic occlusion of pulmonary arteries, most commonly from lower extremity or pelvic DVT (>90% of cases). The embolus obstructs blood flow to distal pulmonary vasculature, creating dead-space ventilation (ventilated but not perfused). This causes ventilation-perfusion (V/Q) mismatch, intrapulmonary shunting, and hypoxemia. Massive PE (>50% of pulmonary vasculature occluded) causes acute right ventricular failure due to sudden increase in pulmonary vascular resistance, leading to obstructive shock. Virchow's triad — venous stasis, endothelial injury, and hypercoagulability — underlies most thromboembolic events. The nurse must perform rapid respiratory and hemodynamic assessment, initiate anticoagulation therapy, monitor for deterioration, and coordinate advanced interventions."
    },
    riskFactors: [
      "Deep vein thrombosis (most common source)",
      "Recent surgery (orthopedic, abdominal, pelvic)",
      "Prolonged immobility (>72 hours bed rest, long flights)",
      "Active malignancy",
      "Pregnancy and postpartum (hypercoagulable state)",
      "Oral contraceptives or hormone replacement therapy",
      "Obesity",
      "Prior history of VTE",
      "Central venous catheter placement"
    ],
    diagnostics: [
      "Apply Wells criteria to stratify PE probability (DVT symptoms, HR >100, immobilization/surgery, prior VTE, hemoptysis, malignancy, PE most likely diagnosis)",
      "Interpret D-dimer results: negative D-dimer with low Wells score effectively rules out PE",
      "Prepare patient for CT pulmonary angiography (CTPA): gold standard imaging",
      "Interpret ABG: respiratory alkalosis (early), hypoxemia, increased A-a gradient",
      "Assess ECG for right heart strain: sinus tachycardia, S1Q3T3 pattern, right axis deviation, RBBB",
      "Monitor troponin and BNP (elevated indicates RV strain and worse prognosis)",
      "Order V/Q scan if CTPA contraindicated (contrast allergy, renal failure)"
    ],
    management: [
      "Initiate IV unfractionated heparin bolus followed by continuous infusion per protocol",
      "Position patient in high Fowler's and administer supplemental oxygen to maintain SpO2 >92%",
      "Prepare for thrombolytic therapy (alteplase) if massive PE with hemodynamic instability",
      "Administer IV fluids cautiously for RV support (avoid aggressive volume loading in RV failure)",
      "Initiate vasopressor support (norepinephrine) for obstructive shock",
      "Transition to oral anticoagulation (warfarin or DOAC) when stable",
      "Coordinate with interventional radiology for catheter-directed thrombolysis if available",
      "Consider IVC filter placement if anticoagulation is contraindicated"
    ],
    nursingActions: [
      "Perform rapid respiratory assessment: rate, depth, SpO2, breath sounds, accessory muscle use",
      "Obtain and interpret 12-lead ECG for signs of right heart strain",
      "Initiate heparin protocol: verify weight-based dosing, draw baseline aPTT, draw at 6 hours post-initiation",
      "Monitor aPTT every 6 hours and adjust heparin per protocol until therapeutic (1.5-2x normal)",
      "Assess for signs of massive PE: hypotension, altered consciousness, cyanosis",
      "Monitor for bleeding complications of anticoagulation: hematuria, melena, petechiae, excessive bruising",
      "Perform Caprini or Padua score for VTE risk assessment on admission",
      "Educate patient on long-term anticoagulation: duration, INR monitoring (warfarin), or DOAC adherence"
    ],
    signs: {
      left: [
        "Sudden onset dyspnea (most common)",
        "Pleuritic chest pain",
        "Tachypnea (RR >20)",
        "Hypoxemia (PaO2 <80 mmHg)",
        "Cough with or without hemoptysis"
      ],
      right: [
        "Tachycardia (HR >100)",
        "Hypotension (massive PE)",
        "S1Q3T3 pattern on ECG",
        "Elevated troponin/BNP (RV strain)",
        "Right ventricular dilation on echo"
      ]
    },
    medications: [
      { name: "Unfractionated Heparin", type: "Anticoagulant", action: "Enhances antithrombin III activity, inhibiting thrombin and factor Xa to prevent clot propagation", sideEffects: "Hemorrhage, HIT (heparin-induced thrombocytopenia), osteoporosis with long-term use", contra: "Active hemorrhage, HIT, recent intracranial surgery", pearl: "Weight-based protocol: 80 units/kg bolus then 18 units/kg/hr infusion. Check aPTT at 6 hours. Reversible with protamine sulfate." },
      { name: "Alteplase (tPA)", type: "Thrombolytic", action: "Converts plasminogen to plasmin, directly lysing thrombus in pulmonary vasculature", sideEffects: "Major hemorrhage, intracranial hemorrhage (2-3% risk)", contra: "Active internal bleeding, recent CNS surgery, hemorrhagic stroke, intracranial neoplasm", pearl: "Reserved for massive PE with hemodynamic instability. 100 mg IV over 2 hours. Heparin is held during infusion. Bleeding risk is significant." },
      { name: "Rivaroxaban", type: "Direct oral anticoagulant (Factor Xa inhibitor)", action: "Directly inhibits factor Xa, preventing thrombin generation", sideEffects: "Bleeding, GI upset", contra: "Active pathological bleeding, severe hepatic disease, CrCl <15", pearl: "Can be used for initial treatment of PE (15 mg BID x 21 days, then 20 mg daily) without need for heparin bridge. Take with food." },
      { name: "Warfarin", type: "Vitamin K antagonist", action: "Inhibits vitamin K-dependent clotting factors (II, VII, IX, X), preventing new clot formation", sideEffects: "Hemorrhage, skin necrosis (protein C deficiency), teratogenic", contra: "Pregnancy, active bleeding, severe hepatic disease", pearl: "Requires 5-7 days to reach therapeutic effect. Overlap with heparin for at least 5 days and until INR 2-3 for 24 hours. Multiple drug and food interactions." }
    ],
    pearls: [
      "Wells criteria: DVT symptoms (+3), PE most likely (+3), HR >100 (+1.5), immobilization/surgery (+1.5), prior VTE (+1.5), hemoptysis (+1), malignancy (+1)",
      "S1Q3T3 on ECG (large S wave in lead I, Q wave and inverted T in lead III) suggests acute right heart strain",
      "Thrombolytics are only indicated for massive PE with hemodynamic instability; not for submassive or low-risk PE",
      "Aggressive IV fluids can worsen right ventricular failure in massive PE: use cautious 250 mL boluses",
      "Anticoagulation prevents new clot formation; the body's fibrinolytic system resolves existing clots over time"
    ],
    quiz: [
      { question: "A patient with confirmed PE has a heart rate of 120, BP of 78/50, and altered mental status. What intervention does the nurse anticipate?", options: ["Increased supplemental oxygen only", "Systemic thrombolytic therapy (alteplase)", "Aggressive IV fluid bolus of 2 liters", "Oral warfarin initiation"], correct: 1, rationale: "This patient has massive PE with hemodynamic instability (hypotension, tachycardia, altered mentation). Systemic thrombolysis with alteplase is indicated to lyse the obstructing clot and restore pulmonary perfusion." },
      { question: "Which ECG finding is classically associated with acute pulmonary embolism?", options: ["ST elevation in leads V1-V4", "S1Q3T3 pattern", "Peaked T waves in all leads", "Prolonged PR interval"], correct: 1, rationale: "The S1Q3T3 pattern (S wave in lead I, Q wave in lead III, inverted T wave in lead III) indicates acute right heart strain from pulmonary embolism, though it is not always present." },
      { question: "When initiating heparin therapy for PE, when should the first aPTT be drawn?", options: ["Immediately after the bolus", "2 hours after infusion start", "6 hours after infusion start", "24 hours after infusion start"], correct: 2, rationale: "The first aPTT should be drawn 6 hours after heparin initiation to allow the drug to reach steady state. Subsequent adjustments are made based on the protocol to achieve 1.5-2x normal." }
    ]
  },

  "pulmonary-embolism-np": {
    title: "Pulmonary Embolism",
    cellular: {
      title: "Pathophysiology and Risk Stratification",
      content: "Pulmonary embolism represents a spectrum from incidental subsegmental PE to massive PE causing obstructive shock. The pathophysiology centers on acute right ventricular pressure overload: the thin-walled RV cannot acutely generate pressures >40 mmHg, and sudden increases in pulmonary vascular resistance cause RV dilation, decreased RV output, interventricular septal deviation (D-shaped LV), decreased LV preload, and systemic hypotension. Neurohormonal activation of the sympathetic nervous system and release of vasoactive mediators (serotonin, thromboxane A2) from activated platelets worsen pulmonary vasoconstriction. Risk stratification guides management: massive PE (hypotension/shock) requires thrombolysis, submassive PE (RV dysfunction without hypotension) requires close monitoring with possible escalation, and low-risk PE can be managed as outpatient. The clinician must apply clinical prediction rules, order and interpret advanced diagnostics, prescribe anticoagulation, determine disposition, and manage long-term VTE prevention."
    },
    riskFactors: [
      "Virchow's triad: venous stasis, endothelial injury, hypercoagulability",
      "Major orthopedic surgery (hip/knee replacement, hip fracture)",
      "Active malignancy (especially pancreatic, lung, ovarian, brain)",
      "Hereditary thrombophilia (Factor V Leiden, prothrombin G20210A, protein C/S deficiency, antithrombin III deficiency)",
      "Antiphospholipid syndrome",
      "Prolonged immobilization or critical illness",
      "Pregnancy (especially third trimester and postpartum)",
      "Central venous catheter",
      "Prior VTE (recurrence rate 30% at 10 years without anticoagulation)"
    ],
    diagnostics: [
      "Apply Wells criteria or Geneva score to determine pre-test probability",
      "Order D-dimer (age-adjusted cutoff: age × 10 ng/mL for patients >50) for low/intermediate probability",
      "Order CT pulmonary angiography (CTPA): gold standard, identifies clot location and RV dilation",
      "Order echocardiogram (bedside) for hemodynamically unstable patients: RV dilation, McConnell sign (RV free wall akinesia with apical sparing), tricuspid regurgitation",
      "Order troponin and NT-proBNP for risk stratification (elevated = submassive PE with RV injury)",
      "Order lower extremity duplex ultrasound to identify DVT source",
      "Consider V/Q scan if contrast allergy or severe renal insufficiency",
      "Order thrombophilia workup (Factor V Leiden, prothrombin mutation, antiphospholipid antibodies) for unprovoked VTE, especially in young patients"
    ],
    management: [
      "Prescribe weight-based IV heparin for massive and submassive PE (80 units/kg bolus, 18 units/kg/hr infusion)",
      "Order systemic thrombolysis (alteplase 100 mg IV over 2 hours) for massive PE with hemodynamic instability",
      "Consider catheter-directed thrombolysis or surgical embolectomy for massive PE with thrombolytic contraindication",
      "Prescribe rivaroxaban (15 mg BID × 21 days then 20 mg daily) or apixaban (10 mg BID × 7 days then 5 mg BID) for hemodynamically stable PE",
      "Order IVC filter for patients with acute VTE who have absolute contraindication to anticoagulation",
      "Determine anticoagulation duration: provoked PE = 3 months; unprovoked PE = at least 6 months, consider indefinite",
      "Prescribe low-molecular-weight heparin (enoxaparin) for cancer-associated PE",
      "Assess for chronic thromboembolic pulmonary hypertension (CTEPH) at 3-6 months with functional assessment and echo"
    ],
    nursingActions: [
      "Risk-stratify PE using PESI (Pulmonary Embolism Severity Index) or sPESI score",
      "Determine treatment setting: low-risk PESI can be managed outpatient; submassive/massive requires ICU",
      "Prescribe and monitor anticoagulation per evidence-based protocols",
      "Evaluate for thrombolytic candidacy: hemodynamic instability, contraindications, bleeding risk",
      "Order thrombophilia testing 2-4 weeks after anticoagulation completion for unprovoked PE",
      "Assess for post-PE syndrome and functional limitations at follow-up",
      "Prescribe extended anticoagulation for recurrent unprovoked VTE (indefinite duration with annual reassessment)",
      "Screen for occult malignancy in unprovoked VTE (age-appropriate cancer screening)"
    ],
    signs: {
      left: [
        "Dyspnea (73%), pleuritic chest pain (66%), tachypnea (70%)",
        "Cough (37%), hemoptysis (13%)",
        "Tachycardia (30%)",
        "Hypoxemia with increased A-a gradient",
        "Respiratory alkalosis (early) on ABG"
      ],
      right: [
        "Massive PE: hypotension, syncope, PEA/cardiac arrest",
        "RV dilation and hypokinesis on echo",
        "McConnell sign (RV free wall akinesia, apical sparing)",
        "Elevated troponin and BNP (RV injury markers)",
        "S1Q3T3, RBBB, right axis deviation on ECG"
      ]
    },
    medications: [
      { name: "Alteplase (tPA)", type: "Systemic thrombolytic", action: "Tissue plasminogen activator converts plasminogen to plasmin, directly lysing fibrin clot", sideEffects: "Intracranial hemorrhage (2-3%), major bleeding (10-15%)", contra: "Active internal bleeding, hemorrhagic stroke, intracranial neoplasm, recent major surgery (<3 weeks), aortic dissection", pearl: "FDA-approved dose for PE: 100 mg IV over 2 hours. For cardiac arrest from PE, some guidelines suggest 50 mg IV bolus. Continue CPR for 60-90 minutes after tPA administration." },
      { name: "Apixaban", type: "Direct oral factor Xa inhibitor", action: "Selectively and reversibly inhibits factor Xa, preventing thrombin generation", sideEffects: "Bleeding, anemia", contra: "Active pathological bleeding, severe hepatic impairment", pearl: "AMPLIFY trial: 10 mg BID × 7 days, then 5 mg BID. No heparin bridge needed. Lower bleeding risk than warfarin. Renal-safe. Reversal agent: andexanet alfa." },
      { name: "Rivaroxaban", type: "Direct oral factor Xa inhibitor", action: "Directly and selectively inhibits factor Xa in both free and clot-bound forms", sideEffects: "Bleeding, GI bleeding (slightly higher than apixaban)", contra: "Active pathological bleeding, severe hepatic disease, CrCl <15", pearl: "EINSTEIN-PE trial: 15 mg BID × 21 days, then 20 mg daily with food. Single-drug approach without heparin bridge for stable PE." },
      { name: "Enoxaparin", type: "Low molecular weight heparin", action: "Primarily inhibits factor Xa (anti-Xa:anti-IIa ratio 3.8:1), preventing clot propagation", sideEffects: "Bleeding, HIT (rare), injection site reactions", contra: "Active major bleeding, HIT, CrCl <30 (use UFH instead)", pearl: "Preferred for cancer-associated VTE. 1 mg/kg SQ BID or 1.5 mg/kg daily. No routine monitoring needed except in obesity, renal impairment, or pregnancy (check anti-Xa levels)." }
    ],
    pearls: [
      "PE risk stratification: Massive (hypotension) → thrombolysis; Submassive (RV strain, no hypotension) → anticoagulation + close monitoring; Low-risk → consider outpatient anticoagulation",
      "Age-adjusted D-dimer (age × 10 for patients >50) improves specificity without losing sensitivity",
      "McConnell sign on echo (RV free wall akinesia with apical sparing) is highly specific for acute PE",
      "DOACs (apixaban, rivaroxaban) are first-line for most PE except cancer-associated (LMWH) and massive PE (IV heparin + tPA)",
      "CTEPH develops in 2-4% of PE survivors: screen at 3-6 months with functional assessment and echocardiogram"
    ],
    quiz: [
      { question: "A patient with confirmed submassive PE (RV dilation on echo, troponin elevated, BP 110/70) has what management?", options: ["Emergent systemic thrombolysis", "Anticoagulation with close hemodynamic monitoring; escalate to thrombolysis if deterioration", "Outpatient oral anticoagulation only", "Observation without anticoagulation"], correct: 1, rationale: "Submassive PE (RV dysfunction without hypotension) is managed with anticoagulation and close monitoring. Thrombolysis is reserved for hemodynamic deterioration (massive PE conversion)." },
      { question: "Which DOAC regimen does NOT require heparin bridging for acute PE treatment?", options: ["Warfarin", "Apixaban (10 mg BID × 7 days then 5 mg BID)", "Dabigatran", "Edoxaban"], correct: 1, rationale: "Apixaban uses a step-down dosing approach (10 mg BID × 7 days, then 5 mg BID) that does not require heparin bridging. Rivaroxaban also has a similar single-drug approach. Dabigatran and edoxaban require 5-10 days of parenteral anticoagulation first." },
      { question: "An NP evaluates a 35-year-old with unprovoked PE and no obvious risk factors. What additional workup should be ordered?", options: ["No additional workup needed", "Thrombophilia panel and age-appropriate cancer screening", "Repeat CTPA in 1 week", "Genetic testing for BRCA mutations"], correct: 1, rationale: "Unprovoked PE in a young patient warrants thrombophilia testing (Factor V Leiden, prothrombin G20210A, antiphospholipid antibodies, protein C/S, antithrombin III) and age-appropriate cancer screening to identify underlying causes and guide anticoagulation duration." }
    ]
  },

  "fat-embolism-rpn": {
    title: "Fat Embolism Syndrome",
    cellular: {
      title: "Fat Globule Embolization",
      content: "Fat embolism syndrome (FES) is a life-threatening complication that occurs when fat globules from fractured bone marrow (especially long bones like the femur) enter the bloodstream and travel to the lungs, brain, and skin, occluding small blood vessels. The classic triad includes respiratory distress (fat emboli in pulmonary vasculature), neurological changes (fat emboli in cerebral vessels), and petechial rash (fat emboli in dermal capillaries). FES typically develops 24-72 hours after a long bone fracture. The nurse must monitor respiratory and neurological status closely and report any changes immediately."
    },
    riskFactors: [
      "Long bone fractures (femur, tibia most common)",
      "Pelvic fractures",
      "Multiple traumatic fractures",
      "Orthopedic surgery (intramedullary nailing, joint replacement)",
      "Severe burns",
      "Liposuction",
      "Bone marrow biopsy",
      "Sickle cell crisis (bone marrow necrosis)"
    ],
    diagnostics: [
      "Monitor oxygen saturation continuously and report any desaturation",
      "Monitor respiratory rate and report tachypnea or dyspnea",
      "Assess level of consciousness and report confusion, agitation, or altered mental status",
      "Inspect skin (chest, axillae, conjunctivae) for petechial rash and report immediately",
      "Monitor vital signs and report tachycardia or fever",
      "Report any visual changes or complaints of blurred vision"
    ],
    management: [
      "Administer supplemental oxygen as ordered to maintain SpO2 >92%",
      "Maintain bed rest and immobilize fractures as ordered",
      "Administer IV fluids as ordered to maintain hydration",
      "Maintain fracture stabilization and splinting as directed",
      "Report respiratory deterioration for possible intubation preparation",
      "Administer prescribed medications as ordered"
    ],
    nursingActions: [
      "Perform respiratory assessment every 1-2 hours during the 24-72 hour risk window after fracture",
      "Assess neurological status (orientation, alertness, confusion) regularly",
      "Inspect chest, axillae, neck, and conjunctivae for petechiae and report immediately",
      "Maintain gentle handling of fractured extremity to minimize further fat release",
      "Report the classic triad: respiratory distress + altered mental status + petechiae",
      "Monitor urine output and report decreased output",
      "Provide emotional support and explain monitoring rationale to patient"
    ],
    signs: {
      left: [
        "Respiratory distress (dyspnea, tachypnea, hypoxemia)",
        "Altered mental status (confusion, agitation, restlessness)",
        "Petechial rash on chest, axillae, and conjunctivae",
        "Tachycardia",
        "Fever"
      ],
      right: [
        "Onset typically 24-72 hours post-fracture",
        "Progressive hypoxemia despite oxygen",
        "Visual disturbances (retinal fat emboli)",
        "Decreased level of consciousness",
        "Thrombocytopenia (fat activates platelets)"
      ]
    },
    medications: [
      { name: "Supplemental Oxygen", type: "Respiratory support", action: "Increases FiO2 to improve oxygenation in the setting of V/Q mismatch from fat emboli", sideEffects: "Oxygen toxicity with prolonged high-flow use", contra: "None in emergency setting", pearl: "Oxygen is the first-line intervention. Patients may require escalation to non-rebreather or mechanical ventilation if hypoxemia is refractory." }
    ],
    pearls: [
      "The hallmark sign of fat embolism syndrome is a petechial rash across the chest, axillae, and soft palate",
      "Fat embolism syndrome typically develops 24-72 hours after a long bone fracture",
      "The classic triad is respiratory distress, altered mental status, and petechiae",
      "Gentle handling of fractured limbs helps prevent additional fat release into circulation",
      "Early fracture stabilization reduces the risk of fat embolism syndrome"
    ],
    quiz: [
      { question: "What is the hallmark cutaneous finding of fat embolism syndrome?", options: ["Ecchymosis around the fracture site", "Petechial rash on the chest and axillae", "Purpura on the lower extremities", "Urticaria on the trunk"], correct: 1, rationale: "A petechial rash on the chest, axillae, and sometimes the conjunctivae is the hallmark finding of fat embolism syndrome, caused by fat globules occluding dermal capillaries." },
      { question: "When does fat embolism syndrome most commonly develop after a long bone fracture?", options: ["Within 1 hour", "24-72 hours post-fracture", "7-10 days post-fracture", "2-3 weeks post-fracture"], correct: 1, rationale: "Fat embolism syndrome typically manifests 24-72 hours after the initial fracture, as fat globules gradually enter the bloodstream from disrupted bone marrow." },
      { question: "Which three findings comprise the classic triad of fat embolism syndrome?", options: ["Chest pain, hemoptysis, leg swelling", "Respiratory distress, altered mental status, petechiae", "Fever, joint pain, rash", "Hypertension, bradycardia, irregular breathing"], correct: 1, rationale: "The classic triad of FES is respiratory distress (pulmonary emboli), altered mental status (cerebral emboli), and petechial rash (dermal emboli)." }
    ]
  },

  "fat-embolism-rn": {
    title: "Fat Embolism Syndrome",
    cellular: {
      title: "Pathophysiology of Fat Embolism",
      content: "Fat embolism syndrome (FES) develops through two mechanisms: mechanical theory (fat globules from fractured bone marrow physically enter the venous circulation and lodge in pulmonary capillaries, then pass to systemic circulation via patent foramen ovale or transpulmonary passage) and biochemical theory (circulating fat globules are hydrolyzed by pulmonary lipase into free fatty acids that cause direct endothelial damage, increased capillary permeability, inflammatory mediator release, and ARDS-like pathology). The combination produces pulmonary injury (V/Q mismatch, non-cardiogenic pulmonary edema), cerebral dysfunction (microinfarcts from fat emboli), and dermal petechiae (capillary fragility from fatty acid damage). The nurse must perform comprehensive respiratory and neurological monitoring, recognize early signs, manage oxygenation, coordinate with the multidisciplinary team, and prepare for possible mechanical ventilation."
    },
    riskFactors: [
      "Femur fracture (highest risk single fracture)",
      "Multiple long bone fractures (risk increases with number of fractures)",
      "Pelvic fractures",
      "Delayed fracture stabilization (>24 hours increases risk)",
      "Intramedullary nailing procedures",
      "Total hip or knee arthroplasty",
      "Severe burns (>30% TBSA)",
      "Sickle cell disease with bone marrow infarction"
    ],
    diagnostics: [
      "Apply Gurd's criteria for FES diagnosis: at least one major + four minor criteria",
      "Assess Gurd's major criteria: petechial rash, respiratory insufficiency, cerebral involvement",
      "Evaluate Gurd's minor criteria: tachycardia >110, fever >38.5°C, retinal changes, jaundice, renal changes, thrombocytopenia, elevated ESR, fat macroglobulinemia",
      "Interpret ABG: progressive hypoxemia, increased A-a gradient",
      "Monitor CBC: thrombocytopenia (platelet consumption), anemia (hemolysis)",
      "Interpret chest X-ray: bilateral diffuse infiltrates (snowstorm appearance) developing 1-3 days after onset",
      "Monitor renal function: lipiduria (fat in urine), rising creatinine"
    ],
    management: [
      "Administer high-flow supplemental oxygen; titrate to maintain SpO2 >92%",
      "Prepare for intubation and mechanical ventilation if respiratory failure develops",
      "Apply lung-protective ventilation strategy if mechanically ventilated (tidal volume 6 mL/kg IBW, PEEP optimization)",
      "Administer IV fluids to maintain adequate intravascular volume and tissue perfusion",
      "Coordinate with orthopedics for early definitive fracture stabilization",
      "Administer corticosteroids as ordered (controversial but may reduce inflammation)",
      "Implement DVT prophylaxis (if not contraindicated)",
      "Transfer to ICU for close monitoring and possible mechanical ventilation"
    ],
    nursingActions: [
      "Perform hourly respiratory assessments during the 24-72 hour risk window",
      "Perform neurological assessments every 2 hours: GCS, orientation, pupil response",
      "Inspect skin systematically for petechiae: chest, axillae, neck, conjunctivae (use flashlight for subtle rash)",
      "Monitor continuous pulse oximetry and waveform capnography if available",
      "Maintain fracture immobilization: gentle handling, avoid unnecessary manipulation",
      "Monitor chest X-ray progression: clear → bilateral infiltrates",
      "Maintain strict I&O; assess for oliguria",
      "Monitor CBC trends: falling platelets and hemoglobin support FES diagnosis",
      "Coordinate early orthopedic fixation as definitive prevention of further fat embolization"
    ],
    signs: {
      left: [
        "Respiratory distress (dyspnea, tachypnea, hypoxemia, crackles)",
        "Petechial rash (chest, axillae, conjunctivae, neck)",
        "Altered mental status (confusion, lethargy, coma)",
        "Tachycardia (>110 bpm)",
        "Fever (>38.5°C)"
      ],
      right: [
        "Bilateral pulmonary infiltrates on CXR (snowstorm pattern)",
        "Progressive hypoxemia despite increasing FiO2",
        "Thrombocytopenia and anemia",
        "Lipiduria (fat globules in urine)",
        "Retinal changes (cotton-wool spots, hemorrhages)"
      ]
    },
    medications: [
      { name: "Methylprednisolone", type: "Corticosteroid", action: "Reduces inflammatory response and capillary permeability from free fatty acid-mediated endothelial damage", sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, adrenal suppression", contra: "Active untreated infection, GI perforation", pearl: "Prophylactic use in high-risk patients (bilateral femur fractures) is controversial but some evidence supports early administration. Monitor blood glucose closely." },
      { name: "Albumin", type: "Volume expander/fatty acid binder", action: "Expands intravascular volume; also binds free fatty acids, potentially reducing endothelial toxicity", sideEffects: "Fluid overload, allergic reaction", contra: "Severe heart failure", pearl: "5% albumin is used for volume resuscitation and may have theoretical benefit in binding toxic free fatty acids in FES. Evidence is limited." },
      { name: "Heparin (prophylactic dose)", type: "Anticoagulant", action: "Low-dose prophylaxis to stimulate lipase activity and promote fat clearance from circulation", sideEffects: "Bleeding, HIT", contra: "Active hemorrhage, hemorrhagic stroke", pearl: "Low-dose heparin may have both VTE prophylactic and lipase-stimulating effects in FES. Used as part of comprehensive trauma management." }
    ],
    pearls: [
      "Gurd's criteria: at least 1 major (petechiae, respiratory failure, cerebral symptoms) + 4 minor criteria for diagnosis",
      "Petechiae in FES are transient and non-palpable, appearing on the chest, axillae, and conjunctivae — not the extremities",
      "Early fracture fixation (<24 hours) significantly reduces the incidence of fat embolism syndrome",
      "There is no definitive diagnostic test for FES; diagnosis is clinical based on the triad and supporting labs",
      "Snowstorm pattern on CXR (bilateral diffuse infiltrates) develops 1-3 days after symptom onset and mimics ARDS"
    ],
    quiz: [
      { question: "Which assessment finding differentiates fat embolism petechiae from other causes?", options: ["They appear on the lower extremities", "They are palpable and raised", "They appear on the chest, axillae, and conjunctivae and are transient", "They are associated with fever only"], correct: 2, rationale: "FES petechiae characteristically appear on the chest, axillae, and conjunctivae (not the extremities), are non-palpable, and are often transient, lasting only 24-48 hours." },
      { question: "A patient who underwent intramedullary nailing of a femur fracture 36 hours ago develops confusion, SpO2 of 84%, and a petechial rash on the chest. What is the priority intervention?", options: ["Administer oral antibiotics", "Apply high-flow oxygen and prepare for possible intubation", "Encourage coughing and deep breathing", "Apply compression stockings"], correct: 1, rationale: "This patient is showing the classic triad of FES. With an SpO2 of 84%, the priority is high-flow oxygen and preparation for intubation/mechanical ventilation if hypoxemia is refractory." },
      { question: "Which intervention has been shown to reduce the incidence of fat embolism syndrome?", options: ["Prophylactic antibiotics", "Early definitive fracture stabilization (<24 hours)", "Strict bed rest for 2 weeks", "High-dose aspirin"], correct: 1, rationale: "Early definitive fracture fixation within 24 hours reduces ongoing fat release from unstabilized fracture sites and is the most effective strategy to prevent FES." }
    ]
  },

  "fat-embolism-np": {
    title: "Fat Embolism Syndrome",
    cellular: {
      title: "Pathophysiology and Diagnostic Framework",
      content: "Fat embolism syndrome (FES) results from both mechanical embolization and biochemical inflammatory cascade. Mechanically, intramedullary fat and marrow particles enter the venous circulation through torn medullary venous sinusoids after long bone fracture or intramedullary instrumentation. These particles lodge in pulmonary capillaries, causing V/Q mismatch. Particles <20 micrometers can traverse the pulmonary capillary bed to reach the systemic circulation (paradoxical embolization through pulmonary microvasculature or patent foramen ovale), causing cerebral and cutaneous manifestations. Biochemically, pulmonary lipase hydrolyzes neutral fat into free fatty acids that are directly cytotoxic to capillary endothelium, activating the complement cascade, causing platelet aggregation and consumption (thrombocytopenia), increasing capillary permeability (non-cardiogenic pulmonary edema), and triggering DIC. The clinician must apply Gurd's diagnostic criteria, manage respiratory failure, order advanced diagnostics, prescribe supportive therapy, and coordinate surgical fixation to prevent further embolization."
    },
    riskFactors: [
      "Bilateral femur fractures (highest risk: up to 33% incidence of FES)",
      "Closed long bone fractures (higher risk than open fractures due to intact marrow cavity)",
      "Delayed fracture fixation beyond 24 hours",
      "Reaming during intramedullary nailing",
      "Multiple fractures and polytrauma",
      "Young males (demographic most often affected due to trauma pattern)",
      "Total joint arthroplasty with cemented prostheses",
      "Severe burns and liposuction (non-orthopedic causes)"
    ],
    diagnostics: [
      "Apply Gurd's diagnostic criteria systematically: ≥1 major criterion + ≥4 minor criteria",
      "Major criteria: petechial rash, respiratory insufficiency (PaO2 <60 mmHg), cerebral involvement (not attributable to other causes)",
      "Minor criteria: tachycardia >110, pyrexia >38.5°C, retinal fat emboli on fundoscopy, fat in urine, unexplained drop in Hgb, elevated ESR, thrombocytopenia, fat macroglobulinemia",
      "Order ABG: progressive type I respiratory failure (low PaO2, normal or low PaCO2, increased A-a gradient)",
      "Order CT head if cerebral involvement: may show petechial hemorrhages in white matter (starfield pattern on MRI DWI)",
      "Order bronchoscopy with BAL if diagnosis uncertain: >5% alveolar macrophages with fat-laden inclusions (fat staining with Oil Red O) supports diagnosis",
      "Order serial CBC: falling platelets (consumption) and hemoglobin (mechanical hemolysis)",
      "Order lipase, triglycerides, and urine for fat globules (lipiduria)"
    ],
    management: [
      "Order high-flow oxygen or non-invasive ventilation (BiPAP) for respiratory support",
      "Prescribe intubation with lung-protective ventilation for PaO2/FiO2 ratio <200 (ARDS criteria): TV 6 mL/kg IBW, plateau pressure <30 cmH2O, optimal PEEP",
      "Prescribe IV crystalloid resuscitation for hypovolemia; avoid aggressive volume loading if ARDS develops",
      "Consider methylprednisolone 1.5 mg/kg IV every 8 hours for 48 hours (prophylactic or early treatment — evidence suggests may reduce severity)",
      "Coordinate emergent fracture fixation with orthopedics if not yet performed",
      "Order damage-control orthopedics approach: external fixation initially if patient too unstable for definitive nailing",
      "Prescribe VTE prophylaxis (enoxaparin) when hemostasis is secured",
      "Order serial chest X-rays and ABGs every 6-12 hours to track progression"
    ],
    nursingActions: [
      "Systematically apply Gurd's criteria to establish clinical diagnosis",
      "Order and interpret advanced imaging: CT head, fundoscopy, BAL with fat staining",
      "Prescribe and manage mechanical ventilation using ARDS Network protocol if respiratory failure develops",
      "Determine timing of definitive fracture fixation in collaboration with orthopedics and trauma surgery",
      "Assess for DIC: order PT, aPTT, fibrinogen, D-dimer, peripheral blood smear for schistocytes",
      "Manage cerebral edema if present: elevate HOB, avoid hyperthermia, maintain normoglycemia",
      "Prescribe corticosteroids for high-risk patients prophylactically (controversial but evidence supports in select populations)",
      "Establish long-term follow-up for potential neurological sequelae"
    ],
    signs: {
      left: [
        "Classic triad: respiratory failure + cerebral dysfunction + petechiae",
        "Onset 24-72 hours post-fracture or instrumentation",
        "Progressive hypoxemia (PaO2/FiO2 ratio declining)",
        "Non-cardiogenic pulmonary edema",
        "Cerebral: confusion → agitation → obtundation → coma"
      ],
      right: [
        "Petechiae: transient, non-palpable, chest/axillae/conjunctivae",
        "Retinal fat emboli visible on fundoscopy (Purtscher retinopathy)",
        "Starfield pattern on brain MRI (petechial white matter hemorrhages)",
        "Thrombocytopenia (<150,000) and anemia",
        "DIC in severe cases (elevated D-dimer, low fibrinogen)"
      ]
    },
    medications: [
      { name: "Methylprednisolone", type: "Corticosteroid", action: "Reduces pulmonary inflammation, capillary permeability, and free fatty acid-mediated endothelial injury; decreases complement activation", sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, adrenal suppression", contra: "Active untreated infection, GI perforation", pearl: "Prophylactic corticosteroids (1.5 mg/kg q8h × 2 days) in patients with bilateral femur fractures may reduce FES incidence by up to 80% in some studies. Evidence is mixed but risk-benefit favors use in high-risk patients." },
      { name: "N-Acetylcysteine", type: "Antioxidant/mucolytic", action: "Free radical scavenger that may reduce oxidative injury from free fatty acid-mediated endothelial damage", sideEffects: "Nausea, vomiting, bronchospasm (nebulized), anaphylactoid reaction (IV)", contra: "Asthma (nebulized form)", pearl: "Investigational use in FES. May have protective effect against oxidative stress from free fatty acids. Not standard of care but considered in severe cases." },
      { name: "Enoxaparin (prophylactic)", type: "Low molecular weight heparin", action: "VTE prophylaxis; may also stimulate lipoprotein lipase to clear circulating fat", sideEffects: "Bleeding, HIT, injection site bruising", contra: "Active bleeding, HIT, CrCl <30 (use UFH)", pearl: "VTE prophylaxis is essential in trauma patients. Timing must balance bleeding risk with VTE prevention. Typically initiated 12-24 hours after hemostasis is secured." },
      { name: "Norepinephrine", type: "Vasopressor", action: "Maintains MAP in hemodynamically unstable patients with FES-related ARDS and distributive physiology", sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation", contra: "Uncorrected hypovolemia", pearl: "May be needed if FES progresses to ARDS with distributive shock component. Target MAP >65 mmHg. Central line access preferred." }
    ],
    pearls: [
      "There is no single confirmatory diagnostic test for FES: diagnosis is clinical using Gurd's criteria (≥1 major + ≥4 minor)",
      "BAL showing >5% fat-laden macrophages (Oil Red O stain) supports diagnosis but is not required",
      "MRI of the brain in FES shows starfield pattern: multiple petechial hemorrhages in white matter on diffusion-weighted imaging",
      "Early fracture fixation is both treatment and prevention: damage-control orthopedics if patient is too unstable for definitive nailing",
      "Prophylactic corticosteroids may reduce FES incidence by up to 80% in high-risk patients (bilateral long bone fractures), though evidence remains debated"
    ],
    quiz: [
      { question: "A patient with bilateral femur fractures develops confusion, petechiae on the chest, and PaO2 of 55 mmHg 48 hours after injury. Using Gurd's criteria, which major criteria are met?", options: ["Only respiratory insufficiency", "Respiratory insufficiency, cerebral involvement, and petechial rash (all three major criteria)", "Only petechial rash and fever", "None of the major criteria"], correct: 1, rationale: "This patient meets all three of Gurd's major criteria: respiratory insufficiency (PaO2 55 mmHg), cerebral involvement (confusion), and petechial rash. This is diagnostic of fat embolism syndrome." },
      { question: "What is the role of bronchoalveolar lavage (BAL) in diagnosing fat embolism syndrome?", options: ["It is the gold standard diagnostic test", "Finding >5% fat-laden macrophages (Oil Red O stain) supports the diagnosis", "It is used to administer treatment directly to the lungs", "It has no role in FES diagnosis"], correct: 1, rationale: "BAL with Oil Red O staining showing >5% fat-laden alveolar macrophages supports the diagnosis of FES, though it is not required for diagnosis and is not a gold standard test." },
      { question: "An NP is considering prophylactic corticosteroids for a patient with bilateral femur fractures awaiting surgery. What is the evidence-based rationale?", options: ["Corticosteroids cure FES completely", "Studies suggest prophylactic methylprednisolone may reduce FES incidence in high-risk patients", "Corticosteroids are contraindicated in trauma patients", "There is no evidence for or against corticosteroid use"], correct: 1, rationale: "Several studies suggest that prophylactic methylprednisolone (1.5 mg/kg q8h × 2 days) in high-risk patients (bilateral long bone fractures) may reduce FES incidence by up to 80%, though evidence is mixed and the decision requires clinical judgment." }
    ]
  }
};
