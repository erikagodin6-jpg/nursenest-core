import type { LessonContent } from "./types";

export const rnChdAnticoagExpansionLessons: Record<string, LessonContent> = {
  "chd-overview-rn": {
    title: "Congenital Heart Disease Overview",
    cellular: {
      title: "Fetal Circulation and Shunt Physiology",
      content: "Congenital heart disease (CHD) encompasses structural heart defects present at birth, affecting approximately 1% of live births. Understanding CHD requires knowledge of fetal circulation and the transition to postnatal life. In utero, three shunts bypass the non-functioning lungs: the ductus venosus (bypasses liver), foramen ovale (right-to-left atrial shunt), and ductus arteriosus (connects pulmonary artery to aorta). At birth, the first breath decreases pulmonary vascular resistance (PVR), increasing pulmonary blood flow. Increased left atrial pressure functionally closes the foramen ovale. Rising PaO2 triggers ductal constriction, and the ductus arteriosus closes within 24-72 hours (functionally) and 2-3 weeks (anatomically). CHD is classified as acyanotic (left-to-right shunts) or cyanotic (right-to-left shunts). In left-to-right shunts (VSD, ASD, PDA), oxygenated blood recirculates through the lungs, causing pulmonary overcirculation and volume overload. In right-to-left shunts (Tetralogy of Fallot, transposition of great arteries), deoxygenated blood enters systemic circulation, producing cyanosis. Chronic left-to-right shunting can lead to Eisenmenger syndrome, where pulmonary hypertension reverses the shunt direction (becomes right-to-left), producing irreversible cyanosis. Ductal-dependent lesions require prostaglandin E1 (PGE1) to maintain ductal patency until surgical intervention."
    },
    riskFactors: [
      "Maternal diabetes (especially pre-gestational) increases CHD risk 3-5 fold",
      "First-trimester rubella infection (congenital rubella syndrome)",
      "Maternal alcohol use (fetal alcohol syndrome associated with VSD, ASD)",
      "Maternal phenylketonuria (PKU) with elevated phenylalanine levels",
      "Genetic syndromes: Down syndrome (AVSD, VSD), Turner syndrome (coarctation), DiGeorge syndrome (truncus arteriosus, TOF)",
      "Family history of CHD increases recurrence risk to 2-6%",
      "Teratogenic medications: lithium (Ebstein anomaly), isotretinoin, phenytoin, valproic acid",
      "Advanced maternal age"
    ],
    diagnostics: [
      "Prenatal fetal echocardiography for high-risk pregnancies (detectable at 18-22 weeks)",
      "Pulse oximetry screening in newborns: pre-ductal (right hand) and post-ductal (either foot) comparison",
      "Critical CHD screening: SpO2 less than 95% or greater than 3% difference between sites is a positive screen",
      "Postnatal echocardiography is the gold standard for diagnosis",
      "Chest X-ray: cardiomegaly, pulmonary vascular markings (increased in L-to-R shunts, decreased in R-to-L shunts)",
      "ECG: chamber enlargement, axis deviation, hypertrophy patterns",
      "Cardiac catheterization for hemodynamic assessment and interventional procedures",
      "Hyperoxia test: administer 100% FiO2; failure to increase PaO2 above 150 mmHg suggests cyanotic CHD",
      "Four-extremity blood pressure measurement to assess for coarctation"
    ],
    management: [
      "Ductal-dependent lesions: maintain PDA with prostaglandin E1 (PGE1/alprostadil) infusion",
      "PGE1 side effects: apnea (have intubation equipment ready), fever, hypotension, flushing",
      "Heart failure management: digoxin (improve contractility), diuretics (reduce fluid overload), ACE inhibitors (reduce afterload)",
      "Caloric supplementation: infants with CHD require 120-150 kcal/kg/day due to increased metabolic demands",
      "Surgical repair timing varies: emergent for critical lesions, elective for stable defects",
      "Palliative procedures: Blalock-Taussig shunt (increases pulmonary blood flow), PA banding (decreases pulmonary blood flow)",
      "Definitive repair: open heart surgery with cardiopulmonary bypass",
      "Post-operative monitoring: hemodynamic stability, rhythm disturbances, bleeding, infection",
      "Endocarditis prophylaxis for specific lesions per AHA guidelines"
    ],
    nursingActions: [
      "Cluster care to minimize oxygen consumption and energy expenditure",
      "Monitor for signs of heart failure: tachycardia, tachypnea, diaphoresis with feeding, poor weight gain, hepatomegaly",
      "Feed in upright position, allow frequent rest periods during feeds",
      "Strict I&O with daily weights (same scale, same time)",
      "Assess oxygen saturations pre- and post-ductally in neonates",
      "Monitor for cyanotic spells: note triggers, duration, interventions needed",
      "Provide parental education on disease, medications, feeding strategies, and when to seek emergency care",
      "Emotional support for family: CHD diagnosis creates significant parental anxiety",
      "Administer digoxin correctly: check apical HR for full minute before administration, hold if HR below age-appropriate limit",
      "Maintain normothermia: cold stress increases oxygen demand"
    ],
    assessmentFindings: [
      "Central cyanosis (lips, tongue, mucous membranes) in cyanotic defects",
      "Heart murmur on auscultation (may not be present in all defects)",
      "Tachypnea and increased work of breathing",
      "Diaphoresis especially with feeding",
      "Poor feeding, prolonged feeding times (greater than 30 minutes per feed)",
      "Failure to thrive, poor weight gain despite adequate caloric intake",
      "Hepatomegaly from right heart failure",
      "Clubbing of fingers (chronic cyanosis, develops over months)",
      "Bounding pulses (PDA) or diminished femoral pulses (coarctation)",
      "Polycythemia in chronic cyanotic defects (compensatory erythropoiesis)"
    ],
    signs: {
      left: [
        "Acyanotic (L-to-R shunt) findings:",
        "Increased pulmonary blood flow",
        "Heart murmur (systolic or continuous)",
        "Signs of heart failure: tachycardia, tachypnea, hepatomegaly",
        "Frequent respiratory infections",
        "Failure to thrive",
        "Widened pulse pressure (PDA)"
      ],
      right: [
        "Cyanotic (R-to-L shunt) findings:",
        "Central cyanosis unresponsive to supplemental O2",
        "Hypercyanotic (tet) spells",
        "Clubbing of digits (chronic hypoxemia)",
        "Polycythemia (compensatory)",
        "Squatting behavior in older children (increases SVR)",
        "Growth retardation"
      ]
    },
    medications: [
      { name: "Prostaglandin E1 (Alprostadil)", type: "Ductal Patency Agent", action: "Maintains ductus arteriosus patency by relaxing ductal smooth muscle", sideEffects: "Apnea (12%), fever, flushing, hypotension, seizures, bradycardia", contra: "Not needed after successful surgical repair", pearl: "Must have intubation equipment at bedside. Apnea risk is highest with doses above 0.05 mcg/kg/min. Monitor continuous pulse oximetry and respiratory status closely." },
      { name: "Digoxin", type: "Cardiac Glycoside", action: "Increases myocardial contractility (positive inotrope), decreases heart rate (negative chronotrope) via Na+/K+ ATPase inhibition", sideEffects: "Bradycardia, dysrhythmias, nausea, vomiting, visual changes (halos)", contra: "Hypokalemia (increases toxicity risk), hypomagnesemia, hypercalcemia", pearl: "Check apical pulse for 1 full minute before giving. Hold and notify provider if HR is below 90-110 bpm in infants or below 70 bpm in children. Therapeutic level: 0.8-2.0 ng/mL. Hypokalemia potentiates digoxin toxicity." },
      { name: "Furosemide (Lasix)", type: "Loop Diuretic", action: "Inhibits Na+/K+/2Cl- cotransporter in the loop of Henle, promoting sodium and water excretion", sideEffects: "Hypokalemia, hyponatremia, ototoxicity, dehydration, metabolic alkalosis", contra: "Severe electrolyte depletion, anuria", pearl: "Monitor potassium levels closely, especially when given with digoxin. Potassium supplementation often needed. Monitor daily weights and I&O." },
      { name: "Enalapril/Captopril", type: "ACE Inhibitor", action: "Reduces afterload by blocking conversion of angiotensin I to II, reduces preload via decreased aldosterone", sideEffects: "Hypotension, hyperkalemia, cough, renal impairment", contra: "Bilateral renal artery stenosis, pregnancy", pearl: "First-dose hypotension risk: monitor BP closely after initial dose. Used in heart failure to reduce workload on the heart." }
    ],
    pearls: [
      "The 5 Ts of cyanotic CHD: Tetralogy of Fallot, Transposition of Great Arteries, Truncus Arteriosus, Total Anomalous Pulmonary Venous Return, Tricuspid Atresia",
      "Acyanotic defects (VSD, ASD, PDA, coarctation) cause pulmonary overcirculation; cyanotic defects cause pulmonary undercirculation",
      "Critical CHD pulse oximetry screening is mandatory in all US states within 24-48 hours of birth",
      "Eisenmenger syndrome = irreversible pulmonary hypertension from chronic L-to-R shunting that reverses to R-to-L",
      "PGE1 keeps the ductus arteriosus open — essential for ductal-dependent lesions until surgical repair",
      "NSAIDs (indomethacin, ibuprofen) close the PDA — opposite effect of PGE1",
      "Down syndrome: 40-50% have CHD, most commonly AVSD (atrioventricular septal defect)",
      "Boot-shaped heart on CXR = Tetralogy of Fallot; egg-on-a-string = Transposition of Great Arteries",
      "Hypercyanotic spells require knee-chest positioning, calm environment, oxygen, and morphine if severe"
    ],
    quiz: [
      { question: "A newborn fails the pulse oximetry screening with SpO2 of 88% in the right hand and 85% in the foot. What is the priority nursing action?", options: ["Repeat the screening in 1 hour", "Notify the provider immediately for echocardiography", "Apply supplemental oxygen and recheck in 30 minutes", "Document as a normal finding"], correct: 1, rationale: "SpO2 below 95% or a difference greater than 3% between pre- and post-ductal sites is a positive screen for critical CHD. Immediate provider notification and echocardiography are indicated." },
      { question: "Which fetal shunt allows blood to bypass the liver?", options: ["Foramen ovale", "Ductus arteriosus", "Ductus venosus", "Umbilical vein"], correct: 2, rationale: "The ductus venosus shunts oxygenated blood from the umbilical vein directly to the inferior vena cava, bypassing hepatic circulation. The foramen ovale bypasses the lungs at the atrial level, and the ductus arteriosus bypasses at the great vessel level." },
      { question: "A nurse is caring for an infant receiving PGE1 infusion. Which equipment must be immediately available at the bedside?", options: ["Defibrillator", "Intubation equipment", "Peritoneal dialysis supplies", "Blood transfusion set"], correct: 1, rationale: "PGE1 causes apnea in approximately 12% of neonates. Intubation equipment must be at the bedside at all times during infusion. This is the most critical safety measure." },
      { question: "Which congenital heart defect is most commonly associated with Down syndrome?", options: ["Tetralogy of Fallot", "Coarctation of the aorta", "Atrioventricular septal defect (AVSD)", "Transposition of great arteries"], correct: 2, rationale: "AVSD (also called endocardial cushion defect) is the most common CHD in Down syndrome, occurring in 40-50% of affected children." },
      { question: "Eisenmenger syndrome develops when:", options: ["A left-to-right shunt reverses to right-to-left due to pulmonary hypertension", "The ductus arteriosus fails to close", "The foramen ovale remains patent", "A right-to-left shunt spontaneously closes"], correct: 0, rationale: "Eisenmenger syndrome occurs when chronic left-to-right shunting causes irreversible pulmonary hypertension, eventually reversing the shunt direction to right-to-left, producing cyanosis. This is irreversible and contraindicates surgical repair." },
      { question: "An infant with a known VSD is diaphoretic and tachypneic during feeding. The nurse should:", options: ["Increase feeding volume to promote weight gain", "Allow frequent rest periods and feed in an upright position", "Withhold feedings until respiratory distress resolves", "Administer supplemental oxygen during feeds only"], correct: 1, rationale: "Infants with CHD and heart failure tire easily during feeds. Nursing interventions include feeding in an upright position, allowing rest periods, using high-calorie formula, and limiting feeding time to 20-30 minutes to conserve energy." }
    ]
  },

  "tetralogy-of-fallot-expanded-rn": {
    title: "Tetralogy of Fallot (TOF)",
    cellular: {
      title: "Four Anatomical Defects and Hemodynamic Consequences",
      content: "Tetralogy of Fallot (TOF) is the most common cyanotic congenital heart defect, accounting for approximately 10% of all CHD. It results from anterior malalignment of the infundibular (conal) septum during fetal development, producing four characteristic defects: (1) Right ventricular outflow tract obstruction (RVOTO)/pulmonary stenosis — the primary determinant of clinical severity; ranges from mild infundibular narrowing to complete pulmonary atresia; (2) Ventricular septal defect (VSD) — large, nonrestrictive, subaortic; allows pressure equalization between ventricles; (3) Overriding aorta — the aortic root is positioned over the VSD, receiving blood from both ventricles; (4) Right ventricular hypertrophy (RVH) — develops as a compensatory response to increased right ventricular pressure from RVOTO. The hemodynamic consequence is a right-to-left shunt across the VSD, with the degree of shunting determined by the severity of RVOTO relative to systemic vascular resistance (SVR). Increased RVOTO or decreased SVR worsens the right-to-left shunt and deepens cyanosis. Hypercyanotic episodes (tet spells) occur when dynamic infundibular spasm acutely increases RVOTO, dramatically increasing right-to-left shunting. These spells are most common between 2-4 months of age and are the most dangerous acute complication of unrepaired TOF."
    },
    riskFactors: [
      "DiGeorge syndrome (22q11.2 deletion) — present in 15% of TOF patients",
      "Down syndrome (Trisomy 21)",
      "Maternal diabetes",
      "Maternal rubella infection in first trimester",
      "Fetal alcohol syndrome",
      "Maternal use of retinoic acid or phenytoin",
      "Family history of congenital heart disease",
      "Advanced maternal age"
    ],
    diagnostics: [
      "Echocardiography: gold standard; identifies all four defects, measures RVOTO severity",
      "Chest X-ray: boot-shaped heart (coeur en sabot) from RVH and concave main pulmonary artery segment",
      "Decreased pulmonary vascular markings on CXR (reduced pulmonary blood flow)",
      "ECG: right axis deviation, right ventricular hypertrophy, right atrial enlargement",
      "Cardiac catheterization: pre-operative assessment of coronary anatomy, pulmonary artery anatomy",
      "Pulse oximetry: oxygen saturations typically 75-85% depending on RVOTO severity",
      "CBC: polycythemia (elevated hematocrit) from chronic hypoxemia and compensatory erythropoiesis",
      "ABG: metabolic acidosis during tet spells",
      "Cardiac MRI for detailed anatomic assessment pre-operatively"
    ],
    management: [
      "Complete surgical repair: optimal timing is 3-6 months of age",
      "Repair involves VSD patch closure and relief of RVOTO (resection of infundibular muscle, pulmonary valvotomy, transannular patch if needed)",
      "Palliative surgery (Blalock-Taussig shunt): creates a systemic-to-pulmonary artery connection when complete repair is not immediately feasible",
      "Tet spell management: knee-chest positioning (increases SVR, reduces R-to-L shunt), calm the child, administer 100% O2",
      "Pharmacologic tet spell management: morphine (reduces infundibular spasm and agitation), IV phenylephrine (increases SVR), IV fluids (volume expansion)",
      "Beta-blockers (propranolol) for prophylaxis of tet spells in unoperated patients",
      "Avoid triggers of tet spells: crying, straining, dehydration, anemia, fever",
      "IV iron if iron deficiency is present (relative anemia worsens cyanosis even with normal hemoglobin)",
      "Lifelong cardiology follow-up after repair: monitor for pulmonary regurgitation, RV dilation, arrhythmias"
    ],
    nursingActions: [
      "Recognize tet spells immediately: sudden increase in cyanosis, irritability, hyperpnea (rapid deep breathing), limpness",
      "Place infant in knee-chest position during tet spell: flexes knees to chest to increase SVR",
      "Remain calm and minimize stimulation during tet spell",
      "Administer prescribed morphine sulfate for refractory tet spells",
      "Have emergency medications at bedside: morphine, phenylephrine",
      "Monitor continuous pulse oximetry and assess for changes in baseline saturations",
      "Maintain adequate hydration: dehydration increases blood viscosity and triggers tet spells",
      "Prevent iron deficiency: ensure adequate iron intake",
      "Cluster nursing care to reduce agitation and crying episodes",
      "Post-operative: monitor for dysrhythmias (JET, heart block), bleeding, low cardiac output",
      "Educate parents on tet spell recognition, knee-chest positioning, and when to call 911"
    ],
    assessmentFindings: [
      "Cyanosis: degree varies with RVOTO severity (may be mild at rest, worsens with activity/crying)",
      "Systolic ejection murmur at left upper sternal border (from pulmonary stenosis)",
      "Louder murmur = milder stenosis; softer/absent murmur during tet spell = severe obstruction",
      "Clubbing of fingers and toes (develops after months of chronic cyanosis)",
      "Squatting in older children (increases SVR, reduces R-to-L shunt, improves oxygenation)",
      "Growth retardation and failure to thrive",
      "Polycythemia with elevated hematocrit",
      "Hypercyanotic spells: acute cyanosis, irritability, hyperpnea, possible syncope",
      "Single S2 (due to diminished/absent pulmonary component)",
      "Right ventricular heave on palpation"
    ],
    signs: {
      left: [
        "Boot-shaped heart on CXR (coeur en sabot)",
        "Right axis deviation on ECG",
        "RVH pattern on ECG",
        "Decreased pulmonary vascular markings on CXR",
        "Systolic ejection murmur at LUSB",
        "Murmur softens during tet spell (paradoxical)"
      ],
      right: [
        "Central cyanosis (varies with activity)",
        "Hypercyanotic (tet) spells",
        "Squatting behavior (older children)",
        "Clubbing of digits",
        "Polycythemia on CBC",
        "Metabolic acidosis during spells"
      ]
    },
    medications: [
      { name: "Morphine Sulfate", type: "Opioid Analgesic", action: "Relaxes infundibular muscle spasm, reduces pulmonary vascular resistance, provides sedation to decrease oxygen demand", sideEffects: "Respiratory depression, hypotension, bradycardia", contra: "Severe respiratory depression without ventilatory support", pearl: "First-line medication for acute tet spells. Reduces agitation and infundibular spasm simultaneously. Have naloxone available. Dose: 0.05-0.1 mg/kg IV/IM/SQ." },
      { name: "Propranolol", type: "Non-selective Beta-Blocker", action: "Relaxes infundibular spasm, reduces heart rate, prevents hypercyanotic spells prophylactically", sideEffects: "Bradycardia, hypotension, hypoglycemia, bronchospasm", contra: "Asthma, severe bradycardia, decompensated heart failure", pearl: "Used for prevention of tet spells in unoperated TOF. Monitor blood glucose in infants — propranolol masks hypoglycemia symptoms. Must be given consistently, do not abruptly discontinue." },
      { name: "Phenylephrine", type: "Alpha-1 Agonist Vasopressor", action: "Increases systemic vascular resistance (SVR), reducing right-to-left shunting across VSD", sideEffects: "Hypertension, reflex bradycardia, tissue necrosis if extravasation occurs", contra: "Severe hypertension", pearl: "Used IV during severe tet spells when knee-chest positioning and morphine are insufficient. By increasing SVR, it forces more blood through the pulmonary circuit." },
      { name: "Prostaglandin E1 (Alprostadil)", type: "Ductal Patency Agent", action: "Maintains ductus arteriosus patency, providing additional pulmonary blood flow pathway", sideEffects: "Apnea, fever, flushing, hypotension", contra: "After successful surgical repair", pearl: "Used in severe TOF with near-pulmonary atresia to maintain pulmonary blood flow via PDA until surgical intervention. Always have intubation equipment ready." }
    ],
    pearls: [
      "TOF = most common cyanotic CHD. Four defects: pulmonary stenosis, VSD, overriding aorta, RVH",
      "Severity of cyanosis is determined by degree of RVOTO — more obstruction = more cyanosis",
      "During a tet spell, the murmur gets SOFTER (less blood flowing through stenotic pulmonary valve)",
      "Knee-chest position increases SVR, which reduces right-to-left shunting and improves pulmonary blood flow",
      "Squatting in older children serves the same purpose as knee-chest positioning in infants",
      "Boot-shaped heart on CXR is the classic radiographic finding of TOF",
      "DiGeorge syndrome (22q11.2 deletion) should be screened for in all TOF patients",
      "Post-repair complications: pulmonary regurgitation is the most common long-term issue, requiring pulmonary valve replacement in many patients",
      "Never give vasodilators during a tet spell — decreasing SVR worsens the right-to-left shunt"
    ],
    quiz: [
      { question: "During a tet spell, the nurse should first:", options: ["Administer IV morphine", "Place the infant in knee-chest position", "Apply supplemental oxygen via nasal cannula", "Prepare for emergent surgery"], correct: 1, rationale: "Knee-chest positioning is the immediate first intervention for a tet spell. It increases SVR, reduces right-to-left shunting, and improves pulmonary blood flow. Pharmacologic interventions follow if positioning is insufficient." },
      { question: "Why does the murmur become softer during a hypercyanotic spell in TOF?", options: ["The VSD closes spontaneously", "Less blood is flowing through the stenotic pulmonary valve", "The aorta shifts position", "Right ventricular pressure normalizes"], correct: 1, rationale: "During a tet spell, increased RVOTO means less blood crosses the pulmonary valve, so the murmur generated by flow across the stenosis becomes softer. A quieter murmur during a tet spell indicates worsening obstruction." },
      { question: "Which diagnostic finding is classic for Tetralogy of Fallot on chest X-ray?", options: ["Snowman sign", "Egg-on-a-string appearance", "Boot-shaped heart", "Enlarged globular heart"], correct: 2, rationale: "The boot-shaped heart (coeur en sabot) is the classic CXR finding in TOF, resulting from RVH lifting the cardiac apex upward and a concave pulmonary artery segment." },
      { question: "An older child with unrepaired TOF squats after physical activity. This behavior:", options: ["Is concerning and requires immediate intervention", "Increases systemic vascular resistance to improve oxygenation", "Decreases preload to reduce cardiac workload", "Has no physiologic significance"], correct: 1, rationale: "Squatting kinks the femoral arteries, increasing SVR. This reduces the right-to-left shunt across the VSD and forces more blood through the pulmonary circuit, improving oxygenation. It is the equivalent of knee-chest positioning in infants." },
      { question: "Which genetic syndrome should be screened for in all patients diagnosed with TOF?", options: ["Turner syndrome", "Klinefelter syndrome", "DiGeorge syndrome (22q11.2 deletion)", "Marfan syndrome"], correct: 2, rationale: "DiGeorge syndrome (22q11.2 deletion) is present in approximately 15% of TOF patients. It is associated with immune deficiency, hypocalcemia, and characteristic facial features. Screening with FISH or microarray is recommended." },
      { question: "A nurse is caring for a neonate with severe TOF receiving propranolol. Which assessment is most important?", options: ["Blood pressure every 4 hours", "Blood glucose monitoring", "Urine output every 2 hours", "Daily weight"], correct: 1, rationale: "Propranolol can cause hypoglycemia in infants by blocking glycogenolysis and masking tachycardia (a key sign of hypoglycemia). Blood glucose monitoring is essential, especially in neonates with limited glycogen stores." }
    ]
  },

  "septal-defects-expanded-rn": {
    title: "Septal Defects (VSD & ASD)",
    cellular: {
      title: "Shunt Physiology and Volume Overload",
      content: "Septal defects are the most common congenital heart defects, with ventricular septal defects (VSDs) accounting for 25-30% of all CHD and atrial septal defects (ASDs) accounting for 10-15%. These are acyanotic left-to-right shunt lesions. In VSD, an opening in the interventricular septum allows oxygenated blood from the higher-pressure left ventricle to shunt into the lower-pressure right ventricle during systole. The magnitude of shunting depends on defect size and the pressure gradient between ventricles. Small restrictive VSDs generate high-velocity jets and loud murmurs but have minimal hemodynamic impact; large nonrestrictive VSDs allow pressure equalization, causing significant volume overload of the pulmonary circuit. In ASD, the defect in the interatrial septum allows left-to-right shunting during diastole, as left atrial pressure is slightly higher than right atrial pressure. ASD shunting is lower velocity and more gradual, often remaining asymptomatic until adulthood. Both defects cause pulmonary overcirculation: increased pulmonary blood flow leads to pulmonary vascular remodeling, elevated pulmonary artery pressure, and eventually pulmonary hypertension. If uncorrected, chronic volume overload leads to Eisenmenger syndrome — irreversible pulmonary hypertension with shunt reversal (right-to-left), producing cyanosis and contraindicating surgical repair. The pathologic sequence is: left-to-right shunt → pulmonary overcirculation → pulmonary vascular remodeling → pulmonary hypertension → shunt reversal → Eisenmenger syndrome."
    },
    riskFactors: [
      "Down syndrome (Trisomy 21) — strongly associated with AVSD and VSD",
      "Fetal alcohol syndrome",
      "Maternal rubella infection",
      "Maternal diabetes",
      "Family history of CHD",
      "Prematurity (PDA and VSD more common)",
      "Genetic syndromes: Holt-Oram syndrome (ASD), Noonan syndrome",
      "Teratogenic drug exposure during first trimester"
    ],
    diagnostics: [
      "Echocardiography with Doppler: gold standard; visualizes defect location, size, direction and velocity of shunt",
      "VSD murmur: harsh holosystolic (pansystolic) murmur best heard at left lower sternal border, with thrill",
      "ASD murmur: fixed split S2 is the hallmark; systolic ejection murmur at left upper sternal border (from increased flow across pulmonary valve)",
      "Chest X-ray: cardiomegaly, increased pulmonary vascular markings (plethora), prominent pulmonary artery",
      "ECG VSD: biventricular hypertrophy in large defects, left ventricular volume overload pattern",
      "ECG ASD: right axis deviation, right ventricular volume overload pattern (rSR' in V1), incomplete RBBB",
      "Cardiac catheterization: measures oxygen saturations in chambers (step-up in RV for VSD, step-up in RA for ASD), calculates Qp:Qs ratio",
      "Qp:Qs ratio greater than 1.5:1 generally indicates need for closure",
      "BNP/NT-proBNP elevation indicates heart failure from volume overload"
    ],
    management: [
      "Small VSDs: many close spontaneously (60-70% of muscular VSDs close by age 3)",
      "Medical management of heart failure: digoxin, diuretics, ACE inhibitors, caloric supplementation",
      "Surgical VSD repair: indicated for large defects with heart failure, failure to thrive, Qp:Qs greater than 2:1, or pulmonary hypertension",
      "Surgical ASD repair: indicated for significant shunts (Qp:Qs greater than 1.5:1), typically performed at 3-5 years of age",
      "Transcatheter device closure: available for secundum ASDs and some muscular VSDs (Amplatzer device)",
      "Surgical closure via median sternotomy with cardiopulmonary bypass and Dacron or pericardial patch",
      "Eisenmenger syndrome: contraindication to surgical repair; managed with pulmonary vasodilators, eventual transplant consideration",
      "Endocarditis prophylaxis: required for 6 months post-surgical/device closure, or indefinitely if residual shunt",
      "RSV prophylaxis (palivizumab) for infants with hemodynamically significant defects"
    ],
    nursingActions: [
      "Monitor for heart failure symptoms: tachycardia, tachypnea, diaphoresis, hepatomegaly, poor feeding, failure to thrive",
      "Administer digoxin: check apical pulse for 1 full minute; hold if below age-appropriate threshold",
      "Administer diuretics: monitor daily weights, strict I&O, electrolytes (especially potassium)",
      "High-calorie feeding strategies: fortified breast milk or concentrated formula (24-30 kcal/oz)",
      "Small frequent feedings, limit to 20-30 minutes to reduce fatigue",
      "Prevent respiratory infections: hand hygiene, limit visitors during RSV season, ensure vaccinations are current",
      "Post-operative monitoring: continuous cardiac monitoring, hemodynamic assessment, bleeding from sternotomy, rhythm disturbances",
      "Post-catheterization closure: monitor access site for bleeding/hematoma, assess distal pulses, maintain bedrest as ordered",
      "Educate parents on medication administration, signs of heart failure, growth monitoring, and activity guidelines"
    ],
    assessmentFindings: [
      "VSD: harsh holosystolic murmur at LLSB, often with palpable thrill",
      "ASD: fixed split S2 (does not vary with respiration), systolic ejection murmur at LUSB",
      "Heart failure signs: tachycardia, tachypnea, hepatomegaly, periorbital edema, diaphoresis with feeding",
      "Failure to thrive: weight and height below expected growth curves",
      "Frequent upper and lower respiratory infections",
      "Increased precordial activity (hyperdynamic precordium)",
      "Exercise intolerance in older children",
      "Signs of Eisenmenger syndrome (late): cyanosis, clubbing, polycythemia, syncope"
    ],
    signs: {
      left: [
        "VSD findings:",
        "Harsh holosystolic murmur at LLSB",
        "Palpable thrill at LLSB",
        "Cardiomegaly on CXR",
        "Increased pulmonary markings",
        "Biventricular hypertrophy on ECG",
        "Heart failure in large defects"
      ],
      right: [
        "ASD findings:",
        "Fixed split S2 (hallmark)",
        "Systolic ejection murmur at LUSB",
        "Right axis deviation on ECG",
        "rSR' pattern in V1 (incomplete RBBB)",
        "Often asymptomatic until adulthood",
        "Paradoxical embolism risk (stroke)"
      ]
    },
    medications: [
      { name: "Digoxin", type: "Cardiac Glycoside", action: "Positive inotrope — increases myocardial contractility; negative chronotrope — slows heart rate via AV node delay", sideEffects: "Bradycardia, dysrhythmias, nausea, vomiting, visual disturbances (green-yellow halos)", contra: "Hypokalemia, hypomagnesemia, hypercalcemia, ventricular dysrhythmias", pearl: "Hold if apical HR is below 90-110 bpm (infant) or below 70 bpm (child). Draw digoxin levels 6-8 hours after last dose. Therapeutic range: 0.8-2.0 ng/mL. Hypokalemia is the #1 risk factor for dig toxicity." },
      { name: "Furosemide", type: "Loop Diuretic", action: "Blocks Na+/K+/2Cl- cotransporter in ascending loop of Henle, promoting diuresis", sideEffects: "Hypokalemia, hyponatremia, hypocalcemia, ototoxicity, metabolic alkalosis", contra: "Severe dehydration, anuria, electrolyte depletion", pearl: "Monitor potassium closely — furosemide + digoxin = high risk for hypokalemia-induced dig toxicity. Give potassium supplements as ordered. Weigh daily, same time, same scale." },
      { name: "Spironolactone", type: "Potassium-Sparing Diuretic", action: "Aldosterone antagonist in distal tubule; mild diuresis while conserving potassium", sideEffects: "Hyperkalemia, gynecomastia, GI upset", contra: "Hyperkalemia, renal failure, concurrent potassium supplementation without monitoring", pearl: "Often given with furosemide to offset potassium losses. Monitor potassium levels. Do not give potassium supplements without checking levels first." },
      { name: "Captopril/Enalapril", type: "ACE Inhibitor", action: "Reduces afterload (systemic vascular resistance), decreases left-to-right shunt volume, reduces aldosterone secretion", sideEffects: "Hypotension, cough, hyperkalemia, renal impairment", contra: "Bilateral renal artery stenosis, angioedema history, pregnancy", pearl: "Reducing afterload decreases the pressure gradient driving the left-to-right shunt, reducing pulmonary overcirculation. Monitor first-dose hypotension. Check renal function and potassium." }
    ],
    pearls: [
      "VSD is the most common CHD overall. ASD is the most common CHD diagnosed in adulthood",
      "Fixed split S2 = ASD (does not vary with respiration, unlike physiologic splitting)",
      "Most small muscular VSDs close spontaneously — monitor and manage heart failure conservatively",
      "Larger VSD = quieter murmur (less turbulence when pressures equalize); smaller VSD = louder murmur",
      "Paradoxical embolism: venous thrombus crosses ASD to enter systemic circulation, causing stroke",
      "Eisenmenger syndrome timeline: typically develops after years of unrepaired large left-to-right shunt",
      "Qp:Qs ratio quantifies shunt: 1:1 = no shunt; greater than 1.5:1 = significant left-to-right shunt",
      "Post-device closure: patients need aspirin and sometimes clopidogrel until endothelialization occurs",
      "Exam pearl: a child with frequent pneumonia and failure to thrive — think large VSD with heart failure"
    ],
    quiz: [
      { question: "What is the hallmark auscultatory finding of an ASD?", options: ["Harsh holosystolic murmur", "Fixed split S2", "Continuous machinery murmur", "Diastolic rumble"], correct: 1, rationale: "A fixed split S2 is the hallmark of ASD. Unlike physiologic splitting that varies with respiration, the split in ASD is fixed because the right ventricle always has increased volume (from left-to-right shunt), prolonging right ventricular ejection time equally during inspiration and expiration." },
      { question: "A 2-month-old with a large VSD presents with tachypnea, diaphoresis during feeding, and failure to thrive. The nurse recognizes these as signs of:", options: ["Tet spells", "Heart failure from pulmonary overcirculation", "Pulmonary embolism", "Eisenmenger syndrome"], correct: 1, rationale: "These are classic signs of heart failure in an infant with a large VSD. The left-to-right shunt causes pulmonary overcirculation, volume overload, and heart failure. Symptoms worsen with activity (feeding)." },
      { question: "Why is a smaller VSD often louder on auscultation than a larger VSD?", options: ["Smaller defects create more turbulent flow due to higher velocity jets", "Larger defects have no murmur", "The stethoscope picks up smaller vibrations better", "The VSD size does not affect murmur intensity"], correct: 0, rationale: "In a small restrictive VSD, the pressure gradient between ventricles is maintained, creating high-velocity turbulent flow and a loud murmur. In a large nonrestrictive VSD, pressures equalize, reducing flow velocity and murmur intensity." },
      { question: "Eisenmenger syndrome contraindicates surgical closure because:", options: ["The defect is too small to repair", "Irreversible pulmonary hypertension means closing the defect would remove the right ventricle's pressure relief valve", "The patient is too old for surgery", "Anticoagulation therapy prevents surgery"], correct: 1, rationale: "In Eisenmenger syndrome, the right-to-left shunt serves as a pressure relief mechanism for the right ventricle against fixed pulmonary hypertension. Closing the defect would cause acute right heart failure." },
      { question: "A nurse administers furosemide and digoxin to an infant with VSD. Which lab value requires the most vigilant monitoring?", options: ["Sodium", "Calcium", "Potassium", "Magnesium"], correct: 2, rationale: "Furosemide causes potassium loss. Hypokalemia dramatically increases the risk of digoxin toxicity by enhancing digoxin binding to Na+/K+ ATPase. Potassium must be monitored closely and supplemented as needed." },
      { question: "Which type of ASD is amenable to transcatheter device closure?", options: ["Primum ASD", "Secundum ASD", "Sinus venosus ASD", "Coronary sinus ASD"], correct: 1, rationale: "Secundum ASDs, located in the center of the atrial septum with adequate tissue rims, are suitable for transcatheter Amplatzer device closure. Primum, sinus venosus, and coronary sinus ASDs require surgical repair." }
    ]
  },

  "coarctation-expanded-rn": {
    title: "Coarctation of the Aorta",
    cellular: {
      title: "Pressure Gradient and Ductal-Dependent Physiology",
      content: "Coarctation of the aorta (CoA) is a discrete narrowing of the aortic lumen, typically occurring at the aortic isthmus just distal to the left subclavian artery origin, near the insertion of the ductus arteriosus (juxtaductal). This narrowing creates a pressure gradient, with hypertension proximal to the coarctation (head, upper extremities) and hypotension distal to it (abdominal organs, lower extremities). The pathophysiology varies by age of presentation. Neonatal/infantile coarctation (preductal or juxtaductal) is often severe and presents when the ductus arteriosus closes, as ductal flow was providing perfusion to the lower body. This is a ductal-dependent lesion — closure of the PDA leads to acute hemodynamic collapse with severe lower extremity hypoperfusion, metabolic acidosis, and shock. Older children/adults with coarctation have milder narrowing and develop collateral circulation through intercostal, internal mammary, and subclavian arteries, compensating for the obstruction. The left ventricle faces chronic increased afterload from the obstruction, leading to left ventricular hypertrophy, heart failure, and increased risk for aortic dissection, cerebral aneurysm rupture, and endocarditis. Coarctation is strongly associated with bicuspid aortic valve (present in 50-85% of CoA patients) and Turner syndrome."
    },
    riskFactors: [
      "Turner syndrome (45,X) — coarctation is the most common cardiac defect in Turner syndrome",
      "Bicuspid aortic valve (present in 50-85% of CoA patients)",
      "Male sex (2-3:1 male to female ratio, except in Turner syndrome)",
      "Family history of left-sided obstructive lesions",
      "Associated with other left heart obstructive lesions: mitral stenosis, aortic stenosis (Shone complex)",
      "Fetal alcohol exposure",
      "DiGeorge syndrome"
    ],
    diagnostics: [
      "Four-extremity blood pressure: upper extremity BP 20+ mmHg higher than lower extremity BP (hallmark finding)",
      "Pulse assessment: bounding upper extremity pulses, diminished or absent femoral pulses",
      "Pulse delay: radial-femoral pulse lag (radial pulse felt before femoral pulse)",
      "Echocardiography: visualizes narrowing, measures gradient, assesses LV function and associated lesions",
      "Chest X-ray: rib notching (from dilated intercostal collateral arteries eroding ribs; seen in older children/adults)",
      "CXR: '3 sign' or 'reverse E sign' — indentation at coarctation site with pre- and post-stenotic dilation",
      "CT angiography or MR angiography: detailed aortic anatomy for surgical planning",
      "ECG: left ventricular hypertrophy in older children; RVH may be seen in neonates",
      "Cardiac catheterization: measures gradient, balloon angioplasty can be performed"
    ],
    management: [
      "Neonatal critical coarctation: PGE1 infusion to reopen ductus arteriosus and restore lower body perfusion",
      "Stabilization: correct metabolic acidosis, support circulation, intubate if needed",
      "Surgical repair options: end-to-end anastomosis (most common), subclavian flap aortoplasty, patch aortoplasty",
      "Balloon angioplasty with or without stent placement: used for native coarctation in older children or recurrent coarctation",
      "Optimal surgical timing: once stabilized on PGE1, typically within first 1-2 weeks of life for critical coarctation",
      "Post-repair hypertension management: may require antihypertensives (beta-blockers, ACE inhibitors)",
      "Paradoxical post-coarctectomy hypertension: can occur 24-48 hours post-repair",
      "Post-coarctectomy syndrome: abdominal pain, distension, and GI bleeding from mesenteric arteritis (rare but serious)",
      "Lifelong follow-up: recoarctation occurs in 5-10%, bicuspid aortic valve requires monitoring"
    ],
    nursingActions: [
      "Assess four-extremity blood pressures in neonates and report upper-to-lower extremity gradient greater than 20 mmHg",
      "Palpate femoral pulses in all newborn assessments — diminished or absent femoral pulses are a red flag",
      "Compare upper and lower extremity oxygen saturations (pre- and post-ductal)",
      "Administer PGE1 as ordered for critical coarctation: have intubation equipment at bedside (apnea risk)",
      "Monitor for signs of heart failure: tachycardia, tachypnea, poor feeding, hepatomegaly",
      "Post-operative assessment: blood pressure in all four extremities, distal perfusion checks, abdominal assessment",
      "Monitor for post-coarctectomy syndrome: severe abdominal pain, distension, bloody stools",
      "Monitor for paradoxical hypertension post-repair: aggressive BP management as ordered",
      "Educate family on lifelong need for BP monitoring, cardiology follow-up, and exercise restrictions if applicable"
    ],
    assessmentFindings: [
      "Upper extremity hypertension with lower extremity hypotension (blood pressure gradient greater than 20 mmHg)",
      "Bounding radial and brachial pulses with weak or absent femoral pulses",
      "Radial-femoral pulse delay",
      "Systolic murmur heard best between scapulae (over coarctation site)",
      "Neonatal presentation: signs of shock when ductus closes — poor perfusion, mottling, metabolic acidosis, oliguria",
      "Older children: headaches, epistaxis, leg fatigue with exercise",
      "Cool lower extremities compared to warm upper extremities",
      "Visible pulsations in suprasternal notch (from proximal aortic dilation)",
      "Rib notching on CXR (older children from collateral circulation)"
    ],
    signs: {
      left: [
        "Upper extremity hypertension",
        "Bounding radial/brachial pulses",
        "Headaches and epistaxis (older children)",
        "Systolic murmur between scapulae",
        "Rib notching on CXR (older children)",
        "3 sign on CXR",
        "LVH on ECG"
      ],
      right: [
        "Lower extremity hypotension",
        "Diminished/absent femoral pulses",
        "Leg claudication with exercise",
        "Cool lower extremities",
        "Shock in neonates when PDA closes",
        "Metabolic acidosis",
        "Radial-femoral pulse delay"
      ]
    },
    medications: [
      { name: "Prostaglandin E1 (Alprostadil)", type: "Ductal Patency Agent", action: "Reopens or maintains ductus arteriosus patency to restore blood flow to lower body", sideEffects: "Apnea, fever, flushing, hypotension, seizures", contra: "None in emergent ductal-dependent coarctation", pearl: "Life-saving in critical neonatal coarctation. Start immediately when coarctation is suspected in a decompensating neonate. Have ventilatory support available. Do not delay PGE1 while awaiting echocardiographic confirmation." },
      { name: "Milrinone", type: "Phosphodiesterase-3 Inhibitor (Inodilator)", action: "Improves cardiac contractility and reduces afterload through vasodilation", sideEffects: "Hypotension, thrombocytopenia, dysrhythmias", contra: "Severe hypovolemia, severe aortic or pulmonary stenosis", pearl: "Used post-operatively to support cardiac output and reduce afterload. Loading dose often omitted to avoid hypotension. Requires continuous cardiac monitoring." },
      { name: "Esmolol/Labetalol", type: "Beta-Blocker", action: "Controls paradoxical hypertension post-coarctectomy by reducing heart rate and blood pressure", sideEffects: "Bradycardia, hypotension, bronchospasm", contra: "Severe bradycardia, heart block, decompensated heart failure", pearl: "Post-coarctectomy hypertension is common and can cause mesenteric arteritis. IV esmolol (short-acting) allows titration. Transition to oral antihypertensives as tolerated." },
      { name: "Sodium Nitroprusside", type: "Direct Vasodilator", action: "Rapidly reduces blood pressure in hypertensive emergencies post-repair", sideEffects: "Cyanide toxicity with prolonged use, hypotension, reflex tachycardia", contra: "Inadequate cerebral perfusion, hepatic insufficiency", pearl: "Used for severe post-operative hypertension. Monitor thiocyanate levels if used greater than 48 hours. Protect from light. Arterial line required for titration." }
    ],
    pearls: [
      "Absent or diminished femoral pulses in a neonate = think coarctation until proven otherwise",
      "Four-extremity BP is the key screening tool: greater than 20 mmHg gradient (upper > lower) is diagnostic",
      "Coarctation is the most common cardiac defect in Turner syndrome (45,X)",
      "Bicuspid aortic valve is present in 50-85% of coarctation patients — always assess",
      "Neonates present with shock when PDA closes; older children present with upper body hypertension",
      "Rib notching on CXR develops from intercostal artery collateral flow — seen in older children, not neonates",
      "Post-coarctectomy syndrome: mesenteric arteritis causing abdominal pain and GI bleeding within 1-3 days post-repair",
      "Paradoxical hypertension post-repair: occurs in 24-48 hours, requires aggressive management",
      "Recoarctation occurs in 5-10% and may require balloon angioplasty or repeat surgery"
    ],
    quiz: [
      { question: "A nurse is assessing a 2-day-old neonate and notes bounding brachial pulses but absent femoral pulses. The priority action is to:", options: ["Document the finding and reassess in 4 hours", "Obtain four-extremity blood pressures and notify the provider", "Begin CPR", "Apply pulse oximetry to the right foot only"], correct: 1, rationale: "Absent femoral pulses with bounding upper extremity pulses is the hallmark of coarctation of the aorta. Four-extremity BP assessment and immediate provider notification are essential for diagnosis and treatment initiation." },
      { question: "A neonate with critical coarctation begins PGE1 infusion. Which assessment is the highest priority?", options: ["Hourly urine output", "Continuous respiratory monitoring for apnea", "Daily weight", "Capillary blood glucose every 6 hours"], correct: 1, rationale: "PGE1 causes apnea in approximately 12% of neonates. Continuous respiratory monitoring is essential, and intubation equipment must be at bedside. Apnea is the most dangerous immediate side effect." },
      { question: "Which congenital syndrome is most strongly associated with coarctation of the aorta?", options: ["Down syndrome", "Turner syndrome", "Patau syndrome", "Edwards syndrome"], correct: 1, rationale: "Turner syndrome (45,X) is most strongly associated with coarctation of the aorta. Coarctation is the most common cardiac defect in Turner syndrome. All patients with coarctation should be evaluated for Turner syndrome, especially females." },
      { question: "Rib notching on chest X-ray in coarctation is caused by:", options: ["Erosion from dilated intercostal collateral arteries", "Calcium deposits from chronic hypertension", "Pulmonary overcirculation", "Right ventricular hypertrophy"], correct: 0, rationale: "Rib notching results from dilated, pulsatile intercostal arteries that serve as collateral blood flow pathways, bypassing the aortic obstruction. These vessels erode the inferior borders of the ribs over time." },
      { question: "Post-coarctectomy syndrome is characterized by:", options: ["Cyanosis and respiratory distress", "Abdominal pain, distension, and possible GI bleeding from mesenteric arteritis", "Complete heart block requiring pacing", "Renal failure from contrast exposure"], correct: 1, rationale: "Post-coarctectomy syndrome involves mesenteric arteritis from sudden increase in blood flow to the gut after repair. Symptoms include severe abdominal pain, distension, and GI bleeding. It typically occurs 1-3 days post-repair." },
      { question: "A nurse assesses an older child with known coarctation. Expected findings include:", options: ["Upper body hypertension, headaches, and epistaxis", "Lower body hypertension and upper body cyanosis", "Symmetric blood pressures in all extremities", "Absent radial pulses"], correct: 0, rationale: "In older children with coarctation, the obstruction creates upper body hypertension (above the narrowing) with symptoms including headaches, epistaxis, and dizziness. Lower extremities have lower blood pressure and may have leg fatigue with exercise." }
    ]
  },

  "anticoagulation-therapy-expanded-rn": {
    title: "Anticoagulation Therapy",
    cellular: {
      title: "Coagulation Cascade and Drug Mechanisms",
      content: "Anticoagulation therapy targets specific components of the coagulation cascade to prevent pathologic thrombus formation. The coagulation cascade operates through intrinsic (contact activation), extrinsic (tissue factor), and common pathways, all converging on the conversion of prothrombin (Factor II) to thrombin, which then converts fibrinogen to fibrin. Unfractionated heparin (UFH) binds to antithrombin III (AT-III), dramatically accelerating its inhibition of thrombin (Factor IIa), Factor Xa, and other serine proteases (IXa, XIa, XIIa). UFH has a short half-life (60-90 minutes IV), is monitored by activated partial thromboplastin time (aPTT), and is fully reversible with protamine sulfate. Low-molecular-weight heparins (LMWH, e.g., enoxaparin) preferentially inhibit Factor Xa over thrombin, have more predictable pharmacokinetics, longer half-lives (4-6 hours), are given subcutaneously, and are monitored by anti-Xa levels when needed. Warfarin is a vitamin K antagonist that inhibits hepatic synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and natural anticoagulants (protein C and protein S). Warfarin has a delayed onset (3-5 days for full effect) and is monitored by the International Normalized Ratio (INR). Direct oral anticoagulants (DOACs) include direct thrombin inhibitors (dabigatran) and direct Factor Xa inhibitors (rivaroxaban, apixaban, edoxaban). DOACs have predictable pharmacokinetics, fewer drug/food interactions than warfarin, and do not require routine monitoring. However, they are renally cleared and require dose adjustment or avoidance in renal impairment."
    },
    riskFactors: [
      "Indications requiring anticoagulation: atrial fibrillation (stroke prevention), DVT/PE (treatment and prevention), mechanical heart valves (warfarin only), post-orthopedic surgery prophylaxis",
      "Venous thromboembolism risk factors: Virchow's triad (stasis, endothelial injury, hypercoagulability)",
      "Thrombophilia: Factor V Leiden, prothrombin gene mutation, antiphospholipid syndrome, protein C/S deficiency",
      "Heparin-induced thrombocytopenia (HIT) risk with UFH greater than LMWH",
      "Warfarin interactions: CYP2C9 and VKORC1 genetic polymorphisms affect metabolism and dosing",
      "Dietary vitamin K intake affects warfarin efficacy",
      "Renal impairment affects DOAC dosing and LMWH clearance",
      "Fall risk assessment essential before initiating anticoagulation in elderly patients"
    ],
    diagnostics: [
      "aPTT (activated partial thromboplastin time): monitors UFH therapy; therapeutic range typically 1.5-2.5 times control (60-80 seconds)",
      "Anti-Xa level: monitors LMWH and UFH; therapeutic range varies by indication",
      "INR (International Normalized Ratio): monitors warfarin; therapeutic range 2.0-3.0 for most indications, 2.5-3.5 for mechanical mitral valves",
      "PT (Prothrombin Time): elevated with warfarin therapy; INR is the standardized measure",
      "Baseline CBC with platelet count before initiating anticoagulation",
      "Platelet monitoring with heparin: baseline, then every 2-3 days for HIT surveillance (days 4-14 highest risk)",
      "Renal function (BUN, creatinine, GFR): essential before DOACs and LMWH dosing",
      "Liver function tests: hepatic impairment affects warfarin metabolism and coagulation factor synthesis",
      "D-dimer: fibrin degradation product; elevated in DVT/PE, DIC, but nonspecific",
      "Fibrinogen level: depleted in DIC, liver failure"
    ],
    management: [
      "UFH: continuous IV infusion with weight-based protocol; bolus then maintenance dose; titrate to aPTT",
      "LMWH (enoxaparin): 1 mg/kg SQ every 12 hours (treatment dose) or 40 mg SQ daily (prophylactic dose)",
      "Warfarin: initiated with 5 mg daily (adjusted for age, weight, genetics); overlap with heparin for 5+ days AND until INR is therapeutic for 24 hours",
      "Bridge therapy: heparin or LMWH used to bridge until warfarin reaches therapeutic INR (typically 5 days)",
      "DOACs: fixed dosing without routine monitoring; rivaroxaban 20 mg daily with food, apixaban 5 mg BID, dabigatran 150 mg BID",
      "DOAC dose adjustments: reduce for renal impairment, age greater than 80, weight less than 60 kg, drug interactions",
      "Duration of anticoagulation: provoked DVT (3 months), unprovoked DVT (6-12 months or indefinite), AF (indefinite), mechanical valve (lifelong warfarin)",
      "Peri-operative anticoagulation management: bridge with LMWH when warfarin is held; DOACs stopped 24-48 hours pre-procedure"
    ],
    nursingActions: [
      "Assess for contraindications: active bleeding, recent surgery, thrombocytopenia, hepatic failure, recent stroke",
      "Administer UFH via IV pump only; never bolus without verification; use institutional heparin protocol",
      "Draw aPTT 6 hours after dose change; do not draw from the heparin-infusing line",
      "Administer LMWH subcutaneously in abdomen: do not aspirate or rub injection site, rotate sites",
      "Administer warfarin at the same time daily (typically evening); teach consistent vitamin K intake (not avoid, but CONSISTENT)",
      "DOAC administration: rivaroxaban must be taken with food for absorption; apixaban and dabigatran may be taken with or without food",
      "Assess for bleeding: check stools for occult blood, monitor urine color, assess gums, skin for petechiae/ecchymosis",
      "Monitor labs: aPTT for UFH (every 6 hours after changes), INR for warfarin (daily initially, then weekly, then monthly when stable)",
      "Fall prevention: implement fall precautions for all anticoagulated patients",
      "Patient education: medication compliance, avoiding contact sports, carrying medical identification, drug/food interactions",
      "Teach patients to report: unusual bruising, blood in urine/stool, prolonged bleeding from cuts, headache/vision changes, black tarry stools"
    ],
    assessmentFindings: [
      "Therapeutic anticoagulation: absence of new clot formation, no extension of existing thrombus",
      "Supratherapeutic anticoagulation: petechiae, ecchymosis, gum bleeding, epistaxis, hematuria, melena",
      "Signs of major bleeding: hemodynamic instability, altered mental status, hematemesis, large hematoma",
      "Signs of DVT (indicating inadequate anticoagulation): unilateral leg swelling, pain, warmth, redness, positive Homans' sign (unreliable)",
      "Signs of PE: sudden dyspnea, pleuritic chest pain, tachycardia, hypoxemia, hemoptysis",
      "Signs of HIT: platelets drop greater than 50% from baseline on days 5-10 of heparin therapy, with or without thrombosis"
    ],
    signs: {
      left: [
        "Monitoring parameters:",
        "aPTT: 1.5-2.5x control (UFH)",
        "INR: 2.0-3.0 (warfarin, most indications)",
        "INR: 2.5-3.5 (mechanical mitral valve)",
        "Anti-Xa level for LMWH monitoring",
        "Platelet count for HIT surveillance",
        "CBC for occult bleeding"
      ],
      right: [
        "Bleeding signs to report:",
        "Petechiae, ecchymosis, purpura",
        "Hematuria (pink/red/cola-colored urine)",
        "Melena or hematochezia",
        "Epistaxis, gum bleeding",
        "Hemoptysis",
        "Headache with altered mental status"
      ]
    },
    medications: [
      { name: "Unfractionated Heparin (UFH)", type: "Indirect Thrombin Inhibitor", action: "Binds antithrombin III, accelerating inhibition of thrombin (IIa) and Factor Xa by 1000-fold", sideEffects: "Bleeding, HIT (heparin-induced thrombocytopenia), osteoporosis with long-term use, hyperkalemia", contra: "Active major bleeding, severe thrombocytopenia, HIT history", pearl: "Short half-life (60-90 min IV) allows rapid titration. Reversed by protamine sulfate (1 mg per 100 units UFH). Monitor aPTT every 6 hours after dose change. Weight-based dosing: 80 units/kg bolus, then 18 units/kg/hour." },
      { name: "Enoxaparin (Lovenox)", type: "Low-Molecular-Weight Heparin", action: "Preferentially inhibits Factor Xa through antithrombin III binding; more predictable dose-response than UFH", sideEffects: "Bleeding, injection site bruising, thrombocytopenia (less HIT risk than UFH), hyperkalemia", contra: "Active major bleeding, HIT, severe renal impairment (CrCl less than 30 — use UFH instead)", pearl: "Given SQ in abdomen. Do NOT expel air bubble before injection. Do NOT aspirate or rub site. Anti-Xa level drawn 4 hours after 3rd dose if monitoring needed. Partially reversed by protamine (60% reversal)." },
      { name: "Warfarin (Coumadin)", type: "Vitamin K Antagonist", action: "Inhibits vitamin K epoxide reductase (VKORC1), blocking synthesis of factors II, VII, IX, X, and proteins C and S", sideEffects: "Bleeding, skin necrosis (protein C depletion in first days), teratogenic (category X), purple toe syndrome", contra: "Pregnancy, active bleeding, severe hepatic disease, non-compliance risk", pearl: "Takes 3-5 days for full effect (factor half-lives). Must overlap with heparin during initiation. Consistent vitamin K intake (not elimination). Monitor INR. Numerous drug interactions (antibiotics, NSAIDs, amiodarone). Reversed by vitamin K (slow onset) or 4-factor PCC (immediate)." },
      { name: "Apixaban (Eliquis)", type: "Direct Factor Xa Inhibitor (DOAC)", action: "Directly and reversibly inhibits free and clot-bound Factor Xa, interrupting thrombin generation", sideEffects: "Bleeding, GI upset, elevated liver enzymes", contra: "Active pathologic bleeding, severe hepatic impairment, prosthetic heart valves", pearl: "No routine monitoring needed. Fixed dosing: 5 mg BID (reduce to 2.5 mg BID if age 80+, weight ≤60 kg, or creatinine ≥1.5). Can be crushed and given via NG tube. Lower GI bleeding risk than rivaroxaban. Reversed by andexanet alfa." },
      { name: "Rivaroxaban (Xarelto)", type: "Direct Factor Xa Inhibitor (DOAC)", action: "Directly inhibits Factor Xa in both the intrinsic and extrinsic coagulation pathways", sideEffects: "Bleeding, GI bleeding (higher than apixaban), back pain", contra: "Active bleeding, severe hepatic disease, prosthetic heart valves, CrCl less than 15", pearl: "Must be taken WITH FOOD for adequate absorption (15 and 20 mg doses). Once daily dosing for AF. Reversed by andexanet alfa. No reliable lab monitoring test in emergencies." },
      { name: "Dabigatran (Pradaxa)", type: "Direct Thrombin Inhibitor (DOAC)", action: "Directly and reversibly binds to the active site of thrombin (Factor IIa), blocking fibrin formation", sideEffects: "GI upset (dyspepsia in 10%), bleeding, GI bleeding", contra: "Active bleeding, prosthetic heart valves, severe renal impairment (CrCl less than 30)", pearl: "Most renally dependent DOAC (80% renal excretion). Must be stored in original bottle/blister (humidity sensitive). Capsules must not be crushed. Reversed by idarucizumab (Praxbind) — specific reversal agent. Dialyzable." }
    ],
    pearls: [
      "Warfarin requires 3-5 days for full effect — always bridge with heparin during initiation",
      "INR target 2.0-3.0 for most indications; 2.5-3.5 for mechanical mitral valves",
      "DOACs are contraindicated in mechanical heart valves — only warfarin is approved",
      "Consistent vitamin K intake is the goal with warfarin (not avoidance); sudden changes cause INR fluctuation",
      "HIT (heparin-induced thrombocytopenia): platelet drop greater than 50% on days 5-14 of heparin; paradoxically causes thrombosis, not bleeding",
      "Protamine reverses UFH (100%); partially reverses LMWH (60%); does NOT reverse DOACs or warfarin",
      "Enoxaparin is dosed by actual body weight for treatment; use adjusted body weight in obese patients per protocol",
      "aPTT is drawn 6 hours after UFH dose changes — not before",
      "LMWH SQ injection: do not aspirate, do not rub, inject into abdominal fat roll, rotate sites",
      "Rivaroxaban must be taken with food — without food, absorption drops significantly"
    ],
    quiz: [
      { question: "A patient on warfarin has an INR of 4.8 with no active bleeding. The nurse anticipates which order?", options: ["Administer protamine sulfate IV", "Hold warfarin and administer oral vitamin K", "Discontinue warfarin permanently", "Administer fresh frozen plasma"], correct: 1, rationale: "For supratherapeutic INR (4.5-10) without bleeding, the standard approach is to hold warfarin and administer oral vitamin K (1-2.5 mg). Protamine reverses heparin, not warfarin. FFP is reserved for major bleeding." },
      { question: "Which lab test is used to monitor unfractionated heparin therapy?", options: ["INR", "aPTT", "PT", "D-dimer"], correct: 1, rationale: "aPTT (activated partial thromboplastin time) monitors UFH therapy. The therapeutic goal is typically 1.5-2.5 times the control value. INR monitors warfarin. PT is part of the INR calculation." },
      { question: "A nurse is administering enoxaparin subcutaneously. Which technique is correct?", options: ["Aspirate before injection and massage the site after", "Inject into the deltoid muscle with a 22-gauge needle", "Inject into abdominal fat, do not aspirate, do not rub the site after injection", "Expel the air bubble from the syringe before injecting"], correct: 2, rationale: "Enoxaparin is given SQ into the abdomen. Do NOT expel the air bubble (it locks the medication in). Do NOT aspirate before or rub after injection. Rotate injection sites to prevent hematoma." },
      { question: "A patient on heparin develops a platelet count drop from 180,000 to 75,000 on day 6. The nurse suspects:", options: ["Normal heparin response", "Heparin-induced thrombocytopenia (HIT)", "Vitamin K deficiency", "DIC"], correct: 1, rationale: "A platelet drop greater than 50% from baseline occurring on days 5-14 of heparin therapy is the classic presentation of HIT. This requires immediate heparin discontinuation and transition to a non-heparin anticoagulant (argatroban, bivalirudin)." },
      { question: "Which DOAC must be taken with food for proper absorption?", options: ["Apixaban", "Dabigatran", "Rivaroxaban", "Edoxaban"], correct: 2, rationale: "Rivaroxaban (Xarelto) must be taken with food for adequate absorption, especially the 15 mg and 20 mg doses. Without food, bioavailability drops significantly, potentially making the drug subtherapeutic." },
      { question: "DOACs are contraindicated in patients with:", options: ["Atrial fibrillation", "Deep vein thrombosis", "Mechanical heart valves", "Pulmonary embolism"], correct: 2, rationale: "DOACs are contraindicated in patients with mechanical (prosthetic) heart valves. Only warfarin is approved for this indication. The RE-ALIGN trial showed increased thrombotic events with dabigatran in mechanical valve patients." }
    ]
  },

  "bleeding-risks-reversal-rn": {
    title: "Bleeding Risks & Reversal Agents",
    cellular: {
      title: "Reversal Pharmacology and HIT Pathophysiology",
      content: "Anticoagulant reversal is critical in life-threatening bleeding or emergent surgery. Each anticoagulant class has specific reversal strategies. Protamine sulfate reverses unfractionated heparin by forming an inactive complex with heparin, neutralizing its anticoagulant effect (1 mg protamine per 100 units UFH given in the past 2-3 hours). For LMWH, protamine provides only partial reversal (approximately 60% of anti-Xa activity) because it cannot neutralize the anti-Xa component effectively. Vitamin K (phytonadione) reverses warfarin by providing the substrate for hepatic synthesis of vitamin K-dependent clotting factors (II, VII, IX, X). Oral vitamin K takes 24-48 hours for effect; IV vitamin K works in 6-8 hours. For immediate warfarin reversal, 4-factor prothrombin complex concentrate (4F-PCC, Kcentra) provides factors II, VII, IX, and X directly, correcting INR within 15-30 minutes. Idarucizumab (Praxbind) is a monoclonal antibody fragment that specifically binds and neutralizes dabigatran within minutes. Andexanet alfa (Andexxa) is a recombinant modified Factor Xa decoy protein that binds and sequesters Factor Xa inhibitors (rivaroxaban, apixaban), reversing their anticoagulant effect. Heparin-induced thrombocytopenia (HIT) is an immune-mediated prothrombotic disorder caused by IgG antibodies against the heparin-platelet factor 4 (PF4) complex. These antibodies activate platelets, causing simultaneous thrombocytopenia and paradoxical thrombosis (venous and arterial). HIT requires immediate heparin cessation and initiation of a non-heparin anticoagulant (argatroban, bivalirudin, or fondaparinux)."
    },
    riskFactors: [
      "Major bleeding risk factors: advanced age (greater than 75), renal impairment, hepatic disease, thrombocytopenia",
      "Concurrent antiplatelet therapy (aspirin, clopidogrel) increases bleeding risk with anticoagulants",
      "History of GI bleeding or peptic ulcer disease",
      "Uncontrolled hypertension",
      "Recent surgery or invasive procedure",
      "Fall risk: major concern in anticoagulated elderly patients",
      "Drug interactions increasing bleeding risk: NSAIDs, SSRIs, herbal supplements (ginkgo, garlic, ginger)",
      "HIT risk factors: UFH greater than LMWH, surgical patients greater than medical, female sex, longer heparin duration",
      "Alcohol use (impairs hepatic clotting factor synthesis and platelet function)"
    ],
    diagnostics: [
      "INR: supratherapeutic values indicate warfarin-related bleeding risk (INR greater than 4 = high risk)",
      "aPTT: supratherapeutic values indicate UFH-related bleeding risk",
      "CBC with platelet count: identify thrombocytopenia, assess for HIT, monitor blood loss",
      "HIT diagnosis: 4T score (Thrombocytopenia, Timing, Thrombosis, other causes), then PF4/heparin ELISA antibody, then serotonin release assay (SRA, gold standard)",
      "Fibrinogen level: low levels impair hemostasis",
      "Type and screen/crossmatch: prepare for transfusion in major bleeding",
      "Stool guaiac/fecal occult blood test: detect GI bleeding",
      "CT head without contrast: for suspected intracranial hemorrhage in anticoagulated patients",
      "Hemoglobin/hematocrit trending: serial monitoring for ongoing blood loss"
    ],
    management: [
      "UFH reversal: protamine sulfate 1 mg per 100 units UFH (max 50 mg); give slowly IV over 10 minutes (anaphylaxis risk)",
      "LMWH reversal: protamine provides 60% reversal; 1 mg per 1 mg enoxaparin if given within 8 hours",
      "Warfarin reversal (non-emergent): hold warfarin, oral vitamin K 1-2.5 mg for INR 4.5-10 without bleeding",
      "Warfarin reversal (major bleeding): IV vitamin K 10 mg + 4-factor PCC (Kcentra) for immediate INR correction",
      "Dabigatran reversal: idarucizumab (Praxbind) 5 g IV (two 2.5 g vials); reversal within minutes",
      "Xa inhibitor reversal (rivaroxaban, apixaban): andexanet alfa (Andexxa) IV bolus then infusion; if unavailable, 4F-PCC",
      "HIT management: immediately discontinue ALL heparin (including flushes, coated catheters); start non-heparin anticoagulant",
      "Non-heparin anticoagulants for HIT: argatroban (hepatic clearance, used in renal impairment), bivalirudin (renal clearance)",
      "Transfusion support for major bleeding: pRBCs, FFP, platelets, cryoprecipitate as indicated",
      "Do NOT give platelets in HIT — this fuels the thrombotic process"
    ],
    nursingActions: [
      "Assess all anticoagulated patients for bleeding every shift: skin (bruising, petechiae), mucous membranes, stool, urine",
      "Monitor vital signs for hemodynamic instability indicating occult bleeding: tachycardia, hypotension, orthostatic changes",
      "Implement bleeding precautions: soft toothbrush, electric razor, avoid IM injections, hold pressure 5+ minutes after venipuncture",
      "Apply pressure to arterial puncture sites for minimum 15-20 minutes",
      "Monitor neurological status in anticoagulated patients: headache, altered mental status may indicate intracranial hemorrhage",
      "Know location of reversal agents: protamine, vitamin K, idarucizumab, andexanet alfa",
      "Administer protamine slowly IV (over 10 minutes): rapid infusion causes hypotension, bradycardia, anaphylaxis",
      "Protamine allergy risk: patients with fish allergy, prior protamine exposure, or prior vasectomy (NPH insulin contains protamine)",
      "For HIT: immediately discontinue ALL heparin sources including line flushes, heparin-coated catheters, and LMWH",
      "Monitor platelet count recovery after heparin cessation in HIT (should begin rising within 1-3 days)",
      "Teach patients on anticoagulants: wear medical alert identification, avoid contact sports, report any unusual bleeding"
    ],
    assessmentFindings: [
      "Minor bleeding: easy bruising, petechiae, gum bleeding, epistaxis, prolonged bleeding from minor cuts",
      "Major bleeding: hematemesis, melena/hematochezia, gross hematuria, large hematomas, hemoptysis",
      "Life-threatening bleeding: intracranial hemorrhage (headache, altered LOC, focal neurological deficits), retroperitoneal hemorrhage (back/flank pain, hypotension)",
      "HIT findings: platelet count drop greater than 50% from baseline (typically day 5-14), paradoxical thrombosis (DVT, PE, stroke, limb ischemia), skin necrosis at heparin injection sites",
      "Hemodynamic instability: tachycardia, hypotension, narrowed pulse pressure, cool/clammy skin",
      "Occult bleeding indicators: unexplained drop in hemoglobin/hematocrit, positive fecal occult blood"
    ],
    signs: {
      left: [
        "Reversal agents and targets:",
        "Protamine → UFH (complete), LMWH (partial)",
        "Vitamin K → warfarin (slow, 6-24 hours)",
        "4-factor PCC → warfarin (immediate)",
        "Idarucizumab → dabigatran (immediate)",
        "Andexanet alfa → rivaroxaban, apixaban",
        "Aminocaproic acid → fibrinolysis"
      ],
      right: [
        "HIT key features:",
        "Platelet drop >50% from baseline",
        "Onset: days 5-14 of heparin therapy",
        "Paradoxical THROMBOSIS (not bleeding)",
        "Stop ALL heparin immediately",
        "DO NOT transfuse platelets",
        "Start non-heparin anticoagulant"
      ]
    },
    medications: [
      { name: "Protamine Sulfate", type: "Heparin Reversal Agent", action: "Binds heparin to form inactive complex, neutralizing anticoagulant effect", sideEffects: "Hypotension, bradycardia, anaphylaxis, pulmonary hypertension", contra: "Fish allergy (relative)", pearl: "1 mg reverses 100 units UFH. Max single dose 50 mg. Give slowly IV over 10 minutes. Higher risk of anaphylaxis in patients with fish allergy, prior protamine exposure, or NPH insulin use (contains protamine). Only 60% effective against LMWH." },
      { name: "Vitamin K (Phytonadione)", type: "Warfarin Reversal Agent", action: "Provides vitamin K substrate for hepatic synthesis of clotting factors II, VII, IX, X", sideEffects: "Anaphylaxis with IV administration (rare but serious), pain at injection site", contra: "None in emergent warfarin reversal", pearl: "Oral is preferred for non-emergent reversal (1-2.5 mg). IV vitamin K works in 6-8 hours. Too much vitamin K causes warfarin resistance for days. Always given WITH 4F-PCC in major bleeding for sustained reversal. Never give IM (hematoma risk in anticoagulated patients)." },
      { name: "4-Factor PCC (Kcentra)", type: "Coagulation Factor Concentrate", action: "Provides factors II, VII, IX, X to immediately restore coagulation capacity", sideEffects: "Thromboembolic events, DIC", contra: "Known DIC, HIT", pearl: "Corrects INR within 15-30 minutes. Dose based on INR and body weight. Given WITH vitamin K for sustained effect (PCC factors will be consumed without vitamin K). Preferred over FFP: faster, smaller volume, no ABO matching needed." },
      { name: "Idarucizumab (Praxbind)", type: "Dabigatran-Specific Reversal Agent", action: "Humanized monoclonal antibody fragment that binds dabigatran with 350x greater affinity than thrombin", sideEffects: "Headache, hypokalemia, delirium, constipation", contra: "None (life-saving indication)", pearl: "5 g IV (two 2.5 g vials given as consecutive infusions). Full reversal within minutes. Specific to dabigatran ONLY — does not reverse Xa inhibitors. Can be re-dosed if needed. No prothrombotic rebound effect." },
      { name: "Andexanet Alfa (Andexxa)", type: "Factor Xa Inhibitor Reversal Agent", action: "Recombinant modified Factor Xa decoy that binds and sequesters Xa inhibitors (rivaroxaban, apixaban)", sideEffects: "Infusion reactions, thromboembolic events (18%), cardiac arrest", contra: "None absolute in life-threatening bleeding", pearl: "IV bolus followed by 2-hour infusion. Dose depends on specific Xa inhibitor and timing of last dose. Very expensive ($25,000-50,000 per dose). If unavailable, 4F-PCC can be used off-label. Monitor for rebound anticoagulation after infusion ends." },
      { name: "Argatroban", type: "Direct Thrombin Inhibitor (non-heparin)", action: "Directly and reversibly inhibits thrombin; used as alternative anticoagulant in HIT", sideEffects: "Bleeding, hypotension, fever, dyspnea", contra: "Active major bleeding", pearl: "Preferred in HIT with renal impairment (hepatic metabolism). Monitored by aPTT. Artificially elevates INR — must use special conversion when transitioning to warfarin. Half-life 39-51 minutes (allows rapid titration)." }
    ],
    pearls: [
      "Protamine reverses UFH completely but LMWH only partially (60%) — know this for exams",
      "Vitamin K oral is preferred for non-emergent warfarin reversal; IV vitamin K has anaphylaxis risk",
      "4F-PCC (Kcentra) corrects INR within minutes — always give WITH vitamin K for sustained effect",
      "Idarucizumab (Praxbind) is specific to dabigatran only; andexanet alfa reverses Xa inhibitors (rivaroxaban, apixaban)",
      "HIT is a prothrombotic disorder — platelets drop but the patient CLOTS, not bleeds",
      "NEVER give platelets in HIT — it adds fuel to the thrombotic fire",
      "4T score (Thrombocytopenia, Timing, Thrombosis, oTher causes) is the initial HIT assessment tool",
      "In HIT, stop ALL heparin: IV, SQ, line flushes, heparin-coated catheters, LMWH",
      "Protamine allergy risks: fish allergy, prior vasectomy (protamine in semen), NPH insulin use (contains protamine)",
      "When in doubt about which reversal agent to use, consult pharmacy and hematology immediately"
    ],
    quiz: [
      { question: "A patient on warfarin presents with INR of 9.2 and hematemesis. The nurse anticipates administering:", options: ["Protamine sulfate and FFP", "IV vitamin K and 4-factor PCC", "Idarucizumab", "Oral vitamin K only"], correct: 1, rationale: "Major bleeding with supratherapeutic INR requires BOTH IV vitamin K (for sustained reversal) and 4-factor PCC (for immediate factor replacement). Protamine reverses heparin, not warfarin. Idarucizumab reverses dabigatran only." },
      { question: "A patient on dabigatran requires emergency surgery. The specific reversal agent is:", options: ["Protamine sulfate", "Vitamin K", "Idarucizumab (Praxbind)", "Andexanet alfa"], correct: 2, rationale: "Idarucizumab (Praxbind) is the specific reversal agent for dabigatran. It binds dabigatran with 350x greater affinity than thrombin, providing complete reversal within minutes. 5 g IV dose." },
      { question: "A nurse is monitoring a patient on heparin who develops HIT. Which action is contraindicated?", options: ["Stopping all heparin products", "Starting argatroban", "Transfusing platelets", "Monitoring for thrombosis"], correct: 2, rationale: "Platelet transfusion is CONTRAINDICATED in HIT because it provides additional substrate for the prothrombotic process. HIT causes thrombosis, not bleeding, so adding platelets worsens clot formation." },
      { question: "Protamine sulfate should be administered with caution in patients with:", options: ["Penicillin allergy", "Fish allergy", "Latex allergy", "Sulfa allergy"], correct: 1, rationale: "Protamine is derived from salmon sperm. Patients with fish allergies have an increased risk of anaphylaxis. Other risk groups include patients with prior protamine exposure, prior vasectomy, and NPH insulin use." },
      { question: "Which reversal agent corrects warfarin's INR within minutes?", options: ["Oral vitamin K", "IV vitamin K", "4-factor PCC (Kcentra)", "Fresh frozen plasma"], correct: 2, rationale: "4-factor PCC (Kcentra) provides clotting factors II, VII, IX, and X directly, correcting INR within 15-30 minutes. IV vitamin K takes 6-8 hours. Oral vitamin K takes 24-48 hours. FFP takes longer and requires larger volumes." },
      { question: "A patient with HIT has renal impairment. Which non-heparin anticoagulant is preferred?", options: ["Fondaparinux", "Bivalirudin", "Argatroban", "Enoxaparin"], correct: 2, rationale: "Argatroban is hepatically metabolized and is preferred in HIT patients with renal impairment. Bivalirudin is renally cleared. Enoxaparin is an LMWH and is contraindicated in HIT (cross-reactivity risk). Fondaparinux has low HIT cross-reactivity but is renally cleared." }
    ]
  },

  "dic-expanded-rn": {
    title: "Disseminated Intravascular Coagulation (DIC)",
    cellular: {
      title: "Consumptive Coagulopathy Pathophysiology",
      content: "Disseminated intravascular coagulation (DIC) is a life-threatening acquired coagulopathy characterized by simultaneous, widespread activation of coagulation and fibrinolysis. DIC is always secondary to an underlying condition — it is never a primary disease. The pathophysiology begins with massive release of tissue factor (TF) or other procoagulant substances into the bloodstream from damaged tissues, endotoxins, or inflammatory mediators. This triggers widespread thrombin generation, leading to diffuse microvascular fibrin deposition (microthrombi) throughout the vasculature. These microthrombi cause ischemic organ damage (kidneys, lungs, brain, liver, skin). Simultaneously, the massive consumption of clotting factors (I, II, V, VIII, XIII) and platelets depletes hemostatic reserves, causing a consumptive coagulopathy. The body activates the fibrinolytic system (plasmin) to break down the fibrin clots, generating fibrin degradation products (FDPs) and D-dimers. FDPs themselves are anticoagulant, further impairing hemostasis. The result is the paradox of DIC: simultaneous thrombosis (organ ischemia from microthrombi) and hemorrhage (from factor and platelet consumption). The balance between thrombosis and hemorrhage determines clinical presentation: acute DIC presents predominantly with bleeding, while chronic (compensated) DIC may present with thrombotic manifestations. The pathologic sequence is: trigger → tissue factor release → widespread thrombin generation → microvascular fibrin deposition → consumption of factors and platelets → secondary fibrinolysis → FDP generation → hemorrhage and organ damage."
    },
    riskFactors: [
      "Sepsis and severe infection (most common cause in adults, especially gram-negative septicemia)",
      "Obstetric complications: placental abruption, amniotic fluid embolism, HELLP syndrome, eclampsia, retained dead fetus",
      "Malignancy: acute promyelocytic leukemia (APL/M3), mucin-secreting adenocarcinomas, advanced solid tumors",
      "Massive trauma, burns, crush injuries (tissue factor release from extensive tissue damage)",
      "Transfusion reactions: acute hemolytic transfusion reaction (ABO incompatibility)",
      "Severe liver disease (impaired synthesis of clotting factors and anticoagulants)",
      "Snake envenomation (venom activates coagulation)",
      "Heat stroke",
      "Organ transplant rejection",
      "Vascular malformations (Kasabach-Merritt syndrome)"
    ],
    diagnostics: [
      "Platelet count: decreased (consumption); often less than 100,000/mcL, may be severely depleted",
      "PT/INR: prolonged (consumption of factors in extrinsic/common pathway)",
      "aPTT: prolonged (consumption of factors in intrinsic/common pathway)",
      "Fibrinogen level: decreased (consumed in clot formation); less than 100 mg/dL indicates severe depletion",
      "D-dimer: elevated (fibrin degradation products from secondary fibrinolysis); highly sensitive but nonspecific",
      "FDP (fibrin degradation products): elevated; FDPs are anticoagulant and interfere with normal hemostasis",
      "Peripheral blood smear: schistocytes (fragmented RBCs from shearing through fibrin strands in microvasculature)",
      "Thrombin time: prolonged",
      "Antithrombin III level: decreased (consumed)",
      "ISTH DIC score: uses platelet count, D-dimer/FDP, fibrinogen, and PT to calculate probability (score ≥5 = overt DIC)"
    ],
    management: [
      "TREAT THE UNDERLYING CAUSE — this is the single most important intervention (antibiotics for sepsis, delivery for obstetric causes, chemotherapy for malignancy)",
      "Supportive blood product replacement guided by clinical bleeding (not lab values alone):",
      "Platelets: transfuse if less than 10,000/mcL (non-bleeding) or less than 50,000/mcL (active bleeding or pre-procedure)",
      "Fresh frozen plasma (FFP): replaces all clotting factors; for active bleeding with prolonged PT/aPTT",
      "Cryoprecipitate: concentrated fibrinogen, factor VIII, vWF; for fibrinogen less than 100 mg/dL",
      "Packed RBCs: for significant blood loss and hemodynamic instability",
      "Heparin therapy: controversial; may be considered in chronic DIC with predominant thrombotic manifestations (e.g., purpura fulminans, venous thromboembolism)",
      "Antithrombin III concentrate: may be considered if AT-III levels are severely depleted",
      "Avoid: IM injections, unnecessary venipunctures, aspirin/NSAIDs, rectal temperatures",
      "ICU monitoring: continuous hemodynamic monitoring, serial labs every 4-6 hours"
    ],
    nursingActions: [
      "Recognize DIC early: unexplained bleeding from multiple sites (IV sites, wounds, mucous membranes) + oozing + organ dysfunction",
      "Assess for bleeding comprehensively: all body orifices, IV sites, surgical sites, skin (petechiae, purpura, ecchymoses)",
      "Assess for thrombotic complications: altered mental status, oliguria, digital ischemia, skin mottling, acral cyanosis",
      "Monitor vital signs frequently for hemodynamic instability: tachycardia, hypotension indicate active blood loss",
      "Implement strict bleeding precautions: soft toothbrush, electric razor, no IM injections, gentle oral care",
      "Apply pressure to all venipuncture and IV sites for minimum 5-10 minutes",
      "Avoid rectal thermometers, rectal medications, and invasive procedures unless absolutely necessary",
      "Monitor and trend serial labs every 4-6 hours: platelets, PT/INR, aPTT, fibrinogen, D-dimer",
      "Administer blood products as ordered: verify products, use blood tubing, monitor for transfusion reactions",
      "Monitor urine output hourly (indicator of renal perfusion and organ function)",
      "Maintain large-bore IV access (two sites minimum) for volume resuscitation and blood products",
      "Provide emotional support to patient and family — DIC is frightening and often occurs in critically ill patients"
    ],
    assessmentFindings: [
      "Bleeding from multiple unrelated sites simultaneously (hallmark of DIC)",
      "Oozing from IV sites, venipuncture sites, surgical wounds, around catheters",
      "Petechiae, purpura, ecchymoses (widespread, not localized)",
      "Mucosal bleeding: epistaxis, gingival bleeding, hemoptysis, hematuria",
      "GI bleeding: hematemesis, melena, hematochezia",
      "Wound dehiscence with persistent oozing",
      "Thrombotic manifestations: acral cyanosis (fingers, toes, ears), digital gangrene, skin necrosis",
      "Organ dysfunction: altered mental status (brain), oliguria/renal failure (kidneys), hypoxemia/ARDS (lungs), jaundice (liver)",
      "Hemodynamic instability: tachycardia, hypotension, narrowed pulse pressure"
    ],
    signs: {
      left: [
        "Hemorrhagic manifestations:",
        "Bleeding from multiple sites simultaneously",
        "Oozing from IV sites and wounds",
        "Petechiae, purpura, ecchymoses",
        "Hematuria, hemoptysis, GI bleeding",
        "Prolonged PT, aPTT",
        "Decreased platelets and fibrinogen"
      ],
      right: [
        "Thrombotic manifestations:",
        "Acral cyanosis (fingers, toes, ears)",
        "Digital gangrene, skin necrosis",
        "Altered mental status (brain ischemia)",
        "Oliguria/renal failure",
        "ARDS (pulmonary microthrombi)",
        "Elevated D-dimer and FDPs"
      ]
    },
    medications: [
      { name: "Fresh Frozen Plasma (FFP)", type: "Blood Product", action: "Replaces all coagulation factors (I through XIII) and natural anticoagulants (protein C, S, AT-III)", sideEffects: "Transfusion reactions, volume overload (TACO), TRALI, citrate toxicity", contra: "Volume overload without active bleeding; DIC with predominant thrombosis", pearl: "ABO-compatible required. Each unit raises fibrinogen by approximately 5-10 mg/dL. Used when PT/aPTT is prolonged with active bleeding. Does not require crossmatch but needs ABO compatibility." },
      { name: "Cryoprecipitate", type: "Blood Product", action: "Concentrated source of fibrinogen (150-250 mg/unit), factor VIII, von Willebrand factor, and factor XIII", sideEffects: "Transfusion reactions, volume overload", contra: "None in active DIC with low fibrinogen", pearl: "First-line for fibrinogen less than 100 mg/dL. Each unit raises fibrinogen approximately 50 mg/dL in average adult (10-unit pool). Smaller volume than FFP — preferred when fibrinogen is the primary deficit. Does not require ABO matching but ABO-compatible preferred." },
      { name: "Platelet Transfusion", type: "Blood Product", action: "Provides functional platelets for primary hemostasis", sideEffects: "Transfusion reactions, alloimmunization, febrile non-hemolytic reaction, bacterial contamination", contra: "HIT (heparin-induced thrombocytopenia) — NOT DIC", pearl: "Transfuse if platelets less than 10,000 (non-bleeding) or less than 50,000 (active bleeding/procedure). Each unit raises platelet count approximately 30,000-50,000/mcL. Platelets are consumed rapidly in DIC — may need repeated transfusions." },
      { name: "Packed Red Blood Cells (pRBCs)", type: "Blood Product", action: "Provides oxygen-carrying capacity; replaces lost erythrocytes", sideEffects: "Transfusion reactions, hyperkalemia, hypothermia with massive transfusion, iron overload", contra: "No absolute contraindication in hemorrhagic DIC", pearl: "Transfuse for hemoglobin less than 7 g/dL or hemodynamic instability. In massive transfusion (greater than 10 units/24 hrs), follow massive transfusion protocol with FFP and platelets in fixed ratios. Use blood warmer for rapid infusion." },
      { name: "Heparin (low-dose)", type: "Anticoagulant", action: "Inhibits ongoing thrombin generation; theoretically stops the DIC cycle at the thrombotic phase", sideEffects: "Worsening hemorrhage, HIT", contra: "Actively hemorrhaging DIC patients (most cases); CNS bleeding; liver failure", pearl: "CONTROVERSIAL in DIC. May be considered in CHRONIC DIC with predominant thrombosis (purpura fulminans, Trousseau syndrome). NOT used in acute hemorrhagic DIC. Provider decision based on clinical picture. Must monitor closely." },
      { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Inhibits plasminogen activation, reducing fibrinolysis", sideEffects: "Thromboembolic events, seizures, GI upset", contra: "Predominantly thrombotic DIC, active intravascular clotting", pearl: "May be used cautiously in DIC with severe hyperfibrinolysis-predominant bleeding (rare). Generally avoided because inhibiting fibrinolysis may worsen microvascular thrombosis. Used more commonly in trauma-associated hemorrhage per CRASH-2 protocol." }
    ],
    pearls: [
      "DIC is ALWAYS secondary — treat the underlying cause first (sepsis = antibiotics, obstetric = delivery, APL = chemotherapy)",
      "The DIC paradox: simultaneous thrombosis AND hemorrhage — the patient is clotting AND bleeding at the same time",
      "Classic lab triad of DIC: decreased platelets + prolonged PT/aPTT + decreased fibrinogen + elevated D-dimer/FDPs",
      "Schistocytes on peripheral smear = microangiopathic hemolytic anemia from fibrin strands shearing RBCs",
      "Cryoprecipitate is the best source of concentrated fibrinogen (first choice when fibrinogen is less than 100 mg/dL)",
      "FFP replaces ALL clotting factors but requires ABO compatibility and larger volumes",
      "Blood product replacement is SUPPORTIVE — it does not fix DIC; only treating the cause fixes DIC",
      "Monitor labs every 4-6 hours in acute DIC to trend response to treatment",
      "Sepsis is the #1 cause of DIC in adults; placental abruption is the #1 obstetric cause",
      "Acute promyelocytic leukemia (APL/M3 AML) is the malignancy most strongly associated with DIC",
      "Nursing priority: protect the patient from bleeding — minimize invasive procedures, apply pressure, implement bleeding precautions"
    ],
    quiz: [
      { question: "Which lab finding is most indicative of DIC?", options: ["Elevated platelet count", "Decreased D-dimer", "Decreased fibrinogen with elevated D-dimer and prolonged PT/aPTT", "Normal PT with elevated fibrinogen"], correct: 2, rationale: "The classic DIC lab profile shows decreased platelets, decreased fibrinogen (consumed), elevated D-dimer (from fibrinolysis), and prolonged PT/aPTT (factor consumption). This combination reflects simultaneous clotting and bleeding." },
      { question: "The MOST important intervention in DIC management is:", options: ["Administering heparin", "Treating the underlying cause", "Transfusing platelets", "Administering vitamin K"], correct: 1, rationale: "DIC is ALWAYS secondary to an underlying condition. Blood product support is temporary — DIC will not resolve until the trigger is treated (antibiotics for sepsis, delivery for obstetric complications, chemotherapy for malignancy)." },
      { question: "A patient with DIC has a fibrinogen level of 65 mg/dL. The nurse anticipates an order for:", options: ["Fresh frozen plasma", "Cryoprecipitate", "Vitamin K", "Protamine sulfate"], correct: 1, rationale: "Cryoprecipitate is the concentrated source of fibrinogen and is first-line when fibrinogen is less than 100 mg/dL. Each unit raises fibrinogen approximately 50 mg/dL. FFP also contains fibrinogen but in lower concentration with larger volume." },
      { question: "Schistocytes on a peripheral blood smear in DIC indicate:", options: ["Iron deficiency anemia", "Mechanical destruction of RBCs by fibrin strands in the microvasculature", "Vitamin B12 deficiency", "Normal red blood cell morphology"], correct: 1, rationale: "Schistocytes (fragmented RBCs) result from red blood cells being sheared as they pass through fibrin strands deposited in the microvasculature. This is microangiopathic hemolytic anemia, characteristic of DIC." },
      { question: "Which patient is at highest risk for developing DIC?", options: ["A patient with well-controlled type 2 diabetes", "A patient with gram-negative septic shock", "A patient recovering from a tonsillectomy", "A patient with mild seasonal allergies"], correct: 1, rationale: "Sepsis, especially gram-negative septicemia, is the most common cause of DIC in adults. Endotoxin from gram-negative bacteria triggers massive tissue factor release and systemic coagulation activation." },
      { question: "A nurse caring for a patient with acute DIC should:", options: ["Administer IM injections for faster medication absorption", "Use a rectal thermometer for accurate temperature readings", "Apply firm pressure to all venipuncture sites for at least 5 minutes", "Encourage vigorous oral care with a firm-bristled toothbrush"], correct: 2, rationale: "Bleeding precautions are essential in DIC. Apply pressure to all puncture sites for a minimum of 5-10 minutes. Avoid IM injections, rectal temperatures, and firm toothbrushes — all increase bleeding risk." },
      { question: "In DIC, why does the patient experience both clotting and bleeding simultaneously?", options: ["Medications cause opposing effects", "Widespread microthrombi consume clotting factors and platelets, depleting hemostatic reserves while secondary fibrinolysis generates anticoagulant FDPs", "The liver produces too many clotting factors", "Platelet production increases dramatically"], correct: 1, rationale: "DIC involves massive thrombin generation causing diffuse microthrombi (thrombosis) while simultaneously consuming clotting factors and platelets (causing bleeding). Fibrinolysis generates FDPs that are themselves anticoagulant, further impairing hemostasis." }
    ]
  }
};
