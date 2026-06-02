export interface BloodBankPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  whyWrong: string[];
}

export interface ComparisonRow {
  feature: string;
  values: string[];
}

export interface BloodBankTopicData {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  overview: string;
  procedureSteps?: { step: string; detail: string }[];
  antigenAntibodyInfo?: { heading: string; content: string }[];
  rules?: { rule: string; explanation: string }[];
  reactionTypes?: { type: string; timing: string; signs: string; management: string }[];
  comparisonTable?: { headers: string[]; rows: ComparisonRow[] };
  examTraps: string[];
  practiceQuestions: BloodBankPracticeQuestion[];
  relatedTopicSlugs: string[];
  faqItems: { question: string; answer: string }[];
}

export const seoBloodBankTopics: BloodBankTopicData[] = [
  {
    slug: "abo-blood-groups",
    name: "ABO Blood Groups",
    seoTitle: "ABO Blood Groups Explained | Forward & Reverse Typing for MLT Exam",
    metaDescription: "Master ABO blood group system for the MLT certification exam. Learn forward and reverse typing, antigen-antibody relationships, and Bombay phenotype with practice questions.",
    keywords: "ABO blood groups explained, forward reverse typing MLT, ABO antigens antibodies, blood banking MLT exam, Bombay phenotype Oh",
    overview: "The ABO blood group system is the most clinically significant system in transfusion medicine. Discovered by Karl Landsteiner in 1901, it is defined by the presence or absence of A and B antigens on red blood cell surfaces, with corresponding naturally occurring antibodies (isoagglutinins) in plasma. ABO incompatibility causes the most severe acute hemolytic transfusion reactions and remains the leading cause of transfusion-related fatalities. Understanding forward and reverse typing, the Bombay phenotype, ABO subgroups, and discrepancy resolution is essential for MLT certification.",
    antigenAntibodyInfo: [
      { heading: "Forward Typing (Cell Typing)", content: "Forward typing detects antigens on the patient's red blood cells by mixing patient RBCs with known anti-A and anti-B reagents. Agglutination with anti-A indicates the A antigen is present; agglutination with anti-B indicates the B antigen is present. Both reacting means type AB; neither reacting means type O." },
      { heading: "Reverse Typing (Serum Typing)", content: "Reverse typing detects antibodies in the patient's serum/plasma by mixing patient serum with known A1 cells and B cells. The results must agree with forward typing. Type A patients should have anti-B in serum (agglutination with B cells only). If forward and reverse do not agree, an ABO discrepancy exists and must be resolved before issuing blood." },
      { heading: "Bombay Phenotype (Oh)", content: "The Bombay phenotype lacks the H antigen precursor needed to form A or B antigens. These individuals type as group O in forward typing but have anti-A, anti-B, AND anti-H in their serum. They can ONLY receive blood from other Bombay phenotype donors. Failure to identify Bombay phenotype can cause a fatal hemolytic reaction if group O blood is transfused." },
      { heading: "ABO Subgroups", content: "A subgroups (A1 vs A2) account for most ABO discrepancies. About 80% of group A individuals are A1, with stronger antigen expression. A2 individuals have weaker A antigen and may develop anti-A1 antibodies, causing forward/reverse discrepancies. Lectin Dolichos biflorus agglutinates A1 cells but not A2 cells." }
    ],
    comparisonTable: {
      headers: ["Blood Type", "RBC Antigens", "Serum Antibodies", "Forward (anti-A)", "Forward (anti-B)", "Reverse (A1 cells)", "Reverse (B cells)", "Frequency (US)"],
      rows: [
        { feature: "Type A", values: ["A", "Anti-B", "+", "0", "0", "+", "~40%"] },
        { feature: "Type B", values: ["B", "Anti-A", "0", "+", "+", "0", "~11%"] },
        { feature: "Type AB", values: ["A and B", "Neither", "+", "+", "0", "0", "~4%"] },
        { feature: "Type O", values: ["Neither (H antigen)", "Anti-A and Anti-B", "0", "0", "+", "+", "~45%"] },
        { feature: "Bombay (Oh)", values: ["No A, B, or H", "Anti-A, Anti-B, Anti-H", "0", "0", "+", "+", "Very rare"] }
      ]
    },
    examTraps: [
      "Bombay phenotype types as O in forward typing but has anti-H in addition to anti-A and anti-B — cannot receive group O blood",
      "A2 individuals may develop anti-A1 antibodies causing ABO discrepancies on reverse typing",
      "ABO antibodies are IgM (naturally occurring) and activate complement — causing intravascular hemolysis",
      "Universal RBC donor is type O negative; universal plasma donor is type AB",
      "Newborns do NOT have isoagglutinins until 3-6 months — reverse typing is unreliable in neonates",
      "Cold autoantibodies can cause false-positive forward typing — wash cells and test at 37°C"
    ],
    practiceQuestions: [
      {
        question: "A patient's forward typing shows agglutination with anti-A but not anti-B. Reverse typing shows agglutination with B cells but not A1 cells. What is the blood type?",
        options: ["Type A", "Type B", "Type AB", "Type O"],
        correctIndex: 0,
        rationale: "Forward typing shows A antigen present (reacts with anti-A), and reverse typing shows anti-B present (reacts with B cells). Forward and reverse agree: this is type A blood.",
        whyWrong: [
          "",
          "Type B would show agglutination with anti-B (forward) and agglutination with A1 cells (reverse).",
          "Type AB would show agglutination with both anti-A and anti-B (forward) and no agglutination in reverse.",
          "Type O would show no agglutination in forward typing and agglutination with both A1 and B cells in reverse."
        ]
      },
      {
        question: "A patient types as group O on forward typing. Reverse typing shows agglutination with A1 cells, B cells, AND group O screening cells. What is the most likely explanation?",
        options: ["Normal group O typing", "Bombay phenotype (Oh)", "Cold autoantibody interference", "ABO subgroup A2"],
        correctIndex: 1,
        rationale: "Bombay phenotype individuals lack the H antigen, so they type as group O on forward typing. However, they produce anti-H in addition to anti-A and anti-B, causing agglutination with O cells (which have H antigen). Normal group O patients would NOT react with O screening cells.",
        whyWrong: [
          "Normal group O should not agglutinate with group O screening cells — the anti-H reactivity is the key finding.",
          "",
          "Cold autoantibodies typically cause pan-agglutination at room temperature but can be resolved by warming; this pattern is more specific to Bombay.",
          "A2 subgroup would show weak reactions with anti-A in forward typing, not a completely negative forward type."
        ]
      },
      {
        question: "Which lectin is used to differentiate A1 from A2 subgroups?",
        options: ["Ulex europaeus", "Arachis hypogaea", "Dolichos biflorus", "Vicia graminea"],
        correctIndex: 2,
        rationale: "Dolichos biflorus lectin specifically agglutinates A1 red blood cells but does not react with A2 cells. This makes it the primary reagent for distinguishing A1 from A2 subgroups when ABO discrepancies are encountered.",
        whyWrong: [
          "Ulex europaeus detects the H antigen, not A subgroups.",
          "Arachis hypogaea (peanut lectin) detects the T antigen exposed in polyagglutination, not ABO subgroups.",
          "",
          "Vicia graminea does not have a standard role in routine ABO subgroup differentiation."
        ]
      },
      {
        question: "Why is reverse typing unreliable in neonates?",
        options: ["Neonates have too many antigens on their RBCs", "Neonatal red cells are resistant to agglutination", "Neonates do not produce their own ABO antibodies until 3-6 months of age", "The Rh system interferes with ABO reverse typing in neonates"],
        correctIndex: 2,
        rationale: "ABO isoagglutinins (anti-A, anti-B) are not produced by the neonate until approximately 3-6 months of age. Any antibodies detected in a neonate's serum are maternally derived IgG that crossed the placenta, which do not reliably reflect the infant's own ABO type.",
        whyWrong: [
          "The number of antigens on neonatal RBCs is actually reduced, not increased, and this affects forward typing sensitivity, not reverse typing.",
          "Neonatal cells are not inherently resistant to agglutination; the issue is the lack of naturally occurring antibodies.",
          "",
          "The Rh system does not interfere with ABO reverse typing."
        ]
      }
    ],
    relatedTopicSlugs: ["rh-factor", "crossmatching", "compatibility-chart"],
    rules: [
      { rule: "Landsteiner's Law", explanation: "If an antigen is absent from the RBC surface, the corresponding antibody will be present in the serum (and vice versa). This principle is the basis for ABO forward and reverse typing agreement." },
      { rule: "Forward and Reverse Must Agree", explanation: "Blood cannot be typed as a specific ABO group until forward and reverse typing results are concordant. Any discrepancy must be investigated and resolved." },
      { rule: "O is the Universal RBC Donor", explanation: "Type O red blood cells lack A and B antigens, so they will not be destroyed by anti-A or anti-B antibodies in the recipient. However, O plasma contains both anti-A and anti-B." },
      { rule: "AB is the Universal Plasma Donor", explanation: "Type AB plasma lacks anti-A and anti-B antibodies, making it safe for recipients of any ABO type. AB is also the universal platelet donor for the same reason." }
    ],
    faqItems: [
      { question: "What is the difference between forward and reverse typing?", answer: "Forward typing tests for antigens on the patient's red blood cells using known antibodies (anti-A, anti-B). Reverse typing tests for antibodies in the patient's serum using known cells (A1 cells, B cells). Both must agree before a blood type is confirmed." },
      { question: "What is the most common ABO blood type?", answer: "In the United States, type O is the most common (approximately 45%), followed by type A (40%), type B (11%), and type AB (4%). Distribution varies by ethnicity." },
      { question: "Why is ABO incompatibility the most dangerous transfusion error?", answer: "ABO antibodies are IgM class, which activate the complement cascade and cause rapid intravascular hemolysis. This can lead to DIC, renal failure, shock, and death within minutes of a mismatched transfusion." },
      { question: "Can a person's blood type change?", answer: "In rare circumstances, yes. Bone marrow transplant recipients may adopt the donor's ABO type. Some malignancies can weaken antigen expression, causing apparent type changes. Otherwise, ABO type is genetically determined and lifelong." }
    ]
  },
  {
    slug: "rh-factor",
    name: "Rh Factor & Rh Blood Group System",
    seoTitle: "Rh Factor Explained | D Antigen, Weak D & RhIG for MLT Exam",
    metaDescription: "Complete guide to the Rh blood group system for MLT certification. Learn D antigen testing, weak D, partial D, RhIG administration, and exam practice questions.",
    keywords: "Rh factor MLT exam, D antigen testing, weak D partial D, RhIG Rh immune globulin, Rh blood group system",
    overview: "The Rh blood group system is the second most clinically significant system after ABO. It contains over 50 antigens, but the D antigen is the most immunogenic non-ABO antigen. A person is classified as Rh-positive if the D antigen is present and Rh-negative if absent. Unlike ABO antibodies, Rh antibodies are immune-stimulated (IgG), develop after exposure through transfusion or pregnancy, cross the placenta, and cause hemolytic disease of the fetus and newborn (HDFN). Understanding weak D, partial D, and RhIG administration is critical for MLT certification.",
    antigenAntibodyInfo: [
      { heading: "D Antigen Testing", content: "Rh typing involves testing patient RBCs with anti-D reagent. Agglutination indicates D-positive (Rh-positive). If initially negative, a weak D test (indirect antiglobulin test with anti-D) may be performed to detect weaker expressions of the D antigen. Blood bank policy determines when weak D testing is required." },
      { heading: "Weak D (Du)", content: "Weak D individuals have reduced quantities of normal D antigen on their RBCs. They may type as D-negative on direct testing but D-positive on the indirect antiglobulin test (IAT). Weak D donors are labeled as Rh-positive (to protect D-negative recipients). Weak D patients may be treated as Rh-negative for transfusion purposes (to receive D-negative blood) depending on institutional policy." },
      { heading: "Partial D", content: "Partial D individuals are missing epitopes (portions) of the D antigen. They can make anti-D against the epitopes they lack if exposed to complete D antigen through transfusion or pregnancy. Partial D patients should receive Rh-negative blood and RhIG to prevent alloimmunization." },
      { heading: "Other Clinically Significant Rh Antigens", content: "Beyond D, the Rh system includes C, c, E, and e antigens. Anti-c and anti-E are the most common Rh antibodies encountered after anti-D. These antibodies are clinically significant, capable of causing HDFN and hemolytic transfusion reactions, and must be identified in antibody panels." }
    ],
    rules: [
      { rule: "Anti-D is Always Immune-Stimulated", explanation: "Unlike ABO antibodies, anti-D does not occur naturally. It develops only after exposure to D-positive RBCs through transfusion, pregnancy, or transplant. This is why RhIG is given to prevent sensitization." },
      { rule: "Rh Antibodies are IgG", explanation: "Rh antibodies are predominantly IgG class, which means they cross the placenta (causing HDFN), are reactive at 37°C, and are detected in the antiglobulin phase of testing." },
      { rule: "D-Negative Patients Must Receive D-Negative RBCs", explanation: "Exposure of a D-negative patient to D-positive RBCs can cause alloimmunization, leading to delayed hemolytic transfusion reactions on subsequent exposure or HDFN in future pregnancies." },
      { rule: "RhIG Prevents Alloimmunization", explanation: "Rh Immune Globulin (RhIG) is administered to D-negative mothers within 72 hours of potential exposure to D-positive fetal RBCs. It destroys fetal D-positive cells before the maternal immune system can mount a primary immune response." }
    ],
    examTraps: [
      "Weak D donors are labeled Rh-POSITIVE to protect D-negative recipients; weak D patients may receive D-negative blood",
      "Partial D patients CAN make anti-D — they should receive D-negative blood and RhIG",
      "Anti-D is NEVER naturally occurring — always immune-stimulated (IgG, reactive at 37°C, IAT phase)",
      "RhIG must be given within 72 hours of exposure — standard dose covers 30 mL of fetal whole blood (15 mL of fetal RBCs)",
      "The Kleihauer-Betke test quantifies fetal-maternal hemorrhage to calculate the number of RhIG vials needed",
      "Anti-c is the Rh antibody most commonly implicated in HDFN after anti-D"
    ],
    practiceQuestions: [
      {
        question: "A blood donor initially types as D-negative with anti-D reagent. The weak D test is positive. How should this unit be labeled?",
        options: ["Rh-negative", "Rh-positive", "Rh-indeterminate — requires further testing", "Label depends on the recipient's Rh status"],
        correctIndex: 1,
        rationale: "Weak D donors are labeled Rh-positive because their RBCs carry D antigen (albeit reduced amounts) and could immunize a D-negative recipient. The labeling policy for donors is always more conservative to protect recipients.",
        whyWrong: [
          "Labeling a weak D donor as Rh-negative would risk alloimmunizing a D-negative recipient who receives this blood.",
          "",
          "No indeterminate category exists — the weak D result confirms D antigen presence.",
          "Donor labeling is standardized regardless of the intended recipient."
        ]
      },
      {
        question: "Which test quantifies the volume of fetal-maternal hemorrhage to calculate the dose of RhIG?",
        options: ["Direct Antiglobulin Test (DAT)", "Indirect Antiglobulin Test (IAT)", "Kleihauer-Betke acid elution test", "Antibody identification panel"],
        correctIndex: 2,
        rationale: "The Kleihauer-Betke (KB) acid elution test detects fetal hemoglobin (HbF)-containing cells in the maternal circulation. Fetal cells resist acid elution and stain darkly, while maternal cells (containing HbA) appear as ghost cells. The percentage of fetal cells is used to calculate the volume of fetal-maternal hemorrhage and determine the number of RhIG doses needed.",
        whyWrong: [
          "The DAT detects antibody or complement already bound to RBCs in vivo — it does not quantify fetal-maternal hemorrhage.",
          "The IAT detects serum antibodies — it does not quantify hemorrhage volume.",
          "",
          "Antibody identification panels identify specific antibody specificities, not hemorrhage volume."
        ]
      },
      {
        question: "A partial D patient receives one unit of Rh-positive RBCs. What is the most significant risk?",
        options: ["Immediate ABO hemolytic reaction", "Development of anti-D antibody", "Febrile non-hemolytic reaction", "Transfusion-associated circulatory overload"],
        correctIndex: 1,
        rationale: "Partial D patients lack certain D antigen epitopes. Exposure to complete D antigen (from Rh-positive donor cells) can stimulate the patient to produce anti-D directed against the epitopes they lack. This anti-D can cause a delayed hemolytic transfusion reaction or HDFN in future pregnancies.",
        whyWrong: [
          "An ABO hemolytic reaction is related to ABO incompatibility, not Rh typing status.",
          "",
          "FNHTR is caused by cytokine accumulation or WBC antibodies, not Rh incompatibility.",
          "TACO is a volume-related complication, not an immunological consequence of Rh mismatch."
        ]
      }
    ],
    relatedTopicSlugs: ["abo-blood-groups", "hdfn", "antibody-screening", "crossmatching"],
    comparisonTable: {
      headers: ["Feature", "Weak D", "Partial D"],
      rows: [
        { feature: "D antigen expression", values: ["Reduced quantity, all epitopes present", "Normal quantity, missing some epitopes"] },
        { feature: "Can make anti-D?", values: ["No (has complete D antigen)", "Yes (against missing epitopes)"] },
        { feature: "Donor labeling", values: ["Rh-positive", "Rh-positive (if detected)"] },
        { feature: "Patient transfusion", values: ["May receive D-negative (policy varies)", "Should receive D-negative"] },
        { feature: "RhIG needed?", values: ["No", "Yes — treat as D-negative for RhIG decisions"] },
        { feature: "Detection method", values: ["IAT with anti-D", "Molecular (genotyping) or serological panels"] }
      ]
    },
    faqItems: [
      { question: "What does Rh-positive and Rh-negative mean?", answer: "Rh-positive means the D antigen is present on the surface of red blood cells. Rh-negative means the D antigen is absent. About 85% of people are Rh-positive and 15% are Rh-negative." },
      { question: "Why is RhIG given during pregnancy?", answer: "RhIG is given to Rh-negative mothers carrying an Rh-positive fetus to prevent maternal alloimmunization. Without RhIG, the mother could develop anti-D antibodies that cross the placenta and destroy fetal RBCs in current or future pregnancies, causing HDFN." },
      { question: "What is the difference between weak D and partial D?", answer: "Weak D has reduced quantity of normal D antigen (all epitopes present), so the patient cannot make anti-D. Partial D has normal quantity but is missing some D epitopes, so the patient CAN make anti-D if exposed to complete D antigen." }
    ]
  },
  {
    slug: "crossmatching",
    name: "Crossmatching Procedures",
    seoTitle: "Crossmatching Explained | Major & Minor Crossmatch for MLT Exam",
    metaDescription: "Learn crossmatching procedures for the MLT certification exam. Major crossmatch, electronic crossmatch, immediate spin, IS/37°C/AHG phases with practice questions.",
    keywords: "crossmatching blood banking MLT, major crossmatch procedure, electronic crossmatch, compatibility testing, AHG crossmatch phases",
    overview: "Crossmatching is the final pre-transfusion compatibility test that confirms serological compatibility between donor blood and patient serum before transfusion. The major crossmatch tests patient serum against donor RBCs to detect antibodies that could destroy transfused cells. Modern blood banking offers three crossmatch methods: the full serological crossmatch (immediate spin, 37°C incubation, and AHG phases), the abbreviated immediate-spin crossmatch, and the electronic (computer) crossmatch. The method selected depends on the patient's antibody screen results and institutional policy.",
    procedureSteps: [
      { step: "1. Patient Sample Collection", detail: "Collect a properly labeled patient sample (EDTA tube). The sample must be collected within 3 days if the patient has been transfused or pregnant in the past 3 months. Two independent ABO/Rh typings must be on file before electronic crossmatch." },
      { step: "2. ABO/Rh Typing", detail: "Perform forward and reverse typing on the patient sample. Confirm the ABO/Rh type of the donor unit by testing a segment from the attached tubing." },
      { step: "3. Antibody Screen", detail: "Test patient serum against 2-3 screening cells (group O cells with known antigen profiles) using the IAT method. A negative screen with no history of clinically significant antibodies allows abbreviated or electronic crossmatch." },
      { step: "4a. Full Crossmatch (if antibody screen positive)", detail: "Immediate spin (IS): detects ABO incompatibility. 37°C incubation: detects warm-reactive IgG antibodies. AHG (Coombs) phase: detects antibodies that sensitize RBCs but do not cause direct agglutination. A Coombs control must be used to validate a negative AHG phase." },
      { step: "4b. Electronic Crossmatch (if antibody screen negative)", detail: "Computer system verifies ABO/Rh compatibility between patient and donor. Requires two independent ABO/Rh typings on file, a current negative antibody screen, and a validated computer system. No serological testing is performed — the computer confirms compatibility." },
      { step: "5. Issue Blood", detail: "If compatible, label the unit with the patient's information and issue. Record the crossmatch results, expiration, and compatibility in the blood bank information system." }
    ],
    comparisonTable: {
      headers: ["Feature", "Full Serological Crossmatch", "Immediate Spin Only", "Electronic Crossmatch"],
      rows: [
        { feature: "Detects ABO incompatibility", values: ["Yes", "Yes", "Yes (computer verification)"] },
        { feature: "Detects IgG antibodies", values: ["Yes (37°C/AHG phases)", "No", "No"] },
        { feature: "When used", values: ["Positive antibody screen or history of antibodies", "Negative screen, no antibody history", "Negative screen, two prior ABO typings, validated system"] },
        { feature: "Time to complete", values: ["45-60 minutes", "5-10 minutes", "< 1 minute"] },
        { feature: "Requires Coombs control", values: ["Yes (for negative AHG)", "No", "No"] }
      ]
    },
    rules: [
      { rule: "The Major Crossmatch is MANDATORY", explanation: "The major crossmatch (patient serum vs donor RBCs) must always be performed or verified before transfusion. It detects patient antibodies that would destroy donor cells." },
      { rule: "Negative Antibody Screen Allows Abbreviated Crossmatch", explanation: "If the antibody screen is negative and the patient has no history of clinically significant antibodies, an immediate-spin or electronic crossmatch is acceptable." },
      { rule: "Sample Must Be <3 Days Old if Recently Transfused/Pregnant", explanation: "Patients transfused or pregnant within the past 3 months may develop new antibodies. A fresh sample ensures any newly formed antibodies are detected." },
      { rule: "Coombs Control Validates Negative AHG Results", explanation: "IgG-coated control cells must agglutinate when added to a negative AHG test to prove that anti-human globulin reagent was present and functional. If the Coombs control is negative, the test is invalid and must be repeated." }
    ],
    examTraps: [
      "A negative Coombs control INVALIDATES the crossmatch — the test must be repeated with fresh AHG reagent",
      "Electronic crossmatch requires TWO independent ABO/Rh typings on file — a single typing is insufficient",
      "The minor crossmatch (donor serum vs patient RBCs) is NO LONGER routinely performed",
      "A crossmatch only detects antibodies PRESENT at the time of testing — new antibodies can develop after transfusion",
      "Immediate spin crossmatch detects ABO incompatibility ONLY — it does not detect IgG antibodies",
      "Autocontrol (patient serum vs patient cells) positive = possible autoantibody, DAT-positive, or recently transfused"
    ],
    practiceQuestions: [
      {
        question: "A patient with a negative antibody screen has been transfused 2 weeks ago. Which crossmatch method is acceptable?",
        options: ["Electronic crossmatch", "Immediate spin only", "Full serological crossmatch (IS/37°C/AHG)", "No crossmatch needed — negative screen is sufficient"],
        correctIndex: 0,
        rationale: "A negative antibody screen with no history of clinically significant antibodies allows an electronic crossmatch, provided two prior ABO/Rh typings are on file and the computer system is validated. The recent transfusion requires a fresh sample (<3 days) but does not mandate a full serological crossmatch if the screen is negative.",
        whyWrong: [
          "",
          "Immediate spin is also acceptable, but electronic crossmatch is the most efficient option when all requirements are met.",
          "Full serological crossmatch is not required when the antibody screen is negative and there is no history of clinically significant antibodies.",
          "A crossmatch (electronic, IS, or full) is always required before transfusion — the antibody screen alone is not sufficient."
        ]
      },
      {
        question: "During a full serological crossmatch, the AHG phase is negative. IgG-coated control cells are added and NO agglutination is observed. What should be done?",
        options: ["Report the crossmatch as compatible", "Report the crossmatch as incompatible", "Repeat the AHG phase with fresh anti-human globulin reagent", "Proceed with immediate spin crossmatch instead"],
        correctIndex: 2,
        rationale: "The Coombs control (IgG-coated cells) must show agglutination to validate a negative AHG test. If the control cells do not agglutinate, it means the AHG reagent was neutralized, not added, or not functional. The test is INVALID and must be repeated with fresh AHG reagent.",
        whyWrong: [
          "Reporting as compatible with an invalid Coombs control could miss clinically significant antibodies.",
          "The crossmatch result is invalid, not incompatible — the distinction matters for documentation.",
          "",
          "Switching to an immediate spin crossmatch would miss IgG antibodies that the AHG phase is designed to detect."
        ]
      },
      {
        question: "What is the purpose of the immediate spin (IS) phase of the crossmatch?",
        options: ["Detect IgG antibodies to Rh antigens", "Detect ABO incompatibility", "Identify specific antibody specificity", "Detect complement activation"],
        correctIndex: 1,
        rationale: "The immediate spin phase detects ABO incompatibility by identifying IgM antibodies (anti-A, anti-B) that cause direct agglutination at room temperature. ABO antibodies are IgM and react strongly at the IS phase without requiring incubation or AHG reagent.",
        whyWrong: [
          "IgG antibodies to Rh antigens are detected at the 37°C incubation and AHG phases, not at immediate spin.",
          "",
          "Antibody identification requires a panel of cells with known antigen profiles, not a crossmatch.",
          "Complement activation may be detected in the AHG phase using polyspecific anti-human globulin, not at immediate spin."
        ]
      },
      {
        question: "Which of the following is NOT a requirement for electronic crossmatch?",
        options: ["Validated computer system", "Negative antibody screen", "Two independent ABO/Rh typings on file", "Positive autocontrol"],
        correctIndex: 3,
        rationale: "Electronic crossmatch requires: (1) a validated computer system, (2) a current negative antibody screen with no history of clinically significant antibodies, and (3) two independent ABO/Rh typings on file for the patient. A positive autocontrol is NOT a requirement — in fact, a positive autocontrol would suggest an autoantibody or other issue requiring investigation.",
        whyWrong: [
          "A validated computer system IS required for electronic crossmatch.",
          "A negative antibody screen IS required — a positive screen mandates full serological crossmatch.",
          "Two independent typings ARE required to confirm the patient's ABO/Rh type.",
          ""
        ]
      }
    ],
    relatedTopicSlugs: ["abo-blood-groups", "antibody-screening", "transfusion-reactions", "compatibility-chart"],
    faqItems: [
      { question: "What is the difference between a crossmatch and an antibody screen?", answer: "The antibody screen tests patient serum against standardized screening cells to detect unexpected antibodies. The crossmatch tests patient serum against the specific donor unit's cells to confirm compatibility for that particular transfusion." },
      { question: "How long is a crossmatch valid?", answer: "A crossmatch is valid for 3 days if the patient has been transfused or pregnant in the past 3 months. If there is no recent transfusion or pregnancy history, the sample may be valid for longer per institutional policy." },
      { question: "Can blood be issued without a crossmatch?", answer: "In life-threatening emergencies, uncrossmatched O-negative RBCs (or O-positive for males) may be issued. Type-specific uncrossmatched blood may be used once ABO/Rh is confirmed. A crossmatch should be completed retrospectively." }
    ]
  },
  {
    slug: "transfusion-reactions",
    name: "Transfusion Reactions",
    seoTitle: "Transfusion Reactions Explained | Types, Signs & Management for MLT",
    metaDescription: "Complete guide to transfusion reactions for MLT certification. Learn acute hemolytic, febrile, allergic, TRALI, TACO, and delayed reactions with practice questions.",
    keywords: "transfusion reactions MLT exam, acute hemolytic transfusion reaction, TRALI TACO difference, febrile non-hemolytic reaction, delayed hemolytic transfusion reaction",
    overview: "Transfusion reactions are adverse events occurring during or after blood product administration. They range from mild (urticaria) to fatal (acute hemolytic reaction). The blood bank technologist plays a critical role in the investigation workup, which includes visual inspection of post-transfusion plasma for hemolysis, DAT on the post-transfusion sample, repeat ABO/Rh typing, and antibody screen. Understanding the classification, timing, mechanism, and laboratory workup of each reaction type is essential for MLT certification.",
    reactionTypes: [
      { type: "Acute Hemolytic Transfusion Reaction (AHTR)", timing: "Within minutes to hours", signs: "Fever, chills, flank pain, hemoglobinuria (red/brown urine), hypotension, DIC, renal failure", management: "STOP transfusion immediately. Maintain IV access with saline. Send blood bank workup: DAT, repeat ABO/Rh, visual check for hemolysis, urine for hemoglobin. Notify blood bank and physician. Most commonly caused by ABO clerical error." },
      { type: "Febrile Non-Hemolytic Transfusion Reaction (FNHTR)", timing: "During or within 1-2 hours", signs: "Fever (≥1°C rise), chills, rigors — NO hemolysis", management: "Stop transfusion, rule out hemolytic reaction first. Administer antipyretics. Prevention: use leukoreduced products. Caused by recipient antibodies to donor WBC antigens or cytokines accumulated during storage." },
      { type: "Allergic (Urticarial) Reaction", timing: "During transfusion", signs: "Hives, itching, localized urticaria — NO fever, NO hemolysis", management: "Stop transfusion temporarily. Administer antihistamines (diphenhydramine). May resume transfusion after symptoms resolve if mild. Caused by recipient antibodies to donor plasma proteins." },
      { type: "Anaphylactic Reaction", timing: "After only a few mL of product", signs: "Hypotension, bronchospasm, angioedema, respiratory distress — NO fever", management: "STOP transfusion permanently. Administer epinephrine, maintain airway. Associated with IgA-deficient patients who have anti-IgA antibodies. Future products must be washed or from IgA-deficient donors." },
      { type: "TRALI (Transfusion-Related Acute Lung Injury)", timing: "Within 6 hours", signs: "Acute respiratory distress, bilateral pulmonary infiltrates on CXR, hypoxemia — NO evidence of circulatory overload", management: "Stop transfusion. Supportive respiratory care (oxygen, ventilation). NOT responsive to diuretics (distinguishes from TACO). Caused by donor antibodies to recipient HLA or neutrophil antigens." },
      { type: "TACO (Transfusion-Associated Circulatory Overload)", timing: "During or within 6 hours", signs: "Dyspnea, hypertension, elevated JVP, pulmonary edema, elevated BNP", management: "Slow or stop transfusion. Administer diuretics (furosemide). Sit patient upright. RESPONSIVE to diuretics (distinguishes from TRALI). Risk factors: elderly, cardiac disease, rapid infusion rate." },
      { type: "Delayed Hemolytic Transfusion Reaction (DHTR)", timing: "3-28 days after transfusion", signs: "Unexplained drop in hemoglobin, mild jaundice, positive DAT, newly identified antibody", management: "Investigate: DAT, antibody screen/panel, bilirubin. Usually extravascular hemolysis (IgG-mediated). Often caused by anamnestic response — antibody was too low to detect on pre-transfusion testing." },
      { type: "Transfusion-Associated GVHD (TA-GVHD)", timing: "4-30 days after transfusion", signs: "Fever, skin rash, liver dysfunction, diarrhea, pancytopenia — nearly 100% fatal", management: "No effective treatment once established. Prevention: IRRADIATE cellular blood products for at-risk recipients (immunocompromised, HLA-matched donors, directed donations from blood relatives)." }
    ],
    comparisonTable: {
      headers: ["Feature", "TRALI", "TACO"],
      rows: [
        { feature: "Blood pressure", values: ["Normal or LOW", "HIGH (hypertension)"] },
        { feature: "BNP level", values: ["Normal", "Elevated"] },
        { feature: "Response to diuretics", values: ["No improvement", "Improves with diuretics"] },
        { feature: "Mechanism", values: ["Immune-mediated (donor anti-HLA/anti-neutrophil antibodies)", "Volume overload"] },
        { feature: "CXR findings", values: ["Bilateral infiltrates (non-cardiogenic pulmonary edema)", "Pulmonary edema with cardiomegaly"] },
        { feature: "Fluid balance", values: ["Normal or negative", "Positive (fluid overloaded)"] },
        { feature: "Risk factors", values: ["Multiparous donors, prior transfusions", "Elderly, cardiac disease, rapid infusion"] }
      ]
    },
    examTraps: [
      "AHTR is most commonly caused by CLERICAL ERROR (wrong blood to wrong patient) — not a serological failure",
      "TRALI does NOT respond to diuretics; TACO DOES — this is the key differentiator on the exam",
      "Anaphylaxis after transfusion = suspect IgA deficiency with anti-IgA — future products must be washed",
      "TA-GVHD is prevented by IRRADIATION, not leukoreduction — irradiation inactivates donor lymphocytes",
      "FNHTR is a diagnosis of EXCLUSION — must rule out hemolytic reaction first",
      "Delayed hemolytic reactions show a positive DAT that was negative pre-transfusion — look for unexpected antibody on new screen"
    ],
    practiceQuestions: [
      {
        question: "A patient develops acute respiratory distress, hypotension, and bilateral pulmonary infiltrates 2 hours after receiving FFP. BNP is normal. What is the most likely reaction?",
        options: ["TACO", "TRALI", "Acute hemolytic reaction", "Anaphylaxis"],
        correctIndex: 1,
        rationale: "Bilateral pulmonary infiltrates with respiratory distress within 6 hours of transfusion, with normal BNP and hypotension, is classic for TRALI. TACO would present with hypertension and elevated BNP. TRALI is immune-mediated, often caused by donor anti-HLA antibodies, and does not respond to diuretics.",
        whyWrong: [
          "TACO presents with hypertension and elevated BNP, and responds to diuretics — this patient is hypotensive with normal BNP.",
          "",
          "Acute hemolytic reaction would present with hemoglobinuria, fever, and flank pain — not primarily respiratory.",
          "Anaphylaxis would present with bronchospasm and angioedema, typically after only a few mL of product."
        ]
      },
      {
        question: "A patient with a history of IgA deficiency develops severe hypotension and bronchospasm after receiving 10 mL of packed RBCs. What type of blood products should be used for future transfusions?",
        options: ["Leukoreduced products", "Irradiated products", "Washed RBCs or products from IgA-deficient donors", "CMV-negative products"],
        correctIndex: 2,
        rationale: "IgA-deficient patients with anti-IgA antibodies experience anaphylactic reactions to plasma-containing products. Washing RBCs removes residual plasma (and IgA). Alternatively, blood from IgA-deficient donors may be used. Leukoreduction removes WBCs but not plasma proteins like IgA.",
        whyWrong: [
          "Leukoreduction removes white blood cells but does not remove IgA from the plasma — it prevents FNHTR, not anaphylaxis.",
          "Irradiation prevents TA-GVHD by inactivating donor lymphocytes — it does not address IgA in plasma.",
          "",
          "CMV-negative products reduce CMV transmission risk — unrelated to IgA deficiency."
        ]
      },
      {
        question: "Ten days after a transfusion, a patient's hemoglobin has dropped unexpectedly. The DAT is now positive and a new anti-Jka is identified. What type of reaction has occurred?",
        options: ["Acute hemolytic transfusion reaction", "Febrile non-hemolytic reaction", "Delayed hemolytic transfusion reaction", "Transfusion-associated GVHD"],
        correctIndex: 2,
        rationale: "A delayed hemolytic transfusion reaction (DHTR) occurs 3-28 days post-transfusion when an anamnestic (memory) immune response produces antibodies against donor RBC antigens. The newly positive DAT and identification of anti-Jka (Kidd system antibody known for causing DHTR due to rapid antibody titer decline) confirms DHTR.",
        whyWrong: [
          "AHTR occurs within minutes to hours of transfusion, not days later.",
          "FNHTR causes fever during or shortly after transfusion and does not cause hemolysis or a positive DAT.",
          "",
          "TA-GVHD presents with skin rash, liver dysfunction, and pancytopenia — not isolated hemolysis with a positive DAT."
        ]
      },
      {
        question: "Which transfusion reaction is prevented by irradiation of blood products?",
        options: ["TRALI", "TACO", "Transfusion-associated GVHD (TA-GVHD)", "Febrile non-hemolytic reaction"],
        correctIndex: 2,
        rationale: "TA-GVHD occurs when viable donor T-lymphocytes engraft in the recipient and attack host tissues. Gamma irradiation (or X-ray irradiation) inactivates donor lymphocytes, preventing engraftment. TA-GVHD has a mortality rate approaching 100%, making prevention critical.",
        whyWrong: [
          "TRALI is caused by donor antibodies in plasma — irradiation does not remove antibodies.",
          "TACO is a volume overload issue — irradiation has no effect on transfusion volume.",
          "",
          "FNHTR is prevented by leukoreduction, not irradiation."
        ]
      }
    ],
    relatedTopicSlugs: ["crossmatching", "abo-blood-groups", "hdfn", "massive-transfusion"],
    faqItems: [
      { question: "What is the most common cause of fatal transfusion reactions?", answer: "ABO-incompatible acute hemolytic transfusion reactions remain the most common cause of transfusion-related fatalities. The root cause is almost always clerical error — the wrong blood is given to the wrong patient due to identification mistakes." },
      { question: "What is the difference between TRALI and TACO?", answer: "TRALI is immune-mediated lung injury causing respiratory distress with normal/low blood pressure and normal BNP. TACO is volume overload causing respiratory distress with high blood pressure and elevated BNP. TACO responds to diuretics; TRALI does not." },
      { question: "What is the blood bank workup for a suspected transfusion reaction?", answer: "The workup includes: visual inspection of post-transfusion plasma for hemolysis (pink/red = free hemoglobin), DAT on the post-transfusion sample, repeat ABO/Rh on patient and donor, antibody screen, and comparison with pre-transfusion results." }
    ]
  },
  {
    slug: "compatibility-chart",
    name: "Blood Compatibility Chart & Transfusion Rules",
    seoTitle: "Blood Compatibility Chart | Who Can Donate & Receive for MLT Exam",
    metaDescription: "Complete blood compatibility chart for MLT exam prep. Learn RBC and plasma compatibility rules, emergency transfusion protocols, and component selection with practice questions.",
    keywords: "blood compatibility chart MLT, who can donate receive blood, universal donor recipient, RBC plasma compatibility, emergency transfusion protocol",
    overview: "Understanding blood component compatibility is fundamental to safe transfusion practice. Compatibility rules differ for RBC transfusions (match by antigens on donor cells) versus plasma/platelet transfusions (match by antibodies in donor plasma). In emergency situations when ABO/Rh type is unknown, specific protocols dictate which components to use. MLT certification exams frequently test the application of compatibility rules in clinical scenarios.",
    comparisonTable: {
      headers: ["Patient Blood Type", "Compatible RBCs", "Compatible Plasma/FFP", "Compatible Platelets"],
      rows: [
        { feature: "O-negative", values: ["O-negative only", "O, A, B, AB", "O preferred (any ABO acceptable)"] },
        { feature: "O-positive", values: ["O-positive, O-negative", "O, A, B, AB", "O preferred"] },
        { feature: "A-negative", values: ["A-negative, O-negative", "A, AB", "A or AB preferred"] },
        { feature: "A-positive", values: ["A-positive, A-negative, O-positive, O-negative", "A, AB", "A or AB preferred"] },
        { feature: "B-negative", values: ["B-negative, O-negative", "B, AB", "B or AB preferred"] },
        { feature: "B-positive", values: ["B-positive, B-negative, O-positive, O-negative", "B, AB", "B or AB preferred"] },
        { feature: "AB-negative", values: ["AB-negative, A-negative, B-negative, O-negative", "AB only", "AB preferred"] },
        { feature: "AB-positive", values: ["Any ABO/Rh (universal recipient)", "AB only", "AB preferred"] }
      ]
    },
    rules: [
      { rule: "RBC Compatibility = Match Antigens", explanation: "For RBC transfusion, you must avoid giving antigens the patient lacks (i.e., antigens the patient has antibodies against). Type O has no A or B antigens, making it universally compatible for RBCs." },
      { rule: "Plasma Compatibility = Match Antibodies (REVERSE of RBC rules)", explanation: "For plasma transfusion, you must avoid giving antibodies that target the patient's antigens. Type AB plasma has no anti-A or anti-B, making it the universal plasma donor." },
      { rule: "Emergency Uncrossmatched RBCs", explanation: "When ABO/Rh is unknown: give O-negative RBCs (universal). If O-negative supply is limited, O-positive may be used for males and post-menopausal females. Switch to type-specific blood as soon as ABO/Rh is confirmed." },
      { rule: "Emergency Plasma", explanation: "When patient ABO is unknown: give AB plasma (universal). AB plasma contains no anti-A or anti-B and is safe for any recipient." },
      { rule: "Rh-Negative Preferred for D-Negative Patients", explanation: "Always try to give Rh-negative RBCs to Rh-negative patients to prevent alloimmunization. In critical shortage, Rh-positive may be given to Rh-negative males or post-menopausal females with informed consent." }
    ],
    examTraps: [
      "RBC compatibility rules are the OPPOSITE of plasma compatibility rules — do not confuse them",
      "AB-positive is the universal RECIPIENT for RBCs; AB is the universal DONOR for plasma",
      "O-negative is the universal DONOR for RBCs; O is the universal RECIPIENT for plasma",
      "In emergency, O-positive RBCs may be given to Rh-negative MALES — not females of childbearing potential (risk of anti-D and HDFN)",
      "Platelets follow plasma compatibility rules because they are suspended in plasma — but ABO-incompatible platelets are acceptable with reduced efficacy",
      "Once a patient has received more than 2 units of O-negative emergency blood, switching to their actual ABO type requires careful evaluation (passive anti-A/anti-B from O plasma)"
    ],
    practiceQuestions: [
      {
        question: "A trauma patient with unknown blood type needs immediate transfusion. Which RBC product should be issued?",
        options: ["A-positive packed RBCs", "AB-negative packed RBCs", "O-negative packed RBCs", "B-positive packed RBCs"],
        correctIndex: 2,
        rationale: "O-negative RBCs are the universal emergency blood product because they lack A, B, and D antigens. They will not be destroyed by any ABO or Rh antibodies the patient may have, regardless of the patient's unknown blood type.",
        whyWrong: [
          "A-positive RBCs would cause hemolysis if the patient has anti-A (type B or O) or anti-D (Rh-negative).",
          "AB-negative RBCs carry both A and B antigens and would cause hemolysis in type O or type B patients with anti-A.",
          "",
          "B-positive RBCs would cause hemolysis if the patient has anti-B (type A or O)."
        ]
      },
      {
        question: "A type B-positive patient needs a plasma transfusion. Which plasma type is compatible?",
        options: ["Type O plasma", "Type A plasma", "Type B plasma", "All of the above"],
        correctIndex: 2,
        rationale: "Type B patients have B antigens on their cells. Compatible plasma must NOT contain anti-B antibodies. Type B plasma (contains anti-A only) and type AB plasma (contains neither) are compatible. Type O and Type A plasma contain anti-B and would attack the patient's B-antigen-positive cells.",
        whyWrong: [
          "Type O plasma contains both anti-A and anti-B — the anti-B would react with the patient's B antigens.",
          "Type A plasma contains anti-B — the anti-B would react with the patient's B antigens.",
          "",
          "Not all plasma types are compatible — O and A plasma contain anti-B."
        ]
      },
      {
        question: "Why is AB plasma considered the universal donor plasma?",
        options: ["AB plasma contains all antigens", "AB plasma contains no anti-A or anti-B antibodies", "AB plasma has the longest shelf life", "AB plasma has the highest clotting factor concentration"],
        correctIndex: 1,
        rationale: "AB plasma is the universal donor plasma because it lacks both anti-A and anti-B antibodies. Since it contains no ABO antibodies, it will not attack the recipient's red blood cells regardless of their ABO type.",
        whyWrong: [
          "Antigens are on RBCs, not in plasma — the absence of antibodies is what makes AB plasma universally compatible.",
          "",
          "Shelf life is not related to ABO compatibility.",
          "Clotting factor concentration is similar across ABO types and unrelated to compatibility."
        ]
      }
    ],
    relatedTopicSlugs: ["abo-blood-groups", "rh-factor", "crossmatching", "massive-transfusion"],
    faqItems: [
      { question: "Who is the universal blood donor?", answer: "Type O-negative is the universal RBC donor because O-negative red blood cells lack A, B, and D antigens. Type AB is the universal plasma donor because AB plasma lacks anti-A and anti-B antibodies." },
      { question: "Can Rh-positive blood be given to an Rh-negative patient?", answer: "In life-threatening emergencies when Rh-negative blood is unavailable, Rh-positive blood may be given to Rh-negative males or post-menopausal females. It should be avoided in females of childbearing potential due to the risk of anti-D formation and subsequent HDFN." },
      { question: "Why are RBC and plasma compatibility rules opposite?", answer: "RBC compatibility focuses on antigens on the donor cells (avoid antigens the recipient has antibodies against). Plasma compatibility focuses on antibodies in the donor plasma (avoid antibodies that target the recipient's antigens). Since antigens and antibodies are inversely related in ABO, the rules are reversed." }
    ]
  },
  {
    slug: "hdfn",
    name: "Hemolytic Disease of the Fetus & Newborn (HDFN)",
    seoTitle: "HDFN Explained | Hemolytic Disease of the Newborn for MLT Exam",
    metaDescription: "Complete guide to hemolytic disease of the fetus and newborn (HDFN) for MLT certification. Learn Rh HDFN, ABO HDFN, DAT, Kleihauer-Betke, RhIG dosing with practice questions.",
    keywords: "HDFN MLT exam, hemolytic disease newborn, Rh HDFN, ABO HDFN, Kleihauer-Betke test, RhIG dose calculation",
    overview: "Hemolytic disease of the fetus and newborn (HDFN) occurs when maternal IgG antibodies cross the placenta and destroy fetal red blood cells. The most severe form is caused by anti-D (Rh HDFN), while the most common form is ABO HDFN (usually mild). HDFN can cause fetal anemia, hyperbilirubinemia, kernicterus, hydrops fetalis, and fetal death. The blood bank plays a critical role in prenatal antibody screening, RhIG administration, and neonatal workup including the direct antiglobulin test (DAT).",
    antigenAntibodyInfo: [
      { heading: "Rh HDFN (Anti-D)", content: "Occurs when an Rh-negative mother is sensitized to D antigen from a previous pregnancy or transfusion. Anti-D (IgG) crosses the placenta and attacks D-positive fetal RBCs. Severity increases with each subsequent D-positive pregnancy as the anamnestic response produces higher antibody titers. Prevention: RhIG at 28 weeks gestation and within 72 hours postpartum." },
      { heading: "ABO HDFN", content: "Most commonly occurs in type O mothers with type A or B infants. Anti-A and anti-B in type O individuals include an IgG component that crosses the placenta. ABO HDFN is usually MILD because A and B antigens are not fully developed on fetal RBCs and are widely expressed on tissue cells (neutralizing some antibody). The DAT in ABO HDFN may be weakly positive or negative." },
      { heading: "Other Antibody HDFN", content: "Other IgG antibodies capable of causing HDFN include anti-c, anti-K (Kell), anti-E, anti-Fya (Duffy), and anti-Jka (Kidd). Anti-K is unique because it suppresses erythropoiesis in addition to causing hemolysis, so the reticulocyte count may be low despite anemia." },
      { heading: "Neonatal Workup", content: "When HDFN is suspected: perform ABO/Rh typing on the infant, DAT on cord blood or infant sample, antibody elution from DAT-positive infant cells, and maternal antibody screen/identification. A positive DAT with an identifiable eluate antibody matching the maternal antibody confirms HDFN." }
    ],
    comparisonTable: {
      headers: ["Feature", "Rh HDFN (Anti-D)", "ABO HDFN"],
      rows: [
        { feature: "Maternal type", values: ["Rh-negative", "Usually type O"] },
        { feature: "Infant type", values: ["Rh-positive", "Type A or B"] },
        { feature: "Severity", values: ["Moderate to severe (hydrops, death)", "Usually mild"] },
        { feature: "First pregnancy affected?", values: ["Rarely (requires prior sensitization)", "Yes — can affect first pregnancy"] },
        { feature: "DAT on infant", values: ["Strongly positive", "Weakly positive or negative"] },
        { feature: "Prevention", values: ["RhIG at 28 weeks and postpartum", "No prevention available"] },
        { feature: "Antibody class causing disease", values: ["IgG anti-D", "IgG component of anti-A or anti-B"] }
      ]
    },
    procedureSteps: [
      { step: "1. Prenatal Antibody Screen", detail: "All pregnant women should be screened for unexpected antibodies at the first prenatal visit and again at 28 weeks. If clinically significant antibodies are detected, titers are monitored throughout pregnancy." },
      { step: "2. Antibody Titer Monitoring", detail: "If anti-D or other clinically significant antibody is detected, titers are performed monthly. A critical titer (typically ≥16 or ≥32, depending on the laboratory) triggers referral for fetal monitoring with middle cerebral artery Doppler ultrasound." },
      { step: "3. RhIG Administration (for D-negative mothers)", detail: "Administer one dose of RhIG (300 µg) at 28 weeks gestation (antepartum) and one dose within 72 hours of delivery if the infant is D-positive. Additional doses are given after amniocentesis, miscarriage, ectopic pregnancy, or abdominal trauma." },
      { step: "4. Kleihauer-Betke Test (Postpartum)", detail: "Perform KB test to quantify fetal-maternal hemorrhage. Each 300 µg dose of RhIG covers 30 mL of fetal whole blood (15 mL of packed fetal RBCs). If hemorrhage exceeds 30 mL, additional vials are required." },
      { step: "5. Neonatal DAT and Workup", detail: "If the infant shows jaundice, anemia, or other signs of HDFN: perform DAT on infant cells. If positive, perform elution to identify the antibody coating the cells. Compare with maternal antibody results." }
    ],
    examTraps: [
      "ABO HDFN can occur in the FIRST pregnancy (unlike Rh HDFN which requires prior sensitization)",
      "The DAT in ABO HDFN is often WEAKLY positive or even NEGATIVE — this does not rule out ABO HDFN",
      "Anti-K (Kell) suppresses erythropoiesis — fetal anemia occurs with LOW reticulocyte count (unlike other HDFN antibodies)",
      "One vial of RhIG (300 µg) covers 30 mL of fetal WHOLE blood or 15 mL of fetal PACKED RBCs",
      "RhIG is INEFFECTIVE if the mother is already sensitized (has a positive antibody screen for anti-D)",
      "The Rosette test is a qualitative screening test for fetal-maternal hemorrhage — if positive, perform Kleihauer-Betke for quantification"
    ],
    practiceQuestions: [
      {
        question: "A type O mother delivers a type A-positive infant. The infant's DAT is weakly positive, and the eluate shows anti-A. What is the diagnosis?",
        options: ["Rh HDFN", "ABO HDFN", "Autoimmune hemolytic anemia", "Drug-induced hemolytic anemia"],
        correctIndex: 1,
        rationale: "A type O mother's IgG anti-A crosses the placenta and coats the type A infant's RBCs. The weakly positive DAT and anti-A in the eluate confirm ABO HDFN. This is the most common form of HDFN and is typically mild.",
        whyWrong: [
          "Rh HDFN would involve anti-D, not anti-A. The eluate identifies the antibody as anti-A.",
          "",
          "AIHA in neonates is extremely rare, and the antibody would not correlate with maternal ABO type.",
          "The infant has not received medications to cause drug-induced hemolytic anemia."
        ]
      },
      {
        question: "The Kleihauer-Betke test reveals a fetal-maternal hemorrhage of 45 mL of fetal whole blood. How many vials of RhIG (300 µg each) are needed?",
        options: ["1 vial", "2 vials", "3 vials", "4 vials"],
        correctIndex: 1,
        rationale: "Each 300 µg vial of RhIG covers 30 mL of fetal whole blood. For 45 mL of hemorrhage: 45 ÷ 30 = 1.5 vials. The rule is to round UP to the nearest whole number, then add 1 extra vial for safety: round 1.5 up to 2 vials. (Note: Some protocols say round up and add 1, which would be 3. Follow your exam's formula.)",
        whyWrong: [
          "1 vial covers only 30 mL — the hemorrhage is 45 mL, exceeding a single vial.",
          "",
          "The calculation depends on the specific formula used by the exam. The key concept is that 1 vial = 30 mL whole blood coverage.",
          "4 vials would be excessive for 45 mL of hemorrhage."
        ]
      },
      {
        question: "Which antibody causes HDFN with fetal anemia but a LOW reticulocyte count?",
        options: ["Anti-D", "Anti-c", "Anti-K (Kell)", "Anti-Jka (Kidd)"],
        correctIndex: 2,
        rationale: "Anti-K (Kell) is unique among HDFN-causing antibodies because it not only destroys fetal RBCs but also suppresses erythropoiesis by targeting Kell antigen-positive erythroid precursors in the fetal bone marrow. This results in anemia with an inappropriately low reticulocyte count.",
        whyWrong: [
          "Anti-D causes hemolysis with a compensatory reticulocytosis (elevated reticulocyte count).",
          "Anti-c causes hemolysis with reticulocytosis, similar to anti-D.",
          "",
          "Anti-Jka causes hemolysis with reticulocytosis — it does not suppress erythropoiesis."
        ]
      }
    ],
    relatedTopicSlugs: ["rh-factor", "abo-blood-groups", "antibody-screening", "transfusion-reactions"],
    faqItems: [
      { question: "What is HDFN?", answer: "Hemolytic disease of the fetus and newborn (HDFN) occurs when maternal IgG antibodies cross the placenta and destroy fetal red blood cells. It can cause anemia, jaundice, kernicterus, hydrops fetalis, and fetal death." },
      { question: "Can HDFN occur in the first pregnancy?", answer: "ABO HDFN can occur in the first pregnancy because type O individuals have naturally occurring IgG anti-A/anti-B. Rh HDFN rarely affects the first pregnancy because sensitization to D antigen typically occurs during the first delivery." },
      { question: "How is HDFN prevented?", answer: "Rh HDFN is prevented by administering RhIG to Rh-negative mothers at 28 weeks and within 72 hours postpartum. There is no prevention for ABO HDFN. Prenatal antibody screening identifies at-risk pregnancies for all types of HDFN." }
    ]
  },
  {
    slug: "massive-transfusion",
    name: "Massive Transfusion Protocol",
    seoTitle: "Massive Transfusion Protocol Explained | Ratios & Complications for MLT",
    metaDescription: "Learn massive transfusion protocol for the MLT exam. Understand 1:1:1 ratio, complications (hypothermia, hyperkalemia, citrate toxicity), and emergency blood issue procedures.",
    keywords: "massive transfusion protocol MLT, 1:1:1 ratio transfusion, transfusion complications, citrate toxicity hypocalcemia, emergency blood issue protocol",
    overview: "Massive transfusion is defined as the replacement of one entire blood volume within 24 hours, or the transfusion of more than 10 units of RBCs in 24 hours. Modern massive transfusion protocols (MTPs) use balanced component ratios (1:1:1 ratio of RBCs:FFP:platelets) to prevent dilutional coagulopathy. The blood bank must rapidly issue uncrossmatched products, manage inventory, and communicate with the clinical team. Understanding MTP complications — hypothermia, hyperkalemia, citrate toxicity (hypocalcemia), and dilutional coagulopathy — is essential for MLT certification.",
    procedureSteps: [
      { step: "1. MTP Activation", detail: "Clinical team activates the massive transfusion protocol (often via a single phone call to the blood bank). This triggers immediate release of a predefined 'cooler' of blood products, typically 6 units RBCs, 6 units FFP (or 4 units plasma), and 1 apheresis platelet." },
      { step: "2. Emergency Blood Issue", detail: "If the patient's ABO/Rh is unknown, issue O-negative RBCs (O-positive for males if O-neg is scarce) and AB plasma. Switch to type-specific products as soon as ABO/Rh is confirmed." },
      { step: "3. Ongoing Product Supply", detail: "Continue issuing 'coolers' at defined intervals until MTP is deactivated. Maintain 1:1:1 ratio of RBCs:FFP:platelets. Monitor inventory and contact the blood supplier if stock runs low." },
      { step: "4. Laboratory Monitoring", detail: "Send labs every 30-60 minutes: CBC, PT/INR, PTT, fibrinogen, ionized calcium, potassium, blood gas. Guide product selection based on results (cryoprecipitate for fibrinogen <100 mg/dL)." },
      { step: "5. MTP Deactivation", detail: "Clinical team deactivates MTP when bleeding is controlled. Return unused products to blood bank. Complete crossmatches on any uncrossmatched units retrospectively." }
    ],
    comparisonTable: {
      headers: ["Complication", "Cause", "Lab Finding", "Treatment"],
      rows: [
        { feature: "Hypothermia", values: ["Rapid infusion of cold stored products", "Core temp <35°C", "Use blood warmer for all products; warm IV fluids"] },
        { feature: "Hyperkalemia", values: ["Potassium leaks from stored RBCs during storage", "Elevated K+, ECG changes", "Cardiac monitoring; calcium gluconate; use fresher units if available"] },
        { feature: "Citrate toxicity / Hypocalcemia", values: ["Citrate anticoagulant in products binds ionized calcium", "Low ionized Ca2+, prolonged QT", "IV calcium gluconate or calcium chloride replacement"] },
        { feature: "Dilutional coagulopathy", values: ["Replacement with RBCs only (no plasma/platelets)", "Elevated PT/INR, low fibrinogen, low platelets", "Balanced 1:1:1 ratio; cryoprecipitate for fibrinogen <100"] },
        { feature: "Metabolic alkalosis", values: ["Citrate metabolized to bicarbonate by the liver", "Elevated pH and HCO3", "Usually self-corrects; monitor acid-base status"] }
      ]
    },
    examTraps: [
      "Citrate toxicity causes HYPOcalcemia (not hypercalcemia) — citrate chelates ionized calcium",
      "Hyperkalemia in massive transfusion is from STORED RBCs — potassium leaks out of cells during storage (storage lesion)",
      "The 1:1:1 ratio (RBCs:FFP:platelets) prevents dilutional coagulopathy — giving only RBCs worsens bleeding",
      "Cryoprecipitate is indicated when fibrinogen falls below 100 mg/dL — it provides concentrated fibrinogen, Factor VIII, Factor XIII, and von Willebrand factor",
      "Hypothermia worsens coagulopathy — use a blood warmer for all rapidly infused products",
      "Type O-NEGATIVE RBCs and type AB plasma are the emergency defaults when ABO/Rh is unknown"
    ],
    practiceQuestions: [
      {
        question: "During a massive transfusion, the patient's ionized calcium drops to 0.8 mmol/L (normal 1.1-1.3). What is the most likely cause?",
        options: ["Dilutional effect from crystalloid infusion", "Citrate toxicity from blood products", "Hyperkalemia-induced calcium shift", "Vitamin D deficiency"],
        correctIndex: 1,
        rationale: "Blood products are anticoagulated with citrate, which binds ionized calcium. During massive transfusion, the liver cannot metabolize citrate fast enough, leading to accumulation and clinically significant hypocalcemia. Symptoms include perioral tingling, muscle tremors, and prolonged QT interval.",
        whyWrong: [
          "Crystalloid dilution could contribute to mild hypocalcemia but would not cause this degree of ionized calcium drop during massive transfusion.",
          "",
          "Hyperkalemia does not directly lower ionized calcium levels.",
          "Vitamin D deficiency causes chronic hypocalcemia, not acute drops during transfusion."
        ]
      },
      {
        question: "A massive transfusion protocol is activated. The patient's ABO type is unknown. Which combination of emergency products should be issued?",
        options: ["A-positive RBCs and A plasma", "O-negative RBCs and AB plasma", "AB-positive RBCs and O plasma", "B-negative RBCs and B plasma"],
        correctIndex: 1,
        rationale: "When ABO type is unknown: O-negative RBCs (universal RBC donor, no ABO or Rh antigens) and AB plasma (universal plasma donor, no anti-A or anti-B antibodies) are the safest combination. This ensures compatibility regardless of the patient's actual blood type.",
        whyWrong: [
          "A-positive products could cause hemolysis in type B or O patients (from anti-A) and sensitize Rh-negative patients.",
          "",
          "AB RBCs carry both A and B antigens — they would cause hemolysis in type O patients. O plasma contains anti-A and anti-B.",
          "B-negative RBCs carry B antigen — they would cause hemolysis in type A or O patients."
        ]
      },
      {
        question: "A patient has received 12 units of packed RBCs and their fibrinogen is 75 mg/dL. What product should be given?",
        options: ["Fresh frozen plasma", "Additional packed RBCs", "Cryoprecipitate", "Albumin"],
        correctIndex: 2,
        rationale: "Cryoprecipitate is the product of choice when fibrinogen falls below 100 mg/dL. Each unit of cryoprecipitate contains approximately 150-250 mg of concentrated fibrinogen, along with Factor VIII, Factor XIII, von Willebrand factor, and fibronectin. A typical dose is 10 units (1 pool) for adults.",
        whyWrong: [
          "FFP contains fibrinogen but in lower concentrations — large volumes would be needed, risking TACO. Cryoprecipitate is more concentrated.",
          "Additional RBCs would worsen dilutional coagulopathy without replacing fibrinogen.",
          "",
          "Albumin is a volume expander with no clotting factor content."
        ]
      }
    ],
    relatedTopicSlugs: ["transfusion-reactions", "compatibility-chart", "crossmatching"],
    faqItems: [
      { question: "What is the definition of massive transfusion?", answer: "Massive transfusion is defined as the replacement of one entire blood volume (approximately 10 units of RBCs in an adult) within 24 hours, or the transfusion of more than 4 units of RBCs within 1 hour with anticipated ongoing need." },
      { question: "What is the 1:1:1 ratio in massive transfusion?", answer: "The 1:1:1 ratio refers to transfusing 1 unit of RBCs : 1 unit of FFP : 1 dose of platelets. This balanced approach prevents dilutional coagulopathy that occurs when only RBCs are given, as it replaces clotting factors and platelets along with oxygen-carrying capacity." },
      { question: "Why does massive transfusion cause hypocalcemia?", answer: "Blood products are anticoagulated with citrate, which chelates (binds) ionized calcium. During rapid massive transfusion, the liver cannot metabolize citrate fast enough, causing citrate accumulation and clinically significant hypocalcemia." }
    ]
  },
  {
    slug: "antibody-screening",
    name: "Antibody Screening & Identification",
    seoTitle: "Antibody Screening & Identification Panels | MLT Exam Guide",
    metaDescription: "Master antibody screening and identification for the MLT exam. Learn panel rule-out technique, clinically significant antibodies, enzyme treatment, and practice questions.",
    keywords: "antibody screening MLT exam, antibody identification panel, rule-out technique blood bank, clinically significant antibodies, enzyme-treated panel cells",
    overview: "Antibody screening and identification are core competencies for MLT blood bank testing. The antibody screen detects unexpected (non-ABO) antibodies in patient serum using 2-3 group O screening cells with known antigen profiles. If the screen is positive, an extended panel of 10-20 cells is used to identify the specific antibody through the rule-out (exclusion) technique. Understanding clinically significant antibodies, dosage effect, enzyme enhancement, and common antibody characteristics is essential for the certification exam.",
    procedureSteps: [
      { step: "1. Antibody Screen (Detection)", detail: "Mix patient serum with 2-3 group O screening cells that express a wide range of clinically significant antigens. Incubate at 37°C and read at the AHG (Coombs) phase. Agglutination or hemolysis indicates an unexpected antibody is present." },
      { step: "2. Panel Selection", detail: "If the screen is positive, select an antibody identification panel of 10-20 group O cells with known antigen profiles. The panel antigram shows which antigens are present (+) or absent (0) on each cell." },
      { step: "3. Rule-Out (Exclusion) Technique", detail: "For each negative (non-reactive) panel cell, rule out all antigens present on that cell. The antibody cannot have a specificity that corresponds to an antigen present on a non-reactive cell. Continue until only one antibody specificity remains." },
      { step: "4. Confirm by Rule of Three", detail: "The identified antibody should be reactive with at least 3 antigen-positive cells and non-reactive with at least 3 antigen-negative cells (p ≤ 0.05). This confirms the antibody specificity with statistical significance." },
      { step: "5. Additional Techniques", detail: "If identification is unclear: use enzyme-treated cells (ficin/papain enhance Rh, Kidd, Lewis; destroy MNSs, Duffy), LISS (low ionic strength solution) enhancement, or selected antigen-negative cells for confirmation." }
    ],
    antigenAntibodyInfo: [
      { heading: "Clinically Significant Antibodies", content: "Clinically significant antibodies cause hemolytic transfusion reactions or HDFN. They react at 37°C and/or the AHG phase. Examples: anti-D, anti-K, anti-Fya, anti-Fyb, anti-Jka, anti-Jkb, anti-S, anti-s, anti-c, anti-E. These antibodies are IgG class and require antigen-negative compatible units for transfusion." },
      { heading: "Clinically Insignificant Antibodies", content: "Cold-reactive antibodies (IgM, react at room temperature or below) are generally not clinically significant. Examples: anti-M (most cases), anti-N, anti-P1, anti-Lea, anti-Leb. These do not cause hemolysis at body temperature and usually do not require antigen-negative blood." },
      { heading: "Enzyme Effects on Blood Group Antigens", content: "Proteolytic enzymes (ficin, papain, trypsin) enhance reactivity of Rh, Kidd, Lewis, P, and I antigens while destroying MNSs and Duffy (Fya/Fyb) antigens. Mnemonics: 'Enzymes Destroy MNSs and Duffy' or 'EDs FryM'." },
      { heading: "Dosage Effect", content: "Some antibodies react more strongly with cells homozygous for the antigen (double dose) than heterozygous cells (single dose). Antibodies that commonly show dosage: anti-Jka, anti-Jkb, anti-M, anti-N, anti-S, anti-s, anti-Fya, anti-Fyb, anti-c, anti-e." }
    ],
    comparisonTable: {
      headers: ["Blood Group System", "Common Antibodies", "Ig Class", "Clinical Significance", "Enzyme Effect", "HDFN Risk"],
      rows: [
        { feature: "Rh", values: ["Anti-D, -C, -c, -E, -e", "IgG", "Yes — severe", "Enhanced", "Yes — severe (anti-D)"] },
        { feature: "Kell", values: ["Anti-K, -k", "IgG", "Yes — severe", "Variable", "Yes — suppresses erythropoiesis"] },
        { feature: "Duffy", values: ["Anti-Fya, -Fyb", "IgG", "Yes", "Destroyed", "Yes — mild to moderate"] },
        { feature: "Kidd", values: ["Anti-Jka, -Jkb", "IgG", "Yes — delayed HTR", "Enhanced", "Yes — mild"] },
        { feature: "MNSs", values: ["Anti-M, -N, -S, -s", "IgM/IgG", "Variable (S/s yes; M/N usually no)", "Destroyed", "Anti-S, anti-s: yes"] },
        { feature: "Lewis", values: ["Anti-Lea, -Leb", "IgM", "Rarely significant", "Enhanced", "No (not IgG)"] },
        { feature: "P", values: ["Anti-P1", "IgM", "Usually not significant", "Enhanced", "No"] }
      ]
    },
    examTraps: [
      "Kidd (Jk) antibodies cause DELAYED hemolytic transfusion reactions — they show dosage and titers drop quickly (hard to detect on pre-transfusion testing)",
      "Enzymes DESTROY Duffy and MNSs antigens — if enzyme-treated cells are still reactive, rule out Duffy and MNSs antibodies",
      "Anti-K (Kell) suppresses erythropoiesis — unique among blood group antibodies; fetal anemia with LOW reticulocytes",
      "Duffy-negative phenotype (Fy(a-b-)) is common in people of African descent and provides resistance to Plasmodium vivax malaria",
      "Rule of Three: need at least 3 positive and 3 negative cells to confirm antibody identification (p ≤ 0.05)",
      "Multiple antibodies: if the panel pattern doesn't fit a single antibody, consider a mixture — use selected cells and enzymes to separate"
    ],
    practiceQuestions: [
      {
        question: "An antibody panel shows reactivity only with cells positive for the Jka antigen. Enzyme-treated cells show enhanced reactivity. Which antibody is most likely?",
        options: ["Anti-Fya", "Anti-M", "Anti-Jka", "Anti-K"],
        correctIndex: 2,
        rationale: "The pattern of reactivity matching Jka-positive cells with enhancement by enzyme treatment is characteristic of anti-Jka (Kidd system). Kidd antibodies are enhanced by enzymes, show dosage, and are clinically significant — they are notorious for causing delayed hemolytic transfusion reactions.",
        whyWrong: [
          "Anti-Fya would react with Fya-positive cells and would be DESTROYED (not enhanced) by enzyme treatment.",
          "Anti-M typically reacts at room temperature and is destroyed by enzymes, not enhanced.",
          "",
          "Anti-K would react with K-positive cells, not Jka-positive cells."
        ]
      },
      {
        question: "A panel shows reactivity at the AHG phase with all cells except those negative for Fya. Enzyme-treated cells are all non-reactive. What is the most likely antibody?",
        options: ["Anti-Jka", "Anti-Fya", "Anti-K", "Anti-E"],
        correctIndex: 1,
        rationale: "Reactivity correlating with Fya-positive cells at the AHG phase, with complete loss of reactivity when enzyme-treated cells are used, is classic for anti-Fya (Duffy system). Duffy antigens are destroyed by proteolytic enzymes (ficin, papain), so anti-Fya becomes non-reactive.",
        whyWrong: [
          "Anti-Jka is enhanced by enzymes, not destroyed.",
          "",
          "Anti-K shows variable enzyme effects but is not characteristically destroyed.",
          "Anti-E is enhanced by enzymes (Rh system)."
        ]
      },
      {
        question: "Which mnemonic describes antigens destroyed by enzyme treatment?",
        options: ["Rh, Kidd, Lewis are destroyed", "MNSs and Duffy are destroyed", "Kell and Kidd are destroyed", "Lewis and P are destroyed"],
        correctIndex: 1,
        rationale: "Proteolytic enzymes (ficin, papain) destroy MNSs (M, N, S, s) and Duffy (Fya, Fyb) antigens. This is critical for antibody identification: if enzyme-treated cells are non-reactive, suspect an antibody to MNSs or Duffy antigens.",
        whyWrong: [
          "Rh, Kidd, and Lewis antigens are enhanced by enzymes, not destroyed.",
          "",
          "Kell antigens show variable enzyme effects; Kidd is enhanced.",
          "Lewis and P antigens are enhanced by enzymes."
        ]
      },
      {
        question: "During antibody identification, how many antigen-positive and antigen-negative reactive cells are needed to confirm specificity (rule of three)?",
        options: ["1 positive and 1 negative", "2 positive and 2 negative", "3 positive and 3 negative", "5 positive and 5 negative"],
        correctIndex: 2,
        rationale: "The 'rule of three' requires reactivity with at least 3 antigen-positive cells and non-reactivity with at least 3 antigen-negative cells to achieve statistical significance (p ≤ 0.05). This confirms that the pattern is not due to chance.",
        whyWrong: [
          "1 positive and 1 negative does not provide statistical significance.",
          "2 positive and 2 negative provides a p-value of approximately 0.1, which is not statistically significant.",
          "",
          "While 5 positive and 5 negative would provide even greater confidence, 3 and 3 is the accepted minimum standard."
        ]
      }
    ],
    relatedTopicSlugs: ["crossmatching", "transfusion-reactions", "hdfn", "rh-factor"],
    faqItems: [
      { question: "What is an antibody screen?", answer: "An antibody screen (indirect antiglobulin test) tests patient serum against 2-3 group O screening cells with known antigen profiles. It detects unexpected (non-ABO) antibodies that could cause hemolytic transfusion reactions or HDFN." },
      { question: "What is the rule-out technique?", answer: "The rule-out (exclusion) technique eliminates antibody possibilities using non-reactive panel cells. If a cell is negative (no agglutination) and that cell is positive for a specific antigen, the antibody against that antigen can be ruled out." },
      { question: "What makes Kidd antibodies dangerous?", answer: "Kidd (Jk) antibodies are dangerous because their titers drop quickly, making them undetectable on pre-transfusion testing. They can cause a strong anamnestic response upon re-exposure, leading to severe delayed hemolytic transfusion reactions." }
    ]
  },
  {
    slug: "blood-component-therapy",
    name: "Blood Component Therapy & Storage",
    seoTitle: "Blood Component Therapy & Storage | RBC, FFP, Platelets for MLT Exam",
    metaDescription: "Complete guide to blood component therapy and storage for MLT certification. Learn storage temperatures, expiration dates, indications, and modifications with practice questions.",
    keywords: "blood component therapy MLT exam, blood product storage temperatures, RBC FFP platelet storage, blood component modifications, leukoreduction irradiation CMV-negative",
    overview: "Blood component therapy involves separating whole blood into individual components (RBCs, plasma, platelets, cryoprecipitate) to provide targeted therapy for specific clinical needs. Each component has specific storage requirements, expiration dates, and clinical indications. Understanding product modifications (leukoreduction, irradiation, washing, volume reduction) and their clinical indications is a core competency for MLT certification.",
    comparisonTable: {
      headers: ["Component", "Storage Temperature", "Shelf Life", "Primary Indication", "Key Facts"],
      rows: [
        { feature: "Packed RBCs", values: ["1-6°C", "35-42 days (additive solution)", "Symptomatic anemia, acute blood loss", "Hematocrit ~55-80%; one unit raises Hgb ~1 g/dL"] },
        { feature: "Fresh Frozen Plasma (FFP)", values: ["-18°C or colder", "1 year frozen; 24 hours after thaw (1-6°C)", "Coagulation factor replacement, DIC, warfarin reversal", "Contains ALL clotting factors; must be ABO-compatible"] },
        { feature: "Platelets (apheresis)", values: ["20-24°C with continuous agitation", "5 days", "Thrombocytopenia, platelet dysfunction", "Must remain at room temp with agitation; highest bacterial contamination risk"] },
        { feature: "Cryoprecipitate", values: ["-18°C or colder", "1 year frozen; 6 hours after thaw (20-24°C)", "Fibrinogen <100 mg/dL, Factor VIII deficiency, von Willebrand disease", "Contains fibrinogen, Factor VIII, Factor XIII, vWF, fibronectin"] },
        { feature: "Whole Blood", values: ["1-6°C", "21-35 days", "Massive hemorrhage (limited use)", "Rarely used; all clotting factors degrade during storage except stable factors"] },
        { feature: "Granulocytes", values: ["20-24°C (no agitation)", "24 hours", "Severe neutropenia with documented infection", "Must be irradiated; crossmatched like RBCs; ABO compatible"] }
      ]
    },
    antigenAntibodyInfo: [
      { heading: "Leukoreduction", content: "Removal of white blood cells (WBCs) from blood products using filters. Reduces risk of febrile non-hemolytic transfusion reactions (FNHTR), CMV transmission, and HLA alloimmunization. Most blood centers now perform universal pre-storage leukoreduction. A leukoreduced unit must contain <5 × 10⁶ residual WBCs." },
      { heading: "Irradiation", content: "Gamma or X-ray irradiation inactivates donor T-lymphocytes to prevent transfusion-associated graft-versus-host disease (TA-GVHD). Indicated for immunocompromised recipients, HLA-matched products, directed donations from blood relatives, and intrauterine transfusions. Irradiation reduces RBC shelf life to 28 days from date of irradiation or original expiration, whichever is sooner." },
      { heading: "Washing", content: "Washes RBCs or platelets with saline to remove plasma proteins, antibodies, and cytokines. Indicated for IgA-deficient patients with anti-IgA (prevents anaphylaxis), severe allergic reactions to plasma proteins, and neonatal transfusions. Washed RBCs expire 24 hours after washing." },
      { heading: "Volume Reduction", content: "Centrifugation to remove excess plasma volume. Indicated for patients at risk of fluid overload (neonates, cardiac patients). Reduces the plasma volume without removing as many cellular components as washing." }
    ],
    examTraps: [
      "Platelets are stored at ROOM TEMPERATURE (20-24°C) with agitation — they have the HIGHEST risk of bacterial contamination",
      "Irradiated RBCs expire 28 days from irradiation OR original expiration — WHICHEVER IS SOONER",
      "Washed RBCs expire in 24 HOURS after washing (open system)",
      "FFP must be thawed before use and expires 24 hours after thawing at 1-6°C",
      "Cryoprecipitate thawed and pooled expires in 4-6 hours at room temperature (20-24°C)",
      "Leukoreduction prevents FNHTR and CMV transmission but does NOT prevent TA-GVHD — irradiation is needed for that",
      "One unit of apheresis platelets = 6 whole-blood-derived platelet concentrates"
    ],
    practiceQuestions: [
      {
        question: "A blood component is stored at 20-24°C with continuous agitation and has a 5-day shelf life. Which component is this?",
        options: ["Packed RBCs", "Fresh frozen plasma", "Platelets", "Cryoprecipitate"],
        correctIndex: 2,
        rationale: "Platelets are stored at 20-24°C (room temperature) with continuous agitation to prevent clumping and maintain function. They have a 5-day shelf life, which is the shortest of all standard blood components. Room temperature storage contributes to the highest risk of bacterial contamination.",
        whyWrong: [
          "Packed RBCs are stored at 1-6°C and have a 35-42 day shelf life.",
          "FFP is stored at -18°C or colder and has a 1-year shelf life when frozen.",
          "",
          "Cryoprecipitate is stored at -18°C or colder and has a 1-year shelf life when frozen."
        ]
      },
      {
        question: "A packed RBC unit is irradiated on day 20 of a 42-day storage period. What is the new expiration date?",
        options: ["Day 42 (original expiration)", "Day 48 (28 days from irradiation)", "Day 42 — whichever is sooner", "Day 28 — 28 days from irradiation is sooner than day 42"],
        correctIndex: 1,
        rationale: "Irradiated RBCs expire 28 days from the date of irradiation OR the original expiration date, whichever comes first. Day 20 + 28 = day 48, but the original expiration is day 42. Since day 42 is sooner than day 48, the unit expires on day 42.",
        whyWrong: [
          "While the answer is day 42, the reasoning matters — it's because day 42 (original) is sooner than day 48 (28 days from irradiation).",
          "",
          "This is the correct answer — day 42 is sooner.",
          "28 days from day 20 is day 48, which is AFTER the original day 42 expiration. Day 42 is the correct answer."
        ]
      },
      {
        question: "Which blood product modification prevents transfusion-associated graft-versus-host disease?",
        options: ["Leukoreduction", "Irradiation", "Washing", "Volume reduction"],
        correctIndex: 1,
        rationale: "Irradiation (gamma or X-ray) inactivates donor T-lymphocytes, preventing them from engrafting in the recipient and causing TA-GVHD. Leukoreduction reduces WBC count but does not reliably eliminate all T-cells, so it does NOT prevent TA-GVHD.",
        whyWrong: [
          "Leukoreduction reduces WBCs but does not inactivate remaining T-cells — insufficient to prevent TA-GVHD.",
          "",
          "Washing removes plasma proteins but does not affect lymphocyte viability.",
          "Volume reduction reduces plasma volume but does not affect lymphocytes."
        ]
      },
      {
        question: "A patient with IgA deficiency and documented anti-IgA antibodies needs a red blood cell transfusion. Which product modification is required?",
        options: ["Irradiated RBCs", "Leukoreduced RBCs", "Washed RBCs", "Volume-reduced RBCs"],
        correctIndex: 2,
        rationale: "Washing RBCs with saline removes residual plasma proteins, including IgA. This prevents anaphylactic reactions in IgA-deficient patients with anti-IgA antibodies. Alternatively, blood from IgA-deficient donors can be used.",
        whyWrong: [
          "Irradiation prevents TA-GVHD but does not remove plasma proteins.",
          "Leukoreduction removes WBCs but does not remove IgA from the plasma.",
          "",
          "Volume reduction reduces plasma volume but may not adequately remove IgA."
        ]
      }
    ],
    relatedTopicSlugs: ["massive-transfusion", "transfusion-reactions", "compatibility-chart"],
    faqItems: [
      { question: "Why are platelets stored at room temperature?", answer: "Platelets lose their function (become activated and aggregate) when refrigerated. Room temperature (20-24°C) storage with continuous agitation maintains platelet viability and function. The tradeoff is a higher risk of bacterial contamination, which is why platelets have only a 5-day shelf life." },
      { question: "What is the difference between leukoreduction and irradiation?", answer: "Leukoreduction physically removes white blood cells using filters — it prevents FNHTR, CMV transmission, and HLA alloimmunization. Irradiation uses gamma/X-rays to inactivate donor lymphocytes — it prevents TA-GVHD. They address different complications and may both be needed for high-risk patients." },
      { question: "When is cryoprecipitate used?", answer: "Cryoprecipitate is used when fibrinogen is critically low (<100 mg/dL), as in DIC or massive transfusion. It contains concentrated fibrinogen, Factor VIII, Factor XIII, von Willebrand factor, and fibronectin. Each unit raises fibrinogen by approximately 5-10 mg/dL." }
    ]
  }
];

export function getBloodBankTopicBySlug(slug: string): BloodBankTopicData | undefined {
  return seoBloodBankTopics.find(t => t.slug === slug);
}

export function getAllBloodBankSlugs(): string[] {
  return seoBloodBankTopics.map(t => t.slug);
}
