import type { LessonContent } from "./types";

export const rnMskExpansionLessons: Record<string, LessonContent> = {
  "hip-fracture-management-rn": {
    title: "Hip Fracture: Perioperative Nursing Management",
    cellular: {
      title: "Pathophysiology of Hip Fractures",
      content: "Hip fractures occur most commonly in the femoral neck or intertrochanteric region. The femoral neck is particularly vulnerable because it is composed largely of cancellous bone with limited periosteal blood supply from the medial and lateral circumflex arteries. Fracture disrupts the retinacular blood vessels that supply the femoral head, creating a high risk of avascular necrosis (AVN), especially with displaced intracapsular fractures. The fracture hematoma triggers an inflammatory cascade with release of cytokines (IL-1, IL-6, TNF-alpha) and prostaglandins that initiate bone healing through callus formation. In elderly patients, osteoporosis causes decreased bone mineral density through osteoclast-mediated resorption exceeding osteoblast bone formation, making fractures possible with minimal trauma (fragility fractures). Fat embolism syndrome can occur 24-72 hours post-fracture when marrow fat enters the bloodstream through disrupted intramedullary sinusoids, lodging in pulmonary and cerebral microvasculature."
    },
    riskFactors: [
      "Osteoporosis with T-score ≤ -2.5 on DEXA scan",
      "Age over 65 years with decreased bone density and muscle mass",
      "History of falls or balance impairment",
      "Female sex (postmenopausal estrogen decline accelerates bone loss)",
      "Corticosteroid therapy causing secondary osteoporosis",
      "Vitamin D deficiency and calcium malabsorption",
      "Polypharmacy increasing fall risk (sedatives, antihypertensives)",
      "Cognitive impairment or dementia"
    ],
    diagnostics: [
      "AP and lateral hip X-ray revealing fracture line, displacement, and classification",
      "MRI if X-ray negative but clinical suspicion high (occult fracture)",
      "CBC, BMP, coagulation studies, type and screen for pre-operative clearance",
      "ECG and chest X-ray for cardiac and pulmonary baseline",
      "Assess neurovascular status of affected extremity: pulses, sensation, movement",
      "DEXA scan for bone mineral density assessment post-operatively"
    ],
    management: [
      "Surgical fixation within 24-48 hours reduces mortality and complications",
      "Intracapsular displaced fractures: hemiarthroplasty or total hip arthroplasty",
      "Extracapsular fractures: open reduction internal fixation (ORIF) with sliding hip screw",
      "DVT prophylaxis: LMWH (enoxaparin) initiated per protocol",
      "Early mobilization within 24 hours post-operatively reduces complications",
      "Multimodal pain management: nerve blocks, acetaminophen, NSAIDs, limited opioids"
    ],
    nursingActions: [
      "Maintain affected extremity in abduction using abduction pillow or wedge",
      "Assess neurovascular status every 1-2 hours: pulses, sensation, color, capillary refill",
      "Monitor for fat embolism syndrome: petechiae, altered mental status, respiratory distress 24-72 hours post-injury",
      "Implement fall prevention measures: bed alarm, call light within reach, non-skid footwear",
      "Assess surgical site for signs of infection: redness, warmth, drainage, dehiscence",
      "Administer prescribed anticoagulants and monitor for bleeding",
      "Coordinate with physical therapy for weight-bearing status and mobility progression",
      "Educate on hip precautions: no crossing legs, no bending past 90 degrees, no internal rotation"
    ],
    assessmentFindings: [
      "Shortened and externally rotated affected leg",
      "Severe pain in hip and groin, worse with movement",
      "Inability to bear weight on affected extremity",
      "Ecchymosis over greater trochanter",
      "Positive log roll test with pain on internal rotation"
    ],
    signs: {
      left: [
        "Shortened and externally rotated leg",
        "Groin pain on weight-bearing attempt",
        "Ecchymosis and swelling at hip",
        "Limited range of motion"
      ],
      right: [
        "Fat embolism triad: petechiae, dyspnea, confusion",
        "DVT signs: calf pain, warmth, swelling",
        "Surgical site infection: fever, erythema, drainage",
        "Avascular necrosis: persistent hip pain weeks post-op"
      ]
    },
    medications: [
      { name: "Enoxaparin (Lovenox)", type: "Low Molecular Weight Heparin", action: "Inhibits factor Xa to prevent DVT and PE post-operatively", sideEffects: "Bleeding, injection site hematoma, thrombocytopenia", contra: "Active bleeding, HIT history, severe renal impairment (CrCl <30)", pearl: "Administer subcutaneously in abdomen. Do not expel air bubble. Monitor anti-Xa levels in renal impairment." },
      { name: "Alendronate (Fosamax)", type: "Bisphosphonate", action: "Inhibits osteoclast-mediated bone resorption to increase bone density", sideEffects: "Esophageal irritation, osteonecrosis of jaw, atypical femur fractures", contra: "Esophageal stricture, inability to sit upright 30 minutes, hypocalcemia", pearl: "Take on empty stomach with full glass of water. Remain upright 30 minutes. Do not lie down after taking." }
    ],
    pearls: [
      "Shortened and externally rotated leg is the classic presentation—assess both legs for comparison",
      "Fat embolism syndrome has a classic triad: petechiae (chest, axillae, conjunctivae), respiratory distress, and altered mental status at 24-72 hours",
      "Hip fractures in elderly patients carry 20-30% mortality at one year—aggressive rehabilitation and fall prevention are essential",
      "Never massage the calf post-operatively—this can dislodge a DVT",
      "Posterior hip precautions (avoid flexion >90°, adduction, internal rotation) are critical after posterior approach surgery"
    ],
    quiz: [
      { question: "A patient presents with a shortened, externally rotated left leg after a fall. What is the priority nursing assessment?", options: ["Obtain a pain rating on 0-10 scale", "Assess neurovascular status of the affected extremity", "Apply ice to the hip area", "Encourage the patient to attempt ambulation"], correct: 1, rationale: "Neurovascular assessment (pulses, sensation, motor function, color, capillary refill) is the priority to detect vascular compromise or nerve injury that requires immediate intervention." },
      { question: "48 hours after hip fracture repair, the patient develops petechiae on the chest, confusion, and dyspnea. What does the nurse suspect?", options: ["Pulmonary embolism", "Fat embolism syndrome", "Allergic reaction to medication", "Postoperative pneumonia"], correct: 1, rationale: "The triad of petechiae, altered mental status, and respiratory distress occurring 24-72 hours post-fracture is classic for fat embolism syndrome, caused by marrow fat entering the bloodstream." },
      { question: "Which position should the nurse maintain for a patient post-hip arthroplasty with posterior approach?", options: ["Leg adducted and internally rotated", "Hip flexed greater than 90 degrees for comfort", "Affected leg in abduction with abduction pillow", "Legs crossed with knee flexion"], correct: 2, rationale: "An abduction pillow maintains the hip in abduction and prevents internal rotation and adduction, which could cause prosthetic dislocation after posterior approach hip surgery." }
    ]
  },

  "fracture-types-immobilization-rn": {
    title: "Fracture Types & Immobilization: RN Assessment",
    cellular: {
      title: "Bone Fracture Pathophysiology and Healing",
      content: "Bone fractures disrupt the cortical and cancellous architecture, triggering a complex healing cascade. The initial inflammatory phase (days 1-7) involves hematoma formation at the fracture site as disrupted periosteal and endosteal blood vessels hemorrhage. Platelet aggregation and fibrin clot formation create a scaffold while macrophages and neutrophils remove debris. The reparative phase involves mesenchymal stem cell differentiation into chondroblasts forming soft callus (fibrocartilage) at 2-3 weeks, followed by osteoblastic ossification creating hard callus (woven bone) at 3-12 weeks. The remodeling phase, lasting months to years, involves osteoclastic resorption of excessive callus and osteoblastic deposition of lamellar bone along stress lines per Wolff's law. Open fractures carry high infection risk because the fracture communicates with the external environment, allowing bacterial contamination of exposed bone and soft tissue. Pathologic fractures occur through weakened bone from metastatic disease, osteoporosis, or other bone-destroying processes."
    },
    riskFactors: [
      "High-impact trauma: motor vehicle accidents, falls from height",
      "Low-impact trauma with osteoporosis (fragility fractures)",
      "Repetitive stress on bone (stress fractures in athletes, military recruits)",
      "Pathologic bone weakness: metastatic cancer, Paget disease, osteogenesis imperfecta",
      "Nutritional deficiencies: vitamin D, calcium, protein malnutrition",
      "Chronic corticosteroid use reducing bone formation",
      "Age-related bone density loss"
    ],
    diagnostics: [
      "X-ray in two planes (AP and lateral) to identify fracture pattern and displacement",
      "CT scan for complex intra-articular fractures, spine, and pelvic fractures",
      "MRI for suspected occult fractures, stress fractures, and soft tissue injury assessment",
      "Neurovascular assessment: distal pulses, sensation, motor function, capillary refill",
      "Compartment pressure measurement if compartment syndrome suspected (>30 mmHg or within 30 of diastolic)",
      "CBC for blood loss assessment in major fractures (femur, pelvis)"
    ],
    management: [
      "Closed reduction with immobilization (cast, splint) for stable, non-displaced fractures",
      "Open reduction internal fixation (ORIF) for displaced, unstable, or intra-articular fractures",
      "External fixation for severe open fractures, pelvic fractures, and polytrauma",
      "Open fractures: emergent irrigation and debridement, IV antibiotics within 1 hour",
      "Traction: skin traction (Buck's) for temporary stabilization, skeletal traction for definitive management",
      "Multimodal pain management and early mobilization when appropriate"
    ],
    nursingActions: [
      "Perform 5 P's assessment every 1-2 hours: Pain, Pallor, Pulselessness, Paresthesia, Paralysis",
      "Elevate affected extremity above heart level to reduce edema",
      "Apply ice to fracture site for first 48-72 hours (20 minutes on, 20 minutes off)",
      "Assess cast integrity: edges for roughness, window for skin assessment, dampness indicating drainage",
      "Monitor for compartment syndrome: pain out of proportion, pain with passive stretch of digits",
      "Petal cast edges with moleskin to prevent skin breakdown",
      "Assess pin sites for external fixation: cleanse per protocol, monitor for infection signs",
      "Educate patient on weight-bearing restrictions and proper crutch or walker use"
    ],
    assessmentFindings: [
      "Deformity, angulation, or shortening of affected extremity",
      "Swelling, ecchymosis, and point tenderness at fracture site",
      "Crepitus (grating sensation) with movement",
      "Loss of function and guarding of affected area",
      "Open fracture: bone visible through wound"
    ],
    signs: {
      left: [
        "Deformity and swelling at fracture site",
        "Point tenderness on palpation",
        "Ecchymosis and crepitus",
        "Loss of normal range of motion"
      ],
      right: [
        "Compartment syndrome: pain with passive stretch, tense compartment",
        "Neurovascular compromise: absent pulse, pallor, paresthesia",
        "Fat embolism: petechiae, confusion, tachypnea",
        "Infection (open fracture): erythema, purulent drainage, fever"
      ]
    },
    medications: [
      { name: "Ketorolac (Toradol)", type: "NSAID Analgesic", action: "Inhibits COX-1 and COX-2 enzymes reducing prostaglandin synthesis for potent anti-inflammatory and analgesic effects", sideEffects: "GI bleeding, renal impairment, platelet dysfunction, injection site pain", contra: "Active GI bleeding, renal impairment, perioperative CABG use, coagulopathy", pearl: "Limit use to 5 days maximum. Excellent for acute fracture pain as part of multimodal analgesia. Monitor renal function." },
      { name: "Cefazolin", type: "First-generation Cephalosporin", action: "Bactericidal against gram-positive organisms. First-line prophylaxis for open fractures and orthopedic surgery", sideEffects: "Allergic reaction, diarrhea, injection site phlebitis", contra: "Severe penicillin allergy (anaphylaxis)", pearl: "For open fractures: administer within 1 hour of injury. Grade I: cefazolin alone. Grade III: add gentamicin for gram-negative coverage." }
    ],
    pearls: [
      "Compartment syndrome is a surgical emergency—fasciotomy must be performed within 6 hours to prevent irreversible ischemic damage",
      "The 5 P's of compartment syndrome: Pain (out of proportion, with passive stretch), Pallor, Pulselessness, Paresthesia, Paralysis—pulselessness is a LATE sign",
      "Never cut a window in a wet plaster cast; wait until fully dry (24-72 hours)",
      "Open fractures are classified Grade I-III (Gustilo): Grade III has highest infection risk and requires urgent surgical debridement",
      "Femur fractures can cause 1-2 liters of blood loss into the thigh—monitor for hypovolemic shock"
    ],
    quiz: [
      { question: "A patient in a long leg cast reports severe calf pain that worsens when the nurse dorsiflexes the foot. What should the nurse do first?", options: ["Elevate the leg higher and apply ice", "Administer prescribed PRN opioid analgesic", "Notify the provider immediately—suspect compartment syndrome", "Reassure the patient that pain is expected"], correct: 2, rationale: "Pain with passive stretch (dorsiflexion causing calf pain) is a hallmark sign of compartment syndrome, which is a surgical emergency requiring immediate notification and likely fasciotomy." },
      { question: "Which nursing action is priority for a patient with a Grade III open fracture?", options: ["Apply a sterile pressure dressing and elevate", "Administer IV antibiotics within 1 hour per protocol", "Obtain a detailed patient history", "Apply traction to reduce the fracture"], correct: 1, rationale: "Open fractures require IV antibiotics within 1 hour to prevent osteomyelitis. This is a critical time-sensitive intervention while surgical debridement is being arranged." },
      { question: "A patient with a new fiberglass cast on the forearm reports numbness and tingling in the fingers. What is the priority assessment?", options: ["Assess capillary refill, sensation, and movement of fingers", "Check if the cast is too tight by inserting a finger under the edge", "Elevate the arm on two pillows", "Document findings and reassess in one hour"], correct: 0, rationale: "Numbness and tingling indicate potential neurovascular compromise. The nurse must immediately perform a complete neurovascular assessment (circulation, sensation, movement) and compare to the unaffected extremity." }
    ]
  },

  "spinal-cord-injury-rn": {
    title: "Spinal Cord Injury: RN Assessment & Acute Management",
    cellular: {
      title: "Spinal Cord Injury Pathophysiology",
      content: "Spinal cord injury (SCI) involves primary and secondary mechanisms of cellular damage. The primary injury results from mechanical forces (compression, distraction, laceration, transection) that disrupt neuronal axons, blood vessels, and cell membranes at the injury level. Secondary injury cascades begin within minutes and extend over weeks: ischemia from vascular disruption and vasospasm reduces oxygen delivery to vulnerable gray matter; excitotoxicity from excessive glutamate release activates NMDA and AMPA receptors, causing intracellular calcium overload and mitochondrial dysfunction; free radical generation and lipid peroxidation damage cell membranes; inflammatory mediators (TNF-alpha, IL-1beta) recruit neutrophils and macrophages that release proteolytic enzymes. Neurogenic shock occurs with injuries above T6 due to loss of sympathetic tone from the intermediolateral cell column, causing unopposed parasympathetic activity resulting in bradycardia, hypotension, and peripheral vasodilation. Spinal shock refers to the temporary loss of all reflex activity below the injury level, lasting hours to weeks, with areflexia giving way to hyperreflexia as upper motor neuron signs emerge."
    },
    riskFactors: [
      "Motor vehicle accidents (most common cause, especially cervical injuries)",
      "Falls from height (leading cause in elderly)",
      "Diving into shallow water (cervical hyperextension)",
      "Sports injuries: football, gymnastics, equestrian",
      "Violence: gunshot wounds, stab injuries",
      "Pre-existing spinal stenosis increasing vulnerability to cord compression",
      "Osteoporosis in elderly patients"
    ],
    diagnostics: [
      "ASIA (American Spinal Injury Association) Impairment Scale assessment for injury classification",
      "CT spine for bony injury identification and spinal canal compromise",
      "MRI for cord compression, edema, hemorrhage, and disc herniation",
      "Neurological level assessment: motor testing (0-5 scale) and sensory testing (light touch, pinprick) at each dermatome",
      "Continuous cardiac monitoring for bradycardia and arrhythmias",
      "Monitor mean arterial pressure (MAP) goal ≥85 mmHg for first 5-7 days",
      "Assess for associated injuries: head trauma, thoracic injuries, abdominal injuries"
    ],
    management: [
      "Spinal immobilization with cervical collar and logroll precautions until cleared",
      "Maintain MAP ≥85 mmHg with fluid resuscitation and vasopressors for spinal cord perfusion",
      "Surgical decompression within 24 hours for progressive neurological deficit or cord compression",
      "DVT prophylaxis: LMWH and sequential compression devices (SCI patients have highest DVT risk)",
      "Respiratory management: intubation if injury above C4, aggressive pulmonary toilet for lower injuries",
      "Bladder management: intermittent catheterization preferred over indwelling catheter"
    ],
    nursingActions: [
      "Maintain strict spinal immobilization and logroll technique for all repositioning",
      "Monitor respiratory status closely: vital capacity, oxygen saturation, diaphragm function (C3-C5 innervation)",
      "Assess for neurogenic shock: bradycardia, hypotension, warm/dry skin below injury level",
      "Differentiate neurogenic shock (bradycardia + hypotension) from hypovolemic shock (tachycardia + hypotension)",
      "Implement skin breakdown prevention: reposition every 2 hours, pressure-relieving mattress",
      "Monitor for autonomic dysreflexia (injuries T6 and above): sudden hypertension, bradycardia, headache, flushing above injury level",
      "Perform strict intake and output with bladder scanning for retention",
      "Provide emotional support and establish realistic expectations while maintaining hope"
    ],
    assessmentFindings: [
      "Loss of motor and sensory function below injury level",
      "Hypotension and bradycardia with warm, dry skin (neurogenic shock)",
      "Loss of rectal tone and absent bulbocavernosus reflex (spinal shock)",
      "Diaphragmatic breathing if injury above C5",
      "Priapism in male patients indicating loss of sympathetic tone"
    ],
    signs: {
      left: [
        "Loss of motor function below injury level",
        "Loss of sensation to light touch and pinprick",
        "Hypotension with bradycardia (neurogenic shock)",
        "Flaccid areflexia below level (spinal shock)"
      ],
      right: [
        "Autonomic dysreflexia: BP >200 systolic, pounding headache",
        "Respiratory failure: vital capacity <1L, paradoxical breathing",
        "DVT/PE: limb swelling, sudden dyspnea, tachycardia",
        "Paralytic ileus: absent bowel sounds, abdominal distension"
      ]
    },
    medications: [
      { name: "Norepinephrine", type: "Alpha-1 Adrenergic Agonist/Vasopressor", action: "Increases vascular tone and blood pressure through alpha-1 receptor stimulation. First-line vasopressor for neurogenic shock to maintain MAP ≥85 mmHg", sideEffects: "Tissue necrosis with extravasation, arrhythmias, peripheral ischemia", contra: "Hypovolemia (correct volume first), mesenteric or peripheral vascular thrombosis", pearl: "Administer through central line when possible. If peripheral, use large-bore proximal IV and monitor hourly for extravasation. Phentolamine is the antidote for extravasation." },
      { name: "Atropine", type: "Anticholinergic/Parasympatholytic", action: "Blocks muscarinic receptors to increase heart rate. Used for symptomatic bradycardia in neurogenic shock", sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision", contra: "Narrow-angle glaucoma, obstructive uropathy", pearl: "Give 0.5-1mg IV for symptomatic bradycardia. May repeat every 3-5 minutes. Total dose should not exceed 3mg." }
    ],
    pearls: [
      "Neurogenic shock = bradycardia + hypotension + warm skin (loss of sympathetic tone). Hypovolemic shock = tachycardia + hypotension + cool skin. This distinction is critical for treatment",
      "Autonomic dysreflexia is a life-threatening emergency in T6 and above injuries: identify and remove the noxious stimulus (full bladder is #1 cause, then bowel impaction)",
      "The level of SCI determines respiratory function: C3-C5 innervates the diaphragm (C3-4-5 keeps the diaphragm alive)",
      "Spinal shock (areflexia) is NOT the same as neurogenic shock (cardiovascular instability)—they can coexist but are different phenomena",
      "Autonomic dysreflexia treatment: sit patient upright, remove tight clothing, check catheter patency, and if BP remains elevated administer rapid-acting antihypertensive"
    ],
    quiz: [
      { question: "A patient with a C5 spinal cord injury has BP 78/50 and HR 48. Skin below the injury is warm and dry. What type of shock does the nurse suspect?", options: ["Hypovolemic shock", "Cardiogenic shock", "Neurogenic shock", "Septic shock"], correct: 2, rationale: "Bradycardia + hypotension + warm/dry skin is the classic presentation of neurogenic shock due to loss of sympathetic tone. Hypovolemic shock presents with tachycardia and cool, clammy skin." },
      { question: "A patient with T4 paraplegia suddenly develops a severe headache, blood pressure 240/130, and heart rate 52. What is the priority nursing action?", options: ["Administer prescribed analgesic for headache", "Sit the patient upright and check the urinary catheter for kinking", "Place patient supine and elevate legs", "Administer prescribed beta-blocker"], correct: 1, rationale: "This is autonomic dysreflexia. Priority is to sit the patient upright (to use orthostatic effect to lower BP) and identify the noxious stimulus—most commonly a full or kinked bladder." },
      { question: "Which assessment finding indicates the need for immediate intubation in a patient with a cervical spinal cord injury?", options: ["Oxygen saturation of 94% on room air", "Vital capacity less than 1 liter", "Mild dyspnea with deep breathing", "Heart rate of 55 bpm"], correct: 1, rationale: "Vital capacity less than 1 liter indicates severe respiratory compromise that will likely progress to respiratory failure. Cervical injuries can paralyze the diaphragm (C3-5), requiring mechanical ventilation." }
    ]
  },

  "total-knee-replacement-rn": {
    title: "Total Knee Replacement: Perioperative Nursing Care",
    cellular: {
      title: "Pathophysiology of Knee Joint Degeneration and Arthroplasty",
      content: "Total knee arthroplasty (TKA) replaces the damaged articular surfaces of the knee joint with prosthetic components. Osteoarthritis, the primary indication, involves progressive degradation of hyaline cartilage from mechanical stress and enzymatic destruction. Chondrocytes release matrix metalloproteinases (MMPs) and aggrecanases that degrade the collagen-proteoglycan matrix. Loss of cartilage exposes subchondral bone, which undergoes sclerosis and osteophyte formation. The synovial membrane becomes inflamed, producing excess synovial fluid with inflammatory mediators (IL-1, TNF-alpha) that further accelerate cartilage destruction. In TKA, the femoral condyles are resurfaced with a cobalt-chromium component, the tibial plateau with a titanium baseplate and polyethylene insert, and often the patellar surface with a polyethylene button. Cemented fixation uses polymethyl methacrylate (PMMA) that generates an exothermic reaction during curing. Post-operatively, the inflammatory response and surgical tissue disruption create risk for deep vein thrombosis due to venous stasis, endothelial injury (Virchow triad), and hypercoagulability."
    },
    riskFactors: [
      "Severe osteoarthritis with bone-on-bone contact on weight-bearing X-ray",
      "Obesity (BMI >30) increasing mechanical stress on prosthetic joint",
      "Rheumatoid arthritis causing inflammatory joint destruction",
      "Post-traumatic arthritis from prior knee fracture or ligament injury",
      "Diabetes mellitus increasing surgical site infection risk",
      "History of DVT/PE increasing thromboembolic risk",
      "Smoking impairing wound healing and increasing infection risk"
    ],
    diagnostics: [
      "Pre-operative weight-bearing knee X-rays (AP, lateral, Merchant view)",
      "Pre-operative labs: CBC, BMP, coagulation studies, urinalysis, HbA1c for diabetics",
      "Post-operative: Hemoglobin/hematocrit for blood loss (typically 500-1000 mL)",
      "Assess neurovascular status of affected limb: posterior tibial and dorsalis pedis pulses",
      "Monitor wound drainage: expected serosanguinous, concerning if bright red or >200 mL/hour",
      "Screen for DVT: Homan sign unreliable, monitor for calf swelling, warmth, and pain"
    ],
    management: [
      "Continuous passive motion (CPM) machine initiated per surgeon protocol (goal 0-90° flexion)",
      "DVT prophylaxis: LMWH, aspirin, or rivaroxaban per protocol with sequential compression devices",
      "Multimodal pain management: peripheral nerve block, scheduled acetaminophen, NSAIDs, PRN opioids",
      "Physical therapy initiated POD 0 or 1: weight-bearing as tolerated with walker",
      "Surgical site care: keep dressing clean and dry, monitor for signs of infection",
      "Transfusion if hemoglobin drops below 7 g/dL or symptomatic anemia"
    ],
    nursingActions: [
      "Perform neurovascular checks every 1-2 hours for first 24 hours: pulses, sensation, movement, color",
      "Manage CPM machine: ensure proper limb alignment, gradually increase flexion per orders",
      "Apply ice to knee (cryotherapy) to reduce swelling and pain",
      "Elevate operative leg on pillows (avoid placing pillow directly behind knee)",
      "Assess surgical dressing and drain output: quantity, color, consistency",
      "Implement fall prevention: side rails, bed alarm, assist with ambulation",
      "Encourage ankle pump exercises and quadriceps sets while in bed",
      "Monitor for signs of prosthetic joint infection: fever, wound erythema, increased pain, elevated CRP/ESR"
    ],
    assessmentFindings: [
      "Post-operative swelling and ecchymosis around knee joint",
      "Expected serosanguinous drainage from surgical site",
      "Pain with initial mobilization, manageable with multimodal analgesia",
      "Limited range of motion initially, improving with physical therapy",
      "Low-grade temperature (<38.5°C) common in first 48 hours"
    ],
    signs: {
      left: [
        "Post-operative swelling and ecchymosis (expected)",
        "Serosanguinous drainage from wound",
        "Pain with weight-bearing and ROM exercises",
        "Limited knee flexion initially"
      ],
      right: [
        "DVT: unilateral calf swelling, warmth, erythema",
        "Prosthetic infection: fever >38.5°C after 48 hours, wound drainage",
        "Peroneal nerve injury: foot drop, decreased dorsiflexion",
        "PE: sudden dyspnea, pleuritic chest pain, tachycardia"
      ]
    },
    medications: [
      { name: "Rivaroxaban (Xarelto)", type: "Direct Factor Xa Inhibitor", action: "Directly inhibits factor Xa to prevent DVT and PE post-operatively. Oral anticoagulant not requiring INR monitoring", sideEffects: "Bleeding, GI upset, hepatotoxicity", contra: "Active pathological bleeding, severe hepatic disease with coagulopathy", pearl: "Take 10mg once daily with food for DVT prophylaxis post-TKA. Duration typically 12-14 days. No antidote widely available (andexanet alfa for emergencies)." },
      { name: "Celecoxib (Celebrex)", type: "COX-2 Selective NSAID", action: "Selectively inhibits COX-2 to reduce prostaglandin-mediated inflammation and pain with less GI toxicity than non-selective NSAIDs", sideEffects: "Cardiovascular risk, renal impairment, GI bleeding (lower risk)", contra: "Sulfonamide allergy, severe renal/hepatic impairment, post-CABG", pearl: "Used as part of multimodal analgesia to reduce opioid requirements. 200mg BID typically prescribed. Monitor renal function." }
    ],
    pearls: [
      "Do NOT place a pillow directly under the knee—this promotes flexion contracture and impairs venous return",
      "Peroneal nerve palsy (foot drop) can result from compression against the fibular head—ensure no pressure on lateral knee",
      "Early ambulation (POD 0-1) is the single most important factor in preventing DVT and achieving good outcomes",
      "Goal range of motion: 0° extension and 90° flexion by discharge, 120° by 12 weeks",
      "Fall risk is highest during the first independent trip to the bathroom—always assist"
    ],
    quiz: [
      { question: "Which position should the nurse avoid for a patient post-total knee replacement?", options: ["Leg elevated on one pillow with knee slightly extended", "Pillow placed directly under the knee for comfort", "Ice applied to the knee with leg elevated", "CPM machine set to 30 degrees of flexion"], correct: 1, rationale: "A pillow directly under the knee promotes flexion contracture and can impair popliteal venous return, increasing DVT risk. The leg should be elevated with support under the calf and ankle." },
      { question: "Post-TKA day 1, the patient reports inability to dorsiflex the foot. What does the nurse suspect?", options: ["Normal post-operative swelling effect", "Deep vein thrombosis in the popliteal vein", "Peroneal nerve injury from positioning or compression", "Reaction to anesthesia"], correct: 2, rationale: "Inability to dorsiflex (foot drop) indicates peroneal nerve injury, which can occur from compression against the fibular head during surgery or positioning. This requires immediate notification." },
      { question: "A patient 3 days post-TKA develops sudden dyspnea, tachycardia, and pleuritic chest pain. What is the priority action?", options: ["Administer supplemental oxygen and notify the provider stat", "Reposition the patient and encourage deep breathing", "Administer scheduled acetaminophen for pain", "Document the findings and reassess in 30 minutes"], correct: 0, rationale: "Sudden dyspnea, tachycardia, and pleuritic chest pain strongly suggest pulmonary embolism, a life-threatening post-TKA complication. Immediate oxygen and provider notification are essential." }
    ]
  },

  "amputation-care-rn": {
    title: "Amputation: Perioperative & Rehabilitation Nursing",
    cellular: {
      title: "Amputation Pathophysiology and Wound Healing",
      content: "Amputation involves surgical removal of a limb or portion of a limb, most commonly due to peripheral arterial disease (PAD) with critical limb ischemia. In PAD, atherosclerotic plaque narrows arterial lumen, reducing distal perfusion. When tissue oxygen delivery falls below metabolic demands, ischemic necrosis and gangrene develop. Diabetic patients are at particularly high risk due to combined macrovascular disease, microvascular dysfunction from basement membrane thickening, and peripheral neuropathy masking ischemic pain. The stump wound heals through primary intention when the flap is closed surgically. Post-operatively, phantom limb pain occurs in 50-80% of amputees due to cortical reorganization in the somatosensory cortex: neurons that formerly received input from the amputated limb become responsive to adjacent body regions, creating mismatched sensory signals perceived as pain, tingling, or cramping in the missing limb. Peripheral nerve neuromas form when severed axons attempt to regenerate, creating disorganized nerve tissue masses that generate spontaneous ectopic neural discharges."
    },
    riskFactors: [
      "Peripheral arterial disease with non-healing ulcers or gangrene",
      "Diabetes mellitus with neuropathy and vascular insufficiency",
      "Severe trauma with non-salvageable limb injury",
      "Osteosarcoma or other malignant bone tumors",
      "Uncontrolled infection: osteomyelitis, gas gangrene",
      "Frostbite with tissue necrosis",
      "Chronic limb ischemia unresponsive to revascularization"
    ],
    diagnostics: [
      "Ankle-brachial index (ABI) to assess arterial perfusion (<0.4 indicates severe ischemia)",
      "Transcutaneous oxygen pressure (TcPO2) to predict wound healing potential at amputation level",
      "Angiography or CT angiography to evaluate arterial anatomy",
      "Pre-operative albumin and prealbumin to assess nutritional status for wound healing",
      "HbA1c for diabetic patients (target <8% for optimal surgical outcome)",
      "Wound cultures if infection present"
    ],
    management: [
      "Determine amputation level based on perfusion studies and functional goals",
      "Post-operative stump care: rigid dressing or soft dressing with elastic bandage wrapping",
      "Phantom limb pain management: gabapentin, mirror therapy, TENS",
      "Prosthetic fitting evaluation at 4-8 weeks post-operatively when stump healed and shaped",
      "Comprehensive rehabilitation: physical therapy, occupational therapy, psychological support",
      "Optimize diabetes control and cardiovascular risk factors to protect remaining limb"
    ],
    nursingActions: [
      "Elevate residual limb on pillow for first 24-48 hours only (longer promotes hip flexion contracture)",
      "Wrap residual limb with elastic bandage in figure-8 pattern to shape stump for prosthetic fitting",
      "Monitor stump for complications: wound dehiscence, infection, hematoma, excessive edema",
      "Position patient prone for 20-30 minutes several times daily to prevent hip flexion contracture (BKA: knee extension)",
      "Assess phantom limb sensations and pain: validate the experience, implement prescribed interventions",
      "Provide emotional support: address grief and body image changes, refer to support groups",
      "Begin transfer training and mobility exercises with physical therapy",
      "Protect remaining limb: daily inspection, proper footwear, skin care, diabetic foot care education"
    ],
    assessmentFindings: [
      "Post-operative pain at surgical site and possible phantom limb sensations",
      "Stump edema and serosanguinous drainage (expected initial 48 hours)",
      "Grief, anxiety, or depression related to body image change and functional loss",
      "Reduced mobility requiring adaptive equipment and training",
      "Potential for contracture formation if positioning not maintained"
    ],
    signs: {
      left: [
        "Adequate stump perfusion: warm, pink, palpable proximal pulse",
        "Expected serosanguinous drainage first 48 hours",
        "Phantom limb sensations (non-painful)",
        "Gradual stump shrinkage and maturation"
      ],
      right: [
        "Wound infection: erythema, purulent drainage, fever",
        "Hematoma: tense swelling, pain, discoloration",
        "Phantom limb pain: burning, crushing, cramping sensations",
        "Flexion contracture: inability to fully extend hip or knee"
      ]
    },
    medications: [
      { name: "Gabapentin (Neurontin)", type: "Anticonvulsant/Neuropathic Pain Agent", action: "Modulates calcium channels reducing excitatory neurotransmitter release. First-line for phantom limb pain and neuropathic pain", sideEffects: "Drowsiness, dizziness, peripheral edema, weight gain", contra: "Severe renal impairment (dose adjust), suicidal ideation monitoring", pearl: "Start low (300mg at bedtime), titrate slowly over weeks. May take 2-4 weeks for full effect. Abrupt discontinuation can cause seizures." },
      { name: "Pregabalin (Lyrica)", type: "Alpha-2-Delta Ligand", action: "Binds alpha-2-delta subunit of voltage-gated calcium channels reducing neurotransmitter release at hyperexcitable synapses", sideEffects: "Somnolence, dizziness, weight gain, peripheral edema, blurred vision", contra: "Hypersensitivity, dose adjustment in renal impairment", pearl: "Alternative to gabapentin with more predictable absorption. 75mg BID initially, may increase to 300mg/day. Schedule V controlled substance (abuse potential)." }
    ],
    pearls: [
      "Elevate the stump for only 24-48 hours post-op to control edema, then begin prone positioning to prevent contracture",
      "Figure-8 bandaging technique creates a cone shape ideal for prosthetic fitting—circular wrapping causes tourniquet effect",
      "Phantom limb pain is REAL neurological pain, not psychological—validate the patient's experience and treat aggressively",
      "Mirror therapy (using a mirror to reflect the intact limb) can reduce phantom pain by providing visual cortical feedback",
      "The remaining limb is at extreme risk: 50% of diabetic amputees lose the contralateral limb within 5 years without aggressive prevention"
    ],
    quiz: [
      { question: "When wrapping a below-knee amputation residual limb, which technique should the nurse use?", options: ["Circular wrapping from proximal to distal", "Figure-8 wrapping from distal to proximal", "Spiral wrapping from proximal to distal", "No wrapping—leave stump exposed to air"], correct: 1, rationale: "Figure-8 wrapping from distal to proximal creates a conical stump shape optimal for prosthetic fitting. Circular wrapping creates a tourniquet effect and is contraindicated." },
      { question: "A patient 3 days post-above knee amputation refuses to lie prone. Why is prone positioning important?", options: ["To promote wound drainage", "To prevent hip flexion contracture", "To reduce phantom limb pain", "To improve respiratory function"], correct: 1, rationale: "Prone positioning stretches the hip flexors to prevent hip flexion contracture, which would interfere with prosthetic fitting and ambulation. The patient should be positioned prone for 20-30 minutes several times daily." },
      { question: "A patient reports burning and crushing pain in the amputated foot. What is the appropriate nursing response?", options: ["Explain that the foot is no longer present and pain is imaginary", "Validate the experience and administer prescribed neuropathic pain medication", "Request a psychiatric consultation", "Apply ice to the stump to relieve the sensation"], correct: 1, rationale: "Phantom limb pain is real neurological pain caused by cortical reorganization and peripheral neuroma formation. The nurse should validate the experience and administer prescribed treatment such as gabapentin." }
    ]
  },

  "fibromyalgia-rn": {
    title: "Fibromyalgia: RN Assessment & Management",
    cellular: {
      title: "Fibromyalgia Pathophysiology: Central Sensitization",
      content: "Fibromyalgia is a central pain processing disorder characterized by widespread musculoskeletal pain, fatigue, and cognitive dysfunction. The pathophysiology involves central sensitization, where dorsal horn neurons in the spinal cord become hyperexcitable due to sustained nociceptive input, leading to amplified pain signal transmission to the brain. Elevated levels of excitatory neurotransmitters (substance P, glutamate) are found in cerebrospinal fluid, while inhibitory neurotransmitters (serotonin, norepinephrine, dopamine) are deficient. Functional MRI studies show augmented neural activation in pain-processing brain regions (anterior cingulate cortex, insular cortex, somatosensory cortex) in response to stimuli that would not normally be painful (allodynia). The hypothalamic-pituitary-adrenal (HPA) axis shows blunted cortisol response to stress, contributing to fatigue and pain amplification. Sleep architecture is disrupted with alpha-wave intrusion during delta (deep) sleep, preventing restorative sleep and perpetuating the pain-fatigue cycle. Glial cell activation in the CNS releases pro-inflammatory cytokines that further sensitize nociceptive pathways."
    },
    riskFactors: [
      "Female sex (7:1 female-to-male ratio, peak onset 20-50 years)",
      "Family history of fibromyalgia (genetic predisposition to central sensitization)",
      "History of physical or emotional trauma, including childhood abuse",
      "Coexisting autoimmune disorders: rheumatoid arthritis, SLE",
      "Sleep disorders: obstructive sleep apnea, restless leg syndrome",
      "Depression and anxiety disorders",
      "Chronic stress and maladaptive coping mechanisms",
      "History of repetitive injuries or chronic pain conditions"
    ],
    diagnostics: [
      "2016 ACR criteria: Widespread Pain Index (WPI) ≥7 and Symptom Severity Scale (SSS) ≥5, OR WPI 4-6 and SSS ≥9",
      "Symptoms present for at least 3 months",
      "Pain is generalized (at least 4 of 5 body regions)",
      "Labs to exclude other diagnoses: CBC, CMP, TSH, ESR, CRP, ANA, RF (all typically normal in fibromyalgia)",
      "No specific laboratory test or imaging confirms fibromyalgia—it is a clinical diagnosis",
      "Sleep study if obstructive sleep apnea suspected as contributing factor"
    ],
    management: [
      "Multimodal approach: pharmacological, exercise, cognitive behavioral therapy, sleep hygiene",
      "Regular aerobic exercise (low-impact): walking, swimming, cycling 30 minutes, 3-5 times per week",
      "Cognitive behavioral therapy for pain management and coping strategies",
      "Sleep hygiene optimization: consistent schedule, dark environment, no screens before bed",
      "FDA-approved medications: duloxetine, pregabalin, milnacipran",
      "Avoid opioids: they worsen central sensitization and are ineffective for fibromyalgia pain"
    ],
    nursingActions: [
      "Perform comprehensive pain assessment using validated tools appropriate for chronic pain",
      "Educate patient that fibromyalgia is a real neurological condition, not psychosomatic",
      "Develop individualized exercise plan starting with gentle activities and gradual progression",
      "Teach pacing strategies: alternate activity with rest, avoid boom-bust cycles",
      "Assess for depression and anxiety using PHQ-9 and GAD-7 screening tools",
      "Monitor medication adherence and side effects, particularly with SNRIs and anticonvulsants",
      "Educate on sleep hygiene practices and importance of restorative sleep",
      "Refer to pain management specialist, physical therapy, and psychological support as needed"
    ],
    assessmentFindings: [
      "Widespread pain lasting more than 3 months in multiple body regions",
      "Fatigue described as 'exhaustion' despite adequate sleep hours",
      "Cognitive dysfunction ('fibro fog'): difficulty concentrating, memory lapses",
      "Non-refreshing sleep with morning stiffness",
      "Sensitivity to touch, light, sound, and temperature"
    ],
    signs: {
      left: [
        "Widespread bilateral pain in multiple regions",
        "Tenderness to palpation at multiple points",
        "Fatigue and non-refreshing sleep",
        "Cognitive dysfunction (fibro fog)"
      ],
      right: [
        "Depression and anxiety (screen with PHQ-9/GAD-7)",
        "Irritable bowel symptoms (bloating, alternating diarrhea/constipation)",
        "Headaches (tension-type or migraine)",
        "Paresthesias and numbness in extremities"
      ]
    },
    medications: [
      { name: "Duloxetine (Cymbalta)", type: "SNRI Antidepressant", action: "Inhibits reuptake of serotonin and norepinephrine, enhancing descending pain inhibition pathways in the dorsal horn. FDA-approved for fibromyalgia", sideEffects: "Nausea, dry mouth, constipation, dizziness, increased sweating, hepatotoxicity", contra: "MAO inhibitor use within 14 days, uncontrolled narrow-angle glaucoma, severe hepatic impairment", pearl: "Start 30mg daily for 1 week, then increase to 60mg daily. Takes 4-6 weeks for full effect. Never abruptly discontinue—taper to prevent discontinuation syndrome." },
      { name: "Pregabalin (Lyrica)", type: "Alpha-2-Delta Ligand/Anticonvulsant", action: "Binds voltage-gated calcium channels reducing excitatory neurotransmitter release. FDA-approved for fibromyalgia pain", sideEffects: "Somnolence, dizziness, weight gain, peripheral edema, blurred vision", contra: "Hypersensitivity, dose adjust for renal impairment", pearl: "Start 75mg BID, may increase to 225mg BID. Schedule V controlled substance. Weight gain is dose-dependent. Most effective for pain and sleep improvement." }
    ],
    pearls: [
      "Fibromyalgia is NOT an inflammatory or autoimmune condition—ESR, CRP, ANA are normal. Elevated inflammatory markers suggest a different diagnosis",
      "Exercise is the single most effective non-pharmacological intervention, but patients must start slowly to avoid post-exertional flares",
      "Opioids are contraindicated in fibromyalgia—they worsen central sensitization and increase long-term pain",
      "Validate the patient's pain experience: fibromyalgia pain is real and neurologically mediated, not 'in their head'",
      "The triad of fibromyalgia: widespread pain + fatigue + cognitive dysfunction (fibro fog)"
    ],
    quiz: [
      { question: "A patient diagnosed with fibromyalgia asks for a stronger pain medication because prescribed duloxetine 'isn't working fast enough.' What is the best nursing response?", options: ["Request the provider prescribe an opioid for breakthrough pain", "Educate that duloxetine takes 4-6 weeks for full therapeutic effect and encourage continued use", "Suggest increasing the dose immediately", "Recommend the patient stop duloxetine and try a different class"], correct: 1, rationale: "SNRIs like duloxetine take 4-6 weeks to achieve full therapeutic effect. The nurse should educate on this timeline and encourage continued adherence. Opioids are contraindicated in fibromyalgia." },
      { question: "Which laboratory finding would be expected in a patient with fibromyalgia?", options: ["Elevated ESR and CRP", "Positive ANA and anti-dsDNA", "Elevated creatine kinase (CK)", "All laboratory values within normal limits"], correct: 3, rationale: "Fibromyalgia is a central sensitization disorder, not an inflammatory or autoimmune condition. All standard labs (ESR, CRP, ANA, CK) are typically normal. Abnormal results suggest a different or coexisting condition." },
      { question: "Which non-pharmacological intervention has the strongest evidence for fibromyalgia management?", options: ["Bed rest during pain flares", "Regular low-impact aerobic exercise", "Massage therapy alone", "Elimination diet"], correct: 1, rationale: "Regular low-impact aerobic exercise (walking, swimming, cycling) has the strongest evidence for reducing fibromyalgia symptoms including pain, fatigue, and depression. Exercise should start gently and increase gradually." }
    ]
  },

  "traction-care-rn": {
    title: "Traction: Types, Application & Nursing Care",
    cellular: {
      title: "Principles of Traction Therapy",
      content: "Traction applies a pulling force to a body part to realign fracture fragments, reduce dislocations, relieve muscle spasm, and prevent deformity. The fundamental principle involves applying a continuous force (traction) along the long axis of the bone, opposed by a counter-traction force (usually the patient's body weight). Skin traction (Buck's, Russell's, Bryant's) applies force through adhesive strips, wraps, or boots attached to the skin surface, limited to 5-10 pounds to prevent skin breakdown. Skeletal traction applies force directly through bone via pins (Steinmann), wires (Kirschner), or tongs (Gardner-Wells, Crutchfield) inserted into bone, allowing heavier weights (up to 25-40 pounds) for large bone fractures. The applied weight must overcome muscle spasm and contractile force to maintain fracture alignment. Counter-traction is achieved through body positioning, bed elevation, or manual resistance. Complications arise from prolonged immobilization: venous stasis increases DVT risk per Virchow triad, disuse atrophy occurs when type II muscle fibers atrophy within days of immobilization, and osteoclast activity exceeds osteoblast formation leading to disuse osteoporosis."
    },
    riskFactors: [
      "Femur fractures requiring skeletal traction for stabilization",
      "Cervical spine fractures requiring halo or tong traction",
      "Hip fractures awaiting surgical repair (Buck's traction for temporary immobilization)",
      "Pediatric femur fractures (Bryant's traction for children under 2 years)",
      "Acetabular fractures and hip dislocations",
      "Prolonged immobilization increasing risk for complications"
    ],
    diagnostics: [
      "Serial X-rays to verify fracture alignment is maintained with traction",
      "Neurovascular assessment of affected extremity every 1-2 hours",
      "Pin site assessment: monitor for infection, loosening, drainage",
      "Skin assessment under traction devices: erythema, breakdown, blistering",
      "DVT screening: monitor for unilateral leg swelling, pain, warmth",
      "Monitor for complications of immobility: atelectasis, constipation, urinary retention"
    ],
    management: [
      "Maintain prescribed weight and direction of pull at all times—do not remove weights",
      "Ensure ropes run freely through pulleys and weights hang free (not resting on floor or bed)",
      "Skeletal traction: pin site care per protocol (half-strength hydrogen peroxide or chlorhexidine)",
      "DVT prophylaxis: anticoagulants as ordered, sequential compression devices on unaffected leg",
      "Aggressive pulmonary hygiene: incentive spirometry, coughing and deep breathing every 2 hours",
      "High-fiber diet with adequate fluids to prevent constipation from immobility"
    ],
    nursingActions: [
      "Verify traction setup: proper alignment, ropes taut and free-running through pulleys, weights hanging freely",
      "Never remove or lift weights from skeletal traction—this disrupts fracture alignment",
      "Perform pin site care as prescribed: assess for signs of infection (purulent drainage, erythema, warmth)",
      "Maintain proper body alignment and counter-traction: raise foot of bed for lower extremity traction",
      "Assess skin under wraps and boots for skin traction: check every 8 hours for breakdown",
      "Perform neurovascular checks every 1-2 hours: circulation, sensation, motor function distal to traction",
      "Reposition within limits of traction to prevent pressure injury: use trapeze for self-repositioning",
      "Encourage deep breathing exercises and incentive spirometry to prevent atelectasis"
    ],
    assessmentFindings: [
      "Proper traction alignment with extremity in line with pulling force",
      "Pin sites clean and dry without excessive drainage",
      "Intact neurovascular status distal to traction site",
      "Patient reports manageable pain with analgesics",
      "No signs of skin breakdown under traction devices"
    ],
    signs: {
      left: [
        "Proper fracture alignment on X-ray",
        "Intact distal pulses and capillary refill",
        "Clean pin sites without purulent drainage",
        "Adequate pain control with prescribed medications"
      ],
      right: [
        "Pin site infection: purulent drainage, erythema, loosening",
        "Neurovascular compromise: absent pulses, paresthesia, pallor",
        "DVT: unilateral leg swelling, warmth, calf pain",
        "Skin breakdown under traction boots or wraps"
      ]
    },
    medications: [
      { name: "Enoxaparin (Lovenox)", type: "Low Molecular Weight Heparin", action: "Inhibits factor Xa for DVT prophylaxis during prolonged immobilization", sideEffects: "Bleeding, injection site hematoma, thrombocytopenia", contra: "Active bleeding, HIT history, severe renal impairment", pearl: "Administer SubQ in abdomen. Monitor platelet count for HIT. Protamine only partially reverses LMWH (60-75%)." },
      { name: "Docusate Sodium (Colace)", type: "Stool Softener", action: "Anionic surfactant that allows water and fat to penetrate stool, preventing constipation from immobility and opioid use", sideEffects: "Abdominal cramping, diarrhea (rare)", contra: "Intestinal obstruction, acute abdominal pain", pearl: "Prophylactic use essential in immobilized patients, especially those on opioids. Works best as prevention, less effective treating existing constipation. Combine with senna if needed." }
    ],
    pearls: [
      "NEVER remove or lift skeletal traction weights—this disrupts fracture alignment and can cause further injury",
      "Weights must hang freely: not resting on the bed frame, floor, or any surface. Ropes must be taut and run through pulleys without fraying",
      "Buck's traction (skin) is temporary—limited to 5-10 lbs and used pre-operatively for hip fractures to reduce pain and muscle spasm",
      "Bryant's traction is ONLY for children under 2 years (under 12-15 kg)—buttocks should be slightly elevated off the bed",
      "Pin site infection can lead to osteomyelitis—meticulous pin site care and assessment are critical nursing responsibilities"
    ],
    quiz: [
      { question: "A nurse finds the skeletal traction weights resting on the floor. What is the correct action?", options: ["Remove the weights and reapply later", "Lift the weights and reattach to the traction rope", "Raise the bed and ensure weights hang freely", "Notify the provider to discontinue traction"], correct: 2, rationale: "Traction weights must hang freely at all times to maintain proper pull and fracture alignment. Raising the bed or adjusting the setup so weights hang free without touching any surface is the correct action." },
      { question: "Which finding at a skeletal pin site requires immediate nursing intervention?", options: ["Small amount of clear serous drainage at pin site", "Slight erythema around pin insertion point", "Purulent drainage with pin loosening and surrounding warmth", "Mild crusting at the pin-skin interface"], correct: 2, rationale: "Purulent drainage with pin loosening and warmth indicates pin site infection requiring immediate notification and intervention. This can progress to osteomyelitis if untreated. Minor serous drainage and crusting are expected." },
      { question: "A child in Bryant's traction should be positioned so that:", options: ["The legs are flat on the bed with weights at the foot", "The buttocks are slightly elevated off the bed surface", "The child is in a lateral position with affected leg up", "The hips are flexed at 45 degrees with knees bent"], correct: 1, rationale: "In Bryant's traction, both legs are suspended vertically with the buttocks slightly elevated off the bed surface. This position uses the child's body weight as counter-traction. It is only used for children under 2 years or 12-15 kg." }
    ]
  }
};
