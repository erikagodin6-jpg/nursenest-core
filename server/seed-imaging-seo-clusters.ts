import { pool } from "./storage";

const NOW = new Date().toISOString();

interface SeoPage {
  slug: string;
  country: string;
  page_type: string;
  topic: string;
  subtopic?: string;
  title: string;
  meta_title: string;
  meta_description: string;
  intro_html: string;
  content_html: string;
  faq_json: any[];
  internal_links_json: any[];
  cta_json: any;
  sample_questions_json: any[];
  tags: string[];
  primary_keyword: string;
  secondary_keywords: string[];
  schema_markup_json: any;
  status: string;
}

interface BlogArticle {
  slug: string;
  country: string;
  article_type: string;
  category: string;
  title: string;
  meta_title: string;
  meta_description: string;
  summary: string;
  content_html: string;
  tags: string[];
  primary_keyword: string;
  secondary_keywords: string[];
  related_seo_page_slugs: string[];
  related_article_slugs: string[];
  schema_markup_json: any;
  read_time_minutes: number;
  status: string;
}

function makeSchemaMarkup(title: string, description: string, slug: string, faqs: {q: string; a: string}[], country: string = "usa") {
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: `https://www.nursenest.ca/medical-imaging/${country}/seo/${slug}`,
      isPartOf: { "@type": "WebSite", name: "NurseNest", url: "https://www.nursenest.ca" },
    },
  ];
  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return schemas;
}

function makeCta(heading: string, subheading: string, buttonText: string, buttonUrl: string) {
  return { heading, subheading, buttonText, buttonUrl, style: "primary" };
}

const standardCta = makeCta(
  "Ready to Ace Your Radiology Exam?",
  "Join thousands of imaging students using NurseNest to prepare for ARRT and CAMRT certification.",
  "Start Practicing Free",
  "/medical-imaging"
);

const standardLinks = [
  { label: "Medical Imaging Hub", url: "/medical-imaging", type: "hub" },
  { label: "Practice Questions", url: "/medical-imaging/usa/practice-exams", type: "practice" },
  { label: "Positioning Guide", url: "/medical-imaging/usa/positioning", type: "guide" },
  { label: "Physics Review", url: "/medical-imaging/usa/physics", type: "review" },
  { label: "Flashcards", url: "/medical-imaging/usa/flashcards", type: "study" },
  { label: "Exam Simulator", url: "/medical-imaging/usa/exam-simulator", type: "tool" },
];

// ===== IMAGING BASICS CLUSTER (6 pages) =====
const imagingBasicsCluster: SeoPage[] = [
  {
    slug: "x-ray-vs-ct-vs-mri",
    country: "usa",
    page_type: "cluster",
    topic: "imaging-basics",
    subtopic: "modality-comparison",
    title: "X-ray vs CT vs MRI: Complete Comparison Guide for Radiography Students",
    meta_title: "X-ray vs CT vs MRI – Differences, Uses & When to Choose Each | NurseNest",
    meta_description: "Compare x-ray, CT, and MRI imaging modalities. Learn the physics, clinical applications, advantages, limitations, and ARRT exam coverage for each modality.",
    intro_html: `<p>Understanding the differences between x-ray, CT, and MRI is fundamental to radiography practice and a frequent topic on the ARRT certification exam. Each modality uses different physical principles to create images, and selecting the right modality for a clinical scenario is a key competency for radiologic technologists.</p>`,
    content_html: `<h2>How X-rays Work</h2><p>Conventional radiography uses ionizing radiation (x-rays) produced by an x-ray tube. The tube accelerates electrons from the cathode to the anode target, producing bremsstrahlung and characteristic radiation. X-rays pass through the patient and are attenuated differently by various tissues based on their atomic number, density, and thickness. The resulting pattern is captured by a digital detector (DR or CR) to create a 2D projection image.</p><p><strong>Key advantages:</strong> Fast acquisition, widely available, low cost, excellent for bone and lung evaluation. <strong>Limitations:</strong> Superimposition of structures (2D only), limited soft tissue contrast, uses ionizing radiation.</p>
<h2>How CT Works</h2><p>Computed tomography rotates an x-ray tube around the patient, acquiring multiple projection angles. A computer reconstructs cross-sectional (axial) images using filtered back projection or iterative reconstruction algorithms. Modern helical/spiral CT allows continuous data acquisition with multiplanar and 3D reconstruction capabilities.</p><p><strong>Key advantages:</strong> Excellent spatial and contrast resolution, fast acquisition (trauma, stroke), no superimposition. <strong>Limitations:</strong> Higher radiation dose than radiography, potential contrast reactions, cost.</p>
<h2>How MRI Works</h2><p>MRI uses strong magnetic fields (1.5T or 3T) and radiofrequency pulses to excite hydrogen protons in the body. As protons return to equilibrium, they emit RF signals detected by receiver coils. Different tissue properties (T1 and T2 relaxation times, proton density) create contrast without ionizing radiation.</p><p><strong>Key advantages:</strong> Superior soft tissue contrast, no ionizing radiation, multiplanar capability, functional imaging. <strong>Limitations:</strong> Long scan times, MRI safety concerns (ferromagnetic implants), claustrophobia, higher cost, limited availability.</p>
<h2>Clinical Decision Making</h2><p>Modality selection depends on the clinical question, patient factors, and available resources. Bone fractures → radiography first. Acute stroke → CT (non-contrast) then MRI (DWI). Soft tissue masses → MRI. Pulmonary embolism → CT angiography. Abdominal trauma → CT with contrast.</p>
<h2>ARRT Exam Relevance</h2><p>Expect questions comparing modality physics, appropriate modality selection, and understanding when to recommend alternative imaging. Know the fundamental physics differences, clinical applications, and patient safety considerations for each modality.</p>`,
    faq_json: [
      { q: "What is the main difference between x-ray, CT, and MRI?", a: "X-ray creates 2D projection images using ionizing radiation, CT creates cross-sectional images using rotating x-rays with computer reconstruction, and MRI creates images using magnetic fields and radiofrequency pulses without ionizing radiation." },
      { q: "Which imaging modality has the best soft tissue contrast?", a: "MRI provides superior soft tissue contrast due to the sensitivity of T1 and T2 relaxation parameters to tissue composition, making it ideal for brain, spine, joint, and soft tissue evaluation." },
      { q: "Does the ARRT exam test knowledge of all three modalities?", a: "Yes. The ARRT radiography exam covers the physics and clinical applications of radiography, CT basics, and MRI fundamentals, including appropriate modality selection for clinical scenarios." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [
      { question: "Which imaging modality provides the best soft tissue contrast without ionizing radiation?", options: ["X-ray", "CT", "MRI", "Ultrasound"], correctIndex: 2, rationale: "MRI uses magnetic fields and RF pulses to differentiate soft tissues based on T1 and T2 relaxation times, providing superior contrast without radiation exposure." },
    ],
    tags: ["imaging basics", "x-ray", "CT", "MRI", "modality comparison", "ARRT"],
    primary_keyword: "x-ray vs ct vs mri",
    secondary_keywords: ["imaging modalities comparison", "radiography vs CT", "when to use MRI", "ARRT exam imaging basics"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "how-x-rays-work",
    country: "usa",
    page_type: "cluster",
    topic: "imaging-basics",
    subtopic: "x-ray-production",
    title: "How X-rays Work: Complete Physics Guide for Radiography Students",
    meta_title: "How X-rays Work – X-ray Production Physics for ARRT Exam Prep | NurseNest",
    meta_description: "Learn how x-rays are produced in the x-ray tube, including bremsstrahlung, characteristic radiation, tube components, and technical factors. ARRT exam-focused guide.",
    intro_html: `<p>Understanding x-ray production is a cornerstone of radiographic science and one of the most heavily tested topics on the ARRT certification exam. This guide covers the complete physics of how x-rays are generated, from thermionic emission at the cathode to photon emission at the anode target.</p>`,
    content_html: `<h2>X-ray Tube Components</h2><p>The x-ray tube is a vacuum envelope containing a <strong>cathode</strong> (negative electrode with tungsten filament) and an <strong>anode</strong> (positive electrode with tungsten target). When the filament is heated by low-voltage current, electrons are released through thermionic emission. A high voltage (kVp) across the tube accelerates these electrons toward the anode target at tremendous speed.</p>
<h2>Bremsstrahlung Radiation</h2><p>When a high-speed electron passes near the nucleus of a target atom, it is decelerated by the nuclear electric field. The lost kinetic energy is converted into an x-ray photon. This produces a continuous energy spectrum accounting for 80-90% of the useful x-ray beam. The maximum photon energy equals the peak kVp.</p>
<h2>Characteristic Radiation</h2><p>When an incoming electron ejects an inner shell (K-shell) electron from the target atom, an outer shell electron fills the vacancy. The energy difference between shells is emitted as a characteristic x-ray photon with discrete energy. For tungsten targets, K-characteristic x-rays have energies of 57-69 keV.</p>
<h2>Factors Affecting the X-ray Beam</h2><p><strong>kVp</strong> controls beam quality (penetrating ability) and affects contrast. <strong>mA</strong> controls beam quantity (number of photons). <strong>Filtration</strong> removes low-energy photons that would increase patient skin dose. The <strong>anode heel effect</strong> causes greater beam intensity on the cathode side.</p>
<h2>ARRT Exam Focus</h2><p>Know the difference between bremsstrahlung and characteristic radiation, how kVp and mA affect the beam, the purpose of filtration, and the anode heel effect. These concepts appear in multiple content areas of the ARRT exam.</p>`,
    faq_json: [
      { q: "What percentage of electron kinetic energy is converted to x-rays?", a: "Less than 1% of the electron kinetic energy is converted to x-rays. Over 99% is converted to heat, which is why the anode must have efficient heat dissipation through rotation and oil cooling." },
      { q: "Why is tungsten used as the target material?", a: "Tungsten has a high atomic number (Z=74) for efficient x-ray production, a high melting point (3422°C) to withstand heat, and good thermal conductivity for heat dissipation." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["x-ray production", "bremsstrahlung", "characteristic radiation", "x-ray tube", "ARRT physics"],
    primary_keyword: "how x-rays work",
    secondary_keywords: ["x-ray production physics", "bremsstrahlung radiation", "characteristic radiation", "x-ray tube components"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "ct-scan-basics",
    country: "usa",
    page_type: "cluster",
    topic: "imaging-basics",
    subtopic: "computed-tomography",
    title: "CT Scan Basics: How CT Works for Radiography Students",
    meta_title: "CT Scan Basics – How Computed Tomography Works | NurseNest ARRT Prep",
    meta_description: "Understand CT scan fundamentals including helical scanning, Hounsfield units, windowing, reconstruction algorithms, and dose metrics. Essential ARRT exam knowledge.",
    intro_html: `<p>Computed tomography (CT) has become one of the most important diagnostic imaging tools in modern medicine. Understanding CT principles is essential for radiologic technologists and is tested on the ARRT certification exam across multiple content areas.</p>`,
    content_html: `<h2>CT Acquisition Principles</h2><p>CT uses a rotating x-ray tube and detector array to acquire projection data from multiple angles around the patient. A computer reconstructs cross-sectional images from this data. Modern scanners use helical (spiral) acquisition where the tube rotates continuously while the table moves, creating volumetric data sets.</p>
<h2>Hounsfield Units</h2><p>CT numbers (Hounsfield units) represent tissue attenuation relative to water. Water = 0 HU, air = -1000 HU, dense bone = +1000 HU or higher. Soft tissues range from 20-60 HU, fat from -50 to -100 HU, and acute blood 40-60 HU.</p>
<h2>Windowing</h2><p>Window width (WW) controls the displayed contrast range, and window level (WL) sets the center value. Standard windows: brain (WW 80, WL 35), lung (WW 1500, WL -600), bone (WW 2000, WL 400). Windowing can be adjusted after image acquisition.</p>
<h2>CT Dose Metrics</h2><p><strong>CTDIvol</strong> measures average dose within a scan volume accounting for pitch. <strong>DLP</strong> (dose-length product) = CTDIvol × scan length. <strong>SSDE</strong> (size-specific dose estimate) adjusts for patient size. Dose optimization: ATCM, iterative reconstruction, appropriate scan protocols.</p>
<h2>Helical CT and Pitch</h2><p>Pitch = table travel per rotation / total collimation. Pitch 1: contiguous data. Pitch >1: faster scan, lower dose, potential gaps. Pitch <1: overlapping data, higher dose, better z-resolution.</p>`,
    faq_json: [
      { q: "What is the difference between axial and helical CT?", a: "Axial CT acquires data one slice at a time with the table stationary, while helical CT continuously rotates the tube as the table moves, creating a volumetric spiral data set that allows faster scanning and multiplanar reconstruction." },
      { q: "How do I read CT Hounsfield unit values?", a: "Remember the key reference points: air = -1000, water = 0, bone = +1000. Fat is slightly negative (-50 to -100), soft tissue is slightly positive (20-60), and fresh blood is 40-60 HU." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["CT basics", "computed tomography", "Hounsfield units", "windowing", "helical CT", "ARRT"],
    primary_keyword: "ct scan basics",
    secondary_keywords: ["computed tomography fundamentals", "Hounsfield units explained", "CT windowing", "helical CT scanning"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "mri-basics",
    country: "usa",
    page_type: "cluster",
    topic: "imaging-basics",
    subtopic: "magnetic-resonance-imaging",
    title: "MRI Basics: How MRI Works for Radiography & Imaging Students",
    meta_title: "MRI Basics – How Magnetic Resonance Imaging Works | NurseNest",
    meta_description: "Learn MRI fundamentals including magnetic field principles, T1 and T2 weighting, pulse sequences, contrast agents, and MRI safety. Essential for ARRT exam prep.",
    intro_html: `<p>Magnetic resonance imaging (MRI) uses strong magnetic fields and radiofrequency pulses to create detailed images of the body without ionizing radiation. While MRI is a separate specialty, ARRT-certified radiologic technologists must understand MRI fundamentals and safety.</p>`,
    content_html: `<h2>MRI Physics Fundamentals</h2><p>MRI exploits the magnetic properties of hydrogen protons in the body. A strong static magnetic field (1.5T or 3T) aligns protons along the field direction. Radiofrequency pulses tip protons away from alignment, and as they return to equilibrium, they emit detectable RF signals. Gradient coils create spatial encoding to form images.</p>
<h2>T1 vs T2 Weighting</h2><p><strong>T1-weighted images:</strong> Short TR, short TE. Fat appears bright, water/CSF appears dark. Best for anatomy and post-contrast enhancement. <strong>T2-weighted images:</strong> Long TR, long TE. Water/fluid appears bright. Best for pathology detection (edema, tumors, inflammation). <strong>FLAIR:</strong> T2-like contrast with CSF signal suppressed.</p>
<h2>MRI Contrast Agents</h2><p>Gadolinium-based contrast agents (GBCAs) shorten T1 relaxation time, making enhancing tissues bright on T1-weighted images. Used for tumor detection, inflammation, vascular imaging. Risk: nephrogenic systemic fibrosis (NSF) in patients with severe renal insufficiency (GFR <30).</p>
<h2>MRI Safety</h2><p>Critical safety concerns: ferromagnetic projectiles, implant heating/movement/malfunction, RF-induced burns, acoustic noise. MRI safety zones (I-IV) control access. Thorough patient screening for implants, metallic foreign bodies, and pregnancy is mandatory before every scan.</p>`,
    faq_json: [
      { q: "Does MRI use radiation?", a: "No. MRI uses strong magnetic fields and radiofrequency pulses, not ionizing radiation. This makes it particularly valuable for imaging children, pregnant patients (with caution), and patients requiring multiple follow-up scans." },
      { q: "What is the difference between T1 and T2 weighted MRI?", a: "T1-weighted images show fat as bright and water as dark (good for anatomy), while T2-weighted images show water/fluid as bright (good for pathology detection like edema, tumors, and inflammation)." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["MRI basics", "T1 weighting", "T2 weighting", "gadolinium", "MRI safety", "ARRT"],
    primary_keyword: "mri basics",
    secondary_keywords: ["how MRI works", "T1 vs T2 MRI", "gadolinium contrast MRI", "MRI safety radiography"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "contrast-media-explained",
    country: "usa",
    page_type: "cluster",
    topic: "imaging-basics",
    subtopic: "contrast-agents",
    title: "Contrast Media in Radiology: Complete Guide for Imaging Students",
    meta_title: "Contrast Media Explained – Types, Reactions & Safety | NurseNest ARRT Prep",
    meta_description: "Comprehensive guide to contrast media in radiology: iodinated contrast, barium sulfate, gadolinium, reaction management, premedication, and CIN prevention for the ARRT exam.",
    intro_html: `<p>Contrast media are substances administered to patients to enhance the visibility of internal structures during medical imaging. Understanding contrast types, administration, reactions, and safety is a critical component of the ARRT exam and daily radiography practice.</p>`,
    content_html: `<h2>Types of Contrast Media</h2><p><strong>Iodinated contrast:</strong> Used for CT, angiography, and fluoroscopy. Classified by osmolality: HOCM (high-osmolar, ionic), LOCM (low-osmolar, non-ionic), and IOCM (iso-osmolar). LOCM/IOCM are standard of care due to fewer adverse reactions.</p><p><strong>Barium sulfate:</strong> Used for GI studies (UGI, barium enema). Insoluble, non-absorbable, excellent mucosal coating. Contraindicated if perforation is suspected — use water-soluble contrast instead.</p><p><strong>Gadolinium:</strong> Used for MRI. Paramagnetic agent that shortens T1 relaxation time. Risk of NSF in severe renal insufficiency.</p>
<h2>Contrast Reactions</h2><p><strong>Mild:</strong> Urticaria, pruritus, nausea — treat with diphenhydramine, observation. <strong>Moderate:</strong> Bronchospasm, facial edema, mild hypotension — epinephrine, bronchodilators. <strong>Severe:</strong> Anaphylaxis, cardiovascular collapse — epinephrine, IV fluids, CPR if needed.</p>
<h2>Contrast-Induced Nephropathy</h2><p>Risk factors: pre-existing renal insufficiency (eGFR <30), diabetes, dehydration, nephrotoxic drugs. Prevention: IV hydration, use LOCM/IOCM, minimize contrast volume. Hold metformin 48 hours post-contrast.</p>
<h2>Premedication Protocol</h2><p>For patients with prior contrast reactions: prednisone 50mg at 13h, 7h, and 1h before; diphenhydramine 50mg 1h before; use LOCM/IOCM. Premedication reduces but does not eliminate risk.</p>`,
    faq_json: [
      { q: "What should I do if a patient has a mild contrast reaction?", a: "For mild reactions (urticaria, itching), administer diphenhydramine 25-50mg as ordered, monitor vital signs, and observe for 20-30 minutes for progression. Most mild reactions are self-limiting." },
      { q: "Can patients with kidney disease receive iodinated contrast?", a: "Patients with severe renal insufficiency (eGFR <30) are at highest risk for contrast-induced nephropathy. The decision involves risk-benefit analysis, IV hydration, using the lowest effective contrast volume, and potentially using alternative imaging." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["contrast media", "iodinated contrast", "barium", "gadolinium", "contrast reactions", "CIN", "ARRT"],
    primary_keyword: "contrast media radiology",
    secondary_keywords: ["contrast agent types", "contrast reaction management", "contrast induced nephropathy", "premedication contrast allergy"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "imaging-artifacts-explained",
    country: "usa",
    page_type: "cluster",
    topic: "imaging-basics",
    subtopic: "artifacts",
    title: "Imaging Artifacts: Identification & Prevention Guide for Radiography",
    meta_title: "Imaging Artifacts Explained – Causes, Types & Prevention | NurseNest",
    meta_description: "Learn to identify and prevent common imaging artifacts in radiography, CT, fluoroscopy, and digital imaging. ARRT exam prep guide with visual examples and solutions.",
    intro_html: `<p>Artifacts are features on an image that do not represent actual anatomy. Recognizing, understanding, and preventing artifacts is essential for producing diagnostic-quality images and is a frequently tested topic on the ARRT certification exam.</p>`,
    content_html: `<h2>Radiographic Artifacts</h2><p><strong>Motion blur:</strong> Patient or involuntary movement during exposure. Prevention: short exposure time, immobilization, clear instructions. <strong>Grid artifacts:</strong> Grid cutoff from misalignment (lateral decentering, upside-down focused grid, wrong SID). <strong>Double exposure:</strong> Two exposures on the same detector. <strong>Foreign objects:</strong> Jewelry, clothing snaps, hair accessories in the beam.</p>
<h2>Digital Radiography Artifacts</h2><p><strong>Dead pixels:</strong> Consistently bright or dark spots from defective detector elements. Managed by calibration maps. <strong>Ghosting (CR):</strong> Incomplete plate erasure leaving residual image. <strong>Backscatter:</strong> Radiation from behind the cassette causing edge artifacts. <strong>Moiré pattern:</strong> Interference between grid lines and detector pixel matrix.</p>
<h2>CT Artifacts</h2><p><strong>Beam hardening:</strong> Lower-energy photons absorbed preferentially → cupping and dark bands between dense structures. <strong>Metal artifacts:</strong> Streak artifacts from high-Z implants (photon starvation + beam hardening). Reduced by MAR algorithms and dual-energy CT. <strong>Ring artifacts:</strong> Miscalibrated detector element creates rings on axial images. <strong>Motion:</strong> Blurring and streaking from patient movement.</p>
<h2>Fluoroscopy Artifacts</h2><p><strong>Vignetting:</strong> Brightness loss at image periphery (image intensifier). <strong>Pincushion distortion:</strong> Geometric distortion at edges. <strong>S-distortion:</strong> From external magnetic fields affecting electron beam. Not present in flat panel detector systems.</p>`,
    faq_json: [
      { q: "How can I tell the difference between a true finding and an artifact?", a: "Artifacts typically do not conform to known anatomical structures, may have geometric patterns (lines, rings, streaks), and often relate to equipment malfunction or technique errors. When in doubt, repeat the image with corrected technique or consult the radiologist." },
      { q: "What causes streak artifacts on CT?", a: "Streak artifacts are most commonly caused by metal (dental fillings, surgical hardware) due to beam hardening and photon starvation. They can also result from patient motion, insufficient projections, or detector malfunction." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["imaging artifacts", "CT artifacts", "digital artifacts", "motion blur", "beam hardening", "ARRT"],
    primary_keyword: "imaging artifacts",
    secondary_keywords: ["radiography artifacts types", "CT beam hardening artifact", "digital radiography artifacts", "grid cutoff artifact"],
    schema_markup_json: {},
    status: "published",
  },
];

// ===== RADIATION & SAFETY CLUSTER (6 pages) =====
const radiationSafetyCluster: SeoPage[] = [
  {
    slug: "radiation-dose-explained",
    country: "usa",
    page_type: "cluster",
    topic: "radiation-safety",
    subtopic: "dose-concepts",
    title: "Radiation Dose Explained: Measurement Units & Concepts for Radiography",
    meta_title: "Radiation Dose Explained – Units, Measurement & ARRT Exam Guide | NurseNest",
    meta_description: "Understand radiation dose measurement units (mGy, mSv, rem), dose metrics (CTDIvol, DLP, SSDE), and biological dose concepts. Essential ARRT exam radiation safety content.",
    intro_html: `<p>Understanding radiation dose measurement is fundamental to radiation protection practice and heavily tested on the ARRT certification exam. This guide covers dose quantities, units, measurement methods, and their clinical significance.</p>`,
    content_html: `<h2>Radiation Dose Quantities</h2><p><strong>Absorbed dose (Gy/rad):</strong> Energy deposited per unit mass of tissue. 1 Gy = 100 rad. <strong>Equivalent dose (Sv/rem):</strong> Absorbed dose weighted by radiation quality factor. For x-rays, quality factor = 1, so equivalent dose equals absorbed dose. <strong>Effective dose (Sv/rem):</strong> Sum of weighted equivalent doses across all organs, accounting for tissue radiosensitivity.</p>
<h2>Dose Measurement in Practice</h2><p><strong>Entrance skin exposure (ESE):</strong> Measured at the skin surface using TLD or ionization chamber. <strong>Mean glandular dose (MGD):</strong> Standard dose metric for mammography. <strong>CTDIvol:</strong> Average dose within a CT scan volume. <strong>DLP:</strong> CTDIvol × scan length. <strong>SSDE:</strong> CTDIvol adjusted for patient size.</p>
<h2>Personnel Dosimetry</h2><p><strong>OSL (optically stimulated luminescence):</strong> Al₂O₃:C crystal, re-readable, high sensitivity. <strong>TLD (thermoluminescent dosimeter):</strong> LiF crystal, heated to release stored energy. Worn at collar level (outside apron) or dual-badge system for fluoroscopy.</p>
<h2>Dose Reference Levels</h2><p>DRLs are benchmark values (not limits) representing the 75th percentile of doses for standard examinations. If a facility consistently exceeds DRLs, technique optimization is recommended. DRLs help identify opportunities for dose reduction without compromising diagnostic quality.</p>`,
    faq_json: [
      { q: "What is the difference between mGy and mSv?", a: "mGy (milligray) measures absorbed dose — the energy deposited in tissue. mSv (millisievert) measures effective dose — accounting for both radiation type and tissue sensitivity. For diagnostic x-rays, the numerical values are essentially the same since the quality factor is 1." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["radiation dose", "dosimetry", "mGy", "mSv", "effective dose", "ARRT"],
    primary_keyword: "radiation dose explained",
    secondary_keywords: ["radiation dose units", "absorbed dose vs effective dose", "CTDIvol explained", "personnel dosimetry"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "alara-principle",
    country: "usa",
    page_type: "cluster",
    topic: "radiation-safety",
    subtopic: "alara",
    title: "ALARA Principle in Radiology: As Low As Reasonably Achievable",
    meta_title: "ALARA Principle – Radiation Protection Guide for ARRT Exam | NurseNest",
    meta_description: "Master the ALARA principle for radiation protection. Learn practical techniques for minimizing radiation dose while maintaining diagnostic image quality. ARRT exam prep.",
    intro_html: `<p>ALARA — As Low As Reasonably Achievable — is the guiding principle of radiation protection in medical imaging. It directs all imaging professionals to minimize radiation exposure while still producing images of diagnostic quality. ALARA is a cornerstone topic on the ARRT certification exam.</p>`,
    content_html: `<h2>The ALARA Philosophy</h2><p>ALARA is based on the linear no-threshold (LNT) model, which assumes any dose of radiation carries some risk. The goal is not zero dose (which would mean no imaging), but the lowest dose that produces a diagnostically adequate image. This concept has evolved into ALADA (As Low As Diagnostically Acceptable).</p>
<h2>Practical ALARA Techniques</h2><p><strong>Technique optimization:</strong> Use appropriate kVp and mAs for patient size. Higher kVp with lower mAs reduces skin dose. Pediatric protocols should use child-size techniques. <strong>Collimation:</strong> Restrict the beam to the area of clinical interest. <strong>Shielding:</strong> Lead aprons, thyroid shields, gonadal shielding when appropriate. <strong>Repeat reduction:</strong> Proper positioning and communication reduce repeat rates (goal <2%).</p>
<h2>ALARA for the Operator</h2><p>The three cardinal principles: <strong>Time</strong> (minimize exposure duration), <strong>Distance</strong> (maximize distance from the source — inverse square law), and <strong>Shielding</strong> (use appropriate barriers). During fluoroscopy: stand behind the lead barrier, use ceiling-mounted shields, wear protective equipment.</p>
<h2>Digital Imaging and ALARA</h2><p>Digital detectors have wide dynamic range that can mask overexposure. Monitor exposure indicators (EI/DI) to prevent dose creep. Just because an image looks acceptable doesn't mean the technique was optimal. ALARA requires active dose management.</p>`,
    faq_json: [
      { q: "Is ALARA a legal requirement?", a: "ALARA is required by the NRC for facilities using radioactive materials and is adopted by state radiation control programs. It is the standard of care in all medical imaging and is expected in professional practice guidelines from the ASRT and ACR." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["ALARA", "radiation protection", "dose optimization", "cardinal principles", "ARRT"],
    primary_keyword: "alara principle radiology",
    secondary_keywords: ["as low as reasonably achievable", "radiation dose reduction techniques", "ALARA fluoroscopy", "dose creep digital radiography"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "radiation-protection-techniques",
    country: "usa",
    page_type: "cluster",
    topic: "radiation-safety",
    subtopic: "protection-methods",
    title: "Radiation Protection Techniques: Complete Guide for Radiologic Technologists",
    meta_title: "Radiation Protection Techniques – Shielding, Distance & Time | NurseNest",
    meta_description: "Learn essential radiation protection techniques including shielding types, time-distance principles, collimation, and technique optimization for ARRT exam preparation.",
    intro_html: `<p>Radiation protection encompasses all methods used to minimize radiation exposure to patients, operators, and the public. Mastering these techniques is essential for safe radiographic practice and a major focus of the ARRT certification exam.</p>`,
    content_html: `<h2>Patient Protection</h2><p><strong>Collimation:</strong> The most effective patient protection technique. Restricting the beam reduces irradiated volume, patient dose, and scatter. <strong>Gonadal shielding:</strong> Contact or shadow shields when gonads are within 5 cm of the primary beam and shielding won't obscure anatomy. <strong>Technique optimization:</strong> Appropriate kVp/mAs for patient size, AEC use, digital exposure monitoring.</p>
<h2>Operator Protection</h2><p><strong>Lead aprons:</strong> 0.5 mm Pb equivalent (95% dose reduction at diagnostic energies). <strong>Thyroid shields:</strong> Essential during fluoroscopy. <strong>Lead glasses:</strong> Protect the lens (ICRP recommends 20 mSv/year eye dose limit). <strong>Distance:</strong> Inverse square law — double the distance, reduce exposure to 1/4.</p>
<h2>Structural Shielding</h2><p>Primary barriers: walls where the useful beam may be directed. Secondary barriers: walls exposed only to scatter and leakage. Shielding design uses workload (W), use factor (U), and occupancy factor (T). Control booth: lead-equivalent walls with lead glass window.</p>
<h2>Special Populations</h2><p><strong>Pregnant patients:</strong> Confirm pregnancy status, shield abdomen if not in primary beam, use lowest effective technique, consider alternative modalities. <strong>Pediatric patients:</strong> Child-size techniques, immobilization to reduce repeats, Image Gently campaign. <strong>Pregnant workers:</strong> 0.5 mSv/month fetal dose limit.</p>`,
    faq_json: [
      { q: "What is the most important radiation protection technique for patients?", a: "Collimation is considered the single most effective patient protection technique. It directly reduces the volume of tissue irradiated, lowering patient dose and also reducing scatter radiation which improves image quality." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["radiation protection", "shielding", "collimation", "gonadal shields", "lead apron", "ARRT"],
    primary_keyword: "radiation protection techniques",
    secondary_keywords: ["patient radiation shielding", "operator radiation protection", "structural shielding design", "collimation radiation safety"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "scatter-radiation",
    country: "usa",
    page_type: "cluster",
    topic: "radiation-safety",
    subtopic: "scatter",
    title: "Scatter Radiation in Radiology: Causes, Effects & Reduction Methods",
    meta_title: "Scatter Radiation – Causes, Effects & Reduction for ARRT Exam | NurseNest",
    meta_description: "Understand scatter radiation in medical imaging: Compton effect, effects on image quality, dose implications, and reduction techniques. ARRT exam study guide.",
    intro_html: `<p>Scatter radiation is one of the most significant factors affecting both image quality and radiation safety in diagnostic radiology. Understanding its production, effects, and management is essential for the ARRT certification exam.</p>`,
    content_html: `<h2>How Scatter is Produced</h2><p>Scatter radiation is primarily produced by the <strong>Compton effect</strong> — an x-ray photon interacts with a loosely bound outer shell electron, ejecting it and continuing in a different direction with reduced energy. The Compton effect is the dominant interaction at diagnostic energies and is the primary source of image fog and occupational exposure.</p>
<h2>Factors Affecting Scatter Production</h2><p><strong>Field size:</strong> Larger irradiated volume = more scatter. <strong>kVp:</strong> Higher kVp increases Compton interactions (proportionally more than photoelectric at higher energies). <strong>Patient thickness:</strong> Thicker body parts produce more scatter. <strong>Tissue type:</strong> Scatter production varies with tissue composition.</p>
<h2>Effects on Image Quality</h2><p>Scatter adds uniform fog to the image, reducing contrast. Scatter-to-primary ratio increases with field size and kVp. For a typical abdominal exam, scatter can comprise 90%+ of the radiation reaching the detector without a grid.</p>
<h2>Scatter Reduction Techniques</h2><p><strong>Collimation:</strong> Most effective scatter reduction method. <strong>Grids:</strong> Absorb scatter before it reaches the detector (grid ratios 5:1 to 16:1). <strong>Air gap:</strong> Increased OID allows scatter to diverge away from detector. <strong>Optimal kVp:</strong> Use the lowest kVp that provides adequate penetration.</p>`,
    faq_json: [
      { q: "What is the difference between scatter and secondary radiation?", a: "Scatter radiation is a type of secondary radiation produced when x-ray photons interact with matter and change direction (Compton effect). Secondary radiation includes all radiation produced by interactions with matter, including scatter and characteristic radiation from photoelectric interactions." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["scatter radiation", "Compton effect", "grids", "collimation", "image fog", "ARRT"],
    primary_keyword: "scatter radiation radiology",
    secondary_keywords: ["Compton scatter imaging", "scatter reduction techniques", "grid scatter cleanup", "collimation scatter"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "inverse-square-law",
    country: "usa",
    page_type: "cluster",
    topic: "radiation-safety",
    subtopic: "physics-law",
    title: "Inverse Square Law in Radiology: Physics, Calculations & Applications",
    meta_title: "Inverse Square Law – Radiation Physics Calculations for ARRT | NurseNest",
    meta_description: "Master the inverse square law for radiation intensity calculations. Step-by-step examples, SID corrections, and dose estimation for ARRT exam preparation.",
    intro_html: `<p>The inverse square law is one of the most fundamental physics concepts in radiography, governing how radiation intensity changes with distance. It appears frequently on the ARRT exam and has direct clinical applications in technique adjustment, dose estimation, and radiation safety.</p>`,
    content_html: `<h2>The Law Stated</h2><p>Radiation intensity varies inversely with the square of the distance from the source: <strong>I₁/I₂ = (D₂)²/(D₁)²</strong>. Double the distance → intensity drops to 1/4. Triple the distance → intensity drops to 1/9. This applies to all point sources of radiation.</p>
<h2>Clinical Applications</h2><p><strong>SID changes:</strong> When changing SID from 40" to 72", the intensity change factor is (40/72)² = 0.31. You need approximately 3.2× the mAs to maintain the same detector exposure. <strong>Operator safety:</strong> Standing 6 feet from the x-ray source vs. 3 feet reduces exposure to 1/4. <strong>Mobile radiography:</strong> Cord length of ≥6 feet provides significant dose reduction.</p>
<h2>Calculations for the ARRT Exam</h2><p><strong>Example 1:</strong> If the exposure is 100 mR at 40" SID, what is the exposure at 80" SID? Answer: 100 × (40/80)² = 100 × 0.25 = 25 mR.</p><p><strong>Example 2:</strong> If 10 mAs produces adequate density at 40" SID, what mAs is needed at 72" SID? Answer: 10 × (72/40)² = 10 × 3.24 = 32.4 mAs.</p>
<h2>Relationship to Density Maintenance Formula</h2><p>The density maintenance formula derives from the inverse square law: mAs₁/mAs₂ = (SID₁)²/(SID₂)². This allows technologists to adjust mAs when changing SID to maintain consistent image density.</p>`,
    faq_json: [
      { q: "Does the inverse square law apply to scatter radiation?", a: "Yes, the inverse square law applies to all point sources of radiation, including the effective point source of scatter from the patient. This is why maximizing distance from the patient during exposure is an effective operator protection technique." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["inverse square law", "radiation physics", "SID calculations", "dose estimation", "ARRT"],
    primary_keyword: "inverse square law radiology",
    secondary_keywords: ["inverse square law calculations", "SID mAs correction", "radiation distance formula", "intensity distance relationship"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "shielding-exposure-limits",
    country: "usa",
    page_type: "cluster",
    topic: "radiation-safety",
    subtopic: "dose-limits",
    title: "Radiation Shielding & Exposure Limits: NCRP Guidelines for Radiography",
    meta_title: "Radiation Shielding & Dose Limits – NCRP Guidelines | NurseNest ARRT Prep",
    meta_description: "Master NCRP radiation dose limits for occupational workers, the public, and pregnant workers. Complete guide to shielding types and exposure limits for ARRT exam prep.",
    intro_html: `<p>Knowledge of radiation dose limits and shielding requirements is essential for safe radiographic practice and a heavily tested topic on the ARRT exam. This guide covers NCRP-recommended dose limits, protective equipment, and structural shielding requirements.</p>`,
    content_html: `<h2>NCRP Dose Limits</h2><p><strong>Occupational (whole body):</strong> 50 mSv (5 rem) per year. <strong>Cumulative:</strong> 10 mSv × age in years. <strong>Lens of eye:</strong> 150 mSv/year (ICRP now recommends 20 mSv/year). <strong>Skin/extremities:</strong> 500 mSv/year. <strong>General public:</strong> 1 mSv/year. <strong>Embryo/fetus:</strong> 0.5 mSv/month (5 mSv total pregnancy).</p>
<h2>Personal Protective Equipment</h2><p><strong>Lead aprons:</strong> 0.5 mm Pb equivalent standard. Reduces exposure by ~95% at diagnostic energies. <strong>Thyroid shields:</strong> 0.5 mm Pb. Critical during fluoroscopy and CT. <strong>Lead glasses:</strong> 0.75 mm Pb side shields. Protect the lens from cataract-inducing doses. <strong>Lead gloves:</strong> 0.5 mm Pb. Used when hands may enter the primary beam.</p>
<h2>Structural Shielding</h2><p>Primary barriers: 1/16" lead or equivalent. Secondary barriers: 1/32" lead or equivalent. Control booth: lead-equivalent walls with lead glass viewing window. Design based on workload (W), use factor (U), occupancy factor (T), and distance. NCRP Report 147 provides detailed shielding design guidance.</p>
<h2>Monitoring and Compliance</h2><p>Personnel dosimetry badges are required for workers likely to receive >10% of annual dose limits. Reports reviewed monthly/quarterly. Investigation levels: if monthly dose exceeds certain thresholds, review practices. ALARA program required for all facilities.</p>`,
    faq_json: [
      { q: "What happens if I exceed my radiation dose limit?", a: "Exceeding dose limits triggers an investigation, work practice review, and potential temporary reassignment. Chronic overexposure may result in regulatory action. However, exceeding limits is extremely rare in modern practice with proper protection techniques." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["dose limits", "NCRP", "lead shielding", "occupational exposure", "personnel monitoring", "ARRT"],
    primary_keyword: "radiation exposure limits",
    secondary_keywords: ["NCRP dose limits radiology", "lead apron thickness", "occupational dose limits", "radiation shielding requirements"],
    schema_markup_json: {},
    status: "published",
  },
];

// ===== ANATOMY & POSITIONING CLUSTER (6 pages) =====
const anatomyPositioningCluster: SeoPage[] = [
  {
    slug: "chest-xray-positioning",
    country: "usa",
    page_type: "cluster",
    topic: "anatomy-positioning",
    subtopic: "chest",
    title: "Chest X-ray Positioning: Complete Guide to PA, Lateral & Special Views",
    meta_title: "Chest X-ray Positioning Guide – PA, Lateral & Decubitus Views | NurseNest",
    meta_description: "Master chest x-ray positioning including PA, lateral, AP, and decubitus projections. Evaluation criteria, common errors, and ARRT exam tips for radiography students.",
    intro_html: `<p>Chest radiography is the most frequently performed radiographic examination and a major focus of the ARRT certification exam. Mastering proper chest positioning, technique, and evaluation criteria is essential for every radiologic technologist.</p>`,
    content_html: `<h2>PA Chest Radiograph</h2><p><strong>Position:</strong> Patient upright, anterior chest against the IR, chin extended. <strong>SID:</strong> 72 inches (reduces cardiac magnification). <strong>Technique:</strong> Full inspiration (10 posterior ribs), high kVp (110-130), scapulae rotated anteriorly out of the lung fields.</p>
<h2>Evaluation Criteria</h2><p><strong>Rotation:</strong> Medial ends of clavicles equidistant from spinous processes. <strong>Inspiration:</strong> 10 posterior ribs above the diaphragm. <strong>Penetration:</strong> Faint thoracic vertebrae visible through the cardiac shadow. <strong>Collimation:</strong> Apices to costophrenic angles included.</p>
<h2>Lateral Chest</h2><p><strong>Standard:</strong> Left side against IR (minimizes cardiac magnification). Arms raised above head. 72-inch SID. Full inspiration. Demonstrates retrosternal and retrocardiac spaces.</p>
<h2>Special Views</h2><p><strong>Lateral decubitus:</strong> Patient lying on side with horizontal beam. Affected side down for effusion (fluid layers), affected side up for pneumothorax (air rises). <strong>AP portable:</strong> Supine/semi-upright, shorter SID (40-48"), magnifies the heart. <strong>Lordotic view:</strong> Demonstrates lung apices free of clavicular superimposition.</p>`,
    faq_json: [
      { q: "Why is a 72-inch SID used for chest radiography?", a: "72-inch SID minimizes magnification of the heart and mediastinal structures. The longer distance produces a more parallel x-ray beam, reducing geometric distortion and providing a more accurate representation of cardiac size for cardiothoracic ratio measurement." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["chest x-ray", "PA chest", "lateral chest", "decubitus", "chest positioning", "ARRT"],
    primary_keyword: "chest xray positioning",
    secondary_keywords: ["PA chest radiograph technique", "lateral decubitus chest", "chest x-ray evaluation criteria", "cardiothoracic ratio"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "abdomen-imaging",
    country: "usa",
    page_type: "cluster",
    topic: "anatomy-positioning",
    subtopic: "abdomen",
    title: "Abdominal Imaging: Positioning, Anatomy & Pathology for Radiography",
    meta_title: "Abdominal X-ray & Imaging Guide – Positioning & Pathology | NurseNest",
    meta_description: "Complete guide to abdominal radiography positioning, normal anatomy, bowel gas patterns, acute abdomen series, and pathological findings. ARRT exam preparation.",
    intro_html: `<p>Abdominal imaging encompasses radiography, fluoroscopy, CT, and ultrasound of the abdominal and pelvic structures. Understanding abdominal positioning, normal anatomy, and pathological findings is critical for radiographic practice and ARRT exam success.</p>`,
    content_html: `<h2>AP Supine Abdomen (KUB)</h2><p><strong>Position:</strong> Patient supine, CR perpendicular to midline at the iliac crest. Include diaphragm to symphysis pubis. <strong>Anatomy demonstrated:</strong> Liver, kidneys, psoas muscles, bowel gas pattern, calcifications, soft tissue outlines.</p>
<h2>Acute Abdominal Series</h2><p><strong>Three-view series:</strong> Supine AP abdomen, upright abdomen (or left lateral decubitus), and upright PA chest. The upright views demonstrate air-fluid levels. The chest view shows free air under the diaphragm.</p>
<h2>Normal Bowel Gas Pattern</h2><p>Small bowel: normally small amount of air, centrally located, valvulae conniventes span full width. Large bowel: air in cecum, ascending, transverse, descending, sigmoid colon. Haustral markings do not span full width. Rectum may contain air or stool.</p>
<h2>Pathological Findings</h2><p><strong>Small bowel obstruction:</strong> Dilated loops (>3 cm), air-fluid levels, decompressed distal colon. <strong>Large bowel obstruction:</strong> Dilated colon (>6 cm, cecum >9 cm), absence of distal gas. <strong>Pneumoperitoneum:</strong> Free air under diaphragm on upright film. <strong>Calcifications:</strong> Renal stones, gallstones, aortic calcification, appendicoliths.</p>`,
    faq_json: [
      { q: "Why do we include an upright chest in an acute abdomen series?", a: "The upright PA chest is the most sensitive radiographic view for detecting free air (pneumoperitoneum) under the diaphragm. Even small amounts of free air from bowel perforation can be seen as a crescent beneath the diaphragm on an upright chest film." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["abdominal imaging", "KUB", "acute abdomen", "bowel obstruction", "pneumoperitoneum", "ARRT"],
    primary_keyword: "abdomen imaging radiography",
    secondary_keywords: ["acute abdomen series", "bowel gas pattern", "abdominal x-ray positioning", "small bowel obstruction xray"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "skull-imaging",
    country: "usa",
    page_type: "cluster",
    topic: "anatomy-positioning",
    subtopic: "skull",
    title: "Skull Imaging: Projections, Anatomy & Positioning for Radiography",
    meta_title: "Skull X-ray Positioning – Towne, Waters & Caldwell Views | NurseNest",
    meta_description: "Master skull radiography projections including Towne, Waters, Caldwell, and lateral views. Complete anatomy guide with positioning criteria for ARRT exam preparation.",
    intro_html: `<p>While CT has largely replaced skull radiography for trauma evaluation, skull projections remain important for ARRT exam preparation and for evaluating sinuses, facial bones, and specific skull pathology. Understanding the standard projections and relevant anatomy is essential.</p>`,
    content_html: `<h2>Lateral Skull</h2><p><strong>Position:</strong> True lateral with interpupillary line perpendicular to IR. <strong>CR:</strong> Perpendicular, 2 inches superior to EAM. Demonstrates: sella turcica, dorsum sellae, anterior clinoids, floor of anterior/middle/posterior cranial fossae, frontal and sphenoid sinuses.</p>
<h2>PA (Caldwell) Projection</h2><p><strong>Position:</strong> Prone or upright, OML perpendicular to IR. <strong>CR:</strong> 15° caudal to nasion. Demonstrates: frontal bone, frontal and ethmoid sinuses, superior orbital ridges, petrous ridges projected into lower third of orbits.</p>
<h2>AP Axial (Towne) Projection</h2><p><strong>CR:</strong> 30° caudal to OML (or 37° to IOML). Demonstrates: occipital bone, foramen magnum, dorsum sellae projected within foramen magnum, petrous ridges.</p>
<h2>Paranasal Sinuses</h2><p><strong>Waters (parietoacanthial):</strong> OML 37° to IR, CR exits at acanthion. Best for maxillary sinuses with petrous ridges below sinus floors. <strong>Key:</strong> Sinuses must be imaged upright to demonstrate air-fluid levels.</p>`,
    faq_json: [
      { q: "Are skull x-rays still performed clinically?", a: "While CT has replaced skull radiography for most trauma evaluation, skull x-rays are still used for: sinus evaluation, shunt series, skeletal surveys for non-accidental trauma in children, and some foreign body localization. The ARRT exam still tests skull positioning knowledge." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["skull imaging", "Towne projection", "Waters view", "Caldwell", "sinuses", "ARRT"],
    primary_keyword: "skull imaging radiography",
    secondary_keywords: ["skull x-ray projections", "Towne projection positioning", "Waters view sinuses", "paranasal sinus radiography"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "spine-imaging",
    country: "usa",
    page_type: "cluster",
    topic: "anatomy-positioning",
    subtopic: "spine",
    title: "Spine Imaging: Cervical, Thoracic & Lumbar Positioning Guide",
    meta_title: "Spine X-ray Positioning – Cervical, Thoracic & Lumbar Guide | NurseNest",
    meta_description: "Complete spine radiography positioning guide covering cervical, thoracic, and lumbar projections. CR angulation, evaluation criteria, and ARRT exam tips.",
    intro_html: `<p>Spine radiography is one of the most commonly performed examinations and a major focus of the ARRT certification exam. Proper positioning requires understanding spinal curvature, CR angulation, and specific evaluation criteria for each spinal region.</p>`,
    content_html: `<h2>Cervical Spine</h2><p><strong>AP:</strong> CR 15-20° cephalic to C4. Opens intervertebral disc spaces. <strong>Lateral:</strong> 72" SID, CR to C4. Must include C1-C7/T1. <strong>Open mouth (odontoid):</strong> CR to center of open mouth. Demonstrates C1-C2 and dens. <strong>Obliques:</strong> 45° rotation, 15-20° cephalic. Demonstrates intervertebral foramina.</p>
<h2>Thoracic Spine</h2><p><strong>AP:</strong> CR perpendicular to T7 (inferior angle of scapula). <strong>Lateral:</strong> Arms raised, breathing technique (long exposure, shallow breathing blurs ribs over vertebrae). <strong>Swimmer's lateral:</strong> Demonstrates C7-T1 when shoulders obscure on standard lateral.</p>
<h2>Lumbar Spine</h2><p><strong>AP:</strong> CR perpendicular to L3 (iliac crest). Knees flexed to reduce lordosis. <strong>Lateral:</strong> True lateral, support under waist. CR to L3. <strong>L5-S1 lateral spot:</strong> CR angled 5-8° caudal to L5-S1 junction. <strong>Obliques:</strong> 45° rotation demonstrates pars interarticularis ("Scotty dog").</p>
<h2>Evaluation Criteria</h2><p>All spine views: proper alignment, open disc spaces, adequate penetration, symmetric appearance (no rotation). Lateral views: endplates clearly delineated, posterior margins of vertebral bodies well demonstrated.</p>`,
    faq_json: [
      { q: "What is the Scotty dog on lumbar oblique views?", a: "The 'Scotty dog' is the appearance of the lumbar vertebrae on 45° oblique views. The eye = pedicle, ear = superior articular process, front leg = inferior articular process, body = lamina, neck = pars interarticularis. A fracture of the neck (pars defect) indicates spondylolysis." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["spine imaging", "cervical spine", "lumbar spine", "thoracic spine", "Scotty dog", "ARRT"],
    primary_keyword: "spine imaging radiography",
    secondary_keywords: ["cervical spine positioning", "lumbar spine x-ray technique", "thoracic spine lateral", "Scotty dog oblique lumbar"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "extremity-positioning",
    country: "usa",
    page_type: "cluster",
    topic: "anatomy-positioning",
    subtopic: "extremities",
    title: "Upper & Lower Extremity Positioning Guide for Radiography",
    meta_title: "Extremity X-ray Positioning – Hands, Wrist, Knee, Ankle & More | NurseNest",
    meta_description: "Complete upper and lower extremity positioning guide for radiography. Hand, wrist, elbow, shoulder, knee, ankle, foot, and hip projections with ARRT exam tips.",
    intro_html: `<p>Extremity radiography is among the most commonly performed examinations in clinical practice. Accurate positioning of the upper and lower extremities requires knowledge of specific projections, CR angles, anatomy demonstrated, and evaluation criteria — all heavily tested on the ARRT exam.</p>`,
    content_html: `<h2>Upper Extremity</h2><p><strong>Hand PA:</strong> Pronated, fingers separated, CR to 3rd MCP joint. <strong>Wrist PA:</strong> Pronated, CR to midcarpal area. <strong>Scaphoid view:</strong> Ulnar deviation + CR angled 10-15° proximally. <strong>Elbow AP:</strong> Arm extended, CR to midpoint of elbow joint. <strong>Elbow lateral:</strong> 90° flexion, lateral surface down. <strong>Shoulder AP:</strong> External rotation (greater tubercle in profile), internal rotation (lesser tubercle in profile).</p>
<h2>Lower Extremity</h2><p><strong>Foot AP:</strong> CR angled 10° toward heel. <strong>Ankle AP:</strong> Leg extended, foot dorsiflexed. <strong>Ankle mortise:</strong> 15-20° internal rotation. <strong>Knee AP:</strong> 15-20° internal rotation, CR 0.5" distal to patella apex. <strong>Knee lateral:</strong> 5-7° cephalic CR, knee flexed 20-30°. <strong>Patella tangential (sunrise):</strong> Knee flexed, beam tangent to patellofemoral joint.</p>
<h2>Hip and Pelvis</h2><p><strong>AP pelvis:</strong> Legs internally rotated 15-20°, CR midway between ASIS and symphysis. <strong>AP hip:</strong> 15-20° internal rotation, CR to femoral neck. <strong>Frog leg lateral:</strong> Knee flexed, thigh abducted 45°. <strong>Cross-table lateral:</strong> Trauma patients — horizontal beam, unaffected leg elevated.</p>
<h2>Common Positioning Errors</h2><p>Rotation (asymmetric joint spaces), incorrect CR angulation (foreshortened anatomy), motion (blurred cortical margins), and insufficient collimation. Always correlate image appearance with known positioning criteria.</p>`,
    faq_json: [
      { q: "Why is internal rotation used for AP knee and pelvis views?", a: "Internal rotation (15-20°) compensates for the natural anteversion of the femur. For the knee, it places the femoral condyles parallel to the IR. For the pelvis/hip, it places the femoral neck in profile, preventing foreshortening." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["extremity positioning", "hand x-ray", "knee positioning", "hip radiography", "ARRT"],
    primary_keyword: "extremity positioning radiography",
    secondary_keywords: ["hand wrist x-ray positioning", "knee ankle foot positioning", "hip pelvis radiography", "upper lower extremity positioning"],
    schema_markup_json: {},
    status: "published",
  },
  {
    slug: "cross-sectional-anatomy",
    country: "usa",
    page_type: "cluster",
    topic: "anatomy-positioning",
    subtopic: "cross-sectional",
    title: "Cross-Sectional Anatomy for CT & MRI: Essential Guide for Radiography",
    meta_title: "Cross-Sectional Anatomy for CT & MRI – Study Guide | NurseNest ARRT Prep",
    meta_description: "Learn essential cross-sectional anatomy for CT and MRI interpretation. Key landmarks from head to pelvis with clinical correlations for ARRT exam preparation.",
    intro_html: `<p>Cross-sectional anatomy knowledge is increasingly important for radiologic technologists as CT and MRI become integral to diagnostic imaging. Understanding axial anatomy at key levels is tested on the ARRT exam and essential for clinical practice.</p>`,
    content_html: `<h2>Head/Brain</h2><p>Key structures at standard axial levels: lateral ventricles, thalamus, internal capsule, caudate nucleus, lentiform nucleus, falx cerebri, sylvian fissure, and the circle of Willis. Posterior fossa: cerebellum, brainstem, fourth ventricle.</p>
<h2>Thorax</h2><p><strong>Great vessels level:</strong> Aortic arch, SVC, trachea, esophagus. <strong>Carina level (T4-T5):</strong> Tracheal bifurcation into main bronchi, aortic arch/descending aorta. <strong>Heart level:</strong> Four chambers, ascending/descending aorta, pulmonary arteries/veins.</p>
<h2>Abdomen</h2><p><strong>Upper abdomen:</strong> Liver (right), stomach and spleen (left), pancreas (anterior to aorta/IVC), kidneys (retroperitoneal). <strong>Mid-abdomen:</strong> Small bowel (jejunum/ileum), ascending/descending colon, aorta/IVC, psoas muscles. <strong>Pelvis:</strong> Bladder (anterior), uterus/prostate, rectum (posterior), iliac vessels.</p>
<h2>Key Landmarks</h2><p><strong>Vertebral levels:</strong> Sternal notch = T2-T3, carina = T4-T5, xiphoid = T10, umbilicus = L3-L4, iliac crest = L4-L5, ASIS = S1-S2. These landmarks help identify anatomy on cross-sectional images.</p>`,
    faq_json: [
      { q: "How much cross-sectional anatomy is on the ARRT exam?", a: "The ARRT radiography exam includes cross-sectional anatomy within its Image Production and Procedures content areas. Expect questions about identifying key structures on CT images, understanding axial anatomy at standard levels, and correlating cross-sectional with projection anatomy." },
    ],
    internal_links_json: standardLinks,
    cta_json: standardCta,
    sample_questions_json: [],
    tags: ["cross-sectional anatomy", "CT anatomy", "MRI anatomy", "axial anatomy", "ARRT"],
    primary_keyword: "cross sectional anatomy radiology",
    secondary_keywords: ["CT axial anatomy", "MRI cross sectional anatomy", "thorax abdomen pelvis anatomy", "cross sectional anatomy landmarks"],
    schema_markup_json: {},
    status: "published",
  },
];

// ===== BLOG ARTICLES (3) =====
const blogArticles: BlogArticle[] = [
  {
    slug: "how-to-pass-arrt-exam",
    country: "usa",
    article_type: "guide",
    category: "exam-prep",
    title: "How to Pass the ARRT Exam on Your First Attempt: Complete Study Guide",
    meta_title: "How to Pass the ARRT Exam – Study Plan, Tips & Strategies | NurseNest",
    meta_description: "Proven strategies to pass the ARRT radiography certification exam on your first attempt. Study schedule, content breakdown, practice question strategies, and test-day tips.",
    summary: "A comprehensive guide covering ARRT exam structure, content domains, study planning, practice question strategies, and test-day preparation for radiography certification.",
    content_html: `<h2>Understanding the ARRT Exam</h2><p>The ARRT radiography certification exam consists of 200 scored multiple-choice questions (plus 20 pilot questions) covering five content areas: Patient Care and Education (22%), Safety (21%), Image Production (28%), Procedures (27%), and Equipment Operation and Quality Control (2%). You have 3.5 hours to complete the exam, and a score of approximately 75% is needed to pass.</p>
<h2>Create a Study Schedule</h2><p>Begin studying at least 8-12 weeks before your exam date. Divide your study time proportionally based on content weighting: spend the most time on Image Production (28%) and Procedures (27%). Create daily study blocks of 2-3 hours with specific topic focus. Include practice questions every session.</p>
<h2>Master the High-Yield Topics</h2><p>Focus on topics that appear most frequently: <strong>Image Production:</strong> Technical factor manipulation (kVp, mAs, SID effects), digital imaging concepts, exposure indicators. <strong>Procedures:</strong> Positioning of all body parts, anatomy identification, CR angles. <strong>Safety:</strong> Dose limits, ALARA, cardinal principles, biological effects. <strong>Patient Care:</strong> Contrast reactions, vital signs, patient communication, infection control.</p>
<h2>Practice Question Strategy</h2><p>Complete at least 1,500-2,000 practice questions before the exam. After answering, read every rationale — even for questions you got right. Track your weak areas and dedicate extra study time to those topics. Simulate exam conditions with timed practice tests.</p>
<h2>Test Day Tips</h2><p>Get adequate sleep the night before. Arrive early. Read each question carefully — pay attention to qualifying words like "most," "best," "first," "except," and "not." Eliminate obviously wrong answers first. Don't change answers unless you have a clear reason. Use the full time allotted — review flagged questions.</p>
<h2>Common Reasons Students Fail</h2><p>Insufficient practice questions, neglecting weaker content areas, not understanding rationales, poor time management during the exam, and test anxiety. Address each of these with targeted preparation.</p>`,
    tags: ["ARRT exam", "exam prep", "study guide", "radiography certification", "test strategies"],
    primary_keyword: "how to pass arrt exam",
    secondary_keywords: ["ARRT exam study guide", "ARRT exam tips", "radiography certification exam prep", "ARRT pass rate"],
    related_seo_page_slugs: ["x-ray-vs-ct-vs-mri", "how-x-rays-work", "alara-principle", "radiation-dose-explained"],
    related_article_slugs: ["top-50-radiology-questions", "common-imaging-mistakes"],
    schema_markup_json: { "@context": "https://schema.org", "@type": "Article", headline: "How to Pass the ARRT Exam on Your First Attempt", author: { "@type": "Organization", name: "NurseNest" } },
    read_time_minutes: 12,
    status: "published",
  },
  {
    slug: "top-50-radiology-questions",
    country: "usa",
    article_type: "listicle",
    category: "practice-questions",
    title: "Top 50 Radiology Questions Every ARRT Student Must Know",
    meta_title: "Top 50 ARRT Radiology Questions – Must-Know Exam Questions | NurseNest",
    meta_description: "The 50 most important radiology questions for ARRT exam preparation. Covers physics, positioning, safety, patient care, and image quality with detailed rationales.",
    summary: "A curated list of the 50 most frequently tested radiology concepts presented as practice questions with detailed rationales, covering all five ARRT content areas.",
    content_html: `<h2>Why These 50 Questions Matter</h2><p>After analyzing thousands of ARRT exam practice sessions, we've identified the 50 most commonly tested concepts. These questions represent the core knowledge every radiography student must master before sitting for certification. Each question includes a detailed rationale explaining not just the correct answer, but why the other options are wrong.</p>
<h2>Radiation Physics (10 Questions)</h2><p><strong>1. What type of radiation accounts for 80-90% of the useful x-ray beam?</strong> Bremsstrahlung radiation. Produced when electrons are decelerated in the nuclear field of target atoms.</p><p><strong>2. What effect does increasing kVp have on the x-ray beam?</strong> Increases beam energy/penetrating ability, shifts spectrum toward higher energies, increases the proportion of Compton interactions, and reduces subject contrast.</p><p><strong>3. How does the inverse square law affect radiation intensity?</strong> Intensity varies inversely with the square of the distance. Double the distance = 1/4 intensity.</p><p><strong>4. What is the photoelectric effect?</strong> Complete absorption of a photon by an inner shell electron. Produces no scatter. Preferred for image contrast. Probability increases with higher Z and lower kVp.</p><p><strong>5. What determines beam quantity?</strong> mAs (milliampere-seconds). Doubling mAs doubles the number of x-ray photons without changing beam energy.</p>
<h2>Image Quality & Production (10 Questions)</h2><p><strong>6. What is the primary factor controlling image density in analog systems?</strong> mAs controls radiographic density. In digital systems, mAs controls the signal-to-noise ratio.</p><p><strong>7. What does the exposure indicator tell you?</strong> It reflects the amount of radiation reaching the detector. A positive deviation index indicates overexposure.</p><p><strong>8. How does SID affect the image?</strong> Increasing SID decreases magnification, improves spatial resolution, but requires increased mAs (inverse square law).</p><p><strong>9. What causes quantum mottle?</strong> Insufficient x-ray photons reaching the detector. Appears as a grainy/speckled image. Corrected by increasing mAs.</p><p><strong>10. How do grids improve image quality?</strong> Grids absorb scatter radiation before it reaches the detector, improving image contrast especially for thick body parts.</p>
<h2>Positioning & Procedures (15 Questions)</h2><p><strong>11-15.</strong> Chest, abdomen, cervical spine, lumbar spine, and extremity positioning — see our detailed positioning guides for each body region.</p><p><strong>16-25.</strong> Special procedures, fluoroscopic studies, and CT protocols — key techniques and positioning requirements for each examination type.</p>
<h2>Radiation Safety (10 Questions)</h2><p><strong>26. What is the annual occupational dose limit?</strong> 50 mSv (5 rem) whole body effective dose. Cumulative: 10 mSv × age.</p><p><strong>27. What are the three cardinal principles of radiation protection?</strong> Time, distance, and shielding.</p><p><strong>28. What is ALARA?</strong> As Low As Reasonably Achievable — the guiding principle that all exposures should be minimized while maintaining diagnostic image quality.</p>
<h2>Patient Care (5 Questions)</h2><p><strong>46. What should you verify before performing any radiographic exam?</strong> Patient identity (two identifiers), ordered examination, clinical indication, pregnancy status, and allergies.</p><p><strong>47-50.</strong> Contrast reaction management, emergency response, infection control, and patient communication.</p>
<h2>Start Practicing Now</h2><p>These 50 concepts represent the foundation of ARRT exam knowledge. For full practice with hundreds more questions and detailed rationales, try our free medical imaging practice exam simulator.</p>`,
    tags: ["ARRT questions", "radiology practice questions", "exam prep", "top questions", "radiography certification"],
    primary_keyword: "top radiology questions arrt",
    secondary_keywords: ["ARRT practice questions", "most common radiology exam questions", "radiography certification questions", "radiology physics questions"],
    related_seo_page_slugs: ["how-x-rays-work", "alara-principle", "chest-xray-positioning", "imaging-artifacts-explained"],
    related_article_slugs: ["how-to-pass-arrt-exam", "common-imaging-mistakes"],
    schema_markup_json: { "@context": "https://schema.org", "@type": "Article", headline: "Top 50 Radiology Questions Every ARRT Student Must Know", author: { "@type": "Organization", name: "NurseNest" } },
    read_time_minutes: 18,
    status: "published",
  },
  {
    slug: "common-imaging-mistakes",
    country: "usa",
    article_type: "guide",
    category: "clinical-tips",
    title: "10 Common Imaging Mistakes New Radiography Technologists Make (And How to Avoid Them)",
    meta_title: "Common Imaging Mistakes – Top Errors New Rad Techs Make | NurseNest",
    meta_description: "Avoid the 10 most common mistakes new radiography technologists make. Learn about positioning errors, dose management, patient communication, and quality improvement.",
    summary: "Identifies the 10 most common mistakes made by new radiologic technologists and provides actionable strategies to avoid each one, improving image quality and patient safety.",
    content_html: `<h2>Mistake #1: Not Verifying Patient Identity</h2><p>Always use two patient identifiers (name and DOB/MRN) before every examination. Wrong-patient imaging is a serious safety event. Verify the exam order matches the patient and clinical indication.</p>
<h2>Mistake #2: Inadequate Collimation</h2><p>Collimation is the single most effective patient protection technique. Tight collimation reduces dose, reduces scatter (improving contrast), and demonstrates professional practice. Always collimate to the area of clinical interest.</p>
<h2>Mistake #3: Ignoring Exposure Indicators</h2><p>Digital systems can produce acceptable-looking images even when significantly overexposed. This leads to "dose creep" — gradually increasing patient dose over time. Monitor your exposure indicators after every exam. A positive deviation index means you used more radiation than needed.</p>
<h2>Mistake #4: Poor Patient Communication</h2><p>Clear, age-appropriate communication reduces anxiety, improves cooperation, and decreases repeat rates. Explain what you'll do before touching the patient. Give breathing instructions before exposure. Confirm the patient is comfortable and ready.</p>
<h2>Mistake #5: Incorrect Marker Placement</h2><p>Anatomical markers (R/L) must be placed on the image receptor before exposure, never added digitally afterward. Wrong-side markers can lead to surgical errors. Always verify laterality with the exam order and place markers correctly.</p>
<h2>Mistake #6: Not Checking for Pregnancy</h2><p>Every female patient of childbearing age should be asked about the possibility of pregnancy before any radiographic examination. Follow your facility's pregnancy screening protocol. If pregnant, consult with the ordering physician about necessity and alternatives.</p>
<h2>Mistake #7: Skipping Shielding When Appropriate</h2><p>Gonadal shielding should be used when the gonads are within 5 cm of the primary beam and shielding won't obscure relevant anatomy. Thyroid shields during fluoroscopy and CT of the head/neck are also important.</p>
<h2>Mistake #8: Not Adjusting Technique for Patient Size</h2><p>One-size-fits-all technique does not work. Pediatric patients need child-sized techniques. Obese patients need increased factors. Use AEC when available, and manually adjust when it's not. Technique charts should account for patient size.</p>
<h2>Mistake #9: Rushing Through Positioning</h2><p>Taking an extra 30 seconds to verify positioning saves the 5+ minutes needed for a repeat. Use anatomical landmarks, palpate body structures, and mentally review evaluation criteria before making the exposure.</p>
<h2>Mistake #10: Not Learning from Repeat Images</h2><p>Every repeat is a learning opportunity. Analyze why the image was rejected, identify the root cause, and adjust your technique. Participate in your department's reject analysis program. Experienced technologists have repeat rates below 2%.</p>`,
    tags: ["imaging mistakes", "new radiographer", "quality improvement", "patient safety", "clinical tips"],
    primary_keyword: "common imaging mistakes radiography",
    secondary_keywords: ["new radiographer mistakes", "radiography quality improvement", "dose creep prevention", "positioning errors radiography"],
    related_seo_page_slugs: ["alara-principle", "radiation-protection-techniques", "chest-xray-positioning", "imaging-artifacts-explained"],
    related_article_slugs: ["how-to-pass-arrt-exam", "top-50-radiology-questions"],
    schema_markup_json: { "@context": "https://schema.org", "@type": "Article", headline: "10 Common Imaging Mistakes New Radiography Technologists Make", author: { "@type": "Organization", name: "NurseNest" } },
    read_time_minutes: 10,
    status: "published",
  },
];

const allSeoPages = [...imagingBasicsCluster, ...radiationSafetyCluster, ...anatomyPositioningCluster];

export async function seedImagingSeoContent() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS imaging_seo_pages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        country TEXT NOT NULL,
        page_type TEXT NOT NULL,
        topic TEXT,
        subtopic TEXT,
        exam_type TEXT,
        title TEXT NOT NULL,
        meta_title TEXT,
        meta_description TEXT,
        intro_html TEXT,
        content_html TEXT,
        faq_json JSONB DEFAULT '[]'::jsonb,
        internal_links_json JSONB DEFAULT '[]'::jsonb,
        cta_json JSONB DEFAULT '{}'::jsonb,
        sample_questions_json JSONB DEFAULT '[]'::jsonb,
        tags TEXT[] DEFAULT '{}'::text[],
        primary_keyword TEXT,
        secondary_keywords TEXT[] DEFAULT '{}'::text[],
        schema_markup_json JSONB,
        status TEXT DEFAULT 'draft',
        published_at TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_reviewed_at TIMESTAMP,
        next_review_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    let pagesInserted = 0;
    for (const page of allSeoPages) {
      const existing = await client.query("SELECT id FROM imaging_seo_pages WHERE slug = $1", [page.slug]);
      if (existing.rows.length > 0) {
        console.log(`  [skip] SEO page already exists: ${page.slug}`);
        continue;
      }

      const schemaMarkup = Object.keys(page.schema_markup_json).length > 0
        ? JSON.stringify(page.schema_markup_json)
        : JSON.stringify(makeSchemaMarkup(page.title, page.meta_description, page.slug, page.faq_json, page.country));

      await client.query(
        `INSERT INTO imaging_seo_pages (id, slug, country, page_type, topic, subtopic, title, meta_title, meta_description, intro_html, content_html, faq_json, internal_links_json, cta_json, sample_questions_json, tags, primary_keyword, secondary_keywords, schema_markup_json, status, published_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())`,
        [
          page.slug, page.country, page.page_type, page.topic, page.subtopic || null,
          page.title, page.meta_title, page.meta_description, page.intro_html, page.content_html,
          JSON.stringify(page.faq_json), JSON.stringify(page.internal_links_json),
          JSON.stringify(page.cta_json), JSON.stringify(page.sample_questions_json),
          page.tags, page.primary_keyword, page.secondary_keywords,
          schemaMarkup, page.status,
        ]
      );
      pagesInserted++;
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS imaging_blog_articles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        country TEXT NOT NULL,
        article_type TEXT NOT NULL,
        category TEXT,
        title TEXT NOT NULL,
        meta_title TEXT,
        meta_description TEXT,
        summary TEXT,
        content_html TEXT,
        tags TEXT[] DEFAULT '{}'::text[],
        primary_keyword TEXT,
        secondary_keywords TEXT[] DEFAULT '{}'::text[],
        related_seo_page_slugs TEXT[] DEFAULT '{}'::text[],
        related_article_slugs TEXT[] DEFAULT '{}'::text[],
        schema_markup_json JSONB,
        read_time_minutes INTEGER DEFAULT 5,
        status TEXT DEFAULT 'draft',
        published_at TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    let articlesInserted = 0;
    for (const article of blogArticles) {
      const existing = await client.query("SELECT id FROM imaging_blog_articles WHERE slug = $1", [article.slug]);
      if (existing.rows.length > 0) {
        console.log(`  [skip] Blog article already exists: ${article.slug}`);
        continue;
      }

      await client.query(
        `INSERT INTO imaging_blog_articles (id, slug, country, article_type, category, title, meta_title, meta_description, summary, content_html, tags, primary_keyword, secondary_keywords, related_seo_page_slugs, related_article_slugs, schema_markup_json, read_time_minutes, status, published_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())`,
        [
          article.slug, article.country, article.article_type, article.category,
          article.title, article.meta_title, article.meta_description,
          article.summary, article.content_html, article.tags,
          article.primary_keyword, article.secondary_keywords,
          article.related_seo_page_slugs, article.related_article_slugs,
          JSON.stringify(article.schema_markup_json), article.read_time_minutes,
          article.status,
        ]
      );
      articlesInserted++;
    }

    await client.query("COMMIT");
    console.log(`[seed-imaging-seo] Inserted ${pagesInserted} SEO pages and ${articlesInserted} blog articles`);
    return { pagesInserted, articlesInserted };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[seed-imaging-seo] Error:", error);
    throw error;
  } finally {
    client.release();
  }
}

const isMain = typeof import.meta !== "undefined" && (import.meta as any).url === `file://${process.argv[1]}`;
if (isMain) {
  seedImagingSeoContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
