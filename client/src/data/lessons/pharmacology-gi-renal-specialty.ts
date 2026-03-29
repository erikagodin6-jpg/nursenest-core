import type { LessonContent } from "./types";

export const pharmacologyGiRenalSpecialtyLessons: Record<string, LessonContent> = {
  "pharm-gi-renal": {
    title: "GI and Renal Pharmacology",
    cellular: {
      title: "GI and Renal Drug Mechanisms at the Cellular",
      content: "Proton pump inhibitors irreversibly bind the hydrogen-potassium ATPase pump on gastric parietal cells, blocking the final step of acid secretion and raising intragastric pH. H2-receptor antagonists competitively block histamine receptors on parietal cells, reducing basal and stimulated acid output. Antiemetics act on multiple receptor pathways including serotonin 5-HT3 receptors in the chemoreceptor trigger zone, dopamine D2 receptors, and histamine H1 receptors to suppress nausea and vomiting. In the kidney, erythropoiesis-stimulating agents bind erythropoietin receptors on erythroid progenitor cells in bone marrow, stimulating red blood cell production, while phosphate binders work within the GI lumen to chelate dietary phosphate and prevent systite absorption."
    },
    riskFactors: [
      "Chronic NSAID or corticosteroid use increasing GI ulcer risk",
      "Helicobacter pylori infection requiring combination therapy",
      "Chronic kidney disease stages 3-5 causing electrolyte imbalances",
      "Hepatic encephalopathy requiring lactulose therapy",
      "Inflammatory bowel disease requiring long-term immunosuppression",
      "Polypharmacy increasing drug interaction risk"
    ],
    diagnostics: [
      "Serum magnesium and calcium levels with long-term PPI use",
      "CBC and reticulocyte count for ESA therapy monitoring",
      "Serum phosphorus levels for phosphate binder dosing",
      "Hepatic ammonia levels for lactulose titration",
      "Stool studies including C. difficile testing with antibiotic-associated diarrhea",
      "Serum potassium before and during IV KCl infusion"
    ],
    management: [
      "Titrate lactulose to achieve 3-4 soft stools per day for hepatic encephalopathy",
      "Administer IV potassium chloride at no more than 10 mEq/hr via peripheral line",
      "Take PPIs 30-60 minutes before the first meal of the day for maximum efficacy",
      "Administer pancrelipase with meals and snacks, not on an empty stomach",
      "Monitor hemoglobin targets of 10-11 g/dL with ESA therapy to avoid thromboembolic events",
      "Space phosphate binders with meals to bind dietary phosphorus"
    ],
    signs: {
      left: [
        "PPI long-term risks: hypomagnesemia, C. difficile, bone fractures, B12 deficiency",
        "Ondansetron adverse effects: QT prolongation, constipation, headache",
        "Metoclopramide risks: tardive dyskinesia with prolonged use (black box warning)",
        "Lactulose effect: osmotic diarrhea used therapeutically in hepatic encephalopathy",
        "Loperamide contraindication: avoid in infectious or inflammatory diarrhea"
      ],
      right: [
        "Epoetin alfa black box: increased mortality and thromboembolic events if Hgb exceeds 11 g/dL",
        "IV KCl safety: never administer by IV push; maximum peripheral rate 10 mEq/hr",
        "Sevelamer advantage: does not contain calcium, preferred in hypercalcemic CKD patients",
        "Infliximab monitoring: TB screening required before initiation due to immunosuppression",
        "Cholestyramine interaction: binds many drugs, must separate administration by 1-2 hours"
      ]
    },
    medications: [
      {
        name: "Omeprazole / Pantoprazole",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+ ATPase on parietal cells, suppressing gastric acid secretion",
        sideEffects: "Hypomagnesemia, vitamin B12 deficiency, C. difficile infection, bone fractures with long-term use",
        contra: "Concurrent use with clopidogrel (omeprazole); known hypersensitivity",
        pearl: "Take 30-60 minutes before first meal; long-term use beyond 8 weeks requires reassessment and periodic lab monitoring"
      },
      {
        name: "Famotidine",
        type: "H2 Receptor Antagonist",
        action: "Competitively blocks histamine H2 receptors on parietal cells, reducing acid secretion",
        sideEffects: "Headache, dizziness, constipation, rare thrombocytopenia",
        contra: "Known hypersensitivity to H2 blockers",
        pearl: "Less potent acid suppression than PPIs but fewer long-term complications; useful for nocturnal acid breakthrough"
      },
      {
        name: "Ondansetron",
        type: "5-HT3 Receptor Antagonist Antiemetic",
        action: "Blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone and vagal afferents",
        sideEffects: "QT prolongation, headache, constipation, dizziness",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine",
        pearl: "First-line antiemetic for chemotherapy-induced and postoperative nausea; obtain baseline ECG if cardiac history present"
      },
      {
        name: "Metoclopramide",
        type: "Dopamine Antagonist / Prokinetic Antiemetic",
        action: "Blocks dopamine D2 receptors centrally and peripherally, enhances gastric motility",
        sideEffects: "Tardive dyskinesia (black box), extrapyramidal symptoms, drowsiness, restlessness",
        contra: "GI obstruction, perforation, or hemorrhage; Parkinson disease; seizure disorders",
        pearl: "Black box warning for tardive dyskinesia; limit use to 12 weeks maximum; avoid in elderly patients"
      },
      {
        name: "Promethazine",
        type: "Phenothiazine Antiemetic / Antihistamine",
        action: "Blocks histamine H1 receptors and dopamine receptors in the CTZ to reduce nausea",
        sideEffects: "Severe sedation, respiratory depression, tissue necrosis with IV extravasation",
        contra: "Children under 2 years (black box for respiratory depression); intra-arterial injection",
        pearl: "Administer IV promethazine through a large-bore vein at concentration no greater than 25 mg/mL; severe tissue damage with extravasation"
      },
      {
        name: "Loperamide",
        type: "Opioid Antidiarrheal",
        action: "Acts on mu-opioid receptors in the intestinal wall to slow peristalsis and increase fluid absorption",
        sideEffects: "Constipation, abdominal cramps, cardiac arrhythmias at supratherapeutic doses",
        contra: "Acute dysentery, bacterial enterocolitis, C. difficile colitis, abdominal distension",
        pearl: "Contraindicated in infectious diarrhea as slowing motility can worsen toxin retention; FDA warning about cardiac events with abuse"
      },
      {
        name: "Psyllium",
        type: "Bulk-Forming Laxative",
        action: "Absorbs water in the intestine to form a gel-like bulk that promotes peristalsis",
        sideEffects: "Bloating, flatulence, esophageal obstruction if taken without adequate fluid",
        contra: "GI obstruction, dysphagia, fecal impaction",
        pearl: "Must be taken with at least 8 oz of water to prevent obstruction; also used to lower cholesterol as adjunct therapy"
      },
      {
        name: "Polyethylene Glycol (MiraLAX)",
        type: "Osmotic Laxative",
        action: "Creates osmotic gradient in the intestinal lumen drawing water into the bowel",
        sideEffects: "Bloating, nausea, diarrhea, electrolyte imbalances with excessive use",
        contra: "Known or suspected bowel obstruction",
        pearl: "Non-absorbed and non-stimulating; safe for chronic constipation; also used in large volume for bowel preparation"
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia-Lowering Agent",
        action: "Draws water into colon via osmosis; metabolized by colonic bacteria to acids that trap ammonia as ammonium ions",
        sideEffects: "Flatulence, bloating, abdominal cramping, diarrhea, hypernatremia",
        contra: "Galactosemia; patients on low-galactose diet",
        pearl: "In hepatic encephalopathy, titrate dose to achieve 3-4 soft bowel movements per day; monitor serum ammonia and electrolytes"
      },
      {
        name: "Bisacodyl",
        type: "Stimulant Laxative",
        action: "Stimulates enteric nerve plexus to increase colonic motility and fluid secretion",
        sideEffects: "Abdominal cramping, diarrhea, electrolyte imbalances, dependency with chronic use",
        contra: "Acute abdomen, intestinal obstruction, appendicitis",
        pearl: "Not recommended for long-term use due to risk of cathartic colon; swallow enteric-coated tablets whole, do not crush"
      },
      {
        name: "Cholestyramine",
        type: "Bile Acid Sequestrant",
        action: "Binds bile acids in the intestine preventing reabsorption, promoting hepatic conversion of cholesterol to bile acids",
        sideEffects: "Constipation, bloating, fat-soluble vitamin deficiency (A, D, E, K)",
        contra: "Complete biliary obstruction; phenylketonuria (some formulations contain phenylalanine)",
        pearl: "Binds numerous medications; administer other drugs 1 hour before or 4-6 hours after cholestyramine to avoid interaction"
      },
      {
        name: "Pancrelipase",
        type: "Pancreatic Enzyme Replacement",
        action: "Provides exogenous lipase, protease, and amylase to facilitate digestion of fats, proteins, and carbohydrates",
        sideEffects: "Nausea, abdominal pain, fibrosing colonopathy with high doses, hyperuricemia",
        contra: "Acute pancreatitis (during acute flare); known pork protein allergy",
        pearl: "Administer with every meal and snack; do not crush enteric-coated microspheres; adjust dose based on stool fat content"
      },
      {
        name: "Mesalamine (5-ASA)",
        type: "Aminosalicylate Anti-Inflammatory",
        action: "Topically inhibits prostaglandin and leukotriene synthesis in the intestinal mucosa, reducing inflammation",
        sideEffects: "Headache, nausea, abdominal pain, rare nephrotoxicity and pancreatitis",
        contra: "Salicylate hypersensitivity; severe renal impairment",
        pearl: "First-line maintenance therapy for mild-to-moderate ulcerative colitis; monitor renal function periodically"
      },
      {
        name: "Infliximab / Adalimumab",
        type: "TNF-Alpha Inhibitor Biologic (IBD)",
        action: "Monoclonal antibodies that bind and neutralize TNF-alpha, reducing intestinal inflammation and mucosal healing",
        sideEffects: "Serious infections, TB reactivation, hepatosplenic T-cell lymphoma, injection site reactions, demyelinating disease",
        contra: "Active serious infection including TB; moderate-to-severe heart failure (NYHA III-IV)",
        pearl: "Screen for latent TB with PPD or IGRA and hepatitis B before starting; infliximab requires IV infusion with monitoring for anaphylaxis"
      },
      {
        name: "Potassium Chloride (KCl)",
        type: "Electrolyte Supplement",
        action: "Replaces potassium deficit to maintain normal cellular function, cardiac rhythm, and neuromuscular activity",
        sideEffects: "GI irritation (oral), phlebitis and pain at IV site, hyperkalemia, cardiac arrest if infused too rapidly",
        contra: "Hyperkalemia, severe renal impairment without monitoring, concurrent potassium-sparing diuretics without monitoring",
        pearl: "Never give IV push; maximum peripheral infusion rate is 10 mEq/hr; always dilute and use infusion pump; cardiac monitoring for rates above 10 mEq/hr"
      },
      {
        name: "Sevelamer / Calcium Acetate",
        type: "Phosphate Binder",
        action: "Binds dietary phosphate in the GI tract preventing absorption and lowering serum phosphorus levels",
        sideEffects: "Sevelamer: GI upset, metabolic acidosis; Calcium acetate: hypercalcemia, nausea, constipation",
        contra: "Bowel obstruction; hypophosphatemia; calcium acetate contraindicated in hypercalcemia",
        pearl: "Take with meals to bind phosphorus in food; sevelamer preferred in CKD patients with hypercalcemia since it is calcium-free"
      },
      {
        name: "Sodium Bicarbonate",
        type: "Alkalinizing Agent / Electrolyte",
        action: "Provides bicarbonate ions to buffer excess hydrogen ions, correcting metabolic acidosis",
        sideEffects: "Metabolic alkalosis, hypernatremia, fluid overload, hypokalemia",
        contra: "Metabolic or respiratory alkalosis; hypocalcemia; chloride-losing conditions",
        pearl: "Used in CKD to correct metabolic acidosis; also used to alkalinize urine for certain drug overdoses; monitor ABGs and electrolytes"
      },
      {
        name: "Epoetin Alfa / Darbepoetin Alfa",
        type: "Erythropoiesis-Stimulating Agent (ESA)",
        action: "Stimulates erythropoietin receptors on erythroid progenitors in bone marrow, increasing red blood cell production",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia, headache, arthralgia",
        contra: "Uncontrolled hypertension; pure red cell aplasia from prior ESA use",
        pearl: "Black box warning: target hemoglobin 10-11 g/dL; higher targets increase mortality, stroke, and thromboembolic events; monitor iron stores concurrently"
      },
      {
        name: "Sodium Polystyrene Sulfonate (Kayexalate)",
        type: "Cation Exchange Resin (Potassium Binder)",
        action: "Exchanges sodium ions for potassium ions in the large intestine, promoting fecal potassium excretion to lower serum potassium levels",
        sideEffects: "Constipation, nausea, vomiting, hypokalemia (with overuse), hypernatremia, intestinal necrosis (rare but serious, especially with sorbitol), fecal impaction",
        contra: "Bowel obstruction, neonates with reduced gut motility, post-operative patients (ileus risk), concurrent sorbitol use increases intestinal necrosis risk",
        pearl: "Onset is slow (hours to days) - NOT appropriate for acute life-threatening hyperkalemia (use calcium gluconate, insulin/dextrose, or albuterol first). Administer orally or rectally. Newer potassium binders (patiromer, sodium zirconium cyclosilicate) have fewer GI side effects. Monitor potassium levels closely to avoid overcorrection."
      },
      {
        name: "Dextrose (D50W / D10W)",
        type: "Hypertonic Glucose Solution",
        action: "Provides rapid exogenous glucose to reverse hypoglycemia by directly increasing blood glucose levels; when combined with insulin, drives potassium intracellularly to treat hyperkalemia",
        sideEffects: "Hyperglycemia, phlebitis and tissue necrosis with extravasation (D50W), fluid overload, hypernatremia",
        contra: "Hyperglycemia, delirium tremens with dehydration (correct dehydration first), intracranial hemorrhage",
        pearl: "D50W (50% dextrose): 25-50 mL IV push for severe hypoglycemia in adults - administer via large-bore IV to prevent extravasation. D10W preferred in pediatrics and for maintenance. Always administer thiamine BEFORE dextrose in malnourished or alcoholic patients to prevent Wernicke encephalopathy. When used with insulin for hyperkalemia, give dextrose to prevent hypoglycemia."
      }
    ],
    pearls: [
      "PPIs should be taken 30-60 minutes before the first meal; long-term use (>1 year) increases risk of C. difficile, hip fractures, hypomagnesemia, and B12 deficiency",
      "IV potassium must never be given by IV push and should not exceed 10 mEq/hr via peripheral line; always use an infusion pump with cardiac monitoring",
      "Lactulose dose for hepatic encephalopathy is titrated to 3-4 soft stools daily; monitor for dehydration and hypernatremia",
      "Metoclopramide carries a black box warning for tardive dyskinesia; limit therapy to no more than 12 weeks",
      "Cholestyramine binds many medications in the GI tract; separate other drug administration by at least 1-2 hours before or 4-6 hours after",
      "ESAs carry a black box warning for increased thromboembolic events when hemoglobin targets exceed 11 g/dL; always assess iron status before initiating"
    ],
    quiz: [
      {
        question: "What is the maximum recommended IV infusion rate for potassium chloride via a peripheral line?",
        options: ["5 mEq/hr", "10 mEq/hr", "20 mEq/hr", "40 mEq/hr"],
        correct: 1,
        rationale: "The maximum safe peripheral IV infusion rate for KCl is 10 mEq/hr. Higher rates require central line access and continuous cardiac monitoring to prevent fatal arrhythmias."
      },
      {
        question: "A patient on long-term omeprazole therapy should be monitored for which electrolyte imbalance?",
        options: ["Hyperkalemia", "Hypomagnesemia", "Hypernatremia", "Hypophosphatemia"],
        correct: 1,
        rationale: "Long-term PPI use is associated with hypomagnesemia, which can cause muscle spasms, cardiac arrhythmias, and seizures. Periodic magnesium levels should be monitored."
      },
      {
        question: "How should lactulose dosing be titrated in a patient with hepatic encephalopathy?",
        options: [
          "Until the patient has 1 formed stool daily",
          "Until serum ammonia is undetectable",
          "Until the patient achieves 3-4 soft stools per day",
          "Until abdominal distension resolves"
        ],
        correct: 2,
        rationale: "Lactulose is titrated to produce 3-4 soft bowel movements per day in hepatic encephalopathy. This frequency optimizes ammonia excretion while preventing dehydration."
      },
      {
        question: "Which antiemetic carries a black box warning for tardive dyskinesia with prolonged use?",
        options: ["Ondansetron", "Promethazine", "Metoclopramide", "Granisetron"],
        correct: 2,
        rationale: "Metoclopramide has a black box warning for tardive dyskinesia, an often irreversible movement disorder. Treatment duration should not exceed 12 weeks except in rare cases."
      },
      {
        question: "What is the target hemoglobin range when using erythropoiesis-stimulating agents in CKD?",
        options: ["8-9 g/dL", "10-11 g/dL", "12-13 g/dL", "14-15 g/dL"],
        correct: 1,
        rationale: "ESAs carry a black box warning for increased cardiovascular events and mortality when hemoglobin exceeds 11 g/dL. The target range is 10-11 g/dL."
      }
    ]
  },

  "pharm-specialty-systems": {
    title: "Specialty Systems Pharmacology",
    cellular: {
      title: "Pharmacology of Rheumatology, Dermatology",
      content: "Disease-modifying antirheumatic drugs such as methotrexate inhibit dihydrofolate reductase, blocking purine and thymidylate synthesis to suppress rapidly dividing immune cells responsible for joint destruction. TNF-alpha inhibitors are engineered monoclonal antibodies or fusion proteins that bind circulating and membrane-bound TNF-alpha, preventing activation of inflammatory cascades in synovial tissue. In women's health, combined oral contraceptives suppress the hypothalamic-pituitary-ovarian axis by providing exogenous estrogen and progestin, inhibiting GnRH pulsatility and thereby preventing the LH surge needed for ovulation. Alpha-1 adrenergic blockers in urology relax smooth muscle in the prostate and bladder neck by blocking alpha-1a receptors, reducing urethral resistance and improving urinary flow in benign prostatic hyperplasia."
    },
    riskFactors: [
      "Autoimmune disease requiring long-term immunosuppressive therapy",
      "Chronic skin conditions with risk of secondary infection",
      "Teratogenic medication use in women of childbearing potential",
      "Thromboembolic risk with estrogen-containing contraceptives",
      "Hepatotoxicity risk with methotrexate and isotretinoin",
      "BPH progression with risk of urinary retention"
    ],
    diagnostics: [
      "CBC and liver function tests every 4-8 weeks for methotrexate therapy",
      "Two negative pregnancy tests before isotretinoin initiation (iPLEDGE)",
      "Lipid panel and liver function tests during isotretinoin therapy",
      "TB screening before TNF inhibitor initiation",
      "PSA and digital rectal exam before initiating 5-alpha reductase inhibitors",
      "Blood pressure monitoring with estrogen-containing contraceptives"
    ],
    management: [
      "Supplement folic acid 1 mg daily with methotrexate to reduce mucosal and hematologic side effects",
      "Enroll in iPLEDGE program and use two forms of contraception with isotretinoin",
      "Apply topical corticosteroids using fingertip unit dosing and limit super-high potency to 2 weeks on non-facial areas",
      "Discontinue estrogen-containing contraceptives 4-6 weeks before major surgery to reduce VTE risk",
      "Educate patients on first-dose hypotension with alpha blockers; take at bedtime initially",
      "Monitor for signs of infection during biologic therapy"
    ],
    signs: {
      left: [
        "Methotrexate toxicity: pancytopenia, mucositis, hepatotoxicity, pneumonitis",
        "Isotretinoin effects: severe teratogenicity, cheilitis, elevated lipids, depression monitoring",
        "Combined OC risks: VTE, stroke, MI (especially in smokers over 35)",
        "TNF inhibitor risks: opportunistic infections, TB reactivation, demyelinating disease"
      ],
      right: [
        "Tamsulosin side effects: orthostatic hypotension, retrograde ejaculation, intraoperative floppy iris syndrome",
        "Finasteride effects: decreased PSA by 50%, sexual dysfunction, teratogenic to male fetus",
        "Sildenafil contraindication: absolute contraindication with nitrates causing fatal hypotension",
        "Oxybutynin anticholinergic effects: dry mouth, constipation, urinary retention, confusion in elderly"
      ]
    },
    medications: [
      {
        name: "Methotrexate",
        type: "DMARD / Antimetabolite",
        action: "Inhibits dihydrofolate reductase, blocking DNA synthesis in rapidly dividing immune cells to reduce inflammation",
        sideEffects: "Hepatotoxicity, pancytopenia, stomatitis, pulmonary fibrosis, immunosuppression",
        contra: "Pregnancy (category X), alcoholism, liver disease, immunodeficiency, bone marrow suppression",
        pearl: "Always co-prescribe folic acid 1 mg daily to reduce side effects; monitor CBC and LFTs every 4-8 weeks; teratogenic in both males and females"
      },
      {
        name: "Adalimumab / Etanercept",
        type: "TNF-Alpha Inhibitor Biologic",
        action: "Binds and neutralizes TNF-alpha, a key pro-inflammatory cytokine driving joint destruction and systemic inflammation",
        sideEffects: "Serious infections, TB reactivation, lymphoma risk, injection site reactions, heart failure exacerbation",
        contra: "Active serious infections, latent TB without treatment, NYHA class III-IV heart failure",
        pearl: "Screen for TB and hepatitis B before initiation; patients should avoid live vaccines during therapy"
      },
      {
        name: "Tofacitinib",
        type: "JAK Inhibitor",
        action: "Inhibits Janus kinase enzymes, blocking intracellular signaling of multiple cytokines involved in immune-mediated inflammation",
        sideEffects: "Serious infections, VTE, malignancy risk, GI perforation, lymphopenia, elevated lipids",
        contra: "Active serious infection; severe hepatic impairment; concurrent strong immunosuppressants",
        pearl: "Black box warnings for serious infections, malignancy, thrombosis, and cardiovascular events; monitor CBC, lipids, and LFTs"
      },
      {
        name: "Prednisone (Systemic Corticosteroid)",
        type: "Glucocorticoid Anti-Inflammatory / Immunosuppressant",
        action: "Suppresses inflammatory gene transcription and immune cell proliferation by binding intracellular glucocorticoid receptors",
        sideEffects: "Hyperglycemia, osteoporosis, adrenal suppression, weight gain, Cushing syndrome, immunosuppression, GI ulceration",
        contra: "Systemic fungal infections; live vaccine administration during therapy",
        pearl: "Taper gradually after prolonged use to prevent adrenal crisis; monitor blood glucose, especially in diabetic patients; give with food"
      },
      {
        name: "Topical Corticosteroids (Low to Super-High Potency)",
        type: "Topical Anti-Inflammatory",
        action: "Suppress local inflammatory and immune responses by inhibiting phospholipase A2, reducing prostaglandin and leukotriene production in skin",
        sideEffects: "Skin atrophy, striae, telangiectasia, hypopigmentation, HPA axis suppression with prolonged high-potency use",
        contra: "Viral, fungal, or bacterial skin infections at application site; perioral dermatitis (face); rosacea",
        pearl: "Use lowest effective potency; super-high potency (clobetasol) limited to 2 weeks on thick-skinned areas only; never use high potency on face, groin, or axillae"
      },
      {
        name: "Tretinoin (Topical Retinoid)",
        type: "Vitamin A Derivative",
        action: "Modulates keratinocyte differentiation and proliferation, promotes comedolysis and prevents microcomedo formation",
        sideEffects: "Photosensitivity, erythema, peeling, dryness, initial acne flare",
        contra: "Pregnancy; concurrent use with other drying or irritating topical agents",
        pearl: "Apply at night to clean dry skin; use sunscreen daily as retinoids increase UV sensitivity; expect initial worsening before improvement at 6-8 weeks"
      },
      {
        name: "Isotretinoin (Oral)",
        type: "Systemic Retinoid",
        action: "Reduces sebaceous gland size and sebum production, normalizes follicular keratinization, and has anti-inflammatory effects",
        sideEffects: "Severe teratogenicity, cheilitis, dry skin and mucous membranes, elevated triglycerides, transaminitis, depression monitoring",
        contra: "Pregnancy (category X), breastfeeding, hypersensitivity to vitamin A derivatives",
        pearl: "Requires iPLEDGE registration; two negative pregnancy tests before starting and monthly thereafter; two forms of contraception mandatory; avoid blood donation for 1 month after stopping"
      },
      {
        name: "Terbinafine",
        type: "Antifungal (Allylamine)",
        action: "Inhibits squalene epoxidase, blocking ergosterol synthesis in fungal cell membranes leading to cell death",
        sideEffects: "Hepatotoxicity, taste disturbance, GI upset, rash, headache",
        contra: "Active or chronic liver disease; known hypersensitivity",
        pearl: "First-line oral treatment for onychomycosis; check LFTs before and during therapy; treatment duration is 6 weeks for fingernails, 12 weeks for toenails"
      },
      {
        name: "Mupirocin (Topical Antibiotic)",
        type: "Topical Antibacterial",
        action: "Inhibits bacterial isoleucyl-tRNA synthetase, preventing protein synthesis and bacterial growth",
        sideEffects: "Local burning, stinging, pruritus at application site",
        contra: "Known hypersensitivity; not for use on large open wounds or burns",
        pearl: "Effective against MRSA skin infections and nasal decolonization; intranasal formulation used for MRSA carriers"
      },
      {
        name: "Secukinumab",
        type: "IL-17A Inhibitor Biologic (Psoriasis)",
        action: "Monoclonal antibody that selectively binds IL-17A, blocking its interaction with the IL-17 receptor to reduce psoriatic inflammation",
        sideEffects: "Upper respiratory infections, diarrhea, injection site reactions, candida infections, IBD exacerbation",
        contra: "Active serious infections; caution in patients with Crohn disease",
        pearl: "Screen for TB before initiation; may exacerbate inflammatory bowel disease; loading dose followed by monthly maintenance injections"
      },
      {
        name: "Ethinyl Estradiol + Norgestimate (Combined OC)",
        type: "Combined Oral Contraceptive",
        action: "Suppresses GnRH pulsatility, inhibiting LH surge and ovulation; thickens cervical mucus and thins endometrium",
        sideEffects: "VTE, stroke, MI (especially smokers >35), breast tenderness, nausea, headache, mood changes",
        contra: "Smoking and age >35, history of VTE or stroke, migraine with aura, breast cancer, uncontrolled hypertension",
        pearl: "Absolute contraindication in smokers over 35; discontinue 4-6 weeks before major surgery; breakthrough bleeding common in first 3 months"
      },
      {
        name: "Norethindrone (Progestin-Only Pill)",
        type: "Progestin-Only Contraceptive",
        action: "Thickens cervical mucus, suppresses ovulation variably, and thins the endometrium to prevent implantation",
        sideEffects: "Irregular bleeding, headache, breast tenderness, mood changes",
        contra: "Known or suspected breast cancer; undiagnosed vaginal bleeding; benign or malignant liver tumors",
        pearl: "Must be taken at the same time daily within a 3-hour window; safe option for patients with contraindications to estrogen"
      },
      {
        name: "Levonorgestrel / Ulipristal (Emergency Contraception)",
        type: "Emergency Contraceptive",
        action: "Levonorgestrel delays or inhibits ovulation; ulipristal acts as a progesterone receptor modulator delaying ovulation even closer to LH surge",
        sideEffects: "Nausea, fatigue, headache, irregular menstrual bleeding, abdominal pain",
        contra: "Known pregnancy (though not harmful to existing pregnancy); ulipristal not with hormonal contraceptives concurrently",
        pearl: "Levonorgestrel effective up to 72 hours (best within 24); ulipristal effective up to 120 hours; efficacy decreases with higher BMI for levonorgestrel"
      },
      {
        name: "Conjugated Estrogen (HRT)",
        type: "Menopausal Hormone Replacement Therapy",
        action: "Replaces declining estrogen levels to reduce vasomotor symptoms, vaginal atrophy, and bone loss",
        sideEffects: "VTE, stroke, breast cancer risk (with prolonged combined HRT), endometrial hyperplasia (if without progestin)",
        contra: "History of breast cancer, active VTE or stroke, undiagnosed vaginal bleeding, liver disease",
        pearl: "Must combine with progestin in women with intact uterus to prevent endometrial hyperplasia; use lowest effective dose for shortest duration"
      },
      {
        name: "Levonorgestrel IUD",
        type: "Hormonal Intrauterine Device",
        action: "Releases levonorgestrel locally to thicken cervical mucus, thin endometrium, and partially suppress ovulation providing long-acting contraception",
        sideEffects: "Irregular bleeding, amenorrhea, ovarian cysts, headache, mood changes, rare uterine perforation at insertion",
        contra: "Active pelvic infection, unexplained vaginal bleeding, uterine anomalies, current breast cancer",
        pearl: "Effective for 3-8 years depending on device; also used therapeutically for heavy menstrual bleeding and endometrial protection during HRT; can be used in breastfeeding"
      },
      {
        name: "Clomiphene / Letrozole",
        type: "Ovulation Induction Agent",
        action: "Clomiphene blocks estrogen receptors at hypothalamus, increasing FSH release; letrozole inhibits aromatase, reducing estrogen and increasing FSH",
        sideEffects: "Hot flashes, ovarian hyperstimulation syndrome, multiple gestation, visual disturbances (clomiphene), mood changes",
        contra: "Ovarian cysts, pregnancy, undiagnosed vaginal bleeding, liver disease (clomiphene)",
        pearl: "Letrozole increasingly preferred as first-line for PCOS-related anovulation; monitor with ultrasound to prevent ovarian hyperstimulation"
      },
      {
        name: "Tamsulosin",
        type: "Alpha-1A Adrenergic Blocker (Urology)",
        action: "Selectively blocks alpha-1a receptors in prostate and bladder neck smooth muscle, reducing urethral resistance",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Known hypersensitivity; concurrent use with strong CYP3A4 inhibitors",
        pearl: "Take 30 minutes after the same meal daily; inform ophthalmologist of tamsulosin use before cataract surgery due to IFIS risk"
      },
      {
        name: "Finasteride",
        type: "5-Alpha Reductase Inhibitor",
        action: "Inhibits type II 5-alpha reductase, blocking conversion of testosterone to dihydrotestosterone (DHT) in the prostate",
        sideEffects: "Decreased libido, erectile dysfunction, ejaculatory disorders, gynecomastia, PSA reduction by approximately 50%",
        contra: "Pregnancy and women of childbearing potential (category X); pediatric patients",
        pearl: "Reduces PSA by about 50%; double the measured PSA value for accurate screening; pregnant women must not handle crushed tablets due to teratogenicity"
      },
      {
        name: "Sildenafil",
        type: "PDE-5 Inhibitor",
        action: "Inhibits phosphodiesterase-5 in corpus cavernosum, enhancing nitric oxide-mediated vasodilation and penile blood flow",
        sideEffects: "Headache, flushing, dyspepsia, visual disturbances (blue-tinted vision), priapism, sudden hearing loss",
        contra: "Concurrent nitrate use (absolute - fatal hypotension), severe hepatic impairment, recent stroke or MI",
        pearl: "Nitrate use within 24-48 hours is an absolute contraindication due to risk of fatal hypotension; also approved for pulmonary arterial hypertension"
      },
      {
        name: "Oxybutynin",
        type: "Anticholinergic / Antispasmodic (OAB)",
        action: "Blocks muscarinic M3 receptors on detrusor muscle, reducing involuntary bladder contractions",
        sideEffects: "Dry mouth, constipation, blurred vision, urinary retention, cognitive impairment in elderly, heat intolerance",
        contra: "Urinary retention, gastric retention, uncontrolled narrow-angle glaucoma",
        pearl: "Use with extreme caution in elderly due to anticholinergic burden increasing fall and confusion risk; extended-release formulation has fewer side effects"
      }
    ],
    pearls: [
      "Methotrexate requires concurrent folic acid supplementation and regular CBC/LFT monitoring every 4-8 weeks to detect bone marrow suppression and hepatotoxicity early",
      "Isotretinoin requires iPLEDGE enrollment, two forms of contraception, and monthly pregnancy tests; teratogenicity is the most critical counseling point",
      "Sildenafil with nitrates is an absolute contraindication that can cause fatal hypotension; always ask about nitrate use including recreational poppers",
      "Combined oral contraceptives are absolutely contraindicated in women over 35 who smoke due to dramatically increased risk of stroke and MI",
      "Finasteride reduces PSA by approximately 50%, so measured values must be doubled for accurate prostate cancer screening",
      "Topical corticosteroid potency selection follows the rule: weakest effective potency for shortest duration; never use high potency on face or intertriginous areas"
    ],
    quiz: [
      {
        question: "Which supplement must be co-prescribed with methotrexate to reduce its adverse effects?",
        options: ["Vitamin B12", "Iron sulfate", "Folic acid", "Calcium carbonate"],
        correct: 2,
        rationale: "Folic acid 1 mg daily is co-prescribed with methotrexate to reduce mucosal, GI, and hematologic side effects caused by folate antagonism without reducing therapeutic efficacy."
      },
      {
        question: "A patient taking sildenafil presents with chest pain. Which medication is absolutely contraindicated?",
        options: ["Metoprolol", "Nitroglycerin", "Aspirin", "Morphine"],
        correct: 1,
        rationale: "Nitroglycerin (a nitrate) is absolutely contraindicated with PDE-5 inhibitors due to additive vasodilation causing severe, potentially fatal hypotension."
      },
      {
        question: "What program must patients and prescribers enroll in before isotretinoin can be dispensed?",
        options: ["REMS", "MedWatch", "iPLEDGE", "TIRF REMS"],
        correct: 2,
        rationale: "iPLEDGE is a mandatory risk management program for isotretinoin requiring registration of prescribers, pharmacies, and patients with monthly compliance including pregnancy testing."
      },
      {
        question: "A nurse is counseling a patient starting tamsulosin. Which instruction is most important?",
        options: [
          "Take on an empty stomach in the morning",
          "Take 30 minutes after the same meal daily and rise slowly from sitting",
          "Avoid all dairy products while taking this medication",
          "Double the dose if a dose is missed"
        ],
        correct: 1,
        rationale: "Tamsulosin should be taken 30 minutes after the same meal daily. First-dose orthostatic hypotension is a significant risk; patients should change positions slowly."
      },
      {
        question: "Which contraceptive method is safest for a 38-year-old woman who smokes one pack per day?",
        options: [
          "Combined oral contraceptive with ethinyl estradiol",
          "Progestin-only pill (norethindrone)",
          "Transdermal estrogen-progestin patch",
          "Combined vaginal ring"
        ],
        correct: 1,
        rationale: "Progestin-only contraceptives are the safest hormonal option for women over 35 who smoke, as estrogen-containing methods dramatically increase VTE, stroke, and MI risk."
      }
    ]
  },

  "pharm-heme-emergency": {
    title: "Hematology, Oncology",
    cellular: {
      title: "Pharmacology of Blood Disorders, Oncology",
      content: "Iron supplementation provides the essential mineral needed for hemoglobin synthesis within erythroid precursors; ferrous iron is absorbed in the duodenum via divalent metal transporter-1 and incorporated into protoporphyrin IX within mitochondria to form heme. Anticoagulant reversal agents work through distinct mechanisms: protamine sulfate electrostatically binds heparin molecules, idarucizumab is a humanized antibody fragment that binds dabigatran with high affinity, and andexanet alfa is a modified Factor Xa decoy receptor that sequesters Factor Xa inhibitors. In emergency pharmacology, epinephrine acts on both alpha and beta adrenergic receptors to produce vasoconstriction, bronchodilation, and increased cardiac output, making it the cornerstone drug for anaphylaxis and cardiac arrest. Thrombolytics such as alteplase activate plasminogen bound to fibrin within thrombi, converting it to plasmin which enzymatically degrades the fibrin matrix to restore blood flow."
    },
    riskFactors: [
      "Iron deficiency from chronic blood loss, pregnancy, or poor dietary intake",
      "Chronic disease causing anemia of inflammation",
      "Anticoagulant therapy with risk of major hemorrhage",
      "Chemotherapy-induced neutropenia and immunosuppression",
      "Tumor lysis syndrome risk with high tumor burden cancers",
      "Anaphylaxis requiring immediate epinephrine administration",
      "Opioid overdose epidemic requiring widespread naloxone access"
    ],
    diagnostics: [
      "CBC, reticulocyte count, iron studies (ferritin, TIBC, serum iron) for anemia workup",
      "INR for warfarin monitoring; anti-Xa levels for LMWH and DOACs",
      "Serum uric acid, potassium, phosphorus, and calcium for tumor lysis syndrome",
      "CT head without contrast before tPA administration for stroke",
      "12-lead ECG and troponin for acute coronary syndrome",
      "Methylmalonic acid and homocysteine for B12 vs folate deficiency differentiation"
    ],
    management: [
      "Administer oral iron on empty stomach with vitamin C to enhance absorption; separate from antacids by 2 hours",
      "Give epinephrine 0.3 mg IM in the anterolateral thigh for anaphylaxis; may repeat every 5-15 minutes",
      "Achieve door-to-needle time under 60 minutes for tPA in acute ischemic stroke",
      "Administer naloxone 0.4-2 mg IV/IM/IN for opioid overdose; be prepared to redose as naloxone half-life is shorter than most opioids",
      "Start allopurinol 1-2 days before chemotherapy in high-risk patients for tumor lysis syndrome prevention",
      "Push adenosine rapidly via proximal IV site followed by 20 mL NS flush for SVT conversion"
    ],
    signs: {
      left: [
        "Iron deficiency signs: fatigue, pallor, pica, koilonychia, glossitis",
        "B12 deficiency: megaloblastic anemia plus neurological symptoms (paresthesias, ataxia, cognitive changes)",
        "Anaphylaxis: urticaria, angioedema, bronchospasm, hypotension, tachycardia within minutes of exposure",
        "Tumor lysis syndrome: hyperuricemia, hyperkalemia, hyperphosphatemia, hypocalcemia",
        "Opioid overdose triad: respiratory depression, pinpoint pupils, decreased consciousness"
      ],
      right: [
        "Alteplase contraindications: active bleeding, recent surgery, hemorrhagic stroke, platelet count below 100,000",
        "Heparin reversal: protamine 1 mg per 100 units of heparin given in last 2-3 hours",
        "Warfarin reversal: vitamin K (oral or IV) plus 4-factor PCC for life-threatening bleeding",
        "Epinephrine in cardiac arrest: 1 mg IV every 3-5 minutes; in anaphylaxis: 0.3 mg IM autoinjector",
        "Calcium gluconate indication: hyperkalemia cardiac membrane stabilization and magnesium sulfate toxicity reversal"
      ]
    },
    medications: [
      {
        name: "Ferrous Sulfate (Oral Iron)",
        type: "Iron Supplement",
        action: "Provides elemental iron for incorporation into hemoglobin and myoglobin within erythroid precursor cells",
        sideEffects: "GI upset, constipation, black tarry stools, nausea, teeth staining (liquid form)",
        contra: "Hemochromatosis, hemolytic anemias not due to iron deficiency, concurrent IV iron",
        pearl: "Take on empty stomach with vitamin C (orange juice) to enhance absorption; separate from antacids, calcium, and tetracyclines by 2 hours; black stools are expected and not blood"
      },
      {
        name: "Iron Sucrose / Ferric Carboxymaltose (IV Iron)",
        type: "Parenteral Iron Replacement",
        action: "Delivers iron directly to reticuloendothelial system for transfer to transferrin and incorporation into hemoglobin",
        sideEffects: "Hypotension, nausea, headache, injection site reactions, rare anaphylaxis, hypophosphatemia (ferric carboxymaltose)",
        contra: "Iron overload, hemochromatosis, anemia not caused by iron deficiency",
        pearl: "IV iron preferred when oral iron is not tolerated or absorbed (CKD, IBD, malabsorption); ferric carboxymaltose allows larger single doses reducing total infusions needed"
      },
      {
        name: "Cyanocobalamin (Vitamin B12)",
        type: "Water-Soluble Vitamin Supplement",
        action: "Serves as cofactor for methionine synthase and methylmalonyl-CoA mutase, essential for DNA synthesis and neuronal myelin maintenance",
        sideEffects: "Injection site pain, diarrhea, hypokalemia during initial correction (cellular potassium uptake), pulmonary edema in heart failure",
        contra: "Leber hereditary optic neuropathy; known cobalt hypersensitivity",
        pearl: "IM injections preferred for pernicious anemia (lack of intrinsic factor prevents oral absorption); correct B12 before folate to prevent masking neurological damage"
      },
      {
        name: "Folic Acid",
        type: "Water-Soluble Vitamin / B9 Supplement",
        action: "Converted to tetrahydrofolate, a coenzyme required for purine and thymidylate synthesis essential for DNA replication and cell division",
        sideEffects: "Generally well tolerated; rare allergic reactions; may mask B12 deficiency if given alone",
        contra: "Untreated vitamin B12 deficiency (can mask hematologic improvement while neurological damage progresses)",
        pearl: "Critical in pregnancy to prevent neural tube defects (400-800 mcg daily preconception); always rule out B12 deficiency before treating megaloblastic anemia with folate alone"
      },
      {
        name: "Protamine Sulfate",
        type: "Heparin Reversal Agent",
        action: "Positively charged protein that electrostatically binds negatively charged heparin molecules, neutralizing anticoagulant effect",
        sideEffects: "Hypotension, bradycardia, anaphylaxis (especially in fish allergy or prior protamine exposure), pulmonary vasoconstriction",
        contra: "Known hypersensitivity; caution in fish allergy, prior vasectomy, NPH insulin use (contains protamine)",
        pearl: "Dose: 1 mg protamine per 100 units of UFH given in last 2-3 hours; maximum single dose 50 mg; administer slowly over 10 minutes to reduce hypotension risk"
      },
      {
        name: "Vitamin K (Phytonadione) / 4-Factor PCC",
        type: "Warfarin Reversal Agents",
        action: "Vitamin K restores synthesis of clotting factors II, VII, IX, X (takes 12-24 hours); 4-factor PCC provides immediate concentrated clotting factors",
        sideEffects: "Vitamin K: anaphylaxis with IV (rare), local injection site reactions; PCC: thromboembolic events, DIC",
        contra: "PCC: active DIC, heparin-induced thrombocytopenia",
        pearl: "For life-threatening warfarin-related bleeding, give both IV vitamin K and 4-factor PCC; vitamin K alone takes 12-24 hours, PCC provides immediate reversal"
      },
      {
        name: "Idarucizumab / Andexanet Alfa",
        type: "DOAC Reversal Agents",
        action: "Idarucizumab is a monoclonal antibody fragment binding dabigatran; andexanet alfa is a decoy Factor Xa receptor sequestering rivaroxaban and apixaban",
        sideEffects: "Idarucizumab: headache, hypokalemia, thrombotic events; Andexanet: infusion reactions, thrombotic events, cardiac arrest",
        contra: "No absolute contraindications for idarucizumab in life-threatening situations",
        pearl: "Idarucizumab reverses dabigatran within minutes; andexanet alfa reverses Factor Xa inhibitors; both carry risk of thrombotic rebound after reversal"
      },
      {
        name: "Alteplase (tPA)",
        type: "Thrombolytic / Fibrinolytic",
        action: "Recombinant tissue plasminogen activator that converts fibrin-bound plasminogen to plasmin, dissolving pathological thrombi",
        sideEffects: "Hemorrhage (intracranial being most feared), angioedema, reperfusion arrhythmias, allergic reactions",
        contra: "Active internal bleeding, recent intracranial surgery or stroke (3 months), intracranial neoplasm, uncontrolled hypertension (>185/110)",
        pearl: "Door-to-needle time must be under 60 minutes for ischemic stroke; monitor neuro checks every 15 minutes during infusion; no anticoagulants or antiplatelets for 24 hours post-administration"
      },
      {
        name: "Tamoxifen",
        type: "Selective Estrogen Receptor Modulator (SERM)",
        action: "Competitively blocks estrogen receptors in breast tissue while acting as partial agonist in bone and endometrium",
        sideEffects: "Hot flashes, VTE, endometrial cancer risk, cataracts, menstrual irregularities",
        contra: "Pregnancy, concurrent warfarin (interaction), history of DVT/PE",
        pearl: "Standard adjuvant therapy for ER-positive breast cancer for 5-10 years; increases endometrial cancer risk, so report abnormal vaginal bleeding immediately"
      },
      {
        name: "Anastrozole",
        type: "Aromatase Inhibitor",
        action: "Blocks aromatase enzyme, preventing peripheral conversion of androgens to estrogen in postmenopausal women",
        sideEffects: "Arthralgia, osteoporosis, hot flashes, increased fracture risk, hypercholesterolemia",
        contra: "Premenopausal women (ineffective and stimulates ovarian function via feedback); pregnancy",
        pearl: "Only effective in postmenopausal women; monitor bone density with DEXA scans; supplement calcium and vitamin D; often used after 2-3 years of tamoxifen as sequential therapy"
      },
      {
        name: "Filgrastim (G-CSF)",
        type: "Colony-Stimulating Factor",
        action: "Binds G-CSF receptors on neutrophil precursors, stimulating proliferation, differentiation, and functional activation of neutrophils",
        sideEffects: "Bone pain (most common), splenic rupture (rare), leukocytosis, allergic reactions, ARDS",
        contra: "Known hypersensitivity to E. coli-derived proteins",
        pearl: "Administer 24 hours after chemotherapy completion (not concurrently); bone pain managed with acetaminophen or NSAIDs; monitor CBC with differential"
      },
      {
        name: "Ondansetron / Granisetron (Chemo Antiemetics)",
        type: "5-HT3 Receptor Antagonist",
        action: "Block serotonin 5-HT3 receptors in the CTZ and vagal afferents to prevent chemotherapy-induced nausea and vomiting",
        sideEffects: "QT prolongation, headache, constipation, dizziness, fatigue",
        contra: "Congenital long QT syndrome; concurrent apomorphine use (ondansetron)",
        pearl: "Cornerstone of CINV prevention given 30 minutes before chemotherapy; often combined with dexamethasone and NK1 antagonist for highly emetogenic regimens"
      },
      {
        name: "Dexamethasone (Antiemetic Use)",
        type: "Corticosteroid Antiemetic Adjunct",
        action: "Reduces inflammation in the CTZ and GI tract; enhances efficacy of 5-HT3 antagonists through unclear but well-established synergistic mechanism",
        sideEffects: "Hyperglycemia, insomnia, mood changes, immunosuppression, GI irritation",
        contra: "Active systemic fungal infection; uncontrolled diabetes (relative)",
        pearl: "Standard component of all antiemetic regimens for moderate-to-highly emetogenic chemotherapy; monitor blood glucose especially in diabetic patients"
      },
      {
        name: "Aprepitant",
        type: "NK1 Receptor Antagonist",
        action: "Blocks substance P binding at neurokinin-1 receptors in the brainstem vomiting center, preventing delayed CINV",
        sideEffects: "Fatigue, hiccups, diarrhea, decreased INR in warfarin users, hepatotoxicity",
        contra: "Concurrent pimozide or cisapride use; known hypersensitivity",
        pearl: "Primarily targets delayed CINV (24-120 hours post-chemo); interacts with CYP3A4 substrates including warfarin and oral contraceptives requiring dose monitoring"
      },
      {
        name: "Olanzapine (Antiemetic Use)",
        type: "Atypical Antipsychotic / Antiemetic",
        action: "Blocks multiple receptors (dopamine D2, serotonin 5-HT3, histamine H1) in the CTZ providing broad-spectrum antiemetic effect",
        sideEffects: "Sedation, weight gain, hyperglycemia, orthostatic hypotension, metabolic syndrome",
        contra: "Concurrent CNS depressants (use caution), uncontrolled diabetes, dementia-related psychosis in elderly",
        pearl: "Added to standard triple antiemetic therapy for highly emetogenic chemotherapy; low dose (5-10 mg) provides superior nausea control; causes significant sedation"
      },
      {
        name: "Allopurinol",
        type: "Xanthine Oxidase Inhibitor",
        action: "Inhibits xanthine oxidase, blocking conversion of hypoxanthine to xanthine and xanthine to uric acid, reducing uric acid production",
        sideEffects: "Rash (discontinue immediately if severe - Stevens-Johnson syndrome risk), hepatotoxicity, bone marrow suppression, GI upset",
        contra: "Concurrent azathioprine or 6-mercaptopurine without dose adjustment (allopurinol inhibits their metabolism)",
        pearl: "Start 1-2 days before chemotherapy for tumor lysis syndrome prophylaxis; adequate hydration essential; discontinue immediately if rash develops due to SJS risk"
      },
      {
        name: "Epinephrine",
        type: "Adrenergic Agonist (Alpha and Beta)",
        action: "Stimulates alpha-1 (vasoconstriction), beta-1 (increased HR and contractility), and beta-2 (bronchodilation) adrenergic receptors",
        sideEffects: "Tachycardia, hypertension, anxiety, tremor, palpitations, tissue necrosis with extravasation",
        contra: "No absolute contraindications in anaphylaxis or cardiac arrest; relative: narrow-angle glaucoma, concurrent MAOIs",
        pearl: "Anaphylaxis: 0.3 mg IM (1:1000) into anterolateral thigh, may repeat every 5-15 minutes; cardiac arrest: 1 mg IV (1:10,000) every 3-5 minutes; never delay for anaphylaxis"
      },
      {
        name: "Naloxone",
        type: "Opioid Antagonist",
        action: "Competitively binds mu-opioid receptors, displacing opioid agonists and reversing respiratory depression, sedation, and hypotension",
        sideEffects: "Acute opioid withdrawal (tachycardia, hypertension, diaphoresis, agitation, vomiting), pulmonary edema, seizures",
        contra: "Known hypersensitivity (rare); use cautiously in opioid-dependent patients (withdrawal)",
        pearl: "Duration of action (30-90 min) is shorter than most opioids; must monitor for re-sedation and be prepared to redose; available as intranasal spray for community use"
      },
      {
        name: "Atropine",
        type: "Anticholinergic / Parasympatholytic",
        action: "Blocks acetylcholine at muscarinic receptors, increasing heart rate by removing vagal tone on the SA and AV nodes",
        sideEffects: "Tachycardia, dry mouth, urinary retention, mydriasis, hyperthermia, confusion",
        contra: "Glaucoma (narrow-angle), obstructive uropathy, myasthenia gravis (may worsen)",
        pearl: "First-line for symptomatic bradycardia: 0.5 mg IV every 3-5 minutes (max 3 mg); also used as organophosphate poisoning antidote in much higher doses"
      },
      {
        name: "Amiodarone",
        type: "Class III Antiarrhythmic",
        action: "Blocks potassium, sodium, and calcium channels and has beta-blocking properties, prolonging action potential duration and refractory period",
        sideEffects: "Pulmonary toxicity, thyroid dysfunction (hypo and hyper), hepatotoxicity, corneal microdeposits, photosensitivity, peripheral neuropathy",
        contra: "Cardiogenic shock, severe sinus node dysfunction, second/third-degree heart block without pacemaker, iodine hypersensitivity",
        pearl: "ACLS drug for VF/pulseless VT: 300 mg IV push first dose, then 150 mg; long half-life (40-55 days); requires baseline and periodic PFTs, TFTs, LFTs, and ophthalmologic exams"
      },
      {
        name: "Adenosine",
        type: "Antiarrhythmic (Endogenous Nucleoside)",
        action: "Slows conduction through AV node by activating adenosine A1 receptors, increasing potassium conductance and hyperpolarizing nodal cells",
        sideEffects: "Transient asystole (expected), flushing, chest pressure, dyspnea, bronchospasm",
        contra: "Second or third-degree heart block, sick sinus syndrome without pacemaker, known bronchospastic disease (severe asthma)",
        pearl: "Must be given as rapid IV push via proximal site closest to heart followed immediately by 20 mL NS flush; half-life is less than 10 seconds; warn patient they may feel brief chest pressure and sense of impending doom"
      },
      {
        name: "Magnesium Sulfate",
        type: "Electrolyte / Antiarrhythmic / Tocolytic",
        action: "Stabilizes cardiac cell membranes, reduces neuromuscular excitability by blocking calcium influx at motor nerve terminals",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of deep tendon reflexes, cardiac arrest at toxic levels",
        contra: "Heart block, myocardial damage, renal failure without dose adjustment",
        pearl: "First-line for torsades de pointes and eclamptic seizures; monitor DTRs (loss = toxicity), respiratory rate (hold if <12), urine output; reversal agent is calcium gluconate"
      },
      {
        name: "Calcium Gluconate",
        type: "Electrolyte / Membrane Stabilizer",
        action: "Provides calcium ions that stabilize cardiac cell membranes, antagonizing effects of hyperkalemia and magnesium toxicity on cardiac conduction",
        sideEffects: "Bradycardia if given too rapidly, tissue necrosis with extravasation, hypercalcemia, nausea",
        contra: "Hypercalcemia, digoxin toxicity (calcium potentiates digoxin effect), ventricular fibrillation",
        pearl: "For hyperkalemia: stabilizes cardiac membrane (does not lower potassium); for magnesium toxicity: reverses respiratory depression; administer slowly IV with cardiac monitoring"
      },
      {
        name: "Hypertonic Saline (3% NaCl)",
        type: "Hyperosmolar Fluid",
        action: "Increases serum osmolality, drawing water out of cells including cerebral cells to reduce edema; rapidly raises serum sodium",
        sideEffects: "Osmotic demyelination syndrome (central pontine myelinolysis) if corrected too rapidly, fluid overload, hypernatremia",
        contra: "Hypernatremia; volume overload states without severe hyponatremia indication",
        pearl: "Reserved for severe symptomatic hyponatremia (seizures, obtundation); correct sodium no faster than 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome; requires ICU monitoring"
      },
      {
        name: "Routine Adult Vaccines (Influenza, Tdap, Pneumococcal, Shingles, HPV)",
        type: "Immunizations / Vaccines",
        action: "Stimulate adaptive immune response by presenting antigens (inactivated, recombinant, or live-attenuated) to generate memory B and T cells for future pathogen recognition",
        sideEffects: "Injection site pain, low-grade fever, myalgia, fatigue; rare anaphylaxis, Guillain-Barre syndrome",
        contra: "Live vaccines (Shingrix is recombinant, not live) contraindicated in severely immunocompromised; egg allergy consideration for some influenza formulations; HPV not given in pregnancy",
        pearl: "Annual influenza for all adults; Tdap once then Td every 10 years (Tdap each pregnancy); PCV20 or PCV15+PPSV23 for 65+ and high-risk adults; recombinant zoster vaccine (Shingrix) at age 50+; HPV through age 26 routine, shared decision 27-45"
      }
    ],
    pearls: [
      "Oral iron (ferrous sulfate) absorption is enhanced by vitamin C and inhibited by calcium, antacids, and tea; black stools are an expected finding, not a sign of GI bleeding",
      "Always correct B12 deficiency before giving folate alone, as folate can mask the hematologic findings of B12 deficiency while neurological damage progresses irreversibly",
      "Epinephrine for anaphylaxis is 0.3 mg IM into the anterolateral thigh (1:1000 concentration); for cardiac arrest it is 1 mg IV (1:10,000) every 3-5 minutes",
      "Naloxone has a shorter half-life than most opioids; patients require continuous monitoring after initial reversal and may need repeated doses to prevent re-sedation",
      "tPA for acute ischemic stroke requires door-to-needle time under 60 minutes; strict blood pressure parameters (under 185/110) must be maintained before and during infusion",
      "Adenosine must be given as the fastest possible IV push through a proximal port closest to the heart, immediately followed by a 20 mL normal saline flush",
      "Magnesium sulfate toxicity is monitored by checking deep tendon reflexes (absent = toxic), respiratory rate (hold if under 12), and urine output; calcium gluconate is the antidote"
    ],
    lifespan: {
      title: "Lifespan Considerations in Hematology",
      content: "Pediatric patients require weight-based dosing for all emergency medications; epinephrine autoinjectors come in 0.15 mg for children 15-30 kg and 0.3 mg for those over 30 kg. Elderly patients are more susceptible to bleeding complications with anticoagulants and thrombolytics due to age-related decline in hepatic metabolism and renal clearance. Pregnant patients should receive iron and folate supplementation routinely; tPA is relatively contraindicated in pregnancy. Vaccine schedules differ by age with special considerations for immunocompromised patients who cannot receive live vaccines. Neonates have immature hepatic conjugation and renal filtration, requiring careful dose adjustment for nearly all emergency medications."
    },
    quiz: [
      {
        question: "What enhances the absorption of oral ferrous sulfate?",
        options: ["Calcium carbonate", "Vitamin C (ascorbic acid)", "Antacids", "Dairy products"],
        correct: 1,
        rationale: "Vitamin C (ascorbic acid) reduces ferric iron to ferrous iron in the GI tract, enhancing absorption. Calcium, antacids, and dairy products all inhibit iron absorption."
      },
      {
        question: "A patient receiving magnesium sulfate for eclampsia has absent deep tendon reflexes. What is the priority nursing action?",
        options: [
          "Increase the infusion rate",
          "Stop the magnesium infusion and administer calcium gluconate",
          "Administer a fluid bolus",
          "Continue monitoring and reassess in 30 minutes"
        ],
        correct: 1,
        rationale: "Absent deep tendon reflexes indicate magnesium toxicity. The infusion must be stopped immediately and calcium gluconate administered as the antidote to prevent respiratory arrest and cardiac collapse."
      },
      {
        question: "Which reversal agent is used specifically for dabigatran toxicity?",
        options: ["Protamine sulfate", "Vitamin K", "Idarucizumab", "Andexanet alfa"],
        correct: 2,
        rationale: "Idarucizumab is a monoclonal antibody fragment that specifically binds dabigatran. Protamine reverses heparin, vitamin K reverses warfarin, and andexanet alfa reverses Factor Xa inhibitors."
      },
      {
        question: "After administering naloxone for opioid overdose, the patient regains consciousness. What is the most important ongoing nursing concern?",
        options: [
          "The patient may develop an allergic reaction to naloxone",
          "The patient may re-sedate because naloxone has a shorter half-life than most opioids",
          "The patient will develop permanent tolerance to opioids",
          "The patient no longer needs monitoring and can be discharged"
        ],
        correct: 1,
        rationale: "Naloxone duration of action (30-90 minutes) is shorter than most opioids. Patients must be monitored continuously for re-sedation and respiratory depression, and additional naloxone doses may be needed."
      },
      {
        question: "What is the maximum rate of sodium correction in severe hyponatremia to prevent osmotic demyelination syndrome?",
        options: ["4-6 mEq/L in 24 hours", "8-10 mEq/L in 24 hours", "15-20 mEq/L in 24 hours", "25-30 mEq/L in 24 hours"],
        correct: 1,
        rationale: "Sodium should be corrected no faster than 8-10 mEq/L in 24 hours. Rapid overcorrection causes osmotic demyelination syndrome (central pontine myelinolysis), which can result in irreversible neurological damage."
      }
    ]
  }
};