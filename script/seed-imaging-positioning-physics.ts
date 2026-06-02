import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

const POSITIONING_ENTRIES = [
  { projectionName: "PA Erect Chest", bodyPart: "Chest", patientPosition: "Patient stands upright facing the image receptor with chin extended. Arms internally rotated with backs of hands on hips.", centralRay: "Perpendicular to T7, entering at the level of the inferior angle of the scapulae. 72-inch SID.", sid: "72 inches (180 cm)", anatomyDemonstrated: "Both lung fields, costophrenic angles, cardiac silhouette, trachea, mediastinum", tips: "Ensure scapulae are rotated out of lung fields. Check for rotation by comparing medial clavicle ends to spinous processes. Minimum 10 posterior ribs should be visible above diaphragm." },
  { projectionName: "Lateral Chest", bodyPart: "Chest", patientPosition: "Patient stands with left side against image receptor. Arms raised overhead and crossed.", centralRay: "Perpendicular to T7 at the level of the inferior angle of the scapulae, midcoronal plane", sid: "72 inches (180 cm)", anatomyDemonstrated: "Retrosternal and retrocardiac spaces, thoracic spine, sternum, diaphragm", tips: "Left lateral preferred to minimize cardiac magnification. Arms must be elevated sufficiently. Posterior ribs should superimpose." },
  { projectionName: "PA Hand", bodyPart: "Upper Extremity", patientPosition: "Patient seated at end of table with hand pronated, fingers extended and slightly separated on image receptor.", centralRay: "Perpendicular to the third MCP joint", anatomyDemonstrated: "All phalanges, metacarpals, carpals, and distal radius and ulna", tips: "Ensure fingers are separated to prevent overlap. Remove rings and jewelry. Hand should be flat against receptor." },
  { projectionName: "PA Wrist", bodyPart: "Upper Extremity", patientPosition: "Patient seated, forearm pronated with wrist centered on image receptor. Fingers slightly flexed.", centralRay: "Perpendicular to the midcarpal area", anatomyDemonstrated: "All 8 carpal bones (scaphoid, lunate, triquetrum, pisiform, trapezium, trapezoid, capitate, hamate), distal radius and ulna, proximal metacarpals", tips: "For scaphoid view, use ulnar deviation to elongate the scaphoid. Ensure wrist is flat against receptor." },
  { projectionName: "AP Knee", bodyPart: "Lower Extremity", patientPosition: "Patient supine with knee extended. Leg internally rotated 3-5 degrees.", centralRay: "5 degrees caudad to a point 1 cm below the patellar apex", anatomyDemonstrated: "Distal femur, proximal tibia and fibula, patella, joint space, intercondylar eminence", tips: "Internal rotation of 3-5 degrees opens the joint space evenly. Adjust CR angle for body habitus." },
  { projectionName: "Ankle Mortise (AP)", bodyPart: "Lower Extremity", patientPosition: "Patient supine, leg internally rotated 15-20 degrees until intermalleolar line is parallel to IR.", centralRay: "Perpendicular to midpoint between malleoli", anatomyDemonstrated: "Tibiotalar joint (ankle mortise), medial and lateral malleoli, talus, distal tibia and fibula", tips: "15-20 degrees internal rotation opens the mortise joint. Insufficient rotation shows fibular overlap on talus." },
  { projectionName: "Lateral Cervical Spine", bodyPart: "Spine", patientPosition: "Patient standing or seated in lateral position. Shoulders depressed, chin slightly elevated.", centralRay: "Horizontal beam perpendicular to C4 (level of thyroid cartilage). 72-inch SID.", sid: "72 inches (180 cm)", anatomyDemonstrated: "C1-C7 vertebral bodies, intervertebral disc spaces, spinous processes, zygapophyseal joints, odontoid process", tips: "Must demonstrate C7-T1. Patient may need to hold weights to depress shoulders. Avoid rotation." },
  { projectionName: "AP Open Mouth (C1-C2)", bodyPart: "Spine", patientPosition: "Patient supine or erect. Mouth wide open, line from lower edge of upper incisors to mastoid tips perpendicular to IR.", centralRay: "Perpendicular through the center of the open mouth", anatomyDemonstrated: "C1 (atlas) lateral masses, C2 (axis) odontoid process (dens), atlantoaxial joints", tips: "Mouth must be wide open. Upper incisors and base of skull should not superimpose on the dens." },
  { projectionName: "AP Supine Abdomen (KUB)", bodyPart: "Abdomen", patientPosition: "Patient supine, MSP centered. Arms at sides, knees may be slightly flexed for comfort.", centralRay: "Perpendicular to the iliac crests at the level of L4", anatomyDemonstrated: "Kidneys, liver shadow, spleen, psoas muscles, bowel gas pattern, bony pelvis, pubic symphysis", tips: "Must include pubic symphysis inferiorly. Check for rotation by comparing iliac wings and obturator foramina." },
  { projectionName: "AP External Rotation Shoulder", bodyPart: "Shoulder", patientPosition: "Patient erect or supine. Arm externally rotated with palm facing forward (anatomical position).", centralRay: "Perpendicular to a point 1 inch inferior and lateral to the coracoid process", anatomyDemonstrated: "Greater tuberosity in profile, humeral head, glenoid cavity, acromioclavicular joint", tips: "Ensure sufficient external rotation to profile the greater tuberosity. CR centered on glenohumeral joint." },
  { projectionName: "AP Pelvis", bodyPart: "Pelvis/Hip", patientPosition: "Patient supine, MSP centered, both legs internally rotated 15-20 degrees with feet together.", centralRay: "Perpendicular midway between ASIS and pubic symphysis", anatomyDemonstrated: "Both hip joints, femoral necks, greater and lesser trochanters, iliac wings, sacrum, pubic symphysis", tips: "Internal rotation of 15-20 degrees demonstrates femoral necks without foreshortening. Use gonadal shielding when possible." },
  { projectionName: "PA Caldwell (Skull)", bodyPart: "Skull", patientPosition: "Patient prone or erect facing image receptor. OML perpendicular to receptor, MSP perpendicular.", centralRay: "15 degrees caudad to exit the nasion", anatomyDemonstrated: "Frontal bone, frontal sinuses, superior orbital margins, crista galli, petrous ridges in lower third of orbits", tips: "OML must be perpendicular to IR. Check that petrous ridges project into lower third of orbits." },
  { projectionName: "AP Portable Chest", bodyPart: "Chest", patientPosition: "Patient supine or semi-upright in bed. Arms away from thorax if possible.", centralRay: "Perpendicular to the sternum at T7, minimum 40-inch SID", sid: "40 inches minimum", anatomyDemonstrated: "Lung fields, heart (magnified), mediastinum, tubes and lines positions", tips: "Heart appears magnified due to increased OID and shorter SID. Note any tubes, lines, or medical devices." },
  { projectionName: "AP Forearm", bodyPart: "Upper Extremity", patientPosition: "Patient seated, arm extended on table with forearm supinated. Both elbow and wrist joints included.", centralRay: "Perpendicular to midpoint of forearm", anatomyDemonstrated: "Radius, ulna, proximal and distal radioulnar joints, elbow joint, wrist joint, radial tuberosity", tips: "Forearm must be fully supinated to separate radius and ulna. Include both joints." },
  { projectionName: "AP Lumbar Spine", bodyPart: "Spine", patientPosition: "Patient supine, MSP centered. Knees flexed with feet flat on table to reduce lordosis.", centralRay: "Perpendicular to L3 (level of the lower costal margin or umbilicus)", anatomyDemonstrated: "L1-L5 vertebral bodies, disc spaces, pedicles, spinous and transverse processes, sacroiliac joints", tips: "Flex knees to reduce lumbar lordosis and open disc spaces. Check for rotation by assessing pedicle symmetry." },
  { projectionName: "AP Internal Rotation Shoulder", bodyPart: "Shoulder", patientPosition: "Patient erect or supine. Arm internally rotated with palm against thigh.", centralRay: "Perpendicular to coracoid process, 1 inch inferior", anatomyDemonstrated: "Lesser tuberosity in profile, humeral head, glenohumeral joint space", tips: "Sufficient internal rotation profiles the lesser tuberosity. CR centered 1 inch below coracoid process." },
  { projectionName: "Cross-Table Lateral Hip", bodyPart: "Pelvis/Hip", patientPosition: "Patient supine, unaffected leg elevated and flexed. Affected leg remains in neutral or as found.", centralRay: "Horizontal beam perpendicular to femoral neck, entering at the groin crease", anatomyDemonstrated: "Femoral head, femoral neck, greater and lesser trochanters, acetabulum", tips: "IR must be positioned firmly against lateral hip. Horizontal beam required. Do not move affected limb." },
  { projectionName: "Towne (AP Axial Skull)", bodyPart: "Skull", patientPosition: "Patient supine or erect facing tube. OML perpendicular to IR, MSP perpendicular.", centralRay: "30 degrees caudad (to OML) through foramen magnum", anatomyDemonstrated: "Occipital bone, foramen magnum, dorsum sellae projected within foramen magnum, petrous pyramids", tips: "30-degree CR angle projects dorsum sellae within foramen magnum. Check MSP alignment for rotation." },
  { projectionName: "Lateral Knee", bodyPart: "Lower Extremity", patientPosition: "Patient lateral recumbent, knee flexed 20-30 degrees.", centralRay: "5 degrees cephalad to knee joint (1 inch distal to medial epicondyle)", filmSize: "10x12 or 24x30 cm", anatomyDemonstrated: "Distal femur, proximal tibia and fibula, patella, patellofemoral joint, suprapatellar bursa region", tips: "20-30 degrees flexion relaxes muscles for optimal positioning. Femoral condyles should superimpose." },
  { projectionName: "AP Foot", bodyPart: "Lower Extremity", patientPosition: "Patient supine or seated, plantar surface of foot flat on IR.", centralRay: "10 degrees posteriorly (toward heel), directed to base of third metatarsal", anatomyDemonstrated: "Phalanges, metatarsals, cuneiforms, cuboid, navicular, tarsometatarsal joints", tips: "10-degree posterior angle opens tarsometatarsal joint spaces. Include entire foot from toes to calcaneus." },
];

const PHYSICS_TOPICS = [
  {
    title: "X-ray Production",
    category: "Radiation Physics",
    difficulty: 2,
    content: "X-rays are produced when high-speed electrons strike a target material (tungsten, Z=74). Two types of radiation are produced: Bremsstrahlung (braking) radiation occurs when electrons are decelerated by the nuclear force field, producing a continuous energy spectrum (80-90% of beam). Characteristic radiation occurs when an incoming electron ejects an inner-shell electron, producing discrete-energy photons specific to the target material. K-characteristic X-rays of tungsten are 57-69 keV. Maximum photon energy equals the peak kilovoltage (kVp). Beam intensity is proportional to kVp squared times mAs times target atomic number.",
    keyConcepts: ["Bremsstrahlung radiation", "Characteristic radiation", "Tungsten target Z=74", "K-shell binding energy 69.5 keV", "Maximum energy = kVp"],
    formulas: [
      { name: "Maximum Photon Energy", formula: "E_max = kVp (in keV)" },
      { name: "Beam Intensity", formula: "I proportional to kVp^2 x mAs x Z" },
    ],
  },
  {
    title: "Radiation Interactions with Matter",
    category: "Radiation Physics",
    difficulty: 3,
    content: "Compton Scattering: Incident photon interacts with a loosely bound outer-shell electron. The photon is scattered with reduced energy while the electron is ejected. Probability depends on electron density (independent of Z). Primary source of scatter radiation and image fog. Photoelectric Absorption: Incident photon is completely absorbed by an inner-shell electron which is then ejected. Probability proportional to Z^3/E^3. Produces subject contrast in the image. No scattered radiation. In soft tissue, crossover from photoelectric to Compton dominance occurs at approximately 30 keV.",
    keyConcepts: ["Compton scattering", "Photoelectric absorption", "Z^3/E^3 relationship", "Subject contrast", "Scatter radiation", "30 keV crossover"],
    formulas: [
      { name: "Compton Probability", formula: "Proportional to electron density (independent of Z)" },
      { name: "Photoelectric Probability", formula: "Proportional to Z^3 / E^3" },
    ],
  },
  {
    title: "Image Quality Factors",
    category: "Image Production",
    difficulty: 2,
    content: "Spatial Resolution: The ability to distinguish two closely spaced objects as separate entities. Measured in line pairs per millimeter (lp/mm). Affected by focal spot size (smaller = better), OID (shorter = better), SID (longer = better), and detector element size. Contrast Resolution: The ability to distinguish between similar tissues. In digital imaging, window width controls contrast (narrow = high contrast) and window level controls brightness. Subject contrast is affected by kVp, tissue type, and part thickness.",
    keyConcepts: ["Spatial resolution", "Contrast resolution", "Focal spot size", "OID", "SID", "Window width", "Window level"],
    formulas: [
      { name: "Magnification Factor", formula: "MF = SID / SOD (where SOD = SID - OID)" },
      { name: "mAs Reciprocity", formula: "mA x time(s) = mAs" },
    ],
  },
  {
    title: "Radiation Protection Principles",
    category: "Radiation Safety",
    difficulty: 2,
    content: "ALARA Principle: As Low As Reasonably Achievable. The guiding principle requiring all exposures be kept as low as reasonably achievable. Three cardinal principles: Time (minimize), Distance (maximize), and Shielding (use appropriate barriers). Dose Limits - Canada (CNSC): Occupational 50 mSv/year, 100 mSv over 5 years. Public 1 mSv/year. Lens of eye 50 mSv/year. Pregnant worker 4 mSv remainder of pregnancy. Extremities 500 mSv/year. Dose Limits - USA (NCRP/NRC): Occupational 50 mSv/year. Cumulative 10 mSv x age. Public 1 mSv/year. Embryo/fetus 5 mSv total gestation, 0.5 mSv/month.",
    keyConcepts: ["ALARA", "Time distance shielding", "CNSC dose limits", "NCRP dose limits", "Inverse square law", "Half-value layer"],
    formulas: [
      { name: "Inverse Square Law", formula: "I1/I2 = (D2/D1)^2" },
      { name: "Half-Value Layer", formula: "Reduces beam intensity to 50%" },
    ],
  },
  {
    title: "X-ray Tube Components",
    category: "Radiation Physics",
    difficulty: 2,
    content: "Cathode Assembly: Negative electrode containing tungsten filament for thermionic emission. Dual filament design (small 0.5-0.6mm and large 1.0-1.2mm focal spots). Focusing cup directs electrons toward anode. Anode Assembly: Positive electrode where X-rays are produced. Rotating anodes (3000-10000 RPM) distribute heat over larger area. Target material: tungsten or tungsten-rhenium alloy. Anode angle typically 7-17 degrees. Line-focus principle: actual focal spot larger than effective focal spot. Anode heel effect: intensity decreases toward the anode end.",
    keyConcepts: ["Cathode", "Anode", "Thermionic emission", "Focal spot", "Line-focus principle", "Anode heel effect", "Rotating anode"],
    formulas: [
      { name: "Heat Units (single phase)", formula: "HU = kVp x mA x time" },
      { name: "Heat Units (3-phase/HF)", formula: "HU = kVp x mA x time x 1.35 (3-phase) or 1.40 (HF)" },
    ],
  },
  {
    title: "Digital Image Processing",
    category: "Image Production",
    difficulty: 2,
    content: "Computed Radiography (CR): Uses photostimulable phosphor (PSP) imaging plate (barium fluorohalide doped with europium). Latent image stored as trapped electrons. Plate scanned by laser in CR reader, releasing light detected by PMT. Plates reusable approximately 10,000 times. Digital Radiography (DR): Indirect DR uses scintillator (cesium iodide or gadolinium oxysulfide) coupled to photodiode array. Direct DR uses amorphous selenium to convert X-rays directly to electrical charge. DR has higher DQE than CR, immediate image availability. TFT array reads the charge.",
    keyConcepts: ["CR PSP plates", "DR flat panel", "Direct vs indirect DR", "Amorphous selenium", "DQE", "Exposure Index", "Deviation Index"],
    formulas: [
      { name: "Exposure Index", formula: "EI = c x log10(Exposure)" },
      { name: "Deviation Index", formula: "DI = 10 x log10(EI / EI_target)" },
    ],
  },
  {
    title: "Radiation Biology",
    category: "Radiation Safety",
    difficulty: 3,
    content: "Radiosensitivity (Law of Bergonie and Tribondeau): Cells are more radiosensitive when rapidly dividing, having a long mitotic future, and undifferentiated. Lymphocytes are most radiosensitive blood cells. Mature nerve and muscle cells are most radioresistant. Fetal tissue highly radiosensitive, especially during organogenesis (weeks 2-8). Dose-Response: Linear nonthreshold (LNT) model used for radiation protection. Stochastic effects: probability increases with dose, no threshold (cancer, genetic effects). Deterministic effects: severity increases above threshold (skin erythema at 2 Gy, cataracts).",
    keyConcepts: ["Bergonie and Tribondeau", "Radiosensitivity", "LNT model", "Stochastic effects", "Deterministic effects", "Organogenesis"],
    formulas: [
      { name: "Effective Dose", formula: "E = sum of (w_T x H_T)" },
      { name: "Equivalent Dose", formula: "H = D x w_R (w_R = 1.0 for X-rays)" },
    ],
  },
  {
    title: "Exposure Factors and Technique",
    category: "Image Production",
    difficulty: 1,
    content: "kVp controls beam quality (penetrating ability) and has the greatest effect on image contrast. mAs controls beam quantity (number of photons) and has a direct proportional relationship with patient dose. The 15% rule: increasing kVp by 15% doubles receptor exposure, equivalent to doubling mAs. SID affects intensity via inverse square law and magnification. Grid ratio affects scatter cleanup but requires increased mAs (higher Bucky factor). AEC systems terminate exposure based on radiation reaching detectors behind the patient.",
    keyConcepts: ["kVp controls quality", "mAs controls quantity", "15% rule", "SID and inverse square law", "Grid ratio", "AEC"],
    formulas: [
      { name: "15% Rule", formula: "15% increase in kVp = doubling of mAs" },
      { name: "Direct Square Law (mAs/distance)", formula: "New mAs = old mAs x (new SID / old SID)^2" },
    ],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    for (const entry of POSITIONING_ENTRIES) {
      const existing = await client.query(
        `SELECT id FROM imaging_positioning_entries WHERE body_part=$1 AND projection_name=$2 LIMIT 1`,
        [entry.bodyPart, entry.projectionName]
      );
      if (existing.rows.length > 0) {
        console.log(`  Skip: ${entry.bodyPart} - ${entry.projectionName} (exists)`);
        continue;
      }
      await client.query(
        `INSERT INTO imaging_positioning_entries (projection_name, body_part, patient_position, central_ray, sid, film_size, anatomy_demonstrated, tips, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published')`,
        [entry.projectionName, entry.bodyPart, entry.patientPosition, entry.centralRay, entry.sid || null, entry.filmSize || null, entry.anatomyDemonstrated || null, entry.tips || null]
      );
      console.log(`  Created: ${entry.bodyPart} - ${entry.projectionName}`);
    }

    for (const topic of PHYSICS_TOPICS) {
      const existing = await client.query(
        `SELECT id FROM imaging_physics_topics WHERE title=$1 LIMIT 1`,
        [topic.title]
      );
      if (existing.rows.length > 0) {
        console.log(`  Skip: ${topic.title} (exists)`);
        continue;
      }
      await client.query(
        `INSERT INTO imaging_physics_topics (title, content, category, key_concepts, formulas, difficulty, status) VALUES ($1,$2,$3,$4,$5,$6,'published')`,
        [topic.title, topic.content, topic.category, topic.keyConcepts, JSON.stringify(topic.formulas), topic.difficulty]
      );
      console.log(`  Created: ${topic.title}`);
    }

    console.log("Positioning & physics seed complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => { console.error(err); process.exit(1); });
