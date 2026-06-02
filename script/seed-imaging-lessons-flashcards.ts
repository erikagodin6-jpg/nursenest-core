import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildFullContent(lesson: { content: string; examTraps: string[]; memoryAid: string }): string {
  const trapsHtml = lesson.examTraps.map(t => `<li>${t}</li>`).join("");
  return `${lesson.content}

<h2>Exam Traps</h2><ul>${trapsHtml}</ul>

<h2>Memory Aid</h2><p>${lesson.memoryAid}</p>`;
}

interface Lesson {
  title: string;
  slug: string;
  content: string;
  category: string;
  modality: string;
  country: string;
  examType: string;
  keyConcepts: string[];
  formulas: { name: string; formula: string; description: string }[];
  examTraps: string[];
  memoryAid: string;
  clinicalRelevance: string;
  diagramConfig: Record<string, unknown>;
  quizItems: { topic: string; category: string; bodySystem?: string }[];
  difficulty: number;
  sortOrder: number;
}

interface Flashcard {
  front: string;
  back: string;
  modality: string;
  bodyPart: string;
  category: string;
  country: string;
  examType: string;
  topic: string;
  difficulty: number;
}

const LESSONS: Lesson[] = [
  {
    title: "Chest X-ray Interpretation",
    slug: "chest-xray-interpretation",
    content: `<h2>Overview</h2><p>Chest radiography is the most frequently performed diagnostic imaging examination worldwide. It provides critical information about the heart, lungs, mediastinum, pleura, and thoracic skeleton. Mastery of systematic chest X-ray interpretation is essential for ARRT and CAMRT certification and daily clinical practice.</p>

<h2>Relevant Anatomy</h2><p><strong>Thoracic structures visualized:</strong></p><ul><li><strong>Lungs:</strong> Right lung has 3 lobes (upper, middle, lower) separated by horizontal and oblique fissures; left lung has 2 lobes (upper, lower) separated by the oblique fissure. The lingula is the tongue-like projection of the left upper lobe.</li><li><strong>Heart:</strong> Occupies the mediastinum, 2/3 on the left side. Cardiothoracic ratio should be <50% on PA projection.</li><li><strong>Mediastinum:</strong> Contains the trachea, esophagus, great vessels (aorta, SVC, IVC), and lymph nodes.</li><li><strong>Diaphragm:</strong> Right hemidiaphragm is typically 1-2 cm higher than left due to the liver.</li><li><strong>Hilum:</strong> Contains pulmonary arteries, veins, and bronchi. Left hilum is normally 2 cm higher than right.</li></ul>

<h2>Imaging Technique</h2><p><strong>Standard PA chest:</strong> 72-inch (180 cm) SID, 110-125 kVp (high kVp technique reduces contrast for better mediastinal visualization), both lateral AEC chambers selected. Erect position with full inspiration (minimum 10 posterior ribs visible).</p><p><strong>Lateral chest:</strong> Left lateral standard to minimize cardiac magnification. Arms elevated. Same SID and kVp as PA.</p><p><strong>AP portable:</strong> When patient cannot stand. Shorter SID (40-48 inches), AP projection magnifies anterior structures including the heart.</p>

<h2>Patient Positioning</h2><ul><li>PA erect: chin elevated, shoulders rolled forward to move scapulae laterally, hands on hips or arms wrapped around cassette holder</li><li>Full inspiration: instruct patient to take a deep breath and hold</li><li>No rotation: midsagittal plane perpendicular to IR, equal distance from medial clavicle ends to spinous processes</li><li>Left lateral: left side against IR, arms raised above head, midsagittal plane parallel to IR</li></ul>

<h2>Radiation Safety</h2><p>High kVp technique (110-125 kVp) reduces patient dose by increasing beam penetration and reducing absorption. Proper collimation to include only from lung apices to costophrenic angles. Gonadal shielding when appropriate. PA projection reduces breast dose compared to AP. Proper AEC chamber selection prevents repeat exposures.</p>

<h2>Image Interpretation Basics</h2><p><strong>Systematic approach (ABCDEFGHI):</strong></p><ul><li><strong>A</strong> - Airway (trachea midline, carina at T5-T6)</li><li><strong>B</strong> - Bones (ribs, clavicles, thoracic spine)</li><li><strong>C</strong> - Cardiac (size, shape, cardiothoracic ratio <50%)</li><li><strong>D</strong> - Diaphragm (right higher than left, sharp costophrenic angles)</li><li><strong>E</strong> - Effusion/Edges (pleural spaces, lung margins)</li><li><strong>F</strong> - Fields (lung parenchyma, compare bilateral)</li><li><strong>G</strong> - Great vessels (aortic knob, mediastinal contours)</li><li><strong>H</strong> - Hilum (symmetry, density, position)</li><li><strong>I</strong> - Impression (overall assessment, correlate with clinical history)</li></ul>

<h2>Common Pathology Findings</h2><ul><li><strong>Pneumonia:</strong> Airspace opacity, air bronchograms, lobar or segmental distribution</li><li><strong>Pneumothorax:</strong> Absent lung markings peripherally, visible pleural line, deep sulcus sign on supine</li><li><strong>Pleural effusion:</strong> Meniscus sign on erect, costophrenic angle blunting (>200 mL visible)</li><li><strong>CHF:</strong> Cardiomegaly, cephalization of vessels, Kerley B lines, bilateral pleural effusions, pulmonary edema (bat-wing pattern)</li><li><strong>COPD:</strong> Hyperinflated lungs (>10 posterior ribs), flattened diaphragms, increased AP diameter</li><li><strong>Atelectasis:</strong> Volume loss, mediastinal shift toward affected side, elevated hemidiaphragm</li></ul>

<h2>Clinical Pearls</h2><ul><li>Always compare with prior radiographs when available</li><li>Silhouette sign: loss of a border indicates adjacent pathology (e.g., loss of right heart border = right middle lobe disease)</li><li>Air bronchograms confirm airspace disease (air in bronchi surrounded by consolidated lung)</li><li>On portable AP, do NOT use cardiothoracic ratio to diagnose cardiomegaly — magnification effect</li><li>Check for proper tube and line placement: ET tube 2-4 cm above carina, central line tip at SVC-RA junction</li></ul>`,
    category: "Radiographic Positioning",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Systematic interpretation ABCDEFGHI", "PA vs AP differences", "Cardiothoracic ratio", "Silhouette sign", "Air bronchograms", "High kVp technique"],
    formulas: [{ name: "Cardiothoracic ratio", formula: "CTR = cardiac width / thoracic width × 100", description: "Normal CTR is less than 50% on PA projection" }],
    examTraps: [
      "PA projection minimizes cardiac magnification — AP magnifies the heart",
      "Left lateral is standard to minimize cardiac magnification",
      "10 POSTERIOR ribs = adequate inspiration (not anterior)",
      "Use both LATERAL AEC chambers for PA chest — never center chamber (causes overexposure of lungs)",
      "Lordotic view projects clavicles above lung apices — useful for apical pathology"
    ],
    memoryAid: "RIPE for quality: Rotation (equal clavicle-spinous process distances), Inspiration (10 posterior ribs), Penetration (thoracic vertebrae through heart), Exposure (apices to CP angles). ABCDEFGHI for interpretation.",
    clinicalRelevance: "Chest radiography is the most common imaging study. Technologists must produce diagnostic-quality images consistently and recognize critical findings requiring immediate physician notification.",
    diagramConfig: {
      type: "anatomy_diagram",
      diagrams: [
        { name: "PA Chest Anatomy Overlay", description: "Labeled diagram showing cardiac silhouette, lung fields, mediastinum, hilum, costophrenic angles, and diaphragm on PA chest radiograph" },
        { name: "Systematic Review Diagram", description: "Flow diagram showing ABCDEFGHI systematic approach to chest X-ray interpretation" }
      ]
    },
    quizItems: [
      { topic: "Chest Radiography", category: "Radiographic Positioning" },
      { topic: "Chest X-ray Interpretation", category: "Image Production" },
      { topic: "PA Chest Positioning", category: "Procedures" }
    ],
    difficulty: 1,
    sortOrder: 1
  },
  {
    title: "Radiographic Positioning for Wrist",
    slug: "radiographic-positioning-wrist",
    content: `<h2>Overview</h2><p>The wrist is one of the most commonly imaged anatomic regions due to the high incidence of wrist injuries, particularly scaphoid fractures. A complete wrist series typically includes PA, oblique, and lateral projections, with additional views such as the scaphoid (ulnar deviation) and carpal tunnel (Gaynor-Hart) as clinically indicated.</p>

<h2>Relevant Anatomy</h2><p><strong>Carpal bones (8 bones in 2 rows):</strong></p><ul><li><strong>Proximal row (lateral to medial):</strong> Scaphoid, Lunate, Triquetrum, Pisiform</li><li><strong>Distal row (lateral to medial):</strong> Trapezium, Trapezoid, Capitate, Hamate</li><li><strong>Scaphoid:</strong> Most commonly fractured carpal bone, spans both rows, blood supply enters distally (risk of avascular necrosis)</li><li><strong>Carpal tunnel:</strong> Bounded by hook of hamate and pisiform (ulnar side), scaphoid tubercle and trapezium ridge (radial side), covered by flexor retinaculum</li></ul>

<h2>Imaging Technique</h2><p>Tabletop technique (no grid), small focal spot for detail. Typical factors: 50-60 kVp, 3-5 mAs. SID 40 inches (100 cm). Detail cassette or DR plate. Collimate to include distal radius/ulna, all carpal bones, and proximal metacarpals.</p>

<h2>Patient Positioning</h2><ul><li><strong>PA wrist:</strong> Hand pronated, fingers slightly flexed, CR perpendicular to midcarpal area. Demonstrates carpal bones with minimal overlap.</li><li><strong>Oblique wrist:</strong> 45° lateral rotation from pronated position, CR to midcarpal area. Opens intercarpal spaces on lateral side.</li><li><strong>Lateral wrist:</strong> Ulnar surface down, forearm and wrist in true lateral, radius and ulna superimposed. CR to radial styloid process.</li><li><strong>Scaphoid view:</strong> PA with ulnar deviation + 10-15° CR angle toward elbow. Elongates scaphoid to detect fractures.</li><li><strong>Carpal tunnel (Gaynor-Hart):</strong> Wrist hyperextended, CR angled 25-30° tangentially through carpal canal.</li></ul>

<h2>Radiation Safety</h2><p>Extremity imaging delivers low dose but ALARA still applies. Proper collimation to wrist area only. Use smallest IR size appropriate. Lead apron for patient when possible. Avoid unnecessary repeat exposures through careful positioning.</p>

<h2>Image Interpretation Basics</h2><p>On PA: evaluate carpal bones for fracture lines, joint space uniformity (normal 1-2 mm gaps), and alignment of three carpal arcs (Gilula's arcs). On lateral: evaluate for dorsal or volar tilt of the lunate (normal: volar tilt, cup faces palm). Check for distal radius fracture (Colles = dorsal displacement, Smith = volar displacement).</p>

<h2>Common Pathology Findings</h2><ul><li><strong>Scaphoid fracture:</strong> Often occult on initial films, seen on scaphoid view, waist fracture most common</li><li><strong>Colles fracture:</strong> Distal radius fracture with dorsal displacement and angulation (dinner fork deformity)</li><li><strong>Smith fracture:</strong> Distal radius fracture with volar displacement (reverse Colles)</li><li><strong>Lunate dislocation:</strong> On lateral, lunate tips volarly (spilled teacup sign)</li><li><strong>Perilunate dislocation:</strong> On lateral, lunate stays in place, remaining carpals displace dorsally</li><li><strong>De Quervain tenosynovitis:</strong> Clinical diagnosis but imaging excludes fracture</li></ul>

<h2>Clinical Pearls</h2><ul><li>Scaphoid fractures may not be visible for 10-14 days — if clinical suspicion is high, immobilize and follow up</li><li>Always image the wrist in neutral position first, then perform special views</li><li>On lateral, the capitate should sit in the lunate cup — disruption indicates carpal instability</li><li>Navicular = old terminology for scaphoid</li></ul>`,
    category: "Radiographic Positioning",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["8 carpal bones in 2 rows", "Scaphoid fracture detection", "Ulnar deviation technique", "Gilula's arcs", "Colles vs Smith fracture", "Carpal tunnel view"],
    formulas: [],
    examTraps: [
      "Scaphoid view uses ULNAR deviation (not radial)",
      "Scaphoid is the MOST commonly fractured carpal bone",
      "Scaphoid blood supply enters distally — proximal pole fractures risk AVN",
      "Lateral wrist: radius and ulna must be SUPERIMPOSED",
      "Carpal tunnel view requires wrist HYPEREXTENSION — contraindicated if fracture suspected"
    ],
    memoryAid: "Carpal bones: 'So Long To Pinky, Here Comes The Thumb' = Scaphoid, Lunate, Triquetrum, Pisiform, Hamate, Capitate, Trapezoid, Trapezium (proximal lateral to medial, then distal medial to lateral).",
    clinicalRelevance: "Wrist injuries are extremely common in emergency departments. Proper positioning, especially the scaphoid view, can mean the difference between detecting and missing a clinically significant fracture.",
    diagramConfig: {
      type: "anatomy_diagram",
      diagrams: [
        { name: "Carpal Bone Anatomy", description: "Labeled diagram of 8 carpal bones in proximal and distal rows from PA perspective" },
        { name: "Wrist Positioning Diagram", description: "Positioning diagrams showing PA, oblique, lateral, scaphoid, and carpal tunnel views with CR angles" },
        { name: "Gilula's Arcs", description: "Diagram showing three smooth arcs traced along carpal bone margins on PA view" }
      ]
    },
    quizItems: [
      { topic: "Wrist Positioning", category: "Radiographic Positioning" },
      { topic: "Upper Extremity", category: "Procedures" },
      { topic: "Carpal Bones", category: "Anatomy/Physiology" }
    ],
    difficulty: 1,
    sortOrder: 2
  },
  {
    title: "CT Imaging Basics",
    slug: "ct-imaging-basics",
    content: `<h2>Overview</h2><p>Computed Tomography (CT) uses a rotating X-ray tube and detector array to acquire cross-sectional images of the body. Modern multidetector CT (MDCT) scanners can acquire hundreds of slices per rotation, enabling rapid volumetric imaging with multiplanar and 3D reconstructions. CT is essential for trauma, oncology, vascular, and neurological imaging.</p>

<h2>Relevant Anatomy</h2><p>CT can image any body region with excellent spatial resolution. Key anatomic considerations:</p><ul><li><strong>Brain:</strong> Gray matter (40 HU), white matter (30 HU), CSF (0-5 HU), acute blood (50-70 HU)</li><li><strong>Chest:</strong> Lung parenchyma, mediastinal structures, pulmonary vasculature</li><li><strong>Abdomen/Pelvis:</strong> Solid organs (liver, spleen, kidneys, pancreas), bowel, retroperitoneum, vasculature</li><li><strong>Musculoskeletal:</strong> Complex fractures, spine, joints</li></ul>

<h2>Imaging Technique</h2><p><strong>Hounsfield Units (HU):</strong> Water = 0, Air = -1000, Dense bone = +1000, Fat = -50 to -100, Muscle = 40-60, Blood = 50-70.</p><p><strong>Key parameters:</strong></p><ul><li><strong>kVp:</strong> Typically 80-140 kVp; lower kVp increases contrast (good for CT angiography) but increases noise and dose</li><li><strong>mAs:</strong> Controls quantum noise; higher mAs = less noise but more dose</li><li><strong>Pitch:</strong> Table travel per rotation / beam collimation. Pitch >1 = faster scan, lower dose, potential for artifacts. Pitch <1 = overlap, better image quality, higher dose</li><li><strong>Slice thickness:</strong> Thinner slices improve spatial resolution but increase noise</li><li><strong>Reconstruction kernel:</strong> Soft tissue (smooth) vs bone (sharp) algorithms</li></ul>

<h2>Patient Positioning</h2><ul><li>Supine, head-first for most examinations</li><li>Arms above head for body CT to reduce beam-hardening artifacts</li><li>Gantry tilt for axial head CT (parallel to orbitomeatal line)</li><li>Breath-hold instructions for chest and abdomen CT</li><li>Center patient in gantry for optimal image quality and accurate ATCM</li></ul>

<h2>Radiation Safety</h2><p><strong>CT dose metrics:</strong></p><ul><li><strong>CTDI (CT Dose Index):</strong> Dose per rotation measured in mGy</li><li><strong>DLP (Dose-Length Product):</strong> CTDI × scan length (mGy·cm)</li><li><strong>Effective dose:</strong> DLP × conversion factor (organ-specific)</li></ul><p><strong>Dose reduction strategies:</strong> Automatic tube current modulation (ATCM), iterative reconstruction, appropriate kVp selection, proper scan range limitation, bismuth shielding for superficial organs.</p>

<h2>Image Interpretation Basics</h2><p><strong>Window settings:</strong></p><ul><li>Brain: W:80, L:40</li><li>Subdural: W:200, L:80</li><li>Lung: W:1500, L:-700</li><li>Mediastinum: W:350, L:50</li><li>Bone: W:2000, L:300</li><li>Liver: W:150, L:60</li></ul><p>Adjust window width for contrast (narrow = high contrast) and window level for brightness.</p>

<h2>Common Pathology Findings</h2><ul><li><strong>Acute stroke:</strong> Hyperdense vessel sign (clot), loss of gray-white differentiation, sulcal effacement</li><li><strong>Pulmonary embolism:</strong> Filling defect in pulmonary arteries on CT angiography</li><li><strong>Aortic dissection:</strong> Intimal flap with true and false lumens</li><li><strong>Appendicitis:</strong> Dilated appendix >6mm, periappendiceal fat stranding, appendicolith</li><li><strong>Kidney stones:</strong> Hyperdense focus in urinary tract on non-contrast CT</li></ul>

<h2>Clinical Pearls</h2><ul><li>Non-contrast CT head is the first-line study for acute stroke (to exclude hemorrhage before thrombolysis)</li><li>CT angiography requires precise timing — use bolus tracking or test bolus for optimal arterial opacification</li><li>Always check scout images for unexpected findings and proper scan range</li><li>Iterative reconstruction can reduce dose by 30-50% compared to filtered back projection</li></ul>`,
    category: "CT Imaging",
    modality: "CT",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Hounsfield units", "CT pitch", "CTDI and DLP", "Window settings", "Iterative reconstruction", "ATCM", "Multiplanar reconstruction"],
    formulas: [
      { name: "CT Pitch", formula: "Pitch = Table travel per rotation / Total beam collimation", description: "Pitch >1 means gaps between rotations; pitch <1 means overlap" },
      { name: "DLP", formula: "DLP = CTDIvol × scan length (cm)", description: "Dose-Length Product represents total dose for the scan" },
      { name: "Effective Dose", formula: "E = DLP × k (conversion factor)", description: "Estimates biological risk; k varies by body region" }
    ],
    examTraps: [
      "Pitch >1 means FASTER scan and LOWER dose but potential gaps",
      "Thinner slices improve resolution but INCREASE noise",
      "CTDI is dose per rotation — DLP better represents TOTAL scan dose",
      "Lower kVp increases iodine contrast but also increases noise and dose",
      "Patient must be CENTERED in gantry for accurate ATCM and optimal image quality"
    ],
    memoryAid: "Hounsfield scale landmarks: '-1000 Air, -100 Fat, 0 Water, +40 Muscle, +1000 Bone' = think temperature scale but for density. Window WIDTH = contrast (narrow = high contrast). Window LEVEL = brightness.",
    clinicalRelevance: "CT is the workhorse of modern diagnostic imaging. Understanding scan parameters, dose optimization, and window settings is critical for producing diagnostic-quality images while minimizing patient radiation exposure.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "Hounsfield Unit Scale", description: "Linear scale showing HU values for common tissues from air (-1000) to dense bone (+1000)" },
        { name: "CT Pitch Diagram", description: "Visual showing pitch <1 (overlap), pitch =1 (contiguous), and pitch >1 (gaps) helical acquisition" },
        { name: "Window Settings Comparison", description: "Same CT slice displayed at brain, bone, and soft tissue window settings" }
      ]
    },
    quizItems: [
      { topic: "CT Imaging", category: "CT Imaging" },
      { topic: "Hounsfield Units", category: "Image Production" },
      { topic: "CT Dose", category: "Radiation Safety" }
    ],
    difficulty: 2,
    sortOrder: 3
  },
  {
    title: "Radiation Dose Reduction Strategies",
    slug: "radiation-dose-reduction",
    content: `<h2>Overview</h2><p>Radiation dose reduction is a fundamental responsibility of every radiologic technologist. The ALARA principle (As Low As Reasonably Achievable) guides all dose management decisions. This lesson covers practical strategies across all modalities to minimize patient and occupational radiation exposure while maintaining diagnostic image quality.</p>

<h2>Relevant Anatomy</h2><p><strong>Radiosensitive tissues requiring special protection:</strong></p><ul><li><strong>Gonads:</strong> Highly radiosensitive, potential hereditary effects</li><li><strong>Thyroid:</strong> Especially sensitive in children, risk of thyroid cancer</li><li><strong>Breast tissue:</strong> Radiosensitive, PA positioning reduces breast dose vs AP</li><li><strong>Lens of eye:</strong> Risk of radiation-induced cataracts (threshold ~500 mGy for acute, lower for chronic)</li><li><strong>Bone marrow:</strong> Radiosensitive hematopoietic tissue, risk of leukemia</li><li><strong>Embryo/fetus:</strong> Most radiosensitive during organogenesis (weeks 2-8)</li></ul>

<h2>Imaging Technique</h2><p><strong>Dose reduction techniques by modality:</strong></p><ul><li><strong>Radiography:</strong> Optimize kVp/mAs, use AEC properly, minimize repeats</li><li><strong>Fluoroscopy:</strong> Pulsed fluoroscopy, last-image hold, minimize fluoro time, tight collimation</li><li><strong>CT:</strong> ATCM, iterative reconstruction, appropriate kVp, limit scan range</li></ul><p><strong>The 15% rule for dose reduction:</strong> Increasing kVp by 15% and halving mAs maintains density while reducing patient dose (higher energy beam = less absorption).</p>

<h2>Patient Positioning</h2><ul><li>PA positioning preferred over AP for chest and skull to reduce dose to breast and lens</li><li>Proper centering ensures AEC functions correctly, preventing repeat exposures</li><li>Immobilization devices prevent motion, reducing need for repeat exposures</li><li>Correct IR size selection prevents unnecessary field size exposure</li></ul>

<h2>Radiation Safety</h2><p><strong>Three cardinal principles:</strong></p><ul><li><strong>Time:</strong> Minimize time near radiation source (especially fluoroscopy)</li><li><strong>Distance:</strong> Maximize distance — inverse square law (double distance = 1/4 dose)</li><li><strong>Shielding:</strong> Lead aprons (0.5 mm Pb), thyroid shields, gonadal shields, lead gloves</li></ul><p><strong>NCRP/CNSC dose limits:</strong></p><ul><li>Occupational whole body: 50 mSv/year (NCRP) / 50 mSv/year, 100 mSv/5 years (CNSC)</li><li>Lens of eye: 150 mSv/year (NCRP) / 20 mSv/year averaged (CNSC)</li><li>Skin/extremities: 500 mSv/year</li><li>Embryo/fetus: 5 mSv gestation (NCRP) / 4 mSv remainder of pregnancy (CNSC)</li><li>General public: 1 mSv/year</li></ul>

<h2>Image Interpretation Basics</h2><p>Dose optimization requires understanding the relationship between dose and image quality. Exposure indicators (EI) and Deviation Index (DI) provide objective feedback on whether proper technique was used. DI = 0 means target exposure; positive = overexposure; negative = underexposure.</p>

<h2>Common Pathology Findings</h2><p>Radiation dose management is relevant across all pathology. Key considerations:</p><ul><li>Follow-up studies should use lowest dose protocols that answer the clinical question</li><li>Pediatric patients require reduced dose protocols (smaller body = less attenuation)</li><li>Pregnant patients: only image if benefit outweighs risk, use minimum technique</li><li>Dose creep in digital imaging: overexposure produces acceptable images but increases dose unnecessarily</li></ul>

<h2>Clinical Pearls</h2><ul><li>Always check exposure indicators after each examination — address dose creep proactively</li><li>Proper collimation is the easiest and most effective dose reduction technique</li><li>Use posterior-anterior (PA) projection when possible to reduce dose to radiosensitive anterior structures</li><li>Bismuth shields for CT can reduce breast/thyroid/eye dose by 30-50% but may affect image quality</li><li>Repeat analysis: track and reduce repeat rates — target <5% department-wide</li></ul>`,
    category: "Radiation Safety",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["ALARA principle", "Three cardinal principles", "Inverse square law", "15% rule for dose reduction", "Exposure indicators", "Dose creep", "NCRP and CNSC dose limits"],
    formulas: [
      { name: "Inverse Square Law", formula: "I₂ = I₁ × (D₁/D₂)²", description: "Radiation intensity is inversely proportional to the square of distance" },
      { name: "15% Rule", formula: "New kVp = Old kVp × 1.15; New mAs = Old mAs / 2", description: "Increasing kVp by 15% doubles exposure; halve mAs to compensate while reducing dose" },
      { name: "Deviation Index", formula: "DI = 10 × log₁₀(EI_measured / EI_target)", description: "DI = 0 is optimal; positive = overexposure; negative = underexposure" }
    ],
    examTraps: [
      "Distance is the MOST effective radiation protection method (inverse square law)",
      "Canada fetal dose limit is 4 mSv (not 5 mSv as in US NCRP)",
      "Canada lens dose limit is 20 mSv/year averaged (not old 150 mSv value)",
      "Dose creep: digital systems make overexposed images look acceptable — always check EI",
      "Fuji S-number is INVERSE to other vendor EI systems (low S = more exposure)",
      "Collimation is the simplest and most effective dose reduction technique"
    ],
    memoryAid: "Cardinal principles: TDS = Time, Distance, Shielding. Dose limits: '50-150-500-5-1' (whole body-eye-skin-fetus-public in mSv). Fuji is Flipped (low S = lots of exposure). DI = 0 = Done It right.",
    clinicalRelevance: "Dose optimization is a core competency for every radiologic technologist. Demonstrating ALARA in practice protects patients and is a key focus of both ARRT and CAMRT certification examinations.",
    diagramConfig: {
      type: "radiation_protection_diagram",
      diagrams: [
        { name: "Inverse Square Law Visual", description: "Diagram showing beam divergence and intensity reduction at 1x, 2x, and 3x distances" },
        { name: "Dose Limit Comparison Chart", description: "Table comparing NCRP (USA) and CNSC (Canada) dose limits side by side" },
        { name: "Cardinal Principles Infographic", description: "Visual showing Time, Distance, and Shielding principles with practical examples" }
      ]
    },
    quizItems: [
      { topic: "Radiation Protection", category: "Radiation Safety" },
      { topic: "ALARA", category: "Safety" },
      { topic: "Dose Limits", category: "Radiation Safety" }
    ],
    difficulty: 2,
    sortOrder: 4
  },
  {
    title: "Contrast Media Reactions and Management",
    slug: "contrast-media-reactions",
    content: `<h2>Overview</h2><p>Contrast media are substances administered to patients to enhance visualization of internal structures during imaging examinations. Understanding contrast types, recognizing adverse reactions, and managing them appropriately is critical for patient safety and is heavily tested on ARRT and CAMRT certification exams.</p>

<h2>Relevant Anatomy</h2><p><strong>Organ systems affected by contrast:</strong></p><ul><li><strong>Cardiovascular:</strong> Contrast circulates through vessels; hypotension/bradycardia in severe reactions</li><li><strong>Respiratory:</strong> Bronchospasm, laryngeal edema, pulmonary edema</li><li><strong>Renal:</strong> Kidneys filter contrast — risk of contrast-induced nephropathy (CIN)</li><li><strong>Integumentary:</strong> Urticaria (hives), flushing, angioedema</li><li><strong>GI tract:</strong> Barium coats mucosal surfaces; iodinated contrast enhances vessel/organ opacification</li></ul>

<h2>Imaging Technique</h2><p><strong>Contrast types:</strong></p><ul><li><strong>Positive contrast:</strong> Iodinated (IV for CT, angiography); Barium sulfate (oral/rectal for GI)</li><li><strong>Negative contrast:</strong> Air, CO₂</li><li><strong>Iodinated contrast osmolality:</strong> HOCM (~1500-2000 mOsm/kg, more reactions), LOCM (~500-850 mOsm/kg, fewer reactions), IOCM (~290 mOsm/kg, fewest reactions)</li></ul>

<h2>Patient Positioning</h2><p>Positioning for contrast studies varies by examination. For IV contrast-enhanced CT, the patient is positioned per standard CT protocols. For GI studies, fluoroscopic positioning (RAO for esophagus/stomach, various positions for barium enema) is critical for optimal mucosal coating and lumen distension.</p>

<h2>Radiation Safety</h2><p>Contrast-enhanced studies often involve fluoroscopy (GI studies) or CT, both of which deliver higher doses than plain radiography. Use appropriate dose reduction strategies. Minimize fluoroscopy time during barium studies. For CT, use appropriate kVp and ATCM.</p>

<h2>Image Interpretation Basics</h2><p>Contrast enhances visualization by altering tissue attenuation. Iodine is radiopaque and increases HU on CT. Barium coats GI mucosa, allowing evaluation of mucosal patterns, filling defects, and strictures. Understand normal enhancement patterns to identify abnormal findings.</p>

<h2>Common Pathology Findings</h2><ul><li><strong>Contrast extravasation:</strong> Contrast leaking outside the vessel at injection site — stop injection, elevate, apply warm compress</li><li><strong>Contrast-induced nephropathy:</strong> Rise in creatinine 48-72 hours post-contrast; risk increased in patients with eGFR <30</li><li><strong>Aspiration of barium:</strong> Medical emergency — barium in lungs can cause chemical pneumonitis</li></ul>

<h2>Clinical Pearls</h2><ul><li>Always ask about previous contrast reactions — patients with prior reactions have 5x increased risk</li><li>Premedication protocol: corticosteroids 12 and 2 hours before, plus diphenhydramine 1 hour before</li><li>Metformin: hold 48 hours AFTER iodinated contrast, verify renal function before resuming</li><li>Epinephrine is the FIRST-LINE drug for anaphylaxis — know the dose and route</li><li>Warm contrast (37°C) reduces viscosity and may reduce reaction rates</li><li>eGFR screening: check before IV contrast, especially in patients >60, diabetic, or with renal history</li></ul>`,
    category: "Patient Care",
    modality: "CT",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["HOCM vs LOCM vs IOCM", "Reaction severity classification", "Epinephrine first-line", "Barium contraindications", "Metformin protocol", "CIN risk factors", "Premedication protocol"],
    formulas: [],
    examTraps: [
      "Barium is CONTRAINDICATED if perforation suspected — causes peritonitis",
      "Metformin is held 48 hours AFTER contrast (not before)",
      "Epinephrine is the FIRST-LINE drug for anaphylaxis (not diphenhydramine)",
      "Non-ionic (LOCM) does NOT mean zero reactions — just fewer",
      "Check eGFR/creatinine BEFORE contrast for renal function assessment",
      "Previous reaction = 5x increased risk"
    ],
    memoryAid: "Reaction severity: NUB-BAD-SAD. Mild: Nausea/Urticaria/warmth = Basic. Moderate: Bronchospasm/Angioedema/Dyspnea = Bad. Severe: Shock/Arrest/Death = SAD. Metformin: 'Met AFTER' = hold AFTER contrast.",
    clinicalRelevance: "Contrast reactions can be life-threatening. Every technologist must recognize reaction signs, know emergency protocols, and understand contraindications. This is one of the most heavily tested patient care topics on certification exams.",
    diagramConfig: {
      type: "anatomy_diagram",
      diagrams: [
        { name: "Contrast Reaction Algorithm", description: "Flowchart showing mild, moderate, and severe reaction recognition and management steps" },
        { name: "Osmolality Comparison", description: "Bar chart comparing HOCM, LOCM, and IOCM osmolality values relative to blood" }
      ]
    },
    quizItems: [
      { topic: "Contrast Media", category: "Patient Care" },
      { topic: "Contrast Reactions", category: "Patient Care & Education" },
      { topic: "Pharmacology", category: "Patient Care" }
    ],
    difficulty: 2,
    sortOrder: 5
  },
  {
    title: "X-ray Production and Tube Components",
    slug: "xray-production-tube-components",
    content: `<h2>Overview</h2><p>Understanding X-ray production is fundamental to radiologic technology. X-rays are produced when high-speed electrons from the cathode strike the anode target, converting kinetic energy into X-ray photons and heat. Knowledge of tube components, X-ray production mechanisms, and factors affecting the X-ray beam is essential for both ARRT and CAMRT certification.</p>

<h2>Relevant Anatomy</h2><p>While not directly anatomical, the X-ray tube has an internal "anatomy" that parallels anatomical concepts:</p><ul><li><strong>Cathode:</strong> The "source" — contains the tungsten filament within a focusing cup. Thermionic emission releases electrons when heated.</li><li><strong>Anode:</strong> The "target" — tungsten disk on a molybdenum stem. Rotating anode dissipates heat across a larger area.</li><li><strong>Glass/metal envelope:</strong> Creates vacuum for electron acceleration</li><li><strong>Oil bath:</strong> Surrounds tube for cooling and electrical insulation</li></ul>

<h2>Imaging Technique</h2><p><strong>X-ray production mechanisms:</strong></p><ul><li><strong>Bremsstrahlung (braking radiation):</strong> 80-90% of the X-ray beam. Electrons decelerate near tungsten nuclei, producing photons of varying energies (continuous spectrum).</li><li><strong>Characteristic radiation:</strong> 10-20% of beam. Incident electron ejects inner-shell electron from tungsten. Outer-shell electron fills vacancy, emitting photon of specific energy. Requires kVp > 69.5 keV (tungsten K-shell binding energy).</li></ul><p><strong>Key relationships:</strong></p><ul><li>mAs controls beam QUANTITY (number of photons)</li><li>kVp controls beam QUALITY (energy/penetration)</li><li>Only ~1% of electron kinetic energy becomes X-rays; 99% becomes heat</li></ul>

<h2>Patient Positioning</h2><p>Understanding the anode heel effect is critical for positioning. The cathode side of the tube has greater beam intensity and should be positioned over the thickest body part. For example, in a chest X-ray with a longitudinal tube orientation, the cathode should be over the lower chest/abdomen.</p>

<h2>Radiation Safety</h2><p>Filtration removes low-energy photons that would only add patient dose without contributing to the image. Minimum total filtration: 2.5 mm Al equivalent for tubes operating above 70 kVp. Added filtration (typically aluminum) is placed between tube and patient. Inherent filtration comes from glass envelope and oil.</p>

<h2>Image Interpretation Basics</h2><p>Understanding X-ray production helps interpret image quality issues. Insufficient kVp results in underpenetrated, high-contrast images. Excessive mAs causes overexposure (dose creep in digital). Beam filtration affects the overall beam quality and patient dose.</p>

<h2>Common Pathology Findings</h2><p>Not directly applicable, but equipment malfunction can mimic pathology or cause artifacts. Anode pitting causes decreased output. Tube arcing creates artifacts. Understanding normal tube function helps distinguish equipment-related issues from patient pathology.</p>

<h2>Clinical Pearls</h2><ul><li>Line-focus principle: angling the anode face creates a smaller effective focal spot than the actual focal spot, improving resolution</li><li>Anode heel effect is more pronounced at short SID, large field size, and steep anode angle</li><li>Rotating anode RPM: 3,300 (standard) or 10,000 (high-speed) for heat dissipation</li><li>Tungsten is used because of its high atomic number (74) and high melting point (3,410°C)</li></ul>`,
    category: "Equipment Operation",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Thermionic emission", "Bremsstrahlung radiation", "Characteristic radiation", "Cathode and anode function", "Line-focus principle", "Anode heel effect", "99% heat 1% X-rays"],
    formulas: [
      { name: "Heat Units (single phase)", formula: "HU = kVp × mA × time", description: "Heat produced per exposure for single-phase generators" },
      { name: "Heat Units (3-phase/HF)", formula: "HU = kVp × mA × time × 1.35 or 1.41", description: "Generator correction factor: 1.35 for 6-pulse, 1.41 for 12-pulse/HF" },
      { name: "Maximum photon energy", formula: "E_max (keV) = kVp", description: "Maximum photon energy in keV equals the applied kVp" }
    ],
    examTraps: [
      "Only ~1% of electron energy becomes X-rays; 99% becomes HEAT",
      "Characteristic radiation only occurs above K-shell binding energy (69.5 keV for tungsten)",
      "The filament is the source of ELECTRONS, not X-rays",
      "Cathode side goes over the THICKEST body part (greater intensity)",
      "Minimum total filtration: 2.5 mm Al equivalent above 70 kVp"
    ],
    memoryAid: "BREM = Braking Radiation Energy Multiple (continuous spectrum). CHAR = Certain High-energy Atomic Radiation (discrete energies). 'Cathode = Thickest' for anode heel effect positioning.",
    clinicalRelevance: "Understanding X-ray production is the foundation for all exposure technique selection. Knowing how kVp and mAs affect the beam allows technologists to optimize image quality while minimizing patient dose.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "X-ray Tube Cross-Section", description: "Labeled diagram showing cathode (filament, focusing cup), anode (target, rotor), glass envelope, and housing" },
        { name: "Bremsstrahlung vs Characteristic", description: "Energy spectrum showing continuous bremsstrahlung spectrum with characteristic peaks" },
        { name: "Anode Heel Effect", description: "Diagram showing varying beam intensity from cathode to anode side" }
      ]
    },
    quizItems: [
      { topic: "X-ray Production", category: "Equipment Operation" },
      { topic: "X-ray Tube", category: "Equipment Operation & QC" },
      { topic: "Beam Quality", category: "Image Production" }
    ],
    difficulty: 2,
    sortOrder: 6
  },
  {
    title: "Radiographic Image Quality: Density, Contrast, and Detail",
    slug: "radiographic-image-quality",
    content: `<h2>Overview</h2><p>Image quality in radiography depends on four primary factors: density (brightness), contrast, recorded detail (spatial resolution), and distortion. Understanding these factors and their controlling variables is essential for producing diagnostic images and is a major focus of certification examinations.</p>

<h2>Relevant Anatomy</h2><p>Image quality factors are affected by patient anatomy:</p><ul><li><strong>Body habitus:</strong> Sthenic (average), hypersthenic (large), hyposthenic (thin), asthenic (very thin) — each requires technique adjustment</li><li><strong>Tissue composition:</strong> Bone (high attenuation), soft tissue (medium), fat (low), air (very low)</li><li><strong>Body part thickness:</strong> Caliper measurement guides technique selection</li></ul>

<h2>Imaging Technique</h2><p><strong>Density/Brightness:</strong> Controlled primarily by mAs. Doubling mAs doubles receptor exposure. In digital imaging, brightness is adjusted post-processing, but mAs still controls noise level.</p><p><strong>Contrast:</strong> Controlled primarily by kVp. Higher kVp = lower contrast (more gray shades). Lower kVp = higher contrast (more black-and-white). Scatter radiation reduces contrast.</p><p><strong>Recorded Detail:</strong> Affected by focal spot size, SID, OID, and motion. Small focal spot, long SID, short OID, and short exposure time optimize detail.</p><p><strong>Distortion:</strong> Size distortion (magnification) from OID. Shape distortion from tube/part/IR angulation.</p>

<h2>Patient Positioning</h2><p>Proper positioning directly affects image quality. Part closest to IR has least magnification and best detail. Align long axis of anatomy with long axis of IR. Minimize OID by placing anatomy as close to IR as possible. Center anatomy to CR to minimize distortion.</p>

<h2>Radiation Safety</h2><p>Understanding image quality factors helps minimize repeats (unnecessary patient dose). Use the minimum mAs needed for adequate SNR. Apply the 15% rule to reduce dose when lower contrast is acceptable. Proper technique selection on the first exposure is the best dose management strategy.</p>

<h2>Image Interpretation Basics</h2><p><strong>Digital imaging considerations:</strong></p><ul><li>mAs primarily affects NOISE in digital (low mAs = quantum mottle/noisy image)</li><li>kVp affects CONTRAST and PENETRATION</li><li>Window/level post-processing can adjust displayed brightness and contrast but cannot fix noise or motion</li><li>Exposure indicators objectively measure receptor exposure</li></ul>

<h2>Common Pathology Findings</h2><p>Certain pathologies require technique modifications:</p><ul><li><strong>Additive conditions (increase technique):</strong> Ascites, pleural effusion, edema, Paget disease</li><li><strong>Destructive conditions (decrease technique):</strong> Osteoporosis, emphysema, pneumothorax</li></ul>

<h2>Clinical Pearls</h2><ul><li>The 30% minimum change rule: mAs must change by at least 30% to see a visible density difference on film</li><li>In digital imaging, focus on noise control (adequate mAs) rather than density control</li><li>Magnification factor = SID/SOD — useful for calculating actual object size</li><li>Grids improve contrast by absorbing scatter but require 2-6x increase in mAs (increased dose)</li></ul>`,
    category: "Image Production",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["mAs controls density/noise", "kVp controls contrast", "Recorded detail factors", "Magnification factor", "Grid use and conversion", "Digital vs film considerations", "Additive vs destructive pathology"],
    formulas: [
      { name: "Magnification Factor", formula: "MF = SID / SOD = SID / (SID - OID)", description: "Calculates the degree of image magnification" },
      { name: "15% Rule", formula: "↑kVp 15% ≈ 2× receptor exposure", description: "Increasing kVp by 15% doubles exposure; halve mAs to maintain density" },
      { name: "mAs Reciprocity", formula: "mAs = mA × time (seconds)", description: "Any mA/time combination yielding same mAs produces same exposure" }
    ],
    examTraps: [
      "mAs controls QUANTITY (density/noise), kVp controls QUALITY (contrast)",
      "In digital imaging, mAs affects NOISE, not brightness (brightness adjustable post-processing)",
      "Motion is the MOST common cause of image unsharpness",
      "Small focal spot improves detail but limits mA output",
      "Grids improve contrast but increase patient dose by 2-6x"
    ],
    memoryAid: "Detail = Small-Long-Short-Fast = Small focal spot, Long SID, Short OID, Fast exposure. mAs = More Atoms Striking (quantity). kVp = kontrast Varies with Penetration.",
    clinicalRelevance: "Image quality assessment is a daily skill for technologists. Understanding controlling factors allows optimal technique selection on the first exposure, reducing repeats and patient dose.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "Image Quality Factor Relationships", description: "Diagram showing how mAs, kVp, SID, OID, focal spot, and grids affect the four image quality factors" },
        { name: "Magnification Geometry", description: "Ray diagram showing SID, SOD, OID, and resulting magnification" }
      ]
    },
    quizItems: [
      { topic: "Image Quality", category: "Image Production" },
      { topic: "Exposure Technique", category: "Image Production" },
      { topic: "Digital Imaging", category: "Image Production" }
    ],
    difficulty: 1,
    sortOrder: 7
  },
  {
    title: "Radiation Biology: Cell Sensitivity and Effects",
    slug: "radiation-biology-cell-sensitivity",
    content: `<h2>Overview</h2><p>Radiation biology studies the effects of ionizing radiation on living tissues. Understanding how radiation interacts with cells, which tissues are most vulnerable, and the types of biological effects helps technologists appreciate the importance of dose optimization and patient protection.</p>

<h2>Relevant Anatomy</h2><p><strong>Radiosensitivity hierarchy (most to least sensitive):</strong></p><ul><li>Lymphocytes (exception: mature but highly sensitive)</li><li>Spermatogonia and erythroblasts</li><li>Intestinal crypt cells</li><li>Endothelial cells</li><li>Osteoblasts</li><li>Fibroblasts</li><li>Muscle cells</li><li>Nerve cells (most resistant)</li></ul>

<h2>Imaging Technique</h2><p>Radiation biology informs technique selection. Understanding that certain tissues are more radiosensitive guides decisions about shielding, collimation, projection selection (PA vs AP), and whether the examination is justified.</p>

<h2>Patient Positioning</h2><p>Position radiosensitive organs away from the primary beam when possible. PA chest reduces breast dose. PA skull reduces lens dose. Proper collimation limits the volume of tissue irradiated. Gonadal shielding when anatomy of interest allows.</p>

<h2>Radiation Safety</h2><p><strong>Law of Bergonié and Tribondeau:</strong> Cells are more radiosensitive when they are: (1) immature/undifferentiated, (2) rapidly dividing, (3) have a long mitotic future.</p><p><strong>Cell cycle radiosensitivity:</strong> Late G2 and M phases are most radiosensitive. Late S phase is most radioresistant.</p><p><strong>DNA is the critical target:</strong> Double-strand breaks are the most significant radiation damage.</p>

<h2>Image Interpretation Basics</h2><p>While radiation biology doesn't directly affect image interpretation, understanding dose effects helps contextualize the risk-benefit analysis of ordering imaging studies. Higher-dose studies (CT, fluoroscopy) carry greater biological risk.</p>

<h2>Common Pathology Findings</h2><p><strong>Radiation effects classification:</strong></p><ul><li><strong>Stochastic effects:</strong> No threshold, probability increases with dose, all-or-nothing (cancer, genetic effects). Governed by LNT model.</li><li><strong>Deterministic (tissue reaction) effects:</strong> Threshold exists, severity increases above threshold. Examples: skin erythema (2 Gy), cataracts (0.5 Gy chronic), epilation (3 Gy), sterility, ARS.</li></ul>

<h2>Clinical Pearls</h2><ul><li>LD 50/30: 3.5-4.5 Gy (dose lethal to 50% of population within 30 days without treatment)</li><li>Most sensitive pregnancy period: organogenesis (weeks 2-8), but CNS sensitivity continues through week 25</li><li>Oxygen Enhancement Ratio (OER): oxygenated cells are 2-3x more radiosensitive than hypoxic cells</li><li>Relative Biological Effectiveness (RBE): alpha particles have highest RBE, X-rays are the reference standard (RBE=1)</li></ul>`,
    category: "Radiation Safety",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Law of Bergonié and Tribondeau", "Radiosensitivity ranking", "Stochastic vs deterministic effects", "LNT model", "DNA as critical target", "Cell cycle sensitivity", "LD 50/30"],
    formulas: [],
    examTraps: [
      "Lymphocytes are the MOST radiosensitive — exception to the law (mature but sensitive)",
      "Cancer is STOCHASTIC (not deterministic)",
      "Cataracts are DETERMINISTIC (threshold exists)",
      "Late G2 and M phases are most radiosensitive; late S phase is most radioresistant",
      "LNT model assumes no safe threshold — any dose carries risk"
    ],
    memoryAid: "Stochastic = Sometimes (probability-based, may or may not happen). Deterministic = Definitely (will happen above threshold, severity increases). Lymphocytes = 'Little Lymph, Lots of sensitivity' — exception to the rule.",
    clinicalRelevance: "Understanding radiation biology reinforces the importance of ALARA and helps technologists make informed decisions about dose optimization, especially for pediatric and pregnant patients.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "Cell Radiosensitivity Hierarchy", description: "Vertical chart showing cell types ranked from most to least radiosensitive" },
        { name: "Dose-Response Curves", description: "Graph comparing stochastic (linear, no threshold) and deterministic (threshold, sigmoid) dose-response relationships" }
      ]
    },
    quizItems: [
      { topic: "Radiation Biology", category: "Radiation Safety" },
      { topic: "Cell Sensitivity", category: "Safety" },
      { topic: "Radiation Effects", category: "Radiation Safety" }
    ],
    difficulty: 2,
    sortOrder: 8
  },
  {
    title: "Digital Radiography: CR and DR Systems",
    slug: "digital-radiography-cr-dr",
    content: `<h2>Overview</h2><p>Digital radiography has largely replaced film-screen systems. The two main types are Computed Radiography (CR) using photostimulable phosphor plates and Digital Radiography (DR) using direct or indirect flat-panel detectors. Understanding these systems, their advantages, limitations, and quality assurance is critical for modern practice.</p>

<h2>Relevant Anatomy</h2><p>Digital systems image all anatomic regions. The key advantage is wide dynamic range, allowing visualization of structures that might be over/underexposed on film. However, this same advantage enables dose creep — unnecessary overexposure that still produces acceptable images.</p>

<h2>Imaging Technique</h2><p><strong>CR (Computed Radiography):</strong></p><ul><li>Photostimulable phosphor (PSP) plate: BaFBr:Eu²⁺ (barium fluorobromide with europium activator)</li><li>Exposure creates latent image (trapped electrons in metastable energy levels)</li><li>Helium-neon laser scans plate, releasing stored energy as photostimulated luminescence (PSL)</li><li>PMT (photomultiplier tube) converts light to electrical signal</li><li>Plate erased with bright white light for reuse</li><li>DQE: 15-30%</li></ul><p><strong>DR Direct:</strong> Amorphous selenium (a-Se) directly converts X-rays to electrical signal (no light step). DQE: 55-75%.</p><p><strong>DR Indirect:</strong> Scintillator (CsI or Gd₂O₂S) converts X-rays to light, then amorphous silicon (a-Si) photodiode array converts light to electrical signal. CsI needle-like crystals minimize light spread for better resolution.</p>

<h2>Patient Positioning</h2><p>Digital systems use the same positioning as film-screen. The key difference is exposure latitude — digital has wider latitude but proper technique is still essential. Correct exam/projection selection is critical for proper LUT application.</p>

<h2>Radiation Safety</h2><p>Digital systems enable dose creep because overexposed images still display with acceptable brightness. Monitor exposure indicators diligently. Target DI = 0 (±1-3 acceptable range). Establish facility exposure indicator benchmarks and track them.</p>

<h2>Image Interpretation Basics</h2><p><strong>Post-processing capabilities:</strong></p><ul><li>Window/Level adjustment (brightness and contrast)</li><li>Edge enhancement (sharpening)</li><li>Look-up tables (LUTs) — preset display parameters per exam type</li><li>Annotation and measurement tools</li></ul><p>Post-processing CANNOT fix: motion blur, quantum noise from underexposure, or anatomic positioning errors.</p>

<h2>Common Pathology Findings</h2><p>Digital systems may reveal subtle findings missed on film due to wider dynamic range. However, quantum mottle (noise) from underexposure can obscure pathology. Proper technique remains essential despite digital correction capabilities.</p>

<h2>Clinical Pearls</h2><ul><li>Wrong exam selection = wrong LUT = poor image display (most common CR/DR error)</li><li>CR plates must be erased within 24-48 hours or residual image builds up</li><li>DR provides immediate image display; CR requires separate readout step</li><li>Signal-to-noise ratio (SNR) is proportional to the square root of mAs</li><li>Nyquist frequency determines the maximum spatial resolution of a digital detector</li></ul>`,
    category: "Image Production",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["PSP plate composition", "Laser readout process", "Direct vs indirect conversion", "DQE comparison", "Exposure indicators", "LUT application", "Dose creep prevention"],
    formulas: [
      { name: "Deviation Index", formula: "DI = 10 × log₁₀(EI_measured / EI_target)", description: "Standardized measure of exposure adequacy" },
      { name: "SNR relationship", formula: "SNR ∝ √mAs", description: "Signal-to-noise ratio is proportional to the square root of mAs" }
    ],
    examTraps: [
      "CR is NOT the same as DR — CR requires a separate reader; DR provides immediate display",
      "CR DQE (15-30%) is significantly lower than DR DQE (55-75%)",
      "CsI has needle-like crystals that minimize light spread = better resolution than GOS",
      "Wrong exam selection = wrong LUT = most common digital imaging error",
      "Post-processing CANNOT fix motion, underexposure noise, or positioning errors"
    ],
    memoryAid: "CR = Cassette Required (plate in cassette). DR = Display Ready (integrated detector). Direct DR = Selenium = Self-converts (no light step). Indirect DR = CsI → Light → a-Si.",
    clinicalRelevance: "Digital imaging is the standard in modern radiology departments. Understanding system differences, proper exposure technique, and quality metrics is essential for daily practice and certification exams.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "CR vs DR Workflow", description: "Side-by-side comparison flowchart of CR (expose-read-erase) vs DR (expose-display) imaging chains" },
        { name: "Direct vs Indirect Conversion", description: "Diagram showing a-Se direct conversion path vs CsI/a-Si indirect conversion path" }
      ]
    },
    quizItems: [
      { topic: "Digital Imaging", category: "Image Production" },
      { topic: "CR and DR Systems", category: "Equipment Operation" },
      { topic: "Exposure Indicators", category: "Image Production" }
    ],
    difficulty: 2,
    sortOrder: 9
  },
  {
    title: "Grids: Construction, Function, and Error Correction",
    slug: "grids-construction-function-errors",
    content: `<h2>Overview</h2><p>Radiographic grids are devices containing alternating lead strips and radiolucent interspaces that absorb scatter radiation before it reaches the image receptor. Grids significantly improve image contrast but require increased technique (higher patient dose). Understanding grid construction, selection, errors, and conversion factors is a heavily tested topic on certification exams.</p>

<h2>Relevant Anatomy</h2><p>Grids are used when imaging body parts thicker than 10 cm or when using kVp above 60-70, where scatter radiation significantly degrades image quality. Common applications: chest, abdomen, pelvis, spine, skull — any large body part.</p>

<h2>Imaging Technique</h2><p><strong>Grid specifications:</strong></p><ul><li><strong>Grid ratio:</strong> Height of lead strips / width of interspace (h/D). Common ratios: 5:1, 6:1, 8:1, 10:1, 12:1, 16:1</li><li><strong>Grid frequency:</strong> Number of lead strips per cm (or per inch). Higher frequency = thinner strips = less visible grid lines</li><li><strong>Grid conversion factors (GCF):</strong> No grid=1, 5:1=2, 6:1=3, 8:1=4, 12:1=5, 16:1=6</li></ul><p><strong>Grid types:</strong> Linear (parallel strips), crossed (two sets perpendicular), focused (strips angled toward convergence line), reciprocating (Bucky — moves during exposure to blur grid lines).</p>

<h2>Patient Positioning</h2><p>When using a focused grid, the tube must be within the grid's focal range and centered to the grid. Off-centering, off-leveling, off-focusing, and using the grid upside-down all cause grid cutoff patterns.</p>

<h2>Radiation Safety</h2><p>Higher grid ratios require more mAs, increasing patient dose. Select the lowest grid ratio that provides adequate scatter cleanup. For pediatric patients, consider no grid or low-ratio grids to minimize dose.</p>

<h2>Image Interpretation Basics</h2><p><strong>Grid cutoff patterns:</strong></p><ul><li><strong>Off-center (lateral decentering):</strong> Uniform density loss across entire image</li><li><strong>Off-level (grid tilt):</strong> Uniform density loss across entire image</li><li><strong>Off-focus (wrong SID):</strong> Density loss at edges (bilateral cutoff)</li><li><strong>Upside-down (focused grid reversed):</strong> Good center exposure, severe cutoff at periphery</li></ul>

<h2>Common Pathology Findings</h2><p>Grid errors can simulate or mask pathology. Grid cutoff causing density loss may obscure subtle findings. Moiré pattern artifacts can occur when stationary grids are used with digital detectors — use reciprocating grid or grid suppression software.</p>

<h2>Clinical Pearls</h2><ul><li>Grid conversion formula: mAs₂ = mAs₁ × (GCF₂/GCF₁) when changing grid ratios</li><li>Air gap technique can substitute for a grid by increasing OID (15-20 cm gap)</li><li>Grid cutoff cannot be corrected by post-processing — requires repeat exposure</li><li>For DR systems, software grid suppression algorithms can eliminate grid lines if an unexpected grid is used</li></ul>`,
    category: "Image Production",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Grid ratio", "Grid frequency", "Grid conversion factors", "Focused vs parallel grids", "Grid cutoff patterns", "Bucky mechanism", "Air gap technique"],
    formulas: [
      { name: "Grid Ratio", formula: "GR = h/D", description: "Grid ratio equals height of lead strips divided by width of interspace" },
      { name: "Grid Conversion", formula: "mAs₂ = mAs₁ × (GCF₂/GCF₁)", description: "Converting between grid techniques using grid conversion factors" }
    ],
    examTraps: [
      "Grid conversion factors: no grid=1, 5:1=2, 6:1=3, 8:1=4, 12:1=5, 16:1=6",
      "Off-center AND off-level both cause UNIFORM density loss (commonly confused)",
      "Off-focus causes BILATERAL edge cutoff; upside-down causes center OK with severe edge cutoff",
      "Higher grid ratio = better scatter cleanup but MORE patient dose",
      "Grid cutoff ALWAYS requires repeat — cannot be fixed by post-processing"
    ],
    memoryAid: "Grid errors CLFU: Center (off-center=uniform loss), Level (off-level=uniform loss), Focus (off-focus=edge cutoff), Upside-down (center OK, edges gone). GCF: 'No-5-6-8-12-16 = 1-2-3-4-5-6'.",
    clinicalRelevance: "Grid selection and proper use directly impacts image quality and patient dose. Recognizing grid errors prevents unnecessary repeats and dose.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "Grid Construction Cross-Section", description: "Diagram showing lead strips, interspaces, and focused grid convergence geometry" },
        { name: "Grid Cutoff Patterns", description: "Four images showing density loss patterns for each type of grid error" }
      ]
    },
    quizItems: [
      { topic: "Grids", category: "Image Production" },
      { topic: "Scatter Control", category: "Image Production" },
      { topic: "Grid Errors", category: "Equipment Operation" }
    ],
    difficulty: 2,
    sortOrder: 10
  },
  {
    title: "Patient Care: Vital Signs and Emergency Assessment",
    slug: "patient-care-vital-signs",
    content: `<h2>Overview</h2><p>Radiologic technologists must be competent in assessing vital signs, recognizing abnormal findings, and responding to emergencies. Patient assessment before, during, and after imaging procedures is a fundamental patient care responsibility and is tested extensively on certification exams.</p>

<h2>Relevant Anatomy</h2><ul><li><strong>Cardiovascular:</strong> Brachial artery (BP measurement), radial artery (pulse), carotid artery (emergency pulse check)</li><li><strong>Respiratory:</strong> Trachea, bronchi, lungs (assess rate, depth, rhythm, breath sounds)</li><li><strong>Neurological:</strong> Level of consciousness, pupil response, motor function (Glasgow Coma Scale)</li></ul>

<h2>Imaging Technique</h2><p>Vital sign assessment doesn't require imaging equipment but guides imaging decisions. Abnormal vitals may indicate need to postpone non-urgent imaging, obtain portable studies, or notify the physician before proceeding.</p>

<h2>Patient Positioning</h2><ul><li><strong>Fowler position:</strong> Semi-upright (45-60°), improves breathing for dyspneic patients</li><li><strong>Trendelenburg:</strong> Head lower than feet, used for hypotension/shock</li><li><strong>Recovery position:</strong> Left lateral decubitus with head tilted, for unconscious breathing patients</li><li><strong>Supine with legs elevated:</strong> Alternative for shock when Trendelenburg is not available</li></ul>

<h2>Radiation Safety</h2><p>Patient in distress may require modified or abbreviated imaging protocols. Prioritize patient stability over image quality. Know when to stop an examination for patient safety.</p>

<h2>Image Interpretation Basics</h2><p>Technologists should correlate visible clinical findings with imaging. For example, dyspnea may correspond to pleural effusion on chest X-ray. Altered mental status may prompt a stat head CT.</p>

<h2>Common Pathology Findings</h2><p><strong>Emergency conditions requiring immediate action:</strong></p><ul><li><strong>Cardiac arrest:</strong> No pulse, no breathing — begin CPR, activate code team</li><li><strong>Anaphylaxis:</strong> Severe allergic reaction — epinephrine IM, airway management</li><li><strong>Seizure:</strong> Protect patient from injury, do not restrain, note time and duration</li><li><strong>Syncope (fainting):</strong> Lower head, elevate legs, monitor vitals</li><li><strong>Diabetic emergencies:</strong> Hypoglycemia (give glucose), hyperglycemia (seek medical help)</li></ul>

<h2>Clinical Pearls</h2><ul><li>Normal adult vital signs: HR 60-100, BP ~120/80, RR 12-20, Temp 97.8-99.1°F, SpO₂ 95-100%</li><li>Orthostatic hypotension: systolic BP drops >20 mmHg or diastolic >10 mmHg upon standing</li><li>Use appropriate BP cuff size — too small cuff = falsely HIGH reading</li><li>Glasgow Coma Scale: Eye (1-4) + Verbal (1-5) + Motor (1-6) = 3-15; ≤8 = severe</li></ul>`,
    category: "Patient Care",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Normal vital sign ranges", "Abnormal findings", "Emergency response", "Shock positions", "Glasgow Coma Scale", "Orthostatic hypotension", "BP cuff sizing"],
    formulas: [
      { name: "Glasgow Coma Scale", formula: "GCS = Eye (1-4) + Verbal (1-5) + Motor (1-6)", description: "Score ranges from 3 (deep coma) to 15 (fully alert)" }
    ],
    examTraps: [
      "Too SMALL BP cuff = falsely HIGH reading (not low)",
      "Orthostatic hypotension: systolic drops >20 or diastolic drops >10 upon standing",
      "Epinephrine is FIRST-LINE for anaphylaxis (not diphenhydramine)",
      "For seizures: do NOT restrain, do NOT put anything in the mouth",
      "Recovery position: LEFT lateral (not right)"
    ],
    memoryAid: "Vital signs: '60-100-120/80-12-20-98.6-95' = HR-BP-RR-Temp-SpO₂. GCS: 'Eyes-Verbal-Motor = 4-5-6' (maximum values). Shock: 'Trendy = Trendelenburg' (head down, feet up).",
    clinicalRelevance: "Patient assessment is a core competency. Technologists are often the first to notice clinical deterioration and must know when and how to respond to emergencies.",
    diagramConfig: {
      type: "anatomy_diagram",
      diagrams: [
        { name: "Vital Signs Reference Chart", description: "Quick-reference table of normal vital sign ranges for adults and pediatric patients" },
        { name: "Emergency Positions", description: "Illustrations of Fowler, Trendelenburg, recovery, and shock positions" }
      ]
    },
    quizItems: [
      { topic: "Vital Signs", category: "Patient Care" },
      { topic: "Emergency Response", category: "Patient Care & Education" },
      { topic: "Patient Assessment", category: "Patient Care" }
    ],
    difficulty: 1,
    sortOrder: 11
  },
  {
    title: "Infection Control and Standard Precautions in Imaging",
    slug: "infection-control-standard-precautions",
    content: `<h2>Overview</h2><p>Infection control is essential in medical imaging departments. Technologists encounter patients with known and unknown infectious diseases. Standard precautions apply to ALL patients regardless of diagnosis. Understanding the chain of infection, transmission-based precautions, and proper PPE use is critical for patient and staff safety.</p>

<h2>Relevant Anatomy</h2><p><strong>Routes of transmission relevant to imaging:</strong></p><ul><li><strong>Respiratory:</strong> Airborne (TB, measles, varicella) and droplet (influenza, COVID-19, pertussis) pathogens</li><li><strong>GI:</strong> Fecal-oral transmission (C. difficile, norovirus) — relevant during barium studies</li><li><strong>Blood/body fluid:</strong> Bloodborne pathogens (HIV, Hepatitis B/C) — needle sticks, blood exposure</li><li><strong>Skin:</strong> Contact transmission (MRSA, VRE, scabies)</li></ul>

<h2>Imaging Technique</h2><p>Infection control doesn't change imaging technique but affects workflow: equipment cleaning between patients, barrier protection on IR and table, proper handling of contaminated cassettes/detectors. Mobile radiography in isolation rooms requires careful PPE use and equipment decontamination.</p>

<h2>Patient Positioning</h2><p>When working with infectious patients, plan positioning carefully to minimize time in the room. Pre-set technique before entering. Use barrier protection on all surfaces the patient contacts. In isolation rooms, limit equipment brought in.</p>

<h2>Radiation Safety</h2><p>PPE (lead apron) is worn under isolation gowns for fluoroscopy or portable radiography in isolation rooms. Ensure proper layering to maintain both radiation and infection protection.</p>

<h2>Image Interpretation Basics</h2><p>Certain pathology patterns correlate with infectious diseases: TB (upper lobe cavitary lesions, miliary pattern), pneumonia (lobar consolidation), COVID-19 (bilateral ground-glass opacities on CT).</p>

<h2>Common Pathology Findings</h2><ul><li><strong>TB:</strong> Upper lobe infiltrates, cavitation, calcified granulomas (Ghon complex)</li><li><strong>COVID-19:</strong> Bilateral ground-glass opacities, crazy-paving pattern on CT</li><li><strong>Pneumonia:</strong> Airspace consolidation with air bronchograms</li></ul>

<h2>Clinical Pearls</h2><ul><li>Hand hygiene is THE most effective infection prevention method — before and after every patient</li><li>PPE donning order: gown → mask → eye protection → gloves (G-M-E-G)</li><li>PPE doffing order: gloves → gown → eye protection → mask (G-G-E-M) with hand hygiene between each step</li><li>C. difficile requires BLEACH — alcohol-based sanitizers do NOT kill spores</li><li>TB requires N95 respirator (not surgical mask) and negative-pressure room</li><li>Chain of infection: Agent → Reservoir → Portal of Exit → Mode of Transmission → Portal of Entry → Susceptible Host</li></ul>`,
    category: "Patient Care",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Chain of infection", "Standard precautions", "Contact/Droplet/Airborne precautions", "Hand hygiene", "PPE donning and doffing", "N95 vs surgical mask", "Equipment decontamination"],
    formulas: [],
    examTraps: [
      "Standard precautions apply to ALL patients (not just known infections)",
      "N95 for AIRBORNE (TB, measles, varicella); surgical mask for DROPLET (flu, COVID)",
      "C. diff requires BLEACH — alcohol-based sanitizers don't kill spores",
      "PPE ON: G-M-E-G (gown-mask-eyes-gloves). PPE OFF: G-G-E-M (gloves-gown-eyes-mask)",
      "Hand hygiene between EACH step of PPE removal"
    ],
    memoryAid: "Chain of infection: 'A Rat Exits, Transmits, Enters, Sickens' (Agent-Reservoir-Exit-Transmission-Entry-Susceptible). PPE ON: G-M-E-G. PPE OFF: G-G-E-M. 'TB = Top Barrier (N95)'. 'C. diff = Chlorine (bleach)'.",
    clinicalRelevance: "Infection control is a patient safety priority and professional responsibility. Technologists must maintain strict standard precautions and know when additional precautions are required.",
    diagramConfig: {
      type: "anatomy_diagram",
      diagrams: [
        { name: "Chain of Infection", description: "Circular diagram showing six links of the chain of infection with examples" },
        { name: "PPE Donning and Doffing Sequence", description: "Step-by-step visual guide for proper PPE put-on and removal order" }
      ]
    },
    quizItems: [
      { topic: "Infection Control", category: "Patient Care" },
      { topic: "Standard Precautions", category: "Patient Care & Education" },
      { topic: "PPE", category: "Patient Care" }
    ],
    difficulty: 1,
    sortOrder: 12
  },
  {
    title: "MRI Physics Fundamentals",
    slug: "mri-physics-fundamentals",
    content: `<h2>Overview</h2><p>Magnetic Resonance Imaging (MRI) uses strong magnetic fields and radiofrequency (RF) pulses to produce detailed images of soft tissue structures. Unlike CT and radiography, MRI does not use ionizing radiation. Understanding basic MRI physics including precession, resonance, relaxation, and pulse sequences is important for ARRT MRI certification and CAMRT examinations.</p>

<h2>Relevant Anatomy</h2><p>MRI excels at soft tissue imaging:</p><ul><li><strong>Brain:</strong> Excellent gray-white matter differentiation, detects stroke, tumors, MS plaques</li><li><strong>Spine:</strong> Disc herniation, spinal cord pathology, nerve root compression</li><li><strong>Musculoskeletal:</strong> Ligament/tendon tears, cartilage damage, bone marrow pathology</li><li><strong>Abdomen:</strong> Liver lesion characterization, pancreatic/biliary imaging (MRCP)</li></ul>

<h2>Imaging Technique</h2><p><strong>Basic MRI physics:</strong></p><ul><li><strong>Precession:</strong> Hydrogen protons spin and wobble (precess) in the magnetic field at the Larmor frequency</li><li><strong>Larmor equation:</strong> ω = γ × B₀ (frequency = gyromagnetic ratio × field strength)</li><li><strong>Resonance:</strong> RF pulse at Larmor frequency tips protons into transverse plane</li><li><strong>T1 relaxation (spin-lattice):</strong> Recovery of longitudinal magnetization. Short T1 = bright on T1W (fat)</li><li><strong>T2 relaxation (spin-spin):</strong> Decay of transverse magnetization. Long T2 = bright on T2W (fluid/water)</li></ul><p><strong>Common pulse sequences:</strong></p><ul><li><strong>Spin echo (SE):</strong> 90° + 180° refocusing pulse. Short TR/short TE = T1W. Long TR/long TE = T2W.</li><li><strong>Gradient echo (GRE):</strong> Faster, uses flip angle <90°. Susceptible to magnetic field inhomogeneity artifacts.</li><li><strong>Inversion recovery:</strong> STIR (fat suppression), FLAIR (fluid suppression)</li></ul>

<h2>Patient Positioning</h2><p>Patient centered in magnet bore for optimal field homogeneity. Use appropriate surface coils for body region. Screen for MRI contraindications before entry to scanner room.</p>

<h2>Radiation Safety</h2><p>MRI does not use ionizing radiation but has other safety concerns:</p><ul><li><strong>Projectile risk:</strong> Ferromagnetic objects become dangerous projectiles in the magnetic field</li><li><strong>Implant heating:</strong> RF energy can heat metallic implants, causing burns</li><li><strong>Acoustic noise:</strong> Gradient coils produce loud noise (up to 130 dB) — hearing protection required</li><li><strong>Peripheral nerve stimulation:</strong> Rapid gradient switching can stimulate peripheral nerves</li><li><strong>Quench:</strong> Emergency release of cryogenic helium — risk of asphyxiation and frostbite</li></ul>

<h2>Image Interpretation Basics</h2><p><strong>Signal characteristics:</strong></p><ul><li>T1W: Fat = bright, Fluid = dark, Muscle = intermediate</li><li>T2W: Fluid = bright, Fat = intermediate-bright, Muscle = dark</li><li>STIR: Fat = dark (suppressed), Fluid/edema = bright</li><li>FLAIR: CSF = dark (suppressed), pathology = bright</li></ul>

<h2>Common Pathology Findings</h2><ul><li><strong>Brain tumor:</strong> T2/FLAIR hyperintense, enhances with gadolinium on T1W</li><li><strong>Acute stroke (DWI):</strong> Restricted diffusion = bright on DWI, dark on ADC map</li><li><strong>ACL tear:</strong> Disrupted low-signal band on sagittal images</li><li><strong>Disc herniation:</strong> Disc material extending beyond vertebral body margins</li></ul>

<h2>Clinical Pearls</h2><ul><li>Zone system: Zone I (general public), Zone II (patients/escort waiting), Zone III (restricted MRI area), Zone IV (scanner room — strictest screening)</li><li>Gadolinium contrast is generally safer than iodinated contrast but carries risk of nephrogenic systemic fibrosis (NSF) in patients with severe renal impairment (eGFR <30)</li><li>Absolute contraindications: cardiac pacemakers (non-MR conditional), ferromagnetic aneurysm clips, metallic foreign bodies in the eye</li></ul>`,
    category: "MRI Physics",
    modality: "MRI",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Precession and Larmor frequency", "T1 and T2 relaxation", "Spin echo pulse sequences", "TR and TE parameters", "STIR and FLAIR", "MRI safety zones", "Gadolinium and NSF risk"],
    formulas: [
      { name: "Larmor Equation", formula: "ω = γ × B₀", description: "Precessional frequency equals gyromagnetic ratio times magnetic field strength" },
      { name: "T1W Parameters", formula: "Short TR, Short TE", description: "T1-weighted images use short TR and short TE" },
      { name: "T2W Parameters", formula: "Long TR, Long TE", description: "T2-weighted images use long TR and long TE" }
    ],
    examTraps: [
      "T1W: fat is BRIGHT, fluid is DARK. T2W: fluid is BRIGHT",
      "STIR suppresses FAT signal. FLAIR suppresses FLUID (CSF) signal",
      "Short TR/short TE = T1W. Long TR/long TE = T2W. Long TR/short TE = proton density",
      "MRI does NOT use ionizing radiation but has projectile, heating, and acoustic risks",
      "Gadolinium + severe renal failure = risk of nephrogenic systemic fibrosis (NSF)"
    ],
    memoryAid: "T1 = 'one tissue bright = fat (Anatomy scan)'. T2 = 'two things bright = fluid AND pathology (Pathology scan)'. STIR = 'Short Tau Inversion Recovery = Stops fat'. FLAIR = 'Fluid Attenuated = Fluid Absent'.",
    clinicalRelevance: "MRI is the gold standard for soft tissue imaging. Understanding basic physics and safety ensures quality imaging and patient protection in the MRI environment.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "T1 vs T2 Relaxation Curves", description: "Graphs showing T1 recovery and T2 decay curves for different tissues" },
        { name: "MRI Safety Zones", description: "Floor plan diagram showing Zone I through Zone IV with access restrictions" },
        { name: "Signal Intensity Chart", description: "Table comparing signal intensity of fat, fluid, muscle on T1W, T2W, STIR, and FLAIR" }
      ]
    },
    quizItems: [
      { topic: "MRI Physics", category: "MRI Physics" },
      { topic: "MRI Safety", category: "MRI Physics" },
      { topic: "Pulse Sequences", category: "MRI Physics" }
    ],
    difficulty: 3,
    sortOrder: 13
  },
  {
    title: "Ultrasound Physics Basics",
    slug: "ultrasound-physics-basics",
    content: `<h2>Overview</h2><p>Diagnostic ultrasound uses high-frequency sound waves (typically 2-18 MHz) to produce real-time images of internal structures. It is safe (no ionizing radiation), portable, and relatively inexpensive. Understanding basic ultrasound physics including wave properties, transducer types, and image formation is essential for sonography certification.</p>

<h2>Relevant Anatomy</h2><p>Ultrasound imaging is used across many body systems:</p><ul><li><strong>Abdomen:</strong> Liver, gallbladder, kidneys, pancreas, spleen</li><li><strong>Obstetric:</strong> Fetal anatomy, placenta, amniotic fluid</li><li><strong>Vascular:</strong> Carotid arteries, deep venous thrombosis (DVT), arterial stenosis</li><li><strong>Musculoskeletal:</strong> Tendons, muscles, joints (dynamic imaging)</li><li><strong>Cardiac:</strong> Echocardiography (chamber size, valve function, ejection fraction)</li></ul>

<h2>Imaging Technique</h2><p><strong>Sound wave properties:</strong></p><ul><li><strong>Frequency:</strong> Higher frequency = better resolution but less penetration. Lower frequency = more penetration but less resolution.</li><li><strong>Wavelength:</strong> λ = c/f (wavelength = propagation speed / frequency)</li><li><strong>Propagation speed in soft tissue:</strong> 1,540 m/s (assumed by all scanners)</li><li><strong>Acoustic impedance:</strong> Z = ρ × c (density × propagation speed). Reflections occur at impedance mismatches.</li></ul><p><strong>Transducer types:</strong></p><ul><li><strong>Linear array:</strong> High frequency (7-15 MHz), superficial structures, rectangular image</li><li><strong>Curvilinear/convex:</strong> Lower frequency (3-5 MHz), abdominal imaging, wider field of view</li><li><strong>Phased array:</strong> Small footprint (cardiac), sector-shaped image</li></ul>

<h2>Patient Positioning</h2><p>Varies by examination. Gel coupling is required between transducer and skin to eliminate air interface. Patient fasting for 8 hours for gallbladder/upper abdomen. Full bladder for pelvic/early obstetric ultrasound.</p>

<h2>Radiation Safety</h2><p>Ultrasound does not use ionizing radiation. However, bioeffects (thermal and mechanical) are possible at high intensities. ALARA applies: use lowest output power for diagnostic result. Monitor thermal index (TI) and mechanical index (MI). TI <1.0 and MI <0.7 are generally safe.</p>

<h2>Image Interpretation Basics</h2><p><strong>Echogenicity:</strong></p><ul><li><strong>Hyperechoic:</strong> Bright (highly reflective) — bone, calculi, gas</li><li><strong>Isoechoic:</strong> Similar to surrounding tissue</li><li><strong>Hypoechoic:</strong> Darker than surrounding tissue — many solid tumors</li><li><strong>Anechoic:</strong> Black (no echoes) — simple fluid (cysts, blood vessels, urine)</li></ul><p><strong>Artifacts:</strong> Posterior acoustic shadowing (behind calculi/bone), posterior acoustic enhancement (behind fluid collections), reverberation, mirror artifact.</p>

<h2>Common Pathology Findings</h2><ul><li><strong>Gallstones:</strong> Hyperechoic foci with posterior acoustic shadowing, mobile</li><li><strong>Simple cyst:</strong> Anechoic, well-defined walls, posterior acoustic enhancement</li><li><strong>DVT:</strong> Non-compressible vein, absence of color flow, intraluminal echoes</li><li><strong>Ectopic pregnancy:</strong> Empty uterus with adnexal mass, free fluid in cul-de-sac</li></ul>

<h2>Clinical Pearls</h2><ul><li>Doppler ultrasound: measures blood flow velocity and direction. Color Doppler shows flow direction (red toward, blue away by convention)</li><li>Harmonic imaging improves image quality by receiving signals at twice the transmitted frequency</li><li>Elastography measures tissue stiffness — useful for liver fibrosis and breast lesion characterization</li></ul>`,
    category: "Ultrasound Physics",
    modality: "Ultrasound",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Sound wave properties", "Acoustic impedance", "Transducer types", "Echogenicity classification", "Doppler principles", "Ultrasound artifacts", "Bioeffects and safety indices"],
    formulas: [
      { name: "Wavelength", formula: "λ = c / f", description: "Wavelength equals propagation speed divided by frequency" },
      { name: "Acoustic Impedance", formula: "Z = ρ × c", description: "Acoustic impedance equals tissue density times propagation speed" },
      { name: "Soft tissue speed", formula: "c = 1,540 m/s", description: "Assumed propagation speed in soft tissue for all ultrasound calculations" }
    ],
    examTraps: [
      "Higher frequency = BETTER resolution but LESS penetration",
      "Propagation speed in soft tissue is ASSUMED to be 1,540 m/s",
      "Posterior acoustic shadowing = behind SOLID structures (stones, bone)",
      "Posterior acoustic enhancement = behind FLUID collections (cysts)",
      "Doppler: red toward, blue away (BART: Blue Away, Red Toward)"
    ],
    memoryAid: "Frequency vs penetration: 'High F = High resolution, Low depth' (inverse relationship). BART for Doppler: Blue Away, Red Toward. Propagation speed: '1540' = always in soft tissue.",
    clinicalRelevance: "Ultrasound is a safe, real-time imaging modality used across virtually every clinical specialty. Understanding physics principles enables technologists to optimize image quality and recognize artifacts.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "Transducer Types Comparison", description: "Diagram showing linear, curvilinear, and phased array transducer shapes with their beam patterns" },
        { name: "Ultrasound Artifacts Gallery", description: "Image examples of posterior shadowing, enhancement, reverberation, and mirror artifacts" }
      ]
    },
    quizItems: [
      { topic: "Ultrasound Physics", category: "Ultrasound Physics" },
      { topic: "Doppler", category: "Ultrasound Physics" },
      { topic: "Sonography", category: "Ultrasound Physics" }
    ],
    difficulty: 3,
    sortOrder: 14
  },
  {
    title: "Automatic Exposure Control (AEC) Systems",
    slug: "automatic-exposure-control",
    content: `<h2>Overview</h2><p>Automatic Exposure Control (AEC) systems use radiation detectors (ionization chambers) to automatically terminate the X-ray exposure when a predetermined amount of radiation has been detected. Proper AEC use ensures consistent image quality regardless of patient size variations. Understanding AEC operation, chamber selection, and troubleshooting is critical for certification exams.</p>

<h2>Relevant Anatomy</h2><p>AEC chamber selection depends on the anatomy of interest:</p><ul><li>PA Chest: both lateral (outside) chambers — over lung fields</li><li>AP Abdomen: center chamber — over spine and abdominal organs</li><li>AP Lumbar spine: center chamber</li><li>AP Pelvis: center chamber</li><li>Lateral skull: center chamber</li></ul>

<h2>Imaging Technique</h2><p><strong>AEC components:</strong></p><ul><li>Three ionization chambers positioned behind the patient (before the IR)</li><li>Chambers detect transmitted radiation and terminate exposure at preset level</li><li>Technologist selects: kVp, chamber(s), density control, backup time</li></ul><p><strong>The technologist does NOT set mAs when using AEC</strong> — the system determines the appropriate mAs based on patient thickness and tissue density.</p>

<h2>Patient Positioning</h2><p>Anatomy of interest MUST completely cover the selected chamber(s). If anatomy does not cover the chamber, the AEC reads unattenuated radiation and terminates too early (underexposure). Proper centering is critical for AEC accuracy.</p>

<h2>Radiation Safety</h2><p>Backup time must be set at 150-200% of expected mAs as a safety cutoff. This prevents excessive exposure if AEC malfunctions. AEC automatically compensates for patient size — no manual technique adjustment needed for different patient thicknesses.</p>

<h2>Image Interpretation Basics</h2><p>AEC produces consistent receptor exposure across patients of different sizes. If images are consistently over or underexposed with AEC, check: wrong chamber selected, anatomy not covering chamber, wrong kVp, or AEC calibration needed.</p>

<h2>Common Pathology Findings</h2><p>Pathology can affect AEC performance. Additive pathology (effusion, ascites) causes AEC to increase exposure. Destructive pathology (emphysema, osteoporosis) causes AEC to decrease exposure. Large casts or prostheses over the chamber cause overexposure of surrounding tissue.</p>

<h2>Clinical Pearls</h2><ul><li>Each density control step changes exposure by approximately 25-30%</li><li>For PA chest: NEVER use center chamber (spine causes overexposure of lungs)</li><li>Minimum response time: time needed for minimum measurable exposure — limits AEC accuracy for very small patients</li><li>AEC does NOT compensate for kVp errors — technologist must select appropriate kVp</li></ul>`,
    category: "Equipment Operation",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Ionization chamber operation", "Chamber selection by anatomy", "Backup timer function", "Density controls", "Common AEC errors", "kVp selection with AEC", "Minimum response time"],
    formulas: [],
    examTraps: [
      "PA chest: NEVER use center chamber — spine causes overexposure of lung fields",
      "AEC terminates exposure automatically — technologist does NOT set mAs",
      "AEC does NOT compensate for incorrect kVp — kVp must be selected by technologist",
      "Backup time must be set as safety cutoff (150-200% of expected mAs)",
      "If anatomy does not cover chamber = premature termination = UNDEREXPOSURE"
    ],
    memoryAid: "PA chest AEC: 'Lungs = Laterals' (use outside chambers for lung fields). AEC provides: 'Auto mAs, YOU choose kVp'. Density controls: '+1 = 25-30% more, -1 = 25-30% less'.",
    clinicalRelevance: "AEC is used in most radiographic examinations. Correct chamber selection and understanding AEC behavior with different patient types prevents repeat exposures and unnecessary dose.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "AEC Chamber Layout", description: "Diagram showing three ionization chamber positions relative to patient and IR for PA chest and AP abdomen" },
        { name: "AEC Troubleshooting Flowchart", description: "Decision tree for diagnosing AEC-related exposure errors" }
      ]
    },
    quizItems: [
      { topic: "AEC", category: "Equipment Operation" },
      { topic: "Automatic Exposure", category: "Image Production" },
      { topic: "Exposure Control", category: "Equipment Operation & QC" }
    ],
    difficulty: 2,
    sortOrder: 15
  },
  {
    title: "Fluoroscopy Principles and Dose Management",
    slug: "fluoroscopy-principles-dose",
    content: `<h2>Overview</h2><p>Fluoroscopy provides real-time dynamic imaging using continuous or pulsed X-ray beams. It is essential for GI studies, interventional procedures, orthopedic surgery, and cardiac catheterization. Because fluoroscopy can deliver high patient doses, understanding dose management is critical for both ARRT and CAMRT certification.</p>

<h2>Relevant Anatomy</h2><p>Fluoroscopy is used to image dynamic anatomic processes: swallowing (barium swallow), GI motility (upper GI/barium enema), joint movement (arthrography), cardiac function (cardiac cath), and real-time guidance for interventional procedures.</p>

<h2>Imaging Technique</h2><p><strong>Image intensifier (II) components:</strong></p><ul><li>Input phosphor (CsI): converts X-rays to light</li><li>Photocathode: converts light to electrons</li><li>Electrostatic lenses: focus and accelerate electrons</li><li>Output phosphor: converts electrons back to visible light image</li></ul><p><strong>Flat-panel detectors</strong> are replacing IIs in modern systems with better image quality, wider dynamic range, and no geometric distortion.</p><p><strong>Magnification mode:</strong> Uses smaller area of input phosphor, ABC increases technique to maintain brightness = INCREASED patient dose but improved resolution.</p>

<h2>Patient Positioning</h2><p>Varies by study. GI studies use RAO for esophagus/stomach, various rotations for barium enema. The image receptor should be as close to the patient as possible to reduce dose and improve image quality.</p>

<h2>Radiation Safety</h2><p><strong>Maximum entrance exposure rates:</strong></p><ul><li>Standard fluoroscopy: 88 mGy/min (10 R/min)</li><li>High-level fluoroscopy: 176 mGy/min (20 R/min)</li></ul><p><strong>Dose reduction strategies:</strong></p><ul><li>Pulsed fluoroscopy (reduce pulse rate: 15, 7.5, 3.75 fps)</li><li>Last-image hold (review without continued fluoroscopy)</li><li>Tight collimation</li><li>Image receptor close to patient</li><li>Minimize magnification mode use</li><li>5-minute audible timer</li></ul><p><strong>Operator positioning:</strong> Stand on the image receptor side (away from tube). Tube under table = scatter goes UP toward operator's upper body.</p>

<h2>Image Interpretation Basics</h2><p>Fluoroscopic images have lower spatial resolution than radiographs but provide dynamic information. Brightness gain (minification gain × flux gain) amplifies the image. Contrast and brightness are automatically adjusted by ABC (automatic brightness control).</p>

<h2>Common Pathology Findings</h2><ul><li><strong>Esophageal stricture:</strong> Narrowing of esophageal lumen on barium swallow</li><li><strong>Hiatal hernia:</strong> Stomach herniation through diaphragmatic hiatus</li><li><strong>Bowel obstruction:</strong> Dilated loops, air-fluid levels, transition point on follow-through</li></ul>

<h2>Clinical Pearls</h2><ul><li>Minimum SSD: 15 inches (38 cm) fixed, 12 inches (30 cm) mobile C-arm</li><li>C-arm: tube should be UNDER the table (scatter goes down, not up at operator)</li><li>For lateral C-arm position: tube should be on opposite side from operator</li><li>Scatter is maximum at 1 meter on the tube side and 90° to the beam</li></ul>`,
    category: "Equipment Operation",
    modality: "Fluoroscopy",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Image intensifier components", "Flat-panel fluoroscopy", "Maximum exposure rates", "Pulsed fluoroscopy", "Magnification mode dose increase", "ABC", "Operator positioning"],
    formulas: [
      { name: "Brightness Gain", formula: "BG = Minification Gain × Flux Gain", description: "Total brightness gain of image intensifier" },
      { name: "Minification Gain", formula: "MG = (Input diameter / Output diameter)²", description: "Gain from concentrating image to smaller output phosphor" }
    ],
    examTraps: [
      "Magnification mode INCREASES patient dose (ABC increases technique)",
      "Standard fluoro limit: 88 mGy/min (10 R/min), NOT higher",
      "Minimum SSD: 15 inches fixed, 12 inches mobile C-arm",
      "Fluoro tube is UNDER the table — scatter goes UP toward operator",
      "Operator stands on IMAGE RECEPTOR side (away from tube)"
    ],
    memoryAid: "Fluoro limits: '10-15-5' = 10 R/min max, 15 inches min SSD, 5-minute timer. 'Tube Under Table' = scatter goes UP. 'Stand on RECEPTOR side' = away from tube = less dose.",
    clinicalRelevance: "Fluoroscopy delivers the highest patient doses in diagnostic imaging. Technologists must actively manage dose through proper technique selection, collimation, and time management.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "Image Intensifier Cross-Section", description: "Labeled diagram showing input phosphor, photocathode, electrostatic lenses, and output phosphor" },
        { name: "Operator Positioning Diagram", description: "Top-down view showing optimal operator position relative to tube and image receptor during fluoroscopy" }
      ]
    },
    quizItems: [
      { topic: "Fluoroscopy", category: "Equipment Operation" },
      { topic: "Fluoroscopic Dose", category: "Radiation Safety" },
      { topic: "GI Studies", category: "Procedures" }
    ],
    difficulty: 2,
    sortOrder: 16
  },
  {
    title: "Shoulder and Upper Extremity Positioning",
    slug: "shoulder-upper-extremity-positioning",
    content: `<h2>Overview</h2><p>Upper extremity imaging encompasses hand, wrist, forearm, elbow, humerus, and shoulder projections. These are among the most commonly performed radiographic examinations, particularly in emergency departments and orthopedic clinics. Proper positioning ensures diagnostic-quality images and accurate fracture diagnosis.</p>

<h2>Relevant Anatomy</h2><ul><li><strong>Shoulder:</strong> Glenohumeral joint, greater and lesser tuberosities, acromion, coracoid process, acromioclavicular (AC) joint</li><li><strong>Humerus:</strong> Head, anatomical/surgical neck, shaft, epicondyles</li><li><strong>Elbow:</strong> Olecranon, coronoid process, radial head, fat pads</li><li><strong>Forearm:</strong> Radius (lateral) and ulna (medial), proximal and distal radioulnar joints</li></ul>

<h2>Imaging Technique</h2><p>Upper extremity uses tabletop technique (no grid), small focal spot. Typical factors vary by body part: hand/wrist (50-60 kVp), elbow/forearm (60-70 kVp), humerus/shoulder (70-80 kVp). SID 40 inches standard. Collimate to include relevant anatomy and adjacent joints.</p>

<h2>Patient Positioning</h2><ul><li><strong>Shoulder AP (external rotation):</strong> Palm forward, greater tuberosity in profile laterally</li><li><strong>Shoulder AP (internal rotation):</strong> Back of hand against thigh, lesser tuberosity in profile medially</li><li><strong>Shoulder Y-view (scapular lateral):</strong> Patient obliqued 45-60°, body of scapula perpendicular to IR. Humeral head should project over glenoid fossa (if dislocated, it moves anterior or posterior).</li><li><strong>AP elbow:</strong> Full extension, hand supinated, CR perpendicular to elbow joint</li><li><strong>Lateral elbow:</strong> 90° flexion, thumb up, epicondyles superimposed</li><li><strong>AP forearm:</strong> Full extension, hand supinated, must include BOTH joints</li></ul>

<h2>Radiation Safety</h2><p>Extremity exams deliver low doses but ALARA principles still apply. Proper collimation, appropriate technique, and immobilization to prevent repeats. Lead apron for the patient when practical.</p>

<h2>Image Interpretation Basics</h2><p><strong>Key evaluation criteria:</strong></p><ul><li>Shoulder external rotation: greater tuberosity in profile</li><li>Shoulder internal rotation: lesser tuberosity in profile, humerus in true lateral</li><li>Lateral elbow: epicondyles superimposed, fat pads visible (sail sign = effusion = occult fracture)</li><li>Forearm: must visualize both proximal (elbow) and distal (wrist) joints</li></ul>

<h2>Common Pathology Findings</h2><ul><li><strong>Shoulder dislocation:</strong> Anterior (most common) — Y-view shows head anterior to glenoid</li><li><strong>Rotator cuff tear:</strong> Narrowed subacromial space, superior migration of humeral head</li><li><strong>Lateral elbow fat pad sign:</strong> Elevated posterior fat pad (sail sign) = occult fracture</li><li><strong>Monteggia fracture:</strong> Proximal ulna fracture + radial head dislocation</li><li><strong>Galeazzi fracture:</strong> Distal radius fracture + DRUJ dislocation</li></ul>

<h2>Clinical Pearls</h2><ul><li>If elbow cannot fully extend: take two separate AP projections (one for distal humerus, one for proximal forearm) with CR perpendicular to each</li><li>Y-view is best for anterior/posterior shoulder dislocation assessment</li><li>External rotation = greater tuberosity (like waving goodbye), Internal rotation = lesser tuberosity</li><li>Always include both joints for forearm imaging</li></ul>`,
    category: "Radiographic Positioning",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Shoulder rotations", "Y-view for dislocation", "Elbow fat pad signs", "Forearm joint inclusion", "Monteggia vs Galeazzi", "Scapular lateral positioning"],
    formulas: [],
    examTraps: [
      "External rotation = greater tuberosity in profile (palm forward)",
      "Internal rotation = lesser tuberosity in profile (back of hand to thigh)",
      "Fat pad sign (sail sign) on lateral elbow = occult fracture",
      "If elbow won't extend: TWO separate AP projections",
      "Both joints MUST be included on forearm radiographs",
      "Monteggia = proximal ulna + radial head dislocation; Galeazzi = distal radius + DRUJ dislocation"
    ],
    memoryAid: "Shoulder rotations: 'External = Exit wave (palm forward) = Greater tuberosity'. Fracture-dislocations: 'MUGR: Monteggia=Ulna/Galeazzi=Radius' (which bone is fractured). Elbow obliques: 'External = Radial head, Internal = Coronoid'.",
    clinicalRelevance: "Upper extremity injuries are among the most common reasons for imaging. Proper positioning is essential for accurate diagnosis and treatment planning.",
    diagramConfig: {
      type: "positioning_diagram",
      diagrams: [
        { name: "Shoulder Rotation Positions", description: "Side-by-side comparison of external and internal rotation shoulder positioning with tuberosity visualization" },
        { name: "Y-View Positioning", description: "Diagram showing patient obliquity and scapular alignment for scapular lateral projection" }
      ]
    },
    quizItems: [
      { topic: "Shoulder Positioning", category: "Radiographic Positioning" },
      { topic: "Upper Extremity", category: "Procedures" },
      { topic: "Elbow Positioning", category: "Radiographic Positioning" }
    ],
    difficulty: 1,
    sortOrder: 17
  },
  {
    title: "Lower Extremity Positioning: Ankle, Knee, and Hip",
    slug: "lower-extremity-positioning",
    content: `<h2>Overview</h2><p>Lower extremity radiography is essential for evaluating fractures, arthritis, and joint abnormalities. Key examinations include ankle (AP, mortise, lateral), knee (AP, lateral, tunnel), and hip/pelvis (AP pelvis, frog-leg lateral, cross-table lateral). Understanding special views and their clinical indications is heavily tested on certification exams.</p>

<h2>Relevant Anatomy</h2><ul><li><strong>Ankle:</strong> Tibial plafond, medial malleolus (tibia), lateral malleolus (fibula), talus, ankle mortise joint</li><li><strong>Knee:</strong> Femoral condyles, tibial plateau, intercondylar fossa, patella, patellar surface</li><li><strong>Hip:</strong> Femoral head, neck, greater/lesser trochanters, acetabulum, obturator foramen</li><li><strong>Pelvis:</strong> Iliac wings, sacroiliac joints, symphysis pubis, ischial tuberosities</li></ul>

<h2>Imaging Technique</h2><p>Ankle/foot: 60-65 kVp tabletop. Knee: 65-75 kVp, may use grid for large patients. Hip/pelvis: 75-85 kVp with grid (Bucky). All extremity exams: 40-inch SID standard.</p>

<h2>Patient Positioning</h2><ul><li><strong>AP ankle:</strong> Foot dorsiflexed 90°, no rotation, CR to midpoint between malleoli</li><li><strong>Ankle mortise:</strong> 15-20° internal rotation of ENTIRE leg (eliminates tibiofibular overlap at ankle joint)</li><li><strong>Lateral ankle:</strong> Medial surface down, CR to medial malleolus</li><li><strong>AP knee:</strong> 5-7° cephalad angle to open tibial plateau. For patients >24 cm AP thickness, increase to 10°</li><li><strong>Lateral knee:</strong> 20-30° flexion, 5-7° cephalad, femoral condyles superimposed</li><li><strong>Tunnel view (Camp-Coventry):</strong> PA, knee flexed 40-50°, CR perpendicular to tibia. Shows intercondylar fossa.</li><li><strong>AP pelvis:</strong> Legs internally rotated 15-20° (places femoral necks parallel to IR). Do NOT rotate if fracture suspected.</li><li><strong>Frog-leg lateral:</strong> Hip flexed, knee flexed, thigh abducted 40-45°. CONTRAINDICATED if fracture suspected.</li><li><strong>Cross-table lateral hip:</strong> Horizontal beam, unaffected leg elevated. Used for SUSPECTED FRACTURE — does not move injured leg.</li></ul>

<h2>Radiation Safety</h2><p>Gonadal shielding for pelvic/hip radiography when possible without obscuring anatomy of interest. Male gonadal shield placement is straightforward; female ovarian shielding may obscure pelvic anatomy. Lead apron for patient comfort and dose reduction.</p>

<h2>Image Interpretation Basics</h2><p>Mortise view: clear visualization of ankle joint space without tibiofibular overlap. AP knee: open tibial plateau joint space. AP pelvis: symmetric iliac wings and obturator foramina (indicates no rotation). Femoral necks elongated (proper internal rotation).</p>

<h2>Common Pathology Findings</h2><ul><li><strong>Weber classification (ankle fractures):</strong> A (below syndesmosis), B (at level), C (above — most unstable)</li><li><strong>Ottawa ankle rules:</strong> Clinical decision tool to determine if X-ray is needed</li><li><strong>Tibial plateau fracture:</strong> Depression of tibial articular surface, lipohemarthrosis on lateral (fat-fluid level)</li><li><strong>Hip fracture:</strong> Femoral neck or intertrochanteric; Garden classification for neck fractures</li></ul>

<h2>Clinical Pearls</h2><ul><li>Weight-bearing AP knees are essential for osteoarthritis evaluation — shows true joint space narrowing</li><li>Mortise view rotates the ENTIRE leg 15-20° internally (not just the foot)</li><li>Cross-table lateral hip = trauma. Frog-leg lateral = non-trauma only.</li><li>AP pelvis: internal rotation for femoral neck visualization, but NEVER in trauma</li></ul>`,
    category: "Radiographic Positioning",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Ankle mortise rotation", "Knee CR angle", "Tunnel view", "AP pelvis internal rotation", "Frog-leg vs cross-table lateral", "Weight-bearing technique"],
    formulas: [],
    examTraps: [
      "Mortise view: 15-20° internal rotation of ENTIRE LEG (not just foot)",
      "AP knee: 5-7° CEPHALAD angle to open tibial plateau",
      "Frog-leg lateral = NEVER for suspected hip fracture",
      "Cross-table lateral = ALWAYS for suspected hip fracture",
      "AP pelvis: 15-20° internal rotation for femoral necks — but NOT in trauma"
    ],
    memoryAid: "Frog-leg = Fun times (no fracture). Cross-table = Careful (fracture suspected). Mortise = '15-20 IN' (internal rotation of whole leg). AP knee = '5-7 UP' (cephalad). Tunnel = intercondylar FOSSA.",
    clinicalRelevance: "Lower extremity injuries are extremely common. Correct projection selection and positioning, especially distinguishing trauma vs non-trauma hip views, is critical for accurate diagnosis.",
    diagramConfig: {
      type: "positioning_diagram",
      diagrams: [
        { name: "Ankle Mortise Rotation", description: "Diagram showing 15-20° internal rotation of the entire leg for mortise view" },
        { name: "Hip Projections Comparison", description: "Side-by-side positioning diagrams for frog-leg lateral vs cross-table lateral hip" }
      ]
    },
    quizItems: [
      { topic: "Lower Extremity", category: "Radiographic Positioning" },
      { topic: "Ankle Positioning", category: "Procedures" },
      { topic: "Hip Radiography", category: "Procedures" }
    ],
    difficulty: 1,
    sortOrder: 18
  },
  {
    title: "Spine Radiography: Cervical, Thoracic, and Lumbar",
    slug: "spine-radiography-positioning",
    content: `<h2>Overview</h2><p>Spine radiography is performed for trauma evaluation, degenerative disease assessment, pre/post-surgical evaluation, and scoliosis screening. Proper positioning, tube angles, and evaluation criteria vary significantly by spinal region. Understanding the scotty dog concept for lumbar obliques is a certification exam favorite.</p>

<h2>Relevant Anatomy</h2><ul><li><strong>Cervical spine:</strong> 7 vertebrae, C1 (atlas), C2 (axis/dens), C3-C7 with uncovertebral joints, intervertebral foramina exit obliquely</li><li><strong>Thoracic spine:</strong> 12 vertebrae, costovertebral joints, kyphotic curve</li><li><strong>Lumbar spine:</strong> 5 vertebrae, largest vertebral bodies, zygapophyseal joints oriented medially, scotty dog on oblique view</li><li><strong>Scotty dog anatomy:</strong> Eye = pedicle, Nose = transverse process, Ear = superior articular process, Front leg = inferior articular process, Neck = pars interarticularis</li></ul>

<h2>Imaging Technique</h2><p>C-spine: 75-80 kVp. T-spine: 80-85 kVp (breathing technique for lateral). L-spine: 80-90 kVp with grid. Lateral C-spine uses 72-inch SID to reduce magnification. Breathing technique for lateral T-spine uses low mA and long exposure time to blur overlying rib and lung structures.</p>

<h2>Patient Positioning</h2><ul><li><strong>AP cervical:</strong> 15-20° cephalad angle to C4</li><li><strong>Lateral cervical:</strong> 72-inch SID, shoulders depressed, MUST show C1 through C7-T1</li><li><strong>Open mouth (AP C1-C2):</strong> Mouth open, CR through mouth to C1-C2. Dens visible between lateral masses of atlas.</li><li><strong>AP thoracic:</strong> CR to T7 (inferior angle of scapula)</li><li><strong>Lateral thoracic:</strong> Breathing technique — low mA, 3-4 second exposure time</li><li><strong>AP lumbar:</strong> Knees flexed (flatten lordosis), CR perpendicular to L3 (iliac crest level)</li><li><strong>Lateral lumbar:</strong> Waist supported, L5-S1 spot with 5-8° caudad angle</li><li><strong>Oblique lumbar:</strong> 45° rotation for scotty dog/zygapophyseal joints. LPO = right (downside) joints; RPO = left (downside) joints.</li></ul>

<h2>Radiation Safety</h2><p>Spine imaging, especially lumbar, delivers significant dose. Proper technique selection, tight collimation, and gonadal shielding (when possible) are essential. For scoliosis series in adolescent females, PA projection reduces breast dose by ~96% compared to AP.</p>

<h2>Image Interpretation Basics</h2><p>Evaluate vertebral body alignment, disc space height, pedicle integrity, and presence of fractures. On lateral C-spine, assess anterior vertebral line, posterior vertebral line, spinolaminar line, and spinous process tips for alignment. Look for prevertebral soft tissue swelling indicating injury.</p>

<h2>Common Pathology Findings</h2><ul><li><strong>Spondylolysis:</strong> Pars interarticularis defect (collar on scotty dog neck)</li><li><strong>Spondylolisthesis:</strong> Forward slippage of vertebral body, graded I-IV</li><li><strong>Compression fracture:</strong> Loss of vertebral body height, common in osteoporosis</li><li><strong>Jefferson fracture:</strong> Burst fracture of C1 (atlas) — lateral mass offset on open mouth view</li></ul>

<h2>Clinical Pearls</h2><ul><li>Swimmer's lateral needed if C7-T1 not visible on standard lateral C-spine</li><li>Sacrum: 15° cephalad angle. Coccyx: 10° caudad angle (opposite angles!)</li><li>LPO shows downside (RIGHT) zygapophyseal joints</li><li>Open mouth view: look for lateral mass symmetry of C1 on C2</li></ul>`,
    category: "Radiographic Positioning",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Cervical spine projections", "Breathing technique", "Scotty dog anatomy", "Spondylolysis identification", "Open mouth view", "L5-S1 spot lateral", "Scoliosis PA technique"],
    formulas: [],
    examTraps: [
      "Lateral C-spine MUST show ALL 7 cervical vertebrae (C1 through C7-T1)",
      "Scotty dog NECK = pars interarticularis; collar = spondylolysis",
      "LPO shows the DOWNSIDE joints (right zygapophyseal joints)",
      "Sacrum: 15° CEPHALAD. Coccyx: 10° CAUDAD (opposite directions!)",
      "Breathing technique: low mA + LONG exposure time (3-4 seconds)",
      "PA for scoliosis in females reduces breast dose by ~96%"
    ],
    memoryAid: "Scotty dog parts: 'Eye=Pedicle, Nose=TP, Ear=SAP, Leg=IAP, Neck=Pars'. LPO → Right joints (downside). Sacrum-Coccyx angles: 'S=Superior (cephalad), C=Caudal (caudad)'.",
    clinicalRelevance: "Spine imaging is performed daily in most radiology departments. The scotty dog concept and spondylolysis identification are heavily tested on both ARRT and CAMRT exams.",
    diagramConfig: {
      type: "positioning_diagram",
      diagrams: [
        { name: "Scotty Dog Anatomy", description: "Labeled oblique lumbar radiograph with scotty dog parts identified" },
        { name: "Spine Positioning Summary", description: "Quick-reference diagrams for cervical, thoracic, and lumbar spine projections with CR angles" }
      ]
    },
    quizItems: [
      { topic: "Spine Positioning", category: "Radiographic Positioning" },
      { topic: "Cervical Spine", category: "Procedures" },
      { topic: "Lumbar Spine", category: "Procedures" }
    ],
    difficulty: 2,
    sortOrder: 19
  },
  {
    title: "Equipment Quality Control Testing",
    slug: "equipment-quality-control",
    content: `<h2>Overview</h2><p>Quality control (QC) in radiography ensures equipment is functioning within acceptable parameters, producing consistent diagnostic-quality images while maintaining patient safety. Regular QC testing is required by accreditation bodies and regulations. Understanding QC tests, tolerances, and frequencies is essential for certification exams.</p>

<h2>Relevant Anatomy</h2><p>QC testing uses phantoms and test tools rather than patients. Understanding the purpose of each test relates to how equipment performance affects image quality of anatomic structures.</p>

<h2>Imaging Technique</h2><p><strong>Generator QC tests and tolerances:</strong></p><ul><li><strong>kVp accuracy:</strong> ±5% of set value</li><li><strong>Exposure reproducibility:</strong> Coefficient of variation (CV) ≤ 0.05 (5%)</li><li><strong>mA linearity:</strong> mR/mAs consistent within ±10%</li><li><strong>Timer accuracy:</strong> ±5% of set value</li><li><strong>Collimator alignment:</strong> ±2% of SID</li><li><strong>CR perpendicularity:</strong> ±1 degree</li></ul><p><strong>Additional tests:</strong></p><ul><li><strong>HVL measurement:</strong> Verifies adequate beam filtration. Minimum HVL for 80 kVp ≈ 2.3 mm Al</li><li><strong>Focal spot size:</strong> Measured with star pattern or slit camera</li><li><strong>Screen-film contact:</strong> Wire mesh test (for any remaining film systems)</li></ul>

<h2>Patient Positioning</h2><p>QC does not involve patient positioning but directly affects image quality of all patient studies. Properly calibrated equipment ensures accurate positioning produces diagnostic results.</p>

<h2>Radiation Safety</h2><p>QC testing identifies equipment malfunctions that could cause excessive patient dose. Lead apron inspection (fluoroscopic or radiographic) should be performed annually. Damaged aprons compromise radiation protection.</p>

<h2>Image Interpretation Basics</h2><p><strong>Digital system QC:</strong></p><ul><li>SMPTE or TG18 test pattern: evaluate monitor brightness, contrast, resolution</li><li>Phantom testing: evaluate spatial resolution, contrast resolution, noise, uniformity</li><li>Exposure indicator accuracy: verify EI values correspond to actual exposure</li><li>Artifact evaluation: check for dead pixels, detector uniformity</li></ul>

<h2>Common Pathology Findings</h2><p>QC failures can mimic or mask pathology. Non-uniform detector response creates density variations. Dead pixels or calibration errors create artifacts. kVp or mAs inaccuracy affects image contrast and density, potentially obscuring pathology.</p>

<h2>Clinical Pearls</h2><ul><li>QC testing frequency: daily (monitor checks), weekly (processor/reject analysis), monthly (phantom), annually (comprehensive physicist survey)</li><li>Repeat analysis target: <5% department-wide repeat rate</li><li>Lead apron inspection: perform annually; retire aprons with cracks or tears</li><li>Document ALL QC results and corrective actions</li></ul>`,
    category: "Equipment Operation",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["kVp accuracy ±5%", "Reproducibility ≤0.05 CV", "mA linearity ±10%", "Collimator ±2% SID", "HVL testing", "Monitor QC", "Lead apron inspection", "Repeat analysis"],
    formulas: [
      { name: "Coefficient of Variation", formula: "CV = standard deviation / mean", description: "Used to assess exposure reproducibility; must be ≤0.05 (5%)" }
    ],
    examTraps: [
      "kVp accuracy is ±5% (not ±10%)",
      "Collimator alignment tolerance is ±2% of SID",
      "mA linearity tolerance is ±10%",
      "Lead apron inspection is performed ANNUALLY",
      "AEC backup timer is a SAFETY device — must be set"
    ],
    memoryAid: "QC tolerances: '5-5-10-2' = kVp(5%), reproducibility(5%), linearity(10%), collimator(2% SID). Testing frequency: 'Daily-Weekly-Monthly-Annually' = monitors-reject analysis-phantom-physicist survey.",
    clinicalRelevance: "QC is a regulatory requirement and ensures patient safety. Technologists perform many QC tests daily and must document results and take corrective action for failures.",
    diagramConfig: {
      type: "physics_visual",
      diagrams: [
        { name: "QC Testing Schedule", description: "Calendar-style chart showing daily, weekly, monthly, and annual QC tests" },
        { name: "SMPTE Test Pattern", description: "Image of SMPTE pattern with labeled evaluation criteria for monitor QC" }
      ]
    },
    quizItems: [
      { topic: "Quality Control", category: "Equipment Operation" },
      { topic: "QC Testing", category: "Equipment Operation & QC" },
      { topic: "Equipment Maintenance", category: "Equipment Operation" }
    ],
    difficulty: 2,
    sortOrder: 20
  },
  {
    title: "Abdomen and GI Tract Radiography",
    slug: "abdomen-gi-tract-radiography",
    content: `<h2>Overview</h2><p>Abdominal radiography (KUB/flat plate) and the acute abdomen series are fundamental radiographic examinations. Combined with fluoroscopic GI contrast studies (upper GI series, barium enema), abdominal imaging covers a wide range of clinical indications from bowel obstruction to perforation to cancer screening.</p>

<h2>Relevant Anatomy</h2><ul><li><strong>Solid organs:</strong> Liver (RUQ), spleen (LUQ), kidneys (retroperitoneal), pancreas (retroperitoneal)</li><li><strong>Hollow organs:</strong> Stomach, small bowel (jejunum, ileum), large bowel (cecum, ascending, transverse, descending, sigmoid colon, rectum)</li><li><strong>Landmarks:</strong> Iliac crest = L4, ASIS, symphysis pubis, xiphoid process</li><li><strong>Peritoneum:</strong> Lines the abdominal cavity; free air here indicates perforation</li></ul>

<h2>Imaging Technique</h2><p><strong>KUB (AP supine abdomen):</strong> CR perpendicular to iliac crest level, must include symphysis pubis to diaphragm. Grid required. 75-85 kVp.</p><p><strong>Upright abdomen:</strong> Same technique, patient standing 5-10 minutes before exposure. Must include DIAPHRAGM (top of film) for free air detection.</p><p><strong>Left lateral decubitus:</strong> Left side DOWN, horizontal beam. Must include right side of abdomen. Free air rises to right side (between liver and abdominal wall).</p>

<h2>Patient Positioning</h2><ul><li>KUB: supine, arms at sides, midsagittal plane centered</li><li>Upright: patient standing at least 5-10 minutes for air-fluid levels to develop</li><li>Left lateral decubitus: left side DOWN on radiolucent pad, 5-10 minutes before exposure for air to rise</li><li>Acute abdomen series: supine KUB + upright abdomen + erect PA chest (or left lateral decubitus if patient cannot stand)</li></ul>

<h2>Radiation Safety</h2><p>Abdominal imaging delivers moderate to high doses. Gonadal shielding when anatomy of interest allows. Proper technique and AEC use to minimize repeats. Collimation to include only required anatomy.</p>

<h2>Image Interpretation Basics</h2><p><strong>Abdominal evaluation:</strong></p><ul><li>Bowel gas pattern: is it normal, ileus (dilated non-obstructed), or obstructed?</li><li>3-6-9 rule: small bowel <3 cm, large bowel <6 cm, cecum <9 cm (normal diameters)</li><li>Calcifications: gallstones, kidney stones, vascular, appendicolith</li><li>Free air: visible under diaphragm on erect, or between liver and abdominal wall on left lateral decubitus</li><li>Psoas shadows: asymmetry may indicate retroperitoneal pathology</li></ul>

<h2>Common Pathology Findings</h2><ul><li><strong>Small bowel obstruction:</strong> Dilated loops (>3 cm), air-fluid levels, transition point</li><li><strong>Large bowel obstruction:</strong> Dilated colon (>6 cm), may show cecal distension</li><li><strong>Pneumoperitoneum:</strong> Free air under diaphragm = perforation until proven otherwise</li><li><strong>Ileus:</strong> Generalized bowel dilation without transition point</li></ul>

<h2>Clinical Pearls</h2><ul><li>Left lateral decubitus for free air detection when patient cannot stand</li><li>Allow 5-10 minutes for air to rise before exposure on decubitus/upright views</li><li>Barium CONTRAINDICATED if perforation suspected — use water-soluble contrast</li><li>RAO for upper GI: best demonstrates esophagus and pylorus</li><li>Sims position for barium enema tip insertion (left lateral with right knee flexed)</li></ul>`,
    category: "Radiographic Positioning",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["KUB positioning", "Acute abdomen series", "Left lateral decubitus technique", "Free air detection", "3-6-9 rule", "Barium contraindications", "Upper GI positioning"],
    formulas: [],
    examTraps: [
      "Left lateral decubitus: left side DOWN, free air rises to RIGHT",
      "Upright abdomen must include DIAPHRAGM (top priority)",
      "Allow 5-10 minutes for air to redistribute before decubitus/upright exposure",
      "3-6-9 rule: small bowel <3 cm, large bowel <6 cm, cecum <9 cm",
      "Barium is CONTRAINDICATED if perforation suspected (use water-soluble Gastrografin)"
    ],
    memoryAid: "Decubitus: 'Left side DOWN, free air goes RIGHT (UP)'. Acute abdomen series: 'Supine-Upright-Chest' (or decubitus instead of upright). 3-6-9 = small-large-cecum diameters.",
    clinicalRelevance: "Abdominal imaging is frequently ordered in emergency departments. Technologists must understand the acute abdomen series and free air detection protocols.",
    diagramConfig: {
      type: "positioning_diagram",
      diagrams: [
        { name: "Acute Abdomen Series", description: "Three-panel diagram showing supine KUB, upright abdomen, and left lateral decubitus positioning" },
        { name: "Free Air Detection", description: "Radiographic examples showing free air on erect and decubitus views" }
      ]
    },
    quizItems: [
      { topic: "Abdominal Radiography", category: "Radiographic Positioning" },
      { topic: "GI Studies", category: "Procedures" },
      { topic: "Acute Abdomen", category: "Procedures" }
    ],
    difficulty: 2,
    sortOrder: 21
  },
  {
    title: "Personnel Dosimetry and Monitoring",
    slug: "personnel-dosimetry-monitoring",
    content: `<h2>Overview</h2><p>Personnel dosimetry tracks occupational radiation exposure to ensure compliance with dose limits and verify ALARA effectiveness. Understanding dosimeter types, proper wearing, exchange procedures, and report interpretation is essential for radiation safety compliance and certification exams.</p>

<h2>Relevant Anatomy</h2><p>Dosimeter placement corresponds to radiation-sensitive body regions:</p><ul><li><strong>Collar level (outside apron):</strong> Monitors dose to thyroid and lens of eye — represents maximum body dose</li><li><strong>Waist level (under apron):</strong> Approximates gonadal and fetal dose when shielded</li><li><strong>Two-badge system:</strong> Used for fluoroscopy workers — collar (outside apron) + waist (under apron)</li></ul>

<h2>Imaging Technique</h2><p>Dosimetry is not an imaging technique but monitors cumulative exposure from all imaging activities. Higher-dose modalities (fluoroscopy, CT) contribute more to occupational dose.</p>

<h2>Patient Positioning</h2><p>Not directly applicable. Proper patient positioning reduces the need for repeat exposures, which in turn reduces occupational dose from scattered radiation.</p>

<h2>Radiation Safety</h2><p><strong>Dosimeter types:</strong></p><ul><li><strong>OSL (Optically Stimulated Luminescence):</strong> Al₂O₃ (aluminum oxide), laser readout, can be reread multiple times, most common type</li><li><strong>TLD (Thermoluminescent Dosimeter):</strong> LiF (lithium fluoride), heated for readout, single read only</li><li><strong>Film badge:</strong> Film blackening proportional to dose, archival record. Largely replaced by OSL/TLD.</li><li><strong>Pocket ionization chamber:</strong> Provides real-time reading, self-reading, no permanent record. Good for daily monitoring in high-exposure areas.</li></ul><p><strong>Proper use guidelines:</strong></p><ul><li>Wear dosimeter at ALL times when working with radiation</li><li>Never intentionally expose, share, or leave in radiation field</li><li>Store in radiation-free area when not worn (control badge stays here)</li><li>Exchange period: monthly or quarterly depending on facility</li></ul>

<h2>Image Interpretation Basics</h2><p><strong>Dosimetry report interpretation:</strong></p><ul><li>Deep dose (Hp(10)): whole body effective dose</li><li>Shallow dose (Hp(0.07)): skin and extremity dose</li><li>Lens dose (Hp(3)): dose to lens of eye</li><li>Compare to dose limits: occupational whole body 50 mSv/year, CNSC 100 mSv/5 years</li></ul>

<h2>Common Pathology Findings</h2><p>Dosimetry does not detect pathology but high readings may indicate excessive exposure requiring investigation and corrective action.</p>

<h2>Clinical Pearls</h2><ul><li>Investigation level: typically >1 mSv/month or >10% of annual limit in a single period</li><li>Effective dose formula for two-badge system: E = 1.5 × waist + 0.04 × collar (one common method)</li><li>Pregnant worker declaration triggers additional monitoring and fetal dose tracking</li><li>OSL is now the standard — TLD and film badges are becoming obsolete</li></ul>`,
    category: "Radiation Safety",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["OSL dosimeter", "TLD dosimeter", "Proper wearing positions", "Two-badge system", "Exchange periods", "Investigation levels", "Dosimetry reports"],
    formulas: [
      { name: "Effective dose (two-badge)", formula: "E ≈ 1.5 × waist dose + 0.04 × collar dose", description: "One common formula for estimating effective dose from two-badge monitoring" }
    ],
    examTraps: [
      "OSL can be REREAD; TLD is single read only; film cannot be reread",
      "Collar badge goes OUTSIDE the lead apron",
      "Waist badge goes UNDER the lead apron",
      "NEVER share, intentionally expose, or leave dosimeter in radiation field",
      "Investigation level: typically >1 mSv/month"
    ],
    memoryAid: "Dosimeter types: 'OSL = Optical (laser reread), TLD = Thermal (heat once), Film = Film (archive)'. Badge positions: 'Collar = Outside (Over apron), Waist = Under (Under apron)'.",
    clinicalRelevance: "Personnel monitoring is a legal requirement for radiation workers. Understanding dosimetry ensures compliance with regulations and demonstrates commitment to ALARA.",
    diagramConfig: {
      type: "radiation_protection_diagram",
      diagrams: [
        { name: "Dosimeter Wearing Positions", description: "Diagram showing collar and waist badge positions relative to lead apron for single and two-badge systems" },
        { name: "Dosimeter Comparison Chart", description: "Table comparing OSL, TLD, film badge, and pocket ionization chamber characteristics" }
      ]
    },
    quizItems: [
      { topic: "Personnel Dosimetry", category: "Radiation Safety" },
      { topic: "Dosimeters", category: "Safety" },
      { topic: "Radiation Monitoring", category: "Radiation Safety" }
    ],
    difficulty: 2,
    sortOrder: 22
  },
  {
    title: "Pathology Recognition for Radiologic Technologists",
    slug: "pathology-recognition-radiologic-technologists",
    content: `<h2>Overview</h2><p>Radiologic technologists must recognize common pathological conditions to produce optimal images, adjust technique appropriately, and identify findings requiring immediate physician notification. While diagnosis is not within the technologist's scope, recognition of pathology patterns and understanding additive vs destructive conditions is critical for clinical practice.</p>

<h2>Relevant Anatomy</h2><p>Pathology affects all body systems. Technologists should understand normal anatomy to recognize abnormal findings across chest, abdomen, musculoskeletal, and neurological imaging.</p>

<h2>Imaging Technique</h2><p><strong>Technique adjustments for pathology:</strong></p><ul><li><strong>Additive pathology (increase technique):</strong> Ascites, pleural effusion, Paget disease, pneumonia, edema, cardiomegaly</li><li><strong>Destructive pathology (decrease technique):</strong> Osteoporosis, emphysema, pneumothorax, degenerative arthritis, multiple myeloma</li></ul>

<h2>Patient Positioning</h2><p>Pathology may limit patient positioning ability. Fractures prevent rotation. Effusions may require upright or decubitus positioning. Immobilized or post-surgical patients may require modified projections. Always prioritize patient safety over ideal positioning.</p>

<h2>Radiation Safety</h2><p>Understanding pathology helps technologists select appropriate technique on the first exposure, reducing repeats and unnecessary dose. Additive conditions require more radiation; destructive conditions require less.</p>

<h2>Image Interpretation Basics</h2><p><strong>Key pathology patterns by region:</strong></p><p><strong>Chest:</strong></p><ul><li>Airspace disease: consolidation, air bronchograms (pneumonia)</li><li>Interstitial disease: reticular or nodular pattern (fibrosis, metastases)</li><li>Pleural disease: effusion (meniscus), pneumothorax (absent markings)</li></ul><p><strong>Musculoskeletal:</strong></p><ul><li>Fractures: cortical disruption, fracture line, displacement</li><li>Arthritis: joint space narrowing, osteophytes (OA), erosions (RA), periarticular osteopenia</li><li>Tumors: bone destruction (osteolytic) or bone formation (osteoblastic)</li></ul><p><strong>Abdomen:</strong></p><ul><li>Obstruction: dilated bowel, air-fluid levels</li><li>Free air: perforation indicator</li><li>Calcifications: stones, vascular, soft tissue</li></ul>

<h2>Common Pathology Findings</h2><ul><li><strong>Pneumonia:</strong> Airspace consolidation, may be lobar or diffuse</li><li><strong>COPD/Emphysema:</strong> Hyperinflated lungs, flattened diaphragms, increased AP diameter</li><li><strong>Osteoarthritis:</strong> Joint space narrowing, subchondral sclerosis, osteophytes</li><li><strong>Rheumatoid arthritis:</strong> Symmetric joint involvement, erosions, periarticular osteopenia</li><li><strong>Paget disease:</strong> Thickened cortex, coarsened trabeculae, enlarged bones (additive)</li><li><strong>Osteoporosis:</strong> Generalized bone loss, compression fractures, pencil-thin cortices (destructive)</li></ul>

<h2>Clinical Pearls</h2><ul><li>Technologists should notify the radiologist or physician of critical findings: pneumothorax, free air, malpositioned tubes/lines, fracture-dislocations</li><li>Understanding additive vs destructive helps select technique BEFORE exposure</li><li>Clinical history on the requisition guides technique and positioning decisions</li><li>When in doubt about pathology effect on technique, err on the side of adequate penetration</li></ul>`,
    category: "Pathology Recognition",
    modality: "Radiography",
    country: "both",
    examType: "ARRT,CAMRT",
    keyConcepts: ["Additive vs destructive pathology", "Chest pathology patterns", "Musculoskeletal pathology", "Abdominal pathology", "Technique adjustments", "Critical findings notification"],
    formulas: [],
    examTraps: [
      "Additive pathology requires INCREASED technique (more mAs or kVp)",
      "Destructive pathology requires DECREASED technique",
      "Pneumonia = ADDITIVE. Emphysema = DESTRUCTIVE",
      "Paget disease = ADDITIVE (thickened, enlarged bone). Osteoporosis = DESTRUCTIVE (thinned bone)",
      "OA = asymmetric, osteophytes. RA = symmetric, erosions (commonly confused)"
    ],
    memoryAid: "Additive = Add technique (fluid, density). Destructive = Decrease technique (air, bone loss). 'PEA is Additive' = Paget, Effusion, Ascites. 'OEP is Destructive' = Osteoporosis, Emphysema, Pneumothorax.",
    clinicalRelevance: "Recognizing pathology helps technologists adjust technique appropriately and identify critical findings requiring urgent physician notification. This knowledge improves both image quality and patient safety.",
    diagramConfig: {
      type: "anatomy_diagram",
      diagrams: [
        { name: "Additive vs Destructive Pathology Chart", description: "Two-column comparison chart listing common additive and destructive conditions with technique adjustment guidance" },
        { name: "Common Pathology Gallery", description: "Representative radiographic images showing key pathological findings across body regions" }
      ]
    },
    quizItems: [
      { topic: "Pathology Recognition", category: "Pathology Recognition" },
      { topic: "Technique Adjustments", category: "Image Production" },
      { topic: "Critical Findings", category: "Patient Care" }
    ],
    difficulty: 2,
    sortOrder: 23
  }
];

function generateFlashcardsForLesson(lesson: Lesson): Flashcard[] {
  const flashcards: Record<string, Flashcard[]> = {
    "chest-xray-interpretation": [
      { front: "What is the standard SID for a PA chest radiograph?", back: "72 inches (180 cm). This reduces magnification of anterior structures including the heart.", modality: "Radiography", bodyPart: "Chest", category: "Chest X-ray Interpretation", country: "both", examType: "ARRT,CAMRT", topic: "Chest Radiography", difficulty: 1 },
      { front: "What kVp range is used for chest radiography and why?", back: "110-125 kVp (high kVp technique). This reduces contrast to better visualize mediastinal structures through the heart and spine.", modality: "Radiography", bodyPart: "Chest", category: "Chest X-ray Interpretation", country: "both", examType: "ARRT,CAMRT", topic: "Chest Radiography", difficulty: 1 },
      { front: "Which AEC chambers are selected for a PA chest radiograph?", back: "Both LATERAL (outside) chambers. Never use the center chamber — the spine would cause overexposure of the lung fields.", modality: "Radiography", bodyPart: "Chest", category: "Chest X-ray Interpretation", country: "both", examType: "ARRT,CAMRT", topic: "Chest Radiography", difficulty: 2 },
      { front: "How many posterior ribs indicate adequate inspiration on a chest X-ray?", back: "Minimum 10 posterior ribs (or 7-8 anterior ribs). Count posterior ribs as they are easier to identify.", modality: "Radiography", bodyPart: "Chest", category: "Chest X-ray Interpretation", country: "both", examType: "ARRT,CAMRT", topic: "Chest Radiography", difficulty: 1 },
      { front: "What does the silhouette sign indicate on a chest X-ray?", back: "Loss of a normal anatomic border indicates pathology adjacent to that structure. For example, loss of the right heart border suggests right middle lobe disease.", modality: "Radiography", bodyPart: "Chest", category: "Chest X-ray Interpretation", country: "both", examType: "ARRT,CAMRT", topic: "Chest Radiography", difficulty: 2 },
      { front: "What is the normal cardiothoracic ratio (CTR) on a PA chest radiograph?", back: "Less than 50% (cardiac width / thoracic width × 100). CTR >50% suggests cardiomegaly. This measurement is only valid on PA projection, NOT AP.", modality: "Radiography", bodyPart: "Chest", category: "Chest X-ray Interpretation", country: "both", examType: "ARRT,CAMRT", topic: "Chest Radiography", difficulty: 1 },
      { front: "What is RIPE in chest X-ray quality evaluation?", back: "R = Rotation (equal clavicle-spinous process distances), I = Inspiration (10 posterior ribs), P = Penetration (thoracic vertebrae visible through heart), E = Exposure/inclusion (apices to costophrenic angles).", modality: "Radiography", bodyPart: "Chest", category: "Chest X-ray Interpretation", country: "both", examType: "ARRT,CAMRT", topic: "Chest Radiography", difficulty: 2 },
    ],
    "radiographic-positioning-wrist": [
      { front: "Name the 8 carpal bones in order (proximal row lateral to medial, then distal row).", back: "Proximal: Scaphoid, Lunate, Triquetrum, Pisiform. Distal: Trapezium, Trapezoid, Capitate, Hamate. Mnemonic: 'So Long To Pinky, Here Comes The Thumb'.", modality: "Radiography", bodyPart: "Wrist", category: "Wrist Positioning", country: "both", examType: "ARRT,CAMRT", topic: "Carpal Bones", difficulty: 1 },
      { front: "What is the most commonly fractured carpal bone?", back: "Scaphoid (formerly called navicular). It spans both carpal rows and its blood supply enters distally, putting the proximal pole at risk for avascular necrosis (AVN).", modality: "Radiography", bodyPart: "Wrist", category: "Wrist Positioning", country: "both", examType: "ARRT,CAMRT", topic: "Carpal Bones", difficulty: 1 },
      { front: "How do you position for a scaphoid (navicular) view?", back: "PA wrist with ULNAR deviation + 10-15° CR angle toward the elbow. This elongates the scaphoid, reducing foreshortening and improving fracture detection.", modality: "Radiography", bodyPart: "Wrist", category: "Wrist Positioning", country: "both", examType: "ARRT,CAMRT", topic: "Wrist Positioning", difficulty: 2 },
      { front: "What is the difference between a Colles fracture and a Smith fracture?", back: "Colles: distal radius fracture with DORSAL displacement (dinner fork deformity). Smith: distal radius fracture with VOLAR (palmar) displacement (reverse Colles).", modality: "Radiography", bodyPart: "Wrist", category: "Wrist Positioning", country: "both", examType: "ARRT,CAMRT", topic: "Upper Extremity", difficulty: 2 },
      { front: "What are Gilula's arcs and what do they indicate?", back: "Three smooth arcs traced along the carpal bone margins on a PA wrist radiograph. Disruption of any arc indicates carpal instability, ligament injury, or fracture.", modality: "Radiography", bodyPart: "Wrist", category: "Wrist Positioning", country: "both", examType: "ARRT,CAMRT", topic: "Wrist Positioning", difficulty: 3 },
      { front: "How is the lateral wrist correctly positioned?", back: "Ulnar surface down, forearm and wrist in true lateral position. Radius and ulna must be superimposed. CR directed to the radial styloid process.", modality: "Radiography", bodyPart: "Wrist", category: "Wrist Positioning", country: "both", examType: "ARRT,CAMRT", topic: "Wrist Positioning", difficulty: 1 },
    ],
    "ct-imaging-basics": [
      { front: "What are the Hounsfield Unit (HU) values for water, air, and dense bone?", back: "Water = 0 HU, Air = -1000 HU, Dense bone = +1000 HU. Fat ≈ -50 to -100 HU, Muscle ≈ 40-60 HU, Acute blood ≈ 50-70 HU.", modality: "CT", bodyPart: "General", category: "CT Imaging Basics", country: "both", examType: "ARRT,CAMRT", topic: "CT Imaging", difficulty: 1 },
      { front: "What does CT pitch represent?", back: "Pitch = table travel per rotation / total beam collimation. Pitch >1 = faster scan, lower dose, potential gaps. Pitch <1 = overlap, better quality, higher dose.", modality: "CT", bodyPart: "General", category: "CT Imaging Basics", country: "both", examType: "ARRT,CAMRT", topic: "CT Imaging", difficulty: 2 },
      { front: "What is the difference between CTDI and DLP?", back: "CTDI (CT Dose Index) = dose per rotation (mGy). DLP (Dose-Length Product) = CTDIvol × scan length (mGy·cm). DLP better represents TOTAL scan dose.", modality: "CT", bodyPart: "General", category: "CT Imaging Basics", country: "both", examType: "ARRT,CAMRT", topic: "CT Dose", difficulty: 2 },
      { front: "What window settings are used for CT brain imaging?", back: "Brain window: Width 80, Level 40. Subdural window: Width 200, Level 80. Bone window: Width 2000, Level 300.", modality: "CT", bodyPart: "Head", category: "CT Imaging Basics", country: "both", examType: "ARRT,CAMRT", topic: "CT Imaging", difficulty: 2 },
      { front: "Why is non-contrast CT head the first study for acute stroke?", back: "To exclude hemorrhage before thrombolysis (clot-dissolving therapy). Hemorrhagic stroke is a contraindication to thrombolytics. Acute blood appears hyperdense (bright) on non-contrast CT.", modality: "CT", bodyPart: "Head", category: "CT Imaging Basics", country: "both", examType: "ARRT,CAMRT", topic: "CT Imaging", difficulty: 2 },
      { front: "How does window width affect CT image appearance?", back: "Narrow window width = HIGH contrast (fewer gray shades, better for subtle density differences). Wide window width = LOW contrast (more gray shades, better for wide density range like chest).", modality: "CT", bodyPart: "General", category: "CT Imaging Basics", country: "both", examType: "ARRT,CAMRT", topic: "CT Imaging", difficulty: 1 },
      { front: "What is iterative reconstruction and how does it affect dose?", back: "An image reconstruction algorithm that reduces noise compared to filtered back projection (FBP). It allows 30-50% dose reduction while maintaining image quality.", modality: "CT", bodyPart: "General", category: "CT Imaging Basics", country: "both", examType: "ARRT,CAMRT", topic: "CT Imaging", difficulty: 3 },
    ],
    "radiation-dose-reduction": [
      { front: "What are the three cardinal principles of radiation protection?", back: "Time (minimize time near radiation), Distance (maximize distance — inverse square law), Shielding (use appropriate barriers). Distance is the MOST effective method.", modality: "Radiography", bodyPart: "General", category: "Radiation Dose Reduction", country: "both", examType: "ARRT,CAMRT", topic: "Radiation Protection", difficulty: 1 },
      { front: "State the inverse square law and give an example.", back: "I₂ = I₁ × (D₁/D₂)². If you double the distance, intensity drops to 1/4. If you triple the distance, intensity drops to 1/9.", modality: "Radiography", bodyPart: "General", category: "Radiation Dose Reduction", country: "both", examType: "ARRT,CAMRT", topic: "Radiation Protection", difficulty: 2 },
      { front: "What is dose creep in digital imaging?", back: "The gradual increase in exposure technique because digital imaging's wide dynamic range makes overexposed images still appear acceptable. This violates ALARA by delivering unnecessary dose.", modality: "Radiography", bodyPart: "General", category: "Radiation Dose Reduction", country: "both", examType: "ARRT,CAMRT", topic: "Radiation Protection", difficulty: 2 },
      { front: "What is the occupational whole body dose limit? (NCRP and CNSC)", back: "NCRP (USA): 50 mSv/year, cumulative = age × 10 mSv. CNSC (Canada): 50 mSv/year, 100 mSv averaged over 5 consecutive years.", modality: "Radiography", bodyPart: "General", category: "Radiation Dose Reduction", country: "both", examType: "ARRT,CAMRT", topic: "Dose Limits", difficulty: 2 },
      { front: "What is the fetal dose limit in USA vs Canada?", back: "USA (NCRP): 5 mSv for entire gestation, 0.5 mSv/month. Canada (CNSC): 4 mSv for remainder of pregnancy after declaration.", modality: "Radiography", bodyPart: "General", category: "Radiation Dose Reduction", country: "both", examType: "ARRT,CAMRT", topic: "Dose Limits", difficulty: 2 },
      { front: "How does the 15% rule help reduce patient dose?", back: "Increasing kVp by 15% has the same effect on receptor exposure as doubling mAs. So increase kVp by 15% and halve the mAs → maintains image density while reducing patient dose (higher energy beam = less absorption).", modality: "Radiography", bodyPart: "General", category: "Radiation Dose Reduction", country: "both", examType: "ARRT,CAMRT", topic: "Radiation Protection", difficulty: 2 },
    ],
    "contrast-media-reactions": [
      { front: "What are the three severity levels of contrast reactions?", back: "Mild: nausea, hives, warmth (observe, give diphenhydramine). Moderate: bronchospasm, extensive urticaria, facial edema (epinephrine, bronchodilator). Severe: anaphylaxis, cardiac arrest, laryngeal edema (epinephrine, CPR, code team).", modality: "CT", bodyPart: "General", category: "Contrast Media Reactions", country: "both", examType: "ARRT,CAMRT", topic: "Contrast Media", difficulty: 2 },
      { front: "What is the first-line drug for anaphylaxis?", back: "Epinephrine (adrenaline). It is administered IM (intramuscular) as first-line treatment. Diphenhydramine is adjunctive, NOT first-line.", modality: "CT", bodyPart: "General", category: "Contrast Media Reactions", country: "both", examType: "ARRT,CAMRT", topic: "Contrast Reactions", difficulty: 1 },
      { front: "When is barium sulfate contraindicated?", back: "When perforation of the GI tract is suspected. Barium leaking into the peritoneal cavity causes barium peritonitis, which can be fatal. Use water-soluble contrast (Gastrografin) instead.", modality: "Fluoroscopy", bodyPart: "Abdomen", category: "Contrast Media Reactions", country: "both", examType: "ARRT,CAMRT", topic: "Contrast Media", difficulty: 1 },
      { front: "What is the metformin protocol for patients receiving iodinated contrast?", back: "Metformin should be held for 48 hours AFTER iodinated contrast administration. Renal function (eGFR/creatinine) should be verified before resuming metformin.", modality: "CT", bodyPart: "General", category: "Contrast Media Reactions", country: "both", examType: "ARRT,CAMRT", topic: "Contrast Media", difficulty: 2 },
      { front: "What is the difference between HOCM, LOCM, and IOCM?", back: "HOCM: High-Osmolar (~1500-2000 mOsm/kg, more reactions). LOCM: Low-Osmolar (~500-850 mOsm/kg, fewer reactions). IOCM: Iso-Osmolar (~290 mOsm/kg, fewest reactions, closest to blood).", modality: "CT", bodyPart: "General", category: "Contrast Media Reactions", country: "both", examType: "ARRT,CAMRT", topic: "Contrast Media", difficulty: 2 },
      { front: "What premedication is given to patients with prior contrast reactions?", back: "Corticosteroids (prednisone or methylprednisolone) 12 hours and 2 hours before the study, plus diphenhydramine (Benadryl) 1 hour before.", modality: "CT", bodyPart: "General", category: "Contrast Media Reactions", country: "both", examType: "ARRT,CAMRT", topic: "Contrast Media", difficulty: 3 },
    ],
  };

  const defaultCards: Flashcard[] = [];
  const lessonCards = flashcards[lesson.slug];
  if (lessonCards) return lessonCards;

  const concepts = lesson.keyConcepts.slice(0, 7);
  concepts.forEach((concept, i) => {
    defaultCards.push({
      front: `What is ${concept} in the context of ${lesson.title}?`,
      back: `${concept} is a key concept in ${lesson.title}. ${lesson.examTraps[i] || lesson.clinicalRelevance}`,
      modality: lesson.modality,
      bodyPart: "General",
      category: lesson.title,
      country: lesson.country,
      examType: lesson.examType,
      topic: lesson.category,
      difficulty: lesson.difficulty,
    });
  });

  return defaultCards;
}

async function ensureUniqueIndexes() {
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_imaging_physics_topics_slug_unique
    ON imaging_physics_topics (slug) WHERE slug IS NOT NULL AND slug != ''
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_imaging_flashcards_front_category_unique
    ON imaging_flashcards (md5(front), category) WHERE front IS NOT NULL AND category IS NOT NULL
  `);
  console.log("  Unique indexes ensured for ON CONFLICT deduplication.");
}

async function seedLessons() {
  console.log(`\n--- Seeding ${LESSONS.length} Diagnostic Imaging Lessons ---`);
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const l of LESSONS) {
    try {
      const fullContent = buildFullContent(l);
      const result = await pool.query(
        `INSERT INTO imaging_physics_topics (
          id, title, slug, content, category, modality, country, exam_type,
          key_concepts, formulas, exam_traps, memory_aid, clinical_relevance,
          diagram_config, quiz_items, difficulty, sort_order, status,
          seo_title, seo_description, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
          $8, $9::jsonb, $10::jsonb, $11, $12,
          $13::jsonb, $14::jsonb, $15, $16, 'published',
          $17, $18, NOW(), NOW()
        )
        ON CONFLICT (slug) WHERE slug IS NOT NULL AND slug != ''
        DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          category = EXCLUDED.category,
          modality = EXCLUDED.modality,
          country = EXCLUDED.country,
          exam_type = EXCLUDED.exam_type,
          key_concepts = EXCLUDED.key_concepts,
          formulas = EXCLUDED.formulas,
          exam_traps = EXCLUDED.exam_traps,
          memory_aid = EXCLUDED.memory_aid,
          clinical_relevance = EXCLUDED.clinical_relevance,
          diagram_config = EXCLUDED.diagram_config,
          quiz_items = EXCLUDED.quiz_items,
          difficulty = EXCLUDED.difficulty,
          sort_order = EXCLUDED.sort_order,
          status = EXCLUDED.status,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          updated_at = NOW()`,
        [
          l.title,
          l.slug,
          fullContent,
          l.category,
          l.modality,
          l.country,
          l.examType,
          l.keyConcepts,
          JSON.stringify(l.formulas),
          JSON.stringify(l.examTraps),
          l.memoryAid,
          l.clinicalRelevance,
          JSON.stringify(l.diagramConfig),
          JSON.stringify(l.quizItems),
          l.difficulty,
          l.sortOrder,
          `${l.title} | ARRT & CAMRT Exam Prep`,
          `Comprehensive lesson on ${l.title.toLowerCase()} for diagnostic imaging professionals. Covers anatomy, technique, positioning, radiation safety, pathology, and exam tips for ARRT and CAMRT certification.`,
        ]
      );
      if (result.command === "INSERT") inserted++;
      else updated++;
    } catch (err: any) {
      errors++;
      console.error(`  Error inserting lesson "${l.title}": ${err.message.substring(0, 200)}`);
    }
  }
  console.log(`  Processed: ${LESSONS.length}, Errors: ${errors}`);
  return LESSONS.length - errors;
}

async function seedFlashcards() {
  let totalCards = 0;
  let processed = 0;
  let errors = 0;

  for (const lesson of LESSONS) {
    const cards = generateFlashcardsForLesson(lesson);
    totalCards += cards.length;

    for (const c of cards) {
      try {
        await pool.query(
          `INSERT INTO imaging_flashcards (
            id, front, back, modality, body_part, category,
            country, exam_type, topic, difficulty, status,
            created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5,
            $6, $7, $8, $9, 'published', NOW(), NOW()
          )
          ON CONFLICT (md5(front), category) WHERE front IS NOT NULL AND category IS NOT NULL
          DO UPDATE SET
            back = EXCLUDED.back,
            modality = EXCLUDED.modality,
            body_part = EXCLUDED.body_part,
            country = EXCLUDED.country,
            exam_type = EXCLUDED.exam_type,
            topic = EXCLUDED.topic,
            difficulty = EXCLUDED.difficulty,
            status = EXCLUDED.status,
            updated_at = NOW()`,
          [
            c.front, c.back, c.modality, c.bodyPart, c.category,
            c.country, c.examType, c.topic, c.difficulty,
          ]
        );
        processed++;
      } catch (err: any) {
        errors++;
        if (errors <= 5) console.error(`  Flashcard error: ${err.message.substring(0, 150)}`);
      }
    }
  }
  console.log(`\n--- Seeded Flashcards ---`);
  console.log(`  Total cards defined: ${totalCards}, Processed: ${processed}, Errors: ${errors}`);
  return processed;
}

async function verify() {
  console.log("\n--- Verification ---");

  const lessonCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_physics_topics WHERE status = 'published' AND slug IS NOT NULL AND slug != ''`
  );
  console.log(`  Published lessons with slugs: ${lessonCount.rows[0].count}`);

  const newLessonCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_physics_topics WHERE status = 'published' AND exam_type IS NOT NULL AND exam_type != ''`
  );
  console.log(`  Published lessons with exam_type: ${newLessonCount.rows[0].count}`);

  const flashcardCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_flashcards WHERE status = 'published'`
  );
  console.log(`  Published flashcards (total): ${flashcardCount.rows[0].count}`);

  const categoryCounts = await pool.query(
    `SELECT category, COUNT(*) as cnt FROM imaging_physics_topics WHERE status = 'published' AND exam_type IS NOT NULL GROUP BY category ORDER BY cnt DESC`
  );
  console.log(`  Lessons by category:`);
  for (const row of categoryCounts.rows) {
    console.log(`    ${row.category}: ${row.cnt}`);
  }

  const flashcardCats = await pool.query(
    `SELECT category, COUNT(*) as cnt FROM imaging_flashcards WHERE status = 'published' AND country = 'both' GROUP BY category ORDER BY cnt DESC LIMIT 10`
  );
  console.log(`  New flashcards by category (top 10):`);
  for (const row of flashcardCats.rows) {
    console.log(`    ${row.category}: ${row.cnt}`);
  }
}

async function main() {
  console.log("=== Diagnostic Imaging Educational Lessons & Flashcards Seeder ===\n");

  await ensureUniqueIndexes();
  await seedLessons();
  await seedFlashcards();
  await verify();

  console.log("\n=== Seeding Complete! ===\n");
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error("Seeding failed:", err);
    pool.end();
    process.exit(1);
  });
