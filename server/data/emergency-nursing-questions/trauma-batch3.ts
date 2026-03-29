import { EmergencyNursingQuestion } from "./types";

export const traumaBatch3Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 52-year-old female presents to the ED after a rear-end MVC. She has cervical tenderness, but her NEXUS criteria show no midline tenderness, no focal neurological deficits, normal alertness, no intoxication, and no distracting injuries. Based on the NEXUS criteria, should cervical spine imaging be obtained?",
    options: [
      "Yes — all MVC patients require cervical spine imaging regardless of clinical criteria",
      "No — the patient meets all NEXUS low-risk criteria and clinical clearance of the cervical spine is appropriate",
      "Yes — the presence of any cervical tenderness mandates imaging even if NEXUS criteria are met",
      "No imaging needed, but the patient should wear a cervical collar for 2 weeks as a precaution"
    ],
    correctAnswer: 1,
    rationaleLong: "The NEXUS (National Emergency X-Radiography Utilization Study) criteria provide a validated clinical decision tool for determining when cervical spine imaging can be safely omitted in trauma patients. The five NEXUS criteria are: (1) No posterior midline cervical spine tenderness, (2) No focal neurological deficit, (3) Normal alertness (GCS 15), (4) No intoxication, and (5) No painful distracting injury. If ALL five criteria are met, cervical spine imaging is not indicated, and the cervical spine can be clinically cleared. The study demonstrated 99.6% sensitivity for identifying clinically significant cervical spine injuries when all five criteria are negative. In this patient, although she has 'cervical tenderness,' the NEXUS criteria specifically require posterior MIDLINE tenderness to be absent. Non-midline cervical tenderness (such as lateral or anterior neck tenderness) does not trigger the need for imaging under NEXUS. The question states no midline tenderness, meeting this criterion. Since all five criteria are met, clinical clearance is appropriate. The alternative clinical decision tool is the Canadian C-Spine Rule (CCR), which has been shown in some studies to be slightly more sensitive and specific than NEXUS. The emergency nurse plays a critical role in accurately assessing NEXUS criteria — the nurse's clinical assessment of midline tenderness, neurological status, alertness, intoxication, and distracting injuries directly informs the imaging decision. Accurate documentation of these findings is essential for medicolegal purposes.",
    learningObjective: "Apply NEXUS criteria for clinical clearance of the cervical spine in trauma patients",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEXUS requires posterior MIDLINE tenderness — lateral or anterior cervical tenderness does not trigger the imaging requirement",
    clinicalPearls: [
      "NEXUS criteria: no midline tenderness, no focal deficit, alert, not intoxicated, no distracting injury",
      "NEXUS sensitivity is 99.6% for clinically significant cervical injuries when all criteria are negative",
      "The Canadian C-Spine Rule is an alternative validated clinical decision tool"
    ],
    safetyNote: "If ANY single NEXUS criterion is not met, imaging is indicated — do not selectively apply the criteria",
    distractorRationales: [
      "Not all MVC patients require imaging — validated clinical decision tools allow safe clearance",
      "Non-midline cervical tenderness does not trigger imaging under NEXUS criteria",
      "A cervical collar without evaluation is not an appropriate management strategy"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 67-year-old female on dual antiplatelet therapy (aspirin and clopidogrel) after coronary stent placement presents to the ED with a ground-level fall and left hip fracture. She requires surgical fixation. What is the nursing priority regarding her antiplatelet medications?",
    options: [
      "Immediately discontinue both antiplatelet agents to reduce surgical bleeding risk",
      "Communicate the dual antiplatelet therapy to the surgical team for risk-benefit discussion, as stopping medications may risk stent thrombosis while continuing risks surgical bleeding",
      "Administer platelet transfusion to reverse the antiplatelet effects before surgery",
      "Continue both medications as prescribed since they have no effect on surgical bleeding"
    ],
    correctAnswer: 1,
    rationaleLong: "Patients on dual antiplatelet therapy (DAPT) after coronary stent placement represent a complex clinical challenge when they require emergency or urgent surgery. The nurse's priority is clear communication of the medication history to the surgical team for an informed risk-benefit discussion. The dilemma is significant: discontinuing antiplatelet therapy risks catastrophic stent thrombosis (which has a mortality rate of 20-40%), while continuing therapy increases the risk of perioperative bleeding. The decision depends on multiple factors: the type of stent (drug-eluting stents require longer DAPT than bare-metal stents), the time since stent placement (risk of thrombosis is highest in the first 6 months, particularly the first 30 days), the urgency of the surgery (hip fractures generally should be repaired within 24-48 hours), and the anticipated blood loss. In many cases, the surgical team, cardiologist, and anesthesiologist will collaborate to determine the optimal approach. Options may include: proceeding with surgery while continuing aspirin and holding clopidogrel, bridging with a shorter-acting antiplatelet agent, or modifying the surgical technique. Simply discontinuing both medications without cardiology consultation is dangerous and could precipitate stent thrombosis. Platelet transfusion is generally ineffective at reversing clopidogrel's effect because the transfused platelets are rapidly exposed to the circulating clopidogrel metabolite. The emergency nurse must document the medications, communicate them clearly to all teams involved, and facilitate the multidisciplinary discussion.",
    learningObjective: "Manage antiplatelet therapy considerations in emergency surgical patients with coronary stents through multidisciplinary communication",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Never unilaterally discontinue dual antiplatelet therapy without cardiology consultation — stent thrombosis carries 20-40% mortality",
    clinicalPearls: [
      "Stent thrombosis from stopping DAPT has 20-40% mortality — risk-benefit discussion is essential",
      "Drug-eluting stents require longer DAPT than bare-metal stents",
      "Platelet transfusion is generally ineffective at reversing clopidogrel due to circulating active metabolite"
    ],
    safetyNote: "Always communicate antiplatelet and anticoagulant medications to ALL teams involved in surgical decision-making — medication-related complications are preventable",
    distractorRationales: [
      "Immediately stopping both agents without cardiology input risks catastrophic stent thrombosis",
      "Platelet transfusion is generally ineffective at reversing clopidogrel's mechanism of action",
      "DAPT significantly increases surgical bleeding — stating it has no effect is incorrect"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 30-year-old male presents to the ED with a traumatic amputation of the right index finger at the proximal interphalangeal joint from an industrial press. The amputated part has been properly preserved. The patient is hemodynamically stable. The nurse should prepare for what type of surgical intervention?",
    options: [
      "Simple wound closure of the stump — single digit replantation is never attempted",
      "Replantation should be attempted, particularly for the index finger which is critical for pinch grip function",
      "Skin grafting over the stump is the only option for single digit amputations",
      "The patient should be discharged with wound care instructions and outpatient orthopedic follow-up"
    ],
    correctAnswer: 1,
    rationaleLong: "Digital replantation is a microsurgical procedure that reattaches amputated digits by restoring arterial inflow, venous drainage, tendon continuity, and nerve function. The decision to attempt replantation depends on multiple factors including which digit is involved, the level of amputation, the mechanism of injury, and patient factors. The index finger is particularly important for replantation consideration because it works in opposition with the thumb to create the precision (pinch) grip, which is essential for fine motor tasks. Other strong indications for replantation include: thumb amputation (most critical digit for hand function), multiple digit amputations, amputations in children (excellent regenerative capacity), hand or wrist-level amputations, and clean guillotine-type amputations (sharp mechanisms have better outcomes than crush or avulsion mechanisms). Relative contraindications include: single digit amputations (ring or small finger), crush/avulsion mechanisms with extensive tissue damage, prolonged warm ischemia time, severe contamination, and patient comorbidities precluding prolonged surgery. The emergency nurse's role includes proper preservation of the amputated part, obtaining radiographs of both the stump and the amputated part, establishing IV access, administering antibiotics and tetanus prophylaxis, providing pain management, and facilitating urgent transfer to a replantation center (which is a specialized hand surgery or microsurgery center, not available at all hospitals). The cool ischemia time for digits is approximately 12-24 hours, so there is a window for coordinated transfer.",
    learningObjective: "Understand the indications for digital replantation and the nurse's role in facilitating microsurgical intervention",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Not all single digit amputations are treated with simple closure — index finger and thumb replantation is strongly indicated due to functional importance",
    clinicalPearls: [
      "Index finger and thumb are the strongest indications for single-digit replantation",
      "Cool ischemia time for digits: 12-24 hours; warm ischemia: 4-6 hours",
      "Clean guillotine amputations have better replantation outcomes than crush/avulsion mechanisms"
    ],
    safetyNote: "Ensure proper preservation of amputated parts (moist gauze, sealed bag, on ice) and facilitate urgent transfer to a replantation center",
    distractorRationales: [
      "Replantation is indicated for the functionally important index finger — not all single digits are treated the same",
      "Skin grafting alone does not restore the functional digit that replantation can achieve",
      "Discharging a replantation candidate without microsurgical evaluation is inappropriate"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A trauma patient in the ED develops abdominal compartment syndrome with an intra-abdominal pressure (IAP) of 28 mmHg measured via bladder pressure. The nurse notes decreasing urine output and increasing peak airway pressures on the ventilator. What is the definitive treatment?",
    options: [
      "Administer IV furosemide to reduce abdominal fluid and improve urine output",
      "Decompressive laparotomy to relieve the intra-abdominal hypertension",
      "Increase the ventilator tidal volume to overcome the increased airway pressures",
      "Insert a nasogastric tube for gastric decompression"
    ],
    correctAnswer: 1,
    rationaleLong: "Abdominal compartment syndrome (ACS) occurs when sustained intra-abdominal pressure (IAP) exceeds 20 mmHg with associated new organ dysfunction. This patient has an IAP of 28 mmHg with evidence of organ dysfunction: decreased urine output (renal compromise from renal vein compression and decreased renal perfusion) and increased peak airway pressures (respiratory compromise from the elevated diaphragm being pushed superiorly by the abdominal pressure). The definitive treatment for ACS is decompressive laparotomy — surgical opening of the abdominal cavity to immediately release the elevated pressure. The abdominal contents are often left exposed with a temporary abdominal closure device (vacuum-assisted closure or Bogota bag) to prevent recurrence while the underlying cause is treated. ACS in trauma patients most commonly results from massive fluid resuscitation (creating visceral and retroperitoneal edema), intra-abdominal hemorrhage, bowel edema, or packing for damage control surgery. The measurement of IAP via bladder pressure (Foley catheter pressure transduction) is the standard monitoring technique. The nurse measures IAP by instilling 25 mL of sterile saline into the bladder through the Foley catheter and connecting the drainage port to a pressure transducer at the level of the symphysis pubis. Sustained IAP greater than 12 mmHg is intra-abdominal hypertension; greater than 20 mmHg with organ dysfunction is ACS. Nonsurgical interventions (body positioning, gastric/colonic decompression, neuromuscular blockade, draining ascites) may be tried for intra-abdominal hypertension but are insufficient for established ACS with organ dysfunction.",
    learningObjective: "Recognize abdominal compartment syndrome and understand the indications for decompressive laparotomy",
    blueprintCategory: "Trauma",
    subtopic: "abdominal trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "IAP greater than 20 mmHg with organ dysfunction = ACS requiring decompressive laparotomy. Nonsurgical measures alone are insufficient for established ACS",
    clinicalPearls: [
      "ACS: IAP greater than 20 mmHg + new organ dysfunction — definitive treatment is decompressive laparotomy",
      "Bladder pressure measurement: instill 25 mL saline, transducer at symphysis pubis level",
      "Organ dysfunction in ACS: decreased urine output, increased airway pressures, hemodynamic instability"
    ],
    safetyNote: "Monitor IAP serially in high-risk trauma patients (massive resuscitation, damage control surgery) — early detection of rising pressure allows intervention before organ failure",
    distractorRationales: [
      "Diuretics do not address the mechanical compression causing organ dysfunction in ACS",
      "Increasing tidal volume does not address the underlying cause and may worsen lung injury",
      "NGT decompression may help with mild intra-abdominal hypertension but is insufficient for established ACS"
    ],
    lessonPath: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A 40-year-old male presents to the ED after an ATV rollover. He has an open book pelvic fracture with bilateral superior and inferior pubic rami fractures and sacroiliac joint disruption. Despite pelvic binder application and 4 units of PRBCs, he remains hypotensive with BP 78/44 mmHg. What is the next step in hemorrhage management?",
    options: [
      "Remove the pelvic binder and apply direct pressure to the pelvic wounds",
      "Perform angiographic embolization or preperitoneal pelvic packing to control arterial hemorrhage",
      "Continue transfusion with additional PRBCs and monitor for improvement",
      "Obtain a CT scan with contrast to identify the specific bleeding vessel"
    ],
    correctAnswer: 1,
    rationaleLong: "An open book pelvic fracture (anteroposterior compression type) with bilateral pubic rami fractures and SI joint disruption represents a severe pelvic ring disruption with massive hemorrhage potential. The pelvic binder has been applied correctly to reduce the pelvic volume and provide tamponade, but the patient remains hypotensive despite binder placement and 4 units of PRBCs. This indicates ongoing hemorrhage that the binder alone cannot control. The hemorrhage sources in pelvic fractures include: venous plexus bleeding (80% of cases — the presacral venous plexus and pelvic veins), arterial bleeding (20% of cases — branches of the internal iliac arteries), and fracture surface bleeding. When the pelvic binder and transfusion fail to stabilize the patient, the next step is either angiographic embolization (interventional radiology performs selective arterial embolization of bleeding branches of the internal iliac arteries) or preperitoneal pelvic packing (surgical placement of hemostatic packing in the preperitoneal space to tamponade venous bleeding). The choice between these approaches depends on institutional capability and whether the hemorrhage is predominantly arterial (better treated with embolization) or venous (better treated with packing). Some centers perform both procedures. Removing the pelvic binder would be catastrophic as it would release the volume reduction and tamponade effect. CT scanning requires hemodynamic stability that this patient does not have. Simply continuing transfusion without source control perpetuates the hemorrhage cycle.",
    learningObjective: "Identify the stepwise approach to refractory pelvic hemorrhage including angiographic embolization and pelvic packing",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "If pelvic binder + transfusion fails to stabilize, the patient needs procedural hemorrhage control (embolization or packing) — continuing transfusion alone does not address the source",
    clinicalPearls: [
      "Pelvic hemorrhage sources: 80% venous (packing), 20% arterial (embolization)",
      "Open book pelvic fractures can lose 3000-5000+ mL into the retroperitoneum",
      "Stepwise approach: pelvic binder -> transfusion -> embolization/packing -> surgical exploration"
    ],
    safetyNote: "NEVER remove a pelvic binder in a hypotensive patient — removal should only occur in the OR with surgical team ready for definitive fixation",
    distractorRationales: [
      "Removing the pelvic binder would release tamponade and worsen hemorrhage catastrophically",
      "Continuing transfusion alone without source control perpetuates the hemorrhage cycle",
      "CT scanning requires hemodynamic stability — this patient cannot safely go to the scanner"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 34-year-old female presents to the ED with a traumatic diaphragmatic rupture identified on CT after a lateral compression MVC. The stomach and omentum have herniated into the left thoracic cavity. She is moderately dyspneic with SpO2 of 91%. What is the surgical urgency?",
    options: [
      "This can be managed conservatively with observation and follow-up imaging",
      "Emergent surgical repair is required to prevent bowel incarceration, strangulation, and progressive respiratory compromise",
      "Surgery can be deferred for 2-4 weeks until the patient is fully recovered from other injuries",
      "A chest tube should be placed to decompress the herniated contents"
    ],
    correctAnswer: 1,
    rationaleLong: "Traumatic diaphragmatic rupture with herniation of abdominal contents into the thorax is a surgical emergency that requires operative repair. The left hemidiaphragm is affected in approximately 75% of traumatic diaphragmatic ruptures because the liver buttresses and protects the right hemidiaphragm. When abdominal organs herniate through the diaphragmatic defect, several life-threatening complications can occur: bowel incarceration (the herniated bowel becomes trapped in the thorax and cannot be reduced), bowel strangulation (the blood supply to the incarcerated bowel is compressed at the diaphragmatic defect, leading to ischemia, necrosis, and perforation), progressive respiratory compromise (the herniated contents compress the lung, causing atelectasis and V/Q mismatch — this patient's SpO2 of 91% demonstrates this), and mediastinal shift (large herniations can push the mediastinum to the contralateral side, compromising the opposite lung and causing hemodynamic instability). The risk of strangulation increases with time, making delayed repair inappropriate. Conservative management is never appropriate for acute traumatic diaphragmatic herniation with organ displacement. Surgical repair is performed via either a thoracotomy or laparotomy (or thoracoscopically/laparoscopically in stable patients), and involves reducing the herniated contents back into the abdomen, inspecting them for viability, and repairing the diaphragmatic defect. A chest tube would be inappropriate and dangerous — inserting a chest tube into a hemithorax containing stomach and bowel could perforate these organs.",
    learningObjective: "Recognize traumatic diaphragmatic rupture with organ herniation as a surgical emergency requiring operative repair",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER place a chest tube when abdominal contents are herniated into the thorax — you may perforate stomach or bowel",
    clinicalPearls: [
      "Left diaphragmatic rupture is 3 times more common than right (liver protects the right hemidiaphragm)",
      "Bowel incarceration and strangulation risk increases with time — repair should not be delayed",
      "SpO2 depression results from lung compression by herniated abdominal contents"
    ],
    safetyNote: "Verify the contents of the hemithorax before inserting a chest tube — bowel sounds auscultated in the chest or abnormal chest X-ray patterns should raise concern for diaphragmatic herniation",
    distractorRationales: [
      "Conservative management is never appropriate for acute traumatic diaphragmatic herniation with organ displacement",
      "Deferring surgery for weeks risks bowel strangulation, necrosis, and perforation",
      "A chest tube in a hemithorax containing herniated bowel or stomach can perforate these organs"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 45-year-old male presents to the ED with a traumatic below-knee amputation. A tourniquet has been in place for 90 minutes. The stump has been dressed. The patient asks the nurse why the tourniquet cannot be removed now that the bleeding has stopped. What is the correct explanation?",
    options: [
      "The tourniquet can be safely removed since the bleeding has stopped and a pressure dressing is in place",
      "The tourniquet must remain in place because removal could cause rebleeding from exposed vessels and reperfusion injury including hyperkalemia from ischemic tissue metabolites",
      "Tourniquets should never be used for more than 60 minutes due to permanent nerve damage",
      "The tourniquet can be loosened partially to allow some blood flow while maintaining hemorrhage control"
    ],
    correctAnswer: 1,
    rationaleLong: "Once a tourniquet has been applied for life-threatening hemorrhage, it should NOT be removed in the emergency department. The tourniquet must remain in place until the patient reaches the operating room where surgical hemorrhage control can be achieved under controlled conditions. There are two primary reasons for this: First, removal of the tourniquet releases the mechanical compression of the vessels, which can cause massive rebleeding from the exposed vascular stumps of the amputated extremity. The pressure dressing may be insufficient to control arterial bleeding from the tibial arteries and peroneal artery exposed at the amputation site. Second, and equally importantly, tourniquet removal after prolonged application (generally more than 60-90 minutes) carries the risk of reperfusion injury. During the ischemic period, the tissues distal to the tourniquet accumulate toxic metabolites including potassium (from intracellular release during cellular ischemia), myoglobin (from muscle cell breakdown), lactic acid (from anaerobic metabolism), and other inflammatory mediators. Upon tourniquet release, these metabolites flood the systemic circulation, potentially causing hyperkalemia (with cardiac dysrhythmias), metabolic acidosis, myoglobinuria (with acute renal failure), and systemic inflammatory response. Regarding tourniquet time limits: while minimizing tourniquet time is important, tourniquets can be safely applied for 2-6 hours in most studies without causing irreversible limb injury. The 60-minute concern is outdated — modern military and civilian data show that tourniquet application for up to 2 hours is generally safe. The decision to remove a tourniquet should only be made by a surgeon in the operating room.",
    learningObjective: "Understand the rationale for maintaining tourniquets in place until operative hemorrhage control is available",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never remove a tourniquet in the ED — removal risks both massive rebleeding AND reperfusion injury with hyperkalemia",
    clinicalPearls: [
      "Tourniquets should only be removed in the OR with surgical hemorrhage control available",
      "Reperfusion injury after tourniquet removal: hyperkalemia, acidosis, myoglobinuria, SIRS",
      "Modern data shows tourniquet application up to 2 hours is generally safe for the limb"
    ],
    safetyNote: "Document tourniquet application time clearly and communicate to the surgical team — ischemia time guides the approach to tourniquet removal in the OR",
    distractorRationales: [
      "Removing the tourniquet risks massive rebleeding and reperfusion injury — pressure dressing alone may be insufficient",
      "The 60-minute limit is outdated — modern evidence supports safe application up to 2 hours",
      "Partial loosening can cause paradoxical increased bleeding by restoring arterial flow without adequate venous drainage"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 56-year-old male presents to the ED with blunt abdominal trauma. A CT scan reveals a Grade III splenic laceration with a moderate amount of hemoperitoneum. He is hemodynamically stable with HR 88 bpm and BP 126/78 mmHg. What is the current evidence-based management approach?",
    options: [
      "Immediate splenectomy for any Grade III or higher splenic injury",
      "Non-operative management with serial examinations, hemoglobin monitoring, and ICU admission if hemodynamically stable",
      "Discharge with outpatient follow-up in 1 week",
      "Angiographic embolization is required for all Grade III splenic injuries"
    ],
    correctAnswer: 1,
    rationaleLong: "Non-operative management (NOM) has become the standard of care for blunt splenic injuries in hemodynamically stable patients, regardless of the grade of injury. This represents a significant paradigm shift from historical practice where splenectomy was the default treatment. Current evidence shows that approximately 80-90% of blunt splenic injuries in hemodynamically stable adults can be successfully managed non-operatively, including Grade III injuries. The American Association for the Surgery of Trauma (AAST) classifies splenic injuries from Grade I (subcapsular hematoma less than 10% surface area) to Grade V (completely shattered spleen or hilar vascular injury). Non-operative management involves: ICU admission for close monitoring, bed rest, serial abdominal examinations every 4-6 hours, serial hemoglobin/hematocrit measurements every 6 hours initially, IV access with type and crossmatch maintained, nothing by mouth initially, and immediate surgical backup available. The criteria for converting to operative management include: hemodynamic instability despite resuscitation, falling hemoglobin despite transfusion, peritoneal signs suggesting hollow viscus injury, or transfusion requirement exceeding 2-4 units. Angiographic embolization may be considered as an adjunct to NOM for higher-grade injuries (Grade IV-V) or when active extravasation (contrast blush) is seen on CT, but it is not required for all Grade III injuries. Preserving the spleen is important because splenectomy carries lifelong risk of overwhelming post-splenectomy infection (OPSI), particularly from encapsulated organisms (Streptococcus pneumoniae, Haemophilus influenzae, Neisseria meningitidis).",
    learningObjective: "Apply evidence-based non-operative management for blunt splenic injuries in hemodynamically stable patients",
    blueprintCategory: "Trauma",
    subtopic: "abdominal trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Hemodynamic stability — not injury grade — is the primary determinant of operative versus non-operative management for splenic injuries",
    clinicalPearls: [
      "80-90% of blunt splenic injuries can be managed non-operatively in stable patients",
      "NOM includes ICU monitoring, serial exams, serial hemoglobin, bed rest, and surgical backup",
      "Splenectomy carries lifelong OPSI risk — splenic preservation is preferred when safe"
    ],
    safetyNote: "Non-operative management requires ICU-level monitoring and immediate surgical availability — failure criteria include hemodynamic instability and transfusion requirements",
    distractorRationales: [
      "Immediate splenectomy for Grade III is outdated — NOM is standard for hemodynamically stable patients",
      "Discharge is inappropriate — NOM requires inpatient ICU monitoring with serial examinations",
      "Angiographic embolization is adjunctive for higher grades or active extravasation, not required for all Grade III"
    ],
    lessonPath: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A nurse is preparing discharge instructions for a trauma patient who will be going home with a newly applied fiberglass cast on the right lower leg for a tibial shaft fracture. Which discharge instruction is MOST critical?",
    options: [
      "Keep the cast dry by wrapping it in plastic during showers",
      "Return immediately if you experience increasing pain, numbness, tingling, color changes, or inability to move your toes — these are signs of compartment syndrome",
      "Take ibuprofen as needed for mild pain",
      "Return for cast removal in 6-8 weeks"
    ],
    correctAnswer: 1,
    rationaleLong: "The most critical discharge instruction for a patient with a newly applied cast for a tibial shaft fracture is education about the signs and symptoms of compartment syndrome. The anterior compartment of the lower leg is the most common site for compartment syndrome, and tibial shaft fractures are the most common cause. Compartment syndrome can develop within the first 24-48 hours after injury and cast application, as ongoing swelling within the rigid cast creates increasing pressure on the tissues. The signs the patient must monitor include: increasing pain that is disproportionate to the injury and not relieved by prescribed pain medications (this is the earliest and most important sign), numbness or tingling in the toes or foot (indicating nerve compression), inability to actively move the toes (indicating muscle ischemia and nerve compromise), color changes in the toes (pallor or cyanosis), and coolness of the toes. The patient must understand that these symptoms require IMMEDIATE return to the ED because compartment syndrome causes irreversible muscle and nerve damage within 6 hours of onset. If compartment syndrome is suspected, the cast must be bivalved (cut in half lengthwise) and the padding cut to release any constrictive pressure. If symptoms persist, compartment pressure measurement and potentially emergent fasciotomy are required. While keeping the cast dry and scheduling follow-up are important instructions, they are not life- or limb-threatening. Pain management should be primarily with acetaminophen rather than NSAIDs initially, as NSAIDs may mask the pain of compartment syndrome.",
    learningObjective: "Provide critical discharge education about compartment syndrome recognition for patients with newly applied casts",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Some providers advise against NSAIDs with new fracture casts because they can mask the pain of developing compartment syndrome — pain is the earliest warning sign",
    clinicalPearls: [
      "Tibial shaft fractures are the most common cause of compartment syndrome",
      "Irreversible muscle damage begins within 6 hours of compartment syndrome onset",
      "A cast that is too tight can contribute to compartment syndrome — bivalve if symptoms develop"
    ],
    safetyNote: "Instruct patients to return IMMEDIATELY for increasing pain, numbness, or inability to move toes — these are emergency warning signs of compartment syndrome",
    distractorRationales: [
      "Keeping the cast dry is important but not the most critical life/limb-threatening instruction",
      "NSAIDs may mask compartment syndrome pain — acetaminophen may be preferred initially",
      "Follow-up timing is routine and not the most critical discharge instruction"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 38-year-old male presents to the ED with a nail gun injury. A nail has penetrated the right temporal region of the skull. He is conscious with GCS 14 (confused) and has no focal motor deficits. What is the priority management?",
    options: [
      "Remove the nail in the ED under local anesthesia and apply a pressure dressing",
      "Leave the nail in place, stabilize it, obtain CT imaging, and prepare for neurosurgical operative removal",
      "Push the nail through to the other side for easier removal",
      "Apply MRI to better visualize the brain injury before planning removal"
    ],
    correctAnswer: 1,
    rationaleLong: "Penetrating cranial injuries from foreign bodies follow the same principle as impaled objects elsewhere in the body — the object must NOT be removed in the emergency department. The nail penetrating the temporal region may be tamponading injured dural or cortical blood vessels, compressing a branch of the middle meningeal artery, or resting against critical brain structures. Removal could cause uncontrolled intracranial hemorrhage (epidural, subdural, or intracerebral), air embolism if a dural sinus is involved, or further brain parenchymal injury. The correct management includes: stabilize the protruding nail with bulky dressings to prevent any movement, obtain CT scan of the head (which will show the trajectory, depth of penetration, and proximity to vascular structures and eloquent brain areas), administer IV antibiotics (penetrating skull injuries carry high infection risk — typically a broad-spectrum regimen including coverage for CNS pathogens), update tetanus prophylaxis, maintain seizure prophylaxis (penetrating brain injuries have a high seizure risk), and prepare for operative removal in the neurosurgical operating room where the surgeon has imaging guidance, direct visualization, and the ability to control hemorrhage immediately. The temporal region is particularly dangerous because the middle meningeal artery runs along the inner surface of the temporal bone — disruption can cause a rapidly expanding epidural hematoma. MRI is ABSOLUTELY CONTRAINDICATED because the metallic nail would be attracted by the magnetic field, potentially causing it to move within the brain with catastrophic results.",
    learningObjective: "Apply impaled object management principles to penetrating cranial foreign bodies and recognize contraindications to MRI",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "MRI is ABSOLUTELY CONTRAINDICATED with metallic foreign bodies in or near the body — the magnetic field can move the object and cause fatal injury",
    clinicalPearls: [
      "Never remove penetrating cranial foreign bodies in the ED — operative removal with neurosurgical control is required",
      "Temporal region penetration risks middle meningeal artery injury and epidural hematoma",
      "MRI is contraindicated with metallic foreign bodies — CT is the appropriate imaging modality"
    ],
    safetyNote: "Always screen for metallic foreign bodies before MRI — failure to do so can cause patient death from foreign body migration in the magnetic field",
    distractorRationales: [
      "Removing the nail in the ED can cause uncontrolled intracranial hemorrhage",
      "Pushing the nail through would cause massive additional brain injury",
      "MRI with metallic foreign body is absolutely contraindicated and potentially lethal"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 26-year-old male presents to the ED after a motorcycle crash with an obviously deformed and angulated right mid-shaft humerus fracture. On initial assessment, he has intact radial pulse, good capillary refill, and can extend his wrist and fingers. While preparing for X-ray, the nurse notices he can no longer extend his wrist (wrist drop). What has likely occurred?",
    options: [
      "The patient is malingering to receive stronger pain medication",
      "The radial nerve has been injured by the displaced fracture fragment, causing wrist drop from loss of wrist and finger extension",
      "Compartment syndrome has developed in the forearm requiring emergent fasciotomy",
      "The ulnar nerve has been compressed causing loss of grip strength"
    ],
    correctAnswer: 1,
    rationaleLong: "The radial nerve is the most commonly injured nerve in humeral shaft fractures because it wraps around the posterior aspect of the humerus in the radial (spiral) groove, making it vulnerable to injury from displaced fracture fragments. The radial nerve provides motor innervation to the wrist extensors (extensor carpi radialis, extensor digitorum, extensor carpi ulnaris) and finger extensors, as well as sensory innervation to the dorsal hand (first dorsal web space). Wrist drop — the inability to extend the wrist against gravity — is the hallmark clinical sign of radial nerve injury. In this case, the initial examination showed intact wrist extension, but subsequent loss indicates that the radial nerve was likely injured by further displacement of the fracture fragment. This can occur during patient movement, positioning, or manipulation. This represents a secondary radial nerve injury (not present initially but developing subsequently), which is more concerning than a primary injury (present at the time of initial assessment) because it suggests ongoing nerve compression or laceration by the fracture. The nurse must immediately notify the physician, document the change in neurological status with the time of onset, and ensure the extremity is immobilized in the current position to prevent further displacement. This finding may change the management from non-operative to operative — secondary radial nerve palsies are more likely to require surgical exploration than primary palsies. Compartment syndrome would present with pain disproportionate to the injury and would not selectively affect wrist extension. The ulnar nerve does not cause wrist drop.",
    learningObjective: "Recognize radial nerve injury (wrist drop) as a complication of humeral shaft fractures and differentiate from other neurological injuries",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "New neurological deficit after initial intact exam indicates secondary nerve injury — this may require surgical exploration and must be documented with time of onset",
    clinicalPearls: [
      "Radial nerve injury is the most common nerve injury in humeral shaft fractures",
      "Radial nerve in the spiral groove: vulnerable to mid-shaft humeral fracture displacement",
      "Wrist drop = radial nerve; claw hand = ulnar nerve; ape hand = median nerve"
    ],
    safetyNote: "Serial neurovascular assessments are essential in extremity fractures — any change from baseline must be immediately reported and documented",
    distractorRationales: [
      "Accusing a patient of malingering without clinical evidence is inappropriate and delays proper diagnosis",
      "Compartment syndrome presents with pain disproportionate to injury, not isolated motor deficit",
      "Ulnar nerve injury causes claw hand deformity and loss of intrinsic hand muscle function, not wrist drop"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 62-year-old male presents to the ED with a 15 cm laceration to the right thigh from a chainsaw injury while cutting wood. The wound is contaminated with bark, soil, and debris. His last tetanus immunization was 3 years ago. What tetanus prophylaxis is indicated?",
    options: [
      "No tetanus prophylaxis needed — his last immunization was within 5 years",
      "Tdap vaccine booster only — the wound is tetanus-prone but he has been immunized within 5 years",
      "Both Tdap vaccine AND tetanus immune globulin (TIG) — this is a heavily contaminated tetanus-prone wound",
      "Tetanus immune globulin (TIG) only — the vaccine is not needed since he was immunized 3 years ago"
    ],
    correctAnswer: 1,
    rationaleLong: "This wound is clearly tetanus-prone: it is contaminated with soil and organic debris (bark), which are known to harbor Clostridium tetani spores. The wound is also deep, devitalized, and over 6 hours old (time from injury to ED presentation is not specified but chainsaw injuries produce devitalized tissue regardless). For tetanus-prone wounds in a patient who has completed their primary tetanus immunization series, the decision tree is: if the last booster was less than 5 years ago, no prophylaxis is needed. If 5-10 years, give Tdap or Td vaccine. If more than 10 years or unknown, give Tdap or Td PLUS tetanus immune globulin (TIG). This patient's last immunization was 3 years ago, which is within the 5-year window for tetanus-prone wounds. Therefore, even though the wound is heavily contaminated and tetanus-prone, the recent immunization provides adequate protection and only a vaccine booster is needed. TIG provides passive immunity with preformed tetanus antibodies and is only required when the patient's active immunity is insufficient (more than 10 years since booster or fewer than 3 primary immunizations). The emergency nurse should clean the wound thoroughly with copious irrigation, perform debridement of devitalized tissue, and ensure proper wound care in addition to tetanus prophylaxis. This is a critical distinction: for clean wounds, the threshold is 10 years; for tetanus-prone wounds, the threshold is 5 years.",
    learningObjective: "Apply tetanus prophylaxis guidelines for tetanus-prone wounds based on immunization history timing",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The 3-year timeframe is within the 5-year window for tetanus-prone wounds — even heavily contaminated wounds only need a booster if immunized within 5 years",
    clinicalPearls: [
      "Tetanus-prone wounds: contaminated, devitalized, deep, soil/feces exposure",
      "Tetanus-prone wound thresholds: less than 5 years = no prophylaxis; 5-10 years = vaccine; more than 10 years = vaccine + TIG",
      "Clean wound thresholds: less than 10 years = no prophylaxis; more than 10 years = vaccine only"
    ],
    safetyNote: "Always verify the SPECIFIC timing and type of last tetanus immunization — patient self-report may be inaccurate",
    distractorRationales: [
      "The statement is technically correct but provides unnecessary vaccination — a booster at 3 years is not standard",
      "TIG is only needed when last immunization was more than 10 years ago for tetanus-prone wounds with adequate primary series",
      "TIG alone without vaccine does not provide long-lasting protection"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 48-year-old male presents to the ED with chest trauma. An upright chest X-ray shows widening of the mediastinum greater than 8 cm, loss of the aortic knob contour, and a left pleural cap. These findings are most suggestive of:",
    options: [
      "Massive hemothorax requiring chest tube insertion",
      "Traumatic aortic injury at the isthmus requiring CT angiography confirmation",
      "Tension pneumothorax requiring immediate needle decompression",
      "Pericardial effusion from cardiac tamponade"
    ],
    correctAnswer: 1,
    rationaleLong: "The chest X-ray findings described — widened mediastinum (greater than 8 cm on an upright PA film), loss of the aortic knob contour, and a left pleural cap (apical pleural blood tracking over the lung apex from mediastinal hemorrhage) — are classic radiographic signs suggestive of traumatic aortic injury (TAI). Other chest X-ray signs include: depression of the left mainstem bronchus, deviation of the trachea to the right, deviation of the esophagus (nasogastric tube) to the right, and an irregular aortic contour. TAI most commonly occurs at the aortic isthmus (the junction between the mobile aortic arch and the fixed descending aorta, just distal to the left subclavian artery origin) due to deceleration forces. However, it is critical to understand that chest X-ray findings are suggestive but NOT diagnostic — the sensitivity is approximately 80-90% but specificity is low (many false positives). Therefore, any patient with these findings requires confirmation with CT angiography (CTA) of the chest, which has nearly 100% sensitivity and specificity for aortic injury. If TAI is confirmed, immediate management includes anti-impulse therapy (IV beta-blocker to maintain HR less than 80 and SBP 100-120 mmHg) and preparation for definitive repair (endovascular stent-graft or open surgical repair). A massive hemothorax would show opacification of the hemithorax, not mediastinal widening. Tension pneumothorax shows hyperlucency with mediastinal shift. Pericardial effusion shows an enlarged cardiac silhouette.",
    learningObjective: "Recognize chest X-ray findings suggestive of traumatic aortic injury and understand the need for CT angiography confirmation",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Widened mediastinum on CXR is suggestive but NOT diagnostic of aortic injury — CT angiography is required for confirmation before treatment decisions",
    clinicalPearls: [
      "CXR signs of aortic injury: widened mediastinum, lost aortic knob, left pleural cap, depressed L mainstem bronchus",
      "Aortic isthmus is the most common site (90%) — deceleration mechanism",
      "CTA has nearly 100% sensitivity and specificity — the definitive diagnostic study"
    ],
    safetyNote: "Initiate anti-impulse therapy immediately when aortic injury is suspected — do not wait for CTA confirmation to begin blood pressure and heart rate control",
    distractorRationales: [
      "Massive hemothorax shows hemithorax opacification, not mediastinal widening",
      "Tension pneumothorax shows hyperlucency and mediastinal shift, not widening",
      "Pericardial effusion shows enlarged cardiac silhouette, not mediastinal widening or pleural cap"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  }
];
