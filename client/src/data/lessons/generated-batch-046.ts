import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

export const generatedBatch046Lessons: Record<string, LessonContent> = {
  "hit-np": {
    title: "Heparin-Induced Thrombocytopenia (HIT): 4T",
    cellular: { title: "HIT Pathophysiology & 4T Score", content: "Heparin-induced thrombocytopenia (HIT) is an immune-mediated prothrombotic disorder caused by IgG antibodies directed against complexes of platelet factor 4 (PF4) and heparin. When heparin binds to PF4 (released from alpha granules of activated platelets), it forms immunogenic PF4-heparin complexes on the platelet surface. In susceptible individuals, IgG antibodies bind these complexes, and the Fc portion of the antibody cross-links FcγIIa receptors on adjacent platelets, causing massive platelet activation, aggregation, and consumption. This paradoxically creates a hypercoagulable state despite thrombocytopenia — HIT is a PROthrombotic disorder, not a bleeding disorder. Activated platelets release procoagulant microparticles and tissue factor, generating thrombin. Endothelial cells and monocytes are also activated, amplifying thrombin generation. HIT typically presents 5-10 days after heparin initiation (or within 24 hours if prior heparin exposure within 100 days). The 4T score is the validated pretest probability tool: Thrombocytopenia (timing and severity of platelet fall), Timing (onset relative to heparin exposure), Thrombosis (new thrombosis or other sequelae), and oTher causes of thrombocytopenia excluded. Score 0-3 = low probability; 4-5 = intermediate; 6-8 = high. Platelet count typically falls 30-50% from baseline (rarely below 20,000). Unfractionated heparin (UFH) carries higher risk (1-5%) than LMWH (0.1-0.5%)." },
    riskFactors: ["Unfractionated heparin exposure (UFH >> LMWH risk, 1-5% vs 0.1-0.5%)", "Surgical patients (higher risk than medical patients)", "Duration of heparin exposure >4 days", "Female sex (slightly higher incidence)", "Prior heparin exposure within the past 100 days (rapid-onset HIT)", "Cardiac surgery and orthopedic surgery patients (highest risk populations)"],
    diagnostics: ["4T Score: validated pretest probability — low (0-3), intermediate (4-5), high (6-8)", "Platelet count: typically 30-50% fall from baseline, nadir usually 20,000-150,000; timing onset day 5-10", "PF4-heparin ELISA (immunoassay): high sensitivity (>95%) but lower specificity; used as screening test", "Serotonin release assay (SRA): gold standard confirmatory test; high specificity (>95%); measures functional platelet activation", "Duplex ultrasound: evaluate for DVT (most common thrombotic complication)", "CT angiography: evaluate for PE if suspected"],
    management: ["IMMEDIATELY stop ALL heparin (including heparin flushes, heparin-coated catheters, LMWH)", "Start alternative non-heparin anticoagulant: argatroban (hepatic metabolism — preferred in renal failure) or bivalirudin (short half-life, ICU/PCI setting)", "Do NOT give warfarin until platelet count recovers to >150,000 — warfarin during acute HIT causes protein C depletion and venous limb gangrene/skin necrosis", "Overlap alternative anticoagulant with warfarin for ≥5 days AND until INR is therapeutic for ≥2 days before discontinuing parenteral anticoagulant", "Do NOT transfuse platelets — adds 'fuel to the fire' by providing more PF4 substrate for antibody formation", "Continue anticoagulation for minimum 4 weeks (HIT without thrombosis) or 3-6 months (HIT with thrombosis)"],
    nursingActions: ["Monitor platelet counts every other day from day 4-14 of heparin therapy for early detection", "Calculate 4T score when HIT is suspected and communicate to prescriber", "Stop ALL forms of heparin immediately upon suspicion — including heparin flushes and LMWH", "Monitor aPTT closely during argatroban infusion (target 1.5-3x baseline)", "Assess for new thrombosis: limb pain/swelling (DVT), dyspnea (PE), skin necrosis, stroke symptoms", "Label patient as 'heparin allergy' in medical record; educate patient on lifetime heparin avoidance"],
    assessmentFindings: ["Platelet count drop >30-50% from baseline, typically day 5-10 of heparin therapy", "New thrombosis despite heparin therapy (paradoxical — should raise HIT suspicion)", "Skin necrosis at heparin injection sites", "Systemic reactions after heparin bolus (fever, rigors, hypotension, tachycardia)", "Adrenal hemorrhage/infarction (rare — acute abdominal pain, hypotension)"],
    signs: {
      left: ["Platelet count fall 30-50% from baseline", "Onset day 5-10 of heparin (or <24h with prior exposure)", "New DVT or PE despite heparin", "Skin necrosis at injection sites", "Positive PF4-heparin ELISA"],
      right: ["Venous limb gangrene (warfarin given during acute HIT)", "Arterial thrombosis (limb ischemia, stroke, MI)", "Adrenal hemorrhagic infarction", "Confirmed by serotonin release assay (SRA)", "4T score ≥6 = high pretest probability"]
    },
    medications: [{
      name: "Argatroban",
      type: "Direct Thrombin Inhibitor",
      action: "Binds directly and reversibly to the active site of thrombin (factor IIa), inhibiting both free and clot-bound thrombin. Provides immediate anticoagulation without requiring antithrombin III as a cofactor (unlike heparin)",
      sideEffects: "Bleeding (most common), hypotension, fever, nausea, diarrhea; artificially elevates INR (complicates warfarin transition)",
      contra: "Active major bleeding, severe hepatic impairment (argatroban is hepatically metabolized)",
      pearl: "Preferred in HIT with renal impairment (hepatic metabolism); monitor aPTT (target 1.5-3x baseline); CAUTION: argatroban falsely elevates INR — when transitioning to warfarin, use chromogenic factor X assay or target INR >4 on combination therapy before stopping argatroban"
    }],
    pearls: ["HIT is a PROthrombotic disorder — thrombosis risk is 30-50% if untreated, NOT a bleeding disorder", "STOP ALL heparin immediately — including flushes, LMWH, and heparin-coated catheters", "NEVER give warfarin during acute HIT until platelets >150,000 — warfarin depletes protein C and causes venous limb gangrene", "NEVER transfuse platelets in HIT — provides more PF4 substrate for antibody binding ('fuel to the fire')", "The 4T score is the validated pretest probability tool — low score (0-3) has >99% negative predictive value", "Argatroban falsely elevates INR — use chromogenic factor X assay when transitioning to warfarin"],
    quiz: [
      {
        question: "A patient on heparin develops a platelet drop from 250,000 to 100,000 on day 7. The 4T score is 6. What is the PRIORITY action?",
        options: ["Transfuse platelets to correct thrombocytopenia", "Stop all heparin and start argatroban; send PF4-heparin antibody testing", "Continue heparin and recheck platelets tomorrow", "Start warfarin immediately for anticoagulation"],
        correct: 1,
        rationale: "A 4T score of 6 indicates high probability of HIT. All heparin must be stopped immediately, and a non-heparin anticoagulant (argatroban or bivalirudin) must be started while confirmatory testing is sent. Platelet transfusion is contraindicated. Warfarin is contraindicated until platelets recover to >150,000."
      },
      {
        question: "Why is warfarin contraindicated during acute HIT?",
        options: ["Warfarin interacts with argatroban", "Warfarin depletes protein C faster than procoagulant factors, causing paradoxical thrombosis and venous limb gangrene", "Warfarin further reduces platelet count", "Warfarin has no effect on HIT-related thrombosis"],
        correct: 1,
        rationale: "Warfarin inhibits vitamin K-dependent factors (II, VII, IX, X) and also inhibits the anticoagulant proteins C and S. Protein C has the shortest half-life and is depleted first, creating a transient hypercoagulable state. In the already prothrombotic HIT state, this causes devastating venous limb gangrene and skin necrosis."
      },
      {
        question: "Why should platelets NOT be transfused in HIT?",
        options: ["Platelets are ineffective when the count is above 20,000", "Transfused platelets provide additional PF4, creating more substrate for HIT antibodies and worsening thrombosis", "Platelets will be immediately destroyed and provide no benefit", "Platelet transfusions are never indicated in any thrombocytopenic condition"],
        correct: 1,
        rationale: "Transfused platelets contain PF4 in their alpha granules. Adding more PF4 provides additional substrate for HIT antibody binding, potentially worsening platelet activation, thrombin generation, and thrombosis — essentially adding 'fuel to the fire.'"
      },
    ]
  },
  "hiv-art-np": {
    title: "HIV Management: ART Regimens",
    cellular: { title: "ART Regimens & Resistance Management", content: "Antiretroviral therapy (ART) targets specific steps in the HIV lifecycle using multiple drug classes to achieve durable viral suppression. The backbone of most regimens is two nucleoside/nucleotide reverse transcriptase inhibitors (NRTIs) combined with a third agent from another class. NRTIs (tenofovir, emtricitabine, abacavir, lamivudine) are nucleoside analogs that, after intracellular phosphorylation, compete with natural nucleotides for incorporation into the growing viral DNA chain by reverse transcriptase, causing chain termination. Two forms of tenofovir exist: tenofovir disoproxil fumarate (TDF — higher risk of renal and bone toxicity) and tenofovir alafenamide (TAF — less renal/bone toxicity but may worsen lipids). Integrase strand transfer inhibitors (INSTIs) — dolutegravir, bictegravir, cabotegravir — block integrase from inserting viral DNA into the host chromosome. INSTIs are now preferred third agents due to superior efficacy, high barrier to resistance (dolutegravir, bictegravir), rapid viral load decline, favorable side effect profile, and minimal drug interactions. Preferred first-line regimens include: bictegravir/TAF/emtricitabine (Biktarvy), dolutegravir + TAF/emtricitabine, or dolutegravir/lamivudine (Dovato — two-drug regimen for treatment-naive without hepatitis B, viral load <500,000, or resistance). Non-nucleoside RTIs (NNRTIs — efavirenz, rilpivirine, doravirine) bind directly to reverse transcriptase causing conformational change; older agents have low genetic barrier to resistance. Protease inhibitors (PIs — darunavir/ritonavir) block viral protease from cleaving polyproteins; boosted with ritonavir or cobicistat. Resistance testing (genotypic) is performed at diagnosis and at virologic failure (viral load >200 copies/mL on ART)." },
    riskFactors: ["Treatment-naive HIV infection requiring ART initiation (recommended for ALL regardless of CD4)", "Virologic failure on current regimen (viral load >200 copies/mL despite ART)", "Drug resistance mutations identified on genotypic testing", "Hepatitis B coinfection (must include TDF or TAF in regimen — HBV flare if discontinued)", "Pregnancy (avoid dolutegravir in first trimester if possible; use established regimens)", "Renal impairment requiring drug adjustments (avoid TDF if CrCl <60 mL/min)"],
    diagnostics: ["HIV RNA viral load: monitor 4-8 weeks after starting/changing ART, then every 3-6 months; goal <50 copies/mL", "CD4 count: every 3-6 months until immune reconstitution (>200, then annually when stable >300-500)", "Genotypic resistance testing: at diagnosis (baseline resistance), and at virologic failure", "HLA-B*5701 testing: BEFORE starting abacavir — positive result contraindicates abacavir (hypersensitivity reaction)", "Hepatitis B serology: determines if TDF/TAF must be included (treat both HBV and HIV)", "Baseline labs: CMP (renal/hepatic function), fasting lipids, HbA1c, urinalysis, bone density if on TDF"],
    management: ["First-line regimen: bictegravir/TAF/emtricitabine (Biktarvy) — single tablet, once daily, high barrier to resistance", "Alternative: dolutegravir + TAF/emtricitabine OR dolutegravir/lamivudine (2-drug regimen if VL <500,000, no HBV, no resistance)", "Achieve viral suppression (<50 copies/mL) within 12-24 weeks of starting ART", "Virologic failure: check adherence FIRST (most common cause), then obtain genotypic resistance testing", "Switch regimen based on resistance pattern — must include ≥2 fully active drugs", "Hepatitis B coinfection: NEVER stop TDF/TAF without HBV-active alternative — risk of fatal HBV flare"],
    nursingActions: ["Assess and support ART adherence at every visit — >95% adherence required for viral suppression", "Educate on taking medications at the same time daily; discuss pill burden, food requirements, and side effects", "Monitor for INSTI side effects: insomnia, headache, weight gain (dolutegravir, bictegravir)", "Check HLA-B*5701 before starting abacavir — if positive, abacavir is ABSOLUTELY contraindicated", "Screen for drug interactions — especially with PPIs (reduce rilpivirine absorption), antacids (chelate INSTIs), rifampin", "Educate on U=U (Undetectable = Untransmittable) — sustained viral suppression eliminates sexual transmission"],
    assessmentFindings: ["Undetectable viral load (<50 copies/mL) indicates successful ART (typically within 12-24 weeks)", "Rising CD4 count indicates immune reconstitution", "Virologic failure: viral load >200 copies/mL despite ART — most commonly from non-adherence", "Immune reconstitution inflammatory syndrome (IRIS): paradoxical worsening after ART start in severely immunosuppressed", "Lipodystrophy and metabolic syndrome (more common with older PIs and NRTIs)"],
    signs: {
      left: ["Undetectable viral load = successful suppression", "Rising CD4 count = immune reconstitution", "Improved functional status and weight", "Resolution of HIV-associated symptoms", "Negative HIV transmission risk (U=U)"],
      right: ["Virologic failure (VL >200 on ART)", "IRIS (fever, lymphadenopathy after starting ART)", "Abacavir hypersensitivity (fever, rash, GI, respiratory — HLA-B*5701+)", "TDF nephrotoxicity (proximal tubulopathy, Fanconi syndrome)", "Metabolic complications (dyslipidemia, insulin resistance, weight gain)"]
    },
    medications: [{
      name: "Bictegravir/Tenofovir Alafenamide/Emtricitabine (Biktarvy)",
      type: "INSTI + Dual NRTI (Complete Single-Tablet Regimen)",
      action: "Bictegravir inhibits integrase (prevents viral DNA insertion into host genome); TAF and emtricitabine are NRTIs that cause HIV DNA chain termination. Complete regimen in one pill, once daily",
      sideEffects: "Headache, diarrhea, nausea, insomnia, weight gain; TAF has less renal/bone toxicity than TDF but may worsen lipids",
      contra: "Concurrent rifampin (reduces bictegravir levels); dofetilide; severe hepatic impairment; CrCl <30 mL/min",
      pearl: "Preferred first-line ART regimen; high genetic barrier to resistance (no documented bictegravir resistance in treatment-naive patients); single tablet once daily maximizes adherence; take with or without food; covers HBV if coinfected (do not stop without HBV alternative)"
    }],
    pearls: ["Biktarvy (BIC/TAF/FTC) is the most commonly prescribed first-line ART — one pill, once daily, high barrier to resistance", "Adherence >95% is required for viral suppression — one missed dose per week can lead to virologic failure and resistance", "HLA-B*5701 testing is MANDATORY before abacavir — positive result absolutely contraindicates abacavir (fatal hypersensitivity)", "NEVER stop TDF or TAF in HBV/HIV coinfection without an HBV-active alternative — HBV flare can be fatal", "Virologic failure: check adherence FIRST — non-adherence is the #1 cause, not drug resistance", "U=U (Undetectable = Untransmittable): sustained undetectable viral load eliminates sexual HIV transmission"],
    quiz: [
      {
        question: "A patient with HIV is being started on a regimen containing abacavir. Which test MUST be performed first?",
        options: ["Hepatitis C antibody", "HLA-B*5701 genotyping", "CD4 count", "Serum creatinine"],
        correct: 1,
        rationale: "HLA-B*5701 testing must be performed before starting abacavir. Patients who are HLA-B*5701 positive have a high risk of abacavir hypersensitivity reaction, which can be fatal upon rechallenge. A positive result absolutely contraindicates abacavir use."
      },
      {
        question: "A patient with HIV/HBV coinfection is on Biktarvy. The patient wants to simplify to a regimen without tenofovir. What is the critical concern?",
        options: ["Biktarvy cannot be changed once started", "Stopping TAF without an HBV-active alternative can cause fatal hepatitis B flare", "Tenofovir is the only drug active against HIV", "There is no concern — any ART regimen treats both"],
        correct: 1,
        rationale: "TAF and TDF are active against both HIV and HBV. Discontinuing tenofovir in HIV/HBV coinfected patients without substituting another HBV-active agent can cause life-threatening HBV reactivation and hepatic flare."
      },
      {
        question: "An HIV patient's viral load is 500 copies/mL after 6 months on ART. What is the MOST likely cause?",
        options: ["Drug resistance from a high-resistance strain", "Medication non-adherence", "Immune reconstitution inflammatory syndrome", "ART treatment failure requiring a new drug class"],
        correct: 1,
        rationale: "Non-adherence is the most common cause of virologic failure. Before assuming drug resistance, adherence must be thoroughly assessed. Missing even a few doses per week can allow viral replication and prevent achieving undetectable status."
      },
    ]
  },
  "hiv-basics-np": {
    title: "HIV Basics",
    cellular: { title: "HIV Virology, Immunology & Natural History", content: "HIV-1, a lentivirus of the Retroviridae family, contains two copies of single-stranded RNA and key enzymes (reverse transcriptase, integrase, protease) within a p24 capsid protein core surrounded by a lipid envelope studded with gp120 and gp41 glycoproteins. Viral entry requires binding of gp120 to the CD4 receptor on T-helper lymphocytes, followed by conformational change exposing gp41 which binds the CCR5 or CXCR4 co-receptor. The CCR5-delta32 homozygous mutation provides near-complete resistance to R5-tropic HIV. After entry, reverse transcriptase converts viral RNA to DNA with high error rate (one mutation per replication cycle), driving viral diversity and drug resistance. Integrase inserts proviral DNA into the host genome, establishing the latent reservoir — integrated provirus in resting memory CD4+ T cells that is invisible to the immune system and not affected by ART, representing the primary barrier to HIV cure. Acute retroviral syndrome occurs 2-4 weeks post-infection with massive viremia, CD4 destruction in gut-associated lymphoid tissue (GALT), and immune activation. The immune response partially controls viremia to a 'set point' viral load that predicts disease progression rate. Without ART, CD4 count declines ~50-70 cells/μL/year, and AIDS (CD4 <200 or AIDS-defining illness) develops in a median of 10 years. Key AIDS-defining opportunistic infections are CD4-stratified: oral thrush/VVC at <300, PCP/toxoplasmosis at <200, MAC/CMV at <50." },
    riskFactors: ["Unprotected sexual intercourse (receptive anal > receptive vaginal > insertive)", "Injection drug use with shared needles/equipment", "Perinatal transmission (mother-to-child during pregnancy, delivery, or breastfeeding)", "Occupational exposure (needlestick injury — 0.3% per percutaneous exposure)", "Presence of other STIs (genital ulcer disease increases transmission 2-5 fold)", "High community viral load in populations with low ART coverage"],
    diagnostics: ["4th generation Ag/Ab combo test (detects both p24 antigen and HIV-1/2 antibodies) — recommended initial screening", "HIV-1/2 antibody differentiation assay: confirmatory test after reactive screen; differentiates HIV-1 from HIV-2", "HIV RNA quantitative PCR (viral load): confirms acute infection during window period; monitors ART response (goal <50 copies/mL)", "CD4+ T-cell count: quantifies immune status; AIDS defined as <200; guides OI prophylaxis", "Genotypic resistance testing: performed at diagnosis and at virologic failure", "Baseline workup: CBC, CMP, lipids, HbA1c, HBV/HCV serology, RPR, TB testing, toxoplasma IgG, CMV IgG, Pap smear"],
    management: ["ART for ALL HIV+ patients regardless of CD4 count — rapid ART start (same day) improves linkage to care", "First-line: INSTI-based regimens (bictegravir/TAF/FTC or dolutegravir + TAF/FTC)", "OI prophylaxis: TMP-SMX when CD4 <200 (PCP + toxo); azithromycin when CD4 <50 (MAC)", "PrEP for high-risk HIV-negative individuals: TDF/FTC or TAF/FTC daily, or injectable cabotegravir every 2 months", "PEP: 3-drug ART within 72 hours (ideally ≤2 hours) of exposure for 28 days", "Prevention of mother-to-child transmission: ART throughout pregnancy, IV zidovudine during delivery, neonatal prophylaxis"],
    nursingActions: ["Offer opt-out HIV screening to ALL patients aged 13-64 (at least once); high-risk patients annually", "Educate on U=U principle and importance of >95% ART adherence for viral suppression", "Monitor viral load and CD4 at prescribed intervals", "Assess for OI symptoms based on CD4 level: oral thrush, PCP (dyspnea, dry cough, hypoxia), cryptococcal meningitis", "Manage ART side effects and drug interactions proactively", "Provide culturally sensitive care; address stigma, mental health, substance use, and social determinants"],
    assessmentFindings: ["Acute retroviral syndrome: fever, pharyngitis, diffuse maculopapular rash, lymphadenopathy, oral ulcers (2-4 weeks post-infection)", "Persistent generalized lymphadenopathy during clinical latency", "AIDS-defining conditions: PCP (dyspnea, dry cough, bilateral ground-glass opacities), Kaposi sarcoma (violaceous skin lesions), oral hairy leukoplakia", "Wasting syndrome (>10% unintentional weight loss with diarrhea or weakness >30 days)", "Opportunistic infections correlating with CD4 level"],
    signs: {
      left: ["Acute retroviral syndrome (fever, rash, pharyngitis, LAD)", "Oral thrush (white plaques, CD4 <300)", "Oral hairy leukoplakia (lateral tongue, EBV)", "Persistent generalized lymphadenopathy", "Weight loss and chronic diarrhea"],
      right: ["PCP: bilateral GGO on CXR, elevated LDH, hypoxia (CD4 <200)", "Kaposi sarcoma: violaceous non-blanching skin/mucosal lesions (HHV-8)", "Cryptococcal meningitis: headache, fever, elevated opening pressure (CD4 <100)", "Toxoplasmosis: ring-enhancing brain lesions (CD4 <100)", "CMV retinitis: 'pizza pie' retinal appearance (CD4 <50)"]
    },
    medications: [{
      name: "Dolutegravir (Tivicay)",
      type: "Integrase Strand Transfer Inhibitor (INSTI)",
      action: "Blocks HIV integrase from inserting viral DNA into host chromosome, preventing provirus establishment. High genetic barrier to resistance",
      sideEffects: "Insomnia, headache, weight gain, elevated CK, rarely hepatotoxicity; neural tube defect risk if conceived during first trimester (rare)",
      contra: "Concurrent dofetilide; caution with metformin (increases levels); separate from polyvalent cations by 2 hours",
      pearl: "Preferred third agent for first-line ART; ultra-high barrier to resistance; can be used as 2-drug regimen with lamivudine (Dovato) in selected patients"
    }],
    pearls: ["4th generation Ag/Ab combo test detects infection ~2 weeks earlier than antibody-only tests by detecting p24 antigen during window period", "CD4-stratified OI thresholds: <300 = thrush; <200 = PCP, toxo (start TMP-SMX); <100 = crypto, toxo; <50 = MAC, CMV (start azithromycin)", "The latent HIV reservoir (integrated provirus in resting memory CD4 T cells) is the primary barrier to cure", "Rapid ART start (same-day) improves linkage to care and viral suppression rates", "PrEP reduces HIV acquisition by >99% with consistent daily dosing", "Genotypic resistance testing at baseline guides regimen selection — transmitted drug resistance found in 10-15% of new diagnoses"],
    quiz: [
      {
        question: "A patient presents 3 weeks after a high-risk exposure with fever, pharyngitis, diffuse rash, and lymphadenopathy. The standard HIV antibody test is negative. What test should be ordered?",
        options: ["Repeat antibody test in 1 week", "4th generation Ag/Ab combo test (detects p24 antigen during window period)", "CD4 count", "Western blot"],
        correct: 1,
        rationale: "During acute HIV infection, antibodies may not yet be detectable (window period). The 4th generation test detects p24 antigen, which appears before antibodies, allowing diagnosis during acute infection."
      },
      {
        question: "At what CD4 count should PCP prophylaxis with TMP-SMX be initiated?",
        options: ["<500 cells/μL", "<300 cells/μL", "<200 cells/μL", "<50 cells/μL"],
        correct: 2,
        rationale: "PCP prophylaxis with TMP-SMX is initiated when CD4 <200. PCP is the most common AIDS-defining OI. TMP-SMX also covers toxoplasmosis. MAC prophylaxis starts at CD4 <50."
      },
      {
        question: "What is the PRIMARY barrier to achieving an HIV cure?",
        options: ["Drug resistance mutations", "The latent reservoir of integrated provirus in resting memory CD4 T cells", "Viral mutations in the envelope protein", "Lack of effective antiretroviral drugs"],
        correct: 1,
        rationale: "The latent HIV reservoir consists of integrated proviral DNA in resting memory CD4+ T cells. These cells are long-lived, invisible to the immune system, and not affected by ART. Upon cell activation, the provirus can produce new virions, causing viral rebound if ART is stopped."
      },
    ]
  },  "hiv-diagnostic-criteria-np": {
    title: "HIV: Screening vs Confirmatory Testing",
    cellular: { title: "HIV Diagnostic Algorithm", content: "The CDC-recommended HIV testing algorithm uses a sequential three-step approach. Step 1: 4th generation HIV-1/2 Ag/Ab combination immunoassay — detects both HIV-1/2 antibodies AND p24 antigen, shortening the window period to approximately 18 days. If reactive, proceed to Step 2: HIV-1/2 antibody differentiation immunoassay — confirms and differentiates HIV-1 from HIV-2. If Step 2 is nonreactive or indeterminate, proceed to Step 3: HIV-1 RNA qualitative or quantitative nucleic acid test (NAT) — detects viral RNA directly, confirming or ruling out acute HIV-1 infection during the window period. This algorithm replaces the older Western blot confirmatory test. Rapid point-of-care tests detect antibodies only and have a longer window period; reactive rapid tests require laboratory confirmation. The acute retroviral syndrome presents 2-4 weeks post-infection with a mononucleosis-like illness (fever, pharyngitis, lymphadenopathy, maculopapular rash, myalgia, oral ulcers). During ARS, viral load is extremely high (>10⁶ copies/mL) making the patient highly infectious, but antibody tests may still be negative. Screening recommendations: opt-out HIV testing for ALL persons aged 13-64 at least once; annual for high-risk populations." },
    riskFactors: ["Men who have sex with men (MSM — highest incidence group)", "Injection drug use with shared needles or equipment", "Multiple sexual partners or inconsistent condom use", "Commercial sex work", "History of other sexually transmitted infections", "Born to HIV-positive mother (perinatal transmission risk)"],
    diagnostics: ["Step 1: 4th generation Ag/Ab combo test — screens for p24 antigen and HIV-1/2 antibodies (window ~18 days)", "Step 2: HIV-1/2 antibody differentiation assay — confirms and differentiates HIV-1 from HIV-2", "Step 3: HIV-1 RNA NAT — resolves discordant results by detecting viral RNA directly", "Rapid point-of-care tests: antibody-only; reactive result requires laboratory confirmation", "Acute HIV: p24 antigen or HIV RNA viral load detects infection before antibody seroconversion", "Screening: all persons aged 13-64 at least once; annual for high-risk populations"],
    management: ["Reactive 4th gen test → reflex to antibody differentiation → if discordant, reflex to RNA NAT", "Diagnose acute HIV: reactive Ag/Ab + negative/indeterminate antibody differentiation + positive RNA NAT", "Initiate ART immediately upon HIV diagnosis — rapid or same-day start recommended", "Obtain baseline genotypic resistance testing before starting ART", "For negative patients at high risk: offer PrEP", "Test sexual partners; offer PrEP or PEP as appropriate"],
    nursingActions: ["Offer opt-out HIV screening to ALL patients aged 13-64 per CDC guidelines", "Provide pre-test counseling including window period discussion", "For reactive rapid tests: explain confirmatory laboratory testing is required", "Recognize acute retroviral syndrome and order appropriate testing", "Link HIV-positive patients to care immediately; offer PrEP to high-risk negatives", "Ensure confidentiality and non-discriminatory care"],
    assessmentFindings: ["Acute retroviral syndrome: fever, lymphadenopathy, pharyngitis, maculopapular rash, myalgia, oral ulcers", "May be asymptomatic in early chronic infection", "Extremely high viral load during acute phase (>10⁶ copies/mL)", "Reactive 4th generation screening test", "Negative antibody differentiation during acute infection (antibodies not yet formed)"],
    signs: {
      left: ["Fever, pharyngitis, lymphadenopathy (acute retroviral syndrome)", "Diffuse maculopapular rash", "Oral mucosal ulcers", "Myalgia and arthralgias", "Headache and meningismus"],
      right: ["Reactive 4th generation Ag/Ab test", "Negative antibody differentiation (window period)", "Positive HIV-1 RNA NAT (confirms acute infection)", "Extremely high viral load (>10⁶ copies/mL)", "Rapid CD4 decline during acute phase"]
    },
    medications: [{
      name: "Tenofovir Disoproxil Fumarate/Emtricitabine (Truvada for PrEP)",
      type: "NRTI Combination for Pre-Exposure Prophylaxis",
      action: "NRTIs that prevent HIV DNA synthesis. When present in target cells before exposure, they prevent establishment of infection by blocking reverse transcription",
      sideEffects: "Nausea, headache, renal impairment (monitor CrCl), decreased bone mineral density, GI upset",
      contra: "HIV-positive status (two drugs inadequate for treatment), CrCl <60 mL/min, untreated HBV",
      pearl: ">99% effective for HIV prevention with consistent daily dosing; confirm HIV-negative status before starting and every 3 months; injectable cabotegravir every 2 months is an alternative"
    }],
    pearls: ["4th gen Ag/Ab combo test is the recommended initial screening — detects p24 antigen AND antibodies, shortening window period to ~18 days", "During acute HIV, antibody tests may be NEGATIVE — p24 antigen or RNA viral load is essential", "Opt-out screening for ALL adults 13-64 at least once; high-risk annually", "Reactive rapid test requires laboratory confirmation — NOT a definitive diagnosis", "PrEP reduces HIV acquisition by >99% with consistent use", "Western blot is NO longer the confirmatory test — replaced by antibody differentiation immunoassay"],
    quiz: [
      {
        question: "A patient has a reactive 4th gen test but nonreactive antibody differentiation. What is the next step?",
        options: ["Report as HIV-negative", "Perform HIV-1 RNA NAT to evaluate for acute infection", "Repeat 4th gen test in 6 months", "No further testing needed"],
        correct: 1,
        rationale: "Reactive screen with negative confirmation suggests acute infection during the window period — p24 antigen is positive but antibodies have not developed. HIV-1 RNA NAT confirms or rules out acute infection."
      },
      {
        question: "Why is the 4th generation test preferred over older antibody-only tests?",
        options: ["It is cheaper", "It detects p24 antigen in addition to antibodies, shortening the window period by 1-2 weeks", "It eliminates confirmatory testing", "It detects all STIs"],
        correct: 1,
        rationale: "The 4th gen test detects both antibodies AND p24 antigen. During acute infection, p24 appears ~1-2 weeks before antibodies, shortening the window period from ~23-90 days to ~18 days."
      },
      {
        question: "A patient presents with fever, rash, pharyngitis, and lymphadenopathy 3 weeks after unprotected sexual contact. Standard antibody test is negative. What is MOST likely?",
        options: ["Infectious mononucleosis", "Acute HIV infection — antibodies have not yet developed", "Secondary syphilis", "Drug reaction"],
        correct: 1,
        rationale: "Classic acute retroviral syndrome occurring 2-4 weeks post-exposure. Standard antibody tests may be negative during the window period. A 4th gen Ag/Ab test or HIV RNA is needed."
      },
    ]
  },
  "hiv-management": {
    title: "HIV Management",
    cellular: { title: "Comprehensive HIV Management", content: "HIV management encompasses ART, opportunistic infection prevention and treatment, comorbidity management, and transmission prevention. ART should be initiated in ALL HIV-positive patients regardless of CD4 count. The preferred initial regimen is INSTI-based: bictegravir/TAF/emtricitabine (Biktarvy) or dolutegravir + TAF/emtricitabine. The goal is undetectable viral load (<50 copies/mL) within 12-24 weeks. OI prophylaxis is CD4-guided: TMP-SMX when CD4 <200 (PCP and toxoplasmosis), azithromycin when CD4 <50 (MAC). OI prophylaxis can be discontinued after sustained immune reconstitution (CD4 >200 for >3 months for PCP). Immune reconstitution inflammatory syndrome (IRIS) can occur 2-8 weeks after ART initiation in severely immunosuppressed patients — unmasking or paradoxical worsening of underlying OIs as the immune system recovers. Management is generally supportive with continued ART, treating the underlying OI, and corticosteroids for severe cases. Nursing priorities include adherence support (>95% adherence required), medication reconciliation for drug interactions, psychosocial support, and transmission prevention education including U=U (Undetectable = Untransmittable)." },
    riskFactors: ["All HIV-positive individuals require treatment regardless of CD4 count", "Severely immunosuppressed patients (CD4 <200) at highest OI risk", "Treatment interruption increases mortality (SMART trial)", "Drug resistance from non-adherence limits future options", "Comorbidities: cardiovascular disease, CKD, hepatitis coinfection", "Social determinants: stigma, substance use, housing instability"],
    diagnostics: ["HIV RNA viral load every 3-6 months (goal <50 copies/mL)", "CD4 count every 3-6 months until >300, then annually", "Genotypic resistance testing at diagnosis and virologic failure", "OI screening based on CD4: TB testing, toxoplasma IgG, cryptococcal antigen if CD4 <100", "Annual: lipids, glucose/HbA1c, renal function, STI screening", "Bone density screening for patients on TDF or with other risk factors"],
    management: ["Rapid ART initiation (same-day preferred) for all newly diagnosed", "INSTI-based regimen first-line: Biktarvy or dolutegravir + backbone", "OI prophylaxis: TMP-SMX at CD4 <200; azithromycin at CD4 <50", "Vaccinations: influenza, pneumococcal, hepatitis A/B, HPV; avoid live vaccines if CD4 <200", "Cardiovascular risk management: statins as indicated (avoid simvastatin/lovastatin with boosted PIs)", "IRIS: continue ART, treat underlying OI, corticosteroids for severe inflammation"],
    nursingActions: ["Assess ART adherence at every visit — non-adherence is the #1 cause of virologic failure", "Monitor for drug side effects and interactions", "Provide comprehensive patient education on disease, medications, and self-management", "Screen for depression, substance use, and social barriers to care", "Coordinate multidisciplinary care: infectious disease, pharmacy, social work, mental health", "Support partner notification and PrEP for serodiscordant partners"],
    assessmentFindings: ["Undetectable viral load and rising CD4 = successful treatment", "Virologic failure: VL >200 on ART (assess adherence first)", "IRIS: new or worsening symptoms 2-8 weeks after ART start", "OI symptoms: dry cough (PCP), headache with neck stiffness (crypto), visual changes (CMV retinitis)", "Metabolic complications: dyslipidemia, insulin resistance"],
    signs: {
      left: ["Undetectable viral load = treatment success", "Rising CD4 = immune reconstitution", "Weight gain and improved functional status", "Resolution of HIV-related symptoms", "Absence of opportunistic infections"],
      right: ["Virologic failure (VL >200 on ART)", "IRIS: paradoxical worsening of OIs after ART start", "New opportunistic infection", "Metabolic syndrome (dyslipidemia, insulin resistance)", "ART side effects (renal toxicity, weight gain)"]
    },
    medications: [{
      name: "Trimethoprim-Sulfamethoxazole (TMP-SMX, Bactrim)",
      type: "Folate Antagonist Antibiotic (OI Prophylaxis)",
      action: "Sequentially inhibits folate synthesis: sulfamethoxazole inhibits dihydropteroate synthase, trimethoprim inhibits dihydrofolate reductase. Used for PCP and toxoplasmosis prophylaxis when CD4 <200",
      sideEffects: "Rash (including SJS), nausea, bone marrow suppression, hyperkalemia, hepatotoxicity, photosensitivity",
      contra: "Severe sulfonamide allergy, megaloblastic anemia from folate deficiency, pregnancy at term",
      pearl: "DS tablet daily for PCP prophylaxis also covers toxoplasmosis; discontinue when CD4 >200 for ≥3 months on ART; alternatives: dapsone or atovaquone for sulfa allergy"
    }],
    pearls: ["ART for ALL — regardless of CD4; early treatment reduces mortality, OIs, and transmission", "Non-adherence is the #1 cause of virologic failure — assess before assuming resistance", "TMP-SMX (one DS daily) covers BOTH PCP and toxoplasmosis prophylaxis when CD4 <200", "IRIS occurs 2-8 weeks after ART initiation — continue ART unless life-threatening", "U=U: sustained undetectable viral load eliminates sexual HIV transmission", "Avoid simvastatin/lovastatin with boosted PIs — use atorvastatin or rosuvastatin"],
    quiz: [
      {
        question: "A newly diagnosed HIV patient has CD4 of 150. Besides ART, what prophylactic medication should be started?",
        options: ["Azithromycin for MAC", "Fluconazole for fungal prophylaxis", "TMP-SMX for PCP and toxoplasmosis", "Ganciclovir for CMV"],
        correct: 2,
        rationale: "TMP-SMX prophylaxis is indicated when CD4 <200 to prevent PCP and toxoplasmosis. MAC prophylaxis (azithromycin) starts at CD4 <50."
      },
      {
        question: "A patient started on ART 3 weeks ago with CD4 of 45 develops worsening lymphadenopathy and fever. MOST likely cause?",
        options: ["ART side effects", "Immune reconstitution inflammatory syndrome (IRIS)", "HIV drug resistance", "New bacterial infection"],
        correct: 1,
        rationale: "IRIS typically occurs 2-8 weeks after ART initiation in severely immunosuppressed patients. The recovering immune system mounts an inflammatory response against previously unrecognized infections."
      },
      {
        question: "What is the MOST common reason for virologic failure on ART?",
        options: ["Primary drug resistance", "Incorrect drug selection", "Medication non-adherence", "Drug interactions"],
        correct: 2,
        rationale: "Non-adherence is the most common cause of virologic failure. Even missing a few doses per week can lead to viral replication and resistance mutations."
      },
    ]
  }, "hormone-therapy-rx-np": {
    title: "Hormone Therapy Prescribing",
    cellular: { title: "Menopausal Hormone Therapy", content: "Menopausal hormone therapy (MHT) replaces declining ovarian estrogen to manage vasomotor symptoms (hot flashes, night sweats), genitourinary syndrome of menopause (vaginal atrophy, dyspareunia), and prevent osteoporosis. In women with an intact uterus, progesterone must be co-administered to prevent endometrial hyperplasia and cancer. The timing hypothesis from the WHI reanalysis demonstrates that MHT initiated within 10 years of menopause or before age 60 has favorable risk-benefit (reduced mortality, cardiovascular benefit, bone protection) vs initiating after age 60 or >10 years post-menopause (increased cardiovascular and VTE risk). Transdermal estradiol has lower VTE risk than oral (avoids first-pass hepatic clotting factor production). For genitourinary symptoms alone, low-dose vaginal estrogen is preferred — minimal systemic absorption, no concurrent progestin needed. Contraindications to systemic MHT: unexplained vaginal bleeding, active/history of breast cancer, active VTE/PE, active liver disease, known thrombophilia." },
    riskFactors: ["Menopause with moderate-severe vasomotor symptoms", "Genitourinary syndrome of menopause", "Premature ovarian insufficiency (menopause <40 — MHT recommended until age ~51)", "Osteoporosis prevention in menopausal women", "History of breast cancer (contraindication to systemic MHT)", "History of VTE or thrombophilia (contraindication to oral estrogen)"],
    diagnostics: ["Menopause: clinical diagnosis (≥12 months amenorrhea >45); FSH >30 if ambiguous", "Endometrial assessment before starting MHT if abnormal bleeding", "Mammography: baseline and regular screening before and during MHT", "DEXA scan if osteoporosis prevention is an indication", "Lipid panel and cardiovascular risk assessment", "Thrombophilia screening if VTE history"],
    management: ["Lowest effective dose for shortest duration needed", "Transdermal estradiol preferred (lower VTE risk)", "Add progestin if uterus intact: micronized progesterone 200 mg × 12 days/month or 100 mg daily", "Genitourinary symptoms alone: low-dose vaginal estrogen (no progestin needed)", "Initiate within 10 years of menopause or before age 60", "Reassess annually; taper when clinically appropriate"],
    nursingActions: ["Ensure mammography is current before initiating MHT", "Educate on transdermal patch application: clean dry trunk skin, rotate sites, avoid breasts", "Monitor for VTE symptoms: unilateral leg pain/swelling, sudden dyspnea", "Assess for abnormal vaginal bleeding — unscheduled bleeding requires evaluation", "Counsel on lifestyle measures: exercise, calcium/vitamin D, smoking cessation", "Annual risk-benefit reassessment"],
    assessmentFindings: ["Improved vasomotor symptoms", "Resolution of vaginal atrophy symptoms", "Improved bone density on follow-up DEXA", "Breakthrough bleeding (common first 3-6 months of continuous combined MHT)", "Breast tenderness (estrogen effect — usually transient)"],
    signs: {
      left: ["Reduced hot flash frequency", "Improved vaginal moisture", "Improved sleep quality", "Stable/improved bone density", "Enhanced quality of life"],
      right: ["VTE/PE (especially oral estrogen)", "Breast tenderness", "Abnormal vaginal bleeding", "Headache/migraine exacerbation", "Gallbladder disease (oral estrogen)"]
    },
    medications: [{
      name: "Estradiol Transdermal Patch (Climara, Vivelle-Dot)",
      type: "Bioidentical Estrogen — Transdermal Delivery",
      action: "Delivers 17-beta estradiol through skin bypassing hepatic first-pass metabolism. Replaces declining ovarian estrogen, reducing vasomotor symptoms and preventing bone loss",
      sideEffects: "Skin irritation at patch site, breast tenderness, headache, nausea; lower VTE risk than oral",
      contra: "Unexplained vaginal bleeding, breast cancer, active VTE/PE, active liver disease, pregnancy",
      pearl: "Preferred over oral due to lower VTE and gallbladder risk; apply to trunk, not breasts; rotate sites; MUST add progestin if uterus intact"
    }],
    pearls: ["Transdermal estradiol PREFERRED over oral — lower VTE, stroke, and gallbladder risk", "Women with intact uterus MUST receive progestin with estrogen to prevent endometrial cancer", "Timing hypothesis: MHT <10 years post-menopause = favorable risk-benefit", "Low-dose vaginal estrogen for genitourinary symptoms has minimal systemic absorption, no progestin needed", "Premature ovarian insufficiency (<40): MHT RECOMMENDED until average menopause age (~51)", "Reassess MHT annually — lowest effective dose for shortest duration"],
    quiz: [
      {
        question: "A 52-year-old with intact uterus is prescribed estrogen for hot flashes. What additional medication is REQUIRED?",
        options: ["Calcium", "Progestin to prevent endometrial hyperplasia/cancer", "Aspirin", "Bisphosphonate"],
        correct: 1,
        rationale: "Women with intact uterus must receive progestin with systemic estrogen. Unopposed estrogen increases risk of endometrial hyperplasia and cancer."
      },
      {
        question: "Why is transdermal estradiol generally preferred over oral?",
        options: ["More effective for hot flashes", "Bypasses hepatic first-pass metabolism, lowering VTE and gallbladder risk", "Does not require progestin", "Available over the counter"],
        correct: 1,
        rationale: "Transdermal avoids first-pass hepatic metabolism that increases clotting factors (VTE) and cholesterol saturation of bile (gallbladder disease)."
      },
      {
        question: "A 65-year-old requests MHT for hot flashes starting at age 55. Primary concern?",
        options: ["MHT never effective after 60", "Initiating >10 years post-menopause increases cardiovascular and VTE risk", "No concerns", "Estrogen receptors decline with age"],
        correct: 1,
        rationale: "The timing hypothesis shows MHT initiated >10 years post-menopause has increased cardiovascular and VTE risk. Non-hormonal alternatives should be considered."
      },
    ]
  }, "host-pathogen-interaction-core-np": {
    title: "Host–Pathogen Interaction: Core Concepts",
    cellular: { title: "Host-Pathogen Interaction Fundamentals", content: "Host-pathogen interactions determine the outcome of infectious encounters through the interplay between pathogen virulence factors and host immune defenses. Adhesins (pili, fimbriae) allow bacterial attachment. Biofilm formation (Pseudomonas, S. epidermidis on devices) creates antibiotic-resistant polysaccharide matrix. Capsules (S. pneumoniae, N. meningitidis, Klebsiella) prevent phagocytosis. Toxins: exotoxins are secreted proteins with specific targets (botulinum = blocks ACh release; cholera = activates adenylyl cyclase; diphtheria = inhibits protein synthesis); endotoxin (LPS from gram-negative walls) triggers massive cytokine release causing septic shock. Host defense layers: physical barriers (skin, mucosal surfaces, ciliated epithelium, gastric acid), innate immunity (neutrophils, macrophages, NK cells, complement, toll-like receptors recognizing PAMPs), and adaptive immunity (T cells — cell-mediated against intracellular pathogens; B cells — humoral antibodies against extracellular pathogens). Immunodeficiency patterns: neutropenia → bacterial/fungal infections; T-cell deficiency (HIV) → opportunistic infections (PCP, toxo, CMV); B-cell deficiency → encapsulated organisms; complement deficiency → Neisseria; splenectomy → overwhelming infection from encapsulated organisms (OPSI)." },
    riskFactors: ["Immunocompromised states: neutropenia, HIV/AIDS, transplant, chemotherapy", "Invasive devices: central lines, urinary catheters, ventilators (biofilm formation)", "Disrupted barriers: burns, surgical wounds, mucosal breaks", "Extremes of age: neonates (immature immunity), elderly (immunosenescence)", "Splenectomy: loss of opsonization of encapsulated organisms", "Chronic diseases: diabetes, cirrhosis, malnutrition"],
    diagnostics: ["Blood cultures (2 sets before antibiotics): identify bacteremia", "Gram stain: rapid gram-positive vs gram-negative identification", "Culture and sensitivity: definitive ID and antibiotic susceptibility", "Procalcitonin: elevated in bacterial infection, low in viral", "Lactate: elevated in sepsis (≥2 concerning, ≥4 = septic shock)", "Molecular diagnostics: PCR for rapid pathogen identification"],
    management: ["Empiric antibiotics based on likely pathogen, site, antibiogram, and patient factors", "De-escalate based on culture results (antibiotic stewardship)", "Source control: drain abscesses, remove infected devices, debride tissue", "Infection prevention: hand hygiene, PPE, isolation precautions", "Follow evidence-based treatment durations", "Vaccinate high-risk patients (pneumococcal, meningococcal for asplenic patients)"],
    nursingActions: ["Obtain cultures BEFORE antibiotics — but never delay antibiotics in sepsis (each hour delay increases mortality ~7%)", "Administer empiric antibiotics within 1 hour of sepsis recognition", "Monitor for antibiotic adverse effects: C. difficile, nephrotoxicity, hepatotoxicity", "Implement appropriate isolation precautions (contact, droplet, airborne)", "Monitor inflammatory markers and clinical response", "Educate on antibiotic stewardship: complete prescribed courses, no antibiotics for viral infections"],
    assessmentFindings: ["SIRS: fever >38.3°C or hypothermia <36°C, tachycardia >90, tachypnea >20, WBC >12K or <4K", "Localized infection: erythema, warmth, swelling, purulent drainage", "Sepsis: organ dysfunction with infection (altered mental status, hypotension, oliguria, elevated lactate)", "Biofilm-associated: persistent device-related infection despite antibiotics", "Toxin-mediated: secretory diarrhea (cholera), paralysis (botulism), pharyngeal membrane (diphtheria)"],
    signs: {
      left: ["Fever, tachycardia, tachypnea (systemic infection)", "Localized erythema, warmth, swelling", "Purulent drainage from wound/catheter", "Positive blood cultures", "Elevated procalcitonin"],
      right: ["Septic shock: hypotension + elevated lactate despite fluids", "Device infection requiring removal (biofilm)", "C. difficile colitis (antibiotic-associated)", "Opportunistic infections in immunocompromised", "Drug-resistant organisms (MRSA, VRE, ESBL)"]
    },
    medications: [{
      name: "Vancomycin",
      type: "Glycopeptide Antibiotic",
      action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors. Bactericidal against gram-positive organisms including MRSA",
      sideEffects: "Nephrotoxicity, ototoxicity, Red Man syndrome (rate-related histamine release — slow infusion), thrombocytopenia",
      contra: "Known hypersensitivity; dose adjust for renal impairment",
      pearl: "Target AUC/MIC 400-600; infuse over ≥60 min to prevent Red Man syndrome (NOT a true allergy — slow the rate); first-line for serious MRSA infections"
    }],
    pearls: ["Obtain cultures BEFORE antibiotics — but NEVER delay antibiotics in sepsis to wait for cultures", "Red Man syndrome = rate-related histamine release, NOT an allergy — slow the vancomycin infusion rate", "Encapsulated organisms (SHiN: S. pneumoniae, H. influenzae, N. meningitidis) cause OPSI in asplenic patients", "Endotoxin (LPS) from gram-negatives causes septic shock via massive cytokine release", "Procalcitonin helps differentiate bacterial (elevated) from viral (low) infection", "Biofilm infections often require device removal — antibiotics cannot penetrate the biofilm matrix"],
    quiz: [
      {
        question: "A patient develops flushing during vancomycin infusion. Most appropriate action?",
        options: ["Stop permanently and document allergy", "Slow the infusion and give diphenhydramine — this is Red Man syndrome, not an allergy", "Give epinephrine for anaphylaxis", "Switch to oral vancomycin"],
        correct: 1,
        rationale: "Red Man syndrome is histamine-mediated from rapid infusion, NOT a true allergy. Manage by slowing the rate and premedicating with diphenhydramine."
      },
      {
        question: "A splenectomized patient presents with high fever and rapidly progressive illness. Which organisms are MOST concerning?",
        options: ["E. coli and Pseudomonas", "S. pneumoniae, H. influenzae, N. meningitidis (encapsulated organisms)", "MRSA", "C. difficile"],
        correct: 1,
        rationale: "Asplenic patients are at high risk for OPSI from encapsulated organisms because the spleen is essential for opsonization and clearance of these bacteria."
      },
      {
        question: "When should blood cultures be obtained in suspected sepsis?",
        options: ["After first dose of antibiotics", "BEFORE antibiotics — but never delay antibiotics to wait for cultures", "Only if patient doesn't improve in 48 hours", "Not needed if source is obvious"],
        correct: 1,
        rationale: "Cultures should be obtained before antibiotics to maximize pathogen identification. However, antibiotic administration must NOT be delayed in sepsis — each hour of delay increases mortality ~7%."
      },
    ]
  },
  "host-pathogen-interaction-np": {
    title: "Host–Pathogen Interaction: Immune Evasion",
    cellular: { title: "Pathogen Immune Evasion Strategies", content: "Successful pathogens have evolved sophisticated mechanisms to evade host immune defenses. Antigenic variation: influenza undergoes antigenic drift (point mutations — annual epidemics) and antigenic shift (genome reassortment — pandemics); Trypanosoma brucei cycles through ~1,000 variant surface glycoproteins; HIV has extremely high mutation rate generating diverse quasispecies. Intracellular survival: M. tuberculosis inhibits phagosome-lysosome fusion; Listeria escapes the phagosome using listeriolysin O and spreads cell-to-cell via actin polymerization; Toxoplasma creates its own parasitophorous vacuole. Complement evasion: S. aureus protein A binds IgG Fc preventing opsonization; Strep pyogenes M protein prevents complement deposition. Superantigens (TSST-1, erythrogenic toxin) cross-link MHC-II and TCR non-specifically, causing polyclonal T-cell activation and cytokine storm (toxic shock syndrome). Molecular mimicry: Group A Strep M protein mimics cardiac myosin → rheumatic fever; Campylobacter LOS mimics gangliosides → Guillain-Barré syndrome. Immune suppression: HIV destroys CD4+ T cells; measles causes immune amnesia by destroying memory cells." },
    riskFactors: ["Immunocompromised hosts cannot contain immune-evasive pathogens", "Antibiotic resistance amplifies pathogen survival", "Chronic infections (TB, HIV, hepatitis) leverage immune evasion", "Biofilm formation on medical devices", "Prior antibiotic exposure selects resistant organisms", "Geographic exposure to endemic pathogens"],
    diagnostics: ["Molecular diagnostics (PCR, sequencing) for immune-evasive pathogens", "Serologic testing for intracellular pathogens (TB, EBV, CMV)", "Extended-incubation cultures for slow-growing organisms (mycobacteria)", "Antigen detection: galactomannan (Aspergillus), beta-D-glucan (fungal), cryptococcal antigen", "Resistance gene detection: mecA (MRSA), vanA/vanB (VRE), ESBL genes", "Immunologic workup for recurrent infections"],
    management: ["Combination antimicrobials for immune-evasive pathogens (RIPE for TB)", "Prolonged treatment for intracellular pathogens (TB 6-9 months, endocarditis 4-6 weeks)", "Source control: remove biofilm-harboring devices", "Immunomodulation: vaccines targeting conserved antigens", "Appropriate isolation precautions (airborne for TB, contact for MRSA)", "Antibiotic stewardship to prevent resistance"],
    nursingActions: ["Implement isolation: airborne for TB (negative pressure, N95), contact for MRSA/VRE/C. diff, droplet for influenza", "Administer multi-drug regimens correctly; educate on completing full courses", "Monitor DOT (directly observed therapy) for TB", "Assess for superantigen-mediated toxic shock: rapid fever, diffuse rash, hypotension", "Educate on annual influenza vaccination (antigenic drift)", "Monitor for post-infectious autoimmune complications (rheumatic fever, GBS)"],
    assessmentFindings: ["Chronic/relapsing infection despite appropriate antibiotics (immune evasion or biofilm)", "Toxic shock: sudden fever, diffuse rash, hypotension, multi-organ dysfunction", "Rheumatic fever post-streptococcal pharyngitis: carditis, migratory polyarthritis, chorea", "Persistent positive cultures (biofilm or intracellular pathogen)", "Recurrent infections suggesting immunodeficiency"],
    signs: {
      left: ["Persistent fever despite antibiotics (intracellular pathogen)", "Recurrent device infections (biofilm)", "Superantigen toxicity: diffuse erythroderma", "Post-infectious autoimmunity", "Chronic granulomatous inflammation"],
      right: ["TB: cough >3 weeks, night sweats, upper lobe cavitation", "Influenza antigenic shift: pandemic strain", "MRSA: methicillin-resistant Staph (mecA gene)", "C. diff: antibiotic-associated diarrhea", "Group A Strep → rheumatic fever → carditis"]
    },
    medications: [{
      name: "Rifampin (Rifampicin)",
      type: "RNA Polymerase Inhibitor",
      action: "Inhibits bacterial DNA-dependent RNA polymerase, blocking mRNA synthesis. Penetrates intracellular compartments to kill organisms within macrophages",
      sideEffects: "Hepatotoxicity, orange body fluids (urine, tears, sweat), potent CYP450 inducer (decreases warfarin, OCP, antiretroviral levels)",
      contra: "Concurrent protease inhibitors, active hepatitis",
      pearl: "NEVER use as monotherapy (rapid resistance); always part of multi-drug regimen; potent CYP3A4 inducer — check ALL interactions; warn about orange body fluids and contact lens staining; monitor LFTs monthly"
    }],
    pearls: ["Antigenic DRIFT = point mutations (annual epidemics); SHIFT = genome reassortment (pandemics)", "Superantigens cross-link MHC-II and TCR directly → massive T-cell activation → cytokine storm → toxic shock", "Molecular mimicry: Strep M protein mimics cardiac myosin → rheumatic fever; Campylobacter LOS mimics gangliosides → GBS", "TB survives INSIDE macrophages by preventing phagosome-lysosome fusion — requires cell-mediated immunity", "Rifampin causes orange body fluids — warn about contact lens staining", "Biofilm infections often REQUIRE device removal"],
    quiz: [
      {
        question: "A patient develops sudden fever, diffuse sunburn-like rash, and hypotension with a retained tampon. What is the mechanism?",
        options: ["Direct bacterial invasion", "Endotoxin release", "Superantigen (TSST-1) causing polyclonal T-cell activation and cytokine storm", "Allergic reaction"],
        correct: 2,
        rationale: "Staphylococcal toxic shock syndrome from TSST-1, a superantigen that non-specifically cross-links MHC-II and T-cell receptors, activating massive numbers of T cells and causing cytokine storm."
      },
      {
        question: "How does M. tuberculosis evade the immune system?",
        options: ["Polysaccharide capsule prevents phagocytosis", "Survives INSIDE macrophages by inhibiting phagosome-lysosome fusion", "Rapid antigenic variation", "Exotoxin destroys phagocytes"],
        correct: 1,
        rationale: "TB is phagocytosed by macrophages but prevents phagosome-lysosome fusion, surviving intracellularly. Cell-mediated immunity (IFN-gamma-activated macrophages) is essential for control."
      },
      {
        question: "A child develops migratory polyarthritis and a new heart murmur 2 weeks after strep pharyngitis. What mechanism?",
        options: ["Direct bacterial invasion", "Superantigen cytokine storm", "Molecular mimicry — Strep M protein resembles cardiac myosin, triggering autoimmune cross-reactivity", "Endotoxin inflammation"],
        correct: 2,
        rationale: "Rheumatic fever occurs through molecular mimicry: antibodies against Strep M protein cross-react with cardiac myosin and other host proteins, causing autoimmune inflammation."
      },
    ]
  },
  "h-pylori-regimens-np": {
    title: "H. pylori Treatment Regimens",
    cellular: { title: "H. pylori Eradication Therapy", content: "Helicobacter pylori is a gram-negative, microaerophilic, spiral-shaped bacterium colonizing ~50% of the world's gastric mucosa. It produces urease converting urea to ammonia, creating an alkaline microenvironment for colonization. H. pylori causes chronic gastritis, peptic ulcer disease (90% duodenal, 70% gastric ulcers), gastric MALT lymphoma, and gastric adenocarcinoma (WHO Group 1 carcinogen). Eradication is indicated for: active PUD, history of PUD, MALT lymphoma, post-gastric cancer resection, uninvestigated dyspepsia <60 without alarm features, chronic NSAID users, and unexplained IDA or ITP. First-line depends on local clarithromycin resistance: if <15%, triple therapy (PPI + clarithromycin + amoxicillin × 14 days); if ≥15% or unknown (most US settings), bismuth quadruple therapy (PPI + bismuth + metronidazole + tetracycline × 14 days) or concomitant therapy (PPI + clarithromycin + amoxicillin + metronidazole × 14 days). Confirm eradication ≥4 weeks after therapy using urea breath test or fecal antigen (NOT serology — antibodies persist). Hold PPIs ≥2 weeks and antibiotics ≥4 weeks before testing." },
    riskFactors: ["Peptic ulcer disease (90% of duodenal ulcers are H. pylori-associated)", "Gastric MALT lymphoma (eradication can cure early-stage)", "Long-term NSAID/aspirin use (synergistic ulcer risk)", "Family history of gastric cancer (H. pylori is Group 1 carcinogen)", "Immigrant from high-prevalence region", "Unexplained iron deficiency anemia or ITP"],
    diagnostics: ["Urea breath test (UBT): non-invasive, high accuracy; labeled urea converted to CO₂ by urease", "Fecal antigen test: non-invasive, comparable accuracy to UBT", "Endoscopic biopsy with rapid urease test (CLOtest)", "Histopathology: Giemsa or Warthin-Starry staining", "Serology (IgG): indicates exposure but CANNOT confirm active infection or eradication", "Hold PPIs ≥2 weeks, antibiotics ≥4 weeks before UBT or fecal antigen"],
    management: ["First-line (clarithromycin resistance ≥15%/unknown): bismuth quadruple therapy × 14 days", "First-line (resistance <15%): triple therapy × 14 days (PPI + clarithromycin + amoxicillin)", "Concomitant therapy alternative: PPI + clarithromycin + amoxicillin + metronidazole × 14 days", "Penicillin allergy: substitute metronidazole or use bismuth quadruple therapy", "Confirm eradication ≥4 weeks post-treatment using UBT or fecal antigen (NOT serology)", "Salvage therapy: use different antibiotics than initial regimen"],
    nursingActions: ["Educate on completing full 14-day course despite complex regimen", "Counsel: PPI 30-60 minutes before meals", "Warn about bismuth side effects: black stools and tongue (harmless but alarming)", "Advise avoiding alcohol with metronidazole (disulfiram-like reaction)", "Ensure PPIs held ≥2 weeks before eradication testing", "Assess for antibiotic adverse effects: C. difficile, metallic taste, photosensitivity"],
    assessmentFindings: ["Epigastric pain: duodenal ulcer relieved by eating; gastric ulcer worsened by eating", "Nausea, bloating, early satiety", "GI bleeding: hematemesis or melena", "Iron deficiency anemia", "Halitosis"],
    signs: {
      left: ["Epigastric tenderness", "Positive UBT or fecal antigen", "Dyspepsia: bloating, nausea, early satiety", "Iron deficiency anemia", "Positive rapid urease test"],
      right: ["Duodenal ulcer (pain relieved by eating)", "Gastric ulcer (pain worsened by eating)", "GI hemorrhage: melena or hematemesis", "MALT lymphoma", "Gastric adenocarcinoma (long-term risk)"]
    },
    medications: [{
      name: "Bismuth Subsalicylate (Pepto-Bismol)",
      type: "Cytoprotective/Antimicrobial Agent",
      action: "Direct bactericidal effect against H. pylori; coats ulcer base providing cytoprotection; mild acid-neutralizing effect",
      sideEffects: "Black stools and tongue (harmless bismuth sulfide), tinnitus (salicylate), constipation",
      contra: "Aspirin/salicylate allergy, children with viral illness (Reye syndrome risk), anticoagulant use",
      pearl: "WARN patients that black stools are EXPECTED and NOT blood; contains salicylate — check aspirin allergy; part of bismuth quadruple therapy"
    }],
    pearls: ["Bismuth quadruple therapy is preferred first-line in most US settings (clarithromycin resistance >15%)", "Black stools from bismuth are EXPECTED — educate patients to distinguish from melena", "Metronidazole + alcohol = disulfiram-like reaction — avoid alcohol during and 3 days after therapy", "Serology CANNOT confirm eradication — use UBT or fecal antigen ≥4 weeks after treatment", "Hold PPIs ≥2 weeks before eradication testing to prevent false negatives", "H. pylori eradication can CURE early-stage gastric MALT lymphoma"],
    quiz: [
      {
        question: "After H. pylori eradication therapy, which test confirms eradication?",
        options: ["H. pylori serology", "Urea breath test ≥4 weeks after completing therapy", "Repeat endoscopy", "Fecal occult blood test"],
        correct: 1,
        rationale: "UBT or fecal antigen ≥4 weeks after therapy confirms eradication. Serology cannot be used — antibodies persist for months to years."
      },
      {
        question: "A patient on bismuth quadruple therapy calls about black stools. Appropriate response?",
        options: ["Go to the ED for possible GI bleeding", "Black stools are expected from bismuth and are harmless — not blood", "Stop bismuth immediately", "Order stool guaiac before reassuring"],
        correct: 1,
        rationale: "Bismuth causes black stools (bismuth sulfide) — harmless and expected. Patients should be educated BEFORE starting therapy."
      },
      {
        question: "A patient on metronidazole for H. pylori asks about having wine with dinner. What to advise?",
        options: ["Small amount is fine", "Avoid all alcohol during metronidazole and for 3 days after — disulfiram-like reaction", "Only beer should be avoided", "Only IV metronidazole interacts with alcohol"],
        correct: 1,
        rationale: "Metronidazole inhibits aldehyde dehydrogenase, causing acetaldehyde accumulation with alcohol — producing severe nausea, vomiting, flushing."
      },
    ]
  },
  "hrt-prescribing-np": {
    title: "HRT Prescribing & Monitoring",
    cellular: { title: "HRT Monitoring & Risk Management", content: "HRT/MHT prescribing requires careful risk-benefit assessment and monitoring. The WHI timing hypothesis: MHT initiated within 10 years of menopause or before age 60 provides net benefit (reduced mortality, cardiovascular protection, bone protection), while starting >10 years post-menopause increases cardiovascular and VTE risk. Risk assessment before prescribing: breast cancer risk (family history, BRCA status), cardiovascular risk, VTE history, liver disease, and migraine with aura (relative contraindication). Absolute contraindications: active/history of breast cancer, unexplained vaginal bleeding, active VTE/PE, active liver disease, known thrombophilia. Prescribing principles: lowest effective dose, shortest needed duration; transdermal preferred (lower VTE, gallbladder, triglyceride risk); progestin required if uterus intact (micronized progesterone preferred over synthetic progestins for metabolic and breast safety); vaginal estrogen for isolated genitourinary symptoms. Monitoring: annual breast exam/mammography, bleeding pattern assessment, blood pressure, cardiovascular risk reassessment, annual taper consideration." },
    riskFactors: ["Menopausal women with vasomotor symptoms", "Premature ovarian insufficiency (menopause <40 — strong MHT indication)", "History of breast cancer (absolute contraindication)", "History of VTE or thrombophilia (avoid oral estrogen)", "Cardiovascular disease (unfavorable if >10 years post-menopause)", "Migraine with aura (relative contraindication)"],
    diagnostics: ["Menopause confirmation: clinical diagnosis; FSH >30 if ambiguous", "Breast cancer risk assessment: mammography, density evaluation, BRCA if indicated", "Endometrial assessment if abnormal bleeding", "Cardiovascular risk assessment", "VTE risk assessment and thrombophilia screening if indicated", "DEXA scan if osteoporosis prevention is an indication"],
    management: ["Lowest effective dose for shortest needed duration — reassess annually", "Transdermal estradiol preferred (lower VTE/gallbladder risk)", "Micronized progesterone preferred over synthetic progestins (better safety profile)", "Continuous combined: daily estrogen + daily progestin (amenorrhea after initial breakthrough)", "Cyclic: daily estrogen + progestin 12-14 days/month (withdrawal bleeding)", "Taper after 3-5 years; abrupt discontinuation causes symptom rebound in ~50%"],
    nursingActions: ["Annual breast exam and mammography during MHT", "Monitor blood pressure regularly", "Educate on VTE warning signs: leg pain/swelling, dyspnea, chest pain", "Assess bleeding patterns: unscheduled bleeding after 6 months requires evaluation", "Counsel on transdermal application: clean dry trunk skin, rotate sites", "Annual risk-benefit reassessment"],
    assessmentFindings: ["Resolution of vasomotor symptoms", "Improved sleep and mood", "Improved vaginal health", "Breakthrough bleeding (common first 3-6 months of continuous combined)", "Breast tenderness (usually transient)"],
    signs: {
      left: ["Reduced hot flashes", "Improved sleep and QoL", "Stable/improved bone density", "Resolution of vaginal dryness", "Improved mood and cognition"],
      right: ["VTE symptoms: leg swelling, dyspnea", "Unscheduled vaginal bleeding", "Breast changes", "Headache/migraine worsening", "Blood pressure elevation"]
    },
    medications: [{
      name: "Micronized Progesterone (Prometrium)",
      type: "Bioidentical Progestogen",
      action: "Opposes estrogen-stimulated endometrial proliferation, preventing hyperplasia and cancer. Micronized for improved oral bioavailability",
      sideEffects: "Drowsiness (take at bedtime — allopregnanolone metabolite), bloating, breast tenderness, mood changes",
      contra: "Peanut allergy (contains peanut oil), active liver disease, breast cancer, undiagnosed vaginal bleeding",
      pearl: "Preferred over synthetic progestins (MPA) for breast/CV safety; take at BEDTIME (sedative metabolite); contraindicated in peanut allergy — use norethindrone acetate instead"
    }],
    pearls: ["Micronized progesterone has BETTER safety profile than synthetic progestins", "Prometrium contains PEANUT OIL — contraindicated in peanut allergy; use norethindrone acetate", "Take Prometrium at BEDTIME — sedative metabolite is actually beneficial for menopausal sleep", "Transdermal estrogen has LOWER VTE risk than oral", "Annual reassessment is mandatory", "Unscheduled bleeding after 6 months of continuous MHT requires endometrial evaluation"],
    quiz: [
      {
        question: "A menopausal woman on continuous combined MHT has unscheduled bleeding at 9 months. Appropriate action?",
        options: ["Reassure — breakthrough bleeding is normal at any time", "Perform endometrial evaluation — unscheduled bleeding after 6 months requires workup", "Increase estrogen dose", "Stop MHT immediately"],
        correct: 1,
        rationale: "Unscheduled bleeding beyond 6 months requires endometrial evaluation (TVUS or biopsy) to rule out hyperplasia or cancer."
      },
      {
        question: "A patient with peanut allergy is prescribed Prometrium. What is the concern?",
        options: ["No concern", "Prometrium contains peanut oil — contraindicated; use norethindrone acetate", "Only affects absorption", "Take antihistamine before each dose"],
        correct: 1,
        rationale: "Prometrium capsules contain peanut oil — absolute contraindication in peanut allergy. Norethindrone acetate is a safe alternative."
      },
      {
        question: "Why is transdermal estradiol preferred over oral for MHT?",
        options: ["More effective for hot flashes", "Bypasses hepatic first-pass metabolism, reducing VTE, gallbladder disease, and triglyceride risk", "Eliminates need for progestin", "No side effects"],
        correct: 1,
        rationale: "Transdermal bypasses first-pass hepatic metabolism that increases clotting factors (VTE) and cholesterol saturation of bile (gallbladder disease)."
      },
    ]
  }
};
