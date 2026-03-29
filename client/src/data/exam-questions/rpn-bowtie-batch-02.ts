import type { BowtieQuestion } from "./types";

export const rpnBowtieBatch02Questions: BowtieQuestion[] = [
  {
    "id": "bt_rpn2_endocrine_0",
    "scenario": "A client with diabetes has deep rapid respirations, fruity breath, and blood glucose of 24 mmol/L.",
    "centerOptions": [
      "Diabetic ketoacidosis",
      "Hypoglycemia",
      "Heart failure",
      "Pneumonia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood glucose",
      "Hair growth",
      "Bowel sounds",
      "Visual acuity only"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the provider and begin ordered fluid replacement",
      "Give oral glucose tablets",
      "Encourage exercise",
      "Restrict all fluids"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Marked hyperglycemia, fruity breath, and Kussmaul respirations indicate diabetic ketoacidosis. The client needs urgent treatment including fluids and insulin per orders. Blood glucose is one of the key measures of response.",
      "findings": "The correct monitoring parameter is Blood glucose.",
      "actions": "The correct action is Notify the provider and begin ordered fluid replacement."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_cardiovascular_1",
    "scenario": "A client with heart failure reports sudden shortness of breath when lying flat. Crackles are present bilaterally and oxygen saturation is 87 percent.",
    "centerOptions": [
      "Pulmonary edema",
      "Appendicitis",
      "Urinary tract infection",
      "Migraine"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Bowel pattern",
      "Hair distribution",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Administer oxygen",
      "Encourage oral fluids",
      "Place the client flat",
      "Provide a large meal"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Pulmonary edema is a common complication of worsening heart failure and presents with crackles, dyspnea, and hypoxemia. Oxygen is a priority intervention. Oxygen saturation is the key parameter to monitor for treatment response.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Administer oxygen."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_endocrine_2",
    "scenario": "A client with diabetes becomes shaky, sweaty, and confused. Point-of-care glucose is 3.0 mmol/L.",
    "centerOptions": [
      "Hypoglycemia",
      "Hyperglycemia",
      "Stroke",
      "Sepsis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood glucose level",
      "Bowel sounds",
      "Hair loss",
      "Urine color"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Give 15 g of fast-acting carbohydrate",
      "Administer insulin",
      "Encourage ambulation",
      "Restrict food intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A glucose of 3.0 mmol/L with diaphoresis and confusion indicates hypoglycemia. Fast-acting carbohydrate is the immediate treatment if the client can swallow. Ongoing blood glucose monitoring confirms recovery.",
      "findings": "The correct monitoring parameter is Blood glucose level.",
      "actions": "The correct action is Give 15 g of fast-acting carbohydrate."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_3",
    "scenario": "A postoperative client who has been immobile develops sudden dyspnea, pleuritic chest pain, and tachycardia.",
    "centerOptions": [
      "Pulmonary embolism",
      "Pneumonia",
      "Meningitis",
      "Appendicitis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Bowel sounds",
      "Pupil size",
      "Hair texture"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen",
      "Encourage a high-fibre diet",
      "Place the client flat",
      "Apply a warm compress to the abdomen"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden dyspnea and chest pain after immobility are strongly suggestive of pulmonary embolism. Supporting oxygenation is the immediate priority. Oxygen saturation helps identify worsening gas exchange.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Apply oxygen."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pediatrics_4",
    "scenario": "A child with asthma has audible wheezing, retractions, and difficulty speaking. Oxygen saturation is 85 percent.",
    "centerOptions": [
      "Acute asthma exacerbation",
      "Heart failure",
      "Urinary tract infection",
      "Appendicitis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory effort",
      "Bowel pattern",
      "Hair loss",
      "Urine color"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Administer salbutamol",
      "Give a laxative",
      "Encourage exercise",
      "Offer solid food"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "This child has signs of significant bronchospasm and respiratory distress. Salbutamol is the priority medication to open the airways. Respiratory effort helps identify whether the child is improving or tiring.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Administer salbutamol."
    },
    "bodySystem": "Pediatrics",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_5",
    "scenario": "A client taking warfarin reports black stools and easy bruising.",
    "centerOptions": [
      "Anticoagulant-related bleeding",
      "Dehydration",
      "Pneumonia",
      "Hypoglycemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "INR",
      "Hair texture",
      "Bowel sounds only",
      "Urine specific gravity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the provider and hold further doses as ordered",
      "Give aspirin",
      "Encourage leafy greens immediately only",
      "Apply heat to the abdomen"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Melena and bruising suggest bleeding while on warfarin. The provider should be notified promptly and further dosing may need to be held. INR is the most relevant parameter for monitoring warfarin effect.",
      "findings": "The correct monitoring parameter is INR.",
      "actions": "The correct action is Notify the provider and hold further doses as ordered."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_fluidandelectrolytes_6",
    "scenario": "A client with chronic kidney disease has weakness and palpitations. Laboratory results show potassium 6.3 mmol/L.",
    "centerOptions": [
      "Hyperkalemia",
      "Hypoglycemia",
      "Hyponatremia",
      "Anemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Cardiac rhythm",
      "Bowel sounds",
      "Hair growth",
      "Skin moisture"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Place the client on cardiac monitoring",
      "Encourage a banana",
      "Assist with exercise",
      "Provide a high-potassium meal"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A potassium of 6.3 mmol/L is severe hyperkalemia and can quickly cause dangerous dysrhythmias. Cardiac monitoring is a priority. Cardiac rhythm is the most important monitoring target.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Place the client on cardiac monitoring."
    },
    "bodySystem": "Fluid and Electrolytes",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_maternal_7",
    "scenario": "A postpartum client saturates a pad in 15 minutes and reports dizziness.",
    "centerOptions": [
      "Postpartum hemorrhage",
      "Normal lochia",
      "Urinary retention",
      "Mastitis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Hair distribution",
      "Bowel sounds",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Assess the fundus and call for help",
      "Encourage the client to shower",
      "Provide discharge teaching",
      "Offer a high-fibre meal"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Heavy bleeding after delivery with dizziness suggests postpartum hemorrhage. Immediate assessment of uterine tone and rapid response are required. Blood pressure is crucial to monitor hemodynamic stability.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Assess the fundus and call for help."
    },
    "bodySystem": "Maternal",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_8",
    "scenario": "A client has fever, productive cough, crackles, and oxygen saturation of 88 percent on room air.",
    "centerOptions": [
      "Pneumonia",
      "Stroke",
      "Hypoglycemia",
      "Urinary tract infection"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory status",
      "Hair loss",
      "Bowel frequency",
      "Urine output only"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen as prescribed",
      "Restrict fluids",
      "Place the client flat",
      "Encourage stair climbing"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "These findings strongly indicate pneumonia with impaired gas exchange. Oxygen is a priority intervention. Respiratory status is the most relevant measure of improvement or deterioration.",
      "findings": "The correct monitoring parameter is Respiratory status.",
      "actions": "The correct action is Apply oxygen as prescribed."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_neurology_9",
    "scenario": "A client suddenly develops facial droop, slurred speech, and weakness in one arm.",
    "centerOptions": [
      "Stroke",
      "Appendicitis",
      "Pneumonia",
      "Migraine"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Neurological status",
      "Bowel sounds",
      "Hair texture",
      "Urine odor"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Activate stroke protocol",
      "Offer a meal tray",
      "Encourage a nap",
      "Provide a laxative"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden focal deficits are consistent with stroke and require rapid evaluation because treatment is time sensitive. Neurological status is the key monitoring focus.",
      "findings": "The correct monitoring parameter is Neurological status.",
      "actions": "The correct action is Activate stroke protocol."
    },
    "bodySystem": "Neurology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_10",
    "scenario": "A client taking digoxin reports nausea, loss of appetite, and blurred yellow vision. The apical pulse is 50/min.",
    "centerOptions": [
      "Digoxin toxicity",
      "Heart failure improvement",
      "Hypoglycemia",
      "Expected therapeutic effect"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Apical pulse",
      "Bowel pattern",
      "Hair growth",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Hold the medication and notify the provider",
      "Administer the dose with juice",
      "Encourage more activity",
      "Give a potassium-wasting diuretic"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Nausea, visual changes, and bradycardia are classic signs of digoxin toxicity. The medication should be withheld and the provider notified. The apical pulse is essential to monitor with digoxin therapy.",
      "findings": "The correct monitoring parameter is Apical pulse.",
      "actions": "The correct action is Hold the medication and notify the provider."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_11",
    "scenario": "A client taking warfarin reports melena and spontaneous bruising.",
    "centerOptions": [
      "Warfarin-related bleeding",
      "Normal therapeutic response",
      "Hypoglycemia",
      "Heart failure"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "INR",
      "Bowel sounds",
      "Hair texture",
      "Urine concentration"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and hold further doses as ordered",
      "Give ibuprofen for discomfort",
      "Double the next dose",
      "Encourage a long walk"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Melena and bruising suggest excessive anticoagulation and bleeding risk. The prescriber should be notified and doses may need to be held. INR is the major lab value used to monitor warfarin therapy.",
      "findings": "The correct monitoring parameter is INR.",
      "actions": "The correct action is Notify the prescriber and hold further doses as ordered."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_12",
    "scenario": "A client who received regular insulin becomes shaky, pale, and confused. The blood glucose is 3.1 mmol/L.",
    "centerOptions": [
      "Insulin-induced hypoglycemia",
      "Hyperglycemia",
      "Diabetic ketoacidosis",
      "Stroke"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood glucose level",
      "Bowel sounds",
      "Hair loss",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Give 15 g of fast-acting carbohydrate",
      "Administer another insulin dose",
      "Encourage exercise",
      "Restrict food intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "The symptoms and glucose value indicate hypoglycemia. The priority is immediate carbohydrate replacement if the client can swallow. Blood glucose must then be rechecked to confirm resolution.",
      "findings": "The correct monitoring parameter is Blood glucose level.",
      "actions": "The correct action is Give 15 g of fast-acting carbohydrate."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_13",
    "scenario": "A client taking furosemide reports weakness and muscle cramps. Laboratory results show potassium 2.8 mmol/L.",
    "centerOptions": [
      "Loop diuretic-induced hypokalemia",
      "Hyperkalemia",
      "Warfarin toxicity",
      "Fluid overload"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Cardiac rhythm",
      "Bowel sounds",
      "Hair texture",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and anticipate potassium replacement",
      "Offer a potassium-wasting medication",
      "Administer the next dose early",
      "Restrict all oral intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Furosemide promotes potassium loss. Severe hypokalemia can cause muscle weakness and dangerous dysrhythmias. Cardiac rhythm is the most important parameter to monitor.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Notify the prescriber and anticipate potassium replacement."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_14",
    "scenario": "A client receives morphine IV. Fifteen minutes later, the client is difficult to arouse and respirations are 6/min.",
    "centerOptions": [
      "Opioid-induced respiratory depression",
      "Therapeutic pain relief",
      "Anxiety attack",
      "Pulmonary embolism"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory rate",
      "Bowel pattern",
      "Hair loss",
      "Urine odor"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Prepare naloxone and support respirations",
      "Administer another opioid dose",
      "Encourage sleep",
      "Offer oral fluids"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Severe sedation with respirations of 6/min after morphine indicates opioid toxicity. Naloxone may be required and respiratory status is the priority. Respiratory rate is the most critical monitoring parameter.",
      "findings": "The correct monitoring parameter is Respiratory rate.",
      "actions": "The correct action is Prepare naloxone and support respirations."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_15",
    "scenario": "A client starts an IV antibiotic and immediately develops facial swelling, wheezing, and hypotension.",
    "centerOptions": [
      "Anaphylaxis",
      "Expected side effect",
      "Hypoglycemia",
      "Fluid overload"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Airway status",
      "Bowel sounds",
      "Hair texture",
      "Urine color"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Stop the infusion and call for emergency help",
      "Slow the infusion and reassess later",
      "Encourage oral fluids",
      "Continue the medication and monitor overnight"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Facial swelling, wheezing, and hypotension after antibiotic exposure are signs of anaphylaxis. The infusion must be stopped immediately and emergency support initiated. Airway status is the critical monitoring priority.",
      "findings": "The correct monitoring parameter is Airway status.",
      "actions": "The correct action is Stop the infusion and call for emergency help."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_16",
    "scenario": "A client taking metoprolol reports dizziness. The pulse is 46/min and blood pressure is 88/52 mm Hg.",
    "centerOptions": [
      "Beta blocker adverse effect",
      "Hyperglycemia",
      "Fluid overload",
      "Urinary retention"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Heart rate",
      "Bowel sounds",
      "Hair distribution",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Hold the medication and notify the prescriber",
      "Administer the next dose with food",
      "Encourage a brisk walk",
      "Offer coffee and reassess next shift"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Metoprolol can cause bradycardia and hypotension. This pulse and blood pressure are unsafe, so the drug should be held and the prescriber informed. Heart rate is the key parameter to monitor with beta blockers.",
      "findings": "The correct monitoring parameter is Heart rate.",
      "actions": "The correct action is Hold the medication and notify the prescriber."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_17",
    "scenario": "A client taking ramipril develops lip swelling and trouble swallowing shortly after the morning dose.",
    "centerOptions": [
      "ACE inhibitor angioedema",
      "Expected dry cough only",
      "Mild nausea",
      "Dehydration"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Airway patency",
      "Bowel pattern",
      "Hair growth",
      "Urine concentration"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Hold the medication and seek emergency evaluation",
      "Encourage more fluids and continue the dose",
      "Administer the next dose earlier",
      "Apply a warm compress"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Ramipril, like other ACE inhibitors, can cause angioedema. Lip swelling and difficulty swallowing can progress to airway obstruction. Airway patency must be monitored closely and urgent care is needed.",
      "findings": "The correct monitoring parameter is Airway patency.",
      "actions": "The correct action is Hold the medication and seek emergency evaluation."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_18",
    "scenario": "A client uses salbutamol and then reports palpitations and fine tremors in both hands.",
    "centerOptions": [
      "Expected bronchodilator side effect",
      "Anaphylaxis",
      "Stroke",
      "Opioid toxicity"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Heart rate",
      "Bowel sounds",
      "Hair loss",
      "Urine output only"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Reassess and continue monitoring",
      "Administer naloxone",
      "Hold all inhalers permanently without an order",
      "Restrict breathing treatments"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Salbutamol commonly causes temporary palpitations and tremors due to beta-adrenergic stimulation. Reassessment and monitoring are appropriate unless symptoms become severe. Heart rate is the most relevant parameter to watch.",
      "findings": "The correct monitoring parameter is Heart rate.",
      "actions": "The correct action is Reassess and continue monitoring."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_19",
    "scenario": "A client taking long-term prednisone reports black stools and burning epigastric pain.",
    "centerOptions": [
      "Corticosteroid-related gastrointestinal bleeding",
      "Hypoglycemia",
      "Hyperkalemia",
      "Urinary tract infection"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Stool appearance",
      "Hair distribution",
      "Bowel sounds only",
      "Urine specific gravity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and assess for bleeding",
      "Encourage aspirin use",
      "Administer another steroid dose",
      "Offer a high-fibre snack only"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Long-term corticosteroids can contribute to gastric irritation and bleeding. Black stools and epigastric pain are concerning findings. The prescriber should be notified and bleeding assessed. Stool appearance is the most relevant monitoring target.",
      "findings": "The correct monitoring parameter is Stool appearance.",
      "actions": "The correct action is Notify the prescriber and assess for bleeding."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_cardiovascular_20",
    "scenario": "A client with chronic heart failure develops severe dyspnea when lying flat, crackles, and oxygen saturation of 86 percent.",
    "centerOptions": [
      "Pulmonary edema",
      "Pneumonia",
      "Appendicitis",
      "Migraine"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Bowel pattern",
      "Hair texture",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Administer oxygen and sit the client upright",
      "Encourage oral fluids",
      "Place the client flat",
      "Provide a full meal"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Pulmonary edema from heart failure causes crackles, orthopnea, and hypoxemia. Upright positioning and oxygen improve gas exchange. Oxygen saturation is the key parameter to monitor.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Administer oxygen and sit the client upright."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_endocrine_21",
    "scenario": "A client with diabetes becomes sweaty, shaky, and confused. The blood glucose is 2.9 mmol/L.",
    "centerOptions": [
      "Hypoglycemia",
      "Hyperglycemia",
      "Stroke",
      "Sepsis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood glucose",
      "Bowel sounds",
      "Hair distribution",
      "Urine output"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Give 15 g of fast-acting carbohydrate",
      "Administer regular insulin",
      "Restrict oral intake",
      "Encourage exercise"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A glucose of 2.9 mmol/L with sympathetic symptoms indicates hypoglycemia. Fast-acting carbohydrate is the priority treatment if the client can swallow. Blood glucose should then be reassessed.",
      "findings": "The correct monitoring parameter is Blood glucose.",
      "actions": "The correct action is Give 15 g of fast-acting carbohydrate."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_22",
    "scenario": "A postoperative client who has been immobile develops sudden chest pain, dyspnea, and oxygen saturation of 85 percent.",
    "centerOptions": [
      "Pulmonary embolism",
      "Pneumonia",
      "Appendicitis",
      "Migraine"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Abdominal girth",
      "Hair growth",
      "Bowel sounds"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen and notify the prescriber immediately",
      "Encourage oral fluids only",
      "Offer a meal tray",
      "Apply heat to the chest"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden dyspnea and chest pain after immobility strongly suggest pulmonary embolism. Oxygen and urgent escalation are priorities. Oxygen saturation is the most relevant monitoring parameter.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Apply oxygen and notify the prescriber immediately."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pediatrics_23",
    "scenario": "A child with asthma has retractions, wheezing, and oxygen saturation of 84 percent.",
    "centerOptions": [
      "Severe asthma exacerbation",
      "Croup",
      "Mild dehydration",
      "Heart failure"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory effort",
      "Bowel pattern",
      "Urine colour",
      "Hair texture"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Administer salbutamol immediately",
      "Encourage running",
      "Offer solid food",
      "Delay treatment and observe"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Retractions, wheezing, and severe hypoxemia indicate major bronchospasm. Salbutamol is the priority medication. Respiratory effort is important because worsening fatigue may signal impending failure.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Administer salbutamol immediately."
    },
    "bodySystem": "Pediatrics",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_24",
    "scenario": "A client with fever, productive cough, crackles, and oxygen saturation of 88 percent is admitted from home.",
    "centerOptions": [
      "Pneumonia",
      "Stroke",
      "Urinary tract infection",
      "Hypoglycemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory status",
      "Hair growth",
      "Bowel frequency",
      "Abdominal girth"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen as prescribed",
      "Restrict all fluids",
      "Place the client flat",
      "Encourage stair climbing"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "The symptoms and low oxygen saturation are consistent with pneumonia. Oxygen is a priority intervention for impaired gas exchange. Respiratory status best reflects improvement or deterioration.",
      "findings": "The correct monitoring parameter is Respiratory status.",
      "actions": "The correct action is Apply oxygen as prescribed."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_neurology_25",
    "scenario": "A client suddenly develops facial droop, slurred speech, and weakness in the right arm.",
    "centerOptions": [
      "Stroke",
      "Migraine",
      "Appendicitis",
      "Hypoglycemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Neurological status",
      "Bowel sounds",
      "Hair texture",
      "Urine odour"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Activate stroke protocol immediately",
      "Offer oral fluids and rest",
      "Give a laxative",
      "Delay intervention until later"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden focal deficits indicate stroke and require rapid evaluation because treatment is time dependent. Neurological status is the most important parameter to monitor closely.",
      "findings": "The correct monitoring parameter is Neurological status.",
      "actions": "The correct action is Activate stroke protocol immediately."
    },
    "bodySystem": "Neurology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_maternal_26",
    "scenario": "A postpartum client saturates a perineal pad in 10 minutes and is pale and dizzy.",
    "centerOptions": [
      "Postpartum hemorrhage",
      "Mastitis",
      "Normal lochia",
      "Urinary retention"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Visual acuity",
      "Hair distribution",
      "Bowel pattern"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Assess the fundus and call for immediate help",
      "Encourage walking",
      "Offer a high-fibre snack",
      "Delay assessment until the next set of vitals"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Heavy vaginal bleeding with pallor and dizziness is consistent with postpartum hemorrhage. Fundal assessment and rapid escalation are priorities. Blood pressure helps identify hemodynamic instability.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Assess the fundus and call for immediate help."
    },
    "bodySystem": "Maternal",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_fluidandelectrolytes_27",
    "scenario": "A client with chronic kidney disease reports weakness and palpitations. Potassium is 6.5 mmol/L.",
    "centerOptions": [
      "Hyperkalemia",
      "Hypoglycemia",
      "Anemia",
      "Hyponatremia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Cardiac rhythm",
      "Hair growth",
      "Bowel sounds",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Place the client on cardiac monitoring",
      "Give a banana",
      "Encourage vigorous exercise",
      "Provide a high-potassium meal"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A potassium of 6.5 mmol/L is dangerously high and can cause life-threatening dysrhythmias. Cardiac monitoring is a priority. Cardiac rhythm is the most important parameter to monitor.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Place the client on cardiac monitoring."
    },
    "bodySystem": "Fluid and Electrolytes",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_28",
    "scenario": "A client receiving IV antibiotics develops facial swelling, wheezing, and hypotension within minutes of the infusion starting.",
    "centerOptions": [
      "Anaphylaxis",
      "Expected medication effect",
      "Hypoglycemia",
      "Fluid overload"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Airway status",
      "Hair texture",
      "Bowel sounds",
      "Urine concentration"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Stop the infusion and call for emergency assistance",
      "Slow the infusion and reassess later",
      "Encourage oral fluids",
      "Continue the infusion and monitor overnight"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Facial swelling, wheezing, and hypotension after a medication exposure indicate anaphylaxis. The infusion must be stopped immediately and emergency support initiated. Airway status is the critical monitoring priority.",
      "findings": "The correct monitoring parameter is Airway status.",
      "actions": "The correct action is Stop the infusion and call for emergency assistance."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_endocrine_29",
    "scenario": "A client with diabetes has deep rapid respirations, fruity breath, and a blood glucose of 25 mmol/L.",
    "centerOptions": [
      "Diabetic ketoacidosis",
      "Hypoglycemia",
      "Stroke",
      "Pulmonary edema"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood glucose",
      "Bowel sounds",
      "Hair texture",
      "Visual acuity only"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and begin ordered fluid replacement",
      "Give fast-acting carbohydrate",
      "Encourage exercise",
      "Restrict all oral intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Kussmaul respirations, fruity breath, and marked hyperglycemia indicate diabetic ketoacidosis. Urgent treatment is required, including fluid replacement and insulin per orders. Blood glucose is a key parameter to monitor.",
      "findings": "The correct monitoring parameter is Blood glucose.",
      "actions": "The correct action is Notify the prescriber and begin ordered fluid replacement."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_infectioncontrol_30",
    "scenario": "A client has fever, hypotension, tachycardia, and increasing confusion in the setting of a suspected infection.",
    "centerOptions": [
      "Sepsis",
      "Hypoglycemia",
      "Migraine",
      "Appendicitis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Hair pattern",
      "Bowel frequency",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and begin sepsis-focused interventions per orders",
      "Offer a snack tray",
      "Encourage the client to walk",
      "Delay intervention until routine rounds"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fever, hypotension, tachycardia, and confusion strongly suggest sepsis with systemic compromise. Rapid escalation and treatment are essential. Blood pressure is critical to monitor because septic shock may develop.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the prescriber and begin sepsis-focused interventions per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_cardiovascular_31",
    "scenario": "A client reports heavy chest pressure radiating to the left arm with diaphoresis and nausea.",
    "centerOptions": [
      "Myocardial infarction",
      "Heartburn",
      "Appendicitis",
      "Urinary tract infection"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Cardiac rhythm",
      "Hair texture",
      "Bowel sounds",
      "Urine output"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Obtain immediate assessment and notify the prescriber",
      "Offer a high-fibre snack",
      "Encourage walking",
      "Delay intervention until the next medication pass"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Radiating chest pressure with diaphoresis and nausea suggests myocardial infarction. Immediate assessment and escalation are required. Cardiac rhythm is essential to monitor because dysrhythmias may occur.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Obtain immediate assessment and notify the prescriber."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_32",
    "scenario": "A client with COPD has increasing dyspnea, accessory muscle use, and oxygen saturation of 82 percent on room air.",
    "centerOptions": [
      "COPD exacerbation with hypoxemia",
      "Urinary tract infection",
      "Appendicitis",
      "Heartburn"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory effort",
      "Hair distribution",
      "Bowel sounds",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen as prescribed and assess respiratory status",
      "Encourage brisk walking",
      "Offer a large meal",
      "Place the client flat"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Dyspnea, accessory muscle use, and low oxygen saturation are consistent with COPD exacerbation and significant gas-exchange impairment. Oxygen and respiratory assessment are priorities. Respiratory effort helps indicate worsening fatigue or improvement.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Apply oxygen as prescribed and assess respiratory status."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_33",
    "scenario": "A client receiving morphine becomes difficult to arouse and has respirations of 7/min.",
    "centerOptions": [
      "Opioid-induced respiratory depression",
      "Therapeutic sedation",
      "Panic attack",
      "Hypoglycemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory rate",
      "Bowel pattern",
      "Hair loss",
      "Urine odour"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Prepare naloxone and support respirations",
      "Administer another opioid dose",
      "Encourage sleep",
      "Offer water and reassess later"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A respiratory rate of 7/min after morphine indicates opioid-related respiratory depression. Naloxone may be required and respiratory support is the priority. Respiratory rate is the most important parameter to monitor.",
      "findings": "The correct monitoring parameter is Respiratory rate.",
      "actions": "The correct action is Prepare naloxone and support respirations."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_infectioncontrol_34",
    "scenario": "A client with pneumonia becomes increasingly confused. Temperature is 39.2 C, heart rate is 124/min, blood pressure is 82/48 mm Hg, and oxygen saturation is 88 percent.",
    "centerOptions": [
      "Sepsis",
      "Heart failure",
      "Hypoglycemia",
      "Migraine"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Bowel sounds",
      "Hair texture",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and begin sepsis-focused interventions per orders",
      "Offer oral fluids only and reassess later",
      "Assist with ambulation",
      "Provide a meal"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fever, tachycardia, hypotension, confusion, and infection suggest sepsis. Rapid treatment is essential to prevent progression to shock. Blood pressure is critical because worsening hypotension reflects poor perfusion.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the prescriber and begin sepsis-focused interventions per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_35",
    "scenario": "A client with COPD has severe dyspnea, accessory muscle use, and oxygen saturation of 80 percent on room air.",
    "centerOptions": [
      "Acute respiratory failure",
      "Appendicitis",
      "Urinary tract infection",
      "Hypoglycemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory effort",
      "Hair growth",
      "Bowel pattern",
      "Urine colour"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen as prescribed and escalate care immediately",
      "Encourage brisk walking",
      "Offer a meal tray",
      "Place the client flat"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Severe hypoxemia with accessory muscle use indicates major respiratory compromise and likely respiratory failure. Immediate oxygen and escalation are required. Respiratory effort is an important sign of fatigue and deterioration.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Apply oxygen as prescribed and escalate care immediately."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_cardiovascular_36",
    "scenario": "A postoperative client becomes pale, cool, and diaphoretic. Blood pressure is 76/44 mm Hg, pulse is 134/min, and urine output has dropped sharply.",
    "centerOptions": [
      "Hypovolemic shock",
      "Pneumonia",
      "Hypoglycemia",
      "Stroke"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Urine output",
      "Hair texture",
      "Bowel sounds",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and begin shock-focused interventions per orders",
      "Encourage oral fluids only",
      "Delay action until the next set of vital signs",
      "Assist the client to ambulate"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Pallor, hypotension, tachycardia, diaphoresis, and low urine output suggest hypovolemic shock. Urgent intervention is needed. Urine output is a major bedside marker of perfusion and treatment response.",
      "findings": "The correct monitoring parameter is Urine output.",
      "actions": "The correct action is Notify the prescriber and begin shock-focused interventions per orders."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_37",
    "scenario": "A client with chest trauma develops tracheal deviation, absent breath sounds on one side, and oxygen saturation of 82 percent.",
    "centerOptions": [
      "Tension pneumothorax",
      "Heartburn",
      "Appendicitis",
      "Urinary retention"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Hair pattern",
      "Bowel frequency",
      "Urine clarity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen and notify the prescriber immediately",
      "Encourage coughing only",
      "Offer food and fluids",
      "Place the client flat"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Tracheal deviation with absent unilateral breath sounds and severe hypoxemia indicates tension pneumothorax. This is a medical emergency. Oxygen saturation is the best immediate parameter to monitor.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Apply oxygen and notify the prescriber immediately."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_infectioncontrol_38",
    "scenario": "A client with dysuria and fever becomes hypotensive, tachycardic, and confused over several hours.",
    "centerOptions": [
      "Urosepsis",
      "Stable urinary tract infection",
      "Appendicitis",
      "Migraine"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Hair distribution",
      "Bowel sounds",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and initiate sepsis-focused care per orders",
      "Encourage independent ambulation",
      "Delay intervention until urine culture finalizes",
      "Offer cranberry juice only"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A urinary source of infection with hypotension, tachycardia, and confusion indicates urosepsis. Immediate escalation and treatment are required. Blood pressure is critical because shock may develop.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the prescriber and initiate sepsis-focused care per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_39",
    "scenario": "A client with acute asthma becomes drowsy. Wheezing is barely audible and oxygen saturation is 79 percent.",
    "centerOptions": [
      "Impending respiratory arrest",
      "Improving asthma attack",
      "Mild dehydration",
      "Heart failure"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory rate",
      "Hair growth",
      "Bowel pattern",
      "Urine odour"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen and call for immediate emergency assistance",
      "Encourage rest and reassess later",
      "Offer oral fluids",
      "Assist the client to the bathroom"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Drowsiness with minimal air movement and severe hypoxemia suggests impending respiratory arrest. Emergency escalation is required. Respiratory rate helps show further deterioration.",
      "findings": "The correct monitoring parameter is Respiratory rate.",
      "actions": "The correct action is Apply oxygen and call for immediate emergency assistance."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_cardiovascular_40",
    "scenario": "A client with GI bleeding is pale and weak. Blood pressure is 80/46 mm Hg and pulse is 130/min.",
    "centerOptions": [
      "Hypovolemic shock",
      "Pneumonia",
      "Hyperglycemia",
      "Heart failure"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Hair texture",
      "Bowel sounds",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and begin shock-focused interventions per orders",
      "Encourage oral fluids only",
      "Place the client in a shower",
      "Delay action until the next assessment time"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "GI bleeding with hypotension and tachycardia indicates hypovolemic shock. Immediate intervention is required. Blood pressure is one of the most important indicators of shock severity and response.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the prescriber and begin shock-focused interventions per orders."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_infectioncontrol_41",
    "scenario": "A client with pneumonia has fever, tachycardia, tachypnea, and blood pressure of 84/52 mm Hg.",
    "centerOptions": [
      "Septic shock",
      "Stable pneumonia",
      "Heartburn",
      "Urinary retention"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure or mean arterial pressure",
      "Hair growth",
      "Bowel frequency",
      "Urine colour only"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and begin urgent sepsis interventions per orders",
      "Encourage coughing only and reassess later",
      "Offer a snack tray",
      "Assist with ambulation"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Pneumonia with marked hypotension, fever, tachycardia, and tachypnea suggests septic shock. Immediate escalation is required. Blood pressure or MAP is key because perfusion is severely compromised.",
      "findings": "The correct monitoring parameter is Blood pressure or mean arterial pressure.",
      "actions": "The correct action is Notify the prescriber and begin urgent sepsis interventions per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_cardiovascular_42",
    "scenario": "A client has severe dyspnea, frothy sputum, crackles, and blood pressure of 190/102 mm Hg.",
    "centerOptions": [
      "Acute pulmonary edema",
      "Appendicitis",
      "Urinary tract infection",
      "Hypoglycemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Hair texture",
      "Bowel sounds",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Sit the client upright and apply oxygen",
      "Place the client flat and encourage fluids",
      "Offer food immediately",
      "Delay treatment until imaging is complete"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Frothy sputum and crackles with severe dyspnea suggest acute pulmonary edema. Upright positioning and oxygen are immediate priorities. Oxygen saturation is the best immediate monitoring target.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Sit the client upright and apply oxygen."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_safety_43",
    "scenario": "A client receiving a blood transfusion develops fever, chills, low back pain, and hypotension within minutes.",
    "centerOptions": [
      "Acute transfusion reaction",
      "Normal transfusion response",
      "Hypoglycemia",
      "Appendicitis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Bowel sounds",
      "Hair distribution",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Stop the transfusion and notify the prescriber immediately",
      "Slow the transfusion and continue monitoring",
      "Encourage oral fluids only",
      "Apply a heating pad to the back"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fever, chills, back pain, and hypotension during transfusion indicate a possible acute transfusion reaction. The transfusion must be stopped immediately. Blood pressure is important to monitor because circulatory collapse may occur.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Stop the transfusion and notify the prescriber immediately."
    },
    "bodySystem": "Safety",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_pharmacology_44",
    "scenario": "A client with anaphylaxis has wheezing, facial swelling, and blood pressure of 74/40 mm Hg after medication exposure.",
    "centerOptions": [
      "Distributive shock from anaphylaxis",
      "Heart failure",
      "Stable allergic rash",
      "Migraine"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Airway status",
      "Hair pattern",
      "Bowel frequency",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Call for emergency assistance and support airway and circulation",
      "Encourage oral fluids and continue observation",
      "Offer a meal tray",
      "Delay treatment until a rash appears"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Severe anaphylaxis can cause distributive shock with airway swelling and profound hypotension. Emergency treatment is required immediately. Airway status is the most urgent parameter to monitor.",
      "findings": "The correct monitoring parameter is Airway status.",
      "actions": "The correct action is Call for emergency assistance and support airway and circulation."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_infectioncontrol_45",
    "scenario": "A client with sepsis becomes increasingly confused and urine output drops to 8 mL in the last hour.",
    "centerOptions": [
      "Worsening organ hypoperfusion",
      "Normal recovery",
      "Appendicitis",
      "Mild dehydration only"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Urine output",
      "Hair texture",
      "Bowel sounds",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber and continue urgent sepsis management",
      "Encourage oral fluids and reassess tomorrow",
      "Assist with exercise",
      "Offer a high-potassium snack"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Falling urine output in sepsis suggests worsening organ hypoperfusion and possible shock. Immediate escalation is needed. Urine output is one of the best bedside indicators of renal perfusion.",
      "findings": "The correct monitoring parameter is Urine output.",
      "actions": "The correct action is Notify the prescriber and continue urgent sepsis management."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_respiratory_46",
    "scenario": "A client in respiratory distress becomes drowsy, has shallow respirations, and oxygen saturation remains 78 percent despite oxygen.",
    "centerOptions": [
      "Worsening respiratory failure",
      "Improving oxygenation",
      "Heartburn",
      "Appendicitis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Level of consciousness",
      "Hair growth",
      "Bowel frequency",
      "Urine colour"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Call for immediate emergency assistance and prepare for advanced airway support",
      "Reduce monitoring so the client can rest",
      "Encourage oral intake",
      "Assist with ambulation"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Persistent severe hypoxemia with drowsiness and shallow breathing indicates worsening respiratory failure. Advanced support may be needed. Level of consciousness is a sensitive sign of hypoxia and ventilation failure.",
      "findings": "The correct monitoring parameter is Level of consciousness.",
      "actions": "The correct action is Call for immediate emergency assistance and prepare for advanced airway support."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_rpn2_cardiovascular_47",
    "scenario": "A client with chest trauma has jugular venous distention, hypotension, and muffled heart sounds.",
    "centerOptions": [
      "Cardiac tamponade",
      "Appendicitis",
      "Pneumonia",
      "Urinary retention"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Hair texture",
      "Bowel sounds",
      "Urine odour"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the prescriber immediately and support oxygenation",
      "Encourage oral fluids",
      "Leave the client flat and unattended",
      "Offer a meal tray"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Jugular venous distention, hypotension, and muffled heart sounds are classic for cardiac tamponade. This is life threatening and requires rapid escalation. Blood pressure helps monitor worsening compromise in cardiac output.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the prescriber immediately and support oxygenation."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  }
];
