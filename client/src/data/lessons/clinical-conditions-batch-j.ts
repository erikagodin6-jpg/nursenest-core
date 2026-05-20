import type { LessonContent } from "./types";

export const clinicalConditionsBatchJLessons: Record<string, LessonContent> = {
  "chlamydia-management-rpn": {
    title: "Chlamydia",
    cellular: {
      title: "Chlamydia Trachomatis Infection",
      content: "Chlamydia is the most common bacterial sexually transmitted infection (STI) caused by Chlamydia trachomatis, an obligate intracellular bacterium. It infects columnar epithelial cells of the cervix, urethra, rectum, and pharynx. Transmission occurs through oral, anal, or vaginal sexual contact, sharing sex toys, or vertically from mother to neonate during delivery. Most infections are asymptomatic, which facilitates transmission and delays treatment. The nurse monitors for symptoms, reinforces medication adherence, provides patient education on prevention, and reports findings to the healthcare team."
    },
    riskFactors: [
      "Age less than 25 years",
      "Multiple sexual partners",
      "History of prior STI",
      "Inconsistent or no barrier contraception use",
      "New sexual partner within 60 days",
      "Co-infection with gonorrhea (high rates of co-infection)"
    ],
    diagnostics: [
      "Assist with specimen collection for nucleic acid amplification test (NAAT)",
      "Collect urine sample or assist with vaginal/cervical swab as directed",
      "Report positive results to the nurse for follow-up and partner notification",
      "Note concurrent testing for gonorrhea is standard practice",
      "Monitor for symptoms of complications such as pelvic pain or fever"
    ],
    management: [
      "Administer prescribed antibiotics as ordered (doxycycline or azithromycin for pregnant clients)",
      "Reinforce importance of completing full course of antibiotics",
      "Educate patient to avoid sexual intercourse for 7 days after starting antibiotics",
      "Facilitate partner notification and treatment referral",
      "Report positive results to public health officials as required",
      "Schedule follow-up STI screening at 3 months post-treatment"
    ],
    nursingActions: [
      "Assess for signs and symptoms: urethritis, dysuria, abnormal discharge",
      "Monitor for cervicitis signs: spotting, postcoital bleeding, red inflamed cervix",
      "Report pelvic pain or fever that may indicate PID",
      "Provide non-judgmental patient education on STI prevention",
      "Document and report all findings to the RN",
      "Reinforce barrier contraception use and routine screening"
    ],
    signs: {
      left: [
        "Most patients are asymptomatic",
        "Urethritis with painful or burning urination",
        "Cervicitis with red, inflamed cervix",
        "Spotting or postcoital bleeding",
        "Mild watery or mucoid discharge (males)"
      ],
      right: [
        "Unilateral scrotal swelling (epididymitis)",
        "Pelvic inflammatory disease (PID)",
        "Lower abdominal pain",
        "Fever and malaise (if ascending infection)",
        "Neonatal conjunctivitis (vertical transmission)"
      ]
    },
    medications: [
      { name: "Doxycycline", type: "Tetracycline antibiotic", action: "Inhibits bacterial protein synthesis by binding to the 30S ribosomal subunit", sideEffects: "Photosensitivity, GI upset, esophageal irritation", contra: "Pregnancy, children under 8 years", pearl: "First-line treatment for chlamydia. Take with full glass of water, avoid lying down for 30 minutes after. Administer as ordered." },
      { name: "Azithromycin", type: "Macrolide antibiotic", action: "Inhibits bacterial protein synthesis by binding to the 50S ribosomal subunit", sideEffects: "GI upset, diarrhea, QT prolongation", contra: "History of cholestatic jaundice with prior azithromycin use", pearl: "Preferred treatment during pregnancy. Single-dose option improves adherence. Report any cardiac symptoms." }
    ],
    pearls: [
      "Most chlamydia infections are asymptomatic, making routine screening essential for at-risk populations",
      "Always test concurrently for gonorrhea due to high co-infection rates",
      "Pregnant clients receive azithromycin instead of doxycycline",
      "Partner notification and treatment is critical to prevent reinfection",
      "Untreated chlamydia can lead to PID, infertility, and ectopic pregnancy"
    ],
    quiz: [
      { question: "Which finding should the nurse report immediately in a patient being screened for chlamydia?", options: ["Clear urethral discharge", "Pelvic pain with fever", "Mild dysuria", "Request for STI testing"], correct: 1, rationale: "Pelvic pain with fever may indicate ascending infection (PID), a serious complication of chlamydia requiring immediate medical attention." },
      { question: "A patient asks why they need to be tested for gonorrhea when they were diagnosed with chlamydia. What is the best response?", options: ["Gonorrhea and chlamydia are the same infection", "There is a high rate of co-infection between the two STIs", "Gonorrhea testing is optional", "The tests use different specimens"], correct: 1, rationale: "Chlamydia and gonorrhea frequently co-occur, so concurrent testing is standard practice to ensure both infections are identified and treated." },
      { question: "Which instruction should the nurse reinforce for a patient starting doxycycline for chlamydia?", options: ["Take on an empty stomach", "Avoid sun exposure and use sunscreen", "Discontinue after symptoms resolve", "Take with dairy products"], correct: 1, rationale: "Doxycycline causes photosensitivity. Patients should avoid excessive sun exposure and use sunscreen. The full course must be completed regardless of symptom resolution." }
    ]
  },

  "chlamydia-management-rn": {
    title: "Chlamydia",
    cellular: {
      title: "Pathophysiology of Chlamydial Infection",
      content: "Chlamydia trachomatis is an obligate intracellular gram-negative bacterium that infects columnar epithelial cells through a unique biphasic developmental cycle. Elementary bodies (infectious form) attach to and enter host cells, converting to reticulate bodies (replicative form) within inclusion vacuoles. After replication, they convert back to elementary bodies and lyse the cell. This cycle triggers mucosal inflammation, recruitment of neutrophils, and potential scarring. Ascending infection from the cervix to the upper reproductive tract causes pelvic inflammatory disease (PID), salpingitis, and tubo-ovarian abscess, leading to infertility and ectopic pregnancy. The nurse coordinates comprehensive screening, manages treatment protocols, provides partner notification counseling, and monitors for complications."
    },
    riskFactors: [
      "Age less than 25 years (highest prevalence group)",
      "Multiple or new sexual partners",
      "History of STI or prior chlamydia infection",
      "Inconsistent barrier contraception use",
      "Commercial sex work",
      "Men who have sex with men (MSM)",
      "Co-infection with other STIs including HIV"
    ],
    diagnostics: [
      "Order nucleic acid amplification test (NAAT) on urine or cervical/vaginal swab",
      "Perform concurrent gonorrhea testing (dual NAAT panel)",
      "Order additional STI screening: HIV, syphilis, hepatitis B as indicated",
      "Assess for signs of ascending infection: cervical motion tenderness, adnexal tenderness",
      "Obtain urine pregnancy test before prescribing treatment",
      "Monitor inflammatory markers if PID is suspected (elevated WBC, ESR, CRP)"
    ],
    management: [
      "Initiate prescribed antibiotic therapy: doxycycline 100mg BID x 7 days (first-line)",
      "Prescribe azithromycin 1g single dose for pregnant patients",
      "Implement expedited partner therapy (EPT) where legally permitted",
      "Report positive results to public health department as mandated",
      "Schedule test of cure at 4 weeks for pregnant patients",
      "Schedule repeat screening at 3 months post-treatment for all patients",
      "Assess and treat for concurrent PID if clinical findings warrant"
    ],
    nursingActions: [
      "Perform comprehensive sexual health history using non-judgmental approach",
      "Assess for signs and symptoms of chlamydia and complications",
      "Evaluate for cervicitis: erythema, friability, mucopurulent discharge",
      "Perform bimanual exam assessment for cervical motion tenderness if trained",
      "Coordinate partner notification and provide resources for contact tracing",
      "Educate on STI prevention: barrier methods, routine screening, risk reduction",
      "Provide contraception counseling and resources",
      "Document and report all positive results per public health requirements"
    ],
    signs: {
      left: [
        "Asymptomatic (majority of cases)",
        "Mucopurulent cervical discharge",
        "Dysuria and urinary frequency",
        "Intermenstrual or postcoital bleeding",
        "Watery or mucoid urethral discharge in males"
      ],
      right: [
        "Cervical motion tenderness (PID indicator)",
        "Bilateral lower abdominal tenderness",
        "Epididymitis with unilateral scrotal pain",
        "Reactive arthritis (Reiter syndrome)",
        "Neonatal pneumonia or conjunctivitis"
      ]
    },
    medications: [
      { name: "Doxycycline", type: "Tetracycline antibiotic", action: "Inhibits bacterial protein synthesis at the 30S ribosomal subunit, bacteriostatic against C. trachomatis", sideEffects: "Photosensitivity, esophageal ulceration, GI disturbance, vaginal candidiasis", contra: "Pregnancy, breastfeeding, children under 8 years (tooth discoloration)", pearl: "First-line per CDC guidelines. 95% cure rate. Take upright with full glass of water. Avoid dairy within 2 hours of dosing." },
      { name: "Azithromycin", type: "Macrolide antibiotic", action: "Binds 50S ribosomal subunit, inhibiting translocation; achieves high intracellular concentration in infected tissue", sideEffects: "Nausea, diarrhea, abdominal pain, QT prolongation (rare)", contra: "Known hypersensitivity, severe hepatic impairment", pearl: "Single 1g dose alternative. Safe in pregnancy. Slightly lower efficacy than doxycycline 7-day course. Directly observed therapy option for adherence concerns." },
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Inhibits cell wall synthesis by binding penicillin-binding proteins", sideEffects: "Injection site pain, diarrhea, allergic reaction", contra: "Cephalosporin allergy, neonates with hyperbilirubinemia", pearl: "Added to chlamydia treatment when gonorrhea co-infection is confirmed or suspected. 500mg IM single dose." }
    ],
    pearls: [
      "Chlamydia is the most commonly reported bacterial STI worldwide; routine screening of sexually active women under 25 is recommended annually",
      "Doxycycline 7-day course has replaced single-dose azithromycin as first-line due to superior efficacy",
      "Expedited partner therapy (EPT) allows treating partners without clinical evaluation where legally permitted",
      "Test of cure is only routinely recommended for pregnant patients at 4 weeks post-treatment",
      "Repeat infection screening at 3 months is essential as reinfection rates are high"
    ],
    quiz: [
      { question: "Which diagnostic test is the gold standard for chlamydia detection?", options: ["Culture and sensitivity", "Nucleic acid amplification test (NAAT)", "Rapid antigen test", "Gram stain of discharge"], correct: 1, rationale: "NAAT is the gold standard for chlamydia detection due to its high sensitivity and specificity. It can be performed on urine or genital swab specimens." },
      { question: "A pregnant patient tests positive for chlamydia. Which antibiotic does the nurse anticipate?", options: ["Doxycycline 100mg BID x 7 days", "Azithromycin 1g single dose", "Ciprofloxacin 500mg BID", "Metronidazole 500mg BID"], correct: 1, rationale: "Azithromycin is the preferred treatment for chlamydia in pregnancy because doxycycline is contraindicated due to risk of tooth discoloration and bone growth inhibition in the fetus." },
      { question: "When should a patient treated for chlamydia return for repeat screening?", options: ["1 week", "1 month", "3 months", "6 months"], correct: 2, rationale: "Repeat screening at 3 months post-treatment is recommended for all patients treated for chlamydia due to high reinfection rates, regardless of whether the partner was treated." }
    ]
  },

  "chlamydia-management-np": {
    title: "Chlamydia",
    cellular: {
      title: "Microbiology and Treatment Resistance",
      content: "Chlamydia trachomatis is an obligate intracellular pathogen with a unique biphasic life cycle alternating between infectious elementary bodies (EBs) and metabolically active reticulate bodies (RBs). The organism evades immune clearance through antigenic variation and inhibition of phagolysosomal fusion. Repeated infections cause a robust inflammatory response with tissue fibrosis and scarring, particularly in the fallopian tubes. Serovars D-K cause urogenital infections, while serovars L1-L3 cause lymphogranuloma venereum (LGV), a more invasive variant seen in MSM. The clinician must apply evidence-based prescribing guidelines, manage complicated presentations including PID and epididymo-orchitis, implement population-level screening strategies, and address antibiotic stewardship in STI management."
    },
    riskFactors: [
      "Age <25 (highest incidence and prevalence)",
      "Multiple concurrent sexual partners",
      "Inconsistent condom use",
      "History of chlamydia (30% reinfection rate within 12 months)",
      "MSM (risk for LGV serovars)",
      "HIV co-infection (impaired immune clearance)",
      "Substance use associated with high-risk sexual behavior",
      "Incarcerated populations"
    ],
    diagnostics: [
      "Order NAAT (sensitivity >95%, specificity >99%) on first-void urine, endocervical, vaginal, pharyngeal, or rectal swab based on exposure history",
      "Order comprehensive STI panel: gonorrhea NAAT, HIV Ag/Ab, RPR/VDRL, hepatitis B surface antigen",
      "Assess for PID using CDC clinical criteria: cervical motion tenderness, uterine tenderness, or adnexal tenderness",
      "Order pelvic ultrasound if tubo-ovarian abscess is suspected",
      "Consider LGV testing (rectal chlamydia NAAT with genotyping) in MSM with proctitis",
      "Order pregnancy test before initiating treatment to guide antibiotic selection"
    ],
    management: [
      "Prescribe doxycycline 100mg PO BID x 7 days (first-line per 2021 CDC guidelines)",
      "Prescribe azithromycin 1g PO single dose as alternative (pregnancy, adherence concerns)",
      "For rectal chlamydia or LGV: doxycycline 100mg PO BID x 21 days",
      "For PID: ceftriaxone 500mg IM x1 + doxycycline 100mg PO BID x 14 days +/- metronidazole 500mg PO BID x 14 days",
      "Implement expedited partner therapy (EPT) where legally authorized",
      "Order test of cure at 4 weeks for pregnant patients and rectal infections",
      "Schedule rescreening at 3 months for all treated patients",
      "Report to public health per jurisdictional mandatory reporting requirements"
    ],
    nursingActions: [
      "Perform comprehensive sexual history: partners, practices, protection, past STIs",
      "Conduct site-specific examination: genital, pharyngeal, rectal based on exposure",
      "Assess for complicated chlamydia: PID, perihepatitis (Fitz-Hugh-Curtis), reactive arthritis",
      "Counsel on sexual health, risk reduction, and partner treatment",
      "Prescribe and dispense EPT medications for partners when indicated",
      "Implement population-level screening protocols for high-risk populations",
      "Address antibiotic stewardship by following evidence-based guidelines",
      "Coordinate with public health for contact tracing and outbreak management"
    ],
    signs: {
      left: [
        "Asymptomatic in 70-80% of women, 50% of men",
        "Mucopurulent endocervical discharge",
        "Urethral discharge (clear to mucoid)",
        "Dysuria without bacteriuria (sterile pyuria)",
        "Intermenstrual bleeding"
      ],
      right: [
        "PID: cervical motion tenderness, fever, adnexal mass",
        "Fitz-Hugh-Curtis syndrome: RUQ pain with perihepatitis",
        "Epididymo-orchitis: unilateral scrotal pain and swelling",
        "LGV: painful inguinal lymphadenopathy, hemorrhagic proctitis",
        "Reactive arthritis triad: urethritis, conjunctivitis, arthritis"
      ]
    },
    medications: [
      { name: "Doxycycline", type: "Tetracycline antibiotic", action: "Bacteriostatic; inhibits 30S ribosomal protein synthesis; excellent intracellular penetration against C. trachomatis", sideEffects: "Photosensitivity, esophageal erosion, hepatotoxicity (rare), vaginal candidiasis", contra: "Pregnancy (category D), lactation, children <8 years", pearl: "2021 CDC upgrade to first-line over azithromycin based on meta-analysis showing 97% vs 94% microbiologic cure. Extended 21-day course required for LGV." },
      { name: "Azithromycin", type: "Macrolide antibiotic", action: "Bacteriostatic/bactericidal at high concentrations; 50S ribosomal inhibitor with prolonged tissue half-life (68 hours)", sideEffects: "GI disturbance, hepatotoxicity, QT prolongation, C. difficile", contra: "Cholestatic jaundice history with azithromycin, concurrent QT-prolonging drugs", pearl: "Single 1g dose for non-pregnant alternative or pregnancy treatment. Emerging macrolide resistance in M. genitalium makes doxycycline preferred when co-infection possible." },
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Bactericidal; inhibits transpeptidase and cell wall synthesis; broad gram-negative coverage", sideEffects: "Injection site reaction, biliary sludge, allergic reaction, C. difficile", contra: "Severe beta-lactam allergy, neonatal hyperbilirubinemia", pearl: "500mg IM x1 added when gonorrhea co-infection confirmed. For PID: combined with doxycycline +/- metronidazole for polymicrobial coverage." },
      { name: "Metronidazole", type: "Nitroimidazole antibiotic", action: "Disrupts DNA synthesis in anaerobic organisms; added to PID regimen for anaerobic coverage including BV", sideEffects: "Metallic taste, nausea, disulfiram-like reaction with alcohol, peripheral neuropathy", contra: "First trimester pregnancy (relative), concurrent alcohol use", pearl: "Added to PID regimen when anaerobic coverage needed. Counsel strict alcohol avoidance during treatment and 48 hours after completion." }
    ],
    pearls: [
      "Doxycycline replaced azithromycin as first-line in 2021 CDC guidelines due to superior efficacy and rising macrolide resistance in co-occurring pathogens",
      "Rectal chlamydia requires extended 21-day doxycycline course when LGV serovars are confirmed or suspected",
      "Fitz-Hugh-Curtis syndrome (perihepatitis) presents as RUQ pain mimicking cholecystitis and should be considered in young women with liver capsule inflammation",
      "EPT is a critical public health tool: 30% of chlamydia patients are reinfected within 12 months if partners are not treated",
      "Screening pregnant women at the first prenatal visit and in the third trimester (if high-risk) prevents vertical transmission causing neonatal conjunctivitis and pneumonia"
    ],
    quiz: [
      { question: "Which regimen is currently recommended as first-line treatment for uncomplicated urogenital chlamydia?", options: ["Azithromycin 1g single dose", "Doxycycline 100mg BID x 7 days", "Ceftriaxone 500mg IM x 1", "Levofloxacin 500mg daily x 7 days"], correct: 1, rationale: "Per 2021 CDC guidelines, doxycycline 100mg BID x 7 days is now first-line for uncomplicated urogenital chlamydia, replacing azithromycin based on superior microbiologic cure rates (97% vs 94%)." },
      { question: "An NP evaluates an MSM patient with hemorrhagic proctitis and painful inguinal lymphadenopathy. Rectal chlamydia NAAT is positive. What is the appropriate treatment duration?", options: ["7 days of doxycycline", "Single dose azithromycin", "14 days of doxycycline", "21 days of doxycycline"], correct: 3, rationale: "This presentation is consistent with lymphogranuloma venereum (LGV), caused by L1-L3 serovars of C. trachomatis, which requires an extended 21-day course of doxycycline for adequate treatment." },
      { question: "A patient presents with RUQ pain and is initially suspected to have cholecystitis. She is a 22-year-old with a new sexual partner. What should the clinician consider?", options: ["Order a HIDA scan", "Screen for chlamydia and consider Fitz-Hugh-Curtis syndrome", "Prescribe ursodiol", "Schedule cholecystectomy"], correct: 1, rationale: "Fitz-Hugh-Curtis syndrome (chlamydial perihepatitis) can mimic cholecystitis in young sexually active women. Chlamydia screening and pelvic examination should be part of the differential diagnosis." }
    ]
  },

  "syphilis-management-rpn": {
    title: "Syphilis",
    cellular: {
      title: "Treponema Pallidum Infection",
      content: "Syphilis is a systemic sexually transmitted infection caused by the spirochete bacterium Treponema pallidum. The organism penetrates intact mucous membranes or abraded skin, disseminates through the bloodstream, and progresses through distinct clinical stages if untreated. Primary syphilis presents as a painless chancre at the inoculation site that resolves spontaneously. Without treatment, the infection progresses to secondary, latent, and potentially tertiary stages with devastating cardiovascular and neurological complications. The nurse monitors for clinical manifestations, supports medication adherence, provides patient education, and reports findings to the healthcare team."
    },
    riskFactors: [
      "Multiple sexual partners",
      "Unprotected sexual contact",
      "Men who have sex with men (MSM)",
      "HIV co-infection",
      "History of prior STI",
      "Substance use (methamphetamine, alcohol)",
      "Commercial sex work"
    ],
    diagnostics: [
      "Assist with blood specimen collection for serologic testing as ordered",
      "Report results of RPR or VDRL screening tests to the RN",
      "Monitor for clinical signs of each syphilis stage and document findings",
      "Report any neurological symptoms such as headache, vision changes, or hearing loss",
      "Note that darkfield microscopy may be used on chancre specimens"
    ],
    management: [
      "Administer intramuscular penicillin G benzathine as ordered",
      "Monitor patient for 30 minutes post-injection for allergic reaction",
      "Educate patient about Jarisch-Herxheimer reaction: fever, chills, myalgia within 24 hours of treatment",
      "Reinforce importance of follow-up serologic testing at 6 and 12 months",
      "Facilitate partner notification and treatment",
      "Report positive results to public health as mandated"
    ],
    nursingActions: [
      "Inspect skin and mucous membranes for chancres, rashes, or condylomata lata",
      "Assess for symptoms of secondary syphilis: diffuse rash (including palms and soles), lymphadenopathy, malaise",
      "Monitor vital signs before and after penicillin administration",
      "Document injection site and patient tolerance",
      "Provide non-judgmental counseling on STI prevention and safe sexual practices",
      "Report any signs of neurosyphilis: headache, altered mental status, visual changes"
    ],
    signs: {
      left: [
        "Primary: painless chancre at inoculation site",
        "Chancre resolves spontaneously in 3-6 weeks",
        "Regional lymphadenopathy (non-tender)",
        "Incubation period 10-90 days"
      ],
      right: [
        "Secondary: diffuse maculopapular rash (palms/soles)",
        "Condylomata lata (moist, flat, gray lesions)",
        "Generalized lymphadenopathy",
        "Fever, malaise, weight loss, alopecia"
      ]
    },
    medications: [
      { name: "Penicillin G Benzathine", type: "Natural penicillin", action: "Bactericidal; inhibits cell wall synthesis of Treponema pallidum", sideEffects: "Injection site pain, allergic reaction, Jarisch-Herxheimer reaction", contra: "Penicillin allergy (desensitization required if pregnant)", pearl: "Single 2.4 million units IM dose for primary/secondary syphilis. Administer as ordered and monitor for 30 minutes post-injection." }
    ],
    pearls: [
      "A painless genital ulcer should raise suspicion for primary syphilis until proven otherwise",
      "The Jarisch-Herxheimer reaction is an expected response to treatment, not an allergic reaction; manage with antipyretics",
      "Syphilis is a TORCH infection and can cause devastating congenital abnormalities during pregnancy",
      "Penicillin is the ONLY adequate treatment for syphilis in pregnancy; allergic patients require desensitization",
      "All patients with syphilis should be tested for HIV"
    ],
    quiz: [
      { question: "A patient treated for syphilis develops fever, chills, and myalgia 8 hours after receiving penicillin G benzathine. What should the nurse recognize?", options: ["Anaphylactic reaction requiring epinephrine", "Jarisch-Herxheimer reaction, an expected treatment response", "Penicillin allergy requiring discontinuation", "Secondary syphilis progression"], correct: 1, rationale: "The Jarisch-Herxheimer reaction occurs within 24 hours of syphilis treatment due to the release of endotoxins from dying spirochetes. It is self-limiting and managed with antipyretics, not epinephrine." },
      { question: "Which finding is most characteristic of primary syphilis?", options: ["Painful genital vesicles", "Painless chancre at the site of inoculation", "Purulent urethral discharge", "Diffuse maculopapular rash"], correct: 1, rationale: "The hallmark of primary syphilis is a painless chancre (firm, round ulcer) at the site of inoculation. It resolves spontaneously, which can falsely reassure the patient." },
      { question: "A pregnant patient is allergic to penicillin and tests positive for syphilis. What does the nurse anticipate?", options: ["Azithromycin will be prescribed instead", "Doxycycline will be substituted", "Penicillin desensitization will be arranged", "Treatment will be deferred until postpartum"], correct: 2, rationale: "Penicillin is the only adequate treatment for syphilis in pregnancy. If the patient has a penicillin allergy, desensitization must be performed before treatment to prevent congenital syphilis." }
    ]
  },

  "syphilis-management-rn": {
    title: "Syphilis",
    cellular: {
      title: "Pathophysiology of Syphilis Stages",
      content: "Treponema pallidum is a highly motile spirochete that penetrates intact mucous membranes through corkscrew motility. After inoculation, it disseminates hematogenously within hours. Primary syphilis (10-90 days post-exposure) manifests as a painless chancre with local immune infiltration. Secondary syphilis (6-8 weeks later) represents systemic dissemination with immune complex deposition causing rash, lymphadenopathy, and constitutional symptoms. Latent syphilis is serologically positive but clinically silent. Tertiary syphilis (years later) involves granulomatous inflammation (gummas), cardiovascular syphilis (aortitis, aortic aneurysm), and neurosyphilis (tabes dorsalis, general paresis). The nurse must recognize stage-specific presentations, coordinate serologic monitoring, manage penicillin therapy protocols, perform contact tracing, and screen for complications."
    },
    riskFactors: [
      "Men who have sex with men (highest incidence group)",
      "HIV co-infection (altered disease course, higher rates of neurosyphilis)",
      "Multiple sexual partners",
      "Substance use associated with high-risk sexual behavior",
      "History of incarceration",
      "Congenital exposure (maternal syphilis)",
      "Commercial sex work",
      "Urban populations in high-prevalence areas"
    ],
    diagnostics: [
      "Order non-treponemal screening test: RPR or VDRL (quantitative titer for monitoring)",
      "Confirm positive screening with treponemal test: FTA-ABS or TP-PA",
      "Monitor RPR/VDRL titers post-treatment: expect fourfold decline by 6-12 months",
      "Order comprehensive STI panel: HIV, hepatitis B, chlamydia, gonorrhea",
      "Assess for neurosyphilis indications: CSF analysis via lumbar puncture if neurological symptoms present",
      "Order darkfield microscopy of chancre specimen when available",
      "Screen pregnant patients at first prenatal visit per guidelines"
    ],
    management: [
      "Administer penicillin G benzathine 2.4 million units IM for primary, secondary, and early latent syphilis",
      "Administer penicillin G benzathine 2.4 million units IM weekly x 3 weeks for late latent or unknown duration syphilis",
      "Prepare for IV aqueous crystalline penicillin G 18-24 million units/day x 10-14 days for neurosyphilis",
      "Monitor for Jarisch-Herxheimer reaction; manage with antipyretics and hydration",
      "Coordinate follow-up serologic testing: RPR/VDRL at 6, 12, and 24 months",
      "Report all positive cases to public health department",
      "Facilitate partner notification: all sexual contacts within 90 days (primary) or 6 months (secondary)"
    ],
    nursingActions: [
      "Perform comprehensive skin and mucous membrane assessment for stage-specific lesions",
      "Conduct neurological assessment: cranial nerves, pupillary response (Argyll Robertson pupils), gait, proprioception",
      "Prepare and administer IM penicillin using Z-track technique to minimize discomfort",
      "Monitor patient for 30 minutes post-injection for anaphylaxis",
      "Educate patient about expected Jarisch-Herxheimer reaction versus allergic reaction",
      "Coordinate contact tracing with public health department",
      "Screen all syphilis patients for HIV and offer testing",
      "Provide prenatal syphilis screening and coordinate treatment for positive mothers"
    ],
    signs: {
      left: [
        "Primary: painless chancre (firm, round, clean base)",
        "Regional non-tender lymphadenopathy",
        "Secondary: symmetric maculopapular rash including palms/soles",
        "Condylomata lata (moist, gray, highly infectious plaques)"
      ],
      right: [
        "Secondary: patchy alopecia (moth-eaten appearance)",
        "Mucous patches on oral/genital mucosa",
        "Tertiary: gummas (granulomatous lesions of skin, bone, liver)",
        "Cardiovascular: aortitis, aortic aneurysm",
        "Neurosyphilis: Argyll Robertson pupils, tabes dorsalis, general paresis"
      ]
    },
    medications: [
      { name: "Penicillin G Benzathine (Bicillin L-A)", type: "Natural penicillin (long-acting IM)", action: "Bactericidal; inhibits transpeptidase and cell wall synthesis; sustained therapeutic levels for 2-4 weeks", sideEffects: "Injection site pain, Jarisch-Herxheimer reaction, anaphylaxis (rare)", contra: "True penicillin allergy (requires desensitization in pregnancy)", pearl: "Only proven treatment for syphilis in pregnancy. Use Z-track IM injection. Do NOT substitute Bicillin C-R (contains procaine penicillin). Single dose for early syphilis; 3 weekly doses for late latent." },
      { name: "Doxycycline", type: "Tetracycline antibiotic", action: "Bacteriostatic; inhibits protein synthesis at the 30S ribosomal subunit", sideEffects: "Photosensitivity, GI upset, esophageal erosion", contra: "Pregnancy, lactation, children under 8 years", pearl: "Alternative for penicillin-allergic non-pregnant patients: 100mg BID x 14 days (primary/secondary) or 28 days (late latent). NOT acceptable for pregnancy." },
      { name: "Aqueous Crystalline Penicillin G", type: "Natural penicillin (IV)", action: "Bactericidal; achieves adequate CSF concentrations for neurosyphilis treatment", sideEffects: "Seizures at high doses, hypokalemia, Jarisch-Herxheimer reaction", contra: "Penicillin allergy", pearl: "18-24 million units/day IV (3-4 million units q4h) x 10-14 days for neurosyphilis. Requires inpatient admission or home IV therapy with PICC line." }
    ],
    pearls: [
      "RPR/VDRL titers should decline fourfold by 6-12 months after adequate treatment; failure to decline may indicate treatment failure or reinfection",
      "FTA-ABS remains positive for life after infection and cannot be used to monitor treatment response",
      "The rash of secondary syphilis on palms and soles is a classic board exam finding",
      "Neurosyphilis can occur at any stage, not just tertiary; HIV-positive patients are at higher risk",
      "Congenital syphilis is preventable with adequate maternal screening and treatment before 16 weeks gestation"
    ],
    quiz: [
      { question: "An RN obtains a positive RPR and positive FTA-ABS for a patient. The RPR titer is 1:64. After treatment, which follow-up result indicates adequate treatment response?", options: ["RPR titer 1:32 at 6 months", "RPR titer 1:16 at 6 months", "FTA-ABS becomes negative", "RPR titer remains 1:64"], correct: 1, rationale: "A fourfold decline in RPR titer (from 1:64 to 1:16 or lower) by 6-12 months indicates adequate treatment response. FTA-ABS remains positive for life. An RPR of 1:32 is only a twofold decline, which is insufficient." },
      { question: "Which presentation is characteristic of secondary syphilis?", options: ["Painless chancre on the genitals", "Symmetric maculopapular rash on the palms and soles", "Gummatous lesions on the skin", "Argyll Robertson pupils"], correct: 1, rationale: "Secondary syphilis classically presents with a symmetric maculopapular rash that involves the palms and soles, along with condylomata lata, lymphadenopathy, and constitutional symptoms." },
      { question: "A pregnant patient at 12 weeks gestation tests positive for syphilis but reports a penicillin allergy. What is the appropriate nursing action?", options: ["Administer doxycycline as an alternative", "Defer treatment until after delivery", "Arrange penicillin desensitization and administer penicillin", "Prescribe azithromycin"], correct: 2, rationale: "Penicillin is the only treatment proven to prevent congenital syphilis. Pregnant patients with penicillin allergy must undergo desensitization before receiving treatment. Doxycycline is contraindicated in pregnancy." }
    ]
  },

  "syphilis-management-np": {
    title: "Syphilis",
    cellular: {
      title: "Immunopathology and Diagnostic Algorithms",
      content: "Treponema pallidum evades immune surveillance through antigenic variation of its outer membrane proteins and minimal surface antigen expression. The humoral immune response produces both non-treponemal antibodies (anti-cardiolipin, detected by RPR/VDRL) and treponemal-specific antibodies (detected by FTA-ABS, TP-PA). Non-treponemal titers correlate with disease activity and decline with treatment, while treponemal antibodies persist lifelong. The traditional screening algorithm uses non-treponemal tests first (RPR/VDRL), confirmed by treponemal tests. The reverse algorithm, increasingly adopted, screens with treponemal immunoassay (EIA/CIA) first. Discordant results (positive treponemal, negative non-treponemal) require TP-PA confirmation and may represent very early infection, late latent syphilis, or previously treated disease. The clinician must interpret complex serologic patterns, manage stage-appropriate treatment, evaluate for neurosyphilis, and manage syphilis in special populations including HIV co-infection and pregnancy."
    },
    riskFactors: [
      "MSM (accounts for majority of primary and secondary cases)",
      "HIV co-infection (accelerated progression, atypical presentations, higher neurosyphilis risk)",
      "Multiple anonymous sexual partners",
      "Substance use (methamphetamine strongly associated)",
      "Prior syphilis infection (does not confer lasting immunity)",
      "Geographic clustering in urban centers",
      "Pregnancy (risk of congenital syphilis)",
      "Incarceration history"
    ],
    diagnostics: [
      "Apply traditional or reverse screening algorithm based on institutional protocol",
      "Traditional: RPR/VDRL screen → confirmatory FTA-ABS or TP-PA",
      "Reverse: treponemal EIA/CIA screen → reflex quantitative RPR → TP-PA if discordant",
      "Interpret quantitative RPR titers: baseline and serial monitoring at 6, 12, 24 months",
      "Order lumbar puncture with CSF analysis for neurosyphilis when indicated: neurological symptoms, treatment failure, HIV with late latent syphilis, RPR ≥1:32 with HIV",
      "CSF findings in neurosyphilis: elevated WBC (>5 cells/μL), elevated protein, positive CSF-VDRL (highly specific but low sensitivity)",
      "Order ophthalmologic examination for ocular syphilis: uveitis, optic neuritis"
    ],
    management: [
      "Prescribe penicillin G benzathine 2.4 million units IM x1 for primary, secondary, early latent (<1 year)",
      "Prescribe penicillin G benzathine 2.4 million units IM weekly x 3 doses for late latent, latent of unknown duration, or tertiary (non-neurological)",
      "Prescribe aqueous crystalline penicillin G 18-24 million units/day IV (3-4 MU q4h) x 10-14 days for neurosyphilis or ocular syphilis",
      "Alternative for penicillin-allergic non-pregnant: doxycycline 100mg BID x 14 days (early) or 28 days (late latent)",
      "Manage Jarisch-Herxheimer reaction: anticipatory guidance, NSAIDs/acetaminophen, hydration",
      "Define treatment success: fourfold decline in RPR titer by 6-12 months; retreatment if serofast or rising titer",
      "HIV co-infection: same treatment regimens; lower threshold for LP; closer serologic follow-up at 3, 6, 9, 12, 24 months",
      "Pregnancy: treat per stage with penicillin only; desensitize if allergic; consider second dose of benzathine penicillin at 1 week for late pregnancy"
    ],
    nursingActions: [
      "Interpret complex serologic results and determine syphilis stage",
      "Perform comprehensive neurological examination: cranial nerves II-XII, Romberg, proprioception",
      "Evaluate for Argyll Robertson pupils (accommodate but do not react to light)",
      "Manage diagnostic workup for neurosyphilis including LP coordination",
      "Prescribe and coordinate IV penicillin therapy for neurosyphilis (inpatient or OPAT with PICC)",
      "Counsel patients on disease course, transmission prevention, and partner treatment",
      "Implement population health measures: prenatal screening, outbreak investigation, harm reduction",
      "Coordinate multidisciplinary care for tertiary syphilis: cardiology, neurology, ophthalmology, infectious disease"
    ],
    signs: {
      left: [
        "Primary: painless chancre with clean base and indurated edges",
        "Secondary: diffuse rash (copper-colored papules on palms/soles)",
        "Secondary: condylomata lata, mucous patches, alopecia",
        "Latent: serologically positive, clinically asymptomatic"
      ],
      right: [
        "Tertiary: gummas (granulomatous destruction of bone, skin, liver)",
        "Cardiovascular: ascending aortitis, aortic regurgitation, saccular aneurysm",
        "Neurosyphilis: meningovascular (stroke), general paresis (psychosis, dementia), tabes dorsalis (posterior column degeneration)",
        "Ocular: uveitis, optic neuritis (vision loss)",
        "Congenital: Hutchinson teeth, interstitial keratitis, saddle nose, saber shins"
      ]
    },
    medications: [
      { name: "Penicillin G Benzathine", type: "Natural penicillin (IM depot)", action: "Bactericidal; sustained treponemicidal serum concentration (>0.018 μg/mL) for 2-4 weeks from single injection", sideEffects: "Jarisch-Herxheimer reaction (50-75% in early syphilis), injection site pain, anaphylaxis", contra: "True IgE-mediated penicillin allergy (skin test, desensitize if pregnant)", pearl: "Never substitute Bicillin C-R. Verify product labeling carefully. Single dose cures primary/secondary. Three weekly doses for late latent. Treatment failure: repeat 3-dose course." },
      { name: "Aqueous Crystalline Penicillin G", type: "Natural penicillin (IV)", action: "Bactericidal; achieves CSF treponemicidal concentrations essential for neurosyphilis", sideEffects: "Seizures (supratherapeutic levels), hyperkalemia (potassium salt formulations), phlebitis", contra: "Penicillin allergy (ceftriaxone 2g IV daily x 10-14 days as alternative for non-pregnant)", pearl: "Standard neurosyphilis regimen: 18-24 MU/day as continuous infusion or 3-4 MU IV q4h x 10-14 days. Follow with benzathine penicillin G 2.4 MU IM weekly x 3 doses." },
      { name: "Doxycycline", type: "Tetracycline antibiotic", action: "Bacteriostatic; adequate tissue levels against T. pallidum; NOT reliable for CSF penetration", sideEffects: "Photosensitivity, pill esophagitis, hepatotoxicity", contra: "Pregnancy (category D), lactation, children <8, neurosyphilis", pearl: "100mg BID x 14 days for early syphilis, 28 days for late latent in penicillin-allergic non-pregnant patients. Adherence to prolonged course is a concern; consider DOT." },
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Bactericidal; crosses blood-brain barrier; potential alternative for neurosyphilis in select cases", sideEffects: "Biliary sludge, C. difficile, allergic reaction", contra: "Severe cephalosporin allergy, not first-line for neurosyphilis", pearl: "1-2g IV/IM daily x 10-14 days studied as neurosyphilis alternative when penicillin cannot be used. Limited evidence; ID consultation recommended." }
    ],
    pearls: [
      "The reverse screening algorithm may identify patients with very early syphilis (pre-chancre) who have positive treponemal EIA but negative RPR",
      "Prozone phenomenon: very high RPR titers can produce a false-negative result; request dilution if secondary syphilis is clinically suspected with negative RPR",
      "HIV-positive patients with syphilis should have lower LP threshold: RPR ≥1:32, CD4 <350, or any neurological symptom",
      "Jarisch-Herxheimer reaction occurs in 50-75% of patients treated for early syphilis; it is NOT an indication to change treatment",
      "Congenital syphilis rates are rising; universal prenatal screening at first visit with repeat third-trimester screening in high-prevalence areas is critical"
    ],
    quiz: [
      { question: "An NP reviews labs from the reverse screening algorithm: positive treponemal EIA, negative RPR, and positive TP-PA. How should this be interpreted?", options: ["False-positive EIA; no syphilis", "Very early syphilis, previously treated syphilis, or late latent syphilis", "Active secondary syphilis", "Laboratory error requiring repeat testing"], correct: 1, rationale: "Positive treponemal tests with negative RPR (confirmed by positive TP-PA) can indicate very early syphilis before non-treponemal antibodies develop, previously treated and cured syphilis, or late latent syphilis with waning non-treponemal titers." },
      { question: "An HIV-positive patient is diagnosed with late latent syphilis and has an RPR titer of 1:64. What additional evaluation should the clinician order?", options: ["Repeat RPR in 3 months", "Lumbar puncture for CSF analysis", "MRI of the brain", "Dark-field microscopy"], correct: 1, rationale: "HIV-positive patients with late latent syphilis and RPR ≥1:32 should undergo LP to evaluate for asymptomatic neurosyphilis, which would change the treatment regimen from IM benzathine penicillin to IV aqueous penicillin G." },
      { question: "A patient treated for secondary syphilis has an RPR of 1:128 at baseline and 1:64 at 6-month follow-up. What is the appropriate next step?", options: ["Document adequate response and continue monitoring", "Retreat with 3 weekly doses of benzathine penicillin", "Order lumbar puncture to rule out neurosyphilis", "Consider the patient cured and discharge from care"], correct: 2, rationale: "A fourfold decline (two dilution decrease, e.g., 1:128 to 1:32) is expected by 6-12 months. A decline from 1:128 to 1:64 is only a twofold decrease, suggesting possible treatment failure. LP to rule out neurosyphilis and retreatment should be considered." }
    ]
  },

  "bacterial-meningitis-rpn": {
    title: "Bacterial Meningitis",
    cellular: {
      title: "Meningeal Inflammation",
      content: "Bacterial meningitis is a life-threatening infection of the meninges (protective membranes surrounding the brain and spinal cord) most commonly caused by Neisseria meningitidis or Streptococcus pneumoniae. Bacteria enter the subarachnoid space and trigger a severe inflammatory response with neutrophil infiltration, increased vascular permeability, and cerebral edema. The resulting increase in intracranial pressure (ICP) can cause brain herniation and death. The nurse monitors neurological status, vital signs, and implements infection control measures as delegated, reporting changes immediately."
    },
    riskFactors: [
      "Close living quarters (dormitories, military barracks)",
      "Immunocompromised state",
      "Lack of meningococcal vaccination",
      "Recent upper respiratory infection or ear infection",
      "Age extremes (neonates and elderly)",
      "Asplenia or complement deficiency",
      "Skull fracture or neurosurgical procedure"
    ],
    diagnostics: [
      "Monitor vital signs frequently, reporting fever, tachycardia, or signs of shock",
      "Perform and document neurological checks as directed: level of consciousness, pupil reactivity",
      "Report any new neurological findings immediately: confusion, seizures, focal deficits",
      "Monitor for signs of increased ICP: altered consciousness, vomiting, headache",
      "Assist with positioning for lumbar puncture as directed"
    ],
    management: [
      "Implement droplet precautions immediately (especially for Neisseria meningitidis)",
      "Maintain bed rest in a dimly lit, quiet room to reduce environmental stimuli",
      "Administer prescribed antibiotics on time as ordered",
      "Administer antipyretics and analgesics as ordered",
      "Maintain seizure precautions: padded side rails, suction at bedside",
      "Keep head of bed elevated 30 degrees to promote venous drainage"
    ],
    nursingActions: [
      "Assess level of consciousness using GCS or institutional tool as directed",
      "Monitor for classic meningeal signs and report: neck stiffness, photophobia",
      "Observe for Kernig sign (inability to extend knee when hip is flexed) and Brudzinski sign (neck flexion causes involuntary knee flexion)",
      "Monitor for petechial rash that may indicate meningococcemia",
      "Report any change in neurological status immediately to the RN",
      "Maintain strict intake and output monitoring",
      "Ensure wall suction is functional for seizure precautions"
    ],
    signs: {
      left: [
        "High fever with chills",
        "Severe headache",
        "Neck stiffness (nuchal rigidity)",
        "Nausea and vomiting",
        "Photophobia"
      ],
      right: [
        "Positive Kernig sign",
        "Positive Brudzinski sign",
        "Petechial or purpuric rash (meningococcemia)",
        "Altered level of consciousness",
        "Seizures",
        "Bulging fontanelles (neonates)"
      ]
    },
    medications: [
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Bactericidal; crosses blood-brain barrier for CNS infection", sideEffects: "Diarrhea, rash, biliary sludge", contra: "Severe cephalosporin allergy, neonates with hyperbilirubinemia", pearl: "First-line empiric antibiotic for bacterial meningitis. Administer as ordered on schedule; timing is critical." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces meningeal inflammation and cerebral edema", sideEffects: "Hyperglycemia, GI bleeding, immunosuppression", contra: "Fungal meningitis", pearl: "Given 15-20 minutes before or with first dose of antibiotic to reduce neurological sequelae, especially hearing loss." }
    ],
    pearls: [
      "Bacterial meningitis is a medical emergency; every minute of delayed treatment increases mortality",
      "Droplet precautions are essential for Neisseria meningitidis until 24 hours of effective antibiotic therapy",
      "In neonates, classic meningeal signs may be absent; poor feeding and bulging fontanelles are key indicators",
      "Seizure precautions must be maintained: suction at bedside, padded side rails, oxygen available",
      "Close contacts of meningococcal meningitis patients require chemoprophylaxis (rifampin or ciprofloxacin)"
    ],
    quiz: [
      { question: "Which infection control measure should the nurse implement immediately for a patient with suspected Neisseria meningitidis?", options: ["Contact precautions", "Airborne precautions", "Droplet precautions", "Standard precautions only"], correct: 2, rationale: "Neisseria meningitidis is transmitted via respiratory droplets. Droplet precautions (surgical mask within 3 feet) should be implemented immediately and maintained until 24 hours of effective antibiotic therapy." },
      { question: "The nurse observes that a patient with meningitis develops involuntary flexion of the knees when the neck is passively flexed. This finding is called:", options: ["Kernig sign", "Brudzinski sign", "Babinski sign", "Murphy sign"], correct: 1, rationale: "Brudzinski sign is positive when passive neck flexion causes involuntary flexion of the hips and knees. It indicates meningeal irritation and should be reported immediately." },
      { question: "Which neonatal finding should the nurse report as a possible indicator of meningitis?", options: ["Normal sucking reflex", "Bulging fontanelle with poor feeding", "Soft, flat fontanelle", "Weight gain of 30g per day"], correct: 1, rationale: "Neonates with meningitis may not display classic signs like nuchal rigidity. A bulging fontanelle indicates increased intracranial pressure, and poor feeding is an early sign of illness." }
    ]
  },

  "bacterial-meningitis-rn": {
    title: "Bacterial Meningitis",
    cellular: {
      title: "Pathophysiology of Bacterial Meningitis",
      content: "Bacterial meningitis begins with colonization of the nasopharynx by pathogens (Neisseria meningitidis, Streptococcus pneumoniae, Haemophilus influenzae type b, Listeria monocytogenes in neonates/elderly). Bacteremia develops, and organisms cross the blood-brain barrier through receptor-mediated transcytosis or during disruption of the BBB. Within the CSF, bacteria replicate rapidly due to minimal immune defenses (low complement, few immunoglobulins). Bacterial cell wall components trigger release of pro-inflammatory cytokines (TNF-α, IL-1β, IL-6), causing neutrophilic infiltration, increased BBB permeability, vasogenic edema, and disrupted CSF flow (interstitial edema). Cytotoxic edema follows as neurons are directly damaged. The cascade results in elevated ICP, reduced cerebral perfusion, and risk of uncal herniation. The nurse coordinates emergent antibiotic administration, performs serial neurological assessments, manages ICP, implements isolation protocols, and coordinates prophylaxis for close contacts."
    },
    riskFactors: [
      "Close-contact environments (dormitories, military, daycare)",
      "Asplenia (functional or surgical) - risk for encapsulated organisms",
      "Complement deficiency (C5-C9 terminal complement)",
      "Recent neurosurgery, VP shunt, or skull fracture",
      "Immunosuppression (HIV, chemotherapy, transplant)",
      "Age extremes: neonates (Group B Strep, E. coli, Listeria) and elderly (S. pneumoniae, Listeria)",
      "Lack of vaccination (meningococcal, pneumococcal, Hib)",
      "Contiguous infection (sinusitis, otitis media, mastoiditis)"
    ],
    diagnostics: [
      "Prioritize lumbar puncture for CSF analysis: opening pressure, cell count, glucose, protein, gram stain, culture",
      "Interpret CSF findings: elevated WBC with neutrophil predominance, elevated protein, decreased glucose (bacteria consume glucose), high opening pressure, positive culture",
      "Obtain blood cultures x2 before antibiotics if possible (do NOT delay antibiotics for LP)",
      "Order CBC with differential (leukocytosis with left shift), CRP, procalcitonin, lactate",
      "Order CT head before LP only if: focal neurological deficits, papilledema, altered consciousness, immunocompromised, or new seizures",
      "Monitor serum electrolytes for SIADH (hyponatremia is common complication)"
    ],
    management: [
      "Initiate empiric antibiotics within 1 hour of suspicion (ceftriaxone + vancomycin; add ampicillin if Listeria risk)",
      "Administer dexamethasone 0.15 mg/kg IV q6h x 4 days, starting 15-20 minutes before or with first antibiotic dose",
      "Implement droplet precautions for suspected N. meningitidis until 24 hours of effective therapy",
      "Maintain head of bed at 30 degrees to optimize venous drainage and reduce ICP",
      "Implement seizure precautions and administer anticonvulsants as prescribed",
      "Monitor strict intake and output; restrict fluids if SIADH develops",
      "Coordinate chemoprophylaxis for close contacts: rifampin, ciprofloxacin, or ceftriaxone"
    ],
    nursingActions: [
      "Perform neurological assessments every 1-2 hours: GCS, pupil reactivity, motor response, cranial nerve function",
      "Assess for signs of increased ICP: Cushing triad (hypertension, bradycardia, irregular respirations), altered consciousness, vomiting",
      "Monitor for complications: seizures, SIADH, DIC, hydrocephalus, cerebral infarction",
      "Maintain environmental modifications: dim lighting, minimal stimulation, quiet room",
      "Administer antibiotics on strict schedule; delays increase mortality",
      "Position for lumbar puncture: lateral recumbent with knees drawn to chest, or seated leaning forward",
      "Post-LP care: monitor for headache, CSF leak; maintain flat position as ordered",
      "Identify and notify close contacts for chemoprophylaxis"
    ],
    signs: {
      left: [
        "Classic triad: fever, neck stiffness, altered mental status",
        "Severe headache (worst of life)",
        "Photophobia and phonophobia",
        "Positive Kernig sign",
        "Positive Brudzinski sign"
      ],
      right: [
        "Petechial/purpuric rash (meningococcemia progressing to DIC)",
        "Seizures (20-30% of cases)",
        "Focal neurological deficits (cranial nerve palsies)",
        "Signs of increased ICP: Cushing triad",
        "SIADH: hyponatremia, fluid retention",
        "Neonates: bulging fontanelle, high-pitched cry, poor feeding, irritability"
      ]
    },
    medications: [
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Bactericidal; excellent CSF penetration; covers N. meningitidis, S. pneumoniae, H. influenzae", sideEffects: "Biliary sludge, C. difficile, allergic reaction", contra: "Severe cephalosporin allergy, neonates with hyperbilirubinemia (use cefotaxime)", pearl: "2g IV q12h for adults. Do NOT delay administration waiting for LP results. Door-to-antibiotic time directly impacts mortality." },
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits cell wall synthesis; added for penicillin-resistant S. pneumoniae coverage", sideEffects: "Red man syndrome (infuse over 60 min), nephrotoxicity, ototoxicity", contra: "Severe renal impairment (dose adjustment required)", pearl: "Added empirically to ceftriaxone until culture sensitivities return. Monitor trough levels (target 15-20 mcg/mL). Can be discontinued once penicillin-sensitive pneumococcus confirmed." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces BBB inflammation, decreases cerebral edema, and reduces risk of neurological sequelae (especially hearing loss)", sideEffects: "Hyperglycemia, GI bleeding, masking of fever", contra: "Not recommended for meningitis caused by Listeria or gram-negative bacilli", pearl: "Must be given BEFORE or WITH the first dose of antibiotics. Proven to reduce mortality in pneumococcal meningitis and hearing loss in H. influenzae meningitis in children." },
      { name: "Ampicillin", type: "Aminopenicillin", action: "Bactericidal; covers Listeria monocytogenes which is inherently resistant to cephalosporins", sideEffects: "Rash, diarrhea, allergic reaction", contra: "Penicillin allergy", pearl: "Added to empiric regimen for neonates, adults >50 years, immunocompromised, and pregnant patients to cover Listeria, which is NOT covered by cephalosporins." }
    ],
    pearls: [
      "Never delay antibiotics to obtain a lumbar puncture; start empiric therapy immediately if LP will be delayed",
      "CSF in bacterial meningitis: cloudy, high WBC (neutrophils), high protein, low glucose, high opening pressure (remember: 'bacteria eat sugar')",
      "Dexamethasone reduces hearing loss and neurological sequelae but must be given before or with the first antibiotic dose",
      "Meningococcemia can progress to DIC and Waterhouse-Friderichsen syndrome (adrenal hemorrhage) within hours",
      "Close contacts require chemoprophylaxis within 24 hours of case identification for N. meningitidis"
    ],
    quiz: [
      { question: "The nurse is caring for a patient with suspected bacterial meningitis. The CT scan is delayed. What is the priority action?", options: ["Wait for CT results before proceeding", "Administer empiric antibiotics immediately", "Perform the lumbar puncture without CT", "Transfer to ICU first"], correct: 1, rationale: "Empiric antibiotics should never be delayed for diagnostic studies. Every hour of delay in antibiotic administration increases mortality. Blood cultures can be obtained before antibiotics, but treatment should begin immediately." },
      { question: "Which CSF finding is most consistent with bacterial meningitis?", options: ["Clear CSF with lymphocyte predominance", "Cloudy CSF with neutrophil predominance and low glucose", "Normal opening pressure with elevated glucose", "Clear CSF with normal protein"], correct: 1, rationale: "Bacterial meningitis produces cloudy CSF with neutrophil predominance, elevated protein, decreased glucose (bacteria consume glucose), and elevated opening pressure." },
      { question: "When should dexamethasone be administered in relation to antibiotics in bacterial meningitis?", options: ["24 hours after antibiotics", "Only if antibiotics fail", "15-20 minutes before or with the first antibiotic dose", "After culture results confirm the organism"], correct: 2, rationale: "Dexamethasone should be given 15-20 minutes before or simultaneously with the first antibiotic dose to reduce inflammation, cerebral edema, and risk of neurological sequelae (particularly hearing loss)." }
    ]
  },

  "bacterial-meningitis-np": {
    title: "Bacterial Meningitis",
    cellular: {
      title: "Neuroimmunology and Evidence-Based Management",
      content: "The pathogenesis of bacterial meningitis involves a cascade of neuroinflammatory events. Bacterial components (lipopolysaccharide in gram-negatives, peptidoglycan/teichoic acid in gram-positives) activate toll-like receptors on meningeal macrophages and microglia, triggering NF-κB-mediated production of pro-inflammatory cytokines (TNF-α, IL-1β, IL-6) and chemokines (CXCL8). This inflammatory cascade disrupts the blood-brain barrier through matrix metalloproteinase activation, leading to vasogenic edema. Neutrophil degranulation releases reactive oxygen species that cause neuronal apoptosis (cytotoxic edema). Purulent exudate obstructs CSF flow through the arachnoid villi, causing communicating hydrocephalus (interstitial edema). The combined effect raises ICP, reduces cerebral perfusion pressure, and can trigger transtentorial herniation. Adjunctive dexamethasone targets this inflammatory cascade by inhibiting cytokine production. The clinician must prescribe empiric and targeted antibiotic regimens, manage ICP, interpret CSF results, coordinate prophylaxis, and manage long-term sequelae including sensorineural hearing loss, cognitive deficits, and epilepsy."
    },
    riskFactors: [
      "Anatomic CSF leak (post-traumatic, congenital, post-surgical)",
      "Cochlear implants (increased pneumococcal meningitis risk)",
      "Terminal complement deficiency (C5-C9: recurrent meningococcal disease)",
      "Functional/anatomic asplenia (encapsulated organisms)",
      "HIV with CD4 <200 (Listeria, Cryptococcus differential)",
      "Neurosurgical procedures, VP shunt, external ventricular drain",
      "Neonatal risk factors: Group B Strep colonization, prolonged rupture of membranes, prematurity",
      "Community outbreak settings"
    ],
    diagnostics: [
      "Order and interpret CSF analysis: opening pressure (>25 cmH2O), WBC >1000/μL (neutrophil predominance >80%), protein >250 mg/dL, glucose <40 mg/dL or CSF:serum glucose ratio <0.4",
      "Order CSF gram stain (positive in 60-90%), culture (gold standard), and latex agglutination if partially treated",
      "Order multiplex PCR panel (BioFire FilmArray) for rapid pathogen identification",
      "Interpret blood cultures (positive in 50-75%), procalcitonin (>0.5 ng/mL supports bacterial etiology)",
      "Order CT head before LP only if: papilledema, focal deficits, GCS <10, immunocompromised, seizures within 7 days",
      "Order follow-up LP at 48-72 hours if inadequate clinical response to confirm CSF sterilization",
      "Order audiometry before discharge for all patients (hearing loss is most common sequela)"
    ],
    management: [
      "Prescribe empiric antibiotics immediately based on age and risk: adults 18-50: ceftriaxone 2g IV q12h + vancomycin 15-20mg/kg IV q8-12h",
      "Adults >50 or immunocompromised: add ampicillin 2g IV q4h for Listeria coverage",
      "Neonates <1 month: ampicillin + gentamicin or cefotaxime",
      "Prescribe dexamethasone 0.15mg/kg IV q6h x 4 days, initiated before or with first antibiotic dose",
      "Narrow antibiotic therapy based on culture and sensitivity results",
      "S. pneumoniae (penicillin-sensitive): penicillin G or ceftriaxone; (penicillin-resistant): ceftriaxone + vancomycin",
      "N. meningitidis: penicillin G or ceftriaxone; total treatment duration 7 days",
      "Prescribe chemoprophylaxis for close contacts: rifampin 600mg PO BID x 2 days, ciprofloxacin 500mg PO x1, or ceftriaxone 250mg IM x1",
      "Manage complications: SIADH (fluid restriction, hypertonic saline if severe), seizures (lorazepam, levetiracetam), cerebral edema (osmotic therapy)"
    ],
    nursingActions: [
      "Determine empiric antibiotic regimen based on patient age, risk factors, and local resistance patterns",
      "Interpret CSF results to differentiate bacterial from viral meningitis and guide treatment",
      "Manage elevated ICP: elevate HOB 30°, osmotic therapy (mannitol or hypertonic saline), avoid hyperthermia",
      "Monitor for Waterhouse-Friderichsen syndrome in meningococcal disease: DIC, adrenal crisis, shock",
      "Prescribe stress-dose corticosteroids if adrenal crisis suspected",
      "Coordinate public health notification and contact prophylaxis within 24 hours",
      "Order and interpret follow-up imaging if hydrocephalus, abscess, or infarction suspected",
      "Plan post-discharge follow-up: audiometry, neurocognitive assessment, vaccination catch-up"
    ],
    signs: {
      left: [
        "Classic triad: fever + nuchal rigidity + altered mental status (present in <50% at presentation)",
        "Headache (most common symptom, >85%)",
        "Jolt accentuation: headache worsens with horizontal head rotation (sensitivity 97%)",
        "Kernig and Brudzinski signs (sensitivity 5-30%)"
      ],
      right: [
        "Purpura fulminans: widespread purpuric lesions indicating DIC (N. meningitidis)",
        "Waterhouse-Friderichsen syndrome: bilateral adrenal hemorrhage, shock",
        "Cranial nerve palsies: CN III, IV, VI, VII, VIII",
        "SIADH: hyponatremia, decreased serum osmolality, concentrated urine",
        "Post-infectious sequelae: sensorineural hearing loss (30%), cognitive deficits, epilepsy"
      ]
    },
    medications: [
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Bactericidal; inhibits PBP3; excellent CSF penetration (10-20% of serum level, higher with inflamed meninges)", sideEffects: "Biliary pseudolithiasis, C. difficile, cross-reactivity with penicillin allergy (1-2%)", contra: "Neonates with hyperbilirubinemia (displaces bilirubin from albumin); use cefotaxime instead", pearl: "2g IV q12h is standard adult dose. CSF penetration increases with meningeal inflammation. Duration: 7 days for N. meningitidis, 10-14 days for S. pneumoniae, 21 days for Listeria/gram-negatives." },
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits cell wall synthesis; added for drug-resistant S. pneumoniae; CSF penetration improved with meningeal inflammation", sideEffects: "Red man syndrome (histamine-mediated, not allergy), nephrotoxicity, ototoxicity", contra: "Dose adjustment in renal impairment; monitor AUC/MIC or trough levels", pearl: "Target AUC/MIC 400-600 (or trough 15-20 mcg/mL). Can be discontinued once pneumococcal MIC to penicillin <0.06 confirmed. Consider intrathecal vancomycin for VP shunt infections." },
      { name: "Ampicillin", type: "Aminopenicillin", action: "Bactericidal; covers Listeria monocytogenes (inherently cephalosporin-resistant) and Group B Streptococcus", sideEffects: "Maculopapular rash (especially with EBV), diarrhea, seizures at high doses", contra: "Penicillin allergy (use TMP-SMX for Listeria coverage in allergic patients)", pearl: "2g IV q4h for Listeria coverage. Add to empiric regimen for neonates, age >50, pregnant, and immunocompromised. Listeria meningitis treated for 21 days." },
      { name: "Dexamethasone", type: "Corticosteroid", action: "Inhibits NF-κB-mediated cytokine production; reduces BBB disruption, cerebral edema, and neuronal apoptosis", sideEffects: "Hyperglycemia, GI bleeding, delayed CSF sterilization (controversial), masking clinical response", contra: "Not beneficial for gram-negative bacillary meningitis; discontinue if non-pneumococcal/non-Haemophilus etiology confirmed (debated)", pearl: "de Gans trial: 0.15mg/kg IV q6h x 4 days reduced mortality from 15% to 7% in pneumococcal meningitis. Must start before or with first antibiotic dose; no benefit if started later. Reduces hearing loss in H. influenzae meningitis." }
    ],
    pearls: [
      "Door-to-antibiotic time is the single most important modifiable factor in meningitis outcomes: aim for <30 minutes from presentation",
      "CT before LP is needed only for specific indications; do NOT delay antibiotics while waiting for CT",
      "Jolt accentuation test has higher sensitivity (97%) than Kernig/Brudzinski signs (5-30%) for meningeal irritation",
      "CSF lactate >3.5 mmol/L has >90% sensitivity and specificity for differentiating bacterial from viral meningitis",
      "Sensorineural hearing loss is the most common long-term sequela; audiometry should be performed before discharge and at follow-up"
    ],
    quiz: [
      { question: "An NP evaluates an immunocompromised 65-year-old with suspected meningitis. Which empiric antibiotic regimen is most appropriate?", options: ["Ceftriaxone + vancomycin", "Ceftriaxone + vancomycin + ampicillin", "Ceftriaxone alone", "Meropenem alone"], correct: 1, rationale: "Patients over 50 and immunocompromised patients require ampicillin added to ceftriaxone + vancomycin to cover Listeria monocytogenes, which is inherently resistant to cephalosporins and is a significant pathogen in these populations." },
      { question: "CSF analysis shows: WBC 2500/μL (95% neutrophils), protein 350 mg/dL, glucose 18 mg/dL, opening pressure 35 cmH2O. What is the most likely diagnosis?", options: ["Viral meningitis", "Bacterial meningitis", "Fungal meningitis", "Normal CSF"], correct: 1, rationale: "This CSF profile is classic for bacterial meningitis: high WBC with neutrophil predominance, markedly elevated protein, very low glucose (bacteria consume glucose), and elevated opening pressure." },
      { question: "A patient with meningococcal meningitis develops purpura fulminans, hypotension, and lab evidence of DIC. What complication should the clinician recognize?", options: ["Viral co-infection", "Waterhouse-Friderichsen syndrome", "Drug reaction to ceftriaxone", "SIADH"], correct: 1, rationale: "Waterhouse-Friderichsen syndrome is bilateral adrenal hemorrhagic necrosis caused by meningococcal septicemia with DIC. It presents with purpura fulminans, shock, and adrenal insufficiency requiring emergent management with IV fluids, vasopressors, and stress-dose corticosteroids." }
    ]
  },

  "prostate-cancer-rpn": {
    title: "Prostate Cancer",
    cellular: {
      title: "Prostate Malignancy",
      content: "Prostate cancer is the most common cancer in men, typically arising from glandular epithelial cells (adenocarcinoma) in the peripheral zone of the prostate. It is generally slow-growing and predictable in progression. Cancer cells may remain localized for years or metastasize to nearby lymph nodes, bone (especially vertebrae and pelvis), liver, and lungs. Tumor growth is largely driven by androgens (testosterone and dihydrotestosterone). The nurse monitors for urinary symptoms, provides comfort measures, supports patients through diagnostic and treatment phases, and reports changes to the healthcare team."
    },
    riskFactors: [
      "Age over 50 years (risk increases significantly with age)",
      "Black men (highest incidence and mortality rates)",
      "First-degree relative with prostate cancer (2-3x increased risk)",
      "High intake of red meat and high-fat dairy products",
      "Obesity",
      "Exposure to Agent Orange or cadmium",
      "Western diet high in refined carbohydrates"
    ],
    diagnostics: [
      "Report patient complaints of urinary symptoms: hesitancy, weak stream, frequency",
      "Assist with preparation for digital rectal exam (DRE) as directed",
      "Monitor PSA results as reported and notify RN of elevated values",
      "Report any new bone pain, especially in the back or hips",
      "Monitor post-procedure vitals after prostate biopsy as directed"
    ],
    management: [
      "Provide emotional support during diagnosis and treatment decision-making",
      "Assist with post-operative care following prostatectomy as directed",
      "Monitor urinary catheter output and report hematuria or clots",
      "Encourage pelvic floor (Kegel) exercises for urinary continence",
      "Provide dietary education: reduce red meat, animal fat, high-fat dairy; maintain healthy weight",
      "Report pain, urinary retention, or signs of obstruction to the RN"
    ],
    nursingActions: [
      "Monitor and document urinary output patterns: frequency, urgency, nocturia",
      "Assess for post-operative complications: hemorrhage, infection, urinary incontinence",
      "Provide catheter care and monitor drainage characteristics",
      "Support patient coping and body image concerns related to potential erectile dysfunction",
      "Facilitate referral to support groups and community resources",
      "Report any new complaints of bone pain or weight loss"
    ],
    signs: {
      left: [
        "Often asymptomatic in early stages",
        "Weak or interrupted urinary stream",
        "Urinary frequency and nocturia",
        "Difficulty starting or stopping urination",
        "Elevated PSA on screening"
      ],
      right: [
        "Hematuria or hematospermia",
        "Bone pain (lumbar spine, pelvis, femur)",
        "Unexplained weight loss",
        "Lower extremity edema (lymph node involvement)",
        "Pathologic fractures (bone metastasis)"
      ]
    },
    medications: [
      { name: "Tamsulosin", type: "Alpha-1 blocker", action: "Relaxes smooth muscle of prostate and bladder neck to improve urinary flow", sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation", contra: "Concurrent use with PDE5 inhibitors", pearl: "Used for urinary obstructive symptoms associated with prostate enlargement. Instruct patient to rise slowly from sitting or lying position." }
    ],
    pearls: [
      "Prostate cancer is often asymptomatic in early stages; screening with PSA and DRE enables early detection",
      "Bone metastasis is the most common site of distant spread; new back or hip pain should be reported",
      "Dietary modifications may reduce risk: decrease red meat and high-fat dairy, increase fruits and vegetables",
      "Emotional support is essential as treatments may affect sexual function and urinary continence",
      "Kegel exercises begun before surgery can improve post-prostatectomy urinary continence outcomes"
    ],
    quiz: [
      { question: "Which complaint from a patient with known prostate cancer should the nurse report immediately?", options: ["Urinary frequency at night", "New onset severe low back pain", "Mild fatigue after treatment", "Decreased appetite"], correct: 1, rationale: "New onset severe low back pain in a patient with prostate cancer may indicate bone metastasis, the most common site of distant spread. This requires immediate notification for diagnostic workup." },
      { question: "Which dietary modification should the nurse recommend to reduce prostate cancer risk?", options: ["Increase red meat intake for protein", "Reduce refined carbohydrates and high-fat dairy", "Eliminate all protein from the diet", "Increase calcium supplementation"], correct: 1, rationale: "Reducing intake of red meat, animal fat, high-fat dairy, and refined carbohydrates has been associated with lower prostate cancer risk. A balanced diet with fruits, vegetables, and healthy fats is recommended." },
      { question: "A patient is scheduled for a prostatectomy. Which pre-operative teaching should the nurse reinforce?", options: ["Avoid all physical activity for 6 months", "Practice Kegel exercises to improve post-operative continence", "Prostate cancer always requires chemotherapy", "Urinary catheter will never be needed"], correct: 1, rationale: "Pelvic floor (Kegel) exercises strengthen the urinary sphincter and can improve post-prostatectomy continence outcomes when started preoperatively." }
    ]
  },

  "prostate-cancer-rn": {
    title: "Prostate Cancer",
    cellular: {
      title: "Pathophysiology and Staging",
      content: "Prostate adenocarcinoma arises from glandular epithelial cells, predominantly in the peripheral zone of the prostate. Malignant transformation involves inactivation of tumor suppressor genes (PTEN, TP53) and activation of androgen receptor signaling pathways. The tumor is graded using the Gleason scoring system, which evaluates glandular architecture on biopsy (two patterns scored 1-5, summed for composite score 2-10). Higher Gleason scores indicate more aggressive, poorly differentiated tumors. Staging uses the TNM system. Metastasis occurs through lymphatic spread to pelvic and retroperitoneal nodes and hematogenous spread to bone (osteoblastic lesions), liver, and lungs. Prostate cancer is androgen-dependent; testosterone stimulates growth through the androgen receptor. The nurse coordinates screening protocols, manages post-surgical care, monitors for treatment complications, and provides comprehensive patient education."
    },
    riskFactors: [
      "Age >50 years (65% of cases diagnosed after age 65)",
      "Black race (1.6x higher incidence, 2.4x higher mortality than White men)",
      "First-degree relative with prostate cancer",
      "BRCA1/BRCA2 gene mutations",
      "High dietary fat intake and obesity",
      "Exposure to Agent Orange (Vietnam veterans)",
      "Smoking (associated with aggressive disease and mortality)",
      "Lynch syndrome (hereditary nonpolyposis colorectal cancer)"
    ],
    diagnostics: [
      "Facilitate PSA screening per shared decision-making guidelines (discuss starting at age 50, or 40-45 for high-risk groups)",
      "Interpret PSA levels: normal <4 ng/mL; 4-10 ng/mL is indeterminate zone; >10 ng/mL high suspicion",
      "Coordinate transrectal ultrasound-guided prostate biopsy for tissue diagnosis",
      "Interpret Gleason score on pathology report: 6 = low grade, 7 = intermediate, 8-10 = high grade",
      "Order staging workup: bone scan (osteoblastic metastases), CT abdomen/pelvis, MRI prostate",
      "Monitor PSA velocity (rate of rise) and PSA density (PSA/prostate volume)",
      "Order alkaline phosphatase and serum calcium for bone metastasis evaluation"
    ],
    management: [
      "Coordinate multidisciplinary discussion of treatment options based on stage and Gleason score",
      "Low-risk, low-volume: active surveillance with serial PSA, DRE, and repeat biopsy",
      "Surgical: radical prostatectomy (open, laparoscopic, or robotic-assisted)",
      "Radiation: external beam radiation therapy (EBRT) or brachytherapy (seed implantation)",
      "Manage post-prostatectomy catheter: typically 1-2 weeks; monitor output and patency",
      "Initiate pelvic floor rehabilitation program pre- and post-operatively",
      "Coordinate androgen deprivation therapy (ADT) for advanced/metastatic disease",
      "Monitor for ADT complications: hot flashes, osteoporosis, metabolic syndrome, cardiovascular risk"
    ],
    nursingActions: [
      "Provide pre-operative teaching for radical prostatectomy: expected recovery, catheter management, activity restrictions",
      "Monitor post-operative complications: hemorrhage, infection, DVT, urinary leak",
      "Assess urinary continence recovery: document degree and type (stress vs. urge)",
      "Assess erectile function and provide referral for sexual health counseling",
      "Monitor PSA post-treatment: should be undetectable after radical prostatectomy; rising PSA indicates recurrence",
      "Educate about ADT side effects and management strategies",
      "Screen for depression and anxiety common in men diagnosed with prostate cancer",
      "Coordinate palliative care for metastatic disease: bone pain management, radiation for bone metastases"
    ],
    signs: {
      left: [
        "Asymptomatic (most common early presentation)",
        "Elevated PSA on screening",
        "Abnormal DRE: hard, irregular nodule",
        "Lower urinary tract symptoms (LUTS): frequency, hesitancy, nocturia",
        "Hematuria or hematospermia"
      ],
      right: [
        "Bone pain: lumbosacral, pelvis, ribs (osteoblastic metastases)",
        "Pathologic fractures from bone metastases",
        "Spinal cord compression: back pain, lower extremity weakness, bowel/bladder dysfunction",
        "Lower extremity lymphedema (pelvic node involvement)",
        "Anemia of chronic disease (advanced stage)"
      ]
    },
    medications: [
      { name: "Leuprolide (Lupron)", type: "GnRH agonist", action: "Initially stimulates then downregulates pituitary GnRH receptors, achieving chemical castration (testosterone <50 ng/dL)", sideEffects: "Tumor flare (first 2 weeks), hot flashes, osteoporosis, erectile dysfunction, weight gain, depression", contra: "Uncontrolled cardiovascular disease", pearl: "Initial testosterone flare can worsen symptoms in first 2 weeks; co-prescribe antiandrogen (bicalutamide) for flare protection. Given as depot injection monthly or quarterly." },
      { name: "Bicalutamide", type: "Nonsteroidal antiandrogen", action: "Competitively blocks androgen receptors in prostate tissue, preventing testosterone from stimulating tumor growth", sideEffects: "Gynecomastia, breast pain, hot flashes, hepatotoxicity", contra: "Severe hepatic impairment; monitor LFTs", pearl: "Used for GnRH agonist flare protection (started 1 week before leuprolide) and as combined androgen blockade. Monitor liver function at baseline and periodically." },
      { name: "Docetaxel", type: "Taxane chemotherapy", action: "Inhibits microtubule depolymerization, preventing cell division in rapidly dividing cancer cells", sideEffects: "Neutropenia, peripheral neuropathy, fluid retention, alopecia, mucositis", contra: "Neutrophil count <1500/μL, severe hepatic impairment", pearl: "First-line chemotherapy for metastatic castration-resistant prostate cancer (mCRPC). Combined with prednisone. Monitor CBC before each cycle." },
      { name: "Zoledronic Acid", type: "Bisphosphonate", action: "Inhibits osteoclast-mediated bone resorption; reduces skeletal-related events in bone metastases", sideEffects: "Osteonecrosis of the jaw (ONJ), renal toxicity, hypocalcemia", contra: "CrCl <35 mL/min, recent dental extraction", pearl: "Administer IV over 15 minutes. Dental evaluation before initiating. Supplement with calcium and vitamin D. Monitor renal function." }
    ],
    pearls: [
      "Gleason score is the strongest predictor of prostate cancer prognosis; Gleason ≥8 indicates aggressive disease",
      "PSA should become undetectable after radical prostatectomy; any detectable PSA post-surgery suggests residual or recurrent disease",
      "GnRH agonists cause an initial testosterone flare that can worsen bone pain or urinary obstruction; antiandrogen flare protection is essential",
      "Bone metastases from prostate cancer are characteristically osteoblastic (bone-forming), unlike most other cancer metastases which are osteolytic",
      "Active surveillance is an appropriate strategy for low-risk prostate cancer (Gleason 6, PSA <10, T1c-T2a) to avoid overtreatment"
    ],
    quiz: [
      { question: "A patient's prostate biopsy shows a Gleason score of 9. What does this indicate?", options: ["Low-grade, slow-growing tumor", "Benign prostatic hyperplasia", "High-grade, aggressive tumor requiring urgent treatment", "Normal prostate tissue"], correct: 2, rationale: "A Gleason score of 9 (out of 10) indicates a high-grade, poorly differentiated, aggressive tumor requiring definitive treatment. Higher Gleason scores are associated with worse prognosis." },
      { question: "A patient starting leuprolide (Lupron) asks why he also needs bicalutamide. What is the best explanation?", options: ["Bicalutamide treats the prostate cancer directly", "Bicalutamide prevents the initial testosterone flare that occurs in the first 2 weeks of leuprolide therapy", "Bicalutamide is a pain medication", "Bicalutamide lowers PSA independently"], correct: 1, rationale: "GnRH agonists like leuprolide cause an initial testosterone surge (flare) in the first 2 weeks before suppression occurs. Bicalutamide blocks androgen receptors during this period, preventing tumor flare symptoms." },
      { question: "Which type of bone metastasis is characteristic of prostate cancer?", options: ["Osteolytic (bone-destroying)", "Osteoblastic (bone-forming)", "Mixed lytic and blastic", "No bone involvement"], correct: 1, rationale: "Prostate cancer bone metastases are characteristically osteoblastic (sclerotic, bone-forming), unlike most other cancers which produce osteolytic metastases. This is a frequently tested distinction." }
    ]
  },

  "prostate-cancer-np": {
    title: "Prostate Cancer",
    cellular: {
      title: "Molecular Biology and Treatment Algorithms",
      content: "Prostate cancer pathogenesis involves a multistep process from prostatic intraepithelial neoplasia (PIN) to invasive adenocarcinoma. Key molecular alterations include TMPRSS2-ERG gene fusion (found in ~50% of prostate cancers), loss of PTEN tumor suppressor, TP53 mutations (associated with castration resistance), and androgen receptor amplification/mutation. The androgen receptor (AR) signaling axis is the central therapeutic target: testosterone is converted to dihydrotestosterone (DHT) by 5-alpha reductase, and DHT binds AR to activate transcription of proliferative genes. Castration-resistant prostate cancer (CRPC) develops through AR amplification, AR splice variants (AR-V7), intratumoral androgen synthesis, and bypass signaling pathways. The clinician must apply risk stratification (NCCN guidelines), prescribe stage-appropriate therapy across the spectrum from active surveillance to combination systemic therapy, manage treatment toxicities, and integrate genomic testing into clinical decision-making."
    },
    riskFactors: [
      "Age >65 (median age at diagnosis 66)",
      "Black race (2x incidence, 2.4x mortality vs White men; earlier screening recommended at age 40)",
      "BRCA2 mutation (3-8x increased risk; associated with aggressive disease)",
      "BRCA1 mutation (1.8-3.5x increased risk)",
      "Lynch syndrome (MLH1, MSH2 mutations)",
      "HOXB13 G84E mutation (associated with hereditary prostate cancer)",
      "Family history: first-degree relative with prostate cancer doubles risk",
      "Metabolic syndrome and obesity (associated with higher-grade disease)"
    ],
    diagnostics: [
      "Apply shared decision-making for PSA screening: begin discussion at age 50 (general population) or 40-45 (Black men, BRCA2 carriers, family history)",
      "Interpret PSA in clinical context: PSA >4 ng/mL warrants further evaluation; free PSA% <10% increases cancer suspicion",
      "Order multiparametric MRI (mpMRI) prostate before biopsy (PI-RADS scoring: 4-5 suspicious for clinically significant cancer)",
      "Order MRI-targeted + systematic transrectal or transperineal prostate biopsy",
      "Apply ISUP Grade Group system (replaces Gleason): Grade Group 1 (Gleason 3+3=6) through Grade Group 5 (Gleason 9-10)",
      "Order genomic testing: Decipher, Oncotype DX Prostate, or Prolaris for risk stratification in intermediate-risk disease",
      "Stage advanced disease: technetium-99m bone scan, CT abdomen/pelvis, PSMA-PET/CT (more sensitive for recurrence and metastasis)"
    ],
    management: [
      "Very low/low risk (Grade Group 1, PSA <10, ≤T2a): active surveillance with PSA q6 months, DRE annually, repeat biopsy at 1-2 years",
      "Favorable intermediate risk: active surveillance or definitive therapy (radical prostatectomy or EBRT + short-term ADT 4-6 months)",
      "Unfavorable intermediate/high risk: radical prostatectomy with PLND or EBRT + long-term ADT (18-36 months)",
      "Biochemical recurrence post-prostatectomy (PSA >0.2): salvage radiation ± ADT",
      "Metastatic hormone-sensitive (mHSPC): ADT + docetaxel or abiraterone or enzalutamide or darolutamide; ADT + EBRT to primary for low-volume metastatic",
      "Castration-resistant (CRPC): abiraterone + prednisone, enzalutamide, docetaxel, cabazitaxel",
      "BRCA1/2 mutated CRPC: olaparib (PARP inhibitor) per HRR gene testing",
      "Bone-protective therapy: denosumab or zoledronic acid for skeletal-related events prevention"
    ],
    nursingActions: [
      "Apply NCCN risk stratification to guide treatment recommendations",
      "Prescribe and manage ADT: GnRH agonist/antagonist, monitor testosterone levels (<50 ng/dL = castrate)",
      "Manage ADT metabolic complications: DEXA scan at baseline, lipid panel, HgbA1c, cardiovascular risk assessment",
      "Prescribe and manage novel hormonal agents: abiraterone (with prednisone, monitor LFTs, K+, BP), enzalutamide (seizure risk, drug interactions)",
      "Order and interpret genomic assays for treatment planning: Decipher (post-prostatectomy recurrence risk), HRR testing (PARP inhibitor eligibility)",
      "Manage castration-resistant progression: interpret PSA kinetics, radiographic progression, clinical deterioration",
      "Coordinate multidisciplinary tumor board discussion for complex cases",
      "Prescribe supportive care: bone health (calcium, vitamin D, bisphosphonate/denosumab), sexual health (PDE5 inhibitors, vacuum devices, penile prosthesis referral)"
    ],
    signs: {
      left: [
        "Asymptomatic with elevated PSA (most common presentation)",
        "Hard, irregular nodule on DRE",
        "Lower urinary tract symptoms (locally advanced)",
        "Elevated PSA velocity (>0.75 ng/mL/year suspicious)"
      ],
      right: [
        "Bone pain: axial skeleton predominance (osteoblastic metastases)",
        "Elevated alkaline phosphatase (bone metastasis marker)",
        "Spinal cord compression: oncologic emergency (back pain, leg weakness, urinary retention)",
        "Castration-resistant progression: rising PSA despite castrate testosterone levels",
        "Paraneoplastic syndromes (rare): hypercalcemia, thromboembolism"
      ]
    },
    medications: [
      { name: "Enzalutamide (Xtandi)", type: "Next-generation antiandrogen", action: "Potent AR signaling inhibitor: blocks AR ligand binding, nuclear translocation, and DNA binding", sideEffects: "Fatigue, seizures (dose-dependent), hypertension, cognitive changes, falls", contra: "Seizure history or predisposing conditions; avoid concurrent strong CYP2C8 inhibitors", pearl: "PROSPER and ENZAMET trials: significant survival benefit in both non-metastatic CRPC and metastatic HSPC. Monitor BP, cognitive function, and fall risk in elderly patients." },
      { name: "Abiraterone (Zytiga)", type: "CYP17A1 inhibitor", action: "Blocks CYP17 hydroxylase/lyase, inhibiting testicular, adrenal, and intratumoral androgen synthesis", sideEffects: "Hypertension, hypokalemia, fluid retention, hepatotoxicity, adrenal insufficiency", contra: "Severe hepatic impairment (Child-Pugh C)", pearl: "Must be co-prescribed with prednisone 5mg BID to prevent mineralocorticoid excess. LATITUDE/STAMPEDE trials: OS benefit in mHSPC. Monitor LFTs monthly, K+ biweekly initially, BP at each visit." },
      { name: "Olaparib (Lynparza)", type: "PARP inhibitor", action: "Inhibits poly(ADP-ribose) polymerase, preventing DNA repair in HRR-deficient tumor cells (synthetic lethality)", sideEffects: "Anemia, fatigue, nausea, thrombocytopenia, MDS/AML (rare)", contra: "Concurrent strong CYP3A4 inhibitors (dose reduce); myelosuppression", pearl: "PROfound trial: OS benefit in mCRPC with BRCA1/2 or ATM mutations. Requires prior somatic or germline HRR gene testing. Monitor CBC every 4 weeks." },
      { name: "Denosumab (Xgeva)", type: "RANK ligand inhibitor", action: "Monoclonal antibody that inhibits osteoclast differentiation and activation, preventing bone resorption", sideEffects: "Hypocalcemia, osteonecrosis of the jaw, atypical femur fracture", contra: "Hypocalcemia (correct before initiating), recent dental surgery", pearl: "120mg SC monthly for bone metastases. Dental evaluation before initiation. Supplement calcium 500mg + vitamin D 400 IU daily. Superior to zoledronic acid for SRE prevention per pivotal trial. No renal dose adjustment needed." }
    ],
    pearls: [
      "PSMA-PET/CT is replacing conventional bone scan and CT for staging and recurrence detection due to superior sensitivity",
      "AR-V7 splice variant detection in circulating tumor cells predicts resistance to abiraterone and enzalutamide; consider taxane-based chemotherapy",
      "All patients with metastatic prostate cancer should undergo germline genetic testing for BRCA1/2 and other HRR genes to determine PARP inhibitor eligibility",
      "Active surveillance for low-risk prostate cancer has equivalent 15-year cancer-specific survival to radical treatment, avoiding overtreatment morbidity",
      "Spinal cord compression from prostate cancer is an oncologic emergency requiring emergent MRI, high-dose dexamethasone, and urgent radiation or surgical decompression"
    ],
    quiz: [
      { question: "An NP is managing a patient with mCRPC whose tumor testing reveals a BRCA2 mutation. Which targeted therapy is indicated?", options: ["Enzalutamide", "Abiraterone", "Olaparib", "Docetaxel"], correct: 2, rationale: "Olaparib is a PARP inhibitor approved for mCRPC with homologous recombination repair (HRR) gene mutations including BRCA2. The PROfound trial demonstrated overall survival benefit in this molecularly selected population." },
      { question: "A patient on abiraterone develops hypertension and hypokalemia. What is the underlying mechanism?", options: ["Direct cardiotoxicity", "Mineralocorticoid excess from CYP17 blockade causing increased corticosterone and DOC levels", "Renal artery stenosis", "Drug interaction with antihypertensive"], correct: 1, rationale: "Abiraterone blocks CYP17, which shunts steroid precursors toward mineralocorticoid pathways, causing excess DOC and corticosterone production. This leads to hypertension, hypokalemia, and fluid retention, which is why prednisone co-prescription is mandatory." },
      { question: "Which imaging modality has the highest sensitivity for detecting recurrent prostate cancer after radical prostatectomy?", options: ["Technetium-99m bone scan", "CT abdomen and pelvis", "PSMA-PET/CT", "Transrectal ultrasound"], correct: 2, rationale: "PSMA-PET/CT has superior sensitivity compared to conventional imaging for detecting recurrent and metastatic prostate cancer, particularly at low PSA levels (<0.5 ng/mL) where traditional imaging is often negative." }
    ]
  }
};
