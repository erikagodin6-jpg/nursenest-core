import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch7: CareerQuestion[] = [
  {
    id: "mlt-batch-401",
    stem: "A bone marrow aspirate reveals >20% blasts that are positive for myeloperoxidase (MPO) stain. This finding is most consistent with:",
    options: ["Acute lymphoblastic leukemia", "Acute myeloid leukemia", "Chronic lymphocytic leukemia", "Hairy cell leukemia"],
    correctIndex: 1,
    rationale: "MPO positivity in blasts indicates myeloid lineage. AML is defined by ≥20% myeloid blasts in bone marrow. ALL blasts are MPO-negative. CLL and hairy cell leukemia are mature lymphoid neoplasms, not blast disorders.",
    difficulty: 5,
    category: "Advanced Hematology",
    topic: "acute leukemia classification"
  },
  {
    id: "mlt-batch-402",
    stem: "A peripheral blood smear shows numerous smudge cells (basket cells). This finding is most characteristic of:",
    options: ["Acute myeloid leukemia", "Chronic lymphocytic leukemia", "Infectious mononucleosis", "Hairy cell leukemia"],
    correctIndex: 1,
    rationale: "Smudge cells (basket cells) are fragile lymphocytes that rupture during slide preparation, characteristic of CLL. The neoplastic lymphocytes in CLL are extremely fragile due to decreased vimentin content.",
    difficulty: 5,
    category: "Advanced Hematology",
    topic: "CLL morphology"
  },
  {
    id: "mlt-batch-403",
    stem: "Which quality control rule is violated when two consecutive control values fall on the same side of the mean, beyond 2 standard deviations?",
    options: ["1-2s warning rule", "2-2s rule", "R-4s rule", "1-3s rule"],
    correctIndex: 1,
    rationale: "The 2-2s rule is violated when two consecutive control results exceed ±2 SD on the same side of the mean. This indicates systematic error (shift or trend). The 1-2s is a warning, 1-3s is a single result beyond 3 SD, and R-4s is the range between two controls exceeding 4 SD.",
    difficulty: 5,
    category: "Quality Assurance/Lab Management",
    topic: "Westgard rules"
  },
  {
    id: "mlt-batch-404",
    stem: "Flow cytometry reveals a population of cells positive for CD5, CD19, CD20 (dim), and CD23. These markers are most consistent with:",
    options: ["Mantle cell lymphoma", "Chronic lymphocytic leukemia/small lymphocytic lymphoma", "Follicular lymphoma", "Diffuse large B-cell lymphoma"],
    correctIndex: 1,
    rationale: "CD5+, CD19+, CD20 dim, and CD23+ is the classic immunophenotype for CLL/SLL. Mantle cell lymphoma is CD5+ but CD23 negative. Follicular lymphoma is CD5 negative and CD10 positive.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "flow cytometry immunophenotyping"
  },
  {
    id: "mlt-batch-405",
    stem: "A laboratory receives proficiency testing samples three times per year. What is the primary purpose of proficiency testing?",
    options: ["To calibrate instruments", "To evaluate and compare laboratory performance against peer groups", "To train new employees", "To replace internal quality control"],
    correctIndex: 1,
    rationale: "Proficiency testing (PT) or external quality assessment evaluates laboratory accuracy by comparing results with peer laboratories using the same methods. PT does not replace internal QC, calibrate instruments, or serve as a training tool.",
    difficulty: 5,
    category: "Quality Assurance/Lab Management",
    topic: "proficiency testing"
  },
  {
    id: "mlt-batch-406",
    stem: "A patient's peripheral smear shows large, pale-staining lymphocytes with cytoplasmic projections (hairy projections). The most likely diagnosis is:",
    options: ["Chronic lymphocytic leukemia", "Hairy cell leukemia", "Adult T-cell leukemia", "Prolymphocytic leukemia"],
    correctIndex: 1,
    rationale: "Hairy cell leukemia is characterized by lymphocytes with fine, hair-like cytoplasmic projections. These cells are TRAP (tartrate-resistant acid phosphatase) positive. It typically presents with pancytopenia and splenomegaly.",
    difficulty: 5,
    category: "Advanced Hematology",
    topic: "hairy cell leukemia"
  },
  {
    id: "mlt-batch-407",
    stem: "When performing a manual differential on a bone marrow aspirate, which of the following best describes a myeloblast?",
    options: ["Large cell with abundant blue cytoplasm and Auer rods possible", "Small cell with scant cytoplasm and coarse chromatin", "Large cell with prominent nucleoli and azurophilic granules", "Binucleate cell with mirror-image nuclei"],
    correctIndex: 0,
    rationale: "Myeloblasts are large cells with fine chromatin, prominent nucleoli, and scant to moderate basophilic cytoplasm. Auer rods (fused azurophilic granules) may be present and are pathognomonic for myeloid lineage. They are never found in lymphoid blasts.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "bone marrow morphology"
  },
  {
    id: "mlt-batch-408",
    stem: "A Levey-Jennings chart shows seven consecutive control values above the mean but within 2 SD. This pattern indicates:",
    options: ["Random error", "A shift (systematic error)", "Acceptable performance", "Loss of precision"],
    correctIndex: 1,
    rationale: "Seven consecutive results on one side of the mean violates the 7x rule, indicating a shift (systematic error). Common causes include deteriorating reagents, calibration drift, or change in incubation temperature. Random error would show results scattered on both sides.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "Levey-Jennings chart interpretation"
  },
  {
    id: "mlt-batch-409",
    stem: "A peripheral smear shows red cells with basophilic stippling. Which condition is most commonly associated with this finding?",
    options: ["Iron deficiency anemia", "Lead poisoning", "Hereditary spherocytosis", "Glucose-6-phosphate dehydrogenase deficiency"],
    correctIndex: 1,
    rationale: "Basophilic stippling represents aggregated ribosomes and is classically associated with lead poisoning, which inhibits pyrimidine-5′-nucleotidase. Also seen in thalassemia, sideroblastic anemia, and heavy metal poisoning.",
    difficulty: 5,
    category: "Advanced Hematology",
    topic: "RBC inclusions"
  },
  {
    id: "mlt-batch-410",
    stem: "Which regulatory agency is responsible for accrediting clinical laboratories in the United States?",
    options: ["FDA", "CDC", "CMS through CLIA", "OSHA"],
    correctIndex: 2,
    rationale: "CMS administers the Clinical Laboratory Improvement Amendments (CLIA) program, which regulates all clinical laboratory testing. CAP, COLA, and state agencies serve as deemed accrediting organizations under CLIA. FDA regulates test kits and reagents.",
    difficulty: 5,
    category: "Quality Assurance/Lab Management",
    topic: "laboratory accreditation"
  },
  {
    id: "mlt-batch-411",
    stem: "A patient's blood smear shows target cells, microcytosis, and Hemoglobin H inclusions on supravital stain. The most likely diagnosis is:",
    options: ["Beta-thalassemia major", "Alpha-thalassemia (HbH disease)", "Iron deficiency anemia", "Sickle cell disease"],
    correctIndex: 1,
    rationale: "HbH inclusions (golf-ball appearance on supravital stain) are pathognomonic for HbH disease (3-gene deletion alpha-thalassemia). Excess beta chains form tetramers (HbH = β4). Target cells and microcytosis accompany this hemolytic condition.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "thalassemia"
  },
  {
    id: "mlt-batch-412",
    stem: "What is the purpose of running a blank sample during spectrophotometric analysis?",
    options: ["To verify the wavelength accuracy", "To set the instrument to zero absorbance and correct for background interference", "To check for stray light", "To verify the Beer-Lambert law"],
    correctIndex: 1,
    rationale: "A blank (reagent blank) contains all components except the analyte. It zeroes the instrument to account for absorbance from reagents, cuvette, and solvent, ensuring only the analyte's absorbance is measured.",
    difficulty: 5,
    category: "Quality Assurance/Lab Management",
    topic: "spectrophotometry basics"
  },
  {
    id: "mlt-batch-413",
    stem: "A patient has pancytopenia with a hypocellular bone marrow (<25% cellularity for age). No dysplasia or increased blasts are present. The most likely diagnosis is:",
    options: ["Myelodysplastic syndrome", "Aplastic anemia", "Acute myeloid leukemia", "Chronic myelogenous leukemia"],
    correctIndex: 1,
    rationale: "Aplastic anemia presents with pancytopenia and hypocellular marrow replaced by fat. No dysplasia or blasts are seen. MDS shows dysplasia, AML has ≥20% blasts, and CML shows hypercellular marrow with granulocytic hyperplasia.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "bone marrow failure"
  },
  {
    id: "mlt-batch-414",
    stem: "During a laboratory audit, it is discovered that a technologist has been reporting patient results without running daily quality control. What is the most appropriate action?",
    options: ["Continue reporting results as long as they look reasonable", "Investigate which results may have been affected, re-run QC, and notify the laboratory director", "Fire the technologist immediately", "Wait until the next scheduled QC run"],
    correctIndex: 1,
    rationale: "Patient results reported without QC verification may be inaccurate. The laboratory must investigate, repeat testing if possible, run QC to verify system performance, and notify the laboratory director. CLIA requires QC before reporting results.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "QC compliance"
  },
  {
    id: "mlt-batch-415",
    stem: "The Philadelphia chromosome t(9;22) producing the BCR-ABL1 fusion gene is the hallmark of which hematologic malignancy?",
    options: ["Acute lymphoblastic leukemia", "Chronic myelogenous leukemia", "Acute promyelocytic leukemia", "Essential thrombocythemia"],
    correctIndex: 1,
    rationale: "The Philadelphia chromosome t(9;22)(q34;q11) creates the BCR-ABL1 fusion protein with constitutive tyrosine kinase activity. It defines CML and is found in >95% of cases. It can also occur in a subset of ALL but is the hallmark of CML.",
    difficulty: 5,
    category: "Advanced Hematology",
    topic: "cytogenetics"
  },
  {
    id: "mlt-batch-416",
    stem: "What does the coefficient of variation (CV) measure in laboratory quality control?",
    options: ["Accuracy of results", "Precision (reproducibility) expressed as a percentage", "Sensitivity of the assay", "Specificity of the assay"],
    correctIndex: 1,
    rationale: "CV = (SD/mean) × 100%. It measures precision (reproducibility) as a percentage, allowing comparison of variability between methods or analytes with different means. A lower CV indicates better precision.",
    difficulty: 5,
    category: "Quality Assurance/Lab Management",
    topic: "statistical measures"
  },
  {
    id: "mlt-batch-417",
    stem: "Auer rods composed of multiple bundled needles forming a faggot-like appearance in blasts are pathognomonic for:",
    options: ["AML-M0 (minimally differentiated)", "AML-M3 (acute promyelocytic leukemia)", "AML-M5 (acute monocytic leukemia)", "AML-M7 (acute megakaryoblastic leukemia)"],
    correctIndex: 1,
    rationale: "Faggot cells containing bundles of Auer rods are pathognomonic for acute promyelocytic leukemia (APL/AML-M3) with t(15;17). This translocation produces the PML-RARA fusion. APL is a medical emergency due to risk of DIC.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "acute promyelocytic leukemia"
  },
  {
    id: "mlt-batch-418",
    stem: "A new chemistry analyzer is being validated. Which of the following studies compares the new method's results with an established reference method?",
    options: ["Precision study", "Linearity study", "Correlation/comparison study", "Reference range study"],
    correctIndex: 2,
    rationale: "A correlation/comparison (method comparison) study compares results from the new method against a reference or existing method using patient samples across the reportable range. Bland-Altman plots and linear regression are used for analysis.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "method validation"
  },
  {
    id: "mlt-batch-419",
    stem: "A peripheral smear shows red cell fragments (schistocytes), decreased platelet count, and elevated LDH. This triad is most consistent with:",
    options: ["Immune thrombocytopenic purpura", "Thrombotic thrombocytopenic purpura", "Disseminated intravascular coagulation only", "Von Willebrand disease"],
    correctIndex: 1,
    rationale: "Schistocytes + thrombocytopenia + elevated LDH = microangiopathic hemolytic anemia (MAHA). TTP classically presents with this pentad: MAHA, thrombocytopenia, fever, renal dysfunction, and neurologic symptoms. ADAMTS13 activity is severely decreased in TTP.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "thrombotic microangiopathies"
  },
  {
    id: "mlt-batch-420",
    stem: "Which of the following is considered a pre-analytical error in the clinical laboratory?",
    options: ["Instrument malfunction during testing", "Hemolyzed specimen due to improper collection technique", "Transcription error during result entry", "Incorrect reference range in the computer system"],
    correctIndex: 1,
    rationale: "Pre-analytical errors occur before testing: improper specimen collection (hemolysis), incorrect labeling, wrong tube, fasting status, transport conditions. Pre-analytical errors account for 46-68% of all laboratory errors.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "pre-analytical errors"
  },
  {
    id: "mlt-batch-421",
    stem: "A bone marrow shows a dry tap. The subsequent bone marrow biopsy reveals extensive fibrosis with collagen deposition. Which stain is best for demonstrating reticulin fibers?",
    options: ["Wright-Giemsa stain", "Gomori silver stain (reticulin stain)", "Periodic acid-Schiff (PAS)", "Iron stain (Prussian blue)"],
    correctIndex: 1,
    rationale: "Gomori silver stain (reticulin stain) demonstrates reticulin fibers (type III collagen) as black fibers against a yellow-brown background. It is essential for grading myelofibrosis. A dry tap suggests marrow fibrosis preventing aspiration.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "special stains"
  },
  {
    id: "mlt-batch-422",
    stem: "What is the primary purpose of a delta check in the clinical laboratory?",
    options: ["To verify instrument calibration", "To detect specimen identification errors by comparing current and previous results", "To determine if QC is in control", "To calculate the reference range"],
    correctIndex: 1,
    rationale: "Delta checks compare a patient's current result with their previous result. Significant differences may indicate specimen misidentification, sample mix-up, or acute clinical change. It is a post-analytical quality check.",
    difficulty: 4,
    category: "Quality Assurance/Lab Management",
    topic: "delta checks"
  },
  {
    id: "mlt-batch-423",
    stem: "Reed-Sternberg cells (large binucleate cells with owl-eye appearance) in a background of reactive inflammatory cells are diagnostic of:",
    options: ["Non-Hodgkin lymphoma", "Hodgkin lymphoma", "Burkitt lymphoma", "Multiple myeloma"],
    correctIndex: 1,
    rationale: "Reed-Sternberg cells are the hallmark of classic Hodgkin lymphoma. They are large cells with bilobed nuclei and prominent nucleoli resembling owl eyes. They are CD15+ and CD30+ and are found in a background of reactive lymphocytes, eosinophils, and histiocytes.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "Hodgkin lymphoma"
  },
  {
    id: "mlt-batch-424",
    stem: "A laboratory is determining whether to report a critical value. A potassium result of 6.8 mEq/L is obtained. What is the most appropriate next step?",
    options: ["Report the result and move to the next specimen", "Verify the result is not from a hemolyzed specimen, confirm the result, and immediately notify the physician", "Wait for the physician to call for results", "Send the specimen for repeat testing the next day"],
    correctIndex: 1,
    rationale: "Critical values require immediate verification and notification. Hemolysis falsely elevates potassium (pseudohyperkalemia). The technologist must rule out pre-analytical causes, verify the result, and immediately notify the ordering provider per laboratory policy.",
    difficulty: 4,
    category: "Quality Assurance/Lab Management",
    topic: "critical value reporting"
  },
  {
    id: "mlt-batch-425",
    stem: "Which chromosome translocation t(15;17) is associated with acute promyelocytic leukemia and responds to all-trans retinoic acid (ATRA) therapy?",
    options: ["t(8;21)", "t(15;17)", "t(9;22)", "t(8;14)"],
    correctIndex: 1,
    rationale: "t(15;17) creates the PML-RARA fusion gene in APL. ATRA (all-trans retinoic acid) induces differentiation of promyelocytes. This translocation makes APL one of the most curable acute leukemias. t(8;21) = AML-M2, t(9;22) = CML, t(8;14) = Burkitt lymphoma.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "molecular diagnostics in leukemia"
  },
  {
    id: "mlt-batch-426",
    stem: "In the Westgard multi-rule QC system, which rule detects random error?",
    options: ["2-2s rule", "R-4s rule", "10x rule", "7T rule"],
    correctIndex: 1,
    rationale: "The R-4s rule is violated when the difference between two control levels within a run exceeds 4 SD. This detects random error. Systematic error rules include 2-2s, 4-1s, 10x, and 7T (trend).",
    difficulty: 4,
    category: "Quality Assurance/Lab Management",
    topic: "Westgard rules"
  },
  {
    id: "mlt-batch-427",
    stem: "A 65-year-old patient has markedly elevated serum protein with a monoclonal spike (M-spike) on serum protein electrophoresis. Bone marrow shows >10% plasma cells. The most likely diagnosis is:",
    options: ["Waldenström macroglobulinemia", "Multiple myeloma", "Reactive plasmacytosis", "Monoclonal gammopathy of undetermined significance"],
    correctIndex: 1,
    rationale: "Multiple myeloma is defined by ≥10% clonal plasma cells in bone marrow plus an M-protein. MGUS has <10% plasma cells and no end-organ damage. Waldenström macroglobulinemia produces IgM paraprotein with lymphoplasmacytic morphology.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "plasma cell neoplasms"
  },
  {
    id: "mlt-batch-428",
    stem: "During calibration verification, which of the following is assessed?",
    options: ["Accuracy across the reportable range using known-value materials", "Precision of the method only", "Employee competency", "Turnaround time for results"],
    correctIndex: 0,
    rationale: "Calibration verification confirms that the instrument's calibration remains valid across the reportable range. It uses materials of known values (calibrators or verified standards) at minimum 3 concentration levels. Required at least every 6 months per CLIA.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "calibration verification"
  },
  {
    id: "mlt-batch-429",
    stem: "A patient with chronic myelogenous leukemia in blast crisis has blasts that stain positive with terminal deoxynucleotidyl transferase (TdT). This finding indicates:",
    options: ["Myeloid blast crisis", "Lymphoid blast crisis", "Megakaryoblastic crisis", "Erythroid crisis"],
    correctIndex: 1,
    rationale: "TdT is a nuclear enzyme marker of immature lymphoid cells (precursor B and T cells). TdT-positive blast crisis in CML indicates lymphoid transformation. TdT is negative in mature lymphocytes and typically negative in myeloid blasts.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "CML blast crisis"
  },
  {
    id: "mlt-batch-430",
    stem: "What is the purpose of a competency assessment in the clinical laboratory?",
    options: ["To replace proficiency testing", "To evaluate each testing personnel's ability to perform assigned duties and identify training needs", "To validate new methods", "To satisfy manufacturer requirements only"],
    correctIndex: 1,
    rationale: "CLIA requires competency assessment for all testing personnel. It evaluates skills including direct observation, monitoring recording and reporting, review of QC/QA, testing blind samples, and problem-solving. Required semiannually in the first year, then annually.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "personnel competency"
  },
  {
    id: "mlt-batch-431",
    stem: "A peripheral smear shows large, atypical lymphocytes with abundant basophilic cytoplasm that seems to wrap around adjacent red blood cells. This is most consistent with:",
    options: ["Chronic lymphocytic leukemia", "Reactive (atypical) lymphocytes in infectious mononucleosis", "Hairy cell leukemia", "Acute lymphoblastic leukemia"],
    correctIndex: 1,
    rationale: "Reactive (atypical) lymphocytes in EBV mononucleosis are large with abundant basophilic cytoplasm that indents around neighboring RBCs. They are activated T cells responding to EBV-infected B cells. Unlike CLL cells, they are not clonal.",
    difficulty: 1,
    category: "Advanced Hematology",
    topic: "reactive lymphocytes"
  },
  {
    id: "mlt-batch-432",
    stem: "In a laboratory information system (LIS), what is the term for automatically preventing result release when a value falls outside established limits?",
    options: ["Delta check", "Autoverification", "Result flagging with manual review hold", "Reflex testing"],
    correctIndex: 2,
    rationale: "Result flagging with manual review hold prevents automatic release of results outside established parameters. Autoverification is the automatic release of results that meet all defined criteria. Delta checks compare current to previous results.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "laboratory information systems"
  },
  {
    id: "mlt-batch-433",
    stem: "Ringed sideroblasts in bone marrow (iron granules forming a ring around at least one-third of the nucleus) are characteristic of:",
    options: ["Iron deficiency anemia", "Myelodysplastic syndrome with ring sideroblasts", "Megaloblastic anemia", "Aplastic anemia"],
    correctIndex: 1,
    rationale: "Ringed sideroblasts have iron-laden mitochondria forming a perinuclear ring (≥5 granules encircling ≥1/3 of the nucleus). This is a hallmark of MDS-RS (formerly refractory anemia with ring sideroblasts). Often associated with SF3B1 mutation.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "myelodysplastic syndromes"
  },
  {
    id: "mlt-batch-434",
    stem: "A laboratory technologist notices a trend of increasing control values over six consecutive runs, all within 2 SD. What type of error does this represent?",
    options: ["Random error", "Systematic error (trend)", "No error, results are acceptable", "Pre-analytical error"],
    correctIndex: 1,
    rationale: "A progressive, unidirectional change in control values over consecutive runs is a trend, which is a type of systematic error. Common causes include reagent deterioration, aging light sources, or gradual buildup on optics. Action should be taken before values exceed limits.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "trend detection"
  },
  {
    id: "mlt-batch-435",
    stem: "Toxic granulation, Döhle bodies, and cytoplasmic vacuolization in neutrophils are indicative of:",
    options: ["Chronic granulomatous disease", "Severe bacterial infection or sepsis", "Allergic reaction", "Iron deficiency"],
    correctIndex: 1,
    rationale: "Toxic changes in neutrophils (toxic granulation, Döhle bodies, vacuolization) reflect accelerated granulopoiesis and are seen in severe infection/sepsis, burns, and toxic states. Toxic granulation = retained primary granules; Döhle bodies = rough ER remnants.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "neutrophil morphology"
  },
  {
    id: "mlt-batch-436",
    stem: "What does CLIA categorize as a 'waived' test?",
    options: ["Tests requiring highly trained personnel", "Simple tests with negligible risk of erroneous results that are approved for non-laboratory settings", "Tests that do not require quality control", "Tests only performed in reference laboratories"],
    correctIndex: 1,
    rationale: "CLIA-waived tests are simple, accurate tests with negligible risk of error if performed incorrectly (e.g., urine dipstick, glucose monitor, rapid strep). They can be performed in physician offices and clinics. Even waived tests require following manufacturer instructions.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "CLIA test categories"
  },
  {
    id: "mlt-batch-437",
    stem: "A bone marrow aspirate shows numerous cells with eccentric nuclei, perinuclear hof (clear zone), and clock-face chromatin. These cells are most likely:",
    options: ["Myeloblasts", "Plasma cells", "Monocytes", "Megakaryocytes"],
    correctIndex: 1,
    rationale: "Plasma cells have eccentric nuclei with clock-face (cartwheel) chromatin and a perinuclear clear zone (hof) representing the Golgi apparatus. They produce immunoglobulins. Increased plasma cells may indicate multiple myeloma, reactive conditions, or chronic infection.",
    difficulty: 1,
    category: "Advanced Hematology",
    topic: "plasma cell morphology"
  },
  {
    id: "mlt-batch-438",
    stem: "Which of the following is the correct order for establishing a new reference range?",
    options: ["Test 20 healthy individuals from a defined population", "Select reference population, collect specimens, analyze results, determine central 95% range using at least 120 individuals", "Use the manufacturer's package insert values without verification", "Run QC samples and use the mean ± 2 SD"],
    correctIndex: 1,
    rationale: "CLSI recommends at least 120 reference individuals from a well-defined healthy population. The central 95% (2.5th to 97.5th percentile) defines the reference range. If 120 individuals are not feasible, transference or verification protocols may be used.",
    difficulty: 4,
    category: "Quality Assurance/Lab Management",
    topic: "reference range establishment"
  },
  {
    id: "mlt-batch-439",
    stem: "Pelger-Huët anomaly is characterized by neutrophils with:",
    options: ["Hypersegmented nuclei (>5 lobes)", "Bilobed (pince-nez) nuclei with mature, clumped chromatin", "Giant granules and inclusions", "Ring-shaped nuclei"],
    correctIndex: 1,
    rationale: "Pelger-Huët anomaly (hereditary or acquired/pseudo) shows neutrophils with bilobed nuclei resembling pince-nez glasses. Chromatin is mature and coarsely clumped. Pseudo-Pelger-Huët cells are seen in MDS. Function is normal in the hereditary form.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "inherited neutrophil disorders"
  },
  {
    id: "mlt-batch-440",
    stem: "A laboratory is performing a linearity study on a new glucose analyzer. What does this study evaluate?",
    options: ["The ability of the method to produce results proportional to the analyte concentration across the reportable range", "Specificity of the method for glucose", "How well the method correlates with a reference method", "The stability of glucose in stored specimens"],
    correctIndex: 0,
    rationale: "Linearity (analytical measurement range/AMR) evaluates whether the assay produces results directly proportional to analyte concentration. Samples with known concentrations spanning the claimed range are tested. Non-linear results at extremes require dilution protocols.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "linearity studies"
  },
  {
    id: "mlt-batch-441",
    stem: "Which cell is the hallmark of chronic granulomatous disease (CGD) and is identified by the absence of oxidative burst on flow cytometry (dihydrorhodamine test)?",
    options: ["Lymphocyte", "Neutrophil", "Eosinophil", "Basophil"],
    correctIndex: 1,
    rationale: "CGD is caused by defective NADPH oxidase in neutrophils, preventing the oxidative burst needed to kill catalase-positive organisms. The DHR flow cytometry test shows absent or reduced oxidative burst. The older NBT (nitroblue tetrazolium) test is less sensitive.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "phagocyte function disorders"
  },
  {
    id: "mlt-batch-442",
    stem: "What is the primary purpose of performing method validation before implementing a new test in the clinical laboratory?",
    options: ["To satisfy billing requirements", "To verify that the method meets performance specifications for accuracy, precision, linearity, and reportable range in the laboratory's setting", "To determine the cost-effectiveness of the test", "To train staff on the new instrument"],
    correctIndex: 1,
    rationale: "Method validation confirms the test performs within established specifications in the specific laboratory environment. It includes precision, accuracy (comparison), linearity, reportable range, reference range verification, and interference studies.",
    difficulty: 4,
    category: "Quality Assurance/Lab Management",
    topic: "method validation"
  },
  {
    id: "mlt-batch-443",
    stem: "A patient has severe thrombocytopenia (platelets 8,000/µL) with large platelets on smear, normal PT/aPTT, and no schistocytes. Anti-platelet antibodies are positive. The diagnosis is:",
    options: ["Thrombotic thrombocytopenic purpura", "Immune thrombocytopenic purpura (ITP)", "Disseminated intravascular coagulation", "Heparin-induced thrombocytopenia"],
    correctIndex: 1,
    rationale: "ITP features isolated thrombocytopenia with large platelets (compensatory megakaryopoiesis), normal coagulation studies, no schistocytes, and anti-platelet antibodies. TTP would show schistocytes, DIC would show prolonged PT/aPTT, and HIT requires heparin exposure.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "immune thrombocytopenia"
  },
  {
    id: "mlt-batch-444",
    stem: "According to laboratory safety guidelines, which class of fire extinguisher should be used for an electrical fire in the laboratory?",
    options: ["Class A (water)", "Class B (foam)", "Class C (CO2 or dry chemical)", "Class D (metal fires)"],
    correctIndex: 2,
    rationale: "Class C extinguishers (CO2 or dry chemical) are appropriate for electrical fires. Water (Class A) conducts electricity and is dangerous. Class B is for flammable liquids, and Class D is for combustible metals. ABC multipurpose extinguishers cover classes A, B, and C.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "laboratory safety"
  },
  {
    id: "mlt-batch-445",
    stem: "A patient with sickle cell disease has a hemoglobin electrophoresis showing HbS ~85%, HbF ~10%, and HbA2 ~5% with absent HbA. This pattern is consistent with:",
    options: ["Sickle cell trait (HbAS)", "Sickle cell disease (HbSS)", "HbSC disease", "Sickle-beta thalassemia"],
    correctIndex: 1,
    rationale: "HbSS (sickle cell disease) shows predominant HbS with absent HbA. HbF is variably elevated (higher levels are protective). Sickle trait (HbAS) would show ~60% HbA and ~40% HbS. HbSC would show both HbS and HbC.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "hemoglobin electrophoresis"
  },
  {
    id: "mlt-batch-446",
    stem: "Which document describes the step-by-step instructions for performing a specific laboratory test?",
    options: ["Quality manual", "Standard operating procedure (SOP)", "Safety data sheet (SDS)", "Competency assessment form"],
    correctIndex: 1,
    rationale: "SOPs provide detailed, step-by-step instructions for performing a specific test or procedure. They include specimen requirements, reagent preparation, procedure steps, calculations, QC, reporting, and troubleshooting. SOPs must be reviewed and updated annually.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "standard operating procedures"
  },
  {
    id: "mlt-batch-447",
    stem: "Tartrate-resistant acid phosphatase (TRAP) positivity is a cytochemical characteristic of which leukemia?",
    options: ["Acute myeloid leukemia", "Chronic myelogenous leukemia", "Hairy cell leukemia", "Chronic lymphocytic leukemia"],
    correctIndex: 2,
    rationale: "TRAP (isoenzyme 5 of acid phosphatase) is characteristically positive in hairy cell leukemia (HCL). While not 100% specific, it remains a useful diagnostic marker. Flow cytometry (CD103, CD25, CD11c) has largely replaced TRAP staining.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "cytochemical stains"
  },
  {
    id: "mlt-batch-448",
    stem: "A Gaussian (bell-shaped) distribution of QC data indicates:",
    options: ["Systematic error is present", "Only random error is present, with results normally distributed around the mean", "The method is inaccurate", "Pre-analytical errors are occurring"],
    correctIndex: 1,
    rationale: "A Gaussian distribution of QC data indicates that variation is due to random error only, with results symmetrically distributed around the mean. 68% fall within ±1 SD, 95% within ±2 SD, and 99.7% within ±3 SD.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "statistical distributions"
  },
  {
    id: "mlt-batch-449",
    stem: "Eosinophilia (>500/µL) is most commonly associated with which of the following conditions?",
    options: ["Bacterial infection", "Parasitic infection and allergic conditions", "Viral infection", "Iron deficiency anemia"],
    correctIndex: 1,
    rationale: "Eosinophilia is classically associated with parasitic infections (especially tissue-invasive helminths) and allergic/atopic conditions (asthma, eczema, drug reactions). NAACP mnemonic: Neoplasm, Allergy, Asthma, Collagen vascular disease, Parasites.",
    difficulty: 1,
    category: "Advanced Hematology",
    topic: "eosinophilia"
  },
  {
    id: "mlt-batch-450",
    stem: "What is the correct procedure when a quality control result falls outside the acceptable range (out of control)?",
    options: ["Report patient results anyway and note the QC failure", "Troubleshoot the problem, repeat QC, and do not report patient results until QC is in control", "Discard the QC result and use the previous acceptable result", "Call the instrument manufacturer and wait for service"],
    correctIndex: 1,
    rationale: "When QC is out of control, patient results must not be reported. Troubleshoot systematically: check reagents, controls, calibration, and instrument. Repeat QC after corrective action. Document all troubleshooting steps per laboratory policy.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "out-of-control procedures"
  },
  {
    id: "mlt-batch-451",
    stem: "Leukocyte alkaline phosphatase (LAP) score is characteristically LOW in which condition?",
    options: ["Leukemoid reaction", "Chronic myelogenous leukemia", "Polycythemia vera", "Bacterial infection"],
    correctIndex: 1,
    rationale: "LAP score is low in CML because the neoplastic neutrophils have decreased alkaline phosphatase activity. LAP is elevated in leukemoid reactions, polycythemia vera, and infections. This helps distinguish CML from reactive leukocytosis.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "LAP score"
  },
  {
    id: "mlt-batch-452",
    stem: "In a laboratory quality improvement program, what does the PDCA cycle stand for?",
    options: ["Patient Data Collection Analysis", "Plan-Do-Check-Act", "Pre-analytical Data Correction Action", "Procedure Development and Compliance Assessment"],
    correctIndex: 1,
    rationale: "PDCA (Deming cycle): Plan (identify problem and solution), Do (implement change), Check (evaluate results), Act (standardize if successful or revise if not). It is a continuous improvement framework widely used in laboratory quality management.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "quality improvement"
  },
  {
    id: "mlt-batch-453",
    stem: "A bone marrow aspirate shows a markedly increased M:E (myeloid to erythroid) ratio of 10:1. This finding is most consistent with:",
    options: ["Polycythemia vera", "Chronic myelogenous leukemia", "Pure red cell aplasia", "Iron deficiency anemia"],
    correctIndex: 1,
    rationale: "Normal M:E ratio is 2:1 to 4:1. A markedly elevated ratio (10:1) indicates myeloid hyperplasia, seen in CML, infections, and G-CSF therapy. Decreased M:E (<2:1) occurs in erythroid hyperplasia (hemolytic anemia, hemorrhage).",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "bone marrow evaluation"
  },
  {
    id: "mlt-batch-454",
    stem: "Which of the following is the correct action when proficiency testing results are unsatisfactory for two consecutive events?",
    options: ["Ignore if internal QC is acceptable", "Investigate the root cause, implement corrective action, and notify the laboratory director; CMS may impose sanctions", "Switch to a different PT provider", "Reduce the number of patient tests performed"],
    correctIndex: 1,
    rationale: "Two consecutive unsuccessful PT events or two of three events may result in CMS sanctions including directed plan of correction, on-site monitoring, or suspension of testing for that analyte. Root cause investigation and corrective action are mandatory.",
    difficulty: 4,
    category: "Quality Assurance/Lab Management",
    topic: "proficiency testing failures"
  },
  {
    id: "mlt-batch-455",
    stem: "Which hereditary condition presents with giant granules in neutrophils, partial oculocutaneous albinism, and increased susceptibility to infections?",
    options: ["May-Hegglin anomaly", "Chédiak-Higashi syndrome", "Alder-Reilly anomaly", "Pelger-Huët anomaly"],
    correctIndex: 1,
    rationale: "Chédiak-Higashi syndrome is an autosomal recessive disorder caused by LYST gene mutations. Giant lysosomal granules in neutrophils impair chemotaxis and bactericidal activity. Features include partial albinism, recurrent pyogenic infections, and neuropathy.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "inherited granule disorders"
  },
  {
    id: "mlt-batch-456",
    stem: "What is the acceptable criteria for a precision study during method validation?",
    options: ["CV should be less than the manufacturer's stated imprecision", "A single duplicate run is sufficient", "Only normal-level controls need to be tested", "Precision is not required for CLIA-waived tests"],
    correctIndex: 0,
    rationale: "Precision (within-run and between-run) should meet or exceed the manufacturer's stated imprecision (CV). A minimum of 20 measurements over 5-20 days at multiple concentration levels (normal and abnormal) is recommended by CLSI EP15.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "precision studies"
  },
  {
    id: "mlt-batch-457",
    stem: "Warm autoimmune hemolytic anemia (WAIHA) is characterized by autoantibodies of which immunoglobulin class?",
    options: ["IgM", "IgG", "IgA", "IgE"],
    correctIndex: 1,
    rationale: "WAIHA involves IgG autoantibodies that bind RBCs at 37°C. Coated RBCs are destroyed by splenic macrophages (extravascular hemolysis). The DAT is positive for IgG ± C3d. Cold agglutinin disease involves IgM antibodies reacting at lower temperatures.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "autoimmune hemolytic anemia"
  },
  {
    id: "mlt-batch-458",
    stem: "Which of the following safety symbols indicates a biohazard?",
    options: ["A skull and crossbones", "A three-bladed interlocking circle symbol", "A flame pictogram", "A trefoil (three-blade radiation symbol)"],
    correctIndex: 1,
    rationale: "The biohazard symbol is a three-bladed interlocking circle design (bright orange or red). It marks containers, areas, and materials with potentially infectious agents. The trefoil is for radiation, skull and crossbones for toxic substances, and flame for flammables.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "safety symbols"
  },
  {
    id: "mlt-batch-459",
    stem: "A patient presents with Bence Jones proteinuria (free light chains in urine). This finding is most associated with:",
    options: ["Nephrotic syndrome", "Multiple myeloma", "Urinary tract infection", "Diabetic nephropathy"],
    correctIndex: 1,
    rationale: "Bence Jones proteins are free monoclonal immunoglobulin light chains (kappa or lambda) produced by neoplastic plasma cells in multiple myeloma. They pass through the glomerulus and can cause cast nephropathy (myeloma kidney).",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "paraprotein detection"
  },
  {
    id: "mlt-batch-460",
    stem: "A laboratory calculates its turnaround time (TAT) for stat chemistry results. Which metric best measures central tendency for TAT data that may be skewed?",
    options: ["Mean", "Median", "Mode", "Standard deviation"],
    correctIndex: 1,
    rationale: "Median is preferred for skewed data (like TAT) because it is not affected by outliers. Mean is pulled toward extreme values. TAT data often has a right-skewed distribution due to occasional delays. The 90th percentile is also commonly reported.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "turnaround time metrics"
  },
  {
    id: "mlt-batch-461",
    stem: "Heinz bodies are denatured hemoglobin inclusions visible with supravital stains. They are most commonly associated with:",
    options: ["Iron deficiency anemia", "G6PD deficiency", "Beta-thalassemia trait", "Hereditary spherocytosis"],
    correctIndex: 1,
    rationale: "Heinz bodies form when denatured hemoglobin precipitates in RBCs. G6PD deficiency impairs the hexose monophosphate shunt, reducing glutathione and leaving hemoglobin vulnerable to oxidative damage. Crystal violet or brilliant cresyl blue reveals Heinz bodies.",
    difficulty: 2,
    category: "Advanced Hematology",
    topic: "RBC inclusions"
  },
  {
    id: "mlt-batch-462",
    stem: "What is the primary purpose of a root cause analysis (RCA) in the clinical laboratory?",
    options: ["To assign blame to an individual", "To identify the underlying cause of an error or adverse event and prevent recurrence", "To satisfy insurance requirements", "To calculate the financial impact of errors"],
    correctIndex: 1,
    rationale: "RCA is a systematic process to identify the fundamental cause(s) of an error or adverse event. It focuses on system failures rather than individual blame. Tools include fishbone (Ishikawa) diagrams, 5 Whys, and failure mode and effects analysis (FMEA).",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "root cause analysis"
  },
  {
    id: "mlt-batch-463",
    stem: "Howell-Jolly bodies in peripheral blood indicate:",
    options: ["Lead poisoning", "Functional asplenia or post-splenectomy state", "Iron deficiency", "Liver disease"],
    correctIndex: 1,
    rationale: "Howell-Jolly bodies are nuclear remnants (DNA fragments) normally removed by the spleen through pitting. Their presence indicates splenic hypofunction or absence (surgical or functional asplenia, as in sickle cell disease).",
    difficulty: 1,
    category: "Advanced Hematology",
    topic: "splenic function"
  },
  {
    id: "mlt-batch-464",
    stem: "When evaluating an analytical method for interference, which type of study is performed?",
    options: ["Linearity study", "Interference/specificity study testing substances such as hemolysis, icterus, and lipemia", "Precision study", "Stability study"],
    correctIndex: 1,
    rationale: "Interference studies evaluate the effect of endogenous substances (hemolysis, icterus, lipemia = HIL) and common exogenous substances (drugs) on test results. CLSI EP07 provides guidance. Many analyzers now have HIL indices for automatic detection.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "interference studies"
  },
  {
    id: "mlt-batch-465",
    stem: "A patient with polycythemia vera typically presents with which set of laboratory findings?",
    options: ["Decreased RBC mass, increased EPO", "Increased RBC mass, decreased EPO, increased WBC and platelets", "Normal CBC with elevated ESR", "Pancytopenia with hypocellular marrow"],
    correctIndex: 1,
    rationale: "Polycythemia vera (JAK2 V617F mutation in >95%) shows increased RBC mass with suppressed EPO (unlike secondary polycythemia where EPO is elevated). Leukocytosis and thrombocytosis are common. Bone marrow is hypercellular with panmyelosis.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "myeloproliferative neoplasms"
  },
  {
    id: "mlt-batch-466",
    stem: "Which organization publishes guidelines for clinical laboratory practices and quality management systems in the United States?",
    options: ["WHO", "CLSI (Clinical and Laboratory Standards Institute)", "AMA", "Joint Commission only"],
    correctIndex: 1,
    rationale: "CLSI (formerly NCCLS) develops voluntary consensus standards and guidelines for clinical laboratory practices including method validation (EP series), QC, reference range establishment, and specimen handling. CAP and CLIA reference CLSI standards.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "regulatory organizations"
  },
  {
    id: "mlt-batch-467",
    stem: "A patient presents with DIC. Which set of coagulation results is most expected?",
    options: ["Normal PT, normal aPTT, normal fibrinogen", "Prolonged PT, prolonged aPTT, decreased fibrinogen, elevated D-dimer, decreased platelets", "Prolonged PT only, normal aPTT", "Normal coagulation with elevated platelet count"],
    correctIndex: 1,
    rationale: "DIC causes widespread activation of coagulation, consuming clotting factors (prolonged PT/aPTT), fibrinogen (decreased), and platelets (thrombocytopenia). D-dimer is elevated from fibrinolysis. Schistocytes are present on smear from microangiopathy.",
    difficulty: 2,
    category: "Advanced Hematology",
    topic: "disseminated intravascular coagulation"
  },
  {
    id: "mlt-batch-468",
    stem: "In the laboratory, what is the correct order for spill cleanup of a biological specimen?",
    options: ["Wipe up immediately with paper towels then discard", "Apply appropriate disinfectant, allow contact time, then clean up while wearing PPE", "Call the fire department", "Dilute with water and mop"],
    correctIndex: 1,
    rationale: "Biological spill cleanup: don PPE (gloves, gown, eye protection if splash risk), apply disinfectant (10% bleach or hospital-approved), allow appropriate contact time (20-30 minutes for bleach), absorb with paper towels, clean area, dispose as biohazard waste.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "spill cleanup procedures"
  },
  {
    id: "mlt-batch-469",
    stem: "A patient has a normal bleeding time, normal PT, prolonged aPTT, and the aPTT corrects with a 1:1 mixing study. The most likely diagnosis is:",
    options: ["Factor VIII inhibitor (antibody)", "Factor VIII deficiency (Hemophilia A)", "Lupus anticoagulant", "Heparin contamination"],
    correctIndex: 1,
    rationale: "Prolonged aPTT that corrects with mixing study = factor deficiency. Factor VIII deficiency (Hemophilia A) is the most common severe bleeding disorder with isolated prolonged aPTT. Inhibitors and lupus anticoagulant would NOT correct with mixing.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "coagulation mixing studies"
  },
  {
    id: "mlt-batch-470",
    stem: "What type of audit examines whether laboratory procedures are being followed as written in the SOPs?",
    options: ["Financial audit", "Internal (process) audit", "External compliance audit only", "Equipment maintenance audit"],
    correctIndex: 1,
    rationale: "Internal (process) audits verify that laboratory personnel follow written SOPs, document appropriately, and maintain compliance with regulations. They identify gaps between written procedures and actual practice. Regular internal audits are required for accreditation.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "internal audits"
  },
  {
    id: "mlt-batch-471",
    stem: "May-Hegglin anomaly is characterized by which combination of findings?",
    options: ["Giant platelets and Döhle-like inclusions in neutrophils", "Hypersegmented neutrophils and macrocytosis", "Pelgeroid neutrophils and thrombocytosis", "Giant granules and albinism"],
    correctIndex: 0,
    rationale: "May-Hegglin anomaly is an autosomal dominant disorder (MYH9 mutation) characterized by thrombocytopenia with giant platelets and pale-blue Döhle-like inclusions (nonmuscle myosin heavy chain aggregates) in neutrophils. Usually clinically benign.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "inherited platelet disorders"
  },
  {
    id: "mlt-batch-472",
    stem: "What is the purpose of performing a sensitivity analysis in laboratory test evaluation?",
    options: ["To determine how well a test detects true positives (proportion of diseased persons with a positive test)", "To measure instrument precision", "To assess reagent stability", "To evaluate cost-effectiveness"],
    correctIndex: 0,
    rationale: "Sensitivity = TP/(TP+FN) × 100%. It measures the test's ability to correctly identify those with the disease (true positive rate). A highly sensitive test has few false negatives and is good for screening. Sensitivity and specificity are inversely related at different cutoffs.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "diagnostic sensitivity"
  },
  {
    id: "mlt-batch-473",
    stem: "Which type of hemoglobin migrates fastest toward the anode on cellulose acetate electrophoresis at pH 8.6?",
    options: ["HbA", "HbS", "HbC", "HbA2"],
    correctIndex: 0,
    rationale: "On alkaline cellulose acetate electrophoresis (pH 8.6), the migration order from fastest (anode) to slowest (cathode) is: HbA > HbS > HbC. HbA has the greatest negative charge at alkaline pH. HbS and HbC have substitutions that decrease negative charge.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "hemoglobin electrophoresis migration"
  },
  {
    id: "mlt-batch-474",
    stem: "Which of the following best describes the specificity of a diagnostic test?",
    options: ["The ability to detect all cases of disease", "The ability to correctly identify those without the disease (true negative rate)", "The positive predictive value", "The likelihood ratio"],
    correctIndex: 1,
    rationale: "Specificity = TN/(TN+FP) × 100%. It measures the ability to correctly identify those WITHOUT disease. High specificity means few false positives, making it useful for confirmatory testing. SpPIn: a highly Specific test, when Positive, rules IN disease.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "diagnostic specificity"
  },
  {
    id: "mlt-batch-475",
    stem: "Paroxysmal nocturnal hemoglobinuria (PNH) is diagnosed by flow cytometry showing absence of which surface markers?",
    options: ["CD5 and CD23", "CD55 (DAF) and CD59 (MIRL)", "CD34 and TdT", "CD20 and CD10"],
    correctIndex: 1,
    rationale: "PNH results from acquired PIGA gene mutation causing deficiency of GPI-anchored proteins including CD55 (decay accelerating factor) and CD59 (membrane inhibitor of reactive lysis). This leads to complement-mediated hemolysis. Flow cytometry with FLAER is the gold standard.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "paroxysmal nocturnal hemoglobinuria"
  },
  {
    id: "mlt-batch-476",
    stem: "An instrument flags a patient's CBC for platelet clumps. What is the most appropriate next step?",
    options: ["Report the platelet count as is", "Review the peripheral smear, consider redrawing in sodium citrate tube to rule out EDTA-dependent pseudothrombocytopenia", "Increase the platelet count by 20%", "Dilute the sample and rerun"],
    correctIndex: 1,
    rationale: "Platelet clumping causes falsely decreased platelet counts. EDTA-dependent pseudothrombocytopenia is caused by anti-platelet antibodies that react in EDTA. Redrawn in sodium citrate eliminates this artifact. Always verify with smear review.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "pseudothrombocytopenia"
  },
  {
    id: "mlt-batch-477",
    stem: "A patient with essential thrombocythemia has a platelet count >450,000/µL. Which mutation is most commonly associated with this myeloproliferative neoplasm?",
    options: ["BCR-ABL1", "JAK2 V617F", "NPM1", "FLT3-ITD"],
    correctIndex: 1,
    rationale: "JAK2 V617F mutation is found in approximately 55-65% of essential thrombocythemia cases. CALR mutation (~25%) and MPL mutation (~5%) are also seen. BCR-ABL1 must be excluded as CML can present with thrombocytosis.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "myeloproliferative neoplasms"
  },
  {
    id: "mlt-batch-478",
    stem: "What is the purpose of a Safety Data Sheet (SDS) in the clinical laboratory?",
    options: ["To provide billing codes for tests", "To provide detailed information about chemical hazards, safe handling, storage, and emergency procedures", "To describe quality control procedures", "To list employee competency requirements"],
    correctIndex: 1,
    rationale: "SDS (formerly MSDS) contains 16 sections with information on chemical identification, hazards, composition, first aid, fire-fighting, handling/storage, exposure controls, physical/chemical properties, stability, toxicology, and disposal. Required by OSHA's Hazard Communication Standard.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "safety data sheets"
  },
  {
    id: "mlt-batch-479",
    stem: "A direct antiglobulin test (DAT) positive for IgG only, with spherocytes on smear, is most consistent with:",
    options: ["Cold agglutinin disease", "Warm autoimmune hemolytic anemia", "ABO hemolytic disease of the newborn", "Paroxysmal cold hemoglobinuria"],
    correctIndex: 1,
    rationale: "Warm AIHA is characterized by IgG autoantibodies coating RBCs (DAT positive for IgG). Splenic macrophages partially phagocytize coated RBCs, creating spherocytes. Cold agglutinin disease shows DAT positive for C3d only. PCH involves IgG Donath-Landsteiner antibodies.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "direct antiglobulin test"
  },
  {
    id: "mlt-batch-480",
    stem: "In the LEAN methodology applied to laboratory workflow, what does the term 'waste' refer to?",
    options: ["Only biohazardous materials", "Any step in the process that does not add value to the final product or service", "Reagents that have expired", "Specimens that are rejected"],
    correctIndex: 1,
    rationale: "In LEAN, waste (muda) is any activity that does not add value. The 8 wastes are: Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory excess, Motion, Extra-processing (DOWNTIME). LEAN aims to eliminate waste and improve efficiency.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "LEAN methodology"
  },
  {
    id: "mlt-batch-481",
    stem: "Pappenheimer bodies (siderotic granules) in RBCs are composed of:",
    options: ["RNA remnants", "Iron-containing mitochondrial deposits (ferritin/hemosiderin aggregates)", "DNA fragments", "Denatured hemoglobin"],
    correctIndex: 1,
    rationale: "Pappenheimer bodies are iron-containing granules (ferritin clusters) visible on Wright stain as small, dark, irregular inclusions, usually at the cell periphery. Confirmed with Prussian blue stain. Seen in sideroblastic anemia, post-splenectomy, and lead poisoning.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "RBC inclusions"
  },
  {
    id: "mlt-batch-482",
    stem: "Which of the following best describes the purpose of an occurrence (incident) report in the laboratory?",
    options: ["To punish the employee involved", "To document errors, near-misses, or adverse events for analysis and prevention of recurrence", "To calculate productivity metrics", "To track inventory losses"],
    correctIndex: 1,
    rationale: "Occurrence/incident reports document errors, near-misses, and adverse events in a non-punitive manner. They support trend analysis and systemic improvement. Data is used for root cause analysis and corrective/preventive action plans.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "incident reporting"
  },
  {
    id: "mlt-batch-483",
    stem: "The Sudan Black B stain is positive in blasts of which leukemia type?",
    options: ["Acute lymphoblastic leukemia", "Acute myeloid leukemia", "Chronic lymphocytic leukemia", "Hairy cell leukemia"],
    correctIndex: 1,
    rationale: "Sudan Black B stains phospholipids and other lipids in primary (azurophilic) granules of myeloid cells. It parallels MPO positivity and is positive in AML blasts but negative in ALL. It is useful when MPO results are equivocal.",
    difficulty: 2,
    category: "Advanced Hematology",
    topic: "cytochemical stains"
  },
  {
    id: "mlt-batch-484",
    stem: "What is the maximum allowable storage temperature for reagents labeled 'refrigerate'?",
    options: ["Room temperature (20-25°C)", "2-8°C", "-20°C", "36-38°C"],
    correctIndex: 1,
    rationale: "Refrigerated storage is defined as 2-8°C per manufacturer and regulatory guidelines. Temperatures must be monitored and documented daily. Reagents stored outside the specified range may lose potency and produce inaccurate results.",
    difficulty: 1,
    category: "Quality Assurance/Lab Management",
    topic: "reagent storage"
  },
  {
    id: "mlt-batch-485",
    stem: "A patient with von Willebrand disease type 1 would most likely show which set of laboratory results?",
    options: ["Normal PT, prolonged aPTT, decreased vWF antigen and activity, decreased Factor VIII, prolonged bleeding time", "Prolonged PT, normal aPTT, normal bleeding time", "Normal PT, normal aPTT, elevated vWF", "Prolonged PT and aPTT with normal vWF"],
    correctIndex: 0,
    rationale: "VWD type 1 (quantitative deficiency, most common ~80%) shows decreased vWF antigen and ristocetin cofactor activity, secondary decrease in Factor VIII (vWF stabilizes FVIII), prolonged aPTT and bleeding time, with normal PT.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "von Willebrand disease"
  },
  {
    id: "mlt-batch-486",
    stem: "Which of the following is the most common cause of analytical errors in the clinical laboratory?",
    options: ["Instrument malfunction", "Incorrect specimen identification", "Reagent or calibration issues", "Transcription errors"],
    correctIndex: 2,
    rationale: "Analytical errors, though less common than pre-analytical errors, are most often caused by reagent deterioration, calibration drift, or QC failures. Regular maintenance, proper storage, and adherence to QC protocols minimize analytical errors.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "analytical errors"
  },
  {
    id: "mlt-batch-487",
    stem: "Rouleaux formation on a peripheral blood smear is most commonly associated with:",
    options: ["Dehydration", "Multiple myeloma or other conditions with elevated serum proteins", "Iron deficiency anemia", "Sickle cell disease"],
    correctIndex: 1,
    rationale: "Rouleaux formation (RBCs stacked like coins) occurs when elevated plasma proteins (especially fibrinogen and immunoglobulins) neutralize RBC surface charge. Classic in multiple myeloma, Waldenström macroglobulinemia, and chronic inflammatory states.",
    difficulty: 2,
    category: "Advanced Hematology",
    topic: "RBC arrangement abnormalities"
  },
  {
    id: "mlt-batch-488",
    stem: "A point-of-care testing (POCT) program should include all of the following EXCEPT:",
    options: ["Operator training and competency assessment", "Quality control and maintenance documentation", "Oversight by a CLIA-certified laboratory director", "Elimination of all pre-analytical requirements"],
    correctIndex: 3,
    rationale: "POCT must still maintain pre-analytical standards (specimen collection, patient identification). POCT programs require trained operators, QC documentation, instrument maintenance, and oversight by a laboratory director under CLIA regulations.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "point-of-care testing"
  },
  {
    id: "mlt-batch-489",
    stem: "In acute promyelocytic leukemia (APL), what is the most feared complication requiring immediate treatment?",
    options: ["Tumor lysis syndrome", "Disseminated intravascular coagulation (DIC)", "Superior vena cava syndrome", "Hyperleukocytosis"],
    correctIndex: 1,
    rationale: "APL (AML-M3) is strongly associated with DIC due to release of procoagulant granules from abnormal promyelocytes. DIC causes life-threatening bleeding and is the main cause of early death. ATRA therapy should be started immediately upon suspicion.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "APL complications"
  },
  {
    id: "mlt-batch-490",
    stem: "When performing a two-level QC procedure, what is the minimum number of QC runs required before reporting patient results for a new reagent lot?",
    options: ["One QC run at one level", "QC at two levels (normal and abnormal) that are within acceptable ranges", "No QC is needed if the reagent lot is from the same manufacturer", "QC is only required monthly"],
    correctIndex: 1,
    rationale: "Before reporting patient results with new reagent lots, QC at minimum two levels (normal and abnormal) must be run and be within acceptable limits. This verifies that the new lot performs comparably to the previous lot. Some labs perform parallel testing.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "reagent lot verification"
  },
  {
    id: "mlt-batch-491",
    stem: "JAK2 V617F mutation testing is most commonly ordered to evaluate suspected:",
    options: ["Acute lymphoblastic leukemia", "Myeloproliferative neoplasms such as polycythemia vera, essential thrombocythemia, or primary myelofibrosis", "Chronic lymphocytic leukemia", "Hodgkin lymphoma"],
    correctIndex: 1,
    rationale: "JAK2 V617F is a gain-of-function mutation present in >95% of polycythemia vera cases and ~50-60% of essential thrombocythemia and primary myelofibrosis. It is a key diagnostic criterion in the WHO classification of myeloproliferative neoplasms.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "molecular markers in MPN"
  },
  {
    id: "mlt-batch-492",
    stem: "What is the purpose of a corrective action plan in the laboratory quality management system?",
    options: ["To discipline employees", "To identify and correct the root cause of a problem and prevent its recurrence", "To update the laboratory budget", "To change the test menu"],
    correctIndex: 1,
    rationale: "A corrective action plan addresses identified problems by: documenting the nonconformance, performing root cause analysis, implementing corrective measures, verifying effectiveness, and preventing recurrence. It is part of the CAPA (Corrective and Preventive Action) process.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "corrective action"
  },
  {
    id: "mlt-batch-493",
    stem: "Which cytochemical stain is positive for monocytes and negative for granulocytes, helping distinguish AML-M4/M5 from other AML subtypes?",
    options: ["Myeloperoxidase (MPO)", "Nonspecific esterase (alpha-naphthyl butyrate esterase)", "Sudan Black B", "Periodic acid-Schiff (PAS)"],
    correctIndex: 1,
    rationale: "Nonspecific esterase (NSE/alpha-naphthyl butyrate or acetate esterase) is positive in monocytes and is inhibited by sodium fluoride (NaF). It helps identify AML-M4 (myelomonocytic) and AML-M5 (monocytic). MPO and SBB are positive in granulocytic lineage.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "cytochemistry"
  },
  {
    id: "mlt-batch-494",
    stem: "The laboratory receives notification of a manufacturer recall of a reagent currently in use. What is the appropriate response?",
    options: ["Continue using the reagent until it runs out", "Immediately stop using the affected reagent, quarantine remaining stock, review potentially affected patient results, and document actions", "Wait for the laboratory director to return from vacation", "Use the reagent only for QC purposes"],
    correctIndex: 1,
    rationale: "Upon recall notification: immediately discontinue use, quarantine remaining reagent, identify potentially affected patient results for re-testing, notify the laboratory director, document all actions, and implement the alternative method or reagent.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "reagent recalls"
  },
  {
    id: "mlt-batch-495",
    stem: "A lupus anticoagulant (LA) characteristically causes:",
    options: ["Shortened aPTT that corrects with mixing study", "Prolonged aPTT that does NOT correct with 1:1 mixing study, associated with thrombosis in vivo", "Normal aPTT with prolonged PT", "Normal coagulation studies"],
    correctIndex: 1,
    rationale: "Lupus anticoagulant prolongs phospholipid-dependent coagulation tests (aPTT, dRVVT) in vitro but paradoxically causes thrombosis in vivo. It does NOT correct with mixing because it is an antibody (inhibitor) against phospholipids, not a factor deficiency.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "antiphospholipid syndrome"
  },
  {
    id: "mlt-batch-496",
    stem: "What does the term 'analytical sensitivity' (limit of detection) mean in laboratory testing?",
    options: ["The ability to detect disease in patients", "The lowest concentration of analyte that can be reliably distinguished from zero", "The highest concentration the method can measure", "The precision of the method at normal concentrations"],
    correctIndex: 1,
    rationale: "Analytical sensitivity (limit of detection/LOD) is the lowest analyte concentration detectable above the noise (blank signal). It is determined by analyzing blank samples and calculating mean + 2-3 SD. It differs from clinical sensitivity (ability to detect disease).",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "limit of detection"
  },
  {
    id: "mlt-batch-497",
    stem: "t(8;14) involving the MYC gene is the hallmark translocation of which lymphoma?",
    options: ["Follicular lymphoma", "Mantle cell lymphoma", "Burkitt lymphoma", "MALT lymphoma"],
    correctIndex: 2,
    rationale: "t(8;14)(q24;q32) juxtaposes MYC oncogene (chromosome 8) with the immunoglobulin heavy chain locus (chromosome 14), driving cell proliferation. Burkitt lymphoma has the highest proliferation rate of any human tumor (Ki-67 ~100%). Starry sky pattern on biopsy.",
    difficulty: 3,
    category: "Advanced Hematology",
    topic: "lymphoma cytogenetics"
  },
  {
    id: "mlt-batch-498",
    stem: "Six Sigma methodology applied to laboratory quality targets a maximum defect rate of:",
    options: ["3.4 defects per million opportunities", "1 defect per hundred tests", "5% error rate", "10 defects per thousand tests"],
    correctIndex: 0,
    rationale: "Six Sigma targets 3.4 defects per million opportunities (DPMO), representing near-perfection. In laboratories, sigma metrics evaluate analytical performance: ≥6 sigma = world class, 5 sigma = excellent, 4 sigma = good, <3 sigma = poor requiring frequent QC.",
    difficulty: 3,
    category: "Quality Assurance/Lab Management",
    topic: "Six Sigma"
  },
  {
    id: "mlt-batch-499",
    stem: "Chronic myelomonocytic leukemia (CMML) is classified under which WHO category?",
    options: ["Myeloproliferative neoplasms", "Myelodysplastic/myeloproliferative neoplasms (MDS/MPN overlap)", "Acute myeloid leukemia", "Mature B-cell neoplasms"],
    correctIndex: 1,
    rationale: "CMML is classified as an MDS/MPN overlap disorder because it has features of both dysplasia and proliferation. It requires persistent monocytosis (>1 × 10⁹/L, ≥10% of WBC) for ≥3 months. Blasts <20% distinguish it from AML.",
    difficulty: 4,
    category: "Advanced Hematology",
    topic: "WHO classification"
  },
  {
    id: "mlt-batch-500",
    stem: "A laboratory is implementing a new quality indicator to monitor specimen rejection rates. Which of the following is the BEST formula for calculating the specimen rejection rate?",
    options: ["Number of rejected specimens ÷ total specimens received × 100%", "Number of rejected specimens ÷ number of tests performed × 100%", "Number of errors ÷ total specimens received × 100%", "Number of recollections ÷ total patients × 100%"],
    correctIndex: 0,
    rationale: "Specimen rejection rate = (number of rejected specimens ÷ total specimens received) × 100%. Common rejection reasons include hemolysis, clotting, insufficient quantity, mislabeling, and wrong tube type. This quality indicator helps identify pre-analytical issues and target improvements.",
    difficulty: 2,
    category: "Quality Assurance/Lab Management",
    topic: "quality indicators"
  }
];