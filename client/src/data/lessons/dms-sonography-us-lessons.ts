import type { LessonContent } from "./types";

export const dmsSonographyUsLessons: Record<string, LessonContent> = {
  "sono-ultrasound-physics-spi-us": {
    title: "Ultrasound Physics & SPI Exam Review (ARDMS)",
    cellular: {
      title: "Ultrasound Physics Foundations — ARDMS SPI Alignment",
      content: "Ultrasound uses mechanical longitudinal waves with frequencies between 1 and 20 MHz for diagnostic imaging. The speed of sound in soft tissue averages 1540 m/s, which is the assumed propagation speed used by all ultrasound systems for distance calculations. Wavelength equals propagation speed divided by frequency; higher frequencies produce shorter wavelengths and better axial resolution but reduced penetration. Acoustic impedance (Z) equals tissue density multiplied by sound velocity; impedance mismatches at tissue interfaces create reflections. The intensity reflection coefficient determines the percentage of sound reflected at a boundary. Attenuation in soft tissue averages 0.5 dB/cm/MHz and includes absorption (primary), reflection, scattering, and refraction. The pulse repetition frequency (PRF) determines the maximum imaging depth and the Nyquist limit for Doppler. Spatial pulse length determines axial resolution (SPL/2). Lateral resolution is determined by beam width and is best at the focal zone. The ARDMS Sonography Principles and Instrumentation (SPI) exam tests these physics fundamentals as a prerequisite for all specialty credentials."
    },
    riskFactors: ["Incorrect propagation speed assumption causing range errors in non-soft tissue media", "Frequency selection too low sacrificing resolution or too high losing penetration", "Improper focal zone placement degrading lateral resolution", "Inadequate understanding of attenuation leading to poor image optimization", "Failure to recognize artifacts from physics principles"],
    diagnostics: ["Axial resolution test using tissue-equivalent phantoms", "Lateral resolution assessment at various depths", "Dead zone measurement in near field", "Sensitivity and penetration depth evaluation", "Distance accuracy verification using calibrated targets"],
    management: ["Select highest frequency that provides adequate penetration for the structure of interest", "Place focal zone at depth of primary interest for best lateral resolution", "Adjust overall gain and TGC to compensate for depth-dependent attenuation", "Use harmonic imaging to reduce near-field artifacts and improve contrast resolution", "Optimize PRF to balance frame rate and imaging depth"],
    nursingActions: ["Verify transducer frequency selection matches examination type", "Confirm system calibration before clinical scanning", "Adjust depth and focal zones for each anatomical region", "Document technical parameters when image quality is compromised", "Report equipment malfunctions affecting image quality"],
    signs: ["Propagation speed artifact causing structure misregistration", "Reverberation artifact from strong parallel reflectors", "Mirror image artifact at curved highly reflective surfaces", "Enhancement posterior to fluid-filled structures", "Shadowing posterior to calcified or attenuating structures"],
    medications: [],
    pearls: [
      "ARDMS SPI Pearl: Speed of sound in soft tissue is 1540 m/s — this is the single most tested value on the SPI exam",
      "Axial resolution = SPL/2 — improved by higher frequency and fewer cycles per pulse",
      "Lateral resolution equals beam width — best at the focal zone, worst in the far field",
      "Attenuation rule of thumb: 0.5 dB/cm/MHz — a 5 MHz transducer loses 2.5 dB per cm of depth",
      "The SPI exam accounts for approximately 110 questions covering physics, instrumentation, and artifacts",
      "Nyquist limit = PRF/2 — velocities exceeding this cause aliasing in pulsed-wave Doppler"
    ],
    quiz: [
      { question: "What is the assumed speed of sound in soft tissue used by ultrasound systems?", options: ["1000 m/s", "1450 m/s", "1540 m/s", "1620 m/s"], correct: 2, rationale: "1540 m/s is the standard propagation speed for soft tissue used by all ultrasound scanners for distance and depth calculations." },
      { question: "What determines axial resolution in ultrasound?", options: ["Beam width", "Focal zone depth", "Spatial pulse length divided by 2", "Frame rate"], correct: 2, rationale: "Axial resolution equals SPL/2. Shorter pulses (higher frequency, fewer cycles) improve axial resolution." },
      { question: "Attenuation in soft tissue averages:", options: ["0.1 dB/cm/MHz", "0.5 dB/cm/MHz", "1.0 dB/cm/MHz", "3.0 dB/cm/MHz"], correct: 1, rationale: "The standard attenuation coefficient for soft tissue is 0.5 dB/cm/MHz." },
      { question: "What happens when the Doppler frequency shift exceeds the Nyquist limit?", options: ["Signal is amplified", "Aliasing occurs", "Penetration increases", "Resolution improves"], correct: 1, rationale: "When the Doppler shift exceeds PRF/2 (Nyquist limit), aliasing occurs — the waveform wraps around to the opposite side of the baseline." }
    ]
  },

  "sono-abdominal-sonography-us": {
    title: "Abdominal Sonography — ARDMS RDMS (AB) Exam Prep",
    cellular: {
      title: "Abdominal Sonography Fundamentals — ARDMS Abdomen Specialty",
      content: "Abdominal sonography evaluates the liver, gallbladder, biliary system, pancreas, spleen, kidneys, aorta, and IVC. The ARDMS RDMS Abdomen (AB) specialty credential tests comprehensive knowledge of abdominal organ anatomy, pathology, and scanning protocols. The liver is evaluated using subcostal and intercostal approaches with curvilinear 2-5 MHz transducers. Normal liver echogenicity is equal to or slightly greater than the right kidney. The gallbladder is assessed in the fasting state for wall thickness (normal less than 3 mm), stones (echogenic foci with posterior acoustic shadowing), and sludge. The common bile duct is measured at the porta hepatis (normal less than 6 mm, or up to 1 mm per decade over 60). The pancreas is anterior to the splenic vein and IVC; normal echogenicity is equal to or greater than the liver. The spleen is measured in its longest axis (normal less than 13 cm). Kidneys are measured in three dimensions with normal adult length 9-12 cm. Renal cortical echogenicity should be less than or equal to the liver. The abdominal aorta is measured from outer wall to outer wall (normal less than 3 cm; aneurysm at 3 cm or greater). Survey technique requires systematic sweeps in longitudinal and transverse planes through each organ."
    },
    riskFactors: ["Patient non-fasting obscuring gallbladder pathology", "Bowel gas obscuring pancreas visualization", "Body habitus limiting penetration and image quality", "Overlooking subtle liver lesions on suboptimal images", "Failure to measure CBD causing missed biliary obstruction", "Incomplete renal survey missing small masses or stones"],
    diagnostics: ["Hepatic parenchymal assessment with comparison to renal cortex", "Gallbladder evaluation for stones, wall thickening, and pericholecystic fluid", "CBD measurement at porta hepatis with intrahepatic duct assessment", "Pancreatic visualization with body and tail measurement", "Bilateral kidney length, cortical thickness, and hydronephrosis grading", "Aortic diameter measurement from outer wall to outer wall"],
    management: ["Patient fasts 8-12 hours before gallbladder examination", "Use left lateral decubitus position to shift gallstones and confirm mobility", "Employ graded compression to displace bowel gas overlying pancreas", "Measure kidneys in longest axis from sagittal approach", "Evaluate for free fluid in Morison pouch and spleno-renal recess", "Use color Doppler to confirm vascular anatomy and assess flow"],
    nursingActions: ["Verify patient fasting status before abdominal examination", "Select appropriate transducer frequency for body habitus", "Document all measurements according to laboratory protocol", "Communicate critical findings such as AAA or free fluid immediately", "Provide preliminary observations to supervising physician"],
    signs: ["Echogenic foci with shadowing indicating cholelithiasis", "CBD greater than 6 mm suggesting biliary obstruction", "Hepatomegaly with diffusely increased echogenicity indicating fatty liver", "Hydronephrosis with dilated collecting system", "Aortic diameter exceeding 3 cm indicating aneurysm", "Spleen greater than 13 cm indicating splenomegaly"],
    medications: [],
    pearls: [
      "ARDMS AB Pearl: Cholelithiasis triad = echogenic focus + posterior shadowing + gravity-dependent movement",
      "Murphy sign (sonographic) = focal tenderness under the transducer over the gallbladder during compression",
      "CBD measurement: up to 6 mm normal; add 1 mm per decade after age 60; post-cholecystectomy may be up to 10 mm",
      "Liver echogenicity comparison: normal liver ≥ kidney cortex; fatty liver >> kidney cortex",
      "Renal length less than 9 cm in adults suggests chronic kidney disease",
      "Always scan the aorta from xiphoid to bifurcation — AAA rupture is a surgical emergency"
    ],
    quiz: [
      { question: "What is the normal upper limit for common bile duct diameter?", options: ["3 mm", "4 mm", "6 mm", "10 mm"], correct: 2, rationale: "Normal CBD measures up to 6 mm. Dilation suggests biliary obstruction." },
      { question: "What sonographic finding confirms cholelithiasis?", options: ["Anechoic cyst", "Echogenic focus with posterior acoustic shadowing", "Diffuse wall thickening", "Pericholecystic fluid alone"], correct: 1, rationale: "Gallstones appear as echogenic foci with clean posterior acoustic shadowing and are gravity-dependent." },
      { question: "At what diameter is an abdominal aorta considered aneurysmal?", options: ["2 cm", "2.5 cm", "3 cm", "4 cm"], correct: 2, rationale: "An abdominal aortic aneurysm is defined as a diameter of 3 cm or greater." },
      { question: "Normal adult kidney length is:", options: ["5-7 cm", "7-9 cm", "9-12 cm", "12-15 cm"], correct: 2, rationale: "Normal adult kidney length is 9-12 cm measured in the longest sagittal axis." }
    ]
  },

  "sono-obstetric-sonography-us": {
    title: "Obstetric Sonography — ARDMS RDMS (OB/GYN) Exam Prep",
    cellular: {
      title: "Obstetric Sonography — ARDMS OB/GYN Specialty Alignment",
      content: "Obstetric sonography is divided into first trimester (dating, viability, nuchal translucency) and second/third trimester (anatomy survey, biometry, growth assessment). First trimester landmarks: gestational sac visible at 5 weeks (β-hCG discriminatory level 1500-2000 mIU/mL transvaginal), yolk sac by 5.5 weeks, embryo with cardiac activity by 6 weeks. Crown-rump length (CRL) is the most accurate dating parameter in the first trimester (±5 days). Nuchal translucency (NT) is measured at 11-14 weeks for aneuploidy screening (normal less than 3 mm). The second trimester anatomy survey follows AIUM guidelines: head (BPD, HC, cerebellum, cisterna magna, lateral ventricles), face (lip, profile), spine, heart (four-chamber view, outflow tracts), abdomen (AC, stomach, kidneys, bladder, cord insertion), extremities (FL, hands, feet). Biometric measurements for growth assessment: BPD, HC, AC, FL. Estimated fetal weight is calculated using Hadlock formula. Amniotic fluid is assessed by single deepest pocket (SDP, normal 2-8 cm) or amniotic fluid index (AFI, normal 5-24 cm). Placental location, cord insertion, and cervical length are documented. The ARDMS RDMS OB/GYN credential tests both obstetric and gynecologic content."
    },
    riskFactors: ["Incorrect dating leading to inappropriate management decisions", "Missed fetal anomalies from incomplete anatomy survey", "Failure to identify placenta previa or vasa previa", "Undiagnosed intrauterine growth restriction", "Missed ectopic pregnancy in early first trimester", "Inadequate cervical length assessment in high-risk patients"],
    diagnostics: ["Crown-rump length measurement for first trimester dating", "Nuchal translucency measurement at 11-14 weeks", "Standard fetal anatomy survey at 18-22 weeks", "Biometric measurements: BPD, HC, AC, FL for growth assessment", "Amniotic fluid assessment by SDP or AFI", "Cervical length measurement by transvaginal approach"],
    management: ["Use CRL for dating in first trimester; do not change dates if difference less than 7 days from LMP", "Follow AIUM practice parameters for standard obstetric examination", "Measure BPD from outer table to inner table of skull", "Measure HC at the level of thalami and cavum septi pellucidi", "Measure AC at the level of the stomach, umbilical vein, and portal sinus", "Assess placental position relative to internal cervical os"],
    nursingActions: ["Confirm patient identity and gestational age before examination", "Select appropriate transducer for trimester and approach", "Document all required measurements per protocol", "Evaluate fetal heart rate and rhythm", "Assess placenta, cord, and amniotic fluid", "Communicate significant findings to ordering provider"],
    signs: ["Empty gestational sac above discriminatory level suggesting nonviable pregnancy", "CRL without cardiac activity indicating embryonic demise", "NT greater than 3 mm increasing aneuploidy risk", "AFI less than 5 cm indicating oligohydramnios", "AFI greater than 24 cm indicating polyhydramnios", "Placental edge covering internal os indicating placenta previa"],
    medications: [],
    pearls: [
      "ARDMS OB Pearl: CRL is the gold standard for first trimester dating — accurate to ±5 days",
      "Nuchal translucency must be measured between 11 weeks 0 days and 13 weeks 6 days with CRL 45-84 mm",
      "BPD measurement: outer-to-inner table at the level of thalami and cavum septi pellucidi",
      "AC is the single most sensitive biometric parameter for detecting IUGR",
      "Hadlock formula using BPD, HC, AC, and FL is the most accurate EFW calculation",
      "Cervical length less than 25 mm before 24 weeks increases preterm delivery risk"
    ],
    quiz: [
      { question: "What is the most accurate dating parameter in the first trimester?", options: ["Gestational sac diameter", "Crown-rump length", "Biparietal diameter", "Femur length"], correct: 1, rationale: "CRL is the most accurate first trimester dating parameter with ±5 days accuracy." },
      { question: "At what level is the abdominal circumference measured?", options: ["Kidneys", "Stomach, umbilical vein, and portal sinus", "Bladder", "Iliac crests"], correct: 1, rationale: "AC is measured at the level of the stomach, intrahepatic umbilical vein, and portal sinus." },
      { question: "What AFI value indicates oligohydramnios?", options: ["Less than 5 cm", "Less than 10 cm", "Less than 15 cm", "Less than 20 cm"], correct: 0, rationale: "AFI less than 5 cm defines oligohydramnios. Normal AFI is 5-24 cm." },
      { question: "When is the standard fetal anatomy survey typically performed?", options: ["8-10 weeks", "14-16 weeks", "18-22 weeks", "28-32 weeks"], correct: 2, rationale: "The standard anatomy survey is performed at 18-22 weeks when fetal structures are optimally visualized." }
    ]
  },

  "sono-gynecologic-sonography-us": {
    title: "Gynecologic Sonography — ARDMS RDMS (OB/GYN) Exam Prep",
    cellular: {
      title: "Gynecologic Sonography — ARDMS OB/GYN Specialty",
      content: "Gynecologic sonography evaluates the uterus, endometrium, ovaries, and adnexa using both transabdominal and endovaginal approaches. The uterus is measured in three planes: length (6-10 cm nulliparous, up to 12 cm multiparous), AP diameter, and width. The endometrium is measured in the sagittal plane from the echogenic interface of opposite walls (double-layer thickness). Normal endometrial thickness varies with menstrual cycle phase: proliferative (4-8 mm), secretory (8-14 mm), and postmenopausal (less than 5 mm without HRT, less than 8 mm with HRT). Endometrial thickness greater than 5 mm in a postmenopausal patient with bleeding requires further evaluation to exclude endometrial carcinoma. The myometrium is evaluated for fibroids (leiomyomas), classified by location: intramural, submucosal, subserosal, and pedunculated. Ovaries are measured in three dimensions with volume calculated using the prolate ellipsoid formula (L × W × H × 0.523). Normal premenopausal ovarian volume is less than 20 mL. Follicular cysts are thin-walled, anechoic, and resolve in 1-2 cycles. Complex ovarian masses require evaluation using the IOTA simple rules or ADNEX model for risk stratification. Ectopic pregnancy risk factors include prior ectopic, PID, IUD use, and tubal surgery."
    },
    riskFactors: ["Postmenopausal bleeding with thickened endometrium suggesting malignancy", "Complex adnexal masses requiring malignancy exclusion", "Missed ectopic pregnancy causing tubal rupture", "Submucosal fibroids causing menorrhagia and infertility", "Ovarian torsion from large cysts or masses", "Endometrial polyps mimicking hyperplasia"],
    diagnostics: ["Endometrial thickness measurement in sagittal plane", "Uterine dimensions in three planes", "Ovarian volume using prolate ellipsoid formula", "Color Doppler evaluation of adnexal masses", "Saline infusion sonohysterography for intracavitary lesions", "Assessment of cul-de-sac for free fluid"],
    management: ["Perform endovaginal ultrasound for optimal pelvic anatomy visualization", "Measure endometrium from echogenic interface to echogenic interface", "Classify fibroids by location using FIGO classification", "Apply IOTA simple rules for adnexal mass characterization", "Evaluate ovarian masses for solid components, septations, and vascularity", "Correlate findings with menstrual cycle phase and hormone status"],
    nursingActions: ["Have patient present with full bladder for transabdominal approach", "Obtain informed consent for endovaginal examination", "Document endometrial thickness and pattern", "Measure both ovaries with volume calculations", "Evaluate cul-de-sac for free fluid", "Report concerning findings to interpreting physician"],
    signs: ["Thickened endometrium in postmenopausal patient suggesting hyperplasia or malignancy", "Heterogeneous myometrial mass with shadowing indicating fibroid", "Simple cyst with thin walls and posterior enhancement", "Complex mass with solid components and vascularity suggesting malignancy", "Ring of fire sign (peripheral vascularity) in ectopic pregnancy", "Whirlpool sign of ovarian torsion"],
    medications: [],
    pearls: [
      "ARDMS GYN Pearl: Postmenopausal endometrial thickness ≤5 mm has 96% negative predictive value for carcinoma",
      "Endometrial measurement must be double-layer thickness in sagittal plane through the thickest portion",
      "Ovarian volume = L × W × H × 0.523 — volumes above 20 mL in premenopausal women are abnormal",
      "Submucosal fibroids are most likely to cause menorrhagia and infertility",
      "Ectopic pregnancy: always look for adnexal ring sign and free fluid in cul-de-sac",
      "Dermoid cysts (mature teratomas) classically show fat-fluid level, calcification, and hair strands (dermoid mesh)"
    ],
    quiz: [
      { question: "What is the upper limit of normal endometrial thickness in a postmenopausal woman with bleeding?", options: ["3 mm", "5 mm", "8 mm", "10 mm"], correct: 1, rationale: "Endometrial thickness ≤5 mm in postmenopausal patients with bleeding has a 96% negative predictive value for endometrial carcinoma." },
      { question: "Which fibroid location is most associated with infertility?", options: ["Subserosal", "Intramural", "Submucosal", "Pedunculated"], correct: 2, rationale: "Submucosal fibroids distort the endometrial cavity and are most associated with menorrhagia and infertility." },
      { question: "How is ovarian volume calculated?", options: ["Length × Width", "Length × Width × Height", "L × W × H × 0.523", "π × r²"], correct: 2, rationale: "Ovarian volume uses the prolate ellipsoid formula: L × W × H × 0.523." },
      { question: "What sonographic sign is associated with ectopic pregnancy?", options: ["Snowstorm pattern", "Adnexal ring sign", "Double decidual sign", "Intradecidual sign"], correct: 1, rationale: "The adnexal ring sign (tubal ring) represents an ectopic gestational sac surrounded by echogenic trophoblastic tissue." }
    ]
  },

  "sono-vascular-sonography-us": {
    title: "Vascular Sonography — ARDMS RVT Exam Prep",
    cellular: {
      title: "Vascular Sonography — ARDMS RVT Specialty Alignment",
      content: "Vascular sonography encompasses cerebrovascular (carotid/vertebral), peripheral arterial, peripheral venous, and abdominal vascular examinations. The ARDMS Registered Vascular Technologist (RVT) credential requires passing the VT (Vascular Technology) specialty exam after the SPI. Carotid duplex evaluates the CCA, ICA, ECA, and vertebral arteries for stenosis using B-mode, color Doppler, and spectral analysis. ICA stenosis is classified by peak systolic velocity (PSV) using the Society of Radiologists in Ultrasound (SRU) consensus criteria: less than 125 cm/s = less than 50%, 125-230 cm/s = 50-69%, greater than 230 cm/s = 70% or greater, with ICA/CCA ratio and end-diastolic velocity (EDV) as secondary criteria. Lower extremity venous evaluation for DVT uses compression technique: noncompressibility of the vein is diagnostic. Normal veins completely compress with gentle probe pressure. The DVT study evaluates CFV, SFV (now called FV per updated terminology), popliteal, and calf veins. Lower extremity arterial evaluation uses segmental pressures, ankle-brachial index (ABI), and duplex scanning. Normal ABI is 1.0-1.2; less than 0.9 indicates PAD; less than 0.5 indicates severe ischemia. Venous insufficiency studies use reflux duration after augmentation or Valsalva (abnormal if greater than 0.5 seconds in superficial veins, greater than 1.0 second in deep veins)."
    },
    riskFactors: ["Carotid stenosis leading to stroke or TIA", "Undiagnosed DVT causing pulmonary embolism", "Peripheral arterial disease progressing to critical limb ischemia", "Calcified vessels causing falsely elevated ABI", "Duplicate venous systems with isolated DVT in one channel", "Baker cyst mimicking DVT on clinical examination"],
    diagnostics: ["Carotid duplex with PSV, EDV, and ICA/CCA ratio", "Compression ultrasound for DVT evaluation", "Spectral Doppler waveform analysis (triphasic, biphasic, monophasic)", "ABI and segmental pressure measurements", "Color flow evaluation for stenosis and occlusion", "Venous reflux assessment with augmentation maneuvers"],
    management: ["Apply SRU consensus criteria for ICA stenosis grading", "Use systematic compression from CFV to popliteal vein for DVT", "Measure ABI using highest ankle pressure divided by highest arm pressure", "Evaluate vertebral artery flow direction to detect subclavian steal", "Assess for spectral broadening and post-stenotic turbulence", "Document all velocity measurements at standard sample sites"],
    nursingActions: ["Position patient supine with head turned 45 degrees for carotid examination", "Apply adequate gel and use linear transducer for superficial vessels", "Compress veins with firm gentle pressure perpendicular to vessel", "Measure angles and velocities at standardized locations", "Document waveform morphology at each segment", "Report critical findings immediately"],
    signs: ["ICA PSV greater than 230 cm/s indicating 70%+ stenosis", "Noncompressible vein with intraluminal echoes indicating DVT", "Monophasic waveform indicating proximal stenosis or occlusion", "ABI less than 0.9 indicating peripheral arterial disease", "Retrograde vertebral artery flow indicating subclavian steal", "Venous reflux greater than 0.5 seconds indicating insufficiency"],
    medications: [],
    pearls: [
      "ARDMS RVT Pearl: ICA stenosis criteria — PSV >230 cm/s with EDV >100 cm/s indicates ≥70% stenosis",
      "ICA vs ECA identification: ICA has no branches, larger caliber, and lower-resistance flow (continuous diastolic flow)",
      "DVT diagnosis: noncompressibility is the single most reliable sign — color Doppler alone is insufficient",
      "ABI interpretation: >1.3 suggests calcification (unreliable); 0.9-1.2 normal; <0.5 severe ischemia",
      "Triphasic waveform is normal in lower extremity arteries — loss of reverse component suggests proximal disease",
      "Superficial femoral vein is now called 'femoral vein' to prevent confusion with superficial veins — ARDMS uses updated terminology"
    ],
    quiz: [
      { question: "ICA PSV greater than 230 cm/s indicates what degree of stenosis?", options: ["Less than 50%", "50-69%", "70% or greater", "Near occlusion"], correct: 2, rationale: "Per SRU consensus criteria, PSV >230 cm/s indicates ≥70% ICA stenosis." },
      { question: "What is the most reliable sign of DVT on ultrasound?", options: ["Absent color flow", "Noncompressibility of the vein", "Increased vein diameter", "Absent augmentation"], correct: 1, rationale: "Noncompressibility is the gold standard for DVT diagnosis. Normal veins completely collapse with probe pressure." },
      { question: "An ABI of 0.7 indicates:", options: ["Normal", "Mild PAD", "Moderate PAD", "Severe ischemia"], correct: 2, rationale: "ABI 0.7 indicates moderate PAD. Normal is 1.0-1.2; <0.9 is abnormal; <0.5 is severe ischemia." },
      { question: "How is the ICA distinguished from the ECA on ultrasound?", options: ["ICA is smaller", "ICA has branches in the neck", "ICA has low-resistance continuous diastolic flow and no branches", "ICA is always medial"], correct: 2, rationale: "The ICA has low-resistance flow with continuous diastolic forward flow and no branches in the neck, unlike the ECA." }
    ]
  },

  "sono-small-parts-sonography-us": {
    title: "Small Parts & Superficial Sonography — ARDMS Alignment",
    cellular: {
      title: "Small Parts Sonography — Thyroid, Breast, Scrotum, and Superficial Structures",
      content: "Small parts sonography uses high-frequency linear transducers (7-15 MHz) to evaluate superficial structures including the thyroid, breast, scrotum, and musculoskeletal structures. Thyroid sonography evaluates the gland for nodules, diffuse disease, and lymphadenopathy. Thyroid nodules are classified using the ACR TI-RADS (Thyroid Imaging Reporting and Data System) based on composition, echogenicity, shape, margins, and echogenic foci. TI-RADS assigns points: TR1 (benign) through TR5 (highly suspicious). Fine needle aspiration is recommended based on TI-RADS category and size thresholds. Normal thyroid lobe dimensions: 4-6 cm length, 1.3-1.8 cm AP, 1.5-2.0 cm width. Breast sonography complements mammography for evaluating palpable masses and mammographic findings. The ACR BI-RADS classification system categorizes breast lesions from 0 (incomplete) to 6 (known malignancy). Simple cysts are BI-RADS 2. Solid masses are evaluated for shape, margin, orientation, and echogenicity. Scrotal sonography evaluates for testicular masses, epididymitis, hydrocele, varicocele, and testicular torsion. Absent intratesticular blood flow on color Doppler in the clinical setting of acute pain suggests torsion — a surgical emergency. Normal testicular dimensions: 3-5 cm length, 2-3 cm width."
    },
    riskFactors: ["Thyroid nodule with microcalcifications and taller-than-wide shape suggesting malignancy", "Solid hypoechoic breast mass with irregular margins", "Testicular torsion delay causing irreversible ischemia", "Missed lymphadenopathy in thyroid cancer evaluation", "Failure to classify lesions using standardized reporting systems"],
    diagnostics: ["Thyroid evaluation with ACR TI-RADS classification", "FNA guidance for thyroid nodules meeting size and category criteria", "Breast lesion characterization using BI-RADS", "Scrotal Doppler for testicular perfusion assessment", "Lymph node evaluation in cervical chain for thyroid nodules", "Elastography for tissue stiffness assessment"],
    management: ["Apply ACR TI-RADS scoring system for thyroid nodule management", "Follow BI-RADS classification for breast lesion follow-up recommendations", "Evaluate scrotal pain emergently to exclude torsion", "Compare bilateral testicular blood flow in suspected torsion", "Document nodule characteristics for longitudinal monitoring", "Measure and map all significant findings for follow-up"],
    nursingActions: ["Select high-frequency linear transducer for superficial structures", "Position patient with neck extended for thyroid examination", "Document nodule dimensions, location, and TI-RADS features", "Assess bilateral testicular flow with color Doppler", "Use adequate standoff pad for very superficial structures", "Report emergent findings immediately"],
    signs: ["Hypoechoic thyroid nodule with microcalcifications: TI-RADS 5", "Taller-than-wide thyroid nodule shape suggesting malignancy", "Simple breast cyst: anechoic, well-circumscribed, posterior enhancement", "Absent testicular blood flow in acute pain suggesting torsion", "Enlarged heterogeneous epididymis with hyperemia suggesting epididymitis", "Extratesticular serpiginous structures with Valsalva augmentation indicating varicocele"],
    medications: [],
    pearls: [
      "ARDMS Pearl: ACR TI-RADS scoring determines FNA recommendation — know the point values and size thresholds",
      "Thyroid nodule microcalcifications are the strongest independent predictor of malignancy",
      "BI-RADS 3 (probably benign) requires 6-month follow-up; BI-RADS 4 requires tissue sampling",
      "Testicular torsion: salvage rate >90% if detorsion within 6 hours; <10% after 24 hours",
      "Always compare testicular blood flow bilaterally — unilateral absent flow is diagnostic of torsion",
      "Varicoceles are more common on the left (90%) due to left gonadal vein draining into left renal vein"
    ],
    quiz: [
      { question: "Which TI-RADS feature carries the highest suspicion for thyroid malignancy?", options: ["Isoechogenicity", "Smooth margins", "Microcalcifications", "Spongiform appearance"], correct: 2, rationale: "Microcalcifications (punctate echogenic foci) are the strongest predictor of thyroid malignancy and carry 3 points in TI-RADS." },
      { question: "What is the most emergent finding on scrotal ultrasound?", options: ["Hydrocele", "Varicocele", "Absent intratesticular blood flow", "Epididymal cyst"], correct: 2, rationale: "Absent intratesticular blood flow in the setting of acute pain indicates testicular torsion, a surgical emergency." },
      { question: "What BI-RADS category requires tissue sampling?", options: ["BI-RADS 1", "BI-RADS 2", "BI-RADS 3", "BI-RADS 4"], correct: 3, rationale: "BI-RADS 4 (suspicious) requires tissue sampling. BI-RADS 3 requires 6-month follow-up." },
      { question: "Normal thyroid lobe length in adults is approximately:", options: ["1-2 cm", "2-3 cm", "4-6 cm", "8-10 cm"], correct: 2, rationale: "Normal thyroid lobe length is 4-6 cm, with AP dimension 1.3-1.8 cm and width 1.5-2.0 cm." }
    ]
  },

  "sono-musculoskeletal-ultrasound-us": {
    title: "Musculoskeletal Ultrasound — ARDMS Alignment",
    cellular: {
      title: "Musculoskeletal Ultrasound Techniques and Pathology Recognition",
      content: "Musculoskeletal (MSK) ultrasound uses high-frequency linear transducers (10-18 MHz) for dynamic real-time evaluation of tendons, ligaments, muscles, joints, and nerves. MSK ultrasound advantages include dynamic assessment during motion, contralateral comparison, high spatial resolution, and absence of ionizing radiation. Tendons appear as hyperechoic fibrillar structures on longitudinal images. Anisotropy is a critical artifact in MSK ultrasound: tendons appear falsely hypoechoic when the ultrasound beam is not perpendicular to the tendon fibers. Tendinopathy appears as tendon thickening with hypoechoic areas and loss of normal fibrillar pattern. Complete tendon tears show discontinuity with retraction of torn ends. Partial tears show focal defects or thinning. Rotator cuff evaluation is the most common MSK ultrasound examination, assessing the supraspinatus, infraspinatus, subscapularis, and biceps tendon. Joint effusions appear as anechoic or hypoechoic distension of the joint capsule. Bursitis presents as fluid distension of the bursal space. Peripheral nerve evaluation can identify carpal tunnel syndrome (median nerve cross-sectional area greater than 10 mm² at the wrist), nerve tumors, and entrapment. Guided injections and aspirations are increasingly performed under ultrasound guidance."
    },
    riskFactors: ["Anisotropy artifact mimicking tendon pathology", "Incomplete rotator cuff evaluation missing partial tears", "Dynamic instability not assessed during static examination", "Small foreign bodies missed without systematic technique", "Nerve pathology overlooked without dedicated evaluation protocol"],
    diagnostics: ["Rotator cuff assessment with dynamic maneuvers", "Tendon evaluation in long and short axis", "Joint effusion detection and characterization", "Peripheral nerve cross-sectional area measurement", "Power Doppler for hyperemia assessment in inflammation", "Dynamic scanning for subluxation and impingement"],
    management: ["Scan tendons in both long and short axis planes", "Rock transducer to eliminate anisotropy artifact", "Compare contralateral side for asymmetry detection", "Use dynamic scanning to assess tendon subluxation", "Apply power Doppler to evaluate inflammatory hyperemia", "Perform guided procedures with real-time visualization"],
    nursingActions: ["Select appropriate high-frequency linear transducer", "Position patient optimally for each structure", "Document tendon dimensions and compare to contralateral side", "Perform dynamic maneuvers as indicated", "Assess for power Doppler signal in symptomatic areas", "Guide needle placement for interventional procedures"],
    signs: ["Tendon thickening with hypoechoic areas indicating tendinopathy", "Complete tendon discontinuity with retraction indicating full tear", "Focal defect in tendon substance indicating partial tear", "Anechoic joint capsule distension indicating effusion", "Increased power Doppler signal indicating active inflammation", "Median nerve CSA greater than 10 mm² at wrist indicating carpal tunnel syndrome"],
    medications: [],
    pearls: [
      "ARDMS MSK Pearl: Anisotropy is the most common pitfall — always ensure perpendicular beam-to-tendon alignment",
      "Supraspinatus is the most commonly torn rotator cuff tendon — evaluate at the critical zone (1 cm from insertion)",
      "Dynamic examination is the key advantage of ultrasound over MRI for MSK evaluation",
      "Compare side-to-side: >2 mm difference in tendon thickness is significant",
      "Carpal tunnel: median nerve CSA >10 mm² at the pisiform level is diagnostic",
      "Power Doppler in tendons is always abnormal — normal tendons have no intratendinous vascularity"
    ],
    quiz: [
      { question: "What artifact is most commonly encountered in MSK ultrasound?", options: ["Shadowing", "Enhancement", "Anisotropy", "Reverberation"], correct: 2, rationale: "Anisotropy causes tendons to appear falsely hypoechoic when the beam is not perpendicular to the fibers." },
      { question: "Which rotator cuff tendon is most commonly torn?", options: ["Subscapularis", "Supraspinatus", "Infraspinatus", "Teres minor"], correct: 1, rationale: "The supraspinatus is the most commonly torn rotator cuff tendon, particularly at the critical zone near its insertion." },
      { question: "What median nerve CSA at the wrist suggests carpal tunnel syndrome?", options: ["Greater than 5 mm²", "Greater than 8 mm²", "Greater than 10 mm²", "Greater than 15 mm²"], correct: 2, rationale: "Median nerve CSA >10 mm² at the carpal tunnel inlet is diagnostic of carpal tunnel syndrome." },
      { question: "What does power Doppler signal within a tendon indicate?", options: ["Normal finding", "Active inflammation or neovascularity", "Tendon calcification", "Chronic scarring"], correct: 1, rationale: "Normal tendons have no intratendinous vascularity. Power Doppler signal indicates pathological neovascularity or inflammation." }
    ]
  },

  "sono-neonatal-neurosonography-us": {
    title: "Neonatal Neurosonography — ARDMS Alignment",
    cellular: {
      title: "Neonatal Cranial Ultrasound — Anatomy, Pathology, and Hemorrhage Classification",
      content: "Neonatal neurosonography evaluates the premature and neonatal brain through the open anterior fontanelle using sector or microconvex transducers (5-10 MHz). The examination includes coronal and sagittal sweeps through the anterior fontanelle, with supplemental views through the mastoid fontanelle for posterior fossa assessment. Standard imaging evaluates the cerebral hemispheres, lateral ventricles, third ventricle, corpus callosum, choroid plexus, caudate nucleus, thalami, cerebellum, and cisterna magna. Germinal matrix hemorrhage (GMH) is the most common pathology in premature infants, originating from the fragile capillary bed of the subependymal germinal matrix. The Papile classification grades intraventricular hemorrhage (IVH): Grade I — subependymal hemorrhage (germinal matrix only), Grade II — intraventricular hemorrhage without ventricular dilatation, Grade III — IVH with ventricular dilatation, Grade IV — parenchymal hemorrhage (now termed periventricular hemorrhagic infarction, PVHI). Periventricular leukomalacia (PVL) is white matter injury in the periventricular distribution, appearing initially as increased periventricular echogenicity progressing to cystic changes over 2-4 weeks. Hydrocephalus is assessed by ventricular size measurements, with the ventricular index and anterior horn width being standard metrics. Serial imaging monitors for progressive ventricular dilatation requiring intervention."
    },
    riskFactors: ["Prematurity less than 32 weeks gestation", "Birth weight less than 1500 grams", "Hemodynamic instability in first 72 hours", "Coagulopathy or thrombocytopenia", "Hypoxic-ischemic injury at birth", "Rapid volume expansion or blood pressure fluctuations"],
    diagnostics: ["Coronal views through anterior fontanelle from frontal to occipital", "Sagittal views including midline and parasagittal angles", "Mastoid fontanelle views for posterior fossa assessment", "Doppler evaluation of resistive index in ACA and MCA", "Serial imaging for hemorrhage evolution and hydrocephalus progression", "Ventricular measurements for progressive dilatation assessment"],
    management: ["Perform initial scan within first 7 days of life for at-risk neonates", "Obtain serial studies at 1 week, 2 weeks, 4 weeks, and at term-equivalent age", "Use standard coronal and sagittal protocols through anterior fontanelle", "Supplement with mastoid fontanelle views for posterior fossa evaluation", "Measure ventricular dimensions using standardized reference points", "Correlate echogenicity changes with timing for PVL staging"],
    nursingActions: ["Use small footprint sector or microconvex transducer through fontanelle", "Apply warm gel to avoid hypothermia in premature infants", "Minimize pressure on fontanelle during scanning", "Document all standard views systematically", "Measure and grade any hemorrhage using Papile classification", "Alert neonatology for acute findings requiring intervention"],
    signs: ["Echogenic focus in caudothalamic groove indicating Grade I GMH", "Echogenic material within ventricles indicating Grade II IVH", "Ventricular dilatation with intraventricular echoes indicating Grade III IVH", "Parenchymal echogenicity indicating PVHI (Grade IV)", "Periventricular echogenicity with cyst formation indicating PVL", "Progressive ventricular enlargement indicating posthemorrhagic hydrocephalus"],
    medications: [],
    pearls: [
      "ARDMS Pearl: Germinal matrix hemorrhage occurs in the caudothalamic groove — the most common site for Grade I IVH",
      "Papile Grade IV is now called periventricular hemorrhagic infarction (PVHI) — it is venous infarction, not simple hemorrhage extension",
      "PVL evolves from echogenic phase to cystic phase over 2-4 weeks — early cystic PVL carries worst prognosis",
      "Screening protocol: first scan by day 7, repeat at 2 and 4 weeks, and at term-equivalent age",
      "Resistive index in ACA: normal 0.65-0.85 in neonates; RI >0.85 suggests increased ICP",
      "Choroid plexus echogenicity is normal — do not confuse with Grade II IVH; hemorrhage extends beyond choroid"
    ],
    quiz: [
      { question: "What Papile grade describes IVH with ventricular dilatation?", options: ["Grade I", "Grade II", "Grade III", "Grade IV"], correct: 2, rationale: "Grade III IVH shows intraventricular hemorrhage with associated ventricular dilatation." },
      { question: "Where does germinal matrix hemorrhage originate?", options: ["Choroid plexus", "Caudothalamic groove", "Corpus callosum", "Cerebellum"], correct: 1, rationale: "GMH originates from the fragile capillary bed of the subependymal germinal matrix at the caudothalamic groove." },
      { question: "What is the acoustic window for neonatal cranial ultrasound?", options: ["Temporal bone", "Anterior fontanelle", "Orbital window", "Foramen magnum"], correct: 1, rationale: "The open anterior fontanelle provides the primary acoustic window for neonatal cranial ultrasound." },
      { question: "PVL cystic changes typically develop over what time period?", options: ["24-48 hours", "5-7 days", "2-4 weeks", "3-6 months"], correct: 2, rationale: "PVL progresses from echogenic phase to cystic phase over 2-4 weeks. Cystic PVL carries the worst neurological prognosis." }
    ]
  },

  "sono-doppler-hemodynamics-us": {
    title: "Doppler Principles & Hemodynamics — ARDMS SPI/Specialty Alignment",
    cellular: {
      title: "Doppler Ultrasound Principles and Hemodynamic Assessment",
      content: "Doppler ultrasound detects motion by analyzing the frequency shift between transmitted and received sound waves reflecting from moving red blood cells. The Doppler equation: velocity = (frequency shift × propagation speed) / (2 × transmitted frequency × cos θ). The angle of insonation (theta) must be less than 60 degrees for reliable velocity measurements; errors increase dramatically above 60 degrees. At 0 degrees, maximum frequency shift occurs; at 90 degrees, no shift is detected. Three primary Doppler modes: spectral (pulsed-wave and continuous-wave), color flow, and power Doppler. Pulsed-wave (PW) Doppler samples at a specific depth using a sample gate but is limited by the Nyquist limit (PRF/2); aliasing occurs when the Doppler shift exceeds this limit. Continuous-wave (CW) Doppler measures all velocities along the beam without depth specificity but has no aliasing limit. Color flow Doppler maps mean velocity and direction over a region of interest (BART: Blue Away, Red Toward). Power Doppler displays amplitude without direction or velocity information and is more sensitive to slow flow. Hemodynamic parameters include resistive index (RI = [PSV - EDV] / PSV), pulsatility index (PI = [PSV - EDV] / mean velocity), and systolic/diastolic ratio. Low-resistance organs (brain, kidney, liver) have continuous diastolic flow and low RI; high-resistance beds (resting extremity arteries) have absent or reversed diastolic flow and high RI."
    },
    riskFactors: ["Angle of insonation greater than 60 degrees causing significant velocity errors", "Aliasing from exceeding Nyquist limit in pulsed-wave Doppler", "Color Doppler gain too high creating flash artifact", "Mirror image artifact near strong specular reflectors", "Wall filter set too high eliminating slow diastolic flow", "Incorrect sample volume size or placement"],
    diagnostics: ["Spectral Doppler waveform analysis for flow characterization", "Resistive index calculation for organ perfusion assessment", "Color flow mapping for stenosis and flow direction", "Power Doppler for slow flow detection", "Velocity measurements for stenosis quantification", "Waveform pattern recognition for proximal or distal disease"],
    management: ["Maintain Doppler angle less than 60 degrees for all velocity measurements", "Angle-correct parallel to vessel walls, not flow direction", "Increase PRF or lower frequency to reduce aliasing", "Adjust color Doppler scale to match expected velocities", "Use power Doppler for low-flow states", "Place sample gate in center of vessel for spectral analysis"],
    nursingActions: ["Select appropriate Doppler mode for clinical question", "Document angle of insonation for all velocity measurements", "Optimize spectral gain and wall filters", "Record PSV, EDV, and calculate RI/PI as indicated", "Evaluate waveform morphology for flow disturbances", "Recognize and document aliasing versus true flow reversal"],
    signs: ["Aliasing: color mosaic or spectral wraparound from exceeding Nyquist limit", "Spectral broadening indicating disturbed flow", "Absent diastolic flow indicating high downstream resistance", "Reversed diastolic flow suggesting critical downstream resistance", "Tardus-parvus waveform distal to significant stenosis", "Color bruit artifact adjacent to tight stenosis"],
    medications: [],
    pearls: [
      "ARDMS SPI Pearl: Doppler angle must be <60° — at 60°, the error is already 50%; at 90°, no shift is detected",
      "Nyquist limit = PRF/2 — to eliminate aliasing: increase PRF, lower frequency, increase angle, or use CW",
      "BART: Blue Away, Red Toward — this is relative to the transducer, not the patient",
      "RI = (PSV - EDV) / PSV — normal renal RI is <0.70; elevated RI suggests renal disease or obstruction",
      "Power Doppler detects slower flow than color Doppler but gives no direction or velocity information",
      "Spectral broadening indicates turbulent flow — seen at sites of stenosis and bifurcations"
    ],
    quiz: [
      { question: "What is the maximum recommended Doppler angle for velocity measurements?", options: ["30 degrees", "45 degrees", "60 degrees", "90 degrees"], correct: 2, rationale: "The Doppler angle should be kept below 60 degrees. Above 60 degrees, small angle errors produce large velocity errors." },
      { question: "What causes aliasing in pulsed-wave Doppler?", options: ["Excessive gain", "Frequency shift exceeding PRF/2", "Improper focal zone", "High wall filter"], correct: 1, rationale: "Aliasing occurs when the Doppler frequency shift exceeds the Nyquist limit (PRF/2)." },
      { question: "What does BART stand for in color Doppler?", options: ["Blood Arterial Red Turbulent", "Blue Away Red Toward", "Blue Arterial Red Toward", "Blood Away Red Turbulent"], correct: 1, rationale: "BART: Blue Away, Red Toward — describes flow direction relative to the transducer." },
      { question: "A resistive index of 0.85 in a native kidney suggests:", options: ["Normal perfusion", "Low resistance", "Elevated resistance indicating renal pathology", "Measurement error"], correct: 2, rationale: "Normal renal RI is <0.70. An RI of 0.85 is elevated and suggests renal disease, obstruction, or medical renal disease." }
    ]
  }
};
