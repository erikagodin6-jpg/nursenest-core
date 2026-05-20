import type { LessonContent } from "./types";

export const pharmacologyInfectiousPsychLessons: Record<string, LessonContent> = {
  "pharm-infectious-disease": {
    title: "Infectious Disease Pharmacology",
    cellular: {
      title: "Mechanisms of Antimicrobial Action",
      content: "Antimicrobial agents target specific structures or metabolic pathways unique to microorganisms. Antibiotics may be bactericidal (killing bacteria directly) or bacteriostatic (inhibiting growth), and their mechanisms include cell wall synthesis inhibition (beta-lactams, vancomycin), protein synthesis inhibition (macrolides, tetracyclines, aminoglycosides), nucleic acid synthesis inhibition (fluoroquinolones, rifampin), and folate synthesis inhibition (sulfonamides, trimethoprim). Antivirals interfere with viral replication at various stages including entry, nucleic acid synthesis, and assembly. Antifungals target ergosterol in fungal cell membranes (azoles) or beta-glucan in cell walls (echinocandins), exploiting differences between fungal and human cell biology."
    },
    riskFactors: [
      "Immunocompromised status (HIV, chemotherapy, transplant recipients)",
      "Recent antibiotic use predisposing to resistant organisms or C. difficile",
      "Hospitalization and invasive devices (central lines, urinary catheters)",
      "Travel to endemic areas (tuberculosis, malaria)",
      "Renal or hepatic impairment requiring dose adjustments",
      "Drug allergies especially beta-lactam cross-reactivity",
      "Extremes of age affecting drug metabolism and susceptibility"
    ],
    diagnostics: [
      "Culture and sensitivity testing before initiating antibiotics when possible",
      "Vancomycin trough levels drawn 30 minutes before 4th dose (target 15-20 mcg/mL for serious infections)",
      "Peak and trough aminoglycoside levels to prevent ototoxicity and nephrotoxicity",
      "CBC with differential to monitor for bone marrow suppression",
      "Hepatic function panels for antitubercular and antifungal therapy",
      "HIV viral load and CD4 count for antiretroviral monitoring",
      "Renal function (BUN, creatinine) for nephrotoxic agents"
    ],
    management: [
      "Obtain cultures before starting empiric antibiotic therapy",
      "De-escalate from broad-spectrum to narrow-spectrum based on sensitivity results",
      "Complete full antibiotic course to prevent resistance development",
      "Monitor for superinfection including oral candidiasis and C. difficile",
      "Adjust doses for renal and hepatic impairment",
      "Assess for drug interactions especially with antiretrovirals and antifungals",
      "Implement antimicrobial stewardship principles"
    ],
    nursingActions: [
      "Infuse vancomycin over at least 60 minutes to prevent red man syndrome",
      "Monitor for allergic reactions especially with first doses of beta-lactams",
      "Assess renal function before and during aminoglycoside therapy",
      "Educate patients on RIPE therapy adherence and hepatotoxicity signs",
      "Teach patients taking doxycycline to avoid dairy, antacids, and sun exposure",
      "Monitor for signs of C. difficile (watery diarrhea, abdominal cramping)",
      "Ensure adequate hydration with acyclovir to prevent crystalluria"
    ],
    signs: {
      left: [
        "Therapeutic response: fever resolution, decreasing WBC, improving cultures",
        "Red man syndrome: flushing, erythema of upper body with rapid vancomycin infusion",
        "Drug allergy: urticaria, rash, angioedema, anaphylaxis",
        "Ototoxicity: tinnitus, hearing loss, vertigo (aminoglycosides)",
        "Hepatotoxicity: jaundice, elevated AST/ALT, dark urine (isoniazid, rifampin)"
      ],
      right: [
        "Nephrotoxicity: rising creatinine, decreased urine output (vancomycin, aminoglycosides)",
        "Superinfection: oral thrush, vaginal candidiasis, C. difficile diarrhea",
        "Peripheral neuropathy: numbness and tingling in extremities (isoniazid)",
        "Tendon rupture risk: tendon pain, swelling (fluoroquinolones)",
        "Bone marrow suppression: leukopenia, thrombocytopenia (TMP-SMX, linezolid)"
      ]
    },
    medications: [
      {
        name: "Amoxicillin / Ampicillin / Piperacillin-Tazobactam",
        type: "Penicillin (Beta-Lactam Antibiotic)",
        action: "Inhibits bacterial cell wall synthesis by binding penicillin-binding proteins. Piperacillin-tazobactam adds beta-lactamase inhibitor for broader coverage including Pseudomonas.",
        sideEffects: "Diarrhea, nausea, rash (maculopapular rash common with ampicillin in EBV infection), allergic reactions including anaphylaxis",
        contra: "Known penicillin allergy with anaphylaxis history. Use caution with cephalosporin cross-reactivity (approximately 1-2%).",
        pearl: "Always ask about penicillin allergy severity before administering any beta-lactam. Amoxicillin is first-line for otitis media and strep pharyngitis. Piperacillin-tazobactam covers gram-negative including Pseudomonas and anaerobes."
      },
      {
        name: "Cephalexin (1st gen) / Ceftriaxone (3rd gen) / Cefepime (4th gen)",
        type: "Cephalosporin (Beta-Lactam Antibiotic)",
        action: "Inhibits cell wall synthesis similarly to penicillins. Spectrum broadens with each generation: 1st gen covers gram-positive, 3rd gen adds gram-negative and CNS penetration, 4th gen adds Pseudomonas coverage.",
        sideEffects: "GI upset, hypersensitivity reactions, disulfiram-like reaction with alcohol (cefotetan, cefoperazone), vitamin K deficiency with prolonged use",
        contra: "Severe penicillin allergy (anaphylaxis). Ceftriaxone contraindicated in neonates receiving calcium-containing IV solutions due to fatal precipitation.",
        pearl: "Ceftriaxone is the drug of choice for bacterial meningitis, gonorrhea, and community-acquired pneumonia requiring hospitalization. 1st generation cephalosporins are first-line surgical prophylaxis."
      },
      {
        name: "Meropenem",
        type: "Carbapenem (Beta-Lactam Antibiotic)",
        action: "Broad-spectrum beta-lactam that resists most beta-lactamases. Covers gram-positive, gram-negative including Pseudomonas, and anaerobes. Reserved for multidrug-resistant infections.",
        sideEffects: "Seizures (especially imipenem), nausea, diarrhea, rash, thrombocytopenia, C. difficile colitis",
        contra: "Severe beta-lactam allergy. Imipenem-cilastatin has higher seizure risk than meropenem.",
        pearl: "Carbapenems are last-resort antibiotics for ESBL-producing organisms. Carbapenem-resistant Enterobacteriaceae (CRE) are considered urgent threats. Meropenem preferred over imipenem for CNS infections due to lower seizure risk."
      },
      {
        name: "Azithromycin",
        type: "Macrolide Antibiotic",
        action: "Inhibits bacterial protein synthesis by binding the 50S ribosomal subunit. Bacteriostatic. Covers atypical organisms (Mycoplasma, Chlamydia, Legionella) and some gram-positives.",
        sideEffects: "GI distress (nausea, diarrhea, abdominal pain), QT prolongation, hepatotoxicity, ototoxicity at high doses",
        contra: "History of cholestatic jaundice with prior macrolide use. Caution with QT-prolonging drugs. Avoid with statins due to rhabdomyolysis risk.",
        pearl: "Azithromycin is first-line for community-acquired pneumonia in outpatients and is used for Chlamydia treatment. The Z-pack (5-day course) maintains tissue levels for 10 days due to long half-life."
      },
      {
        name: "Ciprofloxacin / Levofloxacin",
        type: "Fluoroquinolone Antibiotic",
        action: "Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication. Broad-spectrum covering gram-negatives; levofloxacin adds respiratory pathogen coverage.",
        sideEffects: "Tendon rupture (especially Achilles), peripheral neuropathy, QT prolongation, CNS effects (dizziness, confusion), aortic dissection risk, photosensitivity",
        contra: "FDA BLACK BOX WARNING: Risk of tendinitis, tendon rupture, peripheral neuropathy, and CNS effects. Avoid in myasthenia gravis (may worsen weakness). Contraindicated in children (cartilage damage) except specific indications.",
        pearl: "Fluoroquinolones should be reserved when no other options exist due to serious adverse effects. Ciprofloxacin is first-line for anthrax prophylaxis. Avoid concurrent use with cations (calcium, magnesium, aluminum) as they chelate the drug."
      },
      {
        name: "Doxycycline",
        type: "Tetracycline Antibiotic",
        action: "Inhibits bacterial protein synthesis by binding the 30S ribosomal subunit. Bacteriostatic. Covers atypicals, spirochetes (Lyme disease), Rickettsia, and some MRSA.",
        sideEffects: "Photosensitivity, GI upset, esophageal ulceration (take upright with full glass of water), tooth discoloration in children under 8",
        contra: "Pregnancy (category D - crosses placenta, causes tooth discoloration and bone growth inhibition in fetus). Children under 8 years except for life-threatening infections like Rocky Mountain spotted fever.",
        pearl: "Take doxycycline with a full glass of water and remain upright for 30 minutes. Avoid dairy products, antacids, and iron supplements within 2 hours as they reduce absorption. First-line for Lyme disease, RMSF, and acne."
      },
      {
        name: "Trimethoprim-Sulfamethoxazole (TMP-SMX / Bactrim)",
        type: "Sulfonamide / Folate Antagonist",
        action: "Inhibits sequential steps in bacterial folate synthesis pathway. Synergistic combination that is bactericidal. Covers common urinary pathogens, MRSA (skin infections), and Pneumocystis jirovecii.",
        sideEffects: "Rash (including Stevens-Johnson syndrome), bone marrow suppression, hyperkalemia, crystalluria, photosensitivity, hemolytic anemia in G6PD deficiency",
        contra: "Sulfa allergy, pregnancy (first trimester - neural tube defects; third trimester - kernicterus), severe renal impairment, G6PD deficiency.",
        pearl: "First-line prophylaxis for Pneumocystis jirovecii pneumonia in immunocompromised patients (CD4 < 200). Encourage fluid intake to prevent crystalluria. Monitor potassium levels as TMP can cause hyperkalemia."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors. Bactericidal against gram-positive organisms including MRSA. Oral form used specifically for C. difficile colitis.",
        sideEffects: "Red man syndrome (histamine-mediated flushing with rapid infusion), nephrotoxicity, ototoxicity, thrombocytopenia, phlebitis at IV site",
        contra: "Known hypersensitivity. Use with caution in renal impairment. Avoid rapid infusion (minimum 60 minutes per gram).",
        pearl: "Red man syndrome is NOT a true allergy - slow the infusion rate and premedicate with diphenhydramine. Trough levels drawn 30 minutes before 4th or 5th dose. Target trough 15-20 mcg/mL for serious infections (bacteremia, endocarditis, osteomyelitis). IV vancomycin does NOT treat C. difficile - must give oral or rectal."
      },
      {
        name: "Acyclovir / Valacyclovir",
        type: "Antiviral (Nucleoside Analog)",
        action: "Selectively phosphorylated by viral thymidine kinase, then inhibits viral DNA polymerase. Active against herpes simplex virus (HSV-1, HSV-2), varicella-zoster virus (VZV), and to a lesser extent Epstein-Barr virus.",
        sideEffects: "Nephrotoxicity (crystal nephropathy), neurotoxicity (tremors, confusion at high doses), nausea, headache, thrombotic thrombocytopenic purpura (valacyclovir at high doses)",
        contra: "Renal impairment requires dose adjustment. Ensure adequate hydration to prevent crystalluria.",
        pearl: "Valacyclovir is the oral prodrug of acyclovir with better bioavailability. IV acyclovir requires aggressive hydration (at least 1 L before and during infusion). Treatment must begin within 72 hours of zoster rash onset for maximum benefit."
      },
      {
        name: "Antiretrovirals (NRTI, NNRTI, PI, INSTI classes)",
        type: "Antiviral - HIV Antiretroviral Therapy",
        action: "NRTIs (tenofovir, emtricitabine) inhibit reverse transcriptase as nucleoside analogs. NNRTIs (efavirenz) bind reverse transcriptase allosterically. PIs (atazanavir) block protease enzyme. INSTIs (dolutegravir, bictegravir) block integrase. Combination therapy (ART) targets multiple replication steps.",
        sideEffects: "NRTIs: lactic acidosis, lipodystrophy, renal toxicity (tenofovir). NNRTIs: vivid dreams, hepatotoxicity, rash. PIs: metabolic syndrome, GI upset, drug interactions via CYP3A4. INSTIs: generally well-tolerated, insomnia, weight gain.",
        contra: "Multiple drug interactions especially PIs (CYP3A4 inhibitors). NNRTIs have high resistance barrier concerns. Tenofovir disoproxil contraindicated in renal failure.",
        pearl: "ART is always combination therapy (at least 2-3 drugs from different classes) to prevent resistance. INSTIs are now preferred first-line backbone. Adherence must exceed 95% to prevent viral resistance. Monitor viral load and CD4 count regularly."
      },
      {
        name: "Fluconazole",
        type: "Azole Antifungal",
        action: "Inhibits fungal cytochrome P450 enzyme lanosterol 14-alpha-demethylase, blocking ergosterol synthesis in fungal cell membranes. Fungistatic. Good CNS penetration for cryptococcal meningitis.",
        sideEffects: "Hepatotoxicity, QT prolongation, GI upset, rash, Stevens-Johnson syndrome (rare). Multiple drug interactions via CYP450 inhibition.",
        contra: "Concurrent use with QT-prolonging drugs. Pregnancy (teratogenic). Hepatic impairment.",
        pearl: "Fluconazole is first-line for most Candida infections and cryptococcal meningitis maintenance therapy. It has excellent oral bioavailability (equal to IV). Significant CYP450 inhibitor affecting warfarin, phenytoin, and cyclosporine levels."
      },
      {
        name: "Caspofungin",
        type: "Echinocandin Antifungal",
        action: "Inhibits synthesis of beta-(1,3)-D-glucan, an essential component of the fungal cell wall. Fungicidal against Candida species, fungistatic against Aspergillus. No activity against Cryptococcus.",
        sideEffects: "Histamine-related reactions (flushing, rash), hepatotoxicity, fever, phlebitis at infusion site, hypokalemia",
        contra: "Known hypersensitivity. Dose adjustment needed with hepatic impairment. Not effective against Cryptococcus or Mucor.",
        pearl: "Echinocandins are first-line for invasive candidiasis and candidemia. They have minimal drug interactions compared to azoles. IV only - no oral formulation available. Safe in renal impairment without dose adjustment."
      },
      {
        name: "RIPE Therapy (Rifampin, Isoniazid, Pyrazinamide, Ethambutol)",
        type: "Antitubercular Combination Therapy",
        action: "Rifampin inhibits RNA polymerase. Isoniazid inhibits mycolic acid synthesis (bactericidal to actively growing TB). Pyrazinamide disrupts membrane transport in acidic environments. Ethambutol inhibits arabinosyl transferase (cell wall synthesis). Four-drug combination for initial 2 months, then INH and rifampin for 4 more months.",
        sideEffects: "Rifampin: orange discoloration of body fluids, hepatotoxicity, potent CYP450 inducer. Isoniazid: peripheral neuropathy (give pyridoxine/B6), hepatotoxicity. Pyrazinamide: hepatotoxicity, hyperuricemia. Ethambutol: optic neuritis (red-green color discrimination loss).",
        contra: "Active hepatic disease (relative). Ethambutol avoided in young children who cannot report visual changes. Rifampin reduces effectiveness of oral contraceptives, warfarin, and many other drugs.",
        pearl: "All four RIPE drugs are hepatotoxic - monitor LFTs monthly. Give pyridoxine (vitamin B6) with isoniazid to prevent peripheral neuropathy. Rifampin turns urine, tears, sweat, and saliva orange (warn patients - does not stain contact lenses permanently but avoid soft lenses). Directly observed therapy (DOT) is standard of care for TB treatment adherence."
      },
      {
        name: "Erythromycin",
        type: "Macrolide Antibiotic",
        action: "Inhibits bacterial protein synthesis by binding the 50S ribosomal subunit. Bacteriostatic. Also has prokinetic effects by acting as a motilin receptor agonist in the GI tract.",
        sideEffects: "GI distress (nausea, vomiting, diarrhea, abdominal cramping - most common), QT prolongation, hepatotoxicity (cholestatic jaundice), ototoxicity at high doses, phlebitis with IV administration",
        contra: "Concurrent use with QT-prolonging drugs, hepatic dysfunction, concurrent use with statins (increased rhabdomyolysis risk via CYP3A4 inhibition), concurrent cisapride or pimozide use",
        pearl: "Erythromycin is a potent CYP3A4 inhibitor with numerous drug interactions (increases levels of warfarin, theophylline, carbamazepine, statins). Used off-label as a prokinetic agent for gastroparesis. IV erythromycin requires slow infusion to reduce phlebitis risk. Often replaced by azithromycin due to fewer GI side effects and drug interactions."
      },
      {
        name: "Botulism Immune Globulin (BIG-IV / BabyBIG)",
        type: "Human-Derived Immunoglobulin (Passive Immunization)",
        action: "Provides preformed antibodies against botulinum toxin types A and B, neutralizing circulating toxin before it binds irreversibly to neuromuscular junctions",
        sideEffects: "Infusion reactions (flushing, chills, fever), rash, mild blood pressure changes, anaphylaxis (rare)",
        contra: "Known hypersensitivity to human immunoglobulin products, IgA deficiency with anti-IgA antibodies (anaphylaxis risk)",
        pearl: "BabyBIG is specifically indicated for infant botulism (under 1 year of age) caused by Clostridium botulinum types A and B. Must be administered as early as possible for maximum benefit. Reduces hospital stay and duration of mechanical ventilation. Very expensive and obtained through the California Department of Public Health. Adult botulism is treated with heptavalent botulism antitoxin (HBAT) instead."
      }
    ],
    pearls: [
      "Always obtain cultures BEFORE starting antibiotics, but do not delay treatment in sepsis while awaiting results.",
      "Red man syndrome from vancomycin is a histamine reaction, not a true allergy. Slow the infusion rate and premedicate with antihistamines.",
      "Fluoroquinolones carry FDA black box warnings for tendon rupture, peripheral neuropathy, and CNS effects - reserve for infections with no safer alternative.",
      "RIPE therapy mnemonic: Rifampin (Red body fluids), Isoniazid (Inject B6/pyridoxine to prevent neuropathy), Pyrazinamide (Painful joints from hyperuricemia), Ethambutol (Eyes - optic neuritis).",
      "Cross-reactivity between penicillins and cephalosporins is approximately 1-2%, not the historically cited 10%. Carbapenems can generally be used safely in penicillin-allergic patients.",
      "Oral vancomycin treats C. difficile colitis; IV vancomycin does NOT reach therapeutic levels in the gut lumen."
    ],
    quiz: [
      {
        question: "A patient receiving vancomycin IV develops flushing and erythema of the face, neck, and upper torso during the infusion. What is the priority nursing action?",
        options: [
          "Stop the infusion permanently and document allergy",
          "Slow the infusion rate and notify the provider",
          "Administer epinephrine immediately",
          "Increase the IV fluid rate to dilute the medication"
        ],
        correct: 1,
        rationale: "Red man syndrome is a histamine-mediated reaction caused by rapid vancomycin infusion, not a true allergy. The priority action is to slow or temporarily stop the infusion and notify the provider. Premedication with diphenhydramine and extending infusion time (minimum 60 minutes per gram) typically prevents recurrence."
      },
      {
        question: "A patient starting isoniazid (INH) for latent tuberculosis asks why pyridoxine (vitamin B6) was also prescribed. What is the correct explanation?",
        options: [
          "Pyridoxine enhances the bactericidal activity of isoniazid against Mycobacterium tuberculosis",
          "Pyridoxine prevents isoniazid-induced peripheral neuropathy by replacing depleted vitamin B6",
          "Pyridoxine reduces the hepatotoxic effects of isoniazid on the liver",
          "Pyridoxine prevents the orange discoloration of body fluids caused by tuberculosis medications"
        ],
        correct: 1,
        rationale: "Isoniazid interferes with pyridoxine (vitamin B6) metabolism, leading to peripheral neuropathy manifested as numbness and tingling in the extremities. Supplemental pyridoxine (25-50 mg daily) prevents this adverse effect. Orange body fluids are caused by rifampin, not isoniazid."
      },
      {
        question: "Which antibiotic class carries an FDA black box warning for tendon rupture and should be avoided in patients with myasthenia gravis?",
        options: [
          "Macrolides",
          "Cephalosporins",
          "Fluoroquinolones",
          "Carbapenems"
        ],
        correct: 2,
        rationale: "Fluoroquinolones (ciprofloxacin, levofloxacin) carry FDA black box warnings for tendinitis, tendon rupture (especially Achilles), peripheral neuropathy, and CNS effects. They are contraindicated in myasthenia gravis because they can worsen muscle weakness and cause respiratory failure."
      },
      {
        question: "A nurse is caring for a patient with MRSA bacteremia. The provider orders a vancomycin trough level. When should the nurse draw this level?",
        options: [
          "30 minutes after the first dose is completed",
          "Immediately before the first dose",
          "30 minutes before the fourth or fifth dose",
          "Two hours after the loading dose"
        ],
        correct: 2,
        rationale: "Vancomycin trough levels are drawn 30 minutes before the fourth or fifth dose to ensure steady-state has been achieved. For serious MRSA infections like bacteremia, the target trough is 15-20 mcg/mL. Drawing too early does not reflect steady-state drug levels."
      },
      {
        question: "A patient taking rifampin for tuberculosis calls the clinic concerned about red-orange urine. What is the appropriate nursing response?",
        options: [
          "Instruct the patient to stop rifampin and come to the emergency department immediately",
          "Advise the patient that this is a normal expected effect of rifampin and to continue the medication",
          "Tell the patient to increase fluid intake to flush the medication from the kidneys",
          "Recommend the patient take rifampin with antacids to reduce this side effect"
        ],
        correct: 1,
        rationale: "Rifampin causes harmless orange-red discoloration of urine, tears, sweat, and saliva. This is an expected pharmacological effect and does not indicate toxicity. Patients should be educated about this before starting therapy to prevent unnecessary alarm. Stopping the medication would compromise TB treatment."
      }
    ]
  },

  "pharm-psychiatric": {
    title: "Psychiatric Pharmacology",
    cellular: {
      title: "Neurotransmitter Modulation in Psychiatric",
      content: "Psychiatric medications work by modulating neurotransmitter systems in the central nervous system. Antidepressants primarily target serotonin, norepinephrine, and dopamine reuptake or metabolism to correct neurochemical imbalances associated with mood disorders. Antipsychotics block dopamine D2 receptors (typical) or modulate both dopamine and serotonin receptors (atypical) to reduce psychotic symptoms. Mood stabilizers like lithium affect multiple intracellular signaling pathways including inositol phosphate and glycogen synthase kinase-3 to stabilize neuronal membrane excitability. Understanding receptor pharmacology is essential because side effects directly correlate with receptor binding profiles - anticholinergic, antihistaminic, and anti-adrenergic effects produce predictable adverse reactions."
    },
    riskFactors: [
      "History of suicide attempts or suicidal ideation, especially in patients under 25 years of age",
      "Family history of psychiatric disorders or adverse medication reactions",
      "Concurrent substance use disorders complicating medication management",
      "Hepatic or renal impairment altering drug metabolism",
      "Polypharmacy increasing risk of serotonin syndrome or drug interactions",
      "Pregnancy and lactation requiring risk-benefit analysis for psychotropic use",
      "History of seizures lowering threshold with certain psychiatric medications"
    ],
    diagnostics: [
      "Lithium serum levels every 5-7 days during initiation (therapeutic range 0.6-1.2 mEq/L)",
      "Baseline and periodic thyroid function tests and renal function for lithium therapy",
      "Absolute neutrophil count (ANC) monitoring for clozapine (weekly for first 6 months, biweekly for months 6-12, then monthly)",
      "Valproate serum levels (therapeutic range 50-100 mcg/mL) and hepatic function",
      "Baseline ECG for medications with QT prolongation risk (typical antipsychotics, TCAs)",
      "Metabolic panel including fasting glucose and lipids for atypical antipsychotics",
      "Pregnancy testing before initiating teratogenic medications (valproate, lithium)"
    ],
    management: [
      "Educate patients that antidepressants require 2-6 weeks for full therapeutic effect",
      "BLACK BOX WARNING: All antidepressants carry increased risk of suicidal thinking in children, adolescents, and young adults under 25",
      "Taper psychiatric medications gradually to avoid discontinuation syndrome",
      "Monitor for serotonin syndrome: mental status changes, autonomic instability, neuromuscular hyperactivity",
      "Assess for neuroleptic malignant syndrome with antipsychotics: fever, rigidity, altered mental status, autonomic dysfunction",
      "Screen for metabolic syndrome quarterly with atypical antipsychotics",
      "Implement safety precautions for patients at risk of overdose (especially TCAs and lithium)"
    ],
    nursingActions: [
      "Assess suicidal ideation at every visit especially during first weeks of antidepressant therapy",
      "Monitor for extrapyramidal symptoms (EPS) with antipsychotic use: dystonia, akathisia, parkinsonism, tardive dyskinesia",
      "Educate patients on MAOI dietary restrictions (tyramine-containing foods: aged cheese, cured meats, draft beer, soy sauce)",
      "Hold lithium and notify provider if patient is dehydrated, has vomiting/diarrhea, or sodium-depleted",
      "Monitor for signs of lithium toxicity: coarse tremor, persistent vomiting, diarrhea, confusion, ataxia (levels > 1.5 mEq/L)",
      "Teach patients to avoid abrupt discontinuation of SSRIs/SNRIs (discontinuation syndrome: dizziness, electric shock sensations, irritability)",
      "Monitor ANC results for clozapine patients through REMS program before dispensing"
    ],
    signs: {
      left: [
        "Serotonin syndrome triad: mental status changes (agitation, confusion), autonomic instability (hyperthermia, tachycardia, diaphoresis), neuromuscular hyperactivity (clonus, hyperreflexia, tremor)",
        "Neuroleptic malignant syndrome (NMS): high fever (>104F), lead-pipe muscle rigidity, altered consciousness, autonomic dysfunction, elevated CK",
        "Extrapyramidal symptoms: acute dystonia (muscle spasms, torticollis), akathisia (restlessness), bradykinesia, cogwheel rigidity",
        "Tardive dyskinesia: involuntary choreiform movements of face, tongue, and extremities (often irreversible)",
        "Lithium toxicity early signs: fine tremor progressing to coarse tremor, nausea, vomiting, diarrhea, drowsiness"
      ],
      right: [
        "Tyramine crisis (MAOI + tyramine): severe hypertensive emergency, occipital headache, neck stiffness, nausea, potential stroke",
        "TCA toxicity triad: seizures, cardiac arrhythmias (widened QRS), altered mental status/coma",
        "Anticholinergic effects: dry mouth, constipation, urinary retention, blurred vision, tachycardia",
        "Metabolic syndrome from atypical antipsychotics: weight gain, hyperglycemia, dyslipidemia, increased waist circumference",
        "Agranulocytosis with clozapine: fever, sore throat, infection signs indicating dangerously low ANC"
      ]
    },
    medications: [
      {
        name: "Sertraline / Fluoxetine / Escitalopram",
        type: "SSRI (Selective Serotonin Reuptake Inhibitor)",
        action: "Selectively blocks the reuptake of serotonin at the presynaptic neuron, increasing serotonin availability in the synaptic cleft. First-line treatment for major depressive disorder, generalized anxiety disorder, panic disorder, OCD, and PTSD.",
        sideEffects: "Sexual dysfunction, GI upset (nausea, diarrhea), headache, insomnia or drowsiness, weight gain, hyponatremia (especially in elderly), increased bleeding risk. Serotonin syndrome when combined with other serotonergic agents.",
        contra: "Concurrent use with MAOIs (wait 14 days washout; 5 weeks for fluoxetine due to long half-life). BLACK BOX WARNING: increased suicidality in patients under 25 years old.",
        pearl: "Fluoxetine has the longest half-life (2-6 days; active metabolite 4-16 days), making it least likely to cause discontinuation syndrome. Sertraline is generally preferred in pregnancy. SSRIs take 2-6 weeks for full therapeutic effect - educate patients to continue despite initial lack of improvement."
      },
      {
        name: "Venlafaxine / Duloxetine",
        type: "SNRI (Serotonin-Norepinephrine Reuptake Inhibitor)",
        action: "Inhibits reuptake of both serotonin and norepinephrine, providing dual mechanism for depression and pain conditions. Duloxetine also approved for diabetic neuropathy, fibromyalgia, and chronic musculoskeletal pain.",
        sideEffects: "Similar to SSRIs plus dose-dependent hypertension (venlafaxine), increased heart rate, excessive sweating, severe discontinuation syndrome if stopped abruptly",
        contra: "Concurrent MAOI use. Uncontrolled hypertension (venlafaxine). Hepatic impairment (duloxetine is hepatotoxic). BLACK BOX WARNING for suicidality in youth.",
        pearl: "Venlafaxine must be tapered very slowly - has one of the worst discontinuation syndromes of all antidepressants. Monitor blood pressure regularly with venlafaxine, especially at higher doses. Duloxetine is useful when depression coexists with chronic pain conditions."
      },
      {
        name: "Amitriptyline",
        type: "TCA (Tricyclic Antidepressant)",
        action: "Blocks reuptake of serotonin and norepinephrine with additional anticholinergic, antihistaminic, and alpha-adrenergic blocking properties. Used for depression, neuropathic pain, migraine prophylaxis, and insomnia.",
        sideEffects: "Significant anticholinergic effects (dry mouth, constipation, urinary retention, blurred vision), orthostatic hypotension, sedation, weight gain, cardiac conduction delays (widened QRS), seizures in overdose",
        contra: "Recent MI, concurrent MAOI use, acute recovery phase of MI. Extremely dangerous in overdose - narrow therapeutic index. Avoid in elderly (Beers criteria) due to anticholinergic burden.",
        pearl: "TCA overdose is a medical emergency: sodium bicarbonate is the antidote for cardiac toxicity (QRS widening > 100 ms). The 3 Cs of TCA toxicity: Convulsions, Cardiac arrhythmias, Coma. Never prescribe more than a one-week supply to suicidal patients."
      },
      {
        name: "Phenelzine",
        type: "MAOI (Monoamine Oxidase Inhibitor)",
        action: "Irreversibly inhibits monoamine oxidase enzymes (MAO-A and MAO-B), preventing breakdown of serotonin, norepinephrine, and dopamine. Increases all three monoamine neurotransmitters. Reserved for treatment-resistant depression.",
        sideEffects: "Orthostatic hypotension, weight gain, sexual dysfunction, insomnia, peripheral edema. Life-threatening hypertensive crisis with tyramine-containing foods.",
        contra: "Tyramine-rich foods (aged cheese, cured meats, tap/draft beer, fermented foods, soy sauce). Concurrent use with SSRIs, SNRIs, meperidine, dextromethorphan, or sympathomimetics. Requires 14-day washout before or after other serotonergic drugs.",
        pearl: "Tyramine crisis can cause blood pressure > 180/120 with risk of intracranial hemorrhage. Patients must follow strict dietary restrictions. Phentolamine (alpha-blocker) is the emergency treatment for MAOI-induced hypertensive crisis. MAOIs are rarely used due to dangerous interactions but remain effective for atypical and treatment-resistant depression."
      },
      {
        name: "Bupropion / Mirtazapine / Trazodone",
        type: "Atypical Antidepressants",
        action: "Bupropion inhibits norepinephrine and dopamine reuptake (no serotonin effect). Mirtazapine blocks presynaptic alpha-2 receptors and 5-HT2/5-HT3 receptors. Trazodone is a serotonin antagonist and reuptake inhibitor (SARI) with strong sedative properties.",
        sideEffects: "Bupropion: seizures (dose-dependent), insomnia, dry mouth, no sexual dysfunction or weight gain. Mirtazapine: significant weight gain, sedation, increased appetite. Trazodone: sedation, orthostatic hypotension, priapism (rare but emergency).",
        contra: "Bupropion: seizure disorder, eating disorders (bulimia/anorexia), abrupt alcohol or benzodiazepine withdrawal. Mirtazapine: caution with CNS depressants. Trazodone: priapism risk requires immediate medical attention.",
        pearl: "Bupropion is the only antidepressant that does not cause sexual dysfunction or weight gain - also used for smoking cessation (Zyban) and ADHD. Mirtazapine is beneficial when weight gain and sedation are desired effects (anorexia, insomnia). Trazodone is most commonly prescribed off-label for insomnia rather than depression."
      },
      {
        name: "Haloperidol",
        type: "Typical (First-Generation) Antipsychotic",
        action: "Potent dopamine D2 receptor antagonist in the mesolimbic pathway. Effective for positive symptoms of schizophrenia (hallucinations, delusions, disorganized thought). Available in oral, IM, and long-acting decanoate formulations.",
        sideEffects: "High risk of EPS (dystonia, akathisia, parkinsonism, tardive dyskinesia), hyperprolactinemia (galactorrhea, amenorrhea, gynecomastia), QT prolongation, sedation, NMS",
        contra: "Parkinson disease (worsens dopamine deficiency), CNS depression, QT prolongation, dementia-related psychosis in elderly (BLACK BOX WARNING: increased mortality).",
        pearl: "Acute dystonia is treated with diphenhydramine (Benadryl) or benztropine (Cogentin) IM/IV. EPS risk is highest with high-potency typical antipsychotics (haloperidol, fluphenazine). Tardive dyskinesia may be irreversible - screen with AIMS scale every 6 months. NMS is a medical emergency with mortality rate of 10-20%."
      },
      {
        name: "Risperidone / Quetiapine / Olanzapine",
        type: "Atypical (Second-Generation) Antipsychotic",
        action: "Block both dopamine D2 and serotonin 5-HT2A receptors. Effective for positive and negative symptoms of schizophrenia, bipolar disorder, and augmentation for treatment-resistant depression. Lower EPS risk than typical antipsychotics.",
        sideEffects: "Metabolic syndrome (weight gain, hyperglycemia, dyslipidemia - worst with olanzapine and clozapine), sedation, orthostatic hypotension, hyperprolactinemia (risperidone), QT prolongation",
        contra: "Dementia-related psychosis in elderly (BLACK BOX WARNING: increased stroke and mortality risk). Uncontrolled diabetes (monitor closely). Hepatic impairment.",
        pearl: "Monitor fasting glucose, lipid panel, weight, and waist circumference at baseline, 3 months, and annually. Olanzapine causes the most weight gain among atypicals. Quetiapine at low doses is commonly used off-label for insomnia. Risperidone has highest prolactin elevation among atypicals."
      },
      {
        name: "Clozapine",
        type: "Atypical Antipsychotic (Treatment-Resistant)",
        action: "Blocks D1, D2, D4 dopamine receptors and multiple serotonin, histamine, and muscarinic receptors. The only antipsychotic proven effective for treatment-resistant schizophrenia and the only one shown to reduce suicide risk in schizophrenia.",
        sideEffects: "Life-threatening agranulocytosis (1-2% incidence), severe metabolic syndrome, myocarditis, seizures (dose-dependent), excessive sedation, sialorrhea (drooling), constipation (can cause fatal bowel obstruction)",
        contra: "ANC below 1500/mcL (general population) or below 1000/mcL (benign ethnic neutropenia). Uncontrolled epilepsy. History of clozapine-induced agranulocytosis. Concurrent bone marrow suppressants.",
        pearl: "Clozapine requires enrollment in REMS program with mandatory ANC monitoring: weekly for first 6 months, biweekly for months 6-12, then monthly thereafter. It is the GOLD STANDARD for treatment-resistant schizophrenia. Constipation must be actively managed - clozapine-induced ileus can be fatal. Lowest EPS risk of all antipsychotics."
      },
      {
        name: "Lithium",
        type: "Mood Stabilizer",
        action: "Exact mechanism not fully understood. Affects multiple intracellular signaling pathways including inositol monophosphatase inhibition, glycogen synthase kinase-3 inhibition, and neuroprotective effects. First-line for bipolar disorder (both manic and depressive episodes) and the only mood stabilizer proven to reduce suicide risk.",
        sideEffects: "Fine tremor, polyuria/polydipsia (nephrogenic diabetes insipidus), hypothyroidism, weight gain, GI upset, cognitive dulling, acne, teratogenicity (Ebstein anomaly - cardiac defect)",
        contra: "Severe renal disease, severe cardiovascular disease, dehydration, sodium depletion. Pregnancy (category D - Ebstein anomaly). Avoid with NSAIDs, ACE inhibitors, and thiazide diuretics (increase lithium levels).",
        pearl: "Therapeutic range 0.6-1.2 mEq/L with toxicity above 1.5 mEq/L. Narrow therapeutic index requires regular monitoring. Toxicity signs progress: 1.5-2.0 (coarse tremor, confusion, vomiting); 2.0-2.5 (seizures, arrhythmias); >2.5 (coma, death). Dehydration, sodium loss, and NSAIDs increase lithium levels. Draw levels 12 hours after last dose. Maintain consistent sodium and fluid intake."
      },
      {
        name: "Valproate (Valproic Acid / Divalproex)",
        type: "Mood Stabilizer / Anticonvulsant",
        action: "Increases GABA levels, blocks voltage-gated sodium channels, and inhibits histone deacetylase. Used for bipolar disorder (acute mania and maintenance), seizure disorders, and migraine prophylaxis.",
        sideEffects: "Hepatotoxicity (fatal in children under 2), pancreatitis, thrombocytopenia, weight gain, tremor, alopecia, GI upset, teratogenicity (neural tube defects - spina bifida)",
        contra: "Pregnancy (category X for migraine prophylaxis - highest teratogenic risk among mood stabilizers). Hepatic disease. Urea cycle disorders (fatal hyperammonemia). Mitochondrial disorders.",
        pearl: "Therapeutic level 50-100 mcg/mL. BLACK BOX WARNING for hepatotoxicity, pancreatitis, and teratogenicity. Monitor LFTs, CBC with platelets, and ammonia levels. Most teratogenic mood stabilizer - absolutely avoid in women of childbearing age without reliable contraception. Can cause polycystic ovarian syndrome with long-term use."
      },
      {
        name: "Lamotrigine",
        type: "Mood Stabilizer / Anticonvulsant",
        action: "Blocks voltage-gated sodium channels and inhibits glutamate release. Primarily effective for bipolar depression maintenance (less effective for acute mania). Also used as adjunct for seizure disorders.",
        sideEffects: "Rash (potentially Stevens-Johnson syndrome or toxic epidermal necrolysis), dizziness, headache, blurred vision, nausea, insomnia",
        contra: "History of lamotrigine-associated rash. Must titrate extremely slowly over 6-8 weeks to minimize rash risk. Valproate increases lamotrigine levels (reduce dose by 50%).",
        pearl: "Stevens-Johnson syndrome risk is highest with rapid titration and concurrent valproate use. Start low and go slow: 25 mg daily for 2 weeks, then increase by 25-50 mg every 1-2 weeks. Any rash requires immediate drug discontinuation and medical evaluation. One of the few mood stabilizers relatively safer in pregnancy (compared to valproate and lithium)."
      },
      {
        name: "Lorazepam / Diazepam",
        type: "Benzodiazepine Anxiolytic",
        action: "Enhances GABA-A receptor activity by increasing chloride channel opening frequency, producing anxiolytic, sedative, anticonvulsant, and muscle relaxant effects. Lorazepam used for acute anxiety, status epilepticus, and alcohol withdrawal (CIWA protocol). Diazepam used for anxiety, seizures, muscle spasms, and alcohol withdrawal.",
        sideEffects: "CNS depression, respiratory depression, paradoxical agitation (elderly), anterograde amnesia, dependence and withdrawal (potentially fatal seizures), falls in elderly",
        contra: "Acute narrow-angle glaucoma, severe respiratory depression, sleep apnea. Concurrent use with opioids (BLACK BOX WARNING: respiratory depression and death). Avoid in elderly when possible (Beers criteria).",
        pearl: "Lorazepam (LOT) has no active metabolites and is safer in hepatic impairment - LOT = Lorazepam, Oxazepam, Temazepam are the three benzos safe in liver disease. CIWA protocol uses benzodiazepines for alcohol withdrawal based on symptom severity scoring. Flumazenil is the reversal agent but can precipitate seizures in chronic users."
      },
      {
        name: "Buspirone",
        type: "Non-Benzodiazepine Anxiolytic",
        action: "Partial agonist at serotonin 5-HT1A receptors. Effective for generalized anxiety disorder without sedation, dependence, or withdrawal risk. Takes 2-4 weeks for full effect.",
        sideEffects: "Dizziness, headache, nausea, nervousness. Minimal sedation. No dependence or withdrawal.",
        contra: "Concurrent MAOI use. Not effective for acute anxiety or panic attacks (delayed onset of action).",
        pearl: "Buspirone does NOT provide immediate relief - patients must take it daily for 2-4 weeks before therapeutic benefit. It cannot be used PRN for acute anxiety. No cross-tolerance with benzodiazepines, so it will not prevent benzodiazepine withdrawal. Preferred for GAD in patients with history of substance abuse."
      },
      {
        name: "Methylphenidate / Amphetamine salts",
        type: "CNS Stimulant (Schedule II)",
        action: "Methylphenidate blocks dopamine and norepinephrine reuptake. Amphetamines additionally stimulate release of dopamine, norepinephrine, and serotonin. First-line for ADHD in children and adults. Also used for narcolepsy.",
        sideEffects: "Decreased appetite and weight loss, insomnia, tachycardia, hypertension, growth suppression in children, irritability, potential for abuse/dependence, sudden cardiac death (rare, screen for cardiac risk)",
        contra: "Concurrent MAOI use, symptomatic cardiovascular disease, moderate-to-severe hypertension, glaucoma, history of substance abuse (relative). Screen for cardiac history and family history of sudden death before initiation.",
        pearl: "Schedule II controlled substance - no refills, 30-day supply maximum. Monitor height, weight, heart rate, and blood pressure regularly. Drug holidays during school breaks may allow catch-up growth. Administer in the morning to minimize insomnia. Atomoxetine and guanfacine are non-stimulant alternatives for ADHD without abuse potential."
      },
      {
        name: "Buprenorphine / Methadone / Naltrexone",
        type: "Opioid Use Disorder (OUD) Medications",
        action: "Buprenorphine is a partial mu-opioid agonist (ceiling effect on respiratory depression). Methadone is a full mu-opioid agonist with long half-life. Naltrexone is an opioid antagonist that blocks euphoric effects. All reduce cravings and withdrawal symptoms in OUD.",
        sideEffects: "Buprenorphine: headache, nausea, constipation, precipitated withdrawal if given too early. Methadone: QT prolongation, respiratory depression, sedation. Naltrexone: hepatotoxicity, nausea, precipitated withdrawal if opioids in system.",
        contra: "Naltrexone: active opioid use (precipitates severe withdrawal - must be opioid-free 7-10 days). Methadone: severe respiratory depression risk, QT prolongation. Buprenorphine combined with naloxone (Suboxone) deters IV misuse.",
        pearl: "Buprenorphine must be started when patient is in mild-moderate withdrawal (COWS score 8-12) to avoid precipitated withdrawal. Methadone dispensing is restricted to certified opioid treatment programs (OTPs). Naltrexone available as monthly IM injection (Vivitrol) improving adherence. Medication-assisted treatment (MAT) combined with counseling is the evidence-based standard for OUD."
      },
      {
        name: "Ziprasidone (Geodon)",
        type: "Atypical (Second-Generation) Antipsychotic",
        action: "Blocks dopamine D2 and serotonin 5-HT2A receptors with additional serotonin and norepinephrine reuptake inhibition. Used for schizophrenia and acute bipolar mania.",
        sideEffects: "QT prolongation (highest QT risk among atypical antipsychotics), drowsiness, dizziness, orthostatic hypotension, EPS, nausea, rash",
        contra: "Known QT prolongation, recent MI, uncompensated heart failure, concurrent use with other QT-prolonging drugs (amiodarone, sotalol, quinidine), hypokalemia or hypomagnesemia",
        pearl: "Must be taken with food (at least 500 calories) for adequate absorption - bioavailability doubles with food. Carries the highest risk of QT prolongation among atypical antipsychotics - obtain baseline ECG and monitor. Causes the least weight gain and metabolic effects among atypical antipsychotics, making it preferred when metabolic risk is a concern."
      },
      {
        name: "Benztropine (Cogentin)",
        type: "Anticholinergic / Antiparkinsonian Agent",
        action: "Blocks muscarinic acetylcholine receptors in the basal ganglia, restoring the dopamine-acetylcholine balance disrupted by dopamine-blocking antipsychotics. Reduces extrapyramidal symptoms (EPS).",
        sideEffects: "Dry mouth, blurred vision, constipation, urinary retention, tachycardia, confusion and cognitive impairment (especially in elderly), heat intolerance, sedation",
        contra: "Narrow-angle glaucoma, GI obstruction, urinary retention, myasthenia gravis, tardive dyskinesia (anticholinergics worsen TD), children under 3 years, dementia",
        pearl: "First-line treatment for acute dystonia (IM/IV) caused by antipsychotics - onset within 15 minutes. Also used for drug-induced parkinsonism and akathisia. Does NOT treat tardive dyskinesia (may worsen it). High anticholinergic burden - avoid in elderly when possible (Beers criteria). Assess for anticholinergic toxicity: 'Hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter.'"
      },
      {
        name: "Trihexyphenidyl (Artane)",
        type: "Anticholinergic / Antiparkinsonian Agent",
        action: "Blocks central muscarinic receptors to reduce cholinergic excess in the striatum, improving the dopamine-acetylcholine imbalance that causes extrapyramidal symptoms and parkinsonian tremor",
        sideEffects: "Dry mouth, blurred vision, constipation, urinary retention, dizziness, nausea, nervousness, tachycardia, cognitive impairment in elderly",
        contra: "Narrow-angle glaucoma, GI obstruction, urinary retention, myasthenia gravis, tardive dyskinesia",
        pearl: "Used for drug-induced EPS and as adjunct therapy in Parkinson disease for tremor control. Similar mechanism and side effect profile to benztropine. Start at low dose and titrate gradually. Not recommended in elderly due to high anticholinergic burden and cognitive effects. If EPS persists despite anticholinergic therapy, consider switching to an atypical antipsychotic with lower EPS risk."
      }
    ],
    pearls: [
      "Serotonin syndrome is distinguished from NMS by the presence of clonus and hyperreflexia (NMS presents with lead-pipe rigidity and hyporeflexia). Both are medical emergencies.",
      "Lithium has the narrowest therapeutic index of all mood stabilizers (0.6-1.2 mEq/L). NSAIDs, dehydration, ACE inhibitors, and thiazide diuretics all increase lithium levels.",
      "Clozapine is the only antipsychotic proven effective for treatment-resistant schizophrenia and the only one that reduces suicide risk, but requires mandatory ANC monitoring due to agranulocytosis risk.",
      "All antidepressants carry a BLACK BOX WARNING for increased suicidality in patients under 25 years old - paradoxically, energy returns before mood improves, creating a window of increased risk.",
      "The LOT drugs (Lorazepam, Oxazepam, Temazepam) are the only benzodiazepines safe in liver disease because they have no active metabolites and undergo glucuronidation only.",
      "TCA overdose antidote is sodium bicarbonate for cardiac toxicity. The 3 Cs: Convulsions, Cardiac arrhythmias, Coma."
    ],
    quiz: [
      {
        question: "A patient taking phenelzine (MAOI) presents to the emergency department with severe occipital headache, blood pressure of 220/130 mmHg, and neck stiffness. What dietary indiscretion most likely caused this crisis?",
        options: [
          "Eating a large amount of fresh fruit",
          "Consuming aged cheddar cheese and red wine",
          "Drinking several glasses of milk",
          "Eating a meal high in saturated fats"
        ],
        correct: 1,
        rationale: "Aged cheese and red wine contain high levels of tyramine, which is normally broken down by MAO. When MAO is inhibited by phenelzine, tyramine accumulates and causes massive norepinephrine release, resulting in a hypertensive crisis. Other high-tyramine foods include cured meats, draft beer, fermented foods, and soy sauce."
      },
      {
        question: "A nurse is monitoring a patient on clozapine therapy. Which laboratory finding requires immediate notification of the provider and withholding the medication?",
        options: [
          "Fasting glucose of 110 mg/dL",
          "Absolute neutrophil count (ANC) of 900/mcL",
          "Serum cholesterol of 220 mg/dL",
          "Hemoglobin of 13.5 g/dL"
        ],
        correct: 1,
        rationale: "An ANC below 1000/mcL (or below 1500/mcL in general population without benign ethnic neutropenia) requires immediate discontinuation of clozapine due to the risk of life-threatening agranulocytosis. Clozapine REMS requires ANC monitoring before each dispensing. The other values, while potentially concerning, do not require withholding clozapine."
      },
      {
        question: "A patient with bipolar disorder has a lithium level of 1.8 mEq/L. Which assessment findings does the nurse expect?",
        options: [
          "Fine hand tremor, mild nausea, and increased thirst",
          "Coarse tremor, persistent vomiting, confusion, and ataxia",
          "No symptoms - this is within the therapeutic range",
          "Euphoria, decreased need for sleep, and rapid speech"
        ],
        correct: 1,
        rationale: "A lithium level of 1.8 mEq/L exceeds the therapeutic range (0.6-1.2 mEq/L) and indicates early toxicity (1.5-2.0 range). Signs include coarse tremor (fine tremor is therapeutic-level), persistent vomiting, diarrhea, confusion, and ataxia. Levels above 2.0 mEq/L can cause seizures and cardiac arrhythmias, while levels above 2.5 mEq/L can be fatal."
      },
      {
        question: "A patient on haloperidol develops a temperature of 105.4F, severe muscle rigidity, altered consciousness, tachycardia, and a creatine kinase (CK) level of 12,000 U/L. What condition does the nurse suspect?",
        options: [
          "Serotonin syndrome",
          "Tardive dyskinesia",
          "Neuroleptic malignant syndrome",
          "Anticholinergic toxicity"
        ],
        correct: 2,
        rationale: "Neuroleptic malignant syndrome (NMS) is a life-threatening emergency characterized by high fever, lead-pipe muscle rigidity, altered mental status, autonomic dysfunction, and markedly elevated CK (from muscle breakdown). It occurs with dopamine-blocking agents, especially high-potency typical antipsychotics like haloperidol. Treatment includes stopping the offending drug, dantrolene, and bromocriptine. Mortality is 10-20% if not recognized promptly."
      },
      {
        question: "A nurse is educating a patient newly prescribed sertraline for major depressive disorder. Which statement by the patient indicates correct understanding?",
        options: [
          "I should feel much better within the first two days of taking this medication",
          "I can stop taking this medication once I start feeling better without any problems",
          "This medication may take several weeks before I notice full improvement in my mood",
          "I should take this medication only on days when I feel particularly depressed"
        ],
        correct: 2,
        rationale: "SSRIs require 2-6 weeks for full therapeutic effect. Patients must be educated about this delayed onset to prevent premature discontinuation. SSRIs must be taken daily, not PRN, and should be tapered gradually when discontinuing to avoid discontinuation syndrome. Close monitoring for suicidality is especially important during the first few weeks of therapy."
      }
    ]
  },

  "pharm-neuro-pain": {
    title: "Neurology and Pain Pharmacology",
    cellular: {
      title: "Neuronal Excitability",
      content: "Neurological and pain medications target ion channels, neurotransmitter systems, and inflammatory pathways that govern neuronal excitability and nociceptive signaling. Antiepileptic drugs stabilize neuronal membranes by blocking voltage-gated sodium channels (phenytoin, carbamazepine), enhancing GABA inhibition (valproate, benzodiazepines), or modulating calcium channels (gabapentin, pregabalin). Dopaminergic agents for Parkinson disease replace or mimic dopamine lost from substantia nigra degeneration. Opioid analgesics bind mu, kappa, and delta receptors in the CNS and peripheral nervous system, activating descending inhibitory pain pathways and reducing substance P release. NSAIDs inhibit cyclooxygenase enzymes (COX-1 and COX-2), blocking prostaglandin synthesis at the site of tissue injury to reduce pain, inflammation, and fever."
    },
    riskFactors: [
      "History of seizure disorder requiring careful medication transitions",
      "Opioid use disorder or history of substance abuse",
      "Hepatic impairment affecting drug metabolism (phenytoin, valproate, acetaminophen)",
      "Renal impairment requiring dose adjustments for renally cleared agents (gabapentin, pregabalin)",
      "Elderly patients with increased sensitivity to CNS depressants and fall risk",
      "Concurrent anticoagulant therapy with NSAIDs increasing bleeding risk",
      "Pregnancy considerations for teratogenic antiepileptics (valproate, phenytoin)"
    ],
    diagnostics: [
      "Phenytoin serum levels (therapeutic range 10-20 mcg/mL; free phenytoin in hypoalbuminemia)",
      "Carbamazepine levels (therapeutic range 4-12 mcg/mL) with baseline and periodic CBC (aplastic anemia)",
      "Valproate levels (50-100 mcg/mL) with hepatic function and ammonia levels",
      "Liver function tests before and during acetaminophen-containing regimen assessment",
      "Renal function for dose adjustment of gabapentin, pregabalin, and levetiracetam",
      "EEG monitoring for seizure disorder medication management",
      "Pain assessment using validated scales (numeric rating, Wong-Baker FACES, FLACC for nonverbal)"
    ],
    management: [
      "Never abruptly discontinue antiepileptic drugs - taper gradually to prevent status epilepticus",
      "Multimodal pain management combining pharmacological and non-pharmacological approaches",
      "Assess pain using the appropriate validated scale before and after interventions",
      "Implement equianalgesic dosing when converting between opioids (morphine 10 mg IV = 30 mg PO)",
      "Monitor respiratory status for all patients receiving opioid therapy (rate, depth, SpO2)",
      "Limit acetaminophen total daily dose to less than 3 grams in adults (2 grams in hepatic impairment or alcohol use)",
      "Assess for opioid-induced constipation and implement prophylactic bowel regimen"
    ],
    nursingActions: [
      "Hold carbidopa-levodopa with high-protein meals (protein competes for absorption across blood-brain barrier)",
      "Monitor phenytoin levels and assess for signs of toxicity: nystagmus (first sign), ataxia, slurred speech",
      "Administer naloxone 0.4-2 mg IV for opioid-induced respiratory depression (may repeat every 2-3 minutes)",
      "Assess for signs of NSAID toxicity: GI bleeding (tarry stools), renal impairment (decreased output), fluid retention",
      "Educate patients on maximum acetaminophen intake including hidden sources in combination products",
      "Monitor for sumatriptan cardiovascular effects: chest tightness, flushing, do not exceed 2 doses per 24 hours",
      "Screen for Steven-Johnson syndrome rash with lamotrigine and carbamazepine (HLA-B*1502 in Asian populations)"
    ],
    signs: {
      left: [
        "Phenytoin toxicity progression: nystagmus (earliest sign at 20 mcg/mL) then ataxia, then slurred speech, then lethargy/coma",
        "Opioid toxicity triad: respiratory depression (rate less than 12), pinpoint pupils (miosis), altered level of consciousness",
        "NSAID-induced GI bleeding: melena, hematemesis, abdominal pain, anemia",
        "Serotonin syndrome with tramadol: agitation, hyperthermia, clonus, hyperreflexia",
        "Parkinson medication on-off phenomenon: fluctuating response to levodopa with periods of immobility"
      ],
      right: [
        "Acetaminophen hepatotoxicity stages: Day 1-2 nausea/vomiting, Day 2-3 false improvement, Day 3-4 hepatic failure (elevated LFTs, jaundice, coagulopathy)",
        "Naloxone reversal: monitor for re-sedation as naloxone half-life (30-90 min) is shorter than most opioids",
        "Carbamazepine toxicity: diplopia, dizziness, ataxia, nystagmus, blood dyscrasias (aplastic anemia, agranulocytosis)",
        "Ergotamine/triptan overuse: medication overuse headache with rebound pattern upon withdrawal",
        "Gabapentin/pregabalin withdrawal: anxiety, insomnia, nausea, sweating, seizures (must taper)"
      ]
    },
    medications: [
      {
        name: "Phenytoin (Dilantin)",
        type: "Antiepileptic - Hydantoin",
        action: "Stabilizes neuronal membranes by blocking voltage-gated sodium channels, preventing repetitive firing. Used for tonic-clonic and partial seizures. Also used for status epilepticus (fosphenytoin preferred IV due to less cardiac toxicity).",
        sideEffects: "Gingival hyperplasia, hirsutism, coarsening of facial features, nystagmus (first sign of toxicity), ataxia, cognitive impairment, osteoporosis (vitamin D depletion), megaloblastic anemia (folate depletion), teratogenicity (fetal hydantoin syndrome), purple glove syndrome with IV infiltration",
        contra: "Sinus bradycardia, SA block, second and third-degree AV block. IV phenytoin must be given in normal saline only (precipitates in dextrose). Maximum IV rate 50 mg/min to prevent cardiac arrhythmias.",
        pearl: "Phenytoin has zero-order (saturation) kinetics - small dose changes can cause disproportionate level increases. Therapeutic range 10-20 mcg/mL. In hypoalbuminemia, use corrected phenytoin or free phenytoin level. Gingival hyperplasia occurs in 50% of patients - emphasize meticulous oral hygiene."
      },
      {
        name: "Carbamazepine (Tegretol)",
        type: "Antiepileptic - Iminostilbene",
        action: "Blocks voltage-gated sodium channels to reduce neuronal firing. Used for partial and generalized tonic-clonic seizures, trigeminal neuralgia, and bipolar disorder. Potent CYP450 inducer that auto-induces its own metabolism.",
        sideEffects: "Diplopia, dizziness, ataxia, drowsiness, aplastic anemia, agranulocytosis, Stevens-Johnson syndrome (HLA-B*1502 screening in patients of Asian descent), SIADH/hyponatremia, hepatotoxicity, teratogenicity (neural tube defects)",
        contra: "Concurrent MAOI use. History of bone marrow depression. HLA-B*1502 positive (high SJS risk). Absence seizures (may worsen).",
        pearl: "Auto-induction means levels will drop over first 2-4 weeks requiring dose adjustment. Therapeutic range 4-12 mcg/mL. Screen for HLA-B*1502 in patients of Asian ancestry before starting. Monitor CBC for blood dyscrasias. Significant drug interactions as a CYP3A4 inducer - reduces effectiveness of oral contraceptives, warfarin, and many other drugs."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic - SV2A Ligand",
        action: "Binds synaptic vesicle glycoprotein 2A (SV2A), modulating neurotransmitter release. Broad-spectrum antiepileptic for partial and generalized seizures. Minimal drug interactions and no hepatic metabolism.",
        sideEffects: "Behavioral changes (irritability, aggression, mood changes - 'Keppra rage'), drowsiness, dizziness, headache, fatigue",
        contra: "Known hypersensitivity. Dose adjustment required in renal impairment as it is primarily renally eliminated.",
        pearl: "Levetiracetam is often preferred first-line due to minimal drug interactions, no required blood monitoring, and broad-spectrum efficacy. Behavioral side effects are the main limitation. Available IV for status epilepticus when phenytoin is contraindicated. Supplemental dose recommended after hemodialysis."
      },
      {
        name: "Sumatriptan",
        type: "Triptan - Serotonin 5-HT1B/1D Agonist",
        action: "Stimulates serotonin 5-HT1B/1D receptors causing vasoconstriction of dilated cranial arteries and inhibition of trigeminal nerve pain signaling. Abortive treatment for acute migraine and cluster headaches. Available as oral, subcutaneous, and intranasal formulations.",
        sideEffects: "Chest tightness/pressure (triptan sensation, not ischemia in most cases), tingling, flushing, dizziness, drowsiness, injection site reactions, coronary vasospasm (rare)",
        contra: "Ischemic heart disease, Prinzmetal angina, uncontrolled hypertension, basilar or hemiplegic migraine, concurrent ergotamine use, use within 24 hours of another triptan, concurrent MAOI use. NOT for prophylaxis.",
        pearl: "Take at the onset of migraine for best efficacy. Do not exceed 2 doses per 24 hours. Limit use to fewer than 10 days per month to prevent medication-overuse headache. Contraindicated in cardiovascular disease due to vasoconstrictive properties. Migraine prophylaxis uses different agents: topiramate, propranolol, valproate, or CGRP monoclonal antibodies (erenumab, fremanezumab)."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor / Decarboxylase Inhibitor",
        action: "Levodopa crosses the blood-brain barrier and is converted to dopamine, replacing depleted dopamine in the basal ganglia. Carbidopa inhibits peripheral dopa decarboxylase, preventing conversion of levodopa to dopamine outside the CNS, reducing side effects and increasing brain availability.",
        sideEffects: "Nausea (most common initial side effect), orthostatic hypotension, dyskinesias (involuntary movements with long-term use), on-off phenomenon, vivid dreams/hallucinations, darkening of urine/sweat, impulse control disorders",
        contra: "Concurrent non-selective MAOI use. Narrow-angle glaucoma. History of melanoma (relative). Avoid high-protein meals with dosing (competes for transport across blood-brain barrier).",
        pearl: "Effectiveness typically wanes after 3-5 years ('wearing-off' phenomenon). Take on empty stomach or with low-protein food for best absorption. High-protein meals block amino acid transport across the blood-brain barrier. Pramipexole (dopamine agonist) and rasagiline (MAO-B inhibitor) may be used as adjuncts or early monotherapy to delay levodopa initiation."
      },
      {
        name: "Ibuprofen / Naproxen",
        type: "NSAID (Non-Steroidal Anti-Inflammatory Drug)",
        action: "Non-selectively inhibits cyclooxygenase enzymes COX-1 and COX-2, blocking prostaglandin synthesis. Produces analgesic, anti-inflammatory, and antipyretic effects. COX-1 inhibition accounts for GI and platelet effects; COX-2 inhibition provides anti-inflammatory action.",
        sideEffects: "GI toxicity (ulceration, bleeding, perforation), renal impairment (decreased GFR, interstitial nephritis, hyperkalemia), cardiovascular risk (increased MI and stroke with prolonged use), platelet inhibition (bleeding risk), fluid retention, hypertension",
        contra: "Active GI bleeding or peptic ulcer disease, severe renal impairment (GFR < 30), third trimester pregnancy (premature ductus arteriosus closure), aspirin-exacerbated respiratory disease, post-CABG surgery.",
        pearl: "Use lowest effective dose for shortest duration. Administer with food to reduce GI irritation. Avoid in elderly and patients with renal disease, heart failure, or concurrent anticoagulant therapy. Naproxen may have slightly lower cardiovascular risk than other NSAIDs. Ibuprofen can interfere with cardioprotective effect of low-dose aspirin if taken first."
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-Opioid Analgesic / Antipyretic",
        action: "Mechanism not fully understood. Believed to inhibit COX enzymes centrally (not peripherally), modulate serotonergic descending pathways, and interact with the endocannabinoid system. Analgesic and antipyretic without significant anti-inflammatory effect.",
        sideEffects: "Hepatotoxicity (dose-dependent, major concern), rare hypersensitivity reactions. Generally well-tolerated at therapeutic doses.",
        contra: "Severe hepatic impairment, active liver disease, chronic alcohol use (increased toxicity risk). Maximum 3 g/day in healthy adults, 2 g/day with liver disease or alcohol use.",
        pearl: "Leading cause of acute liver failure in the US, often from unintentional overdose via combination products. N-acetylcysteine (NAC) is the antidote, most effective within 8 hours of ingestion but beneficial up to 72 hours. Toxic dose is generally above 150 mg/kg or 7.5-10 g in adults. Assess for acetaminophen in ALL combination products the patient takes (many OTC cold, pain, and sleep medications contain it)."
      },
      {
        name: "Morphine / Hydromorphone / Oxycodone / Fentanyl",
        type: "Opioid Agonist Analgesic (Schedule II)",
        action: "Bind mu-opioid receptors in the CNS, activating descending inhibitory pain pathways, reducing substance P release, altering pain perception and emotional response to pain. Morphine is the reference standard for equianalgesic dosing. Fentanyl is 80-100 times more potent than morphine.",
        sideEffects: "Respiratory depression (most dangerous), constipation (most common, does not develop tolerance), nausea/vomiting, sedation, pruritus, urinary retention, hypotension, miosis, physical dependence and tolerance",
        contra: "Significant respiratory depression, acute or severe bronchial asthma without monitoring, known or suspected GI obstruction. Concurrent benzodiazepine use (BLACK BOX WARNING). Morphine contraindicated in renal failure (active metabolite accumulation).",
        pearl: "Equianalgesic conversions: morphine 10 mg IV = 30 mg PO; hydromorphone 1.5 mg IV = 7.5 mg PO; fentanyl 100 mcg IV = morphine 10 mg IV. Always reduce calculated dose by 25-50% when converting between opioids (incomplete cross-tolerance). Monitor respiratory rate before and after administration - hold for RR < 12. Constipation requires prophylactic bowel regimen from day one."
      },
      {
        name: "Tramadol",
        type: "Atypical Opioid Analgesic (Schedule IV)",
        action: "Weak mu-opioid receptor agonist with additional inhibition of serotonin and norepinephrine reuptake. Provides analgesic effect through dual mechanism. Less potent than traditional opioids but still carries abuse potential.",
        sideEffects: "Seizures (dose-dependent, unique to tramadol), serotonin syndrome (when combined with serotonergic drugs), nausea, dizziness, constipation, respiratory depression (less than traditional opioids), dependence",
        contra: "Seizure disorder (lowers seizure threshold significantly), concurrent SSRI/SNRI/TCA/MAOI use (serotonin syndrome risk), severe hepatic or renal impairment, children under 12 years.",
        pearl: "Tramadol carries unique dual risk: seizures AND serotonin syndrome. Maximum dose 400 mg/day. Not reversed completely by naloxone due to non-opioid component. Often falsely perceived as safe - it is still an opioid with abuse and dependence potential. Contraindicated after tonsillectomy in children due to ultra-rapid metabolizer risk."
      },
      {
        name: "Gabapentin / Pregabalin",
        type: "Neuropathic Pain Agent / Anticonvulsant",
        action: "Binds alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release. Used for neuropathic pain (diabetic neuropathy, postherpetic neuralgia), fibromyalgia (pregabalin), seizures (adjunct), and anxiety (pregabalin). Despite the name, does not interact with GABA receptors.",
        sideEffects: "Dizziness, sedation, peripheral edema, weight gain, ataxia, blurred vision, respiratory depression when combined with opioids or CNS depressants",
        contra: "Renal impairment requires dose reduction (both are renally cleared). Concurrent opioid or CNS depressant use increases respiratory depression risk. Pregabalin is Schedule V (abuse potential). Must taper to discontinue (seizure risk).",
        pearl: "Gabapentin and pregabalin are increasingly used as opioid-sparing agents in multimodal pain management. Pregabalin has more predictable absorption (linear pharmacokinetics) than gabapentin. Despite the name, these drugs do NOT work through the GABA system. Taper over at least one week to avoid withdrawal seizures."
      },
      {
        name: "Cyclobenzaprine / Baclofen",
        type: "Muscle Relaxant",
        action: "Cyclobenzaprine acts centrally at the brainstem to reduce muscle spasm (structurally related to TCAs). Baclofen is a GABA-B receptor agonist that inhibits spinal reflexes. Used for acute musculoskeletal pain (cyclobenzaprine) and spasticity from MS or spinal cord injury (baclofen).",
        sideEffects: "Cyclobenzaprine: sedation, dry mouth, dizziness, anticholinergic effects (similar to TCAs). Baclofen: drowsiness, weakness, dizziness, nausea. Abrupt withdrawal of baclofen can cause hallucinations, seizures, and autonomic dysreflexia.",
        contra: "Cyclobenzaprine: concurrent MAOI use, arrhythmias, heart failure, hyperthyroidism, avoid in elderly (Beers criteria). Baclofen: abrupt discontinuation (potentially fatal withdrawal). Intrathecal baclofen pump malfunction is a medical emergency.",
        pearl: "Cyclobenzaprine should only be used short-term (2-3 weeks maximum) for acute musculoskeletal spasm. Baclofen must NEVER be abruptly discontinued - can cause life-threatening withdrawal (seizures, rhabdomyolysis, multi-organ failure). Intrathecal baclofen pump failure requires emergency management. Both cause significant sedation - avoid driving and alcohol."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist / Reversal Agent",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors. Rapidly reverses opioid-induced respiratory depression, sedation, and hypotension. Available as IV, IM, subcutaneous, and intranasal formulations. Onset 1-2 minutes IV, 2-5 minutes IM/intranasal.",
        sideEffects: "Acute opioid withdrawal symptoms (tachycardia, hypertension, nausea, vomiting, diaphoresis, agitation), pulmonary edema (rare), arrhythmias. Re-sedation is the primary concern after administration.",
        contra: "Known hypersensitivity. Use cautiously in chronic opioid users (precipitates severe withdrawal). Titrate to respiratory effort, not full consciousness, in opioid-dependent patients.",
        pearl: "Naloxone half-life (30-90 minutes) is shorter than most opioids - continuous monitoring for re-sedation is essential for at least 2 hours after administration. Dose: 0.4-2 mg IV/IM/SQ, may repeat every 2-3 minutes (max 10 mg). For intranasal: 4 mg per nostril. In opioid-dependent patients, titrate with small doses (0.04-0.1 mg) to restore breathing without full withdrawal. Community naloxone distribution is a key harm reduction strategy."
      }
    ],
    pearls: [
      "Phenytoin is the only anticonvulsant with zero-order kinetics - small dose increases can cause disproportionate toxic level spikes. Always monitor levels closely.",
      "Naloxone has a shorter half-life than virtually all opioids it reverses - monitor for re-sedation for at least 2 hours and be prepared to re-dose.",
      "Acetaminophen maximum 3 g/day in healthy adults, 2 g/day with liver disease. NAC is the antidote and is most effective within 8 hours but should be given up to 72 hours post-ingestion.",
      "Equianalgesic dosing is essential for safe opioid rotation: morphine 10 mg IV = 30 mg PO = hydromorphone 1.5 mg IV = fentanyl 100 mcg IV. Always reduce by 25-50% for incomplete cross-tolerance.",
      "Carbidopa-levodopa should be taken on an empty stomach or with low-protein food - high-protein meals compete with levodopa for amino acid transporters across the blood-brain barrier.",
      "Tramadol has dual risks unique among opioids: dose-dependent seizure risk AND serotonin syndrome potential when combined with serotonergic drugs."
    ],
    quiz: [
      {
        question: "A patient receiving IV morphine has a respiratory rate of 8 breaths per minute and pinpoint pupils. After administering naloxone, what is the priority nursing action?",
        options: [
          "Document the event and resume morphine at a lower dose in 4 hours",
          "Continuously monitor for re-sedation because naloxone has a shorter half-life than morphine",
          "Administer a second dose of naloxone prophylactically in 30 minutes",
          "Discontinue all pain medications and notify the patient's family"
        ],
        correct: 1,
        rationale: "Naloxone has a half-life of 30-90 minutes, which is significantly shorter than morphine (3-4 hours) and most other opioids. After initial reversal, the patient is at risk for re-sedation and respiratory depression as naloxone wears off. Continuous monitoring of respiratory rate, oxygen saturation, and level of consciousness for at least 2 hours is the priority."
      },
      {
        question: "A nurse is assessing a patient taking phenytoin. Which finding represents the earliest sign of phenytoin toxicity?",
        options: [
          "Gingival hyperplasia",
          "Nystagmus",
          "Coma",
          "Ataxia"
        ],
        correct: 1,
        rationale: "Phenytoin toxicity follows a predictable progression: nystagmus appears first (at levels around 20 mcg/mL), followed by ataxia and incoordination (25-30 mcg/mL), then slurred speech, and finally lethargy progressing to coma at very high levels. Gingival hyperplasia is a chronic side effect, not a sign of acute toxicity."
      },
      {
        question: "A patient taking acetaminophen for chronic pain also uses an OTC cold medication. The nurse reviews the cold medication and finds it contains 325 mg of acetaminophen per dose. Which action is most important?",
        options: [
          "Tell the patient to continue both medications as directed since cold medications are generally safe",
          "Calculate the total daily acetaminophen intake from all sources to ensure it does not exceed 3 grams",
          "Recommend switching to ibuprofen for pain since it does not interact with cold medications",
          "Instruct the patient to take the cold medication only at bedtime to avoid interactions"
        ],
        correct: 1,
        rationale: "Unintentional acetaminophen overdose from multiple products is the leading cause of acute liver failure in the US. The nurse must calculate the total daily acetaminophen intake from ALL sources, including combination products like cold medications, and ensure it does not exceed 3 g/day in healthy adults or 2 g/day in patients with liver disease or alcohol use."
      },
      {
        question: "A patient with Parkinson disease reports that carbidopa-levodopa seems less effective when taken with meals. What dietary modification should the nurse recommend?",
        options: [
          "Take the medication with high-protein meals to enhance absorption",
          "Take the medication on an empty stomach or with a low-protein snack",
          "Take the medication with dairy products to prevent GI upset",
          "Increase fluid intake to 3 liters daily to improve medication absorption"
        ],
        correct: 1,
        rationale: "Dietary protein (amino acids) competes with levodopa for transport across the blood-brain barrier via the large neutral amino acid transporter. High-protein meals significantly reduce levodopa absorption and effectiveness. Patients should take carbidopa-levodopa on an empty stomach or with low-protein food, ideally 30 minutes before or 1 hour after meals."
      },
      {
        question: "A patient is being transitioned from IV morphine 6 mg every 4 hours to oral oxycodone. Using equianalgesic dosing principles, what additional consideration is essential during this conversion?",
        options: [
          "The calculated equianalgesic dose should be given without any dose adjustment",
          "The calculated dose should be reduced by 25-50% due to incomplete cross-tolerance between opioids",
          "The new opioid dose should be doubled to account for reduced oral bioavailability",
          "The patient should receive both medications simultaneously for 48 hours during the transition"
        ],
        correct: 1,
        rationale: "When converting between opioids, the calculated equianalgesic dose should be reduced by 25-50% due to incomplete cross-tolerance. This means the patient's actual sensitivity to the new opioid may be greater than predicted by equianalgesic tables alone. Failing to reduce the dose can result in overdose and respiratory depression. Monitor closely after any opioid conversion."
      }
    ]
  }
};
