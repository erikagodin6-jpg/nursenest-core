import pg from "pg";
import { fixCorrectAnswerData, verifyCorrectAnswerData } from "./migrations/fix-correct-answer-data";

export let lastStartupMigrationTimestamp: string | null = null;

let _cachedImagingQuestions: any[] | null = null;
export function getImagingQuestions() {
  if (!_cachedImagingQuestions) {
    _cachedImagingQuestions = IMAGING_QUESTIONS_DATA;
  }
  return _cachedImagingQuestions;
}

let _cachedPositioningEntries: any[] | null = null;
export function getPositioningEntries() {
  if (!_cachedPositioningEntries) {
    _cachedPositioningEntries = [...POSITIONING_ENTRIES_DATA];
  }
  return _cachedPositioningEntries;
}

let _cachedPhysicsTopics: any[] | null = null;
export function getPhysicsTopics() {
  if (!_cachedPhysicsTopics) {
    _cachedPhysicsTopics = [...PHYSICS_TOPICS_DATA];
  }
  return _cachedPhysicsTopics;
}

let _cachedFlashcards: any[] | null = null;
export function getFlashcards() {
  if (!_cachedFlashcards) {
    _cachedFlashcards = [...FLASHCARDS_DATA];
  }
  return _cachedFlashcards;
}

const IMAGING_QUESTIONS_DATA = [
  { question: "For a PA chest radiograph, the central ray should be directed to which vertebral level?", optionA: "T5", optionB: "T7", optionC: "T10", optionD: "L1", correctAnswer: "B", rationale: "The central ray for a PA chest is directed perpendicular to T7, which corresponds to the level of the inferior angle of the scapulae.", category: "Radiographic Positioning", topic: "Chest", difficulty: 1, country: "canada", bodyPart: "Chest", exam: "camrt" },
  { question: "What is the standard SID for a PA chest radiograph?", optionA: "40 inches (100 cm)", optionB: "48 inches (120 cm)", optionC: "60 inches (150 cm)", optionD: "72 inches (180 cm)", correctAnswer: "D", rationale: "72 inches (180 cm) is the standard SID for erect chest radiography to minimize cardiac magnification.", category: "Radiographic Positioning", topic: "Chest", difficulty: 1, country: "canada", bodyPart: "Chest", exam: "camrt" },
  { question: "On a properly positioned PA chest radiograph, how many posterior ribs should be visible above the diaphragm?", optionA: "6-7 ribs", optionB: "8-9 ribs", optionC: "10 or more ribs", optionD: "12 or more ribs", correctAnswer: "C", rationale: "A minimum of 10 posterior ribs visible above the diaphragm indicates adequate inspiration.", category: "Radiographic Positioning", topic: "Chest", difficulty: 1, country: "canada", bodyPart: "Chest", exam: "camrt" },
  { question: "On a properly positioned PA chest radiograph, the scapulae should be:", optionA: "Superimposed on the lung fields", optionB: "Rotated laterally outside the lung fields", optionC: "Visible within the mediastinum", optionD: "Projected below the diaphragm", correctAnswer: "B", rationale: "Proper positioning with arms rotated forward moves the scapulae lateral to the lung fields for unobstructed visualization.", category: "Radiographic Positioning", topic: "Chest", difficulty: 2, country: "canada", bodyPart: "Chest", exam: "camrt" },
  { question: "Which finding on a PA chest radiograph indicates patient rotation?", optionA: "Unequal distances between medial clavicle ends and spinous processes", optionB: "More than 10 posterior ribs visible", optionC: "Scapulae projected within lung fields", optionD: "Diaphragm at level of 10th posterior rib", correctAnswer: "A", rationale: "Equal distances between the medial clavicle ends and the spinous processes confirm a non-rotated PA chest.", category: "Radiographic Positioning", topic: "Chest", difficulty: 2, country: "canada", bodyPart: "Chest", exam: "camrt" },
  { question: "For a PA projection of the hand, the central ray should be directed to the:", optionA: "First MCP joint", optionB: "Third MCP joint", optionC: "Wrist joint", optionD: "Fifth MCP joint", correctAnswer: "B", rationale: "The CR for a PA hand is directed perpendicular to the third metacarpophalangeal joint.", category: "Radiographic Positioning", topic: "Upper Extremity", difficulty: 1, country: "canada", bodyPart: "Hand", exam: "camrt" },
  { question: "Which wrist projection best demonstrates the scaphoid without foreshortening?", optionA: "PA with radial deviation", optionB: "PA with ulnar deviation", optionC: "Lateral", optionD: "Oblique", correctAnswer: "B", rationale: "Ulnar deviation elongates the scaphoid, reducing foreshortening and providing better visualization.", category: "Radiographic Positioning", topic: "Upper Extremity", difficulty: 2, country: "canada", bodyPart: "Wrist", exam: "camrt" },
  { question: "For an AP knee projection, the leg should be internally rotated:", optionA: "0-2 degrees", optionB: "3-5 degrees", optionC: "10-15 degrees", optionD: "20-25 degrees", correctAnswer: "B", rationale: "3-5 degrees of internal rotation places the femoral epicondyles parallel to the IR, opening the joint space evenly.", category: "Radiographic Positioning", topic: "Lower Extremity", difficulty: 1, country: "canada", bodyPart: "Knee", exam: "camrt" },
  { question: "The mortise view of the ankle requires the leg to be internally rotated approximately:", optionA: "5 degrees", optionB: "15-20 degrees", optionC: "30 degrees", optionD: "45 degrees", correctAnswer: "B", rationale: "15-20 degrees of internal rotation places the intermalleolar line parallel to the IR, demonstrating the ankle mortise without fibular overlap.", category: "Radiographic Positioning", topic: "Lower Extremity", difficulty: 2, country: "canada", bodyPart: "Ankle", exam: "camrt" },
  { question: "For an AP open mouth projection of C1-C2, the line from the lower edge of the upper incisors to the mastoid tips should be:", optionA: "Parallel to the IR", optionB: "Perpendicular to the IR", optionC: "At 15 degrees to the IR", optionD: "At 30 degrees to the IR", correctAnswer: "B", rationale: "This line perpendicular to the IR projects the dens between the upper incisors and the base of the skull for optimal visualization.", category: "Radiographic Positioning", topic: "Spine", difficulty: 2, country: "canada", bodyPart: "Cervical Spine", exam: "camrt" },
  { question: "In the AP axial projection of the cervical spine, the central ray should be angled:", optionA: "5 degrees cephalad", optionB: "15-20 degrees cephalad", optionC: "30 degrees caudad", optionD: "5 degrees caudad", correctAnswer: "B", rationale: "A 15-20 degree cephalad angle demonstrates the cervical intervertebral disc spaces and intervertebral foramina.", category: "Radiographic Positioning", topic: "Spine", difficulty: 3, country: "canada", bodyPart: "Cervical Spine", exam: "camrt" },
  { question: "For an AP supine abdomen (KUB), the central ray is directed to the level of:", optionA: "T12", optionB: "Iliac crests (L4)", optionC: "Pubic symphysis", optionD: "Umbilicus", correctAnswer: "B", rationale: "The CR for a KUB is directed to the level of the iliac crests (L4-L5) to include the entire abdomen.", category: "Radiographic Positioning", topic: "Abdomen", difficulty: 1, country: "canada", bodyPart: "Abdomen", exam: "camrt" },
  { question: "For an AP pelvis projection, the legs should be internally rotated 15-20 degrees to:", optionA: "Open the sacroiliac joints", optionB: "Demonstrate the femoral necks without foreshortening", optionC: "Separate the pubic rami", optionD: "Reduce patient dose", correctAnswer: "B", rationale: "Internal rotation places the femoral necks parallel to the image receptor for true profile demonstration.", category: "Radiographic Positioning", topic: "Pelvis and Hip", difficulty: 2, country: "canada", bodyPart: "Pelvis", exam: "camrt" },
  { question: "Bremsstrahlung radiation is produced when:", optionA: "An electron fills an inner shell vacancy", optionB: "An electron is decelerated by the nuclear force field", optionC: "A photon undergoes pair production", optionD: "An atom undergoes radioactive decay", correctAnswer: "B", rationale: "Bremsstrahlung (braking) radiation is produced when a high-speed electron is slowed down by the electrostatic force of the atomic nucleus.", category: "Radiation Physics", topic: "X-ray Production", difficulty: 1, country: "canada", exam: "camrt" },
  { question: "Which target material is most commonly used in diagnostic X-ray tubes?", optionA: "Molybdenum", optionB: "Copper", optionC: "Tungsten", optionD: "Rhodium", correctAnswer: "C", rationale: "Tungsten (Z=74) is standard due to its high atomic number, high melting point (3370C), and good thermal conductivity.", category: "Radiation Physics", topic: "X-ray Production", difficulty: 1, country: "canada", exam: "camrt" },
  { question: "Which photon interaction is the primary source of scatter radiation in diagnostic radiology?", optionA: "Photoelectric absorption", optionB: "Compton scattering", optionC: "Coherent scattering", optionD: "Pair production", correctAnswer: "B", rationale: "Compton scattering is the predominant interaction in the diagnostic energy range and produces scattered radiation that degrades image quality.", category: "Radiation Physics", topic: "Radiation Interactions", difficulty: 2, country: "canada", exam: "camrt" },
  { question: "Photoelectric absorption probability is proportional to:", optionA: "Z^3 / E^3", optionB: "Z / E", optionC: "Z^2 / E^2", optionD: "Z / E^3", correctAnswer: "A", rationale: "Photoelectric absorption varies directly with the cube of atomic number (Z^3) and inversely with the cube of photon energy (E^3).", category: "Radiation Physics", topic: "Radiation Interactions", difficulty: 3, country: "canada", exam: "camrt" },
  { question: "The CNSC annual occupational whole-body dose limit in Canada is:", optionA: "20 mSv", optionB: "50 mSv", optionC: "100 mSv", optionD: "150 mSv", correctAnswer: "B", rationale: "The Canadian Nuclear Safety Commission sets the annual occupational effective dose limit at 50 mSv, with a 5-year cumulative limit of 100 mSv.", category: "Radiation Safety", topic: "Dose Limits", difficulty: 1, country: "canada", exam: "camrt" },
  { question: "The three cardinal principles of radiation protection are:", optionA: "kVp, mAs, and filtration", optionB: "Time, distance, and shielding", optionC: "Justification, optimization, and limitation", optionD: "Collimation, filtration, and grid use", correctAnswer: "B", rationale: "Time (minimize), distance (maximize), and shielding (use appropriate barriers) are the three cardinal principles.", category: "Radiation Safety", topic: "Radiation Protection", difficulty: 1, country: "canada", exam: "camrt" },
  { question: "According to the inverse square law, if the distance from a radiation source is doubled, the intensity becomes:", optionA: "1/2 of the original", optionB: "1/4 of the original", optionC: "1/8 of the original", optionD: "1/16 of the original", correctAnswer: "B", rationale: "The inverse square law states that radiation intensity is inversely proportional to the square of the distance. Doubling distance reduces intensity to 1/4.", category: "Radiation Physics", topic: "Physics Principles", difficulty: 2, country: "canada", exam: "camrt" },
  { question: "Increasing the kVp by 15% has approximately the same effect on receptor exposure as:", optionA: "Doubling the mAs", optionB: "Halving the mAs", optionC: "Quadrupling the mAs", optionD: "Not changing the mAs", correctAnswer: "A", rationale: "The 15% rule states that increasing kVp by 15% approximately doubles the exposure reaching the receptor.", category: "Image Production", topic: "Technical Factors", difficulty: 1, country: "canada", exam: "camrt" },
  { question: "In digital radiography, window width controls:", optionA: "Image brightness", optionB: "Image contrast", optionC: "Image resolution", optionD: "Image noise", correctAnswer: "B", rationale: "Window width controls contrast. A narrow window displays fewer gray shades producing high contrast; a wide window produces lower contrast.", category: "Image Production", topic: "Digital Imaging", difficulty: 2, country: "canada", exam: "camrt" },
  { question: "Before performing a radiographic examination, the technologist should first:", optionA: "Position the patient", optionB: "Set exposure factors", optionC: "Verify the patient's identity and requisition", optionD: "Turn on the X-ray tube", correctAnswer: "C", rationale: "Patient identification verification is the first step to prevent wrong-patient or wrong-examination errors.", category: "Patient Care", topic: "Patient Safety", difficulty: 1, country: "canada", exam: "camrt" },
  { question: "In the event of a contrast media anaphylactic reaction, the first drug to administer is:", optionA: "Diphenhydramine (Benadryl)", optionB: "Epinephrine", optionC: "Atropine", optionD: "Dexamethasone", correctAnswer: "B", rationale: "Epinephrine is the first-line emergency drug for anaphylaxis, reversing bronchospasm, vasodilation, and increasing cardiac output.", category: "Patient Care", topic: "Emergency Response", difficulty: 3, country: "canada", exam: "camrt" },
  { question: "The purpose of the rotating anode is to:", optionA: "Increase X-ray output", optionB: "Distribute heat over a larger area", optionC: "Improve spatial resolution", optionD: "Reduce patient dose", correctAnswer: "B", rationale: "A rotating anode distributes heat over a larger area (focal track), allowing higher tube loading without melting the target.", category: "Equipment Operation", topic: "X-ray Equipment", difficulty: 1, country: "canada", exam: "camrt" },
  { question: "For a PA chest radiograph, what is the standard SID?", optionA: "40 inches", optionB: "48 inches", optionC: "72 inches", optionD: "60 inches", correctAnswer: "C", rationale: "The standard SID for a PA chest is 72 inches (180 cm) to minimize cardiac magnification.", category: "Radiographic Positioning", topic: "Chest", difficulty: 1, country: "usa", bodyPart: "Chest", exam: "arrt" },
  { question: "The lateral chest radiograph is typically performed with which side against the image receptor?", optionA: "Right side", optionB: "Left side", optionC: "Either side", optionD: "The side closest to the pathology", correctAnswer: "B", rationale: "The left lateral position is standard to minimize cardiac magnification and provide better cardiac evaluation.", category: "Radiographic Positioning", topic: "Chest", difficulty: 2, country: "usa", bodyPart: "Chest", exam: "arrt" },
  { question: "For an AP projection of the forearm, the hand should be:", optionA: "Pronated", optionB: "Supinated", optionC: "In lateral position", optionD: "Clenched in a fist", correctAnswer: "B", rationale: "The hand must be supinated (palm up) for an AP forearm to separate the radius and ulna.", category: "Radiographic Positioning", topic: "Upper Extremity", difficulty: 1, country: "usa", bodyPart: "Forearm", exam: "arrt" },
  { question: "For a lateral knee projection, the knee should be flexed approximately:", optionA: "5 degrees", optionB: "20-30 degrees", optionC: "45 degrees", optionD: "90 degrees", correctAnswer: "B", rationale: "20-30 degrees of flexion is standard for a lateral knee to relax the muscles and tendons for optimal positioning.", category: "Radiographic Positioning", topic: "Lower Extremity", difficulty: 2, country: "usa", bodyPart: "Knee", exam: "arrt" },
  { question: "The annual occupational whole-body effective dose limit recommended by NCRP is:", optionA: "10 mSv", optionB: "25 mSv", optionC: "50 mSv", optionD: "100 mSv", correctAnswer: "C", rationale: "The NCRP recommends an annual occupational effective dose limit of 50 mSv (5 rem) for whole-body exposure.", category: "Radiation Safety", topic: "Dose Limits", difficulty: 1, country: "usa", exam: "arrt" },
  { question: "Compton scattering probability depends primarily on:", optionA: "Atomic number of the absorber", optionB: "Energy of the incident photon", optionC: "Electron density of the absorber", optionD: "Temperature of the absorber", correctAnswer: "C", rationale: "Compton scattering depends on the electron density (electrons per gram) of the absorber, not its atomic number.", category: "Radiation Physics", topic: "Radiation Interactions", difficulty: 1, country: "usa", exam: "arrt" },
  { question: "The Exposure Index (EI) in digital radiography measures:", optionA: "Patient dose", optionB: "Image receptor exposure", optionC: "Image resolution", optionD: "Contrast resolution", correctAnswer: "B", rationale: "The Exposure Index quantifies the radiation reaching the digital detector, providing feedback on technique appropriateness.", category: "Image Production", topic: "Digital Imaging", difficulty: 2, country: "usa", exam: "arrt" },
  { question: "An automatic exposure control (AEC) system terminates the exposure based on:", optionA: "A predetermined time", optionB: "The amount of radiation reaching the detector behind the patient", optionC: "The mAs set by the technologist", optionD: "The kVp selected", correctAnswer: "B", rationale: "AEC systems use radiation detectors behind the patient to measure receptor exposure and terminate when adequate density is achieved.", category: "Equipment Operation", topic: "X-ray Equipment", difficulty: 2, country: "usa", exam: "arrt" },
];

const POSITIONING_ENTRIES_DATA = [
  { projectionName: "PA Erect Chest", bodyPart: "Chest", patientPosition: "Patient stands upright facing the image receptor with chin extended. Arms internally rotated with backs of hands on hips.", centralRay: "Perpendicular to T7, entering at the level of the inferior angle of the scapulae. 72-inch SID.", sid: "72 inches (180 cm)", anatomyDemonstrated: "Both lung fields, costophrenic angles, cardiac silhouette, trachea, mediastinum", tips: "Ensure scapulae are rotated out of lung fields. Check for rotation by comparing medial clavicle ends to spinous processes. Minimum 10 posterior ribs should be visible above diaphragm." },
  { projectionName: "Lateral Chest", bodyPart: "Chest", patientPosition: "Patient stands with left side against image receptor. Arms raised overhead and crossed.", centralRay: "Perpendicular to T7 at the level of the inferior angle of the scapulae, midcoronal plane", sid: "72 inches (180 cm)", anatomyDemonstrated: "Retrosternal and retrocardiac spaces, thoracic spine, sternum, diaphragm", tips: "Left lateral preferred to minimize cardiac magnification. Arms must be elevated sufficiently." },
  { projectionName: "PA Hand", bodyPart: "Upper Extremity", patientPosition: "Patient seated at end of table with hand pronated, fingers extended and slightly separated on image receptor.", centralRay: "Perpendicular to the third MCP joint", anatomyDemonstrated: "All phalanges, metacarpals, carpals, and distal radius and ulna", tips: "Ensure fingers are separated to prevent overlap. Remove rings and jewelry." },
  { projectionName: "PA Wrist", bodyPart: "Upper Extremity", patientPosition: "Patient seated, forearm pronated with wrist centered on image receptor. Fingers slightly flexed.", centralRay: "Perpendicular to the midcarpal area", anatomyDemonstrated: "All 8 carpal bones, distal radius and ulna, proximal metacarpals", tips: "For scaphoid view, use ulnar deviation to elongate the scaphoid." },
  { projectionName: "AP Knee", bodyPart: "Lower Extremity", patientPosition: "Patient supine with knee extended. Leg internally rotated 3-5 degrees.", centralRay: "5 degrees caudad to a point 1 cm below the patellar apex", anatomyDemonstrated: "Distal femur, proximal tibia and fibula, patella, joint space, intercondylar eminence", tips: "Internal rotation of 3-5 degrees opens the joint space evenly." },
  { projectionName: "Ankle Mortise (AP)", bodyPart: "Lower Extremity", patientPosition: "Patient supine, leg internally rotated 15-20 degrees until intermalleolar line is parallel to IR.", centralRay: "Perpendicular to midpoint between malleoli", anatomyDemonstrated: "Tibiotalar joint (ankle mortise), medial and lateral malleoli, talus", tips: "15-20 degrees internal rotation opens the mortise joint." },
  { projectionName: "Lateral Cervical Spine", bodyPart: "Spine", patientPosition: "Patient standing or seated in lateral position. Shoulders depressed, chin slightly elevated.", centralRay: "Horizontal beam perpendicular to C4 (level of thyroid cartilage). 72-inch SID.", sid: "72 inches (180 cm)", anatomyDemonstrated: "C1-C7 vertebral bodies, intervertebral disc spaces, spinous processes", tips: "Must demonstrate C7-T1. Patient may need to hold weights to depress shoulders." },
  { projectionName: "AP Open Mouth (C1-C2)", bodyPart: "Spine", patientPosition: "Patient supine or erect. Mouth wide open, line from lower edge of upper incisors to mastoid tips perpendicular to IR.", centralRay: "Perpendicular through the center of the open mouth", anatomyDemonstrated: "C1 (atlas) lateral masses, C2 (axis) odontoid process (dens), atlantoaxial joints", tips: "Mouth must be wide open. Upper incisors and base of skull should not superimpose on the dens." },
  { projectionName: "AP Supine Abdomen (KUB)", bodyPart: "Abdomen", patientPosition: "Patient supine, MSP centered. Arms at sides, knees may be slightly flexed for comfort.", centralRay: "Perpendicular to the iliac crests at the level of L4", anatomyDemonstrated: "Kidneys, liver shadow, spleen, psoas muscles, bowel gas pattern, bony pelvis", tips: "Must include pubic symphysis inferiorly. Check for rotation by comparing iliac wings." },
  { projectionName: "AP External Rotation Shoulder", bodyPart: "Shoulder", patientPosition: "Patient erect or supine. Arm externally rotated with palm facing forward.", centralRay: "Perpendicular to a point 1 inch inferior and lateral to the coracoid process", anatomyDemonstrated: "Greater tuberosity in profile, humeral head, glenoid cavity", tips: "Ensure sufficient external rotation to profile the greater tuberosity." },
  { projectionName: "AP Pelvis", bodyPart: "Pelvis/Hip", patientPosition: "Patient supine, MSP centered, both legs internally rotated 15-20 degrees.", centralRay: "Perpendicular midway between ASIS and pubic symphysis", anatomyDemonstrated: "Both hip joints, femoral necks, greater and lesser trochanters, iliac wings, sacrum", tips: "Internal rotation of 15-20 degrees demonstrates femoral necks without foreshortening." },
  { projectionName: "PA Caldwell (Skull)", bodyPart: "Skull", patientPosition: "Patient prone or erect facing image receptor. OML perpendicular to receptor.", centralRay: "15 degrees caudad to exit the nasion", anatomyDemonstrated: "Frontal bone, frontal sinuses, superior orbital margins, petrous ridges in lower third of orbits", tips: "OML must be perpendicular to IR. Check that petrous ridges project into lower third of orbits." },
  { projectionName: "AP Portable Chest", bodyPart: "Chest", patientPosition: "Patient supine or semi-upright in bed. Arms away from thorax if possible.", centralRay: "Perpendicular to the sternum at T7, minimum 40-inch SID", sid: "40 inches minimum", anatomyDemonstrated: "Lung fields, heart (magnified), mediastinum, tubes and lines positions", tips: "Heart appears magnified due to increased OID and shorter SID." },
  { projectionName: "AP Forearm", bodyPart: "Upper Extremity", patientPosition: "Patient seated, arm extended on table with forearm supinated.", centralRay: "Perpendicular to midpoint of forearm", anatomyDemonstrated: "Radius, ulna, proximal and distal radioulnar joints, elbow joint, wrist joint", tips: "Forearm must be fully supinated to separate radius and ulna. Include both joints." },
  { projectionName: "AP Lumbar Spine", bodyPart: "Spine", patientPosition: "Patient supine, MSP centered. Knees flexed with feet flat on table.", centralRay: "Perpendicular to L3 (level of the lower costal margin or umbilicus)", anatomyDemonstrated: "L1-L5 vertebral bodies, disc spaces, pedicles, spinous and transverse processes", tips: "Flex knees to reduce lumbar lordosis and open disc spaces." },
  { projectionName: "AP Internal Rotation Shoulder", bodyPart: "Shoulder", patientPosition: "Patient erect or supine. Arm internally rotated with palm against thigh.", centralRay: "Perpendicular to coracoid process, 1 inch inferior", anatomyDemonstrated: "Lesser tuberosity in profile, humeral head, glenohumeral joint space", tips: "Sufficient internal rotation profiles the lesser tuberosity." },
  { projectionName: "Cross-Table Lateral Hip", bodyPart: "Pelvis/Hip", patientPosition: "Patient supine, unaffected leg elevated and flexed. Affected leg remains as found.", centralRay: "Horizontal beam perpendicular to femoral neck, entering at the groin crease", anatomyDemonstrated: "Femoral head, femoral neck, greater and lesser trochanters, acetabulum", tips: "IR must be positioned firmly against lateral hip. Do not move affected limb." },
  { projectionName: "Towne (AP Axial Skull)", bodyPart: "Skull", patientPosition: "Patient supine or erect facing tube. OML perpendicular to IR.", centralRay: "30 degrees caudad (to OML) through foramen magnum", anatomyDemonstrated: "Occipital bone, foramen magnum, dorsum sellae projected within foramen magnum", tips: "30-degree CR angle projects dorsum sellae within foramen magnum." },
  { projectionName: "Lateral Knee", bodyPart: "Lower Extremity", patientPosition: "Patient lateral recumbent, knee flexed 20-30 degrees.", centralRay: "5 degrees cephalad to knee joint", anatomyDemonstrated: "Distal femur, proximal tibia and fibula, patella, patellofemoral joint", tips: "20-30 degrees flexion relaxes muscles for optimal positioning." },
  { projectionName: "AP Foot", bodyPart: "Lower Extremity", patientPosition: "Patient supine or seated, plantar surface of foot flat on IR.", centralRay: "10 degrees posteriorly, directed to base of third metatarsal", anatomyDemonstrated: "Phalanges, metatarsals, cuneiforms, cuboid, navicular, tarsometatarsal joints", tips: "10-degree posterior angle opens tarsometatarsal joint spaces." },
] as const;

const PHYSICS_TOPICS_DATA = [
  { title: "X-ray Production", category: "Radiation Physics", difficulty: 2, content: "X-rays are produced when high-speed electrons strike a target material (tungsten, Z=74). Two types: Bremsstrahlung (braking) radiation and Characteristic radiation. Maximum photon energy equals kVp.", keyConcepts: ["Bremsstrahlung radiation", "Characteristic radiation", "Tungsten target Z=74", "K-shell binding energy 69.5 keV", "Maximum energy = kVp"], formulas: [{ name: "Maximum Photon Energy", formula: "E_max = kVp (in keV)" }, { name: "Beam Intensity", formula: "I proportional to kVp^2 x mAs x Z" }] },
  { title: "Radiation Interactions with Matter", category: "Radiation Physics", difficulty: 3, content: "Compton Scattering: photon interacts with outer-shell electron, producing scatter. Photoelectric Absorption: photon completely absorbed, probability proportional to Z^3/E^3.", keyConcepts: ["Compton scattering", "Photoelectric absorption", "Z^3/E^3 relationship", "Subject contrast", "30 keV crossover"], formulas: [{ name: "Compton Probability", formula: "Proportional to electron density" }, { name: "Photoelectric Probability", formula: "Proportional to Z^3 / E^3" }] },
  { title: "Image Quality Factors", category: "Image Production", difficulty: 2, content: "Spatial Resolution: ability to distinguish closely spaced objects. Contrast Resolution: ability to distinguish similar tissues. Window width controls contrast, window level controls brightness.", keyConcepts: ["Spatial resolution", "Contrast resolution", "Focal spot size", "Window width", "Window level"], formulas: [{ name: "Magnification Factor", formula: "MF = SID / SOD" }, { name: "mAs Reciprocity", formula: "mA x time(s) = mAs" }] },
  { title: "Radiation Protection Principles", category: "Radiation Safety", difficulty: 2, content: "ALARA Principle. Three cardinal principles: Time, Distance, Shielding. Canada dose limits: 50 mSv/year occupational. USA: 50 mSv/year, cumulative 10 mSv x age.", keyConcepts: ["ALARA", "Time distance shielding", "CNSC dose limits", "NCRP dose limits", "Inverse square law"], formulas: [{ name: "Inverse Square Law", formula: "I1/I2 = (D2/D1)^2" }, { name: "Half-Value Layer", formula: "Reduces beam intensity to 50%" }] },
  { title: "X-ray Tube Components", category: "Radiation Physics", difficulty: 2, content: "Cathode: negative electrode with tungsten filament. Anode: positive electrode where X-rays produced. Rotating anodes distribute heat. Line-focus principle and anode heel effect.", keyConcepts: ["Cathode", "Anode", "Thermionic emission", "Focal spot", "Line-focus principle", "Anode heel effect"], formulas: [{ name: "Heat Units (single phase)", formula: "HU = kVp x mA x time" }, { name: "Heat Units (HF)", formula: "HU = kVp x mA x time x 1.40" }] },
  { title: "Digital Image Processing", category: "Image Production", difficulty: 2, content: "CR uses PSP plates scanned by laser. DR uses flat-panel detectors. Direct DR uses amorphous selenium. DR has higher DQE than CR.", keyConcepts: ["CR PSP plates", "DR flat panel", "Direct vs indirect DR", "DQE", "Exposure Index", "Deviation Index"], formulas: [{ name: "Exposure Index", formula: "EI = c x log10(Exposure)" }, { name: "Deviation Index", formula: "DI = 10 x log10(EI / EI_target)" }] },
  { title: "Radiation Biology", category: "Radiation Safety", difficulty: 3, content: "Law of Bergonie and Tribondeau: rapidly dividing, undifferentiated cells are most radiosensitive. Lymphocytes most radiosensitive blood cells. LNT model for radiation protection.", keyConcepts: ["Bergonie and Tribondeau", "Radiosensitivity", "LNT model", "Stochastic effects", "Deterministic effects"], formulas: [{ name: "Effective Dose", formula: "E = sum of (w_T x H_T)" }, { name: "Equivalent Dose", formula: "H = D x w_R" }] },
  { title: "Exposure Factors and Technique", category: "Image Production", difficulty: 1, content: "kVp controls beam quality and contrast. mAs controls quantity and has direct relationship with patient dose. 15% rule: 15% kVp increase doubles exposure.", keyConcepts: ["kVp controls quality", "mAs controls quantity", "15% rule", "SID and inverse square law", "Grid ratio", "AEC"], formulas: [{ name: "15% Rule", formula: "15% increase in kVp = doubling of mAs" }, { name: "Direct Square Law", formula: "New mAs = old mAs x (new SID / old SID)^2" }] },
] as const;

const FLASHCARDS_DATA = [
  { front: "What is the standard SID for a PA chest radiograph?", back: "72 inches (180 cm). Minimizes cardiac magnification.", category: "Positioning", bodyPart: "Chest", difficulty: 1 },
  { front: "How many posterior ribs should be visible on a properly inspired PA chest?", back: "Minimum of 10 posterior ribs above the diaphragm.", category: "Positioning", bodyPart: "Chest", difficulty: 1 },
  { front: "What indicates rotation on a PA chest radiograph?", back: "Unequal distances between medial clavicle ends and spinous processes.", category: "Positioning", bodyPart: "Chest", difficulty: 2 },
  { front: "What is the CR direction for a PA hand?", back: "Perpendicular to the third MCP joint.", category: "Positioning", bodyPart: "Upper Extremity", difficulty: 1 },
  { front: "Which wrist view best demonstrates the scaphoid bone?", back: "PA with ulnar deviation. Elongates the scaphoid, reducing foreshortening.", category: "Positioning", bodyPart: "Upper Extremity", difficulty: 2 },
  { front: "How much should the leg be internally rotated for an ankle mortise view?", back: "15-20 degrees. Places intermalleolar line parallel to IR.", category: "Positioning", bodyPart: "Lower Extremity", difficulty: 2 },
  { front: "For an AP pelvis, how much should the legs be internally rotated?", back: "15-20 degrees. Demonstrates femoral necks without foreshortening.", category: "Positioning", bodyPart: "Pelvis/Hip", difficulty: 1 },
  { front: "For AP lumbar spine, why are the knees flexed?", back: "To reduce lumbar lordosis and open intervertebral disc spaces.", category: "Positioning", bodyPart: "Spine", difficulty: 2 },
  { front: "What is bremsstrahlung radiation?", back: "Radiation produced when an electron is decelerated by the nuclear force field. Produces continuous spectrum, 80-90% of beam.", category: "Physics", difficulty: 1 },
  { front: "What is the K-shell binding energy of tungsten?", back: "69.5 keV. Incident electrons must exceed this energy for K-characteristic X-rays.", category: "Physics", difficulty: 3 },
  { front: "What determines the maximum photon energy in an X-ray beam?", back: "The kVp setting. Maximum energy in keV equals the peak kilovoltage.", category: "Physics", difficulty: 1 },
  { front: "How does photoelectric absorption probability change with atomic number?", back: "Proportional to Z^3. Full relationship: Z^3/E^3.", category: "Physics", difficulty: 3 },
  { front: "What is the primary source of scatter radiation in diagnostic radiology?", back: "Compton scattering. Predominant in the diagnostic energy range.", category: "Physics", difficulty: 2 },
  { front: "State the inverse square law.", back: "I1/I2 = (D2/D1)^2. Doubling distance reduces intensity to one-quarter.", category: "Physics", difficulty: 2 },
  { front: "What is the anode heel effect?", back: "Greater beam intensity on cathode side. Thicker body parts should be placed cathode-side.", category: "Physics", difficulty: 2 },
  { front: "What is the line-focus principle?", back: "Angling the anode target makes the effective focal spot smaller than actual, improving resolution while maintaining heat capacity.", category: "Physics", difficulty: 2 },
  { front: "What is the annual occupational whole-body dose limit in Canada (CNSC)?", back: "50 mSv per year, with 100 mSv cumulative over 5 years.", category: "Radiation Safety", difficulty: 1 },
  { front: "What is the annual occupational dose limit in the USA (NCRP)?", back: "50 mSv (5 rem) per year. Cumulative: 10 mSv x age.", category: "Radiation Safety", difficulty: 1 },
  { front: "What are the three cardinal principles of radiation protection?", back: "Time (minimize), Distance (maximize), and Shielding (use appropriate barriers).", category: "Radiation Safety", difficulty: 1 },
  { front: "What does ALARA stand for?", back: "As Low As Reasonably Achievable. The guiding principle for all radiation exposures.", category: "Radiation Safety", difficulty: 1 },
  { front: "What is the 15% kVp rule?", back: "Increasing kVp by 15% approximately doubles receptor exposure, equivalent to doubling mAs.", category: "Image Production", difficulty: 2 },
  { front: "What controls contrast in digital radiography?", back: "Window width. Narrow = high contrast. Wide = low contrast. Window level controls brightness.", category: "Image Production", difficulty: 2 },
  { front: "What does Deviation Index (DI) = 0 indicate?", back: "Exposure matched the target exactly. Positive = overexposure, Negative = underexposure.", category: "Image Production", difficulty: 2 },
  { front: "What technical factor primarily controls X-ray quantity?", back: "mAs (milliampere-seconds). Directly controls number of photons produced.", category: "Image Production", difficulty: 1 },
  { front: "What is the purpose of the rotating anode?", back: "Distributes heat over a larger area (focal track), allowing higher tube loading without melting.", category: "Equipment", difficulty: 1 },
  { front: "What is the most effective method to prevent infection spread in radiology?", back: "Proper hand hygiene (handwashing or alcohol-based sanitizer).", category: "Patient Care", difficulty: 1 },
  { front: "When is water-soluble iodinated contrast preferred over barium?", back: "When bowel perforation is suspected. Barium causes severe peritonitis if it leaks.", category: "Patient Care", difficulty: 2 },
  { front: "What is the first drug for anaphylactic contrast reaction?", back: "Epinephrine. Reverses bronchospasm, vasodilation, and increases cardiac output.", category: "Patient Care", difficulty: 3 },
  { front: "What must be verified before any radiographic exam?", back: "Patient identity and requisition. First step to prevent wrong-patient errors.", category: "Patient Care", difficulty: 1 },
  { front: "What target material is used in diagnostic X-ray tubes?", back: "Tungsten (Z=74). High atomic number, high melting point (3370 C).", category: "Equipment", difficulty: 1 },
] as const;

export async function runStartupDataMigrations() {
  const { getPool } = await import("./db");
  const pool = getPool();

  try {
    const client = await pool.connect();
    try {
      try {
        const r = await client.query("SELECT COUNT(*)::int AS cnt FROM users WHERE email IS NULL");
        if (r.rows[0].cnt > 0) {
          await client.query(`UPDATE users SET email = 'user-' || id || '@placeholder.local' WHERE email IS NULL`);
          console.log(`[Startup Migration] Backfilled ${r.rows[0].cnt} NULL emails`);
        }
      } catch (emailErr: any) {
        console.log(`[Startup Migration] Email backfill check: ${emailErr.message}`);
      }

      const { rows: [{ count: needsReviewCount }] } = await client.query(
        "SELECT count(*) as count FROM exam_questions WHERE status = 'needs_review'"
      );
      const nrCount = parseInt(needsReviewCount);
      if (nrCount > 0) {
        console.log(`[Startup Migration] Found ${nrCount} exam questions with needs_review status (not auto-promoting — use publish gate)`);
      }

      const { rows: [{ count: draftCount }] } = await client.query(
        "SELECT count(*) as count FROM exam_questions WHERE status = 'draft'"
      );
      const dCount = parseInt(draftCount);
      if (dCount > 0) {
        console.log(`[Startup Migration] Found ${dCount} draft exam questions (not auto-promoting — use publish gate)`);
      }

      const { rows: [{ count: publishedCount }] } = await client.query(
        "SELECT count(*) as count FROM exam_questions WHERE status = 'published'"
      );
      console.log(`[Startup Migration] Total published exam questions: ${publishedCount}`);

      await quarantineKnownBrokenContent(client);

      try {
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS slug text NOT NULL DEFAULT ''`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS body_region text DEFAULT ''`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS country text DEFAULT 'canada'`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS exam_relevance text DEFAULT 'medium'`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS body_part_position text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS central_ray_direction text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS detector_placement text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS collimation_guidance text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS breathing_instructions text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS common_errors jsonb DEFAULT '[]'::jsonb`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS evaluation_criteria text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS clinical_notes text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS exam_tips text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS teaching_image_url text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS exam_image_url text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS positioning_diagram_url text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS incorrect_image_url text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS positioning_errors jsonb DEFAULT '[]'::jsonb`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS quiz_questions jsonb DEFAULT '[]'::jsonb`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS label_overlays jsonb DEFAULT '[]'::jsonb`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS learning_steps jsonb DEFAULT '[]'::jsonb`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS seo_title text`);
        await client.query(`ALTER TABLE imaging_positioning_entries ADD COLUMN IF NOT EXISTS seo_description text`);
        console.log(`[Startup Migration] Ensured positioning entry columns exist`);
      } catch (colErr: any) {
        console.log(`[Startup Migration] Positioning column migration: ${colErr.message}`);
      }

      await client.query(`UPDATE imaging_positioning_entries SET slug = lower(replace(replace(projection_name, ' ', '-'), '(', '')) WHERE slug = '' OR slug IS NULL`);
      await client.query(`UPDATE imaging_positioning_entries SET body_region = body_part WHERE (body_region = '' OR body_region IS NULL) AND body_part IS NOT NULL`);

      try {
        const fixResult = await fixCorrectAnswerData(pool);
        if (fixResult.stringFixed > 0 || fixResult.numberFixed > 0 || fixResult.optionsFixed > 0) {
          console.log(`[Startup Migration] Fixed exam data: ${fixResult.stringFixed} correct_answer strings, ${fixResult.numberFixed} correct_answer numbers, ${fixResult.optionsFixed} options strings converted`);
        }
        const verify = await verifyCorrectAnswerData(pool);
        if (!verify.valid) {
          console.warn(`[Startup Migration] correct_answer types still non-array:`, verify.counts);
        }
      } catch (caErr: any) {
        console.error(`[Startup Migration] correct_answer fix error: ${caErr.message}`);
      }



      try {
        await client.query(`CREATE TABLE IF NOT EXISTS imaging_products (
          id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
          title text NOT NULL,
          slug text NOT NULL UNIQUE,
          product_type text NOT NULL,
          description text,
          features text[] DEFAULT '{}'::text[],
          price_cad integer NOT NULL,
          price_usd integer NOT NULL,
          compare_at_price_cad integer,
          compare_at_price_usd integer,
          stripe_price_id_cad text,
          stripe_price_id_usd text,
          stripe_product_id text,
          billing_interval text,
          content_scope jsonb DEFAULT '{}'::jsonb,
          question_count integer DEFAULT 0,
          flashcard_count integer DEFAULT 0,
          exam_count integer DEFAULT 0,
          country text,
          popular boolean DEFAULT false,
          sort_order integer DEFAULT 0,
          is_active boolean DEFAULT true,
          created_at timestamp DEFAULT NOW() NOT NULL,
          updated_at timestamp DEFAULT NOW() NOT NULL
        )`);
        await client.query(`CREATE TABLE IF NOT EXISTS imaging_entitlements (
          id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id varchar NOT NULL,
          product_id varchar,
          entitlement_type text NOT NULL,
          scope jsonb DEFAULT '{}'::jsonb,
          status text DEFAULT 'active',
          expires_at timestamp,
          created_at timestamp DEFAULT NOW() NOT NULL
        )`);
        await client.query(`CREATE TABLE IF NOT EXISTS imaging_purchases (
          id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id varchar NOT NULL,
          product_id varchar NOT NULL,
          stripe_session_id text,
          stripe_payment_intent_id text,
          amount integer NOT NULL,
          currency text DEFAULT 'USD',
          status text DEFAULT 'completed',
          purchased_at timestamp DEFAULT NOW() NOT NULL
        )`);
        await client.query(`CREATE TABLE IF NOT EXISTS imaging_preview_config (
          id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
          content_type text NOT NULL UNIQUE,
          free_limit integer NOT NULL DEFAULT 5,
          preview_message text,
          updated_at timestamp DEFAULT NOW() NOT NULL
        )`);
        console.log(`[Startup Migration] Imaging monetization tables ensured`);
      } catch (monErr: any) {
        console.log(`[Startup Migration] Imaging monetization tables: ${monErr.message}`);
      }

      const { runCrossPlatformAuthMigration } = await import("./migrations/cross-platform-auth-unification");
      await runCrossPlatformAuthMigration(pool);



      const { runAnalyticsEventsMigration } = await import("./migrations/analytics-events");
      await runAnalyticsEventsMigration(pool);

      const { runQuerySafetyIndexMigration } = await import("./migrations/query-safety-indexes");
      await runQuerySafetyIndexMigration(pool);

      lastStartupMigrationTimestamp = new Date().toISOString();
      console.log(`[Startup Migration] Completed at ${lastStartupMigrationTimestamp}`);
      const dbHost = (process.env.DATABASE_URL || "").replace(/\/\/.*@/, "//***@").split("/")[2] || "unknown";
      console.log(`[Startup Migration] Target database: ${dbHost}`);

    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[Startup Migration] Error:", err.message);
  }
}

const KNOWN_BROKEN_CONTENT_TITLES = [
  "Restless Leg Syndrome",
  "Macular Degeneration",
  "Gestational Diabetes",
  "Bell's Palsy",
];

const BOILERPLATE_PATTERNS = [
  /is a clinical topic requiring comprehensive nursing knowledge/i,
  /requires comprehensive nursing knowledge and understanding/i,
  /is an important clinical topic that nursing students/i,
  /\[Topic\] is a/i,
];

async function quarantineKnownBrokenContent(client: any): Promise<void> {
  try {
    const tableCheck = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exam_questions') AS exists`
    );
    if (!tableCheck.rows[0]?.exists) return;

    for (const title of KNOWN_BROKEN_CONTENT_TITLES) {
      try {
        const result = await client.query(
          `UPDATE exam_questions SET status = 'quarantined', quarantined_at = NOW(), quarantine_reason = $2
           WHERE status = 'published' AND (stem ILIKE $1 OR topic ILIKE $1)
           RETURNING id`,
          [`%${title}%`, `Known broken content: ${title} - quarantined by startup migration`]
        );
        if (result.rowCount > 0) {
          console.log(`[Startup Migration] Quarantined ${result.rowCount} questions matching "${title}"`);
        }
      } catch {}
    }

    try {
      let boilerplateCount = 0;
      for (const pattern of BOILERPLATE_PATTERNS) {
        const patternStr = pattern.source;
        const result = await client.query(
          `UPDATE exam_questions SET status = 'quarantined', quarantined_at = NOW(), quarantine_reason = 'Boilerplate/template content detected by startup migration'
           WHERE status = 'published' AND stem ~* $1
           RETURNING id`,
          [patternStr]
        );
        boilerplateCount += result.rowCount || 0;
      }
      if (boilerplateCount > 0) {
        console.log(`[Startup Migration] Quarantined ${boilerplateCount} questions with boilerplate content`);
      }
    } catch (e: any) {
      console.warn(`[Startup Migration] Boilerplate quarantine check: ${e.message}`);
    }
  } catch (e: any) {
    console.warn(`[Startup Migration] Quarantine check error: ${e.message}`);
  }
}
