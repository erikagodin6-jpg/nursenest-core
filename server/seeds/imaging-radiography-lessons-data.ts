export interface RadiographyLesson {
  title: string;
  slug: string;
  content: string;
  explanation: string;
  category: string;
  country: string;
  examType: string;
  keyConcepts: string[];
  quizItems: { question: string; options: string[]; correctIndex: number; rationale: string }[];
  difficulty: number;
  seoTitle: string;
  seoDescription: string;
}

function arrt(category: string, title: string, slug: string, content: string, explanation: string, keyConcepts: string[], quizItems: { question: string; options: string[]; correctIndex: number; rationale: string }[], difficulty: number, seoTitle: string, seoDescription: string): RadiographyLesson {
  return { title, slug, content, explanation, category, country: "usa", examType: "arrt", keyConcepts, quizItems, difficulty, seoTitle, seoDescription };
}

function camrt(category: string, title: string, slug: string, content: string, explanation: string, keyConcepts: string[], quizItems: { question: string; options: string[]; correctIndex: number; rationale: string }[], difficulty: number, seoTitle: string, seoDescription: string): RadiographyLesson {
  return { title, slug, content, explanation, category, country: "canada", examType: "camrt", keyConcepts, quizItems, difficulty, seoTitle, seoDescription };
}

export function generateRadiographyLessons(): RadiographyLesson[] {
  return [
    // ===== RADIATION SAFETY =====
    arrt("radiation_safety", "ARRT Radiation Safety Standards & NRC Regulations",
      "arrt-radiation-safety-standards",
      "Radiation safety in the United States is regulated by the Nuclear Regulatory Commission (NRC) and individual state radiation control programs. The NRC establishes federal regulations under 10 CFR 20 (Standards for Protection Against Radiation) that set dose limits, monitoring requirements, and safety procedures. Agreement States have authority to regulate radioactive materials under their own programs that must be at least as strict as NRC requirements. Occupational dose limits are: 50 mSv (5 rem) total effective dose equivalent (TEDE) per year, 150 mSv (15 rem) to the lens of the eye, and 500 mSv (50 rem) to skin or extremities. The embryo/fetus limit is 5 mSv (0.5 rem) for the entire gestation. Public dose limit is 1 mSv (100 mrem) per year. The concept of ALARA (As Low As Reasonably Achievable) is a regulatory requirement, not merely a recommendation. Every facility must have a radiation safety officer (RSO) and a radiation safety committee for facilities with broad-scope licenses.",
      "Understanding NRC regulations and state-level radiation safety requirements is essential for ARRT certification. Technologists must know the hierarchy of regulatory authority and specific dose limits in traditional and SI units.",
      ["NRC 10 CFR 20", "TEDE 50 mSv/yr", "ALARA regulatory requirement", "Agreement States", "Radiation Safety Officer", "Public dose 1 mSv/yr", "Embryo/fetus 5 mSv"],
      [
        { question: "What is the annual occupational TEDE limit in the US?", options: ["5 mSv", "10 mSv", "50 mSv", "100 mSv"], correctIndex: 2, rationale: "The NRC sets the annual occupational TEDE limit at 50 mSv (5 rem) per 10 CFR 20." },
        { question: "Which federal agency regulates radiation safety in the US?", options: ["FDA", "OSHA", "NRC", "EPA"], correctIndex: 2, rationale: "The Nuclear Regulatory Commission (NRC) establishes federal radiation protection standards under 10 CFR 20." },
        { question: "What is the annual public dose limit?", options: ["0.5 mSv", "1 mSv", "5 mSv", "50 mSv"], correctIndex: 1, rationale: "The public dose limit is 1 mSv (100 mrem) per year from licensed operations." },
        { question: "ALARA in the US regulatory context is:", options: ["A suggestion", "A regulatory requirement", "Only for nuclear medicine", "Optional for diagnostic radiology"], correctIndex: 1, rationale: "ALARA is a regulatory requirement under NRC regulations, not merely a recommendation." }
      ],
      2, "ARRT Radiation Safety Standards & NRC Regulations | Study Guide",
      "Comprehensive ARRT radiation safety study guide covering NRC regulations, 10 CFR 20, dose limits, ALARA requirements, and Agreement State programs for radiography certification."
    ),

    arrt("radiation_safety", "Personnel Dosimetry & Monitoring (ARRT)",
      "arrt-personnel-dosimetry",
      "Personnel dosimetry is required for any individual likely to receive 10% of the annual dose limit (5 mSv). Monitoring devices include optically stimulated luminescence (OSL) dosimeters, thermoluminescent dosimeters (TLDs), and electronic personal dosimeters. OSL dosimeters (e.g., Luxel) use aluminum oxide crystals that release light proportional to absorbed dose when stimulated by laser. TLDs use lithium fluoride crystals that release light when heated. Film badges are largely obsolete. Dosimeters must be worn at collar level outside the lead apron for single-badge monitoring. Dual-badge monitoring uses one at collar and one under the apron at waist level to calculate effective dose equivalent (EDE). Ring dosimeters monitor extremity dose during fluoroscopy. Dosimeter reports are reviewed monthly and records maintained per NRC requirements. Investigation levels are typically set at doses exceeding expected values for the work performed.",
      "Personnel monitoring ensures compliance with dose limits and identifies potential overexposures. Understanding dosimeter types, placement, and reading interpretation is critical for ARRT exam success.",
      ["OSL dosimeters", "TLD lithium fluoride", "Collar-level placement", "Dual-badge monitoring", "10% trigger for monitoring", "Monthly report review", "Ring dosimeters"],
      [
        { question: "At what percentage of the annual dose limit is personnel monitoring required?", options: ["1%", "5%", "10%", "25%"], correctIndex: 2, rationale: "Personnel monitoring is required when an individual is likely to receive 10% or more of the annual dose limit (5 mSv)." },
        { question: "Where should a single dosimeter be worn?", options: ["Waist inside apron", "Collar level outside apron", "Ankle level", "On the lead apron pocket"], correctIndex: 1, rationale: "For single-badge monitoring, the dosimeter is worn at collar level outside the lead apron." },
        { question: "Which dosimeter material uses laser stimulation?", options: ["Lithium fluoride", "Aluminum oxide", "Silver halide film", "Calcium sulfate"], correctIndex: 1, rationale: "OSL dosimeters use aluminum oxide crystals stimulated by laser light to determine dose." }
      ],
      2, "ARRT Personnel Dosimetry & Radiation Monitoring | Study Guide",
      "Study personnel dosimetry requirements for the ARRT exam including OSL, TLD, badge placement, dual-badge monitoring, and dose record management."
    ),

    arrt("radiation_safety", "Radiation Protection Principles & Shielding (ARRT)",
      "arrt-radiation-protection-shielding",
      "The three cardinal principles of radiation protection are time, distance, and shielding. Minimize time near the radiation source to reduce exposure. The inverse square law governs distance: doubling distance from a point source reduces exposure to one-quarter. Lead shielding attenuates radiation: 0.5 mm Pb lead aprons block 95-99% of scatter at diagnostic energies. Lead gloves provide 0.25 mm Pb equivalent. Thyroid shields are 0.5 mm Pb. Leaded eyewear provides 0.75 mm Pb equivalent for lens protection. Structural shielding in walls uses lead sheets or concrete. Primary barriers protect against the useful beam; secondary barriers protect against scatter and leakage. The controlled area boundary is typically the wall of the X-ray room. Mobile barriers (portable shields) are used during portable radiography. Gonadal shielding is applied when gonads are within 5 cm of the primary beam and shielding will not obscure the anatomy of interest. The ACR revised its position on routine gonadal shielding in 2019, noting that with digital imaging the benefit is minimal and shields may obscure anatomy or trigger repeat exposures.",
      "Practical radiation protection strategies are fundamental to radiographic practice and heavily tested on the ARRT examination.",
      ["Time distance shielding", "Inverse square law", "0.5 mm Pb aprons", "Primary vs secondary barriers", "Gonadal shielding 5 cm rule", "ACR 2019 shielding position", "Controlled area"],
      [
        { question: "If you triple your distance from a radiation source, exposure becomes:", options: ["1/3", "1/6", "1/9", "1/27"], correctIndex: 2, rationale: "Inverse square law: exposure is inversely proportional to the square of the distance. Tripling distance reduces exposure to 1/9." },
        { question: "Standard lead apron thickness for diagnostic radiography is:", options: ["0.25 mm Pb", "0.5 mm Pb", "1.0 mm Pb", "2.0 mm Pb"], correctIndex: 1, rationale: "Standard lead aprons are 0.5 mm Pb equivalent, blocking 95-99% of scatter at diagnostic energies." },
        { question: "Gonadal shielding should be applied when gonads are within what distance of the primary beam?", options: ["2 cm", "5 cm", "10 cm", "15 cm"], correctIndex: 1, rationale: "Gonadal shielding is traditionally applied when the gonads are within 5 cm of the primary beam edge." },
        { question: "What did the ACR's 2019 position note about routine gonadal shielding?", options: ["It should always be used", "Benefits are minimal with digital imaging and shields may obscure anatomy", "It replaces collimation", "Only needed for pediatric patients"], correctIndex: 1, rationale: "The ACR noted that with digital systems, gonadal shielding provides minimal dose reduction and may obscure anatomy or cause repeat exposures." }
      ],
      2, "ARRT Radiation Protection Principles & Shielding | Study Guide",
      "Master radiation protection principles for the ARRT exam: time, distance, shielding, inverse square law, lead apron requirements, and current gonadal shielding guidelines."
    ),

    arrt("radiation_safety", "Radiation Effects & Radiobiology (ARRT)",
      "arrt-radiation-effects-radiobiology",
      "Ionizing radiation damages biological tissues through direct and indirect effects. Direct effects occur when radiation interacts with critical target molecules (DNA). Indirect effects involve radiation interacting with water molecules producing free radicals (hydroxyl radicals) that damage DNA -- this is the dominant mechanism at diagnostic energies. Radiation effects are classified as deterministic (threshold-based, severity increases with dose) or stochastic (probabilistic, no threshold, all-or-nothing). Deterministic effects include skin erythema (2 Gy threshold), epilation (3 Gy), cataracts (2 Gy for acute, 0.5 Gy cumulative), and hematopoietic syndrome. Stochastic effects include cancer induction and genetic/hereditary effects. The linear no-threshold (LNT) model is the regulatory basis for radiation protection, assuming any dose carries some risk. Radiosensitivity follows the Law of Bergonie and Tribondeau: cells that are rapidly dividing, undifferentiated, and with long mitotic futures are most radiosensitive. Most radiosensitive cells: lymphocytes, spermatogonia, erythroblasts. Least sensitive: nerve and muscle cells.",
      "Radiobiology concepts are essential for understanding why radiation protection matters and for ARRT exam success.",
      ["Direct vs indirect effects", "Free radical damage", "Deterministic vs stochastic", "LNT model", "Law of Bergonie & Tribondeau", "Skin erythema 2 Gy", "Lymphocytes most radiosensitive"],
      [
        { question: "The dominant mechanism of radiation damage at diagnostic energies is:", options: ["Direct DNA interaction", "Indirect effect via free radicals", "Thermal heating", "Electromagnetic interference"], correctIndex: 1, rationale: "Indirect effects through free radical production (especially hydroxyl radicals from water radiolysis) dominate at diagnostic energy levels." },
        { question: "Which cells are most radiosensitive?", options: ["Nerve cells", "Muscle cells", "Lymphocytes", "Osteocytes"], correctIndex: 2, rationale: "Lymphocytes are the most radiosensitive cells, consistent with the Law of Bergonie and Tribondeau." },
        { question: "Cancer induction from radiation is classified as a:", options: ["Deterministic effect", "Stochastic effect", "Thermal effect", "Mechanical effect"], correctIndex: 1, rationale: "Cancer is a stochastic effect -- probabilistic, no threshold, severity is independent of dose (it either occurs or does not)." }
      ],
      3, "ARRT Radiation Effects & Radiobiology | Study Guide",
      "Study radiation biology for the ARRT exam: direct and indirect effects, deterministic vs stochastic, LNT model, radiosensitivity, and dose thresholds."
    ),

    camrt("radiation_safety", "CAMRT Radiation Safety Standards & CNSC Regulations",
      "camrt-radiation-safety-standards",
      "Radiation safety in Canada is regulated by the Canadian Nuclear Safety Commission (CNSC) under the Nuclear Safety and Control Act (NSCA). Provincial radiation protection regulations complement federal requirements. The Radiation Protection Regulations (SOR/2000-203) establish dose limits exclusively in SI units: occupational effective dose limit is 50 mSv per one-year dosimetry period and 100 mSv per five-year dosimetry period. The lens of the eye limit is 50 mSv/year (reduced from 150 mSv following ICRP 118 recommendations). Skin dose limit is 500 mSv/year. Pregnant Nuclear Energy Workers (NEWs) are limited to 4 mSv for the balance of pregnancy. Public dose is 1 mSv/year. ALARA is enshrined in Canadian regulations and requires management control, personnel qualification, and dose monitoring. Every licensee must implement a radiation protection program proportionate to the risk. Health Canada's Safety Code 35 provides specific requirements for diagnostic X-ray equipment installation and use.",
      "Understanding CNSC regulations, Canadian dose limits in SI units, and provincial regulatory frameworks is essential for CAMRT certification. Note the five-year cumulative limit unique to Canadian regulations.",
      ["CNSC", "NSCA", "50 mSv/yr occupational", "100 mSv/5 years", "Eye lens 50 mSv", "Pregnant NEW 4 mSv", "Safety Code 35", "ALARA in law"],
      [
        { question: "What is the five-year cumulative occupational dose limit in Canada?", options: ["50 mSv", "100 mSv", "250 mSv", "500 mSv"], correctIndex: 1, rationale: "Canada's Radiation Protection Regulations set a 100 mSv limit over any five-year dosimetry period." },
        { question: "Which organization regulates nuclear and radiation safety in Canada?", options: ["Health Canada", "CNSC", "CAMRT", "CSA Group"], correctIndex: 1, rationale: "The Canadian Nuclear Safety Commission (CNSC) is the federal regulator under the Nuclear Safety and Control Act." },
        { question: "What is the dose limit for a pregnant Nuclear Energy Worker in Canada?", options: ["1 mSv", "4 mSv", "5 mSv", "10 mSv"], correctIndex: 1, rationale: "The dose limit is 4 mSv for the balance of pregnancy for a Nuclear Energy Worker in Canada." },
        { question: "The Canadian occupational lens of the eye dose limit is:", options: ["15 mSv/yr", "50 mSv/yr", "150 mSv/yr", "500 mSv/yr"], correctIndex: 1, rationale: "Canada adopted the ICRP 118 recommendation of 50 mSv/year for the lens of the eye." }
      ],
      2, "CAMRT Radiation Safety Standards & CNSC Regulations | Study Guide",
      "Comprehensive CAMRT radiation safety study guide covering CNSC regulations, Canadian dose limits in SI units, ALARA requirements, and Safety Code 35."
    ),

    camrt("radiation_safety", "Personnel Dosimetry & Monitoring (CAMRT)",
      "camrt-personnel-dosimetry",
      "In Canada, personnel dosimetry is managed through licensed dosimetry services approved by the CNSC. The primary dosimetry service provider is the National Dosimetry Services (NDS) operated by Health Canada. Dosimeters used include TLDs and OSL dosimeters. Nuclear Energy Workers (NEWs) require dosimetry when they may receive more than 5 mSv/year. Dosimeters are worn at collar level outside protective apparel. The National Dose Registry (NDR), maintained by Health Canada, tracks cumulative occupational radiation doses for all monitored workers in Canada. All dose records must be reported in SI units (mSv, mGy). Dosimetry reports are issued quarterly and records are maintained for the worker's lifetime. Action levels are facility-specific thresholds that, when reached, trigger investigation into the cause and corrective actions. The CNSC requires licensees to establish action levels as part of their radiation protection program.",
      "Canadian dosimetry practices and the National Dose Registry are unique aspects of the CAMRT certification content.",
      ["National Dosimetry Services", "Nuclear Energy Workers", "National Dose Registry", "SI units only", "Quarterly reports", "Action levels", "CNSC-licensed services"],
      [
        { question: "Who maintains the National Dose Registry in Canada?", options: ["CNSC", "Health Canada", "CAMRT", "Provincial health authorities"], correctIndex: 1, rationale: "Health Canada maintains the National Dose Registry tracking all occupational radiation dose records in Canada." },
        { question: "At what dose level is dosimetry required for Nuclear Energy Workers?", options: ["1 mSv/yr", "5 mSv/yr", "10 mSv/yr", "50 mSv/yr"], correctIndex: 1, rationale: "Dosimetry is required when a Nuclear Energy Worker may receive more than 5 mSv per year." },
        { question: "How often are dosimetry reports typically issued in Canada?", options: ["Weekly", "Monthly", "Quarterly", "Annually"], correctIndex: 2, rationale: "Canadian dosimetry reports from National Dosimetry Services are issued quarterly." }
      ],
      2, "CAMRT Personnel Dosimetry & Monitoring in Canada | Study Guide",
      "Study Canadian personnel dosimetry for CAMRT certification: NDS services, National Dose Registry, dosimeter placement, SI units, and CNSC action level requirements."
    ),

    camrt("radiation_safety", "Radiation Protection Principles (CAMRT)",
      "camrt-radiation-protection-principles",
      "Canadian radiation protection follows the same cardinal principles of time, distance, and shielding, but within the regulatory framework of the CNSC and provincial legislation. The ALARA principle is codified in Canadian law and requires consideration of social and economic factors. Lead aprons must meet CSA Standard Z94.1 requirements. In Canada, structural shielding design follows NCRP Report 147 adapted for Canadian regulatory requirements. Protective apparel includes lead aprons (0.5 mm Pb equivalent), thyroid shields, and leaded eyewear meeting the new ICRP 118 lens dose recommendations. The Canadian approach to gonadal shielding aligns with recent evidence-based reviews, noting limited benefit with digital imaging systems. Technologists must follow institutional radiation protection procedures and report any incidents to the radiation safety officer. Provincial radiation health and safety acts may impose additional requirements beyond federal CNSC regulations.",
      "Canadian-specific radiation protection practices reflect both CNSC regulations and CSA standards.",
      ["ALARA in Canadian law", "CSA Z94.1", "NCRP 147 adaptation", "Provincial legislation", "ICRP 118 lens dose", "Incident reporting", "Evidence-based shielding"],
      [
        { question: "Which Canadian standard governs protective apparel specifications?", options: ["CNSC Standard S-260", "CSA Z94.1", "Health Canada SC-35", "NCRP 147"], correctIndex: 1, rationale: "CSA Z94.1 is the Canadian standard for protective apparel used in medical radiation environments." },
        { question: "ALARA in Canada requires consideration of:", options: ["Cost only", "Social and economic factors", "Time only", "Distance only"], correctIndex: 1, rationale: "Canadian ALARA implementation requires balancing radiation reduction with social and economic factors as codified in law." },
        { question: "Which ICRP publication led to reduced lens dose limits in Canada?", options: ["ICRP 60", "ICRP 103", "ICRP 118", "ICRP 26"], correctIndex: 2, rationale: "ICRP Publication 118 recommended reducing the lens dose limit, which Canada adopted at 50 mSv/year." }
      ],
      2, "CAMRT Radiation Protection Principles | Canadian Study Guide",
      "Master Canadian radiation protection principles for CAMRT certification: CNSC ALARA requirements, CSA standards, shielding guidelines, and provincial regulations."
    ),

    camrt("radiation_safety", "Radiation Biology & Effects (CAMRT)",
      "camrt-radiation-biology-effects",
      "Radiation biology in the Canadian CAMRT curriculum emphasizes the same fundamental principles with Canadian regulatory context. Ionizing radiation causes biological damage through direct interaction with DNA and indirect damage via free radical production from water radiolysis. The dominant mechanism at diagnostic energies is indirect damage through hydroxyl radical formation. Effects are classified as deterministic (tissue reactions with thresholds: skin erythema at 2 Gy, cataract at 0.5 Gy cumulative per ICRP 118) or stochastic (cancer and hereditary effects, probabilistic with no threshold). Canada uses the linear no-threshold (LNT) model as the basis for radiation protection regulations. The CNSC's regulatory framework requires dose optimization rather than dose elimination. The Law of Bergonie and Tribondeau applies: cells that are immature, undifferentiated, and rapidly dividing are most radiosensitive. Canadian dose reference levels (DRLs) are established by the Canadian Association of Radiologists (CAR) and are used as benchmarks for dose optimization, not as limits.",
      "Radiobiology knowledge with Canadian regulatory context supports CAMRT exam preparation and professional practice.",
      ["Indirect effects dominant", "LNT model in Canada", "ICRP 118 cataract threshold", "Dose reference levels (DRLs)", "CAR benchmarks", "Bergonie & Tribondeau", "Dose optimization"],
      [
        { question: "What organization establishes Canadian diagnostic reference levels (DRLs)?", options: ["CNSC", "Health Canada", "CAR", "CAMRT"], correctIndex: 2, rationale: "The Canadian Association of Radiologists (CAR) establishes diagnostic reference levels as dose optimization benchmarks." },
        { question: "The revised cataract threshold per ICRP 118 is:", options: ["0.5 Gy cumulative", "2 Gy acute", "5 Gy cumulative", "10 Gy acute"], correctIndex: 0, rationale: "ICRP 118 revised the cataract threshold to 0.5 Gy cumulative, leading to reduced lens dose limits." },
        { question: "Diagnostic reference levels (DRLs) in Canada serve as:", options: ["Legal dose limits", "Benchmarks for dose optimization", "Maximum allowable doses", "Minimum required doses"], correctIndex: 1, rationale: "DRLs are optimization tools, not limits. They identify practices that may require review if consistently exceeded." }
      ],
      3, "CAMRT Radiation Biology & Effects | Canadian Study Guide",
      "Study radiation biology for CAMRT certification: biological effects, LNT model, Canadian dose reference levels, ICRP 118 updates, and CNSC regulatory context."
    ),

    // ===== IMAGE PRODUCTION =====
    arrt("image_production", "X-ray Production & Beam Characteristics (ARRT)",
      "arrt-xray-production-beam",
      "X-rays are produced when high-speed electrons from the cathode strike the anode target. Two types of X-ray production occur: Bremsstrahlung (braking radiation) produces a continuous spectrum when electrons are decelerated by nuclear fields, and Characteristic radiation produces discrete energy peaks when incoming electrons eject inner-shell electrons from target atoms. In diagnostic radiography, Bremsstrahlung dominates the useful beam. The X-ray beam is polychromatic (multiple energies). Beam quality (penetrating ability) is controlled by kVp; beam quantity (number of photons) is controlled by mAs. Increasing kVp raises the maximum and average photon energy and increases beam quantity. Filtration removes low-energy photons that contribute to patient dose without contributing to the image. Total filtration must be at least 2.5 mm Al equivalent for tubes operating above 70 kVp per FDA regulations. The anode heel effect causes decreased intensity on the anode side of the beam due to self-absorption in the target.",
      "Understanding X-ray production physics is fundamental to the ARRT exam and clinical practice.",
      ["Bremsstrahlung radiation", "Characteristic radiation", "kVp controls quality", "mAs controls quantity", "2.5 mm Al filtration", "Anode heel effect", "Polychromatic beam"],
      [
        { question: "What type of X-ray production dominates the diagnostic beam?", options: ["Characteristic", "Bremsstrahlung", "Compton", "Coherent"], correctIndex: 1, rationale: "Bremsstrahlung (braking radiation) produces the continuous spectrum that forms the majority of the diagnostic X-ray beam." },
        { question: "Minimum total filtration required for tubes above 70 kVp per FDA:", options: ["0.5 mm Al", "1.5 mm Al", "2.5 mm Al", "5.0 mm Al"], correctIndex: 2, rationale: "FDA requires at least 2.5 mm aluminum equivalent total filtration for X-ray tubes operating above 70 kVp." },
        { question: "The primary factor controlling beam penetration is:", options: ["mAs", "kVp", "Focal spot size", "SID"], correctIndex: 1, rationale: "kVp controls beam quality (energy/penetration); mAs controls beam quantity (number of photons)." },
        { question: "The anode heel effect results in:", options: ["Increased intensity on anode side", "Decreased intensity on anode side", "Uniform intensity", "Increased scatter"], correctIndex: 1, rationale: "Self-absorption in the angled anode target causes decreased beam intensity on the anode side." }
      ],
      2, "ARRT X-ray Production & Beam Physics | Study Guide",
      "Master X-ray production physics for the ARRT exam: Bremsstrahlung, characteristic radiation, kVp, mAs, filtration requirements, and beam characteristics."
    ),

    arrt("image_production", "Image Quality Factors: Density, Contrast & Detail (ARRT)",
      "arrt-image-quality-factors",
      "Image quality in radiography is described by four primary factors: density (optical/receptor exposure), contrast, spatial resolution (recorded detail), and distortion. In digital radiography, receptor exposure replaces optical density. Contrast has two components: subject contrast (determined by tissue differences, kVp, and beam quality) and image receptor contrast (determined by display processing). Higher kVp produces longer-scale (lower) contrast. Lower kVp produces short-scale (higher) contrast. Spatial resolution is determined by focal spot size, SID, OID, and motion. Smaller focal spots improve resolution. Increasing SID and decreasing OID reduce magnification and improve resolution. Motion is the most common cause of image unsharpness. Distortion includes size distortion (magnification) and shape distortion (elongation and foreshortening). Noise sources include quantum mottle (insufficient photons), electronic noise, and scatter radiation. The 15% rule: increasing kVp by 15% and halving mAs maintains similar receptor exposure with reduced patient dose.",
      "Image quality assessment is a core competency for ARRT-registered technologists.",
      ["Receptor exposure", "Subject vs image receptor contrast", "kVp and contrast relationship", "Focal spot size", "SID and OID", "15% rule", "Quantum mottle"],
      [
        { question: "The 15% rule states that increasing kVp by 15% requires what mAs change to maintain exposure?", options: ["Double mAs", "Halve mAs", "No change", "Triple mAs"], correctIndex: 1, rationale: "The 15% rule: increase kVp by 15% and halve mAs to maintain similar receptor exposure with reduced patient dose." },
        { question: "Which factor has the greatest effect on image contrast?", options: ["mAs", "kVp", "SID", "Focal spot"], correctIndex: 1, rationale: "kVp is the primary controlling factor for image contrast. Higher kVp = longer scale (lower) contrast." },
        { question: "The most common cause of image unsharpness is:", options: ["Large focal spot", "High OID", "Patient motion", "Low kVp"], correctIndex: 2, rationale: "Motion blur from patient movement is the most common cause of image unsharpness in clinical practice." }
      ],
      2, "ARRT Image Quality Factors | Density, Contrast & Detail Study Guide",
      "Study radiographic image quality for the ARRT exam: density, contrast, spatial resolution, distortion, noise, and the 15% rule for technique optimization."
    ),

    arrt("image_production", "Digital Radiography Image Processing (ARRT)",
      "arrt-digital-image-processing",
      "Digital radiography systems (CR and DR) acquire raw image data that undergoes processing before display. Computed Radiography (CR) uses photostimulable phosphor imaging plates read by a laser scanner. Direct Radiography (DR) uses flat-panel detectors with either direct conversion (amorphous selenium) or indirect conversion (scintillator plus amorphous silicon). DR provides superior detective quantum efficiency (DQE) and faster workflow compared to CR. Image processing includes histogram analysis for automatic rescaling, look-up table (LUT) application for window/level adjustment, edge enhancement, and noise reduction. Exposure indicators (EI, S-number, lgM) provide feedback on detector dose. AAPM established standardized exposure indicator terminology. Dose creep -- the gradual increase in technique factors because digital systems produce acceptable-appearing images over a wide exposure range -- is a significant concern. DICOM (Digital Imaging and Communications in Medicine) is the standard for image storage and transfer. PACS (Picture Archiving and Communication System) stores and distributes images throughout the healthcare facility.",
      "Digital imaging systems and processing are heavily tested on the ARRT examination.",
      ["CR vs DR", "Direct vs indirect conversion", "DQE superiority of DR", "Exposure indicators", "Dose creep", "DICOM standard", "PACS", "Histogram analysis"],
      [
        { question: "What is dose creep in digital radiography?", options: ["Equipment degradation", "Gradual increase in technique because images still look acceptable", "Detector noise increase", "Automatic dose adjustment"], correctIndex: 1, rationale: "Dose creep occurs when technologists gradually increase technique factors because digital systems produce acceptable images over a wide exposure range." },
        { question: "Which digital system has higher detective quantum efficiency (DQE)?", options: ["CR", "DR", "Film-screen", "They are equal"], correctIndex: 1, rationale: "DR flat-panel detectors have higher DQE than CR, producing better image quality at lower doses." },
        { question: "DICOM is the standard for:", options: ["Radiation dose measurement", "Equipment calibration", "Digital image storage and transfer", "Patient identification"], correctIndex: 2, rationale: "DICOM (Digital Imaging and Communications in Medicine) is the international standard for medical image storage, transfer, and communication." }
      ],
      2, "ARRT Digital Radiography & Image Processing | Study Guide",
      "Master digital radiography for the ARRT exam: CR vs DR systems, image processing, exposure indicators, dose creep prevention, and DICOM/PACS."
    ),

    camrt("image_production", "X-ray Production & Beam Physics (CAMRT)",
      "camrt-xray-production-beam",
      "X-ray production in the Canadian CAMRT curriculum covers the same physics principles within Health Canada's Safety Code 35 regulatory framework. X-rays are generated by accelerating electrons from cathode to anode in an evacuated glass or metal envelope tube. Bremsstrahlung radiation produces a continuous polychromatic spectrum while characteristic radiation produces discrete energy peaks specific to the target material (typically tungsten). Beam quality (half-value layer, measured in mm Al) determines penetrating ability and is primarily controlled by kVp. Beam quantity is controlled by mAs. Canadian regulations under Safety Code 35 require total filtration of at least 2.5 mm Al equivalent for equipment operating above 70 kVp, consistent with international standards. The beam spectrum is modified by inherent filtration (glass envelope, oil, housing window) and added filtration (aluminum or copper sheets). Collimation limits field size, reducing patient dose and scatter. Health Canada requires light field to X-ray field congruence within 2% of SID.",
      "Understanding X-ray production with Canadian regulatory context prepares CAMRT candidates for certification.",
      ["Bremsstrahlung", "Characteristic radiation", "Half-value layer", "Safety Code 35", "2.5 mm Al filtration", "Collimation", "Light-field congruence 2%"],
      [
        { question: "Health Canada's Safety Code 35 requires light field to X-ray field alignment within:", options: ["1% of SID", "2% of SID", "5% of SID", "10% of SID"], correctIndex: 1, rationale: "Safety Code 35 requires light field to X-ray field congruence within 2% of the source-to-image distance (SID)." },
        { question: "Half-value layer (HVL) is a measure of:", options: ["Beam quantity", "Beam quality (penetration)", "Patient dose", "Image contrast"], correctIndex: 1, rationale: "HVL measures beam quality -- the thickness of absorber needed to reduce beam intensity by half, indicating penetrating ability." },
        { question: "What is the minimum total filtration for tubes above 70 kVp in Canada?", options: ["1.0 mm Al", "1.5 mm Al", "2.5 mm Al", "5.0 mm Al"], correctIndex: 2, rationale: "Canadian standards under Safety Code 35 require at least 2.5 mm Al equivalent total filtration above 70 kVp." }
      ],
      2, "CAMRT X-ray Production & Beam Physics | Canadian Study Guide",
      "Study X-ray production physics for CAMRT certification: beam characteristics, filtration, Safety Code 35 requirements, and Canadian regulatory standards."
    ),

    camrt("image_production", "Image Quality & Technique Optimization (CAMRT)",
      "camrt-image-quality-optimization",
      "Image quality evaluation in Canadian radiographic practice emphasizes the balance between diagnostic quality and dose optimization in accordance with ALARA principles. The primary image quality descriptors are contrast resolution, spatial resolution, noise, and artifacts. In digital systems, window width controls displayed contrast and window level controls displayed brightness. Canadian facilities use diagnostic reference levels (DRLs) published by the Canadian Association of Radiologists (CAR) as benchmarks for dose optimization. Exposure indicators must be monitored for every examination to detect dose creep. The Canadian approach to technique optimization incorporates patient-specific factors (size, age, pathology) with protocol-based imaging. Automatic exposure control (AEC) systems require proper detector selection and positioning. Quality improvement programs in Canadian imaging departments track reject/repeat rates, exposure indicator trends, and image quality metrics as part of continuous quality improvement mandated by provincial regulations and CAMRT standards of practice.",
      "Image quality optimization within Canadian regulatory and professional frameworks is essential for CAMRT practice.",
      ["Contrast and spatial resolution", "Window width/level", "CAR diagnostic reference levels", "Exposure indicator monitoring", "AEC optimization", "Reject/repeat analysis", "CQI programs"],
      [
        { question: "Who publishes diagnostic reference levels (DRLs) in Canada?", options: ["CNSC", "CAMRT", "CAR", "Health Canada"], correctIndex: 2, rationale: "The Canadian Association of Radiologists (CAR) publishes diagnostic reference levels as dose optimization benchmarks." },
        { question: "Window width on a digital display primarily controls:", options: ["Image brightness", "Image contrast", "Spatial resolution", "Patient dose"], correctIndex: 1, rationale: "Window width controls the range of values displayed, which determines the contrast of the displayed image." },
        { question: "What does reject/repeat analysis track?", options: ["Equipment costs", "Images requiring retake due to quality issues", "Patient wait times", "Staff performance reviews"], correctIndex: 1, rationale: "Reject/repeat analysis tracks images that need to be retaken, identifying patterns to improve quality and reduce unnecessary dose." }
      ],
      2, "CAMRT Image Quality & Technique Optimization | Canadian Study Guide",
      "Master image quality optimization for CAMRT certification: CAR diagnostic reference levels, exposure monitoring, AEC, and Canadian quality improvement programs."
    ),

    camrt("image_production", "Digital Imaging Systems & PACS (CAMRT)",
      "camrt-digital-imaging-pacs",
      "Canadian medical imaging facilities have transitioned to digital imaging systems following standards established by the Digital Imaging and Communications in Medicine (DICOM) protocol and Canada Health Infoway initiatives. CR systems use photostimulable phosphor plates while DR uses flat-panel detectors with direct (amorphous selenium) or indirect (cesium iodide scintillator) conversion. Canadian facilities must comply with provincial privacy legislation (such as Ontario's PHIPA, Alberta's HIA, or BC's PIPA) when managing digital images. PACS systems in Canada integrate with provincial electronic health record systems. IHE (Integrating the Healthcare Enterprise) profiles ensure interoperability between systems from different vendors. Image compression must balance storage efficiency with diagnostic quality. Teleradiology services, increasingly important in Canada's vast geography, must comply with CAMRT standards and provincial telehealth regulations. Data backup and disaster recovery plans are mandatory for all PACS installations.",
      "Canadian digital imaging infrastructure and privacy requirements are unique aspects of CAMRT preparation.",
      ["CR vs DR systems", "DICOM standard", "Provincial privacy laws", "PACS integration", "IHE profiles", "Teleradiology regulations", "Canada Health Infoway"],
      [
        { question: "What privacy legislation governs medical images in Ontario?", options: ["PIPEDA", "PHIPA", "FOIPPA", "HIA"], correctIndex: 1, rationale: "Ontario's Personal Health Information Protection Act (PHIPA) governs the collection, use, and disclosure of personal health information including medical images." },
        { question: "IHE profiles ensure:", options: ["Image quality standards", "Interoperability between different vendors' systems", "Radiation dose limits", "Staff certification requirements"], correctIndex: 1, rationale: "Integrating the Healthcare Enterprise (IHE) profiles define standards for system interoperability in healthcare IT." },
        { question: "Direct conversion DR detectors use which material?", options: ["Cesium iodide", "Gadolinium oxysulfide", "Amorphous selenium", "Barium fluorohalide"], correctIndex: 2, rationale: "Direct conversion DR detectors use amorphous selenium to directly convert X-ray photons to electrical signals." }
      ],
      2, "CAMRT Digital Imaging Systems & PACS | Canadian Study Guide",
      "Study digital imaging for CAMRT certification: CR/DR systems, PACS, DICOM, Canadian privacy legislation, teleradiology, and IHE interoperability."
    ),

    // ===== PATIENT CARE =====
    arrt("patient_care", "Patient Assessment & Communication (ARRT)",
      "arrt-patient-assessment-communication",
      "Radiologic technologists must assess patients before, during, and after imaging procedures. Pre-procedure assessment includes verifying patient identity using two identifiers (name and date of birth), confirming the correct examination was ordered, screening for pregnancy in women of childbearing age, assessing allergies (especially contrast media), reviewing relevant clinical history, and evaluating the patient's physical and emotional status. Vital signs assessment includes pulse (normal 60-100 bpm), respiration (12-20/min), blood pressure (normal <120/80 mmHg), temperature (98.6°F/37°C), and pulse oximetry (normal >95%). Communication must be adapted to patient needs including age, language, hearing ability, cognitive status, and cultural considerations. Informed consent must be obtained before contrast administration or invasive procedures. The technologist must verify that the correct examination is being performed on the correct patient using the correct laterality -- wrong-site imaging is a sentinel event. HIPAA regulations govern patient privacy and information sharing.",
      "Patient assessment skills are essential for safe radiographic practice and heavily tested on the ARRT exam.",
      ["Two-identifier verification", "Pregnancy screening", "Vital signs assessment", "Informed consent", "HIPAA compliance", "Wrong-site prevention", "Cultural competence"],
      [
        { question: "Normal adult resting pulse rate is:", options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-160 bpm"], correctIndex: 1, rationale: "Normal adult resting pulse rate is 60-100 beats per minute." },
        { question: "How many patient identifiers are required before imaging?", options: ["One", "Two", "Three", "Four"], correctIndex: 1, rationale: "Two identifiers (typically name and date of birth) are required per Joint Commission patient safety goals." },
        { question: "Wrong-site imaging is classified as a:", options: ["Minor incident", "Near miss", "Sentinel event", "Expected occurrence"], correctIndex: 2, rationale: "Wrong-site procedures, including wrong-site imaging, are classified as sentinel events requiring investigation." }
      ],
      1, "ARRT Patient Assessment & Communication | Study Guide",
      "Study patient assessment for the ARRT exam: identity verification, vital signs, pregnancy screening, informed consent, HIPAA, and communication techniques."
    ),

    arrt("patient_care", "Patient Safety & Transfer Techniques (ARRT)",
      "arrt-patient-safety-transfer",
      "Patient safety during imaging procedures requires attention to fall prevention, proper body mechanics, safe transfer techniques, and immobilization. Fall risk assessment should be performed for all patients, especially elderly, sedated, or mobility-impaired individuals. Proper body mechanics: bend at knees, keep back straight, hold weight close to body, and maintain a wide base of support. Transfer techniques include: wheelchair to table (lock wheels, position at 45 degrees, assist from strong side), stretcher to table (lock wheels on both, use draw sheet, minimum two staff), and standing position changes (face patient, brace their knees, count before moving). Immobilization devices include sandbags, sponges, tape, Velcro straps, and commercial restraint devices. Restraints require a physician order and frequent circulation checks. Standard precautions (formerly universal precautions) apply to all patients regardless of diagnosis. Isolation categories include contact, droplet, and airborne precautions, each requiring specific PPE. Latex allergies require non-latex equipment substitution.",
      "Safe patient handling and transfer are critical clinical skills for radiologic technologists.",
      ["Fall risk assessment", "Body mechanics", "Transfer techniques", "Immobilization devices", "Standard precautions", "Isolation categories", "Restraint requirements"],
      [
        { question: "Proper body mechanics for lifting requires:", options: ["Bending at the waist", "Keeping weight at arm's length", "Bending at the knees with straight back", "Using back muscles primarily"], correctIndex: 2, rationale: "Proper body mechanics: bend at knees, keep back straight, hold weight close to body, and use leg muscles." },
        { question: "What type of isolation requires an N95 respirator?", options: ["Contact", "Droplet", "Airborne", "Protective"], correctIndex: 2, rationale: "Airborne precautions require N95 respirators for pathogens transmitted via airborne nuclei (TB, measles, varicella)." },
        { question: "Use of patient restraints requires:", options: ["Technologist discretion", "Physician order with frequent checks", "Family consent only", "No special requirements"], correctIndex: 1, rationale: "Restraints require a physician order and frequent monitoring of circulation, sensation, and movement." }
      ],
      1, "ARRT Patient Safety & Transfer Techniques | Study Guide",
      "Master patient safety for the ARRT exam: fall prevention, body mechanics, transfer techniques, immobilization, standard precautions, and isolation procedures."
    ),

    arrt("patient_care", "Infection Control in Radiology (ARRT)",
      "arrt-infection-control",
      "Infection control in radiology follows the chain of infection model: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. Breaking any link prevents transmission. Standard precautions apply to all patients and include hand hygiene, PPE use, respiratory hygiene, safe injection practices, and sterile instrument handling. Hand hygiene is the single most effective infection prevention measure. Alcohol-based hand sanitizers are effective for most situations; soap and water is required for Clostridium difficile and visible soiling. Equipment disinfection between patients is mandatory. Three levels of disinfection: low-level (quaternary ammonium compounds for non-critical items), intermediate-level (70% alcohol or dilute bleach for semi-critical items), and high-level/sterilization (glutaraldehyde or autoclaving for critical items). The Spaulding classification categorizes equipment: critical (enters sterile tissue -- must be sterilized), semi-critical (contacts mucous membranes -- high-level disinfection), and non-critical (contacts intact skin -- low-level disinfection). Imaging equipment surfaces, detector covers, and patient contact surfaces require disinfection between uses.",
      "Infection prevention in the imaging department protects patients and staff from healthcare-associated infections.",
      ["Chain of infection", "Standard precautions", "Hand hygiene", "Spaulding classification", "Three disinfection levels", "C. difficile soap/water", "Equipment disinfection"],
      [
        { question: "The single most effective infection prevention measure is:", options: ["Wearing gloves", "Hand hygiene", "Surface disinfection", "Patient isolation"], correctIndex: 1, rationale: "Hand hygiene is consistently identified as the single most effective measure for preventing healthcare-associated infections." },
        { question: "Per the Spaulding classification, items entering sterile tissue are:", options: ["Non-critical", "Semi-critical", "Critical", "Environmental"], correctIndex: 2, rationale: "Critical items enter sterile tissue or the vascular system and must be sterilized." },
        { question: "Which pathogen requires soap and water instead of alcohol sanitizer?", options: ["MRSA", "Influenza", "Clostridium difficile", "Streptococcus"], correctIndex: 2, rationale: "C. difficile spores are resistant to alcohol-based sanitizers; soap and water with friction is required." }
      ],
      1, "ARRT Infection Control in Radiology | Study Guide",
      "Study infection control for the ARRT exam: chain of infection, standard precautions, hand hygiene, Spaulding classification, and radiology-specific disinfection."
    ),

    camrt("patient_care", "Patient Assessment & Informed Consent (CAMRT)",
      "camrt-patient-assessment-consent",
      "Canadian radiologic technologists follow CAMRT standards of practice for patient assessment, which include verifying patient identity using at least two identifiers, confirming the examination order against clinical indication, screening for pregnancy and contraindications, and assessing the patient's physical and emotional readiness. Informed consent in Canada follows provincial legislation and requires disclosure of the nature of the procedure, expected benefits, material risks, alternatives, and consequences of not proceeding. For contrast-enhanced procedures, informed consent must specifically address contrast risks. The Canadian Patient Safety Institute (CPSI) promotes a safety culture in healthcare. Vital signs assessment uses SI-compatible units where applicable. Cultural safety is emphasized in Canadian healthcare, particularly regarding Indigenous patients, where culturally appropriate communication and respect for traditional practices is expected. Privacy of patient information is governed by PIPEDA (federal) and provincial health information acts. Technologists must practice within their defined scope as established by provincial regulatory bodies.",
      "Patient assessment within Canadian legal and cultural frameworks is essential for CAMRT practice.",
      ["Two identifiers", "Informed consent elements", "CPSI", "Cultural safety", "Indigenous patient care", "PIPEDA", "Provincial scope of practice"],
      [
        { question: "Informed consent in Canada must include:", options: ["Only the procedure name", "Nature, benefits, risks, alternatives, and consequences", "Only the cost", "Patient signature only"], correctIndex: 1, rationale: "Canadian informed consent requires disclosure of the nature of the procedure, expected benefits, material risks, alternatives, and consequences of not proceeding." },
        { question: "Which organization promotes patient safety culture in Canada?", options: ["CNSC", "CPSI", "CAMRT", "CAR"], correctIndex: 1, rationale: "The Canadian Patient Safety Institute (CPSI) promotes a culture of safety in Canadian healthcare." },
        { question: "Cultural safety in Canadian healthcare particularly emphasizes care for:", options: ["International patients", "Indigenous patients", "Pediatric patients", "Elderly patients"], correctIndex: 1, rationale: "Canadian healthcare frameworks specifically emphasize cultural safety and culturally appropriate care for Indigenous patients." }
      ],
      1, "CAMRT Patient Assessment & Informed Consent | Canadian Study Guide",
      "Study patient assessment for CAMRT certification: identity verification, informed consent, CPSI safety culture, cultural safety, and Canadian privacy legislation."
    ),

    camrt("patient_care", "Patient Safety & Mobility (CAMRT)",
      "camrt-patient-safety-mobility",
      "Patient safety in Canadian imaging departments follows Accreditation Canada's Required Organizational Practices (ROPs) including fall prevention, safe transfer, and proper identification. Canadian healthcare facilities implement standardized fall risk screening tools and prevention strategies. Transfer techniques follow ergonomic principles promoted by provincial workplace health and safety regulations (e.g., Ontario's Occupational Health and Safety Act). Mechanical lift devices are increasingly mandated to reduce manual lifting injuries to both patients and staff. Immobilization techniques must balance image quality with patient comfort and dignity. Standard precautions are implemented per Public Health Agency of Canada (PHAC) guidelines. Routine practices and additional precautions (contact, droplet, airborne) follow PHAC's infection prevention and control guidelines. Equipment must be cleaned between patients following manufacturer instructions and provincial infection control standards. Latex-free alternatives must be available for patients with latex sensitivities. Incident reporting follows facility and provincial reporting requirements.",
      "Canadian patient safety practices reflect Accreditation Canada standards and provincial regulations.",
      ["Accreditation Canada ROPs", "Fall risk screening", "Mechanical lift devices", "PHAC infection control", "Provincial OHS regulations", "Routine practices", "Incident reporting"],
      [
        { question: "Canadian infection prevention and control guidelines are published by:", options: ["Health Canada", "PHAC", "CNSC", "CAMRT"], correctIndex: 1, rationale: "The Public Health Agency of Canada (PHAC) publishes infection prevention and control guidelines for Canadian healthcare." },
        { question: "Required Organizational Practices (ROPs) are part of:", options: ["CNSC regulations", "Accreditation Canada standards", "CAMRT bylaws", "Provincial health acts"], correctIndex: 1, rationale: "Required Organizational Practices are key patient safety requirements established by Accreditation Canada." },
        { question: "Mechanical lift devices in Canadian imaging are promoted to:", options: ["Speed up patient flow", "Reduce injuries to patients and staff", "Improve image quality", "Meet billing requirements"], correctIndex: 1, rationale: "Mechanical lift devices reduce the risk of musculoskeletal injuries to both patients and healthcare workers during transfers." }
      ],
      1, "CAMRT Patient Safety & Mobility | Canadian Study Guide",
      "Master patient safety for CAMRT certification: Accreditation Canada ROPs, fall prevention, ergonomic transfers, PHAC infection control, and Canadian workplace safety."
    ),

    camrt("patient_care", "Infection Prevention in Medical Imaging (CAMRT)",
      "camrt-infection-prevention",
      "Infection prevention in Canadian medical imaging departments follows PHAC's routine practices and additional precautions framework. Routine practices apply to all patient interactions and include hand hygiene, point-of-care risk assessment, PPE selection, respiratory hygiene/cough etiquette, and environmental cleaning. The four moments of hand hygiene (adapted from WHO) are used in Canadian practice: before patient contact, before aseptic procedure, after body fluid exposure risk, and after patient contact/environment contact. Additional precautions include contact, droplet, and airborne categories. PPE selection is based on the point-of-care risk assessment considering the anticipated exposure. Imaging equipment requires cleaning and disinfection between patients following provincial infection control standards and manufacturer instructions. During outbreaks (e.g., influenza, COVID-19), enhanced precautions may be implemented per provincial public health directives. Reprocessing of semi-critical and critical devices follows CSA standards for sterilization. Canadian facilities must have infection prevention and control programs meeting Accreditation Canada standards.",
      "Canadian infection prevention frameworks and practices are essential knowledge for CAMRT-certified technologists.",
      ["Routine practices", "Four moments hand hygiene", "Point-of-care risk assessment", "PHAC guidelines", "CSA sterilization standards", "Outbreak management", "Accreditation Canada"],
      [
        { question: "How many 'moments' of hand hygiene are recognized in Canadian practice?", options: ["Two", "Three", "Four", "Five"], correctIndex: 2, rationale: "The four moments of hand hygiene: before patient contact, before aseptic procedure, after body fluid exposure risk, after patient contact/environment." },
        { question: "Point-of-care risk assessment determines:", options: ["Patient diagnosis", "Appropriate PPE selection based on anticipated exposure", "Billing category", "Staffing needs"], correctIndex: 1, rationale: "Point-of-care risk assessment evaluates the anticipated patient interaction to determine appropriate PPE and precautions." },
        { question: "CSA standards in infection prevention cover:", options: ["Radiation dose limits", "Sterilization of medical devices", "Image quality metrics", "Staff scheduling"], correctIndex: 1, rationale: "CSA (Canadian Standards Association) standards establish requirements for sterilization and reprocessing of medical devices." }
      ],
      1, "CAMRT Infection Prevention in Medical Imaging | Canadian Study Guide",
      "Study infection prevention for CAMRT certification: PHAC routine practices, four moments of hand hygiene, PPE selection, CSA sterilization, and outbreak protocols."
    ),

    // ===== EQUIPMENT =====
    arrt("equipment", "X-ray Generator & Tube Components (ARRT)",
      "arrt-xray-generator-tube",
      "The X-ray generator converts incoming electrical power to the high voltage needed for X-ray production. Single-phase generators produce pulsating DC with 100% voltage ripple. Three-phase 6-pulse generators reduce ripple to 13%, and 12-pulse to 4%. High-frequency generators produce nearly constant potential with less than 1% ripple, providing the highest X-ray output efficiency and are the current standard. The X-ray tube consists of a cathode assembly (filament producing electrons via thermionic emission, focusing cup directing the electron beam) and an anode (target where X-rays are produced). Rotating anodes dissipate heat over a larger area than stationary anodes. The focal spot is the area on the anode struck by electrons. Actual focal spot is the physical area; effective focal spot (projected) is smaller due to the line focus principle. Smaller effective focal spots improve spatial resolution. Tube rating charts indicate safe operating limits for technique combinations. Heat units (HU) = kVp × mAs × generator factor quantify thermal loading. Tube warm-up procedures are required after periods of inactivity.",
      "Understanding X-ray equipment components is essential for ARRT exam success and clinical troubleshooting.",
      ["High-frequency generators", "Voltage ripple", "Thermionic emission", "Rotating anode", "Line focus principle", "Tube rating charts", "Heat units"],
      [
        { question: "Which generator type produces the least voltage ripple?", options: ["Single-phase", "Three-phase 6-pulse", "Three-phase 12-pulse", "High-frequency"], correctIndex: 3, rationale: "High-frequency generators produce nearly constant potential with less than 1% ripple, providing the most efficient X-ray output." },
        { question: "The line focus principle relates to:", options: ["Beam filtration", "Actual vs effective focal spot size", "Grid alignment", "Detector sensitivity"], correctIndex: 1, rationale: "The line focus principle uses an angled anode to project a smaller effective focal spot from a larger actual focal spot area." },
        { question: "Thermionic emission occurs at the:", options: ["Anode", "Cathode filament", "Glass envelope", "Stator"], correctIndex: 1, rationale: "Thermionic emission is the release of electrons from the heated cathode filament when sufficient energy overcomes the surface binding force." }
      ],
      2, "ARRT X-ray Generator & Tube Components | Study Guide",
      "Master X-ray equipment for the ARRT exam: generators, voltage ripple, tube components, focal spot principles, heat capacity, and tube rating charts."
    ),

    arrt("equipment", "Fluoroscopy Equipment & Systems (ARRT)",
      "arrt-fluoroscopy-equipment",
      "Fluoroscopy systems provide real-time imaging using continuous or pulsed X-ray output. The image intensifier (II) converts the X-ray pattern to a visible light image through a multi-stage process: input phosphor (CsI) absorbs X-rays and emits light, photocathode converts light to electrons, electrons are accelerated and focused by electrostatic lenses, and output phosphor produces a bright minified image. Brightness gain = minification gain × flux gain. Flat-panel detectors are replacing IIs with superior image quality, no vignetting, no pincushion distortion, and wider dynamic range. Automatic brightness control (ABC) adjusts kVp and mA to maintain consistent image brightness. Magnification modes use a smaller input phosphor area, increasing dose 2-4x but improving spatial resolution. Pulsed fluoroscopy at 7.5-15 fps reduces dose 50-75% compared to continuous mode. Last-image-hold eliminates radiation during image review. The X-ray tube is positioned under the table in most configurations, directing scatter downward away from the operator. Digital subtraction angiography (DSA) subtracts pre-contrast mask images from contrast-enhanced images to visualize vessels.",
      "Fluoroscopy equipment knowledge is critical for ARRT certification, especially radiation safety considerations.",
      ["Image intensifier", "Brightness gain", "Flat-panel detectors", "ABC system", "Pulsed fluoroscopy", "Magnification dose increase", "DSA"],
      [
        { question: "Brightness gain equals:", options: ["kVp × mAs", "Minification gain × flux gain", "Input phosphor size / output size", "Patient dose × image quality"], correctIndex: 1, rationale: "Brightness gain = minification gain (area ratio of input to output phosphor) × flux gain (electron acceleration factor)." },
        { question: "Pulsed fluoroscopy at 7.5 fps reduces dose approximately:", options: ["10-20%", "25-40%", "50-75%", "90-100%"], correctIndex: 2, rationale: "Pulsed fluoroscopy at 7.5 fps reduces dose approximately 50-75% compared to continuous fluoroscopy." },
        { question: "Why is the fluoroscopy X-ray tube positioned under the table?", options: ["Better image quality", "Directs scatter away from operator", "Equipment cooling", "Patient comfort"], correctIndex: 1, rationale: "Tube-under-table configuration directs scatter downward, away from the operator, reducing occupational dose." }
      ],
      2, "ARRT Fluoroscopy Equipment & Systems | Study Guide",
      "Study fluoroscopy equipment for the ARRT exam: image intensifiers, flat-panel detectors, ABC, pulsed fluoroscopy, magnification, and radiation safety considerations."
    ),

    arrt("equipment", "Equipment Quality Control & Maintenance (ARRT)",
      "arrt-equipment-qc-maintenance",
      "Quality control (QC) programs ensure X-ray equipment operates within acceptable performance standards. The ACR and state regulatory agencies establish QC requirements. Daily QC checks include visual inspection, warning light and indicator function, and detector calibration verification. Monthly/quarterly tests include collimator accuracy (light field to X-ray field within 2% of SID), SID indicator accuracy (within 2%), exposure reproducibility (coefficient of variation <0.05), linearity (mR/mAs consistent across mA stations within 10%), kVp accuracy (within +/- 5%), half-value layer measurement, and automatic exposure control (AEC) consistency. Annual tests include focal spot size measurement, timer accuracy, and lead apron integrity testing (fluoroscopy inspection for defects). Processor QC (for remaining film systems): sensitometry and densitometry daily. Digital system QC includes detector uniformity, dead pixel mapping, exposure indicator calibration, and artifact assessment. Records must be maintained per state and accreditation requirements. Equipment not meeting standards must be taken out of service until corrected.",
      "QC program knowledge demonstrates competency in equipment management for ARRT certification.",
      ["Daily visual inspection", "Collimator accuracy 2%", "Exposure reproducibility CV<0.05", "kVp accuracy ±5%", "AEC consistency", "Lead apron testing", "Digital detector QC"],
      [
        { question: "Acceptable collimator accuracy is within:", options: ["1% of SID", "2% of SID", "5% of SID", "10% of SID"], correctIndex: 1, rationale: "Light field to X-ray field congruence must be within 2% of the source-to-image distance (SID)." },
        { question: "Exposure reproducibility coefficient of variation must be:", options: ["<0.01", "<0.05", "<0.10", "<0.25"], correctIndex: 1, rationale: "The coefficient of variation for exposure reproducibility must be less than 0.05 (5%) for acceptable equipment performance." },
        { question: "kVp accuracy must be within:", options: ["±1%", "±2%", "±5%", "±10%"], correctIndex: 2, rationale: "kVp accuracy must be within ±5% of the set value for equipment to meet performance standards." }
      ],
      2, "ARRT Equipment Quality Control & Maintenance | Study Guide",
      "Master equipment QC for the ARRT exam: daily/monthly/annual tests, collimator accuracy, exposure linearity, kVp accuracy, digital detector QC, and record keeping."
    ),

    camrt("equipment", "X-ray Equipment Components & Operation (CAMRT)",
      "camrt-xray-equipment-components",
      "Canadian radiographic equipment must meet Health Canada's Safety Code 35 standards and CSA electrical safety requirements. Modern high-frequency generators are standard in Canadian facilities, producing nearly constant potential with minimal voltage ripple (<1%) for efficient X-ray production. The X-ray tube assembly includes cathode (filament, focusing cup), anode (rotating target, typically rhenium-tungsten-molybdenum alloy), and tube housing with lead lining to contain leakage radiation to less than 1 mGy/hr at 1 metre. Collimators must provide positive beam limitation (PBL) that automatically adjusts to cassette/detector size. Exposure control panels must display technique factors clearly. Equipment installation requires compliance with provincial building codes for shielding design, typically following NCRP Report 147 methodology adapted to Canadian dose limits. Annual equipment inspections are required by provincial radiation safety regulations and must be performed by qualified medical physicists or inspectors. Canadian equipment standards also address electromagnetic compatibility to prevent interference with other medical devices.",
      "Equipment knowledge within Canadian regulatory standards is essential for CAMRT-certified technologists.",
      ["Safety Code 35", "High-frequency generators", "Leakage <1 mGy/hr at 1m", "Positive beam limitation", "CSA electrical standards", "Provincial inspections", "NCRP 147 shielding"],
      [
        { question: "Health Canada Safety Code 35 limits tube housing leakage to:", options: ["0.1 mGy/hr at 1 m", "0.5 mGy/hr at 1 m", "1 mGy/hr at 1 m", "5 mGy/hr at 1 m"], correctIndex: 2, rationale: "Safety Code 35 requires tube housing leakage radiation not to exceed 1 mGy/hr at 1 metre from the focal spot." },
        { question: "Positive beam limitation (PBL) automatically adjusts:", options: ["kVp", "mAs", "Collimation to detector size", "Focal spot size"], correctIndex: 2, rationale: "PBL automatically adjusts the collimator to match the size of the image receptor, reducing unnecessary patient exposure." },
        { question: "Who must perform annual equipment inspections in Canada?", options: ["Any radiologic technologist", "The equipment manufacturer", "Qualified medical physicist or inspector", "The facility manager"], correctIndex: 2, rationale: "Provincial regulations require annual equipment inspections by qualified medical physicists or designated radiation safety inspectors." }
      ],
      2, "CAMRT X-ray Equipment Components | Canadian Study Guide",
      "Study X-ray equipment for CAMRT certification: Safety Code 35 requirements, generator types, tube specifications, PBL, and Canadian inspection standards."
    ),

    camrt("equipment", "Fluoroscopy & Advanced Imaging Systems (CAMRT)",
      "camrt-fluoroscopy-advanced-systems",
      "Canadian fluoroscopy practice follows strict dose management protocols. Modern flat-panel detector fluoroscopy units are replacing image intensifiers in Canadian facilities, offering improved image quality, wider dynamic range, and reduced dose. Canadian provincial regulations require fluoroscopy dose tracking with cumulative dose display. Dose reference points for interventional procedures follow Canadian and international guidelines. Pulsed fluoroscopy at the lowest acceptable pulse rate is mandatory practice. Automatic brightness/dose rate control adjusts parameters to maintain image quality. Canadian facilities must post fluoroscopy time notification protocols (typically at 30, 45, and 60 minutes). CT fluoroscopy is used in interventional procedures with strict dose protocols. C-arm fluoroscopy units used in OR settings require specific radiation protection measures including protective drapes, ceiling-suspended shields, and under-table lead shielding. All fluoroscopy operators in Canada must complete competency training that includes radiation safety, with some provinces requiring specific fluoroscopy licensing.",
      "Fluoroscopy equipment and safety in Canadian practice reflects strict regulatory requirements.",
      ["Flat-panel detectors", "Dose tracking display", "Pulsed fluoroscopy", "Time notifications", "C-arm safety", "Provincial licensing", "Dose reference points"],
      [
        { question: "Canadian facilities must post fluoroscopy time notifications typically at:", options: ["10, 20, 30 minutes", "30, 45, 60 minutes", "15, 30, 45 minutes", "60, 90, 120 minutes"], correctIndex: 1, rationale: "Fluoroscopy time notification protocols typically require alerts at 30, 45, and 60 minutes of cumulative fluoroscopy time." },
        { question: "Flat-panel detectors replace image intensifiers with the advantage of:", options: ["Lower cost", "Improved image quality and wider dynamic range", "Simpler operation", "No radiation needed"], correctIndex: 1, rationale: "Flat-panel detectors offer superior image quality, wider dynamic range, no vignetting or distortion, and potential dose reduction." },
        { question: "Fluoroscopy operator competency training in Canada must include:", options: ["Equipment maintenance", "Radiation safety training", "Patient billing", "Scheduling optimization"], correctIndex: 1, rationale: "All fluoroscopy operators in Canada must complete competency training that specifically includes radiation safety components." }
      ],
      2, "CAMRT Fluoroscopy & Advanced Imaging Systems | Canadian Study Guide",
      "Master fluoroscopy for CAMRT certification: flat-panel detectors, dose tracking, pulsed fluoroscopy, notification protocols, and Canadian licensing requirements."
    ),

    camrt("equipment", "Equipment QC Programs (CAMRT)",
      "camrt-equipment-qc-programs",
      "Quality control programs in Canadian imaging departments follow CSA standards, provincial regulations, and CAMRT quality management guidelines. QC tests include: collimator accuracy (light field to X-ray field within 2% SID), kVp accuracy (within ±5%), exposure timer accuracy, exposure reproducibility (coefficient of variation <0.05), mA linearity (within 10%), half-value layer verification, AEC consistency testing, and focal spot measurement. Digital detector QC includes uniformity testing, dead/defective pixel mapping, exposure indicator calibration, signal-to-noise ratio assessment, and spatial resolution verification. Lead apron testing requires annual fluoroscopic inspection for defects. Canadian facilities must document all QC results and maintain records per provincial requirements. Non-conforming equipment must be removed from service and repaired before returning to clinical use. Provincial radiation safety inspectors verify QC program compliance during site visits. Medical physicists provide oversight for QC programs and interpret results against established Canadian and international standards.",
      "Comprehensive QC knowledge demonstrates quality management competency for CAMRT-certified technologists.",
      ["CSA QC standards", "Collimator accuracy 2%", "kVp ±5%", "CV <0.05", "Digital detector QC", "Lead apron testing", "Provincial inspections"],
      [
        { question: "mA linearity must be within:", options: ["1%", "5%", "10%", "25%"], correctIndex: 2, rationale: "mA linearity testing requires mR/mAs values to be consistent within 10% across different mA stations." },
        { question: "Equipment failing QC standards must be:", options: ["Used with caution", "Reported at next inspection", "Removed from service until repaired", "Used for non-diagnostic purposes"], correctIndex: 2, rationale: "Non-conforming equipment must be immediately removed from clinical service and repaired before returning to use." },
        { question: "Who provides oversight for QC programs in Canadian facilities?", options: ["Equipment vendors", "Medical physicists", "Administrative staff", "CNSC inspectors only"], correctIndex: 1, rationale: "Medical physicists provide oversight for QC programs and interpret results against established standards." }
      ],
      2, "CAMRT Equipment QC Programs | Canadian Study Guide",
      "Study equipment QC for CAMRT certification: CSA standards, collimator/kVp/AEC testing, digital detector QC, lead apron inspection, and Canadian compliance requirements."
    ),

    // ===== ANATOMY =====
    arrt("anatomy", "Thoracic Radiographic Anatomy (ARRT)",
      "arrt-thoracic-anatomy",
      "Thoracic radiographic anatomy encompasses the bony thorax, lungs, mediastinum, and great vessels. The bony thorax includes 12 pairs of ribs (7 true, 3 false, 2 floating), 12 thoracic vertebrae, sternum (manubrium, body, xiphoid process), and clavicles. On PA chest radiograph: the trachea is midline, bifurcating at the carina (T4-T5 level). The right main bronchus is more vertical and wider than the left (aspiration more common on right). The cardiac silhouette should be less than half the thoracic width (cardiothoracic ratio <0.5). Right heart border is formed by the right atrium; left heart border by the left ventricle and left atrial appendage. The aortic knob is visible in the left superior mediastinum. Pulmonary vasculature should be visible to the outer third of the lung fields. The costophrenic angles should be sharp (blunting suggests effusion). The diaphragm domes are visible with the right usually 1-2 cm higher than the left due to the liver. Hilar shadows represent pulmonary arteries and main bronchi. The mediastinum is divided into anterior, middle, and posterior compartments, each with characteristic pathology.",
      "Thoracic anatomy knowledge is essential for image evaluation and ARRT certification.",
      ["12 ribs pairs", "Carina at T4-T5", "Right bronchus more vertical", "CTR <0.5", "Costophrenic angles", "Mediastinal compartments", "Aortic knob"],
      [
        { question: "The carina is located at which vertebral level?", options: ["T2-T3", "T4-T5", "T6-T7", "T8-T9"], correctIndex: 1, rationale: "The carina (tracheal bifurcation) is located at the T4-T5 vertebral level." },
        { question: "Normal cardiothoracic ratio on PA chest is:", options: ["<0.25", "<0.5", "<0.75", "<1.0"], correctIndex: 1, rationale: "Normal cardiothoracic ratio is less than 0.5 (cardiac width less than half the thoracic width) on a PA projection." },
        { question: "Aspiration more commonly affects the right lung because:", options: ["It is larger", "The right bronchus is more vertical and wider", "It has more lobes", "It is closer to the esophagus"], correctIndex: 1, rationale: "The right main bronchus is more vertical, wider, and shorter than the left, making aspirated material more likely to enter the right side." }
      ],
      2, "ARRT Thoracic Radiographic Anatomy | Study Guide",
      "Study thoracic anatomy for the ARRT exam: bony thorax, lungs, mediastinum, cardiac silhouette, pulmonary vasculature, and anatomical landmarks."
    ),

    arrt("anatomy", "Abdominal & Pelvic Radiographic Anatomy (ARRT)",
      "arrt-abdominal-pelvic-anatomy",
      "Abdominal radiographic anatomy includes solid organs, hollow viscera, and skeletal structures. The liver occupies the right upper quadrant extending across midline. The spleen is in the left upper quadrant posterior to the stomach. Kidneys are retroperitoneal, right slightly lower than left due to the liver. The psoas muscle shadows are visible bilaterally (loss of psoas shadow may indicate retroperitoneal pathology). On the abdominal radiograph, gas patterns in stomach, small bowel (centrally located, valvulae conniventes crossing the full diameter), and large bowel (peripherally located, haustra not crossing full diameter) are identifiable. The five radiographic densities are: air (most radiolucent), fat, water/soft tissue, bone, and metal (most radiopaque). Pelvic anatomy includes the iliac crests (L4 level), sacroiliac joints, pubic symphysis, acetabula, and proximal femora. The obturator foramina should be symmetric on AP pelvis. The bladder is seen as a soft tissue density in the midline pelvis when distended.",
      "Abdominal and pelvic anatomy is fundamental for radiographic positioning and image evaluation.",
      ["Four abdominal quadrants", "Liver right upper quadrant", "Kidneys retroperitoneal", "Psoas shadows", "Small vs large bowel gas", "Five radiographic densities", "Pelvic landmarks"],
      [
        { question: "Which of the five radiographic densities is most radiopaque?", options: ["Air", "Fat", "Bone", "Metal"], correctIndex: 3, rationale: "Metal is the most radiopaque density, followed by bone, water/soft tissue, fat, and air (most radiolucent)." },
        { question: "How are small bowel markings (valvulae conniventes) distinguished from large bowel haustra?", options: ["Small bowel markings cross the full diameter", "Large bowel markings cross the full diameter", "They cannot be distinguished", "By size only"], correctIndex: 0, rationale: "Valvulae conniventes of the small bowel extend across the full diameter; haustra of the large bowel do not." },
        { question: "The right kidney is typically positioned:", options: ["Higher than the left", "Lower than the left", "At the same level", "Anteriorly"], correctIndex: 1, rationale: "The right kidney sits slightly lower than the left due to the liver displacing it inferiorly." }
      ],
      2, "ARRT Abdominal & Pelvic Radiographic Anatomy | Study Guide",
      "Master abdominal anatomy for the ARRT exam: organ positions, gas patterns, radiographic densities, pelvic landmarks, and image evaluation criteria."
    ),

    arrt("anatomy", "Musculoskeletal Radiographic Anatomy (ARRT)",
      "arrt-musculoskeletal-anatomy",
      "Musculoskeletal radiographic anatomy encompasses bones, joints, and associated soft tissues. Long bones have five parts: epiphysis (ends), physis (growth plate), metaphysis (flared region), diaphysis (shaft), and medullary cavity. The periosteum covers the outer surface and the endosteum lines the medullary cavity. Joint types include synovial (diarthrodial -- freely movable), cartilaginous (amphiarthrodial -- slightly movable), and fibrous (synarthrodial -- immovable). The shoulder complex includes the glenohumeral, acromioclavicular, and sternoclavicular joints. The elbow includes the humeroulnar, humeroradial, and proximal radioulnar joints. The wrist (radiocarpal joint) articulates the radius with the scaphoid, lunate, and triquetrum. Carpal bones: proximal row (scaphoid, lunate, triquetrum, pisiform) and distal row (trapezium, trapezoid, capitate, hamate). Mnemonic: Some Lovers Try Positions That They Cannot Handle. The pelvis consists of two innominate bones (ilium, ischium, pubis) joined posteriorly at the sacroiliac joints and anteriorly at the pubic symphysis.",
      "Detailed musculoskeletal anatomy knowledge is required for proper positioning and image evaluation.",
      ["Long bone anatomy", "Physis (growth plate)", "Joint classifications", "Carpal bone mnemonic", "Shoulder complex", "Elbow joints", "Pelvic bones"],
      [
        { question: "The growth plate of a long bone is called the:", options: ["Epiphysis", "Metaphysis", "Physis", "Diaphysis"], correctIndex: 2, rationale: "The physis (growth plate) is the region of active bone growth between the epiphysis and metaphysis." },
        { question: "Which carpal bone is most commonly fractured?", options: ["Lunate", "Capitate", "Scaphoid", "Hamate"], correctIndex: 2, rationale: "The scaphoid is the most commonly fractured carpal bone, often from a fall on an outstretched hand (FOOSH)." },
        { question: "A freely movable joint is classified as:", options: ["Synarthrodial", "Amphiarthrodial", "Diarthrodial (synovial)", "Syndesmosis"], correctIndex: 2, rationale: "Diarthrodial (synovial) joints are freely movable joints with a synovial membrane and joint capsule." }
      ],
      2, "ARRT Musculoskeletal Radiographic Anatomy | Study Guide",
      "Study musculoskeletal anatomy for the ARRT exam: long bone structure, joint types, carpal bones, shoulder/elbow/pelvis anatomy, and growth plate identification."
    ),

    camrt("anatomy", "Thoracic & Chest Anatomy for Imaging (CAMRT)",
      "camrt-thoracic-anatomy",
      "Thoracic radiographic anatomy in the CAMRT curriculum follows the same anatomical principles with emphasis on systematic image review used in Canadian practice. The thorax contains 12 pairs of ribs, thoracic vertebrae, and the sternum. The mediastinum is divided into superior and inferior compartments, with the inferior further divided into anterior, middle, and posterior divisions. The trachea bifurcates at the carina (T4-T5) into right and left main bronchi. The right main bronchus is shorter, wider, and more vertical -- relevant for foreign body aspiration. Lung anatomy includes the right lung (3 lobes: upper, middle, lower separated by horizontal and oblique fissures) and left lung (2 lobes: upper and lower separated by oblique fissure). The lingula is the anatomical equivalent of the right middle lobe. The hilum contains the pulmonary arteries, veins, bronchi, and lymph nodes. Canadian technologists use a systematic approach to chest radiograph review: ABCDEFGHI (Airway, Bones, Cardiac, Diaphragm, Effusion/Extra-pulmonary, Fields, Gastric bubble, Hilum, Instruments/lines). The costophrenic and cardiophrenic angles are assessed for pathology.",
      "Systematic thoracic anatomy review is essential for CAMRT-certified technologists.",
      ["Mediastinal divisions", "Right 3 lobes, left 2 lobes", "Lingula", "Hilum contents", "ABCDEFGHI review", "Carina T4-T5", "Costophrenic angles"],
      [
        { question: "How many lobes does the right lung have?", options: ["1", "2", "3", "4"], correctIndex: 2, rationale: "The right lung has three lobes (upper, middle, lower) separated by the horizontal and oblique fissures." },
        { question: "The lingula is the anatomical equivalent of which right lung structure?", options: ["Right upper lobe", "Right middle lobe", "Right lower lobe", "Right hilum"], correctIndex: 1, rationale: "The lingula of the left lung is the anatomical equivalent of the right middle lobe." },
        { question: "In the ABCDEFGHI systematic review, 'D' stands for:", options: ["Density", "Diaphragm", "Disease", "Dorsal spine"], correctIndex: 1, rationale: "In the systematic chest review mnemonic, D stands for Diaphragm, assessing position, contour, and costophrenic angles." }
      ],
      2, "CAMRT Thoracic Anatomy for Medical Imaging | Canadian Study Guide",
      "Master thoracic anatomy for CAMRT certification: lung lobes, mediastinal divisions, systematic chest review, and Canadian imaging assessment approaches."
    ),

    camrt("anatomy", "Abdominal & Pelvic Anatomy for Imaging (CAMRT)",
      "camrt-abdominal-pelvic-anatomy",
      "Abdominal and pelvic radiographic anatomy in Canadian CAMRT practice emphasizes systematic identification of normal structures and recognition of abnormal findings. The abdomen is divided into nine regions or four quadrants. Solid organs include the liver (right upper quadrant/right hypochondrium), spleen (left upper quadrant), kidneys (retroperitoneal, T12-L3 level), pancreas (retroperitoneal, across L1-L2), and adrenal glands (superior to kidneys). Hollow organs include the stomach, small intestine (duodenum, jejunum, ileum), and large intestine (cecum, ascending, transverse, descending, sigmoid colon, rectum). The five radiographic densities from most to least radiopaque are: metal, bone, water/soft tissue, fat, and gas. Normal abdominal film assessment includes bowel gas pattern evaluation, calcification identification, soft tissue masses, skeletal structures, and foreign bodies. The pelvis demonstrates the innominate bones, sacrum, coccyx, femoral heads, and soft tissue structures. Canadian technologists follow systematic abdominal assessment protocols aligned with CAMRT competency profiles.",
      "Abdominal anatomy knowledge supports proper positioning and image evaluation in Canadian practice.",
      ["Nine regions / four quadrants", "Retroperitoneal organs", "Five radiographic densities", "Bowel gas patterns", "Solid vs hollow organs", "Pelvic landmarks", "Systematic assessment"],
      [
        { question: "Which organs are retroperitoneal?", options: ["Liver and spleen", "Stomach and duodenum", "Kidneys, pancreas, and adrenals", "Gallbladder and appendix"], correctIndex: 2, rationale: "Retroperitoneal organs include the kidneys, ureters, adrenal glands, pancreas, and parts of the duodenum and colon." },
        { question: "The five radiographic densities in order from most to least radiopaque are:", options: ["Air, fat, water, bone, metal", "Metal, bone, water, fat, air", "Bone, metal, water, air, fat", "Metal, water, bone, fat, air"], correctIndex: 1, rationale: "From most to least radiopaque: metal > bone > water/soft tissue > fat > air (gas)." },
        { question: "Normal small bowel is located:", options: ["Peripherally", "Centrally", "Only in the pelvis", "Only in the upper abdomen"], correctIndex: 1, rationale: "Small bowel loops are centrally located in the abdomen, while large bowel is peripheral, forming a frame." }
      ],
      2, "CAMRT Abdominal & Pelvic Anatomy for Imaging | Canadian Study Guide",
      "Study abdominal anatomy for CAMRT certification: organ positions, radiographic densities, bowel gas patterns, pelvic anatomy, and systematic assessment."
    ),

    camrt("anatomy", "Extremity Anatomy for Radiographic Imaging (CAMRT)",
      "camrt-extremity-anatomy",
      "Upper and lower extremity anatomy is extensively tested in the CAMRT certification examination. The upper extremity includes the hand (14 phalanges, 5 metacarpals), wrist (8 carpal bones in two rows), forearm (radius laterally, ulna medially), elbow (three joints), humerus, and shoulder girdle. Carpal bones proximal row: scaphoid, lunate, triquetrum, pisiform. Distal row: trapezium, trapezoid, capitate, hamate. The scaphoid is the most commonly fractured carpal bone and may show a negative radiograph initially. The lower extremity includes the foot (14 phalanges, 5 metatarsals, 7 tarsal bones), ankle (tibiotalar joint), leg (tibia medially, fibula laterally), knee (femorotibial and femoropatellar joints), and femur. The tarsal bones include the calcaneus (largest), talus, navicular, cuboid, and three cuneiforms. Key anatomical landmarks for positioning include the epicondyles, malleoli, greater trochanter, ASIS, and acromion process. In Canadian practice, CAMRT competencies require technologists to identify normal anatomy and recognize common pathological conditions on extremity radiographs.",
      "Extremity anatomy knowledge is fundamental for positioning and image evaluation in CAMRT practice.",
      ["Carpal bones 2 rows", "Scaphoid most fractured", "Tarsal bones", "Radius lateral, ulna medial", "Tibia medial, fibula lateral", "Key landmarks", "CAMRT competencies"],
      [
        { question: "The radius is located on which side of the forearm?", options: ["Medial", "Lateral (thumb side)", "Posterior", "It varies"], correctIndex: 1, rationale: "The radius is lateral (thumb side) in anatomical position; the ulna is medial (little finger side)." },
        { question: "How many carpal bones are in the wrist?", options: ["6", "7", "8", "10"], correctIndex: 2, rationale: "There are 8 carpal bones arranged in two rows of four: proximal (scaphoid, lunate, triquetrum, pisiform) and distal (trapezium, trapezoid, capitate, hamate)." },
        { question: "The largest tarsal bone is the:", options: ["Talus", "Navicular", "Calcaneus", "Cuboid"], correctIndex: 2, rationale: "The calcaneus (heel bone) is the largest tarsal bone and forms the prominence of the heel." }
      ],
      2, "CAMRT Extremity Anatomy for Imaging | Canadian Study Guide",
      "Master upper and lower extremity anatomy for CAMRT certification: carpal bones, tarsal bones, joints, landmarks, and Canadian positioning competencies."
    ),

    // ===== IMAGE INTERPRETATION =====
    arrt("interpretation", "Chest Radiograph Interpretation Basics (ARRT)",
      "arrt-chest-interpretation",
      "Systematic chest radiograph interpretation is a critical skill for radiologic technologists. Begin with technical assessment: check for proper positioning (no rotation -- equal clavicular distances from spinous process), adequate inspiration (10 posterior ribs), and appropriate exposure (vertebral bodies faintly visible through cardiac silhouette). Follow a systematic approach: Airway (trachea midline, no deviation), Bones (ribs, clavicles, spine for fractures or lesions), Cardiac (size CTR <0.5, shape, borders), Diaphragm (right higher than left, sharp costophrenic angles), Everything else (soft tissues, tubes, lines, devices). Common findings to recognize: pneumothorax (visceral pleural line with absent lung markings beyond), pleural effusion (meniscus sign, blunted costophrenic angle), pneumonia (airspace opacification with air bronchograms), cardiomegaly (CTR >0.5 on PA), and pneumoperitoneum (free air under diaphragm on upright). Critical findings requiring immediate communication include tension pneumothorax, widened mediastinum (possible aortic injury), and malpositioned tubes/lines.",
      "Recognizing normal anatomy and common pathology on chest radiographs is essential for technologist competency.",
      ["Technical assessment first", "ABCDE systematic approach", "CTR <0.5 normal", "10 posterior ribs", "Pneumothorax signs", "Critical findings", "Air bronchograms"],
      [
        { question: "What confirms adequate inspiration on a PA chest radiograph?", options: ["6 posterior ribs", "8 anterior ribs", "10 posterior ribs", "12 ribs total"], correctIndex: 2, rationale: "Visualization of 10 posterior ribs above the diaphragm confirms adequate inspiration on PA chest." },
        { question: "A meniscus sign on chest radiograph indicates:", options: ["Pneumothorax", "Pleural effusion", "Pneumonia", "Cardiomegaly"], correctIndex: 1, rationale: "The meniscus sign (concave upward fluid level) is characteristic of pleural effusion on upright chest radiograph." },
        { question: "Cardiomegaly on PA chest is defined as CTR greater than:", options: ["0.25", "0.35", "0.5", "0.75"], correctIndex: 2, rationale: "Cardiothoracic ratio greater than 0.5 on PA chest radiograph indicates cardiomegaly." }
      ],
      2, "ARRT Chest Radiograph Interpretation Basics | Study Guide",
      "Learn chest radiograph interpretation for the ARRT exam: systematic review, normal anatomy, common pathology, and critical findings requiring communication."
    ),

    arrt("interpretation", "Skeletal Radiograph Assessment (ARRT)",
      "arrt-skeletal-interpretation",
      "Skeletal radiograph assessment requires systematic evaluation of bones, joints, and soft tissues. Use the ABCs approach: Alignment (joint congruity, anatomic position), Bone (density, texture, cortical integrity, periosteal reaction), Cartilage (joint space width, subchondral bone), and Soft tissues (swelling, calcifications, fat pads). Fracture terminology: location (epiphyseal, metaphyseal, diaphyseal), type (transverse, oblique, spiral, comminuted, greenstick, torus), displacement (angulation, shortening, rotation), and open vs closed. Specific fracture patterns: Colles (distal radius with dorsal angulation), Smith (distal radius with volar angulation), boxer's (5th metacarpal neck), Salter-Harris (growth plate injuries types I-V), and Jefferson (C1 ring fracture). Joint pathology: osteoarthritis (joint space narrowing, osteophytes, subchondral sclerosis, cysts), rheumatoid arthritis (periarticular erosions, osteopenia, symmetric), and gout (punched-out erosions with overhanging margins). Fat pad signs: posterior fat pad at elbow (always abnormal, indicates effusion), pronator fat pad at wrist, and pre-vertebral soft tissue widening at C-spine.",
      "Skeletal image assessment is a core ARRT competency.",
      ["ABCs approach", "Fracture terminology", "Colles vs Smith", "Salter-Harris classification", "OA vs RA signs", "Fat pad signs", "Open vs closed fractures"],
      [
        { question: "A Colles fracture involves:", options: ["Distal radius with volar angulation", "Distal radius with dorsal angulation", "Proximal radius fracture", "Ulnar styloid only"], correctIndex: 1, rationale: "Colles fracture is a distal radius fracture with dorsal (posterior) angulation and displacement, the most common adult wrist fracture." },
        { question: "Salter-Harris fractures involve:", options: ["Articular cartilage only", "Growth plate injuries in pediatric patients", "Pathologic bone only", "Stress fractures"], correctIndex: 1, rationale: "Salter-Harris classification (Types I-V) describes fractures involving the physis (growth plate) in pediatric patients." },
        { question: "Classic radiographic findings of osteoarthritis include:", options: ["Periarticular erosions and osteopenia", "Joint space narrowing, osteophytes, and subchondral sclerosis", "Punched-out erosions with overhanging margins", "Diffuse osteoporosis"], correctIndex: 1, rationale: "OA shows joint space narrowing, osteophyte formation, subchondral sclerosis, and subchondral cyst formation." }
      ],
      3, "ARRT Skeletal Radiograph Assessment | Study Guide",
      "Master skeletal radiograph assessment for the ARRT exam: ABCs approach, fracture classification, joint pathology, fat pad signs, and systematic evaluation."
    ),

    arrt("interpretation", "Abdominal Radiograph Evaluation (ARRT)",
      "arrt-abdominal-interpretation",
      "Abdominal radiograph evaluation follows a systematic approach to identify normal and abnormal findings. Technical assessment confirms proper positioning, exposure, and inclusion of anatomy from diaphragm to pubic symphysis. Systematic review includes: bowel gas pattern (small bowel centrally with valvulae conniventes, large bowel peripherally with haustra; dilated small bowel >3 cm, large bowel >6 cm, cecum >9 cm suggests obstruction -- the 3/6/9 rule), soft tissue organs (liver, spleen, kidneys, psoas shadows, bladder), calcifications (gallstones 10-15% radiopaque, renal calculi 90% radiopaque, vascular calcifications, appendicolith), skeletal structures (lumbar spine, pelvis, lower ribs), and foreign bodies/free air. Small bowel obstruction shows dilated proximal loops with air-fluid levels on upright/decubitus and absent or reduced gas distally. Large bowel obstruction shows colonic dilation to the point of obstruction. Free intraperitoneal air (pneumoperitoneum) is best detected on the upright chest or left lateral decubitus and appears as a crescent of air under the diaphragm.",
      "Abdominal radiograph interpretation skills are tested on the ARRT exam and critical in clinical practice.",
      ["3/6/9 rule", "Small vs large bowel obstruction", "Pneumoperitoneum", "Calcification types", "Air-fluid levels", "Psoas shadow loss", "Systematic review"],
      [
        { question: "The 3/6/9 rule for bowel dilation refers to:", options: ["Number of films needed", "Small bowel >3 cm, large bowel >6 cm, cecum >9 cm", "Timing of serial films", "Patient positioning angles"], correctIndex: 1, rationale: "The 3/6/9 rule: dilated small bowel >3 cm, large bowel >6 cm, or cecum >9 cm suggests obstruction." },
        { question: "What percentage of renal calculi are radiopaque?", options: ["10-15%", "50%", "75%", "90%"], correctIndex: 3, rationale: "Approximately 90% of renal calculi are radiopaque (calcium-containing) and visible on plain radiographs." },
        { question: "Free air under the diaphragm is best detected on:", options: ["Supine abdomen", "Upright chest or left lateral decubitus", "Prone abdomen", "CT only"], correctIndex: 1, rationale: "Free intraperitoneal air rises to the highest point and is best seen under the diaphragm on upright chest or left lateral decubitus." }
      ],
      2, "ARRT Abdominal Radiograph Evaluation | Study Guide",
      "Study abdominal radiograph interpretation for the ARRT exam: bowel patterns, the 3/6/9 rule, calcifications, free air, and systematic evaluation approach."
    ),

    camrt("interpretation", "Systematic Chest Image Review (CAMRT)",
      "camrt-chest-image-review",
      "Canadian CAMRT practice emphasizes a systematic approach to chest radiograph review as part of technologist image quality assessment. The ABCDEFGHI mnemonic guides review: Airway (trachea position, patency), Bones (ribs, clavicles, spine), Cardiac (size, shape, borders), Diaphragm (position, contour, angles), Effusion/Extra-pulmonary spaces, Fields (lung parenchyma, interstitial patterns), Gastric bubble (position, free air above), Hilum (symmetry, density), and Instruments/lines (ETT, central lines, chest tubes, pacemakers). Technical adequacy assessment: rotation (clavicular symmetry), inspiration (10 posterior ribs), exposure (vertebral bodies visible through heart), and inclusion of anatomy. Common pathological patterns recognized by Canadian technologists include consolidation (airspace opacification), interstitial patterns (reticular, nodular, reticulonodular), pleural abnormalities (effusion, thickening, pneumothorax), and mediastinal abnormalities (widening, shift, mass). Critical findings that require immediate technologist-to-radiologist communication per CAMRT and CAR guidelines include tension pneumothorax, malpositioned life-support devices, and significant interval changes.",
      "Systematic chest review methodology is a core CAMRT competency for image quality assurance.",
      ["ABCDEFGHI mnemonic", "Technical adequacy", "Consolidation patterns", "Interstitial patterns", "Critical findings protocol", "CAR communication guidelines", "Technologist image assessment"],
      [
        { question: "In the ABCDEFGHI chest review, what does 'G' represent?", options: ["Glands", "Gastric bubble", "Grid lines", "Growth plates"], correctIndex: 1, rationale: "G represents the Gastric bubble, helping to confirm left-side positioning and detect free air above it." },
        { question: "Which pattern describes patchy lung opacification replacing air?", options: ["Interstitial", "Consolidation (airspace)", "Atelectasis only", "Fibrosis only"], correctIndex: 1, rationale: "Consolidation (airspace opacification) occurs when alveolar air is replaced by fluid, pus, blood, or cells." },
        { question: "Who establishes critical findings communication guidelines in Canada?", options: ["CNSC", "PHAC", "CAR and CAMRT", "Provincial health ministers"], correctIndex: 2, rationale: "The Canadian Association of Radiologists (CAR) and CAMRT establish guidelines for critical findings communication." }
      ],
      2, "CAMRT Systematic Chest Image Review | Canadian Study Guide",
      "Master systematic chest radiograph review for CAMRT certification: ABCDEFGHI approach, technical assessment, pathological patterns, and Canadian communication protocols."
    ),

    camrt("interpretation", "Musculoskeletal Image Assessment (CAMRT)",
      "camrt-musculoskeletal-assessment",
      "Musculoskeletal image assessment in Canadian CAMRT practice uses the systematic ABCS approach: Alignment (joint surfaces congruent, normal anatomical relationships), Bone (density, cortical margins, trabecular pattern, periosteal reaction), Cartilage (joint space preservation, subchondral bone), and Soft tissues (swelling, calcification, fat planes). Canadian technologists are expected to recognize common fracture patterns and ensure adequate imaging. Fracture assessment includes describing location, type, displacement, angulation, and associated soft tissue findings. Common pediatric considerations include growth plate injuries (Salter-Harris classification), incomplete fractures (greenstick, torus/buckle), and normal developmental variants that mimic pathology. The Ottawa Ankle Rules and Ottawa Knee Rules, developed at the Ottawa Hospital, are Canadian-origin clinical decision rules that help determine the need for radiography in extremity injuries. CAMRT technologists must evaluate image quality to ensure diagnostic adequacy, including proper positioning, exposure, and inclusion of relevant anatomy.",
      "Musculoskeletal assessment skills support CAMRT technologist competency in image quality evaluation.",
      ["ABCS systematic approach", "Fracture description", "Salter-Harris classification", "Ottawa Rules (Canadian)", "Pediatric variants", "Image quality evaluation", "Incomplete fractures"],
      [
        { question: "The Ottawa Ankle Rules were developed in:", options: ["Toronto, Canada", "Ottawa, Canada", "London, UK", "New York, USA"], correctIndex: 1, rationale: "The Ottawa Ankle Rules and Ottawa Knee Rules are Canadian-origin clinical decision tools developed at the Ottawa Hospital." },
        { question: "In the ABCS assessment, 'C' refers to:", options: ["Contrast", "Cartilage (joint space)", "Calcification", "Cortex only"], correctIndex: 1, rationale: "C in ABCS represents Cartilage, assessing joint space width and subchondral bone integrity." },
        { question: "A torus (buckle) fracture is characteristic of:", options: ["Elderly osteoporotic bone", "Pediatric bone", "Pathologic bone", "Stress injuries"], correctIndex: 1, rationale: "Torus (buckle) fractures are incomplete fractures seen in pediatric patients where the cortex buckles without complete disruption." }
      ],
      2, "CAMRT Musculoskeletal Image Assessment | Canadian Study Guide",
      "Study musculoskeletal assessment for CAMRT certification: ABCS approach, fracture evaluation, Ottawa Rules, pediatric considerations, and image quality assessment."
    ),

    camrt("interpretation", "Abdominal Image Evaluation (CAMRT)",
      "camrt-abdominal-evaluation",
      "Abdominal radiograph evaluation in Canadian CAMRT practice follows a systematic approach to ensure comprehensive assessment. The standard evaluation includes: technical adequacy (positioning, exposure, anatomy inclusion), bowel gas pattern (normal distribution, dilation using the 3/6/9 rule for small bowel, large bowel, and cecum respectively), solid organs (liver, spleen, kidney shadows), calcifications (vascular, urinary tract -- 90% radiopaque, biliary -- 10-15% radiopaque, appendicolith), soft tissue signs (psoas margins, properitoneal fat stripe, flank stripe), skeletal structures (lumbar spine, pelvis, lower ribs), and foreign bodies or artifacts. Canadian technologists must recognize signs of bowel obstruction including dilated loops, air-fluid levels on erect films, and the transition point. The erect or left lateral decubitus film is essential for detecting free air (pneumoperitoneum), which appears as a lucency beneath the diaphragm. Critical findings requiring immediate communication per CAMRT standards include pneumoperitoneum, high-grade obstruction, and abdominal aortic aneurysm greater than 5 cm.",
      "Abdominal image evaluation competency is assessed on the CAMRT certification examination.",
      ["Systematic review", "3/6/9 dilation rule", "Calcification types", "Soft tissue signs", "Free air detection", "Critical findings", "Erect/decubitus views"],
      [
        { question: "An appendicolith is a calcification found in the:", options: ["Gallbladder", "Kidney", "Appendix", "Bladder"], correctIndex: 2, rationale: "An appendicolith is a calcified deposit in the appendix, often associated with appendicitis." },
        { question: "Loss of the psoas shadow may indicate:", options: ["Normal variant", "Retroperitoneal pathology", "Bowel obstruction", "Liver enlargement"], correctIndex: 1, rationale: "Loss of the psoas shadow on abdominal radiograph may indicate retroperitoneal fluid, hemorrhage, or mass." },
        { question: "The left lateral decubitus position is used to detect:", options: ["Bowel obstruction", "Free intraperitoneal air", "Kidney stones", "Liver mass"], correctIndex: 1, rationale: "Left lateral decubitus position allows free air to rise to the non-dependent right side, visible between the liver and abdominal wall." }
      ],
      2, "CAMRT Abdominal Image Evaluation | Canadian Study Guide",
      "Master abdominal radiograph evaluation for CAMRT certification: systematic approach, bowel patterns, calcifications, free air, and Canadian critical findings protocols."
    ),

    // ===== CONTRAST MEDIA =====
    arrt("contrast_media", "Iodinated Contrast Agents (ARRT)",
      "arrt-iodinated-contrast",
      "Iodinated contrast agents are the most commonly used intravascular contrast media in diagnostic imaging. They enhance visualization by increasing X-ray attenuation through iodine's high atomic number (Z=53). Classification: ionic vs non-ionic, and high osmolality (HOCM, 5-8x plasma), low osmolality (LOCM, 2-3x plasma), and iso-osmolar (IOCM, equal to plasma). Non-ionic LOCM (iohexol, iopamidol, ioversol) are the standard of care due to fewer adverse reactions. Iso-osmolar contrast (iodixanol) is preferred for patients at highest risk. Contrast is administered IV, typically via power injector at rates of 2-5 mL/sec for CT. Warming contrast to body temperature reduces viscosity and adverse reactions. Contrast is excreted primarily by the kidneys via glomerular filtration. Pre-procedure screening includes allergy history, renal function (eGFR), metformin use, thyroid disease, and pregnancy status. ACR Manual on Contrast Media is the definitive US reference for contrast safety.",
      "Iodinated contrast pharmacology is a core ARRT exam topic.",
      ["Ionic vs non-ionic", "HOCM LOCM IOCM", "Iodine Z=53", "Power injection rates", "Renal excretion", "ACR Contrast Manual", "Warming reduces viscosity"],
      [
        { question: "Non-ionic LOCM replaced ionic HOCM because of:", options: ["Lower cost", "Fewer adverse reactions", "Better image quality", "Longer shelf life"], correctIndex: 1, rationale: "Non-ionic LOCM agents have significantly fewer adverse reactions compared to ionic HOCM agents." },
        { question: "Iodinated contrast is excreted primarily by:", options: ["Liver", "Lungs", "Kidneys via glomerular filtration", "GI tract"], correctIndex: 2, rationale: "Iodinated contrast agents are water-soluble and excreted primarily by the kidneys through glomerular filtration." },
        { question: "Warming contrast media before injection:", options: ["Increases osmolality", "Reduces viscosity and adverse reactions", "Extends shelf life", "Increases iodine concentration"], correctIndex: 1, rationale: "Warming contrast to body temperature reduces its viscosity, improving flow during injection and reducing some adverse reactions." }
      ],
      2, "ARRT Iodinated Contrast Agents | Pharmacology Study Guide",
      "Study iodinated contrast pharmacology for the ARRT exam: classification, osmolality, administration, screening, excretion, and ACR safety guidelines."
    ),

    arrt("contrast_media", "Contrast Reaction Management (ARRT)",
      "arrt-contrast-reaction-management",
      "Contrast adverse reactions range from mild to life-threatening. Mild reactions (urticaria, pruritus, nasal congestion, nausea, warmth) occur in 3-15% of HOCM and 1-3% of LOCM injections. Most mild reactions are self-limiting. Moderate reactions (widespread urticaria, bronchospasm, facial/laryngeal edema, vasovagal reactions) require pharmacological treatment. Severe reactions (cardiovascular collapse, severe bronchospasm, laryngeal edema with stridor, seizures, cardiac arrest) are rare (<0.04%) but life-threatening. Prior reaction is the strongest risk factor with 17-35% recurrence rate without premedication. The ACR premedication regimen: prednisone 50 mg PO at 13, 7, and 1 hour before contrast, plus diphenhydramine 50 mg at 1 hour before. Treatment: epinephrine 0.3-0.5 mg IM (1:1000 or auto-injector) is ALWAYS first-line for severe anaphylaxis. Albuterol nebulizer for bronchospasm. IV fluids and Trendelenburg for hypotension. Extravasation management: elevate extremity, apply warm or cold compresses, estimate volume extravasated, and consult if >100 mL or compartment syndrome suspected.",
      "Contrast reaction management is a patient safety priority and core ARRT exam topic.",
      ["Mild moderate severe classification", "17-35% recurrence rate", "Premedication regimen", "Epinephrine first-line", "Extravasation management", "ACR guidelines", "Vasovagal response"],
      [
        { question: "First-line treatment for severe contrast anaphylaxis is:", options: ["Diphenhydramine 50 mg IV", "Hydrocortisone 200 mg IV", "Epinephrine 0.3-0.5 mg IM", "Normal saline 1L bolus"], correctIndex: 2, rationale: "Epinephrine IM is ALWAYS the first-line treatment for severe anaphylaxis -- delays increase mortality." },
        { question: "Without premedication, prior contrast reaction recurrence rate is:", options: ["1-5%", "5-10%", "17-35%", "50-75%"], correctIndex: 2, rationale: "Prior reaction carries a 17-35% recurrence rate without premedication, the highest risk factor." },
        { question: "Extravasation exceeding what volume warrants surgical consultation?", options: ["10 mL", "50 mL", "100 mL", "500 mL"], correctIndex: 2, rationale: "Extravasation volumes exceeding 100 mL or signs of compartment syndrome warrant surgical consultation." }
      ],
      2, "ARRT Contrast Reaction Management | Emergency Study Guide",
      "Master contrast reaction management for the ARRT exam: reaction classification, risk factors, premedication, epinephrine use, and extravasation protocols."
    ),

    arrt("contrast_media", "Barium Studies & GI Contrast (ARRT)",
      "arrt-barium-gi-contrast",
      "Barium sulfate is the standard contrast agent for gastrointestinal fluoroscopic studies. It is inert, non-absorbed, and provides excellent mucosal coating. Single-contrast studies use barium alone for filling defects and obstruction evaluation. Double-contrast studies use barium plus gas (CO2 or effervescent crystals) for mucosal detail -- superior for detecting early mucosal lesions. Upper GI series evaluates esophagus, stomach, and duodenum. Barium swallow specifically examines esophageal motility and morphology. Small bowel follow-through tracks barium through the small intestine. Barium enema evaluates the colon and rectum. Water-soluble contrast (Gastrografin/diatrizoate) must be used instead of barium when perforation is suspected -- barium causes severe peritonitis if it enters the peritoneal cavity or mediastinum. Contraindications to barium include suspected perforation, pre-surgical evaluation, and significant aspiration risk (barium aspiration can cause chemical pneumonitis). Post-procedure patient care includes hydration encouragement and monitoring for constipation (barium can cause impaction).",
      "GI contrast procedures remain important ARRT exam topics despite declining clinical volume.",
      ["Single vs double contrast", "Barium coating properties", "Water-soluble for perforation", "Upper GI series", "Barium enema", "Aspiration risk", "Post-procedure care"],
      [
        { question: "When is water-soluble contrast used instead of barium?", options: ["For all GI studies", "When perforation is suspected", "For better mucosal detail", "For pediatric patients only"], correctIndex: 1, rationale: "Water-soluble contrast (Gastrografin) replaces barium when perforation is suspected because barium causes severe peritonitis." },
        { question: "Double-contrast GI studies use:", options: ["Two types of barium", "Barium plus gas", "Barium plus iodinated contrast", "Water-soluble contrast only"], correctIndex: 1, rationale: "Double-contrast studies use barium to coat the mucosa plus gas (CO2) to distend the lumen for mucosal detail." },
        { question: "A significant post-barium complication is:", options: ["Renal failure", "Constipation/impaction", "Liver damage", "Bone marrow suppression"], correctIndex: 1, rationale: "Barium can cause constipation and even impaction post-procedure; patients should be advised to hydrate well." }
      ],
      2, "ARRT Barium Studies & GI Contrast | Study Guide",
      "Study GI contrast procedures for the ARRT exam: barium studies, water-soluble contrast, single/double contrast, contraindications, and patient care."
    ),

    camrt("contrast_media", "Contrast Media Types & Properties (CAMRT)",
      "camrt-contrast-media-types",
      "Contrast media in Canadian CAMRT practice are classified as positive (radiopaque: iodinated and barium) or negative (radiolucent: air and CO2). Iodinated contrast agents are further classified by ionicity (ionic vs non-ionic), osmolality (HOCM, LOCM, IOCM), and route (intravascular, oral, intrathecal). In Canada, non-ionic LOCM agents are the standard of care for intravascular use, consistent with CAR (Canadian Association of Radiologists) guidelines. Iodinated contrast is measured in mg I/mL (milligrams of iodine per millilitre). Standard concentrations are 300-370 mg I/mL for CT. Gadolinium-based contrast agents (GBCAs) are used in MRI and are classified by structure (linear vs macrocyclic) and charge (ionic vs non-ionic). Macrocyclic agents have lower risk of nephrogenic systemic fibrosis (NSF). Health Canada monitors GBCA safety through adverse reaction reporting. Barium sulfate suspension is used for GI fluoroscopy. Canadian regulatory oversight of contrast agents falls under Health Canada's Health Products and Food Branch, which approves drugs for use in Canada through the Drug Identification Number (DIN) system.",
      "Contrast media knowledge within Canadian regulatory frameworks supports CAMRT practice.",
      ["Positive vs negative contrast", "Ionic vs non-ionic", "LOCM standard", "Gadolinium classification", "Macrocyclic vs linear", "Health Canada oversight", "DIN system"],
      [
        { question: "Which gadolinium agent type has lower NSF risk?", options: ["Linear ionic", "Linear non-ionic", "Macrocyclic", "All have equal risk"], correctIndex: 2, rationale: "Macrocyclic gadolinium agents have more stable chelation and lower risk of NSF compared to linear agents." },
        { question: "Contrast agents in Canada are approved through:", options: ["CNSC licensing", "Health Canada DIN system", "CAMRT certification", "Provincial pharmacy boards"], correctIndex: 1, rationale: "Health Canada's Health Products and Food Branch approves contrast agents through the Drug Identification Number (DIN) system." },
        { question: "Standard iodine concentration for CT contrast is:", options: ["100-200 mg I/mL", "200-250 mg I/mL", "300-370 mg I/mL", "500-600 mg I/mL"], correctIndex: 2, rationale: "Standard CT contrast concentrations are 300-370 mg I/mL, providing optimal enhancement for diagnostic imaging." }
      ],
      2, "CAMRT Contrast Media Types & Properties | Canadian Study Guide",
      "Study contrast media for CAMRT certification: iodinated and gadolinium agents, classification, Health Canada regulations, and Canadian practice guidelines."
    ),

    camrt("contrast_media", "Adverse Reaction Protocols (CAMRT)",
      "camrt-adverse-reaction-protocols",
      "Canadian contrast adverse reaction management follows CAR guidelines and institutional emergency protocols. Reactions are classified as acute (within 1 hour) or delayed (1 hour to 7 days). Acute reactions: mild (urticaria, pruritus, nausea -- self-limiting), moderate (diffuse urticaria, bronchospasm, facial edema -- require treatment), severe (anaphylaxis, cardiovascular collapse, severe bronchospasm -- life-threatening). The risk of severe reaction with non-ionic LOCM is approximately 0.01-0.04%. Pre-medication for prior reactors follows a corticosteroid protocol: prednisone 50 mg at 13, 7, and 1 hour before, plus diphenhydramine 50 mg 1 hour before contrast. Emergency treatment: epinephrine 0.3-0.5 mg IM (EpiPen or ampoule) is first-line for anaphylaxis. Canadian imaging departments must have emergency crash carts with standardized medications per provincial regulations. All staff must be trained in Basic Life Support (BLS) at minimum. Adverse reactions must be reported through Canada Vigilance Program (Health Canada's post-market surveillance system). Extravasation protocols follow institutional guidelines with elevation, compresses, and surgical consultation for large volumes or compartment syndrome.",
      "Adverse reaction management is a critical safety competency for CAMRT-certified technologists.",
      ["CAR guidelines", "Acute vs delayed reactions", "Pre-medication protocol", "Epinephrine first-line", "Canada Vigilance Program", "BLS requirement", "Crash cart standards"],
      [
        { question: "Adverse contrast reactions in Canada must be reported through:", options: ["CNSC", "Canada Vigilance Program", "CAMRT directly", "Provincial police"], correctIndex: 1, rationale: "The Canada Vigilance Program is Health Canada's post-market surveillance system for reporting adverse drug reactions." },
        { question: "The minimum life support training required for imaging staff is:", options: ["Advanced Cardiac Life Support", "Basic Life Support", "Pediatric Advanced Life Support", "No specific requirement"], correctIndex: 1, rationale: "All imaging department staff must maintain at minimum Basic Life Support (BLS) certification." },
        { question: "Delayed contrast reactions occur:", options: ["Immediately", "Within 30 minutes", "1 hour to 7 days post-injection", "Only after 1 week"], correctIndex: 2, rationale: "Delayed contrast reactions manifest from 1 hour to 7 days after injection, most commonly as skin reactions." }
      ],
      2, "CAMRT Adverse Contrast Reaction Protocols | Canadian Study Guide",
      "Master contrast reaction management for CAMRT certification: CAR guidelines, pre-medication, emergency treatment, Canada Vigilance reporting, and extravasation care."
    ),

    camrt("contrast_media", "GI Contrast Procedures (CAMRT)",
      "camrt-gi-contrast-procedures",
      "Gastrointestinal contrast studies in Canadian CAMRT practice use barium sulfate suspension or water-soluble iodinated contrast. Barium provides superior mucosal coating for fluoroscopic GI studies. Single-contrast technique fills the lumen with barium alone. Double-contrast technique uses barium coating plus gaseous distension (CO2 or effervescent agent) for detailed mucosal visualization. Common studies: barium swallow (esophageal motility and morphology), upper GI series (esophagus, stomach, duodenum), small bowel follow-through (jejunum and ileum transit), and barium enema (colon and rectum). In Canada, these studies follow CAR procedural guidelines. Water-soluble contrast (e.g., Gastrografin) replaces barium when bowel perforation is suspected -- barium leaking into the peritoneum or mediastinum causes severe chemical peritonitis or mediastinitis. Contraindications to barium include suspected perforation, planned surgery, and significant aspiration risk. Canadian facilities follow CAMRT scope of practice guidelines for technologist-performed fluoroscopy, which varies by province. Post-procedure instructions include hydration and monitoring for constipation.",
      "GI contrast studies remain relevant for CAMRT certification despite declining volumes due to endoscopy and CT.",
      ["Single vs double contrast", "Barium vs water-soluble", "Perforation contraindication", "CAR procedure guidelines", "Provincial scope variations", "Post-procedure care", "Aspiration risk"],
      [
        { question: "Why is barium contraindicated when perforation is suspected?", options: ["It obscures the perforation", "It causes severe peritonitis if it leaks", "It is too expensive", "It cannot demonstrate perforation"], correctIndex: 1, rationale: "Barium leaking through a perforation into the peritoneal cavity or mediastinum causes severe chemical peritonitis or mediastinitis." },
        { question: "Double-contrast technique provides superior visualization of:", options: ["Bowel lumen filling defects", "Mucosal surface detail", "Mesenteric vessels", "Retroperitoneal structures"], correctIndex: 1, rationale: "Double-contrast (barium plus gas) distends the bowel and coats the mucosa, providing excellent surface detail for small lesions." },
        { question: "Technologist scope for fluoroscopy in Canada is determined by:", options: ["Federal law only", "CAMRT alone", "Provincial regulations", "Individual hospital policy only"], correctIndex: 2, rationale: "Technologist scope of practice for fluoroscopy varies by province in Canada, governed by provincial regulatory bodies." }
      ],
      2, "CAMRT GI Contrast Procedures | Canadian Study Guide",
      "Study GI contrast studies for CAMRT certification: barium techniques, water-soluble alternatives, CAR guidelines, provincial scope, and patient care."
    ),

    // ===== QUALITY CONTROL =====
    arrt("quality_control", "Radiographic Equipment QC Programs (ARRT)",
      "arrt-radiographic-qc-programs",
      "Quality control programs are mandated by state regulations, accreditation bodies (ACR, Joint Commission), and federal agencies (FDA/MQSA for mammography). QC ensures consistent, high-quality diagnostic images at minimal patient dose. Acceptance testing establishes baseline performance for new equipment. Routine QC tests and frequencies: Daily -- visual inspection, warm-up procedure, CR/DR artifact check. Monthly -- exposure reproducibility (CV <0.05), collimator light field accuracy (within 2% SID), exposure linearity (mR/mAs within 10% across mA stations). Quarterly -- kVp accuracy (within ±5%), AEC consistency (optical density variation ±0.3 or exposure within 10%). Annually -- half-value layer (meets minimum per kVp), focal spot size, grid alignment, SID indicator accuracy, radiation output (within ±5% of expected). Lead apron testing annually via fluoroscopy. The ACR mammography QC program under MQSA includes specific daily, weekly, monthly, quarterly, and semi-annual tests. Reject/repeat analysis (target <5% repeat rate) identifies technique problems. Records must be maintained and available for inspection.",
      "QC program management is essential for ARRT certification and regulatory compliance.",
      ["Acceptance testing", "Daily/monthly/quarterly/annual tests", "MQSA requirements", "Reject analysis <5%", "CV <0.05 reproducibility", "HVL requirements", "Record keeping"],
      [
        { question: "Acceptable reject/repeat rate target is:", options: ["<1%", "<2%", "<5%", "<10%"], correctIndex: 2, rationale: "The target reject/repeat rate is less than 5%; rates above this indicate systematic problems requiring investigation." },
        { question: "Acceptance testing establishes:", options: ["Warranty coverage", "Baseline performance for new equipment", "Cost-benefit analysis", "Staff competency"], correctIndex: 1, rationale: "Acceptance testing documents the baseline performance of new equipment against manufacturer specifications and regulatory standards." },
        { question: "MQSA specifically regulates QC for:", options: ["CT scanners", "Fluoroscopy units", "Mammography equipment", "All X-ray equipment"], correctIndex: 2, rationale: "The Mammography Quality Standards Act (MQSA) specifically regulates mammography equipment, facility accreditation, and QC programs." }
      ],
      2, "ARRT Radiographic Equipment QC Programs | Study Guide",
      "Master QC programs for the ARRT exam: acceptance testing, routine test schedules, MQSA mammography requirements, reject analysis, and regulatory compliance."
    ),

    arrt("quality_control", "Image Quality Standards & Assessment (ARRT)",
      "arrt-image-quality-standards",
      "Image quality assessment in US radiographic practice follows ACR practice parameters and technical standards. Image evaluation criteria include: positioning accuracy (anatomical landmarks, rotation assessment), exposure adequacy (exposure indicator within target range, appropriate density/contrast), anatomy demonstrated (required structures visualized), artifact identification (patient, equipment, or processing artifacts), and patient information accuracy (correct patient, date, laterality markers). The radiologic technologist is responsible for evaluating every image before the patient leaves. Repeats should be performed when images do not meet diagnostic criteria. Image quality metrics tracked include contrast-to-noise ratio (CNR), signal-to-noise ratio (SNR), modulation transfer function (MTF) for spatial resolution, and detective quantum efficiency (DQE) for overall detector performance. Digital image quality depends on pixel size (determines limiting spatial resolution), bit depth (determines contrast resolution), and noise characteristics. Quality improvement initiatives track patterns in image quality, identify areas for improvement, and implement corrective actions.",
      "Image quality assessment competency ensures diagnostic adequacy and patient safety.",
      ["ACR standards", "Positioning evaluation", "Exposure indicators", "Repeat criteria", "CNR SNR MTF DQE", "Pixel size bit depth", "Quality improvement"],
      [
        { question: "The technologist should evaluate image quality:", options: ["After the patient leaves", "Only if the radiologist requests", "Before the patient leaves the department", "Only during QC testing"], correctIndex: 2, rationale: "The technologist must evaluate every image for diagnostic quality before the patient leaves to avoid unnecessary callbacks." },
        { question: "Detective quantum efficiency (DQE) measures:", options: ["Patient dose only", "Overall detector performance efficiency", "Display brightness", "Processing speed"], correctIndex: 1, rationale: "DQE is a comprehensive measure of detector performance, reflecting how efficiently the detector converts X-ray input to useful image signal." },
        { question: "Pixel size determines:", options: ["Contrast resolution", "Limiting spatial resolution", "Patient dose", "Processing speed"], correctIndex: 1, rationale: "Pixel size determines the limiting spatial resolution of a digital detector -- smaller pixels provide higher spatial resolution." }
      ],
      2, "ARRT Image Quality Standards & Assessment | Study Guide",
      "Study image quality assessment for the ARRT exam: ACR standards, evaluation criteria, digital metrics (CNR, SNR, MTF, DQE), and quality improvement."
    ),

    arrt("quality_control", "Digital System QC & Processor Maintenance (ARRT)",
      "arrt-digital-qc-processor",
      "Digital radiography QC encompasses both CR and DR system testing. CR plate QC: daily erase cycle before use, weekly dark noise and uniformity testing, monthly spatial resolution and exposure indicator calibration, and scheduled plate replacement based on artifact assessment and throughput count. DR flat-panel QC: daily flat-field (uniformity) correction, monthly dead/defective pixel map update, quarterly gain calibration, and annual spatial resolution and DQE measurement. Exposure indicator monitoring is critical for dose management -- every image should have its EI compared to the manufacturer's target. AAPM Task Group 116 standardized EI terminology with the deviation index (DI): DI = 0 is ideal, positive DI indicates overexposure, negative DI indicates underexposure. Acceptable DI range is -1.0 to +3.0 for most examinations. PACS QC includes monitor calibration to DICOM Grayscale Standard Display Function (GSDF), ambient light assessment, and network integrity testing. Mammography digital QC follows ACR digital mammography QC manual with specific phantom image quality requirements.",
      "Digital system QC knowledge ensures optimal performance and dose management.",
      ["CR plate lifecycle", "DR flat-field correction", "Deviation index", "AAPM TG-116", "Monitor calibration GSDF", "PACS QC", "Mammography digital QC"],
      [
        { question: "A positive deviation index (DI) indicates:", options: ["Underexposure", "Ideal exposure", "Overexposure", "Equipment malfunction"], correctIndex: 2, rationale: "Positive DI indicates the detector received more exposure than the target -- potential overexposure and dose creep." },
        { question: "Acceptable deviation index range for most examinations is:", options: ["-3.0 to +1.0", "-1.0 to +3.0", "-5.0 to +5.0", "0 to +1.0"], correctIndex: 1, rationale: "AAPM TG-116 recommends an acceptable DI range of -1.0 to +3.0 for most diagnostic examinations." },
        { question: "Display monitors should be calibrated to:", options: ["Maximum brightness", "DICOM GSDF standard", "Manufacturer default", "Ambient room light"], correctIndex: 1, rationale: "Medical display monitors are calibrated to the DICOM Grayscale Standard Display Function (GSDF) for consistent image presentation." }
      ],
      2, "ARRT Digital System QC & Maintenance | Study Guide",
      "Master digital system QC for the ARRT exam: CR/DR testing protocols, deviation index, AAPM TG-116, PACS QC, and monitor calibration standards."
    ),

    camrt("quality_control", "QC Programs Under Canadian Standards (CAMRT)",
      "camrt-qc-canadian-standards",
      "Quality control in Canadian imaging facilities follows CSA standards, provincial radiation safety regulations, and CAMRT quality management guidelines. Provincial radiation safety inspectors conduct periodic compliance audits. QC program elements include: acceptance testing (new equipment baseline), routine performance testing (daily, monthly, annual schedules), corrective action procedures, and documentation. Key QC tests: collimator accuracy (within 2% SID), kVp accuracy (within ±5%), exposure reproducibility (CV <0.05), mA linearity (within 10%), timer accuracy, half-value layer, AEC consistency, and focal spot measurement. Canadian facilities are increasingly adopting diagnostic reference levels (DRLs) published by CAR as dose optimization benchmarks. Equipment not meeting performance criteria must be taken out of clinical service immediately and repaired. Medical physicists oversee QC programs and provide annual equipment evaluations. The Canadian approach emphasizes a quality management system (QMS) framework aligned with ISO standards, integrating QC into a broader culture of continuous quality improvement.",
      "Understanding Canadian QC regulatory frameworks is essential for CAMRT certification.",
      ["CSA standards", "Provincial inspections", "Acceptance testing", "DRL benchmarks", "Medical physicist oversight", "QMS framework", "ISO alignment"],
      [
        { question: "Provincial radiation safety inspectors in Canada:", options: ["Only inspect hospitals", "Conduct periodic compliance audits of imaging facilities", "Are not involved in QC", "Only review documentation"], correctIndex: 1, rationale: "Provincial radiation safety inspectors conduct periodic audits to verify QC program compliance and equipment performance." },
        { question: "Canadian QC programs are increasingly aligned with:", options: ["US FDA standards", "ISO quality management system framework", "European CE marking", "Japanese JIS standards"], correctIndex: 1, rationale: "Canadian imaging facilities increasingly adopt ISO-aligned quality management system (QMS) frameworks for continuous improvement." },
        { question: "Equipment failing performance criteria must be:", options: ["Used with reduced workload", "Taken out of service immediately", "Reported at next inspection", "Used for training only"], correctIndex: 1, rationale: "Equipment not meeting performance standards must be immediately removed from clinical service until repaired and re-tested." }
      ],
      2, "CAMRT QC Programs Under Canadian Standards | Study Guide",
      "Study QC programs for CAMRT certification: CSA standards, provincial inspections, DRL benchmarks, medical physicist oversight, and quality management systems."
    ),

    camrt("quality_control", "Digital Imaging QC & Maintenance (CAMRT)",
      "camrt-digital-qc-maintenance",
      "Digital imaging QC in Canadian facilities covers CR, DR, and PACS systems. CR plate QC includes daily erasure cycles, periodic uniformity and artifact assessment, and plate replacement schedules. DR flat-panel detector QC includes daily calibration (flat-field correction), dead pixel monitoring, gain calibration, and spatial resolution verification. Canadian facilities monitor exposure indicators for every examination as part of dose optimization programs aligned with ALARA and CAR diagnostic reference levels. The standardized exposure indicator (per IEC 62494-1, adopted in Canada) uses the deviation index (DI) to assess exposure adequacy: DI of 0 is target, acceptable range typically -1.0 to +3.0. PACS QC includes monitor calibration to DICOM GSDF standards, network testing, and data integrity verification. Canadian privacy legislation requires PACS systems to meet provincial security standards for personal health information. Teleradiology QC includes transmission quality verification and display monitor compliance at remote reading sites. All QC documentation must be maintained per provincial regulatory requirements and available for inspection.",
      "Digital system QC within Canadian standards ensures image quality and regulatory compliance.",
      ["CR/DR QC protocols", "IEC 62494-1 exposure indicator", "Deviation index", "PACS security", "Provincial privacy compliance", "Teleradiology QC", "DICOM GSDF"],
      [
        { question: "The international standard for exposure indicators adopted in Canada is:", options: ["AAPM TG-116", "IEC 62494-1", "CSA Z94.1", "NCRP 147"], correctIndex: 1, rationale: "IEC 62494-1 defines the standardized exposure index terminology, adopted in Canadian practice for dose monitoring." },
        { question: "PACS systems in Canada must comply with:", options: ["Federal radiation limits only", "Provincial privacy legislation for health information", "International banking standards", "No specific privacy requirements"], correctIndex: 1, rationale: "PACS systems must comply with provincial privacy legislation governing personal health information security and access." },
        { question: "Flat-field correction in DR systems:", options: ["Adjusts patient positioning", "Calibrates detector uniformity", "Changes tube output", "Modifies display settings"], correctIndex: 1, rationale: "Flat-field (gain) correction calibrates the DR detector to produce uniform response across all detector elements." }
      ],
      2, "CAMRT Digital Imaging QC & Maintenance | Canadian Study Guide",
      "Master digital imaging QC for CAMRT certification: CR/DR protocols, exposure indicators, PACS compliance, teleradiology QC, and Canadian privacy requirements."
    ),

    camrt("quality_control", "Image Quality Evaluation Protocols (CAMRT)",
      "camrt-image-quality-evaluation",
      "Image quality evaluation in Canadian CAMRT practice is guided by CAMRT competency profiles and CAR quality guidelines. Every image must be evaluated by the technologist before the patient is released. Evaluation criteria include: positioning accuracy (correct anatomy demonstrated, proper alignment, rotation assessment), exposure adequacy (exposure indicator within target range, appropriate contrast and brightness), anatomy completeness (all required structures included), artifact assessment (patient-related, equipment-related, processing artifacts), and technical information (patient data, laterality markers, date/time). Canadian imaging departments track quality metrics including repeat rates (target <3-5%), exposure indicator trends, critical finding communication compliance, and patient wait times. Quality improvement programs use PDSA (Plan-Do-Study-Act) cycles aligned with Accreditation Canada's Qmentum program. Peer learning and case review programs are encouraged for technologist professional development. CAMRT's continuing competency program requires evidence of quality improvement participation.",
      "Image quality evaluation competency is central to CAMRT professional practice.",
      ["Technologist image evaluation", "CAMRT competency profiles", "Repeat rate targets", "PDSA cycles", "Qmentum program", "Peer learning", "Continuing competency"],
      [
        { question: "The target repeat rate for Canadian imaging departments is:", options: ["<1%", "<3-5%", "<10%", "<15%"], correctIndex: 1, rationale: "Canadian imaging departments target repeat rates of less than 3-5%, with rates above this triggering investigation." },
        { question: "Canadian quality improvement programs often use:", options: ["Random testing", "PDSA (Plan-Do-Study-Act) cycles", "Punitive measures", "Annual reviews only"], correctIndex: 1, rationale: "PDSA cycles provide a structured approach to quality improvement aligned with Accreditation Canada's Qmentum program." },
        { question: "CAMRT continuing competency requires evidence of:", options: ["Annual examinations", "Quality improvement participation", "Equipment purchase", "Research publication"], correctIndex: 1, rationale: "CAMRT's continuing competency program requires technologists to demonstrate ongoing quality improvement participation." }
      ],
      2, "CAMRT Image Quality Evaluation Protocols | Canadian Study Guide",
      "Study image quality evaluation for CAMRT certification: technologist assessment criteria, repeat rate tracking, PDSA improvement cycles, and continuing competency."
    ),

    // ===== EMERGENCY PROCEDURES =====
    arrt("emergency_procedures", "Medical Emergencies in Radiology (ARRT)",
      "arrt-medical-emergencies",
      "Radiologic technologists must recognize and respond to medical emergencies. Cardiac arrest: activate code team, begin CPR (30:2 compression-to-ventilation ratio for adults, rate 100-120/min, depth 2-2.5 inches), apply AED as soon as available. Respiratory emergencies: assess airway, position head-tilt chin-lift (jaw thrust for suspected c-spine), provide oxygen, assist ventilations. Syncope/vasovagal: lower head, elevate legs, monitor vitals, prevent fall injury. Seizures: protect from injury, do not restrain or insert objects in mouth, position on side after cessation, time the seizure. Diabetic emergencies: hypoglycemia (altered consciousness, diaphoresis -- give oral glucose if conscious or IV dextrose/glucagon if unconscious), hyperglycemia (Kussmaul breathing, fruity odor). Shock: recognize signs (tachycardia, hypotension, pale/cool skin, altered consciousness), position supine with legs elevated, maintain airway, call for help. Stroke: FAST assessment (Face drooping, Arm weakness, Speech difficulty, Time to call). Choking: Heimlich maneuver for conscious adults. Every imaging department must have emergency equipment (crash cart, AED, oxygen, suction) readily accessible.",
      "Emergency response preparedness is a patient safety requirement and ARRT exam topic.",
      ["CPR 30:2 ratio", "AED protocol", "Vasovagal response", "Seizure management", "Diabetic emergencies", "Shock recognition", "FAST stroke assessment"],
      [
        { question: "Adult CPR compression-to-ventilation ratio is:", options: ["15:1", "15:2", "30:2", "30:1"], correctIndex: 2, rationale: "Adult CPR uses a 30:2 compression-to-ventilation ratio per AHA guidelines." },
        { question: "FAST stroke assessment stands for:", options: ["First Aid Stroke Test", "Face, Arm, Speech, Time", "Focused Assessment Stroke Tool", "Functional Activity Scoring Test"], correctIndex: 1, rationale: "FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services." },
        { question: "Management of a conscious patient experiencing vasovagal syncope:", options: ["Sit upright and give water", "Lower head and elevate legs", "Begin CPR", "Administer epinephrine"], correctIndex: 1, rationale: "Vasovagal syncope: lower the head (or have patient lie down), elevate legs to improve venous return, monitor vitals." }
      ],
      2, "ARRT Medical Emergencies in Radiology | Study Guide",
      "Study medical emergency response for the ARRT exam: CPR, AED, syncope, seizures, diabetic emergencies, shock, stroke assessment, and department preparedness."
    ),

    arrt("emergency_procedures", "Contrast Emergency Response (ARRT)",
      "arrt-contrast-emergency-response",
      "Contrast media emergencies require rapid recognition and treatment. Mild reactions (urticaria, pruritus, warmth, nausea): observe, most self-limiting, diphenhydramine 25-50 mg PO/IM/IV for persistent urticaria. Moderate reactions: diffuse urticaria -- diphenhydramine 25-50 mg IM/IV; bronchospasm -- albuterol inhaler 2-3 puffs or nebulized 2.5 mg, plus epinephrine 0.3 mg IM if severe; facial/laryngeal edema -- epinephrine 0.3-0.5 mg IM, call code; vagal reaction (bradycardia, hypotension) -- atropine 0.6-1.0 mg IV, elevate legs, IV fluids. Severe reactions (anaphylaxis): epinephrine 0.3-0.5 mg IM FIRST, call code, IV access with NS wide open, supplemental oxygen, repeat epinephrine every 5-15 minutes as needed; for refractory hypotension consider epinephrine IV drip. Cardiac arrest: standard ACLS protocol. Extravasation: elevate extremity, cold compresses for ionic contrast/warm for non-ionic (or follow institutional protocol), estimate volume, consult for >100 mL or suspected compartment syndrome. Technologists must know location of emergency equipment and medications in their department.",
      "Contrast emergency response is critical for patient safety in the imaging department.",
      ["Mild-moderate-severe triage", "Epinephrine IM first for anaphylaxis", "Bronchospasm treatment", "Vagal reaction atropine", "Extravasation management", "Repeat epi q5-15 min", "Emergency equipment location"],
      [
        { question: "For contrast-induced bronchospasm, first-line treatment is:", options: ["IV steroids", "Albuterol inhaler/nebulizer", "IV diphenhydramine", "Intubation"], correctIndex: 1, rationale: "Albuterol (beta-2 agonist) via inhaler or nebulizer is first-line for bronchospasm. Add epinephrine IM if severe." },
        { question: "Vasovagal reaction to contrast presents with:", options: ["Tachycardia and hypertension", "Bradycardia and hypotension", "Fever and rash", "Seizures"], correctIndex: 1, rationale: "Vagal reactions present with bradycardia and hypotension; treat with atropine, leg elevation, and IV fluids." },
        { question: "How often can epinephrine be repeated for anaphylaxis?", options: ["Once only", "Every 1-2 minutes", "Every 5-15 minutes", "Every 30 minutes"], correctIndex: 2, rationale: "Epinephrine 0.3-0.5 mg IM can be repeated every 5-15 minutes as needed for persistent anaphylaxis." }
      ],
      2, "ARRT Contrast Emergency Response | Study Guide",
      "Master contrast emergency protocols for the ARRT exam: reaction triage, epinephrine dosing, bronchospasm treatment, vagal reactions, and extravasation management."
    ),

    arrt("emergency_procedures", "Trauma Imaging Protocols (ARRT)",
      "arrt-trauma-imaging",
      "Trauma imaging requires rapid, systematic radiographic assessment while maintaining patient safety. The traditional trauma series includes: AP chest (evaluate for pneumothorax, hemothorax, mediastinal widening, rib fractures), AP pelvis (evaluate for pelvic ring fractures, hip dislocations), and lateral cervical spine (though CT has largely replaced this). CT is now the primary imaging modality for major trauma assessment. Whole-body CT (pan-scan) evaluates head, c-spine, chest, abdomen, and pelvis in a single rapid acquisition. FAST ultrasound (Focused Assessment with Sonography in Trauma) evaluates four areas for free fluid: RUQ (Morison's pouch), LUQ (splenorenal recess), pelvis (Douglas pouch/rectovesical), and subxiphoid pericardial view. Portable radiography considerations: maintain c-spine precautions, use horizontal beam lateral for suspected spine injury, adapt technique for trauma boards and immobilization devices, minimize patient movement. Cross-table lateral is used when the patient cannot be moved. Grid techniques may need to be adapted for portable studies. All trauma images require critical result communication per departmental protocols.",
      "Trauma imaging competency requires technical adaptability and emergency awareness.",
      ["Trauma series AP chest/pelvis", "Whole-body CT pan-scan", "FAST ultrasound 4 views", "C-spine precautions", "Cross-table lateral", "Portable adaptations", "Critical result communication"],
      [
        { question: "FAST ultrasound evaluates how many areas?", options: ["Two", "Three", "Four", "Six"], correctIndex: 2, rationale: "FAST evaluates four areas: RUQ (Morison's pouch), LUQ (splenorenal), pelvis, and subxiphoid pericardial view." },
        { question: "Cross-table lateral is performed when:", options: ["Better image quality is needed", "The patient cannot be moved or rotated", "Grid use is required", "For all lateral projections"], correctIndex: 1, rationale: "Cross-table lateral uses a horizontal beam with the patient remaining supine, used when the patient cannot be moved." },
        { question: "Widened mediastinum on trauma chest may indicate:", options: ["Pneumonia", "Pleural effusion", "Aortic injury", "Normal variant"], correctIndex: 2, rationale: "Widened mediastinum on trauma chest radiograph raises concern for aortic injury and requires urgent evaluation." }
      ],
      2, "ARRT Trauma Imaging Protocols | Study Guide",
      "Study trauma imaging for the ARRT exam: trauma series, whole-body CT, FAST ultrasound, portable techniques, and critical finding communication."
    ),

    camrt("emergency_procedures", "Emergency Response in Imaging (CAMRT)",
      "camrt-emergency-response",
      "Canadian imaging department emergency response follows institutional codes and provincial emergency protocols. Cardiac arrest (Code Blue in most Canadian hospitals): activate code team, begin CPR per Heart and Stroke Foundation of Canada guidelines (30:2 compression-to-ventilation for adults, rate 100-120/min, depth 5-6 cm), apply AED immediately. Respiratory distress: assess airway patency, position for comfort (sitting upright if conscious), provide supplemental oxygen, prepare for advanced airway management. Syncope: lower head, elevate legs, monitor vital signs, prevent injury. Seizures: protect from injury, do not restrain, position recovery (lateral) after cessation, time the event. Anaphylaxis: epinephrine 0.3-0.5 mg IM, oxygen, IV fluids, call code. Canadian imaging departments must maintain emergency equipment per provincial requirements including crash cart, AED, oxygen delivery systems, suction, and emergency medications. All staff must maintain current certification in Basic Life Support (BLS) through Heart and Stroke Foundation or equivalent. Some facilities require ACLS certification for staff working in high-risk areas (CT contrast, interventional).",
      "Emergency preparedness is a mandatory CAMRT competency requirement.",
      ["Code Blue protocols", "Heart and Stroke Foundation CPR", "Compression depth 5-6 cm", "Recovery position", "Anaphylaxis response", "BLS certification", "Provincial requirements"],
      [
        { question: "Adult CPR compression depth per Canadian guidelines is:", options: ["2-3 cm", "3-4 cm", "5-6 cm", "7-8 cm"], correctIndex: 2, rationale: "Heart and Stroke Foundation of Canada guidelines specify 5-6 cm (approximately 2-2.4 inches) compression depth for adult CPR." },
        { question: "BLS certification in Canadian imaging is provided by:", options: ["CNSC", "Heart and Stroke Foundation or equivalent", "CAMRT directly", "Equipment manufacturers"], correctIndex: 1, rationale: "BLS certification is provided through the Heart and Stroke Foundation of Canada or equivalent recognized programs." },
        { question: "After a seizure, the patient should be placed in:", options: ["Supine position", "Prone position", "Recovery (lateral) position", "Sitting upright"], correctIndex: 2, rationale: "After seizure cessation, place the patient in the recovery (lateral) position to maintain airway patency and prevent aspiration." }
      ],
      2, "CAMRT Emergency Response in Imaging | Canadian Study Guide",
      "Study emergency response for CAMRT certification: cardiac arrest codes, CPR guidelines, seizure management, anaphylaxis, and Canadian BLS requirements."
    ),

    camrt("emergency_procedures", "Anaphylaxis & Contrast Emergencies (CAMRT)",
      "camrt-anaphylaxis-contrast",
      "Contrast-related emergencies in Canadian imaging departments follow CAR (Canadian Association of Radiologists) guidelines and institutional emergency protocols. Anaphylaxis recognition: rapid onset of skin symptoms (urticaria, flushing), respiratory compromise (stridor, wheezing, dyspnea), cardiovascular symptoms (hypotension, tachycardia), and GI symptoms (nausea, vomiting). Anaphylaxis treatment per Canadian Allergy, Asthma and Immunology Foundation: epinephrine 0.3-0.5 mg IM (anterolateral thigh) is FIRST-LINE -- no contraindications in anaphylaxis. Position supine with legs elevated (unless respiratory distress). Supplemental oxygen via non-rebreather mask. IV access with normal saline bolus. Second-line medications: salbutamol nebulizer for bronchospasm, diphenhydramine IV for urticaria, methylprednisolone IV (onset delayed, prevents biphasic reaction). Monitor for biphasic reaction (recurrence 1-72 hours, most within 8 hours). Pre-medication protocol for prior reactors: prednisone 50 mg at 13, 7, and 1 hour before contrast, plus diphenhydramine 50 mg 1 hour before. All reactions must be documented and reported through the Canada Vigilance Program.",
      "Anaphylaxis management is a critical safety competency for CAMRT-certified technologists.",
      ["Anaphylaxis recognition", "Epinephrine first-line IM", "No contraindications to epi", "Biphasic reaction risk", "Pre-medication protocol", "Canada Vigilance reporting", "CAR guidelines"],
      [
        { question: "The preferred injection site for epinephrine in anaphylaxis is:", options: ["Deltoid", "Anterolateral thigh", "Subcutaneous abdomen", "Intravenous"], correctIndex: 1, rationale: "Epinephrine is administered IM in the anterolateral thigh for fastest absorption during anaphylaxis." },
        { question: "Biphasic anaphylactic reactions most commonly occur within:", options: ["1 hour", "8 hours", "24 hours", "72 hours"], correctIndex: 1, rationale: "Biphasic reactions (recurrence of anaphylaxis) most commonly occur within 8 hours, though they can occur up to 72 hours later." },
        { question: "Are there contraindications to epinephrine in true anaphylaxis?", options: ["Yes, heart disease", "Yes, elderly patients", "No contraindications", "Yes, pregnancy"], correctIndex: 2, rationale: "There are no absolute contraindications to epinephrine administration in true anaphylaxis -- the benefit always outweighs the risk." }
      ],
      2, "CAMRT Anaphylaxis & Contrast Emergency Management | Canadian Study Guide",
      "Master anaphylaxis management for CAMRT certification: CAR guidelines, epinephrine protocol, biphasic reactions, pre-medication, and Canada Vigilance reporting."
    ),

    camrt("emergency_procedures", "Trauma Radiography Protocols (CAMRT)",
      "camrt-trauma-radiography",
      "Trauma imaging in Canadian facilities follows institutional trauma protocols aligned with Trauma Association of Canada (TAC) guidelines and provincial trauma system standards. The Canadian trauma team activation system uses specific criteria for trauma team mobilization. Initial radiographic assessment in resuscitation includes AP chest and AP pelvis (if clinically indicated), with CT now the primary modality for comprehensive trauma evaluation. Canadian trauma centres use whole-body CT protocols for major trauma patients. FAST (Focused Assessment with Sonography in Trauma) is performed by emergency physicians or trained personnel to detect free fluid. Portable radiography in trauma requires: c-spine precautions until cleared, horizontal beam techniques for suspected spine injuries, technique adaptation for trauma boards and splints, maintaining sterile fields for open wounds, radiation protection for trauma team members present during imaging. Cross-table lateral projections are used when the patient cannot be moved. Canadian technologists in trauma centres must complete trauma imaging competency programs. Critical findings (pneumothorax, unstable fractures, foreign bodies) require immediate verbal communication to the trauma team leader per CAR and institutional critical result notification policies.",
      "Trauma imaging competency is essential for CAMRT-certified technologists in Canadian trauma centres.",
      ["TAC guidelines", "Trauma team activation", "FAST assessment", "Whole-body CT", "C-spine precautions", "Critical result notification", "Trauma competency programs"],
      [
        { question: "Canadian trauma protocols are guided by:", options: ["CNSC", "Trauma Association of Canada (TAC)", "CAMRT alone", "Health Canada alone"], correctIndex: 1, rationale: "The Trauma Association of Canada (TAC) provides guidelines for trauma system development and patient care." },
        { question: "In trauma imaging, critical findings must be communicated:", options: ["In the written report only", "At end of shift", "Immediately verbally to the trauma team leader", "Only if the radiologist requests"], correctIndex: 2, rationale: "Critical trauma findings require immediate verbal communication to the trauma team leader per CAR and institutional policies." },
        { question: "C-spine precautions in trauma imaging mean:", options: ["No imaging of the spine", "Maintaining stabilization until the spine is cleared", "Only lateral views allowed", "CT spine only"], correctIndex: 1, rationale: "C-spine precautions require maintaining neck stabilization (collar, manual inline stabilization) until the spine is formally cleared." }
      ],
      2, "CAMRT Trauma Radiography Protocols | Canadian Study Guide",
      "Study trauma imaging for CAMRT certification: TAC guidelines, trauma team protocols, FAST, c-spine precautions, and Canadian critical result notification."
    ),

    // ===== ADDITIONAL LESSONS TO REACH 60+ =====
    arrt("image_production", "Automatic Exposure Control Systems (ARRT)",
      "arrt-automatic-exposure-control",
      "Automatic exposure control (AEC) systems terminate the X-ray exposure when the detector senses sufficient radiation has reached it for an adequate image. AEC systems use ionization chambers positioned between the patient and the image receptor. Most systems have three detector cells: two lateral and one central. The technologist selects which chamber(s) to activate based on the anatomy of interest. The density control adjusts the target exposure level (typically ±25% per step in 5-7 steps). Backup time is a safety feature that terminates exposure if AEC fails, set at 150% of expected exposure or per manufacturer recommendation. Proper AEC use requires: correct chamber selection for the anatomy, patient centered over the active chamber, adequate collimation, and appropriate density setting. AEC does NOT control kVp -- the technologist must still select appropriate kVp for contrast. Common AEC errors: wrong chamber activated, patient not centered over chamber, extreme body habitus exceeding AEC range, and objects between patient and detector.",
      "AEC mastery is essential for consistent exposure and a frequently tested ARRT topic.",
      ["Three detector cells", "Density control", "Backup time safety", "Chamber selection", "kVp still manually set", "Common AEC errors", "Ionization chambers"],
      [
        { question: "AEC terminates exposure based on:", options: ["Timer setting", "Radiation reaching the detector", "kVp selection", "Patient weight"], correctIndex: 1, rationale: "AEC measures radiation reaching the detector and terminates exposure when sufficient signal is received for adequate image quality." },
        { question: "The technologist must still manually select:", options: ["mAs", "Exposure time", "kVp for appropriate contrast", "Receptor sensitivity"], correctIndex: 2, rationale: "AEC controls mAs (exposure duration) but the technologist must select appropriate kVp for the desired contrast." },
        { question: "Backup time is set to prevent:", options: ["Underexposure", "AEC failure causing excessive exposure", "Patient motion", "Grid cutoff"], correctIndex: 1, rationale: "Backup time is a safety feature that terminates the exposure if the AEC fails to do so, preventing excessive patient dose." }
      ],
      2, "ARRT Automatic Exposure Control Systems | Study Guide",
      "Study AEC systems for the ARRT exam: chamber selection, density control, backup time, common errors, and proper technique optimization."
    ),

    camrt("image_production", "Automatic Exposure Control & Dose Optimization (CAMRT)",
      "camrt-aec-dose-optimization",
      "Automatic exposure control (AEC) in Canadian practice is a critical tool for dose optimization aligned with ALARA principles and CAR diagnostic reference levels. Canadian AEC systems use ionization chambers with three selectable detector positions. Proper AEC technique requires: selecting the correct chamber for the anatomy (e.g., center chamber for spine, lateral chambers for lungs on PA chest), positioning the patient correctly over the active chamber, selecting appropriate kVp for subject contrast, and setting the density control for patient habitus. Canadian facilities calibrate AEC systems per CSA standards and manufacturer specifications during acceptance testing and annual QC evaluations. AEC performance testing includes reproducibility (exposure variation <5%), density control step accuracy, and backup time verification. Digital detector exposure indicators must be monitored even with AEC to detect dose creep. The Canadian approach emphasizes that AEC is a dose optimization tool when used correctly but can contribute to dose creep if technologists rely on it without monitoring exposure indicators. Provincial QC programs include AEC testing as part of annual equipment evaluations.",
      "AEC optimization within Canadian dose management frameworks is essential for CAMRT practice.",
      ["Three chambers", "Correct chamber selection", "CAR DRL alignment", "CSA calibration standards", "Exposure indicator monitoring", "Dose creep prevention", "Provincial QC"],
      [
        { question: "AEC dose creep can be detected by monitoring:", options: ["Patient complaints", "Exposure indicators", "Room temperature", "Equipment age"], correctIndex: 1, rationale: "Monitoring exposure indicators for every image helps detect gradual dose creep even when AEC is producing acceptable-looking images." },
        { question: "For a PA chest radiograph, which AEC chamber(s) should typically be selected?", options: ["Center only", "Both lateral chambers", "All three", "Right lateral only"], correctIndex: 1, rationale: "For PA chest, both lateral chambers are selected to measure exposure through the lung fields, the primary anatomy of interest." },
        { question: "AEC calibration in Canada follows:", options: ["Manufacturer settings only", "CSA standards and acceptance testing protocols", "Technologist preference", "No specific standard"], correctIndex: 1, rationale: "Canadian AEC calibration follows CSA standards with verification during acceptance testing and annual QC evaluations." }
      ],
      2, "CAMRT AEC & Dose Optimization | Canadian Study Guide",
      "Master AEC systems for CAMRT certification: chamber selection, dose optimization, CSA standards, exposure monitoring, and Canadian QC requirements."
    ),

    arrt("quality_control", "Mammography QC Under MQSA (ARRT)",
      "arrt-mammography-qc-mqsa",
      "The Mammography Quality Standards Act (MQSA) is a US federal law requiring all mammography facilities to be FDA-certified with accreditation from an approved body (typically ACR). MQSA mandates specific QC tests at defined frequencies. Technologist responsibilities: daily -- phantom image quality evaluation (score fibers, speck groups, masses visible), weekly -- screen-film processor QC (sensitometry and densitometry) or digital artifact evaluation, monthly -- visual checklist. Medical physicist annual survey: exposure reproducibility, kVp accuracy, beam quality (HVL), AEC performance, spatial resolution, contrast, artifact evaluation, phantom scoring, and average glandular dose measurement. The average glandular dose must not exceed 3 mGy (300 mrad) per view for a standard 4.2 cm compressed breast. Lead apron testing, compression force verification (111-200 N), and viewing conditions are also evaluated. All QC records must be maintained for inspection. Failure to maintain MQSA compliance can result in facility sanctions including equipment suspension. Digital mammography QC follows the ACR Digital Mammography QC Manual with additional tests for flat-panel detectors.",
      "MQSA compliance is a major regulatory requirement and ARRT exam topic for mammography-eligible technologists.",
      ["MQSA federal law", "ACR accreditation", "Daily phantom scoring", "Average glandular dose 3 mGy", "Compression force 111-200 N", "Annual physicist survey", "Digital mammography QC"],
      [
        { question: "Maximum average glandular dose per view under MQSA is:", options: ["1 mGy", "2 mGy", "3 mGy", "5 mGy"], correctIndex: 2, rationale: "MQSA limits average glandular dose to 3 mGy (300 mrad) per view for a standard 4.2 cm compressed breast." },
        { question: "MQSA requires facility accreditation from:", options: ["State health department only", "FDA directly", "An approved accreditation body such as ACR", "Hospital administration"], correctIndex: 2, rationale: "MQSA requires accreditation from an FDA-approved body (typically ACR) in addition to FDA certification." },
        { question: "Acceptable compression force range under MQSA is:", options: ["50-100 N", "111-200 N", "200-300 N", "300-400 N"], correctIndex: 1, rationale: "Mammographic compression must achieve between 111-200 Newtons (25-45 pounds) of force per MQSA requirements." }
      ],
      3, "ARRT Mammography QC Under MQSA | Study Guide",
      "Study mammography QC for the ARRT exam: MQSA requirements, daily/weekly/monthly/annual tests, dose limits, compression force, and ACR accreditation."
    ),

    camrt("quality_control", "Mammography QC Under Canadian Standards (CAMRT)",
      "camrt-mammography-qc-standards",
      "Canadian mammography quality control follows the Canadian Association of Radiologists (CAR) Mammography Accreditation Program and provincial regulatory requirements. The CAR accreditation program evaluates equipment performance, image quality, and radiation dose. Daily QC by the technologist includes phantom image evaluation using the CAR/ACR mammography phantom, scoring visible fibers, speck groups, and masses. Weekly tasks include processor QC for film systems or digital artifact assessment. Medical physicist annual evaluations include: kVp accuracy, HVL measurement, AEC performance, spatial resolution, contrast-to-noise ratio, detector uniformity, and average glandular dose measurement. The average glandular dose benchmark in Canada is consistent with international standards at 3 mGy per view for a standard breast. Compression force testing verifies adequate compression (111-200 N). Canadian mammography programs are also subject to provincial cancer screening program standards, which may impose additional QC requirements. The Canadian Breast Cancer Screening Network coordinates national screening standards. CAMRT-certified mammography technologists must maintain specific mammography continuing education credits.",
      "Canadian mammography QC integrates CAR accreditation with provincial screening program requirements.",
      ["CAR Mammography Accreditation", "Daily phantom evaluation", "Average glandular dose 3 mGy", "Provincial screening standards", "Breast Cancer Screening Network", "Compression force testing", "Mammography CE requirements"],
      [
        { question: "Canadian mammography accreditation is managed by:", options: ["CNSC", "Health Canada alone", "CAR Mammography Accreditation Program", "Provincial governments only"], correctIndex: 2, rationale: "The Canadian Association of Radiologists (CAR) manages the Mammography Accreditation Program for Canadian facilities." },
        { question: "Canadian average glandular dose benchmark per view is:", options: ["1 mGy", "2 mGy", "3 mGy", "5 mGy"], correctIndex: 2, rationale: "Canada follows the international benchmark of 3 mGy average glandular dose per view for a standard compressed breast." },
        { question: "The Canadian Breast Cancer Screening Network coordinates:", options: ["Equipment purchasing", "National screening standards", "Technologist salaries", "Hospital construction"], correctIndex: 1, rationale: "The Canadian Breast Cancer Screening Network coordinates national screening standards and quality metrics across provinces." }
      ],
      3, "CAMRT Mammography QC Under Canadian Standards | Study Guide",
      "Master mammography QC for CAMRT certification: CAR accreditation, phantom testing, dose benchmarks, provincial screening requirements, and continuing education."
    ),
  ];
}
