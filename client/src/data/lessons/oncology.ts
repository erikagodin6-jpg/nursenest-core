import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

const imgKaposiSarcoma = getAssetUrl("kaposisarcoma_1773517523349.png");

export const oncologyLessons: Record<string, LessonContent> = {
  "hodgkin-lymphoma": {
    title: "Hodgkin Lymphoma",
    cellular: {
      title: "Pathophysiology of Hodgkin Lymphoma",
      content: "Hodgkin lymphoma is a malignancy of the lymphatic system characterized by the presence of Reed-Sternberg cells, which are large binucleated or multinucleated cells derived from B lymphocytes. These abnormal cells proliferate within lymph nodes, disrupting normal immune surveillance and causing progressive lymph node enlargement. The disease typically follows a contiguous spread pattern, moving predictably from one lymph node group to adjacent groups. The Ann Arbor staging system classifies the disease from Stage I (single lymph node region) to Stage IV (diffuse extranodal involvement). B symptoms - fever greater than 38 degrees Celsius, drenching night sweats, and unexplained weight loss exceeding 10% of body weight over six months - indicate systemic disease and carry prognostic significance."
    },
    riskFactors: [
      "Age 15-35 or over 55 years (bimodal distribution)",
      "Prior Epstein-Barr virus (EBV) infection",
      "Male sex (slightly higher incidence)",
      "Family history of Hodgkin lymphoma in first-degree relatives",
      "Immunosuppression or HIV/AIDS",
      "History of autoimmune conditions",
      "Higher socioeconomic status (correlates with delayed EBV exposure)"
    ],
    diagnostics: [
      "Excisional lymph node biopsy confirming Reed-Sternberg cells",
      "CT scan of chest, abdomen, and pelvis for staging",
      "PET scan to identify metabolically active disease sites",
      "Bone marrow biopsy for advanced-stage disease",
      "CBC with differential and ESR (elevated ESR indicates disease activity)",
      "Lactate dehydrogenase (LDH) level as prognostic indicator"
    ],
    management: [
      "ABVD chemotherapy regimen (doxorubicin, bleomycin, vinblastine, dacarbazine)",
      "Radiation therapy for early-stage disease or combined modality",
      "Stem cell transplant for relapsed or refractory disease",
      "Interim PET scan to assess treatment response",
      "Growth factor support (filgrastim) for neutropenia management",
      "Fertility preservation counseling before treatment initiation"
    ],
    nursingActions: [
      "Monitor for B symptoms and document pattern and severity",
      "Assess for signs of tumor lysis syndrome during initial treatment",
      "Administer antiemetics before chemotherapy per protocol",
      "Monitor pulmonary function during bleomycin therapy (risk of pulmonary toxicity)",
      "Educate patient about infection prevention during immunosuppression",
      "Assess cardiac function before and during doxorubicin therapy",
      "Provide psychosocial support and referrals for young adult patients"
    ],
    signs: {
      left: [
        "Painless, rubbery cervical or supraclavicular lymphadenopathy",
        "Unexplained fever greater than 38 degrees Celsius",
        "Drenching night sweats requiring linen changes",
        "Unexplained weight loss exceeding 10% in 6 months"
      ],
      right: [
        "Pruritus (generalized itching without rash)",
        "Alcohol-induced lymph node pain (pathognomonic but rare)",
        "Mediastinal mass causing cough or dyspnea",
        "Hepatosplenomegaly in advanced disease"
      ]
    },
    medications: [
      {
        name: "Doxorubicin (Adriamycin)",
        type: "Anthracycline antineoplastic",
        action: "Intercalates DNA and inhibits topoisomerase II, preventing DNA replication and transcription in rapidly dividing cells",
        sideEffects: "Cardiotoxicity (cumulative dose-related), myelosuppression, alopecia, nausea, red-orange discoloration of urine, vesicant risk",
        contra: "Severe cardiac disease, prior cumulative anthracycline dose limit reached, severe hepatic impairment",
        pearl: "Lifetime cumulative dose must be tracked to prevent irreversible cardiomyopathy - monitor ejection fraction with echocardiogram or MUGA scan before each cycle"
      }
    ],
    pearls: [
      "Reed-Sternberg cells are the hallmark diagnostic finding - often described as owl-eye cells on biopsy",
      "Hodgkin lymphoma spreads contiguously (node to adjacent node), unlike non-Hodgkin lymphoma which spreads non-contiguously",
      "Alcohol-induced pain at the site of involved lymph nodes is nearly pathognomonic for Hodgkin lymphoma"
    ],
    quiz: [
      {
        question: "A 22-year-old patient presents with painless cervical lymphadenopathy, night sweats, and a 15-pound weight loss over 3 months. Biopsy reveals binucleated giant cells with prominent nucleoli. Which diagnostic finding is most consistent with Hodgkin lymphoma?",
        options: [
          "Philadelphia chromosome on cytogenetic analysis",
          "Reed-Sternberg cells on excisional lymph node biopsy",
          "Bence Jones protein in urine electrophoresis",
          "Auer rods on peripheral blood smear"
        ],
        correct: 1,
        rationale: "Reed-Sternberg cells are the pathognomonic finding for Hodgkin lymphoma. These large, binucleated cells with prominent nucleoli (owl-eye appearance) are identified on excisional lymph node biopsy and are required for definitive diagnosis."
      }
    ]
  },

  "non-hodgkin-lymphoma": {
    title: "Non-Hodgkin Lymphoma",
    cellular: {
      title: "Pathophysiology of Non-Hodgkin Lymphoma",
      content: "Non-Hodgkin lymphoma (NHL) encompasses a diverse group of lymphoid malignancies arising from B cells (85%), T cells, or natural killer cells at various stages of differentiation. Unlike Hodgkin lymphoma, NHL typically spreads non-contiguously and may present with widespread extranodal involvement at diagnosis. The malignant lymphocytes proliferate uncontrollably, accumulating in lymph nodes, spleen, bone marrow, and extranodal sites such as the gastrointestinal tract, skin, and central nervous system. NHL is classified as indolent (low-grade, slow-growing) or aggressive (high-grade, rapidly proliferating). Diffuse large B-cell lymphoma is the most common aggressive subtype, while follicular lymphoma is the most common indolent subtype. Chromosomal translocations play key roles in pathogenesis, such as t(14;18) in follicular lymphoma and t(8;14) in Burkitt lymphoma."
    },
    riskFactors: [
      "Immunosuppression (HIV/AIDS, organ transplant recipients)",
      "Autoimmune disorders (Sjogren syndrome, rheumatoid arthritis, celiac disease)",
      "Chronic infections (H. pylori, hepatitis C, EBV, HTLV-1)",
      "Prior radiation or chemotherapy exposure",
      "Age over 60 years",
      "Male sex",
      "Exposure to pesticides, herbicides, or organic solvents",
      "Family history of lymphoproliferative disorders"
    ],
    diagnostics: [
      "Excisional lymph node biopsy with immunohistochemistry and flow cytometry",
      "CT or PET-CT scan for staging",
      "Bone marrow biopsy to assess marrow involvement",
      "Lumbar puncture for CNS evaluation in aggressive subtypes",
      "LDH level (elevated indicates high tumor burden and aggressive disease)"
    ],
    management: [
      "R-CHOP regimen for diffuse large B-cell lymphoma (rituximab, cyclophosphamide, doxorubicin, vincristine, prednisone)",
      "Watchful waiting for asymptomatic indolent lymphomas",
      "Radiation therapy for localized disease",
      "Autologous stem cell transplant for relapsed or refractory disease",
      "Targeted therapies (ibrutinib for mantle cell lymphoma)",
      "Intrathecal chemotherapy for CNS prophylaxis in high-risk subtypes"
    ],
    nursingActions: [
      "Monitor for tumor lysis syndrome during initial aggressive chemotherapy",
      "Assess for signs of superior vena cava syndrome (facial edema, dyspnea, distended neck veins)",
      "Administer rituximab infusion slowly and monitor for infusion reactions",
      "Maintain strict infection precautions during neutropenic periods",
      "Monitor renal function and ensure adequate hydration during treatment",
      "Educate about avoiding live vaccines during immunosuppressive therapy",
      "Assess for peripheral neuropathy from vincristine (numbness, tingling in extremities)"
    ],
    signs: {
      left: [
        "Painless peripheral lymphadenopathy (often diffuse, non-contiguous)",
        "B symptoms (fever, night sweats, weight loss) in aggressive subtypes",
        "Abdominal fullness or early satiety from splenomegaly",
        "Skin lesions or rashes in cutaneous T-cell lymphoma"
      ],
      right: [
        "Fatigue and malaise from anemia or systemic disease",
        "Recurrent infections indicating bone marrow infiltration",
        "Jaw or facial swelling in Burkitt lymphoma",
        "Bowel obstruction symptoms from GI tract involvement"
      ]
    },
    medications: [
      {
        name: "Rituximab (Rituxan)",
        type: "Monoclonal antibody (anti-CD20)",
        action: "Binds to CD20 antigen on B lymphocytes, triggering complement-dependent cytotoxicity and antibody-dependent cellular cytotoxicity, resulting in B-cell depletion",
        sideEffects: "Infusion reactions (fever, chills, rigors, hypotension), progressive multifocal leukoencephalopathy (rare), hepatitis B reactivation, myelosuppression",
        contra: "Severe active infections, known hypersensitivity, hepatitis B carriers without antiviral prophylaxis",
        pearl: "Premedicate with acetaminophen, diphenhydramine, and corticosteroid before first infusion - begin infusion slowly and titrate up as tolerated to minimize severe reactions"
      }
    ],
    pearls: [
      "NHL spreads non-contiguously (skips lymph node groups), unlike Hodgkin lymphoma which spreads in an orderly, contiguous pattern",
      "Burkitt lymphoma is one of the fastest-growing human malignancies and has a strong association with EBV and the t(8;14) translocation",
      "Tumor lysis syndrome risk is highest in aggressive, bulky NHL - ensure allopurinol or rasburicase and aggressive IV hydration are initiated before chemotherapy"
    ],
    quiz: [
      {
        question: "A nurse is caring for a patient beginning R-CHOP chemotherapy for newly diagnosed diffuse large B-cell lymphoma with a large abdominal mass. Which nursing intervention is the highest priority before the first treatment cycle?",
        options: [
          "Administer a live varicella vaccine for prophylaxis",
          "Initiate tumor lysis syndrome prevention with hydration and allopurinol",
          "Schedule a pulmonary function test for bleomycin toxicity monitoring",
          "Withhold all oral medications to prevent drug interactions"
        ],
        correct: 1,
        rationale: "Patients with bulky, aggressive NHL are at high risk for tumor lysis syndrome (TLS) when chemotherapy rapidly lyses malignant cells. Prevention includes aggressive IV hydration and allopurinol or rasburicase to reduce uric acid levels before treatment. Live vaccines are contraindicated during immunosuppression, and bleomycin is not part of R-CHOP."
      }
    ]
  },

  "multiple-myeloma": {
    title: "Multiple Myeloma",
    cellular: {
      title: "Pathophysiology of Multiple Myeloma",
      content: "Multiple myeloma is a hematologic malignancy characterized by clonal proliferation of neoplastic plasma cells in the bone marrow, producing excessive amounts of monoclonal immunoglobulin (M protein). These malignant plasma cells crowd out normal hematopoietic cells, leading to pancytopenia. They also secrete osteoclast-activating factors that cause pathologic bone destruction, resulting in lytic lesions, hypercalcemia, and pathologic fractures. The excess immunoglobulin light chains (Bence Jones proteins) are filtered through the kidneys, causing cast nephropathy and progressive renal failure. The hallmark clinical features are remembered by the mnemonic CRAB: hypercalcemia, renal insufficiency, anemia, and bone lesions. Amyloid deposition may occur in various organs from accumulated light chain fragments."
    },
    riskFactors: [
      "Age over 65 years (median age at diagnosis is 69)",
      "African American descent (two-fold increased incidence)",
      "Male sex",
      "Prior monoclonal gammopathy of undetermined significance (MGUS)",
      "Obesity and metabolic syndrome",
      "Family history of multiple myeloma or MGUS",
      "Occupational exposure to petroleum products, pesticides, or radiation"
    ],
    diagnostics: [
      "Serum protein electrophoresis (SPEP) showing M spike",
      "24-hour urine for Bence Jones protein (immunoglobulin light chains)",
      "Bone marrow biopsy showing greater than 10% clonal plasma cells",
      "Skeletal survey or low-dose whole-body CT revealing lytic bone lesions",
      "Serum free light chain assay with abnormal kappa-to-lambda ratio",
      "Beta-2 microglobulin level for prognosis and staging"
    ],
    management: [
      "Combination chemotherapy with proteasome inhibitor (bortezomib), immunomodulatory agent (lenalidomide), and dexamethasone",
      "Autologous stem cell transplant for eligible patients",
      "Bisphosphonates (zoledronic acid) to prevent skeletal complications",
      "Erythropoiesis-stimulating agents for anemia management",
      "Plasmapheresis for hyperviscosity syndrome",
      "Vertebroplasty or kyphoplasty for pathologic vertebral fractures"
    ],
    nursingActions: [
      "Implement fall prevention and safe mobility measures due to pathologic fracture risk",
      "Monitor serum calcium levels and report signs of hypercalcemia (confusion, polyuria, constipation)",
      "Maintain adequate hydration (2-3 liters daily) to protect renal function",
      "Assess for signs of spinal cord compression (back pain, lower extremity weakness, bladder dysfunction)",
      "Monitor for peripheral neuropathy from bortezomib (numbness, tingling, pain)",
      "Educate patient on infection prevention due to immunoparesis"
    ],
    signs: {
      left: [
        "Persistent bone pain (especially back and ribs) worsening with movement",
        "Pathologic fractures from minimal trauma",
        "Fatigue and weakness from anemia",
        "Recurrent bacterial infections (pneumococcal pneumonia common)"
      ],
      right: [
        "Hypercalcemia symptoms (nausea, confusion, polyuria, constipation)",
        "Renal insufficiency progressing to failure",
        "Peripheral neuropathy (numbness, tingling in extremities)",
        "Bleeding tendencies from thrombocytopenia or M-protein interference with clotting"
      ]
    },
    medications: [
      {
        name: "Bortezomib (Velcade)",
        type: "Proteasome inhibitor",
        action: "Reversibly inhibits the 26S proteasome in myeloma cells, preventing degradation of pro-apoptotic proteins and leading to programmed cell death of malignant plasma cells",
        sideEffects: "Peripheral neuropathy (dose-limiting), thrombocytopenia, nausea, diarrhea, fatigue, herpes zoster reactivation",
        contra: "Severe hepatic impairment, hypersensitivity to bortezomib or boron",
        pearl: "Subcutaneous administration reduces peripheral neuropathy risk compared to IV route - antiviral prophylaxis (acyclovir) should be given concurrently to prevent herpes zoster reactivation"
      }
    ],
    pearls: [
      "Remember CRAB for multiple myeloma: Calcium elevation, Renal insufficiency, Anemia, Bone lesions - presence of any one defines symptomatic disease requiring treatment",
      "Bence Jones proteinuria is caused by excess immunoglobulin light chains and is toxic to renal tubules - aggressive hydration is critical to prevent renal failure",
      "Pathologic fractures can occur with minimal stress - avoid using a blood pressure cuff on an arm with known lytic lesions and implement strict fall precautions"
    ],
    quiz: [
      {
        question: "A patient with multiple myeloma reports sudden onset of severe back pain, leg weakness, and difficulty voiding. Which complication should the nurse suspect and act on immediately?",
        options: [
          "Pathologic rib fracture requiring pain management",
          "Spinal cord compression requiring emergent imaging and intervention",
          "Urinary tract infection from immunosuppression",
          "Hypercalcemic crisis causing altered mental status"
        ],
        correct: 1,
        rationale: "The triad of sudden back pain, lower extremity weakness, and bladder dysfunction strongly suggests spinal cord compression from vertebral collapse or tumor extension. This is an oncologic emergency requiring emergent MRI and intervention (high-dose corticosteroids and possible surgical decompression or radiation) within hours to prevent permanent paraplegia."
      }
    ]
  },

  "breast-cancer": {
    title: "Breast Cancer",
    cellular: {
      title: "Pathophysiology of Breast Cancer",
      content: "Breast cancer arises from malignant transformation of epithelial cells lining the ducts (ductal carcinoma, 80%) or lobules (lobular carcinoma) of the breast. Invasive ductal carcinoma is the most common histologic type. Tumor biology is classified by receptor status: estrogen receptor (ER), progesterone receptor (PR), and human epidermal growth factor receptor 2 (HER2). Triple-negative breast cancer (ER-negative, PR-negative, HER2-negative) carries the worst prognosis and has limited targeted therapy options. BRCA1 and BRCA2 gene mutations significantly increase lifetime breast cancer risk to 45-72%. Sentinel lymph node biopsy identifies the first draining lymph node to determine axillary metastasis, guiding surgical extent. TNM staging incorporates tumor size, nodal involvement, and distant metastasis to determine prognosis and treatment approach."
    },
    riskFactors: [
      "BRCA1 or BRCA2 gene mutation (autosomal dominant inheritance)",
      "Female sex and advancing age (risk increases after 50)",
      "Early menarche (before age 12) or late menopause (after age 55)",
      "Nulliparity or first pregnancy after age 30",
      "Personal history of breast cancer or atypical ductal hyperplasia",
      "First-degree relative with breast cancer",
      "Prolonged hormone replacement therapy (combined estrogen-progesterone)",
      "Obesity after menopause and excessive alcohol consumption"
    ],
    diagnostics: [
      "Screening mammography (annual or biennial depending on risk stratification)",
      "Diagnostic mammography and ultrasound for palpable masses",
      "Core needle biopsy for histologic diagnosis and receptor status",
      "Breast MRI for high-risk screening or extent-of-disease evaluation",
      "Sentinel lymph node biopsy for axillary staging",
      "Genetic testing for BRCA1/BRCA2 in high-risk individuals"
    ],
    management: [
      "Surgical excision: lumpectomy (breast-conserving) with radiation or mastectomy",
      "Sentinel lymph node biopsy with possible axillary dissection",
      "Adjuvant chemotherapy based on stage, grade, and molecular subtype",
      "Hormonal therapy (tamoxifen or aromatase inhibitors) for ER-positive tumors",
      "Trastuzumab (Herceptin) for HER2-positive tumors",
      "Radiation therapy following breast-conserving surgery"
    ],
    nursingActions: [
      "Teach breast self-examination technique and reporting of new findings",
      "Assess surgical site for hematoma, seroma, and wound infection postoperatively",
      "Monitor drain output (Jackson-Pratt) and document character and volume",
      "Educate about lymphedema prevention on the affected side (no BP, venipuncture, or constriction)",
      "Support body image adaptation and provide referrals for prosthetics or reconstruction",
      "Reinforce adherence to adjuvant hormonal therapy for the prescribed 5-10 year duration",
      "Screen for distress and refer to oncology social work and support groups"
    ],
    signs: {
      left: [
        "Painless, hard, irregular, fixed breast mass (most common presentation)",
        "Unilateral bloody or serous nipple discharge",
        "Skin dimpling or peau d'orange (orange peel skin) appearance",
        "Nipple retraction or inversion of recent onset"
      ],
      right: [
        "Axillary lymphadenopathy (palpable hard, fixed nodes)",
        "Breast asymmetry or change in size or contour",
        "Erythema and warmth (inflammatory breast cancer presentation)",
        "Paget disease of the nipple (eczema-like crusting and erosion)"
      ]
    },
    medications: [
      {
        name: "Tamoxifen",
        type: "Selective estrogen receptor modulator (SERM)",
        action: "Competitively blocks estrogen receptors on breast cancer cells, inhibiting estrogen-mediated tumor growth in ER-positive breast cancer",
        sideEffects: "Hot flashes, vaginal dryness, increased risk of endometrial cancer, thromboembolic events (DVT, PE), cataracts",
        contra: "Pregnancy (teratogenic), history of DVT or PE, concurrent warfarin use requires close INR monitoring",
        pearl: "Patients must use non-hormonal contraception during therapy and for 2 months after discontinuation - report any abnormal vaginal bleeding immediately as it may indicate endometrial hyperplasia or cancer"
      }
    ],
    pearls: [
      "The most common presenting sign of breast cancer is a painless, hard, irregular, fixed mass - pain is typically a late finding and does not rule out malignancy",
      "Never perform venipuncture, blood pressure measurement, or IV insertion on the affected arm after axillary lymph node dissection to prevent lymphedema",
      "BRCA mutation carriers should be offered enhanced surveillance (annual MRI alternating with mammography starting at age 25) and counseling about risk-reducing surgical options"
    ],
    quiz: [
      {
        question: "A patient who underwent left modified radical mastectomy with axillary lymph node dissection is being discharged. Which instruction is essential for the nurse to include in discharge teaching?",
        options: [
          "Sleep exclusively on the operative side to promote drainage",
          "Avoid blood pressure measurement, venipuncture, and injections on the left arm",
          "Begin vigorous upper extremity exercises immediately to restore range of motion",
          "Apply heating pads to the surgical site to reduce swelling"
        ],
        correct: 1,
        rationale: "After axillary lymph node dissection, the affected arm is at lifelong risk for lymphedema due to disrupted lymphatic drainage. Blood pressure cuffs, venipunctures, and injections can trigger or worsen lymphedema and must be avoided on the affected side. Gentle range-of-motion exercises are introduced gradually, not vigorously."
      }
    ]
  },

  "mastectomy": {
    title: "Mastectomy Post-Operative Care",
    cellular: {
      title: "Pathophysiology and Surgical Considerations",
      content: "Mastectomy involves surgical removal of breast tissue and ranges from simple mastectomy (breast tissue only) to modified radical mastectomy (breast tissue plus axillary lymph nodes) to radical mastectomy (breast tissue, pectoralis muscles, and axillary nodes). Removal of axillary lymph nodes disrupts lymphatic drainage from the ipsilateral upper extremity, creating a lifelong risk of lymphedema. The surgical disruption of lymphatic channels prevents adequate protein-rich fluid reabsorption, causing progressive swelling, tissue fibrosis, and increased infection susceptibility in the affected arm. Seroma formation is common postoperatively as serous fluid accumulates in the surgical dead space. Nerve injury during axillary dissection may cause intercostobrachial nerve damage, resulting in numbness along the inner upper arm and axilla."
    },
    riskFactors: [
      "Axillary lymph node dissection (primary risk for lymphedema)",
      "Radiation therapy to the axilla or chest wall",
      "Obesity (BMI greater than 30)",
      "Wound infection or seroma formation postoperatively",
      "Extensive surgical dissection and tissue removal",
      "Sedentary lifestyle with limited arm mobility postoperatively",
      "Cellulitis or injury to the ipsilateral arm"
    ],
    diagnostics: [
      "Arm circumference measurements (compare bilateral, greater than 2 cm difference is significant)",
      "Limb volume measurement using water displacement or perometry",
      "Lymphoscintigraphy to evaluate lymphatic drainage patterns",
      "Bioimpedance spectroscopy for subclinical lymphedema detection",
      "Surgical pathology for tumor staging and margin assessment"
    ],
    management: [
      "Jackson-Pratt drain management until output is less than 30 mL per 24 hours",
      "Progressive arm exercises beginning with pendulum exercises 24 hours postoperatively",
      "Complete decongestive therapy for established lymphedema",
      "Compression garments for lymphedema management",
      "Breast reconstruction options (immediate or delayed, implant or flap)",
      "Referral to certified lymphedema therapist for prevention program"
    ],
    nursingActions: [
      "Position arm on operative side elevated on pillows to promote lymphatic drainage",
      "Monitor Jackson-Pratt drain output every shift and strip tubing as needed",
      "Assess circulation, sensation, and movement of the ipsilateral arm",
      "Instruct patient to avoid lifting more than 5 pounds with the affected arm initially",
      "Protect affected arm from injury, sunburn, insect bites, and temperature extremes",
      "Teach arm exercises: wall climbing, rope turning, and pendulum exercises per protocol",
      "Provide emotional support and body image counseling resources"
    ],
    signs: {
      left: [
        "Swelling of the ipsilateral arm, hand, or fingers (lymphedema)",
        "Tightness, heaviness, or aching sensation in the affected arm",
        "Decreased range of motion in shoulder and arm",
        "Numbness along inner arm from intercostobrachial nerve injury"
      ],
      right: [
        "Seroma formation at the surgical site (fluctuant swelling)",
        "Wound infection (erythema, warmth, purulent drainage)",
        "Phantom breast sensations",
        "Impaired shoulder mobility and winged scapula from nerve damage"
      ]
    },
    medications: [
      {
        name: "Cephalexin",
        type: "First-generation cephalosporin antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins, used for prophylaxis and treatment of cellulitis in lymphedema-affected limbs",
        sideEffects: "Nausea, diarrhea, hypersensitivity reactions, Clostridioides difficile-associated diarrhea",
        contra: "Known cephalosporin allergy, severe penicillin allergy (cross-reactivity risk), renal impairment requires dose adjustment",
        pearl: "Patients with lymphedema should be educated to seek immediate medical attention at the first sign of cellulitis (redness, warmth, swelling) as delayed treatment can worsen lymphedema permanently"
      }
    ],
    pearls: [
      "Lymphedema can develop months to years after surgery - patient education about lifelong prevention strategies is critical at every follow-up visit",
      "Never use the operative side for blood draws, IV access, blood pressure, or injections - apply a medical alert band to the affected arm",
      "Jackson-Pratt drains are typically removed when output drops below 30 mL in 24 hours - teach the patient to empty and record drain output at home"
    ],
    quiz: [
      {
        question: "A nurse is caring for a patient 6 hours after a modified radical mastectomy. Which finding requires immediate nursing intervention?",
        options: [
          "Serous drainage of 40 mL in the Jackson-Pratt drain",
          "Numbness along the inner aspect of the upper arm",
          "The affected arm is cool, pale, and without palpable radial pulse",
          "Mild incisional pain rated 4 out of 10"
        ],
        correct: 2,
        rationale: "A cool, pale arm without a palpable radial pulse indicates compromised arterial circulation and requires immediate intervention. This may result from a tight dressing, hematoma compression, or positioning. Numbness along the inner arm is expected from intercostobrachial nerve injury. Normal JP drain output and mild pain are expected postoperative findings."
      }
    ]
  },

  "cervical-cancer": {
    title: "Cervical Cancer",
    cellular: {
      title: "Pathophysiology of Cervical Cancer",
      content: "Cervical cancer develops from the malignant transformation of epithelial cells at the squamocolumnar junction (transformation zone) of the cervix. High-risk strains of human papillomavirus (HPV), particularly types 16 and 18, are the causative agents in over 99% of cervical cancers. HPV oncoproteins E6 and E7 inactivate tumor suppressor proteins p53 and retinoblastoma (Rb), respectively, leading to uncontrolled cellular proliferation. The progression from HPV infection to cervical intraepithelial neoplasia (CIN) to invasive carcinoma typically occurs over 10-20 years, providing a long window for screening and prevention. Squamous cell carcinoma accounts for approximately 80% of cervical cancers. The disease spreads locally to parametrial tissues, vagina, and bladder, with lymphatic dissemination to pelvic and para-aortic lymph nodes."
    },
    riskFactors: [
      "Persistent infection with high-risk HPV strains (types 16 and 18)",
      "Early onset of sexual activity (before age 18)",
      "Multiple sexual partners increasing HPV exposure risk",
      "Immunosuppression (HIV infection significantly increases risk)",
      "Cigarette smoking (tobacco carcinogens concentrate in cervical mucus)",
      "Long-term oral contraceptive use (greater than 5 years)",
      "History of sexually transmitted infections (chlamydia co-infection)",
      "Lack of regular Pap screening"
    ],
    diagnostics: [
      "Pap smear (Papanicolaou test) for cytologic screening",
      "HPV DNA testing (co-testing with Pap for women 30-65 years)",
      "Colposcopy with directed biopsy for abnormal Pap results",
      "Cone biopsy (conization) for diagnosis and treatment of CIN",
      "MRI of pelvis for staging of invasive disease",
      "PET-CT for detection of distant metastasis"
    ],
    management: [
      "HPV vaccination (9-valent vaccine) for prevention in ages 9-45",
      "Loop electrosurgical excision procedure (LEEP) for CIN 2-3",
      "Radical hysterectomy with pelvic lymphadenectomy for early-stage disease",
      "Concurrent chemoradiation (cisplatin-based) for locally advanced disease",
      "Brachytherapy (intracavitary radiation) as part of definitive treatment",
      "Pembrolizumab for recurrent or metastatic cervical cancer with PD-L1 expression"
    ],
    nursingActions: [
      "Educate about HPV vaccination as primary prevention for eligible individuals",
      "Reinforce importance of routine Pap screening according to age-based guidelines",
      "Provide pre-procedure teaching for colposcopy and biopsy (expect mild cramping and spotting)",
      "Monitor for complications of radiation therapy (radiation cystitis, proctitis, vaginal stenosis)",
      "Instruct patient to use vaginal dilator during and after pelvic radiation to prevent stenosis",
      "Assess for psychosexual concerns and provide supportive counseling",
      "Monitor renal function during cisplatin therapy and maintain aggressive hydration"
    ],
    signs: {
      left: [
        "Abnormal vaginal bleeding (postcoital, intermenstrual, or postmenopausal)",
        "Persistent watery, bloody, or malodorous vaginal discharge",
        "Pelvic pain or pressure in advanced disease",
        "Dyspareunia (pain during intercourse)"
      ],
      right: [
        "Leg edema from lymphatic or venous obstruction",
        "Flank pain from ureteral obstruction and hydronephrosis",
        "Hematuria or rectal bleeding from local invasion",
        "Weight loss and fatigue in advanced metastatic disease"
      ]
    },
    medications: [
      {
        name: "Cisplatin",
        type: "Platinum-based alkylating-like antineoplastic",
        action: "Cross-links DNA strands, preventing DNA replication and transcription in rapidly dividing cells, used as a radiosensitizer in concurrent chemoradiation for cervical cancer",
        sideEffects: "Severe nephrotoxicity, ototoxicity (hearing loss), peripheral neuropathy, severe nausea and vomiting, myelosuppression, electrolyte wasting (hypomagnesemia, hypokalemia)",
        contra: "Pre-existing renal impairment, hearing loss, pregnancy, severe myelosuppression",
        pearl: "Aggressive pre- and post-hydration with normal saline is mandatory to prevent nephrotoxicity - monitor urine output strictly and administer antiemetics (5-HT3 antagonists) before infusion"
      }
    ],
    pearls: [
      "HPV types 16 and 18 cause over 70% of cervical cancers - vaccination before HPV exposure is the most effective primary prevention strategy",
      "Cervical cancer is the only gynecologic malignancy with an effective screening test (Pap smear) - regular screening can detect precancerous changes years before invasive disease develops",
      "Postcoital bleeding is the most characteristic early symptom - any postmenopausal bleeding requires prompt evaluation to exclude malignancy"
    ],
    quiz: [
      {
        question: "A 32-year-old patient asks the nurse about cervical cancer prevention. The patient has never received HPV vaccination and has had normal Pap smears. Which response by the nurse is most appropriate?",
        options: [
          "You are too old for HPV vaccination, so continue Pap screening only",
          "HPV vaccination is recommended through age 45 and can still provide protection - discuss with your provider",
          "A normal Pap smear means you cannot develop cervical cancer",
          "Cervical cancer screening is only needed after age 40"
        ],
        correct: 1,
        rationale: "The Advisory Committee on Immunization Practices recommends HPV vaccination through age 45 via shared clinical decision-making for those not previously vaccinated. A normal Pap smear does not eliminate future risk. Screening guidelines recommend beginning at age 21, not 40."
      }
    ]
  },

  "prostate-cancer": {
    title: "Prostate Cancer",
    cellular: {
      title: "Pathophysiology of Prostate Cancer",
      content: "Prostate cancer is an adenocarcinoma arising from the glandular epithelial cells of the prostate, most commonly in the peripheral zone. The malignancy is androgen-dependent in early stages, with testosterone and dihydrotestosterone (DHT) driving tumor growth through androgen receptor signaling. The Gleason scoring system grades the histologic differentiation of the tumor on a scale of 6-10 (sum of two most prevalent patterns), with higher scores indicating poorly differentiated, aggressive disease. Prostate-specific antigen (PSA) is a serine protease produced by both normal and malignant prostate epithelium, and elevated levels may indicate cancer, though benign prostatic hyperplasia and prostatitis also raise PSA. The disease often follows an indolent course in older men but can metastasize to bones (osteoblastic lesions), lymph nodes, and lungs. Castration-resistant prostate cancer develops when the tumor progresses despite androgen deprivation, often through androgen receptor amplification or ligand-independent activation."
    },
    riskFactors: [
      "Age over 50 years (risk increases dramatically with age)",
      "African American descent (highest incidence and mortality rates)",
      "First-degree relative with prostate cancer (doubles risk)",
      "BRCA2 gene mutation carriers",
      "High-fat Western diet and obesity",
      "Agent Orange exposure (Vietnam veterans)",
      "Elevated testosterone levels or exogenous androgen use"
    ],
    diagnostics: [
      "Serum PSA level (age-adjusted thresholds, velocity, and density)",
      "Digital rectal examination (DRE) for palpable nodules or asymmetry",
      "Transrectal ultrasound-guided (TRUS) biopsy for histologic confirmation",
      "MRI of the prostate with PI-RADS scoring before biopsy",
      "Gleason score and Grade Group assignment from biopsy pathology",
      "Bone scan for skeletal metastasis in high-risk patients"
    ],
    management: [
      "Active surveillance for low-risk, localized disease (Gleason 6, low PSA)",
      "Radical prostatectomy (open or robotic-assisted) for localized disease",
      "External beam radiation therapy or brachytherapy",
      "Androgen deprivation therapy (ADT) with GnRH agonists or antagonists",
      "Chemotherapy (docetaxel) for castration-resistant disease",
      "Enzalutamide or abiraterone for advanced castration-resistant prostate cancer"
    ],
    nursingActions: [
      "Educate about PSA screening recommendations and shared decision-making",
      "Monitor for urinary retention and manage catheter care post-prostatectomy",
      "Assess for erectile dysfunction and provide counseling about treatment options",
      "Monitor for hot flashes and metabolic effects of androgen deprivation therapy",
      "Educate about pelvic floor (Kegel) exercises to improve post-prostatectomy incontinence",
      "Assess bone density and fall risk in patients on long-term ADT",
      "Monitor for signs of spinal cord compression in metastatic disease (back pain, weakness)"
    ],
    signs: {
      left: [
        "Urinary hesitancy, weak stream, and frequency (often late symptoms)",
        "Nocturia and incomplete bladder emptying",
        "Hard, irregular nodule on digital rectal examination",
        "Hematuria or hematospermia"
      ],
      right: [
        "Bone pain (especially lumbar spine and pelvis) from osteoblastic metastases",
        "Erectile dysfunction",
        "Lower extremity edema from lymphatic obstruction",
        "Weight loss and fatigue in advanced disease"
      ]
    },
    medications: [
      {
        name: "Leuprolide (Lupron)",
        type: "GnRH agonist (androgen deprivation therapy)",
        action: "Initially stimulates then downregulates pituitary GnRH receptors, causing sustained suppression of luteinizing hormone and testosterone production to castrate levels",
        sideEffects: "Hot flashes, erectile dysfunction, decreased libido, osteoporosis, metabolic syndrome, gynecomastia, tumor flare phenomenon at initiation",
        contra: "Known hypersensitivity, pregnancy, undiagnosed vaginal bleeding",
        pearl: "An antiandrogen (bicalutamide) should be given for 2-4 weeks before and after initial leuprolide injection to prevent tumor flare phenomenon - testosterone initially rises before suppression occurs"
      }
    ],
    pearls: [
      "PSA is organ-specific but not cancer-specific - benign prostatic hyperplasia, prostatitis, recent ejaculation, and DRE can all elevate PSA, so trends over time are more informative than single values",
      "Prostate cancer metastasizes to bone producing osteoblastic (sclerotic) lesions, unlike most other cancers that produce osteolytic lesions",
      "Tumor flare can occur in the first 2-4 weeks of GnRH agonist therapy as testosterone transiently rises - antiandrogen coverage prevents symptomatic worsening especially in patients with bone metastases"
    ],
    quiz: [
      {
        question: "A patient with metastatic prostate cancer is starting leuprolide therapy. The nurse should anticipate which order to administer concurrently for the first month?",
        options: [
          "Testosterone supplementation to prevent muscle wasting",
          "Bicalutamide (antiandrogen) to prevent tumor flare phenomenon",
          "Bisphosphonate infusion to immediately strengthen bones",
          "5-alpha reductase inhibitor to shrink the prostate"
        ],
        correct: 1,
        rationale: "GnRH agonists like leuprolide cause an initial surge in testosterone before suppression occurs (tumor flare). In patients with metastatic disease, this surge can worsen bone pain and potentially cause spinal cord compression. An antiandrogen such as bicalutamide is given concurrently for 2-4 weeks to block the effects of the testosterone flare."
      }
    ]
  },



  "kaposi-sarcoma": {
    title: "Kaposi Sarcoma",
    image: imgKaposiSarcoma,
    cellular: {
      title: "Pathophysiology of Kaposi Sarcoma",
      content: "Kaposi sarcoma (KS) is a vascular malignancy caused by human herpesvirus 8 (HHV-8, also known as Kaposi sarcoma-associated herpesvirus). HHV-8 infects endothelial cells and drives aberrant angiogenesis, creating characteristic spindle cell tumors composed of abnormal vascular channels. The virus encodes viral oncogenes that mimic cellular growth factors and anti-apoptotic proteins, promoting uncontrolled vascular proliferation. KS is most commonly associated with advanced HIV/AIDS (epidemic or AIDS-related KS) when CD4 counts fall below 200 cells per microliter. Other forms include classic KS (elderly Mediterranean men), endemic KS (sub-Saharan Africa), and iatrogenic KS (organ transplant recipients on immunosuppression). Lesions can involve skin, mucous membranes, lymph nodes, lungs, and the gastrointestinal tract. Immune reconstitution with antiretroviral therapy (ART) is the cornerstone of treatment for AIDS-related KS."
    },
    riskFactors: [
      "HIV/AIDS with CD4 count below 200 cells per microliter",
      "HHV-8 (human herpesvirus 8) infection",
      "Immunosuppression from organ transplant medications",
      "Mediterranean, Middle Eastern, or sub-Saharan African descent",
      "Male sex (strong male predominance)",
      "Men who have sex with men (higher HHV-8 seroprevalence)"
    ],
    diagnostics: [
      "Punch biopsy showing spindle cell proliferation with slit-like vascular spaces",
      "HHV-8 immunohistochemistry on biopsy tissue",
      "CD4 count and HIV viral load assessment",
      "Chest X-ray or CT for pulmonary involvement",
      "Upper and lower endoscopy for GI tract involvement",
      "Clinical staging based on tumor extent, immune status, and systemic illness"
    ],
    management: [
      "Initiation or optimization of antiretroviral therapy (ART) as primary treatment for AIDS-related KS",
      "Liposomal doxorubicin for advanced or visceral KS",
      "Local therapies for limited cutaneous disease (cryotherapy, intralesional vinblastine, radiation)",
      "Reduction of immunosuppression in transplant-related KS",
      "Paclitaxel for refractory disease"
    ],
    nursingActions: [
      "Reinforce adherence to antiretroviral therapy as the primary treatment for AIDS-related KS",
      "Assess skin and oral mucosa for new or progressing lesions at each visit",
      "Monitor respiratory status for pulmonary KS (cough, dyspnea, hemoptysis)",
      "Provide emotional support regarding visible skin lesions and body image concerns",
      "Monitor for GI bleeding if visceral involvement is suspected",
      "Educate about infection prevention given underlying immunosuppression",
      "Coordinate multidisciplinary care between oncology, infectious disease, and dermatology"
    ],
    signs: {
      left: [
        "Purple, red, or brown macules, papules, or nodules on skin",
        "Lesions on face, trunk, extremities, or oral mucosa",
        "Non-blanching, painless plaques that may coalesce",
        "Oral lesions on hard palate and gingiva"
      ],
      right: [
        "Lymphedema of the lower extremities (lymphatic obstruction)",
        "Dyspnea and cough from pulmonary involvement",
        "GI bleeding from visceral mucosal lesions",
        "Lesion progression correlating with declining immune function"
      ]
    },
    medications: [
      {
        name: "Liposomal Doxorubicin (Doxil)",
        type: "Pegylated liposomal anthracycline",
        action: "Liposomal encapsulation delivers doxorubicin preferentially to tumor vasculature, intercalating DNA and inhibiting topoisomerase II with reduced cardiotoxicity compared to conventional doxorubicin",
        sideEffects: "Hand-foot syndrome (palmar-plantar erythrodysesthesia), myelosuppression, infusion reactions, mucositis, cardiac toxicity (reduced but not eliminated)",
        contra: "Severe cardiac disease, hypersensitivity to doxorubicin or liposomal components",
        pearl: "Hand-foot syndrome is the most common dose-limiting toxicity - instruct patients to avoid friction, heat, and tight-fitting footwear and to report early tingling or redness of palms and soles"
      }
    ],
    pearls: [
      "AIDS-related KS treatment priority is immune reconstitution through effective ART - many lesions regress with CD4 count recovery alone",
      "Purple or violaceous non-blanching skin lesions in an immunosuppressed patient should raise immediate suspicion for Kaposi sarcoma",
      "Hard palate lesions are the most common oral manifestation - examine the oral cavity thoroughly in all HIV-positive patients"
    ],
    quiz: [
      {
        question: "A patient with AIDS presents with multiple purple, non-blanching nodules on the legs and hard palate. CD4 count is 85 cells per microliter. Which intervention is the priority for managing this patient's Kaposi sarcoma?",
        options: [
          "Immediate surgical excision of all visible lesions",
          "Initiation or optimization of antiretroviral therapy (ART)",
          "High-dose corticosteroid therapy to reduce lesion inflammation",
          "Topical antifungal cream applied to all skin lesions"
        ],
        correct: 1,
        rationale: "For AIDS-related Kaposi sarcoma, immune reconstitution through effective ART is the primary treatment. Restoring immune function (raising CD4 count and suppressing HIV viral load) often leads to regression of KS lesions. Systemic chemotherapy is added for rapidly progressive or visceral disease."
      }
    ]
  },

  "merkel-cell-carcinoma": {
    title: "Merkel Cell Carcinoma",
    cellular: {
      title: "Pathophysiology of Merkel Cell Carcinoma",
      content: "Merkel cell carcinoma (MCC) is a rare, aggressive neuroendocrine skin cancer arising from Merkel cells or their precursors in the basal layer of the epidermis. Merkel cell polyomavirus (MCPyV) is clonally integrated in approximately 80% of MCC tumors, with viral T antigens driving oncogenesis by inactivating p53 and Rb tumor suppressors. The remaining 20% of MCCs are virus-negative and associated with UV-induced mutations carrying high tumor mutational burden. MCC has a high propensity for local recurrence, regional lymph node metastasis, and distant spread. The 5-year survival for metastatic disease is approximately 14%. The tumor presents as a rapidly growing, painless, firm, dome-shaped nodule, often on sun-exposed areas of elderly or immunosuppressed individuals. The mnemonic AEIOU describes typical features: Asymptomatic, Expanding rapidly, Immunosuppression, Older than 50, UV-exposed site."
    },
    riskFactors: [
      "Age over 50 years (median age at diagnosis is 75-80)",
      "Chronic UV radiation exposure and fair skin",
      "Immunosuppression (organ transplant, HIV/AIDS, chronic lymphocytic leukemia)",
      "Merkel cell polyomavirus (MCPyV) infection",
      "Male sex",
      "History of other UV-related skin cancers"
    ],
    diagnostics: [
      "Skin biopsy with immunohistochemistry (CK20 positive in perinuclear dot pattern)",
      "Sentinel lymph node biopsy for staging (positive in approximately 30% at diagnosis)",
      "PET-CT or CT for systemic staging",
      "MCPyV serology for prognosis and surveillance monitoring"
    ],
    management: [
      "Wide local excision with 1-2 cm margins or Mohs surgery",
      "Sentinel lymph node biopsy for all clinically node-negative patients",
      "Adjuvant radiation to primary site and draining nodal basin",
      "Pembrolizumab or avelumab (PD-1/PD-L1 inhibitors) for advanced or metastatic MCC",
      "Multidisciplinary tumor board review due to rarity and complexity"
    ],
    nursingActions: [
      "Educate patient about the aggressive nature of MCC and importance of close surveillance",
      "Schedule frequent follow-up examinations (every 3 months for the first 2 years)",
      "Monitor for immune-related adverse events during checkpoint inhibitor therapy",
      "Assess for signs of recurrence at the primary site and regional lymph node basins",
      "Reinforce strict UV protection measures",
      "Provide psychosocial support and referral to social work for rare cancer diagnosis"
    ],
    signs: {
      left: [
        "Rapidly growing, firm, dome-shaped, painless nodule",
        "Red, pink, or violaceous color on sun-exposed skin",
        "Typically located on head, neck, or extremities",
        "Overlying skin appears shiny and may have telangiectasias"
      ],
      right: [
        "Tumor size often exceeds 2 cm at diagnosis due to painless, rapid growth",
        "Regional lymphadenopathy in up to 30% at presentation",
        "Tumor recurrence at or near the primary site",
        "Distant metastasis to liver, lung, bone, or brain"
      ]
    },
    medications: [
      {
        name: "Avelumab (Bavencio)",
        type: "PD-L1 immune checkpoint inhibitor",
        action: "Blocks PD-L1 on tumor cells from binding PD-1 on T cells, restoring anti-tumor immune response against Merkel cell carcinoma",
        sideEffects: "Immune-related adverse events (colitis, hepatitis, pneumonitis, thyroiditis, dermatitis), infusion reactions, fatigue",
        contra: "Active autoimmune disease requiring systemic immunosuppression, severe immune-related adverse event from prior checkpoint inhibitor therapy",
        pearl: "Monitor for immune-related adverse events at every visit - early recognition and treatment with corticosteroids is critical to prevent life-threatening complications such as immune-mediated colitis or pneumonitis"
      }
    ],
    pearls: [
      "AEIOU mnemonic for MCC: Asymptomatic, Expanding rapidly, Immunosuppression, Older than 50, UV-exposed site - if a nodule fits these criteria, biopsy promptly",
      "CK20-positive perinuclear dot pattern on immunohistochemistry is the hallmark diagnostic finding that distinguishes MCC from other small round blue cell tumors",
      "MCC has a higher mortality rate than melanoma stage-for-stage - early detection and aggressive multimodal treatment are critical"
    ],
    quiz: [
      {
        question: "An 80-year-old immunosuppressed patient presents with a rapidly growing, painless, dome-shaped red nodule on the forehead. Biopsy shows CK20-positive small round blue cells in a perinuclear dot pattern. Which diagnosis is most consistent?",
        options: [
          "Basal cell carcinoma",
          "Squamous cell carcinoma",
          "Merkel cell carcinoma",
          "Sebaceous cyst"
        ],
        correct: 2,
        rationale: "The rapidly growing, painless nodule in an elderly, immunosuppressed patient on a sun-exposed site, combined with CK20-positive perinuclear dot pattern on immunohistochemistry, is diagnostic of Merkel cell carcinoma. This fits the AEIOU mnemonic and the characteristic histologic pattern."
      }
    ]
  },

  "neuroblastoma": {
    title: "Neuroblastoma",
    cellular: {
      title: "Pathophysiology of Neuroblastoma",
      content: "Neuroblastoma is the most common extracranial solid tumor of childhood, arising from neural crest cells of the sympathetic nervous system. The tumor most frequently originates in the adrenal medulla (40%) but can develop anywhere along the sympathetic chain, including the retroperitoneum, posterior mediastinum, neck, and pelvis. Neuroblastoma cells produce catecholamines (dopamine, norepinephrine, epinephrine) and their metabolites (homovanillic acid, vanillylmandelic acid), which serve as tumor markers. The biologic behavior ranges from spontaneous regression (especially in infants with stage 4S disease) to aggressive, treatment-resistant malignancy. MYCN oncogene amplification is the most important adverse prognostic factor and is associated with rapid disease progression and poor outcomes. The International Neuroblastoma Staging System (INSS) classifies disease from localized (Stage 1) to metastatic (Stage 4), with the unique Stage 4S representing disseminated disease in infants that may regress spontaneously."
    },
    riskFactors: [
      "Age under 5 years (90% diagnosed before age 5, peak at 1-2 years)",
      "Familial neuroblastoma (rare, autosomal dominant ALK mutations)",
      "Beckwith-Wiedemann syndrome",
      "Hirschsprung disease (neural crest association)",
      "Turner syndrome",
      "Neurofibromatosis type 1"
    ],
    diagnostics: [
      "24-hour urine for catecholamine metabolites (HVA and VMA - elevated in 90% of cases)",
      "CT or MRI of primary tumor site and metastatic evaluation",
      "MIBG (metaiodobenzylguanidine) scan for tumor localization and staging",
      "Bone marrow biopsy for metastatic disease assessment",
      "Tumor biopsy with MYCN amplification testing and histology",
      "Serum LDH, ferritin, and neuron-specific enolase (NSE) as prognostic markers"
    ],
    management: [
      "Observation alone for stage 4S disease in infants (may spontaneously regress)",
      "Surgical resection for localized, low-risk disease",
      "Multiagent chemotherapy for intermediate and high-risk disease",
      "High-dose chemotherapy with autologous stem cell rescue for high-risk disease",
      "Anti-GD2 immunotherapy (dinutuximab) for high-risk maintenance",
      "Radiation therapy to primary tumor bed or metastatic sites"
    ],
    nursingActions: [
      "Monitor blood pressure for catecholamine-induced hypertension",
      "Assess abdominal girth and palpate gently for abdominal mass (avoid vigorous palpation)",
      "Collect 24-hour urine specimens accurately for catecholamine metabolite levels",
      "Provide age-appropriate explanations and play therapy for pediatric patients",
      "Monitor for tumor lysis syndrome during initial chemotherapy",
      "Support family coping with pediatric cancer diagnosis through psychosocial referrals",
      "Manage pain using age-appropriate assessment tools and interventions"
    ],
    signs: {
      left: [
        "Firm, non-tender abdominal mass crossing the midline",
        "Periorbital ecchymoses (raccoon eyes) from orbital metastasis",
        "Opsoclonus-myoclonus syndrome (dancing eyes, dancing feet)",
        "Hypertension and tachycardia from catecholamine secretion"
      ],
      right: [
        "Horner syndrome (ptosis, miosis, anhidrosis) from cervical or thoracic tumor",
        "Proptosis from orbital metastasis",
        "Subcutaneous bluish skin nodules in infants (blueberry muffin baby)",
        "Bone pain, limp, or irritability from skeletal metastasis"
      ]
    },
    medications: [
      {
        name: "Dinutuximab (Unituxin)",
        type: "Anti-GD2 monoclonal antibody",
        action: "Binds to GD2 ganglioside on neuroblastoma cell surface, triggering antibody-dependent cellular cytotoxicity and complement-dependent cytotoxicity to destroy tumor cells",
        sideEffects: "Severe neuropathic pain (most common, requires opioid infusion), capillary leak syndrome, hypersensitivity reactions, hyponatremia, infection risk",
        contra: "History of anaphylaxis to dinutuximab, active uncontrolled infection",
        pearl: "Severe pain during infusion is expected and managed with continuous morphine infusion started before and continued throughout treatment - premedicate with analgesics, antipyretics, and antihistamines"
      }
    ],
    pearls: [
      "Neuroblastoma classically presents as an abdominal mass that crosses the midline (unlike Wilms tumor which does not cross the midline) - this distinction is high-yield for exams",
      "Periorbital ecchymoses (raccoon eyes) in a young child without trauma history should raise suspicion for neuroblastoma with orbital metastasis",
      "Stage 4S neuroblastoma in infants under 12 months may spontaneously regress without treatment - this unique biologic behavior is not seen in older children"
    ],
    quiz: [
      {
        question: "A 2-year-old child presents with a firm abdominal mass that crosses the midline, periorbital bruising, and hypertension. Urine studies reveal elevated VMA and HVA levels. Which diagnosis is most likely?",
        options: [
          "Wilms tumor (nephroblastoma)",
          "Neuroblastoma",
          "Hepatoblastoma",
          "Rhabdomyosarcoma"
        ],
        correct: 1,
        rationale: "The key findings are an abdominal mass crossing the midline, periorbital ecchymoses (raccoon eyes), and elevated urinary catecholamine metabolites (VMA and HVA). Neuroblastoma arises from the adrenal medulla and secretes catecholamines. Wilms tumor is a renal tumor that does not cross the midline and does not produce catecholamines."
      }
    ]
  },

  "retinoblastoma": {
    title: "Retinoblastoma",
    cellular: {
      title: "Pathophysiology of Retinoblastoma",
      content: "Retinoblastoma is the most common intraocular malignancy of childhood, caused by inactivation of both alleles of the RB1 tumor suppressor gene on chromosome 13q14. The RB1 gene encodes the retinoblastoma protein (pRb), which normally regulates cell cycle progression at the G1-S checkpoint. Loss of functional pRb removes this critical cell cycle brake, allowing retinal precursor cells to proliferate uncontrollably. Retinoblastoma follows the Knudson two-hit hypothesis: hereditary cases (40%) inherit one mutated RB1 allele and require only one somatic mutation (earlier onset, often bilateral), while sporadic cases (60%) require two independent somatic mutations (later onset, unilateral). The hallmark presenting sign is leukocoria (white pupillary reflex or cat's eye reflex), which replaces the normal red reflex on examination. Without treatment, the tumor can extend through the optic nerve to the brain or metastasize hematogenously."
    },
    riskFactors: [
      "Family history of retinoblastoma (autosomal dominant inheritance with high penetrance)",
      "Germline RB1 gene mutation (present in all hereditary cases)",
      "Young age (90% diagnosed before age 3, average 18 months)",
      "Prior retinoblastoma in one eye (risk for bilateral disease in hereditary form)",
      "Survivors of hereditary retinoblastoma at increased risk for second primary cancers",
      "13q deletion syndrome"
    ],
    diagnostics: [
      "Ophthalmoscopic examination under anesthesia revealing white retinal mass",
      "Absent or white (leukocoria) pupillary reflex replacing normal red reflex",
      "Ocular ultrasound demonstrating intraocular calcifications",
      "MRI of orbits and brain (preferred over CT to avoid radiation in children)",
      "Genetic testing for RB1 germline mutation",
      "Lumbar puncture and bone marrow biopsy for metastatic evaluation in advanced disease"
    ],
    management: [
      "Enucleation (eye removal) for advanced unilateral disease with no vision salvage potential",
      "Intra-arterial chemotherapy (melphalan) for globe-salvaging treatment",
      "Systemic chemotherapy (vincristine, etoposide, carboplatin) for bilateral disease to preserve vision",
      "Focal therapies: cryotherapy, laser photocoagulation, thermotherapy for small tumors",
      "External beam radiation (reserved for refractory disease due to second cancer risk)",
      "Genetic counseling for family regarding inheritance and screening of siblings"
    ],
    nursingActions: [
      "Assess red reflex in pediatric patients during routine examinations",
      "Provide family education about the significance of leukocoria and strabismus as warning signs",
      "Prepare child and family for examination under anesthesia with age-appropriate explanations",
      "Post-enucleation care: teach prosthetic eye care, wound assessment, and follow-up schedule",
      "Support family coping with diagnosis and potential vision loss in their child",
      "Reinforce importance of genetic counseling and screening for siblings and future offspring",
      "Educate about lifelong cancer surveillance for hereditary retinoblastoma survivors"
    ],
    signs: {
      left: [
        "Leukocoria (white pupillary reflex or cat's eye reflex) - most common presenting sign",
        "Strabismus (eye misalignment) - second most common presentation",
        "Decreased visual acuity or apparent vision loss in one eye",
        "Orbital inflammation mimicking cellulitis in advanced disease"
      ],
      right: [
        "Pupil irregularity or asymmetry",
        "Glaucoma (elevated intraocular pressure) from tumor growth",
        "Hyphema (blood in anterior chamber)",
        "Proptosis in advanced extraocular extension"
      ]
    },
    medications: [
      {
        name: "Carboplatin",
        type: "Platinum-based alkylating-like antineoplastic",
        action: "Forms platinum-DNA adducts that cross-link DNA strands, inhibiting DNA replication and triggering apoptosis in rapidly dividing retinoblastoma cells",
        sideEffects: "Myelosuppression (especially thrombocytopenia), nephrotoxicity (less than cisplatin), ototoxicity, nausea, hypersensitivity reactions",
        contra: "Severe renal impairment, known hypersensitivity to platinum compounds, severe bone marrow suppression",
        pearl: "Dosing in pediatric patients is calculated using the Calvert formula based on GFR - monitor CBC closely as thrombocytopenia is the dose-limiting toxicity and may require platelet transfusion support"
      }
    ],
    pearls: [
      "Leukocoria (white pupillary reflex) is the hallmark presenting sign - any child with an abnormal or absent red reflex requires urgent ophthalmologic referral",
      "Retinoblastoma follows the Knudson two-hit hypothesis: hereditary cases need only one somatic hit (bilateral, early onset) while sporadic cases need two hits (unilateral, later onset)",
      "Hereditary retinoblastoma survivors have a significantly increased lifetime risk of second primary cancers (osteosarcoma, soft tissue sarcoma) - lifelong cancer surveillance is mandatory"
    ],
    quiz: [
      {
        question: "During a well-child visit, the nurse notices a white glow in the left pupil of a 14-month-old child instead of the normal red reflex. What is the most important initial nursing action?",
        options: [
          "Document the finding and discuss at the next scheduled visit",
          "Immediately refer for urgent ophthalmologic examination to evaluate for retinoblastoma",
          "Reassure the parent that this is a normal finding in infants",
          "Apply fluorescein stain to assess for corneal abrasion"
        ],
        correct: 1,
        rationale: "Leukocoria (white pupillary reflex) in a young child is the hallmark sign of retinoblastoma and constitutes an ophthalmologic emergency. Urgent referral for examination under anesthesia is required to confirm or rule out intraocular malignancy. Early detection significantly improves outcomes and potential for vision preservation."
      }
    ]
  },

  "radiation-therapy": {
    title: "Radiation Therapy Nursing Care",
    cellular: {
      title: "Principles and Effects of Radiation Therapy",
      content: "Radiation therapy uses ionizing radiation to damage DNA in rapidly dividing cancer cells, causing double-strand DNA breaks that trigger mitotic cell death. The therapeutic goal is to deliver maximum dose to the tumor while minimizing damage to surrounding normal tissues. Normal cells have more efficient DNA repair mechanisms than cancer cells, allowing fractional dosing schedules that favor normal tissue recovery between treatments. External beam radiation therapy (EBRT) delivers radiation from outside the body using a linear accelerator, while brachytherapy places a sealed radioactive source directly into or adjacent to the tumor. Radiation effects are classified as acute (occurring during or shortly after treatment, affecting rapidly dividing tissues like skin, mucosa, and bone marrow) and late (occurring months to years later, including fibrosis, secondary malignancies, and organ dysfunction). The skin reaction progression follows a predictable pattern from erythema to dry desquamation to moist desquamation."
    },
    riskFactors: [
      "Poor nutritional status before treatment initiation",
      "Concurrent chemotherapy (radiosensitizing agents increase tissue damage)",
      "Large treatment field size and high total radiation dose",
      "Treatment to areas with overlapping skin folds (axilla, groin, under breast)",
      "Pre-existing connective tissue disorders (scleroderma, lupus)",
      "Obesity (skin folds create friction and moisture trapping)",
      "Smoking (impairs tissue oxygenation and healing)",
      "Diabetes mellitus (impairs wound healing)"
    ],
    diagnostics: [
      "Baseline skin assessment before treatment with photographic documentation",
      "Weekly on-treatment skin assessments using standardized grading (CTCAE criteria)",
      "CBC monitoring for myelosuppression in large field radiation",
      "Nutritional assessment and weight monitoring throughout treatment",
      "Site-specific assessments (swallowing studies for head/neck, pulmonary function for thoracic)"
    ],
    management: [
      "Daily fractionation schedule (typically 5 days per week for 4-7 weeks)",
      "Skin care protocol: gentle cleansing, approved moisturizers, avoiding irritants",
      "Nutritional support and dietary counseling for treatment-related side effects",
      "Pain management for radiation dermatitis and mucositis",
      "Anti-diarrheal medications for pelvic radiation-induced enteritis"
    ],
    nursingActions: [
      "Do not wash off radiation treatment markings - they guide precise beam placement",
      "Apply only facility-approved creams or lotions to the treatment field (no petroleum-based products before treatment)",
      "Protect irradiated skin from sun exposure, temperature extremes, and friction",
      "Instruct patient to wear loose, soft, cotton clothing over treatment areas",
      "Monitor for signs of moist desquamation and report to radiation oncologist",
      "Assess nutritional intake and refer to dietitian for weight loss exceeding 5%",
      "Educate about expected side effects specific to the treatment site"
    ],
    signs: {
      left: [
        "Erythema (redness) of skin in the treatment field (first sign)",
        "Dry desquamation (flaking, peeling, itching skin)",
        "Moist desquamation (blistering, weeping, exposed dermis)",
        "Fatigue that typically worsens progressively during treatment"
      ],
      right: [
        "Mucositis (inflammation and ulceration of oral or esophageal mucosa)",
        "Dysphagia and odynophagia from esophageal mucositis",
        "Alopecia limited to the radiation field",
        "Diarrhea and abdominal cramping from pelvic radiation enteritis"
      ]
    },
    medications: [
      {
        name: "Amifostine (Ethyol)",
        type: "Cytoprotective agent (radioprotector)",
        action: "Converted by alkaline phosphatase to active metabolite (WR-1065) that scavenges free radicals and binds to alkylating agents, preferentially protecting normal tissues from radiation damage",
        sideEffects: "Hypotension (dose-limiting), nausea, vomiting, sneezing, flushing, metallic taste",
        contra: "Hypotension, dehydration, concurrent antihypertensive medication that cannot be held",
        pearl: "Administer with patient in supine position and monitor blood pressure every 5 minutes during infusion - hold antihypertensives for 24 hours before administration and pre-hydrate with normal saline"
      }
    ],
    pearls: [
      "Never remove radiation markings from the skin - these guide the linear accelerator to deliver radiation precisely to the tumor and protect surrounding tissues",
      "Skin reactions from radiation therapy follow a predictable progression: erythema then dry desquamation then moist desquamation - early intervention at each stage prevents worsening",
      "Radiation fatigue is cumulative and typically peaks 1-2 weeks after treatment completion before gradually improving - prepare patients for this timeline"
    ],
    quiz: [
      {
        question: "A patient receiving external beam radiation therapy to the chest asks the nurse about skin care for the treatment area. Which instruction is correct?",
        options: [
          "Apply petroleum jelly generously to the treatment field before each session",
          "Scrub the treatment area vigorously with antibacterial soap to prevent infection",
          "Wear loose, soft cotton clothing over the treatment area and avoid sun exposure",
          "Apply ice packs directly to the treatment field to reduce inflammation"
        ],
        correct: 2,
        rationale: "Irradiated skin is fragile and must be protected from friction, temperature extremes, and UV exposure. Loose, soft cotton clothing minimizes friction. Petroleum-based products before treatment can increase skin dose. Vigorous scrubbing damages fragile skin. Ice packs can cause tissue injury in irradiated areas."
      }
    ]
  },

  "tumor-classification": {
    title: "Tumor Classification and Nomenclature",
    cellular: {
      title: "Principles of Tumor Classification",
      content: "Tumor classification provides a standardized framework for categorizing neoplasms based on tissue of origin, biologic behavior, and extent of disease. Benign tumors are named by adding the suffix -oma to the tissue of origin (adenoma, fibroma, lipoma), while malignant tumors of epithelial origin are carcinomas and those of mesenchymal (connective tissue) origin are sarcomas. The TNM staging system, developed by the American Joint Committee on Cancer (AJCC), describes the anatomic extent of disease: T (tumor size and local invasion), N (regional lymph node involvement), and M (distant metastasis). Tumor grading (G1-G4) describes the degree of cellular differentiation, with G1 being well-differentiated (resembling normal tissue) and G4 being undifferentiated (anaplastic). Higher grade correlates with more aggressive behavior and poorer prognosis. Cancer staging combines TNM parameters into overall stages (I-IV), guiding treatment decisions and prognostic estimates."
    },
    riskFactors: [
      "Family history of hereditary cancer syndromes (Li-Fraumeni, Lynch, BRCA)",
      "Environmental carcinogen exposure (tobacco, asbestos, radiation, UV light)",
      "Chronic inflammation and tissue injury (Barrett esophagus, ulcerative colitis)",
      "Viral infections (HPV, EBV, HBV, HCV, HHV-8)",
      "Immunosuppression (transplant recipients, HIV/AIDS)",
      "Advancing age (cumulative genetic mutations over time)",
      "Obesity (associated with endometrial, breast, colon, and other cancers)"
    ],
    diagnostics: [
      "Histopathologic examination of biopsy specimen for definitive tissue diagnosis",
      "Immunohistochemistry to determine tissue of origin and receptor status",
      "Molecular and genetic testing for targetable mutations",
      "TNM staging with imaging (CT, MRI, PET-CT) and pathologic assessment",
      "Tumor markers: CEA (colorectal), AFP (liver, germ cell), CA-125 (ovarian), PSA (prostate)"
    ],
    management: [
      "Stage-appropriate multimodal treatment planning (surgery, chemotherapy, radiation)",
      "Multidisciplinary tumor board review for complex or rare cancers",
      "Surgical staging with sentinel lymph node biopsy or lymph node dissection",
      "Targeted therapy based on molecular profiling (HER2, EGFR, ALK, BRAF mutations)",
      "Clinical trial enrollment for advanced or refractory disease"
    ],
    nursingActions: [
      "Explain staging results in clear, understandable language to patients and families",
      "Coordinate multidisciplinary care between surgery, medical oncology, and radiation oncology",
      "Ensure pathology results include grade, stage, and molecular markers before treatment planning",
      "Educate about the difference between staging (extent of disease) and grading (aggressiveness)",
      "Document baseline functional status using validated performance scales (ECOG, Karnofsky)",
      "Facilitate informed consent by ensuring patient understands treatment rationale tied to staging"
    ],
    signs: {
      left: [
        "Benign tumors: well-circumscribed, encapsulated, slow-growing, no invasion",
        "Malignant tumors: irregular borders, invasive growth, rapid proliferation",
        "Low-grade (G1-G2): well-differentiated cells resembling tissue of origin",
        "Early-stage (I-II): localized disease, smaller tumor, no or limited nodal involvement"
      ],
      right: [
        "High-grade (G3-G4): poorly differentiated or undifferentiated (anaplastic) cells",
        "Advanced-stage (III-IV): large tumor, extensive nodal disease, distant metastasis",
        "Metastatic spread via lymphatic, hematogenous, or direct extension",
        "Paraneoplastic syndromes from ectopic hormone or antibody production"
      ]
    },
    medications: [
      {
        name: "No specific medication - Classification Framework",
        type: "Staging and Grading System",
        action: "TNM staging guides treatment intensity: Stage I may require surgery alone, Stage II-III may require multimodal therapy, Stage IV often requires systemic therapy with palliative intent",
        sideEffects: "N/A - the staging process itself carries minimal risk, though biopsy and imaging procedures have their own risk profiles",
        contra: "N/A",
        pearl: "Accurate staging is essential before initiating any cancer treatment - understaging may result in inadequate treatment while overstaging may expose patients to unnecessary toxicity"
      }
    ],
    pearls: [
      "Carcinomas arise from epithelial tissue (most common malignancy type), sarcomas arise from mesenchymal (connective) tissue - this naming convention is essential for classification",
      "TNM staging describes anatomic disease extent (T=tumor, N=nodes, M=metastasis) while grading describes cellular differentiation (G1=well differentiated to G4=undifferentiated)",
      "Staging is determined at diagnosis and does not change even if the disease progresses - restaging uses different terminology (recurrent, progressive, or refractory disease)"
    ],
    quiz: [
      {
        question: "A patient asks the nurse to explain the difference between cancer stage and grade. Which response demonstrates the best understanding?",
        options: [
          "Stage and grade are the same thing and describe how fast the cancer is growing",
          "Stage describes how far the cancer has spread in the body, while grade describes how abnormal the cancer cells look under a microscope",
          "Grade determines the type of cancer, and stage determines the treatment",
          "Stage is determined by blood tests, and grade is determined by imaging"
        ],
        correct: 1,
        rationale: "Stage (TNM system) describes the anatomic extent of disease - how large the tumor is, whether lymph nodes are involved, and whether the cancer has metastasized. Grade describes the histologic differentiation of tumor cells - how much they resemble normal tissue under the microscope. Both are determined by pathologic examination and imaging."
      }
    ]
  },

  "paraneoplastic-syndromes": {
    title: "Paraneoplastic Syndromes",
    cellular: {
      title: "Pathophysiology of Paraneoplastic Syndromes",
      content: "Paraneoplastic syndromes are clinical manifestations caused by substances produced by tumors (hormones, peptides, antibodies, cytokines) that act at sites distant from the primary tumor or its metastases. These syndromes affect 10-15% of cancer patients and may precede the cancer diagnosis by months to years. Ectopic hormone production is the most common mechanism: small cell lung cancer produces ACTH (causing Cushing syndrome) and ADH (causing SIADH); squamous cell lung cancer produces PTHrP (causing hypercalcemia of malignancy); and renal cell carcinoma produces erythropoietin (causing polycythemia). Autoimmune-mediated paraneoplastic syndromes occur when tumor antigens cross-react with normal tissues, particularly the nervous system (Lambert-Eaton myasthenic syndrome, cerebellar degeneration, limbic encephalitis). Recognizing paraneoplastic syndromes is critical because they may be the first clue to an underlying malignancy and can cause significant morbidity independent of the tumor itself."
    },
    riskFactors: [
      "Small cell lung cancer (most common cause of endocrine paraneoplastic syndromes)",
      "Squamous cell carcinoma of the lung (PTHrP-mediated hypercalcemia)",
      "Thymoma (associated with myasthenia gravis and pure red cell aplasia)",
      "Ovarian teratoma (anti-NMDA receptor encephalitis)",
      "Renal cell carcinoma (erythropoietin, PTHrP production)",
      "Hepatocellular carcinoma (erythropoietin, hypoglycemia)"
    ],
    diagnostics: [
      "Serum calcium, PTHrP, and intact PTH levels for hypercalcemia of malignancy",
      "24-hour urine cortisol and ACTH levels for ectopic Cushing syndrome",
      "Serum and urine osmolality for SIADH evaluation",
      "Anti-neuronal antibodies (anti-Hu, anti-Yo, anti-Ri) for neurologic syndromes",
      "CT chest and PET scan for occult malignancy identification",
      "Electromyography (EMG) for Lambert-Eaton myasthenic syndrome"
    ],
    management: [
      "Treatment of the underlying malignancy (primary intervention for syndrome resolution)",
      "Fluid restriction and vasopressin receptor antagonists (tolvaptan) for SIADH",
      "IV normal saline, bisphosphonates, and calcitonin for hypercalcemia of malignancy",
      "Ketoconazole or metyrapone for ectopic Cushing syndrome",
      "3,4-diaminopyridine for Lambert-Eaton myasthenic syndrome",
      "Plasmapheresis or IVIG for autoimmune-mediated neurologic syndromes"
    ],
    nursingActions: [
      "Monitor serum sodium closely in patients with SIADH (restrict fluids as ordered)",
      "Assess for signs of hypercalcemia: confusion, lethargy, constipation, polyuria, cardiac dysrhythmias",
      "Monitor neurologic status for changes in muscle strength, coordination, and cognition",
      "Maintain strict intake and output records and daily weights",
      "Administer IV saline aggressively for hypercalcemia (rehydration is first priority)",
      "Report new or worsening neurologic symptoms promptly as they may indicate paraneoplastic neurologic syndrome",
      "Educate patient that syndrome resolution depends on successful cancer treatment"
    ],
    signs: {
      left: [
        "SIADH: hyponatremia, concentrated urine, fluid retention, confusion, seizures",
        "Hypercalcemia: lethargy, confusion, nausea, constipation, polyuria, shortened QT",
        "Cushing syndrome: moon face, central obesity, hypertension, hyperglycemia, muscle wasting",
        "Polycythemia: ruddy complexion, headache, blurred vision, thrombotic risk"
      ],
      right: [
        "Lambert-Eaton syndrome: proximal muscle weakness that improves with repeated use",
        "Cerebellar degeneration: ataxia, dysarthria, nystagmus",
        "Dermatomyositis: heliotrope rash, Gottron papules, proximal muscle weakness",
        "Trousseau syndrome: migratory superficial thrombophlebitis"
      ]
    },
    medications: [
      {
        name: "Zoledronic Acid (Zometa)",
        type: "Bisphosphonate",
        action: "Inhibits osteoclast-mediated bone resorption, reducing calcium release from bone into the bloodstream in hypercalcemia of malignancy",
        sideEffects: "Osteonecrosis of the jaw (ONJ), nephrotoxicity, flu-like symptoms (acute phase reaction), hypocalcemia, atypical femoral fractures",
        contra: "Severe renal impairment (CrCl less than 35 mL/min), pregnancy, hypocalcemia",
        pearl: "Dental examination and any needed dental work should be completed before initiating bisphosphonate therapy to reduce risk of osteonecrosis of the jaw - ensure adequate renal function and hydration before each infusion"
      }
    ],
    pearls: [
      "Paraneoplastic syndromes may present before the cancer is diagnosed - new-onset SIADH, hypercalcemia, or unexplained neurologic symptoms in an adult should prompt malignancy workup",
      "Small cell lung cancer is the most common cause of ectopic ACTH (Cushing) and ectopic ADH (SIADH), while squamous cell lung cancer is the most common cause of PTHrP-mediated hypercalcemia",
      "Lambert-Eaton myasthenic syndrome differs from myasthenia gravis in that weakness improves with repeated muscle use (the opposite pattern) and is strongly associated with small cell lung cancer"
    ],
    quiz: [
      {
        question: "A patient with newly diagnosed small cell lung cancer develops confusion and a serum sodium of 118 mEq/L with concentrated urine. Which paraneoplastic syndrome should the nurse suspect?",
        options: [
          "Ectopic ACTH production causing Cushing syndrome",
          "Syndrome of inappropriate antidiuretic hormone (SIADH)",
          "PTHrP-mediated hypercalcemia of malignancy",
          "Lambert-Eaton myasthenic syndrome"
        ],
        correct: 1,
        rationale: "Severe hyponatremia with concentrated urine in a patient with small cell lung cancer is classic for SIADH, caused by ectopic ADH (vasopressin) secretion. The excess ADH causes water retention, dilutional hyponatremia, and inappropriately concentrated urine. Fluid restriction is the initial management."
      }
    ]
  },

  "treatment-of-cancer": {
    title: "Treatment of Cancer",
    cellular: {
      title: "Principles of Cancer Treatment",
      content: "Cancer treatment employs multiple modalities to eliminate malignant cells, prevent metastasis, and maintain quality of life. Chemotherapy exploits the rapid proliferation rate of cancer cells by targeting various phases of the cell cycle: alkylating agents cross-link DNA (cyclophosphamide), antimetabolites mimic normal substrates to disrupt DNA synthesis (methotrexate, 5-FU), vinca alkaloids inhibit mitotic spindle formation (vincristine), and taxanes stabilize microtubules preventing cell division (paclitaxel). The nadir, representing the lowest point of blood counts following chemotherapy, typically occurs 7-14 days after treatment and represents the period of greatest infection risk. Targeted therapies attack specific molecular alterations driving tumor growth (trastuzumab for HER2, imatinib for BCR-ABL). Immunotherapy harnesses the patient's immune system by blocking checkpoint proteins (PD-1, PD-L1, CTLA-4) that tumors exploit to evade immune detection. Hormonal therapy blocks hormone-driven tumor growth in breast and prostate cancers."
    },
    riskFactors: [
      "Pre-existing organ dysfunction (renal, hepatic, cardiac) increasing treatment toxicity risk",
      "Poor nutritional status and cachexia before treatment",
      "Advanced age and multiple comorbidities",
      "Prior chemotherapy or radiation exposure (cumulative toxicity)",
      "Bone marrow reserve depletion from disease infiltration",
      "Genetic polymorphisms affecting drug metabolism (DPD deficiency for 5-FU)",
      "Immunosuppression from disease or treatment"
    ],
    diagnostics: [
      "CBC with differential before each chemotherapy cycle (ensure adequate counts)",
      "Comprehensive metabolic panel including renal and hepatic function",
      "Echocardiogram or MUGA scan before anthracycline or trastuzumab therapy",
      "Tumor markers for treatment response monitoring (CEA, CA-125, PSA)",
      "PET-CT or CT scans at defined intervals to assess response (RECIST criteria)",
      "Molecular profiling for targeted therapy selection (EGFR, ALK, BRAF, PD-L1)"
    ],
    management: [
      "Combination chemotherapy regimens targeting multiple cell cycle phases",
      "Targeted therapy matched to tumor molecular profile",
      "Immune checkpoint inhibitors for tumors with high PD-L1 expression or microsatellite instability",
      "Colony-stimulating factors (filgrastim) for chemotherapy-induced neutropenia",
      "Antiemetic protocols (5-HT3 antagonists, NK1 antagonists, dexamethasone) for prevention of chemotherapy-induced nausea",
      "Dose modifications based on toxicity grading using CTCAE criteria"
    ],
    nursingActions: [
      "Verify chemotherapy orders against protocol using independent double-check before administration",
      "Administer vesicant chemotherapy through central venous access when possible",
      "Monitor for and immediately manage extravasation per institutional protocol",
      "Assess nadir timing and educate patient about neutropenic precautions",
      "Monitor for tumor lysis syndrome in initial treatment of bulky or rapidly growing tumors",
      "Educate about immune-related adverse events during checkpoint inhibitor therapy (colitis, pneumonitis, hepatitis, endocrinopathies)",
      "Implement oral cryotherapy (ice chips) during 5-FU bolus infusion to prevent mucositis"
    ],
    signs: {
      left: [
        "Myelosuppression: neutropenia (infection risk), thrombocytopenia (bleeding), anemia (fatigue)",
        "Nausea and vomiting (anticipatory, acute, and delayed patterns)",
        "Mucositis (oral ulceration, pain, difficulty swallowing)",
        "Alopecia (hair loss beginning 2-3 weeks after first cycle)"
      ],
      right: [
        "Extravasation: pain, swelling, erythema at IV site (vesicant emergency)",
        "Tumor lysis syndrome: hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia",
        "Peripheral neuropathy (numbness, tingling from vinca alkaloids, taxanes, platinum agents)",
        "Immune-related adverse events from checkpoint inhibitors (dermatitis, colitis, hepatitis)"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 receptor antagonist (antiemetic)",
        action: "Blocks serotonin receptors in the chemoreceptor trigger zone and vagal afferents, preventing chemotherapy-induced nausea and vomiting",
        sideEffects: "Headache, constipation, QT prolongation (use caution with other QT-prolonging drugs), dizziness",
        contra: "Congenital long QT syndrome, concurrent use of apomorphine, severe hepatic impairment",
        pearl: "Most effective when given 30 minutes before chemotherapy - for highly emetogenic regimens, combine with NK1 antagonist (aprepitant) and dexamethasone for optimal three-drug antiemetic prophylaxis"
      },
      {
        name: "Filgrastim (Neupogen)",
        type: "Granulocyte colony-stimulating factor (G-CSF)",
        action: "Stimulates neutrophil production, maturation, and release from bone marrow, reducing the depth and duration of chemotherapy-induced neutropenia",
        sideEffects: "Bone pain (most common), splenic rupture (rare), allergic reactions, leukocytosis",
        contra: "Known hypersensitivity to E. coli-derived proteins, concurrent chemotherapy or radiation (do not administer within 24 hours of chemotherapy)",
        pearl: "Typically started 24-72 hours after chemotherapy completion and continued until neutrophil recovery - do not administer on the same day as chemotherapy as it can increase bone marrow toxicity"
      }
    ],
    pearls: [
      "The nadir (lowest blood count) occurs 7-14 days after chemotherapy - this is when infection risk peaks and patients must practice strict neutropenic precautions (no raw foods, no crowds, no rectal temperatures)",
      "Vesicant chemotherapy agents (doxorubicin, vincristine, vinblastine) cause tissue necrosis if extravasated - stop infusion immediately, aspirate residual drug, and administer specific antidote per protocol",
      "Tumor lysis syndrome is an oncologic emergency - ensure adequate hydration and allopurinol or rasburicase before initiating treatment for highly proliferative tumors"
    ],
    quiz: [
      {
        question: "A patient receiving doxorubicin via a peripheral IV reports sudden burning pain at the insertion site. The nurse notes swelling and erythema around the IV. What is the priority nursing action?",
        options: [
          "Increase the IV flow rate to dilute the medication",
          "Stop the infusion immediately and aspirate residual drug from the catheter",
          "Apply warm compresses and continue the infusion at a slower rate",
          "Remove the IV and restart at a more proximal site on the same vein"
        ],
        correct: 1,
        rationale: "Burning pain, swelling, and erythema at the IV site during vesicant chemotherapy indicate extravasation. The priority is to stop the infusion immediately and aspirate residual drug to minimize tissue exposure. Doxorubicin is a vesicant that causes severe tissue necrosis - the specific antidote (dexrazoxane) should be administered per protocol."
      }
    ]
  },

  "esophageal-cancer": {
    title: "Esophageal Cancer",
    cellular: {
      title: "Pathophysiology of Esophageal Cancer",
      content: "Esophageal cancer presents as two distinct histologic types with different risk profiles and anatomic predilections. Squamous cell carcinoma arises from the squamous epithelium of the upper and middle esophagus, strongly associated with tobacco and alcohol use. Adenocarcinoma arises from metaplastic columnar epithelium (Barrett esophagus) in the distal esophagus and gastroesophageal junction, associated with chronic gastroesophageal reflux disease (GERD). Barrett esophagus represents intestinal metaplasia of the distal esophageal squamous epithelium, progressing through low-grade dysplasia to high-grade dysplasia to invasive adenocarcinoma. The esophagus lacks a serosal layer, facilitating early transmural invasion and lymphatic spread. The rich submucosal lymphatic network enables extensive longitudinal and circumferential spread. Progressive dysphagia (initially to solids, then to liquids) is the hallmark symptom, typically indicating a tumor that already obstructs more than 60% of the esophageal lumen."
    },
    riskFactors: [
      "Chronic GERD and Barrett esophagus (adenocarcinoma)",
      "Tobacco use and heavy alcohol consumption (synergistic for squamous cell type)",
      "Obesity (increases GERD risk and promotes adenocarcinoma)",
      "Achalasia (esophageal motility disorder increasing stasis)",
      "Caustic injury or stricture history",
      "Hot beverage consumption (thermal injury to esophageal mucosa)",
      "Plummer-Vinson syndrome (iron deficiency with esophageal webs)",
      "Tylosis (hereditary palmar and plantar keratoderma)"
    ],
    diagnostics: [
      "Esophagogastroduodenoscopy (EGD) with biopsy for histologic diagnosis",
      "Endoscopic ultrasound (EUS) for T and N staging (depth of invasion and nodal assessment)",
      "CT of chest and abdomen for metastatic evaluation",
      "PET-CT for systemic staging and treatment planning",
      "Barium swallow showing irregular narrowing or filling defect"
    ],
    management: [
      "Esophagectomy for localized, resectable disease",
      "Neoadjuvant chemoradiation (CROSS regimen) before surgery for locally advanced disease",
      "Definitive chemoradiation for unresectable tumors or medically inoperable patients",
      "Endoscopic mucosal resection for superficial early-stage cancers",
      "Esophageal stenting for malignant dysphagia palliation",
      "Nutritional support via enteral feeding (jejunostomy tube) during treatment"
    ],
    nursingActions: [
      "Assess swallowing ability and modify diet texture per speech pathology recommendations",
      "Monitor nutritional status, weight, and albumin levels throughout treatment",
      "Manage enteral feeding tube care and educate patient/family on tube feeding technique",
      "Position patient upright during and 30 minutes after meals to prevent aspiration",
      "Monitor for anastomotic leak postoperatively (fever, tachycardia, chest pain, pleural effusion)",
      "Educate about dumping syndrome after esophagectomy (eat small, frequent meals; avoid concentrated sweets)"
    ],
    signs: {
      left: [
        "Progressive dysphagia (solids first, then liquids)",
        "Unintentional weight loss (often significant at presentation)",
        "Odynophagia (pain with swallowing)",
        "Substernal or epigastric pain"
      ],
      right: [
        "Regurgitation of undigested food",
        "Chronic cough or aspiration pneumonia",
        "Hoarseness from recurrent laryngeal nerve involvement",
        "Iron deficiency anemia from chronic occult blood loss"
      ]
    },
    medications: [
      {
        name: "Carboplatin/Paclitaxel (with concurrent radiation - CROSS regimen)",
        type: "Platinum-based combination chemotherapy with radiosensitization",
        action: "Carboplatin cross-links DNA while paclitaxel stabilizes microtubules, preventing cell division - both act as radiosensitizers enhancing radiation-induced tumor cell kill",
        sideEffects: "Myelosuppression, peripheral neuropathy, nausea, alopecia, esophagitis worsening during radiation, fatigue",
        contra: "Severe myelosuppression, severe peripheral neuropathy, hypersensitivity to platinum or taxane compounds",
        pearl: "The CROSS neoadjuvant chemoradiation regimen followed by surgery has become standard of care for locally advanced esophageal cancer - monitor for worsening dysphagia during treatment as radiation esophagitis may require temporary enteral feeding"
      }
    ],
    pearls: [
      "Progressive dysphagia (solids to liquids) is the hallmark symptom and usually indicates the tumor already obstructs more than 60% of the esophageal lumen - early-stage disease is often asymptomatic",
      "Barrett esophagus is the precursor to esophageal adenocarcinoma - patients with GERD symptoms lasting more than 5 years should be considered for endoscopic screening",
      "After esophagectomy, the gastric conduit has no sphincter mechanism - patients must remain upright after eating and sleep with the head of bed elevated to prevent reflux and aspiration"
    ],
    quiz: [
      {
        question: "A patient with a 10-year history of GERD presents with progressive difficulty swallowing solid foods and a 20-pound weight loss. Which diagnostic test is the priority?",
        options: [
          "Barium swallow for initial screening",
          "Esophagogastroduodenoscopy (EGD) with biopsy for tissue diagnosis",
          "Chest X-ray to evaluate for aspiration pneumonia",
          "CT of the abdomen for liver metastases"
        ],
        correct: 1,
        rationale: "Progressive dysphagia and significant weight loss in a patient with chronic GERD raises high suspicion for esophageal adenocarcinoma arising from Barrett esophagus. EGD with biopsy provides direct visualization and tissue for histologic diagnosis, which is the priority for definitive diagnosis and treatment planning."
      }
    ]
  },

  "stomach-cancer": {
    title: "Stomach Cancer",
    cellular: {
      title: "Pathophysiology of Stomach (Gastric) Cancer",
      content: "Gastric cancer most commonly presents as adenocarcinoma (90-95%) arising from the glandular epithelium of the stomach mucosa. Helicobacter pylori infection is classified as a Group 1 carcinogen by the WHO, causing chronic gastritis that progresses through atrophic gastritis, intestinal metaplasia, dysplasia, and ultimately invasive carcinoma (the Correa cascade). The intestinal type is well-differentiated with gland formation and is associated with H. pylori and dietary factors, while the diffuse type is poorly differentiated with signet ring cells infiltrating the gastric wall (linitis plastica or leather bottle stomach). Gastric cancer spreads by direct extension to adjacent organs, lymphatic dissemination to regional nodes (Virchow node in the left supraclavicular fossa), peritoneal seeding (Krukenberg tumor to ovaries), and hematogenous spread to liver and lungs. Early gastric cancer confined to the mucosa or submucosa has excellent prognosis, but most cases are diagnosed at advanced stages."
    },
    riskFactors: [
      "Helicobacter pylori infection (strongest modifiable risk factor)",
      "Chronic atrophic gastritis and intestinal metaplasia",
      "Diet high in smoked, salted, or preserved foods and low in fruits and vegetables",
      "Cigarette smoking",
      "Family history of gastric cancer or hereditary diffuse gastric cancer (CDH1 mutation)",
      "Blood type A (slightly increased risk for diffuse type)",
      "Prior partial gastrectomy (gastric stump cancer after 15-20 years)",
      "Pernicious anemia (autoimmune atrophic gastritis)"
    ],
    diagnostics: [
      "Esophagogastroduodenoscopy (EGD) with multiple biopsies for histologic diagnosis",
      "H. pylori testing (urea breath test, stool antigen, or biopsy-based testing)",
      "CT of chest, abdomen, and pelvis for staging",
      "Endoscopic ultrasound (EUS) for T and N staging of the primary tumor",
      "PET-CT for detection of distant metastasis",
      "Diagnostic laparoscopy for peritoneal assessment before surgical planning"
    ],
    management: [
      "Surgical resection (subtotal or total gastrectomy) with D2 lymphadenectomy",
      "Perioperative chemotherapy (FLOT regimen: fluorouracil, leucovorin, oxaliplatin, docetaxel)",
      "Adjuvant chemoradiation for node-positive disease after surgery",
      "H. pylori eradication in early gastric cancer and MALT lymphoma",
      "Trastuzumab for HER2-positive metastatic gastric cancer",
      "Palliative gastric outlet stenting or surgical bypass for obstruction"
    ],
    nursingActions: [
      "Monitor for dumping syndrome after gastrectomy (eat small, frequent, high-protein meals; avoid sweets and fluids with meals)",
      "Administer vitamin B12 injections lifelong after total gastrectomy (loss of intrinsic factor)",
      "Monitor for anastomotic leak signs (fever, tachycardia, abdominal rigidity, peritonitis)",
      "Assess nutritional status and caloric intake - involve dietitian for post-gastrectomy diet planning",
      "Manage nasogastric tube output and ensure patency (do not irrigate or reposition without orders)",
      "Monitor for signs of iron and calcium malabsorption after gastrectomy"
    ],
    signs: {
      left: [
        "Vague epigastric discomfort and early satiety",
        "Unintentional weight loss and anorexia",
        "Nausea and vomiting (may indicate gastric outlet obstruction)",
        "Dysphagia if tumor involves gastroesophageal junction"
      ],
      right: [
        "Iron deficiency anemia from chronic occult GI blood loss",
        "Virchow node (left supraclavicular lymphadenopathy) indicating metastasis",
        "Sister Mary Joseph nodule (periumbilical mass from peritoneal metastasis)",
        "Ascites and Blumer shelf (palpable rectal mass from peritoneal seeding)"
      ]
    },
    medications: [
      {
        name: "Fluorouracil (5-FU)",
        type: "Antimetabolite (pyrimidine analog)",
        action: "Inhibits thymidylate synthase, blocking conversion of deoxyuridine monophosphate to deoxythymidine monophosphate, thereby disrupting DNA synthesis in rapidly dividing cells",
        sideEffects: "Mucositis, diarrhea, myelosuppression, hand-foot syndrome, coronary vasospasm (rare), alopecia",
        contra: "DPD (dihydropyrimidine dehydrogenase) deficiency (risk of fatal toxicity), pregnancy, severe bone marrow suppression",
        pearl: "DPD deficiency testing before initiating 5-FU is increasingly recommended as patients with this enzyme deficiency cannot metabolize the drug normally and may develop fatal myelosuppression and mucositis"
      }
    ],
    pearls: [
      "Alarm symptoms requiring urgent EGD: unintentional weight loss, dysphagia, persistent vomiting, GI bleeding, iron deficiency anemia, or new epigastric mass in a patient over 55",
      "Virchow node (left supraclavicular lymphadenopathy) is a classic sign of metastatic gastric cancer and should prompt abdominal imaging and endoscopy",
      "After total gastrectomy, patients require lifelong B12 injections because intrinsic factor (produced by gastric parietal cells) is essential for B12 absorption in the terminal ileum"
    ],
    quiz: [
      {
        question: "A nurse is providing discharge teaching to a patient after total gastrectomy for gastric cancer. Which instruction is most important for preventing a nutritional deficiency?",
        options: [
          "Take oral vitamin B12 supplements daily with meals",
          "Receive intramuscular vitamin B12 injections for life",
          "Increase dietary intake of dairy products for calcium absorption",
          "Take iron supplements only if symptoms of anemia develop"
        ],
        correct: 1,
        rationale: "After total gastrectomy, intrinsic factor (produced by gastric parietal cells) is no longer available. Without intrinsic factor, vitamin B12 cannot be absorbed in the terminal ileum regardless of oral intake. Lifelong intramuscular B12 injections are mandatory to prevent megaloblastic anemia and neurologic damage."
      }
    ]
  },

  "colorectal-cancer": {
    title: "Colorectal Cancer",
    cellular: {
      title: "Pathophysiology of Colorectal Cancer",
      content: "Colorectal cancer (CRC) develops through a well-characterized adenoma-to-carcinoma sequence over 10-15 years. Mutations accumulate in key oncogenes and tumor suppressor genes: APC gene inactivation initiates adenoma formation, KRAS oncogene activation promotes growth, and TP53 loss enables malignant transformation. Most CRC arises from adenomatous polyps (particularly villous adenomas with greater than 1 cm diameter). Lynch syndrome (hereditary nonpolyposis colorectal cancer, HNPCC) accounts for 3-5% of CRC due to mismatch repair gene mutations causing microsatellite instability. Familial adenomatous polyposis (FAP) involves germline APC mutations causing hundreds to thousands of colonic polyps with near-100% cancer risk by age 40 without prophylactic colectomy. Carcinoembryonic antigen (CEA) is a tumor marker used for monitoring treatment response and detecting recurrence but is not reliable for screening. Right-sided tumors tend to present with iron deficiency anemia and occult bleeding, while left-sided tumors present with obstructive symptoms and visible bleeding."
    },
    riskFactors: [
      "Age over 45 years (average-risk screening begins at 45)",
      "Personal history of adenomatous polyps or previous CRC",
      "First-degree relative with CRC (doubles lifetime risk)",
      "Lynch syndrome (HNPCC) or familial adenomatous polyposis (FAP)",
      "Inflammatory bowel disease (ulcerative colitis or Crohn colitis) of 8+ years duration",
      "Western diet high in red and processed meats, low in fiber",
      "Obesity, physical inactivity, and heavy alcohol consumption",
      "Type 2 diabetes mellitus and insulin resistance"
    ],
    diagnostics: [
      "Colonoscopy with polypectomy and biopsy (gold standard for diagnosis and screening)",
      "Fecal immunochemical test (FIT) for annual non-invasive screening",
      "CT colonography (virtual colonoscopy) as screening alternative",
      "CEA level at baseline and serially for monitoring treatment response and recurrence",
      "CT of chest, abdomen, and pelvis for staging",
      "Microsatellite instability (MSI) and mismatch repair (MMR) testing for Lynch syndrome and immunotherapy eligibility"
    ],
    management: [
      "Surgical resection with adequate margins and regional lymph node dissection (minimum 12 nodes)",
      "Adjuvant FOLFOX chemotherapy (5-FU, leucovorin, oxaliplatin) for stage III disease",
      "Neoadjuvant chemoradiation for locally advanced rectal cancer",
      "Total neoadjuvant therapy (TNT) for rectal cancer",
      "Checkpoint inhibitors (pembrolizumab) for MSI-high or dMMR tumors",
      "Hepatic metastasectomy for resectable liver metastases"
    ],
    nursingActions: [
      "Educate about age-appropriate CRC screening guidelines and encourage compliance",
      "Provide pre-colonoscopy bowel preparation instructions and ensure completion",
      "Assess stoma viability, output, and peristomal skin integrity for patients with colostomy",
      "Teach ostomy care: appliance changes, skin protection, dietary modifications",
      "Monitor for signs of anastomotic leak after surgical resection (fever, tachycardia, peritonitis)",
      "Educate about peripheral neuropathy from oxaliplatin (cold sensitivity is characteristic)",
      "Monitor CEA levels serially to detect recurrence during surveillance"
    ],
    signs: {
      left: [
        "Right-sided tumor: iron deficiency anemia, fatigue, occult blood in stool",
        "Left-sided tumor: change in bowel habits, narrow stools, visible rectal bleeding",
        "Rectal tumor: tenesmus, hematochezia, incomplete evacuation",
        "Unintentional weight loss and decreased appetite"
      ],
      right: [
        "Abdominal mass palpable in right lower quadrant (cecal tumors)",
        "Bowel obstruction symptoms: distension, cramping, vomiting, absence of flatus",
        "Perforation with peritonitis (surgical emergency)",
        "Elevated CEA level (useful for monitoring, not screening)"
      ]
    },
    medications: [
      {
        name: "Oxaliplatin (Eloxatin)",
        type: "Platinum-based alkylating-like antineoplastic",
        action: "Forms platinum-DNA adducts causing DNA cross-links that inhibit DNA replication and transcription, leading to apoptosis of rapidly dividing colorectal cancer cells",
        sideEffects: "Acute cold-induced peripheral neuropathy (unique to oxaliplatin), cumulative sensory neuropathy, myelosuppression, nausea, hepatotoxicity",
        contra: "Pre-existing severe peripheral neuropathy, known platinum hypersensitivity, pregnancy",
        pearl: "Cold-induced peripheral neuropathy is a hallmark side effect - instruct patients to avoid cold drinks, cold foods, and cold air exposure during and for several days after infusion, as it triggers acute dysesthesias of the hands, feet, and perioral area"
      }
    ],
    pearls: [
      "Right-sided colon cancers present with iron deficiency anemia and occult bleeding (stool is still liquid in the right colon), while left-sided cancers present with obstruction and visible rectal bleeding (stool is formed in the left colon)",
      "CEA is not useful for screening (too many false positives) but is essential for monitoring treatment response and detecting recurrence after curative resection",
      "The adenoma-to-carcinoma sequence takes 10-15 years - regular colonoscopy with polypectomy effectively prevents CRC by removing precancerous polyps before malignant transformation"
    ],
    quiz: [
      {
        question: "A 55-year-old patient is found to have iron deficiency anemia and positive fecal occult blood testing. Colonoscopy reveals a large mass in the ascending colon. Which finding is most consistent with this tumor location?",
        options: [
          "Ribbon-like stools and visible rectal bleeding",
          "Occult blood loss leading to iron deficiency anemia without obstructive symptoms",
          "Acute bowel obstruction with absent bowel sounds",
          "Tenesmus and mucus in the stool"
        ],
        correct: 1,
        rationale: "Right-sided colon tumors (cecum and ascending colon) present with occult blood loss and iron deficiency anemia rather than obstructive symptoms because stool is still liquid in the right colon and the lumen is wider. Left-sided tumors cause obstructive symptoms and visible bleeding because stool is formed and the lumen is narrower."
      }
    ]
  },

  "bladder-tumors": {
    title: "Bladder Tumors",
    cellular: {
      title: "Pathophysiology of Bladder Tumors",
      content: "Bladder cancer predominantly arises from the urothelial (transitional cell) epithelium lining the bladder, accounting for over 90% of cases. Urothelial carcinoma is classified as non-muscle-invasive (confined to the mucosa or lamina propria, stages Ta, T1, CIS) or muscle-invasive (invading the detrusor muscle, stages T2-T4). Carcinoma in situ (CIS) is a flat, high-grade lesion with significant progression risk to muscle-invasive disease. Chemical carcinogens concentrated in urine cause chronic urothelial DNA damage, explaining the strong associations with smoking, occupational chemical exposure (aromatic amines, aniline dyes), and cyclophosphamide. The hallmark presenting symptom is painless gross hematuria. Intravesical Bacillus Calmette-Guerin (BCG) immunotherapy is the gold standard for high-risk non-muscle-invasive disease, stimulating a local immune response against residual tumor cells. Radical cystectomy with urinary diversion is the standard treatment for muscle-invasive disease."
    },
    riskFactors: [
      "Cigarette smoking (strongest risk factor, accounts for 50% of cases)",
      "Occupational exposure to aromatic amines (rubber, dye, textile, leather industries)",
      "Prior cyclophosphamide or ifosfamide chemotherapy",
      "Pelvic radiation therapy",
      "Chronic bladder inflammation (recurrent UTIs, indwelling catheters, Schistosoma haematobium)",
      "Male sex (3-4 times more common in men)",
      "Age over 55 years",
      "Arsenic in drinking water"
    ],
    diagnostics: [
      "Cystoscopy with biopsy and transurethral resection of bladder tumor (TURBT)",
      "Urine cytology for high-grade urothelial cells",
      "CT urogram to evaluate the upper urinary tract for synchronous tumors",
      "Bimanual examination under anesthesia to assess tumor fixation",
      "PET-CT or CT of chest, abdomen, and pelvis for staging of muscle-invasive disease"
    ],
    management: [
      "Transurethral resection of bladder tumor (TURBT) for diagnosis and treatment of non-muscle-invasive disease",
      "Intravesical BCG immunotherapy for high-risk non-muscle-invasive bladder cancer (CIS, high-grade Ta/T1)",
      "Radical cystectomy with pelvic lymphadenectomy for muscle-invasive disease",
      "Neoadjuvant cisplatin-based chemotherapy before radical cystectomy",
      "Urinary diversion: ileal conduit (Bricker), continent cutaneous diversion, or orthotopic neobladder",
      "Checkpoint immunotherapy (pembrolizumab, atezolizumab) for metastatic urothelial carcinoma"
    ],
    nursingActions: [
      "Monitor urine output color and character post-TURBT (expect hematuria that should progressively clear)",
      "Manage continuous bladder irrigation (CBI) to prevent clot formation and catheter obstruction",
      "Instruct patient to hold intravesical BCG instillation for 2 hours and rotate position every 15 minutes",
      "Teach urostomy care: appliance management, skin protection, adequate fluid intake",
      "Educate about importance of cystoscopy surveillance every 3 months in the first 2 years",
      "Reinforce smoking cessation as the most important modifiable risk factor"
    ],
    signs: {
      left: [
        "Painless gross hematuria (most common presenting symptom)",
        "Irritative voiding symptoms: frequency, urgency, dysuria",
        "Microscopic hematuria on urinalysis",
        "Recurrent urinary tract infections resistant to standard treatment"
      ],
      right: [
        "Flank pain from ureteral obstruction in advanced disease",
        "Pelvic pain or pressure from large or invasive tumors",
        "Lower extremity edema from lymphatic or venous obstruction",
        "Weight loss and constitutional symptoms in metastatic disease"
      ]
    },
    medications: [
      {
        name: "BCG (Bacillus Calmette-Guerin) intravesical",
        type: "Immunotherapy (live attenuated mycobacterium)",
        action: "Instilled into the bladder, BCG triggers a robust local immune response involving T-lymphocytes and cytokines that destroy residual urothelial cancer cells and prevent recurrence",
        sideEffects: "Bladder irritation (dysuria, frequency, urgency), flu-like symptoms, hematuria, BCG sepsis (rare but life-threatening), granulomatous prostatitis",
        contra: "Active urinary tract infection, traumatic catheterization (risk of systemic BCG absorption), immunosuppression, gross hematuria",
        pearl: "BCG must not be instilled if traumatic catheterization occurred - wait at least 2 weeks after TURBT and ensure no active UTI before administration to prevent systemic BCG infection, which can be fatal"
      }
    ],
    pearls: [
      "Painless gross hematuria in any adult requires urologic evaluation with cystoscopy to rule out bladder cancer - never assume it is caused by a UTI without proper workup",
      "BCG immunotherapy is the most effective intravesical treatment for high-risk non-muscle-invasive bladder cancer - it is a live vaccine and must never be given to immunosuppressed patients or with traumatic catheterization",
      "Bladder cancer has the highest recurrence rate of any solid tumor - lifelong cystoscopic surveillance is required, typically every 3 months for the first 2 years then at increasing intervals"
    ],
    quiz: [
      {
        question: "A patient is scheduled for intravesical BCG instillation for non-muscle-invasive bladder cancer. The nurse notes difficulty advancing the catheter during insertion with mild bleeding. What is the appropriate nursing action?",
        options: [
          "Proceed with the BCG instillation as scheduled",
          "Withhold BCG and notify the provider due to traumatic catheterization risk",
          "Reduce the BCG dose by half and instill slowly",
          "Flush the catheter with saline and proceed with instillation"
        ],
        correct: 1,
        rationale: "Traumatic catheterization (difficulty advancing with bleeding) creates a risk for systemic BCG absorption, which can cause life-threatening BCG sepsis. The instillation must be withheld and the provider notified. BCG should only be instilled through an atraumatic catheterization with no active bleeding or UTI."
      }
    ]
  },

  "kidney-tumors": {
    title: "Kidney Tumors",
    cellular: {
      title: "Pathophysiology of Renal Cell Carcinoma",
      content: "Renal cell carcinoma (RCC) is the most common malignant kidney tumor in adults, arising from the renal tubular epithelium. Clear cell RCC (75-80%) is the most common subtype and is strongly associated with loss of the VHL (von Hippel-Lindau) tumor suppressor gene on chromosome 3p, which normally regulates hypoxia-inducible factor (HIF). Loss of VHL leads to constitutive HIF activation, driving overexpression of VEGF, PDGF, and other angiogenic factors that promote the characteristically hypervascular nature of RCC. The classic triad of flank pain, hematuria, and palpable flank mass is present in only 10% of patients at diagnosis but indicates locally advanced disease. RCC is known as the internist's tumor due to its numerous paraneoplastic manifestations, including polycythemia (erythropoietin), hypercalcemia (PTHrP), and hepatic dysfunction without metastasis (Stauffer syndrome). RCC is resistant to conventional chemotherapy and radiation, but targeted therapies (VEGF pathway inhibitors, mTOR inhibitors) and immune checkpoint inhibitors have transformed management."
    },
    riskFactors: [
      "Cigarette smoking (strongest modifiable risk factor)",
      "Obesity (excess body fat linked to hormonal and metabolic changes)",
      "Hypertension and long-term antihypertensive use",
      "Von Hippel-Lindau (VHL) syndrome (autosomal dominant, bilateral RCC)",
      "Acquired cystic kidney disease (patients on long-term dialysis)",
      "Family history of renal cell carcinoma",
      "Male sex (2:1 male-to-female ratio)",
      "Occupational exposure to cadmium, asbestos, or trichloroethylene"
    ],
    diagnostics: [
      "CT abdomen with and without contrast (most important imaging study - hypervascular enhancing renal mass)",
      "MRI for characterizing complex cystic lesions or when CT is contraindicated",
      "Chest CT for pulmonary metastasis evaluation",
      "Renal biopsy only when diagnosis is uncertain or for small masses in surgical candidates",
      "Bone scan if bone pain or elevated alkaline phosphatase",
      "Metabolic panel for hypercalcemia and liver function assessment"
    ],
    management: [
      "Partial nephrectomy (nephron-sparing surgery) for T1a tumors (less than 4 cm)",
      "Radical nephrectomy with regional lymphadenectomy for larger or locally advanced tumors",
      "Active surveillance for small renal masses (less than 2 cm) in elderly or comorbid patients",
      "Targeted therapy: sunitinib, pazopanib (VEGF-TKI) for advanced RCC",
      "Immune checkpoint combination: nivolumab plus ipilimumab for intermediate/poor-risk metastatic RCC",
      "Cytoreductive nephrectomy followed by systemic therapy for selected metastatic patients"
    ],
    nursingActions: [
      "Monitor for hemorrhage after nephrectomy (flank pain, tachycardia, hypotension, decreasing Hgb)",
      "Assess remaining kidney function: urine output, serum creatinine, BUN",
      "Position patient on the non-operative side or supine to avoid pressure on the surgical site",
      "Maintain adequate hydration to support remaining kidney function",
      "Monitor for adrenal insufficiency if ipsilateral adrenalectomy was performed",
      "Educate about protecting the remaining kidney (avoid nephrotoxic medications, contact sports)",
      "Assess for paraneoplastic syndrome resolution following nephrectomy"
    ],
    signs: {
      left: [
        "Painless gross hematuria (most common presenting symptom)",
        "Flank pain (dull, persistent ache)",
        "Palpable flank or abdominal mass",
        "Classic triad: hematuria, flank pain, palpable mass (only 10% at diagnosis)"
      ],
      right: [
        "Varicocele (especially left-sided, from renal vein or IVC tumor thrombus)",
        "Polycythemia from ectopic erythropoietin production",
        "Hypercalcemia from PTHrP secretion",
        "Stauffer syndrome (hepatic dysfunction without liver metastasis)"
      ]
    },
    medications: [
      {
        name: "Sunitinib (Sutent)",
        type: "Multi-targeted receptor tyrosine kinase inhibitor (VEGFR/PDGFR-TKI)",
        action: "Inhibits VEGF and PDGF receptors, blocking tumor angiogenesis and proliferation in clear cell RCC by targeting the overactive VEGF pathway resulting from VHL gene loss",
        sideEffects: "Hypertension, hand-foot syndrome, diarrhea, fatigue, hypothyroidism, cardiac dysfunction, myelosuppression, yellow skin discoloration",
        contra: "Uncontrolled hypertension, recent cardiovascular events, pregnancy",
        pearl: "Monitor blood pressure at every visit as hypertension occurs in up to 47% of patients - paradoxically, developing treatment-induced hypertension is associated with better tumor response and may be a biomarker of drug activity"
      }
    ],
    pearls: [
      "RCC is known as the internist's tumor because of its diverse paraneoplastic manifestations - polycythemia, hypercalcemia, hypertension, and Stauffer syndrome can all be the presenting feature",
      "A new left-sided varicocele in a male that does not reduce when supine should raise suspicion for left renal vein obstruction by a renal mass or tumor thrombus",
      "RCC is resistant to traditional chemotherapy and radiation - targeted therapies (VEGF inhibitors) and immune checkpoint inhibitors are the mainstays of systemic treatment for advanced disease"
    ],
    quiz: [
      {
        question: "A patient presents with gross hematuria, left flank pain, and a newly developed left varicocele that does not decompress when lying down. CT reveals a large left renal mass. Which diagnosis is most likely?",
        options: [
          "Renal angiomyolipoma",
          "Renal cell carcinoma with left renal vein involvement",
          "Simple renal cyst",
          "Acute pyelonephritis"
        ],
        correct: 1,
        rationale: "The triad of hematuria, flank pain, and a palpable mass combined with a left varicocele that fails to decompress in the supine position strongly suggests RCC with left renal vein involvement. The tumor thrombus obstructs the left gonadal vein (which drains into the left renal vein), causing the non-reducible varicocele."
      }
    ]
  },

  "penile-cancer": {
    title: "Penile Cancer",
    cellular: {
      title: "Pathophysiology of Penile Cancer",
      content: "Penile cancer is a rare malignancy, predominantly squamous cell carcinoma (95%), arising from the epithelium of the glans, prepuce (foreskin), or shaft of the penis. Human papillomavirus (HPV), particularly types 16 and 18, is implicated in approximately 50% of cases, with HPV oncoproteins E6 and E7 driving malignant transformation by inactivating p53 and Rb tumor suppressors. Chronic inflammation from phimosis (inability to retract the foreskin), poor hygiene, and smegma accumulation creates a microenvironment that promotes carcinogenesis. The tumor grows locally through the tunica albuginea, corpus spongiosum, and corpora cavernosa, then spreads via lymphatic channels to inguinal lymph nodes (superficial then deep) and subsequently to pelvic lymph nodes. Neonatal circumcision virtually eliminates the risk of penile cancer, while adult circumcision does not provide the same protection."
    },
    riskFactors: [
      "Phimosis (inability to retract foreskin) and poor penile hygiene",
      "HPV infection (types 16 and 18)",
      "Lack of neonatal circumcision",
      "Cigarette smoking",
      "Lichen sclerosus (chronic inflammatory dermatosis of the genitalia)",
      "Penile intraepithelial neoplasia (precancerous lesion)",
      "Age over 60 years",
      "Immunosuppression (HIV infection)"
    ],
    diagnostics: [
      "Punch or incisional biopsy of the penile lesion for histologic diagnosis",
      "Physical examination of inguinal lymph nodes bilaterally",
      "MRI of the penis to assess depth of invasion into corporal structures",
      "CT or PET-CT of pelvis and abdomen for nodal and distant staging",
      "Sentinel lymph node biopsy for clinically node-negative patients with invasive disease",
      "HPV testing on tumor tissue"
    ],
    management: [
      "Organ-sparing surgery (glansectomy, wide local excision) for small, distal tumors",
      "Partial or total penectomy with adequate margins for larger or invasive tumors",
      "Inguinal lymph node dissection for node-positive disease",
      "Neoadjuvant chemotherapy (TIP regimen: paclitaxel, ifosfamide, cisplatin) for bulky nodal disease",
      "Radiation therapy as alternative for select early-stage cases desiring organ preservation",
      "HPV vaccination for primary prevention"
    ],
    nursingActions: [
      "Provide sensitive, nonjudgmental communication about diagnosis and treatment options",
      "Assess psychosexual impact and refer to urology, psychology, or sexual health counseling",
      "Monitor surgical site for bleeding, infection, and urinary retention postoperatively",
      "Teach perineal wound care and catheter management after penectomy",
      "Monitor for lymphedema of lower extremities after inguinal lymph node dissection",
      "Educate about HPV vaccination for prevention in unvaccinated individuals"
    ],
    signs: {
      left: [
        "Painless, firm penile mass or ulcer that fails to heal",
        "Erythematous, velvety plaque on the glans (erythroplasia of Queyrat)",
        "Foul-smelling discharge from under the foreskin",
        "Phimosis that develops in a previously normal foreskin"
      ],
      right: [
        "Palpable inguinal lymphadenopathy (may be inflammatory or metastatic)",
        "Bleeding from the penile lesion",
        "Pain in advanced locally invasive disease",
        "Urinary stream changes from urethral involvement"
      ]
    },
    medications: [
      {
        name: "Cisplatin (in TIP combination regimen)",
        type: "Platinum-based alkylating-like antineoplastic",
        action: "Cross-links DNA strands preventing replication and triggering apoptosis in squamous cell carcinoma cells, used in combination with paclitaxel and ifosfamide for advanced penile cancer",
        sideEffects: "Nephrotoxicity, ototoxicity, severe nausea, peripheral neuropathy, myelosuppression, electrolyte wasting",
        contra: "Severe renal impairment, pre-existing hearing loss, severe myelosuppression",
        pearl: "Aggressive hydration with normal saline before and after cisplatin infusion is mandatory to prevent nephrotoxicity - monitor serum creatinine and electrolytes (especially magnesium and potassium) closely during each cycle"
      }
    ],
    pearls: [
      "Neonatal circumcision is nearly 100% protective against penile cancer - this is one of the strongest associations between a surgical procedure and cancer prevention",
      "Any non-healing penile lesion or ulcer lasting more than 4 weeks requires biopsy to rule out malignancy, especially in uncircumcised men with phimosis",
      "Inguinal lymphadenopathy at presentation may be reactive (infection) or metastatic - a course of antibiotics followed by reassessment helps distinguish the two before proceeding with lymph node dissection"
    ],
    quiz: [
      {
        question: "A 65-year-old uncircumcised man presents with a non-healing ulcer on the glans penis for 3 months and bilateral palpable inguinal lymph nodes. Which is the most important initial diagnostic step?",
        options: [
          "Prescribe a course of antibiotics and recheck in 6 weeks",
          "Perform a biopsy of the penile lesion for histologic diagnosis",
          "Order a PSA level to evaluate for prostate cancer",
          "Apply topical corticosteroid cream and monitor"
        ],
        correct: 1,
        rationale: "A non-healing penile ulcer in an uncircumcised elderly man requires biopsy for histologic diagnosis to rule out squamous cell carcinoma. While inguinal lymphadenopathy may be reactive, the primary lesion must be biopsied first to establish the diagnosis. Antibiotics alone would delay cancer diagnosis."
      }
    ]
  },

  "male-breast-cancer": {
    title: "Male Breast Cancer",
    cellular: {
      title: "Pathophysiology of Male Breast Cancer",
      content: "Male breast cancer is a rare malignancy accounting for approximately 1% of all breast cancers and less than 1% of all male cancers. The most common histologic type is invasive ductal carcinoma (over 90%), with lobular carcinoma being extremely rare in men due to minimal lobular development. Male breast cancer has a higher rate of hormone receptor positivity compared to female breast cancer, with over 90% being ER-positive and 80% being PR-positive. BRCA2 gene mutations confer the strongest genetic risk, increasing male lifetime breast cancer risk to approximately 6-8% (compared to 0.1% in the general male population). Klinefelter syndrome (47,XXY) is the strongest known risk factor due to hyperestrogenism from testicular dysfunction. Because men have minimal breast tissue and the tumor arises close to the nipple and chest wall, male breast cancer is often diagnosed at a more advanced stage with earlier chest wall invasion and nipple involvement."
    },
    riskFactors: [
      "BRCA2 gene mutation (strongest genetic risk factor for male breast cancer)",
      "Klinefelter syndrome (47,XXY karyotype with hyperestrogenism)",
      "Age over 60 years (median age at diagnosis is 67)",
      "Family history of breast cancer (male or female relatives)",
      "Conditions causing hyperestrogenism: cirrhosis, obesity, exogenous estrogen",
      "Testicular disorders (undescended testes, orchitis, prior orchiectomy)",
      "Prior chest wall radiation exposure",
      "Gynecomastia (marker of hyperestrogenism but not a direct cause)"
    ],
    diagnostics: [
      "Clinical breast examination identifying subareolar mass",
      "Diagnostic mammography and ultrasound of the breast",
      "Core needle biopsy for histologic diagnosis and receptor testing (ER, PR, HER2)",
      "BRCA mutation testing (especially BRCA2) for all male breast cancer patients",
      "Staging workup: CT chest/abdomen, bone scan for advanced disease",
      "Sentinel lymph node biopsy for axillary staging"
    ],
    management: [
      "Modified radical mastectomy (standard surgical treatment due to limited breast tissue)",
      "Sentinel lymph node biopsy with axillary dissection if positive",
      "Adjuvant tamoxifen for 5 years (first-line hormonal therapy for ER-positive disease)",
      "Adjuvant chemotherapy based on stage and tumor biology",
      "Radiation therapy to chest wall for locally advanced disease",
      "Genetic counseling and BRCA testing for patient and family members"
    ],
    nursingActions: [
      "Acknowledge and validate the emotional impact of a diagnosis often perceived as a female disease",
      "Educate that male breast cancer is a real disease requiring the same aggressive treatment as female breast cancer",
      "Reinforce importance of BRCA2 testing and genetic counseling for the patient and family members",
      "Monitor for tamoxifen side effects: hot flashes, DVT risk, mood changes, decreased libido",
      "Assess surgical wound and drain management after mastectomy",
      "Connect patient with male breast cancer support resources and peer networks",
      "Screen for depression and anxiety associated with stigma and body image concerns"
    ],
    signs: {
      left: [
        "Painless, firm subareolar breast mass (most common presentation)",
        "Nipple retraction or inversion",
        "Bloody or serous nipple discharge",
        "Skin changes: dimpling, ulceration, or Paget disease of the nipple"
      ],
      right: [
        "Axillary lymphadenopathy (often palpable at diagnosis due to thin breast tissue)",
        "Fixation of mass to chest wall or skin (earlier involvement than in women)",
        "Gynecomastia (may coexist but is a separate finding)",
        "Advanced presentation due to delayed diagnosis and low awareness"
      ]
    },
    medications: [
      {
        name: "Tamoxifen",
        type: "Selective estrogen receptor modulator (SERM)",
        action: "Competitively blocks estrogen receptors on ER-positive male breast cancer cells, inhibiting estrogen-driven tumor growth - the standard first-line hormonal therapy for male breast cancer",
        sideEffects: "Hot flashes, decreased libido, erectile dysfunction, thromboembolic events (DVT, PE), weight gain, mood changes",
        contra: "History of DVT or PE, concurrent anticoagulation with warfarin (requires close monitoring), known hypersensitivity",
        pearl: "Aromatase inhibitors are less effective in men than in women because the hypothalamic-pituitary feedback loop compensates for peripheral estrogen reduction by increasing gonadotropin secretion - if used, they must be combined with a GnRH agonist"
      }
    ],
    pearls: [
      "All men diagnosed with breast cancer should be tested for BRCA mutations (especially BRCA2) - a positive result has implications for cancer surveillance and for genetic counseling of family members",
      "Male breast cancer is almost always ER-positive (over 90%), making tamoxifen the cornerstone of adjuvant hormonal therapy - aromatase inhibitors alone are not effective in men",
      "Men often present at more advanced stages because of low awareness and delayed medical attention for breast symptoms - any subareolar mass or nipple change in a male should be promptly evaluated"
    ],
    quiz: [
      {
        question: "A 68-year-old man is diagnosed with ER-positive invasive ductal carcinoma of the breast. Which adjuvant hormonal therapy should the nurse anticipate?",
        options: [
          "Anastrozole (aromatase inhibitor) alone",
          "Tamoxifen for 5 years",
          "Leuprolide (GnRH agonist) alone",
          "Raloxifene for chemoprevention"
        ],
        correct: 1,
        rationale: "Tamoxifen is the standard first-line adjuvant hormonal therapy for ER-positive male breast cancer. Aromatase inhibitors alone are not effective in men because the pituitary compensates for decreased peripheral estrogen by increasing gonadotropin secretion, which stimulates the testes to produce more androgens. Tamoxifen directly blocks the estrogen receptor."
      }
    ]
  },

  "cervical-cancer-basics-rpn": {
    title: "Cervical Cancer Basics",
    cellular: {
      title: "Cervical Cancer",
      content: "Cervical cancer develops from abnormal cell changes in the cervix, most commonly in the transformation zone where squamous and columnar epithelium meet. Persistent infection with high-risk human papillomavirus (HPV) types, especially HPV 16 and 18, is the primary cause. The virus integrates into host cell DNA and produces oncoproteins E6 and E7 that inactivate tumor suppressor proteins, allowing uncontrolled cell growth. Cervical cancer progresses through precancerous stages (cervical intraepithelial neoplasia CIN 1, 2, 3) before becoming invasive, making screening and early detection critical for prevention."
    },
    riskFactors: [
      "Persistent high-risk HPV infection (types 16 and 18 cause approximately 70% of cases)",
      "Lack of HPV vaccination",
      "Smoking (doubles the risk of cervical cancer)",
      "Immunosuppression (HIV, organ transplant recipients)",
      "Multiple sexual partners or early onset of sexual activity",
      "History of sexually transmitted infections (chlamydia, herpes)",
      "Prolonged oral contraceptive use (greater than 5 years)",
      "Lack of regular Pap screening"
    ],
    diagnostics: [
      "Pap smear (cervical cytology) for screening - report abnormal results to RN or provider",
      "HPV co-testing with Pap smear as ordered",
      "Report any abnormal vaginal bleeding (postcoital, intermenstrual, postmenopausal)",
      "Observe and document any unusual vaginal discharge (watery, blood-tinged, malodorous)",
      "Monitor vital signs before and after any cervical procedures"
    ],
    management: [
      "Encourage completion of HPV vaccination series (ages 9-26, catch-up through age 45)",
      "Reinforce Pap screening schedule as recommended by provider",
      "Assist with post-procedure care following colposcopy or cervical biopsy",
      "Apply ice packs and provide comfort measures as ordered after cervical procedures",
      "Educate patient to avoid intercourse, tampons, and douching for specified period after procedures",
      "Report heavy bleeding, fever, or foul-smelling discharge after procedures immediately"
    ],
    nursingActions: [
      "Educate patients on the importance of regular Pap screening",
      "Provide HPV vaccination education and address vaccine hesitancy",
      "Report abnormal vaginal bleeding patterns to the nurse or provider",
      "Monitor for signs of cervical cancer: postcoital bleeding, watery or blood-tinged discharge, pelvic pain",
      "Assist with patient positioning during cervical examinations",
      "Provide emotional support and reassurance during screening and diagnostic procedures",
      "Document and report any abnormal findings from cervical examination"
    ],
    signs: {
      left: [
        "Abnormal vaginal bleeding (postcoital, intermenstrual, or postmenopausal)",
        "Watery, blood-tinged, or malodorous vaginal discharge",
        "Pelvic pain or pressure (may indicate advanced disease)",
        "Abnormal Pap smear results"
      ],
      right: [
        "Leg edema or pain (may indicate lymph node involvement)",
        "Flank pain or hydronephrosis symptoms (advanced disease)",
        "Fatigue and unintended weight loss",
        "Dyspareunia (pain during intercourse)"
      ]
    },
    medications: [
      {
        name: "HPV Vaccine (Gardasil 9)",
        type: "Recombinant vaccine",
        action: "Provides immunity against 9 HPV types including high-risk types 16 and 18, preventing HPV-related cervical, anal, oropharyngeal, and genital cancers",
        sideEffects: "Injection site pain, redness, swelling, headache, syncope (especially in adolescents - observe for 15 minutes after administration)",
        contra: "Severe allergic reaction to a previous dose or vaccine component, pregnancy (defer until after delivery)",
        pearl: "Most effective when administered before HPV exposure - recommended at ages 11-12 with catch-up vaccination through age 26 and shared clinical decision-making for ages 27-45"
      }
    ],
    pearls: [
      "HPV vaccination is the most effective primary prevention strategy for cervical cancer - strongly encourage completion of the vaccine series",
      "Abnormal vaginal bleeding, especially postcoital bleeding, is the most common early warning sign of cervical cancer and should always be reported",
      "Pap screening detects precancerous changes years before invasive cancer develops - emphasize adherence to screening recommendations"
    ],
    quiz: [
      {
        question: "A 28-year-old patient asks about cervical cancer prevention. Which response by the nurse is most appropriate?",
        options: [
          "Cervical cancer cannot be prevented, only treated once diagnosed",
          "HPV vaccination and regular Pap screening are the most effective prevention strategies",
          "Annual pelvic examinations replace the need for Pap smears",
          "Only patients with a family history of cervical cancer need screening"
        ],
        correct: 1,
        rationale: "HPV vaccination prevents infection with the high-risk HPV types that cause approximately 70% of cervical cancers, and regular Pap screening detects precancerous changes that can be treated before progressing to invasive cancer. Together, these are the most effective prevention strategies."
      }
    ]
  },

  "cervical-cancer-screening-np": {
    title: "Cervical Cancer Screening",
    cellular: {
      title: "Molecular Pathogenesis of Cervical Cancer",
      content: "Cervical carcinogenesis is driven by persistent infection with high-risk HPV genotypes, predominantly HPV 16 and 18, which account for approximately 70% of invasive cervical cancers. Upon integration into the host genome, the viral oncoproteins E6 and E7 exert their transformative effects through distinct molecular mechanisms. E6 binds to the E6-associated protein (E6AP), a ubiquitin ligase, forming a complex that targets the p53 tumor suppressor protein for proteasomal degradation, abolishing p53-mediated cell cycle arrest and apoptosis. E7 binds and destabilizes retinoblastoma protein (pRb), releasing E2F transcription factors that drive uncontrolled S-phase entry and DNA replication. The combined loss of p53 and pRb function creates genomic instability, accumulation of secondary mutations, and progressive neoplastic transformation through CIN grades. The tumor microenvironment undergoes immunoediting, with HPV-infected cells evading immune clearance through downregulation of MHC class I molecules, secretion of immunosuppressive cytokines (IL-10, TGF-beta), and recruitment of regulatory T cells. Squamous cell carcinoma accounts for approximately 70% of invasive cervical cancers, while adenocarcinoma (arising from endocervical glandular epithelium) accounts for approximately 25% and is increasing in incidence due to relative insensitivity to cytologic screening. Lymphovascular space invasion (LVSI) is a critical histopathologic prognostic factor predicting lymph node metastasis and disease recurrence."
    },
    riskFactors: [
      "Persistent high-risk HPV infection (HPV 16 confers highest risk for squamous cell carcinoma; HPV 18 for adenocarcinoma)",
      "Immunosuppression (HIV-positive women have 6-fold increased risk; CD4 count inversely correlates with CIN progression)",
      "Smoking (nitrosamines concentrate in cervical mucus and cause direct DNA damage; synergistic carcinogenic effect with HPV)",
      "High parity (3 or more full-term pregnancies increases risk through hormonal and mechanical cervical trauma mechanisms)",
      "Long-term combined oral contraceptive use (greater than 5 years; estrogen promotes viral gene expression in HPV-infected cells)",
      "Co-infection with Chlamydia trachomatis (chronic inflammation facilitates HPV persistence and integration)",
      "DES exposure in utero (increased risk of clear cell adenocarcinoma of the cervix and vagina)",
      "MTHFR polymorphisms affecting folate metabolism (impaired DNA methylation and repair)"
    ],
    diagnostics: [
      "Reflex HPV genotyping for HPV 16/18 on abnormal cytology (ASC-US or higher) to stratify immediate colposcopy need",
      "Colposcopy with directed biopsy using 3-5% acetic acid application (acetowhite epithelium indicates dysplasia) and Lugol iodine (Schiller test - non-staining areas indicate abnormal glycogen-depleted cells)",
      "Endocervical curettage (ECC) during colposcopy when transformation zone is not fully visualized or cytology suggests glandular abnormality",
      "FIGO staging with MRI pelvis (preferred for local staging - tumor size, parametrial invasion, lymph node assessment) and PET-CT for distant metastasis evaluation",
      "Sentinel lymph node mapping with indocyanine green or technetium-99m for surgical staging in early-stage disease",
      "Serum SCC antigen as tumor marker for squamous cell carcinoma (elevated levels correlate with stage and recurrence risk)"
    ],
    management: [
      "ASCCP risk-based management algorithms: immediate colposcopy for HPV 16/18-positive or HSIL cytology; 1-year surveillance for HPV-positive/cytology-negative with non-16/18 genotypes",
      "LEEP (loop electrosurgical excision procedure) or cold knife conization for CIN 2/3 with positive margins requiring re-excision or close surveillance based on reproductive goals",
      "Radical hysterectomy (Type C) with pelvic lymphadenectomy for FIGO stage IA2-IB1 (tumor less than 4 cm without lymphovascular invasion)",
      "Concurrent chemoradiation (cisplatin-based) with external beam radiation and brachytherapy for stage IB3 and above (cisplatin acts as radiosensitizer through inhibition of DNA repair mechanisms)",
      "Bevacizumab (anti-VEGF) added to cisplatin-paclitaxel for recurrent or metastatic cervical cancer (targets tumor angiogenesis)",
      "Pembrolizumab (anti-PD-1 checkpoint inhibitor) for PD-L1-positive recurrent or metastatic cervical cancer after first-line chemotherapy failure (restores T-cell-mediated antitumor immunity)"
    ],
    nursingActions: [
      "Interpret and counsel on HPV genotype-specific risk using ASCCP management guidelines",
      "Perform colposcopic examination and directed biopsies per institutional credentialing and scope of practice",
      "Prescribe and manage pre-procedure anxiolytics and post-procedure analgesics for cervical procedures",
      "Order and interpret follow-up HPV testing and cytology per ASCCP surveillance protocols",
      "Coordinate multidisciplinary care including gynecologic oncology referral for invasive disease",
      "Manage cisplatin-related toxicities: nephrotoxicity (aggressive hydration, monitor creatinine), ototoxicity (baseline audiometry), neurotoxicity (peripheral neuropathy assessment), severe nausea (5-HT3 antagonist plus NK1 antagonist antiemetic regimen)",
      "Counsel on fertility preservation options (oocyte or embryo cryopreservation) before definitive treatment for reproductive-age patients"
    ],
    signs: {
      left: [
        "Postcoital bleeding (most common early symptom of invasive cervical cancer)",
        "Irregular intermenstrual or postmenopausal vaginal bleeding",
        "Serosanguineous or malodorous vaginal discharge (indicative of tumor necrosis)",
        "Cervical mass visible on speculum examination (exophytic, ulcerative, or barrel-shaped)"
      ],
      right: [
        "Pelvic sidewall pain radiating to lower extremity (sciatic nerve involvement indicates parametrial extension)",
        "Unilateral leg edema (lymphatic obstruction from pelvic lymph node metastasis)",
        "Hydronephrosis and flank pain (ureteral obstruction from parametrial disease - Stage IIIB by FIGO)",
        "Vesicovaginal or rectovaginal fistula (advanced local disease or post-radiation complication)"
      ]
    },
    medications: [
      {
        name: "Cisplatin",
        type: "Platinum-based alkylating-like antineoplastic",
        action: "Forms platinum-DNA adducts that create intrastrand and interstrand cross-links, inhibiting DNA replication and transcription and triggering apoptosis. Acts as a radiosensitizer by inhibiting DNA damage repair pathways (homologous recombination and non-homologous end joining), potentiating radiation-induced cell death in concurrent chemoradiation protocols",
        sideEffects: "Dose-limiting nephrotoxicity (proximal tubular damage), severe nausea and vomiting (highly emetogenic - requires triple antiemetic prophylaxis), ototoxicity (irreversible high-frequency sensorineural hearing loss), peripheral sensory neuropathy, myelosuppression, electrolyte wasting (hypomagnesemia, hypokalemia)",
        contra: "Pre-existing renal impairment (creatinine clearance less than 60 mL/min requires dose modification), pre-existing hearing loss, severe myelosuppression, pregnancy",
        pearl: "Aggressive pre- and post-hydration with normal saline (1-2 L) and mannitol-induced diuresis are essential to prevent cisplatin nephrotoxicity. Monitor magnesium levels closely as cisplatin causes renal magnesium wasting that may persist for months after treatment completion."
      },
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 immune checkpoint inhibitor",
        action: "Blocks the programmed death-1 (PD-1) receptor on T lymphocytes, preventing engagement with PD-L1 ligand expressed on tumor cells. This restores T-cell-mediated cytotoxic activity against HPV-transformed cervical cancer cells that have evaded immune surveillance through PD-L1 overexpression",
        sideEffects: "Immune-related adverse events: pneumonitis, colitis, hepatitis, thyroiditis (hypothyroidism or hyperthyroidism), adrenal insufficiency, type 1 diabetes mellitus, myocarditis (rare but potentially fatal), skin toxicity (rash, pruritus, vitiligo)",
        contra: "Active autoimmune disease requiring systemic immunosuppression, organ transplant recipients, severe immune-related adverse event from prior checkpoint inhibitor therapy",
        pearl: "PD-L1 combined positive score (CPS) of 1 or greater is required for pembrolizumab eligibility in cervical cancer. Monitor thyroid function (TSH) every 6 weeks and educate patients to report new-onset diarrhea, cough, or fatigue immediately as these may indicate immune-related adverse events requiring prompt corticosteroid intervention."
      }
    ],
    pearls: [
      "ASCCP risk-based management uses HPV genotype-specific risk stratification: HPV 16-positive ASC-US carries a 5-year CIN 3+ risk of approximately 4%, warranting immediate colposcopy, while non-16/18 HPV-positive ASC-US has lower risk and may be managed with 1-year surveillance",
      "Adenocarcinoma in situ (AIS) of the cervix requires cold knife conization (not LEEP) with negative margins for fertility-sparing management, as skip lesions are common and thermal artifact from LEEP obscures margin evaluation",
      "Pembrolizumab has changed the treatment paradigm for recurrent cervical cancer - the KEYNOTE-826 trial demonstrated significant overall survival benefit when added to chemotherapy with or without bevacizumab in PD-L1-positive (CPS greater than or equal to 1) recurrent or metastatic disease"
    ],
    quiz: [
      {
        question: "A 34-year-old woman has an HPV 16-positive Pap smear showing ASC-US. According to ASCCP guidelines, what is the recommended next step?",
        options: [
          "Repeat Pap smear in 3 years per routine screening",
          "Immediate colposcopy with directed biopsy",
          "Total hysterectomy for cancer prevention",
          "Start empiric cisplatin chemotherapy"
        ],
        correct: 1,
        rationale: "HPV 16 positivity, even with ASC-US cytology, carries a significantly elevated risk for CIN 3+ (approximately 4% at 5 years). ASCCP risk-based management guidelines recommend immediate colposcopy with directed biopsy to evaluate for high-grade dysplasia or occult invasive disease. HPV 16 is the most oncogenic HPV genotype and warrants expedited evaluation regardless of cytologic grade."
      }
    ]
  },

  "tumor-lysis-rpn": {
    title: "Tumor Lysis Syndrome (TLS)",
    cellular: {
      title: "Pathophysiology of Tumor Lysis Syndrome",
      content: "Tumor lysis syndrome (TLS) is an oncologic emergency resulting from the rapid destruction of large numbers of malignant cells, either spontaneously or following initiation of cytotoxic therapy. When tumor cells lyse, they release massive quantities of intracellular contents into the bloodstream, including potassium, phosphorus, nucleic acids, and uric acid. Nucleic acids are metabolized to uric acid by xanthine oxidase in the liver. The sudden surge of uric acid overwhelms renal excretion capacity, and uric acid crystals precipitate in the renal tubules, causing obstructive uropathy and acute kidney injury. Elevated phosphorus binds to serum calcium, forming calcium phosphate deposits in tissues and causing secondary hypocalcemia. The resulting electrolyte derangements - hyperkalemia, hyperphosphatemia, hypocalcemia, and hyperuricemia - create a cascade of life-threatening complications including fatal cardiac dysrhythmias from hyperkalemia and seizures or tetany from hypocalcemia."
    },
    riskFactors: [
      "Large tumor burden with bulky disease or high white blood cell count",
      "Rapidly proliferating malignancies (Burkitt lymphoma, acute lymphoblastic leukemia, acute myeloid leukemia)",
      "High sensitivity of tumor to cytotoxic therapy",
      "Pre-existing renal insufficiency or dehydration",
      "Elevated baseline uric acid or LDH levels before treatment",
      "Concurrent use of nephrotoxic medications",
      "Inadequate hydration before initiation of chemotherapy"
    ],
    diagnostics: [
      "Serum potassium level (elevated in TLS)",
      "Serum phosphorus level (elevated in TLS)",
      "Serum calcium level (decreased due to calcium-phosphorus binding)",
      "Serum uric acid level (elevated from nucleic acid breakdown)",
      "Blood urea nitrogen and creatinine (elevated indicating renal injury)",
      "Lactate dehydrogenase (LDH) level as marker of cell destruction",
      "12-lead ECG to assess for hyperkalemia-related changes (peaked T waves, widened QRS)",
      "Urinalysis for uric acid crystals"
    ],
    management: [
      "Aggressive IV hydration with isotonic saline at 2-3 liters per square meter per day to maintain high urine output",
      "Allopurinol prophylaxis to inhibit xanthine oxidase and reduce uric acid production",
      "Rasburicase for high-risk patients or established TLS (converts uric acid to soluble allantoin)",
      "Correction of hyperkalemia with insulin and dextrose, calcium gluconate for cardiac protection, sodium polystyrene sulfonate",
      "Phosphate binders (aluminum hydroxide or sevelamer) for hyperphosphatemia",
      "Calcium replacement only for symptomatic hypocalcemia (avoid if phosphorus is elevated to prevent tissue calcification)",
      "Renal replacement therapy (hemodialysis) for refractory electrolyte imbalances or oliguric renal failure",
      "Avoidance of potassium and phosphorus in IV fluids and dietary intake"
    ],
    nursingActions: [
      "Monitor electrolytes every 4 to 6 hours during the high-risk period (24-72 hours after chemotherapy initiation)",
      "Maintain strict intake and output with goal urine output of at least 2 mL per kg per hour",
      "Place patient on continuous cardiac monitoring and report dysrhythmias immediately",
      "Assess for signs of hypocalcemia including Chvostek sign, Trousseau sign, muscle cramps, and tetany",
      "Monitor for hyperkalemia symptoms including muscle weakness, paresthesias, and ECG changes",
      "Ensure IV access is patent for emergency medication administration",
      "Administer rasburicase as ordered and place blood samples on ice immediately (rasburicase continues to degrade uric acid in vitro at room temperature)",
      "Educate patient to report palpitations, numbness, tingling, muscle cramping, or decreased urine output"
    ],
    signs: {
      left: [
        "Nausea, vomiting, diarrhea, and anorexia from metabolic derangements",
        "Muscle cramps, tetany, and carpopedal spasm from hypocalcemia",
        "Oliguria or anuria indicating acute kidney injury",
        "Seizures from severe hypocalcemia or metabolic encephalopathy"
      ],
      right: [
        "Cardiac dysrhythmias (peaked T waves, bradycardia, ventricular tachycardia) from hyperkalemia",
        "Muscle weakness and paresthesias from potassium imbalance",
        "Flank pain and hematuria from uric acid nephropathy",
        "Edema and fluid overload from renal failure"
      ]
    },
    medications: [
      {
        name: "Rasburicase (Elitek)",
        type: "Recombinant urate oxidase enzyme",
        action: "Catalyzes the enzymatic oxidation of uric acid to allantoin, a highly water-soluble compound that is easily excreted by the kidneys, rapidly reducing serum uric acid levels",
        sideEffects: "Anaphylaxis, methemoglobinemia, hemolytic anemia (especially in G6PD-deficient patients), headache, nausea, fever",
        contra: "Glucose-6-phosphate dehydrogenase (G6PD) deficiency (risk of severe hemolytic anemia and methemoglobinemia), known hypersensitivity to rasburicase",
        pearl: "Blood samples for uric acid must be collected in pre-chilled heparinized tubes and transported on ice to the lab immediately - rasburicase in the blood sample will continue to degrade uric acid at room temperature, producing falsely low results"
      }
    ],
    pearls: [
      "TLS can occur within 12 to 72 hours after initiating chemotherapy - the highest risk period requires intensive monitoring even if the patient appears clinically stable",
      "Rasburicase is contraindicated in patients with G6PD deficiency due to risk of severe hemolytic anemia - screen high-risk populations (African, Mediterranean, Southeast Asian descent) before administration",
      "Do not administer calcium unless the patient is symptomatic (tetany, seizures, cardiac instability) because correcting calcium while phosphorus is elevated can cause widespread calcium phosphate precipitation in tissues including the kidneys and heart"
    ],
    quiz: [
      {
        question: "A nurse is caring for a patient with Burkitt lymphoma who began chemotherapy 18 hours ago. The patient develops peaked T waves on the cardiac monitor, muscle weakness, and oliguria. Which electrolyte imbalance should the nurse suspect as the most immediately life-threatening?",
        options: [
          "Hypocalcemia causing peripheral numbness",
          "Hyperkalemia causing cardiac dysrhythmia",
          "Hyperuricemia causing joint inflammation",
          "Hyperphosphatemia causing tissue calcification"
        ],
        correct: 1,
        rationale: "Peaked T waves on the cardiac monitor combined with muscle weakness in a patient receiving chemotherapy for a high-risk malignancy strongly indicates hyperkalemia from tumor lysis syndrome. Hyperkalemia is the most immediately life-threatening electrolyte derangement in TLS because it can rapidly progress to fatal ventricular dysrhythmias and cardiac arrest. Immediate interventions include IV calcium gluconate for cardiac membrane stabilization, insulin with dextrose, and continuous cardiac monitoring."
      }
    ]
  }
};
