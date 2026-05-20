import type { LessonContent } from "./types";

export const bloodTransfusionReactionTypeLessons: Record<string, LessonContent> = {
  "ahtr-acute-hemolytic-transfusion-reaction": {
    title: "Acute Hemolytic Transfusion Reaction (AHTR)",
    cellular: {
      title: "Acute Hemolytic Transfusion Reactions",
      content: "An acute hemolytic transfusion reaction (AHTR) is the most dangerous and potentially fatal transfusion complication, occurring when ABO-incompatible blood is transfused. The recipient's preformed naturally occurring antibodies (isohemagglutinins) immediately recognize foreign antigens on donor red blood cells and initiate a catastrophic immune response.\n\nWhen incompatible donor RBCs enter the recipient's circulation, recipient anti-A or anti-B IgM antibodies bind to the corresponding antigens on donor erythrocytes. This antigen-antibody complex activates the classical complement pathway, triggering a cascade from C1 through C9 that culminates in formation of the membrane attack complex (MAC). The MAC creates transmembrane pores in donor RBC membranes, causing intravascular hemolysis with massive release of free hemoglobin into the plasma.\n\nFree hemoglobin saturates haptoglobin binding capacity and spills into the renal tubules, where it precipitates and causes acute tubular necrosis. The characteristic cola-colored or dark red-brown urine (hemoglobinuria) results from hemoglobin filtration through the glomeruli. Simultaneously, hemolysis releases thromboplastin and other procoagulant substances that activate the coagulation cascade, leading to disseminated intravascular coagulation (DIC). DIC consumes platelets and clotting factors, paradoxically causing both widespread microvascular thrombosis and hemorrhagic bleeding.\n\nThe inflammatory mediators released during complement activation (C3a, C5a anaphylatoxins) cause systemic vasodilation, capillary leak, and hypotension. Cytokines including IL-1, IL-6, and TNF-alpha produce fever, rigors, and the sensation of impending doom that patients characteristically report. The reaction can progress to cardiovascular collapse, acute kidney injury, and death within minutes of transfusing as little as 10-15 mL of incompatible blood.\n\nThe most common cause of AHTR is clerical error: mislabeled specimens, failure of bedside verification, or wrong-patient identification. Laboratory crossmatch errors are far less common. This is why the two-nurse bedside verification protocol exists and why it is the single most important safety measure in transfusion medicine."
    },
    riskFactors: [
      "ABO-incompatible transfusion (the direct cause in virtually all cases)",
      "Clerical error: mislabeled blood specimen, wrong patient identification, or failure to verify",
      "Skipping two-nurse bedside verification protocol",
      "Emergency transfusion without completed crossmatch",
      "Multiple patients receiving transfusions simultaneously (increased mix-up risk)",
      "Communication failures during patient transfers or handoffs",
      "History of multiple prior transfusions (risk of alloantibodies beyond ABO system)",
      "Previous pregnancies causing alloimmunization to minor blood group antigens"
    ],
    diagnostics: [
      "Immediate vital signs: expect fever, tachycardia, hypotension within minutes of starting transfusion",
      "Direct Coombs test (DAT): detects antibodies coating patient's RBCs - positive confirms immune hemolysis",
      "Repeat ABO/Rh typing and crossmatch on both patient blood AND the blood bag",
      "Serum free hemoglobin: elevated confirms intravascular hemolysis",
      "Urine hemoglobin: positive hemoglobinuria (cola-colored urine)",
      "Serum haptoglobin: decreased or absent (consumed by binding free hemoglobin)",
      "LDH: markedly elevated from RBC destruction",
      "Indirect bilirubin: elevated from hemoglobin metabolism",
      "Coagulation panel: PT/INR, aPTT, fibrinogen, D-dimer to assess for DIC",
      "CBC with peripheral smear: look for schistocytes (fragmented RBCs indicating DIC)",
      "BUN/Creatinine: monitor for acute kidney injury from hemoglobin nephrotoxicity"
    ],
    management: [
      "STOP the transfusion IMMEDIATELY - this is the absolute first action, no exceptions",
      "Disconnect blood product tubing completely and connect NEW tubing with 0.9% NS to maintain IV access",
      "Aggressive IV normal saline resuscitation to maintain renal perfusion and flush hemoglobin from kidneys",
      "Notify provider AND blood bank simultaneously - this is a medical emergency",
      "Maintain urine output >100 mL/hr with IV fluids and diuretics if needed to protect kidneys",
      "Save the blood bag, ALL attached tubing, and labels - send to blood bank for investigation",
      "Send post-reaction blood samples: repeat type and crossmatch, DAT, free hemoglobin, haptoglobin",
      "Send urine specimen for hemoglobin",
      "Monitor for and treat DIC: may require fresh frozen plasma, cryoprecipitate, or platelet transfusion",
      "Vasopressor support if hypotension persists despite fluid resuscitation",
      "Prepare for possible dialysis if acute kidney injury develops"
    ],
    nursingActions: [
      "Verify blood product with TWO nurses at bedside using TWO patient identifiers BEFORE starting any transfusion",
      "Remain at bedside for the first 15 minutes of every transfusion - most fatal reactions occur here",
      "Obtain baseline vital signs within 30 minutes before starting the transfusion",
      "At first sign of reaction: STOP transfusion, clamp tubing, disconnect blood tubing, start NS on new line",
      "Obtain vital signs immediately and compare to baseline",
      "Assess urine color and output - dark/cola-colored urine = hemoglobinuria = hemolysis",
      "Insert Foley catheter if not present to accurately monitor urine output",
      "Document everything: exact time of reaction onset, volume transfused, all signs and symptoms, interventions",
      "Complete transfusion reaction report per facility protocol",
      "Never resume a transfusion suspected of causing a hemolytic reaction"
    ],
    signs: {
      left: [
        "Fever and severe rigors/chills (often the first sign)",
        "Flank pain and low back pain (renal capsule distension from hemoglobin deposition)",
        "Hemoglobinuria: dark red-brown or cola-colored urine",
        "Sense of impending doom or severe anxiety",
        "Chest tightness and dyspnea"
      ],
      right: [
        "Hypotension progressing to cardiovascular collapse",
        "Tachycardia (compensatory response to hypovolemia)",
        "Bleeding from IV sites, gums, or wounds (DIC sign)",
        "Oliguria or anuria (acute kidney injury)",
        "Jaundice (from bilirubin elevation, may appear hours later)"
      ]
    },
    medications: [
      { name: "Normal Saline (0.9% NaCl)", type: "Isotonic Crystalloid", action: "Expands intravascular volume, maintains renal perfusion, and flushes free hemoglobin through renal tubules to prevent acute tubular necrosis", sideEffects: "Fluid overload if excessive, hyperchloremic metabolic acidosis with large volumes", contra: "Decompensated heart failure (use cautiously, balance renal protection vs volume overload)", pearl: "Goal is urine output >100 mL/hr. Aggressive hydration is the cornerstone of renal protection in hemolytic reactions. This is the ONLY IV solution compatible with blood products." },
      { name: "Furosemide (Lasix)", type: "Loop Diuretic", action: "Promotes diuresis to maintain urine flow and flush hemoglobin from renal tubules when IV fluids alone are insufficient", sideEffects: "Hypokalemia, hypotension, dehydration, ototoxicity", contra: "Anuria, severe hypovolemia (ensure adequate volume resuscitation first)", pearl: "Used as adjunct to IV fluids if urine output remains low despite aggressive hydration. Monitor potassium closely. Do NOT use as a substitute for volume resuscitation." },
      { name: "Norepinephrine (Levophed)", type: "Vasopressor", action: "Alpha-1 agonist causing vasoconstriction to support blood pressure in refractory hypotension from anaphylatoxin-mediated vasodilation", sideEffects: "Tissue necrosis with extravasation, tachyarrhythmias, peripheral ischemia", contra: "Hypovolemia (must volume resuscitate first)", pearl: "Required when hypotension persists despite aggressive IV fluid resuscitation. Central line administration preferred. This indicates a severe, life-threatening reaction requiring ICU-level care." },
      { name: "Mannitol", type: "Osmotic Diuretic", action: "Promotes osmotic diuresis to maintain renal tubular flow and prevent hemoglobin cast formation in the kidneys", sideEffects: "Fluid overload initially, electrolyte imbalances, headache", contra: "Anuria, severe dehydration, active intracranial bleeding", pearl: "Sometimes used as an alternative or adjunct to furosemide for renal protection. Works by maintaining urine flow through osmotic mechanism rather than blocking sodium reabsorption." }
    ],
    pearls: [
      "AHTR can be FATAL after only 10-15 mL of incompatible blood - early detection and immediate cessation are critical",
      "The #1 cause of fatal hemolytic reactions is CLERICAL ERROR (wrong patient, mislabeled specimen), NOT laboratory error",
      "Two-nurse bedside verification is the single most important safety intervention in transfusion medicine",
      "The triad of AHTR: fever + flank pain + hemoglobinuria within minutes of starting transfusion",
      "DIC is a common and deadly complication: watch for oozing from IV sites, petechiae, and prolonged bleeding",
      "Acute kidney injury results from free hemoglobin precipitating in renal tubules - aggressive IV fluids are the treatment",
      "Never confuse AHTR with FNHTR: AHTR has hemoglobinuria and hypotension; FNHTR does NOT",
      "If a patient says 'I feel like something terrible is happening' during a transfusion - STOP immediately and assess",
      "The reaction onset is typically within the first 15 minutes, which is why bedside monitoring during this period is mandatory",
      "Always send the blood bag and tubing to the blood bank - they are essential for investigating the cause"
    ],
    quiz: [
      { question: "A patient develops fever, rigors, flank pain, and dark brown urine 5 minutes after starting a blood transfusion. What is the PRIORITY nursing action?", options: ["Slow the infusion rate and administer acetaminophen", "Stop the transfusion immediately and maintain IV with NS using new tubing", "Administer diphenhydramine and continue monitoring", "Obtain a urine specimen and notify the lab"], correct: 1, rationale: "This presentation (fever, rigors, flank pain, hemoglobinuria within minutes) is classic for acute hemolytic transfusion reaction. The absolute FIRST action is to STOP the transfusion immediately to prevent further infusion of incompatible blood. The IV must be maintained with NS using NEW tubing to prevent any residual blood from entering the patient. Slowing the rate still allows incompatible blood to enter. Acetaminophen treats febrile reactions, not hemolysis. Diphenhydramine treats allergic reactions. While urine specimens will be needed, stopping the transfusion takes priority over all other actions." },
      { question: "Which laboratory finding is MOST specific for confirming an acute hemolytic transfusion reaction?", options: ["Elevated WBC count", "Positive direct Coombs test (DAT)", "Elevated BNP level", "Prolonged aPTT"], correct: 1, rationale: "The direct Coombs test (direct antiglobulin test/DAT) is the most specific test for confirming immune-mediated hemolysis. It detects antibodies that are bound to the surface of the patient's red blood cells, proving that an antigen-antibody reaction has occurred. An elevated WBC is nonspecific. Elevated BNP suggests TACO, not hemolysis. Prolonged aPTT may indicate DIC as a complication but does not specifically confirm hemolysis." },
      { question: "The most common cause of fatal acute hemolytic transfusion reactions is:", options: ["Laboratory crossmatch error", "Clerical error and patient misidentification", "Donor blood contamination", "Rh incompatibility"], correct: 1, rationale: "The most common cause of fatal AHTR is clerical error - mislabeled blood specimens, wrong patient identification, or failure to perform bedside verification. This is NOT a laboratory problem. The two-nurse bedside verification protocol (checking patient armband against blood bag label with two identifiers) exists specifically to prevent this. Donor contamination causes septic reactions, not hemolytic. Rh incompatibility typically causes delayed reactions, not acute fatal ones." },
      { question: "During an acute hemolytic reaction, the nurse notes oozing from IV sites and petechiae. This finding suggests:", options: ["Allergic reaction progression", "Disseminated intravascular coagulation (DIC)", "Febrile non-hemolytic reaction", "Transfusion-related acute lung injury"], correct: 1, rationale: "Oozing from IV sites and petechiae during a hemolytic reaction indicate DIC (disseminated intravascular coagulation). Hemolysis releases thromboplastin and other procoagulant substances that activate the coagulation cascade, consuming platelets and clotting factors. This creates a paradox of simultaneous thrombosis (organ damage) and hemorrhage (bleeding from sites). DIC is confirmed by elevated D-dimer, decreased fibrinogen, prolonged PT/aPTT, and thrombocytopenia." },
      { question: "What is the primary goal of aggressive IV normal saline administration during an acute hemolytic reaction?", options: ["To dilute the incompatible blood", "To maintain renal perfusion and flush hemoglobin from the kidneys", "To replace blood volume lost from hemolysis", "To prevent allergic reaction progression"], correct: 1, rationale: "The primary goal of aggressive IV NS is to maintain renal perfusion and flush free hemoglobin through the renal tubules to prevent acute tubular necrosis (ATN). When RBCs are destroyed, free hemoglobin is released into the bloodstream, filtered by the kidneys, and can precipitate in renal tubules causing obstruction and kidney damage. The target is urine output >100 mL/hr. While volume expansion does help with hemodynamics, the primary indication is renal protection." }
    ],
    preTest: [
      { question: "What type of antibodies cause acute hemolytic transfusion reactions?", options: ["IgE antibodies against plasma proteins", "IgG antibodies against Rh antigens", "IgM isohemagglutinins against ABO antigens", "IgA antibodies against donor leukocytes"], correct: 2, rationale: "AHTR is caused by preformed IgM isohemagglutinins (anti-A and anti-B antibodies) that exist naturally in the plasma. These antibodies immediately recognize incompatible ABO antigens on donor RBCs and activate the classical complement pathway, causing intravascular hemolysis. IgE mediates allergic/anaphylactic reactions. IgG against Rh antigens typically causes delayed hemolytic reactions. IgA is involved in anaphylactic reactions in IgA-deficient patients." },
      { question: "An AHTR can become fatal after transfusing as little as:", options: ["100 mL of incompatible blood", "50 mL of incompatible blood", "10-15 mL of incompatible blood", "One full unit (250-300 mL)"], correct: 2, rationale: "An acute hemolytic reaction can become fatal after transfusing as little as 10-15 mL of incompatible blood. This extremely small volume can trigger a massive complement cascade, systemic inflammatory response, DIC, and cardiovascular collapse. This is precisely why the first 15 minutes of every transfusion require bedside monitoring and why STOPPING the transfusion at the first sign of any reaction is critical." }
    ],
    postTest: [
      { question: "A nurse is caring for a patient experiencing an acute hemolytic reaction. Urine output has dropped to 20 mL/hr despite 2 liters of NS. What should the nurse anticipate?", options: ["Discontinuing IV fluids to prevent overload", "Administration of IV furosemide to promote diuresis", "Starting oral fluids instead", "Continuing current rate and reassessing in 4 hours"], correct: 1, rationale: "When urine output remains low despite aggressive IV fluid resuscitation during a hemolytic reaction, IV furosemide (a loop diuretic) is the next intervention to promote diuresis and protect the kidneys. The goal is urine output >100 mL/hr to flush hemoglobin from the renal tubules. Discontinuing fluids would worsen renal injury. Oral fluids are inadequate. Waiting 4 hours risks irreversible kidney damage." },
      { question: "Which intervention is the MOST effective in preventing acute hemolytic transfusion reactions?", options: ["Administering diphenhydramine before all transfusions", "Two-nurse bedside verification with two patient identifiers", "Slowing the initial infusion rate for the first 15 minutes", "Pre-transfusion leukocyte reduction filtering"], correct: 1, rationale: "Two-nurse bedside verification with two patient identifiers is the MOST effective prevention because the leading cause of AHTR is clerical error. Both nurses must independently verify the patient's identity (armband) against the blood product label, checking name, DOB/MRN, blood type, Rh factor, unit number, and expiration date. Premedication with diphenhydramine prevents allergic reactions, not hemolytic. Slowing the rate doesn't prevent the reaction. Leukocyte reduction prevents febrile reactions." }
    ]
  },

  "fnhtr-febrile-nonhemolytic-transfusion-reaction": {
    title: "Febrile Non-Hemolytic Transfusion Reaction",
    cellular: {
      title: "Febrile Non-Hemolytic Reactions",
      content: "Febrile non-hemolytic transfusion reaction (FNHTR) is the MOST COMMON type of transfusion reaction, accounting for approximately 1-3% of all red blood cell transfusions and up to 30% of platelet transfusions. Despite being the most frequent reaction, it is generally benign and self-limiting when properly managed.\n\nFNHTR occurs through two primary mechanisms. The first involves recipient antibodies (usually HLA antibodies or platelet-specific antibodies) that react against donor white blood cell antigens present in the transfused blood product. These antibodies develop from prior transfusions, pregnancies, or organ transplants that exposed the recipient to foreign HLA antigens. The antigen-antibody interaction triggers release of pyrogens that act on the hypothalamic thermoregulatory center.\n\nThe second mechanism involves cytokines that accumulate in stored blood products during storage (the 'storage lesion'). During refrigerated storage, donor leukocytes release pyrogenic cytokines including interleukin-1 (IL-1), interleukin-6 (IL-6), and tumor necrosis factor-alpha (TNF-alpha) into the plasma. These cytokines act directly on the hypothalamic thermoregulatory center when transfused, producing fever. This mechanism is particularly common with platelet transfusions because platelets are stored at room temperature (20-24 degrees C), which promotes greater cytokine accumulation than the 1-6 degrees C storage for RBCs.\n\nThe defining characteristic of FNHTR is a temperature rise of 1 degree C (1.8 degrees F) or more above baseline during or within 4 hours of completing a transfusion, in the ABSENCE of other identifiable causes of fever. Critically, FNHTR does NOT produce hemoglobinuria, flank pain, or hypotension - these findings indicate the far more dangerous acute hemolytic reaction and must be ruled out.\n\nPrevention of recurrent FNHTR involves pre-storage leukoreduction, which filters out >99.9% of donor leukocytes before storage, dramatically reducing both antibody-mediated reactions and cytokine accumulation. Pre-medication with acetaminophen may also be ordered for patients with a history of febrile reactions."
    },
    riskFactors: [
      "History of previous transfusion reactions (strongest predictor for recurrence)",
      "Multiple prior transfusions (increases alloimmunization to HLA antigens)",
      "Multiparous women (exposure to fetal HLA antigens during pregnancies)",
      "Platelet transfusions (higher cytokine accumulation due to room temperature storage)",
      "Older blood products with longer storage duration (greater cytokine buildup)",
      "Non-leukoreduced blood products",
      "Prior organ transplant recipients (pre-sensitized to HLA antigens)",
      "Immunocompromised patients with altered immune regulation"
    ],
    diagnostics: [
      "Temperature monitoring: fever >1 degree C (1.8 degrees F) above baseline is the defining criterion",
      "Compare vital signs to pre-transfusion baseline - expect fever and possibly mild tachycardia",
      "Rule out hemolytic reaction: check for hemoglobinuria (urine should be NORMAL color)",
      "Rule out hemolytic reaction: assess for flank/back pain (should be ABSENT)",
      "Rule out hemolytic reaction: blood pressure should be stable (not hypotensive)",
      "Direct Coombs test may be ordered to definitively exclude hemolysis (should be negative)",
      "Blood cultures from patient AND blood bag to rule out septic transfusion reaction",
      "CBC to check for any unexpected changes",
      "Visual inspection of urine: clear yellow urine supports FNHTR over hemolytic reaction"
    ],
    management: [
      "STOP the transfusion immediately - must rule out hemolytic reaction before considering FNHTR",
      "Maintain IV access with normal saline using new tubing",
      "Notify the provider and blood bank",
      "Administer acetaminophen (Tylenol) as ordered for fever management",
      "Monitor vital signs every 15 minutes until stable",
      "Send blood and urine samples as ordered to rule out hemolysis",
      "If hemolytic reaction is ruled out and symptoms resolve, transfusion MAY be resumed per provider order",
      "Document reaction and report to blood bank for their records",
      "For future transfusions: request leukoreduced products and consider acetaminophen premedication",
      "Avoid aspirin or NSAIDs for antipyresis in patients with thrombocytopenia"
    ],
    nursingActions: [
      "Obtain and document baseline temperature before starting any transfusion",
      "Monitor temperature at 15 minutes, 30 minutes, 1 hour, and upon completion",
      "Stop transfusion at first sign of fever and perform full assessment",
      "Assess for signs that would indicate hemolytic reaction (flank pain, dark urine, hypotension)",
      "Administer prescribed antipyretics and apply cooling measures if fever is high",
      "Provide comfort measures: light blankets for chills, cool cloths for fever",
      "Reassure patient that FNHTR is the most common reaction and is typically benign",
      "Document pre-transfusion temperature, time fever was noted, peak temperature, and response to treatment",
      "Flag patient's chart for pre-medication with future transfusions"
    ],
    signs: {
      left: [
        "Fever: temperature rise >1 degree C above baseline (the hallmark finding)",
        "Chills and rigors (may be severe enough to mimic hemolytic reaction initially)",
        "Headache and general malaise",
        "Mild nausea (less common)"
      ],
      right: [
        "NO hemoglobinuria (normal urine color - key differentiator from AHTR)",
        "NO flank pain or back pain (key differentiator from AHTR)",
        "Stable blood pressure (no hypotension - key differentiator from AHTR)",
        "Symptoms typically resolve within 2-4 hours with antipyretics",
        "Mild tachycardia may be present as a physiologic response to fever"
      ]
    },
    medications: [
      { name: "Acetaminophen (Tylenol)", type: "Antipyretic/Analgesic", action: "Acts on the hypothalamic heat-regulating center to reduce fever by inhibiting prostaglandin synthesis in the CNS", sideEffects: "Hepatotoxicity in overdose (max 4g/day in healthy adults, 2g/day in liver disease)", contra: "Severe hepatic impairment, active liver disease", pearl: "Standard first-line treatment for FNHTR. May be given prophylactically 30 minutes before transfusion for patients with prior febrile reactions. Does NOT mask signs of hemolytic reactions (hemoglobinuria, hypotension) so it is safe to use." },
      { name: "Meperidine (Demerol)", type: "Opioid Analgesic", action: "Used specifically for severe rigors that do not respond to acetaminophen; works by suppressing the shivering center", sideEffects: "Respiratory depression, nausea, dizziness, seizure risk with repeated doses", contra: "MAO inhibitor use, renal impairment (neurotoxic metabolite normeperidine accumulates)", pearl: "Reserved for severe, uncontrollable rigors only. Low-dose IV meperidine (25-50 mg) stops rigors rapidly. NOT a routine treatment - used only when shaking is severe and distressing to the patient." },
      { name: "Leukocyte Reduction Filter", type: "Prevention Device", action: "Pre-storage filtration removes >99.9% of donor WBCs, preventing both antibody-mediated reactions and cytokine accumulation during storage", sideEffects: "Slightly increased cost, minimal blood product loss during filtration", contra: "None (universally beneficial)", pearl: "Pre-storage leukoreduction is the most effective PREVENTION for FNHTR. It removes donor WBCs before they can release cytokines during storage. Many blood banks now perform universal leukoreduction on all products. Request leukoreduced products for any patient with a history of febrile reactions." }
    ],
    pearls: [
      "FNHTR is the MOST COMMON transfusion reaction - know this for exams",
      "The critical differentiator: FNHTR has fever WITHOUT hemoglobinuria, flank pain, or hypotension",
      "Must ALWAYS rule out hemolytic reaction before diagnosing FNHTR - stop the transfusion first",
      "Temperature rise must be >1 degree C above baseline to qualify as FNHTR",
      "Cytokine accumulation during storage is a major mechanism, especially for platelet transfusions",
      "Leukoreduction is the most effective prevention strategy",
      "Acetaminophen premedication may be ordered for patients with recurrent febrile reactions",
      "FNHTR is benign and self-limiting but MUST be differentiated from hemolytic and septic reactions",
      "Multiparous women are at higher risk due to HLA antibody development from fetal antigen exposure",
      "If a patient has had 2+ febrile reactions, all future products should be leukoreduced"
    ],
    quiz: [
      { question: "A patient receiving a blood transfusion develops a temperature of 38.8 degrees C (baseline was 37.2 degrees C) with chills 45 minutes into the transfusion. Urine output is normal and clear yellow. BP is 128/76. The nurse suspects FNHTR. What should the nurse do FIRST?", options: ["Administer acetaminophen and continue the transfusion", "Stop the transfusion and assess for signs of hemolytic reaction", "Apply warming blankets and slow the infusion rate", "Notify the provider that the patient likely has an infection"], correct: 1, rationale: "Even though the clinical picture suggests FNHTR (fever with normal urine and stable BP), the nurse must STOP the transfusion first and perform a complete assessment to rule out hemolytic reaction. You cannot diagnose FNHTR while the transfusion is running. Stop first, assess, send labs, then treat. Never simply administer acetaminophen and continue without stopping to assess." },
      { question: "Which finding BEST differentiates FNHTR from an acute hemolytic transfusion reaction?", options: ["Presence of fever", "Presence of chills and rigors", "Absence of hemoglobinuria and stable blood pressure", "Onset timing within 30-60 minutes"], correct: 2, rationale: "The key differentiator is the ABSENCE of hemoglobinuria (dark urine) and stable blood pressure. Both FNHTR and AHTR cause fever and chills. Both can occur within the first hour. But FNHTR does NOT produce hemoglobinuria, flank pain, or hypotension. If urine is normal color and BP is stable, FNHTR is far more likely than AHTR. However, confirmatory labs (DAT, free hemoglobin) should still be sent." },
      { question: "Which blood product has the HIGHEST incidence of febrile non-hemolytic reactions?", options: ["Fresh frozen plasma", "Cryoprecipitate", "Packed red blood cells", "Platelet concentrates"], correct: 3, rationale: "Platelet concentrates have the highest incidence of FNHTR (up to 30%) because platelets are stored at room temperature (20-24 degrees C). This warmer storage temperature promotes greater leukocyte cytokine release compared to RBCs stored at 1-6 degrees C. The accumulated IL-1, IL-6, and TNF-alpha act on the hypothalamic thermoregulatory center when transfused." },
      { question: "What is the MOST effective strategy to prevent recurrent febrile non-hemolytic transfusion reactions?", options: ["Pre-medication with diphenhydramine", "Slowing the transfusion infusion rate", "Using pre-storage leukoreduced blood products", "Warming blood products before transfusion"], correct: 2, rationale: "Pre-storage leukoreduction (filtering out >99.9% of donor WBCs before storage) is the most effective prevention for FNHTR. It prevents both mechanisms: removes WBCs that recipient antibodies would target, and prevents cytokine accumulation during storage. Diphenhydramine prevents allergic reactions, not febrile. Slowing the rate does not prevent the immunologic reaction. Warming blood does not affect cytokine content." },
      { question: "A patient with a history of two prior febrile transfusion reactions needs another transfusion. The nurse should anticipate which orders?", options: ["Type O-negative blood only", "Irradiated blood products", "Leukoreduced products with acetaminophen premedication", "Washed RBCs with epinephrine at bedside"], correct: 2, rationale: "For patients with recurrent FNHTR, the standard approach is leukoreduced blood products (to remove the WBCs causing the reaction) combined with acetaminophen premedication (to blunt the febrile response). O-negative blood is for emergencies with unknown type. Irradiated blood prevents TA-GVHD in immunocompromised patients. Washed RBCs and epinephrine are for patients with severe allergic/anaphylactic reactions (IgA deficiency)." }
    ],
    preTest: [
      { question: "FNHTR is caused by:", options: ["ABO incompatibility", "Recipient antibodies against donor WBC antigens and cytokines released during storage", "Bacterial contamination of blood products", "Volume overload from rapid transfusion"], correct: 1, rationale: "FNHTR has two mechanisms: (1) recipient HLA antibodies reacting against donor leukocyte antigens, and (2) pyrogenic cytokines (IL-1, IL-6, TNF-alpha) that accumulated in the blood product during storage. ABO incompatibility causes AHTR. Bacterial contamination causes septic reactions. Volume overload causes TACO." },
      { question: "What percentage of transfusions result in a febrile non-hemolytic reaction?", options: ["Less than 0.01%", "Approximately 1-3% for RBCs, up to 30% for platelets", "About 50% of all transfusions", "Only occurs in immunocompromised patients"], correct: 1, rationale: "FNHTR occurs in approximately 1-3% of RBC transfusions and up to 30% of platelet transfusions, making it the most common transfusion reaction overall. The higher rate with platelets is due to room temperature storage promoting greater cytokine accumulation." }
    ],
    postTest: [
      { question: "After a febrile reaction is diagnosed as FNHTR (hemolytic reaction ruled out), can the transfusion be resumed?", options: ["No, the transfusion must never be resumed", "Yes, it may be resumed if symptoms resolve and the provider orders it", "Only if a different unit is used", "Only if epinephrine is administered first"], correct: 1, rationale: "Unlike hemolytic reactions, FNHTR may allow resumption of the transfusion IF hemolytic reaction has been definitively ruled out, symptoms have resolved with treatment, AND the provider specifically orders resumption. This is a clinical judgment call. The nurse should document the decision and continue close monitoring." },
      { question: "A nurse is explaining febrile reactions to a patient who experienced one. Which statement is accurate?", options: ["This reaction damaged your kidneys", "This is the most common type of transfusion reaction and is typically not dangerous", "You can never receive blood products again", "This means you are allergic to blood"], correct: 1, rationale: "FNHTR is the most common transfusion reaction and is generally benign and self-limiting. It does not cause hemolysis, kidney damage, or permanent harm. Patients can receive future transfusions with appropriate precautions (leukoreduced products, premedication). It is not an 'allergy' to blood - it is an immune response to donor white blood cells." }
    ]
  },

  "allergic-transfusion-reaction": {
    title: "Allergic Transfusion Reaction (Mild)",
    cellular: {
      title: "Mild Allergic Transfusion Reactions",
      content: "Mild allergic transfusion reactions are IgE-mediated hypersensitivity responses to soluble proteins present in the donor's plasma. When a sensitized recipient encounters foreign donor plasma proteins, pre-existing IgE antibodies on the surface of mast cells and basophils recognize these proteins as antigens. Cross-linking of IgE receptors triggers mast cell degranulation with release of histamine, leukotrienes, and prostaglandins.\n\nHistamine acts on H1 receptors in the skin to produce the characteristic urticaria (hives) - raised, erythematous, pruritic wheals that may appear anywhere on the body. Histamine also causes local vasodilation and increased capillary permeability, leading to the erythema and edema surrounding each wheal. The reaction is typically localized to the skin and does NOT involve the airway, cardiovascular system, or gastrointestinal tract.\n\nThe critical distinction is between a mild allergic reaction (skin only) and anaphylaxis (systemic involvement). Mild allergic reactions produce urticaria and pruritus with completely stable vital signs, no respiratory compromise, and no angioedema. The presence of ANY airway symptoms (wheezing, stridor, throat tightness), cardiovascular instability (hypotension, tachycardia), or angioedema (lip/tongue/facial swelling) reclassifies the reaction as anaphylaxis, which requires completely different management.\n\nMild allergic reactions are the ONLY type of transfusion reaction where the transfusion may potentially be resumed after treatment, if symptoms completely resolve and the provider approves. This unique characteristic makes it a frequently tested concept. The rationale is that the reaction is localized, self-limiting, and does not pose systemic danger once histamine release is blocked by antihistamines.\n\nRecurrence is common in sensitized individuals. Prevention strategies include premedication with diphenhydramine before future transfusions. For patients with recurrent or severe allergic reactions, washed blood products (plasma proteins removed by saline washing) may be ordered to eliminate the offending plasma proteins entirely."
    },
    riskFactors: [
      "History of previous allergic transfusion reactions (strongest predictor)",
      "History of atopic conditions: asthma, eczema, allergic rhinitis, food allergies",
      "Multiple prior transfusions (increased sensitization to donor proteins)",
      "Recipient sensitivity to specific donor plasma proteins",
      "Seasonal allergy sufferers (heightened IgE-mediated immune response)",
      "Not receiving premedication when indicated",
      "Fresh frozen plasma and platelet transfusions (higher plasma protein content)",
      "History of medication allergies suggesting IgE-mediated hypersensitivity tendency"
    ],
    diagnostics: [
      "Visual inspection of skin: identify urticaria (raised, red, itchy wheals)",
      "Vital signs: blood pressure, heart rate, respiratory rate, SpO2 must ALL be stable",
      "Respiratory assessment: auscultate lungs for wheezing (should be CLEAR in mild reaction)",
      "Airway assessment: check for lip/tongue/throat swelling (should be ABSENT in mild reaction)",
      "Temperature: mild elevation may occur but is not the primary feature",
      "Document extent and distribution of urticaria (localized vs widespread)",
      "Monitor for progression: any respiratory or cardiovascular change upgrades to anaphylaxis",
      "No specific lab tests required for mild allergic reactions unless progression is suspected"
    ],
    management: [
      "STOP the transfusion and assess the patient thoroughly",
      "Administer diphenhydramine (Benadryl) 25-50 mg IV or PO as ordered",
      "Notify the provider of the reaction and current assessment findings",
      "Monitor vital signs every 15 minutes",
      "If symptoms COMPLETELY resolve after antihistamine AND provider approves: transfusion MAY be resumed",
      "If symptoms do NOT resolve, worsen, or any systemic signs develop: DO NOT resume, treat as more severe reaction",
      "Document the reaction: type of symptoms, time of onset, treatment given, response",
      "For future transfusions: order premedication with diphenhydramine 30 minutes prior",
      "If recurrent despite premedication: consider washed blood products"
    ],
    nursingActions: [
      "Assess skin thoroughly for urticaria distribution and severity",
      "Perform complete respiratory assessment: listen to lungs, assess for stridor, check for lip/tongue swelling",
      "Check vital signs and compare to baseline - they MUST be stable for this to remain a 'mild' reaction",
      "Administer prescribed antihistamine",
      "Continue close monitoring for at least 30 minutes after antihistamine administration",
      "Watch for progression: any breathing difficulty, swelling, or hemodynamic change = upgrade to anaphylaxis protocol",
      "If provider orders resumption: restart at a slower rate and remain at bedside for 15 minutes",
      "Educate patient about the reaction and the plan for future transfusions",
      "Document thoroughly including the decision to resume or not resume"
    ],
    signs: {
      left: [
        "Urticaria (hives): raised, erythematous, pruritic wheals on skin",
        "Pruritus (itching) that may be localized or generalized",
        "Flushing of the skin",
        "Localized erythema at or near the IV site"
      ],
      right: [
        "Vital signs STABLE: normal BP, HR, RR, SpO2 (this defines it as 'mild')",
        "NO wheezing, stridor, or respiratory distress",
        "NO angioedema (lip, tongue, or facial swelling)",
        "NO gastrointestinal symptoms (nausea, vomiting, abdominal pain)",
        "Symptoms typically resolve within 30-60 minutes after antihistamine"
      ]
    },
    medications: [
      { name: "Diphenhydramine (Benadryl)", type: "H1 Antihistamine", action: "Competitively blocks H1 histamine receptors, reversing histamine-mediated vasodilation, capillary permeability, and pruritus that cause urticaria", sideEffects: "Drowsiness, dry mouth, urinary retention, blurred vision", contra: "Neonates, acute asthma attack (anticholinergic drying effect)", pearl: "First-line treatment for mild allergic reactions. Can also be given as premedication 30 minutes before transfusion for patients with prior reactions. Does NOT treat anaphylaxis - epinephrine is required for systemic reactions." },
      { name: "Hydrocortisone", type: "Corticosteroid", action: "Reduces late-phase inflammatory response and prevents recurrence of urticaria by suppressing immune cell activation and cytokine release", sideEffects: "Hyperglycemia, fluid retention, immunosuppression with repeated use", contra: "Active untreated fungal infection (relative)", pearl: "Sometimes added as adjunctive therapy for persistent or widespread urticaria. Takes 4-6 hours for full effect, so it prevents recurrence rather than treating acute symptoms. Not routinely needed for simple, localized urticaria." },
      { name: "Washed Red Blood Cells", type: "Blood Product Modification", action: "Saline washing removes >99% of plasma proteins from the blood product, eliminating the antigens that trigger IgE-mediated allergic reactions", sideEffects: "Shorter shelf life after washing (24 hours), slightly reduced RBC recovery", contra: "None specific", pearl: "Reserved for patients with RECURRENT allergic reactions despite antihistamine premedication. Removes the offending plasma proteins entirely. Also used for IgA-deficient patients who need IgA-free products to prevent anaphylaxis." }
    ],
    pearls: [
      "Mild allergic reaction is the ONLY transfusion reaction where resumption may be considered",
      "Key criteria for resumption: symptoms fully resolved, stable vitals, NO airway involvement, provider approval",
      "The differentiator between allergic and anaphylactic: presence of airway or cardiovascular symptoms = anaphylaxis",
      "Urticaria + stable vitals = mild allergic. Urticaria + wheezing/hypotension = anaphylaxis (completely different management)",
      "Diphenhydramine is appropriate for mild allergic reactions; EPINEPHRINE is required for anaphylaxis",
      "If in doubt whether mild or severe, treat as the more serious condition",
      "Premedication with diphenhydramine is effective prevention for patients with known prior reactions",
      "Washed RBCs are the definitive solution for recurrent allergic reactions",
      "Atopic patients (asthma, eczema, allergies) have a higher incidence of transfusion allergic reactions",
      "Never assume a reaction will stay 'mild' - continuous monitoring is required for progression"
    ],
    quiz: [
      { question: "A patient develops urticaria on the chest and arms during a blood transfusion. Vital signs: BP 124/78, HR 76, RR 16, SpO2 99%. Lung sounds are clear. What is the appropriate nursing action?", options: ["Administer epinephrine 0.3 mg IM immediately", "Stop the transfusion, administer diphenhydramine, and monitor for resolution", "Continue the transfusion and apply calamine lotion", "Call a rapid response for anaphylaxis"], correct: 1, rationale: "This is a mild allergic reaction: urticaria with completely stable vital signs and clear lungs. The appropriate action is to stop the transfusion (standard for any reaction), administer diphenhydramine to block histamine, and monitor. Epinephrine is for anaphylaxis (airway or hemodynamic compromise). Continuing the transfusion without stopping to assess is never appropriate. This is not anaphylaxis because there are no systemic symptoms." },
      { question: "After treatment for a mild allergic transfusion reaction, the urticaria resolves completely and vital signs remain stable. The provider orders resumption of the transfusion. Which statement by the nurse indicates correct understanding?", options: ["I should restart at the original rate since symptoms resolved", "I should restart at a slower rate and remain at the bedside for 15 minutes", "I should refuse because transfusions can never be resumed after a reaction", "I should wait 24 hours before resuming"], correct: 1, rationale: "When a mild allergic reaction fully resolves and the provider orders resumption, the transfusion should be restarted at a SLOWER rate with the nurse remaining at the bedside for continued monitoring. Restarting at the original rate does not allow for close observation. It is incorrect to say transfusions can never be resumed - mild allergic is the one exception. There is no need to wait 24 hours; the product must be used within 4 hours of leaving the blood bank." },
      { question: "Which finding would cause the nurse to RECLASSIFY a mild allergic reaction as anaphylaxis?", options: ["Urticaria spreading to the legs", "Patient reporting continued itching", "Development of wheezing and lip swelling", "Temperature rising to 37.8 degrees C"], correct: 2, rationale: "Wheezing (bronchospasm) and lip swelling (angioedema) indicate systemic involvement and airway compromise, which reclassifies the reaction from mild allergic to ANAPHYLAXIS. This changes management completely: epinephrine becomes the first-line treatment. Spreading urticaria and itching are still consistent with mild allergic reaction. A mild temperature elevation could suggest a concurrent febrile reaction but does not indicate anaphylaxis." },
      { question: "For a patient with 3 prior mild allergic transfusion reactions despite diphenhydramine premedication, the nurse should anticipate orders for:", options: ["Irradiated blood products", "Washed red blood cells", "CMV-negative blood products", "Leukoreduced blood products"], correct: 1, rationale: "Washed RBCs have had >99% of plasma proteins removed by saline washing, eliminating the foreign proteins that trigger IgE-mediated allergic reactions. When a patient continues to have reactions despite antihistamine premedication, removing the offending proteins entirely is the next step. Irradiated products prevent TA-GVHD. CMV-negative products are for immunocompromised patients. Leukoreduction prevents febrile reactions, not allergic reactions." },
      { question: "Which type of transfusion reaction is the ONLY one where the transfusion may be resumed?", options: ["Febrile non-hemolytic", "Mild allergic", "TACO", "TRALI"], correct: 1, rationale: "Mild allergic reaction (urticaria with stable vitals and no airway involvement) is the ONLY transfusion reaction where resumption may be considered after symptoms fully resolve and the provider approves. FNHTR may sometimes allow careful resumption in select cases, but mild allergic is the classic 'correct answer' for this exam question. TACO and TRALI always require permanent discontinuation of the transfusion." }
    ],
    preTest: [
      { question: "Mild allergic transfusion reactions are caused by:", options: ["ABO incompatibility", "IgE antibodies reacting to donor plasma proteins", "Bacterial contamination", "Volume overload"], correct: 1, rationale: "Mild allergic reactions are IgE-mediated hypersensitivity responses to soluble proteins in the donor's plasma. Pre-existing IgE antibodies on mast cells recognize these foreign proteins, causing degranulation and histamine release that produces urticaria and pruritus. ABO incompatibility causes hemolytic reactions. Bacteria cause septic reactions. Volume overload causes TACO." },
      { question: "The hallmark sign of a mild allergic transfusion reaction is:", options: ["Fever and rigors", "Urticaria with stable vital signs", "Hemoglobinuria", "Bilateral pulmonary infiltrates"], correct: 1, rationale: "Urticaria (hives) with completely stable vital signs is the hallmark of a mild allergic reaction. The stable vitals differentiate it from anaphylaxis. Fever/rigors suggest FNHTR or AHTR. Hemoglobinuria indicates hemolytic reaction. Bilateral infiltrates suggest TRALI." }
    ],
    postTest: [
      { question: "A nurse premedicated a patient with diphenhydramine before a transfusion due to prior allergic history. The patient develops urticaria anyway. What should the nurse do?", options: ["Give a second dose of diphenhydramine and continue the transfusion", "Stop the transfusion, reassess, and notify the provider", "Switch to a different blood type", "Administer epinephrine prophylactically"], correct: 1, rationale: "Even though premedication was given, the reaction still occurred. The nurse must still stop the transfusion and perform a complete assessment. Never give a second dose of antihistamine and continue without stopping. The provider needs to be notified to make decisions about resumption and to consider washed products for future transfusions. Switching blood types is not relevant to allergic reactions (which are caused by plasma proteins, not RBC antigens)." },
      { question: "What distinguishes the management of a mild allergic reaction from ALL other transfusion reactions?", options: ["It requires epinephrine", "The transfusion may potentially be resumed", "It requires ICU transfer", "It requires blood bank notification within 1 hour"], correct: 1, rationale: "The unique management feature of mild allergic reactions is that the transfusion may potentially be resumed after symptoms fully resolve, if the provider approves. ALL other transfusion reaction types (hemolytic, anaphylactic, TACO, TRALI, septic) require permanent discontinuation of the transfusion. This is one of the most frequently tested transfusion concepts." }
    ]
  },

  "anaphylactic-transfusion-reaction": {
    title: "Anaphylactic Transfusion Reaction",
    cellular: {
      title: "Anaphylactic Transfusion Reactions",
      content: "Anaphylactic transfusion reactions are severe, life-threatening systemic hypersensitivity responses that occur within seconds to minutes of initiating a blood transfusion. Unlike mild allergic reactions that are limited to the skin, anaphylaxis involves the respiratory system, cardiovascular system, and potentially the gastrointestinal tract, creating a medical emergency that can be rapidly fatal without immediate intervention.\n\nThe most well-characterized mechanism involves patients with selective IgA deficiency (the most common primary immunodeficiency, affecting approximately 1 in 500-700 individuals). These patients lack IgA and have developed anti-IgA antibodies from prior transfusions or pregnancies. When they receive a blood product containing donor IgA, the anti-IgA antibodies trigger massive mast cell and basophil degranulation through either IgE-mediated or complement-mediated pathways.\n\nMast cell degranulation releases massive quantities of histamine, tryptase, prostaglandins, and leukotrienes simultaneously throughout the body. Histamine causes systemic vasodilation and increased vascular permeability, leading to distributive shock with profound hypotension. Leukotrienes (particularly LTC4, LTD4, LTE4) cause bronchospasm that is far more potent and prolonged than histamine-mediated bronchospasm. The combination of airway obstruction from bronchospasm and laryngeal edema, cardiovascular collapse from vasodilation and plasma extravasation, and mucosal swelling (angioedema) creates a rapidly lethal triad.\n\nAnaphylaxis can also occur through IgE-mediated reactions to other donor plasma proteins in sensitized individuals, similar to the mechanism in mild allergic reactions but with a far more explosive and widespread immune response. The severity depends on the degree of sensitization, the quantity of antigen introduced, and the speed of antigen delivery.\n\nEpinephrine is the ONLY first-line treatment for anaphylaxis. It counteracts all three pathophysiologic mechanisms simultaneously: alpha-1 receptor activation causes vasoconstriction (raising blood pressure), beta-1 activation increases heart rate and contractility, and beta-2 activation causes bronchodilation and inhibits further mast cell degranulation. Delay in epinephrine administration is the leading cause of death in anaphylaxis. Antihistamines and corticosteroids are adjuncts only and do NOT substitute for epinephrine."
    },
    riskFactors: [
      "IgA deficiency (most common primary immunodeficiency, ~1 in 500-700 people)",
      "Known anti-IgA antibodies from prior transfusions or pregnancies",
      "History of severe allergic reactions to blood products",
      "History of anaphylaxis to any trigger (medications, foods, insect stings)",
      "Multiple prior transfusions increasing sensitization risk",
      "Patients on beta-blockers (may have refractory anaphylaxis, poor response to epinephrine)",
      "ACE inhibitor use (may worsen angioedema component)",
      "Prior allergic transfusion reactions that were undertreated"
    ],
    diagnostics: [
      "Clinical diagnosis based on acute presentation: bronchospasm + hypotension + angioedema within minutes",
      "Serum tryptase level: elevated within 1-3 hours of onset, confirms mast cell degranulation",
      "IgA level: if low or absent, measure anti-IgA antibodies",
      "Vital signs: expect severe hypotension, tachycardia, desaturation",
      "Pulse oximetry: continuous monitoring for desaturation from bronchospasm",
      "ABG if intubated: assess oxygenation and ventilation",
      "Chest X-ray: may show hyperinflation from air trapping (bronchospasm)",
      "Continuous cardiac monitoring: arrhythmias may occur from hypoperfusion",
      "Post-event allergy testing to identify specific trigger proteins"
    ],
    management: [
      "STOP transfusion IMMEDIATELY - do not delay for any reason",
      "Administer EPINEPHRINE 0.3-0.5 mg IM in the anterolateral thigh - this is the FIRST drug, always",
      "Call rapid response team / code team immediately",
      "Maintain airway: position for optimal breathing, prepare for intubation",
      "Administer high-flow oxygen via non-rebreather mask",
      "Aggressive IV normal saline bolus (1-2 L) for hypotension",
      "May repeat epinephrine every 5-15 minutes if symptoms persist",
      "Adjunctive medications: diphenhydramine IV, ranitidine IV, methylprednisolone IV",
      "If refractory: epinephrine infusion, consider glucagon if on beta-blockers",
      "For future transfusions: MUST use washed blood products (IgA-depleted) or products from IgA-deficient donors"
    ],
    nursingActions: [
      "Recognize anaphylaxis immediately: wheezing + hypotension + swelling = anaphylaxis, not 'just allergies'",
      "Stop transfusion and disconnect blood tubing - every second counts",
      "Administer epinephrine IM immediately per standing orders or protocol",
      "Position patient supine with legs elevated (unless respiratory distress requires upright positioning)",
      "Establish or maintain large-bore IV access for fluid resuscitation",
      "Apply continuous pulse oximetry and cardiac monitoring",
      "Prepare intubation equipment (crash cart) at bedside",
      "Stay with the patient continuously - do NOT leave to get supplies, call for help",
      "Document: exact time of onset, volume transfused, symptoms in order of appearance, all interventions and timing",
      "After stabilization: ensure the event is flagged in the patient's record for all future transfusions"
    ],
    signs: {
      left: [
        "Bronchospasm: wheezing, dyspnea, chest tightness (airway compromise)",
        "Stridor: laryngeal edema causing upper airway obstruction",
        "Angioedema: swelling of lips, tongue, face, throat",
        "Severe hypotension: systolic BP drop >30% from baseline or <90 mmHg"
      ],
      right: [
        "Tachycardia: compensatory response to hypotension",
        "Urticaria: may or may not be present (absence does not rule out anaphylaxis)",
        "Gastrointestinal: nausea, vomiting, abdominal cramping, diarrhea",
        "Loss of consciousness from cerebral hypoperfusion",
        "Onset within seconds to minutes of starting transfusion"
      ]
    },
    medications: [
      { name: "Epinephrine (Adrenaline)", type: "Sympathomimetic", action: "Alpha-1: vasoconstriction raises BP. Beta-1: increases HR and contractility. Beta-2: bronchodilation and inhibits mast cell degranulation. The ONLY drug that addresses all 3 mechanisms of anaphylaxis simultaneously", sideEffects: "Tachycardia, palpitations, hypertension, anxiety, tremor, headache", contra: "NO absolute contraindication in anaphylaxis - ALWAYS give when indicated. Benefits always outweigh risks", pearl: "FIRST-LINE and the ONLY life-saving drug for anaphylaxis. Give 0.3-0.5 mg (1:1000) IM in the anterolateral thigh. May repeat every 5-15 minutes. DELAY in epinephrine = DEATH. Antihistamines and steroids are adjuncts that do NOT replace epinephrine." },
      { name: "Diphenhydramine (Benadryl)", type: "H1 Antihistamine", action: "Blocks H1 receptors to reduce urticaria, pruritus, and some vasodilation. Does NOT reverse bronchospasm or cardiovascular collapse", sideEffects: "Drowsiness, dry mouth, urinary retention", contra: "Do not delay epinephrine to give this drug", pearl: "Adjunct medication ONLY - give AFTER epinephrine. Helps with skin symptoms and mild hemodynamic improvement but cannot treat life-threatening bronchospasm or profound hypotension. Typical dose: 50 mg IV." },
      { name: "Methylprednisolone (Solu-Medrol)", type: "Corticosteroid", action: "Suppresses late-phase inflammatory response. Takes 4-6 hours to work. Given to prevent biphasic anaphylaxis that can occur 4-12 hours after initial episode", sideEffects: "Hyperglycemia, fluid retention, immunosuppression", contra: "No contraindication in acute anaphylaxis", pearl: "Does NOT treat acute anaphylaxis. Takes hours to work. Given to prevent the biphasic reaction that occurs in 5-20% of cases. Always given AFTER epinephrine, never instead of it. Typical dose: 125 mg IV." },
      { name: "Albuterol (Salbutamol)", type: "Beta-2 Agonist", action: "Inhaled bronchodilator that relaxes bronchial smooth muscle to relieve bronchospasm", sideEffects: "Tachycardia, tremor, hypokalemia", contra: "None in emergency setting", pearl: "Adjunct for persistent bronchospasm after epinephrine. Given via nebulizer. Does not treat the systemic components of anaphylaxis (hypotension, angioedema) - only addresses bronchospasm." }
    ],
    pearls: [
      "EPINEPHRINE is the FIRST and ONLY life-saving drug for anaphylaxis - delay = death",
      "IgA deficiency is the most common identifiable risk factor for anaphylactic transfusion reactions",
      "Mild allergic vs anaphylactic: the presence of bronchospasm, stridor, or hypotension changes everything",
      "Absence of urticaria does NOT rule out anaphylaxis - up to 20% of cases have no skin findings",
      "Give epinephrine IM in the anterolateral thigh (vastus lateralis), NOT subcutaneously and NOT IV push (unless cardiac arrest)",
      "Biphasic anaphylaxis can occur 4-12 hours after the initial reaction - observe patients for at least 6-8 hours",
      "Patients on beta-blockers may have refractory anaphylaxis - glucagon bypasses the beta receptor blockade",
      "For IgA-deficient patients: MUST use washed RBCs or products from IgA-deficient donors for all future transfusions",
      "Antihistamines are NOT a substitute for epinephrine - they treat skin symptoms only",
      "After an anaphylactic transfusion reaction, the patient MUST be tested for IgA deficiency"
    ],
    quiz: [
      { question: "A patient develops wheezing, facial swelling, and a BP of 68/40 within 2 minutes of starting a blood transfusion. What medication should be administered FIRST?", options: ["Diphenhydramine 50 mg IV", "Methylprednisolone 125 mg IV", "Epinephrine 0.3 mg IM", "Albuterol nebulizer"], correct: 2, rationale: "Wheezing (bronchospasm), facial swelling (angioedema), and severe hypotension within minutes indicate anaphylaxis. Epinephrine 0.3-0.5 mg IM is the FIRST-LINE treatment and the ONLY drug that addresses all three mechanisms: bronchospasm (beta-2), hypotension (alpha-1), and mast cell stabilization (beta-2). Diphenhydramine and steroids are adjuncts given AFTER epinephrine. Albuterol only treats bronchospasm, not the hemodynamic collapse." },
      { question: "Which patient is at HIGHEST risk for an anaphylactic transfusion reaction?", options: ["Patient with Type O blood", "Patient with known IgA deficiency and anti-IgA antibodies", "Patient receiving their first transfusion", "Patient with a history of FNHTR"], correct: 1, rationale: "IgA-deficient patients with anti-IgA antibodies are at the highest risk because IgA is present in virtually all standard blood products. When anti-IgA antibodies encounter donor IgA, massive anaphylaxis can occur. Blood type is irrelevant to allergic/anaphylactic reactions. First-time transfusion recipients have no pre-existing antibodies. FNHTR history predicts febrile reactions, not anaphylaxis." },
      { question: "After treating anaphylaxis from a transfusion reaction with epinephrine, the nurse should observe the patient for at least:", options: ["30 minutes", "1 hour", "4-6 hours minimum (risk of biphasic reaction)", "24 hours on a ventilator"], correct: 2, rationale: "Biphasic anaphylaxis can occur 4-12 hours after the initial reaction in 5-20% of cases. The second phase can be as severe as or worse than the first. Patients should be observed for at least 6-8 hours after an anaphylactic episode. Corticosteroids are given specifically to help prevent this biphasic response." },
      { question: "An IgA-deficient patient requires a blood transfusion. What type of blood product should the nurse anticipate?", options: ["Irradiated packed RBCs", "Washed red blood cells or products from IgA-deficient donors", "Leukoreduced packed RBCs", "Standard packed RBCs with epinephrine at bedside"], correct: 1, rationale: "IgA-deficient patients with anti-IgA antibodies must receive washed blood products (which remove >99% of plasma proteins including IgA) or products specifically collected from IgA-deficient donors. Simply having epinephrine at bedside is not prevention - it is rescue after a potentially fatal reaction has already started. Irradiation prevents TA-GVHD. Leukoreduction prevents febrile reactions." },
      { question: "A nurse administers diphenhydramine to a patient experiencing bronchospasm and hypotension during a transfusion. The symptoms do not improve. The most likely reason is:", options: ["The diphenhydramine dose was too low", "Diphenhydramine does not treat anaphylaxis - epinephrine is required", "The patient needs IV steroids first", "The blood product should have been resumed at a slower rate"], correct: 1, rationale: "Diphenhydramine is an H1 antihistamine that only treats skin symptoms (urticaria, pruritus). It cannot reverse bronchospasm or cardiovascular collapse. Epinephrine is the ONLY drug that treats all components of anaphylaxis. This is a critical medication error if epinephrine is withheld while antihistamines are given. The patient needs epinephrine immediately. Steroids take hours to work and are not immediate treatment." }
    ],
    preTest: [
      { question: "What is the route and dose for epinephrine in anaphylaxis?", options: ["0.1 mg IV push", "0.3-0.5 mg IM in the anterolateral thigh", "1 mg subcutaneous in the deltoid", "0.01 mg/kg nebulized"], correct: 1, rationale: "Epinephrine for anaphylaxis is given as 0.3-0.5 mg (using 1:1000 concentration) IM in the anterolateral thigh (vastus lateralis). IM injection in the thigh provides the fastest and most reliable absorption. IV epinephrine is reserved for cardiac arrest or refractory anaphylaxis with continuous infusion. Subcutaneous absorption is too slow and unreliable." },
      { question: "Anaphylactic transfusion reactions most commonly involve which immunoglobulin?", options: ["IgG", "IgM", "IgA", "IgD"], correct: 2, rationale: "IgA deficiency with anti-IgA antibodies is the most commonly identified cause of anaphylactic transfusion reactions. When anti-IgA antibodies encounter donor IgA in the transfused product, massive mast cell degranulation occurs. IgM is involved in ABO hemolytic reactions. IgG is involved in delayed hemolytic reactions. IgD has minimal clinical significance." }
    ],
    postTest: [
      { question: "Which statement about anaphylactic transfusion reactions is CORRECT?", options: ["Antihistamines are adequate first-line treatment", "The reaction typically occurs 6-24 hours after transfusion", "Epinephrine is the only first-line life-saving treatment", "Urticaria must be present to diagnose anaphylaxis"], correct: 2, rationale: "Epinephrine is the ONLY first-line life-saving treatment for anaphylaxis. It is the only drug that simultaneously reverses bronchospasm, raises blood pressure, and stabilizes mast cells. Antihistamines are adjuncts only. Anaphylaxis occurs within seconds to minutes, not hours. Up to 20% of anaphylaxis cases have no skin findings (urticaria is not required for diagnosis)." },
      { question: "After anaphylactic reaction to a blood transfusion, which test should be ordered to identify the cause?", options: ["Repeat ABO typing", "Serum IgA level and anti-IgA antibodies", "Hemoglobin electrophoresis", "HLA typing"], correct: 1, rationale: "After an anaphylactic transfusion reaction, serum IgA levels should be measured. If IgA is absent or very low, anti-IgA antibodies should be tested. Identifying IgA deficiency is critical because all future transfusions must use washed or IgA-depleted products to prevent recurrence. ABO typing is for hemolytic reactions. Hemoglobin electrophoresis diagnoses hemoglobinopathies. HLA typing is for transplant compatibility." }
    ]
  },

  "taco-transfusion-associated-circulatory-overload": {
    title: "TACO: Transfusion-Associated Circulatory",
    cellular: {
      title: "Transfusion-Associated Circulatory Overload",
      content: "Transfusion-Associated Circulatory Overload (TACO) is a non-immune transfusion complication caused by the inability of the cardiovascular system to handle the volume of blood products being transfused. Unlike other transfusion reactions that involve immune mechanisms, TACO is a purely hemodynamic problem: too much volume, too fast, for a heart that cannot compensate.\n\nWhen blood products are transfused, they expand the intravascular volume. In patients with normal cardiac function and adequate renal excretion, this volume expansion is well-tolerated. However, in patients with compromised cardiac function (heart failure, valvular disease), impaired renal excretion (kidney disease), or very low body mass, the additional volume overwhelms the heart's pumping capacity.\n\nThe pathophysiology follows the classic mechanism of cardiogenic pulmonary edema. Excess intravascular volume increases venous return to the right heart, which then delivers more blood to the pulmonary circulation. The left ventricle, unable to keep pace, allows pulmonary venous pressure to rise. When pulmonary capillary hydrostatic pressure exceeds oncotic pressure (typically above 18-20 mmHg), fluid transudates across the capillary membrane into the pulmonary interstitium and alveoli, producing pulmonary edema.\n\nThe clinical presentation reflects this hydrostatic mechanism: dyspnea, orthopnea, bilateral crackles on auscultation, jugular venous distension (JVD), peripheral edema, and importantly, HYPERTENSION. The hypertension is a critical differentiator from TRALI, which presents with normal or LOW blood pressure. The elevated BNP (B-type natriuretic peptide) confirms cardiac volume overload, as BNP is released by ventricular myocytes in response to wall stretch from volume expansion.\n\nTACO is increasingly recognized as the most common cause of transfusion-related mortality reported to the FDA, surpassing even TRALI in recent years. Prevention through careful volume management, slower infusion rates, and judicious use of diuretics in high-risk patients is essential. Each unit of PRBCs adds approximately 250-350 mL of volume, and each unit should be infused over 2-4 hours rather than rapidly."
    },
    riskFactors: [
      "Pre-existing heart failure (systolic or diastolic dysfunction)",
      "Elderly patients (age >70 years with reduced cardiac reserve)",
      "Chronic kidney disease (impaired fluid excretion)",
      "Small body habitus / low body weight (lower volume tolerance per kilogram)",
      "Rapid transfusion rate (infusing too fast for the heart to compensate)",
      "Multiple units transfused in succession without assessment between units",
      "Positive fluid balance prior to transfusion (already volume-overloaded)",
      "Severe chronic anemia (compensatory high-output state with increased blood volume)",
      "Valvular heart disease (especially mitral stenosis or aortic stenosis)"
    ],
    diagnostics: [
      "Vital signs: HYPERTENSION is the hallmark (differentiates from TRALI which has hypotension)",
      "BNP or NT-proBNP: ELEVATED confirms cardiac volume overload (normal in TRALI)",
      "Chest X-ray: bilateral pulmonary infiltrates/edema, cardiomegaly, pleural effusions",
      "Pulse oximetry: desaturation from pulmonary edema impairing gas exchange",
      "Assess JVD: elevated (present in TACO, absent in TRALI)",
      "Assess for peripheral edema: present in TACO",
      "Auscultate lungs: bilateral crackles (wet rales) from fluid in alveoli",
      "Echocardiogram if available: may show reduced ejection fraction or diastolic dysfunction",
      "Fluid balance review: calculate total intake vs output over preceding 24 hours",
      "Weight comparison: acute weight gain indicates fluid retention"
    ],
    management: [
      "STOP the transfusion or slow the infusion rate significantly",
      "Position patient UPRIGHT (High Fowler's position) to reduce venous return and improve breathing",
      "Administer supplemental oxygen to maintain SpO2 >94%",
      "Administer IV furosemide (Lasix) as ordered to promote diuresis",
      "Apply continuous pulse oximetry and cardiac monitoring",
      "Restrict IV fluids and oral fluids",
      "Monitor urine output closely - expect increased output after diuretics",
      "Monitor electrolytes (potassium, sodium) after diuretic administration",
      "For severe cases: consider non-invasive positive pressure ventilation (CPAP/BiPAP)",
      "For future transfusions: slow rate (1 mL/kg/hr), smaller volume units, prophylactic furosemide between units"
    ],
    nursingActions: [
      "Assess respiratory status before, during, and after every transfusion",
      "Monitor for early signs: increasing dyspnea, new cough, orthopnea",
      "Position patient upright immediately if respiratory distress develops",
      "Obtain and compare weights before and after transfusion",
      "Calculate and monitor fluid balance (input vs output)",
      "For high-risk patients: request slow transfusion rate (1 mL/kg/hr) and prophylactic diuretics",
      "Administer one unit at a time with reassessment between units for high-risk patients",
      "Ensure supplemental oxygen is readily available",
      "Auscultate lung sounds before each unit and compare to baseline",
      "Document: time of symptom onset, vital signs trend, interventions, and response"
    ],
    signs: {
      left: [
        "Dyspnea and orthopnea (cannot breathe when lying flat)",
        "Bilateral crackles (rales) on lung auscultation",
        "Jugular venous distension (JVD)",
        "HYPERTENSION (key differentiator from TRALI)"
      ],
      right: [
        "Elevated BNP (key differentiator from TRALI where BNP is normal)",
        "Peripheral edema",
        "Tachycardia (compensatory response)",
        "Pink frothy sputum (severe pulmonary edema)",
        "Weight gain from fluid retention",
        "Responds to diuretics (TRALI does NOT respond to diuretics)"
      ]
    },
    medications: [
      { name: "Furosemide (Lasix)", type: "Loop Diuretic", action: "Inhibits Na/K/2Cl cotransporter in the thick ascending loop of Henle, causing rapid and potent diuresis to reduce intravascular volume and pulmonary congestion", sideEffects: "Hypokalemia, hypotension, dehydration, hyponatremia, ototoxicity", contra: "Anuria, severe hypovolemia (but appropriate in TACO which is volume overload)", pearl: "TACO is the ONLY transfusion reaction where diuretics are indicated. NEVER give furosemide for TRALI (it is a permeability problem, not a volume problem - diuretics worsen hypotension). Typical dose: 20-40 mg IV push. Monitor potassium closely." },
      { name: "Supplemental Oxygen", type: "Respiratory Support", action: "Increases inspired oxygen concentration to compensate for impaired gas exchange from pulmonary edema", sideEffects: "Oxygen toxicity with prolonged high FiO2, CO2 retention in chronic COPD patients", contra: "None in acute respiratory distress", pearl: "Start with nasal cannula or non-rebreather mask. If hypoxemia persists despite high-flow oxygen, consider CPAP or BiPAP (non-invasive positive pressure ventilation) which helps re-expand collapsed alveoli and reduce preload." },
      { name: "Nitroglycerin", type: "Vasodilator", action: "Venodilator at low doses (reduces preload), arteriodilator at higher doses (reduces afterload). Decreases pulmonary congestion by reducing venous return to the heart", sideEffects: "Hypotension, headache, reflex tachycardia", contra: "Hypotension (SBP <90), concurrent PDE5 inhibitor use (sildenafil/tadalafil)", pearl: "May be used for severe TACO to rapidly reduce preload and afterload. Sublingual nitroglycerin provides rapid onset. IV nitroglycerin drip allows titration. Always check BP before administration." }
    ],
    pearls: [
      "TACO vs TRALI is one of the HIGHEST-YIELD exam differentials in transfusion medicine",
      "TACO = HYPERTENSION + JVD + elevated BNP + responds to diuretics",
      "TRALI = normal/low BP + no JVD + normal BNP + diuretics CONTRAINDICATED",
      "TACO is now the leading cause of transfusion-related mortality reported to the FDA",
      "Prevention: slow infusion rate (1 mL/kg/hr for high-risk patients), one unit at a time",
      "Each unit of PRBCs adds 250-350 mL of volume - significant for patients with limited cardiac reserve",
      "Furosemide between units is standard prophylaxis for CHF patients requiring transfusion",
      "Position upright (High Fowler's) immediately - this single intervention can significantly improve breathing",
      "TACO is NOT an immune reaction - it is purely a volume/hemodynamic problem",
      "The elderly, CHF patients, and renal disease patients are the highest-risk populations"
    ],
    quiz: [
      { question: "An elderly patient with CHF receiving her second unit of PRBCs develops dyspnea, bilateral crackles, JVD, and BP rises to 178/96. Which action is MOST appropriate?", options: ["Administer epinephrine IM", "Position supine with legs elevated", "Stop/slow transfusion, position upright, administer furosemide", "Prepare for intubation and give IV fluids"], correct: 2, rationale: "This is classic TACO: CHF patient + multiple units + dyspnea + crackles + JVD + HYPERTENSION. The management triad is: stop or slow the transfusion, position upright (High Fowler's to reduce preload), and administer IV furosemide (diuretic to reduce volume). Epinephrine is for anaphylaxis. Supine positioning would worsen pulmonary congestion. IV fluids would worsen volume overload." },
      { question: "Which lab value BEST differentiates TACO from TRALI?", options: ["Hemoglobin level", "BNP (B-type natriuretic peptide)", "Serum lactate", "WBC count"], correct: 1, rationale: "BNP is the best differentiator: it is ELEVATED in TACO (heart is stretched from volume overload) and NORMAL in TRALI (the problem is capillary permeability, not volume overload). Hemoglobin does not differentiate the two. Lactate may be elevated in both from tissue hypoperfusion. WBC count is nonspecific." },
      { question: "TACO is primarily caused by:", options: ["ABO incompatibility", "Donor antibodies activating neutrophils", "Intravascular volume overload exceeding cardiac capacity", "Bacterial contamination"], correct: 2, rationale: "TACO is a purely hemodynamic/volume problem. The blood product volume exceeds what the heart can handle, leading to pulmonary edema. It is NOT an immune reaction. ABO incompatibility causes AHTR. Donor antibodies cause TRALI. Bacterial contamination causes septic reactions." },
      { question: "Why are diuretics CONTRAINDICATED in TRALI but INDICATED in TACO?", options: ["Diuretics cause allergic reactions in TRALI patients", "TRALI is a capillary permeability problem, not volume overload; diuretics worsen hypotension", "Diuretics interact with the antibodies causing TRALI", "There is no contraindication; diuretics can be used in both"], correct: 1, rationale: "TACO is volume overload (too much fluid, heart cannot pump it) - diuretics remove excess fluid. TRALI is a capillary PERMEABILITY problem (donor antibodies cause pulmonary capillary leak) with normal or low intravascular volume. Giving diuretics in TRALI would remove more intravascular volume from an already hypotensive patient, worsening shock." },
      { question: "Which patient is at HIGHEST risk for TACO during a blood transfusion?", options: ["25-year-old trauma patient receiving emergency O-negative blood", "70-year-old with CHF and CKD receiving 3 units over 4 hours", "40-year-old healthy woman receiving 1 unit for surgical anemia", "30-year-old with IgA deficiency"], correct: 1, rationale: "The 70-year-old with CHF (reduced cardiac pump function) and CKD (impaired fluid excretion) receiving 3 units (750-1050 mL extra volume) over a short timeframe is the highest risk for TACO. The combination of advanced age, heart failure, kidney disease, and multiple units is a setup for volume overload. IgA deficiency predicts anaphylactic reactions, not TACO." }
    ],
    preTest: [
      { question: "TACO stands for:", options: ["Transfusion-Associated Coagulation Overactivation", "Transfusion-Associated Circulatory Overload", "Transfusion-Activated Complement Opsonization", "Transfusion-Allergic Cardiovascular Obstruction"], correct: 1, rationale: "TACO = Transfusion-Associated Circulatory Overload. It is a volume overload complication where the transfused blood product volume exceeds the patient's cardiovascular capacity, causing pulmonary edema. It is a hemodynamic problem, not an immune reaction." },
      { question: "The hallmark vital sign finding in TACO that differentiates it from TRALI is:", options: ["Tachycardia", "Fever", "Hypertension", "Hypoxemia"], correct: 2, rationale: "HYPERTENSION is the hallmark vital sign in TACO. The excess intravascular volume causes increased cardiac output and elevated blood pressure. TRALI, by contrast, presents with normal or LOW blood pressure because the problem is capillary leak and intravascular volume loss. Both may have hypoxemia and tachycardia." }
    ],
    postTest: [
      { question: "A nurse is planning care for a patient with CHF who needs 2 units of PRBCs. Which interventions reduce TACO risk?", options: ["Transfuse both units rapidly to minimize time", "Slow infusion rate (1 mL/kg/hr), one unit at a time, furosemide between units", "Pre-medicate with epinephrine", "Use leukoreduced products"], correct: 1, rationale: "For high-risk patients, TACO prevention includes: slow infusion rate (1 mL/kg/hr instead of the standard rate), transfusing one unit at a time with clinical reassessment between units, and prophylactic furosemide (typically 20 mg IV) between units to offload excess volume. Rapid transfusion increases risk. Epinephrine premedication is not indicated. Leukoreduction prevents febrile reactions." },
      { question: "After treating TACO with furosemide and positioning, the patient's oxygen saturation improves from 88% to 96% and crackles are diminishing. What does this indicate?", options: ["The patient is developing TRALI", "The diuresis is working and pulmonary edema is resolving", "The patient needs a second dose of epinephrine", "The transfusion should be immediately resumed at the original rate"], correct: 1, rationale: "Improving SpO2 and diminishing crackles indicate that the diuretic therapy is successfully reducing pulmonary edema. The excess fluid is being excreted through the kidneys, reducing pulmonary congestion. Continue monitoring and do not resume the transfusion at the original rate. If additional transfusion is needed, it should be at a much slower rate." }
    ]
  },

  "trali-transfusion-related-acute-lung-injury": {
    title: "TRALI: Transfusion-Related Acute Lung Injury",
    cellular: {
      title: "Transfusion-Related Acute Lung Injury",
      content: "Transfusion-Related Acute Lung Injury (TRALI) is a severe, potentially fatal non-cardiogenic pulmonary edema that develops within 6 hours of a blood transfusion. Unlike TACO which is a volume problem, TRALI is an immune-mediated injury to the pulmonary capillary endothelium that causes a clinical picture resembling acute respiratory distress syndrome (ARDS).\n\nThe predominant mechanism involves the 'two-hit' model. The 'first hit' is an underlying patient condition (sepsis, recent surgery, trauma, massive transfusion, active infection) that primes neutrophils and causes them to sequester in the pulmonary vasculature. The 'second hit' comes from the transfused blood product, which contains either: (1) donor anti-HLA class I or class II antibodies that bind to recipient leukocyte antigens, or (2) anti-neutrophil antibodies that bind directly to neutrophil surface antigens, or (3) biologic response modifiers (lipids, cytokines) that have accumulated during blood product storage.\n\nWhen primed neutrophils in the pulmonary capillaries are activated by these transfusion-derived factors, they release reactive oxygen species, proteolytic enzymes (neutrophil elastase, matrix metalloproteinases), and neutrophil extracellular traps (NETs). These substances damage the pulmonary capillary endothelium, destroying the alveolar-capillary barrier and allowing protein-rich fluid to flood into the alveoli. This is NON-CARDIOGENIC pulmonary edema: the heart is functioning normally, but the lung capillaries are leaking.\n\nThe clinical presentation is acute onset of bilateral pulmonary infiltrates on chest X-ray, severe hypoxemia (PaO2/FiO2 ratio <300), and respiratory distress within 6 hours of transfusion. Critically, TRALI presents with NORMAL or LOW blood pressure (not hypertension like TACO), NO jugular venous distension, and NORMAL BNP levels, because the heart and intravascular volume are not the problem.\n\nDonor antibodies from multiparous female donors are the most common source of anti-HLA antibodies. Many blood banks have implemented male-only plasma donation policies to reduce TRALI risk, which has significantly decreased incidence. Treatment is entirely supportive: aggressive respiratory support (high-flow oxygen, mechanical ventilation if needed) while the pulmonary endothelium heals. Diuretics are CONTRAINDICATED because they would remove intravascular volume from an already hypotensive patient."
    },
    riskFactors: [
      "Receiving plasma-containing blood products (FFP, platelets, whole blood have highest risk)",
      "Products from multiparous female donors (high prevalence of anti-HLA antibodies)",
      "Active infection or sepsis in the recipient (primes neutrophils - first hit)",
      "Recent major surgery (inflammatory state primes neutrophils)",
      "Chronic alcohol use (liver disease creates systemic inflammation)",
      "Massive transfusion protocol (multiple products increase exposure risk)",
      "Mechanically ventilated patients (already have pulmonary neutrophil sequestration)",
      "Hematologic malignancy (altered immune state)"
    ],
    diagnostics: [
      "Chest X-ray: bilateral pulmonary infiltrates (white-out) consistent with non-cardiogenic edema",
      "Pulse oximetry and ABG: severe hypoxemia, PaO2/FiO2 ratio <300",
      "BNP or NT-proBNP: NORMAL (critical differentiator from TACO which has elevated BNP)",
      "Blood pressure: NORMAL or LOW (differentiates from TACO which has hypertension)",
      "Assess for JVD: ABSENT (differentiates from TACO which has JVD)",
      "Donor antibody testing: test donor plasma for anti-HLA and anti-neutrophil antibodies",
      "Recipient HLA typing: to confirm match between donor antibodies and recipient antigens",
      "Echocardiogram: normal cardiac function (rules out cardiogenic pulmonary edema)",
      "Temperature: fever may be present (nonspecific finding)"
    ],
    management: [
      "STOP the transfusion IMMEDIATELY",
      "Aggressive respiratory support: high-flow oxygen, prepare for possible intubation and mechanical ventilation",
      "DO NOT give diuretics - this is a permeability problem, NOT volume overload; diuretics worsen hypotension",
      "Supportive IV fluids if hypotensive (cautiously, to maintain perfusion without worsening pulmonary edema)",
      "Notify blood bank immediately - donor products must be quarantined and tested",
      "Position to optimize respiratory mechanics (usually upright or semi-upright)",
      "Continuous pulse oximetry and hemodynamic monitoring",
      "If intubation required: use lung-protective ventilation strategy (low tidal volumes 6 mL/kg IBW)",
      "Vasopressor support if hypotension persists despite cautious fluid resuscitation",
      "Monitor for resolution: most TRALI cases resolve within 48-96 hours with supportive care"
    ],
    nursingActions: [
      "Monitor respiratory status continuously during and after all transfusions",
      "Recognize the triad: acute respiratory distress + bilateral infiltrates + onset within 6 hours of transfusion",
      "Differentiate from TACO: check BP (should be normal/low, not high), check BNP (should be normal), check for JVD (should be absent)",
      "Administer high-flow oxygen and prepare respiratory support equipment",
      "Do NOT administer diuretics even if bilateral infiltrates look like pulmonary edema",
      "Maintain IV access with cautious fluid administration if hypotensive",
      "Position patient for optimal breathing (usually elevated head of bed)",
      "Prepare for possible intubation: ensure crash cart, suction, and intubation equipment at bedside",
      "Notify blood bank of suspected TRALI so donor can be permanently deferred",
      "Document detailed timeline: transfusion start, symptom onset, interventions, respiratory parameters"
    ],
    signs: {
      left: [
        "Acute onset respiratory distress within 6 hours of transfusion",
        "Severe hypoxemia (SpO2 may drop below 90%)",
        "Bilateral pulmonary infiltrates on chest X-ray",
        "Fever (may or may not be present)"
      ],
      right: [
        "Normal or LOW blood pressure (NOT hypertension - differentiates from TACO)",
        "NORMAL BNP (NOT elevated - differentiates from TACO)",
        "NO JVD or peripheral edema (differentiates from TACO)",
        "Clinical picture resembles ARDS",
        "Does NOT respond to diuretics (differentiates from TACO)",
        "Usually resolves within 48-96 hours with supportive care"
      ]
    },
    medications: [
      { name: "Supplemental Oxygen / Mechanical Ventilation", type: "Respiratory Support", action: "Corrects hypoxemia by increasing inspired oxygen concentration and providing positive pressure to recruit collapsed alveoli", sideEffects: "Oxygen toxicity with prolonged high FiO2, ventilator-associated pneumonia with prolonged intubation", contra: "None in acute respiratory failure", pearl: "Start with high-flow nasal cannula or non-rebreather mask. If SpO2 remains <90% or work of breathing is excessive, intubation and mechanical ventilation are required. Use lung-protective strategy (tidal volume 6 mL/kg ideal body weight) as in ARDS management." },
      { name: "Normal Saline (cautious)", type: "Isotonic Crystalloid", action: "Maintains intravascular volume and end-organ perfusion in the setting of hypotension", sideEffects: "Can worsen pulmonary edema if given excessively", contra: "Must be given cautiously - TRALI has leaky capillaries, so fluid can worsen lung edema", pearl: "The balance is delicate: the patient needs fluid to maintain blood pressure, but excess fluid worsens pulmonary edema through the leaky capillaries. Use small boluses (250 mL) with frequent reassessment rather than large-volume resuscitation." },
      { name: "Vasopressors (Norepinephrine)", type: "Vasoconstrictor", action: "Raises blood pressure through alpha-1 mediated vasoconstriction when fluid resuscitation is insufficient or contraindicated due to pulmonary edema risk", sideEffects: "Tissue ischemia, tachyarrhythmias, extravasation injury", contra: "Hypovolemia (attempt volume resuscitation first if possible)", pearl: "Preferred over aggressive fluid resuscitation in TRALI because vasopressors raise BP without adding more fluid to already-leaking pulmonary capillaries. Central line administration preferred for vasopressors." }
    ],
    pearls: [
      "TRALI vs TACO is the HIGHEST-YIELD transfusion exam differential",
      "TRALI = hypotension + normal BNP + no JVD + diuretics CONTRAINDICATED",
      "TACO = hypertension + elevated BNP + JVD + diuretics INDICATED",
      "TRALI is a PERMEABILITY problem (leaky capillaries); TACO is a VOLUME problem (too much fluid)",
      "Onset must be within 6 hours of transfusion to qualify as TRALI",
      "Multiparous female donors are the most common source of the anti-HLA antibodies that cause TRALI",
      "Many blood banks now use male-only plasma donors to reduce TRALI risk",
      "NEVER give diuretics for TRALI - they remove volume from an already hypotensive patient",
      "Most TRALI cases resolve within 48-96 hours with supportive care (the lung endothelium heals)",
      "TRALI mortality rate is 5-10%, making it one of the leading causes of transfusion-related death"
    ],
    quiz: [
      { question: "A patient develops acute respiratory distress, bilateral pulmonary infiltrates, and hypotension 3 hours after a platelet transfusion. BNP is normal. The nurse suspects TRALI. Which intervention is CONTRAINDICATED?", options: ["High-flow supplemental oxygen", "Positioning upright for breathing", "IV furosemide administration", "Preparing intubation equipment"], correct: 2, rationale: "Furosemide (diuretics) is CONTRAINDICATED in TRALI. TRALI is a capillary permeability problem, not volume overload. The patient already has normal or low BP. Giving diuretics would further reduce intravascular volume, worsening hypotension and potentially causing cardiovascular collapse. All other options are appropriate supportive measures." },
      { question: "Which finding BEST differentiates TRALI from TACO?", options: ["Bilateral pulmonary infiltrates on chest X-ray", "Dyspnea and hypoxemia", "Normal BNP and hypotension", "Onset during transfusion"], correct: 2, rationale: "Normal BNP with hypotension is the best differentiator for TRALI. Both TRALI and TACO can have bilateral infiltrates, dyspnea, hypoxemia, and onset during/after transfusion. But TACO has elevated BNP and hypertension (because the heart is overloaded), while TRALI has normal BNP and low/normal BP (because the heart is fine - the problem is leaky lung capillaries)." },
      { question: "TRALI is caused by:", options: ["ABO incompatibility causing hemolysis", "Donor anti-HLA or anti-neutrophil antibodies activating pulmonary neutrophils", "Volume overload exceeding cardiac capacity", "Bacterial contamination of stored blood"], correct: 1, rationale: "TRALI is primarily caused by donor antibodies (anti-HLA class I/II or anti-neutrophil antibodies) that activate recipient neutrophils sequestered in the pulmonary vasculature. The activated neutrophils release toxic mediators that damage the alveolar-capillary barrier, causing non-cardiogenic pulmonary edema. ABO incompatibility causes AHTR. Volume overload causes TACO. Bacteria cause septic reactions." },
      { question: "Which blood bank policy has significantly reduced the incidence of TRALI?", options: ["Universal leukoreduction", "Irradiation of all blood products", "Male-only plasma donation programs", "Extended crossmatch protocols"], correct: 2, rationale: "Male-only plasma donation programs have significantly reduced TRALI because multiparous female donors are the primary source of anti-HLA antibodies (developed during pregnancies from exposure to fetal HLA antigens). By using only male donors for plasma-rich products (FFP, apheresis platelets), the exposure to these antibodies is dramatically reduced." },
      { question: "A patient with suspected TRALI is hypotensive (BP 82/50). What is the appropriate fluid management approach?", options: ["Aggressive fluid resuscitation with 2L NS bolus", "Cautious small-volume boluses (250 mL) with frequent reassessment", "No fluids at all - fluid is contraindicated", "IV furosemide to reduce pulmonary edema"], correct: 1, rationale: "In TRALI, fluid management requires a delicate balance. Small-volume boluses (250 mL) with frequent reassessment are appropriate because the patient needs perfusion pressure, but the leaky pulmonary capillaries mean excess fluid worsens lung edema. Aggressive boluses could flood the lungs. Complete fluid restriction could worsen shock. Furosemide is contraindicated." }
    ],
    preTest: [
      { question: "TRALI stands for:", options: ["Transfusion-Related Allergic Lung Inflammation", "Transfusion-Related Acute Lung Injury", "Transfusion-Reactive Antibody-Linked Infection", "Transfusion-Responsive Acute Lymphocyte Inhibition"], correct: 1, rationale: "TRALI = Transfusion-Related Acute Lung Injury. It is a non-cardiogenic pulmonary edema caused by donor antibodies activating neutrophils in the pulmonary vasculature, causing capillary damage and alveolar flooding." },
      { question: "TRALI must develop within what timeframe after transfusion?", options: ["30 minutes", "6 hours", "24 hours", "72 hours"], correct: 1, rationale: "TRALI is defined as acute lung injury developing within 6 hours of a blood transfusion, in the absence of other risk factors for ALI. Most cases present within 1-2 hours, but the 6-hour window is the diagnostic criterion." }
    ],
    postTest: [
      { question: "A nurse is educating a colleague about the difference between TRALI and TACO. Which statement is CORRECT?", options: ["TRALI and TACO are both treated with diuretics", "TRALI has hypertension while TACO has hypotension", "TRALI is a permeability problem; TACO is a volume problem", "TRALI has elevated BNP while TACO has normal BNP"], correct: 2, rationale: "TRALI is a capillary PERMEABILITY problem (leaky lung capillaries from neutrophil-mediated damage), while TACO is a VOLUME problem (too much fluid for the heart to handle). This fundamental pathophysiologic difference explains all the clinical differences: TRALI has normal BNP/hypotension (heart is fine), TACO has elevated BNP/hypertension (heart is overloaded). Diuretics help TACO (remove excess volume) but are contraindicated in TRALI." },
      { question: "Most cases of TRALI resolve within:", options: ["6-12 hours", "48-96 hours with supportive care", "1-2 weeks requiring prolonged ventilation", "TRALI is permanent lung damage"], correct: 1, rationale: "Most TRALI cases resolve within 48-96 hours with supportive care as the damaged pulmonary endothelium heals. This relatively rapid recovery differentiates TRALI from true ARDS, which typically has a more prolonged course. However, severe cases may require mechanical ventilation during the recovery period, and the mortality rate is 5-10%." }
    ]
  },

  "septic-transfusion-reaction": {
    title: "Septic Transfusion Reaction",
    cellular: {
      title: "Septic Transfusion Reactions",
      content: "Septic transfusion reactions occur when blood products contaminated with bacteria are transfused into a patient, introducing a massive bacterial inoculum directly into the bloodstream and causing fulminant sepsis. This is a direct infectious complication rather than an immune-mediated reaction, and it can progress to septic shock and death within hours.\n\nBacterial contamination of blood products can occur at multiple points: during phlebotomy (skin flora introduced through the venipuncture site), during processing and storage (break in sterile technique), or from asymptomatic donor bacteremia. The type of contaminating organism depends on the blood product and its storage conditions.\n\nPlatelet concentrates carry the highest risk of bacterial contamination because they are stored at room temperature (20-24 degrees Celsius) for up to 5-7 days. This warm environment is ideal for bacterial growth. The most common organisms in contaminated platelets are gram-positive skin flora (Staphylococcus species, Streptococcus species) from the phlebotomy site, as well as gram-negative organisms (Serratia, Klebsiella, Pseudomonas) that can proliferate to dangerously high concentrations in the warm, nutrient-rich environment.\n\nPacked red blood cells, stored at 1-6 degrees Celsius, are less commonly contaminated but when they are, the organisms are typically cold-tolerant gram-negative bacteria, particularly Yersinia enterocolitica, Pseudomonas fluorescens, and Serratia marcescens. These psychrophilic organisms can grow at refrigerator temperatures and may reach high concentrations in older units near the end of their 42-day shelf life.\n\nWhen contaminated blood is transfused, the patient receives a massive intravascular bacterial load along with pre-formed bacterial endotoxins (from gram-negative organisms) or exotoxins (from gram-positive organisms). Endotoxin (lipopolysaccharide) triggers the systemic inflammatory response through activation of toll-like receptors on monocytes and macrophages, causing a cytokine storm with massive release of TNF-alpha, IL-1, and IL-6. This produces high fever (often >2 degrees C above baseline), severe rigors, tachycardia, hypotension, and if untreated, progresses rapidly to septic shock with multi-organ failure.\n\nPrevention relies on meticulous skin preparation during phlebotomy, diversion of the initial blood draw (which contains the highest concentration of skin flora), bacterial screening of platelet products, visual inspection of all products before transfusion, and adherence to maximum storage times."
    },
    riskFactors: [
      "Platelet transfusions (room temperature storage promotes bacterial growth - highest risk product)",
      "Older blood products near maximum storage time (longer time for bacteria to multiply)",
      "Break in sterile technique during blood collection or processing",
      "Inadequate skin preparation at phlebotomy site (skin flora introduction)",
      "Pooled platelet products (multiple donors = more contamination opportunities)",
      "Storage without bacterial detection screening",
      "Donor with asymptomatic bacteremia at time of donation",
      "Immunocompromised recipients (cannot mount adequate immune response to control bacteria)",
      "Failure to visually inspect blood product before administration"
    ],
    diagnostics: [
      "Blood cultures from BOTH the patient AND the blood product bag (essential for diagnosis)",
      "Vital signs: high fever (often >40 degrees C), severe tachycardia, hypotension",
      "CBC with differential: WBC may initially be elevated or paradoxically low in overwhelming sepsis",
      "Lactic acid: elevated indicating tissue hypoperfusion",
      "Procalcitonin: elevated (helps differentiate septic from other transfusion reactions)",
      "Coagulation studies: PT/INR, aPTT, fibrinogen, D-dimer (DIC may develop)",
      "Comprehensive metabolic panel: assess renal and hepatic function",
      "Visual inspection of blood bag: look for discoloration, clots, turbidity, gas bubbles",
      "Gram stain of blood product residual for rapid preliminary identification",
      "Urinalysis: differentiate from hemolytic reaction (no hemoglobinuria in septic reaction)"
    ],
    management: [
      "STOP the transfusion IMMEDIATELY",
      "Initiate aggressive IV fluid resuscitation with normal saline (30 mL/kg bolus within first hour)",
      "Draw blood cultures from patient (2 sets from 2 different sites) BEFORE starting antibiotics",
      "Culture the blood product bag and remaining contents",
      "Start broad-spectrum IV antibiotics within 1 hour of recognition (sepsis bundle)",
      "Save the blood bag, tubing, and all labels for the blood bank investigation",
      "Vasopressor support (norepinephrine) if hypotension persists despite fluid resuscitation",
      "Monitor for DIC: may need FFP, cryoprecipitate, or platelets",
      "Transfer to ICU for hemodynamic monitoring and aggressive management",
      "Notify the blood bank immediately - remaining products from the same donation must be quarantined"
    ],
    nursingActions: [
      "Visually inspect EVERY blood product before administration: check for discoloration, cloudiness, clots, gas bubbles",
      "Verify expiration date and that storage conditions were maintained",
      "Stop transfusion immediately at first sign of severe systemic reaction",
      "Obtain blood cultures from patient before antibiotics are started (do not delay antibiotics >1 hour)",
      "Administer prescribed broad-spectrum antibiotics as rapidly as possible",
      "Monitor hemodynamic status continuously: BP, HR, MAP, urine output",
      "Initiate IV fluid resuscitation per sepsis protocol",
      "Assess for signs of septic shock: cool/mottled extremities, altered mental status, oliguria",
      "Document timeline meticulously: transfusion start, symptom onset, cultures drawn, antibiotics given",
      "Notify blood bank for donor tracing and quarantine of related products"
    ],
    signs: {
      left: [
        "High fever: often >40 degrees C (>104 degrees F) or >2 degrees C above baseline",
        "Severe rigors and chills (shaking chills more severe than FNHTR)",
        "Tachycardia (heart rate >100, often >120 bpm)",
        "Hypotension (systolic BP <90 or MAP <65)"
      ],
      right: [
        "Nausea, vomiting, and abdominal pain",
        "Altered mental status (confusion, agitation, lethargy)",
        "Warm, flushed skin initially (vasodilation), then cool/mottled in late shock",
        "Oliguria or anuria (renal hypoperfusion)",
        "Blood product may appear discolored, cloudy, or have gas bubbles",
        "Onset can be within minutes to hours of starting transfusion"
      ]
    },
    medications: [
      { name: "Piperacillin-Tazobactam (Zosyn) or Meropenem", type: "Broad-Spectrum Antibiotic", action: "Covers both gram-positive and gram-negative organisms including Pseudomonas. Essential to cover the spectrum of organisms that can contaminate blood products", sideEffects: "GI upset, allergic reactions, C. difficile risk, seizures (meropenem in renal impairment)", contra: "Known severe allergy (use alternative broad-spectrum agent)", pearl: "Must be started within 1 HOUR of recognizing sepsis (per Surviving Sepsis Campaign guidelines). Each hour of delay in antibiotics increases mortality by approximately 7-8%. Draw cultures first but do NOT delay antibiotics beyond 1 hour waiting for culture results." },
      { name: "Vancomycin", type: "Glycopeptide Antibiotic", action: "Covers gram-positive organisms including MRSA and coagulase-negative Staphylococci, which are common skin flora contaminants in blood products", sideEffects: "Red man syndrome (with rapid infusion), nephrotoxicity, ototoxicity", contra: "Known vancomycin allergy", pearl: "Added to gram-negative coverage for empiric broad-spectrum therapy because skin flora (Staph species) are the most common contaminants in platelet products. Infuse over 60 minutes minimum to prevent red man syndrome." },
      { name: "Norepinephrine (Levophed)", type: "Vasopressor", action: "Alpha-1 agonist that increases systemic vascular resistance and blood pressure in septic shock when fluids alone are insufficient", sideEffects: "Peripheral ischemia, tachyarrhythmias, tissue necrosis with extravasation", contra: "Uncorrected hypovolemia (give fluids first)", pearl: "First-line vasopressor for septic shock per Surviving Sepsis Campaign. Start if MAP remains <65 mmHg despite initial fluid resuscitation (30 mL/kg crystalloid). Titrate to target MAP >65 mmHg. Central line preferred but peripheral administration acceptable in emergency." },
      { name: "Normal Saline", type: "Isotonic Crystalloid", action: "Volume resuscitation to restore intravascular volume depleted by sepsis-induced vasodilation and capillary leak", sideEffects: "Hyperchloremic metabolic acidosis with large volumes, fluid overload", contra: "None in acute sepsis (monitor for signs of fluid overload)", pearl: "Give 30 mL/kg within the first 1-3 hours as per sepsis bundle. This is approximately 2-3 liters for an average adult. Reassess after each liter bolus. Balanced crystalloids (LR or Plasmalyte) may be preferred over NS for large-volume resuscitation to avoid hyperchloremic acidosis." }
    ],
    pearls: [
      "Platelet products carry the HIGHEST risk of bacterial contamination because of room temperature storage",
      "Visually inspect EVERY blood product before hanging: discoloration, cloudiness, clots, or gas bubbles = do NOT transfuse",
      "Septic reaction can mimic AHTR (both cause fever, rigors, hypotension) - blood cultures differentiate",
      "Start antibiotics within 1 HOUR of recognizing sepsis - each hour of delay increases mortality by 7-8%",
      "Draw blood cultures BEFORE antibiotics, but do NOT delay antibiotics beyond 1 hour to obtain cultures",
      "Yersinia enterocolitica is the classic cold-growing organism that contaminates stored RBCs",
      "The initial phlebotomy site skin prep is the most important contamination prevention step",
      "Diversion of the first 20-30 mL of collected blood (which contains the most skin flora) reduces contamination",
      "Gram-negative organisms produce endotoxin which causes a more severe systemic inflammatory response",
      "Notify the blood bank immediately so remaining products from the same donation can be quarantined"
    ],
    quiz: [
      { question: "Which blood product carries the HIGHEST risk of bacterial contamination?", options: ["Fresh frozen plasma", "Cryoprecipitate", "Packed red blood cells", "Platelet concentrates"], correct: 3, rationale: "Platelet concentrates have the highest risk because they are stored at room temperature (20-24 degrees C) for up to 5-7 days. This warm environment promotes bacterial growth. RBCs are stored at 1-6 degrees C which inhibits most bacteria. FFP and cryo are stored frozen, which kills most organisms." },
      { question: "A patient develops a temperature of 40.5 degrees C, severe rigors, and BP 78/42 during a platelet transfusion. After stopping the transfusion, the nurse should PRIORITIZE:", options: ["Administering acetaminophen for fever", "Drawing blood cultures and starting broad-spectrum antibiotics within 1 hour", "Administering diphenhydramine for allergic reaction", "Ordering a BNP level"], correct: 1, rationale: "This presentation (very high fever >40C, severe rigors, hypotension during platelet transfusion) strongly suggests septic transfusion reaction. The priority is blood cultures followed immediately by broad-spectrum IV antibiotics within 1 hour, along with aggressive IV fluid resuscitation (sepsis bundle). Acetaminophen treats the symptom but not the cause. This is not an allergic reaction. BNP differentiates TACO from TRALI, not sepsis." },
      { question: "Before hanging a blood product, the nurse notices the unit appears cloudy with small dark clots. The appropriate action is:", options: ["Warm the product and proceed with transfusion", "Filter the clots through the blood administration set", "DO NOT transfuse - return to blood bank and report findings", "Shake the bag vigorously to redistribute contents"], correct: 2, rationale: "Any abnormal appearance of a blood product (cloudiness, discoloration, clots, gas bubbles) suggests bacterial contamination and the product must NOT be transfused. Return it to the blood bank immediately and document the findings. Never attempt to filter clots or warm a suspicious product. Visual inspection is a critical safety step that occurs before every transfusion." },
      { question: "Which organism is classically associated with bacterial contamination of stored packed red blood cells?", options: ["Staphylococcus aureus", "Escherichia coli", "Yersinia enterocolitica", "Streptococcus pyogenes"], correct: 2, rationale: "Yersinia enterocolitica is the classic organism that contaminates stored RBCs because it is a psychrophilic (cold-loving) bacterium that can grow at the 1-6 degrees C storage temperature of RBCs. It can reach dangerously high concentrations in older units near the end of their 42-day shelf life. Staph and Strep are skin flora that more commonly contaminate room-temperature-stored platelets." },
      { question: "The Surviving Sepsis Campaign recommends starting antibiotics within what timeframe of recognizing sepsis?", options: ["30 minutes", "1 hour", "3 hours", "6 hours"], correct: 1, rationale: "Broad-spectrum antibiotics should be started within 1 hour of recognizing sepsis. Each hour of delay in antibiotic administration is associated with approximately 7-8% increase in mortality. Blood cultures should ideally be drawn before antibiotics, but antibiotics should never be delayed beyond 1 hour waiting for cultures." }
    ],
    preTest: [
      { question: "Why do platelet products have the highest risk of bacterial contamination?", options: ["They contain no preservatives", "They are stored at room temperature, promoting bacterial growth", "They are collected from multiple donors", "They have a 42-day shelf life"], correct: 1, rationale: "Platelets are stored at room temperature (20-24 degrees C) because refrigeration activates and damages platelets. However, this warm storage temperature is ideal for bacterial growth. Combined with a 5-7 day shelf life, bacteria introduced during collection can multiply to dangerous levels. RBCs are stored cold (1-6 degrees C) which inhibits most organisms." },
      { question: "What visual finding on a blood product bag should prevent the nurse from starting a transfusion?", options: ["The bag is cold", "The bag has a barcode label", "The bag contents appear cloudy, discolored, or have gas bubbles", "The bag is a different color than previous units"], correct: 2, rationale: "Cloudiness, discoloration, unusual color changes, gas bubbles (from bacterial metabolism), and clots in a blood product are all signs of possible bacterial contamination. The product should NOT be transfused and must be returned to the blood bank. Visual inspection is a required safety check before every transfusion." }
    ],
    postTest: [
      { question: "A nurse suspects a septic transfusion reaction. She has drawn blood cultures and the provider has ordered antibiotics. What else must the nurse do?", options: ["Discard the blood bag in biohazard waste", "Culture the remaining blood in the bag and send it to the blood bank", "Send the bag to pathology for analysis", "Reattach the bag to confirm the diagnosis"], correct: 1, rationale: "The blood product bag and remaining contents must be cultured AND sent to the blood bank for investigation. The blood bank needs to quarantine any remaining products from the same donation, trace the donor, and investigate the source of contamination. Never discard a blood bag after a suspected reaction - it is essential evidence. Never reattach a suspected contaminated product." },
      { question: "How does a septic transfusion reaction differ from a febrile non-hemolytic reaction?", options: ["They present identically and cannot be differentiated clinically", "Septic reactions have much higher fever (>40C), hypotension, and rapid deterioration; FNHTR has mild fever with stable vitals", "FNHTR always requires antibiotics", "Septic reactions only occur with RBC transfusions"], correct: 1, rationale: "While both cause fever, the severity is dramatically different. Septic reactions produce very high fevers (often >40 degrees C, >2 degrees C above baseline), severe rigors, hypotension, and rapid clinical deterioration toward shock. FNHTR causes mild-moderate fever (>1 degree C above baseline) with stable blood pressure and no signs of systemic toxicity. The distinction is critical because septic reactions require immediate antibiotics and ICU care." }
    ]
  }
};
