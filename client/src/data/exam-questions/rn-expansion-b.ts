import type { ExamQuestion } from "./types";

export const rnExpansionBQuestions: ExamQuestion[] = [
  // ===== ONCOLOGY NURSING (Questions 1-10) =====
  {
    q: "A client receiving cisplatin chemotherapy develops a serum creatinine of 2.8 mg/dL (baseline 0.9 mg/dL). The nurse should prioritize which action?",
    o: ["Hold the chemotherapy and notify the oncologist immediately", "Administer the next dose with increased IV hydration", "Obtain a urine culture to rule out infection", "Encourage the client to increase oral fluid intake to 3 liters daily"],
    a: 0,
    r: "Cisplatin is highly nephrotoxic. A significant rise in serum creatinine indicates acute kidney injury, requiring immediate cessation of the drug and provider notification. Continuing with hydration alone does not address the nephrotoxicity. A urine culture is not the priority when nephrotoxicity is evident. Oral fluids alone cannot reverse drug-induced renal damage.",
    s: "Oncology"
  },
  {
    q: "A nurse is caring for a client with an absolute neutrophil count (ANC) of 400 cells/mm3 who develops a temperature of 38.5 degrees Celsius. What is the priority intervention?",
    o: ["Obtain blood cultures and initiate broad-spectrum antibiotics within 1 hour", "Administer acetaminophen and monitor the temperature every 2 hours", "Place the client in protective isolation and restrict visitors", "Obtain a chest X-ray before initiating any treatment"],
    a: 0,
    r: "Febrile neutropenia (ANC less than 500 with fever) is an oncologic emergency. Blood cultures must be drawn and empiric broad-spectrum antibiotics started within 1 hour to prevent sepsis and death. Acetaminophen alone does not address the underlying infection risk. Isolation is important but not the priority over antibiotics. Delaying antibiotics for imaging increases mortality.",
    s: "Oncology"
  },
  {
    q: "A client receiving doxorubicin has received a cumulative lifetime dose of 450 mg/m2. The nurse understands that the most critical assessment at this point is monitoring for which condition?",
    o: ["Cardiotoxicity with heart failure", "Hepatotoxicity with jaundice", "Pulmonary fibrosis with dyspnea", "Peripheral neuropathy with numbness"],
    a: 0,
    r: "Doxorubicin causes dose-dependent irreversible cardiotoxicity. The maximum cumulative dose is typically 450-550 mg/m2. At this threshold, echocardiography and monitoring for signs of heart failure (dyspnea, edema, decreased ejection fraction) are critical. Hepatotoxicity is not the primary dose-limiting toxicity. Pulmonary fibrosis is associated with bleomycin. Peripheral neuropathy is associated with vincristine and taxanes.",
    s: "Oncology"
  },
  {
    q: "A client with lymphoma develops tumor lysis syndrome (TLS) 48 hours after chemotherapy initiation. Which laboratory finding does the nurse expect?",
    o: ["Hyperkalemia, hyperuricemia, hyperphosphatemia, and hypocalcemia", "Hypokalemia, hypouricemia, hypophosphatemia, and hypercalcemia", "Hypernatremia, hypomagnesemia, and metabolic alkalosis", "Hypoglycemia, hypoalbuminemia, and elevated ammonia"],
    a: 0,
    r: "Tumor lysis syndrome results from rapid destruction of cancer cells, releasing intracellular contents into the bloodstream. This causes hyperkalemia (potassium release), hyperuricemia (nucleic acid breakdown), hyperphosphatemia (phosphorus release), and secondary hypocalcemia (calcium binds to excess phosphorus). The other electrolyte patterns are not consistent with TLS pathophysiology.",
    s: "Oncology"
  },
  {
    q: "A client receiving vincristine reports new-onset constipation, difficulty walking, and tingling in the fingers and toes. The nurse recognizes these findings as indicative of which adverse effect?",
    o: ["Peripheral neuropathy from vinca alkaloid toxicity", "Early signs of tumor lysis syndrome", "Hypercalcemia related to bone metastasis", "Central nervous system metastasis"],
    a: 0,
    r: "Vincristine is a vinca alkaloid with dose-limiting neurotoxicity. Peripheral neuropathy manifests as paresthesias (tingling), decreased deep tendon reflexes, motor weakness (difficulty walking), and autonomic dysfunction (constipation from decreased bowel motility). TLS presents with metabolic abnormalities. Hypercalcemia causes different symptoms. CNS metastasis would show focal neurological deficits.",
    s: "Oncology"
  },
  {
    q: "A nurse is preparing to administer an IV vesicant chemotherapy agent. During infusion, the client reports burning pain at the IV site. Assessment reveals swelling and lack of blood return. What is the priority action?",
    o: ["Stop the infusion immediately and aspirate residual drug from the catheter", "Slow the infusion rate and apply a warm compress to the site", "Flush the IV line with 20 mL of normal saline to verify patency", "Continue the infusion and elevate the extremity above heart level"],
    a: 0,
    r: "Extravasation of a vesicant agent causes severe tissue damage and necrosis. The infusion must be stopped immediately, and residual drug aspirated through the catheter before removal. Slowing the rate allows continued tissue exposure. Flushing forces more drug into tissues. Continuing the infusion worsens tissue injury. Specific antidotes (dexrazoxane for anthracyclines, hyaluronidase for vinca alkaloids) should then be administered per protocol.",
    s: "Oncology"
  },
  {
    q: "A client with metastatic breast cancer has a serum calcium level of 14.2 mg/dL. The client is confused, lethargic, and has diminished deep tendon reflexes. Which intervention should the nurse anticipate first?",
    o: ["Aggressive IV normal saline hydration", "Administration of oral calcium supplements", "Preparation for hemodialysis", "Administration of IV calcium gluconate"],
    a: 0,
    r: "Hypercalcemia of malignancy is treated first with aggressive IV normal saline to restore intravascular volume and promote renal calcium excretion. Bisphosphonates (zoledronic acid) are then administered. Calcium supplements would worsen hypercalcemia. Hemodialysis is reserved for refractory cases. Calcium gluconate is given for hypocalcemia, not hypercalcemia.",
    s: "Oncology"
  },
  {
    q: "A client undergoing radiation therapy for head and neck cancer develops grade 3 mucositis with painful ulcerations preventing oral intake. Which intervention is most appropriate?",
    o: ["Consult for parenteral or enteral nutrition support and provide topical analgesics", "Encourage the client to eat spicy foods to stimulate appetite", "Perform aggressive oral suctioning every hour to clear debris", "Apply hydrogen peroxide rinses three times daily to promote healing"],
    a: 0,
    r: "Grade 3 mucositis with inability to eat requires nutritional support (enteral or parenteral) and pain management with topical analgesics or systemic medications. Spicy foods worsen mucosal irritation and pain. Aggressive suctioning can traumatize fragile tissues. Hydrogen peroxide is cytotoxic to healing tissue and delays wound repair; gentle saline or sodium bicarbonate rinses are preferred.",
    s: "Oncology"
  },
  {
    q: "A nurse is educating a client newly diagnosed with acute myeloid leukemia about neutropenic precautions. Which client statement indicates effective teaching?",
    o: ["I will avoid fresh flowers, raw fruits, and large crowds while my white count is low", "I should take aspirin for any fever I develop at home", "I can continue gardening as long as I wash my hands afterward", "I only need to worry about infection if I develop a cough"],
    a: 0,
    r: "Neutropenic precautions include avoiding sources of bacteria and fungi such as fresh flowers (Aspergillus), raw unwashed produce, and crowded environments. Aspirin masks fever and affects platelet function in thrombocytopenic clients. Gardening exposes the client to soil organisms including Aspergillus and Pseudomonas. Any fever in neutropenia requires immediate medical evaluation, not just when symptoms like cough are present.",
    s: "Oncology"
  },
  {
    q: "A client with non-small cell lung cancer is receiving pembrolizumab (immunotherapy). The client develops new-onset dyspnea, nonproductive cough, and bilateral ground-glass opacities on chest imaging. The nurse suspects which complication?",
    o: ["Immune-related pneumonitis", "Bacterial pneumonia from immunosuppression", "Pulmonary embolism from malignancy", "Radiation recall pneumonitis"],
    a: 0,
    r: "Checkpoint inhibitor immunotherapy (pembrolizumab) can cause immune-related adverse events including pneumonitis. Symptoms include progressive dyspnea, dry cough, and ground-glass opacities on imaging. Treatment involves holding immunotherapy and administering corticosteroids. Bacterial pneumonia typically presents with productive cough and fever. PE presents with acute dyspnea and pleuritic chest pain. Radiation recall requires prior radiation exposure.",
    s: "Oncology"
  },

  // ===== PERIOPERATIVE CARE & ANESTHESIA (Questions 11-20) =====
  {
    q: "A client in the post-anesthesia care unit (PACU) after general anesthesia develops stridor, intercostal retractions, and decreasing oxygen saturation. What is the priority nursing action?",
    o: ["Open the airway with jaw thrust, administer high-flow oxygen, and call for the anesthesiologist", "Administer IV morphine for pain-related splinting", "Position the client supine and prepare for chest X-ray", "Encourage deep breathing and coughing exercises"],
    a: 0,
    r: "Stridor with retractions and desaturation post-general anesthesia indicates upper airway obstruction, likely from laryngospasm or residual neuromuscular blockade. Immediate airway management with jaw thrust, high-flow oxygen, and expert assistance is essential. Morphine can worsen respiratory depression. Supine positioning worsens obstruction. Deep breathing cannot be performed effectively with airway obstruction.",
    s: "Perioperative"
  },
  {
    q: "A nurse is performing a preoperative assessment for a client scheduled for elective surgery. The client reports taking warfarin daily for atrial fibrillation. Which finding requires immediate communication with the surgical team?",
    o: ["INR of 3.2 drawn this morning", "Blood pressure of 138/82 mmHg", "History of mild seasonal allergies", "Hemoglobin of 13.5 g/dL"],
    a: 0,
    r: "An INR of 3.2 indicates the client is supratherapeutic on anticoagulation, significantly increasing surgical bleeding risk. This must be communicated immediately as surgery may need to be postponed or bridging therapy planned. BP of 138/82 is mildly elevated but not an emergency. Seasonal allergies are important to document but not urgent. Hemoglobin of 13.5 is normal.",
    s: "Perioperative"
  },
  {
    q: "A client returns from abdominal surgery with a nasogastric tube connected to low intermittent suction. The nurse notes the drainage has been 800 mL of greenish fluid over the past 8 hours. The client reports nausea. What should the nurse assess first?",
    o: ["Verify nasogastric tube placement and patency", "Administer an antiemetic as ordered", "Increase the suction to continuous high suction", "Remove the nasogastric tube and notify the surgeon"],
    a: 0,
    r: "Nausea with a nasogastric tube in place suggests possible tube malposition or obstruction. Verifying placement (auscultation, aspiration of gastric contents, checking tube markings) and patency (irrigating with saline) is the first assessment. Antiemetics treat symptoms but do not address the cause. High continuous suction can damage gastric mucosa. Removing the tube without assessment is inappropriate.",
    s: "Perioperative"
  },
  {
    q: "A client who had spinal anesthesia for a cesarean section reports a severe headache that worsens when sitting up and improves when lying flat. The nurse recognizes this as which complication?",
    o: ["Post-dural puncture headache from cerebrospinal fluid leak", "Tension headache from stress of surgery", "Preeclampsia with new-onset hypertension", "Meningitis from contaminated spinal needle"],
    a: 0,
    r: "Post-dural puncture headache (PDPH) occurs when CSF leaks through the dural puncture site, causing decreased intracranial pressure. The hallmark is a positional headache that worsens with upright positioning and improves with lying flat. Treatment includes bed rest, hydration, caffeine, and epidural blood patch if conservative measures fail. Tension headaches are not positional. Preeclampsia headache is not typically positional. Meningitis presents with fever, neck stiffness, and photophobia.",
    s: "Perioperative"
  },
  {
    q: "A nurse is caring for a client who underwent total knee replacement 4 hours ago. The client is unable to dorsiflex the foot and reports numbness along the lateral leg. Which complication does the nurse suspect?",
    o: ["Common peroneal nerve injury", "Deep vein thrombosis", "Compartment syndrome", "Fat embolism syndrome"],
    a: 0,
    r: "The common peroneal nerve wraps around the fibular head and is vulnerable to compression from surgical positioning, dressings, or edema. Injury causes foot drop (inability to dorsiflex) and numbness along the lateral leg and dorsum of the foot. DVT causes calf swelling and pain but not foot drop. Compartment syndrome causes pain with passive stretch and tense swelling. Fat embolism presents with respiratory distress, petechiae, and confusion.",
    s: "Perioperative"
  },
  {
    q: "During surgery, the circulating nurse notices the client's temperature has risen to 40.5 degrees Celsius, with muscle rigidity and tachycardia. End-tidal CO2 is rising rapidly. The nurse suspects malignant hyperthermia. What is the priority intervention?",
    o: ["Discontinue volatile anesthetic agents and administer IV dantrolene", "Administer acetaminophen rectally and apply cooling blankets", "Increase the anesthetic depth to control rigidity", "Administer IV succinylcholine to relax the muscles"],
    a: 0,
    r: "Malignant hyperthermia is a life-threatening hypermetabolic crisis triggered by volatile anesthetics or succinylcholine. Treatment requires immediate discontinuation of triggering agents and administration of IV dantrolene sodium (2.5 mg/kg). Active cooling, hyperventilation with 100% O2, and treatment of hyperkalemia are also indicated. Acetaminophen alone is insufficient. Increasing anesthesia worsens the crisis. Succinylcholine is a trigger, not a treatment.",
    s: "Perioperative"
  },
  {
    q: "A client is 2 days post-laparoscopic cholecystectomy and reports sharp right shoulder pain. The nurse explains that this pain is most likely caused by which factor?",
    o: ["Referred pain from retained carbon dioxide irritating the diaphragm", "Intraoperative shoulder positioning causing muscle strain", "Bile duct injury with bile peritonitis", "Pulmonary embolism with pleuritic pain radiation"],
    a: 0,
    r: "During laparoscopic surgery, carbon dioxide is insufflated into the abdominal cavity. Residual CO2 can irritate the phrenic nerve and diaphragm, causing referred pain to the shoulder (Kehr sign without actual injury). This is a common and benign postoperative complaint that resolves with ambulation and time. Positioning injury typically causes different pain patterns. Bile duct injury presents with abdominal pain and jaundice. PE presents with dyspnea and acute chest pain.",
    s: "Perioperative"
  },
  {
    q: "A nurse is caring for a client who underwent a thyroidectomy 6 hours ago. The client develops perioral tingling, hand cramping, and a positive Chvostek sign. The nurse should anticipate administering which medication?",
    o: ["IV calcium gluconate", "IV potassium chloride", "IV magnesium sulfate", "IV sodium bicarbonate"],
    a: 0,
    r: "Post-thyroidectomy hypocalcemia occurs from inadvertent damage to the parathyroid glands. Signs include perioral tingling, Chvostek sign (facial twitching with cheek tapping), Trousseau sign (carpopedal spasm with BP cuff inflation), and tetany. IV calcium gluconate is the treatment to rapidly correct symptomatic hypocalcemia. Potassium, magnesium, and bicarbonate do not address the calcium deficit.",
    s: "Perioperative"
  },
  {
    q: "A postoperative client with an epidural catheter for pain management reports sudden onset of bilateral leg weakness and urinary retention. What is the priority nursing action?",
    o: ["Stop the epidural infusion and notify the anesthesiologist immediately", "Reassure the client that leg weakness is a normal side effect", "Insert a urinary catheter and continue the epidural at the current rate", "Administer naloxone to reverse opioid effects"],
    a: 0,
    r: "Bilateral leg weakness with urinary retention following epidural analgesia may indicate epidural hematoma or abscess causing spinal cord compression, which is a neurosurgical emergency. The infusion must be stopped and the anesthesiologist notified immediately for urgent assessment (MRI) and possible decompressive surgery. While some motor block is expected, bilateral weakness with bladder dysfunction is abnormal. Naloxone reverses opioid effects but does not address cord compression.",
    s: "Perioperative"
  },
  {
    q: "A nurse is preparing a client for surgery and notes the client signed the surgical consent form but now states uncertainty about proceeding. What is the appropriate nursing action?",
    o: ["Hold the procedure and notify the surgeon that the client wishes to reconsider", "Remind the client that the consent is already signed and cannot be revoked", "Administer the preoperative sedation as ordered to help the client relax", "Ask the client's family to convince the client to proceed with surgery"],
    a: 0,
    r: "Informed consent is an ongoing process, and a client has the right to withdraw consent at any time, even after signing the form. The nurse must advocate for the client by stopping the process and notifying the surgeon. Consent cannot be irrevocable. Administering sedation to a client expressing hesitation is unethical. Family members cannot override the client's autonomy.",
    s: "Perioperative"
  },

  // ===== ORGAN TRANSPLANT & IMMUNOSUPPRESSION (Questions 21-30) =====
  {
    q: "A nurse is caring for a client 3 days post-renal transplant who develops fever, oliguria, and graft tenderness. Laboratory results show rising serum creatinine. The nurse suspects which complication?",
    o: ["Acute graft rejection", "Cyclosporine toxicity", "Urinary tract infection", "Renal artery stenosis"],
    a: 0,
    r: "Acute rejection typically occurs within days to months after transplant and presents with fever, graft tenderness, decreased urine output, and rising creatinine. It is mediated by T-cell immune response against donor antigens. Cyclosporine toxicity can cause renal dysfunction but not typically fever and graft tenderness. UTI presents with dysuria and pyuria. Renal artery stenosis develops later and presents with hypertension and bruit.",
    s: "Hematology"
  },
  {
    q: "A client who received a liver transplant 6 months ago presents with fatigue, jaundice, and elevated liver enzymes. Biopsy shows bile duct destruction with lymphocytic infiltration. The nurse recognizes this as which type of rejection?",
    o: ["Chronic rejection with vanishing bile duct syndrome", "Hyperacute rejection from preformed antibodies", "Acute cellular rejection", "Graft-versus-host disease"],
    a: 0,
    r: "Chronic rejection in liver transplants manifests as vanishing bile duct syndrome (ductopenic rejection), characterized by progressive destruction of small bile ducts with lymphocytic infiltration. This leads to cholestasis, jaundice, and eventual graft failure. Hyperacute rejection occurs within minutes to hours. Acute cellular rejection occurs within the first few months and is usually reversible with increased immunosuppression. GVHD occurs when donor immune cells attack host tissues.",
    s: "Hematology"
  },
  {
    q: "A nurse is monitoring tacrolimus trough levels for a post-transplant client. The result is 22 ng/mL (target range 5-15 ng/mL). Which clinical finding should the nurse assess for?",
    o: ["Nephrotoxicity, tremors, and hyperglycemia", "Bone marrow suppression and pancytopenia", "Hepatotoxicity with elevated ammonia levels", "Adrenal insufficiency with hypotension"],
    a: 0,
    r: "Tacrolimus (a calcineurin inhibitor) at supratherapeutic levels causes nephrotoxicity (elevated creatinine), neurotoxicity (tremors, headache, seizures), and metabolic effects (hyperglycemia, hyperkalemia). The dose should be held and the transplant team notified. Bone marrow suppression is more associated with mycophenolate or azathioprine. Hepatotoxicity with elevated ammonia is not a primary tacrolimus toxicity. Adrenal insufficiency is not caused by calcineurin inhibitors.",
    s: "Hematology"
  },
  {
    q: "A client on immunosuppressive therapy after heart transplant presents with fever, headache, confusion, and a ring-enhancing lesion on brain MRI. The nurse suspects infection with which organism?",
    o: ["Toxoplasma gondii", "Staphylococcus aureus", "Streptococcus pneumoniae", "Candida albicans"],
    a: 0,
    r: "Ring-enhancing brain lesions in immunocompromised transplant patients are classic for Toxoplasma gondii infection, especially in heart transplant recipients (Toxoplasma cysts may reside in donor cardiac tissue). This opportunistic protozoan causes necrotizing encephalitis. Staphylococcus typically causes abscesses without ring enhancement. Streptococcus causes meningitis rather than focal lesions. Candida causes diffuse microabscesses, not ring-enhancing lesions.",
    s: "Hematology"
  },
  {
    q: "A nurse is educating a kidney transplant recipient about long-term immunosuppressive therapy. Which client statement indicates a need for further teaching?",
    o: ["I can stop taking my anti-rejection medications once I feel completely healthy", "I should wear sunscreen and get regular skin checks because of increased cancer risk", "I need to avoid live vaccines and report any signs of infection immediately", "I should have my blood levels checked regularly to ensure the right medication dose"],
    a: 0,
    r: "Immunosuppressive medications must be taken lifelong; discontinuing them leads to graft rejection and loss. The client must understand that feeling well does not mean the immune system has accepted the organ. Wearing sunscreen is correct because immunosuppression increases skin cancer risk. Avoiding live vaccines and reporting infections is correct. Regular drug level monitoring is essential for therapeutic dosing.",
    s: "Hematology"
  },
  {
    q: "A client who underwent bone marrow transplant 21 days ago develops a diffuse maculopapular rash, profuse watery diarrhea, and rising bilirubin levels. Which complication does the nurse suspect?",
    o: ["Graft-versus-host disease", "Cytomegalovirus reactivation", "Veno-occlusive disease of the liver", "Engraftment syndrome"],
    a: 0,
    r: "Graft-versus-host disease (GVHD) occurs when donor T-cells attack recipient tissues, commonly affecting skin (rash), GI tract (diarrhea, abdominal pain), and liver (elevated bilirubin). It typically develops 2-6 weeks after allogeneic bone marrow transplant. CMV reactivation presents with pneumonitis, colitis, or retinitis. Veno-occlusive disease presents with hepatomegaly, weight gain, and ascites without the triad. Engraftment syndrome occurs earlier with fever and pulmonary infiltrates.",
    s: "Hematology"
  },
  {
    q: "A nurse caring for a lung transplant recipient notes that the client's cyclosporine level is therapeutic but the client has developed gingival hyperplasia and hirsutism. What should the nurse understand about these findings?",
    o: ["These are common side effects of cyclosporine that should be reported but are not emergencies", "These indicate cyclosporine toxicity requiring immediate dose reduction", "These symptoms are unrelated to the medication and need separate workup", "These are signs of acute rejection masked by immunosuppression"],
    a: 0,
    r: "Gingival hyperplasia and hirsutism are well-known cosmetic side effects of cyclosporine that can occur even at therapeutic levels. They should be documented and discussed with the transplant team but are not emergencies. Good oral hygiene and dental care help manage gingival hyperplasia. These are not signs of toxicity (which causes nephrotoxicity, tremors, hypertension). They are directly related to the medication. They are not rejection signs.",
    s: "Hematology"
  },
  {
    q: "A client awaiting kidney transplant has a positive crossmatch with the potential donor. The nurse understands that this result indicates which of the following?",
    o: ["The recipient has preformed antibodies against the donor, and transplant should not proceed", "The donor and recipient are an excellent tissue match", "The recipient requires additional immunosuppression before surgery", "The donor organ has an infection that must be treated first"],
    a: 0,
    r: "A positive crossmatch means the recipient's serum contains preformed antibodies (anti-HLA antibodies) against the donor's lymphocytes. Transplanting in this situation would cause hyperacute rejection within minutes to hours, leading to immediate graft loss. The transplant is contraindicated with a positive crossmatch. A negative crossmatch is required to proceed. It does not indicate good compatibility, need for more immunosuppression, or donor infection.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a pancreas transplant recipient who develops sudden hyperglycemia after 6 months of normal glucose levels. Which concern is most likely?",
    o: ["Acute rejection of the pancreatic graft", "Development of type 1 diabetes in the native pancreas", "Steroid-induced diabetes from immunosuppressive therapy", "Normal fluctuation in blood glucose levels"],
    a: 0,
    r: "Sudden return of hyperglycemia after a period of insulin independence in a pancreas transplant recipient strongly suggests acute graft rejection. The transplanted islet cells are being attacked by the immune system, causing loss of insulin production. Type 1 diabetes in the native pancreas is not applicable since the patient already had diabetes. Steroid-induced diabetes develops gradually, not suddenly. Normal fluctuations do not cause sustained hyperglycemia.",
    s: "Hematology"
  },
  {
    q: "A post-transplant client on mycophenolate mofetil develops severe diarrhea and a white blood cell count of 2,100 cells/mm3. What is the appropriate nursing action?",
    o: ["Hold the medication and notify the transplant team about bone marrow suppression and GI toxicity", "Administer loperamide and continue the medication as prescribed", "Increase the dose to better prevent rejection", "Obtain stool cultures and continue the current immunosuppressive regimen"],
    a: 0,
    r: "Mycophenolate mofetil (CellCept) commonly causes GI side effects (diarrhea, nausea) and bone marrow suppression (leukopenia). A WBC of 2,100 indicates significant myelosuppression, increasing infection risk. The medication should be held and the transplant team notified for dose adjustment. Treating diarrhea without addressing the cause is inappropriate. Increasing the dose worsens toxicity. While stool cultures may be warranted, the medication issue must be addressed first.",
    s: "Hematology"
  },

  // ===== ADVANCED PHARMACOLOGY (Questions 31-40) =====
  {
    q: "A nurse is administering IV heparin to a client with pulmonary embolism. The aPTT result is 120 seconds (therapeutic range 60-80 seconds). The client has no signs of active bleeding. What is the appropriate action?",
    o: ["Stop the heparin infusion, notify the provider, and recheck aPTT per protocol", "Administer protamine sulfate immediately", "Reduce the infusion rate by 25% and recheck in 6 hours", "Continue the infusion and recheck aPTT in 4 hours"],
    a: 0,
    r: "An aPTT of 120 seconds is significantly supratherapeutic, placing the client at high risk for hemorrhage. The heparin infusion should be stopped, the provider notified, and aPTT rechecked per institutional protocol before restarting at a lower rate. Protamine sulfate is reserved for active bleeding or life-threatening hemorrhage. Simply reducing the rate without stopping is insufficient for this level of over-anticoagulation. Continuing puts the client at serious bleeding risk.",
    s: "Pharmacology"
  },
  {
    q: "A client on warfarin therapy for a mechanical heart valve presents with an INR of 8.5 and no signs of bleeding. What intervention does the nurse anticipate?",
    o: ["Hold warfarin and administer oral vitamin K as ordered", "Administer IV vitamin K and fresh frozen plasma immediately", "Continue warfarin at the current dose and recheck INR in 1 week", "Administer subcutaneous heparin as a bridge therapy"],
    a: 0,
    r: "An INR of 8.5 without active bleeding requires holding warfarin and administering oral vitamin K (phytonadione) to gradually lower the INR. IV vitamin K and FFP are reserved for active, life-threatening bleeding. Continuing warfarin at the current dose risks serious hemorrhage. Adding heparin would further increase bleeding risk. The goal is to safely reduce the INR while maintaining future anticoagulation capability.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is titrating a norepinephrine (Levophed) infusion for a client in septic shock. The client's mean arterial pressure (MAP) is 58 mmHg (target greater than 65 mmHg). The nurse should take which action?",
    o: ["Increase the norepinephrine infusion rate per the titration protocol", "Discontinue norepinephrine and switch to dobutamine", "Administer a bolus of IV dextrose 5% in water", "Hold the infusion until blood pressure normalizes on its own"],
    a: 0,
    r: "In septic shock, norepinephrine is the first-line vasopressor, and the MAP target is 65 mmHg or greater. With a MAP of 58, the infusion should be increased per the titration protocol. Switching to dobutamine is inappropriate as dobutamine is an inotrope, not a vasopressor for septic shock. D5W is not an appropriate fluid resuscitation choice. Holding the infusion in active shock risks organ failure and death.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving IV vancomycin develops facial flushing, pruritus, and a diffuse erythematous rash on the face, neck, and torso during the infusion. Blood pressure is 118/72. What is the priority action?",
    o: ["Stop the infusion, notify the provider, and administer diphenhydramine as ordered", "Administer epinephrine intramuscularly for anaphylaxis", "Continue the infusion at a slower rate", "Apply topical hydrocortisone cream to the affected areas"],
    a: 0,
    r: "Red man syndrome is a histamine-mediated reaction to rapid vancomycin infusion, presenting with flushing, erythema, and pruritus on the face, neck, and upper torso. The infusion should be stopped and antihistamines (diphenhydramine) administered. It is not true anaphylaxis (no hypotension, angioedema, or respiratory compromise), so epinephrine is not indicated. Continuing the infusion worsens symptoms. Topical treatment alone is insufficient. The medication can typically be restarted at a slower rate.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client receiving an aminoglycoside (gentamicin) antibiotic. Which assessment findings indicate potential toxicity requiring immediate notification of the provider?",
    o: ["Tinnitus, vertigo, and elevated serum creatinine", "Nausea, diarrhea, and abdominal cramping", "Headache, photosensitivity, and joint pain", "Dry mouth, urinary frequency, and constipation"],
    a: 0,
    r: "Aminoglycosides (gentamicin, tobramycin, amikacin) have two major dose-limiting toxicities: ototoxicity (tinnitus, vertigo, hearing loss) and nephrotoxicity (rising creatinine, decreased urine output). Trough and peak levels must be monitored. Nausea and diarrhea are common with many antibiotics but not specific aminoglycoside toxicity. Photosensitivity is associated with fluoroquinolones and tetracyclines. Dry mouth and urinary frequency are not characteristic aminoglycoside effects.",
    s: "Pharmacology"
  },
  {
    q: "A client is started on lithium carbonate for bipolar disorder. The nurse should teach the client to maintain adequate intake of which substance to prevent toxicity?",
    o: ["Sodium and fluids", "Potassium-rich foods", "Calcium and vitamin D supplements", "Protein and iron-rich foods"],
    a: 0,
    r: "Lithium is reabsorbed in the proximal tubule alongside sodium. Sodium depletion (from dehydration, low-sodium diets, excessive sweating, or diuretics) causes increased lithium reabsorption and toxicity. Clients must maintain consistent sodium and fluid intake. Potassium intake does not directly affect lithium levels. Calcium and vitamin D are unrelated to lithium pharmacokinetics. Protein and iron do not affect lithium handling.",
    s: "Pharmacology"
  },
  {
    q: "A client prescribed metformin for type 2 diabetes is scheduled for a CT scan with IV contrast. The nurse should take which action regarding the metformin?",
    o: ["Hold metformin on the day of the procedure and for 48 hours after contrast administration", "Continue metformin as prescribed with no changes", "Administer an extra dose of metformin before the procedure", "Permanently discontinue metformin and switch to insulin"],
    a: 0,
    r: "Metformin must be held before and for 48 hours after IV contrast administration due to the risk of contrast-induced nephropathy. If renal function declines, metformin accumulation can cause life-threatening lactic acidosis. Renal function should be reassessed before restarting. Continuing metformin increases lactic acidosis risk. An extra dose is dangerous. Permanent discontinuation is not necessary if renal function recovers.",
    s: "Pharmacology"
  },
  {
    q: "A nurse administers the first dose of an ACE inhibitor (enalapril) to a client with heart failure. Two hours later, the client's blood pressure drops to 82/50 mmHg. What is the priority action?",
    o: ["Place the client supine, hold subsequent doses, and notify the provider", "Administer the next dose at the scheduled time", "Administer IV epinephrine for suspected drug allergy", "Apply compression stockings and encourage ambulation"],
    a: 0,
    r: "First-dose hypotension is a well-known effect of ACE inhibitors, especially in clients with heart failure who may have activated renin-angiotensin systems. The client should be placed supine to improve venous return, subsequent doses held, and the provider notified for dose adjustment. Administering the next dose without addressing hypotension is dangerous. This is not an allergic reaction requiring epinephrine. Ambulation with significant hypotension risks falls and injury.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving a continuous IV insulin infusion has a blood glucose of 3.1 mmol/L (56 mg/dL). The client is diaphoretic and confused. What is the priority intervention?",
    o: ["Stop the insulin infusion and administer IV dextrose 50% as prescribed", "Administer 4 ounces of orange juice orally", "Decrease the insulin infusion rate by 50%", "Administer subcutaneous glucagon and continue the infusion"],
    a: 0,
    r: "Severe hypoglycemia with altered mental status requires immediate IV dextrose and stopping the insulin infusion. Oral glucose is unsafe in a confused client due to aspiration risk. Decreasing the rate without stopping continues to lower glucose. Glucagon mobilizes hepatic glycogen but does not address the ongoing exogenous insulin infusion, which must be stopped. IV access is already available, making IV dextrose the fastest intervention.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is preparing to discharge a client on a new prescription for amiodarone. Which teaching points are essential for this medication?",
    o: ["Report visual changes, use sunscreen, and have regular thyroid and pulmonary function tests", "Take the medication on an empty stomach and avoid dairy products", "Expect increased urination as a common side effect", "Discontinue the medication if you feel palpitations have resolved"],
    a: 0,
    r: "Amiodarone has multiple serious long-term toxicities including pulmonary fibrosis, thyroid dysfunction (both hyper and hypothyroidism), corneal microdeposits causing visual halos, hepatotoxicity, and photosensitivity causing blue-gray skin discoloration. Regular monitoring of thyroid, liver, and pulmonary function is essential. It should be taken with food for better absorption. Increased urination is not a side effect. Amiodarone should never be stopped abruptly without provider guidance.",
    s: "Pharmacology"
  },

  // ===== PSYCHIATRIC EMERGENCIES (Questions 41-50) =====
  {
    q: "A nurse in the emergency department is assessing a client who ingested an unknown quantity of benzodiazepines 30 minutes ago. The client is lethargic with a respiratory rate of 8 breaths per minute and oxygen saturation of 88%. What is the priority intervention?",
    o: ["Administer flumazenil as prescribed and support the airway with bag-valve-mask ventilation", "Induce vomiting with syrup of ipecac", "Administer activated charcoal via nasogastric tube", "Observe the client and wait for the drug to metabolize naturally"],
    a: 0,
    r: "Benzodiazepine overdose causing respiratory depression requires airway support and flumazenil (a competitive benzodiazepine antagonist). However, flumazenil must be used cautiously as it can precipitate seizures in clients with chronic benzodiazepine use or mixed overdoses. Airway management is the immediate priority. Ipecac is no longer recommended due to aspiration risk. Activated charcoal may be considered but airway takes priority. Observation without intervention risks respiratory arrest.",
    s: "Psychiatry"
  },
  {
    q: "A client on haloperidol develops a temperature of 40.8 degrees Celsius, severe muscle rigidity, diaphoresis, and altered level of consciousness. Creatine kinase level is 15,000 IU/L. The nurse suspects which condition?",
    o: ["Neuroleptic malignant syndrome", "Serotonin syndrome", "Malignant hyperthermia", "Acute dystonic reaction"],
    a: 0,
    r: "Neuroleptic malignant syndrome (NMS) is a life-threatening reaction to antipsychotics (especially high-potency agents like haloperidol). It presents with the classic tetrad: hyperthermia, severe muscle rigidity (lead-pipe rigidity), autonomic instability (diaphoresis, tachycardia), and altered mental status. Markedly elevated CK from muscle breakdown is characteristic. Serotonin syndrome presents with clonus, hyperreflexia, and diarrhea. Malignant hyperthermia occurs during anesthesia. Acute dystonia involves involuntary muscle contractions without hyperthermia.",
    s: "Psychiatry"
  },
  {
    q: "A client brought to the emergency department by police is agitated, paranoid, has dilated pupils, tachycardia, and a temperature of 39.2 degrees Celsius. The client reports hearing voices commanding harm. Urine drug screen is positive for methamphetamine. What is the priority nursing intervention?",
    o: ["Ensure staff safety, administer benzodiazepines as prescribed, and provide a low-stimulation environment", "Physically restrain the client immediately and administer haloperidol", "Confront the client's paranoid delusions with reality orientation", "Discharge the client once the drug screen results are obtained"],
    a: 0,
    r: "Methamphetamine intoxication with psychosis requires safety measures, pharmacological management with benzodiazepines (first-line for stimulant-induced agitation), and a calm, low-stimulation environment. Physical restraints increase the risk of hyperthermia and rhabdomyolysis. Haloperidol can lower the seizure threshold. Confronting delusions escalates agitation. Discharge is inappropriate with active psychosis, hyperthermia, and tachycardia requiring monitoring and treatment.",
    s: "Psychiatry"
  },
  {
    q: "A nurse is caring for a client who has taken a large quantity of acetaminophen approximately 4 hours ago. The serum acetaminophen level is plotted above the treatment line on the Rumack-Matthew nomogram. What medication should the nurse anticipate administering?",
    o: ["N-acetylcysteine (Mucomyst)", "Naloxone (Narcan)", "Flumazenil (Romazicon)", "Activated charcoal only"],
    a: 0,
    r: "N-acetylcysteine (NAC) is the specific antidote for acetaminophen toxicity. It replenishes glutathione stores and prevents the toxic metabolite NAPQI from causing hepatocellular necrosis. When the level falls above the treatment line on the Rumack-Matthew nomogram at 4 hours post-ingestion, NAC must be initiated. Naloxone reverses opioids. Flumazenil reverses benzodiazepines. Activated charcoal may help if given within 1-2 hours of ingestion but is not the definitive treatment.",
    s: "Psychiatry"
  },
  {
    q: "A client with schizophrenia on clozapine has routine blood work showing a white blood cell count of 2,800 cells/mm3 and an absolute neutrophil count of 1,200 cells/mm3. What is the appropriate nursing action?",
    o: ["Hold clozapine and notify the prescriber immediately about agranulocytosis risk", "Continue clozapine as prescribed since the values are within normal limits", "Administer filgrastim (G-CSF) prophylactically and continue clozapine", "Obtain blood cultures and initiate empiric antibiotics"],
    a: 0,
    r: "Clozapine carries a significant risk of agranulocytosis (severe neutropenia). An ANC below 1,500 cells/mm3 requires holding the medication and immediately notifying the prescriber. Clozapine requires mandatory regular blood monitoring through a restricted distribution program (REMS). The WBC and ANC are below acceptable thresholds; this is not normal. G-CSF may be considered but the decision rests with the prescriber. Blood cultures and antibiotics are indicated if the client has fever, not prophylactically.",
    s: "Psychiatry"
  },
  {
    q: "A nurse is performing a suicide risk assessment on a client who reports suicidal ideation. Which factor represents the highest immediate risk for completed suicide?",
    o: ["The client has a specific plan, access to a firearm, and lives alone", "The client reports passive thoughts of death but no plan", "The client has a history of depression but is currently on medication", "The client reports feeling sad after a recent breakup"],
    a: 0,
    r: "The highest risk for completed suicide includes a specific plan, access to lethal means (especially firearms), and lack of social support (living alone). These factors together indicate imminent danger requiring immediate intervention (one-to-one observation, safety planning, and possible involuntary commitment). Passive ideation without a plan is lower risk. Current medication compliance reduces but does not eliminate risk. Situational sadness without ideation or plan is the lowest risk.",
    s: "Psychiatry"
  },
  {
    q: "A client on a selective serotonin reuptake inhibitor (SSRI) is started on tramadol for pain management. Within hours, the client develops agitation, myoclonus, hyperreflexia, diarrhea, and diaphoresis. The nurse suspects which condition?",
    o: ["Serotonin syndrome", "Neuroleptic malignant syndrome", "Opioid overdose", "Anticholinergic toxicity"],
    a: 0,
    r: "Serotonin syndrome occurs from excess serotonergic activity, often from combining serotonergic drugs (SSRIs with tramadol, which also has serotonin reuptake inhibition). Symptoms include mental status changes (agitation, confusion), neuromuscular abnormalities (myoclonus, hyperreflexia, clonus), and autonomic instability (diaphoresis, tachycardia, diarrhea). NMS presents with rigidity rather than hyperreflexia. Opioid overdose causes CNS depression, not agitation. Anticholinergic toxicity causes dry skin, urinary retention, and mydriasis.",
    s: "Psychiatry"
  },
  {
    q: "A client in alcohol withdrawal develops generalized tonic-clonic seizures. After the seizure resolves, the nurse should anticipate which medication order?",
    o: ["IV lorazepam or diazepam per the alcohol withdrawal protocol", "IV phenytoin loading dose", "Oral naltrexone for alcohol craving", "Intramuscular haloperidol for agitation"],
    a: 0,
    r: "Benzodiazepines (lorazepam, diazepam, chlordiazepoxide) are the first-line treatment for alcohol withdrawal seizures. They act on GABA receptors to prevent further seizure activity and progression to delirium tremens. Phenytoin is not effective for alcohol withdrawal seizures specifically. Naltrexone is for long-term alcohol use disorder management, not acute withdrawal. Haloperidol lowers the seizure threshold and can worsen the situation.",
    s: "Psychiatry"
  },
  {
    q: "A client is brought to the emergency department after a suicide attempt by hanging. The client is conscious and breathing but has ligature marks on the neck. After ensuring airway patency, what is the priority nursing concern?",
    o: ["Cervical spine immobilization and assessment for vascular and airway injury", "Immediate psychiatric evaluation for involuntary commitment", "Application of antibiotic ointment to the ligature marks", "Discharge planning with outpatient psychiatric follow-up"],
    a: 0,
    r: "Near-hanging can cause cervical spine injury, vascular damage (carotid or vertebral artery dissection), laryngeal fracture, and delayed airway edema. Cervical spine immobilization and thorough assessment of airway, vascular, and neurological structures are the immediate priorities after ensuring airway patency. Psychiatric evaluation is essential but comes after medical stabilization. Wound care is secondary to life-threatening injuries. Discharge is premature without full evaluation.",
    s: "Psychiatry"
  },
  {
    q: "A nurse is caring for a client involuntarily committed to a psychiatric unit who is refusing medication. The client is alert, oriented, and not in imminent danger. What is the appropriate nursing action?",
    o: ["Respect the client's right to refuse and document the refusal while notifying the provider", "Administer the medication covertly in the client's food", "Obtain a court order to forcibly administer the medication", "Restrain the client and administer the medication intramuscularly"],
    a: 0,
    r: "Involuntary commitment does not automatically remove a client's right to refuse treatment unless there is imminent danger or a court order specifically authorizing forced medication. The nurse must respect the refusal, document it, and notify the provider. Covert medication administration violates the client's rights and is unethical. A court order may eventually be sought but is not an immediate nursing action. Physical restraint for medication administration without legal authority is assault.",
    s: "Psychiatry"
  },

  // ===== MATERNAL HIGH-RISK (Questions 51-60) =====
  {
    q: "A client at 34 weeks gestation presents with a blood pressure of 168/110 mmHg, proteinuria of 3+, headache, and epigastric pain. Laboratory results show platelet count of 85,000/mm3 and elevated liver enzymes. The nurse recognizes this as which condition?",
    o: ["Severe preeclampsia with HELLP syndrome", "Gestational hypertension", "Chronic hypertension with superimposed preeclampsia", "Eclampsia"],
    a: 0,
    r: "The triad of Hemolysis, Elevated Liver enzymes, and Low Platelets (HELLP syndrome) is a severe complication of preeclampsia. This client shows severe features: BP over 160/110, significant proteinuria, headache (cerebral irritability), epigastric pain (hepatic capsule distension), thrombocytopenia, and elevated liver enzymes. Gestational hypertension lacks proteinuria and organ damage. Chronic hypertension is present before 20 weeks. Eclampsia requires seizures to be present.",
    s: "Maternal"
  },
  {
    q: "A nurse is administering IV magnesium sulfate to a client with severe preeclampsia. The client's respiratory rate drops to 10 breaths per minute, and deep tendon reflexes are absent. What is the priority action?",
    o: ["Stop the magnesium infusion and prepare to administer calcium gluconate", "Decrease the magnesium infusion rate by half", "Continue the infusion and reposition the client on her left side", "Administer oxygen at 2 liters per minute via nasal cannula"],
    a: 0,
    r: "Respiratory depression (less than 12/min) and absent deep tendon reflexes are signs of magnesium toxicity. The infusion must be stopped immediately, and calcium gluconate (the antidote) must be administered to reverse the effects. Continuing or simply reducing the rate allows further toxicity. Repositioning does not address the pharmacological crisis. Oxygen supports but does not reverse the toxicity. Magnesium levels should also be checked.",
    s: "Maternal"
  },
  {
    q: "A client who delivered vaginally 1 hour ago is experiencing heavy vaginal bleeding. The fundus is boggy and located 3 centimeters above the umbilicus. What is the priority nursing intervention?",
    o: ["Perform vigorous fundal massage and express clots", "Prepare the client for emergency hysterectomy", "Administer IV oxytocin and elevate the client's legs", "Insert a Foley catheter and obtain a blood type and crossmatch"],
    a: 0,
    r: "A boggy, displaced uterus with heavy bleeding indicates uterine atony, the most common cause of postpartum hemorrhage. The first intervention is fundal massage to stimulate uterine contraction and expel clots. If the uterus remains atonic, uterotonic medications (oxytocin, methylergonovine, carboprost) are administered. Hysterectomy is a last resort. IV oxytocin is appropriate but fundal massage is the immediate hands-on intervention. Foley catheter and labs are important but secondary to stopping the bleeding.",
    s: "Maternal"
  },
  {
    q: "A client at 28 weeks gestation presents with painless, bright red vaginal bleeding. Vital signs are stable, and the fetal heart rate is reassuring. The nurse should avoid which assessment?",
    o: ["Digital cervical examination", "External fetal monitoring", "Ultrasound for placental location", "IV access with large-bore catheter"],
    a: 0,
    r: "Painless bright red vaginal bleeding in the third trimester is the hallmark presentation of placenta previa. Digital cervical examination is absolutely contraindicated because it can disrupt the placenta, causing massive hemorrhage. Diagnosis is confirmed by transabdominal ultrasound. External fetal monitoring is appropriate to assess fetal status. IV access is necessary for potential fluid resuscitation and blood transfusion.",
    s: "Maternal"
  },
  {
    q: "A laboring client at 39 weeks gestation suddenly develops sharp, constant abdominal pain with a rigid, board-like abdomen. The fetal heart rate monitor shows late decelerations with decreasing variability. Vaginal bleeding is dark red. The nurse suspects which emergency?",
    o: ["Placental abruption", "Uterine rupture", "Placenta previa", "Umbilical cord prolapse"],
    a: 0,
    r: "Placental abruption presents with sudden-onset sharp abdominal pain, uterine rigidity (board-like abdomen), dark red vaginal bleeding (retroplacental hemorrhage), and signs of fetal distress (late decelerations, decreased variability). It is an obstetric emergency requiring immediate delivery. Uterine rupture typically presents with loss of fetal station and a palpable fetal part. Placenta previa causes painless bright red bleeding. Cord prolapse presents with variable decelerations after membrane rupture.",
    s: "Maternal"
  },
  {
    q: "A client at 32 weeks gestation with preeclampsia has been receiving betamethasone. The nurse understands that the primary purpose of this medication is to do which of the following?",
    o: ["Accelerate fetal lung maturity by stimulating surfactant production", "Lower the maternal blood pressure", "Prevent seizure activity in the mother", "Reduce uterine contractions and prevent preterm labor"],
    a: 0,
    r: "Betamethasone is an antenatal corticosteroid administered between 24-34 weeks gestation when preterm delivery is anticipated. Its primary purpose is to accelerate fetal lung maturation by stimulating surfactant production, reducing the incidence and severity of respiratory distress syndrome in the neonate. It does not lower blood pressure (may actually increase it). Magnesium sulfate prevents seizures. Tocolytics (terbutaline, nifedipine) reduce contractions.",
    s: "Maternal"
  },
  {
    q: "A client develops disseminated intravascular coagulation (DIC) following an amniotic fluid embolism. Which set of laboratory findings is consistent with DIC?",
    o: ["Prolonged PT and aPTT, decreased fibrinogen, elevated D-dimer, and thrombocytopenia", "Shortened PT and aPTT, elevated fibrinogen, and normal platelet count", "Isolated thrombocytopenia with normal coagulation studies", "Elevated fibrinogen, decreased D-dimer, and normal platelet count"],
    a: 0,
    r: "DIC is a consumptive coagulopathy where widespread clotting depletes clotting factors and platelets, followed by pathological bleeding. Laboratory hallmarks include prolonged PT and aPTT (depleted clotting factors), decreased fibrinogen (consumed in clot formation), elevated D-dimer and fibrin degradation products (fibrinolysis), and thrombocytopenia (platelet consumption). The other options describe the opposite of DIC pathophysiology.",
    s: "Maternal"
  },
  {
    q: "A nurse is monitoring a client in labor. The fetal heart rate tracing shows repetitive variable decelerations with slow return to baseline and absent variability. What is the priority nursing action?",
    o: ["Reposition the client, administer oxygen, perform a vaginal exam to assess for cord prolapse, and notify the provider", "Continue monitoring without intervention since variable decelerations are benign", "Increase the oxytocin infusion to expedite delivery", "Prepare the client for an immediate cesarean section without further assessment"],
    a: 0,
    r: "Variable decelerations with slow return to baseline (overshoots) and absent variability are concerning for fetal compromise, potentially from cord compression. The nurse should reposition the client (hands and knees or side-lying), administer oxygen, check for cord prolapse, and notify the provider urgently. Variable decelerations with these features are not benign. Increasing oxytocin worsens fetal compromise. While cesarean may be needed, assessment must come first.",
    s: "Maternal"
  },
  {
    q: "A client at 36 weeks gestation with gestational diabetes has a fasting blood glucose of 7.8 mmol/L (140 mg/dL) on two consecutive days despite diet modifications. The nurse anticipates which change in the treatment plan?",
    o: ["Initiation of insulin therapy", "Continuation of diet therapy with rechecking in 2 weeks", "Prescription of metformin as first-line pharmacological therapy", "Induction of labor within 24 hours"],
    a: 0,
    r: "Gestational diabetes with fasting glucose consistently above target (greater than 5.3 mmol/L or 95 mg/dL) despite dietary modifications requires pharmacological intervention. Insulin is the preferred treatment in pregnancy as it does not cross the placenta. Continuing diet alone when glucose is not controlled risks macrosomia, birth injuries, and neonatal hypoglycemia. While metformin may be used, insulin remains first-line. Immediate induction is not indicated solely for elevated fasting glucose.",
    s: "Maternal"
  },
  {
    q: "A postpartum client reports that she has been feeling extremely sad, unable to bond with her newborn, has thoughts of harming herself, and has not slept in 5 days despite opportunities. What is the priority nursing intervention?",
    o: ["Assess for suicidal ideation with a safety plan and initiate an urgent psychiatric referral", "Reassure the client that baby blues are normal and will resolve in 2 weeks", "Administer a sedative to help the client sleep", "Encourage the client to try harder to bond with the baby"],
    a: 0,
    r: "This client's symptoms (inability to bond, suicidal ideation, severe insomnia for 5 days) exceed normal baby blues and indicate postpartum depression with possible psychosis risk. Suicidal ideation requires immediate safety assessment and psychiatric referral. This should not be dismissed as baby blues, which typically resolve within 2 weeks and do not include suicidal thoughts. Sedation does not address the underlying condition. Telling the client to try harder invalidates her experience and is harmful.",
    s: "Maternal"
  },

  // ===== PEDIATRIC EMERGENCIES (Questions 61-70) =====
  {
    q: "A 3-year-old child is brought to the emergency department with a barking cough, inspiratory stridor, and mild intercostal retractions. The child is sitting comfortably and is afebrile. Oxygen saturation is 97%. What is the priority intervention?",
    o: ["Administer nebulized racemic epinephrine and oral dexamethasone", "Obtain a lateral neck X-ray to rule out epiglottitis", "Intubate the child immediately for airway protection", "Administer IV antibiotics for suspected bacterial tracheitis"],
    a: 0,
    r: "This presentation is classic for moderate croup (laryngotracheobronchitis). The barking cough, stridor at rest, and retractions indicate moderate severity. Treatment includes nebulized racemic epinephrine for rapid symptom relief and dexamethasone (oral or IM) to reduce airway inflammation. The child is stable, so X-ray delays treatment. Intubation is reserved for severe respiratory failure. Croup is viral; antibiotics are not indicated. The child should be observed for a minimum of 2-4 hours after epinephrine for rebound symptoms.",
    s: "Pediatrics"
  },
  {
    q: "A 5-year-old child is found unresponsive in a swimming pool. After being pulled from the water, the child has no pulse and is not breathing. According to pediatric resuscitation guidelines, what is the first action?",
    o: ["Deliver 5 rescue breaths followed by CPR at a 30:2 ratio for a lone rescuer", "Begin chest compressions immediately at a 30:2 ratio", "Attach an AED and deliver a shock before beginning CPR", "Clear the airway with abdominal thrusts before attempting ventilation"],
    a: 0,
    r: "In drowning (submersion injury), the primary arrest mechanism is hypoxia, not cardiac dysrhythmia. Therefore, rescue breathing takes priority. Pediatric resuscitation guidelines for drowning recommend starting with 5 rescue breaths to address the hypoxic cause before beginning CPR. Standard CPR begins with compressions for sudden cardiac arrest but drowning is an exception. AED is used but after addressing ventilation. Abdominal thrusts are for foreign body airway obstruction, not drowning.",
    s: "Pediatrics"
  },
  {
    q: "A 2-month-old infant presents with fever of 39.2 degrees Celsius, irritability, bulging fontanelle, and high-pitched cry. The nurse should prepare for which priority intervention?",
    o: ["Blood cultures, lumbar puncture, and empiric IV antibiotics for suspected meningitis", "Acetaminophen administration and discharge with follow-up in 24 hours", "Observation for 4 hours with serial temperature checks", "CT scan of the head before any other intervention"],
    a: 0,
    r: "In an infant under 3 months with fever and signs of meningitis (bulging fontanelle, irritability, high-pitched cry), a full sepsis workup including blood cultures, urinalysis, and lumbar puncture must be performed, and empiric IV antibiotics started immediately. Neonatal meningitis can be rapidly fatal. Discharge is inappropriate for a febrile neonate. Observation delays critical treatment. CT may be needed but should not delay antibiotics in a critically ill infant.",
    s: "Pediatrics"
  },
  {
    q: "A 7-year-old child with known peanut allergy develops hives, facial swelling, wheezing, and hypotension after accidental exposure. The nurse should administer which medication first?",
    o: ["Intramuscular epinephrine in the anterolateral thigh", "IV diphenhydramine for allergic reaction", "Nebulized albuterol for bronchospasm", "Oral prednisone for inflammation reduction"],
    a: 0,
    r: "Anaphylaxis (multisystem allergic reaction with hypotension) requires immediate intramuscular epinephrine in the anterolateral thigh. This is the first-line, life-saving treatment. Epinephrine reverses bronchospasm, restores blood pressure, and reduces angioedema. Diphenhydramine treats hives but does not reverse anaphylaxis. Albuterol helps bronchospasm but does not address cardiovascular collapse. Oral prednisone acts too slowly and cannot reverse acute anaphylaxis.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a child with diabetic ketoacidosis (DKA). The child is receiving IV insulin infusion and fluids. The blood glucose has decreased from 28 mmol/L to 14 mmol/L in 2 hours. The child develops a headache and becomes increasingly drowsy. What complication does the nurse suspect?",
    o: ["Cerebral edema from rapid osmotic shifts", "Hypoglycemia from excessive insulin", "Hypernatremia from aggressive fluid resuscitation", "Insulin allergy causing CNS depression"],
    a: 0,
    r: "Cerebral edema is the most serious complication of DKA treatment in children. Rapid correction of hyperglycemia causes osmotic fluid shifts into brain cells, leading to cerebral edema. Warning signs include headache, altered mental status, bradycardia, and hypertension (Cushing triad). Blood glucose has dropped significantly but is not yet hypoglycemic at 14 mmol/L. The rate of glucose correction should not exceed 3-5 mmol/L per hour. This requires immediate intervention with IV mannitol or hypertonic saline.",
    s: "Pediatrics"
  },
  {
    q: "An 18-month-old child is brought to the emergency department with a witnessed seizure lasting 8 minutes. The child is post-ictal and has a temperature of 40.1 degrees Celsius. The nurse should take which action first?",
    o: ["Ensure airway patency, place the child in a recovery position, and administer antipyretics", "Restrain the child and insert an oral airway", "Obtain an emergent EEG to rule out epilepsy", "Administer IV phenytoin for seizure prevention"],
    a: 0,
    r: "A simple febrile seizure in a child between 6 months and 5 years with high fever requires airway management (recovery position, suction if needed) and temperature reduction with antipyretics. The seizure has already stopped, so the focus is post-ictal care. Restraint and oral airway insertion are contraindicated during and after seizures. Emergent EEG is not indicated for a first simple febrile seizure. Anticonvulsant medication is not routinely needed for simple febrile seizures.",
    s: "Pediatrics"
  },
  {
    q: "A 4-year-old child with acute lymphoblastic leukemia develops petechiae, gingival bleeding, and a platelet count of 12,000/mm3. What is the priority nursing intervention?",
    o: ["Institute bleeding precautions and prepare for platelet transfusion", "Encourage vigorous tooth brushing to improve oral hygiene", "Administer aspirin for any associated pain", "Allow normal activity including playground time"],
    a: 0,
    r: "A platelet count of 12,000/mm3 places the child at high risk for spontaneous hemorrhage. Bleeding precautions (soft toothbrush, no rectal temperatures, pad sharp corners, limit invasive procedures) must be instituted, and platelet transfusion is indicated for active bleeding or counts below 10,000-20,000. Vigorous tooth brushing causes mucosal trauma and bleeding. Aspirin inhibits platelet function and is contraindicated. Activity restrictions are needed to prevent trauma-related bleeding.",
    s: "Pediatrics"
  },
  {
    q: "A 6-month-old infant presents with intermittent episodes of inconsolable crying with legs drawn up to the abdomen, followed by periods of lethargy. The nurse notes a sausage-shaped mass in the right upper quadrant and currant jelly stools. What condition does the nurse suspect?",
    o: ["Intussusception", "Pyloric stenosis", "Hirschsprung disease", "Necrotizing enterocolitis"],
    a: 0,
    r: "The classic triad of intussusception includes episodic colicky abdominal pain (drawing legs up), a palpable sausage-shaped mass (telescoped bowel), and currant jelly stools (blood and mucus from vascular compromise). It is most common in infants 3-12 months. Pyloric stenosis presents with projectile vomiting and an olive-shaped mass. Hirschsprung disease presents with failure to pass meconium and constipation. Necrotizing enterocolitis occurs in premature neonates with abdominal distension and bloody stools.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for an 8-year-old child with suspected epiglottitis who is sitting upright, leaning forward with chin extended, and drooling. What action must the nurse avoid?",
    o: ["Inspecting the throat with a tongue depressor", "Allowing the child to maintain a position of comfort", "Preparing emergency intubation equipment at the bedside", "Administering humidified oxygen by blow-by method"],
    a: 0,
    r: "In suspected epiglottitis, direct visualization of the throat with a tongue depressor is absolutely contraindicated because it can trigger complete airway obstruction and respiratory arrest. The child should be kept calm, allowed to remain in the tripod position of comfort, and taken to the operating room for controlled intubation by an anesthesiologist. Emergency airway equipment must be readily available. Humidified oxygen by blow-by is acceptable as it is noninvasive and does not agitate the child.",
    s: "Pediatrics"
  },
  {
    q: "A 10-year-old child is admitted with acute asthma exacerbation. After receiving three consecutive nebulized albuterol treatments, the child shows no improvement, with oxygen saturation of 89%, severe wheezing, and use of accessory muscles. What is the next priority intervention?",
    o: ["Administer IV magnesium sulfate and prepare for continuous albuterol nebulization", "Discharge the child with a prescription for oral steroids", "Continue to wait for the albuterol to take effect", "Switch to an inhaled anticholinergic agent alone"],
    a: 0,
    r: "Status asthmaticus (severe asthma unresponsive to initial beta-agonist therapy) requires escalation. IV magnesium sulfate is a bronchodilator used as an adjunct in severe exacerbations, and continuous albuterol nebulization provides sustained bronchodilation. Systemic corticosteroids should also be administered if not already given. Discharge with ongoing respiratory distress is dangerous. Waiting without escalation risks respiratory failure. Anticholinergics (ipratropium) are used as adjuncts, not replacements for albuterol.",
    s: "Pediatrics"
  },

  // ===== DIABETES ACUTE COMPLICATIONS (Questions 71-80) =====
  {
    q: "A client with type 1 diabetes presents to the emergency department with blood glucose of 32 mmol/L (576 mg/dL), pH 7.18, serum bicarbonate of 10 mEq/L, and positive serum ketones. The nurse recognizes this as which condition?",
    o: ["Diabetic ketoacidosis", "Hyperosmolar hyperglycemic state", "Metabolic alkalosis", "Lactic acidosis"],
    a: 0,
    r: "Diabetic ketoacidosis (DKA) is characterized by the triad of hyperglycemia (usually greater than 14 mmol/L), metabolic acidosis (pH less than 7.3, bicarbonate less than 18), and ketonemia. It occurs most commonly in type 1 diabetes due to absolute insulin deficiency. HHS presents with extreme hyperglycemia (greater than 33 mmol/L) without significant ketosis. Metabolic alkalosis would show elevated pH and bicarbonate. Lactic acidosis has elevated lactate without ketones.",
    s: "Endocrine"
  },
  {
    q: "A nurse is managing a client with DKA receiving IV regular insulin infusion. The blood glucose has dropped to 14 mmol/L (250 mg/dL) but the pH remains 7.25. What change should the nurse anticipate?",
    o: ["Add dextrose to the IV fluids and continue the insulin infusion", "Discontinue the insulin infusion since the glucose is improving", "Switch to subcutaneous insulin and discharge the client", "Increase the insulin infusion rate to correct the acidosis faster"],
    a: 0,
    r: "In DKA management, the insulin infusion must continue until the acidosis is resolved (pH above 7.3, bicarbonate above 18, anion gap closed), not just until blood glucose normalizes. When glucose reaches 11-14 mmol/L (200-250 mg/dL), dextrose-containing IV fluids (D5W or D5NS) are added to prevent hypoglycemia while continuing insulin to clear ketones. Stopping insulin prematurely allows ketogenesis to continue. Increasing the rate accelerates glucose drop without proportionally faster ketone clearance.",
    s: "Endocrine"
  },
  {
    q: "A client with type 2 diabetes taking a sulfonylurea (glyburide) and who missed lunch presents with confusion, diaphoresis, tremors, and a blood glucose of 2.5 mmol/L (45 mg/dL). After administering IV dextrose, the glucose rises to 6.0 mmol/L. What should the nurse plan for?",
    o: ["Admit for observation with serial glucose monitoring and IV dextrose as needed for at least 24-48 hours", "Discharge the client after glucose normalizes with instructions to eat lunch", "Switch the client from glyburide to metformin before discharge", "Administer octreotide and discharge with a snack"],
    a: 0,
    r: "Sulfonylurea-induced hypoglycemia can be prolonged and recurrent because these agents have long half-lives (glyburide up to 24 hours). Admission with continuous glucose monitoring and IV dextrose availability is essential. Discharge after a single glucose correction risks rebound hypoglycemia. Medication changes are important but are outpatient decisions after stabilization. While octreotide may be used for refractory sulfonylurea hypoglycemia, observation is still required; discharge with a snack is insufficient.",
    s: "Endocrine"
  },
  {
    q: "An elderly client with type 2 diabetes presents with blood glucose of 42 mmol/L (756 mg/dL), serum osmolality of 340 mOsm/kg, pH 7.35, and negative serum ketones. The client is severely dehydrated and confused. The nurse suspects which condition?",
    o: ["Hyperosmolar hyperglycemic state (HHS)", "Diabetic ketoacidosis", "Diabetes insipidus", "Syndrome of inappropriate antidiuretic hormone"],
    a: 0,
    r: "Hyperosmolar hyperglycemic state (HHS) presents with extreme hyperglycemia (often greater than 33 mmol/L), hyperosmolality (greater than 320 mOsm/kg), severe dehydration, and altered mental status without significant ketosis or acidosis. It is more common in type 2 diabetes in elderly clients. DKA would show acidosis and ketones. Diabetes insipidus causes hypernatremia with dilute urine, not hyperglycemia. SIADH causes hyponatremia and fluid retention.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with DKA and notes the serum potassium is 3.2 mEq/L before starting the insulin infusion. What is the appropriate action?",
    o: ["Replace potassium before starting the insulin infusion", "Begin the insulin infusion immediately since hyperglycemia is the priority", "Administer IV calcium gluconate to protect the heart", "Restrict potassium intake to prevent further imbalance"],
    a: 0,
    r: "In DKA, insulin drives potassium intracellularly, which can cause dangerous hypokalemia if potassium is already low. If the serum potassium is below 3.3 mEq/L, potassium replacement must occur before starting insulin to prevent life-threatening cardiac dysrhythmias. Starting insulin with low potassium can cause fatal arrhythmia. Calcium gluconate protects the heart from hyperkalemia effects, not hypokalemia. Restricting potassium would worsen the deficit.",
    s: "Endocrine"
  },
  {
    q: "A client with type 1 diabetes using an insulin pump reports nausea, vomiting, and a blood glucose of 24 mmol/L (432 mg/dL). The nurse checks the pump and finds the infusion set was kinked. What is the priority action?",
    o: ["Remove the kinked set, administer a correction dose of rapid-acting insulin via syringe, and check for ketones", "Straighten the kinked tubing and continue the current basal rate", "Disconnect the pump and switch to long-acting insulin only", "Administer oral hypoglycemic medication and recheck glucose in 4 hours"],
    a: 0,
    r: "A kinked infusion set means the client has not been receiving insulin, placing them at risk for DKA. The malfunctioning set must be removed, and a correction dose given via syringe (since pump delivery is compromised). Ketones should be checked immediately to assess for DKA. Simply straightening the tubing does not account for the missed insulin. Switching to long-acting insulin requires provider consultation. Oral hypoglycemics are not appropriate for type 1 diabetes or acute hyperglycemia with pump failure.",
    s: "Endocrine"
  },
  {
    q: "A client recovering from DKA in the ICU has an arterial blood gas showing pH 7.32, PaCO2 25 mmHg, HCO3 14 mEq/L. The nurse interprets this as which acid-base imbalance?",
    o: ["Partially compensated metabolic acidosis", "Fully compensated respiratory alkalosis", "Uncompensated metabolic acidosis", "Mixed respiratory and metabolic acidosis"],
    a: 0,
    r: "The pH of 7.32 is acidotic. The low HCO3 of 14 indicates metabolic acidosis (primary disorder in DKA). The low PaCO2 of 25 shows respiratory compensation (hyperventilation to blow off CO2). Since the pH is still abnormal but the PaCO2 is moving in the compensatory direction, this is partially compensated metabolic acidosis. If fully compensated, pH would be within normal range. Uncompensated would show normal PaCO2. Mixed disorder would have both values contributing to acidosis.",
    s: "Endocrine"
  },
  {
    q: "A nurse is teaching a client with type 1 diabetes about sick-day management rules. Which client statement indicates understanding?",
    o: ["I should never stop taking my insulin, even if I cannot eat, and I should check my blood glucose every 2-4 hours", "I should stop my insulin if I am not eating to avoid hypoglycemia", "I only need to check my glucose once daily when I am sick", "I should double my insulin dose anytime I feel sick"],
    a: 0,
    r: "During illness, counter-regulatory hormones (cortisol, glucagon, epinephrine) increase blood glucose, making insulin more important than ever. Clients should never omit insulin, should monitor glucose every 2-4 hours, check ketones, stay hydrated, and contact their provider if glucose remains elevated or ketones are present. Stopping insulin during illness causes hyperglycemia and DKA. Once-daily monitoring is insufficient. Doubling the dose without glucose data risks hypoglycemia.",
    s: "Endocrine"
  },
  {
    q: "A client presents with Kussmaul respirations, fruity breath odor, abdominal pain, and altered mental status. Blood glucose is 26 mmol/L. After confirming DKA, what is the first IV fluid the nurse should anticipate administering?",
    o: ["0.9% normal saline (isotonic crystalloid)", "Dextrose 5% in water", "0.45% half-normal saline", "Lactated Ringer's solution with potassium"],
    a: 0,
    r: "Initial fluid resuscitation in DKA begins with 0.9% normal saline (NS) to restore intravascular volume, which is typically severely depleted (average deficit 5-7 liters). Isotonic fluids prevent rapid osmotic shifts. After the first 1-2 liters, the fluid may be changed to 0.45% NS based on corrected sodium levels. D5W is added later when glucose drops to 11-14 mmol/L. Half-normal saline is used after initial resuscitation. Lactated Ringer's contains potassium and lactate that complicate management.",
    s: "Endocrine"
  },
  {
    q: "A client with type 2 diabetes on metformin is scheduled for coronary artery bypass graft surgery. The nurse notes that the metformin was held 48 hours before surgery. What is the rationale for this practice?",
    o: ["To prevent lactic acidosis during periods of hemodynamic instability and reduced renal perfusion", "To prevent hypoglycemia during the fasting period before surgery", "To allow the client's blood glucose to rise for better wound healing", "To prevent drug interactions with anesthetic agents"],
    a: 0,
    r: "Metformin is held before major surgery because hemodynamic instability, hypotension, and reduced renal perfusion during surgery can impair lactate clearance, and metformin inhibits hepatic gluconeogenesis from lactate. This combination can cause life-threatening lactic acidosis. Metformin alone rarely causes hypoglycemia, so that is not the primary concern. Elevated glucose impairs wound healing, not improves it. There are no significant anesthetic drug interactions with metformin.",
    s: "Endocrine"
  },

  // ===== LEADERSHIP & DELEGATION (Questions 81-90) =====
  {
    q: "An RN is supervising an LPN/LVN caring for a group of medical-surgical clients. Which task is appropriate to delegate to the LPN/LVN?",
    o: ["Administering oral medications to stable clients and documenting their responses", "Performing the initial admission assessment on a newly arrived client", "Developing the nursing care plan for a client with a new diagnosis", "Interpreting cardiac rhythm strips and adjusting medication drips"],
    a: 0,
    r: "LPN/LVNs can administer oral medications (and some states allow IV medications under specific conditions) to stable clients and document responses. Initial admission assessments, care plan development, and clinical judgment activities (interpreting rhythms, titrating drips) require RN-level education, licensure, and critical thinking. These tasks involve the nursing process steps of assessment, diagnosis, planning, and evaluation that cannot be delegated.",
    s: "Leadership"
  },
  {
    q: "A charge nurse receives report that the unit is short-staffed with one RN, one LPN, and one unlicensed assistive personnel (UAP) for 12 clients. Which assignment is most appropriate?",
    o: ["RN takes the most complex/unstable clients, LPN takes stable medical clients, UAP assists with activities of daily living", "UAP takes the most stable clients independently including medication administration", "LPN performs all initial assessments while the RN handles administrative tasks", "All three staff members share clients equally regardless of complexity"],
    a: 0,
    r: "Safe delegation follows the principle of matching client needs with provider competency. The RN must care for unstable, complex clients requiring assessment, clinical judgment, and evaluation. The LPN can care for stable clients with predictable outcomes, performing delegated nursing tasks. The UAP can perform tasks such as vital signs, ADL assistance, and ambulation under supervision. UAPs cannot administer medications or perform assessments. Equal distribution ignores scope of practice.",
    s: "Leadership"
  },
  {
    q: "During a mass casualty event, the nurse triaging victims using the START system encounters a victim who is apneic after repositioning the airway. The victim is tagged with which color?",
    o: ["Black (expectant/deceased)", "Red (immediate)", "Yellow (delayed)", "Green (minor)"],
    a: 0,
    r: "In the START (Simple Triage and Rapid Treatment) system, if a victim is apneic even after repositioning the airway, they are tagged black (expectant/deceased). Resources in a mass casualty event are allocated to save the most lives. Red tags are for victims with immediate life-threatening conditions that are survivable with rapid intervention. Yellow is for injuries requiring treatment but can wait. Green is for walking wounded with minor injuries.",
    s: "Leadership"
  },
  {
    q: "A nurse witnesses a colleague diverting controlled substances by signing out narcotics for clients but not administering them. What is the nurse's legal and ethical obligation?",
    o: ["Report the observation to the nurse manager and follow the facility's chain of command", "Confront the colleague privately and give them a chance to self-report", "Ignore the situation since the colleague may have a valid reason", "Document the observation in the client's medical record"],
    a: 0,
    r: "Drug diversion is a serious legal violation and patient safety issue. The nurse has a mandatory obligation to report suspected diversion through the facility's chain of command (nurse manager, supervisor, compliance department). Confronting the colleague may allow evidence destruction and does not fulfill the reporting obligation. Ignoring the behavior enables continued diversion and endangers clients. Client medical records are not the appropriate venue for staff misconduct documentation.",
    s: "Leadership"
  },
  {
    q: "A nurse receives a physician order that appears to have an unusually high dose of a medication. What is the appropriate first action?",
    o: ["Clarify the order directly with the prescribing physician before administering", "Administer the medication as ordered since the physician knows best", "Refuse to administer and document the refusal without contacting the physician", "Ask another nurse to verify and co-sign the medication before administering"],
    a: 0,
    r: "The nurse has a professional and legal obligation to question any order that appears unsafe. The first step is to clarify directly with the prescribing physician. Administering a potentially unsafe dose makes the nurse liable for any adverse outcome. Refusing without clarification does not resolve the clinical need. Having another nurse verify does not make an incorrect dose safe; it just involves another person in the error.",
    s: "Leadership"
  },
  {
    q: "A charge nurse is making client assignments for the night shift. An experienced nurse requests not to care for a particular client due to a personal conflict of interest. What should the charge nurse do?",
    o: ["Reassign the client to another qualified nurse to maintain professional boundaries", "Insist the nurse care for the client to build professional resilience", "Report the nurse to the manager for refusing an assignment", "Allow the nurse to decide which clients to care for each shift"],
    a: 0,
    r: "When a nurse identifies a genuine conflict of interest that could affect client care (such as caring for a family member or someone involved in a personal conflict), the charge nurse should reassign the client to maintain professional boundaries and ensure unbiased care. Forcing the assignment risks compromised care quality. This is not a disciplinary issue but a professional boundary concern. Allowing nurses to choose all assignments is impractical and not the role of a charge nurse.",
    s: "Leadership"
  },
  {
    q: "A nurse manager is implementing a quality improvement project to reduce catheter-associated urinary tract infections (CAUTIs). Which approach demonstrates evidence-based leadership?",
    o: ["Review current evidence-based catheter care bundles, implement standardized protocols, and audit compliance with outcome tracking", "Allow each nurse to decide their own catheter care practices based on personal preference", "Require urinalysis on all catheterized clients daily regardless of symptoms", "Discontinue all urinary catheter use on the unit to eliminate the risk entirely"],
    a: 0,
    r: "Evidence-based practice in quality improvement involves reviewing current best evidence (catheter care bundles from organizations like the CDC), implementing standardized protocols (daily necessity reviews, aseptic insertion, proper maintenance), auditing compliance, and tracking outcomes. Individual preference leads to inconsistent care. Daily urinalysis increases unnecessary antibiotic use. Eliminating all catheters is unrealistic as some clients require them.",
    s: "Leadership"
  },
  {
    q: "During shift handoff, the outgoing nurse reports that a client's condition has deteriorated, but the nurse did not call the rapid response team or notify the physician. What should the incoming nurse do first?",
    o: ["Immediately assess the client and activate the rapid response team if indicated", "Complete the full handoff report before going to see the client", "Document that the outgoing nurse failed to escalate care", "Contact the nurse manager to report the outgoing nurse's negligence"],
    a: 0,
    r: "Client safety is the immediate priority. The incoming nurse must assess the deteriorating client and activate the rapid response team or notify the physician as warranted. Waiting to complete handoff delays critical intervention. While documentation and reporting the outgoing nurse's failure to escalate are important for follow-up, they must not take priority over the client's immediate safety needs.",
    s: "Leadership"
  },
  {
    q: "An RN delegates blood glucose monitoring to a UAP for a stable diabetic client. The UAP reports a result of 2.8 mmol/L (50 mg/dL). What should the RN do?",
    o: ["Immediately verify the result, assess the client for hypoglycemia symptoms, and intervene per protocol", "Thank the UAP and document the result without further action", "Ask the UAP to repeat the test and administer orange juice if it is still low", "Assume the result is a machine error and continue monitoring"],
    a: 0,
    r: "While UAPs can perform blood glucose monitoring, the RN retains responsibility for interpreting results and intervening. A glucose of 2.8 mmol/L is critically low and requires the RN to verify the result, assess the client (level of consciousness, diaphoresis, tremors), and follow the hypoglycemia protocol (administer glucose, recheck). Documentation without action neglects the client. Asking the UAP to treat is outside UAP scope. Assuming machine error delays life-saving treatment.",
    s: "Leadership"
  },
  {
    q: "A nurse is caring for a client who speaks only Mandarin. The client's adult daughter offers to interpret. What is the most appropriate action?",
    o: ["Arrange for a certified medical interpreter or use hospital interpreter services", "Accept the daughter's offer since she can communicate with the client", "Use hand gestures and visual aids instead of an interpreter", "Postpone all communication until a Mandarin-speaking nurse is available"],
    a: 0,
    r: "Professional certified medical interpreters must be used for accuracy, confidentiality, and compliance with federal regulations (language access requirements). Family members should not serve as interpreters because of potential for inaccurate translation, omission of sensitive information, and violation of the client's privacy. The client may not disclose important health information through family. Hand gestures are insufficient for medical communication. Postponing communication delays care.",
    s: "Leadership"
  },

  // ===== ETHICAL & LEGAL ISSUES (Questions 91-100) =====
  {
    q: "A competent adult client with terminal cancer refuses further chemotherapy and requests comfort measures only. The client's family insists that treatment continue. What should the nurse do?",
    o: ["Advocate for the client's wishes and support the right to refuse treatment", "Follow the family's request and continue chemotherapy", "Contact the hospital ethics committee to make the decision", "Withhold information from the family to avoid conflict"],
    a: 0,
    r: "A competent adult has the autonomous right to refuse treatment, including life-sustaining therapy. The nurse must advocate for the client's wishes as documented in the advance directive or expressed verbally. The family cannot override a competent client's decision. While the ethics committee may be consulted for support, the client's decision is clear and does not require committee approval. Withholding information from the family is deceptive and unhelpful.",
    s: "Ethics"
  },
  {
    q: "A nurse discovers that a colleague made a medication error but did not report it. The client appears unharmed. What is the nurse's professional obligation?",
    o: ["Report the error through the proper incident reporting system and ensure the client is assessed", "Keep the information confidential to protect the colleague's career", "Wait to see if the client develops symptoms before reporting", "Advise the colleague to report it and take no further action if they refuse"],
    a: 0,
    r: "All medication errors must be reported regardless of whether harm occurred. Reporting through the incident reporting system allows root cause analysis, process improvement, and ensures the client is properly assessed for delayed effects. Concealing errors violates professional standards, legal obligations, and places the client at risk. Waiting for symptoms delays assessment and intervention. The nurse has an independent obligation to report; the colleague's willingness to self-report does not eliminate this duty.",
    s: "Ethics"
  },
  {
    q: "A nurse caring for a client overhears two nursing assistants discussing the client's HIV status in the cafeteria. What is the appropriate nursing action?",
    o: ["Immediately intervene, remind staff of HIPAA confidentiality requirements, and report the breach", "Ignore the conversation since the client is unlikely to hear it", "Wait until the end of the shift to address the issue", "Speak to the nursing assistants privately but do not report the incident"],
    a: 0,
    r: "Discussing a client's protected health information in a public area violates HIPAA regulations and the client's right to privacy. The nurse must intervene immediately to stop the breach, remind staff of confidentiality obligations, and report the violation per facility policy. Ignoring or delaying allows the breach to continue and potentially reach more people. Speaking privately without reporting does not fulfill mandatory reporting obligations and leaves no documentation trail.",
    s: "Ethics"
  },
  {
    q: "A 16-year-old pregnant client presents to the emergency department requesting treatment. Her parents are not present and cannot be reached. What should the nurse understand about consent in this situation?",
    o: ["The minor can consent to her own pregnancy-related care under the mature minor or emancipated minor doctrine", "Treatment must be delayed until a parent or legal guardian provides consent", "The nurse should contact child protective services before providing any care", "Only emergency life-saving treatment can be provided without parental consent"],
    a: 0,
    r: "In most jurisdictions, pregnant minors are considered emancipated for purposes of pregnancy-related care and can consent to their own treatment without parental involvement. This includes prenatal care, labor and delivery, and related medical decisions. Delaying treatment until parents arrive could compromise maternal and fetal health. Child protective services involvement is not indicated solely because of adolescent pregnancy. The emancipated minor exception extends beyond emergency-only care.",
    s: "Ethics"
  },
  {
    q: "A nurse is asked by a police officer to draw blood from an unconscious client involved in a motor vehicle accident for blood alcohol testing. No warrant or court order is presented. What should the nurse do?",
    o: ["Decline to draw blood without a warrant, court order, or the client's consent, and notify the supervisor", "Draw the blood as requested since law enforcement authority overrides patient consent", "Draw the blood and label it as a routine laboratory specimen", "Delay the blood draw until the client regains consciousness and can provide consent"],
    a: 0,
    r: "Drawing blood without the client's consent, a warrant, or a court order violates the client's Fourth Amendment rights against unreasonable search and the nurse's obligation to protect client rights. The nurse should decline, notify the supervisor, and follow facility policy. Law enforcement authority does not override the requirement for consent or legal authorization. Mislabeling specimens is illegal. Some states have implied consent laws, but the nurse should follow facility protocol and seek supervisor guidance.",
    s: "Ethics"
  },
  {
    q: "A nurse is providing care to a client who is a registered sex offender. The nurse feels uncomfortable and has difficulty remaining nonjudgmental. What is the most professional response?",
    o: ["Acknowledge personal feelings, maintain professional standards, and provide competent care while seeking peer support", "Request a different assignment because personal feelings prevent safe care", "Provide minimal care to maintain physical distance from the client", "Express disapproval to the client to establish boundaries"],
    a: 0,
    r: "The nursing code of ethics requires providing competent, compassionate care regardless of personal feelings about a client's background. The nurse should acknowledge internal biases through self-reflection, maintain professional boundaries, deliver standard care, and seek peer support or clinical supervision if needed. Requesting reassignment may be appropriate if personal feelings genuinely impair care delivery, but the first step is professional self-management. Providing minimal care is negligent. Expressing disapproval is unprofessional and harmful.",
    s: "Ethics"
  },
  {
    q: "A client's advance directive specifies do-not-resuscitate (DNR) status. During a procedure, the client experiences a cardiac arrest. The surgeon demands the nurse begin CPR. What should the nurse do?",
    o: ["Follow the advance directive and do not initiate CPR while communicating the DNR status to the surgical team", "Begin CPR as directed by the surgeon since the surgeon has authority in the operating room", "Leave the room to avoid the conflict", "Begin CPR and address the advance directive after the client is stabilized"],
    a: 0,
    r: "A valid advance directive is a legal document that must be honored. The nurse should communicate the DNR status to the surgical team and not initiate CPR. While some facilities have policies about perioperative DNR discussions (and some may suspend DNR during surgery with prior client consent), the nurse must advocate for the client's documented wishes. The surgeon's authority does not override the client's legal directive. Leaving the room abandons the client. Ignoring the advance directive violates the client's autonomy.",
    s: "Ethics"
  },
  {
    q: "A nurse working in a long-term care facility suspects that a cognitively impaired elderly resident is being financially exploited by a family member. What is the nurse's legal obligation?",
    o: ["Report the suspected abuse to Adult Protective Services as mandated by law", "Discuss the suspicion with the family member to get their explanation", "Wait for concrete evidence before making any reports", "Document the suspicion in the nursing notes and take no further action"],
    a: 0,
    r: "Nurses are mandated reporters of suspected elder abuse, including financial exploitation. Reports to Adult Protective Services must be made based on reasonable suspicion; concrete evidence is not required before reporting. Confronting the suspected abuser may escalate the situation and endanger the resident. Waiting for evidence delays protection of a vulnerable adult. Documentation alone does not fulfill the legal mandate to report and does not protect the resident.",
    s: "Ethics"
  },
  {
    q: "A nurse is caring for a Jehovah's Witness client who requires emergency surgery. The client has signed a refusal of blood products document. During surgery, the client hemorrhages severely. What is the nurse's responsibility?",
    o: ["Honor the client's documented refusal and use alternative volume expanders as ordered", "Administer blood products to save the client's life since the emergency overrides the refusal", "Contact the client's family to override the refusal", "Delay the decision until the client can reaffirm the refusal"],
    a: 0,
    r: "A competent adult's documented refusal of blood products must be honored even in life-threatening emergencies. This is an exercise of the client's right to autonomy and religious freedom. The healthcare team should use alternative volume expanders, cell salvage, and other blood-conservation strategies. An emergency does not override a clearly documented, informed refusal. Family cannot override the client's own directive. The client already made the decision while competent.",
    s: "Ethics"
  },
  {
    q: "A nurse is assigned to a client whose care involves a procedure the nurse has never performed and has not been trained in. What is the most appropriate action?",
    o: ["Inform the charge nurse and request training or reassignment to ensure client safety", "Attempt the procedure using online resources for guidance", "Perform the procedure since the nurse will learn through experience", "Delegate the procedure to an LPN or UAP who may have experience"],
    a: 0,
    r: "Nurses have an ethical and legal obligation to practice within their competency. Attempting a procedure without proper training places the client at risk and exposes the nurse to liability. The nurse should inform the charge nurse, request education or supervised training, or request reassignment of the task. Using online resources during a procedure does not constitute training. Learning through unsupervised trial risks harm. Delegating to someone else without knowing their competency does not ensure safety.",
    s: "Ethics"
  }
];
