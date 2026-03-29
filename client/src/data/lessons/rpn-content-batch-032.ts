import type { LessonContent } from "./types";

export const rpnContentBatch032Lessons: Record<string, LessonContent> = {
  "cardiac-rhythm-interpretation-rn-level-rn": {
    "title": "Cardiac Rhythm Interpretation (RN Level)",
    "cellular": {
      "title": "Cardiac Rhythm Disturbances and Electrical Conduction",
      "content": "Cardiac arrhythmias result from abnormalities in impulse generation, impulse conduction, or both within the heart's electrical system. The normal conduction pathway flows from the SA node through the atria, AV node, bundle of His, bundle branches, and Purkinje fibers. Disruption at any point produces characteristic rhythm disturbances. The SA node normally fires at 60-100 bpm, but ectopic pacemaker sites (AV node: 40-60, ventricles: 20-40) can take over when the SA node fails. Arrhythmias range from benign (premature atrial contractions) to immediately life-threatening (ventricular fibrillation). Recognition of lethal rhythms and prompt emergency response are essential competencies."
    },
    "riskFactors": [
      "Electrolyte imbalances particularly potassium and magnesium",
      "Myocardial ischemia or acute infarction",
      "Heart failure with structural cardiac remodeling",
      "Medication toxicity from digoxin or antiarrhythmics",
      "Stimulant use including caffeine, amphetamines, or cocaine"
    ],
    "diagnostics": [
      "Continuous cardiac telemetry monitoring",
      "12-lead ECG for rhythm identification",
      "Serum electrolytes (K+, Mg2+, Ca2+)",
      "Cardiac biomarkers if ischemia suspected",
      "Holter monitor for intermittent arrhythmias"
    ],
    "management": [
      "Place patient on continuous cardiac monitoring with alarm parameters set",
      "Maintain IV access for emergency medication administration",
      "Keep emergency equipment (defibrillator, airway cart) at bedside",
      "Correct underlying electrolyte imbalances as ordered",
      "Administer antiarrhythmic medications per protocol"
    ],
    "nursingActions": [
      "Identify the cardiac rhythm on the monitor at the start of each shift",
      "Compare current rhythm to baseline and report new arrhythmias immediately",
      "Correlate rhythm changes with symptoms (chest pain, dizziness, syncope)",
      "Verify defibrillator function and emergency equipment readiness each shift",
      "Document rhythm strips per facility protocol with interpretation noted"
    ],
    "signs": {
      "left": [
        "Normal sinus rhythm 60-100 bpm",
        "Regular P waves before each QRS complex",
        "Consistent PR interval 0.12-0.20 seconds",
        "Normal QRS duration < 0.12 seconds"
      ],
      "right": [
        "Irregular rhythm or rate < 60 or > 100 bpm",
        "Absent P waves or variable PR intervals",
        "Wide QRS complex > 0.12 seconds",
        "Pulseless rhythm (VF, asystole, PEA)"
      ]
    },
    "medications": [
      {
        "name": "Amiodarone",
        "type": "Class III antiarrhythmic",
        "action": "Prolongs action potential duration and refractory period across all cardiac tissues",
        "sideEffects": "Pulmonary toxicity, thyroid dysfunction, hepatotoxicity, corneal microdeposits",
        "contra": "Severe sinus node dysfunction, second/third-degree AV block without pacemaker",
        "pearl": "Monitor thyroid and liver function tests regularly; causes photosensitivity - advise sunscreen use."
      }
    ],
    "pearls": [
      "Ventricular fibrillation and pulseless VT require immediate defibrillation",
      "Always check the patient first, not just the monitor - artifact can mimic VF",
      "Atrial fibrillation increases stroke risk; anticoagulation is typically indicated"
    ],
    "quiz": [
      {
        "question": "Which cardiac rhythm requires immediate defibrillation?",
        "options": [
          "Sinus bradycardia",
          "Atrial fibrillation with controlled rate",
          "Ventricular fibrillation",
          "First-degree AV block"
        ],
        "correct": 2,
        "rationale": "Ventricular fibrillation is a pulseless lethal rhythm requiring immediate defibrillation."
      },
      {
        "question": "A normal PR interval on ECG measures:",
        "options": [
          "0.04-0.10 seconds",
          "0.12-0.20 seconds",
          "0.22-0.36 seconds",
          "0.40-0.60 seconds"
        ],
        "correct": 1,
        "rationale": "Normal PR interval is 0.12-0.20 seconds representing AV conduction time."
      },
      {
        "question": "Which electrolyte imbalance most commonly causes cardiac arrhythmias?",
        "options": [
          "Sodium",
          "Potassium",
          "Chloride",
          "Phosphorus"
        ],
        "correct": 1,
        "rationale": "Potassium is critical for cardiac cell repolarization; imbalances directly affect rhythm."
      },
      {
        "question": "When the cardiac monitor shows a flat line, the nurse should first:",
        "options": [
          "Begin chest compressions immediately",
          "Defibrillate the patient",
          "Check the patient and verify lead connections",
          "Administer epinephrine IV push"
        ],
        "correct": 2,
        "rationale": "Always verify the patient and equipment first - a flat line may be lead disconnection."
      },
      {
        "question": "Atrial fibrillation increases the risk for:",
        "options": [
          "Pneumonia",
          "Stroke from thrombi formed in fibrillating atria",
          "Kidney stone formation",
          "Osteoporosis"
        ],
        "correct": 1,
        "rationale": "Stagnant blood in fibrillating atria forms clots that can embolize to the brain causing stroke."
      }
    ]
  },
  "fetal-heart-rate-monitoring-rn": {
    "title": "Fetal Heart Rate Monitoring",
    "cellular": {
      "title": "Hemodynamic Principles and Cardiac Function",
      "content": "Fetal Heart Rate Monitoring requires thorough understanding of the underlying pathophysiology and clinical assessment skills. Hemodynamic monitoring involves assessing the relationship between blood pressure, cardiac output, and vascular resistance. Blood pressure equals cardiac output multiplied by systemic vascular resistance. The Frank-Starling mechanism describes how increased preload stretches myocardial fibers, increasing contractile force up to an optimal point. Beyond that point, the heart decompensates and cardiac output falls. Nurses caring for patients with conditions related to fetal heart rate monitoring must be vigilant in their assessment and monitoring."
    },
    "riskFactors": [
      "Fetal Heart Rate Monitoring-related pathology or predisposing conditions",
      "Peripheral vascular disease and venous insufficiency",
      "Deep vein thrombosis risk with Virchow's triad",
      "Cardiac valve disease affecting flow dynamics",
      "Family history of premature cardiovascular disease"
    ],
    "diagnostics": [
      "12-lead ECG for rhythm and ischemia detection",
      "Cardiac biomarkers (troponin, BNP/pro-BNP) as ordered",
      "Echocardiography for structural and functional assessment",
      "Chest X-ray for heart size and pulmonary congestion"
    ],
    "management": [
      "Continuous cardiac monitoring with appropriate alarm settings",
      "Position in semi-Fowler's to reduce cardiac workload",
      "Administer cardiac medications on schedule per protocol",
      "Maintain sodium and fluid restrictions as prescribed"
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
        "Regular heart rate 60-100 bpm",
        "Strong symmetrical peripheral pulses",
        "Capillary refill < 3 seconds",
        "Normal blood pressure for patient"
      ],
      "right": [
        "Irregular or abnormal heart rate",
        "Weak or absent peripheral pulses",
        "Capillary refill > 3 seconds",
        "Hypotension or hypertension outside normal range"
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
  "fluid-and-electrolytes-1-rn": {
    "title": "Fluid & Electrolytes (1)",
    "cellular": {
      "title": "Fluid & Electrolytes (1): Clinical Overview",
      "content": "Fluid & Electrolytes (1) is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by fluid & electrolytes (1) require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "Genetic predisposition to fluid & electrolytes (1)",
      "Environmental factors and exposure history",
      "Socioeconomic barriers limiting access to preventive care",
      "Prior surgical or procedural interventions",
      "Physiological stress and immune system compromise"
    ],
    "diagnostics": [
      "Vital signs with focus on trending abnormalities",
      "Targeted laboratory studies per provider orders",
      "Clinical examination findings specific to fluid & electrolytes (1)",
      "Standardized screening and assessment tools as indicated"
    ],
    "management": [
      "Follow evidence-based guidelines for managing fluid & electrolytes (1)",
      "Maintain prescribed dietary modifications and fluid management",
      "Ensure continuity of care through comprehensive documentation",
      "Collaborate with healthcare team for treatment plan optimization"
    ],
    "nursingActions": [
      "Conduct focused assessment targeting fluid & electrolytes (1)-specific findings",
      "Assess skin integrity and tissue perfusion each shift",
      "Verify patient understanding of prescribed treatments using teach-back",
      "Implement fall prevention and safety measures individualized to patient needs",
      "Communicate assessment findings during handoff using SBAR format"
    ],
    "signs": {
      "left": [
        "Fluid & Electrolytes (1)-related parameters within expected range",
        "Stable vital signs at patient's baseline",
        "Patient reporting comfort and adequate symptom control",
        "Maintaining functional independence appropriate to condition"
      ],
      "right": [
        "Worsening fluid & electrolytes (1)-related symptoms beyond baseline",
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
      "Evidence-based practice should guide all interventions for fluid & electrolytes (1)",
      "Early recognition of deterioration saves lives - know the warning signs specific to this condition",
      "Continuity of care requires thorough documentation and verbal handoff"
    ],
    "quiz": [
      {
        "question": "Which infection prevention measure is most important when caring for a patient with fluid & electrolytes (1)?",
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
        "question": "Discharge education for fluid & electrolytes (1) should include:",
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
  },
  "fluid-electrolyte-and-acid-base-balance-rn-rn": {
    "title": "Fluid, Electrolyte, and Acid-Base Balance (RN)",
    "cellular": {
      "title": "Fluid, Electrolyte, and Acid-Base Balance: Clinical Overview",
      "content": "Fluid, Electrolyte, and Acid-Base Balance is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by fluid, electrolyte, and acid-base balance require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "History of fluid, electrolyte, and acid-base balance or related conditions",
      "Age-related physiological changes increasing susceptibility",
      "Chronic comorbidities complicating the clinical picture",
      "Medication interactions or polypharmacy concerns",
      "Delayed recognition of symptoms and late presentation"
    ],
    "diagnostics": [
      "Condition-specific assessment findings related to fluid, electrolyte, and acid-base balance",
      "Complete blood count and comprehensive metabolic panel",
      "Imaging studies as ordered (X-ray, CT, MRI, ultrasound)",
      "Point-of-care testing relevant to patient presentation"
    ],
    "management": [
      "Implement treatment protocol specific to fluid, electrolyte, and acid-base balance",
      "Administer prescribed medications at correct times and routes",
      "Monitor patient response to interventions and adjust care accordingly",
      "Prepare patient for diagnostic procedures or surgical interventions as ordered"
    ],
    "nursingActions": [
      "Conduct focused assessment targeting fluid, electrolyte, and acid-base balance-specific findings",
      "Assess skin integrity and tissue perfusion each shift",
      "Verify patient understanding of prescribed treatments using teach-back",
      "Implement fall prevention and safety measures individualized to patient needs",
      "Communicate assessment findings during handoff using SBAR format"
    ],
    "signs": {
      "left": [
        "Fluid, Electrolyte, and Acid-Base Balance-related parameters within expected range",
        "Stable vital signs at patient's baseline",
        "Patient reporting comfort and adequate symptom control",
        "Maintaining functional independence appropriate to condition"
      ],
      "right": [
        "Worsening fluid, electrolyte, and acid-base balance-related symptoms beyond baseline",
        "Vital sign instability or deterioration from baseline",
        "Increasing pain, discomfort, or functional decline",
        "New symptoms or complications not previously documented"
      ]
    },
    "medications": [
      {
        "name": "Ondansetron (Zofran)",
        "type": "5-HT3 receptor antagonist antiemetic",
        "action": "Blocks serotonin receptors in the chemoreceptor trigger zone and GI tract",
        "sideEffects": "Headache, constipation, QT prolongation with repeated dosing",
        "contra": "Concomitant apomorphine use, known QT prolongation",
        "pearl": "Effective for nausea prevention; monitor ECG if giving repeated doses or in cardiac patients."
      }
    ],
    "pearls": [
      "Evidence-based practice should guide all interventions for fluid, electrolyte, and acid-base balance",
      "Early recognition of deterioration saves lives - know the warning signs specific to this condition",
      "Continuity of care requires thorough documentation and verbal handoff"
    ],
    "quiz": [
      {
        "question": "Which infection prevention measure is most important when caring for a patient with fluid, electrolyte, and acid-base balance?",
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
        "question": "Discharge education for fluid, electrolyte, and acid-base balance should include:",
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
  },
  "advanced-cardiovascular-nursing-rn-rn": {
    "title": "Advanced Cardiovascular Nursing (RN)",
    "cellular": {
      "title": "Hemodynamic Principles and Cardiac Function",
      "content": "Advanced Cardiovascular Nursing requires thorough understanding of the underlying pathophysiology and clinical assessment skills. Hemodynamic monitoring involves assessing the relationship between blood pressure, cardiac output, and vascular resistance. Blood pressure equals cardiac output multiplied by systemic vascular resistance. The Frank-Starling mechanism describes how increased preload stretches myocardial fibers, increasing contractile force up to an optimal point. Beyond that point, the heart decompensates and cardiac output falls. Nurses caring for patients with conditions related to advanced cardiovascular nursing must be vigilant in their assessment and monitoring."
    },
    "riskFactors": [
      "Advanced Cardiovascular Nursing-related pathology or predisposing conditions",
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
      "Assess apical and peripheral pulses noting rate, rhythm, and quality",
      "Monitor for decreased cardiac output signs: cool extremities, weak pulses, low urine output",
      "Check blood pressure and heart rate before administering cardiac medications",
      "Weigh patient daily at same time with same clothing to track fluid balance",
      "Report chest pain, new arrhythmias, or hemodynamic instability immediately"
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
        "question": "Which formula represents cardiac output?",
        "options": [
          "BP x HR",
          "Heart rate x Stroke volume",
          "Preload x Afterload",
          "SBP x DBP"
        ],
        "correct": 1,
        "rationale": "Cardiac output equals heart rate multiplied by stroke volume."
      },
      {
        "question": "Which finding suggests decreased cardiac output?",
        "options": [
          "Warm, dry skin",
          "Bounding pulses",
          "Cool extremities with weak pulses",
          "Capillary refill of 2 seconds"
        ],
        "correct": 2,
        "rationale": "Cool extremities with weak pulses indicate poor peripheral perfusion from low CO."
      },
      {
        "question": "Before administering metoprolol, the nurse should check:",
        "options": [
          "Respiratory rate",
          "Apical heart rate for a full minute",
          "Temperature",
          "Pupil response"
        ],
        "correct": 1,
        "rationale": "Heart rate must be checked; hold beta-blockers if HR < 60 bpm."
      },
      {
        "question": "Semi-Fowler's position benefits cardiac patients by:",
        "options": [
          "Increasing preload",
          "Reducing venous return and cardiac workload",
          "Increasing afterload",
          "Promoting dependent edema"
        ],
        "correct": 1,
        "rationale": "Semi-Fowler's reduces venous return, decreasing cardiac workload."
      },
      {
        "question": "JVD in a cardiac patient most likely indicates:",
        "options": [
          "Dehydration",
          "Right-sided heart failure or fluid overload",
          "Anemia",
          "Peripheral artery disease"
        ],
        "correct": 1,
        "rationale": "JVD indicates fluid backup from right-sided heart failure."
      }
    ]
  },
  "pulmonary-valve-stenosis-2-rn": {
    "title": "Pulmonary Valve Stenosis",
    "cellular": {
      "title": "Cardiovascular System Architecture",
      "content": "Pulmonary Valve Stenosis requires thorough understanding of the underlying pathophysiology and clinical assessment skills. The cardiovascular system consists of the heart (a four-chambered muscular pump), blood vessels (arteries, veins, capillaries), and blood. The heart's right side receives deoxygenated blood and pumps it to the lungs via the pulmonary circuit, while the left side receives oxygenated blood and distributes it systemically. Cardiac output is determined by heart rate multiplied by stroke volume, influenced by preload (venous return), afterload (vascular resistance), and contractility. Nurses caring for patients with conditions related to pulmonary valve stenosis must be vigilant in their assessment and monitoring."
    },
    "riskFactors": [
      "Pulmonary Valve Stenosis-related pathology or predisposing conditions",
      "Chronic hypertension causing left ventricular hypertrophy",
      "Dyslipidemia promoting endothelial damage and plaque buildup",
      "Type 2 diabetes accelerating microvascular disease",
      "Tobacco use causing vasoconstriction and endothelial injury"
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
      "Assess apical and peripheral pulses noting rate, rhythm, and quality",
      "Monitor for decreased cardiac output signs: cool extremities, weak pulses, low urine output",
      "Check blood pressure and heart rate before administering cardiac medications",
      "Weigh patient daily at same time with same clothing to track fluid balance",
      "Report chest pain, new arrhythmias, or hemodynamic instability immediately"
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
        "name": "Metoprolol",
        "type": "Beta-blocker",
        "action": "Reduces heart rate, blood pressure, and myocardial oxygen demand",
        "sideEffects": "Bradycardia, fatigue, hypotension, cold extremities",
        "contra": "Heart block, decompensated heart failure, severe bradycardia",
        "pearl": "Hold and notify provider if heart rate < 60 bpm or systolic BP < 90 mmHg."
      }
    ],
    "pearls": [
      "Cardiac output = Heart Rate x Stroke Volume; changes in either component affect perfusion",
      "JVD is assessed with patient at 45 degrees - indicates right heart failure or fluid overload",
      "New onset chest pain should always be treated as a cardiac emergency until proven otherwise"
    ],
    "quiz": [
      {
        "question": "Which formula represents cardiac output?",
        "options": [
          "BP x HR",
          "Heart rate x Stroke volume",
          "Preload x Afterload",
          "SBP x DBP"
        ],
        "correct": 1,
        "rationale": "Cardiac output equals heart rate multiplied by stroke volume."
      },
      {
        "question": "Which finding suggests decreased cardiac output?",
        "options": [
          "Warm, dry skin",
          "Bounding pulses",
          "Cool extremities with weak pulses",
          "Capillary refill of 2 seconds"
        ],
        "correct": 2,
        "rationale": "Cool extremities with weak pulses indicate poor peripheral perfusion from low CO."
      },
      {
        "question": "Before administering metoprolol, the nurse should check:",
        "options": [
          "Respiratory rate",
          "Apical heart rate for a full minute",
          "Temperature",
          "Pupil response"
        ],
        "correct": 1,
        "rationale": "Heart rate must be checked; hold beta-blockers if HR < 60 bpm."
      },
      {
        "question": "Semi-Fowler's position benefits cardiac patients by:",
        "options": [
          "Increasing preload",
          "Reducing venous return and cardiac workload",
          "Increasing afterload",
          "Promoting dependent edema"
        ],
        "correct": 1,
        "rationale": "Semi-Fowler's reduces venous return, decreasing cardiac workload."
      },
      {
        "question": "JVD in a cardiac patient most likely indicates:",
        "options": [
          "Dehydration",
          "Right-sided heart failure or fluid overload",
          "Anemia",
          "Peripheral artery disease"
        ],
        "correct": 1,
        "rationale": "JVD indicates fluid backup from right-sided heart failure."
      }
    ]
  },
  "advanced-respiratory-nursing-rn-rn": {
    "title": "Advanced Respiratory Nursing (RN)",
    "cellular": {
      "title": "Advanced Respiratory Nursing: Clinical Overview",
      "content": "Advanced Respiratory Nursing is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by advanced respiratory nursing require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "History of advanced respiratory nursing or related conditions",
      "Age-related physiological changes increasing susceptibility",
      "Chronic comorbidities complicating the clinical picture",
      "Medication interactions or polypharmacy concerns",
      "Delayed recognition of symptoms and late presentation"
    ],
    "diagnostics": [
      "Condition-specific assessment findings related to advanced respiratory nursing",
      "Complete blood count and comprehensive metabolic panel",
      "Imaging studies as ordered (X-ray, CT, MRI, ultrasound)",
      "Point-of-care testing relevant to patient presentation"
    ],
    "management": [
      "Implement treatment protocol specific to advanced respiratory nursing",
      "Administer prescribed medications at correct times and routes",
      "Monitor patient response to interventions and adjust care accordingly",
      "Prepare patient for diagnostic procedures or surgical interventions as ordered"
    ],
    "nursingActions": [
      "Conduct focused assessment targeting advanced respiratory nursing-specific findings",
      "Assess skin integrity and tissue perfusion each shift",
      "Verify patient understanding of prescribed treatments using teach-back",
      "Implement fall prevention and safety measures individualized to patient needs",
      "Communicate assessment findings during handoff using SBAR format"
    ],
    "signs": {
      "left": [
        "Advanced Respiratory Nursing-related parameters within expected range",
        "Stable vital signs at patient's baseline",
        "Patient reporting comfort and adequate symptom control",
        "Maintaining functional independence appropriate to condition"
      ],
      "right": [
        "Worsening advanced respiratory nursing-related symptoms beyond baseline",
        "Vital sign instability or deterioration from baseline",
        "Increasing pain, discomfort, or functional decline",
        "New symptoms or complications not previously documented"
      ]
    },
    "medications": [
      {
        "name": "Ondansetron (Zofran)",
        "type": "5-HT3 receptor antagonist antiemetic",
        "action": "Blocks serotonin receptors in the chemoreceptor trigger zone and GI tract",
        "sideEffects": "Headache, constipation, QT prolongation with repeated dosing",
        "contra": "Concomitant apomorphine use, known QT prolongation",
        "pearl": "Effective for nausea prevention; monitor ECG if giving repeated doses or in cardiac patients."
      }
    ],
    "pearls": [
      "Evidence-based practice should guide all interventions for advanced respiratory nursing",
      "Early recognition of deterioration saves lives - know the warning signs specific to this condition",
      "Continuity of care requires thorough documentation and verbal handoff"
    ],
    "quiz": [
      {
        "question": "Which infection prevention measure is most important when caring for a patient with advanced respiratory nursing?",
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
        "question": "Discharge education for advanced respiratory nursing should include:",
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
  },
  "comprehensive-airway-assessment-rn-rn": {
    "title": "Comprehensive Airway Assessment (RN)",
    "cellular": {
      "title": "Comprehensive Airway Assessment: Clinical Overview",
      "content": "Comprehensive Airway Assessment is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by comprehensive airway assessment require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "Family history related to comprehensive airway assessment or associated conditions",
      "Occupational exposures and workplace hazards",
      "Cognitive impairment limiting adherence to treatment plan",
      "Multiple comorbidities requiring complex medication regimens",
      "Psychosocial stressors affecting health maintenance"
    ],
    "diagnostics": [
      "Vital signs with focus on trending abnormalities",
      "Targeted laboratory studies per provider orders",
      "Clinical examination findings specific to comprehensive airway assessment",
      "Standardized screening and assessment tools as indicated"
    ],
    "management": [
      "Follow evidence-based guidelines for managing comprehensive airway assessment",
      "Maintain prescribed dietary modifications and fluid management",
      "Ensure continuity of care through comprehensive documentation",
      "Collaborate with healthcare team for treatment plan optimization"
    ],
    "nursingActions": [
      "Conduct focused assessment targeting comprehensive airway assessment-specific findings",
      "Assess skin integrity and tissue perfusion each shift",
      "Verify patient understanding of prescribed treatments using teach-back",
      "Implement fall prevention and safety measures individualized to patient needs",
      "Communicate assessment findings during handoff using SBAR format"
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
        "name": "Ondansetron (Zofran)",
        "type": "5-HT3 receptor antagonist antiemetic",
        "action": "Blocks serotonin receptors in the chemoreceptor trigger zone and GI tract",
        "sideEffects": "Headache, constipation, QT prolongation with repeated dosing",
        "contra": "Concomitant apomorphine use, known QT prolongation",
        "pearl": "Effective for nausea prevention; monitor ECG if giving repeated doses or in cardiac patients."
      }
    ],
    "pearls": [
      "Comprehensive Airway Assessment management requires ongoing reassessment of the care plan effectiveness",
      "Medication safety: always verify the six rights before administering any drug",
      "Patient advocacy means speaking up when something does not seem right"
    ],
    "quiz": [
      {
        "question": "Which infection prevention measure is most important when caring for a patient with comprehensive airway assessment?",
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
        "question": "Discharge education for comprehensive airway assessment should include:",
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
  },
  "respiratory-assessment-protocol-rn-rn": {
    "title": "Respiratory Assessment Protocol (RN)",
    "cellular": {
      "title": "Respiratory Assessment Protocol: Clinical Overview",
      "content": "Respiratory Assessment Protocol is a clinical topic requiring comprehensive nursing knowledge and assessment skills. Understanding the pathophysiology, clinical presentation, diagnostic workup, and management principles enables practical nurses to provide safe, competent care within their scope of practice. Patients affected by respiratory assessment protocol require systematic assessment, ongoing monitoring, and appropriate interventions tailored to their individual needs and clinical trajectory. Evidence-based practice guides all nursing interventions for this condition, with a focus on patient safety, comfort, and optimal outcomes."
    },
    "riskFactors": [
      "History of respiratory assessment protocol or related conditions",
      "Age-related physiological changes increasing susceptibility",
      "Chronic comorbidities complicating the clinical picture",
      "Medication interactions or polypharmacy concerns",
      "Delayed recognition of symptoms and late presentation"
    ],
    "diagnostics": [
      "Condition-specific assessment findings related to respiratory assessment protocol",
      "Complete blood count and comprehensive metabolic panel",
      "Imaging studies as ordered (X-ray, CT, MRI, ultrasound)",
      "Point-of-care testing relevant to patient presentation"
    ],
    "management": [
      "Implement treatment protocol specific to respiratory assessment protocol",
      "Administer prescribed medications at correct times and routes",
      "Monitor patient response to interventions and adjust care accordingly",
      "Prepare patient for diagnostic procedures or surgical interventions as ordered"
    ],
    "nursingActions": [
      "Perform comprehensive assessment specific to respiratory assessment protocol at prescribed intervals",
      "Monitor and document clinical parameters relevant to respiratory assessment protocol",
      "Report significant changes from baseline to the charge nurse or provider",
      "Administer prescribed medications and monitor for therapeutic and adverse effects",
      "Educate patient and family about the condition, treatment plan, and self-management"
    ],
    "signs": {
      "left": [
        "Respiratory Assessment Protocol-related parameters within expected range",
        "Stable vital signs at patient's baseline",
        "Patient reporting comfort and adequate symptom control",
        "Maintaining functional independence appropriate to condition"
      ],
      "right": [
        "Worsening respiratory assessment protocol-related symptoms beyond baseline",
        "Vital sign instability or deterioration from baseline",
        "Increasing pain, discomfort, or functional decline",
        "New symptoms or complications not previously documented"
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
      "Always assess the whole patient, not just the respiratory assessment protocol-specific findings",
      "Document objective findings using precise, measurable descriptions",
      "When something concerns you about a patient, report it - trust your clinical instincts"
    ],
    "quiz": [
      {
        "question": "When assessing a patient with respiratory assessment protocol, the practical nurse should prioritize:",
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
        "question": "Which documentation approach is most appropriate for respiratory assessment protocol assessment findings?",
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
        "question": "A patient with respiratory assessment protocol shows sudden deterioration. The nurse should first:",
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
        "question": "The practical nurse's priority when caring for a patient with respiratory assessment protocol is:",
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
  "brown-sequard-syndrome-rn": {
    "title": "Brown-Séquard Syndrome",
    "cellular": {
      "title": "Brown-Séquard Spinal Cord Hemisection Syndrome",
      "content": "Brown-Séquard syndrome results from lateral hemisection of the spinal cord, producing a characteristic pattern of ipsilateral motor paralysis and proprioception loss below the lesion, with contralateral loss of pain and temperature sensation beginning one to two segments below the level of injury. This pattern occurs because the corticospinal tract (motor) and dorsal columns (proprioception, vibration, fine touch) cross at the medulla, so they are affected on the same side as the lesion. The spinothalamic tract (pain, temperature, crude touch) crosses at the spinal cord level of entry, so it is affected on the opposite side. Common causes include penetrating trauma, spinal tumors, and multiple sclerosis."
    },
    "riskFactors": [
      "Penetrating spinal trauma (stab wounds, gunshot injuries)",
      "Spinal cord tumors causing asymmetric compression",
      "Multiple sclerosis with demyelinating plaques",
      "Spinal cord infarction (anterior spinal artery territory)",
      "Epidural hematoma or abscess compressing one side of the cord"
    ],
    "diagnostics": [
      "MRI of the spine to visualize hemisection lesion",
      "Detailed neurological examination mapping motor and sensory deficits",
      "CT myelography if MRI contraindicated",
      "Motor strength testing using Medical Research Council scale",
      "Sensory testing for light touch, pain, temperature, vibration, and proprioception"
    ],
    "management": [
      "Spinal stabilization and immobilization during acute phase",
      "High-dose corticosteroids if traumatic and within 8 hours of injury per protocol",
      "Surgical decompression if caused by tumor, abscess, or hematoma",
      "Early rehabilitation referral for physical and occupational therapy",
      "DVT prophylaxis for immobilized patients"
    ],
    "nursingActions": [
      "Perform detailed motor and sensory examination on BOTH sides of the body",
      "Assess ipsilateral motor function and proprioception (same side as lesion)",
      "Test contralateral pain and temperature sensation (opposite side from lesion)",
      "Maintain spinal precautions until cleared by physician",
      "Document neurological examination findings precisely including sensory levels"
    ],
    "signs": {
      "left": [
        "Ipsilateral: Motor function intact (no paralysis)",
        "Ipsilateral: Normal proprioception and vibration",
        "Contralateral: Normal motor function",
        "Contralateral: Intact pain and temperature sensation"
      ],
      "right": [
        "Ipsilateral: Spastic paralysis below lesion level",
        "Ipsilateral: Loss of proprioception and vibration sense",
        "Contralateral: Loss of pain and temperature sensation",
        "Contralateral: Motor function preserved"
      ]
    },
    "medications": [
      {
        "name": "Methylprednisolone (Solu-Medrol)",
        "type": "Corticosteroid anti-inflammatory",
        "action": "Reduces spinal cord edema and secondary injury cascade in acute traumatic injury",
        "sideEffects": "Hyperglycemia, infection risk, GI bleeding, wound healing impairment",
        "contra": "Active infection, GI bleeding, use beyond 8 hours post-injury (controversial)",
        "pearl": "Controversial in spinal cord injury; if used, must be within 8 hours; monitor blood glucose closely."
      }
    ],
    "pearls": [
      "Motor loss is IPSILATERAL (same side as lesion), pain/temperature loss is CONTRALATERAL",
      "This distinctive crossed pattern occurs because sensory tracts cross at different spinal cord levels",
      "Brown-Séquard has the best prognosis of all incomplete spinal cord injuries"
    ],
    "quiz": [
      {
        "question": "In Brown-Séquard syndrome, motor paralysis occurs on:",
        "options": [
          "The opposite side from the spinal cord lesion",
          "The same side as the spinal cord lesion (ipsilateral)",
          "Both sides equally",
          "Neither side"
        ],
        "correct": 1,
        "rationale": "The corticospinal tract crosses at the medulla, so ipsilateral motor loss occurs."
      },
      {
        "question": "Loss of pain and temperature sensation occurs on:",
        "options": [
          "The same side as the lesion",
          "The opposite side from the lesion (contralateral)",
          "Both sides",
          "Neither side"
        ],
        "correct": 1,
        "rationale": "The spinothalamic tract crosses at the spinal cord level, causing contralateral loss."
      },
      {
        "question": "The most common cause of Brown-Séquard syndrome is:",
        "options": [
          "Blunt trauma",
          "Penetrating spinal cord injury",
          "Infection",
          "Degenerative disc disease"
        ],
        "correct": 1,
        "rationale": "Penetrating injuries (stab/gunshot wounds) most commonly cause hemisection."
      },
      {
        "question": "Which assessment finding is expected on the SAME side as the spinal cord lesion?",
        "options": [
          "Loss of pain sensation",
          "Motor paralysis and loss of proprioception",
          "Loss of temperature sensation only",
          "Normal motor function"
        ],
        "correct": 1,
        "rationale": "Ipsilateral motor paralysis and proprioception loss are characteristic."
      },
      {
        "question": "Brown-Séquard syndrome compared to complete cord injury has:",
        "options": [
          "Worse prognosis",
          "The same prognosis",
          "The best prognosis of incomplete cord syndromes",
          "No chance of recovery"
        ],
        "correct": 2,
        "rationale": "Brown-Séquard has the best functional recovery prognosis of all SCI syndromes."
      }
    ]
  }
};
