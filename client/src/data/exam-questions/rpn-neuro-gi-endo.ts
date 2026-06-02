import type { ExamQuestion } from "./types";

export const rpnNeuroGiEndoQuestions: ExamQuestion[] = [
  // ===== NEUROLOGICAL (Questions 1-26) =====
  {
    q: "A 58-year-old client presents with sudden onset right-sided weakness, facial droop, and slurred speech. The nurse determines the symptoms started 90 minutes ago. Which action is the priority?",
    o: ["Administer aspirin 325 mg immediately", "Prepare the client for a stat CT scan of the head", "Position the client flat and start IV fluids", "Obtain a 12-lead ECG"],
    a: 1,
    r: "A stat CT scan is the immediate priority to differentiate ischemic from hemorrhagic stroke before any treatment. Aspirin is contraindicated until hemorrhagic stroke is ruled out. The CT result determines whether the client is a candidate for thrombolytic therapy (tPA) within the 3-4.5 hour window.",
    s: "Neurological"
  },
  {
    q: "A client with a C4 spinal cord injury suddenly develops a blood pressure of 230/120, severe headache, facial flushing, and bradycardia (HR 48). The nurse suspects autonomic dysreflexia. What is the first nursing action?",
    o: ["Administer IV antihypertensive medication", "Sit the client upright and check the urinary catheter", "Place the client supine and elevate the legs", "Call a rapid response and prepare for intubation"],
    a: 1,
    r: "Autonomic dysreflexia is a medical emergency in clients with spinal cord injuries at T6 or above. Sitting the client upright produces an orthostatic blood pressure reduction. Checking the catheter addresses the most common trigger (bladder distension from blocked catheter). Lying flat would worsen the hypertension.",
    s: "Neurological"
  },
  {
    q: "A nurse is monitoring a client with increased intracranial pressure (ICP). Which set of findings indicates Cushing's triad?",
    o: ["Tachycardia, hypotension, and tachypnea", "Bradycardia, widening pulse pressure, and irregular respirations", "Fever, tachycardia, and altered mental status", "Hypotension, bradycardia, and shallow respirations"],
    a: 1,
    r: "Cushing's triad is a late and ominous sign of severely elevated ICP indicating brainstem compression. It consists of bradycardia (vagal response), widening pulse pressure (systolic rises while diastolic falls), and irregular respirations (brainstem respiratory centers affected). This requires immediate intervention.",
    s: "Neurological"
  },
  {
    q: "A client recovering from a craniotomy has clear drainage from the nose. The nurse tests the fluid with a glucose strip, which is positive. What does this finding indicate?",
    o: ["The client has a sinus infection with elevated glucose", "Cerebrospinal fluid leak through a dural tear", "Normal nasal secretions in the postoperative period", "An allergic reaction to anesthesia medications"],
    a: 1,
    r: "Clear nasal drainage that tests positive for glucose suggests a cerebrospinal fluid (CSF) leak. CSF contains glucose, while normal nasal mucus does not. CSF rhinorrhea after craniotomy indicates a dural tear. The nurse should avoid packing the nose, keep the head of bed elevated, and notify the surgeon immediately as this increases infection (meningitis) risk.",
    s: "Neurological"
  },
  {
    q: "A client with myasthenia gravis is experiencing increasing weakness, difficulty swallowing, and respiratory distress. The nurse administers IV edrophonium (Tensilon). Symptoms worsen. What does this indicate?",
    o: ["Myasthenic crisis requiring more anticholinesterase medication", "Cholinergic crisis from excessive anticholinesterase medication", "Normal response to the Tensilon test", "An allergic reaction to edrophonium"],
    a: 1,
    r: "In a Tensilon test, if symptoms worsen after edrophonium administration, it indicates cholinergic crisis (excessive acetylcholine from too much anticholinesterase medication). If symptoms improved, it would indicate myasthenic crisis (not enough medication). Cholinergic crisis is treated by withholding anticholinesterase drugs and providing respiratory support. Atropine is the antidote.",
    s: "Neurological"
  },
  {
    q: "A client with bacterial meningitis is placed on droplet precautions. Which nursing action is most important during the first 24 hours of antibiotic therapy?",
    o: ["Monitoring for signs of hearing loss", "Performing neurological assessments every 1-2 hours", "Encouraging early ambulation to prevent DVT", "Restricting all visitors indefinitely"],
    a: 1,
    r: "Frequent neurological assessments (every 1-2 hours) are critical in the first 24 hours of bacterial meningitis treatment. Complications include cerebral edema, seizures, septic shock, and herniation. Changes in level of consciousness, pupil response, and motor function can indicate worsening. Hearing loss assessment is important but not the most critical action during the acute phase.",
    s: "Neurological"
  },
  {
    q: "A client with epilepsy has been seizing continuously for 8 minutes without regaining consciousness between seizures. The nurse identifies this as status epilepticus. Which medication should the nurse expect to administer first?",
    o: ["Phenytoin (Dilantin) IV loading dose", "IV lorazepam (Ativan)", "Oral carbamazepine (Tegretol)", "IM phenobarbital"],
    a: 1,
    r: "IV benzodiazepines (lorazepam or diazepam) are the first-line emergency treatment for status epilepticus because they act rapidly (within 1-3 minutes) to stop seizure activity. Phenytoin is used as a second-line agent for seizure prevention after benzodiazepines control the acute event. Oral medications cannot be administered to a seizing patient.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client 6 hours post-tPA administration for an ischemic stroke. The client develops a sudden severe headache, vomiting, and decreased level of consciousness. What is the priority action?",
    o: ["Administer acetaminophen for the headache", "Stop the tPA infusion if still running and notify the provider immediately", "Reposition the client for comfort and reassess in 30 minutes", "Obtain a blood glucose level"],
    a: 1,
    r: "These symptoms suggest hemorrhagic transformation, the most feared complication of tPA therapy. Any neurological deterioration after tPA requires immediate action: stop the infusion (if still running), notify the provider stat, and prepare for a stat CT to evaluate for intracranial hemorrhage. Headache and vomiting are NOT expected effects of tPA and should never be dismissed.",
    s: "Neurological"
  },
  {
    q: "A client with Parkinson's disease is taking levodopa/carbidopa. The nurse observes the client experiencing involuntary writhing movements of the arms and face. What is the most likely cause?",
    o: ["The medication dose is too low", "Dyskinesia from peak-dose levodopa effect", "A new stroke affecting motor areas", "Progression of Parkinson's disease"],
    a: 1,
    r: "Dyskinesia (involuntary choreiform movements) is a common side effect of long-term levodopa therapy, occurring at peak plasma drug levels. It indicates the dose may be too high, not too low. The provider may adjust the dosing schedule or add a COMT inhibitor. This is distinct from the tremor of Parkinson's disease, which occurs at rest.",
    s: "Neurological"
  },
  {
    q: "A client with Guillain-Barré syndrome reports tingling in the feet that has progressed to weakness in both legs over 48 hours. Which assessment is the highest priority?",
    o: ["Deep tendon reflexes in the upper extremities", "Respiratory function including vital capacity and negative inspiratory force", "Cranial nerve assessment for facial weakness", "Bowel and bladder function"],
    a: 1,
    r: "GBS causes ascending paralysis that can progress to respiratory muscles (diaphragm via phrenic nerve C3-C5, intercostals). Respiratory failure is the most life-threatening complication. Vital capacity less than 20 mL/kg or NIF less than -30 cmH2O indicates impending respiratory failure requiring intubation. Respiratory monitoring every 4-6 hours is essential during the progressive phase.",
    s: "Neurological"
  },
  {
    q: "A client with a subdural hematoma undergoes a craniotomy. Postoperatively, the nurse positions the client with the operative side UP. What is the rationale for this position?",
    o: ["To promote drainage of accumulated blood from the surgical site", "To prevent accumulation of fluid on the operative side and reduce ICP", "To improve blood flow to the operative hemisphere", "To make the client more comfortable"],
    a: 1,
    r: "After craniotomy for subdural hematoma evacuation, positioning with the operative side up prevents fluid from accumulating in the surgical cavity. This positioning prevents brain shifting (midline shift) toward the operative side. For supratentorial surgery, the head of bed is elevated 30 degrees to promote venous drainage and reduce ICP.",
    s: "Neurological"
  },
  {
    q: "A client with a Glasgow Coma Scale (GCS) score of 7 is admitted to the ICU. Which intervention is the most critical?",
    o: ["Frequent neurological assessments every 4 hours", "Airway management and preparation for intubation", "Administration of mannitol to reduce cerebral edema", "Placement of an external ventricular drain"],
    a: 1,
    r: "A GCS of 8 or below indicates severe brain injury and inability to protect the airway. Intubation is necessary to prevent aspiration, maintain oxygenation, and allow controlled ventilation. The ABCs take priority: airway first. Other interventions (ICP management, neurological monitoring) are important but secondary to securing the airway.",
    s: "Neurological"
  },
  {
    q: "A nurse is assessing a client who had a right hemispheric stroke. Which finding is most consistent with right-brain damage?",
    o: ["Expressive aphasia and right-sided weakness", "Left-sided neglect and impaired spatial awareness", "Difficulty with reading and writing", "Cautious and slow behavior"],
    a: 1,
    r: "Right hemispheric strokes produce contralateral (left-sided) motor and sensory deficits plus characteristic right-brain functions: spatial-perceptual deficits, unilateral neglect of the left side, impulsive behavior, poor judgment, and denial of deficits (anosognosia). Left hemispheric strokes produce aphasia, reading/writing difficulties, and cautious behavior.",
    s: "Neurological"
  },
  {
    q: "A client with a lumbar laminectomy at L4-L5 returns to the unit. The nurse assesses that the client cannot dorsiflex the foot on the operative side. What should the nurse do?",
    o: ["Document as expected postoperative finding and reassess tomorrow", "Notify the surgeon immediately as this may indicate nerve root compression", "Apply a splint and order physical therapy consultation", "Administer an opioid analgesic as foot drop is usually painful"],
    a: 1,
    r: "Inability to dorsiflex the foot (foot drop) after lumbar laminectomy suggests possible compression or injury to the L4-L5 nerve root. This is a new neurological deficit that requires immediate surgical notification because it may indicate hemorrhage, edema, or displaced disc fragment compressing the nerve. Delay can result in permanent nerve damage.",
    s: "Neurological"
  },
  {
    q: "A client with multiple sclerosis asks why symptoms worsen when taking a hot bath. What is the correct explanation?",
    o: ["Heat causes increased antibody production against myelin", "Heat slows nerve conduction in demyelinated nerves, worsening symptoms", "Hot water increases intracranial pressure temporarily", "Heat causes muscle inflammation in MS patients"],
    a: 1,
    r: "In multiple sclerosis, nerve fibers are demyelinated, making nerve conduction already impaired. Heat further slows conduction velocity in demyelinated nerves (Uhthoff phenomenon), temporarily worsening symptoms such as weakness, visual blurring, and fatigue. Symptoms improve when body temperature returns to normal. MS patients should avoid hot baths, saunas, and excessive heat exposure.",
    s: "Neurological"
  },
  {
    q: "A nurse is teaching a client about seizure precautions at home. Which instruction is most important?",
    o: ["Always take seizure medications on a full stomach", "Never swim alone and avoid heights without supervision", "Take extra medication if you feel an aura coming on", "Seizure medications can be safely stopped once seizure-free for 6 months"],
    a: 1,
    r: "Drowning and falls from heights are leading causes of seizure-related death and injury. Clients with epilepsy should never swim alone, avoid bathing in a locked bathroom (shower preferred), and take precautions at heights. Medications should never be self-adjusted and require gradual tapering under medical supervision, not abrupt discontinuation.",
    s: "Neurological"
  },
  {
    q: "A client with trigeminal neuralgia (tic douloureux) reports excruciating facial pain triggered by chewing. Which medication is typically prescribed as first-line therapy?",
    o: ["Morphine sulfate", "Carbamazepine (Tegretol)", "Ibuprofen (Advil)", "Sumatriptan (Imitrex)"],
    a: 1,
    r: "Carbamazepine is the first-line medication for trigeminal neuralgia. It is an anticonvulsant that stabilizes nerve membranes and reduces abnormal firing of the trigeminal nerve. Opioids and NSAIDs are generally ineffective for neuropathic pain. Sumatriptan is used for migraines, not trigeminal neuralgia. Monitor CBC as carbamazepine can cause aplastic anemia.",
    s: "Neurological"
  },
  {
    q: "A nurse caring for a client with a ventriculoperitoneal (VP) shunt notices the client has a temperature of 39.2°C, neck stiffness, and photophobia. The client had a shunt revision 5 days ago. What is the priority concern?",
    o: ["Viral meningitis unrelated to the shunt", "VP shunt infection with possible ventriculitis", "Normal postoperative inflammatory response", "Urinary tract infection causing referred symptoms"],
    a: 1,
    r: "Fever, neck stiffness, and photophobia within days of VP shunt surgery strongly suggest shunt infection with possible ventriculitis or meningitis. Shunt infections are serious complications requiring immediate blood cultures, CSF sampling from the shunt reservoir, and empiric IV antibiotics. Shunt removal and replacement may be necessary.",
    s: "Neurological"
  },
  {
    q: "A client with a brain tumor develops the syndrome of inappropriate antidiuretic hormone (SIADH). Which lab finding does the nurse expect?",
    o: ["Serum sodium 152 mEq/L and high serum osmolality", "Serum sodium 118 mEq/L and low serum osmolality", "Serum potassium 6.2 mEq/L and metabolic acidosis", "Serum glucose 320 mg/dL and glycosuria"],
    a: 1,
    r: "SIADH causes excessive water retention by the kidneys due to inappropriate ADH secretion. This dilutes the blood, producing hyponatremia (low sodium, often below 125 mEq/L) and low serum osmolality. Urine is inappropriately concentrated. Treatment includes fluid restriction, hypertonic saline for severe cases, and addressing the underlying cause. Rapid sodium correction risks osmotic demyelination syndrome.",
    s: "Neurological"
  },
  {
    q: "A client post-carotid endarterectomy develops stridor and progressive neck swelling. The nurse notes the wound dressing is saturated. What is the priority action?",
    o: ["Change the dressing and apply a pressure bandage", "Open the wound to relieve pressure and call for emergency surgical assistance", "Administer IV dexamethasone for airway inflammation", "Apply ice to the neck and elevate the head of bed"],
    a: 1,
    r: "Post-carotid endarterectomy neck swelling with stridor indicates wound hematoma causing airway compression. This is a surgical emergency. If the airway is compromised, the wound should be opened at the bedside to relieve the hematoma pressure while the surgical team is urgently summoned. This is one of the few situations where a nurse may open a surgical wound at the bedside under emergency protocol.",
    s: "Neurological"
  },
  {
    q: "A client with amyotrophic lateral sclerosis (ALS) is discussing end-of-life care. Which statement by the client indicates accurate understanding of the disease?",
    o: ["I will likely develop dementia as the disease progresses", "My sensory function and bladder control will remain intact even as motor function declines", "Physical therapy can reverse my muscle weakness", "ALS usually goes into remission after 5 years"],
    a: 1,
    r: "ALS selectively destroys upper and lower motor neurons while sparing sensory neurons, cognition (in most cases), and autonomic functions including bowel and bladder control. The client maintains full awareness as motor function progressively declines. This makes ALS particularly challenging from a psychosocial perspective. Death usually results from respiratory failure within 2-5 years of diagnosis.",
    s: "Neurological"
  },
  {
    q: "A nurse is positioning a client with increased ICP. Which position would be most therapeutic?",
    o: ["Head of bed flat with legs elevated", "Head of bed elevated 30 degrees with head midline", "Side-lying with the neck flexed", "Trendelenburg position"],
    a: 1,
    r: "Elevating the head of bed 30 degrees promotes venous drainage from the brain through the internal jugular veins, reducing ICP. The head must be kept midline to prevent compression of the jugular veins, which would impede venous outflow and increase ICP. Neck flexion, flat positioning, and Trendelenburg all increase ICP and are contraindicated.",
    s: "Neurological"
  },
  {
    q: "A client is admitted with a ruptured cerebral aneurysm. Which nursing intervention is most important to prevent rebleeding?",
    o: ["Encouraging deep breathing and coughing exercises", "Maintaining a quiet, darkened environment with minimal stimulation", "Administering stool softeners and limiting visitors", "All of the above: quiet environment, stool softeners, and limiting stimulation"],
    a: 3,
    r: "Preventing rebleeding after a ruptured cerebral aneurysm requires minimizing all activities that increase blood pressure or intracranial pressure. This includes maintaining a quiet, dark room; preventing straining (stool softeners); limiting visitors; avoiding coughing; and controlling blood pressure. Aneurysm precautions are maintained until the aneurysm is surgically secured (clipping or coiling).",
    s: "Neurological"
  },
  {
    q: "A client with a T10 spinal cord injury is being assessed. Which finding would the nurse expect?",
    o: ["Quadriplegia with loss of respiratory function", "Paraplegia with intact upper extremity function", "Hemiplegia affecting one side of the body", "Loss of sensation in the hands only"],
    a: 1,
    r: "Thoracic spinal cord injuries (T1 and below) result in paraplegia: loss of motor and sensory function in the lower extremities and trunk below the injury level. Upper extremity function is preserved because the brachial plexus (C5-T1) is above the injury. Cervical injuries cause quadriplegia. Hemiplegia (one side) suggests a brain lesion, not spinal cord injury.",
    s: "Neurological"
  },
  {
    q: "A nurse is performing the doll's eyes test (oculocephalic reflex) on an unconscious client. When the head is turned to the right, the eyes move to the left. What does this indicate?",
    o: ["Brainstem function is intact", "The client has cortical blindness", "The brainstem is severely damaged", "The client is feigning unconsciousness"],
    a: 0,
    r: "In an unconscious client, conjugate eye movement in the opposite direction of head turning (doll's eyes present) indicates intact brainstem function. Absent doll's eyes (eyes remain fixed or move with the head) indicates brainstem dysfunction and a very poor prognosis. This test is ONLY performed after cervical spine injury has been ruled out.",
    s: "Neurological"
  },
  {
    q: "A client with Bell's palsy asks the nurse why they need to use artificial tears and tape the affected eye shut at night. What is the correct explanation?",
    o: ["The facial nerve paralysis prevents complete eye closure, putting the cornea at risk for drying and ulceration", "The medication for Bell's palsy causes excessive tearing that needs to be absorbed", "Eye taping reduces the headache associated with Bell's palsy", "Artificial tears treat the viral infection causing Bell's palsy"],
    a: 0,
    r: "Bell's palsy causes unilateral facial nerve (CN VII) paralysis, which prevents the eyelid from closing completely on the affected side. Without complete lid closure, the cornea is exposed to drying, leading to corneal abrasion and ulceration. Artificial tears during the day and taping the eye shut at night protect the cornea. Most Bell's palsy cases resolve within 3-6 months.",
    s: "Neurological"
  },
  // ===== GASTROINTESTINAL (Questions 27-52) =====
  {
    q: "A client with a nasogastric (NG) tube returns 600 mL of coffee-ground emesis. Which intervention is the priority?",
    o: ["Remove the NG tube and insert a new one", "Document the findings and continue monitoring", "Notify the healthcare provider immediately and assess hemodynamic status", "Administer an antiemetic medication"],
    a: 2,
    r: "Coffee-ground emesis indicates upper GI bleeding where blood has been partially digested by gastric acid. This is an urgent finding requiring immediate provider notification and hemodynamic assessment (vital signs, orthostatic blood pressure, urine output). The client may need emergency endoscopy, blood transfusion, or surgical intervention depending on the severity of bleeding.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with cirrhosis and ascites is scheduled for a paracentesis. Which nursing action is essential before the procedure?",
    o: ["Ensure the client's bladder is empty", "Place the client in a right lateral position", "Administer IV sedation", "Apply abdominal ice packs for 30 minutes"],
    a: 0,
    r: "Before paracentesis, the client must empty the bladder to prevent accidental bladder perforation when the trocar is inserted into the abdomen. The client is positioned upright (sitting on the edge of the bed) to allow fluid to pool in the lower abdomen. IV sedation is not typically required as local anesthesia is used.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with hepatic encephalopathy is prescribed lactulose 30 mL three times daily. The nurse evaluates the medication as effective when which outcome is observed?",
    o: ["The client has 2-3 soft stools per day", "The client's appetite improves significantly", "The client's liver enzymes return to normal", "The client reports decreased abdominal pain"],
    a: 0,
    r: "Lactulose works by converting ammonia (NH3) to ammonium (NH4+) in the colon, which cannot be reabsorbed. It also has an osmotic laxative effect that promotes excretion of ammonia through stool. The therapeutic goal is 2-3 soft stools per day. Too few stools means the ammonia is not being adequately cleared; too many cause dehydration.",
    s: "Gastrointestinal"
  },
  {
    q: "A client 2 days post-colostomy surgery has no output from the stoma. The stoma appears dusky purple. What is the nurse's priority action?",
    o: ["Wait 48 more hours as postoperative ileus is common", "Document the stoma color and monitor hourly", "Notify the surgeon immediately regarding the stoma color change", "Apply a warm compress to stimulate peristalsis"],
    a: 2,
    r: "A dusky, purple, or black stoma indicates ischemia or necrosis due to compromised blood supply. Normal stoma color is pink to beefy red. This requires immediate surgical notification as necrotic bowel may need revision surgery. While absent output may be from postoperative ileus, the color change is the more urgent finding demanding immediate intervention.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with Crohn's disease presents with right lower quadrant pain, diarrhea (6-8 stools daily), and a temperature of 38.5°C. Which finding would the nurse assess for that differentiates Crohn's from ulcerative colitis?",
    o: ["Bloody diarrhea with mucus", "Skip lesions and perianal fistulas", "Continuous inflammation starting at the rectum", "Toxic megacolon"],
    a: 1,
    r: "Crohn's disease is characterized by skip lesions (patchy, non-continuous inflammation), transmural involvement (affects all layers of the bowel wall), and perianal complications including fistulas, fissures, and abscesses. Ulcerative colitis produces continuous inflammation starting at the rectum, involves only the mucosa and submucosa, and characteristically causes bloody diarrhea with mucus.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a peptic ulcer is prescribed sucralfate (Carafate). When should the nurse instruct the client to take this medication?",
    o: ["With meals and at bedtime", "1 hour before meals on an empty stomach", "Immediately after eating", "Only when experiencing pain"],
    a: 1,
    r: "Sucralfate must be taken on an empty stomach (1 hour before meals) because it requires an acidic environment to activate. It forms a protective paste over the ulcer crater by binding to the positively charged proteins in damaged mucosa. Food would buffer the stomach acid and prevent sucralfate activation. It also interferes with absorption of other medications and should be spaced 2 hours apart.",
    s: "Gastrointestinal"
  },
  {
    q: "A client post-esophagogastroduodenoscopy (EGD) with biopsy reports throat pain and difficulty swallowing. When should the nurse allow the client to drink fluids?",
    o: ["Immediately after the procedure", "After the gag reflex has returned", "After 24 hours of NPO status", "Only if the client requests fluids"],
    a: 1,
    r: "After EGD, the throat is anesthetized with local spray. The gag reflex must return before oral intake to prevent aspiration. This typically takes 1-2 hours. The nurse tests the gag reflex by gently touching the back of the throat with a tongue depressor. Once the gag reflex returns, clear liquids are started first, then advanced as tolerated.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with acute pancreatitis has a serum amylase of 892 U/L and lipase of 1,450 U/L. The client reports severe epigastric pain radiating to the back. Which position would provide the most relief?",
    o: ["Supine with legs extended", "Side-lying with knees flexed to the abdomen", "Prone position", "Sitting upright with arms extended forward"],
    a: 1,
    r: "The fetal position (side-lying with knees drawn up) or sitting and leaning forward reduces tension on the abdominal muscles and decreases pressure on the inflamed pancreas. Supine position increases pressure on the retroperitoneal pancreas and worsens pain. NPO status, IV fluids, and analgesics (meperidine or morphine alternatives) are mainstays of treatment.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a total gastrectomy is at risk for dumping syndrome. Which dietary instruction should the nurse provide?",
    o: ["Eat three large meals daily with plenty of fluids", "Eat 6 small meals, high protein, low carbohydrate, and avoid fluids with meals", "Eat a high-fiber diet with increased fruit intake", "Drink 8 glasses of water with each meal"],
    a: 1,
    r: "Dumping syndrome occurs when hyperosmolar food passes rapidly into the small intestine, drawing fluid from the vascular compartment. Prevention includes 6 small meals, high protein/fat and low simple carbohydrates, avoiding fluids with meals (drink 30-60 minutes before or after), and lying down for 20-30 minutes after eating to slow gastric emptying.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with ulcerative colitis is prescribed sulfasalazine (Azulfidine). Which lab test should the nurse monitor most closely?",
    o: ["Blood glucose levels", "Complete blood count (CBC)", "Thyroid function tests", "Cardiac enzymes"],
    a: 1,
    r: "Sulfasalazine can cause bone marrow suppression leading to leukopenia, thrombocytopenia, and anemia. CBC should be monitored regularly, especially during the first 3 months of therapy. The drug can also cause folic acid deficiency (supplement with folic acid), hepatotoxicity, and allergic reactions in clients with sulfa allergies.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is assessing a client with suspected appendicitis. Which assessment finding is most specific for appendicitis?",
    o: ["Generalized abdominal pain that started periumbilically", "Rebound tenderness at McBurney's point", "Nausea and vomiting with low-grade fever", "Elevated white blood cell count"],
    a: 1,
    r: "Rebound tenderness at McBurney's point (one-third the distance from the right anterior superior iliac spine to the umbilicus) is the most specific finding for appendicitis. While periumbilical pain migrating to the RLQ is characteristic, rebound tenderness indicates peritoneal irritation from the inflamed appendix. Rovsing sign (LLQ palpation causing RLQ pain) also supports the diagnosis.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a bowel obstruction has an NG tube to low intermittent suction. The nurse notes 1,200 mL of output over 8 hours. Which electrolyte imbalance is the priority concern?",
    o: ["Hyperkalemia", "Hyponatremia and metabolic alkalosis", "Hypermagnesemia", "Hypercalcemia"],
    a: 1,
    r: "Large-volume NG suction removes gastric secretions rich in hydrochloric acid (H+, Cl-), sodium, and potassium. The primary concerns are hyponatremia (sodium loss), hypochloremia, hypokalemia, and metabolic alkalosis (loss of H+ ions). The nurse should monitor electrolytes frequently and expect IV replacement with normal saline and potassium chloride.",
    s: "Gastrointestinal"
  },
  {
    q: "A client post-liver biopsy should be positioned in which way?",
    o: ["Left lateral with a pillow under the right ribcage", "Right lateral with a rolled towel under the biopsy site", "Prone with both arms above the head", "Supine with the head of bed elevated 45 degrees"],
    a: 1,
    r: "After liver biopsy, the client is positioned on the RIGHT side with a rolled towel or small pillow under the costal margin at the biopsy site. This position applies pressure from the body weight to the biopsy puncture site (the liver is on the right side under the diaphragm), promoting hemostasis and preventing bleeding. The client remains in this position for 2-4 hours.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with gastroesophageal reflux disease (GERD) asks about lifestyle modifications. Which instruction is most important?",
    o: ["Sleep flat to improve digestion", "Eat a large meal before bedtime to prevent nighttime hunger", "Elevate the head of bed 6-8 inches and avoid eating 2-3 hours before bedtime", "Drink caffeinated beverages to promote gastric motility"],
    a: 2,
    r: "Elevating the head of bed uses gravity to prevent reflux of gastric contents into the esophagus. Not eating 2-3 hours before bedtime reduces the volume of gastric contents when lying down. Other modifications include weight loss, avoiding trigger foods (caffeine, chocolate, spicy foods, citrus, alcohol), wearing loose clothing, and not lying down after meals.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a colostomy notices the stoma has retracted below skin level. Which complication does this represent, and what is the nursing concern?",
    o: ["Stoma prolapse requiring emergency surgery", "Stoma retraction risking poor pouch seal and skin breakdown", "Normal stoma changes expected after 2 weeks", "Stoma stenosis requiring dilation"],
    a: 1,
    r: "Stoma retraction occurs when the stoma pulls below the abdominal skin surface, making it difficult to achieve a proper seal with the ostomy pouch. This leads to leakage, peristomal skin irritation, and breakdown. A convex pouch and ostomy belt may help. Severe retraction may require surgical revision. The nurse should notify the wound/ostomy nurse for evaluation.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with cholecystitis reports pain in the right shoulder. What is the explanation for this referred pain?",
    o: ["The gallbladder shares nerve pathways with the shoulder joint", "Irritation of the diaphragm by the inflamed gallbladder refers pain via the phrenic nerve to the right shoulder", "The client may have a separate shoulder injury", "Gallstones have migrated to the shoulder area"],
    a: 1,
    r: "The inflamed gallbladder irritates the right hemidiaphragm. The phrenic nerve (C3-C5) innervates the diaphragm, and pain is referred to the right shoulder (C3-C5 dermatome) via shared nerve pathways. This is a classic example of referred pain. The pain typically worsens after fatty meals and may be associated with nausea, vomiting, and fever.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is assessing a client with suspected peritonitis. Which assessment finding is most characteristic?",
    o: ["Hyperactive bowel sounds in all quadrants", "Rigid, board-like abdomen with absent bowel sounds", "Soft, non-tender abdomen with normal bowel sounds", "Distended abdomen with high-pitched tinkling sounds"],
    a: 1,
    r: "Peritonitis presents with a rigid, board-like abdomen (involuntary guarding) and absent bowel sounds (paralytic ileus from peritoneal inflammation). Additional findings include severe diffuse abdominal pain worsened by movement, rebound tenderness, fever, tachycardia, and signs of sepsis. This is a surgical emergency requiring IV antibiotics and likely exploratory laparotomy.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with esophageal varices begins vomiting bright red blood. What is the priority nursing action?",
    o: ["Insert a large-bore IV and prepare for fluid resuscitation and blood products", "Administer oral vitamin K immediately", "Place the client in Trendelenburg position", "Perform gastric lavage with iced saline"],
    a: 0,
    r: "Ruptured esophageal varices cause massive hemorrhage with rapid blood loss. The priority is establishing IV access with large-bore catheters and preparing for aggressive fluid resuscitation and blood product administration. Type and crossmatch should be obtained stat. Vasopressin or octreotide may be administered to reduce portal pressure. Emergency endoscopy for band ligation is the definitive treatment.",
    s: "Gastrointestinal"
  },
  {
    q: "A client is being discharged after a Whipple procedure (pancreaticoduodenectomy). Which discharge instruction is essential?",
    o: ["You will need pancreatic enzyme supplements with meals for the rest of your life", "Your diet should be unrestricted immediately after surgery", "Blood glucose monitoring is unnecessary after the procedure", "You can stop follow-up appointments after 6 months"],
    a: 0,
    r: "The Whipple procedure removes the head of the pancreas, duodenum, distal common bile duct, and part of the stomach. Loss of pancreatic exocrine function requires lifelong pancreatic enzyme replacement (pancrelipase) with meals to aid fat, protein, and carbohydrate digestion. The client may also develop diabetes mellitus from reduced insulin production and needs blood glucose monitoring.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a client with a newly placed percutaneous endoscopic gastrostomy (PEG) tube. Which nursing action is most important before initiating tube feedings?",
    o: ["Verify tube placement by checking residual volume and auscultating for air bolus", "Begin feedings at the prescribed rate immediately after placement", "Flush the tube with 100 mL of cranberry juice", "Clamp the tube for 2 hours before the first feeding"],
    a: 0,
    r: "Verifying tube placement is essential before any feeding to prevent aspiration. The nurse checks gastric residual volume (hold feeding if residual exceeds facility threshold, typically 250-500 mL) and confirms placement per facility protocol. Radiographic confirmation may be required for initial placement. The head of bed should be elevated 30-45 degrees during and 30-60 minutes after feeding.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with hepatitis B asks how the infection is transmitted. Which response by the nurse is accurate?",
    o: ["Hepatitis B is transmitted through contaminated food and water", "Hepatitis B is spread through blood, body fluids, sexual contact, and perinatal transmission", "Hepatitis B can only be transmitted through needle sticks", "Hepatitis B is spread through airborne droplets"],
    a: 1,
    r: "Hepatitis B is transmitted through blood, semen, vaginal fluids, and other body fluids. Routes include sexual contact, needle sharing, needle sticks, perinatal transmission from mother to infant, and contact with open wounds. Unlike hepatitis A and E, hepatitis B is NOT transmitted through the fecal-oral route (contaminated food/water). Vaccination is available and highly effective.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a small bowel obstruction has high-pitched, hyperactive bowel sounds proximal to the obstruction. What does this indicate?",
    o: ["The obstruction has resolved", "The bowel is attempting to push contents past the obstruction (peristaltic rushes)", "The client has developed peritonitis", "Normal bowel function has returned"],
    a: 1,
    r: "High-pitched, tinkling, hyperactive bowel sounds proximal to an obstruction represent increased peristalsis as the bowel attempts to push contents past the blockage. These are called peristaltic rushes or borborygmi. If the obstruction persists, the bowel eventually becomes exhausted and bowel sounds become absent (paralytic ileus), which is an ominous sign suggesting possible bowel necrosis.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with diverticulitis presents with left lower quadrant pain, fever, and elevated WBC. The nurse knows that which dietary recommendation is appropriate during an acute flare?",
    o: ["High-fiber diet to promote bowel regularity", "Clear liquid diet progressing to low-residue as symptoms improve", "Regular diet with added nuts and seeds", "NPO for 7 days followed by full diet"],
    a: 1,
    r: "During acute diverticulitis, the bowel needs rest. The client starts with clear liquids or NPO (if severe), progressing to low-residue diet as inflammation subsides. High-fiber diet is recommended during remission to prevent recurrence, NOT during acute flares. Nuts, seeds, and popcorn were previously thought to worsen diverticulitis but current evidence does not support this restriction.",
    s: "Gastrointestinal"
  },
  // ===== ENDOCRINE (Questions 53-78) =====
  {
    q: "A client with type 1 diabetes has a blood glucose of 52 mg/dL and is conscious and alert. Which intervention is most appropriate?",
    o: ["Administer glucagon 1 mg IM immediately", "Give 15 grams of a fast-acting carbohydrate and recheck in 15 minutes", "Start a D50 IV drip", "Administer regular insulin to stimulate glucose release"],
    a: 1,
    r: "For a conscious hypoglycemic client, the Rule of 15 applies: give 15 grams of fast-acting carbohydrate (4 oz juice, glucose tablets, or 6 oz regular soda), wait 15 minutes, and recheck blood glucose. Glucagon IM is reserved for unconscious clients or those unable to swallow. D50 IV is used when IV access is available and the client cannot take oral carbs. Insulin would further lower glucose.",
    s: "Endocrine"
  },
  {
    q: "A client post-thyroidectomy reports numbness and tingling around the mouth and fingertips. The nurse taps the facial nerve anterior to the ear and observes facial twitching. What does this indicate?",
    o: ["Expected postoperative nerve irritation", "Hypocalcemia from accidental parathyroid removal (positive Chvostek sign)", "Thyroid storm developing", "Recurrent laryngeal nerve damage"],
    a: 1,
    r: "Facial twitching when the facial nerve is tapped (positive Chvostek sign) indicates hypocalcemia, which occurs when the parathyroid glands are accidentally damaged or removed during thyroidectomy. The parathyroid glands regulate calcium. The nurse should also check for Trousseau sign (carpopedal spasm with BP cuff inflation) and have IV calcium gluconate at the bedside.",
    s: "Endocrine"
  },
  {
    q: "A client with diabetic ketoacidosis (DKA) has the following lab values: glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, K+ 5.8 mEq/L. Which intervention does the nurse expect to be initiated first?",
    o: ["Subcutaneous insulin glargine", "IV regular insulin drip and aggressive IV normal saline", "Oral potassium supplements", "IV sodium bicarbonate bolus"],
    a: 1,
    r: "DKA management follows the protocol: aggressive IV fluid resuscitation (NS initially to correct dehydration, often 1-2L in the first hour), then continuous IV regular insulin drip to lower glucose and stop ketone production. The elevated potassium is misleading (acidosis shifts K+ extracellularly); total body potassium is actually depleted, and K+ will drop rapidly with insulin. Potassium replacement begins when K+ falls below 5.3 mEq/L.",
    s: "Endocrine"
  },
  {
    q: "A nurse is teaching a client about Addison's disease. Which statement by the client indicates understanding of the condition?",
    o: ["I should decrease my salt intake to prevent fluid retention", "I need to carry injectable hydrocortisone and wear a medical alert bracelet at all times", "I can stop my medication when I feel better", "I should avoid physical activity completely"],
    a: 1,
    r: "Addison's disease (primary adrenal insufficiency) requires lifelong corticosteroid replacement. During physiological stress (illness, surgery, trauma), cortisol requirements increase dramatically, and the client may need an emergency injection of hydrocortisone to prevent Addisonian crisis (life-threatening hypotension, shock). A medical alert bracelet ensures emergency responders know about the condition.",
    s: "Endocrine"
  },
  {
    q: "A client with Cushing syndrome has a blood glucose of 268 mg/dL, moon face, and purple striae. Which assessment finding is the nurse most concerned about?",
    o: ["The elevated blood glucose", "Risk for pathologic fractures from osteoporosis", "The cosmetic appearance changes", "Mild hypokalemia of 3.3 mEq/L"],
    a: 0,
    r: "While all findings are related to cortisol excess, persistent hyperglycemia (steroid-induced diabetes) carries the most immediate clinical risk for complications including diabetic ketoacidosis, hyperosmolar hyperglycemic state, infection, and poor wound healing. The nurse should monitor glucose frequently and anticipate insulin therapy. Osteoporosis is a long-term concern requiring bone density monitoring.",
    s: "Endocrine"
  },
  {
    q: "A client with hypothyroidism is started on levothyroxine. Which instruction is most important for the nurse to provide?",
    o: ["Take the medication with food to prevent stomach upset", "Take the medication on an empty stomach 30-60 minutes before breakfast", "Take the medication at bedtime with a glass of milk", "Take the medication only when experiencing symptoms"],
    a: 1,
    r: "Levothyroxine should be taken on an empty stomach, ideally 30-60 minutes before breakfast, because food (especially calcium, iron, and soy) impairs its absorption. Consistency is key: the same time each day. The medication must be taken for life. The nurse should teach the client to report signs of thyroid excess (tachycardia, palpitations, heat intolerance, weight loss, insomnia) which indicate the dose may be too high.",
    s: "Endocrine"
  },
  {
    q: "A client diagnosed with pheochromocytoma is scheduled for surgery. Which medication should the nurse anticipate administering preoperatively?",
    o: ["Beta-blocker (propranolol) as the first-line agent", "Alpha-adrenergic blocker (phenoxybenzamine) followed by beta-blocker", "ACE inhibitor (lisinopril)", "Calcium channel blocker (amlodipine) only"],
    a: 1,
    r: "Pheochromocytoma produces excess catecholamines causing severe hypertension. Alpha-blockade (phenoxybenzamine) must be started FIRST to block vasoconstriction, typically 10-14 days preoperatively. Beta-blockers are added AFTER alpha-blockade to control tachycardia. Starting a beta-blocker first without alpha-blockade can cause unopposed alpha stimulation, worsening hypertension and potentially causing hypertensive crisis.",
    s: "Endocrine"
  },
  {
    q: "A client with diabetes insipidus has a urine specific gravity of 1.001, urine output of 800 mL/hour, and serum sodium of 158 mEq/L. Which medication does the nurse expect to be prescribed?",
    o: ["Furosemide (Lasix)", "Desmopressin (DDAVP)", "Spironolactone (Aldactone)", "Hydrochlorothiazide (HCTZ)"],
    a: 1,
    r: "Diabetes insipidus results from deficient ADH (central DI) or renal resistance to ADH (nephrogenic DI). The hallmarks are massive dilute urine output and hypernatremia from water loss. Desmopressin (DDAVP) is a synthetic ADH analog that is first-line treatment for central DI. It promotes water reabsorption in the collecting ducts. Fluid replacement is also critical to prevent hypovolemic shock.",
    s: "Endocrine"
  },
  {
    q: "A nurse is monitoring a client receiving an IV insulin drip for DKA. The blood glucose drops from 486 to 250 mg/dL. What should the nurse anticipate?",
    o: ["Discontinue the insulin drip immediately", "Switch the IV fluid from NS to D5 half-NS and continue the insulin drip", "Increase the insulin drip rate to lower glucose faster", "Switch to subcutaneous insulin immediately"],
    a: 1,
    r: "When blood glucose reaches 250-300 mg/dL in DKA management, the IV fluid is changed to dextrose-containing solution (D5 half-NS) to prevent hypoglycemia while the insulin drip continues at a reduced rate to clear remaining ketones. The insulin drip is NOT stopped until the anion gap closes and pH normalizes (pH > 7.30, HCO3 > 18). Premature insulin discontinuation causes DKA recurrence.",
    s: "Endocrine"
  },
  {
    q: "A client with hyperthyroidism is prescribed methimazole. The client develops a sore throat, fever, and mouth ulcers. What is the priority nursing action?",
    o: ["Administer acetaminophen and throat lozenges", "Withhold methimazole and obtain a stat CBC", "Continue the medication and reassess in 24 hours", "Apply topical antifungal to the mouth ulcers"],
    a: 1,
    r: "Sore throat, fever, and mouth ulcers in a client on antithyroid medications (methimazole or PTU) are warning signs of agranulocytosis, a life-threatening drop in white blood cells. The medication must be held immediately and a stat CBC with differential obtained. If WBC or ANC is critically low, the client needs reverse isolation, broad-spectrum antibiotics, and possible granulocyte colony-stimulating factor (G-CSF).",
    s: "Endocrine"
  },
  {
    q: "A client with syndrome of inappropriate antidiuretic hormone (SIADH) has a serum sodium of 118 mEq/L. Which intervention is the priority?",
    o: ["Administer IV normal saline rapidly", "Implement strict fluid restriction (500-1000 mL/day)", "Encourage increased oral fluid intake", "Administer 3% hypertonic saline at a controlled rate"],
    a: 3,
    r: "Severe hyponatremia (below 120 mEq/L) is a medical emergency requiring 3% hypertonic saline administered via infusion pump at a carefully controlled rate. Sodium must be corrected slowly (no more than 10-12 mEq/L in 24 hours) to prevent osmotic demyelination syndrome (central pontine myelinolysis). Fluid restriction is the mainstay for mild SIADH, but severe hyponatremia requires active sodium replacement.",
    s: "Endocrine"
  },
  {
    q: "A nurse is educating a client with type 2 diabetes about foot care. Which statement indicates the client needs further teaching?",
    o: ["I should inspect my feet daily for cuts, blisters, and color changes", "I will wear well-fitting shoes and never go barefoot", "I should soak my feet in hot water daily to improve circulation", "I will see a podiatrist regularly for nail care"],
    a: 2,
    r: "Soaking feet in hot water is contraindicated in diabetic clients because peripheral neuropathy impairs temperature sensation, increasing the risk of thermal burns. Additionally, prolonged soaking macerates the skin, creating entry points for infection. Feet should be washed with lukewarm water, dried thoroughly (especially between toes), and moisturized (avoiding between toes to prevent fungal growth).",
    s: "Endocrine"
  },
  {
    q: "A client with hyperparathyroidism has a serum calcium of 13.2 mg/dL. Which assessment is the highest priority?",
    o: ["Muscle strength and reflexes", "Cardiac rhythm monitoring", "Skin turgor and oral mucosa", "Bowel sounds and dietary intake"],
    a: 1,
    r: "Hypercalcemia above 12 mg/dL can cause life-threatening cardiac arrhythmias including shortened QT interval, heart block, and cardiac arrest. Cardiac monitoring is the highest priority. Other concerns include renal calculi (flank pain), pathologic fractures, constipation, and neurological changes (confusion, lethargy). Treatment includes IV NS for hydration and loop diuretics (furosemide) to promote calcium excretion.",
    s: "Endocrine"
  },
  {
    q: "A nurse is assessing a client with suspected thyroid storm. Which cluster of findings is most consistent with this diagnosis?",
    o: ["Bradycardia, hypothermia, and constipation", "Tachycardia greater than 140, fever above 40°C, and altered mental status", "Hypotension, cool extremities, and weight gain", "Normal heart rate with mild anxiety"],
    a: 1,
    r: "Thyroid storm is a life-threatening acceleration of hyperthyroidism characterized by severe tachycardia (often > 140 bpm, may be atrial fibrillation), high fever (> 40°C/104°F), altered mental status (agitation, delirium, psychosis, coma), diaphoresis, nausea/vomiting/diarrhea, and potential cardiovascular collapse. Mortality is 10-30% even with treatment. It requires ICU management.",
    s: "Endocrine"
  },
  {
    q: "A client with type 1 diabetes is planning to exercise. Which instruction should the nurse provide about insulin and exercise?",
    o: ["Take extra insulin before exercising to prevent hyperglycemia", "Exercise lowers blood glucose; eat a carbohydrate snack if glucose is below 100 mg/dL before exercising", "Inject insulin into the exercising limb to speed absorption", "Skip insulin on days when planning to exercise"],
    a: 1,
    r: "Exercise increases glucose uptake by muscle cells independently of insulin, lowering blood glucose. A pre-exercise glucose below 100 mg/dL requires a carbohydrate snack to prevent hypoglycemia. Insulin should NOT be injected into the exercising limb as increased blood flow accelerates absorption and can cause hypoglycemia. Never skip insulin; instead, adjust timing and carbohydrate intake.",
    s: "Endocrine"
  },
  {
    q: "A client with myxedema coma presents with hypothermia (34°C), bradycardia, hypotension, and altered consciousness. Which treatment is the priority?",
    o: ["Active external rewarming with heated blankets", "IV levothyroxine and IV hydrocortisone", "Oral thyroid hormone replacement", "Fluid restriction and diuretics"],
    a: 1,
    r: "Myxedema coma is a life-threatening decompensation of hypothyroidism. Treatment requires IV levothyroxine (oral absorption is unreliable in this state) and IV hydrocortisone (to prevent adrenal crisis from sudden increase in metabolic rate without adequate cortisol). Passive rewarming (blankets) is used rather than active rewarming, which can cause peripheral vasodilation and cardiovascular collapse.",
    s: "Endocrine"
  },
  {
    q: "A client with Graves' disease is being prepared for a thyroidectomy. The nurse expects which preoperative medications to be administered?",
    o: ["Levothyroxine to supplement thyroid function", "Potassium iodide (SSKI) and antithyroid medication to decrease thyroid vascularity and hormone levels", "IV calcium gluconate to prevent postoperative hypocalcemia", "Propylthiouracil (PTU) alone without any additional medications"],
    a: 1,
    r: "Preoperative preparation for thyroidectomy in Graves' disease includes antithyroid medication (methimazole or PTU) to bring the client to a euthyroid state, and potassium iodide (SSKI/Lugol's solution) given 10-14 days preoperatively to decrease thyroid gland vascularity and size, reducing surgical bleeding risk. Beta-blockers may also be used to control heart rate.",
    s: "Endocrine"
  },
  {
    q: "A client with hyperosmolar hyperglycemic state (HHS) has a blood glucose of 1,100 mg/dL, serum osmolality of 380 mOsm/kg, and no ketones in the urine. What distinguishes HHS from DKA?",
    o: ["HHS occurs only in type 1 diabetes", "HHS has significant ketoacidosis with a low pH", "HHS has extreme hyperglycemia and hyperosmolality without significant ketosis", "HHS causes Kussmaul respirations"],
    a: 2,
    r: "HHS occurs predominantly in type 2 diabetes where enough insulin is present to prevent lipolysis and ketone production, but not enough to prevent hyperglycemia. This results in extreme hyperglycemia (often > 600 mg/dL), severe dehydration, high serum osmolality, and altered mental status WITHOUT the ketoacidosis seen in DKA. Treatment focuses on massive fluid replacement (often 6-10 liters deficit) and careful insulin therapy.",
    s: "Endocrine"
  },
  {
    q: "A nurse is teaching a client how to use an insulin pen. Which instruction is correct?",
    o: ["Insert the needle and inject immediately without waiting", "Prime the pen by dialing 2 units and pressing the plunger before each injection", "Reuse the needle for up to 7 injections", "Shake the pen vigorously before each use regardless of insulin type"],
    a: 1,
    r: "Insulin pens must be primed before each injection to ensure the needle is patent and remove air bubbles. The client dials 2 units and presses the plunger until insulin appears at the needle tip. Needles should be used once and disposed of in a sharps container. Cloudy insulins (NPH) are gently rolled, not shaken; clear insulins (rapid-acting, long-acting) should not be shaken.",
    s: "Endocrine"
  },
  // ===== RENAL (Questions 79-104) =====
  {
    q: "A client with chronic kidney disease (CKD) has a GFR of 12 mL/min. Which clinical manifestation does the nurse expect?",
    o: ["Polyuria and polydipsia", "Uremic frost, anemia, metabolic acidosis, and hyperkalemia", "Increased appetite and weight gain", "Hypocalcemia only"],
    a: 1,
    r: "A GFR below 15 mL/min represents end-stage renal disease (Stage 5 CKD). The kidneys cannot excrete waste products, leading to uremia (uremic frost on skin, nausea, confusion), hyperkalemia (impaired K+ excretion), metabolic acidosis (impaired H+ excretion and bicarbonate regeneration), anemia (decreased erythropoietin), and hypocalcemia with hyperphosphatemia. Dialysis or transplant is indicated.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client on hemodialysis. During the session, the client reports dizziness, nausea, and muscle cramps. BP drops from 130/78 to 88/52. What is the priority action?",
    o: ["Continue dialysis at a slower rate", "Place the client in Trendelenburg position and administer a normal saline bolus", "Stop dialysis immediately and disconnect the client", "Administer an antiemetic and continue the session"],
    a: 1,
    r: "These symptoms indicate dialysis disequilibrium or hypotension from rapid fluid removal. The priority is to lower the head (Trendelenburg or flat position) and administer a saline bolus (100-200 mL) to restore intravascular volume. The dialysis rate may be slowed. Disconnecting entirely would leave blood in the circuit. Vital signs should be reassessed frequently.",
    s: "Renal"
  },
  {
    q: "A client with an arteriovenous fistula (AVF) for hemodialysis asks about care of the fistula arm. Which instruction is correct?",
    o: ["Blood pressures and venipunctures should be performed on the fistula arm for accuracy", "Palpate for a thrill and auscultate for a bruit daily to confirm patency", "Wear tight sleeves to protect the fistula from injury", "Apply cold compresses to the fistula site daily"],
    a: 1,
    r: "A thrill (palpable vibration) and bruit (auscultated whooshing sound) indicate a patent, functioning AVF. The client should check these daily. Blood pressures, venipunctures, and tourniquets must NEVER be applied to the fistula arm as they can compress and clot the fistula. No tight clothing or jewelry on that arm. Report absence of thrill/bruit immediately as this indicates clotting.",
    s: "Renal"
  },
  {
    q: "A client with a kidney stone is in severe flank pain. The nurse notes the urine is tea-colored. Which priority nursing intervention should be implemented?",
    o: ["Restrict fluid intake to reduce stone movement", "Strain all urine and encourage fluids to 2-3 liters daily", "Apply ice packs to the flank area", "Prepare the client for immediate surgical intervention"],
    a: 1,
    r: "All urine must be strained to capture the stone for composition analysis, which guides prevention strategies. Increased fluid intake (2-3 L/day) dilutes urine and promotes stone passage. Tea-colored urine suggests hematuria from stone trauma to the urinary tract. Pain management with NSAIDs or opioids is essential. Most stones smaller than 5 mm pass spontaneously.",
    s: "Renal"
  },
  {
    q: "A client with acute kidney injury (AKI) is in the oliguric phase. The nurse monitors intake and output closely. What is the expected urine output during this phase?",
    o: ["Greater than 3 liters per day", "Less than 400 mL per day", "Exactly 1,500 mL per day", "No urine output at all (anuria)"],
    a: 1,
    r: "The oliguric phase of AKI is defined by urine output less than 400 mL per day (or less than 0.5 mL/kg/hr). During this phase, BUN and creatinine rise, fluid overload develops (edema, hypertension, pulmonary congestion), hyperkalemia occurs, and metabolic acidosis develops. The oliguric phase typically lasts 1-2 weeks. Anuria (no urine) is less common and suggests severe renal damage.",
    s: "Renal"
  },
  {
    q: "A client on peritoneal dialysis develops cloudy dialysate return, abdominal pain, and fever. What does the nurse suspect?",
    o: ["Normal peritoneal dialysis findings", "Peritonitis from catheter-related infection", "Bowel perforation", "Allergic reaction to dialysate solution"],
    a: 1,
    r: "Cloudy effluent is the hallmark sign of peritonitis in peritoneal dialysis patients. Combined with abdominal pain and fever, this triad is nearly diagnostic. The nurse should obtain a dialysate sample for culture and cell count, notify the provider, and anticipate intraperitoneal antibiotics (usually vancomycin and gentamicin added to the dialysate). Strict aseptic technique during exchanges prevents peritonitis.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client with nephrotic syndrome. Urinalysis shows 4+ protein. Serum albumin is 1.6 g/dL. Which nursing intervention is the highest priority?",
    o: ["Encourage a high-protein diet to replace lost protein", "Monitor for signs of thromboembolism and administer anticoagulants as prescribed", "Restrict all sodium and potassium intake", "Begin immediate hemodialysis"],
    a: 1,
    r: "Nephrotic syndrome causes massive proteinuria, leading to hypoalbuminemia. Loss of antithrombin III and other anticoagulant proteins in the urine creates a hypercoagulable state. DVT and pulmonary embolism are serious complications. While dietary protein modification, sodium restriction, and edema management are important, thromboembolism prevention is a priority safety concern that can be immediately life-threatening.",
    s: "Renal"
  },
  {
    q: "A client with a urinary tract infection (UTI) is prescribed phenazopyridine (Pyridium). Which instruction should the nurse provide?",
    o: ["This medication treats the infection and replaces antibiotics", "Your urine will turn orange-red; this is expected and not blood", "Take this medication indefinitely to prevent recurrence", "Avoid drinking fluids while taking this medication"],
    a: 1,
    r: "Phenazopyridine is a urinary analgesic that relieves burning and urgency but does NOT treat the infection. It turns urine bright orange-red, which can stain clothing and contact lenses. It is taken for a maximum of 2 days alongside antibiotics. The client should still complete the full antibiotic course. Increased fluid intake should be encouraged, not restricted.",
    s: "Renal"
  },
  {
    q: "A nurse is assessing a client who underwent a kidney transplant 3 days ago. Which finding suggests acute organ rejection?",
    o: ["Increased urine output and stable creatinine", "Fever, decreased urine output, rising creatinine, and tenderness over the graft site", "Weight loss and improved appetite", "Stable blood pressure and normal CBC"],
    a: 1,
    r: "Acute rejection typically occurs within days to months after transplant. Signs include fever, oliguria (decreased urine output), rising serum creatinine, weight gain (fluid retention), hypertension, and tenderness or swelling over the graft site. The nurse should notify the transplant team immediately as urgent intervention (pulse-dose steroids, adjustment of immunosuppression) can often reverse acute rejection if caught early.",
    s: "Renal"
  },
  {
    q: "A client with CKD has a phosphorus level of 7.8 mg/dL and calcium of 7.2 mg/dL. Which medication should the nurse expect to be prescribed?",
    o: ["Calcium carbonate (phosphate binder) taken with meals", "IV calcium chloride", "Aluminum hydroxide on an empty stomach", "Calcitonin nasal spray"],
    a: 0,
    r: "In CKD, the kidneys cannot excrete phosphorus, leading to hyperphosphatemia. Elevated phosphorus binds with calcium, causing hypocalcemia. Calcium-based phosphate binders (calcium carbonate, calcium acetate) are taken WITH meals to bind dietary phosphorus in the GI tract, preventing absorption. They also help correct hypocalcemia. Aluminum-based binders are avoided in CKD due to aluminum toxicity risk.",
    s: "Renal"
  },
  {
    q: "A nurse is teaching a client with a history of calcium oxalate kidney stones about dietary modifications. Which food should the client limit?",
    o: ["Chicken breast and rice", "Spinach, chocolate, and tea", "Apples and bananas", "White bread and pasta"],
    a: 1,
    r: "Calcium oxalate stones are the most common type. Foods high in oxalate (spinach, rhubarb, beets, chocolate, tea, nuts, dark green leafy vegetables) should be limited. Adequate calcium intake from dietary sources is actually recommended (not restricted) as dietary calcium binds oxalate in the gut, preventing absorption. Fluid intake of 2-3 L/day is essential to dilute urine and prevent stone formation.",
    s: "Renal"
  },
  {
    q: "A client receiving continuous bladder irrigation (CBI) after a transurethral resection of the prostate (TURP) has output that has changed from light pink to cherry red with clots. What should the nurse do?",
    o: ["Document the finding and continue routine monitoring", "Increase the CBI flow rate to clear the clots and notify the provider", "Stop the CBI and clamp the catheter", "Remove the catheter and reinsert a new one"],
    a: 1,
    r: "Cherry red output with clots after TURP suggests increased bleeding. The nurse should increase the CBI flow rate to flush clots from the bladder (clots can obstruct the catheter causing bladder distension and further bleeding), manually irrigate per protocol if clots persist, and notify the surgeon. The catheter should NEVER be removed as it provides tamponade from the balloon at the surgical site.",
    s: "Renal"
  },
  {
    q: "A client with polycystic kidney disease (PKD) asks about the genetic implications. Which statement by the nurse is accurate?",
    o: ["PKD is not hereditary and cannot be passed to children", "Autosomal dominant PKD means each child has a 50% chance of inheriting the disease", "PKD only affects females", "PKD can be cured with early antibiotic therapy"],
    a: 1,
    r: "Autosomal dominant polycystic kidney disease (ADPKD) is the most common hereditary kidney disease. Each offspring has a 50% chance of inheriting the mutant gene. The disease causes progressive cyst formation in both kidneys, eventually leading to renal failure. Genetic counseling should be offered. There is no cure; management focuses on blood pressure control, pain management, and eventually dialysis or transplant.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client with a suprapubic catheter. Which assessment finding requires immediate intervention?",
    o: ["Clear yellow urine output of 300 mL over 8 hours", "Purulent drainage, erythema, and warmth around the catheter insertion site", "Mild discomfort at the insertion site", "Small amount of serous drainage at the site"],
    a: 1,
    r: "Purulent drainage, erythema (redness), and warmth around the suprapubic catheter site indicate infection. The nurse should obtain a wound culture, notify the provider, and anticipate antibiotic therapy. Catheter site care should be performed per protocol with aseptic technique. A small amount of serous drainage is normal for new insertion sites. Urine output of 300 mL/8 hours (37.5 mL/hr) is adequate.",
    s: "Renal"
  },
  // ===== MATERNITY (Questions 105-130) =====
  {
    q: "A nurse is monitoring a client in labor. The electronic fetal monitor shows late decelerations with each contraction. What is the priority nursing action?",
    o: ["Continue monitoring and document the pattern", "Position the client on the left side, administer oxygen, increase IV fluids, and notify the provider", "Prepare for immediate vaginal delivery", "Administer oxytocin to strengthen contractions"],
    a: 1,
    r: "Late decelerations indicate uteroplacental insufficiency (the placenta is not providing adequate oxygen to the fetus during contractions). Intrauterine resuscitation measures include: left lateral positioning (improves uterine blood flow), oxygen by face mask, increasing IV fluids, and discontinuing oxytocin if infusing. The provider must be notified as persistent late decelerations may require emergency cesarean delivery.",
    s: "Maternity"
  },
  {
    q: "A postpartum client's fundus is palpated 2 cm above the umbilicus and deviated to the right, 1 hour after delivery. What is the most likely cause?",
    o: ["Normal uterine involution", "Distended bladder preventing uterine contraction", "Retained placental fragments", "Uterine rupture"],
    a: 1,
    r: "A uterus deviated to the right that is higher than expected (should be at the umbilicus immediately postpartum) is most commonly caused by a distended bladder displacing the uterus. The priority intervention is to have the client void or, if unable, perform straight catheterization. A full bladder prevents the uterus from contracting effectively, increasing the risk of postpartum hemorrhage.",
    s: "Maternity"
  },
  {
    q: "A client at 36 weeks gestation presents with sudden, severe abdominal pain, a rigid board-like abdomen, and dark red vaginal bleeding. Which condition does the nurse suspect?",
    o: ["Placenta previa", "Placental abruption", "Uterine rupture", "Preterm labor"],
    a: 1,
    r: "Placental abruption presents with sudden, severe abdominal pain, rigid board-like uterus (uterine tetany), dark red vaginal bleeding (although concealed hemorrhage may occur without visible bleeding), and signs of fetal distress. This contrasts with placenta previa, which presents with painless, bright red vaginal bleeding. Abruption is a life-threatening emergency often requiring emergency cesarean delivery.",
    s: "Maternity"
  },
  {
    q: "A nurse is teaching a pregnant client about warning signs that require immediate medical attention. Which symptom should the nurse emphasize?",
    o: ["Mild ankle swelling at the end of the day", "Sudden severe headache with visual changes and facial edema", "Occasional Braxton Hicks contractions", "Increased urinary frequency in the first trimester"],
    a: 1,
    r: "Sudden severe headache with visual changes (blurred vision, scotomata, flashing lights) and facial edema are warning signs of preeclampsia, which can rapidly progress to eclampsia (seizures), HELLP syndrome, and maternal/fetal death. The client should seek immediate emergency care. Ankle swelling, Braxton Hicks, and urinary frequency are common normal pregnancy changes.",
    s: "Maternity"
  },
  {
    q: "A newborn has an Apgar score of 3 at 1 minute. Which components most likely contributed to this low score?",
    o: ["Active crying, pink color, vigorous movement", "Limp muscle tone, absent reflex, slow heart rate below 100, blue extremities, slow irregular respirations", "Good muscle tone with slight cyanosis of feet", "Normal heart rate with strong cry"],
    a: 1,
    r: "An Apgar of 3 indicates severe depression requiring immediate resuscitation. The five components scored 0-2 each are: heart rate, respiratory effort, muscle tone, reflex irritability, and color. A score of 3 suggests critically low values across multiple categories. Immediate interventions include positive pressure ventilation, suctioning, warmth, and potentially chest compressions and epinephrine if heart rate remains below 60 bpm.",
    s: "Maternity"
  },
  {
    q: "A client at 28 weeks gestation with gestational diabetes has a fasting blood glucose of 126 mg/dL. Current dietary management alone is not controlling glucose. What is the expected next step?",
    o: ["Add oral metformin only", "Initiate insulin therapy", "Continue diet management and recheck in 4 weeks", "Prescribe glyburide as sole therapy"],
    a: 1,
    r: "When medical nutrition therapy fails to control gestational diabetes (fasting glucose > 95 mg/dL or 2-hour postprandial > 120 mg/dL), insulin is the preferred pharmacotherapy because it does not cross the placenta. While some providers use glyburide or metformin as alternatives, insulin remains the gold standard for gestational diabetes when diet alone is insufficient. Uncontrolled hyperglycemia increases risk for macrosomia, birth injury, and neonatal hypoglycemia.",
    s: "Maternity"
  },
  {
    q: "A nurse is caring for a client receiving magnesium sulfate for severe preeclampsia. Which finding requires the nurse to HOLD the infusion and notify the provider?",
    o: ["Deep tendon reflexes 2+ (normal)", "Respiratory rate of 10 breaths per minute", "Urine output of 40 mL/hour", "Blood pressure of 148/92"],
    a: 1,
    r: "Magnesium sulfate toxicity is monitored by checking respiratory rate, deep tendon reflexes, and urine output. A respiratory rate below 12/min indicates magnesium toxicity and the infusion must be held immediately. The antidote calcium gluconate (10 mL of 10% solution IV) should be at the bedside. Normal DTRs (2+) and adequate urine output (>30 mL/hr) indicate therapeutic levels. Elevated BP is expected in preeclampsia.",
    s: "Maternity"
  },
  {
    q: "A laboring client's amniotic fluid is green-tinged when membranes rupture. What does this indicate and what is the priority?",
    o: ["Normal variation in amniotic fluid color", "Meconium-stained fluid indicating possible fetal distress; prepare for potential neonatal suctioning", "Infection requiring immediate antibiotics", "Bloody show indicating cervical dilation"],
    a: 1,
    r: "Green-tinged amniotic fluid indicates meconium passage, which can occur when the fetus experiences stress or hypoxia in utero. The concern is meconium aspiration syndrome (MAS), which can cause severe respiratory distress in the newborn. The neonatal team should be present at delivery. If the newborn is vigorous (crying, good tone, HR > 100), routine care proceeds. If depressed, tracheal suctioning may be needed.",
    s: "Maternity"
  },
  {
    q: "A postpartum client is saturating a perineal pad every 15 minutes with bright red blood. The uterus is firm and midline. What is the most likely cause of the bleeding?",
    o: ["Uterine atony", "Cervical or vaginal laceration", "Retained placental fragments", "Normal postpartum bleeding"],
    a: 1,
    r: "When the uterus is firm and well-contracted but heavy bleeding continues, the most likely cause is a laceration of the cervix, vagina, or perineum. Uterine atony (the most common cause of postpartum hemorrhage) presents with a boggy, soft uterus. The provider should be notified to examine the birth canal for lacerations requiring repair. Continuous bright red bleeding with a firm uterus is a laceration until proven otherwise.",
    s: "Maternity"
  },
  {
    q: "A client at 34 weeks gestation is diagnosed with placenta previa. Which nursing intervention is most appropriate?",
    o: ["Perform a vaginal exam to assess cervical dilation", "Maintain strict bed rest, monitor for bleeding, and avoid vaginal exams", "Prepare for immediate vaginal delivery", "Encourage ambulation to promote fetal descent"],
    a: 1,
    r: "Placenta previa (placenta partially or completely covering the cervical os) contraindicates vaginal examinations because digital exam can disrupt the placenta and cause massive hemorrhage. Management includes bed rest, monitoring for bleeding, fetal surveillance, and preparation for cesarean delivery if bleeding is significant. Steroids are given to accelerate fetal lung maturity if delivery may be preterm.",
    s: "Maternity"
  },
  {
    q: "A nurse is assessing a newborn 12 hours after birth. The infant has a yellowish skin tone. Total serum bilirubin is 4.2 mg/dL. What is the most appropriate nursing action?",
    o: ["Initiate phototherapy immediately", "Document as physiological jaundice and continue monitoring", "Prepare for exchange transfusion", "Restrict breastfeeding and switch to formula"],
    a: 1,
    r: "Jaundice appearing after 24 hours of life with a bilirubin of 4.2 mg/dL is consistent with physiological jaundice, which is a normal finding in approximately 60% of term newborns. It results from immature liver conjugation of bilirubin and increased RBC breakdown. Phototherapy is typically not initiated until bilirubin reaches threshold levels based on the Bhutani nomogram. Jaundice within the FIRST 24 hours is pathological and requires urgent evaluation.",
    s: "Maternity"
  },
  {
    q: "A client in active labor has an epidural in place. She suddenly complains of severe headache, tinnitus, and a metallic taste in her mouth. BP drops to 72/40. What does the nurse suspect?",
    o: ["Normal epidural side effects", "Systemic local anesthetic toxicity (intravascular injection)", "Epidural hematoma", "Anxiety-related symptoms"],
    a: 1,
    r: "Metallic taste, tinnitus, severe headache, and sudden hypotension after epidural administration suggest systemic local anesthetic toxicity from intravascular injection of the anesthetic. This is a medical emergency that can progress to seizures and cardiac arrest. The nurse should stop the infusion immediately, call for help, administer IV lipid emulsion (Intralipid) as the antidote, and provide supportive care.",
    s: "Maternity"
  },
  {
    q: "A primigravida at 30 weeks gestation presents with regular contractions every 5 minutes. Cervical exam shows 2 cm dilation and 50% effacement. What is the priority intervention?",
    o: ["Allow labor to progress naturally", "Administer tocolytics (terbutaline or nifedipine) to stop contractions and betamethasone for fetal lung maturity", "Prepare for immediate cesarean section", "Encourage walking to progress labor"],
    a: 1,
    r: "At 30 weeks, the goal is to delay delivery to allow fetal lung maturation. Tocolytics (terbutaline, nifedipine, magnesium sulfate) inhibit uterine contractions. Antenatal corticosteroids (betamethasone 12 mg IM x 2 doses, 24 hours apart) accelerate fetal surfactant production, reducing risk of respiratory distress syndrome. The steroids are most effective when delivery occurs 24 hours to 7 days after administration.",
    s: "Maternity"
  },
  {
    q: "A nurse is performing a Leopold's maneuver and feels a hard, round, ballotable mass in the fundal area and a soft, irregular mass in the lower segment. What is the fetal presentation?",
    o: ["Vertex (cephalic) presentation", "Breech presentation", "Transverse lie", "Face presentation"],
    a: 1,
    r: "The hard, round, ballotable mass at the fundus is the fetal head (it ballots easily due to the neck allowing movement). The soft, irregular mass in the lower segment is the buttocks. This indicates breech presentation (buttocks presenting first). Vertex presentation would have the hard head in the lower segment. Leopold's maneuvers are performed systematically in four steps to determine fetal position, lie, and presentation.",
    s: "Maternity"
  },
  {
    q: "A postpartum client with a history of cesarean delivery 2 years ago is attempting vaginal birth after cesarean (VBAC). She suddenly reports a tearing sensation and sharp abdominal pain. The fetal heart rate drops to 60 bpm. What does the nurse suspect?",
    o: ["Normal labor pain from cervical dilation", "Uterine rupture requiring emergency cesarean delivery", "Placental abruption", "Epidural-related hypotension"],
    a: 1,
    r: "A sudden tearing sensation, sharp abdominal pain, and fetal bradycardia during VBAC attempt are classic signs of uterine rupture at the previous cesarean scar site. This is a life-threatening emergency for both mother and fetus. The nurse should call an emergency cesarean section, administer oxygen, establish large-bore IV access, and type and crossmatch blood. Maternal hemorrhage and fetal death can occur within minutes.",
    s: "Maternity"
  },
  {
    q: "A nurse is assessing a 2-day-old breastfed newborn. The infant has lost 8% of birth weight and has had 2 wet diapers in the last 24 hours. What should the nurse do?",
    o: ["This is normal; no intervention needed", "Assess latch and feeding technique, encourage feeding every 2-3 hours, and notify the pediatrician", "Immediately switch to formula feeding", "Begin IV fluid supplementation"],
    a: 1,
    r: "Weight loss up to 7% in the first few days is normal for breastfed newborns, but 8% is at the upper limit and warrants closer monitoring. Only 2 wet diapers in 24 hours suggests suboptimal intake (by day 2, expect 2-3 wet diapers, increasing to 6-8 by day 5). Assessment of latch, feeding frequency, and maternal milk supply is needed. A lactation consultant should be involved. Supplementation may be needed if weight loss continues.",
    s: "Maternity"
  },
  // ===== MENTAL HEALTH (Questions 131-156) =====
  {
    q: "A client is admitted to the psychiatric unit after a suicide attempt. During the initial assessment, the client states, 'I still want to die. I have a plan.' What is the nurse's priority action?",
    o: ["Document the statement and continue the assessment", "Place the client on one-to-one continuous observation", "Ask the client to sign a no-suicide contract", "Leave the client alone to process their feelings"],
    a: 1,
    r: "A client expressing active suicidal ideation with a plan is at HIGH and IMMINENT risk. One-to-one continuous observation (1:1 sitter) is the priority safety intervention to prevent self-harm. The nurse should also remove all potentially harmful objects (sharps, belts, shoelaces, cords), notify the psychiatrist, and initiate suicide precautions per facility protocol. No-suicide contracts have no evidence of effectiveness.",
    s: "Mental Health"
  },
  {
    q: "A client with schizophrenia tells the nurse, 'The CIA implanted a tracking device in my brain.' Which response by the nurse is most therapeutic?",
    o: ["That's not true, the CIA doesn't do that", "I understand that feels very real to you. I don't share that belief, but I want to understand how it makes you feel", "Why do you think the CIA would target you?", "Let me check your head to see if there's a device"],
    a: 1,
    r: "The therapeutic response acknowledges the client's experience without reinforcing the delusion. Do not argue with delusions (increases anxiety and entrenchment), do not validate them as real, and do not provide logical arguments against them. The nurse should present reality gently, focus on the feelings behind the delusion, and redirect to reality-based topics. Building trust is essential for therapeutic relationship.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client experiencing alcohol withdrawal. The client is tremulous, diaphoretic, and reports seeing insects crawling on the walls. What is the priority intervention?",
    o: ["Orient the client to reality and provide reassurance", "Administer benzodiazepines as prescribed and monitor using the CIWA scale", "Apply physical restraints for safety", "Encourage the client to sleep off the symptoms"],
    a: 1,
    r: "Alcohol withdrawal with visual hallucinations, tremors, and diaphoresis suggests progression toward delirium tremens, a potentially fatal condition. Benzodiazepines (chlordiazepoxide, lorazepam, or diazepam) are the gold standard treatment, titrated using the Clinical Institute Withdrawal Assessment (CIWA-Ar) scale. Scores above 20 indicate severe withdrawal requiring aggressive benzodiazepine dosing, seizure precautions, and continuous monitoring.",
    s: "Mental Health"
  },
  {
    q: "A client with bipolar disorder in a manic episode has not slept for 3 days, is pacing the halls, talking rapidly, and spending money extravagantly. Which nursing diagnosis is the highest priority?",
    o: ["Disturbed thought processes", "Risk for injury related to impaired judgment and hyperactivity", "Social isolation", "Deficient knowledge regarding disease process"],
    a: 1,
    r: "During a manic episode, the client's impaired judgment, hyperactivity, and risk-taking behavior (excessive spending, sexual indiscretion, reckless driving) create immediate safety risks. Physical exhaustion from not sleeping or eating compounds the danger. The priority is safety: a calm, low-stimulus environment, adequate nutrition and hydration, monitoring for physical exhaustion, and medication management (lithium, valproic acid, antipsychotics).",
    s: "Mental Health"
  },
  {
    q: "A client taking lithium for bipolar disorder has a serum lithium level of 2.1 mEq/L. The client presents with vomiting, coarse tremors, confusion, and oliguria. What should the nurse do?",
    o: ["Continue lithium as prescribed and recheck the level in 1 week", "Hold lithium immediately, notify the provider, and prepare for potential dialysis", "Increase fluid intake and continue the current dose", "Administer an additional dose of lithium to stabilize the client"],
    a: 1,
    r: "A lithium level of 2.1 mEq/L is in the toxic range (therapeutic: 0.6-1.2 mEq/L). Symptoms of toxicity include severe nausea/vomiting, coarse tremors (fine tremors are a side effect at therapeutic levels), confusion, seizures, coma, and renal failure (oliguria). Lithium must be held immediately. IV fluids are administered to promote renal excretion. Hemodialysis may be needed for severe toxicity (levels > 2.5 mEq/L) or renal failure.",
    s: "Mental Health"
  },
  {
    q: "A client with anorexia nervosa has been admitted with a BMI of 14. During refeeding, the nurse monitors for which life-threatening complication?",
    o: ["Hyperglycemia", "Refeeding syndrome with severe hypophosphatemia", "Iron deficiency anemia", "Vitamin C deficiency"],
    a: 1,
    r: "Refeeding syndrome occurs when a severely malnourished client is given nutrition too rapidly. Insulin release drives glucose, phosphate, potassium, and magnesium into cells, causing dangerous serum drops. Severe hypophosphatemia is the hallmark: phosphate below 1.0 mg/dL can cause respiratory failure, cardiac arrhythmias, seizures, and death. Refeeding must start slowly (10-20 kcal/kg/day) with close electrolyte monitoring.",
    s: "Mental Health"
  },
  {
    q: "A client with PTSD has nightmares, hypervigilance, and avoids situations that remind them of the traumatic event. Which medication is first-line pharmacotherapy for PTSD?",
    o: ["Benzodiazepines (lorazepam)", "SSRIs (sertraline or paroxetine)", "Antipsychotics (haloperidol)", "Mood stabilizers (lithium)"],
    a: 1,
    r: "SSRIs (specifically sertraline and paroxetine, both FDA-approved for PTSD) are first-line pharmacotherapy for PTSD. They help manage hyperarousal, intrusive thoughts, and avoidance symptoms. Benzodiazepines are generally AVOIDED in PTSD as they can worsen outcomes, impair extinction learning, and carry addiction risk. Prazosin may be added specifically for nightmares. Trauma-focused psychotherapy (CPT, EMDR) is the gold standard non-pharmacological treatment.",
    s: "Mental Health"
  },
  {
    q: "A nurse on a psychiatric unit hears a client threatening to hit another client. Which intervention should the nurse implement first?",
    o: ["Apply physical restraints immediately", "Use a calm, non-threatening approach and attempt verbal de-escalation", "Call security and have the client secluded", "Administer a PRN intramuscular antipsychotic"],
    a: 1,
    r: "Verbal de-escalation is always the first intervention for managing aggressive behavior. The nurse should approach calmly, speak in a low, non-threatening tone, acknowledge the client's feelings, set clear behavioral expectations, and offer alternatives (PRN medication, quiet room). Physical restraints and seclusion are last-resort interventions used only when less restrictive measures fail and there is imminent danger to self or others.",
    s: "Mental Health"
  },
  {
    q: "A client taking an MAOI (phenelzine) for depression eats aged cheese and develops a severe occipital headache, neck stiffness, and BP of 220/130. What is this reaction?",
    o: ["Serotonin syndrome", "Hypertensive crisis from tyramine interaction", "Normal side effect of MAOI therapy", "Allergic reaction to cheese protein"],
    a: 1,
    r: "MAOIs inhibit monoamine oxidase, the enzyme that breaks down tyramine. When clients on MAOIs consume tyramine-rich foods (aged cheese, cured meats, red wine, fermented foods, soy sauce), unmetabolized tyramine causes massive norepinephrine release, producing a hypertensive crisis. Symptoms include severe occipital headache, neck stiffness, nausea, diaphoresis, and dangerously elevated BP. This is treated with IV phentolamine (alpha-blocker).",
    s: "Mental Health"
  },
  {
    q: "A client with obsessive-compulsive disorder (OCD) spends 3 hours daily performing handwashing rituals. The hands are raw and bleeding. Which nursing approach is most appropriate?",
    o: ["Prevent the client from washing hands entirely", "Allow time for rituals while gradually setting limits and introducing exposure-response prevention therapy", "Tell the client the behavior is irrational and should stop", "Ignore the behavior entirely"],
    a: 1,
    r: "Abruptly stopping compulsive rituals increases anxiety dramatically and is counterproductive. The therapeutic approach is to allow the rituals initially while building trust, then gradually reduce ritual time through exposure and response prevention (ERP). The nurse should not judge or criticize the behavior. SSRIs (fluvoxamine, fluoxetine) are first-line medication. CBT with ERP is the most effective psychological treatment.",
    s: "Mental Health"
  },
  {
    q: "A nurse is conducting a group therapy session. A client with borderline personality disorder (BPD) tells the nurse, 'You're the only one who understands me. The other nurses are terrible.' Which response is most appropriate?",
    o: ["Thank the client for the compliment and agree that the other nurses could improve", "Recognize this as splitting and respond with, 'All the nurses on this unit are working together to support your care'", "Ask the client to elaborate on what the other nurses are doing wrong", "Ignore the comment and move on"],
    a: 1,
    r: "Splitting (viewing people as all-good or all-bad) is a hallmark defense mechanism in BPD. The nurse should not accept the idealization or engage in devaluation of colleagues. Setting clear, consistent boundaries while maintaining a matter-of-fact therapeutic tone helps prevent staff splitting. Consistent communication among the treatment team about behavioral limits is essential.",
    s: "Mental Health"
  },
  {
    q: "A client is brought to the ED by police after being found wandering confused in traffic. The client's eyes are dilated, they are agitated, and complain of chest pain. Vital signs: HR 142, BP 198/112, temp 39.5°C. Urine drug screen is positive for cocaine. What is the priority intervention?",
    o: ["Administer a beta-blocker to control the heart rate", "Administer a benzodiazepine for agitation and prepare for cardiac monitoring", "Discharge the client once they are no longer intoxicated", "Administer naloxone (Narcan)"],
    a: 1,
    r: "Cocaine causes sympathomimetic toxicity: tachycardia, hypertension, hyperthermia, agitation, and chest pain (risk of MI even in young patients). Benzodiazepines are first-line to reduce agitation, lower heart rate and BP, and prevent seizures. Beta-blockers are CONTRAINDICATED in cocaine intoxication because blocking beta-receptors causes unopposed alpha stimulation, worsening hypertension and coronary vasoconstriction. Naloxone is for opioid overdose, not cocaine.",
    s: "Mental Health"
  },
  {
    q: "A client on the psychiatric unit has not responded to two adequate trials of antidepressants for treatment-resistant depression. Which medication should the nurse anticipate will be considered?",
    o: ["A third SSRI at a higher dose", "Clozapine", "Lithium augmentation or esketamine (Spravato)", "Discontinuing all medications and relying on therapy alone"],
    a: 2,
    r: "Treatment-resistant depression (failure to respond to two adequate antidepressant trials) has several evidence-based options. Lithium augmentation (adding lithium to the current antidepressant) is well-supported. Esketamine (Spravato), an intranasal NMDA receptor antagonist, is FDA-approved specifically for treatment-resistant depression and has rapid-onset effects. Other options include MAOIs, ECT, and TMS. Clozapine is for treatment-resistant schizophrenia, not depression.",
    s: "Mental Health"
  },
  {
    q: "A nurse is teaching a client about clozapine therapy for schizophrenia. Which monitoring requirement is essential to review?",
    o: ["Monthly thyroid function tests", "Weekly-to-biweekly absolute neutrophil count (ANC) monitoring", "Daily blood glucose checks", "Quarterly liver biopsies"],
    a: 1,
    r: "Clozapine carries a risk of life-threatening agranulocytosis (severe neutropenia) in 1-2% of clients. The Clozapine REMS program requires ANC monitoring: weekly for the first 6 months, biweekly for months 6-12, then monthly. If ANC drops below 1,500/mm³ (1,000/mm³ for clients with benign ethnic neutropenia), the medication must be held. Other side effects include metabolic syndrome, myocarditis, and seizures.",
    s: "Mental Health"
  },
  {
    q: "A client with generalized anxiety disorder (GAD) asks the nurse about the difference between buspirone and benzodiazepines. Which statement by the nurse is accurate?",
    o: ["Buspirone works immediately like benzodiazepines", "Buspirone takes 2-4 weeks for full effect but has no sedation, dependence, or withdrawal risk, unlike benzodiazepines", "Buspirone is more effective than benzodiazepines for panic attacks", "Buspirone and benzodiazepines are essentially the same medication"],
    a: 1,
    r: "Buspirone is a serotonin 5-HT1A partial agonist that takes 2-4 weeks for therapeutic effect. Unlike benzodiazepines, it does not cause sedation, cognitive impairment, physical dependence, or withdrawal symptoms. It is not effective for acute anxiety or panic attacks (delayed onset). It is ideal for chronic GAD management. Benzodiazepines work immediately but carry risks of dependence, tolerance, and withdrawal seizures.",
    s: "Mental Health"
  },
  {
    q: "A client who attempted suicide by acetaminophen overdose 4 hours ago is alert and states they feel fine. The nurse knows which information is critical to share with the client?",
    o: ["The overdose is no longer dangerous since you feel fine", "Acetaminophen toxicity has a delayed presentation; liver failure develops in 24-72 hours without treatment. N-acetylcysteine (NAC) must be started now", "You can be discharged since there are no immediate symptoms", "The only concern is nausea that will resolve on its own"],
    a: 1,
    r: "Acetaminophen toxicity is insidious: clients may feel well initially (stage 1: 0-24 hours) with only mild nausea. However, hepatotoxicity develops at 24-72 hours (stage 2-3): rising AST/ALT, jaundice, coagulopathy, and potentially fulminant liver failure. N-acetylcysteine (NAC) is most effective when given within 8 hours of ingestion but can still benefit up to 72 hours. Treatment should not be delayed despite the client appearing well.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client experiencing a panic attack. The client is hyperventilating, reports chest tightness, and believes they are having a heart attack. Which nursing intervention is most appropriate?",
    o: ["Tell the client it is just anxiety and to calm down", "Stay with the client, speak calmly, and guide slow breathing techniques", "Leave the client alone in a quiet room to self-regulate", "Administer IV morphine for chest pain"],
    a: 1,
    r: "During a panic attack, the nurse should remain with the client (leaving increases fear), speak in a calm, reassuring tone, and guide controlled breathing (slow diaphragmatic breathing to correct hyperventilation-induced respiratory alkalosis). Brief, simple statements are effective as the client cannot process complex information during acute anxiety. Once the acute phase resolves, teach the client to recognize triggers and coping strategies.",
    s: "Mental Health"
  },
  {
    q: "A client on a psychiatric unit refuses all medications, including their prescribed antipsychotic. The client is not an imminent danger to self or others. What is the appropriate nursing action?",
    o: ["Administer the medication covertly in food", "Respect the client's right to refuse and document the refusal", "Apply physical restraints and administer the medication IM", "Tell the client they will be discharged if they don't take their medication"],
    a: 1,
    r: "Competent clients have the right to refuse medication, even on a psychiatric unit. The nurse documents the refusal, notifies the prescriber, and educates the client about the medication's benefits and risks of refusal. Forced medication is only permissible in emergencies where the client is an imminent danger to self or others and less restrictive interventions have failed. Covert medication administration violates autonomy and trust.",
    s: "Mental Health"
  },
  {
    q: "A client with multiple sclerosis (MS) reports worsening fatigue, numbness in the legs, and blurred vision. The nurse recognizes these symptoms as a relapse. Which medication is typically administered during an acute MS exacerbation?",
    o: ["Oral methotrexate", "IV methylprednisolone (Solu-Medrol)", "Subcutaneous interferon beta-1a", "Oral baclofen"],
    a: 1,
    r: "Acute MS exacerbations (relapses) are treated with high-dose IV corticosteroids, typically methylprednisolone 1g/day for 3-5 days, to reduce inflammation and shorten the duration of the relapse. Interferon beta-1a is a disease-modifying therapy used for long-term prevention, not acute management. Baclofen treats spasticity but does not address the underlying inflammatory process of a relapse.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with epilepsy who begins having a tonic-clonic seizure. Which nursing action is most appropriate during the seizure?",
    o: ["Insert a padded tongue blade between the teeth", "Turn the client to the side and protect the head from injury", "Restrain the client's extremities to prevent injury", "Administer oral phenytoin immediately"],
    a: 1,
    r: "During a tonic-clonic seizure, the nurse should turn the client to the side (recovery position) to maintain airway patency and prevent aspiration, protect the head from injury, and time the seizure. Nothing should be placed in the mouth as this can cause tooth fractures or airway obstruction. Restraining extremities can cause musculoskeletal injuries. Oral medications cannot be given during active seizures; IV lorazepam is the first-line emergent treatment.",
    s: "Neurological"
  },
  {
    q: "A client post-craniotomy has a Glasgow Coma Scale (GCS) score that drops from 13 to 9 over 2 hours. The nurse notes a unilateral fixed dilated pupil. Which complication does the nurse suspect?",
    o: ["Cerebral vasospasm", "Uncal herniation from expanding intracranial mass", "Meningitis", "Normal postoperative swelling"],
    a: 1,
    r: "A declining GCS with unilateral fixed dilated pupil (ipsilateral to the lesion) strongly suggests uncal herniation, where the temporal lobe herniates through the tentorial notch and compresses cranial nerve III (oculomotor). This is a neurosurgical emergency requiring immediate intervention such as osmotic diuretics (mannitol), hyperventilation, and potential surgical decompression. A decline of 2+ GCS points is clinically significant and requires urgent notification.",
    s: "Neurological"
  },
  {
    q: "A nurse is performing a neurological assessment on a client admitted with suspected stroke. The client can follow commands but cannot name objects or repeat phrases. Which type of aphasia does this represent?",
    o: ["Wernicke's (receptive) aphasia", "Broca's (expressive) aphasia", "Global aphasia", "Dysarthria"],
    a: 1,
    r: "Broca's aphasia (expressive aphasia) results from damage to Broca's area in the frontal lobe. Clients understand spoken language and can follow commands, but have difficulty producing speech, naming objects, and repeating phrases. Wernicke's aphasia involves fluent but nonsensical speech with impaired comprehension. Global aphasia affects both expression and comprehension. Dysarthria is a motor speech disorder, not a language disorder.",
    s: "Neurological"
  },
  {
    q: "A client with a subarachnoid hemorrhage from a ruptured cerebral aneurysm is at risk for cerebral vasospasm. The nurse knows this complication most commonly occurs during which timeframe?",
    o: ["Within the first 6 hours", "Days 4-14 after the hemorrhage", "After 30 days", "Only during the initial bleed"],
    a: 1,
    r: "Cerebral vasospasm is the most dangerous complication of subarachnoid hemorrhage (SAH), occurring most commonly between days 4-14 post-bleed, with peak incidence around days 7-10. It causes ischemic neurological deficits due to arterial narrowing. Nimodipine (a calcium channel blocker) is given prophylactically to reduce vasospasm severity. Triple-H therapy (hypertension, hypervolemia, hemodilution) may be used to maintain cerebral perfusion.",
    s: "Neurological"
  },
  {
    q: "A client with status epilepticus has been seizing for 8 minutes. IV access is established. Which medication does the nurse anticipate administering first?",
    o: ["IV phenytoin (Dilantin)", "IV lorazepam (Ativan)", "IV phenobarbital", "IV levetiracetam (Keppra)"],
    a: 1,
    r: "IV lorazepam (Ativan) is the first-line treatment for status epilepticus. Benzodiazepines act rapidly by enhancing GABA-mediated inhibition to terminate seizure activity. The typical dose is 0.1 mg/kg IV (max 4 mg per dose), which may be repeated once after 5 minutes. If benzodiazepines fail, second-line agents include IV fosphenytoin, valproic acid, or levetiracetam. Status epilepticus (seizure lasting >5 minutes) is a neurological emergency with risks of hypoxia, brain injury, and death.",
    s: "Neurological"
  },
  {
    q: "A client with hepatic encephalopathy is started on lactulose. The nurse knows the therapeutic goal of lactulose is to achieve which outcome?",
    o: ["Reduce portal hypertension", "Produce 2-3 soft stools per day to excrete ammonia", "Treat the underlying hepatitis infection", "Increase serum albumin levels"],
    a: 1,
    r: "Lactulose is an osmotic laxative that converts ammonia (NH3) to ammonium (NH4+) in the gut, which cannot be reabsorbed and is excreted in stool. The therapeutic goal is 2-3 soft stools per day. More frequent stools may cause dehydration and electrolyte imbalances. Hepatic encephalopathy results from the failing liver's inability to convert ammonia to urea. Rifaximin may be added as adjunctive therapy to reduce ammonia-producing bacteria.",
    s: "Gastrointestinal"
  },
  {
    q: "A client presents to the emergency department with acute upper GI bleeding. The nurse notes coffee-ground emesis and melena. Which nursing action takes priority?",
    o: ["Insert a nasogastric tube for lavage", "Establish two large-bore IV lines and begin fluid resuscitation", "Prepare the client for immediate endoscopy", "Administer oral proton pump inhibitors"],
    a: 1,
    r: "The priority in acute upper GI bleeding is hemodynamic stabilization. Establishing two large-bore (16-18 gauge) IV lines allows rapid fluid and blood product administration. The nurse assesses for signs of hemorrhagic shock (tachycardia, hypotension, altered mental status). Type and crossmatch should be sent. IV proton pump inhibitors (not oral) may be started. Endoscopy is performed once the client is stabilized to identify and treat the bleeding source.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with acute pancreatitis has a serum lipase level 5 times the upper limit of normal and severe epigastric pain radiating to the back. Which position does the nurse encourage to reduce pain?",
    o: ["Supine with legs elevated", "Leaning forward with knees drawn up (fetal position)", "Prone position", "Side-lying on the right side"],
    a: 1,
    r: "The forward-leaning or fetal position reduces tension on the peritoneum and decreases pancreatic duct pressure, providing pain relief in acute pancreatitis. Lying supine often increases pain. Management includes NPO status, IV fluid resuscitation, IV analgesics (hydromorphone or morphine), and monitoring for complications such as pancreatic necrosis, pseudocyst formation, and multiorgan failure. Serum lipase is the most specific marker for pancreatitis.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is assessing a client with a suspected small bowel obstruction. Which combination of findings is most consistent with this diagnosis?",
    o: ["Absent bowel sounds and board-like abdomen", "Colicky abdominal pain, vomiting, abdominal distension, and high-pitched bowel sounds", "Right lower quadrant pain with rebound tenderness", "Painless jaundice with clay-colored stools"],
    a: 1,
    r: "Small bowel obstruction (SBO) presents with colicky (intermittent, cramping) abdominal pain, vomiting (often bilious and early in the course), abdominal distension, and high-pitched hyperactive bowel sounds proximal to the obstruction. As obstruction progresses, bowel sounds may become absent, indicating possible strangulation or perforation. Management includes NPO, nasogastric decompression, IV fluids, and surgical consultation. Adhesions from prior surgery are the most common cause.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with cirrhosis develops tense ascites. The physician plans to perform a paracentesis. Which nursing intervention is essential during the procedure?",
    o: ["Position the client prone", "Monitor blood pressure closely and administer IV albumin as ordered", "Encourage the client to drink fluids during the procedure", "Clamp the drainage after 500 mL"],
    a: 1,
    r: "During large-volume paracentesis (>5 liters), there is a risk of post-paracentesis circulatory dysfunction (PPCD) due to rapid fluid shifts, causing hypotension. IV albumin (6-8 g per liter removed) is administered to prevent this complication. The client is positioned upright or on the edge of the bed. Vital signs are monitored frequently. Rapid removal of ascitic fluid without albumin replacement can lead to hepatorenal syndrome and cardiovascular collapse.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with ulcerative colitis is experiencing a severe flare with bloody diarrhea (10+ stools/day), fever, and tachycardia. The nurse monitors for which life-threatening complication?",
    o: ["Appendicitis", "Toxic megacolon", "Peptic ulcer perforation", "Diverticulitis"],
    a: 1,
    r: "Toxic megacolon is a life-threatening complication of severe ulcerative colitis where the colon dilates massively (>6 cm on X-ray), with risk of perforation, sepsis, and death. Signs include fever, tachycardia, abdominal distension, and decreased bowel sounds. Management includes NPO, nasogastric decompression, IV corticosteroids, broad-spectrum antibiotics, and urgent surgical consultation. If medical management fails within 24-72 hours, colectomy is indicated.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with Crohn's disease is prescribed infliximab (Remicade). Before initiating therapy, which screening test is essential?",
    o: ["Serum ferritin level", "Tuberculosis (TB) screening test", "Fasting blood glucose", "Serum calcium level"],
    a: 1,
    r: "Infliximab is a TNF-alpha inhibitor (biologic therapy) that suppresses the immune system. Before initiating treatment, clients must be screened for latent tuberculosis (TB) because TNF-alpha inhibitors can reactivate latent TB, leading to disseminated disease. A tuberculin skin test (TST) or interferon-gamma release assay (IGRA) is required. Clients should also be screened for hepatitis B. During treatment, monitor for serious infections, infusion reactions, and malignancy risk.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with thyroid storm presents with a temperature of 40.5°C (105°F), heart rate of 160, agitation, and delirium. Which medication does the nurse anticipate administering first?",
    o: ["Levothyroxine (Synthroid)", "Propylthiouracil (PTU) followed by iodine solution", "Radioactive iodine (I-131)", "Metformin"],
    a: 1,
    r: "Thyroid storm is a life-threatening hypermetabolic crisis. Treatment follows a specific sequence: PTU is given first to block new thyroid hormone synthesis, followed at least 1 hour later by iodine solution (SSKI or Lugol's) to inhibit hormone release. Beta-blockers (propranolol) control sympathetic symptoms. Corticosteroids (hydrocortisone) block peripheral T4 to T3 conversion. Cooling measures address hyperthermia. Levothyroxine would worsen the crisis. Radioactive iodine is contraindicated in acute thyroid storm.",
    s: "Endocrine"
  },
  {
    q: "A client with Addison's disease is brought to the emergency department in Addisonian crisis. The nurse expects to find which set of clinical findings?",
    o: ["Hypertension, hyperglycemia, and moon face", "Severe hypotension, hyperkalemia, hyponatremia, and hypoglycemia", "Polyuria, polydipsia, and weight loss", "Exophthalmos and heat intolerance"],
    a: 1,
    r: "Addisonian crisis (acute adrenal insufficiency) results from cortisol and aldosterone deficiency. Without aldosterone, sodium and water are lost and potassium is retained, causing severe hypotension, hyponatremia, and hyperkalemia. Without cortisol, hypoglycemia occurs. The client may present with profound weakness, abdominal pain, and altered consciousness. Emergency treatment includes IV hydrocortisone (stress dose), aggressive IV normal saline, and dextrose for hypoglycemia. The crisis may be triggered by infection, surgery, or abrupt steroid withdrawal.",
    s: "Endocrine"
  },
  {
    q: "A client with SIADH (Syndrome of Inappropriate Antidiuretic Hormone) has a serum sodium of 118 mEq/L. Which intervention does the nurse implement?",
    o: ["Administer IV hypotonic saline rapidly", "Restrict fluids to 500-1000 mL/day and administer hypertonic saline cautiously", "Encourage increased oral fluid intake", "Administer IV potassium chloride"],
    a: 1,
    r: "SIADH causes excessive ADH secretion leading to water retention and dilutional hyponatremia. Management includes strict fluid restriction (500-1000 mL/day), and for severe hyponatremia (<120 mEq/L or symptomatic), cautious administration of 3% hypertonic saline. Sodium must be corrected slowly (no more than 8-10 mEq/L in 24 hours) to prevent osmotic demyelination syndrome (central pontine myelinolysis), which causes irreversible neurological damage. Demeclocycline or tolvaptan may be used for chronic SIADH.",
    s: "Endocrine"
  },
  {
    q: "A client with diabetes insipidus (DI) is excreting large volumes of dilute urine (8 liters/day). The nurse anticipates which medication to be prescribed?",
    o: ["Furosemide (Lasix)", "Desmopressin (DDAVP)", "Spironolactone", "Metformin"],
    a: 1,
    r: "Central diabetes insipidus is caused by insufficient ADH production from the posterior pituitary. Desmopressin (DDAVP) is a synthetic ADH analog that replaces the missing hormone, reducing urine output and increasing urine concentration. It can be given intranasally, orally, or IV. Without treatment, clients can excrete 5-20 liters of dilute urine daily, leading to severe dehydration and hypernatremia. The nurse monitors daily weights, strict I&O, serum sodium, and urine specific gravity.",
    s: "Endocrine"
  },
  {
    q: "A client with pheochromocytoma is scheduled for adrenalectomy. The nurse knows which medication must be started preoperatively, and in what order?",
    o: ["Beta-blocker first, then alpha-blocker", "Alpha-blocker (phenoxybenzamine) first for 10-14 days, then beta-blocker if needed", "ACE inhibitor followed by diuretic", "Calcium channel blocker alone"],
    a: 1,
    r: "Pheochromocytoma secretes excessive catecholamines (epinephrine, norepinephrine) causing severe hypertension. Alpha-blockade must be initiated FIRST (phenoxybenzamine for 10-14 days) to prevent hypertensive crisis during tumor manipulation. Beta-blockers are added ONLY AFTER adequate alpha-blockade to control tachycardia. Giving a beta-blocker first causes unopposed alpha-receptor stimulation, leading to potentially fatal hypertensive crisis. The client should also receive liberal salt and fluid intake to expand the contracted intravascular volume.",
    s: "Endocrine"
  },
  {
    q: "A client with diabetic ketoacidosis (DKA) has a blood glucose of 450 mg/dL, pH 7.18, and serum potassium of 3.2 mEq/L. The nurse knows which action must occur before starting insulin?",
    o: ["Administer IV sodium bicarbonate", "Replace potassium to at least 3.3 mEq/L before starting insulin", "Give a bolus of D50W", "Administer subcutaneous regular insulin"],
    a: 1,
    r: "In DKA, insulin drives potassium from the extracellular space into cells. If the client is already hypokalemic (K+ <3.3 mEq/L), insulin administration can cause life-threatening hypokalemia leading to fatal cardiac arrhythmias. Potassium must be replaced to at least 3.3 mEq/L before insulin infusion begins. IV regular insulin (not subcutaneous) is used for DKA. Bicarbonate is only considered if pH <6.9. Continuous cardiac monitoring is essential during potassium replacement.",
    s: "Endocrine"
  },
  {
    q: "A client with acute kidney injury (AKI) has a serum potassium of 6.8 mEq/L and peaked T waves on the ECG. Which intervention does the nurse implement first?",
    o: ["Administer oral kayexalate", "Administer IV calcium gluconate to stabilize the myocardium", "Prepare for hemodialysis", "Restrict dietary potassium"],
    a: 1,
    r: "Severe hyperkalemia (>6.5 mEq/L) with ECG changes is a medical emergency. IV calcium gluconate is the first intervention as it stabilizes the cardiac membrane within 1-3 minutes, reducing the risk of fatal arrhythmias. It does not lower potassium levels but provides cardioprotection while other interventions take effect. Subsequently, IV insulin with dextrose shifts potassium intracellularly, and kayexalate or hemodialysis removes potassium from the body. The nurse monitors for cardiac arrest throughout.",
    s: "Renal"
  },
  {
    q: "A nurse is comparing prerenal, intrarenal, and postrenal causes of acute kidney injury. A client with heart failure who develops oliguria and elevated BUN/creatinine most likely has which type?",
    o: ["Intrarenal AKI from glomerulonephritis", "Prerenal AKI from decreased renal perfusion", "Postrenal AKI from obstruction", "Chronic kidney disease"],
    a: 1,
    r: "Prerenal AKI results from decreased renal perfusion without intrinsic kidney damage. Heart failure reduces cardiac output, decreasing blood flow to the kidneys. Other prerenal causes include hypovolemia, sepsis, and hemorrhage. The BUN:creatinine ratio is typically >20:1 in prerenal AKI. Fractional excretion of sodium (FENa) <1% indicates prerenal etiology. Prerenal AKI is reversible if perfusion is restored promptly. Prolonged ischemia can progress to intrarenal (acute tubular necrosis) damage.",
    s: "Renal"
  },
  {
    q: "A client on hemodialysis complains of sudden headache, nausea, confusion, and muscle cramps during the procedure. The nurse suspects dialysis disequilibrium syndrome. What is the appropriate action?",
    o: ["Increase the dialysis flow rate to finish faster", "Slow the dialysis rate and notify the provider", "Discontinue dialysis permanently", "Administer IV heparin"],
    a: 1,
    r: "Dialysis disequilibrium syndrome occurs when urea is removed from the blood faster than from the brain, creating an osmotic gradient that pulls water into brain tissue, causing cerebral edema. Symptoms include headache, nausea, vomiting, confusion, and potentially seizures. The nurse slows the dialysis rate to reduce the osmotic shift and notifies the provider. IV mannitol may be administered to counteract cerebral edema. This syndrome is more common in new dialysis clients or those with very high BUN levels.",
    s: "Renal"
  },
  {
    q: "A client with chronic kidney disease (CKD) stage 5 has a phosphorus level of 7.2 mg/dL and calcium of 7.8 mg/dL. Which medication does the nurse anticipate?",
    o: ["Calcium supplements to increase calcium", "Phosphate binders (sevelamer or calcium acetate) with meals", "Vitamin D supplements only", "IV normal saline bolus"],
    a: 1,
    r: "In CKD, the kidneys cannot excrete phosphorus, leading to hyperphosphatemia. Elevated phosphorus binds to calcium, causing hypocalcemia, which triggers secondary hyperparathyroidism and renal osteodystrophy. Phosphate binders (sevelamer, calcium acetate, lanthanum) are taken WITH meals to bind dietary phosphorus in the GI tract, preventing absorption. Active vitamin D (calcitriol) may also be prescribed to improve calcium absorption. Dietary phosphorus restriction (limiting dairy, processed foods) is also essential.",
    s: "Renal"
  },
  {
    q: "A client with nephrotic syndrome presents with severe edema, proteinuria (>3.5 g/day), hypoalbuminemia, and hyperlipidemia. Which finding is the hallmark that differentiates nephrotic from nephritic syndrome?",
    o: ["Hematuria with RBC casts", "Massive proteinuria (>3.5 g/day) with hypoalbuminemia", "Hypertension with oliguria", "Elevated serum creatinine only"],
    a: 1,
    r: "Nephrotic syndrome is characterized by massive proteinuria (>3.5 g/day), hypoalbuminemia (albumin <3 g/dL), severe generalized edema, and hyperlipidemia. The glomerular basement membrane becomes permeable to proteins. In contrast, nephritic syndrome presents with hematuria (RBC casts), mild proteinuria, hypertension, and oliguria. Clients with nephrotic syndrome are at increased risk for thromboembolism due to loss of antithrombin III in urine, and infection due to loss of immunoglobulins.",
    s: "Renal"
  },
  {
    q: "A client with end-stage renal disease on peritoneal dialysis develops cloudy dialysate effluent, abdominal pain, and fever. The nurse suspects which complication?",
    o: ["Peritoneal dialysis catheter occlusion", "Peritonitis", "Dialysis disequilibrium syndrome", "Uremic pericarditis"],
    a: 1,
    r: "Cloudy dialysate effluent is the hallmark sign of peritonitis in peritoneal dialysis clients. Other signs include abdominal pain, fever, and rebound tenderness. The effluent should be sent for culture and cell count (WBC >100 with >50% neutrophils confirms peritonitis). Treatment includes intraperitoneal antibiotics (vancomycin + aminoglycoside or cephalosporin). If peritonitis is recurrent or caused by fungi, the catheter must be removed. Strict aseptic technique during exchanges is the best prevention.",
    s: "Renal"
  },
  {
    q: "A client at 34 weeks gestation presents with a blood pressure of 168/110, proteinuria (3+), severe headache, visual disturbances, and epigastric pain. The nurse recognizes these findings as which condition?",
    o: ["Gestational hypertension", "Severe preeclampsia with warning signs of eclampsia", "HELLP syndrome", "Chronic hypertension"],
    a: 1,
    r: "Severe preeclampsia is defined by BP ≥160/110 on two occasions, significant proteinuria, and end-organ involvement. Headache, visual disturbances (scotomata, blurred vision), and epigastric/RUQ pain (hepatic capsule distension) are warning signs of impending eclampsia (seizures). Immediate management includes IV magnesium sulfate for seizure prophylaxis, IV antihypertensives (labetalol or hydralazine), continuous fetal monitoring, and evaluation for delivery. Magnesium toxicity is monitored via deep tendon reflexes, respiratory rate, and urine output.",
    s: "Maternity"
  },
  {
    q: "A client receiving IV magnesium sulfate for preeclampsia has absent deep tendon reflexes, a respiratory rate of 10, and urine output of 15 mL/hour. What should the nurse do immediately?",
    o: ["Continue the infusion and recheck in 1 hour", "Stop the magnesium sulfate infusion and administer calcium gluconate", "Increase the infusion rate to treat the preeclampsia", "Administer IV furosemide for low urine output"],
    a: 1,
    r: "These findings indicate magnesium sulfate toxicity. Therapeutic serum magnesium is 4-7 mEq/L. Toxicity signs progress: loss of DTRs (9-12 mEq/L), respiratory depression (12-15 mEq/L), cardiac arrest (>25 mEq/L). The infusion must be stopped immediately and calcium gluconate (the antidote) administered IV push. Before each dose, the nurse assesses DTRs (must be present), respiratory rate (must be ≥12), and urine output (must be ≥30 mL/hour). Continuous pulse oximetry and cardiac monitoring are essential.",
    s: "Maternity"
  },
  {
    q: "A client at 32 weeks gestation presents with painless, bright red vaginal bleeding. The nurse suspects placenta previa. Which assessment is contraindicated?",
    o: ["External fetal monitoring", "Measuring maternal vital signs", "Digital cervical examination", "Ultrasound to confirm placental location"],
    a: 1,
    r: "Digital cervical examination is absolutely contraindicated in suspected placenta previa because it can disrupt the placenta and cause massive hemorrhage. Placenta previa occurs when the placenta partially or completely covers the internal cervical os. Diagnosis is confirmed by transabdominal ultrasound. Management depends on severity and gestational age: mild bleeding may be managed with bed rest and observation; severe hemorrhage requires emergency cesarean delivery regardless of gestational age. Rh-negative mothers need RhoGAM.",
    s: "Maternity"
  },
  {
    q: "A postpartum client 2 hours after vaginal delivery has a boggy uterus, heavy lochia rubra, and blood pressure of 90/58. The nurse suspects uterine atony. What is the priority intervention?",
    o: ["Administer IV antibiotics", "Perform fundal massage and administer oxytocin (Pitocin)", "Prepare for immediate hysterectomy", "Apply cold packs to the perineum"],
    a: 1,
    r: "Uterine atony (failure of the uterus to contract after delivery) is the most common cause of postpartum hemorrhage, responsible for 70-80% of cases. The priority is bimanual fundal massage to stimulate uterine contraction, followed by oxytocin (Pitocin) infusion. If atony persists, methylergonovine (Methergine), carboprost (Hemabate), or misoprostol may be administered. The nurse monitors vital signs, lochia, and fundal firmness every 15 minutes. A full bladder can impede uterine contraction and should be emptied.",
    s: "Maternity"
  },
  {
    q: "A laboring client at 38 weeks gestation has a fetal heart rate tracing showing late decelerations with each contraction. The nurse interprets this pattern as indicating what?",
    o: ["Normal fetal response to head compression", "Uteroplacental insufficiency with potential fetal hypoxia", "Umbilical cord compression", "Fetal tachyarrhythmia"],
    a: 1,
    r: "Late decelerations begin after the peak of the contraction and return to baseline after the contraction ends. They indicate uteroplacental insufficiency, meaning the placenta cannot adequately oxygenate the fetus during contractions. Causes include maternal hypotension, uterine hyperstimulation, and placental dysfunction. Nursing interventions include repositioning the client to the left lateral position, administering oxygen, increasing IV fluids, discontinuing oxytocin, and notifying the provider. Persistent late decelerations may require emergent delivery.",
    s: "Maternity"
  },
  {
    q: "A client at 28 weeks gestation is diagnosed with premature rupture of membranes (PPROM). Which intervention does the nurse anticipate to promote fetal lung maturity?",
    o: ["Immediate induction of labor", "Administration of betamethasone (antenatal corticosteroids)", "Emergency cesarean section", "Oral antibiotics only"],
    a: 1,
    r: "Betamethasone (12 mg IM, two doses 24 hours apart) is administered between 24-34 weeks gestation to accelerate fetal lung maturity by stimulating surfactant production. This reduces the incidence and severity of respiratory distress syndrome (RDS) in premature neonates. With PPROM, expectant management also includes antibiotics (ampicillin and azithromycin) to prolong latency and reduce infection risk, bed rest, and monitoring for chorioamnionitis (maternal fever, fetal tachycardia, uterine tenderness, foul-smelling amniotic fluid).",
    s: "Maternity"
  },
  {
    q: "A postpartum client develops a temperature of 38.5°C, uterine tenderness, and foul-smelling lochia on postpartum day 3. The nurse suspects which complication?",
    o: ["Normal postpartum diuresis", "Endometritis (postpartum uterine infection)", "Mastitis", "Pulmonary embolism"],
    a: 1,
    r: "Endometritis is the most common postpartum infection, presenting with fever (≥38°C on any 2 of the first 10 postpartum days), uterine tenderness, and foul-smelling or purulent lochia. Risk factors include cesarean delivery, prolonged labor, PROM, and multiple vaginal examinations. Treatment includes broad-spectrum IV antibiotics (typically clindamycin plus gentamicin). The nurse monitors vital signs, lochia characteristics, and uterine involution. Blood cultures should be obtained before initiating antibiotics.",
    s: "Maternity"
  },
  {
    q: "A nurse is caring for a client in the emergency department who discloses suicidal ideation with a specific plan (taking a stockpile of medications at home) and timeline (tonight). Which action is the highest priority?",
    o: ["Encourage the client to call a friend for support", "Ensure continuous one-to-one observation and initiate safety protocols, including removing access to means", "Schedule a follow-up appointment with a therapist next week", "Discharge the client with a crisis hotline number"],
    a: 1,
    r: "A client with suicidal ideation, a specific plan, and access to means is at imminent risk and requires the highest level of intervention. Continuous one-to-one observation prevents self-harm. Restricting access to means (arranging removal of the medication stockpile from the home) is the most effective suicide prevention strategy. The client should not be left alone, should be assessed for involuntary hospitalization if refusing voluntary admission, and the treatment team should be notified immediately. Discharge is contraindicated.",
    s: "Mental Health"
  },
  {
    q: "A client diagnosed with borderline personality disorder (BPD) alternately praises the nurse as 'the best nurse ever' and the next shift tells another nurse that the previous nurse was 'terrible and incompetent.' The nurse recognizes this behavior as which defense mechanism?",
    o: ["Projection", "Splitting", "Displacement", "Rationalization"],
    a: 1,
    r: "Splitting is a primitive defense mechanism commonly seen in borderline personality disorder where people and situations are viewed as all good or all bad, with no middle ground. This creates staff conflicts and inconsistent care. The nursing approach includes maintaining consistent boundaries, using a unified treatment plan, and regular team communication to prevent staff splitting. The nurse avoids personalizing the behavior and remains therapeutic. Dialectical behavior therapy (DBT) is the evidence-based treatment for BPD.",
    s: "Mental Health"
  },
  {
    q: "A client prescribed lithium for bipolar disorder has a serum lithium level of 2.1 mEq/L. The nurse assesses the client and expects to find which symptoms?",
    o: ["No symptoms; this is a therapeutic level", "Severe toxicity symptoms: coarse tremors, confusion, seizures, oliguria, and cardiac dysrhythmias", "Mild fine tremor and mild nausea only", "Euphoria and increased energy"],
    a: 1,
    r: "The therapeutic range for lithium is 0.6-1.2 mEq/L. A level of 2.1 mEq/L indicates severe toxicity. Symptoms include coarse tremors, ataxia, confusion, seizures, renal failure (oliguria), and cardiac dysrhythmias. Lithium has a narrow therapeutic index, making toxicity common. Risk factors include dehydration, sodium depletion, NSAIDs, and renal impairment. Treatment includes stopping lithium, aggressive IV hydration with normal saline, and possibly hemodialysis for levels >2.5 mEq/L or severe symptoms. There is no antidote for lithium toxicity.",
    s: "Mental Health"
  },
  {
    q: "A client with schizophrenia on haloperidol (Haldol) develops a temperature of 41°C, muscle rigidity, altered consciousness, elevated CK, and autonomic instability. The nurse suspects which condition?",
    o: ["Serotonin syndrome", "Neuroleptic malignant syndrome (NMS)", "Malignant hyperthermia", "Extrapyramidal side effects"],
    a: 1,
    r: "Neuroleptic malignant syndrome (NMS) is a life-threatening reaction to antipsychotic medications (especially high-potency typical antipsychotics like haloperidol). Cardinal features include hyperthermia (>40°C), severe muscle rigidity ('lead pipe'), altered mental status, and autonomic instability (tachycardia, labile BP, diaphoresis). Elevated CK (from rhabdomyolysis) is a key lab finding. Treatment includes immediate discontinuation of the antipsychotic, dantrolene (muscle relaxant), bromocriptine (dopamine agonist), cooling measures, and aggressive IV hydration. Mortality is 10-20% without treatment.",
    s: "Mental Health"
  },
  {
    q: "A nurse is using therapeutic communication with a grieving client. The client says, 'I don't know how I'll go on without my husband.' Which response by the nurse is most therapeutic?",
    o: ["Don't worry, time heals all wounds", "I know exactly how you feel; my father passed away last year", "It sounds like you're feeling overwhelmed by this loss. Tell me more about what you're experiencing", "You should join a support group; that will help"],
    a: 1,
    r: "The most therapeutic response uses empathic reflection to acknowledge the client's feelings and an open-ended invitation to explore further. This validates the client's emotional experience without minimizing it. Saying 'don't worry' or 'time heals' is dismissive and blocks communication. Sharing personal experiences shifts focus to the nurse and is a non-therapeutic technique. Giving advice ('join a support group') takes away the client's autonomy. Therapeutic communication techniques include active listening, reflection, and open-ended questions.",
    s: "Mental Health"
  },
  {
    q: "A client with alcohol use disorder is admitted with confusion, ataxia, and ophthalmoplegia (paralysis of eye muscles). The nurse anticipates the administration of which medication?",
    o: ["Oral multivitamin", "IV thiamine (vitamin B1) before any glucose-containing fluids", "IV dextrose 50% immediately", "Oral naltrexone"],
    a: 1,
    r: "The triad of confusion, ataxia, and ophthalmoplegia is classic for Wernicke's encephalopathy, caused by thiamine (B1) deficiency in chronic alcohol use. IV thiamine must be administered BEFORE any glucose-containing fluids because glucose metabolism consumes thiamine, potentially precipitating or worsening Wernicke's encephalopathy. If untreated, it can progress to Korsakoff syndrome (irreversible confabulation and memory impairment). High-dose IV thiamine (500 mg TID for 2-3 days) is the standard treatment.",
    s: "Mental Health"
  },
  {
    q: "A nurse is assessing a client with hepatorenal syndrome (HRS). Which finding distinguishes HRS from other causes of acute kidney injury?",
    o: ["Proteinuria greater than 3 g/day", "Oliguria with bland urine sediment, low urinary sodium (<10 mEq/L), and no improvement with volume expansion", "Hematuria with red cell casts", "Polyuria with dilute urine"],
    a: 1,
    r: "Hepatorenal syndrome (HRS) occurs in clients with advanced liver disease (cirrhosis with ascites). It is characterized by functional renal failure due to intense renal vasoconstriction, NOT structural kidney damage. The urine sediment is bland (no casts, no cells), urinary sodium is very low (<10 mEq/L), and importantly, kidney function does not improve with volume expansion (which differentiates it from prerenal AKI). Treatment includes vasoconstrictors (terlipressin, midodrine/octreotide) plus albumin. Liver transplantation is the definitive treatment.",
    s: "Renal"
  },
  {
    q: "A client with myxedema coma is found obtunded with a body temperature of 33°C, heart rate of 42, and blood pressure of 80/50. Which intervention does the nurse anticipate?",
    o: ["Oral levothyroxine and discharge home", "IV levothyroxine, IV hydrocortisone, passive rewarming, and hemodynamic support", "Propylthiouracil and cooling blankets", "IV normal saline only"],
    a: 1,
    r: "Myxedema coma is a life-threatening decompensation of severe hypothyroidism presenting with hypothermia, bradycardia, hypotension, hypoventilation, and altered mental status. Treatment includes IV levothyroxine (T4) loading dose, IV hydrocortisone (to prevent adrenal crisis from increased cortisol metabolism as thyroid function is restored), passive rewarming (active rewarming can cause vasodilation and cardiovascular collapse), and hemodynamic support. Oral medications are unreliable due to decreased GI motility. ICU admission is required.",
    s: "Endocrine"
  },
  {
    q: "A client with rhabdomyolysis has a serum CK of 45,000 U/L and dark brown urine. The nurse knows which renal complication is the greatest concern?",
    o: ["Nephrotic syndrome", "Acute tubular necrosis from myoglobin precipitation in renal tubules", "Renal artery stenosis", "Polycystic kidney disease"],
    a: 1,
    r: "Rhabdomyolysis releases large amounts of myoglobin from damaged skeletal muscle. Myoglobin precipitates in the renal tubules, especially in acidic urine, causing acute tubular necrosis (ATN) and potentially oliguric acute kidney injury. The dark brown urine is myoglobinuria. Management focuses on aggressive IV normal saline (200-300 mL/hr) to maintain high urine output (>200 mL/hr), alkalinization of urine with sodium bicarbonate to prevent myoglobin precipitation, and monitoring for hyperkalemia, hyperphosphatemia, and hypocalcemia.",
    s: "Renal"
  },
  {
    q: "A client with Guillain-Barré syndrome (GBS) reports progressive ascending weakness that began in the feet and has now reached the thighs. The nurse monitors most closely for which life-threatening complication?",
    o: ["Deep vein thrombosis", "Respiratory failure from ascending paralysis reaching the diaphragm", "Seizures", "Acute kidney injury"],
    a: 1,
    r: "Guillain-Barré syndrome causes ascending demyelinating polyneuropathy. The greatest danger is respiratory failure when paralysis ascends to involve the intercostal muscles and diaphragm. The nurse monitors vital capacity and negative inspiratory force (NIF) every 2-4 hours. Intubation is indicated when vital capacity drops below 15-20 mL/kg or NIF is weaker than -20 to -25 cmH2O. Treatment includes IV immunoglobulin (IVIG) or plasmapheresis. Autonomic dysfunction (labile BP, cardiac dysrhythmias) is another life-threatening complication requiring continuous cardiac monitoring.",
    s: "Neurological"
  },
  {
    q: "A client with liver cirrhosis has an INR of 4.2, platelet count of 45,000/mm³, and is actively bleeding from esophageal varices. Which blood product does the nurse anticipate administering first?",
    o: ["Packed red blood cells only", "Fresh frozen plasma (FFP) and platelets, followed by PRBCs", "Albumin only", "Cryoprecipitate only"],
    a: 1,
    r: "The client has coagulopathy (elevated INR from impaired hepatic synthesis of clotting factors) and thrombocytopenia, both common in cirrhosis. Active variceal bleeding with these abnormalities requires correction of the coagulopathy: FFP provides clotting factors (corrects INR), platelets address thrombocytopenia (transfuse if <50,000 with active bleeding), and PRBCs replace blood loss. Octreotide (vasoconstrictor) reduces portal pressure, and emergent endoscopic band ligation is the definitive treatment for variceal bleeding.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with chronic alcohol use presents with asterixis, confusion, and a serum ammonia level of 180 µmol/L. In addition to lactulose, which antibiotic is commonly prescribed to reduce ammonia-producing gut bacteria?",
    o: ["Metronidazole", "Rifaximin (Xifaxan)", "Ciprofloxacin", "Amoxicillin"],
    a: 1,
    r: "Rifaximin is a non-absorbable antibiotic that works locally in the gut to reduce ammonia-producing bacteria, decreasing the ammonia burden in hepatic encephalopathy. It is used as adjunctive therapy with lactulose and has been shown to reduce the recurrence of hepatic encephalopathy episodes. Unlike systemically absorbed antibiotics, rifaximin has minimal side effects and does not contribute to systemic antibiotic resistance. Asterixis (flapping tremor) is a classic sign of hepatic encephalopathy.",
    s: "Gastrointestinal"
  },
];
