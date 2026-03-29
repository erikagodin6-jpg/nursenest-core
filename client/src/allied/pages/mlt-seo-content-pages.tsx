import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import {
  Microscope, ArrowRight, CheckCircle2, ChevronDown, Star, BookOpen,
  Brain, FlaskConical, Shield, Zap, GraduationCap, Globe, HelpCircle,
  Target, Award, BarChart3, Clock, FileText, Users, Lock, Beaker
} from "lucide-react";

type ContentPageSlug =
  | "clinical-chemistry-questions"
  | "hematology-practice-questions"
  | "microbiology-exam-prep"
  | "blood-banking-immunohematology"
  | "urinalysis-body-fluids"
  | "laboratory-operations-quality"
  | "histotechnology-cytology"
  | "molecular-diagnostics-poct"
  | "blog-mlt-career-guide"
  | "blog-mlt-study-strategies"
  | "blog-mlt-lab-safety";

interface MltContentPageProps {
  slug: ContentPageSlug;
}

interface PageConfig {
  title: string;
  metaDesc: string;
  h1: string;
  heroSub: string;
  keywords: string;
  canonicalPath: string;
  icon: React.ElementType;
  category: string;
  sections: { heading: string; content: string }[];
  sampleQuestions: { stem: string; answer: string }[];
  faqs: { q: string; a: string }[];
  relatedPages: { slug: ContentPageSlug; label: string }[];
  isBlog?: boolean;
}

const PAGE_CONFIGS: Record<ContentPageSlug, PageConfig> = {
  "clinical-chemistry-questions": {
    title: "MLT Clinical Chemistry Practice Questions | Comprehensive Exam Prep",
    metaDesc: "Master clinical chemistry for your MLT certification exam. 200+ practice questions covering electrolytes, enzymes, hormones, toxicology, and lab value interpretation with detailed rationales.",
    h1: "Clinical Chemistry Practice Questions for MLT Certification",
    heroSub: "In-depth clinical chemistry question bank covering all major analyte groups, lab value interpretation, and instrumentation. Aligned to ASCP BOC and CSMLS exam blueprints.",
    keywords: "MLT clinical chemistry questions, chemistry lab exam prep, electrolyte questions, enzyme questions, MLT certification",
    canonicalPath: "/allied-health/mlt/clinical-chemistry-questions",
    icon: FlaskConical,
    category: "Clinical Chemistry",
    sections: [
      { heading: "Electrolytes & Acid-Base Balance", content: "Comprehensive question coverage of sodium, potassium, chloride, bicarbonate, calcium, magnesium, and phosphorus. Includes ABG interpretation, anion gap calculations, compensation mechanisms, and clinical correlations. Each question presents realistic clinical scenarios requiring you to integrate multiple lab values for accurate interpretation — exactly as tested on your certification exam." },
      { heading: "Enzymes & Cardiac Biomarkers", content: "Deep coverage of clinically significant enzymes: CK/CK-MB, LDH isoenzymes, AST/ALT, ALP/GGT, amylase/lipase, and high-sensitivity troponin. Learn to differentiate hepatocellular injury patterns from cholestatic patterns, identify tissue sources using isoenzyme analysis, and interpret serial cardiac biomarker changes for acute MI diagnosis." },
      { heading: "Endocrinology & Tumor Markers", content: "Questions covering thyroid function testing (TSH, free T4, T3), adrenal hormones (cortisol, aldosterone), reproductive hormones, diabetes markers (glucose, HbA1c, insulin), and tumor markers (PSA, AFP, CA-125, CEA). Includes dynamic function testing interpretation and clinical decision algorithms." },
      { heading: "Toxicology & Therapeutic Drug Monitoring", content: "Master TDM for critical medications: vancomycin (AUC/MIC dosing), aminoglycosides, lithium, phenytoin, digoxin, and immunosuppressants. Toxicology coverage includes ethanol, drugs of abuse screening/confirmation, and poisoning workups (osmol gap, anion gap applications)." },
    ],
    sampleQuestions: [
      { stem: "A patient's ABG shows pH 7.30, pCO2 40, HCO3 18, anion gap 22. What is the acid-base disorder?", answer: "High anion gap metabolic acidosis (HAGMA). Normal pCO2 with low HCO3 and elevated AG indicates unmeasured acids (DKA, lactic acidosis, uremia, toxins)." },
      { stem: "Serum lipase is more specific than amylase for acute pancreatitis because...", answer: "Lipase is primarily produced by the pancreas, while amylase is also produced by salivary glands. Lipase also remains elevated longer (8-14 days vs 3-5 days)." },
    ],
    faqs: [
      { q: "How many clinical chemistry questions are on the ASCP MLT exam?", a: "Clinical chemistry typically comprises 20-25% of the ASCP BOC exam content, making it the largest single content area. Our question bank provides proportional coverage with over 200 chemistry-focused questions across all sub-topics." },
      { q: "Are the lab values in SI units or conventional units?", a: "We provide both. The Canadian track uses SI units (mmol/L) and the US track uses conventional units (mg/dL). You can toggle between unit systems at any time." },
      { q: "Do the questions cover instrumentation (ISE, spectrophotometry)?", a: "Yes. Our questions cover analytical methodologies including ion-selective electrodes, spectrophotometry, immunoassay principles, HPLC, mass spectrometry, and point-of-care testing. Understanding methodology is essential for troubleshooting exam questions." },
      { q: "How do I access the full clinical chemistry question bank?", a: "Sign up for a free account to access sample questions from each topic. Premium subscribers get unlimited access to all 200+ clinical chemistry questions with detailed rationales, performance tracking, and adaptive practice." },
    ],
    relatedPages: [
      { slug: "hematology-practice-questions", label: "Hematology Questions" },
      { slug: "urinalysis-body-fluids", label: "Urinalysis & Body Fluids" },
      { slug: "laboratory-operations-quality", label: "Lab Operations & QC" },
      { slug: "molecular-diagnostics-poct", label: "Molecular & POCT" },
    ],
  },
  "hematology-practice-questions": {
    title: "MLT Hematology Practice Questions | CBC, Coagulation & Blood Cell Morphology",
    metaDesc: "Ace the hematology section of your MLT certification exam. 200+ questions covering CBC interpretation, coagulation cascade, hemoglobinopathies, leukemias, and peripheral blood smear review.",
    h1: "Hematology & Coagulation Practice Questions for MLT Certification",
    heroSub: "Comprehensive hematology question bank covering CBC interpretation, coagulation disorders, hemoglobinopathies, leukemias, and advanced morphology identification.",
    keywords: "MLT hematology questions, coagulation exam prep, CBC interpretation, blood cell morphology, hemoglobinopathy questions",
    canonicalPath: "/allied-health/mlt/hematology-practice-questions",
    icon: Microscope,
    category: "Hematology",
    sections: [
      { heading: "CBC Interpretation & RBC Morphology", content: "Master the complete blood count from indices to morphology. Questions cover MCV-based anemia classification, reticulocyte interpretation, RDW significance, and peripheral blood smear findings (target cells, schistocytes, spherocytes, sickle cells, Howell-Jolly bodies). Learn to correlate CBC results with clinical presentations for accurate diagnosis." },
      { heading: "Hemostasis & Coagulation", content: "In-depth coverage of the coagulation cascade, PT/INR, aPTT, mixing studies, D-dimer, fibrinogen, and platelet function testing. Includes DIC workup, heparin monitoring (aPTT and anti-Xa), warfarin management (INR targets), and inherited bleeding disorders (von Willebrand disease, hemophilia A/B)." },
      { heading: "White Blood Cell Disorders", content: "Questions covering acute and chronic leukemias, myeloproliferative neoplasms, myelodysplastic syndromes, and lymphoproliferative disorders. Includes flow cytometry immunophenotyping interpretation, cytochemistry (MPO, Sudan Black, PAS), and molecular markers (BCR-ABL, FLT3, NPM1)." },
      { heading: "Hemoglobinopathies & Thalassemias", content: "Comprehensive coverage of sickle cell disease, thalassemias (alpha and beta), hemoglobin C disease, and hemoglobin electrophoresis interpretation. Includes newborn screening, HPLC patterns, and solubility testing. Case-based questions integrate clinical presentations with laboratory findings." },
    ],
    sampleQuestions: [
      { stem: "A patient's peripheral smear shows numerous smudge cells with mature small lymphocytes. Flow cytometry: CD5+, CD19+, CD20 dim, CD23+. Diagnosis?", answer: "Chronic lymphocytic leukemia (CLL). Smudge cells are pathognomonic. The immunophenotype (CD5+/CD19+/CD20 dim/CD23+) confirms the diagnosis." },
      { stem: "Hemoglobin electrophoresis shows Hgb A 95%, Hgb A2 5.8%, Hgb F 1.5%. Interpretation?", answer: "Beta-thalassemia trait (minor). Elevated Hgb A2 (>3.5%) with presence of Hgb A confirms one functional beta gene." },
    ],
    faqs: [
      { q: "What percentage of the MLT exam covers hematology?", a: "Hematology/hemostasis typically comprises 20-25% of both the ASCP BOC and CSMLS exams. It is one of the most heavily weighted content areas, making thorough preparation essential." },
      { q: "Are flow cytometry interpretation questions included?", a: "Yes. We include questions on interpreting immunophenotyping results for leukemia/lymphoma classification, including CD marker combinations and their clinical significance." },
      { q: "Do you cover peripheral blood smear morphology?", a: "Extensively. Our questions test recognition and clinical significance of all major RBC, WBC, and platelet morphological findings. Text-based descriptions are used to test your knowledge of morphological correlations." },
      { q: "How current is the coagulation content?", a: "Our content reflects current CLSI guidelines, including updated vancomycin AUC/MIC monitoring, direct oral anticoagulant (DOAC) laboratory monitoring, and current ISTH DIC scoring criteria." },
    ],
    relatedPages: [
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry" },
      { slug: "blood-banking-immunohematology", label: "Blood Banking" },
      { slug: "histotechnology-cytology", label: "Histotechnology & Cytology" },
      { slug: "laboratory-operations-quality", label: "Lab Operations & QC" },
    ],
  },
  "microbiology-exam-prep": {
    title: "MLT Microbiology Exam Prep | Bacteriology, Mycology, Parasitology & Virology",
    metaDesc: "Complete microbiology preparation for MLT certification. 250+ questions covering bacteriology, mycology, parasitology, virology, and antimicrobial susceptibility testing.",
    h1: "Microbiology Exam Preparation for MLT Certification",
    heroSub: "Comprehensive microbiology question bank covering bacterial identification, fungal morphology, parasitic life cycles, viral markers, and antimicrobial susceptibility testing.",
    keywords: "MLT microbiology questions, bacteriology exam prep, parasitology questions, mycology identification, virology MLT exam",
    canonicalPath: "/allied-health/mlt/microbiology-exam-prep",
    icon: Beaker,
    category: "Microbiology",
    sections: [
      { heading: "Bacteriology & Identification", content: "Master bacterial identification through Gram stain morphology, culture characteristics, and biochemical testing. Coverage includes staphylococci, streptococci, enterococci, Enterobacterales, non-fermenters, anaerobes, and fastidious organisms. Questions test your ability to work through identification algorithms systematically." },
      { heading: "Mycology — Yeasts & Molds", content: "In-depth coverage of medically important fungi: Candida species identification (germ tube, CHROMagar), Cryptococcus (India ink, CrAg), Aspergillus vs. Mucor tissue morphology, dimorphic fungi (Histoplasma, Blastomyces, Coccidioides), and dermatophytes. Includes antifungal susceptibility and biomarkers (BDG, galactomannan)." },
      { heading: "Parasitology — Protozoa & Helminths", content: "Comprehensive O&P examination, blood parasite identification (Plasmodium species, Babesia), intestinal protozoa (Giardia, Entamoeba, Cryptosporidium), and helminth egg/larva identification. Includes specimen collection, concentration techniques, and staining methods (trichrome, modified acid-fast, Giemsa)." },
      { heading: "Virology & Molecular Detection", content: "Coverage of viral culture (CPE patterns), rapid antigen detection (RSV, influenza, COVID-19), serological markers (HIV algorithm, hepatitis panels), and molecular methods (RT-PCR, multiplex panels). Emphasis on clinical significance and test selection for common viral syndromes." },
    ],
    sampleQuestions: [
      { stem: "A stool specimen on XLD agar shows red colonies with black centers. The organism is H2S positive and motile. Identification?", answer: "Salmonella species. Red (lysine decarboxylation) + black centers (H2S) + motile differentiates from Shigella (red, no H2S, non-motile)." },
      { stem: "Tissue biopsy shows wide, ribbon-like, pauci-septate hyphae with 90° branching. Most likely organism?", answer: "Mucor/Rhizopus (Mucorales). Contrast with Aspergillus: narrow, septate, 45° dichotomous branching." },
    ],
    faqs: [
      { q: "Does the microbiology section include parasitology and virology?", a: "Yes. Our comprehensive microbiology module covers bacteriology, mycology, parasitology, and virology — all areas tested on MLT certification exams. Parasitology and virology are frequently underrepresented in other prep resources, which is why we've prioritized them." },
      { q: "Are MALDI-TOF and molecular identification methods covered?", a: "Yes. We cover modern identification methods including MALDI-TOF mass spectrometry, 16S rRNA sequencing, multiplex PCR panels, and automated identification systems alongside traditional biochemical methods." },
      { q: "Do questions cover antimicrobial susceptibility testing?", a: "Extensively. Questions cover MIC interpretation, CLSI breakpoints, disk diffusion, broth microdilution, resistance mechanisms (MRSA, VRE, ESBL, CRE), and reporting guidelines." },
      { q: "How many blood parasite identification questions are included?", a: "We have 30+ questions specifically on blood and tissue parasites, including all four Plasmodium species differentiation, Babesia, Trypanosoma, and Leishmania. Each question includes detailed morphological descriptions." },
    ],
    relatedPages: [
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry" },
      { slug: "hematology-practice-questions", label: "Hematology" },
      { slug: "histotechnology-cytology", label: "Histotechnology & Cytology" },
      { slug: "molecular-diagnostics-poct", label: "Molecular & POCT" },
    ],
  },
  "blood-banking-immunohematology": {
    title: "MLT Blood Banking & Immunohematology Questions | Transfusion Medicine Prep",
    metaDesc: "Prepare for immunohematology on your MLT exam. 150+ blood banking questions covering ABO/Rh typing, antibody identification, crossmatching, transfusion reactions, and HDFN.",
    h1: "Blood Banking & Immunohematology Practice Questions",
    heroSub: "Master transfusion medicine with comprehensive coverage of ABO/Rh typing, antibody panels, crossmatching, component therapy, transfusion reactions, and hemolytic disease of the fetus/newborn.",
    keywords: "MLT blood banking questions, immunohematology exam prep, antibody identification, transfusion medicine, crossmatch questions",
    canonicalPath: "/allied-health/mlt/blood-banking-immunohematology",
    icon: Shield,
    category: "Blood Banking",
    sections: [
      { heading: "ABO/Rh Typing & Discrepancy Resolution", content: "Thorough coverage of forward and reverse typing, weak D testing, ABO subgroups, and discrepancy resolution. Questions present realistic typing results requiring systematic troubleshooting including cold agglutinins, unexpected antibodies, and technical errors." },
      { heading: "Antibody Identification Panels", content: "Master the rule of three, panel interpretation, phenotyping, and special techniques (enzyme treatment, adsorption, elution). Questions cover clinically significant antibodies (Rh, Kell, Duffy, Kidd, MNSs) and strategies for identifying multiple antibodies." },
      { heading: "Crossmatching & Component Therapy", content: "Coverage of immediate spin, AHG, and electronic crossmatching. Component therapy questions include indications for RBCs, platelets, FFP, cryoprecipitate, and granulocytes. Includes massive transfusion protocols and irradiated/CMV-negative product selection." },
      { heading: "Transfusion Reactions & HDFN", content: "Comprehensive coverage of acute and delayed transfusion reactions, workup procedures, DAT interpretation, and eluate testing. HDFN content includes prenatal testing, RhIG prophylaxis, Kleihauer-Betke testing, and neonatal management." },
    ],
    sampleQuestions: [
      { stem: "A crossmatch is incompatible at AHG but the antibody screen is negative. Most likely explanation?", answer: "Antibody to a low-frequency antigen present on donor cells but absent from screening cells. Select an alternative crossmatch-compatible unit." },
      { stem: "DAT positive with anti-IgG on a newborn of a group O mother. Baby is group A. Diagnosis?", answer: "ABO hemolytic disease of the fetus and newborn. Maternal IgG anti-A crosses placenta and coats fetal type A red cells." },
    ],
    faqs: [
      { q: "How heavily is blood banking weighted on the MLT exam?", a: "Blood banking/immunohematology typically comprises 15-20% of the exam. It is one of the most challenging content areas, requiring strong logical thinking for antibody panel interpretation." },
      { q: "Do you cover electronic crossmatching?", a: "Yes. We cover all crossmatch methods including requirements for electronic (computer) crossmatching: two concordant ABO types, negative antibody screen, no history of clinically significant antibodies, and validated computer system." },
      { q: "Are antibody panel interpretation questions included?", a: "Yes. We include multiple antibody panel scenarios with varying complexity, from single antibody identification to multiple antibodies requiring enzyme treatment, adsorption, and elution techniques." },
      { q: "Is prenatal testing and HDFN covered?", a: "Comprehensively. Questions cover prenatal antibody screening, antibody titration, fetal monitoring, RhIG dosage calculation (including Kleihauer-Betke/flow cytometry), and neonatal workup." },
    ],
    relatedPages: [
      { slug: "hematology-practice-questions", label: "Hematology & Coagulation" },
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry" },
      { slug: "laboratory-operations-quality", label: "Lab Operations & QC" },
      { slug: "molecular-diagnostics-poct", label: "Molecular & POCT" },
    ],
  },
  "urinalysis-body-fluids": {
    title: "MLT Urinalysis & Body Fluids Questions | Complete Exam Preparation",
    metaDesc: "Master urinalysis and body fluid analysis for your MLT exam. 120+ questions covering urine dipstick, sediment, CSF, synovial fluid, serous fluids, and semen analysis.",
    h1: "Urinalysis & Body Fluid Analysis Practice Questions",
    heroSub: "Complete coverage of urinalysis (dipstick chemistry, microscopic sediment), CSF analysis, synovial fluid, serous effusions, and reproductive testing for MLT certification exams.",
    keywords: "MLT urinalysis questions, body fluid analysis, CSF interpretation, urine sediment exam, synovial fluid crystals",
    canonicalPath: "/allied-health/mlt/urinalysis-body-fluids",
    icon: Beaker,
    category: "Urinalysis & Body Fluids",
    sections: [
      { heading: "Urine Dipstick Chemistry", content: "Master all 10 dipstick parameters: pH, specific gravity, protein, glucose, ketones, blood, bilirubin, urobilinogen, nitrite, and leukocyte esterase. Questions cover clinical correlations, interferents, false positives/negatives, and quality control. Understand the underlying chemistry of each reaction pad." },
      { heading: "Urine Microscopic Sediment", content: "Comprehensive coverage of urine sediment elements: RBCs, WBCs, casts (hyaline, granular, waxy, RBC, WBC, broad), crystals (uric acid, calcium oxalate, triple phosphate, cystine), bacteria, yeast, and parasites. Case-based questions correlate sediment findings with clinical conditions." },
      { heading: "Cerebrospinal Fluid & Serous Fluids", content: "CSF analysis: cell count, differential, protein, glucose, Gram stain, and culture. Differentiate bacterial, viral, TB/fungal, and autoimmune meningitis. Serous fluids: Light's criteria for exudate vs. transudate, malignant effusion evaluation." },
      { heading: "Synovial Fluid & Reproductive Testing", content: "Crystal identification under polarized microscopy (MSU vs. CPPD), joint fluid classification (non-inflammatory, inflammatory, septic, hemorrhagic). Semen analysis: WHO 2021 criteria, volume, count, motility, morphology (strict Kruger criteria)." },
    ],
    sampleQuestions: [
      { stem: "Urine dipstick shows blood 3+ but microscopy reveals 0-2 RBCs/HPF. Explanation?", answer: "Myoglobinuria or hemoglobinuria. Dipstick detects hemoglobin peroxidase activity whether in intact RBCs, free hemoglobin, or myoglobin." },
      { stem: "Synovial fluid shows negatively birefringent, needle-shaped crystals. Diagnosis?", answer: "Gout (monosodium urate crystals). Mnemonic: Negative birefringence = Needles = Gout (N-N-G)." },
    ],
    faqs: [
      { q: "How much of the MLT exam covers urinalysis?", a: "Urinalysis and body fluids typically comprise 8-12% of the exam. While smaller than chemistry or hematology, it is an area where targeted preparation can significantly boost your score." },
      { q: "Are crystal identification questions included?", a: "Yes. We cover both urine crystals (uric acid, calcium oxalate, triple phosphate, cystine, tyrosine, leucine) and synovial fluid crystals (MSU, CPPD) with detailed descriptions of morphology and birefringence properties." },
      { q: "Do questions cover Light's criteria?", a: "Yes. Multiple questions present pleural fluid data requiring application of Light's criteria to classify as transudate or exudate, with clinical correlation to underlying conditions." },
      { q: "Is semen analysis covered?", a: "Yes. We cover WHO 2021 reference limits, specimen collection requirements, morphology assessment (strict Kruger criteria), and evaluation of azoospermia (obstructive vs. non-obstructive)." },
    ],
    relatedPages: [
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry" },
      { slug: "hematology-practice-questions", label: "Hematology" },
      { slug: "microbiology-exam-prep", label: "Microbiology" },
      { slug: "histotechnology-cytology", label: "Histotechnology & Cytology" },
    ],
  },
  "laboratory-operations-quality": {
    title: "MLT Laboratory Operations & Quality Management Questions | QC, Safety, Regulations",
    metaDesc: "Prepare for laboratory operations on your MLT exam. 100+ questions covering Westgard rules, QC/QA programs, CLIA regulations, laboratory safety, method validation, and Lean Six Sigma.",
    h1: "Laboratory Operations & Quality Management Questions",
    heroSub: "Master quality control, quality assurance, method validation, regulatory compliance, laboratory safety, and management principles for MLT certification exams.",
    keywords: "MLT laboratory operations questions, Westgard rules, QC QA, CLIA regulations, lab safety, method validation",
    canonicalPath: "/allied-health/mlt/laboratory-operations-quality",
    icon: BarChart3,
    category: "Laboratory Operations",
    sections: [
      { heading: "Westgard Rules & QC Interpretation", content: "Master all Westgard multi-rules: 1-2s (warning), 1-3s (random error), 2-2s (systematic), R-4s (random), 4-1s (systematic), and 10x (systematic shift). Questions present Levey-Jennings charts requiring rule violation identification, error type classification, and corrective action selection." },
      { heading: "Method Validation & Verification", content: "Coverage of CLSI guidelines for accuracy (EP15), precision (EP05), linearity (EP06), method comparison (EP09), reference range verification (C28), and detection limit studies. Includes regression analysis interpretation (slope, intercept, correlation coefficient) and Bland-Altman plot analysis." },
      { heading: "Regulatory Compliance & Accreditation", content: "CLIA '88 waived/moderate/high complexity testing requirements, personnel standards, proficiency testing, and inspection readiness. Canadian content covers CSA Z15189, Accreditation Canada, and provincial requirements. Both tracks cover competency assessment documentation." },
      { heading: "Laboratory Safety & Management", content: "OSHA bloodborne pathogen standard, chemical hygiene plan, SDS interpretation, fire safety, radiation safety, and biological safety cabinet classification. Lean Six Sigma principles, DMAIC methodology, turnaround time optimization, and specimen rejection rate analysis." },
    ],
    sampleQuestions: [
      { stem: "QC Level 1 is at +2.5 SD and Level 2 is at -2.8 SD. Which Westgard rule is violated?", answer: "R-4s. The range between controls (2.5 + 2.8 = 5.3 SD) exceeds 4 SD, indicating random error." },
      { stem: "Reference range establishment per CLSI C28-A3 requires a minimum of how many healthy individuals?", answer: "120 individuals using non-parametric methods (2.5th and 97.5th percentiles)." },
    ],
    faqs: [
      { q: "How much of the MLT exam covers lab operations?", a: "Laboratory operations/quality management comprises 10-15% of the exam. While not the largest section, these questions are highly testable because they apply across all disciplines." },
      { q: "Do questions cover Canadian regulations specifically?", a: "Yes. Our Canadian track includes CSA Z15189, Accreditation Canada standards, PIPEDA privacy requirements, and provincial regulatory frameworks alongside CLIA and CAP for the US track." },
      { q: "Is Lean Six Sigma covered?", a: "Yes. We cover Lean waste elimination principles, Six Sigma DMAIC methodology, process improvement tools, and laboratory quality indicators including TAT, rejection rates, and critical value notification metrics." },
      { q: "Are method validation questions common on the exam?", a: "Yes. Expect questions on method comparison (slope, intercept, correlation), precision studies (CV calculation), linearity verification, and reference range verification. We provide calculation-heavy practice for these topics." },
    ],
    relatedPages: [
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry" },
      { slug: "hematology-practice-questions", label: "Hematology" },
      { slug: "molecular-diagnostics-poct", label: "Molecular & POCT" },
      { slug: "blood-banking-immunohematology", label: "Blood Banking" },
    ],
  },
  "histotechnology-cytology": {
    title: "MLT Histotechnology & Cytology Questions | Tissue Processing, Special Stains, IHC",
    metaDesc: "Prepare for histotechnology and cytology on your MLT exam. 100+ questions covering tissue fixation, H&E staining, special stains, IHC, frozen sections, and Pap smear evaluation.",
    h1: "Histotechnology & Cytology Practice Questions",
    heroSub: "Comprehensive coverage of tissue fixation and processing, H&E and special stains, immunohistochemistry, frozen sections, Pap smear evaluation (Bethesda System), and FNA cytology.",
    keywords: "MLT histotechnology questions, special stains, IHC immunohistochemistry, cytology exam prep, Bethesda system, Pap smear",
    canonicalPath: "/allied-health/mlt/histotechnology-cytology",
    icon: Microscope,
    category: "Histotechnology",
    sections: [
      { heading: "Tissue Fixation, Processing & Embedding", content: "Master the entire tissue processing pathway: fixation (10% NBF, Bouin, glutaraldehyde), dehydration (graded alcohols), clearing (xylene), infiltration (paraffin), and embedding orientation. Questions cover troubleshooting artifacts, decalcification methods (acid vs. EDTA), and quality control checkpoints throughout processing." },
      { heading: "H&E Staining & Special Stains", content: "Complete coverage of routine H&E staining principles and troubleshooting. Special stains: PAS (glycogen, mucins, fungi), Masson trichrome (fibrosis), Congo Red (amyloid), GMS (fungi), Prussian blue (iron), reticulin (liver/marrow architecture), VVG (elastic fibers), mucicarmine (mucin, Cryptococcus), Oil Red O (lipids), and von Kossa (calcium)." },
      { heading: "Immunohistochemistry (IHC)", content: "IHC principles: antigen retrieval (HIER, enzyme), antibody selection, detection systems (DAB chromogen), and interpretation. Key markers: cytokeratin (carcinomas), vimentin (sarcomas), CD45/LCA (lymphomas), S-100 (melanoma/neural), ER/PR/HER2 (breast cancer), Ki-67 (proliferation index), CD20/CD3 (B/T cells)." },
      { heading: "Cytology & Bethesda System", content: "Pap smear evaluation using the Bethesda System: adequacy assessment, NILM, ASC-US, ASC-H, LSIL, HSIL, and squamous cell carcinoma. Koilocyte identification (HPV). Non-gynecological cytology: body fluid cytology, urine cytology, sputum cytology, and FNA with ROSE." },
    ],
    sampleQuestions: [
      { stem: "Congo Red stain viewed under polarized light showing apple-green birefringence is diagnostic of what condition?", answer: "Amyloidosis. Congo Red stains amyloid orange-red; under polarized light, amyloid deposits show characteristic apple-green birefringence." },
      { stem: "Oil Red O stain must be performed on frozen sections rather than paraffin sections because...", answer: "Standard tissue processing (dehydration with alcohols, clearing with xylene) dissolves lipids. Frozen sections preserve lipids in situ for detection." },
    ],
    faqs: [
      { q: "Are histotechnology and cytology tested on the MLT exam?", a: "Yes. These topics are part of the exam blueprint, though typically weighted lower than chemistry and hematology. They represent an area where targeted study can yield easy points since many candidates under-prepare for these sections." },
      { q: "Do I need to memorize all special stain results?", a: "Yes, the major special stains and their target substances/colors are frequently tested. Our questions emphasize the clinically relevant stains you're most likely to encounter on the exam, with memory aids and associations to help retention." },
      { q: "Is breast cancer IHC scoring covered?", a: "Yes. We cover ER/PR Allred scoring, HER2 IHC scoring (0, 1+, 2+, 3+), Ki-67 proliferation index interpretation, and their clinical significance for treatment decisions." },
      { q: "How detailed is the Bethesda System coverage?", a: "Comprehensive. Questions cover all diagnostic categories, specimen adequacy assessment, clinical management guidelines for each result, and the role of HPV co-testing in cervical cancer screening." },
    ],
    relatedPages: [
      { slug: "microbiology-exam-prep", label: "Microbiology" },
      { slug: "hematology-practice-questions", label: "Hematology" },
      { slug: "laboratory-operations-quality", label: "Lab Operations & QC" },
      { slug: "molecular-diagnostics-poct", label: "Molecular & POCT" },
    ],
  },
  "molecular-diagnostics-poct": {
    title: "MLT Molecular Diagnostics & Point-of-Care Testing Questions | PCR, POCT, Rapid Tests",
    metaDesc: "Master molecular diagnostics and POCT for your MLT exam. 100+ questions covering PCR, RT-PCR, FISH, NGS, POC blood gases, rapid antigen tests, and POCT quality management.",
    h1: "Molecular Diagnostics & Point-of-Care Testing Questions",
    heroSub: "Comprehensive coverage of molecular testing methods (PCR, RT-PCR, FISH, NGS), point-of-care testing devices, rapid antigen tests, and POCT quality management.",
    keywords: "MLT molecular diagnostics questions, PCR exam prep, POCT questions, rapid testing, point-of-care quality management",
    canonicalPath: "/allied-health/mlt/molecular-diagnostics-poct",
    icon: Zap,
    category: "Molecular Diagnostics & POCT",
    sections: [
      { heading: "PCR & Molecular Methods", content: "Master the principles and applications of PCR, RT-PCR, real-time quantitative PCR, multiplex PCR, FISH, and next-generation sequencing (NGS). Questions cover nucleic acid extraction, amplification, detection, quality control (internal controls, contamination prevention), and clinical applications in infectious disease, genetics, and oncology." },
      { heading: "Point-of-Care Blood Gas Analysis", content: "Coverage of POC blood gas analyzers (pH, pCO2, pO2, electrolytes, metabolites), calibration principles, quality management, and result interpretation. Includes pre-analytical variables (air bubbles, delayed analysis, heparin effects) and troubleshooting common errors." },
      { heading: "Rapid Antigen & Molecular POC Tests", content: "Questions on rapid strep, rapid flu, COVID-19 antigen tests, rapid HIV, urine pregnancy (hCG), POC glucose, POC hemoglobin, POC INR/ACT, and POC cardiac troponin. Includes test performance characteristics (sensitivity, specificity, PPV, NPV) and limitations." },
      { heading: "POCT Quality Management", content: "CLIA waived testing requirements, operator competency assessment, QC frequency and documentation, proficiency testing, connectivity (POCT1-A standard), and correlation studies with central laboratory methods. Canadian (CSA Z22870) and US (CAP/COLA) regulatory requirements." },
    ],
    sampleQuestions: [
      { stem: "A multiplex PCR internal control amplifies but all targets are negative. Interpretation?", answer: "Valid negative result. The internal control confirms extraction, amplification, and detection worked properly. No target organisms detected." },
      { stem: "A POC glucose meter shows 35 mg/dL in a neonate with hematocrit 65%. Most likely explanation?", answer: "Falsely low result due to high hematocrit interference. High Hct = less plasma per sample volume = underestimated glucose." },
    ],
    faqs: [
      { q: "How important is molecular diagnostics on the MLT exam?", a: "Molecular diagnostics is a growing content area on both ASCP and CSMLS exams. Expect 5-10% of questions on molecular methods, with the percentage increasing as these technologies become standard practice." },
      { q: "Do I need to understand NGS for the exam?", a: "Basic NGS principles are increasingly tested, especially for hematologic malignancy panels. Focus on understanding the workflow (library prep, sequencing, bioinformatics) and clinical applications rather than memorizing specific platforms." },
      { q: "Is POCT quality management heavily tested?", a: "Yes. Expect questions on operator competency, QC requirements for waived tests, connectivity, and the differences between waived, moderate, and high-complexity testing. These are practical questions that labs encounter daily." },
      { q: "Are rapid COVID-19 test questions included?", a: "Yes. We cover SARS-CoV-2 rapid antigen tests (nucleocapsid detection, sensitivity limitations), RT-PCR testing (gene targets, cycle threshold interpretation), and the clinical decision algorithms for each test type." },
    ],
    relatedPages: [
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry" },
      { slug: "microbiology-exam-prep", label: "Microbiology" },
      { slug: "laboratory-operations-quality", label: "Lab Operations & QC" },
      { slug: "hematology-practice-questions", label: "Hematology" },
    ],
  },
  "blog-mlt-career-guide": {
    title: "Complete MLT Career Guide 2025 | Salary, Education, Certification & Job Outlook",
    metaDesc: "Everything you need to know about becoming a Medical Laboratory Technologist. Education requirements, ASCP/CSMLS certification paths, salary data, career advancement, and job outlook.",
    h1: "The Complete Guide to a Career as a Medical Laboratory Technologist (MLT)",
    heroSub: "From education pathways to certification exams, salary expectations to career advancement — your comprehensive guide to succeeding in medical laboratory science.",
    keywords: "MLT career guide, medical laboratory technologist salary, MLT certification requirements, medical lab science career, ASCP certification path",
    canonicalPath: "/allied-health/mlt/blog/career-guide",
    icon: GraduationCap,
    category: "Career Guide",
    isBlog: true,
    sections: [
      { heading: "What Does a Medical Laboratory Technologist Do?", content: "Medical Laboratory Technologists (MLTs) are healthcare professionals who perform complex laboratory testing on blood, urine, tissue, and other body fluids. They operate sophisticated instruments, analyze results, and play a critical role in disease diagnosis, treatment monitoring, and public health surveillance. MLTs work across all major laboratory disciplines: clinical chemistry, hematology, microbiology, immunohematology (blood banking), urinalysis, immunology, molecular diagnostics, and more. Their work directly influences approximately 70% of all medical decisions." },
      { heading: "Education & Certification Requirements", content: "In the United States, MLTs typically complete a 2-year associate degree program (MLT) or 4-year bachelor's degree (MLS) accredited by NAACLS. Certification through ASCP Board of Certification is the industry standard. In Canada, a bachelor's degree in medical laboratory science from a CSMLS-accredited program is required, followed by the CSMLS certification examination. Both paths require clinical rotations in each major laboratory discipline. Some states require additional licensure beyond national certification." },
      { heading: "Salary & Job Outlook", content: "The Bureau of Labor Statistics reports a median annual salary of $57,380 for Clinical Laboratory Technologists and Technicians (2023 data), with the top 10% earning over $81,530. The field is projected to grow 5% from 2022-2032. Salary varies by specialization: molecular diagnostics and blood banking specialists often command premium salaries. Geographic location, experience, and certifications significantly impact earning potential. Canadian MLTs earn $55,000-$85,000 CAD depending on province and experience." },
      { heading: "Career Advancement Opportunities", content: "MLTs can advance through specialization (SBB for blood banking, SM for microbiology, SH for hematology), management roles (laboratory supervisor, laboratory manager, laboratory director), education (clinical instructor, program director), quality management (quality officer), research, and sales/applications for diagnostic companies. Advanced degrees (MS, PhD) open additional career paths in pathology, research, and academia." },
    ],
    sampleQuestions: [
      { stem: "What is the difference between MLT and MLS certification?", answer: "MLT (Medical Laboratory Technician) requires an associate degree. MLS (Medical Laboratory Scientist) requires a bachelor's degree. MLS has broader scope and higher salary potential." },
      { stem: "Which certification exam should Canadian MLT students take?", answer: "The CSMLS (Canadian Society for Medical Laboratory Science) national certification examination, which covers all major laboratory disciplines with Canadian regulatory content." },
    ],
    faqs: [
      { q: "How long does it take to become an MLT?", a: "MLT (associate degree): 2 years. MLS (bachelor's degree): 4 years. Both include clinical rotations. After graduating, you'll take a national certification exam (ASCP BOC in the US, CSMLS in Canada)." },
      { q: "Is there a shortage of medical laboratory technologists?", a: "Yes. The laboratory workforce faces significant shortages, particularly due to retirements and insufficient training program capacity. This creates strong job security and competitive salaries for new graduates." },
      { q: "Can I specialize in a specific area of the laboratory?", a: "Yes. ASCP offers specialty certifications in blood banking (SBB), microbiology (SM), chemistry (SC), hematology (SH), and molecular biology (MB). Specialization typically requires additional experience and passing a specialty exam." },
      { q: "What is the pass rate for MLT certification exams?", a: "ASCP BOC pass rates vary by program type, generally 70-85% for first-time takers. CSMLS pass rates are similar. Thorough preparation with practice questions significantly improves your chances of passing on the first attempt." },
    ],
    relatedPages: [
      { slug: "blog-mlt-study-strategies", label: "MLT Study Strategies" },
      { slug: "blog-mlt-lab-safety", label: "Lab Safety Guide" },
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry Questions" },
      { slug: "hematology-practice-questions", label: "Hematology Questions" },
    ],
  },
  "blog-mlt-study-strategies": {
    title: "MLT Exam Study Strategies | How to Pass ASCP/CSMLS on Your First Attempt",
    metaDesc: "Proven study strategies for passing the ASCP BOC and CSMLS MLT certification exams. Study schedules, spaced repetition techniques, high-yield topics, and practice question approaches.",
    h1: "How to Pass Your MLT Certification Exam on the First Attempt",
    heroSub: "Evidence-based study strategies, optimal study schedules, high-yield topic prioritization, and practice question techniques to maximize your certification exam score.",
    keywords: "MLT exam study tips, ASCP exam strategies, CSMLS exam preparation, MLT study schedule, medical lab exam tips",
    canonicalPath: "/allied-health/mlt/blog/study-strategies",
    icon: Brain,
    category: "Study Strategies",
    isBlog: true,
    sections: [
      { heading: "Building Your Study Schedule", content: "Start studying 8-12 weeks before your exam date. Allocate time proportional to exam blueprint weights: Clinical Chemistry (20-25%), Hematology (20-25%), Microbiology (15-20%), Blood Banking (15-20%), and remaining disciplines (20-30%). Dedicate 2-3 hours daily, with longer sessions on weekends. Begin with your weakest areas to allow maximum repetition time. Use a calendar to schedule specific topics for each study session." },
      { heading: "Spaced Repetition & Active Recall", content: "Passive reading is the least effective study method. Instead, use active recall (practice questions, self-testing) and spaced repetition (reviewing material at increasing intervals). After studying a topic, test yourself immediately, then again at 1 day, 3 days, 1 week, and 2 weeks. Our adaptive practice engine automates this process, prioritizing questions you've missed and spacing reviews optimally." },
      { heading: "High-Yield Topics to Prioritize", content: "Focus on the highest-yield topics first: hemoglobin electrophoresis patterns, QC Westgard rules, hepatitis serological profiles, antibody identification panels, acid-base interpretation, iron studies patterns, urine sediment elements, and Gram stain organism identification. These topics appear frequently and have high point density. Master the patterns and differential diagnosis algorithms rather than isolated facts." },
      { heading: "Practice Question Strategy", content: "Do a minimum of 1,000 practice questions before your exam. Read the entire question stem carefully before looking at options. Eliminate obviously wrong answers first. When stuck between two options, re-read the stem for the key differentiating detail. Review rationales for BOTH correct and incorrect answers — understanding why wrong answers are wrong builds deeper knowledge. Track your performance by topic to identify weak areas for additional study." },
    ],
    sampleQuestions: [
      { stem: "What is the most effective study technique for MLT exam preparation?", answer: "Active recall through practice questions combined with spaced repetition. Testing yourself is 2-3x more effective than re-reading notes." },
      { stem: "How many practice questions should I complete before the exam?", answer: "A minimum of 1,000 questions is recommended. Focus on understanding rationales, not just memorizing answers." },
    ],
    faqs: [
      { q: "How long should I study for the MLT certification exam?", a: "Most successful candidates study for 8-12 weeks with 2-3 hours of daily dedicated study time. This allows sufficient coverage of all content areas with time for review and practice exams." },
      { q: "What are the most commonly tested topics?", a: "High-frequency topics include: QC rules (Westgard), hemoglobin electrophoresis patterns, hepatitis serological panels, CBC interpretation, acid-base balance, antibody identification panels, Gram stain morphology, and special stain results." },
      { q: "Should I take a practice exam before the real exam?", a: "Absolutely. Take at least 2-3 timed practice exams under exam-like conditions. This helps with time management, builds stamina, and identifies remaining weak areas. Our mock exam simulates the actual testing experience." },
      { q: "Is it worth studying the less-common topics like parasitology?", a: "Yes. While parasitology and virology have fewer questions, they are often easier points because many candidates neglect these areas. Studying them provides competitive advantage." },
    ],
    relatedPages: [
      { slug: "blog-mlt-career-guide", label: "MLT Career Guide" },
      { slug: "blog-mlt-lab-safety", label: "Lab Safety Guide" },
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry Questions" },
      { slug: "microbiology-exam-prep", label: "Microbiology Prep" },
    ],
  },
  "blog-mlt-lab-safety": {
    title: "Laboratory Safety for MLTs | OSHA, Bloodborne Pathogens, Chemical Hygiene & BSCs",
    metaDesc: "Essential laboratory safety knowledge for MLT certification exams and practice. OSHA regulations, bloodborne pathogen standard, chemical hygiene plan, biological safety cabinets, and fire safety.",
    h1: "Laboratory Safety: Essential Knowledge for Medical Laboratory Technologists",
    heroSub: "Comprehensive guide to laboratory safety regulations, bloodborne pathogen prevention, chemical hygiene, biological safety cabinet use, and emergency procedures for MLT professionals.",
    keywords: "laboratory safety MLT, OSHA bloodborne pathogens, chemical hygiene plan, biological safety cabinets, lab safety regulations",
    canonicalPath: "/allied-health/mlt/blog/lab-safety",
    icon: Shield,
    category: "Lab Safety",
    isBlog: true,
    sections: [
      { heading: "OSHA Bloodborne Pathogen Standard", content: "The OSHA Bloodborne Pathogen Standard (29 CFR 1910.1030) is fundamental to laboratory safety. Key requirements: exposure control plan, universal/standard precautions, engineering controls (safety needles, sharps containers), work practice controls (no eating/drinking in lab), PPE requirements (gloves, lab coat, eye protection), hepatitis B vaccination offered to all at-risk employees, post-exposure evaluation and follow-up, and annual training." },
      { heading: "Chemical Hygiene Plan", content: "Every laboratory must have a written Chemical Hygiene Plan (CHP) per OSHA 29 CFR 1910.1450. The CHP designates a Chemical Hygiene Officer, establishes standard operating procedures for chemical handling, specifies exposure limits (PEL, TLV), requires Safety Data Sheets (SDS) for all chemicals, mandates fume hood use for volatile chemicals, and outlines spill response procedures. Formaldehyde (PEL 0.75 ppm) and xylene require special monitoring." },
      { heading: "Biological Safety Cabinets & Biosafety Levels", content: "BSC classes: Class I (worker/environment protection only), Class II Type A2 (worker, specimen, environment — most common in clinical labs), Class III (glove box, maximum containment). Biosafety levels: BSL-1 (no known human pathogens), BSL-2 (moderate risk — most clinical labs), BSL-3 (high risk — M. tuberculosis, dimorphic fungi), BSL-4 (dangerous exotic agents — Ebola). Annual BSC certification required." },
      { heading: "Fire Safety & Emergency Procedures", content: "Fire extinguisher types: Class A (ordinary combustibles), Class B (flammable liquids), Class C (electrical), Class D (combustible metals), Class K (cooking oils). PASS method: Pull, Aim, Squeeze, Sweep. RACE for fire response: Rescue, Alarm, Contain, Extinguish/Evacuate. Chemical spill kit contents, emergency shower/eyewash station requirements (within 10 seconds of travel), and evacuation procedures." },
    ],
    sampleQuestions: [
      { stem: "OSHA PEL for formaldehyde as an 8-hour TWA is:", answer: "0.75 ppm (STEL: 2 ppm for 15 minutes). Formaldehyde is classified as a human carcinogen (IARC Group 1)." },
      { stem: "BSC Class II Type A2 provides protection for:", answer: "The worker (inward airflow), the specimen (downward HEPA-filtered laminar flow), and the environment (HEPA-filtered exhaust)." },
    ],
    faqs: [
      { q: "How many safety questions are on the MLT exam?", a: "Laboratory safety questions are integrated throughout the exam, typically 5-10% of questions. They may appear in any discipline section, testing your knowledge of safe handling practices, regulatory requirements, and emergency procedures." },
      { q: "Do I need to know specific OSHA PEL values?", a: "For the exam, know the key PELs: formaldehyde (0.75 ppm TWA), and general principles of exposure monitoring. Understanding the regulatory framework is more important than memorizing every specific limit." },
      { q: "Is Canadian laboratory safety covered?", a: "Yes. Our Canadian track covers WHMIS (Workplace Hazardous Materials Information System), provincial OH&S regulations, CSA standards for biological safety, and Canadian biosafety guidelines alongside US OSHA standards." },
      { q: "Are biosafety levels commonly tested?", a: "Yes. Know which organisms require BSL-2 vs. BSL-3 containment, BSC classification, and basic principles of each biosafety level. This is a high-yield safety topic." },
    ],
    relatedPages: [
      { slug: "blog-mlt-career-guide", label: "MLT Career Guide" },
      { slug: "blog-mlt-study-strategies", label: "Study Strategies" },
      { slug: "laboratory-operations-quality", label: "Lab Operations & QC" },
      { slug: "clinical-chemistry-questions", label: "Clinical Chemistry Questions" },
    ],
  },
};

function FAQSection({ faqs, pageTitle }: { faqs: { q: string; a: string }[]; pageTitle: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <section className="mt-12" data-testid="faq-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-blue-600" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              data-testid={`faq-toggle-${i}`}
            >
              <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ConversionCTA({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  if (variant === "secondary") {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 my-8" data-testid="cta-secondary">
        <div className="flex items-start gap-4">
          <Lock className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock the Full Question Bank</h3>
            <p className="text-gray-600 mb-4">Access 1,500+ MLT practice questions with detailed rationales, adaptive practice, and performance tracking.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/allied-health/mlt-practice-questions">
                <a className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors" data-testid="cta-try-free">
                  Try Free Questions <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
              <Link href="/pricing">
                <a className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium border border-blue-300 hover:bg-blue-50 transition-colors" data-testid="cta-see-pricing">
                  See Pricing
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white my-12" data-testid="cta-primary">
      <div className="max-w-2xl mx-auto text-center">
        <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
        <h3 className="text-2xl font-bold mb-3">Ready to Start Practicing?</h3>
        <p className="text-blue-100 mb-6">Join thousands of MLT students preparing for their certification exams with NurseNest's comprehensive question bank, adaptive practice engine, and detailed rationales.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/allied-health/mlt-practice-questions">
            <a className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors" data-testid="cta-start-practicing">
              <Target className="w-5 h-5" />
              Start Practicing Free
            </a>
          </Link>
          <Link href="/allied-health/mlt/exams">
            <a className="inline-flex items-center gap-2 bg-blue-500/30 text-white px-6 py-3 rounded-lg font-medium border border-white/30 hover:bg-blue-500/50 transition-colors" data-testid="cta-mock-exams">
              <FileText className="w-5 h-5" />
              Take a Mock Exam
            </a>
          </Link>
        </div>
        <p className="text-blue-200 text-sm mt-4">No credit card required. Free tier includes 15 diagnostic questions.</p>
      </div>
    </div>
  );
}

function RelatedTopics({ pages }: { pages: { slug: ContentPageSlug; label: string }[] }) {
  return (
    <section className="mt-12 border-t border-gray-200 pt-8" data-testid="related-topics">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-600" />
        Related Study Topics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pages.map((page) => {
          const config = PAGE_CONFIGS[page.slug];
          const Icon = config?.icon || BookOpen;
          const basePath = config?.isBlog ? "/allied-health/mlt/blog/" : "/allied-health/mlt/";
          const urlSlug = config?.isBlog ? page.slug.replace("blog-mlt-", "") : page.slug;
          return (
            <Link key={page.slug} href={`${basePath}${urlSlug}`}>
              <a className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors group" data-testid={`related-link-${page.slug}`}>
                <Icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                <span className="font-medium text-gray-700 group-hover:text-blue-700">{page.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function MltContentPage({ slug }: MltContentPageProps) {
  const config = PAGE_CONFIGS[slug];
  if (!config) return <div className="p-8 text-center text-gray-500">Page not found</div>;

  const Icon = config.icon;

  const structuredData = config.isBlog
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: config.h1,
        description: config.metaDesc,
        author: { "@type": "Organization", name: "NurseNest" },
        publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.nursenest.ca${config.canonicalPath}` },
      }
    : {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: config.h1,
        description: config.metaDesc,
        provider: { "@type": "Organization", name: "NurseNest" },
        educationalLevel: "Professional Certification",
        learningResourceType: "Practice Questions",
        about: { "@type": "Thing", name: config.category },
      };

  return (
    <div className="min-h-screen bg-gray-50">
      <AlliedSEO
        title={config.title}
        description={config.metaDesc}
        keywords={config.keywords}
        canonicalPath={config.canonicalPath}
        ogType={config.isBlog ? "article" : "website"}
        structuredData={structuredData}
      />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 px-4" data-testid="hero-section">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium mb-4">
            <Link href="/allied-health/mlt-practice-questions"><a className="hover:text-white transition-colors">MLT Exam Prep</a></Link>
            <span>/</span>
            <span className="text-blue-200">{config.category}</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Icon className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="page-title">{config.h1}</h1>
              <p className="text-lg text-blue-100 leading-relaxed max-w-3xl" data-testid="page-subtitle">{config.heroSub}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/allied-health/mlt-practice-questions">
              <a className="inline-flex items-center gap-2 bg-white text-blue-800 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors" data-testid="hero-cta-start">
                <Target className="w-5 h-5" />
                Start Practicing
              </a>
            </Link>
            <Link href="/allied-health/mlt/exams">
              <a className="inline-flex items-center gap-2 bg-blue-700/50 text-white px-6 py-3 rounded-lg font-medium border border-white/20 hover:bg-blue-700/70 transition-colors" data-testid="hero-cta-mock">
                <FileText className="w-5 h-5" />
                Take Mock Exam
              </a>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {config.sections.map((section, i) => (
          <div key={i}>
            <section className="mb-8" data-testid={`content-section-${i}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{section.content}</p>
            </section>
            {i === 1 && <ConversionCTA variant="secondary" />}
          </div>
        ))}

        {config.sampleQuestions.length > 0 && (
          <section className="mt-12 bg-white rounded-xl border border-gray-200 p-6" data-testid="sample-questions">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              Sample Questions
            </h2>
            <div className="space-y-6">
              {config.sampleQuestions.map((q, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4" data-testid={`sample-q-${i}`}>
                  <p className="font-medium text-gray-900 mb-2">{q.stem}</p>
                  <p className="text-gray-600 text-sm"><span className="font-medium text-green-700">Answer:</span> {q.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
              <p className="text-sm text-blue-800 font-medium">Want more practice questions like these?</p>
              <Link href="/allied-health/mlt-practice-questions">
                <a className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1" data-testid="sample-q-cta">
                  Access Full Bank <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </div>
          </section>
        )}

        <ConversionCTA variant="primary" />

        <FAQSection faqs={config.faqs} pageTitle={config.h1} />

        <RelatedTopics pages={config.relatedPages} />

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Content reviewed by certified medical laboratory professionals. Updated regularly to reflect current exam blueprints.</p>
        </div>
      </div>
    </div>
  );
}
