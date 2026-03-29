import type { ExamQuestion } from "./types";

export const rpnExpansionFQuestions: ExamQuestion[] = [
  {
    q: "A nurse is monitoring a client with heart failure who is receiving furosemide (Lasix) 40 mg IV daily. Which laboratory value should the nurse report to the healthcare provider immediately?",
    o: ["Potassium 2.9 mEq/L", "Sodium 139 mEq/L", "Chloride 101 mEq/L", "Calcium 9.2 mg/dL"],
    a: 0,
    r: "Furosemide is a loop diuretic that causes significant potassium loss. A potassium level of 2.9 mEq/L is critically low (normal 3.5–5.0 mEq/L) and increases the risk of life-threatening cardiac dysrhythmias. The nurse must report this immediately and anticipate potassium replacement. The other values are within normal limits.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with chronic obstructive pulmonary disease (COPD) who is on continuous oxygen at 2 L/min via nasal cannula. The client's oxygen saturation drops to 85%. What should the nurse do first?",
    o: ["Assess the client's respiratory status, including breath sounds and work of breathing", "Increase the oxygen flow rate to 10 L/min immediately", "Discontinue the oxygen and reposition the client", "Administer a bronchodilator without further assessment"],
    a: 0,
    r: "Before changing any intervention, the nurse must assess the client's current respiratory status to determine the cause of desaturation. In COPD clients, increasing oxygen too rapidly can suppress the hypoxic drive and worsen respiratory failure. Assessment guides appropriate intervention. Discontinuing oxygen with low saturation is unsafe. A bronchodilator may be indicated but requires assessment first.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with type 2 diabetes who reports feeling shaky, diaphoretic, and anxious. The client's blood glucose is 3.1 mmol/L. What is the nurse's priority action?",
    o: ["Administer 15 g of a fast-acting carbohydrate such as 125 mL of juice", "Administer the client's scheduled insulin dose", "Encourage the client to eat a full meal", "Notify the healthcare provider before taking any action"],
    a: 0,
    r: "A blood glucose of 3.1 mmol/L indicates hypoglycaemia. The nurse should follow the 15-15 rule: administer 15 g of fast-acting carbohydrate, wait 15 minutes, and recheck the glucose. Administering insulin would worsen the hypoglycaemia. A full meal takes too long to raise blood glucose. While the provider should be notified, treating the hypoglycaemia is the immediate priority.",
    s: "Endocrine"
  },
  {
    q: "A nurse is providing discharge teaching to a client prescribed warfarin (Coumadin). Which client statement indicates understanding of the medication?",
    o: ["I should have my INR checked regularly and watch for signs of unusual bleeding", "I can take ibuprofen for headaches since it does not interact with warfarin", "I should eat as much green leafy vegetables as possible for nutrition", "I only need to take warfarin when I feel blood clots forming"],
    a: 0,
    r: "Warfarin requires regular INR monitoring (target 2.0–3.0 for most indications) and vigilance for bleeding signs. Ibuprofen increases bleeding risk and should be avoided. Green leafy vegetables contain vitamin K, which antagonises warfarin; intake should be consistent, not increased. Warfarin must be taken daily as prescribed, not symptom-based.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for an older adult client in a long-term care facility who has been increasingly confused over the past 24 hours. The client was previously alert and oriented. What should the nurse assess first?",
    o: ["Check for a urinary tract infection, medication changes, or dehydration as potential causes of delirium", "Assume the confusion is a normal part of ageing and continue routine care", "Administer a sedative to calm the client", "Apply physical restraints to prevent the client from falling"],
    a: 0,
    r: "Acute onset of confusion in an older adult suggests delirium, which has a treatable underlying cause. Common causes include urinary tract infection, medication effects, dehydration, constipation, and pain. Confusion is not a normal ageing change. Sedatives worsen delirium. Restraints increase agitation and are a last resort after less restrictive measures fail.",
    s: "Gerontology"
  },
  {
    q: "A nurse is caring for a client who had a total hip replacement 1 day ago. Which client action requires immediate nursing intervention?",
    o: ["The client crosses their legs while sitting in the chair", "The client uses an elevated toilet seat", "The client sits in a chair with hips at 90 degrees or greater", "The client performs ankle pump exercises in bed"],
    a: 0,
    r: "After total hip replacement, crossing the legs, flexing the hip beyond 90 degrees, and internal rotation of the affected leg must be avoided to prevent hip dislocation. Using an elevated toilet seat, maintaining proper hip angle, and ankle pumps are all appropriate and encouraged to prevent complications.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client receiving a blood transfusion of packed red blood cells. Fifteen minutes into the transfusion, the client develops chills, fever, flank pain, and dark urine. What should the nurse do first?",
    o: ["Stop the transfusion immediately and keep the IV line open with normal saline", "Slow the transfusion rate and administer acetaminophen", "Continue the transfusion and monitor the client closely", "Increase the IV fluid rate to dilute the blood product"],
    a: 2,
    r: "These signs indicate an acute haemolytic transfusion reaction, a life-threatening emergency caused by ABO incompatibility. The nurse must stop the transfusion immediately, maintain IV access with normal saline, notify the provider, and send the blood bag and tubing to the laboratory. Slowing the rate or continuing the transfusion allows further incompatible blood to enter the circulation. Increasing fluids does not address the reaction.",
    s: "Hematology"
  },
  {
    q: "A nurse is assessing a client who underwent abdominal surgery 2 days ago. The client has not passed flatus and reports abdominal distension. What should the nurse encourage first?",
    o: ["Early ambulation to stimulate peristalsis", "Drinking carbonated beverages to relieve gas", "Remaining on bed rest to allow the bowel to heal", "Eating a high-fibre diet immediately to promote bowel motility"],
    a: 0,
    r: "Early ambulation is the most effective non-pharmacological intervention to stimulate peristalsis and resolve postoperative ileus. Carbonated beverages can worsen distension. Prolonged bed rest delays return of bowel function. A high-fibre diet is introduced gradually after bowel function returns, not during ileus.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a client with a chest tube connected to a water-seal drainage system. The nurse observes continuous bubbling in the water-seal chamber. What does this indicate?",
    o: ["An air leak in the system that must be assessed and reported", "Normal functioning of the chest tube drainage system", "The chest tube is ready for removal", "The suction level is set too high"],
    a: 0,
    r: "Continuous bubbling in the water-seal chamber indicates an air leak, which may originate from the client's lung (persistent pneumothorax) or from a loose connection in the system. The nurse should check all connections, assess the client, and notify the provider. Intermittent bubbling with exhalation or coughing can be normal. Continuous bubbling is never normal.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with cirrhosis who has developed ascites. The client is scheduled for a paracentesis. Which nursing action is most important before the procedure?",
    o: ["Have the client empty the bladder to prevent bladder perforation during the procedure", "Position the client prone for optimal fluid drainage", "Administer a sedative to ensure the client remains still", "Withhold all fluids for 12 hours prior to the procedure"],
    a: 0,
    r: "Having the client void before paracentesis is essential to decompress the bladder and prevent accidental bladder perforation during needle insertion into the abdomen. The client is positioned upright or sitting at the edge of the bed, not prone. Sedation is not routinely required for paracentesis. Withholding fluids is not indicated and may worsen dehydration.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a postoperative client who reports sudden onset of sharp chest pain, dyspnoea, and tachycardia on postoperative day 3. What condition should the nurse suspect?",
    o: ["Pulmonary embolism", "Pneumonia", "Myocardial infarction", "Pleural effusion"],
    a: 0,
    r: "Sudden onset of sharp chest pain, dyspnoea, and tachycardia in a postoperative client is the classic presentation of pulmonary embolism (PE). Immobility after surgery increases the risk of deep vein thrombosis, which can dislodge and travel to the lungs. Pneumonia typically develops more gradually with fever. Myocardial infarction presents with crushing chest pain. Pleural effusion onset is usually gradual.",
    s: "Respiratory"
  },
  {
    q: "A nurse is providing teaching to a client newly diagnosed with Addison's disease. Which statement by the client demonstrates understanding of the condition?",
    o: ["I need to increase my salt intake and carry injectable hydrocortisone for emergencies", "I should follow a low-sodium diet and reduce my fluid intake", "I can stop taking my cortisol replacement once I feel better", "I should avoid wearing a medical alert bracelet because it is unnecessary"],
    a: 0,
    r: "Addison's disease (adrenal insufficiency) causes deficient cortisol and aldosterone. Clients need lifelong glucocorticoid replacement and should increase sodium intake because aldosterone loss causes sodium wasting. Injectable hydrocortisone must be available for adrenal crisis. A low-sodium diet worsens hyponatraemia. Stopping medication causes adrenal crisis. A medical alert bracelet is essential for emergency identification.",
    s: "Endocrine"
  },
  {
    q: "A nurse is assessing a client who is receiving heparin therapy. Which finding should the nurse report immediately?",
    o: ["Bruising on the arms and blood in the urine", "Activated partial thromboplastin time (aPTT) of 55 seconds", "Mild pain at the subcutaneous injection site", "Platelet count of 220,000/mm³"],
    a: 0,
    r: "Bruising and haematuria are signs of excessive anticoagulation and bleeding, which is the most serious adverse effect of heparin. The nurse must report this immediately and anticipate holding the heparin and possibly administering protamine sulfate. An aPTT of 55 seconds is within the therapeutic range (1.5–2.5 times control). Mild injection site discomfort is expected. A platelet count of 220,000 is normal.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with a nasogastric tube connected to low intermittent suction. The client reports nausea and the nurse notes the tube has not drained in 2 hours. What should the nurse do first?",
    o: ["Check the tube for kinks and verify correct placement and patency", "Remove the tube and insert a new one", "Increase the suction to continuous high", "Administer an antiemetic and clamp the tube"],
    a: 0,
    r: "When NG tube output ceases and the client develops nausea, the nurse should first troubleshoot by checking for kinks, verifying placement, and ensuring patency. Irrigating with a small amount of normal saline (per policy) may restore flow. Removing the tube without assessment is premature. High continuous suction can damage gastric mucosa. An antiemetic does not address the mechanical problem.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a client with a urinary tract infection who is prescribed trimethoprim-sulfamethoxazole (Septra). Which instruction should the nurse include in client teaching?",
    o: ["Drink at least 2 to 3 litres of fluid daily to prevent crystalluria", "Limit fluid intake to concentrate the medication in the urine", "Take the medication on an empty stomach only", "Discontinue the medication once symptoms resolve"],
    a: 0,
    r: "Sulfonamide antibiotics can crystallise in the kidneys, causing crystalluria and kidney damage. Adequate fluid intake (2–3 L/day) prevents this complication by diluting the urine. Limiting fluids increases crystalluria risk. The medication can be taken with or without food. The full antibiotic course must be completed even if symptoms improve to prevent resistance and recurrence.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with a new colostomy. During a dressing change, the client looks away and says, 'I can't look at that thing.' What is the most therapeutic nursing response?",
    o: ["It is normal to feel this way. When you are ready, I can help you learn to care for your colostomy", "You need to look at it because you have to take care of it yourself at home", "It looks much better than it did right after surgery", "I will make sure someone else always changes it for you so you do not have to see it"],
    a: 0,
    r: "Acknowledging the client's feelings validates their emotional response to altered body image, which is a normal part of adjustment. Offering support when they are ready respects autonomy and promotes gradual acceptance. Forcing the client to look is non-therapeutic. Minimising their feelings dismisses their experience. Promising others will always do it prevents self-care development and independence.",
    s: "GI"
  },
  {
    q: "A nurse is assessing a client who fell and sustained a head injury. The client was initially alert but is now becoming increasingly drowsy with unequal pupils. Which condition should the nurse suspect?",
    o: ["Epidural haematoma with increasing intracranial pressure", "Concussion with normal recovery pattern", "Migraine headache triggered by the fall", "Transient ischaemic attack unrelated to the injury"],
    a: 0,
    r: "A lucid interval followed by rapid neurological deterioration (decreasing level of consciousness, unequal pupils) is the classic presentation of an epidural haematoma caused by rupture of the middle meningeal artery. This is a neurosurgical emergency requiring immediate intervention. A concussion does not produce progressive deterioration. Migraine and TIA do not cause unequal pupils following trauma.",
    s: "Neurological"
  },
  {
    q: "A nurse is preparing to administer a subcutaneous injection of enoxaparin (Lovenox). Which technique is correct?",
    o: ["Inject into the anterolateral abdominal wall without aspirating or rubbing the site afterward", "Inject into the deltoid muscle and massage the site to promote absorption", "Aspirate before injecting to check for blood return", "Apply firm pressure and rub the site vigorously after injection"],
    a: 0,
    r: "Enoxaparin is administered subcutaneously into the anterolateral abdominal wall. The nurse should not aspirate before injection and should not massage or rub the site afterward, as this increases the risk of bruising and haematoma. The deltoid is an intramuscular site. Vigorous rubbing disrupts the medication depot and causes tissue damage.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client receiving total parenteral nutrition (TPN) through a central venous catheter. The current bag of TPN runs out and a new bag is not yet available. What should the nurse do?",
    o: ["Hang dextrose 10% in water (D10W) to prevent rebound hypoglycaemia", "Discontinue the infusion and wait for the new bag", "Administer normal saline at the same rate as the TPN", "Infuse the remaining TPN from the tubing by gravity"],
    a: 0,
    r: "TPN contains high concentrations of dextrose. Abruptly stopping TPN can cause rebound hypoglycaemia because the pancreas is still producing insulin in response to the high glucose load. Hanging D10W maintains blood glucose until the new TPN bag arrives. Discontinuing without a dextrose source risks hypoglycaemia. Normal saline does not provide glucose. Running TPN tubing dry introduces air.",
    s: "Safety"
  },
  {
    q: "A nurse is delegating tasks to an unregulated care provider (UCP). Which task is appropriate to delegate?",
    o: ["Measuring and recording vital signs on a stable postoperative client", "Performing the initial assessment on a newly admitted client", "Administering oral medications to a client with dysphagia", "Educating a client about a new diabetes diagnosis"],
    a: 0,
    r: "Measuring and recording vital signs on a stable client is within the scope of a UCP. Initial assessments require nursing judgment and cannot be delegated. Medication administration requires a regulated professional. Client education about new diagnoses requires nursing knowledge and clinical judgment. The nurse retains accountability for delegated tasks and must ensure the UCP is competent.",
    s: "Delegation"
  },
  {
    q: "A nurse is caring for a client with a tracheostomy who is showing signs of respiratory distress. The nurse attempts to suction the tracheostomy but is unable to pass the catheter. What should the nurse do next?",
    o: ["Remove the inner cannula, attempt to ventilate, and call for assistance", "Continue forcing the suction catheter through the obstruction", "Wait 10 minutes and attempt suctioning again", "Administer oxygen through the tracheostomy at high flow"],
    a: 0,
    r: "If the suction catheter cannot pass, the inner cannula may be obstructed with mucus or a plug. Removing the inner cannula clears the obstruction in most cases. If the client remains in distress, the nurse should attempt to ventilate with a bag-valve mask over the tracheostomy and call for emergency assistance. Forcing the catheter can cause trauma. Waiting risks respiratory arrest. High-flow oxygen cannot enter a blocked tube.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with chronic kidney disease whose serum phosphorus is elevated at 2.1 mmol/L. Which dietary instruction should the nurse provide?",
    o: ["Limit intake of dairy products, processed foods, and colas", "Increase consumption of milk and cheese for calcium", "Eat more whole grains and legumes for fibre", "Add organ meats to the diet for protein supplementation"],
    a: 0,
    r: "Hyperphosphataemia in chronic kidney disease requires dietary phosphorus restriction. Dairy products, processed foods, colas, and organ meats are high in phosphorus. Increasing dairy worsens hyperphosphataemia despite calcium content. Whole grains and legumes also contain significant phosphorus. Phosphate binders are often prescribed to be taken with meals to reduce phosphorus absorption.",
    s: "Renal"
  },
  {
    q: "A nurse is assessing a 4-year-old child in the emergency department. The child has a barking cough, inspiratory stridor, and hoarseness. Which condition should the nurse suspect?",
    o: ["Croup (laryngotracheobronchitis)", "Epiglottitis", "Bronchiolitis", "Foreign body aspiration"],
    a: 0,
    r: "The triad of barking (seal-like) cough, inspiratory stridor, and hoarseness is characteristic of croup, a viral upper airway infection common in children aged 6 months to 3 years. Epiglottitis presents with drooling, dysphagia, and the child sitting in tripod position. Bronchiolitis causes wheezing and respiratory distress in infants. Foreign body aspiration typically has a sudden onset with unilateral wheezing.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a client with a suspected stroke. The client has sudden onset of left-sided weakness, slurred speech, and facial droop. What is the nurse's priority action?",
    o: ["Note the time of symptom onset and activate the stroke response protocol immediately", "Administer aspirin 325 mg orally to prevent clot progression", "Position the client flat to increase cerebral blood flow", "Obtain a 12-lead ECG before notifying the healthcare provider"],
    a: 0,
    r: "In suspected stroke, documenting the time of symptom onset is critical because thrombolytic therapy (tPA) must be administered within a specific window. Activating the stroke protocol ensures rapid assessment and imaging. Aspirin should not be given until haemorrhagic stroke is ruled out by CT scan. Positioning depends on protocol. An ECG may be done but does not take priority over stroke activation.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for an older adult client in a long-term care home who has been prescribed a new benzodiazepine for insomnia. Which safety concern should the nurse communicate to the healthcare provider?",
    o: ["Benzodiazepines increase the risk of falls, confusion, and over-sedation in older adults", "Benzodiazepines are the preferred first-line treatment for insomnia in older adults", "The medication will improve the client's cognitive function", "Benzodiazepines have no significant adverse effects in the geriatric population"],
    a: 0,
    r: "Benzodiazepines are included on the Beers Criteria list of potentially inappropriate medications for older adults due to increased sensitivity causing excessive sedation, cognitive impairment, falls, and fractures. The nurse should advocate for safer alternatives such as sleep hygiene measures or melatonin. Benzodiazepines are not first-line for geriatric insomnia and carry significant risks in this population.",
    s: "Gerontology"
  }
];
