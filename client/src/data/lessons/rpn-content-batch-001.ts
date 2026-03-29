import type { LessonContent } from "./types";

export const rpnContentBatch001Lessons: Record<string, LessonContent> = {
  "heart-sounds-2-rpn": {
    "title": "Heart Sounds",
    "cellular": {
      "title": "Cardiac Valve Mechanics and Hemodynamics",
      "content": "Heart sounds are produced by the closure of cardiac valves during the cardiac cycle. S1 (lub) occurs when the mitral and tricuspid valves close at the beginning of systole, and S2 (dub) occurs when the aortic and pulmonic valves close at the beginning of diastole. S3 may indicate heart failure in adults due to rapid ventricular filling against a non-compliant ventricle. S4 represents atrial contraction against a stiff ventricle, often associated with ventricular hypertrophy. Murmurs result from turbulent blood flow across abnormal valves, septal defects, or increased flow states. Auscultation requires systematic listening at all valve areas using both the bell (low-pitched sounds) and diaphragm (high-pitched sounds)."
    },
    "riskFactors": [
      "Valvular heart disease (stenosis or regurgitation)",
      "History of rheumatic fever causing valve damage",
      "Congenital heart defects affecting valve structure",
      "Infective endocarditis damaging valve leaflets",
      "Hypertrophic cardiomyopathy creating outflow obstruction"
    ],
    "diagnostics": [
      "Auscultation with bell and diaphragm of stethoscope",
      "Echocardiography for valve structure and function assessment",
      "12-lead ECG for rhythm correlation",
      "Chest X-ray for cardiac silhouette evaluation"
    ],
    "management": [
      "Position patient in left lateral decubitus for mitral sounds",
      "Use bell for low-pitched sounds (S3, S4, mitral stenosis)",
      "Use diaphragm for high-pitched sounds (S1, S2, aortic regurgitation)",
      "Report new murmurs or gallop rhythms to the provider immediately"
    ],
    "nursingActions": [
      "Auscultate in a quiet environment with patient positioned appropriately",
      "Document location, timing, pitch, and quality of all sounds heard",
      "Compare findings to baseline assessments and note changes immediately",
      "Correlate heart sounds with vital signs and symptoms",
      "Report new S3 gallop, murmurs, or pericardial friction rub immediately"
    ],
    "signs": {
      "left": [
        "Normal S1 and S2 heart sounds",
        "Split S2 during inspiration",
        "Systolic ejection click",
        "Physiological S3 in children and young adults"
      ],
      "right": [
        "New onset murmur not previously documented",
        "S3 gallop in adults indicating heart failure",
        "S4 gallop associated with hypertension",
        "Pericardial friction rub suggesting pericarditis"
      ]
    },
    "medications": [
      {
        "name": "Digoxin",
        "type": "Cardiac glycoside",
        "action": "Slows heart rate and increases contractility through sodium-potassium ATPase inhibition",
        "sideEffects": "Bradycardia, nausea, visual disturbances (yellow-green halos)",
        "contra": "Hypokalemia, second or third-degree AV block",
        "pearl": "Check apical pulse for 60 seconds before administration; hold if HR < 60 bpm."
      }
    ],
    "pearls": [
      "Always auscultate with patient sitting, leaning forward, and in left lateral decubitus",
      "S3 is best heard at the apex with the bell of the stethoscope",
      "A new murmur in a febrile patient should raise suspicion for endocarditis"
    ],
    "quiz": [
      {
        "question": "Which heart sound is best heard using the bell of the stethoscope at the apex?",
        "options": [
          "S1",
          "S2",
          "S3",
          "Aortic ejection click"
        ],
        "correct": 2,
        "rationale": "S3 is a low-pitched sound best heard at the apex using the bell."
      },
      {
        "question": "An S3 heart sound in an adult most commonly indicates:",
        "options": [
          "Normal physiological finding",
          "Heart failure with volume overload",
          "Aortic stenosis",
          "Mitral valve prolapse"
        ],
        "correct": 1,
        "rationale": "S3 in adults is associated with volume overload and heart failure."
      },
      {
        "question": "Which patient position enhances auscultation of mitral valve sounds?",
        "options": [
          "Supine flat",
          "Right lateral",
          "Left lateral decubitus",
          "Trendelenburg"
        ],
        "correct": 2,
        "rationale": "Left lateral decubitus brings the heart closer to the chest wall."
      },
      {
        "question": "Before administering digoxin, the practical nurse should:",
        "options": [
          "Check blood pressure in both arms",
          "Count apical pulse for one full minute",
          "Assess respiratory rate and depth",
          "Check oral temperature"
        ],
        "correct": 1,
        "rationale": "Apical pulse must be counted for 60 seconds; hold if HR < 60 bpm."
      },
      {
        "question": "A pericardial friction rub is characterized by:",
        "options": [
          "A low rumbling sound",
          "High-pitched scratchy or grating quality",
          "Musical and soft quality",
          "A brief clicking sound"
        ],
        "correct": 1,
        "rationale": "Pericardial friction rubs have a scratchy, grating quality heard best with the diaphragm."
      }
    ]
  },
  "hyperkalemia-vs-hypokalemia-ecg-changes-and-rpn": {
    "title": "Hyperkalemia vs Hypokalemia - ECG Changes & Cellular Physiology",
    "cellular": {
      "title": "Potassium Balance and Cardiac Conduction",
      "content": "Potassium is the primary intracellular cation essential for maintaining resting membrane potential in cardiac and skeletal muscle cells. Normal serum potassium is 3.5-5.0 mEq/L. Hyperkalemia (>5.0 mEq/L) decreases the resting membrane potential, making cells more excitable initially but eventually leading to depolarization block. ECG changes in hyperkalemia progress predictably: peaked T waves, flattened P waves, widened QRS complex, sine wave pattern, and ultimately cardiac arrest. Hypokalemia (<3.5 mEq/L) hyperpolarizes cells, causing flattened T waves, prominent U waves, ST depression, and dangerous tachyarrhythmias including torsades de pointes."
    },
    "riskFactors": [
      "Renal failure or decreased urine output impairing potassium excretion",
      "ACE inhibitors, ARBs, or potassium-sparing diuretics causing hyperkalemia",
      "Loop or thiazide diuretics causing potassium wasting",
      "Prolonged vomiting, diarrhea, or nasogastric suctioning",
      "Crush injuries or massive tissue destruction releasing intracellular potassium"
    ],
    "diagnostics": [
      "Serum potassium level with critical values flagged (<2.5 or >6.5 mEq/L)",
      "12-lead ECG for rhythm and waveform morphology changes",
      "Basic metabolic panel including magnesium level",
      "Arterial blood gas for acid-base status assessment"
    ],
    "management": [
      "Continuous cardiac monitoring during all potassium correction therapies",
      "IV calcium gluconate for cardiac membrane stabilization in severe hyperkalemia",
      "Insulin with dextrose to shift potassium intracellularly as emergency treatment",
      "Oral or IV potassium replacement for hypokalemia (never IV push)"
    ],
    "nursingActions": [
      "Place patient on continuous cardiac telemetry monitoring during correction",
      "Monitor ECG for peaked T waves (hyperkalemia) or flattened T waves (hypokalemia)",
      "Verify potassium level before and after any replacement therapy",
      "Assess for muscle weakness, cramping, paresthesias, and deep tendon reflexes",
      "Never administer IV potassium faster than 10 mEq/hour via peripheral line"
    ],
    "signs": {
      "left": [
        "Serum K+ 3.5-5.0 mEq/L (normal range)",
        "Normal T wave morphology on ECG",
        "Normal muscle strength and reflexes",
        "Regular cardiac rhythm"
      ],
      "right": [
        "Peaked T waves (hyperkalemia) or flattened T waves (hypokalemia)",
        "Widened QRS complex in severe hyperkalemia",
        "Muscle weakness progressing to flaccid paralysis",
        "Cardiac arrhythmias including bradycardia or torsades de pointes"
      ]
    },
    "medications": [
      {
        "name": "Calcium Gluconate",
        "type": "Cardiac membrane stabilizer",
        "action": "Raises the threshold potential to protect the heart from hyperkalemic cardiac arrest",
        "sideEffects": "Bradycardia and hypotension with rapid IV infusion",
        "contra": "Digoxin toxicity (use extreme caution - may precipitate fatal arrhythmias)",
        "pearl": "Does NOT lower serum potassium - it only protects the heart while other treatments work to shift or eliminate K+."
      }
    ],
    "pearls": [
      "Never give IV potassium by push - always dilute and infuse slowly on a pump",
      "Peaked T waves on ECG = think hyperkalemia first",
      "Correct magnesium before attempting to correct refractory hypokalemia"
    ],
    "quiz": [
      {
        "question": "The earliest ECG change in hyperkalemia is:",
        "options": [
          "Widened QRS complex",
          "Peaked T waves",
          "Absent P waves",
          "ST elevation"
        ],
        "correct": 1,
        "rationale": "Peaked, tall T waves are the earliest ECG finding in hyperkalemia."
      },
      {
        "question": "A patient on furosemide has potassium of 3.0 mEq/L. The expected finding is:",
        "options": [
          "Peaked T waves on ECG",
          "Hypertension",
          "Muscle weakness and cramping",
          "Facial flushing"
        ],
        "correct": 2,
        "rationale": "Hypokalemia causes skeletal muscle weakness, cramping, and fatigue."
      },
      {
        "question": "IV potassium chloride via peripheral line should not exceed:",
        "options": [
          "5 mEq/hour",
          "10 mEq/hour",
          "20 mEq bolus",
          "40 mEq/hour"
        ],
        "correct": 1,
        "rationale": "Maximum peripheral IV rate is 10 mEq/hour to prevent cardiac arrest."
      },
      {
        "question": "Which medication is given first in severe hyperkalemia to protect the heart?",
        "options": [
          "Kayexalate",
          "Insulin with dextrose",
          "Calcium gluconate",
          "Sodium bicarbonate"
        ],
        "correct": 2,
        "rationale": "Calcium gluconate stabilizes the cardiac membrane immediately while other treatments lower K+."
      },
      {
        "question": "Which electrolyte must be corrected before hypokalemia will respond to treatment?",
        "options": [
          "Sodium",
          "Calcium",
          "Magnesium",
          "Phosphorus"
        ],
        "correct": 2,
        "rationale": "Magnesium deficiency prevents renal potassium retention, making hypokalemia refractory."
      }
    ]
  },
  "cardiovascular-system-basics-rpn-rpn": {
    "title": "Cardiovascular System Basics (RPN)",
    "cellular": {
      "title": "Hemodynamic Principles and Cardiac Function",
      "content": "Cardiovascular System Basics requires thorough understanding of the underlying pathophysiology and clinical assessment skills. Hemodynamic monitoring involves assessing the relationship between blood pressure, cardiac output, and vascular resistance. Blood pressure equals cardiac output multiplied by systemic vascular resistance. The Frank-Starling mechanism describes how increased preload stretches myocardial fibers, increasing contractile force up to an optimal point. Beyond that point, the heart decompensates and cardiac output falls. Nurses caring for patients with conditions related to cardiovascular system basics must be vigilant in their assessment and monitoring."
    },
    "riskFactors": [
      "Cardiovascular System Basics-related pathology or predisposing conditions",
      "Peripheral vascular disease and venous insufficiency",
      "Deep vein thrombosis risk with Virchow's triad",
      "Cardiac valve disease affecting flow dynamics",
      "Family history of premature cardiovascular disease"
    ],
    "diagnostics": [
      "Continuous cardiac telemetry monitoring",
      "Lipid panel and hemoglobin A1c for risk assessment",
      "Doppler ultrasound for peripheral vascular evaluation",
      "CT angiography for coronary or pulmonary vascular assessment"
    ],
    "management": [
      "Implement graduated activity program as tolerated per cardiac rehabilitation",
      "Apply compression stockings or SCDs for venous thromboembolism prevention",
      "Administer anticoagulation therapy as prescribed with monitoring",
      "Prepare for emergency interventions if hemodynamic instability develops"
    ],
    "nursingActions": [
      "Monitor intake and output strictly including all IV fluids and oral intake",
      "Assess for medication effectiveness and adverse effects after each cardiac drug",
      "Maintain activity restrictions as ordered and assist with gradual mobilization",
      "Apply sequential compression devices for DVT prevention as ordered",
      "Educate patient on sodium restriction and daily weight monitoring at home"
    ],
    "signs": {
      "left": [
        "No jugular venous distension",
        "Clear lung sounds bilaterally",
        "No peripheral edema",
        "Pink warm extremities"
      ],
      "right": [
        "JVD present at 45 degrees",
        "Crackles in lung bases",
        "Pitting edema in lower extremities",
        "Cool, mottled, or cyanotic extremities"
      ]
    },
    "medications": [
      {
        "name": "Nitroglycerin",
        "type": "Vasodilator (nitrate)",
        "action": "Dilates coronary and peripheral vessels reducing preload and myocardial oxygen demand",
        "sideEffects": "Headache, hypotension, flushing, reflex tachycardia",
        "contra": "Hypotension (SBP < 90), recent PDE5 inhibitor use (sildenafil), right ventricular infarction",
        "pearl": "Give SL up to 3 doses 5 minutes apart; if no relief, activate emergency response."
      }
    ],
    "pearls": [
      "An audible S3 in an adult often indicates heart failure with volume overload",
      "Nitroglycerin should not be given if systolic BP is below 90 mmHg",
      "Daily weight is the most reliable indicator of fluid balance in heart failure patients"
    ],
    "quiz": [
      {
        "question": "A patient with heart failure reports sudden weight gain of 2 kg overnight. This suggests:",
        "options": [
          "Muscle gain from activity",
          "Approximately 2 liters of fluid retention",
          "Normal daily variation",
          "Improved nutritional status"
        ],
        "correct": 1,
        "rationale": "1 kg weight gain = approximately 1 liter of fluid retained."
      },
      {
        "question": "Which vital sign change is the earliest indicator of cardiac compromise?",
        "options": [
          "Hypotension",
          "Tachycardia",
          "Bradycardia",
          "Hypertension"
        ],
        "correct": 1,
        "rationale": "Compensatory tachycardia occurs before blood pressure drops."
      },
      {
        "question": "Pitting edema in cardiac disease is graded by:",
        "options": [
          "Weighing the affected limb",
          "Pressing on the shin and noting indent depth and rebound time",
          "Measuring arm circumference",
          "Checking capillary refill only"
        ],
        "correct": 1,
        "rationale": "Pitting edema is graded 1+ to 4+ by depression depth and rebound time."
      },
      {
        "question": "An early sign of left-sided heart failure is:",
        "options": [
          "Peripheral edema in ankles",
          "Jugular venous distension",
          "Crackles in lung bases",
          "Hepatomegaly and ascites"
        ],
        "correct": 2,
        "rationale": "Left-sided failure causes pulmonary congestion heard as crackles (rales)."
      },
      {
        "question": "Which position is contraindicated for severe heart failure?",
        "options": [
          "Semi-Fowler's",
          "High Fowler's",
          "Flat supine",
          "Sitting upright with feet dangling"
        ],
        "correct": 2,
        "rationale": "Flat supine increases venous return, worsening pulmonary congestion in heart failure."
      }
    ]
  },
  "hypovolemic-shock-basics-for-practical-nurses-rpn": {
    "title": "Hypovolemic Shock Basics for Practical Nurses",
    "cellular": {
      "title": "Hypovolemic Shock Pathophysiology",
      "content": "Hypovolemic shock occurs when circulating blood volume decreases by more than 15-20%, leading to inadequate tissue perfusion and cellular hypoxia. Causes include hemorrhage (trauma, GI bleeding, surgical), plasma losses (burns, third-spacing), and fluid losses (severe dehydration, diabetic ketoacidosis). Compensatory mechanisms activate sequentially: sympathetic nervous system increases heart rate and peripheral vasoconstriction, RAAS promotes sodium and water retention, and ADH increases water reabsorption. When compensation fails, blood pressure drops, organ perfusion becomes inadequate, and irreversible cellular damage occurs. Early recognition of compensated shock (tachycardia before hypotension) is crucial for survival."
    },
    "riskFactors": [
      "Trauma with significant hemorrhage (internal or external)",
      "Gastrointestinal bleeding from ulcers or varices",
      "Burns causing massive plasma fluid loss",
      "Severe dehydration from vomiting, diarrhea, or diabetic emergencies",
      "Postpartum hemorrhage or surgical blood loss"
    ],
    "diagnostics": [
      "Serial vital signs with orthostatic measurements",
      "Serum lactate level (elevated indicates tissue hypoperfusion)",
      "Complete blood count with serial hemoglobin/hematocrit",
      "Type and crossmatch for potential transfusion",
      "Arterial blood gas for acid-base status"
    ],
    "management": [
      "Establish two large-bore (16-18 gauge) IV access lines immediately",
      "Infuse isotonic crystalloids (NS or LR) rapidly as ordered",
      "Transfuse packed RBCs for hemorrhagic shock with hemoglobin < 7 g/dL",
      "Apply direct pressure to visible hemorrhage sources",
      "Prepare for surgical intervention if bleeding source not controllable"
    ],
    "nursingActions": [
      "Assess vital signs frequently for early shock indicators (tachycardia precedes hypotension)",
      "Monitor urine output hourly as a marker of organ perfusion (goal > 30 mL/hr)",
      "Maintain two large-bore IV access sites for rapid fluid resuscitation",
      "Position patient in modified Trendelenburg (legs elevated) if not contraindicated",
      "Monitor serial lactate levels and mental status as perfusion indicators"
    ],
    "signs": {
      "left": [
        "Heart rate 60-100 bpm with strong peripheral pulses",
        "Systolic BP > 90 mmHg (patient's baseline)",
        "Urine output > 30 mL/hr",
        "Alert and oriented mental status"
      ],
      "right": [
        "Tachycardia > 100 bpm (earliest compensatory sign)",
        "Hypotension with narrow pulse pressure",
        "Oliguria < 30 mL/hr indicating poor renal perfusion",
        "Altered mental status, restlessness, confusion"
      ]
    },
    "medications": [
      {
        "name": "Norepinephrine (Levophed)",
        "type": "Alpha-1 and beta-1 adrenergic agonist vasopressor",
        "action": "Causes potent vasoconstriction and mild cardiac stimulation to raise blood pressure",
        "sideEffects": "Tissue necrosis with extravasation, reflex bradycardia, arrhythmias",
        "contra": "Hypovolemia (must volume resuscitate first), mesenteric or peripheral vascular thrombosis",
        "pearl": "Must be given through central line; treat hypovolemia with fluids BEFORE starting vasopressors."
      }
    ],
    "pearls": [
      "Tachycardia is the earliest sign of hypovolemic shock - do not wait for hypotension",
      "Replace the volume lost first; vasopressors without volume = squeezing an empty tank",
      "A falling urine output is an earlier indicator of shock than a falling blood pressure"
    ],
    "quiz": [
      {
        "question": "The earliest compensatory sign of hypovolemic shock is:",
        "options": [
          "Hypotension",
          "Bradycardia",
          "Tachycardia",
          "Decreased respiratory rate"
        ],
        "correct": 2,
        "rationale": "Sympathetic activation causes tachycardia before blood pressure drops."
      },
      {
        "question": "Minimum urine output indicating adequate organ perfusion is:",
        "options": [
          "5 mL/hr",
          "15 mL/hr",
          "30 mL/hr",
          "100 mL/hr"
        ],
        "correct": 2,
        "rationale": "Adults need at least 30 mL/hr (0.5 mL/kg/hr) indicating adequate renal perfusion."
      },
      {
        "question": "Which IV access is needed for rapid fluid resuscitation?",
        "options": [
          "22-gauge IV in hand",
          "Two large-bore (16-18 gauge) peripheral IVs",
          "Small butterfly needle",
          "Single 20-gauge IV"
        ],
        "correct": 1,
        "rationale": "Large-bore IVs allow rapid volume infusion; two sites provide redundancy."
      },
      {
        "question": "In hemorrhagic shock, the initial fluid of choice is:",
        "options": [
          "D5W",
          "Packed red blood cells immediately",
          "Isotonic crystalloid (NS or lactated Ringer's)",
          "Albumin"
        ],
        "correct": 2,
        "rationale": "Isotonic crystalloids are the initial resuscitation fluid; blood products follow based on ongoing loss."
      },
      {
        "question": "Vasopressors should be started:",
        "options": [
          "Immediately before fluid resuscitation",
          "Only after adequate volume replacement",
          "Instead of IV fluids",
          "Only if the patient loses consciousness"
        ],
        "correct": 1,
        "rationale": "Volume resuscitation must precede vasopressors; vasopressors on empty vessels worsen ischemia."
      }
    ]
  },
  "marfan-syndrome-2-rpn": {
    "title": "Marfan Syndrome",
    "cellular": {
      "title": "Marfan Syndrome Connective Tissue Defect",
      "content": "Marfan syndrome is an autosomal dominant genetic disorder caused by mutations in the FBN1 gene encoding fibrillin-1, a key structural glycoprotein in connective tissue microfibrils. The defective fibrillin-1 weakens the extracellular matrix throughout the body, particularly affecting the cardiovascular system (aortic root dilation, mitral valve prolapse), skeletal system (tall stature, long limbs, arachnodactyly, pectus deformities, scoliosis), and ocular system (lens subluxation). The most dangerous complication is aortic root aneurysm and dissection, which can be fatal if not monitored and managed. Patients require lifelong cardiovascular surveillance and activity modification."
    },
    "riskFactors": [
      "Family history of Marfan syndrome (autosomal dominant inheritance)",
      "Undiagnosed connective tissue disorder",
      "Pregnancy in affected women increasing aortic dissection risk",
      "High-impact or isometric exercise in undiagnosed patients",
      "Delay in diagnosis allowing aortic dilation to progress"
    ],
    "diagnostics": [
      "Echocardiography for aortic root diameter measurement",
      "Slit-lamp eye examination for lens subluxation",
      "Genetic testing for FBN1 mutations",
      "CT or MRI angiography for aortic assessment",
      "Revised Ghent nosology criteria for clinical diagnosis"
    ],
    "management": [
      "Beta-blocker therapy to reduce aortic wall stress",
      "Losartan (ARB) as alternative or adjunct to beta-blockers",
      "Restriction from contact sports and heavy isometric exercise",
      "Prophylactic aortic root replacement when diameter reaches 5.0 cm",
      "Annual echocardiography for aortic surveillance"
    ],
    "nursingActions": [
      "Monitor blood pressure and maintain within prescribed target range",
      "Assess for chest pain, back pain, or sudden tearing pain (aortic dissection signs)",
      "Measure height and arm span ratio during initial assessment",
      "Educate about avoiding high-impact and isometric exercises",
      "Refer for ophthalmologic examination for lens subluxation screening"
    ],
    "signs": {
      "left": [
        "Stable aortic root dimensions on serial echocardiography",
        "Blood pressure within prescribed target range",
        "No chest or back pain",
        "Adhering to activity restrictions"
      ],
      "right": [
        "Sudden severe tearing chest or back pain (aortic dissection)",
        "Progressive aortic root dilation on echocardiography",
        "New onset murmur (worsening mitral or aortic regurgitation)",
        "Sudden visual changes (lens subluxation or retinal detachment)"
      ]
    },
    "medications": [
      {
        "name": "Atenolol",
        "type": "Beta-1 selective blocker",
        "action": "Reduces heart rate and aortic wall shear stress to slow aortic root dilation",
        "sideEffects": "Bradycardia, fatigue, hypotension, cold extremities, exercise intolerance",
        "contra": "Severe bradycardia, decompensated heart failure, second/third-degree AV block",
        "pearl": "Maintain resting HR around 60 bpm; patients must not stop abruptly - taper to prevent rebound tachycardia."
      }
    ],
    "pearls": [
      "Sudden tearing chest/back pain in Marfan syndrome = assume aortic dissection until proven otherwise",
      "Beta-blockers are the cornerstone of medical management to reduce aortic wall stress",
      "Pregnancy in Marfan patients is high-risk due to hemodynamic changes and aortic stress"
    ],
    "quiz": [
      {
        "question": "The most life-threatening complication of Marfan syndrome is:",
        "options": [
          "Joint hypermobility",
          "Lens subluxation",
          "Aortic root aneurysm and dissection",
          "Scoliosis"
        ],
        "correct": 2,
        "rationale": "Aortic dissection is potentially fatal and is the leading cause of death in Marfan syndrome."
      },
      {
        "question": "Which medication class is first-line for Marfan syndrome cardiac protection?",
        "options": [
          "ACE inhibitors",
          "Calcium channel blockers",
          "Beta-blockers",
          "Digoxin"
        ],
        "correct": 2,
        "rationale": "Beta-blockers reduce heart rate and aortic wall shear stress."
      },
      {
        "question": "A Marfan syndrome patient reports sudden tearing back pain. The nurse should:",
        "options": [
          "Administer acetaminophen and reassess",
          "Recognize possible aortic dissection and notify provider immediately",
          "Apply heat to the back",
          "Encourage deep breathing exercises"
        ],
        "correct": 1,
        "rationale": "Sudden tearing pain is the hallmark presentation of aortic dissection."
      },
      {
        "question": "Which activity restriction applies to patients with Marfan syndrome?",
        "options": [
          "All exercise is prohibited",
          "Only walking is allowed",
          "Avoid contact sports and heavy isometric exercise",
          "No restrictions necessary"
        ],
        "correct": 2,
        "rationale": "High-impact and isometric activities increase aortic wall stress."
      },
      {
        "question": "Marfan syndrome is inherited in which pattern?",
        "options": [
          "Autosomal recessive",
          "X-linked recessive",
          "Autosomal dominant",
          "Mitochondrial"
        ],
        "correct": 2,
        "rationale": "Marfan syndrome follows autosomal dominant inheritance with FBN1 gene mutations."
      }
    ]
  },
  "bronchopulmonary-dysplasia-rpnlvn-rpn": {
    "title": "Bronchopulmonary Dysplasia (RPN/LVN)",
    "cellular": {
      "title": "Bronchopulmonary Dysplasia: Clinical Overview",
      "content": "Bronchopulmonary Dysplasia is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by bronchopulmonary dysplasia require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "Family history related to bronchopulmonary dysplasia or associated conditions",
      "Occupational exposures and workplace hazards",
      "Cognitive impairment limiting adherence to treatment plan",
      "Multiple comorbidities requiring complex medication regimens",
      "Psychosocial stressors affecting health maintenance"
    ],
    "diagnostics": [
      "Vital signs with focus on trending abnormalities",
      "Targeted laboratory studies per provider orders",
      "Clinical examination findings specific to bronchopulmonary dysplasia",
      "Standardized screening and assessment tools as indicated"
    ],
    "management": [
      "Follow evidence-based guidelines for managing bronchopulmonary dysplasia",
      "Maintain prescribed dietary modifications and fluid management",
      "Ensure continuity of care through comprehensive documentation",
      "Collaborate with healthcare team for treatment plan optimization"
    ],
    "nursingActions": [
      "Evaluate and trend vital signs in the context of bronchopulmonary dysplasia",
      "Assess pain level using validated scale and intervene as prescribed",
      "Ensure patient comfort and position for optimal physiological function",
      "Monitor laboratory results and report critical values immediately",
      "Provide emotional support and therapeutic communication throughout care"
    ],
    "signs": {
      "left": [
        "Alert, oriented, and cooperative with care",
        "Adequate nutritional intake and hydration status",
        "Skin integrity maintained without breakdown",
        "Effective coping and engagement in recovery"
      ],
      "right": [
        "Altered mental status or decreased responsiveness",
        "Refusing or unable to maintain adequate intake",
        "Skin breakdown or tissue integrity compromise",
        "Signs of distress, anxiety, or ineffective coping"
      ]
    },
    "medications": [
      {
        "name": "Docusate Sodium (Colace)",
        "type": "Stool softener",
        "action": "Increases water absorption into stool for easier passage",
        "sideEffects": "Mild abdominal cramping, diarrhea with overuse",
        "contra": "Intestinal obstruction, acute abdominal pain of unknown cause",
        "pearl": "Prophylactic use with opioid therapy to prevent constipation; takes 1-3 days for effect."
      }
    ],
    "pearls": [
      "Trending data over time is more valuable than any single assessment point in bronchopulmonary dysplasia",
      "Use SBAR format when communicating patient concerns to ensure clear information transfer",
      "Patient education should be verified using the teach-back method"
    ],
    "quiz": [
      {
        "question": "What is the most important assessment to perform at the beginning of each shift for bronchopulmonary dysplasia?",
        "options": [
          "Check the medication administration record only",
          "Perform a focused assessment comparing current status to baseline",
          "Review discharge planning only",
          "Check the dietary order"
        ],
        "correct": 1,
        "rationale": "Baseline comparison at shift start detects changes and guides priority-setting."
      },
      {
        "question": "Which vital sign change should be reported immediately?",
        "options": [
          "Heart rate of 72 bpm",
          "Respiratory rate increasing from 18 to 32",
          "Temperature of 37.0°C",
          "Blood pressure of 120/80 mmHg"
        ],
        "correct": 1,
        "rationale": "A respiratory rate nearly doubling indicates significant respiratory compromise requiring immediate evaluation."
      },
      {
        "question": "Pain management for a patient with bronchopulmonary dysplasia should include:",
        "options": [
          "Medication only when patient requests it",
          "Regular assessment with both pharmacological and non-pharmacological interventions",
          "Pain medication on a fixed schedule regardless of patient report",
          "Only non-pharmacological measures"
        ],
        "correct": 1,
        "rationale": "Multimodal pain management combining approaches provides better control."
      },
      {
        "question": "An accurate intake and output record requires:",
        "options": [
          "Estimating fluid intake",
          "Measuring and recording all intake and output sources precisely",
          "Recording only IV fluids",
          "Documenting once per day"
        ],
        "correct": 1,
        "rationale": "All fluid sources (oral, IV, drainage, urine, emesis) must be accurately measured and recorded."
      },
      {
        "question": "When a patient with bronchopulmonary dysplasia expresses fear about their condition, the nurse should:",
        "options": [
          "Change the subject to something positive",
          "Use active listening and therapeutic communication",
          "Tell them everything will be fine",
          "Avoid discussing the patient's concerns"
        ],
        "correct": 1,
        "rationale": "Therapeutic communication with active listening validates patient concerns and builds trust."
      }
    ]
  },
  "chest-tube-basics-rpnlvn-rpn": {
    "title": "Chest Tube Basics (RPN/LVN)",
    "cellular": {
      "title": "Chest Tube: Clinical Overview",
      "content": "Chest Tube is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by chest tube require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "Previous episodes or exacerbations of chest tube",
      "Nutritional deficits impairing recovery and healing",
      "Lifestyle factors including activity level and smoking history",
      "Inadequate follow-up care or self-management education",
      "Concurrent infections or inflammatory processes"
    ],
    "diagnostics": [
      "Condition-specific assessment findings related to chest tube",
      "Complete blood count and comprehensive metabolic panel",
      "Imaging studies as ordered (X-ray, CT, MRI, ultrasound)",
      "Point-of-care testing relevant to patient presentation"
    ],
    "management": [
      "Implement treatment protocol specific to chest tube",
      "Administer prescribed medications at correct times and routes",
      "Monitor patient response to interventions and adjust care accordingly",
      "Prepare patient for diagnostic procedures or surgical interventions as ordered"
    ],
    "nursingActions": [
      "Perform comprehensive assessment specific to chest tube at prescribed intervals",
      "Monitor and document clinical parameters relevant to chest tube",
      "Report significant changes from baseline to the charge nurse or provider",
      "Administer prescribed medications and monitor for therapeutic and adverse effects",
      "Educate patient and family about the condition, treatment plan, and self-management"
    ],
    "signs": {
      "left": [
        "Alert, oriented, and cooperative with care",
        "Adequate nutritional intake and hydration status",
        "Skin integrity maintained without breakdown",
        "Effective coping and engagement in recovery"
      ],
      "right": [
        "Altered mental status or decreased responsiveness",
        "Refusing or unable to maintain adequate intake",
        "Skin breakdown or tissue integrity compromise",
        "Signs of distress, anxiety, or ineffective coping"
      ]
    },
    "medications": [
      {
        "name": "Acetaminophen (Tylenol)",
        "type": "Non-opioid analgesic/antipyretic",
        "action": "Reduces pain and fever through central prostaglandin inhibition",
        "sideEffects": "Hepatotoxicity with overdose or chronic use",
        "contra": "Severe liver disease, chronic alcohol use",
        "pearl": "Maximum 3g/day in elderly or those with liver risk; check all medications for hidden acetaminophen."
      }
    ],
    "pearls": [
      "Trending data over time is more valuable than any single assessment point in chest tube",
      "Use SBAR format when communicating patient concerns to ensure clear information transfer",
      "Patient education should be verified using the teach-back method"
    ],
    "quiz": [
      {
        "question": "When assessing a patient with chest tube, the practical nurse should prioritize:",
        "options": [
          "Reviewing the entire medical history first",
          "Performing a focused assessment on the presenting concern",
          "Waiting for provider orders before assessing",
          "Delegating the assessment to another team member"
        ],
        "correct": 1,
        "rationale": "A focused assessment addresses the immediate clinical concern while remaining within scope."
      },
      {
        "question": "Which documentation approach is most appropriate for chest tube assessment findings?",
        "options": [
          "General impressions only",
          "Objective, measurable terms with comparison to baseline",
          "Subjective opinions about the patient's condition",
          "Documentation is not necessary for routine assessments"
        ],
        "correct": 1,
        "rationale": "Objective documentation with baseline comparison provides the most clinically useful information."
      },
      {
        "question": "A patient with chest tube shows sudden deterioration. The nurse should first:",
        "options": [
          "Continue monitoring at regular intervals",
          "Assess the patient and notify the charge nurse or provider immediately",
          "Wait for the next scheduled assessment",
          "Ask the family what happened"
        ],
        "correct": 1,
        "rationale": "Acute deterioration requires immediate assessment and prompt reporting for intervention."
      },
      {
        "question": "When communicating a patient concern using SBAR, the 'A' stands for:",
        "options": [
          "Action",
          "Assessment",
          "Awareness",
          "Arrangement"
        ],
        "correct": 1,
        "rationale": "SBAR: Situation, Background, Assessment, Recommendation."
      },
      {
        "question": "The practical nurse's priority when caring for a patient with chest tube is:",
        "options": [
          "Completing all charting on time",
          "Ensuring patient safety and monitoring for changes",
          "Maintaining the room environment",
          "Scheduling follow-up appointments"
        ],
        "correct": 1,
        "rationale": "Patient safety and vigilant monitoring are always the top nursing priorities."
      }
    ]
  },
  "tracheostomy-care-rpnlvn-rpn": {
    "title": "Tracheostomy Care (RPN/LVN)",
    "cellular": {
      "title": "Tracheostomy Care: Clinical Overview",
      "content": "Tracheostomy Care is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by tracheostomy care require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "Previous episodes or exacerbations of tracheostomy care",
      "Nutritional deficits impairing recovery and healing",
      "Lifestyle factors including activity level and smoking history",
      "Inadequate follow-up care or self-management education",
      "Concurrent infections or inflammatory processes"
    ],
    "diagnostics": [
      "Condition-specific assessment findings related to tracheostomy care",
      "Complete blood count and comprehensive metabolic panel",
      "Imaging studies as ordered (X-ray, CT, MRI, ultrasound)",
      "Point-of-care testing relevant to patient presentation"
    ],
    "management": [
      "Implement treatment protocol specific to tracheostomy care",
      "Administer prescribed medications at correct times and routes",
      "Monitor patient response to interventions and adjust care accordingly",
      "Prepare patient for diagnostic procedures or surgical interventions as ordered"
    ],
    "nursingActions": [
      "Perform comprehensive assessment specific to tracheostomy care at prescribed intervals",
      "Monitor and document clinical parameters relevant to tracheostomy care",
      "Report significant changes from baseline to the charge nurse or provider",
      "Administer prescribed medications and monitor for therapeutic and adverse effects",
      "Educate patient and family about the condition, treatment plan, and self-management"
    ],
    "signs": {
      "left": [
        "Alert, oriented, and cooperative with care",
        "Adequate nutritional intake and hydration status",
        "Skin integrity maintained without breakdown",
        "Effective coping and engagement in recovery"
      ],
      "right": [
        "Altered mental status or decreased responsiveness",
        "Refusing or unable to maintain adequate intake",
        "Skin breakdown or tissue integrity compromise",
        "Signs of distress, anxiety, or ineffective coping"
      ]
    },
    "medications": [
      {
        "name": "Cephalexin (Keflex)",
        "type": "First-generation cephalosporin antibiotic",
        "action": "Bactericidal - disrupts bacterial cell wall synthesis",
        "sideEffects": "Diarrhea, nausea, rash, vaginal candidiasis",
        "contra": "Severe penicillin allergy (cross-reactivity possible)",
        "pearl": "Complete the full prescribed course even if symptoms improve; take with food to reduce GI upset."
      }
    ],
    "pearls": [
      "Trending data over time is more valuable than any single assessment point in tracheostomy care",
      "Use SBAR format when communicating patient concerns to ensure clear information transfer",
      "Patient education should be verified using the teach-back method"
    ],
    "quiz": [
      {
        "question": "When assessing a patient with tracheostomy care, the practical nurse should prioritize:",
        "options": [
          "Reviewing the entire medical history first",
          "Performing a focused assessment on the presenting concern",
          "Waiting for provider orders before assessing",
          "Delegating the assessment to another team member"
        ],
        "correct": 1,
        "rationale": "A focused assessment addresses the immediate clinical concern while remaining within scope."
      },
      {
        "question": "Which documentation approach is most appropriate for tracheostomy care assessment findings?",
        "options": [
          "General impressions only",
          "Objective, measurable terms with comparison to baseline",
          "Subjective opinions about the patient's condition",
          "Documentation is not necessary for routine assessments"
        ],
        "correct": 1,
        "rationale": "Objective documentation with baseline comparison provides the most clinically useful information."
      },
      {
        "question": "A patient with tracheostomy care shows sudden deterioration. The nurse should first:",
        "options": [
          "Continue monitoring at regular intervals",
          "Assess the patient and notify the charge nurse or provider immediately",
          "Wait for the next scheduled assessment",
          "Ask the family what happened"
        ],
        "correct": 1,
        "rationale": "Acute deterioration requires immediate assessment and prompt reporting for intervention."
      },
      {
        "question": "When communicating a patient concern using SBAR, the 'A' stands for:",
        "options": [
          "Action",
          "Assessment",
          "Awareness",
          "Arrangement"
        ],
        "correct": 1,
        "rationale": "SBAR: Situation, Background, Assessment, Recommendation."
      },
      {
        "question": "The practical nurse's priority when caring for a patient with tracheostomy care is:",
        "options": [
          "Completing all charting on time",
          "Ensuring patient safety and monitoring for changes",
          "Maintaining the room environment",
          "Scheduling follow-up appointments"
        ],
        "correct": 1,
        "rationale": "Patient safety and vigilant monitoring are always the top nursing priorities."
      }
    ]
  },
  "airway-suctioning-for-practical-nurses-rpn": {
    "title": "Airway Suctioning for Practical Nurses",
    "cellular": {
      "title": "Airway Suctioning: Clinical Overview",
      "content": "Airway Suctioning is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by airway suctioning require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "Family history related to airway suctioning or associated conditions",
      "Occupational exposures and workplace hazards",
      "Cognitive impairment limiting adherence to treatment plan",
      "Multiple comorbidities requiring complex medication regimens",
      "Psychosocial stressors affecting health maintenance"
    ],
    "diagnostics": [
      "Vital signs with focus on trending abnormalities",
      "Targeted laboratory studies per provider orders",
      "Clinical examination findings specific to airway suctioning",
      "Standardized screening and assessment tools as indicated"
    ],
    "management": [
      "Follow evidence-based guidelines for managing airway suctioning",
      "Maintain prescribed dietary modifications and fluid management",
      "Ensure continuity of care through comprehensive documentation",
      "Collaborate with healthcare team for treatment plan optimization"
    ],
    "nursingActions": [
      "Perform comprehensive assessment specific to airway suctioning at prescribed intervals",
      "Monitor and document clinical parameters relevant to airway suctioning",
      "Report significant changes from baseline to the charge nurse or provider",
      "Administer prescribed medications and monitor for therapeutic and adverse effects",
      "Educate patient and family about the condition, treatment plan, and self-management"
    ],
    "signs": {
      "left": [
        "Alert, oriented, and cooperative with care",
        "Adequate nutritional intake and hydration status",
        "Skin integrity maintained without breakdown",
        "Effective coping and engagement in recovery"
      ],
      "right": [
        "Altered mental status or decreased responsiveness",
        "Refusing or unable to maintain adequate intake",
        "Skin breakdown or tissue integrity compromise",
        "Signs of distress, anxiety, or ineffective coping"
      ]
    },
    "medications": [
      {
        "name": "Cephalexin (Keflex)",
        "type": "First-generation cephalosporin antibiotic",
        "action": "Bactericidal - disrupts bacterial cell wall synthesis",
        "sideEffects": "Diarrhea, nausea, rash, vaginal candidiasis",
        "contra": "Severe penicillin allergy (cross-reactivity possible)",
        "pearl": "Complete the full prescribed course even if symptoms improve; take with food to reduce GI upset."
      }
    ],
    "pearls": [
      "Trending data over time is more valuable than any single assessment point in airway suctioning",
      "Use SBAR format when communicating patient concerns to ensure clear information transfer",
      "Patient education should be verified using the teach-back method"
    ],
    "quiz": [
      {
        "question": "When assessing a patient with airway suctioning, the practical nurse should prioritize:",
        "options": [
          "Reviewing the entire medical history first",
          "Performing a focused assessment on the presenting concern",
          "Waiting for provider orders before assessing",
          "Delegating the assessment to another team member"
        ],
        "correct": 1,
        "rationale": "A focused assessment addresses the immediate clinical concern while remaining within scope."
      },
      {
        "question": "Which documentation approach is most appropriate for airway suctioning assessment findings?",
        "options": [
          "General impressions only",
          "Objective, measurable terms with comparison to baseline",
          "Subjective opinions about the patient's condition",
          "Documentation is not necessary for routine assessments"
        ],
        "correct": 1,
        "rationale": "Objective documentation with baseline comparison provides the most clinically useful information."
      },
      {
        "question": "A patient with airway suctioning shows sudden deterioration. The nurse should first:",
        "options": [
          "Continue monitoring at regular intervals",
          "Assess the patient and notify the charge nurse or provider immediately",
          "Wait for the next scheduled assessment",
          "Ask the family what happened"
        ],
        "correct": 1,
        "rationale": "Acute deterioration requires immediate assessment and prompt reporting for intervention."
      },
      {
        "question": "When communicating a patient concern using SBAR, the 'A' stands for:",
        "options": [
          "Action",
          "Assessment",
          "Awareness",
          "Arrangement"
        ],
        "correct": 1,
        "rationale": "SBAR: Situation, Background, Assessment, Recommendation."
      },
      {
        "question": "The practical nurse's priority when caring for a patient with airway suctioning is:",
        "options": [
          "Completing all charting on time",
          "Ensuring patient safety and monitoring for changes",
          "Maintaining the room environment",
          "Scheduling follow-up appointments"
        ],
        "correct": 1,
        "rationale": "Patient safety and vigilant monitoring are always the top nursing priorities."
      }
    ]
  },
  "lung-cancer-basics-rpnlvn-rpn": {
    "title": "Lung Cancer Basics (RPN/LVN)",
    "cellular": {
      "title": "Lung Cancer: Clinical Overview",
      "content": "Lung Cancer is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by lung cancer require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "Genetic predisposition to lung cancer",
      "Environmental factors and exposure history",
      "Socioeconomic barriers limiting access to preventive care",
      "Prior surgical or procedural interventions",
      "Physiological stress and immune system compromise"
    ],
    "diagnostics": [
      "Vital signs with focus on trending abnormalities",
      "Targeted laboratory studies per provider orders",
      "Clinical examination findings specific to lung cancer",
      "Standardized screening and assessment tools as indicated"
    ],
    "management": [
      "Follow evidence-based guidelines for managing lung cancer",
      "Maintain prescribed dietary modifications and fluid management",
      "Ensure continuity of care through comprehensive documentation",
      "Collaborate with healthcare team for treatment plan optimization"
    ],
    "nursingActions": [
      "Conduct focused assessment targeting lung cancer-specific findings",
      "Assess skin integrity and tissue perfusion each shift",
      "Verify patient understanding of prescribed treatments using teach-back",
      "Implement fall prevention and safety measures individualized to patient needs",
      "Communicate assessment findings during handoff using SBAR format"
    ],
    "signs": {
      "left": [
        "Lung Cancer-related parameters within expected range",
        "Stable vital signs at patient's baseline",
        "Patient reporting comfort and adequate symptom control",
        "Maintaining functional independence appropriate to condition"
      ],
      "right": [
        "Worsening lung cancer-related symptoms beyond baseline",
        "Vital sign instability or deterioration from baseline",
        "Increasing pain, discomfort, or functional decline",
        "New symptoms or complications not previously documented"
      ]
    },
    "medications": [
      {
        "name": "Docusate Sodium (Colace)",
        "type": "Stool softener",
        "action": "Increases water absorption into stool for easier passage",
        "sideEffects": "Mild abdominal cramping, diarrhea with overuse",
        "contra": "Intestinal obstruction, acute abdominal pain of unknown cause",
        "pearl": "Prophylactic use with opioid therapy to prevent constipation; takes 1-3 days for effect."
      }
    ],
    "pearls": [
      "Evidence-based practice should guide all interventions for lung cancer",
      "Early recognition of deterioration saves lives - know the warning signs specific to this condition",
      "Continuity of care requires thorough documentation and verbal handoff"
    ],
    "quiz": [
      {
        "question": "Which infection prevention measure is most important when caring for a patient with lung cancer?",
        "options": [
          "Wearing double gloves",
          "Performing hand hygiene before and after patient contact",
          "Using a face shield for all interactions",
          "Limiting visitor access completely"
        ],
        "correct": 1,
        "rationale": "Hand hygiene is the single most effective infection prevention measure."
      },
      {
        "question": "A patient's condition is deteriorating. Which action demonstrates appropriate clinical judgment?",
        "options": [
          "Waiting for the next routine assessment",
          "Recognizing the change and escalating care through proper channels",
          "Documenting without notifying anyone",
          "Reassuring the patient without assessment"
        ],
        "correct": 1,
        "rationale": "Recognizing deterioration and escalating promptly prevents adverse outcomes."
      },
      {
        "question": "Discharge education for lung cancer should include:",
        "options": [
          "Written instructions only without discussion",
          "Verbal and written instructions with teach-back verification",
          "Instructions given only to family members",
          "No education until follow-up appointment"
        ],
        "correct": 1,
        "rationale": "Combined verbal and written instructions verified by teach-back ensure patient understanding."
      },
      {
        "question": "The practical nurse notices an error in a medication order. The correct action is to:",
        "options": [
          "Administer it as written",
          "Clarify with the prescriber before administration",
          "Skip the medication without notifying anyone",
          "Administer and document the error after"
        ],
        "correct": 1,
        "rationale": "Questionable orders must be clarified before administration to prevent errors."
      },
      {
        "question": "Cultural sensitivity in nursing care means:",
        "options": [
          "Treating all patients exactly the same regardless of background",
          "Respecting cultural beliefs and incorporating them into the care plan when possible",
          "Avoiding all discussion of cultural differences",
          "Assuming cultural preferences based on ethnicity"
        ],
        "correct": 1,
        "rationale": "Cultural sensitivity involves respectful inquiry and incorporating patient preferences into individualized care."
      }
    ]
  }
};
