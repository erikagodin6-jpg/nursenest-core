import type { BowtieQuestion } from "./types";

export const pnUsBowtieBatch01Questions: BowtieQuestion[] = [
  {
    "id": "bt_pnus_cardiovascular_0",
    "scenario": "A 68-year-old client with a history of heart failure reports sudden shortness of breath while lying flat. The client has crackles in both lung bases and an oxygen saturation of 88 percent.",
    "centerOptions": [
      "Pulmonary edema",
      "Pneumonia",
      "Asthma exacerbation",
      "Pulmonary embolism"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Bowel sounds",
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
      "Assist with ambulation",
      "Place the client flat"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Heart failure can cause pulmonary edema, leading to fluid accumulation in the lungs, crackles, orthopnea, and hypoxemia. The priority action is to improve oxygenation. Monitoring oxygen saturation best evaluates respiratory status and treatment response.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Administer oxygen."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_endocrine_1",
    "scenario": "A client with type 1 diabetes becomes shaky, diaphoretic, and confused. The bedside blood glucose is 52 mg/dL.",
    "centerOptions": [
      "Hypoglycemia",
      "Diabetic ketoacidosis",
      "Hyperglycemia",
      "Stroke"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood glucose level",
      "Urine color",
      "Bowel sounds",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Give 15 g of fast-acting carbohydrate",
      "Administer regular insulin",
      "Encourage exercise",
      "Restrict oral intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "The symptoms and low glucose value indicate hypoglycemia. The priority is to rapidly raise the blood sugar if the client is conscious and can swallow. Monitoring blood glucose confirms improvement and guides further treatment.",
      "findings": "The correct monitoring parameter is Blood glucose level.",
      "actions": "The correct action is Give 15 g of fast-acting carbohydrate."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_2",
    "scenario": "A postoperative client develops sudden shortness of breath, chest pain, and tachycardia after being on bed rest for two days.",
    "centerOptions": [
      "Pulmonary embolism",
      "Pneumonia",
      "Hypoglycemia",
      "Heartburn"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Abdominal girth",
      "Bowel sounds",
      "Hair texture"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Apply oxygen",
      "Encourage coughing and deep breathing only",
      "Offer a meal tray",
      "Place a heating pad on the chest"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden dyspnea and chest pain after immobility strongly suggest pulmonary embolism. The immediate nursing priority is supporting oxygenation. Oxygen saturation is the most relevant parameter to monitor for rapid deterioration.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Apply oxygen."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pediatrics_3",
    "scenario": "A child with asthma has severe wheezing, retractions, and difficulty speaking in full sentences. Oxygen saturation is 86 percent.",
    "centerOptions": [
      "Acute asthma exacerbation",
      "Croup",
      "Pneumonia",
      "Heart failure"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory effort",
      "Bowel pattern",
      "Urine odor",
      "Skin pigmentation"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Administer a bronchodilator",
      "Give a laxative",
      "Encourage running to open the lungs",
      "Offer milk"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "This child shows signs of severe bronchospasm and respiratory distress. A bronchodilator is the priority treatment to relieve airway narrowing. Respiratory effort best reflects whether the client is improving or tiring.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Administer a bronchodilator."
    },
    "bodySystem": "Pediatrics",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_4",
    "scenario": "A client taking warfarin reports black tarry stools and new bruising on the arms.",
    "centerOptions": [
      "Anticoagulant-related bleeding",
      "Dehydration",
      "Pneumonia",
      "Hypoglycemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "INR",
      "Bowel sounds",
      "Urine specific gravity",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the provider and hold further doses as ordered",
      "Encourage more leafy greens immediately",
      "Administer aspirin",
      "Apply heat to the abdomen"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Black tarry stools and bruising suggest bleeding while on warfarin. The provider must be notified and the anticoagulant may need to be held depending on orders and protocol. INR is the key parameter for monitoring warfarin effect.",
      "findings": "The correct monitoring parameter is INR.",
      "actions": "The correct action is Notify the provider and hold further doses as ordered."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_fluidandelectrolytes_5",
    "scenario": "A client with chronic kidney disease has generalized weakness. Laboratory results show potassium 6.1 mEq/L.",
    "centerOptions": [
      "Hyperkalemia",
      "Hyponatremia",
      "Hypoglycemia",
      "Hypocalcemia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Cardiac rhythm",
      "Bowel pattern",
      "Hair loss",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Place the client on cardiac monitoring",
      "Offer a banana",
      "Encourage deep breathing only",
      "Restrict all fluids permanently"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A potassium of 6.1 mEq/L is dangerously high and can cause life-threatening dysrhythmias. The priority is cardiac monitoring and urgent treatment. Cardiac rhythm is the most important parameter because hyperkalemia primarily threatens electrical conduction.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Place the client on cardiac monitoring."
    },
    "bodySystem": "Fluid and Electrolytes",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_maternal_6",
    "scenario": "A postpartum client saturates a perineal pad in 15 minutes and appears pale and dizzy.",
    "centerOptions": [
      "Postpartum hemorrhage",
      "Urinary tract infection",
      "Normal lochia",
      "Mastitis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Blood pressure",
      "Visual acuity",
      "Bowel sounds",
      "Hair texture"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Assess the fundus and call for help",
      "Encourage breastfeeding first",
      "Offer a high-fiber snack",
      "Place the client in a warm shower"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Heavy vaginal bleeding with pallor and dizziness suggests postpartum hemorrhage. The nurse should quickly assess uterine tone and obtain help because this is life threatening. Blood pressure is a critical indicator of hemodynamic instability.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Assess the fundus and call for help."
    },
    "bodySystem": "Maternal",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_7",
    "scenario": "A client has fever, productive cough, crackles, and oxygen saturation of 89 percent on room air.",
    "centerOptions": [
      "Pneumonia",
      "Stroke",
      "Hypoglycemia",
      "Deep vein thrombosis"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Respiratory status",
      "Hair growth",
      "Abdominal girth",
      "Bowel frequency"
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
      "condition": "Fever, productive cough, crackles, and low oxygen saturation are classic findings of pneumonia. The immediate nursing action is to improve oxygenation. Monitoring respiratory status shows whether the client is stabilizing or worsening.",
      "findings": "The correct monitoring parameter is Respiratory status.",
      "actions": "The correct action is Apply oxygen as prescribed."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_neurology_8",
    "scenario": "A client suddenly develops facial droop, slurred speech, and weakness of the right arm.",
    "centerOptions": [
      "Stroke",
      "Migraine",
      "Appendicitis",
      "Pneumonia"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Neurological status",
      "Hair loss",
      "Bowel sounds",
      "Urine color"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Activate stroke protocol",
      "Give oral pain medication",
      "Encourage the client to sleep",
      "Provide a meal tray"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden focal neurological deficits strongly indicate stroke. Early activation of the stroke pathway is essential because treatment is time sensitive. Neurological status must be closely monitored for progression or improvement.",
      "findings": "The correct monitoring parameter is Neurological status.",
      "actions": "The correct action is Activate stroke protocol."
    },
    "bodySystem": "Neurology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_endocrine_9",
    "scenario": "A client with diabetes has fruity breath, deep rapid respirations, and blood glucose of 420 mg/dL.",
    "centerOptions": [
      "Diabetic ketoacidosis",
      "Hypoglycemia",
      "Heart failure",
      "Asthma"
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
      "Notify the provider and begin ordered fluid replacement",
      "Give fast-acting carbohydrate",
      "Encourage ambulation",
      "Apply a heating pad"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fruity breath, Kussmaul respirations, and marked hyperglycemia indicate diabetic ketoacidosis. The client needs urgent treatment with fluids and insulin per orders. Blood glucose is one of the essential parameters to monitor during treatment.",
      "findings": "The correct monitoring parameter is Blood glucose.",
      "actions": "The correct action is Notify the provider and begin ordered fluid replacement."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_10",
    "scenario": "A client taking digoxin reports nausea, poor appetite, and seeing yellow halos around lights. The apical pulse is 52/min.",
    "centerOptions": [
      "Digoxin toxicity",
      "Hypoglycemia",
      "Heart failure improvement",
      "Acute asthma exacerbation"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Apical pulse",
      "Bowel sounds",
      "Hair texture",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Hold the digoxin and notify the provider",
      "Administer the scheduled dose with food",
      "Encourage ambulation",
      "Give a potassium-wasting diuretic"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Nausea, visual disturbances, and bradycardia are classic signs of digoxin toxicity. The medication should be held and the provider notified. The apical pulse is the most important parameter to monitor before administration because digoxin slows cardiac conduction.",
      "findings": "The correct monitoring parameter is Apical pulse.",
      "actions": "The correct action is Hold the digoxin and notify the provider."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_11",
    "scenario": "A client taking warfarin reports black tarry stools and bleeding gums while brushing teeth.",
    "centerOptions": [
      "Warfarin-related bleeding",
      "Hypoglycemia",
      "Normal medication effect",
      "Dehydration"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "INR",
      "Bowel sounds",
      "Hair growth",
      "Urine specific gravity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the provider and hold further doses as ordered",
      "Administer aspirin for discomfort",
      "Encourage a double dose tomorrow",
      "Offer vitamin K-rich foods only and reassess next week"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Black stools and bleeding gums suggest anticoagulant-related bleeding. The provider must be notified and warfarin may need to be held depending on orders and protocol. INR is the key laboratory value for monitoring warfarin therapy.",
      "findings": "The correct monitoring parameter is INR.",
      "actions": "The correct action is Notify the provider and hold further doses as ordered."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_12",
    "scenario": "A client who received regular insulin at 0730 becomes shaky, diaphoretic, and anxious at 1000. The client is awake and able to swallow.",
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
      "Hair distribution",
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
      "Restrict oral intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "The timing and symptoms are consistent with insulin-related hypoglycemia. A conscious client who can swallow should receive fast-acting carbohydrate promptly. Blood glucose should then be reassessed to confirm improvement.",
      "findings": "The correct monitoring parameter is Blood glucose level.",
      "actions": "The correct action is Give 15 g of fast-acting carbohydrate."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_13",
    "scenario": "A client taking furosemide reports weakness and muscle cramps. Laboratory results show potassium 2.9 mEq/L.",
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
      "Notify the provider and anticipate potassium replacement",
      "Offer a potassium-wasting medication",
      "Administer the next dose early",
      "Restrict all oral intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Furosemide can cause potassium loss, leading to muscle cramps, weakness, and dysrhythmias. The low potassium value confirms hypokalemia. Cardiac rhythm must be monitored because hypokalemia affects electrical conduction.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Notify the provider and anticipate potassium replacement."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_14",
    "scenario": "A client receives morphine IV for severe pain. Fifteen minutes later the client is difficult to arouse and respirations are 7/min.",
    "centerOptions": [
      "Opioid-induced respiratory depression",
      "Therapeutic pain control",
      "Panic attack",
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
      "Prepare to administer naloxone and support respirations",
      "Give another dose of morphine",
      "Encourage the client to sleep",
      "Offer oral fluids"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Marked sedation with respirations of 7/min after morphine indicates opioid toxicity. Naloxone may be needed and respiratory support is the priority. Respiratory rate is the key parameter to monitor with opioid administration.",
      "findings": "The correct monitoring parameter is Respiratory rate.",
      "actions": "The correct action is Prepare to administer naloxone and support respirations."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_15",
    "scenario": "A client starts an IV antibiotic and immediately develops facial swelling, stridor, and hypotension.",
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
      "Hair distribution",
      "Urine color"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Stop the infusion and call for emergency help",
      "Slow the infusion and observe",
      "Encourage oral fluids",
      "Reassure the client and continue the medication"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Facial swelling, stridor, and hypotension after a medication exposure indicate anaphylaxis. The infusion must be stopped and emergency management started immediately. Airway status is the most critical parameter to monitor because obstruction can progress rapidly.",
      "findings": "The correct monitoring parameter is Airway status.",
      "actions": "The correct action is Stop the infusion and call for emergency help."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_16",
    "scenario": "A client taking metoprolol reports dizziness. The heart rate is 48/min and blood pressure is 90/54 mm Hg.",
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
      "Hair texture",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Hold the medication and notify the provider",
      "Administer the next dose with food",
      "Encourage exercise",
      "Give a stimulant beverage and reassess later"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Metoprolol can cause bradycardia and hypotension. A heart rate of 48/min with dizziness is unsafe, so the medication should be held and the provider notified. Heart rate is the key parameter to monitor before administration.",
      "findings": "The correct monitoring parameter is Heart rate.",
      "actions": "The correct action is Hold the medication and notify the provider."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_17",
    "scenario": "A client taking lisinopril develops lip swelling and difficulty swallowing shortly after the morning dose.",
    "centerOptions": [
      "ACE inhibitor angioedema",
      "Mild nausea",
      "Expected cough only",
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
      "Apply a warm compress to the neck"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Lip swelling and difficulty swallowing after an ACE inhibitor suggest angioedema, which can compromise the airway. The medication should be stopped and emergency care obtained. Airway patency is the most urgent parameter to monitor.",
      "findings": "The correct monitoring parameter is Airway patency.",
      "actions": "The correct action is Hold the medication and seek emergency evaluation."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_18",
    "scenario": "A client prescribed albuterol uses the inhaler and then reports palpitations and mild hand tremors.",
    "centerOptions": [
      "Expected bronchodilator side effect",
      "Anaphylaxis",
      "Opioid toxicity",
      "Stroke"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Heart rate",
      "Bowel sounds",
      "Hair texture",
      "Urine output only"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Reassess the client and continue monitoring",
      "Administer naloxone",
      "Hold all future inhalers permanently without an order",
      "Encourage bed rest and restrict breathing treatments"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Albuterol commonly causes transient tremors and palpitations because of beta-adrenergic stimulation. The client should be reassessed and monitored rather than assumed to be in a severe emergency. Heart rate is the most relevant parameter to monitor.",
      "findings": "The correct monitoring parameter is Heart rate.",
      "actions": "The correct action is Reassess the client and continue monitoring."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_19",
    "scenario": "A client taking long-term prednisone reports black stools and burning epigastric pain.",
    "centerOptions": [
      "Corticosteroid-related gastrointestinal bleeding",
      "Hyperkalemia",
      "Hypoglycemia",
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
      "Notify the provider and assess for bleeding",
      "Encourage aspirin use for the pain",
      "Administer another steroid dose immediately",
      "Offer a high-fibre snack only"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Long-term corticosteroid use can increase the risk of gastric irritation and bleeding. Black stools and epigastric pain are concerning findings. The provider should be notified and bleeding assessed. Stool appearance is a key monitoring parameter here.",
      "findings": "The correct monitoring parameter is Stool appearance.",
      "actions": "The correct action is Notify the provider and assess for bleeding."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_cardiovascular_20",
    "scenario": "A 72-year-old client with chronic heart failure develops severe shortness of breath, crackles throughout both lungs, and pink frothy sputum. Oxygen saturation is 84 percent.",
    "centerOptions": [
      "Pulmonary edema",
      "Pneumonia",
      "Asthma exacerbation",
      "Pulmonary embolism"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Oxygen saturation",
      "Bowel sounds",
      "Hair texture",
      "Pupil size"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Administer oxygen and elevate the head of the bed",
      "Encourage oral fluids",
      "Place the client flat",
      "Assist with ambulation"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Pink frothy sputum, diffuse crackles, and severe hypoxemia strongly indicate pulmonary edema. Oxygen and upright positioning improve gas exchange and reduce work of breathing. Oxygen saturation is the most relevant parameter to monitor for immediate response.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Administer oxygen and elevate the head of the bed."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_endocrine_21",
    "scenario": "A client with type 2 diabetes becomes confused, sweaty, and shaky while waiting for lunch. Bedside glucose is 49 mg/dL.",
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
      "Restrict all oral intake",
      "Encourage immediate exercise"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "The symptoms and glucose level indicate hypoglycemia. If the client is conscious and can swallow, fast-acting carbohydrate is the priority treatment. Blood glucose monitoring confirms whether treatment is effective.",
      "findings": "The correct monitoring parameter is Blood glucose.",
      "actions": "The correct action is Give 15 g of fast-acting carbohydrate."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_22",
    "scenario": "A client who had abdominal surgery 2 days ago suddenly reports chest pain and severe shortness of breath. The heart rate is 128/min and oxygen saturation is 86 percent.",
    "centerOptions": [
      "Pulmonary embolism",
      "Pneumonia",
      "Appendicitis",
      "Heartburn"
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
      "Apply oxygen and notify the provider immediately",
      "Encourage coughing and deep breathing only",
      "Offer a meal tray",
      "Apply a warm compress to the chest"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden dyspnea and chest pain after surgery suggest pulmonary embolism, especially with tachycardia and hypoxemia. Oxygen support and urgent provider notification are priorities. Oxygen saturation is a key marker of deterioration.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Apply oxygen and notify the provider immediately."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pediatrics_23",
    "scenario": "A child with asthma has retractions, wheezing, and difficulty speaking in full sentences. Oxygen saturation is 85 percent.",
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
      "Urine color",
      "Hair texture"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Administer a bronchodilator immediately",
      "Encourage running to expand the lungs",
      "Offer solid food",
      "Delay treatment and reassess in 1 hour"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Retractions, wheezing, inability to speak normally, and low oxygen saturation indicate significant bronchospasm and respiratory distress. Immediate bronchodilator therapy is appropriate. Respiratory effort shows whether the child is improving or tiring.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Administer a bronchodilator immediately."
    },
    "bodySystem": "Pediatrics",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_24",
    "scenario": "A client with fever, productive cough, crackles, and oxygen saturation of 87 percent on room air is admitted from the emergency department.",
    "centerOptions": [
      "Pneumonia",
      "Stroke",
      "Deep vein thrombosis",
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
      "condition": "Fever, productive cough, crackles, and low oxygen saturation support pneumonia with impaired gas exchange. Oxygen is a priority intervention. Respiratory status is the best parameter to monitor for improvement or deterioration.",
      "findings": "The correct monitoring parameter is Respiratory status.",
      "actions": "The correct action is Apply oxygen as prescribed."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_neurology_25",
    "scenario": "A client suddenly develops facial droop, slurred speech, and weakness in the left arm while eating lunch.",
    "centerOptions": [
      "Stroke",
      "Migraine",
      "Hypoglycemia",
      "Appendicitis"
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
      "Activate stroke protocol immediately",
      "Offer oral fluids and reassess later",
      "Encourage the client to rest",
      "Administer a laxative"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Sudden focal neurological deficits strongly suggest stroke. Rapid evaluation is essential because treatment is time sensitive. Neurological status monitoring helps identify progression or improvement.",
      "findings": "The correct monitoring parameter is Neurological status.",
      "actions": "The correct action is Activate stroke protocol immediately."
    },
    "bodySystem": "Neurology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_maternal_26",
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
      "Encourage the client to ambulate",
      "Offer a high-fibre meal",
      "Delay assessment until the next set of vital signs"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Rapidly saturating a pad with pallor and dizziness is consistent with postpartum hemorrhage. Fundal assessment and urgent escalation are priorities. Blood pressure is critical to monitor for hemodynamic instability.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Assess the fundus and call for immediate help."
    },
    "bodySystem": "Maternal",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_fluidandelectrolytes_27",
    "scenario": "A client with chronic kidney disease reports palpitations and weakness. Potassium is 6.4 mEq/L.",
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
      "Provide a high-potassium snack"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A potassium of 6.4 mEq/L is severe hyperkalemia and may cause life-threatening dysrhythmias. Cardiac monitoring is a priority. Cardiac rhythm is the most important parameter to observe.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Place the client on cardiac monitoring."
    },
    "bodySystem": "Fluid and Electrolytes",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_28",
    "scenario": "A client receiving IV antibiotics suddenly develops stridor, facial swelling, and hypotension.",
    "centerOptions": [
      "Anaphylaxis",
      "Expected medication side effect",
      "Hypoglycemia",
      "Heart failure"
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
      "Slow the infusion and continue monitoring",
      "Encourage oral fluids",
      "Ask the client to rest quietly and wait"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Stridor, facial swelling, and hypotension after a medication exposure indicate anaphylaxis. The infusion must be stopped immediately and emergency treatment initiated. Airway status is the most critical parameter to monitor.",
      "findings": "The correct monitoring parameter is Airway status.",
      "actions": "The correct action is Stop the infusion and call for emergency assistance."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_endocrine_29",
    "scenario": "A client with diabetes has deep rapid respirations, fruity breath, and blood glucose of 428 mg/dL.",
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
      "Notify the provider and begin ordered fluid replacement",
      "Give fast-acting carbohydrate",
      "Encourage exercise",
      "Restrict all oral intake"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fruity breath, Kussmaul respirations, and marked hyperglycemia indicate diabetic ketoacidosis. The client needs urgent treatment, including fluids and insulin per orders. Blood glucose is a key monitoring parameter.",
      "findings": "The correct monitoring parameter is Blood glucose.",
      "actions": "The correct action is Notify the provider and begin ordered fluid replacement."
    },
    "bodySystem": "Endocrine",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_infectioncontrol_30",
    "scenario": "A client with fever, hypotension, tachycardia, and increasing confusion is admitted from a long-term care facility.",
    "centerOptions": [
      "Sepsis",
      "Hypoglycemia",
      "Stroke",
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
      "Notify the provider and begin sepsis-focused interventions per orders",
      "Offer a meal tray",
      "Encourage independent ambulation",
      "Delay action until morning rounds"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fever, hypotension, tachycardia, and confusion strongly suggest sepsis with systemic compromise. Rapid escalation and early treatment are essential. Blood pressure is critical to monitor due to shock risk.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the provider and begin sepsis-focused interventions per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_cardiovascular_31",
    "scenario": "A client with chest pain states the pain feels heavy and radiates to the left arm. The client is diaphoretic and anxious.",
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
      "Obtain immediate assessment and notify the provider",
      "Offer a high-fibre snack",
      "Encourage the client to walk",
      "Delay intervention until the next medication pass"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Heavy chest pain radiating to the arm with diaphoresis suggests myocardial infarction. Immediate assessment and escalation are required. Cardiac rhythm is essential to monitor due to dysrhythmia risk.",
      "findings": "The correct monitoring parameter is Cardiac rhythm.",
      "actions": "The correct action is Obtain immediate assessment and notify the provider."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_32",
    "scenario": "A client with COPD has increasing dyspnea, accessory muscle use, and oxygen saturation of 83 percent on room air.",
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
      "Encourage a brisk walk",
      "Offer a large meal",
      "Place the client flat"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Accessory muscle use, dyspnea, and low oxygen saturation indicate COPD exacerbation with impaired gas exchange. Oxygen and rapid respiratory assessment are priorities. Respiratory effort helps determine whether the client is worsening.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Apply oxygen as prescribed and assess respiratory status."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_33",
    "scenario": "A client receiving morphine becomes difficult to arouse and has respirations of 8/min.",
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
      "Offer water and reassess later"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Marked sedation and a respiratory rate of 8/min after morphine indicate opioid-related respiratory depression. Naloxone may be needed and respiratory support is the priority. Respiratory rate is the key parameter to monitor.",
      "findings": "The correct monitoring parameter is Respiratory rate.",
      "actions": "The correct action is Prepare naloxone and support respirations."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_neurology_34",
    "scenario": "A client with a history of seizures suddenly stiffens, loses consciousness, and begins generalized jerking movements.",
    "centerOptions": [
      "Generalized tonic-clonic seizure",
      "Stroke",
      "Migraine",
      "Panic attack"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Duration of seizure activity",
      "Hair texture",
      "Bowel frequency",
      "Visual acuity"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Protect the client from injury and maintain airway safety",
      "Insert an object into the mouth",
      "Hold the client down forcefully",
      "Encourage the client to stand up"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "The scenario describes a generalized tonic-clonic seizure. The priority is safety and airway protection. The duration of the seizure is important because prolonged seizures require urgent escalation.",
      "findings": "The correct monitoring parameter is Duration of seizure activity.",
      "actions": "The correct action is Protect the client from injury and maintain airway safety."
    },
    "bodySystem": "Neurology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_infectioncontrol_35",
    "scenario": "A client with pneumonia becomes increasingly confused. Temperature is 39.4 C, heart rate is 126/min, blood pressure is 84/50 mm Hg, and oxygen saturation is 89 percent on room air.",
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
      "Notify the provider and begin sepsis-focused interventions per orders",
      "Offer oral fluids only and reassess in 2 hours",
      "Assist the client to ambulate",
      "Provide a high-fibre meal"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fever, hypotension, tachycardia, confusion, and suspected infection strongly suggest sepsis. Rapid escalation and treatment are essential to prevent septic shock and organ dysfunction. Blood pressure is a critical parameter because worsening hypotension reflects circulatory collapse.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the provider and begin sepsis-focused interventions per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_36",
    "scenario": "A client with a history of COPD has severe dyspnea, accessory muscle use, and an oxygen saturation of 81 percent on room air.",
    "centerOptions": [
      "Acute respiratory failure",
      "Urinary tract infection",
      "Appendicitis",
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
      "Encourage the client to walk in the hallway",
      "Offer a meal tray",
      "Place the client flat in bed"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Severe hypoxemia, accessory muscle use, and marked dyspnea indicate impending or actual respiratory failure. Immediate oxygen support and urgent escalation are required. Respiratory effort helps determine whether the client is tiring and deteriorating further.",
      "findings": "The correct monitoring parameter is Respiratory effort.",
      "actions": "The correct action is Apply oxygen as prescribed and escalate care immediately."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_cardiovascular_37",
    "scenario": "A postoperative client becomes pale, cool, and diaphoretic. Blood pressure is 78/46 mm Hg, pulse is 132/min, and urine output has dropped sharply.",
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
      "Notify the provider and begin shock-focused interventions per orders",
      "Encourage ambulation",
      "Offer clear fluids only",
      "Delay action until morning rounds"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Pallor, hypotension, tachycardia, diaphoresis, and low urine output suggest hypovolemic shock, likely from fluid or blood loss. Rapid intervention is critical. Urine output is an important perfusion indicator and helps monitor response to treatment.",
      "findings": "The correct monitoring parameter is Urine output.",
      "actions": "The correct action is Notify the provider and begin shock-focused interventions per orders."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_38",
    "scenario": "A client with chest trauma develops tracheal deviation, absent breath sounds on one side, severe dyspnea, and oxygen saturation of 83 percent.",
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
      "Apply oxygen and notify the provider immediately",
      "Encourage coughing and deep breathing only",
      "Offer food and fluids",
      "Place the client flat"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Tracheal deviation, absent unilateral breath sounds, and severe respiratory distress indicate tension pneumothorax, a life-threatening emergency. Immediate oxygen and urgent escalation are required. Oxygen saturation is a key indicator of deterioration.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Apply oxygen and notify the provider immediately."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_infectioncontrol_39",
    "scenario": "A client with fever and dysuria becomes hypotensive, tachycardic, and confused over several hours.",
    "centerOptions": [
      "Urosepsis",
      "Appendicitis",
      "Stable urinary tract infection",
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
      "Notify the provider and initiate sepsis-focused care per orders",
      "Encourage independent ambulation",
      "Delay intervention until culture results return",
      "Offer cranberry juice only"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A client with a urinary source of infection who develops hypotension, tachycardia, and confusion is showing signs of urosepsis. Rapid treatment is necessary. Blood pressure is crucial because septic shock can develop quickly.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the provider and initiate sepsis-focused care per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_40",
    "scenario": "A client with acute asthma suddenly becomes drowsy and the wheezing is barely audible. Oxygen saturation is 80 percent.",
    "centerOptions": [
      "Impending respiratory arrest",
      "Improving asthma attack",
      "Mild dehydration",
      "Urinary tract infection"
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
      "Encourage the client to rest quietly and wait",
      "Offer oral fluids",
      "Assist the client to the bathroom"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "A drowsy client with minimal air movement and severe hypoxemia is at risk for respiratory arrest. This is not improvement. Emergency escalation and oxygen support are required. Respiratory rate is critical to monitor because deterioration may be rapid.",
      "findings": "The correct monitoring parameter is Respiratory rate.",
      "actions": "The correct action is Apply oxygen and call for immediate emergency assistance."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_cardiovascular_41",
    "scenario": "A client with GI bleeding is pale and weak. The blood pressure is 82/48 mm Hg and the pulse is 128/min.",
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
      "Notify the provider and begin shock-focused interventions per orders",
      "Encourage oral fluids only",
      "Place the client in a shower",
      "Delay action until the next vital signs check"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Active or recent GI bleeding with hypotension and tachycardia suggests hypovolemic shock. Immediate intervention is needed to support circulation. Blood pressure is a core marker of shock severity and response to treatment.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the provider and begin shock-focused interventions per orders."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_infectioncontrol_42",
    "scenario": "A client with pneumonia has a temperature of 39.1 C, respiratory rate of 30/min, heart rate of 122/min, and blood pressure of 86/54 mm Hg.",
    "centerOptions": [
      "Septic shock",
      "Stable pneumonia",
      "Heartburn",
      "Urinary retention"
    ],
    "centerCorrect": 0,
    "leftFindings": [
      "Mean arterial pressure or blood pressure",
      "Hair growth",
      "Bowel frequency",
      "Urine colour only"
    ],
    "leftCorrect": [
      0
    ],
    "leftSelectCount": 1,
    "rightActions": [
      "Notify the provider and begin urgent sepsis interventions per orders",
      "Encourage coughing only and reassess later",
      "Offer a snack tray",
      "Assist with ambulation"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Pneumonia with fever, tachycardia, tachypnea, and hypotension suggests septic shock. Immediate escalation is required. Blood pressure or MAP is a key monitoring parameter because perfusion is critically threatened.",
      "findings": "The correct monitoring parameter is Mean arterial pressure or blood pressure.",
      "actions": "The correct action is Notify the provider and begin urgent sepsis interventions per orders."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_cardiovascular_43",
    "scenario": "A client has severe dyspnea, frothy sputum, crackles, and a blood pressure of 188/100 mm Hg.",
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
      "Delay treatment until a chest x-ray is available"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Frothy sputum and crackles with severe dyspnea indicate acute pulmonary edema. Upright positioning and oxygen are immediate priorities to improve gas exchange. Oxygen saturation best reflects immediate respiratory status.",
      "findings": "The correct monitoring parameter is Oxygen saturation.",
      "actions": "The correct action is Sit the client upright and apply oxygen."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_safety_44",
    "scenario": "A client receiving a blood transfusion develops fever, chills, low back pain, and hypotension within minutes of initiation.",
    "centerOptions": [
      "Acute transfusion reaction",
      "Normal response to transfusion",
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
      "Stop the transfusion and notify the provider immediately",
      "Slow the transfusion and continue monitoring",
      "Encourage oral fluids only",
      "Apply a heating pad to the back"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Fever, chills, back pain, and hypotension during transfusion indicate a likely acute transfusion reaction. The transfusion must be stopped immediately and the provider notified. Blood pressure is important to monitor because circulatory collapse may occur.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Stop the transfusion and notify the provider immediately."
    },
    "bodySystem": "Safety",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_pharmacology_45",
    "scenario": "A client with anaphylaxis has wheezing, facial swelling, and a blood pressure of 76/42 mm Hg after a medication exposure.",
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
      "condition": "Severe anaphylaxis can cause distributive shock with airway swelling and hypotension. Emergency management is required immediately. Airway status is the most urgent monitoring priority.",
      "findings": "The correct monitoring parameter is Airway status.",
      "actions": "The correct action is Call for emergency assistance and support airway and circulation."
    },
    "bodySystem": "Pharmacology",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_infectioncontrol_46",
    "scenario": "A client with sepsis becomes increasingly confused and urine output falls to 10 mL over the last hour.",
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
      "Notify the provider and continue urgent sepsis management",
      "Encourage oral fluids and reassess tomorrow",
      "Assist with exercise",
      "Offer a high-potassium snack"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Reduced urine output in sepsis suggests poor renal perfusion and worsening shock. Urgent escalation is necessary. Urine output is one of the best bedside indicators of organ perfusion.",
      "findings": "The correct monitoring parameter is Urine output.",
      "actions": "The correct action is Notify the provider and continue urgent sepsis management."
    },
    "bodySystem": "Infection Control",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_respiratory_47",
    "scenario": "A client with respiratory distress has increasing drowsiness, shallow respirations, and oxygen saturation of 79 percent despite oxygen.",
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
      "Reduce monitoring to let the client rest",
      "Encourage oral intake",
      "Assist with hallway ambulation"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Drowsiness, shallow respirations, and persistent severe hypoxemia indicate worsening respiratory failure. Immediate escalation and likely airway support are needed. Level of consciousness is a key marker of hypoxia and ventilation failure.",
      "findings": "The correct monitoring parameter is Level of consciousness.",
      "actions": "The correct action is Call for immediate emergency assistance and prepare for advanced airway support."
    },
    "bodySystem": "Respiratory",
    "tier": "rpn"
  },
  {
    "id": "bt_pnus_cardiovascular_48",
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
      "Notify the provider immediately and support oxygenation",
      "Encourage oral fluids",
      "Place the client flat and unattended",
      "Offer a meal tray"
    ],
    "rightCorrect": [
      0
    ],
    "rightSelectCount": 1,
    "rationale": {
      "condition": "Jugular venous distention, hypotension, and muffled heart sounds are classic for cardiac tamponade. This is a life-threatening emergency requiring immediate escalation. Blood pressure is important to monitor because tamponade impairs cardiac output.",
      "findings": "The correct monitoring parameter is Blood pressure.",
      "actions": "The correct action is Notify the provider immediately and support oxygenation."
    },
    "bodySystem": "Cardiovascular",
    "tier": "rpn"
  }
];
