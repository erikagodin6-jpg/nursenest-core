import type { LessonContent } from "./types";

export const herbalSupplementsQuestionBank: Record<string, LessonContent> = {
  "herbal-supplements-question-bank": {
    title: "Herbal Supplements & Medication Safety Question Bank",
    cellular: {
      title: "Comprehensive Herbal Supplement Assessment",
      content: "This question bank covers herbal supplement-drug interactions, perioperative safety, patient teaching, medication reconciliation, CYP450 interactions, bleeding risk assessment, serotonin syndrome, hepatotoxicity, and culturally sensitive patient education. Questions span all difficulty levels from fundamental recognition to advanced clinical application scenarios."
    },
    quiz: [
      {
        question: "A patient on warfarin reports drinking large amounts of cranberry juice daily. The nurse checks the INR and finds it elevated at 4.5. Which mechanism explains this interaction?",
        options: ["Cranberry increases vitamin K absorption", "Cranberry inhibits CYP2C9, reducing warfarin metabolism", "Cranberry causes liver failure", "Cranberry increases warfarin absorption"],
        correct: 1,
        rationale: "Cranberry contains flavonoids that inhibit CYP2C9, the primary enzyme responsible for warfarin metabolism. Reduced warfarin clearance leads to elevated drug levels and increased INR."
      },
      {
        question: "Which herbal supplement should the nurse be most concerned about in a patient taking cyclosporine after a heart transplant?",
        options: ["Chamomile", "Melatonin", "St. John's Wort", "Saw palmetto"],
        correct: 2,
        rationale: "St. John's Wort induces CYP3A4 and P-glycoprotein, dramatically reducing cyclosporine blood levels. This can lead to acute transplant rejection. Case reports of heart transplant rejection have been directly attributed to St. John's Wort."
      },
      {
        question: "A preoperative nurse asks a patient about medications. The patient says 'I don't take any medications, just some vitamins and ginkgo for my memory.' What is the priority nursing action?",
        options: ["Document that the patient takes no medications", "Notify the surgeon and anesthesiologist about ginkgo biloba use", "Tell the patient to continue ginkgo since it's natural", "No further action needed"],
        correct: 1,
        rationale: "Ginkgo biloba inhibits platelet-activating factor (PAF) and increases bleeding risk during surgery. The surgical and anesthesia teams must be notified so they can plan for potential bleeding complications and determine appropriate discontinuation."
      },
      {
        question: "A nurse is assessing a patient who takes valerian root nightly for sleep and is prescribed lorazepam (Ativan) for anxiety. Which adverse effect is most likely?",
        options: ["Hypertension", "Serotonin syndrome", "Excessive CNS depression", "Hyperglycemia"],
        correct: 2,
        rationale: "Both valerian and lorazepam enhance GABA-A receptor activity. Combined use produces additive CNS depression, increasing risk of excessive sedation, respiratory depression, and falls."
      },
      {
        question: "Which nursing assessment question is most effective for identifying herbal supplement use?",
        options: ["'Do you take any medications?'", "'What vitamins, supplements, herbs, or natural products do you take?'", "'Are you allergic to anything?'", "'Do you follow any special diets?'"],
        correct: 1,
        rationale: "Patients often do not consider supplements as 'medications.' Using specific, inclusive language that mentions vitamins, supplements, herbs, and natural products is essential to capture herbal supplement use during medication reconciliation."
      },
      {
        question: "A patient taking fluoxetine (Prozac) starts using St. John's Wort. Which early sign of serotonin syndrome should the nurse monitor for?",
        options: ["Bradycardia", "Agitation and tremor", "Hypothermia", "Constipation"],
        correct: 1,
        rationale: "Serotonin syndrome presents with agitation, tremor, clonus, diaphoresis, and hyperthermia. The combination of an SSRI (fluoxetine) and a serotonergic herb (St. John's Wort) is a classic trigger. Agitation and tremor are typically the earliest manifestations."
      },
      {
        question: "A patient reports taking kava for anxiety. Which laboratory test should the nurse prioritize?",
        options: ["Complete blood count", "Liver function tests (AST, ALT)", "Thyroid function tests", "Hemoglobin A1C"],
        correct: 1,
        rationale: "Kava is associated with severe hepatotoxicity, including fulminant liver failure requiring transplantation. Liver function tests (AST, ALT, bilirubin) are essential to monitor for hepatic injury."
      },
      {
        question: "The nurse is educating a patient about the '4 Gs.' Which supplements are included in this mnemonic?",
        options: ["Glucosamine, Green tea, Guarana, Goldenseal", "Ginkgo, Garlic, Ginger, Ginseng", "Gotu kola, Grape seed, Guggul, Gymnema", "Ginger, Guarana, Ginseng, Green tea"],
        correct: 1,
        rationale: "The '4 Gs' (Ginkgo, Garlic, Ginger, Ginseng) is a critical nursing mnemonic for herbal supplements that increase bleeding risk by inhibiting platelet aggregation. All should be reported preoperatively."
      },
      {
        question: "A woman on oral contraceptives reports taking St. John's Wort for mild depression. Which complication should the nurse warn about?",
        options: ["Weight gain from the contraceptive", "Risk of contraceptive failure and unintended pregnancy", "Development of acne", "Increased menstrual flow"],
        correct: 1,
        rationale: "St. John's Wort induces CYP3A4, increasing metabolism of ethinyl estradiol and progestins. This reduces contraceptive efficacy and can lead to breakthrough bleeding and unintended pregnancy. Barrier methods should be recommended."
      },
      {
        question: "Which herbal supplement has been banned in several countries due to reports of fulminant liver failure?",
        options: ["Echinacea", "Chamomile", "Kava", "Valerian"],
        correct: 2,
        rationale: "Kava (Piper methysticum) has been banned or restricted in Germany, Switzerland, France, Canada, and the UK due to over 100 reported cases of hepatotoxicity including liver failure, deaths, and transplants."
      },
      {
        question: "A patient with epilepsy asks about using evening primrose oil for PMS symptoms. What should the nurse advise?",
        options: ["Evening primrose oil is safe for all patients", "Evening primrose oil may lower the seizure threshold and should be avoided in epilepsy", "Only use it on days without seizure activity", "It's only dangerous at very high doses"],
        correct: 1,
        rationale: "Evening primrose oil has been shown to lower the seizure threshold, making it potentially dangerous for patients with epilepsy. It is especially risky when combined with phenothiazines, which also lower seizure threshold."
      },
      {
        question: "A kidney transplant recipient asks about taking echinacea during cold season. What is the most appropriate nursing response?",
        options: ["'Echinacea is effective and safe for cold prevention.'", "'Echinacea stimulates the immune system and may trigger rejection of your transplanted kidney.'", "'Only use echinacea tea, not capsules.'", "'Use echinacea for no more than 8 weeks.'"],
        correct: 1,
        rationale: "Echinacea stimulates immune function by activating macrophages and increasing phagocytic activity. In transplant recipients on immunosuppressive therapy, immune stimulation could trigger organ rejection."
      },
      {
        question: "A patient on warfarin uses turmeric/curcumin supplements with piperine (BioPerine). Why is this combination particularly dangerous?",
        options: ["Piperine causes kidney damage", "Piperine increases curcumin bioavailability by 2,000%, dramatically amplifying its antiplatelet effects", "Piperine neutralizes warfarin", "Turmeric is only dangerous without piperine"],
        correct: 1,
        rationale: "Curcumin's bioavailability is normally <1%. Piperine inhibits glucuronidation, increasing absorption 2,000%. This dramatically amplifies curcumin's antiplatelet effects, significantly increasing bleeding risk with warfarin."
      },
      {
        question: "A nurse identifies that a patient on digoxin is taking St. John's Wort. What therapeutic concern should the nurse anticipate?",
        options: ["Digoxin toxicity (elevated levels)", "Sub-therapeutic digoxin levels (reduced efficacy)", "Increased renal excretion of digoxin", "No interaction expected"],
        correct: 1,
        rationale: "St. John's Wort induces P-glycoprotein, which increases the efflux and clearance of digoxin. This results in sub-therapeutic digoxin levels and reduced cardiac efficacy."
      },
      {
        question: "How long before elective surgery does the American Society of Anesthesiologists recommend discontinuing all herbal supplements?",
        options: ["24 hours", "3 days", "1 week", "2–3 weeks"],
        correct: 3,
        rationale: "The ASA recommends discontinuing all herbal supplements at least 2–3 weeks before elective surgery to allow sufficient time for pharmacokinetic and pharmacodynamic effects to resolve."
      },
      {
        question: "A patient on melatonin and warfarin has an unexpectedly elevated INR. What is a likely contributing factor?",
        options: ["Melatonin increases vitamin K production", "Melatonin may enhance warfarin's anticoagulant effect", "Melatonin has no effect on warfarin", "Melatonin causes warfarin to be absorbed faster"],
        correct: 1,
        rationale: "Melatonin may increase warfarin's anticoagulant effect through an unclear mechanism. INR monitoring should be more frequent when melatonin is started or stopped in patients on warfarin."
      },
      {
        question: "A patient on fluvoxamine (Luvox) starts taking melatonin and develops excessive daytime drowsiness. What pharmacokinetic interaction explains this?",
        options: ["Fluvoxamine reduces melatonin absorption", "Fluvoxamine inhibits CYP1A2, increasing melatonin levels up to 17-fold", "Melatonin induces fluvoxamine metabolism", "There is no known interaction"],
        correct: 1,
        rationale: "Fluvoxamine is a potent CYP1A2 inhibitor. Melatonin is primarily metabolized by CYP1A2. When combined, melatonin levels can increase up to 17-fold, causing excessive and prolonged sedation."
      },
      {
        question: "A patient asks if chamomile tea is safe with their warfarin. What should the nurse advise?",
        options: ["Chamomile tea is completely safe with warfarin", "Occasional chamomile tea is generally low risk, but large daily consumption may increase INR due to coumarin content", "All chamomile use must be avoided with warfarin", "Chamomile decreases warfarin effectiveness"],
        correct: 1,
        rationale: "Chamomile contains coumarin derivatives that can potentiate warfarin. Occasional tea consumption is generally low risk, but large daily quantities or concentrated extracts have been associated with elevated INR and bleeding."
      },
      {
        question: "Before recommending echinacea or chamomile, which allergy should the nurse screen for?",
        options: ["Penicillin allergy", "Latex allergy", "Ragweed/Asteraceae family allergy", "Shellfish allergy"],
        correct: 2,
        rationale: "Both echinacea and chamomile belong to the Asteraceae (Compositae) plant family. Patients allergic to ragweed, chrysanthemums, marigolds, or daisies may have cross-reactive allergic responses."
      },
      {
        question: "A patient with BPH takes saw palmetto and finasteride together. What should the nurse educate about?",
        options: ["This combination provides superior symptom relief", "Both work by the same mechanism (5-alpha-reductase inhibition) — concurrent use is duplicative with no proven additional benefit", "Finasteride should be stopped in favor of saw palmetto", "Saw palmetto enhances finasteride effectiveness"],
        correct: 1,
        rationale: "Saw palmetto and finasteride share the same mechanism of action (5-alpha-reductase inhibition). Using both is duplicative, and clinical trials have not shown additional benefit from combination use."
      },
      {
        question: "A patient using saw palmetto for BPH is scheduled for PSA testing. What should the nurse communicate?",
        options: ["PSA testing is unnecessary", "Saw palmetto may lower PSA levels, potentially masking prostate cancer", "Saw palmetto does not affect PSA levels", "The PSA test should be done first thing in the morning only"],
        correct: 1,
        rationale: "Like finasteride, saw palmetto inhibits 5-alpha-reductase and may lower PSA levels. This could mask an elevated PSA that would otherwise prompt prostate cancer investigation."
      },
      {
        question: "A menopausal patient on atorvastatin develops elevated liver enzymes while taking black cohosh. What is the priority nursing action?",
        options: ["Continue both medications", "Discontinue black cohosh immediately and notify the provider", "Increase black cohosh dose for better symptom control", "Discontinue atorvastatin only"],
        correct: 1,
        rationale: "Both black cohosh and atorvastatin can cause hepatotoxicity. Black cohosh should be discontinued immediately and the provider notified to determine if the statin also needs adjustment."
      },
      {
        question: "What is the maximum recommended duration for continuous black cohosh use?",
        options: ["2 weeks", "1 month", "6 months", "No time limit"],
        correct: 2,
        rationale: "Due to limited long-term safety data and the risk of hepatotoxicity, black cohosh use should be limited to 6 months. Patients requiring longer treatment should be evaluated for alternatives."
      },
      {
        question: "How does black cohosh produce its effects on menopausal hot flashes?",
        options: ["Direct estrogen receptor agonism", "Serotonin receptor modulation (5-HT1A/5-HT7 agonism)", "Progesterone receptor activation", "Dopamine receptor blockade"],
        correct: 1,
        rationale: "Despite initial beliefs, black cohosh does NOT bind estrogen receptors. It acts through serotonin receptor modulation (5-HT1A and 5-HT7), which modulates thermoregulatory centers."
      },
      {
        question: "A nurse discovers a patient on cyclosporine has been using echinacea for 3 weeks. What clinical outcome is the nurse most concerned about?",
        options: ["Allergic reaction to echinacea", "Potential transplant rejection from immune stimulation counteracting immunosuppression", "GI upset from echinacea", "Photosensitivity"],
        correct: 1,
        rationale: "Echinacea's immunostimulatory effects may counteract cyclosporine's immunosuppressive action, potentially triggering transplant rejection."
      },
      {
        question: "A patient on warfarin, aspirin, and ginkgo biloba presents with spontaneous nosebleeds. Which risk category does this represent?",
        options: ["Single antiplatelet therapy", "Dual anticoagulant therapy", "Triple antithrombotic therapy with extremely high hemorrhage risk", "Normal anticoagulation"],
        correct: 2,
        rationale: "Ginkgo (PAF antagonist) + warfarin (vitamin K antagonist) + aspirin (COX inhibitor) creates triple antithrombotic activity. This combination places the patient at extremely high risk for hemorrhage."
      },
      {
        question: "What is the primary active compound in garlic responsible for its antiplatelet effects?",
        options: ["Hypericin", "Allicin", "Apigenin", "Kavalactone"],
        correct: 1,
        rationale: "Allicin (diallyl thiosulfinate) is the primary bioactive compound in garlic. It inhibits platelet aggregation by blocking thromboxane synthesis and calcium-dependent platelet activation."
      },
      {
        question: "A patient reports using garlic supplements while on saquinavir for HIV. What laboratory monitoring is essential?",
        options: ["Liver function tests only", "HIV viral load and CD4 count — garlic may reduce saquinavir levels by 50%", "Complete blood count only", "Renal function tests"],
        correct: 1,
        rationale: "Garlic supplements reduce saquinavir levels by approximately 50%, which can lead to inadequate viral suppression, increased viral load, and development of drug resistance."
      },
      {
        question: "A patient with Parkinson's disease is considering kava for anxiety. What should the nurse advise?",
        options: ["Kava is safe for Parkinson's patients", "Kava may worsen Parkinson's symptoms by antagonizing dopamine and reducing levodopa effectiveness", "Kava replaces the need for levodopa", "Use kava only on 'off' days"],
        correct: 1,
        rationale: "Kava has dopamine-antagonizing properties that can worsen Parkinson's symptoms and reduce levodopa effectiveness. Extrapyramidal symptoms have been reported with kava use."
      },
      {
        question: "A patient develops a yellowish, scaly skin rash after months of daily kava use. What does the nurse recognize?",
        options: ["Jaundice from liver failure", "Kava dermopathy", "Contact dermatitis", "Psoriasis"],
        correct: 1,
        rationale: "Kava dermopathy is a distinct ichthyosiform eruption (dry, yellowish, scaly skin) caused by chronic kava use. It is different from jaundice and is reversible with discontinuation."
      },
      {
        question: "Which combination places a patient at highest risk for seizures?",
        options: ["Evening primrose oil + vitamin C", "Evening primrose oil + chlorpromazine (phenothiazine)", "Evening primrose oil + melatonin", "Evening primrose oil + acetaminophen"],
        correct: 1,
        rationale: "Both evening primrose oil and phenothiazines lower the seizure threshold. Combined use creates additive epileptogenic risk. This is a classic exam combination."
      },
      {
        question: "Why is saw palmetto contraindicated during pregnancy?",
        options: ["It causes hypertension", "It has anti-androgenic effects that can affect fetal development", "It causes hyperglycemia", "It depletes folic acid"],
        correct: 1,
        rationale: "Saw palmetto inhibits 5-alpha-reductase and has anti-androgenic properties similar to finasteride (pregnancy category X). These effects can potentially harm fetal development."
      },
      {
        question: "A patient taking 5 grams of fish oil daily and warfarin develops bruising. What is the most likely cause?",
        options: ["Warfarin allergy", "High-dose omega-3 (>3 g/day) adding antiplatelet effects to warfarin's anticoagulant effect", "Vitamin A toxicity from fish oil", "Warfarin malabsorption"],
        correct: 1,
        rationale: "Fish oil at >3 g/day significantly inhibits thromboxane A2 production, creating antiplatelet effects. Combined with warfarin's anticoagulant effect, this increases bleeding risk."
      },
      {
        question: "At what daily dose do omega-3 fatty acids carry significant bleeding risk?",
        options: ["0.5 g/day", "1 g/day", "Greater than 3 g/day", "10 g/day"],
        correct: 2,
        rationale: "Doses above 3 g/day of EPA + DHA carry clinically significant antiplatelet effects and bleeding risk. The FDA recommends dietary supplement omega-3 not exceed 3 g/day without medical supervision."
      },
      {
        question: "A patient asks about the difference between dietary turmeric in cooking and curcumin supplements. What is the best nursing response?",
        options: ["They are identical in risk", "Dietary turmeric is generally safe; concentrated curcumin supplements, especially with piperine, carry higher interaction risks", "Dietary turmeric is more dangerous", "Neither has any health effects"],
        correct: 1,
        rationale: "Dietary turmeric provides low curcumin doses with <1% bioavailability. Concentrated supplements, especially with piperine (2,000% bioavailability increase), deliver dramatically higher active doses."
      },
      {
        question: "How does cranberry prevent urinary tract infections?",
        options: ["By acidifying the urine to kill bacteria", "By acting as an antibiotic", "By blocking bacterial adhesion to uroepithelial cells via A-type proanthocyanidins", "By increasing urine output"],
        correct: 2,
        rationale: "Cranberry's A-type proanthocyanidins (PACs) inhibit P-fimbriae on E. coli, preventing bacterial adhesion. This is a prevention mechanism — not antibacterial or urine-acidifying."
      },
      {
        question: "A patient with calcium oxalate kidney stones asks about cranberry supplements. What should the nurse advise?",
        options: ["Cranberry prevents kidney stones", "Cranberry increases urinary oxalate and may promote calcium oxalate stone formation", "Cranberry dissolves kidney stones", "Cranberry has no effect on stones"],
        correct: 1,
        rationale: "Cranberry increases urinary oxalate excretion. In patients prone to calcium oxalate kidney stones (the most common type), this can promote stone formation."
      },
      {
        question: "What is the physiological dose of melatonin that most closely mimics natural production?",
        options: ["0.3–0.5 mg", "5 mg", "10 mg", "20 mg"],
        correct: 0,
        rationale: "Physiological melatonin production is approximately 0.3–0.5 mg per night. Most commercial supplements contain 3–10 mg (6–33× physiological dose). Lower doses are often more effective."
      },
      {
        question: "For which condition does melatonin have the strongest evidence?",
        options: ["Primary insomnia", "Jet lag and circadian rhythm disorders", "Chronic pain", "Anxiety disorders"],
        correct: 1,
        rationale: "Melatonin has the strongest evidence for circadian rhythm sleep disorders (jet lag, delayed sleep-wake phase, shift work disorder) through MT2 receptor activation in the suprachiasmatic nucleus."
      },
      {
        question: "A patient taking sertraline and St. John's Wort develops hyperthermia (104°F), clonus, diaphoresis, and confusion. What condition does the nurse suspect?",
        options: ["Neuroleptic malignant syndrome", "Malignant hyperthermia", "Serotonin syndrome", "Anticholinergic toxicity"],
        correct: 2,
        rationale: "This presentation is classic serotonin syndrome: hyperthermia, clonus, diaphoresis, altered mental status. The combination of sertraline (SSRI) and St. John's Wort (serotonergic herb) is the trigger."
      },
      {
        question: "After discontinuing St. John's Wort, how long should the nurse expect CYP3A4 induction to persist?",
        options: ["24 hours", "3 days", "1–2 weeks", "3 months"],
        correct: 2,
        rationale: "CYP3A4 enzyme induction from St. John's Wort takes 1–2 weeks to fully resolve. During this time, drug levels of previously affected medications will gradually increase."
      },
      {
        question: "An emergency surgery patient reports using St. John's Wort until yesterday. What is the primary anesthesia concern?",
        options: ["Allergic reaction to anesthetics", "Altered metabolism of anesthetic drugs due to CYP3A4 induction persisting 1–2 weeks", "Photosensitivity under OR lights", "Increased bleeding"],
        correct: 1,
        rationale: "CYP3A4 induction persists 1–2 weeks after discontinuation. Many anesthetic agents are CYP3A4 substrates, so faster metabolism could reduce anesthetic efficacy."
      },
      {
        question: "Which statement by a patient indicates understanding of herbal supplement safety before surgery?",
        options: ["'I can continue my ginkgo since it's natural.'", "'I need to stop all herbal supplements at least 2 weeks before my surgery and tell my surgeon what I've been taking.'", "'Only prescription medications matter before surgery.'", "'I'll stop my supplements the morning of surgery.'"],
        correct: 1,
        rationale: "This demonstrates understanding of both the discontinuation timeline (2 weeks) and the importance of disclosure to the surgical team."
      },
      {
        question: "Why should valerian root be tapered rather than abruptly stopped before surgery?",
        options: ["Valerian has no withdrawal effects", "Abrupt discontinuation can cause benzodiazepine-like withdrawal (anxiety, insomnia, tremor)", "Tapering is optional", "Valerian is safe during surgery"],
        correct: 1,
        rationale: "Valerian acts on GABA-A receptors similarly to benzodiazepines. Chronic use leads to receptor adaptations, and abrupt discontinuation can trigger withdrawal symptoms."
      },
      {
        question: "A nurse finds that a diabetic patient on insulin has started taking American ginseng. What monitoring change is needed?",
        options: ["No change needed", "More frequent blood glucose monitoring due to additive hypoglycemia risk", "Less frequent glucose monitoring", "Switch to oral hypoglycemics"],
        correct: 1,
        rationale: "American ginseng reduces postprandial blood glucose. Combined with insulin, this creates additive hypoglycemia risk requiring increased glucose monitoring."
      },
      {
        question: "Which cytochrome P450 enzyme does St. John's Wort most significantly induce?",
        options: ["CYP2D6", "CYP2E1", "CYP3A4", "CYP2B6"],
        correct: 2,
        rationale: "CYP3A4 is the most important enzyme induced by St. John's Wort. CYP3A4 metabolizes approximately 50% of all prescribed medications."
      },
      {
        question: "A patient on both garlic supplements and warfarin asks if switching to dietary garlic in cooking would be safer. What should the nurse respond?",
        options: ["All garlic must be avoided", "Dietary garlic in normal cooking amounts is generally safe; concentrated supplements carry higher interaction risk", "Dietary garlic is equally dangerous", "Switch to garlic oil capsules instead"],
        correct: 1,
        rationale: "Dietary garlic in normal culinary amounts provides lower doses with less concentrated active compounds. Supplements provide much higher, concentrated doses of allicin."
      },
      {
        question: "Which patient is at highest risk for an adverse herb-drug interaction?",
        options: ["A healthy 30-year-old taking a daily multivitamin", "A 72-year-old on warfarin, digoxin, and ginkgo biloba who is scheduled for hip surgery", "A 25-year-old taking occasional chamomile tea", "A 40-year-old using turmeric in cooking"],
        correct: 1,
        rationale: "This patient has multiple risk factors: elderly (altered pharmacokinetics), narrow therapeutic index drugs (warfarin, digoxin), antiplatelet herb (ginkgo), and upcoming surgery."
      },
      {
        question: "A patient with an active UTI asks to use cranberry juice instead of antibiotics. What is the correct nursing response?",
        options: ["Cranberry can replace antibiotics for UTI treatment", "Cranberry prevents bacterial adhesion but cannot treat an active infection — antibiotics are needed", "Use both equally", "Cranberry kills bacteria better than antibiotics"],
        correct: 1,
        rationale: "Cranberry prevents UTI by blocking bacterial adhesion but does not kill existing bacteria. Active infections require antibiotic treatment."
      },
      {
        question: "A patient with estrogen-receptor positive breast cancer asks about using ginseng for fatigue. What should the nurse advise?",
        options: ["Ginseng is completely safe", "Ginseng has weak estrogenic properties and should be discussed with the oncologist before use", "Only American ginseng is safe", "Ginseng has no hormonal effects"],
        correct: 1,
        rationale: "Ginseng has weak estrogenic properties through estrogen receptor binding. Even weak estrogenic stimulation could potentially promote tumor growth in hormone-sensitive cancers."
      },
      {
        question: "Which herb has a unique interaction profile with warfarin — it may DECREASE INR while still increasing bleeding risk?",
        options: ["Ginkgo biloba", "Garlic", "Ginseng", "Chamomile"],
        correct: 2,
        rationale: "Ginseng may reduce warfarin's anticoagulant effect (decreasing INR) while simultaneously having antiplatelet properties that increase bleeding risk through a different mechanism."
      },
      {
        question: "A patient develops agitation, clonus, diaphoresis, and hyperthermia while taking venlafaxine and St. John's Wort. What is the immediate priority?",
        options: ["Administer acetaminophen for fever", "Discontinue the offending agents, provide supportive care, and prepare for possible cyproheptadine administration", "Apply cooling blankets only", "Increase the venlafaxine dose"],
        correct: 1,
        rationale: "This is serotonin syndrome. Treatment includes discontinuing serotonergic agents, supportive care, benzodiazepines for agitation, and cyproheptadine (serotonin antagonist) for severe cases."
      },
      {
        question: "Which statement best describes why herbal supplements are not regulated like prescription drugs?",
        options: ["The FDA considers them completely safe", "Under DSHEA (1994), dietary supplements do not require pre-market proof of safety or efficacy", "They contain no active ingredients", "They are regulated equally to prescription drugs"],
        correct: 1,
        rationale: "The Dietary Supplement Health and Education Act (DSHEA, 1994) classifies herbals as dietary supplements, exempting them from the rigorous pre-market testing required for pharmaceuticals."
      },
      {
        question: "A nurse is conducting medication reconciliation. The patient says 'I only take natural things — nothing important.' What follow-up is needed?",
        options: ["Accept the patient's assessment and move on", "Specifically ask about each supplement type: herbs, vitamins, teas, topical products, and homeopathic remedies", "Skip supplements in the medication record", "Only ask about prescription medications"],
        correct: 1,
        rationale: "Patients commonly minimize supplement use. The nurse must specifically probe for different categories of natural products to capture all herbal supplement use."
      },
      {
        question: "Which herbal supplement lowers the seizure threshold and is specifically dangerous with phenothiazines?",
        options: ["Chamomile", "Evening primrose oil", "Saw palmetto", "Cranberry"],
        correct: 1,
        rationale: "Evening primrose oil lowers the seizure threshold. Combined with phenothiazines (which also lower seizure threshold), the additive effect creates significant seizure risk."
      },
      {
        question: "A patient asks why they need to tell their anesthesiologist about taking valerian root. What is the best explanation?",
        options: ["Valerian causes allergic reactions to anesthetics", "Valerian enhances GABA receptor activity and may prolong anesthesia effects, increasing the risk of delayed emergence", "Valerian has no effect on anesthesia", "Valerian causes malignant hyperthermia"],
        correct: 1,
        rationale: "Valerian's GABA-A receptor activity may potentiate anesthetic agents, prolonging sedation and delaying emergence from anesthesia."
      },
      {
        question: "A patient on warfarin begins taking a chamomile extract supplement daily. What should the nurse anticipate?",
        options: ["Decreased INR", "Potentially elevated INR due to chamomile's coumarin content", "No change in INR", "Warfarin will become more effective with no risk"],
        correct: 1,
        rationale: "Chamomile contains coumarin derivatives that can potentiate warfarin's anticoagulant effect. Concentrated extracts carry more risk than occasional tea consumption."
      },
      {
        question: "Which mechanism explains ginkgo biloba's antiplatelet effect?",
        options: ["COX-1 inhibition", "Vitamin K antagonism", "Platelet-activating factor (PAF) antagonism", "Thrombin inhibition"],
        correct: 2,
        rationale: "Ginkgolide B in ginkgo is a potent antagonist of platelet-activating factor (PAF), which inhibits platelet aggregation and increases bleeding time."
      },
      {
        question: "A patient is taking St. John's Wort and HIV protease inhibitors. What is the nurse's primary concern?",
        options: ["GI side effects", "HIV treatment failure due to reduced drug levels from CYP3A4 induction", "Photosensitivity", "Weight gain"],
        correct: 1,
        rationale: "St. John's Wort induces CYP3A4 and P-glycoprotein, dramatically reducing HIV protease inhibitor levels. This can lead to treatment failure and development of viral resistance."
      },
      {
        question: "What distinguishes kava dermopathy from jaundice?",
        options: ["They are the same condition", "Kava dermopathy is a dry, scaly, yellowish skin eruption from chronic kava use; jaundice indicates liver failure with bilirubin elevation", "Kava dermopathy only affects the face", "Jaundice is always caused by kava"],
        correct: 1,
        rationale: "Kava dermopathy is an ichthyosiform eruption (dry, scaly skin) from chronic use — it's a distinct dermatological finding. Jaundice results from elevated bilirubin due to liver dysfunction."
      },
      {
        question: "A nurse is teaching a culturally diverse patient about herbal supplement safety. Which approach is most appropriate?",
        options: ["Tell the patient their traditional remedies are wrong and must be stopped immediately", "Respectfully acknowledge the patient's cultural practices, provide safety information about interactions, and focus on monitoring rather than prohibition", "Ignore supplement use if it's cultural", "Refuse to care for patients who use traditional remedies"],
        correct: 1,
        rationale: "Culturally sensitive care respects patient autonomy and cultural practices while ensuring safety through education and monitoring."
      },
      {
        question: "Which combination is most dangerous for a patient scheduled for cardiac surgery?",
        options: ["Chamomile tea + acetaminophen", "Ginkgo biloba + aspirin + warfarin", "Melatonin + multivitamin", "Saw palmetto + tamsulosin"],
        correct: 1,
        rationale: "Ginkgo (PAF antagonist) + aspirin (COX inhibitor) + warfarin (vitamin K antagonist) creates triple antithrombotic activity, placing the cardiac surgery patient at extreme hemorrhage risk."
      },
      {
        question: "A nurse documents that a patient takes 'herbal supplements.' What improvement in documentation is needed?",
        options: ["This documentation is adequate", "Document specific product names, doses, frequency, formulation, and reason for use", "Only brand names need to be recorded", "Supplements don't need to be documented"],
        correct: 1,
        rationale: "Specific documentation (product name, dose, frequency, formulation, reason) is essential for accurate interaction screening and interprofessional communication."
      },
      {
        question: "A patient with rheumatoid arthritis has been using echinacea daily for 4 months. Which two concerns should the nurse address?",
        options: ["Cost and taste", "Possible autoimmune flare from immune stimulation AND prolonged use beyond recommended 10–14 day duration", "Weight gain and insomnia", "Headache and nausea"],
        correct: 1,
        rationale: "Echinacea stimulates immune function (risky in autoimmune diseases) and should only be used for 10–14 days. Continuous use beyond 8 weeks may paradoxically alter immune function."
      },
      {
        question: "What is the primary omega-6 fatty acid in evening primrose oil?",
        options: ["Alpha-linolenic acid (ALA)", "Eicosapentaenoic acid (EPA)", "Gamma-linolenic acid (GLA)", "Docosahexaenoic acid (DHA)"],
        correct: 2,
        rationale: "Gamma-linolenic acid (GLA) is the primary active omega-6 fatty acid in evening primrose oil. GLA is converted to DGLA, a precursor to anti-inflammatory prostaglandin E1."
      },
      {
        question: "A patient asks if 'natural' supplements are always safer than prescription drugs. What is the best nursing response?",
        options: ["'Yes, natural products are always safer.'", "'Natural does not mean safe — herbal supplements contain pharmacologically active compounds that can cause serious side effects and drug interactions, just like prescription medications.'", "'Prescription drugs are always better.'", "'We can't comment on that.'"],
        correct: 1,
        rationale: "The misconception that 'natural = safe' is one of the most dangerous patient beliefs. Herbal supplements are pharmacologically active and can cause serious adverse events and drug interactions."
      },
      {
        question: "Which of the following patients should NOT use melatonin without medical supervision?",
        options: ["A healthy college student with jet lag", "A kidney transplant recipient on tacrolimus", "A healthy adult with occasional insomnia", "A shift worker adjusting sleep schedule"],
        correct: 1,
        rationale: "Melatonin has immunostimulatory properties. In transplant recipients on immunosuppressive therapy (tacrolimus), immune stimulation could counteract immunosuppression and risk rejection."
      },
      {
        question: "A patient on multiple medications asks which supplement quality marker to look for. What should the nurse recommend?",
        options: ["The cheapest option available", "Products with USP, NSF, or ConsumerLab third-party verification", "The product with the most ingredients", "Whatever is most advertised"],
        correct: 1,
        rationale: "USP (United States Pharmacopeia), NSF International, and ConsumerLab provide third-party testing that verifies supplement purity, potency, and absence of contaminants."
      },
      {
        question: "Which clinical trial showed prescription icosapent ethyl (Vascepa) reduces cardiovascular events?",
        options: ["SPRINT", "REDUCE-IT", "ACCORD", "ALLHAT"],
        correct: 1,
        rationale: "The REDUCE-IT trial demonstrated that prescription icosapent ethyl (EPA-only, Vascepa) reduced major adverse cardiovascular events by 25% in patients with elevated triglycerides."
      },
      {
        question: "A nurse discovers a postoperative patient had been taking garlic supplements until 2 days before surgery. What should the nurse monitor for?",
        options: ["Hyperglycemia", "Increased surgical site bleeding and hematoma formation", "Hypertension", "Fever"],
        correct: 1,
        rationale: "Garlic supplements should be stopped 7–10 days before surgery. Only 2 days of discontinuation is insufficient — the antiplatelet effects are still present, increasing bleeding risk."
      },
      {
        question: "A patient refuses to stop St. John's Wort despite learning about interactions with their SSRI. What is the nurse's responsibility?",
        options: ["Force the patient to stop", "Document the conversation, the patient's informed decision, and notify the prescriber for appropriate monitoring", "Discharge the patient from care", "Ignore the situation"],
        correct: 1,
        rationale: "Patient autonomy must be respected. The nurse should document the education provided, the patient's informed decision, and notify the prescriber so monitoring (for serotonin syndrome) can be implemented."
      },
      {
        question: "Which herb is described as the 'most clinically dangerous herbal supplement for drug interactions'?",
        options: ["Kava", "St. John's Wort", "Ginkgo biloba", "Echinacea"],
        correct: 1,
        rationale: "St. John's Wort has the most extensive drug interaction profile due to CYP3A4, CYP2C9, CYP1A2, and P-glycoprotein induction, affecting approximately 50% of all prescribed medications."
      },
      {
        question: "A patient on lithium starts taking St. John's Wort. What drug level change should the nurse anticipate?",
        options: ["Increased lithium levels (toxicity risk)", "Decreased lithium levels (sub-therapeutic, mood destabilization)", "No change in lithium levels", "Lithium becomes undetectable"],
        correct: 1,
        rationale: "St. John's Wort can increase renal clearance of lithium, leading to sub-therapeutic levels and risk of mood destabilization in bipolar patients."
      },
      {
        question: "A preoperative checklist includes herbal supplement screening. Which is the MOST important question?",
        options: ["'What prescription medications do you take?'", "'Do you take any herbs, supplements, vitamins, fish oil, or natural products?'", "'Do you drink coffee?'", "'What is your diet like?'"],
        correct: 1,
        rationale: "Specifically naming different supplement categories (herbs, supplements, vitamins, fish oil, natural products) captures the broadest range of potentially interacting substances."
      },
      {
        question: "Which compound in chamomile binds to GABA-A receptors at benzodiazepine sites?",
        options: ["Allicin", "Hypericin", "Apigenin", "Valerenic acid"],
        correct: 2,
        rationale: "Apigenin is a flavonoid in chamomile that binds GABA-A receptors at the benzodiazepine binding site, producing mild anxiolytic and sedative effects."
      },
      {
        question: "A patient takes curcumin supplements for joint inflammation. Which mechanism explains curcumin's anti-inflammatory effect?",
        options: ["Histamine receptor blockade", "NF-κB, COX-2, and lipoxygenase inhibition", "Cortisol stimulation", "Acetylcholine activation"],
        correct: 1,
        rationale: "Curcumin inhibits NF-κB (master inflammatory transcription factor), COX-2, lipoxygenase, and iNOS, producing potent anti-inflammatory effects."
      },
      {
        question: "How does omega-3 fatty acid supplementation reduce inflammation?",
        options: ["By killing inflammatory cells", "By competing with arachidonic acid for COX/LOX enzymes, producing less inflammatory eicosanoids", "By blocking histamine receptors", "By stimulating cortisol production"],
        correct: 1,
        rationale: "EPA/DHA compete with arachidonic acid for COX and LOX enzymes, producing less-potent prostaglandins (PGE3 vs PGE2) and leukotrienes (LTB5 vs LTB4)."
      },
      {
        question: "A patient on phenytoin for seizure control uses evening primrose oil for eczema. What is the priority concern?",
        options: ["EPO increases phenytoin levels", "EPO lowers seizure threshold, potentially counteracting phenytoin's anticonvulsant effect", "EPO causes skin worsening", "No interaction exists"],
        correct: 1,
        rationale: "Evening primrose oil lowers the seizure threshold, potentially counteracting phenytoin's anticonvulsant therapy and increasing seizure risk."
      }
    ],
    medications: [],
    riskFactors: [],
    nursingActions: [],
    pearls: [
      "The '4 Gs' (Ginkgo, Garlic, Ginger, Ginseng) all increase bleeding risk — report preoperatively",
      "St. John's Wort is the most dangerous herbal for drug interactions — CYP3A4 induction affects ~50% of medications",
      "Always ask specifically about supplements — patients don't consider them 'medications'",
      "Kava is hepatotoxic — banned in several countries",
      "Evening primrose oil lowers seizure threshold — dangerous with phenothiazines",
      "Stop ALL herbal supplements 2-3 weeks before elective surgery (ASA recommendation)",
      "Valerian should be TAPERED, not abruptly stopped, to avoid withdrawal",
      "Cranberry inhibits CYP2C9 — increases warfarin levels",
      "Natural ≠ Safe — herbal products are pharmacologically active"
    ]
  }
};
