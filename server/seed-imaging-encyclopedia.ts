import { pool } from "./storage";

const PROFESSION = "imaging";

interface EncyclopediaEntry {
  slug: string;
  title: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  overview: string;
  mechanismPhysiology: string;
  clinicalRelevance: string;
  signsSymptoms: string;
  assessment: string;
  management: string;
  complications: string;
  clinicalPearls: { text: string }[];
  examPitfalls: { text: string }[];
  faqJson: { question: string; answer: string }[];
}

function makeEntries(): EncyclopediaEntry[] {
  const entries: EncyclopediaEntry[] = [];

  // =====================================================
  // CATEGORY 1: Radiographic Positioning (20 entries)
  // =====================================================
  const positioning: Omit<EncyclopediaEntry, "category">[] = [
    {
      slug: "pa-chest-radiograph",
      title: "PA Chest Radiograph",
      seoTitle: "PA Chest Radiograph Positioning Guide | ARRT & CAMRT",
      seoDescription: "Complete guide to PA chest radiograph positioning including patient setup, central ray placement, breathing instructions, and evaluation criteria for ARRT/CAMRT exams.",
      seoKeywords: ["PA chest x-ray", "posteroanterior chest", "chest radiograph positioning", "ARRT chest exam"],
      overview: "The posteroanterior (PA) chest radiograph is the most commonly performed diagnostic imaging examination. The patient stands facing the image receptor with the anterior chest surface in contact, and the x-ray beam enters from the posterior aspect. This projection minimizes heart magnification and provides optimal visualization of lung fields, mediastinum, and bony thorax.",
      mechanismPhysiology: "X-rays travel from posterior to anterior, reducing magnification of anterior structures such as the heart. The standard source-to-image distance (SID) of 72 inches (183 cm) further reduces magnification. Proper collimation limits the field to the area of clinical interest and reduces patient dose.",
      clinicalRelevance: "The PA chest is used to evaluate pneumonia, pleural effusion, pneumothorax, cardiomegaly, lung masses, rib fractures, and mediastinal abnormalities. It serves as a baseline study for pre-operative assessment and ongoing monitoring of cardiopulmonary disease.",
      signsSymptoms: "Indications include cough, dyspnea, chest pain, hemoptysis, fever of unknown origin, trauma evaluation, and pre-surgical screening. The PA chest is essential for identifying consolidation, atelectasis, and pleural fluid.",
      assessment: "Evaluation criteria: 10 posterior ribs visible above the diaphragm, symmetric clavicles equidistant from spinous processes, scapulae rotated laterally, no rotation (spinous processes midline between clavicles), full inspiration demonstrated.",
      management: "Patient positioned erect at 72-inch SID, chin elevated, shoulders rotated forward, hands on hips with elbows flexed. Central ray directed perpendicular to the image receptor at T7. Exposure made on second full inspiration. kVp range 110–125; short exposure time to minimize motion.",
      complications: "Rotation artifact may simulate mediastinal pathology. Inadequate inspiration can mimic cardiomegaly or basal congestion. Improper SID changes heart size measurement. Motion blur obscures fine lung detail.",
      clinicalPearls: [
        { text: "Always check for 10 posterior ribs to confirm adequate inspiration." },
        { text: "Symmetric clavicles confirm no patient rotation—critical for accurate heart size assessment." },
        { text: "Use high kVp (110-125) technique for better visualization of mediastinal structures." }
      ],
      examPitfalls: [
        { text: "Confusing AP and PA projections—AP magnifies the heart, PA minimizes it." },
        { text: "Forgetting the standard SID is 72 inches for an upright chest, not 40 inches." }
      ],
      faqJson: [
        { question: "Why is a 72-inch SID used for chest radiography?", answer: "The increased SID reduces magnification of thoracic structures, particularly the heart, providing more accurate size assessment compared to shorter distances." },
        { question: "How do you confirm no rotation on a PA chest?", answer: "The spinous processes of the thoracic vertebrae should be equidistant between the medial ends of the clavicles." },
        { question: "What is the difference between PA and AP chest projections?", answer: "In PA, the x-ray beam enters posteriorly and exits anteriorly (patient faces the receptor). In AP, the beam enters anteriorly. PA minimizes heart magnification because the heart is closer to the receptor." }
      ]
    },
    {
      slug: "lateral-chest-radiograph",
      title: "Lateral Chest Radiograph",
      seoTitle: "Lateral Chest Radiograph Positioning | ARRT & CAMRT Study Guide",
      seoDescription: "Learn lateral chest radiograph positioning, evaluation criteria, and clinical applications for ARRT and CAMRT certification exams.",
      seoKeywords: ["lateral chest x-ray", "lateral chest positioning", "chest radiograph lateral view"],
      overview: "The lateral chest radiograph is typically performed as a complement to the PA projection, providing a perpendicular view that helps localize lesions and evaluate structures obscured by superimposition on the frontal view. The left lateral is standard to minimize cardiac magnification.",
      mechanismPhysiology: "The lateral view separates structures that overlap on the PA projection. The retrosternal and retrocardiac spaces become visible, allowing evaluation of the posterior costophrenic angles, thoracic spine, and posterior lung bases.",
      clinicalRelevance: "Essential for localizing pulmonary nodules, evaluating vertebral compression fractures, assessing the retrosternal space for lymphadenopathy or thymic masses, and identifying posterior pleural effusions.",
      signsSymptoms: "Ordered in conjunction with PA chest when further evaluation is needed for masses, effusions, or when pathology is suspected in areas obscured on the frontal view.",
      assessment: "Evaluation criteria: Superimposition of posterior ribs and posterior costophrenic angles, open sternoclavicular joints, thoracic spine visible through the cardiac shadow, arms elevated above the area of interest.",
      management: "Patient stands with left side against the image receptor, arms raised overhead or supported. CR directed perpendicular to T7 at the midcoronal plane. 72-inch SID. Exposure on full inspiration.",
      complications: "Failure to superimpose posterior structures indicates rotation. Incomplete arm elevation can obscure the lung apices. Kyphotic patients may require angle compensation.",
      clinicalPearls: [
        { text: "The left lateral is preferred to minimize magnification of the heart." },
        { text: "The retrocardiac and retrosternal clear spaces should be evaluated for masses." }
      ],
      examPitfalls: [
        { text: "Forgetting that left lateral is standard—the right lateral is used only when specifically requested." },
        { text: "Not recognizing rotation: posterior ribs and costophrenic angles should superimpose." }
      ],
      faqJson: [
        { question: "Why is the left lateral the standard lateral chest projection?", answer: "Placing the left side closest to the image receptor minimizes magnification of the heart since the heart is predominantly left-sided." },
        { question: "How do you assess rotation on a lateral chest?", answer: "The posterior ribs and posterior costophrenic angles should be superimposed. Separation indicates rotation." }
      ]
    },
    {
      slug: "ap-supine-chest",
      title: "AP Supine Chest Radiograph",
      seoTitle: "AP Supine Chest X-ray Positioning | Portable Radiography Guide",
      seoDescription: "AP supine chest radiograph positioning for portable and bedside studies. Learn technique adjustments, limitations, and evaluation criteria.",
      seoKeywords: ["AP chest x-ray", "portable chest radiograph", "supine chest positioning", "bedside radiography"],
      overview: "The AP supine or semi-upright chest radiograph is performed when patients cannot stand for a PA projection, commonly in ICU, ER, or post-surgical settings. The beam enters anteriorly, resulting in cardiac magnification and altered fluid distribution patterns.",
      mechanismPhysiology: "With a shorter SID (typically 40 inches) and AP beam direction, the heart is farther from the receptor and appears magnified (up to 15-20% larger). Supine positioning redistributes pleural fluid posteriorly, potentially masking effusions that would layer on upright studies.",
      clinicalRelevance: "Used to evaluate line and tube placement (endotracheal tubes, central lines, chest tubes, nasogastric tubes), post-procedure complications, and acute cardiopulmonary changes in critically ill patients.",
      signsSymptoms: "Performed for critically ill or immobile patients requiring chest evaluation, post-procedure tube placement verification, or when upright PA positioning is contraindicated.",
      assessment: "Evaluation criteria: Annotation of AP projection and patient position (supine/semi-upright), inclusion of lung apices to costophrenic angles, symmetric exposure, tube and line positions verified.",
      management: "Image receptor placed behind patient. SID typically 40 inches (or maximum achievable). Portable x-ray unit positioned. Exposure made on inspiration when possible. Higher kVp may be needed to compensate for scatter.",
      complications: "Cardiac magnification may falsely suggest cardiomegaly. Supine fluid redistribution mimics pulmonary edema. Widened mediastinum artifact can simulate aortic injury. Always note projection on the image.",
      clinicalPearls: [
        { text: "Always annotate AP images to prevent misinterpretation of heart size." },
        { text: "On supine films, pneumothorax appears as the deep sulcus sign rather than an apical lucency." }
      ],
      examPitfalls: [
        { text: "Measuring cardiothoracic ratio on AP films—heart size criteria are only valid on PA projections." },
        { text: "Not recognizing the deep sulcus sign as a pneumothorax on supine imaging." }
      ],
      faqJson: [
        { question: "Why does the heart appear larger on an AP chest?", answer: "The heart is positioned farther from the image receptor in AP positioning, causing greater magnification due to beam divergence. The shorter SID (40 inches vs 72 inches) further increases magnification." },
        { question: "How is pneumothorax identified on a supine chest film?", answer: "On supine films, free air collects anteriorly rather than at the apex. Look for the deep sulcus sign (abnormally deep, lucent costophrenic angle) and increased lucency over the affected hemithorax." }
      ]
    },
    {
      slug: "ap-abdomen-kub",
      title: "AP Abdomen (KUB) Radiograph",
      seoTitle: "AP Abdomen KUB Radiograph Positioning | Diagnostic Imaging Guide",
      seoDescription: "Complete guide to AP abdomen (KUB) radiograph positioning, including technique, evaluation criteria, and common pathology for ARRT/CAMRT exams.",
      seoKeywords: ["KUB radiograph", "AP abdomen x-ray", "abdominal radiograph positioning", "kidneys ureters bladder"],
      overview: "The AP abdomen radiograph (KUB — kidneys, ureters, and bladder) is a fundamental abdominal examination. The patient lies supine with the central ray directed to the iliac crests, demonstrating abdominal organs, bowel gas patterns, calcifications, and soft tissue outlines.",
      mechanismPhysiology: "Low kVp technique (70–80 kVp) provides contrast between soft tissue structures. The kidneys, psoas muscles, liver edge, spleen, and bladder are evaluated as soft tissue landmarks. Gas-filled bowel is readily visible due to natural contrast.",
      clinicalRelevance: "Used to evaluate bowel obstruction, ileus, free air (with upright or decubitus), renal calculi, ureteral stones, constipation, foreign bodies, and soft tissue masses. Serves as a scout image before IVP or CT.",
      signsSymptoms: "Ordered for abdominal pain, distension, nausea and vomiting, suspected obstruction, constipation, urinary symptoms, and pre-procedure planning.",
      assessment: "Evaluation criteria: Include diaphragm domes to pubic symphysis, symmetric iliac wings (no rotation), psoas muscle shadows visible, adequate soft tissue contrast, proper marker placement.",
      management: "Patient supine on table, arms at sides. CR perpendicular to the image receptor at the level of the iliac crests (L4-L5). Collimate to include the diaphragm superiorly and pubic symphysis inferiorly. Exposure on expiration for abdominal studies.",
      complications: "Rotation obscures the psoas shadows and may simulate mass effect. Inadequate technique may underexpose the lateral soft tissues. Motion from peristalsis or respiration degrades image quality.",
      clinicalPearls: [
        { text: "Exposure is made on expiration for abdominal radiographs, unlike chest radiographs." },
        { text: "The psoas muscle shadows are important landmarks—loss may indicate retroperitoneal pathology." },
        { text: "Always include the diaphragm to rule out free air under the diaphragm." }
      ],
      examPitfalls: [
        { text: "Forgetting that abdominal radiographs are taken on expiration, not inspiration." },
        { text: "Confusing iliac crest level (L4-L5) with umbilicus level for CR placement." }
      ],
      faqJson: [
        { question: "Why is the KUB taken on expiration?", answer: "Expiration moves the diaphragm superiorly, allowing better visualization of abdominal contents without overlapping lung bases, and provides more consistent abdominal compression." },
        { question: "What landmarks confirm no rotation on a KUB?", answer: "Symmetric iliac wings (ala), equal distance from spinous processes to pedicles bilaterally, and symmetric obturator foramina indicate no rotation." }
      ]
    },
    {
      slug: "lateral-cervical-spine",
      title: "Lateral Cervical Spine Radiograph",
      seoTitle: "Lateral Cervical Spine X-ray Positioning | Trauma & Routine Guide",
      seoDescription: "Lateral cervical spine radiograph positioning guide for routine and trauma settings. Includes evaluation criteria, swimmer's view, and ARRT/CAMRT exam tips.",
      seoKeywords: ["lateral c-spine", "cervical spine x-ray", "c-spine positioning", "cross-table lateral"],
      overview: "The lateral cervical spine radiograph is a critical projection for evaluating cervical vertebral alignment, disc spaces, and soft tissue. In trauma, the cross-table lateral is performed first without moving the patient's neck. All seven cervical vertebrae and the C7-T1 junction must be visualized.",
      mechanismPhysiology: "The lateral projection demonstrates the vertebral bodies, disc spaces, spinous processes, facet joints, and prevertebral soft tissue in profile. A 72-inch SID is standard to reduce magnification.",
      clinicalRelevance: "Essential for evaluating fractures, dislocations, degenerative disc disease, spondylolisthesis, and prevertebral soft tissue swelling indicating hemorrhage or abscess.",
      signsSymptoms: "Indicated for neck pain, trauma, neurological deficits, suspected fracture or dislocation, and post-injury evaluation.",
      assessment: "Must demonstrate C1 through C7-T1 junction, smooth anterior vertebral body line, posterior vertebral body line, spinolaminar line, and spinous process tips. Prevertebral soft tissue should be < 7mm at C2 and < 22mm at C6.",
      management: "Patient standing or seated for routine; supine with cross-table lateral for trauma. Shoulders depressed. 72-inch SID. CR directed to C4. If C7-T1 not seen, swimmer's lateral is performed.",
      complications: "Failure to demonstrate C7-T1 is a common and dangerous error—injuries at this level may be missed. Excessive rotation can obscure facet joints. Flexion/extension views should never be done in acute trauma without physician supervision.",
      clinicalPearls: [
        { text: "All 7 cervical vertebrae MUST be demonstrated—if C7-T1 is not seen, a swimmer's view is required." },
        { text: "Prevertebral soft tissue widening > 7mm at C2 suggests hemorrhage or edema." },
        { text: "In trauma, the lateral is ALWAYS done first, before any patient movement." }
      ],
      examPitfalls: [
        { text: "Accepting an image that does not include C7-T1—this is a critical error." },
        { text: "Not recognizing prevertebral soft tissue swelling as an indicator of occult fracture." }
      ],
      faqJson: [
        { question: "Why must C7-T1 be visualized on a lateral c-spine?", answer: "The cervicothoracic junction is a common site for fractures and dislocations. Failure to visualize this area can result in missed injuries." },
        { question: "What is a swimmer's lateral view?", answer: "A swimmer's view is performed when C7-T1 cannot be demonstrated on a standard lateral. One arm is raised overhead and the other is pulled inferiorly. The CR is angled 5° caudad through the C7-T1 region." }
      ]
    },
    {
      slug: "ap-pelvis-radiograph",
      title: "AP Pelvis Radiograph",
      seoTitle: "AP Pelvis Radiograph Positioning Guide | Diagnostic Imaging",
      seoDescription: "AP pelvis radiograph positioning, technique, and evaluation criteria for ARRT and CAMRT exam preparation.",
      seoKeywords: ["AP pelvis x-ray", "pelvis radiograph positioning", "hip radiograph", "pelvis anatomy"],
      overview: "The AP pelvis radiograph demonstrates the entire pelvic girdle, including both hip joints, sacrum, coccyx, and proximal femora. It is one of the most common examinations in emergency and orthopedic imaging.",
      mechanismPhysiology: "The projection demonstrates the iliac wings, sacroiliac joints, acetabula, femoral heads and necks, and the pubic and ischial rami. Internal rotation of the feet 15-20° places the femoral necks parallel to the image receptor.",
      clinicalRelevance: "Primary screening for hip fractures, pelvic ring fractures, sacroiliac joint pathology, acetabular fractures, avascular necrosis, osteoarthritis, and metastatic disease.",
      signsSymptoms: "Ordered for hip pain, trauma (fall on hip, high-energy mechanism), suspected fracture, pre-operative planning, and post-surgical follow-up.",
      assessment: "Evaluation criteria: Symmetric iliac wings and obturator foramina, femoral necks fully demonstrated without foreshortening, greater trochanters in profile, coccyx aligned with pubic symphysis midline.",
      management: "Patient supine, legs extended. Feet internally rotated 15-20° (unless trauma or suspected fracture). CR directed midway between the ASIS and pubic symphysis. Gonadal shielding per department protocol.",
      complications: "External rotation of the femur foreshortens the femoral neck, potentially hiding a fracture line. Rotation of the pelvis creates asymmetry that may simulate pathology. Do NOT rotate legs in trauma.",
      clinicalPearls: [
        { text: "In trauma, do NOT internally rotate the feet—the fracture may be displaced." },
        { text: "15-20° internal rotation of the feet places the femoral neck in true AP profile." },
        { text: "Symmetric obturator foramina confirm no pelvic rotation." }
      ],
      examPitfalls: [
        { text: "Internally rotating the feet on a trauma patient with suspected hip fracture." },
        { text: "Forgetting that the CR is at the midpoint between ASIS and pubic symphysis, not at the ASIS." }
      ],
      faqJson: [
        { question: "Why are the feet internally rotated for a non-trauma AP pelvis?", answer: "The femoral neck angles anteriorly (anteversion). Internal rotation of 15-20° compensates for this angle, placing the femoral neck parallel to the receptor for true AP demonstration without foreshortening." },
        { question: "Why should feet NOT be rotated in pelvic trauma?", answer: "Rotating the legs in the presence of a fracture may displace the fracture fragments, worsen the injury, cause vascular damage, or increase pain." }
      ]
    },
    {
      slug: "ap-shoulder-radiograph",
      title: "AP Shoulder Radiograph",
      seoTitle: "AP Shoulder Radiograph Positioning | Diagnostic Imaging Guide",
      seoDescription: "AP shoulder radiograph positioning with internal and external rotation views for ARRT and CAMRT exam preparation.",
      seoKeywords: ["AP shoulder x-ray", "shoulder radiograph", "shoulder positioning", "rotator cuff imaging"],
      overview: "The AP shoulder radiograph demonstrates the proximal humerus, glenohumeral joint, acromioclavicular joint, and lateral clavicle. Internal and external rotation views are often obtained as part of a routine shoulder series.",
      mechanismPhysiology: "External rotation places the greater tuberosity in profile laterally, while internal rotation brings the lesser tuberosity into profile and demonstrates the humerus in a true lateral position. The glenohumeral joint space is best seen with the patient rotated 35-40° toward the affected side.",
      clinicalRelevance: "Used to evaluate shoulder dislocations, proximal humerus fractures, calcific tendinitis, Hill-Sachs deformity, Bankart lesions, and acromioclavicular joint separation.",
      signsSymptoms: "Indicated for shoulder pain, trauma, limited range of motion, suspected dislocation, and post-reduction evaluation.",
      assessment: "External rotation: greater tuberosity in profile, humeral head overlapping glenoid. Internal rotation: lesser tuberosity in profile, humeral shaft in lateral view. Both should show adequate penetration of soft tissue and bone.",
      management: "Patient erect or supine. Arm at side. For external rotation: palm supinated facing forward. For internal rotation: hand on abdomen. CR directed 1 inch inferior to coracoid process. 40-inch SID.",
      complications: "Failure to obtain both rotation views may miss fractures of the tuberosities. Excessive abduction of the arm can pull fracture fragments apart. Under-penetrated images obscure the glenohumeral joint.",
      clinicalPearls: [
        { text: "Both internal and external rotation views are needed for a complete proximal humerus evaluation." },
        { text: "A true AP of the glenohumeral joint requires 35-40° posterior oblique (Grashey view)." }
      ],
      examPitfalls: [
        { text: "Confusing internal and external rotation appearance of the proximal humerus." },
        { text: "Ordering only one rotation view when a proximal humerus fracture is suspected." }
      ],
      faqJson: [
        { question: "What is the difference between internal and external rotation shoulder views?", answer: "External rotation demonstrates the greater tuberosity in profile (laterally); internal rotation demonstrates the lesser tuberosity in profile and shows the humerus in lateral orientation." },
        { question: "What is a Grashey view?", answer: "The Grashey view is a true AP of the glenohumeral joint, achieved by rotating the patient 35-40° toward the affected side so the glenohumeral joint is perpendicular to the image receptor." }
      ]
    },
    {
      slug: "ap-and-lateral-knee",
      title: "AP and Lateral Knee Radiographs",
      seoTitle: "AP and Lateral Knee X-ray Positioning | ARRT & CAMRT Guide",
      seoDescription: "Complete guide to AP and lateral knee radiograph positioning, evaluation criteria, and common pathology for ARRT and CAMRT exams.",
      seoKeywords: ["knee x-ray positioning", "AP knee radiograph", "lateral knee x-ray", "knee imaging"],
      overview: "The knee series typically includes AP and lateral projections as a minimum. These views evaluate the distal femur, proximal tibia and fibula, patella, and knee joint space for fractures, arthritis, and effusion.",
      mechanismPhysiology: "The AP projection demonstrates the tibial plateau, femoral condyles, intercondylar eminence, and medial/lateral joint spaces. The lateral view shows the patella, suprapatellar bursa, knee joint in profile, and tibial plateau alignment.",
      clinicalRelevance: "Evaluates fractures (tibial plateau, distal femur, patella), osteoarthritis, joint effusion, loose bodies, osteochondral defects, and alignment abnormalities.",
      signsSymptoms: "Ordered for knee pain, trauma, swelling, locking, instability, and suspected fracture or degenerative changes.",
      assessment: "AP: Open joint space, intercondylar eminence centered, no rotation (fibular head slightly overlapping tibia). Lateral: Femoral condyles superimposed, patella in profile, suprapatellar bursa visible.",
      management: "AP: Patient supine, leg extended, CR directed to 0.5 inch below patellar apex. Lateral: Patient on side, knee flexed 20-30°, CR to 1 inch distal to medial epicondyle. 5-7° cephalad angle on AP to open the joint space.",
      complications: "Rotation on the AP obscures the joint space. Over-flexion on the lateral may obscure suprapatellar effusion. Not recognizing a lipohemarthrosis on a horizontal beam lateral can miss occult fracture.",
      clinicalPearls: [
        { text: "A 5-7° cephalad angle on AP opens the joint space by matching the tibial plateau angle." },
        { text: "A fat-fluid level (lipohemarthrosis) on lateral with horizontal beam indicates an intra-articular fracture." },
        { text: "Only 20-30° flexion on the lateral to avoid obscuring suprapatellar effusion." }
      ],
      examPitfalls: [
        { text: "Not angling the CR 5-7° cephalad on the AP, resulting in a closed joint space." },
        { text: "Missing a lipohemarthrosis on the lateral view, which indicates occult fracture." }
      ],
      faqJson: [
        { question: "Why is a cephalad angle used on the AP knee?", answer: "A 5-7° cephalad angle aligns the CR parallel to the tibial plateau, opening the joint space for optimal evaluation of cartilage and meniscal pathology." },
        { question: "What is a lipohemarthrosis?", answer: "A fat-fluid level in the suprapatellar bursa seen on a horizontal beam lateral, indicating fat from bone marrow mixing with blood—a sign of intra-articular fracture even if the fracture line is not directly visible." }
      ]
    },
    {
      slug: "ap-and-lateral-ankle",
      title: "AP and Lateral Ankle Radiographs",
      seoTitle: "AP and Lateral Ankle Radiograph Positioning | Imaging Guide",
      seoDescription: "Ankle radiograph positioning guide covering AP, lateral, and mortise views with evaluation criteria for ARRT and CAMRT certification.",
      seoKeywords: ["ankle x-ray positioning", "AP ankle radiograph", "ankle mortise view", "lateral ankle x-ray"],
      overview: "The ankle series includes AP, lateral, and mortise (AP with 15-20° internal rotation) projections. These views demonstrate the tibiotalar joint, malleoli, and the ankle mortise for fractures and ligamentous instability.",
      mechanismPhysiology: "The AP view demonstrates the tibia, fibula, talus, and ankle joint with some overlap of the distal fibula and tibia. The mortise view (15-20° internal rotation) opens the ankle mortise joint space uniformly. The lateral view shows the tibiotalar joint in profile.",
      clinicalRelevance: "Essential for evaluating ankle fractures (Weber classification), ligamentous injuries, osteochondral lesions of the talus, and degenerative changes. The mortise view is critical for assessing joint space uniformity.",
      signsSymptoms: "Ordered for ankle pain, trauma (inversion/eversion injury), swelling, inability to bear weight, and suspected fracture or sprain.",
      assessment: "AP: Distal tibia and fibula with slight overlap, talus well demonstrated. Mortise: Uniform joint space around talus on all three sides. Lateral: Tibiotalar joint open, calcaneus and distal fibula seen.",
      management: "AP: Leg extended, foot dorsiflexed to 90°. Mortise: Leg internally rotated 15-20°. Lateral: Patient on affected side, opposite leg forward. CR to midpoint of malleoli for all projections.",
      complications: "Insufficient rotation on mortise view results in an incomplete view of the mortise joint. Failure to dorsiflex the foot on AP results in talus foreshortening. Rotation artifacts may simulate widening of the joint.",
      clinicalPearls: [
        { text: "The mortise view with 15-20° internal rotation is the key view for assessing joint space uniformity." },
        { text: "Weber classification of ankle fractures is based on fibula fracture location relative to the syndesmosis." }
      ],
      examPitfalls: [
        { text: "Forgetting that the mortise view requires 15-20° internal rotation, not external." },
        { text: "Not recognizing that a widened medial clear space on mortise view indicates deltoid ligament injury." }
      ],
      faqJson: [
        { question: "What is the ankle mortise view?", answer: "An AP projection with 15-20° internal rotation of the leg, which opens the ankle mortise joint space uniformly on all three sides of the talus, allowing assessment of joint congruity." },
        { question: "What is the Weber classification?", answer: "The Weber classification categorizes ankle fractures based on the level of the fibula fracture relative to the ankle syndesmosis: Type A (below), Type B (at), Type C (above the syndesmosis)." }
      ]
    },
    {
      slug: "ap-and-lateral-lumbar-spine",
      title: "AP and Lateral Lumbar Spine Radiographs",
      seoTitle: "AP and Lateral Lumbar Spine Positioning | ARRT & CAMRT Guide",
      seoDescription: "Complete guide to AP and lateral lumbar spine radiograph positioning, evaluation criteria, and anatomy for ARRT and CAMRT certification exams.",
      seoKeywords: ["lumbar spine x-ray", "AP lumbar radiograph", "lateral lumbar spine", "L-spine positioning"],
      overview: "The lumbar spine series includes AP and lateral projections to evaluate the five lumbar vertebrae, intervertebral disc spaces, sacrum, and lumbosacral junction. These projections are fundamental for evaluating back pain and spinal pathology.",
      mechanismPhysiology: "AP projection demonstrates vertebral bodies, pedicles, spinous and transverse processes, and disc spaces. Lateral view shows vertebral body height, disc spaces, pars interarticularis, spinous processes, and sacral promontory.",
      clinicalRelevance: "Used to evaluate compression fractures, spondylosis, spondylolisthesis, disc space narrowing, scoliosis, transitional vertebrae, and metastatic disease.",
      signsSymptoms: "Ordered for low back pain, radiculopathy, trauma, suspected compression fracture, degenerative changes, and pre-operative evaluation.",
      assessment: "AP: Symmetric pedicles, spinous processes midline, disc spaces open, L1-S1 demonstrated. Lateral: Vertebral bodies in profile, disc spaces open, L1-S1 visualized, no rotation (posterior elements superimposed).",
      management: "AP: Patient supine, knees and hips flexed to reduce lordosis. CR perpendicular to L3 (at iliac crest level). Lateral: Patient in lateral recumbent position, knees flexed, support between ankles. CR to L3, perpendicular or 5° caudad for males.",
      complications: "Failure to flex hips on AP increases lordotic curve, closing disc spaces. Rotation on lateral creates double vertebral body margins. Inadequate centering may cut off L5-S1 junction.",
      clinicalPearls: [
        { text: "Flexing hips and knees reduces lordosis and opens disc spaces on the AP view." },
        { text: "The iliac crest corresponds to L4-L5 level—a critical landmark for centering." },
        { text: "The 'Scotty dog' is best seen on the oblique view and demonstrates the pars interarticularis." }
      ],
      examPitfalls: [
        { text: "Using the iliac crest as the CR for AP but centering 1 inch above it—it should be AT the crest (L4-L5)." },
        { text: "Forgetting to flex hips and knees on AP lumbar spine, resulting in excessive lordosis." }
      ],
      faqJson: [
        { question: "Why are hips and knees flexed for an AP lumbar spine?", answer: "Flexion reduces the lumbar lordotic curve, bringing the lumbar spine closer to the image receptor and opening the intervertebral disc spaces for better visualization." },
        { question: "What is the Scotty dog sign?", answer: "On oblique lumbar spine views, the posterior elements form the appearance of a Scotty dog. The pars interarticularis is represented by the dog's neck—a fracture here (spondylolysis) appears as a collar on the dog." }
      ]
    },
    {
      slug: "cross-table-lateral-hip",
      title: "Cross-Table Lateral Hip Radiograph",
      seoTitle: "Cross-Table Lateral Hip Positioning | Trauma Radiography Guide",
      seoDescription: "Cross-table (surgical) lateral hip positioning for trauma evaluation with technique tips and evaluation criteria for ARRT and CAMRT exams.",
      seoKeywords: ["cross-table lateral hip", "surgical lateral hip", "hip fracture radiograph", "trauma hip x-ray"],
      overview: "The cross-table (surgical) lateral hip is performed in trauma when the patient cannot be rotated for a frog-leg lateral. A horizontal beam is directed perpendicular to the femoral neck while the image receptor is placed against the patient's lateral hip.",
      mechanismPhysiology: "The horizontal beam traverses from medial to lateral (or lateral to medial depending on protocol), providing a lateral view of the femoral neck and head without requiring leg movement. The unaffected leg is elevated to clear the x-ray path.",
      clinicalRelevance: "Critical for confirming and classifying hip fractures, evaluating displacement and angulation, and pre-operative planning. Demonstrates anterior or posterior displacement not visible on the AP view.",
      signsSymptoms: "Performed when AP pelvis or hip suggests fracture and lateral view is needed but patient cannot be positioned for frog-leg lateral due to pain or suspected fracture.",
      assessment: "Femoral neck demonstrated in profile, femoral head and acetabulum visible, no superimposition from opposite leg, adequate soft tissue penetration.",
      management: "Patient supine, affected leg in neutral position (do NOT rotate). Unaffected leg flexed and elevated (or supported). Image receptor perpendicular along lateral hip. CR directed horizontally perpendicular to the femoral neck.",
      complications: "Inadequate elevation of the unaffected leg causes superimposition. Improper CR angle may foreshorten the femoral neck. Grid alignment errors cause grid cutoff.",
      clinicalPearls: [
        { text: "NEVER move or rotate the affected leg—the cross-table technique exists specifically to avoid this." },
        { text: "Elevating the unaffected leg to 90° at the hip clears it from the x-ray beam path." }
      ],
      examPitfalls: [
        { text: "Attempting a frog-leg lateral on a patient with a suspected hip fracture—this is contraindicated." },
        { text: "Not elevating the unaffected leg high enough, causing superimposition over the affected hip." }
      ],
      faqJson: [
        { question: "Why is the frog-leg lateral contraindicated in hip trauma?", answer: "The frog-leg position requires abduction and external rotation of the leg, which could displace fracture fragments, damage blood vessels (especially the medial femoral circumflex artery), and cause severe pain." },
        { question: "How is the unaffected leg positioned for a cross-table lateral hip?", answer: "The unaffected leg is flexed at the hip and knee to approximately 90° and supported to elevate it out of the x-ray beam path." }
      ]
    },
    {
      slug: "waters-view-facial-bones",
      title: "Waters View (Parietoacanthial Projection)",
      seoTitle: "Waters View Positioning for Facial Bones | Radiographic Guide",
      seoDescription: "Waters view (parietoacanthial projection) positioning for maxillary sinuses and facial bones. Complete ARRT and CAMRT exam preparation guide.",
      seoKeywords: ["Waters view", "parietoacanthial projection", "facial bone x-ray", "maxillary sinus radiograph"],
      overview: "The Waters view is the primary projection for evaluating the maxillary sinuses and facial bones. The patient's chin is elevated so the OML (orbitomeatal line) forms a 37° angle with the image receptor, projecting the petrous ridges below the maxillary sinuses.",
      mechanismPhysiology: "By extending the neck and angling the head, the dense petrous ridges are projected below the maxillary sinuses. This allows clear visualization of the maxillary sinuses, orbital floors, zygomatic arches, and nasal septum without superimposition.",
      clinicalRelevance: "Used to evaluate maxillary sinusitis (air-fluid levels), facial fractures (tripod/zygoma, orbital floor blowout), nasal fractures, and sinus opacification.",
      signsSymptoms: "Ordered for facial pain, trauma, suspected sinusitis, post-traumatic evaluation of midface, and orbital complaints.",
      assessment: "Petrous ridges projected at or below the maxillary sinus floors, maxillary sinuses clearly demonstrated, orbits visible with floors outlined, no rotation (equal distance from lateral orbital walls to skull margins).",
      management: "Patient prone or erect facing the image receptor. Chin elevated until the MML (mentomeatal line) is perpendicular to the receptor, or OML at 37° to the receptor. CR exits at the acanthion. An erect position is preferred for demonstrating air-fluid levels.",
      complications: "Insufficient chin elevation places the petrous ridges within the maxillary sinuses, obscuring pathology. Excessive extension projects the sinuses too inferiorly. Rotation creates asymmetry.",
      clinicalPearls: [
        { text: "For sinusitis evaluation, use an erect position with horizontal beam to demonstrate air-fluid levels." },
        { text: "Petrous ridges should be projected at or below the maxillary sinus floors." },
        { text: "The Waters view is also called the 'open-mouth Waters' when the mouth is open to show the sphenoid sinus." }
      ],
      examPitfalls: [
        { text: "Performing sinus studies supine—erect positioning is necessary for air-fluid level demonstration." },
        { text: "Insufficient chin extension leaving petrous ridges superimposed on the maxillary sinuses." }
      ],
      faqJson: [
        { question: "What is the angle of the OML to the image receptor in a Waters view?", answer: "The orbitomeatal line (OML) forms a 37° angle with the image receptor, or equivalently, the mentomeatal line (MML) is perpendicular to the receptor." },
        { question: "Why should sinus studies be done erect?", answer: "Erect positioning with a horizontal beam allows gravity to create air-fluid levels in the sinuses, which is the most reliable radiographic sign of acute sinusitis." }
      ]
    },
    {
      slug: "ap-and-lateral-forearm",
      title: "AP and Lateral Forearm Radiographs",
      seoTitle: "AP and Lateral Forearm X-ray Positioning | Imaging Guide",
      seoDescription: "Complete guide to AP and lateral forearm radiograph positioning including both joints, evaluation criteria, and common fracture patterns.",
      seoKeywords: ["forearm x-ray", "AP forearm radiograph", "lateral forearm", "radius ulna fracture"],
      overview: "The forearm series requires AP and lateral projections demonstrating both the wrist and elbow joints. Both joints MUST be included as fractures of the radius and ulna commonly involve injury at both ends of the bone.",
      mechanismPhysiology: "The AP demonstrates the radius and ulna with slight overlap at the proximal radioulnar joint. The lateral view shows the coronoid process, olecranon, and radial head in profile. The interosseous space is widest on AP.",
      clinicalRelevance: "Evaluates fractures (Monteggia, Galeazzi, both-bone forearm, Colles, Smith), dislocations, and alignment of the radius and ulna. Both joints must be included to detect associated injuries.",
      signsSymptoms: "Ordered for forearm pain, trauma, deformity, swelling, and suspected fracture.",
      assessment: "Both the wrist and elbow joints must be included. AP: Radius and ulna separated, slight overlap at proximal radioulnar joint. Lateral: 90° elbow flexion, coronoid and olecranon in profile, radial head superimposed on coronoid.",
      management: "AP: Patient seated, arm extended, hand supinated. Lateral: Elbow flexed 90°, thumb up. If both joints cannot fit on one image, separate images must include both joints.",
      complications: "Excluding a joint is the most common and significant error. A Monteggia fracture (ulna fracture + radial head dislocation) will be missed if the elbow is not included. A Galeazzi fracture (radius fracture + distal radioulnar dislocation) will be missed if the wrist is not included.",
      clinicalPearls: [
        { text: "ALWAYS include both joints—Monteggia and Galeazzi fractures involve injury at opposite ends of the forearm." },
        { text: "Monteggia = ulna fracture + radial head dislocation; Galeazzi = radius fracture + DRUJ dislocation." }
      ],
      examPitfalls: [
        { text: "Not including both joints on a forearm study—this is a critical error that can miss associated injuries." },
        { text: "Confusing Monteggia (ulna + radial head) with Galeazzi (radius + DRUJ) fracture-dislocations." }
      ],
      faqJson: [
        { question: "Why must both joints be included on a forearm radiograph?", answer: "Forearm fractures frequently have associated injuries at the opposite joint. A Monteggia fracture involves an ulna fracture with radial head dislocation (elbow), and a Galeazzi fracture involves a radius fracture with distal radioulnar joint disruption (wrist)." },
        { question: "What is a Monteggia fracture?", answer: "A Monteggia fracture-dislocation is an ulna shaft fracture with dislocation of the radial head at the elbow. It is commonly missed if the elbow joint is not included on the forearm radiograph." }
      ]
    },
    {
      slug: "ap-axial-towne-skull",
      title: "AP Axial (Towne) Skull Projection",
      seoTitle: "AP Axial Towne Projection Positioning | Skull Radiography Guide",
      seoDescription: "AP Axial Towne projection positioning for skull radiography including CR angle, evaluation criteria, and clinical applications.",
      seoKeywords: ["Towne projection", "AP axial skull", "skull radiograph", "occipital bone x-ray"],
      overview: "The AP axial (Towne) projection demonstrates the occipital bone, foramen magnum, dorsum sellae through the foramen magnum, and posterior clinoid processes. The CR is angled 30° caudad to the OML (or 37° to the IOML).",
      mechanismPhysiology: "The caudad angulation projects the frontal bone superiorly, revealing the occipital bone, foramen magnum, and posterior fossa structures. The dorsum sellae and posterior clinoid processes are demonstrated within the foramen magnum.",
      clinicalRelevance: "Used to evaluate occipital fractures, posterior fossa pathology, and as part of a skull series. Also demonstrates the mastoid processes and petrous pyramids.",
      signsSymptoms: "Ordered for head trauma, suspected skull fracture, and as part of a complete skull series.",
      assessment: "Dorsum sellae and posterior clinoid processes projected within the foramen magnum, symmetric petrous ridges, occipital bone clearly demonstrated, no rotation.",
      management: "Patient supine or erect, chin tucked to bring OML perpendicular to the receptor. CR angled 30° caudad to OML (or 37° to IOML). CR enters the forehead and exits the foramen magnum.",
      complications: "Incorrect angulation will project the dorsum sellae outside the foramen magnum. Insufficient chin flexion requires more tube angulation. Rotation creates asymmetric petrous ridges.",
      clinicalPearls: [
        { text: "30° caudad to OML or 37° caudad to IOML—both produce the same result." },
        { text: "The dorsum sellae and posterior clinoids should be seen within the foramen magnum on a properly positioned Towne view." }
      ],
      examPitfalls: [
        { text: "Confusing the angle: 30° to OML is equivalent to 37° to IOML." },
        { text: "Not recognizing that dorsum sellae must appear within the foramen magnum for correct positioning." }
      ],
      faqJson: [
        { question: "What is the CR angle for the Towne projection?", answer: "30° caudad to the orbitomeatal line (OML) or 37° caudad to the infraorbitomeatal line (IOML). Both produce the same angulation through the skull." },
        { question: "What should be seen within the foramen magnum on a Towne view?", answer: "The dorsum sellae and posterior clinoid processes should be projected within the foramen magnum. This confirms correct angulation and positioning." }
      ]
    },
    {
      slug: "odontoid-peg-view",
      title: "Open-Mouth Odontoid (Peg) View",
      seoTitle: "Open-Mouth Odontoid View Positioning | C1-C2 Radiography",
      seoDescription: "Open-mouth odontoid (peg) view positioning for C1-C2 evaluation in trauma and routine cervical spine imaging for ARRT and CAMRT exams.",
      seoKeywords: ["odontoid view", "open mouth view", "C1 C2 x-ray", "dens projection", "peg view"],
      overview: "The open-mouth odontoid view (AP projection through the open mouth) demonstrates the odontoid process (dens) of C2 and the C1-C2 articulation. It is an essential part of the cervical spine series for evaluating fractures and subluxation of the atlantoaxial joint.",
      mechanismPhysiology: "The patient opens their mouth widely so the x-ray beam passes through the open mouth to the C1-C2 junction without superimposition of the mandible or occipital bone. The OML is perpendicular to the receptor.",
      clinicalRelevance: "Critical for evaluating odontoid (dens) fractures (Anderson and D'Alonzo classification), atlantoaxial subluxation, Jefferson fractures (C1 burst), and rheumatoid arthritis involvement of the atlantoaxial joint.",
      signsSymptoms: "Part of the cervical spine series, especially critical in trauma. Ordered for upper neck pain, suspected C1-C2 pathology, and post-traumatic evaluation.",
      assessment: "Entire odontoid process (dens) demonstrated between the lateral masses of C1, bilateral C1-C2 lateral masses equidistant from the dens, no superimposition from teeth or occiput.",
      management: "Patient supine (trauma) or erect. Mouth opened widely. Head adjusted so the lower edge of the upper teeth and the base of the skull (mastoid tips) are aligned in the same horizontal plane. CR directed perpendicular to C2 through the open mouth.",
      complications: "Teeth obscuring the dens if mouth is not open wide enough. Occipital bone overlap if chin is not tucked correctly. Motion artifact from an uncooperative or injured patient.",
      clinicalPearls: [
        { text: "The lateral masses of C1 should be equidistant from the dens—asymmetry suggests rotary subluxation." },
        { text: "Jefferson fracture (C1 burst) shows lateral offset of C1 lateral masses beyond C2." }
      ],
      examPitfalls: [
        { text: "Not having the patient open their mouth wide enough, causing tooth overlap on the dens." },
        { text: "Confusing a Mach band artifact at the base of the dens with a type II odontoid fracture." }
      ],
      faqJson: [
        { question: "What is the Anderson and D'Alonzo classification of odontoid fractures?", answer: "Type I: avulsion of the odontoid tip (rare). Type II: fracture at the base of the dens (most common, highest non-union rate). Type III: fracture extending into the body of C2." },
        { question: "What does lateral offset of C1 on C2 indicate?", answer: "Bilateral lateral offset of the C1 lateral masses beyond the lateral margins of C2 is characteristic of a Jefferson fracture (C1 burst fracture), typically caused by axial loading." }
      ]
    },
    {
      slug: "lateral-decubitus-chest",
      title: "Lateral Decubitus Chest Radiograph",
      seoTitle: "Lateral Decubitus Chest X-ray Positioning | Effusion & Pneumothorax",
      seoDescription: "Lateral decubitus chest radiograph positioning for detecting pleural effusion and pneumothorax with clinical applications and evaluation criteria.",
      seoKeywords: ["lateral decubitus chest", "pleural effusion imaging", "decubitus radiograph", "free air detection"],
      overview: "The lateral decubitus chest radiograph is performed with the patient lying on their side and a horizontal x-ray beam. It is used to detect small pleural effusions (affected side down) or pneumothorax (affected side up) by allowing fluid or air to redistribute with gravity.",
      mechanismPhysiology: "Gravity causes free-flowing pleural fluid to layer along the dependent chest wall, making even small effusions (as little as 5-15 mL) visible as a fluid line. Free air rises to the non-dependent side, making small pneumothoraces visible.",
      clinicalRelevance: "Differentiates free-flowing from loculated pleural effusions. Detects small effusions that are not visible on upright PA chest. Evaluates suspected pneumothorax in patients who cannot sit upright.",
      signsSymptoms: "Ordered when a small effusion is suspected, to determine if effusion is free-flowing (for thoracentesis planning), or to evaluate suspected pneumothorax in supine patients.",
      assessment: "Horizontal beam must be used. Affected side down for effusion (fluid layers between chest wall and lung). Affected side up for pneumothorax (air rises to non-dependent hemithorax).",
      management: "Patient lies on the affected side for 5 minutes before exposure (allows fluid to redistribute). Horizontal beam directed AP or PA. CR to T7. Image receptor posterior to patient. Mark side that is down.",
      complications: "Insufficient time in decubitus position may not allow fluid to redistribute. Loculated effusions will not layer. Without horizontal beam, gravity effect is lost.",
      clinicalPearls: [
        { text: "Affected side DOWN for effusion; affected side UP for pneumothorax." },
        { text: "If effusion does not layer, it is loculated and may not be amenable to thoracentesis." },
        { text: "Allow patient to lie in position for at least 5 minutes before exposure." }
      ],
      examPitfalls: [
        { text: "Putting the affected side up when looking for effusion—side should be DOWN." },
        { text: "Not using a horizontal beam—without it, fluid/air redistribution cannot be demonstrated." }
      ],
      faqJson: [
        { question: "Which side should be down for a decubitus chest for pleural effusion?", answer: "The affected (suspected effusion) side should be DOWN (dependent). Gravity causes free-flowing fluid to layer along the dependent chest wall, making it visible as a band of fluid between the lung and chest wall." },
        { question: "How much effusion can a lateral decubitus detect?", answer: "Lateral decubitus positioning can detect as little as 5-15 mL of free-flowing pleural fluid, compared to approximately 200-300 mL needed to be visible on an upright PA chest radiograph." }
      ]
    },
    {
      slug: "ap-and-lateral-hand",
      title: "AP (PA) and Lateral Hand Radiographs",
      seoTitle: "Hand X-ray Positioning Guide | PA, Oblique & Lateral Views",
      seoDescription: "Complete guide to PA, oblique, and lateral hand radiograph positioning with evaluation criteria for ARRT and CAMRT certification.",
      seoKeywords: ["hand x-ray positioning", "PA hand radiograph", "hand oblique view", "finger radiograph"],
      overview: "The hand series includes PA, oblique, and lateral projections. The PA demonstrates the phalanges, metacarpals, carpals, and distal radius/ulna. The oblique separates metacarpals. The lateral demonstrates anterior/posterior displacement.",
      mechanismPhysiology: "PA: Hand flat on receptor, CR to 3rd MCP joint. The fan-shaped lateral demonstrates all digits in lateral, requiring specific positioning. The 45° oblique separates overlapping metacarpals.",
      clinicalRelevance: "Evaluates fractures (boxer's fracture of 5th metacarpal, Bennett fracture of 1st metacarpal, scaphoid fracture), dislocations, arthritis, and foreign bodies.",
      signsSymptoms: "Ordered for hand pain, trauma, swelling, deformity, arthritis evaluation, and foreign body detection.",
      assessment: "PA: No overlap of digits (fingers slightly spread), soft tissue and bony detail visible, distal radius and ulna included. Oblique: 45° rotation with metacarpals separated. Lateral: Metacarpals superimposed.",
      management: "PA: Hand pronated flat on receptor, fingers slightly spread. CR to 3rd MCP joint. Oblique: Hand rotated 45° lateral. Lateral: Ulnar surface on receptor, fingers in fan or extended lateral position.",
      complications: "Finger overlap on PA obscures fractures. Incorrect obliquity may not separate metacarpals. The scaphoid may not be well demonstrated on standard PA—a dedicated scaphoid view may be needed.",
      clinicalPearls: [
        { text: "A boxer's fracture is a fracture of the 5th metacarpal neck, seen on PA and oblique views." },
        { text: "If scaphoid fracture is suspected, a dedicated scaphoid series with ulnar deviation is needed." }
      ],
      examPitfalls: [
        { text: "Not spreading the fingers on the PA, causing overlap and missed fractures." },
        { text: "Forgetting that a normal initial hand/wrist x-ray does not exclude scaphoid fracture—follow-up in 10-14 days is needed." }
      ],
      faqJson: [
        { question: "What is a boxer's fracture?", answer: "A fracture of the 5th metacarpal neck, typically caused by punching with a closed fist. It is best demonstrated on PA and oblique hand views, showing volar angulation of the distal fragment." },
        { question: "Why might a scaphoid fracture not show on initial radiographs?", answer: "Scaphoid fractures may be radiographically occult for 10-14 days. Bone resorption at the fracture line eventually makes it visible. If clinical suspicion is high, MRI or follow-up radiographs are recommended." }
      ]
    },
    {
      slug: "ap-and-lateral-foot",
      title: "AP and Lateral Foot Radiographs",
      seoTitle: "AP and Lateral Foot X-ray Positioning | Diagnostic Imaging Guide",
      seoDescription: "Foot radiograph positioning guide covering AP (dorsoplantar), oblique, and lateral views with evaluation criteria for ARRT and CAMRT exams.",
      seoKeywords: ["foot x-ray positioning", "AP foot radiograph", "lateral foot view", "metatarsal fracture"],
      overview: "The foot series includes AP (dorsoplantar), oblique, and lateral projections. The AP view demonstrates the phalanges, metatarsals, and cuneiforms. The oblique separates the metatarsal bases and tarsals. The lateral shows the calcaneus and talus in profile.",
      mechanismPhysiology: "The AP is taken with a 10° CR angle toward the heel to open the tarsometatarsal joint spaces. The medial oblique (45°) separates the metatarsal bases. The lateral view demonstrates the longitudinal arch and calcaneus.",
      clinicalRelevance: "Evaluates metatarsal fractures (especially stress fractures and Jones fracture of 5th metatarsal base), Lisfranc injuries, calcaneal fractures, plantar fasciitis, and arthritis.",
      signsSymptoms: "Ordered for foot pain, trauma, suspected fracture, deformity, bunion evaluation, and diabetic foot assessment.",
      assessment: "AP: Toes separated, metatarsals and tarsals demonstrated, 10° posterior angulation for joint spaces. Oblique: Metatarsal bases separated. Lateral: Weight-bearing if possible, calcaneus and talus in profile.",
      management: "AP: Foot flat on receptor, CR angled 10° toward heel to 3rd metatarsal base. Oblique: Foot rotated 30-45° medially. Lateral: Medial surface on receptor or weight-bearing lateral.",
      complications: "Missing a Lisfranc injury (tarsometatarsal dislocation) is a commonly missed diagnosis. Jones fracture at 5th metatarsal base must be distinguished from a normal apophysis.",
      clinicalPearls: [
        { text: "A Jones fracture is a fracture at the base of the 5th metatarsal—distinguish it from an avulsion fracture (more proximal) and normal apophysis." },
        { text: "Lisfranc injury: on AP, the medial border of the 2nd metatarsal should align with the medial border of the middle cuneiform." },
        { text: "Weight-bearing lateral is preferred for evaluating the longitudinal arch." }
      ],
      examPitfalls: [
        { text: "Not angling the CR 10° posteriorly on AP foot, resulting in closed joint spaces." },
        { text: "Missing a subtle Lisfranc injury—always check 2nd metatarsal-cuneiform alignment." }
      ],
      faqJson: [
        { question: "What is a Jones fracture?", answer: "A transverse fracture at the base of the 5th metatarsal at the metaphyseal-diaphyseal junction. It is prone to non-union due to poor blood supply in this area." },
        { question: "Why is a 10° CR angle used for the AP foot?", answer: "The 10° posterior (toward the heel) angulation aligns the CR perpendicular to the metatarsal shafts and opens the tarsometatarsal joint spaces for optimal demonstration." }
      ]
    },
    {
      slug: "swimmers-lateral-view",
      title: "Swimmer's Lateral View (Twining Method)",
      seoTitle: "Swimmer's Lateral Positioning | C7-T1 Visualization Guide",
      seoDescription: "Swimmer's lateral view positioning guide for demonstrating the cervicothoracic junction (C7-T1) when standard lateral is inadequate.",
      seoKeywords: ["swimmer's lateral", "Twining method", "C7 T1 view", "cervicothoracic junction"],
      overview: "The swimmer's lateral (Twining method) is used when the standard lateral cervical spine fails to demonstrate the C7-T1 junction due to shoulder superimposition. One arm is elevated overhead and the other is pulled inferiorly to separate the shoulders.",
      mechanismPhysiology: "By separating the shoulders vertically, the overlapping shoulder soft tissue and bone are displaced, creating a window for x-ray penetration through the cervicothoracic junction.",
      clinicalRelevance: "Essential for evaluating the C7-T1 region in patients with large shoulders, muscular habitus, or those who cannot depress their shoulders. Injuries at this transition zone are common and easily missed.",
      signsSymptoms: "Performed when C7-T1 is not demonstrated on the standard lateral cervical spine projection.",
      assessment: "C7 and T1 vertebral bodies clearly visible with open disc space between them, humeri separated and not superimposed over the vertebral bodies, adequate penetration.",
      management: "Patient lateral. Arm closest to receptor raised overhead, opposite arm pulled inferiorly. CR directed to C7-T1 with 3-5° caudad angle. Use a breathing technique (long exposure during quiet breathing) to blur ribs and lung tissue.",
      complications: "Difficulty positioning in trauma patients. Breathing technique requires long exposure times. Arm elevation may be limited by injury. Motion artifact if patient cannot cooperate.",
      clinicalPearls: [
        { text: "Breathing technique (3-4 second exposure during quiet breathing) blurs ribs and lungs, improving vertebral visibility." },
        { text: "The arm closest to the image receptor is raised overhead." }
      ],
      examPitfalls: [
        { text: "Raising the wrong arm—the arm closest to the image receptor should be raised." },
        { text: "Not using breathing technique, resulting in rib superimposition over the C7-T1 junction." }
      ],
      faqJson: [
        { question: "When is a swimmer's lateral view needed?", answer: "When the standard lateral cervical spine fails to demonstrate C7 and T1 due to shoulder superimposition. This commonly occurs in patients with large or muscular shoulders." },
        { question: "What is the breathing technique in radiography?", answer: "A long exposure time (3-4 seconds) during quiet breathing. Patient breathing causes ribs and lung markings to blur, while the stationary spine remains sharp, improving vertebral visualization." }
      ]
    }
  ];

  positioning.forEach(e => entries.push({ ...e, category: "Radiographic Positioning" }));

  // =====================================================
  // CATEGORY 2: Radiation Physics (18 entries)
  // =====================================================
  const physics: Omit<EncyclopediaEntry, "category">[] = [
    {
      slug: "x-ray-production-and-tube-design",
      title: "X-ray Production and Tube Design",
      seoTitle: "X-ray Production & Tube Design | Radiation Physics for ARRT/CAMRT",
      seoDescription: "Comprehensive guide to x-ray production, tube components, and beam generation for ARRT and CAMRT exam preparation.",
      seoKeywords: ["x-ray production", "x-ray tube components", "bremsstrahlung radiation", "characteristic radiation"],
      overview: "X-rays are produced when high-speed electrons are decelerated upon striking a target material. The x-ray tube consists of a cathode (electron source) and anode (target) enclosed in a vacuum glass envelope. Understanding tube design is fundamental to diagnostic radiography.",
      mechanismPhysiology: "Electrons are produced at the cathode by thermionic emission from a heated tungsten filament. They are accelerated across the tube by the applied kVp (kilovoltage peak) and strike the anode target. Two types of x-ray interactions produce the beam: bremsstrahlung (braking radiation, ~80% of beam) occurs when electrons are decelerated by the nuclear field, and characteristic radiation (~20%) occurs when inner shell electrons are ejected and outer electrons fill the vacancy.",
      clinicalRelevance: "Understanding x-ray production allows technologists to manipulate exposure factors for optimal image quality while maintaining patient safety. kVp controls beam energy/penetration, mA controls beam quantity/number of photons.",
      signsSymptoms: "Equipment-based topic—not directly related to patient symptoms. Relevant when troubleshooting image quality issues such as insufficient penetration or excessive patient dose.",
      assessment: "Key parameters: kVp determines beam quality (energy/penetration), mAs (mA × time) determines beam quantity (number of photons), focal spot size affects spatial resolution.",
      management: "Routine quality control includes tube output measurements, focal spot evaluation, half-value layer testing, and beam alignment verification. Tube warm-up procedures prevent thermal shock to the anode.",
      complications: "Tube failure from anode pitting, cracking, or bearing failure. Excessive heat loading can damage the anode or tube housing. Off-focus radiation from electron interactions outside the focal spot degrades image quality.",
      clinicalPearls: [
        { text: "~99% of kinetic energy is converted to heat, only ~1% becomes x-rays." },
        { text: "Bremsstrahlung produces a continuous spectrum; characteristic radiation produces discrete energy peaks." },
        { text: "The tungsten anode has a high atomic number (Z=74) and high melting point (3370°C), making it ideal for x-ray production." }
      ],
      examPitfalls: [
        { text: "Confusing kVp (beam quality/energy) with mAs (beam quantity/number of photons)." },
        { text: "Forgetting that most energy in the x-ray tube is converted to heat, not x-rays." }
      ],
      faqJson: [
        { question: "What are the two types of x-ray production?", answer: "Bremsstrahlung (braking radiation): electrons decelerated by the nuclear field, producing a continuous energy spectrum. Characteristic radiation: inner shell electron ejection with subsequent outer shell electron transition, producing discrete energy peaks specific to the target element." },
        { question: "Why is tungsten used for x-ray tube anodes?", answer: "Tungsten has a high atomic number (Z=74) for efficient x-ray production, a high melting point (3,370°C) to withstand the heat generated, and good thermal conductivity to dissipate heat." }
      ]
    },
    {
      slug: "electromagnetic-spectrum-and-photon-energy",
      title: "Electromagnetic Spectrum and Photon Energy",
      seoTitle: "Electromagnetic Spectrum in Diagnostic Imaging | Physics Guide",
      seoDescription: "Understanding the electromagnetic spectrum and photon energy as it relates to diagnostic radiography for ARRT and CAMRT certification.",
      seoKeywords: ["electromagnetic spectrum", "photon energy", "x-ray wavelength", "radiation physics"],
      overview: "X-rays are a form of electromagnetic radiation with wavelengths between 0.01 and 10 nanometers. They occupy the same spectrum as visible light, radio waves, and gamma rays but have higher energy and shorter wavelengths, enabling them to penetrate body tissues.",
      mechanismPhysiology: "All electromagnetic radiation travels at the speed of light (3 × 10⁸ m/s) in a vacuum. Photon energy is directly proportional to frequency (E = hf) and inversely proportional to wavelength (E = hc/λ). Higher kVp produces higher energy x-ray photons with shorter wavelengths and greater penetrating ability.",
      clinicalRelevance: "The energy of the x-ray beam determines its ability to penetrate different tissues. Higher energy beams penetrate dense structures (bone, contrast media), while lower energy photons are absorbed by soft tissue and contribute to patient dose.",
      signsSymptoms: "Foundational physics concept applicable to understanding image contrast, patient dose, and beam filtration.",
      assessment: "Diagnostic x-ray energies range from approximately 25-150 keV. The effective energy of the beam is typically about one-third to one-half of the peak energy (kVp setting).",
      management: "kVp selection determines the maximum energy of the x-ray beam. Beam filtration removes low-energy photons that would increase patient dose without contributing to the image.",
      complications: "Low-energy photons are completely absorbed by the patient, increasing dose without image formation. Inadequate filtration allows these harmful photons to reach the patient.",
      clinicalPearls: [
        { text: "E = hf — photon energy equals Planck's constant times frequency." },
        { text: "Diagnostic x-rays typically range from 25-150 keV." },
        { text: "Wavelength and frequency are inversely related; energy and frequency are directly related." }
      ],
      examPitfalls: [
        { text: "Confusing wavelength and frequency relationships—shorter wavelength = higher frequency = higher energy." },
        { text: "Not understanding that kVp controls beam QUALITY (energy) while mAs controls QUANTITY." }
      ],
      faqJson: [
        { question: "How are x-rays different from gamma rays?", answer: "X-rays and gamma rays have overlapping energy ranges but differ in origin. X-rays are produced by electron interactions in the x-ray tube, while gamma rays are emitted from the nucleus of radioactive atoms." },
        { question: "What determines the maximum energy of the x-ray beam?", answer: "The kVp (kilovoltage peak) setting determines the maximum photon energy. The maximum photon energy in keV equals the kVp setting (e.g., 80 kVp produces photons with maximum energy of 80 keV)." }
      ]
    },
    {
      slug: "photon-interactions-with-matter",
      title: "Photon Interactions with Matter",
      seoTitle: "X-ray Photon Interactions with Matter | Compton & Photoelectric",
      seoDescription: "Complete guide to x-ray photon interactions including Compton scattering and photoelectric absorption for ARRT and CAMRT exams.",
      seoKeywords: ["Compton scattering", "photoelectric absorption", "x-ray interactions", "photon attenuation"],
      overview: "When x-ray photons interact with matter, five possible interactions can occur. In diagnostic radiology, the two most important are the photoelectric effect and Compton scattering. These interactions determine image contrast, patient dose, and scattered radiation.",
      mechanismPhysiology: "Photoelectric absorption: The incident photon is completely absorbed by an inner shell electron, which is ejected. This interaction depends on atomic number (Z³) and photon energy (1/E³), and is responsible for image contrast. Compton scattering: The incident photon interacts with an outer shell electron, ejecting it and producing a scattered photon with reduced energy. This is the primary source of scattered radiation and is largely independent of atomic number.",
      clinicalRelevance: "Photoelectric effect creates image contrast by differential absorption between tissues. Compton scatter degrades image quality by adding fog to the image and is the primary source of occupational radiation exposure.",
      signsSymptoms: "Physics concept fundamental to understanding image quality, scatter control, and radiation protection.",
      assessment: "Photoelectric absorption predominates at low energies and in high-Z materials (bone, contrast agents). Compton scattering predominates at higher diagnostic energies in soft tissue.",
      management: "Grids are used to reduce scattered radiation reaching the image receptor. Increasing kVp shifts the interaction balance from photoelectric to Compton. Reducing field size reduces scatter production.",
      complications: "Excessive scatter degrades image contrast and increases patient and occupational dose. Over-reliance on photoelectric effect (low kVp) increases patient dose.",
      clinicalPearls: [
        { text: "Photoelectric effect is proportional to Z³/E³—it increases dramatically with atomic number and decreases with energy." },
        { text: "Compton scattering is the PRIMARY source of occupational exposure and image fog." },
        { text: "The crossover from photoelectric-dominant to Compton-dominant interactions occurs around 25-40 keV in soft tissue." }
      ],
      examPitfalls: [
        { text: "Forgetting that Compton scatter is INDEPENDENT of atomic number—it depends on electron density." },
        { text: "Confusing the photoelectric effect (complete absorption, creates contrast) with Compton scatter (partial absorption, creates fog)." }
      ],
      faqJson: [
        { question: "What is the difference between Compton scatter and the photoelectric effect?", answer: "Photoelectric: complete photon absorption, inner shell electron ejected, no scattered photon produced. Creates radiographic contrast. Depends on Z³. Compton: partial photon absorption, outer shell electron ejected, scattered photon produced at reduced energy and altered direction. Creates image fog. Independent of atomic number." },
        { question: "Why does increasing kVp decrease image contrast?", answer: "Higher kVp shifts more interactions from photoelectric (which creates contrast) to Compton (which produces scatter/fog). The reduced differential absorption between tissues decreases contrast." }
      ]
    },
    {
      slug: "beam-filtration-and-half-value-layer",
      title: "Beam Filtration and Half-Value Layer",
      seoTitle: "X-ray Beam Filtration & Half-Value Layer | HVL Explained",
      seoDescription: "Understanding beam filtration and half-value layer (HVL) in diagnostic radiography for ARRT and CAMRT certification exams.",
      seoKeywords: ["beam filtration", "half-value layer", "HVL", "aluminum filtration", "x-ray beam quality"],
      overview: "Beam filtration is the process of removing low-energy photons from the x-ray beam to reduce patient dose without significantly affecting image quality. The half-value layer (HVL) is the thickness of material needed to reduce beam intensity by 50%, serving as a measure of beam quality.",
      mechanismPhysiology: "Inherent filtration comes from the glass envelope, tube oil, and housing (typically equivalent to 0.5-1.0 mm Al). Added filtration (aluminum or copper sheets) is placed at the tube port. Together they form total filtration. The minimum total filtration for tubes operating above 70 kVp is 2.5 mm Al equivalent.",
      clinicalRelevance: "Proper filtration reduces patient skin dose by removing photons that would be absorbed by the skin without contributing to the image. HVL testing verifies beam quality and tube filtration adequacy during quality control.",
      signsSymptoms: "Quality control concept. Inadequate filtration manifests as excessive patient entrance skin dose and potentially increased skin reactions.",
      assessment: "HVL is measured using aluminum attenuators and an ionization chamber. For diagnostic radiography, HVL typically ranges from 2.5-5.0 mm Al depending on kVp. Minimum total filtration: 2.5 mm Al equivalent above 70 kVp.",
      management: "Added filtration is placed at the x-ray tube port. HVL is measured during annual quality control. Compensating filters (wedge, trough) are used for body part thickness compensation.",
      complications: "Insufficient filtration increases patient dose. Excessive filtration reduces beam output, requiring higher technique factors. HVL outside acceptable range indicates a filtration or tube problem.",
      clinicalPearls: [
        { text: "Minimum total filtration is 2.5 mm Al equivalent for tubes operating above 70 kVp." },
        { text: "HVL measures beam quality (penetrating ability), not quantity." },
        { text: "Adding filtration hardens the beam (increases average energy) but does NOT change the maximum energy." }
      ],
      examPitfalls: [
        { text: "Confusing HVL with beam quantity—HVL is a measure of beam quality (penetrating ability)." },
        { text: "Thinking that filtration changes the maximum energy of the beam—it only affects the average energy." }
      ],
      faqJson: [
        { question: "What is the minimum total filtration for diagnostic x-ray tubes?", answer: "2.5 mm aluminum equivalent for x-ray tubes operating above 70 kVp. Below 50 kVp, the minimum is 0.5 mm Al; between 50-70 kVp, the minimum is 1.5 mm Al." },
        { question: "What does HVL measure?", answer: "HVL (Half-Value Layer) is the thickness of absorbing material (usually aluminum) required to reduce x-ray beam intensity to 50% of its original value. It is a measure of beam quality or penetrating ability—higher HVL means a more penetrating beam." }
      ]
    },
    {
      slug: "inverse-square-law",
      title: "Inverse Square Law",
      seoTitle: "Inverse Square Law in Radiography | Radiation Physics Explained",
      seoDescription: "Understanding the inverse square law and its application to radiation intensity, exposure calculations, and radiation safety for ARRT/CAMRT exams.",
      seoKeywords: ["inverse square law", "radiation intensity", "distance and radiation", "SID calculations"],
      overview: "The inverse square law states that radiation intensity is inversely proportional to the square of the distance from the source (I₁/I₂ = D₂²/D₁²). This fundamental physics law governs radiation intensity changes with distance and is essential for exposure calculations and radiation safety.",
      mechanismPhysiology: "As x-rays diverge from a point source, they spread over an increasingly larger area proportional to the square of the distance. Doubling the distance spreads the beam over 4 times the area, reducing intensity to 1/4. Tripling the distance reduces intensity to 1/9.",
      clinicalRelevance: "Used to calculate exposure changes when SID changes, determine safe working distances for radiation workers, and understand penumbra and magnification effects.",
      signsSymptoms: "Applied in technical factor compensation when SID changes and in radiation protection distance calculations.",
      assessment: "Formula: I₁/I₂ = D₂²/D₁². If distance doubles, intensity decreases by a factor of 4. If distance triples, intensity decreases by a factor of 9.",
      management: "When changing SID, mAs must be adjusted proportionally to maintain receptor exposure. The density maintenance formula: new mAs = old mAs × (new SID² / old SID²).",
      complications: "Failure to compensate for distance changes results in over- or under-exposure. Distance is the most practical radiation protection measure for healthcare workers.",
      clinicalPearls: [
        { text: "Doubling the distance reduces radiation to 1/4; tripling reduces it to 1/9." },
        { text: "The inverse square law is the foundation of distance as a radiation protection measure." },
        { text: "Density maintenance formula: new mAs = old mAs × (new SID²/old SID²)." }
      ],
      examPitfalls: [
        { text: "Forgetting to SQUARE the distance ratio in calculations." },
        { text: "Confusing direct and inverse relationships—intensity decreases as distance increases." }
      ],
      faqJson: [
        { question: "How does doubling the SID affect radiation intensity?", answer: "Doubling the SID reduces intensity to one-fourth (1/4) of the original intensity, according to the inverse square law. To maintain the same receptor exposure, mAs must be increased by a factor of 4." },
        { question: "Why is distance the best radiation protection tool?", answer: "According to the inverse square law, small increases in distance produce significant decreases in radiation exposure. Doubling your distance from a radiation source reduces your exposure to 25% of the original. Distance is practical, free, and always available." }
      ]
    },
    {
      slug: "kvp-and-mas-relationships",
      title: "kVp and mAs Relationships",
      seoTitle: "kVp and mAs Exposure Factors | Radiographic Technique Guide",
      seoDescription: "Understanding kVp and mAs relationships in radiographic technique, including the 15% rule and exposure factor adjustments for ARRT/CAMRT exams.",
      seoKeywords: ["kVp mAs relationship", "15 percent rule", "exposure factors", "radiographic technique"],
      overview: "kVp (kilovoltage peak) and mAs (milliampere-seconds) are the two primary exposure factors in radiography. kVp controls beam quality (energy/penetration) and significantly affects image contrast. mAs controls beam quantity (number of photons) and primarily affects image density/brightness.",
      mechanismPhysiology: "kVp determines the maximum energy of x-ray photons and the overall energy spectrum of the beam. It affects penetration, contrast, and scatter production. mAs (milliamperes × exposure time) determines the total number of photons produced. Doubling mAs doubles the number of photons and doubles the receptor exposure.",
      clinicalRelevance: "Proper selection of kVp and mAs is essential for producing diagnostic images with appropriate density and contrast while minimizing patient dose. The 15% rule allows adjustment between kVp and mAs.",
      signsSymptoms: "Technique selection applies to every radiographic examination. Improper technique results in non-diagnostic images requiring repeat exposures.",
      assessment: "The 15% rule: Increasing kVp by 15% has the same effect on receptor exposure as doubling the mAs. Conversely, decreasing kVp by 15% has the same effect as halving the mAs.",
      management: "Technique charts provide standardized kVp and mAs values for body part thickness and pathology. Automatic exposure control (AEC) adjusts mAs automatically for consistent receptor exposure.",
      complications: "Excessive kVp reduces contrast. Insufficient kVp produces underpenetrated images. Excessive mAs increases patient dose. Insufficient mAs produces quantum mottle (noise).",
      clinicalPearls: [
        { text: "The 15% rule: ↑15% kVp = doubling mAs effect; ↓15% kVp = halving mAs effect." },
        { text: "kVp affects contrast: higher kVp = lower contrast (more gray tones); lower kVp = higher contrast." },
        { text: "mAs is directly proportional to patient dose—doubling mAs doubles the dose." }
      ],
      examPitfalls: [
        { text: "Confusing the effects of kVp (quality, contrast, penetration) with mAs (quantity, density, dose)." },
        { text: "Applying the 15% rule incorrectly—it's a 15% CHANGE in kVp, not 15 kVp added." }
      ],
      faqJson: [
        { question: "What is the 15% rule in radiography?", answer: "Increasing kVp by 15% of the original value has the equivalent effect on receptor exposure as doubling the mAs. For example, if the original technique is 80 kVp at 10 mAs, increasing to 92 kVp (80 × 1.15) allows reducing mAs to 5 while maintaining similar exposure." },
        { question: "How does kVp affect image contrast?", answer: "Higher kVp decreases contrast (producing more gray tones—long-scale/low contrast) because it shifts more interactions from photoelectric (which creates contrast) to Compton scatter. Lower kVp increases contrast (producing more black-and-white—short-scale/high contrast)." }
      ]
    },
    {
      slug: "anode-heel-effect",
      title: "Anode Heel Effect",
      seoTitle: "Anode Heel Effect in Radiography | Beam Intensity Distribution",
      seoDescription: "Understanding the anode heel effect, its clinical applications, and positioning strategies for uniform density in diagnostic radiography.",
      seoKeywords: ["anode heel effect", "beam intensity distribution", "x-ray tube anode", "cathode side placement"],
      overview: "The anode heel effect describes the non-uniform intensity distribution across the x-ray beam due to self-absorption of x-rays within the anode. Radiation intensity is greater on the cathode side and less on the anode side of the beam.",
      mechanismPhysiology: "X-rays produced within the angled anode target must travel through varying thicknesses of target material to exit. Photons directed toward the anode side travel through more target material and are partially absorbed, reducing intensity. The effect is more pronounced with steeper anode angles and shorter SIDs.",
      clinicalRelevance: "Used clinically by placing the thicker body part toward the cathode side (higher intensity) and the thinner part toward the anode side, producing more uniform density across the image.",
      signsSymptoms: "Applicable whenever imaging body parts with significant thickness variation (thorax, femur, foot).",
      assessment: "Intensity variation can be 30% or more from cathode to anode side. Smaller anode angles produce more pronounced heel effect. Larger SID and smaller field size reduce the visible effect.",
      management: "Patient positioning: thick part toward cathode, thin part toward anode. Example: for AP thoracic spine, place the head (thinner) at the anode end and the abdomen (thicker) at the cathode end.",
      complications: "Failure to utilize the heel effect can result in uneven density across the image. Over-collimation at the anode end may cause insufficient coverage.",
      clinicalPearls: [
        { text: "Cathode = thicker body part; Anode = thinner body part (CAT mnemonic: Cathode-Anode-Thin)." },
        { text: "The heel effect is more pronounced with smaller anode angles and shorter SIDs." },
        { text: "For a chest x-ray, the cathode should be toward the mediastinum (thicker) end." }
      ],
      examPitfalls: [
        { text: "Placing the thick body part toward the anode (wrong side)—thick goes toward cathode." },
        { text: "Not recognizing that the heel effect is more significant at shorter SIDs." }
      ],
      faqJson: [
        { question: "What is the anode heel effect?", answer: "The anode heel effect is the variation in x-ray beam intensity along the tube axis. Intensity is higher on the cathode side and lower on the anode side because x-rays are partially absorbed by the anode target material as they exit." },
        { question: "How is the anode heel effect used clinically?", answer: "The thicker body part is positioned toward the cathode side (higher intensity) and the thinner part toward the anode side (lower intensity). This compensates for the thickness difference and produces more uniform image density." }
      ]
    },
    {
      slug: "grid-function-and-selection",
      title: "Grid Function and Selection",
      seoTitle: "Radiographic Grids: Function, Types & Selection | Physics Guide",
      seoDescription: "Comprehensive guide to radiographic grid function, types, ratios, and selection criteria for scatter control in diagnostic imaging.",
      seoKeywords: ["radiographic grid", "grid ratio", "scatter control", "anti-scatter grid", "Bucky grid"],
      overview: "Radiographic grids are devices placed between the patient and image receptor to absorb scattered radiation, thereby improving image contrast. They consist of thin lead strips separated by interspaces of aluminum, fiber, or air.",
      mechanismPhysiology: "Grids preferentially absorb scattered photons traveling at oblique angles while transmitting primary beam photons traveling in a more perpendicular direction. Grid ratio (height of lead strips / interspace width) determines scatter cleanup efficiency. Higher grid ratios provide better cleanup but require more exposure (higher patient dose).",
      clinicalRelevance: "Grids are used when body part thickness exceeds 10-12 cm, as scatter production increases with tissue volume. They are essential for maintaining image contrast in abdominal, spinal, and other trunk imaging.",
      signsSymptoms: "Quality issue—grids are applied when scatter degrades image contrast. Not used for extremity imaging (thin body parts produce minimal scatter).",
      assessment: "Grid ratios: 5:1 to 16:1 (higher = better cleanup, more dose). Grid frequency: 60-110 lines/cm. Grid types: parallel (stationary), focused, crossed, moving (Bucky).",
      management: "Bucky factor (grid conversion factor): the factor by which mAs must be increased when adding a grid. A 12:1 grid has a Bucky factor of approximately 5, meaning 5× more mAs is needed.",
      complications: "Grid cutoff occurs when the grid is not properly aligned: off-center (lateral decentering), off-focus (wrong SID for focused grid), off-level (tilted grid), or upside-down focused grid (peripheral cutoff).",
      clinicalPearls: [
        { text: "Grids are typically used when body part thickness exceeds 10-12 cm." },
        { text: "Grid conversion factors: No grid (1), 5:1 (2), 6:1 (3), 8:1 (4), 12:1 (5), 16:1 (6)." },
        { text: "An upside-down focused grid produces severe peripheral cutoff with a clear central strip." }
      ],
      examPitfalls: [
        { text: "Forgetting to increase mAs when adding a grid, resulting in an underexposed image." },
        { text: "Placing a focused grid upside down—produces characteristic peripheral cutoff." }
      ],
      faqJson: [
        { question: "When should a grid be used?", answer: "Grids should be used when the body part being imaged is greater than 10-12 cm in thickness, as larger tissue volumes produce more scatter radiation that degrades image contrast." },
        { question: "What is grid cutoff?", answer: "Grid cutoff is the unwanted absorption of primary (useful) beam photons by the grid, resulting in reduced image density. It occurs from lateral decentering, incorrect SID (off-focus), tilted grid (off-level), or inverted focused grid." }
      ]
    },
    {
      slug: "magnification-and-distortion",
      title: "Magnification and Distortion in Radiography",
      seoTitle: "Radiographic Magnification & Distortion | Image Quality Factors",
      seoDescription: "Understanding magnification, size distortion, and shape distortion in radiographic imaging for ARRT and CAMRT certification.",
      seoKeywords: ["radiographic magnification", "size distortion", "shape distortion", "OID", "SID"],
      overview: "All radiographic images exhibit some degree of magnification because x-rays diverge from a point source. Magnification and distortion are geometric properties of the image affected by SID, OID, focal spot size, and central ray alignment.",
      mechanismPhysiology: "Magnification factor (MF) = SID / SOD, where SOD = SID - OID. Increasing OID increases magnification. Increasing SID decreases magnification. Shape distortion occurs when the body part, CR, and image receptor are not properly aligned (elongation or foreshortening).",
      clinicalRelevance: "Accurate size representation is critical for treatment planning (orthopedic templating, cardiac measurements). Distortion can mimic or obscure pathology.",
      signsSymptoms: "Magnification and distortion affect every radiographic image. Controlled magnification is used intentionally in angiography.",
      assessment: "MF = SID / (SID - OID). Objects closer to the tube (farther from receptor) are more magnified. Elongation: tube or body part angled along the long axis. Foreshortening: body part angled but CR perpendicular.",
      management: "Minimize magnification: increase SID, decrease OID. Reduce distortion: align CR perpendicular to both body part and image receptor. Use small focal spot for magnification studies.",
      complications: "Magnification reduces spatial resolution due to increased penumbra (geometric unsharpness). PA chest minimizes heart magnification; AP chest magnifies it.",
      clinicalPearls: [
        { text: "MF = SID/(SID-OID). Objects farther from the receptor appear more magnified." },
        { text: "Elongation occurs when the tube or part is angled; foreshortening when only the part is angled." },
        { text: "Small focal spot is required for intentional magnification radiography to maintain resolution." }
      ],
      examPitfalls: [
        { text: "Confusing elongation with foreshortening—elongation makes the part appear longer, foreshortening makes it appear shorter." },
        { text: "Forgetting that magnification increases penumbra (geometric unsharpness)." }
      ],
      faqJson: [
        { question: "How do you minimize magnification?", answer: "Minimize magnification by maximizing SID (move tube farther away) and minimizing OID (place part as close to the image receptor as possible). This is why PA chest uses 72-inch SID and places the chest against the receptor." },
        { question: "What is the difference between elongation and foreshortening?", answer: "Elongation: the image of the body part appears longer than actual—caused by angling the tube or the body part relative to the receptor. Foreshortening: the image appears shorter than actual—caused by the body part being angled while the CR remains perpendicular to the receptor." }
      ]
    },
    {
      slug: "beam-restriction-and-collimation",
      title: "Beam Restriction and Collimation",
      seoTitle: "X-ray Beam Restriction & Collimation | Scatter Control Guide",
      seoDescription: "Understanding beam restriction devices including collimators, cones, and their role in scatter reduction and patient dose for ARRT and CAMRT exams.",
      seoKeywords: ["beam collimation", "x-ray restriction", "collimator", "scatter reduction", "field size"],
      overview: "Beam restriction (collimation) limits the x-ray field size to the area of clinical interest. This is the most effective method of reducing scatter radiation and is also critical for reducing patient dose by limiting the volume of tissue irradiated.",
      mechanismPhysiology: "Restricting the field size reduces the volume of tissue irradiated, which directly reduces scatter radiation production. Less scatter improves image contrast and reduces occupational exposure. Collimators use lead shutters to create a rectangular field adjustable in both dimensions.",
      clinicalRelevance: "Proper collimation is the single most important factor the technologist controls for scatter reduction, dose reduction, and image quality improvement. Tight collimation to the area of interest is a professional responsibility.",
      signsSymptoms: "Every radiographic exposure requires appropriate collimation. Over-collimation may cut off anatomy; under-collimation increases dose and scatter.",
      assessment: "Collimation should be visible on the image as unexposed borders. The light field must accurately represent the x-ray field (± 2% of SID). Positive beam limitation (PBL) automatically adjusts the collimator to the receptor size.",
      management: "Manually adjust the collimator to include only the area of clinical interest. Verify light field alignment during QC. Types of beam restrictors: variable aperture collimator (most common), cones/cylinders, diaphragms.",
      complications: "Failure to collimate increases patient dose, reduces image contrast, and increases occupational exposure from scatter. Over-collimation may clip essential anatomy requiring repeat exposure.",
      clinicalPearls: [
        { text: "Collimation is the MOST effective method of reducing scatter radiation." },
        { text: "Reducing field size reduces patient dose, scatter, and occupational exposure simultaneously." },
        { text: "Light field to x-ray field accuracy must be within ± 2% of SID." }
      ],
      examPitfalls: [
        { text: "Thinking grids are more effective than collimation for scatter control—collimation PREVENTS scatter; grids only REMOVE it after it's produced." },
        { text: "Not recognizing that collimation affects both dose AND image quality." }
      ],
      faqJson: [
        { question: "Why is collimation the most important scatter control method?", answer: "Collimation prevents scatter from being produced in the first place by reducing the irradiated tissue volume. Other methods like grids only remove scatter after it has already been produced and after the patient has already received the dose." },
        { question: "What is positive beam limitation (PBL)?", answer: "PBL is an automatic collimation system that adjusts the collimator shutters to match the size of the image receptor placed in the Bucky tray, ensuring the x-ray field does not exceed the receptor size." }
      ]
    },
    {
      slug: "attenuation-and-absorption",
      title: "X-ray Attenuation and Absorption",
      seoTitle: "X-ray Attenuation & Absorption in Tissue | Radiographic Physics",
      seoDescription: "Understanding x-ray attenuation, absorption, and transmission through body tissues for ARRT and CAMRT certification preparation.",
      seoKeywords: ["x-ray attenuation", "radiation absorption", "tissue attenuation", "linear attenuation coefficient"],
      overview: "Attenuation is the reduction in x-ray beam intensity as it passes through matter. It results from absorption (photoelectric effect) and scattering (Compton effect). Different tissues attenuate x-rays differently, creating the contrast seen in radiographic images.",
      mechanismPhysiology: "Attenuation depends on tissue thickness, density, atomic number, and photon energy. The linear attenuation coefficient (μ) quantifies the probability of interaction per unit length. Higher Z and density increase attenuation; higher energy decreases it.",
      clinicalRelevance: "Differential attenuation between tissues creates radiographic contrast. Bone (high Z, dense) attenuates more than soft tissue, which attenuates more than air-filled structures, creating the familiar radiographic image.",
      signsSymptoms: "Fundamental physics principle underlying all radiographic imaging. Understanding attenuation is key to technique selection and image interpretation.",
      assessment: "The four basic radiographic densities in order of decreasing attenuation: metal/contrast > bone > soft tissue/fluid > fat > air/gas. Each appears progressively darker on the radiograph.",
      management: "kVp selection must provide adequate penetration of the body part. Insufficient kVp results in no photons reaching the receptor through dense structures. Excessive kVp over-penetrates, reducing contrast.",
      complications: "Under-penetration produces blank (white) areas where no information is captured. Over-penetration reduces contrast between structures. Pathology changes tissue attenuation (calcification increases it; destruction decreases it).",
      clinicalPearls: [
        { text: "Five radiographic densities from most to least attenuating: metal, bone, water/soft tissue, fat, air." },
        { text: "Attenuation is proportional to Z³ for photoelectric interactions—bone (Z≈13.8) attenuates much more than soft tissue (Z≈7.4)." },
        { text: "Increasing kVp decreases attenuation differences between tissues, reducing contrast." }
      ],
      examPitfalls: [
        { text: "Confusing absorption with attenuation—absorption is one component of attenuation; scatter is the other." },
        { text: "Not recognizing that attenuation decreases as photon energy increases." }
      ],
      faqJson: [
        { question: "What factors affect x-ray attenuation?", answer: "Four main factors: (1) atomic number of the tissue, (2) tissue density, (3) tissue thickness, and (4) photon energy. Higher Z, density, and thickness increase attenuation; higher energy decreases it." },
        { question: "What are the five radiographic densities?", answer: "From most to least attenuating (lightest to darkest on film): metal/contrast media, bone, water/soft tissue, fat, and air/gas. These create the grayscale appearance of radiographic images." }
      ]
    },
    {
      slug: "focal-spot-and-spatial-resolution",
      title: "Focal Spot Size and Spatial Resolution",
      seoTitle: "Focal Spot Size & Spatial Resolution | Radiographic Image Quality",
      seoDescription: "Understanding focal spot size effects on spatial resolution, penumbra, and image sharpness in diagnostic radiography.",
      seoKeywords: ["focal spot size", "spatial resolution", "penumbra", "geometric unsharpness", "line pairs per mm"],
      overview: "The focal spot is the area on the anode target where electrons strike and x-rays are produced. Its size directly affects spatial resolution and geometric sharpness of the radiographic image. Smaller focal spots produce sharper images but have limited heat capacity.",
      mechanismPhysiology: "X-rays are produced from a finite area (focal spot), not a point source. This creates geometric unsharpness (penumbra) at the edges of anatomical structures. The actual focal spot is larger than the effective (projected) focal spot due to the line focus principle. The anode angle determines the relationship between actual and effective focal spot sizes.",
      clinicalRelevance: "Small focal spot (0.6 mm or less) is used for detail studies (extremities, magnification). Large focal spot (1.0-1.2 mm) is used for high-output studies (abdomen, spine) where heat loading is a concern.",
      signsSymptoms: "Image sharpness directly affected. Blurred edges indicate poor spatial resolution, which can be caused by large focal spot, excessive magnification, or motion.",
      assessment: "Spatial resolution measured in line pairs per millimeter (lp/mm). Typical digital radiography systems resolve 2.5-5 lp/mm. Penumbra (geometric unsharpness) = effective focal spot × OID / SOD.",
      management: "Select small focal spot for detail work and magnification radiography. Use large focal spot when high mA stations are needed for short exposure times. The line focus principle allows a larger actual focal spot (better heat dissipation) while maintaining a small effective focal spot.",
      complications: "Small focal spot limits maximum mA and may require longer exposure times, increasing motion blur risk. Focal spot blooming (enlargement under high load) degrades resolution during high-output studies.",
      clinicalPearls: [
        { text: "Penumbra = focal spot size × OID / SOD. Minimize penumbra by using small focal spot, decreasing OID, and increasing SID." },
        { text: "The line focus principle: a steep anode angle produces a smaller effective focal spot but limits field coverage." },
        { text: "Focal spot blooming occurs at high mA settings, increasing effective focal spot size." }
      ],
      examPitfalls: [
        { text: "Confusing actual and effective focal spot—the effective (projected) focal spot is always smaller due to the anode angle." },
        { text: "Forgetting that small focal spot limits maximum mA output." }
      ],
      faqJson: [
        { question: "What is the line focus principle?", answer: "The line focus principle uses an angled anode target to create an effective focal spot that is smaller than the actual focal spot. The steep anode angle (typically 7-20°) projects a smaller focal spot toward the patient while maintaining a larger area for heat distribution on the anode." },
        { question: "How does focal spot size affect image quality?", answer: "Smaller focal spots produce less geometric unsharpness (penumbra), resulting in sharper image edges and better spatial resolution. However, smaller focal spots limit the maximum tube current (mA) due to reduced heat capacity." }
      ]
    },
    {
      slug: "automatic-exposure-control",
      title: "Automatic Exposure Control (AEC)",
      seoTitle: "Automatic Exposure Control (AEC) in Radiography | Complete Guide",
      seoDescription: "Comprehensive guide to AEC (phototimer) systems in radiography including ionization chambers, detector selection, and backup time for ARRT/CAMRT exams.",
      seoKeywords: ["automatic exposure control", "AEC", "phototimer", "ionization chamber", "backup time"],
      overview: "Automatic Exposure Control (AEC) systems automatically terminate the x-ray exposure when sufficient radiation has reached the image receptor to produce a diagnostic image. They use radiation detectors (ionization chambers) positioned behind the image receptor or within the receptor.",
      mechanismPhysiology: "AEC detectors measure the radiation transmitted through the patient and reaching the receptor. When a predetermined amount of radiation is detected, the exposure is automatically terminated. The technologist selects the appropriate detector(s) and sets kVp, while the AEC controls the exposure time (mAs).",
      clinicalRelevance: "AEC provides consistent image density regardless of patient size variations, reducing repeat rates and ensuring diagnostic quality. Proper detector selection is critical—the detector must be positioned behind the area of clinical interest.",
      signsSymptoms: "AEC issues manifest as images that are consistently too light or too dark, indicating detector selection, density control, or calibration problems.",
      assessment: "Three detector positions are typically available: center and two lateral chambers. The density control allows fine adjustment (±1 to ±3 stops). Backup time prevents excessive exposure if AEC fails or is misused.",
      management: "Select the detector(s) under the anatomy of interest. Set appropriate kVp for the body part. Ensure the body part is properly positioned over the selected detector(s). Set a backup time (typically 150% of the expected manual technique).",
      complications: "Wrong detector selection results in incorrect exposure (e.g., selecting lateral chambers for a chest x-ray may result in overexposure because less tissue is over those detectors). Object placed over the detector (lead marker, arm) causes premature termination or overexposure.",
      clinicalPearls: [
        { text: "The technologist selects kVp and the detector; the AEC controls the mAs." },
        { text: "Backup time is a safety feature—set it at approximately 150% of the expected manual mAs." },
        { text: "For PA chest, the two lateral detectors are typically selected (positioned over the lung fields)." }
      ],
      examPitfalls: [
        { text: "Thinking AEC controls kVp—it only controls mAs (exposure duration). The technologist always selects kVp." },
        { text: "Not understanding that minimum response time may cause overexposure in very small patients." }
      ],
      faqJson: [
        { question: "What does the technologist control when using AEC?", answer: "The technologist selects: kVp, the appropriate detector chamber(s), density control setting, focal spot size, and backup time. The AEC system controls the exposure duration (mAs)." },
        { question: "What is backup time?", answer: "Backup time is a safety mechanism that terminates the exposure after a preset maximum time, regardless of AEC detector readings. It prevents excessive patient exposure if the AEC malfunctions or is improperly used. Typically set at 150% of the expected manual technique." }
      ]
    },
    {
      slug: "heat-units-and-tube-rating",
      title: "Heat Units and Tube Rating Charts",
      seoTitle: "X-ray Tube Heat Units & Rating Charts | Equipment Guide",
      seoDescription: "Understanding heat unit calculations, tube rating charts, anode cooling curves, and safe tube operation for ARRT and CAMRT certification.",
      seoKeywords: ["heat units", "tube rating chart", "anode cooling", "tube loading", "thermal capacity"],
      overview: "X-ray tubes generate tremendous heat during operation, with approximately 99% of electron kinetic energy converted to thermal energy. Understanding heat units, tube rating charts, and cooling characteristics is essential for safe tube operation and preventing tube damage.",
      mechanismPhysiology: "Heat Units (HU) = kVp × mA × time × generator factor (1.0 for single phase, 1.35 for 3-phase/6-pulse, 1.41 for 3-phase/12-pulse, 1.45 for high-frequency). The rotating anode distributes heat over a larger area than a stationary target. Anode heat storage capacity is typically 300,000-400,000 HU.",
      clinicalRelevance: "Exceeding tube heat capacity causes anode damage (pitting, cracking, warping), resulting in reduced image quality and potentially costly tube replacement.",
      signsSymptoms: "Tube damage manifests as reduced output, irregular beam intensity, anode noise (bearing failure), or visible anode pitting on focal spot images.",
      assessment: "Tube rating charts indicate the maximum allowable exposure for given combinations of kVp, mA, and exposure time. Anode cooling charts show the rate of heat dissipation. Housing cooling charts indicate ambient heat capacity.",
      management: "Consult tube rating charts before high-heat procedures (angiography, fluoroscopy). Follow warm-up procedures after prolonged inactivity. Allow adequate cooling between exposures during serial imaging.",
      complications: "Anode pitting from localized overheating. Cracked anode from thermal stress. Bearing failure from excessive heat. Rotor failure from repeated starts under load.",
      clinicalPearls: [
        { text: "HU = kVp × mAs × generator factor. High-frequency generators have a factor of 1.45." },
        { text: "The rotating anode spreads heat over a larger area—1,000× more heat capacity than a stationary anode." },
        { text: "Always warm up the tube after extended periods of inactivity to prevent thermal shock." }
      ],
      examPitfalls: [
        { text: "Forgetting to include the generator factor in heat unit calculations." },
        { text: "Confusing single-exposure tube rating with anode heat storage capacity—they are different charts." }
      ],
      faqJson: [
        { question: "How are heat units calculated?", answer: "Heat Units = kVp × mA × exposure time × generator factor. Generator factors: single-phase = 1.0, three-phase 6-pulse = 1.35, three-phase 12-pulse = 1.41, high-frequency = 1.45." },
        { question: "Why is the anode rotated?", answer: "Rotating the anode distributes the electron bombardment over a much larger area (the focal track), allowing approximately 1,000 times more heat dissipation compared to a stationary anode. This enables higher tube outputs and shorter exposure times." }
      ]
    },
    {
      slug: "scatter-radiation-and-contrast",
      title: "Scatter Radiation and Image Contrast",
      seoTitle: "Scatter Radiation & Radiographic Contrast | Image Quality Guide",
      seoDescription: "Understanding how scatter radiation affects image contrast and methods for scatter control in diagnostic radiography for ARRT/CAMRT exams.",
      seoKeywords: ["scatter radiation", "image contrast", "contrast resolution", "scatter control methods"],
      overview: "Scatter radiation is the primary factor degrading radiographic image contrast. It adds a uniform fog to the image, reducing the difference between light and dark areas. Scatter is produced by Compton interactions in the patient and increases with field size, kVp, and patient thickness.",
      mechanismPhysiology: "When primary beam photons undergo Compton interactions in the patient, scattered photons are produced traveling in altered directions. These scattered photons reach the image receptor at random locations, adding unwanted exposure (fog) that reduces image contrast.",
      clinicalRelevance: "Scatter control is essential for maintaining diagnostic image quality. Without scatter control measures, large body parts would produce images with severely degraded contrast, making pathology detection difficult.",
      signsSymptoms: "Images with excessive scatter appear foggy or gray, with reduced contrast between anatomical structures. The overall image appears too bright/overexposed with poor tissue differentiation.",
      assessment: "Factors increasing scatter: larger field size, higher kVp, greater patient thickness, higher tissue density. Scatter can represent 50-90% of the total radiation reaching the receptor for abdominal imaging without a grid.",
      management: "Scatter control methods in order of importance: (1) Collimation—reduces irradiated volume, (2) Grids—absorb scatter before it reaches the receptor, (3) Air gap technique—scatter misses receptor due to distance, (4) Optimal kVp selection.",
      complications: "Excessive scatter masks pathology, increases patient dose (no diagnostic benefit), and increases occupational exposure. Insufficient scatter control leads to non-diagnostic images requiring repeats.",
      clinicalPearls: [
        { text: "Collimation is the MOST effective scatter control method because it prevents scatter production." },
        { text: "Scatter increases with field size, patient thickness, and kVp." },
        { text: "For abdominal imaging without a grid, scatter can represent 80-90% of receptor exposure." }
      ],
      examPitfalls: [
        { text: "Thinking grids are the primary scatter control—collimation is more fundamental because it prevents scatter production." },
        { text: "Not recognizing that higher kVp increases scatter production." }
      ],
      faqJson: [
        { question: "What is the most effective method to reduce scatter?", answer: "Collimation (beam restriction) is the most effective method because it reduces the volume of tissue irradiated, thereby preventing scatter production in the first place. Grids are the second line of defense, absorbing scatter after it has been produced." },
        { question: "How does scatter affect image quality?", answer: "Scatter adds a uniform fog to the image that reduces contrast—the difference between adjacent densities. This makes it harder to distinguish between different tissue types and can mask subtle pathology." }
      ]
    },
    {
      slug: "generator-types-and-waveforms",
      title: "X-ray Generator Types and Waveforms",
      seoTitle: "X-ray Generator Types: Single Phase, Three Phase & High Frequency",
      seoDescription: "Comparison of x-ray generator types including single-phase, three-phase, and high-frequency generators and their effects on beam output.",
      seoKeywords: ["x-ray generator", "single phase generator", "three phase generator", "high frequency generator", "voltage waveform"],
      overview: "X-ray generators convert incoming electrical power to the high voltage needed for x-ray production. The type of generator determines the voltage waveform applied to the x-ray tube, which affects beam quality, quantity, and exposure efficiency.",
      mechanismPhysiology: "Single-phase generators produce pulsating DC with 100% voltage ripple, meaning voltage drops to zero between pulses. Three-phase 6-pulse generators have ~13% ripple, and 12-pulse generators have ~4% ripple. High-frequency generators use inverter technology to produce nearly constant potential with <1% ripple.",
      clinicalRelevance: "Lower ripple produces a more efficient beam with higher average energy, allowing shorter exposure times at lower mAs settings. High-frequency generators are standard in modern installations.",
      signsSymptoms: "Generator type affects image quality through beam efficiency. Higher efficiency generators produce more consistent exposures and allow shorter exposure times, reducing motion blur.",
      assessment: "Voltage ripple comparison: single-phase = 100%, 3-phase 6-pulse = 13%, 3-phase 12-pulse = 4%, high-frequency < 1%. Lower ripple = higher average beam energy = more efficient x-ray production.",
      management: "High-frequency generators are preferred for their efficiency, compact size, and consistent output. When switching between generator types, mAs adjustments are needed to maintain receptor exposure.",
      complications: "Single-phase generators produce inefficient beams requiring higher mAs, resulting in higher patient doses and longer exposure times with more motion blur potential.",
      clinicalPearls: [
        { text: "High-frequency generators have < 1% ripple and are the modern standard." },
        { text: "Single-phase generators produce ~2× the patient dose compared to high-frequency for the same image density." },
        { text: "Voltage ripple directly affects beam efficiency—lower ripple = more efficient." }
      ],
      examPitfalls: [
        { text: "Confusing voltage ripple percentages between generator types." },
        { text: "Not understanding that single-phase generators are less efficient and require higher mAs." }
      ],
      faqJson: [
        { question: "What is voltage ripple?", answer: "Voltage ripple is the variation in voltage applied to the x-ray tube during an exposure, expressed as a percentage. 100% ripple (single-phase) means voltage drops to zero between pulses. 0% ripple (ideal constant potential) would mean perfectly steady voltage." },
        { question: "Why are high-frequency generators preferred?", answer: "High-frequency generators produce nearly constant potential (<1% ripple), resulting in higher x-ray output per mAs, shorter exposure times, lower patient dose, more compact size, and better reproducibility of exposures." }
      ]
    },
    {
      slug: "line-focus-principle",
      title: "Line Focus Principle",
      seoTitle: "Line Focus Principle in X-ray Tubes | Anode Angle & Focal Spot",
      seoDescription: "Understanding the line focus principle, anode angles, and their effect on focal spot size and field coverage in diagnostic radiography.",
      seoKeywords: ["line focus principle", "anode angle", "effective focal spot", "actual focal spot"],
      overview: "The line focus principle is a design feature of x-ray tubes that uses an angled anode target to create an effective focal spot that is smaller than the actual focal spot area. This allows a large area for heat dissipation while maintaining a small projected focal spot for image sharpness.",
      mechanismPhysiology: "Electrons strike a rectangular area on the angled anode (the actual focal spot). Due to the anode angle, the projected focal spot (as seen from the patient's perspective) is foreshortened. The effective focal spot size = actual focal spot × sin(anode angle). Typical anode angles range from 7° to 20°.",
      clinicalRelevance: "The line focus principle is essential for achieving both high heat capacity (large actual focal spot for heat distribution) and high spatial resolution (small effective focal spot for sharp images). It represents a fundamental design compromise in x-ray tube engineering.",
      signsSymptoms: "Affects all x-ray imaging—determines the trade-off between tube heat capacity and image resolution.",
      assessment: "Smaller anode angles produce smaller effective focal spots (better resolution) but limit the useful field size due to the heel effect. Typical diagnostic tube angles: 12-17° for general radiography, 7-10° for special procedures.",
      management: "Focal spot selection (large vs. small) is made based on the examination requirements. Small focal spot for detail and magnification work; large focal spot for high-output studies requiring high mA.",
      complications: "Very small anode angles severely limit the usable field size on the anode side. The heel effect becomes more pronounced with smaller angles. Off-focus radiation from outside the focal spot area degrades image quality.",
      clinicalPearls: [
        { text: "Effective focal spot = actual focal spot × sin(anode angle)." },
        { text: "Smaller anode angle = smaller effective focal spot but more heel effect and limited field coverage." },
        { text: "Typical anode angles: 12-17° for general radiography." }
      ],
      examPitfalls: [
        { text: "Confusing actual and effective focal spot sizes—the effective is always smaller." },
        { text: "Not understanding that smaller anode angles increase the heel effect." }
      ],
      faqJson: [
        { question: "What is the relationship between anode angle and effective focal spot?", answer: "Effective focal spot size equals the actual focal spot size multiplied by the sine of the anode angle. A smaller anode angle produces a smaller effective focal spot. For example, a 10° anode with a 2mm actual focal spot produces a 0.35mm effective focal spot." },
        { question: "What is the trade-off of a small anode angle?", answer: "A small anode angle provides a smaller effective focal spot (better resolution) and allows greater heat loading, but it increases the anode heel effect and limits the useful field size at shorter SIDs." }
      ]
    }
  ];

  physics.forEach(e => entries.push({ ...e, category: "Radiation Physics" }));

  // =====================================================
  // CATEGORY 3: Radiation Safety & Protection (15 entries)
  // =====================================================
  const safety: Omit<EncyclopediaEntry, "category">[] = [
    {
      slug: "cardinal-rules-of-radiation-protection",
      title: "Cardinal Rules of Radiation Protection",
      seoTitle: "Cardinal Rules of Radiation Protection | Time, Distance, Shielding",
      seoDescription: "The three cardinal rules of radiation protection: time, distance, and shielding for ARRT and CAMRT exam preparation.",
      seoKeywords: ["radiation protection", "ALARA", "time distance shielding", "radiation safety"],
      overview: "The three cardinal rules of radiation protection—time, distance, and shielding—are the fundamental principles for minimizing radiation exposure to patients, healthcare workers, and the public. These principles form the basis of the ALARA (As Low As Reasonably Achievable) philosophy.",
      mechanismPhysiology: "Time: Reducing exposure time proportionally reduces dose. Distance: The inverse square law means doubling distance reduces exposure to 25%. Shielding: Placing attenuating material (lead, concrete) between the source and the person absorbs radiation.",
      clinicalRelevance: "Every radiologic technologist must apply these principles in daily practice to minimize radiation exposure to themselves, patients, co-workers, and the public.",
      signsSymptoms: "Radiation protection applies continuously in the imaging environment. Elevated personal dosimeter readings indicate inadequate protection practices.",
      assessment: "Monitor occupational exposure with personal dosimeters. Evaluate work practices for time efficiency. Verify shielding integrity through regular inspections. Maintain appropriate working distances.",
      management: "Time: Use efficient technique, avoid unnecessary exposures. Distance: Stand as far from the source as practical, use the inverse square law. Shielding: Wear lead aprons, thyroid shields, and lead glasses as appropriate.",
      complications: "Failure to follow protection principles leads to increased occupational dose, potential long-term stochastic effects (cancer risk), and regulatory violations.",
      clinicalPearls: [
        { text: "ALARA stands for As Low As Reasonably Achievable—the guiding philosophy for all radiation protection." },
        { text: "Distance is usually the most practical and effective protection measure for workers." },
        { text: "Lead aprons must be at least 0.25 mm Pb equivalent (0.5 mm for high-dose procedures)." }
      ],
      examPitfalls: [
        { text: "Thinking shielding is always the primary method—distance is often more practical and effective." },
        { text: "Forgetting that ALARA applies to economic and social considerations, not just dose reduction." }
      ],
      faqJson: [
        { question: "What does ALARA stand for?", answer: "As Low As Reasonably Achievable. It is the guiding principle that radiation exposure should be kept as low as possible, considering economic, social, and practical factors. It goes beyond simply staying below dose limits." },
        { question: "Which cardinal rule is most effective?", answer: "All three work together, but distance is often the most practical and effective for occupational protection because small increases in distance produce significant dose reductions (inverse square law), and it requires no equipment." }
      ]
    },
    {
      slug: "dose-limits-occupational-and-public",
      title: "Dose Limits: Occupational and Public",
      seoTitle: "Radiation Dose Limits for Occupational Workers & Public | ARRT Guide",
      seoDescription: "Current radiation dose limits for occupational workers, the public, and embryo/fetus as defined by NCRP and ICRP for ARRT and CAMRT exams.",
      seoKeywords: ["radiation dose limits", "occupational dose", "NCRP dose limits", "annual dose limit"],
      overview: "Radiation dose limits are established by regulatory bodies (NCRP, ICRP) to limit the risk of stochastic effects from radiation exposure. These limits represent the maximum permissible dose and should not be considered target levels—ALARA always applies.",
      mechanismPhysiology: "Dose limits are based on risk-benefit analysis and epidemiological data, primarily from atomic bomb survivors and occupational studies. They are designed to keep the risk of stochastic effects (cancer, genetic effects) at an acceptably low level.",
      clinicalRelevance: "Radiologic technologists must know and comply with dose limits. Exceeding limits triggers investigation, counseling, and potential work restrictions. Personal dosimetry monitors compliance.",
      signsSymptoms: "Not directly symptom-related. Doses within limits do not produce deterministic effects. Stochastic risk exists at all dose levels but increases with cumulative dose.",
      assessment: "Annual occupational whole-body dose limit: 50 mSv (5 rem). Cumulative lifetime limit: 10 mSv × age in years. Lens of eye: 150 mSv. Skin/extremity: 500 mSv. Public: 1 mSv/year. Embryo/fetus: 5 mSv total gestation (0.5 mSv/month).",
      management: "Wear dosimeters consistently, review dose reports regularly, implement ALARA practices, investigate any readings approaching limits.",
      complications: "Exceeding dose limits requires investigation, potential work reassignment, and regulatory reporting. Chronic low-level exposure increases stochastic risk over a career.",
      clinicalPearls: [
        { text: "Annual occupational whole body dose limit: 50 mSv (5 rem) per NCRP." },
        { text: "Cumulative lifetime dose limit: 10 mSv × age in years." },
        { text: "The embryo/fetus limit is 5 mSv (0.5 rem) for the entire gestation period." },
        { text: "The public dose limit is 1 mSv/year (0.1 rem)." }
      ],
      examPitfalls: [
        { text: "Confusing occupational (50 mSv/year) with public (1 mSv/year) dose limits." },
        { text: "Forgetting the cumulative dose formula: 10 mSv × age." }
      ],
      faqJson: [
        { question: "What is the annual occupational whole body dose limit?", answer: "50 mSv (5 rem) effective dose per year, as recommended by the NCRP. This is the maximum permissible dose—ALARA principles should keep actual doses well below this limit. Most radiologic technologists receive less than 1-2 mSv annually." },
        { question: "What is the dose limit for a pregnant radiation worker?", answer: "5 mSv (0.5 rem) total for the entire gestation period, with a monthly limit of 0.5 mSv (0.05 rem). The pregnancy must be declared voluntarily by the worker for these limits to apply." }
      ]
    },
    {
      slug: "personal-radiation-monitoring-dosimetry",
      title: "Personal Radiation Monitoring (Dosimetry)",
      seoTitle: "Radiation Dosimetry: OSL, TLD & Film Badges | Monitoring Guide",
      seoDescription: "Guide to personal radiation monitoring devices including OSL dosimeters, TLDs, and film badges for occupational dose tracking.",
      seoKeywords: ["radiation dosimetry", "OSL dosimeter", "TLD badge", "personal monitoring", "occupational dose"],
      overview: "Personal radiation monitoring devices measure occupational radiation exposure over time. Common types include optically stimulated luminescence (OSL) dosimeters, thermoluminescent dosimeters (TLDs), and pocket ionization chambers. These devices are essential for demonstrating compliance with dose limits.",
      mechanismPhysiology: "OSL dosimeters use aluminum oxide crystals that store energy from radiation exposure; when stimulated by laser light, they release the energy as luminescence proportional to dose. TLDs use lithium fluoride crystals that release stored energy as light when heated. Film badges use radiation-sensitive film that darkens proportionally to exposure.",
      clinicalRelevance: "Required for all radiation workers who may receive more than 10% of the annual dose limit. Provides a legal record of occupational dose. Results are reported to regulatory agencies.",
      signsSymptoms: "Dosimeters do not produce symptoms—they record cumulative dose for monitoring purposes.",
      assessment: "OSL dosimeters: most common modern type, can be re-read, sensitive to 10 μSv. TLD: accurate, reusable crystals. Film badges: historical standard, largely replaced. All worn at collar level (outside apron) and waist level (under apron) for dual-badge monitoring.",
      management: "Wear the dosimeter consistently during all work involving radiation. Store control badges safely. Return badges promptly for reading. Review dose reports quarterly. Investigate any unexpectedly high readings.",
      complications: "Improper use leads to inaccurate dose records: leaving badges in radiation areas, taking badges home, exposing to heat or light. Failure to wear dosimeters may result in unknown exposure and regulatory violations.",
      clinicalPearls: [
        { text: "Collar badge (outside apron) measures thyroid and lens dose; waist badge (under apron) measures trunk dose." },
        { text: "OSL dosimeters have largely replaced film badges due to accuracy, sensitivity, and re-readability." },
        { text: "Pregnant workers should wear a second dosimeter at waist level (under apron) for fetal dose estimation." }
      ],
      examPitfalls: [
        { text: "Confusing OSL (optical stimulation) with TLD (thermal stimulation) mechanisms." },
        { text: "Not knowing proper dosimeter placement: collar = outside apron, waist = under apron." }
      ],
      faqJson: [
        { question: "Where should a dosimeter be worn?", answer: "For single-badge monitoring: at collar level outside the lead apron. For dual-badge monitoring: one at collar level outside the apron and one at waist level under the apron. The collar badge estimates head/neck dose, and the waist badge estimates trunk dose." },
        { question: "What is the most common dosimeter type used today?", answer: "OSL (Optically Stimulated Luminescence) dosimeters using aluminum oxide (Al₂O₃) are the most common type. They are accurate, can be re-read multiple times, are sensitive to low doses (10 μSv), and can differentiate between different types of radiation." }
      ]
    },
    {
      slug: "patient-dose-reduction-techniques",
      title: "Patient Dose Reduction Techniques",
      seoTitle: "Patient Radiation Dose Reduction Methods | Imaging Safety Guide",
      seoDescription: "Comprehensive guide to patient dose reduction techniques in diagnostic radiography for ARRT and CAMRT certification.",
      seoKeywords: ["patient dose reduction", "radiation dose minimization", "gonadal shielding", "dose optimization"],
      overview: "Minimizing patient radiation dose while maintaining diagnostic image quality is a core responsibility of radiologic technologists. Multiple techniques are available to reduce dose, and these should be applied in combination for optimal protection.",
      mechanismPhysiology: "Patient dose is determined by beam quality (kVp), beam quantity (mAs), field size, filtration, number of exposures, and patient-specific factors. Each of these can be optimized to reduce dose without compromising diagnostic quality.",
      clinicalRelevance: "Dose reduction is especially important for pediatric patients, pregnant patients, and patients requiring serial examinations. The ALARA principle guides all dose reduction efforts.",
      signsSymptoms: "Radiation dose effects are typically not immediately apparent. Stochastic effects (cancer risk) are proportional to cumulative dose. Deterministic effects (skin erythema) occur only at very high doses.",
      assessment: "Key dose metrics: Entrance Skin Exposure (ESE), Dose Area Product (DAP), Effective Dose, and organ-specific doses. Compare to diagnostic reference levels (DRLs).",
      management: "Optimize kVp (higher kVp within diagnostic range reduces dose), minimize mAs, tight collimation, proper filtration, avoid repeats through good technique, use AEC properly, apply gonadal shielding when appropriate, use fastest receptor system available.",
      complications: "Over-reduction of technique factors produces non-diagnostic images requiring repeats, which increases total patient dose. Balance between dose reduction and diagnostic quality is essential.",
      clinicalPearls: [
        { text: "Repeats due to positioning errors are the most preventable source of unnecessary patient dose." },
        { text: "Tight collimation simultaneously reduces dose AND improves image quality by reducing scatter." },
        { text: "Increasing kVp by 15% and halving mAs reduces patient dose while maintaining receptor exposure." }
      ],
      examPitfalls: [
        { text: "Thinking that reducing dose always requires reducing image quality—optimal technique achieves both goals." },
        { text: "Forgetting that repeat examinations are the biggest controllable source of excess patient dose." }
      ],
      faqJson: [
        { question: "What is the single most important dose reduction action?", answer: "Producing a diagnostic-quality image on the first attempt (avoiding repeats) is the most impactful dose reduction measure. Repeats due to positioning errors, wrong technique, or motion double or triple the patient's dose with no diagnostic benefit." },
        { question: "How does increasing kVp reduce patient dose?", answer: "Higher kVp beams have more energy, producing more transmitted photons per mAs. This means the same receptor exposure can be achieved with fewer photons (lower mAs), reducing the total energy absorbed by the patient." }
      ]
    },
    {
      slug: "radiation-units-and-measurements",
      title: "Radiation Units and Measurements",
      seoTitle: "Radiation Units: Roentgen, Rad, Rem, Sievert | Complete Guide",
      seoDescription: "Comprehensive guide to radiation measurement units including traditional and SI units for ARRT and CAMRT certification exams.",
      seoKeywords: ["radiation units", "roentgen", "rad", "rem", "sievert", "gray", "SI units"],
      overview: "Radiation measurement uses specific units for exposure, absorbed dose, dose equivalent, and activity. Understanding both traditional (legacy) and SI (modern) units and their conversions is essential for radiation protection calculations.",
      mechanismPhysiology: "Exposure (Roentgen/C/kg): measures ionization in air. Absorbed Dose (rad/Gray): energy deposited per unit mass. Dose Equivalent (rem/Sievert): absorbed dose × quality factor, accounting for biological effectiveness. Activity (Curie/Becquerel): rate of radioactive decay.",
      clinicalRelevance: "These units are used for dosimetry reports, regulatory compliance, patient dose records, and risk communication. Technologists must understand conversions for exam and clinical applications.",
      signsSymptoms: "Measurement concept—not directly related to symptoms. However, specific dose thresholds are associated with deterministic effects (e.g., 2 Gy for skin erythema).",
      assessment: "Traditional → SI conversions: 1 R → 2.58 × 10⁻⁴ C/kg; 1 rad = 0.01 Gy (1 cGy); 1 rem = 0.01 Sv (10 mSv); 1 Ci = 3.7 × 10¹⁰ Bq.",
      management: "Use SI units (Gy, Sv) for modern documentation. Many clinical settings still use traditional units (rad, rem). Quality factor for x-rays = 1 (so rad = rem and Gy = Sv for diagnostic x-rays).",
      complications: "Unit confusion can lead to dose calculation errors. For x-rays and gamma rays, the quality factor is 1, so absorbed dose equals dose equivalent. For alpha particles (QF=20) and neutrons (QF=10), they differ significantly.",
      clinicalPearls: [
        { text: "For x-rays: 1 rad = 1 rem (quality factor = 1), and 1 Gy = 1 Sv." },
        { text: "1 Sv = 100 rem; 1 Gy = 100 rad; 1 mSv = 100 mrem." },
        { text: "Quality factors differ for different radiation types: x-rays=1, alpha=20, neutrons=10." }
      ],
      examPitfalls: [
        { text: "Confusing Gy (absorbed dose) with Sv (dose equivalent)—they are equal only for x-rays (QF=1)." },
        { text: "Getting SI conversion factors wrong: 1 Gy = 100 rad, not 1000." }
      ],
      faqJson: [
        { question: "What is the difference between absorbed dose and dose equivalent?", answer: "Absorbed dose (Gy or rad) measures energy deposited per unit mass regardless of radiation type. Dose equivalent (Sv or rem) = absorbed dose × quality factor, accounting for the different biological effectiveness of different radiation types. For x-rays (QF=1), they are numerically equal." },
        { question: "What are the SI unit conversions?", answer: "1 Gray (Gy) = 100 rad. 1 Sievert (Sv) = 100 rem. 1 mSv = 100 mrem. 1 Becquerel (Bq) = 1 disintegration/second. 1 Curie = 3.7 × 10¹⁰ Bq." }
      ]
    },
    {
      slug: "biological-effects-of-radiation",
      title: "Biological Effects of Radiation",
      seoTitle: "Biological Effects of Radiation: Stochastic & Deterministic | Guide",
      seoDescription: "Understanding stochastic and deterministic effects of radiation, dose-response relationships, and radiosensitivity for ARRT and CAMRT exams.",
      seoKeywords: ["biological effects of radiation", "stochastic effects", "deterministic effects", "radiosensitivity"],
      overview: "Radiation produces biological effects through direct and indirect mechanisms at the cellular level. Effects are categorized as stochastic (probabilistic, no threshold) or deterministic (dose-dependent, threshold exists). Understanding these effects is fundamental to radiation protection.",
      mechanismPhysiology: "Direct effect: Radiation directly damages DNA molecules. Indirect effect: Radiation ionizes water molecules, producing free radicals (primarily hydroxyl radicals) that damage DNA. Indirect effects account for approximately 2/3 of biological damage from x-rays. Cell damage may result in death, repair, or mutation.",
      clinicalRelevance: "Stochastic effects (cancer, genetic effects) have no dose threshold and increase in probability with dose. Deterministic effects (skin erythema, cataracts, sterility) have a threshold dose below which they do not occur.",
      signsSymptoms: "Deterministic effects appear above specific threshold doses (e.g., skin erythema at ~2 Gy, temporary sterility at ~2.5 Gy, cataracts at ~2 Gy). Stochastic effects may appear years or decades after exposure.",
      assessment: "Radiosensitivity follows the Law of Bergonié and Tribondeau: cells that are rapidly dividing, have a long mitotic future, and are undifferentiated are most radiosensitive. Most sensitive: lymphocytes, spermatogonia, erythroblasts. Most resistant: nerve cells, muscle cells.",
      management: "Minimize all radiation exposure following ALARA principles. Apply dose limits. Protect radiosensitive organs (gonads, thyroid, lens of eye, bone marrow) with appropriate shielding.",
      complications: "Cancer induction is the primary concern from occupational and medical radiation exposure. Genetic effects are theoretically possible but have never been conclusively demonstrated in humans at diagnostic dose levels.",
      clinicalPearls: [
        { text: "Stochastic effects: no threshold, probability increases with dose, severity is independent of dose." },
        { text: "Deterministic effects: threshold exists, severity increases with dose above the threshold." },
        { text: "Indirect effects (via free radicals) cause ~2/3 of biological damage from x-rays." },
        { text: "Law of Bergonié and Tribondeau: rapidly dividing, undifferentiated cells are most radiosensitive." }
      ],
      examPitfalls: [
        { text: "Confusing stochastic and deterministic effects: stochastic = probability changes with dose; deterministic = severity changes with dose." },
        { text: "Stating that genetic effects have been proven in humans from radiation—they have not been conclusively demonstrated." }
      ],
      faqJson: [
        { question: "What is the difference between stochastic and deterministic effects?", answer: "Stochastic effects (cancer, genetic): no dose threshold, probability increases with dose, but severity is independent of dose (you either get cancer or you don't). Deterministic effects (skin burns, cataracts): a threshold dose exists below which the effect doesn't occur, and severity increases with dose above the threshold." },
        { question: "What is the Law of Bergonié and Tribondeau?", answer: "This law states that cells are more radiosensitive if they: (1) have a high mitotic rate (divide frequently), (2) have a long mitotic future (many divisions ahead), and (3) are undifferentiated (unspecialized). This is why lymphocytes and reproductive cells are highly sensitive, while nerve and muscle cells are resistant." }
      ]
    },
    {
      slug: "pregnancy-and-radiation-exposure",
      title: "Pregnancy and Radiation Exposure",
      seoTitle: "Pregnancy & Radiation: Protection Guidelines for Imaging Staff",
      seoDescription: "Guidelines for radiation protection during pregnancy for both patients and radiation workers, including dose limits and the 10-day rule.",
      seoKeywords: ["pregnancy radiation protection", "pregnant patient x-ray", "fetal radiation dose", "10-day rule"],
      overview: "Radiation exposure during pregnancy poses unique risks to the developing embryo/fetus. Both pregnant patients and pregnant radiation workers require special consideration and protective measures.",
      mechanismPhysiology: "The embryo/fetus is highly radiosensitive, particularly during organogenesis (weeks 2-8). Effects depend on dose and gestational age: pre-implantation (all-or-nothing), organogenesis (congenital anomalies), fetal period (growth retardation, CNS effects). Threshold for deterministic effects is approximately 100-200 mGy.",
      clinicalRelevance: "Most diagnostic procedures deliver far less than the threshold dose for deterministic effects. However, precautions should be taken to minimize exposure when possible, especially to the pelvis/abdomen.",
      signsSymptoms: "Effects depend on dose and gestational age. At diagnostic dose levels, the risk to the fetus is extremely low—much lower than the natural rate of birth defects (3-6%).",
      assessment: "Fetal dose from common procedures: Chest x-ray < 0.01 mGy, Abdomen/pelvis x-ray 1-3 mGy, CT abdomen 10-50 mGy. The 10-day rule (scheduling elective abdominal/pelvic x-rays in the first 10 days after onset of menses) is largely replaced by individual risk assessment.",
      management: "For patients: confirm pregnancy status before pelvic/abdominal imaging, use alternative modalities (ultrasound, MRI) when possible, shield fetus when not in the direct beam, use optimal technique to minimize dose. For workers: declare pregnancy voluntarily, wear waist dosimeter under apron, apply 5 mSv total gestation limit.",
      complications: "Unnecessary anxiety from exaggerated risk perception is a significant problem. Counseling should emphasize that diagnostic radiation doses are far below threshold levels for deterministic effects.",
      clinicalPearls: [
        { text: "Fetal dose limit: 5 mSv (0.5 rem) for the entire gestation period." },
        { text: "Most diagnostic procedures deliver fetal doses well below the 100 mGy threshold for effects." },
        { text: "Pregnancy declaration by a radiation worker is VOLUNTARY—it cannot be required." },
        { text: "Never deny a medically indicated examination because of pregnancy—the clinical need takes priority." }
      ],
      examPitfalls: [
        { text: "Thinking any radiation exposure to a pregnant patient is harmful—diagnostic doses are far below effect thresholds." },
        { text: "Believing the employer can require pregnancy disclosure—declaration is always voluntary." }
      ],
      faqJson: [
        { question: "Is it safe to x-ray a pregnant patient?", answer: "Most diagnostic x-ray procedures deliver doses far below the threshold for fetal effects (~100 mGy). A medically necessary examination should not be withheld because of pregnancy. However, precautions should minimize fetal dose: collimate tightly, shield the abdomen when feasible, and use the lowest appropriate technique factors." },
        { question: "What is the embryo/fetus dose limit for a pregnant radiation worker?", answer: "5 mSv (0.5 rem) total for the entire gestation period, with a monthly equivalent limit of 0.5 mSv. This applies only after the worker voluntarily declares the pregnancy in writing." }
      ]
    },
    {
      slug: "lead-shielding-and-protective-equipment",
      title: "Lead Shielding and Protective Equipment",
      seoTitle: "Lead Shielding & Protective Equipment in Radiography | Safety Guide",
      seoDescription: "Guide to lead aprons, thyroid shields, gonadal shielding, and other protective equipment for radiation safety in medical imaging.",
      seoKeywords: ["lead apron", "thyroid shield", "gonadal shielding", "radiation protective equipment"],
      overview: "Lead shielding devices are essential components of radiation protection in diagnostic imaging. They include personal protective equipment (lead aprons, thyroid shields, lead glasses) and patient shielding devices (gonadal shields, breast shields).",
      mechanismPhysiology: "Lead (Z=82) is an excellent radiation absorber due to its high atomic number and density. A 0.5 mm lead-equivalent apron attenuates approximately 95-99% of scattered radiation at diagnostic energies (60-100 kVp). Lead glasses with 0.75 mm Pb equivalent protect the lens of the eye.",
      clinicalRelevance: "Lead protective equipment is required during fluoroscopy, portable radiography, and any procedure where the operator may be exposed to scattered radiation. Proper use significantly reduces occupational dose.",
      signsSymptoms: "Improper or absent shielding results in elevated dosimeter readings and increased long-term stochastic risk.",
      assessment: "Lead aprons: minimum 0.25 mm Pb equivalent (0.5 mm for high-dose procedures). Thyroid shields: 0.5 mm Pb. Lead glasses: 0.75 mm Pb. Gonadal shields: contact or shadow type. Regular inspection for cracks is mandatory.",
      management: "Wear lead aprons during all fluoroscopy and portable procedures. Use thyroid shields for fluoroscopy. Drape aprons (never fold) to prevent cracking. Inspect annually under fluoroscopy for defects. Replace cracked or damaged equipment.",
      complications: "Lead aprons develop cracks from improper handling (folding instead of draping), reducing their protective value. Undetected cracks can allow radiation transmission. Heavy aprons can cause musculoskeletal strain.",
      clinicalPearls: [
        { text: "Lead aprons attenuate 95-99% of scatter at diagnostic energies." },
        { text: "Always DRAPE aprons, never fold them—folding causes lead cracking." },
        { text: "Inspect lead aprons annually under fluoroscopy for cracks." },
        { text: "Lighter lead-free/lead-composite aprons provide equivalent protection with less weight." }
      ],
      examPitfalls: [
        { text: "Thinking lead aprons protect from the primary beam—they only provide meaningful protection from scatter." },
        { text: "Not knowing that improper storage (folding) is the primary cause of lead apron failure." }
      ],
      faqJson: [
        { question: "How much radiation do lead aprons block?", answer: "A 0.5 mm lead equivalent apron attenuates approximately 95-99% of scattered radiation at typical diagnostic energies (60-100 kVp). At higher energies (above 100 kVp), attenuation decreases somewhat but remains significant." },
        { question: "How should lead aprons be stored?", answer: "Lead aprons should always be draped over a hanger or rack—never folded. Folding creates creases where the lead can crack, creating gaps in protection. Aprons should be inspected at least annually under fluoroscopy for cracks or tears." }
      ]
    },
    {
      slug: "fluoroscopy-radiation-safety",
      title: "Fluoroscopy Radiation Safety",
      seoTitle: "Fluoroscopy Radiation Safety | Dose Management & Protection",
      seoDescription: "Radiation safety during fluoroscopic procedures including dose rates, protective measures, and dose reduction techniques for ARRT and CAMRT exams.",
      seoKeywords: ["fluoroscopy radiation safety", "fluoroscopy dose", "fluoroscopy protection", "entrance exposure rate"],
      overview: "Fluoroscopy delivers the highest radiation doses among diagnostic imaging procedures because of continuous or pulsed x-ray exposure over extended periods. Strict adherence to safety protocols is essential for both patient and operator protection.",
      mechanismPhysiology: "Fluoroscopy uses a continuous or pulsed x-ray beam for real-time imaging. Entrance exposure rates are limited to 88 mGy/min (10 R/min) for standard fluoroscopy and 176 mGy/min (20 R/min) for high-level/interventional. Cumulative doses can be substantial during long procedures.",
      clinicalRelevance: "Fluoroscopy-guided procedures include barium studies, arthrography, cardiac catheterization, and interventional procedures. Patient skin doses during complex interventional procedures can reach deterministic effect thresholds.",
      signsSymptoms: "Excessive fluoroscopy time can cause deterministic effects including skin erythema (2 Gy), permanent epilation (7 Gy), and skin necrosis (>12 Gy). These effects may be delayed days to weeks.",
      assessment: "Monitor fluoroscopy time, cumulative dose (DAP), and skin dose. The 5-minute alarm is required on all fluoroscopy units. Document total fluoroscopy time for each procedure.",
      management: "Use pulsed fluoroscopy (reduces dose by 50-80%), last-image-hold, virtual collimation, and optimal source-to-skin distance. Keep tube under the table (geometric protection for operator). Use lead aprons, thyroid shields, lead glasses, and ceiling-suspended shields.",
      complications: "Extended fluoroscopy procedures can cause radiation-induced skin injuries that may not appear for days to weeks. Cumulative occupational exposure to fluoroscopy personnel is typically the highest among imaging professionals.",
      clinicalPearls: [
        { text: "Maximum entrance exposure rate: 88 mGy/min (10 R/min) for standard, 176 mGy/min (20 R/min) for high-level." },
        { text: "Pulsed fluoroscopy at lower pulse rates significantly reduces patient dose." },
        { text: "Keep the tube UNDER the table so scatter is directed away from the operator." },
        { text: "The 5-minute audible alarm is mandatory on all fluoroscopy equipment." }
      ],
      examPitfalls: [
        { text: "Forgetting the maximum entrance exposure rates for standard and high-level fluoroscopy." },
        { text: "Not understanding that the tube should be under the table to minimize operator exposure." }
      ],
      faqJson: [
        { question: "Why should the fluoroscopy tube be under the table?", answer: "When the tube is under the table, scatter radiation is directed primarily downward (away from the operator). If the tube were above the table, scatter would be directed upward toward the operator's face and body, dramatically increasing occupational exposure." },
        { question: "What is pulsed fluoroscopy?", answer: "Pulsed fluoroscopy produces the x-ray beam in short pulses rather than continuously. At lower pulse rates (7.5 or 15 pulses/sec vs. continuous 30 fps), dose can be reduced by 50-80% while maintaining adequate image quality for most procedures." }
      ]
    },
    {
      slug: "pediatric-radiation-protection",
      title: "Pediatric Radiation Protection",
      seoTitle: "Pediatric Radiation Protection in Radiography | Dose Reduction",
      seoDescription: "Specialized radiation protection considerations for pediatric imaging, including dose reduction techniques and age-appropriate protocols.",
      seoKeywords: ["pediatric radiation protection", "child x-ray dose", "pediatric imaging safety", "Image Gently"],
      overview: "Pediatric patients are more radiosensitive than adults and have a longer lifespan for radiation effects to manifest. Special attention to dose reduction is paramount, following the Image Gently campaign principles.",
      mechanismPhysiology: "Children have more rapidly dividing cells, a smaller body mass (higher dose per photon), and decades of remaining life for stochastic effects to develop. The lifetime cancer risk from radiation exposure in a child is 2-3 times higher than the same dose in an adult.",
      clinicalRelevance: "Pediatric-specific technique charts are mandatory. Adult techniques should NEVER be used on children. CT doses in particular must be carefully adjusted for pediatric patients.",
      signsSymptoms: "Pediatric dose concerns apply to all imaging procedures. Younger children require more careful dose management due to higher radiosensitivity.",
      assessment: "Use size-specific dose estimates (SSDE) for CT. Apply Image Gently principles. Use pediatric-specific technique charts based on body part thickness or weight. Reduce kVp and mAs from adult settings.",
      management: "Use the minimum number of projections needed. Tight collimation. Appropriate gonadal and thyroid shielding. Immobilization devices to prevent motion (and repeats). Communicate clearly with child and parents.",
      complications: "Over-radiation of children carries a disproportionately high lifetime cancer risk. Unnecessary repeat exposures due to poor immobilization or communication significantly increase dose.",
      clinicalPearls: [
        { text: "Children are 2-3× more radiosensitive than adults for lifetime cancer risk." },
        { text: "Image Gently: child-sized patients need child-sized radiation doses." },
        { text: "Immobilization prevents motion, reducing repeats and overall dose." },
        { text: "Never use adult technique factors on pediatric patients." }
      ],
      examPitfalls: [
        { text: "Using adult CT protocols on pediatric patients—this is a significant overexposure." },
        { text: "Thinking one-size-fits-all technique is acceptable—pediatric patients need age/size-specific protocols." }
      ],
      faqJson: [
        { question: "Why are children more radiosensitive than adults?", answer: "Children have more rapidly dividing cells (per the Law of Bergonié and Tribondeau), a smaller body mass resulting in higher absorbed dose per photon, and a longer remaining lifespan for stochastic effects (cancer) to develop. The estimated lifetime cancer risk is 2-3 times higher for the same dose." },
        { question: "What is the Image Gently campaign?", answer: "Image Gently is a national campaign promoting radiation dose reduction in pediatric imaging. Its core message is that child-sized patients need child-sized radiation doses. It advocates for pediatric-specific protocols, dose tracking, and awareness among imaging professionals." }
      ]
    }
  ];

  safety.forEach(e => entries.push({ ...e, category: "Radiation Safety & Protection" }));

  // Helper to generate remaining categories more concisely
  function addCategory(categoryName: string, items: { slug: string; title: string; keywords: string[]; overview: string; mechanism: string; relevance: string; pearls: string[]; pitfalls: string[]; faq: { q: string; a: string }[] }[]) {
    for (const item of items) {
      entries.push({
        slug: item.slug,
        title: item.title,
        category: categoryName,
        seoTitle: `${item.title} | Diagnostic Imaging Encyclopedia`,
        seoDescription: `Learn about ${item.title.toLowerCase()} in diagnostic imaging. Comprehensive study guide for ARRT and CAMRT certification exams.`,
        seoKeywords: item.keywords,
        overview: item.overview,
        mechanismPhysiology: item.mechanism,
        clinicalRelevance: item.relevance,
        signsSymptoms: `This topic is relevant to diagnostic imaging professionals studying for ARRT/CAMRT certification and practicing radiologic technologists.`,
        assessment: `Understanding ${item.title.toLowerCase()} is essential for competent practice in medical imaging and is frequently tested on certification examinations.`,
        management: `Application of ${item.title.toLowerCase()} principles requires thorough understanding of the underlying physics and clinical considerations specific to diagnostic imaging practice.`,
        complications: `Errors related to ${item.title.toLowerCase()} can result in non-diagnostic images, increased patient dose, or misdiagnosis. Proper understanding prevents these adverse outcomes.`,
        clinicalPearls: item.pearls.map(text => ({ text })),
        examPitfalls: item.pitfalls.map(text => ({ text })),
        faqJson: item.faq.map(f => ({ question: f.q, answer: f.a }))
      });
    }
  }

  // =====================================================
  // CATEGORY 4: CT Imaging (16 entries)
  // =====================================================
  addCategory("CT Imaging", [
    { slug: "ct-scanner-components", title: "CT Scanner Components and Design", keywords: ["CT scanner", "CT tube", "detector array", "gantry"], overview: "Computed Tomography (CT) scanners consist of an x-ray tube, detector array, gantry, patient table, and computer system that work together to produce cross-sectional images of the body.", mechanism: "The x-ray tube rotates around the patient, emitting a fan-shaped or cone-shaped beam. Detectors on the opposite side measure transmitted radiation. Mathematical algorithms (filtered back projection or iterative reconstruction) create cross-sectional images from the attenuation data.", relevance: "CT provides superior cross-sectional anatomy compared to conventional radiography, essential for trauma evaluation, cancer staging, and numerous clinical applications.", pearls: ["Third-generation scanners (rotate-rotate) are the most common design.", "Slip-ring technology enables continuous helical scanning.", "Dual-energy CT uses two different kVp settings to differentiate materials."], pitfalls: ["Confusing scanner generations—3rd generation (rotate-rotate) is standard.", "Not understanding the difference between axial and helical scanning modes."], faq: [{ q: "What is the difference between axial and helical CT?", a: "Axial CT acquires one slice at a time with the table stationary during each rotation. Helical (spiral) CT acquires data continuously as the table moves through the gantry, allowing faster scanning and volume data acquisition." }, { q: "What are multi-detector CT (MDCT) scanners?", a: "MDCT scanners have multiple rows of detectors (64, 128, 256, or 320 rows), allowing acquisition of multiple slices per rotation. This enables faster scanning, thinner slices, and improved multiplanar and 3D reconstruction capability." }] },
    { slug: "hounsfield-units-ct-numbers", title: "Hounsfield Units (CT Numbers)", keywords: ["Hounsfield units", "CT numbers", "CT density", "attenuation coefficient"], overview: "Hounsfield Units (HU) are the standardized scale used to express CT attenuation values. Water is defined as 0 HU, air as -1000 HU, and dense bone ranges from +400 to +1000 HU. The scale allows quantitative tissue characterization.", mechanism: "Each pixel in a CT image is assigned a CT number based on the linear attenuation coefficient of the tissue relative to water: HU = [(μ tissue - μ water) / μ water] × 1000. This creates a standardized, quantitative scale.", relevance: "CT numbers help characterize tissues: fat (-50 to -100 HU), water (0 HU), soft tissue (+20 to +70 HU), acute hemorrhage (+50 to +70 HU), calcification (+100 to +300 HU), bone (+400 to +1000 HU), metal (+1000+ HU).", pearls: ["Water = 0 HU by definition; air = -1000 HU.", "Acute blood is typically +50 to +70 HU.", "Fat is negative (-50 to -100 HU), useful for characterizing adrenal and liver lesions."], pitfalls: ["Not knowing that water is the reference standard at 0 HU.", "Forgetting that fat has negative HU values."], faq: [{ q: "What is the Hounsfield scale?", a: "A quantitative scale for CT attenuation values where water = 0 HU and air = -1000 HU. Named after Sir Godfrey Hounsfield, co-inventor of CT. The scale allows objective measurement of tissue density." }, { q: "How are Hounsfield units used clinically?", a: "HU values help characterize lesions (e.g., simple cyst 0-20 HU, hemorrhage 50-70 HU), assess enhancement after contrast (increase >15-20 HU suggests vascularity), and identify fat-containing lesions (negative HU values)." }] },
    { slug: "ct-window-width-and-level", title: "CT Window Width and Level", keywords: ["CT window", "window width", "window level", "CT display"], overview: "Windowing (window width and level) determines how CT numbers are mapped to the grayscale display. Window level sets the center CT number, and window width determines the range of CT numbers displayed.", mechanism: "Window level (WL) sets the center of the displayed HU range. Window width (WW) sets the total range of HU values mapped to the grayscale. Values above the window appear white; values below appear black. Narrower windows provide more contrast.", relevance: "Different window settings optimize visualization of different tissues: lung window (WW 1500, WL -600), soft tissue window (WW 350, WL 50), bone window (WW 2000, WL 300), brain window (WW 80, WL 40).", pearls: ["Narrow window width = higher contrast; wide window width = lower contrast.", "Window level should match the tissue of interest.", "Standard windows: brain (WW 80/WL 40), lung (WW 1500/WL -600), bone (WW 2000/WL 300)."], pitfalls: ["Confusing window width with window level—width = range, level = center.", "Using soft tissue windows to evaluate lung parenchyma (will miss subtle findings)."], faq: [{ q: "What happens if you narrow the window width?", a: "Narrowing the window width increases contrast—fewer HU values are spread across the grayscale, making differences between similar tissues more visible. However, structures outside the window appear entirely white or black." }, { q: "What are standard CT window settings?", a: "Brain: WW 80, WL 40. Lung: WW 1500, WL -600. Soft tissue (abdomen): WW 350, WL 50. Bone: WW 2000, WL 300. Liver: WW 150, WL 60." }] },
    { slug: "ct-contrast-enhancement", title: "CT Contrast Enhancement", keywords: ["CT contrast", "iodinated contrast", "contrast enhancement", "CT angiography"], overview: "Intravenous iodinated contrast agents are used in CT to enhance visualization of vascular structures and differentiate enhancing from non-enhancing lesions. Contrast timing is critical for different clinical applications.", mechanism: "Iodinated contrast increases x-ray attenuation in vascular and perfused tissues. The enhancement pattern over time provides diagnostic information: arterial phase (25-30s), portal venous phase (60-70s), delayed phase (3-5 min).", relevance: "Contrast-enhanced CT is essential for tumor detection, vascular assessment, and characterization of lesions. CT angiography relies on precise contrast bolus timing.", pearls: ["Arterial phase peaks at 25-30 seconds after injection.", "Portal venous phase (60-70 seconds) is the standard phase for most abdominal imaging.", "Bolus tracking triggers acquisition when target vessel reaches threshold HU."], pitfalls: ["Not understanding the timing of contrast phases.", "Forgetting to check renal function before iodinated contrast administration."], faq: [{ q: "What are the phases of contrast enhancement?", a: "Non-contrast (before injection), arterial phase (25-30 sec—arteries enhance), portal venous phase (60-70 sec—liver parenchyma and veins enhance), delayed phase (3-5 min—equilibrium, useful for renal collecting system and some liver lesions)." }, { q: "What is bolus tracking?", a: "Bolus tracking places a region of interest (ROI) in a target vessel and monitors HU values. When the contrast bolus reaches a preset threshold (typically 100-150 HU), the scan is automatically triggered, optimizing contrast timing for each patient." }] },
    { slug: "ct-dose-optimization", title: "CT Radiation Dose Optimization", keywords: ["CT dose", "CTDI", "DLP", "CT dose optimization", "dose length product"], overview: "CT delivers higher doses than conventional radiography, making dose optimization critical. Key dose metrics include CTDI (CT Dose Index) and DLP (Dose Length Product). Dose reduction strategies include automated tube current modulation and iterative reconstruction.", mechanism: "CTDIvol represents the average dose within a scan volume. DLP = CTDIvol × scan length. Effective dose = DLP × conversion factor. Automated tube current modulation adjusts mA based on patient attenuation in real-time.", relevance: "CT accounts for approximately 50% of medical radiation dose despite being ~15% of imaging procedures. Dose optimization is a professional responsibility.", pearls: ["CTDIvol measures dose intensity; DLP measures total dose for the scan.", "Effective dose = DLP × k factor (organ-specific conversion factor).", "Iterative reconstruction allows 30-50% dose reduction compared to filtered back projection."], pitfalls: ["Confusing CTDI with DLP—CTDI is dose per slice, DLP is total dose for the scan.", "Not understanding that decreasing slice thickness increases dose."], faq: [{ q: "What is CTDIvol?", a: "CTDIvol (CT Dose Index, volume) represents the average absorbed dose within the scanned volume for a standardized phantom (16 cm head or 32 cm body). It measures dose intensity (mGy) and is displayed on the scanner for each protocol." }, { q: "How does iterative reconstruction reduce dose?", a: "Iterative reconstruction uses statistical modeling to reduce image noise, allowing lower mAs acquisitions. Traditional filtered back projection amplifies noise at lower doses, making images non-diagnostic. Iterative reconstruction maintains image quality at 30-50% lower dose levels." }] },
    { slug: "ct-artifacts", title: "CT Image Artifacts", keywords: ["CT artifacts", "beam hardening", "motion artifact", "metal artifact", "ring artifact"], overview: "CT artifacts are features in the image that do not represent actual anatomy. Common artifacts include beam hardening, motion, metal, ring, and partial volume artifacts. Recognizing and mitigating artifacts is essential for accurate diagnosis.", mechanism: "Beam hardening occurs as low-energy photons are preferentially absorbed, increasing mean beam energy. Motion artifacts create streaks or blurring. Metal artifacts produce severe streaks from photon starvation. Ring artifacts indicate detector malfunction.", relevance: "Artifacts can obscure pathology or mimic disease. Understanding their causes helps distinguish them from true pathology and implement correction strategies.", pearls: ["Beam hardening causes dark bands between dense structures (e.g., posterior fossa between petrous bones).", "Ring artifacts indicate a single malfunctioning detector element.", "Metal artifact reduction (MAR) algorithms can significantly reduce streak artifacts."], pitfalls: ["Mistaking beam hardening artifact for pathology in the posterior fossa.", "Not recognizing ring artifacts as a detector calibration issue."], faq: [{ q: "What causes beam hardening artifacts?", a: "As the polychromatic x-ray beam passes through dense structures, low-energy photons are preferentially absorbed, increasing the mean beam energy. This creates dark bands or streaks between dense objects (e.g., the Hounsfield bar artifact between petrous bones)." }, { q: "What causes ring artifacts in CT?", a: "Ring artifacts are caused by a miscalibrated or malfunctioning detector element. Since the detector traces a circular path during rotation, the faulty readings create a ring pattern in the reconstructed image centered on the center of rotation." }] },
    { slug: "ct-reconstruction-algorithms", title: "CT Reconstruction Algorithms", keywords: ["CT reconstruction", "filtered back projection", "iterative reconstruction", "kernel"], overview: "CT images are reconstructed from raw projection data using mathematical algorithms. Filtered back projection (FBP) was the traditional standard; modern scanners use iterative reconstruction techniques for improved image quality at lower doses.", mechanism: "FBP applies a filter to raw projection data and back-projects it to create the image. Iterative reconstruction uses statistical modeling and repeated forward/backward projection to optimize the image. Different reconstruction kernels (sharp, smooth) emphasize different image characteristics.", relevance: "Understanding reconstruction helps technologists select appropriate protocols. Kernel selection affects spatial resolution and noise: sharp kernels for bone/lung detail, smooth kernels for soft tissue contrast.", pearls: ["Sharp kernels increase spatial resolution but also increase noise.", "Smooth kernels reduce noise but decrease spatial resolution.", "Iterative reconstruction allows dose reduction of 30-50%."], pitfalls: ["Using a smooth kernel for lung imaging (misses fine detail).", "Using a sharp kernel for soft tissue (too noisy)."], faq: [{ q: "What is the difference between sharp and smooth kernels?", a: "Sharp (high-resolution) kernels emphasize edges and fine detail, ideal for bone and lung imaging but with more noise. Smooth (soft tissue) kernels reduce noise for better low-contrast detectability, ideal for liver, brain, and soft tissue evaluation." }, { q: "What is iterative reconstruction?", a: "An advanced reconstruction technique that iteratively compares simulated projections to actual data, progressively refining the image. Unlike FBP, it can model noise statistics and system geometry, producing higher quality images at lower dose levels." }] },
    { slug: "ct-slice-thickness-and-pitch", title: "CT Slice Thickness and Pitch", keywords: ["CT slice thickness", "CT pitch", "helical pitch", "spatial resolution CT"], overview: "Slice thickness and pitch are fundamental CT scan parameters that affect spatial resolution, image noise, dose, and scan coverage. Optimizing these parameters balances image quality with dose considerations.", mechanism: "Slice thickness determines the z-axis resolution (along the length of the patient). Pitch = table movement per rotation / total collimation width. Pitch >1 means gaps in coverage (faster scan, lower dose); pitch <1 means overlap (slower scan, higher dose). Thinner slices improve z-axis resolution but increase noise.", relevance: "Thin slices enable high-quality multiplanar reconstructions and 3D imaging. Pitch selection balances scan speed, coverage, and dose.", pearls: ["Thinner slices = better z-axis resolution but more noise (need more dose to compensate).", "Pitch = 1 means contiguous coverage; >1 = gaps; <1 = overlap.", "Standard abdomen pitch is typically 0.8-1.2."], pitfalls: ["Thinking thinner slices always improve image quality without considering noise.", "Not understanding pitch values and their effect on dose and coverage."], faq: [{ q: "How does slice thickness affect image quality?", a: "Thinner slices improve spatial resolution in the z-axis (along the patient's length), enabling better multiplanar and 3D reconstructions. However, thinner slices contain fewer photons per voxel, increasing noise. Dose must be increased to maintain signal-to-noise ratio with thinner slices." }, { q: "What is pitch in CT?", a: "Pitch = table movement per rotation ÷ total collimation width (or single-slice width for single-detector CT). A pitch of 1.0 means contiguous coverage. Pitch >1.0 means faster scanning with gaps (can be interpolated). Pitch <1.0 means overlapping coverage." }] },
    { slug: "ct-angiography-principles", title: "CT Angiography (CTA) Principles", keywords: ["CT angiography", "CTA", "bolus timing", "MIP reconstruction"], overview: "CT Angiography (CTA) is a specialized CT technique that uses precisely timed IV contrast injection to produce detailed vascular imaging. It has largely replaced diagnostic catheter angiography for many applications.", mechanism: "CTA relies on rapid IV contrast injection (3-5 mL/sec) with precise timing to capture the arterial or venous phase. Bolus tracking or test bolus methods optimize timing. Thin-slice acquisition enables high-quality maximum intensity projection (MIP) and volume rendering reconstructions.", relevance: "CTA is used for stroke evaluation (circle of Willis), pulmonary embolism detection, aortic aneurysm assessment, coronary artery evaluation, and peripheral vascular disease.", pearls: ["Bolus tracking is preferred over fixed delay for optimal arterial opacification.", "Typical injection rate: 3-5 mL/sec for arterial studies.", "MIP reconstructions are essential for vascular visualization."], pitfalls: ["Not understanding bolus tracking technique and threshold HU values.", "Forgetting that motion during CTA can severely degrade 3D reconstructions."], faq: [{ q: "What is the difference between CTA and catheter angiography?", a: "CTA is non-invasive, using IV contrast and CT scanning to image vessels. Catheter angiography is invasive, requiring arterial catheter insertion. CTA is faster, lower risk, and widely available. Catheter angiography provides higher spatial resolution and allows simultaneous intervention." }, { q: "How is bolus timing optimized for CTA?", a: "Bolus tracking places an ROI in the target vessel and monitors HU values in real-time. When contrast reaches a preset threshold (100-150 HU), the scan triggers automatically, ensuring optimal timing regardless of patient cardiac output." }] },
    { slug: "ct-perfusion-imaging", title: "CT Perfusion Imaging", keywords: ["CT perfusion", "cerebral blood flow", "mean transit time", "penumbra"], overview: "CT perfusion is a functional CT technique that measures tissue blood flow dynamics by tracking contrast bolus passage through tissue over time. It is primarily used in acute stroke evaluation to differentiate salvageable ischemic penumbra from infarcted core.", mechanism: "Multiple rapid CT scans are acquired at the same level during IV contrast injection. Time-attenuation curves are generated for each voxel, and mathematical models calculate cerebral blood flow (CBF), cerebral blood volume (CBV), mean transit time (MTT), and time to peak (TTP).", relevance: "In acute ischemic stroke, CT perfusion identifies the ischemic penumbra (tissue at risk but potentially salvageable) by showing a mismatch between reduced CBF/prolonged MTT and preserved CBV. This guides thrombolytic therapy decisions.", pearls: ["Core infarct: matched decrease in both CBF and CBV.", "Penumbra: decreased CBF but preserved CBV (mismatch).", "MTT is the most sensitive parameter for detecting ischemia."], pitfalls: ["Confusing CBF (flow) with CBV (volume)—both decrease in core infarct, but CBV is preserved in penumbra.", "Not understanding the mismatch concept for identifying salvageable tissue."], faq: [{ q: "What does CT perfusion measure?", a: "CT perfusion measures tissue blood flow parameters: Cerebral Blood Flow (CBF) in mL/100g/min, Cerebral Blood Volume (CBV) in mL/100g, Mean Transit Time (MTT) in seconds, and Time to Peak (TTP). These help differentiate infarcted from salvageable brain tissue." }, { q: "What is the penumbra concept?", a: "The ischemic penumbra is brain tissue that is ischemic but not yet infarcted. It shows decreased CBF and prolonged MTT, but preserved CBV (because autoregulatory vasodilation maintains blood volume). This tissue can be saved if blood flow is restored by thrombolysis or thrombectomy." }] },
    { slug: "dual-energy-ct", title: "Dual-Energy CT (DECT)", keywords: ["dual-energy CT", "DECT", "spectral CT", "material decomposition"], overview: "Dual-Energy CT (DECT) acquires data at two different x-ray energies simultaneously or near-simultaneously, enabling material decomposition and advanced tissue characterization beyond conventional single-energy CT.", mechanism: "By scanning at two different photon energy spectra (typically 80 and 140 kVp), DECT exploits energy-dependent differences in photon attenuation. Materials with different atomic numbers attenuate differently at different energies, allowing material identification and separation.", relevance: "DECT applications include virtual non-contrast imaging, iodine mapping, gout detection (uric acid crystal identification), kidney stone characterization, and metal artifact reduction.", pearls: ["DECT can differentiate uric acid from calcium-containing kidney stones.", "Virtual non-contrast images can replace true non-contrast acquisitions, reducing dose.", "Iodine maps show contrast distribution independent of calcium."], pitfalls: ["Not understanding that DECT provides material composition information, not just attenuation values.", "Thinking DECT always requires double the dose—modern implementations maintain dose neutrality."], faq: [{ q: "How does DECT characterize materials?", a: "Different materials attenuate x-rays differently at different energies based on their atomic number. By measuring attenuation at two energies, DECT can identify and quantify specific materials (iodine, calcium, uric acid, fat) that appear similar on conventional single-energy CT." }, { q: "What are clinical applications of DECT?", a: "Key applications include: virtual non-contrast imaging (subtract iodine mathematically), gout detection (identify uric acid crystals), kidney stone characterization (uric acid vs. calcium), iodine perfusion maps, lung perfusion imaging, and metal artifact reduction." }] },
    { slug: "ct-3d-reconstructions", title: "CT 3D Reconstructions and Post-Processing", keywords: ["3D CT reconstruction", "volume rendering", "MIP", "MPR"], overview: "Modern CT scanners acquire volumetric data that can be reconstructed into multiple formats: multiplanar reformats (MPR), maximum intensity projections (MIP), minimum intensity projections (MinIP), and volume-rendered 3D images.", mechanism: "MPR creates reformatted images in any arbitrary plane from the volumetric data. MIP selects the highest HU value along each ray path (ideal for vessels). MinIP selects the lowest value (ideal for airways). Volume rendering assigns opacity and color to HU ranges for 3D visualization.", relevance: "3D reconstructions are essential for surgical planning, vascular assessment, fracture visualization, and communication with referring physicians.", pearls: ["MPR quality depends on isotropic voxels (equal dimensions in all three axes).", "MIP is standard for CTA vessel visualization.", "Volume rendering provides intuitive 3D anatomical views for surgical planning."], pitfalls: ["Using MIP for soft tissue evaluation (it only shows the densest structures).", "Not acquiring thin enough slices for high-quality MPR—isotropic voxels are ideal."], faq: [{ q: "What is the difference between MIP and volume rendering?", a: "MIP projects the maximum HU value along each viewing ray, creating a projection image that highlights the densest structures (vessels with contrast, bone). Volume rendering assigns opacity, color, and lighting to different HU ranges, creating a true 3D surface representation of anatomy." }, { q: "What are isotropic voxels?", a: "Isotropic voxels have equal dimensions in all three spatial axes (e.g., 0.5 × 0.5 × 0.5 mm). This allows high-quality multiplanar reformats in any plane without resolution loss. Non-isotropic voxels (thicker slices) produce stair-step artifacts in reformatted views." }] },
    { slug: "high-resolution-ct-hrct-lung", title: "High-Resolution CT (HRCT) of the Lung", keywords: ["HRCT", "high resolution CT", "lung CT", "interstitial lung disease"], overview: "High-Resolution CT (HRCT) uses thin slices (1-1.5 mm), sharp reconstruction kernel, and high spatial frequency algorithm to provide detailed evaluation of lung parenchyma, particularly for interstitial lung disease.", mechanism: "HRCT acquires very thin (1-1.5 mm) slices using a sharp (bone/lung) reconstruction algorithm. The thin slices minimize partial volume averaging, and the sharp kernel maximizes spatial resolution for demonstrating fine lung architecture.", relevance: "HRCT is the gold standard for evaluating interstitial lung disease, bronchiectasis, emphysema, and diffuse lung processes. It can demonstrate findings invisible on conventional chest radiography.", pearls: ["HRCT uses 1-1.5 mm slices (vs. 5-10 mm for routine chest CT).", "Sharp kernel (lung/bone algorithm) is essential for HRCT.", "Prone imaging helps differentiate dependent atelectasis from true posterior lung disease."], pitfalls: ["Using routine 5 mm slices for suspected interstitial lung disease—HRCT requires 1-1.5 mm.", "Mistaking dependent atelectasis (disappears on prone imaging) for posterior lung disease."], faq: [{ q: "When is HRCT indicated?", a: "HRCT is indicated for suspected interstitial lung disease (pulmonary fibrosis, sarcoidosis), bronchiectasis evaluation, hypersensitivity pneumonitis, emphysema characterization, and when chest radiography shows diffuse lung abnormalities requiring further characterization." }, { q: "Why are prone images obtained in HRCT?", a: "Prone positioning eliminates dependent atelectasis in the posterior lungs. If posterior opacities disappear on prone images, they represent gravity-dependent atelectasis. If they persist, they indicate true parenchymal disease." }] }
  ]);

  // =====================================================
  // CATEGORY 5: MRI Principles (14 entries)
  // =====================================================
  addCategory("MRI Principles", [
    { slug: "mri-basic-physics-hydrogen-protons", title: "MRI Basic Physics: Hydrogen Protons and Magnetism", keywords: ["MRI physics", "hydrogen protons", "magnetic resonance", "precession"], overview: "MRI uses the magnetic properties of hydrogen protons (abundant in body water and fat) to generate images. When placed in a strong magnetic field, hydrogen protons align and precess, providing the signal for image formation.", mechanism: "Hydrogen protons possess a magnetic moment due to their nuclear spin. In a strong external magnetic field (B0), protons align parallel (low energy) or anti-parallel (high energy) to the field and precess at the Larmor frequency (ω = γ × B0, where γ = 42.58 MHz/T for hydrogen). A slight excess of parallel protons creates net magnetization.", relevance: "Understanding proton behavior in magnetic fields is foundational to all MRI concepts including signal generation, contrast mechanisms, and artifact recognition.", pearls: ["The Larmor frequency for hydrogen at 1.5T is 63.87 MHz.", "Only the NET magnetization (small excess of parallel protons) produces the MRI signal.", "The gyromagnetic ratio (γ) of hydrogen is 42.58 MHz/T."], pitfalls: ["Thinking all protons align parallel—only a slight excess aligns parallel, and both states exist.", "Confusing the Larmor frequency formula: ω = γ × B0."], faq: [{ q: "Why is hydrogen used for MRI?", a: "Hydrogen is the most abundant element in the body (water and fat), has the strongest MR signal due to its high gyromagnetic ratio and single unpaired proton, and provides excellent signal-to-noise ratio." }, { q: "What is the Larmor frequency?", a: "The Larmor frequency is the rate at which protons precess around the B0 axis. It is determined by the equation ω = γ × B0, where γ is the gyromagnetic ratio (42.58 MHz/T for hydrogen) and B0 is the field strength. At 1.5T, the Larmor frequency is 63.87 MHz." }] },
    { slug: "t1-and-t2-relaxation", title: "T1 and T2 Relaxation in MRI", keywords: ["T1 relaxation", "T2 relaxation", "spin-lattice", "spin-spin", "MRI contrast"], overview: "T1 and T2 relaxation are the fundamental processes by which protons return to equilibrium after RF excitation. They determine tissue contrast in MRI and form the basis for different pulse sequences.", mechanism: "T1 relaxation (spin-lattice): recovery of longitudinal magnetization as protons release energy to surrounding tissue. T2 relaxation (spin-spin): loss of transverse magnetization as protons dephase due to interactions with neighboring protons. T2* includes additional dephasing from magnetic field inhomogeneities.", relevance: "T1 and T2 values differ between tissues, creating natural contrast. TR and TE selection determines whether images are T1-weighted, T2-weighted, or proton density-weighted.", pearls: ["T1 recovery: longitudinal magnetization returns to equilibrium. Fat recovers quickly (short T1, bright on T1W).", "T2 decay: transverse magnetization dephases. Fluid has long T2 (bright on T2W).", "T1-weighted: short TR, short TE. T2-weighted: long TR, long TE."], pitfalls: ["Confusing T1 and T2 signal characteristics—fat is bright on T1; fluid is bright on T2.", "Mixing up TR/TE selection for T1 vs T2 weighting."], faq: [{ q: "What is the difference between T1 and T2 relaxation?", a: "T1 (spin-lattice) relaxation is the recovery of longitudinal magnetization—protons return to alignment with B0. T2 (spin-spin) relaxation is the decay of transverse magnetization—protons dephase and lose coherence. T1 determines contrast based on tissue composition; T2 reflects water content and tissue structure." }, { q: "How do TR and TE affect image weighting?", a: "Short TR/Short TE = T1-weighted (anatomy, fat bright). Long TR/Long TE = T2-weighted (pathology, fluid bright). Long TR/Short TE = Proton density-weighted (intermediate contrast)." }] },
    { slug: "mri-pulse-sequences", title: "MRI Pulse Sequences: SE, FSE, GRE", keywords: ["MRI pulse sequences", "spin echo", "fast spin echo", "gradient echo"], overview: "Pulse sequences are the timing and pattern of RF pulses and gradient applications that determine MRI image characteristics. Common sequences include Spin Echo (SE), Fast Spin Echo (FSE/TSE), and Gradient Echo (GRE).", mechanism: "SE uses 90°-180° RF pulse pairs to generate an echo at time TE. FSE uses multiple 180° refocusing pulses per TR (echo train), dramatically reducing scan time. GRE uses gradient reversals instead of 180° pulses, allowing shorter TR and faster scanning.", relevance: "Different pulse sequences provide different tissue contrasts, scanning speeds, and artifact profiles. Selecting the appropriate sequence is critical for demonstrating pathology.", pearls: ["SE: 90°-180° pulse pair; produces true T2 weighting.", "FSE: multiple echoes per TR; fast but may alter fat signal.", "GRE: no 180° refocusing; T2*-weighted; susceptible to magnetic susceptibility artifacts (useful for hemorrhage detection)."], pitfalls: ["Confusing T2 (spin echo) with T2* (gradient echo) weighting.", "Not understanding that GRE is more susceptible to artifacts near metal and air-tissue interfaces."], faq: [{ q: "What is the difference between spin echo and gradient echo?", a: "Spin echo uses a 180° refocusing pulse that corrects for field inhomogeneities, producing true T2 contrast. Gradient echo uses gradient reversals without a 180° pulse, producing T2* contrast that includes field inhomogeneity effects. GRE is faster but more artifact-prone." }, { q: "Why is fast spin echo (FSE) used?", a: "FSE acquires multiple echoes per TR period using an echo train, reducing scan time by the echo train length factor (e.g., 16 echoes = 16× faster). This makes T2-weighted imaging practical in clinical timeframes." }] },
    { slug: "mri-contrast-agents-gadolinium", title: "MRI Contrast Agents: Gadolinium", keywords: ["gadolinium contrast", "MRI contrast", "gadolinium safety", "nephrogenic systemic fibrosis"], overview: "Gadolinium-based contrast agents (GBCAs) are paramagnetic substances used in MRI to enhance tissue contrast by shortening T1 relaxation time. They are essential for vascular imaging, tumor detection, and characterizing enhancing lesions.", mechanism: "Gadolinium (Gd³⁺) is a paramagnetic lanthanide that shortens T1 relaxation of nearby water protons, causing increased signal on T1-weighted images. It is chelated (bound to a ligand) to reduce toxicity. GBCAs are primarily extracellular agents that distribute in the vascular and interstitial spaces.", relevance: "Gadolinium enhancement helps detect tumors, inflammation, infection, and vascular abnormalities. Enhancement patterns provide diagnostic information about lesion vascularity and blood-brain barrier integrity.", pearls: ["Gadolinium shortens T1, making enhancing structures bright on T1-weighted images.", "NSF risk is associated with impaired renal function (GFR < 30 mL/min).", "Gadolinium does not cross the intact blood-brain barrier—enhancement indicates BBB breakdown."], pitfalls: ["Thinking gadolinium shortens T2 (it primarily shortens T1).", "Not screening for renal function before gadolinium administration."], faq: [{ q: "How does gadolinium work?", a: "Gadolinium is paramagnetic—it creates local magnetic field inhomogeneities that accelerate T1 relaxation of nearby water protons. This causes tissues with gadolinium to appear brighter on T1-weighted images. Enhancement indicates increased vascularity or blood-brain barrier disruption." }, { q: "What is nephrogenic systemic fibrosis (NSF)?", a: "NSF is a rare but serious condition associated with gadolinium exposure in patients with severely impaired renal function (GFR < 30). It causes fibrosis of skin and internal organs. Using group II (macrocyclic) agents and screening renal function before administration minimizes risk." }] },
    { slug: "mri-safety-screening", title: "MRI Safety and Screening", keywords: ["MRI safety", "MRI screening", "ferromagnetic objects", "MRI zones", "implant safety"], overview: "MRI safety involves protecting patients, staff, and visitors from the hazards of the strong static magnetic field, radiofrequency energy, and time-varying gradients. Rigorous screening protocols prevent injuries and deaths.", mechanism: "The static magnetic field attracts ferromagnetic objects (projectile effect), induces currents in conductive implants (heating), and can cause device malfunction. RF energy deposits heat in tissue (SAR—Specific Absorption Rate). Gradient coils produce acoustic noise exceeding 100 dB.", relevance: "MRI-related injuries and deaths have occurred from projectile effects, implant heating, and device malfunction. Proper screening is a life-safety issue, not merely a quality concern.", pearls: ["The 5 Gauss line defines the boundary of the controlled area.", "MRI zones: Zone I (public), Zone II (interface), Zone III (controlled), Zone IV (scanner room).", "ALL patients must be screened with a standardized questionnaire before entering Zone III.", "Ferromagnetic implants, shrapnel, and some cardiac devices are absolute contraindications."], pitfalls: ["Thinking MRI is harmless because it doesn't use radiation—MRI has its own serious safety hazards.", "Not screening patients thoroughly—pacemakers, cochlear implants, and ferromagnetic foreign bodies can be fatal."], faq: [{ q: "What are the MRI safety zones?", a: "Zone I: General public area. Zone II: Interface between public and MRI suite. Zone III: Restricted access, controlled area where magnetic field effects are present. Zone IV: The MRI scanner room itself. Access becomes progressively more restricted, with screening required before entering Zone III." }, { q: "Why is ferromagnetic screening critical?", a: "The strong static magnetic field exerts a powerful attractive force on ferromagnetic objects. Loose objects become projectiles. Ferromagnetic implants can be pulled, heated, or have induced currents. There have been documented MRI-related deaths from projectile oxygen tanks and ferromagnetic implant complications." }] },
    { slug: "diffusion-weighted-imaging-dwi", title: "Diffusion-Weighted Imaging (DWI)", keywords: ["diffusion weighted imaging", "DWI", "ADC map", "acute stroke MRI"], overview: "Diffusion-Weighted Imaging (DWI) measures the random (Brownian) motion of water molecules in tissue. Restricted diffusion (bright on DWI, dark on ADC map) is the hallmark of acute ischemic stroke and is also useful for tumor characterization and abscess detection.", mechanism: "DWI uses paired diffusion-sensitizing gradients that dephase and rephase moving water protons. Freely moving water dephases completely and loses signal. Restricted water (as in cytotoxic edema) retains signal, appearing bright. The ADC map removes T2 shine-through effects.", relevance: "DWI is the most sensitive sequence for detecting acute ischemic stroke within minutes of onset, weeks before CT shows changes. It also helps differentiate brain abscesses from necrotic tumors and characterize tumors.", pearls: ["Acute stroke: bright on DWI, dark on ADC map (true restricted diffusion).", "T2 shine-through: bright on DWI, bright on ADC (not true restriction).", "Always check ADC map to confirm true diffusion restriction.", "DWI detects acute stroke within minutes; CT may be normal for 6-12 hours."], pitfalls: ["Not checking the ADC map—T2 shine-through can mimic restricted diffusion on DWI alone.", "Confusing DWI and ADC signal patterns in acute stroke."], faq: [{ q: "How does DWI detect acute stroke?", a: "In acute ischemic stroke, cytotoxic edema causes cellular swelling that restricts water molecule movement. DWI detects this restricted diffusion as a bright area. This is visible within minutes of stroke onset, making DWI the most sensitive early detection method." }, { q: "What is T2 shine-through?", a: "T2 shine-through occurs when a lesion with long T2 (e.g., cyst, edema) appears bright on DWI not because of restricted diffusion, but because of inherent T2 signal. The ADC map will be bright (not dark), distinguishing it from true restricted diffusion." }] },
    { slug: "fat-suppression-techniques-mri", title: "Fat Suppression Techniques in MRI", keywords: ["fat suppression MRI", "STIR", "chemical fat sat", "Dixon technique"], overview: "Fat suppression techniques eliminate fat signal from MRI images to improve visualization of pathology, enhance conspicuity of enhancing lesions, and differentiate fat-containing from non-fat-containing lesions.", mechanism: "Chemical fat saturation: applies an RF pulse at fat's Larmor frequency to selectively saturate fat signal. STIR: uses an inversion pulse with TI chosen to null fat signal (~150 ms at 1.5T). Dixon: uses in-phase and out-of-phase imaging to mathematically separate water and fat.", relevance: "Fat suppression is essential for post-contrast imaging (distinguishing enhancement from fat), musculoskeletal imaging (detecting bone marrow edema), and characterizing fatty lesions.", pearls: ["STIR is more uniform than chemical fat sat, especially at extremity field strengths.", "Chemical fat sat requires homogeneous B0 field and fails near metal.", "Dixon technique produces separate water-only and fat-only images simultaneously.", "STIR should NOT be used after gadolinium (it suppresses enhanced tissue signal too)."], pitfalls: ["Using STIR after contrast administration—STIR nulls all short-T1 signal including enhancement.", "Expecting chemical fat sat to work near metal implants—it will fail due to field inhomogeneity."], faq: [{ q: "What is the difference between STIR and chemical fat saturation?", a: "STIR uses an inversion recovery technique to null fat based on its T1 value—it is uniform but non-specific (suppresses anything with short T1, including gadolinium-enhanced tissue). Chemical fat sat applies a frequency-selective pulse to saturate only fat, but it requires homogeneous B0 and fails near metal." }, { q: "When should fat suppression be used?", a: "Post-contrast T1-weighted imaging (distinguishes enhancement from fat), musculoskeletal imaging (detects bone marrow edema), characterization of fatty masses (lipoma, hepatic steatosis), and breast MRI (improves lesion conspicuity)." }] },
    { slug: "mri-artifacts-and-remedies", title: "MRI Artifacts and Remedies", keywords: ["MRI artifacts", "chemical shift artifact", "susceptibility artifact", "motion artifact MRI", "aliasing"], overview: "MRI artifacts are features in the image not present in the actual anatomy. Common artifacts include motion, chemical shift, susceptibility, aliasing (wraparound), and truncation artifacts. Understanding causes and remedies is essential.", mechanism: "Motion artifacts create ghosts along the phase-encoding direction. Chemical shift occurs due to different resonant frequencies of fat and water. Susceptibility artifacts occur at interfaces between materials with different magnetic properties. Aliasing occurs when anatomy extends beyond the FOV.", relevance: "Artifacts can mimic or obscure pathology. Proper identification prevents misdiagnosis, and knowledge of remedies allows correction.", pearls: ["Motion artifacts always appear in the phase-encoding direction.", "Chemical shift increases with field strength and decreases with wider bandwidth.", "Susceptibility artifacts are useful for detecting hemorrhage (GRE sequences).", "Aliasing is corrected by oversampling (increasing FOV in the phase direction)."], pitfalls: ["Not recognizing that motion artifacts are always in the phase-encoding direction.", "Confusing chemical shift artifact with actual pathology at fat-water interfaces."], faq: [{ q: "Why do motion artifacts appear in the phase-encoding direction?", a: "Phase encoding takes much longer than frequency encoding (the full TR period vs. milliseconds). During this time, patient motion causes inconsistent phase data. Since frequency encoding occurs almost instantaneously, motion has minimal effect in that direction." }, { q: "How do you correct aliasing (wraparound)?", a: "Oversampling: increase the FOV in the phase-encoding direction without increasing scan time. Saturation bands: place outside the FOV to suppress signal from wrapping anatomy. Swap phase and frequency directions if aliasing is less problematic in the other direction." }] },
    { slug: "mr-angiography-techniques", title: "MR Angiography (MRA) Techniques", keywords: ["MR angiography", "MRA", "time of flight", "contrast enhanced MRA", "phase contrast"], overview: "MR Angiography (MRA) visualizes blood vessels without ionizing radiation. Major techniques include Time-of-Flight (TOF), Phase Contrast (PC), and Contrast-Enhanced MRA (CE-MRA). Each has specific strengths and limitations.", mechanism: "TOF MRA: unsaturated (bright) inflowing blood provides contrast against saturated stationary tissue. PC MRA: velocity-induced phase shifts in flowing blood provide vascular signal. CE-MRA: gadolinium in the bloodstream shortens T1, making vessels bright on T1-weighted images.", relevance: "MRA is used for carotid disease, intracranial aneurysms, renal artery stenosis, and peripheral vascular disease, offering a non-invasive alternative to catheter angiography.", pearls: ["TOF is best for intracranial arteries; no contrast needed.", "CE-MRA is best for aorta, renal, and peripheral vessels.", "Phase contrast can quantify flow velocity and direction.", "TOF can overestimate stenosis due to flow-related signal loss."], pitfalls: ["Using TOF MRA for slow-flow situations (signal loss mimics occlusion).", "Not understanding that TOF overestimates stenosis at areas of turbulent flow."], faq: [{ q: "What is Time-of-Flight MRA?", a: "TOF MRA relies on the flow-related enhancement of unsaturated blood entering a saturated imaging slab. Inflowing blood has not received repeated RF pulses and therefore has full magnetization, appearing bright against the suppressed stationary tissue." }, { q: "When is contrast-enhanced MRA preferred?", a: "CE-MRA is preferred for large vessels (aorta, renal arteries), peripheral vascular disease, and situations where TOF has limitations (slow flow, complex geometry). It provides more uniform vessel opacification and is less susceptible to flow-related artifacts." }] },
    { slug: "flair-sequence-mri", title: "FLAIR Sequence in MRI", keywords: ["FLAIR MRI", "fluid attenuated inversion recovery", "brain MRI", "white matter lesions"], overview: "Fluid-Attenuated Inversion Recovery (FLAIR) is an MRI pulse sequence that suppresses cerebrospinal fluid (CSF) signal while maintaining T2-like tissue contrast. It is invaluable for detecting periventricular and cortical lesions.", mechanism: "FLAIR uses an inversion recovery preparation with a long TI (~2200 ms at 1.5T) to null CSF signal. The remaining image has T2-like contrast but without the bright CSF that often obscures adjacent pathology on conventional T2-weighted images.", relevance: "FLAIR is the primary sequence for detecting white matter lesions (MS plaques), subarachnoid hemorrhage, meningitis, and cortical/periventricular pathology that is obscured by bright CSF on T2.", pearls: ["FLAIR = T2 contrast with dark CSF.", "Essential for multiple sclerosis plaque detection.", "Subarachnoid hemorrhage appears bright on FLAIR (normally dark CSF becomes bright).", "Periventricular lesions are much more conspicuous on FLAIR than conventional T2."], pitfalls: ["Confusing FLAIR with STIR—FLAIR nulls CSF (long T1), STIR nulls fat (short T1).", "Not including FLAIR in brain MRI protocols."], faq: [{ q: "What does FLAIR show that T2 does not?", a: "FLAIR reveals lesions adjacent to CSF spaces (periventricular, cortical) that are obscured by bright CSF on T2. With CSF suppressed, these lesions stand out as bright spots against the dark CSF background. FLAIR is also more sensitive for subarachnoid hemorrhage." }, { q: "Why is FLAIR important for multiple sclerosis?", a: "MS plaques often occur in periventricular white matter. On T2, these bright plaques are adjacent to equally bright CSF and may be invisible. On FLAIR, the dark CSF makes these bright plaques highly conspicuous, allowing accurate lesion counting and monitoring." }] },
    { slug: "mri-k-space", title: "MRI K-Space and Data Acquisition", keywords: ["k-space MRI", "spatial frequency", "MRI data acquisition", "phase encoding"], overview: "K-space is the mathematical data space where MRI raw data is stored before image reconstruction. Understanding k-space is essential for comprehending MRI acquisition speed, resolution, and artifact behavior.", mechanism: "K-space is a matrix of spatial frequency data. Each line of k-space is acquired during one phase-encoding step. The center of k-space contains contrast information (low spatial frequencies), while the periphery contains detail information (high spatial frequencies). The image is reconstructed by applying a 2D Fourier transform.", relevance: "K-space concepts explain why motion artifacts appear in the phase-encoding direction, how partial Fourier and parallel imaging accelerate scans, and why some sequences have different contrast from others.", pearls: ["Center of k-space = image contrast (low spatial frequencies).", "Periphery of k-space = image detail/edges (high spatial frequencies).", "Filling k-space faster = shorter scan time (parallel imaging, partial Fourier).", "The number of phase-encoding steps determines scan time."], pitfalls: ["Not understanding that scan time is primarily determined by TR × number of phase-encoding steps × NEX.", "Confusing k-space center (contrast) with periphery (detail)."], faq: [{ q: "What information does the center of k-space contain?", a: "The center of k-space contains low spatial frequency data that determines the overall signal, contrast, and general shapes in the image. If only the center of k-space were acquired, you would see a blurry version of the image with correct contrast but no fine detail." }, { q: "How does parallel imaging speed up MRI?", a: "Parallel imaging uses multiple receiver coils with known spatial sensitivity profiles to skip phase-encoding steps in k-space. The missing data is reconstructed using coil sensitivity information. This reduces scan time by a factor of 2-4 while maintaining spatial resolution." }] },
    { slug: "functional-mri-fmri", title: "Functional MRI (fMRI)", keywords: ["functional MRI", "fMRI", "BOLD", "brain mapping", "neurovascular coupling"], overview: "Functional MRI (fMRI) detects brain activity by measuring changes in blood oxygenation using the BOLD (Blood Oxygenation Level Dependent) contrast mechanism. It is used for pre-surgical brain mapping and neuroscience research.", mechanism: "Neural activity increases local blood flow and oxygen delivery, changing the ratio of oxyhemoglobin to deoxyhemoglobin. Deoxyhemoglobin is paramagnetic and causes signal loss on T2*-weighted images. Increased blood flow increases oxyhemoglobin (diamagnetic), reducing signal loss and causing a local signal increase.", relevance: "fMRI is used clinically for pre-surgical mapping of eloquent cortex (motor, language, visual areas) and in research for understanding brain function, connectivity, and disorders.", pearls: ["BOLD effect: increased neural activity → increased blood flow → decreased deoxyhemoglobin → increased T2* signal.", "fMRI detects hemodynamic changes, not direct neural activity.", "The BOLD response is delayed ~5-8 seconds after neural activity (hemodynamic lag)."], pitfalls: ["Thinking fMRI directly measures neural electrical activity—it measures hemodynamic changes.", "Not accounting for the 5-8 second hemodynamic delay in experimental design."], faq: [{ q: "What does BOLD stand for?", a: "Blood Oxygenation Level Dependent. It refers to the MRI signal change caused by the ratio of oxyhemoglobin (diamagnetic, no signal effect) to deoxyhemoglobin (paramagnetic, causes signal loss). Active brain regions have increased blood flow and higher oxyhemoglobin levels, producing increased signal." }, { q: "What is fMRI used for clinically?", a: "Pre-surgical brain mapping to identify eloquent cortex (motor strip, language areas, visual cortex) before tumor resection or epilepsy surgery. This helps surgeons plan approaches that preserve critical brain functions." }] }
  ]);

  // =====================================================
  // CATEGORY 6: Image Production & Evaluation (14 entries)
  // =====================================================
  addCategory("Image Production & Evaluation", [
    { slug: "spatial-resolution-radiography", title: "Spatial Resolution in Radiography", keywords: ["spatial resolution", "line pairs per mm", "image sharpness", "recorded detail"], overview: "Spatial resolution (recorded detail) refers to the ability of an imaging system to distinguish small, closely spaced structures. It is measured in line pairs per millimeter (lp/mm) and is affected by focal spot size, motion, SID, OID, and receptor characteristics.", mechanism: "Spatial resolution is limited by geometric factors (focal spot size, magnification), receptor factors (detector element size, pixel pitch), and motion. The smallest resolvable detail is determined by the weakest link in this chain.", relevance: "High spatial resolution is essential for visualizing fine structures like trabecular bone, small calcifications, and fracture lines. Understanding factors affecting resolution helps optimize technique.", pearls: ["Small focal spot improves spatial resolution.", "Increasing SID and decreasing OID reduce geometric unsharpness.", "Motion is often the limiting factor in clinical practice.", "Digital detector pixel size determines the maximum achievable spatial resolution."], pitfalls: ["Focusing only on focal spot size while ignoring motion as a resolution factor.", "Not understanding that digital detectors have a fixed spatial resolution limit based on pixel size."], faq: [{ q: "What is spatial resolution measured in?", a: "Line pairs per millimeter (lp/mm). One line pair consists of one opaque and one transparent line. Higher lp/mm values indicate better spatial resolution. Typical screen-film: 5-10 lp/mm; digital radiography: 2.5-5 lp/mm." }, { q: "How do you maximize spatial resolution?", a: "Use the smallest focal spot appropriate for the study, minimize OID, maximize SID, use the shortest possible exposure time (reduce motion), and use a high-resolution detector." }] },
    { slug: "contrast-resolution-radiography", title: "Contrast Resolution in Radiography", keywords: ["contrast resolution", "image contrast", "subject contrast", "detector contrast"], overview: "Contrast resolution is the ability to distinguish between structures with similar attenuation. It is determined by subject contrast (tissue differences), detector contrast (receptor response), and image processing.", mechanism: "Subject contrast depends on tissue thickness, density, atomic number, and beam energy. Detector contrast depends on the receptor's response to different exposure levels. Digital systems have superior contrast resolution due to post-processing capabilities and wide dynamic range.", relevance: "Contrast resolution determines the ability to detect subtle pathology such as soft tissue masses, early pneumonia, and small effusions.", pearls: ["Lower kVp increases contrast (more photoelectric effect, less scatter).", "Digital systems have greater contrast resolution than film-screen systems.", "Post-processing (windowing) can optimize contrast after acquisition.", "Scatter reduces contrast—collimation and grids improve it."], pitfalls: ["Thinking spatial resolution and contrast resolution are the same thing.", "Not understanding that digital post-processing can improve contrast but not spatial resolution."], faq: [{ q: "What is the difference between spatial and contrast resolution?", a: "Spatial resolution is the ability to see fine detail (small structures close together). Contrast resolution is the ability to distinguish between structures with similar densities. CT and MRI have superior contrast resolution; radiography has superior spatial resolution." }, { q: "How does kVp affect contrast?", a: "Lower kVp increases subject contrast by shifting more interactions to the photoelectric effect, which is strongly dependent on atomic number differences. Higher kVp decreases contrast by shifting to Compton scatter, which is less dependent on tissue composition." }] },
    { slug: "digital-image-characteristics", title: "Digital Image Characteristics: Matrix, Pixel, Bit Depth", keywords: ["digital image matrix", "pixel size", "bit depth", "spatial resolution digital"], overview: "Digital radiographic images are composed of a matrix of picture elements (pixels), each assigned a numerical value representing the x-ray attenuation at that location. Matrix size, pixel size, and bit depth determine image quality.", mechanism: "The image matrix consists of rows and columns of pixels. Pixel size = FOV / matrix size. Smaller pixels provide higher spatial resolution. Bit depth determines the number of possible gray levels: 10-bit = 1024 values, 12-bit = 4096 values, 14-bit = 16,384 values.", relevance: "Understanding digital image parameters is essential for optimizing image quality, managing file sizes, and setting appropriate display parameters.", pearls: ["Pixel size = FOV / matrix size. Smaller pixels = better resolution but larger file size.", "Most DR systems use 14-bit depth (16,384 gray levels).", "The human eye can only distinguish ~30 shades of gray—windowing maps the full range to visible levels.", "Nyquist frequency: maximum spatial resolution = 1/(2 × pixel size)."], pitfalls: ["Thinking more pixels always means better image quality—noise increases with smaller pixels if dose is not adjusted.", "Not understanding that bit depth determines contrast resolution, not spatial resolution."], faq: [{ q: "How does matrix size affect image quality?", a: "Larger matrix (more pixels) = smaller pixel size = better spatial resolution, but also more noise per pixel (requiring higher dose) and larger file sizes. The matrix size must be matched to the clinical need and available dose." }, { q: "What is bit depth?", a: "Bit depth determines the number of possible gray values each pixel can represent. A 10-bit image has 1,024 gray levels; a 14-bit image has 16,384 gray levels. Greater bit depth provides better contrast resolution and more flexibility for post-processing." }] },
    { slug: "exposure-indicator-and-deviation-index", title: "Exposure Indicator and Deviation Index", keywords: ["exposure indicator", "deviation index", "S number", "digital radiography exposure"], overview: "Exposure indicators (EI) quantify the amount of radiation reaching the digital image receptor. The deviation index (DI) compares the actual EI to the target EI for the specific examination, indicating whether the exposure was appropriate.", mechanism: "Each DR manufacturer uses a different EI system (some proportional to dose, some inversely proportional). The AAPM/IEC standardized EI system makes EI directly proportional to detector dose. DI = 10 × log₁₀(EI/EI_target). DI of 0 = perfect; positive = overexposure; negative = underexposure.", relevance: "EI monitoring is essential for dose optimization. Unlike film, digital images can compensate for exposure errors through processing, but the patient still receives the dose. EI tracking prevents dose creep (gradual overexposure over time).", pearls: ["Standardized DI: 0 = correct, +1 = ~26% overexposure, -1 = ~20% underexposure.", "Acceptable DI range: -1 to +1 for most examinations.", "EI is NOT a patient dose measurement—it indicates detector dose.", "Dose creep: digital images look acceptable even with excessive dose, so overexposure goes unnoticed without EI monitoring."], pitfalls: ["Confusing EI with patient dose—EI measures detector dose, not patient dose.", "Not understanding that different manufacturers use different EI scales (some are inversely proportional to dose)."], faq: [{ q: "What is dose creep?", a: "Dose creep is the gradual, unintentional increase in patient dose over time in digital radiography. Because digital systems can produce acceptable-looking images over a wide exposure range, technologists may not notice overexposure. Without EI monitoring, dose can increase 2-4 times without visible image degradation." }, { q: "What does a deviation index of +3 mean?", a: "A DI of +3 indicates the detector received approximately 2× the target exposure (each +1 ≈ 26% overexposure). The patient received about twice the intended dose. While the image may look acceptable, technique should be reduced for future similar examinations." }] },
    { slug: "image-noise-and-quantum-mottle", title: "Image Noise and Quantum Mottle", keywords: ["image noise", "quantum mottle", "SNR", "signal to noise ratio"], overview: "Image noise refers to random fluctuations in image brightness that degrade image quality. Quantum mottle (quantum noise) is the dominant noise source in properly exposed digital radiographs and results from the statistical variation in x-ray photon detection.", mechanism: "Quantum mottle follows Poisson statistics: noise = √(number of photons). Signal-to-noise ratio (SNR) improves with the square root of the number of photons. Doubling mAs only improves SNR by √2 (41%). Electronic noise, structural noise, and scatter also contribute.", relevance: "Excessive noise obscures low-contrast pathology. Insufficient dose produces visible mottle. Noise reduction through increased dose must be balanced against radiation protection.", pearls: ["Quantum noise is inversely related to the square root of dose—doubling dose only reduces noise by 29%.", "SNR = signal / noise. Higher SNR = better image quality.", "To double SNR, you must quadruple the dose (4× mAs).", "Larger pixels reduce noise (average more photons) but reduce spatial resolution."], pitfalls: ["Thinking doubling mAs halves noise—it only reduces it by 29%.", "Not understanding the trade-off between noise and spatial resolution with pixel size."], faq: [{ q: "What is quantum mottle?", a: "Quantum mottle is the statistical variation in the number of x-ray photons detected by each pixel in the image receptor. It follows Poisson statistics: the standard deviation of photon counts equals the square root of the mean count. Fewer photons = more visible mottle." }, { q: "How do you reduce image noise?", a: "Increase mAs (more photons, but increases patient dose). Use larger detector elements (average more photons per pixel, but reduces spatial resolution). Apply post-processing noise reduction algorithms. Optimize kVp for the body part to maximize detected photons." }] },
    { slug: "computed-radiography-cr-systems", title: "Computed Radiography (CR) Systems", keywords: ["computed radiography", "CR", "photostimulable phosphor", "imaging plate", "PSP"], overview: "Computed Radiography (CR) uses photostimulable phosphor (PSP) imaging plates that store the x-ray image as a latent image in the phosphor crystal structure. The plate is scanned by a laser reader to extract the image data.", mechanism: "PSP plates (typically barium fluorohalide doped with europium) trap x-ray energy in metastable electron states (F-centers). During readout, a focused laser beam stimulates the trapped electrons, causing photostimulated luminescence (PSL) proportional to the original x-ray exposure.", relevance: "CR was the transitional technology between film-screen and direct digital radiography. While being replaced by DR in many facilities, CR systems remain widely used globally.", pearls: ["CR plates can be reused thousands of times.", "The plate must be thoroughly erased before reuse (high-intensity light exposure).", "Image fading: plates should be read within 8 hours of exposure; delay causes signal loss.", "CR has lower detective quantum efficiency (DQE) than DR flat panels."], pitfalls: ["Not understanding that CR plates lose signal over time (should be read promptly).", "Thinking CR and DR are the same technology—they use fundamentally different detection mechanisms."], faq: [{ q: "How does a CR imaging plate work?", a: "The PSP plate absorbs x-ray energy and stores it as trapped electrons in the crystal lattice (F-centers). When scanned by a red laser during readout, these electrons are stimulated to a higher energy state and then release the stored energy as blue-green light (photostimulated luminescence), which is detected by a photomultiplier tube." }, { q: "What is the difference between CR and DR?", a: "CR uses portable imaging plates that are exposed in cassettes and then processed in a separate reader. DR uses fixed or portable flat-panel detectors that capture and digitize the image directly, providing immediate image display without a separate readout step." }] },
    { slug: "direct-digital-radiography-dr", title: "Direct Digital Radiography (DR) Systems", keywords: ["digital radiography", "DR", "flat panel detector", "amorphous silicon", "amorphous selenium"], overview: "Direct Digital Radiography (DR) uses flat-panel detectors that convert x-ray energy directly into digital signals without an intermediate processing step. There are two main types: indirect (scintillator-based) and direct conversion detectors.", mechanism: "Indirect DR: X-rays strike a scintillator (cesium iodide or gadolinium oxysulfide) that converts them to light, which is then detected by an amorphous silicon photodiode array. Direct DR: X-rays strike an amorphous selenium layer that directly produces electron-hole pairs, creating an electrical signal.", relevance: "DR provides immediate image display, higher DQE than CR, and superior workflow efficiency. It is the current standard for digital radiography.", pearls: ["CsI scintillators have columnar structure that reduces light spread, improving resolution.", "Direct conversion (a-Se) has better spatial resolution than indirect conversion.", "DR provides immediate image availability (2-5 seconds vs. CR's 30-90 seconds).", "DQE measures how efficiently the detector uses the x-ray photons it receives."], pitfalls: ["Confusing indirect and direct conversion DR systems.", "Thinking DR eliminates the need for proper technique—overexposure still increases patient dose."], faq: [{ q: "What is the advantage of DR over CR?", a: "DR provides higher detective quantum efficiency (DQE), meaning better image quality at the same dose (or equal quality at lower dose). DR also provides immediate image display, eliminating the cassette handling and plate reading steps of CR." }, { q: "What is DQE?", a: "Detective Quantum Efficiency measures how effectively a detector converts incident x-ray photons into a useful signal. Higher DQE means the detector wastes fewer photons, producing better image quality for a given patient dose. DR typically has DQE of 60-75% vs. CR's 25-35%." }] },
    { slug: "image-processing-and-post-processing", title: "Digital Image Processing and Post-Processing", keywords: ["image processing", "DICOM", "look-up table", "histogram analysis", "edge enhancement"], overview: "Digital image processing applies mathematical operations to the raw detector data to optimize the image for display and diagnosis. Processing steps include histogram analysis, look-up table application, edge enhancement, and noise reduction.", mechanism: "The raw detector data undergoes several processing steps: offset and gain correction (flat-field correction), histogram analysis to determine the exposure range, values of interest (VOI) determination, grayscale rendering using look-up tables (LUT), and optional enhancements (edge enhancement, noise reduction).", relevance: "Understanding image processing helps technologists troubleshoot image quality problems, select appropriate processing parameters, and understand the limitations of post-processing.", pearls: ["Histogram analysis determines the minimum and maximum useful signal values.", "LUT maps digital values to displayed gray levels.", "Edge enhancement improves visibility of borders but can increase noise.", "Post-processing cannot create information that was not captured by the detector."], pitfalls: ["Relying on post-processing to fix poor technique—overexposed images still deliver excess dose.", "Not understanding that processing can mask underexposure or overexposure."], faq: [{ q: "What is a look-up table (LUT)?", a: "A LUT maps the detector's digital values to displayed gray levels. Different LUTs produce different image appearances from the same raw data. Anatomy-specific LUTs optimize contrast for particular body parts (chest, bone, abdomen)." }, { q: "Can post-processing fix a bad image?", a: "Post-processing can optimize display of captured data but cannot create information that was not captured. An underexposed image will have excessive noise regardless of processing. An overexposed image will have good quality but the patient received unnecessary dose. Proper technique at acquisition is always essential." }] },
    { slug: "reject-analysis-and-repeat-rates", title: "Reject Analysis and Repeat Rates", keywords: ["reject analysis", "repeat rate", "image quality assurance", "radiograph rejection"], overview: "Reject analysis is a quality assurance process that tracks and analyzes the reasons for repeated radiographic examinations. The goal is to identify causes of rejected images and implement corrective actions to reduce repeat rates and patient dose.", mechanism: "Every rejected or repeated image is documented with the reason for rejection: positioning error, exposure error, motion, artifacts, processing error, or equipment malfunction. Data is analyzed to identify patterns, problem areas, and training needs.", relevance: "Repeat examinations are the most significant controllable source of unnecessary patient radiation dose. An acceptable departmental repeat rate is typically 4-6%. Higher rates indicate quality issues requiring intervention.", pearls: ["Acceptable repeat rate: 4-6% (< 4% may indicate over-acceptance of suboptimal images).", "Positioning errors are the most common cause of repeated images.", "Each repeat doubles the patient's dose for that examination.", "Reject analysis is a regulatory requirement in many jurisdictions."], pitfalls: ["Thinking a 0% repeat rate is ideal—it may mean suboptimal images are being accepted.", "Not analyzing rejection patterns to identify training needs."], faq: [{ q: "What is an acceptable repeat rate?", a: "Generally 4-6%. Below 4% may indicate that suboptimal images are being accepted rather than repeated. Above 6% suggests quality problems (positioning, technique, or equipment) that need investigation. Specific acceptable rates may vary by facility and examination type." }, { q: "What is the most common cause of repeated images?", a: "Positioning errors are consistently the most common cause of repeated radiographs, accounting for approximately 30-50% of repeats. This highlights the importance of proper positioning skills and ongoing technologist education." }] },
    { slug: "dicom-and-pacs-fundamentals", title: "DICOM and PACS Fundamentals", keywords: ["DICOM", "PACS", "picture archiving", "medical image storage", "RIS"], overview: "DICOM (Digital Imaging and Communications in Medicine) is the standard protocol for transmitting, storing, and displaying medical images. PACS (Picture Archiving and Communication System) is the infrastructure for managing digital medical images.", mechanism: "DICOM defines data formats, communication protocols, and services for medical imaging. It includes the image data, patient demographics, and acquisition parameters in a standardized format. PACS consists of acquisition devices, storage servers, display workstations, and network infrastructure.", relevance: "DICOM and PACS are the backbone of modern medical imaging departments. Understanding these systems is essential for workflow management, image quality, and troubleshooting.", pearls: ["DICOM is a standard, not a product—it ensures interoperability between different vendors.", "PACS components: modality (acquisition), server (storage/archive), workstation (display), network.", "DICOM stores metadata (patient info, technique) with every image.", "Lossless compression preserves all image data; lossy compression discards some data irreversibly."], pitfalls: ["Confusing DICOM (communication standard) with PACS (infrastructure system).", "Not understanding that lossy compression permanently removes image data."], faq: [{ q: "What is DICOM?", a: "Digital Imaging and Communications in Medicine—a universal standard that defines how medical images are formatted, transmitted, stored, and displayed. It ensures that images from any vendor's equipment can be viewed and processed by any DICOM-compliant system." }, { q: "What are the components of a PACS?", a: "Acquisition modalities (CT, MRI, DR, etc.), communication network, storage/archive server (short-term RAID, long-term archive), display workstations (diagnostic and clinical review), and RIS/HIS interface for patient and order management." }] }
  ]);

  // =====================================================
  // CATEGORY 7: Contrast Media (12 entries)
  // =====================================================
  addCategory("Contrast Media", [
    { slug: "iodinated-contrast-agents", title: "Iodinated Contrast Agents", keywords: ["iodinated contrast", "contrast media", "ionic contrast", "non-ionic contrast"], overview: "Iodinated contrast agents are radiopaque substances used to enhance visualization of vascular structures and organs in radiography and CT. They are classified as ionic or non-ionic, and monomeric or dimeric.", mechanism: "Iodine atoms absorb x-rays due to the K-edge effect (binding energy of 33.2 keV). The high atomic number of iodine (Z=53) increases photoelectric absorption, making iodine-containing structures appear radiopaque. Non-ionic agents have lower osmolality, resulting in fewer adverse reactions.", relevance: "Contrast-enhanced studies are essential for CT angiography, urography, and organ evaluation. Understanding contrast types, adverse reactions, and contraindications is critical for patient safety.", pearls: ["Non-ionic, low-osmolality agents are standard for IV use due to fewer reactions.", "Iodine K-edge (33.2 keV) is within the diagnostic x-ray energy range, maximizing absorption.", "Warm contrast to body temperature to reduce viscosity and patient discomfort.", "Low-osmolality contrast agents (LOCA) have 2-3× the osmolality of blood; iso-osmolar have ~290 mOsm/kg."], pitfalls: ["Using ionic contrast for IV injection when non-ionic is indicated.", "Not warming contrast before injection."], faq: [{ q: "What is the difference between ionic and non-ionic contrast?", a: "Ionic contrast dissociates into ions in solution, creating higher osmolality and more adverse reactions. Non-ionic contrast does not dissociate, resulting in lower osmolality, fewer reactions, and better patient tolerance. Non-ionic agents are standard for IV use." }, { q: "Why does iodine work as a contrast agent?", a: "Iodine has a high atomic number (Z=53) and its K-edge binding energy (33.2 keV) falls within the diagnostic x-ray energy range. This maximizes photoelectric absorption, making iodine-containing structures appear bright white on radiographs and CT." }] },
    { slug: "contrast-reactions-and-management", title: "Contrast Reactions and Management", keywords: ["contrast reaction", "anaphylactoid reaction", "contrast allergy", "contrast extravasation"], overview: "Adverse reactions to contrast media range from mild (nausea, urticaria) to severe (anaphylaxis, cardiovascular collapse). All imaging personnel must be prepared to recognize and manage reactions.", mechanism: "Most contrast reactions are anaphylactoid (non-IgE mediated), not true allergic reactions. They are dose-independent and unpredictable. Chemotoxic reactions are dose-dependent and related to osmolality, ion content, and viscosity.", relevance: "Contrast reactions can be life-threatening. Rapid recognition and appropriate management are essential. Emergency equipment and medications must be immediately available in all areas where contrast is administered.", pearls: ["Mild reactions: nausea, mild urticaria, warmth. Treatment: observation, antihistamines.", "Moderate reactions: extensive urticaria, bronchospasm, hypotension. Treatment: epinephrine, IV fluids.", "Severe reactions: cardiovascular collapse, laryngeal edema, seizures. Treatment: full resuscitation.", "Risk factors: prior contrast reaction (5× increased risk), asthma, multiple allergies."], pitfalls: ["Not having emergency equipment immediately available during contrast administration.", "Confusing anaphylactoid (most contrast reactions) with true anaphylactic (IgE-mediated) reactions."], faq: [{ q: "What are the risk factors for contrast reactions?", a: "Prior contrast reaction (strongest predictor, 5× risk), asthma, history of multiple allergies, cardiac disease, anxiety, and use of beta-blockers (makes reaction harder to treat with epinephrine). Shellfish allergy is NOT a specific risk factor." }, { q: "How are severe contrast reactions treated?", a: "Call for help, assess ABCs, epinephrine (0.1 mg IV for adults or 0.3 mg IM 1:1000), IV fluids, oxygen, monitor vital signs. For bronchospasm: beta-agonist inhaler. For hypotension: legs elevated, IV fluids, vasopressors if needed. Emergency cart must be immediately available." }] },
    { slug: "contrast-induced-nephropathy", title: "Contrast-Induced Nephropathy (CIN)", keywords: ["contrast nephropathy", "CIN", "renal function contrast", "creatinine contrast"], overview: "Contrast-Induced Nephropathy (CIN) is an acute decline in renal function following iodinated contrast administration, defined as a >25% increase in serum creatinine or an absolute increase of 0.5 mg/dL within 48-72 hours.", mechanism: "CIN results from a combination of renal vasoconstriction, direct tubular toxicity, and osmotic effects of the contrast agent. The outer medulla is particularly vulnerable due to its borderline oxygenation under normal conditions.", relevance: "CIN is the third most common cause of hospital-acquired acute kidney injury. Prevention strategies include hydration, using the minimum contrast volume, and identifying at-risk patients.", pearls: ["Risk factors: pre-existing renal insufficiency (GFR < 60), diabetes, dehydration, high contrast volume, multiple contrast studies.", "Prevention: IV hydration before and after, use minimum contrast volume, avoid nephrotoxic medications.", "eGFR screening is standard before iodinated contrast administration.", "CIN is typically self-limiting, peaking at 3-5 days and resolving in 7-14 days."], pitfalls: ["Not screening renal function before contrast administration.", "Forgetting that metformin should be held after contrast in patients with renal impairment."], faq: [{ q: "What is the creatinine threshold for CIN concern?", a: "An eGFR below 30 mL/min/1.73m² represents high risk for CIN. eGFR 30-60 represents moderate risk. Above 60, CIN risk is very low. Some guidelines use serum creatinine > 1.5 mg/dL as a screening threshold, but eGFR is more accurate." }, { q: "How is CIN prevented?", a: "IV hydration (normal saline or sodium bicarbonate) before and after contrast, use the minimum effective contrast volume, use iso-osmolar or low-osmolar contrast, avoid concurrent nephrotoxic drugs, and allow adequate time between contrast procedures." }] },
    { slug: "barium-contrast-studies", title: "Barium Contrast Studies", keywords: ["barium sulfate", "barium swallow", "upper GI series", "barium enema"], overview: "Barium sulfate is an inert, radiopaque contrast agent used for fluoroscopic evaluation of the gastrointestinal tract. It is available in various concentrations for different applications including barium swallow, upper GI series, small bowel follow-through, and barium enema.", mechanism: "Barium sulfate (BaSO₄) has a high atomic number (Ba Z=56) that absorbs x-rays through the photoelectric effect. It coats the mucosal surface of the GI tract, creating contrast between the lumen, mucosal surface, and surrounding tissues.", relevance: "Barium studies remain important for evaluating swallowing disorders, GI motility, mucosal detail, and fistulae. They complement endoscopy and CT for comprehensive GI evaluation.", pearls: ["NEVER use barium if perforation is suspected—use water-soluble contrast (Gastrografin).", "Barium causes severe peritonitis if it leaks into the peritoneal cavity.", "Double-contrast technique uses thin barium coating plus air distension for mucosal detail.", "Single-contrast uses thick barium to fill and outline the lumen."], pitfalls: ["Administering barium when perforation is suspected—this can cause fatal peritonitis.", "Confusing single-contrast (filled lumen) with double-contrast (thin coating + air)."], faq: [{ q: "Why is barium contraindicated when perforation is suspected?", a: "Barium sulfate in the peritoneal cavity causes severe chemical peritonitis with high mortality. It cannot be absorbed and creates a foreign body reaction. Water-soluble contrast (Gastrografin) is used instead, as it is absorbed by the peritoneum without causing peritonitis." }, { q: "What is a double-contrast barium study?", a: "A technique that uses a thin barium coating on the mucosal surface combined with air distension of the lumen. This provides excellent mucosal detail for detecting small lesions, polyps, and ulcers. Air is introduced via effervescent agents (swallowed) or insufflation (enema)." }] },
    { slug: "contrast-premedication-protocols", title: "Contrast Premedication Protocols", keywords: ["contrast premedication", "steroid premedication", "contrast allergy prevention", "prednisone protocol"], overview: "Premedication protocols using corticosteroids and antihistamines are administered to patients with prior contrast reactions to reduce the risk of subsequent reactions. The standard protocol requires at least 12-13 hours before contrast administration.", mechanism: "Corticosteroids (prednisone/methylprednisolone) reduce the inflammatory and immune-mediated components of anaphylactoid reactions. Antihistamines (diphenhydramine) block histamine-mediated effects. The combination reduces reaction rates from ~35% to ~10% in patients with prior reactions.", relevance: "Proper premedication is essential for patient safety when contrast must be administered to at-risk patients. Emergency preparedness remains critical as premedication does not eliminate all risk.", pearls: ["Standard protocol: prednisone 50 mg at 13, 7, and 1 hour before contrast + diphenhydramine 50 mg 1 hour before.", "Premedication reduces but does not eliminate reaction risk (~35% → ~10%).", "Emergency medications must still be available even with premedication.", "A 13-hour protocol is standard; accelerated protocols are available but less effective."], pitfalls: ["Thinking premedication eliminates all risk—it reduces but does not eliminate reactions.", "Using an accelerated protocol when a standard 13-hour protocol is feasible."], faq: [{ q: "What is the standard premedication protocol?", a: "Prednisone 50 mg orally at 13 hours, 7 hours, and 1 hour before contrast administration, plus diphenhydramine 50 mg (oral, IM, or IV) 1 hour before. This 13-hour protocol reduces the risk of repeat reaction from approximately 35% to approximately 10%." }, { q: "Is premedication always effective?", a: "No. Premedication reduces the incidence and severity of reactions but does not eliminate them entirely. Breakthrough reactions can still occur. Emergency equipment and trained personnel must be available whenever contrast is administered, regardless of premedication." }] },
    { slug: "water-soluble-contrast-agents", title: "Water-Soluble Contrast Agents (Gastrointestinal)", keywords: ["water soluble contrast", "Gastrografin", "diatrizoate", "GI contrast"], overview: "Water-soluble contrast agents (such as Gastrografin/diatrizoate meglumine) are used for GI studies when barium is contraindicated, particularly when perforation is suspected. They are hyperosmolar and absorbed from the peritoneum.", mechanism: "Water-soluble iodinated agents are absorbed from the GI tract and peritoneal cavity, unlike barium. If leakage occurs through a perforation, the agent is absorbed without causing peritonitis. However, high osmolality can draw fluid into the bowel.", relevance: "Essential alternative to barium when GI perforation is suspected. Also used when surgery is planned within 24 hours or when a CT will follow the GI study.", pearls: ["Water-soluble contrast is the standard when perforation is suspected.", "Aspiration risk: Gastrografin can cause severe pulmonary edema if aspirated—use iso-osmolar agents for aspiration-prone patients.", "Water-soluble agents provide less mucosal detail than barium.", "CT of the abdomen can use oral water-soluble contrast without concern for subsequent imaging."], pitfalls: ["Using Gastrografin in patients at risk of aspiration—it can cause fatal pulmonary edema.", "Thinking water-soluble contrast provides the same mucosal detail as barium—it does not."], faq: [{ q: "When should water-soluble contrast be used instead of barium?", a: "When perforation is suspected, when surgery is planned within 24 hours, when there is risk of barium impaction, and when a CT will follow the GI study. Water-soluble contrast is absorbed from the peritoneum and does not cause barium peritonitis." }, { q: "Why is aspiration of Gastrografin dangerous?", a: "Gastrografin is hyperosmolar (approximately 6× blood osmolality). If aspirated, it draws fluid into the lungs, causing severe pulmonary edema that can be fatal. For patients at risk of aspiration, iso-osmolar non-ionic contrast should be used instead." }] }
  ]);

  // =====================================================
  // CATEGORIES 8-14: Patient Care, Equipment, Digital Imaging, QC, Mammo, Fluoro, Peds (remaining ~85 entries)
  // =====================================================

  // Patient Care (12)
  addCategory("Patient Care", [
    { slug: "patient-identification-verification", title: "Patient Identification and Verification", keywords: ["patient ID", "patient safety", "wrong patient imaging", "identification verification"], overview: "Proper patient identification using at least two unique identifiers (name and date of birth, or name and medical record number) is the first and most critical step before any imaging procedure.", mechanism: "Two-identifier verification reduces the risk of wrong-patient imaging, which can lead to misdiagnosis, delayed treatment, and unnecessary radiation exposure.", relevance: "Wrong-patient imaging is a 'never event' that can have severe consequences for patient safety, legal liability, and regulatory compliance.", pearls: ["Always use TWO unique identifiers—name alone is insufficient.", "Verify against the requisition AND verbally with the patient.", "For unresponsive patients, use identification bands and accompanying documentation."], pitfalls: ["Relying on room number or bed location as an identifier.", "Not verifying against the original imaging requisition."], faq: [{ q: "What are acceptable patient identifiers?", a: "Full name, date of birth, medical record number, or social security number. Room number and bed location are NOT acceptable identifiers. At least two unique identifiers must be used." }, { q: "How do you identify an unresponsive patient?", a: "Use the identification band (wristband), verify against the medical record, confirm with nursing staff, and cross-reference with the imaging requisition. Never proceed without positive identification." }] },
    { slug: "informed-consent-imaging", title: "Informed Consent in Diagnostic Imaging", keywords: ["informed consent", "patient consent", "imaging consent", "contrast consent"], overview: "Informed consent requires that the patient understands the nature of the procedure, its benefits, risks, alternatives, and consequences of refusal before agreeing to undergo an imaging examination, particularly for invasive or contrast-enhanced studies.", mechanism: "The consent process involves explaining the procedure, its purpose, expected benefits, risks (including contrast reactions and radiation exposure), alternatives, and the right to refuse. The patient must demonstrate understanding and consent voluntarily.", relevance: "Informed consent is legally and ethically required for invasive procedures, contrast administration, and procedures with significant risks. Technologists play a role in ensuring consent is obtained.", pearls: ["Consent is required for contrast-enhanced studies, invasive procedures, and fluoroscopy-guided procedures.", "The physician orders the study, but the technologist must verify consent before proceeding.", "Patients can withdraw consent at any time."], pitfalls: ["Proceeding without verified consent for contrast studies.", "Assuming signed consent covers all procedures—each procedure may need separate consent."], faq: [{ q: "When is specific consent needed for imaging?", a: "For contrast-enhanced studies (IV, intrathecal), invasive procedures (arthrography, myelography), high-dose procedures (interventional fluoroscopy), and procedures involving sedation. Routine radiographs generally fall under implied consent for treatment." }, { q: "Who is responsible for obtaining consent?", a: "The ordering/performing physician is ultimately responsible for informed consent. The technologist is responsible for verifying that consent has been obtained and documented before proceeding with the examination." }] },
    { slug: "infection-control-imaging-department", title: "Infection Control in the Imaging Department", keywords: ["infection control", "standard precautions", "hand hygiene", "equipment disinfection"], overview: "Infection control in the imaging department includes standard precautions, hand hygiene, equipment disinfection, and transmission-based precautions (contact, droplet, airborne) to prevent healthcare-associated infections.", mechanism: "Standard precautions treat all blood and body fluids as potentially infectious. Transmission-based precautions add specific barriers based on the infection's mode of transmission.", relevance: "Radiologic technologists frequently handle portable equipment, interact with critically ill patients, and move between different clinical areas, making infection control practices essential.", pearls: ["Hand hygiene is the single most effective infection prevention measure.", "Clean portable equipment between patients.", "Standard precautions apply to ALL patients regardless of diagnosis.", "Airborne precautions require N95 respirator and negative-pressure room."], pitfalls: ["Not cleaning portable x-ray equipment between patients.", "Thinking gloves replace hand hygiene—always wash/sanitize after removing gloves."], faq: [{ q: "What are standard precautions?", a: "Standard precautions assume all patients may have infectious conditions. They include hand hygiene, gloves for potential contact with blood/body fluids, face protection when splashing is possible, and proper handling of contaminated equipment and linens." }, { q: "How should imaging equipment be disinfected?", a: "Wipe all patient-contact surfaces with hospital-approved disinfectant between patients. Pay special attention to table surfaces, positioning sponges, image receptors, and portable unit handles. Follow manufacturer guidelines for electronic equipment." }] },
    { slug: "contrast-injection-technique", title: "Contrast Injection Technique and Venipuncture", keywords: ["venipuncture", "IV contrast injection", "power injector", "contrast administration"], overview: "Proper IV contrast injection technique is essential for diagnostic quality and patient safety. This includes appropriate venous access, injection rate, contrast volume, and power injector operation.", mechanism: "IV contrast is typically administered through a large-gauge IV catheter (18-20G for adults) using a power injector for CT studies or hand injection for other modalities. Flow rates for CT range from 1-5 mL/sec depending on the study type.", relevance: "Safe and effective contrast administration is a core competency for radiologic technologists. Extravasation, air embolism, and injection-site complications must be prevented and managed.", pearls: ["Use at least 20G catheter for power injection; 18G preferred for rates > 3 mL/sec.", "Test the line with saline before contrast injection.", "Monitor the injection site for extravasation (swelling, pain, skin blanching).", "Air in the line: small amounts (< 1 mL) are generally clinically insignificant."], pitfalls: ["Using too small a catheter for high-flow-rate CT injections.", "Not testing the IV line before connecting the power injector."], faq: [{ q: "What gauge catheter is needed for CT contrast injection?", a: "20G minimum for standard injections (1-3 mL/sec). 18G preferred for high-flow studies like CTA (3-5 mL/sec). Smaller gauge catheters may not withstand high injection pressures and risk extravasation." }, { q: "What should you do if extravasation occurs?", a: "Stop the injection immediately. Elevate the affected extremity. Apply warm or cold compresses per department protocol. Document the event and estimated volume extravasated. Notify the radiologist. Monitor for compartment syndrome if large volume (> 50 mL)." }] },
    { slug: "patient-transfer-and-immobilization", title: "Patient Transfer and Immobilization Techniques", keywords: ["patient transfer", "immobilization", "body mechanics", "patient positioning"], overview: "Safe patient transfer and immobilization are essential skills for radiologic technologists. Proper body mechanics protect both the patient and the technologist from injury.", mechanism: "Transfer techniques vary based on patient mobility, size, and condition. Immobilization devices (sandbags, positioning sponges, compression bands, Pigg-O-Stat for pediatrics) reduce motion and improve image quality.", relevance: "Falls during transfer are a significant patient safety concern. Immobilization reduces motion artifacts and repeat rates, directly reducing patient dose.", pearls: ["Use proper body mechanics: wide base of support, bend at the knees, keep load close to body.", "Always lock wheelchair brakes and stretcher wheels before transfer.", "Use immobilization devices to prevent motion, especially for pediatric and elderly patients.", "Two-person transfers are required for patients who cannot assist."], pitfalls: ["Not locking stretcher/wheelchair brakes before transfer.", "Lifting with the back instead of the legs."], faq: [{ q: "What are the principles of proper body mechanics?", a: "Wide base of support, bend at knees and hips (not waist), keep the load close to your body, tighten core muscles before lifting, avoid twisting while lifting, and push rather than pull when possible." }, { q: "How do you assess patient mobility before transfer?", a: "Ask the patient about their ability to stand and move, check the medical chart for restrictions (weight-bearing status, spinal precautions, fall risk), observe their current position and movement, and ask nursing staff about any special needs." }] },
    { slug: "medical-emergencies-imaging-department", title: "Medical Emergencies in the Imaging Department", keywords: ["medical emergency", "code blue", "syncope", "anaphylaxis imaging"], overview: "Radiologic technologists must be prepared to recognize and initiate management of medical emergencies including cardiac arrest, syncope, seizures, contrast reactions, and respiratory distress.", mechanism: "Emergency response follows the ABCs: Airway, Breathing, Circulation. Basic Life Support (BLS) certification is typically required. Knowledge of emergency equipment location and use is essential.", relevance: "Medical emergencies can occur in any imaging area, particularly during contrast-enhanced studies. Quick recognition and initial management improve patient outcomes.", pearls: ["Know the location of emergency equipment: crash cart, oxygen, suction, AED.", "Syncope (vasovagal): place patient supine, elevate legs, monitor airway.", "Seizure: protect the patient from injury, do NOT restrain or place objects in mouth, time the seizure.", "Always call for help early—do not manage emergencies alone."], pitfalls: ["Not knowing where emergency equipment is located in your work area.", "Attempting advanced interventions beyond your training level."], faq: [{ q: "What should you do if a patient becomes unresponsive?", a: "Call for help (activate code blue/emergency response), check responsiveness (tap and shout), open the airway (head tilt-chin lift), check for breathing and pulse (10 seconds), begin CPR if no pulse, attach AED when available." }, { q: "How do you manage vasovagal syncope?", a: "Place the patient supine (or Trendelenburg position), elevate the legs, ensure open airway, monitor breathing and pulse, place a cool cloth on the forehead, reassure the patient when consciousness returns, and monitor vital signs." }] }
  ]);

  // Equipment Operation (10)
  addCategory("Equipment Operation", [
    { slug: "x-ray-tube-construction", title: "X-ray Tube Construction and Components", keywords: ["x-ray tube", "cathode", "anode", "tube housing", "rotating anode"], overview: "The x-ray tube is the device that produces x-rays for diagnostic imaging. It consists of a cathode (electron source) and anode (target) enclosed in a vacuum glass or metal envelope, surrounded by a protective housing.", mechanism: "The cathode contains a tungsten filament heated by the filament circuit, producing electrons by thermionic emission. The focusing cup directs electrons to the anode target. The rotating anode (tungsten-rhenium alloy on molybdenum disk) distributes heat over a large area.", relevance: "Understanding tube components helps technologists operate equipment safely, optimize technique, and troubleshoot quality issues.", pearls: ["Dual filament tubes have large and small focal spots for different applications.", "The glass envelope maintains vacuum—any air leak destroys the tube.", "Rotating anodes spin at 3,000-10,000 RPM to distribute heat.", "The tube housing contains oil for heat dissipation and lead for radiation shielding."], pitfalls: ["Not following warm-up procedures after tube inactivity.", "Exceeding tube rating limits during high-output procedures."], faq: [{ q: "Why does the x-ray tube need a vacuum?", a: "The vacuum prevents electrons from colliding with air molecules between the cathode and anode. Air molecules would slow and scatter the electrons, reducing x-ray production efficiency and damaging the filament through oxidation." }, { q: "What is the purpose of the focusing cup?", a: "The focusing cup is a negatively charged metal cup surrounding the filament that shapes the electron beam into a narrow, focused stream directed at the focal spot on the anode. It controls the size and shape of the electron beam." }] },
    { slug: "fluoroscopy-equipment-operation", title: "Fluoroscopy Equipment and Operation", keywords: ["fluoroscopy equipment", "image intensifier", "flat panel fluoroscopy", "fluoroscopy operation"], overview: "Fluoroscopy provides real-time dynamic imaging using continuous or pulsed x-rays. Modern systems use either image intensifiers or flat-panel detectors for real-time image capture and display.", mechanism: "The fluoroscopy tube is typically under the table. Traditional systems use image intensifiers to convert x-rays to visible light, amplified electronically. Modern systems use flat-panel detectors for direct digital capture. Pulsed fluoroscopy reduces dose by producing x-rays in short bursts.", relevance: "Fluoroscopy is used for GI studies, interventional procedures, orthopedic surgery, and catheterization. Understanding equipment operation ensures image quality and radiation safety.", pearls: ["Tube under the table reduces operator exposure from scatter.", "Pulsed fluoroscopy at 15 fps reduces dose by ~50% compared to continuous 30 fps.", "Automatic brightness control (ABC) adjusts kVp and mA to maintain consistent image brightness.", "Last-image-hold reduces dose by eliminating the need for additional exposures."], pitfalls: ["Not understanding that continuous fluoroscopy delivers significantly more dose than pulsed.", "Forgetting to use last-image-hold feature to reduce unnecessary exposure."], faq: [{ q: "What is the difference between an image intensifier and a flat-panel detector?", a: "Image intensifiers convert x-rays to light, then to electrons, then back to light for camera capture. Flat-panel detectors convert x-rays directly to digital signals. Flat panels provide better image quality, no geometric distortion, and a more compact design." }, { q: "What is automatic brightness control?", a: "ABC (also called automatic dose rate control) automatically adjusts fluoroscopic kVp and mA to maintain consistent image brightness as the x-ray beam passes through varying patient thicknesses during the procedure." }] },
    { slug: "portable-mobile-x-ray-operation", title: "Portable (Mobile) X-ray Equipment Operation", keywords: ["portable x-ray", "mobile radiography", "bedside x-ray", "portable technique"], overview: "Portable x-ray equipment brings imaging to the patient's bedside in ICU, ER, OR, and nursing units. Operating portable equipment requires special considerations for technique, safety, and radiation protection.", mechanism: "Portable units use battery-powered or capacitor-discharge generators with lower output than fixed units. The SID is typically shorter (40 inches), requiring technique adjustments. Portable units have more limited kVp and mAs ranges.", relevance: "Portable radiography accounts for a significant percentage of imaging volume, particularly for critically ill patients. Proper technique and safety practices ensure diagnostic images while protecting the patient and staff.", pearls: ["Standard portable SID: 40 inches (vs 72 inches for upright chest in department).", "Always announce 'x-ray' before exposure to warn nearby personnel.", "Stand at maximum distance from the tube during exposure.", "Use exposure cord to maximize distance from the patient."], pitfalls: ["Not adjusting technique for the shorter SID used in portable radiography.", "Not warning nearby personnel before making an exposure."], faq: [{ q: "How does portable technique differ from departmental?", a: "Portable units typically use 40-inch SID (vs 72 for upright chest), may have lower output generators requiring technique adjustments, produce more scatter in uncontrolled environments, and require special attention to radiation protection for nearby patients and staff." }, { q: "What radiation protection measures are needed for portable exams?", a: "Stand as far as possible from the tube (at least 6 feet). Never hold the image receptor. Announce 'x-ray' before exposure. Shield nearby patients when practical. Wear a lead apron if distance alone is insufficient." }] },
    { slug: "quality-control-x-ray-equipment", title: "Quality Control for X-ray Equipment", keywords: ["QC x-ray", "quality control radiography", "equipment testing", "x-ray QC"], overview: "Quality control (QC) testing ensures x-ray equipment operates within acceptable parameters for consistent image quality and patient safety. Tests include output reproducibility, linearity, timer accuracy, and beam alignment.", mechanism: "QC tests use calibrated instruments to measure equipment performance against established standards. Results are compared to baseline and tolerance limits. Equipment failing QC must be removed from service until repaired.", relevance: "Regular QC ensures diagnostic image quality, minimizes unnecessary patient dose, meets regulatory requirements, and identifies equipment problems before they affect clinical imaging.", pearls: ["Output reproducibility: coefficient of variation must be ≤ 0.05 (5%).", "mR/mAs linearity: adjacent mA stations must agree within ±10%.", "Timer accuracy: ±5% for exposures > 10 ms.", "kVp accuracy: ±5% of indicated value.", "Beam alignment: x-ray and light field must agree within ±2% of SID."], pitfalls: ["Not performing QC tests at required intervals.", "Continuing to use equipment that fails QC testing."], faq: [{ q: "How often should x-ray equipment QC be performed?", a: "Daily: visual inspection, warm-up procedure. Monthly: output reproducibility. Semi-annually: kVp accuracy, timer accuracy, mA linearity, HVL. Annually: comprehensive evaluation including focal spot measurement, beam alignment, and safety interlocks." }, { q: "What happens if equipment fails QC?", a: "Equipment that fails QC testing must be removed from clinical service until repaired and retested. The failure must be documented, the appropriate supervisor and biomedical engineering notified, and the equipment clearly marked as out of service." }] },
    { slug: "computed-radiography-reader-operation", title: "CR Reader Operation and Maintenance", keywords: ["CR reader", "imaging plate processing", "plate erasure", "CR quality control"], overview: "Computed Radiography readers scan exposed PSP imaging plates using laser stimulation, converting the stored image to digital data. Proper operation and maintenance ensure consistent image quality.", mechanism: "The reader feeds the imaging plate past a scanning laser beam. Stimulated phosphor emissions are collected by a fiber-optic light guide and detected by a photomultiplier tube. The plate is then erased by exposure to high-intensity light and returned for reuse.", relevance: "CR remains widely used, and proper reader operation directly affects image quality, workflow efficiency, and patient dose optimization.", pearls: ["Process plates within 8 hours to minimize image fading.", "Erase unused plates before new exposures (ghost images from residual signal).", "Protect plates from ambient light, which causes fog.", "Clean plates regularly to prevent artifacts."], pitfalls: ["Not erasing plates before reuse, causing ghost images from prior exposures.", "Leaving exposed plates unprocessed for too long, causing image fading."], faq: [{ q: "What causes ghost images on CR plates?", a: "Ghost images occur when a plate is reused without proper erasure. Residual signal from the prior exposure superimposes on the new image. Always erase plates using the reader's erasure cycle before each new use, especially if the plate has been sitting unused." }, { q: "How should CR imaging plates be stored?", a: "Store plates vertically in their protective cassettes, away from radiation sources and direct light. Erase plates that have been stored for more than 48 hours before use. Handle plates by the edges to avoid fingerprints and scratches." }] }
  ]);

  // Digital Imaging (8)
  addCategory("Digital Imaging", [
    { slug: "histogram-analysis-digital-radiography", title: "Histogram Analysis in Digital Radiography", keywords: ["histogram analysis", "exposure recognition", "values of interest", "histogram errors"], overview: "Histogram analysis is the process by which digital radiography systems analyze the distribution of pixel values in the raw image to determine the range of useful data and apply appropriate processing for display.", mechanism: "The system generates a histogram (frequency distribution of pixel values) and compares it to expected patterns for the selected body part and projection. The Values of Interest (VOI) are identified as the range of pixel values containing diagnostic information, and processing is applied accordingly.", relevance: "Histogram analysis drives automatic image processing. When it fails (incorrect anatomy selection, collimation errors, foreign objects), image quality suffers and repeat exposures may be needed.", pearls: ["Histogram errors can cause incorrect image brightness even with correct technique.", "Collimation marks can confuse histogram analysis, causing exposure indicator errors.", "Always select the correct anatomical program/menu before exposure.", "Lead markers placed within the collimated field can affect histogram analysis."], pitfalls: ["Not selecting the correct body part/projection menu on the DR system.", "Placing lead markers or artifacts within the collimated field that confuse histogram analysis."], faq: [{ q: "What causes histogram analysis errors?", a: "Incorrect anatomical program selection, collimation that includes non-anatomy areas (excessive collimation), metal artifacts or lead markers in the field, and large prostheses that alter the expected histogram shape can all cause errors." }, { q: "How does histogram analysis affect the exposure indicator?", a: "The exposure indicator is calculated from the histogram analysis. If the analysis incorrectly identifies the region of interest, the EI may not accurately represent the actual detector dose, leading to false readings that can mask over- or underexposure." }] },
    { slug: "image-compression-lossless-lossy", title: "Image Compression: Lossless vs. Lossy", keywords: ["image compression", "JPEG 2000", "lossless compression", "lossy compression"], overview: "Medical image compression reduces file sizes for storage and transmission. Lossless compression preserves all original data; lossy compression discards some data irreversibly to achieve higher compression ratios.", mechanism: "Lossless compression (2:1 to 3:1 ratio) uses algorithms that encode data more efficiently without discarding any information—the original image can be perfectly reconstructed. Lossy compression (10:1 to 20:1 or higher) discards some data deemed visually insignificant, achieving much higher compression.", relevance: "Storage and bandwidth limitations make compression essential. The choice between lossless and lossy affects diagnostic quality, storage costs, and network performance.", pearls: ["Lossless compression preserves ALL data—ratios typically 2:1 to 3:1.", "Lossy compression is irreversible—original data cannot be recovered.", "JPEG 2000 supports both lossless and lossy modes.", "Primary diagnosis should always be done on original or losslessly compressed images."], pitfalls: ["Using lossy compression for primary diagnostic images.", "Repeatedly applying lossy compression (quality degrades cumulatively)."], faq: [{ q: "Is lossy compression acceptable for medical images?", a: "Lossy compression is acceptable for some secondary uses (teleradiology, teaching, archival copies) but should not be used for primary diagnostic interpretation. Regulatory requirements vary by jurisdiction. The ACR allows visually lossless compression ratios up to 10:1 for some modalities." }, { q: "What compression standard is used in DICOM?", a: "DICOM supports multiple compression schemes including JPEG, JPEG 2000, JPEG-LS, and RLE. JPEG 2000 is preferred for medical imaging as it supports both lossless and lossy compression with superior quality at high compression ratios." }] },
    { slug: "teleradiology-standards", title: "Teleradiology and Remote Image Interpretation", keywords: ["teleradiology", "remote reading", "DICOM transmission", "monitor requirements"], overview: "Teleradiology is the electronic transmission of medical images to a distant site for interpretation, consultation, or archival. It requires adherence to technical standards for image quality, network security, and display specifications.", mechanism: "Images are transmitted in DICOM format over secure networks. The receiving site must have diagnostic-quality monitors (5 MP for mammography, 3 MP for general radiology) calibrated to DICOM GSDF (Grayscale Standard Display Function).", relevance: "Teleradiology enables 24/7 radiology coverage, subspecialty consultations, and improved access to imaging services in underserved areas.", pearls: ["Diagnostic monitors must be calibrated to DICOM GSDF for consistent display.", "5 MP monitors required for digital mammography; 3 MP for general radiology.", "All transmissions must be encrypted and HIPAA compliant.", "Ambient light in the reading room affects perceived image quality."], pitfalls: ["Interpreting images on non-diagnostic monitors (consumer displays).", "Not maintaining monitor calibration per AAPM TG-18 guidelines."], faq: [{ q: "What are the monitor requirements for teleradiology?", a: "Diagnostic interpretation requires medical-grade monitors calibrated to DICOM GSDF. General radiology: minimum 3 megapixel. Mammography: minimum 5 megapixel. Monitors must be tested regularly per AAPM TG-18 guidelines. Ambient light should be low and consistent." }, { q: "What security measures are needed for teleradiology?", a: "HIPAA-compliant encryption for all transmissions, secure VPN or dedicated connections, user authentication, audit trails, and compliance with all applicable privacy regulations. Patient data must be protected during transmission, display, and storage." }] }
  ]);

  // Quality Control (10)
  addCategory("Quality Control", [
    { slug: "qc-processor-sensitometry", title: "Processor Quality Control and Sensitometry", keywords: ["processor QC", "sensitometry", "densitometry", "processor monitoring"], overview: "Processor quality control ensures consistent film development (for remaining film-based systems) and serves as the model for digital system QC. Sensitometry uses a standardized exposure to monitor processor performance through speed, contrast, and fog measurements.", mechanism: "A sensitometric strip is exposed to calibrated light steps, processed, and measured with a densitometer. Three values are tracked: speed index (mid-density step), contrast index (density difference between two steps), and base+fog (unexposed area density).", relevance: "While film processing is declining, the principles of sensitometry form the foundation of quality monitoring systems used in digital imaging.", pearls: ["Speed index monitors processor temperature and chemical activity.", "Contrast index monitors developer replenishment.", "Base+fog should not exceed 0.25 OD.", "Control limits: ±0.15 for speed and contrast; ±0.05 for base+fog."], pitfalls: ["Not performing processor QC before clinical work begins.", "Confusing speed and contrast variations in troubleshooting."], faq: [{ q: "What causes increased fog on QC films?", a: "Elevated developer temperature, contaminated chemicals, light leak in darkroom or processor, expired film, or improper film storage (heat, radiation, chemical fumes)." }, { q: "What are the QC control limits?", a: "Speed index: ±0.15 from established operating level. Contrast index: ±0.15. Base+fog: +0.05 from established level. If values exceed limits, the processor must be corrected before clinical use." }] },
    { slug: "digital-detector-qc", title: "Digital Detector Quality Control", keywords: ["detector QC", "flat panel QC", "dead pixel", "detector calibration"], overview: "Digital detector QC ensures consistent image quality and optimal detector performance. Tests include uniformity (flat field), dead pixel analysis, artifact evaluation, exposure indicator accuracy, and spatial resolution verification.", mechanism: "Uniformity testing uses a uniform exposure to identify non-functioning (dead) detector elements and regional sensitivity variations. Dark current images identify detector element defects. Spatial resolution is measured using a line-pair test pattern.", relevance: "Digital detectors degrade over time with dead pixels, gain variations, and calibration drift. Regular QC identifies problems before they affect diagnostic imaging.", pearls: ["Dead pixel count should not exceed manufacturer specifications.", "Flat-field uniformity tests reveal gain calibration issues.", "Detector calibration (gain and offset) should be performed regularly.", "Image artifacts from detector defects can mimic or obscure pathology."], pitfalls: ["Not performing regular flat-field (uniformity) tests.", "Ignoring increasing dead pixel counts as normal aging."], faq: [{ q: "How often should digital detector QC be performed?", a: "Daily: visual artifact check on clinical images. Monthly: uniformity (flat-field) test, dead pixel analysis. Semi-annually: spatial resolution, contrast-to-noise ratio, exposure indicator accuracy. Annually: comprehensive evaluation including mechanical inspection." }, { q: "What is a flat-field uniformity test?", a: "A uniform x-ray exposure of the entire detector at a specified technique. The resulting image should be uniform—any variations indicate detector element defects, gain calibration errors, or artifacts that need correction." }] },
    { slug: "ct-quality-control-testing", title: "CT Quality Control Testing", keywords: ["CT QC", "CT phantom", "noise measurement CT", "CT number accuracy"], overview: "CT quality control ensures scanner performance meets specifications for noise, CT number accuracy, spatial resolution, contrast resolution, and dose output. Testing uses standardized phantoms.", mechanism: "CT phantoms contain materials with known CT numbers, resolution targets, and geometric patterns. Regular scanning and analysis of phantom images verifies that the scanner meets performance specifications.", relevance: "CT QC is essential for diagnostic accuracy (correct CT numbers for tissue characterization), patient dose optimization, and regulatory compliance.", pearls: ["Water CT number should be 0 ± 5 HU.", "Noise measurement: standard deviation in a uniform water region.", "Spatial resolution measured with high-contrast patterns.", "Low-contrast resolution assessed with low-contrast targets.", "CTDIvol should be within ±20% of expected values."], pitfalls: ["Not testing CT number accuracy regularly—drift can affect tissue characterization.", "Ignoring noise measurements that indicate tube or detector degradation."], faq: [{ q: "What CT QC tests are performed daily?", a: "Daily: Water CT number accuracy (0 ± 5 HU), noise measurement (standard deviation in uniform region), and visual artifact assessment. These quick tests verify basic scanner performance before clinical use." }, { q: "What are acceptable CT number tolerances?", a: "Water: 0 ± 5 HU (some guidelines ± 3 HU). CT number uniformity: center-to-periphery variation should be within ± 5 HU. Air: -1000 ± 5 HU. CT number accuracy for other materials should be within ± 10% of expected values." }] },
    { slug: "mammography-quality-control", title: "Mammography Quality Control Program", keywords: ["mammography QC", "MQSA", "ACR accreditation", "mammography phantom"], overview: "Mammography quality control is governed by the Mammography Quality Standards Act (MQSA) and requires rigorous daily, weekly, monthly, quarterly, and annual testing to ensure optimal image quality for breast cancer detection.", mechanism: "The mammography QC program includes phantom imaging, visual inspections, compression tests, and dosimetry. The ACR mammography accreditation phantom contains fibers, speck groups, and masses that simulate breast pathology at threshold visibility.", relevance: "Mammography requires the highest image quality standards due to the subtle nature of early breast cancer findings. MQSA mandates specific QC requirements and annual accreditation.", pearls: ["MQSA requires daily phantom imaging and review.", "ACR phantom passing criteria: minimum 4 fibers, 3 speck groups, 3 masses.", "Compression force: 25-45 lbs (111-200 N).", "Mean glandular dose: ≤ 3 mGy (300 mrad) per exposure for standard breast."], pitfalls: ["Not meeting minimum phantom scoring requirements.", "Exceeding maximum allowable mean glandular dose."], faq: [{ q: "What are the daily mammography QC requirements?", a: "Daily phantom imaging with scoring against minimum standards (4 fibers, 3 speck groups, 3 masses), visual inspection of the unit, and verification of all safety interlocks. Images must be reviewed for artifacts and acceptable optical density." }, { q: "What is MQSA?", a: "The Mammography Quality Standards Act is a federal law that establishes quality standards for mammography equipment, personnel, and practices. It requires FDA certification and periodic inspection of all mammography facilities. Failure to comply can result in facility closure." }] }
  ]);

  // Mammography (10)
  addCategory("Mammography", [
    { slug: "mammographic-positioning-cc-mlo", title: "Mammographic Positioning: CC and MLO Views", keywords: ["mammography positioning", "CC view", "MLO view", "breast positioning"], overview: "The standard mammographic examination includes craniocaudal (CC) and mediolateral oblique (MLO) views. Proper positioning is critical for including all breast tissue and ensuring early cancer detection.", mechanism: "CC view: breast compressed from superior to inferior, demonstrating medial and central tissue. MLO view: breast compressed along the oblique plane parallel to the pectoral muscle, demonstrating the most tissue including the upper outer quadrant and axillary tail.", relevance: "Mammographic positioning is one of the most technically demanding skills in radiography. Poor positioning is the most common cause of missed breast cancers due to excluded tissue.", pearls: ["MLO should show pectoral muscle to the level of the nipple.", "CC should include maximum medial tissue.", "The nipple should be in profile on at least one view.", "Inframammary fold (IMF) must be open on MLO."], pitfalls: ["Not including the inframammary fold on MLO.", "Insufficient pectoral muscle on MLO (should extend to nipple level or below)."], faq: [{ q: "What tissue should be included on the MLO view?", a: "The MLO should include all breast tissue from the axillary tail to the inframammary fold. The pectoral muscle should be visualized at least to the level of the nipple. The inframammary fold should be open (not folded over). The nipple should be in profile." }, { q: "Why is the MLO view considered the single most important mammographic view?", a: "The MLO demonstrates the greatest amount of breast tissue, including the upper outer quadrant (most common location for breast cancer) and the axillary tail. If only one view could be taken, the MLO provides the most diagnostic information." }] },
    { slug: "breast-compression-importance", title: "Breast Compression: Importance and Technique", keywords: ["breast compression", "mammography compression", "compression force", "image quality mammography"], overview: "Breast compression is essential for high-quality mammography. It improves image quality by reducing thickness, spreading tissue, reducing scatter, improving contrast, and lowering radiation dose.", mechanism: "Compression reduces breast thickness uniformly, bringing structures closer to the receptor (reducing magnification), separating overlapping tissues, reducing scatter (thinner tissue), decreasing motion blur, and lowering dose (less tissue to penetrate).", relevance: "Adequate compression is the single most important factor for mammographic image quality. Insufficient compression is a common cause of suboptimal images and missed pathology.", pearls: ["Compression force: 25-45 lbs (111-200 N).", "Taut skin indicates adequate compression.", "Compression reduces dose by 50% or more compared to uncompressed.", "Explain compression benefits to the patient to improve cooperation."], pitfalls: ["Applying insufficient compression due to patient discomfort concerns.", "Not explaining the benefits of compression to the patient."], faq: [{ q: "Why is breast compression necessary?", a: "Compression: (1) reduces tissue thickness for lower dose, (2) spreads overlapping tissues apart, (3) reduces scatter for better contrast, (4) brings tissue closer to the receptor for less magnification, (5) reduces motion blur, (6) provides more uniform tissue thickness for consistent exposure." }, { q: "What is the acceptable range of compression force?", a: "25-45 lbs (111-200 N). Below 25 lbs is generally insufficient. The goal is taut breast skin, not maximum force. Patient communication and slow, controlled compression improve tolerance." }] },
    { slug: "digital-breast-tomosynthesis", title: "Digital Breast Tomosynthesis (3D Mammography)", keywords: ["tomosynthesis", "3D mammography", "DBT", "breast tomosynthesis"], overview: "Digital Breast Tomosynthesis (DBT) acquires multiple low-dose projection images of the compressed breast at different angles, which are reconstructed into thin-section images. This reduces tissue overlap and improves cancer detection.", mechanism: "The x-ray tube moves through a limited arc (15-50°) around the compressed breast, acquiring 9-25 low-dose projections. These are reconstructed into thin (0.5-1 mm) slices that can be scrolled through, reducing the masking effect of overlapping tissue.", relevance: "DBT has been shown to increase cancer detection rates by 20-40% and reduce recall rates by 15-30% compared to 2D digital mammography alone.", pearls: ["DBT reduces tissue overlap—the main cause of both false negatives and false positives.", "Combined 2D+3D increases cancer detection by 20-40%.", "Synthetic 2D images from DBT data can replace the standard 2D acquisition, reducing dose.", "DBT is particularly beneficial in dense breast tissue."], pitfalls: ["Thinking DBT replaces standard 2D mammography—it is typically used in combination.", "Not understanding that DBT adds slightly to the radiation dose when combined with 2D."], faq: [{ q: "How does tomosynthesis improve cancer detection?", a: "By creating thin-section images, tomosynthesis separates overlapping breast tissue that can hide cancers on standard 2D mammography. It also reduces false positives by allowing the radiologist to determine whether apparent lesions are real or just tissue overlap." }, { q: "Does tomosynthesis increase radiation dose?", a: "When combined with standard 2D mammography, the total dose is approximately doubled but remains well within regulatory limits. Synthetic 2D images reconstructed from the 3D data can replace the 2D acquisition, keeping total dose similar to 2D mammography alone." }] },
    { slug: "breast-density-and-imaging", title: "Breast Density and Its Impact on Imaging", keywords: ["breast density", "dense breast", "BI-RADS density", "breast cancer screening"], overview: "Breast density refers to the proportion of fibroglandular tissue relative to fatty tissue in the breast. Dense breast tissue can mask cancers on mammography and is itself an independent risk factor for breast cancer.", mechanism: "Fibroglandular tissue and cancer both appear white on mammograms, making it difficult to detect cancers within dense tissue. BI-RADS classifies breast density into four categories: A (almost entirely fatty), B (scattered fibroglandular), C (heterogeneously dense), D (extremely dense).", relevance: "Approximately 40% of women have dense breasts (categories C or D). Many states mandate patient notification of breast density and may require supplemental screening with ultrasound or MRI.", pearls: ["Dense breast tissue can mask cancers (reduced mammographic sensitivity).", "Dense breasts are an independent risk factor for breast cancer.", "BI-RADS categories C and D are considered 'dense.'", "Supplemental screening (ultrasound, MRI) may be recommended for dense breasts."], pitfalls: ["Assuming a normal mammogram in a woman with dense breasts rules out cancer.", "Not understanding breast density notification laws in your jurisdiction."], faq: [{ q: "What are the BI-RADS breast density categories?", a: "A: Almost entirely fatty (<25% fibroglandular). B: Scattered fibroglandular (25-50%). C: Heterogeneously dense (51-75%). D: Extremely dense (>75%). Categories C and D are considered 'dense' and may require supplemental screening." }, { q: "Why is dense breast tissue a problem for mammography?", a: "Both fibroglandular tissue and breast cancers appear white on mammograms. Dense tissue can mask cancers (low sensitivity). Studies show mammographic sensitivity drops from ~85% in fatty breasts to ~48% in extremely dense breasts." }] },
    { slug: "mammography-artifacts-recognition", title: "Mammography Artifact Recognition", keywords: ["mammography artifacts", "breast imaging artifacts", "detector artifacts", "skin fold artifact"], overview: "Artifact recognition in mammography is critical because artifacts can mimic or obscure breast pathology. Common artifacts include skin folds, deodorant/antiperspirant particles, hair artifacts, and detector-related artifacts.", mechanism: "Skin folds create linear densities that can mimic architectural distortion. Deodorant particles (containing aluminum or zinc) appear as scattered calcification-like densities in the axilla. Motion blur reduces image sharpness. Detector artifacts vary by technology type.", relevance: "Artifacts in mammography can lead to unnecessary biopsies (false positives) or missed cancers (false negatives). Technologists must prevent common artifacts and recognize them when they occur.", pearls: ["Instruct patients not to wear deodorant, powder, or lotion.", "Skin folds can be avoided with proper breast positioning and skin smoothing.", "Hair artifacts can mimic calcifications—secure long hair away from the breast.", "Grid line artifacts indicate grid or Bucky malfunction."], pitfalls: ["Mistaking deodorant particles for suspicious axillary calcifications.", "Confusing a skin fold for architectural distortion."], faq: [{ q: "Why should patients avoid deodorant for mammography?", a: "Deodorant and antiperspirant contain metallic particles (aluminum, zinc) that appear as bright white specks on the mammogram, mimicking calcifications. These can be confused with suspicious microcalcifications, potentially leading to unnecessary further workup or biopsy." }, { q: "How can skin fold artifacts be prevented?", a: "Proper positioning technique including smoothing the skin during compression, ensuring the breast is fully pulled forward before compression, and using slow, controlled compression. A skin fold appears as a straight-line density that can mimic architectural distortion." }] }
  ]);

  // Fluoroscopy (8)
  addCategory("Fluoroscopy", [
    { slug: "upper-gi-series-procedure", title: "Upper GI Series Procedure", keywords: ["upper GI series", "barium swallow", "esophagram", "stomach radiography"], overview: "The upper GI series uses barium contrast and fluoroscopy to evaluate the esophagus, stomach, and duodenum for mucosal abnormalities, motility disorders, and anatomic variations.", mechanism: "Single-contrast: thick barium fills and outlines the lumen. Double-contrast: thin barium coats the mucosa while gas distends the lumen, providing superior mucosal detail. Spot images capture pathology during fluoroscopic examination.", relevance: "Despite widespread endoscopy use, the upper GI series remains valuable for evaluating motility, swallowing disorders, hiatal hernias, and post-surgical anatomy.", pearls: ["Double-contrast provides superior mucosal detail for polyps and ulcers.", "Effervescent crystals produce gas for double-contrast distension.", "Patient rotated through multiple positions to coat all mucosal surfaces.", "Modified barium swallow evaluates swallowing function (performed with speech pathology)."], pitfalls: ["Not recognizing when barium is contraindicated (suspected perforation).", "Confusing single-contrast (lumen filling) with double-contrast (mucosal coating + distension)."], faq: [{ q: "What is the difference between a barium swallow and an upper GI series?", a: "A barium swallow (esophagram) focuses on the esophagus and pharynx. An upper GI series evaluates the stomach and duodenum as well. A modified barium swallow specifically evaluates the swallowing mechanism and is typically done with a speech-language pathologist." }, { q: "What positions are used during an upper GI series?", a: "Multiple positions coat all surfaces: right anterior oblique (RAO) for duodenal bulb, left posterior oblique (LPO) for gastric body, supine for fundus, prone for antrum. Each position uses gravity and barium flow to coat specific mucosal surfaces." }] },
    { slug: "barium-enema-procedure", title: "Barium Enema Procedure", keywords: ["barium enema", "lower GI series", "colon study", "air contrast enema"], overview: "The barium enema uses barium contrast instilled rectally to evaluate the large intestine for polyps, diverticulosis, strictures, inflammatory bowel disease, and colorectal masses.", mechanism: "Single-contrast: barium fills the colon. Double-contrast (air-contrast): thin barium coats the mucosa while air distends the colon, providing detailed mucosal visualization. Overhead radiographs document the fluoroscopic findings in standardized positions.", relevance: "While colonoscopy has largely replaced the barium enema for cancer screening, it remains useful when colonoscopy is incomplete, contraindicated, or for evaluating certain functional disorders.", pearls: ["Double-contrast technique is standard for polyp detection.", "Glucagon may be used to reduce colonic spasm.", "Patient preparation (bowel cleansing) is critical for image quality.", "Standard overhead positions: supine, prone, lateral rectum, both decubitus views."], pitfalls: ["Not ensuring adequate bowel preparation—residual stool mimics polyps.", "Performing barium enema when perforation is suspected."], faq: [{ q: "Why is bowel preparation important for a barium enema?", a: "Residual stool can mimic polyps (false positives), obscure mucosal detail, and prevent adequate mucosal coating. Standard preparation includes clear liquid diet, bowel cleansing agents, and sometimes a suppository." }, { q: "What are the standard overhead positions for a barium enema?", a: "Supine AP, prone AP, right and left lateral decubitus (demonstrate dependent and non-dependent walls), lateral rectum, and right and left posterior oblique. Post-evacuation films demonstrate mucosal pattern." }] },
    { slug: "myelography-procedure", title: "Myelography Procedure and Technique", keywords: ["myelography", "intrathecal contrast", "spinal canal imaging", "CT myelogram"], overview: "Myelography involves injection of contrast media into the subarachnoid space to visualize the spinal cord, nerve roots, and surrounding structures under fluoroscopy. CT myelography combines myelographic contrast injection with CT scanning.", mechanism: "Non-ionic, low-osmolality iodinated contrast is injected intrathecally (usually at L2-L3 or L3-L4). Fluoroscopy guides needle placement and contrast injection. The table is tilted to direct contrast to the region of interest.", relevance: "While MRI has largely replaced myelography for spinal imaging, myelography remains essential when MRI is contraindicated (pacemakers), after spinal hardware (metal artifact), or when positional/dynamic information is needed.", pearls: ["Only use non-ionic, intrathecal-approved contrast agents.", "NEVER use ionic contrast intrathecally—it causes seizures and can be fatal.", "Keep the patient's head elevated to prevent contrast from reaching the cranial vault.", "CT myelography provides excellent bony and soft tissue detail."], pitfalls: ["Using ionic contrast for myelography—this is a potentially fatal error.", "Allowing the contrast to flow cranially by incorrect patient positioning."], faq: [{ q: "Why is myelography still performed when MRI is available?", a: "Myelography is indicated when MRI is contraindicated (ferromagnetic implants, pacemakers), after spinal instrumentation (metal artifact), when dynamic/positional studies are needed, and when MRI findings are equivocal. CT myelography provides superior bony detail." }, { q: "Why must only non-ionic contrast be used for myelography?", a: "Ionic contrast agents in the subarachnoid space cause severe neurotoxicity including seizures, arachnoiditis, and potentially death. Only FDA-approved non-ionic, intrathecal contrast agents may be used for myelography." }] },
    { slug: "arthrography-procedure", title: "Arthrography Procedure", keywords: ["arthrography", "joint injection", "MR arthrography", "contrast arthrography"], overview: "Arthrography involves injection of contrast (iodinated, gadolinium, or air) into a joint space to evaluate internal joint structures. It is performed under fluoroscopic guidance and may be followed by CT (CT arthrography) or MRI (MR arthrography).", mechanism: "Under fluoroscopic guidance, a needle is placed into the joint space and contrast is injected. For CT arthrography, iodinated contrast is used. For MR arthrography, dilute gadolinium is injected. The contrast outlines cartilage, labral tears, and ligaments.", relevance: "MR arthrography is the gold standard for evaluating labral tears, cartilage defects, and ligamentous injuries, particularly in the shoulder and hip.", pearls: ["MR arthrography: dilute gadolinium (1:200) for T1-weighted imaging.", "CT arthrography: iodinated contrast for post-injection CT.", "Joint distension improves visualization of intra-articular structures.", "Needle placement confirmed by fluoroscopy with test injection of contrast."], pitfalls: ["Using undiluted gadolinium for MR arthrography—it must be diluted (too concentrated causes signal void).", "Not confirming intra-articular needle position before injecting."], faq: [{ q: "What is the difference between direct and indirect arthrography?", a: "Direct arthrography: contrast is injected directly into the joint under fluoroscopic guidance. Provides better joint distension and higher concentration of contrast. Indirect arthrography: IV gadolinium diffuses into the joint over 15-30 minutes—no needle in the joint but less distension." }, { q: "When is MR arthrography preferred over standard MRI?", a: "MR arthrography is preferred for labral tears (shoulder, hip), partial-thickness rotator cuff tears, cartilage defects, loose bodies, and post-surgical evaluation. Joint distension separates structures and contrast outlines tears and detachments." }] }
  ]);

  // Pediatric Imaging (8)
  addCategory("Pediatric Imaging", [
    { slug: "pediatric-chest-radiography", title: "Pediatric Chest Radiography", keywords: ["pediatric chest x-ray", "child chest radiograph", "neonatal chest", "pediatric positioning"], overview: "Pediatric chest radiography requires modified technique and positioning compared to adult imaging. Immobilization devices, adjusted technique factors, and rapid exposure times are essential for diagnostic-quality images.", mechanism: "Children have higher water content, less subcutaneous fat, and more cartilage than adults, altering x-ray attenuation. Faster respiratory rates and inability to cooperate with breathing instructions require short exposure times.", relevance: "Chest radiography is the most common pediatric imaging examination, used for pneumonia, congenital heart disease, foreign body aspiration, and neonatal respiratory distress evaluation.", pearls: ["Exposure on inspiration—watch for chest rise or use high mA/short time.", "Pigg-O-Stat immobilizer for upright chest in infants.", "Thymus is normal in infants—do not mistake for mediastinal mass.", "Expiratory films can evaluate for air trapping (foreign body aspiration)."], pitfalls: ["Confusing normal thymic shadow with mediastinal pathology.", "Obtaining films during expiration, making the heart appear enlarged and lungs opaque."], faq: [{ q: "How do you ensure proper inspiration on a pediatric chest?", a: "Watch for chest rise and expose at peak inspiration. Use shortest possible exposure time to freeze motion. For infants in the Pigg-O-Stat, wait for natural inspiration or use a gentle cry (which produces a deep inspiration between cries)." }, { q: "What is the normal appearance of the thymus on an infant chest x-ray?", a: "The thymus appears as a soft tissue density in the anterior mediastinum, creating a 'sail sign' on PA view and filling the retrosternal space on lateral. It is normal in infants and young children and should not be mistaken for a mediastinal mass or cardiomegaly." }] },
    { slug: "pediatric-skeletal-imaging", title: "Pediatric Skeletal Imaging Considerations", keywords: ["pediatric skeletal x-ray", "growth plate", "child fracture", "epiphyseal plate"], overview: "Pediatric skeletal imaging requires understanding of growth plates (physes), ossification centers, and fracture patterns unique to children. The Salter-Harris classification describes growth plate fractures.", mechanism: "Children have open growth plates (physes) that are weaker than surrounding bone and ligaments. Growth plate injuries are more common than ligament sprains in children. The physis appears as a radiolucent line on radiographs that should not be confused with a fracture.", relevance: "Growth plate injuries can affect future bone growth. Proper imaging and classification guide treatment decisions and predict growth disturbance risk.", pearls: ["Salter-Harris classification: Type I-V based on fracture relationship to the growth plate.", "SH Type I: fracture through the growth plate only (may be radiographically normal).", "SH Type II: most common—fracture through growth plate and metaphysis.", "Comparison views of the opposite extremity help identify subtle abnormalities."], pitfalls: ["Confusing a normal growth plate for a fracture.", "Missing a Salter-Harris Type I injury (may appear normal on radiographs)."], faq: [{ q: "What is the Salter-Harris classification?", a: "A classification of growth plate (physeal) fractures: Type I—through the physis only (often normal on x-ray). Type II—physis + metaphysis (most common). Type III—physis + epiphysis. Type IV—physis + metaphysis + epiphysis. Type V—crush injury of the physis. Higher types have greater risk of growth disturbance." }, { q: "When are comparison views helpful in pediatric imaging?", a: "Comparison views of the opposite (uninjured) extremity are helpful when normal anatomic variants (ossification centers, growth plates) might be confused with fractures, especially in young children where multiple ossification centers are present." }] },
    { slug: "pediatric-immobilization-devices", title: "Pediatric Immobilization Devices and Techniques", keywords: ["pediatric immobilization", "Pigg-O-Stat", "child positioning", "infant immobilization"], overview: "Effective immobilization of pediatric patients is essential for obtaining diagnostic-quality images while minimizing repeat exposures and radiation dose. Various devices are available for different age groups and examinations.", mechanism: "Immobilization devices gently restrain the child to prevent voluntary and involuntary motion during exposure. The goal is to maintain proper positioning while ensuring patient safety and comfort.", relevance: "Motion is the primary cause of repeat pediatric radiographs. Effective immobilization reduces repeats by 50-80%, directly reducing radiation dose to the most radiosensitive population.", pearls: ["Pigg-O-Stat: upright immobilizer for infant chest and abdomen radiography.", "Sandbags, tape, and positioning sponges for general immobilization.", "Papoose boards for total body immobilization.", "Parental involvement (holding with lead protection) for cooperative toddlers."], pitfalls: ["Not using immobilization and accepting multiple repeat exposures instead.", "Improperly securing devices, allowing the child to move during exposure."], faq: [{ q: "When should the Pigg-O-Stat be used?", a: "The Pigg-O-Stat is used for upright chest and abdominal radiography in infants and small children (typically birth to 2-3 years). It provides excellent immobilization with adjustable panels that hold the child securely in an upright position." }, { q: "Can parents help with immobilization?", a: "Yes, parents can assist with immobilization under specific conditions: they must wear lead protection, receive clear instructions, be positioned outside the primary beam, and provide only the minimal assistance needed. Pregnant parents should not assist." }] },
    { slug: "neonatal-imaging-considerations", title: "Neonatal Imaging Considerations", keywords: ["neonatal imaging", "NICU radiography", "newborn x-ray", "neonatal chest"], overview: "Neonatal imaging presents unique challenges including extreme radiosensitivity, small body habitus, limited cooperation, and life-support equipment. Modified techniques and strict dose management are essential.", mechanism: "Neonates have very thin body parts requiring significantly reduced technique factors. Their high water content and lack of body fat alter tissue contrast. Life-support equipment (ET tubes, umbilical catheters, IV lines) must be evaluated on every image.", relevance: "Chest and abdominal radiographs are the most common neonatal imaging studies, used for respiratory distress syndrome, necrotizing enterocolitis, pneumothorax, and tube/line placement verification.", pearls: ["Use dedicated neonatal technique charts—adult factors cause massive overexposure.", "Always check tube and line positions: ETT tip at T1-T2, UVC at T8-T9, UAC at T6-T9 (high) or L3-L4 (low).", "Shield gonads whenever possible.", "Single-exposure 'babygram' may include chest and abdomen on one image."], pitfalls: ["Using pediatric (not neonatal) technique factors on a premature infant.", "Not evaluating tube and line positions on every neonatal radiograph."], faq: [{ q: "Where should an endotracheal tube tip be on a neonatal chest radiograph?", a: "The ETT tip should be positioned at T1-T2 level (between the clavicles and carina). Too high risks extubation; too low risks main bronchus intubation (usually right). The tip moves with head position: flexion advances it, extension withdraws it." }, { q: "What is the acceptable technique for neonatal imaging?", a: "Neonatal chest: typically 55-65 kVp at 1-2 mAs with the shortest possible exposure time. SID of 40 inches. Tight collimation essential. The goal is adequate penetration with minimal dose, using the fastest receptor available." }] },
    { slug: "non-accidental-trauma-skeletal-survey", title: "Non-Accidental Trauma (NAT) Skeletal Survey", keywords: ["non-accidental trauma", "child abuse imaging", "skeletal survey", "NAT"], overview: "The skeletal survey is a series of radiographs used to evaluate for non-accidental trauma (child abuse). It follows a standardized protocol to screen for fractures in various stages of healing, which is the hallmark of inflicted injury.", mechanism: "The skeletal survey includes radiographs of the skull, spine, chest, pelvis, and all four extremities. Multiple fractures in different stages of healing are highly suspicious for non-accidental trauma. Specific fracture types (classic metaphyseal lesions, posterior rib fractures) are highly specific for abuse.", relevance: "Radiologic technologists are mandatory reporters of suspected child abuse. Recognition of suspicious fracture patterns is an important professional responsibility.", pearls: ["Classic metaphyseal lesions (corner/bucket-handle fractures) are highly specific for abuse.", "Posterior rib fractures in infants are highly suspicious for abuse.", "Multiple fractures in various stages of healing suggest repeated injury.", "The skeletal survey is standardized—do NOT substitute a 'babygram.'"], pitfalls: ["Performing a single 'babygram' instead of a full skeletal survey with dedicated views.", "Not recognizing healing fractures (callus formation) as evidence of prior injury."], faq: [{ q: "What fractures are most specific for non-accidental trauma?", a: "Classic metaphyseal lesions (corner fractures/bucket-handle fractures), posterior rib fractures in infants, sternal fractures, scapular fractures, and spinous process fractures are highly specific for non-accidental trauma. Multiple fractures in different stages of healing are also characteristic." }, { q: "What does a skeletal survey include?", a: "AP skull, lateral skull, AP chest, lateral thoracolumbar spine, AP pelvis, AP bilateral upper extremities (humeri, forearms, hands), AP bilateral lower extremities (femurs, tibiae/fibulae, feet). Each area requires dedicated views—a single 'babygram' is NOT acceptable." }] }
  ]);

  return entries;
}

async function seedImagingEncyclopedia() {
  console.log("Starting Diagnostic Imaging Encyclopedia seed...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS encyclopedia_topics (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      profession TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      related_lesson_ids TEXT[] DEFAULT '{}',
      related_question_ids TEXT[] DEFAULT '{}',
      related_flashcard_ids TEXT[] DEFAULT '{}',
      status TEXT DEFAULT 'draft',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (profession, slug)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS encyclopedia_entries (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      topic_id VARCHAR NOT NULL,
      profession TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT[] DEFAULT '{}',
      overview TEXT,
      mechanism_physiology TEXT,
      clinical_relevance TEXT,
      signs_symptoms TEXT,
      assessment TEXT,
      management TEXT,
      complications TEXT,
      clinical_pearls JSONB DEFAULT '[]',
      exam_pitfalls JSONB DEFAULT '[]',
      faq_json JSONB DEFAULT '[]',
      related_lesson_ids TEXT[] DEFAULT '{}',
      related_question_ids TEXT[] DEFAULT '{}',
      related_flashcard_ids TEXT[] DEFAULT '{}',
      cross_profession_links JSONB DEFAULT '[]',
      image_placeholders JSONB DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (profession, slug)
    )
  `);

  await pool.query(`ALTER TABLE encyclopedia_entries ADD COLUMN IF NOT EXISTS category TEXT`);
  await pool.query(`ALTER TABLE encyclopedia_entries ADD COLUMN IF NOT EXISTS topic_id VARCHAR`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_encyclopedia_profession_status ON encyclopedia_entries(profession, status)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_encyclopedia_category ON encyclopedia_entries(profession, category)`);

  const entries = makeEntries();
  console.log(`Generated ${entries.length} encyclopedia entries across categories.`);

  let inserted = 0;
  let updated = 0;

  for (const entry of entries) {
    try {
      const topicResult = await pool.query(
        `INSERT INTO encyclopedia_topics (profession, slug, title, category, status)
         VALUES ($1, $2, $3, $4, 'published')
         ON CONFLICT (profession, slug) DO UPDATE SET title = $3, category = $4, status = 'published', updated_at = NOW()
         RETURNING id`,
        [PROFESSION, entry.slug, entry.title, entry.category]
      );
      const topicId = topicResult.rows[0].id;

      const result = await pool.query(
        `INSERT INTO encyclopedia_entries (topic_id, profession, slug, title, category,
          seo_title, seo_description, seo_keywords, overview, mechanism_physiology,
          clinical_relevance, signs_symptoms, assessment, management, complications,
          clinical_pearls, exam_pitfalls, faq_json, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'published', NOW())
         ON CONFLICT (profession, slug) DO UPDATE SET
          title = EXCLUDED.title, category = EXCLUDED.category,
          seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
          seo_keywords = EXCLUDED.seo_keywords, overview = EXCLUDED.overview,
          mechanism_physiology = EXCLUDED.mechanism_physiology,
          clinical_relevance = EXCLUDED.clinical_relevance,
          signs_symptoms = EXCLUDED.signs_symptoms, assessment = EXCLUDED.assessment,
          management = EXCLUDED.management, complications = EXCLUDED.complications,
          clinical_pearls = EXCLUDED.clinical_pearls, exam_pitfalls = EXCLUDED.exam_pitfalls,
          faq_json = EXCLUDED.faq_json, status = 'published',
          published_at = COALESCE(encyclopedia_entries.published_at, NOW()),
          updated_at = NOW()
         RETURNING id, (xmax = 0) AS was_inserted`,
        [topicId, PROFESSION, entry.slug, entry.title, entry.category,
          entry.seoTitle, entry.seoDescription, entry.seoKeywords,
          entry.overview, entry.mechanismPhysiology,
          entry.clinicalRelevance, entry.signsSymptoms,
          entry.assessment, entry.management, entry.complications,
          JSON.stringify(entry.clinicalPearls), JSON.stringify(entry.examPitfalls),
          JSON.stringify(entry.faqJson)]
      );

      if (result.rows[0]?.was_inserted) {
        inserted++;
      } else {
        updated++;
      }
    } catch (err: any) {
      console.error(`Error inserting ${entry.slug}:`, err.message);
    }
  }

  console.log(`\nSeed complete: ${inserted} inserted, ${updated} updated out of ${entries.length} total entries.`);

  const catStats = await pool.query(
    `SELECT category, COUNT(*)::int AS count FROM encyclopedia_entries WHERE profession = $1 AND status = 'published' GROUP BY category ORDER BY category`,
    [PROFESSION]
  );
  console.log("\nEntries by category:");
  for (const row of catStats.rows) {
    console.log(`  ${row.category}: ${row.count}`);
  }

  const total = await pool.query(
    `SELECT COUNT(*)::int AS count FROM encyclopedia_entries WHERE profession = $1 AND status = 'published'`,
    [PROFESSION]
  );
  console.log(`\nTotal published imaging encyclopedia entries: ${total.rows[0].count}`);
}

seedImagingEncyclopedia()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
