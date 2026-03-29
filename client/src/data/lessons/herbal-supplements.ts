import type { LessonContent } from "./types";

export const herbalSupplementsLessons: Record<string, LessonContent> = {
  "herbal-supplements-hub": {
    title: "Herbal Supplements & Medication Interactions",
    cellular: {
      title: "Phytopharmacology & Patient Safety",
      content: "Herbal supplements contain biologically active compounds that produce pharmacokinetic and pharmacodynamic interactions with conventional medications. Unlike FDA-regulated pharmaceuticals, dietary supplements in the United States are regulated under the Dietary Supplement Health and Education Act (DSHEA, 1994), which does not require pre-market proof of safety or efficacy. Over 50% of adults use at least one supplement, yet fewer than 40% disclose this to their healthcare providers. Nurses play a critical role in medication reconciliation by systematically asking about herbal, vitamin, and supplement use during every patient encounter. Key pharmacokinetic interactions involve cytochrome P450 enzyme induction or inhibition (especially CYP3A4, CYP2C9, CYP1A2), P-glycoprotein modulation, and alterations in drug absorption, distribution, or elimination. Pharmacodynamic interactions include additive anticoagulant effects, serotonergic activity, sedation, blood pressure changes, and blood glucose alterations."
    },
    riskFactors: [
      "Polypharmacy — patients on 5+ medications have exponentially higher interaction risk",
      "Elderly patients — altered hepatic and renal function increases susceptibility",
      "Patients on narrow therapeutic index drugs (warfarin, digoxin, lithium, phenytoin)",
      "Surgical patients — bleeding risk herbs must be discontinued 2–3 weeks preoperatively",
      "Patients with hepatic or renal insufficiency — impaired drug metabolism and excretion",
      "Patients on anticoagulant or antiplatelet therapy",
      "Pregnant or breastfeeding patients — many herbals are contraindicated",
      "Self-medicating patients who do not disclose supplement use to providers"
    ],
    diagnostics: [
      "Complete medication reconciliation including all herbal and dietary supplements at every encounter",
      "Monitor PT/INR in patients on anticoagulants who also use herbal supplements",
      "Liver function tests (AST, ALT, bilirubin) when hepatotoxic herbs are suspected (kava, comfrey, chaparral)",
      "Serum drug levels for narrow therapeutic index medications (digoxin, lithium, phenytoin, theophylline)",
      "Blood glucose monitoring in patients using hypoglycemia-risk supplements with antidiabetics",
      "Coagulation studies (PT, aPTT, platelet count) before surgery in patients reporting herbal use",
      "Serotonin syndrome assessment when combining serotonergic herbs with SSRIs/SNRIs"
    ],
    management: [
      "Document all disclosed herbal supplements in the electronic medication record",
      "Advise patients to discontinue all herbal supplements at least 2 weeks before elective surgery per surgical protocols",
      "Report any suspected herb-drug interactions to the prescriber immediately",
      "Educate patients that 'natural' does not mean 'safe' and that herbals can interact with medications",
      "Recommend patients purchase supplements from reputable manufacturers with third-party testing (USP, NSF)",
      "Collaborate with pharmacy for interaction screening when patients report new supplement use",
      "Follow institutional protocols for documentation and reporting of adverse herb-drug reactions"
    ],
    nursingActions: [
      "Ask specifically about herbal supplements, vitamins, teas, and OTC products during every medication history",
      "Use open-ended questions: 'What supplements, vitamins, or herbal products do you take?'",
      "Report use of bleeding-risk herbs (Ginkgo, Garlic, Ginger, Ginseng — the '4 Gs') to the surgical team preoperatively",
      "Monitor for signs of adverse interactions: unexpected bleeding, excessive sedation, serotonin syndrome symptoms",
      "Document all herbal products with dose, frequency, and reason for use in the medication administration record",
      "Educate patients about specific interactions relevant to their current medications",
      "Provide culturally sensitive education that respects the patient's belief system while ensuring safety",
      "Assess for signs of hepatotoxicity (jaundice, dark urine, RUQ pain) in patients taking hepatotoxic supplements"
    ],
    assessmentFindings: [
      "Unexplained bruising or prolonged bleeding may indicate anticoagulant-herb interaction",
      "Excessive drowsiness or sedation may indicate additive CNS depressant effect",
      "Agitation, clonus, hyperthermia, diaphoresis — serotonin syndrome from serotonergic herb-drug combination",
      "Unexpected hypoglycemia in diabetic patients may indicate glucose-lowering supplement interaction",
      "Elevated or sub-therapeutic drug levels despite medication compliance",
      "Hypertension or hypotension fluctuations with BP-affecting supplements",
      "Jaundice, elevated LFTs — possible hepatotoxicity from kava, comfrey, or other hepatotoxic herbs"
    ],
    signs: {
      left: [
        "Bleeding Risk Herbs: Ginkgo, Garlic, Ginger, Ginseng (4 Gs)",
        "Sedating Herbs: Valerian, Kava, Chamomile, Melatonin",
        "Serotonergic Herb: St. John's Wort — serotonin syndrome risk",
        "CYP3A4 Inducer: St. John's Wort — reduces drug levels",
        "BP-Lowering: Garlic, Hawthorn, CoQ10"
      ],
      right: [
        "Hepatotoxic Herbs: Kava, Comfrey, Chaparral",
        "Blood Sugar Reducers: Ginseng, Fenugreek, Bitter Melon",
        "Estrogenic Herbs: Black Cohosh, Red Clover, Dong Quai",
        "Surgery Risk: Discontinue ALL herbals 2 weeks pre-op",
        "Cranberry: Increases warfarin effect via CYP2C9"
      ]
    },
    medications: [
      { name: "St. John's Wort (Hypericum perforatum)", type: "Herbal — CYP3A4 Inducer", action: "Induces CYP3A4, CYP1A2, CYP2C9, and P-glycoprotein, dramatically reducing serum levels of many drugs", sideEffects: "Photosensitivity, serotonin syndrome with SSRIs", contra: "SSRIs, MAOIs, warfarin, digoxin, oral contraceptives, HIV protease inhibitors, cyclosporine", pearl: "Most dangerous herbal for drug interactions — can cause transplant rejection by reducing cyclosporine levels." },
      { name: "Ginkgo Biloba", type: "Herbal — Antiplatelet", action: "Inhibits platelet-activating factor (PAF), producing antiplatelet and vasodilatory effects", sideEffects: "Bleeding, headache, GI upset", contra: "Warfarin, aspirin, NSAIDs, heparin, antiplatelet agents", pearl: "Stop 2 weeks before surgery — spontaneous subdural hematomas reported." },
      { name: "Garlic (Allium sativum)", type: "Herbal — Antiplatelet/Antilipidemic", action: "Inhibits platelet aggregation via thromboxane pathway; mildly reduces cholesterol and BP", sideEffects: "Bleeding, GI upset, body odor", contra: "Warfarin, antiplatelet agents, saquinavir", pearl: "One of the '4 Gs' — stop 7–10 days before surgery." },
      { name: "Valerian Root (Valeriana officinalis)", type: "Herbal — Sedative/Anxiolytic", action: "Enhances GABA activity at GABA-A receptors, producing sedative and anxiolytic effects", sideEffects: "Drowsiness, headache, GI upset", contra: "Benzodiazepines, barbiturates, alcohol, other CNS depressants", pearl: "Taper gradually — abrupt discontinuation may cause withdrawal symptoms similar to benzodiazepines." }
    ],
    pearls: [
      "The '4 Gs' (Ginkgo, Garlic, Ginger, Ginseng) all increase bleeding risk — report to surgeon preoperatively",
      "St. John's Wort is the most clinically dangerous herbal due to extensive CYP450 enzyme induction",
      "Always ask 'What supplements, herbs, or natural products do you take?' — patients often do not consider supplements as 'medications'",
      "Natural ≠ Safe — herbal products are pharmacologically active and can cause serious adverse events",
      "All herbal supplements should be discontinued at least 2 weeks before elective surgery unless instructed otherwise"
    ],
    quiz: [
      {
        question: "Which herbal supplement is most likely to reduce the effectiveness of oral contraceptives, warfarin, and cyclosporine?",
        options: ["Ginkgo biloba", "St. John's Wort", "Valerian root", "Echinacea"],
        correct: 1,
        rationale: "St. John's Wort induces CYP3A4, CYP2C9, CYP1A2, and P-glycoprotein, dramatically increasing the metabolism of many drugs including oral contraceptives, warfarin, cyclosporine, digoxin, and HIV protease inhibitors."
      },
      {
        question: "A nurse is conducting a preoperative assessment. The patient reports taking ginkgo biloba daily. What is the priority nursing action?",
        options: ["Document the supplement use only", "Notify the surgeon and anesthesiologist", "Instruct the patient to continue the supplement", "No action needed for herbal supplements"],
        correct: 1,
        rationale: "Ginkgo biloba has antiplatelet properties that increase bleeding risk during surgery. The surgical team must be notified so appropriate discontinuation (typically 2 weeks preoperatively) can be ordered."
      },
      {
        question: "Which group of herbal supplements is commonly associated with increased bleeding risk? (Select the memory aid)",
        options: ["The 4 Bs: Bilberry, Black Cohosh, Boswellia, Butterbur", "The 4 Gs: Ginkgo, Garlic, Ginger, Ginseng", "The 4 Vs: Valerian, Vitamin E, Vinpocetine, Vitex", "The 4 Es: Echinacea, Evening Primrose, Elderberry, Ephedra"],
        correct: 1,
        rationale: "The '4 Gs' (Ginkgo, Garlic, Ginger, Ginseng) is a well-known nursing mnemonic for herbal supplements that inhibit platelet aggregation and increase bleeding risk, particularly dangerous in patients on anticoagulants or undergoing surgery."
      },
      {
        question: "A patient taking an SSRI antidepressant begins using St. John's Wort for mood support. Which adverse effect is the nurse most concerned about?",
        options: ["Hepatotoxicity", "Serotonin syndrome", "Renal failure", "Hyperkalemia"],
        correct: 1,
        rationale: "St. John's Wort has serotonergic activity. Combined with SSRIs, it can cause serotonin syndrome — a potentially life-threatening condition characterized by agitation, hyperthermia, clonus, diaphoresis, and altered mental status."
      },
      {
        question: "During medication reconciliation, a patient states: 'I only take vitamins and some natural herbs — nothing important.' What is the best nursing response?",
        options: ["'That's fine, we don't need to document those.'", "'Could you tell me exactly which herbs, vitamins, and supplements you take, including the amounts and how often?'", "'Just continue taking them as usual.'", "'Herbs can't interact with medications, so we don't need details.'"],
        correct: 1,
        rationale: "Patients often do not consider supplements as medications. The nurse must ask specifically and document all herbal products, vitamins, and supplements with dosages, as they can have clinically significant interactions with prescribed medications."
      },
      {
        question: "Which herbal supplement is most associated with hepatotoxicity and has been banned in several countries?",
        options: ["Echinacea", "Chamomile", "Kava", "Cranberry"],
        correct: 2,
        rationale: "Kava (Piper methysticum) has been associated with severe hepatotoxicity including liver failure requiring transplantation. It has been banned or restricted in Germany, Switzerland, France, Canada, and the UK."
      }
    ]
  },

  "st-johns-wort": {
    title: "St. John's Wort (Hypericum perforatum)",
    cellular: {
      title: "Pharmacology of St. John's Wort",
      content: "St. John's Wort contains hypericin and hyperforin, which inhibit reuptake of serotonin, norepinephrine, and dopamine. Hyperforin is a potent inducer of cytochrome P450 enzymes (CYP3A4, CYP2C9, CYP1A2) and P-glycoprotein efflux transporter. This dual mechanism makes it both a serotonergic agent (pharmacodynamic risk) and a profound enzyme inducer (pharmacokinetic risk), resulting in the most extensive drug interaction profile of any herbal supplement. CYP3A4 induction alone affects approximately 50% of all prescribed medications."
    },
    riskFactors: [
      "Concurrent use of SSRIs, SNRIs, or MAOIs — serotonin syndrome risk",
      "Patients on warfarin, cyclosporine, or digoxin — sub-therapeutic drug levels",
      "Women using hormonal contraceptives — breakthrough bleeding and unintended pregnancy",
      "HIV patients on protease inhibitors or NNRTIs — treatment failure",
      "Transplant recipients on immunosuppressants — rejection risk",
      "Patients on cardiovascular drugs metabolized by CYP3A4",
      "Fair-skinned patients — photosensitivity risk",
      "Patients with bipolar disorder — may trigger mania"
    ],
    diagnostics: [
      "Monitor serum drug levels of narrow therapeutic index medications (digoxin, cyclosporine, tacrolimus, phenytoin)",
      "Check INR frequently if patient on warfarin concurrently or after discontinuation",
      "Monitor for signs of serotonin syndrome: vital signs, mental status, neuromuscular exam",
      "Liver function tests if hepatotoxicity suspected",
      "Pregnancy test in women on hormonal contraceptives who report St. John's Wort use",
      "Monitor therapeutic response of concurrent medications for loss of efficacy"
    ],
    management: [
      "Discontinue St. John's Wort if patient is on interacting medications — coordinate with prescriber",
      "Counsel patients to inform ALL providers about St. John's Wort use",
      "Advise use of barrier contraception in addition to hormonal methods during and for 28 days after discontinuation",
      "Closely monitor drug levels after discontinuation — CYP induction may take 1–2 weeks to resolve",
      "Treat serotonin syndrome emergently with supportive care, benzodiazepines, and cyproheptadine if severe",
      "Never combine with SSRIs, SNRIs, MAOIs, triptans, or meperidine"
    ],
    nursingActions: [
      "Screen all patients taking antidepressants, anticoagulants, immunosuppressants, or HIV medications for St. John's Wort use",
      "Educate patients that St. John's Wort can make many prescription medications ineffective",
      "Report any new use to the prescriber immediately",
      "Monitor for photosensitivity reactions — advise sunscreen and sun-protective clothing",
      "Assess for serotonin syndrome: agitation, tremor, clonus, hyperthermia, diaphoresis",
      "Document specific product, dose, frequency, and duration of use"
    ],
    signs: {
      left: [
        "Reduced efficacy: Warfarin (lower INR)",
        "Reduced efficacy: Digoxin (subtherapeutic levels)",
        "Reduced efficacy: Oral contraceptives (breakthrough bleeding)",
        "Photosensitivity reactions with sun exposure"
      ],
      right: [
        "Serotonin Syndrome: Agitation, hyperthermia, clonus",
        "Transplant rejection from cyclosporine reduction",
        "HIV treatment failure from protease inhibitor reduction",
        "Mania in patients with bipolar disorder"
      ]
    },
    medications: [
      { name: "St. John's Wort + Warfarin", type: "CYP2C9 Induction", action: "Increases warfarin metabolism, reducing INR and anticoagulant effect", sideEffects: "Thromboembolic events from inadequate anticoagulation", contra: "Concurrent warfarin therapy", pearl: "INR may drop by 50% — monitor closely and adjust warfarin dose if discontinuing." },
      { name: "St. John's Wort + SSRIs", type: "Serotonergic Synergism", action: "Additive serotonin reuptake inhibition causing excessive serotonergic activity", sideEffects: "Serotonin syndrome", contra: "All SSRIs, SNRIs, MAOIs, triptans", pearl: "This combination can be fatal — never combine." },
      { name: "St. John's Wort + Cyclosporine", type: "CYP3A4/P-gp Induction", action: "Dramatically reduces cyclosporine blood levels, risking transplant rejection", sideEffects: "Acute organ rejection", contra: "All transplant recipients", pearl: "Case reports of heart transplant rejection within weeks of starting St. John's Wort." },
      { name: "St. John's Wort + Oral Contraceptives", type: "CYP3A4 Induction", action: "Increases metabolism of ethinyl estradiol and progestins", sideEffects: "Breakthrough bleeding, contraceptive failure, unintended pregnancy", contra: "Women relying solely on hormonal contraception", pearl: "Advise barrier methods during use and for 28 days after stopping." }
    ],
    pearls: [
      "St. John's Wort is the single most dangerous herbal supplement for drug interactions",
      "CYP3A4 induction affects ~50% of all prescribed medications — assume interaction until proven otherwise",
      "Effects persist 1–2 weeks after discontinuation due to slow enzyme de-induction",
      "Transplant rejection cases have been directly attributed to St. John's Wort use",
      "Exam pearl: If a question mentions a patient's 'herbal antidepressant,' think St. John's Wort immediately"
    ],
    quiz: [
      {
        question: "A patient on cyclosporine after kidney transplant reports starting St. John's Wort for depression. What is the priority nursing action?",
        options: ["Monitor for signs of depression improvement", "Notify the transplant team immediately", "Encourage the patient to continue for 2 weeks", "Assess blood pressure"],
        correct: 1,
        rationale: "St. John's Wort induces CYP3A4 and P-glycoprotein, dramatically reducing cyclosporine levels. This can cause acute organ rejection. The transplant team must be notified immediately to discontinue St. John's Wort and adjust cyclosporine dosing."
      },
      {
        question: "A woman taking oral contraceptives and St. John's Wort reports irregular spotting. What should the nurse advise?",
        options: ["This is normal; continue both", "St. John's Wort may be reducing contraceptive effectiveness — use barrier methods and consult prescriber", "Increase the contraceptive dose", "Switch to a different herbal supplement"],
        correct: 1,
        rationale: "St. John's Wort induces CYP3A4, increasing metabolism of ethinyl estradiol and progestins. Breakthrough bleeding indicates reduced contraceptive efficacy. The patient should use barrier contraception and consult the prescriber."
      },
      {
        question: "Which cytochrome P450 enzyme is most significantly induced by St. John's Wort?",
        options: ["CYP2D6", "CYP2E1", "CYP3A4", "CYP2B6"],
        correct: 2,
        rationale: "St. John's Wort is a potent inducer of CYP3A4, the most important drug-metabolizing enzyme responsible for metabolizing approximately 50% of all prescribed medications. It also induces CYP2C9, CYP1A2, and P-glycoprotein."
      },
      {
        question: "A patient taking sertraline (Zoloft) and St. John's Wort develops agitation, tremor, diaphoresis, and fever. Which condition should the nurse suspect?",
        options: ["Neuroleptic malignant syndrome", "Serotonin syndrome", "Malignant hyperthermia", "Anticholinergic toxicity"],
        correct: 1,
        rationale: "The combination of sertraline (an SSRI) with St. John's Wort (which also inhibits serotonin reuptake) can cause serotonin syndrome. Symptoms include agitation, clonus, tremor, hyperthermia, and diaphoresis."
      },
      {
        question: "After a patient discontinues St. John's Wort, how long should the nurse expect CYP enzyme induction effects to persist?",
        options: ["24 hours", "48 hours", "1–2 weeks", "3–6 months"],
        correct: 2,
        rationale: "CYP3A4 enzyme induction from St. John's Wort takes 1–2 weeks to fully resolve after discontinuation. During this period, drug levels of previously interacting medications will gradually increase, requiring close monitoring."
      }
    ]
  },

  "ginkgo-biloba": {
    title: "Ginkgo Biloba",
    cellular: {
      title: "Pharmacology of Ginkgo Biloba",
      content: "Ginkgo biloba leaf extract contains flavonoid glycosides (quercetin, kaempferol) and terpene lactones (ginkgolides A, B, C, and bilobalide). Ginkgolide B is a potent and selective antagonist of platelet-activating factor (PAF), which inhibits platelet aggregation, increases bleeding time, and produces vasodilatory effects. Ginkgo also acts as a free radical scavenger (antioxidant) and enhances nitric oxide-mediated vasodilation in cerebral and peripheral vasculature. It is commonly marketed for memory enhancement and peripheral vascular insufficiency, though large clinical trials (GEM study) have not supported cognitive benefits in healthy adults."
    },
    riskFactors: [
      "Patients on anticoagulants (warfarin, heparin) or antiplatelet agents (aspirin, clopidogrel)",
      "Patients scheduled for surgery or invasive procedures",
      "Patients with bleeding disorders or thrombocytopenia",
      "Concurrent NSAID use — additive bleeding risk",
      "Elderly patients — higher baseline bleeding risk and fall risk",
      "Patients with seizure disorders — ginkgotoxin in seeds may lower seizure threshold"
    ],
    diagnostics: [
      "Monitor PT/INR in patients concurrently using anticoagulants",
      "Bleeding time assessment if excessive bruising reported",
      "Platelet count and coagulation studies preoperatively",
      "Monitor for intracranial bleeding signs: headache, vision changes, neurological deficits",
      "Assess surgical sites for prolonged oozing or hematoma formation"
    ],
    management: [
      "Discontinue at least 2 weeks (14 days) before any scheduled surgery or invasive procedure",
      "Report concurrent use to the prescriber if patient is on anticoagulants",
      "Educate patients about increased bleeding risk and signs to report",
      "Monitor for spontaneous bleeding: gums, nosebleeds, petechiae, easy bruising",
      "Advise patients to avoid combining with aspirin, NSAIDs, or other antiplatelet agents"
    ],
    nursingActions: [
      "Screen preoperative patients specifically for ginkgo biloba use",
      "Report use to the surgical and anesthesia team immediately",
      "Monitor for unusual bleeding or prolonged bleeding from minor cuts",
      "Educate patients about the difference between supplement marketing claims and evidence-based benefits",
      "Document ginkgo use in the medication record with dose and frequency"
    ],
    signs: {
      left: [
        "Easy bruising or petechiae",
        "Nosebleeds (epistaxis)",
        "Gingival bleeding",
        "Prolonged bleeding from cuts"
      ],
      right: [
        "Spontaneous subdural hematoma (reported in literature)",
        "Post-surgical hemorrhage",
        "Hyphema (bleeding into anterior chamber of eye)",
        "GI bleeding"
      ]
    },
    medications: [
      { name: "Ginkgo + Warfarin", type: "Anticoagulant Interaction", action: "PAF antagonism adds to warfarin's anticoagulant effect, increasing bleeding risk", sideEffects: "Major hemorrhage, elevated INR", contra: "Active anticoagulant therapy", pearl: "Case reports of fatal intracranial hemorrhage with this combination." },
      { name: "Ginkgo + Aspirin", type: "Antiplatelet Interaction", action: "Additive antiplatelet effects increase bleeding risk", sideEffects: "GI bleeding, intracranial hemorrhage", contra: "Dual antiplatelet therapy", pearl: "Spontaneous hyphema reported in a patient on aspirin + ginkgo." },
      { name: "Ginkgo + Ibuprofen/NSAIDs", type: "Antiplatelet + Anti-inflammatory", action: "NSAIDs inhibit COX, ginkgo inhibits PAF — combined antiplatelet effects", sideEffects: "GI hemorrhage, prolonged bleeding time", contra: "Chronic NSAID use", pearl: "Fatal intracerebral hemorrhage reported with ginkgo + ibuprofen." }
    ],
    pearls: [
      "Ginkgo is one of the '4 Gs' — Ginkgo, Garlic, Ginger, Ginseng — all increase bleeding risk",
      "Stop at least 2 weeks before surgery — PAF antagonism takes time to reverse",
      "Large clinical trials (GEM study, 3,000+ participants) found no cognitive benefit in healthy adults",
      "Spontaneous subdural hematoma has been directly attributed to ginkgo use",
      "Exam tip: If a preoperative patient reports ginkgo use, the correct answer is always 'notify the surgeon'"
    ],
    quiz: [
      {
        question: "A patient scheduled for hip replacement surgery reports taking ginkgo biloba daily. When should the supplement be discontinued?",
        options: ["1 day before surgery", "The morning of surgery", "At least 2 weeks before surgery", "It does not need to be discontinued"],
        correct: 2,
        rationale: "Ginkgo biloba inhibits platelet-activating factor (PAF) and requires at least 2 weeks for its antiplatelet effects to fully resolve. Failure to discontinue increases surgical bleeding risk, including risk of hematoma formation."
      },
      {
        question: "A patient on warfarin develops spontaneous nosebleeds and bruising. The patient recently started ginkgo biloba. What is the nurse's priority assessment?",
        options: ["Check blood glucose", "Obtain PT/INR", "Assess blood pressure", "Check hemoglobin A1C"],
        correct: 1,
        rationale: "Ginkgo biloba has antiplatelet properties that add to warfarin's anticoagulant effect. The combination significantly increases bleeding risk. Obtaining PT/INR is the priority to assess the degree of anticoagulation."
      },
      {
        question: "Which mechanism explains ginkgo biloba's antiplatelet effect?",
        options: ["COX-1 inhibition", "Thrombin inhibition", "Platelet-activating factor (PAF) antagonism", "Vitamin K antagonism"],
        correct: 2,
        rationale: "Ginkgolide B, a terpene lactone in ginkgo, is a potent antagonist of platelet-activating factor (PAF). PAF antagonism inhibits platelet aggregation and increases bleeding time."
      },
      {
        question: "A nurse is educating a patient about ginkgo biloba. Which statement indicates the patient needs further teaching?",
        options: ["'I should tell my surgeon I take ginkgo before any surgery.'", "'Ginkgo can increase my risk of bleeding.'", "'Ginkgo is natural so it's safe to take with my blood thinner.'", "'I should stop ginkgo 2 weeks before my procedure.'"],
        correct: 2,
        rationale: "The statement 'it's natural so it's safe' demonstrates a common misconception. Ginkgo has potent antiplatelet effects and significantly increases bleeding risk when combined with anticoagulants like warfarin."
      },
      {
        question: "Which combination places a patient at greatest risk for intracranial hemorrhage?",
        options: ["Ginkgo + acetaminophen", "Ginkgo + warfarin + aspirin", "Ginkgo + melatonin", "Ginkgo + vitamin C"],
        correct: 1,
        rationale: "Ginkgo (PAF antagonist) + warfarin (vitamin K antagonist) + aspirin (COX inhibitor) creates triple anticoagulant/antiplatelet activity, placing the patient at extremely high risk for hemorrhage including intracranial bleeding."
      }
    ]
  },

  "garlic-supplement": {
    title: "Garlic (Allium sativum)",
    cellular: {
      title: "Pharmacology of Garlic Supplements",
      content: "Garlic's primary active compound is allicin (diallyl thiosulfinate), released when alliin is converted by the enzyme alliinase during crushing or chopping. Allicin and its metabolites (ajoene, vinyl dithiins) inhibit platelet aggregation by blocking thromboxane synthesis and calcium-dependent mechanisms. Garlic also inhibits HMG-CoA reductase (the same target as statins), producing modest cholesterol-lowering effects (5–10% LDL reduction). Additionally, garlic stimulates nitric oxide synthase, promoting vasodilation and modest blood pressure reduction (5–8 mmHg systolic). Aged garlic extract contains S-allyl cysteine and other water-soluble organosulfur compounds with antioxidant properties."
    },
    riskFactors: [
      "Patients on anticoagulants (warfarin) or antiplatelet agents (aspirin, clopidogrel)",
      "Patients scheduled for surgery — increased bleeding risk",
      "Patients on saquinavir (HIV protease inhibitor) — garlic reduces drug levels by 50%",
      "Patients on hypoglycemic agents — additive blood sugar lowering",
      "Patients with bleeding disorders",
      "Concurrent NSAID use"
    ],
    diagnostics: [
      "Monitor PT/INR in patients on warfarin who use garlic supplements",
      "Bleeding time if unexplained bruising occurs",
      "Blood glucose monitoring in diabetic patients using supplemental garlic",
      "HIV viral load and CD4 counts if patient on saquinavir reports garlic supplement use"
    ],
    management: [
      "Discontinue garlic supplements at least 7–10 days before elective surgery",
      "Report concurrent use with anticoagulants to prescriber",
      "Educate about additive bleeding risk with aspirin and NSAIDs",
      "Advise HIV patients on protease inhibitors to avoid supplemental garlic",
      "Dietary garlic in food amounts is generally safe — supplemental doses carry interaction risk"
    ],
    nursingActions: [
      "Differentiate between dietary garlic use and supplemental garlic (higher, concentrated doses)",
      "Ask preoperative patients specifically about garlic supplements",
      "Monitor for signs of bleeding: bruising, gingival bleeding, melena, hematuria",
      "Document garlic supplement use including dose and formulation (raw, aged, oil)",
      "Educate that supplemental garlic at high doses has different risk profiles than culinary use"
    ],
    signs: {
      left: [
        "Easy bruising",
        "Gingival bleeding",
        "Increased menstrual bleeding",
        "Body and breath odor"
      ],
      right: [
        "GI upset: heartburn, nausea, flatulence",
        "Surgical hemorrhage risk",
        "Contact dermatitis (topical use)",
        "Reduced saquinavir levels (HIV treatment failure)"
      ]
    },
    medications: [
      { name: "Garlic + Warfarin", type: "Antiplatelet + Anticoagulant", action: "Garlic inhibits thromboxane synthesis; warfarin inhibits clotting factors — additive bleeding risk", sideEffects: "Hemorrhage, elevated INR", contra: "Active anticoagulant therapy at high garlic doses", pearl: "Dietary garlic is generally safe; supplemental doses are the concern." },
      { name: "Garlic + Saquinavir", type: "CYP3A4 Interaction", action: "Garlic reduces saquinavir AUC by approximately 50%, reducing antiviral efficacy", sideEffects: "HIV treatment failure, viral resistance", contra: "Concurrent saquinavir therapy", pearl: "This is a significant and well-documented interaction — garlic supplements should be avoided with protease inhibitors." }
    ],
    pearls: [
      "Garlic is one of the '4 Gs' — all increase bleeding risk",
      "Stop supplemental garlic 7–10 days before surgery",
      "Dietary garlic in cooking is generally safe — supplement doses are much higher and concentrated",
      "Garlic reduces saquinavir (HIV drug) levels by ~50% — clinically significant",
      "Allicin is the primary active compound responsible for most pharmacological effects"
    ],
    quiz: [
      {
        question: "A patient taking warfarin reports using garlic supplements for cholesterol. What concern should the nurse prioritize?",
        options: ["GI upset from garlic", "Increased bleeding risk", "Hypertension", "Hyperglycemia"],
        correct: 1,
        rationale: "Garlic inhibits platelet aggregation by blocking thromboxane synthesis. Combined with warfarin (which inhibits clotting factor synthesis), this creates additive bleeding risk. The nurse should assess for bleeding and monitor PT/INR."
      },
      {
        question: "An HIV patient on saquinavir begins taking garlic supplements. Which laboratory change is most concerning?",
        options: ["Decreased hemoglobin", "Increased viral load", "Elevated blood glucose", "Decreased platelets"],
        correct: 1,
        rationale: "Garlic supplements reduce saquinavir levels by approximately 50%, which can lead to inadequate viral suppression, increased viral load, and development of drug resistance."
      },
      {
        question: "How many days before surgery should garlic supplements be discontinued?",
        options: ["1–2 days", "3–5 days", "7–10 days", "21–28 days"],
        correct: 2,
        rationale: "Garlic supplements should be discontinued 7–10 days before elective surgery to allow the antiplatelet effects of allicin and ajoene to resolve and reduce surgical bleeding risk."
      },
      {
        question: "What is the primary active compound in garlic responsible for its antiplatelet effects?",
        options: ["Hyperforin", "Allicin", "Ginsenoside", "Valerenic acid"],
        correct: 1,
        rationale: "Allicin (diallyl thiosulfinate) is the primary bioactive compound in garlic. It inhibits platelet aggregation by blocking thromboxane synthesis and calcium-dependent platelet activation pathways."
      },
      {
        question: "A patient asks if dietary garlic in cooking carries the same risks as garlic supplements. What is the best nursing response?",
        options: ["All garlic use is dangerous and must be avoided", "Dietary garlic in normal cooking amounts is generally safe; concentrated supplements carry higher interaction risks", "Garlic is completely safe in any form", "Only raw garlic is dangerous"],
        correct: 1,
        rationale: "Dietary garlic in normal culinary amounts is generally considered safe. However, garlic supplements provide concentrated doses of allicin and other active compounds that carry significantly higher interaction risks, particularly with anticoagulants."
      }
    ]
  },

  "ginseng-supplement": {
    title: "Ginseng (Panax ginseng)",
    cellular: {
      title: "Pharmacology of Ginseng",
      content: "Panax ginseng (Asian/Korean ginseng) contains ginsenosides (triterpenoid saponins) that modulate multiple physiological pathways. Ginsenosides Rg1 and Rb1 have opposing effects on vascular tone and CNS stimulation. Ginseng inhibits platelet aggregation through thromboxane A2 pathway inhibition and nitric oxide stimulation. It also stimulates insulin secretion and improves insulin sensitivity through AMPK activation, which can lower blood glucose. Ginseng has mild estrogenic properties via estrogen receptor binding, and some preparations have been shown to reduce warfarin efficacy. American ginseng (Panax quinquefolius) has distinct pharmacology, primarily reducing postprandial blood glucose."
    },
    riskFactors: [
      "Patients on warfarin — ginseng may reduce INR",
      "Patients on insulin or oral hypoglycemics — additive hypoglycemia risk",
      "Patients on antiplatelet agents — additive bleeding risk",
      "Patients on MAOIs — ginseng may potentiate stimulant effects, causing mania or insomnia",
      "Patients with hormone-sensitive cancers — weak estrogenic effects",
      "Patients with hypertension — some preparations may increase BP",
      "Patients scheduled for surgery"
    ],
    diagnostics: [
      "Monitor INR in patients on warfarin who use ginseng",
      "Blood glucose monitoring — ginseng may cause hypoglycemia with antidiabetic medications",
      "Blood pressure monitoring — variable effects on BP",
      "Assess for bleeding signs if patient on antiplatelet therapy",
      "Monitor estrogen-dependent tumor markers in patients with hormone-sensitive cancers"
    ],
    management: [
      "Discontinue at least 7 days before elective surgery",
      "Adjust warfarin dose if ginseng is started or stopped — INR may change",
      "Monitor blood glucose closely in diabetic patients starting ginseng",
      "Avoid in patients with hormone-sensitive cancers (breast, ovarian, uterine)",
      "Educate that different ginseng species (Panax vs. Siberian) have different effects"
    ],
    nursingActions: [
      "Clarify which type of ginseng the patient is taking (Asian/Korean, American, Siberian)",
      "Monitor for hypoglycemia symptoms in diabetic patients",
      "Assess blood pressure trends — ginseng may increase or decrease BP",
      "Report ginseng use in preoperative patients to the surgical team",
      "Educate about potential insomnia and overstimulation effects"
    ],
    signs: {
      left: [
        "Hypoglycemia: shakiness, sweating, confusion",
        "Insomnia and nervousness",
        "Headache",
        "GI upset"
      ],
      right: [
        "Bleeding (antiplatelet effect)",
        "Altered warfarin response (reduced INR)",
        "Hypertension with some preparations",
        "Estrogenic effects (vaginal bleeding, breast tenderness)"
      ]
    },
    medications: [
      { name: "Ginseng + Warfarin", type: "Anticoagulant Interaction", action: "Panax ginseng may reduce warfarin efficacy, lowering INR", sideEffects: "Sub-therapeutic anticoagulation, thromboembolic risk", contra: "Concurrent warfarin without monitoring", pearl: "Unlike the other '4 Gs,' ginseng may DECREASE warfarin effect while still increasing bleeding risk through antiplatelet mechanisms." },
      { name: "Ginseng + Insulin/Oral Hypoglycemics", type: "Hypoglycemia Risk", action: "Ginseng stimulates insulin secretion and improves insulin sensitivity via AMPK activation", sideEffects: "Hypoglycemia", contra: "Unmonitored concurrent use with tight glucose control", pearl: "American ginseng specifically reduces postprandial blood glucose — monitor closely." },
      { name: "Ginseng + MAOIs", type: "CNS Stimulation", action: "Ginseng's stimulant properties may be potentiated by MAOIs", sideEffects: "Mania, insomnia, headache, tremor", contra: "Concurrent MAOI therapy", pearl: "This combination can cause significant CNS stimulation — avoid." }
    ],
    pearls: [
      "Ginseng is one of the '4 Gs' but has a unique interaction with warfarin — it may REDUCE INR",
      "Distinguish between Panax ginseng (Asian), Panax quinquefolius (American), and Eleutherococcus (Siberian — not true ginseng)",
      "American ginseng primarily affects blood glucose; Asian ginseng has broader pharmacological effects",
      "Stop 7 days before surgery due to antiplatelet effects",
      "Exam tip: Ginseng + warfarin = monitor INR; Ginseng + insulin = monitor blood glucose"
    ],
    quiz: [
      {
        question: "A diabetic patient on insulin starts taking American ginseng supplements. Which complication should the nurse monitor for?",
        options: ["Hyperglycemia", "Hypoglycemia", "Hypernatremia", "Hypertension"],
        correct: 1,
        rationale: "American ginseng (Panax quinquefolius) reduces postprandial blood glucose. Combined with insulin, this creates additive hypoglycemia risk. The nurse should monitor blood glucose closely and educate the patient about hypoglycemia signs."
      },
      {
        question: "A patient on warfarin starts using Panax ginseng. What INR change should the nurse anticipate?",
        options: ["Increased INR (more anticoagulated)", "Decreased INR (less anticoagulated)", "No change in INR", "INR becomes unmeasurable"],
        correct: 1,
        rationale: "Unlike other bleeding-risk herbs, Panax ginseng may reduce warfarin's anticoagulant effect, resulting in a decreased INR. However, ginseng still has antiplatelet properties that increase bleeding risk through a different mechanism."
      },
      {
        question: "Which type of ginseng is most associated with lowering postprandial blood glucose?",
        options: ["Panax ginseng (Asian/Korean)", "Panax quinquefolius (American)", "Eleutherococcus senticosus (Siberian)", "Withania somnifera (Ashwagandha)"],
        correct: 1,
        rationale: "American ginseng (Panax quinquefolius) has been specifically studied and shown to reduce postprandial blood glucose levels. Asian/Korean ginseng (Panax ginseng) has broader pharmacological effects including stimulant and adaptogenic properties."
      },
      {
        question: "A patient with estrogen-receptor positive breast cancer asks about using ginseng for energy. What should the nurse advise?",
        options: ["Ginseng is safe and effective for energy", "Ginseng has weak estrogenic properties and should be avoided with hormone-sensitive cancers", "Only American ginseng is safe", "Ginseng has no estrogenic effects"],
        correct: 1,
        rationale: "Ginseng has weak estrogenic properties through estrogen receptor binding. In patients with hormone-sensitive cancers (breast, ovarian, uterine), even weak estrogenic stimulation could potentially promote tumor growth."
      },
      {
        question: "How many days before surgery should ginseng supplements be discontinued?",
        options: ["1 day", "3 days", "7 days", "No discontinuation needed"],
        correct: 2,
        rationale: "Ginseng should be discontinued at least 7 days before surgery due to its antiplatelet effects. As one of the '4 Gs,' ginseng inhibits platelet aggregation and increases surgical bleeding risk."
      }
    ]
  },

  "echinacea-supplement": {
    title: "Echinacea (Echinacea purpurea)",
    cellular: {
      title: "Pharmacology of Echinacea",
      content: "Echinacea contains alkylamides, polysaccharides, glycoproteins, and caffeic acid derivatives that modulate immune function. Alkylamides bind to cannabinoid CB2 receptors, modulating inflammatory cytokine production (TNF-alpha, IL-1, IL-6). Polysaccharides activate macrophages and increase phagocytic activity. Echinacea inhibits CYP1A2 and CYP3A4 (intestinal, not hepatic), which may increase levels of drugs metabolized by these enzymes. It is commonly used to prevent or shorten duration of upper respiratory infections, though evidence of efficacy is inconsistent. Continuous use beyond 8 weeks is not recommended due to potential immunosuppressive effects with prolonged use."
    },
    riskFactors: [
      "Patients on immunosuppressants (cyclosporine, tacrolimus, corticosteroids) — may counteract immunosuppression",
      "Patients with autoimmune diseases (lupus, RA, MS) — may exacerbate immune-mediated inflammation",
      "Transplant recipients — immune stimulation risks rejection",
      "Patients with progressive systemic diseases (TB, HIV/AIDS) — immune modulation may be unpredictable",
      "Patients with allergies to Asteraceae/Compositae family plants (ragweed, chrysanthemums, marigolds, daisies)",
      "Prolonged use beyond 8 weeks — may become immunosuppressive"
    ],
    diagnostics: [
      "Monitor immunosuppressant drug levels if patient is taking echinacea concurrently",
      "Assess for allergic reactions in patients with Asteraceae plant allergies",
      "Monitor autoimmune disease markers if patient with autoimmune condition is using echinacea",
      "Monitor transplant function labs (creatinine for kidney, LFTs for liver transplants)"
    ],
    management: [
      "Advise against use in patients on immunosuppressants or with autoimmune diseases",
      "Limit use to 10–14 days for acute cold symptoms — not for long-term prophylaxis",
      "Screen for Asteraceae plant allergies before recommending",
      "Educate that evidence for cold prevention/treatment is inconsistent",
      "Report use to prescriber if patient is on immunosuppressive therapy"
    ],
    nursingActions: [
      "Ask about echinacea use in immunosuppressed patients and transplant recipients",
      "Assess for allergic reactions: rash, itching, wheezing, anaphylaxis (rare)",
      "Educate that prolonged continuous use (>8 weeks) is not recommended",
      "Document echinacea use with dose, formulation (tincture, capsule, tea), and duration",
      "Monitor for signs of autoimmune flare in patients with rheumatologic conditions"
    ],
    signs: {
      left: [
        "Allergic reactions (rash, urticaria, pruritus)",
        "GI upset: nausea, abdominal pain",
        "Dizziness",
        "Headache"
      ],
      right: [
        "Anaphylaxis (rare — atopy and Asteraceae allergy are risk factors)",
        "Autoimmune disease flare",
        "Transplant rejection (theoretical with immunosuppressants)",
        "Hepatotoxicity with prolonged use (rare)"
      ]
    },
    medications: [
      { name: "Echinacea + Immunosuppressants", type: "Pharmacodynamic Antagonism", action: "Echinacea stimulates immune function, potentially counteracting immunosuppressive drug effects", sideEffects: "Transplant rejection, autoimmune flare", contra: "Transplant recipients, patients on immunosuppressive therapy", pearl: "Theoretically dangerous combination — immune stimulation can trigger rejection or autoimmune crisis." },
      { name: "Echinacea + CYP3A4 Substrates", type: "Enzyme Inhibition", action: "Echinacea inhibits intestinal CYP3A4, potentially increasing first-pass drug levels", sideEffects: "Increased drug toxicity", contra: "Narrow therapeutic index drugs metabolized by CYP3A4", pearl: "Intestinal (not hepatic) CYP3A4 inhibition — affects first-pass metabolism predominantly." }
    ],
    pearls: [
      "Echinacea is an immune STIMULANT — contraindicated in autoimmune diseases and transplant patients",
      "Limit use to 10–14 days — prolonged use may paradoxically become immunosuppressive",
      "Cross-reactive allergies possible if patient is allergic to ragweed, daisies, or chrysanthemums (Asteraceae family)",
      "Evidence for preventing or treating colds is inconsistent — Cochrane reviews show modest or no benefit",
      "Exam tip: Echinacea + immunosuppressant = dangerous combination on NCLEX questions"
    ],
    quiz: [
      {
        question: "A kidney transplant patient asks about using echinacea to prevent colds. What is the most appropriate nursing response?",
        options: ["'Echinacea is safe and effective for cold prevention.'", "'Echinacea stimulates the immune system and could potentially trigger rejection of your transplanted kidney. You should not use it.'", "'You can take it for up to 8 weeks safely.'", "'Only the tea form is safe for transplant patients.'"],
        correct: 1,
        rationale: "Echinacea stimulates immune function by activating macrophages and increasing phagocytic activity. In transplant patients on immunosuppressive drugs, this immune stimulation could potentially trigger organ rejection."
      },
      {
        question: "A patient with rheumatoid arthritis reports using echinacea daily for the past 3 months. Which concern should the nurse address first?",
        options: ["Risk of dependency", "Possible autoimmune flare from immune stimulation and prolonged use beyond recommended duration", "Risk of hypertension", "Risk of hyperglycemia"],
        correct: 1,
        rationale: "Echinacea stimulates immune function, which may exacerbate autoimmune diseases like RA. Additionally, continuous use beyond 8 weeks is not recommended as it may paradoxically alter immune function. The nurse should address both concerns."
      },
      {
        question: "Before recommending echinacea, which allergy history should the nurse assess?",
        options: ["Penicillin allergy", "Shellfish allergy", "Ragweed or daisy family (Asteraceae) allergy", "Latex allergy"],
        correct: 2,
        rationale: "Echinacea belongs to the Asteraceae/Compositae plant family, which includes ragweed, chrysanthemums, marigolds, and daisies. Patients with allergies to these plants have a higher risk of allergic reactions including anaphylaxis."
      },
      {
        question: "What is the recommended maximum duration for continuous echinacea use?",
        options: ["3 days", "10–14 days", "6 months", "There is no limit"],
        correct: 1,
        rationale: "Echinacea is recommended for short-term use only (10–14 days) for acute cold symptoms. Continuous use beyond 8 weeks may paradoxically suppress immune function and is not supported by evidence for prophylaxis."
      },
      {
        question: "A patient with systemic lupus erythematosus (SLE) asks about using echinacea. What should the nurse advise?",
        options: ["Echinacea is safe and may help manage lupus symptoms", "Echinacea should be avoided as it may worsen autoimmune disease activity", "Only use echinacea during lupus flares", "Echinacea can replace immunosuppressive medications"],
        correct: 1,
        rationale: "Echinacea is an immune stimulant that activates macrophages and inflammatory cytokines. In autoimmune diseases like SLE, where the immune system is already overactive, immune stimulation could exacerbate disease activity and trigger flares."
      }
    ]
  },

  "valerian-root": {
    title: "Valerian Root (Valeriana officinalis)",
    cellular: {
      title: "Pharmacology of Valerian Root",
      content: "Valerian root contains valerenic acid and isovaleric acid, which enhance gamma-aminobutyric acid (GABA) neurotransmission through multiple mechanisms: inhibition of GABA reuptake, inhibition of GABA degradation by GABA transaminase, and possible direct GABA-A receptor agonism at the same binding site as benzodiazepines. This produces sedative, anxiolytic, and muscle relaxant effects. Unlike synthetic sedatives, valerian's effects develop gradually over 2–4 weeks. The mechanism of action at GABA-A receptors explains the risk of additive CNS depression with benzodiazepines, barbiturates, and alcohol, as well as the potential for benzodiazepine-like withdrawal symptoms with abrupt discontinuation after prolonged use."
    },
    riskFactors: [
      "Patients taking benzodiazepines, barbiturates, or other CNS depressants — additive sedation",
      "Patients using alcohol — enhanced CNS depression",
      "Patients on opioid analgesics — additive respiratory depression risk",
      "Patients taking antihistamines with sedating properties",
      "Patients undergoing anesthesia — may prolong anesthetic effects",
      "Long-term users — withdrawal syndrome possible with abrupt discontinuation",
      "Patients operating heavy machinery or driving"
    ],
    diagnostics: [
      "Assess level of sedation using standardized sedation scales",
      "Monitor respiratory rate and oxygen saturation when combined with CNS depressants",
      "Liver function tests with prolonged use (hepatotoxicity rare but reported)",
      "Assess for withdrawal symptoms if patient abruptly discontinues after chronic use"
    ],
    management: [
      "Avoid concurrent use with benzodiazepines, barbiturates, alcohol, and opioids",
      "Taper gradually if discontinuing after prolonged use — do not stop abruptly",
      "Discontinue 2 weeks before surgery due to potential interaction with anesthetic agents",
      "Advise against driving or operating machinery until effects are known",
      "Time dosing for 30–60 minutes before bedtime if used for insomnia"
    ],
    nursingActions: [
      "Screen for valerian use in patients prescribed sedatives, anxiolytics, or opioids",
      "Assess for excessive sedation: drowsiness, lethargy, psychomotor impairment",
      "Monitor fall risk — additive sedation increases fall risk, especially in elderly",
      "Educate about interaction with alcohol and the importance of gradual tapering",
      "Report valerian use to the anesthesia team for preoperative patients",
      "Document valerian use with specific product, dose, and duration"
    ],
    signs: {
      left: [
        "Drowsiness and daytime sedation",
        "Headache",
        "Vivid dreams",
        "GI upset"
      ],
      right: [
        "Excessive sedation with CNS depressants",
        "Withdrawal symptoms (anxiety, insomnia, tremor) with abrupt discontinuation",
        "Prolonged anesthesia recovery",
        "Hepatotoxicity (rare, with prolonged high-dose use)"
      ]
    },
    medications: [
      { name: "Valerian + Benzodiazepines", type: "Additive CNS Depression", action: "Both enhance GABA-A receptor activity, producing synergistic sedation", sideEffects: "Excessive sedation, respiratory depression, falls", contra: "Concurrent benzodiazepine therapy without monitoring", pearl: "Abrupt withdrawal from either can cause rebound anxiety and insomnia." },
      { name: "Valerian + Alcohol", type: "Additive CNS Depression", action: "Both enhance GABAergic neurotransmission", sideEffects: "Profound sedation, impaired psychomotor function, respiratory depression", contra: "Alcohol consumption while using valerian", pearl: "Patients may not realize this combination is dangerous because valerian is 'natural.'" },
      { name: "Valerian + Anesthetics", type: "Prolonged Anesthetic Effect", action: "GABA enhancement may prolong duration of anesthetic agents", sideEffects: "Delayed emergence from anesthesia, prolonged sedation", contra: "Within 2 weeks of scheduled surgery", pearl: "Stop 2 weeks before surgery — inform anesthesiologist of recent use." }
    ],
    pearls: [
      "Valerian works on the same GABA-A receptors as benzodiazepines — additive effects are predictable",
      "Taper gradually after prolonged use to avoid withdrawal symptoms (anxiety, insomnia, tremor)",
      "Effects develop over 2–4 weeks — not effective as a single-dose sleep aid",
      "Stop 2 weeks before surgery due to anesthesia interaction risk",
      "Exam tip: Valerian + benzodiazepine = excessive sedation and fall risk"
    ],
    quiz: [
      {
        question: "A patient taking lorazepam (Ativan) for anxiety reports using valerian root for sleep. What is the priority concern?",
        options: ["Hypertension", "Additive CNS depression leading to excessive sedation and respiratory depression", "Hyperglycemia", "Serotonin syndrome"],
        correct: 1,
        rationale: "Both valerian and lorazepam enhance GABA-A receptor activity. Combined use produces additive CNS depression, increasing the risk of excessive sedation, respiratory depression, impaired psychomotor function, and falls."
      },
      {
        question: "A patient who has used valerian root nightly for 6 months wants to stop. What should the nurse advise?",
        options: ["Stop immediately — valerian has no withdrawal effects", "Taper gradually over 1–2 weeks to avoid withdrawal symptoms", "Double the dose for 1 week then stop", "Switch to a benzodiazepine before stopping"],
        correct: 1,
        rationale: "Prolonged valerian use can lead to GABA receptor adaptations similar to benzodiazepine dependence. Abrupt discontinuation may cause withdrawal symptoms including anxiety, insomnia, and tremor. Gradual tapering is recommended."
      },
      {
        question: "Which mechanism explains valerian's sedative effects?",
        options: ["Serotonin reuptake inhibition", "Dopamine antagonism", "GABA-A receptor enhancement and GABA reuptake inhibition", "Histamine H1 receptor blockade"],
        correct: 2,
        rationale: "Valerian enhances GABAergic neurotransmission through multiple mechanisms: direct GABA-A receptor agonism (at benzodiazepine binding sites), inhibition of GABA reuptake, and inhibition of GABA transaminase (which degrades GABA)."
      },
      {
        question: "When should valerian root be discontinued before surgery?",
        options: ["The morning of surgery", "24 hours before", "1 week before", "2 weeks before"],
        correct: 3,
        rationale: "Valerian should be discontinued at least 2 weeks before surgery because its GABA-enhancing properties may interact with anesthetic agents, potentially prolonging anesthesia and delaying emergence."
      },
      {
        question: "An elderly patient taking valerian root falls during the night. Which assessment should the nurse prioritize?",
        options: ["Blood glucose level", "Level of sedation and concurrent CNS depressant use", "Thyroid function", "Cardiac rhythm"],
        correct: 1,
        rationale: "Valerian causes sedation and psychomotor impairment. Falls in elderly patients on valerian, especially with concurrent CNS depressants, are a significant safety concern. The nurse should assess the level of sedation and review all medications for additive CNS effects."
      }
    ]
  },

  "kava-supplement": {
    title: "Kava (Piper methysticum)",
    cellular: {
      title: "Pharmacology of Kava",
      content: "Kava's active compounds are kavalactones (kavain, dihydrokavain, methysticin, yangonin), which modulate multiple neurochemical pathways. Kavalactones bind to GABA-A receptors (at a site distinct from benzodiazepines), block voltage-gated sodium and calcium channels, inhibit norepinephrine reuptake, and modulate MAO-B activity. These combined actions produce anxiolytic, sedative, muscle relaxant, and anticonvulsant effects. The critical safety concern is hepatotoxicity: kavalactones undergo hepatic metabolism via CYP2D6, CYP3A4, and other enzymes, and certain metabolites (quinone derivatives) are directly hepatotoxic. Over 100 cases of hepatotoxicity, including fulminant liver failure requiring transplantation, have been reported worldwide, leading to regulatory bans in several countries."
    },
    riskFactors: [
      "Pre-existing liver disease — dramatically increased hepatotoxicity risk",
      "Concurrent hepatotoxic medications (acetaminophen, statins, isoniazid, methotrexate)",
      "Alcohol use — additive hepatotoxicity and CNS depression",
      "Concurrent benzodiazepines or sedatives — additive CNS depression",
      "CYP2D6 poor metabolizers — increased kavalactone exposure",
      "Prolonged or high-dose use (>24 weeks or >250 mg/day kavalactones)",
      "Patients on levodopa — kava may reduce its effectiveness"
    ],
    diagnostics: [
      "Liver function tests (AST, ALT, total bilirubin, alkaline phosphatase) at baseline and periodically",
      "Assess for signs of hepatotoxicity: jaundice, dark urine, clay-colored stools, RUQ pain",
      "Monitor sedation level and cognitive function",
      "Drug levels of concurrent medications metabolized by CYP2D6 or CYP3A4"
    ],
    management: [
      "Advise against kava use due to unpredictable hepatotoxicity risk — safer alternatives exist",
      "If patient insists on use, recommend baseline and periodic LFTs",
      "Strictly avoid concurrent alcohol use — additive hepatotoxicity and CNS depression",
      "Do not combine with benzodiazepines, opioids, or other CNS depressants",
      "Discontinue immediately if LFTs become elevated, jaundice develops, or dark urine appears",
      "Stop 2 weeks before surgery"
    ],
    nursingActions: [
      "Screen for kava use in patients with liver disease, elevated LFTs, or on hepatotoxic medications",
      "Educate about hepatotoxicity risk — kava has been banned in several countries for this reason",
      "Assess for signs of liver damage at every visit: jaundice, scleral icterus, abdominal pain",
      "Report kava use to prescriber if patient is on hepatotoxic medications",
      "Monitor for 'kava dermopathy' — yellowish, scaly skin rash with chronic use"
    ],
    signs: {
      left: [
        "Drowsiness and sedation",
        "Kava dermopathy (yellow scaly rash)",
        "GI upset: nausea, loss of appetite",
        "Headache and dizziness"
      ],
      right: [
        "Hepatotoxicity: jaundice, dark urine, RUQ pain",
        "Fulminant liver failure (rare but reported)",
        "Excessive sedation with CNS depressants",
        "Extrapyramidal symptoms (rare — dopamine antagonism)"
      ]
    },
    medications: [
      { name: "Kava + Alcohol", type: "Additive Hepatotoxicity & CNS Depression", action: "Both are hepatotoxic and CNS depressants — synergistic toxicity", sideEffects: "Liver damage, profound sedation, respiratory depression", contra: "Concurrent alcohol use", pearl: "This combination dramatically increases risk of liver failure." },
      { name: "Kava + Benzodiazepines", type: "Additive CNS Depression", action: "Kava's GABA-A activity adds to benzodiazepine effects", sideEffects: "Excessive sedation, coma", contra: "Concurrent benzodiazepine therapy", pearl: "Case report of coma from kava + alprazolam combination." },
      { name: "Kava + Levodopa", type: "Dopamine Antagonism", action: "Kava may antagonize dopamine, reducing levodopa effectiveness in Parkinson's disease", sideEffects: "Worsened Parkinson's symptoms, increased 'off' periods", contra: "Concurrent levodopa therapy", pearl: "Kava-induced extrapyramidal symptoms have been reported even without levodopa." }
    ],
    pearls: [
      "Kava is the most hepatotoxic common herbal supplement — banned in several countries",
      "Over 100 cases of liver failure reported worldwide, including deaths and transplants",
      "Never combine kava with alcohol — additive hepatotoxicity AND CNS depression",
      "'Kava dermopathy' (yellow scaly skin) is a distinct dermatological finding with chronic use",
      "Exam tip: Any question about herbal hepatotoxicity — think kava first"
    ],
    quiz: [
      {
        question: "A patient using kava for anxiety develops jaundice and dark-colored urine. What is the priority nursing action?",
        options: ["Continue kava and monitor symptoms", "Advise the patient to discontinue kava immediately and report to the provider for liver function testing", "Increase fluid intake", "Recommend switching to a higher kava dose"],
        correct: 1,
        rationale: "Jaundice and dark urine are signs of hepatotoxicity. Kava is well-documented to cause liver damage including fulminant liver failure. Immediate discontinuation and liver function testing are essential."
      },
      {
        question: "Which herbal supplement has been banned in several countries due to risk of fulminant liver failure?",
        options: ["Echinacea", "Valerian", "Kava", "Chamomile"],
        correct: 2,
        rationale: "Kava has been banned or restricted in Germany, Switzerland, France, Canada, and the UK due to over 100 reported cases of hepatotoxicity, including fulminant liver failure requiring liver transplantation and deaths."
      },
      {
        question: "A patient on kava develops a yellowish, scaly rash on their skin. What does the nurse recognize this as?",
        options: ["Jaundice from liver failure", "Kava dermopathy", "Contact dermatitis", "Drug-induced lupus"],
        correct: 1,
        rationale: "Kava dermopathy is a distinct dermatological condition characterized by yellowish, dry, scaly skin (ichthyosiform eruption) caused by chronic kava use. It is different from jaundice and is reversible with discontinuation."
      },
      {
        question: "A patient with Parkinson's disease is considering kava for anxiety. What should the nurse advise?",
        options: ["Kava is safe for Parkinson's patients", "Kava may worsen Parkinson's symptoms by antagonizing dopamine and interfering with levodopa", "Kava can replace levodopa", "Only use kava on alternate days with levodopa"],
        correct: 1,
        rationale: "Kava has dopamine-antagonizing properties that can worsen Parkinson's symptoms and reduce the effectiveness of levodopa. Extrapyramidal symptoms have been reported with kava use alone."
      },
      {
        question: "Which combination involving kava poses the highest risk of liver failure?",
        options: ["Kava + vitamin C", "Kava + echinacea", "Kava + alcohol", "Kava + melatonin"],
        correct: 2,
        rationale: "Both kava and alcohol are hepatotoxic. Their combination dramatically increases the risk of liver damage and liver failure through additive hepatotoxicity. This combination also produces additive CNS depression."
      }
    ]
  },

  "saw-palmetto": {
    title: "Saw Palmetto (Serenoa repens)",
    cellular: {
      title: "Pharmacology of Saw Palmetto",
      content: "Saw palmetto berry extract contains fatty acids (lauric acid, oleic acid, myristic acid) and phytosterols (beta-sitosterol) that inhibit 5-alpha-reductase enzyme types 1 and 2, reducing conversion of testosterone to dihydrotestosterone (DHT). This mechanism is identical to finasteride (Proscar) but with weaker potency. Saw palmetto also has anti-inflammatory effects by inhibiting cyclooxygenase and 5-lipoxygenase pathways, and anti-androgenic properties that may reduce prostate cell proliferation. It is commonly used for benign prostatic hyperplasia (BPH) symptoms, though large clinical trials (STEP and CAMUS) showed no significant benefit over placebo."
    },
    riskFactors: [
      "Patients on anticoagulants or antiplatelet agents — rare reports of increased bleeding",
      "Patients on hormonal therapies — anti-androgenic effects may interact",
      "Women of childbearing age — anti-androgenic effects contraindicated in pregnancy",
      "Patients on finasteride or dutasteride — duplicative mechanism, potential additive effects",
      "Patients with hormone-sensitive conditions"
    ],
    diagnostics: [
      "PSA levels may be affected — saw palmetto may lower PSA similarly to finasteride",
      "Monitor for bleeding signs if patient is on anticoagulants",
      "Liver function tests if hepatotoxicity suspected (rare)",
      "Monitor urinary symptoms using standardized questionnaires (IPSS)"
    ],
    management: [
      "Inform urologist of saw palmetto use — may affect PSA interpretation",
      "Educate that large clinical trials did not support significant efficacy for BPH",
      "Report concurrent use with anticoagulants to prescriber",
      "Advise avoidance during pregnancy and breastfeeding due to anti-androgenic effects",
      "Discontinue if no symptom improvement after 8–12 weeks"
    ],
    nursingActions: [
      "Ask male patients with BPH about saw palmetto use during medication reconciliation",
      "Educate that saw palmetto may affect PSA test results — important for prostate cancer screening",
      "Monitor for unusual bleeding if patient is on anticoagulant therapy",
      "Document saw palmetto use with dose and duration",
      "Assess urinary symptom changes using objective measures"
    ],
    signs: {
      left: [
        "GI upset: nausea, diarrhea, constipation",
        "Headache",
        "Dizziness",
        "Mild anti-androgenic effects"
      ],
      right: [
        "Rare: increased bleeding tendency",
        "Rare: hepatotoxicity (pancreatitis reported once)",
        "Potential PSA level changes (may mask prostate cancer)",
        "Hormonal effects in pregnancy (contraindicated)"
      ]
    },
    medications: [
      { name: "Saw Palmetto + Finasteride", type: "Duplicative Mechanism", action: "Both inhibit 5-alpha-reductase — duplicative mechanism with potential additive effects", sideEffects: "Excessive DHT reduction, sexual dysfunction", contra: "Unnecessary concurrent use", pearl: "Using both provides no proven additional benefit — one of the most common examples of supplement duplication." },
      { name: "Saw Palmetto + Anticoagulants", type: "Rare Bleeding Risk", action: "Rare reports of antiplatelet effects increasing bleeding risk", sideEffects: "Bleeding, bruising", contra: "High-risk anticoagulated patients", pearl: "The bleeding risk is lower than the '4 Gs' but should still be monitored." }
    ],
    pearls: [
      "Saw palmetto has the same mechanism as finasteride but is much weaker and lacks strong clinical evidence",
      "May lower PSA levels — important for prostate cancer screening interpretation",
      "STEP and CAMUS clinical trials showed no benefit over placebo for BPH symptoms",
      "Contraindicated in pregnancy due to anti-androgenic effects (similar to finasteride's category X)",
      "Exam tip: Patient using saw palmetto for BPH — assess if they've informed their urologist and discuss PSA implications"
    ],
    quiz: [
      {
        question: "A patient with BPH reports using saw palmetto and is scheduled for PSA testing. What should the nurse communicate to the provider?",
        options: ["PSA testing is unnecessary with saw palmetto use", "Saw palmetto may lower PSA levels, potentially masking prostate cancer", "Saw palmetto has no effect on PSA", "Delay PSA testing for 1 year"],
        correct: 1,
        rationale: "Like finasteride, saw palmetto inhibits 5-alpha-reductase and may lower PSA levels. This is clinically significant because artificially lowered PSA could mask an elevated value that would otherwise prompt prostate cancer investigation."
      },
      {
        question: "A patient takes both saw palmetto and finasteride for BPH symptoms. What should the nurse educate about?",
        options: ["This combination is more effective than either alone", "Both work by the same mechanism (5-alpha-reductase inhibition) — concurrent use is duplicative and provides no proven additional benefit", "The combination increases prostate cancer risk", "Finasteride should be discontinued in favor of saw palmetto"],
        correct: 1,
        rationale: "Saw palmetto and finasteride share the same mechanism of action (5-alpha-reductase inhibition). Using both is duplicative, and there is no evidence that combination use provides additional benefit over finasteride alone."
      },
      {
        question: "Why is saw palmetto contraindicated during pregnancy?",
        options: ["It causes hypertension", "It has anti-androgenic effects that can affect fetal development", "It causes hyperglycemia", "It depletes folic acid"],
        correct: 1,
        rationale: "Saw palmetto inhibits 5-alpha-reductase and has anti-androgenic properties. Similar to finasteride (pregnancy category X), these anti-androgenic effects can potentially harm fetal development, particularly male fetal genitalia."
      },
      {
        question: "Which large clinical trials demonstrated that saw palmetto was not significantly more effective than placebo for BPH?",
        options: ["HOPE and ALLHAT", "STEP and CAMUS", "SPRINT and ACCORD", "GEM and GAIT"],
        correct: 1,
        rationale: "The STEP (Saw palmetto Treatment for Enlarged Prostates) and CAMUS trials were large, well-designed clinical trials that showed saw palmetto extract was not significantly more effective than placebo in improving urinary symptoms of BPH."
      },
      {
        question: "Saw palmetto works by the same mechanism as which prescription medication?",
        options: ["Tamsulosin (Flomax)", "Finasteride (Proscar)", "Doxazosin (Cardura)", "Oxybutynin (Ditropan)"],
        correct: 1,
        rationale: "Saw palmetto inhibits 5-alpha-reductase types 1 and 2, the same enzyme targeted by finasteride (Proscar). Both reduce conversion of testosterone to dihydrotestosterone (DHT), though saw palmetto is significantly less potent."
      }
    ]
  },

  "black-cohosh": {
    title: "Black Cohosh (Actaea racemosa)",
    cellular: {
      title: "Pharmacology of Black Cohosh",
      content: "Black cohosh contains triterpene glycosides (actein, cimicifugoside) and phenolic compounds (fukinolic acid, caffeic acid) that modulate multiple pathways. Despite early hypotheses, black cohosh does NOT directly bind estrogen receptors. Instead, it acts as a selective estrogen receptor modulator (SERM)-like agent through serotonin receptor modulation (5-HT1A and 5-HT7 agonism), dopaminergic activity, and modulation of opioidergic pathways. This explains its efficacy for vasomotor symptoms (hot flashes) without direct estrogenic stimulation of breast or uterine tissue. It is primarily used for menopausal symptoms. Cases of hepatotoxicity have been reported, including liver failure requiring transplantation."
    },
    riskFactors: [
      "Patients with liver disease — hepatotoxicity risk",
      "Patients on hepatotoxic medications — additive liver damage",
      "Patients with hormone-sensitive cancers (though evidence suggests it may be safer than phytoestrogens)",
      "Patients on antihypertensives — may have additive hypotensive effects",
      "Concurrent tamoxifen use — uncertain interaction profile",
      "Patients on statins or acetaminophen — additive hepatotoxicity concern"
    ],
    diagnostics: [
      "Baseline and periodic liver function tests (AST, ALT, bilirubin, ALP)",
      "Assess for signs of hepatotoxicity: jaundice, dark urine, RUQ pain, fatigue",
      "Blood pressure monitoring — may contribute to hypotension",
      "Monitor menopausal symptom severity using validated scales"
    ],
    management: [
      "Limit use to 6 months due to lack of long-term safety data",
      "Obtain baseline LFTs before starting and monitor periodically",
      "Discontinue immediately if signs of liver damage develop",
      "Educate that black cohosh is NOT a phytoestrogen — it works through serotonergic pathways",
      "Report use to oncologist if patient has hormone-sensitive cancer history"
    ],
    nursingActions: [
      "Screen menopausal patients for black cohosh use during medication reconciliation",
      "Assess for signs of hepatotoxicity at every encounter",
      "Educate about time-limited use (maximum 6 months recommended)",
      "Document product, dose, and duration in the medication record",
      "Monitor blood pressure for hypotensive effects"
    ],
    signs: {
      left: [
        "GI upset: nausea, vomiting, diarrhea",
        "Headache",
        "Dizziness",
        "Weight gain"
      ],
      right: [
        "Hepatotoxicity: jaundice, dark urine, elevated LFTs",
        "Liver failure (rare but reported)",
        "Hypotension",
        "Rash (rare)"
      ]
    },
    medications: [
      { name: "Black Cohosh + Hepatotoxic Drugs", type: "Additive Hepatotoxicity", action: "Combined liver burden may increase risk of liver damage", sideEffects: "Elevated LFTs, hepatic injury", contra: "Patients on multiple hepatotoxic medications", pearl: "Monitor LFTs closely if use cannot be avoided." },
      { name: "Black Cohosh + Tamoxifen", type: "Uncertain Interaction", action: "Potential pharmacodynamic interaction at estrogen receptor level — clinical significance unclear", sideEffects: "Unknown — insufficient data", contra: "Use with caution in breast cancer patients", pearl: "Some studies suggest no increased breast cancer risk, but data are limited." }
    ],
    pearls: [
      "Black cohosh is NOT a phytoestrogen — it works through serotonin receptors, not estrogen receptors",
      "Hepatotoxicity risk — cases of liver failure and transplantation have been reported",
      "Limit use to 6 months due to lack of long-term safety data",
      "Most evidence supports efficacy for vasomotor symptoms (hot flashes) of menopause",
      "Exam tip: Menopausal patient using black cohosh — assess liver function"
    ],
    quiz: [
      {
        question: "A menopausal patient using black cohosh for hot flashes develops fatigue and yellow skin. What is the priority assessment?",
        options: ["Thyroid function tests", "Liver function tests", "Complete blood count", "Hemoglobin A1C"],
        correct: 1,
        rationale: "Yellow skin (jaundice) and fatigue in a patient taking black cohosh should prompt immediate liver function testing. Black cohosh has been associated with hepatotoxicity including cases of liver failure requiring transplantation."
      },
      {
        question: "What is the recommended maximum duration for continuous black cohosh use?",
        options: ["2 weeks", "3 months", "6 months", "Indefinitely"],
        correct: 2,
        rationale: "Due to limited long-term safety data and the risk of hepatotoxicity, black cohosh use should be limited to 6 months. Patients requiring longer treatment should be evaluated for alternative therapies."
      },
      {
        question: "How does black cohosh produce its effects on menopausal hot flashes?",
        options: ["Direct estrogen receptor agonism", "Serotonin receptor modulation (5-HT1A and 5-HT7 agonism)", "Progesterone receptor activation", "Dopamine receptor blockade"],
        correct: 1,
        rationale: "Despite initial beliefs, black cohosh does NOT directly bind estrogen receptors. It acts through serotonin receptor modulation (5-HT1A and 5-HT7 agonism), which modulates thermoregulatory centers and reduces vasomotor symptoms."
      },
      {
        question: "A breast cancer survivor asks about using black cohosh for hot flashes. What is the most appropriate nursing response?",
        options: ["Black cohosh is absolutely safe for cancer patients", "While black cohosh works through serotonergic rather than estrogenic pathways, the patient should discuss it with her oncologist before use due to limited data in cancer patients", "Black cohosh should never be used by anyone with cancer history", "Black cohosh can replace tamoxifen"],
        correct: 1,
        rationale: "Black cohosh acts through serotonergic pathways rather than estrogen receptors, which may make it potentially safer than phytoestrogens. However, data in cancer patients are limited, and the oncologist should be involved in the decision."
      },
      {
        question: "A patient on black cohosh and atorvastatin develops elevated AST and ALT. What should the nurse recommend?",
        options: ["Continue both medications and recheck in 6 months", "Discontinue black cohosh immediately and report to the provider", "Increase the black cohosh dose", "Switch to a different statin only"],
        correct: 1,
        rationale: "Both black cohosh and atorvastatin (a statin) can be hepatotoxic. Elevated liver enzymes warrant immediate discontinuation of black cohosh and provider notification to determine if the statin also needs adjustment."
      }
    ]
  },

  "evening-primrose-oil": {
    title: "Evening Primrose Oil (Oenothera biennis)",
    cellular: {
      title: "Pharmacology of Evening Primrose Oil",
      content: "Evening primrose oil (EPO) is a rich source of gamma-linolenic acid (GLA), an omega-6 essential fatty acid. GLA is converted to dihomo-gamma-linolenic acid (DGLA), which serves as a precursor for prostaglandin E1 (PGE1) — an anti-inflammatory, vasodilatory, and antiplatelet eicosanoid. EPO also contains linoleic acid (LA). The primary clinical concern is EPO's ability to lower the seizure threshold, making it dangerous in patients with seizure disorders or those on medications that lower seizure threshold (phenothiazines, tramadol). EPO also has mild antiplatelet effects through PGE1-mediated inhibition of platelet aggregation."
    },
    riskFactors: [
      "Patients with seizure disorders — EPO may lower seizure threshold",
      "Patients on phenothiazines (chlorpromazine) — additive seizure threshold lowering",
      "Patients on anticoagulants — mild antiplatelet effects",
      "Patients scheduled for surgery — bleeding risk",
      "Patients on anticonvulsants — may reduce efficacy",
      "Pregnancy — may induce labor"
    ],
    diagnostics: [
      "Seizure history assessment before use",
      "Monitor seizure frequency in epileptic patients",
      "Coagulation studies if patient is on anticoagulants",
      "Assess for unusual bleeding"
    ],
    management: [
      "Avoid in patients with seizure disorders or on seizure threshold-lowering drugs",
      "Discontinue before surgery due to mild antiplatelet effects",
      "Report use to prescriber if patient is on anticoagulants or anticonvulsants",
      "Avoid in late pregnancy — may stimulate uterine contractions",
      "Educate about potential seizure risk"
    ],
    nursingActions: [
      "Screen for seizure history before EPO use",
      "Assess for concurrent use of phenothiazines or other seizure threshold-lowering drugs",
      "Monitor for new-onset seizure activity",
      "Report EPO use in preoperative patients",
      "Document use with dose, formulation, and reason"
    ],
    signs: {
      left: [
        "GI upset: nausea, diarrhea, bloating",
        "Headache",
        "Soft stools"
      ],
      right: [
        "Seizures (lowered seizure threshold)",
        "Bleeding (mild antiplatelet effect)",
        "Uterine stimulation in pregnancy"
      ]
    },
    medications: [
      { name: "EPO + Phenothiazines", type: "Seizure Threshold Lowering", action: "Both lower seizure threshold — additive epileptogenic risk", sideEffects: "Seizures", contra: "Concurrent phenothiazine therapy", pearl: "Classic exam combination — EPO + phenothiazines = seizure risk." },
      { name: "EPO + Anticoagulants", type: "Antiplatelet Interaction", action: "PGE1-mediated antiplatelet effect adds to anticoagulant activity", sideEffects: "Bleeding", contra: "High-risk anticoagulated patients", pearl: "Bleeding risk is lower than the '4 Gs' but present." }
    ],
    pearls: [
      "EPO lowers seizure threshold — critical safety concern for epileptic patients",
      "EPO + phenothiazines = additive seizure risk — classic exam combination",
      "GLA → DGLA → PGE1 pathway explains both anti-inflammatory and antiplatelet effects",
      "Commonly used for PMS, mastalgia, and eczema — limited evidence of efficacy",
      "Exam tip: Evening primrose oil + seizure question = correct answer involves seizure threshold lowering"
    ],
    quiz: [
      {
        question: "A patient with epilepsy asks about using evening primrose oil for PMS. What is the priority concern?",
        options: ["Hypertension", "Evening primrose oil may lower the seizure threshold and increase seizure risk", "Hyperglycemia", "Weight gain"],
        correct: 1,
        rationale: "Evening primrose oil has been shown to lower the seizure threshold. In patients with epilepsy, this can increase seizure frequency and severity, making EPO a potentially dangerous supplement for this population."
      },
      {
        question: "Which medication class has the most concerning interaction with evening primrose oil regarding seizure risk?",
        options: ["Beta-blockers", "Phenothiazines", "ACE inhibitors", "Proton pump inhibitors"],
        correct: 1,
        rationale: "Phenothiazines (e.g., chlorpromazine) also lower the seizure threshold. Combined with evening primrose oil, the additive effect on seizure threshold creates a significant risk of new-onset seizures or worsened seizure control."
      },
      {
        question: "What is the primary omega-6 fatty acid in evening primrose oil responsible for its pharmacological effects?",
        options: ["Alpha-linolenic acid (ALA)", "Eicosapentaenoic acid (EPA)", "Gamma-linolenic acid (GLA)", "Docosahexaenoic acid (DHA)"],
        correct: 2,
        rationale: "Gamma-linolenic acid (GLA) is the primary active omega-6 fatty acid in evening primrose oil. GLA is converted to dihomo-gamma-linolenic acid (DGLA), a precursor to anti-inflammatory prostaglandin E1 (PGE1)."
      },
      {
        question: "A pregnant patient at 38 weeks reports using evening primrose oil. What concern should the nurse address?",
        options: ["EPO causes constipation", "EPO may stimulate uterine contractions and induce premature labor", "EPO has no effects during pregnancy", "EPO causes fetal hyperglycemia"],
        correct: 1,
        rationale: "Evening primrose oil may stimulate uterine contractions through prostaglandin E1 pathway modulation. While sometimes used intentionally near term, its use without provider guidance poses risks of premature labor and should be discussed with the provider."
      },
      {
        question: "A patient on phenytoin (Dilantin) for seizure control is using evening primrose oil. What is the priority nursing action?",
        options: ["No action needed — EPO is safe with anticonvulsants", "Notify the prescriber — EPO may lower seizure threshold and counteract anticonvulsant therapy", "Increase the phenytoin dose", "Discontinue phenytoin and continue EPO"],
        correct: 1,
        rationale: "Evening primrose oil lowers the seizure threshold, potentially counteracting the therapeutic effects of anticonvulsants like phenytoin. The prescriber should be notified to evaluate the risk-benefit of continuing EPO."
      }
    ]
  },

  "melatonin-supplement": {
    title: "Melatonin",
    cellular: {
      title: "Pharmacology of Melatonin",
      content: "Melatonin is an endogenous neurohormone synthesized from tryptophan in the pineal gland under control of the suprachiasmatic nucleus (SCN). Darkness stimulates melatonin secretion; light inhibits it. Exogenous melatonin binds to MT1 and MT2 receptors in the SCN, promoting sleep onset and resetting circadian rhythms. MT1 activation inhibits neuronal firing in the SCN, promoting sleepiness, while MT2 activation phase-shifts circadian rhythms. Melatonin also has antioxidant properties (direct free radical scavenging) and immunomodulatory effects. Commonly used supplemental doses (0.5–10 mg) often far exceed physiological levels, and melatonin undergoes extensive first-pass hepatic metabolism via CYP1A2."
    },
    riskFactors: [
      "Patients on anticoagulants (warfarin) — melatonin may increase bleeding risk",
      "Patients on CNS depressants — additive sedation",
      "Patients on antihypertensives — melatonin may lower blood pressure",
      "Patients on immunosuppressants — melatonin may stimulate immune function",
      "Patients with autoimmune diseases — immunostimulatory effects may worsen condition",
      "Diabetic patients — may affect blood glucose regulation",
      "Patients on CYP1A2-metabolized drugs (fluvoxamine increases melatonin levels dramatically)"
    ],
    diagnostics: [
      "Monitor INR if patient on warfarin uses melatonin",
      "Blood pressure monitoring if concurrent antihypertensive use",
      "Blood glucose monitoring in diabetic patients",
      "Assess sleep quality using validated instruments",
      "Assess for excessive daytime sedation"
    ],
    management: [
      "Use the lowest effective dose (0.5–3 mg typically sufficient; physiological dose is 0.3–0.5 mg)",
      "Time dose 30–60 minutes before desired bedtime",
      "Avoid in patients on immunosuppressants due to immunostimulatory effects",
      "Monitor for excessive sedation when combined with CNS depressants",
      "Educate that melatonin works best for circadian rhythm disorders and jet lag, less effective for primary insomnia"
    ],
    nursingActions: [
      "Assess for melatonin use in patients with sleep complaints",
      "Educate about proper timing and dosing — most patients take doses far above physiological levels",
      "Monitor for daytime drowsiness and fall risk, especially in elderly patients",
      "Report concurrent melatonin use in patients on warfarin or immunosuppressants",
      "Evaluate underlying sleep hygiene practices before recommending melatonin"
    ],
    signs: {
      left: [
        "Drowsiness and daytime sedation",
        "Headache",
        "Dizziness",
        "Vivid dreams or nightmares"
      ],
      right: [
        "Increased bleeding risk with anticoagulants",
        "Hypotension with antihypertensives",
        "Immune stimulation (problematic in autoimmune disease or transplant)",
        "Blood glucose changes in diabetic patients"
      ]
    },
    medications: [
      { name: "Melatonin + Warfarin", type: "Bleeding Risk", action: "Melatonin may increase warfarin's anticoagulant effect through unclear mechanism", sideEffects: "Elevated INR, bleeding", contra: "Concurrent warfarin without INR monitoring", pearl: "INR should be checked more frequently when melatonin is added or discontinued." },
      { name: "Melatonin + Fluvoxamine", type: "CYP1A2 Inhibition", action: "Fluvoxamine potently inhibits CYP1A2, dramatically increasing melatonin levels (up to 17-fold)", sideEffects: "Excessive sedation, prolonged drowsiness", contra: "Concurrent use without dose reduction of melatonin", pearl: "This is one of the most significant pharmacokinetic interactions with melatonin." },
      { name: "Melatonin + Immunosuppressants", type: "Pharmacodynamic Antagonism", action: "Melatonin stimulates immune function, potentially counteracting immunosuppression", sideEffects: "Transplant rejection, autoimmune flare", contra: "Transplant recipients, autoimmune patients on immunosuppression", pearl: "Similar concern as echinacea — immune stimulation in immunosuppressed patients." }
    ],
    pearls: [
      "Physiological melatonin dose is 0.3–0.5 mg — most supplements contain 5–10× this amount",
      "Best evidence supports use for circadian rhythm disorders (jet lag, shift work) rather than general insomnia",
      "Melatonin is metabolized by CYP1A2 — fluvoxamine can increase levels up to 17-fold",
      "Has immunostimulatory effects — avoid in transplant and autoimmune patients",
      "Exam tip: Melatonin question — look for interactions with warfarin, immunosuppressants, and CYP1A2 inhibitors"
    ],
    quiz: [
      {
        question: "A patient on warfarin begins using melatonin for insomnia. What monitoring should the nurse anticipate?",
        options: ["Blood glucose monitoring", "More frequent INR monitoring", "Thyroid function tests", "Renal function tests"],
        correct: 1,
        rationale: "Melatonin may increase warfarin's anticoagulant effect and elevate INR. More frequent INR monitoring is needed when melatonin is started, discontinued, or dose-changed in patients on warfarin."
      },
      {
        question: "A patient taking fluvoxamine (Luvox) reports excessive daytime drowsiness after starting melatonin. What is the most likely explanation?",
        options: ["Fluvoxamine causes drowsiness independently", "Fluvoxamine inhibits CYP1A2, dramatically increasing melatonin blood levels", "Melatonin always causes severe drowsiness", "The patient is taking too much fluvoxamine"],
        correct: 1,
        rationale: "Fluvoxamine is a potent CYP1A2 inhibitor. Since melatonin is primarily metabolized by CYP1A2, fluvoxamine can increase melatonin levels up to 17-fold, causing excessive and prolonged sedation."
      },
      {
        question: "What is the physiological dose of melatonin that most closely mimics endogenous production?",
        options: ["0.3–0.5 mg", "5 mg", "10 mg", "20 mg"],
        correct: 0,
        rationale: "Physiological melatonin production is approximately 0.3–0.5 mg per night. Most commercial supplements contain 3–10 mg, which is 6–33 times the physiological dose. Lower doses (0.3–1 mg) are often more effective than higher doses."
      },
      {
        question: "A kidney transplant patient asks about using melatonin for sleep. Why should the nurse exercise caution?",
        options: ["Melatonin causes nephrotoxicity", "Melatonin has immunostimulatory effects that could potentially trigger transplant rejection", "Melatonin interacts with all anti-rejection drugs", "Melatonin is not effective for sleep"],
        correct: 1,
        rationale: "Melatonin has immunostimulatory properties that enhance immune cell function. In transplant patients on immunosuppressive therapy, this immune stimulation could potentially counteract immunosuppression and risk organ rejection."
      },
      {
        question: "For which condition does melatonin have the strongest evidence of efficacy?",
        options: ["Primary insomnia in adults", "Jet lag and circadian rhythm sleep disorders", "Chronic pain management", "Anxiety disorders"],
        correct: 1,
        rationale: "Melatonin has the strongest evidence for circadian rhythm sleep disorders including jet lag, delayed sleep-wake phase disorder, and shift work disorder. It acts by resetting the circadian clock through MT2 receptor activation in the suprachiasmatic nucleus."
      }
    ]
  },

  "chamomile-supplement": {
    title: "Chamomile (Matricaria chamomilla)",
    cellular: {
      title: "Pharmacology of Chamomile",
      content: "Chamomile (German chamomile, Matricaria chamomilla) contains apigenin, a flavonoid that binds to benzodiazepine binding sites on GABA-A receptors, producing mild anxiolytic and sedative effects. Chamomile also contains chamazulene (anti-inflammatory), bisabolol (anti-spasmodic, anti-inflammatory), and coumarin derivatives. The coumarin content creates potential anticoagulant effects, as coumarins are structurally related to warfarin. Chamomile belongs to the Asteraceae (Compositae) plant family, which creates cross-reactivity risk in patients allergic to ragweed, chrysanthemums, marigolds, and daisies. Chamomile tea is one of the most widely consumed herbal preparations worldwide."
    },
    riskFactors: [
      "Patients with Asteraceae/ragweed allergy — cross-reactive anaphylaxis risk",
      "Patients on warfarin or anticoagulants — coumarin content may potentiate anticoagulation",
      "Patients on benzodiazepines or sedatives — additive CNS depression",
      "Patients on cyclosporine — chamomile may increase levels",
      "Pregnant patients — uterine stimulant effects in high doses",
      "Patients on antiplatelet agents"
    ],
    diagnostics: [
      "Allergy history assessment — specifically Asteraceae family plants",
      "Monitor INR if patient on warfarin uses chamomile regularly",
      "Assess for bleeding signs",
      "Monitor sedation levels if combined with CNS depressants"
    ],
    management: [
      "Screen for ragweed/Asteraceae allergy before use",
      "Monitor INR more frequently if combined with warfarin",
      "Educate about additive sedation with alcohol and sedative medications",
      "Advise caution with concentrated extracts — teas are generally lower risk than supplements",
      "Report use to prescriber if patient is on warfarin"
    ],
    nursingActions: [
      "Ask about chamomile tea consumption during medication reconciliation — patients may not report teas as supplements",
      "Assess for ragweed allergy before chamomile use",
      "Monitor for signs of allergic reaction: rash, itching, wheezing, swelling",
      "Report frequent chamomile consumption in anticoagulated patients",
      "Educate about the difference between occasional chamomile tea and concentrated extract use"
    ],
    signs: {
      left: [
        "Allergic reaction (contact dermatitis, urticaria)",
        "Drowsiness (mild sedation)",
        "GI upset",
        "Nausea"
      ],
      right: [
        "Anaphylaxis (rare — ragweed allergy cross-reactivity)",
        "Increased bleeding with anticoagulants (coumarin content)",
        "Additive sedation with CNS depressants",
        "Uterine stimulation in high doses (pregnancy concern)"
      ]
    },
    medications: [
      { name: "Chamomile + Warfarin", type: "Anticoagulant Potentiation", action: "Coumarin derivatives in chamomile may potentiate warfarin's vitamin K antagonist effect", sideEffects: "Elevated INR, bleeding", contra: "Frequent/heavy chamomile use with warfarin", pearl: "Case reports of INR elevation in patients drinking large amounts of chamomile tea while on warfarin." },
      { name: "Chamomile + Benzodiazepines", type: "Additive Sedation", action: "Apigenin binds GABA-A receptors at benzodiazepine sites — additive sedation", sideEffects: "Excessive drowsiness, impaired motor function", contra: "Concurrent heavy use with sedative medications", pearl: "Apigenin is a 'natural benzodiazepine' — explains both therapeutic and interaction effects." }
    ],
    pearls: [
      "Chamomile contains apigenin — a natural benzodiazepine receptor agonist",
      "Coumarin content can potentiate warfarin — monitor INR with regular heavy use",
      "Cross-allergy risk with ragweed (Asteraceae family) — always screen for allergy",
      "Chamomile tea is generally lower risk than concentrated extracts, but large quantities can still interact",
      "Exam tip: Patient on warfarin drinking chamomile tea with elevated INR — chamomile is the culprit"
    ],
    quiz: [
      {
        question: "A patient on warfarin who drinks 4–5 cups of chamomile tea daily has an elevated INR of 4.2. What is a likely contributing factor?",
        options: ["Increased vitamin K intake from chamomile", "Coumarin compounds in chamomile potentiating warfarin's anticoagulant effect", "Chamomile-induced liver failure", "Chamomile causing medication non-adherence"],
        correct: 1,
        rationale: "Chamomile contains coumarin derivatives that are structurally similar to warfarin and can potentiate its anticoagulant effect. Heavy chamomile consumption in warfarin patients has been associated with elevated INR and increased bleeding risk."
      },
      {
        question: "Before recommending chamomile, which allergy should the nurse screen for?",
        options: ["Latex allergy", "Shellfish allergy", "Ragweed/Asteraceae family allergy", "Penicillin allergy"],
        correct: 2,
        rationale: "Chamomile belongs to the Asteraceae (Compositae) family. Patients allergic to ragweed, chrysanthemums, marigolds, or daisies may have cross-reactive allergic responses to chamomile, including potential anaphylaxis."
      },
      {
        question: "Which compound in chamomile produces its sedative and anxiolytic effects?",
        options: ["Allicin", "Ginsenoside", "Apigenin", "Hypericin"],
        correct: 2,
        rationale: "Apigenin is a flavonoid in chamomile that binds to GABA-A receptors at the benzodiazepine binding site. This produces mild anxiolytic and sedative effects, essentially functioning as a 'natural benzodiazepine.'"
      },
      {
        question: "A patient taking lorazepam (Ativan) drinks chamomile tea nightly. What should the nurse monitor for?",
        options: ["Hypertension", "Additive sedation and drowsiness from dual GABA-A receptor activity", "Hyperglycemia", "Tachycardia"],
        correct: 1,
        rationale: "Both chamomile (via apigenin) and lorazepam act on GABA-A receptors. Combined use produces additive sedation, increasing risk of excessive drowsiness, impaired motor function, and falls."
      },
      {
        question: "A nurse is educating about chamomile tea. Which patient should be specifically cautioned?",
        options: ["Patient with GERD", "Patient with seasonal ragweed allergies", "Patient with iron deficiency anemia", "Patient with osteoporosis"],
        correct: 1,
        rationale: "Patients with ragweed allergies are at increased risk of allergic reactions to chamomile due to cross-reactivity within the Asteraceae plant family. Reactions can range from mild contact dermatitis to severe anaphylaxis."
      }
    ]
  },

  "turmeric-curcumin": {
    title: "Turmeric/Curcumin (Curcuma longa)",
    cellular: {
      title: "Pharmacology of Turmeric/Curcumin",
      content: "Curcumin, the primary bioactive compound in turmeric (Curcuma longa), is a polyphenol that modulates multiple inflammatory pathways. It inhibits NF-κB (nuclear factor kappa-B), cyclooxygenase-2 (COX-2), lipoxygenase (LOX), and inducible nitric oxide synthase (iNOS), producing potent anti-inflammatory effects. Curcumin also inhibits platelet aggregation through thromboxane synthesis inhibition, creates antioxidant effects through direct free radical scavenging, and may have antiproliferative effects on cancer cells. Bioavailability is extremely poor (<1% absorbed), which is why many supplements add piperine (black pepper extract) to inhibit glucuronidation and increase absorption 2,000%. This enhanced bioavailability also increases interaction potential."
    },
    riskFactors: [
      "Patients on anticoagulants or antiplatelet agents — additive bleeding risk",
      "Patients scheduled for surgery — antiplatelet effects",
      "Patients on antidiabetic medications — may lower blood glucose",
      "Patients with gallbladder disease — curcumin may stimulate bile secretion",
      "Patients on chemotherapy — curcumin may alter drug metabolism",
      "High-dose or piperine-enhanced formulations increase interaction risk"
    ],
    diagnostics: [
      "Monitor INR in patients on warfarin using high-dose curcumin",
      "Blood glucose monitoring in diabetic patients",
      "Coagulation studies preoperatively",
      "Assess for bleeding signs: bruising, petechiae, hematuria"
    ],
    management: [
      "Discontinue high-dose curcumin supplements 2 weeks before surgery",
      "Report use to prescriber if patient is on anticoagulants",
      "Monitor blood glucose in diabetic patients",
      "Avoid in patients with bile duct obstruction — curcumin stimulates bile flow",
      "Educate about the difference between culinary turmeric and high-dose curcumin supplements"
    ],
    nursingActions: [
      "Differentiate between dietary turmeric (low risk) and high-dose curcumin supplements (higher risk)",
      "Ask about piperine-enhanced formulations — these dramatically increase bioavailability and interaction risk",
      "Monitor for bleeding in anticoagulated patients",
      "Report preoperative curcumin use to the surgical team",
      "Document curcumin product, dose, and whether it contains piperine/BioPerine"
    ],
    signs: {
      left: [
        "GI upset: nausea, diarrhea, bloating",
        "Yellow staining of skin (harmless at high doses)",
        "Headache",
        "Dizziness"
      ],
      right: [
        "Bleeding (antiplatelet effect at high doses)",
        "Hypoglycemia with antidiabetic agents",
        "Gallbladder contraction/colic",
        "Iron deficiency (curcumin chelates iron)"
      ]
    },
    medications: [
      { name: "Curcumin + Warfarin", type: "Antiplatelet + Anticoagulant", action: "Curcumin inhibits thromboxane synthesis and platelet aggregation, adding to warfarin's anticoagulant effect", sideEffects: "Increased bleeding risk, elevated INR", contra: "High-dose curcumin with warfarin", pearl: "Dietary turmeric in cooking is low risk; concentrated supplements with piperine are the concern." },
      { name: "Curcumin + Piperine (BioPerine)", type: "Bioavailability Enhancement", action: "Piperine inhibits glucuronidation, increasing curcumin bioavailability by 2,000%", sideEffects: "Dramatically increased curcumin effects and interactions", contra: "Patients on narrow therapeutic index drugs", pearl: "Piperine also increases bioavailability of OTHER drugs — may affect drug levels of concurrent medications." }
    ],
    pearls: [
      "Curcumin bioavailability is <1% — piperine (black pepper) increases it 2,000%",
      "Dietary turmeric in cooking is generally safe — high-dose supplements carry interaction risk",
      "Potent anti-inflammatory via NF-κB, COX-2, and LOX inhibition",
      "Antiplatelet effects — stop 2 weeks before surgery",
      "Exam tip: Differentiate between culinary turmeric use (safe) and high-dose curcumin supplements (interaction risk)"
    ],
    quiz: [
      {
        question: "A patient on warfarin takes a curcumin supplement with BioPerine (piperine). Why is this combination particularly concerning?",
        options: ["Piperine has its own anticoagulant effects", "Piperine increases curcumin bioavailability by 2,000%, dramatically increasing its antiplatelet effects and potential to enhance warfarin's action", "Curcumin is only dangerous without piperine", "Piperine causes liver failure"],
        correct: 1,
        rationale: "Piperine (BioPerine) inhibits glucuronidation, increasing curcumin absorption from <1% to approximately 20%. This dramatically increases curcumin's antiplatelet effects, magnifying the bleeding risk when combined with warfarin."
      },
      {
        question: "A diabetic patient on metformin starts taking high-dose curcumin. What should the nurse monitor?",
        options: ["Thyroid function", "Blood glucose — curcumin may have additive hypoglycemic effects", "Renal function only", "Cardiac rhythm"],
        correct: 1,
        rationale: "Curcumin may lower blood glucose through multiple mechanisms including improved insulin sensitivity. Combined with metformin, this creates additive hypoglycemia risk. Blood glucose monitoring should be increased."
      },
      {
        question: "Why is curcumin contraindicated in patients with bile duct obstruction?",
        options: ["It causes bile duct inflammation", "Curcumin stimulates bile secretion, which can worsen obstruction symptoms and cause biliary colic", "It dissolves gallstones dangerously", "It has no effect on the biliary system"],
        correct: 1,
        rationale: "Curcumin is a cholagogue — it stimulates bile production and gallbladder contraction. In patients with bile duct obstruction or gallstones, this can exacerbate symptoms, cause biliary colic, or worsen obstruction."
      },
      {
        question: "A patient uses turmeric when cooking Indian food and asks if this is dangerous with their warfarin. What is the best nursing response?",
        options: ["All turmeric use must be avoided with warfarin", "Dietary turmeric in normal cooking amounts is generally safe; concentrated curcumin supplements carry higher interaction risk", "Turmeric in food is more dangerous than supplements", "There is no difference between dietary and supplemental use"],
        correct: 1,
        rationale: "Dietary turmeric used in cooking provides relatively low doses of curcumin with poor bioavailability (<1% absorption). Concentrated curcumin supplements, especially those with piperine, provide dramatically higher bioavailable doses and carry greater interaction risk."
      },
      {
        question: "Which mechanism explains curcumin's anti-inflammatory effects?",
        options: ["Histamine H1 receptor blockade", "NF-κB, COX-2, and LOX inhibition", "Prostaglandin E2 stimulation", "Acetylcholine receptor activation"],
        correct: 1,
        rationale: "Curcumin produces anti-inflammatory effects through inhibition of NF-κB (master inflammatory transcription factor), COX-2 (cyclooxygenase-2), LOX (lipoxygenase), and iNOS (inducible nitric oxide synthase)."
      }
    ]
  },

  "omega-3-fatty-acids": {
    title: "Omega-3 Fatty Acids (Fish Oil)",
    cellular: {
      title: "Pharmacology of Omega-3 Fatty Acids",
      content: "Omega-3 fatty acids — eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA) — are polyunsaturated fatty acids that compete with arachidonic acid (AA) for cyclooxygenase and lipoxygenase enzymes. This shunting produces less-potent prostaglandins (PGE3 instead of PGE2) and less-potent leukotrienes (LTB5 instead of LTB4), reducing inflammation. EPA also produces resolvins and protectins that actively resolve inflammation. At high doses (>3 g/day), omega-3s reduce triglyceride synthesis in the liver (VLDL production inhibition), lower triglycerides by 20–50%, and have antiplatelet effects through reduced thromboxane A2 production. Prescription omega-3 products (Lovaza, Vascepa) are FDA-approved for severe hypertriglyceridemia."
    },
    riskFactors: [
      "Patients on anticoagulants or antiplatelet agents — additive bleeding risk at high doses",
      "Patients scheduled for surgery — high-dose omega-3 may increase bleeding",
      "Patients with fish or shellfish allergies (some preparations)",
      "Patients on antihypertensives — omega-3 may lower blood pressure",
      "Immunosuppressed patients — high-dose omega-3 may affect immune function",
      "Diabetic patients — high-dose fish oil may slightly increase fasting blood glucose"
    ],
    diagnostics: [
      "Fasting lipid panel — triglycerides should be monitored",
      "PT/INR monitoring if combined with warfarin at high omega-3 doses",
      "Blood glucose in diabetic patients on high-dose omega-3",
      "Blood pressure monitoring",
      "Assess for bleeding signs at high doses"
    ],
    management: [
      "High doses (>3 g/day EPA+DHA) require medical supervision due to bleeding risk",
      "Report high-dose omega-3 use to prescriber if patient is on anticoagulants",
      "Consider discontinuing high-dose omega-3 before surgery",
      "Choose products tested for mercury and contaminants (USP verified)",
      "Prescription omega-3 (icosapent ethyl/Vascepa) has proven cardiovascular benefit (REDUCE-IT trial)"
    ],
    nursingActions: [
      "Clarify whether patient is taking dietary fish oil or prescription omega-3",
      "Assess total daily dose — doses >3 g/day carry significant bleeding risk",
      "Monitor for fishy aftertaste, GI upset, and loose stools",
      "Report high-dose use in preoperative and anticoagulated patients",
      "Educate about quality — not all fish oil supplements are equal in purity and potency"
    ],
    signs: {
      left: [
        "Fishy aftertaste and burping",
        "GI upset: nausea, diarrhea, bloating",
        "Mild blood pressure reduction",
        "Body odor"
      ],
      right: [
        "Bleeding at high doses (>3 g/day)",
        "Slightly elevated fasting blood glucose (high dose)",
        "Elevated LDL cholesterol (paradoxical with some preparations)",
        "Allergic reaction in fish-allergic patients"
      ]
    },
    medications: [
      { name: "Omega-3 (high dose) + Warfarin", type: "Anticoagulant Interaction", action: "Omega-3 reduces thromboxane A2 production, adding antiplatelet effect to warfarin's anticoagulant effect", sideEffects: "Increased bleeding risk at doses >3 g/day", contra: "High-dose omega-3 with warfarin without monitoring", pearl: "Low-dose omega-3 (1 g/day) has minimal interaction; high-dose (>3 g/day) requires INR monitoring." },
      { name: "Omega-3 + Antihypertensives", type: "Additive Hypotension", action: "Omega-3 produces mild blood pressure reduction through vasodilation", sideEffects: "Hypotension, dizziness", contra: "Patients with already low blood pressure", pearl: "BP-lowering effect is modest (2–5 mmHg) but can be clinically relevant in combination." }
    ],
    pearls: [
      "High-dose omega-3 (>3 g/day) significantly increases bleeding risk — requires medical supervision",
      "Low-dose omega-3 (1 g/day) is generally safe and has minimal drug interactions",
      "REDUCE-IT trial showed prescription icosapent ethyl (Vascepa) reduces cardiovascular events by 25%",
      "EPA + DHA compete with arachidonic acid → less inflammatory prostaglandins and leukotrienes",
      "Exam tip: High-dose fish oil + anticoagulant question = bleeding risk; differentiate from low-dose"
    ],
    quiz: [
      {
        question: "A patient on warfarin takes 4 grams of fish oil daily for triglyceride reduction. What is the nurse's priority concern?",
        options: ["Hyperglycemia", "Increased bleeding risk from high-dose omega-3 combined with warfarin", "Liver damage", "Constipation"],
        correct: 1,
        rationale: "High-dose omega-3 (>3 g/day) inhibits thromboxane A2 production, producing antiplatelet effects. Combined with warfarin's anticoagulant effect, this significantly increases bleeding risk. INR monitoring should be increased."
      },
      {
        question: "At what daily dose do omega-3 fatty acids begin to carry significant bleeding risk?",
        options: ["0.5 g/day", "1 g/day", ">3 g/day", "10 g/day"],
        correct: 2,
        rationale: "Doses above 3 g/day of EPA + DHA carry clinically significant antiplatelet effects and bleeding risk. The FDA recommends that dietary supplement omega-3 intake not exceed 3 g/day without medical supervision."
      },
      {
        question: "Which mechanism explains how omega-3 fatty acids reduce inflammation?",
        options: ["Histamine receptor blockade", "Competition with arachidonic acid for COX and LOX enzymes, producing less inflammatory eicosanoids", "Direct cortisol stimulation", "Acetylcholine receptor activation"],
        correct: 1,
        rationale: "EPA and DHA compete with arachidonic acid (AA) for cyclooxygenase and lipoxygenase enzymes. This shunting produces less-potent prostaglandins (PGE3 vs PGE2) and less-potent leukotrienes (LTB5 vs LTB4), reducing inflammatory signaling."
      },
      {
        question: "Which clinical trial demonstrated that prescription icosapent ethyl (Vascepa) reduced cardiovascular events?",
        options: ["SPRINT", "REDUCE-IT", "ACCORD", "ALLHAT"],
        correct: 1,
        rationale: "The REDUCE-IT trial demonstrated that prescription icosapent ethyl (EPA-only, Vascepa) reduced major adverse cardiovascular events by 25% in patients with elevated triglycerides on statin therapy."
      },
      {
        question: "A nurse is educating a patient about fish oil. Which advice is most appropriate?",
        options: ["Take the highest dose possible for maximum benefit", "Doses above 3 g/day should only be taken under medical supervision due to bleeding risk; choose products with USP verification", "Fish oil has no side effects", "Fish oil replaces the need for prescription medications"],
        correct: 1,
        rationale: "While omega-3 supplements are generally safe at standard doses, doses exceeding 3 g/day carry significant bleeding risk and require medical supervision. USP-verified products ensure purity and accurate potency."
      }
    ]
  },

  "cranberry-supplement": {
    title: "Cranberry (Vaccinium macrocarpon)",
    cellular: {
      title: "Pharmacology of Cranberry",
      content: "Cranberry contains proanthocyanidins (PACs, specifically A-type linkage PACs) that inhibit bacterial adhesion to uroepithelial cells by blocking P-fimbriae of Escherichia coli. This prevents bacterial colonization of the urinary tract rather than killing bacteria. Cranberry also contains flavonoids, organic acids (quinic, malic, citric), and vitamin C. The clinically significant drug interaction is with warfarin: cranberry contains flavonoids that inhibit CYP2C9 (the primary enzyme metabolizing warfarin) and may contain salicylic acid, which has antiplatelet properties. Case reports and pharmacokinetic studies have documented elevated INR and bleeding events in patients consuming large amounts of cranberry while on warfarin."
    },
    riskFactors: [
      "Patients on warfarin — CYP2C9 inhibition may increase INR",
      "Patients with history of kidney stones (calcium oxalate type) — cranberry increases urinary oxalate",
      "Patients on antiplatelet agents — additive effects from salicylate content",
      "Large-volume cranberry juice consumption — higher interaction potential",
      "Concentrated cranberry extract supplements vs. dilute juice"
    ],
    diagnostics: [
      "Monitor INR in patients on warfarin who consume cranberry regularly",
      "Urinalysis for oxalate crystals in patients prone to kidney stones",
      "Assess for signs of bleeding",
      "Urine culture if using cranberry for UTI prevention"
    ],
    management: [
      "Monitor INR more frequently if patient on warfarin starts regular cranberry use",
      "Advise moderate consumption — avoid large daily volumes of cranberry juice or concentrated extracts with warfarin",
      "Inform patients with history of calcium oxalate stones about increased oxalate excretion",
      "Educate that cranberry prevents UTI by preventing bacterial adhesion, not by 'acidifying urine'",
      "Cranberry should not replace antibiotics for active UTI treatment"
    ],
    nursingActions: [
      "Ask about cranberry juice and supplement use in patients on warfarin",
      "Monitor for bleeding signs in anticoagulated patients using cranberry",
      "Educate about proper mechanism — cranberry prevents adhesion, not kills bacteria",
      "Report excessive cranberry consumption in warfarin patients",
      "Assess kidney stone history before recommending cranberry supplements"
    ],
    signs: {
      left: [
        "GI upset: diarrhea, abdominal cramping (with large volumes)",
        "Elevated blood sugar (sweetened cranberry juice products)",
        "Dental erosion (acidic juice)"
      ],
      right: [
        "Elevated INR with warfarin (CYP2C9 inhibition)",
        "Bleeding events (case reports with warfarin)",
        "Kidney stone formation (calcium oxalate)",
        "Allergic reaction (rare)"
      ]
    },
    medications: [
      { name: "Cranberry + Warfarin", type: "CYP2C9 Inhibition", action: "Cranberry flavonoids inhibit CYP2C9, reducing warfarin metabolism and increasing anticoagulant effect", sideEffects: "Elevated INR, hemorrhage", contra: "Large-volume cranberry consumption with warfarin", pearl: "A fatal hemorrhage was reported in a warfarin patient consuming large amounts of cranberry juice — moderate consumption is key." }
    ],
    pearls: [
      "Cranberry prevents UTI by blocking bacterial adhesion (A-type PACs block P-fimbriae), NOT by 'acidifying urine'",
      "CYP2C9 inhibition can increase warfarin levels — monitor INR with regular use",
      "A fatal hemorrhage was reported in a warfarin patient drinking large amounts of cranberry juice",
      "Cranberry increases urinary oxalate — problematic for calcium oxalate kidney stone formers",
      "Exam tip: Cranberry + warfarin = monitor INR; Cranberry mechanism for UTI = prevents bacterial adhesion"
    ],
    quiz: [
      {
        question: "A patient on warfarin begins drinking 2 liters of cranberry juice daily for UTI prevention. What should the nurse anticipate?",
        options: ["No interaction — cranberry is always safe", "Potential for elevated INR and increased bleeding risk due to CYP2C9 inhibition", "Decreased INR requiring higher warfarin doses", "Cranberry will cure the UTI without antibiotics"],
        correct: 1,
        rationale: "Cranberry contains flavonoids that inhibit CYP2C9, the primary enzyme metabolizing warfarin. Large-volume consumption can significantly increase warfarin levels and INR, increasing bleeding risk."
      },
      {
        question: "How does cranberry prevent urinary tract infections?",
        options: ["By acidifying the urine to kill bacteria", "By acting as an antibiotic", "By blocking bacterial adhesion to uroepithelial cells through A-type proanthocyanidin inhibition of P-fimbriae", "By increasing urine output to flush bacteria"],
        correct: 2,
        rationale: "Cranberry's A-type proanthocyanidins (PACs) inhibit P-fimbriae on E. coli, preventing bacterial adhesion to uroepithelial cells. This is a prevention mechanism — it does not acidify urine or kill existing bacteria."
      },
      {
        question: "A patient with a history of calcium oxalate kidney stones asks about cranberry supplements. What should the nurse advise?",
        options: ["Cranberry is safe and beneficial for kidney stone patients", "Cranberry increases urinary oxalate excretion, which may increase the risk of calcium oxalate stone formation", "Cranberry dissolves kidney stones", "Cranberry has no effect on kidney stones"],
        correct: 1,
        rationale: "Cranberry increases urinary oxalate excretion. In patients prone to calcium oxalate kidney stones (the most common type), this increased oxalate can promote stone formation."
      },
      {
        question: "Which cytochrome P450 enzyme is inhibited by cranberry, leading to its interaction with warfarin?",
        options: ["CYP3A4", "CYP1A2", "CYP2C9", "CYP2D6"],
        correct: 2,
        rationale: "Cranberry flavonoids inhibit CYP2C9, the primary enzyme responsible for warfarin metabolism. Inhibition of CYP2C9 decreases warfarin clearance, leading to elevated drug levels and increased anticoagulant effect."
      },
      {
        question: "A patient with a current UTI wants to use cranberry juice instead of antibiotics. What is the most appropriate nursing response?",
        options: ["Cranberry juice can effectively treat an active UTI", "Cranberry prevents bacterial adhesion but does not treat active infections — antibiotics are needed for active UTI treatment", "Cranberry kills bacteria more effectively than antibiotics", "Use cranberry for 48 hours, then try antibiotics if no improvement"],
        correct: 1,
        rationale: "Cranberry prevents UTI by blocking bacterial adhesion to uroepithelial cells. It does NOT kill bacteria and cannot treat an active infection. Antibiotics are required for active UTI treatment."
      }
    ]
  },

  "surgery-anesthesia-herbal-safety": {
    title: "Surgery & Anesthesia: Herbal Supplement Safety",
    cellular: {
      title: "Perioperative Herbal Safety",
      content: "Herbal supplements pose three categories of perioperative risk: (1) Bleeding risk — herbs with antiplatelet or anticoagulant properties (ginkgo, garlic, ginger, ginseng, vitamin E, fish oil, dong quai, feverfew) can cause intraoperative and postoperative hemorrhage; (2) Cardiovascular instability — herbs affecting blood pressure (ephedra, licorice root, garlic), heart rate, or vascular tone can interact with anesthetic agents and vasoactive drugs; (3) Prolonged sedation — herbs with GABAergic or sedative properties (valerian, kava, St. John's Wort-induced enzyme changes) can prolong anesthetic effects, delay emergence, and increase respiratory depression risk. The American Society of Anesthesiologists (ASA) recommends discontinuing all herbal supplements at least 2–3 weeks before elective surgery. Patients often do not voluntarily disclose supplement use; targeted questioning during the preoperative assessment is essential."
    },
    riskFactors: [
      "Any patient taking herbal supplements scheduled for surgery",
      "Patients on anticoagulants who also use herbal supplements",
      "Emergency surgical patients who cannot discontinue supplements preoperatively",
      "Elderly patients on multiple supplements and medications",
      "Patients undergoing procedures with high bleeding risk (cardiac, neurosurgery, orthopedic)",
      "Patients who do not disclose supplement use during preoperative assessment"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation including ALL supplements, herbs, vitamins, and teas",
      "PT/INR, aPTT, platelet count, and bleeding time as indicated",
      "Liver function tests if hepatotoxic herbs used (kava, comfrey)",
      "Baseline vital signs for comparison with intraoperative values",
      "Blood glucose if hypoglycemia-risk supplements used",
      "Drug levels of narrow therapeutic index medications"
    ],
    management: [
      "Discontinue ALL herbal supplements at least 2 weeks before elective surgery (ASA recommendation)",
      "Specific timelines: Ginkgo — 36+ hours; Garlic — 7 days; Ginseng — 7 days; Ephedra — 24 hours; Valerian — taper, do not abrupt stop; Kava — 24 hours; St. John's Wort — 5 days minimum; Fish Oil — 7 days; Vitamin E — 1 week",
      "Notify surgeon and anesthesiologist of ALL supplement use even if already discontinued",
      "For emergency surgery: inform anesthesia team of recent supplement use for intraoperative management",
      "Have reversal agents available when bleeding-risk herbs have been recently used",
      "Monitor coagulation parameters more frequently perioperatively"
    ],
    nursingActions: [
      "Conduct thorough preoperative interview specifically asking about herbal supplements, vitamins, and teas",
      "Use a standardized herbal supplement checklist in the preoperative assessment",
      "Notify surgeon AND anesthesiologist of any herbal supplement use",
      "Assess and document timing of last supplement dose",
      "Monitor for intraoperative and postoperative bleeding in patients who recently used bleeding-risk herbs",
      "Assess emergence from anesthesia — delayed emergence may indicate sedative herb interaction",
      "Monitor postoperative vital signs closely in patients who used cardioactive or vasoactive herbs"
    ],
    signs: {
      left: [
        "Intraoperative bleeding (ginkgo, garlic, ginger, ginseng, fish oil)",
        "Delayed hemostasis (antiplatelet herbs)",
        "Hematoma formation at surgical site",
        "Prolonged drain output"
      ],
      right: [
        "Delayed emergence from anesthesia (valerian, kava)",
        "Cardiovascular instability (ephedra, licorice root)",
        "Unexpected drug interactions with anesthetics (St. John's Wort enzyme effects)",
        "Postoperative hypoglycemia (ginseng, fenugreek)"
      ]
    },
    medications: [
      { name: "Preoperative Herbal Discontinuation Protocol", type: "Surgery Safety", action: "Eliminate pharmacokinetic and pharmacodynamic interactions with anesthetic and surgical agents", sideEffects: "Brief period without supplement benefits", contra: "Continued use creates unacceptable surgical risk", pearl: "The '2-week rule' is the general guideline — some herbs need longer, some shorter." },
      { name: "Valerian — Preoperative Taper", type: "Withdrawal Prevention", action: "Gradual dose reduction prevents benzodiazepine-like withdrawal", sideEffects: "Anxiety, insomnia if abruptly discontinued", contra: "Abrupt discontinuation before surgery", pearl: "Unlike other herbs, valerian should be TAPERED, not abruptly stopped, to avoid acute withdrawal that could complicate surgery." }
    ],
    pearls: [
      "ASA recommends stopping ALL herbal supplements 2–3 weeks before elective surgery",
      "The '4 Gs' (Ginkgo, Garlic, Ginger, Ginseng) are the highest bleeding risk — mnemonic for preop assessment",
      "Valerian is the exception: TAPER gradually rather than abrupt stop to prevent benzodiazepine-like withdrawal",
      "St. John's Wort can alter anesthetic drug metabolism for up to 2 weeks after discontinuation",
      "Patients often do not consider supplements as 'medications' — ask specifically during preop assessment"
    ],
    quiz: [
      {
        question: "A patient scheduled for total knee replacement reports taking ginkgo biloba, garlic supplements, and valerian root. What is the priority preoperative action?",
        options: ["Continue all supplements as prescribed", "Notify the surgeon and anesthesiologist of all three supplements and coordinate appropriate discontinuation timing", "Only stop the ginkgo biloba", "Cancel the surgery"],
        correct: 1,
        rationale: "All three supplements pose perioperative risks: ginkgo and garlic increase bleeding risk, and valerian may prolong anesthesia effects. The surgical and anesthesia teams must be notified to coordinate safe discontinuation timing."
      },
      {
        question: "Why should valerian root be tapered rather than abruptly discontinued before surgery?",
        options: ["Valerian has no withdrawal effects", "Abrupt discontinuation of chronic valerian use can cause benzodiazepine-like withdrawal symptoms including anxiety, insomnia, and tremor", "Tapering is optional for all herbal supplements", "Valerian is safe to continue during surgery"],
        correct: 1,
        rationale: "Valerian acts on GABA-A receptors similar to benzodiazepines. Chronic use leads to receptor adaptations, and abrupt discontinuation can trigger withdrawal symptoms (anxiety, insomnia, tremor) that could complicate the perioperative course."
      },
      {
        question: "How far in advance of elective surgery does the American Society of Anesthesiologists recommend discontinuing herbal supplements?",
        options: ["24 hours", "48 hours", "1 week", "2–3 weeks"],
        correct: 3,
        rationale: "The ASA recommends discontinuing all herbal supplements at least 2–3 weeks before elective surgery. This allows sufficient time for pharmacokinetic and pharmacodynamic effects to resolve, particularly for herbs with antiplatelet or enzyme-modulating properties."
      },
      {
        question: "An emergency surgery patient reports using St. John's Wort until yesterday. Which perioperative concern is most significant?",
        options: ["Allergic reaction to anesthesia", "Altered metabolism of anesthetic drugs due to CYP3A4 induction that persists 1–2 weeks after discontinuation", "Photosensitivity during surgery", "Increased appetite postoperatively"],
        correct: 1,
        rationale: "St. John's Wort induces CYP3A4, which metabolizes many anesthetic agents. This induction persists 1–2 weeks after discontinuation, potentially causing faster drug metabolism and reduced anesthetic efficacy during surgery."
      },
      {
        question: "During preoperative assessment, the nurse asks 'Do you take any medications?' and the patient says 'No.' What follow-up question is essential?",
        options: ["'Do you have any allergies?'", "'Do you take any vitamins, supplements, herbal products, or natural remedies?'", "'Do you exercise regularly?'", "'Do you have insurance?'"],
        correct: 1,
        rationale: "Patients often do not consider supplements, vitamins, and herbal products as 'medications.' The nurse must specifically ask about these products using plain language to capture herbal supplement use that could affect surgical safety."
      }
    ]
  }
};
