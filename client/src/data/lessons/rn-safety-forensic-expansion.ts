import type { LessonContent } from "./types";

export const rnSafetyForensicExpansionLessons: Record<string, LessonContent> = {
  "forensic-evidence-collection-rn": {
    title: "Forensic Evidence Collection: Chain of Custody",
    cellular: {
      title: "Principles of Forensic Evidence Preservation in Nursing",
      content: "Forensic nursing involves the application of nursing science to legal proceedings, particularly in collecting, preserving, and documenting physical evidence from victims and perpetrators of violence. Evidence integrity depends on maintaining chain of custody—an unbroken documented trail showing who collected, handled, transferred, and stored evidence from the point of collection through presentation in court. Biological evidence (blood, saliva, semen, hair, tissue) contains DNA that can identify perpetrators through short tandem repeat (STR) analysis. Trace evidence (fibers, soil, glass fragments) transfers between victim and perpetrator per Locard's exchange principle—every contact leaves a trace. The Sexual Assault Nurse Examiner (SANE) performs comprehensive forensic examinations using standardized evidence collection kits, documenting injuries with body maps, photography, and detailed written descriptions. Improper evidence handling—contamination, breaks in chain of custody, or inadequate documentation—renders evidence inadmissible in court, potentially preventing justice for the victim."
    },
    riskFactors: [
      "Sexual assault and rape cases requiring forensic examination",
      "Physical assault with weapon injuries requiring evidence documentation",
      "Child abuse cases with suspicious injuries or discrepant history",
      "Intimate partner violence with patterns of injury",
      "Elder abuse and neglect in institutional or home settings",
      "Strangulation cases requiring specialized assessment",
      "Gunshot wounds and stab wounds in trauma settings",
      "Suspicious deaths requiring evidence preservation"
    ],
    diagnostics: [
      "Comprehensive forensic examination using standardized sexual assault evidence kit",
      "Photographic documentation of all injuries with and without a measuring scale",
      "Body map documentation noting location, size, shape, and color of each injury",
      "Colposcopy for genital examination with magnified photography",
      "Wood's lamp examination for biological fluid detection (semen, saliva)",
      "Collection of clothing and personal items in paper bags (NOT plastic)",
      "Toxicology screening if drug-facilitated assault suspected"
    ],
    management: [
      "Ensure patient safety and medical stabilization before evidence collection",
      "Obtain informed consent for forensic examination—it is separate from medical consent",
      "Follow standardized evidence collection kit instructions precisely",
      "Maintain chain of custody: document every transfer of evidence with signatures and timestamps",
      "Provide STI prophylaxis, emergency contraception, and tetanus as indicated",
      "Mandatory reporting obligations for child abuse and vulnerable adult abuse",
      "Refer to victim advocacy services and crisis counseling"
    ],
    nursingActions: [
      "Separate the patient from the perpetrator and ensure immediate safety",
      "Do NOT allow the patient to eat, drink, bathe, change clothes, or urinate before evidence collection if possible",
      "Obtain informed consent: patient has the right to decline any or all parts of the forensic exam",
      "Wear gloves and change between collection sites to prevent cross-contamination",
      "Package all evidence in PAPER bags (plastic causes bacterial degradation of biological evidence)",
      "Label every specimen with patient name, date/time of collection, collector name, and anatomic site",
      "Document injuries using body diagrams, photographs with measuring ruler, and detailed narrative",
      "Provide trauma-informed care: explain each step, allow patient control over the process, avoid re-traumatization",
      "Document patient statements using direct quotes without interpretation",
      "Turn evidence over to law enforcement with documented chain of custody transfer"
    ],
    assessmentFindings: [
      "Physical injuries: bruises, lacerations, bite marks, defensive wounds on hands/forearms",
      "Patterned injuries suggesting specific objects (belt marks, cord marks, cigarette burns)",
      "Strangulation findings: petechiae above ligature line, hoarseness, neck bruising",
      "Emotional distress: fear, dissociation, flat affect, hypervigilance",
      "Discrepancy between stated mechanism and injury pattern (especially in abuse cases)"
    ],
    signs: {
      left: [
        "Defensive wounds on hands and forearms",
        "Patterned bruising suggesting object impact",
        "Bite marks with measurable arch pattern",
        "Petechiae above strangulation ligature line"
      ],
      right: [
        "Delayed presentation (may indicate coercion or fear)",
        "Inconsistent history with injury pattern",
        "Multiple injuries in various stages of healing",
        "Patient fear of specific person or reluctance to report"
      ]
    },
    medications: [
      { name: "Emergency Contraception (Plan B)", type: "Progestin-Only Contraceptive", action: "Levonorgestrel 1.5mg prevents or delays ovulation. Most effective within 72 hours of unprotected intercourse", sideEffects: "Nausea, headache, menstrual irregularity, fatigue", contra: "Known pregnancy (will not terminate existing pregnancy)", pearl: "Offer to all sexual assault survivors of childbearing potential. Effective up to 72 hours, some efficacy to 120 hours. Does not cause abortion and will not harm an existing pregnancy." },
      { name: "Ceftriaxone + Azithromycin", type: "STI Prophylaxis Regimen", action: "Ceftriaxone 500mg IM covers gonorrhea; Azithromycin 1g PO covers chlamydia. Standard dual therapy for STI prophylaxis post-sexual assault", sideEffects: "GI upset, injection site pain, allergic reaction", contra: "Severe cephalosporin or macrolide allergy", pearl: "Administer as part of comprehensive post-assault care. Add metronidazole 2g PO for trichomoniasis coverage. Hepatitis B vaccine series and HIV PEP should also be discussed." }
    ],
    pearls: [
      "PAPER bags for evidence, NEVER plastic—plastic promotes bacterial growth and degrades biological evidence",
      "Chain of custody must be unbroken: document every person who touches the evidence, with date, time, and signature",
      "The patient has the RIGHT to decline any or all parts of the forensic exam—informed consent is essential",
      "Use direct quotes when documenting patient statements: 'He hit me with his fist' NOT 'patient was assaulted'",
      "Forensic evidence can be collected up to 72-96 hours after assault, but earlier collection yields better results",
      "Strangulation is one of the most lethal forms of IPV—patients may die days later from delayed complications (carotid dissection, pulmonary edema)"
    ],
    quiz: [
      { question: "When collecting forensic evidence from a sexual assault survivor, the nurse should package clothing in:", options: ["Sealed plastic bags to preserve moisture", "Paper bags to allow air circulation and prevent evidence degradation", "Clear plastic containers for visual inspection", "Any available container with a biohazard label"], correct: 1, rationale: "Paper bags allow air circulation, preventing bacterial overgrowth that degrades biological evidence. Plastic bags trap moisture and promote bacterial degradation of DNA evidence." },
      { question: "A sexual assault survivor states she does not want a forensic exam but does want medical treatment. What should the nurse do?", options: ["Explain that the exam is mandatory for treatment", "Respect her decision and provide medical treatment without forensic evidence collection", "Delay medical treatment until she agrees to the exam", "Contact law enforcement to convince her"], correct: 1, rationale: "The forensic examination requires separate informed consent from medical treatment. The patient has the right to decline any or all parts of the forensic exam while still receiving medical care." },
      { question: "When documenting a patient's statement about an assault, the nurse should write:", options: ["Patient was beaten by her partner", "Patient reports being physically assaulted", "Patient states: 'My boyfriend punched me in the face three times'", "Patient sustained injuries consistent with domestic violence"], correct: 2, rationale: "Direct quotes preserve the patient's exact words without interpretation. This is essential for legal proceedings. Avoid paraphrasing, interpreting, or using clinical language to describe patient statements." }
    ]
  },

  "human-trafficking-recognition-rn": {
    title: "Human Trafficking: Recognition & Response",
    cellular: {
      title: "Human Trafficking: Public Health and Nursing Implications",
      content: "Human trafficking is a form of modern slavery involving the use of force, fraud, or coercion to exploit individuals for labor or commercial sex. The Trafficking Victims Protection Act (TVPA) defines severe forms of trafficking as: sex trafficking where a commercial sex act is induced by force, fraud, or coercion, or where the victim is under 18; and labor trafficking involving the recruitment, harboring, or transportation of a person for involuntary servitude or slavery. Trafficking causes severe physical and psychological harm. Victims experience complex trauma with chronic stress activation of the hypothalamic-pituitary-adrenal (HPA) axis, resulting in elevated cortisol levels, disrupted immune function, and altered brain architecture—particularly in the amygdala (hyperactivation leading to hypervigilance) and prefrontal cortex (impaired executive function and decision-making). Stockholm syndrome (trauma bonding) develops as a survival mechanism where the victim forms psychological attachment to the trafficker. Healthcare providers may be the only professionals to encounter trafficking victims in a non-coercive setting, making recognition in emergency departments, clinics, and hospitals critical."
    },
    riskFactors: [
      "Runaway and homeless youth (highest risk population)",
      "History of childhood abuse, neglect, or foster care involvement",
      "Substance use disorders (may be introduced by trafficker for control)",
      "Undocumented immigration status (fear of deportation used as control)",
      "Economic vulnerability and poverty",
      "LGBTQ+ youth experiencing family rejection",
      "Individuals with intellectual or developmental disabilities",
      "History of prior trafficking victimization"
    ],
    diagnostics: [
      "Screen using validated tools: NHTRC (National Human Trafficking Resource Center) screening questions",
      "Assess for red flags: patient accompanied by controlling individual who answers questions, speaks for patient",
      "Physical examination for signs of abuse, malnourishment, branding marks, tattoos indicating ownership",
      "STI screening and pregnancy testing for suspected sex trafficking victims",
      "Toxicology screening (victims may be given drugs to maintain control)",
      "Mental health screening: PTSD, depression, anxiety, complex trauma"
    ],
    management: [
      "Ensure patient safety above all else—separate from potential trafficker before screening",
      "Follow mandatory reporting laws for minors (any minor in commercial sex is trafficking by definition)",
      "Contact National Human Trafficking Hotline: 1-888-373-7888",
      "Provide medical treatment for injuries, infections, malnutrition, substance withdrawal",
      "Refer to anti-trafficking organizations and victim services",
      "Do NOT contact law enforcement without victim consent for adult victims (may increase danger)",
      "Document findings carefully for potential legal proceedings"
    ],
    nursingActions: [
      "Interview patient ALONE—never screen with the accompanying person present",
      "Use trauma-informed, nonjudgmental approach: 'Are you safe? Is anyone controlling you or threatening you?'",
      "Assess for red flags: fearfulness, submission, avoiding eye contact, scripted/inconsistent history",
      "Look for physical indicators: branding/tattoo marks, signs of physical/sexual abuse, malnourishment",
      "Provide interpreter services if needed—NEVER use accompanying individuals as interpreters",
      "Offer written resources that look innocuous (business cards with hotline number, not pamphlets)",
      "Document objective findings without drawing conclusions about trafficking status",
      "Do not judge or pressure the patient to leave their situation—they may not be ready and may be in danger",
      "Connect with social work and victim advocacy services",
      "Know your state's mandatory reporting requirements for suspected trafficking"
    ],
    assessmentFindings: [
      "Signs of physical abuse in various stages of healing",
      "Evidence of malnourishment, dehydration, and poor hygiene",
      "Multiple STIs or evidence of untreated medical conditions",
      "Branding marks, tattoos indicating 'ownership,' or burn marks",
      "Psychological indicators: PTSD symptoms, depression, anxiety, flat affect, hypervigilance",
      "Patient is accompanied by a controlling individual who does not leave them alone",
      "Inconsistent history or scripted responses to questions"
    ],
    signs: {
      left: [
        "Accompanied by controlling individual who speaks for patient",
        "Fearfulness, avoidance of eye contact, submissive behavior",
        "Branding marks or 'ownership' tattoos",
        "Signs of physical and sexual abuse"
      ],
      right: [
        "Malnourishment and multiple untreated conditions",
        "PTSD symptoms: hypervigilance, dissociation, nightmares",
        "Substance abuse (may be trafficker-introduced)",
        "No control over personal identification or finances"
      ]
    },
    medications: [
      { name: "Ceftriaxone + Doxycycline + Metronidazole", type: "Comprehensive STI Prophylaxis", action: "Empiric coverage for gonorrhea (ceftriaxone), chlamydia (doxycycline), and trichomoniasis/BV (metronidazole). Used when trafficking victim presents with high risk for multiple untreated STIs", sideEffects: "GI upset, photosensitivity (doxycycline), metallic taste (metronidazole)", contra: "Pregnancy (doxycycline—substitute azithromycin), severe hepatic disease (metronidazole)", pearl: "Trafficking victims often have multiple untreated STIs. Provide comprehensive screening and empiric treatment. Also screen for HIV, hepatitis B/C, and syphilis with serologic testing." },
      { name: "Sertraline (Zoloft)", type: "SSRI Antidepressant", action: "First-line pharmacotherapy for PTSD and co-occurring depression in trafficking survivors. Increases serotonin availability in the synaptic cleft", sideEffects: "Nausea, insomnia, sexual dysfunction, headache, serotonin syndrome risk with MAOIs", contra: "MAO inhibitor use within 14 days, concurrent pimozide use", pearl: "FDA-approved for PTSD. Start 25-50mg daily, titrate to 50-200mg. Combine with trauma-focused cognitive behavioral therapy for best outcomes. Monitor for increased suicidality in first weeks." }
    ],
    pearls: [
      "ANY minor involved in commercial sex is a trafficking victim BY LAW—no proof of force, fraud, or coercion is needed for minors",
      "The trafficker often accompanies the victim to healthcare visits—ALWAYS interview the patient ALONE",
      "NEVER use the accompanying individual as an interpreter—use professional interpreter services",
      "Do not judge the victim for not wanting to leave—trauma bonding, fear, and survival needs are complex barriers",
      "National Human Trafficking Hotline: 1-888-373-7888 or text 233733 (BEFREE)",
      "Healthcare settings may be the ONLY place a trafficking victim encounters professionals outside the trafficking situation"
    ],
    quiz: [
      { question: "A patient presents accompanied by an older individual who answers all questions and does not leave the patient's side. The patient appears fearful and avoids eye contact. What should the nurse do first?", options: ["Proceed with the assessment as normal with both present", "Separate the patient from the companion and screen privately", "Contact law enforcement immediately", "Document observations and discharge"], correct: 1, rationale: "Red flags for trafficking include a controlling companion who speaks for the patient. The nurse must separate the patient and screen privately using trauma-informed questions to assess safety." },
      { question: "When screening a patient for human trafficking, the nurse should:", options: ["Ask questions in front of the accompanying person for corroboration", "Use the accompanying person as interpreter if needed", "Interview the patient alone using professional interpreter services if needed", "Ask the patient directly: 'Are you being trafficked?'"], correct: 2, rationale: "The patient must be interviewed alone, and professional interpreter services must be used—never the accompanying person, who may be the trafficker. Direct questions about trafficking may not be effective due to trauma bonding." },
      { question: "A 16-year-old presents with multiple STIs and admits to 'working' at hotels for money for a 'friend.' Under the law, this is:", options: ["Prostitution requiring criminal charges", "Human trafficking by legal definition—any minor in commercial sex is a trafficking victim", "A personal choice requiring counseling only", "Not reportable if the minor consents"], correct: 1, rationale: "Under the TVPA, any minor involved in commercial sex is a trafficking victim by definition, regardless of apparent consent. No proof of force, fraud, or coercion is needed. This requires mandatory reporting." }
    ]
  },

  "workplace-violence-prevention-rn": {
    title: "Workplace Violence Prevention in Healthcare",
    cellular: {
      title: "Workplace Violence in Healthcare: Scope and Prevention Science",
      content: "Healthcare workers experience workplace violence at rates 4 times higher than workers in private industry. The Bureau of Labor Statistics reports that healthcare accounts for 73% of all nonfatal workplace violence injuries. Violence occurs across a spectrum from verbal abuse and threats (Type II: client/patient-on-worker) to physical assault and homicide. Contributing factors include patient psychiatric illness, substance intoxication, delirium, dementia-related behavioral symptoms, pain, fear, and environmental stressors such as long wait times and overcrowding. The neurobiological basis of aggression involves the amygdala activating the hypothalamic-pituitary-adrenal (HPA) axis and sympathetic nervous system fight-or-flight response. Prefrontal cortex dysfunction (from intoxication, delirium, brain injury, or psychiatric illness) impairs impulse control and rational decision-making, disinhibiting aggressive behavior. De-escalation techniques work by engaging the prefrontal cortex through calm, clear communication that reduces amygdala activation. Prevention follows a hierarchy: environmental design (eliminate weapons, improve visibility), administrative controls (staffing, training, reporting systems), and personal response training (de-escalation, safe restraint techniques)."
    },
    riskFactors: [
      "Emergency department and psychiatric unit settings (highest risk areas)",
      "Working alone or in isolated areas",
      "Patients under influence of alcohol or drugs",
      "Patients with acute psychosis, mania, or agitation",
      "Dementia with behavioral and psychological symptoms (BPSD)",
      "Long wait times and overcrowded clinical environments",
      "Inadequate staffing levels limiting supervision and response",
      "History of violence by the patient (strongest predictor)"
    ],
    diagnostics: [
      "Use validated violence risk assessment tools: Brøset Violence Checklist, Dynamic Appraisal of Situational Aggression (DASA)",
      "Assess early warning signs of escalation: loud speech, pacing, clenched fists, invasion of personal space",
      "Review patient history for prior violent behavior, psychiatric diagnoses, substance use",
      "Environmental scan: identify potential weapons, exits, and barriers",
      "Monitor for physiological indicators of agitation: tachycardia, diaphoresis, dilated pupils",
      "Assess staff-to-patient ratio and available support resources"
    ],
    management: [
      "De-escalation first: use calm voice, active listening, offer choices, maintain safe distance",
      "Chemical restraint only when verbal de-escalation fails: olanzapine, haloperidol, or lorazepam per protocol",
      "Physical restraint as LAST resort: trained team, minimal force, continuous monitoring per protocol",
      "Post-incident: medical evaluation of injured staff, debriefing, incident reporting, psychological support",
      "Environmental modifications: panic buttons, security presence, weapon screening, adequate lighting",
      "Zero-tolerance policy for violence with clear organizational support for reporting"
    ],
    nursingActions: [
      "Assess all patients for violence risk on admission and with clinical status changes",
      "Use de-escalation techniques: speak calmly, use non-threatening body language, offer choices, actively listen",
      "Maintain safe distance (arm's length plus) and position near an exit during encounters",
      "Never turn your back on an agitated patient or allow yourself to be cornered",
      "Activate emergency response (code) if de-escalation fails and physical threat is imminent",
      "Document all incidents of violence or threats using standardized incident reporting system",
      "Support colleagues after violent incidents: debriefing, Employee Assistance Program referral",
      "Participate in regular violence prevention training and competency reviews",
      "Know the location of panic buttons, duress alarms, and exits in your work area",
      "Report ALL incidents—underreporting perpetuates the problem"
    ],
    assessmentFindings: [
      "Verbal indicators: raised voice, profanity, threats, demanding behavior",
      "Behavioral indicators: pacing, clenched fists, throwing objects, invasion of personal space",
      "Physiological indicators: flushed face, diaphoresis, rapid breathing, dilated pupils",
      "Cognitive indicators: confused thinking, paranoid ideation, inability to reason",
      "Contextual indicators: long wait time, pain, substance intoxication, involuntary admission"
    ],
    signs: {
      left: [
        "Raised voice and verbal threats",
        "Pacing and clenched fists",
        "Invasion of personal space",
        "Refusing to follow directions"
      ],
      right: [
        "Physical assault on staff or patients",
        "Weapon brandishing or use",
        "Self-harm behavior with potential to harm others",
        "Hostage-taking or barricading"
      ]
    },
    medications: [
      { name: "Haloperidol (Haldol)", type: "Typical Antipsychotic", action: "Dopamine D2 receptor antagonist providing rapid sedation for acute psychotic agitation. IM onset 20-40 minutes", sideEffects: "Acute dystonia, akathisia, QT prolongation, neuroleptic malignant syndrome", contra: "Parkinson disease, prolonged QT, CNS depression, coma", pearl: "Standard acute agitation dose: 5mg IM. Often combined with lorazepam 2mg IM and diphenhydramine 50mg IM (B52 cocktail). Monitor for EPS. Always obtain ECG if repeated dosing." },
      { name: "Olanzapine (Zyprexa IM)", type: "Atypical Antipsychotic", action: "Serotonin-dopamine antagonist providing rapid tranquilization for acute agitation with lower EPS risk than haloperidol", sideEffects: "Orthostatic hypotension, excessive sedation, metabolic syndrome", contra: "Do NOT give within 1 hour of IM benzodiazepine (risk of severe hypotension/respiratory depression)", pearl: "10mg IM is effective within 15-30 minutes. CRITICAL: Do not combine with IM lorazepam—separate by at least 1 hour due to severe hypotension and respiratory depression risk. This is a common and dangerous medication error." }
    ],
    pearls: [
      "De-escalation is the FIRST intervention—chemical and physical restraints are LAST resorts",
      "The best predictor of violence is past violent behavior—always review the patient history",
      "NEVER combine IM olanzapine with IM benzodiazepines—this combination can cause fatal respiratory depression and hypotension",
      "Position yourself near the exit, never between the patient and the door—give the patient an escape route too",
      "All workplace violence incidents must be reported—underreporting prevents organizational improvements and support for affected staff",
      "Healthcare workers have the RIGHT to a safe workplace—violence is not 'part of the job'"
    ],
    quiz: [
      { question: "A patient in the ED is pacing, has clenched fists, and is speaking in an increasingly loud voice. What is the priority nursing action?", options: ["Call security for physical restraint", "Administer IM haloperidol for sedation", "Use verbal de-escalation: speak calmly, offer choices, actively listen", "Leave the area and wait for the patient to calm down"], correct: 2, rationale: "De-escalation is always the first intervention for an escalating patient. Calm communication, active listening, and offering choices engage the prefrontal cortex and can prevent escalation to physical violence." },
      { question: "Which medication combination is CONTRAINDICATED for acute agitation?", options: ["Haloperidol IM + Lorazepam IM", "Olanzapine IM + Lorazepam IM", "Haloperidol IM + Diphenhydramine IM", "Lorazepam IV + Haloperidol IV"], correct: 1, rationale: "IM olanzapine and IM lorazepam must NOT be given within 1 hour of each other due to risk of severe hypotension, excessive sedation, and respiratory depression. This is a critical safety consideration." },
      { question: "During a violent incident, the nurse should position themselves:", options: ["Between the patient and the door to prevent escape", "Near the exit with a clear path out of the room", "Directly in front of the patient to maintain eye contact", "Behind the patient to block their view of weapons"], correct: 1, rationale: "The nurse should always position near an exit with a clear escape path. Never position between the patient and the door, as this can escalate violence. Both the nurse and patient need an escape route." }
    ]
  },

  "sexual-assault-nurse-examiner-rn": {
    title: "SANE: Sexual Assault Nurse Examiner Role",
    cellular: {
      title: "Sexual Assault: Trauma-Informed Forensic Nursing",
      content: "The Sexual Assault Nurse Examiner (SANE) is an RN with specialized education and clinical preparation in the forensic examination of sexual assault survivors. The examination involves a comprehensive medical-forensic approach that simultaneously addresses the survivor's medical needs and collects evidence for potential criminal prosecution. The tonic immobility response during assault—a parasympathetic-mediated state of involuntary paralysis occurring in 12-50% of victims—explains why many victims do not fight back or scream, countering common misconceptions about 'expected' victim behavior. This is a neurobiological survival response, not consent. The fight-flight-freeze response is mediated by the amygdala bypassing conscious decision-making through the thalamo-amygdalar pathway. Trauma memories are stored as fragmented sensory fragments rather than coherent narratives because the hippocampus (responsible for contextual memory consolidation) is suppressed during extreme stress while the amygdala encodes emotional and sensory associations. This explains why victim accounts may seem inconsistent or fragmented—this is a NORMAL neurobiological response to trauma, not evidence of fabrication."
    },
    riskFactors: [
      "College-age females (highest risk demographic for sexual assault)",
      "Alcohol or drug intoxication reducing ability to consent",
      "Drug-facilitated sexual assault (GHB, flunitrazepam, ketamine)",
      "Prior sexual assault victimization (re-victimization risk)",
      "Intimate partner relationship (marital rape/partner sexual violence)",
      "Military service (military sexual trauma)",
      "Individuals with disabilities (cognitive, physical)",
      "Incarcerated populations"
    ],
    diagnostics: [
      "Comprehensive forensic examination using jurisdiction-specific sexual assault evidence kit",
      "Genital and extra-genital injury documentation with colposcopy and photography",
      "Evidence collection: swabs from all areas of contact, fingernail scrapings, loose debris",
      "Toxicology screening for drug-facilitated assault (urine within 96 hours, hair follicle for longer detection)",
      "Pregnancy testing (urine hCG)",
      "STI screening: gonorrhea, chlamydia, syphilis, HIV, hepatitis B/C, trichomoniasis",
      "Baseline CBC, CMP if physical injuries present"
    ],
    management: [
      "Medical treatment takes priority over evidence collection",
      "Forensic examination with informed consent using standardized evidence collection protocol",
      "STI prophylaxis: ceftriaxone, azithromycin/doxycycline, metronidazole",
      "Emergency contraception: levonorgestrel (Plan B) or ulipristal (Ella) within 120 hours",
      "HIV post-exposure prophylaxis (PEP): assess risk, initiate within 72 hours if indicated",
      "Hepatitis B vaccination if not previously immunized",
      "Tetanus prophylaxis if wound contamination risk",
      "Crisis intervention and referral to rape crisis center/victim advocacy"
    ],
    nursingActions: [
      "Approach with trauma-informed care: safety, trustworthiness, choice, collaboration, empowerment",
      "Explain every step of the examination before performing it—obtain permission for each component",
      "Document injuries objectively: describe size (measured), shape, color, location without interpretation",
      "Photograph all injuries with and without ruler/scale marker; include patient identification in images",
      "Use anatomically correct terminology in documentation",
      "Provide patient with a change of clothing (scrubs)—original clothing is evidence",
      "Offer patient advocate/support person presence during examination",
      "Provide follow-up instructions: STI testing at 2 weeks, pregnancy test if menses delayed, counseling resources",
      "Maintain evidence integrity: proper packaging, labeling, and chain of custody documentation",
      "Avoid phrases like 'alleged assault'—use 'reported assault' or 'patient states'"
    ],
    assessmentFindings: [
      "Genital injuries: tears, abrasions, bruising (documented by location using clock-face method)",
      "Extra-genital injuries: bruising on inner thighs, neck, arms, wrists (restraint marks)",
      "Emotional responses vary widely: crying, anger, calm/flat affect, dissociation (all are normal trauma responses)",
      "Evidence of force: torn clothing, ligature marks, defensive injuries",
      "Signs of drug-facilitated assault: amnesia, confusion, residual sedation"
    ],
    signs: {
      left: [
        "Genital injuries documented by colposcopy",
        "Bruising patterns suggesting restraint or force",
        "Emotional distress (variable presentation—all normal)",
        "Torn or disheveled clothing"
      ],
      right: [
        "Drug-facilitated assault: amnesia, confusion, positive toxicology",
        "Strangulation marks indicating life-threatening violence",
        "Pregnancy from assault",
        "PTSD symptoms: flashbacks, nightmares, hypervigilance"
      ]
    },
    medications: [
      { name: "Levonorgestrel (Plan B)", type: "Emergency Contraception", action: "Synthetic progestin that delays or inhibits ovulation. Does NOT terminate existing pregnancy. Most effective within 72 hours", sideEffects: "Nausea, headache, fatigue, menstrual irregularity", contra: "Known pregnancy (will not terminate but is unnecessary). Decreased efficacy in patients >75 kg—consider ulipristal or copper IUD", pearl: "Must be offered to all sexual assault survivors of reproductive potential. Effective up to 72 hours, some efficacy to 120 hours. For patients >75 kg, ulipristal (Ella) or copper IUD is more effective." },
      { name: "Emtricitabine/Tenofovir + Raltegravir", type: "HIV Post-Exposure Prophylaxis (PEP)", action: "28-day antiretroviral regimen to prevent HIV seroconversion. Must be initiated within 72 hours of exposure", sideEffects: "Nausea, diarrhea, fatigue, headache", contra: "Known HIV-positive patient (PEP is for prevention, not treatment)", pearl: "Assess HIV risk based on type of exposure, perpetrator risk factors, and local HIV prevalence. Must start within 72 hours, ideally within 2 hours. Complete 28-day course with follow-up HIV testing at 6 weeks, 3 months, and 6 months." }
    ],
    pearls: [
      "Tonic immobility (freeze response) is a neurobiological survival mechanism, NOT consent—12-50% of sexual assault victims experience involuntary paralysis",
      "Fragmented, inconsistent recall of events is a NORMAL neurobiological response to trauma, not evidence of fabrication",
      "All emotional responses to sexual assault are normal: crying, anger, calm/flat affect, laughing, dissociation",
      "Medical treatment ALWAYS takes priority over evidence collection",
      "HIV PEP must be initiated within 72 hours—do not delay for 'confirmed' HIV status of perpetrator",
      "Use 'patient reports/states' rather than 'alleged victim claims'—language matters for trauma-informed care and legal proceedings"
    ],
    quiz: [
      { question: "A sexual assault survivor appears calm and flat during the examination. How should the nurse interpret this?", options: ["The patient is likely fabricating the assault", "Flat affect is a normal trauma response and does not indicate dishonesty", "The patient needs psychiatric evaluation before proceeding", "The assault was probably not severe"], correct: 1, rationale: "All emotional responses to sexual assault are normal, including calm/flat affect, dissociation, crying, anger, or laughing. Flat affect does not indicate dishonesty—it is a common neurobiological response to trauma." },
      { question: "A patient reports sexual assault 60 hours ago. Is it too late for emergency contraception?", options: ["Yes, emergency contraception is only effective within 24 hours", "No, levonorgestrel is effective up to 72 hours and has some efficacy to 120 hours", "Yes, only a copper IUD can be used after 48 hours", "No, but it must be given intravenously at this point"], correct: 1, rationale: "Levonorgestrel (Plan B) is most effective within 72 hours but has some efficacy up to 120 hours. It should still be offered. For patients >75 kg, ulipristal (Ella) or copper IUD is more effective." },
      { question: "The SANE nurse should initiate HIV PEP within what timeframe?", options: ["Within 24 hours of the assault", "Within 72 hours, ideally within 2 hours", "Within 7 days of exposure", "Only after confirmatory HIV testing of the perpetrator"], correct: 1, rationale: "HIV PEP must be initiated within 72 hours of exposure, ideally within 2 hours. Do not delay for perpetrator HIV testing—initiate based on risk assessment. The 28-day regimen significantly reduces HIV transmission risk." }
    ]
  },

  "restraint-alternatives-rn": {
    title: "Restraint Use: Legal Requirements & Alternatives",
    cellular: {
      title: "Restraint Use: Patient Safety, Ethics, and Regulatory Standards",
      content: "Physical and chemical restraints restrict a patient's movement or behavior and carry significant risks of harm including asphyxiation, nerve damage, skin breakdown, increased agitation, rhabdomyolysis, aspiration, and psychological trauma. The Centers for Medicare & Medicaid Services (CMS) and The Joint Commission have strict regulations governing restraint use based on the principle that restraints are a safety intervention of LAST resort, not a treatment modality. Restraint-related deaths occur through positional asphyxia when a restrained patient in a prone or compromised position cannot adequately expand the chest wall for respiration. Compression of the thorax or neck by restraint devices can obstruct the airway or restrict respiratory excursion. Metabolic complications include rhabdomyolysis from prolonged muscle contraction against restraints, which releases myoglobin that can cause acute kidney injury. The physiological stress response to restraint application causes catecholamine surge, increasing heart rate, blood pressure, and metabolic demands. Patients with delirium, dementia, or cognitive impairment are at highest risk for restraint-related injury because they continue to struggle against restraints without understanding their purpose, escalating rather than resolving the behavioral emergency."
    },
    riskFactors: [
      "Acute delirium with agitation and potential for self-harm",
      "Psychiatric emergency with imminent danger to self or others",
      "Patient pulling at life-sustaining devices (ET tube, arterial lines, drains)",
      "Substance withdrawal with severe psychomotor agitation",
      "Traumatic brain injury with agitation and combativeness",
      "Dementia with behavioral and psychological symptoms (BPSD)",
      "Post-operative delirium in elderly patients"
    ],
    diagnostics: [
      "Document that less restrictive alternatives have been attempted and failed BEFORE applying restraints",
      "Obtain physician or LIP order within 1 hour of restraint application (or standing PRN order per policy)",
      "Assessment findings that justify restraint use: specific dangerous behavior documented",
      "Continuous monitoring: circulation, sensation, skin integrity, respiratory status every 15 minutes minimum",
      "Reassess need for continued restraint and document every 1-2 hours",
      "Physician face-to-face evaluation within specified timeframes: within 1 hour for behavioral restraints, within 24 hours for medical restraints"
    ],
    management: [
      "ALWAYS attempt alternatives FIRST: reorientation, 1:1 sitter, bed alarm, distraction, family presence, environmental modification",
      "Use least restrictive device for shortest time necessary",
      "Behavioral health restraints: maximum order duration 4 hours adults, 2 hours adolescents, 1 hour children under 9",
      "Medical restraints (preventing removal of medical devices): 24-hour renewal required with ongoing assessment",
      "Release restraints at least every 2 hours: perform ROM exercises, offer toileting, fluids, nutrition, repositioning",
      "Discontinue restraints as soon as the behavior that necessitated them resolves"
    ],
    nursingActions: [
      "Document ALL alternatives attempted and patient response before resorting to restraints",
      "Apply restraints correctly: allow 2 finger-widths between restraint and skin, secure to bed frame (NOT side rails)",
      "Check neurovascular status (circulation, sensation, movement) every 15 minutes when restraints are in place",
      "Release restraints every 2 hours: perform ROM, offer fluids, nutrition, toileting, reposition",
      "Maintain patient dignity: close door/curtain, explain reason for restraints, involve patient in care decisions",
      "Document continuous assessment: circulation checks, patient behavior, alternatives attempted, response to restraints",
      "Use quick-release knots—NEVER tie restraints in knots that cannot be quickly released in an emergency",
      "Ensure the patient can reach the call bell even when restrained",
      "Monitor for restraint-related complications: skin breakdown, aspiration, decreased circulation, respiratory compromise",
      "Debrief with the patient and team after restraint episode"
    ],
    assessmentFindings: [
      "Patient behavior that poses imminent risk of harm to self or others despite alternatives",
      "Pulling at endotracheal tube, central lines, or other life-sustaining devices",
      "Combative behavior preventing essential medical care",
      "Assessment of underlying cause: delirium, substance withdrawal, pain, fear, psychosis",
      "Determination that less restrictive measures have been exhausted"
    ],
    signs: {
      left: [
        "Agitation with risk of self-harm or harm to others",
        "Pulling at life-sustaining medical devices",
        "Combative behavior preventing essential care",
        "Confusion with wandering risk and fall danger"
      ],
      right: [
        "Neurovascular compromise: pallor, paresthesia, edema distal to restraint",
        "Skin breakdown or abrasion under restraint device",
        "Aspiration risk from positioning with restraints",
        "Psychological distress: increased agitation, fear, humiliation"
      ]
    },
    medications: [
      { name: "Haloperidol (Haldol) IM", type: "Chemical Restraint/Antipsychotic", action: "D2 receptor antagonist used for acute psychotic agitation when de-escalation and alternatives have failed. Chemical restraint is still a form of restraint requiring the same documentation and monitoring", sideEffects: "Acute dystonia, akathisia, QT prolongation, NMS", contra: "Parkinson disease, prolonged QT, CNS depression", pearl: "Chemical restraint carries the same regulatory requirements as physical restraint. Document indication, alternatives attempted, and monitoring. Onset 20-40 min IM. Always have diphenhydramine available for EPS." },
      { name: "Lorazepam (Ativan) IM", type: "Benzodiazepine/Anxiolytic", action: "Enhances GABA-A receptor activity producing sedation and anxiolysis. Used for acute agitation from alcohol withdrawal, anxiety, or non-psychotic behavioral emergencies", sideEffects: "Respiratory depression, paradoxical agitation (especially elderly), oversedation", contra: "Severe respiratory insufficiency, acute narrow-angle glaucoma, sleep apnea", pearl: "Monitor respiratory rate and oxygen saturation closely. Onset 15-30 min IM. Paradoxical disinhibition occurs more frequently in elderly and brain-injured patients—monitor for worsening agitation." }
    ],
    pearls: [
      "Restraints are ALWAYS a LAST resort—document all alternatives attempted and failed before application",
      "Tie restraints to the BED FRAME, never to the side rails—raising the rail with restraints attached can cause strangulation or limb injury",
      "Quick-release knots ONLY—the nurse must be able to release restraints immediately in an emergency (fire, cardiac arrest, aspiration)",
      "Two finger-widths between restraint and skin—too tight causes neurovascular compromise, too loose allows the patient to wiggle free and potentially strangle",
      "The call bell must remain accessible to the restrained patient at all times",
      "Prone positioning in restraints significantly increases asphyxiation risk—supine or lateral with continuous monitoring"
    ],
    quiz: [
      { question: "A restrained patient's fingers are cool and pale. What is the priority nursing action?", options: ["Document the finding and reassess in 1 hour", "Release the restraint immediately and assess neurovascular status", "Apply warm blankets to the fingers", "Loosen the restraint by one notch"], correct: 1, rationale: "Cool, pale fingers indicate neurovascular compromise from the restraint. The nurse must release the restraint immediately, perform a complete neurovascular assessment, and apply the restraint with more space or consider alternatives." },
      { question: "Where should wrist restraints be secured?", options: ["To the side rail for easy access", "To the bed frame using a quick-release knot", "To the IV pole for stability", "To the patient's clothing for comfort"], correct: 1, rationale: "Restraints must be tied to the bed frame (not side rails) using quick-release knots. Securing to side rails can cause strangulation or injury when rails are raised. Quick-release knots allow immediate removal in emergencies." },
      { question: "Before applying restraints, the nurse must:", options: ["Obtain a physician order first, then apply", "Apply restraints immediately for safety, then obtain an order within 1 hour", "Document alternatives attempted and their failure, then obtain an order per policy", "Get consent from the patient's family"], correct: 2, rationale: "CMS requires documentation that less restrictive alternatives have been attempted and failed before restraint application. A physician order must be obtained within 1 hour (or per institutional policy). Some situations allow application with immediate order follow-up." }
    ]
  },

  "suicide-prevention-safety-rn": {
    title: "Suicide Prevention & Environmental Safety",
    cellular: {
      title: "Suicidal Behavior: Neurobiology and Risk Assessment",
      content: "Suicidal behavior results from complex interactions between neurobiological vulnerability, psychological distress, and environmental stressors. The serotonergic system plays a central role: post-mortem studies of suicide victims consistently show reduced serotonin transporter (SERT) binding and decreased serotonin metabolite (5-HIAA) levels in the prefrontal cortex and brainstem raphe nuclei. This serotonergic deficit impairs inhibitory control over impulsive aggressive behavior mediated by the ventral prefrontal cortex. The hypothalamic-pituitary-adrenal (HPA) axis shows hyperactivity with elevated cortisol levels, reflecting chronic stress dysregulation. Neuroinflammation with elevated IL-6, TNF-alpha, and C-reactive protein is increasingly recognized as contributing to suicidal ideation through effects on tryptophan metabolism (kynurenine pathway) that further deplete serotonin. Genetic factors account for approximately 40% of suicidal behavior variance, with polymorphisms in genes encoding the serotonin transporter (SLC6A4), BDNF, and HPA axis components conferring vulnerability. The means restriction approach to prevention is based on evidence that reducing access to lethal means (firearms, medications, ligature points) during acute crisis significantly reduces suicide mortality because most suicidal crises are time-limited, and survivors of attempts rarely go on to die by suicide."
    },
    riskFactors: [
      "Prior suicide attempt (strongest predictor of future attempt)",
      "Major depressive disorder, bipolar disorder, schizophrenia, PTSD",
      "Substance use disorders (alcohol intoxication lowers inhibition)",
      "Access to lethal means, especially firearms",
      "Recent loss: death, divorce, job loss, financial crisis",
      "Social isolation and lack of connectedness",
      "Chronic pain or terminal illness",
      "Male sex and age >65 (highest completion rate)",
      "Family history of suicide",
      "Recent psychiatric hospitalization discharge (highest risk within 30 days)"
    ],
    diagnostics: [
      "Screen ALL patients using validated tools: Columbia Suicide Severity Rating Scale (C-SSRS) or PHQ-9 Item 9",
      "Assess suicidal ideation: frequency, duration, intensity, plan, intent, means access",
      "Differentiate passive ideation (wish to be dead) from active ideation (plan to kill self)",
      "Assess protective factors: reasons for living, social support, coping skills, religious beliefs",
      "Evaluate for acute warning signs: giving away possessions, sudden calmness after depression, farewell statements",
      "Evaluate psychiatric comorbidities and substance use"
    ],
    management: [
      "Immediate safety: 1:1 continuous observation for patients with active suicidal ideation and plan",
      "Environmental safety: remove all potential ligature points, sharps, medications, belts, cords from room",
      "Means restriction counseling: educate family to secure firearms, medications, and other lethal means at home",
      "Psychiatric consultation for medication management and safety planning",
      "Safety planning: collaborative development of coping strategies, support contacts, crisis resources",
      "Post-discharge: follow-up within 72 hours (highest risk period), crisis hotline information (988 Suicide and Crisis Lifeline)"
    ],
    nursingActions: [
      "Screen all patients for suicidal ideation using validated tools on admission and when clinical status changes",
      "Implement 1:1 continuous observation: maintain line of sight at all times, including bathroom",
      "Remove all potential means from environment: cords, belts, sharps, glass, medications, plastic bags",
      "Ensure patient cannot access anchoring points for ligature: shower rods, IV poles, door hinges",
      "Check and secure all items brought by visitors: no glass, sharps, belts, cords, ropes",
      "Develop collaborative safety plan with patient: warning signs, coping strategies, people to call, crisis resources",
      "Document risk assessment findings, interventions, and rationale clearly",
      "Provide the 988 Suicide and Crisis Lifeline number and crisis text line (text HOME to 741741)",
      "Monitor closely during high-risk periods: shift changes, nights, transition to lower level of care",
      "Approach suicidal patients with empathy and non-judgment—therapeutic relationship is protective"
    ],
    assessmentFindings: [
      "Expressions of hopelessness, worthlessness, or being a burden to others",
      "Statements about death or wanting to die",
      "Giving away possessions or making final arrangements",
      "Sudden calmness or cheerfulness after severe depression (may indicate decision to act)",
      "Increased substance use or reckless behavior",
      "Social withdrawal and isolation",
      "Researching methods or acquiring means (firearms, medications, ligatures)"
    ],
    signs: {
      left: [
        "Verbal expressions of hopelessness or desire to die",
        "Social withdrawal and isolation",
        "Giving away possessions",
        "Previous suicide attempt history"
      ],
      right: [
        "Active suicidal plan with means and intent",
        "Sudden calmness after severe depression (danger sign)",
        "Substance intoxication with suicidal ideation",
        "Access to lethal means (firearms, stockpiled medications)"
      ]
    },
    medications: [
      { name: "Lithium", type: "Mood Stabilizer", action: "Only psychiatric medication with specific anti-suicidal properties independent of mood stabilization. Reduces impulsivity and aggression through serotonergic enhancement", sideEffects: "Tremor, polyuria/polydipsia, hypothyroidism, renal impairment, narrow therapeutic index", contra: "Severe renal disease, dehydration, sodium depletion, Brugada syndrome", pearl: "Lithium is the ONLY medication with strong evidence for reducing suicide risk specifically. Therapeutic range 0.6-1.2 mEq/L. Toxicity >1.5 mEq/L. Monitor levels, renal function, and thyroid function regularly." },
      { name: "Clozapine (Clozaril)", type: "Atypical Antipsychotic", action: "FDA-approved for reducing suicidal behavior in schizophrenia and schizoaffective disorder. Mechanism involves serotonergic and dopaminergic modulation reducing impulsivity", sideEffects: "Agranulocytosis (requires weekly-biweekly CBC via REMS program), metabolic syndrome, myocarditis, seizures", contra: "History of clozapine-induced agranulocytosis, uncontrolled seizures, severe granulocytopenia", pearl: "The InterSePT trial demonstrated clozapine significantly reduces suicidal behavior in schizophrenia compared to olanzapine. REMS monitoring program requires ANC monitoring throughout treatment." }
    ],
    pearls: [
      "Asking about suicide does NOT increase risk—it shows care and opens critical dialogue",
      "The highest suicide risk period after psychiatric hospitalization is within 30 days of discharge—ensure close follow-up",
      "Means restriction is one of the most effective suicide prevention strategies: securing firearms prevents most gun suicides because the crisis is time-limited",
      "Sudden calmness after severe depression is a WARNING sign—the patient may have made the decision to act and feels 'relief'",
      "988 is the national Suicide and Crisis Lifeline (replaced the old 10-digit number in 2022)—ensure patients and families know this number",
      "Lithium is the ONLY medication with specific anti-suicidal properties proven by meta-analysis"
    ],
    quiz: [
      { question: "A severely depressed patient who has been expressing suicidal ideation suddenly appears calm and cheerful. What should the nurse do?", options: ["Celebrate the improvement and reduce monitoring level", "Recognize this as a potential danger sign and maintain or increase observation", "Prepare for discharge since the patient is improving", "Reduce the patient's medication dose since they seem better"], correct: 1, rationale: "Sudden calmness after severe depression is a classic warning sign that the patient may have decided on a plan and feels 'relief.' This requires maintained or increased observation and immediate reassessment." },
      { question: "Which environmental modification is MOST important for a patient on suicide precautions?", options: ["Keeping the room well-lit at all times", "Removing all potential ligature points, sharps, and medications from the environment", "Moving the patient to a private room", "Restricting all visitors"], correct: 1, rationale: "Environmental safety through means restriction is the most critical intervention. This includes removing cords, belts, sharps, medications, glass items, and ensuring no anchoring points for ligatures." },
      { question: "Which medication has specific anti-suicidal properties supported by strong evidence?", options: ["Fluoxetine (Prozac)", "Lithium", "Quetiapine (Seroquel)", "Diazepam (Valium)"], correct: 1, rationale: "Lithium is the only psychiatric medication with strong evidence from multiple meta-analyses for reducing suicide risk specifically, independent of its mood-stabilizing effects. It reduces impulsivity through serotonergic enhancement." }
    ]
  },

  "strangulation-assessment-rn": {
    title: "Strangulation Assessment: Forensic Nursing",
    cellular: {
      title: "Pathophysiology of Strangulation Injuries",
      content: "Strangulation is the obstruction of blood vessels and/or airway structures by external compression of the neck, and it is one of the most lethal forms of intimate partner violence. Vascular occlusion occurs at much lower forces than airway obstruction: the jugular veins are compressed at approximately 4.4 pounds of pressure, the carotid arteries at 11 pounds, and the trachea at 33 pounds. This means cerebral venous return is obstructed first while arterial inflow continues, causing rapid increase in intracranial pressure, petechiae above the level of compression (from capillary rupture), and loss of consciousness within 10-15 seconds. Continued compression leads to carotid artery intimal damage that can cause dissection and thrombosis, potentially resulting in ischemic stroke hours to days after the strangulation event. Laryngeal fracture can occur with greater force, damaging the thyroid cartilage, cricoid cartilage, or hyoid bone. Delayed complications include laryngeal edema causing airway obstruction 24-48 hours after the event, pulmonary edema from negative intrathoracic pressure generated during attempted breathing against a closed airway, and carotid artery dissection with delayed stroke. Up to 50% of strangulation victims have no visible external injuries."
    },
    riskFactors: [
      "Intimate partner violence (most common context for non-fatal strangulation)",
      "Prior strangulation by the same perpetrator (escalating violence pattern)",
      "History of domestic violence (strangulation is a strong predictor of future lethal violence)",
      "Perpetrator with controlling behavior and possessiveness",
      "Substance abuse (perpetrator or victim)",
      "Child abuse by caregiver",
      "Sexual assault involving strangulation"
    ],
    diagnostics: [
      "Detailed history: mechanism (manual, ligature, choking), duration of compression, loss of consciousness",
      "Comprehensive neck examination: anterior and posterior, with palpation of laryngeal structures",
      "Document external findings: petechiae (conjunctival, facial, behind ears), neck bruising, ligature marks",
      "Assess for voice changes: hoarseness, aphonia, dysphagia indicating internal injury",
      "CT angiography of neck if carotid/vertebral artery dissection suspected",
      "CT or MRI of neck for laryngeal fracture assessment",
      "Serial assessment for delayed symptoms over 24-48 hours"
    ],
    management: [
      "Monitor airway closely for 24-48 hours—delayed laryngeal edema can cause obstruction",
      "CT angiography if neurological symptoms or mechanism suggests arterial injury",
      "Anticoagulation if carotid/vertebral dissection identified",
      "ENT consultation for suspected laryngeal fracture or persistent hoarseness",
      "Forensic documentation: detailed photography, body maps, documentation of all findings",
      "Safety planning: strangulation is the strongest predictor of subsequent homicide in IPV"
    ],
    nursingActions: [
      "Prioritize airway assessment and monitoring—delayed laryngeal edema may develop 24-48 hours post-event",
      "Assess for subtle findings: petechiae on conjunctivae, behind ears, on eyelids (may be only visible signs)",
      "Document voice quality: normal, hoarse, raspy, whisper, aphonic (indicates laryngeal injury)",
      "Ask about symptoms during strangulation: loss of consciousness, vision changes, urinary/fecal incontinence",
      "Monitor neurological status: altered mental status, focal deficits suggesting stroke from carotid dissection",
      "Photograph all findings including lack of visible injury (document absence of external marks)",
      "Implement safety planning: explain lethality risk—strangulation victims are 750% more likely to be killed by the perpetrator",
      "Connect with domestic violence advocacy and crisis services",
      "Educate about delayed symptoms requiring emergency return: difficulty breathing, swallowing, speaking, or new neurological symptoms"
    ],
    assessmentFindings: [
      "Petechiae above the level of compression: conjunctival, periorbital, behind ears, face, scalp",
      "Voice changes: hoarseness, raspy voice, loss of voice (laryngeal injury indicator)",
      "Difficulty swallowing (dysphagia) indicating pharyngeal or laryngeal injury",
      "Neck bruising (may be minimal or absent in up to 50% of cases)",
      "Reported loss of consciousness during strangulation",
      "Urinary or fecal incontinence during event (loss of sphincter control from anoxia)"
    ],
    signs: {
      left: [
        "Petechiae on conjunctivae, face, behind ears",
        "Hoarseness or voice changes",
        "Visible neck bruising or ligature marks",
        "Difficulty swallowing"
      ],
      right: [
        "Delayed airway obstruction: stridor, dyspnea 24-48h later",
        "Carotid dissection: unilateral headache, Horner syndrome, stroke symptoms",
        "Laryngeal fracture: subcutaneous emphysema, severe pain on palpation",
        "Anoxic brain injury: persistent altered mental status"
      ]
    },
    medications: [
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces laryngeal and pharyngeal edema following strangulation injury. Used to prevent delayed airway compromise", sideEffects: "Hyperglycemia, insomnia, GI irritation", contra: "Active untreated infection (relative)", pearl: "Consider for patients with voice changes or dysphagia suggesting laryngeal edema. Serial airway assessments are essential even with steroid treatment—delayed edema can still develop." },
      { name: "Heparin Drip", type: "Anticoagulant", action: "Prevents clot propagation in carotid or vertebral artery dissection identified on CT angiography. Prevents stroke from dissection-related thromboembolism", sideEffects: "Bleeding, HIT, osteoporosis with long-term use", contra: "Active hemorrhagic stroke, uncontrolled bleeding, HIT history", pearl: "Transition to oral anticoagulation (warfarin or DOAC) once dissection confirmed. Duration typically 3-6 months. Monitor aPTT for heparin. Serial imaging to assess dissection healing." }
    ],
    pearls: [
      "Up to 50% of strangulation victims have NO visible external injuries—absence of marks does NOT mean absence of injury",
      "Strangulation is the STRONGEST single predictor of subsequent homicide in intimate partner violence—victims are 750% more likely to be killed",
      "Delayed laryngeal edema can cause fatal airway obstruction 24-48 hours after the event—patients need monitoring and education about return precautions",
      "Check for petechiae in hidden areas: conjunctivae, behind ears, scalp, inside mouth—these are often the only visible findings",
      "Loss of consciousness during strangulation occurs in as little as 10-15 seconds due to jugular vein occlusion and increased ICP",
      "Carotid artery dissection from strangulation can cause stroke hours to DAYS after the event—delayed neurological symptoms require immediate evaluation"
    ],
    quiz: [
      { question: "A patient presents after being strangled by a partner. The neck has no visible bruising. How should the nurse interpret this?", options: ["No injury likely occurred since there are no marks", "Up to 50% of strangulation victims have no visible external injuries—proceed with full assessment", "The patient is likely exaggerating the event", "Document absence of marks and discharge without further evaluation"], correct: 1, rationale: "Up to 50% of strangulation victims have no visible external injuries. The nurse must perform a comprehensive assessment including checking for petechiae (conjunctivae, behind ears), voice changes, dysphagia, and neurological symptoms regardless of external findings." },
      { question: "A strangulation patient develops hoarseness and mild stridor 18 hours after the event. What is the priority action?", options: ["Encourage voice rest and warm fluids", "Notify the provider immediately—this indicates laryngeal edema with potential airway compromise", "Administer acetaminophen for throat discomfort", "Document and reassess in 4 hours"], correct: 1, rationale: "Hoarseness with stridor indicates laryngeal edema, which can progress to complete airway obstruction. This is a time-sensitive emergency requiring immediate provider notification, airway preparedness, and likely imaging." },
      { question: "Why is strangulation considered the most significant risk factor for homicide in intimate partner violence?", options: ["Because it causes more physical injuries than other forms of violence", "Because research shows strangulation victims are 750% more likely to be subsequently killed by the perpetrator", "Because it is always accompanied by weapon use", "Because it only occurs in the most severe IPV cases"], correct: 1, rationale: "Research consistently demonstrates that non-fatal strangulation is the strongest single predictor of subsequent homicide in IPV. Victims are 750% more likely to be killed. This makes safety planning and intervention critical." }
    ]
  },

  "disaster-preparedness-rn": {
    title: "Disaster Preparedness & Mass Casualty Response",
    cellular: {
      title: "Disaster Nursing: Triage and Mass Casualty Principles",
      content: "Mass casualty incidents (MCIs) occur when the number of casualties exceeds available healthcare resources, requiring a shift from individual patient-centered care to utilitarian allocation of resources for the greatest good. The START (Simple Triage and Rapid Treatment) triage system categorizes patients in under 60 seconds based on respiratory rate, perfusion (radial pulse or capillary refill), and mental status (follows commands). Disaster phases include mitigation (prevention), preparedness (planning and training), response (acute event management), and recovery (restoration). In MCIs, the standard of care shifts from individual optimization to allocation-based decision making. The incident command system (ICS) provides a standardized organizational structure with defined roles: Incident Commander, Operations, Planning, Logistics, and Finance/Administration. Surge capacity refers to a healthcare facility's ability to expand beyond normal operations through space (additional treatment areas), staff (recall of off-duty personnel), and stuff (equipment and supply reserves). Crisis standards of care, activated during declared disasters, provide legal and ethical frameworks for resource allocation decisions, including ventilator triage protocols."
    },
    riskFactors: [
      "Natural disasters: earthquakes, hurricanes, tornados, floods, wildfires",
      "Terrorist events: bombings, chemical/biological/radiological/nuclear (CBRN) attacks",
      "Industrial accidents: chemical spills, nuclear plant incidents",
      "Mass shooting events",
      "Pandemic outbreaks",
      "Infrastructure failure: power grid collapse, water contamination",
      "Transportation incidents: plane crashes, train derailments"
    ],
    diagnostics: [
      "START triage assessment: respiratory rate, perfusion (radial pulse/capillary refill), mental status (follows commands)",
      "Triage categories: Red (Immediate), Yellow (Delayed), Green (Minor/Walking Wounded), Black (Expectant/Deceased)",
      "JumpSTART for pediatric triage (modified START for children)",
      "Chemical exposure assessment: identify agent using symptoms, CHEMPACK resources",
      "Radiation exposure: dosimetry, Geiger counter, symptom-based triage",
      "Surge capacity assessment: bed availability, staff availability, supply chain status"
    ],
    management: [
      "Activate hospital incident command system (HICS) and emergency operations plan",
      "Implement START triage at the scene and secondary triage at the facility",
      "Red (Immediate): life-threatening but salvageable—treated first",
      "Yellow (Delayed): serious but can wait hours—treated second",
      "Green (Minor): walking wounded—can self-treat or wait—treated last",
      "Black (Expectant): injuries incompatible with survival given available resources—comfort care only",
      "Decontamination BEFORE entry to facility for chemical, biological, or radiological exposure"
    ],
    nursingActions: [
      "Know your assigned role in the hospital emergency operations plan",
      "Perform rapid START triage: RPM (Respirations, Perfusion, Mental status) in <60 seconds per patient",
      "Tag patients with appropriate triage color using designated triage tags",
      "Set up treatment areas by acuity: Red area near trauma/OR, Yellow area in secondary spaces, Green in lobby/cafeteria",
      "Implement crisis standards of care when activated: focus on population-based outcomes",
      "Maintain accurate documentation even in chaos—disaster documentation forms, not standard charting",
      "Coordinate with incident command for resource needs and patient tracking",
      "Provide psychological first aid to patients, families, and colleagues",
      "Participate in regular disaster drills and training to maintain competency",
      "Self-care during and after disaster: recognize compassion fatigue and secondary traumatic stress"
    ],
    assessmentFindings: [
      "Multiple casualties arriving simultaneously overwhelming normal capacity",
      "Varying injury patterns based on disaster type (blast injuries, crush injuries, burns, chemical exposure)",
      "Psychological distress in victims, families, and healthcare workers",
      "Infrastructure damage affecting utilities, communication, and supply chains",
      "Potential for secondary events (aftershocks, secondary devices, structural collapse)"
    ],
    signs: {
      left: [
        "Red (Immediate): respiratory rate >30, absent radial pulse, cannot follow commands",
        "Yellow (Delayed): ambulatory difficulties but stable vital signs",
        "Green (Minor): walking wounded with non-life-threatening injuries",
        "Black (Expectant): apneic after positioning, incompatible injuries"
      ],
      right: [
        "Blast injuries: tympanic membrane rupture (marker of blast exposure), blast lung",
        "Crush syndrome: hyperkalemia, myoglobinuria, AKI from rhabdomyolysis",
        "Chemical exposure: cholinergic crisis (organophosphate), cyanosis (cyanide)",
        "Radiation exposure: nausea/vomiting (early), pancytopenia (delayed)"
      ]
    },
    medications: [
      { name: "Atropine", type: "Anticholinergic/Nerve Agent Antidote", action: "Blocks muscarinic receptors to reverse cholinergic crisis from organophosphate or nerve agent exposure: bronchorrhea, bronchospasm, bradycardia, salivation, lacrimation", sideEffects: "Tachycardia, dry mouth, urinary retention, mydriasis", contra: "None in nerve agent exposure (life-saving indication overrides)", pearl: "For nerve agent exposure: give 2mg IM every 5-10 minutes until secretions dry. May need large doses (10-20+ mg). Mark III autoinjector kits contain atropine 2mg + pralidoxime 600mg for field use." },
      { name: "Potassium Iodide (KI)", type: "Thyroid Blocking Agent", action: "Saturates the thyroid with stable iodine to prevent uptake of radioactive iodine-131 from nuclear incidents, reducing thyroid cancer risk", sideEffects: "GI upset, metallic taste, allergic reaction (rare), iodism with prolonged use", contra: "Iodine allergy, dermatitis herpetiformis", pearl: "Most effective if given within 4 hours of exposure, some benefit up to 24 hours. Dose: adults 130mg, children 3-18 yrs 65mg, infants 32mg. Only protects the thyroid—does not protect against other radiation effects." }
    ],
    pearls: [
      "START triage: RPM in <60 seconds—if respirations >30 or absent radial pulse or cannot follow commands = RED (Immediate)",
      "In disasters, the goal shifts from saving EVERY patient to saving the MOST patients—utilitarian ethics guide resource allocation",
      "Black (Expectant) triage does NOT mean abandonment—it means comfort care when injuries are incompatible with survival given available resources",
      "DECONTAMINATION must occur BEFORE patients enter the hospital—secondary contamination can disable the entire facility",
      "The most common cause of death in building collapse is NOT the initial event—it's crush syndrome (hyperkalemia) when weight is removed from crushed limbs",
      "Healthcare workers must be trained and drilled regularly—disaster response relies on practiced, automatic responses under extreme stress"
    ],
    quiz: [
      { question: "During mass casualty triage using START, a patient is not breathing. After repositioning the airway, the patient begins breathing. What triage color is assigned?", options: ["Green (Minor)", "Yellow (Delayed)", "Red (Immediate)", "Black (Expectant)"], correct: 2, rationale: "Per START triage, if a patient is apneic but begins breathing after airway repositioning, they are tagged Red (Immediate) because they have a salvageable life-threatening condition requiring immediate airway management." },
      { question: "In a mass casualty event, which patient is triaged as Yellow (Delayed)?", options: ["Patient with absent radial pulse and respiratory rate of 35", "Walking patient with a minor laceration", "Patient with a femur fracture, radial pulse present, follows commands", "Patient who is apneic after airway repositioning"], correct: 2, rationale: "Yellow (Delayed) patients have serious injuries but are hemodynamically stable enough to wait for treatment. A femur fracture with present radial pulse and mental status is a delayed priority—serious but can wait." },
      { question: "What is the FIRST action when contaminated patients begin arriving at the emergency department?", options: ["Triage patients by injury severity", "Activate the hospital decontamination protocol before patients enter the facility", "Begin treating the most critical patients immediately", "Contact the CDC for identification of the contaminant"], correct: 1, rationale: "Decontamination MUST occur before patients enter the facility to prevent secondary contamination of staff, other patients, and the hospital environment. This is the first priority even before triage." }
    ]
  },

  "mandatory-reporting-rn": {
    title: "Mandatory Reporting: Abuse, Neglect & Communicable Disease",
    cellular: {
      title: "Legal and Ethical Framework for Mandatory Reporting",
      content: "Mandatory reporting laws require designated professionals—including all registered nurses—to report suspected abuse, neglect, and certain communicable diseases to appropriate authorities. These laws exist to protect vulnerable populations who cannot protect themselves: children, elderly adults, dependent adults, and individuals with disabilities. The legal standard for reporting is reasonable suspicion, not confirmed proof. The nurse is not required to investigate or prove abuse—only to report when assessment findings raise reasonable concern. Failure to report is a criminal offense in most jurisdictions. Reporters acting in good faith are protected from civil and criminal liability by statutory immunity provisions. The ethical framework supporting mandatory reporting balances patient autonomy and confidentiality against the duty to protect vulnerable populations (beneficence and non-maleficence). HIPAA permits disclosure of protected health information without patient consent for mandatory reporting purposes. Communicable disease reporting to public health authorities enables disease surveillance, outbreak detection, contact tracing, and population-level prevention interventions."
    },
    riskFactors: [
      "Children with unexplained injuries, fractures in different stages of healing, failure to thrive",
      "Elderly adults with signs of neglect, financial exploitation, or caregiver-inflicted injury",
      "Patients with disabilities in care settings showing signs of abuse",
      "Intimate partner violence (mandatory reporting varies by state)",
      "Suspicious injury patterns inconsistent with reported mechanism",
      "Caregiver preventing patient from speaking privately with healthcare providers",
      "Patients diagnosed with reportable communicable diseases (TB, HIV, STIs, hepatitis)"
    ],
    diagnostics: [
      "Physical assessment for injury patterns suggestive of abuse: patterned injuries, injuries in different healing stages, unexplained fractures",
      "Nutritional assessment for signs of neglect: cachexia, dehydration, poor hygiene",
      "Developmental screening in children: regression, fearfulness, inappropriate sexual knowledge",
      "Laboratory studies: STI screening, skeletal survey in infants, toxicology",
      "Mental health assessment: depression, anxiety, PTSD, suicidal ideation in abuse victims",
      "Communicable disease confirmatory testing: cultures, PCR, serology"
    ],
    management: [
      "Report suspected abuse to appropriate agency: child protective services (CPS), adult protective services (APS), or law enforcement",
      "Report to the charge nurse and chain of command per institutional policy",
      "Report communicable diseases to local public health department per jurisdiction requirements",
      "Document findings objectively: describe injuries, use direct quotes, avoid subjective interpretation",
      "Ensure immediate safety of the patient—arrange safe discharge if returning to abusive situation is dangerous",
      "Provide referrals: victim advocacy, social work, counseling, legal resources"
    ],
    nursingActions: [
      "Know your state's mandatory reporting requirements: what is reportable, to whom, and within what timeframe",
      "Report based on REASONABLE SUSPICION—you are not required to prove abuse before reporting",
      "Document objective findings: size, shape, color, location of injuries using body maps and photographs",
      "Use direct quotes when documenting patient statements about how injuries occurred",
      "Separate patient from suspected perpetrator before interviewing",
      "Know the reporting hotline numbers: National Child Abuse Hotline (1-800-422-4453), Adult Protective Services",
      "File the report yourself—do not delegate mandatory reporting responsibility",
      "Maintain patient confidentiality except as legally required for mandatory reporting",
      "Support the patient: provide resources, safety planning, and emotional support",
      "Understand that good-faith reporting provides statutory immunity from liability"
    ],
    assessmentFindings: [
      "Child abuse indicators: injuries in non-ambulatory infants, patterned burns, spiral fractures, retinal hemorrhages",
      "Elder abuse indicators: malnutrition, dehydration, untreated medical conditions, unexplained bruising",
      "Neglect indicators: poor hygiene, inappropriate clothing, unsafe living conditions, medication non-compliance due to caregiver failure",
      "Financial exploitation: unexplained changes in financial documents, caregiver controlling finances",
      "Discrepancy between injury pattern and reported mechanism"
    ],
    signs: {
      left: [
        "Unexplained injuries or injuries inconsistent with history",
        "Multiple injuries in various stages of healing",
        "Patterned injuries suggesting specific objects",
        "Failure to thrive or signs of neglect"
      ],
      right: [
        "Fear of caregiver or reluctance to go home",
        "Caregiver providing inconsistent history",
        "Delay in seeking medical care for injuries",
        "Child displaying age-inappropriate sexual knowledge"
      ]
    },
    medications: [],
    pearls: [
      "Report based on REASONABLE SUSPICION—not proof. The investigating agency determines if abuse occurred, not the nurse",
      "Failure to report suspected abuse is a CRIMINAL offense in most jurisdictions",
      "Good-faith reporters are PROTECTED from liability by statutory immunity—you cannot be successfully sued for reporting in good faith",
      "HIPAA permits disclosure for mandatory reporting—patient consent is NOT required",
      "Spiral fractures in children under 2 years who are not yet walking are highly suspicious for non-accidental trauma",
      "The most common perpetrator of child abuse is a parent or caregiver—do not be dissuaded by a 'normal-appearing' family"
    ],
    quiz: [
      { question: "A nurse suspects child abuse based on assessment findings. The nurse is uncertain and wants to wait for more evidence before reporting. What should the nurse do?", options: ["Wait for additional evidence before making a report", "Report immediately—the legal standard is reasonable suspicion, not proof", "Discuss suspicions with the child's parents first", "Ask a colleague to confirm findings before reporting"], correct: 1, rationale: "Mandatory reporting requires reporting based on reasonable suspicion, not confirmed proof. The nurse is obligated to report immediately. The investigating agency (CPS) is responsible for determining if abuse occurred." },
      { question: "A nurse reports suspected elder abuse in good faith, but the investigation finds no evidence of abuse. Can the nurse be held liable?", options: ["Yes, the nurse can be sued for defamation", "No, good-faith reporters are protected by statutory immunity", "Yes, if the report causes emotional distress to the accused", "Only if the nurse was incorrect about the findings"], correct: 1, rationale: "Mandatory reporting statutes include immunity provisions that protect reporters acting in good faith from civil and criminal liability, even if the investigation does not substantiate abuse." },
      { question: "Which of the following is a mandatory reporting requirement in ALL states?", options: ["Intimate partner violence in adult patients", "Suspected child abuse and neglect", "All emergency department visits for injuries", "Mental health diagnoses"], correct: 1, rationale: "All 50 states and US territories have mandatory reporting laws for suspected child abuse and neglect. Healthcare workers, including nurses, are mandated reporters in every jurisdiction. IPV reporting requirements for adults vary by state." }
    ]
  }
};
