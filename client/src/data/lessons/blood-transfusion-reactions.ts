import type { LessonContent } from "./types";

export const bloodTransfusionReactionLessons: Record<string, LessonContent> = {
  "blood-transfusion-reactions": {
    title: "Blood Transfusion Reactions: Complete",
    cellular: {
      title: "Immunology of Transfusion Reactions",
      content: "Blood transfusion reactions occur when the recipient's immune system recognizes components of the transfused blood as foreign and mounts a response. Understanding the immunological basis requires mastery of the ABO and Rh blood group systems, antigen-antibody interactions, and the complement cascade.\n\nThe ABO blood group system is determined by the presence or absence of A and B antigens on the surface of red blood cells. Type A blood has A antigens and produces anti-B antibodies (isohemagglutinins) in the plasma. Type B has B antigens and anti-A antibodies. Type AB has both A and B antigens but neither antibody, making AB+ the universal recipient for packed red blood cells. Type O has neither A nor B antigens but carries both anti-A and anti-B antibodies, making O- the universal RBC donor.\n\nThe Rh system centers on the D antigen. Rh-positive individuals carry the D antigen; Rh-negative individuals do not. An Rh-negative patient who receives Rh-positive blood will develop anti-D antibodies, causing hemolysis on subsequent exposures. This is critical in pregnancy: an Rh-negative mother carrying an Rh-positive fetus can develop anti-D antibodies that cross the placenta and attack fetal RBCs (hemolytic disease of the newborn).\n\nTransfusion reactions are classified into six major categories based on mechanism and timing: (1) Acute Hemolytic Transfusion Reaction (AHTR) - ABO incompatibility causing complement-mediated intravascular hemolysis within minutes; (2) Febrile Non-Hemolytic Transfusion Reaction (FNHTR) - cytokine-mediated fever from WBC antigens, the most common reaction; (3) Mild Allergic Reaction - IgE-mediated response to donor plasma proteins causing urticaria; (4) Anaphylactic Reaction - severe IgE-mediated or anti-IgA response with bronchospasm and cardiovascular collapse; (5) Transfusion-Associated Circulatory Overload (TACO) - volume overload from rapid or excessive transfusion; (6) Transfusion-Related Acute Lung Injury (TRALI) - donor antibodies activating recipient neutrophils in pulmonary vasculature causing non-cardiogenic pulmonary edema.\n\nPre-transfusion safety requires a type and crossmatch, where the blood bank tests recipient serum against donor RBCs to detect incompatibility. Two registered nurses must independently verify patient identity, blood product label, ABO/Rh compatibility, expiration date, and the prescriber order at the bedside. This two-person verification is the single most important safety measure because the most common cause of fatal transfusion reactions is clerical error - mislabeled specimens, wrong patient identification, or failure to verify at the bedside.\n\nBlood products must be infused using a blood administration set with a 170-260 micron in-line filter. The only IV solution compatible with blood products is 0.9% normal saline. Lactated Ringers contains calcium which chelates the citrate anticoagulant in stored blood, causing clot formation in the tubing. Dextrose solutions cause osmotic swelling and lysis of red blood cells. Each unit of PRBCs must be completed within 4 hours of removal from the blood bank to prevent bacterial proliferation.\n\nThe first 15 minutes of every transfusion are the most critical monitoring period because the most severe reactions - acute hemolytic and anaphylactic - typically present within this window. The nurse must remain at the bedside during this time and obtain vital signs at baseline, 15 minutes, 30 minutes, and upon completion. Any new symptom during a transfusion should be treated as a potential reaction until proven otherwise.\n\nACUTE HEMOLYTIC REACTION: Occurs within minutes when ABO-incompatible blood is transfused. Recipient antibodies bind donor RBC antigens, activating complement and causing massive intravascular hemolysis. Free hemoglobin floods the plasma, is filtered by the kidneys, and deposits in renal tubules causing acute kidney injury. Hallmark signs: sudden fever with rigors, severe flank or low back pain, hemoglobinuria (dark red or cola-colored urine), hypotension, tachycardia, and DIC. Can be fatal after as little as 10-15 mL of incompatible blood. Priority: STOP the transfusion immediately, maintain IV with NS using new tubing, and send the blood bag to the blood bank.\n\nFEBRILE NON-HEMOLYTIC REACTION: The most common transfusion reaction (1-3% of RBC transfusions). Caused by recipient antibodies against donor WBC antigens (HLA antibodies) or cytokines accumulated during blood storage. Presents as temperature rise of 1 degree Celsius or more above baseline, occurring 30-60 minutes after transfusion start. Key differentiator from hemolytic reactions: no hemoglobinuria, no flank pain, stable hemodynamics. Treatment: stop transfusion, administer acetaminophen, rule out hemolytic reaction. Prevention: leukoreduction of blood products.\n\nMILD ALLERGIC REACTION: Caused by recipient IgE antibodies reacting to donor plasma proteins. Presents as localized urticaria (hives) and pruritus (itching) without systemic involvement. Vitals remain stable, no airway compromise. Treatment: stop or pause transfusion, administer diphenhydramine. May resume transfusion after symptoms resolve if provider approves. Important: monitor closely for progression to anaphylaxis.\n\nANAPHYLACTIC REACTION: Life-threatening type I hypersensitivity response occurring within seconds to minutes. Most commonly associated with IgA-deficient patients who have developed anti-IgA antibodies. Massive mast cell degranulation releases histamine, leukotrienes, and prostaglandins causing bronchospasm, laryngeal edema, vasodilation, and cardiovascular collapse. Key differentiator from mild allergic: airway involvement (wheezing, stridor) and/or hemodynamic instability (hypotension). Treatment: STOP transfusion immediately, administer epinephrine IM 0.3-0.5 mg in the anterolateral thigh, support airway, call rapid response. Antihistamines alone are INSUFFICIENT. Future transfusions require washed RBCs or products from IgA-deficient donors.\n\nTACO (Transfusion-Associated Circulatory Overload): Volume overload from rapid or excessive transfusion. The heart cannot handle the increased preload, leading to pulmonary edema. Risk factors: elderly, CHF, renal disease, small body habitus. Presents with dyspnea, orthopnea, bilateral crackles, JVD, peripheral edema, and HYPERTENSION. BNP is elevated. Treatment: stop or slow transfusion, position upright, administer furosemide, apply oxygen. Key TACO identifier: elevated BP + JVD + fluid overload signs.\n\nTRALI (Transfusion-Related Acute Lung Injury): Non-cardiogenic pulmonary edema caused by donor antibodies activating recipient neutrophils in the pulmonary vasculature, leading to capillary leak. Occurs within 6 hours of transfusion. Presents with acute respiratory distress, hypoxemia unresponsive to O2, bilateral pulmonary infiltrates on CXR, but NO JVD, NO peripheral edema, and normal or LOW blood pressure. BNP is normal. Treatment: aggressive respiratory support (high-flow O2, possible intubation). Diuretics are NOT helpful because TRALI is a permeability problem, not a volume problem.\n\nCRITICAL EXAM DIFFERENTIATION - TACO vs TRALI: Both cause acute respiratory distress during or after transfusion. TACO = hypertension + JVD + elevated BNP + responds to diuretics. TRALI = normotension/hypotension + no JVD + normal BNP + diuretics contraindicated. This is one of the most commonly tested differentials on nursing certification exams.\n\nFor ALL suspected transfusion reactions, the universal first actions are: (1) STOP the transfusion immediately, (2) maintain IV patency with normal saline using new tubing, (3) obtain vital signs and compare to baseline, (4) notify the provider and blood bank, (5) save the blood bag and tubing for investigation. The specific subsequent interventions depend on the reaction type identified."
    },
    riskFactors: [
      "History of previous transfusion reactions (strongest predictor)",
      "Multiple prior transfusions (alloimmunization and sensitization)",
      "IgA deficiency (risk of anaphylactic reaction to IgA-containing products)",
      "Multiparous women (exposure to fetal HLA antigens increases febrile reaction risk)",
      "Heart failure or renal disease (TACO risk with volume overload)",
      "Elderly patients (reduced cardiac reserve, higher TACO risk)",
      "Immunocompromised state (altered immune response patterns)",
      "Emergency transfusion without full crossmatch (ABO mismatch risk)",
      "Small body habitus (lower volume tolerance)",
      "Chronic anemia requiring repeated transfusions (cumulative alloimmunization)"
    ],
    diagnostics: [
      "Obtain baseline vital signs within 30 minutes before starting any transfusion",
      "Monitor vital signs at 15 minutes, 30 minutes, 1 hour, and upon completion",
      "Observe urine color and output continuously (hemoglobinuria = dark/cola-colored urine indicates hemolysis)",
      "Monitor respiratory status (RR, SpO2, breath sounds) for TACO and TRALI",
      "Observe for skin changes (urticaria, flushing, angioedema) indicating allergic response",
      "Report any new back pain, flank pain, chest tightness, or sense of impending doom",
      "Expect direct Coombs test, repeat crossmatch, and urine hemoglobin if hemolytic reaction suspected",
      "Expect BNP level to differentiate TACO (elevated) from TRALI (normal)",
      "Expect chest X-ray for bilateral infiltrates if TRALI suspected",
      "Observe for bleeding from IV sites or gums (early DIC in acute hemolytic reaction)"
    ],
    management: [
      "STOP the transfusion IMMEDIATELY for ANY suspected reaction - this is the universal first action",
      "Maintain IV access with normal saline using NEW tubing (disconnect blood product tubing completely)",
      "Notify the provider and blood bank immediately for all reaction types",
      "Save the blood bag, tubing, and all attached labels - never discard until investigation complete",
      "For acute hemolytic: aggressive IV fluid resuscitation with NS to protect kidneys from hemoglobin damage",
      "For febrile non-hemolytic: administer acetaminophen, rule out hemolytic reaction before considering resumption",
      "For mild allergic: administer diphenhydramine, may resume if symptoms resolve and provider approves",
      "For anaphylactic: administer epinephrine IM immediately, support airway, call rapid response team",
      "For TACO: position patient upright, administer IV furosemide, apply supplemental oxygen",
      "For TRALI: provide aggressive respiratory support (high-flow O2, prepare for possible intubation), do NOT give diuretics"
    ],
    nursingActions: [
      "Verify blood product with two nurses at bedside using two patient identifiers before starting",
      "Remain at the bedside for the first 15 minutes of every transfusion (most fatal reactions occur here)",
      "Obtain and document baseline vital signs before transfusion initiation",
      "Use only 0.9% normal saline with blood products - never LR (calcium causes clotting) or D5W (causes hemolysis)",
      "Complete PRBC transfusion within 4 hours of removal from blood bank (bacterial contamination risk)",
      "At first sign of ANY reaction: stop transfusion, disconnect blood tubing, connect new NS tubing",
      "Obtain vital signs immediately during a reaction and compare to baseline values",
      "Send post-reaction blood and urine samples to the blood bank as ordered",
      "Document the reaction including time of onset, presenting signs, all interventions, and patient response",
      "For future transfusions: request leukoreduced products for febrile reaction history, washed RBCs for IgA deficiency"
    ],
    signs: {
      left: [
        "Acute Hemolytic: Fever/rigors + flank pain + hemoglobinuria + hypotension (within minutes)",
        "Febrile Non-Hemolytic: Fever >1C above baseline + chills + headache, NO hemoglobinuria (30-60 min)",
        "Mild Allergic: Localized urticaria + pruritus, stable vitals, NO airway symptoms",
        "Anaphylactic: Wheezing + stridor + angioedema + severe hypotension (seconds to minutes)"
      ],
      right: [
        "TACO: Dyspnea + orthopnea + crackles + JVD + HYPERTENSION + elevated BNP",
        "TRALI: Acute respiratory distress + bilateral infiltrates + normal/low BP + normal BNP",
        "DIC Signs (hemolytic): Oozing from IV sites, petechiae, prolonged bleeding",
        "Universal Red Flags: Any new symptom during transfusion = stop and assess"
      ]
    },
    medications: [
      { name: "Normal Saline (0.9% NaCl)", type: "Isotonic Crystalloid", action: "Only compatible IV solution for blood administration; maintains line patency and renal perfusion during hemolytic reactions", sideEffects: "Fluid overload if excessive volume", contra: "Decompensated HF (use cautiously)", pearl: "NEVER use LR (calcium causes clotting in tubing) or D5W (causes osmotic hemolysis of RBCs). This is one of the most commonly tested transfusion facts." },
      { name: "Diphenhydramine (Benadryl)", type: "H1 Antihistamine", action: "Blocks histamine H1 receptors to reduce urticaria, pruritus, and flushing in allergic reactions", sideEffects: "Drowsiness, dry mouth, urinary retention", contra: "Acute asthma, neonates", pearl: "Appropriate for MILD allergic reactions only. Do NOT rely on antihistamines for anaphylaxis - epinephrine is required. May be given as premedication for patients with history of mild allergic reactions." },
      { name: "Acetaminophen (Tylenol)", type: "Antipyretic/Analgesic", action: "Acts on hypothalamic heat-regulating center to reduce fever in febrile non-hemolytic reactions", sideEffects: "Hepatotoxicity in overdose", contra: "Severe hepatic impairment", pearl: "Standard treatment for febrile non-hemolytic reactions. May be given prophylactically before transfusion for patients with prior febrile reactions. Does NOT treat the underlying cause of hemolytic reactions." },
      { name: "Epinephrine (Adrenaline)", type: "Sympathomimetic", action: "Alpha-1: vasoconstriction (raises BP). Beta-1: increases HR and contractility. Beta-2: bronchodilation and reduces mast cell degranulation", sideEffects: "Tachycardia, palpitations, hypertension, anxiety, tremor", contra: "No absolute contraindication in anaphylaxis - always give when indicated", pearl: "FIRST-LINE and ONLY life-saving drug for anaphylaxis. Give 0.3-0.5 mg IM in the anterolateral thigh. May repeat every 5-15 minutes. DELAY = DEATH. Antihistamines and steroids are adjuncts only." },
      { name: "Furosemide (Lasix)", type: "Loop Diuretic", action: "Inhibits Na/K/2Cl cotransporter in loop of Henle, promoting rapid diuresis to reduce intravascular volume in TACO", sideEffects: "Hypokalemia, hypotension, dehydration, ototoxicity", contra: "Anuria, severe hypovolemia", pearl: "TACO is the ONLY transfusion reaction where diuretics are clearly indicated. NEVER give furosemide for TRALI - it is a permeability problem, not a volume problem. Diuretics in TRALI worsen hypotension." },
      { name: "Methylprednisolone (Solu-Medrol)", type: "Corticosteroid", action: "Reduces late-phase inflammatory response and helps prevent biphasic anaphylaxis recurrence", sideEffects: "Hyperglycemia, immunosuppression, fluid retention", contra: "Active untreated infection (relative)", pearl: "Takes 4-6 hours to work, so does NOT treat acute anaphylaxis symptoms. Given to prevent biphasic reaction that can occur 4-12 hours after initial episode. Always given AFTER epinephrine, never instead of it." }
    ],
    pearls: [
      "STOP the transfusion is the FIRST action for ANY suspected reaction - this applies to all 6 types universally",
      "The most common cause of fatal acute hemolytic reactions is clerical error (wrong patient, mislabeled specimen) - not laboratory error. Two-person bedside verification prevents this",
      "TACO vs TRALI: TACO = hypertension + JVD + elevated BNP + responds to diuretics. TRALI = normal/low BP + no JVD + normal BNP + diuretics contraindicated. This is one of the highest-yield exam differentials",
      "Mild allergic (urticaria only) vs anaphylaxis (airway + hemodynamic compromise): the presence of bronchospasm, stridor, or hypotension changes the management from antihistamine to EPINEPHRINE",
      "Febrile non-hemolytic is the MOST COMMON transfusion reaction. Key differentiator from hemolytic: no hemoglobinuria, no flank pain, stable blood pressure",
      "O- is the universal RBC donor (no A, B, or Rh antigens). AB+ is the universal recipient (no ABO antibodies, Rh-positive). These are the two most tested blood types on exams",
      "Never use Lactated Ringers (calcium chelates citrate anticoagulant, causing clotting) or D5W (osmotic lysis of RBCs) with blood products - only 0.9% NS",
      "First 15 minutes = highest risk period. Stay at the bedside. Acute hemolytic and anaphylactic reactions can kill within minutes",
      "An acute hemolytic reaction can be fatal after only 10-15 mL of incompatible blood - this is why early detection and immediate cessation are critical",
      "Rh-negative patients must NEVER receive Rh-positive blood - anti-D antibody production causes hemolysis on future exposures and hemolytic disease of the newborn in pregnancy"
    ],
    quiz: [
      {
        question: "During a blood transfusion, the patient develops fever, severe chills, flank pain, and dark red-brown urine within 5 minutes. What is the priority nursing action?",
        options: [
          "Slow the infusion rate and administer acetaminophen",
          "Stop the transfusion immediately and maintain IV with normal saline using new tubing",
          "Administer diphenhydramine and continue monitoring",
          "Elevate the head of bed and administer furosemide"
        ],
        correct: 1,
        rationale: "Fever with rigors, flank pain, and hemoglobinuria (dark urine) within minutes of starting a transfusion are hallmark signs of an acute hemolytic transfusion reaction caused by ABO incompatibility. The priority is to STOP the transfusion immediately to prevent further infusion of incompatible blood. The IV must be kept open with normal saline using NEW tubing (to prevent any remaining blood from entering the patient). Slowing the rate does not stop the antigen-antibody reaction. Acetaminophen treats benign febrile reactions, not hemolysis. Diphenhydramine treats allergic reactions, not hemolysis. Furosemide treats TACO, not hemolytic reactions."
      },
      {
        question: "A patient receiving a blood transfusion develops sudden wheezing, facial swelling, and a blood pressure of 68/40 mmHg within 2 minutes of starting. What medication should the nurse anticipate administering FIRST?",
        options: [
          "Diphenhydramine (Benadryl) 50 mg IV",
          "Methylprednisolone (Solu-Medrol) 125 mg IV",
          "Epinephrine 0.3 mg IM",
          "Acetaminophen (Tylenol) 650 mg PO"
        ],
        correct: 2,
        rationale: "Wheezing (bronchospasm), facial swelling (angioedema), and severe hypotension within minutes of transfusion indicate anaphylaxis. Epinephrine is the FIRST-LINE treatment for anaphylaxis - it reverses bronchospasm (beta-2), raises blood pressure via vasoconstriction (alpha-1), and reduces mast cell degranulation. It is given IM in the anterolateral thigh at 0.3-0.5 mg. Diphenhydramine and methylprednisolone are adjuncts given AFTER epinephrine but do not treat the life-threatening cardiovascular collapse and airway obstruction. Acetaminophen is for febrile reactions only. Delay in epinephrine administration is the leading cause of death in anaphylaxis."
      },
      {
        question: "An elderly patient with heart failure is receiving her second unit of PRBCs. She develops dyspnea, bilateral crackles, JVD, and her blood pressure rises to 180/100 mmHg. The nurse suspects TACO. Which intervention is appropriate?",
        options: [
          "Administer epinephrine IM",
          "Position supine with legs elevated",
          "Administer IV furosemide and position upright",
          "Prepare for intubation and give IV fluids"
        ],
        correct: 2,
        rationale: "This presentation is classic TACO (Transfusion-Associated Circulatory Overload): an elderly patient with CHF receiving multiple units develops pulmonary edema signs (dyspnea, crackles) with HYPERTENSION and JVD. The key interventions are: stop/slow the transfusion, position the patient upright (High Fowler's to reduce preload and improve breathing), and administer IV furosemide to promote diuresis and reduce intravascular volume. Epinephrine is for anaphylaxis, not volume overload. Supine positioning would worsen pulmonary congestion. IV fluids would worsen volume overload. TACO is differentiated from TRALI by hypertension (TRALI = hypotension), JVD (TRALI = no JVD), elevated BNP (TRALI = normal BNP), and response to diuretics (TRALI = diuretics contraindicated)."
      },
      {
        question: "A patient develops acute respiratory distress, hypoxemia, and bilateral pulmonary infiltrates 4 hours after transfusion. Blood pressure is 92/58 mmHg with no JVD. BNP is normal. Which condition does the nurse suspect?",
        options: [
          "TACO (Transfusion-Associated Circulatory Overload)",
          "TRALI (Transfusion-Related Acute Lung Injury)",
          "Acute hemolytic transfusion reaction",
          "Febrile non-hemolytic transfusion reaction"
        ],
        correct: 1,
        rationale: "TRALI presents with acute respiratory distress, hypoxemia, and bilateral pulmonary infiltrates within 6 hours of transfusion - similar to ARDS. The key differentiators that point to TRALI over TACO are: (1) normal or LOW blood pressure (TACO = hypertension), (2) no JVD or fluid overload signs (TACO = JVD + edema), and (3) normal BNP (TACO = elevated BNP). TRALI is caused by donor antibodies activating neutrophils in the pulmonary vasculature, causing capillary leak and non-cardiogenic pulmonary edema. Diuretics are NOT effective because this is a permeability problem, not a volume problem. Treatment is aggressive respiratory support."
      },
      {
        question: "Which IV solution is the ONLY one compatible with blood product administration?",
        options: [
          "Lactated Ringers (LR)",
          "5% Dextrose in Water (D5W)",
          "0.9% Normal Saline (NS)",
          "5% Dextrose in 0.45% Normal Saline (D5 1/2NS)"
        ],
        correct: 2,
        rationale: "0.9% Normal Saline is the ONLY IV solution compatible with blood products. Lactated Ringers contains calcium which chelates the citrate anticoagulant in stored blood, causing clot formation in the tubing that can embolize to the patient. Dextrose solutions (D5W, D5 1/2NS) cause osmotic swelling of red blood cells, leading to hemolysis and destruction of the transfused cells. This is one of the most commonly tested facts on nursing certification exams. The nurse must verify that only NS is running before connecting blood products."
      }
    ],
    preTest: [
      {
        question: "What is the FIRST action for ANY suspected transfusion reaction?",
        options: [
          "Administer diphenhydramine",
          "Obtain a urine sample",
          "Stop the transfusion immediately",
          "Call the provider"
        ],
        correct: 2,
        rationale: "Stopping the transfusion immediately is the universal first action for ALL suspected transfusion reactions - whether hemolytic, allergic, febrile, anaphylactic, TACO, or TRALI. This prevents further exposure to the offending agent. While notifying the provider and obtaining samples are important, they come AFTER stopping the transfusion. Diphenhydramine is only appropriate for allergic reactions and is never the first action."
      },
      {
        question: "Which blood type is considered the universal RBC donor?",
        options: ["AB+", "A-", "O-", "B+"],
        correct: 2,
        rationale: "O-negative is the universal RBC donor because O- red blood cells lack A antigens, B antigens, and the Rh (D) antigen. This means no recipient will have antibodies against O- RBCs, making them safe for any patient. AB+ is the universal RECIPIENT (can receive any RBC type). In emergency situations when there is no time for crossmatch, O- PRBCs are given."
      }
    ],
    postTest: [
      {
        question: "A nurse is caring for a patient who developed hives and itching during a transfusion but has stable vitals and no respiratory symptoms. After stopping the transfusion and administering diphenhydramine, the symptoms resolve. What is the MOST appropriate next step?",
        options: [
          "Resume the transfusion at a slower rate as ordered by the provider",
          "Discard the blood product and order a new unit",
          "Administer epinephrine for delayed anaphylaxis prevention",
          "Send the patient for an immediate chest X-ray"
        ],
        correct: 0,
        rationale: "Mild allergic reactions (urticaria and pruritus without systemic involvement) are the ONLY type of transfusion reaction where the transfusion may potentially be resumed after symptoms resolve, if the provider orders it. The key criteria are: stable vital signs, no respiratory compromise, no angioedema, and complete resolution of symptoms after antihistamine. The nurse should monitor closely for any recurrence or progression to systemic symptoms. Epinephrine is not indicated for mild allergic reactions. A chest X-ray is not needed for localized urticaria."
      },
      {
        question: "The nurse is differentiating between TACO and TRALI. Which combination of findings indicates TRALI rather than TACO?",
        options: [
          "Hypertension, JVD, elevated BNP, responds to diuretics",
          "Hypotension, no JVD, normal BNP, diuretics NOT helpful",
          "Hypertension, bilateral crackles, peripheral edema, orthopnea",
          "Tachycardia, elevated BNP, pink frothy sputum, JVD"
        ],
        correct: 1,
        rationale: "TRALI is characterized by hypotension or normal BP (not hypertension), absence of JVD and fluid overload signs, normal BNP, and no response to diuretics. This is because TRALI is caused by capillary leak (permeability problem) in the pulmonary vasculature, not volume overload. Options A, C, and D all describe TACO features: hypertension, JVD, elevated BNP, fluid overload signs. The critical teaching point is that diuretics help TACO but are contraindicated in TRALI because removing volume worsens hypotension without addressing the capillary leak."
      }
    ]
  },

  "abo-blood-type-compatibility": {
    title: "ABO & Rh Blood Type Compatibility",
    cellular: {
      title: "ABO and Rh Blood Group Immunology",
      content: "The ABO blood group system is determined by the presence or absence of A and B antigens on the surface of red blood cells, along with naturally occurring antibodies (isohemagglutinins) in the plasma.\n\nType A: Has A antigens on RBCs, produces anti-B antibodies in plasma.\nType B: Has B antigens on RBCs, produces anti-A antibodies in plasma.\nType AB: Has both A and B antigens on RBCs, produces neither anti-A nor anti-B antibodies. AB+ is the universal RBC recipient.\nType O: Has no A or B antigens on RBCs (zero antigens), produces both anti-A and anti-B antibodies. O- is the universal RBC donor.\n\nIf a patient receives blood containing antigens their plasma antibodies recognize as foreign, hemolysis occurs. Recipient antibodies bind to donor RBC antigens, causing agglutination, complement activation, intravascular hemolysis, free hemoglobin release into the bloodstream, and potentially fatal outcomes including acute kidney injury, hypotension, DIC, and shock. ABO incompatibility reactions can be fatal within minutes.\n\nThe Rh system centers on the D antigen. Rh-positive individuals carry the D antigen; Rh-negative individuals do not. An Rh-negative patient who receives Rh-positive blood will develop anti-D antibodies, causing hemolysis on subsequent exposures. This is critical in pregnancy: an Rh-negative mother carrying an Rh-positive fetus can develop anti-D antibodies that cross the placenta and attack fetal RBCs (hemolytic disease of the newborn). Prevention requires Rho(D) immune globulin (RhoGAM).\n\nPlasma compatibility follows the OPPOSITE pattern of RBC compatibility. AB plasma is the universal plasma donor (no antibodies). O plasma can only be given to O recipients (contains both anti-A and anti-B).\n\nBefore any transfusion, verification includes: ABO typing, Rh typing, antibody screen, and crossmatch. Never skip compatibility verification. In emergency trauma when type is unknown, O- blood is the protocol standard."
    },
    riskFactors: [
      "ABO-incompatible transfusion is the most dangerous transfusion error",
      "Most fatal hemolytic reactions result from clerical error (wrong patient identification)",
      "Rh-negative patients must not receive Rh-positive blood (anti-D antibody formation)",
      "Rh incompatibility in pregnancy: Rh-negative mother with Rh-positive fetus requires RhoGAM",
      "Emergency transfusion without full crossmatch increases mismatch risk",
      "Massive transfusion protocols require switching from O- to type-specific blood ASAP",
      "Previously transfused patients may have developed alloantibodies not detectable by ABO/Rh typing alone",
      "Multiparous women at higher risk of alloimmunization from fetal blood exposure"
    ],
    diagnostics: [
      "ABO typing: identifies A, B, AB, or O blood group",
      "Rh typing: determines presence (+) or absence (-) of D antigen",
      "Antibody screen: detects unexpected antibodies beyond ABO system",
      "Crossmatch: tests donor blood against recipient plasma for compatibility",
      "Direct Coombs test: detects antibodies attached to patient's RBCs (used post-reaction)",
      "Indirect Coombs test: detects antibodies in patient's plasma (used pre-transfusion)",
      "Type and screen must be completed before any non-emergency transfusion",
      "Emergency: O- PRBCs can be released before crossmatch completion"
    ],
    management: [
      "Verify patient identity with two identifiers at bedside before every transfusion",
      "Two nurses must independently verify blood product label against patient ID band",
      "Use only 0.9% normal saline with blood products (never LR or dextrose solutions)",
      "Transfuse PRBCs within 4 hours of removal from blood bank",
      "Monitor vital signs at baseline, 15 min, 30 min, 1 hour, and completion",
      "Stay at bedside for first 15 minutes (highest risk period for acute reactions)",
      "Emergency protocol: O- for unknown type, switch to type-specific when available",
      "For Rh-negative women of childbearing age: always use Rh-negative blood when possible"
    ],
    nursingActions: [
      "Perform bedside verification: match blood bag label to patient armband with second nurse",
      "Check blood type, Rh factor, unit number, expiration date, and patient identifiers",
      "Obtain baseline vital signs within 30 minutes before starting transfusion",
      "Remain with patient for first 15 minutes and take vitals at 15 minutes",
      "Infuse each unit within 4 hours (bacterial contamination risk increases after 4 hours)",
      "Use only NS (0.9% NaCl) as compatible IV solution",
      "If reaction suspected: STOP transfusion, maintain IV with NS on new tubing, notify provider and blood bank",
      "Document: blood product type, unit number, start/stop times, vital signs, any reactions"
    ],
    signs: {
      left: [
        "RBC Compatibility: O- donates to ALL, AB+ receives from ALL",
        "O = 'Zero antigens' on RBCs = Universal donor",
        "AB = 'All antigens accepted' = Universal recipient",
        "Rh-negative must NOT receive Rh-positive blood"
      ],
      right: [
        "Plasma Compatibility: OPPOSITE of RBC rules",
        "AB plasma = Universal plasma donor (no antibodies)",
        "O plasma = can only give to O recipients",
        "Plasma contains antibodies, not antigens"
      ]
    },
    medications: [
      { name: "Rho(D) Immune Globulin (RhoGAM)", type: "Immune Globulin", action: "Prevents Rh-negative mother from forming anti-D antibodies after exposure to Rh-positive fetal blood", sideEffects: "Injection site pain, mild fever, headache", contra: "Rh-positive patients, patients with existing anti-D antibodies", pearl: "Given at 28 weeks gestation and within 72 hours of delivery if infant is Rh-positive. Also given after miscarriage, amniocentesis, or any event that may cause fetal-maternal blood mixing." }
    ],
    pearls: [
      "O- = Universal RBC donor (zero antigens, no Rh). O = 'Oh, zero antigens!'",
      "AB+ = Universal RBC recipient (has all antigens, no ABO antibodies, Rh-positive)",
      "Plasma compatibility is the OPPOSITE of RBC compatibility: AB is the universal plasma donor",
      "Most fatal transfusion reactions are caused by clerical error, not laboratory error",
      "Rh-negative patients CAN receive Rh-positive in true life-threatening emergencies, but anti-D antibodies will form",
      "The first 15 minutes are the highest-risk period for acute hemolytic reactions",
      "Never use Lactated Ringers with blood (calcium causes clotting) or D5W (causes hemolysis)",
      "RBC Donation Chart: O- donates to all, O+ to all positives, A- to A and AB, B- to B and AB",
      "RBC Receiving Chart: AB+ receives from all, AB- from all negatives, O- receives only O-"
    ],
    quiz: [
      { question: "A Type B+ patient can safely receive RBCs from which donor types?", options: ["B+ and AB+ only", "O-, O+, B-, B+", "B+ only", "All blood types"], correct: 1, rationale: "Type B+ can receive from: O- (universal donor), O+ (no A/B antigens, Rh compatible), B- (same ABO, Rh-negative is safe for Rh+), and B+ (exact match). B+ cannot receive A or AB blood because anti-A antibodies in B plasma would attack A antigens on donor RBCs." },
      { question: "Which blood type is the universal plasma donor?", options: ["O-", "O+", "AB", "A-"], correct: 2, rationale: "AB plasma is the universal plasma donor because it contains NO anti-A and NO anti-B antibodies, so it will not attack any recipient's RBCs. This is the OPPOSITE of RBC compatibility where O- is the universal donor. Plasma compatibility reverses the rules because plasma contains antibodies, not antigens." },
      { question: "An Rh-negative woman at 28 weeks gestation should receive:", options: ["Rh-positive blood transfusion", "Rho(D) immune globulin (RhoGAM)", "Anti-D antibody infusion", "Type O+ PRBCs"], correct: 1, rationale: "RhoGAM is given at 28 weeks to prevent the Rh-negative mother from forming anti-D antibodies if she has been exposed to Rh-positive fetal blood. It is also given within 72 hours postpartum if the baby is Rh-positive. This prevents hemolytic disease of the newborn in future pregnancies." },
      { question: "In an emergency trauma situation with unknown blood type, the nurse should expect to administer:", options: ["AB+ PRBCs", "Type-specific blood", "O- PRBCs", "AB plasma only"], correct: 2, rationale: "O- PRBCs are used in emergency situations when the patient's blood type is unknown because O- has no A, B, or Rh antigens, making it safe for any recipient. Once the patient's blood type is determined, the protocol switches to type-specific blood to conserve the O- supply." },
      { question: "Why is Lactated Ringers contraindicated with blood product administration?", options: ["It causes hemolysis of RBCs", "The calcium in LR chelates citrate anticoagulant, causing clot formation", "It dilutes the blood product", "It causes an allergic reaction"], correct: 1, rationale: "Lactated Ringers contains calcium which chelates (binds to) the citrate anticoagulant used to preserve stored blood. This removes the anticoagulant effect, allowing clots to form in the IV tubing that can embolize to the patient. Only 0.9% normal saline is compatible with blood products." }
    ]
  }
};
